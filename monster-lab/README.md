# English Adventure Academy — Monster Lab

> **ISOLATED DEVELOPMENT ENVIRONMENT**  
> The main academy platform is frozen and has NOT been modified.

---

## What is this?

Monster Lab is a standalone browser-based development environment for designing, building, testing, animating, and customizing the **Lumifox** — the academy companion monster — before integration into the main platform.

---

## Quick Start

1. Open `monster-lab/index.html` in any modern browser
2. No server required — runs entirely from local files
3. No installation needed

---

## Species: Lumifox

A fox-inspired RPG companion character featuring:
- 🦊 Large expressive eyes (4 styles)
- 👂 Fluffy/pointy/round ears (3 styles)
- 🌿 Distinctive plume/curl/lightning/ribbon tail (4 styles)
- 👕 Explorer/Scholar/Knight/Casual outfits (4 styles)
- 🎨 5 fur color palettes
- 🕶 3 accessories
- ✨ 5 aura effects
- 👦👧 Boy/Girl style mode

---

## Evolution Stages

| Stage | XP | Description |
|---|---|---|
| Egg | 0 | Animated glowing egg |
| Baby | 100 | Tiny round cub with huge head |
| Tot | 300 | Slightly larger, more defined |
| Young | 700 | Proper juvenile proportions |
| Adventurer | 1200 | Full-size, strong silhouette |
| Elite | 2500 | Enhanced detail, glowing presence |
| Legendary | 5000 | Maximum size, gold shimmer, star effects |

---

## Features

| Feature | Status |
|---|---|
| Component-based renderer | ✅ |
| 5 fur colors | ✅ |
| 4 eye styles | ✅ |
| 3 ear types | ✅ |
| 4 tail variants | ✅ |
| 4 outfits | ✅ |
| 3 accessories | ✅ |
| 5 aura effects | ✅ |
| Boy/Girl style | ✅ |
| 7 evolution stages | ✅ |
| Idle animation (breathing, blink, tail sway) | ✅ |
| Named animations (happy, wave, jump, celebrate, evolution) | ✅ |
| Celebration particle system | ✅ |
| localStorage persistence | ✅ |
| Reset to default | ✅ |
| Randomize | ✅ |
| Dev state panel | ✅ |
| Evolution timeline | ✅ |
| XP slider | ✅ |

---

## File Structure

```
monster-lab/
├── index.html              Lab shell (open this)
├── css/
│   └── monster-lab.css     Dark professional lab theme
├── js/
│   ├── monster-data.js     Character data & options catalogue
│   ├── monster-renderer.js Canvas 2D layered renderer
│   ├── animation.js        RAF animation controller
│   ├── evolution.js        XP → stage management
│   ├── customization.js    Customization panel UI
│   └── app.js              Bootstrap & wiring
├── assets/
│   └── monster/            (placeholder for future sprite assets)
├── INTEGRATION_PLAN.md     How to integrate into the academy
└── README.md               This file
```

---

## Technology

- **Rendering:** HTML Canvas 2D API with layered drawing
- **Shading:** Radial and linear gradients per body part
- **Animation:** `requestAnimationFrame` loop
- **No external runtime required** (no Spine/Rive runtime needed for development)
- **Integration path:** MonsterRenderer API is designed to accept Spine/Rive assets as drop-in replacements

---

## Academy Isolation Guarantee

This entire project is contained within `monster-lab/`.

The following academy files are **untouched**:
- `index.html`
- `css/style.css`
- `js/app.js`
- `js/audio.js`
- `js/data.js`
- `js/scenes.js`

See `INTEGRATION_PLAN.md` for eventual academy integration steps.
