# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the **Class Shop** of English Adventure Academy, a classroom platform for pupils aged 8 to 10. Pupils earn coins in English lessons and spend them on things for their monster pet. Right now many shop items are flat, simple drawings. I need real, beautiful pictures. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\store-work\items-7\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git, do NOT push, do NOT install anything, do NOT touch any code or any key.
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

1. `cs-wiz-hat.png` (Type A, epic item, hat): **Wizard Hat**. A tall purple hat with glowing stars.
2. `cs-tr-flames.png` (Type A, epic item, trail): **Flame Trail**. Friendly flames behind every step.
3. `acc-floating-stars.png` (Type A, legendary item, accessory): **Floating Stars**. Constellation of tiny playful stars hovering around.
4. `aura-dragon.png` (Type A, legendary item, aura): **Dragon Glow**. Fierce mystical dragon embers with golden crests.
5. `aura-cosmic.png` (Type A, legendary item, aura): **Galaxy Aura**. Orbital celestial stardust and nebula rings.
6. `aura-royal.png` (Type A, legendary item, aura): **Royal Glow**. Divine sovereign golden radiance and sparkles.
7. `bg-castle.png` (Type B, legendary item, background): **Academy Castle**. Majestic fairytale castle with towers and flags.
8. `bg-cloud.png` (Type B, legendary item, background): **Cloud Kingdom**. Dreamy kingdom perched atop soft pink and gold clouds.
9. `cs-fairy-wings.png` (Type A, legendary item, backpack): **Fairy Wings**. Shimmering fairy wings.
10. `cs-jetpack.png` (Type A, legendary item, backpack): **Rocket Jetpack**. Two silver rockets for super fast flying.
11. `clothing-dragon-armor.png` (Type A, legendary item, clothing): **Dragon Armor**. Scalemail armor forged from iridescent dragon scales.
12. `clothing-royal.png` (Type A, legendary item, clothing): **Royal Outfit**. Ceremonial coronation tunic embroidered with golden thread.
13. `clothing-royal-robe.png` (Type A, legendary item, clothing): **Royal Robe**. Crimson velvet robe edged in royal ermine fur.
14. `clothing-space.png` (Type A, legendary item, clothing): **Space Suit**. Hi-tech cosmic suit with glowing chest display.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 14.
