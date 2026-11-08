# How to Use Tiled to Make Maps for Practice Island

**Tiled** is a free, easy-to-use 2D level editor that lets you paint game maps like a picture and load them directly into Phaser.

---

## 1. How to Download and Install Tiled on Windows
1. Open the official Tiled website: **https://www.mapeditor.org**
2. Click the **"Download at itch.io"** button (this takes you to the official page at `https://thorbjorn.itch.io/tiled`).
3. Click **"Download Now"**, then click **"No thanks, just take me to the downloads"** if you want the free download right away.
4. Choose the **Windows 64-bit Installer (`.msi`)** and run it once it finishes downloading.
5. Follow the standard Windows setup steps (**Next → Install → Finish**) and open **Tiled**.

---

## 2. How to Make a New Map for a Phaser Game
1. In Tiled, click **File → New → New Map...** (or press `Ctrl+N`).
2. Set these exact options:
   - **Orientation:** `Orthogonal`
   - **Tile layer format:** `CSV` (default)
   - **Tile render order:** `Right Down` (default)
   - **Map size:**
     - **Width:** `60` tiles
     - **Height:** `34` tiles
     *(At 32×32 pixels per tile, `60 × 34` tiles equals `1920 × 1088` pixels — a full 16:9 widescreen smartboard view!)*
   - **Tile size:**
     - **Width:** `32 px`
     - **Height:** `32 px`
3. Click **Save As...** and save your working Tiled project file.

---

## 3. Adding Your Tileset (With "Embed in Map" Turned On)
Before painting tiles, load your tileset picture:
1. First, copy your tileset image (for example `tileset.png`) into `C:\Users\maysa\Desktop\DV\island\maps\`.
2. In the bottom-right **Tilesets** panel in Tiled, click **New Tileset...**.
3. Set these options:
   - **Type:** `Based on Tileset Image`
   - **Embed in map:** ✅ **CHECK THIS BOX** *(Very important! Phaser needs the tileset embedded inside the JSON file so it doesn't have to load a separate `.tsx` file.)*
   - **Source:** Click **Browse...** and pick the tileset PNG inside `island/maps/`.
   - **Tile width:** `32 px`
   - **Tile height:** `32 px`
   - **Margin / Spacing:** `0 px` (or `1 px` if using a spaced spritesheet; most standard sheets use `0 px`).
4. Click **OK**. Your tiles will now appear in the bottom-right palette ready to paint with the **Stamp Brush (`B`)** or **Bucket Fill (`F`)** tool.

---

## 4. The 5 Things to Draw First for a Game Level
In the top-right **Layers** panel, create your layers in this exact order (bottom to top):

1. **Ground (`ground` — Tile Layer):**
   - Fill the whole map with base grass, sand, or stone tiles using the **Bucket Fill (`F`)** tool so there are no empty holes.
2. **Water (`water` — Tile Layer):**
   - Paint the sea, shoreline, harbour water, or ponds.
3. **Path (`path` — Tile Layer):**
   - Paint the dirt roads, wooden docks, bridges, and cobblestone paths that guide the pupil from stop to stop.
4. **Walls / Blocked Areas (`collision` — Tile Layer):**
   - Create a Tile Layer named **`collision`** (exact lowercase name).
   - Paint trees, cliffs, fences, walls, and deep-water edges on this layer. In Phaser, our game code will turn every tile on the `collision` layer into a solid obstacle that the pupil's monster cannot walk through.
5. **Stops / Places (`places` — Object Layer):**
   - Click the **New Layer** button in the Layers panel → choose **New Object Layer** → name it **`places`** (exact lowercase name).
   - Select the **Insert Point (`I`)** tool in the top toolbar.
   - Click on the map where each learning stop or character should stand (for example: `spawn`, `stop1`, `stop2`, `stop3`, `stop4`, `stop5`, `shop`).
   - In the left **Properties** panel for each point, type its **Name** (e.g. `stop1`) so Phaser knows where to place each activity marker.

---

## 5. How to Export for Phaser and Where to Save It
Phaser reads **JSON** maps (`.json`), not `.tmx` files:
1. Make sure your tileset is **Embedded** (if you see a tiny "Embed Tileset" button at the bottom of the Tilesets panel, click it so the tileset is inside the map).
2. Click **File → Export As...**
3. Under **Save as type**, choose **JSON map files (`*.json` / `*.tmj`)**.
4. Save the file inside:
   ```text
   C:\Users\maysa\Desktop\DV\island\maps\
   ```
   with a simple lowercase name ending in **`.json`** (for example: `island/maps/harbour.json`).
5. Make sure the **tileset picture (`.png` or `.webp`)** sits right next to the `.json` file inside `island/maps/`.
