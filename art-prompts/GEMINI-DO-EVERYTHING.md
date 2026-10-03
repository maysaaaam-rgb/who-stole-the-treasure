# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for my children's English learning platform. Work through the whole job below by yourself, without asking me questions. I am away. If something fails, retry up to 3 times, then skip it, note it in the log, and continue with the next image.

## Files to read first
1. `C:\Users\maysa\Desktop\DV\art-prompts\MONSTER-ART-PROMPTS.md` (style block, stage lines, species lines)
2. `C:\Users\maysa\Desktop\DV\art-prompts\ACCESSORY-ART-PROMPTS.md` (style block and 28 item prompts)

## Hard rules
- Only create image files and one log file. Do NOT edit, move, rename or delete any other file in the project. Do NOT run git, do NOT commit, do NOT push. Do NOT touch any code (.js .html .css).
- Never draw or copy existing game characters (no Pokemon, no Disney, no other franchises). Everything must be original.
- No text, letters, watermark or logo inside any image.
- Every image: square 1:1, 1024x1024, one flat plain light-grey background (#e8e8e8), no ground shadow, no floor.
- Save the generated image exactly under the file name given below. If you save a JPEG, that is fine, keep the `.png` name.

## JOB 1: redo two species (12 images)
Before generating, back up the old files: create the folder `C:\Users\maysa\Desktop\DV\assets\monsters\new\_old_lookalikes\` and MOVE (not delete) these into it: all `emberwing_*.png` and all `sparktail_*.png` from `assets\monsters\new\`.

Then generate with the REDESIGNED species lines in MONSTER-ART-PROMPTS.md:
- Emberwing = a small round fluffy fire-chick (baby phoenix). Fully feathered, NO dragon, NO lizard, NO claws.
- Sparktail = a small round storm-cloud lamb with bolt-shaped yellow horns. NO mouse, NO yellow body, NO red cheeks.

For each species make 6 images, in this order, and use the previous stage image as the reference so it stays the same character ("keep the exact same character, only change to this stage"):
`<species>_egg.png`, `<species>_baby.png`, `<species>_growing.png`, `<species>_adventurer.png`, `<species>_advanced.png`, `<species>_ultimate.png`
Use the STYLE BLOCK, the species line and the stage line from the file. Save them into `C:\Users\maysa\Desktop\DV\assets\monsters\new\`.
Keep the same cute 3D mobile-game style as the existing `aquafind_*`, `florasprout_*` and `astralight_*` images in that folder: open two of them and match their look, lighting, outline and eye style.

## JOB 2: 28 accessory items
Create the folder `C:\Users\maysa\Desktop\DV\assets\monsters\items\`.
Generate every item in the tables of ACCESSORY-ART-PROMPTS.md (8 hats, 2 glasses, 4 neck items, 4 backpacks, 6 held items, 4 outfits). Use its STYLE BLOCK plus the prompt line of each item. File names exactly as in the tables (for example `item_hat_crown.png`).
Rules for items: ONE item alone, front view, centred and level, about 70% of the picture, no creature, no hand holding it. Hats and glasses must be perfectly symmetric and level so they can be placed on a head.

## Log and finish
Write a plain-text file `C:\Users\maysa\Desktop\DV\art-prompts\PROGRESS.txt` listing every file name with OK or FAILED, one per line, updated as you go. At the end list the folders and confirm the counts:
- `assets\monsters\new\` should contain 30 files (5 species x 6)
- `assets\monsters\new\_old_lookalikes\` should contain the 12 old files
- `assets\monsters\items\` should contain 28 files
Then stop and report which images failed, if any. Do nothing else.
