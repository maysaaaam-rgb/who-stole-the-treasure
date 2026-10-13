# Paste everything below the line into Gemini (the agent that can read and write files in this project)

---

You are the art generator for a Grade 3 English lesson called **Daphne the School Detective** (pupils aged 8 to 9). Topic: School Life, people and places at school. Pupils name school people (a librarian, a school nurse, a headteacher, a caretaker, a classmate) and places (an art room, a music room, a meeting room, an office, a sports field, a corridor, a gym, a library), and use: Who's this? This is Mr. Blue. Where is Daphne? She's in the library. Is there a nurse at school? Yes, there is. How many caretakers are there? There are two. Story: Daphne, a friendly girl detective, is looking for her lost red notebook and visits every place at school. Right now the lesson would use emoji. I need real pictures. Work through the whole job by yourself without asking me questions. I am away. If an image fails, retry up to 3 times, then skip it, write it in the log and continue.

## Hard rules
- You may ONLY create image files and one log file (`PROGRESS.txt`), inside `C:\Users\maysa\Desktop\DV\week4-work\art-g3\`. Create that folder if it does not exist. Do NOT edit, move, rename or delete any other file anywhere. Do NOT run git. Do NOT touch any code.
- **First, look (read only) at the existing pictures `cat.png`, `dog.png` and `boss.png` in `C:\Users\maysa\Desktop\DV\unit2-throw\art-new\`, and at a few pictures in `C:\Users\maysa\Desktop\DV\unit3-work\art-g3\`.** All new pictures must look like they belong to the same family: cute 3D-rendered mobile-game mascot style, soft lighting, saturated child-friendly colours, the same line quality, and a thick white sticker outline.
- Everything must be ORIGINAL cartoon art. Do NOT copy any character, film, game, brand or franchise. **Do NOT copy the illustrations of any school textbook.** All people are NEW characters designed by you from the descriptions below and must look the same in every picture.
- **No text, letters, numbers, signs with words or watermark inside any image.** Doors, signs, boards and books are blank; show places only by their objects (books, paint, instruments, balls, beds).
- Friendly and gentle. Never scary. Everyone is shown with respect. Use a mix of boys and girls with different hair and skin tones.
- Be honest in your final log. Only write "OK" for a picture you actually generated and looked at.

## Fixed character designs (use in every picture where they appear)
- **Daphne**: a girl about 9, curly auburn hair in two puffs, a mustard-yellow detective coat with big buttons, a tiny brown detective cap, a red notebook in one hand and a magnifying glass in the other. Curious and cheerful.
- **Mr. Blue (headteacher)**: a tall kind man about 50, short grey hair, glasses, a blue suit, a blue tie, a gentle smile.
- **Librarian**: a woman about 40, round glasses, a long green cardigan, her hair in a bun, holding a stack of books.
- **School nurse**: a woman about 35, short dark hair, a white coat with a small red heart badge (no cross, no text), holding a small first-aid bag.
- **Caretaker A (Mr. Oak)**: a man about 55, a grey moustache, an orange overall, a bunch of keys on his belt, a broom. **Caretaker B (Mr. Pine)**: a younger man about 30, a beanie, a brown overall, a bucket and a mop. They are two different people.
- **Classmate (Leo)**: a boy about 9, short black hair, a red T-shirt, a blue backpack, a big smile.

## Picture types and sizes (PNG, use the exact file names)
**Type A: objects and characters.** Square 1:1, 1024x1024, ONE subject (or the named small group), centred, filling about 80% of the frame, on ONE flat plain light-grey background (#e8e8e8), no floor, no ground shadow, thick white sticker outline around the whole subject.
**Type B: backdrops.** Wide 2:1, 1600x800, a full scene with NO people, NO animals and NO text, same soft 3D style, no outline, a calm lower third so that characters can be placed on top.
**Type C: story scenes.** 4:3, 1600x1200, a full scene WITH the characters named, no text, no outline, one clear main action.

## PART 1: Characters (Type A, full body, friendly pose, waving)
1. `c_daphne.png`, 2. `c_daphne_magnify.png` (Daphne looking through the magnifying glass), 3. `c_daphne_thumbs.png` (thumbs up), 4. `c_mr_blue.png`, 5. `c_librarian.png`, 6. `c_nurse.png`, 7. `c_caretaker_oak.png`, 8. `c_caretaker_pine.png`, 9. `c_leo.png`, 10. `c_two_caretakers.png` (Mr. Oak and Mr. Pine side by side, both waving, for the number two).

## PART 2: Word cards (Type A, objects)
11. `o_notebook.png`: Daphne's red notebook with a gold star clasp (blank cover). 12. `o_magnifier.png`: a big magnifying glass with a sparkle. 13. `o_books.png`: a tall stack of colourful books. 14. `o_paint.png`: a paint palette with a brush. 15. `o_guitar.png`: a small wooden guitar. 16. `o_football.png`: a football. 17. `o_first_aid.png`: a small white first-aid bag with a red heart. 18. `o_keys.png`: a bunch of keys on a ring. 19. `o_broom.png`: a broom and a bucket. 20. `o_balloon.png`: a bunch of three party balloons. 21. `o_cake.png`: a birthday cake with candles. 22. `o_gift.png`: a wrapped present with a ribbon. 23. `o_footprints.png`: a trail of three small footprints on a grey tile (a clue). 24. `o_clue_star.png`: a golden star with sparkles (a clue star, no text).

## PART 3: Place cards, small (Type A, an object-style mini room)
25. `p_library.png`: a tiny cut-away room with shelves of books, a reading chair and a lamp. 26. `p_art_room.png`: a tiny cut-away room with easels, paint pots, a drying line of paintings. 27. `p_music_room.png`: a tiny cut-away room with a piano, drums and a guitar. 28. `p_office.png`: a tiny cut-away room with a desk, a computer and a plant. 29. `p_meeting_room.png`: a tiny cut-away room with a long table and chairs. 30. `p_gym.png`: a tiny cut-away hall with a basketball hoop, mats and a rope. 31. `p_sports_field.png`: a tiny grassy field with goal posts and a running track. 32. `p_corridor.png`: a tiny cut-away corridor with lockers and a tiled floor.

## PART 4: Backdrops (Type B)
33. `bg_library.png`, 34. `bg_art_room.png`, 35. `bg_music_room.png`, 36. `bg_office.png`, 37. `bg_meeting_room.png`, 38. `bg_gym.png`, 39. `bg_sports_field.png` (a bright field with a track and goal posts), 40. `bg_corridor.png`, 41. `bg_school_front.png` (the front of a friendly school building with a blue door and a flag pole, sunny), 42. `bg_school_map.png` (a cut-away side view of a two-floor school with eight EMPTY rooms in a neat grid, all doors open, plain colours, so that pictures can be dragged into the rooms; no text).

## PART 5: Story scenes (Type C)
43. `s_lost_notebook.png`: Daphne at the school front gate, empty hands, looking worried, a small thought bubble with a red notebook shape inside. 44. `s_librarian_helps.png`: Daphne asking the Librarian in the library, the Librarian pointing along a shelf. 45. `s_nurse_clue.png`: the school nurse showing Daphne a small clue (the footprints) in the nurse room. 46. `s_caretakers_count.png`: Mr. Oak and Mr. Pine in the corridor, Daphne counting them on her fingers. 47. `s_mr_blue_office.png`: Mr. Blue at his office door, smiling, holding Daphne's red notebook. 48. `s_found_party.png`: all school people and Leo in the gym with balloons and a cake, cheering, Daphne surprised and happy (a surprise party for Daphne).

## Finish
When all pictures are done, write `PROGRESS.txt` in the same folder: one line per picture, "OK" or "SKIPPED reason", then a last line with the number of OK pictures out of 48. Do not write anything else anywhere.
