# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for **Treasure Island, Chapter 1: Admiral Benbow Harbour**, a game for pupils aged 8 to 10. The harbour must come alive: the ship will rock, the boats will bob and the characters will walk and wave. For that I need the ship and boats as separate pictures, an empty harbour behind them, and a few extra poses of the characters. Work through the whole job by yourself without asking me questions. I am away. If a picture fails, retry it up to 3 times, then skip it and log it as SKIPPED.

## Hard rules
- You may ONLY create PNG files and one `PROGRESS.txt` inside `C:\Users\maysa\Desktop\DV\island-work\art-ch1-life\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **First, look (read only) at:** `C:\Users\maysa\Desktop\DV\island\art\bg_benbow.webp` (the harbour), `island\art\flat\c_benbow.webp` and `c_benbow_happy.webp` (Benbow the leopard), `island\art\flat\c_flint.webp` (Flint the parrot), `island\art\flat\c_jim.webp` and `c_jim_happy.webp` (Jim). New pictures must match them exactly: same style, same colours, same outfit, same proportions.
- Everything must be ORIGINAL. No copying of any film, book illustration, game or brand.
- **No text, letters, numbers or watermark inside any image.**
- Friendly, never scary. No weapons.
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.

## Picture types
**Type B (backdrop):** exactly the same size and shape as `bg_benbow.webp` (wide 16:9), full painted scene.
**Type A (cut-out):** square 1024x1024, ONE subject, centred, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no shadow, no outline.

## The 13 pictures
**The harbour in pieces**
1. `bg_benbow_empty.png` (B): the SAME harbour painting, same camera, same light, every building, rock, path and the dock in exactly the same place, but **without the big three-masted ship and without the small rowing boats**. Where they were, paint calm sea water with soft reflections.
2. `o_ship.png` (A): the big three-masted ship from the harbour, alone, same angle, same colours and sails, the whole ship including the bottom of the hull, no water.
3. `o_rowboat_1.png` (A): one small wooden rowing boat from the harbour, seen from the same angle, empty, no water.
4. `o_rowboat_2.png` (A): a second rowing boat, slightly different colour wood, with a coiled rope inside.
5. `o_rowboat_3.png` (A): a third rowing boat with a small mast and a folded sail.

**Benbow the leopard (keep his face, spots and red scarf identical)**
6. `c_benbow_walk1.png` (A): side view walking to the right, left front paw forward.
7. `c_benbow_walk2.png` (A): the same, right front paw forward (the second step).
8. `c_benbow_sit.png` (A): sitting, tail curled round his paws, looking at the viewer.
9. `c_benbow_purr.png` (A): eyes closed, happy, head tilted, tail up.

**Flint the parrot**
10. `c_flint_fly1.png` (A): flying to the right, wings UP.
11. `c_flint_fly2.png` (A): flying to the right, wings DOWN (the same parrot, the second flap).

**Jim**
12. `c_jim_wave.png` (A): Jim waving with one hand high, big smile, same clothes.
13. `c_jim_point.png` (A): Jim pointing to the right with one arm, excited, same clothes.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture (`file name - OK` or `file name - SKIPPED reason`), then a last line `N/13 OK`.
