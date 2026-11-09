/* ==========================================================================
   Smart Board AI & Built-In Curriculum Engine (Zero-Setup, 100% Free)
   --------------------------------------------------------------------------
   3-Tier Architecture:
   1. Optional Direct Gemini Key (AIza... or the newer AQ. keys) or Supabase Edge Function (if set)
   2. Free Keyless Cloud AI (Pollinations OpenAI-compatible JSON / Image + MyMemory)
   3. 100% Offline Built-In Grade 3 & 4 ESL Curriculum & Dictionary Engine
   ========================================================================== */
(function (root) {
  'use strict';

  const PIN_KEY = 'smartboard.pin';
  let pin = '';
  try { pin = root.localStorage.getItem(PIN_KEY) || ''; } catch (e) { pin = ''; }

  function endpoint() {
    const c = root.SUPABASE_CONFIG || {};
    return c.url ? c.url.replace(/\/$/, '') + '/functions/v1/smartboard-ai' : '';
  }
  function headers(extra) {
    const c = root.SUPABASE_CONFIG || {}, h = {};
    if (c.anonKey) h.apikey = c.anonKey;
    if (pin && !isGeminiKey(pin)) h['x-board-pin'] = pin;
    return Object.assign(h, extra || {});
  }
  // Google AI Studio keys: the older AIza… keys and the newer AQ.… keys. The key is typed on the board and kept only on that device.
  function isGeminiKey(k) { return /^(AIza[0-9A-Za-z_-]{20,}|AQ\.[0-9A-Za-z_.-]{20,})$/.test(String(k || '').trim()); }
  // Tried in order: when one model is busy or retired, the next one answers (checked 8 Nov 2026)
  const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-flash-latest'];
  // Said before every request: the class is 8–10-year-old beginners
  const SAFE_RULES = 'You help an English teacher on a classroom smartboard in Turkey. The pupils are 8 to 10 years old, ' +
    'beginners (CEFR A1). Use short, simple, friendly English. Everything must be safe for young children: nothing scary, ' +
    'violent, rude, romantic or sad, no brands, no real people, no personal questions about the pupils. ' +
    'If a request is not suitable for a children\'s classroom, answer with a kind, simple, safe alternative. Always return only the JSON asked for.';
  let geminiInfo = { model: '', error: '' };
  // This week's lesson words (from the lesson chosen on the board), used where they fit
  async function lessonWordsLine() {
    try {
      const L = root.SmartLessons;
      if (!L || !L.current) return '';
      const c = await Promise.race([L.current(), new Promise((ok) => setTimeout(() => ok(null), 800))]);
      const w = c && c.words && c.words.length ? c.words.slice(0, 20) : [];
      return w.length ? ' This week the class is learning these words; use some of them where they fit naturally: ' + w.join(', ') + '.' : '';
    } catch (e) { return ''; }
  }

  /* ------------------------------------------------------------------
     1. BUILT-IN GRADE 3 & 4 ESL CURRICULUM LEXICON (EN <-> TR)
     Format: word: [syllables, partOfSpeech, sentence, turkish, emoji, category]
     ------------------------------------------------------------------ */
  const LEXICON = {
    // Animals
    cat: ['cat', 'noun', 'The cat sleeps on the warm mat.', 'kedi', '🐱', 'animals'],
    dog: ['dog', 'noun', 'My friendly dog likes to run and play.', 'köpek', '🐶', 'animals'],
    bird: ['bird', 'noun', 'The little bird sings in the green tree.', 'kuş', '🐦', 'animals'],
    fish: ['fish', 'noun', 'The orange fish can swim very fast.', 'balık', '🐟', 'animals'],
    lion: ['li·on', 'noun', 'The lion is the king of the jungle.', 'aslan', '🦁', 'animals'],
    tiger: ['ti·ger', 'noun', 'A tiger has orange fur and black stripes.', 'kaplan', '🐯', 'animals'],
    elephant: ['el·e·phant', 'noun', 'An elephant has big ears and a long trunk.', 'fil', '🐘', 'animals'],
    monkey: ['mon·key', 'noun', 'The funny monkey climbs the tall tree.', 'maymun', '🐒', 'animals'],
    giraffe: ['gi·raffe', 'noun', 'A giraffe has a very long neck.', 'zürafa', '🦒', 'animals'],
    zebra: ['ze·bra', 'noun', 'A zebra has black and white stripes.', 'zebra', '🦓', 'animals'],
    bear: ['bear', 'noun', 'Thebig brown bear loves sweet honey.', 'ayı', '🐻', 'animals'],
    rabbit: ['rab·bit', 'noun', 'The white rabbit hops in the garden.', 'tavşan', '🐰', 'animals'],
    horse: ['horse', 'noun', 'The horse runs fast across the green field.', 'at', '🐴', 'animals'],
    cow: ['cow', 'noun', 'The cow lives on the farm and gives us milk.', 'inek', '🐮', 'animals'],
    sheep: ['sheep', 'noun', 'The soft white sheep eats green grass.', 'koyun', '🐑', 'animals'],
    goat: ['goat', 'noun', 'The mountain goat climbs the rocky hill.', 'keçi', '🐐', 'animals'],
    chicken: ['chick·en', 'noun', 'The farm chicken lays fresh eggs every day.', 'tavuk', '🐔', 'animals'],
    duck: ['duck', 'noun', 'The yellow duck swims on the blue pond.', 'ördek', '🦆', 'animals'],
    frog: ['frog', 'noun', 'The green frog can jump very high.', 'kurbağa', '🐸', 'animals'],
    turtle: ['tur·tle', 'noun', 'A turtle walks slowly with its hard shell.', 'kaplumbağa', '🐢', 'animals'],
    snake: ['snake', 'noun', 'The long snake slides through the grass.', 'yılan', '🐍', 'animals'],
    crocodile: ['croc·o·dile', 'noun', 'The green crocodile swims in the river.', 'timsah', '🐊', 'animals'],
    dolphin: ['dol·phin', 'noun', 'The clever dolphin jumps out of the sea.', 'yunus', '🐬', 'animals'],
    whale: ['whale', 'noun', 'The blue whale is the biggest animal in the sea.', 'balina', '🐋', 'animals'],
    shark: ['shark', 'noun', 'A shark has sharp teeth and swims in the ocean.', 'köpekbalığı', '🦈', 'animals'],
    octopus: ['oc·to·pus', 'noun', 'An octopus has eight long arms in the sea.', 'ahtapot', '🐙', 'animals'],
    penguin: ['pen·guin', 'noun', 'A penguin is a bird that loves the snow and ice.', 'penguen', '🐧', 'animals'],
    parrot: ['par·rot', 'noun', 'The colourful parrot sits on the pirate ship.', 'papağan', '🦜', 'animals'],
    owl: ['owl', 'noun', 'The wise owl wakes up at night.', 'baykuş', '🦉', 'animals'],
    bee: ['bee', 'noun', 'The busy bee makes sweet golden honey.', 'arı', '🐝', 'animals'],
    butterfly: ['but·ter·fly', 'noun', 'A colourful butterfly flies over the flowers.', 'kelebek', '🦋', 'animals'],
    spider: ['spi·der', 'noun', 'A spider has eight legs and spins a web.', 'örümcek', '🕷️', 'animals'],
    ant: ['ant', 'noun', 'The tiny ant carries food to its hill.', 'karınca', '🐜', 'animals'],
    mouse: ['mouse', 'noun', 'The little grey mouse likes yellow cheese.', 'fare', '🐭', 'animals'],

    // School & Classroom
    school: ['school', 'noun', 'We learn English and play with friends at school.', 'okul', '🏫', 'school'],
    classroom: ['class·room', 'noun', 'Our classroom is bright, clean and happy.', 'sınıf', '🏫', 'school'],
    teacher: ['teach·er', 'noun', 'Our teacher helps us read and speak English.', 'öğretmen', '👩‍🏫', 'school'],
    student: ['stu·dent', 'noun', 'Every student listens carefully in class.', 'öğrenci', '🧑‍🎓', 'school'],
    book: ['book', 'noun', 'I open my book and read a fun story.', 'kitap', '📖', 'school'],
    notebook: ['note·book', 'noun', 'Write the new words in your notebook.', 'defter', '📓', 'school'],
    pencil: ['pen·cil', 'noun', 'I draw a picture with my sharp pencil.', 'kurşun kalem', '✏️', 'school'],
    pen: ['pen', 'noun', 'The teacher writes on the page with a blue pen.', 'tükenmez kalem', '🖊️', 'school'],
    eraser: ['e·ras·er', 'noun', 'Use an eraser to fix a mistake.', 'silgi', '🧽', 'school'],
    ruler: ['rul·er', 'noun', 'I draw a straight line with my ruler.', 'cetvel', '📏', 'school'],
    scissors: ['scis·sors', 'noun', 'Cut the paper carefully with the scissors.', 'makas', '✂️', 'school'],
    glue: ['glue', 'noun', 'Stick the picture into your notebook with glue.', 'yapıştırıcı', '🧴', 'school'],
    crayon: ['cray·on', 'noun', 'She colours the rainbow with a red crayon.', 'boya kalemi', '🖍️', 'school'],
    bag: ['bag', 'noun', 'I put my books inside my school bag.', 'çanta', '🎒', 'school'],
    desk: ['desk', 'noun', 'My book and pencil case are on my desk.', 'sıra / çalışma masası', '🪑', 'school'],
    chair: ['chair', 'noun', 'Please sit down quietly on your chair.', 'sandalye', '🪑', 'school'],
    board: ['board', 'noun', 'Look at the smart board and read the word.', 'tahta', '🖥️', 'school'],
    window: ['win·dow', 'noun', 'May I open the classroom window, please?', 'pencere', '🪟', 'school'],
    door: ['door', 'noun', 'Please close the door quietly.', 'kapı', '🚪', 'school'],
    map: ['map', 'noun', 'We look at the treasure map on the wall.', 'harita', '🗺️', 'school'],
    globe: ['globe', 'noun', 'We find Türkiye on the round globe.', 'küre', '🌍', 'school'],
    clock: ['clock', 'noun', 'The clock on the wall shows nine o’clock.', 'duvar saati', '🕰️', 'school'],
    computer: ['com·put·er', 'noun', 'We play English learning games on the computer.', 'bilgisayar', '💻', 'school'],
    science: ['sci·ence', 'noun', 'We do fun experiments in our science lesson.', 'fen bilimleri', '🔬', 'school'],
    math: ['math', 'noun', 'We count numbers in our math lesson.', 'matematik', '🔢', 'school'],
    music: ['mu·sic', 'noun', 'We sing happy songs in our music class.', 'müzik', '🎵', 'school'],
    art: ['art', 'noun', 'We paint colourful pictures in art class.', 'görsel sanatlar / resim', '🎨', 'school'],
    english: ['Eng·lish', 'noun', 'Speaking English with my friends is fun!', 'İngilizce', '🇬🇧', 'school'],
    turkish: ['Turk·ish', 'noun', 'We read stories in our Turkish lesson.', 'Türkçe', '🇹🇷', 'school'],

    // Food & Drinks
    apple: ['ap·ple', 'noun', 'I eat a crunchy red apple every day.', 'elma', '🍎', 'food'],
    banana: ['ba·nan·a', 'noun', 'Monkeys love to eat sweet yellow bananas.', 'muz', '🍌', 'food'],
    orange: ['or·ange', 'noun', 'An orange is round, juicy and full of vitamins.', 'portakal', '🍊', 'food'],
    strawberry: ['straw·ber·ry', 'noun', 'The red strawberry is sweet and delicious.', 'çilek', '🍓', 'food'],
    watermelon: ['wa·ter·mel·on', 'noun', 'Cold watermelon is great on a hot summer day.', 'karpuz', '🍉', 'food'],
    grape: ['grape', 'noun', 'I have a bunch of sweet purple grapes.', 'üzüm', '🍇', 'food'],
    pear: ['pear', 'noun', 'The green pear is soft and sweet.', 'armut', '🍐', 'food'],
    peach: ['peach', 'noun', 'She eats a soft, juicy peach for a snack.', 'şeftali', '🍑', 'food'],
    cherry: ['cher·ry', 'noun', 'Two red cherries sit on top of the cake.', 'kiraz', '🍒', 'food'],
    lemon: ['lem·on', 'noun', 'A yellow lemon tastes very sour.', 'limon', '🍋', 'food'],
    tomato: ['to·ma·to', 'noun', 'We put red tomatoes in the fresh salad.', 'domates', '🍅', 'food'],
    potato: ['po·ta·to', 'noun', 'My mum bakes hot potatoes for dinner.', 'patates', '🥔', 'food'],
    carrot: ['car·rot', 'noun', 'Rabbits love to crunch orange carrots.', 'havuç', '🥕', 'food'],
    bread: ['bread', 'noun', 'We buy warm fresh bread from the bakery.', 'ekmek', '🍞', 'food'],
    cheese: ['cheese', 'noun', 'I eat white cheese and olives for breakfast.', 'peynir', '🧀', 'food'],
    egg: ['egg', 'noun', 'I eat a boiled egg every morning.', 'yumurta', '🥚', 'food'],
    milk: ['milk', 'noun', 'Drink a glass of warm milk before bed.', 'süt', '🥛', 'food'],
    water: ['wa·ter', 'noun', 'I drink clean water when I am thirsty.', 'su', '💧', 'food'],
    juice: ['juice', 'noun', 'Would you like a glass of fresh orange juice?', 'meyve suyu', '🧃', 'food'],
    tea: ['tea', 'noun', 'My family drinks warm Turkish tea at breakfast.', 'çay', '🍵', 'food'],
    soup: ['soup', 'noun', 'Hot soup feels great on a cold winter day.', 'çorba', '🥣', 'food'],
    pizza: ['piz·za', 'noun', 'We share a warm cheese pizza on Friday.', 'pizza', '🍕', 'food'],
    sandwich: ['sand·wich', 'noun', 'I have a cheese sandwich in my lunchbox.', 'sandviç', '🥪', 'food'],
    cake: ['cake', 'noun', 'We eat chocolate cake at the birthday party.', 'pasta / kek', '🎂', 'food'],
    cookie: ['cook·ie', 'noun', 'May I have a chocolate chip cookie, please?', 'kurabiye', '🍪', 'food'],
    icecream: ['ice cream', 'noun', 'I love cold vanilla ice cream in summer.', 'dondurma', '🍦', 'food'],
    honey: ['hon·ey', 'noun', 'Bees make sweet golden honey from flowers.', 'bal', '🍯', 'food'],

    // Family & People
    family: ['fam·i·ly', 'noun', 'I love my happy family very much.', 'aile', '👨‍👩‍👧‍👦', 'family'],
    mother: ['moth·er', 'noun', 'My mother reads me a story every night.', 'anne', '👩', 'family'],
    mum: ['mum', 'noun', 'My mum makes delicious soup for us.', 'anne', '👩', 'family'],
    father: ['fa·ther', 'noun', 'My father plays football with me in the park.', 'baba', '👨', 'family'],
    dad: ['dad', 'noun', 'My dad rides a bicycle with me on Sunday.', 'baba', '👨', 'family'],
    sister: ['sis·ter', 'noun', 'My sister helps me with my homework.', 'kız kardeş / abla', '👧', 'family'],
    brother: ['broth·er', 'noun', 'My brother and I build a tall tower.', 'erkek kardeş / abi', '👦', 'family'],
    baby: ['ba·by', 'noun', 'The little baby smiles and claps her hands.', 'bebek', '👶', 'family'],
    grandmother: ['grand·moth·er', 'noun', 'My grandmother tells wonderful stories.', 'büyükanne / nine', '👵', 'family'],
    grandfather: ['grand·fa·ther', 'noun', 'My grandfather grows tomatoes in his garden.', 'büyükbaba / dede', '👴', 'family'],
    friend: ['friend', 'noun', 'A good friend shares and plays kindly.', 'arkadaş', '🤝', 'family'],
    boy: ['boy', 'noun', 'The boy kicks the football across the field.', 'erkek çocuk', '👦', 'family'],
    girl: ['girl', 'noun', 'The girl rides her red scooter in the park.', 'kız çocuk', '👧', 'family'],
    doctor: ['doc·tor', 'noun', 'A doctor helps sick people feel better.', 'doktor', '🩺', 'family'],
    firefighter: ['fire·fight·er', 'noun', 'The brave firefighter drives a big red truck.', 'itfaiyeci', '🧑‍🚒', 'family'],
    pilot: ['pi·lot', 'noun', 'The pilot flies the airplane high in the sky.', 'pilot', '🧑‍✈️', 'family'],
    chef: ['chef', 'noun', 'The chef cooks tasty food in the kitchen.', 'aşçı', '👩‍🍳', 'family'],
    astronaut: ['as·tro·naut', 'noun', 'An astronaut travels into space in a rocket.', 'astronot', '🧑‍🚀', 'family'],
    pirate: ['pi·rate', 'noun', 'The friendly pirate looks for the treasure chest.', 'korsan', '🏴‍☠️', 'pirates'],
    captain: ['cap·tain', 'noun', 'The captain steers the big wooden ship.', 'kaptan', '⚓', 'pirates'],

    // Body Parts
    head: ['head', 'noun', 'Put your warm hat on your head.', 'baş / kafa', '🗣️', 'body'],
    eye: ['eye', 'noun', 'I see the colourful rainbow with my eyes.', 'göz', '👁️', 'body'],
    ear: ['ear', 'noun', 'I listen to the music with my ears.', 'kulak', '👂', 'body'],
    nose: ['nose', 'noun', 'I smell the sweet flowers with my nose.', 'burun', '👃', 'body'],
    mouth: ['mouth', 'noun', 'Open your mouth and sing the song!', 'ağız', '👄', 'body'],
    tooth: ['tooth', 'noun', 'I brush my teeth every morning and night.', 'diş', '🦷', 'body'],
    teeth: ['teeth', 'noun', 'Brush your teeth to keep them bright and clean.', 'dişler', '🦷', 'body'],
    hand: ['hand', 'noun', 'Raise your hand before you speak in class.', 'el', '✋', 'body'],
    finger: ['fin·ger', 'noun', 'I can count to ten on my fingers.', 'parmak', '☝️', 'body'],
    arm: ['arm', 'noun', 'Stretch your arms up high to the sky.', 'kol', '💪', 'body'],
    leg: ['leg', 'noun', 'A frog has strong legs for jumping.', 'bacak', '🦵', 'body'],
    foot: ['foot', 'noun', 'He kicks the ball with his right foot.', 'ayak', '🦶', 'body'],
    feet: ['feet', 'noun', 'Stamp your feet and clap your hands!', 'ayaklar', '🦶', 'body'],
    hair: ['hair', 'noun', 'She brushes her long brown hair.', 'saç', '💇', 'body'],
    heart: ['heart', 'noun', 'My heart beats fast when I run.', 'kalp', '❤️', 'body'],

    // Weather, Nature & Space
    sun: ['sun', 'noun', 'The bright yellow sun shines in the sky.', 'güneş', '☀️', 'weather'],
    sunny: ['sun·ny', 'adjective', 'It is a warm and sunny day today.', 'güneşli', '☀️', 'weather'],
    rain: ['rain', 'noun', 'Take your umbrella because of the rain.', 'yağmur', '🌧️', 'weather'],
    rainy: ['rain·y', 'adjective', 'I wear my yellow raincoat on a rainy day.', 'yağmurlu', '🌧️', 'weather'],
    snow: ['snow', 'noun', 'We build a funny snowman in the white snow.', 'kar', '❄️', 'weather'],
    snowy: ['snow·y', 'adjective', 'Put on your gloves on a cold snowy morning.', 'karlı', '❄️', 'weather'],
    cloud: ['cloud', 'noun', 'A fluffy white cloud floats across the sky.', 'bulut', '☁️', 'weather'],
    cloudy: ['cloud·y', 'adjective', 'The sky is grey and cloudy today.', 'bulutlu', '☁️', 'weather'],
    wind: ['wind', 'noun', 'The wind blows the colourful kites high.', 'rüzgâr', '💨', 'weather'],
    windy: ['wind·y', 'adjective', 'We can fly our kite on a windy afternoon.', 'rüzgârlı', '💨', 'weather'],
    rainbow: ['rain·bow', 'noun', 'A seven-colour rainbow appears after the rain.', 'gökkuşağı', '🌈', 'weather'],
    sky: ['sky', 'noun', 'Birds and airplanes fly high in the blue sky.', 'gökyüzü', '🌤️', 'weather'],
    star: ['star', 'noun', 'Bright stars twinkle in the night sky.', 'yıldız', '⭐', 'weather'],
    moon: ['moon', 'noun', 'The silver moon shines at night.', 'ay', '🌙', 'weather'],
    earth: ['earth', 'noun', 'Planet Earth is our beautiful blue and green home.', 'dünya / yeryüzü', '🌍', 'weather'],
    tree: ['tree', 'noun', 'A tall green tree gives us cool shade.', 'ağaç', '🌳', 'weather'],
    flower: ['flow·er', 'noun', 'A red flower blooms in the spring garden.', 'çiçek', '🌸', 'weather'],
    forest: ['for·est', 'noun', 'Many birds and squirrels live in the forest.', 'orman', '🌲', 'weather'],
    mountain: ['moun·tain', 'noun', 'The high mountain has white snow on top.', 'dağ', '⛰️', 'weather'],
    river: ['riv·er', 'noun', 'Cool water flows down the long river.', 'nehir / ırmak', '🏞️', 'weather'],
    sea: ['sea', 'noun', 'We swim in the blue sea in summer.', 'deniz', '🌊', 'weather'],
    island: ['is·land', 'noun', 'We sail our ship to the secret treasure island.', 'ada', '🏝️', 'pirates'],
    beach: ['beach', 'noun', 'We build a big sandcastle on the beach.', 'plaj / kumsal', '🏖️', 'weather'],

    // Treasure Island & Adventure
    treasure: ['trea·sure', 'noun', 'The golden treasure is hidden on the island.', 'hazine', '👑', 'pirates'],
    chest: ['chest', 'noun', 'Unlock the wooden chest to find the gold coins.', 'sandık', '🧰', 'pirates'],
    ship: ['ship', 'noun', 'The tall sailing ship crosses the blue ocean.', 'gemi', '⛵', 'pirates'],
    boat: ['boat', 'noun', 'We row the little wooden boat to the harbour.', 'tekne / kayık', '🚣', 'pirates'],
    compass: ['com·pass', 'noun', 'A compass always points north to guide us.', 'pusula', '🧭', 'pirates'],
    telescope: ['tel·e·scope', 'noun', 'Look through the telescope to spot the island!', 'teleskop / dürbün', '🔭', 'pirates'],
    anchor: ['an·chor', 'noun', 'Drop the heavy anchor in the harbour.', 'çapa', '⚓', 'pirates'],
    harbour: ['har·bour', 'noun', 'The ships are safe inside the quiet harbour.', 'liman', '⚓', 'pirates'],
    flag: ['flag', 'noun', 'We wave our red and white Turkish flag proudly.', 'bayrak', '🇹🇷', 'school'],
    key: ['key', 'noun', 'Use the golden key to open the locked box.', 'anahtar', '🔑', 'pirates'],
    coin: ['coin', 'noun', 'There are fifty shiny gold coins in the chest.', 'madeni para / altın', '🪙', 'pirates'],

    // House, Town & Transport
    house: ['house', 'noun', 'Our house has a red roof and a green garden.', 'ev', '🏠', 'house'],
    home: ['home', 'noun', 'I go home after school at three o’clock.', 'ev / yuva', '🏡', 'house'],
    kitchen: ['kitch·en', 'noun', 'My dad cooks dinner in the kitchen.', 'mutfak', '🍳', 'house'],
    bedroom: ['bed·room', 'noun', 'I sleep in my cosy bedroom at night.', 'yatak odası', '🛏️', 'house'],
    bathroom: ['bath·room', 'noun', 'I wash my hands with soap in the bathroom.', 'banyo', '🛁', 'house'],
    garden: ['gar·den', 'noun', 'We water the flowers in the sunny garden.', 'bahçe', '🌻', 'house'],
    park: ['park', 'noun', 'Children play on the swings in the green park.', 'park', '🏞️', 'house'],
    library: ['li·brar·y', 'noun', 'We read quiet storybooks in the school library.', 'kütüphane', '📚', 'school'],
    hospital: ['hos·pi·tal', 'noun', 'Doctors and nurses work at the hospital.', 'hastane', '🏥', 'house'],
    car: ['car', 'noun', 'My family travels to Bursa in a blue car.', 'araba', '🚗', 'transport'],
    bus: ['bus', 'noun', 'The yellow school bus stops at the corner.', 'otobüs', '🚌', 'transport'],
    train: ['train', 'noun', 'The fast train travels along the railway tracks.', 'tren', '🚆', 'transport'],
    bicycle: ['bi·cy·cle', 'noun', 'I wear my helmet when I ride my bicycle.', 'bisiklet', '🚲', 'transport'],
    bike: ['bike', 'noun', 'He rides his green bike in the park.', 'bisiklet', '🚲', 'transport'],
    plane: ['plane', 'noun', 'The big white plane flies above the clouds.', 'uçak', '✈️', 'transport'],
    airplane: ['air·plane', 'noun', 'An airplane has two strong wings.', 'uçak', '✈️', 'transport'],
    helicopter: ['hel·i·cop·ter', 'noun', 'The rescue helicopter lands on the roof.', 'helikopter', '🚁', 'transport'],
    rocket: ['rock·et', 'noun', 'The space rocket blasts off to the moon!', 'roket', '🚀', 'transport'],

    // Clothes
    hat: ['hat', 'noun', 'Wear a sun hat when you play outside.', 'şapka', '👒', 'clothes'],
    coat: ['coat', 'noun', 'Button up your warm coat in winter.', 'mont / palto', '🧥', 'clothes'],
    jacket: ['jack·et', 'noun', 'I zip up my blue jacket before going out.', 'ceket', '🧥', 'clothes'],
    shirt: ['shirt', 'noun', 'He wears a clean white shirt to school.', 'gömlek', '👔', 'clothes'],
    tshirt: ['T-shirt', 'noun', 'I wear a comfortable green T-shirt in summer.', 'tişört', '👕', 'clothes'],
    dress: ['dress', 'noun', 'She wears a yellow dress with flowers.', 'elbise', '👗', 'clothes'],
    shoes: ['shoes', 'noun', 'Tie your running shoes before sports class.', 'ayakkabı', '👟', 'clothes'],
    boots: ['boots', 'noun', 'Red rain boots keep my feet dry.', 'bot / çizme', '🥾', 'clothes'],
    socks: ['socks', 'noun', 'I put on warm woollen socks.', 'çorap', '🧦', 'clothes'],
    gloves: ['gloves', 'noun', 'Wear your gloves when you play in the snow.', 'eldiven', '🧤', 'clothes'],
    scarf: ['scarf', 'noun', 'Wrap a soft scarf around your neck.', 'atkı', '🧣', 'clothes'],
    glasses: ['glass·es', 'noun', 'The clever owl wears round reading glasses.', 'gözlük', '👓', 'clothes'],
    umbrella: ['um·brel·la', 'noun', 'Open your colourful umbrella in the rain.', 'şemsiye', '☂️', 'clothes'],

    // Action Verbs
    run: ['run', 'verb', 'I can run very fast in the schoolyard.', 'koşmak', '🏃', 'verbs'],
    walk: ['walk', 'verb', 'We walk to school together every morning.', 'yürümek', '🚶', 'verbs'],
    jump: ['jump', 'verb', 'Kangaroos and frogs can jump very high.', 'zıplamak', '🦘', 'verbs'],
    swim: ['swim', 'verb', 'Dolphins and fish can swim in the sea.', 'yüzmek', '🏊', 'verbs'],
    fly: ['fly', 'verb', 'Birds and butterflies can fly in the sky.', 'uçmak', '🦅', 'verbs'],
    climb: ['climb', 'verb', 'Monkeys can climb tall trees easily.', 'tırmanmak', '🧗', 'verbs'],
    dance: ['dance', 'verb', 'We love to dance to happy music.', 'dans etmek', '💃', 'verbs'],
    sing: ['sing', 'verb', 'Let’s sing our favourite English song together!', 'şarkı söylemek', '🎤', 'verbs'],
    read: ['read', 'verb', 'I read an adventure book every evening.', 'okumak', '📖', 'verbs'],
    write: ['write', 'verb', 'Write your name neatly at the top of the page.', 'yazmak', '✍️', 'verbs'],
    draw: ['draw', 'verb', 'Can you draw a picture of a friendly dragon?', 'çizmek', '🎨', 'verbs'],
    paint: ['paint', 'verb', 'We paint a bright rainbow with watercolours.', 'boyamak', '🖌️', 'verbs'],
    listen: ['lis·ten', 'verb', 'Listen carefully to the teacher’s story.', 'dinlemek', '👂', 'verbs'],
    speak: ['speak', 'verb', 'We speak English in our classroom.', 'konuşmak', '🗣️', 'verbs'],
    look: ['look', 'verb', 'Look at the big picture on the smart board.', 'bakmak', '👀', 'verbs'],
    open: ['o·pen', 'verb', 'Open your books to page ten, please.', 'açmak', '📂', 'verbs'],
    close: ['close', 'verb', 'Please close the window when it is cold.', 'kapatmak', '🚪', 'verbs'],
    eat: ['eat', 'verb', 'We eat healthy fruit and vegetables every day.', 'yemek yemek', '🍽️', 'verbs'],
    drink: ['drink', 'verb', 'Drink plenty of water after you play sports.', 'içmek', '🥤', 'verbs'],
    sleep: ['sleep', 'verb', 'I sleep for nine hours every night.', 'uyumak', '😴', 'verbs'],
    play: ['play', 'verb', 'We play hide-and-seek in the garden.', 'oynamak', '⚽', 'verbs'],
    help: ['help', 'verb', 'I always help my friends in the classroom.', 'yardım etmek', '🤝', 'verbs'],
    count: ['count', 'verb', 'Can you count from one to fifty in English?', 'saymak', '🔢', 'verbs'],
    smile: ['smile', 'verb', 'Smile brightly for the class photo!', 'gülümsemek', '😊', 'verbs'],

    // Adjectives & Colours & Feelings
    happy: ['hap·py', 'adjective', 'We are very happy in our English lesson today!', 'mutlu', '😊', 'feelings'],
    sad: ['sad', 'adjective', 'Don’t be sad; we can play together.', 'üzgün', '😢', 'feelings'],
    tired: ['tired', 'adjective', 'He feels tired after the long football match.', 'yorgun', '🥱', 'feelings'],
    hungry: ['hun·gry', 'adjective', 'I am hungry, so I eat a healthy apple.', 'aç', '🍎', 'feelings'],
    thirsty: ['thirs·ty', 'adjective', 'She is thirsty and drinks a glass of water.', 'susamış', '💧', 'feelings'],
    excited: ['ex·cit·ed', 'adjective', 'The children are excited for the treasure hunt!', 'heyecanlı', '🤩', 'feelings'],
    brave: ['brave', 'adjective', 'The brave captain sails across the stormy sea.', 'cesur', '🦁', 'feelings'],
    kind: ['kind', 'adjective', 'Be kind and helpful to everyone in class.', 'nazik / iyi kalpli', '💛', 'feelings'],
    clever: ['clev·er', 'adjective', 'The clever student solved the puzzle quickly.', 'zeki / akıllı', '🦉', 'feelings'],
    big: ['big', 'adjective', 'An elephant is a very big animal.', 'büyük', '🐘', 'adjectives'],
    small: ['small', 'adjective', 'An ant is a very small insect.', 'küçük', '🐜', 'adjectives'],
    tall: ['tall', 'adjective', 'A giraffe is tall enough to reach the top leaves.', 'uzun boylu', '🦒', 'adjectives'],
    short: ['short', 'adjective', 'The little penguin has short legs.', 'kısa', '🐧', 'adjectives'],
    fast: ['fast', 'adjective', 'A cheetah can run super fast.', 'hızlı', '⚡', 'adjectives'],
    slow: ['slow', 'adjective', 'The garden snail moves very slow.', 'yavaş', '🐌', 'adjectives'],
    hot: ['hot', 'adjective', 'The summer sun is very hot today.', 'sıcak', '☀️', 'adjectives'],
    cold: ['cold', 'adjective', 'Ice and winter snow are very cold.', 'soğuk', '🧊', 'adjectives'],
    new: ['new', 'adjective', 'I have a shiny new pencil case for school.', 'yeni', '✨', 'adjectives'],
    old: ['old', 'adjective', 'The pirate found an old wooden treasure chest.', 'eski / yaşlı', '📜', 'adjectives'],
    good: ['good', 'adjective', 'Reading books every day is a good habit.', 'iyi / güzel', '👍', 'adjectives'],
    red: ['red', 'adjective', 'Strawberries and fire trucks are bright red.', 'kırmızı', '🔴', 'colours'],
    blue: ['blue', 'adjective', 'The summer sky and the sea are blue.', 'mavi', '🔵', 'colours'],
    yellow: ['yel·low', 'adjective', 'Lemons and sunflowers are bright yellow.', 'sarı', '🟡', 'colours'],
    green: ['green', 'adjective', 'Frogs and tree leaves are green.', 'yeşil', '🟢', 'colours'],
    orange_col: ['or·ange', 'adjective', 'Carrots and pumpkins are orange.', 'turuncu', '🟠', 'colours'],
    purple: ['pur·ple', 'adjective', 'Grapes and violets are purple.', 'mor', '🟣', 'colours'],
    pink: ['pink', 'adjective', 'A flamingo has bright pink feathers.', 'pembe', '🩷', 'colours'],
    black: ['black', 'adjective', 'The night sky is dark black.', 'siyah', '⚫', 'colours'],
    white: ['white', 'adjective', 'Fresh snow and clouds are white.', 'beyaz', '⚪', 'colours'],
    brown: ['brown', 'adjective', 'Chocolate and tree trunks are brown.', 'kahverengi', '🟤', 'colours'],

    // Months & Days & Numbers
    january: ['Jan·u·ar·y', 'noun', 'January is the first month of the year.', 'Ocak', '❄️', 'months'],
    february: ['Feb·ru·ar·y', 'noun', 'February is the shortest month of the year.', 'Şubat', '⛄', 'months'],
    march: ['March', 'noun', 'Spring begins in the month of March.', 'Mart', '🌱', 'months'],
    april: ['A·pril', 'noun', 'We celebrate National Sovereignty and Children’s Day on 23 April!', 'Nisan', '🎈', 'months'],
    may: ['May', 'noun', 'We celebrate Youth and Sports Day on 19 May.', 'Mayıs', '🌸', 'months'],
    june: ['June', 'noun', 'Summer holidays start in June.', 'Haziran', '☀️', 'months'],
    july: ['Ju·ly', 'noun', 'July is a warm and sunny summer month.', 'Temmuz', '🏖️', 'months'],
    august: ['Au·gust', 'noun', 'We celebrate Victory Day on 30 August.', 'Ağustos', '🍉', 'months'],
    september: ['Sep·tem·ber', 'noun', 'We go back to school in September.', 'Eylül', '🎒', 'months'],
    october: ['Oc·to·ber', 'noun', 'We celebrate Republic Day on 29 October!', 'Ekim', '🇹🇷', 'months'],
    november: ['No·vem·ber', 'noun', 'Autumn leaves fall in November.', 'Kasım', '🍂', 'months'],
    december: ['De·cem·ber', 'noun', 'December is the last month of the year.', 'Aralık', '❄️', 'months'],
    monday: ['Mon·day', 'noun', 'Monday is the first school day of the week.', 'Pazartesi', '📅', 'days'],
    tuesday: ['Tues·day', 'noun', 'We have English class on Tuesday.', 'Salı', '📅', 'days'],
    wednesday: ['Wednes·day', 'noun', 'Wednesday is in the middle of the school week.', 'Çarşamba', '📅', 'days'],
    thursday: ['Thurs·day', 'noun', 'We play team games on Thursday.', 'Perşembe', '📅', 'days'],
    friday: ['Fri·day', 'noun', 'Friday is the last school day before the weekend.', 'Cuma', '📅', 'days'],
    saturday: ['Sat·ur·day', 'noun', 'I play in the park with my family on Saturday.', 'Cumartesi', '🎉', 'days'],
    sunday: ['Sun·day', 'noun', 'We have a big family breakfast on Sunday.', 'Pazar', '☀️', 'days'],
    ten: ['ten', 'noun', 'I have ten fingers on my two hands.', 'on (10)', '🔟', 'numbers'],
    twenty: ['twen·ty', 'noun', 'There are twenty students in our classroom.', 'yirmi (20)', '🔢', 'numbers'],
    thirty: ['thir·ty', 'noun', 'September and April have thirty days.', 'otuz (30)', '🔢', 'numbers'],
    forty: ['for·ty', 'noun', 'Thirty plus ten makes forty.', 'kırk (40)', '🔢', 'numbers'],
    fifty: ['fif·ty', 'noun', 'The pirate counted fifty gold coins.', 'elli (50)', '🔢', 'numbers'],
    hundred: ['hun·dred', 'noun', 'Ten times ten is one hundred!', 'yüz (100)', '💯', 'numbers'],
    ball: ['ball', 'noun', 'Kick the round ball to your teammate!', 'top', '⚽', 'toys'],
    kite: ['kite', 'noun', 'My colourful kite flies high in the wind.', 'uçurtma', '🪁', 'toys'],
    robot: ['ro·bot', 'noun', 'The toy robot can walk and flash its lights.', 'robot', '🤖', 'toys'],
    balloon: ['bal·loon', 'noun', 'Red and blue balloons float at the party.', 'balon', '🎈', 'toys'],
    guitar: ['gui·tar', 'noun', 'She plays a happy song on her guitar.', 'gitar', '🎸', 'music'],
    piano: ['pi·an·o', 'noun', 'He presses the black and white keys on the piano.', 'piyano', '🎹', 'music'],
    drum: ['drum', 'noun', 'Beat the drum in time with the music!', 'davul', '🥁', 'music'],
    ancient: ['ancient', 'adjective', 'Ancient Egypt is very, very old.', 'antik / çok eski', '🏺', 'history'],
    chariot: ['chariot', 'noun', 'A horse pulls the fast chariot.', 'savaş arabası / atlı araba', '🐎', 'history'],
    pharaoh: ['pharaoh', 'noun', 'The pharaoh was the king of Ancient Egypt.', 'firavun', '👑', 'history'],
    spacecraft: ['spacecraft', 'noun', 'The Voyager spacecraft flies in space.', 'uzay aracı', '🛸', 'space'],
    capsule: ['time capsule', 'noun', 'We put special objects inside a time capsule.', 'zaman kapsülü', '📦', 'history'],
    earth: ['Earth', 'noun', 'Planet Earth is our blue home in space.', 'Dünya', '🌍', 'space'],
    glasses: ['glasses', 'noun', 'She wears glasses to see clearly.', 'gözlük', '👓', 'items'],
    surprised: ['surprised', 'adjective', 'Jannah was surprised to see Ancient Egypt!', 'şaşkın / şaşırmış', '😲', 'feelings'],
    disc: ['disc', 'noun', 'The golden disc carries sounds and pictures of Earth.', 'disk / plak', '💿', 'space'],
    future: ['future', 'noun', 'What will life be like in the future?', 'gelecek', '🚀', 'time'],
    past: ['past', 'noun', 'We learn about people in the past.', 'geçmiş', '⏳', 'time'],
    present: ['present', 'noun', 'We live in the present today.', 'şimdiki zaman', '📅', 'time'],
    composer: ['composer', 'noun', 'Beethoven was a famous music composer.', 'besteci', '🎼', 'music'],
    orchestra: ['orchestra', 'noun', 'Many musicians play together in an orchestra.', 'orkestra', '🎻', 'music'],
    deaf: ['deaf', 'adjective', 'Beethoven became deaf, so he could not hear.', 'işitme engelli / sağır', '👂', 'people'],
    studio: ['studio', 'noun', 'Foley artists make movie sounds in a studio.', 'stüdyo', '🎙️', 'music'],
    record: ['record', 'verb', 'They record the sound with a microphone.', 'kaydetmek', '🔴', 'music'],
    swords: ['swords', 'noun', 'Two metal knives sound like clashing swords!', 'kılıçlar', '⚔️', 'items'],
    knight: ['knight', 'noun', 'The brave knight rides a horse in shiny armour.', 'şövalye', '🛡️', 'history'],
    eagle: ['eagle', 'noun', 'A big eagle flies high over the mountains.', 'kartal', '🦅', 'animals'],
    audience: ['audience', 'noun', 'The audience claps at the end of the concert.', 'seyirci / dinleyici', '👏', 'people'],
    whistle: ['whistle', 'noun', 'Blow the whistle to make a high sound.', 'düdük', '🪈', 'music']
  };

  // Extra classroom phrases & Turkish <-> English lookup
  const PHRASE_TR_TO_EN = {
    'merhaba': 'Hello!',
    'günaydın': 'Good morning!',
    'iyi günler': 'Have a nice day!',
    'iyi akşamlar': 'Good evening!',
    'iyi geceler': 'Good night!',
    'hoşça kal': 'Goodbye!',
    'görüşürüz': 'See you later!',
    'teşekkür ederim': 'Thank you!',
    'teşekkürler': 'Thank you!',
    'lütfen': 'Please',
    'evet': 'Yes',
    'hayır': 'No',
    'nasılsın': 'How are you?',
    'iyiyim teşekkür ederim': 'I am fine, thank you.',
    'benim adım': 'My name is...',
    'adın ne': 'What is your name?',
    'kaç yaşındasın': 'How old are you?',
    'tahtaya bak': 'Look at the board.',
    'kitabını aç': 'Open your book.',
    'kitabını kapat': 'Close your book.',
    'ayağa kalk': 'Stand up.',
    'otur': 'Sit down.',
    'sessiz ol': 'Be quiet, please.',
    'beni dinle': 'Listen to me.',
    'parmak kaldır': 'Raise your hand.',
    'içeri girebilir miyim': 'May I come in?',
    'pencereyi açabilir miyim': 'May I open the window?',
    'su içebilir miyim': 'May I drink water?',
    'seni seviyorum': 'I love you.',
    'cumhuriyet bayramı': 'Republic Day (29 October)',
    'çocuk bayramı': 'National Sovereignty and Children’s Day (23 April)'
  };

  const PHRASE_EN_TO_TR = {
    'hello': 'Merhaba!',
    'hi': 'Selam! / Merhaba!',
    'good morning': 'Günaydın!',
    'good afternoon': 'Tünaydın! / İyi günler!',
    'good evening': 'İyi akşamlar!',
    'good night': 'İyi geceler!',
    'goodbye': 'Hoşça kal! / Güle güle!',
    'bye': 'Güle güle!',
    'see you': 'Görüşürüz!',
    'thank you': 'Teşekkür ederim!',
    'thanks': 'Teşekkürler!',
    'please': 'Lütfen',
    'yes': 'Evet',
    'no': 'Hayır',
    'how are you': 'Nasılsın?',
    'i am fine': 'İyiyim.',
    'what is your name': 'Adın ne?',
    'my name is': 'Benim adım...',
    'how old are you': 'Kaç yaşındasın?',
    'stand up': 'Ayağa kalk.',
    'sit down': 'Otur.',
    'open your book': 'Kitabını aç.',
    'close your book': 'Kitabını kapat.',
    'be quiet': 'Sessiz ol.',
    'listen': 'Dinle.',
    'look at the board': 'Tahtaya bak.',
    'raise your hand': 'Parmak kaldır.',
    'may i come in': 'İçeri girebilir miyim?',
    'may i open the window': 'Pencereyi açabilir miyim?',
    'clean the board': 'Tahtayı temizle.',
    'turn on the light': 'Işığı aç.',
    'turn off the light': 'Işığı kapat.'
  };

  // Build reverse Turkish -> English single-word map from LEXICON + common classroom words
  const TR_WORD_MAP = {
    kalem: 'pencil', silgi: 'eraser', defter: 'notebook', kitap: 'book', çanta: 'bag',
    tahta: 'board', sıra: 'desk', masa: 'table', sandalye: 'chair', pencere: 'window',
    kapı: 'door', okul: 'school', sınıf: 'classroom', öğretmen: 'teacher', öğrenci: 'student',
    saat: 'clock', harita: 'map', makas: 'scissors', cetvel: 'ruler', boya: 'crayon',
    resim: 'picture', müzik: 'music', matematik: 'math', fen: 'science', oyun: 'game',
    kedi: 'cat', köpek: 'dog', kuş: 'bird', balık: 'fish', aslan: 'lion', kaplan: 'tiger',
    fil: 'elephant', maymun: 'monkey', zürafa: 'giraffe', ayı: 'bear', tavşan: 'rabbit',
    at: 'horse', inek: 'cow', koyun: 'sheep', keçi: 'goat', tavuk: 'chicken', ördek: 'duck',
    kurbağa: 'frog', kaplumbağa: 'turtle', yılan: 'snake', timsah: 'crocodile', yunus: 'dolphin',
    balina: 'whale', penguen: 'penguin', papağan: 'parrot', baykuş: 'owl', arı: 'bee',
    kelebek: 'butterfly', örümcek: 'spider', karınca: 'ant', fare: 'mouse', hayvan: 'animal',
    elma: 'apple', muz: 'banana', portakal: 'orange', çilek: 'strawberry', karpuz: 'watermelon',
    üzüm: 'grape', armut: 'pear', şeftali: 'peach', kiraz: 'cherry', limon: 'lemon',
    domates: 'tomato', patates: 'potato', havuç: 'carrot', ekmek: 'bread', peynir: 'cheese',
    yumurta: 'egg', süt: 'milk', su: 'water', çay: 'tea', çorba: 'soup', pasta: 'cake',
    kurabiye: 'cookie', dondurma: 'ice cream', bal: 'honey', yemek: 'food', meyve: 'fruit',
    aile: 'family', anne: 'mother', baba: 'father', kardeş: 'brother / sister', abla: 'sister',
    abi: 'brother', bebek: 'baby', dede: 'grandfather', nine: 'grandmother', arkadaş: 'friend',
    çocuk: 'child', doktor: 'doctor', korsan: 'pirate', kaptan: 'captain', hazine: 'treasure',
    sandık: 'chest', gemi: 'ship', tekne: 'boat', pusula: 'compass', dürbün: 'telescope',
    ada: 'island', deniz: 'sea', güneş: 'sun', yağmur: 'rain', kar: 'snow', bulut: 'cloud',
    rüzgar: 'wind', gökkuşağı: 'rainbow', yıldız: 'star', ay: 'moon', dünya: 'world / Earth',
    ağaç: 'tree', çiçek: 'flower', orman: 'forest', dağ: 'mountain', nehir: 'river',
    ev: 'house', bahçe: 'garden', araba: 'car', otobüs: 'bus', tren: 'train', bisiklet: 'bicycle',
    uçak: 'airplane', şapka: 'hat', mont: 'coat', ceket: 'jacket', gömlek: 'shirt',
    tişört: 'T-shirt', elbise: 'dress', ayakkabı: 'shoes', çorap: 'socks', eldiven: 'gloves',
    gözlük: 'glasses', şemsiye: 'umbrella', kırmızı: 'red', mavi: 'blue', sarı: 'yellow',
    yeşil: 'green', turuncu: 'orange', mor: 'purple', pembe: 'pink', siyah: 'black', beyaz: 'white'
  };
  Object.keys(LEXICON).forEach((en) => {
    const trRaw = LEXICON[en][3] || '';
    trRaw.split('/').map((s) => s.replace(/\(.*?\)/g, '').trim().toLowerCase()).filter(Boolean).forEach((tr) => {
      if (!TR_WORD_MAP[tr]) TR_WORD_MAP[tr] = en.replace(/_col$/, '');
    });
  });

  /* ------------------------------------------------------------------
     2. HELPER FUNCTIONS: Syllables, Spelling, Grammar, Emoji
     ------------------------------------------------------------------ */
  function cleanWord(s) {
    return String(s || '').toLowerCase().replace(/[^a-z']/g, '').trim();
  }

  function syllabify(word) {
    const w = String(word || '').trim();
    const k = cleanWord(w);
    if (LEXICON[k]) return LEXICON[k][0];
    if (w.length <= 4 || /\s/.test(w)) return w.toLowerCase();
    // Simple English vowel-cluster syllable splitter
    const parts = w.toLowerCase().replace(/([aeiouy]+)([^aeiouy]+)(?=[aeiouy])/g, (_, v, c) => {
      if (c.length > 1) return v + c.slice(0, Math.ceil(c.length / 2)) + '·' + c.slice(Math.ceil(c.length / 2));
      return v + '·' + c;
    });
    return parts || w.toLowerCase();
  }

  function findEmoji(text) {
    const t = String(text || '').toLowerCase();
    const words = t.split(/[^a-z0-9]+/).filter(Boolean);
    for (const w of words) {
      if (LEXICON[w] && LEXICON[w][4]) return LEXICON[w][4];
      const s = w.replace(/s$/, '');
      if (LEXICON[s] && LEXICON[s][4]) return LEXICON[s][4];
    }
    if (/space|planet|mars|moon|star|galaxy/.test(t)) return '🚀';
    if (/pirate|treasure|island|ship|sea|ocean/.test(t)) return '🏴‍☠️';
    if (/dino|dinosaur|fossil/.test(t)) return '🦖';
    if (/monster|dragon|magic/.test(t)) return '🐉';
    if (/sport|football|soccer|basketball|ball/.test(t)) return '⚽';
    if (/music|song|sing|dance/.test(t)) return '🎵';
    if (/food|eat|cook|breakfast|lunch|dinner/.test(t)) return '🍎';
    if (/school|class|learn|study|read|write/.test(t)) return '🏫';
    return '🌟';
  }

  function levenshtein(a, b) {
    a = String(a || '').toLowerCase();
    b = String(b || '').toLowerCase();
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => i);
    for (let j = 1; j <= n; j++) {
      let prev = dp[0];
      dp[0] = j;
      for (let i = 1; i <= m; i++) {
        const tmp = dp[i];
        dp[i] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[i], dp[i - 1]);
        prev = tmp;
      }
    }
    return dp[m];
  }

  const COMMON_TYPOS = {
    swiming: 'swimming', runing: 'running', hopig: 'hopping', skiping: 'skipping', sitig: 'sitting',
    geting: 'getting', puting: 'putting', cuting: 'cutting', stoping: 'stopped', biger: 'bigger',
    frend: 'friend', frends: 'friends', becose: 'because', becuse: 'because', beutiful: 'beautiful',
    beatiful: 'beautiful', schol: 'school', shcool: 'school', scool: 'school', techer: 'teacher',
    studnt: 'student', 펜: 'pen', pencel: 'pencil', pensil: 'pencil', elefant: 'elephant',
    girafe: 'giraffe', giraf: 'giraffe', monky: 'monkey', rabit: 'rabbit', chiken: 'chicken',
    dolfin: 'dolphin', pengin: 'penguin', buterfly: 'butterfly', strawbery: 'strawberry',
    bananna: 'banana', orang: 'orange', sandwitch: 'sandwich', choklate: 'chocolate',
    famly: 'family', mather: 'mother', fother: 'father', broter: 'brother',grandma: 'grandmother',
    wednsday: 'Wednesday', tusday: 'Tuesday', thurday: 'Thursday', satrday: 'Saturday',
    febuary: 'February', autum: 'autumn', mountin: 'mountain', iland: 'island', tresure: 'treasure',
    pirat: 'pirate', captin: 'captain', teleskope: 'telescope', compas: 'compass',
    bicycel: 'bicycle', airplain: 'airplane', umbrela: 'umbrella', yelow: 'yellow', purpel: 'purple',
    favrite: 'favourite', favorit: 'favourite', thier: 'their', teh: 'the', adn: 'and',
    taht: 'that', wiht: 'with', hte: 'the', woud: 'would', coud: 'could', shoud: 'should',
    dont: "don't", cant: "can't", wont: "won't", isnt: "isn't", arent: "aren't", doesnt: "doesn't",
    didnt: "didn't", hasnt: "hasn't", havent: "haven't", im: "I'm", hes: "he's", shes: "she's",
    its: "it's", were: 'we are', youre: "you're", theyre: "they're"
  };

  function buildWordBank() {
    const set = new Set(Object.keys(LEXICON).map((k) => k.replace(/_col$/, '')));
    if (root.SMART_ART_INDEX) Object.keys(root.SMART_ART_INDEX).forEach((k) => set.add(k.toLowerCase()));
    if (root.GAMES_DATA && Array.isArray(root.GAMES_DATA)) {
      root.GAMES_DATA.forEach((g) => {
        const v = (g && g.vocabulary) || {};
        (v.core || []).concat(v.supporting || []).forEach((w) => {
          String(w).toLowerCase().split(/\s+/).filter((x) => /^[a-z]{3,}$/.test(x)).forEach((x) => set.add(x));
        });
      });
    }
    ['the', 'and', 'you', 'are', 'for', 'not', 'with', 'have', 'has', 'this', 'that', 'from', 'they',
      'say', 'her', 'she', 'will', 'one', 'all', 'would', 'there', 'their', 'what', 'out', 'about',
      'who', 'get', 'which', 'when', 'make', 'can', 'like', 'time', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
      'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
      'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any',
      'these', 'give', 'day', 'most', 'very', 'love', 'play', 'live', 'where', 'why', 'morning',
      'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'always', 'never', 'sometimes'
    ].forEach((w) => set.add(w));
    return [...set];
  }

  function spellFixWord(raw, preferredWords) {
    const clean = raw.replace(/[^a-zA-Z']/g, '');
    if (!clean) return raw;
    const low = clean.toLowerCase();
    if (COMMON_TYPOS[low]) return preserveCase(raw, COMMON_TYPOS[low]);
    const bank = (preferredWords || []).map((w) => w.toLowerCase()).concat(buildWordBank());
    if (bank.includes(low) || low.length <= 2) return raw;
    if (low.endsWith('s') && bank.includes(low.slice(0, -1))) return raw;
    if (low.endsWith('ing') && (bank.includes(low.slice(0, -3)) || bank.includes(low.slice(0, -3) + 'e'))) return raw;
    if (low.endsWith('ed') && (bank.includes(low.slice(0, -2)) || bank.includes(low.slice(0, -1)))) return raw;

    let best = null, bestDist = 99;
    const maxDist = low.length <= 4 ? 1 : 2;
    for (const cand of bank) {
      if (Math.abs(cand.length - low.length) > maxDist) continue;
      if (cand[0] !== low[0] && levenshtein(cand.slice(0, 2), low.slice(0, 2)) > 1) continue;
      const d = levenshtein(low, cand);
      if (d < bestDist && d <= maxDist) {
        bestDist = d;
        best = cand;
        if (d === 1 && preferredWords && preferredWords.some((p) => p.toLowerCase() === cand)) break;
      }
    }
    return best ? preserveCase(raw, best) : raw;
  }

  function preserveCase(orig, replacement) {
    if (/^[A-Z][a-z]/.test(orig) && !/^[A-Z]/.test(replacement)) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  /* ------------------------------------------------------------------
     3. BUILT-IN TASK HANDLERS (Offline & Instant Fallback)
     ------------------------------------------------------------------ */

  // TASK: word
  function localWord(rawText) {
    const raw = String(rawText || '').trim().replace(/^\/word\s+/i, '');
    const key = cleanWord(raw);
    const hit = LEXICON[key] || LEXICON[key.replace(/s$/, '')] || LEXICON[key + '_col'];
    if (hit) {
      const displayWord = raw.toLowerCase();
      return {
        word: displayWord,
        syllables: hit[0],
        partOfSpeech: hit[1],
        sentence: hit[2],
        turkish: hit[3],
        emoji: hit[4]
      };
    }
    // Check if the word is in GAMES_DATA
    let lessonTitle = '';
    if (root.GAMES_DATA) {
      const g = root.GAMES_DATA.find((e) => {
        const v = (e && e.vocabulary) || {};
        return (v.core || []).concat(v.supporting || []).some((w) => w.toLowerCase() === raw.toLowerCase());
      });
      if (g) lessonTitle = g.title;
    }
    const pos = /ing$/.test(key) ? 'verb' : /(ful|ous|ive|y|able)$/.test(key) ? 'adjective' : 'noun';
    const sentence = pos === 'verb'
      ? `We can ${raw.toLowerCase()} together in our class.`
      : pos === 'adjective'
      ? `Look! This picture is very ${raw.toLowerCase()}.`
      : `I can see a ${raw.toLowerCase()}${lessonTitle ? ' in our lesson' : ' on the board'}.`;
    return {
      word: raw.toLowerCase(),
      syllables: syllabify(raw),
      partOfSpeech: pos,
      sentence,
      turkish: PHRASE_EN_TO_TR[raw.toLowerCase()] || '',
      emoji: findEmoji(raw)
    };
  }

  // TASK: sentences
  function localSentences(rawText, n) {
    const count = Math.max(1, Math.min(6, Number(n) || 3));
    const focus = String(rawText || '').trim() || 'play';
    const low = focus.toLowerCase();
    const k = cleanWord(focus);
    const out = [];

    if (/^can\b/.test(low)) {
      const v = low.replace(/^can\s+/, '').trim() || 'swim';
      out.push(
        `I can ${v} very well!`,
        `She can ${v} with her friends at school.`,
        `Can you ${v} fast like a superhero?`,
        `My little dog can ${v} in the park.`
      );
    } else if (/have got|has got/.test(low)) {
      out.push(
        `I have got a blue school bag and two books.`,
        `She has got a cute white cat at home.`,
        `We have got English class today!`,
        `Have you got a red pencil on your desk?`
      );
    } else if (/^like\b|^likes\b/.test(low)) {
      const obj = low.replace(/^likes?\s*/, '').trim() || 'apples';
      out.push(
        `I like ${obj} very much.`,
        `My best friend likes ${obj} too.`,
        `Do you like ${obj} for lunch?`,
        `We all like ${obj} in our class!`
      );
    } else if (/there is|there are/.test(low)) {
      out.push(
        `There is a big smart board in our classroom.`,
        `There are twenty happy students at school.`,
        `There is a shiny treasure chest on the island.`,
        `There are three colourful birds in the tree.`
      );
    } else if (/may i/.test(low)) {
      out.push(
        `May I come in, please?`,
        `May I open the classroom window?`,
        `May I drink some water, please?`,
        `May I answer the question on the board?`
      );
    } else if (/\band\b|,/.test(low)) {
      const parts = focus.split(/\band\b|,/i).map((x) => x.trim()).filter(Boolean);
      parts.forEach((p) => {
        const pk = cleanWord(p);
        if (LEXICON[pk]) out.push(LEXICON[pk][2]);
        else out.push(`I can see ${p} in our classroom today.`);
      });
      out.push(`We use "${parts.join('" and "')}" in our English sentence!`);
    } else {
      if (LEXICON[k]) out.push(LEXICON[k][2]);
      const pos = LEXICON[k] ? LEXICON[k][1] : 'noun';
      if (pos === 'verb') {
        out.push(
          `I can ${focus} with my friends every day.`,
          `Let’s ${focus} together in the schoolyard!`,
          `Do you like to ${focus} after school?`,
          `Look! The children ${focus} happily.`
        );
      } else if (pos === 'adjective') {
        out.push(
          `The friendly puppy is very ${focus}.`,
          `Look at the ${focus} picture on the smart board!`,
          `Today is a ${focus} day at school.`,
          `I have a ${focus} sticker in my notebook.`
        );
      } else {
        const art = /^[aeiou]/i.test(focus) ? 'an' : 'a';
        out.push(
          `I can see ${art} ${focus} on the smart board.`,
          `My friend draws ${art} ${focus} in her notebook.`,
          `Do you have ${art} ${focus} at home?`,
          `The ${focus} is my favourite word today!`
        );
      }
    }
    // Deduplicate and return `count`
    const uniq = [...new Set(out)];
    return { focus, sentences: uniq.slice(0, count) };
  }

  // TASK: quiz
  const TOPIC_QUIZ_BANKS = {
    animals: [
      { q: 'Which animal has a very long trunk and big ears?', options: ['elephant', 'rabbit', 'duck'], answer: 'elephant', emoji: '🐘' },
      { q: 'Which animal can swim in the sea and has eight arms?', options: ['octopus', 'giraffe', 'monkey'], answer: 'octopus', emoji: '🐙' },
      { q: 'Which animal has a long neck and eats leaves from tall trees?', options: ['giraffe', 'frog', 'mouse'], answer: 'giraffe', emoji: '🦒' },
      { q: 'Which insect makes sweet golden honey?', options: ['bee', 'spider', 'penguin'], answer: 'bee', emoji: '🐝' },
      { q: 'Which animal is known as the king of the jungle?', options: ['lion', 'chicken', 'turtle'], answer: 'lion', emoji: '🦁' },
      { q: 'Which black-and-white bird loves snow and ice?', options: ['penguin', 'parrot', 'camel'], answer: 'penguin', emoji: '🐧' },
      { q: 'Which animal hops in the garden and loves orange carrots?', options: ['rabbit', 'shark', 'snake'], answer: 'rabbit', emoji: '🐰' }
    ],
    school: [
      { q: 'What do you use to fix a pencil mistake in your notebook?', options: ['eraser', 'scissors', 'clock'], answer: 'eraser', emoji: '🧽' },
      { q: 'Where do you carry your books and pencil case to school?', options: ['bag', 'window', 'chair'], answer: 'bag', emoji: '🎒' },
      { q: 'What do you use to draw a straight line?', options: ['ruler', 'glue', 'globe'], answer: 'ruler', emoji: '📏' },
      { q: 'Who helps us learn English in the classroom?', options: ['teacher', 'pirate', 'pilot'], answer: 'teacher', emoji: '👩‍🏫' },
      { q: 'Polite request: "___ I open the window, please?"', options: ['May', 'Are', 'Have'], answer: 'May', emoji: '🪟' },
      { q: 'In which lesson do we do fun experiments?', options: ['science', 'music', 'art'], answer: 'science', emoji: '🔬' }
    ],
    food: [
      { q: 'Which yellow fruit do monkeys love to eat?', options: ['banana', 'potato', 'bread'], answer: 'banana', emoji: '🍌' },
      { q: 'Which white drink comes from cows and makes our bones strong?', options: ['milk', 'tea', 'lemon'], answer: 'milk', emoji: '🥛' },
      { q: 'Which fruit is green outside, red inside, and juicy in summer?', options: ['watermelon', 'carrot', 'cheese'], answer: 'watermelon', emoji: '🍉' },
      { q: 'What do bees make from flowers?', options: ['honey', 'soup', 'pizza'], answer: 'honey', emoji: '🍯' },
      { q: 'Which orange vegetable do rabbits love to crunch?', options: ['carrot', 'strawberry', 'egg'], answer: 'carrot', emoji: '🥕' }
    ],
    weather: [
      { q: 'What do you carry when it is a rainy day?', options: ['umbrella', 'sunglasses', 'kite'], answer: 'umbrella', emoji: '☂️' },
      { q: 'What has seven colours in the sky after the rain?', options: ['rainbow', 'snowman', 'anchor'], answer: 'rainbow', emoji: '🌈' },
      { q: 'What is the weather like when we build a snowman?', options: ['snowy', 'sunny', 'hot'], answer: 'snowy', emoji: '❄️' },
      { q: 'What shines brightly in the sky during the day?', options: ['sun', 'moon', 'star'], answer: 'sun', emoji: '☀️' },
      { q: 'What kind of day is best for flying a kite?', options: ['windy', 'rainy', 'snowy'], answer: 'windy', emoji: '🪁' }
    ],
    months: [
      { q: 'In which month do we celebrate Republic Day (29 October)?', options: ['October', 'April', 'January'], answer: 'October', emoji: '🇹🇷' },
      { q: 'In which month do we celebrate Children’s Day (23 April)?', options: ['April', 'December', 'July'], answer: 'April', emoji: '🎈' },
      { q: 'Which month is the very first month of the year?', options: ['January', 'September', 'May'], answer: 'January', emoji: '❄️' },
      { q: 'In which month do we go back to school after summer?', options: ['September', 'February', 'June'], answer: 'September', emoji: '🎒' },
      { q: 'In which month do we celebrate Youth and Sports Day (19 May)?', options: ['May', 'March', 'November'], answer: 'May', emoji: '🌸' }
    ],
    pirates: [
      { q: 'What tool helps a captain look far across the sea?', options: ['telescope', 'scissors', 'crayon'], answer: 'telescope', emoji: '🔭' },
      { q: 'What always points North to help sailors find their way?', options: ['compass', 'banana', 'pillow'], answer: 'compass', emoji: '🧭' },
      { q: 'Where are the shiny gold coins hidden?', options: ['treasure chest', 'pencil case', 'lunchbox'], answer: 'treasure chest', emoji: '🧰' },
      { q: 'What do you use to unlock a locked treasure box?', options: ['key', 'spoon', 'feather'], answer: 'key', emoji: '🔑' },
      { q: 'What drops into the water to keep the ship still in the harbour?', options: ['anchor', 'balloon', 'umbrella'], answer: 'anchor', emoji: '⚓' }
    ],
    body: [
      { q: 'What part of your body do you use to see the smart board?', options: ['eyes', 'ears', 'feet'], answer: 'eyes', emoji: '👁️' },
      { q: 'What do you brush every morning and every night?', options: ['teeth', 'knees', 'ears'], answer: 'teeth', emoji: '🦷' },
      { q: 'How many fingers do you have on two hands?', options: ['ten', 'two', 'fifty'], answer: 'ten', emoji: '✋' },
      { q: 'What part of your body do you use to listen to music?', options: ['ears', 'nose', 'toes'], answer: 'ears', emoji: '👂' },
      { q: 'What do you raise before you speak in class?', options: ['hand', 'foot', 'shoulder'], answer: 'hand', emoji: '🙋' }
    ]
  };

  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function localQuiz(rawText, n) {
    const count = Math.max(1, Math.min(8, Number(n) || 5));
    const raw = String(rawText || '').trim() || 'animals';
    const low = raw.toLowerCase();

    // Case 1: "these words: ..." or comma-separated list of vocabulary words
    if (/^these words:/i.test(raw) || raw.includes(',')) {
      const list = raw.replace(/^these words:\s*/i, '').split(',').map((w) => w.trim()).filter(Boolean);
      if (list.length >= 3) {
        const pool = shuffleArr(list);
        const questions = pool.slice(0, count).map((target) => {
          const k = cleanWord(target);
          const lex = LEXICON[k] || LEXICON[k.replace(/s$/, '')];
          const distractors = shuffleArr(list.filter((w) => w.toLowerCase() !== target.toLowerCase())).slice(0, 2);
          while (distractors.length < 2) distractors.push(['apple', 'book', 'turtle'][distractors.length]);
          const options = shuffleArr([target, distractors[0], distractors[1]]);
          let q = `Complete the sentence: "I can see a ___ on the board."`;
          let emoji = findEmoji(target);
          if (lex) {
            emoji = lex[4] || emoji;
            const blanked = lex[2].replace(new RegExp('\\b' + target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i'), '___');
            if (blanked.includes('___')) {
              q = `Fill in the blank: "${blanked}"`;
            } else if (lex[3]) {
              q = `Which English word means "${lex[3].split('/')[0].trim()}"?`;
            }
          }
          return { q, options, answer: target, emoji };
        });
        return { topic: 'Lesson words', questions };
      }
    }

    // Case 2: Match a built-in topic bank
    for (const [key, bank] of Object.entries(TOPIC_QUIZ_BANKS)) {
      if (low.includes(key) || (key === 'pirates' && /treasure|island|ship/.test(low)) || (key === 'school' && /classroom|subject/.test(low))) {
        const qs = shuffleArr(bank).slice(0, count).map((item) => ({
          q: item.q,
          options: shuffleArr(item.options),
          answer: item.answer,
          emoji: item.emoji
        }));
        return { topic: raw, questions: qs };
      }
    }

    // Case 3: Build a dynamic quiz from LEXICON category or general A1 vocabulary
    const catWords = Object.entries(LEXICON).filter(([, v]) => low.includes(v[5]));
    const sourceEntries = catWords.length >= 4 ? catWords : Object.entries(LEXICON);
    const picked = shuffleArr(sourceEntries).slice(0, count);
    const allKeys = Object.keys(LEXICON).map((k) => k.replace(/_col$/, ''));
    const questions = picked.map(([enKey, info]) => {
      const word = enKey.replace(/_col$/, '');
      const distractors = shuffleArr(allKeys.filter((k) => k !== word && LEXICON[k] && LEXICON[k][5] !== info[5])).slice(0, 2);
      const blanked = info[2].replace(new RegExp('\\b' + word + 's?\\b', 'i'), '___');
      const q = blanked.includes('___')
        ? `Choose the right word: "${blanked}"`
        : `Which English word means "${info[3].split('/')[0].trim()}"?`;
      return {
        q,
        options: shuffleArr([word, distractors[0] || 'book', distractors[1] || 'sun']),
        answer: word,
        emoji: info[4] || '❓'
      };
    });
    return { topic: raw, questions };
  }

  // TASK: story
  function localStory(rawText) {
    const topic = String(rawText || '').trim() || 'a friendly monster at school';
    const words = topic.split(/[^a-zA-Z0-9']+/).filter((w) => w.length >= 3 && !/^(the|and|with|for|from|about|into)$/i.test(w));
    const main = words[0] || 'friend';
    const second = words[1] || 'treasure';
    const third = words[2] || 'island';
    const title = topic.charAt(0).toUpperCase() + topic.slice(1);
    const sentences = [
      `One sunny morning, ${/^(a|an|the|my|our)\b/i.test(topic) ? topic : 'a happy ' + topic} wakes up with a big smile.`,
      `"Today is a wonderful day for an English adventure!" says the ${main.toLowerCase()}.`,
      `Along the way, they find a shiny ${second.toLowerCase()} and a colourful map.`,
      `All the friends work together, count to ten, and help each other bravely.`,
      `At the end of the day, everyone claps and shouts, "Hooray for ${main.toLowerCase()}!"`
    ];
    const keywords = [...new Set([main.toLowerCase(), second.toLowerCase(), third.toLowerCase(), 'adventure', 'friends'])].slice(0, 5);
    return { title, sentences, keywords };
  }

  // TASK: tr (Translate EN <-> TR)
  function isTurkishText(text) {
    const s = String(text || '').trim().toLowerCase();
    if (/[çğıöşü]/i.test(s)) return true;
    if (PHRASE_TR_TO_EN[s] || TR_WORD_MAP[s]) return true;
    const trCommon = /\b(ve|bir|bu|şu|ne|nasıl|nerede|ben|sen|biz|siz|onlar|var|yok|için|ile|değil|evet|hayır|günaydın|merhaba|lütfen|teşekkür|okul|sınıf|kitap|kalem|kedi|köpek|elma|su)\b/i;
    return trCommon.test(s);
  }

  function localTranslate(rawText) {
    const text = String(rawText || '').trim();
    const low = text.toLowerCase().replace(/[.!?]+$/, '').trim();
    const key = cleanWord(low);

    if (isTurkishText(text)) {
      if (PHRASE_TR_TO_EN[low]) return { from: 'Turkish', to: 'English', translation: PHRASE_TR_TO_EN[low] };
      if (TR_WORD_MAP[low]) return { from: 'Turkish', to: 'English', translation: TR_WORD_MAP[low] };
      // Word-by-word fallback
      const translatedWords = low.split(/\s+/).map((w) => TR_WORD_MAP[w] || PHRASE_TR_TO_EN[w] || w);
      return { from: 'Turkish', to: 'English', translation: translatedWords.join(' ') };
    } else {
      if (PHRASE_EN_TO_TR[low]) return { from: 'English', to: 'Turkish', translation: PHRASE_EN_TO_TR[low] };
      const stripped = low.replace(/^(a|an|the|to)\s+/, '');
      const lex = LEXICON[cleanWord(stripped)] || LEXICON[key] || LEXICON[key.replace(/s$/, '')];
      if (lex) return { from: 'English', to: 'Turkish', translation: lex[3] };
      const translatedWords = stripped.split(/\s+/).map((w) => {
        const cw = cleanWord(w);
        return (LEXICON[cw] && LEXICON[cw][3].split('/')[0].trim()) || PHRASE_EN_TO_TR[cw] || w;
      });
      return { from: 'English', to: 'Turkish', translation: translatedWords.join(' ') };
    }
  }

  // TASK: check (Grammar & Spelling Checker for A1 Learners)
  function localCheck(rawText) {
    const orig = String(rawText || '').trim();
    if (!orig) return { ok: true, corrected: '', tip: '', changes: [] };

    let s = orig.replace(/\s+/g, ' ');
    const changes = [];
    const tips = [];

    // 1. Standalone "i" -> "I"
    if (/\bi\b/.test(s)) {
      s = s.replace(/\bi\b/g, 'I');
      changes.push('i → I');
      tips.push('Always write "I" with a capital letter.');
    }

    // 2. Word-by-word spelling & contraction check
    s = s.split(' ').map((token) => {
      const m = token.match(/^([^a-zA-Z']*)([a-zA-Z']+)([^a-zA-Z']*)$/);
      if (!m) return token;
      const [, pre, word, post] = m;
      const fixed = spellFixWord(word);
      if (fixed !== word) {
        changes.push(`${word} → ${fixed}`);
      }
      return pre + fixed + post;
    }).join(' ');

    // 3. Modal verb + verb-ing / to verb / verb-s ("can swimming" -> "can swim")
    s = s.replace(/\b(can|can't|cannot|may|must|will|won't)\s+to\s+([a-z]+)\b/gi, (_, modal, v) => {
      changes.push(`${modal} to ${v} → ${modal} ${v}`);
      tips.push(`After "${modal.toLowerCase()}", do not use "to".`);
      return `${modal} ${v}`;
    });
    s = s.replace(/\b(can|can't|cannot|may|must|will|won't)\s+([a-z]+ing)\b/gi, (full, modal, ving) => {
      let base = ving.toLowerCase().replace(/ing$/, '');
      if (/(mm|nn|pp|tt|gg|bb)$/.test(base)) base = base.slice(0, -1);
      else if (!LEXICON[base] && LEXICON[base + 'e']) base = base + 'e';
      changes.push(`${modal} ${ving} → ${modal} ${base}`);
      tips.push(`After "${modal.toLowerCase()}", use the simple verb: "${modal.toLowerCase()} ${base}".`);
      return `${modal} ${base}`;
    });

    // 4. Subject-verb agreement fixes
    const grammarRules = [
      { re: /\b(he|she|it)\s+have\b/gi, rep: '$1 has', tip: 'Use "has" with he, she, and it.' },
      { re: /\b(he|she|it)\s+don't\b/gi, rep: "$1 doesn't", tip: 'Use "doesn\'t" with he, she, and it.' },
      { re: /\b(I)\s+is\b/g, rep: 'I am', tip: 'Say "I am" instead of "I is".' },
      { re: /\b(you|we|they)\s+is\b/gi, rep: '$1 are', tip: 'Use "are" with you, we, and they.' },
      { re: /\b(he|she|it)\s+are\b/gi, rep: '$1 is', tip: 'Use "is" with he, she, and it.' },
      { re: /\ba\s+([aeiou][a-z]+)\b/gi, rep: 'an $1', tip: 'Use "an" before a vowel sound (a, e, i, o, u).' },
      { re: /\b(\d+|two|three|four|five|six|seven|eight|nine|ten)\s+year\s+old\b/gi, rep: '$1 years old', tip: 'Say "years old" with a plural "s".' }
    ];
    grammarRules.forEach((rule) => {
      if (rule.re.test(s)) {
        const before = s;
        s = s.replace(rule.re, rule.rep);
        if (s !== before) {
          tips.push(rule.tip);
          changes.push(rule.tip.split('.')[0]);
        }
      }
    });

    // 5. Capitalize the first letter
    if (/^[a-z]/.test(s)) {
      s = s.charAt(0).toUpperCase() + s.slice(1);
      if (!changes.length) changes.push('Capital first letter');
      if (!tips.length) tips.push('Start every sentence with a capital letter.');
    }

    // 6. Ending punctuation
    if (!/[.!?]$/.test(s)) {
      const isQ = /^(who|what|where|when|why|how|can|may|do|does|did|is|are|am|have|has|will|would)\b/i.test(s);
      s += isQ ? '?' : '.';
      if (!tips.length) tips.push(isQ ? 'Put a question mark (?) at the end of a question.' : 'Put a full stop (.) at the end of a sentence.');
    }

    const ok = s === orig;
    return {
      ok,
      corrected: s,
      tip: ok ? 'Great job! Your sentence is clear and correct.' : (tips[0] || 'Look at the capital letters, spelling, and full stop.'),
      changes: ok ? [] : changes.slice(0, 4)
    };
  }

  // TASK: ask (Classroom Q&A Encyclopedia + Math + Word Facts)
  const QA_BANK = [
    { re: /sky.*blue/i, answer: 'Sunlight has all the colours of the rainbow! Blue light bounces around in the air the most, so the sky looks bright blue.', emoji: '🌤️' },
    { re: /cat.*purr/i, answer: 'Cats purr when they feel happy, safe, and cosy! It is their way of smiling.', emoji: '🐱' },
    { re: /dog.*wag|tail/i, answer: 'Dogs wag their tails to say "Hello, I am happy and friendly!"', emoji: '🐶' },
    { re: /rainbow/i, answer: 'A rainbow appears when sunlight shines through raindrops in the sky! It has seven colours: red, orange, yellow, green, blue, indigo, and violet.', emoji: '🌈' },
    { re: /capital.*turk/i, answer: 'The capital city of Türkiye is Ankara!', emoji: '🇹🇷' },
    { re: /bursa/i, answer: 'Bursa is a beautiful green city in Türkiye famous for Uludağ mountain and delicious peaches!', emoji: '🏔️' },
    { re: /29\s*october|republic day/i, answer: 'On 29 October, we celebrate Republic Day in Türkiye with flags, songs, and parades!', emoji: '🇹🇷' },
    { re: /23\s*april|children.*day/i, answer: 'On 23 April, we celebrate National Sovereignty and Children’s Day in Türkiye!', emoji: '🎈' },
    { re: /spider.*leg/i, answer: 'A spider has eight legs! Insects like bees and ants have six legs.', emoji: '🕷️' },
    { re: /biggest.*animal|whale/i, answer: 'The blue whale is the biggest animal on Earth! It lives in the deep ocean.', emoji: '🐋' },
    { re: /fastest.*animal|cheetah/i, answer: 'The cheetah is the fastest land animal! It can run as fast as a car.', emoji: '🐆' },
    { re: /planet|solar system/i, answer: 'There are eight planets in our solar system, and we live on planet Earth!', emoji: '🪐' },
    { re: /bee.*honey/i, answer: 'Bees visit colourful flowers to collect sweet nectar and turn it into golden honey in their hive.', emoji: '🐝' },
    { re: /dinosaur/i, answer: 'Dinosaurs were giant reptiles that lived on Earth millions of years ago! Scientists find their fossils in the ground.', emoji: '🦖' },
    { re: /seasons?/i, answer: 'There are four seasons in a year: spring, summer, autumn, and winter!', emoji: '🍂' },
    { re: /how many months/i, answer: 'There are twelve months in a year, starting with January and ending with December.', emoji: '📅' },
    { re: /how many days.*week/i, answer: 'There are seven days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday!', emoji: '📅' }
  ];

  function localAsk(rawText) {
    const q = String(rawText || '').trim();
    // Check simple math question ("what is 12 + 15")
    const mathMatch = q.match(/(\d+)\s*([+\-x*÷/])\s*(\d+)/);
    if (mathMatch) {
      const a = Number(mathMatch[1]), op = mathMatch[2], b = Number(mathMatch[3]);
      let res = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === 'x' || op === '*') res = a * b;
      else if ((op === '/' || op === '÷') && b !== 0) res = Math.round((a / b) * 100) / 100;
      return { answer: `${a} ${op} ${b} equals ${res}! Great math question!`, emoji: '🔢' };
    }
    for (const item of QA_BANK) {
      if (item.re.test(q)) return { answer: item.answer, emoji: item.emoji };
    }
    // Check if the question mentions a word in LEXICON
    const words = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    for (const w of words) {
      if (LEXICON[w]) {
        const info = LEXICON[w];
        return {
          answer: `${info[2]} In Turkish, "${w}" means "${info[3]}".`,
          emoji: info[4] || '🦉'
        };
      }
    }
    return {
      answer: `That is a great question! Let’s explore "${q.replace(/[?]+$/, '')}" together in class.`,
      emoji: findEmoji(q)
    };
  }

  /* ------------------------------------------------------------------
     4. PICTURE GENERATOR (/draw & Sketch-to-Picture)
     ------------------------------------------------------------------ */
  function findLibraryMatch(subject) {
    const idx = root.SMART_ART_INDEX || {};
    const clean = String(subject || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').trim();
    const words = clean.split(/\s+/).filter((w) => !/^(a|an|the|my|our|big|small|happy|cute|little|red|blue|green|yellow)$/.test(w));
    const candidates = [clean, ...words.slice().reverse()];
    for (const c of candidates) {
      if (idx[c] && idx[c].length) return '../' + idx[c][0];
      const sing = c.replace(/s$/, '');
      if (idx[sing] && idx[sing].length) return '../' + idx[sing][0];
    }
    return '';
  }

  function loadImageElement(src, timeoutMs) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const t = setTimeout(() => { img.src = ''; reject(new Error('Image timeout')); }, timeoutMs || 10000);
      img.onload = () => { clearTimeout(t); resolve(img); };
      img.onerror = (e) => { clearTimeout(t); reject(e); };
      img.src = src;
    });
  }

  async function generateIllustratedCanvas(subject, sketchBase64) {
    const c = document.createElement('canvas');
    c.width = 768; c.height = 768;
    const ctx = c.getContext('2d');

    // Rich 3D volumetric background gradient
    const grad = ctx.createRadialGradient(384, 260, 40, 384, 384, 520);
    grad.addColorStop(0, '#1e3a8a');
    grad.addColorStop(0.55, '#0f172a');
    grad.addColorStop(1, '#060911');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 768, 768);

    // Decorative ambient stars/glows
    const glowColors = ['#38bdf8', '#f59e0b', '#10b981', '#a855f7'];
    for (let i = 0; i < 18; i++) {
      const gx = (i * 173 + 90) % 700 + 34;
      const gy = (i * 113 + 60) % 520 + 40;
      const r = 3 + (i % 4) * 2;
      ctx.save();
      ctx.fillStyle = glowColors[i % glowColors.length];
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3D Isometric Pedestal Disc
    const pedGrad = ctx.createRadialGradient(384, 575, 20, 384, 575, 220);
    pedGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
    pedGrad.addColorStop(0.6, 'rgba(59, 130, 246, 0.22)');
    pedGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = pedGrad;
    ctx.beginPath();
    ctx.ellipse(384, 575, 220, 62, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(384, 568, 175, 44, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Check if we have a matching library illustration first
    const libSrc = findLibraryMatch(subject);
    let drewSprite = false;
    if (libSrc) {
      try {
        const img = await loadImageElement(libSrc, 4000);
        const scale = Math.min(480 / img.width, 460 / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 32;
        ctx.drawImage(img, 384 - w / 2, 340 - h / 2, w, h);
        ctx.restore();
        drewSprite = true;
      } catch (e) { /* fallback below */ }
    }

    if (!drewSprite && sketchBase64) {
      try {
        const skImg = await loadImageElement('data:image/png;base64,' + sketchBase64, 3000);
        // Frame the student's sketch inside a glowing magic frame
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
        ctx.shadowBlur = 28;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(144, 110, 480, 410, 32);
        else ctx.rect(144, 110, 480, 410);
        ctx.fill();
        const scale = Math.min(430 / skImg.width, 360 / skImg.height);
        const w = skImg.width * scale, h = skImg.height * scale;
        ctx.drawImage(skImg, 384 - w / 2, 315 - h / 2, w, h);
        ctx.restore();
        drewSprite = true;
      } catch (e) { /* fallback below */ }
    }

    if (!drewSprite) {
      // Draw large 3D emoji emblem + subject badge
      const emoji = findEmoji(subject);
      ctx.save();
      ctx.font = '270px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 32;
      ctx.fillText(emoji, 384, 370);
      ctx.restore();
    }

    return {
      image: c.toDataURL('image/png').split(',')[1],
      mime: 'image/png',
      subject
    };
  }

  async function callFreeDraw(subject, sketchBase64, timeoutMs) {
    // If online and no sketch, try free Pollinations 3D cartoon image generator first (with short 8s timeout)
    if (root.navigator.onLine !== false && !sketchBase64) {
      const prompt = encodeURIComponent(`cute 3D Pixar style cartoon illustration of ${subject}, kid friendly classroom flashcard, vibrant colors, soft studio lighting, centered object`);
      const seed = Math.floor(Math.random() * 10000);
      const url = `https://image.pollinations.ai/prompt/${prompt}?width=640&height=640&nologo=true&seed=${seed}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs || 9000, 9000));
      try {
        const r = await fetch(url, { signal: ctrl.signal });
        if (r.ok) {
          const blob = await r.blob();
          if (blob && blob.size > 2000 && /^image\//.test(blob.type)) {
            const dataUrl = await new Promise((res, rej) => {
              const fr = new FileReader();
              fr.onload = () => res(fr.result);
              fr.onerror = rej;
              fr.readAsDataURL(blob);
            });
            const [head, b64] = String(dataUrl).split(',');
            const mime = (head.match(/data:([^;]+)/) || [null, 'image/jpeg'])[1];
            return { image: b64, mime, subject };
          }
        }
      } catch (e) {
        // Fall through to instant local 3D illustrated canvas
      } finally {
        clearTimeout(timer);
      }
    }
    return generateIllustratedCanvas(subject, sketchBase64);
  }

  /* ------------------------------------------------------------------
     5. HANDWRITING & SKETCH RECOGNITION (`neat` task)
     ------------------------------------------------------------------ */
  let tesseractWorkerPromise = null;

  function loadTesseract() {
    if (root.Tesseract) return Promise.resolve(root.Tesseract);
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.onload = () => (root.Tesseract ? resolve(root.Tesseract) : reject(new Error('Tesseract load failed')));
      s.onerror = () => reject(new Error('Tesseract script error'));
      document.head.appendChild(s);
    });
  }

  async function getOcrWorker() {
    if (tesseractWorkerPromise) return tesseractWorkerPromise;
    tesseractWorkerPromise = (async () => {
      const T = await loadTesseract();
      const worker = await T.createWorker('eng');
      await worker.setParameters({
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'?!.,- "
      });
      return worker;
    })().catch((err) => {
      tesseractWorkerPromise = null;
      throw err;
    });
    return tesseractWorkerPromise;
  }

  async function localNeat(payload) {
    const b64 = payload && payload.image;
    const hintWords = Array.isArray(payload && payload.hintWords) ? payload.hintWords : [];
    const targetWord = String((payload && payload.targetWord) || '').trim();
    if (!b64) return { kind: 'unclear', read: '', corrected: '', lines: [], changed: false, tip: '', drawingGuess: '' };

    // Measure aspect ratio of the handwriting PNG
    let aspect = 2.0;
    try {
      const img = await loadImageElement('data:image/png;base64,' + b64, 2000);
      aspect = img.width / Math.max(1, img.height);
    } catch (e) { /* ignore */ }

    // Try Tesseract OCR with a fast timeout
    let rawRead = '';
    let confidence = 0;
    try {
      const worker = await Promise.race([
        getOcrWorker(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('ocr-init-timeout')), 7500))
      ]);
      const res = await Promise.race([
        worker.recognize('data:image/png;base64,' + b64),
        new Promise((_, rej) => setTimeout(() => rej(new Error('ocr-rec-timeout')), 6500))
      ]);
      rawRead = String((res && res.data && res.data.text) || '').trim();
      confidence = Number((res && res.data && res.data.confidence) || 0);
    } catch (e) {
      rawRead = '';
    }

    const cleaned = rawRead.replace(/[^a-zA-Z0-9'\s?!.,-]/g, '').replace(/\s+/g, ' ').trim();

    // If a Spelling Challenge or Board Race targetWord is active and OCR is close, snap to what the child wrote
    if (targetWord && cleaned) {
      const d = levenshtein(cleanWord(cleaned), cleanWord(targetWord));
      if (d <= 1 || (targetWord.length >= 6 && d <= 2)) {
        return {
          kind: 'text',
          read: targetWord,
          corrected: targetWord,
          lines: [targetWord],
          changed: d > 0,
          tip: '',
          drawingGuess: ''
        };
      }
    }

    if (cleaned && /[a-zA-Z0-9]/.test(cleaned) && (confidence >= 28 || cleaned.length >= 2)) {
      const lines = cleaned.split(/\n/).map((line) => {
        return line.split(/\s+/).map((w) => spellFixWord(w, hintWords)).join(' ');
      }).filter(Boolean);
      const corrected = lines.join('\n');
      const changed = corrected.toLowerCase() !== cleaned.toLowerCase();
      const cw = cleanWord(cleaned);
      const alternatives = hintWords.map((w) => [w, levenshtein(cw, cleanWord(w))])
        .filter((x) => x[1] <= Math.max(2, Math.ceil(cw.length / 2)) && cleanWord(x[0]) !== cleanWord(corrected))
        .sort((a, b) => a[1] - b[1]).slice(0, 3).map((x) => x[0]);
      return {
        kind: 'text',
        src: 'ocr',
        sure: confidence >= 80 && !changed,
        alternatives,
        read: cleaned,
        corrected,
        lines,
        changed,
        tip: changed ? `${cleaned} → ${corrected}` : '',
        drawingGuess: ''
      };
    }

    // If aspect ratio is roughly square-ish (< 2.2) and no clear letters were detected, treat as a drawing!
    if (aspect < 2.2) {
      const guess = hintWords[0] || 'a cute animal';
      return {
        kind: 'drawing',
        read: '',
        corrected: '',
        lines: [],
        changed: false,
        tip: '',
        drawingGuess: guess
      };
    }

    return { kind: 'unclear', read: '', corrected: '', lines: [], changed: false, tip: '', drawingGuess: '' };
  }

  /* ------------------------------------------------------------------
     6. TIER 1 & TIER 2 CLOUD HELPERS (Optional Gemini Key / Free Cloud)
     ------------------------------------------------------------------ */
  async function callDirectGemini(key, task, payload, timeoutMs) {
    if (task === 'draw') return callFreeDraw(payload.subject, payload.sketch, timeoutMs);
    const prompts = {
      word: `Return JSON {"word","syllables","partOfSpeech","sentence","turkish","emoji"} for A1 9-year-old Turkish learner of English for the word "${payload.text}". Simple present sentence (5-9 words).`,
      sentences: `Return JSON {"focus":"${payload.text}","sentences":["..."]} with ${payload.n || 3} simple A1 English sentences (5-9 words each) for 9-year-old learners using "${payload.text}".`,
      quiz: `Return JSON {"topic":"${payload.text}","questions":[{"q":"...","options":["a","b","c"],"answer":"a","emoji":"🐘"}]} with ${payload.n || 5} 3-choice A1 English questions about "${payload.text}".`,
      story: `Return JSON {"title":"...","sentences":["..."],"keywords":["..."]} with a 5-sentence A1 story for 9-year-olds about "${payload.text}".`,
      tr: `Return JSON {"from":"Turkish"|"English","to":"English"|"Turkish","translation":"..."} translating "${payload.text}" between Turkish and English for a 9-year-old classroom.`,
      check: `Return JSON {"ok":boolean,"corrected":"...","tip":"...","changes":["old -> new"]} checking A1 student sentence "${payload.text}".`,
      ask: `Return JSON {"answer":"...","emoji":"🦉"} answering "${payload.text}" in 1-2 simple A1 sentences for a 9-year-old.`,
      neat: `This picture is ENGLISH handwriting written with a finger or pen on a classroom smartboard (teacher or 8-10 year old pupil, A1 level). The strokes can be wobbly, big, and joined. Read it letter by letter. Words from this week's lesson are likely: ${(payload.hintWords || []).slice(0, 40).join(', ') || '(none)'}. Prefer a lesson word ONLY if the shapes really fit it; never invent words that are not there. Keep the writer's capitals and punctuation. Return JSON {"kind":"text"|"drawing"|"unclear","read":"exactly what is written","corrected":"same text with spelling fixed","lines":["one item per written line"],"changed":boolean,"sure":boolean,"alternatives":["up to 3 other possible readings"],"tip":"short spelling tip or empty","drawingGuess":"if a drawing, 2-4 words"}. Set "sure" to false if any letter is doubtful.`
    };
    const words = ['sentences', 'quiz', 'story', 'ask'].indexOf(task) !== -1 ? await lessonWordsLine() : '';
    const parts = [{ text: (prompts[task] || prompts.ask) + words }];
    if (task === 'neat' && payload.image) {
      parts.unshift({ inlineData: { mimeType: 'image/png', data: payload.image } });
    }
    const body = JSON.stringify({
      systemInstruction: { parts: [{ text: SAFE_RULES }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
    });
    const started = Date.now(), budget = timeoutMs || 15000;
    let lastErr = null;
    for (const model of GEMINI_MODELS) {
      const left = budget - (Date.now() - started);
      if (left < 1500) break;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), Math.min(left, 9000));   // a slow model does not use up all the time
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body
        });
        // busy (429, 503) or retired (404): try the next model; a wrong key (400, 401, 403) stops here
        if (!r.ok) { lastErr = new Error('Gemini status ' + r.status); if ([404, 429, 500, 503].indexOf(r.status) !== -1) continue; throw lastErr; }
        const j = await r.json();
        const ps = (j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
        const raw = ps.filter(p => p && typeof p.text === 'string' && !p.thought).map(p => p.text).join('').trim()
          .replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
        const out = JSON.parse(raw);
        if (task === 'neat' && out && typeof out === 'object') out.src = 'gemini';
        geminiInfo = { model, error: '' };
        return out;
      } catch (e) {
        lastErr = e;
        if (/status (400|401|403)/.test(String(e && e.message))) throw e;
      } finally {
        clearTimeout(timer);
      }
    }
    geminiInfo = { model: '', error: String((lastErr && lastErr.message) || 'Gemini did not answer') };
    throw lastErr || new Error('Gemini did not answer');
  }

  async function callFreeMyMemoryTranslate(text) {
    const tr = isTurkishText(text);
    const pair = tr ? 'tr|en' : 'en|tr';
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);
    try {
      const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`, { signal: ctrl.signal });
      if (!r.ok) throw new Error('MyMemory status');
      const j = await r.json();
      const out = j && j.responseData && j.responseData.translatedText;
      if (out && out.toLowerCase() !== text.toLowerCase() && !/MYMEMORY WARNING/i.test(out)) {
        return { from: tr ? 'Turkish' : 'English', to: tr ? 'English' : 'Turkish', translation: out };
      }
    } finally {
      clearTimeout(timer);
    }
    throw new Error('No translation');
  }

  /* ------------------------------------------------------------------
     7. MAIN SmartAI SINGLETON (Always Ready!)
     ------------------------------------------------------------------ */
  const AI = {
    ready: true,
    state: 'ready',        // Ready out of the box with zero setup!
    mode: isGeminiKey(pin) ? 'gemini' : 'builtin',
    left: null,
    missing: [],
    onChange: null,

    hasPin() { return !!pin; },
    // Which Gemini model answered last, or the last error (shown in Settings)
    geminiInfo() { return Object.assign({}, geminiInfo); },
    isGemini() { return isGeminiKey(pin); },
    // One small request to check the key: { ok, model, error }
    async testKey() {
      if (!isGeminiKey(pin)) return { ok: false, model: '', error: 'no key' };
      try {
        const r = await callDirectGemini(pin, 'ask', { text: 'Say hello to the class' }, 20000);
        return { ok: !!(r && r.answer), model: geminiInfo.model, error: '', answer: r && r.answer };
      } catch (e) {
        const m = String((e && e.message) || e);
        return { ok: false, model: '', error: /400|401|403/.test(m) ? 'The key was refused by Google.' : 'Google is busy or offline. Try again in a minute.' };
      }
    },
    setPin(p) {
      pin = String(p || '').trim();
      try { if (pin) root.localStorage.setItem(PIN_KEY, pin); else root.localStorage.removeItem(PIN_KEY); } catch (e) { /* ignore */ }
      this.mode = isGeminiKey(pin) ? 'gemini' : 'builtin';
    },
    set(state, extra) {
      // Never lock out the teacher: even if offline or no PIN, Built-in Curriculum AI keeps AI.ready = true!
      this.state = state === 'offline' ? 'ready' : state;
      this.ready = true;
      Object.assign(this, extra || {});
      if (typeof this.onChange === 'function') this.onChange(this);
    },

    async status() {
      if (!pin) {
        this.set('ready', { mode: 'builtin', left: null, missing: [] });
        return this;
      }
      if (isGeminiKey(pin)) {
        this.set('ready', { mode: 'gemini', left: null, missing: [] });
        return this;
      }
      const url = endpoint();
      if (!url) {
        this.set('ready', { mode: 'builtin', left: null, missing: [] });
        return this;
      }
      try {
        const r = await fetch(url + '?action=status', { method: 'GET', headers: headers() });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.ready) {
          this.set('ready', { mode: 'supabase', left: j.left || null, missing: [] });
        } else {
          this.set('ready', { mode: 'builtin', left: null, missing: [] });
        }
      } catch (e) {
        this.set('ready', { mode: 'builtin', left: null, missing: [] });
      }
      return this;
    },

    async call(task, payload, timeoutMs) {
      payload = payload || {};

      // Tier 1A: Optional Direct Gemini API Key (AIza… or AQ.…)
      if (isGeminiKey(pin)) {
        try {
          return await callDirectGemini(pin, task, payload, timeoutMs);
        } catch (e) {
          // Fall through to Tier 2 / Tier 3
        }
      }

      // Tier 1B: Optional Supabase Edge Function (only if verified ready)
      if (this.mode === 'supabase' && pin && !isGeminiKey(pin) && endpoint() && root.navigator.onLine !== false) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs || 15000, task === 'neat' ? 13000 : 15000));
        try {
          const r = await fetch(endpoint(), {
            method: 'POST',
            signal: ctrl.signal,
            headers: headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(Object.assign({ task }, payload))
          });
          const j = await r.json().catch(() => ({}));
          if (j.left) { this.left = j.left; if (typeof this.onChange === 'function') this.onChange(this); }
          if (r.ok && j.ok && j.data) return j.data;
        } catch (e) {
          // Fall through to Tier 2 / Tier 3
        } finally {
          clearTimeout(timer);
        }
        // Handwriting: the built-in printed-text reader is slow (up to 14 s) and poor at finger writing,
        // so when the board is connected to the server we say "try again" instead of waiting for it.
        if (task === 'neat') return { kind: 'unclear', busy: true };
      }

      // Tier 2 & Tier 3: Zero-Setup Free Cloud + Built-In Curriculum Engine
      switch (task) {
        case 'word': {
          const res = localWord(payload.text);
          if (!res.turkish && root.navigator.onLine !== false) {
            try {
              const tr = await callFreeMyMemoryTranslate(res.word);
              if (tr && tr.translation) res.turkish = tr.translation.toLowerCase();
            } catch (e) { /* keep local */ }
          }
          return res;
        }
        case 'sentences':
          return localSentences(payload.text, payload.n);
        case 'quiz':
          return localQuiz(payload.text, payload.n);
        case 'story':
          return localStory(payload.text);
        case 'tr': {
          const local = localTranslate(payload.text);
          const raw = String(payload.text || '').trim();
          const unchanged = String(local.translation || '').toLowerCase() === raw.toLowerCase();
          // If it's a multi-word sentence or an unknown single word and we are online, try MyMemory
          if ((unchanged || (/\s/.test(raw) && !PHRASE_TR_TO_EN[raw.toLowerCase()] && !PHRASE_EN_TO_TR[raw.toLowerCase()])) && root.navigator.onLine !== false) {
            try {
              return await callFreeMyMemoryTranslate(raw);
            } catch (e) { /* fallback to local */ }
          }
          return local;
        }
        case 'check':
          return localCheck(payload.text);
        case 'ask':
          return localAsk(payload.text);
        case 'draw':
          return callFreeDraw(payload.subject, payload.sketch, timeoutMs);
        case 'neat':
          return localNeat(payload);
        default:
          return localAsk(payload.text || '');
      }
    }
  };

  root.SmartAI = AI;
})(window);
