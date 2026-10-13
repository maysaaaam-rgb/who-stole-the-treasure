# Game Shelf card art (100 cards)

Goal: replace the plain emoji on the Game Shelf cards (Class Mode, smartboard) with one friendly 3D picture per card,
in the same style as `platform-art/m_games.webp`, `r_chest.webp` and `h_homework_book.webp`.

## STYLE (put this at the top of EVERY image request)

> A single glossy 3D-rendered sticker illustration for a children's English classroom game (ages 7-10).
> Soft rounded shapes, bright saturated but friendly colours, gentle studio lighting with a soft highlight,
> a thick clean WHITE die-cut sticker outline around the whole subject, a tiny soft shadow underneath.
> Transparent background. Subject centred, filling about 80% of the square, slight three-quarter view.
> No text, no letters, no numbers, no logos, no watermark, no frame, no background scene.
> Cute and kind, never scary. 512 x 512 px.

If a character is needed, make it a cheerful cartoon character with a big smile and simple clothes.
Never draw real brands or real children's faces.

## FILES

- Save each picture as `assets/shelf/<id>.webp` (transparent WebP, 512 x 512, under 60 KB if possible).
- `<id>` is the first column below, exactly as written.
- When the pictures exist, ask Claude: "wire the shelf art" and it adds each id to the `THUMBS` list in `js/class-mode.js`.
- Do them in batches of 10. Use the same style paragraph every time so the set matches.

## THE 100 CARDS  (id - what to draw)

### Batch 1: Alice in Wonderland
1. `alice-cards-4a` - a steaming teapot with a playing card tucked in the spout
2. `alice-cards-4b` - a tall purple top hat with a card in the band
3. `alice-quest` - a tea party table with a teapot and three cups
4. `alice-homework` - a white rabbit holding a pocket watch and a small homework book
5. `alice-party-home-4a` - a teacup and saucer with hearts floating up
6. `alice-party-home-4b` - a cupcake on a stand with a tiny flag
7. `story-engine-alice` - Alice-style girl with long blonde hair and a blue dress, waving
8. `wonderland-lesson1` - a white rabbit in a waistcoat running
9. `wonderland-lesson2` - a pocket watch with wings (time machine)
10. `wonderland-lesson3` - two theatre masks (happy and calm) with a tiny crown prop

### Batch 2: space and science
11. `nasa-mission` - a small rocket flying past a ringed planet
12. `solar-system` - a ringed planet with three small moons
13. `space-cadet` - a smiling astronaut helmet with a star on it
14. `first-harvest-g3` - a rocket with a tiny green plant growing on top
15. `dino-arena` - a friendly T-rex wearing a boxing glove
16. `dino-expedition` - a friendly long-neck dinosaur with a compass
17. `dino-dig` - a dinosaur skeleton skull with a small brush and shovel
18. `monster-evolution` - a baby dragon hatching from a spotted egg
19. `fantasy-creatures` - a smiling unicorn-dragon mix with tiny wings
20. `clil-lab` - a magnifying glass over a test tube and a fingerprint

### Batch 3: inventors, robots and brains
21. `young-inventor` - a lightbulb with a small wrench and a gear
22. `inventor-forge` - an anvil with glowing gears on top
23. `inventor-lab` - a friendly workshop table lamp, cogs and a blueprint roll
24. `good-ideas-lab` - a bright lightbulb with a small sprout inside
25. `clara-inventor` - a girl inventor with goggles holding a drawing of a gadget
26. `robots` - a friendly round-headed robot waving
27. `eco-engineers` - a small solar-panel rover with a green leaf
28. `smart-farm` - a farm robot with a tiny tractor and a carrot
29. `brain-hackers` - a smiling pink brain wearing a hacker cap and glasses
30. `brain-quit` - a tired pink brain with a "zzz" bubble (no letters, just three small round dots)

### Batch 4: brain and energy
31. `brain-explorers` - a pink brain with a small explorer hat and a magnifier
32. `freeze-game` - an ice-blue lightning bolt frozen in a snowflake
33. `sound-detective` - big headphones with sound waves and a magnifier
34. `ocean-cleaners` - a cheerful little boat with a net, and a clean wave
35. `wildlife-detective` - a beaver with a magnifying glass
36. `biome-crafter` - a cube-shaped block world piece with a tiny tree (not any real game)
37. `jungle` - a friendly parrot on a leafy branch
38. `forest-safari` - a tent-style jeep with a small tree and a deer
39. `forest-adaptation` - a hedgehog with a magnifying lens
40. `story-engine-forest` - a small cabin in a clearing with a tree

### Batch 5: grammar and story games
41. `cat-vs-dog` - a cat and a dog facing each other with a small catapult
42. `meme-rules` - a laughing face sticker with a star and a thumbs-up
43. `twin-gates` - two glowing arched doors side by side
44. `wind-and-sun` - a smiling sun and a puffing wind cloud
45. `ninja-trials` - a cute ninja kid with a headband in a jumping pose
46. `yesterday-detectives` - a detective hat with a footprint and a clock
47. `detective-prep` - a magnifying glass with a question-mark shape made from a swirl (no text)
48. `treasure` - an open treasure chest with a big shiny gem
49. `camp-mystery` - a camping tent with a flashlight beam
50. `room-rescue` - a door with a key and a small chair

### Batch 6: speaking and community
51. `feelings` - four small round faces (happy, sad, surprised, calm) in a row
52. `firefighter` - a firefighter helmet with a small hose
53. `restaurant` - a pizza slice on a plate with a fork
54. `neighbourhood` - three small colourful houses on a street
55. `advice` - a speech bubble holding a lightbulb (no text)
56. `predictions` - a crystal ball with stars
57. `city-mouse` - a mouse in a tiny bow tie holding a cheese slice
58. `story` - an open storybook with a rainbow coming out
59. `wizard-of-oz` - a yellow brick road tile with a small tornado
60. `pokemon` - a round creature with big ears and a lightning-shaped tail (original design, not a real one)

### Batch 7: monsters and phonics
61. `monster-day` - a cute blue monster with three eyes and tiny horns
62. `monster-lab` - a monster standing in a lab beaker bubble
63. `monster-studio` - a paint palette with a small monster and a brush
64. `phonics-adventure` - a tiny pencil made of colourful letter-shaped blocks (blocks show no real letters)
65. `bamboozle-g3-u1` - a mystery box with a question-mark shape on the lid
66. `bamboozle-g3-u2` - a mystery box with a small wheat ear on the lid
67. `bamboozle-g4-u1` - a mystery box with a small open book on the lid
68. `bamboozle-g4-u2` - a mystery box with a small pine tree on the lid
69. `simon-says-grade3` - a crown with three small action icons (a gear, a monster, wheat)
70. `simon-says-grade4` - a crown with three small action icons (a book, a brain, a pine tree)

### Batch 8: revision, print, Chuseok
71. `race-g3-u2` - a small mountain with a flag and a path
72. `race-g4-u2` - a mountain with two small flags and a finish ribbon
73. `print-g3-u2` - a cartoon printer with a worksheet page coming out
74. `print-g4-u2` - a stack of worksheets with a pencil on top
75. `unit-1-diagnostic` - a vault door with a clipboard
76. `wonderland-quiz-briefing` - a stopwatch with a small mushroom
77. `quiz-g3-u1-after-school-inventor` - a school bag with a tiny wrench sticking out
78. `chuseok-festival` - a round harvest moon with a basket of fruit
79. `chuseok-games` - a Korean spinning-top toy and a game stick
80. `harvest-feast` - a feast table with songpyeon, apples and pears

### Batch 9: video, song and stage
81. `watch-answer-bean-g3` - a film clapperboard with a smiling face
82. `week-song-g4` - two musical notes with sparkles
83. `karaoke-stage` - a microphone on a small stage with spotlights
84. `res-global-readings-2` - a stack of two textbooks with a small bookmark
85. `res-global-readings-3` - a stack of three textbooks with a small bookmark
86. `week4-g4-captain` - a penguin astronaut wearing a captain's helmet
87. `week4-g3-daphne` - a girl detective with a magnifying glass and a school bag
88. `swallow-gift-g4` - a white dove with a green leaf
89. `forest-rangers-g4` - a ranger hat with a pine tree badge
90. `chuseok-moon-g3` - a full moon with a small rabbit pounding rice cake

### Batch 10: Unit 3 lessons (money and change)
91. `money-l1-g3` - a coin purse with two coins and a price tag shape
92. `money-l2-g3` - an hourglass with an old coin falling through
93. `money-l3-g3` - a toy train carrying coins
94. `money-l4-g3` - a big coin with a smiling face and a pencil
95. `changing-l1-g4` - a melting ice cube with a tiny green leaf
96. `bear-l2-g4` - a friendly polar bear waving
97. `ice-l3-g4` - an ice crack with a small penguin
98. `poem-l4-g4` - an open poem scroll with a feather pen
99. `creature-cafe` - a cute mythical creature in a chef hat holding a cupcake
100. `expedition` - a brass compass with a tiny snowy mountain and a flag

## CHECKLIST BEFORE YOU SAVE EACH PICTURE

- Transparent background (no white or coloured box behind it)
- White sticker outline all the way round
- No text or letters anywhere (the games use text on the card instead)
- Looks friendly at small size (about 120 px) on a coloured card
- Same lighting and outline thickness as the others in the batch
