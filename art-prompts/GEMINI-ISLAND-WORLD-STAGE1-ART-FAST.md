Paste everything below the line into Gemini (the agent that can read and write files in this project).

---

# Practice Island, Stage 1: the big world (12 map pictures)

## Context
English Adventure Academy is a school platform for pupils aged 8 to 10 (English level A1). Practice Island is their home practice game with a Treasure Island theme. Today the island is ONE picture and the pupil can only walk on a thin path. We are rebuilding it as one big scrolling world made of **12 map pictures placed side by side in a grid, 4 across and 3 down**. The pupil's character walks freely from one picture into the next.

I am away. Work alone. If an image fails, retry it up to 3 times, then skip it and write that in the log.

## Hard rules
- You may ONLY create PNG files and one `PROGRESS.txt` inside the folder `island-work\world1\` (create the folder). No edits anywhere else, no git, no code.
- First look (read only) at `island\art\real\bg_ch1_2x.webp` and `island\art\real\bg_ch2_2x.webp`. Copy their **painting style**: warm hand-painted storybook look, golden late-afternoon light, rich greens, thatched roofs, soft edges. Do NOT copy their camera angle (see "The view" below).
- Original art only: no franchises, no brands, no film or book illustrations.
- **No text, letters, numbers or watermark in any picture.** Signs, boards, flags, barrels and crates are blank.
- **No people and no animals** in any picture. The game adds them.
- Friendly and sunny, never scary. The cave and the shipwreck look exciting, not dark or frightening. No skulls, no bones, no weapons.
- Be honest in the log: write "OK" only for a picture you really generated and looked at.

## The view (the most important rule)
These are **game maps to walk on**, not landscape paintings.
- Camera high above, looking down at a steep angle (about 60 degrees), like a classic adventure game map. We see roofs from above and the front walls of buildings.
- **No sky, no horizon, no far-away mountains.** The ground fills the whole picture from edge to edge.
- **At least 60% of every picture is open ground you could walk on**: short grass, sand, dirt paths, wooden planks. Keep the middle of the picture open. Buildings, trees and rocks stand in small groups with wide gaps between them.
- Same scale in all 12 pictures: a house door is about 9% of the picture height; a tree is about 20%.
- Same light in all 12 pictures: sun from the top left, short soft shadows falling to the bottom right.
- Size: 16:9, as large as you can make (2752 x 1536 is ideal).

## How the pictures join (so the seams do not show)
The grid is:

| | Column 1 | Column 2 | Column 3 | Column 4 |
|---|---|---|---|---|
| **Row A (north)** | A1 | A2 | A3 | A4 |
| **Row B (middle)** | B1 | B2 | B3 | B4 |
| **Row C (south, the coast)** | C1 | C2 | C3 | C4 |

- **Shared edge = an edge that touches another picture.** On every shared edge, the outer 8% strip of the picture is plain short green grass with nothing on it: no trees, no rocks, no buildings, no fences, no flowers, no water. One pale dirt path, about one door-height wide, crosses that edge at its exact middle.
- **Outer edge = an edge on the outside of the grid.** It is closed so the pupil cannot walk off the map:
  - North edge of row A: a thick wall of tall trees and bushes.
  - West edge of column 1 and east edge of column 4: grey rocks with bushes.
  - South edge of row C: the sea (see next rule).
- **Row C is the coast.** In all four row C pictures the layout from top to bottom is the same: grass in the top 45%, then a band of pale sand, then the sea starting at exactly 70% of the height and filling the bottom 30%. The shoreline is a gentle straight line at the same height at the left and right edges, so the beach and the sea join from one picture to the next. On the left and right shared edges of row C, the outer 8% strip has only grass, sand and sea, nothing else. The dirt path crosses in the grass part.

## The 12 pictures
Each picture has one main place for a future mission. Put it a little off-centre and keep open ground in front of it.

**Row A, north (trees along the top edge)**
1. `bg_w1_a1_lighthouse.png` — a white stone lighthouse with a red roof on a grassy headland, a small keeper's cottage, a blank signpost. Rocks along the left edge.
2. `bg_w1_a2_forest.png` — a sunny forest glade: a ring of big friendly trees around an open clearing, a fallen log, mushrooms, a tree stump with a blank wooden board on it.
3. `bg_w1_a3_waterfall.png` — a small waterfall dropping into a round blue pond at the top of the picture, a short stream with a wooden footbridge, flat stepping stones, reeds.
4. `bg_w1_a4_lookout.png` — a grassy hilltop with the low stone walls of an old ruined watchtower, a wooden lookout platform with a brass telescope, a tall flagpole with a blank flag. Rocks along the right edge.

**Row B, middle**
5. `bg_w1_b1_inn.png` — the Benbow Inn: a large thatched timber-framed inn with glowing windows and a blank hanging sign, a front yard with a well, barrels and a wooden bench, a small flower garden. Rocks along the left edge.
6. `bg_w1_b2_village.png` — a village square: a round stone fountain in the middle of a paved circle, four market stalls with striped cloth roofs (fruit, fish, bread, cloth), two small thatched cottages.
7. `bg_w1_b3_farm.png` — a farm: a wooden windmill, a small red barn, neat vegetable rows, an orchard of six apple trees, hay bales, a wooden cart.
8. `bg_w1_b4_cave.png` — a rocky hillside in the top right with a wide, friendly cave mouth lit warm gold from inside, a mine cart on short rails, wooden crates, lanterns on posts. Rocks along the right edge.

**Row C, south (the coast: grass, sand, then sea in the bottom 30%)**
9. `bg_w1_c1_harbour.png` — the harbour: a long wooden pier going out into the sea, two small rowing boats tied to it, a boat shed on the sand, fishing nets drying on poles, coiled ropes. Rocks along the left edge.
10. `bg_w1_c2_beach.png` — a wide sandy beach: rock pools, shells, a sandcastle, a striped beach hut, driftwood, a small campfire ring of stones (not lit).
11. `bg_w1_c3_cove.png` — a palm cove: six palm trees, the wooden hull of an old small shipwreck half on the sand (sunny, covered in flowers, not scary), a treasure chest shape half buried in sand (closed), big smooth boulders.
12. `bg_w1_c4_bay.png` — the bay dock: a wide stone and wood dock, a large three-masted sailing ship moored at it with sails rolled up and blank flags, cargo crates and barrels on the dock, a small crane with a rope. Rocks along the right edge.

## Before you finish, check each picture
- Is it seen from high above with no sky and no horizon?
- Is at least 60% of it open walkable ground, with the middle open?
- Is every shared edge a plain grass strip with one path at its middle (and for row C: grass, sand and sea at the right heights)?
- Is there no text, no people and no animals?
If a picture fails a check, make it again (up to 3 times).

## Finish
Write `island-work\world1\PROGRESS.txt` with one line per picture (`bg_w1_a1_lighthouse.png OK` or `SKIPPED: reason`) and a last line `N/12 OK`.
