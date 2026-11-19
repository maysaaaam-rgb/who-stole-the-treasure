# 06 — Cloud Database, Storage Keys, Privacy & Full Git Folder Audit

> Back to [SITE_MAP.md](file:///C:/Users/maysa/Desktop/DV/SITE_MAP.md)

---

## 1. Pupil Privacy Architecture (`AGENTS.md` §8)

1. **Zero Real Pupil Names in Repo:** Public seed data in [school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js) uses `student-3a-224` / `Pupil 224` placeholders.
2. **Real Names Only in Supabase (`students` table):** Loaded only after authenticated teacher sign-in ([teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js) + [school-cloud-sync.js](file:///C:/Users/maysa/Desktop/DV/js/school-cloud-sync.js)).
3. **AES-256-GCM Encrypted Private Bundle ([private-data.js](file:///C:/Users/maysa/Desktop/DV/js/private-data.js)):**
   - Stores `survey` (All About Me), `parentNotes`, and `birthdays` as ciphertext.
   - Decrypted **in memory only** via `EAAPrivate.load()` using the key in Supabase table `private_bundle_key` (protected by RLS `is_teacher()`). Never written to `localStorage`.
4. **Avatar Filename Guard:** Currently **0** untracked non-`student-*` file(s) exist locally in `assets/avatars/` and are redacted by `build-site-map.js`. **Never stage or commit them.**

---

## 2. Supabase PostgreSQL Tables (16 referenced across JS & SQL)

| Table Name | Referenced In |
| :--- | :--- |
| `ai_usage` | [ai_usage.sql](file:///C:/Users/maysa/Desktop/DV/supabase/ai_usage.sql) |
| `assessment_results` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js), [supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) |
| `attendance_records` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js), [supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) |
| `catalog_items` | [supabase-mystery-boxes.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase-mystery-boxes.sql) |
| `classes` | [class-journey.js](file:///C:/Users/maysa/Desktop/DV/js/class-journey.js), [classroom-store.js](file:///C:/Users/maysa/Desktop/DV/js/classroom-store.js), [island-apply.js](file:///C:/Users/maysa/Desktop/DV/js/island-apply.js), [parent-report.js](file:///C:/Users/maysa/Desktop/DV/js/parent-report.js), [pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js), [revision-board.js](file:///C:/Users/maysa/Desktop/DV/js/revision-board.js), [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js), [supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) |
| `island_wall` | [class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js) |
| `mystery_boxes` | [supabase-mystery-boxes.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase-mystery-boxes.sql) |
| `private_bundle_key` | [private-data.js](file:///C:/Users/maysa/Desktop/DV/js/private-data.js) |
| `resources` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js), [add_resources_table.sql](file:///C:/Users/maysa/Desktop/DV/sql/add_resources_table.sql), [supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) |
| `smartboard_pairings` | [teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js), [smartboard_pairings.sql](file:///C:/Users/maysa/Desktop/DV/supabase/smartboard_pairings.sql) |
| `student_inventory` | [supabase-mystery-boxes.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase-mystery-boxes.sql) |
| `students` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js), [supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) |
| `teacher_notes` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js), [supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) |
| `trades` | [supabase-mystery-boxes.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase-mystery-boxes.sql) |
| `voice_usage` | [voice_usage.sql](file:///C:/Users/maysa/Desktop/DV/supabase/voice_usage.sql) |
| `xp_transactions` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js), [supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) |

### SQL Schema & Migration Files
| SQL File | Size | Tables Created |
| :--- | :---: | :--- |
| [sql/add_resources_table.sql](file:///C:/Users/maysa/Desktop/DV/sql/add_resources_table.sql) | 2.2 KB | `resources` |
| [sql/supabase-mystery-boxes.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase-mystery-boxes.sql) | 12.3 KB | `catalog_items`, `student_inventory`, `mystery_boxes`, `trades` |
| [sql/supabase_schema.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_schema.sql) | 10.1 KB | `classes`, `students`, `xp_transactions`, `teacher_notes`, `assessment_results`, `attendance_records`, `resources` |
| [sql/supabase_term2_migration.sql](file:///C:/Users/maysa/Desktop/DV/sql/supabase_term2_migration.sql) | 1.4 KB | Policies / Storage / Functions |
| [supabase/ai_usage.sql](file:///C:/Users/maysa/Desktop/DV/supabase/ai_usage.sql) | 0.5 KB | `ai_usage` |
| [supabase/magic_book_storage.sql](file:///C:/Users/maysa/Desktop/DV/supabase/magic_book_storage.sql) | 1.1 KB | Policies / Storage / Functions |
| [supabase/pupil_avatars_storage.sql](file:///C:/Users/maysa/Desktop/DV/supabase/pupil_avatars_storage.sql) | 1.4 KB | Policies / Storage / Functions |
| [supabase/smartboard_pairings.sql](file:///C:/Users/maysa/Desktop/DV/supabase/smartboard_pairings.sql) | 2.8 KB | `smartboard_pairings` |
| [supabase/voice_usage.sql](file:///C:/Users/maysa/Desktop/DV/supabase/voice_usage.sql) | 0.4 KB | `voice_usage` |

### Supabase RPC Functions
| RPC Name | Called From |
| :--- | :--- |
| `claim_smartboard_pairing` | [teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js) |


---

## 3. Browser `localStorage` & `sessionStorage` Keys (25 keys)

| Storage Key | Used In |
| :--- | :--- |
| `adventure_active_class` | [library.js](file:///C:/Users/maysa/Desktop/DV/js/library.js), [school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) |
| `adventure_students` | [app.js](file:///C:/Users/maysa/Desktop/DV/js/app.js), [school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js), [school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js), [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) |
| `cb_disc` | [class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js) |
| `eaa_bk_restored` | [daily-backup.js](file:///C:/Users/maysa/Desktop/DV/js/daily-backup.js) |
| `eaa_board_absent_` | [class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js), [sleepy-monster.js](file:///C:/Users/maysa/Desktop/DV/js/sleepy-monster.js) |
| `eaa_board_view` | [board-scenes.js](file:///C:/Users/maysa/Desktop/DV/js/board-scenes.js) |
| `eaa_device_trust_v2` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) |
| `eaa_gm_v2` | [class-mode.js](file:///C:/Users/maysa/Desktop/DV/js/class-mode.js) |
| `eaa_island_weak_v1` | [island-apply.js](file:///C:/Users/maysa/Desktop/DV/js/island-apply.js), [parent-report.js](file:///C:/Users/maysa/Desktop/DV/js/parent-report.js) |
| `eaa_karaoke_roster` | [class-board.js](file:///C:/Users/maysa/Desktop/DV/js/class-board.js) |
| `eaa_master_school_v6` | [gamification-milestones.js](file:///C:/Users/maysa/Desktop/DV/js/gamification-milestones.js), [school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js) |
| `eaa_merge_backup_` | [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) |
| `eaa_merge_backup_stale_` | [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) |
| `eaa_monthly_race_start` | [school-store.js](file:///C:/Users/maysa/Desktop/DV/js/school-store.js) |
| `eaa_preview_halloween` | [monster-costumes3.js](file:///C:/Users/maysa/Desktop/DV/js/monster-costumes3.js), [monster-pets.js](file:///C:/Users/maysa/Desktop/DV/js/monster-pets.js) |
| `eaa_redate_backup_` | [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) |
| `eaa_redate_pending` | [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) |
| `eaa_redate_saved` | [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) |
| `eaa_supabase_key_v1` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) |
| `eaa_supabase_url_v1` | [supabase-client.js](file:///C:/Users/maysa/Desktop/DV/js/supabase-client.js) |
| `eaa_xp_backup_` | [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) |
| `eaa_xp_rescue_hidden_v2` | [command-center.js](file:///C:/Users/maysa/Desktop/DV/js/command-center.js) |
| `eaa-nav-sections-collapsed` | [school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) |
| `eaa-sidebar-collapsed` | [school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) |
| `qr-speaking-v1` | [quiz-results.js](file:///C:/Users/maysa/Desktop/DV/js/quiz-results.js) |

---

## 4. Custom DOM Events (4 events)

| Event Name | Dispatched / Listened In |
| :--- | :--- |
| `eaa:avatars-ready` | [pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js) |
| `eaa:private-loaded` | [private-data.js](file:///C:/Users/maysa/Desktop/DV/js/private-data.js) |
| `eaa:teacher-unlocked` | [games-points-bridge.js](file:///C:/Users/maysa/Desktop/DV/js/games-points-bridge.js), [pupil-avatars.js](file:///C:/Users/maysa/Desktop/DV/js/pupil-avatars.js), [teacher-auth.js](file:///C:/Users/maysa/Desktop/DV/js/teacher-auth.js) |
| `monsterProfileUpdated` | [school-app.js](file:///C:/Users/maysa/Desktop/DV/js/school-app.js) |

---

## 5. Complete Root Directory & Git Safety Classification (186 entries)

> **Why `git add -A` is forbidden:** Entries marked `MISSING LOCALLY (GIT DELETED)` exist on the live published site (`main` / `gh-pages`) but were cleaned from this local disk. Running `git add -A` would delete them from the live school website!

| Name | Kind | Local? | `GAMES_DATA` | `404.html` | Git / Privacy Status | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| `_tmp/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `.agent/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `.claude/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `.github/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `.gitignore` | Root File | ✅ | — | — | **MODIFIED / UNPUSHED** | Has local modifications not yet pushed |
| `.nojekyll` | Root File | ✅ | — | — | **LIVE** | Tracked & safe |
| `404.html` | HTML Entry Page | ✅ | — | — | **LIVE** | Tracked & safe |
| `adventure-engine/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `advice/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `AGENTS.md` | Documentation / Rule | ✅ | — | — | **LIVE** | Tracked & safe |
| `all-about-me/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `ARCHITECTURE_STANDARDS.md` | Documentation / Rule | ✅ | — | — | **LIVE** | Tracked & safe |
| `art-prompts/` | Folder | ✅ | — | — | **NEW / UNTRACKED** | New local folder/file (not yet committed to git) |
| `assets/` | Lesson / Game Module | ✅ | — | — | **MODIFIED** | Shared 3D packs, avatars (`student-*`), icons & audio |
| `audit-report/` | Folder | ✅ | — | — | **NEW / UNTRACKED** | New local folder/file (not yet committed to git) |
| `avatar-3d-studio/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `bamboozle/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `biome-crafter/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `brain/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `brain-explorers/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `brain-hackers/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `build/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `camp-mystery/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `cat-meme-posters/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `cat-vs-dog/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `city-mouse/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `clara-inventor/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `class-reset/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `classroom-instructions-challenge/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `creature-cafe/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `css/` | Platform Infrastructure | ✅ | — | — | **LIVE** | Tracked & safe |
| `detectives/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 8 tracked files missing on local disk — NEVER run git add -A! |
| `dino-arena/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `dino-dig/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `dino-expedition/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `directory.html` | HTML Entry Page | ✅ | — | — | **LIVE** | Tracked & safe |
| `docs/` | Platform Infrastructure | ✅ | — | — | **MODIFIED / UNPUSHED** | Has local modifications not yet pushed |
| `eco-engineers/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `egypt-project/` | Folder | ✅ | — | — | **LIVE** | Tracked & safe |
| `fantasy-creatures/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `favicon.ico` | Root File | ✅ | — | — | **LIVE** | Tracked & safe |
| `feelings/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `firefighter/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `forest-adaptation/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `forest-safari/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 16 tracked files missing on local disk — NEVER run git add -A! |
| `freeze-game/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `game-maker/` | Core App / World | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `games/` | Lesson / Game Module | ✅ | ✅ | ✅ | **NEW / UNTRACKED** | New local folder/file (not yet committed to git) |
| `good-ideas-lab/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `halloween-pet-shop/` | Lesson / Game Module | ✅ | — | ✅ | **LIVE** | Tracked & safe |
| `harvest-feast/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `home-view/` | Core App / World | ✅ | — | — | **LIVE** | Tracked & safe |
| `home3d/` | Lesson / Game Module | ✅ | — | — | **NEW / UNTRACKED** | New local folder/file (not yet committed to git) |
| `hq2.out` | Root File | ✅ | — | — | **LIVE** | Tracked & safe |
| `index.html` | HTML Entry Page | ✅ | — | — | **MODIFIED / UNPUSHED** | Has local modifications not yet pushed |
| `inventor-forge/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `inventor-lab/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `inventors-odyssey/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `island/` | Core App / World | ✅ | ✅ | ✅ | **NEW / UNTRACKED** | New local folder/file (not yet committed to git) |
| `island-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `js/` | Platform Infrastructure | ✅ | — | — | **MODIFIED / UNPUSHED** | Has local modifications not yet pushed |
| `jungle/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 16 tracked files missing on local disk — NEVER run git add -A! |
| `karaoke-stage/` | Core App / World | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `kenney-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `lesson-plans/` | Folder | ✅ | — | — | **LIVE** | Tracked & safe |
| `library-audit/` | Folder | ✅ | — | — | **LIVE** | Tracked & safe |
| `lingo-g3-u3-review/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `lingo-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `magic-book/` | Core App / World | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `manifest.json` | Root File | ✅ | — | — | **LIVE** | Tracked & safe |
| `meme-rules/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 10 tracked files missing on local disk — NEVER run git add -A! |
| `milestone-1000/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `monster day/` | Lesson / Game Module | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Required local mirror clone (`monster day/.../NH`) — gitignored, never push |
| `monster-day/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `monster-evolution/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `monster-lab/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 10 tracked files missing on local disk — NEVER run git add -A! |
| `monster-lab-3d/` | Lesson / Game Module | ✅ | — | — | **PARTIALLY DELETED LOCALLY** | 3 tracked subfiles deleted locally — stage carefully |
| `monster-studio/` | Core App / World | ✅ | — | — | **LIVE** | Tracked & safe |
| `monster-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `monsters/` | Folder | ✅ | — | — | **LIVE** | Tracked & safe |
| `mouse/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `mystery-of-yesterday/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `nasa-mission/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `neighbourhood/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `NH/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `ninja-trials/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `ocean-cleaners/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `part6_battle_flat_complete.zip` | Root File | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `passport/` | Core App / World | ✅ | — | ✅ | **LIVE** | Tracked & safe |
| `pharaoh-living-book.html` | HTML Entry Page | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `phonics/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `platform-art/` | Folder | ✅ | — | — | **LIVE** | Tracked & safe |
| `platform-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `pokemon/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `predictions/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `preposition-catapult/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `quaternius-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `quiz-briefing/` | Lesson / Game Module | ✅ | — | ✅ | **PARTIALLY DELETED LOCALLY** | 4 tracked subfiles deleted locally — stage carefully |
| `quiz-g3-units1-4/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `quiz-g4-units1-4/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `restaurant/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `review-g3-mountain/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `review-g3-museum/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `review-g3-time-book/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `review-g3-time-capsule/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `review-g4-show/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `review-g4-sound-detectives/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `review-g4-teamwork/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `review-unit4/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `revision-pack/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `revision-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `robots/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `school-subjects-challenge/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `scratch/` | Folder | ✅ | — | — | **LIVE** | Tracked & safe |
| `simon-says/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `SITE_MAP.md` | Documentation / Rule | ✅ | — | — | **LIVE** | Tracked & safe |
| `site-map/` | Platform Infrastructure | ✅ | — | ✅ | **LIVE** | Tracked & safe |
| `small-inventor/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `smart-board/` | Core App / World | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `smart-farm/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `solar-system/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `sound-detective/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `sound-detective-pro/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `space-cadet/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `speaking-g4/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `sql/` | Platform Infrastructure | ✅ | — | — | **LIVE** | Tracked & safe |
| `src/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `store-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `story/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `story-engine/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 106 tracked files missing on local disk — NEVER run git add -A! |
| `supabase/` | Platform Infrastructure | ✅ | — | — | **LIVE** | Tracked & safe |
| `supabase-mystery-boxes.sql` | Root File | ✅ | — | — | **LIVE** | Tracked & safe |
| `sw.js` | Root File | ✅ | — | — | **LIVE** | Tracked & safe |
| `talk-show/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `tea-party-cards/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 44 tracked files missing on local disk — NEVER run git add -A! |
| `teams/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `telephone-pictionary/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `time-machine/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `tools/` | Platform Infrastructure | ✅ | — | — | **LIVE** | Tracked & safe |
| `treasure/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `twin-gates/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `unit-1-diagnostic/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 2 tracked files missing on local disk — NEVER run git add -A! |
| `unit1-revision/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit12-revision-g4/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `unit12-worksheet-g4/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `unit2-arcade/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit2-forest-lessons/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit2-g3-cooking/` | Lesson / Game Module | ✅ | — | — | **LIVE** | Tracked & safe |
| `unit2-g3-lessons/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit2-print/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit2-revision/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit2-throw/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit3-arctic-homework/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `unit3-board-game/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit3-data/` | Folder | ✅ | — | — | **LIVE** | Tracked & safe |
| `unit3-g3-arctic-words/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit3-g3-lessons/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit3-g3-quiz/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `unit3-g3-word-city/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit3-g4-lessons/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit3-money-mission/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `unit3-shop/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit3-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `unit4-g3-angry-mountain/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `unit4-g3-lessons/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit4-g3-phonics-think/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `unit4-g4-lessons/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `unit4-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `unit5-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `watch-answer/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `we-are-the-story/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `week-song-g4/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `week4-g3-daphne/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `week4-g4-captain-quiet/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `week4-work/` | Folder | ✅ | — | — | **LOCAL-ONLY (NEVER PUSH)** | Local workspace / build / agent scratch folder — never publish |
| `welcome-to-wonderland/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `wildlife-detective/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 6 tracked files missing on local disk — NEVER run git add -A! |
| `wind-and-sun/` | Lesson / Game Module | ✅ | ✅ | ✅ | **LIVE** | Tracked & safe |
| `wizard-of-oz/` | Lesson / Game Module | ✅ | ✅ | — | **LIVE** | Tracked & safe |
| `wonderland/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `wonderland-lesson2/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `wonderland-lesson3/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `wonderland-story/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `wonderland-time-machine/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 7 tracked files missing on local disk — NEVER run git add -A! |
| `yesterday-detectives/` | Lesson / Game Module | ❌ | — | — | **MISSING LOCALLY (GIT DELETED)** | 1 tracked files missing on local disk — NEVER run git add -A! |
| `young-inventor/` | Lesson / Game Module | ❌ | — | ✅ | **MISSING LOCALLY (GIT DELETED)** | 8 tracked files missing on local disk — NEVER run git add -A! |
