/**
 * ============================================================================
 * ISLAND HOMEWORK REVISION PROJECT — MASTER CURRICULUM DATASET
 * Grades 3 & 4 (Units 1, 2, and 3)
 * ============================================================================
 * Official Source Books:
 *  - Grade 3: Macmillan Global Readings 2 (Units 1–3 + Phonics Review pp. 4–55)
 *  - Grade 4: Macmillan Global Readings 3 (Units 1–3 + Literacy Review pp. 4–55)
 *
 * Each Grade -> Unit (unit1, unit2, unit3) contains:
 *  1. Unit Title, Theme, Big Question, Readings, Reading Skill & Phonics Focus
 *  2. Core Vocabulary List (word, partOfSpeech, clue, emoji, imageKeyword, sampleSentence, page)
 *  3. Key Grammar & Sentence Structures (rules, qaPatterns, dialogues)
 *  4. Speaking & Listening Prompts (calibrated for Web Speech API TTS/STT)
 *  5. 3 Playable Island Checkpoints:
 *     - checkpoint1 (Vocabulary Lagoon): wordMatching, missingLetters, listenAndPick
 *     - checkpoint2 (Grammar Bridge): sentenceBuilder, fillInTheBlank
 *     - checkpoint3 (Island Boss Temple): bossQuiz & dialogueChallenge
 * ============================================================================
 */

(function (root) {
  'use strict';

  const ISLAND_CURRICULUM_DATA = {
    meta: {
      projectTitle: 'Island Homework Revision Project',
      version: '1.0.0',
      ttsConfig: {
        lang: 'en-US',
        rate: 0.88,
        pitch: 1.05
      },
      sourceFiles: {
        grade3: [
          'assets/books/global-readings-2/Global-Readings-2.pdf',
          'lesson-plans/Grade3-Unit2-Lesson-Plans.pdf',
          'lesson-plans/Grade3-Chuseok-Cooking-Lesson-Plans.pdf',
          'lesson-plans/Grade3-Cooking-Recipe-Cards-and-Letter.pdf',
          'lesson-plans/Grade3-Chuseok-Arcade-Day-Lesson-Plan.pdf',
          'lesson-plans/Grade3-Unit3-Lesson-Plans.pdf',
          'lesson-plans/Grade3-Unit3-Arctic-Words-Lesson-Plan.pdf',
          'lesson-plans/Grade3-Unit3-Word-City-Lesson-Plan.pdf',
          'lesson-plans/Grade3-Unit3-Board-Game-Lesson-Plan.pdf',
          'lesson-plans/Grade3-Week4-School-Life-Lesson-Plan.pdf'
        ],
        grade4: [
          'assets/books/global-readings-3/Global-Readings-3.pdf',
          'lesson-plans/Grade4-Unit2-Lesson-Plans.pdf',
          'lesson-plans/Grade4-Units1-2-Revision-Lesson-Plans.pdf',
          'lesson-plans/Grade4-Revision-Worksheet-A-B-Key.pdf',
          'lesson-plans/Grade4-Unit3-Lesson-Plans.pdf',
          'lesson-plans/Grade4-Unit3-Board-Game-Lesson-Plan.pdf',
          'lesson-plans/Grade4-Week4-Classroom-Rules-Lesson-Plan.pdf',
          'lesson-plans/Unit3-Games-Guide.pdf'
        ]
      }
    },

    // =========================================================================
    // GRADE 3 — GLOBAL READINGS 2 (UNITS 1, 2, 3)
    // =========================================================================
    grade3: {
      gradeNumber: 3,
      gradeLabel: '3rd Grade',
      bookTitle: 'Global Readings 2',
      phonicsReview: {
        pages: 'pp. 4–7',
        longVowels: ['cake', 'lake', 'tape', 'rain', 'tree', 'leaf', 'bike', 'kite', 'rope', 'nose', 'bone', 'cube', 'tube', 'flute'],
        blendsAndDigraphs: ['ship', 'shop', 'fish', 'bench', 'chips', 'star', 'nest', 'flag', 'frog']
      },

      // -----------------------------------------------------------------------
      // GRADE 3 — UNIT 1: WHAT DOES IT DO?
      // -----------------------------------------------------------------------
      unit1: {
        unitNumber: 1,
        unitId: 'g3-unit1',
        islandName: 'Inventor Workshop Island',
        title: 'What Does It Do?',
        theme: 'Inventions, Problem-Solving, Sequence Steps, and Biomimicry (Nature-Inspired Ideas)',
        bigQuestion: 'How do inventions solve problems and make our lives easier?',
        book: 'Global Readings 2',
        pages: 'pp. 8–23',
        readings: {
          reading1: {
            title: 'The After-School Inventor',
            genre: 'Realistic Fiction',
            pages: 'pp. 10–13',
            summary: 'Clara Doodle tries to invent a machine to clean her messy bedroom and learns to test her plans and try again when an invention fails.'
          },
          reading2: {
            title: 'My Good Ideas Book',
            genre: 'Informational Text / Notebook',
            pages: 'pp. 16–19',
            summary: 'Explores famous inventors (Thomas Edison, Leonardo da Vinci, Karl Benz) and how nature inspires inventions like Velcro (from burrs) and the bullet train (from the kingfisher beak).'
          }
        },
        readingSkill: 'Sequence of Events (First, Second, Third, Next, Then, Last)',
        phonicsFocus: {
          pattern: 'cl-',
          title: 'Initial Consonant Blend cl-',
          description: 'Words beginning with the consonant blend cl- from Clara Doodle’s story.',
          targetWords: ['Clara', 'class', 'classroom', 'clock', 'clean', 'cleaned', 'climb', 'climbed', 'closer', 'close', 'clown', 'clap', 'cloud']
        },

        vocabulary: [
          {
            word: 'invent',
            partOfSpeech: 'verb',
            clue: 'To design or create something new that has never been made before.',
            emoji: '💡',
            imageKeyword: 'lightbulb-invent',
            sampleSentence: 'Clara wanted to invent a machine to clean her messy room.',
            page: 9
          },
          {
            word: 'invention',
            partOfSpeech: 'noun',
            clue: 'A useful new machine, tool, or gadget that someone created.',
            emoji: '⚙️',
            imageKeyword: 'invention-machine',
            sampleSentence: 'The electric lightbulb was a famous invention by Thomas Edison.',
            page: 15
          },
          {
            word: 'try again',
            partOfSpeech: 'phrase',
            clue: 'To make another effort and not give up when your first plan fails.',
            emoji: '🔄',
            imageKeyword: 'try-again',
            sampleSentence: 'When Clara’s first machine did not work, she decided to try again.',
            page: 9
          },
          {
            word: 'change',
            partOfSpeech: 'verb',
            clue: 'To make something different so it works better.',
            emoji: '🔧',
            imageKeyword: 'wrench-change',
            sampleSentence: 'Good inventors change their plans when they find a problem.',
            page: 9
          },
          {
            word: 'mirror',
            partOfSpeech: 'noun',
            clue: 'A smooth piece of glass where you can see your own reflection.',
            emoji: '🪞',
            imageKeyword: 'mirror',
            sampleSentence: 'Clara looked into the mirror and thought about her new idea.',
            page: 9
          },
          {
            word: 'mess',
            partOfSpeech: 'noun',
            clue: 'A dirty or untidy state where things are scattered everywhere.',
            emoji: '🧺',
            imageKeyword: 'messy-room',
            sampleSentence: 'Clara had a big problem because her bedroom was a mess.',
            page: 9
          },
          {
            word: 'machine',
            partOfSpeech: 'noun',
            clue: 'A piece of equipment with moving parts that does work for us.',
            emoji: '🤖',
            imageKeyword: 'robot-machine',
            sampleSentence: 'First, Clara drew a plan for a room-cleaning machine.',
            page: 10
          },
          {
            word: 'problem',
            partOfSpeech: 'noun',
            clue: 'Something difficult that needs to be fixed or solved.',
            emoji: '❓',
            imageKeyword: 'problem-puzzle',
            sampleSentence: 'Every great invention starts with a problem to solve.',
            page: 14
          },
          {
            word: 'solution',
            partOfSpeech: 'noun',
            clue: 'The answer or way to fix a problem.',
            emoji: '✅',
            imageKeyword: 'solution-check',
            sampleSentence: 'Clara wrote her problem and her solution in her notebook.',
            page: 14
          },
          {
            word: 'plan',
            partOfSpeech: 'noun',
            clue: 'A drawing or list of steps showing how you will make something.',
            emoji: '📐',
            imageKeyword: 'blueprint-plan',
            sampleSentence: 'Leonardo da Vinci drew a careful plan for a flying machine.',
            page: 16
          },
          {
            word: 'improve',
            partOfSpeech: 'verb',
            clue: 'To make an object or idea better than it was before.',
            emoji: '📈',
            imageKeyword: 'improve-upgrade',
            sampleSentence: 'Engineers copied the kingfisher’s beak to improve the bullet train.',
            page: 17
          },
          {
            word: 'parachute',
            partOfSpeech: 'noun',
            clue: 'A large cloth umbrella-like device that helps people float safely down from the sky.',
            emoji: '🪂',
            imageKeyword: 'parachute',
            sampleSentence: 'Leonardo da Vinci designed an early pyramid-shaped parachute.',
            page: 16
          },
          {
            word: 'hexagon',
            partOfSpeech: 'noun',
            clue: 'A flat shape with six straight sides, like a bee’s honeycomb cell.',
            emoji: '🐝',
            imageKeyword: 'hexagon-honeycomb',
            sampleSentence: 'Bees build strong honeycomb walls using a six-sided hexagon shape.',
            page: 18
          },
          {
            word: 'eraser',
            partOfSpeech: 'noun',
            clue: 'A small rubber tool used to rub out pencil mistakes.',
            emoji: '✏️',
            imageKeyword: 'pencil-eraser',
            sampleSentence: 'What does an eraser do? It cleans pencil marks off the paper.',
            page: 20
          },
          {
            word: 'tidy',
            partOfSpeech: 'adjective',
            clue: 'Neat, clean, and with everything put in the right place.',
            emoji: '✨',
            imageKeyword: 'tidy-room',
            sampleSentence: 'At last, Clara’s bedroom was clean and tidy.',
            page: 13
          }
        ],

        grammar: {
          rules: [
            {
              title: 'Asking & Answering About Function (Present Simple 3rd Person -s)',
              formula: 'What does it do? -> It + verb(-s/-es) + object.',
              explanation: 'Use "What does it do?" to ask about a machine or invention. Add -s or -es to the action verb when talking about "it".',
              examples: [
                'What does it do? It cleans the messy bedroom.',
                'What does the eraser do? It rubs out pencil marks.',
                'What does the alarm clock do? It wakes me up in the morning.'
              ]
            },
            {
              title: 'Sequence Words for Step-by-Step Instructions',
              formula: 'First, ... / Second, ... / Third, ... / Last, ...',
              explanation: 'Use sequence words at the beginning of a sentence followed by a comma to show the order of steps.',
              examples: [
                'First, think of a problem you want to solve.',
                'Second, draw a careful plan in your notebook.',
                'Third, build and test your invention.',
                'Last, change your plan and try again if it does not work!'
              ]
            },
            {
              title: 'Stating Problems, Solutions, and Purpose (to + verb)',
              formula: 'I have a problem. My [noun] is [adjective]. -> I made a [noun] to + [base verb].',
              explanation: 'Use "to + base verb" to explain why you made an invention or what problem it solves.',
              examples: [
                'I have a problem. My bedroom is a mess.',
                'Clara built a machine to clean her room.',
                'People use a parachute to float safely down to the ground.'
              ]
            }
          ],
          qaPatterns: [
            {
              question: 'What does your invention do?',
              answer: 'It cleans my room and puts away my toys.',
              focus: 'Present Simple function with -s'
            },
            {
              question: 'What is the problem in Clara’s room?',
              answer: 'The problem is that her bedroom is a big mess.',
              focus: 'Problem & Solution'
            },
            {
              question: 'What do you do first when you invent something?',
              answer: 'First, I draw a plan in my Good Ideas Book.',
              focus: 'Sequence words'
            },
            {
              question: 'What should an inventor do when a plan fails?',
              answer: 'An inventor should change the plan and try again.',
              focus: 'Unit theme & advice'
            }
          ],
          dialogues: [
            {
              title: 'In the After-School Inventor Club',
              lines: [
                { speaker: 'Teacher', text: 'Welcome to the Inventor Club! What is your problem today?' },
                { speaker: 'Clara', text: 'I have a problem. My bedroom is a big mess!' },
                { speaker: 'Teacher', text: 'What is your solution, Clara?' },
                { speaker: 'Clara', text: 'First, I drew a plan for a cleaning machine.' },
                { speaker: 'Teacher', text: 'Cool! What does it do?' },
                { speaker: 'Clara', text: 'It picks up clothes and cleans the floor!' }
              ]
            }
          ]
        },

        speakingPrompts: [
          {
            id: 'g3-u1-sp1',
            text: 'What does it do? It cleans my messy bedroom.',
            focus: 'Present simple function question & answer',
            promptType: 'repeat_and_answer',
            targetKeywords: ['what', 'does', 'it', 'do', 'cleans', 'bedroom'],
            hint: 'Remember to say "cleans" with an -s sound!'
          },
          {
            id: 'g3-u1-sp2',
            text: 'First, draw a plan. Second, build the machine. Last, test it!',
            focus: 'Sequence words (First, Second, Last)',
            promptType: 'sequence_speaking',
            targetKeywords: ['first', 'plan', 'second', 'build', 'last', 'test'],
            hint: 'Pause slightly after First, Second, and Last.'
          },
          {
            id: 'g3-u1-sp3',
            text: 'When my invention does not work, I change my plan and try again.',
            focus: 'Core unit vocabulary in context',
            promptType: 'read_aloud',
            targetKeywords: ['invention', 'change', 'plan', 'try', 'again'],
            hint: 'Speak clearly on the cl- and tr- blends!'
          },
          {
            id: 'g3-u1-sp4',
            text: 'Clara looked at the clock in her clean classroom.',
            focus: 'Phonics cl- blend pronunciation',
            promptType: 'phonics_drill',
            targetKeywords: ['clara', 'clock', 'clean', 'classroom'],
            hint: 'Make a crisp "cl" sound at the start of Clara, clock, clean, and classroom.'
          }
        ],

        checkpoints: {
          checkpoint1: {
            id: 'g3-u1-cp1',
            title: 'Vocabulary Lagoon',
            subtitle: 'Inventor Words & cl- Phonics',
            wordMatching: [
              { word: 'invent', clue: 'To create something new that has never been made before', emoji: '💡', imageKeyword: 'lightbulb-invent' },
              { word: 'invention', clue: 'A useful new machine or tool created by an inventor', emoji: '⚙️', imageKeyword: 'invention-machine' },
              { word: 'try again', clue: 'To make another effort when your first plan does not work', emoji: '🔄', imageKeyword: 'try-again' },
              { word: 'change', clue: 'To make something different so it works better', emoji: '🔧', imageKeyword: 'wrench-change' },
              { word: 'mirror', clue: 'A smooth glass surface where you see your reflection', emoji: '🪞', imageKeyword: 'mirror' },
              { word: 'mess', clue: 'An untidy room with clothes and toys everywhere', emoji: '🧺', imageKeyword: 'messy-room' },
              { word: 'machine', clue: 'A device with moving parts that does work for us', emoji: '🤖', imageKeyword: 'robot-machine' },
              { word: 'problem', clue: 'Something difficult that needs a solution', emoji: '❓', imageKeyword: 'problem-puzzle' },
              { word: 'solution', clue: 'A smart way to fix or solve a problem', emoji: '✅', imageKeyword: 'solution-check' },
              { word: 'improve', clue: 'To make an invention better than before', emoji: '📈', imageKeyword: 'improve-upgrade' },
              { word: 'parachute', clue: 'A cloth device that helps you float safely down from the sky', emoji: '🪂', imageKeyword: 'parachute' },
              { word: 'hexagon', clue: 'A six-sided shape used by bees to build honeycombs', emoji: '🐝', imageKeyword: 'hexagon-honeycomb' }
            ],
            missingLetters: [
              { word: 'invent', masked: 'i n _ e n _', missingLetters: ['v', 't'], unscrambleTiles: ['i', 'n', 'v', 'e', 'n', 't'], clue: 'To create something brand new', emoji: '💡' },
              { word: 'mirror', masked: 'm i _ _ o r', missingLetters: ['r', 'r'], unscrambleTiles: ['m', 'i', 'r', 'r', 'o', 'r'], clue: 'You look into this glass to see yourself', emoji: '🪞' },
              { word: 'machine', masked: 'm a _ h i _ e', missingLetters: ['c', 'n'], unscrambleTiles: ['m', 'a', 'c', 'h', 'i', 'n', 'e'], clue: 'Clara built one to clean her room', emoji: '🤖' },
              { word: 'problem', masked: 'p r o _ l e _', missingLetters: ['b', 'm'], unscrambleTiles: ['p', 'r', 'o', 'b', 'l', 'e', 'm'], clue: 'Something that needs to be fixed', emoji: '❓' },
              { word: 'solution', masked: 's o l _ t i _ n', missingLetters: ['u', 'o'], unscrambleTiles: ['s', 'o', 'l', 'u', 't', 'i', 'o', 'n'], clue: 'The answer to a problem', emoji: '✅' },
              { word: 'change', masked: 'c h a _ g _', missingLetters: ['n', 'e'], unscrambleTiles: ['c', 'h', 'a', 'n', 'g', 'e'], clue: 'To make your plan different', emoji: '🔧' },
              { word: 'improve', masked: 'i m p _ o v _', missingLetters: ['r', 'e'], unscrambleTiles: ['i', 'm', 'p', 'r', 'o', 'v', 'e'], clue: 'To make something work even better', emoji: '📈' },
              { word: 'hexagon', masked: 'h e _ a g o _', missingLetters: ['x', 'n'], unscrambleTiles: ['h', 'e', 'x', 'a', 'g', 'o', 'n'], clue: 'A shape with six straight sides', emoji: '🐝' },
              { word: 'parachute', masked: 'p a r a _ h u _ e', missingLetters: ['c', 't'], unscrambleTiles: ['p', 'a', 'r', 'a', 'c', 'h', 'u', 't', 'e'], clue: 'Helps a skydiver float down slowly', emoji: '🪂' },
              { word: 'eraser', masked: 'e r a _ e _', missingLetters: ['s', 'r'], unscrambleTiles: ['e', 'r', 'a', 's', 'e', 'r'], clue: 'Rubs out pencil mistakes', emoji: '✏️' }
            ],
            listenAndPick: [
              {
                say: 'Clara wanted to invent a machine to clean her messy bedroom.',
                prompt: 'Which word did you hear for creating something brand new?',
                options: ['invent', 'mirror', 'hexagon', 'parachute'],
                answer: 'invent',
                emoji: '💡'
              },
              {
                say: 'When the machine broke, Clara decided to change her plan and try again.',
                prompt: 'What did Clara decide to do when her machine broke?',
                options: ['try again', 'go to sleep', 'buy a mirror', 'draw a hexagon'],
                answer: 'try again',
                emoji: '🔄'
              },
              {
                say: 'Bees build strong honeycombs using a six-sided hexagon shape.',
                prompt: 'Which shape did you hear?',
                options: ['hexagon', 'eraser', 'problem', 'mirror'],
                answer: 'hexagon',
                emoji: '🐝'
              },
              {
                say: 'Leonardo da Vinci drew a plan for a pyramid-shaped parachute.',
                prompt: 'Which invention did Leonardo da Vinci draw?',
                options: ['parachute', 'eraser', 'mirror', 'clock'],
                answer: 'parachute',
                emoji: '🪂'
              },
              {
                say: 'Clara looked at the clock in her clean classroom.',
                prompt: 'Which initial blend do Clara, clock, clean, and classroom share?',
                options: ['cl-', 'st-', 'sh-', 'fr-'],
                answer: 'cl-',
                emoji: '🕰️'
              },
              {
                say: 'Every invention has a problem and a smart solution.',
                prompt: 'Which word means the answer that fixes a problem?',
                options: ['solution', 'mess', 'mirror', 'problem'],
                answer: 'solution',
                emoji: '✅'
              }
            ]
          },

          checkpoint2: {
            id: 'g3-u1-cp2',
            title: 'Grammar Bridge',
            subtitle: 'Sequence Words & "What Does It Do?"',
            sentenceBuilder: [
              {
                words: ['What', 'does', 'your', 'new', 'invention', 'do?'],
                answer: 'What does your new invention do?',
                hint: 'Start with the question word "What" followed by "does".',
                grammarFocus: 'Asking about function'
              },
              {
                words: ['It', 'cleans', 'my', 'messy', 'bedroom', 'quickly.'],
                answer: 'It cleans my messy bedroom quickly.',
                hint: 'Start with "It" and use the verb with -s ("cleans").',
                grammarFocus: 'Present simple 3rd person -s'
              },
              {
                words: ['First,', 'Clara', 'draws', 'a', 'careful', 'plan.'],
                answer: 'First, Clara draws a careful plan.',
                hint: 'Begin with the sequence word "First,".',
                grammarFocus: 'Sequence words'
              },
              {
                words: ['Second,', 'she', 'builds', 'the', 'cleaning', 'machine.'],
                answer: 'Second, she builds the cleaning machine.',
                hint: 'Begin with the sequence word "Second,".',
                grammarFocus: 'Sequence words'
              },
              {
                words: ['Last,', 'she', 'tests', 'her', 'new', 'machine.'],
                answer: 'Last, she tests her new machine.',
                hint: 'Begin with the final sequence word "Last,".',
                grammarFocus: 'Sequence words'
              },
              {
                words: ['I', 'have', 'a', 'problem', 'with', 'my', 'room.'],
                answer: 'I have a problem with my room.',
                hint: 'Start with "I have a problem...".',
                grammarFocus: 'Problem & solution statements'
              },
              {
                words: ['Clara', 'made', 'a', 'machine', 'to', 'clean', 'her', 'room.'],
                answer: 'Clara made a machine to clean her room.',
                hint: 'Use "to clean" to show the purpose of the machine.',
                grammarFocus: 'Infinitive of purpose (to + verb)'
              },
              {
                words: ['Engineers', 'copied', 'nature', 'to', 'improve', 'the', 'train.'],
                answer: 'Engineers copied nature to improve the train.',
                hint: 'Use "to improve" after "Engineers copied nature".',
                grammarFocus: 'Infinitive of purpose (to + verb)'
              }
            ],
            fillInTheBlank: [
              {
                sentence: 'What ___ this new machine do?',
                options: ['does', 'do', 'is', 'are'],
                answer: 'does',
                grammarFocus: 'Question formation with "it / this machine"',
                hint: 'Use "does" for singular subjects like "it" or "this machine".'
              },
              {
                sentence: 'My robot helper ___ up all the toys on the floor.',
                options: ['picks', 'pick', 'picking', 'picked'],
                answer: 'picks',
                grammarFocus: 'Present Simple 3rd-person singular (-s)',
                hint: 'Add -s to the verb when talking about what one machine does.'
              },
              {
                sentence: '___, draw a plan. Second, gather your tools. Last, build it!',
                options: ['First', 'Last', 'Third', 'Because'],
                answer: 'First',
                grammarFocus: 'Sequence of events',
                hint: 'Which word comes before "Second"?'
              },
              {
                sentence: 'First, we test the machine. Second, we fix the wheels. ___, we try it again!',
                options: ['Last', 'First', 'Before', 'Why'],
                answer: 'Last',
                grammarFocus: 'Sequence of events',
                hint: 'Which sequence word marks the final step?'
              },
              {
                sentence: 'Clara built an invention ___ clean her messy room.',
                options: ['to', 'for', 'at', 'by'],
                answer: 'to',
                grammarFocus: 'Purpose (to + base verb)',
                hint: 'Use "to + verb" to explain why she built it.'
              },
              {
                sentence: 'I have a big ___. My desk is a mess! I need a solution.',
                options: ['problem', 'mirror', 'hexagon', 'parachute'],
                answer: 'problem',
                grammarFocus: 'Problem and Solution pairing',
                hint: 'A solution fixes a ___.'
              },
              {
                sentence: 'What does an eraser do? It ___ pencil marks off the page.',
                options: ['cleans', 'clean', 'cleaning', 'cleaned'],
                answer: 'cleans',
                grammarFocus: 'Present Simple 3rd-person singular (-s)',
                hint: 'With "It", use the verb ending in -s.'
              },
              {
                sentence: 'When an invention does not work, you should change your plan and ___ again.',
                options: ['try', 'tries', 'trying', 'tried'],
                answer: 'try',
                grammarFocus: 'Modal "should" + base verb',
                hint: 'After "should", use the base verb without -s.'
              }
            ]
          },

          checkpoint3: {
            id: 'g3-u1-cp3',
            title: 'Island Boss Temple',
            subtitle: 'Master Inventor Showdown',
            bossName: 'Professor Gearbot',
            bossEmoji: '🤖',
            bossIntro: 'Welcome to the Inventor Temple! Prove you know Clara’s story, nature inventions, cl- phonics, and how machines work!',
            bossQuiz: [
              {
                id: 'g3-u1-b1',
                type: 'reading',
                category: 'Reading Comprehension',
                passage: 'After school, Clara Doodle went to her bedroom. Clothes and books were everywhere. "My room is a mess!" she said. She opened her notebook and drew a plan for a cleaning machine.',
                question: 'Why did Clara want to build a machine?',
                options: [
                  'Because her bedroom was a mess and she wanted to clean it.',
                  'Because she wanted to fly to the moon.',
                  'Because her clock was broken.',
                  'Because she lost her pet frog.'
                ],
                answer: 'Because her bedroom was a mess and she wanted to clean it.',
                explanation: 'Clara’s problem was her messy bedroom, so her solution was to invent a cleaning machine.'
              },
              {
                id: 'g3-u1-b2',
                type: 'reading',
                category: 'Reading Comprehension (Biomimicry)',
                passage: 'In "My Good Ideas Book", engineers looked closely at nature. Plant burrs stuck to a dog’s fur, giving the idea for Velcro. A kingfisher bird diving smoothly into water inspired the shape of the fast bullet train.',
                question: 'Which animal inspired engineers to improve the nose of the high-speed bullet train?',
                options: [
                  'The kingfisher bird',
                  'The honeybee',
                  'A polar bear',
                  'A green frog'
                ],
                answer: 'The kingfisher bird',
                explanation: 'The long, pointed beak of the kingfisher helped engineers make the bullet train quieter and faster.'
              },
              {
                id: 'g3-u1-b3',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'Which famous inventor made a practical electric lightbulb after trying more than a thousand times?',
                options: ['Thomas Edison', 'Karl Benz', 'Clara Doodle', 'Wen Shu'],
                answer: 'Thomas Edison',
                explanation: 'Thomas Edison is featured in "My Good Ideas Book" for inventing the lightbulb and never giving up.'
              },
              {
                id: 'g3-u1-b4',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'Bees build their honeycombs using a strong six-sided shape. What is this shape called?',
                options: ['A hexagon', 'A mirror', 'A parachute', 'An eraser'],
                answer: 'A hexagon',
                explanation: 'A hexagon is a six-sided polygon that bees use in honeycombs.'
              },
              {
                id: 'g3-u1-b5',
                type: 'grammar',
                category: 'Grammar & Sequence',
                question: 'Put Clara’s invention steps in the right order: (1) Test the machine, (2) Draw a plan, (3) Build the machine.',
                options: [
                  'First, draw a plan. Second, build the machine. Last, test the machine.',
                  'First, test the machine. Second, draw a plan. Last, build the machine.',
                  'First, build the machine. Second, test the machine. Last, draw a plan.',
                  'Last, draw a plan. First, build the machine. Second, test the machine.'
                ],
                answer: 'First, draw a plan. Second, build the machine. Last, test the machine.',
                explanation: 'Inventors first plan their idea, second build it, and last test it.'
              },
              {
                id: 'g3-u1-b6',
                type: 'dialogue',
                category: 'Real-Life Dialogue Q&A',
                speakerA: 'Inventor Max: Look at my new Homework Helper 3000!',
                speakerB: 'You: Wow! ___',
                question: 'Which question asks about the function of Max’s machine?',
                options: [
                  'What does it do?',
                  'Where did it fall?',
                  'How much is the goat?',
                  'Why are you thankful?'
                ],
                answer: 'What does it do?',
                explanation: '"What does it do?" is the unit’s core question for asking how an invention works.'
              },
              {
                id: 'g3-u1-b7',
                type: 'dialogue',
                category: 'Real-Life Dialogue Q&A',
                speakerA: 'You: What does your Homework Helper machine do?',
                speakerB: 'Inventor Max: ___',
                question: 'Choose the grammatically correct answer:',
                options: [
                  'It sharpens pencils and cleans erasers.',
                  'It sharpen pencils and clean erasers.',
                  'It sharpening pencils and cleaning erasers.',
                  'They sharpens a pencil.'
                ],
                answer: 'It sharpens pencils and cleans erasers.',
                explanation: 'With "It", present simple verbs take an -s ending ("sharpens", "cleans").'
              },
              {
                id: 'g3-u1-b8',
                type: 'phonics',
                category: 'Phonics (cl- blend)',
                question: 'Which set of words ALL begin with the same initial consonant blend as "Clara"?',
                options: [
                  'clock, clean, classroom, climb',
                  'ship, shop, shark, shell',
                  'tree, train, truck, trap',
                  'frog, flag, flute, flower'
                ],
                answer: 'clock, clean, classroom, climb',
                explanation: 'All four words start with the initial consonant blend "cl-".'
              },
              {
                id: 'g3-u1-b9',
                type: 'phonics',
                category: 'Phonics Review (Long Vowels)',
                question: 'From the Phonics Review (pp. 4–7), which word has the same long vowel sound as "cake" and "lake"?',
                options: ['tape', 'cube', 'nose', 'kite'],
                answer: 'tape',
                explanation: '"cake", "lake", and "tape" all share the long A (a_e) vowel pattern.'
              },
              {
                id: 'g3-u1-b10',
                type: 'reading',
                category: 'Inventor Mindset',
                question: 'What is the most important lesson Clara learns in "The After-School Inventor"?',
                options: [
                  'If your first plan does not work, change your plan and try again.',
                  'Never build machines after school.',
                  'Always leave your bedroom in a mess.',
                  'Only grown-ups can invent things.'
                ],
                answer: 'If your first plan does not work, change your plan and try again.',
                explanation: 'Unit 1 teaches perseverance: testing, changing the plan, and trying again.'
              }
            ]
          }
        }
      },

      // -----------------------------------------------------------------------
      // GRADE 3 — UNIT 2: THANK YOU
      // -----------------------------------------------------------------------
      unit2: {
        unitNumber: 2,
        unitId: 'g3-unit2',
        islandName: 'Harvest Moon Island',
        title: 'Thank You',
        theme: 'Gratitude, Harvest Festivals (Chuseok in Korea), and Growing Food on Mars',
        bigQuestion: 'Why do people celebrate the harvest and give thanks?',
        book: 'Global Readings 2',
        pages: 'pp. 24–39',
        readings: {
          reading1: {
            title: 'Chuseok: Korea’s Harvest Festival',
            genre: 'Informational Cultural Text',
            pages: 'pp. 26–29',
            summary: 'Explains how families in Korea celebrate Chuseok by traveling to their hometowns, honoring ancestors, making songpyeon rice cakes, and playing traditional games.'
          },
          reading2: {
            title: 'First Harvest',
            genre: 'Science Fiction Story',
            pages: 'pp. 32–35',
            summary: 'A family living on Mars grows vegetables inside an indoor space farm and celebrates their very first Mars harvest feast together.'
          }
        },
        readingSkill: 'Identifying the Setting (Where and When a Story Takes Place) & Comparing Festivals',
        phonicsFocus: {
          pattern: '-st',
          title: 'Final Consonant Blend -st',
          description: 'Words ending with the consonant blend -st from the harvest readings.',
          targetWords: ['harvest', 'feast', 'contest', 'fast', 'last', 'lost', 'best', 'test', 'first', 'list', 'nest']
        },

        vocabulary: [
          {
            word: 'harvest',
            partOfSpeech: 'noun / verb',
            clue: 'The time of year when farmers gather ripe crops from the fields.',
            emoji: '🌾',
            imageKeyword: 'harvest-crops',
            sampleSentence: 'In autumn, families celebrate the harvest and give thanks for food.',
            page: 25
          },
          {
            word: 'festival',
            partOfSpeech: 'noun',
            clue: 'A special holiday or celebration with music, food, and games.',
            emoji: '🏮',
            imageKeyword: 'lantern-festival',
            sampleSentence: 'Chuseok is a famous three-day harvest festival in Korea.',
            page: 25
          },
          {
            word: 'ancestors',
            partOfSpeech: 'noun',
            clue: 'Family members who lived a long time ago, before your grandparents.',
            emoji: '🙇',
            imageKeyword: 'family-ancestors',
            sampleSentence: 'During Chuseok, families bow and thank their ancestors.',
            page: 26
          },
          {
            word: 'feast',
            partOfSpeech: 'noun',
            clue: 'A large, special meal with many delicious dishes for a celebration.',
            emoji: '🍱',
            imageKeyword: 'holiday-feast',
            sampleSentence: 'There is a big feast on the table for the whole family.',
            page: 27
          },
          {
            word: 'songpyeon',
            partOfSpeech: 'noun',
            clue: 'Traditional Korean half-moon shaped rice cakes filled with sweet sesame or beans.',
            emoji: '🥟',
            imageKeyword: 'songpyeon-rice-cake',
            sampleSentence: 'We make half-moon rice cakes called songpyeon during Chuseok.',
            page: 27
          },
          {
            word: 'weave',
            partOfSpeech: 'verb',
            clue: 'To cross threads over and under each other to make cloth.',
            emoji: '🧶',
            imageKeyword: 'weave-loom',
            sampleSentence: 'Long ago, women gathered together to weave cloth under the full moon.',
            page: 25
          },
          {
            word: 'cloth',
            partOfSpeech: 'noun',
            clue: 'Woven fabric made from cotton, silk, or wool used for making clothes.',
            emoji: '🧣',
            imageKeyword: 'woven-cloth',
            sampleSentence: 'The two teams had a contest to see who could weave the most cloth.',
            page: 25
          },
          {
            word: 'contest',
            partOfSpeech: 'noun',
            clue: 'A game or competition where people try to win a prize.',
            emoji: '🏆',
            imageKeyword: 'trophy-contest',
            sampleSentence: 'The village held a weaving contest during the harvest festival.',
            page: 25
          },
          {
            word: 'pick',
            partOfSpeech: 'verb',
            clue: 'To gather ripe fruits or vegetables from plants using your hands.',
            emoji: '🍎',
            imageKeyword: 'pick-fruit',
            sampleSentence: 'It is time to pick the ripe vegetables in the greenhouse.',
            page: 31
          },
          {
            word: 'grow',
            partOfSpeech: 'verb',
            clue: 'To get bigger and develop from a seed into a plant.',
            emoji: '🌱',
            imageKeyword: 'plant-grow',
            sampleSentence: 'Scientists grow potatoes and lettuce inside the Mars farm.',
            page: 31
          },
          {
            word: 'worried',
            partOfSpeech: 'adjective',
            clue: 'Feeling nervous or afraid that something bad might happen.',
            emoji: '😟',
            imageKeyword: 'worried-face',
            sampleSentence: 'At first, the boy was worried that the plants would not grow on Mars.',
            page: 31
          },
          {
            word: 'believe',
            partOfSpeech: 'verb',
            clue: 'To feel sure that something is true or possible.',
            emoji: '🌟',
            imageKeyword: 'believe-star',
            sampleSentence: 'He could not believe his eyes when he saw the big pink potatoes.',
            page: 31
          },
          {
            word: 'stripes',
            partOfSpeech: 'noun',
            clue: 'Long lines of different colors next to each other.',
            emoji: '🌈',
            imageKeyword: 'colorful-stripes',
            sampleSentence: 'Traditional Chuseok hanbok sleeves often have bright rainbow stripes.',
            page: 28
          },
          {
            word: 'space suit',
            partOfSpeech: 'noun',
            clue: 'Special protective clothing that astronauts wear outside in space or on Mars.',
            emoji: '🧑‍🚀',
            imageKeyword: 'astronaut-spacesuit',
            sampleSentence: 'You must put on a space suit before walking outside on Mars.',
            page: 32
          },
          {
            word: 'setting',
            partOfSpeech: 'noun',
            clue: 'Where and when a story happens (the place and time).',
            emoji: '🪐',
            imageKeyword: 'mars-setting',
            sampleSentence: 'The setting of "First Harvest" is a space colony on Mars in the future.',
            page: 34
          }
        ],

        grammar: {
          rules: [
            {
              title: 'Expressing Gratitude (I am / We are thankful for...)',
              formula: 'I am thankful for + [noun / gerund]. / We are thankful for + [noun].',
              explanation: 'Use "thankful for" after "am / is / are" to say what you appreciate.',
              examples: [
                'I am thankful for my family and delicious food.',
                'We are thankful for a big autumn harvest.',
                'She is thankful for her grandparents.'
              ]
            },
            {
              title: 'Describing Scenes with There is / There are',
              formula: 'There is + a/an [singular noun]. / There are + [plural noun].',
              explanation: 'Use "There is" for one thing (or uncountable nouns) and "There are" for two or more things.',
              examples: [
                'There is a big feast on the table.',
                'There is a full moon in the night sky.',
                'There are pink potatoes in the Mars greenhouse.',
                'There are many sweet songpyeon rice cakes.'
              ]
            },
            {
              title: 'Asking & Answering Reasons (Why...? / Because...)',
              formula: 'Why + [question]? -> Because + [subject + verb].',
              explanation: 'Use "Why" to ask for a reason and "Because" to give the reason.',
              examples: [
                'Why do people celebrate Chuseok? Because they are thankful for the autumn harvest.',
                'Why do astronauts wear a space suit on Mars? Because there is no air to breathe outside.'
              ]
            }
          ],
          qaPatterns: [
            {
              question: 'What are you thankful for?',
              answer: 'I am thankful for my family, my friends, and healthy food.',
              focus: 'Expressing gratitude'
            },
            {
              question: 'What is on the Chuseok table?',
              answer: 'There is a big feast and there are sweet songpyeon rice cakes.',
              focus: 'There is / There are'
            },
            {
              question: 'Why was the boy worried in "First Harvest"?',
              answer: 'Because it was hard to grow food on Mars.',
              focus: 'Why / Because'
            },
            {
              question: 'Can we go outside on Mars without a space suit?',
              answer: 'No, we cannot. We must wear a space suit.',
              focus: 'Permission / Modals (Can / Must)'
            }
          ],
          dialogues: [
            {
              title: 'Celebrating the Harvest Feast',
              lines: [
                { speaker: 'Grandma', text: 'Happy Chuseok, everyone! Look at the full moon.' },
                { speaker: 'Minjun', text: 'Wow, there is a big feast on the table! And there are songpyeon rice cakes!' },
                { speaker: 'Grandma', text: 'Why do we make songpyeon and bow today, Minjun?' },
                { speaker: 'Minjun', text: 'Because we thank our ancestors for the autumn harvest!' },
                { speaker: 'Grandma', text: 'That is right. What are you thankful for this year?' },
                { speaker: 'Minjun', text: 'I am thankful for my family and this delicious feast!' }
              ]
            }
          ]
        },

        speakingPrompts: [
          {
            id: 'g3-u2-sp1',
            text: 'I am thankful for my family and the autumn harvest.',
            focus: 'Expressing gratitude (thankful for)',
            promptType: 'repeat_and_answer',
            targetKeywords: ['thankful', 'for', 'family', 'harvest'],
            hint: 'Say "thankful" clearly with the soft "th" sound.'
          },
          {
            id: 'g3-u2-sp2',
            text: 'There is a big feast, and there are sweet rice cakes on the table.',
            focus: 'There is vs. There are',
            promptType: 'read_aloud',
            targetKeywords: ['there', 'is', 'feast', 'there', 'are', 'rice', 'cakes'],
            hint: 'Notice "There is" for one feast and "there are" for plural cakes.'
          },
          {
            id: 'g3-u2-sp3',
            text: 'In our first harvest contest, my fast friend won the best prize at the feast!',
            focus: 'Phonics final -st blend pronunciation',
            promptType: 'phonics_drill',
            targetKeywords: ['first', 'harvest', 'contest', 'fast', 'best', 'feast'],
            hint: 'Pronounce the crisp "-st" sound at the end of first, harvest, contest, fast, best, and feast!'
          },
          {
            id: 'g3-u2-sp4',
            text: 'Scientists can grow and pick fresh vegetables inside the Mars farm.',
            focus: 'Reading 2 vocabulary in context',
            promptType: 'read_aloud',
            targetKeywords: ['grow', 'pick', 'vegetables', 'mars'],
            hint: 'Speak smoothly and emphasize "grow" and "pick".'
          }
        ],

        checkpoints: {
          checkpoint1: {
            id: 'g3-u2-cp1',
            title: 'Vocabulary Lagoon',
            subtitle: 'Chuseok, Harvest & Final -st Words',
            wordMatching: [
              { word: 'harvest', clue: 'Gathering ripe crops from the fields in autumn', emoji: '🌾', imageKeyword: 'harvest-crops' },
              { word: 'festival', clue: 'A special holiday celebration with food and games', emoji: '🏮', imageKeyword: 'lantern-festival' },
              { word: 'ancestors', clue: 'Family members who lived a long time ago', emoji: '🙇', imageKeyword: 'family-ancestors' },
              { word: 'feast', clue: 'A huge, delicious meal shared for a celebration', emoji: '🍱', imageKeyword: 'holiday-feast' },
              { word: 'songpyeon', clue: 'Half-moon shaped Korean rice cakes eaten at Chuseok', emoji: '🥟', imageKeyword: 'songpyeon-rice-cake' },
              { word: 'weave', clue: 'To cross threads over and under to make cloth', emoji: '🧶', imageKeyword: 'weave-loom' },
              { word: 'cloth', clue: 'Fabric made from threads used for clothing', emoji: '🧣', imageKeyword: 'woven-cloth' },
              { word: 'contest', clue: 'A competition where people try to win', emoji: '🏆', imageKeyword: 'trophy-contest' },
              { word: 'pick', clue: 'To gather ripe fruits or vegetables by hand', emoji: '🍎', imageKeyword: 'pick-fruit' },
              { word: 'grow', clue: 'To develop from a small seed into a big plant', emoji: '🌱', imageKeyword: 'plant-grow' },
              { word: 'worried', clue: 'Feeling nervous that something might go wrong', emoji: '😟', imageKeyword: 'worried-face' },
              { word: 'space suit', clue: 'Protective suit worn by astronauts on Mars', emoji: '🧑‍🚀', imageKeyword: 'astronaut-spacesuit' }
            ],
            missingLetters: [
              { word: 'harvest', masked: 'h a r v e _ _', missingLetters: ['s', 't'], unscrambleTiles: ['h', 'a', 'r', 'v', 'e', 's', 't'], clue: 'Gathering crops in autumn (ends with -st)', emoji: '🌾' },
              { word: 'festival', masked: 'f e s _ i v _ l', missingLetters: ['t', 'a'], unscrambleTiles: ['f', 'e', 's', 't', 'i', 'v', 'a', 'l'], clue: 'Chuseok is a three-day harvest ___', emoji: '🏮' },
              { word: 'feast', masked: 'f e a _ _', missingLetters: ['s', 't'], unscrambleTiles: ['f', 'e', 'a', 's', 't'], clue: 'A big holiday meal (ends with -st)', emoji: '🍱' },
              { word: 'contest', masked: 'c o n t e _ _', missingLetters: ['s', 't'], unscrambleTiles: ['c', 'o', 'n', 't', 'e', 's', 't'], clue: 'A game or competition (ends with -st)', emoji: '🏆' },
              { word: 'weave', masked: 'w e _ v _', missingLetters: ['a', 'e'], unscrambleTiles: ['w', 'e', 'a', 'v', 'e'], clue: 'To make cloth from threads', emoji: '🧶' },
              { word: 'cloth', masked: 'c l o _ _', missingLetters: ['t', 'h'], unscrambleTiles: ['c', 'l', 'o', 't', 'h'], clue: 'Woven fabric for making clothes', emoji: '🧣' },
              { word: 'ancestors', masked: 'a n c e _ t o r _', missingLetters: ['s', 's'], unscrambleTiles: ['a', 'n', 'c', 'e', 's', 't', 'o', 'r', 's'], clue: 'Family members from long ago', emoji: '🙇' },
              { word: 'worried', masked: 'w o _ _ i e d', missingLetters: ['r', 'r'], unscrambleTiles: ['w', 'o', 'r', 'r', 'i', 'e', 'd'], clue: 'Feeling nervous or uneasy', emoji: '😟' },
              { word: 'believe', masked: 'b e l _ e v _', missingLetters: ['i', 'e'], unscrambleTiles: ['b', 'e', 'l', 'i', 'e', 'v', 'e'], clue: 'To think that something is true', emoji: '🌟' },
              { word: 'stripes', masked: 's t r i _ e _', missingLetters: ['p', 's'], unscrambleTiles: ['s', 't', 'r', 'i', 'p', 'e', 's'], clue: 'Colorful lines on hanbok sleeves', emoji: '🌈' }
            ],
            listenAndPick: [
              {
                say: 'During Chuseok, Korean families make half-moon rice cakes called songpyeon.',
                prompt: 'What are the traditional half-moon rice cakes called?',
                options: ['songpyeon', 'parachute', 'hexagon', 'slingshot'],
                answer: 'songpyeon',
                emoji: '🥟'
              },
              {
                say: 'Two teams of women had a contest to weave the most cloth.',
                prompt: 'What did the women weave in the contest?',
                options: ['cloth', 'space suits', 'mirrors', 'erasers'],
                answer: 'cloth',
                emoji: '🧶'
              },
              {
                say: 'Families bow and give thanks to their ancestors for a good harvest.',
                prompt: 'Who do families bow and give thanks to?',
                options: ['ancestors', 'robots', 'predators', 'cashiers'],
                answer: 'ancestors',
                emoji: '🙇'
              },
              {
                say: 'On Mars, the family picked pink potatoes for their very first harvest feast.',
                prompt: 'What is the setting (place) of "First Harvest"?',
                options: ['Mars', 'A deciduous forest', 'Wonderland', 'The Arctic ice'],
                answer: 'Mars',
                emoji: '🪐'
              },
              {
                say: 'Listen to these words: harvest, feast, contest, first, best, fast.',
                prompt: 'Which ending sound do all of those words share?',
                options: ['-st', '-ng', 'cl-', '-er'],
                answer: '-st',
                emoji: '🔊'
              },
              {
                say: 'You must wear a space suit when you walk outside on Mars.',
                prompt: 'What must you wear outside on Mars?',
                options: ['space suit', 'waistcoat', 'slingshot', 'mirror'],
                answer: 'space suit',
                emoji: '🧑‍🚀'
              }
            ]
          },

          checkpoint2: {
            id: 'g3-u2-cp2',
            title: 'Grammar Bridge',
            subtitle: 'Thankful For, There Is/Are & Why/Because',
            sentenceBuilder: [
              {
                words: ['I', 'am', 'thankful', 'for', 'my', 'loving', 'family.'],
                answer: 'I am thankful for my loving family.',
                hint: 'Start with "I am thankful for...".',
                grammarFocus: 'Expressing gratitude'
              },
              {
                words: ['We', 'are', 'thankful', 'for', 'the', 'autumn', 'harvest.'],
                answer: 'We are thankful for the autumn harvest.',
                hint: 'Start with "We are thankful for...".',
                grammarFocus: 'Expressing gratitude'
              },
              {
                words: ['There', 'is', 'a', 'big', 'feast', 'on', 'the', 'table.'],
                answer: 'There is a big feast on the table.',
                hint: 'Use "There is" with the singular noun "a big feast".',
                grammarFocus: 'There is (singular)'
              },
              {
                words: ['There', 'are', 'pink', 'potatoes', 'on', 'the', 'Mars', 'farm.'],
                answer: 'There are pink potatoes on the Mars farm.',
                hint: 'Use "There are" with the plural noun "pink potatoes".',
                grammarFocus: 'There are (plural)'
              },
              {
                words: ['Why', 'do', 'families', 'celebrate', 'the', 'Chuseok', 'festival?'],
                answer: 'Why do families celebrate the Chuseok festival?',
                hint: 'Start with the question word "Why" followed by "do".',
                grammarFocus: 'Why questions'
              },
              {
                words: ['Because', 'they', 'are', 'thankful', 'for', 'good', 'food.'],
                answer: 'Because they are thankful for good food.',
                hint: 'Start your reason with "Because".',
                grammarFocus: 'Answering with Because'
              },
              {
                words: ['Can', 'we', 'pick', 'the', 'ripe', 'vegetables', 'today?'],
                answer: 'Can we pick the ripe vegetables today?',
                hint: 'Start the question with "Can we...".',
                grammarFocus: 'Asking permission with Can'
              },
              {
                words: ['Women', 'had', 'a', 'contest', 'to', 'weave', 'cloth.'],
                answer: 'Women had a contest to weave cloth.',
                hint: 'Put "a contest" before "to weave cloth".',
                grammarFocus: 'Sentence structure'
              }
            ],
            fillInTheBlank: [
              {
                sentence: 'I am thankful ___ my parents and our delicious harvest feast.',
                options: ['for', 'to', 'at', 'on'],
                answer: 'for',
                grammarFocus: 'Adjective + preposition (thankful for)',
                hint: 'We always say "thankful ___" something.'
              },
              {
                sentence: 'There ___ a bright full moon in the Chuseok night sky.',
                options: ['is', 'are', 'am', 'be'],
                answer: 'is',
                grammarFocus: 'There is vs. There are',
                hint: '"a bright full moon" is singular (one moon).'
              },
              {
                sentence: 'There ___ many sweet songpyeon rice cakes in the basket.',
                options: ['are', 'is', 'was', 'am'],
                answer: 'are',
                grammarFocus: 'There is vs. There are',
                hint: '"many sweet songpyeon rice cakes" is plural.'
              },
              {
                sentence: '___ do astronauts wear a space suit on Mars? Because there is no air outside.',
                options: ['Why', 'What', 'Where', 'Who'],
                answer: 'Why',
                grammarFocus: 'Why / Because questions',
                hint: 'When the answer starts with "Because", the question starts with ___.'
              },
              {
                sentence: 'Why was the family happy on Mars? ___ their vegetables finally grew!',
                options: ['Because', 'First', 'Instead', 'Where'],
                answer: 'Because',
                grammarFocus: 'Giving reasons with Because',
                hint: 'Use this word to answer a "Why" question.'
              },
              {
                sentence: 'We ___ thankful for the farmers who grow our food.',
                options: ['are', 'is', 'am', 'does'],
                answer: 'are',
                grammarFocus: 'Subject-verb agreement with "We"',
                hint: 'With "We", use the plural verb form of "be".'
              },
              {
                sentence: 'In autumn, farmers ___ the ripe crops from the fields.',
                options: ['pick', 'weave', 'invent', 'hibernate'],
                answer: 'pick',
                grammarFocus: 'Unit 2 action verbs',
                hint: 'Which verb means to gather ripe fruits and vegetables?'
              },
              {
                sentence: 'Long ago, two teams had a contest to ___ cloth.',
                options: ['weave', 'grow', 'melt', 'chase'],
                answer: 'weave',
                grammarFocus: 'Unit 2 action verbs',
                hint: 'You cross threads on a loom to ___ cloth.'
              }
            ]
          },

          checkpoint3: {
            id: 'g3-u2-cp3',
            title: 'Island Boss Temple',
            subtitle: 'Harvest Moon Guardian Showdown',
            bossName: 'Captain Harvest Moon',
            bossEmoji: '🌕',
            bossIntro: 'Welcome to the Harvest Moon Temple! Let’s test your knowledge of Korea’s Chuseok festival, the Mars First Harvest, and -st words!',
            bossQuiz: [
              {
                id: 'g3-u2-b1',
                type: 'reading',
                category: 'Reading Comprehension (Chuseok)',
                passage: 'Chuseok is Korea’s big autumn harvest festival. Families travel to their hometowns, wear colorful hanbok, bow to thank their ancestors, and eat half-moon rice cakes called songpyeon.',
                question: 'Why do families gather and bow during Chuseok?',
                options: [
                  'To thank their ancestors and celebrate the autumn harvest.',
                  'To test a new flying parachute.',
                  'To look for polar bears on the ice.',
                  'To buy a new credit card at the bank.'
                ],
                answer: 'To thank their ancestors and celebrate the autumn harvest.',
                explanation: 'Chuseok is a harvest festival where families honor their ancestors and give thanks for autumn crops.'
              },
              {
                id: 'g3-u2-b2',
                type: 'reading',
                category: 'Reading Comprehension (Chuseok History)',
                passage: 'Long ago during Chuseok, the king divided the village women into two teams. For one month, they had a contest to see which team could weave the most cloth.',
                question: 'What contest did the village women have long ago during Chuseok?',
                options: [
                  'A contest to weave the most cloth.',
                  'A contest to build a solar car.',
                  'A contest to grow pink potatoes on Mars.',
                  'A contest to catch a white rabbit.'
                ],
                answer: 'A contest to weave the most cloth.',
                explanation: 'In "Chuseok: Korea’s Harvest Festival", two teams competed for a month to weave the most cloth.'
              },
              {
                id: 'g3-u2-b3',
                type: 'reading',
                category: 'Reading Skill (Setting)',
                passage: 'In "First Harvest", Leo looked out the window at the red, dusty rocks of Mars. Inside the warm greenhouse dome, green plants and pink potatoes were ready to pick!',
                question: 'What is the setting of the story "First Harvest"?',
                options: [
                  'An indoor greenhouse farm on the planet Mars in the future.',
                  'A deciduous forest in winter.',
                  'A classroom after school.',
                  'A bank in ancient China.'
                ],
                answer: 'An indoor greenhouse farm on the planet Mars in the future.',
                explanation: 'The setting tells where and when the story happens: on Mars in the future.'
              },
              {
                id: 'g3-u2-b4',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'What is the special Korean food shaped like a half-moon that families make on Chuseok?',
                options: ['songpyeon', 'hexagon', 'waistcoat', 'biofuel'],
                answer: 'songpyeon',
                explanation: 'Songpyeon are traditional half-moon rice cakes steamed on pine needles.'
              },
              {
                id: 'g3-u2-b5',
                type: 'grammar',
                category: 'Grammar (There is / There are)',
                question: 'Choose the sentence that is grammatically correct:',
                options: [
                  'There are sweet rice cakes and fresh fruits on the table.',
                  'There is sweet rice cakes and fresh fruits on the table.',
                  'There are a big feast on the table.',
                  'There am pink potatoes in the basket.'
                ],
                answer: 'There are sweet rice cakes and fresh fruits on the table.',
                explanation: 'Use "There are" with plural nouns like "sweet rice cakes and fresh fruits".'
              },
              {
                id: 'g3-u2-b6',
                type: 'dialogue',
                category: 'Real-Life Dialogue Q&A',
                speakerA: 'Teacher: Today is Thanksgiving and Harvest Day! What are you thankful for?',
                speakerB: 'You: ___',
                question: 'Choose the best response:',
                options: [
                  'I am thankful for my family, my teachers, and healthy food.',
                  'It cleans my messy bedroom.',
                  'It is ninety-five dollars.',
                  'First, draw a hexagon.'
                ],
                answer: 'I am thankful for my family, my teachers, and healthy food.',
                explanation: '"I am thankful for..." is the target structure for expressing gratitude in Unit 2.'
              },
              {
                id: 'g3-u2-b7',
                type: 'phonics',
                category: 'Phonics (Final -st blend)',
                question: 'Which group of words ALL end with the final "-st" consonant blend taught in Unit 2?',
                options: [
                  'harvest, feast, contest, first, best',
                  'sing, long, melting, fishing, morning',
                  'Clara, clock, clean, climb, class',
                  'rain, mail, tail, train, paint'
                ],
                answer: 'harvest, feast, contest, first, best',
                explanation: 'All five words end with the final consonant blend "-st".'
              },
              {
                id: 'g3-u2-b8',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'At first, the boy on Mars was nervous that the seeds would not grow. Which word means "nervous or afraid that something bad might happen"?',
                options: ['worried', 'tidy', 'sleepy', 'valuable'],
                answer: 'worried',
                explanation: '"Worried" means feeling anxious or concerned about a problem.'
              },
              {
                id: 'g3-u2-b9',
                type: 'grammar',
                category: 'Grammar (Why & Because)',
                question: 'Complete the dialogue: "___ do you wear a space suit on Mars?" — "___ there is no air to breathe outside."',
                options: [
                  'Why / Because',
                  'Where / First',
                  'Who / Instead',
                  'How much / So'
                ],
                answer: 'Why / Because',
                explanation: '"Why" asks for a reason and "Because" introduces the reason.'
              },
              {
                id: 'g3-u2-b10',
                type: 'reading',
                category: 'Comparing Both Readings',
                question: 'How are the families in "Chuseok: Korea’s Harvest Festival" and "First Harvest" on Mars alike?',
                options: [
                  'Both families share a special harvest feast and give thanks for their food.',
                  'Both families live on Mars and wear space suits.',
                  'Both families weave cloth on a spaceship.',
                  'Both families build a robot to clean their bedrooms.'
                ],
                answer: 'Both families share a special harvest feast and give thanks for their food.',
                explanation: 'Both readings celebrate the joy of harvesting food and sharing a thankful meal with family.'
              }
            ]
          }
        }
      },

      // -----------------------------------------------------------------------
      // GRADE 3 — UNIT 3: IT KEEPS CHANGING
      // -----------------------------------------------------------------------
      unit3: {
        unitNumber: 3,
        unitId: 'g3-unit3',
        islandName: 'Arctic Eco-Energy Island',
        title: 'It Keeps Changing',
        theme: 'Climate Change in the Arctic, Melting Sea Ice, and Clean Energy Cars',
        bigQuestion: 'How is our Earth changing, and how can clean energy help protect it?',
        book: 'Global Readings 2',
        pages: 'pp. 40–55',
        readings: {
          reading1: {
            title: 'The Bear and I',
            genre: 'Narrative Poem (8 Stanzas)',
            pages: 'pp. 42–45',
            summary: 'An Arctic narrator and a polar bear once fished by a solid ice hole as enemies, but when climate change makes the ice thin and melting, they both fall in and must swim to safety together.'
          },
          reading2: {
            title: 'Clean Cars',
            genre: 'Informational Science Text',
            pages: 'pp. 48–51',
            summary: 'Compares five types of cars—gasoline cars, biofuel cars, electric cars, air cars, and solar cars—examining whether they are clean or dirty, quiet or noisy, and cheap or expensive.'
          }
        },
        readingSkill: 'Compare and Contrast (Finding How Things Are Alike and Different)',
        phonicsFocus: {
          pattern: '-ng',
          title: 'Final Consonant Blend / Digraph -ng',
          description: 'Words ending with -ng from the Arctic poem and climate lessons.',
          targetWords: ['sing', 'long', 'reading', 'bang', 'spring', 'young', 'fishing', 'morning', 'changing', 'melting', 'strong', 'thing']
        },

        vocabulary: [
          {
            word: 'hole',
            partOfSpeech: 'noun',
            clue: 'An opening in the ground or through the Arctic sea ice.',
            emoji: '🕳️',
            imageKeyword: 'ice-fishing-hole',
            sampleSentence: 'My fishing hole was in the thick Arctic ice.',
            page: 41
          },
          {
            word: 'twice',
            partOfSpeech: 'adverb',
            clue: 'Two times.',
            emoji: '✌️',
            imageKeyword: 'twice-two-times',
            sampleSentence: 'I checked the thin ice once, then I checked it twice.',
            page: 41
          },
          {
            word: 'enemy',
            partOfSpeech: 'noun',
            clue: 'Someone who is against you or dangerous to you, not a friend.',
            emoji: '🐻‍❄️',
            imageKeyword: 'polar-bear-enemy',
            sampleSentence: 'Long ago, the hungry polar bear was my enemy on the ice.',
            page: 41
          },
          {
            word: 'thin',
            partOfSpeech: 'adjective',
            clue: 'Not thick; easy to crack or break through.',
            emoji: '🧊',
            imageKeyword: 'thin-ice',
            sampleSentence: 'Today the Arctic sea ice is getting warm and thin.',
            page: 41
          },
          {
            word: 'trap',
            partOfSpeech: 'noun / verb',
            clue: 'A dangerous place or device that catches animals or people so they cannot escape.',
            emoji: '🪤',
            imageKeyword: 'ice-trap',
            sampleSentence: 'The thin, cracking ice became a dangerous trap for both of us.',
            page: 41
          },
          {
            word: 'melting',
            partOfSpeech: 'verb / adjective',
            clue: 'Changing from solid ice into liquid water because of heat.',
            emoji: '💧',
            imageKeyword: 'melting-ice',
            sampleSentence: 'Today the ice is melting because the Earth is getting warmer.',
            page: 41
          },
          {
            word: 'gasoline',
            partOfSpeech: 'noun',
            clue: 'A liquid fuel made from oil that powers most regular cars.',
            emoji: '⛽',
            imageKeyword: 'gasoline-pump',
            sampleSentence: 'Gasoline comes from oil and makes dirty smoke in the air.',
            page: 47
          },
          {
            word: 'energy',
            partOfSpeech: 'noun',
            clue: 'Power from the sun, wind, plants, or electricity that makes machines move.',
            emoji: '⚡',
            imageKeyword: 'clean-energy',
            sampleSentence: 'Solar cars use clean energy from the bright sun.',
            page: 47
          },
          {
            word: 'oil',
            partOfSpeech: 'noun',
            clue: 'A thick dark liquid found deep under the ground used to make gasoline.',
            emoji: '🛢️',
            imageKeyword: 'oil-barrel',
            sampleSentence: 'Gasoline comes from oil deep under the Earth.',
            page: 47
          },
          {
            word: 'noisy',
            partOfSpeech: 'adjective',
            clue: 'Making a lot of loud, unpleasant sound.',
            emoji: '📢',
            imageKeyword: 'noisy-car',
            sampleSentence: 'Old gasoline cars are noisy and make the air dirty.',
            page: 47
          },
          {
            word: 'electricity',
            partOfSpeech: 'noun',
            clue: 'Electric power that flows through wires and batteries to run lights and cars.',
            emoji: '🔋',
            imageKeyword: 'electric-battery',
            sampleSentence: 'Electric cars use electricity stored in a battery instead of gasoline.',
            page: 47
          },
          {
            word: 'expensive',
            partOfSpeech: 'adjective',
            clue: 'Costing a lot of money.',
            emoji: '💰',
            imageKeyword: 'expensive-price',
            sampleSentence: 'Solar cars are clean and quiet, but they are very expensive.',
            page: 47
          },
          {
            word: 'biofuel',
            partOfSpeech: 'noun',
            clue: 'Fuel made from plants like corn or sugarcane instead of underground oil.',
            emoji: '🌽',
            imageKeyword: 'corn-biofuel',
            sampleSentence: 'Biofuel comes from plants such as corn and is cleaner than gasoline.',
            page: 49
          },
          {
            word: 'solar',
            partOfSpeech: 'adjective',
            clue: 'Using energy that comes from the sun’s light.',
            emoji: '☀️',
            imageKeyword: 'solar-car',
            sampleSentence: 'A solar car has panels on top to catch sunlight.',
            page: 50
          },
          {
            word: 'climate change',
            partOfSpeech: 'noun phrase',
            clue: 'The warming of Earth’s weather patterns, causing Arctic ice to melt.',
            emoji: '🌍',
            imageKeyword: 'earth-climate-change',
            sampleSentence: 'We can use clean cars and ride bikes to help slow down climate change.',
            page: 52
          }
        ],

        grammar: {
          rules: [
            {
              title: 'Past vs. Present Change (was / were vs. is + -ing)',
              formula: 'In the past, [noun] was/were [adjective]. -> Today, [noun] is/are + verb-ing.',
              explanation: 'Use Past Simple (was/were, fell) to describe how the Arctic used to be, and Present Continuous (is melting, is changing) to describe what is happening right now.',
              examples: [
                'My fishing hole was in the thick ice.',
                'The polar bear was my enemy.',
                'Today the Arctic ice is melting.',
                'The weather keeps changing.'
              ]
            },
            {
              title: 'Describing & Contrasting Cars with "and", "but", "very", "not very"',
              formula: 'They are [adj] and [adj]. / They are [adj], but they are (not) very [adj].',
              explanation: 'Use "and" to join two similar qualities, and "but" to connect a good quality with a problem (like cost or speed).',
              examples: [
                'Gasoline cars are fast, but they are noisy and dirty.',
                'Electric cars are clean and quiet, but they are expensive.',
                'Air cars are clean, and they are not very expensive.',
                'Solar cars use energy from the sun, but they are slow.'
              ]
            },
            {
              title: 'Giving Reasons with "because" (Preferences & Eco-Actions)',
              formula: 'I like the [car] because it is [adjective]. / I can [action] because [reason].',
              explanation: 'Use "because" to explain why you prefer a clean car or how an action helps the Earth.',
              examples: [
                'I like the electric car because it is clean and quiet.',
                'I can ride my bike to school because it does not make dirty air.',
                'Gasoline comes from oil, and biofuel comes from plants.'
              ]
            }
          ],
          qaPatterns: [
            {
              question: 'What is happening to the Arctic ice today?',
              answer: 'Today the ice is getting thin and it is melting.',
              focus: 'Present continuous for ongoing change'
            },
            {
              question: 'Where does gasoline come from?',
              answer: 'Gasoline comes from oil under the ground.',
              focus: 'Present simple science facts'
            },
            {
              question: 'What are electric cars like?',
              answer: 'They are clean and quiet, but they are expensive.',
              focus: 'Adjectives with and / but'
            },
            {
              question: 'Which clean car do you like best, and why?',
              answer: 'I like the solar car because it uses free energy from the sun.',
              focus: 'Giving reasons with because'
            }
          ],
          dialogues: [
            {
              title: 'Choosing a Clean Car for the Future',
              lines: [
                { speaker: 'Maya', text: 'Look at the Arctic poem! Today the sea ice is melting.' },
                { speaker: 'Noah', text: 'Yes! Dirty smoke from old gasoline cars makes the Earth warmer.' },
                { speaker: 'Maya', text: 'What can we drive instead of noisy gasoline cars?' },
                { speaker: 'Noah', text: 'We can drive electric cars or solar cars! They are clean and quiet.' },
                { speaker: 'Maya', text: 'Are solar cars expensive?' },
                { speaker: 'Noah', text: 'They are clean, but they are very expensive right now.' }
              ]
            }
          ]
        },

        speakingPrompts: [
          {
            id: 'g3-u3-sp1',
            text: 'In the past the ice was thick, but today the thin ice is melting.',
            focus: 'Past (was) vs. Present Continuous (is melting)',
            promptType: 'read_aloud',
            targetKeywords: ['past', 'ice', 'was', 'thick', 'today', 'thin', 'melting'],
            hint: 'Contrast "was thick" with "is melting"!'
          },
          {
            id: 'g3-u3-sp2',
            text: 'Electric cars are clean and quiet, but they are expensive.',
            focus: 'Adjectives connected with "and" and "but"',
            promptType: 'repeat_and_answer',
            targetKeywords: ['electric', 'cars', 'clean', 'quiet', 'but', 'expensive'],
            hint: 'Pause slightly before the word "but".'
          },
          {
            id: 'g3-u3-sp3',
            text: 'I like the solar car because it uses clean energy from the sun.',
            focus: 'Giving reasons with because',
            promptType: 'repeat_and_answer',
            targetKeywords: ['like', 'solar', 'car', 'because', 'clean', 'energy', 'sun'],
            hint: 'Emphasize "because" when giving your reason.'
          },
          {
            id: 'g3-u3-sp4',
            text: 'In the spring morning, the young bear went fishing while the ice kept changing and melting.',
            focus: 'Phonics final -ng sound',
            promptType: 'phonics_drill',
            targetKeywords: ['spring', 'morning', 'young', 'fishing', 'changing', 'melting'],
            hint: 'Ring out the nasal "-ng" sound at the end of spring, morning, young, fishing, changing, and melting!'
          }
        ],

        checkpoints: {
          checkpoint1: {
            id: 'g3-u3-cp1',
            title: 'Vocabulary Lagoon',
            subtitle: 'Arctic Ice, Clean Energy & -ng Phonics',
            wordMatching: [
              { word: 'hole', clue: 'An opening in the sea ice used for fishing', emoji: '🕳️', imageKeyword: 'ice-fishing-hole' },
              { word: 'twice', clue: 'Two times', emoji: '✌️', imageKeyword: 'twice-two-times' },
              { word: 'enemy', clue: 'Someone dangerous who is against you, not a friend', emoji: '🐻‍❄️', imageKeyword: 'polar-bear-enemy' },
              { word: 'thin', clue: 'Not thick; easy to crack and break', emoji: '🧊', imageKeyword: 'thin-ice' },
              { word: 'trap', clue: 'A dangerous place that catches you so you cannot escape', emoji: '🪤', imageKeyword: 'ice-trap' },
              { word: 'melting', clue: 'Turning from solid ice into water because of warmth', emoji: '💧', imageKeyword: 'melting-ice' },
              { word: 'gasoline', clue: 'Liquid fuel made from oil that makes dirty smoke', emoji: '⛽', imageKeyword: 'gasoline-pump' },
              { word: 'energy', clue: 'Power from the sun, electricity, or fuel that makes things work', emoji: '⚡', imageKeyword: 'clean-energy' },
              { word: 'oil', clue: 'Thick black liquid deep underground used to make gasoline', emoji: '🛢️', imageKeyword: 'oil-barrel' },
              { word: 'noisy', clue: 'Making a lot of loud, unpleasant sound', emoji: '📢', imageKeyword: 'noisy-car' },
              { word: 'electricity', clue: 'Power stored in batteries that runs electric cars', emoji: '🔋', imageKeyword: 'electric-battery' },
              { word: 'expensive', clue: 'Costing a lot of money', emoji: '💰', imageKeyword: 'expensive-price' }
            ],
            missingLetters: [
              { word: 'melting', masked: 'm e l t i _ _', missingLetters: ['n', 'g'], unscrambleTiles: ['m', 'e', 'l', 't', 'i', 'n', 'g'], clue: 'Ice turning into water (ends with -ng)', emoji: '💧' },
              { word: 'enemy', masked: 'e n e _ _', missingLetters: ['m', 'y'], unscrambleTiles: ['e', 'n', 'e', 'm', 'y'], clue: 'Opposite of a friend', emoji: '🐻‍❄️' },
              { word: 'twice', masked: 't w i _ _', missingLetters: ['c', 'e'], unscrambleTiles: ['t', 'w', 'i', 'c', 'e'], clue: 'Two times', emoji: '✌️' },
              { word: 'gasoline', masked: 'g a s o _ i n _', missingLetters: ['l', 'e'], unscrambleTiles: ['g', 'a', 's', 'o', 'l', 'i', 'n', 'e'], clue: 'Fuel made from underground oil', emoji: '⛽' },
              { word: 'energy', masked: 'e n e _ g _', missingLetters: ['r', 'y'], unscrambleTiles: ['e', 'n', 'e', 'r', 'g', 'y'], clue: 'Power from the sun or electricity', emoji: '⚡' },
              { word: 'noisy', masked: 'n o i _ _', missingLetters: ['s', 'y'], unscrambleTiles: ['n', 'o', 'i', 's', 'y'], clue: 'Very loud (opposite of quiet)', emoji: '📢' },
              { word: 'electricity', masked: 'e l e c t r i _ i t _', missingLetters: ['c', 'y'], unscrambleTiles: ['e', 'l', 'e', 'c', 't', 'r', 'i', 'c', 'i', 't', 'y'], clue: 'Power stored in batteries', emoji: '🔋' },
              { word: 'expensive', masked: 'e x p e _ s i v _', missingLetters: ['n', 'e'], unscrambleTiles: ['e', 'x', 'p', 'e', 'n', 's', 'i', 'v', 'e'], clue: 'Costs a lot of money', emoji: '💰' },
              { word: 'thin', masked: 't h _ _', missingLetters: ['i', 'n'], unscrambleTiles: ['t', 'h', 'i', 'n'], clue: 'Not thick; easy to crack', emoji: '🧊' },
              { word: 'trap', masked: 't r _ _', missingLetters: ['a', 'p'], unscrambleTiles: ['t', 'r', 'a', 'p'], clue: 'Something that catches you', emoji: '🪤' }
            ],
            listenAndPick: [
              {
                say: 'Today the Arctic ice is thin and melting into the sea.',
                prompt: 'What is happening to the Arctic ice today?',
                options: ['melting', 'weaving', 'inventing', 'hibernating'],
                answer: 'melting',
                emoji: '💧'
              },
              {
                say: 'Gasoline comes from oil and makes the air dirty.',
                prompt: 'Where does gasoline come from?',
                options: ['oil', 'sunlight', 'corn', 'wind'],
                answer: 'oil',
                emoji: '🛢️'
              },
              {
                say: 'Electric cars use electricity from a battery, so they are clean and quiet.',
                prompt: 'What powers an electric car?',
                options: ['electricity', 'gasoline', 'songpyeon', 'slingshots'],
                answer: 'electricity',
                emoji: '🔋'
              },
              {
                say: 'Old gasoline cars are not quiet. They are very noisy!',
                prompt: 'Which word is the opposite of quiet?',
                options: ['noisy', 'thin', 'expensive', 'tidy'],
                answer: 'noisy',
                emoji: '📢'
              },
              {
                say: 'Listen to these words: sing, long, fishing, morning, changing, melting.',
                prompt: 'Which ending sound do all of these words share?',
                options: ['-ng', '-st', 'cl-', '-er'],
                answer: '-ng',
                emoji: '🎵'
              },
              {
                say: 'Solar cars are clean, but they are very expensive.',
                prompt: 'Which word means costing a lot of money?',
                options: ['expensive', 'twice', 'thin', 'noisy'],
                answer: 'expensive',
                emoji: '💰'
              }
            ]
          },

          checkpoint2: {
            id: 'g3-u3-cp2',
            title: 'Grammar Bridge',
            subtitle: 'Past vs. Present Change, Adjectives with But & Because',
            sentenceBuilder: [
              {
                words: ['My', 'fishing', 'hole', 'was', 'in', 'the', 'ice.'],
                answer: 'My fishing hole was in the ice.',
                hint: 'Start with "My fishing hole" followed by the past verb "was".',
                grammarFocus: 'Past simple with was'
              },
              {
                words: ['Today', 'the', 'Arctic', 'ice', 'is', 'melting.'],
                answer: 'Today the Arctic ice is melting.',
                hint: 'Start with "Today" and end with "is melting."',
                grammarFocus: 'Present continuous for ongoing change'
              },
              {
                words: ['Gasoline', 'comes', 'from', 'oil', 'under', 'the', 'ground.'],
                answer: 'Gasoline comes from oil under the ground.',
                hint: 'Start with "Gasoline comes from oil...".',
                grammarFocus: 'Present simple facts'
              },
              {
                words: ['Solar', 'cars', 'use', 'energy', 'from', 'the', 'sun.'],
                answer: 'Solar cars use energy from the sun.',
                hint: 'Start with "Solar cars use...".',
                grammarFocus: 'Present simple facts'
              },
              {
                words: ['They', 'are', 'clean,', 'but', 'they', 'are', 'expensive.'],
                answer: 'They are clean, but they are expensive.',
                hint: 'Connect the two clauses with "but".',
                grammarFocus: 'Contrast with but'
              },
              {
                words: ['Air', 'cars', 'are', 'not', 'very', 'expensive.'],
                answer: 'Air cars are not very expensive.',
                hint: 'Put "not very" before "expensive".',
                grammarFocus: 'Negative intensifier (not very)'
              },
              {
                words: ['I', 'like', 'the', 'solar', 'car', 'because', 'it', 'is', 'quiet.'],
                answer: 'I like the solar car because it is quiet.',
                hint: 'Use "because" to explain why you like the solar car.',
                grammarFocus: 'Giving reasons with because'
              },
              {
                words: ['The', 'bear', 'and', 'I', 'fell', 'into', 'the', 'water.'],
                answer: 'The bear and I fell into the water.',
                hint: 'Start with "The bear and I" followed by "fell".',
                grammarFocus: 'Past simple narrative'
              }
            ],
            fillInTheBlank: [
              {
                sentence: 'Long ago, my fishing hole ___ in the thick, strong ice.',
                options: ['was', 'is', 'are', 'were'],
                answer: 'was',
                grammarFocus: 'Past Simple of "be" (singular)',
                hint: '"Long ago" tells us to use the past tense for one fishing hole.'
              },
              {
                sentence: 'Look at the Arctic today! The thin sea ice is ___.',
                options: ['melting', 'melt', 'melted', 'melts'],
                answer: 'melting',
                grammarFocus: 'Present Continuous (is + verb-ing)',
                hint: 'After "is", use the -ing form to show what is happening right now.'
              },
              {
                sentence: 'Electric cars are clean and quiet, ___ they are expensive.',
                options: ['but', 'because', 'or', 'twice'],
                answer: 'but',
                grammarFocus: 'Coordinating conjunctions (and vs. but)',
                hint: '"Clean and quiet" is good, while "expensive" is a problem. Use ___ to contrast them!'
              },
              {
                sentence: 'Gasoline cars are fast, ___ they are noisy and dirty.',
                options: ['but', 'so', 'because', 'first'],
                answer: 'but',
                grammarFocus: 'Contrast with but',
                hint: 'Which word contrasts a good point (fast) with a bad point (noisy and dirty)?'
              },
              {
                sentence: 'I like the electric car ___ it keeps the air clean.',
                options: ['because', 'but', 'twice', 'instead'],
                answer: 'because',
                grammarFocus: 'Giving reasons with because',
                hint: 'Use this word to introduce a reason.'
              },
              {
                sentence: 'Gasoline ___ from oil deep under the ground.',
                options: ['comes', 'come', 'coming', 'came'],
                answer: 'comes',
                grammarFocus: 'Present Simple 3rd-person singular (-s)',
                hint: '"Gasoline" is singular (it), so the verb takes -s.'
              },
              {
                sentence: 'Biofuel comes from plants such as corn, and solar cars use ___ from the sun.',
                options: ['energy', 'oil', 'gasoline', 'cloth'],
                answer: 'energy',
                grammarFocus: 'Clean energy vocabulary in context',
                hint: 'Sunlight gives clean ___ to solar panels.'
              },
              {
                sentence: 'When the thin ice cracked with a loud bang, the bear and I ___ in!',
                options: ['fell', 'fall', 'falling', 'falls'],
                answer: 'fell',
                grammarFocus: 'Past Simple irregular verb (fall -> fell)',
                hint: 'What is the past tense of "fall"?'
              }
            ]
          },

          checkpoint3: {
            id: 'g3-u3-cp3',
            title: 'Island Boss Temple',
            subtitle: 'Arctic Eco-Guardian Showdown',
            bossName: 'Frostpaw the Polar Guardian',
            bossEmoji: '🐻‍❄️',
            bossIntro: 'Roar! The Arctic ice keeps changing! Answer my questions about "The Bear and I", "Clean Cars", and -ng words to save our glacier!',
            bossQuiz: [
              {
                id: 'g3-u3-b1',
                type: 'reading',
                category: 'Reading Comprehension (The Bear and I)',
                passage: 'In Stanzas 1–4 of "The Bear and I", the narrator and the polar bear watched each other across the fishing hole as enemies. In Stanzas 5–8, the spring weather grew warm, the ice became thin and cracked with a bang, and both fell into the freezing water together.',
                question: 'Why did the narrator and the polar bear stop fighting at the end of the poem?',
                options: [
                  'Because the thin ice melted and cracked, so both fell in and had to swim for their lives together.',
                  'Because they bought an electric car and drove to a restaurant.',
                  'Because Clara invented a machine to clean the ice.',
                  'Because they ate songpyeon rice cakes together.'
                ],
                answer: 'Because the thin ice melted and cracked, so both fell in and had to swim for their lives together.',
                explanation: 'The melting ice became a shared trap, turning former enemies into survivors facing climate change together.'
              },
              {
                id: 'g3-u3-b2',
                type: 'reading',
                category: 'Reading Comprehension (Clean Cars)',
                passage: 'From "Clean Cars": (1) Gasoline cars use oil; they are fast, but noisy and dirty. (2) Biofuel cars use fuel made from plants like corn. (3) Electric cars use electricity from batteries; they are clean and quiet, but expensive. (4) Air cars run on compressed air and are not very expensive. (5) Solar cars use energy from the sun; they are clean and quiet, but slow and expensive.',
                question: 'Which fuel is made from plants like corn or sugarcane instead of underground oil?',
                options: ['Biofuel', 'Gasoline', 'Plastic', 'Honeycomb'],
                answer: 'Biofuel',
                explanation: 'Biofuel comes from plants and is cleaner than gasoline.'
              },
              {
                id: 'g3-u3-b3',
                type: 'reading',
                category: 'Reading Skill (Compare & Contrast)',
                question: 'How are electric cars and solar cars ALIKE according to "Clean Cars"?',
                options: [
                  'Both electric cars and solar cars are clean, quiet, and expensive.',
                  'Both use dirty gasoline made from underground oil.',
                  'Both are very noisy and make black smoke.',
                  'Both run on corn and sugarcane.'
                ],
                answer: 'Both electric cars and solar cars are clean, quiet, and expensive.',
                explanation: 'The chart in "Clean Cars" shows that both electric and solar cars are clean and quiet, but both are expensive.'
              },
              {
                id: 'g3-u3-b4',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'If a car costs a lot of money, which adjective describes it?',
                options: ['expensive', 'thin', 'noisy', 'twice'],
                answer: 'expensive',
                explanation: '"Expensive" means costing a lot of money.'
              },
              {
                id: 'g3-u3-b5',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'Which word means "two times"?',
                options: ['twice', 'thin', 'trap', 'hole'],
                answer: 'twice',
                explanation: '"Twice" means two times.'
              },
              {
                id: 'g3-u3-b6',
                type: 'grammar',
                category: 'Grammar (Contrast with But)',
                question: 'Choose the best word to complete the sentence: "Solar cars are clean and quiet, ___ they are slow and expensive."',
                options: ['but', 'because', 'twice', 'first'],
                answer: 'but',
                explanation: 'Use "but" to contrast positive qualities (clean, quiet) with drawbacks (slow, expensive).'
              },
              {
                id: 'g3-u3-b7',
                type: 'dialogue',
                category: 'Real-Life Dialogue Q&A',
                speakerA: 'Eco-Reporter: Which clean car do you like best, and why?',
                speakerB: 'You: ___',
                question: 'Choose the best complete answer:',
                options: [
                  'I like the electric car because it is clean and quiet.',
                  'I am thankful for songpyeon rice cakes.',
                  'First, draw a plan in your notebook.',
                  'Alice chased the white rabbit down a hole.'
                ],
                answer: 'I like the electric car because it is clean and quiet.',
                explanation: 'Uses the target structure "I like the [car] because it is [adjective]."'
              },
              {
                id: 'g3-u3-b8',
                type: 'phonics',
                category: 'Phonics (Final -ng)',
                question: 'Which set of words from Unit 3 ALL end with the "-ng" sound?',
                options: [
                  'fishing, morning, spring, melting, changing',
                  'harvest, feast, contest, fast, best',
                  'Clara, clock, clean, climb, class',
                  'park, hard, card, farm, start'
                ],
                answer: 'fishing, morning, spring, melting, changing',
                explanation: 'All five words end with the target "-ng" consonant blend/digraph.'
              },
              {
                id: 'g3-u3-b9',
                type: 'grammar',
                category: 'Grammar (Past vs. Present)',
                question: 'Choose the sentence that correctly describes what is happening to the Arctic ice RIGHT NOW:',
                options: [
                  'Today the thin ice is melting.',
                  'Today the thin ice was melted yesterday.',
                  'Today the thin ice melt.',
                  'Today the thin ice are melt.'
                ],
                answer: 'Today the thin ice is melting.',
                explanation: '"Today the thin ice is melting" uses the present continuous (is + verb-ing) for current change.'
              },
              {
                id: 'g3-u3-b10',
                type: 'reading',
                category: 'Connecting Both Readings (Eco-Action)',
                question: 'How does driving clean cars (Reading 2) help the polar bear in "The Bear and I" (Reading 1)?',
                options: [
                  'Clean cars do not pollute the air, which helps slow down global warming so the Arctic ice stops melting.',
                  'Polar bears can drive solar cars to catch fish.',
                  'Gasoline cars make the Arctic ice thicker and colder.',
                  'Clean cars help weave cloth for the polar bears.'
                ],
                answer: 'Clean cars do not pollute the air, which helps slow down global warming so the Arctic ice stops melting.',
                explanation: 'Using clean energy reduces pollution and climate change, protecting the polar bear’s sea ice habitat.'
              }
            ]
          }
        }
      }
    },

    // =========================================================================
    // GRADE 4 — GLOBAL READINGS 3 (UNITS 1, 2, 3)
    // =========================================================================
    grade4: {
      gradeNumber: 4,
      gradeLabel: '4th Grade',
      bookTitle: 'Global Readings 3',
      literacyReview: {
        pages: 'pp. 4–7',
        readings: ['Don’t Move (Camouflage & Stick Insects)', 'The Monarch Butterfly’s Journey'],
        reviewVocabulary: ['freeze', 'still', 'branch', 'predator', 'journey', 'migration', 'monarch', 'chrysalis', 'caterpillar', 'route', 'travel']
      },

      // -----------------------------------------------------------------------
      // GRADE 4 — UNIT 1: I LOVE READING
      // -----------------------------------------------------------------------
      unit1: {
        unitNumber: 1,
        unitId: 'g4-unit1',
        islandName: 'Wonderland Brain-Quest Island',
        title: 'I Love Reading',
        theme: 'Classic Fantasy Literature (Alice in Wonderland) and Neuroscience (How Reading Exercises Your Brain)',
        bigQuestion: 'How does reading books take us on adventures and make our brains stronger?',
        book: 'Global Readings 3',
        pages: 'pp. 8–23',
        readings: {
          reading1: {
            title: 'The Beginning of Alice’s Adventures',
            genre: 'Classic Fantasy Fiction (Adapted from Lewis Carroll)',
            pages: 'pp. 10–13',
            summary: 'Sitting by the riverbank feeling bored and sleepy, Alice spots a talking White Rabbit wearing a waistcoat and pocket watch, chases him, and falls down a deep rabbit hole lined with bookshelves.'
          },
          reading2: {
            title: 'Learning and Your Brain',
            genre: 'Informational Neuroscience Text',
            pages: 'pp. 16–19',
            summary: 'Explains how the brain’s lobes, nerve cells, and fibers connect and send messages like electricity whenever we read, visualize stories, and learn new skills—giving our brain a workout.'
          }
        },
        readingSkill: 'Story Elements (Characters, Setting, Plot) & Tracking Character Feelings (At first... Then...)',
        phonicsFocus: {
          pattern: '-er',
          title: 'Final -er Suffix (Agent Nouns & Comparatives)',
          description: 'Words ending with -er that name a person who does an action (reader, teacher, writer) or compare two things (faster, stronger, smaller).',
          targetWords: ['reader', 'teacher', 'writer', 'thinker', 'listener', 'learner', 'faster', 'stronger', 'smaller', 'deeper', 'corner', 'fiber']
        },

        vocabulary: [
          {
            word: 'sleepy',
            partOfSpeech: 'adjective',
            clue: 'Feeling tired and ready to fall asleep.',
            emoji: '🥱',
            imageKeyword: 'sleepy-yawn',
            sampleSentence: 'At first, Alice was sitting on the riverbank feeling bored and sleepy.',
            page: 9
          },
          {
            word: 'chased',
            partOfSpeech: 'verb (past)',
            clue: 'Ran after someone or something quickly to try to catch them.',
            emoji: '🐇',
            imageKeyword: 'chase-rabbit',
            sampleSentence: 'Alice jumped up and chased the White Rabbit across the field.',
            page: 9
          },
          {
            word: 'fell',
            partOfSpeech: 'verb (past)',
            clue: 'Dropped down toward the ground from a higher place (past tense of fall).',
            emoji: '🕳️',
            imageKeyword: 'falling-down-hole',
            sampleSentence: 'Alice fell slowly down a very deep rabbit hole.',
            page: 9
          },
          {
            word: 'shelves',
            partOfSpeech: 'noun (plural)',
            clue: 'Flat wooden boards on a wall or bookcase that hold books, maps, and jars.',
            emoji: '📚',
            imageKeyword: 'book-shelves',
            sampleSentence: 'As Alice fell, she saw cupboards and book shelves along the walls of the hole.',
            page: 11
          },
          {
            word: 'corner',
            partOfSpeech: 'noun',
            clue: 'The place where two walls or two streets meet and turn.',
            emoji: '📐',
            imageKeyword: 'hallway-corner',
            sampleSentence: 'The White Rabbit hurried down the hall and turned the corner.',
            page: 12
          },
          {
            word: 'vest',
            partOfSpeech: 'noun',
            clue: 'A sleeveless piece of clothing worn over a shirt (also called a waistcoat).',
            emoji: '🦺',
            imageKeyword: 'rabbit-vest-waistcoat',
            sampleSentence: 'The White Rabbit pulled a pocket watch out of his fancy vest.',
            page: 9
          },
          {
            word: 'waistcoat',
            partOfSpeech: 'noun',
            clue: 'The British English word for a smart sleeveless vest worn under a coat.',
            emoji: '🎩',
            imageKeyword: 'waistcoat-watch',
            sampleSentence: 'Alice had never seen a rabbit wearing a waistcoat with a pocket!',
            page: 10
          },
          {
            word: 'lobes',
            partOfSpeech: 'noun (plural)',
            clue: 'The main rounded sections of your brain that control thinking, seeing, and speaking.',
            emoji: '🧠',
            imageKeyword: 'brain-lobes',
            sampleSentence: 'Different lobes of your brain work together when you read a book.',
            page: 15
          },
          {
            word: 'workout',
            partOfSpeech: 'noun',
            clue: 'A session of exercise that makes your body or your brain stronger.',
            emoji: '💪',
            imageKeyword: 'brain-workout',
            sampleSentence: 'Reading a challenging story gives your brain a great workout!',
            page: 15
          },
          {
            word: 'cells',
            partOfSpeech: 'noun (plural)',
            clue: 'The tiny living building blocks that make up your brain and body.',
            emoji: '🔬',
            imageKeyword: 'brain-cells',
            sampleSentence: 'Your brain has billions of tiny nerve cells that store information.',
            page: 15
          },
          {
            word: 'fibers',
            partOfSpeech: 'noun (plural)',
            clue: 'Thin thread-like branches that connect brain cells to one another.',
            emoji: '🕸️',
            imageKeyword: 'nerve-fibers',
            sampleSentence: 'When you learn something new, fibers grow between your brain cells.',
            page: 15
          },
          {
            word: 'messages',
            partOfSpeech: 'noun (plural)',
            clue: 'Signals or pieces of information sent from one brain cell to another.',
            emoji: '⚡',
            imageKeyword: 'brain-messages',
            sampleSentence: 'Brain cells send fast messages to each other along nerve fibers.',
            page: 15
          },
          {
            word: 'connecting',
            partOfSpeech: 'verb / participle',
            clue: 'Joining or linking two or more things together.',
            emoji: '🔗',
            imageKeyword: 'connecting-links',
            sampleSentence: 'Reading helps your brain grow stronger by connecting brain cells.',
            page: 17
          },
          {
            word: 'creative',
            partOfSpeech: 'adjective',
            clue: 'Using imagination to think of original stories, art, or ideas.',
            emoji: '🎨',
            imageKeyword: 'creative-imagination',
            sampleSentence: 'Reading fantasy stories helps you become a more creative thinker.',
            page: 18
          },
          {
            word: 'visualize',
            partOfSpeech: 'verb',
            clue: 'To paint a picture in your mind of what you are reading about.',
            emoji: '💭',
            imageKeyword: 'visualize-mind-picture',
            sampleSentence: 'Good readers visualize the characters and setting inside their minds.',
            page: 18
          }
        ],

        grammar: {
          rules: [
            {
              title: '5W1H Wh- Questions in Past & Present',
              formula: 'Who / What / Where / When / Why / How + did + [subject] + [base verb]?',
              explanation: 'Use Who (person/character), What (thing/action), Where (place/setting), When (time), Why (reason), and How (manner/way) to ask comprehension questions.',
              examples: [
                'Who did Alice chase across the field? She chased the White Rabbit.',
                'Where did Alice fall? She fell down a deep rabbit hole.',
                'Why was Alice sleepy at first? Because her sister’s book had no pictures.',
                'How do brain cells talk to each other? They send fast messages along fibers.'
              ]
            },
            {
              title: 'Tracking Character Feelings & Past Simple Narrative',
              formula: 'At first, [character] was [adjective]. -> Then, [character] [past verb] and felt [adjective].',
              explanation: 'Use time markers ("At first...", "Then...", "Finally...") and past simple verbs (was, saw, chased, fell) to describe how a character’s feelings change.',
              examples: [
                'At first, Alice was bored and sleepy by the river.',
                'Then, she saw a White Rabbit with a waistcoat and felt curious.',
                'Finally, she fell down the hole and felt surprised!'
              ]
            },
            {
              title: 'Suffix -er for Agent Nouns and Comparatives',
              formula: 'Verb + -er = Person who does the action (read -> reader). / Adjective + -er + than = Comparative (strong -> stronger than).',
              explanation: 'Adding -er to a verb makes a noun for a person; adding -er to a short adjective compares two things.',
              examples: [
                'A person who reads books is a reader; a person who writes is a writer.',
                'Reading makes your brain stronger and faster than before.',
                'A monarch butterfly is smaller than an eagle.'
              ]
            }
          ],
          qaPatterns: [
            {
              question: 'Who did Alice see by the riverbank?',
              answer: 'She saw a White Rabbit wearing a waistcoat and carrying a pocket watch.',
              focus: '5W1H (Who) & Past Simple'
            },
            {
              question: 'How did Alice’s feelings change at the beginning of the story?',
              answer: 'At first, Alice was bored and sleepy. Then, she was curious and surprised.',
              focus: 'Character feelings progression'
            },
            {
              question: 'What happens inside your brain when you read and learn?',
              answer: 'Brain cells grow fibers and send messages, giving your brain a workout.',
              focus: 'Present Simple neuroscience facts'
            },
            {
              question: 'What do good readers do when they read a story without pictures?',
              answer: 'They visualize the story by making pictures in their minds.',
              focus: 'Reading strategy vocabulary'
            }
          ],
          dialogues: [
            {
              title: 'Book Club: Alice & The Brain Workout',
              lines: [
                { speaker: 'Liam', text: 'I just finished reading "The Beginning of Alice’s Adventures"!' },
                { speaker: 'Sofia', text: 'Cool! How did Alice feel at the start of the story?' },
                { speaker: 'Liam', text: 'At first, she was bored and sleepy. Then she saw a talking White Rabbit in a waistcoat!' },
                { speaker: 'Sofia', text: 'Where did she go when she chased the rabbit?' },
                { speaker: 'Liam', text: 'She fell down a deep hole with book shelves on the walls!' },
                { speaker: 'Sofia', text: 'When we visualize Alice falling, our brain cells connect and get a great workout!' }
              ]
            }
          ]
        },

        speakingPrompts: [
          {
            id: 'g4-u1-sp1',
            text: 'At first, Alice was bored and sleepy, so she chased the White Rabbit.',
            focus: 'Past simple narrative & character feelings',
            promptType: 'read_aloud',
            targetKeywords: ['first', 'alice', 'sleepy', 'chased', 'white', 'rabbit'],
            hint: 'Pronounce "chased" with a crisp "-t" ending sound!'
          },
          {
            id: 'g4-u1-sp2',
            text: 'Reading gives your brain a workout by connecting cells and fibers.',
            focus: 'Neuroscience vocabulary in context',
            promptType: 'read_aloud',
            targetKeywords: ['reading', 'brain', 'workout', 'connecting', 'cells', 'fibers'],
            hint: 'Speak clearly on "workout", "connecting", "cells", and "fibers".'
          },
          {
            id: 'g4-u1-sp3',
            text: 'Who did Alice chase, and where did she fall?',
            focus: '5W1H Past Simple questions',
            promptType: 'repeat_and_answer',
            targetKeywords: ['who', 'did', 'alice', 'chase', 'where', 'did', 'she', 'fall'],
            hint: 'Use rising-falling intonation on the Wh- question words "Who" and "Where".'
          },
          {
            id: 'g4-u1-sp4',
            text: 'A creative reader and writer becomes a faster, stronger thinker.',
            focus: 'Phonics final -er suffix (agent nouns & comparatives)',
            promptType: 'phonics_drill',
            targetKeywords: ['creative', 'reader', 'writer', 'faster', 'stronger', 'thinker'],
            hint: 'Notice the "-er" suffix at the end of reader, writer, faster, stronger, and thinker!'
          }
        ],

        checkpoints: {
          checkpoint1: {
            id: 'g4-u1-cp1',
            title: 'Vocabulary Lagoon',
            subtitle: 'Alice in Wonderland, Brain Science & -er Words',
            wordMatching: [
              { word: 'sleepy', clue: 'Feeling tired and ready to go to sleep', emoji: '🥱', imageKeyword: 'sleepy-yawn' },
              { word: 'chased', clue: 'Ran quickly after someone to catch them', emoji: '🐇', imageKeyword: 'chase-rabbit' },
              { word: 'fell', clue: 'Dropped down into a deep hole (past of fall)', emoji: '🕳️', imageKeyword: 'falling-down-hole' },
              { word: 'shelves', clue: 'Flat boards on a wall that hold books and jars', emoji: '📚', imageKeyword: 'book-shelves' },
              { word: 'corner', clue: 'The place where two walls or hallways meet and turn', emoji: '📐', imageKeyword: 'hallway-corner' },
              { word: 'waistcoat', clue: 'A smart sleeveless vest worn by the White Rabbit', emoji: '🦺', imageKeyword: 'waistcoat-watch' },
              { word: 'lobes', clue: 'The main sections of the brain that control different jobs', emoji: '🧠', imageKeyword: 'brain-lobes' },
              { word: 'workout', clue: 'Exercise that makes your body or brain stronger', emoji: '💪', imageKeyword: 'brain-workout' },
              { word: 'cells', clue: 'Tiny living building blocks inside your brain', emoji: '🔬', imageKeyword: 'brain-cells' },
              { word: 'fibers', clue: 'Thread-like branches that link brain cells together', emoji: '🕸️', imageKeyword: 'nerve-fibers' },
              { word: 'messages', clue: 'Fast signals sent between brain cells', emoji: '⚡', imageKeyword: 'brain-messages' },
              { word: 'visualize', clue: 'To make a picture in your mind while reading', emoji: '💭', imageKeyword: 'visualize-mind-picture' }
            ],
            missingLetters: [
              { word: 'sleepy', masked: 's l e _ p _', missingLetters: ['e', 'y'], unscrambleTiles: ['s', 'l', 'e', 'e', 'p', 'y'], clue: 'Feeling tired and yawning', emoji: '🥱' },
              { word: 'chased', masked: 'c h a _ e _', missingLetters: ['s', 'd'], unscrambleTiles: ['c', 'h', 'a', 's', 'e', 'd'], clue: 'Ran after the White Rabbit', emoji: '🐇' },
              { word: 'shelves', masked: 's h e l _ e _', missingLetters: ['v', 's'], unscrambleTiles: ['s', 'h', 'e', 'l', 'v', 'e', 's'], clue: 'Plural of shelf; holds books', emoji: '📚' },
              { word: 'waistcoat', masked: 'w a i s t _ o a _', missingLetters: ['c', 't'], unscrambleTiles: ['w', 'a', 'i', 's', 't', 'c', 'o', 'a', 't'], clue: 'The rabbit’s fancy vest', emoji: '🦺' },
              { word: 'workout', masked: 'w o r _ o u _', missingLetters: ['k', 't'], unscrambleTiles: ['w', 'o', 'r', 'k', 'o', 'u', 't'], clue: 'Exercise for your body or brain', emoji: '💪' },
              { word: 'fibers', masked: 'f i _ e r _', missingLetters: ['b', 's'], unscrambleTiles: ['f', 'i', 'b', 'e', 'r', 's'], clue: 'Thin threads connecting brain cells', emoji: '🕸️' },
              { word: 'messages', masked: 'm e s _ a g e _', missingLetters: ['s', 's'], unscrambleTiles: ['m', 'e', 's', 's', 'a', 'g', 'e', 's'], clue: 'Signals sent through the brain', emoji: '⚡' },
              { word: 'creative', masked: 'c r e a _ i v _', missingLetters: ['t', 'e'], unscrambleTiles: ['c', 'r', 'e', 'a', 't', 'i', 'v', 'e'], clue: 'Full of imagination and new ideas', emoji: '🎨' },
              { word: 'visualize', masked: 'v i s u a _ i z _', missingLetters: ['l', 'e'], unscrambleTiles: ['v', 'i', 's', 'u', 'a', 'l', 'i', 'z', 'e'], clue: 'To picture a story in your mind', emoji: '💭' },
              { word: 'connecting', masked: 'c o n _ e c t i n _', missingLetters: ['n', 'g'], unscrambleTiles: ['c', 'o', 'n', 'n', 'e', 'c', 't', 'i', 'n', 'g'], clue: 'Joining brain cells together', emoji: '🔗' }
            ],
            listenAndPick: [
              {
                say: 'Alice saw a White Rabbit take a watch out of his waistcoat pocket and chased him.',
                prompt: 'What piece of clothing was the White Rabbit wearing?',
                options: ['waistcoat', 'space suit', 'parachute', 'slingshot'],
                answer: 'waistcoat',
                emoji: '🦺'
              },
              {
                say: 'As Alice fell down the hole, she noticed book shelves and maps along the walls.',
                prompt: 'What did Alice see on the walls of the rabbit hole?',
                options: ['shelves', 'glaciers', 'solar panels', 'credit cards'],
                answer: 'shelves',
                emoji: '📚'
              },
              {
                say: 'Reading a book gives your brain a great workout and makes it stronger.',
                prompt: 'Which word means exercise that makes your brain stronger?',
                options: ['workout', 'corner', 'vest', 'mess'],
                answer: 'workout',
                emoji: '💪'
              },
              {
                say: 'Tiny brain cells grow fibers and send fast messages to each other.',
                prompt: 'What do brain cells send along their fibers?',
                options: ['messages', 'waistcoats', 'hexagons', 'coins'],
                answer: 'messages',
                emoji: '⚡'
              },
              {
                say: 'When you read a story, you visualize the characters by making pictures in your mind.',
                prompt: 'Which word means making a mental picture while reading?',
                options: ['visualize', 'hibernate', 'barter', 'weave'],
                answer: 'visualize',
                emoji: '💭'
              },
              {
                say: 'Listen to these words: reader, teacher, writer, thinker, faster, stronger.',
                prompt: 'Which suffix do all of those words end with?',
                options: ['-er', '-st', '-ng', 'ai'],
                answer: '-er',
                emoji: '📖'
              }
            ]
          },

          checkpoint2: {
            id: 'g4-u1-cp2',
            title: 'Grammar Bridge',
            subtitle: '5W1H Questions, Past Narrative & -er Comparatives',
            sentenceBuilder: [
              {
                words: ['Who', 'did', 'Alice', 'chase', 'across', 'the', 'field?'],
                answer: 'Who did Alice chase across the field?',
                hint: 'Start with "Who did Alice..." followed by the base verb "chase".',
                grammarFocus: '5W1H Past Simple Question (Who)'
              },
              {
                words: ['Where', 'did', 'Alice', 'fall', 'when', 'she', 'chased', 'him?'],
                answer: 'Where did Alice fall when she chased him?',
                hint: 'Start with "Where did Alice fall...".',
                grammarFocus: '5W1H Past Simple Question (Where)'
              },
              {
                words: ['At', 'first,', 'Alice', 'was', 'bored', 'and', 'sleepy.'],
                answer: 'At first, Alice was bored and sleepy.',
                hint: 'Start with the time phrase "At first,".',
                grammarFocus: 'Character feelings progression'
              },
              {
                words: ['Then,', 'she', 'chased', 'the', 'rabbit', 'and', 'fell', 'down.'],
                answer: 'Then, she chased the rabbit and fell down.',
                hint: 'Start with "Then," followed by "she chased".',
                grammarFocus: 'Past Simple narrative verbs'
              },
              {
                words: ['Brain', 'cells', 'send', 'messages', 'along', 'thin', 'fibers.'],
                answer: 'Brain cells send messages along thin fibers.',
                hint: 'Start with the subject "Brain cells".',
                grammarFocus: 'Present Simple science statements'
              },
              {
                words: ['Reading', 'books', 'gives', 'your', 'brain', 'a', 'great', 'workout.'],
                answer: 'Reading books gives your brain a great workout.',
                hint: 'Start with "Reading books gives...".',
                grammarFocus: 'Gerund subject + singular verb'
              },
              {
                words: ['Good', 'readers', 'visualize', 'the', 'story', 'in', 'their', 'minds.'],
                answer: 'Good readers visualize the story in their minds.',
                hint: 'Start with "Good readers visualize...".',
                grammarFocus: 'Agent noun (-er) + action verb'
              },
              {
                words: ['Learning', 'makes', 'your', 'brain', 'connections', 'stronger', 'and', 'faster.'],
                answer: 'Learning makes your brain connections stronger and faster.',
                hint: 'End with the comparative adjectives "stronger and faster".',
                grammarFocus: 'Comparative adjectives with -er'
              }
            ],
            fillInTheBlank: [
              {
                sentence: '___ did Alice chase across the grass? She chased the White Rabbit.',
                options: ['Who', 'Where', 'When', 'Why'],
                answer: 'Who',
                grammarFocus: '5W1H Question Words (Who vs. Where)',
                hint: 'The answer is a character (the White Rabbit), so ask ___.'
              },
              {
                sentence: '___ did Alice fall? She fell down a deep rabbit hole.',
                options: ['Where', 'Who', 'What time', 'How much'],
                answer: 'Where',
                grammarFocus: '5W1H Question Words (Place)',
                hint: '"Down a deep rabbit hole" is a place.'
              },
              {
                sentence: '___ was Alice feeling sleepy? Because her sister’s book had no pictures or conversations.',
                options: ['Why', 'Who', 'Where', 'Which'],
                answer: 'Why',
                grammarFocus: '5W1H Question Words (Reason)',
                hint: 'The answer starts with "Because".'
              },
              {
                sentence: 'Alice jumped up, ___ the White Rabbit, and fell down the hole.',
                options: ['chased', 'chase', 'chasing', 'chases'],
                answer: 'chased',
                grammarFocus: 'Past Simple narrative consistency',
                hint: 'Match the past tense verbs "jumped" and "fell".'
              },
              {
                sentence: 'As Alice fell, she saw many book ___ on the walls of the hole.',
                options: ['shelves', 'shelf', 'shelfs', 'shell'],
                answer: 'shelves',
                grammarFocus: 'Irregular plural nouns (shelf -> shelves)',
                hint: 'Nouns ending in -f change to -ves in the plural.'
              },
              {
                sentence: 'A person who reads many books and visualizes stories is a great ___.',
                options: ['reader', 'reading', 'read', 'reads'],
                answer: 'reader',
                grammarFocus: 'Suffix -er for agent nouns',
                hint: 'Add -er to "read" to name the person who reads.'
              },
              {
                sentence: 'Giving your brain a daily workout makes your mind ___ than before.',
                options: ['stronger', 'strong', 'strongest', 'strongly'],
                answer: 'stronger',
                grammarFocus: 'Comparative adjectives (-er + than)',
                hint: 'Before "than", use the comparative form ending in -er.'
              },
              {
                sentence: 'When you learn something new, your brain cells grow ___ to connect with each other.',
                options: ['fibers', 'waistcoats', 'corners', 'shelves'],
                answer: 'fibers',
                grammarFocus: 'Neuroscience vocabulary in context',
                hint: 'Which thread-like parts connect brain cells?'
              }
            ]
          },

          checkpoint3: {
            id: 'g4-u1-cp3',
            title: 'Island Boss Temple',
            subtitle: 'Wonderland & Brain-Lobe Master Showdown',
            bossName: 'The White Rabbit Professor',
            bossEmoji: '🎩',
            bossIntro: 'Oh dear, I shall be late! Before I dash around the corner, prove you have mastered Alice’s Adventure, Brain Science, and 5W1H questions!',
            bossQuiz: [
              {
                id: 'g4-u1-b1',
                type: 'reading',
                category: 'Reading Comprehension (Alice)',
                passage: 'Alice was sitting on the riverbank with her sister. She looked at her sister’s book, but it had no pictures or conversations. Just as Alice felt very sleepy, a White Rabbit with pink eyes ran by, took a watch out of his waistcoat pocket, and said, "Oh dear! I shall be late!"',
                question: 'What made Alice suddenly feel curious and jump up to chase the White Rabbit?',
                options: [
                  'The rabbit was wearing a waistcoat (vest), checked a pocket watch, and spoke out loud.',
                  'The rabbit was driving an electric car across the river.',
                  'The rabbit gave her a $100 bill.',
                  'The rabbit was building a nest on a roof.'
                ],
                answer: 'The rabbit was wearing a waistcoat (vest), checked a pocket watch, and spoke out loud.',
                explanation: 'Alice had never seen a rabbit with a waistcoat pocket or a watch to take out of it!'
              },
              {
                id: 'g4-u1-b2',
                type: 'reading',
                category: 'Reading Skill (Character Feelings)',
                question: 'How did Alice’s feelings change from the start of the story to when she fell down the hole?',
                options: [
                  'At first she was bored and sleepy; then she became curious and surprised.',
                  'At first she was angry; then she fell asleep on a shelf.',
                  'At first she was worried about Mars; then she wove cloth.',
                  'At first she was hungry; then she went to a restaurant.'
                ],
                answer: 'At first she was bored and sleepy; then she became curious and surprised.',
                explanation: 'Tracking character feelings shows Alice moving from bored/sleepy to curious/surprised.'
              },
              {
                id: 'g4-u1-b3',
                type: 'reading',
                category: 'Reading Comprehension (Learning & Your Brain)',
                passage: 'Your brain has different lobes and billions of tiny nerve cells. When you read, visualize a story, or practice a hard skill, your brain cells send electrical messages along thin fibers. Practicing again and again makes these connections stronger—just like a workout for your muscles!',
                question: 'According to "Learning and Your Brain", why is reading a book without pictures especially good for your brain?',
                options: [
                  'Because you have to visualize and create your own pictures in your mind, which exercises multiple brain lobes.',
                  'Because books without pictures have no words at all.',
                  'Because it makes your brain cells go to sleep.',
                  'Because it stops nerve fibers from connecting.'
                ],
                answer: 'Because you have to visualize and create your own pictures in your mind, which exercises multiple brain lobes.',
                explanation: 'Visualizing scenes in your imagination activates creative and visual lobes across the brain.'
              },
              {
                id: 'g4-u1-b4',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'Which word means "the main rounded sections of the brain that control seeing, speaking, and thinking"?',
                options: ['lobes', 'shelves', 'waistcoats', 'corners'],
                answer: 'lobes',
                explanation: 'The brain is divided into lobes (such as the frontal, temporal, and occipital lobes).'
              },
              {
                id: 'g4-u1-b5',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'Which word in British English means the exact same thing as a sleeveless "vest"?',
                options: ['waistcoat', 'parachute', 'space suit', 'slingshot'],
                answer: 'waistcoat',
                explanation: 'In "Alice’s Adventures in Wonderland", the White Rabbit wears a waistcoat (a vest).'
              },
              {
                id: 'g4-u1-b6',
                type: 'grammar',
                category: 'Grammar (5W1H Questions)',
                question: 'Choose the correct Wh- question for this answer: "Brain cells send messages BY using electrical signals along nerve fibers."',
                options: [
                  'How do brain cells send messages?',
                  'Who did Alice chase?',
                  'Where is the rabbit hole?',
                  'When did Alice wake up?'
                ],
                answer: 'How do brain cells send messages?',
                explanation: '"How" asks about the way or process something works.'
              },
              {
                id: 'g4-u1-b7',
                type: 'phonics',
                category: 'Spelling & Word Study (-er Suffix)',
                question: 'In the sentence "A creative reader reads faster than before," what two jobs does the "-er" ending do?',
                options: [
                  'In "reader" it names a person who reads, and in "faster" it compares speed.',
                  'In both words it shows past tense.',
                  'In both words it makes the noun plural.',
                  'In both words it means "without".'
                ],
                answer: 'In "reader" it names a person who reads, and in "faster" it compares speed.',
                explanation: 'Unit 1 teaches "-er" both as an agent noun suffix (reader, teacher, writer) and comparative suffix (faster, stronger, smaller).'
              },
              {
                id: 'g4-u1-b8',
                type: 'dialogue',
                category: 'Real-Life Dialogue Q&A',
                speakerA: 'Reading Partner: What happens inside your brain when you practice a hard skill and don’t give up?',
                speakerB: 'You: ___',
                question: 'Choose the best scientifically accurate response from Unit 1:',
                options: [
                  'My brain cells grow fibers and connect, making my brain stronger!',
                  'My brain cells hibernate all winter like a bear.',
                  'My brain barters shells for goats.',
                  'My brain melts like thin Arctic ice.'
                ],
                answer: 'My brain cells grow fibers and connect, making my brain stronger!',
                explanation: 'Practicing builds stronger connections between brain cells and fibers.'
              },
              {
                id: 'g4-u1-b9',
                type: 'reading',
                category: 'Literacy Review Connection (pp. 4–7)',
                question: 'In the Literacy Review ("The Monarch Butterfly’s Journey"), what is the long seasonal trip that monarch butterflies make every autumn called?',
                options: ['migration', 'hibernation', 'invention', 'bartering'],
                answer: 'migration',
                explanation: 'Monarch butterflies make a 3,000-mile autumn migration to warm forests in Mexico.'
              },
              {
                id: 'g4-u1-b10',
                type: 'reading',
                category: 'Connecting Both Readings',
                question: 'At the start of Reading 1, Alice thought a book without pictures was boring. How does Reading 2 ("Learning and Your Brain") show that books without pictures are actually awesome?',
                options: [
                  'When a book has no pictures, your brain gets an extra creative workout because you visualize the scenes yourself!',
                  'Books without pictures have no words, so you can sleep.',
                  'Books without pictures only teach math.',
                  'Books without pictures are easier to carry than goats.'
                ],
                answer: 'When a book has no pictures, your brain gets an extra creative workout because you visualize the scenes yourself!',
                explanation: 'Reading 2 explains how visualizing stories without pictures exercises our imagination and strengthens brain connections.'
              }
            ]
          }
        }
      },

      // -----------------------------------------------------------------------
      // GRADE 4 — UNIT 2: WHAT LIVES HERE?
      // -----------------------------------------------------------------------
      unit2: {
        unitNumber: 2,
        unitId: 'g4-unit2',
        islandName: 'Forest Biome & Swallow Island',
        title: 'What Lives Here?',
        theme: 'Forest Biomes (Deciduous vs. Coniferous Forests), Animal Adaptations, and Kindness to Animals (Korean Folk Tale)',
        bigQuestion: 'How do plants and animals adapt to survive in their habitats, and how should people treat living things?',
        book: 'Global Readings 3',
        pages: 'pp. 24–39',
        readings: {
          reading1: {
            title: 'Two Different Forests',
            genre: 'Informational Life Science Text',
            pages: 'pp. 26–29',
            summary: 'Compares deciduous forests (four seasons, broad leaves that change color and fall in autumn) and coniferous forests (colder northern biome, evergreen trees with waxy needles and cones instead of flowers), and explains how animals hibernate, migrate, or adapt to survive.'
          },
          reading2: {
            title: 'A New Friend (Heungbu and Nolbu / Go Ne and Wen Shu)',
            genre: 'Traditional Folktale',
            pages: 'pp. 32–35',
            summary: 'Kind brother Go Ne rescues a baby swallow that fell from its roof nest and was paid a magic seed of gold, while greedy brother Wen Shu hit a swallow with a slingshot for wealth and learned a hard lesson.'
          }
        },
        readingSkill: 'Author’s Purpose (To Inform vs. To Entertain / Teach a Moral Lesson) & Compare/Contrast Biomes',
        phonicsFocus: {
          pattern: 'ai',
          title: 'Vowel Team "ai" (Long A Sound)',
          description: 'Words spelled with the vowel team "ai" making the long A sound.',
          targetWords: ['rain', 'main', 'mail', 'pain', 'pail', 'tail', 'train', 'chain', 'claim', 'paid', 'sailed', 'wait', 'paint']
        },

        vocabulary: [
          {
            word: 'deciduous',
            partOfSpeech: 'adjective',
            clue: 'Describes trees that have broad flat leaves that change color in autumn and fall off every winter.',
            emoji: '🍂',
            imageKeyword: 'deciduous-autumn-tree',
            sampleSentence: 'In a deciduous forest, trees lose their leaves in autumn to save water.',
            page: 25
          },
          {
            word: 'coniferous',
            partOfSpeech: 'adjective',
            clue: 'Describes evergreen trees that have thin waxy needles and cones instead of broad leaves and flowers.',
            emoji: '🌲',
            imageKeyword: 'coniferous-pine-tree',
            sampleSentence: 'Coniferous trees grow cones instead of flowers and stay green all winter.',
            page: 25
          },
          {
            word: 'biome',
            partOfSpeech: 'noun',
            clue: 'A large natural area of Earth with its own climate, plants, and animals (such as a forest, desert, or tundra).',
            emoji: '🌿',
            imageKeyword: 'forest-biome',
            sampleSentence: 'Each forest biome is home to special plants and animals.',
            page: 26
          },
          {
            word: 'evergreen',
            partOfSpeech: 'adjective / noun',
            clue: 'A tree or plant that keeps its green needles all year round, even in snowy winter.',
            emoji: '🎄',
            imageKeyword: 'evergreen-needles',
            sampleSentence: 'Pine and fir trees are evergreen trees that do not drop their needles in winter.',
            page: 27
          },
          {
            word: 'hibernate',
            partOfSpeech: 'verb',
            clue: 'To spend the cold winter in a deep sleep inside a den or burrow to save energy.',
            emoji: '🐻',
            imageKeyword: 'bear-hibernate',
            sampleSentence: 'Bears and chipmunks eat extra food in autumn so they can hibernate in winter.',
            page: 25
          },
          {
            word: 'survive',
            partOfSpeech: 'verb',
            clue: 'To stay alive, especially when conditions are cold, dry, or dangerous.',
            emoji: '🦌',
            imageKeyword: 'wildlife-survive',
            sampleSentence: 'Thick fur helps forest animals survive the freezing winter.',
            page: 25
          },
          {
            word: 'adapt',
            partOfSpeech: 'verb',
            clue: 'To change your body or behavior so you can live well in your environment.',
            emoji: '🦊',
            imageKeyword: 'arctic-fox-adapt',
            sampleSentence: 'Snowshoe hares adapt to winter by growing white fur so they can hide in the snow.',
            page: 25
          },
          {
            word: 'needle',
            partOfSpeech: 'noun',
            clue: 'A very thin, sharp, waxy green leaf on a pine or coniferous tree.',
            emoji: '🪡',
            imageKeyword: 'pine-needles',
            sampleSentence: 'Waxy pine needles hold water inside the tree during icy winters.',
            page: 27
          },
          {
            word: 'cone',
            partOfSpeech: 'noun',
            clue: 'The hard, woody part of a pine or fir tree that holds and protects its seeds.',
            emoji: '🌰',
            imageKeyword: 'pine-cone',
            sampleSentence: 'Coniferous trees keep their seeds safe inside a woody cone.',
            page: 27
          },
          {
            word: 'swallow',
            partOfSpeech: 'noun',
            clue: 'A small, fast-flying songbird with a forked tail that builds mud nests under roofs.',
            emoji: '🐦',
            imageKeyword: 'swallow-bird',
            sampleSentence: 'A family of swallows built a nest under the roof of Go Ne’s house.',
            page: 31
          },
          {
            word: 'roof',
            partOfSpeech: 'noun',
            clue: 'The top covering of a house or building that protects it from rain and snow.',
            emoji: '🏠',
            imageKeyword: 'house-roof',
            sampleSentence: 'The baby swallow fell down from the high roof and broke its leg.',
            page: 31
          },
          {
            word: 'hit',
            partOfSpeech: 'verb (present & past)',
            clue: 'To strike something hard with a stone or object.',
            emoji: '💥',
            imageKeyword: 'hit-target',
            sampleSentence: 'Cruel Wen Shu hit a poor swallow with a stone from his slingshot.',
            page: 31
          },
          {
            word: 'slingshot',
            partOfSpeech: 'noun',
            clue: 'A Y-shaped stick with a rubber band used to shoot small stones.',
            emoji: '🪵',
            imageKeyword: 'wooden-slingshot',
            sampleSentence: 'Wen Shu used a slingshot to hurt the bird’s leg on purpose.',
            page: 31
          },
          {
            word: 'paid',
            partOfSpeech: 'verb (past of pay)',
            clue: 'Gave money or a reward to someone for their work or kindness (contains "ai" spelling).',
            emoji: '🪙',
            imageKeyword: 'paid-reward',
            sampleSentence: 'The grateful swallow paid Go Ne back with a magical gourd seed.',
            page: 31
          },
          {
            word: 'vet',
            partOfSpeech: 'noun',
            clue: 'An animal doctor (veterinarian) who treats sick or injured animals.',
            emoji: '🩺',
            imageKeyword: 'animal-vet',
            sampleSentence: 'Go Ne cared for the injured bird like a gentle vet and wrapped its leg.',
            page: 33
          }
        ],

        grammar: {
          rules: [
            {
              title: 'Expressing Purpose & Adaptation with "so they can + verb"',
              formula: '[Animals / Plants] + [action] + so they can + [base verb].',
              explanation: 'Use "so they can + base verb" to explain how an adaptation or behavior helps plants and animals survive.',
              examples: [
                'Some animals change color in winter so they can hide in the snow.',
                'Bears eat a lot of food in autumn so they can hibernate all winter.',
                'Deciduous trees drop their leaves so they can save water in winter.',
                'Birds fly south in autumn so they can find warm weather and food.'
              ]
            },
            {
              title: 'Showing Contrast with "instead of"',
              formula: '[Subject + verb] + [noun A] + instead of + [noun B].',
              explanation: 'Use "instead of" to show that one thing replaces another when comparing two biomes or choices.',
              examples: [
                'Coniferous trees have cones instead of flowers or fruit.',
                'Pine trees have thin waxy needles instead of flat broad leaves.',
                'Some animals hibernate in winter instead of migrating south.'
              ]
            },
            {
              title: 'Past Simple Irregular Narrative Verbs (Folktale Storytelling)',
              formula: 'build -> built, fall -> fell, grow -> grew, pay -> paid, hit -> hit, give -> gave, leave -> left',
              explanation: 'Folktales are told in the Past Simple tense. Many common storytelling verbs have irregular past forms.',
              examples: [
                'Two swallows built a nest under the roof of Go Ne’s house.',
                'One baby swallow fell to the ground and broke its leg.',
                'Kind Go Ne wrapped its leg, and the swallow paid him back with a magic seed.',
                'Greedy Wen Shu hit a swallow with his slingshot.'
              ]
            }
          ],
          qaPatterns: [
            {
              question: 'Why do snowshoe hares turn white in winter?',
              answer: 'They turn white in winter so they can hide from predators in the snow.',
              focus: 'Purpose with so they can'
            },
            {
              question: 'How are coniferous trees different from deciduous trees?',
              answer: 'Coniferous trees have waxy needles and cones instead of broad leaves and flowers.',
              focus: 'Contrast with instead of'
            },
            {
              question: 'What did kind Go Ne do when the baby swallow fell from the roof?',
              answer: 'He gently wrapped its broken leg and kept it safe until it could fly.',
              focus: 'Past simple folktale comprehension'
            },
            {
              question: 'What is the author’s purpose in "Two Different Forests" versus "A New Friend"?',
              answer: '"Two Different Forests" is written to inform us about nature, while "A New Friend" is written to entertain and teach a lesson about kindness.',
              focus: 'Reading Skill: Author’s Purpose'
            }
          ],
          dialogues: [
            {
              title: 'Forest Ranger & Folktale Explorer',
              lines: [
                { speaker: 'Ranger Eva', text: 'Welcome to the Northern Coniferous Forest! Look at the pine trees.' },
                { speaker: 'Jayden', text: 'They are still green in the snow! Why don’t they drop their leaves?' },
                { speaker: 'Ranger Eva', text: 'Because they have waxy needles and cones instead of broad leaves and flowers!' },
                { speaker: 'Jayden', text: 'And how do the forest animals survive the freezing winter?' },
                { speaker: 'Ranger Eva', text: 'Bears sleep in dens so they can hibernate, and hares turn white so they can hide!' },
                { speaker: 'Jayden', text: 'And birds like the swallow in Go Ne’s story migrate south so they can stay warm!' }
              ]
            }
          ]
        },

        speakingPrompts: [
          {
            id: 'g4-u2-sp1',
            text: 'Animals change color in winter so they can hide in the snow.',
            focus: 'Adaptation clause (so they can + verb)',
            promptType: 'repeat_and_answer',
            targetKeywords: ['animals', 'change', 'color', 'winter', 'so', 'they', 'can', 'hide', 'snow'],
            hint: 'Link "so they can hide" smoothly as one phrase!'
          },
          {
            id: 'g4-u2-sp2',
            text: 'Coniferous trees have waxy needles and cones instead of broad leaves and flowers.',
            focus: 'Contrast with "instead of" & science vocabulary',
            promptType: 'read_aloud',
            targetKeywords: ['coniferous', 'trees', 'needles', 'cones', 'instead', 'of', 'leaves', 'flowers'],
            hint: 'Pronounce "co-NIF-er-ous" clearly with stress on the second syllable.'
          },
          {
            id: 'g4-u2-sp3',
            text: 'Kind Go Ne helped the swallow that fell from the roof, and the bird paid him back.',
            focus: 'Past simple irregular verbs (fell, paid)',
            promptType: 'read_aloud',
            targetKeywords: ['helped', 'swallow', 'fell', 'roof', 'paid', 'back'],
            hint: 'Make sure "fell" and "paid" sound clear and natural.'
          },
          {
            id: 'g4-u2-sp4',
            text: 'Wait for the main train in the rain after you paint the pail and get paid.',
            focus: 'Phonics "ai" long A vowel team',
            promptType: 'phonics_drill',
            targetKeywords: ['wait', 'main', 'train', 'rain', 'paint', 'pail', 'paid'],
            hint: 'Every target word uses the "ai" vowel team to make the long A sound!'
          }
        ],

        checkpoints: {
          checkpoint1: {
            id: 'g4-u2-cp1',
            title: 'Vocabulary Lagoon',
            subtitle: 'Forest Biomes, Swallow Folktale & "ai" Words',
            wordMatching: [
              { word: 'deciduous', clue: 'Trees with broad flat leaves that change color and fall off in autumn', emoji: '🍂', imageKeyword: 'deciduous-autumn-tree' },
              { word: 'coniferous', clue: 'Evergreen trees that grow waxy needles and cones instead of flowers', emoji: '🌲', imageKeyword: 'coniferous-pine-tree' },
              { word: 'hibernate', clue: 'To sleep deeply through the cold winter inside a den or burrow', emoji: '🐻', imageKeyword: 'bear-hibernate' },
              { word: 'survive', clue: 'To stay alive in cold, dry, or difficult conditions', emoji: '🦌', imageKeyword: 'wildlife-survive' },
              { word: 'adapt', clue: 'To change your body or behavior to fit your habitat', emoji: '🦊', imageKeyword: 'arctic-fox-adapt' },
              { word: 'evergreen', clue: 'A tree that stays green all year round', emoji: '🎄', imageKeyword: 'evergreen-needles' },
              { word: 'swallow', clue: 'A small fast bird with a forked tail that nests under roofs', emoji: '🐦', imageKeyword: 'swallow-bird' },
              { word: 'roof', clue: 'The top cover of a house', emoji: '🏠', imageKeyword: 'house-roof' },
              { word: 'slingshot', clue: 'A Y-shaped stick with a band used by Wen Shu to shoot a stone', emoji: '🪵', imageKeyword: 'wooden-slingshot' },
              { word: 'paid', clue: 'Gave money or a reward for kindness (past tense of pay)', emoji: '🪙', imageKeyword: 'paid-reward' },
              { word: 'biome', clue: 'A large natural region with its own climate, plants, and animals', emoji: '🌿', imageKeyword: 'forest-biome' },
              { word: 'cone', clue: 'The hard woody part of a pine tree that holds seeds', emoji: '🌰', imageKeyword: 'pine-cone' }
            ],
            missingLetters: [
              { word: 'deciduous', masked: 'd e c i _ u o u _', missingLetters: ['d', 's'], unscrambleTiles: ['d', 'e', 'c', 'i', 'd', 'u', 'o', 'u', 's'], clue: 'Trees that drop their leaves in autumn', emoji: '🍂' },
              { word: 'coniferous', masked: 'c o n i _ e r o u _', missingLetters: ['f', 's'], unscrambleTiles: ['c', 'o', 'n', 'i', 'f', 'e', 'r', 'o', 'u', 's'], clue: 'Trees that have cones and needles', emoji: '🌲' },
              { word: 'hibernate', masked: 'h i b e _ n a t _', missingLetters: ['r', 'e'], unscrambleTiles: ['h', 'i', 'b', 'e', 'r', 'n', 'a', 't', 'e'], clue: 'To sleep through the winter', emoji: '🐻' },
              { word: 'survive', masked: 's u r _ i v _', missingLetters: ['v', 'e'], unscrambleTiles: ['s', 'u', 'r', 'v', 'i', 'v', 'e'], clue: 'To stay alive in harsh weather', emoji: '🦌' },
              { word: 'adapt', masked: 'a d _ p _', missingLetters: ['a', 't'], unscrambleTiles: ['a', 'd', 'a', 'p', 't'], clue: 'To change to fit your environment', emoji: '🦊' },
              { word: 'swallow', masked: 's w a _ _ o w', missingLetters: ['l', 'l'], unscrambleTiles: ['s', 'w', 'a', 'l', 'l', 'o', 'w'], clue: 'The bird that Go Ne rescued', emoji: '🐦' },
              { word: 'slingshot', masked: 's l i n g _ h o _', missingLetters: ['s', 't'], unscrambleTiles: ['s', 'l', 'i', 'n', 'g', 's', 'h', 'o', 't'], clue: 'Wen Shu used this to shoot a stone', emoji: '🪵' },
              { word: 'paid', masked: 'p _ _ d', missingLetters: ['a', 'i'], unscrambleTiles: ['p', 'a', 'i', 'd'], clue: 'Past tense of pay (has the "ai" vowel team)', emoji: '🪙' },
              { word: 'evergreen', masked: 'e v e r _ r e e _', missingLetters: ['g', 'n'], unscrambleTiles: ['e', 'v', 'e', 'r', 'g', 'r', 'e', 'e', 'n'], clue: 'Keeps its green needles all year', emoji: '🎄' },
              { word: 'biome', masked: 'b i _ m _', missingLetters: ['o', 'e'], unscrambleTiles: ['b', 'i', 'o', 'm', 'e'], clue: 'A major habitat zone like a forest', emoji: '🌿' }
            ],
            listenAndPick: [
              {
                say: 'In a deciduous forest, broad leaves turn red, orange, and gold before falling in autumn.',
                prompt: 'Which type of forest loses its broad leaves every autumn?',
                options: ['deciduous', 'coniferous', 'creative', 'expensive'],
                answer: 'deciduous',
                emoji: '🍂'
              },
              {
                say: 'Coniferous trees grow woody cones and thin waxy needles that stay green all winter.',
                prompt: 'Which type of tree grows cones and waxy needles?',
                options: ['coniferous', 'deciduous', 'sleepy', 'noisy'],
                answer: 'coniferous',
                emoji: '🌲'
              },
              {
                say: 'Bears eat extra berries and fish in autumn so they can hibernate in a warm den all winter.',
                prompt: 'Which word means sleeping deeply through the winter?',
                options: ['hibernate', 'visualize', 'barter', 'weave'],
                answer: 'hibernate',
                emoji: '🐻'
              },
              {
                say: 'A baby swallow fell down from its nest on the roof, and kind Go Ne helped it.',
                prompt: 'Which bird did Go Ne rescue in "A New Friend"?',
                options: ['swallow', 'monarch', 'polar bear', 'goat'],
                answer: 'swallow',
                emoji: '🐦'
              },
              {
                say: 'Greedy Wen Shu used a slingshot to hit a swallow because he wanted gold.',
                prompt: 'What did Wen Shu use to hit the swallow?',
                options: ['slingshot', 'parachute', 'waistcoat', 'credit card'],
                answer: 'slingshot',
                emoji: '🪵'
              },
              {
                say: 'Listen to these words: rain, train, mail, tail, pain, paid, wait.',
                prompt: 'Which two letters make the long A vowel sound in all of those words?',
                options: ['ai', 'ar', 'ee', 'oa'],
                answer: 'ai',
                emoji: '🌧️'
              }
            ]
          },

          checkpoint2: {
            id: 'g4-u2-cp2',
            title: 'Grammar Bridge',
            subtitle: '"So They Can", "Instead Of" & Irregular Past Verbs',
            sentenceBuilder: [
              {
                words: ['Animals', 'change', 'color', 'so', 'they', 'can', 'hide', 'in', 'the', 'snow.'],
                answer: 'Animals change color so they can hide in the snow.',
                hint: 'Use "so they can hide" to explain the purpose of changing color.',
                grammarFocus: 'Purpose clause (so they can + verb)'
              },
              {
                words: ['Bears', 'eat', 'extra', 'food', 'so', 'they', 'can', 'hibernate', 'in', 'winter.'],
                answer: 'Bears eat extra food so they can hibernate in winter.',
                hint: 'Use "so they can hibernate" after "Bears eat extra food".',
                grammarFocus: 'Purpose clause (so they can + verb)'
              },
              {
                words: ['Coniferous', 'trees', 'have', 'cones', 'instead', 'of', 'flowers', 'or', 'fruit.'],
                answer: 'Coniferous trees have cones instead of flowers or fruit.',
                hint: 'Use "instead of" between "cones" and "flowers or fruit".',
                grammarFocus: 'Contrast with instead of'
              },
              {
                words: ['Pine', 'trees', 'have', 'waxy', 'needles', 'instead', 'of', 'broad', 'leaves.'],
                answer: 'Pine trees have waxy needles instead of broad leaves.',
                hint: 'Use "instead of" after "waxy needles".',
                grammarFocus: 'Contrast with instead of'
              },
              {
                words: ['Two', 'swallows', 'built', 'a', 'nest', 'under', 'the', 'roof.'],
                answer: 'Two swallows built a nest under the roof.',
                hint: 'Use the past tense verb "built" after "Two swallows".',
                grammarFocus: 'Past Simple irregular (build -> built)'
              },
              {
                words: ['The', 'grateful', 'swallow', 'paid', 'Go', 'Ne', 'with', 'a', 'magic', 'seed.'],
                answer: 'The grateful swallow paid Go Ne with a magic seed.',
                hint: 'Start with "The grateful swallow paid Go Ne...".',
                grammarFocus: 'Past Simple irregular (pay -> paid)'
              },
              {
                words: ['Thick', 'fur', 'helps', 'animals', 'survive', 'the', 'cold', 'winter.'],
                answer: 'Thick fur helps animals survive the cold winter.',
                hint: 'Start with "Thick fur helps...".',
                grammarFocus: 'Present Simple adaptation facts'
              },
              {
                words: ['Deciduous', 'trees', 'drop', 'their', 'leaves', 'so', 'they', 'can', 'save', 'water.'],
                answer: 'Deciduous trees drop their leaves so they can save water.',
                hint: 'End with "so they can save water."',
                grammarFocus: 'Purpose clause (so they can + verb)'
              }
            ],
            fillInTheBlank: [
              {
                sentence: 'Arctic foxes grow white fur in winter ___ they can hide in the snow.',
                options: ['so', 'instead', 'because of', 'twice'],
                answer: 'so',
                grammarFocus: 'Purpose clause (so they can + verb)',
                hint: 'Combine this word with "they can hide" to show purpose.'
              },
              {
                sentence: 'Coniferous trees grow woody cones ___ of flowers or fruit.',
                options: ['instead', 'because', 'so', 'first'],
                answer: 'instead',
                grammarFocus: 'Prepositional phrase (instead of)',
                hint: 'Which word pairs with "of" to mean "in place of"?'
              },
              {
                sentence: 'Squirrels gather nuts in autumn so they ___ have enough food in winter.',
                options: ['can', 'did', 'were', 'instead'],
                answer: 'can',
                grammarFocus: 'Purpose clause (so they can + verb)',
                hint: 'Remember the unit pattern: "so they ___ + verb".'
              },
              {
                sentence: 'Last spring, two swallows ___ a mud nest under Go Ne’s roof.',
                options: ['built', 'build', 'building', 'builds'],
                answer: 'built',
                grammarFocus: 'Past Simple irregular verb (build -> built)',
                hint: '"Last spring" requires the irregular past tense of "build".'
              },
              {
                sentence: 'When Go Ne planted the swallow’s seed, a huge gourd ___ in his garden.',
                options: ['grew', 'grow', 'growing', 'grows'],
                answer: 'grew',
                grammarFocus: 'Past Simple irregular verb (grow -> grew)',
                hint: 'What is the irregular past tense of "grow"?'
              },
              {
                sentence: 'The kind swallow ___ Go Ne back for his kindness with gold and treasures.',
                options: ['paid', 'pay', 'paying', 'pays'],
                answer: 'paid',
                grammarFocus: 'Past Simple irregular verb & "ai" spelling (pay -> paid)',
                hint: 'What is the past tense of "pay" spelled with "ai"?'
              },
              {
                sentence: 'In a ___ forest, broad leaves turn red and yellow and fall off every autumn.',
                options: ['deciduous', 'coniferous', 'evergreen', 'plastic'],
                answer: 'deciduous',
                grammarFocus: 'Forest biome vocabulary',
                hint: 'Which forest type loses its leaves in autumn?'
              },
              {
                sentence: 'To stay alive in freezing weather, plants and animals must ___ to their biome.',
                options: ['adapt', 'barter', 'visualize', 'invent'],
                answer: 'adapt',
                grammarFocus: 'Adaptation vocabulary in context',
                hint: 'Which verb means to adjust to your environment in order to survive?'
              }
            ]
          },

          checkpoint3: {
            id: 'g4-u2-cp3',
            title: 'Island Boss Temple',
            subtitle: 'Forest Biome & Swallow Guardian Showdown',
            bossName: 'Elder Evergreen & The Golden Swallow',
            bossEmoji: '🌲',
            bossIntro: 'Welcome to the Ancient Forest Temple! Show us that you know Deciduous vs. Coniferous Forests, the Swallow Folktale, and "ai" words!',
            bossQuiz: [
              {
                id: 'g4-u2-b1',
                type: 'reading',
                category: 'Reading Comprehension (Two Different Forests)',
                passage: 'Deciduous forests have four distinct seasons: warm summers and cold winters. Their trees have broad, flat leaves that change color in autumn and fall off in winter. Coniferous forests grow in colder northern regions. Their evergreen trees have thin, waxy needles and woody cones instead of flowers.',
                question: 'Why do coniferous trees have thin, waxy needles instead of broad flat leaves?',
                options: [
                  'So they can keep water inside and survive freezing, snowy winters without dropping their leaves.',
                  'So they can turn orange and fall off every October.',
                  'So they can catch sunlight to power a solar car.',
                  'So they can hibernate underground like chipmunks.'
                ],
                answer: 'So they can keep water inside and survive freezing, snowy winters without dropping their leaves.',
                explanation: 'Waxy needles prevent water loss and shed snow easily, helping evergreen trees survive harsh northern winters.'
              },
              {
                id: 'g4-u2-b2',
                type: 'reading',
                category: 'Reading Comprehension (A New Friend)',
                passage: 'When a baby swallow fell from the roof and broke its leg, kind Go Ne gently wrapped the bird’s leg. Next spring, the swallow returned and dropped a seed. Huge gourds grew filled with gold! Greedy Wen Shu wanted gold too, so he hit a swallow with his slingshot just so he could fix its leg.',
                question: 'Why did greedy Wen Shu NOT receive gold from his gourd seed at the end of the story?',
                options: [
                  'Because he hurt the swallow on purpose with his slingshot out of greed instead of showing true kindness.',
                  'Because he planted his seed in a coniferous forest in winter.',
                  'Because he lost his $100 bill at a restaurant.',
                  'Because he forgot to wear a space suit.'
                ],
                answer: 'Because he hurt the swallow on purpose with his slingshot out of greed instead of showing true kindness.',
                explanation: 'The moral of the folktale is that kindness to living things is rewarded, while cruelty and greed bring trouble.'
              },
              {
                id: 'g4-u2-b3',
                type: 'reading',
                category: 'Reading Skill (Author’s Purpose)',
                question: 'What is the main difference in Author’s Purpose between "Two Different Forests" and "A New Friend"?',
                options: [
                  '"Two Different Forests" is written to inform readers with science facts, while "A New Friend" is written to entertain and teach a moral lesson.',
                  'Both texts are science fiction stories set on Mars.',
                  'Both texts are poems about polar bears.',
                  '"Two Different Forests" is a folktale, and "A New Friend" is a history timeline.'
                ],
                answer: '"Two Different Forests" is written to inform readers with science facts, while "A New Friend" is written to entertain and teach a moral lesson.',
                explanation: 'Informational texts inform us about real-world biomes, whereas folktales entertain and teach life lessons.'
              },
              {
                id: 'g4-u2-b4',
                type: 'grammar',
                category: 'Grammar (so they can)',
                question: 'Complete the sentence with the correct target structure: "Deciduous trees drop their broad leaves in autumn ___ save water during the cold winter."',
                options: [
                  'so they can',
                  'instead of',
                  'who did',
                  'how much'
                ],
                answer: 'so they can',
                explanation: '"so they can + base verb" expresses the purpose of an adaptation.'
              },
              {
                id: 'g4-u2-b5',
                type: 'grammar',
                category: 'Grammar (instead of)',
                question: 'Complete the sentence: "Coniferous trees protect their seeds inside woody cones ___ flowers or fruit."',
                options: [
                  'instead of',
                  'so they can',
                  'at first',
                  'belong to'
                ],
                answer: 'instead of',
                explanation: '"instead of" is used to contrast cones with flowers or fruit.'
              },
              {
                id: 'g4-u2-b6',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'Which word means "to spend the winter in a deep sleep to save energy"?',
                options: ['hibernate', 'visualize', 'barter', 'invent'],
                answer: 'hibernate',
                explanation: 'Animals like bears and bats hibernate during winter when food is scarce.'
              },
              {
                id: 'g4-u2-b7',
                type: 'grammar',
                category: 'Grammar (Past Simple Irregular Verbs)',
                question: 'Which list shows the correct Past Simple forms of these four verbs from "A New Friend": build, fall, grow, pay?',
                options: [
                  'built, fell, grew, paid',
                  'builded, falled, growed, payed',
                  'building, falling, growing, paying',
                  'builds, falls, grows, pays'
                ],
                answer: 'built, fell, grew, paid',
                explanation: 'All four verbs are irregular in the Past Simple: build -> built, fall -> fell, grow -> grew, pay -> paid.'
              },
              {
                id: 'g4-u2-b8',
                type: 'phonics',
                category: 'Phonics ("ai" Vowel Team)',
                question: 'Which set of words ALL contain the "ai" vowel team making the long A sound?',
                options: [
                  'rain, train, mail, tail, paid, paint',
                  'park, hard, card, farm, start, jar',
                  'sing, long, spring, fishing, melting',
                  'harvest, feast, contest, first, best'
                ],
                answer: 'rain, train, mail, tail, paid, paint',
                explanation: 'All six words contain the "ai" vowel team taught in Grade 4 Unit 2.'
              },
              {
                id: 'g4-u2-b9',
                type: 'dialogue',
                category: 'Real-Life Dialogue Q&A',
                speakerA: 'Nature Guide: How do birds like the swallow survive when winter comes to a deciduous forest?',
                speakerB: 'You: ___',
                question: 'Choose the best response:',
                options: [
                  'They fly south to warmer places so they can find food and survive the winter.',
                  'They grow woody cones and waxy needles instead of feathers.',
                  'They use a slingshot to build a roof.',
                  'They pay ninety-five dollars with a credit card.'
                ],
                answer: 'They fly south to warmer places so they can find food and survive the winter.',
                explanation: 'Swallows migrate to warmer places in autumn so they can find insects and survive.'
              },
              {
                id: 'g4-u2-b10',
                type: 'vocabulary',
                category: 'Vocabulary',
                question: 'What do we call an animal doctor who treats sick or injured animals?',
                options: ['a vet', 'an ancestor', 'a cashier', 'an enemy'],
                answer: 'a vet',
                explanation: 'A vet (veterinarian) cares for injured animals.'
              }
            ]
          }
        }
      },

      // -----------------------------------------------------------------------
      // GRADE 4 — UNIT 3: HOW MUCH IS IT?
      // -----------------------------------------------------------------------
      unit3: {
        unitNumber: 3,
        unitId: 'g4-unit3',
        islandName: 'Treasure Vault & Market Island',
        title: 'How Much Is It?',
        theme: 'The History of Money (Bartering to Electronic Money) and Making Honest Financial Choices (The $100 Bill)',
        bigQuestion: 'How has money changed over time, and how do we make wise, honest choices with money?',
        book: 'Global Readings 3',
        pages: 'pp. 40–55',
        readings: {
          reading1: {
            title: 'The History of Money',
            genre: 'Informational History Timeline',
            pages: 'pp. 42–45',
            summary: 'Traces how humans paid for things across history: bartering goats and grain (9000 BCE), cowrie shells in China (1200 BCE), metal tool coins, gold/silver coins in Lydia (600 BCE), paper money in China (800 CE), the first plastic credit card (1958), and electronic money on the internet today.'
          },
          reading2: {
            title: 'The $100 Bill',
            genre: 'Realistic Fiction (Moral Dilemma)',
            pages: 'pp. 48–51',
            summary: 'Paige wants a $95 cell phone, but her mom says money is tight. When Paige finds a $100 bill in a store parking lot, she realizes she cannot find who it belongs to and decides to give it to her mom to help the family.'
          }
        },
        readingSkill: 'Chronological Order / Reading a Historical Timeline & Analyzing Problem and Solution in Moral Dilemmas',
        phonicsFocus: {
          pattern: 'ar',
          title: 'R-Controlled Vowel "ar"',
          description: 'Words with the "ar" spelling pattern from the money and market readings.',
          targetWords: ['bartered', 'credit card', 'card', 'park', 'hard', 'car', 'farm', 'farmer', 'start', 'jar', 'market', 'smart', 'dollars']
        },

        vocabulary: [
          {
            word: 'bartered',
            partOfSpeech: 'verb (past)',
            clue: 'Traded goods or animals directly with someone without using any money.',
            emoji: '🐐',
            imageKeyword: 'barter-goat-grain',
            sampleSentence: 'Long ago, people bartered animals and grain instead of using coins.',
            page: 41
          },
          {
            word: 'metal',
            partOfSpeech: 'noun / adjective',
            clue: 'A hard, shiny material like gold, silver, bronze, or iron used to make coins.',
            emoji: '🪙',
            imageKeyword: 'metal-coins',
            sampleSentence: 'In ancient China, people made small metal coins shaped like knives and spades.',
            page: 41
          },
          {
            word: 'valuable',
            partOfSpeech: 'adjective',
            clue: 'Worth a lot of money or very important and rare.',
            emoji: '💎',
            imageKeyword: 'valuable-gold-gem',
            sampleSentence: 'Gold and silver were used for coins because they were rare and valuable.',
            page: 41
          },
          {
            word: 'credit card',
            partOfSpeech: 'noun',
            clue: 'A small rectangular card that lets people buy things now and pay the bank later.',
            emoji: '💳',
            imageKeyword: 'plastic-credit-card',
            sampleSentence: 'The first modern plastic credit card was made in 1958.',
            page: 41
          },
          {
            word: 'plastic',
            partOfSpeech: 'noun / adjective',
            clue: 'A light, strong man-made material used to make credit cards.',
            emoji: '🪪',
            imageKeyword: 'plastic-card',
            sampleSentence: 'A plastic credit card is much lighter and easier to carry than heavy coins.',
            page: 41
          },
          {
            word: 'belong to',
            partOfSpeech: 'phrasal verb',
            clue: 'To be owned by someone.',
            emoji: '🙋',
            imageKeyword: 'belong-to-owner',
            sampleSentence: 'Paige looked around the parking lot to see who the $100 bill might belong to.',
            page: 47
          },
          {
            word: 'return',
            partOfSpeech: 'verb',
            clue: 'To give something back to the person who lost or owns it.',
            emoji: '↩️',
            imageKeyword: 'return-lost-item',
            sampleSentence: 'Paige wanted to return the lost money to its rightful owner.',
            page: 47
          },
          {
            word: 'pocket',
            partOfSpeech: 'noun',
            clue: 'A small pouch sewn into a jacket, vest, or pants for carrying small items.',
            emoji: '👖',
            imageKeyword: 'pants-pocket',
            sampleSentence: 'Paige put the $100 bill safely inside her coat pocket.',
            page: 47
          },
          {
            word: 'restaurant',
            partOfSpeech: 'noun',
            clue: 'A place where people go to buy and eat a meal prepared by chefs.',
            emoji: '🍽️',
            imageKeyword: 'family-restaurant',
            sampleSentence: 'Mom smiled and said, "Let’s go out to a nice restaurant for dinner!"',
            page: 47
          },
          {
            word: 'money is tight',
            partOfSpeech: 'idiom / phrase',
            clue: 'A family does not have extra money to spend on expensive things right now.',
            emoji: '👛',
            imageKeyword: 'tight-budget-wallet',
            sampleSentence: 'Mom told Paige that she could not buy the cell phone because money is tight.',
            page: 48
          },
          {
            word: 'coin',
            partOfSpeech: 'noun',
            clue: 'A small, flat, round piece of metal used as money.',
            emoji: '🪙',
            imageKeyword: 'gold-coin',
            sampleSentence: 'The first round gold and silver coins were made in Lydia around 600 BCE.',
            page: 43
          },
          {
            word: 'bill',
            partOfSpeech: 'noun',
            clue: 'A piece of paper money, such as a $1 bill or a $100 bill.',
            emoji: '💵',
            imageKeyword: 'hundred-dollar-bill',
            sampleSentence: 'Paige looked down and saw a crisp $100 bill on the ground.',
            page: 48
          },
          {
            word: 'electronic money',
            partOfSpeech: 'noun phrase',
            clue: 'Digital money sent through computers, phones, and the internet without paper or coins.',
            emoji: '📱',
            imageKeyword: 'electronic-money-phone',
            sampleSentence: 'Today, many people use electronic money to buy things on the internet.',
            page: 45
          },
          {
            word: 'carry',
            partOfSpeech: 'verb',
            clue: 'To hold something and take it with you from one place to another.',
            emoji: '🎒',
            imageKeyword: 'carry-bag',
            sampleSentence: 'Paper money was much easier to carry than heavy bags of metal coins.',
            page: 44
          },
          {
            word: 'save',
            partOfSpeech: 'verb',
            clue: 'To keep money in a bank or jar for the future instead of spending it all now.',
            emoji: '🏦',
            imageKeyword: 'piggy-bank-save',
            sampleSentence: 'I should save part of my money in the bank for later.',
            page: 52
          }
        ],

        grammar: {
          rules: [
            {
              title: 'Asking & Answering Prices (How much is it? / How much are they?)',
              formula: 'How much is it? -> It’s [number] dollars. That’s expensive!',
              explanation: 'Use "How much is..." for one item and "How much are..." for plural items.',
              examples: [
                'How much is the cell phone? It’s ninety-five dollars. That’s expensive!',
                'How much is this book? It’s ten dollars.',
                'How much are those shoes? They are forty dollars.'
              ]
            },
            {
              title: 'Comparatives with Infinitives (easier to ... than)',
              formula: '[Noun A] + was/is + easier to + [base verb] + than + [Noun B].',
              explanation: 'Use "easier to carry than" or "harder to use than" to explain why new forms of money were invented.',
              examples: [
                'Cowrie shells were easier to carry than goats and bags of grain.',
                'Paper money is easier to carry than heavy metal coins.',
                'Electronic money is faster to send than paper bills.'
              ]
            },
            {
              title: 'Past Simple Affirmative & Negative (bartered / paid / didn’t use / didn’t know)',
              formula: '[Subject] + [past verb]. / [Subject] + didn’t + [base verb].',
              explanation: 'Use "didn’t + base verb" (not past verb!) to form negative sentences in the Past Simple.',
              examples: [
                'Long ago, people didn’t use coins or paper money. They bartered.',
                'The farmer bought a goat, and he paid for it with grain.',
                'Paige found a $100 bill, and she didn’t know what to do.'
              ]
            },
            {
              title: 'Modals for Possibility, Advice, and Decisions (could / should / would / Let’s)',
              formula: 'She could + [verb]. / What should I do? I should + [verb]. / What would you do? I would + [verb]. / Let’s + [verb].',
              explanation: 'Use "could" for possibility, "should" for moral advice, "would" for imaginary situations, and "Let’s" for suggestions.',
              examples: [
                'With the $100 bill, Paige could buy the cell phone now.',
                'What should she do? She should try to return it or help her family.',
                'What would you do if you found $100? I would tell my parents.',
                'Let’s go out to a restaurant for dinner!'
              ]
            }
          ],
          qaPatterns: [
            {
              question: 'How much is the cell phone that Paige wants?',
              answer: 'It’s ninety-five dollars. That’s expensive!',
              focus: 'Asking and stating prices'
            },
            {
              question: 'Why did people start using shells and coins instead of bartering goats?',
              answer: 'Because shells and coins were much easier to carry than goats and grain.',
              focus: 'easier to [verb] than'
            },
            {
              question: 'Who does the lost $100 bill belong to?',
              answer: 'Paige didn’t know who it belonged to because the parking lot was empty.',
              focus: 'belong to & Past Simple negative'
            },
            {
              question: 'What would you do if you found a $100 bill?',
              answer: 'I would try to return it, or I would save the money and help my family.',
              focus: 'Modal would / should'
            }
          ],
          dialogues: [
            {
              title: 'At the Store with Paige and Mom',
              lines: [
                { speaker: 'Paige', text: 'Mom, look at that cool cell phone! How much is it?' },
                { speaker: 'Mom', text: 'It’s ninety-five dollars. That’s expensive, Paige, and money is tight right now.' },
                { speaker: 'Paige', text: 'Wait—look on the ground in the parking lot! I just found a $100 bill! Who does it belong to?' },
                { speaker: 'Mom', text: 'There is nobody around here, so we cannot find the owner to return it.' },
                { speaker: 'Paige', text: 'I could buy the cell phone, but I know money is tight. Here, Mom—I want our family to have it!' },
                { speaker: 'Mom', text: 'Thank you, Paige! That is so thoughtful. Let’s go out to a restaurant together!' }
              ]
            }
          ]
        },

        speakingPrompts: [
          {
            id: 'g4-u3-sp1',
            text: 'How much is it? It is ninety-five dollars. That is expensive!',
            focus: 'Asking and answering prices',
            promptType: 'repeat_and_answer',
            targetKeywords: ['how', 'much', 'is', 'it', 'ninety-five', 'dollars', 'expensive'],
            hint: 'Use expressive intonation on "That is expensive!"'
          },
          {
            id: 'g4-u3-sp2',
            text: 'Shells and paper bills were easier to carry than heavy goats and metal coins.',
            focus: 'Comparative structure (easier to carry than)',
            promptType: 'read_aloud',
            targetKeywords: ['shells', 'paper', 'bills', 'easier', 'to', 'carry', 'than', 'metal', 'coins'],
            hint: 'Link "easier to carry than" smoothly.'
          },
          {
            id: 'g4-u3-sp3',
            text: 'Long ago, people didn’t use plastic credit cards; they bartered grain and animals.',
            focus: 'Past simple negative (didn’t use) & affirmative (bartered)',
            promptType: 'read_aloud',
            targetKeywords: ['people', 'didn’t', 'use', 'plastic', 'credit', 'cards', 'bartered', 'grain'],
            hint: 'After "didn’t", say the base verb "use".'
          },
          {
            id: 'g4-u3-sp4',
            text: 'The smart farmer drove his car from the farm to the market park with a credit card and a jar of dollars.',
            focus: 'Phonics r-controlled vowel "ar"',
            promptType: 'phonics_drill',
            targetKeywords: ['smart', 'farmer', 'car', 'farm', 'market', 'park', 'card', 'jar', 'dollars'],
            hint: 'Emphasize the clear "ar" sound in smart, farmer, car, farm, market, park, card, and jar!'
          }
        ],

        checkpoints: {
          checkpoint1: {
            id: 'g4-u3-cp1',
            title: 'Vocabulary Lagoon',
            subtitle: 'History of Money, The $100 Bill & "ar" Words',
            wordMatching: [
              { word: 'bartered', clue: 'Traded goods or animals directly without using any money', emoji: '🐐', imageKeyword: 'barter-goat-grain' },
              { word: 'metal', clue: 'A hard shiny material like gold, silver, or bronze used for coins', emoji: '🪙', imageKeyword: 'metal-coins' },
              { word: 'valuable', clue: 'Worth a lot of money; precious and rare', emoji: '💎', imageKeyword: 'valuable-gold-gem' },
              { word: 'credit card', clue: 'A small plastic card used to buy things and pay the bank later', emoji: '💳', imageKeyword: 'plastic-credit-card' },
              { word: 'plastic', clue: 'Light, strong material used to make modern credit cards', emoji: '🪪', imageKeyword: 'plastic-card' },
              { word: 'belong to', clue: 'To be owned by a particular person', emoji: '🙋', imageKeyword: 'belong-to-owner' },
              { word: 'return', clue: 'To give something back to the person who lost it', emoji: '↩️', imageKeyword: 'return-lost-item' },
              { word: 'pocket', clue: 'A small pouch in your jacket or pants for holding money', emoji: '👖', imageKeyword: 'pants-pocket' },
              { word: 'restaurant', clue: 'A place where families go to buy and eat a prepared meal', emoji: '🍽️', imageKeyword: 'family-restaurant' },
              { word: 'money is tight', clue: 'Not having extra money to spend on expensive wants', emoji: '👛', imageKeyword: 'tight-budget-wallet' },
              { word: 'electronic money', clue: 'Digital money used on computers and the internet', emoji: '📱', imageKeyword: 'electronic-money-phone' },
              { word: 'save', clue: 'To keep money in a bank or jar for the future', emoji: '🏦', imageKeyword: 'piggy-bank-save' }
            ],
            missingLetters: [
              { word: 'bartered', masked: 'b _ _ t e r e d', missingLetters: ['a', 'r'], unscrambleTiles: ['b', 'a', 'r', 't', 'e', 'r', 'e', 'd'], clue: 'Traded goods without money (has "ar")', emoji: '🐐' },
              { word: 'valuable', masked: 'v a l u _ b l _', missingLetters: ['a', 'e'], unscrambleTiles: ['v', 'a', 'l', 'u', 'a', 'b', 'l', 'e'], clue: 'Worth a lot of money, like gold', emoji: '💎' },
              { word: 'plastic', masked: 'p l a _ t i _', missingLetters: ['s', 'c'], unscrambleTiles: ['p', 'l', 'a', 's', 't', 'i', 'c'], clue: 'Material used to make credit cards', emoji: '💳' },
              { word: 'metal', masked: 'm e _ a _', missingLetters: ['t', 'l'], unscrambleTiles: ['m', 'e', 't', 'a', 'l'], clue: 'Gold, silver, and bronze are types of ___', emoji: '🪙' },
              { word: 'return', masked: 'r e t _ r _', missingLetters: ['u', 'n'], unscrambleTiles: ['r', 'e', 't', 'u', 'r', 'n'], clue: 'To give a lost item back to its owner', emoji: '↩️' },
              { word: 'pocket', masked: 'p o _ k e _', missingLetters: ['c', 't'], unscrambleTiles: ['p', 'o', 'c', 'k', 'e', 't'], clue: 'Paige put the $100 bill into her ___', emoji: '👖' },
              { word: 'restaurant', masked: 'r e s t a u _ a n _', missingLetters: ['r', 't'], unscrambleTiles: ['r', 'e', 's', 't', 'a', 'u', 'r', 'a', 'n', 't'], clue: 'A place where you go out to eat dinner', emoji: '🍽️' },
              { word: 'expensive', masked: 'e x p e _ s i v _', missingLetters: ['n', 'e'], unscrambleTiles: ['e', 'x', 'p', 'e', 'n', 's', 'i', 'v', 'e'], clue: 'The $95 cell phone was very ___', emoji: '💰' },
              { word: 'carry', masked: 'c a _ _ y', missingLetters: ['r', 'r'], unscrambleTiles: ['c', 'a', 'r', 'r', 'y'], clue: 'Shells were easier to ___ than goats', emoji: '🎒' },
              { word: 'save', masked: 's _ v _', missingLetters: ['a', 'e'], unscrambleTiles: ['s', 'a', 'v', 'e'], clue: 'To keep money for later instead of spending it', emoji: '🏦' }
            ],
            listenAndPick: [
              {
                say: 'Nine thousand years ago, people didn’t use coins; they bartered goats and grain.',
                prompt: 'Which word means trading goods directly without using money?',
                options: ['bartered', 'hibernated', 'visualized', 'melted'],
                answer: 'bartered',
                emoji: '🐐'
              },
              {
                say: 'Gold and silver were used to make coins because they were rare and valuable.',
                prompt: 'Which word means worth a lot of money?',
                options: ['valuable', 'sleepy', 'noisy', 'thin'],
                answer: 'valuable',
                emoji: '💎'
              },
              {
                say: 'In 1958, banks introduced the first modern plastic credit card.',
                prompt: 'What material is a modern credit card made of?',
                options: ['plastic', 'cloth', 'wood', 'wheat'],
                answer: 'plastic',
                emoji: '💳'
              },
              {
                say: 'Paige wanted to know who the hundred-dollar bill belonged to so she could return it.',
                prompt: 'Which word means to give something back to its owner?',
                options: ['return', 'barter', 'chase', 'weave'],
                answer: 'return',
                emoji: '↩️'
              },
              {
                say: 'Mom said they could not buy the ninety-five-dollar phone right now because money is tight.',
                prompt: 'What expression means a family does not have extra money to spend right now?',
                options: ['money is tight', 'try again', 'so they can', 'instead of'],
                answer: 'money is tight',
                emoji: '👛'
              },
              {
                say: 'Listen to these words: park, hard, card, farm, farmer, start, jar, bartered.',
                prompt: 'Which r-controlled vowel pattern do all of those words share?',
                options: ['ar', 'ai', '-ng', 'cl-'],
                answer: 'ar',
                emoji: '🚗'
              }
            ]
          },

          checkpoint2: {
            id: 'g4-u3-cp2',
            title: 'Grammar Bridge',
            subtitle: 'Prices, "Easier To... Than", Past Negative & Modals',
            sentenceBuilder: [
              {
                words: ['How', 'much', 'is', 'that', 'new', 'cell', 'phone?'],
                answer: 'How much is that new cell phone?',
                hint: 'Start with "How much is..." to ask the price of one item.',
                grammarFocus: 'Asking prices (How much is...)'
              },
              {
                words: ['Shells', 'were', 'easier', 'to', 'carry', 'than', 'heavy', 'goats.'],
                answer: 'Shells were easier to carry than heavy goats.',
                hint: 'Use "easier to carry than" between "Shells were" and "heavy goats".',
                grammarFocus: 'Comparative + infinitive (easier to ... than)'
              },
              {
                words: ['Long', 'ago,', 'people', 'didn’t', 'use', 'paper', 'money.'],
                answer: 'Long ago, people didn’t use paper money.',
                hint: 'Use "didn’t use" after "people".',
                grammarFocus: 'Past Simple negative (didn’t + base verb)'
              },
              {
                words: ['Who', 'does', 'this', 'hundred-dollar', 'bill', 'belong', 'to?'],
                answer: 'Who does this hundred-dollar bill belong to?',
                hint: 'Start with "Who does..." and end with "belong to?".',
                grammarFocus: 'Ownership question (Who does ... belong to?)'
              },
              {
                words: ['Paige', 'could', 'buy', 'the', 'cell', 'phone', 'with', 'the', 'money.'],
                answer: 'Paige could buy the cell phone with the money.',
                hint: 'Use "could buy" after "Paige".',
                grammarFocus: 'Modal could for possibility'
              },
              {
                words: ['I', 'should', 'save', 'my', 'money', 'for', 'the', 'future.'],
                answer: 'I should save my money for the future.',
                hint: 'Start with "I should save...".',
                grammarFocus: 'Modal should for wise advice'
              },
              {
                words: ['What', 'would', 'you', 'do', 'if', 'you', 'found', 'money?'],
                answer: 'What would you do if you found money?',
                hint: 'Start with "What would you do...".',
                grammarFocus: 'Modal would for hypotheticals'
              },
              {
                words: ['Let’s', 'go', 'out', 'to', 'a', 'restaurant', 'for', 'dinner!'],
                answer: 'Let’s go out to a restaurant for dinner!',
                hint: 'Start the suggestion with "Let’s go out...".',
                grammarFocus: 'Suggestions with Let’s + base verb'
              }
            ],
            fillInTheBlank: [
              {
                sentence: 'How ___ is this cell phone? It’s ninety-five dollars!',
                options: ['much', 'many', 'long', 'often'],
                answer: 'much',
                grammarFocus: 'Asking about price (How much)',
                hint: 'Use "How ___" when asking about money or price.'
              },
              {
                sentence: 'Paper bills were much ___ to carry than heavy bags of metal coins.',
                options: ['easier', 'easy', 'easiest', 'easily'],
                answer: 'easier',
                grammarFocus: 'Comparative adjective + infinitive (easier to carry than)',
                hint: 'Before "to carry than", use the comparative form ending in -ier.'
              },
              {
                sentence: 'Nine thousand years ago, people ___ use coins or credit cards; they bartered.',
                options: ['didn’t', 'don’t', 'weren’t', 'aren’t'],
                answer: 'didn’t',
                grammarFocus: 'Past Simple negative (didn’t + base verb)',
                hint: 'Use the past tense negative helper before the base verb "use".'
              },
              {
                sentence: 'Paige found a $100 bill, and at first she didn’t ___ what to do.',
                options: ['know', 'knew', 'knowing', 'knows'],
                answer: 'know',
                grammarFocus: 'Past Simple negative (didn’t + base verb)',
                hint: 'After "didn’t", always use the base form of the verb, NOT the past form!'
              },
              {
                sentence: 'The farmer bought a sack of grain, and he ___ for it with cowrie shells.',
                options: ['paid', 'pay', 'paying', 'pays'],
                answer: 'paid',
                grammarFocus: 'Past Simple irregular (pay -> paid for it with)',
                hint: 'What is the past tense of "pay"?'
              },
              {
                sentence: 'Who does this lost wallet ___ to? We should return it!',
                options: ['belong', 'belongs', 'belonged', 'belonging'],
                answer: 'belong',
                grammarFocus: 'Phrasal verb in question (Who does it belong to?)',
                hint: 'After "does", use the base form of the verb.'
              },
              {
                sentence: 'With the $100 bill in her pocket, Paige ___ buy the $95 cell phone right now.',
                options: ['could', 'did', 'was', 'were'],
                answer: 'could',
                grammarFocus: 'Modal "could" for possibility',
                hint: 'Which modal verb shows what was possible for Paige to do?'
              },
              {
                sentence: 'Mom smiled and said, "___ go out to a nice restaurant tonight!"',
                options: ['Let’s', 'Should', 'Would', 'Didn’t'],
                answer: 'Let’s',
                grammarFocus: 'Making suggestions with Let’s',
                hint: 'Which contraction means "Let us" when making a fun family suggestion?'
              }
            ]
          },

          checkpoint3: {
            id: 'g4-u3-cp3',
            title: 'Island Boss Temple',
            subtitle: 'Treasure Vault & Honest Choice Showdown',
            bossName: 'King Croesus of the Golden Vault',
            bossEmoji: '👑',
            bossIntro: 'Halt, traveler! From ancient bartering and Lydian coins to Paige’s $100 bill and "ar" words, prove your wisdom to unlock the Treasure Vault!',
            bossQuiz: [
              {
                id: 'g4-u3-b1',
                type: 'reading',
                category: 'Reading Skill (Historical Timeline)',
                passage: 'Timeline from "The History of Money": (1) 9000 BCE: People bartered animals and grain. (2) 1200 BCE: People in China used cowrie shells. (3) 1000 BCE: Metal tool coins (knives and spades) in China. (4) 600 BCE: First round gold and silver coins in Lydia (modern-day Turkey). (5) 800 CE: First paper money in China. (6) 1958: First modern plastic credit card. (7) Today: Electronic money on the internet.',
                question: 'Which sequence shows the correct chronological order from OLDEST to NEWEST?',
                options: [
                  'Bartering -> Cowrie shells -> Metal coins -> Paper money -> Plastic credit cards -> Electronic money',
                  'Plastic credit cards -> Electronic money -> Bartering -> Paper money -> Cowrie shells -> Metal coins',
                  'Paper money -> Bartering -> Electronic money -> Cowrie shells -> Metal coins -> Plastic credit cards',
                  'Electronic money -> Gold coins -> Cowrie shells -> Bartering -> Plastic credit cards -> Paper money'
                ],
                answer: 'Bartering -> Cowrie shells -> Metal coins -> Paper money -> Plastic credit cards -> Electronic money',
                explanation: 'The timeline moves from bartering (9000 BCE) and shells (1200 BCE) to metal coins (1000–600 BCE), paper money (800 CE), credit cards (1958), and electronic money today.'
              },
              {
                id: 'g4-u3-b2',
                type: 'reading',
                category: 'Reading Comprehension (The History of Money)',
                question: 'Where were both cowrie shells (1200 BCE) and the world’s first paper money (800 CE) first used?',
                options: ['In China', 'In Lydia', 'On Mars', 'In Wonderland'],
                answer: 'In China',
                explanation: 'According to "The History of Money", people in China first used cowrie shells, miniature metal tool coins, and later the first paper money.'
              },
              {
                id: 'g4-u3-b3',
                type: 'reading',
                category: 'Reading Comprehension (Why Money Changed)',
                question: 'Why did people invent paper money in China after using metal coins for hundreds of years?',
                options: [
                  'Because metal coins were heavy, and paper bills were much lighter and easier to carry.',
                  'Because gold and silver melted in the rain.',
                  'Because people wanted to barter heavy goats instead.',
                  'Because computers needed electronic money in 800 CE.'
                ],
                answer: 'Because metal coins were heavy, and paper bills were much lighter and easier to carry.',
                explanation: 'Carrying thousands of metal coins was heavy; paper money was much easier to carry.'
              },
              {
                id: 'g4-u3-b4',
                type: 'reading',
                category: 'Reading Comprehension (The $100 Bill)',
                passage: 'Paige really wanted a $95 cell phone, but Mom said, "Money is tight right now." Outside in the empty parking lot, Paige found a $100 bill. She knew she could buy the phone, or she could help her family. She handed the $100 bill to her mom.',
                question: 'What did Paige decide to do with the $100 bill she found, and why?',
                options: [
                  'After seeing no one around to return it to, she gave it to her mom because money was tight for her family.',
                  'She secretly bought the $95 cell phone and hid it in her pocket.',
                  'She bartered the $100 bill for a goat and a sack of grain.',
                  'She left it under a pine cone in the forest.'
                ],
                answer: 'After seeing no one around to return it to, she gave it to her mom because money was tight for her family.',
                explanation: 'Paige put her family’s needs ahead of her own wish for a cell phone.'
              },
              {
                id: 'g4-u3-b5',
                type: 'vocabulary',
                category: 'Vocabulary (Idiom)',
                question: 'In "The $100 Bill", Paige’s mom says, "Money is tight right now." What does "money is tight" mean?',
                options: [
                  'The family does not have extra money to spend on expensive things right now.',
                  'The paper bill is folded very tightly inside a small pocket.',
                  'The coins are made of hard metal.',
                  'They have too many credit cards in their wallet.'
                ],
                answer: 'The family does not have extra money to spend on expensive things right now.',
                explanation: '"Money is tight" is an idiom meaning a person or family has a strict budget with little extra money.'
              },
              {
                id: 'g4-u3-b6',
                type: 'grammar',
                category: 'Grammar (Past Simple Negative)',
                question: 'Choose the sentence that is grammatically correct:',
                options: [
                  'Paige didn’t know who the money belonged to.',
                  'Paige didn’t knew who the money belonged to.',
                  'Long ago, people didn’t used paper money.',
                  'He didn’t paid for the goat with coins.'
                ],
                answer: 'Paige didn’t know who the money belonged to.',
                explanation: 'After "didn’t", always use the base verb ("know", "use", "pay").'
              },
              {
                id: 'g4-u3-b7',
                type: 'grammar',
                category: 'Grammar (Comparatives with Infinitives)',
                question: 'Complete the sentence: "Small cowrie shells were ___ than heavy bags of grain."',
                options: [
                  'easier to carry',
                  'easy carry',
                  'more easy carrying',
                  'easiest to carried'
                ],
                answer: 'easier to carry',
                explanation: 'The target structure is "[Noun A] was/were easier to [verb] than [Noun B]".'
              },
              {
                id: 'g4-u3-b8',
                type: 'dialogue',
                category: 'Real-Life Dialogue Q&A',
                speakerA: 'Customer: Excuse me! ___ is this smart watch?',
                speakerB: 'Cashier: It’s ninety-five dollars.',
                question: 'Which words correctly complete the customer’s question?',
                options: ['How much', 'Who did', 'Instead of', 'So they can'],
                answer: 'How much',
                explanation: '"How much is...?" is used to ask the price of an item.'
              },
              {
                id: 'g4-u3-b9',
                type: 'phonics',
                category: 'Phonics ("ar" Spelling Pattern)',
                question: 'Which group of words ALL contain the r-controlled vowel pattern "ar" taught in Unit 3?',
                options: [
                  'bartered, card, park, hard, farm, farmer, jar',
                  'rain, train, mail, tail, paid, wait, paint',
                  'reader, teacher, writer, faster, stronger',
                  'Clara, clock, clean, classroom, climb'
                ],
                answer: 'bartered, card, park, hard, farm, farmer, jar',
                explanation: 'All seven words feature the "ar" spelling pattern.'
              },
              {
                id: 'g4-u3-b10',
                type: 'dialogue',
                category: 'Real-Life Moral Q&A (Modals should / would)',
                speakerA: 'Classmate: What would you do if you found a wallet with a name card inside it at the park?',
                speakerB: 'You: ___',
                question: 'Choose the best ethical and grammatically accurate response:',
                options: [
                  'I would check who it belongs to and return it to the owner.',
                  'I didn’t knew what to do so I bartered a goat.',
                  'It cleans my messy bedroom.',
                  'Coniferous trees have cones instead of flowers.'
                ],
                answer: 'I would check who it belongs to and return it to the owner.',
                explanation: 'Uses the modal "would" + Unit 3 vocabulary ("belongs to", "return").'
              }
            ]
          }
        }
      }
    }
  };

  // Provide convenient aliases on each unit so any game module can access
  // unit.checkpoints.vocabularyLagoon / grammarBridge / bossTemple OR
  // unit.checkpoint1 / checkpoint2 / checkpoint3 seamlessly.
  ['grade3', 'grade4'].forEach(function (gradeKey) {
    var gradeObj = ISLAND_CURRICULUM_DATA[gradeKey];
    if (!gradeObj) return;
    ['unit1', 'unit2', 'unit3'].forEach(function (unitKey) {
      var unitObj = gradeObj[unitKey];
      if (!unitObj || !unitObj.checkpoints) return;
      unitObj.checkpoints.vocabularyLagoon = unitObj.checkpoints.checkpoint1;
      unitObj.checkpoints.grammarBridge = unitObj.checkpoints.checkpoint2;
      unitObj.checkpoints.bossTemple = unitObj.checkpoints.checkpoint3;
      unitObj.checkpoint1 = unitObj.checkpoints.checkpoint1;
      unitObj.checkpoint2 = unitObj.checkpoints.checkpoint2;
      unitObj.checkpoint3 = unitObj.checkpoints.checkpoint3;
    });
  });

  // Expose globally for browser and CommonJS for Node.js syntax/data verification
  if (typeof window !== 'undefined') {
    window.ISLAND_CURRICULUM_DATA = ISLAND_CURRICULUM_DATA;
  }
  if (typeof root !== 'undefined') {
    root.ISLAND_CURRICULUM_DATA = ISLAND_CURRICULUM_DATA;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ISLAND_CURRICULUM_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
