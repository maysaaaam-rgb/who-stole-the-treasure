import subprocess, re

out = subprocess.check_output(['tools/jre/bin/java.exe', '-jar', 'tools/ffdec/ffdec.jar', '-dumpSWF', 'build/fleabag_vs_mutt.swf'], text=True)

for bid in [180, 183, 186, 189, 192, 194, 196, 198, 218, 368]:
    for line in out.splitlines():
        if f"chid: {bid}" in line and "PlaceObject" in line:
            print(f"Button {bid}: {line.strip()[:100]}")
