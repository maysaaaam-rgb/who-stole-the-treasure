# AGENTS.md — AI Agent Guidelines & Architecture Manual
> **English Adventure Academy** (`who-stole-the-treasure`)  
> Local Root: `c:\Users\maysa\Desktop\DV\`  
> Target Mirror: `monster day/story/mouse/pokemon/firefighter/NH/`  
> Git Branches: `main` & `gh-pages`

This document defines the mandatory operating protocols, architectural rules, visual tokens, audio engines, and code lifecycle requirements for all autonomous and pair-programming AI coding agents working in this repository.

---

## 1. Core Operating Protocols & Rules of Engagement

### 1.1 The Workspace Mirroring Law (MANDATORY)
Whenever you modify, add, or delete any source file in the root project, **you must immediately mirror the exact change to the secondary workspace directory**:
```powershell
Copy-Item -Path "<root-relative-path>" -Destination "monster day\story\mouse\pokemon\firefighter\NH\<root-relative-path>" -Force
```
*Never mark a task complete without confirming that both paths are 100% in sync.*

### 1.2 Syntax Verification Before Commit
Never commit unverified code. Always run static syntax checks via Node.js on all touched JavaScript files in both directories:
```powershell
node --check "js/<filename>.js"
node --check "monster day/story/mouse/pokemon/firefighter/NH/js/<filename>.js"
```

### 1.3 Git Commit & Dual-Branch Push Workflow
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

### 1.4 Zero Heavy Runtime Dependencies
- **Stack**: Pure Vanilla ES6+ JavaScript, Semantic HTML5, CSS3 with Custom Properties.
- **No Build Bloat**: Do NOT introduce React, Vue, Webpack, Vite, npm runtime packages, or external runtime CDNs.
- **Offline Reliability**: The platform runs directly inside classroom browsers, offline networks, and interactive projector smartboards. Procedural synthesis (Web Audio API, SVG generation) and local assets are always favored over remote endpoints.

---

## 2. Visual & UX Design Tokens (EdTech Commercial Standards)

All UI elements must look tactile, playful, and cohesive—comparable to modern commercial EdTech applications (Duolingo, Blooket, Prodigy).

### 2.1 Color & Surface Hierarchy
- **Base Canvas**: Clean slate `#f8fafc`.
- **Card Surfaces**: Solid white `#ffffff` elevated by soft, layered drop shadows:
  ```css
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
  ```
- **Banned**: 1px generic gray borders enclosing every box, dense data spreadsheets, and flat administrative enterprise styling.

### 2.2 Tactile 3D Push-Down Buttons (`.btn-3d`)
Buttons are physical objects with depth and spring physics:
```css
:root {
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-snap: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-3d {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  font-weight: 800;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  user-select: none;
  transition: transform 0.08s var(--spring-snap), border-bottom-width 0.08s ease, filter 0.12s ease;
  transform: translateY(0);
}

.btn-3d-primary {
  background: #2563eb;
  color: #ffffff;
  border-bottom: 4px solid #1d4ed8;
}

.btn-3d-success {
  background: #10b981;
  color: #ffffff;
  border-bottom: 4px solid #047857;
}

.btn-3d:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.btn-3d:active {
  transform: translateY(2px);
  border-bottom-width: 1px;
}
```

### 2.3 Card Golden Ratio (60 / 40 Split)
Student companion cards and challenge tiles dedicate:
- **Upper ~60%**: Full-bleed hero character canvas, isometric reflection dais, or animated puppet.
- **Lower ~40%**: High-contrast rounded info plate with student identity, CEFR badge, streak count, progress bar, and dominant 3D action button (`⚡ +10 XP`).

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
