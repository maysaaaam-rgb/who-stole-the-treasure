# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the 3D monsters of the children's English platform "English Adventure Academy" (pupils aged 8 to 10). Eight monster species exist. Five of them (aquafind, astralight, emberwing, florasprout, sparktail) have extra pictures that three newer species are MISSING: a **cracking egg** picture and four **expression poses** for the growing stage. Create the 15 missing pictures so that all eight species match. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`) inside `C:\Users\maysa\Desktop\DV\monster-work\poses3\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **Look first (read only).** For every species, open the existing pictures in `C:\Users\maysa\Desktop\DV\assets\monsters\art\` (512 x 512, transparent background):
  - the three NEW species you must extend: `breezefin_growing.webp` (a little whale with wing-like fins and a yellow bow), `frostfluff_growing.webp` (an ice owl with a purple neckerchief), `terrashell_growing.webp` (a brown turtle with a small blossoming tree on its shell and a green neckerchief), plus their `_egg.webp` pictures;
  - the finished examples to copy the idea from: `emberwing_growing.webp`, `emberwing_growing_cheer.webp`, `emberwing_growing_oops.webp`, `emberwing_growing_sleepy.webp`, `emberwing_growing_think.webp`, `emberwing_cracking.webp`, `aquafind_cracking.webp`, `astralight_growing_think.webp`.
- **Every new picture must show the SAME character as that species' `_growing.webp`**: same body shape, colours, size, outfit and accessories (neckerchief, bow, tree, crystals), same 3D mobile-game style, soft lighting, the same thick white sticker outline if the growing picture has one. Only the expression, pose or egg state changes. Do not redesign anything.
- Original art only. No franchises, brands or textbook illustrations. **No text, letters, numbers or watermark** in any image. Friendly and cute, never scary: the creature inside a cracking egg shows only two glowing friendly eyes.
- Be honest in the log. Only write "OK" for a picture you actually generated and looked at.

## Picture type (all 15)
Square 1:1, 1024 x 1024, ONE subject centred filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, nothing else in the frame (small sparkles and effects that belong to the pose are fine, kept close to the subject).

## The 15 pictures (exact file names)
For each species in turn (`breezefin`, `frostfluff`, `terrashell`):
1. `<species>_cracking.png`: the species' egg (same egg as `<species>_egg.webp`) with a bright crack across the middle, small pieces chipping off, and two glowing friendly eyes peeking out from inside.
2. `<species>_growing_cheer.png`: the growing monster celebrating: eyes happy and closed in a smile, mouth wide open in joy, arms/wings/fins raised, a few sparkles around.
3. `<species>_growing_oops.png`: the growing monster saying "oops": eyes wide, a small embarrassed smile or wobbly mouth, one limb touching the cheek or head, a tiny sweat drop. Gentle, not sad.
4. `<species>_growing_sleepy.png`: the growing monster sleepy: half-closed droopy eyes, mid-yawn with a small open mouth, relaxed shoulders.
5. `<species>_growing_think.png`: the growing monster thinking: eyes looking up and to the side, one limb at the chin, curious smile.
(That is 5 pictures per species x 3 species = 15.)

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line `N/15 OK`. Do nothing else anywhere.
