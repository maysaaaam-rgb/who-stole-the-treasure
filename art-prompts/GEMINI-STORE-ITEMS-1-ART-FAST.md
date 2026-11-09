# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the **Class Shop** of English Adventure Academy, a classroom platform for pupils aged 8 to 10. Pupils earn coins in English lessons and spend them on things for their monster pet. Right now many shop items are flat, simple drawings. I need real, beautiful pictures. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\store-work\items-1\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git, do NOT push, do NOT install anything, do NOT touch any code or any key.
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

1. `aura-sparkle.png` (Type A, common item, aura): **Sparkle Aura**. Twinkling golden friendship stars.
2. `bg-beach.png` (Type B, common item, background): **Adventure Beach**. Tropical shoreline with palm trees and gentle waves.
3. `bg-forest.png` (Type B, common item, background): **Enchanted Forest**. Misty woodland filled with glowing flora and fireflies.
4. `bg-meadow.png` (Type B, common item, background): **Explorer Camp**. Sunny meadow camp of Adventure Academy.
5. `body-pink.png` (Type A, common item, body): **Berry Pink**. Playful sweet berry pink coat.
6. `body-purple.png` (Type A, common item, body): **Lavender Purple**. Enchanted whimsical lavender.
7. `body-green.png` (Type A, common item, body): **Leaf Green**. Earthy vibrant fresh leaf green.
8. `body-blue.png` (Type A, common item, body): **Sky Blue**. Bright cheerful sky blue fur.
9. `body-orange.png` (Type A, common item, body): **Sunset Orange**. Energetic sunset orange fur.
10. `cs-apron.png` (Type A, common item, clothing): **Chef Apron**. A white apron with a big pocket.
11. `cs-scarf.png` (Type A, common item, clothing): **Warm Scarf**. A long red and white scarf.
12. `cs-diver-mask.png` (Type A, common item, glasses): **Diving Mask**. A blue mask with a snorkel.
13. `cs-pirate-patch.png` (Type A, common item, glasses): **Eye Patch**. A black patch for a brave pirate.
14. `cs-chef-hat.png` (Type A, common item, hat): **Chef Hat**. A tall white chef hat.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 14.
