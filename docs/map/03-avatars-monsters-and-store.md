# 03 — Avatars, Monster Studio & Unified Classroom Store

> Back to [SITE_MAP.md](file:///C:/Users/maysa/Desktop/DV/SITE_MAP.md)

---

## 1. Architecture Overview

English Adventure Academy features **two complementary companion/character pipelines** managed through a **single unified store & customization experience**:

1. **Pixar 3D Pupil Avatars ([pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js))**:
   - Composites real 3D rendered pupil heads (`assets/avatars/student-<class>-<id>-*.webp`), skin-tone neck/hands (`skin_*.webp`), balanced proportional bodies (`body_stand.webp`, `body_wave.webp`, `body_cheer.webp`, `body_jump.webp`), and layered 3D store wearables (`assets/avatars/wear/*.webp`).
   - **3D WebGL Extruded Stadium Rig (`PupilAvatars.composePitchRigParts`)**: Extracts transparent torso, head, and hip-socket articulated left/right legs for real-time Three.js 3D volumetric characters in Game Maker's **3D Penalty Shootout** ([mode-penalty.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-penalty.js)).
2. **Unified Classroom Store & Customizer ([classroom-store.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js))**:
   - Single-window shop & live try-on studio (`switchView('store-pupil')` for pupils / Class Board, `switchView('store-teacher')` for teacher pricing, coins, stock & purchase logs).
   - Connects directly to **Mystery Boxes** ([mystery-box-v2.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-v2.js), [mystery-box-modal.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js)) and student coin balances in `schoolStore`.
3. **8-Layer Monster Companion Stage ([monster-renderer.js](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js))**:
   - Renders level-evolving elemental monsters + teacher-approved drawn store creatures (e.g. Sky Dragon `creature-dragon`) with anchor-fitted cosmetics ([monster-anchors.js](file:///C:/Users/maysa/Desktop/DV/js/monster-anchors.js)).

---

## 2. `assets/avatars/` Asset Hierarchy & Privacy Status

| Asset Group | Path Pattern | Count on Disk | Git / Privacy Rule |
| :--- | :--- | :---: | :--- |
| **Anonymized Pupil Heads** | `assets/avatars/student-<3a..4b>-<id>-*.webp` | **0** | Safe placeholder IDs (real names live ONLY in Supabase `students`) |
| **3D Body Pose Bases** | `assets/avatars/body_*.webp` | **6** | Safe core 3D pose sprites (`stand`, `wave`, `cheer`, `jump`) |
| **Skin Tone Neck/Hands** | `assets/avatars/skin_*.webp` | **3** | Safe skin tone tint layers |
| **3D Store Wearables** | `assets/avatars/wear/*.webp` | **183** | Safe hats, glasses, shirts, capes, shoes & held items |
| **Untracked Real-Name Files** | `assets/avatars/<redacted-pupil-file>.webp` | **50** | **DO NOT COMMIT (`AGENTS.md` §8)** — local scratch files only |

---

## 3. Monster Studio 8-Layer Composite Contract (`.monster-composite-stage`)

| Z-Index | DOM Layer ID | Class | Contents & Rule |
| :---: | :--- | :---: | :--- |
| `0` | `#layer-aura-back` | `z-0` | Magical aura particles, flames, sparkles, cosmic star rings |
| `10` | `#layer-back-gear` | `z-10` | Back gear behind torso: Wings, Capes, Tails, Backpacks |
| `20` | `#layer-body` | `z-20` | Base monster silhouette, paws, torso, front ears (or Dragon body) |
| `30` | `#layer-clothing` | `z-30` | Outfits wrapped to torso: Vests, Robes, Hoodies, Armor, Uniforms |
| `40` | `#layer-face` | `z-40` | Face expressions: Eyes, Muzzle/Snout, Mouth, Cheeks (over clothing) |
| `50` | `#layer-glasses` | `z-50` | Face accessories: Round wire glasses, Goggles, Shades |
| `60` | `#layer-horns` | `z-60` | Horns & crests (Sprout nubs, Curved horns, Crystal, Gold, Star) |
| `70` | `#layer-headwear` | `z-70` | Headwear: Hats, Caps, Crowns, Wizard hats, Bandanas, Held items |

- **Ground Reflection Pedestal:** `#preview-pedestal` (`.pedestal-disk` / `.pedestal-disc`) sits immediately below `.monster-composite-stage`.
- **Level Lock Invariant (`AGENTS.md` §3.4):** Cosmetics with `unlockLevel > currentMonster.level` render `🔒 Level X` with `pointer-events: none; opacity: 0.45; filter: grayscale(0.7)` and are rejected in both `handleSelectMonsterItem` and `equipItem`.

---

## 4. All Avatar, Monster & Store Modules (21 files)

| Module | Lines / Size | Exports | Purpose |
| :--- | :---: | :--- | :--- |
| [classroom-cosmetics.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-cosmetics.js) | 122L (9.9 KB) | `ClassroomCosmetics` | Classroom Store extras: the catalog and the sounds. |
| [classroom-store.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js) | 2162L (167.5 KB) | `boxTierInfo`, `EAA_ILLUSTRATED_MONSTERS`, `renderBoxTierCardsHtml`, `ClassroomStore`, `renderClassroomStoreView` | Classroom Store: coins, buying monster items and mystery boxes, and classroom privileges. |
| [evolution-levels.js](file:///C:/Users/maysa/Desktop/DV/js/evolution-levels.js) | 8L (0.7 KB) | `EAA_EVOLUTION_XP`, `EAA_NEAR_EVOLVE_XP` | The XP needed for each of the 7 monster levels, in ONE place. |
| [monster-anchors.js](file:///C:/Users/maysa/Desktop/DV/js/monster-anchors.js) | 7L (17.3 KB) | `MONSTER_ANCHORS`, `MONSTER_ITEM_BOX` | Generated: positions of the head, eyes, neck, body and paw on every illustrated monster (1024px space), |
| [monster-closet.js](file:///C:/Users/maysa/Desktop/DV/js/monster-closet.js) | 191L (18.5 KB) | `EAA_ILLUSTRATED_MONSTERS`, `MonsterCloset`, `renderMonsterCloset` | Monster Closet: pick a pupil, try things on the 3D monster, save. |
| [monster-costumes.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes.js) | 303L (30.8 KB) | `MonsterCostumes` | Monster Costumes: 8 themed sets x 3 pieces (24 new drawn items). |
| [monster-costumes2.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes2.js) | 209L (29.6 KB) | — | Monster Costumes, batch 2: 8 more themed sets (24 pieces) and 4 standalone legendary pieces. |
| [monster-costumes3.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes3.js) | 97L (13 KB) | — | Monster Costumes, batch 3: Halloween. 4 themed sets and 3 standalone pieces (12 pieces), all friendly and funny. |
| [monster-costumes4.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes4.js) | 89L (8.4 KB) | — | Monster Costumes, batch 4: the Mythic shelf (5 animated pieces, the top of the store) and trails (6 effects that follow the monster in the Island's walking worl |
| [monster-dressup.js](file:///C:/Users/maysa/Desktop/DV/js/monster-dressup.js) | 322L (22.2 KB) | `MonsterDressUp`, `EAA_ILLUSTRATED_MONSTERS` | Monster Dress-Up: puts accessory pictures on the illustrated monsters. |
| [monster-fit.js](file:///C:/Users/maysa/Desktop/DV/js/monster-fit.js) | 3L (28.7 KB) | `MONSTER_OVERRIDES` | Generated hat fit: per monster and per hat, simulated on the real pixels (see _tmp/autofit2.py). Hats sit on the head with a small seat and never cover the eyes |
| [monster-outfits.js](file:///C:/Users/maysa/Desktop/DV/js/monster-outfits.js) | 211L (19.8 KB) | `MonsterOutfits` | Monster outfits, redrawn 10 Nov 2026 to match the 3D shop pictures (colour, collar, buttons, belts, emblems). |
| [monster-pets.js](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js) | 1201L (223.3 KB) | `MonsterPets` | Monster Pets & 3D Character Buddies Pack |
| [monster-renderer.js](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js) | 4614L (272.8 KB) | `currentEvolutionBannerSpecies`, `switchEvolutionBannerSpecies`, `MonsterRenderer`, `getMonsterAsset`, `renderMonsterSVG` | ENGLISH ADVENTURE ACADEMY — PROCEDURAL MONSTER RENDERER |
| [mystery-box-modal.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js) | 967L (44.5 KB) | `MysteryBoxModal`, `TradingCabinet`, `openMysteryBoxModal`, `openTradingCabinet` | ENGLISH ADVENTURE ACADEMY — MYSTERY BOX UNBOXING & TRADING ENGINE |
| [mystery-box-v2.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-v2.js) | 223L (20.8 KB) | `MysteryBoxArt` | Mystery box opening, version 2 (9 Nov 2026). Replaces the drawn chest and the "energy surge" texts. |
| [no-monsters.js](file:///C:/Users/maysa/Desktop/DV/js/no-monsters.js) | 119L (7.6 KB) | `EAA_HIDE_MONSTERS`, `renderMonsterSVG`, `triggerEvolutionCeremony`, `switchView`, `openMonsterCreator` | Monsters hidden (11 Nov 2026). |
| [pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js) | 3639L (184.2 KB) | `PupilAvatars` | Pupil avatars (v2) |
| [pupil-card.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-card.js) | 156L (17.9 KB) | `PupilCard` | Pupil trading card, laid out like a real Yu-Gi-Oh monster card: a name banner with an attribute orb, level stars, the monster picture in a framed art box |
| [pupil-profile.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-profile.js) | 173L (19.9 KB) | `PupilProfile` | Pupil profile: one dark page for the teacher (no tabs). Top: who, status + reason, quick actions. Then the numbers that matter (XP, quiz, homework, |
| [sleepy-monster.js](file:///C:/Users/maysa/Desktop/DV/js/sleepy-monster.js) | 633L (33.7 KB) | `SleepyMonster`, `openSleepyMonster` | Sleepy Monster: a full-screen noise game for the class. |
