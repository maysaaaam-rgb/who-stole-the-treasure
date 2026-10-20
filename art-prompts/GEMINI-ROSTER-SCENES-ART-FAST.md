# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for a new look of the platform's class roster: a living **scene** where each pupil's monster stands on its own pedestal (pupils aged 8 to 10). The scene changes with the season or the lesson theme. This batch has **4 themes** (Meadow, Alice Tea Party, Chuseok Night, Halloween), each with a background, a pedestal and a resting spot. Everything must be friendly and calm, never scary. I am away, so work alone. If an image fails, retry up to 3 times, then skip it and log "SKIPPED".

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\unit4-work\art-roster-scenes\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch the platform or any code.
- **First, look (read only) at a few pictures in `C:\Users\maysa\Desktop\DV\unit4-work\art-g4-show\` and `C:\Users\maysa\Desktop\DV\alice-party-home\week2-art\` (if it exists).** Match that style: cute 3D mobile-game look, soft lighting, saturated colours, thick white sticker outline on cut-out pictures.
- **Original art only.** No franchises, no brands, no existing game or film characters. For the Alice theme use only generic storybook ideas (a teapot table, playing-card shapes, a rabbit hole, giant mushrooms, pocket watches, a checkerboard floor): do NOT copy any film, book illustration or Disney design. If you look at reference pictures online, use public-domain or CC0 sources only, redraw your own version, and write the links and licences in `SOURCES.txt`.
- **No text, letters or numbers inside any image.** Signs, banners and cards are blank.
- **No food and no drinks anywhere** (no cakes, fruit, sweets, tea cups with drinks, bowls of food). Teapots and cups may appear only EMPTY and closed.
- Calm and kind. No blood, no weapons, nothing scary, even for Halloween (smiling pumpkins, friendly ghosts, soft purple night).
- Be honest in the final log: "OK" only for a picture you actually generated and looked at.

## Picture types
**Type B (backgrounds):** wide 16:9, 1920x1080, a full scene with NO characters and NO text. The **top 40%** shows the scenery (sky, hills, buildings). The **bottom 60%** is a calm, open, even ground area (grass, floor, stage, path) with only soft detail, because 24 pupils' monsters will stand there on pedestals. No tall objects in the bottom 60%. Soft 3D, no outline.
**Type A (objects):** square 1:1, 1024x1024, ONE subject, centred, about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no shadow, thick white sticker outline. Pedestals are round, low and wide so a character can stand on top (a seen-from-slightly-above view, flat top clearly visible).

## The pictures (exact file names, PNG)
Meadow (the everyday theme):
1. `bg_meadow.png`: a sunny meadow with soft green hills, a stone bridge over a small stream, floating sky islands with little trees far away, white clouds, an open grassy ground in front.
2. `ped_meadow.png`: a round mossy stone pedestal with a few tiny flowers.
3. `rest_meadow.png`: a cosy little blue-and-white tent with a pillow outside, for sleeping monsters, no people inside.
Alice Tea Party (for Grade 4):
4. `bg_alice.png`: a storybook garden at tea time: a checkerboard path, giant friendly mushrooms and hedges shaped like playing-card suits far away, a round rabbit hole door in a tree, pocket watches hanging in the trees, tiny floating teapots far away, soft pastel pink-and-teal light, an open checkerboard garden floor in front.
5. `ped_alice.png`: a round pedestal made of a stacked pile of three closed storybook teacups and saucers (EMPTY, lids closed) with a playing-card shape on the front, pastel colours.
6. `rest_alice.png`: a giant teapot (closed, no steam) lying on its side as a cosy bed with a pillow in front of it, pastel colours.
Chuseok Night (for Grade 3):
7. `bg_chuseok.png`: a calm Korean village night under a huge glowing full moon: curved tile roofs of traditional houses, pine trees, soft hills, paper lanterns glowing on poles, a few fireflies, a dark blue and gold sky, an open earthen courtyard in front.
8. `ped_chuseok.png`: a round wooden drum base (like a traditional drum on its side, no pattern text) with a lantern-red rim and a flat top.
9. `rest_chuseok.png`: a cosy tent of soft cloth with a paper lantern hanging at the door and a pillow, for sleeping monsters, no people inside.
Halloween (the 31st week):
10. `bg_halloween.png`: a friendly Halloween night: a big pale moon, rolling purple hills, a crooked tree with smiling lanterns, floating gentle ghosts far away, small bats, soft orange and purple light, an open dark-purple ground in front.
11. `ped_halloween.png`: a round pumpkin-orange pedestal like a flat pumpkin with a tiny green stem on the side and a flat top.
12. `rest_halloween.png`: a small purple tent with moon and star patches and a pillow, for sleeping monsters, no people inside.
Name signs (used in every theme):
13. `sign_wood.png`: a small blank wooden hanging sign (horizontal, about 3:1 shape, centred, plain, with two rope loops), no text.
14. `sign_glass.png`: a small blank frosted-glass name plate with soft glowing cyan edges (horizontal, about 3:1 shape), no text.

## Final step
Write `PROGRESS.txt` listing each file with OK or FAILED/SKIPPED, and a last line `N/14 OK`. Stop. Do not do anything else.
