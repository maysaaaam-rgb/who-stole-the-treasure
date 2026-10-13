# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are a senior children's game developer and a primary ESL teacher. Build ONE complete, polished classroom game called **"Alley Fling: Cats vs Dogs"** for my pupils (Grade 3 and Grade 4, ages 8 to 10, level A1). It is an aim-and-throw game: a cat on one side of a fence and a dog on the other side take turns throwing things at each other across the alley. **A team earns its throw by answering an English question from Unit 2.** The game is played on ONE classroom smartboard. There are NO pupil devices. Work through the whole job by yourself without asking me questions. I am away. If something fails, fix it, and note it in the log.

## Hard rules
- Write ONLY inside the new folder `C:\Users\maysa\Desktop\DV\unit2-throw\` (create it). Do NOT edit, move, rename or delete any other file. Do NOT run git. Do NOT edit `js/games-data.js` or any platform file; I will add the library card myself.
- You may READ any file in the project, especially: `unit2-arcade/index.html` and `unit2-arcade/data.js`, `bamboozle/index.html` and `bamboozle/data.js`, `unit2-revision/index.html`, and `simon-says/index.html`. These are my finished games. **Copy their style and their working code patterns** (kid-friendly look, 3D buttons, chord audio, speech, confetti, class roster loading, reaction stickers).
- Pure vanilla HTML, CSS and JavaScript in `index.html` (plus `data.js` if you need one). No libraries, no CDN, no internet, no build step. It must work offline from a local web server and from GitHub Pages.
- **NO TURKISH at all** anywhere (no Turkish words, no translation hints). Everything on screen and in speech is simple English.
- Everything must be kind and friendly. Funny, never scary or violent. No blood, no pain, no "kill / die / dead / hurt / weapon". Hits are silly: a soft "BONK!" bubble, little stars and a dizzy wobble.
- Pupils are never punished. No points are ever taken away. A wrong answer only means "try again", and after two wrong answers the turn simply passes, with a kind message and the correct answer shown.
- Pupils are identified by FIRST NAME ONLY (never full names).

## The game (what I want it to feel like)
A wide side-view alley scene. On the left a cat sits on a box next to a bin. On the right a dog sits next to a food bowl. A tall fence stands in the middle. At the top there is one long **Energy bar** per side (a friendly name for health), a **WIND** gauge (an arrow and a small meter), a **×2 Double** button and a **🛡️ Shield** button, like a classic Flash aim-and-throw game. **Do not copy any existing game's art, names or layout exactly. Make all of it original.**

### Turn flow (one turn, step by step)
1. A big banner says whose turn it is, for example "🐱 Cats: Mehmet, it's your turn!" and the pupil's first name is taken from that team's list (take turns down the list, then start again).
2. The **question card** pops up with large text (readable from the back of a classroom, at least 4vh font). Questions come from the Unit 2 banks (see "Questions" below). A 🔊 Hear button reads the question aloud. Listening questions play the sentence automatically once.
3. The team (with the pupil) chooses an answer. The teacher taps the answer on the smartboard.
   - **Right on the first try:** "Great!" and the pupil gets a **full-power throw**, and the team's **streak** goes up.
   - **Right on the second try:** the throw is allowed but gives a smaller bonus (no streak).
   - **Wrong the first time:** a gentle wobble, a soft chime and "Oops! Try again!" The wrong option is greyed out.
   - **Wrong the second time:** the correct answer is shown and read aloud, the turn passes to the other team with an encouraging line ("Good try! Next time!"). No throw.
4. After a correct answer the **aiming screen** appears: the pupil sets **angle** and **power** with two BIG controls (large sliders or a drag-and-release slingshot pull-back on the character. Make it work with a finger on a touch smartboard and with a mouse). A dotted preview line for the first part of the arc is shown. The wind pushes the object sideways, so aiming must account for it.
5. **FLING!** The object flies in an arc (simple physics: gravity plus wind), spins, and either:
   - **hits the other character:** silly "BONK!" bubble, stars, a short dizzy wobble, a funny reaction sound (chord based, see Audio), the Energy bar drops, and a cheerful reaction sticker pops up; or
   - **hits the fence or the ground:** a soft "thud" puff, a dust cloud and a "So close!" message. Nothing is lost.
6. The turn passes to the other team. The WIND changes (new direction and strength each turn).

Throwing objects (original and soft; show them as images, with the emoji fallback in brackets): the cat throws **yarn balls and fish** (🧶 🐟); the dog throws **tennis balls and bones** (🎾 🦴). Alternate or randomise them. On a hit also show a little whipped-cream splat or star burst.

### Energy, bonuses and winning
- Each side starts with 100 Energy. A normal hit takes 25. A **×2 Double** hit takes 50. A close hit (touching the character's edge) takes 10 ("Graze!").
- Each team starts with **one ×2 Double** and **one 🛡️ Shield**. Double: the next hit takes double energy, and the button greys out after use. Shield: the team ignores the next hit (a soft bubble pops). Teams also earn one extra Double after a **3-answer streak** (only once per game).
- When a side's Energy reaches 0, its character does a funny dizzy spin, sits down with a white flag and says "You win!" in a kind way, and the other side wins. A big confetti celebration, a victory chord and the winning team's list of names are shown. Then buttons: **Play again**, **Change settings**.
- **Hard rule:** at the end, ALWAYS be generous: show "Everyone played well!" with both teams cheering.
- Also add a **Round limit** mode so a game can never run too long: if neither side is at 0 after the chosen number of turns, the side with more Energy wins (a tie gives "It's a draw! Both teams win!").

### Levels and difficulty ramp
- Turns 1 to 3: easy questions, a short fence, weak wind.
- Turns 4 to 8: medium questions, a taller fence, medium wind.
- Turn 9 and later: harder questions, taller fence, stronger wind.
- The fence height and the wind range are shown clearly and change visibly between turns (animate the fence growing).

### Settings screen (before the game)
Big kid-friendly buttons:
- **Grade 3 / Grade 4** (also read `?grade=3` or `?grade=4` from the URL and pre-select it).
- **Length:** ⏱️ Short (6 turns each), ⌛ Normal (10 turns each), 🌟 Long (15 turns each).
- **Teams:** the cats and the dogs. Load the class list the same way my other games do (`window.opener.schoolStore` when opened from the platform, otherwise localStorage key `eaa_master_school_v6` with `classes`, `students`, `activeClassId`; study `simon-says/index.html` for the exact working code). Split the class randomly into two teams, show the names of each team, with a **🔀 Mix again** button and the option to type names (one per line) when no class list is found. First names only.
- **Question type mix:** everything, or only Words, only Sentences, only Listening (small optional chips).
- 🔊 sound on/off, 🎵 music on/off (soft looping chord pad, off by default), ⛶ fullscreen, ⬅ quit to the settings.

## Questions
- Use `unit2-arcade/data.js` (global `ARC`) and `bamboozle/data.js` (global `BQ`). Study their exact structure first. Load them with `<script src="../bamboozle/data.js">` and `<script src="../unit2-arcade/data.js">` (do NOT copy the data into your folder).
- Use `BQ[grade][2]` (Unit 2) as the main question bank. Fields: `s` (skill), `q` (question), `o` (options), `a` (answer), `say` (sentence to read aloud, for listening), `pic` (a picture or emoji), `big`, `pass` and `order` (a sentence-building question).
  - For questions with `order`: either support them with big tap-the-word tiles in order, OR skip them. Skipping is fine. Do not make a broken version.
  - Always shuffle options. Never show the same question twice in one game until the bank is used up.
- You may add a small extra pool of **Word to picture** questions from `ARC[grade].words` (use the emoji `e` and the word `w`): "Which word is the picture?" with 3 distractors from other words. Make sure the correct answer and the distractors are never identical.
- Difficulty tags: use the skill `s` to set difficulty: Listening and Words are easy; Sentences and Sounds are medium; Reading is hard.
- Protect against missing data: if a question has no options or no answer, skip it silently. No `undefined`, `null` or `NaN` is ever shown.

## Pictures (art)
I (not you) will generate the real cartoon pictures later with an image model. **Build the game so it works perfectly with emoji and CSS fallbacks right now, and automatically uses real pictures when they exist.** Do this:
- Look for these optional files in `unit2-throw/art/`. For each one, try to load it; if it is missing, use the fallback. Use a loader like the `memeFor` logic in `unit2-arcade/index.html`.
  - `cat.webp` (idle), `cat_throw.webp`, `cat_hit.webp`, `cat_win.webp`
  - `dog.webp`, `dog_throw.webp`, `dog_hit.webp`, `dog_win.webp`
  - `yarn.webp`, `fish.webp`, `ball.webp`, `bone.webp`
  - `bg.webp` (a 16:9 alley background: houses, a tall wooden fence in the middle, a bin and a box on the left, a dog bowl on the right)
- Fallbacks: a big 🐱 and 🐶 in a round sticker frame (thick outline, white inner ring, a little animated idle bob) and the emoji objects. The background fallback is a CSS-drawn alley (sky gradient, soft hills, a brown fence made from div planks, a grey ground band). Use only CSS shapes for scenery and objects. **Do not draw the characters with hand-made SVG paths.**
- Do NOT generate or fabricate fake image files. Only create code.
- Also reuse the reaction stickers I already have: `../bamboozle/memes/<animal>_<face>.webp` (animals: fox, frog, panda, lion, octopus, unicorn; faces: celebrate, cool, laugh, oops, thinking, sneaky, shocked). On a right answer show a random animal with `celebrate`, `cool` or `laugh`; on a wrong answer `oops` or `thinking`; on a hit `laugh` or `shocked`. Look at `memeFor` in `unit2-arcade/index.html` and copy it, including the emoji fallback and the caption (an Impact-style caption such as "BOOM!", "NICE ONE!", "OOPS!").

## Look and feel
- Kid-friendly and bright (Comic or Fredoka font, thick dark-purple outlines, bright sky colours, big rounded 3D buttons with a thick bottom lip that pushes down 4px on press with a springy bounce). This is a children's game, so **do not make it look like an admin dashboard or a dark SaaS app.**
- Smartboard first: everything is big. Minimum touch target 56px. Text readable from 8 metres. The whole game fits one screen with no page scrolling. It must work at 1920×1080, 1134×914, 1024×600 and 800×520.
- Always-visible top bar: team names with Energy bars, the WIND gauge, the ×2 and Shield buttons, and the 🔊 🎵 ⛶ and quit buttons. The question card and the aiming controls must never cover the Energy bars or the buttons that are needed at that moment.
- Idle animations: the characters bob gently; the cat flicks its tail, the dog wags its tail (CSS transforms on the fallback sticker are fine). The clouds drift. The fence grows with a bounce between levels.
- Add a short "3, 2, 1, GO!" countdown at the start.

## Audio (hard rules)
- **Web Audio only. NEVER a raw single-frequency beep.** Every sound is a chord or a soft two-tone chime built from two oscillators with an ADSR envelope (copy the `chord()` and `sfx()` helpers from `unit2-arcade/index.html`).
  - Correct: ascending C-major chord C5, E5, G5, C6.
  - Wrong: a warm descending two-tone sine chime (246.94 Hz then 220 Hz). Never a buzzer.
  - Fling: a soft "whoosh" (low-pass filtered noise sweep). Hit: a funny "boing-bonk" made from a quick falling chord plus a short noise tap. Thud on a miss: a soft low-pass noise burst. Win: a victory fanfare chord.
- Speech: `speechSynthesis` with `rate 0.88`, `pitch 1.05`, `lang "en-US"`. Create the audio context and speech ONLY after the first user tap or click (autoplay guard).
- Read each question aloud on a 🔊 button press (and automatically for listening questions). Read the correct answer aloud when a turn ends without a hit.

## Quality bar (do all of this before you tell me it is done)
1. Write the game. Then **run a real syntax check** on the JavaScript (for example copy the script into a `.js` file and run `node --check`, or load it with `new Function`). Fix every error.
2. **Play-test it yourself**, with automated clicks if you can run a browser or a headless script: play at least two full games (Grade 3 and Grade 4, short length) and make sure the game always ends, the Energy never goes below 0 or above 100, the turn always passes, no text shows `undefined`, `null` or `NaN`, and no button is hidden or covered at the four screen sizes listed above. If you cannot run a browser, check the logic carefully by reading it and by unit testing the physics and the turn engine in a Node script.
3. Check the aiming is fair: with a sensible angle and power the object must be able to clear the fence and reach the other character at every wind setting, and a very bad throw must clearly miss. Test a range of angles, powers and winds in a Node script and fix the physics so a good throw is always possible. The tallest fence must still be clearable.
4. Check that the fence never makes the game impossible to finish and that the "Round limit" winner logic works, including a draw.
5. Check that every question shown has exactly one correct answer that is among the options, that options never repeat, and that the right answer is not always in the same position.
6. Check that no Turkish text appears anywhere in the page.

## Deliverables
- `C:\Users\maysa\Desktop\DV\unit2-throw\index.html` (the complete game, opens with `?grade=3` or `?grade=4`)
- `C:\Users\maysa\Desktop\DV\unit2-throw\README.txt` with: the list of optional art files and the exact size and style each should be (so I can make them), a plain explanation of how the physics and the difficulty ramp work, and the list of things you tested.
- `C:\Users\maysa\Desktop\DV\unit2-throw\PROGRESS.txt` as a log of what you did and anything that failed.

## Final report (your last message, short)
Tell me: (1) what you built, (2) which tests you ran and the results, (3) anything you skipped or could not test and why (be honest), (4) the list of art files I can add later. Do not claim a test passed unless you really ran it.
