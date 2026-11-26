# Media Asset Manifest — Courtside to Curtain Call: The Festival Adventure

> **Zero-Broken-Media Status:** Out of the box, `courtside-to-curtain/` runs 100% complete using real glossy 3D `.webp` art already in `review-g4-teamwork/art/`, `review-g4-show/art/`, `speak-review/art/describe/`, and `assets/monsters/art/`, paired with 60fps HTML5 `<canvas>` animated scenes and Web Audio / Web Speech API synthesis.
> Drop any optional high-res custom media files into the paths below to upgrade individual hooks.

---

## Consistent Visual Style Prefix (Aligned with `docs/STYLE_GUIDE.md` & `docs/ART_STYLE.md`)

> *"STYLE: English Adventure Academy sunny cartoon adventure park for 8-to-10-year-olds on a classroom smartboard. Bright daylight, chunky soft rounded 3D animated kids' film look, gentle sunlit shadows, clean uncluttered composition. COLOURS: Pink #ff5fa2, Blue #4f9dff, Yellow #ffb320, Green #2fc58a, cream #fff8ec, sky blue. CHARACTERS: expressive friendly 9-year-old pupils and our four team monsters (Emberwing pink phoenix, Aquafind blue axolotl, Sparktail yellow-horned sheep, Florasprout green bunny). No famous or copyrighted characters, no dark neon, no text overlays, 16:9 aspect ratio."*

---

## 1. Optional Video Prompts (`./assets/videos/`)

| Target File | Duration | Camera & Action Prompt (Prefix with Style Block above) |
|:---|:---:|:---|
| `./assets/videos/intro_journey.mp4` | 8s | Smooth aerial glide starting over a sunny wooden basketball court with colourful flags, sweeping along a dotted park footpath past trees and balloons toward a bright festival theatre stage in the distance. |
| `./assets/videos/act7_basketball.mp4` | 4–5s loop | Medium wide static shot on a sunlit outdoor basketball court: two diverse 9-year-old players bouncing, passing, and shooting an orange basketball cleanly through a hoop. Clear, readable action, no dialogue. |
| `./assets/videos/act7_dancing.mp4` | 4–5s loop | Cheerful eye-level shot in a sunny festival park: three diverse 9-year-old kids holding pink, yellow, and green festival ribbons twirling and dancing joyfully together under bunting flags. |
| `./assets/videos/act7_music.mp4` | 4–5s loop | Bright park stage medium shot: three 9-year-old children happily playing a toy drum, wooden flute, and small acoustic guitar with subtle floating golden musical sparkles. |
| `./assets/videos/act7_running.mp4` | 4–5s loop | Side-tracking follow shot along a sunny golden park running path: four 9-year-old teammates in bright sports shoes jogging cheerfully together toward the right. |
| `./assets/videos/cutscene_festival_trip.mp4` | 12s | 3-beat storybook sequence: (0–4s) a 9-year-old boy and his mother boarding a bright red commuter train; (4–8s) the train gently braking to a sudden stop on sunny tracks with comical surprised expressions; (8–12s) the pair hurrying happily through sunny festival theatre doors. |
| `./assets/videos/finale_curtain_call.mp4` | 8s | Festive wide stage shot: golden-trimmed bright curtains parting as diverse 9-year-old performers in tree and crown costumes bow beside the four team monsters under warm spotlights and rainbow confetti bursts. |

---

## 2. Optional Image Prompts (`./assets/images/`)

| Target File | Usage | Prompt (Prefix with Style Block above) |
|:---|:---|:---|
| `./assets/images/map_bg.webp` | Adventure Map Backdrop | Overhead illustrated 3-zone park map: left sunny basketball court, middle green festival walkway with river bridge, right cheerful festival theatre pavilion, bright blue sky edges, zero text. |
| `./assets/images/court_topdown.webp` | Node 2 Court Diagram | Crisp clean top-down sunny hardwood basketball court with bright white half-court line, free-throw keys, three-point arcs, and twin baskets, warm cream border, zero text labels. |
| `./assets/images/strange_court.webp` | Node 10 Scene 1 | Sunny basketball court where players are dribbling normally, except one kid in the middle is strumming a big wooden acoustic guitar right on the court! |
| `./assets/images/strange_theatre.webp` | Node 10 Scene 2 | Bright cheerful theatre audience sitting in seats looking at the stage, except a friendly cartoon bear in the front row is happily munching a giant bucket of popcorn! |
| `./assets/images/strange_bench.webp` | Node 10 Scene 3 | Sunny basketball team bench where players listen attentively to their smiling coach, who is wearing oversized turquoise scuba diving flippers instead of sneakers! |
| `./assets/images/puzzle_theatre.webp` | Node 11 Poster 1 | Bright sunny theatre stage with cheerful kids in costumes rehearsing under golden lights, clean poster composition. |
| `./assets/images/puzzle_court.webp` | Node 11 Poster 2 | Sunny outdoor park basketball court with colourful team flags and a ball swishing into the hoop. |
| `./assets/images/seq_1_home.webp` | Node 13 Card 1 | 9-year-old boy holding a tree costume prop waving goodbye at his sunny front door with his mother. |
| `./assets/images/seq_2_train.webp` | Node 13 Card 2 | Bright red storybook passenger train stopped suddenly on sunny green countryside tracks with a friendly puff of steam. |
| `./assets/images/seq_3_costumes.webp` | Node 13 Card 3 | Smiling 9-year-old boy backstage happily slipping into a leafy tree costume just in time. |
| `./assets/images/seq_4_show.webp` | Node 13 Card 4 | Joyful children performing on the bright festival stage while a cheering audience claps below. |

---

## 3. Optional Voiceover Script Sheet (`./assets/audio/vo/`)

Record at clear, upbeat A1 elementary pace (`~0.88x`, warm encouraging tone):

| Filename ID | Spoken Script |
|:---|:---|
| `vo_intro.mp3` | "Welcome to Courtside to Curtain Call! Let's travel from the basketball court to the grand theatre!" |
| `vo_node1.mp3` – `vo_node13.mp3` | One-sentence upbeat activity intro matching `CTCData.NODES[i].intro`. |
| `vo_word_coach.mp3` ... `vo_word_train.mp3` | Single clear pronunciation for `Coach`, `Audience`, `Basket`, `Costumes`, `Court`, `Player`, `Theatre`, `Train`, `Half-court line`, `Free-throw line`, `Three-point line`. |
| `vo_phonics_sport.mp3` | "Sport. Listen to OR: /ɔː/. Sport, short, more, corn!" |
| `vo_phonics_work.mp3` | "Work! Listen carefully — after W, OR makes a different sound: /ɜː/. Work!" |
| `vo_cheer_1.mp3` / `vo_try_1.mp3` | "Swish! Amazing job!" / "Bravo! Encore!" / "Ooh, almost! Look closely and try again!" |
