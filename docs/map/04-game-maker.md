# 04 — Game Maker 2.0 (`game-maker/`)

> Back to [SITE_MAP.md](file:///C:/Users/maysa/Desktop/DV/SITE_MAP.md)  
> **Host Entry:** [game-maker/index.html](file:///C:/Users/maysa/Desktop/DV/game-maker/index.html) · **Local URL:** `http://localhost:8155/game-maker/index.html`

---

## 1. All 22 Playable Arcade Modes (`GM.modes.*`)

| Mode ID | Title | Source File & Line | Launch Query | Gameplay Summary |
| :--- | :--- | :--- | :--- | :--- |
| `board` | 🔢 **Tile Board** | [mode-board.js:L39](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-board.js#L39) (272L) | `?game=board` | Pick a numbered tile. Answer the question. Some tiles hide power-ups and mystery surprises! |
| `plinko` | 🎃 **Plink-oh!** | [mode-plinko.js:L9](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-plinko.js#L9) (239L) | `?game=plinko` | Answer right to drop your pumpkin. It bounces through the pegs into a points slot! |
| `hunt` | 🔦 **Treasure Hunt** | [mode-hunt.js:L10](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-hunt.js#L10) (231L) | `?game=hunt` | Your monster digs a line of pumpkins to find hidden prizes. A right answer says how far! |
| `ttt` | ⭕ **Tic-Tac-Toe** | [mode-extra.js:L146](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-extra.js#L146) (2692L) | `?game=ttt` | Two teams. Answer right to put your monster on a square. Three in a row wins the round! |
| `connect4` | 🔴 **Connect 4** | [mode-extra.js:L193](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-extra.js#L193) (2692L) | `?game=connect4` | Two teams. Answer right to drop your monster disc. Connect four in a row to win! |
| `pass` | 🥔 **Pass the Bomb** | [mode-extra.js:L335](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-extra.js#L335) (2692L) | `?game=pass` | A ticking pumpkin passes from monster to monster! Answer right (+5) to toss it on. When it pops, every other team wins +10 Safe bonus points! |
| `bowling` | 🎳 **Bowling** | [mode-extra.js:L1324](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-extra.js#L1324) (2692L) | `?game=bowling` | Answer right, then time 3 skill steps: Stand Position, Launch Angle (at the lane arrows), and Fast Power + Hook! Hit the 1-3 or 1-2 pocket for a strike — hitting dead-center leaves a split! |
| `race` | 🏁 **Monster Race** | [mode-race.js:L8](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-race.js#L8) (79L) | `?game=race` | Every right answer is a boost. Your monster sprints down its lane. First over the finish line wins! |
| `cannon` | 🎯 **Monster Cannon** | [mode-cannon.js:L116](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-cannon.js#L116) (1478L) | `?game=cannon` | Answer right: your monster hops into the big cannon! Drag back to aim angle & power, launch across the meadow, pop balloons and land in the haystack! |
| `penalty` | ⚽ **3D Penalty Shootout** *(Three.js 3D)* | [mode-penalty.js:L967](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-penalty.js#L967) (2931L) | `?game=penalty` | Real 3D Stadium! Answer right to ignite your shot, then swipe the 3D ball with curve or lock onto Top-Bins targets! |
| `whack` | 🔨 **Whack-a-Word** | [mode-whack.js:L90](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-whack.js#L90) (997L) | `?game=whack` | Answer right, then whack ONLY the moles holding the target word! Build combos & crack 2-hit Boss Moles — whacking wrong decoy words stuns your hammer! |
| `tower` | 🏗️ **Tower Stack** | [mode-tower.js:L20](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-tower.js#L20) (373L) | `?game=tower` | Answer a question, then time the fast-swinging crane to stack blocks! Overhangs get sliced off permanently — hit a Perfect Drop to widen your tower! |
| `balloon` | 🎈 **Balloon Pop** | [mode-balloon.js:L19](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-balloon.js#L19) (257L) | `?game=balloon` | Read the question and pop the fast-weaving answer balloon before it escapes into the clouds — watch out for the Storm Bomb balloon! |
| `baseball` | ⚾ **Baseball** | [mode-baseball.js:L37](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-baseball.js#L37) (436L) | `?game=baseball` | Answer to step up to the plate, read the pitch type (Fastball, Curveball, Changeup), and time the fast swing bar — late or early swings Foul off or Strike Out! |
| `jigsaw` | 🧩 **Jigsaw Race** | [mode-jigsaw.js:L71](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-jigsaw.js#L71) (471L) | `?game=jigsaw` | Two teams race side-by-side to answer questions and snap 12 jigsaw pieces into place! |
| `snakes` | 🎲 **Snakes & Ladders** | [mode-snakes.js:L18](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-snakes.js#L18) (338L) | `?game=snakes` | Answer a question to roll the big dice, climb ladders, and race to the finish square! |
| `memory` | 🃏 **Memory Match** | [mode-memory.js:L93](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-memory.js#L93) (967L) | `?game=memory` | Flip two cards on the living tabletop to match a Question with its Answer, then read the full sentence aloud! |
| `fling` | 🐱 **Alley Fling** | [mode-fling.js:L145](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-fling.js#L145) (1657L) | `?game=fling` | True Cat vs Dog skill battle! Read the wind gauge, lock your throw angle, time the fast power bar (or pull the slingshot), dodge the patrolling wasp, and bonk your rival! |
| `boardgame` | 🎲 **Star Loop Board** | [mode-board3.js:L271](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-board3.js#L271) (1502L) | `?game=boardgame` | Roll the 3D dice, hop your monster around the 24-square Monopoly island, speak English to claim & upgrade properties, complete Color Sets, and trade with rival teams! |
| `storydice` | 🎲 **Story Dice** | [mode-storydice.js:L32](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-storydice.js#L32) (132L) | `?game=storydice` | Roll the dice, see the pictures, and make a sentence or a story with all of them. The teacher gives stars! |
| `bingo` | 🎯 **Bingo** | [mode-bingo.js:L9](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-bingo.js#L9) (126L) | `?game=bingo` | Listen to the clue and tap the answer on the big bingo board. Win squares and make a line of your colour! |
| `guesseroo` | 🕵️ **Guess-eroo** | [mode-guesseroo.js:L17](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-guesseroo.js#L17) (132L) | `?game=guesseroo` | A secret card is hidden. Ask yes/no questions out loud and cross out cards until your team knows what it is! |

---

## 2. Game Maker Core Engine & Support Files (32 JS files)

| File | Size | Lines | Cache `?v=` |
| :--- | :---: | :---: | :---: |
| [app.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/app.js) | 43.5 KB | 753 | `24` |
| [audio.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/audio.js) | 15.8 KB | 185 | `7` |
| [bank.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/bank.js) | 8.8 KB | 253 | `2` |
| [core.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/core.js) | 36.2 KB | 607 | `17` |
| [data.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/data.js) | 16.4 KB | 145 | `8` |
| [juice.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/juice.js) | 13.2 KB | 223 | `5` |
| [mode-balloon.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-balloon.js) | 9.8 KB | 257 | `8` |
| [mode-baseball.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-baseball.js) | 17.2 KB | 436 | `7` |
| [mode-bingo.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-bingo.js) | 7.7 KB | 126 | `2` |
| [mode-board.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-board.js) | 16.2 KB | 272 | `12` |
| [mode-board3.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-board3.js) | 62.8 KB | 1502 | `6` |
| [mode-cannon.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-cannon.js) | 50.6 KB | 1478 | `11` |
| [mode-extra.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-extra.js) | 102.9 KB | 2692 | `15` |
| [mode-fling.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-fling.js) | 62.7 KB | 1657 | `10` |
| [mode-guesseroo.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-guesseroo.js) | 9.2 KB | 132 | `2` |
| [mode-hunt.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-hunt.js) | 9.5 KB | 231 | `9` |
| [mode-jigsaw.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-jigsaw.js) | 17.8 KB | 471 | `7` |
| [mode-memory.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-memory.js) | 32 KB | 967 | `7` |
| [mode-penalty.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-penalty.js) | 122.3 KB | 2931 | `31` |
| [mode-plinko.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-plinko.js) | 9.8 KB | 239 | `9` |
| [mode-race.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-race.js) | 6.4 KB | 79 | `4` |
| [mode-snakes.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-snakes.js) | 13.5 KB | 338 | `6` |
| [mode-storydice.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-storydice.js) | 7.9 KB | 132 | `4` |
| [mode-tower.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-tower.js) | 14.7 KB | 373 | `7` |
| [mode-whack.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/mode-whack.js) | 34.5 KB | 997 | `8` |
| [monsters.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/monsters.js) | 6.6 KB | 161 | `9` |
| [revision.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/revision.js) | 17.2 KB | 225 | `5` |
| [sets-speaking.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-speaking.js) | 10.2 KB | 168 | `3` |
| [sets-unit4.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-unit4.js) | 9.2 KB | 162 | `2` |
| [sets-unit5.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-unit5.js) | 12.4 KB | 195 | `3` |
| [sets-units14.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/sets-units14.js) | 7 KB | 121 | `2` |
| [teacher-tools.js](file:///C:/Users/maysa/Desktop/DV/game-maker/js/teacher-tools.js) | 10.5 KB | 153 | `2` |

---

## 3. All 75 Built-In Question & Speaking Sets (`GM.sets`)

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
| `speak-g3` | `3` | **24** | Grade 3 · Units 1–4 Easy Speaking & Acting |
| `speak-g4` | `4` | **24** | Grade 4 · Units 1–4 Easy Speaking & Acting |
| `speak-g3-u1` | `3` | **6** | G3 U1 · Easy Speaking (Inventions & Bridges) |
| `speak-g4-u1` | `4` | **6** | G4 U1 · Easy Speaking (Reading & Butterflies) |
| `speak-g3-u2` | `3` | **6** | G3 U2 · Easy Speaking (Thank You & Moon Song) |
| `speak-g4-u2` | `4` | **6** | G4 U2 · Easy Speaking (Animals & Forest) |
| `speak-g3-u3` | `3` | **6** | G3 U3 · Easy Speaking (How Much Is It? · Money) |
| `speak-g4-u3` | `4` | **6** | G4 U3 · Easy Speaking (Arctic & Clean Cars) |
| `speak-g3-u4` | `3` | **6** | G3 U4 · Easy Speaking (Mona Lisa & Volcano) |
| `speak-g4-u4` | `4` | **6** | G4 U4 · Easy Speaking (Late for the Show & Teamwork) |
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
