# Practice Island — Tiled Maps (`island/maps/`)

This folder holds the **Tiled** map files and tileset images for Practice Island's Phaser world.

## What Goes Here
1. **Exported JSON Maps (`*.json`):**
   - Orthogonal maps (`60 × 34` tiles at `32 × 32 px`) exported from Tiled as JSON with the **tileset embedded**.
2. **Tileset Images (`*.png` or `*.webp`):**
   - The tileset spritesheet image placed right next to the `.json` map that uses it.

## Standard Layer Names Expected by Phaser
- `ground` (Tile Layer) — base grass, sand, or stone tiles
- `water` (Tile Layer) — sea, shoreline, and water tiles
- `path` (Tile Layer) — roads, docks, and walkways
- `collision` (Tile Layer) — blocked walls, cliffs, fences, and obstacles
- `places` (Object Layer) — named points (`spawn`, `stop1`..`stop5`, etc.) for game stops

See [`docs/TILED-HOW-TO.md`](../../docs/TILED-HOW-TO.md) for step-by-step instructions.
