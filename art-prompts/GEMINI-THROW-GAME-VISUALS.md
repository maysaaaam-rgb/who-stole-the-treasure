# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are a senior children's game artist and front-end developer. You already built "Alley Fling: Cats vs Dogs" in `C:\Users\maysa\Desktop\DV\unit2-throw\index.html`. I opened it in a real browser and the **visuals are not good enough** for 8 to 10 year old pupils on a classroom smartboard. Your job now: make it look like a **real, fun kids' game** (think bright, juicy mobile cartoon games), create the real pictures for it, and prove with real browser screenshots that it looks right. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then use the fallback, note it in the log and continue.

## Hard rules
- You may ONLY edit/create files inside `C:\Users\maysa\Desktop\DV\unit2-throw\`. Do NOT touch any other file or folder. **Do NOT write to the `monster day\...\NH` mirror folder** (I told you to write only inside `unit2-throw`; the earlier copy there was a mistake. Do not copy there again). Do NOT run git.
- I already fixed one real bug in your file: `#screen-game` had `position: relative`, which overrode `.screen { position:absolute; inset:0 }` and made the whole game screen 0px tall (a blank dark screen). **Keep that fix.** Never give `#screen-game` `position: relative`.
- Keep the game rules, the question logic, the physics, the audio and the team logic working exactly as they are. This job is about **looks, layout, art and feel**. Do not break anything.
- NO TURKISH anywhere. Everything friendly: funny, never scary or violent.
- All art must be ORIGINAL cartoon art (no copying any existing game, character or franchise). No text, letters or numbers inside any picture (the game adds text).
- Pure HTML/CSS/JS, no libraries, no internet.

## What is wrong now (I saw this myself in the browser, fix all of it)
1. **The game does not feel like a kids' game.** The top bar is a dark navy "app dashboard" strip, the question overlay is a dark blurred sheet, and the scene is just a flat blue sky with nothing in it. It must feel like a colourful cartoon alley, not an admin app.
2. **The top HUD is cramped.** The 🔊 🎵 ⛶ ✕ buttons sit on top of the right team's name and part of its info (the dog's name and pupil name are covered). The Energy bars, Double/Shield buttons and the wind box are tiny. Nothing may overlap anything else. Redesign the HUD so each side has a big, readable panel: team icon, team name, current pupil's first name, a thick chunky Energy bar (rounded, glossy, colour changes green→yellow→red), and big Double/Shield buttons with clear icons and counts. Put the system buttons (🔊 🎵 ⛶ ✕) in their own small tray in a corner that overlaps nothing, or at the bottom.
3. **The alley is empty.** The cat, the dog, the fence, the bin, the box and the bowl are not clearly visible or not appealing. The scene must show the characters BIG (each about 25 to 30 percent of the screen height), with the fence in the middle, and a lively background.
4. **The question card hides the whole scene.** Make the question appear as a bright, rounded, sticker-like card in the centre that leaves the cat, dog and fence visible behind it (use a light, small-blur or no-blur backdrop, or place the card in the upper-middle and keep the characters visible underneath). Pupils should always feel they are "in the alley".
5. **Short screens.** My smartboard test window is only 1134 × 417 pixels (very wide and short). The game must still look great and have every button visible and clickable at **1920×1080, 1134×417, 1024×600, 800×520 and 1134×914**. Use `vh`-based sizes and check each of them.

## The new look (design brief)
- **Style:** bright, saturated, juicy cartoon: warm sunny alley, thick dark-purple outlines (#26215c), rounded shapes, soft shadows, glossy highlights, chunky 3D buttons with a thick bottom lip that pushes down 4px when pressed (springy bounce). Fredoka / Comic-style font. Match the kid-friendly look of my other games (open `unit2-arcade/index.html` and `bamboozle/index.html` and copy their feeling).
- **Scene layers** (back to front): sky with a sun and drifting fluffy clouds → far rooftops/houses in soft pastel → a brick wall with a window and a plant in a pot → the alley ground (cobbles or pavement) → the **tall wooden fence in the middle** (planks, nails, a knot hole; it grows when the level goes up) → left: the cat on a cardboard box beside a dented bin with a fish bone sticking out; right: the dog beside a red food bowl with a bone on it; a few details such as a flower pot, a bird on the wall, a hanging washing line. Add soft parallax or gentle idle motion where it is cheap (clouds, a bird, bobbing characters, tails).
- **Characters:** the cat and dog are friendly, round and funny. Idle bob, a squash-and-stretch on throw, a dizzy-stars wobble when hit, a happy jump when their team answers right, a cheer pose when winning.
- **Effects (all friendly):** a glowing dotted aim arc with little paw/bone/dot marks, a motion trail behind the flying object, a squash "BONK!" comic bubble, stars and a whipped-cream splat on a hit, a dust puff and "So close!" on a miss, confetti and a big "WIN!" banner at the end, sparkles when a bonus is earned, a short screen shake on a hit (small, never harsh).
- **Aiming screen:** big chunky Angle and Power controls (huge thumbs, labelled with icons), a big green 🎯 FLING! button with a pulse, and the angle/power numbers in a bold pill. Make the drag-on-the-character aiming obvious with an animated hand hint the first time.
- **Wind:** a clear, fun gauge with a flag or windsock that flaps with the wind direction and strength, and little leaves or lines blowing across the screen when it is strong.
- **Question card:** a bright rounded card with a coloured header tab ("🐱 Cats · Gökçe" style, but with the pupil's first name from the game), a big 🔊 button, big colourful answer buttons (red, blue, green, amber) with the letter badge on the left. Pictures/emoji in the question should be large.
- **Menu (settings) screen:** make it as colourful and polished as the game: big friendly title with the cat and dog characters on either side, bright chips, clear team lists with little animal-face avatars, a huge ▶ START FLING! button.
- **End screen:** celebratory, with both teams on stage, confetti, the winners' names, and the "Everyone played well!" line.

## Real pictures: create them
Create the pictures with your image generator. Save them into `C:\Users\maysa\Desktop\DV\unit2-throw\art-new\` as PNG files with the exact names below. Every character/object picture: square, ONE subject, centred, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, with a thick white sticker outline around the subject. Style for all: cute 3D-rendered mobile-game mascot look, round chubby shapes, big shiny expressive eyes, thick soft clean outline, saturated child-friendly colours, soft studio light from the top left, glossy highlights. Keep ONE consistent design for the cat and ONE for the dog in all poses.

Characters (1024×1024):
- `cat.png`: an orange tabby cat kit, sitting happily, one paw up, cheeky smile (also a little cute bandage on the ear is allowed).
- `cat_throw.png`: the same cat, mid-fling: leaning back and swinging one arm forward, tongue out in effort, ready to throw.
- `cat_hit.png`: the same cat, dizzy: spiral eyes, little stars circling its head, wobbly.
- `cat_win.png`: the same cat cheering, both paws up, eyes closed with joy.
- `dog.png`: a round grey-and-white floppy-eared dog pup, sitting, big goofy grin, tongue out.
- `dog_throw.png`: the same dog mid-fling, arm swung forward.
- `dog_hit.png`: the same dog dizzy with spiral eyes and stars.
- `dog_win.png`: the same dog cheering, tail wagging (motion marks allowed, no text), both paws up.

Objects (512×512): `yarn.png` (a red ball of yarn with a loose thread), `fish.png` (a cartoon silver-blue fish), `ball.png` (a bright yellow tennis ball), `bone.png` (a cartoon white dog bone).

Scenery props (512×512 or best fit, each on the same flat grey background): `bin.png` (a dented grey bin with a fish bone sticking out), `box.png` (a cardboard box), `bowl.png` (a red dog bowl with a bone on it), `fence.png` (a section of tall wooden fence, brown planks with nails, drawn straight-on, tileable height if you can).

Background (1920×1080, 16:9, **no characters**): `bg.png`, a sunny cartoon alley: pastel pastel houses and a brick wall, a window with flowers, a blue sky with soft clouds and a sun, a pavement. Leave the middle open (the fence is a separate layer) and keep the lower third plain enough that the characters and the question card stay readable.

If an image fails after 3 tries, skip it, log it, and keep a good CSS/emoji fallback for that item so the game still looks fine.

## Wire the pictures in (this part is code)
After the pictures exist I will cut out the grey backgrounds myself and save them as `.webp` files in `unit2-throw/art/`. Your code must:
1. Load pictures from `unit2-throw/art/` using these names: `cat.webp`, `cat_throw.webp`, `cat_hit.webp`, `cat_win.webp`, `dog.webp`, `dog_throw.webp`, `dog_hit.webp`, `dog_win.webp`, `yarn.webp`, `fish.webp`, `ball.webp`, `bone.webp`, `bin.webp`, `box.webp`, `bowl.webp`, `fence.webp`, `bg.webp`. Each is optional: use it if it loads, otherwise use a good CSS or emoji fallback. The game must look good both with and without any of them. (`bg.webp` is the full background.)
2. Switch character poses at the right moments: `*_throw` while throwing, `*_hit` when hit, `*_win` at the end, the plain one otherwise.
3. Make the characters, props and scenery work together on any aspect ratio (use a stage with a fixed 16:9 inner box, centred, that scales with the window, plus a background that fills the rest), so nothing is cut off or overlaps on short windows.
4. Keep all existing behaviour (turns, questions, aiming, physics, energy, winner logic, audio, speech, stickers).

## Quality bar (prove it with real screenshots)
1. Run a real syntax check on the JavaScript (`node --check` on the extracted script, or `new Function`).
2. **Open the game in a real browser** (use a local web server such as `python -m http.server`, or any browser automation you can run) and take screenshots of: the settings screen, a question, the aiming screen, a flying throw, a hit, a miss, and the end screen. Do this at **1134×417** and at **1920×1080** at least, and look at every screenshot carefully. Fix every overlap, cut-off, tiny text and hidden button you find. Save the screenshots in `unit2-throw\screens\` and list them in your report.
3. At the five screen sizes listed, check by script (`document.elementFromPoint` at the centre of every visible button) that no button is hidden or covered and none is outside the window.
4. Play two full games by automated clicks and make sure they finish with no console errors and no `undefined`, `null` or `NaN` on screen.
5. Check there is no Turkish text anywhere.
6. Update `unit2-throw\README.txt` (what art files exist and where they go) and append what you did to `unit2-throw\PROGRESS.txt`.

## Final report (short and honest)
Tell me: (1) what you changed, (2) which pictures you created and which failed, (3) the screenshots you took and what you fixed because of them, (4) the checks you ran and their real results, (5) anything you could not test and why. Do not claim a check passed unless you really ran it.
