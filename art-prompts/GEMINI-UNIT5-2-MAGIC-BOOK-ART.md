# Paste everything below the line into Gemini (the agent that can read and write files in this project)
# Run this AFTER "GEMINI-UNIT5-1-CONTENT.md" has finished.

---

You are the art generator for **The Magic Book**, an interactive version of Unit 5 for pupils aged 8 to 10. On the smartboard and tablets the book opens like a real book (pages turn with a page-curl and a sound), and the pictures on each page "pop out" of the paper in 3D and move a little; tapping things says their English word and opens games. Your job now is the **pictures**. Work through the whole job by yourself without asking me questions. I am away. If a picture fails, retry it up to 3 times, then skip it and log it as SKIPPED.

## Hard rules
- You may ONLY create PNG files and `PROGRESS.txt` inside `C:\Users\maysa\Desktop\DV\unit5-work\magic-book\` (create it). Do NOT edit, move, rename or delete any other file. Do NOT run git. Do NOT write code.
- **First read (read only):** `unit5-work\G3-UNIT5-CONTENT.md`, `unit5-work\G4-UNIT5-CONTENT.md` and the page images in `unit5-work\pages\`. Every picture you make must match what the book shows on that page (same people, objects and actions), so the children recognise it.
- Style: cute 3D mobile-game look, soft lighting, warm saturated colours, rounded shapes, the same family as `C:\Users\maysa\Desktop\DV\island\art\flat\c_benbow.webp` and `island\art\ch1\o_ship.webp`. Friendly, never scary. Mixed boys and girls and skin tones.
- **No text, letters, numbers or watermark inside any image.**
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.

## Picture types
**Type S (pop-up scene):** 16:9, 1920x1080, the scene from a book picture redrawn in the 3D style, with a **clear middle and a calm, simple background** so the main characters can be cut out and moved.
**Type A (cut-out):** square 1024x1024, ONE subject, centred, filling about 80%, on ONE flat plain light-grey background (#e8e8e8), no floor, no shadow, no outline.

## The pictures (about 14 per grade; make Grade 3 first, then Grade 4)
For **each grade** (`g3_` or `g4_` at the start of every file name):
1. `gX_cover.png` (S): the unit opener page as a magical 3D scene that sums up the unit.
2. `gX_scene_r1_a.png`, `gX_scene_r1_b.png`, `gX_scene_r1_c.png` (S): three scenes that tell **Reading 1** in order (beginning, middle, end), redrawn from the book's pictures.
3. `gX_scene_r2_a.png`, `gX_scene_r2_b.png` (S): two scenes for **Reading 2**.
4. `gX_word_<word>.png` (A): one cut-out for each of the **8 most important target words** (use the word in the file name, lower case, `_` for spaces; for example `g4_word_drum.png`). Each must clearly show that one thing or action.
5. `gX_char_main.png` (A): the main character of Reading 1, standing, friendly, full body.
6. `gX_char_main_wave.png` (A): the same character waving (same face, hair and clothes).

## Finish
Write `magic-book\PROGRESS.txt`: one line per picture (`file name - OK` or `file name - SKIPPED reason`), with the book page each picture is based on, then a last line `N OK of M`.
