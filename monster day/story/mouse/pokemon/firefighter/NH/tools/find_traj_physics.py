import subprocess, re

out = subprocess.check_output(['tools/jre/bin/java.exe', '-jar', 'tools/ffdec/ffdec.jar', '-dumpSWF', 'build/fleabag_vs_mutt.swf'], text=True)

# Let's inspect the motion tween / Matrix coordinates for the projectile across frames 168 to 200
# Look for PlaceObject2 with matrix or translation
lines = out.splitlines()

# Search for PlaceObject2 with translation (tx, ty) on depths 1 or 2
in_main = False
current_frame = 1
traj_coords = {}

for line in lines:
    if "ShowFrame" in line and not in_main:
        in_main = True
    if "ShowFrame" in line:
        current_frame += 1
    if 168 <= current_frame <= 200:
        if "PlaceObject2" in line and ("dpt: 1" in line or "dpt: 2" in line):
            traj_coords.setdefault(current_frame, []).append(line.strip())

print(f"Captured {len(traj_coords)} trajectory frames:")
for f in [168, 175, 184, 192, 200]:
    if f in traj_coords:
        print(f"Frame {f}: {traj_coords[f][:2]}")
