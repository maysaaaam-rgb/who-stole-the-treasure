# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for **Treasure Island, Chapter 1: Admiral Benbow Harbour**, a game for pupils aged 8 to 10. Four pictures in the game are copies of other pictures, so they look wrong. Please draw these four again, each one different. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\island-work\art-ch1-fix\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code. Do NOT replace the files in `island\art\`; I will do that.
- **First, look (read only) at `c_jim.webp`, `c_jim_happy.webp`, `o_billy_chest.webp` and `o_map_scroll.webp` in `C:\Users\maysa\Desktop\DV\island\art\flat\`.** The new pictures must match them exactly in style: chibi storybook cartoon, soft dark-brown outlines, warm pirate colours, the same characters and objects.
- Everything must be ORIGINAL art. No copying of any film, book illustration, game or brand.
- **No text, letters, numbers or watermark inside any image.**
- Friendly and gentle, never scary. No weapons.
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at, and check that each new picture is really different from the existing ones.

## Fixed designs
- **Jim Hawkins**: exactly as in `c_jim.webp`: a boy about 10, messy light-brown hair, cream shirt, blue waistcoat, brown shorts, brown boots.
- **Billy Bones's sea chest**: exactly as in `o_billy_chest.webp`: a brown wooden chest with gold metal corners and rope handles.
- **The treasure map**: the same parchment, palm tree, dotted path and red X as in `o_map_scroll.webp`.

## Picture type and size
**Type A** for all four: square 1:1, 1024x1024, ONE subject, centred, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, no white sticker outline (same as the existing Chapter 1 pictures).

## The four pictures (PNG, use the exact file names)

1. `c_jim_idea.png`: Jim Hawkins having an idea: one finger pointing up, eyes wide and bright, a happy "I know!" smile. Not waving (that is `c_jim_happy`).
2. `o_chest_open.png`: Billy Bones's sea chest with the lid wide open and the padlock unlocked, hanging open on the side or lying on the ground next to it. Inside: one rolled-up old map and a few gold coins. The lock must clearly be OPEN.
3. `o_map_piece1.png`: ONE torn piece of the treasure map: only the top-left corner of the parchment, with a ragged torn edge on the right and bottom, showing part of the dotted path and a palm tree. NOT the whole map, and no red X.
4. `o_treasure_gold.png`: a small happy heap of gold coins with a few sparkles, a gold cup and one string of pearls. No chest.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 4.
