Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are making pictures for "The Magic Book", a storybook reader on a classroom smartboard. Pupils are 8–10 years old (A1 English). Each picture becomes a LAYER of a living scene: a backdrop, plus separate cut-out characters and objects that we animate (they blink, wave, bob and pop forward when tapped). So characters must NEVER be painted into backdrops.

I am away. Work alone. If an image fails, retry up to 3 times, then skip it and write SKIPPED in the log.

## Hard rules
- You may ONLY create PNG files and one `PROGRESS.txt` inside `unit5-work\art-scenes\`. Create that folder. Do not edit, move or delete anything else. No git. No code.
- First LOOK (read only) at `unit5-work\magic-book\g3_char_main.png` and `unit5-work\magic-book\g4_char_main.png` if they exist, and at `island-work\monster-ref\` for the style. Match them.
- Style: cute 3D mobile-game look, soft warm lighting, rich saturated colours, rounded friendly shapes.
- Original art only: no textbook illustrations copied, no franchises, no brands, no real famous people.
- NO text, letters, numbers or watermarks anywhere in any image. Books, signs, screens and papers are blank or have simple shapes only.
- Friendly, never scary.
- Be honest in the log: write OK only for pictures you actually generated and looked at.

## Picture types
- **bg_** backdrops: portrait 3:4 (for example 1536x2048), a full painted place, NO people or animals. Keep the lower 45% fairly simple (floor, ground, street) because characters will stand there.
- **c_** characters and **o_** objects: 1024x1024, ONE flat plain #e8e8e8 background, whole body or whole object visible with space around it, thick white sticker outline, soft shadow under the feet only. Front or 3/4 view, standing (not cut off).

## Fixed character designs (keep them identical)
- **Jannah**: 9-year-old Egyptian girl, warm brown skin, dark curly hair in two puffs, big round RED glasses, light-blue pyjamas with small yellow stars, bare feet with pink slippers.
- **Old woman**: kind elderly Egyptian woman from ancient times, white linen dress, wide gold-and-turquoise collar necklace, grey hair in a simple bun, a gentle smile, squinting a little (she can't see well).
- **Young pharaoh**: friendly boy pharaoh about 12, blue-and-gold striped headdress, gold collar, white kilt, proud but kind face.
- **Sound artist (Maya)**: young woman, short purple hair, big orange headphones around her neck, green overalls with many pockets.
- **Drummer girl (Lina)**: girl about 12, dark braids tied with yellow ribbons, simple green dress, BARE FEET, calm happy face.

## The 14 pictures (exact file names)

Grade 3 — "Let's Go Back"
1. `bg_g3_bedroom.png` — a cosy child's bedroom at night: bed with a patterned blanket, a little lamp glowing, bookshelf, window with stars and a distant city with a minaret. Empty of people.
2. `c_g3_jannah.png` — Jannah standing, holding an open book, looking amazed.
3. `o_g3_timebook.png` — a magical old book, slightly open, warm golden light and sparkles coming out of the pages, decorated cover with a sun-and-sand pattern (no letters).
4. `bg_g3_egypt_street.png` — an ancient Egyptian city street in sunshine: sandstone houses, palm trees, colourful market stalls, pyramids far away. Empty of people.
5. `c_g3_oldwoman.png` — the old woman, one hand shading her eyes.
6. `o_g3_chariot.png` — the young pharaoh standing in a golden two-wheeled chariot pulled by ONE friendly white horse, side view, everything visible.
7. `bg_g3_garden_dig.png` — a sunny school garden with a freshly dug hole in the middle, a small spade stuck in the earth, flowers and a fence. Empty of people.
8. `o_g3_timecapsule.png` — a shiny metal time-capsule box, open, with a toy car, a photo (blank), a small teddy, a music disc and a rolled letter inside.

Grade 4 — "Make Some Noise"
9. `bg_g4_studio.png` — a fun movie sound studio: a big blank screen on the wall, microphones on stands, a table full of everyday objects, soft purple and orange lights. Empty of people.
10. `c_g4_maya.png` — Maya the sound artist, smiling, banging two half coconut shells together.
11. `o_g4_soundprops.png` — a neat pile of sound-making things: a metal sheet, a bunch of keys, a pair of old boots, a rubber glove, crinkly paper, a celery stick.
12. `bg_g4_stage.png` — a concert stage with warm spotlights, red curtains and a wooden floor; rows of empty seats at the bottom edge. Empty of people.
13. `c_g4_lina.png` — Lina the drummer standing barefoot, holding two soft drumsticks, eyes closed and smiling, feeling the music.
14. `o_g4_bigdrum.png` — a big orchestral drum (timpani) with a golden body, glowing sound waves rising from it.

## Finish
Write `unit5-work\art-scenes\PROGRESS.txt` with one line per picture (`name — OK` or `name — SKIPPED (reason)`), and a last line `N/14 OK`.
