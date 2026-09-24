/**
 * Sound Detective Pro: Acoustic Physics & Deduction Engine
 * Level: CEFR A2 / A2+ | Target: Primary CLIL & ESL (Ages 8–12)
 */
const SOUND_PRO_DATA = {
  config: {
    totalXP: 150,
    timerSeconds: 15,
    stages: ["scanner", "anatomy", "deduction", "foley", "baamboozle"]
  },

  // Stage 1 & 2: Acoustic Physics & Anatomy Models
  mechanics: [
    {
      id: "clock",
      name: "Mechanical Clock",
      soundType: "Rhythmic & Intermittent",
      pitch: "Medium",
      pitchVal: 2,
      textureVal: 1,
      actionVerb: "ticks",
      deduction: "It must be a clock because the escapement gear releases a rhythmic tick every second.",
      audioMethod: "playClockTick",
      icon: "⏰",
      parts: [
        { id: "p1", name: "Pendulum", function: "Swings side to side to regulate timing." },
        { id: "p2", name: "Escapement Gear", function: "Strikes the tooth to produce the crisp tick." },
        { id: "p3", name: "Clock Face", function: "Displays hours and minutes with rotating hands." }
      ]
    },
    {
      id: "kettle",
      name: "Boiling Kettle",
      soundType: "Continuous & High-Pitched",
      pitch: "High",
      pitchVal: 3,
      textureVal: 2,
      actionVerb: "whistles",
      deduction: "It must be a kettle because pressurized steam is escaping through a narrow nozzle.",
      audioMethod: "playKettleBoil",
      icon: "🫖",
      parts: [
        { id: "p1", name: "Heating Element", function: "Heats the cold water to 100°C." },
        { id: "p2", name: "Whistle Nozzle", function: "Vibrates as hot steam forces its way out." },
        { id: "p3", name: "Insulated Handle", function: "Allows safe pouring without burns." }
      ]
    },
    {
      id: "tap",
      name: "Leaking Water Tap",
      soundType: "Liquid & Intermittent",
      pitch: "Low-to-Medium",
      pitchVal: 2,
      textureVal: 1,
      actionVerb: "drips",
      deduction: "It must be a tap because water droplets are falling at irregular intervals.",
      audioMethod: "playWaterTap",
      icon: "🚰",
      parts: [
        { id: "p1", name: "Rubber Washer", function: "Seals the pipe to stop water flow." },
        { id: "p2", name: "Spout Valve", function: "Directs pressurized water into the basin." },
        { id: "p3", name: "Rotary Handle", function: "Turns clockwise to compress the internal seal." }
      ]
    },
    {
      id: "door",
      name: "Heavy Wooden Door",
      soundType: "Deep & Resonant",
      pitch: "Low",
      pitchVal: 1,
      textureVal: 1,
      actionVerb: "creaks and knocks",
      deduction: "It must be a door because solid timber vibrates when struck by knuckles.",
      audioMethod: "playDoorKnock",
      icon: "🚪",
      parts: [
        { id: "p1", name: "Solid Wood Panel", function: "Absorbs and reflects acoustic sound waves." },
        { id: "p2", name: "Steel Hinges", function: "Pivot the frame, creaking when unlubricated." },
        { id: "p3", name: "Brass Latch", function: "Clicks firmly into the door jamb." }
      ]
    }
  ],

  // Stage 3: Deduction Clue Trials (Must Be vs Can't Be)
  deductionTrials: [
    {
      cue: "A high-pitched, piercing continuous whistle with rising steam.",
      correct: "kettle",
      distractor: "computer",
      correctIcon: "🫖",
      distractorIcon: "💻",
      correctLabel: "Boiling Kettle",
      distractorLabel: "Computer",
      mustReason: "It must be a kettle because escaping steam produces a continuous high whistle.",
      cantReason: "It can't be a computer because computers type and do not boil water."
    },
    {
      cue: "A steady, metallic tick-tock repeating exactly 60 times a minute.",
      correct: "clock",
      distractor: "door",
      correctIcon: "⏰",
      distractorIcon: "🚪",
      correctLabel: "Mechanical Clock",
      distractorLabel: "Wooden Door",
      mustReason: "It must be a clock because internal gears release rhythmic ticks.",
      cantReason: "It can't be a door because doors do not tick rhythmically."
    },
    {
      cue: "A rapid fluttering of plastic-coated cards being shuffled together.",
      correct: "cards",
      distractor: "bell",
      correctIcon: "🃏",
      distractorIcon: "🔔",
      correctLabel: "Playing Cards",
      distractorLabel: "Doorbell",
      mustReason: "They must be cards because sliding paper sheets create a soft fluttering shuffle.",
      cantReason: "It can't be a bell because bells chime with resonant metallic tones."
    },
    {
      cue: "A crisp, single electrical snap that changes room lighting.",
      correct: "light-switch",
      distractor: "tap",
      correctIcon: "💡",
      distractorIcon: "🚰",
      correctLabel: "Light Switch",
      distractorLabel: "Water Tap",
      mustReason: "It must be a light switch because the internal copper spring snaps into contact.",
      cantReason: "It can't be a tap because taps produce liquid droplets, not electrical clicks."
    },
    {
      cue: "Multiple wooden cubes bouncing and rolling across a tabletop.",
      correct: "dice",
      distractor: "cup",
      correctIcon: "🎲",
      distractorIcon: "☕",
      correctLabel: "Board Game Dice",
      distractorLabel: "Coffee Cup",
      mustReason: "They must be dice because multiple cubes tumble with a rhythmic rattle.",
      cantReason: "It can't be a cup because a cup is a single ceramic object that clinks."
    }
  ],

  // Stage 5: The 24-Grid Baamboozle Arena Deck
  baamboozleDeck: [
    { id: 1, type: "q", pts: 15, q: "I make a steady, rhythmic ticking sound every second. What am I?", a: "A clock (It's a clock)." },
    { id: 2, type: "q", pts: 20, q: "Grammar Fix: Correct this sentence: 'The cards is making a loud sound.'", a: "'The cards ARE making...' or 'They're cards.'" },
    { id: 3, type: "q", pts: 25, q: "Acoustic CLIL: Is a dripping tap 'continuous' or 'intermittent'?", a: "Intermittent (it drips drop by drop)." },
    { id: 4, type: "trap", trapType: "swap", title: "⚡ TEAM POINT SWAP!", desc: "Scores swap between Team Cyan and Team Amber!" },
    { id: 5, type: "q", pts: 15, q: "Action Verb: What sound does a boiling kettle make? (buzz / whistle / scrape)", a: "It whistles (or hisses)." },
    { id: 6, type: "q", pts: 20, q: "Modal Logic: You hear 'ding-dong'. Complete: 'It _____ be a bell.' (must / can't)", a: "It MUST be a bell." },
    { id: 7, type: "twister", pts: 25, q: "Tongue Twister (15s): Repeat 3 times: 'Twelve clicking clocks tick-tock together!'", a: "Spoken clearly 3 times before the timer!" },
    { id: 8, type: "trap", trapType: "steal", pts: 20, title: "🏴‍☠️ PIRATE STEAL!", desc: "Steal 20 points from the leading team!" },
    { id: 9, type: "q", pts: 15, q: "Acoustic Physics: Why does a wooden door make a deep sound when knocked?", a: "Solid timber is dense and creates low-frequency vibrations." },
    { id: 10, type: "q", pts: 20, q: "Contrast: Dice make a [wooden/metallic] sound, but bells make a [metallic/liquid] sound.", a: "wooden / metallic." },
    { id: 11, type: "q", pts: 25, q: "Grammar Sort: Which two objects are plural: spoon, dice, chair, cards?", a: "Dice and cards (They're dice / They're cards)." },
    { id: 12, type: "trap", trapType: "bankrupt", title: "💥 BANKRUPT!", desc: "Your team score resets to 0 XP!" },
    { id: 13, type: "q", pts: 15, q: "Sensory Simile: Complete: 'The mechanical keyboard sounds _____ a machine gun.'", a: "sounds LIKE a machine gun." },
    { id: 14, type: "q", pts: 20, q: "Pitch Test: Which has a higher pitch: a metal spoon clinking a teacup or a door slamming?", a: "The metal spoon clinking a teacup." },
    { id: 15, type: "q", pts: 25, q: "Cause & Effect: Why does a light switch click when flipped?", a: "An internal spring snaps the copper contact into place." },
    { id: 16, type: "trap", trapType: "double", title: "⭐ DOUBLE XP BUFF!", desc: "Your next correct answer scores double points!" },
    { id: 17, type: "q", pts: 15, q: "Spelling Check: Spell the past tense of 'click' and 'drip'.", a: "Clicked and Dripped (double 'p')." },
    { id: 18, type: "q", pts: 20, q: "Sound Riddle: You roll me on a table to get random numbers. What are we?", a: "They're dice." },
    { id: 19, type: "twister", pts: 25, q: "Speed Twister (15s): Repeat 3 times: 'Six sharp switches snapped softly!'", a: "Spoken cleanly 3 times!" },
    { id: 20, type: "trap", trapType: "bonus", pts: 25, title: "🎁 MYSTERY CRATE!", desc: "+25 free points awarded to your team!" },
    { id: 21, type: "q", pts: 15, q: "Mechanism: What part of a tap turns to stop water dripping?", a: "The valve (or handle / rubber washer)." },
    { id: 22, type: "q", pts: 20, q: "Full Sentence: Make a sentence using 'must be', 'kettle', and 'whistle'.", a: "'It must be a kettle because it makes a whistle.'" },
    { id: 23, type: "q", pts: 25, q: "CLIL Science: What is the difference between an echo and a direct sound?", a: "An echo is a sound wave that bounces back off a surface." },
    { id: 24, type: "trap", trapType: "drain", pts: 15, title: "⚠️ ENERGY DRAIN!", desc: "Loose wires! 15 points deducted from your team." }
  ]
};

if (typeof window !== 'undefined') {
  window.SOUND_PRO_DATA = SOUND_PRO_DATA;
  window.SOUND_DETECTIVE_DATA = SOUND_PRO_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOUND_PRO_DATA, SOUND_DETECTIVE_DATA: SOUND_PRO_DATA };
}
