# 04 — Game Maker 2.0 (`game-maker/`)

> Back to [SITE_MAP.md](file:///C:/Users/maysa/Desktop/DV/SITE_MAP.md)  
> **Host Entry:** [game-maker/index.html](file:///C:/Users/maysa/Desktop/DV/game-maker/index.html) · **Local URL:** `http://localhost:8155/game-maker/index.html`

---

## 1. All 3 Playable Arcade Modes (`GM.modes.*`)

| Mode ID | Title | Source File & Line | Launch Query | Gameplay Summary |
| :--- | :--- | :--- | :--- | :--- |
| `tower` | 🏗️ **Tower Stack** | [mode-tower.js:L21](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-tower.js#L21) (374L) | `?game=tower` | Answer a question, then time the fast-swinging crane to stack blocks! Overhangs get sliced off permanently — hit a Perfect Drop to widen your tower! |
| `baseball` | ⚾ **Baseball** | [mode-baseball.js:L38](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-baseball.js#L38) (437L) | `?game=baseball` | Answer to step up to the plate, read the pitch type (Fastball, Curveball, Changeup), and time the fast swing bar — late or early swings Foul off or Strike Out! |
| `jigsaw` | 🧩 **Jigsaw Race** | [mode-jigsaw.js:L72](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-jigsaw.js#L72) (472L) | `?game=jigsaw` | Two teams race side-by-side to answer questions and snap 12 jigsaw pieces into place! |

---

## 2. Game Maker Core Engine & Support Files (16 JS files)

| File | Size | Lines | Cache `?v=` |
| :--- | :---: | :---: | :---: |
| [app.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/app.js) | 66.1 KB | 971 | `20261122b` |
| [audio.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/audio.js) | 15.8 KB | 185 | `20261121b` |
| [bank.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/bank.js) | 8.8 KB | 253 | `2` |
| [core.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/core.js) | 37.2 KB | 615 | `18` |
| [data.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/data.js) | 16.4 KB | 145 | `8` |
| [juice.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/juice.js) | 13.2 KB | 223 | `5` |
| [mode-baseball.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-baseball.js) | 17.3 KB | 437 | `8` |
| [mode-jigsaw.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-jigsaw.js) | 17.8 KB | 472 | `8` |
| [mode-tower.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-tower.js) | 14.8 KB | 374 | `8` |
| [monsters.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/monsters.js) | 6.8 KB | 161 | `9` |
| [revision.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/revision.js) | 19.7 KB | 249 | `6` |
| [sets-speaking.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-speaking.js) | 27.4 KB | 349 | `4` |
| [sets-unit4.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-unit4.js) | 9.2 KB | 162 | `2` |
| [sets-unit5.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-unit5.js) | 12.4 KB | 195 | `3` |
| [sets-units14.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-units14.js) | 7 KB | 121 | `2` |
| [teacher-tools.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/teacher-tools.js) | 10.5 KB | 153 | `2` |

---

## 3. All 89 Built-In Question & Speaking Sets (`GM.sets`)

| Set ID | Grade | Questions | Title |
| :--- | :---: | :---: | :--- |
| `mona-g3` | `3` | **40** | G3 · Unit 4 · Where Is She? (Mona Lisa) |
| `angry-g3` | `3` | **28** | G3 · Unit 4 · The Angry Mountain |
| `show-g4` | `4` | **29** | G4 · Unit 4 · Late for the Show |
| `moon-g3` | `3` | **14** | G3 · Unit 2 · Chuseok Moon Song |
| `halloween` | `All` | **20** | Special · Halloween Words & Verbs |
| `u4-g3` | `3` | **91** | Unit 4 · Grade 3 (What Happened? · Full Unit) |
| `u4-g4` | `4` | **55** | Unit 4 · Grade 4 (We Can Do It! · Full Unit) |
| `u4-g3-listen` | `3` | **5** | G3 U4 · Listening |
| `u4-g3-words` | `3` | **22** | G3 U4 · Words |
| `u4-g3-sounds` | `3` | **8** | G3 U4 · Sounds |
| `u4-g3-sentences` | `3` | **23** | G3 U4 · Sentences |
| `u4-g3-reading` | `3` | **33** | G3 U4 · Reading |
| `u4-g4-listen` | `4` | **5** | G4 U4 · Listening |
| `u4-g4-words` | `4` | **11** | G4 U4 · Words |
| `u4-g4-sounds` | `4` | **5** | G4 U4 · Sounds |
| `u4-g4-sentences` | `4` | **9** | G4 U4 · Sentences |
| `u4-g4-reading` | `4` | **25** | G4 U4 · Reading |
| `g3-u5-vocab` | `3` | **15** | G3 Unit 5 • Let's Go Back: Words |
| `g3-u5-timebook` | `3` | **11** | G3 Unit 5 • Reading 1: The Time Book |
| `g3-u5-capsules` | `3` | **14** | G3 Unit 5 • Time Capsules & Phonics (-nt) |
| `g3-u5-mega` | `3` | **40** | G3 Unit 5 • Let's Go Back (All 40 Qs) |
| `g4-u5-vocab` | `4` | **15** | G4 Unit 5 • Make Some Noise: Words |
| `g4-u5-foley` | `4` | **11** | G4 Unit 5 • Reading 1: The Art of Sound (Foley) |
| `g4-u5-beethoven` | `4` | **14** | G4 Unit 5 • Beethoven's 9th & Spelling (ou) |
| `g4-u5-mega` | `4` | **40** | G4 Unit 5 • Make Some Noise (All 40 Qs) |
| `u14-g3` | `3` | **40** | Units 1–4 Mix · Grade 3 (All 4 Units) |
| `u14-g4` | `4` | **40** | Units 1–4 Mix · Grade 4 (All 4 Units) |
| `speak-g3` | `3` | **30** | Grade 3 · Units 1–5 Easy Speaking & Acting |
| `speak-g4` | `4` | **30** | Grade 4 · Units 1–5 Easy Speaking & Acting |
| `speak-choice-g3` | `3` | **30** | Grade 3 · Units 1–5 Speaking Choice (All Units) |
| `speak-choice-g4` | `4` | **30** | Grade 4 · Units 1–5 Speaking Choice (All Units) |
| `speak-g3-u1` | `3` | **6** | G3 U1 · Easy Speaking & Acting (Inventions & Bridges) |
| `speak-g4-u1` | `4` | **6** | G4 U1 · Easy Speaking & Acting (Reading & Butterflies) |
| `speak-choice-g3-u1` | `3` | **6** | G3 U1 · Speaking Choice (What Do You Say? · Inventions) |
| `speak-choice-g4-u1` | `4` | **6** | G4 U1 · Speaking Choice (What Do You Say? · Reading) |
| `speak-g3-u2` | `3` | **6** | G3 U2 · Easy Speaking & Acting (Thank You & Moon Song) |
| `speak-g4-u2` | `4` | **6** | G4 U2 · Easy Speaking & Acting (Animals & Forest) |
| `speak-choice-g3-u2` | `3` | **6** | G3 U2 · Speaking Choice (What Do You Say? · Harvest) |
| `speak-choice-g4-u2` | `4` | **6** | G4 U2 · Speaking Choice (What Do You Say? · Animal Survivors) |
| `speak-g3-u3` | `3` | **6** | G3 U3 · Easy Speaking & Acting (How Much Is It? · Money) |
| `speak-g4-u3` | `4` | **6** | G4 U3 · Easy Speaking & Acting (Arctic & Clean Cars) |
| `speak-choice-g3-u3` | `3` | **6** | G3 U3 · Speaking Choice (What Do You Say? · Money) |
| `speak-choice-g4-u3` | `4` | **6** | G4 U3 · Speaking Choice (What Do You Say? · Arctic & Clean Cars) |
| `speak-g3-u4` | `3` | **6** | G3 U4 · Easy Speaking & Acting (Mona Lisa & Volcano) |
| `speak-g4-u4` | `4` | **6** | G4 U4 · Easy Speaking & Acting (Late for the Show & Teamwork) |
| `speak-choice-g3-u4` | `3` | **6** | G3 U4 · Speaking Choice (What Do You Say? · Mystery & Volcano) |
| `speak-choice-g4-u4` | `4` | **6** | G4 U4 · Speaking Choice (What Do You Say? · Teamwork & Show) |
| `speak-g3-u5` | `3` | **6** | G3 U5 · Easy Speaking & Acting (Time Book & Time Capsules) |
| `speak-g4-u5` | `4` | **6** | G4 U5 · Easy Speaking & Acting (Foley Studio & Beethoven) |
| `speak-choice-g3-u5` | `3` | **6** | G3 U5 · Speaking Choice (What Do You Say? · Time Book & Capsules) |
| `speak-choice-g4-u5` | `4` | **6** | G4 U5 · Speaking Choice (What Do You Say? · Make Some Noise) |
| `u1-g3` | `3` | **26** | Unit 1 · Grade 3 (What Does It Do?) |
| `u1-g3-listen` | `3` | **4** | G3 U1 · Listening |
| `u1-g3-words` | `3` | **5** | G3 U1 · Words |
| `u1-g3-sounds` | `3` | **4** | G3 U1 · Sounds |
| `u1-g3-sentences` | `3` | **9** | G3 U1 · Sentences |
| `u1-g3-reading` | `3` | **4** | G3 U1 · Reading |
| `u2-g3` | `3` | **60** | Unit 2 · Grade 3 (Thank You) |
| `u2-g3-listen` | `3` | **11** | G3 U2 · Listening |
| `u2-g3-words` | `3` | **12** | G3 U2 · Words |
| `u2-g3-sounds` | `3` | **10** | G3 U2 · Sounds |
| `u2-g3-sentences` | `3` | **17** | G3 U2 · Sentences |
| `u2-g3-reading` | `3` | **10** | G3 U2 · Reading |
| `u3-g3` | `3` | **60** | Unit 3 · Grade 3 (How Much Is It?) |
| `u3-g3-listen` | `3` | **11** | G3 U3 · Listening |
| `u3-g3-words` | `3` | **12** | G3 U3 · Words |
| `u3-g3-sounds` | `3` | **8** | G3 U3 · Sounds |
| `u3-g3-sentences` | `3` | **18** | G3 U3 · Sentences |
| `u3-g3-reading` | `3` | **11** | G3 U3 · Reading |
| `u1-g4` | `4` | **28** | Unit 1 · Grade 4 (I Love Reading) |
| `u1-g4-listen` | `4` | **4** | G4 U1 · Listening |
| `u1-g4-words` | `4` | **5** | G4 U1 · Words |
| `u1-g4-sounds` | `4` | **5** | G4 U1 · Sounds |
| `u1-g4-sentences` | `4` | **10** | G4 U1 · Sentences |
| `u1-g4-reading` | `4` | **4** | G4 U1 · Reading |
| `u2-g4` | `4` | **61** | Unit 2 · Grade 4 (What Lives Here?) |
| `u2-g4-listen` | `4` | **12** | G4 U2 · Listening |
| `u2-g4-words` | `4` | **12** | G4 U2 · Words |
| `u2-g4-sounds` | `4` | **10** | G4 U2 · Sounds |
| `u2-g4-sentences` | `4` | **17** | G4 U2 · Sentences |
| `u2-g4-reading` | `4` | **10** | G4 U2 · Reading |
| `u3-g4` | `4` | **60** | Unit 3 · Grade 4 (It Keeps Changing) |
| `u3-g4-listen` | `4` | **11** | G4 U3 · Listening |
| `u3-g4-words` | `4` | **12** | G4 U3 · Words |
| `u3-g4-sounds` | `4` | **8** | G4 U3 · Sounds |
| `u3-g4-sentences` | `4` | **18** | G4 U3 · Sentences |
| `u3-g4-reading` | `4` | **11** | G4 U3 · Reading |
| `smart-g3` | `3` | **20** | Smart Mix · Grade 3 (Spaced Repetition) |
| `smart-g4` | `4` | **20** | Smart Mix · Grade 4 (Spaced Repetition) |
