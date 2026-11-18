# English Adventure Academy · Style Guide

**Read this before you make any screen, game, picture or 3D model.** It replaces the old "dark obsidian glass" look.
Decided by the teacher on 18 November 2026. Target pictures: `docs/design/` (the island home world, the Class Board in the park).

## 1. The identity in one sentence

> **English Adventure Academy is a sunny adventure park where the children's own avatars play with four team monsters, working towards the big goal: Treasure Island. Pink, Blue, Yellow and Green tie everything together.**

If a new screen, game, picture or model does not fit this sentence, it does not belong.

## 2. The world

- A bright, cosy cartoon **adventure park on a green island in a sunny sea**. Blue sky, soft clouds, rounded trees, colourful flags.
- Every part of the platform is a **place in the park**:

| Place | Opens |
|---|---|
| Castle | Today (the lesson starts here) |
| Open-air stone theatre (curved steps) | Class Board |
| Market stall with a striped awning | Avatar Studio & Shop |
| Games district (stadium, race track, cannon field, funfair, …) | The games |
| Round library tower | Library, Board & Book |
| Harbour + ship, with **Treasure Island** across the sea | The big class goal |

- The class's progress is visible in the world. For example, the bridge to Treasure Island grows with the class goal.
- The 3D world for games lives in `games/world/` (`map.json`, `pieces.json`) and is loaded with `K.World.load({ zone })` from `games/kit3d/world3d.js`.

## 3. The cast (one family of characters)

| Team | Colour | Monster |
|---|---|---|
| Pink | `#ff5fa2` | **Emberwing**: baby phoenix bird |
| Blue | `#4f9dff` | **Aquafind**: baby axolotl |
| Yellow | `#ffb320` | **Sparktail**: fluffy sheep with yellow horns |
| Green | `#2fc58a` | **Florasprout**: leaf-eared bunny |

- The four monsters are the platform's heroes and lead the teams (`assets/3d/monsters/*.glb`, `K.TEAMS` in `kit3d.js`).
- Each monster must clearly show its team colour. Emberwing needs pink touches and Sparktail needs yellow touches, such as their neckerchiefs.
- Children appear as their **own avatars** (cut-out pictures from `js/pupil-avatars.js`; in 3D, kid models with their faces).
- **No famous or copyrighted characters anywhere**, including Mario, Sonic, Sanrio, Minecraft, Among Us crewmates, Spider-Man, SpongeBob and K-pop film characters. New pets and buddies are original animals and monsters.

## 4. Look and colour

- **Bright daylight, always.** Light backgrounds: sky blue `#78c4ff → #c8eaff`, cream `#fff8ec`, white.
- **Do not use** dark obsidian backgrounds, neon glows or "glassmorphism" on children's screens.
- Text colour: deep ink `#2b1d40`, never pure black.
- The four team colours are the accents for buttons, borders, flags, badges and progress bars. Use at most one extra accent: lilac `#9b7bff`.
- Cards are white or cream, with rounded corners (20–30 px) and a 4–6 px border in a team colour.
- Keep screens calm: few words, big pictures, lots of space. A smartboard is read from the back of the room.

## 5. Type

- One round, bold, friendly font family: **Nunito** (900 for headings, 700–800 for buttons, 600 for text). Fallbacks: "Trebuchet MS", system-ui.
- Short English labels only, spelled correctly. Headings 1.6–2.4 rem on smartboard screens, never below 1 rem.

## 6. Buttons and controls

- **Big, round "pushable" buttons**: a pill shape in a team colour (or white), with a darker 5–6 px bottom lip, pressing down 4 px on `:active` with a springy ease (`cubic-bezier(.175,.885,.32,1.275)`).
- Touch targets are at least 56 px (children use the smartboard with their fingers).
- Copy the existing styles in `games/kit3d/kit3d.css` (`.btn`, `.cbtn`, `.pnum`, `.clsbtn`) rather than inventing new ones.

## 7. 3D models

- **Characters and special buildings:** soft, rounded, glossy cartoon style like the four monsters. Make them with Gemini picture → Tripo image-to-3D, using the target pictures in `docs/design/` as the source so they match.
- **Small world props** (plants, rocks, barrels, fences): free **CC0** packs (Quaternius, KayKit, Kenney) are fine. Repack them as one small `.glb` each, with textures ≤ 512 px and no normal maps (see `assets/3d/world/nature/`). Keep each pack's license file next to the models. **Never** put paid or non-CC0 asset files in this public repository.
- Size limit: about 600 KB per model (big landmarks up to 1 MB).
- Register world pieces in `games/world/pieces.json`. Leafy models may use `"glow"` to look sunnier.
- Raw downloads stay in ignored work folders (`quaternius-work/`), never in `assets/`.

## 8. Picture recipe (for Gemini)

Start every picture prompt with this block, and attach the four-monster picture when characters appear:

```
STYLE: A children's English-learning world called "English Adventure Academy", for 8-year-olds, shown on a classroom smartboard.
WORLD: a sunny cartoon adventure park on a green island — blue sky with soft clouds, rounded trees, colourful flags in pink, blue, yellow and green, a castle, and Treasure Island (palm tree + glowing chest) across the sea.
LOOK: bright daylight, soft rounded 3D cartoon style like a modern animated kids' film, gentle shadows, clean and uncluttered. NOT dark, NOT neon, NOT glassmorphism.
COLOURS: Pink #ff5fa2, Blue #4f9dff, Yellow #ffb320, Green #2fc58a, plus white, cream and sky blue.
CHARACTERS: the four team monsters (Emberwing pink phoenix, Aquafind blue axolotl, Sparktail yellow-horned sheep, Florasprout green bunny) and cute cartoon kid avatars. No famous or copyrighted characters, no other brands.
TEXT: very little; short English labels, spelled correctly, in a round bold font.
```

## 9. Checklist before you finish

- [ ] Bright park look, team colours, no dark or neon screens?
- [ ] Only our monsters, our children's avatars and original characters?
- [ ] Big pushable buttons, readable from the back of the classroom?
- [ ] New 3D models small enough, and their licenses CC0 or our own?
- [ ] No pupil names, photos or private data in any file (AGENTS.md section 8)?
