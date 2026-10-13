# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the 3D monsters of the children's English platform "English Adventure Academy" (pupils aged 8 to 10). The monsters wear accessories drawn as separate pictures. Glasses and necklaces do not sit well on every monster because the current pictures show the WHOLE object (glasses arms, straps, long chains, bands that wrap around). I need new **front-only** versions: show ONLY the part that is seen from the front, covering the eyes or hanging on the chest, with nothing that has to wrap around the head or neck. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`) inside `C:\Users\maysa\Desktop\DV\monster-work\acc-front\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **Look first (read only)** at the current pictures in `C:\Users\maysa\Desktop\DV\assets\monsters\item-art\`: `item_glasses_round.webp`, `item_glasses_sun.webp`, `item_glasses_star.webp`, `item_glasses_heart.webp`, `item_glasses_goggles.webp`, `item_neck_star.webp`, `item_neck_medal.webp`, `item_neck_pendant.webp`, `item_neck_badge.webp`, `item_neck_bowtie.webp`, `item_neck_bandana.webp`, `item_neck_bell.webp`. Keep the SAME style, colours, materials and details of each: cute 3D-rendered mobile-game style, glossy, soft lighting, the same shapes. Only remove what must wrap around or hang far away.
- Original art only. **No text, letters, numbers or watermark** in any image.
- Be honest in the log. Only write "OK" for pictures you actually generated and looked at.

## The 12 pictures (exact file names)
Every picture is square 1:1, 1024 x 1024, ONE object centred, filling about 85% of the frame width, on ONE flat plain light-grey background (#e8e8e8), no floor, no shadow on the ground, viewed straight from the FRONT, symmetrical.

**Glasses (5): show only the lens frames and the nose bridge. NO side arms (temples), NO straps, NO ear pieces. The two lenses must be clearly joined by a short bridge so the glasses read as glasses. Keep both lenses the same size.**
1. `glasses_round_f.png`: the two round gold-rimmed clear lenses with the little bridge (as `item_glasses_round`, without the arms).
2. `glasses_sun_f.png`: the two round black lenses with gold rims and bridge.
3. `glasses_star_f.png`: the two pink star-shaped frames with white lenses and the bridge.
4. `glasses_heart_f.png`: the two red heart-shaped frames with white lenses and the bridge.
5. `glasses_goggles_f.png`: the aviator goggles: the two round blue-lensed brown leather eye cups joined at the nose, **without the strap and without the side buckles**.

**Necklaces and neck items (7): show only what hangs on the chest or sits at the front of the neck. Keep any chain or ribbon VERY short (a small stub of about one pendant-width on each side that fades or ends cleanly), never a long loop.**
6. `neck_star_f.png`: the gold star pendant with only a short piece of gold chain stub on each side of the top.
7. `neck_medal_f.png`: the gold medal with the blue ribbon forming a short V above it (the ribbon ends just above the medal, no long loop).
8. `neck_pendant_f.png`: the teal gem pendant in its silver setting with a short silver chain stub on each side.
9. `neck_badge_f.png`: the round red-and-gold star badge with only a short piece of its coloured ribbon above it.
10. `neck_bowtie_f.png`: the red polka-dot bow tie ONLY (the knot and two wings), **without the band that goes around the neck**.
11. `neck_bandana_f.png`: the blue polka-dot bandana as a **triangle only**, the point facing down, with a short flat top edge, as seen when worn on the chest, no ties or knots behind.
12. `neck_bell_f.png`: the little golden bell with a short piece of the green collar band behind it (a short curved band stub on each side, not a full ring).

## Finish
Look at each picture: Is it clearly the same item as the original? Is anything left that would have to wrap around a head or neck? Is it symmetrical and centred? Redo any that fail (up to 3 tries each). Write `PROGRESS.txt`: one line per picture ("OK" or "SKIPPED reason"), then a last line `N/12 OK`. Do nothing else anywhere.
