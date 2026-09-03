import os
import re
import sys
import subprocess

print("=== VERIFYING POKEMON GAME INTEGRITY ===")

# 1. Check all image files in assets/images
images_dir = 'assets/images'
if not os.path.isdir(images_dir):
    print("ERROR: assets/images directory missing!")
    sys.exit(1)

all_images = [f for f in os.listdir(images_dir) if f.endswith('.png')]
print(f"Found {len(all_images)} images in {images_dir}")

empty_images = []
for img in all_images:
    path = os.path.join(images_dir, img)
    size = os.path.getsize(path)
    if size == 0:
        empty_images.append(img)

if empty_images:
    print(f"ERROR: {len(empty_images)} empty images found: {empty_images}")
    sys.exit(1)
else:
    print("All image files are non-empty and valid!")

# 2. Check essential creature bases exist
expected_bases = [
    'fennekin', 'vulpix', 'jolteon', 'glaceon', 'zorua', # Fox
    'litten', 'shinx', 'vaporeon', 'meowth', 'espurr', # Cat
    'scorbunny', 'buneary', 'plusle', 'raboot', # Rabbit
    'squirtle', 'torkoal', 'turtwig', 'chewtle', 'drednaw', # Turtle
    'dragonite', 'dratini', 'axew', 'noibat', 'gible', 'bagon', # Dragon
    'fletchling', 'torchic', 'rowlet', 'rookidee', 'pidgey', 'pidgeot', # Bird
    'rockruff', 'growlithe', 'houndour', 'riolu', 'electrike', # Wolf
    'froakie', 'croagunk', 'poliwag', 'greninja', # Frog
    'fuecoco', 'tyrunt', 'totodile', 'larvitar', 'charmander', # Dinosaur
    'pikachu', 'cyndaquil', 'marill', 'dedenne', 'pawmi', # Mouse
    'butterfree', 'heracross', 'magnemite', 'bulbasaur', 'jigglypuff', 'onix', 'gengar'
]

missing_bases = []
for b in expected_bases:
    if not os.path.exists(os.path.join(images_dir, f"{b}.png")):
        missing_bases.append(b)

if missing_bases:
    print(f"ERROR: Missing creature images: {missing_bases}")
    sys.exit(1)
else:
    print(f"All {len(expected_bases)} curated creature base models exist on disk!")

# 3. Check JavaScript syntax using Node
for js_file in ['data.js', 'sound.js', 'creatures.js', 'app.js']:
    res = subprocess.run(['node', '-c', js_file], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"SYNTAX ERROR in {js_file}:\n{res.stderr}")
        sys.exit(1)
    else:
        print(f"Syntax OK: {js_file}")

# 4. Check HTML elements matching App.js
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

required_ids = [
    # Top controls
    'btnFullscreen', 'fullscreenIcon', 'btnAudioPrompt',
    # Mystery Icebreaker Screen (zero silhouette)
    'screen-spotting', 'mysteryClueView', 'mysteryRevealView',
    'mysteryRoundBadge', 'mysteryStarRatingPill', 'mysteryPodFrame',
    'mysteryThemeLabel', 'cluesRevealedTracker', 'clueBarsGrid',
    'mysteryChoicesGrid', 'mysteryFeedbackMsg',
    # Dedicated Reveal View
    'revealHeroTitle', 'revealHeroType', 'revealHeroImg',
    'revealSentencesList', 'btnSpeakAllClues', 'revealStarsText', 'btnNextMysteryRound',
    # Trainer 1 Paginated Creator
    'p1-creator-page-1', 'p1-creator-page-2', 'p1-creator-page-3',
    'p1-base-choices', 'p1-size-choices', 'p1-personality-choices',
    'p1-color-choices', 'p1-feature-choices', 'p1-ability-choices',
    'p1-spec-base', 'p1-spec-size', 'p1-spec-personality', 'p1-spec-color',
    'p1-spec-features', 'p1-spec-abilities', 'p1-pod-preview-img',
    'p1-slot-base', 'p1-slot-size', 'p1-slot-color', 'p1-slot-personality', 'p1-slot-ab1', 'p1-slot-ab2',
    # Trainer 2 Paginated Creator
    'p2-creator-page-1', 'p2-creator-page-2', 'p2-creator-page-3',
    'p2-base-choices', 'p2-size-choices', 'p2-personality-choices',
    'p2-color-choices', 'p2-feature-choices', 'p2-ability-choices',
    'p2-spec-base', 'p2-spec-size', 'p2-spec-personality', 'p2-spec-color',
    'p2-spec-features', 'p2-spec-abilities', 'p2-pod-preview-img',
    'p2-slot-base', 'p2-slot-size', 'p2-slot-color', 'p2-slot-personality', 'p2-slot-ab1', 'p2-slot-ab2',
    # Battle Arena
    'battleCreatureP1', 'battleCreatureP2', 'champCreatureViewport'
]

missing_ids = [i for i in required_ids if f'id="{i}"' not in html_content]
if missing_ids:
    print(f"ERROR: Missing HTML IDs: {missing_ids}")
    sys.exit(1)
else:
    print(f"All {len(required_ids)} required Smartboard UI IDs are present in index.html!")

print("\n=== ALL GAME, MYSTERY ICEBREAKER & CREATOR INTEGRITY CHECKS PASSED PERFECTLY! ===")
