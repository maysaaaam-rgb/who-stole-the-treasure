import urllib.request
import os

pokemon_map = {
    'pikachu': 25,
    'charizard': 6,
    'squirtle': 7,
    'bulbasaur': 1,
    'charmander': 4,
    'eevee': 133,
    'gengar': 94,
    'greninja': 658,
    'jigglypuff': 39,
    'dragonite': 149,
    'lucario': 448,
    'butterfree': 12,
    'snorlax': 143,
    'diglett': 50,
    'machamp': 68,
    'magikarp': 129,
    'slowpoke': 79,
    'joltik': 595,
    'lapras': 131,
    'pidgeot': 18,
    'haunter': 93,
    'electabuzz': 125,
    'onix': 95,
    'arcanine': 59
}

os.makedirs('assets/images', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for name, pid in pokemon_map.items():
    dest = f'assets/images/{name}.png'
    if not os.path.exists(dest):
        url = f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pid}.png'
        print(f'Fetching {name} (#{pid})...')
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=10) as response, open(dest, 'wb') as out_file:
                out_file.write(response.read())
            print(f'Saved {dest}')
        except Exception as e:
            print(f'Failed to fetch {name}: {e}')

print('Asset download complete!')
