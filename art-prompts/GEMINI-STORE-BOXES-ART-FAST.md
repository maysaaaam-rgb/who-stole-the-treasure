# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the **Class Shop** of English Adventure Academy, a classroom platform for pupils aged 8 to 10. Pupils earn coins in English lessons and spend them on things for their monster pet. Right now many shop items are flat, simple drawings. I need real, beautiful pictures. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\store-work\boxes\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git, do NOT push, do NOT install anything, do NOT touch any code or any key.
- **First, look (read only) at 6 existing pictures in `C:\Users\maysa\Desktop\DV\assets\monsters\item-art\`** (for example `item_hat_wizard.webp`, `item_hat_crown.webp`, `item_glasses_goggles.webp`, `item_bp_explorer.webp`, `item_neck_medal.webp`, `item_outfit_cape.webp`) and at `C:\Users\maysa\Desktop\DV\platform-art\r_chest.webp`. All new pictures must look like the same family: cute 3D-rendered mobile-game style, soft studio lighting, glossy saturated child-friendly colours, rounded friendly shapes, a thick white sticker outline.
- Everything must be ORIGINAL. Do NOT copy any character, film, game, toy, brand or franchise (no famous video-game characters, no superhero logos, no film costumes). **No text, letters, numbers, logos or watermark inside any image.** Badges and patches show plain shapes only (a star, a heart, a moon).
- Friendly and gentle. Never scary, no weapons that look dangerous (swords, if any, are toy-like and rounded).
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.


## Picture types (PNG, use the exact file names)
**Type A.** Square 1:1, 1024x1024, ONE subject, centred, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, thick white sticker outline.
**Type B.** Wide 16:9, 1600x900, a full scene, no people, no text, no outline.

## The four mystery boxes (keep them a matching set: same chest shape and size, only the material changes)
A rounded treasure chest, a little chunky and cute, a big friendly lock plate in the middle (a plain heart-shaped keyhole), soft glow at the seams. Closed = lid shut, light leaking from the seam. Open = lid wide open, bright light and a few sparkles pouring out, the inside empty and glowing (no objects inside: the prize appears on the screen later).
- Bronze: warm copper-bronze metal bands on dark wood.
- Silver: shiny silver bands on pale blue-grey wood, cool white glow.
- Gold: polished gold bands on deep red wood, warm golden glow.
- Diamond: icy crystal-blue chest made of clear crystal and white metal, cyan glow, tiny diamonds on the corners.

## This batch (14 pictures). Do exactly these, in this order, nothing else.
1. `box_bronze.png` (Type A): the bronze chest, closed.
2. `box_bronze_open.png` (Type A): the bronze chest, open, light pouring out.
3. `box_silver.png` (Type A): the silver chest, closed.
4. `box_silver_open.png` (Type A): the silver chest, open.
5. `box_gold.png` (Type A): the gold chest, closed.
6. `box_gold_open.png` (Type A): the gold chest, open.
7. `box_diamond.png` (Type A): the diamond chest, closed.
8. `box_diamond_open.png` (Type A): the diamond chest, open.
9. `coin_pile.png` (Type A): a happy pile of shiny gold coins (plain coins, a star on each, no numbers).
10. `coin_one.png` (Type A): one big shiny gold coin with a star, slightly tilted.
11. `reward_ticket.png` (Type A): a golden ticket with a star and a ribbon, blank (no words): "a free class reward".
12. `jackpot_gem.png` (Type A): a huge sparkling rainbow gem with light rays: "the jackpot".
13. `shop_counter.png` (Type B): the inside of a cosy magical monster shop: wooden shelves with glowing jars and little boxes, warm lamps, a counter in the middle, the lower third calm and dark.
14. `shop_stage.png` (Type B): a dark round stage with soft spotlights from above and a glowing round pedestal in the middle (for showing a prize), deep blue-purple, no people.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 14.
