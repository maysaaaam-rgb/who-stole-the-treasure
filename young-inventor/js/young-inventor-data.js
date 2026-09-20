/**
 * YOUNG INVENTORS — CURRICULUM DATA
 * Grade 4 A1+ | Global Readings 3 Unit 1: Inventions
 * Plan • Build • Test • Improve
 */
(function(root) {
  'use strict';

  const YOUNG_INVENTOR_DATA = {

    meta: {
      id: 'young-inventors',
      title: 'YOUNG INVENTORS',
      subtitle: 'PLAN \u2022 BUILD \u2022 TEST \u2022 IMPROVE',
      unit: 'Global Readings 3 \u2014 Unit 1: Inventions',
      grade: 'Grade 4',
      level: 'A1+ / early A2',
      duration: '45\u201360 minutes',
      totalMissions: 8,
      totalXP: 200
    },

    missions: [
      { id: 1, title: 'Discover Inventions',  icon: '\uD83D\uDD0D', subtitle: 'Look around the lab. What inventions can you see?' },
      { id: 2, title: 'Find the Problem',      icon: '\uD83E\uDDE9', subtitle: 'Every invention starts with a problem!' },
      { id: 3, title: 'Unlock the Purpose',    icon: '\uD83C\uDFAF', subtitle: 'TO + VERB = PURPOSE' },
      { id: 4, title: 'Design the Blueprint',  icon: '\uD83D\uDCD0', subtitle: 'Real inventors plan before they build!' },
      { id: 5, title: 'Build Test Measure',    icon: '\uD83E\uDDEA', subtitle: 'Your Engineering Control Center' },
      { id: 6, title: 'Improve the Design',    icon: '\uD83D\uDD27', subtitle: 'Real inventors never give up after one test!' },
      { id: 7, title: 'Present the Result',    icon: '\uD83C\uDFA4', subtitle: 'Inventor Presentation Stage' },
      { id: 8, title: 'Inventor Battle',       icon: '\uD83C\uDFC6', subtitle: 'The Final Challenge!' }
    ],

    mission1_discover: {
      instructions: 'Explore the lab! Click each invention to learn about it.',
      inventions: [
        { id: 'car',         name: 'Car',         emoji: '\uD83D\uDE97', description: 'A vehicle powered by an engine that carries people on land.',                        problem: 'People needed to travel quickly on land.',               year: 1886, inventor: 'Karl Benz' },
        { id: 'airplane',    name: 'Airplane',    emoji: '\u2708\uFE0F', description: 'A flying machine with wings powered by engines.',                                   problem: 'People wanted to fly through the sky.',                   year: 1903, inventor: 'Wright Brothers' },
        { id: 'telephone',   name: 'Telephone',   emoji: '\uD83D\uDCDE', description: 'A device that sends and receives voice messages over long distances.',              problem: 'People needed to communicate far away.',                  year: 1876, inventor: 'Alexander Graham Bell' },
        { id: 'light-bulb',  name: 'Light Bulb',  emoji: '\uD83D\uDCA1', description: 'An electric lamp that produces light without fire or flame.',                       problem: 'People needed light at night without fire.',              year: 1879, inventor: 'Thomas Edison' },
        { id: 'computer',    name: 'Computer',    emoji: '\uD83D\uDCBB', description: 'An electronic machine that stores, retrieves, and processes data.',                 problem: 'People needed to calculate data quickly.',                year: 1945, inventor: 'Alan Turing' },
        { id: 'alarm-clock', name: 'Alarm Clock', emoji: '\u23F0',       description: 'A clock with a buzzer or bell that wakes you up at a set time.',                   problem: 'People needed to wake up on time.',                       year: 1787, inventor: 'Levi Hutchins' },
        { id: 'parachute',   name: 'Parachute',   emoji: '\uD83E\uDE82', description: 'A large fabric canopy that slows a person falling from height.',                   problem: 'People needed to fall safely from great height.',         year: 1783, inventor: 'Sebastien Lenormand' },
        { id: 'robot',       name: 'Robot',       emoji: '\uD83E\uDD16', description: 'A programmable machine that performs tasks automatically.',                        problem: 'People needed help with dangerous and repetitive work.',  year: 1954, inventor: 'George Devol' }
      ]
    },

    mission2_problem: {
      instructions: 'Each invention solved a problem. Can you find the right one?',
      rounds: [
        { invention: 'Car',         emoji: '\uD83D\uDE97', correctProblem: 'People needed to travel more quickly and easily.',         distractors: ['People needed to fly above the clouds.', 'People needed to talk to friends far away.'] },
        { invention: 'Airplane',    emoji: '\u2708\uFE0F', correctProblem: 'People wanted to fly through the sky.',                    distractors: ['People needed to drive faster on roads.', 'People needed to see in the dark.'] },
        { invention: 'Alarm Clock', emoji: '\u23F0',       correctProblem: 'People needed a machine to wake them up on time.',         distractors: ['People needed to measure how far they walked.', 'People needed to cook food automatically.'] },
        { invention: 'Telephone',   emoji: '\uD83D\uDCDE', correctProblem: 'People needed to talk to others far away.',                distractors: ['People needed to travel quickly underground.', 'People needed to lift heavy objects easily.'] },
        { invention: 'Light Bulb',  emoji: '\uD83D\uDCA1', correctProblem: 'People needed light at night without using fire.',         distractors: ['People needed to send letters faster.', 'People needed to keep food cold longer.'] },
        { invention: 'Parachute',   emoji: '\uD83E\uDE82', correctProblem: 'People needed a safe way to fall from great height.',      distractors: ['People needed to breathe underwater.', 'People needed to travel across the ocean quickly.'] }
      ],
      pairs: [
        { problem: 'Travel quickly on land',    invention: 'Car',         emoji: '\uD83D\uDE97' },
        { problem: 'Fly through the sky',        invention: 'Airplane',    emoji: '\u2708\uFE0F' },
        { problem: 'Wake up on time',            invention: 'Alarm Clock', emoji: '\u23F0'       },
        { problem: 'Talk to others far away',    invention: 'Telephone',   emoji: '\uD83D\uDCDE' },
        { problem: 'See at night without fire',  invention: 'Light Bulb',  emoji: '\uD83D\uDCA1' },
        { problem: 'Fall safely from height',    invention: 'Parachute',   emoji: '\uD83E\uDE82' }
      ]
    },

    mission3_purpose: {
      instructions: 'Choose the correct word to complete each purpose sentence.',
      grammarNote: 'We use TO + VERB to explain WHY something was invented.',
      sentences: [
        { base: 'People invented cars ___ travel quickly.',          blank: '___', options: ['TO','FOR','BECAUSE'], correct: 'TO', completion: 'People invented cars TO travel quickly.' },
        { base: 'People invented parachutes ___ fall safely.',       blank: '___', options: ['TO','FOR','BECAUSE'], correct: 'TO', completion: 'People invented parachutes TO fall safely.' },
        { base: 'People invented alarm clocks ___ wake up on time.', blank: '___', options: ['TO','FOR','BECAUSE'], correct: 'TO', completion: 'People invented alarm clocks TO wake up on time.' },
        { base: 'People invented telephones ___ communicate.',       blank: '___', options: ['TO','FOR','BECAUSE'], correct: 'TO', completion: 'People invented telephones TO communicate.' },
        { base: 'People invented light bulbs ___ see at night.',     blank: '___', options: ['TO','FOR','BECAUSE'], correct: 'TO', completion: 'People invented light bulbs TO see at night.' }
      ],
      sentenceBuilder: [
        { words: ['invented','cars','People','quickly.','travel','to'],            correctOrder: 'People invented cars to travel quickly.',    hint: 'Subject + Verb + Object + to + Verb' },
        { words: ['designed','it','We','farther.','fly','to'],                     correctOrder: 'We designed it to fly farther.',             hint: 'Think about what "we" changed and why.' },
        { words: ['changed','wings','We','it','because','turned.','the'],          correctOrder: 'We changed the wings because it turned.',    hint: 'BECAUSE explains the reason for the problem.' }
      ]
    },

    mission4_blueprint: {
      instructions: 'Real inventors plan before they build! Choose your design and label the parts.',
      challenges: [
        {
          id: 'airplane', name: 'Paper Airplane', emoji: '\u2708\uFE0F',
          goal: 'Design a paper airplane that flies as far as possible.',
          designs: [
            { id: 'dart',   name: 'Dart',      icon: '\uD83D\uDE80', description: 'Narrow and pointed. Built for speed and distance.',              strengths: ['speed','distance'],               difficulty: 'Easy'   },
            { id: 'glider', name: 'Glider',    icon: '\uD83E\uDEB1', description: 'Wide wings for a smooth, longer glide.',                        strengths: ['smooth flight','longer air time'], difficulty: 'Medium' },
            { id: 'delta',  name: 'Delta Wing', icon: '\uD83D\uDD3A', description: 'Triangular shape for stability in different conditions.',       strengths: ['stability','control'],            difficulty: 'Hard'   }
          ],
          parts: [
            { id: 'wing', label: 'Wing', description: 'Keeps the airplane in the air by creating lift.' },
            { id: 'nose', label: 'Nose', description: 'The pointed front that cuts through the air.' },
            { id: 'body', label: 'Body', description: 'The main folded section that holds the plane together.' },
            { id: 'tail', label: 'Tail', description: 'Helps balance and steer the airplane.' }
          ]
        },
        {
          id: 'pinwheel', name: 'Pinwheel', emoji: '\uD83C\uDF00',
          goal: 'Design a pinwheel that spins fast in the wind.',
          startingSize: '15 cm x 15 cm',
          parts: [
            { id: 'blade',  label: 'Blade',  description: 'The angled flap that catches the wind and causes spinning.' },
            { id: 'center', label: 'Center', description: 'The middle point where all blades meet and rotate.' },
            { id: 'pin',    label: 'Pin',    description: 'The small fastener that holds the blades to the stick.' },
            { id: 'stick',  label: 'Stick',  description: 'The handle you hold while the pinwheel spins.' }
          ]
        }
      ]
    },

    mission5_test: {
      instructions: 'Follow the steps to build and test your invention!',
      airplaneSteps: [
        { step: 1, title: 'Choose Blueprint',    icon: '\uD83D\uDCD0',       action: 'Select your airplane design: Dart, Glider, or Delta Wing.',                                             tip: 'Remember: different designs fly differently!' },
        { step: 2, title: 'Measure the Paper',   icon: '\uD83D\uDCCF',       action: 'Use a ruler to check your paper is the correct size (A4 / 21 cm x 29.7 cm).',                         tip: 'Measure twice — fold once!' },
        { step: 3, title: 'Fold the Airplane',   icon: '\uD83D\uDD8A\uFE0F', action: 'Follow the folding instructions for your chosen design. Make sharp, clean creases.',                  tip: 'Flat folds make a better flier!' },
        { step: 4, title: 'Build and Throw',     icon: '\uD83E\uDDEA',       action: 'Throw the airplane three times. Record the distance each time in centimetres.',                       tip: 'Throw at the same angle each time for a fair test.' },
        { step: 5, title: 'Check Symmetry',      icon: '\uD83D\uDD0D',       action: 'Look at both wings from the front. They should be exactly the same size.',                            tip: 'Symmetry = straight flight!' }
      ],
      pinwheelSteps: [
        { step: 1, title: 'Measure the Square',      icon: '\uD83D\uDCCF',       action: 'Measure and cut a 15 cm x 15 cm square from your paper.',                                                   tip: 'Use a ruler and pencil to mark the lines first.' },
        { step: 2, title: 'Draw Cutting Lines',       icon: '\u270F\uFE0F',       action: 'Draw diagonal lines from each corner to within 3 cm of the centre. Do NOT cut all the way!',           tip: 'Leave at least 3 cm in the middle uncut.' },
        { step: 3, title: 'Cut Toward Centre',        icon: '\u2702\uFE0F',       action: 'Carefully cut along each diagonal line, stopping before the centre.',                                     tip: 'Scissors straight — cut steady!' },
        { step: 4, title: 'Fold Alternate Corners',   icon: '\uD83D\uDD8A\uFE0F', action: 'Fold every OTHER corner point toward the centre. Do not crease — just curve them.',                      tip: 'Fold, do not flatten — keep the blade curved!' },
        { step: 5, title: 'Attach the Centre',        icon: '\uD83D\uDCCC',       action: 'Push a pin or brad through the centre of all folded blades to hold them in place.',                      tip: 'Make sure it is loose enough to spin freely!' },
        { step: 6, title: 'Attach to Stick',          icon: '\uD83E\uDE9B',       action: 'Push the pin into the top of your pencil or dowel stick. Test it by blowing gently.',                   tip: 'Blow from the side — watch it spin!' }
      ],
      dataTable: {
        headers: ['Test #', 'Distance (cm) / Spin Time (s)', 'Notes'],
        rows: 3
      }
    },

    mission6_improve: {
      instructions: 'Look at your test results. What went wrong? How can you make it better?',
      coreMessage: 'Real inventors NEVER give up after one test. They observe, identify the problem, make changes, and test again. This is the Design Cycle: Plan -> Build -> Test -> Improve -> Repeat!',
      engineeringCycleSteps: ['Plan', 'Build', 'Test', 'Improve', 'Repeat'],
      airplaneProblems: [
        { id: 'ap1', text: 'The airplane turned left or right instead of going straight.', improvements: ['Make sure both wings are exactly the same size (symmetry).', 'Bend one wing slightly upward to correct the turn.', 'Re-fold the nose so it points straight forward.'] },
        { id: 'ap2', text: 'The airplane nose-dived quickly after throwing.',              improvements: ['Add a small paper clip to the nose for extra weight.', 'Fold the tail slightly upward to create more lift.', 'Try a wider wing design like the Glider.'] },
        { id: 'ap3', text: 'The airplane stalled and fell slowly right away.',             improvements: ['Make the nose heavier by folding more layers at the front.', 'Reduce the wing size to decrease drag.', 'Throw with more force and a flatter angle.'] },
        { id: 'ap4', text: 'The airplane did not travel far enough.',                      improvements: ['Try the Dart design — it is built for maximum distance.', 'Sharpen and flatten all folds for less air resistance.', 'Throw from a higher starting position.'] }
      ],
      pinwheelProblems: [
        { id: 'pp1', text: 'The pinwheel spun too slowly.',             improvements: ['Curve the blades more to catch more wind.', 'Make the blades wider by starting with a bigger square.', 'Make sure the pin is not too tight — it must spin freely.'] },
        { id: 'pp2', text: 'The pinwheel did not spin at all.',         improvements: ['Check that all four alternate corners are folded toward the centre.', 'Loosen the pin so the blades can rotate freely.', 'Try blowing from a different angle.'] },
        { id: 'pp3', text: 'The pinwheel fell apart during testing.',   improvements: ['Push the pin more securely through all layers.', 'Add a small piece of tape to hold the centre together.', 'Use thicker paper or card for the blades.'] },
        { id: 'pp4', text: 'The blades were not equal in size.',        improvements: ['Re-measure and re-cut a new square, making sure all cuts are equal.', 'Use a pencil and ruler to draw equal lines before cutting.', 'Fold the paper in half to check symmetry before cutting.'] }
      ]
    },

    mission7_present: {
      instructions: 'Stand up, speak clearly, and present your invention to the class!',
      sentenceFrames: [
        { label: 'Invention Name',     example: 'We built a paper airplane / pinwheel.' },
        { label: 'Purpose',            example: 'We invented it to fly far / spin fast.' },
        { label: 'Materials',          example: 'We used paper, a ruler, and scissors.' },
        { label: 'Test Result',        example: 'In our first test, it flew ___ cm / spun for ___ seconds.' },
        { label: 'Problem',            example: 'The problem was that it turned / stopped spinning.' },
        { label: 'Improvement Made',   example: 'We changed the wings / blades because it turned / slowed down.' },
        { label: 'Second Test Result', example: 'After improving, it flew ___ cm / spun for ___ seconds.' },
        { label: 'Conclusion',         example: 'Our invention was successful because it flew farther / spun faster!' }
      ],
      scoringCriteria: [
        { criterion: 'Uses all 8 sentence frames correctly',          maxPoints: 5 },
        { criterion: 'Explains the problem and improvement clearly',  maxPoints: 4 },
        { criterion: 'Uses "to + verb" purpose structures',           maxPoints: 3 },
        { criterion: 'Speaks clearly and with good volume',           maxPoints: 3 },
        { criterion: 'All team members contribute to presentation',   maxPoints: 3 },
        { criterion: 'Presents test data using numbers',              maxPoints: 2 }
      ],
      totalPoints: 20
    },

    mission8_battle: {
      instructions: 'Teams take turns choosing a category and answering questions to earn XP!',
      categories: [
        { id: 'vocab',    label: 'Vocab',    icon: '\uD83E\uDDE0',       color: 'amber'  },
        { id: 'problem',  label: 'Problem',  icon: '\uD83E\uDDE9',       color: 'cyan'   },
        { id: 'purpose',  label: 'Purpose',  icon: '\uD83C\uDFAF',       color: 'purple' },
        { id: 'airplane', label: 'Airplane', icon: '\u2708\uFE0F',       color: 'green'  },
        { id: 'pinwheel', label: 'Pinwheel', icon: '\uD83C\uDF00',       color: 'red'    },
        { id: 'test',     label: 'Test',     icon: '\uD83E\uDDEA',       color: 'blue'   },
        { id: 'improve',  label: 'Improve',  icon: '\uD83D\uDD27',       color: 'gold'   },
        { id: 'speak',    label: 'Speak',    icon: '\uD83D\uDDE3\uFE0F', color: 'purple' }
      ],
      questions: [

        // VOCAB
        { id: 'v1', category: 'vocab', type: 'multiple_choice', question: 'What is an INVENTION?',
          options: ['A) A question someone asks','B) A new thing someone makes to solve a problem','C) A place where scientists work','D) A type of machine that breaks'],
          correct: 'B', tileType: 'normal' },
        { id: 'v2', category: 'vocab', type: 'multiple_choice', question: 'What does IMPROVE mean?',
          options: ['A) To throw something away','B) To make something worse','C) To make something better','D) To copy an idea'],
          correct: 'C', tileType: 'bonus' },
        { id: 'v3', category: 'vocab', type: 'true_false', question: 'An inventor is a person who creates new things to solve problems. TRUE or FALSE?',
          options: ['TRUE','FALSE'], correct: 'TRUE', tileType: 'normal' },
        { id: 'v4', category: 'vocab', type: 'multiple_choice', question: 'Which word means "a drawing or plan made before building something"?',
          options: ['A) Blueprint','B) Ingredient','C) Discovery','D) Measurement'],
          correct: 'A', tileType: 'double' },

        // PROBLEM
        { id: 'p1', category: 'problem', type: 'multiple_choice', question: 'What problem did the TELEPHONE solve?',
          options: ['A) People needed light at night.','B) People needed to talk to others far away.','C) People needed to fly.','D) People needed to keep food cold.'],
          correct: 'B', tileType: 'normal' },
        { id: 'p2', category: 'problem', type: 'multiple_choice', question: 'Why did people invent the LIGHT BULB?',
          options: ['A) They wanted to cook food faster.','B) They needed light at night without using fire.','C) They wanted to fly over clouds.','D) They needed to send letters quickly.'],
          correct: 'B', tileType: 'steal' },
        { id: 'p3', category: 'problem', type: 'true_false', question: 'The PARACHUTE was invented so people could travel faster on land. TRUE or FALSE?',
          options: ['TRUE','FALSE'], correct: 'FALSE', tileType: 'normal' },
        { id: 'p4', category: 'problem', type: 'multiple_choice', question: 'What problem did the ALARM CLOCK solve?',
          options: ['A) People needed to travel fast.','B) People needed to talk to friends.','C) People needed a machine to wake them up on time.','D) People needed to see in the dark.'],
          correct: 'C', tileType: 'double' },

        // PURPOSE
        { id: 'pu1', category: 'purpose', type: 'multiple_choice', question: 'Choose the correct sentence: People invented cars ___.',
          options: ['A) for travel quickly.','B) because travel quickly.','C) to travel quickly.','D) travel quickly.'],
          correct: 'C', tileType: 'normal' },
        { id: 'pu2', category: 'purpose', type: 'sentence_order', question: 'Put the words in the correct order: [ parachutes / fall / People / safely / invented / to ]',
          options: ['A) People invented parachutes to fall safely.','B) Parachutes invented people to fall safely.','C) People to invented parachutes fall safely.','D) Invented people parachutes to safely fall.'],
          correct: 'A', tileType: 'expert' },
        { id: 'pu3', category: 'purpose', type: 'true_false', question: '"We use TO + VERB to explain the purpose of an invention." TRUE or FALSE?',
          options: ['TRUE','FALSE'], correct: 'TRUE', tileType: 'normal' },
        { id: 'pu4', category: 'purpose', type: 'multiple_choice', question: 'Which sentence uses "to + verb" correctly?',
          options: ['A) We changed wings because it turned.','B) We designed it for fly farther.','C) We designed it to fly farther.','D) We designed it flying farther.'],
          correct: 'C', tileType: 'challenge' },

        // AIRPLANE
        { id: 'a1', category: 'airplane', type: 'multiple_choice', question: 'Which paper airplane design is BEST for maximum distance?',
          options: ['A) Glider','B) Delta Wing','C) Dart','D) Box Kite'],
          correct: 'C', tileType: 'normal' },
        { id: 'a2', category: 'airplane', type: 'multiple_choice', question: 'What does the WING of a paper airplane do?',
          options: ['A) It makes the plane heavier.','B) It creates lift to keep the plane in the air.','C) It holds the pilot inside.','D) It powers the engine.'],
          correct: 'B', tileType: 'bonus' },
        { id: 'a3', category: 'airplane', type: 'true_false', question: 'If a paper airplane turns left, it means both wings are exactly the same size. TRUE or FALSE?',
          options: ['TRUE','FALSE'], correct: 'FALSE', tileType: 'normal' },
        { id: 'a4', category: 'airplane', type: 'multiple_choice', question: 'What should you check to make your paper airplane fly straight?',
          options: ['A) The colour of the paper','B) The symmetry — both wings must be equal','C) The name written on the airplane','D) The type of pen you used'],
          correct: 'B', tileType: 'speed' },

        // PINWHEEL
        { id: 'pw1', category: 'pinwheel', type: 'multiple_choice', question: 'What is the starting size of the paper for the pinwheel?',
          options: ['A) 10 cm x 10 cm','B) 20 cm x 20 cm','C) 15 cm x 15 cm','D) 30 cm x 30 cm'],
          correct: 'C', tileType: 'normal' },
        { id: 'pw2', category: 'pinwheel', type: 'multiple_choice', question: 'What does the BLADE of a pinwheel do?',
          options: ['A) It holds the pin in place.','B) It is the handle you hold.','C) It catches the wind and causes spinning.','D) It measures the speed of the wind.'],
          correct: 'C', tileType: 'steal' },
        { id: 'pw3', category: 'pinwheel', type: 'true_false', question: 'You should cut all the way to the centre of the paper when making a pinwheel. TRUE or FALSE?',
          options: ['TRUE','FALSE'], correct: 'FALSE', tileType: 'normal' },
        { id: 'pw4', category: 'pinwheel', type: 'multiple_choice', question: 'If your pinwheel does not spin, what should you check first?',
          options: ['A) The colour of the paper','B) Whether the pin is too tight','C) The size of the stick','D) The name on the blade'],
          correct: 'B', tileType: 'double' },

        // TEST
        { id: 't1', category: 'test', type: 'multiple_choice', question: 'Why should you throw the paper airplane THREE times during the test?',
          options: ['A) Because three is a lucky number.','B) To get an average and make the test fair.','C) Because one throw always breaks it.','D) Because the teacher said so.'],
          correct: 'B', tileType: 'normal' },
        { id: 't2', category: 'test', type: 'true_false', question: 'A fair test means you change MANY things at the same time. TRUE or FALSE?',
          options: ['TRUE','FALSE'], correct: 'FALSE', tileType: 'normal' },
        { id: 't3', category: 'test', type: 'multiple_choice', question: 'What unit do you use to measure how far a paper airplane flew?',
          options: ['A) Kilograms','B) Seconds','C) Centimetres','D) Litres'],
          correct: 'C', tileType: 'bonus' },
        { id: 't4', category: 'test', type: 'multiple_choice', question: 'What is the correct order of the Design Cycle?',
          options: ['A) Test -> Build -> Plan -> Improve','B) Build -> Plan -> Improve -> Test','C) Plan -> Build -> Test -> Improve','D) Improve -> Test -> Build -> Plan'],
          correct: 'C', tileType: 'expert' },

        // IMPROVE
        { id: 'i1', category: 'improve', type: 'multiple_choice', question: 'Your airplane nose-dives. What is the BEST improvement?',
          options: ['A) Paint it a different colour.','B) Add a paper clip to the nose for more weight.','C) Make the wings smaller.','D) Write your name on it.'],
          correct: 'B', tileType: 'normal' },
        { id: 'i2', category: 'improve', type: 'multiple_choice', question: 'Your pinwheel spins too slowly. What should you do?',
          options: ['A) Use a bigger stick.','B) Curve the blades more to catch more wind.','C) Add more pins to the centre.','D) Use a smaller square of paper.'],
          correct: 'B', tileType: 'challenge' },
        { id: 'i3', category: 'improve', type: 'true_false', question: 'Real inventors stop after the first failed test. TRUE or FALSE?',
          options: ['TRUE','FALSE'], correct: 'FALSE', tileType: 'normal' },
        { id: 'i4', category: 'improve', type: 'multiple_choice', question: 'Complete this sentence: "We changed the wings ___ it turned."',
          options: ['A) to','B) for','C) because','D) with'],
          correct: 'C', tileType: 'speed' },

        // SPEAK
        { id: 's1', category: 'speak', type: 'speaking', question: 'Say a complete sentence: "People invented ___ to ___." Use any invention.',
          options: null, correct: null, tileType: 'normal',
          rubric: ['Uses "to + verb" structure','Names a real invention','Sentence is grammatically correct'] },
        { id: 's2', category: 'speak', type: 'speaking', question: 'Describe your airplane or pinwheel using: "We built a ___ to ___."',
          options: null, correct: null, tileType: 'bonus',
          rubric: ['Names the invention','States the purpose with "to + verb"','Speaks clearly'] },
        { id: 's3', category: 'speak', type: 'speaking', question: 'Say what went wrong in your test and what you changed: "The problem was ___ so we ___."',
          options: null, correct: null, tileType: 'challenge',
          rubric: ['States the problem clearly','Describes the change made','Uses complete sentences'] },
        { id: 's4', category: 'speak', type: 'speaking', question: 'Name THREE inventions and the year or inventor for each one.',
          options: null, correct: null, tileType: 'expert',
          rubric: ['Names 3 inventions','Provides year OR inventor for each','Pronounces inventor names correctly'] }

      ]
    },

    awards: [
      { id: 'designer', icon: '\uD83D\uDCD0', title: 'Blueprint Designer', description: 'Awarded for creating an excellent and detailed blueprint in Mission 4.' },
      { id: 'solver',   icon: '\uD83E\uDDE9', title: 'Problem Solver',     description: 'Awarded for correctly identifying the problems behind inventions in Mission 2.' },
      { id: 'improver', icon: '\uD83D\uDD27', title: 'Master Improver',    description: 'Awarded for making the most effective improvements in Mission 6.' },
      { id: 'tester',   icon: '\uD83E\uDDEA', title: 'Top Tester',         description: 'Awarded for recording the best and most accurate test data in Mission 5.' },
      { id: 'thinker',  icon: '\uD83D\uDCA1', title: 'Critical Thinker',   description: 'Awarded for outstanding analysis and reasoning across all missions.' },
      { id: 'team',     icon: '\uD83E\uDD1D', title: 'Team MVP',           description: 'Awarded for exceptional teamwork, collaboration, and supporting teammates.' },
      { id: 'inventor', icon: '\uD83D\uDDE3\uFE0F', title: 'Star Inventor', description: 'Awarded for the most impressive and confident presentation in Mission 7.' }
    ],

    teamRoles: [
      { id: 'designer', icon: '\uD83D\uDCD0', title: 'Designer',  responsibility: 'Draws the blueprint and labels all parts before building begins.',                              keyPhrase: '"I designed ___ because ___."' },
      { id: 'builder',  icon: '\uD83D\uDD28', title: 'Builder',   responsibility: 'Follows the blueprint to build the invention carefully and accurately.',                       keyPhrase: '"We built ___ using ___."' },
      { id: 'tester',   icon: '\uD83D\uDCCF', title: 'Tester',    responsibility: 'Carries out each test, makes sure the test is fair, and records the results.',                keyPhrase: '"In test ___, it flew/spun ___."' },
      { id: 'recorder', icon: '\uD83D\uDCDD', title: 'Recorder',  responsibility: 'Writes all measurements, results, and observations in the data table.',                       keyPhrase: '"The result was ___ because ___."' },
      { id: 'speaker',  icon: '\uD83C\uDFA4', title: 'Speaker',   responsibility: "Presents the team's invention, results, and improvements to the class.",                      keyPhrase: '"We invented ___ to ___. We improved it by ___."' }
    ]

  }; // end YOUNG_INVENTOR_DATA

  root.YOUNG_INVENTOR_DATA = YOUNG_INVENTOR_DATA;

})(typeof window !== 'undefined' ? window : global);
