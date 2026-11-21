# 01 — Platform Screens, DOM, Modals & Load Order

> Back to [SITE_MAP.md](file:///C:/Users/maysa/Desktop/DV/SITE_MAP.md)

---

## 1. Standalone HTML Entry Points

| Entry Page | Size / Lines | Purpose |
| :--- | :---: | :--- |
| [index.html](file:///C:/Users/maysa/Desktop/DV/index.html) | 280 KB (4297L) | Main School Platform SPA Host (Teacher, Student, Parent, Class Mode) |
| [directory.html](file:///C:/Users/maysa/Desktop/DV/directory.html) | 32.9 KB (627L) | Students Directory & Monster Companions Grid |
| [site-map/index.html](file:///C:/Users/maysa/Desktop/DV/site-map/index.html) | 6.8 KB (149L) | Interactive Visual Site Map & Developer Explorer (Read-Only) |
| [game-maker/index.html](file:///C:/Users/maysa/Desktop/DV/game-maker/index.html) | 4.6 KB (93L) | Game Maker 2.0 Arcade Host (22 Modes + 75 Question Sets) |
| [island/index.html](file:///C:/Users/maysa/Desktop/DV/island/index.html) | 6.3 KB (109L) | Practice Island Student Home App (Chapters, Harbour, Shop) |
| [island/world.html](file:///C:/Users/maysa/Desktop/DV/island/world.html) | 9.5 KB (159L) | Practice Island 2D Walking World |
| [island/teacher.html](file:///C:/Users/maysa/Desktop/DV/island/teacher.html) | 12.2 KB (309L) | Practice Island Teacher Live Progress Wall |
| [passport/index.html](file:///C:/Users/maysa/Desktop/DV/passport/index.html) | 1.6 KB (38L) | My Passport Student Booklets & Class Gallery |
| [home-view/index.html](file:///C:/Users/maysa/Desktop/DV/home-view/index.html) | 0.4 KB (16L) | Parent & Student Home Overview Portal |
| [smart-board/index.html](file:///C:/Users/maysa/Desktop/DV/smart-board/index.html) | 11 KB (176L) | AI Classroom Smart Board |
| [magic-book/index.html](file:///C:/Users/maysa/Desktop/DV/magic-book/index.html) | 3.7 KB (93L) | The Magic Book Interactive Unit 5 Textbook Reader |
| [monster-studio/index.html](file:///C:/Users/maysa/Desktop/DV/monster-studio/index.html) | 35.1 KB (1014L) | Standalone Monster Studio Preview Host |
| [pharaoh-living-book.html](file:///C:/Users/maysa/Desktop/DV/pharaoh-living-book.html) | 116.8 KB (2680L) | The Pharaoh's Kingdom 3D Living Pop-Up Book (Grade 3 Egypt) |
| [404.html](file:///C:/Users/maysa/Desktop/DV/404.html) | 24.9 KB (419L) | GitHub Pages Deep-Link Router & Detective Navigation Hub |

---

## 2. Main Platform 7-Place Navigation ([platform-nav.js](file:///C:/Users/maysa/Desktop/DV/js/platform-nav.js#L11-L61))

| Place ID | Label | Hash Route | Primary Controller(s) | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `today` | ▶️ **Today** | `index.html#today` | `js/platform-nav.js + js/timetable.js` | Daily class schedule ribbon, active class hero card, 1-tap launch for today's lesson, Game Maker, and k12 checklist. |
| `board` | 📺 **Class Board** | `index.html#board` | `js/class-board.js + js/board-scenes.js` | Projector classroom scoreboard, pupil avatar cards, +XP awards, Groups, Picker, Karaoke, Bathroom Pass & Sleepy Mio. |
| `shop` | 🛍️ **Unified Shop & Studio** | `index.html#store-pupil` | `js/classroom-store.js + js/pupil-avatars.js` | Single-window Pupil Avatar Customizer, live try-on, wearable shop, Mystery Boxes & real classroom prizes. |
| `library` | 📖 **Library** | `index.html#library` | `js/library-shelf.js + js/school-app.js` | Curated Grade 3 & Grade 4 lessons, Game Maker 2.0 launcher, printable worksheets, and Word/PDF lesson plans. |
| `tools` | 🪄 **Board & Book** | `index.html#tools` | `js/platform-nav.js + smart-board/ + magic-book/` | 1-tap launcher for AI Smart Board, Magic Book (Grade 3/4), Timer, Random Picker, Group Maker, Karaoke & Voice FX. |
| `calendar` | 📅 **Plan (Calendar & Timetable)** | `index.html#calendar` | `js/calendar-view.js + js/timetable.js` | Weekly teaching timetable editor, monthly academic calendar, unit pacing & event planner. |
| `more` | ⚙️ **More & Teacher Hub** | `index.html#more` | `js/command-center.js + js/school-app.js` | Teacher Hub (Command Center), Store Settings, Practice Island, Lesson Archive, School Settings, Restore & Daily Backups. |

---

## 3. All `switchView()` Routes in [school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10109-L10168)

| View ID | URL Hash | Line | Render Function / Delegation |
| :--- | :--- | :---: | :--- |
| `dashboard` | `index.html#dashboard` | [L10130](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10130) | `renderTeacherDashboard` |
| `classes` | `index.html#classes` | [L10131](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10131) | `renderClassesView` |
| `classroom-hub` | `index.html#classroom-hub` | [L10132](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10132) | `renderClassDetailView` |
| `class-detail` | `index.html#class-detail` | [L10133](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10133) | `renderClassDetailView` |
| `students` | `index.html#students` | [L10134](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10134) | `renderStudentsView` |
| `curriculum` | `index.html#curriculum` | [L10135](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10135) | `renderCurriculumView` |
| `library` | `index.html#library` | [L10136](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10136) | `renderLibraryView` |
| `assignments` | `index.html#assignments` | [L10137](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10137) | `renderAssignmentsView` |
| `homework` | `index.html#homework` | [L10138](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10138) | `renderHomeworkView` |
| `quizzes` | `index.html#quizzes` | [L10139](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10139) | `renderQuizzesView` |
| `assessments` | `index.html#assessments` | [L10140](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10140) | `renderAssessmentsView` |
| `attendance` | `index.html#attendance` | [L10141](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10141) | `renderAttendanceView` |
| `progress` | `index.html#progress` | [L10142](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10142) | `renderProgressView` |
| `analytics` | `index.html#analytics` | [L10143](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10143) | `renderAnalyticsView` |
| `reports` | `index.html#reports` | [L10144](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10144) | `renderReportsView` |
| `progress-check` | `index.html#progress-check` | [L10145](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10145) | `renderProgressCheckView` |
| `story` | `index.html#story` | [L10146](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10146) | `renderClassStoryView` |
| `messages` | `index.html#messages` | [L10147](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10147) | `renderMessagesView` |
| `portfolios` | `index.html#portfolios` | [L10148](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10148) | `renderPortfoliosView` |
| `health` | `index.html#health` | [L10149](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10149) | `case 'system-health': renderSystemHealthView(container); bre` |
| `system-health` | `index.html#system-health` | [L10150](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10150) | `renderSystemHealthView` |
| `worksheets` | `index.html#worksheets` | [L10151](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10151) | `renderWorksheetsView` |
| `archived` | `index.html#archived` | [L10152](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10152) | `renderArchivedManagerView` |
| `settings` | `index.html#settings` | [L10153](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10153) | `renderSchoolSettingsView` |
| `gamification` | `index.html#gamification` | [L10154](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10154) | `renderGamificationView` |
| `monster` | `index.html#monster` | [L10155](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10155) | `renderMonsterStudentView` |
| `adventure` | `index.html#adventure` | [L10156](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10156) | `renderStudentAdventureView` |
| `tasks` | `index.html#tasks` | [L10157](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10157) | `renderStudentTasksView` |
| `badges` | `index.html#badges` | [L10158](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10158) | `renderStudentBadgesView` |
| `leaderboard` | `index.html#leaderboard` | [L10159](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10159) | `renderLeaderboardView` |
| `calendar` | `index.html#calendar` | [L10160](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10160) | `renderCalendarView` |
| `command` | `index.html#command` | [L10161](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10161) | `renderCommandCenterView` |
| `closet` | `index.html#closet` | [L10162](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10162) | `renderMonsterCloset` |
| `rewards` | `index.html#rewards` | [L10163](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10163) | `renderRewardsHall` |
| `shelf` | `index.html#shelf` | [L10164](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10164) | `renderGameShelf` |
| `classview` | `index.html#classview` | [L10165](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10165) | `renderClassBoardView` |
| `board` | `index.html#board` | [L10166](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10166) | `renderClassBoardView` |
| `store` | `index.html#store` | [L10167](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10167) | `renderClassroomStoreView` |
| `parent-home` | `index.html#parent-home` | [L10168](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10168) | `renderParentHomeView` |
| `parent-progress` | `index.html#parent-progress` | [L10169](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10169) | `renderParentProgressView` |
| `parent-story` | `index.html#parent-story` | [L10170](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10170) | `renderParentStoryView` |
| `parent-messages` | `index.html#parent-messages` | [L10171](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10171) | `renderParentMessagesView` |

---

## 4. All Modals & Overlays in [index.html](file:///C:/Users/maysa/Desktop/DV/index.html) (69 total)

| Modal DOM `#id` | Line | Heading / Purpose |
| :--- | :---: | :--- |
| `#modal-textbook-viewer` | [L352](file:///C:/Users/maysa/Desktop/DV/index.html#L352) | Global Readings 2 — Textbook Page Viewer |
| `#modal-scope-sequence` | [L405](file:///C:/Users/maysa/Desktop/DV/index.html#L405) | Curriculum Scope &amp; Sequence |
| `#modal-attach-game` | [L436](file:///C:/Users/maysa/Desktop/DV/index.html#L436) | 🎮 Connect Game to Lesson |
| `#modal-attach-worksheet` | [L455](file:///C:/Users/maysa/Desktop/DV/index.html#L455) | 📄 Connect Worksheet to Lesson |
| `#modal-curriculum-ai` | [L471](file:///C:/Users/maysa/Desktop/DV/index.html#L471) | AI Curriculum Teacher Assistant |
| `#modal-resource-editor` | [L509](file:///C:/Users/maysa/Desktop/DV/index.html#L509) | Add New Resource |
| `#modal-student-profile` | [L608](file:///C:/Users/maysa/Desktop/DV/index.html#L608) | Add New Student |
| `#modal-student-editor` | [L613](file:///C:/Users/maysa/Desktop/DV/index.html#L613) | Add New Student |
| `#modal-create-assignment` | [L689](file:///C:/Users/maysa/Desktop/DV/index.html#L689) | Create New Assignment |
| `#modal-homework-editor` | [L725](file:///C:/Users/maysa/Desktop/DV/index.html#L725) | Create Homework Quest |
| `#modal-add-class` | [L873](file:///C:/Users/maysa/Desktop/DV/index.html#L873) | Create New Class |
| `#modal-give-xp` | [L922](file:///C:/Users/maysa/Desktop/DV/index.html#L922) | ⭐ Award XP to Student |
| `#modal-quiz-builder` | [L960](file:///C:/Users/maysa/Desktop/DV/index.html#L960) | Create Quiz &amp; Test |
| `#modal-assessment-rubric` | [L1004](file:///C:/Users/maysa/Desktop/DV/index.html#L1004) | 🎯 Teacher Rubric Assessment |
| `#modal-story-post` | [L1070](file:///C:/Users/maysa/Desktop/DV/index.html#L1070) | 📸 Post to Class Story |
| `#modal-avatar-customizer` | [L1107](file:///C:/Users/maysa/Desktop/DV/index.html#L1107) | 🎨 Customize Your Avatar |
| `#modal-worksheet-editor` | [L1133](file:///C:/Users/maysa/Desktop/DV/index.html#L1133) | Add New Worksheet |
| `#modal-quiz-questions-manager` | [L1222](file:///C:/Users/maysa/Desktop/DV/index.html#L1222) | Manage Quiz Questions |
| `#modal-rubric-editor` | [L1281](file:///C:/Users/maysa/Desktop/DV/index.html#L1281) | 🎯 Customize Assessment Rubric |
| `#modal-gamification-editor` | [L1324](file:///C:/Users/maysa/Desktop/DV/index.html#L1324) | 🏆 Add Reward Badge |
| `#modal-report-generator` | [L1374](file:///C:/Users/maysa/Desktop/DV/index.html#L1374) | 📄 Generate Student Report Card |
| `#modal-school-settings` | [L1426](file:///C:/Users/maysa/Desktop/DV/index.html#L1426) | ⚙️ School &amp; Classroom Settings |
| `#modal-quick-points` | [L1495](file:///C:/Users/maysa/Desktop/DV/index.html#L1495) | Award Classroom Points |
| `#modal-create-group` | [L1558](file:///C:/Users/maysa/Desktop/DV/index.html#L1558) | 👥 Create Classroom Group |
| `#modal-random-selector` | [L1594](file:///C:/Users/maysa/Desktop/DV/index.html#L1594) | 🎲 Random Student Picker |
| `#modal-fast-attendance` | [L1638](file:///C:/Users/maysa/Desktop/DV/index.html#L1638) | 📋 Daily Attendance Roll Call |
| `#modal-quick-assessment` | [L1666](file:///C:/Users/maysa/Desktop/DV/index.html#L1666) | 📝 Quick Live Assessment |
| `#modal-quick-evidence` | [L1718](file:///C:/Users/maysa/Desktop/DV/index.html#L1718) | 📄 Quick Worksheet &amp; Evidence Entry |
| `#modal-confirm-action` | [L1840](file:///C:/Users/maysa/Desktop/DV/index.html#L1840) | Confirm Action |
| `#modal-calendar-event-editor` | [L1856](file:///C:/Users/maysa/Desktop/DV/index.html#L1856) | 📅 Add Calendar Event |
| `#modal-portfolio-editor` | [L1922](file:///C:/Users/maysa/Desktop/DV/index.html#L1922) | 🎨 Add Portfolio Artifact |
| `#modal-archived-manager` | [L1975](file:///C:/Users/maysa/Desktop/DV/index.html#L1975) | 🗄️ Archived Items &amp; Restore Center |
| `#modal-new-message-thread` | [L2004](file:///C:/Users/maysa/Desktop/DV/index.html#L2004) | 💬 Start Family Conversation |
| `#modal-move-student` | [L2034](file:///C:/Users/maysa/Desktop/DV/index.html#L2034) | 👥 Move Student to Class |
| `#modal-give-xp-skills` | [L2063](file:///C:/Users/maysa/Desktop/DV/index.html#L2063) | Give feedback to 19 students |
| `#modal-xp-skill-editor` | [L2121](file:///C:/Users/maysa/Desktop/DV/index.html#L2121) | ✨ Create Custom XP Skill |
| `#modal-manage-xp-skills` | [L2171](file:///C:/Users/maysa/Desktop/DV/index.html#L2171) | ⚙️ Classroom Feedback Skills |
| `#modal-remove-xp-confirm` | [L2199](file:///C:/Users/maysa/Desktop/DV/index.html#L2199) | Void XP Transaction |
| `#modal-edit-xp-transaction` | [L2236](file:///C:/Users/maysa/Desktop/DV/index.html#L2236) | ✏️ Edit XP Entry |
| `#modal-edit-student-xp` | [L2268](file:///C:/Users/maysa/Desktop/DV/index.html#L2268) | Edit Student XP |
| `#modal-student-xp-history` | [L2338](file:///C:/Users/maysa/Desktop/DV/index.html#L2338) | XP Ledger &amp; Audit Trail |
| `#modal-progression-level-editor` | [L2360](file:///C:/Users/maysa/Desktop/DV/index.html#L2360) | 👾 Edit Progression Level |
| `#modal-monster-item-editor` | [L2431](file:///C:/Users/maysa/Desktop/DV/index.html#L2431) | 🎨 Edit Monster Cosmetic Item |
| `#modal-avatar-selector` | [L2516](file:///C:/Users/maysa/Desktop/DV/index.html#L2516) | Monster Studio &amp; Customizer |
| `#modal-monster-fullscreen` | [L2645](file:///C:/Users/maysa/Desktop/DV/index.html#L2645) | Attach Game to Lesson |
| `#modal-attach-game` | [L2655](file:///C:/Users/maysa/Desktop/DV/index.html#L2655) | Attach Game to Lesson |
| `#modal-attach-worksheet` | [L2675](file:///C:/Users/maysa/Desktop/DV/index.html#L2675) | Attach Worksheet to Lesson |
| `#modal-classroom-toolkit` | [L2695](file:///C:/Users/maysa/Desktop/DV/index.html#L2695) | Classroom Teacher Toolkit |
| `#modal-rewards-manager` | [L2731](file:///C:/Users/maysa/Desktop/DV/index.html#L2731) | Classroom Rewards & Redemption |
| `#modal-big-ideas-editor` | [L2783](file:///C:/Users/maysa/Desktop/DV/index.html#L2783) | Post a Big Idea |
| `#modal-cloud-sync` | [L2830](file:///C:/Users/maysa/Desktop/DV/index.html#L2830) | Supabase Cloud Database |
| `#modal-simon-says` | [L3015](file:///C:/Users/maysa/Desktop/DV/index.html#L3015) | Simon Says: Classroom Live |
| `#modal-worksheet-preview` | [L3070](file:///C:/Users/maysa/Desktop/DV/index.html#L3070) | Worksheet Title |
| `#modal-alice-poster` | [L3097](file:///C:/Users/maysa/Desktop/DV/index.html#L3097) | 📘 Alice in Wonderland: XP Challenges Master Reference |
| `#modal-space-cadet-poster` | [L3115](file:///C:/Users/maysa/Desktop/DV/index.html#L3115) | 🚀 Space Cadet Mission: Master Blueprint &amp; Report Card (A2) |
| `#modal-alice-quest-grader` | [L3134](file:///C:/Users/maysa/Desktop/DV/index.html#L3134) | modal-alice-quest-grader |
| `#modal-homework-grading` | [L3211](file:///C:/Users/maysa/Desktop/DV/index.html#L3211) | Homework Submissions &amp; Grading |
| `#modal-quiz-results` | [L3240](file:///C:/Users/maysa/Desktop/DV/index.html#L3240) | Diagnostic Quiz Results &amp; Overrides |
| `#modal-monster-levelup` | [L3275](file:///C:/Users/maysa/Desktop/DV/index.html#L3275) | MONSTER EVOLUTION! |
| `#modal-monster-hatch` | [L3336](file:///C:/Users/maysa/Desktop/DV/index.html#L3336) | YOUR EGG HAS HATCHED! |
| `#modal-evolution-path` | [L3358](file:///C:/Users/maysa/Desktop/DV/index.html#L3358) | 🗺️ The 7 Evolution Stages of Adventure Academy |
| `#modal-progress-check-runner` | [L3384](file:///C:/Users/maysa/Desktop/DV/index.html#L3384) | English Adventure Progress Check |
| `#modal-pc-celebration` | [L3433](file:///C:/Users/maysa/Desktop/DV/index.html#L3433) | PROGRESS CHECK COMPLETE! |
| `#modal-progress-check-builder` | [L3453](file:///C:/Users/maysa/Desktop/DV/index.html#L3453) | Create English Progress Check |
| `#modal-printable-progress-check` | [L3547](file:///C:/Users/maysa/Desktop/DV/index.html#L3547) | Printable A4 Progress Check |
| `#modal-progress-check-override` | [L3569](file:///C:/Users/maysa/Desktop/DV/index.html#L3569) | Teacher Score Adjustment &amp; Evidence |
| `#modal-student-quest` | [L3641](file:///C:/Users/maysa/Desktop/DV/index.html#L3641) | 🐾 Quest: Animal Habitats Explorer |
| `#modal-quest-completed` | [L3732](file:///C:/Users/maysa/Desktop/DV/index.html#L3732) | QUEST COMPLETED! |
| `#edit-student-xp-modal` | [L4190](file:///C:/Users/maysa/Desktop/DV/index.html#L4190) | Student Name |

---

## 5. Classroom Toolkit Modal Tabs (`#modal-classroom-toolkit`)

| Tab DOM `#id` | Line | Label | Trigger |
| :--- | :---: | :--- | :--- |
| `#tab-tool-timer` | [L2708](file:///C:/Users/maysa/Desktop/DV/index.html#L2708) | ⏱️ Timer | `switchToolkitTool(` |
| `#tab-tool-random` | [L2709](file:///C:/Users/maysa/Desktop/DV/index.html#L2709) | 🎲 Random Picker | `switchToolkitTool(` |
| `#tab-tool-groups` | [L2710](file:///C:/Users/maysa/Desktop/DV/index.html#L2710) | 👥 Group Maker | `switchToolkitTool(` |
| `#tab-tool-noise` | [L2711](file:///C:/Users/maysa/Desktop/DV/index.html#L2711) | 🔊 Noise Meter | `switchToolkitTool(` |
| `#tab-tool-dice` | [L2712](file:///C:/Users/maysa/Desktop/DV/index.html#L2712) | 🎲 Dice Roller | `switchToolkitTool(` |
| `#tab-tool-spinner` | [L2713](file:///C:/Users/maysa/Desktop/DV/index.html#L2713) | 🎡 Spinner Wheel | `switchToolkitTool(` |
| `#tab-tool-instructions` | [L2714](file:///C:/Users/maysa/Desktop/DV/index.html#L2714) | 📝 Smartboard Note | `switchToolkitTool(` |
| `#tab-tool-simon` | [L2715](file:///C:/Users/maysa/Desktop/DV/index.html#L2715) | 🗣️ Simon Says | `switchToolkitTool(` |
| `#tab-tool-bamboozle` | [L2716](file:///C:/Users/maysa/Desktop/DV/index.html#L2716) | 🎲 Bamboozle | `switchToolkitTool(` |
| `#tab-tool-ideas` | [L2717](file:///C:/Users/maysa/Desktop/DV/index.html#L2717) | 💡 Good Ideas Lab | `switchToolkitTool(` |
| `#tab-tool-brain` | [L2718](file:///C:/Users/maysa/Desktop/DV/index.html#L2718) | 🧠 Brain Hackers | `switchToolkitTool(` |
| `#tab-tool-sounds` | [L2719](file:///C:/Users/maysa/Desktop/DV/index.html#L2719) | 🎵 Soundboard | `switchToolkitTool(` |
| `#tab-tool-voice` | [L2720](file:///C:/Users/maysa/Desktop/DV/index.html#L2720) | 🎙️ Voice Changer | `switchToolkitTool(` |

---

## 6. Stylesheet Load Order in [index.html](file:///C:/Users/maysa/Desktop/DV/index.html#L24-L31)

| Order | Stylesheet | `?v=` | Index Line |
| :---: | :--- | :---: | :---: |
| 1 | [css/school-platform.css](file:///C:/Users/maysa/Desktop/DV/css/school-platform.css) | `8` | [L24](file:///C:/Users/maysa/Desktop/DV/index.html#L24) |
| 2 | [css/eaa-theme.css](file:///C:/Users/maysa/Desktop/DV/css/eaa-theme.css) | `3` | [L25](file:///C:/Users/maysa/Desktop/DV/index.html#L25) |
| 3 | [css/style.css](file:///C:/Users/maysa/Desktop/DV/css/style.css) | `4` | [L26](file:///C:/Users/maysa/Desktop/DV/index.html#L26) |
| 4 | [css/ui-polish.css](file:///C:/Users/maysa/Desktop/DV/css/ui-polish.css) | `17` | [L27](file:///C:/Users/maysa/Desktop/DV/index.html#L27) |
| 5 | [css/glass-theme.css](file:///C:/Users/maysa/Desktop/DV/css/glass-theme.css) | `6` | [L28](file:///C:/Users/maysa/Desktop/DV/index.html#L28) |
| 6 | [css/class-mode.css](file:///C:/Users/maysa/Desktop/DV/css/class-mode.css) | `20261121c` | [L29](file:///C:/Users/maysa/Desktop/DV/index.html#L29) |
| 7 | [css/class-mode-pages.css](file:///C:/Users/maysa/Desktop/DV/css/class-mode-pages.css) | `7` | [L30](file:///C:/Users/maysa/Desktop/DV/index.html#L30) |
| 8 | [css/tines-theme.css](file:///C:/Users/maysa/Desktop/DV/css/tines-theme.css) | `20261121b` | [L31](file:///C:/Users/maysa/Desktop/DV/index.html#L31) |
| 9 | [css/bright-platform.css](file:///C:/Users/maysa/Desktop/DV/css/bright-platform.css) | `20261121c` | [L32](file:///C:/Users/maysa/Desktop/DV/index.html#L32) |

---

## 7. Exact Script Load Order in [index.html](file:///C:/Users/maysa/Desktop/DV/index.html#L4395-L4424) (69 scripts)

| # | Script | `?v=` | Index Line |
| :---: | :--- | :---: | :---: |
| 1 | [js/games-data.js](file:///C:/Users/maysa/Desktop/DV/js/games-data.js) | `20261121b` | [L2928](file:///C:/Users/maysa/Desktop/DV/index.html#L2928) |
| 2 | [js/offline.js](file:///C:/Users/maysa/Desktop/DV/js/offline.js) | `2` | [L2931](file:///C:/Users/maysa/Desktop/DV/index.html#L2931) |
| 3 | `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` | `—` | [L2932](file:///C:/Users/maysa/Desktop/DV/index.html#L2932) |
| 4 | [js/supabase-config.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-config.js) | `2.5` | [L2933](file:///C:/Users/maysa/Desktop/DV/index.html#L2933) |
| 5 | [js/supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) | `4.6` | [L2934](file:///C:/Users/maysa/Desktop/DV/index.html#L2934) |
| 6 | [js/teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js) | `2.2` | [L2935](file:///C:/Users/maysa/Desktop/DV/index.html#L2935) |
| 7 | [js/school-cloud-sync.js](file:///C:/Users/maysa/Desktop/DV/js/school-cloud-sync.js) | `3.1` | [L2938](file:///C:/Users/maysa/Desktop/DV/index.html#L2938) |
| 8 | [js/homework-data.js](file:///C:/Users/maysa/Desktop/DV/js/homework-data.js) | `3.1` | [L2941](file:///C:/Users/maysa/Desktop/DV/index.html#L2941) |
| 9 | [js/evolution-levels.js](file:///C:/Users/maysa/Desktop/DV/js/evolution-levels.js) | `1` | [L2944](file:///C:/Users/maysa/Desktop/DV/index.html#L2944) |
| 10 | [js/school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js) | `20261119sp1` | [L2945](file:///C:/Users/maysa/Desktop/DV/index.html#L2945) |
| 11 | [js/island-apply.js](file:///C:/Users/maysa/Desktop/DV/js/island-apply.js) | `2` | [L2946](file:///C:/Users/maysa/Desktop/DV/index.html#L2946) |
| 12 | [js/monster-costumes.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes.js) | `5` | [L2947](file:///C:/Users/maysa/Desktop/DV/index.html#L2947) |
| 13 | [js/monster-costumes2.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes2.js) | `3` | [L2948](file:///C:/Users/maysa/Desktop/DV/index.html#L2948) |
| 14 | [js/monster-costumes3.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes3.js) | `2` | [L2949](file:///C:/Users/maysa/Desktop/DV/index.html#L2949) |
| 15 | [js/monster-costumes4.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes4.js) | `1` | [L2950](file:///C:/Users/maysa/Desktop/DV/index.html#L2950) |
| 16 | [js/monster-pets.js](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js) | `9` | [L2951](file:///C:/Users/maysa/Desktop/DV/index.html#L2951) |
| 17 | [js/classroom-cosmetics.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-cosmetics.js) | `1` | [L2952](file:///C:/Users/maysa/Desktop/DV/index.html#L2952) |
| 18 | [js/no-monsters.js](file:///C:/Users/maysa/Desktop/DV/js/no-monsters.js) | `2` | [L2953](file:///C:/Users/maysa/Desktop/DV/index.html#L2953) |
| 19 | [js/classroom-store.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js) | `20261121b` | [L2954](file:///C:/Users/maysa/Desktop/DV/index.html#L2954) |
| 20 | [js/retired-themes.js](file:///C:/Users/maysa/Desktop/DV/js/retired-themes.js) | `3` | [L2955](file:///C:/Users/maysa/Desktop/DV/index.html#L2955) |
| 21 | [js/timetable.js](file:///C:/Users/maysa/Desktop/DV/js/timetable.js) | `20261116` | [L2956](file:///C:/Users/maysa/Desktop/DV/index.html#L2956) |
| 22 | [js/unit2-content.js](file:///C:/Users/maysa/Desktop/DV/js/unit2-content.js) | `ti101` | [L2957](file:///C:/Users/maysa/Desktop/DV/index.html#L2957) |
| 23 | [js/calendar-view.js](file:///C:/Users/maysa/Desktop/DV/js/calendar-view.js) | `20261116` | [L2958](file:///C:/Users/maysa/Desktop/DV/index.html#L2958) |
| 24 | [js/revision-board.js](file:///C:/Users/maysa/Desktop/DV/js/revision-board.js) | `1` | [L2959](file:///C:/Users/maysa/Desktop/DV/index.html#L2959) |
| 25 | [js/class-journey.js](file:///C:/Users/maysa/Desktop/DV/js/class-journey.js) | `2` | [L2960](file:///C:/Users/maysa/Desktop/DV/index.html#L2960) |
| 26 | [js/command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) | `62` | [L2961](file:///C:/Users/maysa/Desktop/DV/index.html#L2961) |
| 27 | [js/sleepy-monster.js](file:///C:/Users/maysa/Desktop/DV/js/sleepy-monster.js) | `4` | [L2962](file:///C:/Users/maysa/Desktop/DV/index.html#L2962) |
| 28 | [js/voice-fx.js](file:///C:/Users/maysa/Desktop/DV/js/voice-fx.js) | `5` | [L2963](file:///C:/Users/maysa/Desktop/DV/index.html#L2963) |
| 29 | [js/library-curate.js](file:///C:/Users/maysa/Desktop/DV/js/library-curate.js) | `20261121b` | [L2964](file:///C:/Users/maysa/Desktop/DV/index.html#L2964) |
| 30 | [js/board-scenes.js](file:///C:/Users/maysa/Desktop/DV/js/board-scenes.js) | `9` | [L2965](file:///C:/Users/maysa/Desktop/DV/index.html#L2965) |
| 31 | [js/pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js) | `20261121b` | [L2966](file:///C:/Users/maysa/Desktop/DV/index.html#L2966) |
| 32 | [js/class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js) | `47` | [L2967](file:///C:/Users/maysa/Desktop/DV/index.html#L2967) |
| 33 | [js/bathroom-pass.js](file:///C:/Users/maysa/Desktop/DV/js/bathroom-pass.js) | `3` | [L2968](file:///C:/Users/maysa/Desktop/DV/index.html#L2968) |
| 34 | [js/class-view.js](file:///C:/Users/maysa/Desktop/DV/js/class-view.js) | `14` | [L2969](file:///C:/Users/maysa/Desktop/DV/index.html#L2969) |
| 35 | [js/class-rewards.js](file:///C:/Users/maysa/Desktop/DV/js/class-rewards.js) | `11` | [L2970](file:///C:/Users/maysa/Desktop/DV/index.html#L2970) |
| 36 | [js/monster-closet.js](file:///C:/Users/maysa/Desktop/DV/js/monster-closet.js) | `6` | [L2971](file:///C:/Users/maysa/Desktop/DV/index.html#L2971) |
| 37 | [js/class-mode.js](file:///C:/Users/maysa/Desktop/DV/js/class-mode.js) | `20261121c` | [L2972](file:///C:/Users/maysa/Desktop/DV/index.html#L2972) |
| 38 | [js/private-data.js](file:///C:/Users/maysa/Desktop/DV/js/private-data.js) | `2` | [L2973](file:///C:/Users/maysa/Desktop/DV/index.html#L2973) |
| 39 | [js/birthday.js](file:///C:/Users/maysa/Desktop/DV/js/birthday.js) | `4` | [L2974](file:///C:/Users/maysa/Desktop/DV/index.html#L2974) |
| 40 | [js/academy-audio.js](file:///C:/Users/maysa/Desktop/DV/js/academy-audio.js) | `3.1` | [L2977](file:///C:/Users/maysa/Desktop/DV/index.html#L2977) |
| 41 | [js/monster-outfits.js](file:///C:/Users/maysa/Desktop/DV/js/monster-outfits.js) | `3` | [L2979](file:///C:/Users/maysa/Desktop/DV/index.html#L2979) |
| 42 | [js/monster-renderer.js](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js) | `4.17` | [L2980](file:///C:/Users/maysa/Desktop/DV/index.html#L2980) |
| 43 | [js/monster-anchors.js](file:///C:/Users/maysa/Desktop/DV/js/monster-anchors.js) | `2.1` | [L2981](file:///C:/Users/maysa/Desktop/DV/index.html#L2981) |
| 44 | [js/monster-dressup.js](file:///C:/Users/maysa/Desktop/DV/js/monster-dressup.js) | `9` | [L2982](file:///C:/Users/maysa/Desktop/DV/index.html#L2982) |
| 45 | [js/progress-check.js](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js) | `3.0` | [L2983](file:///C:/Users/maysa/Desktop/DV/index.html#L2983) |
| 46 | [js/gamification-milestones.js](file:///C:/Users/maysa/Desktop/DV/js/gamification-milestones.js) | `3.4` | [L2984](file:///C:/Users/maysa/Desktop/DV/index.html#L2984) |
| 47 | [js/mystery-box-modal.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js) | `1.4` | [L2985](file:///C:/Users/maysa/Desktop/DV/index.html#L2985) |
| 48 | [js/mystery-box-v2.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-v2.js) | `5` | [L2986](file:///C:/Users/maysa/Desktop/DV/index.html#L2986) |
| 49 | [js/library.js](file:///C:/Users/maysa/Desktop/DV/js/library.js) | `3.1.3` | [L2988](file:///C:/Users/maysa/Desktop/DV/index.html#L2988) |
| 50 | [js/library-shelf.js](file:///C:/Users/maysa/Desktop/DV/js/library-shelf.js) | `20261121c` | [L2989](file:///C:/Users/maysa/Desktop/DV/index.html#L2989) |
| 51 | [js/theme-badges.js](file:///C:/Users/maysa/Desktop/DV/js/theme-badges.js) | `2.0` | [L2991](file:///C:/Users/maysa/Desktop/DV/index.html#L2991) |
| 52 | [js/all-about-me-data.js](file:///C:/Users/maysa/Desktop/DV/js/all-about-me-data.js) | `2.0` | [L2992](file:///C:/Users/maysa/Desktop/DV/index.html#L2992) |
| 53 | [js/all-about-me-profile.js](file:///C:/Users/maysa/Desktop/DV/js/all-about-me-profile.js) | `1.0` | [L2993](file:///C:/Users/maysa/Desktop/DV/index.html#L2993) |
| 54 | [js/sheet-sync.js](file:///C:/Users/maysa/Desktop/DV/js/sheet-sync.js) | `9` | [L2994](file:///C:/Users/maysa/Desktop/DV/index.html#L2994) |
| 55 | [js/worksheet-sync.js](file:///C:/Users/maysa/Desktop/DV/js/worksheet-sync.js) | `4` | [L2995](file:///C:/Users/maysa/Desktop/DV/index.html#L2995) |
| 56 | [js/quiz-results.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-results.js) | `15` | [L2996](file:///C:/Users/maysa/Desktop/DV/index.html#L2996) |
| 57 | [js/quiz-skills.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-skills.js) | `5` | [L2997](file:///C:/Users/maysa/Desktop/DV/index.html#L2997) |
| 58 | [js/parent-report.js](file:///C:/Users/maysa/Desktop/DV/js/parent-report.js) | `21` | [L2998](file:///C:/Users/maysa/Desktop/DV/index.html#L2998) |
| 59 | [js/daily-report.js](file:///C:/Users/maysa/Desktop/DV/js/daily-report.js) | `1` | [L2999](file:///C:/Users/maysa/Desktop/DV/index.html#L2999) |
| 60 | [js/pupil-profile.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-profile.js) | `10` | [L3000](file:///C:/Users/maysa/Desktop/DV/index.html#L3000) |
| 61 | [js/pupil-card.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-card.js) | `7` | [L3001](file:///C:/Users/maysa/Desktop/DV/index.html#L3001) |
| 62 | [js/platform-nav.js](file:///C:/Users/maysa/Desktop/DV/js/platform-nav.js) | `20261121c` | [L3002](file:///C:/Users/maysa/Desktop/DV/index.html#L3002) |
| 63 | [js/daily-backup.js](file:///C:/Users/maysa/Desktop/DV/js/daily-backup.js) | `1` | [L3003](file:///C:/Users/maysa/Desktop/DV/index.html#L3003) |
| 64 | [js/school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) | `20261121c` | [L3004](file:///C:/Users/maysa/Desktop/DV/index.html#L3004) |
| 65 | [js/games-points-bridge.js](file:///C:/Users/maysa/Desktop/DV/js/games-points-bridge.js) | `1` | [L3005](file:///C:/Users/maysa/Desktop/DV/index.html#L3005) |
| 66 | [js/milestone-ceremony.js](file:///C:/Users/maysa/Desktop/DV/js/milestone-ceremony.js) | `13` | [L3006](file:///C:/Users/maysa/Desktop/DV/index.html#L3006) |
| 67 | [js/simon-says-game.js](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js) | `4.1` | [L3007](file:///C:/Users/maysa/Desktop/DV/index.html#L3007) |
| 68 | [js/classroom-sounds.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-sounds.js) | `2` | [L3008](file:///C:/Users/maysa/Desktop/DV/index.html#L3008) |
| 69 | [js/quiz-engine.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-engine.js) | `1.2` | [L3009](file:///C:/Users/maysa/Desktop/DV/index.html#L3009) |
