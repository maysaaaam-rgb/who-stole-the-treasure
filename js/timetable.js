/* Weekly timetable: the teacher sets it once (per class, Monday to Friday) and the dashboard and the Class Board
   show TODAY's lessons automatically, each with a launch button. Saved with the Classroom Store settings (synced to the cloud). */
(function (root) {
  'use strict';
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* Ordered by Unit (Unit 4 -> Unit 3 -> Unit 2 -> Unit 1 -> Classroom/Extras -> Games),
     and within each unit & grade in strict teaching sequence (Lesson 1 -> Lesson 2 -> ... -> Review -> Quiz/Printable/Homework). */
  var CATALOG = [
    { id: 'g3-subjects-challenge', icon: '🔬', title: 'Mystery Subject Lab: Group Challenge (Maths · Art · Science · Music)', route: 'school-subjects-challenge/index.html', g: 3, added: '2026-11-06' },
    { id: 'g3-instructions-challenge', icon: '📢', title: 'Classroom Instructions Challenge (Normal ➔ Turbo ➔ Combos ➔ Leader)', route: 'classroom-instructions-challenge/index.html', g: 3, added: '2026-11-06' },
    { id: 'g4-subjects-challenge', icon: '🔬', title: 'Mystery Subject Lab: Group Challenge (Maths · Art · Science · Music)', route: 'school-subjects-challenge/index.html', g: 4, added: '2026-11-06' },
    { id: 'g4-instructions-challenge', icon: '📢', title: 'Classroom Instructions Challenge (Normal ➔ Turbo ➔ Combos ➔ Leader)', route: 'classroom-instructions-challenge/index.html', g: 4, added: '2026-11-06' },
    // =========================================================================
    // UNIT 5 — GRADE 3 (Let's Go Back: The Time Book & Time Capsules, pp. 72–87)
    // =========================================================================
    { id: 'magic-book-g3', icon: '📖', title: "Unit 5 Magic Book · Let's Go Back (pp. 72–87): 3D Pop-Out Scenes, Words, Read-Aloud, Exercises & Answers", route: 'magic-book/index.html?grade=3', g: 3, unit: 5, kind: 'lesson', order: 1, added: '2026-11-08' },
    { id: 'talk-show-g3', icon: '🎤', title: 'Talk Show Studio · Speaking Battles (Episode 1: The Time Show · Episode 2: Time Capsule TV)', route: 'talk-show/index.html?grade=3&ep=1', g: 3, unit: 5, kind: 'lesson', order: 2, added: '2026-11-09' },
    { id: 'gm-u5-g3', icon: '🎮', title: "Unit 5 Game Maker · Let's Go Back (40 Questions: Words, Time Book, Time Capsules & Mega Mix)", route: 'game-maker/index.html?set=g3-u5-mega&game=cannon', g: 3, unit: 5, kind: 'game', order: 2, added: '2026-11-08' },

    // =========================================================================
    // UNIT 5 — GRADE 4 (Make Some Noise: Foley Sound Studio & Beethoven, pp. 72–87)
    // =========================================================================
    { id: 'magic-book-g4', icon: '📖', title: 'Unit 5 Magic Book · Make Some Noise (pp. 72–87): 3D Pop-Out Scenes, Words, Read-Aloud, Exercises & Answers', route: 'magic-book/index.html?grade=4', g: 4, unit: 5, kind: 'lesson', order: 1, added: '2026-11-08' },
    { id: 'talk-show-g4', icon: '🎤', title: 'Talk Show Studio · Speaking Battles (Episode 1: Make Some Noise · Episode 2: Concert Night)', route: 'talk-show/index.html?grade=4&ep=1', g: 4, unit: 5, kind: 'lesson', order: 2, added: '2026-11-09' },
    { id: 'gm-u5-g4', icon: '🎮', title: 'Unit 5 Game Maker · Make Some Noise (40 Questions: Words, Foley Studio, Beethoven & Mega Mix)', route: 'game-maker/index.html?set=g4-u5-mega&game=cannon', g: 4, unit: 5, kind: 'game', order: 2, added: '2026-11-08' },

    // =========================================================================
    // UNIT 4 — GRADE 3 (What Happened? / The Mona Lisa & The Angry Mountain)
    // =========================================================================
    { id: 'u4-g3-l1', icon: '🕵️', title: 'Unit 4 Lesson 1 · Case File 1: A Picture on the Wall (What Happened?)', route: 'unit4-g3-lessons/index.html?lesson=1', g: 3, unit: 4, kind: 'lesson', order: 1, added: '2026-10-19' },
    { id: 'u4-g3-l2', icon: '🖼️', title: 'Unit 4 Lesson 2 · Case File 2: Where Is She? (The Real Art Thief)', route: 'unit4-g3-lessons/index.html?lesson=2', g: 3, unit: 4, kind: 'lesson', order: 2, added: '2026-10-19' },
    { id: 'rev-g3-museum', icon: '🔍', title: 'Unit 4 Review 1 · The Mona Lisa Mystery (pp. 56–59): Look Say Act, Sneak & Painting Jigsaw', route: 'review-g3-museum/index.html', g: 3, unit: 4, kind: 'review', order: 3, added: '2026-10-19' },
    { id: 'u4-g3-l3-mountain', icon: '🌋', title: 'Unit 4 Lesson 3 · The Angry Mountain (pp. 65–69): Volcano Words, Cause & Effect, Story Theater', route: 'unit4-g3-angry-mountain/index.html', g: 3, unit: 4, kind: 'lesson', order: 4, added: '2026-10-21' },
    { id: 'u4-g3-l4-phonics', icon: '🔤', title: 'Unit 4 Lesson 4 · Phonics -nd & Think Together (pp. 70–71): 4 Feeling Corners, Letter Factory & Story Train', route: 'unit4-g3-phonics-think/index.html', g: 3, unit: 4, kind: 'lesson', order: 5, added: '2026-10-21' },
    { id: 'rev-g3-mountain', icon: '🌋', title: 'Unit 4 Review 2 · Reading 2: The Angry Mountain (pp. 64–71): Volcano Words, Sail to Safety & -nd Blends', route: 'review-g3-mountain/index.html', g: 3, unit: 4, kind: 'review', order: 6, added: '2026-10-21' },
    { id: 'rev-u4-g3', icon: '🏆', title: 'Unit 4 Full Review (Grade 3): Words, Story Order, Cause & Effect, Quiz & Speaking Check', route: 'review-unit4/index.html?grade=3', g: 3, unit: 4, kind: 'review', order: 7, added: '2026-10-22' },
    { id: 'gm-speak-g3', icon: '🎤', title: 'Units 1–4 Speaking & Acting Tournament (Grade 3): Penalty, Baseball, Tower & Arcade Show', route: 'game-maker/index.html?set=speak-g3&game=penalty', g: 3, unit: 4, kind: 'review', order: 8, added: '2026-11-01' },
    { id: 'quiz-g3-u14', icon: '📝', title: 'Units 1–4 Quiz (Grade 3, Forms A/B): Listening, Words, Reading, Writing, Key & Class Record', route: 'quiz-g3-units1-4/index.html', g: 3, unit: 4, kind: 'quiz', order: 10, added: '2026-10-25' },
    { id: 'rev-g3-1', icon: '✍️', title: 'Unit 4 Printable Revision 1 (Grade 3): Words, Star-Level Writing Sheet, Exit Tickets & Key', route: 'revision-pack/g3-revision-1.html', g: 3, unit: 4, kind: 'printable', order: 11, added: '2026-10-25' },
    { id: 'rev-g3-2', icon: '📖', title: 'Unit 4 Printable Revision 2 (Grade 3): Story, Fact Cards, Writing Page, Exit Tickets & Key', route: 'revision-pack/g3-revision-2.html', g: 3, unit: 4, kind: 'printable', order: 12, added: '2026-10-25' },

    // =========================================================================
    // UNIT 4 — GRADE 4 (Team Players & Late for the Show)
    // =========================================================================
    { id: 'u4-g4-l1', icon: '🏀', title: 'Unit 4 Lesson 1 · Team Players (We Can Do It, Match Day 1)', route: 'unit4-g4-lessons/index.html', g: 4, unit: 4, kind: 'lesson', order: 1, added: '2026-10-19' },
    { id: 'rev-g4-teamwork', icon: '🏀', title: 'Unit 4 Review 1 · Teamwork (pp. 56–61): Quiz, Word Shoot & Story Order', route: 'review-g4-teamwork/index.html', g: 4, unit: 4, kind: 'review', order: 2, added: '2026-10-19' },
    { id: 'rev-g4-show', icon: '🎭', title: 'Unit 4 Review 2 · Late for the Show (pp. 62–70): Curtain Up, Stage Run, Spotlight & Excuse Round', route: 'review-g4-show/index.html', g: 4, unit: 4, kind: 'review', order: 3, added: '2026-10-20' },
    { id: 'rev-u4-g4', icon: '🏆', title: 'Unit 4 Full Review (Grade 4): Words, Story Order, Cause & Effect, Quiz & Speaking Check', route: 'review-unit4/index.html?grade=4', g: 4, unit: 4, kind: 'review', order: 4, added: '2026-10-22' },
    { id: 'gm-speak-g4', icon: '🎤', title: 'Units 1–4 Speaking & Acting Tournament (Grade 4): Penalty, Baseball, Tower & Arcade Show', route: 'game-maker/index.html?set=speak-g4&game=baseball', g: 4, unit: 4, kind: 'review', order: 5, added: '2026-11-01' },
    { id: 'speak-g4-u4', icon: '🎤', title: 'Unit 4 Speaking Check (Units 1–4): One Pupil at a Time', route: 'speaking-g4/index.html', g: 4, unit: 4, kind: 'quiz', order: 10, added: '2026-10-23' },
    { id: 'quiz-g4-u14', icon: '📝', title: 'Units 1–4 Quiz (Forms A/B): Listening, Words, Reading & Writing', route: 'quiz-g4-units1-4/index.html', g: 4, unit: 4, kind: 'quiz', order: 11, added: '2026-10-23' },
    { id: 'rev-g4-1', icon: '✍️', title: 'Unit 4 Printable Revision 1: Words, Writing Sheet, Answer Cards & Exit Tickets', route: 'revision-pack/g4-revision-1.html', g: 4, unit: 4, kind: 'printable', order: 12, added: '2026-10-24' },
    { id: 'rev-g4a-1', icon: '📖', title: 'Unit 4 Printable Revision 1 (Grade 4A): Two Reading Texts, Writing Page, Exit Tickets & Key', route: 'revision-pack/g4a-revision-1.html', g: 4, unit: 4, kind: 'printable', order: 13, added: '2026-10-25' },

    // =========================================================================
    // UNIT 3 — GRADE 3 (It Keeps Changing & The Bear and I)
    // =========================================================================
    { id: 'g4-change1', icon: '🧊', title: 'Unit 3 Lesson 1 · It Keeps Changing', route: 'unit3-g4-lessons/index.html?lesson=1', g: 3, unit: 3, kind: 'lesson', order: 1, added: '2026-10-08' },
    { id: 'g4-bear2', icon: '🐻‍❄️', title: 'Unit 3 Lesson 2 · The Bear and I (Part 1)', route: 'unit3-g4-lessons/index.html?lesson=2', g: 3, unit: 3, kind: 'lesson', order: 2, added: '2026-10-08' },
    { id: 'g4-ice3', icon: '💥', title: 'Unit 3 Lesson 3 · The Ice Cracks', route: 'unit3-g4-lessons/index.html?lesson=3', g: 3, unit: 3, kind: 'lesson', order: 3, added: '2026-10-09' },
    { id: 'g4-poem4', icon: '🎤', title: 'Unit 3 Lesson 4 · Explore the Poem', route: 'unit3-g4-lessons/index.html?lesson=4', g: 3, unit: 3, kind: 'lesson', order: 4, added: '2026-10-09' },
    { id: 'g4-cars5', icon: '🚗', title: 'Unit 3 Lesson 5 · Clean Cars', route: 'unit3-g4-lessons/index.html?lesson=5', g: 3, unit: 3, kind: 'lesson', order: 5, added: '2026-10-09' },
    { id: 'g3-arctic', icon: '🐻‍❄️', title: 'Unit 3 Vocabulary Lab · Arctic Words (The Bear and I)', route: 'unit3-g3-arctic-words/index.html', g: 3, unit: 3, kind: 'lesson', order: 6, added: '2026-10-12' },
    { id: 'g3-wordcity', icon: '🏙️', title: 'Unit 3 Word Builder · Word City: Find, Build & Open the Gate', route: 'unit3-g3-word-city/index.html', g: 3, unit: 3, kind: 'lesson', order: 7, added: '2026-10-12' },
    { id: 'g3-daphne', icon: '🕵️', title: 'Unit 3 Week 4 · Daphne the School Detective (School Life)', route: 'week4-g3-daphne/index.html', g: 3, unit: 3, kind: 'lesson', order: 8, added: '2026-10-09' },
    { id: 'lingo-g3-u3-review', icon: '🐲', title: 'Unit 3 Review · It Keeps Changing: Monster Cast Journey Review', route: 'lingo-g3-u3-review/index.html', g: 3, unit: 3, kind: 'review', order: 9, added: '2026-10-14' },
    { id: 'u3-g3-quiz', icon: '📄', title: 'Unit 3 Paper Quiz: It Keeps Changing (Forms A & B, 100 pts)', route: 'unit3-g3-quiz/index.html', g: 3, unit: 3, kind: 'quiz', order: 10, added: '2026-10-15' },
    { id: 'u3-arctic-hw', icon: '🏔️', title: 'Unit 3 Homework: The Arctic Rescue (No-Fail Story Adventure)', route: 'unit3-arctic-homework/index.html', g: 0, unit: 3, kind: 'homework', order: 11, added: '2026-10-13' },

    // =========================================================================
    // UNIT 3 — GRADE 4 (How Much Is It? & Money)
    // =========================================================================
    { id: 'g3-money1', icon: '💰', title: 'Unit 3 Lesson 1 · How Much Is It?', route: 'unit3-g3-lessons/index.html?lesson=1', g: 4, unit: 3, kind: 'lesson', order: 1, added: '2026-10-08' },
    { id: 'g3-money2', icon: '⏳', title: 'Unit 3 Lesson 2 · Before Money Was Money', route: 'unit3-g3-lessons/index.html?lesson=2', g: 4, unit: 3, kind: 'lesson', order: 2, added: '2026-10-08' },
    { id: 'g3-money3', icon: '🚂', title: 'Unit 3 Lesson 3 · Money Changes', route: 'unit3-g3-lessons/index.html?lesson=3', g: 4, unit: 3, kind: 'lesson', order: 3, added: '2026-10-09' },
    { id: 'g3-money4', icon: '🎰', title: 'Unit 3 Lesson 4 · Design the Next Money', route: 'unit3-g3-lessons/index.html?lesson=4', g: 4, unit: 3, kind: 'lesson', order: 4, added: '2026-10-09' },
    { id: 'g4-captain', icon: '🐧', title: 'Unit 3 Week 4 · Captain Quiet’s Space Mission (Classroom Rules)', route: 'week4-g4-captain-quiet/index.html', g: 4, unit: 3, kind: 'lesson', order: 5, added: '2026-10-09' },
    { id: 'u3-money-quiz-4skills', icon: '🪙', title: 'Unit 3 4-Skills Paper Game Quiz: How Much Is It? (25 Min • 2 Pages)', route: 'unit3-money-mission/quiz-4skills.html', g: 4, unit: 3, kind: 'quiz', order: 10, added: '2026-10-14' },

    // =========================================================================
    // UNIT 2 — GRADE 3 (Chuseok Moon Feast & First Harvest)
    // =========================================================================
    { id: 'g3-moon', icon: '🌕', title: 'Unit 2 Lesson 1 · Chuseok Moon Feast', route: 'unit2-g3-lessons/index.html?lesson=1', g: 3, unit: 2, kind: 'lesson', order: 1, added: '2026-10-05' },
    { id: 'g3-harvest', icon: '🌱', title: 'Unit 2 Lesson 2 · First Harvest', route: 'unit2-g3-lessons/index.html?lesson=2', g: 3, unit: 2, kind: 'lesson', order: 2, added: '2026-10-05' },
    { id: 'g3-arcade', icon: '🎮', title: 'Unit 2 Lesson 3 · Chuseok Games Arcade Day', route: 'unit2-g3-lessons/index.html?lesson=3', g: 3, unit: 2, kind: 'lesson', order: 3, added: '2026-10-05' },
    { id: 'g3-cook1', icon: '🍡', title: 'Unit 2 Week 2 L1 · Chuseok Treats Kitchen', route: 'unit2-g3-cooking/index.html?lesson=1', g: 3, unit: 2, kind: 'lesson', order: 4, added: '2026-10-07' },
    { id: 'g3-cook2', icon: '📺', title: 'Unit 2 Week 2 L2 · Junior Chef Show', route: 'unit2-g3-cooking/index.html?lesson=2', g: 3, unit: 2, kind: 'lesson', order: 5, added: '2026-10-07' },
    { id: 'g3-show', icon: '🎬', title: 'Unit 2 Speaking Show · Cooking Show Presentations', route: 'unit2-g3-cooking/show.html', g: 3, unit: 2, kind: 'lesson', order: 6, added: '2026-10-07' },
    { id: 'watch-bean-g3', icon: '🎬', title: 'Unit 2 Video Lesson · Mr Bean: Super Trolley (Watch & Answer)', route: 'watch-answer/index.html', g: 3, unit: 2, kind: 'lesson', order: 7, added: '2026-10-07' },

    // =========================================================================
    // UNIT 2 — GRADE 4 (Forest Rangers & The Swallow's Gift)
    // =========================================================================
    { id: 'g4-forest', icon: '🌲', title: 'Unit 2 Lesson 1 · Forest Rangers', route: 'unit2-forest-lessons/index.html?lesson=1', g: 4, unit: 2, kind: 'lesson', order: 1, added: '2026-10-05' },
    { id: 'g4-swallow', icon: '🕊️', title: 'Unit 2 Lesson 2 · The Swallow’s Gift', route: 'unit2-forest-lessons/index.html?lesson=2', g: 4, unit: 2, kind: 'lesson', order: 2, added: '2026-10-05' },
    { id: 'g4-rev', icon: '🧠', title: 'Units 1 & 2 Review · Revision Quest (Grade 4)', route: 'unit12-revision-g4/index.html', g: 4, unit: 2, kind: 'review', order: 3, added: '2026-10-06' },
    { id: 'weeksong-g4', icon: '🎵', title: 'Unit 2 Song · Week Song: Learn, Move, Sing', route: 'week-song-g4/index.html', g: 4, unit: 2, kind: 'song', order: 4, added: '2026-10-07' },
    { id: 'g4-ws', icon: '📝', title: 'Units 1 & 2 Printable · Worksheet and Class Store', route: 'unit12-worksheet-g4/index.html', g: 4, unit: 2, kind: 'printable', order: 10, added: '2026-10-06' },

    // =========================================================================
    // UNIT 1 — GRADE 3 (Young Inventors) & GRADE 4 (Brain Power)
    // =========================================================================
    { id: 'u1-g3-inventor2', icon: '💡', title: 'Unit 1 Lesson 1 · The Inventor’s Odyssey: My Good Ideas Lab', route: 'good-ideas-lab/index.html', g: 3, unit: 1, kind: 'lesson', order: 1, added: '2026-09-22' },
    { id: 'u1-g3-inventor3', icon: '🔬', title: 'Unit 1 Lesson 2 · Inventor Lab: What Does It Take to Be an Inventor?', route: 'inventor-lab/index.html', g: 3, unit: 1, kind: 'lesson', order: 2, added: '2026-09-25' },
    { id: 'u1-g3-clara4', icon: '🕵️‍♀️', title: 'Unit 1 Lesson 3 · Clara’s Inventor Mystery & Challenge', route: 'clara-inventor/index.html', g: 3, unit: 1, kind: 'lesson', order: 3, added: '2026-09-28' },
    { id: 'u1-g3-forge', icon: '⚙️', title: 'Unit 1 Lesson 4 · Inventor’s Forge: Build, Test & Improve', route: 'inventor-forge/index.html', g: 3, unit: 1, kind: 'lesson', order: 4, added: '2026-09-30' },
    { id: 'u1-g4-brain2', icon: '⚡', title: 'Unit 1 Lesson 1 · The Day Your Brain Quit! — Can You Save Your Brain?', route: 'brain/index.html', g: 4, unit: 1, kind: 'lesson', order: 1, added: '2026-09-24' },
    { id: 'u1-g4-brain3', icon: '📖', title: 'Unit 1 Lesson 2 · Brain Explorers: How Your Brain Reads', route: 'brain-explorers/index.html', g: 4, unit: 1, kind: 'lesson', order: 2, added: '2026-09-27' },

    // =========================================================================
    // CLASSROOM, DRAMA & SONGS (Unit 0)
    // =========================================================================
    { id: 'class-reset', icon: '🚦', title: 'Our Class Plan (Monday Reset): 3 Rules, Traffic Light, Practice & Promise', route: 'class-reset/index.html', g: 0, unit: 0, kind: 'lesson', order: 1, added: '2026-10-24' },
    { id: 'class-promise-paper', icon: '✍️', title: 'My Class Promise: Printable Signing Sheet (2 per A4) & Poster', route: 'class-reset/promise-paper.html', g: 0, unit: 0, kind: 'printable', order: 5, added: '2026-10-24' },
    { id: 'karaoke-g3', icon: '🎤', title: 'Karaoke Stage: Read & Sing One by One (Grade 3)', route: 'karaoke-stage/index.html', g: 3, unit: 0, kind: 'song', order: 6, added: '2026-10-07' },
    { id: 'karaoke-g4', icon: '🎤', title: 'Karaoke Stage: Read & Sing One by One (Grade 4)', route: 'karaoke-stage/index.html', g: 4, unit: 0, kind: 'song', order: 7, added: '2026-10-07' },

    // =========================================================================
    // SMARTBOARD GAMES (Kept in CATALOG for Timetable lookup, filtered out of Lessons)
    // =========================================================================
    { id: 'gamemaker-g3', icon: '🎮', title: 'Game Maker (Grade 3): Tile Board, Plink-oh, Pumpkin Hunt & Class Monsters', route: 'game-maker/index.html', g: 3, unit: 0, kind: 'game', order: 1, added: '2026-10-20' },
    { id: 'gamemaker-g4', icon: '🎮', title: 'Game Maker (Grade 4): Tile Board, Plink-oh, Pumpkin Hunt & Class Monsters', route: 'game-maker/index.html', g: 4, unit: 0, kind: 'game', order: 2, added: '2026-10-20' },
    { id: 'rev-u14-g3', icon: '🔁', title: 'Units 1–4 Revision Game (Grade 3): Mixed Games in Game Maker', route: 'game-maker/index.html?set=u14-g3&game=cannon', g: 3, unit: 4, kind: 'game', order: 3, added: '2026-10-24' },
    { id: 'rev-u14-g4', icon: '🔁', title: 'Units 1–4 Revision Game (Grade 4): Smart Mix in Game Maker', route: 'game-maker/index.html?set=smart-g4&game=cannon', g: 4, unit: 4, kind: 'game', order: 4, added: '2026-10-24' },
    { id: 'u3-money-mission', icon: '🚀', title: 'Unit 3 Smartboard Game: How Much Is It? (Among Us + 2P Tug-of-War)', route: 'unit3-money-mission/index.html', g: 0, unit: 3, kind: 'game', order: 5, added: '2026-10-13' },
    { id: 'g3-board', icon: '🎲', title: 'Unit 3 Arctic Board Game (The Bear and I)', route: 'unit3-board-game/index.html?grade=3', g: 3, unit: 3, kind: 'game', order: 6, added: '2026-10-12' },
    { id: 'g4-board', icon: '🎲', title: 'Unit 3 Money Board Game (How Much Is It?)', route: 'unit3-board-game/index.html?grade=4', g: 4, unit: 3, kind: 'game', order: 7, added: '2026-10-12' },
    { id: 'u1-rev', icon: '🎯', title: 'Unit 1 Revision Game', route: 'unit1-revision/index.html', g: 0, unit: 1, kind: 'game', order: 8, added: '2026-10-04' },
    { id: 'library', icon: '📚', title: 'Lessons & Curriculum Library', view: 'library', g: 0, unit: 0, kind: 'nav', order: 99 },
    { id: 'watch-bad-guys', icon: '🦊', title: 'Movie Cinema · The Bad Guys: A Very Bad Holiday (10 Auto-Pauses, Subtitles, Retell & Circle & Say Sheet)', route: 'watch-answer/index.html?lesson=bad-guys-holiday', unit: 0, kind: 'lesson', order: 2, added: '2026-11-03' },
    { id: 'watch-spider-verse', icon: '🕷️', title: 'Movie Cinema · Spider-Man: Into the Spider-Verse (10 Auto-Pauses, Retell & Circle & Say Sheet)', route: 'watch-answer/index.html?lesson=spider-verse', unit: 0, kind: 'lesson', order: 3, added: '2026-11-03' },
    { id: 'all-about-me', icon: '🌟', title: 'All About Me: get to know your pupils (printable paper)', route: 'all-about-me/index.html', unit: 0, kind: 'printable', order: 1, added: '2026-11-01' },
  ];

  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function find(id) { return CATALOG.filter(function (c) { return c.id === id; })[0] || null; }
  function all() { try { return (root.ClassroomStore && root.ClassroomStore.getTimetable && root.ClassroomStore.getTimetable()) || {}; } catch (e) { return {}; } }
  function gradeOf(cls) { return /4/.test((cls && cls.name) || '') ? 4 : (/3/.test((cls && cls.name) || '') ? 3 : 0); }
  function sortEntries(a) { return a.slice().sort(function (x, y) { return String(x.t || '').localeCompare(String(y.t || '')); }); }

  /** Lessons for a class today (or the next school day when it is a weekend). */
  function today(clsId) {
    try { if (root.CalendarView && root.CalendarView.ensureSeeded) root.CalendarView.ensureSeeded(); } catch (e) { /* ignore */ }
    var d = new Date(), wd = d.getDay(), label = 'Today', ref = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (wd === 6) { wd = 1; label = 'Monday'; ref.setDate(ref.getDate() + 2); }
    else if (wd === 0) { wd = 1; label = 'Monday'; ref.setDate(ref.getDate() + 1); }
    var ymdKey = ref.getFullYear() + '-' + ('0' + (ref.getMonth() + 1)).slice(-2) + '-' + ('0' + ref.getDate()).slice(-2);
    var calEvs = [];
    try {
      var allCal = (root.ClassroomStore && root.ClassroomStore.getCalendar && root.ClassroomStore.getCalendar()) || [];
      calEvs = allCal.filter(function (ev) { return ev && ev.date === ymdKey && ev.classId === clsId; });
    } catch (e) { calEvs = []; }
    var calByTime = {};
    calEvs.forEach(function (ev) { if (ev.time) calByTime[ev.time] = ev; });

    var fallbackTT = (root.CalendarView && root.CalendarView.WEEK_TT && root.CalendarView.WEEK_TT[clsId]) || {};
    var tt = all()[clsId] || fallbackTT;
    var rawSlots = (tt[wd] && tt[wd].length) ? tt[wd] : (fallbackTT[wd] || []);
    var usedTimes = {};
    var list = sortEntries(rawSlots).map(function (e) {
      var c = e.l ? find(e.l) : null;
      var ev = e.t ? calByTime[e.t] : null;
      if (e.t) usedTimes[e.t] = 1;
      var evRoute = null, evIcon = null;
      if (ev && root.CalendarView && root.CalendarView.linksOf) {
        var links = root.CalendarView.linksOf(ev);
        if (links && links.length) evRoute = links[0][1];
        evIcon = ev.type === 'quiz' ? '📝' : ev.type === 'alice' ? '🫖' : (c ? c.icon : '🎤');
      }
      return {
        time: e.t || '',
        icon: evIcon || (c ? c.icon : '📖'),
        title: (ev && ev.title) ? ev.title : (c ? c.title : (e.x || 'Lesson')),
        route: evRoute || (c ? c.route : null),
        view: c ? c.view : null
      };
    });
    calEvs.forEach(function (ev) {
      if (ev.time && usedTimes[ev.time]) return;
      var links = (root.CalendarView && root.CalendarView.linksOf) ? root.CalendarView.linksOf(ev) : [];
      list.push({
        time: ev.time || '',
        icon: ev.type === 'quiz' ? '📝' : ev.type === 'alice' ? '🫖' : '🎤',
        title: ev.title || 'Lesson',
        route: (links && links.length) ? links[0][1] : null,
        view: null
      });
    });
    list.sort(function (a, b) { return String(a.time || '').localeCompare(String(b.time || '')); });
    var hasAny = Object.keys(tt).some(function (k) { return (tt[k] || []).length; }) || list.length > 0;
    return { label: label, day: DAYS[wd], list: list, set: hasAny };
  }
  function launchHtml(e) {
    var inner = '<span>' + e.icon + '</span><b>' + (e.time ? '<em>' + esc(e.time) + '</em> ' : '') + esc(e.title) + '</b><i>' + (e.route || e.view ? '▶' : '') + '</i>';
    if (e.route) return '<a class="lesson-launch" href="' + esc(e.route) + '">' + inner + '</a>';
    if (e.view) return '<a class="lesson-launch" href="#" onclick="switchView(\'' + esc(e.view) + '\'); return false;">' + inner + '</a>';
    return '<div class="lesson-launch plain">' + inner + '</div>';
  }
  /** Small HTML block with today's lessons for a class (used by the dashboard and the Class Board). */
  function todayHtml(cls) {
    var t = today(cls.id);
    if (!t.set) return '<div class="tt-empty">No timetable yet.<br><button type="button" class="tt-btn" onclick="Timetable.edit()">📅 Set my weekly timetable</button></div>';
    if (!t.list.length) return '<div class="tt-empty">No lessons for ' + esc(cls.name) + ' ' + (t.label === 'Today' ? 'today' : 'on Monday') + '.<br><button type="button" class="tt-btn" onclick="Timetable.edit()">📅 Edit timetable</button></div>';
    return '<div class="lesson-launch-list">' + t.list.map(launchHtml).join('') + '</div><button type="button" class="tt-btn small" onclick="Timetable.edit()">📅 Edit timetable</button>';
  }

  /** Ordered lessons & reviews for this class's grade (Unit 4 -> Unit 1, Lesson 1 -> Review).
      Standalone games, quizzes, printables, and homework are filtered out of the Lessons panel. */
  function lessonsHtml(cls) {
    var g = gradeOf(cls), now = Date.now();
    var list = CATALOG.filter(function (c) {
      return c.route && (c.kind === 'lesson' || c.kind === 'review') && (!c.g || !g || c.g === g);
    });
    var units = [
      { u: 5, label: '📘 Unit 5 — Current Unit (The Magic Book & Games)' },
      { u: 4, label: '📘 Unit 4 — Complete Unit Arc (Lessons & Reviews in Order)' },
      { u: 3, label: '📘 Unit 3 — Complete Unit Arc' },
      { u: 2, label: '📘 Unit 2 — Complete Unit Arc' },
      { u: 1, label: '📘 Unit 1 — Complete Unit Arc' },
      { u: 0, label: '🌟 Classroom Reset & Drama Lessons' }
    ];
    var html = units.map(function (sec) {
      var items = list.filter(function (c) { return (c.unit || 0) === sec.u; }).sort(function (a, b) {
        return (a.order || 99) - (b.order || 99);
      });
      if (!items.length) return '';
      var cards = items.map(function (c) {
        var isNew = c.added && (now - new Date(c.added).getTime() < 7 * 86400000);
        var badge = c.kind === 'review' ? '<em style="background:#f59e0b;color:#060911">REVIEW</em>' : (isNew ? '<em>NEW</em>' : '');
        return '<a class="ol-card" href="' + esc(c.route) + '"><span class="ol-ic">' + c.icon + '</span><b>' + esc(c.title) + '</b>' + badge + '<i>▶</i></a>';
      }).join('');
      return '<div class="ol-unit-group" style="margin-bottom:14px">' +
        '<div style="font-size:.78rem;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:#38bdf8;margin:6px 0 8px">' + esc(sec.label) + '</div>' +
        '<div class="our-lessons">' + cards + '</div></div>';
    }).join('');
    return html;
  }

  // ------------------------------------------------------------------ editor
  var ed = null;
  function classes() { return (S().getClasses ? S().getClasses() : []).filter(function (c) { return !c.archived; }); }
  function modal() {
    var m = document.getElementById('tt-modal');
    if (!m) { m = document.createElement('div'); m.id = 'tt-modal'; document.body.appendChild(m); }
    return m;
  }
  function paint() {
    var m = modal(), cl = classes(), cur = ed.classId, tt = ed.tt[cur] || (ed.tt[cur] = {});
    var cls = cl.filter(function (c) { return c.id === cur; })[0], g = gradeOf(cls);
    var opts = CATALOG.filter(function (c) { return !c.g || !g || c.g === g; });
    function sel(v) {
      var groups = [
        { label: '📘 Unit 5 Magic Book & Lessons', filter: function (c) { return c.unit === 5 && c.kind !== 'game'; } },
        { label: '📘 Unit 4 Lessons & Reviews', filter: function (c) { return c.unit === 4 && c.kind !== 'game'; } },
        { label: '📘 Unit 3 Lessons & Reviews', filter: function (c) { return c.unit === 3 && c.kind !== 'game'; } },
        { label: '📘 Unit 2 Lessons & Reviews', filter: function (c) { return c.unit === 2 && c.kind !== 'game'; } },
        { label: '📘 Unit 1 Lessons & Reviews', filter: function (c) { return c.unit === 1 && c.kind !== 'game'; } },
        { label: '🌟 Classroom, Drama & Songs', filter: function (c) { return (c.unit || 0) === 0 && c.kind !== 'game'; } },
        { label: '🎮 Smartboard Games', filter: function (c) { return c.kind === 'game'; } }
      ];
      return '<option value="">Other (type below)</option>' + groups.map(function (grp) {
        var items = opts.filter(grp.filter);
        if (!items.length) return '';
        return '<optgroup label="' + esc(grp.label) + '">' + items.map(function (c) {
          return '<option value="' + c.id + '"' + (v === c.id ? ' selected' : '') + '>' + c.icon + ' ' + esc(c.title) + '</option>';
        }).join('') + '</optgroup>';
      }).join('');
    }
    var cols = [1, 2, 3, 4, 5].map(function (d) {
      var rows = (tt[d] || []).map(function (e, i) {
        return '<div class="tt-row"><input type="text" class="tt-time" value="' + esc(e.t || '') + '" placeholder="08:30" onchange="Timetable.set(' + d + ',' + i + ',\'t\',this.value)">' +
          '<select onchange="Timetable.set(' + d + ',' + i + ',\'l\',this.value);Timetable.repaint()">' + sel(e.l || '') + '</select>' +
          (e.l ? '' : '<input type="text" class="tt-x" value="' + esc(e.x || '') + '" placeholder="What is the lesson?" onchange="Timetable.set(' + d + ',' + i + ',\'x\',this.value)">') +
          '<button type="button" class="tt-del" title="Remove" onclick="Timetable.del(' + d + ',' + i + ')">✕</button></div>';
      }).join('');
      return '<div class="tt-col"><div class="tt-day">' + DAYS[d] + '</div>' + rows + '<button type="button" class="tt-add" onclick="Timetable.add(' + d + ')">+ Add lesson</button></div>';
    }).join('');
    m.innerHTML = '<div class="tt-back" onclick="if(event.target===this)Timetable.close()"><div class="tt-box"><div class="tt-head"><h2>📅 My weekly timetable</h2><button type="button" class="tt-x-btn" onclick="Timetable.close()">✕</button></div>' +
      '<p class="tt-hint">Set it once. The dashboard and the Class Board then show today’s lessons for each class with a start button. Add one row per lesson.</p>' +
      '<div class="tt-tabs">' + cl.map(function (c) { return '<button type="button" class="' + (c.id === cur ? 'on' : '') + '" onclick="Timetable.tab(\'' + esc(c.id) + '\')">' + esc(c.name) + '</button>'; }).join('') + '</div>' +
      '<div class="tt-grid">' + cols + '</div>' +
      '<div class="tt-foot"><button type="button" class="tt-save" onclick="Timetable.save()">💾 Save timetable</button><button type="button" class="tt-copy" onclick="Timetable.copyTo()">Copy this class to the other classes of the same grade</button></div></div></div>';
  }
  function injectCss() {
    if (document.getElementById('tt-css')) return;
    var st = document.createElement('style'); st.id = 'tt-css';
    st.textContent = '' +
      '.tt-empty{color:#cbd5e1;font-size:.88rem;line-height:1.5;margin-top:8px}.tt-btn{font:inherit;font-weight:800;font-size:.82rem;margin-top:8px;padding:8px 14px;border-radius:12px;cursor:pointer;color:#fff;background:#2563eb;border:0;border-bottom:4px solid #1e3a8a;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}.tt-btn:active{transform:translateY(3px);border-bottom-width:1px}.tt-btn.small{background:rgba(255,255,255,.1);border-bottom-color:rgba(0,0,0,.35);margin-top:10px;font-size:.75rem}' +
      '.lesson-launch em{font-style:normal;color:#7dd3fc;font-weight:900;margin-right:4px}.lesson-launch.plain{cursor:default}' +
      '#tt-modal .tt-back{position:fixed;inset:0;z-index:100000;background:rgba(2,6,23,.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:14px}' +
      '#tt-modal .tt-box{background:#0f172a;color:#f8fafc;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:20px;max-width:1280px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
      '#tt-modal .tt-head{display:flex;justify-content:space-between;align-items:center}#tt-modal h2{margin:0;font-size:1.3rem}.tt-x-btn{background:none;border:0;color:#cbd5e1;font-size:1.3rem;cursor:pointer}.tt-hint{color:#94a3b8;font-size:.85rem;margin:6px 0 12px}' +
      '.tt-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.tt-tabs button{font:inherit;font-weight:800;padding:8px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#f8fafc;cursor:pointer}.tt-tabs button.on{background:#2563eb;border-color:#60a5fa}' +
      '.tt-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.tt-col{background:rgba(255,255,255,.05);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:8px}.tt-day{font-weight:900;color:#7dd3fc}' +
      '.tt-row{display:flex;flex-direction:column;gap:5px;background:rgba(0,0,0,.25);padding:8px;border-radius:10px;position:relative}.tt-row input,.tt-row select{font:inherit;font-size:.82rem;padding:6px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#1e293b;color:#f8fafc;width:100%}.tt-time{max-width:90px}' +
      '.tt-del{position:absolute;right:6px;top:6px;border:0;background:none;color:#fda4af;cursor:pointer;font-size:.9rem}.tt-add{font:inherit;font-weight:800;font-size:.8rem;padding:7px;border-radius:10px;border:1px dashed rgba(255,255,255,.3);background:none;color:#cbd5e1;cursor:pointer}' +
      '.tt-foot{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.tt-save{font:inherit;font-weight:900;padding:10px 20px;border-radius:12px;border:0;border-bottom:5px solid #166534;background:#16a34a;color:#fff;cursor:pointer}.tt-copy{font:inherit;font-weight:700;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:none;color:#cbd5e1;cursor:pointer}' +
      '@media(max-width:900px){.tt-grid{grid-template-columns:1fr}}';
    document.head.appendChild(st);
  }
  var api = {
    catalog: CATALOG, today: today, todayHtml: todayHtml, lessonsHtml: lessonsHtml,
    edit: function () {
      injectCss();
      var cl = classes(), act = S().getActiveClass ? S().getActiveClass() : cl[0];
      ed = { classId: (act && act.id) || (cl[0] && cl[0].id), tt: JSON.parse(JSON.stringify(all())) };
      paint();
    },
    repaint: function () { if (ed) paint(); },
    close: function () { var m = document.getElementById('tt-modal'); if (m) m.innerHTML = ''; ed = null; },
    tab: function (id) { ed.classId = id; paint(); },
    add: function (d) { var t = ed.tt[ed.classId] || (ed.tt[ed.classId] = {}); (t[d] = t[d] || []).push({ t: '', l: '' }); paint(); },
    del: function (d, i) { ed.tt[ed.classId][d].splice(i, 1); paint(); },
    set: function (d, i, f, v) { ed.tt[ed.classId][d][i][f] = v; },
    copyTo: function () {
      var cl = classes(), src = cl.filter(function (c) { return c.id === ed.classId; })[0], g = gradeOf(src), n = 0;
      cl.forEach(function (c) { if (c.id !== ed.classId && g && gradeOf(c) === g) { ed.tt[c.id] = JSON.parse(JSON.stringify(ed.tt[ed.classId] || {})); n++; } });
      root.alert ? root.alert(n ? 'Copied to ' + n + ' other class(es) of the same grade. Press Save.' : 'No other class of the same grade found.') : 0;
    },
    save: function () {
      try { root.ClassroomStore.setTimetable(ed.tt); } catch (e) { root.alert && root.alert('Could not save the timetable.'); return; }
      api.close(); if (root.showNotification) root.showNotification('Timetable saved.', 'success');
      if (root.renderCurrentView) root.renderCurrentView();
    }
  };
  api.titleOf = function (id) { var c = find(id); return c ? c.icon + ' ' + c.title : ''; };
  api.entry = function (id) { return find(id); }; // used by the Smart Board to find today's lesson words
  root.Timetable = api;
})(typeof window !== 'undefined' ? window : this);
