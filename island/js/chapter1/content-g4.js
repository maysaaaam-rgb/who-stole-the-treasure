/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Curriculum Content: GRADE 4
   Unit 1: "Classroom Rules" (Global Reading 3 & MEB Maarif Model)
   All English lines, audio IDs, illustrated `.webp` pictures, answers,
   distractors, and hints.
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var CH1_CONTENT_G4 = {
    grade: 4,
    chapterId: 'ch1_harbour',
    chapterTitle: 'Chapter 1: Admiral Benbow Harbour',
    themeTitle: 'Unit 1 · Classroom Rules (Global Reading 3)',
    stops: [
      /* ──────────────────────────────────────────────────────────
         STOP 1: Benbow Inn Door — Asking & Giving Permission
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 1,
        clueId: 'g4_c1',
        stopName: 'Benbow Inn Door',
        title: 'Clue 1: Ask Billy Bones to Enter',
        bookPage: 'Global Reading 3, Unit 1, p. ___',
        npc: { id: 'billy', name: 'Billy Bones', art: 'c_billy', happy: 'c_billy_happy' },
        companion: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        introLine: "Knock, knock! Ask me politely for permission at the Admiral Benbow Inn door to earn your first golden map stamp!",
        introLineId: 'g4_s1_billy_intro',
        flintWord: "Can I come in? May I come in? Yes, you can! Sure! Sorry, not right now.",
        flintLineId: 'g4_s1_flint_01',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g4_s1_r1',
            speaker: 'Jim Hawkins',
            promptIcon: '🚪✊',
            promptImg: 'art/flat/o_door_open.webp',
            promptText: 'Knock on the Benbow Inn door! Ask Billy Bones politely to come in:',
            speakText: 'Ask politely: May I come in? Yes, you can!',
            lineId: 'g4_s1_jim_01',
            slowText: 'May ... I ... come ... in?',
            hint: 'Look for the open door 🚪👋: "May I come in?"',
            correct: { text: 'May I come in?', icon: '🚪👋', img: 'art/flat/o_door_open.webp', speak: 'May I come in?' },
            options: [
              { text: 'May I come in?', icon: '🚪👋', img: 'art/flat/o_door_open.webp', speak: 'May I come in?' },
              { text: 'Fifty barrels!', icon: '🛢️50', img: 'art/flat/o_barrel_dock.webp', speak: 'Fifty barrels!' },
              { text: 'Close your book.', icon: '📕🔒', img: 'art/flat/cmd_close_book.webp', speak: 'Close your book.' }
            ]
          },
          {
            id: 'g4_s1_r2',
            speaker: 'Billy Bones',
            promptIcon: '✅😊',
            promptImg: 'art/flat/c_billy_happy.webp',
            promptText: 'You ask: "Can I come in?" Billy Bones smiles and opens the door! What does he say?',
            speakText: 'Can I come in? Yes, you can! Come in, please!',
            lineId: 'g4_s1_billy_01',
            slowText: 'Yes, ... you ... can!',
            hint: 'Look for smiling Billy Bones ✅😊: "Yes, you can. / Sure!"',
            correct: { text: 'Yes, you can. / Sure!', icon: '✅😊', img: 'art/flat/c_billy_happy.webp', speak: 'Yes, you can! Sure!' },
            options: [
              { text: 'Yes, you can. / Sure!', icon: '✅😊', img: 'art/flat/c_billy_happy.webp', speak: 'Yes, you can! Sure!' },
              { text: 'Pass the ruler, please.', icon: '📏🤲', img: 'art/flat/o_ruler.webp', speak: 'Pass the ruler, please.' },
              { text: 'Thirty-five ships.', icon: '⛵35', img: 'art/flat/o_hispaniola.webp', speak: 'Thirty-five ships.' }
            ]
          },
          {
            id: 'g4_s1_r3',
            speaker: 'Billy Bones',
            promptIcon: '⏳🚪',
            promptImg: 'art/z4/w_rain.webp',
            promptText: 'You ask: "Can I go out?" It is raining hard outside! How does Billy decline politely?',
            speakText: 'Can I go out? Sorry, not right now.',
            lineId: 'g4_s1_billy_02',
            slowText: 'Sorry, ... not ... right ... now.',
            hint: 'Look for the rainy sky ⏳🌧️: "Sorry, not right now."',
            correct: { text: 'Sorry, not right now.', icon: '⏳🙏', img: 'art/z4/w_rain.webp', speak: 'Sorry, not right now.' },
            options: [
              { text: 'Sorry, not right now.', icon: '⏳🙏', img: 'art/z4/w_rain.webp', speak: 'Sorry, not right now.' },
              { text: 'Here you are.', icon: '🤲🎁', img: 'art/flat/o_gift.webp', speak: 'Here you are.' },
              { text: 'Look at the board.', icon: '👀📋', img: 'art/flat/cmd_look_board.webp', speak: 'Look at the board.' }
            ]
          },
          {
            id: 'g4_s1_r4',
            speaker: 'Jim Hawkins',
            promptIcon: '💡🕯️',
            promptImg: 'art/flat/o_lantern.webp',
            promptText: 'The inn room is dark! Ask permission to turn on the light:',
            speakText: 'Can I turn on the light? Of course!',
            lineId: 'g4_s1_jim_02',
            slowText: 'Can I ... turn on ... the light?',
            hint: 'Look for the glowing lantern 💡: "Can I turn on the light?"',
            correct: { text: 'Can I turn on the light?', icon: '💡✨', img: 'art/flat/o_lantern.webp', speak: 'Can I turn on the light?' },
            options: [
              { text: 'Can I turn on the light?', icon: '💡✨', img: 'art/flat/o_lantern.webp', speak: 'Can I turn on the light?' },
              { text: 'Give me the pencil.', icon: '✏️🤲', img: 'art/flat/cmd_take_pencil.webp', speak: 'Give me the pencil.' },
              { text: 'Twenty-four gulls.', icon: '🐦24', img: 'art/flat/o_bird.webp', speak: 'Twenty-four gulls.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s1_star1',
            promptIcon: '🚪👋',
            promptImg: 'art/flat/o_door_open.webp',
            promptText: 'Order the words to ask Billy Bones for permission to enter:',
            speakText: 'May I come in, please?',
            lineId: 'g4_s1_star_01',
            targetSentence: 'May I come in, please?',
            words: ['May', 'I', 'come', 'in,', 'please?'],
            distractors: ['ruler'],
            allowSpeak: true,
            hint: 'Start with "May I", then "come in, please?"'
          },
          {
            id: 'g4_s1_star2',
            promptIcon: '✅😊',
            promptImg: 'art/flat/c_billy_happy.webp',
            promptText: 'Order Billy Bones\'s polite answer:',
            speakText: 'Yes, you can. Come in, please!',
            lineId: 'g4_s1_star_02',
            targetSentence: 'Yes, you can.',
            words: ['Yes,', 'you', 'can.'],
            distractors: ['board'],
            allowSpeak: true,
            hint: 'Put in order: "Yes," -> "you" -> "can."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 2: Harbour Crates — Polite Requests
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 2,
        clueId: 'g4_c2',
        stopName: 'Harbour Supply Crates',
        title: 'Clue 2: Hand Jim What He Asks For',
        bookPage: 'Global Reading 3, Unit 1, p. ___',
        npc: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'billy', name: 'Billy Bones', art: 'c_billy', happy: 'c_billy_happy' },
        introLine: "We are packing the harbour crates! Listen to my polite request and hand me the right item. Tap 'Say that again, please' anytime!",
        introLineId: 'g4_s2_jim_intro',
        flintWord: "Give me the map, please! Here you are. Thank you! You're welcome! Say that again, please.",
        flintLineId: 'g4_s2_flint_01',
        easyEngine: 'dragMatch',
        starEngine: 'wordOrder',
        replayLabel: '🔁 Say that again, please!',
        slowLabel: '🐢 Slowly, please!',
        pairs: [
          {
            id: 'g4_s2_p1',
            prompt: 'Jim: "Give me the map, please." — Billy: "Here you are!"',
            speak: 'Give me the map, please. Here you are!',
            leftIcon: '🗺️🧭',
            leftImg: 'art/flat/o_map_scroll.webp',
            leftLabel: 'the map',
            rightIcon: '🤲🗺️',
            rightImg: 'art/flat/o_map_piece1.webp',
            rightLabel: 'Give me the map, please.'
          },
          {
            id: 'g4_s2_p2',
            prompt: 'Jim: "Give me the book, please." — Billy: "Here you are!"',
            speak: 'Give me the book, please. Here you are!',
            leftIcon: '📘📖',
            leftImg: 'art/flat/o_book.webp',
            leftLabel: 'the book',
            rightIcon: '🤲📘',
            rightImg: 'art/flat/cmd_open_book.webp',
            rightLabel: 'Give me the book, please.'
          },
          {
            id: 'g4_s2_p3',
            prompt: 'Jim: "Pass the ruler, please." — Billy: "Here you are!"',
            speak: 'Pass the ruler, please. Here you are!',
            leftIcon: '📏✨',
            leftImg: 'art/flat/o_ruler.webp',
            leftLabel: 'the ruler',
            rightIcon: '🤲📏',
            rightImg: 'art/flat/o_ruler.webp',
            rightLabel: 'Pass the ruler, please.'
          },
          {
            id: 'g4_s2_p4',
            prompt: 'Jim: "Give me the pencil, please." — Billy: "Thank you! You\'re welcome!"',
            speak: "Give me the pencil, please. Here you are! Thank you! You're welcome!",
            leftIcon: '✏️📝',
            leftImg: 'art/flat/cmd_take_pencil.webp',
            leftLabel: 'the pencil',
            rightIcon: '🤲✏️',
            rightImg: 'art/flat/cmd_write_name.webp',
            rightLabel: 'Give me the pencil, please.'
          }
        ],
        starTasks: [
          {
            id: 'g4_s2_star1',
            promptIcon: '🗺️🤲',
            promptImg: 'art/flat/o_map_scroll.webp',
            promptText: 'Order Jim\'s polite request for the treasure map:',
            speakText: 'Give me the map, please.',
            lineId: 'g4_s2_star_01',
            targetSentence: 'Give me the map, please.',
            words: ['Give', 'me', 'the', 'map,', 'please.'],
            distractors: ['window'],
            allowSpeak: true,
            hint: 'Start with "Give me", then "the map, please."'
          },
          {
            id: 'g4_s2_star2',
            promptIcon: '📏🤲',
            promptImg: 'art/flat/o_ruler.webp',
            promptText: 'Order the polite request for the ruler:',
            speakText: 'Pass the ruler, please.',
            lineId: 'g4_s2_star_02',
            targetSentence: 'Pass the ruler, please.',
            words: ['Pass', 'the', 'ruler,', 'please.'],
            distractors: ['door'],
            allowSpeak: true,
            hint: 'Start with "Pass", then "the ruler, please."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 3: Ship Wheel — "Flint Says" Classroom Instructions (TPR)
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 3,
        clueId: 'g4_c3',
        stopName: 'The Ship Wheel',
        title: "Clue 3: Follow Captain Flint's Orders",
        bookPage: 'Global Reading 3, Unit 1, p. ___',
        npc: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        companion: { id: 'benbow', name: 'Benbow the Leopard', art: 'c_benbow', happy: 'c_benbow_happy' },
        introLine: "Squawk! Welcome to 'Flint Says' at the Ship Wheel! Listen to my classroom order and make your monster do the action!",
        introLineId: 'g4_s3_flint_intro',
        flintWord: "Flint says: Look at the board! Open the door! Close the door! Open the window! Be quiet! Come in, please! Go back to your place!",
        flintLineId: 'g4_s3_flint_01',
        easyEngine: 'flintSays',
        starEngine: 'wordOrder',
        orders: [
          {
            id: 'g4_s3_o1',
            command: 'Look at the board, please!',
            speak: 'Flint says: Look at the board, please!',
            slowSpeak: 'Look ... at ... the ... board, ... please!',
            icon: '👀📋',
            img: 'art/flat/cmd_look_board.webp',
            monsterAction: 'look',
            hint: 'Tap the board picture 👀📋: "Look at the board, please!"',
            options: [
              { text: 'Look at the board, please!', icon: '👀📋', img: 'art/flat/cmd_look_board.webp', speak: 'Look at the board, please!' },
              { text: 'Close the door, please!', icon: '🚪🔒', img: 'art/flat/o_door_closed.webp', speak: 'Close the door, please!' },
              { text: 'Be quiet, please!', icon: '🤫🔇', img: 'art/flat/o_quiet_shh.webp', speak: 'Be quiet, please!' }
            ]
          },
          {
            id: 'g4_s3_o2',
            command: 'Open the door, please!',
            speak: 'Flint says: Open the door, please!',
            slowSpeak: 'Open ... the ... door, ... please!',
            icon: '🚪🔓',
            img: 'art/flat/o_door_open.webp',
            monsterAction: 'open',
            hint: 'Tap the open door picture 🚪🔓: "Open the door, please!"',
            options: [
              { text: 'Open the door, please!', icon: '🚪🔓', img: 'art/flat/o_door_open.webp', speak: 'Open the door, please!' },
              { text: 'Go back to your place!', icon: '🪑🚶', img: 'art/flat/cmd_sit_down.webp', speak: 'Go back to your place!' },
              { text: 'Look at the board, please!', icon: '👀📋', img: 'art/flat/cmd_look_board.webp', speak: 'Look at the board, please!' }
            ]
          },
          {
            id: 'g4_s3_o3',
            command: 'Be quiet, please!',
            speak: 'Flint says: Be quiet, please!',
            slowSpeak: 'Be ... quiet, ... please!',
            icon: '🤫🔇',
            img: 'art/flat/o_quiet_shh.webp',
            monsterAction: 'quiet',
            hint: 'Tap the quiet shhh picture 🤫🔇: "Be quiet, please!"',
            options: [
              { text: 'Be quiet, please!', icon: '🤫🔇', img: 'art/flat/o_quiet_shh.webp', speak: 'Be quiet, please!' },
              { text: 'Open the window, please!', icon: '🪟🌬️', img: 'art/flat/o_window_open.webp', speak: 'Open the window, please!' },
              { text: 'Open the door, please!', icon: '🚪🔓', img: 'art/flat/o_door_open.webp', speak: 'Open the door, please!' }
            ]
          },
          {
            id: 'g4_s3_o4',
            command: 'Open the window, please!',
            speak: 'Flint says: Open the window, please!',
            slowSpeak: 'Open ... the ... window, ... please!',
            icon: '🪟🌬️',
            img: 'art/flat/o_window_open.webp',
            monsterAction: 'window',
            hint: 'Tap the open window picture 🪟🌬️: "Open the window, please!"',
            options: [
              { text: 'Open the window, please!', icon: '🪟🌬️', img: 'art/flat/o_window_open.webp', speak: 'Open the window, please!' },
              { text: 'Close the door, please!', icon: '🚪🔒', img: 'art/flat/o_door_closed.webp', speak: 'Close the door, please!' },
              { text: 'Be quiet, please!', icon: '🤫🔇', img: 'art/flat/o_quiet_shh.webp', speak: 'Be quiet, please!' }
            ]
          },
          {
            id: 'g4_s3_o5',
            command: 'Go back to your place, please!',
            speak: 'Flint says: Go back to your place, please!',
            slowSpeak: 'Go ... back ... to ... your ... place, ... please!',
            icon: '🪑🚶',
            img: 'art/flat/cmd_sit_down.webp',
            monsterAction: 'seat',
            hint: 'Tap the desk seat picture 🪑🚶: "Go back to your place, please!"',
            options: [
              { text: 'Go back to your place, please!', icon: '🪑🚶', img: 'art/flat/cmd_sit_down.webp', speak: 'Go back to your place, please!' },
              { text: 'Open the door, please!', icon: '🚪🔓', img: 'art/flat/o_door_open.webp', speak: 'Open the door, please!' },
              { text: 'Look at the board, please!', icon: '👀📋', img: 'art/flat/cmd_look_board.webp', speak: 'Look at the board, please!' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s3_star1',
            promptIcon: '👀📋',
            promptImg: 'art/flat/cmd_look_board.webp',
            promptText: "Order Captain Flint's classroom instruction:",
            speakText: 'Look at the board, please.',
            targetSentence: 'Look at the board, please.',
            words: ['Look', 'at', 'the', 'board,', 'please.'],
            distractors: ['fifty'],
            allowSpeak: true,
            hint: 'Put in order: "Look at the board, please."'
          },
          {
            id: 'g4_s3_star2',
            promptIcon: '🪑🚶',
            promptImg: 'art/flat/cmd_sit_down.webp',
            promptText: "Order Captain Flint's instruction to return to your seat:",
            speakText: 'Go back to your place.',
            targetSentence: 'Go back to your place.',
            words: ['Go', 'back', 'to', 'your', 'place.'],
            distractors: ['pencil'],
            allowSpeak: true,
            hint: 'Put in order: "Go back to your place."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 4: Brass Telescope — Numbers 1 to 50
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 4,
        clueId: 'g4_c4',
        stopName: 'The Brass Telescope',
        title: 'Clue 4: Count Ships & Barrels (1–50)',
        bookPage: 'Global Reading 3, Unit 1, p. ___',
        npc: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        introLine: "Look through the brass telescope! Count the ships, barrels, and sea gulls in the harbour from 1 to 50, then tap the number!",
        introLineId: 'g4_s4_jim_intro',
        flintWord: "Count with me! Ten, twenty, twenty-five, thirty, thirty-six, forty, fifty!",
        flintLineId: 'g4_s4_flint_01',
        easyEngine: 'countTap',
        starEngine: 'wordOrder',
        countRounds: [
          {
            id: 'g4_s4_c1',
            title: 'Count the Harbour Barrels!',
            speak: 'How many barrels are on the dock? Two crates of ten plus four barrels equals twenty-four barrels!',
            slowSpeak: 'Twenty ... four ... barrels!',
            tensCount: 2,
            tensLabel: '×10',
            tensImg: 'art/flat/o_crate.webp',
            onesCount: 4,
            onesIcon: '🛢️',
            onesImg: 'art/flat/o_barrel_dock.webp',
            itemNoun: 'barrels',
            targetNumber: 24,
            targetWord: 'twenty-four',
            hint: '2 tens (20) + 4 ones = 24 (twenty-four)!',
            options: [
              { num: 24, word: 'twenty-four', icon: '🛢️ 24', img: 'art/flat/o_barrel_dock.webp' },
              { num: 14, word: 'fourteen', icon: '🛢️ 14', img: 'art/flat/o_barrel_dock.webp' },
              { num: 42, word: 'forty-two', icon: '🛢️ 42', img: 'art/flat/o_barrel_dock.webp' }
            ]
          },
          {
            id: 'g4_s4_c2',
            title: 'Count the Sea Gulls!',
            speak: 'How many sea gulls are flying over the Hispaniola? Three flocks of ten plus five equals thirty-five sea gulls!',
            slowSpeak: 'Thirty ... five ... sea gulls!',
            tensCount: 3,
            tensLabel: '×10',
            tensImg: 'art/flat/o_bird.webp',
            onesCount: 5,
            onesIcon: '🐦',
            onesImg: 'art/flat/o_bird.webp',
            itemNoun: 'sea gulls',
            targetNumber: 35,
            targetWord: 'thirty-five',
            hint: '3 tens (30) + 5 ones = 35 (thirty-five)!',
            options: [
              { num: 35, word: 'thirty-five', icon: '🐦 35', img: 'art/flat/o_bird.webp' },
              { num: 25, word: 'twenty-five', icon: '🐦 25', img: 'art/flat/o_bird.webp' },
              { num: 45, word: 'forty-five', icon: '🐦 45', img: 'art/flat/o_bird.webp' }
            ]
          },
          {
            id: 'g4_s4_c3',
            title: 'Count the Harbour Lanterns!',
            speak: 'How many glowing lanterns are on the pier? Four rows of ten plus eight equals forty-eight lanterns!',
            slowSpeak: 'Forty ... eight ... lanterns!',
            tensCount: 4,
            tensLabel: '×10',
            tensImg: 'art/flat/o_lantern.webp',
            onesCount: 8,
            onesIcon: '🏮',
            onesImg: 'art/flat/o_lantern.webp',
            itemNoun: 'lanterns',
            targetNumber: 48,
            targetWord: 'forty-eight',
            hint: '4 tens (40) + 8 ones = 48 (forty-eight)!',
            options: [
              { num: 48, word: 'forty-eight', icon: '🏮 48', img: 'art/flat/o_lantern.webp' },
              { num: 38, word: 'thirty-eight', icon: '🏮 38', img: 'art/flat/o_lantern.webp' },
              { num: 18, word: 'eighteen', icon: '🏮 18', img: 'art/flat/o_lantern.webp' }
            ]
          },
          {
            id: 'g4_s4_c4',
            title: 'Count Captain Flint\'s Gold Coins!',
            speak: 'How many gold coins are in the pouch? Five stacks of ten equals fifty gold coins!',
            slowSpeak: 'Fifty ... gold ... coins!',
            tensCount: 5,
            tensLabel: '×10',
            tensImg: 'art/flat/o_treasure_gold.webp',
            onesCount: 0,
            onesIcon: '🪙',
            onesImg: 'art/flat/u_coin.webp',
            itemNoun: 'gold coins',
            targetNumber: 50,
            targetWord: 'fifty',
            hint: '5 stacks of 10 = 50 (fifty)!',
            options: [
              { num: 50, word: 'fifty', icon: '🪙 50', img: 'art/flat/o_treasure_gold.webp' },
              { num: 15, word: 'fifteen', icon: '🪙 15', img: 'art/flat/u_coin.webp' },
              { num: 40, word: 'forty', icon: '🪙 40', img: 'art/flat/u_coin.webp' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g4_s4_star1',
            promptIcon: '🐦35',
            promptImg: 'art/flat/o_bird.webp',
            promptText: 'Order the sentence to count the thirty-five sea gulls:',
            speakText: 'There are thirty-five sea gulls.',
            targetSentence: 'There are thirty-five sea gulls.',
            words: ['There', 'are', 'thirty-five', 'sea', 'gulls.'],
            distractors: ['door'],
            allowSpeak: true,
            hint: 'Put in order: "There are thirty-five sea gulls."'
          },
          {
            id: 'g4_s4_star2',
            promptIcon: '🪙50',
            promptImg: 'art/flat/o_treasure_gold.webp',
            promptText: 'Order the sentence for fifty gold coins:',
            speakText: 'There are fifty gold coins.',
            targetSentence: 'There are fifty gold coins.',
            words: ['There', 'are', 'fifty', 'gold', 'coins.'],
            distractors: ['quiet'],
            allowSpeak: true,
            hint: 'Put in order: "There are fifty gold coins."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 5: Billy Bones's Sea Chest — Number Lock (1–50) + Review
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 5,
        clueId: 'g4_c5',
        stopName: "Billy Bones's Sea Chest",
        title: 'Clue 5: Set the Brass Number Lock & Review',
        bookPage: 'Global Reading 3, Unit 1, p. ___',
        npc: { id: 'billy', name: 'Billy Bones', art: 'c_billy', happy: 'c_billy_happy' },
        companion: { id: 'benbow', name: 'Benbow the Leopard', art: 'c_benbow', happy: 'c_benbow_happy' },
        introLine: "Listen to the three secret numbers between 1 and 50 to unlock my brass dial lock, ask permission to open the chest, and finish the harbour review!",
        introLineId: 'g4_s5_billy_intro',
        flintWord: "Set the dial lock to: eighteen, thirty-five, fifty! Can I open the chest? Yes, you can!",
        flintLineId: 'g4_s5_flint_01',
        easyEngine: 'dialLock',
        starEngine: 'dialLock',
        lockImg: 'art/flat/o_billy_chest.webp',
        lockCode: [
          { dial: 1, number: 18, word: 'eighteen',    img: 'art/flat/o_compass.webp', options: [12, 18, 28, 48] },
          { dial: 2, number: 35, word: 'thirty-five', img: 'art/flat/o_compass.webp', options: [15, 25, 35, 45] },
          { dial: 3, number: 50, word: 'fifty',       img: 'art/flat/o_compass.webp', options: [15, 30, 40, 50] }
        ],
        lockSpeak: 'Listen carefully! Turn the three brass dials to: eighteen ... thirty-five ... fifty!',
        lockSlowSpeak: 'First dial: eighteen. ... Second dial: thirty-five. ... Third dial: fifty.',
        permissionStep: {
          promptIcon: '🗝️🧰',
          promptImg: 'art/flat/o_billy_chest.webp',
          promptText: 'The brass dials clicked! Now ask Billy Bones politely to open the sea chest:',
          speakText: 'Can I open the chest, please? Yes, you can!',
          correct: { text: 'Can I open the chest, please?', icon: '🗝️🧰', img: 'art/flat/o_billy_chest.webp', speak: 'Can I open the chest, please?' },
          options: [
            { text: 'Can I open the chest, please?', icon: '🗝️🧰', img: 'art/flat/o_billy_chest.webp', speak: 'Can I open the chest, please?' },
            { text: 'Close the window, please.', icon: '🪟🔒', img: 'art/flat/o_window_open.webp', speak: 'Close the window, please.' },
            { text: 'Fourteen pencils.', icon: '✏️14', img: 'art/flat/cmd_take_pencil.webp', speak: 'Fourteen pencils.' }
          ]
        },
        reviewRounds: [
          {
            id: 'g4_s5_rev1',
            speaker: 'Billy Bones',
            promptIcon: '🚪👋',
            promptImg: 'art/flat/o_door_open.webp',
            promptText: 'Review 1/4: How do you politely ask to come in?',
            speakText: 'May I come in? Yes, you can!',
            hint: 'Tap "May I come in?" 🚪👋',
            correct: { text: 'May I come in?', icon: '🚪👋', img: 'art/flat/o_door_open.webp', speak: 'May I come in?' },
            options: [
              { text: 'May I come in?', icon: '🚪👋', img: 'art/flat/o_door_open.webp', speak: 'May I come in?' },
              { text: 'Here you are.', icon: '🤲🎁', img: 'art/flat/o_gift.webp', speak: 'Here you are.' },
              { text: 'Fifty barrels.', icon: '🛢️50', img: 'art/flat/o_barrel_dock.webp', speak: 'Fifty barrels.' }
            ]
          },
          {
            id: 'g4_s5_rev2',
            speaker: 'Jim Hawkins',
            promptIcon: '🗺️🤲',
            promptImg: 'art/flat/o_map_scroll.webp',
            promptText: 'Review 2/4: Ask politely for the treasure map:',
            speakText: 'Give me the map, please.',
            hint: 'Tap "Give me the map, please." 🗺️🤲',
            correct: { text: 'Give me the map, please.', icon: '🗺️🤲', img: 'art/flat/o_map_scroll.webp', speak: 'Give me the map, please.' },
            options: [
              { text: 'Give me the map, please.', icon: '🗺️🤲', img: 'art/flat/o_map_scroll.webp', speak: 'Give me the map, please.' },
              { text: 'Sorry, not right now.', icon: '⏳🙏', img: 'art/z4/w_rain.webp', speak: 'Sorry, not right now.' },
              { text: 'Be quiet, please.', icon: '🤫🔇', img: 'art/flat/o_quiet_shh.webp', speak: 'Be quiet, please.' }
            ]
          },
          {
            id: 'g4_s5_rev3',
            speaker: 'Captain Flint',
            promptIcon: '👀📋',
            promptImg: 'art/flat/cmd_look_board.webp',
            promptText: 'Review 3/4: Flint says: Look at the board, please!',
            speakText: 'Look at the board, please!',
            hint: 'Tap "Look at the board, please!" 👀📋',
            correct: { text: 'Look at the board, please!', icon: '👀📋', img: 'art/flat/cmd_look_board.webp', speak: 'Look at the board, please!' },
            options: [
              { text: 'Look at the board, please!', icon: '👀📋', img: 'art/flat/cmd_look_board.webp', speak: 'Look at the board, please!' },
              { text: 'Pass the ruler, please.', icon: '📏🤲', img: 'art/flat/o_ruler.webp', speak: 'Pass the ruler, please.' },
              { text: 'Twenty-four ships.', icon: '⛵24', img: 'art/flat/o_hispaniola.webp', speak: 'Twenty-four ships.' }
            ]
          },
          {
            id: 'g4_s5_rev4',
            speaker: 'Billy Bones',
            promptIcon: '🪙50',
            promptImg: 'art/flat/o_treasure_gold.webp',
            promptText: 'Review 4/4: Which number is "fifty"?',
            speakText: 'Find the number fifty!',
            hint: '5 tens = 50 (fifty) 🪙!',
            correct: { text: '50 — fifty', icon: '🪙50', img: 'art/flat/o_treasure_gold.webp', speak: 'Fifty!' },
            options: [
              { text: '50 — fifty', icon: '🪙50', img: 'art/flat/o_treasure_gold.webp', speak: 'Fifty!' },
              { text: '15 — fifteen', icon: '🪙15', img: 'art/flat/u_coin.webp', speak: 'Fifteen!' },
              { text: '35 — thirty-five', icon: '🪙35', img: 'art/flat/u_coin.webp', speak: 'Thirty-five!' }
            ]
          }
        ]
      }
    ]
  };

  root.CH1_CONTENT_G4 = CH1_CONTENT_G4;
})(typeof window !== 'undefined' ? window : this);
