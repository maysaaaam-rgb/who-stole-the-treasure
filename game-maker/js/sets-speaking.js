/* Game Maker: Units 1–4 Speaking & Acting Tournament Sets (Grade 3 and Grade 4).
   Designed for the 8 Wave 2 Arcade Modes (Penalty Kick, Baseball, Tower Stack, Whack-a-Word,
   Snakes & Ladders, Jigsaw, Balloon Pop, Memory) as well as Cannon, Race, Fling, and Tile Board.
   Each item provides:
   - q: The Speaking / Acting challenge prompt
   - frame: Scaffolded 1–3 sentence speaking teleprompter frame shown on the card
   - speak: Full model sentences spoken by TTS when tapping 🔊
   - a & w: Target key phrase and 2 distractors so every mode (including Whack, Balloon, Memory, Jigsaw) works seamlessly! */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};

  function buildItems(list, grade) {
    return list.map(function (r) {
      return {
        q: r.q,
        frame: r.frame,
        speak: r.speak || r.frame.replace(/^🗣️\s*Say:\s*/i, '').replace(/"/g, ''),
        a: r.a,
        w: r.w,
        pic: r.pic || '🎤',
        skill: 'Speaking',
        grade: grade,
        unit: r.unit || 0
      };
    });
  }

  /* =========================================================================
     GRADE 3 · UNITS 1–4 SPEAKING & ACTING TOURNAMENT (32 ITEMS)
     ========================================================================= */
  var G3_SPEAK = [
    // --- UNIT 1: Young Inventors (Clara's Machine, Tidy vs Messy, Try Again) ---
    {
      unit: 1, pic: '🧹',
      q: '🎤 Speak & Act (Unit 1): Pretend your bedroom is a big mess! Show how you tidy it up and say 2 sentences.',
      frame: '🗣️ Say: "My room is a mess! Look, I tidy my room and put my toys in the box."',
      a: 'tidy my room', w: ['sleep all day', 'break the box']
    },
    {
      unit: 1, pic: '🤖',
      q: '🎤 Speak & Act (Unit 1): Pretend you are Clara the Inventor! Show your new machine and tell the class what it does.',
      frame: '🗣️ Say: "I am an inventor! Look at my new machine. It cleans the floor!"',
      a: 'cleans the floor', w: ['eats my homework', 'flies to the moon']
    },
    {
      unit: 1, pic: '💡',
      q: '🎤 Speak & Act (Unit 1): Oh no! Your machine stopped working. Act out what a good inventor does next!',
      frame: '🗣️ Say: "Oh no, my machine does not work! I will make a new plan and try again!"',
      a: 'make a new plan and try again', w: ['cry and give up', 'throw it away']
    },
    {
      unit: 1, pic: '🛞',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 1): Pupil A asks about the machine. Pupil B answers and acts it out!',
      frame: '🗣️ A: "What does your machine do?" — B: "It has wheels and a broom. It cleans my bedroom!"',
      a: 'It has wheels and a broom.', w: ['It is a sandwich.', 'It is sleeping.']
    },
    {
      unit: 1, pic: '📝',
      q: '🎤 Speak & Act (Unit 1): Pretend you are drawing a plan on big blue paper. Tell the class what you want to invent!',
      frame: '🗣️ Say: "First, I draw a plan on paper. I want to invent a flying bicycle!"',
      a: 'draw a plan on paper', w: ['hide behind the door', 'eat my lunch']
    },
    {
      unit: 1, pic: '🪞',
      q: '🎤 Speak & Act (Unit 1): Look into an imaginary mirror, smile big, and tell the class why you are a creative inventor!',
      frame: '🗣️ Say: "I look in the mirror. I have creative ideas, and I never give up!"',
      a: 'I have creative ideas', w: ['I am very sleepy', 'I lost my shoes']
    },
    {
      unit: 1, pic: '🚲',
      q: '🎤 Speak & Act (Unit 1): Act out riding a bicycle with two big round wheels and say how it moves!',
      frame: '🗣️ Say: "My bicycle has two round wheels. I push the pedals and ride fast!"',
      a: 'two round wheels', w: ['six square wings', 'no wheels at all']
    },
    {
      unit: 1, pic: '📦',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 1): Pupil A is Mom/Dad. Pupil B is the child tidying up the room!',
      frame: '🗣️ A: "Please tidy your room!" — B: "Okay! I put my books on the shelf and my toys in the box."',
      a: 'put my books on the shelf', w: ['throw toys on the floor', 'hide under the bed']
    },

    // --- UNIT 2: Chuseok Moon Feast & Thankfulness (There is/are, Thankful for, Can we...?) ---
    {
      unit: 2, pic: '🌕',
      q: '🎤 Speak & Act (Unit 2): Point up at the night sky on Chuseok and describe the moon in 2 sentences!',
      frame: '🗣️ Say: "Look at the autumn sky! There is a big, bright, round full moon tonight."',
      a: 'There is a bright full moon', w: ['There are snowstorms', 'There is a tiny square sun']
    },
    {
      unit: 2, pic: '🍡',
      q: '🎤 Speak & Act (Unit 2): Point to the harvest table and tell the class what food there is and there are!',
      frame: '🗣️ Say: "Look at our harvest table! There is a sweet moon cake, and there are three yellow pears."',
      a: 'There is a cake and there are pears', w: ['There are nothing on the table', 'There is three pencils']
    },
    {
      unit: 2, pic: '💛',
      q: '🎤 Speak & Act (Unit 2): Put your hand on your heart and tell the class two things you are thankful for!',
      frame: '🗣️ Say: "I am thankful for my family, and I am thankful for my kind teacher!"',
      a: 'thankful for my family', w: ['angry at my lunch', 'scared of my book']
    },
    {
      unit: 2, pic: '💃',
      q: '🎤 Speak & Act (Unit 2): Lead your team in the Chuseok Moon Dance (Ganggangsullae)! Act and say the moves!',
      frame: '🗣️ Say: "Walk tall in a circle! Walk low! Go to the right, and go to the left!"',
      a: 'Walk tall and walk low', w: ['Sit still and sleep', 'Run out of the room']
    },
    {
      unit: 2, pic: '🌱',
      q: '🎤 Speak & Act (Unit 2): Act like a farmer pulling food from the soil and say what grows in the harvest!',
      frame: '🗣️ Say: "It is harvest time in autumn! There are potatoes under the soil and apples on the trees."',
      a: 'harvest time in autumn', w: ['snowy time in winter', 'bedtime at midnight']
    },
    {
      unit: 2, pic: '🙋',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 2): Ask a polite question with "Can we...?" and answer!',
      frame: '🗣️ A: "Can we go outside and see the full moon?" — B: "Yes, we can! Let’s go together!"',
      a: 'Can we go outside?', w: ['We goes outside?', 'Can we going?']
    },
    {
      unit: 2, pic: '🍍',
      q: '🎤 Speak & Act (Unit 2): Describe a funny harvest basket using "There is" and "There are"!',
      frame: '🗣️ Say: "In my basket, there is one big pineapple and there are five red apples!"',
      a: 'there is one and there are five', w: ['there are one and there is five', 'there am two apples']
    },
    {
      unit: 2, pic: '🏡',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 2): Pupil A asks "Why are you happy today?" Pupil B answers with "Because..."!',
      frame: '🗣️ A: "Why are you happy today?" — B: "Because my family is together and we have delicious food!"',
      a: 'Because my family is together', w: ['Instead my family', 'But my shoes are wet']
    },

    // --- UNIT 3: How Much Is It? & Money (Barter, Coins vs Cards, Shop Roleplay, Past Simple) ---
    {
      unit: 3, pic: '🛒',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 3): Pupil A is the customer, Pupil B is the cashier in a toy shop!',
      frame: '🗣️ A: "Hello! How much is this toy robot?" — B: "It is twenty coins. Do you pay with cash or card?"',
      a: 'How much is this toy robot?', w: ['Who is this robot?', 'Where is the mountain?']
    },
    {
      unit: 3, pic: '🐐',
      q: '🎤 Speak & Act (Unit 3): Act out how people traded long ago before money was invented!',
      frame: '🗣️ Say: "Long ago, people had no coins or paper money. They bartered a goat for a bag of grain!"',
      a: 'bartered a goat for grain', w: ['paid with a smartphone', 'used a plastic card']
    },
    {
      unit: 3, pic: '💳',
      q: '🎤 Speak & Act (Unit 3): Show how we pay in a shop today and compare paper money to metal coins!',
      frame: '🗣️ Say: "Today we use coins, paper money, or a plastic card. Paper money is lighter than metal coins!"',
      a: 'lighter than metal coins', w: ['heavier than ten rocks', 'made of seashells']
    },
    {
      unit: 3, pic: '💎',
      q: '🎤 Speak & Act (Unit 3): Look at a price tag of 900 coins! Act shocked and use the words "expensive" and "did not buy"!',
      frame: '🗣️ Say: "Wow, this golden watch is too expensive! I did not buy it. I bought a small book instead."',
      a: 'too expensive! I did not buy it', w: ['very cheap! I ate it', 'free! I threw it away']
    },
    {
      unit: 3, pic: '🏦',
      q: '🎤 Speak & Act (Unit 3): Pretend you are putting coins into your piggy bank and tell the class what you are saving for!',
      frame: '🗣️ Say: "I save my coins in my bank every week. I want to buy a new skateboard!"',
      a: 'save my coins in my bank', w: ['drop my coins in the river', 'lose my money']
    },
    {
      unit: 3, pic: '🚶',
      q: '🎤 Speak & Act (Unit 3): Tell a 2-sentence story about going to a shop yesterday using Past Simple verbs!',
      frame: '🗣️ Say: "Yesterday I walked to the market. I saw a red hat and paid the cashier ten coins!"',
      a: 'walked to the market and paid', w: ['walk to the market tomorrow', 'walking and paying now']
    },
    {
      unit: 3, pic: '🐚',
      q: '🎤 Speak & Act (Unit 3): Tell the class what people used as money thousands of years ago!',
      frame: '🗣️ Say: "Thousands of years ago, people used shiny seashells and salt as money!"',
      a: 'used shiny seashells as money', w: ['used computers as money', 'used ice cubes as money']
    },
    {
      unit: 3, pic: '🏷️',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 3): Bargain at the market! Pupil A asks the price, Pupil B gives a discount!',
      frame: '🗣️ A: "Fifty coins is too expensive!" — B: "Okay, for you it is thirty coins today!" — A: "Thank you, I’ll take it!"',
      a: 'Fifty coins is too expensive!', w: ['Give me a volcano!', 'I am sleeping on the train!']
    },

    // --- UNIT 4: What Happened? (Mona Lisa Mystery & The Angry Mountain, Past Simple, Cause & Effect, -nd blends) ---
    {
      unit: 4, pic: '🖼️',
      q: '🎤 Speak & Act (Unit 4): Act like Peruggia in 1911! Sneak up to the wall, hide the painting, and tell what happened!',
      frame: '🗣️ Say: "In 1911, Peruggia wore a white coat. He lifted the Mona Lisa off the wall and hid it under his coat!"',
      a: 'lifted the Mona Lisa and hid it', w: ['painted a new picture today', 'sailed in a small boat']
    },
    {
      unit: 4, pic: '👮',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 4): Pupil A is the Police Detective. Pupil B is the Museum Guard!',
      frame: '🗣️ Detective: "What happened in the museum?" — Guard: "A thief stole the Mona Lisa! The wall was empty!"',
      a: 'A thief stole the Mona Lisa!', w: ['A dog ate the homework!', 'The volcano erupted in Paris!']
    },
    {
      unit: 4, pic: '🏛️',
      q: '🎤 Speak & Act (Unit 4): Tell the happy ending of the Mona Lisa story using Past Simple ("found", "arrested", "went")!',
      frame: '🗣️ Say: "The police found the painting and arrested the thief. The Mona Lisa went home to the museum!"',
      a: 'found the painting and arrested the thief', w: ['lost the painting in the sea', 'gave the thief a prize']
    },
    {
      unit: 4, pic: '🌋',
      q: '🎤 Speak & Act (Unit 4): Act out Mount Tambora waking up! Make the thunder sound and tell the Cause and Effect!',
      frame: '🗣️ Say: "The angry mountain made a loud BOOM like thunder! Hot ash fell from the sky, so the sky turned dark."',
      a: 'Ash fell, so the sky turned dark.', w: ['Snow fell, so we built a snowman.', 'It rained, so we went swimming.']
    },
    {
      unit: 4, pic: '⛵',
      q: '🎤 Speak & Act (Unit 4): Pretend you are rowing the small wooden boat away from the island! Tell what the family did!',
      frame: '🗣️ Say: "Because the volcano erupted, we ran to the beach and climbed into a small wooden boat!"',
      a: 'ran to the beach and climbed into a boat', w: ['stayed in the treehouse all week', 'walked to the museum']
    },
    {
      unit: 4, pic: '🚢',
      q: '🎤 Speak & Act (Unit 4): Wave both hands high at sunrise! Tell how the family felt when the rescue ship arrived!',
      frame: '🗣️ Say: "At sunrise we saw a big ship! We waved our hands, and we felt happy, thankful, and safe!"',
      a: 'felt happy, thankful, and safe', w: ['felt bored and sleepy', 'felt angry at the ship']
    },
    {
      unit: 4, pic: '🔤',
      q: '🎤 Speak & Act (Unit 4 · Phonics -nd): Clap on every "-nd" word and say this sentence out loud clearly!',
      frame: '🗣️ Say: "I stand on the yellow sand and feel the wind on my hand!"',
      a: 'stand on the sand in the wind', w: ['sit on a cat in a hat', 'hop on a mop in a shop']
    },
    {
      unit: 4, pic: '🔗',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 4): Pupil A says the CAUSE. Pupil B acts out and says the EFFECT!',
      frame: '🗣️ Cause (A): "A stranger walked to the door!" — Effect (B): "So the dog started to bark loudly: Woof! Woof!"',
      a: 'the dog started to bark loudly', w: ['the dog read a newspaper', 'the mountain went to sleep']
    }
  ];

  /* =========================================================================
     GRADE 4 · UNITS 1–4 SPEAKING & ACTING TOURNAMENT (32 ITEMS)
     ========================================================================= */
  var G4_SPEAK = [
    // --- UNIT 1: I Love Reading & Brain Power (Visualize, Freeze, Monarch Journey, Alice, Wh- Past) ---
    {
      unit: 1, pic: '🧠',
      q: '🎤 Speak & Act (Unit 1): Open an imaginary book, point to your head, and explain what "visualize" means!',
      frame: '🗣️ Say: "When I read a story, I visualize it! I make colourful pictures of castles and dragons in my head."',
      a: 'make pictures in my head', w: ['close my eyes and snore', 'forget all the words']
    },
    {
      unit: 1, pic: '🐇',
      q: '🎤 Speak & Act (Unit 1): Act like a white rabbit in the meadow when a fox walks by! Freeze and explain why!',
      frame: '🗣️ Say: "I am a rabbit! When I see a predator, I freeze and stay completely still so the fox cannot see me."',
      a: 'freeze and stay completely still', w: ['bark loudly at the fox', 'fly over the mountain']
    },
    {
      unit: 1, pic: '🦋',
      q: '🎤 Speak & Act (Unit 1): Spread your arms like monarch butterfly wings and tell the class about your long journey!',
      frame: '🗣️ Say: "Every autumn, monarch butterflies fly on a long journey across mountains and the sea to stay warm!"',
      a: 'fly on a long journey', w: ['swim under the cold ice', 'sleep in a rabbit hole']
    },
    {
      unit: 1, pic: '🕳️',
      q: '🎤 Speak & Act (Unit 1): Act out Alice by the river! Yawn, spot the White Rabbit, and tell what happened in Past Simple!',
      frame: '🗣️ Say: "Alice was sleepy by the river. Suddenly she saw a White Rabbit with a watch and chased it down a hole!"',
      a: 'saw a White Rabbit and chased it', w: ['cooked dinner in the kitchen', 'missed the train on the platform']
    },
    {
      unit: 1, pic: '❓',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 1): Interview about Alice in Wonderland using "Why" and "Where"!',
      frame: '🗣️ A: "Why was Alice sleepy, and where did she fall?" — B: "She was sleepy because the book had no pictures, and she fell down a deep rabbit hole!"',
      a: 'fell down a deep rabbit hole', w: ['climbed up a tall palm tree', 'rode a bus to the stadium']
    },
    {
      unit: 1, pic: '💪',
      q: '🎤 Speak & Act (Unit 1): Do three star jumps and tell the class how reading is a workout for your brain!',
      frame: '🗣️ Say: "Exercise makes my body strong, and reading is a workout for my brain! It makes me curious and creative."',
      a: 'a workout for my brain', w: ['too heavy to carry', 'a game with ten pins']
    },
    {
      unit: 1, pic: '🗝️',
      q: '🎤 Speak & Act (Unit 1): Pretend to find a tiny golden key and peek through a tiny door like curious Alice!',
      frame: '🗣️ Say: "I am curious and brave! I found a tiny key, opened the little door, and looked at the beautiful garden."',
      a: 'curious and brave', w: ['bored and angry', 'late for the bus']
    },
    {
      unit: 1, pic: '📚',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 1): Share your favourite kind of book with your partner!',
      frame: '🗣️ A: "What kind of books do you love reading?" — B: "I love reading adventure stories because I can imagine exciting places!"',
      a: 'love reading adventure stories', w: ['never open any books', 'only read train tickets']
    },

    // --- UNIT 2: What Lives Here? (Forest Rangers, Needles/Cones, Vet, so / instead of, Irregular Past) ---
    {
      unit: 2, pic: '🌲',
      q: '🎤 Speak & Act (Unit 2): Stand tall like a pine tree in the forest and explain how it is different from other trees!',
      frame: '🗣️ Say: "Pine trees grow sharp green needles instead of flat leaves, and they produce cones instead of flowers!"',
      a: 'needles instead of leaves', w: ['flowers instead of cones', 'feathers instead of bark']
    },
    {
      unit: 2, pic: '🦊',
      q: '🎤 Speak & Act (Unit 2): Wrap your arms around yourself like a winter fox and explain how forest animals stay warm!',
      frame: '🗣️ Say: "In winter the forest is freezing cold, so animals grow thick fur so they can stay warm in the snow!"',
      a: 'so they can stay warm', w: ['because they are hot', 'instead of eating food']
    },
    {
      unit: 2, pic: '🩺',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 2): Pupil A is a Forest Vet. Pupil B brings an injured swallow!',
      frame: '🗣️ A: "I am a vet! What happened to this bird?" — B: "It hurt its wing in the storm! Please help it get well."',
      a: 'a vet treats sick or injured animals', w: ['a vet drives a racing car', 'a vet sells train tickets']
    },
    {
      unit: 2, pic: '🕊️',
      q: '🎤 Speak & Act (Unit 2): Retell "The Swallow’s Gift" using irregular past verbs ("helped", "gave", "grew")!',
      frame: '🗣️ Say: "Kind Heungbu helped the little swallow’s broken leg. In spring, the swallow gave him a magic seed, and a giant gourd grew!"',
      a: 'gave him a seed and a gourd grew', w: ['took his house and ran away', 'sank in the deep ocean']
    },
    {
      unit: 2, pic: '🪺',
      q: '🎤 Speak & Act (Unit 2 · Irregular Past): Use "built", "grew", and "paid" in a 2-sentence spring story!',
      frame: '🗣️ Say: "Last spring, the birds built a cosy nest in the tree, and bright green leaves grew on every branch!"',
      a: 'built a nest and leaves grew', w: ['builded a nest and growed', 'building and growing yesterday']
    },
    {
      unit: 2, pic: '🐿️',
      q: '🎤 Speak & Act (Unit 2): Act like a busy squirrel hiding acorns before winter using "because" and "so"!',
      frame: '🗣️ Say: "Squirrels collect nuts in autumn because winter is coming, so they have plenty of food to eat!"',
      a: 'collect nuts because winter is coming', w: ['swim south across the ocean', 'sleep on the train platform']
    },
    {
      unit: 2, pic: '🦉',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 2): Ask and answer about day and night forest animals using "instead of"!',
      frame: '🗣️ A: "When do owls hunt in the forest?" — B: "Owls fly and hunt at night instead of sleeping!"',
      a: 'at night instead of sleeping', w: ['at noon instead of flying', 'underwater instead of trees']
    },
    {
      unit: 2, pic: '🎁',
      q: '🎤 Speak & Act (Unit 2): Compare kind Heungbu and greedy Nolbu from the story in 2 clear sentences!',
      frame: '🗣️ Say: "Heungbu was kind and helped the bird, so he got treasure. Nolbu was greedy and hurt the bird!"',
      a: 'Heungbu was kind and helped the bird', w: ['Nolbu was a basketball player', 'Heungbu stole the Mona Lisa']
    },

    // --- UNIT 3: It Keeps Changing (Clean Cars vs Gasoline Cars, The Bear and I / Thin Ice, but / because / so) ---
    {
      unit: 3, pic: '🚗',
      q: '🎤 Speak & Act (Unit 3): Compare gasoline cars and electric/solar cars using "but" and "because"!',
      frame: '🗣️ Say: "Gasoline cars are fast, but they are noisy and make the air dirty. Solar and electric cars are quiet and clean!"',
      a: 'fast, but noisy and dirty', w: ['quiet and clean for the air', 'pulled by polar bears']
    },
    {
      unit: 3, pic: '☀️',
      q: '🎤 Speak & Act (Unit 3): Pitch a brand-new Clean Car to the class! Tell what energy it uses to move!',
      frame: '🗣️ Say: "Look at our clean car! It uses energy from the sun instead of gasoline, so it keeps our city air clean."',
      a: 'uses energy from the sun', w: ['burns black coal and smoke', 'only drives on thin ice']
    },
    {
      unit: 3, pic: '🐻‍❄️',
      q: '🎤 Speak & Act (Unit 3): Act out the polar bear stepping carefully on the Arctic ice! Tell why the ice cracked!',
      frame: '🗣️ Say: "After many warm winters, the sea ice was very thin. Suddenly the ice cracked, and the bear was in a trap!"',
      a: 'the ice was thin and cracked', w: ['the ice was thick and strong', 'the bear was on a train']
    },
    {
      unit: 3, pic: '🧊',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 3): Pupil A asks why the Arctic is changing. Pupil B explains Cause and Effect!',
      frame: '🗣️ A: "Why is the Arctic sea ice melting?" — B: "Because the winters are getting warmer, so the thick ice turns thin!"',
      a: 'winters are getting warmer', w: ['bears are jumping too high', 'ships are painting the ice']
    },
    {
      unit: 3, pic: '🚲',
      q: '🎤 Speak & Act (Unit 3): Tell the class two things YOU can do to help the Earth and keep the air clean!',
      frame: '🗣️ Say: "I can ride my bike or walk to school because bikes do not make the air dirty, and I can turn off the lights!"',
      a: 'ride my bike because it keeps air clean', w: ['leave all the lights on all day', 'drive ten noisy gasoline trucks']
    },
    {
      unit: 3, pic: '⚡',
      q: '🎤 Speak & Act (Unit 3): Combine two ideas with "but" about clean electric cars!',
      frame: '🗣️ Say: "Electric cars are clean and quiet, but they are still expensive to buy today."',
      a: 'clean and quiet, but expensive', w: ['noisy and dirty, so cheap', 'made of paper and wood']
    },
    {
      unit: 3, pic: '🌊',
      q: '🎤 Speak & Act (Unit 3): Tell how the polar bear cub and mother bear escaped the cracking ice in "The Bear and I"!',
      frame: '🗣️ Say: "The water was cold and deep, but the mother bear swam bravely and led her cub to safe, thick ice!"',
      a: 'swam bravely to safe, thick ice', w: ['took an elevator to the top', 'called a taxi on the road']
    },
    {
      unit: 3, pic: '🌍',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 3): Pupil A asks "How does it keep changing?" Pupil B answers about weather or cars!',
      frame: '🗣️ A: "How do cars keep changing over time?" — B: "In the past cars used only gasoline, but now we build clean electric cars!"',
      a: 'now we build clean electric cars', w: ['now we ride dinosaurs to school', 'now cars have square stone wheels']
    },

    // --- UNIT 4: We Can Do It! (Team Players Basketball & Late for the Show, First/Then/Finally, because) ---
    {
      unit: 4, pic: '🏀',
      q: '🎤 Speak & Act (Unit 4): Act like a live TV basketball announcer for the final seconds of the Sparks game!',
      frame: '🗣️ Say: "The Sparks were losing by five points, but they worked together! Chelsea Gray shot a three-pointer and won the championship!"',
      a: 'shot a three-pointer and won', w: ['walked off the court and quit', 'kicked the ball into a net']
    },
    {
      unit: 4, pic: '🤝',
      q: '🎤 Speak & Act (Unit 4): High-five your teammates and explain why teamwork is the secret to winning!',
      frame: '🗣️ Say: "Five players are on the court for each team. When we pass the ball and help each other, teamwork makes the dream work!"',
      a: 'teamwork makes the dream work', w: ['one player does everything alone', 'nobody passes the basketball']
    },
    {
      unit: 4, pic: '🚗',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 4): Harry is late! Pupil A is Mr. Williams, Pupil B is Harry explaining why!',
      frame: '🗣️ Mr. Williams: "Harry, why are you late?" — Harry: "I am sorry! First, our car was stuck in traffic, and then the train stopped!"',
      a: 'stuck in traffic, and then the train stopped', w: ['slept until noon at home', 'went to the beach to swim']
    },
    {
      unit: 4, pic: '🚉',
      q: '🎤 Speak & Act (Unit 4): Act out Lynn’s brilliant idea when all the friends are stuck waiting on the train platform!',
      frame: '🗣️ Say: "Stay calm, everyone! We cannot get to the school stage on time, so why don’t we perform our show right here on the platform?"',
      a: 'perform our show on the platform', w: ['go home and cancel the play', 'cry on the train tracks']
    },
    {
      unit: 4, pic: '🌳',
      q: '🎤 Speak & Act (Unit 4): Stand like Harry in his tree costume and act out the opening of "Twelfth Night" on the platform!',
      frame: '🗣️ Say: "I am Harry, and I play the tree! In our play Twelfth Night, the ship sank in a storm, but Viola and Sebastian are alive!"',
      a: 'the ship sank, but they are alive', w: ['the train flew into space', 'the museum guard was asleep']
    },
    {
      unit: 4, pic: '🔢',
      q: '🎤 Speak & Act (Unit 4): Retell the story of "Late for the Show" using "First", "Then", and "Finally"!',
      frame: '🗣️ Say: "First, Harry’s car was in traffic. Then, the train stopped so they performed on the platform. Finally, everybody clapped!"',
      a: 'First traffic, Then platform, Finally clapped', w: ['Finally first, Then before', 'Never traffic, Always sleeping']
    },
    {
      unit: 4, pic: '😌',
      q: '🎭 Partner Roleplay (2 Pupils · Unit 4): Pupil A feels nervous before the show. Pupil B encourages them kindly!',
      frame: '🗣️ A: "Oh no, I am so nervous! It is my first time on stage!" — B: "Stay calm and don’t worry! We practiced together and we can do it!"',
      a: 'Stay calm! We can do it!', w: ['Run away and hide!', 'You will forget your lines!']
    },
    {
      unit: 4, pic: '👏',
      q: '🎤 Speak & Act (Unit 4): Take a big theatre bow with your team and tell the Problem and Solution of the story!',
      frame: '🗣️ Say: "The problem was that we were stuck on the platform. Our solution was teamwork: we performed the show there and made everyone smile!"',
      a: 'problem on the platform, solution was teamwork', w: ['no problem at all', 'cancelled the school play']
    }
  ];

  GM.sets = GM.sets || [];
  GM.sets.unshift(
    {
      id: 'speak-g4',
      title: 'Units 1–4 Speaking & Acting Tournament · Grade 4',
      grade: 4,
      skill: 'speaking',
      showInAll: true,
      e: '🎤',
      items: buildItems(G4_SPEAK, 4)
    },
    {
      id: 'speak-g3',
      title: 'Units 1–4 Speaking & Acting Tournament · Grade 3',
      grade: 3,
      skill: 'speaking',
      showInAll: true,
      e: '🎤',
      items: buildItems(G3_SPEAK, 3)
    }
  );
})(typeof window !== 'undefined' ? window : this);
