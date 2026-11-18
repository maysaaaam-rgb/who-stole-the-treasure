# English Adventure Academy · Art Style Rule

**Read this before you make any picture, 3D model, logo or sound.** It is for Gemini, Tripo and Claude, so that everything looks like it comes from one world.
It adds detail to `docs/STYLE_GUIDE.md` (the identity, colours and screens). The target picture is `docs/design/home-world.jpg`, and the four team monsters in `assets/3d/monsters/` are the measuring stick: **if a new thing would look out of place standing next to Aquafind, it is wrong.**
Agreed with the teacher on 18 November 2026.

## 1. The look in five words

**Chunky · soft · bright · simple · sunny.**

It should look like a set of glossy toys standing in sunshine.

## 2. Shapes

- Every edge is rounded or bevelled. Never use sharp corners or thin spiky parts.
- **Toy proportions.** Make things a bit fatter and shorter than in real life. Buildings are about as tall as they are wide, with oversized doors, roofs and windows.
- **Few big shapes, not many small ones.** An object must be recognisable from its outline alone at 120 px. If you have to zoom in to understand it, simplify it.
- **Characters:**
  - Monsters have big heads (head ≈ body) and big shiny eyes.
  - Kid avatars are about 3½ heads tall, with a friendly face and a small smile.
  - Pets are original baby animals in the same style as the monsters.

## 3. Colour

- **Saturated, never pale.** The teacher rejected a washed-out version of the island, so colours must be strong and clean, like fresh paint.
- **Each object uses at most 3 main colours:**
  1. one main colour;
  2. one team-colour accent (Pink `#ff5fa2`, Blue `#4f9dff`, Yellow `#ffb320`, Green `#2fc58a`);
  3. one neutral (cream, wood or stone).
- **Shared material colours.** Use these so that everything matches:

| Material | Colour |
|---|---|
| Grass | `#6cc644` (top), `#4fa83a` (edges) |
| Sea | `#39b6e8`, shallow water `#7fd8f2` |
| Sand / path | `#f3d38a`, golden road `#ffcf4a` |
| Wood | `#c98a4b`, dark wood `#8f5a2e` |
| Stone | `#e3d6c0` (warm cream-grey, never cold grey) |
| Roofs and flags | the team colours |
| Gold (chests, coins, crowns) | `#ffc93c` with a light shine |
| Text, outlines | ink `#2b1d40` |

- Shadows are soft and coloured: blue-lilac, never black. Nothing in the world is pure black or pure grey.

## 4. Surfaces and detail

- **Smooth, painted colour with a soft light-to-dark shade.** No photo textures, no dirt, rust, cracks or realistic wood grain.
- Characters and special items get a gentle shine. Buildings are satin, not shiny. Only gold looks like metal.
- **Calm, not busy.** The teacher also rejected a "too busy" version. A building gets 2–3 details (a flag, a window box, a lantern), not 20.
- **No words on models.** Name signs are added in the game, so they stay sharp and spelled correctly.

## 5. Light and camera for reference pictures

- Sunny late-morning light from the top left, with one soft shadow.
- For a **Tripo source picture**:
  - one object only, centred, filling about 80% of the frame, nothing cut off;
  - plain white or very light grey background, no ground, no other objects;
  - front three-quarter view from slightly above (about 30°).
- For a **scene or poster**: the same light and the same island. 16:9, 1280 × 720.

## 6. Rules for each kind of model

| Kind | Rules |
|---|---|
| **Buildings / island places** | Faces the front (+z, towards the camera). Flat base. Door in the middle of the front. Add anchors in `assets/3d/home/models.json` (sign, door, monster). |
| **Team homes** | Each home shows its team colour clearly, and has a spot for the monster to stand. |
| **Market items** (hats, hair, glasses, backpacks, pets, prizes) | Each item is a separate model. Made to fit the shared kid body `assets/3d/characters/kid-base.glb`: hats sit on its head, and backpacks sit on its back. Picture the item on a plain cream mannequin head or body so the size is right, then make only the item. |
| **Pupil heads** | Made from the pupil's Gemini cartoon portrait: front view, neutral happy face, same template for every pupil. **Private:** never in this repository or on GitHub. Pupil heads live in private cloud storage, and are named by pupil id only (`student-3a-224-head.glb`). Tripo setting: private. |
| **Pets and buddies** | Original animals only. Baby proportions, a team-colour collar or scarf. |
| **Small props** (trees, rocks, fences, barrels) | Use free **CC0** packs first (Quaternius, Kenney, KayKit). Use Tripo only when nothing free fits. |

## 7. Technical limits for 3D files

- Format: `.glb`, one model per file. 1 unit = 1 metre. The origin is at the bottom centre.
- Size in the world:
  - kid avatar 1.6 m;
  - monster 1.25 m;
  - market items in proportion to the kid.
- Triangles:
  - buildings and characters about 15–20k;
  - market items under 8k;
  - small props under 3k.
- Texture: one texture per model, 1024 px for buildings and characters, 512 px for items and props. No normal maps.
- File size: about 600 KB per model, with large landmarks up to 1 MB.
- Paid or non-CC0 files never go into this public repository. Tripo models must be made with private models and commercial use switched on.

## 8. Logos and 2D pictures

- **Game logos:** copy the look of `games/tug3d/art/logo.png`.
  - PNG, 1200 × 400, transparent background.
  - Cream pill with a blue outer border and a yellow inner border.
  - Chunky round letters with an ink outline and a white offset shadow, each word in a different team colour.
  - One small icon on each side, and a decorative strip under the words.
- **Game posters:** 1280 × 720 JPG, a scene from the game in the island style.
- **Cut-out pictures** (cards, items): transparent `.webp`, soft shadow under the object.
- Check the spelling of every word in a picture. Make the picture again if a letter is wrong.

## 9. Sounds

- Sounds are friendly, musical and soft. They are made for 8-year-olds in a classroom.
  - Right answer: a rising chord.
  - Wrong answer: a gentle falling two-tone chime.
  - Never use buzzers, screams or scary noises.
- Original synthesis or CC0 only. Each game folder has a `CREDITS.md`.
- File format: mono 44.1 kHz MP3, peak -1 dB, no silence at the start.
- Background loops: `music.mp3` 30 s and `crowd.mp3` 18 s, looping without a click, quiet enough to talk over.

## 10. Looks we already rejected — do not repeat them

- Pale, washed-out colours.
- Busy pictures with too many small details.
- Realistic textures (photo grass, real stone, dirt).
- Dark, neon or glassmorphism screens.
- Flat vector clip-art and hand-drawn SVG characters.
- Famous or copyrighted characters, real brand logos.

## 11. Prompt blocks

**Gemini, picture for a Tripo model.** Put this before the description of the object:

```
Single object for a 3D model, children's game "English Adventure Academy" (age 8).
Chunky, soft, rounded toy-like 3D cartoon style like a modern animated kids' film, matching the attached team monsters.
Bright saturated clean colours (not pale), max 3 main colours: one main colour, one accent in [TEAM COLOUR], one neutral (cream / wood / warm stone).
Smooth painted surfaces, gentle shine, few big shapes, 2–3 small details only. No text, no dirt, no realistic textures, no black.
One object only, centred, whole object visible, plain white background, no ground, front three-quarter view from slightly above, soft light from top left.
OBJECT: ...
```

**Tripo:**
- image-to-3D from that picture, HD texture, private;
- check the result next to a monster in the game before making more;
- if it looks pale or busy, fix the picture first, not the model.

## 12. Checklist

- [ ] Would it look right standing next to Aquafind on the island?
- [ ] Rounded, chunky, few big shapes, readable as a small outline?
- [ ] Strong clean colours, at most 3, a team-colour accent, no black or pale colours?
- [ ] No text on the model, no realistic textures, no famous characters?
- [ ] Within the size limits, CC0 or our own, pupil heads kept private?
