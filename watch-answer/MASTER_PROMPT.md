# Universal AI Agent Master Prompt — Interactive Classroom Cinema & Video Learning Engine

Copy and paste the entire prompt below into your AI coding agent (Claude Code, Cursor, Antigravity, Windsurf, or GitHub Copilot) to build a complete, zero-dependency, smartboard-ready **Interactive Classroom Video & Movie Learning System** that works with any movies, episodes, or educational videos you provide.

---

# ROLE & OBJECTIVE
You are a Principal EdTech Game Architect, Lead UI/UX Designer, and ESL/Language Curriculum Engineer.
Build a complete, standalone, zero-dependency web application called **"Watch & Answer — Interactive Classroom Cinema"** (`watch-answer/`), designed for classroom smartboards, projectors, and student tablets.

The application transforms any movie clip, cartoon episode, or educational video (local `.mp4`/`.webm` files, Google Drive cloud streams, or custom teacher-loaded video files) into a 5-stage, 4-team competitive interactive language learning game show.

---

# 1. TECHNICAL STACK & ARCHITECTURE
- **Pure Vanilla Stack**: Semantic HTML5, modern CSS3 (Custom Properties, Grid/Flexbox, glassmorphism, 3D tactile buttons), and Vanilla ES6+ JavaScript. No external runtime frameworks (no React/Vue/npm build steps required) so it runs 100% offline or online directly in any browser.
- **File Structure**:
  - `watch-answer/index.html` — Single-page application shell with top bar, movie switcher tabs, 5-stage progress rail, video theatre stage, interactive overlay modals, live checkpoint editor drawer, and 4-team scoreboard bar.
  - `watch-answer/css/wa.css` — Full responsive smartboard styling (4-meter projector readability, dark cinema theatre theme `#070b16`, tactile 3D buttons with `border-bottom` depth bevels, animated overlays, and printable worksheet `@media print` styles).
  - `watch-answer/js/data.js` — Declarative `window.WATCH_DATA` array holding any number of movie/video lessons, each with video sources, bilingual subtitles, vocabulary cards, timed interactive stops (`mc` and `bet`), live word-catcher targets (`wordHunt`), chronological story retell beats (`retell`), and post-watch speaking prompts (`speak`).
  - `watch-answer/js/app.js` — Complete state machine, multi-source HTML5 `<video>` controller, WebVTT subtitle generator, Web Audio API procedural sound effects + TTS speech engine, `<canvas>` video snapshot extractor, 4-team scoreboard, and live teacher checkpoint editor.

---

# 2. MULTI-SOURCE SMART VIDEO ENGINE & CONTROLS
1. **Flexible Video Loading**:
   - **Tab Switcher**: Switch instantly between configured movies/videos in `WATCH_DATA`.
   - **Local + Cloud Fallback**: Attempt local video path first (`localVideo`), automatically fall back to cloud stream URL (`driveMp4`) if offline/missing, and provide a **"📁 Load Video File"** (`<input type="file" accept="video/*">`) button so teachers can load any `.mp4`/`.webm`/`.mkv` directly from their computer or USB drive at runtime using `URL.createObjectURL(file)`.
2. **Dynamic Dual-Language Subtitle Engine**:
   - Convert each lesson's `subtitles` array (`[startSec, endSec, "Target Language Line", "Native Translation Line"]`) into an in-memory `Blob` WebVTT (`text/vtt`) track attached to the `<video>` element.
   - Provide a **CC Toggle Button** (`EN + Translation` → `Target Language Only` → `CC Off`).
3. **Smart Teacher Playback Controls**:
   - Play/Pause (`Space`), `⏪ -5s` (`←`), `⏩ +5s` (`→`), **`⏭ Next Question`** button (jumps directly to `stop.t - 1.2s` of the next unanswered checkpoint), and Playback Speed selector (`0.75×`, `0.85×`, `1×`).
   - **Interactive Checkpoint Scrubber Bar**: Render color-coded clickable pins along the video timeline for every interactive stop (`?` for standard questions, `🔮` for freeze-bets, `✓` for completed stops).

---

# 3. THE 5-STAGE PEDAGOGICAL GAMEPLAY FLOW

## Stage 1: 🔮 Before Watching (Prediction & Pre-Teach Vocabulary)
- **Pre-Watch Prediction Card**: Display a curiosity-sparking question before the video starts with 3 clickable prediction choices (`a`, `b`, `c`) plus a **"💬 Different Idea (Free Speaking)"** button that reveals a scaffolded speaking sentence frame (`"I think ___ will ___ because ___."`) and awards team stars.
- **Interactive Vocabulary Deck**: Grid of key vocabulary cards for the movie (`word`, `tr` translation, `emoji`, `def` definition, and `ex` example sentence from the film). Clicking any card speaks the word and example aloud via `window.speechSynthesis` (`rate: 0.9`, `lang: 'en-US'`).

## Stage 2: 🎬 Watch & Stop (3 Interactive Mechanics During Playback)
While the video plays, monitor `video.currentTime` at `250ms` intervals and run three real-time classroom mechanics:

### Mechanic A — Standard Timed Comprehension Stops (`kind: 'mc'`)
- At timestamp `stop.t`, pause the video, exit fullscreen if needed, play a soft attention chime, and slide up an interactive question card over the paused video frame.
- Include:
  - **🔊 Read Question** button (TTS).
  - **⏪ Replay Scene** button (rewinds smoothly to `stop.rewindTo` and plays up to `stop.t` so students can re-watch the clue).
  - **💡 Hint** toggle (reveals `stop.hint` + optional native translation).
  - **3 Large Tactile Answer Choices (`A`, `B`, `C`)**:
    - **Soft-Fail Rule**: Wrong choices wobble elastically (`translateX`) with a gentle low two-tone chime and never deduct points.
    - **Correct Choice**: Highlights green, plays an ascending polyphonic victory chord, reveals the grammar/story explanation (`stop.explain`), and displays one-tap **`+1 ⭐ [Team Name]`** buttons to award points and resume the movie (`▶ Continue Watching`).

### Mechanic B — 🔮 "What Happens Next?" 4-Team Freeze-Bet Mode (`kind: 'bet'`)
- At high-suspense cliffhanger moments (e.g., right before a jump, crash, reveal, or funny twist), freeze the video frame (`stop.kind === 'bet'`).
- Display a **🔮 WHAT HAPPENS IN THE NEXT SECOND?** Freeze-Bet overlay:
  - Render a **4-Team Prediction Matrix**: Each of the 4 classroom teams independently locks in option `A`, `B`, or `C` before the scene resumes.
  - Show a prominent **`▶ Play Next 7 Seconds & Reveal!`** button.
  - When clicked, hide the modal, resume the video for `stop.revealDuration` seconds (e.g., `7s`) with a live floating countdown badge (`🔮 Revealing scene... 7s`) so the whole class watches the real outcome unfold on screen.
  - Automatically re-pause after the reveal window, highlight the winning option, and provide a one-tap **`🏆 Pay +2 ⭐ to Winning Teams & Continue`** button (automatically awarding **Double Stars `+2 ⭐`** to every team that predicted correctly!).

### Mechanic C — 🔔 Live Word-Catcher Buzzer (`wordHunt` Radar)
- Display a live **Word-Catcher Radar Bar** directly beneath the video player listing 5–6 target words from the movie (each with its timestamp window `[startSec, endSec]`, emoji, and quote).
- When `video.currentTime` enters a target word's active window (`t - 1.5s` to `tEnd + 2.5s`), light up that word chip in pulsing gold (`🔔 CATCH NOW!`) and activate 4 Team Buzzer buttons (also bound to keyboard hotkeys `F`, `O`, `B`, `H` for Teams 1–4).
- The first team to buzz in while a word is active catches the word, triggers confetti/sound effects, marks the word as caught by that team, and earns **`+1 ⭐`**. Teachers can also click any word chip at any time to manually trigger a catch or jump to that scene.

## Stage 3: 🧩 Story Retell (Chronological Scene Sequencing with Real Video Snapshots)
- Present 4–5 key story beats (`retell` array with `order`, `t` timestamp, `text`, `tr`, `emoji`) in shuffled order.
- **Automatic `<canvas>` Video Frame Extraction**:
  - When a local/CORS-enabled video is loaded, automatically spin up an offscreen `<video>` + `<canvas>` (`320×180`), seek to each `retell[i].t` timestamp, capture a real JPEG frame snapshot (`canvas.toDataURL('image/jpeg', 0.78)`), and display the actual movie scene thumbnail inside each draggable/clickable story card!
  - Include a **"📸 Capture Scene Photos from Video"** button so teachers can re-extract snapshots anytime.
- Students tap cards in chronological order (`1st → 2nd → 3rd → 4th → 5th`) to rebuild the plot, with TTS audio playback on every placed card and `+2 ⭐` team rewards upon completion.

## Stage 4: 🗣️ Talk About It (Scaffolded Speaking & Roleplay)
- Provide 3–4 post-watch speaking cards (`question`, `tr`, `starter` sentence frame with blanks, `model` full example answer, `emoji`).
- Include **🔊 Question**, **🔊 Starter**, and **🔊 Model Answer** TTS buttons on every card, plus one-tap **`+1 ⭐`** team buttons to reward students who speak in full sentences.

## Stage 5: 🏆 Winner Podium & Printable Worksheet
- Display a ranked 4-team championship podium with confetti/fanfare, total questions answered, and a **🖨️ Print Worksheet** button (`window.print()`) that formats the lesson's vocabulary, questions, retell sequence, and speaking prompts into a clean black-and-white student handout.

---

# 4. BUILT-IN TEACHER LIVE CHECKPOINT EDITOR (`✏️ Edit Questions`)
Include a slide-over drawer (`#wa-editor-drawer`) so teachers can customize any video without touching code:
- **➕ Add Question at Current Video Time**: Pauses the video at `Math.floor(video.currentTime)` and creates a new checkpoint right at that scene.
- Edit timestamp (`mm:ss`), rewind timestamp, checkpoint type (`Standard Question` vs `🔮 Freeze-Bet`), question text, hint, explanation, options `A/B/C`, and correct answer radio button.
- **Persistence**: Save custom edits to `localStorage` (`wa_custom_stops_v1`), support **↺ Reset to Default**, and provide **📋 Copy JSON** so teachers can paste newly created checkpoints permanently into `js/data.js`.

---

# 5. SOUND DESIGN (ZERO-DEPENDENCY WEB AUDIO API)
Synthesize all classroom sound effects procedurally using `AudioContext` (initialized on first user gesture):
- **Correct Answer / Star Awarded**: Ascending C-Major pentatonic arpeggio ($C_5 \to E_5 \to G_5 \to C_6$) using triangle/sine oscillators with smooth exponential decay.
- **Soft-Fail Try Again**: Gentle descending two-tone sine chime ($250\text{ Hz} \to 210\text{ Hz}$) — never harsh buzzers.
- **Checkpoint Popup**: Warm dual-tone notification chime ($523\text{ Hz} \to 659\text{ Hz}$).

---

# 6. DATA SCHEMA (`js/data.js`) FOR ADDING ANY MOVIE OR VIDEO
Structure `window.WATCH_DATA` so adding a new movie or video lesson requires only appending a single object with this schema:
```javascript
{
  id: 'my-movie-slug',
  title: 'Movie or Episode Title',
  subtitle: 'Grammar / Vocabulary Focus • Target Grade',
  grade: 'Grades 3–5 • A1/A2',
  duration: '12:00',
  emoji: '🎬',
  accent: '#38bdf8',
  localVideo: 'videos/my-movie.mp4',
  driveMp4: 'https://...', // optional cloud fallback
  predict: {
    question: 'Look at the title and opening scene! What do you think will happen?',
    tr: 'Optional native language translation',
    options: [
      { id: 'a', text: 'Prediction option A', emoji: '🚀' },
      { id: 'b', text: 'Prediction option B', emoji: '🕵️' },
      { id: 'c', text: 'Prediction option C', emoji: '🎉' }
    ],
    freePrompt: 'I think ___ will ___ because ___.',
    answerExplain: 'Every prediction is welcome! Watch closely to see who is right.'
  },
  vocab: [
    { word: 'rescue', tr: 'translation', emoji: '🛟', def: 'To save someone from danger.', ex: 'They work together to rescue their friend.' }
  ],
  wordHunt: [
    { id: 'wh1', word: 'rescue', tr: 'translation', emoji: '🛟', t: 45, tEnd: 52, quote: 'We need to rescue him right now!' }
  ],
  subtitles: [
    [10, 15, 'Target language subtitle line', 'Optional translation line']
  ],
  stops: [
    {
      id: 'q1',
      t: 35,
      rewindTo: 24,
      kind: 'bet', // 'mc' for standard question OR 'bet' for 4-Team Freeze-Bet ("What happens next?")
      revealDuration: 7, // seconds to play before re-pausing to reveal the bet winner
      phase: 'What Happens Next?',
      question: 'FREEZE BET! What is going to happen in the next 5 seconds?',
      tr: 'Optional translation',
      hint: 'Look at what the character is holding!',
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' }
      ],
      correct: 'b',
      explain: 'Explanation shown after the scene reveals the answer!'
    }
  ],
  retell: [
    { order: 1, t: 15, text: 'First key event in the story.', tr: 'Translation', emoji: '1️⃣' },
    { order: 2, t: 60, text: 'Second key event in the story.', tr: 'Translation', emoji: '2️⃣' },
    { order: 3, t: 120, text: 'Third key event in the story.', tr: 'Translation', emoji: '3️⃣' },
    { order: 4, t: 180, text: 'Final key event in the story.', tr: 'Translation', emoji: '4️⃣' }
  ],
  speak: [
    {
      emoji: '🎤',
      question: 'Which part of the video was your favorite, and why?',
      tr: 'Translation',
      starter: 'My favorite part was when ___ because ___.',
      model: 'My favorite part was when the team worked together because it was exciting.'
    }
  ]
}
```

---

# 7. DELIVERABLES
1. Generate the complete `watch-answer/index.html`, `watch-answer/css/wa.css`, `watch-answer/js/data.js` (pre-populated with 2–3 sample movie/video lessons demonstrating all mechanics), and `watch-answer/js/app.js`.
2. Verify JavaScript syntax with `node --check`.
3. Ensure every interactive element is keyboard-accessible and touch/smartboard-friendly from 4 meters away.
