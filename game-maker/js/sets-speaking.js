/* Game Maker — Easy A1 Speaking & Acting Showdown (Units 1–4)
   Designed for 8–10 year old A1 learners (Grade 3 & Grade 4):
   - Short 4–7 word prompts (`q`)
   - Fun 3–4 word physical gesture (`act`)
   - 1 short 3–6 word sentence (`frame`) + template (`tpl`)
   - 3 tap-to-say word pills (`words`) that kids can tap on the smartboard to hear & repeat
   - Short 1–3 word A/B/C backup choices (`a`, `w`) */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};

  var SPEAK_G3 = [
    // ================= UNIT 1: INVENTIONS & YOUNG INVENTORS (8) =================
    {
      q: '💡 What can you invent?',
      act: '🎬 Draw in the air!',
      tpl: 'I can make {w}!',
      words: ['🤖 a robot', '🚗 a flying car', '👟 magic shoes'],
      frame: '🗣️ "I can make a robot!"',
      speak: 'I can make a robot!',
      a: '🤖 A robot',
      w: ['🍌 A banana', '🪨 A rock'],
      e: '💡', skill: 'Speaking', unit: 1
    },
    {
      q: '✏️ What do you do FIRST?',
      act: '🎬 Pretend to draw!',
      tpl: 'First, I {w}!',
      words: ['✏️ draw a plan', '🔨 build a box', '🎨 paint it blue'],
      frame: '🗣️ "First, I draw a plan!"',
      speak: 'First, I draw a plan!',
      a: '✏️ Draw a plan',
      w: ['😴 Go to sleep', '🍕 Eat pizza'],
      e: '✏️', skill: 'Speaking', unit: 1
    },
    {
      q: '🔨 What tool do you use?',
      act: '🎬 Tap, tap, tap!',
      tpl: 'I use {w}!',
      words: ['🔨 a hammer', '✂️ scissors', '📏 a ruler'],
      frame: '🗣️ "I use a hammer!"',
      speak: 'I use a hammer!',
      a: '🔨 A hammer',
      w: ['🍦 Ice cream', '🎈 A balloon'],
      e: '🔨', skill: 'Speaking', unit: 1
    },
    {
      q: '🤖 What can your robot do?',
      act: '🎬 Walk like a robot!',
      tpl: 'My robot can {w}!',
      words: ['🧹 clean my room', '💃 dance fast', '✈️ fly high'],
      frame: '🗣️ "My robot can clean my room!"',
      speak: 'My robot can clean my room!',
      a: '🧹 Clean my room',
      w: ['😭 Cry all day', '🪨 Be a rock'],
      e: '🤖', skill: 'Speaking', unit: 1
    },
    {
      q: '🕷️ How is spider silk?',
      act: '🎬 Pull a strong rope!',
      tpl: 'Spider silk is {w}!',
      words: ['💪 very strong', '🪶 very light', '✨ super stretchy'],
      frame: '🗣️ "Spider silk is very strong!"',
      speak: 'Spider silk is very strong!',
      a: '💪 Very strong',
      w: ['🍞 Soft bread', '🧊 Cold ice'],
      e: '🕷️', skill: 'Speaking', unit: 1
    },
    {
      q: '🎒 My bag is too heavy! Help!',
      act: '🎬 Lift a heavy bag!',
      tpl: 'Let’s add {w}!',
      words: ['🛞four wheels', '🪽 two wings', '🚀 a rocket'],
      frame: '🗣️ "Let’s add four wheels!"',
      speak: 'Let us add four wheels!',
      a: '🛞 Four wheels',
      w: ['🪨 Big rocks', '📚 More books'],
      e: '🎒', skill: 'Speaking', unit: 1
    },
    {
      q: '🔧 Oh no! It broke! What now?',
      act: '🎬 Give a thumbs up!',
      tpl: 'I can {w}!',
      words: ['🔁 try again', '🔧 fix it now', '🤝 ask a friend'],
      frame: '🗣️ "I can try again!"',
      speak: 'I can try again!',
      a: '🔁 Try again',
      w: ['😭 Give up', '🗑️ Throw it'],
      e: '🔧', skill: 'Speaking', unit: 1
    },
    {
      q: '🌟 Show your new invention!',
      act: '🎬 Take a big bow!',
      tpl: 'Look at my {w}!',
      words: ['🚲 flying bike', '🎩 smart hat', '🛴 rocket scooter'],
      frame: '🗣️ "Look at my flying bike!"',
      speak: 'Look at my flying bike!',
      a: '🚲 Flying bike',
      w: ['🕳️ Empty hole', '💨 Nothing'],
      e: '🌟', skill: 'Speaking', unit: 1
    },

    // ================= UNIT 2: CHUSEOK, COOKING & COMMUNITY (8) =================
    {
      q: '🌕 What do you see at Chuseok?',
      act: '🎬 Make a big circle!',
      tpl: 'I see the {w}!',
      words: ['🌕 full moon', '⭐ bright stars', '👨‍👩‍👧 happy family'],
      frame: '🗣️ "I see the full moon!"',
      speak: 'I see the full moon!',
      a: '🌕 Full moon',
      w: ['⛄ Snowman', '🦖 Dinosaur'],
      e: '🌕', skill: 'Speaking', unit: 2
    },
    {
      q: '🍡 Let’s make Chuseok rice cakes!',
      act: '🎬 Roll a ball in your hands!',
      tpl: 'I roll the {w}!',
      words: ['🍡 rice cake', '🍯 sweet honey', '🫘 red beans'],
      frame: '🗣️ "I roll the rice cake!"',
      speak: 'I roll the rice cake!',
      a: '🍡 Rice cake',
      w: ['👟 Old shoe', '🪨 Hard rock'],
      e: '🍡', skill: 'Speaking', unit: 2
    },
    {
      q: '💃 Dance the Chuseok circle dance!',
      act: '🎬 Hold hands & step!',
      tpl: 'We go {w}!',
      words: ['⭕ round and round', '⬆️ tall and low', '⚡ fast and slow'],
      frame: '🗣️ "We go round and round!"',
      speak: 'We go round and round!',
      a: '⭕ Round and round',
      w: ['😴 Fast asleep', '🪑 Sit still'],
      e: '💃', skill: 'Speaking', unit: 2
    },
    {
      q: '🍲 What do you put in the soup?',
      act: '🎬 Stir a big pot!',
      tpl: 'I put {w} in!',
      words: ['🥕 carrots', '🥔 potatoes', '🧅 onions'],
      frame: '🗣️ "I put carrots in!"',
      speak: 'I put carrots in!',
      a: '🥕 Carrots',
      w: ['✏️ Pencils', '🧸 Toys'],
      e: '🍲', skill: 'Speaking', unit: 2
    },
    {
      q: '🚒 Who helps our town?',
      act: '🎬 Spray a water hose!',
      tpl: 'The {w} helps us!',
      words: ['👩‍🚒 firefighter', '👩‍⚕️ doctor', '👩‍🏫 teacher'],
      frame: '🗣️ "The firefighter helps us!"',
      speak: 'The firefighter helps us!',
      a: '👩‍🚒 Firefighter',
      w: ['👻 Ghost', '🏴‍☠️ Pirate'],
      e: '🚒', skill: 'Speaking', unit: 2
    },
    {
      q: '🪑 What is it made of?',
      act: '🎬 Knock on wood!',
      tpl: 'It is made of {w}!',
      words: ['🪵 wood', '🪙 metal', '🪟 glass'],
      frame: '🗣️ "It is made of wood!"',
      speak: 'It is made of wood!',
      a: '🪵 Wood',
      w: ['☁️ Clouds', '💧 Water'],
      e: '🪑', skill: 'Speaking', unit: 2
    },
    {
      q: '🌱 How do we grow food?',
      act: '🎬 Water a little plant!',
      tpl: 'I give it {w}!',
      words: ['💧 water', '☀️ warm sun', '🌱 good soil'],
      frame: '🗣️ "I give it water!"',
      speak: 'I give it water!',
      a: '💧 Water',
      w: ['🍬 Candy', '🧃 Soda'],
      e: '🌱', skill: 'Speaking', unit: 2
    },
    {
      q: '🙏 What are you thankful for?',
      act: '🎬 Hands on your heart!',
      tpl: 'Thank you for my {w}!',
      words: ['👨‍👩‍👧 family', '👫 friends', '🍎 good food'],
      frame: '🗣️ "Thank you for my family!"',
      speak: 'Thank you for my family!',
      a: '👨‍👩‍👧 My family',
      w: ['🌧️ Cold rain', '🗑️ Trash'],
      e: '🙏', skill: 'Speaking', unit: 2
    },

    // ================= UNIT 3: IT KEEPS CHANGING & THE ARCTIC (8) =================
    {
      q: '🧊 What happens to warm ice?',
      act: '🎬 Melt down to the floor!',
      tpl: 'The ice {w}!',
      words: ['💧 melts fast', '🌊 turns to water', '💥 cracks loud'],
      frame: '🗣️ "The ice melts fast!"',
      speak: 'The ice melts fast!',
      a: '💧 Melts fast',
      w: ['🔥 Burns hot', '🎈 Flies up'],
      e: '🧊', skill: 'Speaking', unit: 3
    },
    {
      q: '🐻‍❄️ What can the polar bear do?',
      act: '🎬 Swim like a bear!',
      tpl: 'The bear can {w}!',
      words: ['🏊 swim in ice', '🐾 walk on snow', '🐟 catch a fish'],
      frame: '🗣️ "The bear can swim in ice!"',
      speak: 'The bear can swim in ice!',
      a: '🏊 Swim in ice',
      w: ['🚲 Ride a bike', '✈️ Fly a plane'],
      e: '🐻‍❄️', skill: 'Speaking', unit: 3
    },
    {
      q: '🥶 How is the Arctic weather?',
      act: '🎬 Shiver: Brrrr!',
      tpl: 'It is very {w}!',
      words: ['🥶 cold and icy', '❄️ snowy today', '🌬️ windy outside'],
      frame: '🗣️ "It is very cold and icy!"',
      speak: 'It is very cold and icy!',
      a: '🥶 Cold and icy',
      w: ['🏖️ Hot and sunny', '🌴 Tropical'],
      e: '🥶', skill: 'Speaking', unit: 3
    },
    {
      q: '💥 Crack! Why did the bear jump?',
      act: '🎬 Jump to a safe spot!',
      tpl: 'Because the {w}!',
      words: ['🧊 ice cracked', '🌊 water moved', '❄️ snow fell'],
      frame: '🗣️ "Because the ice cracked!"',
      speak: 'Because the ice cracked!',
      a: '🧊 Ice cracked',
      w: ['🔔 Bell rang', '🎂 Cake came'],
      e: '💥', skill: 'Speaking', unit: 3
    },
    {
      q: '🚗 How can we help the Earth?',
      act: '🎬 Ride a bicycle!',
      tpl: 'We can {w}!',
      words: ['🚲 ride a bike', '🌳 plant a tree', '⚡ use clean cars'],
      frame: '🗣️ "We can ride a bike!"',
      speak: 'We can ride a bike!',
      a: '🚲 Ride a bike',
      w: ['🗑️ Drop trash', '💨 Make smoke'],
      e: '🚗', skill: 'Speaking', unit: 3
    },
    {
      q: '🦋 Look! The caterpillar changed!',
      act: '🎬 Flap butterfly wings!',
      tpl: 'Now it is a {w}!',
      words: ['🦋 butterfly', '🐸 green frog', '🌻 big flower'],
      frame: '🗣️ "Now it is a butterfly!"',
      speak: 'Now it is a butterfly!',
      a: '🦋 Butterfly',
      w: ['🪨 Gray rock', '🪑 Wooden chair'],
      e: '🦋', skill: 'Speaking', unit: 3
    },
    {
      q: '🍂 How do trees change in autumn?',
      act: '🎬 Flutter like falling leaves!',
      tpl: 'The leaves turn {w}!',
      words: ['🍂 red and gold', '🟠 bright orange', '🟡 sunny yellow'],
      frame: '🗣️ "The leaves turn red and gold!"',
      speak: 'The leaves turn red and gold!',
      a: '🍂 Red and gold',
      w: ['🔵 Neon blue', '🟣 Polka dot'],
      e: '🍂', skill: 'Speaking', unit: 3
    },
    {
      q: '🕵️ Daphne Detective: Where is the book?',
      act: '🎬 Look through a spyglass!',
      tpl: 'It is {w}!',
      words: ['🎒 in the bag', '🪑 under the desk', '📚 on the shelf'],
      frame: '🗣️ "It is in the bag!"',
      speak: 'It is in the bag!',
      a: '🎒 In the bag',
      w: ['🌙 On the moon', '🌊 In the sea'],
      e: '🕵️', skill: 'Speaking', unit: 3
    },

    // ================= UNIT 4: MONA LISA & THE ANGRY MOUNTAIN (8) =================
    {
      q: '🖼️ Oh no! What happened at the museum?',
      act: '🎬 Hands on your cheeks!',
      tpl: 'The painting is {w}!',
      words: ['😱 gone', '🕵️ missing', '🏃 stolen'],
      frame: '🗣️ "The painting is gone!"',
      speak: 'The painting is gone!',
      a: '😱 It is gone',
      w: ['🍕 Eating lunch', '🎶 Singing loud'],
      e: '🖼️', skill: 'Speaking', unit: 4
    },
    {
      q: '🕵️ What did the thief do?',
      act: '🎬 Tiptoe very quietly!',
      tpl: 'He {w}!',
      words: ['🧥 hid it', '🚪 walked out', '🖼️ took the art'],
      frame: '🗣️ "He hid it!"',
      speak: 'He hid it!',
      a: '🧥 Hid it',
      w: ['🎨 Painted it', '🧹 Cleaned it'],
      e: '🕵️', skill: 'Speaking', unit: 4
    },
    {
      q: '🎉 Hooray! The Mona Lisa is back!',
      act: '🎬 Cheer and clap!',
      tpl: 'Everyone feels {w}!',
      words: ['😊 happy', '🤩 excited', '😮 surprised'],
      frame: '🗣️ "Everyone feels happy!"',
      speak: 'Everyone feels happy!',
      a: '😊 Happy',
      w: ['😴 Sleepy', '🥱 Bored'],
      e: '🎉', skill: 'Speaking', unit: 4
    },
    {
      q: '🌋 Boom! What comes from the volcano?',
      act: '🎬 Make a big explosion!',
      tpl: 'I see {w}!',
      words: ['🌫️ dark ash', '🔥 hot fire', '💨 big smoke'],
      frame: '🗣️ "I see dark ash!"',
      speak: 'I see dark ash!',
      a: '🌫️ Dark ash',
      w: ['🍦 Ice cream', '🎀 Pink ribbons'],
      e: '🌋', skill: 'Speaking', unit: 4
    },
    {
      q: '🐕 Why did the dog bark?',
      act: '🎬 Cup your ear & listen!',
      tpl: 'Because it heard {w}!',
      words: ['⛈️ loud thunder', '🌋 the mountain', '💥 a big boom'],
      frame: '🗣️ "Because it heard loud thunder!"',
      speak: 'Because it heard loud thunder!',
      a: '⛈️ Loud thunder',
      w: ['🤫 A whisper', '🦋 A butterfly'],
      e: '🐕', skill: 'Speaking', unit: 4
    },
    {
      q: '🌑 Why was the sky dark?',
      act: '🎬 Cover your eyes!',
      tpl: 'Ash hid the {w}!',
      words: ['☀️ bright sun', '🌅 sunrise', '🔵 blue sky'],
      frame: '🗣️ "Ash hid the bright sun!"',
      speak: 'Ash hid the bright sun!',
      a: '☀️ Bright sun',
      w: ['🐟 Little fish', '👟 My shoes'],
      e: '🌑', skill: 'Speaking', unit: 4
    },
    {
      q: '⛵ How did the family stay safe?',
      act: '🎬 Row a boat fast!',
      tpl: 'We went on a {w}!',
      words: ['⛵ big boat', '🚢 rescue ship', '🏝️ safe beach'],
      frame: '🗣️ "We went on a big boat!"',
      speak: 'We went on a big boat!',
      a: '⛵ Big boat',
      w: ['🌋 Inside lava', '🛌 Under a rug'],
      e: '⛵', skill: 'Speaking', unit: 4
    },
    {
      q: '🔤 Say a word ending with -ND!',
      act: '🎬 Wave your hand!',
      tpl: 'I can say {w}!',
      words: ['✋ hand', '🌬️ wind', '🏖️ sand'],
      frame: '🗣️ "I can say hand!"',
      speak: 'I can say hand!',
      a: '✋ Hand / wind',
      w: ['🐱 Cat / dog', '🍎 Red / blue'],
      e: '🔤', skill: 'Speaking', unit: 4
    }
  ];

  var SPEAK_G4 = [
    // ================= UNIT 1: BRAIN POWER & HOW WE LEARN (8) =================
    {
      q: '🧠 What helps your brain grow?',
      act: '🎬 Point to your brain!',
      tpl: 'My brain likes {w}!',
      words: ['💤 good sleep', '💧 fresh water', '📚 reading books'],
      frame: '🗣️ "My brain likes good sleep!"',
      speak: 'My brain likes good sleep!',
      a: '💤 Good sleep',
      w: ['🍬 Only candy', '😴 Zero sleep'],
      e: '🧠', skill: 'Speaking', unit: 1
    },
    {
      q: '💪 This puzzle is hard! What do you say?',
      act: '🎬 Flex your muscles!',
      tpl: 'I can {w}!',
      words: ['🔁 try again', '🧩 practice more', '🤝 ask for help'],
      frame: '🗣️ "I can try again!"',
      speak: 'I can try again!',
      a: '🔁 Try again',
      w: ['😭 Quit now', '🙈 Hide away'],
      e: '💪', skill: 'Speaking', unit: 1
    },
    {
      q: '📖 How do you learn new words?',
      act: '🎬 Open a book in your hands!',
      tpl: 'I {w} every day!',
      words: ['📖 read stories', '🗣️ speak English', '🎧 listen well'],
      frame: '🗣️ "I read stories every day!"',
      speak: 'I read stories every day!',
      a: '📖 Read stories',
      w: ['😴 Sleep in class', '🙊 Never speak'],
      e: '📖', skill: 'Speaking', unit: 1
    },
    {
      q: '⚡ Which animal is faster?',
      act: '🎬 Run in place fast!',
      tpl: 'A {w} is faster!',
      words: ['🐆 cheetah', '🦅 falcon', '🐎 fast horse'],
      frame: '🗣️ "A cheetah is faster!"',
      speak: 'A cheetah is faster!',
      a: '🐆 A cheetah',
      w: ['🐌 A snail', '🐢 A turtle'],
      e: '⚡', skill: 'Speaking', unit: 1
    },
    {
      q: '🐪 How does a camel live in the desert?',
      act: '🎬 Wipe your hot forehead!',
      tpl: 'It saves {w}!',
      words: ['💧 water', '⚡ energy', '🥗 food'],
      frame: '🗣️ "It saves water!"',
      speak: 'It saves water!',
      a: '💧 Saves water',
      w: ['⛄ Builds snowmen', '🏊 Swims in ice'],
      e: '🐪', skill: 'Speaking', unit: 1
    },
    {
      q: '🌿 Food Chain: Who eats the green grass?',
      act: '🎬 Hop like a rabbit!',
      tpl: 'The {w} eats grass!',
      words: ['🐰 rabbit', '🦌 deer', '🦓 zebra'],
      frame: '🗣️ "The rabbit eats grass!"',
      speak: 'The rabbit eats grass!',
      a: '🐰 The rabbit',
      w: ['🪨 A rock', '🚗 A car'],
      e: '🌿', skill: 'Speaking', unit: 1
    },
    {
      q: '🦉 What can an owl do at night?',
      act: '🎬 Make big owl eyes!',
      tpl: 'An owl can {w}!',
      words: ['👀 see in the dark', '🪽 fly quietly', '🐭 catch a mouse'],
      frame: '🗣️ "An owl can see in the dark!"',
      speak: 'An owl can see in the dark!',
      a: '👀 See in the dark',
      w: ['☀️ Make sunshine', '📱 Read a phone'],
      e: '🦉', skill: 'Speaking', unit: 1
    },
    {
      q: '🌳 Why do animals need the forest?',
      act: '🎬 Make a roof over your head!',
      tpl: 'It gives them {w}!',
      words: ['🏡 a safe home', '🍎 fresh food', '💧 clean water'],
      frame: '🗣️ "It gives them a safe home!"',
      speak: 'It gives them a safe home!',
      a: '🏡 A safe home',
      w: ['🎮 Video games', '🍕 Plastic toys'],
      e: '🌳', skill: 'Speaking', unit: 1
    },

    // ================= UNIT 2: FOREST RANGERS & THE SWALLOW'S GIFT (8) =================
    {
      q: '🕊️ Why did Heungbu help the bird?',
      act: '🎬 Hold a tiny bird gently!',
      tpl: 'Because he was {w}!',
      words: ['💛 kind', '🤝 helpful', '😊 gentle'],
      frame: '🗣️ "Because he was kind!"',
      speak: 'Because he was kind!',
      a: '💛 He was kind',
      w: ['😠 He was mean', '💰 He was greedy'],
      e: '🕊️', skill: 'Speaking', unit: 2
    },
    {
      q: '🌱 What did the swallow bring Heungbu?',
      act: '🎬 Plant a magic seed!',
      tpl: 'It brought a {w}!',
      words: ['🌱 magic seed', '🎃 big gourd', '🪙 gold treasure'],
      frame: '🗣️ "It brought a magic seed!"',
      speak: 'It brought a magic seed!',
      a: '🌱 Magic seed',
      w: ['🪨 Heavy rock', '👟 Old boot'],
      e: '🌱', skill: 'Speaking', unit: 2
    },
    {
      q: '😠 How was greedy Nolbu?',
      act: '🎬 Cross your arms & frown!',
      tpl: 'Nolbu was {w}!',
      words: ['💰 greedy', '😠 selfish', '👎 unkind'],
      frame: '🗣️ "Nolbu was greedy!"',
      speak: 'Nolbu was greedy!',
      a: '💰 Greedy',
      w: ['💛 Very kind', '🤝 Generous'],
      e: '😠', skill: 'Speaking', unit: 2
    },
    {
      q: '🦁 How did the little mouse help the lion?',
      act: '🎬 Chew the net: nibble, nibble!',
      tpl: 'It chewed the {w}!',
      words: ['🕸️ big net', '🪢 thick rope', '🪤 lion’s trap'],
      frame: '🗣️ "It chewed the big net!"',
      speak: 'It chewed the big net!',
      a: '🕸️ Big net',
      w: ['🧀 Yellow cheese', '🌳 Tall tree'],
      e: '🦁', skill: 'Speaking', unit: 2
    },
    {
      q: '🌲 Forest Ranger: How do we protect the woods?',
      act: '🎬 Put on your ranger hat!',
      tpl: 'We must {w}!',
      words: ['🚯 keep it clean', '🚫 stop fires', '🦌 help animals'],
      frame: '🗣️ "We must keep it clean!"',
      speak: 'We must keep it clean!',
      a: '🚯 Keep it clean',
      w: ['🪓 Cut all trees', '🗑️ Leave trash'],
      e: '🌲', skill: 'Speaking', unit: 2
    },
    {
      q: '🐿️ What was the squirrel doing?',
      act: '🎬 Gather nuts in your paws!',
      tpl: 'It was {w}!',
      words: ['🌰 finding nuts', '🌳 climbing high', '🏃 jumping fast'],
      frame: '🗣️ "It was finding nuts!"',
      speak: 'It was finding nuts!',
      a: '🌰 Finding nuts',
      w: ['📺 Watching TV', '🚗 Driving a bus'],
      e: '🐿️', skill: 'Speaking', unit: 2
    },
    {
      q: '📖 What is the lesson of the story?',
      act: '🎬 Shake hands with a friend!',
      tpl: 'Always be {w}!',
      words: ['💛 kind to others', '🤝 a good friend', '🌟 helpful'],
      frame: '🗣️ "Always be kind to others!"',
      speak: 'Always be kind to others!',
      a: '💛 Be kind',
      w: ['💰 Be greedy', '😠 Be mean'],
      e: '📖', skill: 'Speaking', unit: 2
    },
    {
      q: '🏰 How did Heungbu’s story end?',
      act: '🎬 Big happy smile & wave!',
      tpl: 'They lived {w}!',
      words: ['😊 happily', '🏡 together', '💛 in peace'],
      frame: '🗣️ "They lived happily!"',
      speak: 'They lived happily!',
      a: '😊 Happily',
      w: ['😭 Very sadly', '😡 Fighting'],
      e: '🏰', skill: 'Speaking', unit: 2
    },

    // ================= UNIT 3: HOW MUCH IS IT? & MONEY (8) =================
    {
      q: '💰 Shopkeeper: How much is this hat?',
      act: '🎬 Hold up 5 fingers!',
      tpl: 'It is {w}!',
      words: ['🪙 five coins', '💵 ten dollars', '🏷️ on sale'],
      frame: '🗣️ "It is five coins!"',
      speak: 'It is five coins!',
      a: '🪙 Five coins',
      w: ['🐘 One elephant', '☁️ Two clouds'],
      e: '💰', skill: 'Speaking', unit: 3
    },
    {
      q: '🛒 Customer: What would you like to buy?',
      act: '🎬 Point to the shelf!',
      tpl: 'I would like {w}, please!',
      words: ['🍎 an apple', '📘 a storybook', '🧸 a toy bear'],
      frame: '🗣️ "I would like an apple, please!"',
      speak: 'I would like an apple, please!',
      a: '🍎 An apple, please',
      w: ['🪨 A broken rock', '🗑️ Old trash'],
      e: '🛒', skill: 'Speaking', unit: 3
    },
    {
      q: '🐚 Before coins, what did people trade?',
      act: '🎬 Swap with a partner!',
      tpl: 'They traded {w}!',
      words: ['🐚 seashells', '🧂 white salt', '🐄 farm cows'],
      frame: '🗣️ "They traded seashells!"',
      speak: 'They traded seashells!',
      a: '🐚 Seashells',
      w: ['📱 Smartphones', '💻 Laptops'],
      e: '🐚', skill: 'Speaking', unit: 3
    },
    {
      q: '🐷 Why do you save coins in a piggy bank?',
      act: '🎬 Drop a coin: clink!',
      tpl: 'I save for {w}!',
      words: ['🚲 a new bike', '🎁 a gift', '📚 a good book'],
      frame: '🗣️ "I save for a new bike!"',
      speak: 'I save for a new bike!',
      a: '🚲 A new bike',
      w: ['💨 Nothing at all', '🗑️ Trash'],
      e: '🐷', skill: 'Speaking', unit: 3
    },
    {
      q: '🍎 Need or Want: Which one do we NEED?',
      act: '🎬 Drink a glass of water!',
      tpl: 'We need {w}!',
      words: ['💧 clean water', '🍎 healthy food', '🧥 a warm coat'],
      frame: '🗣️ "We need clean water!"',
      speak: 'We need clean water!',
      a: '💧 Clean water',
      w: ['👑 A gold crown', '🏎️ Ten race cars'],
      e: '🍎', skill: 'Speaking', unit: 3
    },
    {
      q: '💳 How can people pay today?',
      act: '🎬 Tap a card: beep!',
      tpl: 'We can pay with {w}!',
      words: ['🪙 coins', '💵 paper money', '💳 a card'],
      frame: '🗣️ "We can pay with coins!"',
      speak: 'We can pay with coins!',
      a: '🪙 Coins or card',
      w: ['🍂 Tree leaves', '❄️ Snowballs'],
      e: '💳', skill: 'Speaking', unit: 3
    },
    {
      q: '🐧 Captain Quiet: What is our class rule?',
      act: '🎬 Finger on lips & raise hand!',
      tpl: 'We {w} in class!',
      words: ['✋ raise our hand', '🎧 listen well', '🤝 take turns'],
      frame: '🗣️ "We raise our hand in class!"',
      speak: 'We raise our hand in class!',
      a: '✋ Raise our hand',
      w: ['📢 Shout loud', '🏃 Run on desks'],
      e: '🐧', skill: 'Speaking', unit: 3
    },
    {
      q: '🎨 Design new money! What is on your coin?',
      act: '🎬 Hold up your shiny coin!',
      tpl: 'My coin has a {w}!',
      words: ['🐉 dragon', '⭐ gold star', '🚀 space rocket'],
      frame: '🗣️ "My coin has a dragon!"',
      speak: 'My coin has a dragon!',
      a: '🐉 A dragon',
      w: ['🕳️ Nothing', '🌫️ Gray dust'],
      e: '🎨', skill: 'Speaking', unit: 3
    },

    // ================= UNIT 4: TEAM PLAYERS, LATE FOR THE SHOW & ALICE (8) =================
    {
      q: '🏀 How does a good team win?',
      act: '🎬 Pass the ball to a friend!',
      tpl: 'We {w} together!',
      words: ['🏀 pass the ball', '🤝 work together', '📣 cheer loud'],
      frame: '🗣️ "We pass the ball together!"',
      speak: 'We pass the ball together!',
      a: '🏀 Pass the ball',
      w: ['😠 Fight our team', '🙈 Hide the ball'],
      e: '🏀', skill: 'Speaking', unit: 4
    },
    {
      q: '👏 Your friend missed a shot! What do you say?',
      act: '🎬 High-five your friend!',
      tpl: 'Good try! {w}!',
      words: ['💪 You can do it', '🔁 Try again', '🌟 Don’t give up'],
      frame: '🗣️ "Good try! You can do it!"',
      speak: 'Good try! You can do it!',
      a: '💪 You can do it!',
      w: ['👎 Go away!', '😡 You lost!'],
      e: '👏', skill: 'Speaking', unit: 4
    },
    {
      q: '🎭 Harry is on stage! How does he feel?',
      act: '🎬 Take a deep breath!',
      tpl: 'At first he feels {w}!',
      words: ['💓 nervous', '😮 shy', '🤩 excited'],
      frame: '🗣️ "At first he feels nervous!"',
      speak: 'At first he feels nervous!',
      a: '💓 Nervous',
      w: ['😴 Fast asleep', '🍔 Hungry'],
      e: '🎭', skill: 'Speaking', unit: 4
    },
    {
      q: '🚆 Why was Harry late for the show?',
      act: '🎬 Check your watch & run!',
      tpl: 'Because the {w}!',
      words: ['🚆 train stopped', '🚌 bus was late', '🌧️ rain was heavy'],
      frame: '🗣️ "Because the train stopped!"',
      speak: 'Because the train stopped!',
      a: '🚆 Train stopped',
      w: ['🛸 UFO landed', '🦖 Dino came'],
      e: '🚆', skill: 'Speaking', unit: 4
    },
    {
      q: '🧘 How do you feel calm before a show?',
      act: '🎬 Breathe in… breathe out!',
      tpl: 'I {w}!',
      words: ['🧘 breathe slowly', '😊 smile big', '🎶 practice my line'],
      frame: '🗣️ "I breathe slowly!"',
      speak: 'I breathe slowly!',
      a: '🧘 Breathe slowly',
      w: ['😱 Scream loud', '🏃 Run away'],
      e: '🧘', skill: 'Speaking', unit: 4
    },
    {
      q: '🎩 What do you wear in the school play?',
      act: '🎬 Put on a big hat & bow!',
      tpl: 'I wear a {w}!',
      words: ['🎩 tall hat', '👑 gold crown', '🦸 cool costume'],
      frame: '🗣️ "I wear a tall hat!"',
      speak: 'I wear a tall hat!',
      a: '🎩 A tall hat',
      w: ['🛌 A heavy bed', '🚪 A classroom door'],
      e: '🎩', skill: 'Speaking', unit: 4
    },
    {
      q: '🫖 Alice Tea Party: Welcome a guest!',
      act: '🎬 Pour a cup of tea!',
      tpl: 'Would you like {w}?',
      words: ['🫖 some tea', '🧁 a cupcake', '🍪 a cookie'],
      frame: '🗣️ "Would you like some tea?"',
      speak: 'Would you like some tea?',
      a: '🫖 Some tea',
      w: ['🪨 Hot lava', '🕸️ Spider soup'],
      e: '🫖', skill: 'Speaking', unit: 4
    },
    {
      q: '🐇 White Rabbit: What time is it?',
      act: '🎬 Tap your pocket watch!',
      tpl: 'Oh dear! I am {w}!',
      words: ['⏰ late today', '🏃 in a hurry', '🫖 going to tea'],
      frame: '🗣️ "Oh dear! I am late today!"',
      speak: 'Oh dear! I am late today!',
      a: '⏰ Late today',
      w: ['😴 Going to bed', '⛄ Freezing'],
      e: '🐇', skill: 'Speaking', unit: 4
    }
  ];

  function addSet(s) {
    GM.sets = GM.sets || [];
    var idx = -1;
    for (var i = 0; i < GM.sets.length; i++) {
      if (GM.sets[i].id === s.id) { idx = i; break; }
    }
    if (idx >= 0) GM.sets[idx] = s;
    else GM.sets.unshift(s);
  }

  addSet({
    id: 'speak-g3',
    title: '🎤 Units 1–4 · Easy Speaking & Acting (Grade 3)',
    grade: 3,
    e: '🎤',
    items: SPEAK_G3
  });

  addSet({
    id: 'speak-g4',
    title: '🎤 Units 1–4 · Easy Speaking & Acting (Grade 4)',
    grade: 4,
    e: '🎤',
    items: SPEAK_G4
  });
})(typeof window !== 'undefined' ? window : this);
