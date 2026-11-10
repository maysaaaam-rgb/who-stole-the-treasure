Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

# Avatar clothes and hats (batch 1, 15 pictures)

Context: English Adventure Academy, pupils aged 8 to 10. Pupils now have cartoon kid avatars made of layers: a headless body (you already made `platform-work\avatars\test\body_medium.png`, 1024x1536) and a head. Shop clothes and hats must fit those layers exactly. I am away: work alone, retry a failed picture up to 3 times, then skip it and write it in the log.

## Hard rules
- You may ONLY create PNG files and one `PROGRESS.txt` inside `platform-work\avatars\wear\`. Do not edit, move or delete anything else. No git, no code.
- Read only: `platform-work\avatars\test\body_medium.png` (the body). Do NOT open the `photos` folder for this job. No real children in this batch.
- Style: the same soft 3D cartoon as the body, soft light, saturated colours, the same thick white sticker outline.
- Original designs only: no brands, logos, franchises or famous characters. No text, letters, numbers or watermark anywhere.
- Be honest in the log: write OK only for pictures you really made and looked at.

## The most important rule: EDIT, do not redraw
Every clothes picture is an EDIT of `body_medium.png`:
- Same canvas 1024x1536, same flat #e8e8e8 background, same pose, same size, same position, same arms, legs, trainers, same white outline. The neck stays empty (no head).
- Only ADD the new clothes on top. Nothing moves, not even by a few pixels. Trousers and trainers stay the same unless the item covers them.
- The program takes "your picture minus the plain body" to cut out the clothes, so any change outside the clothes spoils the item.

## Step 1: the head template (1 picture)
`head_template.png`: 1024x1024, flat #e8e8e8 background, ONE friendly generic cartoon kid head (not a real person), short neat dark-brown hair, facing front, soft 3D, white sticker outline, no neck below the chin. The chin sits at 78% of the height (y = 800), head centred, the head is about 640 px wide.

## Step 2: clothes on the body (8 pictures, each an edit of body_medium.png)
1. `clothing-hoodie.png`: cosy blue hoodie, hood down behind the neck, front pocket.
2. `clothing-school-jacket.png`: navy school blazer with a plain gold badge shape (no letters), open over the T-shirt.
3. `clothing-winter.png`: puffy red winter coat, white fluffy trim, closed.
4. `clothing-robe.png`: long purple wizard robe with small gold stars, to the knees.
5. `clothing-space.png`: white and orange space suit, covers body, arms and legs; no helmet.
6. `clothing-hero.png`: teal superhero suit with a short yellow cape behind the shoulders and a plain star on the chest.
7. `clothing-knight-armor.png`: shiny silver knight armour (chest plate, shoulder plates), friendly, not scary.
8. `cs-sport-shirt.png`: green and white team football shirt, no number.

## Step 3: hats and glasses on the head (6 pictures, each an edit of head_template.png)
Same rule: same canvas, same head, same place; only ADD the item.
9. `hat-crown.png`: small gold crown with red gems.
10. `hat-wizard.png`: tall blue wizard hat with silver stars.
11. `cs-chef-hat.png`: tall white chef hat.
12. `cs-pirate-hat.png`: black pirate tricorn hat with a plain gold trim.
13. `cs-beanie.png`: knitted red snow beanie with a white pom-pom.
14. `glasses-round.png`: round black glasses on the eyes.

## Finish
Write `PROGRESS.txt` in `platform-work\avatars\wear\`: one line per file (`OK` or `SKIPPED: reason`) and a last line `N/15 OK`.
