# Sleepy Mio: pictures and movement for the "Sleepy Monster" noise game
Paste each prompt into Gemini (images) or Gemini/Veo (video). Save the results with the exact file names in the table, then tell Claude "Mio art is ready" and I wire them into the game (`js/sleepy-monster.js`).

Save folder: `assets/packs/characters/sleepy-mio/` (stills) and `assets/packs/backgrounds/` (night room).

## Style lock (put this at the start of EVERY prompt)
> Cute glossy 3D-rendered collectible creature, like a premium kids' game mascot: soft rounded body, big shiny dark eyes with two white highlights, tiny smile, smooth jelly-like surface with soft rim light, rich purple body (#8b5cf6) with a lighter cream belly, small gold crescent moon mark on the forehead, two large soft bat-like wings with a little pink-blue sparkle at the edges, tiny stubby arms and feet. Same character in every picture (same proportions, colours, face and moon mark). Friendly for 8 to 10 year old children. No text, no watermark, no scary teeth.

Always add at the end: `Full body, centred, front view, transparent background (PNG with real alpha), 1:1 square, 2048 x 2048, no ground shadow, no floor.`
If Gemini cannot give a transparent background, say: "plain pure white background, nothing else", and tell Claude. I will cut it out.

## A. Still pictures (the 5 states)
| File name | What it shows |
|---|---|
| `mio-asleep.png` | Fast asleep: eyes closed as soft curved lines, peaceful smile, body curled slightly, wings folded around him like a blanket, a tiny sleeping bubble from the nose. Calm, slightly dim, cool blue-purple tint. |
| `mio-stirring.png` | Half awake: one eye half open (sleepy, heavy eyelid), the other closed, small frown, one wing twitching up, a little annoyed. |
| `mio-awake-grumpy.png` | Just woken up: both eyes wide open, eyebrows slanted, mouth open in a big loud "RAAAH" (cute, no teeth), wings spread wide, little stars and "shake" lines around him, warm orange-pink glow. |
| `mio-yawn.png` | Big sleepy yawn, eyes squeezed shut, mouth wide open, wings stretching. |
| `mio-calm-happy.png` | Calm again and happy: soft closed smiling eyes, hugging a small pillow shaped like a moon, tiny pink blush cheeks, peaceful. |

Example full prompt (asleep): `[style lock] Mio is fast asleep: eyes closed as soft curved lines, peaceful smile, wings folded around him like a blanket, a tiny sleeping bubble at his nose, cool blue-purple dim lighting. Full body, centred, front view, transparent background (PNG with real alpha), 1:1 square, 2048 x 2048, no ground shadow, no floor.`

## B. Extra small pictures (optional, for the game screen)
| File name | Prompt |
|---|---|
| `zzz.png` | Three glossy 3D letters "Z" in different sizes, light blue with a soft glow, floating upwards in a diagonal line. Transparent background, 1:1, 1024 x 1024. |
| `moon-pillow.png` | A small cute 3D crescent-moon-shaped pillow, cream and soft purple, transparent background, 1:1, 1024 x 1024. |
| `sleep-bubble.png` | One glossy translucent soap bubble with a tiny rainbow shine, transparent background, 1:1, 512 x 512. |

## C. Background
File `assets/packs/backgrounds/sleepy-night-room.webp` (16:9, 1920 x 1080). Prompt:
> Cozy magical bedroom at night for a small monster, seen straight on, deep navy and violet colours, a large round window with a huge soft moon and stars, a round cushion bed on the floor in the middle with empty space above it, floating dust sparkles, soft volumetric moonlight beam. Cute 3D game-environment style, calm, no characters, no text, centre of the picture quiet and uncluttered.

Also (for when he wakes): same room, same camera, but the lights are on, warm orange and pink light, the moon replaced by early morning sun, a few cushions thrown around. File: `assets/packs/backgrounds/sleepy-awake-room.webp`.

## D. Movement (video)
Gemini can make short videos but not transparent ones. Make each clip from the matching still (upload the still as the first frame) on a **plain pure green (#00ff00) background** so I can key the green out. 4 seconds, 1:1, 1080 x 1080, no camera movement, character stays in the same place.

| File name | Prompt (add the style lock sentence first) |
|---|---|
| `mio-asleep-loop.mp4` | Start from the picture. Mio sleeps and breathes slowly: his belly and body gently rise and fall, the sleeping bubble grows and shrinks, the wings move very slightly. A seamless loop (the last frame equals the first). Character does not leave his spot. Pure green background. |
| `mio-stirring.mp4` | Start from the picture. Mio wriggles in his sleep, one wing twitches, he frowns, his eyelid flutters half open, then he tries to go back to sleep. Pure green background. |
| `mio-wake-up.mp4` | Start from the sleeping picture. He snaps awake with a big jump (a short hop up and down), eyes pop wide open, wings spread, loud cute "RAAAH" mouth, small shake lines. Ends in the grumpy pose. Pure green background. |
| `mio-lullaby.mp4` | Start from the grumpy picture. He slowly calms down, yawns, rubs one eye, curls up and falls asleep, hugging the moon pillow. Ends in the asleep pose. Pure green background. |

## E. A way that always works without video
If a video comes out wrong, the five stills in section A are enough: the game already moves them (breathing, shaking, hop, floating Zzz). Do the stills first.

## Checks before you send them to me
- Same Mio in every picture (face, moon mark, colours).
- Nothing cut off at the edges, nothing else in the picture.
- Names exactly as in the tables.
