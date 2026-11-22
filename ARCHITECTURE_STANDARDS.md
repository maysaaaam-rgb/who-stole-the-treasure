# ADVENTURE ACADEMY: PRO ARCHITECTURE & GAME DESIGN STANDARDS

This specification establishes the mandatory architectural rules, visual physics, audio models, and DOM patterns for all interactive lessons, modules, and games created in English Adventure Academy.

---

## 🏛️ Default AI vs. Pro Architecture Benchmark

| Technical Domain | What the Agent Will Output Unprompted (Banned) | What Your Rules Must Enforce (Mandatory Standard) |
| :--- | :--- | :--- |
| **DOM / Viewport** | Scrollable rows, multi-card queues, flat text forms | **Pinned single-focus arena stage with 3D dropzones** |
| **Card Ratio** | 80% text labels, 20% tiny emoji circles | **65% Full-Bleed Artwork Hero, 35% bottom caption plate** |
| **Buttons** | Flat 1px outline boxes with standard `:hover` | **Chunky 3D buttons with 5–6px bottom depth and active push-down physics** |
| **Animation** | `transition: all 0.2s ease` | **Overshoot spring transitions (`cubic-bezier(0.34, 1.56, 0.64, 1)`)** |
| **Sound Synthesis** | Monophonic raw square-wave beeps | **Harmonic chords with exponential decay curves ($f + 1.5f$) and calibrated speech synthesis** |
| **Artwork Origin** | 40 lines of crude SVG ellipses | **Curated high-res transparent WebP assets on isometric pedestals (with resilient vector fallbacks)** |

---

## 📐 Implementation Specifications

### 1. Viewport & Stage Framing
- **No Infinite Text Scrolling in Gameplay**: The core interactive arena must be pinned to the viewport, framing the active challenge front-and-center.
- **Flanking Stadium Dropzones**: Secondary targets (e.g. Green Light DO vs Red Light DON'T, or Destination Barns) flank the active card in a balanced spatial stadium layout.

### 2. Card Golden Ratio (65 / 35 Split)
- **Top 65%**: Full-bleed hero character artwork, isometric pedestal, or animated skeletal puppet.
- **Bottom 35%**: High-contrast rounded caption plate housing the target word, key verb chip, and dialogue speech bubble.

### 3. Physical 3D Button Mechanics
```css
:root {
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-snap: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-game-3d {
  background: #10b981;
  border: none;
  border-bottom: 6px solid #047857; /* Physical bottom lip */
  border-radius: 18px;
  color: #ffffff;
  font-weight: 900;
  transform: translateY(0);
  transition: transform 0.08s var(--spring-snap), border-bottom-width 0.08s ease;
}

.btn-game-3d:hover {
  transform: translateY(-2px);
  border-bottom-width: 8px;
}

.btn-game-3d:active {
  transform: translateY(4px); /* Physically compresses down */
  border-bottom-width: 2px;
}
```

### 4. Rubber-Stamp Impact Physics
```css
.stamp-impact {
  animation: stampSlam 0.22s var(--spring-bounce) forwards;
}

@keyframes stampSlam {
  0%   { transform: scale(2.4) rotate(-25deg); opacity: 0; }
  100% { transform: scale(1.0) rotate(-10deg); opacity: 1; }
}
```

### 5. Acoustic Harmonic Sound Engine (Web Audio API)
- **Dyad Chimes**: Never play raw solitary beeps. Always blend a pure sine fundamental ($f$) with an overtone fifth ($1.5f$ triangle wave) with exponential decay ($0.2 \to 0.0001$).
- **Level-Up Fanfare**: Ascending C-major arpeggio ($C_5 \to E_5 \to G_5 \to C_6$ at 90ms offsets).
- **Non-Punitive Soft-Fail**: Warm low-register sine drop ($260\text{ Hz} \to 180\text{ Hz}$) to gently guide primary ESL learners without discouragement.
- **Calibrated TTS Engine**: `window.speechSynthesis` calibrated at `rate: 0.86`, `pitch: 1.08`, `lang: "en-US"` with word-boundary event tracking for karaoke speech highlighting.

### 6. Asset Architecture & Pedestals
```javascript
const ASSET_REGISTRY = {
  characters: {
    hero: "assets/sprites/fox-adventurer.webp",
    robot: "assets/sprites/companion-drone.webp"
  },
  pedestals: {
    stone: "assets/ui/isometric-pedestal-stone.webp",
    energy: "assets/ui/isometric-pedestal-neon.webp"
  },
  stamps: {
    approved: "assets/ui/stamp-do.webp",
    forbidden: "assets/ui/stamp-dont.webp"
  }
};
```
Always pair texture loaders with zero-dependency procedural fallbacks so games remain 100% playable even in offline or firewall-restricted classrooms.

---

## 🌴 7. Commercial Stylized 3D GameQualityCore & Visual QA Gate (Nintendo / Angry Birds Standard)

Every 3D game in `games/*3d/` MUST initialize through `GameQualityCore` (`games/engine3d/SceneAtmosphere.js`, `StylizedWater.js`, `JuiceManager.js`) and pass all 5 Visual QA Gates before completion:

1. **Calibrated Sunlit Palette & Fog (`SceneAtmosphere.js`):**
   - `SRGBColorSpace` + `ACESFilmicToneMapping` (`1.05`) + `PCFSoftShadowMap` (`2048×2048`, `bias = -0.0004`, `normalBias = 0.02`).
   - **Fog (`FogExp2` `0.0022`–`0.0032`, never `> 0.0035`):** Subtle aerial depth only—distant hills, lighthouses, and stands must keep warm recognizable color, never milky whiteout.
   - **Sunlight vs. Fill Contrast:** Warm Sun `DirectionalLight` (`#FFF2D6`, `2.5`) at `[35, 45, 25]` (`3/4` side angle) + `HemisphereLight` (`#9CE0FF` / `#C49A6C`, `0.55`) + warm back **Rim Light** (`#FFE4B5`, `0.60`, no shadow).
   - **Surface Palette:** Olive-meadow grass (`#6EB84C` lit / `#4B8B3B` shaded), golden sand (`#F3CF8A`) with wet waterline (`#C99D5B`), and sunlit turquoise-to-cerulean ocean (`#26C6DA -> #1282C8 -> #0D5EA6`, `StylizedWater.js`).

2. **Pro Target Silhouette (`1.35×–1.5×`) & Environmental Perimeter Dressing:**
   - Scale interactive crates, TNT barrels, pins, and fort blocks up `1.35×–1.5×` with high-contrast multi-part coloring (`#D99B52`/`#8C5828` oak crates, `#E63946`/`#FFD43B` crimson TNT) + real cast shadows + AO contact rings (`addBlobShadow`).
   - Dress every playable island/stage perimeter (never blocking aim sightlines) with swaying palms/trees, faceted boulders, docks/stakes, fluttering pennants, and ambient life (circling gulls, bobbing skiffs/buoys). Zero bare primitive pancakes.

3. **Camera Choreography, UI Safe Zones & `JuiceManager.js`:**
   - **Bottom 18% UI Safe Zone:** Launchers, balls, and crew feet must project above the bottom 18% HUD strip; when quiz modals open, pan/tilt the camera so the live 3D arena frames cleanly above `.qcard`.
   - **Single Honest Aim Guide & 3-Tier English Stakes:** Strictly one short muzzle pointer (`15%–20%` length; no cheat bullseye rings or double shadow arrows), 3-tier English ammo/power stakes, opposing-team Steal rule, and full Impact Trio (`squashStretch`, `40ms` `hitstop`, spring camera micro-shake, 3D splinters/stars/splash, bouncy score popups, and avatar head-tracking).

4. **Mandatory 5-Point Visual QA Checklist:**
   - [ ] `FogExp2 <= 0.0035` — horizon silhouettes retain warm color without milky washout.
   - [ ] Crisp directional sun shadows visible across play surfaces (`Hemi <= 0.65`, `Sun >= 2.2`).
   - [ ] Perimeter framing props & ambient life on every stage — zero bare platforms.
   - [ ] High-contrast `1.35×–1.5×` target separation against sand, turf, and water.
   - [ ] Bottom/Top 18% UI Safe Zones clean across Smartboard (`1920×1080`), Laptop (`1366×768`), and Mobile (`844×390` & `390×844`) with `0` console errors.

