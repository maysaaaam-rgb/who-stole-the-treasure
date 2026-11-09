# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the **Class Shop** of English Adventure Academy, a classroom platform for pupils aged 8 to 10. Pupils earn coins in English lessons and spend them on things for their monster pet. Right now many shop items are flat, simple drawings. I need real, beautiful pictures. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\store-work\items-5\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git, do NOT push, do NOT install anything, do NOT touch any code or any key.
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

1. `cs-tr-hearts.png` (Type A, rare item, trail): **Heart Trail**. Hearts float up behind you.
2. `cs-parrot.png` (Type A, epic item, accessory): **Pirate Parrot**. A colourful parrot on your shoulder.
3. `cs-guitar.png` (Type A, epic item, accessory): **Rock Guitar**. A red electric guitar.
4. `acc-companion.png` (Type A, epic item, accessory): **Tiny Companion**. Miniature floating sprite friend.
5. `cs-aura-fire.png` (Type A, epic item, aura): **Fire Aura**. Friendly flames dancing around you.
6. `aura-lightning.png` (Type A, epic item, aura): **Lightning Aura**. Crackling electric blue sparks of energy.
7. `aura-rainbow.png` (Type A, epic item, aura): **Rainbow Aura**. Radiant prismatic halo of colorful joy.
8. `bg-rainbow.png` (Type B, epic item, background): **Rainbow Valley**. Pastel valley crowned with a double rainbow.
9. `bg-cosmos.png` (Type B, epic item, background): **Space World**. Deep starry cosmos with vibrant nebula clouds.
10. `bg-underwater.png` (Type B, epic item, background): **Underwater Kingdom**. Deep ocean coral reef with shimmering sunbeams.
11. `cs-robot-pack.png` (Type A, epic item, backpack): **Gear Backpack**. Spinning gears and glowing wires.
12. `cs-hero-cape.png` (Type A, epic item, backpack): **Hero Cape**. A flowing red cape with a gold clasp.
13. `cs-leaf-cape.png` (Type A, epic item, backpack): **Leaf Cape**. A green cape made of forest leaves.
14. `body-gold.png` (Type A, epic item, body): **Royal Gold**. Radiant gleaming gold sheen.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 14.
