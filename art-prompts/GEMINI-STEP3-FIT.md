# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the fitting artist for my children's English learning platform. Cartoon accessories (hats, glasses, necklaces, scarves, held items, vests, capes, backpacks) are laid on top of 25 illustrated monster pictures. Right now they are placed badly: some float above heads, some sit on the wrong part of the body, some look like flat stickers. Your job is to find, for every monster, the position and size that makes every item look properly WORN, and write those numbers down so my code uses them.

Work through the whole job by yourself, without asking me questions. I am away. If something fails, retry up to 3 times, log it, and continue.

## Hard rules
- You may ONLY create or overwrite files inside these two folders (create them if missing):
  `C:\Users\maysa\Desktop\DV\art-prompts\anchors\`  and  `C:\Users\maysa\Desktop\DV\assets\monsters\fit-check\`
- Do NOT edit, move, rename or delete any other file. Do NOT edit `anchors.json` (the old one). Do NOT touch code (.js .html .css). Do NOT run git. Do NOT install anything.
- You may run Python with Pillow (PIL) and numpy for compositing. Write your scripts only to your own scratch folder.

## What you read first
1. `C:\Users\maysa\Desktop\DV\js\monster-dressup.js`: the `RULE` table (how each item is placed), the `FILE` table, and `isHiddenByBaked`. This is the exact code that runs on the platform.
2. `C:\Users\maysa\Desktop\DV\js\monster-anchors.js`: `MONSTER_ANCHORS` (the current measured points of each monster) and `MONSTER_ITEM_BOX` (the visible box of each accessory picture, as fractions 0..1).
3. Monster pictures (transparent, 512x512 WebP): `C:\Users\maysa\Desktop\DV\assets\monsters\art\<species>_<stage>.webp`
   species: emberwing, aquafind, florasprout, astralight, sparktail. stages used for fitting: baby, growing, adventurer, advanced, ultimate (25 monsters; eggs are skipped).
4. Accessory pictures (transparent, 512x512 WebP): `C:\Users\maysa\Desktop\DV\assets\monsters\item-art\item_<name>.webp`
   names: hat_crown hat_explorer hat_scholar hat_wizard hat_bow hat_starclip hat_flower hat_headband, glasses_round glasses_goggles, neck_star neck_medal neck_pendant neck_badge, outfit_scarf outfit_vest outfit_hoodie outfit_cape, bp_explorer bp_book bp_miniwings bp_adventure, held_book held_wand held_compass held_trophy held_microphone.

## The exact placement formula the platform uses (copy it into your Python compositor)
All coordinates are in a 1024 x 1024 space. (The WebP pictures are 512 px: draw on a 1024 canvas and upscale the monster and each item x2 so you see the same thing the platform shows.)
For an item with rule R (from the RULE table), box = MONSTER_ITEM_BOX[item], and the monster's anchors A:
```
contentW = A[R.base] * R.w                 # wanted width of the VISIBLE part of the item
imgW     = contentW / (box.r - box.l)      # width of the whole item picture (it is square)
px = (box.l + box.r) / 2
py = box.b if R.from == 'bottom' else box.t if R.from == 'top' else (box.t + box.b) / 2
cx = A[R.at].x + (R.dx or 0) * A[R.base]
cy = A[R.at].y + (R.dy or 0) * A[R.base]
left = cx - px * imgW ;  top = cy - py * imgW
draw the item picture resized to imgW x imgW with its top-left corner at (left, top)
```
Draw order, back to front: items with z=5 (backpacks, cape) first, then the monster, then z=30 (outfits), z=40 (neck items), z=50 (glasses), z=60 (hats), z=70 (held items).
Items hidden because the monster already wears something (from `bakedItems` and `isHiddenByBaked`): skip them.

## What "worn properly" means (your pass/fail rules, look at every picture)
- HATS: the hat's lower edge overlaps the top of the head by about 10-20% of the hat height. No gap between hat and head. Centred on the head, level. Ears, horns and crests may poke out around it. A hat must not cover the eyes. Small hats (bow, star clip) sit on the top of the head on one side. Ring hats (flower crown, headband) wrap around the head just above the eyes, like a crown.
- GLASSES: centred on the middle of the two eyes. Each lens fully covers its eye with a small margin. The frame width is about the outer width of both eyes plus 10%. Level.
- SCARF: wraps the neck right under the chin, covering the head/body join. Not on the belly, not over the mouth.
- NECKLACES, MEDAL, BADGE: the chain/ribbon goes around the neck and the pendant hangs on the upper chest, centred on the body, not over the mouth.
- VEST and HOODIE: covers the torso from the shoulders down to the belly. About as wide as the body. Arms stay visible if possible. Must not look like a small patch on the belly or a giant coat.
- CAPE: hangs behind the shoulders and is visible on both sides of the body and below the arms. Not a skirt around the legs.
- BACKPACKS: must be partly visible behind the shoulders (peeking out both sides and above the shoulders). If a backpack cannot be made visible for a monster, say so in the log.
- HELD ITEMS: sit in the right-hand paw/hand/hoof (the one on the RIGHT side of the picture) so it looks held. If the paw is down by the side, the item is held low next to the body.
- Nothing may float, nothing may cover the whole face, and every item must be clearly smaller or larger in a believable way for that monster. Items must look like they belong to the monster's body size (a baby monster gets smaller items than an ultimate one, because the anchors scale with the monster).

## Your job, step by step
For EACH of the 25 monsters:
1. Compose three test pictures with the formula above, using the current anchors (loaded from monster-anchors.js):
   - Variant A: hat_crown + glasses_round + neck_star + outfit_scarf
   - Variant B: hat_wizard + glasses_goggles + outfit_vest + held_wand
   - Variant C: hat_explorer + neck_medal + outfit_cape + bp_explorer (draw the backpack and cape behind the monster)
   (leave out any item hidden by the monster's bakedItems)
2. Look at each picture carefully with the rules above. Decide what is wrong.
3. Correct the monster's anchors (new numbers) and recompose. Repeat up to 3 rounds per monster until all three variants look right.
4. After the anchors are right, test ALL the other items on that monster (use two more composites): one with hat_bow + hat_starclip is not possible together, so test them one at a time against the monster's head and just check by eye; and one with bp_book, held_trophy, outfit_hoodie, neck_badge, neck_pendant, hat_flower, hat_headband, hat_scholar, glasses_round. If an item looks wrong on THIS monster even though the others look right, record a per-monster override for that one item.

## Anchor fields
Use exactly the same field names as in monster-anchors.js and add ONE new field:
`hatBase {x,y}`, `hatWidth`, `eyeCenter {x,y}`, `eyeSpan`, `glassesWidth` (keep it, not used any more), `neck {x,y}`, `neckWidth`, `chest {x,y}`, `bodyCenter {x,y}`, `bodyHeight`, `pawRight {x,y}`, `bakedItems`, `kind`,
NEW: `bodyWidth`: the width of the torso at chest level in pixels (used to size vests, hoodies and capes).
Keep `kind:"egg"` entries for the 5 eggs exactly as before.
Meaning of the points (so everyone measures the same thing):
- `hatBase`: on the top of the head, centred between the ears/horns/crest, at the highest point of the skull (not the tip of a crest or ear).
- `hatWidth`: width of the head at the height just below hatBase, where a hat brim would sit.
- `eyeCenter` / `eyeSpan`: midpoint between the two eyes, and the distance between the two eye centres.
- `neck` / `neckWidth`: the centre of the chin/neck line (the head/body join), and the width of the neck/collar there.
- `chest`: centre of the upper chest, a bit below the neck. `bodyCenter`: centre of the torso. `bodyHeight`: neck to feet.
- `pawRight`: the paw on the right side of the picture.

## Per-monster overrides (only where needed)
If one item needs a different placement on one monster than the shared rule gives, write an override with the CHANGE relative to the rule, using these numbers:
`{ "dw": <multiply the width by this, e.g. 1.15>, "dx": <add this to the rule's dx>, "dy": <add this to the rule's dy> }`
dx and dy are multiples of the item's base width, exactly like the RULE table. Use overrides sparingly, only when moving the anchors would break another item.

## Global rule suggestions
If you find that one item is wrong on MANY monsters in the same way (for example the vest is always too small), do not use 25 overrides. Write a suggestion for the shared rule instead: the new `w`, `dx`, `dy`, `from` or `at` for that item, and why. I will apply those to the code myself.

## Output files (all of them)
1. `C:\Users\maysa\Desktop\DV\art-prompts\anchors\anchors_v2.json`
```
{ "image_size": 1024, "monsters": { "<name>": { ...same fields as before plus "bodyWidth"... }, ... all 30 keys incl. 5 eggs } }
```
2. `C:\Users\maysa\Desktop\DV\art-prompts\anchors\overrides.json`
```
{ "<monster name>": { "<item name e.g. hat_explorer>": { "dw": 1.0, "dx": 0.0, "dy": 0.0 } } }
```
(only the monsters and items that need one; {} if none)
3. `C:\Users\maysa\Desktop\DV\art-prompts\anchors\rule-suggestions.json`
```
{ "<item name>": { "w": 1.0, "dx": 0, "dy": 0, "from": "bottom|center|top", "at": "<anchor name>", "reason": "short" } }
```
4. Final proof pictures: for every monster, the three variants A, B and C composed with your FINAL numbers (anchors_v2 + overrides, and with the rule suggestions applied as if I had adopted them), saved as `C:\Users\maysa\Desktop\DV\assets\monsters\fit-check\<monster>_A.png`, `_B.png`, `_C.png` (1024 x 1024, light grey background #e8e8e8 behind the monster).
5. `C:\Users\maysa\Desktop\DV\art-prompts\anchors\FIT-LOG.txt`: one line per monster: `<monster>: PASS` or `<monster>: PROBLEM - <item> - <what is still wrong>`. Add a final summary: how many monsters pass, and the items that are the weakest overall.

## Finish
Confirm counts: anchors_v2.json has 30 keys, fit-check has 75 pictures. Then stop and report, in plain words, which items still look wrong and why. Do nothing else.
