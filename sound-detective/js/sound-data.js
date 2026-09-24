/**
 * SOUND DETECTIVE: CURRICULUM DATA
 * Level: CEFR A1+ | Target: Primary ESL (Ages 7–10)
 * Core Targets: 20 Vocabulary Words (12 Objects + 8 Sound Verbs)
 * Grammar: "What's that sound?" / "It's a [object]. It [verbs]!" / "They're [objects]. They [verb]!"
 */
(function(root) {
  'use strict';

  const SOUND_DATA = {
    meta: {
      id: "sound-detective",
      title: "Sound Detective: Household Sound Arcade",
      subtitle: "Listen • Slap • Crack the Safe • Broadcast Live",
      level: "A1+",
      cefrLevel: "A1+",
      ageGroup: "7–10",
      totalXP: 250,
      grammarFormulas: {
        inquiry: "What's that sound?",
        singular: "It's a [object]. It [verbs]!",
        plural: "They're [objects]. They [verb]!"
      }
    },

    // Exactly 20 Target Words: 12 Objects & 8 Sound Verbs
    vocabulary: {
      objects: [
        "clock", "bell", "tap", "light switch", "kettle", "door",
        "computer", "cards", "dice", "cup", "spoon", "backpack"
      ],
      soundVerbs: [
        "tick", "ring", "drip", "click", "whistle", "knock", "clink", "shuffle"
      ]
    },

    // 12 Target Household Objects with Audio Mappings & Grammar Types
    items: [
      {
        id: "clock",
        name: "clock",
        pluralName: "clocks",
        grammarType: "singular",
        article: "a",
        soundVerb: "tick",
        soundVerb3rd: "ticks",
        soundLabel: "Tick... tock... tick...",
        audioMethod: "playClockTick",
        icon: "⏰",
        hint: "It counts the seconds on the wall or table.",
        sentence: "It's a clock. It ticks!"
      },
      {
        id: "bell",
        name: "bell",
        pluralName: "bells",
        grammarType: "singular",
        article: "a",
        soundVerb: "ring",
        soundVerb3rd: "rings",
        soundLabel: "Ding-dong! Ding-dong!",
        audioMethod: "playBellRing",
        icon: "🔔",
        hint: "Someone rings it at the front door.",
        sentence: "It's a bell. It rings!"
      },
      {
        id: "tap",
        name: "tap",
        pluralName: "taps",
        grammarType: "singular",
        article: "a",
        soundVerb: "drip",
        soundVerb3rd: "drips",
        soundLabel: "Drip... drop... splash!",
        audioMethod: "playWaterTap",
        icon: "🚰",
        hint: "Water drops from it in the sink.",
        sentence: "It's a tap. It drips!"
      },
      {
        id: "light-switch",
        name: "light switch",
        pluralName: "light switches",
        grammarType: "singular",
        article: "a",
        soundVerb: "click",
        soundVerb3rd: "clicks",
        soundLabel: "Click... clack!",
        audioMethod: "playSwitchClick",
        icon: "💡",
        hint: "Press it on the wall to turn on the lights.",
        sentence: "It's a light switch. It clicks!"
      },
      {
        id: "kettle",
        name: "kettle",
        pluralName: "kettles",
        grammarType: "singular",
        article: "a",
        soundVerb: "whistle",
        soundVerb3rd: "whistles",
        soundLabel: "Psssshhh... fweeeee!",
        audioMethod: "playKettleBoil",
        icon: "🫖",
        hint: "It boils water for hot tea.",
        sentence: "It's a kettle. It whistles!"
      },
      {
        id: "door",
        name: "door",
        pluralName: "doors",
        grammarType: "singular",
        article: "a",
        soundVerb: "knock",
        soundVerb3rd: "knocks",
        soundLabel: "Knock! Knock! Knock!",
        audioMethod: "playDoorKnock",
        icon: "🚪",
        hint: "Someone is tapping on the wooden frame.",
        sentence: "It's a door. It knocks!"
      },
      {
        id: "computer",
        name: "computer",
        pluralName: "computers",
        grammarType: "singular",
        article: "a",
        soundVerb: "click",
        soundVerb3rd: "clicks",
        soundLabel: "Click-clack-tap-tap...",
        audioMethod: "playComputerType",
        icon: "💻",
        hint: "Fingers typing fast on the keyboard.",
        sentence: "It's a computer. It clicks!"
      },
      {
        id: "cards",
        name: "cards",
        pluralName: "cards",
        grammarType: "plural",
        article: "",
        soundVerb: "shuffle",
        soundVerb3rd: "shuffle",
        soundLabel: "Flutter... flrrrp-flrrrp!",
        audioMethod: "playCardShuffle",
        icon: "🃏",
        hint: "A deck of 52 paper game cards bending fast.",
        sentence: "They're cards. They shuffle!"
      },
      {
        id: "dice",
        name: "dice",
        pluralName: "dice",
        grammarType: "plural",
        article: "",
        soundVerb: "clink",
        soundVerb3rd: "clink",
        soundLabel: "Rattle... tumble... clatter!",
        audioMethod: "playDiceRoll",
        icon: "🎲",
        hint: "Two numbered cubes tumbling across the table.",
        sentence: "They're dice. They clink!"
      },
      {
        id: "cup",
        name: "cup",
        pluralName: "cups",
        grammarType: "singular",
        article: "a",
        soundVerb: "clink",
        soundVerb3rd: "clinks",
        soundLabel: "Ting! Ting!",
        audioMethod: "playCupClink",
        icon: "☕",
        hint: "Ceramic glass gently tapping against a saucer.",
        sentence: "It's a cup. It clinks!"
      },
      {
        id: "spoon",
        name: "spoon",
        pluralName: "spoons",
        grammarType: "singular",
        article: "a",
        soundVerb: "clink",
        soundVerb3rd: "clinks",
        soundLabel: "Ding! Clink!",
        audioMethod: "playSpoonDing",
        icon: "🥄",
        hint: "A metal utensil stirring soup in a bowl.",
        sentence: "It's a spoon. It clinks!"
      },
      {
        id: "backpack",
        name: "backpack",
        pluralName: "backpacks",
        grammarType: "singular",
        article: "a",
        soundVerb: "shuffle",
        soundVerb3rd: "shuffles",
        soundLabel: "Zzzzzzzip! Swish!",
        audioMethod: "playBackpackZip",
        icon: "🎒",
        hint: "Pulling the metal zipper closed for school.",
        sentence: "It's a backpack. It zips and shuffles!"
      }
    ],

    // 8 Sound Verbs definitions & distractor sets
    verbs: [
      { id: "tick", verb: "tick", thirdPerson: "ticks", icon: "⏱️", definition: "A sharp, steady mechanical sound every second." },
      { id: "ring", verb: "ring", thirdPerson: "rings", icon: "🔔", definition: "A clear, resonant chime from a bell or chime." },
      { id: "drip", verb: "drip", thirdPerson: "drips", icon: "💧", definition: "Liquid droplets falling one by one." },
      { id: "click", verb: "click", thirdPerson: "clicks", icon: "🔘", definition: "A short, sharp snap when a switch or key triggers." },
      { id: "whistle", verb: "whistle", thirdPerson: "whistles", icon: "💨", definition: "A high-pitched tone made by steam or air pressure." },
      { id: "knock", verb: "knock", thirdPerson: "knocks", icon: "✊", definition: "A heavy, hollow thump on wood." },
      { id: "clink", verb: "clink", thirdPerson: "clinks", icon: "✨", definition: "A light, sharp ringing sound of glass, ceramic, or metal." },
      { id: "shuffle", verb: "shuffle", thirdPerson: "shuffles", icon: "🔀", definition: "A rapid fluttering or sliding sound of paper or fabric." }
    ],

    // Stage 4 Teleprompter Presentation Scripts
    teleprompter: {
      intros: [
        "Welcome to the Foley Sound Studio!",
        "Detective reporting live from the sound lab!",
        "Listen carefully to our acoustic mystery!"
      ],
      formulas: [
        "When the {object} moves, it goes {sound}!",
        "Can you guess what made that sound?",
        "Answer: {sentence}"
      ]
    }
  };

  root.SOUND_DATA = SOUND_DATA;
  root.SOUND_DETECTIVE_DATA = SOUND_DATA; // Backwards-compatible alias
})(typeof window !== 'undefined' ? window : this);
