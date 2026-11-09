# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the **Class Shop** of English Adventure Academy, a classroom platform for pupils aged 8 to 10. Pupils earn coins in English lessons and spend them on things for their monster pet. Right now many shop items are flat, simple drawings. I need real, beautiful pictures. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\store-work\items-3\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git, do NOT push, do NOT install anything, do NOT touch any code or any key.
- **First, look (read only) at 6 existing pictures in `C:\Users\maysa\Desktop\DV\assets\monsters\item-art\`** (for example `item_hat_wizard.webp`, `item_hat_crown.webp`, `item_glasses_goggles.webp`, `item_bp_explorer.webp`, `item_neck_medal.webp`, `item_outfit_cape.webp`) and at `C:\Users\maysa\Desktop\DV\platform-art\r_chest.webp`. All new pictures must look like the same family: cute 3D-rendered mobile-game style, soft studio lighting, glossy saturated child-friendly colours, rounded friendly shapes, a thick white sticker outline.
- Everything must be ORIGINAL. Do NOT copy any character, film, game, toy, brand or franchise (no famous video-game characters, no superhero logos, no film costumes). **No text, letters, numbers, logos or watermark inside any image.** Badges and patches show plain shapes only (a star, a heart, a moon).
- Friendly and gentle. Never scary, no weapons that look dangerous (swords, if any, are toy-like and rounded).
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.


## Picture types (PNG, use the exact file names)
**Type A: an item on its own.** Square 1:1, 1024x1024. ONE item, not worn by anyone, shown from a friendly 3/4 front view, centred, filling about 75% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, thick white sticker outline around the whole item.
- Clothes and costumes: shown as a floating 3D garment (like on an invisible small round body), so the shape is clear.
- Auras and trails (magic effects): a small round glowing cluster of the effect floating in the middle (for example a ring of sparkles, a swirl of petals), still with the sticker outline around the cluster.
- Body colours: a soft, fluffy round fur pom-pom in that exact colour with a little shine.
**Type B: a world (background).** Wide 16:9, 1600x900, a full scene with NO people, NO animals and NO text, same soft 3D style, no outline, a calm open middle and lower third (a monster will stand there).


## This batch (14 pictures). Do exactly these, in this order, nothing else.

1. `aura-blossom.png` (Type A, rare item, aura): **Blossom Aura**. Swirling pastel pink cherry blossom petals.
2. `cs-bubbles.png` (Type A, rare item, aura): **Bubble Cloud**. Bubbles floating around you.
3. `aura-flame.png` (Type A, rare item, aura): **Flame Aura**. Warm orange flames of relentless effort.
4. `cs-aura-hearts.png` (Type A, rare item, aura): **Heart Aura**. Hearts floating up into the sky.
5. `aura-ice.png` (Type A, rare item, aura): **Ice Aura**. Glittering snowflakes and frosty crystalline glow.
6. `cs-snowflakes.png` (Type A, rare item, aura): **Snowflakes**. Snowflakes falling softly.
7. `aura-star.png` (Type A, rare item, aura): **Star Aura**. Burst of dancing yellow and amber stars.
8. `bg-crystal.png` (Type B, rare item, background): **Crystal Cavern**. Luminescent cavern of glowing minerals.
9. `bg-desert.png` (Type B, rare item, background): **Desert Adventure**. Golden sand dunes under a warm sunny sky.
10. `bg-moonlit.png` (Type B, rare item, background): **Moonlit Kingdom**. Enchanted starry night under a glowing crescent moon.
11. `bg-volcano.png` (Type B, rare item, background): **Volcano Island**. Dramatic volcanic peaks with warm golden sunsets.
12. `bg-winter.png` (Type B, rare item, background): **Winter Wonderland**. Glistening snowy pines and frozen crystal lakes.
13. `cs-scuba-tank.png` (Type A, rare item, backpack): **Scuba Tank**. Two yellow air tanks.
14. `clothing-adv-jacket.png` (Type A, rare item, clothing): **Explorer Jacket**. Tough leather aviator jacket with fur collar.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 14.
