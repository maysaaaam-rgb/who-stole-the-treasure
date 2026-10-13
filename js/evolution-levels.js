/* The XP needed for each of the 7 monster levels, in ONE place.
   Level:            1 Egg  2 Cracking  3 Baby  4 Growing  5 Adventurer  6 Advanced  7 Ultimate
   school-store.js, gamification-milestones.js and monster-renderer.js all read this list (each keeps the same numbers as a fallback).
   Changed 2026-10-13: Level 7 from 5,000 to 3,500 XP. Levels 1-6 stay the same, so no pupil goes down a level. */
window.EAA_EVOLUTION_XP = window.EAA_EVOLUTION_XP || [0, 30, 200, 500, 1000, 2000, 3500];
/* A look-only bonus (no level change): a Growing Monster with this much XP glows a little, because it is close to Level 5. */
window.EAA_NEAR_EVOLVE_XP = window.EAA_NEAR_EVOLVE_XP || 750;
