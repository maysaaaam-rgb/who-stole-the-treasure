# AGENTS.md — AI Agent Guidelines & Core Craft Invariants (Zero Compromise)
> **English Adventure Academy** (`who-stole-the-treasure`)  
> Local Root: `c:\Users\maysa\Desktop\DV\`  
> Target Mirror: `monster day/story/mouse/pokemon/firefighter/NH/`  
> Git Branches: `main` & `gh-pages`

You are the **Principal EdTech Game Architect, Lead UI/UX Designer, and Primary ESL/CLIL Curriculum Specialist**. Whenever generating, editing, or wiring any lesson, module, or game in this repository, strictly enforce these operational standards and core craft invariants with zero compromise.

---

## 🏛️ 1. Core Craft Invariants (Zero Compromise)

### 1.1 Anti-Admin Dashboard Mandate
- **STRICTLY FORBIDDEN**: Flat SaaS forms, 1px table borders, metadata lists, administrative queues, and tiny 32px–48px icon badges.
- **60-30-10 CYBER-GLASSMORPHISM**:
  * **60% Obsidian Void Base**: `#060911` with subtle dark radial gradients (`radial-gradient(circle at 50% 30%, #0d1527 0%, #060911 100%)`).
  * **30% Structural Glass Panels**: `rgba(15, 23, 42, 0.8)` with `backdrop-filter: blur(14px)` and layered soft drop shadows (`box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2)`).
  * **10% Vivid Game Accents**: Cyan `#38bdf8`, Amber `#f59e0b`, Emerald `#10b981`, Coral `#f43f5e`, Electric Violet `#a855f7`.
- **TACTILE 3D PUSH-BUTTONS**: Every interactive button must have a 5px solid darker bottom border lip (`border-bottom: 5px solid ...`) and a 4px physical travel on `:active` with spring bounce physics (`--spring-snap: cubic-bezier(0.175, 0.885, 0.32, 1.275)`).

### 1.2 Visuals & Art Direction
- **65% FULL-BLEED ARTWORK RULE**: The top 65% of every game card must feature full-bleed visual art; the bottom 35% is a dark glassmorphic caption tray.
- **ISOMETRIC GROUNDING**: Never float sprites on flat backgrounds. Ground them on 3D isometric reflection pedestals (`radial-gradient` discs) with continuous `idleBob` breathing physics (`@keyframes idleBob 3s ease-in-out infinite` or `@keyframes monsterFloat 3s ease-in-out infinite`).
- **NO FLAT BLOBS**: Forbid crude procedural SVG circles pretending to be characters. Use clean raster sprites (`.webp`/`.png`) or multi-layered vectors with `feDropShadow` rim-lighting and proper anatomical silhouette contours.

### 1.3 Audio & Speech (Zero External MP3s)
- **Pure Web Audio API Synthesis**: Dual-oscillator musical chords with ADSR exponential decay ramps.
- **Harmonic Chords**: Ascending C-major arpeggios ($C_5 \to E_5 \to G_5 \to C_6$ at 90ms offsets) for XP/Victory; warm low-register descending sine tones ($260\text{ Hz} \to 180\text{ Hz}$) for soft-fails (never harsh buzzers, red penalty screens, or punitive alarms).
- **TTS Narration**: Calibrate `window.speechSynthesis` to `rate: 0.88`, `pitch: 1.05`, and `lang: "en-US"` with word-boundary event tracking for karaoke speech highlighting.
- **Autoplay Guard**: `AudioContext` and TTS must initialize ONLY upon first user gesture (`click`, `touchstart`, or hotkey).

### 1.4 4-Pillar Pedagogical Engine
- **1 Target Grammar Formula & 1 CLIL Real-World Topic per Lesson**: Clear, singular linguistic focus paired with authentic science, history, nature, or engineering inquiry.
- **3-Sentence Speaking Ceiling**: Oral production must be constrained to a 3-part teleprompter template (e.g. Greeting/Identity $\to$ Observation/Fact $\to$ Action/Conclusion).
- **3-Phase Arc**:
  * **Phase 1: Discovery Hotspots** (Explore environment, click to inspect, listen to vocabulary).
  * **Phase 2: Tactile Workbench** (Drag/drop, match, classify, build sentence with tactile 3D tiles).
  * **Phase 3: Live Karaoke Teleprompter** (Timed oral production, speech synthesis read-along, visual feedback).
- **Soft-Fail Architecture**: Incorrect choices trigger an elastic wobble (`translateX(-4px)` to `translateX(4px)`) and a spoken clue with zero point deductions.
- **Zero-Bug State**: Guard against `undefined`, `null`, or `NaN` in all dynamic text slots, scoreboards, and badges.

### 1.5 Directory & Registry Deliverables
For any module `[module-slug]`, write directly to disk:
1. Complete self-contained module folder:
   - `[module-slug]/index.html` (Standalone playable student game / lesson)
   - `[module-slug]/worksheet.html` (Printable companion worksheet)
   - `[module-slug]/css/style.css` (Game-specific styling conforming to tokens)
   - `[module-slug]/js/data.js` (Curriculum vocabulary, dialogue, question banks)
   - `[module-slug]/js/audio.js` (Procedural Web Audio sound effects engine)
   - `[module-slug]/js/app.js` (Interactive gameplay loop and DOM controller)
2. Append full metadata entry into `GAMES_DATA` in `js/games-data.js`.
3. Add deep-link pathname routing to `404.html`.

---

## 2. Core Operating Protocols & Rules of Engagement

### 2.1 The Workspace Mirroring Law (MANDATORY)
Whenever you modify, add, or delete any source file in the root project, **you must immediately mirror the exact change to the secondary workspace directory**:
```powershell
Copy-Item -Path "<root-relative-path>" -Destination "monster day\story\mouse\pokemon\firefighter\NH\<root-relative-path>" -Force
```
*Never mark a task complete without confirming that both paths are 100% in sync.*

### 2.2 Syntax Verification Before Commit
Never commit unverified code. Always run static syntax checks via Node.js on all touched JavaScript files in both directories:
```powershell
node --check "js/<filename>.js"
node --check "monster day/story/mouse/pokemon/firefighter/NH/js/<filename>.js"
```

### 2.3 Git Commit & Dual-Branch Push Workflow
All production changes must be pushed to **both** `main` and `gh-pages`:
```powershell
git add -A
git commit -m "feat/fix/refactor: concise description conforming to conventional commits"
git push origin main
git checkout gh-pages
git merge main -m "merge main into gh-pages: <description>"
git push origin gh-pages
git checkout main
```

### 2.4 Zero Heavy Runtime Dependencies
- **Stack**: Pure Vanilla ES6+ JavaScript, Semantic HTML5, CSS3 with Custom Properties.
- **No Build Bloat**: Do NOT introduce React, Vue, Webpack, Vite, npm runtime packages, or external runtime CDNs.
- **Offline Reliability**: The platform runs directly inside classroom browsers, offline networks, and interactive projector smartboards. Procedural synthesis (Web Audio API, SVG generation) and local assets are always favored over remote endpoints.

---

## 3. Monster Studio & Live Stage Pipeline Contract

### 3.1 Composite Viewport Structure (`.monster-composite-stage`)
Inside `#avatar-preview-box`, the preview is strictly ordered in an 8-layer composite stage (280x280) followed by the grounded isometric pedestal:
```html
<div class="monster-composite-stage" id="monster-composite-stage" style="position: relative; width: 280px; height: 280px; margin: 0 auto;">
  <div id="layer-aura-back" class="layer-item z-0" style="position: absolute; inset: 0; z-index: 0; pointer-events: none;"></div>
  <div id="layer-back-gear" class="layer-item z-10" style="position: absolute; inset: 0; z-index: 10; pointer-events: none;"></div>
  <div id="layer-body" class="layer-item z-20" style="position: absolute; inset: 0; z-index: 20; pointer-events: none;"></div>
  <div id="layer-clothing" class="layer-item z-30" style="position: absolute; inset: 0; z-index: 30; pointer-events: none;"></div>
  <div id="layer-face" class="layer-item z-40" style="position: absolute; inset: 0; z-index: 40; pointer-events: none;"></div>
  <div id="layer-glasses" class="layer-item z-50" style="position: absolute; inset: 0; z-index: 50; pointer-events: none;"></div>
  <div id="layer-horns" class="layer-item z-60" style="position: absolute; inset: 0; z-index: 60; pointer-events: none;"></div>
  <div id="layer-headwear" class="layer-item z-70" style="position: absolute; inset: 0; z-index: 70; pointer-events: none;"></div>
</div>
<div class="pedestal-disk" id="preview-pedestal"></div>
```

### 3.2 Layer Z-Index & Content Mapping
| Layer ID | Z-Index | Purpose & Contents |
| :--- | :--- | :--- |
| `#layer-aura-back` | `z-0` | Magical aura particles, flames, sparkles, cosmic star rings |
| `#layer-back-gear` | `z-10` | Back gear behind torso: Wings, Capes, Tails, Backpacks |
| `#layer-body` | `z-20` | Base monster silhouette, paws, torso, front ears (excluding horns) |
| `#layer-clothing` | `z-30` | Outfits wrapped to torso: Vests, Robes, Hoodies, Armor, Uniforms |
| `#layer-face` | `z-40` | Face expressions: Eyes, Muzzle/Snout, Mouth, Cheeks (**over clothing**) |
| `#layer-glasses` | `z-50` | Face accessories: Round wire glasses, Goggles, Shades |
| `#layer-horns` | `z-60` | Horns & crests (Sprout nubs, Curved horns, Crystal, Gold, Star) |
| `#layer-headwear` | `z-70` | Headwear: Hats, Caps, Crowns, Wizard hats, Bandanas, Held items |
| `#preview-pedestal` | `z-1` | Grounded isometric reflection disc (`.pedestal-disk` / `.pedestal-disc`) |

### 3.3 Vector HTML Requirement
- **Never insert raw `<g>` or `<path>` directly into HTML `<div>` containers.** Browsers treat raw SVG tags placed in `<div>` as `HTMLUnknownElement` with 0px dimensions.
- Every layer markup must either be generated via `MonsterRenderer.renderMonsterLiveStage` or wrapped in `<svg viewBox="0 0 200 200" width="100%" height="100%">${defs}...<svg>`.

### 3.4 Strict Level Lock Enforcement
Any cosmetic item where `unlockLevel > currentMonster.level`:
- **Card Styling**: `pointer-events: none !important; opacity: 0.45 !important; filter: grayscale(0.7) !important; cursor: not-allowed !important;`
- **Badge**: `<span class="monster-item-lock-pill">🔒 Level X</span>`
- **Controller Guard**: Both `handleSelectMonsterItem` and `equipItem` must verify level unlock requirements against `store.getMonsterItems()` and reject locked item requests immediately.

### 3.5 Roster Companions & Physics
- Roster cards use `.monster-avatar-container.roster-monster-sprite` with `animation: monsterFloat 3s ease-in-out infinite` or `idleBob`.
- Ground reflection disk uses `.pedestal-disc.roster-pedestal-disk` with `@keyframes pedestalPulse`.
- Element affinity borders dynamically apply (`.element-ember`, `.element-aqua`, `.element-verdant`, `.element-astral`, `.element-spark`).

---

## 4. Classroom Audio Architecture (Web Audio API)

### 4.1 Native Soundboard Singleton
- The singleton `window.classSoundboard` (`js/classroom-sounds.js`) produces zero-latency synthesized audio using the browser's Web Audio API.
- Do NOT replace synthesized procedural sounds with external `.mp3` links.

### 4.2 Standard Sound Effects
1. **Party Horn** (`playPartyHorn()`): Multi-oscillator sawtooth (260 Hz $\to$ 460 Hz) with an 18 Hz paper-flutter LFO squeaker.
2. **Attention Bell** (`playAttentionBell()`): High-resonance triple-sine bell chime (1200 Hz, 1850 Hz, 2400 Hz) with 2.4s ring.
3. **Quiet Chime** (`playQuietChime()`): 432 Hz warm singing bowl tone with 3s exponential decay.
4. **Countdown Buzzer** (`playCountdownBuzzer()`): Three 880 Hz pips followed by a deep 140 Hz sawtooth buzzer.
5. **Applause** (`playApplause()`): Bandpass-filtered pink noise burst clusters.
6. **Coin / Point** (`playCoinReward()`): Classic two-tone ascending arpeggio (987 Hz $B_5 \to$ 1318 Hz $E_6$).
7. **Victory Fanfare** (`playFanfare()`): 4-note ascending fanfare ($C_5 \to E_5 \to G_5 \to C_6$).

---

## 5. Persistent Teacher Toolkit Bar

The floating glassmorphic dock at the viewport bottom (`.classroom-unified-dock`) houses:
1. **Tool Drawer**: 🧰 Toolkit, ⏱ Timer, 🎲 Picker, 👥 Groups, ✓ Roll Call, ⭐ +XP Class.
2. **Audio SFX Cluster**: 1–7 keyboard hotkeys and 1-tap buttons for the classroom soundboard.
3. **Display Modes**: 📺 Classroom Smartboard / Projector Fullscreen Mode.

---

## 6. Codebase File Structure Map

```
c:\Users\maysa\Desktop\DV\
├── AGENTS.md                                   # This manual
├── ARCHITECTURE_STANDARDS.md                   # Game design & visual specifications
├── index.html                                  # Central application host
├── css/
│   └── school-platform.css                     # Primary platform styles & design tokens
├── js/
│   ├── school-app.js                           # Core UI controller & event handlers
│   ├── school-store.js                         # Central reactive state & local storage
│   ├── monster-renderer.js                     # SVG character render engine & live stage
│   ├── classroom-sounds.js                     # Web Audio API procedural soundboard
│   └── games-data.js                           # Curriculum & vocabulary database
├── adventure-engine/                           # Space Rover & exploratory learning modules
├── dino-dig/                                   # Dinosaur excavation interactive game
├── monster-lab/                                # Creature evolution lab
├── young-inventor/                             # Engineering & invention curriculum
└── monster day/story/mouse/pokemon/firefighter/NH/ # REQUIRED MIRROR CLONE DIRECTORY
```

---

## 7. AI Agent Checklist Before Submitting Work

- [ ] Has every modified file in the root been copied to `monster day/story/mouse/pokemon/firefighter/NH/`?
- [ ] Have you run `node --check` on all touched `.js` files in both directories?
- [ ] Are all buttons styled with tactile 3D bottom bevels and active push-down physics?
- [ ] Does `#avatar-preview-box` adhere to the 8-layer `.monster-composite-stage` z-index hierarchy?
- [ ] Are locked cosmetics completely unclickable with `🔒 Level X` badges?
- [ ] Have both `origin main` and `origin gh-pages` been updated and pushed?
