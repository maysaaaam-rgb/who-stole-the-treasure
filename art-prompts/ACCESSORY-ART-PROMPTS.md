# Accessory art prompt kit (customising the illustrated monsters)

The illustrated monsters are finished pictures, so customising them works by LAYERING:
background -> aura -> monster art -> accessory pictures on top.
Items must be separate transparent pictures in the same art style.

## What works on the illustrated monsters
| Group | Plan | Count |
|---|---|---|
| Backgrounds (13) | I reuse the scenes already in the platform. No new art. | 0 |
| Auras (10) | I reuse the existing glow/particle effects. No new art. | 0 |
| Body colour (6) | Species + a hue shift. No new art. | 0 |
| Hats (8) | NEW art, sits on top of the head | 8 |
| Glasses (2) | NEW art, sits on the eyes | 2 |
| Neck items (4) | NEW art: star necklace, medal, pendant, badge | 4 |
| Backpacks (4) | NEW art, behind the monster | 4 |
| Held items (6) | NEW art: book, wand, compass, trophy, microphone, flag | 6 |
| Eyes, mouths, ears, horns, tails, wings | NOT customisable (they are part of each species picture) | 0 |
| Outfits (17) | Only 4 simple ones that sit on top: scarf, cape, vest, hoodie collar | 4 |

Total: 28 pictures. Skipped outfits (armour, robes) would need a different picture for every species and stage.

## How to use
1. Use the Gemini app, one chat, paste the STYLE BLOCK once.
2. One item per image, 1:1 square, 1024x1024, PNG.
3. Save as `item_<id>.png` in `assets/monsters/items/` (names below). Tell me and I will cut out the backgrounds and fit them on every monster.
4. Important: draw the item ALONE, front view, centred, no creature, no hand holding it, flat plain light-grey background (#e8e8e8).
5. Hats must be drawn from the front, level, as if sitting on a head about 60% of the picture width.

## STYLE BLOCK (paste once)
```
You are the art director of a children's English learning game, ages 8 to 10.
Draw single wearable accessory props in ONE consistent style that matches cute 3D-rendered mobile-game mascots:
polished 3D look, soft studio lighting from the top left, subtle rim light, thick soft clean outline, rich saturated child-friendly colours, smooth shading, a tiny bit of glossy highlight.
Each image shows ONE item only, front view, perfectly centred and level, filling about 70% of the picture, on one flat plain light-grey background (#e8e8e8), no shadow, no floor, no hand, no creature, no text, no watermark.
Square 1:1.
```

## HATS (front view, level, sits on a head)
| file | prompt line |
|---|---|
| item_hat_crown.png | A small golden royal crown with three rounded points, red gem in the middle, tiny pearls. |
| item_hat_explorer.png | A tan explorer safari hat with a brown band and a small feather. |
| item_hat_scholar.png | A black graduation cap (mortarboard) with a gold tassel hanging to the side. |
| item_hat_wizard.png | A tall purple wizard hat with gold stars and a curved tip. |
| item_hat_bow.png | A big pink ribbon bow with a small round knot in the middle. |
| item_hat_starclip.png | A small golden star hair clip with a sparkle. |
| item_hat_flower.png | A cute daisy flower crown with white petals and yellow centres on a small green vine ring. |
| item_hat_headband.png | A sporty red headband with a white stripe and a small knot on one side. |

## GLASSES (front view, level, two lenses)
| file | prompt line |
|---|---|
| item_glasses_round.png | Round thin golden-framed glasses, clear shiny lenses, wide enough to fit big round cartoon eyes. |
| item_glasses_goggles.png | Brown leather adventure goggles with round brass-rimmed blue glass lenses and a strap. |

## NECK ITEMS (front view)
| file | prompt line |
|---|---|
| item_neck_star.png | A golden star pendant on a thin gold chain, chain curved like a U. |
| item_neck_medal.png | A gold medal with a blue ribbon, curved like a U. |
| item_neck_pendant.png | A glowing teal gem pendant on a thin silver chain, curved like a U. |
| item_neck_badge.png | A round red-and-gold school badge on a short ribbon, curved like a U. |

## BACKPACKS (seen from the front-side, will be placed behind the monster)
| file | prompt line |
|---|---|
| item_bp_explorer.png | A brown explorer backpack with buckles and a rolled-up sleeping mat on top. |
| item_bp_book.png | A blue backpack shaped like a closed storybook with gold corners. |
| item_bp_miniwings.png | A small yellow backpack with tiny white feather wings on both sides. |
| item_bp_adventure.png | A big green adventure bag with a map sticking out of a pocket. |

## HELD ITEMS (drawn alone, no hand)
| file | prompt line |
|---|---|
| item_held_book.png | An open storybook with colourful pages. |
| item_held_wand.png | A wooden magic wand with a glowing star on the tip. |
| item_held_compass.png | A golden compass with a red needle. |
| item_held_trophy.png | A golden trophy cup with two handles. |
| item_held_microphone.png | A cute red microphone. |
| item_held_flag.png | A small flag on a stick with a star on it. |

## OUTFITS THAT SIT ON TOP (front view, shaped to wrap a small round body)
| file | prompt line |
|---|---|
| item_outfit_scarf.png | A thick cosy striped red-and-white winter scarf, wrapped in a loop, short tail hanging down on one side. |
| item_outfit_cape.png | A flowing red superhero cape with a gold clasp, seen from the front, open so a body can show in the middle. |
| item_outfit_vest.png | A small brown explorer vest with two pockets and buttons, open at the front. |
| item_outfit_hoodie.png | A soft blue hoodie collar and shoulders only, hood resting around the neck, front zip. |

## Checklist
- [ ] 28 pictures, named exactly as above, in `assets/monsters/items/`
- [ ] Item alone, centred, grey background, no creature or hand
- [ ] Hats level and symmetric (front view)

## What I do once they exist
1. Cut out the backgrounds (same process as the monsters).
2. Find the head, eye line, neck and body centre on each of the 30 monster pictures and place each item correctly, scaled per stage.
3. Add a "Customise" panel that works on the illustrated monster, with the same unlock levels as now.
4. Keep the old drawn monsters as the fallback until all is checked.
