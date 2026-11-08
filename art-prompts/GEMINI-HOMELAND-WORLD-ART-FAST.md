# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for **Treasure Island: the Homeland**, the big main world of the game for pupils aged 8 to 10 (English learners, A1). From the Homeland the children walk with their monster to every chapter of the story. Chapter 1 (Benbow Harbour) is open; the other chapters are visible but locked, so the children can see what is waiting. This first batch is **14 pictures**. Work through the whole job by yourself without asking me questions. I am away. If a picture fails, retry it up to 3 times, then skip it and log it as SKIPPED.

## Hard rules
- You may ONLY create PNG files and one `PROGRESS.txt` inside `C:\Users\maysa\Desktop\DV\island-work\art-homeland\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **First, look (read only) at:** `C:\Users\maysa\Desktop\DV\island\art\bg_benbow.webp` (the harbour painting: this is the STYLE for the big map), `island\art\ch1\o_ship.webp` and `island\art\ch1\o_rowboat_1.webp` (cut-out style), and `island\art\flat\c_benbow.webp` (character style). Everything must look like the same storybook world: warm hand-painted, golden late-afternoon light, soft colours, friendly.
- ORIGINAL art only. No copying of any film, book illustration, game, map or brand.
- **No text, letters, numbers or watermark inside any image.** Signs and flags are blank.
- Friendly, never scary: the "skull" peak is a funny rock shape, not frightening. No weapons, no people in the big map.
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.

## Picture types
**Type W (world map):** wide 16:9, 1920x1080 (or larger, same shape), a full painted scene edge to edge, no outline.
**Type A (cut-out):** square 1024x1024, ONE object, centred, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no shadow, no outline, seen from the same 3/4 bird's-eye angle as the map.

## The big map (read carefully, the game needs these places in these spots)
1. `bg_homeland.png` (W): one whole tropical island seen from above at a **3/4 bird's-eye angle** (like a cosy board-game map), surrounded by calm turquoise sea. Wide sandy-and-earth **paths** connect five areas, and the paths are easy to see and walk along. Leave the areas **empty of big buildings** (the game puts the buildings on top as separate pictures), but paint their ground:
   - **Centre-bottom (about 50% across, 70% down): Home Village**, a round grassy clearing with flowers and a small pond. This is where the children start.
   - **Left (about 18% across, 55% down): Benbow Harbour**, a little bay with a wooden dock on the coast.
   - **Top-left (about 25% across, 20% down): Hispaniola Bay**, a wide bay of deeper blue water with sandy beaches.
   - **Right (about 78% across, 50% down): Stockade Forest**, thick green jungle with a clearing in the middle.
   - **Top-right (about 72% across, 15% down): Skull Treasure Peak**, a tall rocky hill with a winding path to the top.
   - A small wooden **bridge** where the path from the Home Village crosses a stream towards the forest, and a narrow path between rocks towards the peak.
   Keep the sea calm at the edges and some empty grass along the paths (the monster walks there).

## The buildings and landmarks (Type A cut-outs, they sit on top of the map)
2. `o_home_hut.png`: a cosy round monster house with a thatched roof, a round door and glowing windows (the children's home).
3. `o_home_hut_b.png`: a second home in a different colour, with a tiny chimney.
4. `o_inn_small.png`: a small version of the Admiral Benbow inn from the harbour painting (same roof and timber), for the harbour corner of the map.
5. `o_ship_small.png`: the three-masted ship, small, sails down, anchored (for Hispaniola Bay).
6. `o_stockade.png`: a small wooden fort made of log walls with a little gate and a blank flag (Stockade Forest).
7. `o_skull_rock.png`: a big friendly rock on the hilltop shaped a little like a smiling skull, with moss and flowers, NOT scary (Skull Treasure Peak).
8. `o_treasure_glow.png`: a closed treasure chest on the peak with a soft golden glow and sparkles (the final goal of the story).

## The "locked" things (show what is waiting, but closed)
9. `o_fog_cloud.png`: a soft, fluffy, light-grey fog cloud (wide), with a gentle edge, that can cover a locked area.
10. `o_fog_cloud_b.png`: a second fog cloud, a different shape.
11. `o_lock_gate.png`: a small wooden gate across a path with a big friendly golden padlock on it.
12. `o_bridge_broken.png`: the small wooden bridge with a few planks missing (the forest is not open yet).
13. `o_signpost.png`: a wooden signpost with three blank arrow boards pointing different ways.
14. `o_chapter_flag.png`: a small blank pennant flag on a pole, coral red, for a finished chapter.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture (`file name - OK` or `file name - SKIPPED reason`), then a last line `N/14 OK`.
