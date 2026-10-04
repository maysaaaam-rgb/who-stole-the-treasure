================================================================================
ALLEY FLING: CATS VS DOGS — COMPLETE REPLAYABLE CLASSROOM GAME
Aim-and-Throw ESL Classroom Game for Grade 3 & Grade 4 (Unit 2)
================================================================================

1. OVERVIEW & PEDAGOGY
----------------------
"Alley Fling: Cats vs Dogs" is a high-energy, smartboard-optimized, turn-based
aim-and-throw classroom game designed for Grade 3 and Grade 4 primary ESL pupils
(ages 8-10, A1 level, Unit 2). Two teams—Cats and Dogs—face off across a cartoon
alleyway separated by an evolving wooden fence obstacle. Pupils take turns
answering curriculum questions to unlock distinct tactical throws, adjust their
angle and power against variable wind, and fling items across the alley.

The curriculum engine compiles 410 unique tasks strictly sourced from:
  * ARC: Unit 2 Arcade curriculum data (words, definitions, sentence builders)
  * BQ: Unit 2 Quiz banks (listening, vocabulary, sentences, phonics, reading)

7 Pedagogical Task Types & Fling Rewards:
-----------------------------------------
1. Listen & Choose (`listen`):
   - Pupils listen to an authentic spoken English clue (via SpeechSynthesis or
     on-demand "Hear Question" audio button) and tap the matching answer.
   - Reward: Normal Throw (Yarn for Cats, Bone for Dogs; base 25 DMG).

2. Word to Picture / Picture to Word (`word_pic`):
   - Curriculum vocabulary linked directly to clear emojis and illustrations.
   - Reward: Quick Throw (fast, lower trajectory; base 25 DMG).

3. Sentence Builder (`builder`):
   - Interactive word tiles with sentence tray, live Undo, Clear, and Check buttons.
   - Reward: Big Throw (oversized watermelons/boxes; 35 DMG).

4. Spelling Builder (`spelling`):
   - Blank letter slots (`_ _ _ _`) with uppercase letter tiles and phonics distractors.
   - Live Delete, Clear, and Check Spelling controls with tactile feedback.
   - Reward: Curve Throw (arcing trajectory that loops over tall fences).

5. Speaking Oral Prompt (`speaking`):
   - Oral classroom speaking prompt ("Say a full English sentence with the word...")
   - Displays a supportive teacher model hint.
   - Teacher marks with tactile smartboard buttons: [Good English!] or [Try Again].
   - Reward: Rainbow Throw (high-arc rainbow particle trail, 40 DMG, bounces).

6. Sentence Grammar & True/False (`grammar`):
   - Preposition choices ("thankful for"), singular/plural forms ("There is/are"),
     and past-tense verb checks ("fell", "grew", "built", "paid").
   - Reward: Shield-Breaker Throw (shatters active opponent shields immediately).

7. Short Reading Passage (`reading`):
   - Short illustrated reading fact or narrative with comprehension question.
   - Reward: Quick / Normal Throw.

Mastery Tracking & End-Screen Skill Report:
-------------------------------------------
- Every attempt is tracked in memory via `EXTRA_ENGINE.createMasteryTracker()`.
- Generates a 7-bar skill report at game conclusion showing percentage mastery.
- Highlights the class's strongest skill ("Super at Listening!").
- Displays missed words with one-tap 🔊 pronunciation audio buttons.
- "Practise Missed Words" launcher immediately sets up a targeted practice session.


2. GAME MODES & ARENAS
----------------------
4 Game Modes:
- ⚔️ Team Battle: Classic Cats vs Dogs team face-off with 100 HP energy bars.
- 🦝 Friendly Co-op (Bin Boss): Entire class teams up against the mischievous Bin Boss
  raccoon in a 3-phase raid battle (150 HP, tosses banana peels, phase triggers).
- ⚡ Quick Quiz (5m): Rapid 5-minute smartboard speed challenge; tracks total hit count.
- 🎯 Practice Mode: Relaxed exploratory mode with unlimited turns and instant feedback.

5 Arenas:
- 🏙️ Alley: Sunlit European brick townhouses, cobblestones, and pastel roofs.
- 🌾 Harvest Field: Golden wheat fields and warm autumn sunset.
- 🌲 Forest: Deep evergreen pines and cool mountain backdrop.
- 🌕 Moon Night: Cosmic night sky with giant glowing harvest full moon.
- 🌈 Rainbow Rooftop: Vibrant pastel fantasy rooftop vista.


3. PHYSICS & THROWING ENGINE
----------------------------
- 1000 x 600 Virtual Coordinate Space mapped responsively to any screen aspect ratio.
- 6 Tactical Throw Types: Normal, Quick, Big, Curve, Rainbow, and Shield-Breaker.
- Dynamic Ground & Fence Bounces: Projectiles bounce off the ground pavement with
  velocity dampening; clipping the top edge of the fence causes a deflection clink.
- 3 Distinct Hit Zones on Characters:
  * Head / Bullseye: 30 DMG (60 on Double)
  * Torso / Body: 25 DMG (50 on Double)
  * Feet / Graze: 10 DMG (20 on Double)
- Dynamic Obstacles & Props:
  * Moving Obstacle: Flying bird / drone passes horizontally across the alley at Level 2+.
  * Ground Trampoline: Bounces low-flying throws back up into the air.
  * Mystery Crates: Periodically float down with parachutes, granting free shields/doubles.
- Comeback Assist:
  * When a team falls behind by 50+ HP, the pupil receives a larger hit detection
    radius and a complimentary ×2 Double power-up.
- Calm Mode:
  * One-tap toggle that softens sound effects, slows animations, and minimizes shaking.


4. TEACHER TOOLBAR DOCK
-----------------------
A persistent, non-intrusive floating dock located at the top-right of the alley stage:
- ⏸ Pause: Freezes all physics, timers, and input.
- ⏭ Skip: Passes the current question cleanly without penalty.
- ⏪ Back: Re-opens the question modal if accidentally closed.
- 🔄 Re-roll: Fetches a fresh curriculum question from the bank.
- ⭐ +Star: Immediately awards a Class Star with celebratory chime and comic popup.
- ⏱ Timer: Toggles smartboard question countdown: OFF -> 20s -> 40s -> OFF.
- 👥 Swap: Rotates to the next pupil in the roster if the active pupil is absent.


5. ASSET SPECIFICATION & FALLBACK TIERS
---------------------------------------
Assets load with automated 3-tier fallback:
- Tier 1: `unit2-throw/art/*.webp` (Transparent cutout WebP renders)
- Tier 2: `unit2-throw/art-new/*.png` (17 high-res generated cartoon PNG assets)
- Tier 3: Procedural CSS illustrations, SVGs, and emoji sticker badges

Asset Directory Structure:
  unit2-throw/
  ├── index.html                # Single-page responsive game host
  ├── extra.js                  # 410-task curriculum bank compiler & mastery tracker
  ├── gameplay.js               # Reactive gameplay, physics, audio, and DOM controller
  ├── test-full-gameplay.js     # Comprehensive automated Node & CDP test suite
  ├── README.txt                # This documentation file
  ├── PROGRESS.txt              # Implementation & test verification log
  ├── art-new/                  # 17 generated game assets (PNG)
  └── screens/                  # 34 automated CDP test screenshots (1134x417 & 1920x1080)


6. VERIFICATION & QUALITY ASSURANCE
-----------------------------------
All deliverables have been tested and verified via `node unit2-throw/test-full-gameplay.js`:
- Part A Unit Tests: 42/42 tests passed (Physics math, damage zones, shields, combos,
  comeback assist, boss phase transitions, task bank schema validation).
- Language Verification: 0 Turkish words found across all files and data structures.
- Screen Reachability (document.elementFromPoint): 100% reachable across 5 target resolutions:
  1920x1080, 1134x417, 1024x600, 800x520, and 1134x914.
- 34 Screenshots Captured into `unit2-throw/screens/` covering settings, all 7 task types,
  aiming, flight trail, hit/miss reactions, fence clink, mystery crate, bin boss,
  teacher toolbar, and end-screen skill report.
- 8 Complete Simulated Matches: Played cleanly across all 4 modes and both grades
  with 0 console errors and 0 occurrences of undefined, null, or NaN.
