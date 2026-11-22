/* Game Maker app. Two screens before play:
   1. HOME: Organized 2-Step Curriculum Library (Class + Grade + Unit + Skill filters, scannable Question Pack cards,
      1-tap Preview/Filter Questions) and Smartboard Game Shelf (Category tabs + 1-tap Quick Play or Setup).
   2. SET-UP: Game card preview on the left and all team, monster, timer, and mode options on the right.
   Then the game, then the podium. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {}, U = GM.u, h = U.h, btn = U.btn, A = GM.audio, KEY = 'eaa_gm_v2', CKEY = 'eaa_gm_sets_v1';
  var SOON = [];
  var TIMERS = [[0, 'Off'], [10, '10 s'], [20, '20 s'], [30, '30 s'], [45, '45 s']];
  /* Unified Platform Games Hub (25 Best-in-Class Vetted Games — Zero Duplicates! Smartboard, Tablet & Phone Ready):
     Unites all 8 Flagship 3D Adventure Park games, 11 best 2D Mystery/Words/Grammar/Skill games,
     2 Live Speaking Warmups, and the 4 sharpest tactile Game Maker skill modes (Alley Fling, Tower Stack, Baseball, Jigsaw Race). */
  var EXT_GAMES = [
    { id: 'ext-tug3d',     cat: 'park3d', phone: true, badge: '🪢 3D MEADOW',      k3d: true, mins: '10–15 min', teams: '2–4 Teams', sub3: '3D Rope Pull · Mud Puddle · Remember First & Speaking', name: 'Tug of War 3D', desc: 'Two teams pull opposite ends of the rope over a bubbling 3D mud puddle! Right answers yank rivals into the mud!', poster: '../games/posters/tug3d.jpg', url: '../games/tug3d/', previewUrl: '../games/tug3d/?demo=1&preview=1', steps: ['1. Revise with Remember First flashcards', '2. Answer right to yank the rope toward your side', '3. Pull the ribbon over your line to win!'] },
    { id: 'ext-penalty3d', cat: 'park3d', phone: true, badge: '⚽ 3D STADIUM',     k3d: true, mins: '8–12 min',  teams: '2–4 Teams', sub3: '3D Football Pitch · Hold & Pull Slingshot Stick · Beat the Keeper', name: 'Penalty Shootout 3D', desc: 'Answer right, then hold & pull back the slingshot stick into the green sweet-spot and release to bend it past the keeper!', poster: '../games/posters/penalty3d.jpg', url: '../games/penalty3d/', previewUrl: '../games/penalty3d/?demo=1&preview=1', steps: ['1. Answer right to earn your penalty kick', '2. Hold & pull back the slingshot stick to aim & power', '3. Release in the green sweet-spot to beat the keeper!'] },
    { id: 'ext-cannon3d',  cat: 'park3d', phone: true, badge: '💥 3D PHYSICS',     k3d: true, mins: '8–12 min',  teams: '2–4 Teams', sub3: '3D Meadow · Drag Aim · Pop Balloons & Bullseye', name: 'Monster Cannon 3D', desc: 'Answer right to hop into the 3D cannon! Aim against the wind, pop floating balloons, and hit the +50 Bullseye!', poster: '../games/posters/cannon3d.jpg', url: '../games/cannon3d/', previewUrl: '../games/cannon3d/?demo=1&preview=1', steps: ['1. Answer right to load your team monster', '2. Drag back to aim angle & power', '3. BOOM — pop balloons & hit the Bullseye!'] },
    { id: 'ext-race3d',    cat: 'park3d', phone: true, badge: '🏃 3D STADIUM',     k3d: true, mins: '8–12 min',  teams: '2–4 Teams', sub3: '3D Running Track · Sprint Boost · Photo Finish', name: 'Sprint Race 3D', desc: '3-2-1-GO! Answer right so your 3D runner sprints down the Adventure Park track and snaps the finish ribbon!', poster: '../games/posters/race3d.jpg', url: '../games/race3d/', previewUrl: '../games/race3d/?demo=1&preview=1', steps: ['1. Answer the curriculum question', '2. Your 3D runner sprints forward with dust puffs', '3. First team to snap the finish ribbon wins!'] },
    { id: 'ext-bowling3d', cat: 'park3d', phone: true, badge: '🎳 3D LANES',       k3d: true, mins: '10–15 min', teams: '2–4 Teams', sub3: 'One 3D Lane per Team · Aim & Power · Strikes', name: 'Bowling 3D', desc: 'Side-by-side glossy 3D maple lanes! Answer right, tap to lock your aim arrow & power, and scatter all 10 pins!', poster: '../games/posters/bowling3d.jpg', url: '../games/bowling3d/', previewUrl: '../games/bowling3d/?demo=1&preview=1', steps: ['1. Answer the question on your lane', '2. Tap to stop the aim arrow & lock power', '3. Knock down 3D pins — STRIKE = +5 bonus!'] },
    { id: 'ext-board3d',   cat: 'park3d', phone: true, badge: '🎲 3D BOARD',       k3d: true, mins: '15–20 min', teams: '2–4 Teams', sub3: '30 Squares · Giant 3D Die · Ladders & Slides', name: 'Board Game 3D', desc: 'Roll the Giant 3D Die across 30 pastel squares! Climb ladders, zoom down slides, and open the erupting Treasure Chest!', poster: '../games/posters/board3d.jpg', url: '../games/board3d/', previewUrl: '../games/board3d/?demo=1&preview=1', steps: ['1. Answer right to roll the Giant 3D Die', '2. Climb ladders, ride slides & collect stars', '3. First monster to the Treasure Chest wins!'] },
    { id: 'ext-bomb3d',    cat: 'park3d', phone: true, badge: '🎁 3D FUNFAIR',     k3d: true, mins: '10–15 min', teams: '2–4 Teams', sub3: '12 3D Gift Boxes · Stars, Swap, Double or BOOM', name: 'Bomb or Bonus 3D', desc: 'Answer right on the 3D Funfair stage and pick one of 12 numbered gift boxes: bonus stars, power swaps, or silly boom!', poster: '../games/posters/bomb3d.jpg', url: '../games/bomb3d/', previewUrl: '../games/bomb3d/?demo=1&preview=1', steps: ['1. Answer a question for your team', '2. Pick any of the 12 3D gift boxes', '3. Win +Stars, Swap, Steal, Double… or BOOM!'] },
    { id: 'ext-keepgive3d',cat: 'park3d', phone: true, badge: '🎀 3D STRATEGY',    k3d: true, mins: '10–15 min', teams: '2–4 Teams', sub3: '3D Gift Stage · Keep It or Give It to Rivals', name: 'Keep It or Give It 3D', desc: 'Pick a 3D mystery gift box and choose BEFORE it bursts open: KEEP IT for your team or GIVE IT to a rival!', poster: '../games/posters/keepgive.webp', url: '../games/bomb3d/?mode=keepgive', previewUrl: '../games/bomb3d/?mode=keepgive&demo=1&preview=1', steps: ['1. Answer right & choose a 3D gift box', '2. Decide: KEEP IT or GIVE IT to another team!', '3. Watch the box burst open on the 3D stage!'] },

    { id: 'ext-slice',     cat: 'action', phone: true, badge: '🍉 SWIPE / CAM',    k3d: false, mins: '6–10 min', teams: 'Phone & Board', sub3: 'Swipe Finger on Phone/Board or Wave Hands · Speaking & Choice', name: 'Fruit & Word Slice', desc: 'Swipe your finger across the sunny screen (or turn on Motion Cam) to slice the juicy fruit carrying the right word!', poster: '../games/posters/slice.webp', url: '../games/live/index.html?game=slice', previewUrl: '../games/live/index.html?game=slice&preview=1', steps: ['1. Revise with Remember First flashcards', '2. Swipe across or tap the right fruit', '3. Score +15 Stars per clean slice!'] },

    { id: 'ext-flashlight',cat: 'mystery', phone: true, badge: '🔦 HIDDEN PIC',    k3d: false, mins: '5–10 min', teams: 'Phone & Board', sub3: 'Golden Beam · Spoken Clue · Uncover & Tap', name: 'Flashlight Finder', desc: 'Sweep the glowing flashlight circle with your finger to spot and tap the hidden picture matching the clue!', poster: '../games/posters/flashlight.webp', url: '../games/reveal/index.html?game=flashlight', previewUrl: '../games/reveal/index.html?game=flashlight&preview=1', steps: ['1. Listen to or read the clue word', '2. Sweep the golden flashlight beam', '3. Tap the matching hidden picture!'] },
    { id: 'ext-doors',     cat: 'mystery', phone: true, badge: '🚪 HIDDEN PIC',    k3d: false, mins: '8–12 min', teams: '2–6 Teams', sub3: '8 Candy Doors · Spotlight Peek · Guess Early', name: 'Sneaky Doors', desc: 'Pick one of 8 candy double-doors, sneak a spotlight peek through the gap, and shout the word for max points!', poster: '../games/posters/doors.webp', url: '../games/reveal/index.html?game=doors', previewUrl: '../games/reveal/index.html?game=doors&preview=1', steps: ['1. Pick one of 8 numbered candy doors', '2. Sneak a spotlight peek inside', '3. Open wide & award the guessing team!'] },
    { id: 'ext-pixels',    cat: 'mystery', phone: true, badge: '🟪 HIDDEN PIC',    k3d: false, mins: '5–10 min', teams: 'Phone & Board', sub3: 'Sharpening Mosaic · 4 Word Choices · Fast Bonus', name: 'Pixel Quiz', desc: 'A blocky mosaic sharpens second by second — tap the right word choice early on phone or smartboard!', poster: '../games/posters/pixels.webp', url: '../games/reveal/index.html?game=pixels', previewUrl: '../games/reveal/index.html?game=pixels&preview=1', steps: ['1. Watch the mosaic sharpen over time', '2. Read the 4 word choices', '3. Tap the matching word before rivals!'] },
    { id: 'ext-croc',      cat: 'mystery', phone: true, badge: '🐊 SUSPENSE',      k3d: false, mins: '6–10 min', teams: 'Phone & Board', sub3: 'Press a Tooth · +10 Safe Stars · Dodge the Snap', name: 'Crocodile Snap', desc: 'Answer right and press any shiny white crocodile tooth for +10 Stars — just avoid the 1 secret sore tooth!', poster: '../games/posters/croc.webp', url: '../games/prize/index.html?game=croc', previewUrl: '../games/prize/index.html?game=croc&preview=1', steps: ['1. Answer right to earn a tooth press', '2. Tap any shiny white tooth (+10 ⭐)', '3. Watch out for the silly SNAP!'] },
    { id: 'ext-cups',      cat: 'mystery', phone: true, badge: '🏠 TRACKING',      k3d: false, mins: '8–12 min', teams: 'Phone & Board', sub3: '3 Shuffling Cottages · Track the Golden Trophy', name: '3-House Cup Shuffle', desc: 'Keep your eyes on the cottage hiding the Golden Trophy as all 3 shuffle across the screen!', poster: '../games/posters/cups.webp', url: '../games/prize/index.html?game=cups', previewUrl: '../games/prize/index.html?game=cups&preview=1', steps: ['1. See where the Golden Trophy hides', '2. Follow the 3 cottages as they shuffle', '3. Answer right & tap the winning cottage!'] },

    { id: 'ext-timetrain', cat: 'word',   phone: true, badge: '🚂 GRAMMAR',        k3d: false, mins: '8–15 min', teams: 'Phone & Board', sub3: 'Past Gate · Didn\'t Bridge · Did Tower', name: 'Time Train', desc: 'Ride through 3 magical railway stations mastering Past Simple positives, didn\'t verb-rewind, and Did…? questions!', poster: '../games/posters/time-train.webp', url: '../games/past/index.html', previewUrl: '../games/past/index.html?preview=1', steps: ['1. Past Gate: pick the past-tense ticket', '2. Didn\'t Bridge: watch the verb rewind to base', '3. Did Tower: build the Did…? question!'] },
    { id: 'ext-builder',   cat: 'word',   phone: true, badge: '🧱 SENTENCES',      k3d: false, mins: '8–12 min', teams: 'Phone & Board', sub3: 'Scrambled Word Blocks · Snap Full Sentence', name: 'Sentence Builder', desc: 'Tap scrambled word blocks in order to snap together a complete English sentence and hear it read aloud!', poster: '../games/posters/builder.webp', url: '../games/words/index.html?game=builder', previewUrl: '../games/words/index.html?game=builder&preview=1', steps: ['1. Look at the story picture clue', '2. Tap word blocks in grammar order', '3. Read the finished sentence aloud together!'] },
    { id: 'ext-bubbles',   cat: 'word',   phone: true, badge: '🫧 SPELLING',       k3d: false, mins: '6–10 min', teams: 'Phone & Board', sub3: 'Floating Letter Bubbles · Pop in Order', name: 'Bubble Word Garden', desc: 'See the picture, hear the word, and pop floating pastel letter bubbles in exact spelling order!', poster: '../games/posters/bubbles.webp', url: '../games/words/index.html?game=bubbles', previewUrl: '../games/words/index.html?game=bubbles&preview=1', steps: ['1. Hear & see the vocabulary picture', '2. Pop floating letters in spelling order', '3. Bloom the garden flower for +10 Stars!'] },
    { id: 'ext-prep',      cat: 'word',   phone: true, badge: '🐱 PREPOSITIONS',   k3d: false, mins: '6–10 min', teams: 'Phone & Board', sub3: 'Move Kitty · ON / IN / UNDER / NEXT TO', name: 'Preposition Room', desc: 'Listen to the instruction and tap the cozy bedroom spot so Kitty jumps ON, IN, UNDER, or NEXT TO it!', poster: '../games/posters/prep.webp', url: '../games/scene/index.html?game=prep', previewUrl: '../games/scene/index.html?game=prep&preview=1', steps: ['1. Hear where Kitty wants to go', '2. Tap ON, IN, UNDER or NEXT TO the furniture', '3. Watch Kitty leap there & say the sentence!'] },
    { id: 'ext-bingo',     cat: 'word',   phone: true, badge: '🔢 LISTENING',      k3d: false, mins: '6–10 min', teams: 'Phone & Board', sub3: 'Spoken Caller · 3×3 Picture Grid · BINGO!', name: 'Picture Bingo', desc: 'Listen to the spoken word clue, stamp the matching picture on your 3×3 board, and make a line of 3!', poster: '../games/posters/bingo.webp', url: '../games/words/index.html?game=bingo', previewUrl: '../games/words/index.html?game=bingo&preview=1', steps: ['1. Listen to the spoken caller word', '2. Tap the matching picture on the 3×3 grid', '3. Complete 3 in a row for +25 BINGO!'] },
    { id: 'ext-pairs',     cat: 'word',   phone: true, badge: '🃏 MEMORY',         k3d: false, mins: '6–10 min', teams: 'Phone & Board', sub3: 'Flip Cards · Match Pictures, Words & Audio', name: 'Matching Pairs', desc: 'Flip pastel cards on phone or smartboard to match every vocabulary picture with its spoken word!', poster: '../games/posters/pairs.webp', url: '../games/words/index.html?game=pairs', previewUrl: '../games/words/index.html?game=pairs&preview=1', steps: ['1. Flip any two pastel cards', '2. Match picture with its English word', '3. Clear all pairs to win!'] },

    { id: 'ext-simonsays', cat: 'speak',  phone: true, badge: '🦉 TPR LIVE',       k3d: false, mins: '5–10 min',  teams: 'Whole Class', sub3: 'Spoken Voice Commands · Do It Only If Simon Says!', name: 'Simon Says Live', desc: 'Active TPR listening & movement game for Grade 3 and Grade 4 — listen closely and only move when Simon says!', poster: '../assets/shelf/simon-says-grade3.webp', url: '../simon-says/index.html', previewUrl: '../simon-says/index.html', steps: ['1. Pick Grade 3 or Grade 4 & tap Start', '2. Listen to Simon\'s spoken action command', '3. Move ONLY when it starts with "Simon says…"!'] },
    { id: 'ext-telpic',    cat: 'speak',  phone: true, badge: '📞 DRAW & PASS',    k3d: false, mins: '10–15 min', teams: 'Groups of 4–6', sub3: 'Write a Sentence · Draw It · Fold & Pass!', name: 'Telephone Pictionary', desc: 'Hilarious group writing & drawing relay with built-in timer, sentence starters, and reveal prompts!', poster: '../platform-art/h_pencil.webp', url: '../telephone-pictionary/index.html', previewUrl: '../telephone-pictionary/index.html', steps: ['1. Pupil 1 secretly writes a starter sentence', '2. Next pupil draws it, folds, and passes', '3. Unfold at the end & read the funny chain aloud!'] }
  ];
  var ORDER = ['fling', 'tower', 'baseball', 'jigsaw'];
  var GM_PHONE = { fling: true, tower: true, baseball: true, jigsaw: true };
  var GM_MINS = { fling: '8–12 min', tower: '6–10 min', baseball: '8–12 min', jigsaw: '8–12 min' };
  var GAME_CATS = [
    ['all',     '⭐ All Games (26)', null],
    ['park3d',  '🌍 3D Park (8)', ['ext-tug3d', 'ext-penalty3d', 'ext-cannon3d', 'ext-race3d', 'ext-bowling3d', 'ext-board3d', 'ext-bomb3d', 'ext-keepgive3d']],
    ['action',  '🎯 Action & Skill (5)', ['fling', 'tower', 'baseball', 'jigsaw', 'ext-slice']],
    ['mystery', '🔍 Mystery & Suspense (5)', ['ext-flashlight', 'ext-doors', 'ext-pixels', 'ext-croc', 'ext-cups']],
    ['word',    '🔤 Words & Grammar (6)', ['ext-timetrain', 'ext-builder', 'ext-bubbles', 'ext-prep', 'ext-bingo', 'ext-pairs']],
    ['speak',   '🎤 Live Speaking (2)', ['ext-simonsays', 'ext-telpic']]
  ];
  var HOW = {
    race: ['3-2-1-GO! Monsters line up on the pastel racetrack.', 'Answer right to spin a Turbo Boost, fly past rivals with dust puffs, and shake the camera!', 'First to snap the finish ribbon wins +50 bonus points on the podium!'],
    cannon: ['Answer right to hop into the cannon.', 'Drag back from the cannon to aim against the wind and let go!', 'Pop balloons (10 to 50 pts), hit the Bullseye (+50), or land in the haystack (+15)!'],
    fling: ['Two teams battle across the backyard fence with shifting stances, strong wind, and a patrolling Wasp hazard!', 'Answer right, then Step 1: Lock your Throw Angle (20°–78°), and Step 2: Time the fast Power Bar (or pull the slingshot manually)!', 'Headshots score +35, Body Hits +25, Yard Knockouts +30 — hitting the fence or missing wide scores 0!'],
    boardgame: ['Roll the 3D dice to hop around the 24-square Speaking Monopoly & Trade loop!', 'Speak the target sentence aloud to claim properties, complete Color Set Monopolies (2× Houses & 3× Castles), and collect rent!', 'Tap 🤝 Propose Trade on your turn to negotiate property swaps with other teams in English!'],
    board: ['A team picks a mystery box.', 'Answer the question to open it.', 'Bonus or bomb? The box shakes… and bursts open!'],
    plinko: ['Answer the question right.', 'Pick a column and drop your disc.', 'It bounces into a points slot. The big slot is in the middle!'],
    hunt: ['Answer right to get a digging number.', 'Your monster digs a line of that many squares.', 'Find treasure: coins, gems, trophies and crowns!'],
    ttt: ['Two teams.', 'Answer right to put your monster on a square.', 'Three in a row wins the round.'],
    connect4: ['Two teams.', 'Answer right to drop your disc in a column.', 'Four in a row wins the round.'],
    bowling: ['Answer right, then time 3 skill steps: Stand Position, Aim Angle (at the lane arrows), and Power + Hook!', 'Angle into the 1-3 or 1-2 pocket for a STRIKE — hitting the headpin dead-center leaves a SPLIT!', 'Use your second ball to pick up spares without rolling into the gutter!'],
    pass: ['A fizzing bomb with a burning fuse goes round the circle of teams.', 'Answer right (+5) to toss it on — watch it grow and shake faster as time runs out!', 'When it goes POOF, every other team wins +10 Safe points!'],
    penalty: ['Answer right inside the live 3D Stadium (1st try ignites 🔥 Golden Super Shot!).', 'Swipe the 3D ball forward/curved — OR drag the 3D goal target & time the Sweet-Spot Power Meter!', 'Smash spinning 🌟 Top-Bins Stars for +35, or switch on 🧤 Rival Team Keeper for a live 2-team duel!'],
    whack: ['Answer right to start a 15-second 3D Whack-a-Word wave!', 'Whack ONLY the moles holding the Target Word to build a 3× Combo Streak (and tap 2-hit Boss Moles twice!).', 'Do NOT whack wrong decoy words — they reset your combo and stun your hammer!'],
    tower: ['Answer right to get crane blocks as the crane swings faster with every floor!', 'Overhanging edges are permanently sliced off — your next block is only as wide as what remains!', 'Land a 🌟 Perfect Drop (<8px) for +15 points and +10px bonus width!'],
    balloon: ['Read and listen to the question in the top banner.', 'Pop the fast-weaving answer balloon before it escapes twice — and avoid the 💣 Storm Trap balloon!', 'Right balloon scores +20 (+5 Fast Pop bonus); wrong balloons or traps score 0!'],
    baseball: ['Answer right to face 3 live pitch types: 🔥 Fastball, 🌀 Curveball, and 🍃 Changeup!', 'Time the fast swing needle in the center sweet spot for a Single, Double, Triple, or Home Run!', 'Swinging late or early hits a Foul Ball or a Strike Out (0 points)!'],
    jigsaw: ['Two teams race side-by-side on their own 12-piece puzzle.', 'Answer right to earn a puzzle piece and drag it into place.', 'Wrong answer gives the other team a STEAL question worth 2 pieces!'],
    snakes: ['Answer right to roll the big 3D dice (1 to 6).', 'Watch your monster hop along the numbered board squares.', 'Climb up ladders for +10 bonus, slide down snakes, and reach the finish!'],
    storydice: ['Press Roll: the dice show pictures from your questions.', 'Make a sentence or a little story with ALL the pictures. Say it out loud!', 'The teacher gives stars: 5, 10 or 15 points. Nobody loses points.'],
    bingo: ['The game reads a clue (it is spoken aloud).', 'The team whose turn it is taps the answer on the big board.', 'Win a square for +10. A line of your colour is a BINGO: +25!'],
    guesseroo: ['One secret card is hidden. Teams take turns asking a yes/no question out loud.', 'The teacher taps Yes or No. Tap cards to cross them out.', 'Tap 🎯 when your team knows it: the fewer the questions, the more points!'],
    memory: ['Flip two cards in 3D to match each Question with its Answer!', 'When you match, read the sentence aloud (+20) as the cards fly to your score and sparkle!', 'Match 3 pairs in a row for a flashing +15 Streak Bonus!']
  };
  var S = GM.state = {
    screen: 'home',
    setId: 'g3-u5-mega',
    modeId: 'fling',
    theme: 'classic',
    classId: '',
    qGrade: '3',
    qUnit: 'all',
    qSkill: 'all',
    gameCat: 'all',
    packOpen: false,
    searchQ: '',
    cfg: { teams: 2, timer: 0, rem: 1, pu: {} },
    teams: [],
    groups: {},
    picks: {},
    items: []
  };
  var customSets = [], stage;

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d) {
        ['setId', 'modeId', 'theme', 'classId', 'qGrade', 'qUnit', 'qSkill', 'gameCat'].forEach(function (k) { if (d[k]) S[k] = d[k]; });
        if (S.qGrade === 'mix') { S.qGrade = 'all'; S.qUnit = 'mix'; }
        if (d.cfg) S.cfg = Object.assign(S.cfg, d.cfg);
        if (d.groups && typeof d.groups === 'object') S.groups = d.groups;
        if (d.picks && typeof d.picks === 'object') S.picks = d.picks;
      }
    } catch (e) { /* private window */ }
    try { customSets = JSON.parse(localStorage.getItem(CKEY) || '[]') || []; } catch (e) { customSets = []; }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        setId: S.setId, modeId: S.modeId, theme: S.theme, classId: S.classId,
        qGrade: S.qGrade, qUnit: S.qUnit, qSkill: S.qSkill, gameCat: S.gameCat,
        cfg: S.cfg, groups: S.groups || {}, picks: S.picks || {}
      }));
    } catch (e) { /* ignore */ }
  }
  function saveSets() { try { localStorage.setItem(CKEY, JSON.stringify(customSets)); } catch (e) { /* ignore */ } }
  function allSets() { return GM.sets.filter(function (s) { return GM.halloweenOn || s.id !== 'halloween'; }).concat(customSets); }
  function curSet() { return allSets().filter(function (s) { return s.id === S.setId; })[0] || allSets()[0]; }
  function applyTheme(where) { if (!GM.halloweenOn && S.theme === 'halloween') S.theme = 'classic'; document.body.className = 'th-' + S.theme + ' gm-on-' + (where || S.screen); }
  function modeName(m) { return (!GM.halloweenOn && m.nameClassic) || m.name; }
  function modeDesc(m) { return (!GM.halloweenOn && m.descClassic) || m.desc; }
  function cardArt(id, e) { return U.art(GM.halloweenOn && S.theme === 'halloween' && U.hasArt('m_mode_' + id) ? 'm_mode_' + id : 'card_' + id, e, 'gm-cardimg'); }

  function getSetGrade(s) {
    return s.grade || (/-g3\b/.test(s.id) ? 3 : /-g4\b/.test(s.id) ? 4 : 0);
  }
  function getSetUnit(s) {
    if (typeof s.unit === 'number') return s.unit;
    var m = /^u([1-5])-|-u([1-5])\b/.exec(s.id);
    if (m) return +(m[1] || m[2]);
    if (/^mona-|^angry-|^show-/.test(s.id)) return 4;
    if (/^moon-/.test(s.id)) return 2;
    return 0;
  }
  function getSetSkill(s) {
    return s.skill || (/-voc$/.test(s.id) ? 'words' : /-past$|-modals$/.test(s.id) ? 'sentences' : /-read$/.test(s.id) ? 'reading' : '');
  }

  function setMatchesFilter(s) {
    var g = getSetGrade(s);
    var u = getSetUnit(s);
    var sk = getSetSkill(s);

    /* 1. Grade check */
    if (S.qGrade === '3' && g !== 3 && !s.custom) return false;
    if (S.qGrade === '4' && g !== 4 && !s.custom) return false;

    /* 2. Unit check */
    if (S.qUnit === 'mix') {
      if (u !== 0 && !s.smart && !s.custom) return false;
    } else if (S.qUnit !== 'all') {
      if (u !== +S.qUnit) return false;
    }

    /* 3. Skill check */
    if (S.qSkill === 'all') {
      /* In 'All / Full Units' view, show full unit packs, mixed packs, and the 2 main Easy Speaking packs (hide granular per-unit skill subsets) */
      if (s.skillOnly) return false;
      if (sk && sk !== 'speaking' && !s.showInAll) return false;
      return true;
    }
    return sk === S.qSkill;
  }

  function sortFilteredSets(list) {
    function rank(s) {
      var u = getSetUnit(s);
      if (u === 5 && !s.skillOnly) return 5;
      if (u === 5) return 8;
      if (s.id === 'u14-g3' || s.id === 'u14-g4') return 10;
      if (s.id === 'speak-g3' || s.id === 'speak-g4') return 15;
      if (u === 4 && !s.skillOnly) return 20;
      if (u === 4) return 25;
      if (u === 3) return 30;
      if (u === 2) return 40;
      if (u === 1) return 50;
      if (s.smart) return 60;
      return 70;
    }
    return list.slice().sort(function (a, b) {
      var ra = rank(a), rb = rank(b);
      if (ra !== rb) return ra - rb;
      return (a.grade || 0) - (b.grade || 0);
    });
  }

  function ensureValidSet() {
    var matching = sortFilteredSets(allSets().filter(setMatchesFilter));
    if (matching.length && !matching.some(function (s) { return s.id === S.setId; })) {
      S.setId = matching[0].id;
      save();
    }
    return matching;
  }

  /* ---------- HOME ---------- */
  function parseSet(text) {
    var items = [];
    text.split(/\r?\n/).forEach(function (line) {
      line = line.trim(); if (!line || line[0] === '#') return; var p = line.split('|').map(function (x) { return x.trim(); }).filter(function (x) { return x; });
      if (p.length >= 3) items.push({ q: p[0], a: p[1], w: p.slice(2, 5), pic: '' });
    });
    return items;
  }

  function home() {
    var matchingSets = ensureValidSet();
    var activeSet = curSet();
    var wrap = h('div', { class: 'gm-home' });

    var classes = (GM.mon && GM.mon.classes) ? GM.mon.classes() : [];
    var pk = !activeSet.smart && (S.picks || {})[activeSet.id];
    var totalQ = activeSet.items ? activeSet.items.length : 20;
    var activeQText = (pk && pk.length) ? (pk.length + '/' + totalQ + ' Qs') : (totalQ + ' Qs');

    /* =========================================================================
       COMPACT UNIFIED CONTROL BAR (Games First — Visible Above the Fold on Phone/Tablet/Board!)
       ========================================================================= */
    var topCtrl = h('div', { class: 'gm-unified-bar' });

    var barLeft = h('div', { class: 'gm-ubar-left' });
    barLeft.appendChild(h('div', { class: 'gm-ubar-brand' }, [
      h('b', { text: '🎮 All Games' }),
      h('small', { text: '26 Best-in-Class · Phone, Tablet & Smartboard' })
    ]));

    if (classes.length) {
      var clsBox = h('div', { class: 'gm-lib-classes gm-ubar-classes' });
      [['', 'All']].concat(classes.map(function (c) { return [c.id, c.label]; })).forEach(function (c) {
        var b = h('button', { type: 'button', class: 'gm-class-pill' + (S.classId === c[0] ? ' sel' : ''), text: c[1] });
        b.addEventListener('click', function () {
          A.play('tap');
          S.classId = c[0];
          S.teams = [];
          if (c[0]) {
            var isG4 = /4/.test(c[0]) || /4/.test(c[1]);
            S.qGrade = isG4 ? '4' : '3';
          } else {
            S.qGrade = 'all';
          }
          ensureValidSet();
          save();
          render();
        });
        clsBox.appendChild(b);
      });
      barLeft.appendChild(clsBox);
    }

    var packToggleBtn = h('button', {
      type: 'button',
      class: 'gm-pack-toggle' + (S.packOpen ? ' open' : ''),
      title: 'Choose curriculum question pack, speaking set, or custom questions'
    }, [
      h('span', { class: 'gm-pt-ic', text: activeSet.e || '📚' }),
      h('span', { class: 'gm-pt-txt' }, [
        h('b', { text: activeSet.title }),
        h('small', { text: activeQText + (S.packOpen ? ' · Hide Packs ▲' : ' · Change Pack ▼') })
      ])
    ]);
    packToggleBtn.addEventListener('click', function () {
      A.play('tap');
      S.packOpen = !S.packOpen;
      render();
    });

    var searchInput = h('input', {
      type: 'search',
      class: 'gm-game-search',
      placeholder: '🔍 Search 47 games…',
      value: S.searchQ || '',
      'aria-label': 'Search all games'
    });

    var barRight = h('div', { class: 'gm-ubar-right' }, [packToggleBtn, searchInput]);
    topCtrl.appendChild(barLeft);
    topCtrl.appendChild(barRight);
    wrap.appendChild(topCtrl);

    /* =========================================================================
       COLLAPSIBLE CURRICULUM & QUESTION PACK DRAWER (Opens on Tap!)
       ========================================================================= */
    var libPanel = h('div', { class: 'gm-lib-panel' + (S.packOpen ? ' is-open' : ' is-collapsed') });
    if (S.packOpen) {
      var toolsRow = h('div', { class: 'gm-lib-tools' });
      if (!activeSet.smart && GM.tools && totalQ > 1) {
        var filterBtn = h('button', {
          type: 'button',
          class: 'gm-tool-pill cyan',
          text: '🔍 ' + ((pk && pk.length) ? (pk.length + '/' + totalQ + ' Qs Chosen') : ('Preview / Filter (' + totalQ + ' Qs)'))
        });
        filterBtn.addEventListener('click', function () {
          A.play('tap');
          GM.tools.chooseQuestions(activeSet, pk, function (arr) {
            S.picks = S.picks || {};
            if (arr.length) S.picks[activeSet.id] = arr;
            else delete S.picks[activeSet.id];
            save();
            render();
          });
        });
        toolsRow.appendChild(filterBtn);
      }
      if (GM.rev) {
        var warmBtn = h('button', { type: 'button', class: 'gm-tool-pill amber', text: '🔁 Warm-up' });
        warmBtn.addEventListener('click', function () {
          A.play('tap');
          GM.rev.remember(activeSet.items, { points: 6, check: 3 }, function () {});
        });
        toolsRow.appendChild(warmBtn);

        var dailyBtn = h('button', { type: 'button', class: 'gm-tool-pill amber', text: '🧠 Daily 5' });
        dailyBtn.addEventListener('click', function () { A.play('tap'); GM.rev.daily(); });
        toolsRow.appendChild(dailyBtn);

        var exitBtn = h('button', { type: 'button', class: 'gm-tool-pill ghost', text: '📝 Exit Ticket' });
        exitBtn.addEventListener('click', function () { A.play('tap'); GM.rev.exitTicket(activeSet.items); });
        toolsRow.appendChild(exitBtn);
      }

      var builder;
      var newSetBtn = h('button', { type: 'button', class: 'gm-tool-pill ghost', text: '➕ Custom Set' });
      newSetBtn.addEventListener('click', function () { A.play('tap'); if (builder) builder.classList.toggle('open'); });
      toolsRow.appendChild(newSetBtn);

      var donePackBtn = h('button', { type: 'button', class: 'gm-tool-pill green', text: '✓ Done' });
      donePackBtn.addEventListener('click', function () { A.play('tap'); S.packOpen = false; render(); });
      toolsRow.appendChild(donePackBtn);

      var libHead = h('div', { class: 'gm-lib-head' }, [
        h('div', { class: 'gm-lib-title' }, [
          h('span', { class: 'gm-step-badge', text: 'PACKS' }),
          h('b', { text: '📚 Choose Question or Speaking Pack' })
        ]),
        toolsRow
      ]);
      libPanel.appendChild(libHead);

      /* Filter Row 1: Grade + Unit */
      var fRow1 = h('div', { class: 'gm-filter-bar' });
      fRow1.appendChild(h('span', { class: 'gm-filter-lab', text: '🎓 Grade' }));
      [['all', 'All Grades'], ['3', 'Grade 3'], ['4', 'Grade 4']].forEach(function (g) {
        var b = h('button', { type: 'button', class: 'gm-ftab' + (S.qGrade === g[0] ? ' sel' : ''), text: g[1] });
        b.addEventListener('click', function () { A.play('tap'); S.qGrade = g[0]; ensureValidSet(); save(); render(); });
        fRow1.appendChild(b);
      });
      fRow1.appendChild(h('span', { class: 'gm-filter-sep' }));
      fRow1.appendChild(h('span', { class: 'gm-filter-lab', text: '📘 Unit' }));
      [
        ['all', 'All Units'],
        ['5', '⭐ Unit 5 (Current)'],
        ['4', 'Unit 4'],
        ['3', 'Unit 3'],
        ['2', 'Unit 2'],
        ['1', 'Unit 1'],
        ['mix', '🔁 Units 1–4 Mix & Smart']
      ].forEach(function (u) {
        var b = h('button', { type: 'button', class: 'gm-ftab' + (S.qUnit === u[0] ? ' sel' : ''), text: u[1] });
        b.addEventListener('click', function () { A.play('tap'); S.qUnit = u[0]; ensureValidSet(); save(); render(); });
        fRow1.appendChild(b);
      });
      libPanel.appendChild(fRow1);

      /* Filter Row 2: Skill */
      var fRow2 = h('div', { class: 'gm-filter-bar' });
      fRow2.appendChild(h('span', { class: 'gm-filter-lab', text: '🎯 Skill' }));
      [
        ['all', '📚 Full Units & Reviews'],
        ['speaking', '🎤 Easy Speaking & Acting'],
        ['words', '📝 Words'],
        ['sentences', '💬 Sentences'],
        ['reading', '📖 Reading'],
        ['sounds', '🔤 Sounds'],
        ['listen', '🎧 Listening']
      ].forEach(function (sk) {
        var b = h('button', { type: 'button', class: 'gm-ftab' + (S.qSkill === sk[0] ? ' sel' : ''), text: sk[1] });
        b.addEventListener('click', function () { A.play('tap'); S.qSkill = sk[0]; ensureValidSet(); save(); render(); });
        fRow2.appendChild(b);
      });
      libPanel.appendChild(fRow2);

      /* Organized Question Pack Cards Grid */
      var packGrid = h('div', { class: 'gm-pack-grid' });
      if (!matchingSets.length) {
        matchingSets = sortFilteredSets(allSets());
      }
      matchingSets.forEach(function (s) {
        var isSel = s.id === S.setId;
        var g = getSetGrade(s);
        var u = getSetUnit(s);
        var sk = getSetSkill(s);
        var sPicks = !s.smart && (S.picks || {})[s.id];
        var qCount = s.smart ? 20 : (s.items ? s.items.length : 0);
        var countLabel = (sPicks && sPicks.length) ? (sPicks.length + '/' + qCount + ' Qs') : (qCount + ' Qs');

        var badges = h('div', { class: 'gm-pack-badges' });
        if (g === 3 || g === 4) badges.appendChild(h('span', { class: 'gm-pbadge g' + g, text: 'Grade ' + g }));
        if (u >= 1 && u <= 5) badges.appendChild(h('span', { class: 'gm-pbadge u', text: 'Unit ' + u }));
        else if (s.smart) badges.appendChild(h('span', { class: 'gm-pbadge mix', text: 'Adaptive' }));
        else badges.appendChild(h('span', { class: 'gm-pbadge mix', text: 'Units 1–4' }));
        if (sk === 'speaking') badges.appendChild(h('span', { class: 'gm-pbadge spk', text: '🎤 Speaking' }));
        badges.appendChild(h('span', { class: 'gm-pbadge cnt', text: countLabel }));

        var card = h('button', {
          type: 'button',
          class: 'gm-pack-card' + (isSel ? ' sel' : '')
        }, [
          h('div', { class: 'gm-pack-ic', text: s.e || '📚' }),
          h('div', { class: 'gm-pack-body' }, [
            badges,
            h('b', { class: 'gm-pack-title', text: s.title }),
            s.sub ? h('small', { class: 'gm-pack-sub', text: s.sub }) : null
          ]),
          isSel ? h('span', { class: 'gm-pack-check', text: '✓ Active' }) : null
        ]);

        card.addEventListener('click', function () {
          A.play('tap');
          S.setId = s.id;
          S.packOpen = false;
          save();
          render();
        });

        if (s.custom) {
          var d = h('span', { class: 'gm-del', title: 'Delete this set', text: '✕' });
          d.addEventListener('click', function (e) {
            e.stopPropagation();
            if (d.dataset.sure) {
              customSets = customSets.filter(function (x) { return x.id !== s.id; });
              saveSets();
              if (S.setId === s.id) S.setId = GM.sets[0].id;
              render();
            } else {
              d.dataset.sure = 1;
              d.textContent = 'Delete?';
            }
          });
          card.appendChild(d);
        }
        packGrid.appendChild(card);
      });
      libPanel.appendChild(packGrid);

      var title = h('input', { class: 'gm-input', placeholder: 'Name of the set (for example: Unit 5 Extra Words)', maxlength: '60' });
      var ta = h('textarea', { class: 'gm-input', rows: '5', placeholder: 'One question on each line:\nShe ____ a new hobby. | began | will | could\nWhat is a baby cat? | kitten | puppy | duck' });
      var msg = h('div', { class: 'gm-hint', text: 'Write:  question | right answer | wrong answer | wrong answer   (use ____ for the gap).' });
      builder = h('div', { class: 'gm-builder' }, [title, ta, msg, btn('💾 Save this set', 'green', function () {
        var items = parseSet(ta.value);
        if (!title.value.trim() || items.length < 3) {
          msg.textContent = 'Please write a name and at least 3 lines like:  question | right | wrong | wrong';
          U.wobble(msg);
          return;
        }
        var id = 'my-' + Date.now();
        customSets.push({ id: id, title: title.value.trim(), sub: 'Custom Teacher Set', e: '📝', custom: true, unit: 0, items: items });
        saveSets();
        S.setId = id;
        S.packOpen = false;
        save();
        render();
      })]);
      libPanel.appendChild(builder);
      wrap.appendChild(libPanel);
    }

    /* =========================================================================
       UNIFIED 47-GAME ARCADE SHELF (Phone, Tablet & Smartboard)
       ========================================================================= */
    var gPanel = h('div', { class: 'gm-games-panel' });
    var activeCat = GAME_CATS.filter(function (c) { return c[0] === S.gameCat; })[0] || GAME_CATS[0];

    var catTabs = h('div', { class: 'gm-filter-bar gm-cat-tabs' });
    GAME_CATS.forEach(function (cat) {
      var b = h('button', { type: 'button', class: 'gm-ftab' + (activeCat[0] === cat[0] ? ' sel' : ''), text: cat[1] });
      b.addEventListener('click', function () { A.play('tap'); S.gameCat = cat[0]; save(); render(); });
      catTabs.appendChild(b);
    });
    gPanel.appendChild(catTabs);

    function buildExtLaunchUrl(ext) {
      var base = ext.url;
      var joiner = base.indexOf('?') >= 0 ? '&' : '?';
      var params = ['from=gm'];
      if (S.classId) params.push('class=' + encodeURIComponent(S.classId));
      if (S.setId) params.push('set=' + encodeURIComponent(S.setId) + '&pack=' + encodeURIComponent(S.setId));
      try {
        var gp = JSON.parse(localStorage.getItem('eaa_games_prefs') || '{}') || {};
        if (S.classId) gp.classId = S.classId;
        gp.qpack = S.setId;
        gp.pz_pack = S.setId;
        localStorage.setItem('eaa_games_prefs', JSON.stringify(gp));
      } catch (e0) {}
      return base + joiner + params.join('&');
    }

    function openExtPreviewModal(ext) {
      A.play('tap');
      var ov = h('div', { class: 'gm-prev-modal' });
      var close = function () { ov.remove(); };
      var card = h('div', { class: 'gm-prev-card' }, [
        h('div', { class: 'gm-prev-head' }, [
          h('h3', { text: ext.badge.split(' ')[0] + ' ' + ext.name + ' · Live Preview' }),
          h('button', { type: 'button', class: 'gm-btn sm ghost', text: '✕ Close', onclick: close })
        ]),
        h('div', { class: 'gm-prev-stage' }, [
          h('iframe', { src: ext.previewUrl || ext.url, title: ext.name + ' preview', loading: 'eager' })
        ]),
        h('div', { class: 'gm-prev-steps' }, (ext.steps || []).map(function (st) {
          return h('div', { class: 'gm-prev-step', text: st });
        })),
        h('div', { class: 'gm-prev-foot' }, [
          h('button', { type: 'button', class: 'gm-btn ghost', text: 'Close', onclick: close }),
          h('button', {
            type: 'button',
            class: 'gm-btn green',
            text: '▶ Play Now',
            onclick: function () { A.play('start'); location.href = buildExtLaunchUrl(ext); }
          })
        ])
      ]);
      ov.addEventListener('click', function (ev) { if (ev.target === ov) close(); });
      ov.appendChild(card);
      document.body.appendChild(ov);
    }

    var grid = h('div', { class: 'gm-games' });

    function matchesSearch(hay) {
      var q = String(S.searchQ || '').trim().toLowerCase();
      if (!q) return true;
      return hay.toLowerCase().indexOf(q) >= 0;
    }

    function paintGrid() {
      grid.innerHTML = '';
      var countShown = 0;

      /* 1. Render Curated 3D Adventure Park, EasyPeasy & Classroom Games */
      EXT_GAMES.forEach(function (ext) {
        if (activeCat[2] === 'PHONE') {
          if (!ext.phone) return;
        } else if (Array.isArray(activeCat[2]) && activeCat[2].indexOf(ext.id) < 0) {
          return;
        }
        if (!matchesSearch(ext.name + ' ' + ext.badge + ' ' + ext.sub3 + ' ' + ext.desc + ' ' + ext.id)) return;
        countShown++;

        var launchBtn = h('button', {
          type: 'button',
          class: 'gm-gcard-btn play' + (ext.k3d ? ' park3d' : ''),
          title: 'Launch game now!',
          text: ext.k3d ? '🌍 Play 3D' : '▶ Play'
        });
        launchBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          A.play('start');
          save();
          location.href = buildExtLaunchUrl(ext);
        });

        var prevBtn = h('button', {
          type: 'button',
          class: 'gm-gcard-btn setup',
          title: 'Watch 3-step live gameplay preview',
          text: '🎬 Preview'
        });
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          openExtPreviewModal(ext);
        });

        var picBox = h('div', { class: 'gm-game-pic' }, [
          h('img', { class: 'gm-cardimg', src: ext.poster, alt: ext.name, loading: 'lazy', decoding: 'async' }),
          h('span', { class: 'gm-game-kbadge' + (ext.k3d ? ' k3d' : ''), text: ext.badge }),
          h('span', { class: 'gm-game-tbadge', text: '👥 ' + ext.teams }),
          h('span', { class: 'gm-game-time', text: '⏱ ' + ext.mins })
        ]);

        var c = h('div', { class: 'gm-game', tabindex: '0', role: 'button' }, [
          picBox,
          h('div', { class: 'gm-game-cap' }, [
            h('span', { class: 'gm-game-sub3', text: ext.sub3 }),
            h('b', { text: ext.name }),
            h('small', { class: 'gm-game-desc', text: ext.desc }),
            h('div', { class: 'gm-game-actions' }, [launchBtn, prevBtn])
          ])
        ]);
        c.addEventListener('click', function () {
          A.play('start');
          save();
          location.href = buildExtLaunchUrl(ext);
        });
        grid.appendChild(c);
      });

      /* 2. Render Kept Tactile Game Maker Skill & Board Modes */
      ORDER.forEach(function (id) {
        var m = GM.modes[id];
        if (!m) return;
        if (activeCat[2] === 'PHONE') {
          if (!GM_PHONE[id]) return;
        } else if (Array.isArray(activeCat[2]) && activeCat[2].indexOf(id) < 0) {
          return;
        }
        var nm = modeName(m), ds = modeDesc(m);
        if (!matchesSearch(nm + ' ' + ds + ' ' + id + ' arcade skill')) return;
        countShown++;

        var teamTag = m.teams ? ('⚔️ ' + m.teams + ' Teams') : '👥 2–8 Teams';
        var minsTag = '⏱ ' + (GM_MINS[id] || '8–12 min');
        var playBtn = h('button', {
          type: 'button',
          class: 'gm-gcard-btn play',
          title: 'Start playing immediately with this question pack!',
          text: '▶ Play'
        });
        playBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          A.play('start');
          S.modeId = id;
          if (m.teams && S.cfg.teams !== m.teams) { S.cfg.teams = m.teams; S.teams = []; }
          save();
          startGame(true);
        });

        var setupBtn = h('button', {
          type: 'button',
          class: 'gm-gcard-btn setup',
          title: 'Customize teams, avatars, timer & rules',
          text: '⚙️ Setup'
        });
        setupBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          A.play('flip');
          S.modeId = id;
          save();
          S.screen = 'setup';
          render();
        });

        var c = h('div', { class: 'gm-game', tabindex: '0', role: 'button' }, [
          h('div', { class: 'gm-game-pic' }, [
            cardArt(id, m.e),
            h('span', { class: 'gm-game-kbadge', text: '🎯 ARCADE SKILL' }),
            h('span', { class: 'gm-game-tbadge' + (m.teams === 2 ? ' vs' : ''), text: teamTag }),
            h('span', { class: 'gm-game-time', text: minsTag })
          ]),
          h('div', { class: 'gm-game-cap' }, [
            h('span', { class: 'gm-game-sub3', text: 'Phone & Smartboard · Live Teams · Speaking' }),
            h('b', { text: nm }),
            h('small', { class: 'gm-game-desc', text: ds }),
            h('div', { class: 'gm-game-actions' }, [playBtn, setupBtn])
          ])
        ]);
        c.addEventListener('click', function () {
          A.play('flip');
          S.modeId = id;
          save();
          S.screen = 'setup';
          render();
        });
        grid.appendChild(c);
      });

      if (!countShown) {
        grid.appendChild(h('div', { class: 'gm-empty-search', text: 'No games match "' + S.searchQ + '". Tap All Games or clear search!' }));
      }
    }

    searchInput.addEventListener('input', function () {
      S.searchQ = searchInput.value || '';
      paintGrid();
    });

    paintGrid();
    gPanel.appendChild(grid);
    wrap.appendChild(gPanel);
    return wrap;
  }

  /* ---------- SET-UP ---------- */
  function seg(label, opts, cur, onPick) {
    var row = h('div', { class: 'gm-opt-row' }, [h('div', { class: 'gm-opt-lab', text: label })]), box = h('div', { class: 'gm-seg' });
    opts.forEach(function (o) { var b = h('button', { type: 'button', class: 'gm-segb' + (String(o[0]) === String(cur) ? ' sel' : '') }, [h('b', { text: o[1] }), o[2] ? h('small', { text: o[2] }) : null]); b.addEventListener('click', function () { A.play('tap'); onPick(o[0]); }); box.appendChild(b); });
    row.appendChild(box); return row;
  }
  /* Which pupil is in which team. Kept for each class (S.groups[classId] = { ids: [[id...], ...], names, colors }),
     so the teams stay the same from game to game until the teacher mixes them again. New pupils join the smallest team. */
  function classTeams(n) {
    var p = S.classId ? GM.mon.pupils(S.classId) : []; if (!p.length) return null;
    var byId = {}, seen = {}, saved = (S.groups || {})[S.classId], ids;
    p.forEach(function (x) { byId[x.id] = x; });
    if (saved && Array.isArray(saved.ids) && saved.ids.length === n) {
      ids = saved.ids.map(function (l) { return (l || []).filter(function (id) { if (!byId[id] || seen[id]) return false; seen[id] = 1; return true; }); });
    } else {
      saved = null; ids = []; for (var i = 0; i < n; i++) ids.push([]);
      U.shuffle(p).forEach(function (x, k) { ids[k % n].push(x.id); seen[x.id] = 1; });
    }
    p.forEach(function (x) { if (seen[x.id]) return; var k = 0; ids.forEach(function (l, i) { if (l.length < ids[k].length) k = i; }); ids[k].push(x.id); });
    S.groups = S.groups || {}; S.groups[S.classId] = { ids: ids, names: saved && saved.names, colors: saved && saved.colors }; save();
    return ids.map(function (l) { return l.map(function (id) { return byId[id]; }); });
  }
  function keepTeamIds() {
    var g = S.groups && S.groups[S.classId]; if (!g) return;
    g.ids = S.teams.map(function (t) { return (t.roster || []).map(function (r) { return r.id; }); }); save();
  }
  function buildTeams() {
    var n = S.cfg.teams;
    if (!S.teams.length || S.teams.length !== n) {
      var defs = GM.mon.defaults(n, S.theme), ct = classTeams(n), g = ct && S.groups[S.classId]; S.teams = [];
      for (var i = 0; i < n; i++) {
        var tRoster = ct ? ct[i] : [];
        S.teams.push({
          name: (g && g.names && g.names[i]) || GM.teamNames[i],
          color: (g && g.colors && g.colors[i]) || GM.teamColors[i],
          score: 0,
          mon: tRoster.length ? tRoster[0] : defs[i],
          pi: i,
          roster: tRoster,
          rosterIdx: 0
        });
      }
    }
  }
  /* "Who is in which team": every pupil's name under its team. Tap a name to move it to the next team. */
  function teamLists(m) {
    var n = S.teams.length, cols = h('div', { class: 'gm-tlists' });
    S.teams.forEach(function (t, i) {
      var col = h('div', { class: 'gm-tlist' }), chips = h('div', { class: 'gm-tchips' });
      col.style.setProperty('--c', t.color);
      col.appendChild(h('div', { class: 'gm-tlist-h' }, [h('b', { text: t.name }), h('small', { text: (t.roster || []).length + ' pupils' })]));
      (t.roster || []).forEach(function (r) {
        var c = h('button', { type: 'button', class: 'gm-tchip', title: 'Move to the next team', text: r.name });
        c.addEventListener('click', function () {
          if (n < 2) return; A.play('tap');
          t.roster = t.roster.filter(function (x) { return x !== r; }); var to = S.teams[(i + 1) % n]; to.roster = (to.roster || []).concat([r]);
          [t, to].forEach(function (x) { x.rosterIdx = 0; x.rIdx = 0; x.mon = x.roster[0] || GM.mon.defaults(n, S.theme)[S.teams.indexOf(x)]; });
          keepTeamIds(); render();
        });
        chips.appendChild(c);
      });
      col.appendChild(chips); cols.appendChild(col);
    });
    var acts = h('div', { class: 'gm-tlist-acts' }, [btn('🔀 Mix the teams', 'sm', function () { if (S.groups) delete S.groups[S.classId]; S.teams = []; save(); render(); })]);
    var gr = GM.mon.groups(S.classId);
    if (gr.length >= 2 && gr.length <= 8 && (!m.teams || m.teams === gr.length)) {
      acts.appendChild(btn('👥 Use our class groups (' + gr.length + ')', 'sm amber', function () {
        S.cfg.teams = gr.length; S.groups = S.groups || {};
        S.groups[S.classId] = { ids: gr.map(function (g) { return g.ids.slice(); }), names: gr.map(function (g) { return g.name; }), colors: gr.map(function (g, k) { return g.color || GM.teamColors[k]; }) };
        S.teams = []; save(); render();
      }));
    }
    return h('div', { class: 'gm-tlist-wrap' }, [h('div', { class: 'gm-tlist-title' }, [h('b', { text: '👥 Who is in which team' }), h('small', { text: 'Tap a name to move it to the next team. The teams stay the same next time.' })]), cols, acts]);
  }
  /* the same list during the game, from the 👥 button in the header; the pupil whose turn it is next is marked */
  function showTeams() {
    var old = document.getElementById('gm-tov'); if (old) { old.remove(); return; }
    var cols = h('div', { class: 'gm-tlists' });
    S.teams.forEach(function (t) {
      var col = h('div', { class: 'gm-tlist' }), chips = h('div', { class: 'gm-tchips' });
      col.style.setProperty('--c', t.color);
      col.appendChild(h('div', { class: 'gm-tlist-h' }, [h('b', { text: t.name }), h('small', { text: S.playing ? t.score + ' points' : (t.roster || []).length + ' pupils' })]));
      (t.roster || []).forEach(function (r) { chips.appendChild(h('span', { class: 'gm-tchip' + (r === t.mon ? ' now' : ''), text: (r === t.mon ? '▶ ' : '') + r.name })); });
      col.appendChild(chips); cols.appendChild(col);
    });
    var ov = h('div', { class: 'gm-tov', id: 'gm-tov' }, [h('div', { class: 'gm-tov-card' }, [h('div', { class: 'gm-tlist-title' }, [h('b', { text: '👥 Who is in which team' }), h('small', { text: '▶ = next to answer' })]), cols, btn('Close', 'green', function () { ov.remove(); })])]);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  }
  function teamsBtn() {
    var b = document.getElementById('gm-tbtn'); if (!b) return;
    b.style.display = S.classId && S.teams.some(function (t) { return t.roster && t.roster.length; }) && S.screen !== 'home' ? '' : 'none';
  }
  function setup() {
    var m = GM.modes[S.modeId]; if (m.teams && S.cfg.teams !== m.teams) { S.cfg.teams = m.teams; S.teams = []; }
    buildTeams();
    var card = h('div', { class: 'gm-setup' });
    var cs = curSet();
    /* left: the game */
    var left = h('div', { class: 'gm-setup-l' }, [
      h('div', { class: 'gm-setup-pic' }, [cardArt(S.modeId, m.e)]),
      h('h2', { text: modeName(m) }),
      h('ol', { class: 'gm-how' }, (HOW[S.modeId] || [modeDesc(m)]).map(function (x) { return h('li', { text: x }); })),
      h('div', { class: 'gm-setup-set' }, [
        h('span', { text: (cs.e || '📚') + ' ' }),
        h('b', { text: cs.title }),
        h('small', { text: ' · ' + (cs.items ? cs.items.length : 20) + ' questions' })
      ])
    ]);
    /* right: the options */
    var right = h('div', { class: 'gm-setup-r' }), classes = GM.mon.classes();
    if (classes.length) right.appendChild(seg('Class', [['', 'No class']].concat(classes.map(function (c) { return [c.id, c.label]; })), S.classId, function (v) { S.classId = v; S.teams = []; save(); render(); }));
    if (!m.teams) {
      var stepper = h('div', { class: 'gm-stepper' }, [btn('−', 'round', function () { if (S.cfg.teams > 1) { S.cfg.teams--; S.teams = []; save(); render(); } }), h('b', { class: 'gm-stepn', text: String(S.cfg.teams) }), btn('+', 'round', function () { if (S.cfg.teams < 8) { S.cfg.teams++; S.teams = []; save(); render(); } })]);
      right.appendChild(h('div', { class: 'gm-opt-row' }, [h('div', { class: 'gm-opt-lab', text: 'Teams' }), stepper]));
    }
    /* the teams, big */
    var faces = h('div', { class: 'gm-teamfaces' });
    S.teams.forEach(function (t, i) {
      var f = h('div', { class: 'gm-tface' }), name = h('input', { class: 'gm-tname-in', value: t.name, maxlength: '14', title: 'Team name' });
      f.style.setProperty('--c', t.color);
      var mon = h('button', { type: 'button', class: 'gm-tmon', title: 'Tap for another avatar' }, [U.monFace(t.mon, 96)]);
      mon.addEventListener('click', function () {
        A.play('tap');
        if (t.roster && t.roster.length > 1) {
          t.rosterIdx = ((t.rosterIdx || 0) + 1) % t.roster.length;
          t.mon = t.roster[t.rosterIdx];
        } else {
          var p = S.classId ? GM.mon.pupils(S.classId) : null;
          if (p && p.length) { t.pi = (t.pi + 1) % p.length; t.mon = p[t.pi]; }
          else { var d = GM.mon.defaults(8, S.theme); t.pi = (t.pi + 1) % 8; t.mon = d[t.pi]; }
        }
        render();
      });
      name.addEventListener('input', function () { t.name = name.value || GM.teamNames[i]; var g = S.groups && S.groups[S.classId]; if (g) { g.names = S.teams.map(function (x) { return x.name; }); save(); } });
      f.appendChild(mon); f.appendChild(name);
      if (t.roster && t.roster.length) f.appendChild(h('div', { class: 'gm-roster-pill', text: '👥 ' + t.roster.length + ' pupils' }));
      faces.appendChild(f);
    });
    right.appendChild(faces);
    if (S.classId && S.teams.some(function (t) { return t.roster && t.roster.length; })) right.appendChild(teamLists(m));
    else right.appendChild(h('div', { class: 'gm-hint center', text: classes.length ? 'Choose your class above to put the pupils in teams.' : 'Tap an avatar to change it. Tap a name to rename the team.' }));
    (m.fields || []).forEach(function (f) {
      var fk = f.key || f.k, fl = f.label || f.l;
      var cur = S.cfg[fk] != null ? S.cfg[fk] : f.def;
      S.cfg[fk] = cur;
      right.appendChild(seg(fl, f.opts, cur, function (v) { S.cfg[fk] = v; save(); render(); }));
    });
    right.appendChild(seg('Timer', TIMERS, S.cfg.timer, function (v) { S.cfg.timer = v; save(); render(); }));
    var pk = !cs.smart && (S.picks || {})[cs.id], total = cs.smart ? 0 : (cs.items || []).length;
    if (total > 1 && GM.tools) {
      var qb = btn(((pk && pk.length) ? pk.length + ' of ' + total : 'All ' + total) + ' questions · Choose', 'sm', function () {
        GM.tools.chooseQuestions(cs, pk, function (arr) { S.picks = S.picks || {}; if (arr.length) S.picks[cs.id] = arr; else delete S.picks[cs.id]; save(); render(); });
      });
      right.appendChild(h('div', { class: 'gm-opt-row' }, [h('div', { class: 'gm-opt-lab', text: 'Questions' }), qb]));
    }
    right.appendChild(seg('Question order', [['mix', 'Mixed'], ['order', 'In order', 'as in the set']], S.cfg.order === 'order' ? 'order' : 'mix', function (v) { S.cfg.order = v; save(); render(); }));
    right.appendChild(seg('Pictures', [['off', 'Normal'], ['zoom', 'Super Zoom', 'tap a picture to enlarge'], ['blur', 'Blur', 'slide to reveal']], S.cfg.pics || 'off', function (v) { S.cfg.pics = v; save(); render(); }));
    right.appendChild(seg('Scores', [['show', 'Show'], ['on', 'Hide', 'play without keeping score']].map(function (o) { return [o[0] === 'on' ? 'on' : 'off', o[1], o[2]]; }), S.cfg.hide === 'on' ? 'on' : 'off', function (v) { S.cfg.hide = v; save(); render(); }));
    if (GM.rev) {
      right.appendChild(seg('Remember first', [[0, 'Off (Play right away)'], [1, 'On', 'reminder before the game']], S.cfg.rem === 1 ? 1 : 0, function (v) { S.cfg.rem = +v; save(); render(); }));
      right.appendChild(seg('Answer cards', [[0, 'Off'], [1, 'On', 'everybody answers on paper']], S.cfg.cards ? 1 : 0, function (v) { S.cfg.cards = +v; save(); render(); }));
    }
    var themes = Object.keys(GM.themes).filter(function (k) { return (GM.halloweenOn || k !== 'halloween') && (!GM.themes[k].art || U.hasArt(GM.themes[k].art)); });
    if (themes.length > 1) right.appendChild(seg('Theme', themes.map(function (k) { return [k, GM.themes[k].e + ' ' + GM.themes[k].name]; }), S.theme, function (v) { S.theme = v; S.teams = []; save(); render(); }));
    if (S.modeId === 'board' && S.cfg.play !== 'quiz') {
      var det = h('details', { class: 'gm-pudet' }, [h('summary', { text: '⚡ Power-ups (' + GM.powerups.filter(function (p) { return (S.cfg.pu || {})[p.id] !== false && (S.cfg.play !== 'jr' || p.jr); }).length + ' on) · tap to change' })]), list = h('div', { class: 'gm-pulist' });
      GM.powerups.forEach(function (p) {
        var on = (S.cfg.pu || {})[p.id] !== false, jrOff = S.cfg.play === 'jr' && !p.jr;
        var b = h('button', { type: 'button', class: 'gm-pu' + (on && !jrOff ? ' on' : '') + (jrOff ? ' off' : '') }, [U.art('pu_' + p.id, p.e, 'gm-puimg'), h('b', { text: p.n }), h('small', { text: p.d })]);
        b.addEventListener('click', function () { if (jrOff) return; A.play('tap'); S.cfg.pu = S.cfg.pu || {}; S.cfg.pu[p.id] = !on; save(); var o = det.open; render(); var d2 = document.querySelector('.gm-pudet'); if (d2 && o) d2.open = true; }); list.appendChild(b);
      });
      det.appendChild(list); right.appendChild(det);
    }
    card.appendChild(left); card.appendChild(right);
    var wrap = h('div', { class: 'gm-setupwrap' }, [card, h('div', { class: 'gm-setup-go' }, [btn('◀ Back', 'ghost', function () { S.screen = 'home'; render(); }), btn('▶  PLAY', 'huge green', startGame)])]);
    return wrap;
  }

  /* ---------- play ---------- */
  var cleanups = [], queue = [], gameId = 0;
  /* the questions the teacher ticked for this set (all of them when nothing is ticked) */
  function chosenItems() {
    var s = curSet(), pk = !s.smart && (S.picks || {})[s.id], items = s.items;
    if (pk && pk.length) { var sel = {}; pk.forEach(function (i) { sel[i] = 1; }); var f = items.filter(function (x, i) { return sel[i]; }); if (f.length) items = f; }
    return items;
  }
  function nextItem() { if (!queue.length) queue = S.cfg.order === 'order' ? chosenItems().slice().reverse() : U.shuffle(chosenItems()); return queue.pop(); }
  function startGame(skipRemember) {
    var activeSet = curSet();
    if (skipRemember !== true && GM.rev && S.cfg.rem === 1 && activeSet.skill !== 'speaking' && !S.playing && !S.remDone) {
      buildTeams(); document.getElementById('gm-teams').style.display = 'none';
      return GM.rev.remember(activeSet.items, { points: 8, check: 3 }, function () { S.remDone = true; startGame(true); });
    }
    cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } });
    buildTeams(); S.teams.forEach(function (t) { t.score = 0; }); S.playing = true; queue = []; cleanups = []; GM.sessionMissed = []; GM.cardNo = 0; GM.sessionTally = [];
    S.items = chosenItems();
    save(); var myGame = ++gameId;
    S.screen = 'play'; applyTheme('play'); document.body.classList.add('gm-mode-' + S.modeId);
    document.getElementById('gm-teams').style.display = ''; A.play('start'); A.musicStart(S.theme);
    stage.innerHTML = ''; var area = h('div', { class: 'gm-area' }); stage.appendChild(area);
    var m = GM.modes[S.modeId], cfg = Object.assign({}, S.cfg);
    (m.fields || []).forEach(function (f) {
      var fk = f.key || f.k;
      if (fk && cfg[fk] == null) cfg[fk] = f.def;
    });
    U.teamBar(S.teams, 0);
    var ctx = { root: area, cfg: cfg, nextItem: nextItem, onEnd: function (f) { cleanups.push(f); }, end: function () { if (myGame !== gameId || !S.playing) return; cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); document.getElementById('gm-teams').style.display = 'none'; S.screen = 'end'; applyTheme('end'); U.podium(S.teams, startGame, goHome); } };
    m.start(ctx); teamsBtn();
  }
  function goHome() { S.playing = false; gameId++; cleanups.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; A.musicStop(); document.getElementById('gm-teams').style.display = 'none'; S.screen = 'home'; render(); }

  function render() {
    S.playing = false; if (S.screen !== 'play') S.remDone = false; applyTheme(); stage.innerHTML = '';
    stage.appendChild(S.screen === 'setup' ? setup() : home());
    var back = document.getElementById('gm-home'); if (back) back.style.visibility = S.screen === 'home' ? 'hidden' : 'visible';
    var ov = document.getElementById('gm-tov'); if (ov) ov.remove(); teamsBtn();
  }
  function init() {
    stage = document.getElementById('gm-stage'); load(); if (!GM.modes[S.modeId]) S.modeId = 'fling';
    /* links from the platform & lessons: ?class=<classId>&set=<setId>&game=<gameId> */
    try {
      var qs = location.search, mc = /[?&]class=([\w-]+)/.exec(qs), ms = /[?&](?:set|pack)=([\w-]+)/.exec(qs), mg = /[?&]game=([\w-]+)/.exec(qs), mcat = /[?&]cat=([\w-]+)/.exec(qs), mq = /[?&]q=([^&]+)/.exec(qs);
      var LEGACY_3D = {
        penalty: '../games/penalty3d/',
        race: '../games/race3d/',
        cannon: '../games/cannon3d/',
        bowling: '../games/bowling3d/',
        board: '../games/bomb3d/',
        bomb: '../games/bomb3d/',
        pass: '../games/bomb3d/',
        keepgive: '../games/bomb3d/?mode=keepgive',
        tug: '../games/tug3d/',
        boardgame: '../games/board3d/',
        snakes: '../games/board3d/',
        memory: '../games/words/index.html?game=pairs',
        bingo: '../games/words/index.html?game=bingo'
      };
      if (mg && !GM.modes[mg[1]] && LEGACY_3D[mg[1]]) {
        var dest = LEGACY_3D[mg[1]];
        var tail = [];
        if (mc && mc[1]) tail.push('class=' + encodeURIComponent(mc[1]));
        if (ms && ms[1]) tail.push('set=' + encodeURIComponent(ms[1]));
        if (tail.length) dest += (dest.indexOf('?') >= 0 ? '&' : '?') + tail.join('&');
        location.replace(dest);
        return;
      }
      if (mcat && GAME_CATS.some(function (c) { return c[0] === mcat[1]; })) S.gameCat = mcat[1];
      if (!GAME_CATS.some(function (c) { return c[0] === S.gameCat; })) S.gameCat = 'all';
      if (mq && mq[1]) { try { S.searchQ = decodeURIComponent(mq[1]); } catch (e0) {} }
      if (mc && mc[1]) {
        S.classId = mc[1]; S.teams = [];
        if (!ms) {
          var isG4 = /4/.test(mc[1]);
          S.qGrade = isG4 ? '4' : '3';
          if (allSets().some(function (x) { return x.id === (isG4 ? 'u14-g4' : 'u14-g3'); })) S.setId = isG4 ? 'u14-g4' : 'u14-g3';
        }
      }
      if (ms && allSets().some(function (x) { return x.id === ms[1]; })) {
        S.setId = ms[1];
        var targetSet = allSets().filter(function (x) { return x.id === ms[1]; })[0];
        if (targetSet) {
          var tg = getSetGrade(targetSet), tu = getSetUnit(targetSet), tsk = getSetSkill(targetSet);
          S.qGrade = tg === 3 ? '3' : (tg === 4 ? '4' : 'all');
          S.qUnit = tu ? String(tu) : 'all';
          S.qSkill = tsk || 'all';
        }
      }
      if (mg && GM.modes[mg[1]]) { S.modeId = mg[1]; S.screen = 'setup'; S.teams = []; }
      save();
    } catch (e) { /* ignore */ }
    document.getElementById('gm-teams').style.display = 'none';
    var snd = document.getElementById('gm-snd'); snd.addEventListener('click', function () { A.setMuted(!A.isMuted()); snd.textContent = A.isMuted() ? '🔇' : '🔊'; if (!A.isMuted()) A.play('tap'); });
    var homeB = document.getElementById('gm-home'), armed = false;
    homeB.addEventListener('click', function () { if (S.playing && !armed) { armed = true; homeB.textContent = '⚠ Tap again to leave'; setTimeout(function () { armed = false; homeB.textContent = '☰ Games'; }, 3000); return; } armed = false; homeB.textContent = '☰ Games'; goHome(); });
    var tb = h('button', { type: 'button', class: 'gm-btn sm ghost', id: 'gm-tbtn', title: 'Who is in which team', text: '👥 Teams' });
    tb.addEventListener('click', function () { A.play('tap'); showTeams(); }); homeB.parentNode.insertBefore(tb, homeB);
    document.getElementById('gm-fs').addEventListener('click', function () { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* ignore */ } });
    render();
    try { if (GM.rev && /[?&]daily=1/.test(location.search)) GM.rev.daily(); else if (GM.rev && /[?&]exit=1/.test(location.search)) GM.rev.exitTicket(curSet().items); } catch (e) { /* ignore */ }
  }
  GM.app = { go: function (screen) { S.screen = screen; render(); }, start: startGame, home: goHome, setClass: function (id) { S.classId = id; S.teams = []; save(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window);
