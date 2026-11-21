# 02 — Core JavaScript Modules, CSS & Giant Monolith Maps

> Back to [SITE_MAP.md](file:///C:/Users/maysa/Desktop/DV/SITE_MAP.md)

---

## 1. All `css/*.css` Stylesheets (13 files)

| File | Size | Lines | Loaded in `index.html`? |
| :--- | :---: | :---: | :---: |
| [bright-platform.css](file:///C:/Users/maysa/Desktop/DV/css/bright-platform.css) | 43.7 KB | 392 | Yes (#9, `?v=20261121c`) |
| [class-mode-pages.css](file:///C:/Users/maysa/Desktop/DV/css/class-mode-pages.css) | 16.8 KB | 119 | Yes (#7, `?v=7`) |
| [class-mode.css](file:///C:/Users/maysa/Desktop/DV/css/class-mode.css) | 30.5 KB | 407 | Yes (#6, `?v=20261121c`) |
| [clil-styles.css](file:///C:/Users/maysa/Desktop/DV/css/clil-styles.css) | 7.8 KB | 330 | Module / Legacy |
| [eaa-theme.css](file:///C:/Users/maysa/Desktop/DV/css/eaa-theme.css) | 5.2 KB | 104 | Yes (#2, `?v=3`) |
| [expedition-styles.css](file:///C:/Users/maysa/Desktop/DV/css/expedition-styles.css) | 6.5 KB | 298 | Module / Legacy |
| [glass-theme.css](file:///C:/Users/maysa/Desktop/DV/css/glass-theme.css) | 9.6 KB | 101 | Yes (#5, `?v=6`) |
| [room-styles.css](file:///C:/Users/maysa/Desktop/DV/css/room-styles.css) | 15.3 KB | 689 | Module / Legacy |
| [school-platform.css](file:///C:/Users/maysa/Desktop/DV/css/school-platform.css) | 239.3 KB | 9872 | Yes (#1, `?v=8`) |
| [style.css](file:///C:/Users/maysa/Desktop/DV/css/style.css) | 34 KB | 1205 | Yes (#3, `?v=4`) |
| [styles.css](file:///C:/Users/maysa/Desktop/DV/css/styles.css) | 48.2 KB | 2346 | Module / Legacy |
| [tines-theme.css](file:///C:/Users/maysa/Desktop/DV/css/tines-theme.css) | 48.4 KB | 1467 | Yes (#8, `?v=20261121b`) |
| [ui-polish.css](file:///C:/Users/maysa/Desktop/DV/css/ui-polish.css) | 41.8 KB | 919 | Yes (#4, `?v=17`) |

---

## 2. All `js/*.js` Modules Grouped by Subsystem (90 files)

### Utilities & Helpers (21)
| File | Size | Lines | In `index.html` | `window.*` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [academy-audio.js](file:///C:/Users/maysa/Desktop/DV/js/academy-audio.js) | 4.2 KB | 121 | #40 (`v=3.1`) | `AcademySoundEngine`, `academyAudio` | Adventure Academy - Global Sound System (Harmonic Web Audio) |
| [app.js](file:///C:/Users/maysa/Desktop/DV/js/app.js) | 58.7 KB | 1580 | Standalone | `app`, `addQuickXP`, `syncSingleStudentXP`, `openDirectXPEdit` | Main Application Engine: State, Transitions, Interactions, Responsive Stage Scaling |
| [audio.js](file:///C:/Users/maysa/Desktop/DV/js/audio.js) | 11.6 KB | 402 | Standalone | `soundEngine` | Audio Engine for "Who Stole the Treasure?" |
| [avatar-3d-engine.js](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js) | 78.2 KB | 1839 | Standalone | `Avatar3DEngine` | ENGLISH ADVENTURE ACADEMY — 3D .GLB AVATAR, AUTO-RIGGER & BONE-SOCKET ENGINE (v2) |
| [clil-data.js](file:///C:/Users/maysa/Desktop/DV/js/clil-data.js) | 26.3 KB | 546 | Standalone | — | CLIL CRIME LAB: FOUR MYSTERY CASES (4th Grade English & CLIL Revision) |
| [clil-game.js](file:///C:/Users/maysa/Desktop/DV/js/clil-game.js) | 6.8 KB | 205 | Standalone | `clilEngine` | CLIL CRIME LAB: GAME ENGINE |
| [clil-svg.js](file:///C:/Users/maysa/Desktop/DV/js/clil-svg.js) | 27 KB | 432 | Standalone | — | CLIL CRIME LAB: VECTOR SVG ASSET GENERATOR |
| [clil-ui.js](file:///C:/Users/maysa/Desktop/DV/js/clil-ui.js) | 42.3 KB | 881 | Standalone | `clilUI` | CLIL CRIME LAB: UI CONTROLLER |
| [data.js](file:///C:/Users/maysa/Desktop/DV/js/data.js) | 36.4 KB | 965 | Standalone | — | Game Data for "Who Stole the Treasure?" & "Detective Preparation" |
| [expedition-data.js](file:///C:/Users/maysa/Desktop/DV/js/expedition-data.js) | 23.3 KB | 582 | Standalone | — | THE LAST EXPEDITION: A Grade 4 CLIL Prediction & Problem-Solving Game |
| [expedition-game.js](file:///C:/Users/maysa/Desktop/DV/js/expedition-game.js) | 3.4 KB | 124 | Standalone | `expeditionEngine` | THE LAST EXPEDITION: GAME ENGINE |
| [expedition-svg.js](file:///C:/Users/maysa/Desktop/DV/js/expedition-svg.js) | 18.9 KB | 315 | Standalone | — | THE LAST EXPEDITION: VECTOR SVG ASSET GENERATOR |
| [expedition-ui.js](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js) | 74.1 KB | 1731 | Standalone | `expeditionUI` | THE LAST EXPEDITION: UI CONTROLLER |
| [game.js](file:///C:/Users/maysa/Desktop/DV/js/game.js) | 19.1 KB | 375 | Standalone | `gameEngine` | Core Game Engine for "Who Stole the Treasure?" & "Detective Preparation" |
| [games-points-bridge.js](file:///C:/Users/maysa/Desktop/DV/js/games-points-bridge.js) | 7.6 KB | 212 | #65 (`v=1`) | `GamesPointsBridge` | ENGLISH ADVENTURE ACADEMY — GAMES COLLECTION XP BRIDGE (js/games-points-bridge.js) |
| [room-data.js](file:///C:/Users/maysa/Desktop/DV/js/room-data.js) | 18.4 KB | 339 | Standalone | — | Room Rescue: The Lost Things Mission (4th Grade English Revision Game) |
| [room-game.js](file:///C:/Users/maysa/Desktop/DV/js/room-game.js) | 5.3 KB | 196 | Standalone | `roomGameEngine` | Room Rescue: Core Engine |
| [room-svg.js](file:///C:/Users/maysa/Desktop/DV/js/room-svg.js) | 14.4 KB | 258 | Standalone | — | Room Rescue: Rich Vector/SVG Visual Assets |
| [room-ui.js](file:///C:/Users/maysa/Desktop/DV/js/room-ui.js) | 58.3 KB | 1393 | Standalone | `roomUI` | Room Rescue: UI & Real Drag-and-Drop Controller |
| [sound-engine.js](file:///C:/Users/maysa/Desktop/DV/js/sound-engine.js) | 17 KB | 537 | Standalone | `AcademySoundEngine`, `academyAudio` | Adventure Academy - Global Sound System (Harmonic Web Audio Engine) |
| [voice.js](file:///C:/Users/maysa/Desktop/DV/js/voice.js) | 5.9 KB | 128 | Standalone | `EAAVoice` | EAA shared voice module (window.EAAVoice) |

### Assessments, Quizzes & Reports (11)
| File | Size | Lines | In `index.html` | `window.*` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [all-about-me-data.js](file:///C:/Users/maysa/Desktop/DV/js/all-about-me-data.js) | 6.2 KB | 250 | #52 (`v=2.0`) | `ALL_ABOUT_ME_TEAMS`, `AllAboutMeData` | ALL ABOUT ME: classroom teams (public, ids and team names only) + survey answers. |
| [all-about-me-profile.js](file:///C:/Users/maysa/Desktop/DV/js/all-about-me-profile.js) | 16.3 KB | 422 | #53 (`v=1.0`) | `AllAboutMeProfile` | All About Me (AAM) Student Profile View Component |
| [gamification-milestones.js](file:///C:/Users/maysa/Desktop/DV/js/gamification-milestones.js) | 24.9 KB | 552 | #46 (`v=3.4`) | `playHarmonicChime`, `renderCurrentView`, `EVOLUTION_TIERS`, `getStageFromXP` | ENGLISH ADVENTURE ACADEMY — GAMIFICATION & EVOLUTION MILESTONES ENGINE |
| [milestone-ceremony.js](file:///C:/Users/maysa/Desktop/DV/js/milestone-ceremony.js) | 26.8 KB | 350 | #66 (`v=13`) | `openMonsterLevelUpModal`, `updateHeaderBadges`, `openStudentDetail`, `MilestoneCeremony` | 1,000 XP Grand Ceremony: a big full-screen celebration for a pupil who reaches Level 5 (Adventurer), |
| [parent-report.js](file:///C:/Users/maysa/Desktop/DV/js/parent-report.js) | 47 KB | 427 | #58 (`v=21`) | `ParentReport` | Parent report cards. One clean A4 card per pupil: parents' names, the 4 skills, Unit 3 quiz in words, homework, XP, attendance and a short teacher comment in En |
| [progress-check.js](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js) | 107.1 KB | 1583 | #45 (`v=3.0`) | `setProgressCheckViewMode`, `triggerManualCloudSync`, `switchProgressCheckSelection`, `switchProgressCheckClass` | ENGLISH ADVENTURE ACADEMY — FOUR-SKILL WHOLE-CLASS PROGRESS CHECK |
| [quiz-engine.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-engine.js) | 18.7 KB | 521 | #69 (`v=1.2`) | `ClassroomSoundboard`, `classSoundboard`, `playCoinChime`, `playPartyHorn` | Adventure Academy - Quiz & Task-by-Task Worksheet Grading Engine |
| [quiz-results.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-results.js) | 21.8 KB | 177 | #56 (`v=15`) | `QuizResults` | Unit 3 paper quiz results (Grade 3, Form B, 15 Oct 2026). Opens from the library card "Unit 3 Quiz Results". |
| [quiz-skills.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-skills.js) | 11 KB | 133 | #57 (`v=5`) | `QuizSkills` | Unit 3 quiz -> the pupil's 4 skills (listening, reading, writing, speaking) -> saved as an assessment, so the report generator, the Progress & CEFR page and the |
| [sheet-sync.js](file:///C:/Users/maysa/Desktop/DV/js/sheet-sync.js) | 15 KB | 172 | #54 (`v=9`) | `SheetSync` | Google Sheet sync for the Assignments page. |
| [worksheet-sync.js](file:///C:/Users/maysa/Desktop/DV/js/worksheet-sync.js) | 10.1 KB | 100 | #55 (`v=4`) | `WorksheetSync` | Worksheet sync: shows this grade's worksheets at the top of the Assignments page, checks that each worksheet file opens, |

### Live Classroom & Smartboard (11)
| File | Size | Lines | In `index.html` | `window.*` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [bathroom-pass.js](file:///C:/Users/maysa/Desktop/DV/js/bathroom-pass.js) | 12 KB | 109 | #33 (`v=3`) | `BathroomPass` | Bathroom pass: a pupil signs out and back in on the Class Board, the teacher gets the times. |
| [birthday.js](file:///C:/Users/maysa/Desktop/DV/js/birthday.js) | 17.4 KB | 192 | #39 (`v=4`) | `Birthday` | Birthday Star: press a birthday pupil's monster or name (roster card or Class Board) and a full-screen birthday |
| [board-scenes.js](file:///C:/Users/maysa/Desktop/DV/js/board-scenes.js) | 8.6 KB | 71 | #30 (`v=9`) | `BoardScenes` | Class Board scenes: the roster becomes a place where the monsters live. The scene changes with the class and the date |
| [class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js) | 96.5 KB | 1056 | #32 (`v=47`) | `ClassBoard`, `renderClassBoardView` | Class Board: a full-screen projector view. Every monster with its points and quick +1/+5/+10, |
| [class-journey.js](file:///C:/Users/maysa/Desktop/DV/js/class-journey.js) | 23.3 KB | 250 | #25 (`v=2`) | `ClassJourney` | Where we are (teacher only): for each class the last lesson (done or not), what the class still finds hard, the next lesson with what to print, |
| [class-mode.js](file:///C:/Users/maysa/Desktop/DV/js/class-mode.js) | 27.3 KB | 457 | #37 (`v=20261121c`) | `openGameMaker`, `switchView`, `ClassMode`, `renderGameShelf` | Class Mode: a bright, picture-first skin for the whole platform, used on the smartboard. |
| [class-rewards.js](file:///C:/Users/maysa/Desktop/DV/js/class-rewards.js) | 14.8 KB | 119 | #35 (`v=11`) | `EAA_ILLUSTRATED_MONSTERS`, `ClassRewards`, `renderRewardsHall` | Rewards Hall: the smartboard Podium & Badges view inside the unified Store & Podium Hub. |
| [class-view.js](file:///C:/Users/maysa/Desktop/DV/js/class-view.js) | 20.1 KB | 203 | #34 (`v=14`) | `ClassView`, `renderClassView` | Class view: one simple smartboard screen for the classroom. Big 3D picture buttons only. |
| [classroom-sounds.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-sounds.js) | 31 KB | 451 | #68 (`v=2`) | `ClassroomSoundboard`, `ClassroomSoundList`, `classSoundboard` | English Adventure Academy - Classroom Soundboard Engine v2 |
| [simon-says-game.js](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js) | 58.1 KB | 1223 | #67 (`v=4.1`) | `renderMonsterAvatar`, `closeModal`, `SimonSaysController`, `simonGame` | ENGLISH ADVENTURE ACADEMY — SIMON SAYS CLASSROOM GAME |
| [voice-fx.js](file:///C:/Users/maysa/Desktop/DV/js/voice-fx.js) | 35.1 KB | 436 | #28 (`v=5`) | `VoiceFX` | Voice Changer (teacher toolkit): speak into the microphone and the speakers play your voice as a character. |

### Curriculum, Library & Island (13)
| File | Size | Lines | In `index.html` | `window.*` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [calendar-view.js](file:///C:/Users/maysa/Desktop/DV/js/calendar-view.js) | 94.1 KB | 826 | #23 (`v=20261116`) | `renderCalendarView`, `CalendarView` | Teacher calendar (sidebar: 📅 Calendar). Month and Week views of: the lessons of every class (from the weekly timetable, or the k12 timetable until it is set), |
| [games-data.js](file:///C:/Users/maysa/Desktop/DV/js/games-data.js) | 427.5 KB | 10882 | #1 (`v=20261121b`) | `GAMES_DATA` | English Adventure Academy — Curriculum & Games Registry |
| [homework-data.js](file:///C:/Users/maysa/Desktop/DV/js/homework-data.js) | 15.3 KB | 392 | #8 (`v=3.1`) | `ALICE_HOMEWORK_ASSIGNMENTS`, `ALICE_WONDERLAND_XP_QUEST`, `AdventureAcademy`, `openMonsterLevelUpModal` | ADVENTURE ACADEMY — DISCRETE HOMEWORK XP TASKS DATA |
| [island-apply.js](file:///C:/Users/maysa/Desktop/DV/js/island-apply.js) | 13.3 KB | 319 | #11 (`v=2`) | `IslandApply` | Practice Island — Platform XP & Monster Look Auto-Applier (js/island-apply.js) |
| [island-curriculum-data.js](file:///C:/Users/maysa/Desktop/DV/js/island-curriculum-data.js) | 202.6 KB | 3813 | Standalone | `ISLAND_CURRICULUM_DATA` | ISLAND HOMEWORK REVISION PROJECT — MASTER CURRICULUM DATASET |
| [library-curate.js](file:///C:/Users/maysa/Desktop/DV/js/library-curate.js) | 9.7 KB | 103 | #29 (`v=20261121b`) | `LibraryCurate` | Library clean-up: hide the lessons and games you do not want, star the best ones. |
| [library-shelf.js](file:///C:/Users/maysa/Desktop/DV/js/library-shelf.js) | 18.6 KB | 310 | #50 (`v=20261121c`) | `LibraryShelf` | Library shelf: Unified Hub 2 ("Lessons & Games"). |
| [library.js](file:///C:/Users/maysa/Desktop/DV/js/library.js) | 26.4 KB | 657 | #49 (`v=3.1.3`) | `getFilteredLibraryLessons`, `launchGame`, `LibraryController`, `CurriculumLibraryController` | ENGLISH ADVENTURE ACADEMY — LESSON LIBRARY ARCHITECTURE (V3.0) |
| [retired-themes.js](file:///C:/Users/maysa/Desktop/DV/js/retired-themes.js) | 1.6 KB | 32 | #20 (`v=3`) | `RetiredThemes` | Retired themes (2 Nov 2026): Alice in Wonderland and the Chuseok / Korean festival are gone from the platform. |
| [revision-board.js](file:///C:/Users/maysa/Desktop/DV/js/revision-board.js) | 10.5 KB | 107 | #24 (`v=1`) | `RevisionBoard` | Revision board (teacher only): what the class missed, each pupil's level, suggested groups and pairs, and the cloud copy. |
| [theme-badges.js](file:///C:/Users/maysa/Desktop/DV/js/theme-badges.js) | 1.9 KB | 38 | #51 (`v=2.0`) | `updateClassroomTheme`, `resolveStudentCompanion`, `getStudentBadge`, `renderStudentThemeBadge` | ENGLISH ADVENTURE ACADEMY: class themes and companion badges (neutral version, 2 Nov 2026) |
| [timetable.js](file:///C:/Users/maysa/Desktop/DV/js/timetable.js) | 37.5 KB | 339 | #21 (`v=20261116`) | `Timetable` | Weekly timetable: the teacher sets it once (per class, Monday to Friday) and the dashboard and the Class Board |
| [unit2-content.js](file:///C:/Users/maysa/Desktop/DV/js/unit2-content.js) | 53.1 KB | 128 | #22 (`v=ti101`) | `Unit2Content` | Unit 2 content for Grade 3 (Global Readings 2, Thank You) and Grade 4 (Global Readings 3, What Lives Here?). |

### Avatars, Monsters & Store (21)
| File | Size | Lines | In `index.html` | `window.*` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [classroom-cosmetics.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-cosmetics.js) | 9.9 KB | 122 | #17 (`v=1`) | `ClassroomCosmetics` | Classroom Store extras: the catalog and the sounds. |
| [classroom-store.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js) | 167.5 KB | 2162 | #19 (`v=20261121b`) | `boxTierInfo`, `EAA_ILLUSTRATED_MONSTERS`, `renderBoxTierCardsHtml`, `ClassroomStore` | Classroom Store: coins, buying monster items and mystery boxes, and classroom privileges. |
| [evolution-levels.js](file:///C:/Users/maysa/Desktop/DV/js/evolution-levels.js) | 0.7 KB | 8 | #9 (`v=1`) | `EAA_EVOLUTION_XP`, `EAA_NEAR_EVOLVE_XP` | The XP needed for each of the 7 monster levels, in ONE place. |
| [monster-anchors.js](file:///C:/Users/maysa/Desktop/DV/js/monster-anchors.js) | 17.3 KB | 7 | #43 (`v=2.1`) | `MONSTER_ANCHORS`, `MONSTER_ITEM_BOX` | Generated: positions of the head, eyes, neck, body and paw on every illustrated monster (1024px space), |
| [monster-closet.js](file:///C:/Users/maysa/Desktop/DV/js/monster-closet.js) | 18.5 KB | 191 | #36 (`v=6`) | `EAA_ILLUSTRATED_MONSTERS`, `MonsterCloset`, `renderMonsterCloset` | Monster Closet: pick a pupil, try things on the 3D monster, save. |
| [monster-costumes.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes.js) | 30.8 KB | 303 | #12 (`v=5`) | `MonsterCostumes` | Monster Costumes: 8 themed sets x 3 pieces (24 new drawn items). |
| [monster-costumes2.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes2.js) | 29.6 KB | 209 | #13 (`v=3`) | — | Monster Costumes, batch 2: 8 more themed sets (24 pieces) and 4 standalone legendary pieces. |
| [monster-costumes3.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes3.js) | 13 KB | 97 | #14 (`v=2`) | — | Monster Costumes, batch 3: Halloween. 4 themed sets and 3 standalone pieces (12 pieces), all friendly and funny. |
| [monster-costumes4.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes4.js) | 8.4 KB | 89 | #15 (`v=1`) | — | Monster Costumes, batch 4: the Mythic shelf (5 animated pieces, the top of the store) and trails (6 effects that follow the monster in the Island's walking worl |
| [monster-dressup.js](file:///C:/Users/maysa/Desktop/DV/js/monster-dressup.js) | 22.2 KB | 322 | #44 (`v=9`) | `MonsterDressUp`, `EAA_ILLUSTRATED_MONSTERS` | Monster Dress-Up: puts accessory pictures on the illustrated monsters. |
| [monster-fit.js](file:///C:/Users/maysa/Desktop/DV/js/monster-fit.js) | 28.7 KB | 3 | Standalone | `MONSTER_OVERRIDES` | Generated hat fit: per monster and per hat, simulated on the real pixels (see _tmp/autofit2.py). Hats sit on the head with a small seat and never cover the eyes |
| [monster-outfits.js](file:///C:/Users/maysa/Desktop/DV/js/monster-outfits.js) | 19.8 KB | 211 | #41 (`v=3`) | `MonsterOutfits` | Monster outfits, redrawn 10 Nov 2026 to match the 3D shop pictures (colour, collar, buttons, belts, emblems). |
| [monster-pets.js](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js) | 223.3 KB | 1201 | #16 (`v=9`) | `MonsterPets` | Monster Pets & 3D Character Buddies Pack |
| [monster-renderer.js](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js) | 272.8 KB | 4614 | #42 (`v=4.17`) | `currentEvolutionBannerSpecies`, `switchEvolutionBannerSpecies`, `MonsterRenderer`, `getMonsterAsset` | ENGLISH ADVENTURE ACADEMY — PROCEDURAL MONSTER RENDERER |
| [mystery-box-modal.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js) | 44.5 KB | 967 | #47 (`v=1.4`) | `MysteryBoxModal`, `TradingCabinet`, `openMysteryBoxModal`, `openTradingCabinet` | ENGLISH ADVENTURE ACADEMY — MYSTERY BOX UNBOXING & TRADING ENGINE |
| [mystery-box-v2.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-v2.js) | 20.8 KB | 223 | #48 (`v=5`) | `MysteryBoxArt` | Mystery box opening, version 2 (9 Nov 2026). Replaces the drawn chest and the "energy surge" texts. |
| [no-monsters.js](file:///C:/Users/maysa/Desktop/DV/js/no-monsters.js) | 7.6 KB | 119 | #18 (`v=2`) | `EAA_HIDE_MONSTERS`, `renderMonsterSVG`, `triggerEvolutionCeremony`, `switchView` | Monsters hidden (11 Nov 2026). |
| [pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js) | 184.2 KB | 3639 | #31 (`v=20261121b`) | `PupilAvatars` | Pupil avatars (v2) |
| [pupil-card.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-card.js) | 17.9 KB | 156 | #61 (`v=7`) | `PupilCard` | Pupil trading card, laid out like a real Yu-Gi-Oh monster card: a name banner with an attribute orb, level stars, the monster picture in a framed art box |
| [pupil-profile.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-profile.js) | 19.9 KB | 173 | #60 (`v=10`) | `PupilProfile` | Pupil profile: one dark page for the teacher (no tabs). Top: who, status + reason, quick actions. Then the numbers that matter (XP, quiz, homework, |
| [sleepy-monster.js](file:///C:/Users/maysa/Desktop/DV/js/sleepy-monster.js) | 33.7 KB | 633 | #27 (`v=4`) | `SleepyMonster`, `openSleepyMonster` | Sleepy Monster: a full-screen noise game for the class. |

### Core Platform & State (7)
| File | Size | Lines | In `index.html` | `window.*` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) | 126 KB | 1123 | #26 (`v=62`) | `CommandCenter`, `renderCommandCenterView` | Command Center: a dense, calm teacher overview (class stats, the XP each pupil earned day by day, homework of the last two weeks from the Google Sheets, activit |
| [daily-backup.js](file:///C:/Users/maysa/Desktop/DV/js/daily-backup.js) | 11.9 KB | 171 | #63 (`v=1`) | `DailyBackup` | Daily backup of the classroom data (XP, coins, shop, attendance) on this device. |
| [daily-report.js](file:///C:/Users/maysa/Desktop/DV/js/daily-report.js) | 4.2 KB | 38 | #59 (`v=1`) | `DailyReport` | Daily report page. The 18:00 school-day check (a scheduled task that reads the school's k12 site and the platform in the teacher's own Chrome) writes its summar |
| [platform-nav.js](file:///C:/Users/maysa/Desktop/DV/js/platform-nav.js) | 43.1 KB | 465 | #62 (`v=20261121c`) | `EAAShortTitle`, `PlatformNav`, `PlatformViews` | Platform layout (9 Nov 2026): six places instead of a long menu. |
| [school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) | 1048.2 KB | 17227 | #64 (`v=20261121c`) | `showNotification`, `updateClassroomTheme`, `prevTextbookPage`, `nextTextbookPage` | ENGLISH ADVENTURE ACADEMY — MASTER APPLICATION CONTROLLER & ROUTER |
| [school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js) | 762.3 KB | 17601 | #10 (`v=20261119sp1`) | `renderStudentRoster`, `renderCurrentView`, `safeBackgroundSupabaseSync`, `AdventureAcademy` | ENGLISH ADVENTURE ACADEMY — RELATIONAL PERSISTENT SCHOOL DATA ENGINE |
| [ui.js](file:///C:/Users/maysa/Desktop/DV/js/ui.js) | 125.4 KB | 2815 | Standalone | `uiController` | UI Controller for "Who Stole the Treasure?" & "Detective Preparation" |

### Cloud, Auth & Privacy (6)
| File | Size | Lines | In `index.html` | `window.*` Exports | Summary |
| :--- | :---: | :---: | :---: | :--- | :--- |
| [offline.js](file:///C:/Users/maysa/Desktop/DV/js/offline.js) | 2.7 KB | 62 | #2 (`v=2`) | `EAAOffline` | Turns on the offline safety net (sw.js) and shows a small note when the internet is down. |
| [private-data.js](file:///C:/Users/maysa/Desktop/DV/js/private-data.js) | 122.8 KB | 69 | #38 (`v=2`) | `EAAPrivate` | PRIVATE DATA BUNDLE (encrypted). |
| [school-cloud-sync.js](file:///C:/Users/maysa/Desktop/DV/js/school-cloud-sync.js) | 12.6 KB | 295 | #7 (`v=3.1`) | `addEventListener`, `SchoolCloudSync` | ENGLISH ADVENTURE ACADEMY — UNIFIED CLOUD PERSISTENCE & CROSS-DEVICE SYNC SERVICE (v2.0) |
| [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) | 83.8 KB | 1865 | #5 (`v=4.6`) | `createClient`, `supabaseClient`, `pushStudentXPBatch`, `markXpIntent` | ENGLISH ADVENTURE ACADEMY — SUPABASE POSTGRESQL DATABASE CLIENT (v2.0) |
| [supabase-config.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-config.js) | 1.1 KB | 28 | #4 (`v=2.5`) | `SUPABASE_CONFIG` | ENGLISH ADVENTURE ACADEMY — PRODUCTION SUPABASE CONFIGURATION |
| [teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js) | 76.2 KB | 1660 | #6 (`v=2.2`) | `lockPlatformSession`, `openSecurityCenterModal`, `openSmartboardCodeModal`, `TeacherAuth` | ENGLISH ADVENTURE ACADEMY — UNIFIED TEACHER VERIFICATION & SECURITY ENGINE (v2.1) |


---

## 3. Deep Chapter & Function Landmarks Inside Large Monoliths (900+ Lines)

### 📦 [js/school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js) — 17601 lines (762.3 KB)

#### Section Banners (32)
| Lines | Section Title |
| :---: | :--- |
| [L958–L961](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L958-L961) | GLOBAL READINGS 2 — LEVEL 2 STUDENT'S BOOK (MACMILLAN EDUCATION) |
| [L962–L1571](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L962-L1571) | const GLOBAL_READINGS_2_PAGES = [ |
| [L1572–L1575](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L1572-L1575) | GLOBAL READINGS 3 — LEVEL 3 STUDENT'S BOOK (MACMILLAN EDUCATION) |
| [L1576–L2153](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L1576-L2153) | const GLOBAL_READINGS_3_PAGES = [ |
| [L2154–L2239](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2154-L2239) | MONSTER EVOLUTION SYSTEM — STANDARDIZED EVOLUTION & THRESHOLDS (7 STAGES) |
| [L2240–L2245](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2240-L2245) | 4 DISTINCT SPECIES ARCHETYPES (SINGLE SOURCE OF TRUTH) |
| [L2246–L2491](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2246-L2491) | const ELEMENTAL_AVATARS = { |
| [L2492–L2495](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2492-L2495) | TERM 2 RESET CANCELLED — ARCHIVED XP RESTORATION (IDEMPOTENT, SAFE TO RE-RUN) |
| [L2496–L3072](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2496-L3072) | const LEGACY_MIGRATION_KEYS = [ |
| [L3073–L10421](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L3073-L10421) | 📘 Alice in Wonderland: Discrete Homework XP Tasks |
| [L10422–L11391](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L10422-L11391) | CORE STORE ENGINE CLASS |
| [L11392–L11550](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11392-L11550) | 2. STUDENTS & ENROLLMENT (18 METHODS) |
| [L11551–L12312](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11551-L12312) | TRANSACTION-BASED XP ARCHITECTURE & AUDIT LEDGER |
| [L12313–L12559](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12313-L12559) | 2. CLASS CRUD & ATTENDANCE CALCULATIONS |
| [L12560–L12814](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12560-L12814) | 3. CURRICULUM HIERARCHY CRUD |
| [L12815–L13132](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12815-L13132) | 4. RESOURCE / GAME CRUD |
| [L13133–L13354](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L13133-L13354) | 5. ASSIGNMENTS & HOMEWORK CRUD |
| [L13355–L14185](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L13355-L14185) | 6. QUIZZES & ASSESSMENTS CRUD |
| [L14186–L14268](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L14186-L14268) | getClassStory(classId = null, includeArchived = false) { |
| [L14269–L15144](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L14269-L15144) | 8. UNIVERSAL ACTIVITY COMPLETION HOOK |
| [L15145–L15201](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15145-L15201) | CALENDAR EVENTS CRUD |
| [L15202–L15379](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15202-L15379) | UNIVERSAL RESTORE & ARCHIVE AUDIT ENGINE |
| [L15380–L15417](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15380-L15417) | STUDENT MOVEMENTS & ENROLLMENT |
| [L15418–L15533](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15418-L15533) | ENHANCED ENTITY EDITS (Assessments, Portfolios, Books, Objectives, Groups) |
| [L15534–L15616](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15534-L15616) | XP SKILLS MANAGEMENT (ClassDojo-style Positive & Needs Work Skills) |
| [L15617–L15711](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15617-L15711) | CLASSROOM REWARDS & REDEMPTION SYSTEM |
| [L15712–L15788](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15712-L15788) | BIG IDEAS CLASSROOM BOARD (ClassDojo-style Brainstorming & Projects) |
| [L15789–L15817](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15789-L15817) | ORIGINAL ADVENTURE AVATAR SYSTEM (6 Categories) |
| [L15818–L15918](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15818-L15918) | GROUP TOTAL XP & MONTHLY TEAM RACE XP |
| [L15919–L15975](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15919-L15975) | STUDENT AWARDS (SEPARATE FROM BADGE DEFINITIONS) |
| [L15976–L17253](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L15976-L17253) | PROGRESS CHECK ENGINE CRUD & PERSISTENCE METHODS |
| [L17254–L17601](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L17254-L17601) | MYSTERY BOXES, STUDENT INVENTORY & TRADING ENGINE |


#### Key Functions & Methods (showing 60 of 332)
| Line | Function / Method |
| :---: | :--- |
| [L2182](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2182) | `getStudentStage` |
| [L2232](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2232) | `getStageFromXP` |
| [L2276](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2276) | `getStudentMascot` |
| [L2298](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2298) | `getStudentSpeciesData` |
| [L2308](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2308) | `getStudentArchetype` |
| [L2321](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2321) | `resolveLedgerType` |
| [L2336](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2336) | `mergeDuplicateStudents` |
| [L2350](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2350) | `evaluateMonsterStage` |
| [L2383](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2383) | `updateStudentEvolution` |
| [L2387](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2387) | `syncAllStudentLevels` |
| [L2411](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2411) | `recalculateAllStudents` |
| [L2504](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2504) | `restoreStudentArchivedXP` |
| [L2521](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2521) | `restoreArchivedXP` |
| [L2550](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2550) | `archiveAndResetXP` |
| [L2561](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L2561) | `promptDirectXPEdit` |
| [L7334](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L7334) | `getInitialState` |
| [L10426](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L10426) | `store.constructor()` |
| [L10463](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L10463) | `store.syncAllStudentLevels()` |
| [L10490](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L10490) | `store.loadState()` |
| [L11257](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11257) | `store.saveState()` |
| [L11313](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11313) | `store.getStorageKey()` |
| [L11317](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11317) | `store.resetToDefaults()` |
| [L11323](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11323) | `store.resetAllStudentProgress()` |
| [L11354](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11354) | `store.subscribe()` |
| [L11361](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11361) | `store.notify()` |
| [L11369](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11369) | `store.setRole()` |
| [L11374](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11374) | `store.getActiveClass()` |
| [L11378](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11378) | `store.setActiveClass()` |
| [L11383](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11383) | `store.getActiveStudent()` |
| [L11387](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11387) | `store.setActiveStudent()` |
| [L11395](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11395) | `store.getStudents()` |
| [L11413](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11413) | `store.getStudentsByClass()` |
| [L11417](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11417) | `store.getStudent()` |
| [L11429](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11429) | `store.addStudent()` |
| [L11471](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11471) | `store.updateStudent()` |
| [L11491](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11491) | `store.archiveStudent()` |
| [L11511](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11511) | `store.removeStudentFromClass()` |
| [L11531](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11531) | `store.deleteStudent()` |
| [L11554](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11554) | `store.getStudentTotalXP()` |
| [L11561](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11561) | `store.getStudentLifetimeXP()` |
| [L11570](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11570) | `store.getXPTransactions()` |
| [L11580](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11580) | `store.getStudentXPTransactions()` |
| [L11584](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11584) | `store.getStudentXPHistory()` |
| [L11599](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11599) | `store.getAllXPTransactions()` |
| [L11607](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11607) | `store.giveXP()` |
| [L11808](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11808) | `store.getStudentById()` |
| [L11812](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11812) | `store.awardXP()` |
| [L11828](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11828) | `store.awardStudentXP()` |
| [L11836](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11836) | `store.setStudentXP()` |
| [L11916](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11916) | `store.giveBatchFeedback()` |
| [L11970](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11970) | `store.getStudentClassroomSkillsTally()` |
| [L11994](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L11994) | `store.adjustStudentXP()` |
| [L12032](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12032) | `store.voidXPTransaction()` |
| [L12065](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12065) | `store.restoreXPTransaction()` |
| [L12099](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12099) | `store.pushXPChange()` |
| [L12107](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12107) | `store.updateXPTransaction()` |
| [L12122](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12122) | `store.getXPReport()` |
| [L12178](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12178) | `store.getStudentSkills()` |
| [L12222](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12222) | `store.setManualSkillCefr()` |
| [L12234](file:///C:/Users/maysa/Desktop/DV/js/school-store.js#L12234) | `store.getTeacherNotes()` |

---

### 📦 [js/school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) — 17227 lines (1048.2 KB)

#### Section Banners (52)
| Lines | Section Title |
| :---: | :--- |
| [L117–L391](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L117-L391) | 1. INITIALIZATION & GLOBAL EVENT LISTENERS |
| [L392–L936](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L392-L936) | SUPABASE CLOUD DATABASE CONFIGURATION & MANAGEMENT MODAL CONTROLLER |
| [L937–L1130](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L937-L1130) | GLOBAL GAME LAUNCHER ROUTING |
| [L1131–L1211](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1131-L1211) | 4 ELEMENTAL SPECIES ARCHETYPES (LOCAL 3D RASTER MASCOTS) |
| [L1212–L1555](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1212-L1555) | CANONICAL STUDENT MONSTER AVATAR & STAGE RENDERER (3D RASTER MASCOTS) |
| [L1556–L1691](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1556-L1691) | 2. MODAL & CONFIRMATION CONTROLLERS |
| [L1692–L2709](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1692-L2709) | 3. ENTITY CRUD HANDLERS (STUDENTS, CLASSES, GAMES, CURRICULUM, ETC.) |
| [L2710–L3396](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L2710-L3396) | 4. STUDENT PROFILE MANAGEMENT CENTER (8 SUB-TABS) |
| [L3397–L3788](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L3397-L3788) | 5. VIEW CONTROLLERS (STUDENTS, CLASSES, CURRICULUM, LIBRARY, ETC.) |
| [L3789–L4686](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L3789-L4686) | CLASSROOM HUB (Heart of the Class: Visual Avatars, Groups, Points, Toolkit) |
| [L4687–L5174](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L4687-L5174) | CURRICULUM MANAGEMENT (Reordering, Units, Lessons, Objectives) |
| [L5175–L6389](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L5175-L6389) | let libraryActiveCatalogTab = 'games'; // 'games' · 'worksheets' |
| [L6390–L6579](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L6390-L6579) | DETAILED PEDAGOGICAL RESOURCE PREVIEW MODAL |
| [L6580–L6748](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L6580-L6748) | PRINTABLE WORKSHEETS HUB & REAL LIBRARY |
| [L6749–L6931](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L6749-L6931) | /* ---- Weekly Assignments & Homework: one place, grouped by week, with every pupil's status ---- */ |
| [L6932–L7163](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L6932-L7163) | HOMEWORK & QUESTS VIEW (Full CRUD, Student Quest & Centralized XP System) |
| [L7164–L7414](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L7164-L7414) | 2-COLUMN CREATE / EDIT HOMEWORK MODAL & LIVE PREVIEW |
| [L7415–L7638](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L7415-L7638) | 3. STUDENT QUEST VIEW & SUBMISSION CONTROLLER |
| [L7639–L7790](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L7639-L7790) | 4. QUEST COMPLETED CELEBRATION MODAL |
| [L7791–L8011](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L7791-L8011) | ALICE IN WONDERLAND XP QUEST SINGLE-STUDENT GRADER CONTROLLER |
| [L8012–L8228](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L8012-L8228) | QUIZZES & QUESTION BUILDER VIEW (Complete CRUD) |
| [L8229–L8335](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L8229-L8335) | ASSESSMENTS & RUBRICS VIEW (Complete CRUD) |
| [L8336–L8405](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L8336-L8405) | DYNAMIC REPORTS GENERATOR VIEW (Complete CRUD) |
| [L8406–L9953](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L8406-L9953) | GAMIFICATION SETTINGS VIEW (Badges, Levels, Items & XP Skills CRUD) |
| [L9954–L10114](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L9954-L10114) | SIDEBAR NAVIGATION (With Admin & Settings) |
| [L10115–L10926](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10115-L10926) | function renderCurrentView() { |
| [L10927–L10982](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10927-L10982) | CURRICULUM REORDERING & CRUD HANDLERS |
| [L10983–L11114](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10983-L11114) | WORKSHEET CRUD HANDLERS |
| [L11115–L11272](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11115-L11272) | QUIZ QUESTIONS MANAGER HANDLERS |
| [L11273–L11366](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11273-L11366) | RUBRICS & CRITERIA HANDLERS |
| [L11367–L11496](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11367-L11496) | GAMIFICATION & BADGES HANDLERS |
| [L11497–L11634](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11497-L11634) | DYNAMIC REPORT GENERATOR HANDLERS |
| [L11635–L11638](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11635-L11638) | SCHOOL SETTINGS MODAL HANDLERS |
| [L11639–L11751](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11639-L11751) | DEDICATED ARCHIVED & RESTORE FULL PAGE VIEW |
| [L11752–L11954](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11752-L11954) | DEDICATED SCHOOL SETTINGS FULL PAGE VIEW |
| [L11955–L11978](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11955-L11978) | GLOBAL ACTION ALIASES FOR COMPLETE ACCESSIBILITY |
| [L11979–L12194](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L11979-L12194) | MISSING & UPGRADED CRUD HANDLERS (Assignments, Homework, Quizzes, Badges) |
| [L12195–L12276](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12195-L12276) | CALENDAR EVENT HANDLERS |
| [L12277–L12355](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12277-L12355) | PORTFOLIO ARTIFACT HANDLERS |
| [L12356–L12413](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12356-L12413) | UNIVERSAL ARCHIVED & RESTORE HANDLERS |
| [L12414–L12443](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12414-L12443) | MOVE STUDENT HANDLERS |
| [L12444–L12456](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12444-L12456) | REAL AVATAR CUSTOMIZER HANDLER |
| [L12457–L12480](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12457-L12480) | MESSAGE THREAD HANDLERS |
| [L12481–L12543](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12481-L12543) | MOBILE NAVIGATION DRAWER TOGGLE |
| [L12544–L12930](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12544-L12930) | CLASSROOM STUDENT MANAGEMENT & ADVANCED TEACHER TOOLKIT ENGINE |
| [L12931–L15677](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12931-L15677) | DEDICATED "EDIT STUDENT XP" MODAL CONTROLLER (INTERACTIVE 3D ARTIFACT) |
| [L15678–L15862](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L15678-L15862) | ORIGINAL TEXTBOOK VIEWER CONTROLLER (GLOBAL READINGS 2) |
| [L15863–L16511](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L15863-L16511) | MONSTER EVOLUTION & COMPANION SYSTEM CONTROLLERS |
| [L16512–L16563](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L16512-L16563) | FULLSCREEN MONSTER SHOWCASE CONTROLLER |
| [L16564–L16658](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L16564-L16658) | SCOPE & SEQUENCE MODAL CONTROLLER |
| [L16659–L16819](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L16659-L16819) | LESSON ATTACHMENT MODALS (Games, Worksheets, Assignments) |
| [L16820–L17227](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L16820-L17227) | CURRICULUM AI TEACHER ASSISTANT |


#### Key Functions & Methods (showing 60 of 548)
| Line | Function / Method |
| :---: | :--- |
| [L12](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L12) | `showNotification` |
| [L120](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L120) | `initApp` |
| [L235](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L235) | `window.toggleRoleDropdown` |
| [L242](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L242) | `setupRoleSwitcher` |
| [L266](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L266) | `setupHeaderControls` |
| [L299](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L299) | `setupGlobalCloudSyncUI` |
| [L304](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L304) | `updateBadge` |
| [L354](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L354) | `window.triggerGlobalCloudSync` |
| [L381](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L381) | `window.handleCloudSyncButtonClick` |
| [L395](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L395) | `window.toggleCloudKeyVisibility` |
| [L401](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L401) | `window.openCloudDatabaseModal` |
| [L459](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L459) | `window.handleTestCloudConnection` |
| [L544](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L544) | `window.handleSaveCloudConfig` |
| [L642](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L642) | `window.handleCopyQuickConnectUrl` |
| [L670](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L670) | `window.handleManualCloudSync` |
| [L766](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L766) | `window.handleClearCloudCredentials` |
| [L775](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L775) | `populateHeaderClassSelect` |
| [L785](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L785) | `studentMiniAvatarHtml` |
| [L793](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L793) | `setHeaderPicture` |
| [L806](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L806) | `updateHeaderBadges` |
| [L838](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L838) | `populateHeaderStudentSelect` |
| [L868](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L868) | `window.triggerQuickSearch` |
| [L883](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L883) | `setupGlobalShortcuts` |
| [L897](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L897) | `handleHashRouting` |
| [L940](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L940) | `window.launchGame` |
| [L1041](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1041) | `closeTransientPopups` |
| [L1052](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1052) | `window.switchView` |
| [L1085](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1085) | `window.switchCurriculumBook` |
| [L1091](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1091) | `window.toggleLibraryManageMode` |
| [L1096](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1096) | `window.switchLibraryCatalogTab` |
| [L1101](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1101) | `window.switchAssessmentsSubTab` |
| [L1106](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1106) | `window.switchLibraryTab` |
| [L1112](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1112) | `window.openClass` |
| [L1122](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1122) | `getStudentAvatarEmoji` |
| [L1163](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1163) | `getStudentMascot` |
| [L1184](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1184) | `getStudentSpeciesData` |
| [L1193](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1193) | `getStudentArchetype` |
| [L1215](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1215) | `window.renderMonsterAvatar` |
| [L1237](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1237) | `window.renderMonsterStageBadge` |
| [L1274](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1274) | `getMonsterAsset` |
| [L1316](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1316) | `window.getIllustratedMonsterUrl` |
| [L1317](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1317) | `getIllustratedMonsterUrl` |
| [L1329](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1329) | `heroMonsterHtml` |
| [L1349](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1349) | `getStudentMonsterAvatarUrl` |
| [L1355](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1355) | `getStudentMonsterAvatarUrlCore` |
| [L1414](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1414) | `window.renderStudentMonsterCard` |
| [L1515](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1515) | `window.openAvatarSelector` |
| [L1520](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1520) | `calculateStudentProgressPct` |
| [L1529](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1529) | `determineStudentStatus` |
| [L1540](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1540) | `window.switchClassTab` |
| [L1551](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1551) | `window.switchStudentProfileTab` |
| [L1559](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1559) | `window.toggleCreateDropdown` |
| [L1568](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1568) | `window.toggleCardDropdown` |
| [L1589](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1589) | `closeAllCardMenus` |
| [L1594](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1594) | `window.toggleLibraryManageMode` |
| [L1602](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1602) | `window.openModal` |
| [L1617](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1617) | `window.closeModal` |
| [L1631](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1631) | `window.closeAllModals` |
| [L1638](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1638) | `window.confirmAction` |
| [L1659](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L1659) | `window.handleExecuteConfirmedAction` |

---

### 📦 [js/games-data.js](file:///C:/Users/maysa/Desktop/DV/js/games-data.js) — 10882 lines (427.5 KB)



#### Key Functions & Methods (showing 0 of 0)
| Line | Function / Method |
| :---: | :--- |


---

### 📦 [js/monster-renderer.js](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js) — 4614 lines (272.8 KB)



#### Key Functions & Methods (showing 60 of 97)
| Line | Function / Method |
| :---: | :--- |
| [L113](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L113) | `normalizeStageKey` |
| [L130](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L130) | `getSharedDefs` |
| [L413](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L413) | `renderPedestalDais` |
| [L431](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L431) | `renderContactShadow` |
| [L460](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L460) | `renderMonsterViewport` |
| [L461](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L461) | `renderMonsterViewportBase` |
| [L561](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L561) | `wrapLayerSVG` |
| [L587](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L587) | `renderNearEvolveGlow` |
| [L607](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L607) | `renderMonsterSingleSVG` |
| [L608](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L608) | `renderMonsterSingleSVGBase` |
| [L710](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L710) | `renderMonsterImageViewport` |
| [L785](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L785) | `renderMonsterSVG` |
| [L804](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L804) | `renderMonsterLiveStage` |
| [L805](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L805) | `renderMonsterLiveStageBase` |
| [L978](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L978) | `renderBackgroundLayer` |
| [L1182](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1182) | `renderAuraLayer` |
| [L1327](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1327) | `renderEggWhole` |
| [L1354](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1354) | `renderEggCrackingShell` |
| [L1382](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1382) | `renderEggCrackingFace` |
| [L1408](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1408) | `renderEggCracking` |
| [L1413](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1413) | `renderWingsLayer` |
| [L1421](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1421) | `renderWingsLayerBase` |
| [L1516](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1516) | `renderTailLayer` |
| [L1522](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1522) | `renderSpeciesTail` |
| [L1554](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1554) | `renderTailLayerBase` |
| [L1637](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1637) | `isSatchelId` |
| [L1640](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1640) | `renderBackpackLayer` |
| [L1656](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1656) | `strapsFor` |
| [L1657](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1657) | `renderBackpackFrontStraps` |
| [L1669](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1669) | `renderSatchelFront` |
| [L1684](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1684) | `renderBackpackLayerRaw` |
| [L1752](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1752) | `speciesMotif` |
| [L1771](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1771) | `renderSpeciesPattern` |
| [L1783](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1783) | `renderSpeciesCrest` |
| [L1830](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1830) | `renderSpeciesEars` |
| [L1849](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1849) | `speciesCrestFor` |
| [L1857](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1857) | `getStageGeometry` |
| [L1863](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1863) | `getStageGeometryBase` |
| [L1896](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1896) | `creatureOf` |
| [L1900](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1900) | `withCreature` |
| [L1914](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1914) | `paletteKey` |
| [L1926](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1926) | `dragonGeometry` |
| [L1934](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1934) | `dragonHeadPath` |
| [L1943](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1943) | `dragonBodyPath` |
| [L1957](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1957) | `dragonClaws` |
| [L1968](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1968) | `renderDragonFins` |
| [L1978](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1978) | `renderDragonHorns` |
| [L1992](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L1992) | `renderDragonFeet` |
| [L2001](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2001) | `renderDragonArms` |
| [L2009](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2009) | `renderDragonTorso` |
| [L2051](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2051) | `renderDragonSnout` |
| [L2058](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2058) | `renderDragonFangs` |
| [L2066](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2066) | `renderDragonWings` |
| [L2102](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2102) | `renderDragonTail` |
| [L2133](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2133) | `renderDragonEggScales` |
| [L2141](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2141) | `renderDragonEggPeek` |
| [L2157](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2157) | `renderCreatureParts` |
| [L2179](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2179) | `isOwnPart` |
| [L2185](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2185) | `isCapeId` |
| [L2186](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js#L2186) | `renderCapeBack` |

---

### 📦 [js/island-curriculum-data.js](file:///C:/Users/maysa/Desktop/DV/js/island-curriculum-data.js) — 3813 lines (202.6 KB)

#### Section Banners (2)
| Lines | Section Title |
| :---: | :--- |
| [L63–L1912](file:///C:/Users/maysa/Desktop/DV/js/island-curriculum-data.js#L63-L1912) | GRADE 3 — GLOBAL READINGS 2 (UNITS 1, 2, 3) |
| [L1913–L3813](file:///C:/Users/maysa/Desktop/DV/js/island-curriculum-data.js#L1913-L3813) | GRADE 4 — GLOBAL READINGS 3 (UNITS 1, 2, 3) |


#### Key Functions & Methods (showing 0 of 0)
| Line | Function / Method |
| :---: | :--- |


---

### 📦 [js/pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js) — 3639 lines (184.2 KB)

#### Section Banners (3)
| Lines | Section Title |
| :---: | :--- |
| [L638–L2045](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L638-L2045) | picture cache (IndexedDB): finished avatar pictures survive a page reload ---------- |
| [L2046–L2715](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L2046-L2715) | Game Maker & 3D Stadium Avatar Bridge ---------- |
| [L2716–L3639](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L2716-L3639) | for the shop & unified studio: item facts, try-on, style and wearing ---------- |


#### Key Functions & Methods (showing 60 of 141)
| Line | Function / Method |
| :---: | :--- |
| [L211](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L211) | `auraUrl` |
| [L214](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L214) | `petById` |
| [L219](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L219) | `petImageUrl` |
| [L232](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L232) | `pickerCategories` |
| [L247](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L247) | `allItemCount` |
| [L251](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L251) | `inClassMode` |
| [L296](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L296) | `prettyName` |
| [L347](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L347) | `client` |
| [L348](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L348) | `store` |
| [L349](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L349) | `esc` |
| [L350](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L350) | `firstName` |
| [L353](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L353) | `monstersHidden` |
| [L354](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L354) | `mode` |
| [L356](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L356) | `setMode` |
| [L361](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L361) | `lockMode` |
| [L364](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L364) | `rerender` |
| [L369](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L369) | `loadImg` |
| [L378](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L378) | `seedBuiltinDefaults` |
| [L403](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L403) | `saveLocal` |
| [L414](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L414) | `nowIso` |
| [L416](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L416) | `mergeDocs` |
| [L439](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L439) | `markRemoved` |
| [L450](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L450) | `readSyncRow` |
| [L457](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L457) | `hiddenRow` |
| [L460](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L460) | `writeHeadRows` |
| [L477](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L477) | `readHeadRows` |
| [L493](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L493) | `decodeDataUrlToArrayBuffer` |
| [L505](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L505) | `getHead3d` |
| [L509](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L509) | `fromLocal3d` |
| [L530](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L530) | `preloadHeads3d` |
| [L562](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L562) | `writeSyncRow` |
| [L582](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L582) | `readJson` |
| [L593](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L593) | `writeJson` |
| [L596](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L596) | `fetchHead` |
| [L600](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L600) | `fromLocalDev` |
| [L605](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L605) | `fromCloud` |
| [L615](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L615) | `fetchEmotionHead` |
| [L633](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L633) | `fetchWear` |
| [L641](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L641) | `picCacheOpen` |
| [L654](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L654) | `headKey` |
| [L660](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L660) | `picSig` |
| [L663](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L663) | `picCacheGet` |
| [L673](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L673) | `picCachePut` |
| [L680](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L680) | `equipSignature` |
| [L683](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L683) | `load` |
| [L745](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L745) | `studentRecord` |
| [L758](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L758) | `equippedOf` |
| [L770](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L770) | `avatarEquipFromMonster` |
| [L792](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L792) | `effectiveWear` |
| [L811](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L811) | `studentOwnsItem` |
| [L849](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L849) | `pupilLevel` |
| [L859](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L859) | `itemLockInfo` |
| [L877](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L877) | `medianOf` |
| [L883](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L883) | `analyzeHead` |
| [L891](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L891) | `samplePatch` |
| [L1029](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L1029) | `getGradedBody` |
| [L1092](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L1092) | `getGradedLeg` |
| [L1126](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L1126) | `topHasHands` |
| [L1137](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L1137) | `handLayer` |
| [L1164](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js#L1164) | `getGradedTop` |

---

### 📦 [js/ui.js](file:///C:/Users/maysa/Desktop/DV/js/ui.js) — 2815 lines (125.4 KB)

#### Section Banners (7)
| Lines | Section Title |
| :---: | :--- |
| [L29–L143](file:///C:/Users/maysa/Desktop/DV/js/ui.js#L29-L143) | SCREEN TRANSITIONS & NAVIGATION |
| [L144–L281](file:///C:/Users/maysa/Desktop/DV/js/ui.js#L144-L281) | MAIN HUB SCREEN (SELECT GAME MODE) |
| [L282–L974](file:///C:/Users/maysa/Desktop/DV/js/ui.js#L282-L974) | DETECTIVE PREPARATION (WARM-UP ACTIVITIES) |
| [L975–L1059](file:///C:/Users/maysa/Desktop/DV/js/ui.js#L975-L1059) | PERSISTENT STICKY QUESTION BOARD MODAL |
| [L1060–L1812](file:///C:/Users/maysa/Desktop/DV/js/ui.js#L1060-L1812) | SECTION 2: WHO STOLE THE TREASURE (ORIGINAL INVESTIGATION GAME UNCHANGED) |
| [L1813–L2673](file:///C:/Users/maysa/Desktop/DV/js/ui.js#L1813-L2673) | INVESTIGATION BOARD & SUSPECTS |
| [L2674–L2815](file:///C:/Users/maysa/Desktop/DV/js/ui.js#L2674-L2815) | GLOBAL EVENTS & FULLSCREEN & CONFETTI |


#### Key Functions & Methods (showing 0 of 0)
| Line | Function / Method |
| :---: | :--- |


---

### 📦 [js/classroom-store.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js) — 2162 lines (167.5 KB)



#### Key Functions & Methods (showing 60 of 135)
| Line | Function / Method |
| :---: | :--- |
| [L45](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L45) | `window.boxTierInfo` |
| [L51](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L51) | `clone` |
| [L52](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L52) | `esc` |
| [L53](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L53) | `uid` |
| [L54](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L54) | `notify` |
| [L55](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L55) | `rerender` |
| [L58](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L58) | `data` |
| [L112](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L112) | `flushSave` |
| [L113](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L113) | `save` |
| [L116](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L116) | `wallet` |
| [L125](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L125) | `balance` |
| [L126](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L126) | `log` |
| [L131](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L131) | `grant` |
| [L142](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L142) | `spend` |
| [L147](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L147) | `refund` |
| [L154](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L154) | `allItems` |
| [L155](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L155) | `findItem` |
| [L156](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L156) | `levelOf` |
| [L157](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L157) | `reqLevel` |
| [L159](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L159) | `isLevelReward` |
| [L160](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L160) | `shopLevel` |
| [L161](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L161) | `isOwned` |
| [L167](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L167) | `isAvailable` |
| [L173](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L173) | `itemPrice` |
| [L178](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L178) | `inSeason` |
| [L184](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L184) | `canSell` |
| [L193](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L193) | `isOff` |
| [L194](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L194) | `shopItems` |
| [L200](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L200) | `buyItem` |
| [L226](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L226) | `buyBox` |
| [L241](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L241) | `weekStart` |
| [L242](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L242) | `usedThisWeek` |
| [L246](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L246) | `privilege` |
| [L247](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L247) | `requestPrivilege` |
| [L259](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L259) | `decide` |
| [L269](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L269) | `undoPurchase` |
| [L309](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L309) | `CCo` |
| [L310](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L310) | `cosEntry` |
| [L317](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L317) | `ownedMonsterIds` |
| [L324](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L324) | `setTitleFor` |
| [L329](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L329) | `setTitleItems` |
| [L333](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L333) | `findExtra` |
| [L338](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L338) | `extraOwned` |
| [L342](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L342) | `extraPrice` |
| [L343](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L343) | `touchCos` |
| [L344](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L344) | `buyExtra` |
| [L360](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L360) | `giveExtra` |
| [L368](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L368) | `equipExtra` |
| [L378](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L378) | `equippedExtras` |
| [L390](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L390) | `monstersHidden` |
| [L391](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L391) | `avOwnedList` |
| [L392](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L392) | `avOwns` |
| [L393](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L393) | `avItems` |
| [L398](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L398) | `avState` |
| [L406](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L406) | `avPrice` |
| [L407](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L407) | `buyAvatar` |
| [L421](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L421) | `rewardAvatar` |
| [L432](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L432) | `classOfStudent` |
| [L433](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L433) | `fundFor` |
| [L434](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js#L434) | `setFund` |

---

### 📦 [js/supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) — 1865 lines (83.8 KB)

#### Section Banners (9)
| Lines | Section Title |
| :---: | :--- |
| [L318–L455](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L318-L455) | 1. STUDENTS CRUD (Full student roster & attributes in PostgreSQL) |
| [L456–L514](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L456-L514) | 2. TEACHER NOTES TABLE (PostgreSQL) |
| [L515–L594](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L515-L594) | 3. ASSESSMENT RESULTS TABLE (PostgreSQL) |
| [L595–L673](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L595-L673) | 4. XP AUDIT LEDGER (PostgreSQL) |
| [L674–L694](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L674-L694) | 5. ATTENDANCE (PostgreSQL) |
| [L695–L751](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L695-L751) | 5B. CLASSES COHORT TABLE (PostgreSQL) |
| [L752–L1027](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L752-L1027) | 6. EDUCATIONAL RESOURCES & LIBRARY (PostgreSQL / Supabase) |
| [L1028–L1069](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1028-L1069) | 7. REALTIME MULTI-DEVICE SUBSCRIPTIONS |
| [L1070–L1865](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1070-L1865) | 7. TWO-WAY STORE SYNCHRONIZATION (Authoritative Supabase -> Store) |


#### Key Functions & Methods (showing 10 of 10)
| Line | Function / Method |
| :---: | :--- |
| [L1390](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1390) | `toSupabaseRecord` |
| [L1438](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1438) | `fromSupabaseRecord` |
| [L1494](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1494) | `syncWithSupabaseCloud` |
| [L1566](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1566) | `forcePushToSupabase` |
| [L1636](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1636) | `safeSyncStudentToSupabase` |
| [L1681](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1681) | `safeBackgroundSupabaseSync` |
| [L1727](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1727) | `pushStudentXPBatch` |
| [L1771](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1771) | `markXpIntent` |
| [L1822](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1822) | `forcePushTerm2ResetToCloud` |
| [L1833](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js#L1833) | `syncSingleStudentXP` |

---

### 📦 [js/avatar-3d-engine.js](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js) — 1839 lines (78.2 KB)



#### Key Functions & Methods (showing 16 of 16)
| Line | Function / Method |
| :---: | :--- |
| [L17](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L17) | `getTHREE` |
| [L21](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L21) | `clamp` |
| [L25](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L25) | `smoothstep` |
| [L35](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L35) | `ensureStandaloneFloatPosition` |
| [L69](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L69) | `fetchGlbBuffer` |
| [L80](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L80) | `parseGlbBuffer` |
| [L89](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L89) | `loadCachedGlb` |
| [L93](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L93) | `normalizeModelToHeight` |
| [L115](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L115) | `normalizeItemToSize` |
| [L137](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L137) | `paintKidGeometryColors` |
| [L258](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L258) | `applyItemFallbackMaterial` |
| [L282](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L282) | `autoRigHumanoidScene` |
| [L568](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L568) | `quatArray` |
| [L582](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L582) | `createBuiltinClips` |
| [L689](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L689) | `exportObjString` |
| [L719](file:///C:/Users/maysa/Desktop/DV/js/avatar-3d-engine.js#L719) | `findBone` |

---

### 📦 [js/expedition-ui.js](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js) — 1731 lines (74.1 KB)

#### Section Banners (12)
| Lines | Section Title |
| :---: | :--- |
| [L28–L143](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L28-L143) | SECTION 0: EXPEDITION TRAINING RENDERERS |
| [L144–L221](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L144-L221) | MINI-GAME 1: LOOK & FIND |
| [L222–L303](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L222-L303) | MINI-GAME 2: MATCH THE WORD |
| [L304–L385](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L304-L385) | MINI-GAME 3: WHAT AM I? (SHORT RIDDLES) |
| [L386–L496](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L386-L496) | MINI-GAME 4: 8-SECOND VISUAL MEMORY |
| [L497–L600](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L497-L600) | MINI-GAME 5: THE EXPLORER'S BACKPACK |
| [L601–L682](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L601-L682) | MINI-GAME 6: WHICH ONE? |
| [L683–L765](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L683-L765) | MINI-GAME 7: USE THE WORD & PREDICT |
| [L766–L839](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L766-L839) | TRANSITION: EXPEDITION READY! |
| [L840–L1393](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L840-L1393) | MAIN STORY SCENES RENDERER (10 SEQUENTIAL SCENES) |
| [L1394–L1647](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L1394-L1647) | STORY ACTIONS & HANDLERS |
| [L1648–L1731](file:///C:/Users/maysa/Desktop/DV/js/expedition-ui.js#L1648-L1731) | EXPEDITION DEBRIEF & PODIUM |


#### Key Functions & Methods (showing 0 of 0)
| Line | Function / Method |
| :---: | :--- |


---

### 📦 [js/teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js) — 1660 lines (76.2 KB)

#### Section Banners (9)
| Lines | Section Title |
| :---: | :--- |
| [L208–L243](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L208-L243) | BRUTE-FORCE RATE LIMITER |
| [L244–L363](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L244-L363) | CRYPTOGRAPHY: SHA-256, AES-256-GCM PAIRING & PBKDF2 OFFLINE RESCUE |
| [L364–L768](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L364-L768) | CYBER-GLASS LOCK SCREEN STYLES & UI RENDERER (AGENTS.md §1.1) |
| [L769–L926](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L769-L926) | 1-TAP PHONE CODE GENERATOR (ON SIGNED-IN PHONE / LAPTOP) |
| [L927–L1146](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L927-L1146) | VERIFICATION HANDLERS (6-DIGIT PHONE CODE, EMAIL LINK, PASSWORD, OFFLINE) |
| [L1147–L1292](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1147-L1292) | UNLOCK / LOCK TRANSITIONS & HEADER STATUS |
| [L1293–L1370](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1293-L1370) | SMARTBOARD IDLE AUTO-LOCK ENGINE |
| [L1371–L1539](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1371-L1539) | SECURITY, PASSWORD & PLATFORM REFRESH MODAL |
| [L1540–L1660](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1540-L1660) | SUBPAGE GUARD & INITIAL BOOTSTRAP |


#### Key Functions & Methods (showing 60 of 62)
| Line | Function / Method |
| :---: | :--- |
| [L68](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L68) | `esc` |
| [L74](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L74) | `bytesToB64` |
| [L80](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L80) | `b64ToBytes` |
| [L86](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L86) | `bytesToHex` |
| [L90](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L90) | `required` |
| [L95](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L95) | `getClient` |
| [L101](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L101) | `isTrustedDevice` |
| [L105](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L105) | `setTrustedDevice` |
| [L122](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L122) | `scrubLocalSupabaseTokens` |
| [L133](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L133) | `scrubSessionSupabaseTokens` |
| [L144](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L144) | `signedIn` |
| [L145](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L145) | `isUnlocked` |
| [L147](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L147) | `canSyncCloud` |
| [L153](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L153) | `safeNext` |
| [L163](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L163) | `maskEmail` |
| [L175](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L175) | `getSavedEmail` |
| [L179](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L179) | `saveEmailHint` |
| [L183](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L183) | `isNetworkError` |
| [L188](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L188) | `checkInternetTrulyDown` |
| [L211](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L211) | `getLimiter` |
| [L219](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L219) | `saveLimiter` |
| [L223](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L223) | `clearLimiter` |
| [L227](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L227) | `getCooldownRemainingSec` |
| [L234](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L234) | `recordFailedAttempt` |
| [L247](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L247) | `sha256Hex` |
| [L253](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L253) | `derivePairingAesKey` |
| [L265](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L265) | `encryptPairingPayload` |
| [L282](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L282) | `decryptPairingPayload` |
| [L288](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L288) | `deriveHashHex` |
| [L300](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L300) | `verifyOfflinePassphrase` |
| [L317](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L317) | `saveCustomOfflinePassphrase` |
| [L333](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L333) | `generateRandomRescuePhrase` |
| [L351](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L351) | `shuffleKeypadDigits` |
| [L367](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L367) | `injectAuthStyles` |
| [L425](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L425) | `renderLockUI` |
| [L594](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L594) | `bindLockEvents` |
| [L721](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L721) | `focusActiveInput` |
| [L772](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L772) | `closePhoneCodeModal` |
| [L779](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L779) | `openPhoneCodeModal` |
| [L827](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L827) | `issueNewCodeIntoModal` |
| [L930](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L930) | `handleVerifyPhoneCode` |
| [L1008](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1008) | `handleSendEmailLink` |
| [L1061](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1061) | `handlePasswordSignIn` |
| [L1113](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1113) | `handleOfflineUnlock` |
| [L1150](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1150) | `completeOnlineUnlock` |
| [L1168](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1168) | `finishUnlockTransition` |
| [L1210](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1210) | `updateSyncIndicatorForMode` |
| [L1232](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1232) | `lockPlatform` |
| [L1279](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1279) | `signOutDevice` |
| [L1296](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1296) | `getIdleMinutes` |
| [L1304](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1304) | `setIdleMinutes` |
| [L1310](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1310) | `touchActivity` |
| [L1315](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1315) | `showIdleWarning` |
| [L1329](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1329) | `hideIdleWarning` |
| [L1335](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1335) | `startIdleMonitor` |
| [L1374](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1374) | `openSecurityModal` |
| [L1462](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1462) | `flashSecMsg` |
| [L1535](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1535) | `closeSecurityModal` |
| [L1543](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1543) | `getRelativePageFromRoot` |
| [L1551](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js#L1551) | `redirectToMainGate` |

---

### 📦 [js/progress-check.js](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js) — 1583 lines (107.1 KB)

#### Section Banners (14)
| Lines | Section Title |
| :---: | :--- |
| [L33–L140](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L33-L140) | VIEW MODE ROUTER |
| [L141–L190](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L141-L190) | 1. MAIN PROGRESS CHECK VIEW |
| [L191–L322](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L191-L322) | 2. HOME VIEW (THE OVERVIEW & ACTION CARDS) |
| [L323–L679](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L323-L679) | 3. ENTER RESULTS VIEW (AUTHENTIC FOUR-SKILL GRADEBOOK TABLE) |
| [L680–L784](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L680-L784) | 4. VIEW CLASS RESULTS VIEW (CLEAN READ-ONLY SUMMARY) |
| [L785–L930](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L785-L930) | 5. INTERACTIVE SPEAKING RUBRIC MODAL / DRAWER |
| [L931–L1036](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L931-L1036) | 6. PRINTABLE PROGRESS CHECK (STUDENT WORKSHEET & TEACHER SHEET) |
| [L1037–L1114](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1037-L1114) | PART A — READING COMPREHENSION (/10) |
| [L1115–L1118](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1115-L1118) | PART B — LISTENING COMPREHENSION (/10) |
| [L1119–L1210](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1119-L1210) | '<div style="margin-bottom:22px; page-break-before:auto;">' + |
| [L1211–L1246](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1211-L1246) | PART C — WRITING (/10) |
| [L1247–L1461](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1247-L1461) | PART D — SPEAKING & OBSERVATION (/10) |
| [L1462–L1492](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1462-L1492) | 7. CLEAN VECTOR SVG ILLUSTRATIONS FOR STUDENT WORKSHEETS |
| [L1493–L1583](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1493-L1583) | 8. SMARTBOARD SCREEN TEST RUNNER MODAL |


#### Key Functions & Methods (showing 23 of 23)
| Line | Function / Method |
| :---: | :--- |
| [L37](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L37) | `window.setProgressCheckViewMode` |
| [L54](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L54) | `window.triggerManualCloudSync` |
| [L75](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L75) | `window.switchProgressCheckSelection` |
| [L80](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L80) | `window.switchProgressCheckClass` |
| [L96](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L96) | `window.openProgressCheckForClass` |
| [L127](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L127) | `window.goToProgressCheckStep` |
| [L145](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L145) | `window.renderProgressCheckView` |
| [L195](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L195) | `renderHomeViewHTML` |
| [L327](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L327) | `renderEnterResultsViewHTML` |
| [L494](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L494) | `window.updateRowTotal` |
| [L530](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L530) | `window.getStudentGradebookRowData` |
| [L561](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L561) | `window.saveSingleStudentGradebookRow` |
| [L622](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L622) | `window.saveAllGradebookResults` |
| [L684](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L684) | `renderViewResultsViewHTML` |
| [L789](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L789) | `window.openSpeakingRubricModal` |
| [L882](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L882) | `window.selectRubricPoint` |
| [L916](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L916) | `window.applySpeakingRubricScore` |
| [L936](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L936) | `window.openPrintableProgressCheck` |
| [L1007](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1007) | `renderStudentWorksheetPrintableHTML` |
| [L1272](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1272) | `renderTeacherSheetPrintableHTML` |
| [L1465](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1465) | `renderVectorSVG` |
| [L1497](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1497) | `window.openClassGameModal` |
| [L1515](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js#L1515) | `renderSmartboardModalBody` |

---

### 📦 [js/app.js](file:///C:/Users/maysa/Desktop/DV/js/app.js) — 1580 lines (58.7 KB)

#### Section Banners (2)
| Lines | Section Title |
| :---: | :--- |
| [L1343–L1459](file:///C:/Users/maysa/Desktop/DV/js/app.js#L1343-L1459) | FAILSAFE LOCAL-FIRST QUICK XP HANDLER |
| [L1460–L1580](file:///C:/Users/maysa/Desktop/DV/js/app.js#L1460-L1580) | DIRECT XP EDIT DIALOG CONTROLLER |


#### Key Functions & Methods (showing 3 of 3)
| Line | Function / Method |
| :---: | :--- |
| [L1346](file:///C:/Users/maysa/Desktop/DV/js/app.js#L1346) | `window.addQuickXP` |
| [L1463](file:///C:/Users/maysa/Desktop/DV/js/app.js#L1463) | `window.openDirectXPEdit` |
| [L1548](file:///C:/Users/maysa/Desktop/DV/js/app.js#L1548) | `renderCardHeader` |

---

### 📦 [js/room-ui.js](file:///C:/Users/maysa/Desktop/DV/js/room-ui.js) — 1393 lines (58.3 KB)

#### Section Banners (5)
| Lines | Section Title |
| :---: | :--- |
| [L41–L187](file:///C:/Users/maysa/Desktop/DV/js/room-ui.js#L41-L187) | CARTOON ROOM RENDERING WITH REAL SVG OBJECTS |
| [L188–L303](file:///C:/Users/maysa/Desktop/DV/js/room-ui.js#L188-L303) | POINTER EVENTS DRAG-AND-DROP PHYSICS |
| [L304–L433](file:///C:/Users/maysa/Desktop/DV/js/room-ui.js#L304-L433) | DROP EVALUATION LOGIC |
| [L434–L581](file:///C:/Users/maysa/Desktop/DV/js/room-ui.js#L434-L581) | CONTAINER & SEARCH INTERACTIONS |
| [L582–L1393](file:///C:/Users/maysa/Desktop/DV/js/room-ui.js#L582-L1393) | LEVEL SCREEN ROUTING |


#### Key Functions & Methods (showing 0 of 0)
| Line | Function / Method |
| :---: | :--- |


---

### 📦 [js/simon-says-game.js](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js) — 1223 lines (58.1 KB)

#### Section Banners (9)
| Lines | Section Title |
| :---: | :--- |
| [L16–L90](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L16-L90) | 1. COMMAND BANK & PEDAGOGICAL CATEGORIES |
| [L91–L237](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L91-L237) | 2. PROCEDURAL SOUND ENGINE (NO BROKEN ASSETS) |
| [L238–L311](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L238-L311) | 3. PROCEDURAL CONFETTI GENERATOR |
| [L312–L572](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L312-L572) | 4. SIMON SAYS GAME CONTROLLER |
| [L573–L694](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L573-L694) | 5. TEACHER MANUAL ELIMINATION MODAL & ROSTER MANAGEMENT |
| [L695–L1024](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L695-L1024) | 6. PROJECTOR-READY HTML UI RENDERERS |
| [L1025–L1096](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L1025-L1096) | 7. ELIMINATION CONFIRMATION DIALOG (TEACHER-CONTROLLED) |
| [L1097–L1154](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L1097-L1154) | 8. SETTINGS & CONTROLS |
| [L1155–L1223](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L1155-L1223) | 9. TOOLKIT TAB VIEW & PROJECTOR MODAL LAUNCHERS |


#### Key Functions & Methods (showing 4 of 4)
| Line | Function / Method |
| :---: | :--- |
| [L1159](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L1159) | `window.renderToolkitSimonView` |
| [L1189](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L1189) | `gradeForClass` |
| [L1199](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L1199) | `window.openSimonSaysGrade` |
| [L1209](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js#L1209) | `window.openSimonSaysModal` |

---

### 📦 [js/monster-pets.js](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js) — 1201 lines (223.3 KB)



#### Key Functions & Methods (showing 8 of 8)
| Line | Function / Method |
| :---: | :--- |
| [L1063](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1063) | `byId` |
| [L1068](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1068) | `getDataUri` |
| [L1078](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1078) | `setPose` |
| [L1094](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1094) | `cyclePose` |
| [L1103](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1103) | `install` |
| [L1134](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1134) | `renderSvg` |
| [L1158](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1158) | `renderHtml` |
| [L1172](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js#L1172) | `thumbnailHtml` |

---

### 📦 [js/command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) — 1123 lines (126 KB)

#### Section Banners (1)
| Lines | Section Title |
| :---: | :--- |
| [L605–L1123](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L605-L1123) | one-page class report (print, A4 landscape) |


#### Key Functions & Methods (showing 60 of 85)
| Line | Function / Method |
| :---: | :--- |
| [L10](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L10) | `esc` |
| [L14](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L14) | `dayStart` |
| [L15](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L15) | `txOf` |
| [L30](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L30) | `dayKey` |
| [L31](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L31) | `setPaused` |
| [L37](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L37) | `analyse` |
| [L72](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L72) | `gradeOfClass` |
| [L73](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L73) | `hwList` |
| [L78](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L78) | `hwState` |
| [L94](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L94) | `recOf` |
| [L95](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L95) | `worksheetsOf` |
| [L101](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L101) | `duplicatesMap` |
| [L112](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L112) | `overdue` |
| [L117](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L117) | `diagnose` |
| [L143](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L143) | `supportAll` |
| [L144](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L144) | `supportOn` |
| [L145](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L145) | `supportGet` |
| [L146](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L146) | `supportSet` |
| [L156](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L156) | `awayAll` |
| [L157](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L157) | `awayOn` |
| [L158](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L158) | `awaySet` |
| [L161](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L161) | `ladderAll` |
| [L171](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L171) | `stageOf` |
| [L173](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L173) | `ladderGet` |
| [L174](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L174) | `ladderAdd` |
| [L178](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L178) | `skillsOf` |
| [L180](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L180) | `skLevel` |
| [L182](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L182) | `skillChips` |
| [L190](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L190) | `classSkills` |
| [L199](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L199) | `quizOf` |
| [L201](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L201) | `rediagnose` |
| [L207](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L207) | `rowsFor` |
| [L239](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L239) | `ago` |
| [L243](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L243) | `feedFor` |
| [L255](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L255) | `xpBanner` |
| [L357](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L357) | `ensureCss` |
| [L364](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L364) | `sum` |
| [L365](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L365) | `dayLabels` |
| [L370](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L370) | `xpCell` |
| [L376](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L376) | `hwCell` |
| [L380](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L380) | `tableHtml` |
| [L384](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L384) | `tot` |
| [L418](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L418) | `refreshTable` |
| [L421](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L421) | `homeworkHtml` |
| [L439](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L439) | `perDayHtml` |
| [L446](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L446) | `dataChecksHtml` |
| [L461](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L461) | `drawer` |
| [L499](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L499) | `quietBanner` |
| [L504](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L504) | `kpiHtml` |
| [L519](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L519) | `panelsHtml` |
| [L526](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L526) | `refreshAll` |
| [L531](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L531) | `loadSheet` |
| [L537](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L537) | `reportsTabHtml` |
| [L546](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L546) | `homeworkTabHtml` |
| [L554](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L554) | `toolsTabHtml` |
| [L565](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L565) | `render` |
| [L571](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L571) | `chip` |
| [L572](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L572) | `rng` |
| [L573](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L573) | `htab` |
| [L606](file:///C:/Users/maysa/Desktop/DV/js/command-center.js#L606) | `crCss` |

---

### 📦 [js/class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js) — 1056 lines (96.5 KB)



#### Key Functions & Methods (showing 42 of 42)
| Line | Function / Method |
| :---: | :--- |
| [L7](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L7) | `monMove` |
| [L11](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L11) | `esc` |
| [L18](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L18) | `goalKey` |
| [L19](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L19) | `loadGoal` |
| [L26](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L26) | `isDaily` |
| [L27](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L27) | `bonusOf` |
| [L28](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L28) | `todayKey` |
| [L29](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L29) | `isWon` |
| [L30](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L30) | `isPaid` |
| [L31](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L31) | `saveGoal` |
| [L35](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L35) | `loadAbsent` |
| [L39](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L39) | `saveAbsent` |
| [L41](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L41) | `students` |
| [L56](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L56) | `goalProgress` |
| [L166](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L166) | `discOn` |
| [L168](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L168) | `flagOf` |
| [L169](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L169) | `stages` |
| [L170](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L170) | `stageBadge` |
| [L171](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L171) | `stageStrip` |
| [L326](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L326) | `getTeamThemeMeta` |
| [L340](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L340) | `ensureCss` |
| [L345](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L345) | `fmt` |
| [L346](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L346) | `paintClock` |
| [L352](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L352) | `stopTimer` |
| [L353](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L353) | `tick` |
| [L363](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L363) | `paintGoal` |
| [L380](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L380) | `confettiBurst` |
| [L386](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L386) | `payBonus` |
| [L397](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L397) | `celebrate` |
| [L420](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L420) | `resetBar` |
| [L425](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L425) | `goalEditor` |
| [L429](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L429) | `opt` |
| [L438](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L438) | `pick` |
| [L453](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L453) | `todayChips` |
| [L472](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L472) | `closeMenus` |
| [L475](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L475) | `hatFor` |
| [L480](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L480) | `paintHat` |
| [L489](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L489) | `renderTeamsView` |
| [L573](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L573) | `render` |
| [L632](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L632) | `paintTeamScores` |
| [L648](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L648) | `totals` |
| [L655](file:///C:/Users/maysa/Desktop/DV/js/class-board.js#L655) | `pupilSound` |

---

### 📦 [js/mystery-box-modal.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js) — 967 lines (44.5 KB)

#### Section Banners (6)
| Lines | Section Title |
| :---: | :--- |
| [L19–L146](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L19-L146) | RARITY DESIGN SYSTEM & SOUND SYNTHESIS |
| [L147–L225](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L147-L225) | CANVAS 2D CONFETTI & STAR BURST ENGINE |
| [L226–L347](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L226-L347) | 3D ISOMETRIC CHEST SVG RENDERER |
| [L348–L629](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L348-L629) | UNBOXING MODAL CONTROLLER (4-STEP CINEMATIC FLOW) |
| [L630–L945](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L630-L945) | INTERACTIVE GIFTING & TRADING CABINET CONTROLLER |
| [L946–L967](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L946-L967) | EXPORT SINGLETONS & GLOBAL BINDINGS |


#### Key Functions & Methods (showing 6 of 6)
| Line | Function / Method |
| :---: | :--- |
| [L54](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L54) | `playUnboxingAudioSequence` |
| [L150](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L150) | `launchConfettiBurst` |
| [L179](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L179) | `render` |
| [L229](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L229) | `render3DChestSVG` |
| [L958](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L958) | `window.openMysteryBoxModal` |
| [L961](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js#L961) | `window.openTradingCabinet` |

---

### 📦 [js/data.js](file:///C:/Users/maysa/Desktop/DV/js/data.js) — 965 lines (36.4 KB)

#### Section Banners (2)
| Lines | Section Title |
| :---: | :--- |
| [L9–L250](file:///C:/Users/maysa/Desktop/DV/js/data.js#L9-L250) | SECTION 1: 🕵️ DETECTIVE PREPARATION (WARM-UP ACTIVITIES) |
| [L251–L965](file:///C:/Users/maysa/Desktop/DV/js/data.js#L251-L965) | SECTION 2: 🏴‍☠️ WHO STOLE THE TREASURE? (EXISTING HARD MODE INVESTIGATION) |


#### Key Functions & Methods (showing 0 of 0)
| Line | Function / Method |
| :---: | :--- |


