/* Units 1-5 Speaking Quiz Bank (Grade 3 Global Readings 2 & Grade 4 Global Readings 3)
   3 randomized versions per unit (so pupils in line cannot copy the previous pupil's prompt!)
   plus 10 printable Pair Practice Cards per grade. */
(function (root) {
  'use strict';

  root.SPEAKING_QUIZ_DATA = {
    3: {
      title: 'Grade 3 · Global Readings 2 (Units 1–5)',
      units: [
        { n: 1, short: 'What Does It Do?', color: '#ff5fa2', focus: 'inventions, float/sink, can / is' },
        { n: 2, short: 'Thank You!', color: '#4f9dff', focus: 'There is / There are, thankful, Can we…?' },
        { n: 3, short: 'How Much Is It?', color: '#ffb320', focus: 'money, barter, coins/bills, prices' },
        { n: 4, short: 'What Happened?', color: '#9b7bff', focus: 'past simple (stole, hid, found, went)' },
        { n: 5, short: "Let's Go Back", color: '#2fc58a', focus: 'past simple (opened, saw, went, was)' }
      ],
      tasks: [
        /* Unit 1 — 3 versions */
        [
          { pic: '🧸🧹', q: 'Look at a messy bedroom! What do you do to help?', act: 'Act out tidying!', h: 'My room is messy. I tidy …', m: 'My room is messy. I tidy my toys and clean my room.', f: 'room / tidy / clean in a full sentence' },
          { pic: '🪵🪨🌊', q: 'Which one floats and which one sinks: wood or a heavy stone?', act: 'Show float & sink with hands!', h: 'Wood can … Heavy stones …', m: 'Wood can float on water, and heavy stones sink.', f: 'float + sink accurately' },
          { pic: '💡🌉', q: 'You are an inventor! What do you want to invent and why?', act: 'Point to your brain!', h: 'I can invent a … It is …', m: 'I can invent a strong bridge. It helps people cross water.', f: 'invent + simple purpose sentence' }
        ],
        /* Unit 2 — 3 versions */
        [
          { pic: '🙏💖', q: 'Who or what are you thankful for today? Tell me TWO things.', act: 'Hands on heart!', h: 'I am thankful for … and …', m: 'I am thankful for my family and my teacher.', f: 'I am thankful for + 2 items' },
          { pic: '🍍🍡🍎', q: 'Look at the feast table! Tell me ONE thing with "There is" and ONE with "There are".', act: 'Point to the table!', h: 'There is a … There are …', m: 'There is a pineapple. There are three rice cakes.', f: 'There is (singular) + There are (plural)' },
          { pic: '🌕🌳', q: 'It is a sunny Chuseok night! Ask your friend to play outside and describe the moon.', act: 'Make a moon circle!', h: 'Can we …? Look at the …', m: 'Can we play outside? Look at the big full moon!', f: 'Can we…? question + moon sentence' }
        ],
        /* Unit 3 — 3 versions */
        [
          { pic: '🐐🌾🔄', q: 'Long ago, before money, how did people get things they needed?', act: 'Swap hands like trading!', h: 'People bartered … for …', m: 'People bartered a goat for grain or shells.', f: 'bartered / traded in a full sentence' },
          { pic: '🪙💵💳', q: 'Tell me TWO ways people pay at a shop today.', act: 'Tap a card or hold a coin!', h: 'We can pay with … and …', m: 'We can pay with metal coins, paper bills, or a credit card.', f: 'coins / bills / credit card' },
          { pic: '🧾🧸🐷', q: 'You are at a toy shop! Ask the price and say if you will buy it or save your money.', act: 'Pretend to shop!', h: 'How much is …? I will …', m: 'How much is this toy? It is five dollars. I will save my money.', f: 'How much is…? + buy/save' }
        ],
        /* Unit 4 — 3 versions */
        [
          { pic: '🖼️🧥👮', q: 'What happened to the Mona Lisa painting in the museum?', act: 'Tiptoe like a detective!', h: 'A thief took … He hid …', m: 'A thief took the painting and hid it under his coat. Then the police found it.', f: 'past verbs (took / stole / hid / found)' },
          { pic: '🌋⛵🚢', q: 'The volcano went BOOM! How did the people get safe?', act: 'Row a rescue boat!', h: 'They got in … They rowed …', m: 'They got in a small boat and rowed to the rescue ship. They were safe!', f: 'past simple rescue sequence' },
          { pic: '🕵️❓', q: 'Tell me ONE thing that happened yesterday after school.', act: 'Give a big smile!', h: 'Yesterday I …', m: 'Yesterday I played with my friend and read a book.', f: 'yesterday + past tense verb' }
        ],
        /* Unit 5 — 3 versions */
        [
          { pic: '📖👑👓', q: 'What happened when Jannah opened the Time Book in Cairo?', act: 'Put on glasses!', h: 'Jannah went to … She saw …', m: 'Jannah went to ancient Egypt. She saw a pharaoh and gave her glasses to an old woman.', f: 'past simple (went / saw / gave / was)' },
          { pic: '📦⛏️🪙', q: 'If we make a class time capsule today, what TWO objects will you put inside?', act: 'Dig a capsule box!', h: 'I will put … and … in the time capsule.', m: 'I will put coins and a class photo in the time capsule for the future.', f: 'time capsule + 2 objects' },
          { pic: '🚀💿🌍', q: 'What did Voyager 1 and 2 carry into space?', act: 'Blast off like a rocket!', h: 'Voyager went … It carried a …', m: 'Voyager went into space. It carried a gold disc that says hello in 55 languages!', f: 'spacecraft / gold disc / Earth' }
        ]
      ],
      practiceCards: [
        { unit: 1, pic: '🧸', q: 'Is your room tidy or messy? What do you tidy?', frame: 'My room is ___. I tidy my ___.', words: ['messy', 'tidy', 'toys', 'clean'] },
        { unit: 1, pic: '🪵', q: 'Name one thing that floats and one thing that sinks!', frame: '___ can float. ___ sinks.', words: ['wood', 'stone', 'heavy', 'water'] },
        { unit: 2, pic: '🙏', q: 'What are you thankful for at school?', frame: 'I am thankful for my ___.', words: ['thankful', 'friends', 'teacher', 'class'] },
        { unit: 2, pic: '🍍', q: 'Look around the room! Say one "There is" and one "There are".', frame: 'There is a ___. There are ___.', words: ['There is', 'There are', 'desk', 'books'] },
        { unit: 3, pic: '🪙', q: 'What is the difference between coins and paper bills?', frame: 'Coins are ___, and bills are ___.', words: ['metal', 'paper', 'light', 'pay'] },
        { unit: 3, pic: '🧾', q: 'Role-play! Ask your partner the price of a pencil.', frame: 'How much is ___? It is ___.', words: ['How much', 'dollars', 'cashier', 'save'] },
        { unit: 4, pic: '🖼️', q: 'Tell your partner what the art thief did with the Mona Lisa.', frame: 'He ___ the painting and ___ it.', words: ['took', 'hid', 'coat', 'found'] },
        { unit: 4, pic: '🌋', q: 'What happened when the angry mountain erupted?', frame: 'The volcano went ___. They rowed ___.', words: ['volcano', 'ash', 'boat', 'safe'] },
        { unit: 5, pic: '👑', q: 'Why was the old woman in Egypt so surprised?', frame: 'She tried Jannah’s ___ and could ___!', words: ['glasses', 'see', 'surprised', 'ancient'] },
        { unit: 5, pic: '📦', q: 'What would you put inside a time capsule for the future?', frame: 'I would put ___ in my time capsule.', words: ['objects', 'coins', 'future', 'Earth'] }
      ]
    },
    4: {
      title: 'Grade 4 · Global Readings 3 (Units 1–5)',
      units: [
        { n: 1, short: 'I Love Reading!', color: '#ff5fa2', focus: 'past simple, visualize, animal facts' },
        { n: 2, short: 'What Lives Here?', color: '#4f9dff', focus: 'habitats, adaptations, so / can' },
        { n: 3, short: 'It Keeps Changing!', color: '#ffb320', focus: 'Arctic ice, comparing, clean energy' },
        { n: 4, short: 'We Can Do It!', color: '#9b7bff', focus: 'teamwork, because / so, problem solving' },
        { n: 5, short: 'Make Some Noise', color: '#2fc58a', focus: 'have to / has to, When clauses, similes' }
      ],
      tasks: [
        /* Unit 1 — 3 versions */
        [
          { pic: '🐇🕳️', q: 'What did Alice do when she saw the White Rabbit?', act: 'Check a pocket watch!', h: 'Alice chased … Then she fell …', m: 'Alice chased the White Rabbit, and then she fell down a deep hole.', f: 'past verbs (chased / saw / fell)' },
          { pic: '🦋🗺️', q: 'Why do monarch butterflies fly so far in autumn?', act: 'Flap butterfly wings!', h: 'They fly south because …', m: 'Monarch butterflies fly south because they want to stay warm.', f: 'present simple + because reason' },
          { pic: '📖💭🧠', q: 'How does visualizing help your brain when you read?', act: 'Tap your head!', h: 'When I read, I visualize …', m: 'When I read, I make a picture of the story in my head. Reading helps my brain!', f: 'visualize / picture / brain' }
        ],
        /* Unit 2 — 3 versions */
        [
          { pic: '🐪🦒', q: 'Pick a camel OR a giraffe. How does its body help it survive?', act: 'Stretch tall or wipe forehead!', h: 'A ___ has ___ so it can …', m: 'A giraffe has a long neck so it can eat high leaves on tall trees.', f: 'has + so it can adaptation' },
          { pic: '🐻❄️🌲', q: 'How do animals or pine trees survive a cold winter?', act: 'Hug yourself warm!', h: 'They have … so they stay …', m: 'Bears have thick fur so they stay warm in the snow.', f: 'thick fur / pine needles / winter' },
          { pic: '🩺🦉🌳', q: 'What does a vet do to help a hurt forest animal?', act: 'Check a baby bird!', h: 'A vet helps … Then it can …', m: 'A vet helps the hurt bird get strong, and then it flies back to the forest.', f: 'vet + care + forest return' }
        ],
        /* Unit 3 — 3 versions */
        [
          { pic: '🧊🐻‍❄️🌊', q: 'Why is thin sea ice a problem for polar bears?', act: 'Step carefully on ice!', h: 'The ice is … so polar bears …', m: 'The sea ice is getting thin and melting, so polar bears have to swim farther.', f: 'thin / melting / polar bear' },
          { pic: '💨🔋🚗', q: 'Compare an old gas car and an electric car!', act: 'Steer a quiet wheel!', h: 'Old cars are …, but electric cars are …', m: 'Old cars are noisy and smoky, but electric cars are quiet and clean.', f: 'comparison (noisy/dirty vs quiet/clean)' },
          { pic: '🚲🌍', q: 'What is ONE thing you can do to keep the air clean?', act: 'Pedal a bicycle!', h: 'I can … to keep the air clean.', m: 'I can ride my bike or walk to school to keep the air clean.', f: 'can + clean-planet action' }
        ],
        /* Unit 4 — 3 versions */
        [
          { pic: '🚗🎭💡', q: 'In "Late for the Show", what was the problem and how did they solve it?', act: 'Snap fingers for an idea!', h: 'They were stuck in … so they …', m: 'They were stuck in traffic, so they stayed calm and performed the show on the platform!', f: 'problem + because/so + solution' },
          { pic: '🏀🤝🏆', q: 'Why is teamwork important in basketball or in our classroom?', act: 'High-five your teammate!', h: 'Teamwork is important because …', m: 'Teamwork is important because we help each other and win together!', f: 'teamwork + because reason' },
          { pic: '😌✨', q: 'Your friend is nervous before a big show. What do you say to help?', act: 'Take a deep breath!', h: 'Don’t worry! Take … We can …', m: 'Don’t worry! Take a deep breath and stay calm. We can do it together!', f: 'encouraging full sentence' }
        ],
        /* Unit 5 — 3 versions */
        [
          { pic: '🎬🥥🔑', q: 'How do Foley artists make realistic sounds in a movie studio? Give ONE example!', act: 'Clap coconuts or shake keys!', h: 'When an actor …, Foley artists …', m: 'When a horse walks, Foley artists bang two coconut shells together!', f: 'When clause + Foley example' },
          { pic: '🤫🎙️', q: 'What do people HAVE TO do inside a sound recording studio?', act: 'Finger to lips: Shh!', h: 'In a studio, everyone has to …', m: 'In a studio, everyone has to be very quiet so the microphone only records the sound.', f: 'have to / has to accurately' },
          { pic: '🎼🦅👏', q: 'Tell me TWO facts about Beethoven conducting his 9th Symphony!', act: 'Conduct like an eagle!', h: 'Beethoven was … He lifted his arms like …', m: 'Beethoven was deaf, so he couldn’t hear the cheers. He lifted his arms high like an eagle!', f: 'deaf / simile with like / orchestra or audience' }
        ]
      ],
      practiceCards: [
        { unit: 1, pic: '🐇', q: 'What did Alice see, and what did she do next?', frame: 'Alice saw ___ and chased ___.', words: ['White Rabbit', 'chased', 'fell', 'hole'] },
        { unit: 1, pic: '🦋', q: 'Why do monarch butterflies travel south?', frame: 'They fly south because ___.', words: ['monarch', 'journey', 'warm', 'because'] },
        { unit: 2, pic: '🐪', q: 'Choose an animal and explain how it survives in its habitat.', frame: 'A ___ lives in ___ and has ___.', words: ['desert', 'hump', 'fur', 'survive'] },
        { unit: 2, pic: '🩺', q: 'How can people help wild forest animals?', frame: 'A vet can ___ so the animal can ___.', words: ['vet', 'helps', 'forest', 'fly'] },
        { unit: 3, pic: '🐻‍❄️', q: 'What is changing in the Arctic right now?', frame: 'The sea ice is ___ so ___.', words: ['thin', 'melting', 'polar bear', 'swim'] },
        { unit: 3, pic: '🔋', q: 'Why are electric cars better than old gas cars?', frame: 'Electric cars are ___ and ___.', words: ['quiet', 'clean', 'smoke', 'energy'] },
        { unit: 4, pic: '🎭', q: 'What should you do when a plan goes wrong?', frame: 'Stay ___ and think of a ___.', words: ['calm', 'idea', 'solution', 'traffic'] },
        { unit: 4, pic: '🏀', q: 'What makes a great team player?', frame: 'A great team player ___ and ___.', words: ['teamwork', 'shares', 'helps', 'together'] },
        { unit: 5, pic: '🥥', q: 'How can you make the sound of a horse or a knight marching?', frame: 'You can ___ to sound like ___.', words: ['coconut', 'keys', 'realistic', 'Foley'] },
        { unit: 5, pic: '🎼', q: 'Describe Beethoven conducting using a simile with "like"!', frame: 'Beethoven lifts his arms like ___.', words: ['eagle', 'boat', 'deaf', 'audience'] }
      ]
    }
  };
})(window);
