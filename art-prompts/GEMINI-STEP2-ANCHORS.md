# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are helping me place accessories (hats, glasses, necklaces, backpacks, scarves, held items) on 30 cartoon monster pictures for my children's English learning platform. Work through the whole job by yourself without asking me questions. I am away. If something fails, retry up to 3 times, note it in the log, and continue.

## Hard rules
- You may ONLY create files inside these two folders: `C:\Users\maysa\Desktop\DV\art-prompts\anchors\` and `C:\Users\maysa\Desktop\DV\assets\monsters\anchor-check\`. Create them if missing.
- Do NOT edit, move, rename or delete any other file. Do NOT touch code (.js .html .css). Do NOT run git.
- You may run Python with Pillow to draw marker overlays for checking. Do not install anything.

## Input
The 30 monster pictures in `C:\Users\maysa\Desktop\DV\assets\monsters\new\` (1024 x 1024 pixels, JPEG data with a .png name):
species: emberwing, aquafind, florasprout, astralight, sparktail
stages: egg, baby, growing, adventurer, advanced, ultimate
file name pattern: `<species>_<stage>.png` (for example `emberwing_baby.png`). Ignore the folder `_old_lookalikes`.
The 5 egg pictures are special: only fill the field `kind: "egg"` and skip the rest for eggs.

## Task: look at every picture and measure these points
All coordinates are in PIXELS of the 1024 x 1024 picture, x from the left, y from the top. Be as accurate as you can. Look at each picture carefully; do not copy values between pictures, because each one is posed and scaled differently.

For each monster picture (not egg) give:
- `hatBase`: {x, y} the point on the TOP of the head, centred between the ears/horns/crest, where the bottom edge of a hat would sit.
- `hatWidth`: number, the width in pixels a hat should have to look right on this head (about the width of the head at that height).
- `eyeCenter`: {x, y} the point exactly halfway between the two eyes.
- `eyeSpan`: number, the distance in pixels between the centres of the two eyes. If the creature faces slightly sideways, still give the midpoint and distance of the visible eyes.
- `glassesWidth`: number, the width glasses should have to cover both eyes with a little margin.
- `neck`: {x, y} the centre of the neck/collar line where a necklace or scarf would sit (the line between head and body).
- `neckWidth`: number, the width of the neck/collar area in pixels where a scarf would wrap.
- `chest`: {x, y} the centre of the chest, about one head-height below the neck.
- `bodyCenter`: {x, y} the centre of the body (used to place a backpack or cape behind it).
- `bodyHeight`: number, the height of the body from neck to feet in pixels.
- `pawRight`: {x, y} the paw/hand/hoof on the RIGHT side of the picture, where a held item (book, wand, trophy) would be placed. If there is no clear paw, the best guess at the right-side hand position.
- `bakedItems`: a list of items already drawn on the creature, chosen from: "scarf", "satchel", "badge", "crown", "cape". Example: a creature wearing a neckerchief has "scarf"; a creature with a bag strap across the chest has "satchel"; a chest emblem is "badge"; a crown or tiara on the head is "crown"; a cape is "cape". Use [] if none.
- `kind`: "monster".

## Output files
1. `C:\Users\maysa\Desktop\DV\art-prompts\anchors\anchors.json` with exactly this structure (one key per picture name without extension, all 30 keys present):
```
{
  "image_size": 1024,
  "monsters": {
    "emberwing_egg": { "kind": "egg" },
    "emberwing_baby": {
      "kind": "monster",
      "hatBase": {"x": 512, "y": 240}, "hatWidth": 300,
      "eyeCenter": {"x": 512, "y": 420}, "eyeSpan": 180, "glassesWidth": 300,
      "neck": {"x": 512, "y": 600}, "neckWidth": 260,
      "chest": {"x": 512, "y": 700},
      "bodyCenter": {"x": 512, "y": 700}, "bodyHeight": 400,
      "pawRight": {"x": 700, "y": 720},
      "bakedItems": []
    }
  }
}
```
(The numbers above are only an example of the format. Measure every picture yourself.)

2. Checking pictures: for EVERY monster picture write `C:\Users\maysa\Desktop\DV\assets\monsters\anchor-check\<name>_check.png`, which is the original picture with markers drawn by a Python/Pillow script: a red dot at hatBase with a red horizontal line of length hatWidth; a green dot at eyeCenter with a green horizontal line of length glassesWidth; a blue dot at neck with a blue horizontal line of length neckWidth; a yellow dot at chest; a magenta dot at bodyCenter; a cyan dot at pawRight. Label each marker with a tiny letter (H, E, N, C, B, P).

3. Self-check loop: open each check picture and look at it. If any marker is clearly wrong (for example the hat line is not on top of the head, the glasses line is not on the eyes, the neck marker is on the face), correct the numbers in anchors.json and redraw that check picture. Do at most 2 correction rounds per picture.

4. Log: `C:\Users\maysa\Desktop\DV\art-prompts\anchors\LOG.txt`, one line per picture: `<name>: OK` or `<name>: UNSURE - <what you were unsure about>`.

## Finish
Confirm counts: anchors.json has 30 keys (5 eggs + 25 monsters), anchor-check has 25 pictures. Then stop and report which pictures are UNSURE. Do nothing else.
