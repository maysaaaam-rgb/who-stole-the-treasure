# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the **Smart Board** of an English platform for primary pupils (aged 8 to 10, beginners). The teacher wants a **classic old-school blackboard look**, like the boards in schools long ago: a dark green-black slate in a wooden frame, a wooden chalk tray at the bottom with coloured chalk sticks, and a felt **board duster** (the wooden block with felt underneath used to wipe chalk). The board already works with drawn placeholders. I need real pictures to replace them. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\smartboard-work\art\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **First, look (read only) at the existing pictures `cat.png`, `dog.png` and `boss.png` in `C:\Users\maysa\Desktop\DV\unit2-throw\art-new\`.** The object pictures (Type A) must look like they belong to the same family: cute 3D-rendered mobile-game style, soft lighting, rich warm colours, the same line quality, and a thick white sticker outline.
- Everything must be ORIGINAL art. Do NOT copy any brand, logo or product. **No text, letters, numbers, chalk writing, scribbles or watermark inside any image.** Every board and box is blank.
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.

## Fixed object designs (keep them identical in every picture)
- **The duster**: a rectangular block about 3 times as long as it is wide. Top: warm honey-brown varnished wood with soft rounded edges and a shallow finger groove along the middle. Bottom: thick light-grey felt, a little dusty white at the edges.
- **Chalk sticks**: round, short sticks (about 8 times as long as they are thick), matte and powdery, one end slightly worn down. Soft pastel chalk colours, never neon.
- **Wood**: the same honey-brown varnished wood everywhere (duster, tray, frame), with a gentle visible grain.

## Picture types and sizes (PNG, use the exact file names)
**Type A: objects.** Square 1:1, 1024x1024, ONE subject, centred, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, thick white sticker outline around the whole subject.
**Type T: textures.** Square 1:1, 1024x1024, a flat, front-on, evenly lit surface that fills the WHOLE frame edge to edge. It must tile seamlessly (the left edge continues into the right edge, the top into the bottom). No objects, no outline, no shadows, no vignette, no text.
**Type B: backdrop.** Wide 2:1, 1600x800, a full scene with NO people, NO animals and NO text, same soft 3D style, no outline.

## FIRST BATCH ONLY (14 pictures, fast). Do exactly these, in this order, nothing else.

1. `o_duster_top.png` (Type A): the duster seen exactly from above, lying flat, long side horizontal, the wooden top facing us, a thin edge of grey felt showing all around. No tilt, no perspective.
2. `o_duster.png` (Type A): the same duster seen at a friendly three-quarter angle, so both the wooden top and the felt underneath show, a little puff of chalk dust under it.
3. `o_chalk_white.png` (Type A): one white chalk stick, lying horizontally.
4. `o_chalk_yellow.png` (Type A): one soft pastel yellow chalk stick, lying horizontally.
5. `o_chalk_pink.png` (Type A): one soft pastel pink chalk stick, lying horizontally.
6. `o_chalk_blue.png` (Type A): one soft pastel sky-blue chalk stick, lying horizontally.
7. `o_chalk_green.png` (Type A): one soft pastel mint-green chalk stick, lying horizontally.
8. `o_chalk_orange.png` (Type A): one soft pastel orange chalk stick, lying horizontally.
9. `o_chalk_box.png` (Type A): a small open cardboard box full of white and coloured chalk sticks, the box plain with no printing.
10. `o_dust_puff.png` (Type A): a soft round cloud of white chalk dust with a few tiny floating specks, light and airy.
11. `o_chalk_tray.png` (Type A): a long wooden chalk ledge seen from the front and slightly above, long side horizontal, with a raised front lip, a few chalk sticks and the duster resting on it.
12. `t_wood.png` (Type T): the honey-brown varnished wood of the frame, grain running left to right, seamless.
13. `t_slate.png` (Type T): an old classroom blackboard surface, very dark green-black, matte, with very faint cloudy chalk smudges from old wiping, NO writing and NO drawings, seamless, dark enough that white chalk shows very clearly on it.
14. `bg_old_classroom.png` (Type B): a warm, sunny old-fashioned classroom: a big blank dark-green blackboard in a wooden frame with a chalk tray, wooden desks in rows, a globe on a shelf, tall windows with sunlight. The blackboard is completely empty.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 14.
