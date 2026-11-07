/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Feature Flags (island/js/config.js)
   Controls which non-Chapter-1 sandbox systems are visible/active.
   Code for parked features is preserved; setting a flag to false
   hides its HUD buttons and world entry points cleanly.
   ═══════════════════════════════════════════════════════════════ */
const FEATURES = {
  sports: false,
  home: false,
  crafting: false,
  energy: false,
  battles: false,
  villagers: false,
  store: false,
  look: false
};

if (typeof window !== 'undefined') {
  window.FEATURES = FEATURES;
}
