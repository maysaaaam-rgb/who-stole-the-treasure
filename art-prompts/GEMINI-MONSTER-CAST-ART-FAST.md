# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for a new set of English lessons for children aged 8 to 10 (Grades 3 and 4, beginners, level A1). The lessons will be led by a cast of five friendly monster characters who talk to the children, react and celebrate. I need the first pictures of this cast. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\lingo-work\art-cast\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **First, look (read only) at these existing monster pictures:** in `C:\Users\maysa\Desktop\DV\assets\monsters\art\` open `aquafind_growing.webp`, `aquafind_growing_cheer.webp`, `emberwing_growing.webp`, `florasprout_growing.webp`, `astralight_growing.webp` and `astralight_growing_cheer.webp`. The new cast must look like the same family: cute 3D-rendered mobile-game mascot style, glossy soft lighting, big shiny eyes, saturated child-friendly colours, rounded chubby shapes, and the same quality. The cast should look a little more polished and expressive than these, like characters from a top children's learning app.
- Everything must be ORIGINAL cartoon art. Do NOT copy any character, film, game, app, brand or franchise.
- **No text, letters, numbers or watermark inside any image.**
- Friendly, gentle and happy. Never scary.
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.

## Fixed character designs (keep each one IDENTICAL in every picture: same shape, colours, markings and accessory)
- **Bubbles** (blue, curious): based on the blue axolotl in `aquafind_growing.webp`: a light sky-blue baby axolotl with frilly turquoise gills on both sides of the head, a white tummy, a short tail, and a small turquoise neckerchief. Big round curious eyes. Two or three tiny shiny bubbles float near the head.
- **Blaze** (orange, brave): based on the bird in `emberwing_growing.webp`: a round orange-and-red baby fire bird with a flame-shaped crest of feathers on the head, small wings, a cream tummy, a green neckerchief. Confident big smile.
- **Sprout** (green, kind): based on the bunny in `florasprout_growing.webp`: a soft light-green bunny with long leaf-shaped ears, a tiny two-leaf sprout growing on top of the head, a cream tummy, pink cheeks and a pink neckerchief. Gentle, calm face.
- **Nova** (purple, clever): based on the cat in `astralight_growing.webp`: a purple cat with a small crescent-moon mark on the forehead, tiny star sparkles on the fur, a cream tummy, a dark-blue neckerchief with a small gold star, and a tail with a glowing star at the tip. Wise, friendly smile.
- **Rosie** (pink, funny): a NEW character in the same family: a round, fluffy bubble-gum-pink baby fox-puppy with big floppy ears that have darker pink heart-shaped tips, a heart-shaped mark on the white tummy, rosy cheeks, a short fluffy tail with a heart-shaped tip, and a light-yellow neckerchief. Big, cheeky, giggly smile.

## The three pictures for each character (this is important)
For every character make three pictures that are the SAME picture except for the face, so that the lesson can switch between them to make the character talk and blink:
1. **idle**: standing, facing the viewer, one paw/wing raised in a small friendly wave, eyes open, mouth closed in a gentle smile.
2. **talk**: make this by EDITING picture 1: change ONLY the mouth to open (as if saying "ah"). Everything else must stay exactly the same: same pose, size, position, colours, lighting and outline.
3. **blink**: make this by EDITING picture 1: change ONLY the eyes to happily closed (curved lines). Everything else must stay exactly the same.

## Picture type and size (PNG, use the exact file names)
Square 1:1, 1024x1024. ONE character, centred, full body, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, thick white sticker outline around the whole character. The character stands in the same place and at the same size in all three of its pictures.

## FIRST BATCH ONLY (15 pictures). Do exactly these, in this order, nothing else.

1. `c_bubbles_idle.png`
2. `c_bubbles_talk.png` (edit of 1: only the mouth open)
3. `c_bubbles_blink.png` (edit of 1: only the eyes closed)
4. `c_blaze_idle.png`
5. `c_blaze_talk.png` (edit of 4)
6. `c_blaze_blink.png` (edit of 4)
7. `c_sprout_idle.png`
8. `c_sprout_talk.png` (edit of 7)
9. `c_sprout_blink.png` (edit of 7)
10. `c_nova_idle.png`
11. `c_nova_talk.png` (edit of 10)
12. `c_nova_blink.png` (edit of 10)
13. `c_rosie_idle.png`
14. `c_rosie_talk.png` (edit of 13)
15. `c_rosie_blink.png` (edit of 13)

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 15. For every talk and blink picture also write whether it really matches its idle picture (same pose, size and position), "MATCHES" or "DIFFERENT".
