# Paste everything below the line into Gemini (the agent that can read and write files in this project)
# Run it AFTER the fitting job (GEMINI-STEP3-FIT.md). It is independent: it only creates new pictures.

---

You are the art generator for my children's English learning platform (students aged 8 to 10). The platform already has 5 illustrated monster species, 28 accessory pictures, and the art style is fixed. Now make the EXTRA art below. Work through the whole job by yourself, without asking me questions. I am away. Work strictly in the tier order given (Tier 1 first). If an image fails, retry up to 3 times, log it, and continue. If you hit a quota or rate limit, wait and retry; if you still cannot continue, stop cleanly, write the log, and report what is finished.

## Hard rules
- Only create image files and one log file. Do NOT edit, move, rename or delete any existing file. Do NOT run git. Do NOT touch any code (.js .html .css).
- Every creature, item and scene must be ORIGINAL. Never copy or resemble any existing game, anime or movie character (no Pokemon, Disney, Nintendo, etc.).
- No text, letters, numbers, watermark or logo inside any image. Child-friendly, never scary.
- Square 1:1, 1024 x 1024. If you save a JPEG, keep the `.png` name.
- Unless a tier says otherwise: one flat plain light-grey background (#e8e8e8), no ground shadow, no floor, so I can cut the background out.

## Study the existing style first
Open these and match them exactly (lighting, outline, saturation, glossy eyes, 3D mobile-game look):
- `C:\Users\maysa\Desktop\DV\assets\monsters\new\aquafind_growing.png`, `florasprout_adventurer.png`, `astralight_ultimate.png`, `emberwing_growing.png`, `sparktail_adventurer.png`
- `C:\Users\maysa\Desktop\DV\assets\monsters\items\item_hat_crown.png`, `item_glasses_round.png`, `item_neck_star.png`, `item_held_trophy.png`
- The prompt kits: `C:\Users\maysa\Desktop\DV\art-prompts\MONSTER-ART-PROMPTS.md` and `ACCESSORY-ART-PROMPTS.md` (STYLE BLOCKS).

## TIER 1: Cracking eggs (5 images) -> save to `C:\Users\maysa\Desktop\DV\assets\monsters\new\`
For each species a "cracking egg" picture, the stage between the egg and the baby: the same egg as `<species>_egg.png` (match its shell colours and patterns) but with a large glowing crack across it, bright warm light leaking out, small shell pieces falling, and a tiny pair of curious eyes peeking through the crack (the baby's eyes colour of that species). Cute, not scary.
File names: `emberwing_cracking.png`, `aquafind_cracking.png`, `florasprout_cracking.png`, `astralight_cracking.png`, `sparktail_cracking.png`.
Use the matching `<species>_egg.png` and `<species>_baby.png` as references.

## TIER 2: New accessory items (23 images) -> save to `C:\Users\maysa\Desktop\DV\assets\monsters\items\`
Use the STYLE BLOCK of ACCESSORY-ART-PROMPTS.md. ONE item alone, front view, perfectly centred and level, about 70% of the picture, no creature, no hand holding it, plain grey background. Hats and glasses must be perfectly symmetric and level.
HATS (10), made to sit on a small round head:
- `item_hat_party.png` a striped cone party hat with a pom-pom on top
- `item_hat_chef.png` a tall white puffy chef hat
- `item_hat_pirate.png` a cute pirate tricorn hat with a tiny gold star (no skull)
- `item_hat_cowboy.png` a brown cowboy hat with a red band
- `item_hat_tophat.png` a black top hat with a purple band
- `item_hat_santa.png` a red-and-white Santa hat
- `item_hat_beanie.png` a cosy knitted beanie with a pom-pom
- `item_hat_propeller.png` a colourful propeller cap
- `item_hat_sailor.png` a white sailor cap with a navy band
- `item_hat_astronaut_cap.png` a small silver space-explorer cap with a glowing star badge (not a full helmet)
GLASSES (3):
- `item_glasses_sun.png` round dark sunglasses with a golden frame
- `item_glasses_star.png` star-shaped glasses with pink frames and clear lenses
- `item_glasses_heart.png` heart-shaped glasses with red frames and clear lenses
NECK ITEMS (3), curved in an open U shape ready to drape around a neck:
- `item_neck_bowtie.png` a red bow tie with white dots
- `item_neck_bandana.png` a blue triangular bandana with white dots, tip pointing down
- `item_neck_bell.png` a green collar with a small golden bell
HELD ITEMS (7), drawn alone with no hand:
- `item_held_balloon.png` a red balloon on a string
- `item_held_icecream.png` a two-scoop ice cream cone
- `item_held_ball.png` a colourful football (soccer ball)
- `item_held_paintbrush.png` a paintbrush with rainbow paint on the tip
- `item_held_pencil.png` a big friendly yellow pencil
- `item_held_magnifier.png` a golden magnifying glass
- `item_held_umbrella.png` a small closed rainbow umbrella

## TIER 3: Illustrated backgrounds (13 images) -> save to `C:\Users\maysa\Desktop\DV\assets\monsters\backgrounds-new\`
Replace flat cartoon scenes with illustrated ones in the same polished 3D mobile-game style. A calm soft-focus scene, square 1:1, FULL picture painted (no grey background here), no creature, no characters, no text. Keep the lower-middle of the picture relatively open and calm (a monster will stand there), with interesting details at the sides and in the distance. Child-friendly, bright, soft lighting.
File names and scenes:
`bg_meadow.png` sunny flower meadow with a tiny explorer tent and hills; `bg_castle.png` a friendly storybook castle on a hill; `bg_forest.png` an enchanted green forest with glowing mushrooms; `bg_volcano.png` a cute volcano island with a gentle lava glow and palm trees; `bg_beach.png` a sunny beach with a sandcastle and waves; `bg_moonlit.png` a calm moonlit night meadow with fireflies; `bg_winter.png` a snowy village with pine trees and soft snowfall; `bg_cosmos.png` a colourful starry space with planets and a nebula; `bg_desert.png` a golden desert with dunes and a small oasis; `bg_underwater.png` a bright coral reef with bubbles and sunbeams; `bg_rainbow.png` a sky with a big rainbow and puffy clouds; `bg_cloud.png` a dreamy pastel cloud kingdom above the sky; `bg_crystal.png` a glowing crystal cave with colourful gems.

## TIER 4: Aura effects (10 images) -> save to `C:\Users\maysa\Desktop\DV\assets\monsters\auras-new\`
Glow and particle effects that go BEHIND a monster. Draw each on a PURE BLACK background (#000000) so I can blend it. The centre of the picture is empty (the monster stands there); the effect forms a ring, halo, swirl or scatter of particles around the centre, brightest near the middle and fading to the edges. No creature. Colourful, soft glow, no text.
`aura_sparkle.png` golden sparkles; `aura_flame.png` friendly orange flame wisps; `aura_ice.png` ice crystals and snowflakes; `aura_rainbow.png` a rainbow ring of light; `aura_cosmic.png` stars and galaxy swirls; `aura_lightning.png` yellow-blue lightning arcs; `aura_blossom.png` pink flower petals swirling; `aura_star.png` shooting stars and star shapes; `aura_dragon.png` a green-gold magical dragon-wind swirl (no dragon body); `aura_royal.png` a purple-gold royal glow with tiny crowns of light.

## TIER 5: Emotions for lessons (20 images) -> save to `C:\Users\maysa\Desktop\DV\assets\monsters\new\`
For every species, take `<species>_growing.png` as the reference and keep the SAME character, colours, scarf and outfit. Change only the pose and face:
- `<species>_growing_cheer.png` arms up, big happy smile, eyes closed in joy (a correct answer)
- `<species>_growing_think.png` one paw on the chin, eyes looking up and to the side, a small thoughtful smile (thinking)
- `<species>_growing_oops.png` a gentle encouraging expression: soft smile, head tilted, one paw scratching the head. NOT sad, NOT crying (a soft mistake, the platform never punishes)
- `<species>_growing_sleepy.png` yawning, eyes half closed, sleepy
Species: emberwing, aquafind, florasprout, astralight, sparktail.

## TIER 6: Stage pedestal (1 image) -> save to `C:\Users\maysa\Desktop\DV\assets\monsters\ui-new\`
`pedestal.png`: an empty round glowing display platform seen from a slight angle, a wooden-gold base with a soft blue-teal glowing ring and tiny floating sparkles, nothing on top. Plain grey background. Same polished 3D style.

## TIER 7: Three new species (18 images, only if everything above is finished) -> `C:\Users\maysa\Desktop\DV\assets\monsters\new\`
Use the STYLE BLOCK and STAGE LINES of MONSTER-ART-PROMPTS.md. For each species make 6 pictures in order: egg, baby, growing, adventurer, advanced, ultimate, using the previous stage as reference so the character stays the same. File names `<species>_egg.png`, `<species>_baby.png`, ... Stage 2 "growing" wears a small neckerchief, stage 3 an adventurer satchel, stage 4 a chest badge, stage 5 a grand crown/aura (same as the other species).
1. TERRASHELL (earth, brown and green): a small round tortoise-like creature with a mossy rock-pattern shell that grows tiny flowers and a little tree as it evolves, cream belly, big warm brown eyes, stubby legs. Palette: warm brown, moss green, cream, flower pink.
2. FROSTFLUFF (ice, white and ice-blue): a fluffy round snow-owl chick with icy crystal feather tufts on its head and wings that grow into glittering ice wings, big dark-blue eyes. Palette: snow white, ice blue, silver, soft violet.
3. BREEZEFIN (wind, sky-blue and mint): a small round baby sky-whale that floats, with wing-shaped fins, a fluffy cloud-puff on its back, a little wind-swirl tail, big friendly teal eyes. Palette: sky blue, mint, white, soft yellow.
No existing character may be copied; do not make them look like any known game creature.

## Log and finish
Write `C:\Users\maysa\Desktop\DV\art-prompts\PROGRESS-STEP4.txt`, one line per file `<folder>/<file name>: OK` or `FAILED`, updated as you go, with a tier header line before each tier. At the end count the files per folder and report: how many images were made per tier, which failed, and whether you reached Tier 7. Then stop. Do nothing else.
