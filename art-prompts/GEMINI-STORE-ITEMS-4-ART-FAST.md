# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the **Class Shop** of English Adventure Academy, a classroom platform for pupils aged 8 to 10. Pupils earn coins in English lessons and spend them on things for their monster pet. Right now many shop items are flat, simple drawings. I need real, beautiful pictures. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\store-work\items-4\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git, do NOT push, do NOT install anything, do NOT touch any code or any key.
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

1. `cs-ninja-gi.png` (Type A, rare item, clothing): **Ninja Suit**. A black suit with a red belt.
2. `clothing-school-jacket.png` (Type A, rare item, clothing): **School Jacket**. Varsity jacket stitched with the Adventure Academy crest.
3. `cs-pyjamas.png` (Type A, rare item, clothing): **Star Pyjamas**. Soft striped pyjamas with little stars.
4. `cs-sport-shirt.png` (Type A, rare item, clothing): **Team Shirt**. A red team shirt with a white V neck.
5. `clothing-winter.png` (Type A, rare item, clothing): **Winter Outfit**. Puffy sky blue parka with warm fleece lining.
6. `cs-hero-mask.png` (Type A, rare item, glasses): **Hero Mask**. A blue mask with star corners.
7. `cs-ninja-mask.png` (Type A, rare item, glasses): **Ninja Mask**. A dark mask with sharp eyes.
8. `cs-binoculars.png` (Type A, rare item, glasses): **Ranger Binoculars**. Spot animals from far away.
9. `cs-robot-visor.png` (Type A, rare item, glasses): **Robot Visor**. A glowing blue scanner visor.
10. `cs-rock-shades.png` (Type A, rare item, glasses): **Star Shades**. Cool dark shades with gold stars.
11. `cs-detective-cap.png` (Type A, rare item, hat): **Detective Cap**. A checked cap with two little peaks.
12. `cs-pirate-hat.png` (Type A, rare item, hat): **Pirate Hat**. A black captain hat with a skull badge.
13. `cs-ranger-hat.png` (Type A, rare item, hat): **Ranger Hat**. A wide hat with a green band and a red feather.
14. `cs-tr-bubbles.png` (Type A, rare item, trail): **Bubble Trail**. Shiny bubbles rise wherever you go.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 14.
