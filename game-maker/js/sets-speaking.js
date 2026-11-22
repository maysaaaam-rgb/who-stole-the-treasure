/* Game Maker: Super-Easy A1 Speaking & Acting Sets (Grade 3 & Grade 4, Units 1–4).
   Designed for 8–10 year old A1 ESL learners:
   - Short 4–6 word prompt + fun physical gesture/action (act)
   - Big visible 3–5 word target sentence on the card
   - 1-word / gesture option so shy learners can succeed with 1 word + action!
   - Registers both All-Units Speaking Sets (speak-g3, speak-g4) and Per-Unit Speaking Sets (speak-g3-u1..u4, speak-g4-u1..u4). */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};

  function spk(unit, q, a, pic, act, words) {
    return {
      q: q,
      a: a,
      w: [],
      pic: pic || '🎤',
      act: act || '',
      words: words || [],
      speak: 1,
      skill: 'Speaking',
      unit: unit
    };
  }

  /* =========================================================================
     GRADE 3 · UNITS 1–4 SUPER-EASY SPEAKING & ACTING (24 Cards, 6 per Unit)
     ========================================================================= */
  var G3 = [
    /* Unit 1 — What Does It Do? (Inventions, Clara's Room & Floating Bridges) */
    spk(1, 'Point and say:', 'My room is messy! 🧸', '🧸', '🙌 Put hands on cheeks!', ['messy', 'room', 'toys']),
    spk(1, 'Pretend to clean! Say:', 'I tidy my room! 🧹', '🧹', '🧹 Sweep with your arms!', ['tidy', 'clean', 'room']),
    spk(1, 'Tap your head! Say:', 'I can invent it! 💡', '💡', '💡 Point to your brain!', ['invent', 'machine', 'try']),
    spk(1, 'Make a bridge with arms! Say:', 'The bridge is strong! 🌉', '🌉', '🌉 Stretch both arms wide!', ['bridge', 'strong', 'flat']),
    spk(1, 'Show floating with hands! Say:', 'Wood can float! 🪵', '🪵', '🌊 Wave hands like water!', ['wood', 'float', 'water']),
    spk(1, 'Drop your hands down! Say:', 'Heavy stones sink! 🪨', '🪨', '⬇️ Drop hands down fast!', ['stone', 'sink', 'heavy']),

    /* Unit 2 — Thank You! (Harvest, Food & Chuseok Moon Circle) */
    spk(2, 'Put hands on heart! Say:', 'I am thankful! 🙏', '🙏', '💖 Hands over your heart!', ['thankful', 'teacher', 'family']),
    spk(2, 'Make a big circle! Say:', 'Look at the moon! 🌕', '🌕', '🙆 Make a moon circle over head!', ['full', 'moon', 'round']),
    spk(2, 'Point to the table! Say:', 'There is a pineapple! 🍍', '🍍', '🍍 Point and smile big!', ['There is', 'pineapple', 'food']),
    spk(2, 'Reach up high! Say:', 'Walk tall, walk tall! 🧍', '🧍', '🙌 Stretch up on tiptoes!', ['walk', 'tall', 'circle']),
    spk(2, 'Bend your knees! Say:', 'Walk low, walk low! 🧎', '🧎', '🧎 Crouch down low!', ['walk', 'low', 'slow']),
    spk(2, 'Wave to a friend! Say:', 'Can we play outside? 🌳', '🌳', '👋 Wave to your team!', ['Can we', 'play', 'outside']),

    /* Unit 3 — How Much Is It? (Bartering, Coins, Bills & Smart Saving) */
    spk(3, 'Swap hands with a friend! Say:', 'They bartered a goat! 🐐', '🐐', '🔄 Pretend to trade a goat!', ['bartered', 'goat', 'grain']),
    spk(3, 'Hold up a tiny coin! Say:', 'Coins are metal! 🪙', '🪙', '🤏 Hold up a shiny coin!', ['coins', 'metal', 'shells']),
    spk(3, 'Wave a paper bill! Say:', 'Paper money is light! 💵', '💵', '💵 Wave a paper bill!', ['paper', 'bill', 'light']),
    spk(3, 'Pretend to tap a card! Say:', 'Tap the credit card! 💳', '💳', '💳 Beep! Tap your card!', ['credit card', 'plastic', 'pay']),
    spk(3, 'Smile like a cashier! Say:', 'It is five dollars! 🧾', '🧾', '🤲 Hold out five fingers!', ['cashier', 'five', 'dollars']),
    spk(3, 'Put money in a pocket! Say:', 'Paige saved her money! 🐷', '🐷', '🏦 Pat your pocket!', ['saved', 'money', 'smart']),

    /* Unit 4 — What Happened? (Mona Lisa & The Angry Mountain) */
    spk(4, 'Sneak on tiptoes! Say:', 'He took the painting! 🖼️', '🖼️', '🤫 Tiptoe like a thief!', ['took', 'painting', 'stole']),
    spk(4, 'Hide under your coat! Say:', 'He hid it here! 🧥', '🧥', '🧥 Pull your coat closed!', ['hid', 'under', 'coat']),
    spk(4, 'Stand like a police officer! Say:', 'The police found it! 👮', '👮', '✋ Hold up a hand: STOP!', ['police', 'found', 'arrested']),
    spk(4, 'Make a volcano BOOM! Say:', 'The volcano went BOOM! 🌋', '🌋', '💥 Jump and throw arms up!', ['volcano', 'thunder', 'boom']),
    spk(4, 'Pretend to row a boat! Say:', 'Row the small boat! ⛵', '⛵', '🚣 Row, row, row fast!', ['boat', 'island', 'ash']),
    spk(4, 'Wave at the rescue ship! Say:', 'We are safe now! 🚢', '🚢', '🙌 Wave both arms high!', ['ship', 'sunrise', 'safe']),

    /* Unit 5 — Let's Go Back (The Time Book & Time Capsules) */
    spk(5, 'Put on glasses! Say:', 'Jannah opened the book! 📖', '📖', '👓 Put fingers like glasses!', ['opened', 'Time Book', 'Egypt']),
    spk(5, 'Hold chariot reins! Say:', 'The pharaoh rode a chariot! 👑', '👑', '🛞 Pull chariot reins!', ['pharaoh', 'rode', 'chariot']),
    spk(5, 'Look amazed! Say:', 'Now I can see! 😮', '😮', '👀 Open eyes wide and smile!', ['glasses', 'see', 'surprised']),
    spk(5, 'Dig with a shovel! Say:', 'We dig a time capsule! 📦', '📦', '⛏️ Pretend to dig in the ground!', ['dig', 'time capsule', 'coins']),
    spk(5, 'Launch a rocket! Say:', 'Voyager went into space! 🚀', '🚀', '🚀 Blast off with both hands!', ['Voyager', 'spacecraft', 'space']),
    spk(5, 'Wave to aliens! Say:', 'Hello from planet Earth! 🌍', '🌍', '👋 Wave big to the sky!', ['gold disc', 'hello', 'Earth'])
  ];

  /* =========================================================================
     GRADE 4 · UNITS 1–5 SUPER-EASY SPEAKING & ACTING (30 Cards, 6 per Unit)
     ========================================================================= */
  var G4 = [
    /* Unit 1 — I Love Reading! (Alice, Monarch Butterflies & Brain Power) */
    spk(1, 'Check a pocket watch! Say:', 'Alice chased the rabbit! 🐇', '🐇', '🏃 Run in place fast!', ['chased', 'White Rabbit', 'late']),
    spk(1, 'Look down a deep hole! Say:', 'She fell down, down! 🕳️', '🕳️', '😮 Look down at the floor!', ['fell', 'deep', 'hole']),
    spk(1, 'Freeze like a statue! Say:', 'Rabbits freeze and hide! 🐰', '🐰', '🧊 Freeze! Don’t move!', ['freeze', 'still', 'rabbit']),
    spk(1, 'Flap butterfly wings! Say:', 'Butterflies fly far! 🦋', '🦋', '🦋 Flap your arms gently!', ['monarch', 'journey', 'warm']),
    spk(1, 'Tap your head and close eyes! Say:', 'I visualize the story! 💭', '💭', '😌 Point to your head!', ['visualize', 'picture', 'read']),
    spk(1, 'Open a book with hands! Say:', 'Reading helps my brain! 📖', '📖', '👐 Open hands like a book!', ['reading', 'brain', 'smart']),

    /* Unit 2 — What Lives Here? (Animal Survivors, Forest & Vet Rescue) */
    spk(2, 'Show a big camel hump! Say:', 'Camels live in deserts! 🐪', '🐪', '☀️ Wipe your hot forehead!', ['camel', 'hump', 'desert']),
    spk(2, 'Stretch your neck high! Say:', 'Giraffes eat high leaves! 🦒', '🦒', '🦒 Reach up to the tall tree!', ['giraffe', 'tall', 'leaves']),
    spk(2, 'Hug yourself warm! Say:', 'Thick fur keeps warm! 🐻', '🐻', '🧥 Hug your arms tight!', ['thick', 'fur', 'winter']),
    spk(2, 'Point to sharp pine needles! Say:', 'Pine trees have cones! 🌲', '🌲', '🌲 Make a tree peak with hands!', ['pine', 'cones', 'needles']),
    spk(2, 'Pretend to check a puppy! Say:', 'A vet helps animals! 🩺', '🩺', '🐶 Pet a hurt animal gently!', ['vet', 'helps', 'animals']),
    spk(2, 'Flap wings and fly free! Say:', 'Fly back to the forest! 🦉', '🦉', '🦅 Spread wings wide!', ['grew', 'flew', 'forest']),

    /* Unit 3 — It Keeps Changing! (The Bear and I & Clean Cars) */
    spk(3, 'Walk on thin ice carefully! Say:', 'The ice is thin! 🧊', '🧊', '🐾 Step very carefully!', ['thin', 'ice', 'melting']),
    spk(3, 'Roar like a big polar bear! Say:', 'He is twice as big! 🐻‍❄️', '🐻‍❄️', '🙌 Hold arms up huge!', ['polar bear', 'twice', 'big']),
    spk(3, 'Swim with strong paws! Say:', 'Polar bears can swim! 🌊', '🌊', '🏊 Swim with both arms!', ['swim', 'cold', 'sea']),
    spk(3, 'Cough and wave smoke away! Say:', 'Old cars make smoke! 💨', '💨', '😷 Wave smoky air away!', ['noisy', 'dirty', 'smoke']),
    spk(3, 'Drive a quiet electric car! Say:', 'Electric cars are clean! 🔋', '🔋', '🚗 Steer a quiet wheel!', ['electric', 'clean', 'energy']),
    spk(3, 'Pedal a bicycle! Say:', 'I ride my bike! 🚲', '🚲', '🚴 Spin your hands like pedals!', ['ride', 'bike', 'clean']),

    /* Unit 4 — We Can Do It! (Late for the Show & LA Sparks Teamwork) */
    spk(4, 'Honk a car horn! Beep! Say:', 'We are in traffic! 🚗', '🚗', '📯 Press the horn: Beep beep!', ['stuck', 'traffic', 'late']),
    spk(4, 'Take a deep breath! Say:', 'Stay calm, don’t worry! 😌', '😌', '😮‍💨 Breathe in and smile!', ['calm', 'platform', 'wait']),
    spk(4, 'Snap your fingers! Say:', 'I have a good idea! 💡', '💡', '☝️ Hold up 1 finger: Idea!', ['Lynn', 'idea', 'solution']),
    spk(4, 'Take a big actor bow! Say:', 'Let’s perform the show! 🎭', '🎭', '🙇 Take a theatre bow!', ['perform', 'show', 'platform']),
    spk(4, 'Shoot a 3-point basket! Say:', 'Three points! Swish! 🏀', '🏀', '🏀 Jump and shoot a basket!', ['three points', 'basket', 'win']),
    spk(4, 'High-five your teammate! Say:', 'Great teamwork, everyone! 🤝', '🤝', '🙌 High-five your friend!', ['teamwork', 'proud', 'together']),

    /* Unit 5 — Make Some Noise (Foley Sound Studio & Beethoven's 9th) */
    spk(5, 'Put a finger on lips! Say:', 'Shh! We are recording sound! 🎬', '🎬', '🤫 Finger to lips: Shh!', ['Foley', 'record', 'studio']),
    spk(5, 'Clap two coconut shells! Say:', 'It sounds like a horse! 🥥', '🥥', '🥥 Tap hands like horse hooves!', ['coconut', 'realistic', 'horse']),
    spk(5, 'Shake metal keys! Say:', 'A knight is marching! 🛡️', '🛡️', '🔑 Shake keys & march!', ['knight', 'armor', 'keys']),
    spk(5, 'Conduct like an eagle! Say:', 'Beethoven lifts his arms high! 🎼', '🎼', '🦅 Wave arms like a conductor!', ['composer', 'eagle', 'orchestra']),
    spk(5, 'Boom on an air drum! Say:', 'The drums boom loudly! 🥁', '🥁', '🥁 Play big air drums!', ['drums', 'loud', 'thunder']),
    spk(5, 'Clap & cheer! Say:', 'The audience loves the music! 👏', '👏', '👏 Stand up and clap!', ['audience', 'flowers', 'proud'])
  ];

  /* =========================================================================
     SPEAKING CHOICE QUESTIONS — ALL UNITS (1–5) FOR GRADE 3 & GRADE 4
     (Multiple-choice speaking prompts: choose the right spoken line AND say it!)
     ========================================================================= */
  function spkChoice(unit, q, a, w1, w2, pic, act) {
    return {
      q: q,
      a: a,
      w: [w1, w2],
      pic: pic || '🗣️',
      act: act || '🎤 Say the winning sentence out loud!',
      speakChoice: 1,
      skill: 'Speaking',
      unit: unit
    };
  }

  var G3_CHOICE = [
    /* Unit 1 — What Does It Do? */
    spkChoice(1, '🗣️ Your toys are everywhere! What do you say?', 'My room is messy! Let’s tidy it!', 'The moon is full tonight!', 'I bartered two coins!', '🧸'),
    spkChoice(1, '🗣️ You drop a wooden block in water. What do you say?', 'Look! Wood can float on water!', 'Heavy stones can fly!', 'Please arrest the painting!', '🪵'),
    spkChoice(1, '🗣️ You build a smart new machine. What do you say?', 'I invented a helpful machine!', 'The volcano erupted yesterday!', 'There is a pineapple on Mars!', '💡'),
    spkChoice(1, '🗣️ Your friend tests a paper bridge. What do you ask?', 'Is the bridge strong enough?', 'Who stole the gold disc?', 'How many goats are in space?', '🌉'),
    spkChoice(1, '🗣️ You drop a heavy rock in a tub. What do you say?', 'The heavy stone sinks fast!', 'The rock floats like a cloud!', 'I am wearing ancient pajamas!', '🪨'),
    spkChoice(1, '🗣️ Your invention fails the first time. What do you say?', 'Let’s try again and fix it!', 'I will hide under my coat!', 'Wake up, we are in Cairo!', '🔧'),

    /* Unit 2 — Thank You! */
    spkChoice(2, '🗣️ Your friend helps you carry books. What do you say?', 'Thank you! I am very thankful!', 'Stop her! Who is that girl?', 'Heavy stones sink in water!', '🙏'),
    spkChoice(2, '🗣️ You look up at the harvest sky. What do you say?', 'Look at the big full moon!', 'Tap your credit card here!', 'The bridge is very flat!', '🌕'),
    spkChoice(2, '🗣️ You see ONE pineapple on the table. What do you say?', 'There is a pineapple on the table!', 'There are a pineapple here!', 'It were five dollars!', '🍍'),
    spkChoice(2, '🗣️ You want to play with friends in the yard. What do you ask?', 'Can we play outside together?', 'Did the volcano float?', 'Where is the chariot driver?', '🌳'),
    spkChoice(2, '🗣️ You invite a friend to the Chuseok circle dance. What do you say?', 'Hold hands and walk in a circle!', 'Hide the painting under your coat!', 'Put the stone in a time capsule!', '🌕'),
    spkChoice(2, '🗣️ You see three sweet rice cakes. What do you say?', 'There are three rice cakes!', 'There is three rice cakes!', 'They bartered a volcano!', '🍡'),

    /* Unit 3 — How Much Is It? */
    spkChoice(3, '🗣️ You want to know the price of a toy. What do you ask?', 'How much is this toy, please?', 'How old is the full moon?', 'Where did the bridge sink?', '🧾'),
    spkChoice(3, '🗣️ Two farmers swap a goat for grain. What do you say?', 'They bartered a goat for grain!', 'They rowed a rescue ship!', 'They invented a gold disc!', '🐐'),
    spkChoice(3, '🗣️ You explain why coins are different from bills. What do you say?', 'Coins are metal and bills are paper!', 'Coins are wood and float away!', 'Paper bills are heavy stones!', '🪙'),
    spkChoice(3, '🗣️ You are the cashier at the shop. What do you say?', 'That is five dollars, please!', 'The volcano went BOOM!', 'Look at the ancient pharaoh!', '💳'),
    spkChoice(3, '🗣️ You keep your allowance for a big bike. What do you say?', 'I am saving my money smartly!', 'I am tidying the full moon!', 'I am rowing to Cairo!', '🐷'),
    spkChoice(3, '🗣️ Your friend asks how people pay today. What do you say?', 'We can pay with coins, bills, or a card!', 'We only trade dinosaurs today!', 'We put pineapples in the ground!', '💵'),

    /* Unit 4 — What Happened? */
    spkChoice(4, '🗣️ The museum guard sees an empty wall! What does he ask?', 'What happened? Who stole the painting?', 'How much is this pineapple?', 'Can we dance in a circle?', '🖼️'),
    spkChoice(4, '🗣️ You tell a friend how the thief escaped. What do you say?', 'He hid the painting under his coat!', 'He floated across the bridge!', 'He bartered it for a goat!', '🧥'),
    spkChoice(4, '🗣️ The police catch the art thief at last. What do you say?', 'The police found it and arrested him!', 'The cashier saved five dollars!', 'The wood floated in the tub!', '👮'),
    spkChoice(4, '🗣️ You hear loud thunder from the mountain. What do you say?', 'Watch out! The volcano is erupting!', 'Look! There is a sweet rice cake!', 'Let’s tidy my messy room!', '🌋'),
    spkChoice(4, '🗣️ You help your family escape the ash. What do you say?', 'Get in the boat and row fast!', 'Tap the credit card slowly!', 'Walk tall in the moon circle!', '⛵'),
    spkChoice(4, '🗣️ You reach the big rescue ship at sunrise. What do you say?', 'Hurray! We are safe at last!', 'My room is still very messy!', 'Coins are made of metal!', '🚢'),

    /* Unit 5 — Let's Go Back */
    spkChoice(5, '🗣️ You tell your class what Jannah did yesterday. What do you say?', 'Yesterday, Jannah opened the Time Book!', 'Yesterday, Jannah opens a boat!', 'Tomorrow, Jannah was a cashier!', '📖'),
    spkChoice(5, '🗣️ The old woman tries Jannah’s red glasses. What does she say?', 'Oh, thank you! Now I can see!', 'Watch out! The volcano is here!', 'That costs ten paper bills!', '👓'),
    spkChoice(5, '🗣️ You see the king of ancient Egypt riding by. What do you say?', 'Look! The pharaoh rode in a chariot!', 'Look! The rabbit chased a camel!', 'Look! The bridge is made of coins!', '👑'),
    spkChoice(5, '🗣️ You explain a time capsule to a friend. What do you say?', 'We save objects in a box for the future!', 'We steal paintings from a museum!', 'We trade goats for pineapples!', '📦'),
    spkChoice(5, '🗣️ Your teacher asks about Voyager 1 and 2. What do you say?', 'The spacecraft went into space in 1977!', 'The spacecraft sank in a river!', 'The spacecraft bartered metal coins!', '🚀'),
    spkChoice(5, '🗣️ You explain what the Golden Record does. What do you say?', 'It says hello in 55 languages from Earth!', 'It tidies Jannah’s messy room!', 'It makes the moon full every night!', '💿')
  ];

  var G4_CHOICE = [
    /* Unit 1 — I Love Reading! */
    spkChoice(1, '🗣️ You tell a friend what Alice saw first. What do you say?', 'Alice chased the White Rabbit!', 'Alice drove an electric car!', 'Alice shook metal keys onstage!', '🐇'),
    spkChoice(1, '🗣️ A hungry wolf walks near a rabbit. What do you say?', 'The rabbit freezes to stay safe!', 'The rabbit conducts an orchestra!', 'The rabbit shoots a three-pointer!', '🐰'),
    spkChoice(1, '🗣️ You describe monarch butterflies in autumn. What do you say?', 'Monarch butterflies fly south to stay warm!', 'Monarch butterflies live on thin ice!', 'Monarch butterflies get stuck in traffic!', '🦋'),
    spkChoice(1, '🗣️ Your teacher asks what “visualize” means. What do you say?', 'I make a picture of the story in my head!', 'I bang two coconut shells together!', 'I honk a loud horn in traffic!', '💭'),
    spkChoice(1, '🗣️ Your friend asks why reading is good. What do you say?', 'Reading helps my brain grow stronger!', 'Reading makes old cars smoky!', 'Reading melts the Arctic ice!', '📖'),
    spkChoice(1, '🗣️ You describe Alice falling into Wonderland. What do you say?', 'She fell down a very deep hole!', 'She performed on a train platform!', 'She ate high leaves like a giraffe!', '🕳️'),

    /* Unit 2 — What Lives Here? */
    spkChoice(2, '🗣️ Your classmate asks where camels live. What do you say?', 'Camels live in hot, dry deserts!', 'Camels swim in icy Arctic oceans!', 'Camels work inside sound studios!', '🐪'),
    spkChoice(2, '🗣️ You explain why giraffes have long necks. What do you say?', 'They reach high leaves on tall trees!', 'They hide under train platforms!', 'They carry thick drums onstage!', '🦒'),
    spkChoice(2, '🗣️ You explain how polar animals survive winter. What do you say?', 'Thick fur keeps them warm in snow!', 'Plastic swords keep them quiet!', 'Traffic lights keep them calm!', '🐻'),
    spkChoice(2, '🗣️ You describe a pine tree in the forest. What do you say?', 'Pine trees have sharp needles and cones!', 'Pine trees have wheels and horns!', 'Pine trees wear a red scarf!', '🌲'),
    spkChoice(2, '🗣️ You find a hurt baby bird. What do you say?', 'Let’s take it to a kind vet!', 'Let’s make thunder with metal!', 'Let’s shoot a basketball now!', '🩺'),
    spkChoice(2, '🗣️ The healed bird is strong again. What do you say?', 'Fly back home to the forest!', 'Wait on the subway platform!', 'Freeze like a rabbit in a hole!', '🦉'),

    /* Unit 3 — It Keeps Changing! */
    spkChoice(3, '🗣️ You warn a friend walking on Arctic sea ice. What do you say?', 'Be careful! The ice is getting thin!', 'Be careful! The lettuce is crunchy!', 'Be careful! The rabbit is late!', '🧊'),
    spkChoice(3, '🗣️ You compare a grown polar bear to its cub. What do you say?', 'He is twice as big as before!', 'He has to record two voices!', 'He is stuck in city traffic!', '🐻‍❄️'),
    spkChoice(3, '🗣️ You describe what polar bears can do in water. What do you say?', 'Polar bears are strong swimmers!', 'Polar bears are famous composers!', 'Polar bears live in dry deserts!', '🌊'),
    spkChoice(3, '🗣️ You explain the problem with old gas cars. What do you say?', 'Old cars are noisy and make dirty smoke!', 'Old cars grow sharp pine needles!', 'Old cars hum with the audience!', '💨'),
    spkChoice(3, '🗣️ You recommend an electric car. What do you say?', 'Electric cars are quiet and clean!', 'Electric cars eat high tree leaves!', 'Electric cars bang coconut shells!', '🔋'),
    spkChoice(3, '🗣️ You tell your class how you help the planet. What do you say?', 'I ride my bike to keep the air clean!', 'I throw flowers at the traffic!', 'I chase white rabbits in the desert!', '🚲'),

    /* Unit 4 — We Can Do It! */
    spkChoice(4, '🗣️ Your bus stops on a crowded road. What do you say?', 'Oh no! We are stuck in traffic!', 'Oh no! The sea ice is melting!', 'Oh no! The camel ate my scarf!', '🚗'),
    spkChoice(4, '🗣️ Your teammate feels nervous before the play. What do you say?', 'Take a deep breath and stay calm!', 'Bang a book to sound like a punch!', 'Swim across the freezing ocean!', '😌'),
    spkChoice(4, '🗣️ You think of a smart way to solve a problem. What do you say?', 'Wait! I have a great idea!', 'Wait! Giraffes have long necks!', 'Wait! Rabbits freeze in holes!', '💡'),
    spkChoice(4, '🗣️ The audience is waiting on the platform. What do you say?', 'Let’s perform our show right here!', 'Let’s drive a smoky old car!', 'Let’s dig up a pine cone!', '🎭'),
    spkChoice(4, '🗣️ Your teammate scores a winning basket. What do you say?', 'Amazing shot! Great teamwork!', 'The desert is very hot today!', 'Beethoven took ten years!', '🏀'),
    spkChoice(4, '🗣️ Your team wins by working together. What do you say?', 'We can do it when we work as a team!', 'Alice fell down a deep hole!', 'Old chairs make a loud squeak!', '🤝'),

    /* Unit 5 — Make Some Noise */
    spkChoice(5, '🗣️ The red recording light turns on in the studio. What do you say?', 'Shh! We have to be quiet now!', 'Hurry! Ride your bicycle faster!', 'Look! The camel has a big hump!', '🎬'),
    spkChoice(5, '🗣️ You explain how Foley artists make horse sounds. What do you say?', 'They bang two coconut shells together!', 'They freeze like a little rabbit!', 'They stretch their necks for leaves!', '🥥'),
    spkChoice(5, '🗣️ Your friend asks how to make a knight marching sound. What do you say?', 'Shake metal keys to sound like armor!', 'Ride an electric car on the ice!', 'Shoot a three-pointer in the gym!', '🛡️'),
    spkChoice(5, '🗣️ You describe Beethoven conducting with a simile. What do you say?', 'He lifts his arms high like an eagle!', 'He is stuck in heavy bus traffic!', 'He lives in a hot, dry desert!', '🦅'),
    spkChoice(5, '🗣️ Why did a singer gently turn Beethoven around?', 'Because he was deaf and couldn’t hear the cheers!', 'Because he forgot his bicycle helmet!', 'Because he chased the White Rabbit!', '🎼'),
    spkChoice(5, '🗣️ You describe the end of Beethoven’s 9th Symphony. What do you say?', 'The audience stood up, clapped, and threw flowers!', 'The polar bear swam across the ice!', 'The vet helped a baby bird fly!', '👏')
  ];

  GM.sets = GM.sets || [];

  var UNIT_TITLES = {
    3: {
      1: 'G3 U1 · Easy Speaking & Acting (Inventions & Bridges)',
      2: 'G3 U2 · Easy Speaking & Acting (Thank You & Moon Song)',
      3: 'G3 U3 · Easy Speaking & Acting (How Much Is It? · Money)',
      4: 'G3 U4 · Easy Speaking & Acting (Mona Lisa & Volcano)',
      5: 'G3 U5 · Easy Speaking & Acting (Time Book & Time Capsules)'
    },
    4: {
      1: 'G4 U1 · Easy Speaking & Acting (Reading & Butterflies)',
      2: 'G4 U2 · Easy Speaking & Acting (Animals & Forest)',
      3: 'G4 U3 · Easy Speaking & Acting (Arctic & Clean Cars)',
      4: 'G4 U4 · Easy Speaking & Acting (Late for the Show & Teamwork)',
      5: 'G4 U5 · Easy Speaking & Acting (Foley Studio & Beethoven)'
    }
  };

  var CHOICE_TITLES = {
    3: {
      1: 'G3 U1 · Speaking Choice (What Do You Say? · Inventions)',
      2: 'G3 U2 · Speaking Choice (What Do You Say? · Harvest)',
      3: 'G3 U3 · Speaking Choice (What Do You Say? · Money)',
      4: 'G3 U4 · Speaking Choice (What Do You Say? · Mystery & Volcano)',
      5: 'G3 U5 · Speaking Choice (What Do You Say? · Time Book & Capsules)'
    },
    4: {
      1: 'G4 U1 · Speaking Choice (What Do You Say? · Reading)',
      2: 'G4 U2 · Speaking Choice (What Do You Say? · Animal Survivors)',
      3: 'G4 U3 · Speaking Choice (What Do You Say? · Arctic & Clean Cars)',
      4: 'G4 U4 · Speaking Choice (What Do You Say? · Teamwork & Show)',
      5: 'G4 U5 · Speaking Choice (What Do You Say? · Make Some Noise)'
    }
  };

  function pushSet(s) {
    GM.sets = GM.sets.filter(function (x) { return x.id !== s.id; });
    GM.sets.push(s);
  }

  /* 1. All-Units Speaking & Acting Sets (Units 1–5, 30 cards each) */
  pushSet({
    id: 'speak-g3',
    title: 'Grade 3 · Units 1–5 Easy Speaking & Acting',
    sub: 'All 5 Units · 30 Action & Speaking Cards',
    grade: 3,
    unit: 0,
    skill: 'speaking',
    e: '🎤',
    items: G3
  });

  pushSet({
    id: 'speak-g4',
    title: 'Grade 4 · Units 1–5 Easy Speaking & Acting',
    sub: 'All 5 Units · 30 Action & Speaking Cards',
    grade: 4,
    unit: 0,
    skill: 'speaking',
    e: '🎤',
    items: G4
  });

  /* 2. All-Units Speaking Choice Sets (Units 1–5, 30 cards each — works in EVERY game!) */
  pushSet({
    id: 'speak-choice-g3',
    title: 'Grade 3 · Units 1–5 Speaking Choice (All Units)',
    sub: 'All 5 Units · 30 Choose & Say Speaking Questions',
    grade: 3,
    unit: 0,
    skill: 'Speaking',
    e: '🗣️',
    items: G3_CHOICE
  });

  pushSet({
    id: 'speak-choice-g4',
    title: 'Grade 4 · Units 1–5 Speaking Choice (All Units)',
    sub: 'All 5 Units · 30 Choose & Say Speaking Questions',
    grade: 4,
    unit: 0,
    skill: 'Speaking',
    e: '🗣️',
    items: G4_CHOICE
  });

  /* 3. Per-Unit Speaking & Acting + Speaking Choice Sets (Units 1–5) */
  [1, 2, 3, 4, 5].forEach(function (u) {
    pushSet({
      id: 'speak-g3-u' + u,
      title: UNIT_TITLES[3][u],
      sub: 'Unit ' + u + ' Action & Speaking Cards',
      grade: 3,
      unit: u,
      skill: 'speaking',
      skillOnly: true,
      e: '🎤',
      items: G3.filter(function (it) { return it.unit === u; })
    });
    pushSet({
      id: 'speak-g4-u' + u,
      title: UNIT_TITLES[4][u],
      sub: 'Unit ' + u + ' Action & Speaking Cards',
      grade: 4,
      unit: u,
      skill: 'speaking',
      skillOnly: true,
      e: '🎤',
      items: G4.filter(function (it) { return it.unit === u; })
    });
    pushSet({
      id: 'speak-choice-g3-u' + u,
      title: CHOICE_TITLES[3][u],
      sub: 'Unit ' + u + ' Choose & Say Speaking Questions',
      grade: 3,
      unit: u,
      skill: 'Speaking',
      e: '🗣️',
      items: G3_CHOICE.filter(function (it) { return it.unit === u; })
    });
    pushSet({
      id: 'speak-choice-g4-u' + u,
      title: CHOICE_TITLES[4][u],
      sub: 'Unit ' + u + ' Choose & Say Speaking Questions',
      grade: 4,
      unit: u,
      skill: 'Speaking',
      e: '🗣️',
      items: G4_CHOICE.filter(function (it) { return it.unit === u; })
    });
  });
})(typeof window !== 'undefined' ? window : this);
