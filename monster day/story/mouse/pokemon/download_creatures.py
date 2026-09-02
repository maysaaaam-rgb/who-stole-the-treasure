import urllib.request
import os

creature_map = {
    # FOX
    'fennekin': 653,
    'jolteon': 135,
    'glaceon': 471,
    'zorua': 570,
    'vulpix': 37,
    # CAT
    'litten': 725,
    'shinx': 403,
    'vaporeon': 134,
    'meowth': 52,
    'espurr': 677,
    # RABBIT
    'scorbunny': 815,
    'buneary': 427,
    'plusle': 311,
    'raboot': 816,
    # TURTLE
    'torkoal': 324,
    'turtwig': 387,
    'chewtle': 833,
    'drednaw': 834,
    # DRAGON
    'dratini': 147,
    'axew': 610,
    'noibat': 714,
    'bagon': 371,
    'gible': 443,
    # BIRD
    'fletchling': 661,
    'torchic': 255,
    'rowlet': 722,
    'rookidee': 821,
    'pidgey': 16,
    # WOLF
    'rockruff': 745,
    'growlithe': 58,
    'houndour': 228,
    'riolu': 447,
    'electrike': 309,
    # FROG
    'froakie': 656,
    'croagunk': 453,
    'poliwag': 60,
    # DINOSAUR
    'fuecoco': 909,
    'tyrunt': 696,
    'totodile': 158,
    'larvitar': 246,
    # MOUSE
    'cyndaquil': 155,
    'marill': 183,
    'dedenne': 702,
    'pawmi': 921
}

os.makedirs('assets/images', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

print(f"Checking {len(creature_map)} creature bases and elemental variants...")
downloaded = 0
for name, pid in creature_map.items():
    dest = f'assets/images/{name}.png'
    if not os.path.exists(dest):
        url = f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pid}.png'
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=10) as response, open(dest, 'wb') as out_file:
                out_file.write(response.read())
            print(f'Downloaded {name} (#{pid}) -> {dest}')
            downloaded += 1
        except Exception as e:
            print(f'Error fetching {name} (#{pid}): {e}')
    else:
        print(f'Already exists: {dest}')

print(f"Creature asset download complete! {downloaded} new files downloaded.")
