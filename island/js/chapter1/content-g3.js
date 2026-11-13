/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Curriculum Content: GRADE 3
   Macmillan Global Readings 2 · Unit 1: "What Does It Do?" (pp. 8–23)
   Texts: "The After-School Inventor" (Clara Doodle) & "My Good Ideas Book"
   Vocab: invent, invention, try again, change, mirror, mess, machine,
          problem, solution, plan, improve, parachute, hexagon, eraser, tidy
   Phonics: cl- blend (Clara, clock, clean, classroom, climb, cloud)
   Grammar: "What does it do? It cleans...", Sequence (First, Second, Third, Last), Purpose (to + verb)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var CH1_CONTENT_G3 = {
    grade: 3,
    chapterId: 'ch1_harbour',
    chapterTitle: 'Chapter 1: Admiral Benbow Harbour',
    themeTitle: 'Global Readings 2 · Unit 1: What Does It Do?',
    stops: [
      /* ──────────────────────────────────────────────────────────
         STOP 1: Clara's Messy Inn Room — Problem, Plan & Machine
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 1,
        clueId: 'g3_c1',
        stopName: 'Clara\'s Inn Workshop',
        title: 'Clue 1: Clara Doodle\'s Cleaning Machine',
        bookPage: 'Global Readings 2, Unit 1, pp. 10–15',
        npc: { id: 'clara', name: 'Clara & Jim', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        introLine: 'Ahoy, Inventor! Look inside the inn room — it is a big mess! Help Clara Doodle plan, test, and improve her room-cleaning machine!',
        flintWord: 'What does it do? It cleans the messy room! Try again!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g3_s1_r1',
            speaker: 'Jim Hawkins',
            promptIcon: '🧸📚',
            promptImg: 'art/z1/s_mess_room.webp',
            promptText: 'Look at the floor! Toys and clothes are everywhere. What is the problem?',
            speakText: 'Look at the floor! What is the problem?',
            slowText: 'The ... room ... is ... a ... big ... mess!',
            hint: 'Pick the picture showing a messy room: "The room is a big mess!"',
            correct: { text: 'The room is a big mess!', icon: '🧸', img: 'art/z1/w_mess.webp', speak: 'The room is a big mess!' },
            options: [
              { text: 'The room is a big mess!', icon: '🧸', img: 'art/z1/w_mess.webp', speak: 'The room is a big mess!' },
              { text: 'The room is neat and tidy.', icon: '✨', img: 'art/z1/w_tidy.webp', speak: 'The room is neat and tidy.' },
              { text: 'It is a six-sided hexagon.', icon: '🐝', img: 'art/z1/w_hexagon.webp', speak: 'It is a six-sided hexagon.' }
            ]
          },
          {
            id: 'g3_s1_r2',
            speaker: 'Clara Doodle',
            promptIcon: '📝⚙️',
            promptImg: 'art/z1/s_new_plan.webp',
            promptText: 'Clara wants to invent a machine! What does she draw in her notebook first?',
            speakText: 'Clara wants to invent a machine! What does she draw first?',
            slowText: 'First, ... she ... draws ... a ... plan!',
            hint: 'Look for the blueprint drawing 📝: "First, she draws a plan!"',
            correct: { text: 'First, she draws a plan!', icon: '📝', img: 'art/z1/w_plan.webp', speak: 'First, she draws a plan!' },
            options: [
              { text: 'First, she draws a plan!', icon: '📝', img: 'art/z1/w_plan.webp', speak: 'First, she draws a plan!' },
              { text: 'First, she goes to sleep.', icon: '😴', img: 'art/z1/w_sleep.webp', speak: 'First, she goes to sleep.' },
              { text: 'First, she hides under the bed.', icon: '🙈', img: 'art/z1/w_hide.webp', speak: 'First, she hides under the bed.' }
            ]
          },
          {
            id: 'g3_s1_r3',
            speaker: 'Captain Flint',
            promptIcon: '🤖🧹',
            promptImg: 'art/z1/s_clara_machine.webp',
            promptText: 'Look at Clara\'s spinning invention! What does it do?',
            speakText: 'Look at Clara\'s invention! What does it do?',
            slowText: 'It ... cleans ... the ... messy ... room!',
            hint: 'Answer with "It + verb-s": "It cleans the messy room!"',
            correct: { text: 'It cleans the messy room!', icon: '🧹', img: 'art/z1/s_cleans_floor.webp', speak: 'It cleans the messy room!' },
            options: [
              { text: 'It cleans the messy room!', icon: '🧹', img: 'art/z1/s_cleans_floor.webp', speak: 'It cleans the messy room!' },
              { text: 'It bakes a birthday cake.', icon: '🎂', img: 'art/flat/o_cake.webp', speak: 'It bakes a birthday cake.' },
              { text: 'It sails across the ocean.', icon: '⛵', img: 'art/z2/w_ocean_boat.webp', speak: 'It sails across the ocean.' }
            ]
          },
          {
            id: 'g3_s1_r4',
            speaker: 'Jim Hawkins',
            promptIcon: '🪞🔧',
            promptImg: 'art/z1/s_try_again.webp',
            promptText: 'Oops! The machine bumped the mirror! What does a true inventor do?',
            speakText: 'Oops! The machine bumped the mirror! What does an inventor do?',
            slowText: 'Change ... the ... plan ... and ... try ... again!',
            hint: 'Inventors never quit: "Change the plan and try again!"',
            correct: { text: 'Change the plan and try again!', icon: '🔧', img: 'art/z1/w_try.webp', speak: 'Change the plan and try again!' },
            options: [
              { text: 'Change the plan and try again!', icon: '🔧', img: 'art/z1/w_try.webp', speak: 'Change the plan and try again!' },
              { text: 'Give up forever.', icon: '💥', img: 'art/z1/s_z1_broken.webp', speak: 'Give up forever.' },
              { text: 'Make a bigger mess.', icon: '🧸', img: 'art/z1/w_mess.webp', speak: 'Make a bigger mess.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s1_star1',
            promptIcon: '🤖🧹',
            promptImg: 'art/z1/s_clara_machine.webp',
            promptText: 'Order the words and say what Clara\'s machine does:',
            speakText: 'What does it do? It cleans the messy room!',
            targetSentence: 'It cleans the messy room!',
            words: ['It', 'cleans', 'the', 'messy', 'room!'],
            distractors: ['sleepy'],
            allowSpeak: true,
            hint: 'Start with "It cleans", then "the messy room!"'
          },
          {
            id: 'g3_s1_star2',
            promptIcon: '🔧✨',
            promptImg: 'art/z1/s_try_again.webp',
            promptText: 'Order the inventor motto and say it aloud:',
            speakText: 'Change the plan and try again!',
            targetSentence: 'Change the plan and try again!',
            words: ['Change', 'the', 'plan', 'and', 'try', 'again!'],
            distractors: ['mirror'],
            allowSpeak: true,
            hint: 'Start with "Change the plan", then "and try again!"'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 2: Inventor's Blueprint Board — Sequence & Purpose
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 2,
        clueId: 'g3_c2',
        stopName: 'Inventor\'s Blueprint Board',
        title: 'Clue 2: First, Second, Third, Last!',
        bookPage: 'Global Readings 2, Unit 1, pp. 16–19',
        npc: { id: 'bolt', name: 'Grandpa Bolt', art: 'c_bolt', happy: 'c_bolt_happy' },
        companion: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        introLine: 'Welcome to my Blueprint Board! Put the four invention steps in order and explain the purpose using TO!',
        flintWord: 'First, draw a plan. Second, build it. Third, test it. Last, improve it!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g3_s2_r1',
            speaker: 'Grandpa Bolt',
            promptIcon: '1️⃣📝',
            promptImg: 'art/z1/w_plan.webp',
            promptText: 'You spot a problem! What do you do FIRST?',
            speakText: 'You spot a problem! What do you do first?',
            slowText: 'First, ... draw ... a ... plan!',
            hint: 'Step 1 uses "First": "First, draw a plan!"',
            correct: { text: 'First, draw a plan!', icon: '📝', img: 'art/z1/w_plan.webp', speak: 'First, draw a plan!' },
            options: [
              { text: 'First, draw a plan!', icon: '📝', img: 'art/z1/w_plan.webp', speak: 'First, draw a plan!' },
              { text: 'Last, go to bed.', icon: '🛏️', img: 'art/z1/w_sleep.webp', speak: 'Last, go to bed.' },
              { text: 'Hide the mirror.', icon: '🪞', img: 'art/z1/w_mirror.webp', speak: 'Hide the mirror.' }
            ]
          },
          {
            id: 'g3_s2_r2',
            speaker: 'Grandpa Bolt',
            promptIcon: '2️⃣⚙️',
            promptImg: 'art/z1/w_machine.webp',
            promptText: 'After your blueprint is ready, what do you do SECOND?',
            speakText: 'After your blueprint is ready, what do you do second?',
            slowText: 'Second, ... build ... the ... machine!',
            hint: 'Step 2 uses "Second": "Second, build the machine!"',
            correct: { text: 'Second, build the machine!', icon: '⚙️', img: 'art/z1/w_machine.webp', speak: 'Second, build the machine!' },
            options: [
              { text: 'Second, build the machine!', icon: '⚙️', img: 'art/z1/w_machine.webp', speak: 'Second, build the machine!' },
              { text: 'Eat a pineapple.', icon: '🍍', img: 'art/z2/w_pineapple.webp', speak: 'Eat a pineapple.' },
              { text: 'Forget the solution.', icon: '❓', img: 'art/z1/w_mess.webp', speak: 'Forget the solution.' }
            ]
          },
          {
            id: 'g3_s2_r3',
            speaker: 'Grandpa Bolt',
            promptIcon: '4️⃣🚀',
            promptImg: 'art/z1/s_try_again.webp',
            promptText: 'Third, we test what it does! What do we do LAST?',
            speakText: 'Third, we test what it does! What do we do last?',
            slowText: 'Last, ... improve ... the ... invention!',
            hint: 'Step 4 uses "Last": "Last, improve the invention!"',
            correct: { text: 'Last, improve the invention!', icon: '🚀', img: 'art/z1/s_invent_new.webp', speak: 'Last, improve the invention!' },
            options: [
              { text: 'Last, improve the invention!', icon: '🚀', img: 'art/z1/s_invent_new.webp', speak: 'Last, improve the invention!' },
              { text: 'Break all the wheels.', icon: '💥', img: 'art/z1/s_z1_broken.webp', speak: 'Break all the wheels.' },
              { text: 'Sleep in the mess.', icon: '😴', img: 'art/z1/w_sleep.webp', speak: 'Sleep in the mess.' }
            ]
          },
          {
            id: 'g3_s2_r4',
            speaker: 'Jim Hawkins',
            promptIcon: '🎯🧹',
            promptImg: 'art/z1/s_cleans_floor.webp',
            promptText: 'Why did Clara build her machine? Tell the purpose with TO:',
            speakText: 'Why did Clara build her machine? She built it to clean her room!',
            slowText: 'She ... built ... it ... to ... clean ... her ... room!',
            hint: 'Use "to + verb": "She built it to clean her room!"',
            correct: { text: 'She built it to clean her room!', icon: '🧹', img: 'art/z1/s_cleans_floor.webp', speak: 'She built it to clean her room!' },
            options: [
              { text: 'She built it to clean her room!', icon: '🧹', img: 'art/z1/s_cleans_floor.webp', speak: 'She built it to clean her room!' },
              { text: 'She built it to make a mess.', icon: '🧸', img: 'art/z1/w_mess.webp', speak: 'She built it to make a mess.' },
              { text: 'She built it to chase birds.', icon: '🐦', img: 'art/z1/w_chase.webp', speak: 'She built it to chase birds.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s2_star1',
            promptIcon: '📝⚙️',
            promptImg: 'art/z1/w_plan.webp',
            promptText: 'Build the first step of inventing and say it aloud:',
            speakText: 'First, draw a good plan.',
            targetSentence: 'First, draw a good plan.',
            words: ['First,', 'draw', 'a', 'good', 'plan.'],
            distractors: ['messy'],
            allowSpeak: true,
            hint: 'Start with "First,", then "draw a good plan."'
          },
          {
            id: 'g3_s2_star2',
            promptIcon: '🎯✨',
            promptImg: 'art/z1/s_cleans_floor.webp',
            promptText: 'Explain the purpose using TO and speak it clearly:',
            speakText: 'We invent machines to solve problems.',
            targetSentence: 'We invent machines to solve problems.',
            words: ['We', 'invent', 'machines', 'to', 'solve', 'problems.'],
            distractors: ['clock'],
            allowSpeak: true,
            hint: 'Put in order: "We invent machines to solve problems."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 3: Clockwork Ship Wheel — Phonics `cl-` & Function
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 3,
        clueId: 'g3_c3',
        stopName: 'Clockwork Ship Wheel',
        title: 'Clue 3: Spin the cl- Blend Wheel',
        bookPage: 'Global Readings 2, Unit 1, pp. 17 & 21',
        npc: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        companion: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        introLine: 'Squawk! Listen for the CL sound — like Clara, clock, clean, classroom, climb, and cloud!',
        flintWord: 'Clara, clock, clean, classroom, climb, cloud!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g3_s3_r1',
            speaker: 'Captain Flint',
            promptIcon: '⏰🔔',
            promptImg: 'art/flat/o_compass.webp',
            promptText: 'Which CL- invention hangs on the wall and tells us the time?',
            speakText: 'Which C-L invention tells us the time? It is a clock!',
            slowText: 'cl ... ock! ... Clock!',
            hint: 'Listen to the beginning blend CL-: "A clock!"',
            correct: { text: 'A clock! It tells the time.', icon: '⏰', img: 'art/flat/o_compass.webp', speak: 'A clock! It tells the time.' },
            options: [
              { text: 'A clock! It tells the time.', icon: '⏰', img: 'art/flat/o_compass.webp', speak: 'A clock! It tells the time.' },
              { text: 'A mirror! It shows my face.', icon: '🪞', img: 'art/z1/w_mirror.webp', speak: 'A mirror! It shows my face.' },
              { text: 'A broom! It sweeps dust.', icon: '🧹', img: 'art/z1/w_broom.webp', speak: 'A broom! It sweeps dust.' }
            ]
          },
          {
            id: 'g3_s3_r2',
            speaker: 'Captain Flint',
            promptIcon: '✨🧹',
            promptImg: 'art/z1/s_tidy_room.webp',
            promptText: 'Which word starts with CL- and means "not messy or dirty"?',
            speakText: 'Which word starts with C-L and means not dirty? Clean!',
            slowText: 'cl ... ean! ... Clean!',
            hint: 'CL + ean = "Clean!"',
            correct: { text: 'Clean! Clara makes her room clean.', icon: '✨', img: 'art/z1/w_tidy.webp', speak: 'Clean! Clara makes her room clean.' },
            options: [
              { text: 'Clean! Clara makes her room clean.', icon: '✨', img: 'art/z1/w_tidy.webp', speak: 'Clean! Clara makes her room clean.' },
              { text: 'Plan! Draw a blueprint.', icon: '📝', img: 'art/z1/w_plan.webp', speak: 'Plan! Draw a blueprint.' },
              { text: 'Wheel! Spin it fast.', icon: '⚙️', img: 'art/z1/w_wheels.webp', speak: 'Wheel! Spin it fast.' }
            ]
          },
          {
            id: 'g3_s3_r3',
            speaker: 'Jim Hawkins',
            promptIcon: '🏫📚',
            promptImg: 'art/z1/s_love_reading.webp',
            promptText: 'Which CL- place at school has desks, books, and our teacher?',
            speakText: 'Which C-L place at school has desks and our teacher? Classroom!',
            slowText: 'cl ... assroom! ... Classroom!',
            hint: 'CL + assroom = "Classroom!"',
            correct: { text: 'The classroom!', icon: '🏫', img: 'art/z1/s_love_reading.webp', speak: 'The classroom!' },
            options: [
              { text: 'The classroom!', icon: '🏫', img: 'art/z1/s_love_reading.webp', speak: 'The classroom!' },
              { text: 'The harbour!', icon: '⚓', img: 'art/flat/o_benbow_inn.webp', speak: 'The harbour!' },
              { text: 'The hexagon!', icon: '🐝', img: 'art/z1/w_hexagon.webp', speak: 'The hexagon!' }
            ]
          },
          {
            id: 'g3_s3_r4',
            speaker: 'Jim Hawkins',
            promptIcon: '✏️🧽',
            promptImg: 'art/z1/w_try.webp',
            promptText: 'What does an eraser do when you write a mistake?',
            speakText: 'What does an eraser do?',
            slowText: 'It ... rubs ... out ... pencil ... marks!',
            hint: 'An eraser fixes pencil mistakes!',
            correct: { text: 'It rubs out pencil marks!', icon: '✏️', img: 'art/z1/w_try.webp', speak: 'It rubs out pencil marks!' },
            options: [
              { text: 'It rubs out pencil marks!', icon: '✏️', img: 'art/z1/w_try.webp', speak: 'It rubs out pencil marks!' },
              { text: 'It climbs up a white cloud.', icon: '☁️', img: 'art/z1/w_invent.webp', speak: 'It climbs up a white cloud.' },
              { text: 'It cooks hot lunch.', icon: '🍲', img: 'art/z1/w_lunch.webp', speak: 'It cooks hot lunch.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s3_star1',
            promptIcon: '⏰✨',
            promptImg: 'art/z1/s_tidy_room.webp',
            promptText: 'Order the CL- phonics sentence and read it aloud:',
            speakText: 'Clara cleans the classroom clock.',
            targetSentence: 'Clara cleans the classroom clock.',
            words: ['Clara', 'cleans', 'the', 'classroom', 'clock.'],
            distractors: ['mess'],
            allowSpeak: true,
            hint: 'Four CL- words! "Clara cleans the classroom clock."'
          },
          {
            id: 'g3_s3_star2',
            promptIcon: '❓⚙️',
            promptImg: 'art/z1/s_what_machine.webp',
            promptText: 'Build the Unit 1 big question and ask it aloud:',
            speakText: 'What does this machine do?',
            targetSentence: 'What does this machine do?',
            words: ['What', 'does', 'this', 'machine', 'do?'],
            distractors: ['are'],
            allowSpeak: true,
            hint: 'Start with "What does", then "this machine do?"'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 4: Spyglass Lookout — My Good Ideas Book & Biomimicry
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 4,
        clueId: 'g3_c4',
        stopName: 'Pier Spyglass Lookout',
        title: 'Clue 4: My Good Ideas Book & Nature',
        bookPage: 'Global Readings 2, Unit 1, pp. 18–23',
        npc: { id: 'jim', name: 'Jim Hawkins', art: 'c_jim', happy: 'c_jim_happy' },
        companion: { id: 'benbow', name: 'Benbow', art: 'c_benbow', happy: 'c_benbow_happy' },
        introLine: 'Step onto the pier planks and look through the brass spyglass! Discover how great inventors learn from nature!',
        flintWord: 'Hexagon honeycomb! Parachute! Bullet train! Good Ideas Book!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g3_s4_r1',
            speaker: 'Jim Hawkins',
            promptIcon: '🐝⬡',
            promptImg: 'art/z1/w_hexagon.webp',
            promptText: 'Bees build strong wax cells with six equal sides and zero wasted space! What shape is that?',
            speakText: 'Bees build strong cells with six sides! What shape is that?',
            slowText: 'It ... is ... a ... hexagon!',
            hint: 'Six sides = "A hexagon!"',
            correct: { text: 'A hexagon!', icon: '⬡', img: 'art/z1/w_hexagon.webp', speak: 'A hexagon!' },
            options: [
              { text: 'A hexagon!', icon: '⬡', img: 'art/z1/w_hexagon.webp', speak: 'A hexagon!' },
              { text: 'A broom!', icon: '🧹', img: 'art/z1/w_broom.webp', speak: 'A broom!' },
              { text: 'A mirror!', icon: '🪞', img: 'art/z1/w_mirror.webp', speak: 'A mirror!' }
            ]
          },
          {
            id: 'g3_s4_r2',
            speaker: 'Jim Hawkins',
            promptIcon: '🪂☁️',
            promptImg: 'art/z1/s_invent_new.webp',
            promptText: 'Leonardo da Vinci drew a cloth canopy in his notebook so a person could float safely from the sky! What is it?',
            speakText: 'Leonardo da Vinci drew an invention to float safely from the sky! What is it?',
            slowText: 'A ... parachute!',
            hint: 'It opens in the sky to float safely down: "A parachute!"',
            correct: { text: 'A parachute!', icon: '🪂', img: 'art/z1/s_invent_new.webp', speak: 'A parachute!' },
            options: [
              { text: 'A parachute!', icon: '🪂', img: 'art/z1/s_invent_new.webp', speak: 'A parachute!' },
              { text: 'A messy room!', icon: '🧸', img: 'art/z1/w_mess.webp', speak: 'A messy room!' },
              { text: 'A lunch tray!', icon: '🍎', img: 'art/z1/w_lunch.webp', speak: 'A lunch tray!' }
            ]
          },
          {
            id: 'g3_s4_r3',
            speaker: 'Grandpa Bolt',
            promptIcon: '🚄🐦',
            promptImg: 'art/z1/w_wheels.webp',
            promptText: 'Engineers studied a kingfisher bird\'s pointed beak to improve what fast machine?',
            speakText: 'Engineers copied a kingfisher bird\'s beak to improve what fast machine?',
            slowText: 'A ... fast ... bullet ... train!',
            hint: 'A sleek nose makes the train quiet and fast: "A fast bullet train!"',
            correct: { text: 'A fast bullet train!', icon: '🚄', img: 'art/z1/w_wheels.webp', speak: 'A fast bullet train!' },
            options: [
              { text: 'A fast bullet train!', icon: '🚄', img: 'art/z1/w_wheels.webp', speak: 'A fast bullet train!' },
              { text: 'A wooden bookshelf!', icon: '📚', img: 'art/z1/w_shelf.webp', speak: 'A wooden bookshelf!' },
              { text: 'A soft pillow!', icon: '😴', img: 'art/z1/w_sleep.webp', speak: 'A soft pillow!' }
            ]
          },
          {
            id: 'g3_s4_r4',
            speaker: 'Clara Doodle',
            promptIcon: '💡📓',
            promptImg: 'art/z1/w_invent.webp',
            promptText: 'Thomas Edison tested over a thousand designs before his lightbulb glowed! What lesson does that teach us?',
            speakText: 'Thomas Edison tested many designs before his lightbulb worked! What does that teach us?',
            slowText: 'Keep ... trying ... to ... improve ... your ... idea!',
            hint: 'Great inventors test and improve!',
            correct: { text: 'Keep trying to improve your idea!', icon: '💡', img: 'art/z1/w_invent.webp', speak: 'Keep trying to improve your idea!' },
            options: [
              { text: 'Keep trying to improve your idea!', icon: '💡', img: 'art/z1/w_invent.webp', speak: 'Keep trying to improve your idea!' },
              { text: 'Stop after one small mistake.', icon: '🛑', img: 'art/z1/s_z1_broken.webp', speak: 'Stop after one small mistake.' },
              { text: 'Never write down your ideas.', icon: '🙈', img: 'art/z1/w_hide.webp', speak: 'Never write down your ideas.' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s4_star1',
            promptIcon: '🐝⬡',
            promptImg: 'art/z1/w_hexagon.webp',
            promptText: 'Order the nature invention fact and speak it aloud:',
            speakText: 'A bee hexagon has six strong sides.',
            targetSentence: 'A bee hexagon has six strong sides.',
            words: ['A', 'bee', 'hexagon', 'has', 'six', 'strong', 'sides.'],
            distractors: ['two'],
            allowSpeak: true,
            hint: 'Put in order: "A bee hexagon has six strong sides."'
          },
          {
            id: 'g3_s4_star2',
            promptIcon: '🪂📓',
            promptImg: 'art/z1/s_invent_new.webp',
            promptText: 'Order the sentence from My Good Ideas Book:',
            speakText: 'Inventors watch nature to find solutions.',
            targetSentence: 'Inventors watch nature to find solutions.',
            words: ['Inventors', 'watch', 'nature', 'to', 'find', 'solutions.'],
            distractors: ['mess'],
            allowSpeak: true,
            hint: 'Start with "Inventors watch nature", then "to find solutions."'
          }
        ]
      },

      /* ──────────────────────────────────────────────────────────
         STOP 5: Billy Bones's Gadget Chest — Unit 1 Boss Review
         ────────────────────────────────────────────────────────── */
      {
        stopNum: 5,
        clueId: 'g3_c5',
        stopName: "Billy's Gadget Chest",
        title: 'Clue 5: Unlock Billy Bones\'s Gadget Chest',
        bookPage: 'Global Readings 2, Unit 1 Review, pp. 22–23',
        npc: { id: 'billy', name: 'Billy Bones', art: 'c_billy', happy: 'c_billy_happy' },
        companion: { id: 'flint', name: 'Captain Flint', art: 'c_pip', happy: 'c_pip_happy' },
        introLine: 'Arrr, young Inventor! Answer four Unit 1 master clues to pop open my sea chest and claim Map Piece Number One!',
        flintWord: 'Problem, plan, machine, solution! Open the chest!',
        easyEngine: 'listenTap',
        starEngine: 'wordOrder',
        rounds: [
          {
            id: 'g3_s5_r1',
            speaker: 'Billy Bones',
            promptIcon: '🔒1️⃣',
            promptImg: 'art/z1/w_mirror.webp',
            promptText: 'Padlock 1! Look at this shiny glass on the wall. What does a mirror do?',
            speakText: 'Padlock One! What does a mirror do?',
            slowText: 'It ... shows ... what ... you ... look ... like!',
            hint: 'A mirror reflects your image!',
            correct: { text: 'It shows what you look like!', icon: '🪞', img: 'art/z1/w_mirror.webp', speak: 'It shows what you look like!' },
            options: [
              { text: 'It shows what you look like!', icon: '🪞', img: 'art/z1/w_mirror.webp', speak: 'It shows what you look like!' },
              { text: 'It sweeps the wooden pier.', icon: '🧹', img: 'art/z1/w_broom.webp', speak: 'It sweeps the wooden pier.' },
              { text: 'It flies like a parachute.', icon: '🪂', img: 'art/z1/s_invent_new.webp', speak: 'It flies like a parachute.' }
            ]
          },
          {
            id: 'g3_s5_r2',
            speaker: 'Billy Bones',
            promptIcon: '🔒2️⃣',
            promptImg: 'art/z1/s_new_plan.webp',
            promptText: 'Padlock 2! Every great invention fixes a problem. What do we call the answer to a problem?',
            speakText: 'Padlock Two! What do we call the answer to a problem?',
            slowText: 'A ... smart ... solution!',
            hint: 'Problem -> Plan -> "A smart solution!"',
            correct: { text: 'A smart solution!', icon: '💡', img: 'art/z1/w_invent.webp', speak: 'A smart solution!' },
            options: [
              { text: 'A smart solution!', icon: '💡', img: 'art/z1/w_invent.webp', speak: 'A smart solution!' },
              { text: 'A bigger mess!', icon: '🧸', img: 'art/z1/w_mess.webp', speak: 'A bigger mess!' },
              { text: 'A broken wheel!', icon: '💥', img: 'art/z1/s_z1_broken.webp', speak: 'A broken wheel!' }
            ]
          },
          {
            id: 'g3_s5_r3',
            speaker: 'Billy Bones',
            promptIcon: '🔒3️⃣',
            promptImg: 'art/z1/s_tidy_room.webp',
            promptText: 'Padlock 3! Which sentence has TWO words that start with CL-?',
            speakText: 'Padlock Three! Which sentence has two words starting with C-L?',
            slowText: 'Climb ... up ... toward ... the ... white ... cloud!',
            hint: 'Look for CL-imb and CL-oud!',
            correct: { text: 'Climb up toward the white cloud!', icon: '☁️', img: 'art/z1/s_invent_new.webp', speak: 'Climb up toward the white cloud!' },
            options: [
              { text: 'Climb up toward the white cloud!', icon: '☁️', img: 'art/z1/s_invent_new.webp', speak: 'Climb up toward the white cloud!' },
              { text: 'Draw a plan on paper.', icon: '📝', img: 'art/z1/w_plan.webp', speak: 'Draw a plan on paper.' },
              { text: 'Spin the brass wheel.', icon: '⚙️', img: 'art/z1/w_wheels.webp', speak: 'Spin the brass wheel.' }
            ]
          },
          {
            id: 'g3_s5_r4',
            speaker: 'Billy Bones',
            promptIcon: '🔒4️⃣',
            promptImg: 'art/flat/o_billy_chest.webp',
            promptText: 'Final Padlock! Put the four sequence words in the right order:',
            speakText: 'Final Padlock! Put the four sequence words in order!',
            slowText: 'First, ... Second, ... Third, ... Last!',
            hint: '1 -> First, 2 -> Second, 3 -> Third, 4 -> Last!',
            correct: { text: 'First, Second, Third, Last!', icon: '🏆', img: 'art/flat/o_chest_open.webp', speak: 'First, Second, Third, Last!' },
            options: [
              { text: 'First, Second, Third, Last!', icon: '🏆', img: 'art/flat/o_chest_open.webp', speak: 'First, Second, Third, Last!' },
              { text: 'Last, First, Third, Second!', icon: '🔄', img: 'art/z1/w_try.webp', speak: 'Last, First, Third, Second!' },
              { text: 'Mess, Mirror, Broom, Sleep!', icon: '🧹', img: 'art/z1/w_broom.webp', speak: 'Mess, Mirror, Broom, Sleep!' }
            ]
          }
        ],
        starTasks: [
          {
            id: 'g3_s5_star1',
            promptIcon: '🏆⚙️',
            promptImg: 'art/z1/s_tidy_room.webp',
            promptText: 'Order Clara\'s victory sentence and speak it aloud:',
            speakText: 'My new invention makes the room tidy!',
            targetSentence: 'My new invention makes the room tidy!',
            words: ['My', 'new', 'invention', 'makes', 'the', 'room', 'tidy!'],
            distractors: ['mess'],
            allowSpeak: true,
            hint: 'Start with "My new invention", then "makes the room tidy!"'
          },
          {
            id: 'g3_s5_star2',
            promptIcon: '🗺️🏴‍☠️',
            promptImg: 'art/flat/o_map_piece1.webp',
            promptText: 'Unlock Map Piece #1! Order and speak the final clue:',
            speakText: 'Last, we open Billy Bones\'s treasure chest!',
            targetSentence: 'Last, we open the treasure chest!',
            words: ['Last,', 'we', 'open', 'the', 'treasure', 'chest!'],
            distractors: ['broken'],
            allowSpeak: true,
            hint: 'Start with "Last, we open", then "the treasure chest!"'
          }
        ]
      }
    ]
  };

  root.CH1_CONTENT_G3 = CH1_CONTENT_G3;
})(typeof window !== 'undefined' ? window : this);
