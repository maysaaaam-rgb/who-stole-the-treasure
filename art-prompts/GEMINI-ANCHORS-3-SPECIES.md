# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are helping me place accessories (hats, glasses, necklaces, backpacks, scarves, held items) on 15 cartoon monster pictures for my children's English learning platform. Three new species were added and need their "fit points" measured so hats and outfits sit correctly. Work through the whole job by yourself without asking me questions. I am away.

## Hard rules
- You may ONLY create files inside `C:\Users\maysa\Desktop\DV\monster-work\anchors3\` (create it). Do NOT edit, move, rename or delete any other file. Do NOT touch code (.js .html .css). Do NOT run git. You may run Python with Pillow to draw check overlays. Do not install anything.

## Input
The 15 pictures in `C:\Users\maysa\Desktop\DV\assets\monsters\art\` (each **512 x 512 pixels**, transparent background):
- species `breezefin` (a little whale with fins), `frostfluff` (an ice owl), `terrashell` (a turtle with a tree on its shell)
- stages `baby`, `growing`, `adventurer`, `advanced`, `ultimate`
- file names like `frostfluff_baby.webp`. Ignore the egg pictures.

## Task: look at every picture and measure these points
All coordinates are in PIXELS of the 512 x 512 picture (x from the left, y from the top). Be as accurate as you can. Look at each picture on its own; do not copy values between pictures, because each one is posed and scaled differently.

For each picture give:
- `hatBase`: {x, y} the point on the TOP of the head, centred between ears, horns, fins or crest, where the bottom edge of a hat would sit. (A whale has no neck: use the top of the head. A turtle: the top of the head, not the shell.)
- `hatWidth`: the width a hat should have to look right on this head.
- `eyeCenter`: {x, y} exactly halfway between the two eyes. `eyeSpan`: distance between the two eye centres. `glassesWidth`: width glasses need to cover both eyes with a small margin.
- `neck`: {x, y} the centre of the collar line between head and body where a necklace or scarf would sit. `neckWidth`: width of that area.
- `chest`: {x, y} the centre of the chest, about one head-height below the neck.
- `bodyCenter`: {x, y} the centre of the body (where a backpack or cape would sit behind it). `bodyHeight`: body height from neck to the bottom.
- `pawRight`: {x, y} the paw, flipper, wing tip or claw on the RIGHT side of the picture where a held item (book, wand, trophy) would be placed. If none is clear, give the best guess.
- `bakedItems`: a list of things already drawn on the creature, chosen from "scarf", "satchel", "badge", "crown", "cape" (for example a neckerchief is "scarf"; a bag strap is "satchel"; a crown on the head is "crown"). Empty list if none.
- `kind`: "monster".

## Output files (all inside `monster-work\anchors3\`)
1. `anchors3.json`: `{ "image_size": 512, "monsters": { "frostfluff_baby": { ...all fields above... }, ... } }` with exactly 15 keys.
2. For EVERY picture a check image `<name>_check.png`: the original picture with markers drawn by Python/Pillow: a red dot and a red horizontal line (length = hatWidth) at hatBase; a green dot and a green line (length = glassesWidth) at eyeCenter; a blue dot and a blue line (length = neckWidth) at neck; a yellow dot at chest; a purple dot at bodyCenter; an orange dot at pawRight.
3. **Self-check:** open each check image and look at it. If any marker is clearly wrong (hat line not on top of the head, glasses line not on the eyes, neck marker on the face, paw marker off the creature), fix the numbers and redraw, up to 3 rounds.
4. `LOG.txt`: one line per picture: `<name>: OK` or `<name>: UNSURE - <what you were unsure about>`.

## Finish
Confirm the counts: `anchors3.json` has 15 keys and 15 check images exist. Then stop and report which pictures are UNSURE. Do nothing else.
