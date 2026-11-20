# Island Tools — Assets & Sound Credits

## 3D Models (`home3d/tools/models/`)
- `ufo.glb` — Generated with **Tripo Studio** (Image-to-3D from `assets/games/pickers/ufo_ship.webp`, private model, compressed with `@gltf-transform/cli` to ≤ 300 KB). Bright cartoon saucer with glass dome and coloured rim lights matching `docs/ART_STYLE.md`.
- Pupils in the amphitheatre — Rendered using the platform's existing `K.makeCharacter(..., { kidsOnly: true })` placeholder models (to be swapped by Claude with real pupil avatars via `window.IslandTools.getRoster()`).

## Sounds (Procedural Web Audio API)
All sound effects for Tool 1 (UFO Picker) are synthesized in real time using the Web Audio API inside `home3d/tools.js` (zero external files, zero copyright risk):
- **UFO Fly-in Whoosh + Soft Sci-Fi Hum:** Filtered pink-noise wind sweep + dual detuned sine/triangle LFO-modulated hover hum.
- **Searchlight Sweep Drum Roll / Ticking:** Soft rhythmic wooden/percussive ticks accelerating gently across the sweep.
- **Beam Lock "Bloop" + Rising Beam Tone:** Warm sine pitch-pop (`280 Hz → 660 Hz`) + shimmering dual-oscillator rising harmonic beam.
- **Carry Whoosh:** Smooth bandpass air whoosh across the island.
- **Landing Ding + Crowd "Yay":** Bright C-major pentatonic chime (`C5 → E5 → G5 → C6`) + warm filtered celebratory applause/cheer swell + `K.say("Your turn, <name>!")`.

## GO Tools 2–9 Assets & Sounds
- `home3d/tools/models/box-gold.glb` — Compressed from existing Tripo Batch C model (`island-work/night1/c/glb/box-gold.glb`, `298.35 KB`, 0 additional Tripo credits).
- **Procedural Web Audio (in `home3d/tools/tools-pack.js`):**
  - Freeze ice chime & warm melt chord
  - Sun Timer last-10s ticking & deep brass ship's horn
  - Group Maker / Line-up / Dice / Spinner pop & wedge click ticks
  - Birthday Party instrumental "Happy Birthday" melody (marimba/celesta Web Audio tones, no lyrics)
