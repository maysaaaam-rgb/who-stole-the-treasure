# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for the monster companion in "English Adventure Academy" (pupils aged 8 to 10). On the island map the monster walks in every direction, but its side and back views are wrong. I need a proper **turnaround** of the same monster: the same body seen from the front, from the 3/4 side, from the side and from the back. These pictures are a drawing guide for the programmer, so being exact and consistent matters more than being pretty. Work through the whole job by yourself without asking me questions. I am away. If a picture fails, retry it up to 3 times, then skip it and log it as SKIPPED.

## Hard rules
- You may ONLY create PNG files and one `PROGRESS.txt` inside `C:\Users\maysa\Desktop\DV\island-work\monster-ref\turnaround\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **First, look (read only) at these three pictures in `C:\Users\maysa\Desktop\DV\island-work\monster-ref\`:**
  - `ref_monster_plain.png`: THE MONSTER. Copy it exactly: a soft, glossy, jelly-like blue body shaped like a rounded square, two small round bear ears with pink insides, big shiny eyes, a tiny dark nose, a small smile, pink cheeks, a pale belly patch, two short stubby arms, two short feet with toe pads, two purple feathery fins on the sides of the head, and a curled spiky tail on the right.
  - `ref_monster_front.png`: the same monster wearing a pink bow on its head and a red scarf, to show how clothes sit.
  - `ref_monster_now_4views.png`: how the side and back views look now (wrong). Do NOT copy those.
- Keep the same glossy cartoon style, the same colours, the same proportions and the same size in every picture, as if a toy were turned on a table. The feet stand on the same line in every picture.
- One picture per view. Each picture: square 1024x1024, the monster centred, filling about 75% of the height, on ONE flat plain light-grey background (#e8e8e8), no floor, no shadow, no outline added.
- Original art only. No text, letters, numbers or watermark.
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.

## The 8 pictures

**Without clothes (the plain monster)**
1. `t_front.png`: facing the viewer (the same as `ref_monster_plain.png`).
2. `t_three_quarter.png`: turned 45 degrees to the RIGHT. One eye is a little smaller and closer to the edge of the face, the nose and mouth move towards the right, the right fin is partly hidden behind the head, the tail shows more on the left behind the body.
3. `t_side.png`: a true side view facing RIGHT. Only one eye shows, near the front of the head, the nose sits at the very front edge, only the near fin and the near ear show, the belly patch is a thin curve at the front, one arm in front, the tail sticks out at the back (left).
4. `t_back.png`: seen from behind. No face, no belly, both ears and both fins from behind, the curled tail in the middle of the lower back, the back of the feet.

**With the pink bow and red scarf (so clothes fit every side)**
5. `t_front_dressed.png`: like 1, with the bow on the head and the scarf round the neck, the knot and tails at the front.
6. `t_three_quarter_dressed.png`: like 2, with the bow and the scarf turning with the body.
7. `t_side_dressed.png`: like 3, the scarf wraps round the neck, the knot shows at the front, the bow seen from the side.
8. `t_back_dressed.png`: like 4, only the back of the scarf shows (no knot), the bow seen from behind.

## Finish
Write `PROGRESS.txt` in the same folder: one line per picture (`file name - OK` or `file name - SKIPPED reason`), then a last line `N/8 OK`.
