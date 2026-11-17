# 01 — Platform Screens, DOM, Modals & Load Order

> Back to [SITE_MAP.md](file:///C:/Users/maysa/Desktop/DV/SITE_MAP.md)

---

## 1. Standalone HTML Entry Points

| Entry Page | Size / Lines | Purpose |
| :--- | :---: | :--- |
| [index.html](file:///C:/Users/maysa/Desktop/DV/index.html) | 280 KB (4296L) | Main School Platform SPA Host (Teacher, Student, Parent, Class Mode) |
| [directory.html](file:///C:/Users/maysa/Desktop/DV/directory.html) | 32.9 KB (627L) | Students Directory & Monster Companions Grid |
| [site-map/index.html](file:///C:/Users/maysa/Desktop/DV/site-map/index.html) | 6.8 KB (149L) | Interactive Visual Site Map & Developer Explorer (Read-Only) |
| [game-maker/index.html](file:///C:/Users/maysa/Desktop/DV/game-maker/index.html) | 4.5 KB (92L) | Game Maker 2.0 Arcade Host (22 Modes + 75 Question Sets) |
| [island/index.html](file:///C:/Users/maysa/Desktop/DV/island/index.html) | 5.5 KB (97L) | Practice Island Student Home App (Chapters, Harbour, Shop) |
| [island/world.html](file:///C:/Users/maysa/Desktop/DV/island/world.html) | 9.2 KB (156L) | Practice Island 2D Walking World |
| [island/teacher.html](file:///C:/Users/maysa/Desktop/DV/island/teacher.html) | 12.2 KB (309L) | Practice Island Teacher Live Progress Wall |
| [passport/index.html](file:///C:/Users/maysa/Desktop/DV/passport/index.html) | 1.6 KB (38L) | My Passport Student Booklets & Class Gallery |
| [home-view/index.html](file:///C:/Users/maysa/Desktop/DV/home-view/index.html) | 0.4 KB (16L) | Parent & Student Home Overview Portal |
| [smart-board/index.html](file:///C:/Users/maysa/Desktop/DV/smart-board/index.html) | 11 KB (176L) | AI Classroom Smart Board |
| [magic-book/index.html](file:///C:/Users/maysa/Desktop/DV/magic-book/index.html) | 3.7 KB (93L) | The Magic Book Interactive Unit 5 Textbook Reader |
| [monster-studio/index.html](file:///C:/Users/maysa/Desktop/DV/monster-studio/index.html) | 35.1 KB (1014L) | Standalone Monster Studio Preview Host |
| [pharaoh-living-book.html](file:///C:/Users/maysa/Desktop/DV/pharaoh-living-book.html) | 116.8 KB (2680L) | The Pharaoh's Kingdom 3D Living Pop-Up Book (Grade 3 Egypt) |
| [404.html](file:///C:/Users/maysa/Desktop/DV/404.html) | 22.5 KB (384L) | GitHub Pages Deep-Link Router & Detective Navigation Hub |

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
| `dashboard` | `index.html#dashboard` | [L10123](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10123) | `renderTeacherDashboard` |
| `classes` | `index.html#classes` | [L10124](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10124) | `renderClassesView` |
| `classroom-hub` | `index.html#classroom-hub` | [L10125](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10125) | `renderClassDetailView` |
| `class-detail` | `index.html#class-detail` | [L10126](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10126) | `renderClassDetailView` |
| `students` | `index.html#students` | [L10127](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10127) | `renderStudentsView` |
| `curriculum` | `index.html#curriculum` | [L10128](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10128) | `renderCurriculumView` |
| `library` | `index.html#library` | [L10129](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10129) | `renderLibraryView` |
| `assignments` | `index.html#assignments` | [L10130](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10130) | `renderAssignmentsView` |
| `homework` | `index.html#homework` | [L10131](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10131) | `renderHomeworkView` |
| `quizzes` | `index.html#quizzes` | [L10132](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10132) | `renderQuizzesView` |
| `assessments` | `index.html#assessments` | [L10133](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10133) | `renderAssessmentsView` |
| `attendance` | `index.html#attendance` | [L10134](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10134) | `renderAttendanceView` |
| `progress` | `index.html#progress` | [L10135](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10135) | `renderProgressView` |
| `analytics` | `index.html#analytics` | [L10136](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10136) | `renderAnalyticsView` |
| `reports` | `index.html#reports` | [L10137](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10137) | `renderReportsView` |
| `progress-check` | `index.html#progress-check` | [L10138](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10138) | `renderProgressCheckView` |
| `story` | `index.html#story` | [L10139](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10139) | `renderClassStoryView` |
| `messages` | `index.html#messages` | [L10140](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10140) | `renderMessagesView` |
| `portfolios` | `index.html#portfolios` | [L10141](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10141) | `renderPortfoliosView` |
| `health` | `index.html#health` | [L10142](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10142) | `case 'system-health': renderSystemHealthView(container); bre` |
| `system-health` | `index.html#system-health` | [L10143](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10143) | `renderSystemHealthView` |
| `worksheets` | `index.html#worksheets` | [L10144](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10144) | `renderWorksheetsView` |
| `archived` | `index.html#archived` | [L10145](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10145) | `renderArchivedManagerView` |
| `settings` | `index.html#settings` | [L10146](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10146) | `renderSchoolSettingsView` |
| `gamification` | `index.html#gamification` | [L10147](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10147) | `renderGamificationView` |
| `monster` | `index.html#monster` | [L10148](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10148) | `renderMonsterStudentView` |
| `adventure` | `index.html#adventure` | [L10149](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10149) | `renderStudentAdventureView` |
| `tasks` | `index.html#tasks` | [L10150](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10150) | `renderStudentTasksView` |
| `badges` | `index.html#badges` | [L10151](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10151) | `renderStudentBadgesView` |
| `leaderboard` | `index.html#leaderboard` | [L10152](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10152) | `renderLeaderboardView` |
| `calendar` | `index.html#calendar` | [L10153](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10153) | `renderCalendarView` |
| `command` | `index.html#command` | [L10154](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10154) | `renderCommandCenterView` |
| `closet` | `index.html#closet` | [L10155](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10155) | `renderMonsterCloset` |
| `rewards` | `index.html#rewards` | [L10156](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10156) | `renderRewardsHall` |
| `shelf` | `index.html#shelf` | [L10157](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10157) | `renderGameShelf` |
| `classview` | `index.html#classview` | [L10158](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10158) | `renderClassBoardView` |
| `board` | `index.html#board` | [L10159](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10159) | `renderClassBoardView` |
| `store` | `index.html#store` | [L10160](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10160) | `renderClassroomStoreView` |
| `parent-home` | `index.html#parent-home` | [L10161](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10161) | `renderParentHomeView` |
| `parent-progress` | `index.html#parent-progress` | [L10162](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10162) | `renderParentProgressView` |
| `parent-story` | `index.html#parent-story` | [L10163](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10163) | `renderParentStoryView` |
| `parent-messages` | `index.html#parent-messages` | [L10164](file:///C:/Users/maysa/Desktop/DV/js/school-app.js#L10164) | `renderParentMessagesView` |

---

## 4. All Modals & Overlays in [index.html](file:///C:/Users/maysa/Desktop/DV/index.html) (69 total)

| Modal DOM `#id` | Line | Heading / Purpose |
| :--- | :---: | :--- |
| `#modal-textbook-viewer` | [L351](file:///C:/Users/maysa/Desktop/DV/index.html#L351) | Global Readings 2 — Textbook Page Viewer |
| `#modal-scope-sequence` | [L404](file:///C:/Users/maysa/Desktop/DV/index.html#L404) | Curriculum Scope &amp; Sequence |
| `#modal-attach-game` | [L435](file:///C:/Users/maysa/Desktop/DV/index.html#L435) | 🎮 Connect Game to Lesson |
| `#modal-attach-worksheet` | [L454](file:///C:/Users/maysa/Desktop/DV/index.html#L454) | 📄 Connect Worksheet to Lesson |
| `#modal-curriculum-ai` | [L470](file:///C:/Users/maysa/Desktop/DV/index.html#L470) | AI Curriculum Teacher Assistant |
| `#modal-resource-editor` | [L508](file:///C:/Users/maysa/Desktop/DV/index.html#L508) | Add New Resource |
| `#modal-student-profile` | [L607](file:///C:/Users/maysa/Desktop/DV/index.html#L607) | Add New Student |
| `#modal-student-editor` | [L612](file:///C:/Users/maysa/Desktop/DV/index.html#L612) | Add New Student |
| `#modal-create-assignment` | [L688](file:///C:/Users/maysa/Desktop/DV/index.html#L688) | Create New Assignment |
| `#modal-homework-editor` | [L724](file:///C:/Users/maysa/Desktop/DV/index.html#L724) | Create Homework Quest |
| `#modal-add-class` | [L872](file:///C:/Users/maysa/Desktop/DV/index.html#L872) | Create New Class |
| `#modal-give-xp` | [L921](file:///C:/Users/maysa/Desktop/DV/index.html#L921) | ⭐ Award XP to Student |
| `#modal-quiz-builder` | [L959](file:///C:/Users/maysa/Desktop/DV/index.html#L959) | Create Quiz &amp; Test |
| `#modal-assessment-rubric` | [L1003](file:///C:/Users/maysa/Desktop/DV/index.html#L1003) | 🎯 Teacher Rubric Assessment |
| `#modal-story-post` | [L1069](file:///C:/Users/maysa/Desktop/DV/index.html#L1069) | 📸 Post to Class Story |
| `#modal-avatar-customizer` | [L1106](file:///C:/Users/maysa/Desktop/DV/index.html#L1106) | 🎨 Customize Your Avatar |
| `#modal-worksheet-editor` | [L1132](file:///C:/Users/maysa/Desktop/DV/index.html#L1132) | Add New Worksheet |
| `#modal-quiz-questions-manager` | [L1221](file:///C:/Users/maysa/Desktop/DV/index.html#L1221) | Manage Quiz Questions |
| `#modal-rubric-editor` | [L1280](file:///C:/Users/maysa/Desktop/DV/index.html#L1280) | 🎯 Customize Assessment Rubric |
| `#modal-gamification-editor` | [L1323](file:///C:/Users/maysa/Desktop/DV/index.html#L1323) | 🏆 Add Reward Badge |
| `#modal-report-generator` | [L1373](file:///C:/Users/maysa/Desktop/DV/index.html#L1373) | 📄 Generate Student Report Card |
| `#modal-school-settings` | [L1425](file:///C:/Users/maysa/Desktop/DV/index.html#L1425) | ⚙️ School &amp; Classroom Settings |
| `#modal-quick-points` | [L1494](file:///C:/Users/maysa/Desktop/DV/index.html#L1494) | Award Classroom Points |
| `#modal-create-group` | [L1557](file:///C:/Users/maysa/Desktop/DV/index.html#L1557) | 👥 Create Classroom Group |
| `#modal-random-selector` | [L1593](file:///C:/Users/maysa/Desktop/DV/index.html#L1593) | 🎲 Random Student Picker |
| `#modal-fast-attendance` | [L1637](file:///C:/Users/maysa/Desktop/DV/index.html#L1637) | 📋 Daily Attendance Roll Call |
| `#modal-quick-assessment` | [L1665](file:///C:/Users/maysa/Desktop/DV/index.html#L1665) | 📝 Quick Live Assessment |
| `#modal-quick-evidence` | [L1717](file:///C:/Users/maysa/Desktop/DV/index.html#L1717) | 📄 Quick Worksheet &amp; Evidence Entry |
| `#modal-confirm-action` | [L1839](file:///C:/Users/maysa/Desktop/DV/index.html#L1839) | Confirm Action |
| `#modal-calendar-event-editor` | [L1855](file:///C:/Users/maysa/Desktop/DV/index.html#L1855) | 📅 Add Calendar Event |
| `#modal-portfolio-editor` | [L1921](file:///C:/Users/maysa/Desktop/DV/index.html#L1921) | 🎨 Add Portfolio Artifact |
| `#modal-archived-manager` | [L1974](file:///C:/Users/maysa/Desktop/DV/index.html#L1974) | 🗄️ Archived Items &amp; Restore Center |
| `#modal-new-message-thread` | [L2003](file:///C:/Users/maysa/Desktop/DV/index.html#L2003) | 💬 Start Family Conversation |
| `#modal-move-student` | [L2033](file:///C:/Users/maysa/Desktop/DV/index.html#L2033) | 👥 Move Student to Class |
| `#modal-give-xp-skills` | [L2062](file:///C:/Users/maysa/Desktop/DV/index.html#L2062) | Give feedback to 19 students |
| `#modal-xp-skill-editor` | [L2120](file:///C:/Users/maysa/Desktop/DV/index.html#L2120) | ✨ Create Custom XP Skill |
| `#modal-manage-xp-skills` | [L2170](file:///C:/Users/maysa/Desktop/DV/index.html#L2170) | ⚙️ Classroom Feedback Skills |
| `#modal-remove-xp-confirm` | [L2198](file:///C:/Users/maysa/Desktop/DV/index.html#L2198) | Void XP Transaction |
| `#modal-edit-xp-transaction` | [L2235](file:///C:/Users/maysa/Desktop/DV/index.html#L2235) | ✏️ Edit XP Entry |
| `#modal-edit-student-xp` | [L2267](file:///C:/Users/maysa/Desktop/DV/index.html#L2267) | Edit Student XP |
| `#modal-student-xp-history` | [L2337](file:///C:/Users/maysa/Desktop/DV/index.html#L2337) | XP Ledger &amp; Audit Trail |
| `#modal-progression-level-editor` | [L2359](file:///C:/Users/maysa/Desktop/DV/index.html#L2359) | 👾 Edit Progression Level |
| `#modal-monster-item-editor` | [L2430](file:///C:/Users/maysa/Desktop/DV/index.html#L2430) | 🎨 Edit Monster Cosmetic Item |
| `#modal-avatar-selector` | [L2515](file:///C:/Users/maysa/Desktop/DV/index.html#L2515) | Monster Studio &amp; Customizer |
| `#modal-monster-fullscreen` | [L2644](file:///C:/Users/maysa/Desktop/DV/index.html#L2644) | Attach Game to Lesson |
| `#modal-attach-game` | [L2654](file:///C:/Users/maysa/Desktop/DV/index.html#L2654) | Attach Game to Lesson |
| `#modal-attach-worksheet` | [L2674](file:///C:/Users/maysa/Desktop/DV/index.html#L2674) | Attach Worksheet to Lesson |
| `#modal-classroom-toolkit` | [L2694](file:///C:/Users/maysa/Desktop/DV/index.html#L2694) | Classroom Teacher Toolkit |
| `#modal-rewards-manager` | [L2730](file:///C:/Users/maysa/Desktop/DV/index.html#L2730) | Classroom Rewards & Redemption |
| `#modal-big-ideas-editor` | [L2782](file:///C:/Users/maysa/Desktop/DV/index.html#L2782) | Post a Big Idea |
| `#modal-cloud-sync` | [L2829](file:///C:/Users/maysa/Desktop/DV/index.html#L2829) | Supabase Cloud Database |
| `#modal-simon-says` | [L3014](file:///C:/Users/maysa/Desktop/DV/index.html#L3014) | Simon Says: Classroom Live |
| `#modal-worksheet-preview` | [L3069](file:///C:/Users/maysa/Desktop/DV/index.html#L3069) | Worksheet Title |
| `#modal-alice-poster` | [L3096](file:///C:/Users/maysa/Desktop/DV/index.html#L3096) | 📘 Alice in Wonderland: XP Challenges Master Reference |
| `#modal-space-cadet-poster` | [L3114](file:///C:/Users/maysa/Desktop/DV/index.html#L3114) | 🚀 Space Cadet Mission: Master Blueprint &amp; Report Card (A2) |
| `#modal-alice-quest-grader` | [L3133](file:///C:/Users/maysa/Desktop/DV/index.html#L3133) | modal-alice-quest-grader |
| `#modal-homework-grading` | [L3210](file:///C:/Users/maysa/Desktop/DV/index.html#L3210) | Homework Submissions &amp; Grading |
| `#modal-quiz-results` | [L3239](file:///C:/Users/maysa/Desktop/DV/index.html#L3239) | Diagnostic Quiz Results &amp; Overrides |
| `#modal-monster-levelup` | [L3274](file:///C:/Users/maysa/Desktop/DV/index.html#L3274) | MONSTER EVOLUTION! |
| `#modal-monster-hatch` | [L3335](file:///C:/Users/maysa/Desktop/DV/index.html#L3335) | YOUR EGG HAS HATCHED! |
| `#modal-evolution-path` | [L3357](file:///C:/Users/maysa/Desktop/DV/index.html#L3357) | 🗺️ The 7 Evolution Stages of Adventure Academy |
| `#modal-progress-check-runner` | [L3383](file:///C:/Users/maysa/Desktop/DV/index.html#L3383) | English Adventure Progress Check |
| `#modal-pc-celebration` | [L3432](file:///C:/Users/maysa/Desktop/DV/index.html#L3432) | PROGRESS CHECK COMPLETE! |
| `#modal-progress-check-builder` | [L3452](file:///C:/Users/maysa/Desktop/DV/index.html#L3452) | Create English Progress Check |
| `#modal-printable-progress-check` | [L3546](file:///C:/Users/maysa/Desktop/DV/index.html#L3546) | Printable A4 Progress Check |
| `#modal-progress-check-override` | [L3568](file:///C:/Users/maysa/Desktop/DV/index.html#L3568) | Teacher Score Adjustment &amp; Evidence |
| `#modal-student-quest` | [L3640](file:///C:/Users/maysa/Desktop/DV/index.html#L3640) | 🐾 Quest: Animal Habitats Explorer |
| `#modal-quest-completed` | [L3731](file:///C:/Users/maysa/Desktop/DV/index.html#L3731) | QUEST COMPLETED! |
| `#edit-student-xp-modal` | [L4189](file:///C:/Users/maysa/Desktop/DV/index.html#L4189) | Student Name |

---

## 5. Classroom Toolkit Modal Tabs (`#modal-classroom-toolkit`)

| Tab DOM `#id` | Line | Label | Trigger |
| :--- | :---: | :--- | :--- |
| `#tab-tool-timer` | [L2707](file:///C:/Users/maysa/Desktop/DV/index.html#L2707) | ⏱️ Timer | `switchToolkitTool(` |
| `#tab-tool-random` | [L2708](file:///C:/Users/maysa/Desktop/DV/index.html#L2708) | 🎲 Random Picker | `switchToolkitTool(` |
| `#tab-tool-groups` | [L2709](file:///C:/Users/maysa/Desktop/DV/index.html#L2709) | 👥 Group Maker | `switchToolkitTool(` |
| `#tab-tool-noise` | [L2710](file:///C:/Users/maysa/Desktop/DV/index.html#L2710) | 🔊 Noise Meter | `switchToolkitTool(` |
| `#tab-tool-dice` | [L2711](file:///C:/Users/maysa/Desktop/DV/index.html#L2711) | 🎲 Dice Roller | `switchToolkitTool(` |
| `#tab-tool-spinner` | [L2712](file:///C:/Users/maysa/Desktop/DV/index.html#L2712) | 🎡 Spinner Wheel | `switchToolkitTool(` |
| `#tab-tool-instructions` | [L2713](file:///C:/Users/maysa/Desktop/DV/index.html#L2713) | 📝 Smartboard Note | `switchToolkitTool(` |
| `#tab-tool-simon` | [L2714](file:///C:/Users/maysa/Desktop/DV/index.html#L2714) | 🗣️ Simon Says | `switchToolkitTool(` |
| `#tab-tool-bamboozle` | [L2715](file:///C:/Users/maysa/Desktop/DV/index.html#L2715) | 🎲 Bamboozle | `switchToolkitTool(` |
| `#tab-tool-ideas` | [L2716](file:///C:/Users/maysa/Desktop/DV/index.html#L2716) | 💡 Good Ideas Lab | `switchToolkitTool(` |
| `#tab-tool-brain` | [L2717](file:///C:/Users/maysa/Desktop/DV/index.html#L2717) | 🧠 Brain Hackers | `switchToolkitTool(` |
| `#tab-tool-sounds` | [L2718](file:///C:/Users/maysa/Desktop/DV/index.html#L2718) | 🎵 Soundboard | `switchToolkitTool(` |
| `#tab-tool-voice` | [L2719](file:///C:/Users/maysa/Desktop/DV/index.html#L2719) | 🎙️ Voice Changer | `switchToolkitTool(` |

---

## 6. Stylesheet Load Order in [index.html](file:///C:/Users/maysa/Desktop/DV/index.html#L24-L31)

| Order | Stylesheet | `?v=` | Index Line |
| :---: | :--- | :---: | :---: |
| 1 | [css/school-platform.css](file:///C:/Users/maysa/Desktop/DV/css/school-platform.css) | `8` | [L24](file:///C:/Users/maysa/Desktop/DV/index.html#L24) |
| 2 | [css/eaa-theme.css](file:///C:/Users/maysa/Desktop/DV/css/eaa-theme.css) | `3` | [L25](file:///C:/Users/maysa/Desktop/DV/index.html#L25) |
| 3 | [css/style.css](file:///C:/Users/maysa/Desktop/DV/css/style.css) | `4` | [L26](file:///C:/Users/maysa/Desktop/DV/index.html#L26) |
| 4 | [css/ui-polish.css](file:///C:/Users/maysa/Desktop/DV/css/ui-polish.css) | `17` | [L27](file:///C:/Users/maysa/Desktop/DV/index.html#L27) |
| 5 | [css/glass-theme.css](file:///C:/Users/maysa/Desktop/DV/css/glass-theme.css) | `6` | [L28](file:///C:/Users/maysa/Desktop/DV/index.html#L28) |
| 6 | [css/class-mode.css](file:///C:/Users/maysa/Desktop/DV/css/class-mode.css) | `14` | [L29](file:///C:/Users/maysa/Desktop/DV/index.html#L29) |
| 7 | [css/class-mode-pages.css](file:///C:/Users/maysa/Desktop/DV/css/class-mode-pages.css) | `7` | [L30](file:///C:/Users/maysa/Desktop/DV/index.html#L30) |
| 8 | [css/tines-theme.css](file:///C:/Users/maysa/Desktop/DV/css/tines-theme.css) | `6` | [L31](file:///C:/Users/maysa/Desktop/DV/index.html#L31) |

---

## 7. Exact Script Load Order in [index.html](file:///C:/Users/maysa/Desktop/DV/index.html#L4395-L4424) (69 scripts)

| # | Script | `?v=` | Index Line |
| :---: | :--- | :---: | :---: |
| 1 | [js/games-data.js](file:///C:/Users/maysa/Desktop/DV/js/games-data.js) | `20261111u5g34` | [L2927](file:///C:/Users/maysa/Desktop/DV/index.html#L2927) |
| 2 | [js/offline.js](file:///C:/Users/maysa/Desktop/DV/js/offline.js) | `2` | [L2930](file:///C:/Users/maysa/Desktop/DV/index.html#L2930) |
| 3 | `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` | `—` | [L2931](file:///C:/Users/maysa/Desktop/DV/index.html#L2931) |
| 4 | [js/supabase-config.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-config.js) | `2.5` | [L2932](file:///C:/Users/maysa/Desktop/DV/index.html#L2932) |
| 5 | [js/supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) | `4.6` | [L2933](file:///C:/Users/maysa/Desktop/DV/index.html#L2933) |
| 6 | [js/teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js) | `2.1` | [L2934](file:///C:/Users/maysa/Desktop/DV/index.html#L2934) |
| 7 | [js/school-cloud-sync.js](file:///C:/Users/maysa/Desktop/DV/js/school-cloud-sync.js) | `3.1` | [L2937](file:///C:/Users/maysa/Desktop/DV/index.html#L2937) |
| 8 | [js/homework-data.js](file:///C:/Users/maysa/Desktop/DV/js/homework-data.js) | `3.1` | [L2940](file:///C:/Users/maysa/Desktop/DV/index.html#L2940) |
| 9 | [js/evolution-levels.js](file:///C:/Users/maysa/Desktop/DV/js/evolution-levels.js) | `1` | [L2943](file:///C:/Users/maysa/Desktop/DV/index.html#L2943) |
| 10 | [js/school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js) | `20261111av3` | [L2944](file:///C:/Users/maysa/Desktop/DV/index.html#L2944) |
| 11 | [js/island-apply.js](file:///C:/Users/maysa/Desktop/DV/js/island-apply.js) | `2` | [L2945](file:///C:/Users/maysa/Desktop/DV/index.html#L2945) |
| 12 | [js/monster-costumes.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes.js) | `5` | [L2946](file:///C:/Users/maysa/Desktop/DV/index.html#L2946) |
| 13 | [js/monster-costumes2.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes2.js) | `3` | [L2947](file:///C:/Users/maysa/Desktop/DV/index.html#L2947) |
| 14 | [js/monster-costumes3.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes3.js) | `2` | [L2948](file:///C:/Users/maysa/Desktop/DV/index.html#L2948) |
| 15 | [js/monster-costumes4.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes4.js) | `1` | [L2949](file:///C:/Users/maysa/Desktop/DV/index.html#L2949) |
| 16 | [js/monster-pets.js](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js) | `9` | [L2950](file:///C:/Users/maysa/Desktop/DV/index.html#L2950) |
| 17 | [js/classroom-cosmetics.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-cosmetics.js) | `1` | [L2951](file:///C:/Users/maysa/Desktop/DV/index.html#L2951) |
| 18 | [js/no-monsters.js](file:///C:/Users/maysa/Desktop/DV/js/no-monsters.js) | `2` | [L2952](file:///C:/Users/maysa/Desktop/DV/index.html#L2952) |
| 19 | [js/classroom-store.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js) | `40` | [L2953](file:///C:/Users/maysa/Desktop/DV/index.html#L2953) |
| 20 | [js/retired-themes.js](file:///C:/Users/maysa/Desktop/DV/js/retired-themes.js) | `3` | [L2954](file:///C:/Users/maysa/Desktop/DV/index.html#L2954) |
| 21 | [js/timetable.js](file:///C:/Users/maysa/Desktop/DV/js/timetable.js) | `20261116` | [L2955](file:///C:/Users/maysa/Desktop/DV/index.html#L2955) |
| 22 | [js/unit2-content.js](file:///C:/Users/maysa/Desktop/DV/js/unit2-content.js) | `ti101` | [L2956](file:///C:/Users/maysa/Desktop/DV/index.html#L2956) |
| 23 | [js/calendar-view.js](file:///C:/Users/maysa/Desktop/DV/js/calendar-view.js) | `20261116` | [L2957](file:///C:/Users/maysa/Desktop/DV/index.html#L2957) |
| 24 | [js/revision-board.js](file:///C:/Users/maysa/Desktop/DV/js/revision-board.js) | `1` | [L2958](file:///C:/Users/maysa/Desktop/DV/index.html#L2958) |
| 25 | [js/class-journey.js](file:///C:/Users/maysa/Desktop/DV/js/class-journey.js) | `2` | [L2959](file:///C:/Users/maysa/Desktop/DV/index.html#L2959) |
| 26 | [js/command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) | `62` | [L2960](file:///C:/Users/maysa/Desktop/DV/index.html#L2960) |
| 27 | [js/sleepy-monster.js](file:///C:/Users/maysa/Desktop/DV/js/sleepy-monster.js) | `4` | [L2961](file:///C:/Users/maysa/Desktop/DV/index.html#L2961) |
| 28 | [js/voice-fx.js](file:///C:/Users/maysa/Desktop/DV/js/voice-fx.js) | `5` | [L2962](file:///C:/Users/maysa/Desktop/DV/index.html#L2962) |
| 29 | [js/library-curate.js](file:///C:/Users/maysa/Desktop/DV/js/library-curate.js) | `3` | [L2963](file:///C:/Users/maysa/Desktop/DV/index.html#L2963) |
| 30 | [js/board-scenes.js](file:///C:/Users/maysa/Desktop/DV/js/board-scenes.js) | `9` | [L2964](file:///C:/Users/maysa/Desktop/DV/index.html#L2964) |
| 31 | [js/pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js) | `30` | [L2965](file:///C:/Users/maysa/Desktop/DV/index.html#L2965) |
| 32 | [js/class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js) | `47` | [L2966](file:///C:/Users/maysa/Desktop/DV/index.html#L2966) |
| 33 | [js/bathroom-pass.js](file:///C:/Users/maysa/Desktop/DV/js/bathroom-pass.js) | `3` | [L2967](file:///C:/Users/maysa/Desktop/DV/index.html#L2967) |
| 34 | [js/class-view.js](file:///C:/Users/maysa/Desktop/DV/js/class-view.js) | `14` | [L2968](file:///C:/Users/maysa/Desktop/DV/index.html#L2968) |
| 35 | [js/class-rewards.js](file:///C:/Users/maysa/Desktop/DV/js/class-rewards.js) | `11` | [L2969](file:///C:/Users/maysa/Desktop/DV/index.html#L2969) |
| 36 | [js/monster-closet.js](file:///C:/Users/maysa/Desktop/DV/js/monster-closet.js) | `6` | [L2970](file:///C:/Users/maysa/Desktop/DV/index.html#L2970) |
| 37 | [js/class-mode.js](file:///C:/Users/maysa/Desktop/DV/js/class-mode.js) | `21` | [L2971](file:///C:/Users/maysa/Desktop/DV/index.html#L2971) |
| 38 | [js/private-data.js](file:///C:/Users/maysa/Desktop/DV/js/private-data.js) | `2` | [L2972](file:///C:/Users/maysa/Desktop/DV/index.html#L2972) |
| 39 | [js/birthday.js](file:///C:/Users/maysa/Desktop/DV/js/birthday.js) | `4` | [L2973](file:///C:/Users/maysa/Desktop/DV/index.html#L2973) |
| 40 | [js/academy-audio.js](file:///C:/Users/maysa/Desktop/DV/js/academy-audio.js) | `3.1` | [L2976](file:///C:/Users/maysa/Desktop/DV/index.html#L2976) |
| 41 | [js/monster-outfits.js](file:///C:/Users/maysa/Desktop/DV/js/monster-outfits.js) | `3` | [L2978](file:///C:/Users/maysa/Desktop/DV/index.html#L2978) |
| 42 | [js/monster-renderer.js](file:///C:/Users/maysa/Desktop/DV/js/monster-renderer.js) | `4.17` | [L2979](file:///C:/Users/maysa/Desktop/DV/index.html#L2979) |
| 43 | [js/monster-anchors.js](file:///C:/Users/maysa/Desktop/DV/js/monster-anchors.js) | `2.1` | [L2980](file:///C:/Users/maysa/Desktop/DV/index.html#L2980) |
| 44 | [js/monster-dressup.js](file:///C:/Users/maysa/Desktop/DV/js/monster-dressup.js) | `9` | [L2981](file:///C:/Users/maysa/Desktop/DV/index.html#L2981) |
| 45 | [js/progress-check.js](file:///C:/Users/maysa/Desktop/DV/js/progress-check.js) | `3.0` | [L2982](file:///C:/Users/maysa/Desktop/DV/index.html#L2982) |
| 46 | [js/gamification-milestones.js](file:///C:/Users/maysa/Desktop/DV/js/gamification-milestones.js) | `3.4` | [L2983](file:///C:/Users/maysa/Desktop/DV/index.html#L2983) |
| 47 | [js/mystery-box-modal.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-modal.js) | `1.4` | [L2984](file:///C:/Users/maysa/Desktop/DV/index.html#L2984) |
| 48 | [js/mystery-box-v2.js](file:///C:/Users/maysa/Desktop/DV/js/mystery-box-v2.js) | `5` | [L2985](file:///C:/Users/maysa/Desktop/DV/index.html#L2985) |
| 49 | [js/library.js](file:///C:/Users/maysa/Desktop/DV/js/library.js) | `3.1.3` | [L2987](file:///C:/Users/maysa/Desktop/DV/index.html#L2987) |
| 50 | [js/library-shelf.js](file:///C:/Users/maysa/Desktop/DV/js/library-shelf.js) | `6` | [L2988](file:///C:/Users/maysa/Desktop/DV/index.html#L2988) |
| 51 | [js/theme-badges.js](file:///C:/Users/maysa/Desktop/DV/js/theme-badges.js) | `2.0` | [L2990](file:///C:/Users/maysa/Desktop/DV/index.html#L2990) |
| 52 | [js/all-about-me-data.js](file:///C:/Users/maysa/Desktop/DV/js/all-about-me-data.js) | `2.0` | [L2991](file:///C:/Users/maysa/Desktop/DV/index.html#L2991) |
| 53 | [js/all-about-me-profile.js](file:///C:/Users/maysa/Desktop/DV/js/all-about-me-profile.js) | `1.0` | [L2992](file:///C:/Users/maysa/Desktop/DV/index.html#L2992) |
| 54 | [js/sheet-sync.js](file:///C:/Users/maysa/Desktop/DV/js/sheet-sync.js) | `9` | [L2993](file:///C:/Users/maysa/Desktop/DV/index.html#L2993) |
| 55 | [js/worksheet-sync.js](file:///C:/Users/maysa/Desktop/DV/js/worksheet-sync.js) | `4` | [L2994](file:///C:/Users/maysa/Desktop/DV/index.html#L2994) |
| 56 | [js/quiz-results.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-results.js) | `15` | [L2995](file:///C:/Users/maysa/Desktop/DV/index.html#L2995) |
| 57 | [js/quiz-skills.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-skills.js) | `5` | [L2996](file:///C:/Users/maysa/Desktop/DV/index.html#L2996) |
| 58 | [js/parent-report.js](file:///C:/Users/maysa/Desktop/DV/js/parent-report.js) | `21` | [L2997](file:///C:/Users/maysa/Desktop/DV/index.html#L2997) |
| 59 | [js/daily-report.js](file:///C:/Users/maysa/Desktop/DV/js/daily-report.js) | `1` | [L2998](file:///C:/Users/maysa/Desktop/DV/index.html#L2998) |
| 60 | [js/pupil-profile.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-profile.js) | `10` | [L2999](file:///C:/Users/maysa/Desktop/DV/index.html#L2999) |
| 61 | [js/pupil-card.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-card.js) | `7` | [L3000](file:///C:/Users/maysa/Desktop/DV/index.html#L3000) |
| 62 | [js/platform-nav.js](file:///C:/Users/maysa/Desktop/DV/js/platform-nav.js) | `9` | [L3001](file:///C:/Users/maysa/Desktop/DV/index.html#L3001) |
| 63 | [js/daily-backup.js](file:///C:/Users/maysa/Desktop/DV/js/daily-backup.js) | `1` | [L3002](file:///C:/Users/maysa/Desktop/DV/index.html#L3002) |
| 64 | [js/school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) | `ti111` | [L3003](file:///C:/Users/maysa/Desktop/DV/index.html#L3003) |
| 65 | [js/games-points-bridge.js](file:///C:/Users/maysa/Desktop/DV/js/games-points-bridge.js) | `1` | [L3004](file:///C:/Users/maysa/Desktop/DV/index.html#L3004) |
| 66 | [js/milestone-ceremony.js](file:///C:/Users/maysa/Desktop/DV/js/milestone-ceremony.js) | `13` | [L3005](file:///C:/Users/maysa/Desktop/DV/index.html#L3005) |
| 67 | [js/simon-says-game.js](file:///C:/Users/maysa/Desktop/DV/js/simon-says-game.js) | `4.1` | [L3006](file:///C:/Users/maysa/Desktop/DV/index.html#L3006) |
| 68 | [js/classroom-sounds.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-sounds.js) | `2` | [L3007](file:///C:/Users/maysa/Desktop/DV/index.html#L3007) |
| 69 | [js/quiz-engine.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-engine.js) | `1.2` | [L3008](file:///C:/Users/maysa/Desktop/DV/index.html#L3008) |
