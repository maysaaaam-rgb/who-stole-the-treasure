# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are a senior children's game developer and a primary ESL teacher (A1 / A1+ learners, Grades 3 and 4, ages 8 to 10). Build ONE complete classroom game called **"Mimic Party"**: a whole-class listen-and-echo game that trains **intonation, rhythm and emotion**. It runs on ONE classroom smartboard. There are NO pupil devices and no internet. Work through the whole job by yourself without asking me questions. I am away. If something fails, fix it, note it in the log and continue.

## Hard rules
- Write ONLY inside the new folder `C:\Users\maysa\Desktop\DV\mimic-party\` (create it). Do NOT edit, move, rename or delete any other file. Do NOT run git. Do NOT edit `js/games-data.js` (I add the library card myself). Do NOT write to the `monster day\...\NH` mirror folder.
- Pure vanilla HTML, CSS and JavaScript. No libraries, no CDN, no internet, no build step, no Python, no scraping and no downloading of any audio. **Do not scrape Cambridge, Wikimedia or any website.** Everything must work offline from a local web server and from GitHub Pages.
- **NO TURKISH anywhere** (no Turkish words, no translation hints). Everything on screen is simple English.
- Kind and friendly only. Nobody is ever punished: no points are taken away, no red screens, no buzzers.
- Pupils are shown by FIRST NAME ONLY. No student data ever leaves the computer.
- Study these finished games first and copy their working patterns (kid-friendly look, chunky 3D buttons, chord-only sounds, speech settings, class roster loading, confetti, reaction stickers): `unit2-arcade/index.html`, `simon-says/index.html`, `unit2-throw/index.html` and `unit2-throw/gameplay.js` (team editing on the setup screen, the sticky START button), `unit2-throw/sfx.js` (the sound engine: reuse it by copying the file into your folder).
- Use my existing reaction stickers `../bamboozle/memes/<animal>_<face>.webp` (animals: fox, frog, panda, lion, octopus, unicorn; faces: celebrate, cool, laugh, oops, thinking, sneaky, shocked) with an emoji fallback, as `unit2-arcade/index.html` does (`memeFor`).

## The game (what it must do)
**Idea:** the board plays a short phrase. The class listens, then echoes it together, copying the *melody* (rising or falling), the *rhythm* and the *feeling*. The teacher judges the echo with one tap. This is choral speaking practice, so it must feel like a party, not a test.

### Round flow
1. **Listen:** a big card shows the phrase text, an emoji picture, and an animated **pitch contour line** (a smooth curve that rises or falls, a "melody ribbon" with a bouncing ball travelling along it as the phrase plays). Rhythm is shown as a row of beat dots, one dot per stressed syllable, that light up in time.
2. **Echo:** a big countdown "3, 2, 1, YOUR TURN!" then a glowing "Class echo!" banner while the class repeats it together.
3. **Rate:** the teacher taps one of three big buttons: ⭐ "Nice try" (1 star), ⭐⭐ "Good copy" (2 stars), ⭐⭐⭐ "Perfect party!" (3 stars). **Never a fail option.** There is also a soft "🔁 Again" button that replays the phrase and lets the class try once more for the same round.
4. A funny reaction sticker pops up, and the next round starts.

### Round types (mix them; teachers can switch types on or off)
1. **Echo Chamber:** one phrase, the class echoes it (the basic round above).
2. **Question or Statement?** The board plays a phrase with no punctuation shown. The class decides "question ↗" or "statement ↘" by tapping a big arrow on the board (teacher taps for the class), then echoes it. Teaches rising vs falling intonation.
3. **Feeling Faces:** the same short phrase (for example "Oh no!", "Wow!", "Really?") is shown with an emotion emoji (happy, surprised, sad, excited, sleepy). The class echoes it with that feeling. The phrase is spoken with a slightly different pitch and rate for each feeling.
4. **Rhythm Clap:** the phrase is shown as dots and syllables. The class claps the rhythm while echoing.
5. **Whisper or Shout:** same phrase, shown with a volume icon (whisper, normal, shout). The class echoes at that volume. (Visual only; the game does not measure the room.)
6. **Party Mix:** a random mix of all of the above.

### Modes and length
- **Teams or Whole Class.** Whole Class is the default: one shared star meter that fills toward a "Party!" celebration. Teams: up to 4 animal teams with names and a score, taking turns (copy the animal-team setup and the sticker animals from `unit2-arcade/index.html`).
- Lengths: ⏱️ Short (6 rounds), ⌛ Normal (10), 🌟 Long (16).
- Grade 3 or Grade 4 (also read `?grade=3` or `?grade=4` from the URL).
- Phrase sets: Unit 1, Unit 2, or Both (and a "Classroom Talk" set that is always available).
- **Pupil of the round:** from the class list (or typed names) show a fun name picker; that pupil is the "Party Leader" who says "3, 2, 1" and points at the class. First names only; copy the roster-loading code and the team-editing screen from `unit2-throw`.
- End screen: stars earned, the three phrases the class did best, up to three phrases to try again (each with a 🔊 button), a badge ("Melody Makers", "Rhythm Stars", "Feeling Experts"), confetti and "Everyone played well!". Buttons: Play again, New game, "Practise the tricky ones".

## The voice (very important)
Make **two voice sources**, so the game works well for any teacher:
1. **Browser voice (default, works offline):** `speechSynthesis` with `lang "en-US"`, `rate 0.88`, `pitch 1.05` as the base. For feelings and for question vs statement, vary `pitch` and `rate` slightly (for example happy pitch 1.25 rate 0.95, sad pitch 0.8 rate 0.78, excited pitch 1.35 rate 1.0, question pitch 1.2, statement pitch 0.95). Say clearly in the README that a browser voice cannot draw a true melody, so the on-screen contour ribbon is what shows the melody, and a recorded voice is better.
2. **Teacher recordings (best quality):** a **"🎙️ Record my voice"** screen. The teacher records every phrase herself, one at a time (big buttons: ● Record, ■ Stop, ▶ Play it back, 🔁 Redo, ➡ Next, ⏭ Skip), using `getUserMedia` and `MediaRecorder`. Store the recordings **only on this computer** in IndexedDB (inside try/catch, with a clear message if the browser blocks it). During the game, if a recording exists for a phrase, play it instead of the browser voice. Add a "🗑️ Delete my recordings" button and a progress line ("42 of 60 recorded"). Say clearly on the screen: "Recordings stay on this computer and are never uploaded." If the microphone is blocked or missing, show a friendly message and keep using the browser voice.
- Audio and speech start only after the first tap (autoplay guard). A 🔊 button replays the phrase at any time. A 🐢 "slow" button replays at a lower rate.
- All sound effects must be soft and pitched. Copy `unit2-throw/sfx.js` into `mimic-party/sfx.js` and add the sounds this game needs (a "drum roll" tick for the countdown, a "party popper", a gentle "ta-da" for 3 stars) in the same style: pitched notes, soft starts, no raw beeps, no buzzers, no hiss. Every button must play a clear tap sound the moment it is touched (see the global `pointerdown` handler at the end of `unit2-throw/gameplay.js`).

## The content: `mimic-party/data.js`
Write a complete phrase bank, no placeholders. **60 phrases per grade** (Grade 3 and Grade 4), covering Unit 1 and Unit 2 plus Classroom Talk, using only words and patterns the pupils already know. Read my data to stay inside the curriculum: `bamboozle/data.js` (global `BQ`), `unit2-arcade/data.js` (global `ARC`), `unit1-revision/revision-data.js` (global `DATA`), `simon-says/data.js`. Never invent facts about the textbook.

Every phrase object has all of these fields (the pedagogical metadata is required):
```js
{ id: 'g3_u2_017',            // unique
  text: 'There are two cats!', // 1.0 to 3.0 seconds when spoken at rate 0.88
  unit: 2,                     // 0 for Classroom Talk
  cefr: 'A1',                  // A1 or A1+
  category: 'statement',       // greeting | exclamation | polite request | question | statement | list | feeling | rhythm
  contour: 'rise-fall',        // rise | fall | rise-fall | fall-rise | flat | list (rise rise fall)
  curve: [0.45,0.6,0.8,0.7,0.45], // 5 to 8 numbers from 0 (low) to 1 (high): the pitch ribbon the board draws
  beats: [1,0,1,0,1],          // syllables: 1 = stressed beat, 0 = unstressed
  feeling: 'happy',            // happy | surprised | sad | excited | sleepy | calm
  volume: 'normal',            // whisper | normal | shout
  emoji: '🐱🐱',               // the picture on the card
  prompt: 'Point at two cats on the board.', // short classroom action for the Party Leader
  tip: 'Voice goes up on "two", then down.'   // one friendly line for the teacher
}
```
Balance the categories: about 10 greetings and polite requests, 10 exclamations and feelings (Wow! / Oh no! / Yes! / Really? / Great job!), 12 questions (rising, for example "Is it a frog?" and "Can you see it?"), 12 statements (falling), 6 lists ("a pen, a book, and a bag" with rise-rise-fall), and 10 rhythm chunks. Keep every phrase to 2 to 7 syllables so it fits 1.0 to 3.0 seconds. The text must be correct, natural English a child would really say. Each phrase must be speakable on its own.
- Make `curve` plausible: questions end high, statements end low, exclamations jump up then fall, lists rise-rise-fall.
- Add a small helper `PHRASES.estimateSeconds(text)` (about 0.28 seconds per syllable at rate 0.88) and a **"⏱ Check durations" page** (`mimic-party/check.html`) that speaks every phrase with `speechSynthesis`, measures the real time with `onstart` and `onend`, and prints a table with a green tick for 1.0 to 3.0 s and an orange mark outside it. Include a note that the numbers depend on the computer's voice.

## Look and feel
Bright, kid-friendly party style: confetti, balloons, a disco-ball banner, big rounded chunky 3D buttons (thick bottom lip, pushes down 4px on press with a springy bounce), Fredoka or Comic fonts, thick dark-purple outlines (#26215c), saturated colours. **Not a dark dashboard.** Everything big and readable from the back of the room: phrase text at least 6vh, buttons at least 56px, no page scrolling, no tiny text. It must work and look right at **1920×1080, 1134×417 (very wide and short), 1024×600, 800×520 and 1134×914**. The melody ribbon must be large, smooth and colourful, with a bouncing ball that follows it in time with the speech (use the measured or estimated duration). Keep animations calm (nothing vibrating or flashing fast); add a **Calm mode** toggle and respect `prefers-reduced-motion`.

## Files
- `mimic-party/index.html` (the game, with the setup screen, play screens, record screen and end screen)
- `mimic-party/data.js` (the two phrase banks and the helpers)
- `mimic-party/sfx.js` (the sound engine, copied and extended)
- `mimic-party/check.html` (the duration checker)
- `mimic-party/README.txt` (how to play, how to record the voice, how to edit phrases, the honest note about browser voices)
- `mimic-party/PROGRESS.txt` (your log)

## Quality bar: do not report "done" until all of this is true and really tested
1. Run a real syntax check on every script (`node --check` on extracted code, or `new Function`).
2. A Node script that validates every phrase in both banks: all fields present, unique ids, `text` has no Turkish characters or `undefined`, `curve` has 5 to 8 numbers in 0 to 1, `beats` has 2 to 7 items, syllable estimate within the 1.0 to 3.0 s window, categories balanced as described. Print real counts and fail loudly on any bad item.
3. **Run the game in a real browser** (a local web server plus headless Chrome through the DevTools protocol; see how `_tmp/throw-playall.js` style harnesses work, or write your own). Take screenshots of: the setup screen, a listen card with the ribbon, the echo banner, the rate buttons, each round type, the record screen, the end screen, at **1134×417** and **1920×1080** at least. Look at every screenshot carefully. Fix every overlap, cut-off, tiny text and hidden button. Save them in `mimic-party\screens\` and list them.
4. By script, check with `document.elementFromPoint` at the centre of every visible button, at all five screen sizes, that none is hidden, covered or off-screen.
5. Play, by automated clicks, a full game of each length in both grades and in both Whole Class and Teams modes. Confirm each finishes, scores never go negative or `NaN`, no `undefined` or `null` shows on screen, and there are no console errors.
6. Test the record screen as far as a headless browser allows (without a microphone it must show the friendly message and not crash).
7. Scan the whole folder for Turkish text: there must be none.

## Final report (short and honest)
Tell me: (1) what you built, (2) the real test results, (3) the screenshots you took and what you fixed because of them, (4) what you could not test (for example real microphone recording and the real sound of the voices) and why, (5) anything you skipped. Do not claim a test passed unless you really ran it.
