import subprocess, re, os

out = subprocess.check_output(['tools/jre/bin/java.exe', '-jar', 'tools/ffdec/ffdec.jar', '-dumpSWF', 'build/fleabag_vs_mutt.swf'], text=True)

sprites = {}
current_sprite = None
for line in out.splitlines():
    m_spr = re.search(r'DefineSprite \(chid: (\d+)\)', line)
    if m_spr:
        current_sprite = int(m_spr.group(1))
        sprites[current_sprite] = {'frames': 0, 'tags': [], 'actions': []}
    elif current_sprite:
        if 'ShowFrame' in line:
            sprites[current_sprite]['frames'] += 1
        m_place = re.search(r'PlaceObject2?.*chid: (\d+)', line)
        if m_place:
            sprites[current_sprite]['tags'].append(int(m_place.group(1)))
        if 'FrameLabel' in line:
            sprites[current_sprite]['actions'].append(line.strip())

for sid, sdata in sorted(sprites.items()):
    if sdata['frames'] > 5 or sdata['actions']:
        print(f"Sprite {sid}: frames={sdata['frames']}, actions={sdata['actions']}, tags={list(set(sdata['tags']))[:10]}")
