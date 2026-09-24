/**
 * Household Mystery Objects Dataset
 * Target: CEFR A1-A2 | Twinkl "What's That Sound?" Curriculum
 */
const SOUND_DETECTIVE_DATA = {
  config: {
    totalTargetXP: 150,
    phase1Goal: 6,
    phase2Rounds: 8,
    timerSeconds: 8
  },
  items: [
    {
      id: "clock",
      name: "clock",
      grammarType: "singular",
      sentence: "It's a clock.",
      soundLabel: "Tick... tock... tick...",
      audioMethod: "playClockTick",
      icon: "⏰",
      hint: "Listen to the steady ticking sound counting seconds."
    },
    {
      id: "bell",
      name: "bell",
      grammarType: "singular",
      sentence: "It's a bell.",
      soundLabel: "Ding-dong! Ding-dong!",
      audioMethod: "playBellRing",
      icon: "🔔",
      hint: "Someone is at the front door ringing for entry."
    },
    {
      id: "tap",
      name: "tap",
      grammarType: "singular",
      sentence: "It's a tap.",
      soundLabel: "Drip... drop... splash!",
      audioMethod: "playWaterTap",
      icon: "🚰",
      hint: "Clean water dripping into the kitchen sink."
    },
    {
      id: "light-switch",
      name: "light switch",
      grammarType: "singular",
      sentence: "It's a light switch.",
      soundLabel: "Click-clack!",
      audioMethod: "playSwitchClick",
      icon: "💡",
      hint: "Flipping the wall switch to turn the lights on or off."
    },
    {
      id: "kettle",
      name: "kettle",
      grammarType: "singular",
      sentence: "It's a kettle.",
      soundLabel: "Shhhh-whistle!",
      audioMethod: "playKettleBoil",
      icon: "🫖",
      hint: "Hot boiling water whistling on the stove."
    },
    {
      id: "computer",
      name: "computer",
      grammarType: "singular",
      sentence: "It's a computer.",
      soundLabel: "Clickity-clack-tap!",
      audioMethod: "playKeyboardType",
      icon: "💻",
      hint: "Fingers typing fast across a mechanical keyboard."
    },
    {
      id: "cards",
      name: "cards",
      grammarType: "plural",
      sentence: "They're cards.",
      soundLabel: "Fffffp-flutter!",
      audioMethod: "playCardShuffle",
      icon: "🃏",
      hint: "Shuffling paper cards quickly with both hands."
    },
    {
      id: "dice",
      name: "dice",
      grammarType: "plural",
      sentence: "They're dice.",
      soundLabel: "Rattle... rattle... roll!",
      audioMethod: "playDiceRoll",
      icon: "🎲",
      hint: "Rolling small dotted cubes across a board game table."
    },
    {
      id: "door",
      name: "door",
      grammarType: "singular",
      sentence: "It's a door.",
      soundLabel: "Knock-knock-creak!",
      audioMethod: "playDoorKnock",
      icon: "🚪",
      hint: "Someone rapping knuckles on solid wood."
    },
    {
      id: "chair",
      name: "chair",
      grammarType: "singular",
      sentence: "It's a chair.",
      soundLabel: "Skrrrrt-scrape!",
      audioMethod: "playChairScrape",
      icon: "🪑",
      hint: "Wooden legs sliding across the classroom floor."
    },
    {
      id: "cup",
      name: "cup",
      grammarType: "singular",
      sentence: "It's a cup.",
      soundLabel: "Ting-clink!",
      audioMethod: "playCupClink",
      icon: "☕",
      hint: "Ceramic mug placed gently onto a saucer."
    },
    {
      id: "spoon",
      name: "spoon",
      grammarType: "singular",
      sentence: "It's a spoon.",
      soundLabel: "Cling-ting-ting!",
      audioMethod: "playSpoonDing",
      icon: "🥄",
      hint: "Metal cutlery stirring hot tea."
    },
    {
      id: "backpack",
      name: "backpack",
      grammarType: "singular",
      sentence: "It's a backpack.",
      soundLabel: "Zzzzzip!",
      audioMethod: "playBackpackZip",
      icon: "🎒",
      hint: "Pulling a metal zipper shut before school."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.SOUND_DETECTIVE_DATA = SOUND_DETECTIVE_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOUND_DETECTIVE_DATA };
}
