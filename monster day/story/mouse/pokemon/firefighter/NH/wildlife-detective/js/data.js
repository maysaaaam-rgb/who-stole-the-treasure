/**
 * WILDLIFE DETECTIVE: EXOTIC PETS VS WILD HABITATS
 * English Adventure Academy | Grade 4 ESL / CEFR A1+ CLIL
 * Theme: "Keep It Wild! Buy the Toy Lamp!"
 */

export const GAME_DATA = {
  lexicon: {
    core: [
      "wetland",
      "herd",
      "chew",
      "teeth",
      "webbed feet",
      "snorkel face",
      "lamp",
      "expert",
      "zookeeper",
      "wild",
      "pet"
    ],
    formulas: [
      "The [animal] needs [requirement].",
      "It cannot live in a bedroom because it needs [habitat/herd].",
      "Keep it wild! Buy the toy lamp!"
    ]
  },
  phase1Cards: [
    {
      id: "axolotl",
      name: "Axolotl",
      requirement: "Needs cold, clean water in Mexican lakes.",
      ttsPrompt: "The axolotl is wild. It needs cold, clean water in Mexico!",
      svg: `<svg viewBox="0 0 100 90" width="100%" height="100%"><ellipse cx="50" cy="50" rx="32" ry="24" fill="#f472b6"/><circle cx="40" cy="46" r="4" fill="#0f172a"/><circle cx="60" cy="46" r="4" fill="#0f172a"/><path d="M44 56 Q50 62 56 56" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M22 40 Q10 32 18 24 Q24 35 24 44" fill="#db2777"/><path d="M20 50 Q8 50 14 60 Q22 55 24 52" fill="#db2777"/><path d="M78 40 Q90 32 82 24 Q76 35 76 44" fill="#db2777"/><path d="M80 50 Q92 50 86 60 Q78 55 76 52" fill="#db2777"/></svg>`
    },
    {
      id: "dragon",
      name: "Bearded Dragon",
      requirement: "Needs hot desert sunshine and heat lamps.",
      ttsPrompt: "The bearded dragon is wild. It needs hot desert sunshine!",
      svg: `<svg viewBox="0 0 100 90" width="100%" height="100%"><ellipse cx="50" cy="52" rx="30" ry="22" fill="#d97706"/><polygon points="50,22 42,34 58,34" fill="#b45309"/><circle cx="40" cy="48" r="4" fill="#1c1917"/><circle cx="60" cy="48" r="4" fill="#1c1917"/><path d="M30 62 Q50 72 70 62" stroke="#78350f" stroke-width="4" fill="none"/></svg>`
    },
    {
      id: "snake",
      name: "Ball Python",
      requirement: "Needs warm African grasslands with tight burrows.",
      ttsPrompt: "The ball python is wild. It needs warm grasslands in Africa!",
      svg: `<svg viewBox="0 0 100 90" width="100%" height="100%"><path d="M30 70 Q20 45 45 45 Q70 45 60 25 Q50 10 35 25" stroke="#15803d" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="34" cy="22" r="3" fill="#fff"/></svg>`
    }
  ],
  phase2Scenarios: [
    {
      id: "tiktok_capy_bath",
      title: "Viral Trend: Capybara in Bathtub",
      description: "A viral creator keeps a 50kg capybara inside a small apartment bathtub.",
      isWildHarm: true,
      ruleSpeech: "Keep it wild! A capybara cannot live in an apartment. It needs a wetland and a herd!",
      svg: `<svg viewBox="0 0 140 120" width="100%" height="100%"><ellipse cx="70" cy="70" rx="46" ry="34" fill="#92400e"/><ellipse cx="102" cy="52" rx="24" ry="20" fill="#a16207"/><circle cx="108" cy="46" r="3.5" fill="#1c1917"/><ellipse cx="94" cy="38" rx="5" ry="7" fill="#78350f"/><rect x="52" y="92" width="12" height="20" rx="6" fill="#78350f"/><rect x="80" y="92" width="12" height="20" rx="6" fill="#78350f"/></svg>`
    },
    {
      id: "tiktok_capy_lamp",
      title: "Viral Decor: Capybara Nightlight",
      description: "A squishy silicone desk lamp that taps on and off. Cute decor with zero food needed!",
      isWildHarm: false,
      ruleSpeech: "Smart choice! Buy the toy nightlight and leave the living animals in nature!",
      svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="25" y="30" width="50" height="42" rx="16" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/><circle cx="42" cy="48" r="4" fill="#854d0e"/><circle cx="58" cy="48" r="4" fill="#854d0e"/><path d="M46 56 Q50 60 54 56" stroke="#854d0e" stroke-width="2" fill="none"/><rect x="35" y="72" width="30" height="8" rx="4" fill="#cbd5e1"/><circle cx="50" cy="20" r="10" fill="rgba(250, 204, 21, 0.3)"/></svg>`
    }
  ],
  teleprompterScript: [
    "This", "is", "the", "wild", "capybara.",
    "It", "cannot", "live", "in", "a", "bedroom",
    "because", "it", "needs", "a", "wetland", "and", "a", "herd!",
    "Keep", "it", "wild!"
  ]
};

// Expose for browser scripts & ES module import
if (typeof window !== 'undefined') {
  window.GAME_DATA = GAME_DATA;
  window.WILDLIFE_DATA = GAME_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_DATA };
}
