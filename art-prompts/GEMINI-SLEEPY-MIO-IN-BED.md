# Sleepy Mio in his bed: Mio and the bed drawn together
Paste into Gemini (images). Attach the pictures named under "Attach" first. Save with the exact file names, then tell Claude "bed scenes ready" and I wire them in.

## Attach these 3 pictures every time (so Gemini keeps the same room and the same Mio)
1. `assets/packs/backgrounds/sleepy-night-room.webp` (the room)
2. `assets/packs/characters/sleepy-mio/mio-asleep.png` (the character)
3. The matching Mio pose from `assets/packs/characters/sleepy-mio/` for each picture below

Save folder: `assets/packs/backgrounds/sleepy-scenes/`

## Rules for every scene (write this at the start of each prompt)
> Use the attached room picture as the exact base: same camera angle, same round moon window, same shelves, lanterns, wooden floor, round rug and round cushion bed in the middle. Do not change the room. Put the attached character, Mio (cute glossy 3D purple bat-winged monster with a gold crescent moon on his forehead and a cream belly), INTO the round cushion bed, so that the soft front cushions and the blanket of the bed overlap his lower body and feet (he is really sitting or lying inside the bed, not on top of it, no floating, no gap). Add a soft contact shadow and cushion dents where his body touches the bed. Keep Mio the same size and design as the attached picture. 16:9, 1920 x 1080, no text, no watermark, no people.

## The 5 scenes
| File name | Mio pose | Lighting |
|---|---|---|
| `scene-asleep.webp` | Fast asleep, eyes closed, sleeping bubble at his nose, wings wrapped around him like a blanket, sunk gently into the cushions, the star blanket pulled up over his legs. | Same night room, calm blue-violet moonlight. |
| `scene-stirring.webp` | One eye half open, small frown, one wing twitching, blanket slipping a little. | Same night room, moonlight slightly brighter. |
| `scene-awake.webp` | Sitting up in the bed, both eyes wide open, big angry "RAAAH" mouth (cute, no teeth), arms up, wings spread, little stars and shake lines, blanket thrown aside, cushions bouncing. | Same room but morning: warm orange-pink light through the window. |
| `scene-yawn.webp` | Big yawn, eyes squeezed shut, stretching one wing, blanket halfway on. | Night room, soft light. |
| `scene-calm.webp` | Snuggled down again, small smile, hugging the little moon-shaped pillow, blanket up to his chin. | Night room, gentle moonlight. |

Example full prompt (asleep): `[rules] Mio is fast asleep inside the cushion bed: eyes closed as soft curved lines, a tiny sleeping bubble at his nose, wings wrapped around him like a blanket, the star blanket pulled over his legs, the front cushions overlapping his body. Same night room, calm blue-violet moonlight.`

## Check each picture before you send it
- The room is the same as the original (window, shelves, lanterns, rug, bed in the same place and same size).
- Mio is clearly IN the bed: front cushions or blanket cover his feet and legs, a shadow under him, nothing floating.
- Mio's face and colours match the attached character.
- Mio is centred in the bed, the round window stays visible behind him, and nothing is cut off.

## Option if the five scenes are too much work
Do only two: `scene-asleep.webp` and `scene-awake.webp`. I can keep the cut-out Mio for the other poses and place him in the bed as well as possible, and I will use these two for the main sleep and wake-up moments.

## Optional extra (best result): the front cushions as an overlay
If Gemini can do it, ask for one more picture: the same room with **only the front cushions and blanket of the bed** visible on a **transparent background (PNG with real alpha)**, same size 1920 x 1080 and the same position as the room picture, everything else empty. File: `bed-front-overlay.png`. With it I can put Mio behind the cushions in code, for every pose, with no extra pictures.
