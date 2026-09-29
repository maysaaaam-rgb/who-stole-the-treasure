import subprocess, re

out = subprocess.check_output(['tools/jre/bin/java.exe', '-jar', 'tools/ffdec/ffdec.jar', '-dumpSWF', 'build/fleabag_vs_mutt.swf'], text=True)

lines = out.splitlines()
in_main = False
main_lines = []
for line in lines:
    if "ShowFrame" in line and not in_main:
        in_main = True
    if in_main:
        main_lines.append(line)

current_frame = 1
for line in main_lines:
    if "ShowFrame" in line:
        current_frame += 1
    if 102 <= current_frame <= 104 and ("PlaceObject2" in line or "DoAction" in line):
        print(f"Frame {current_frame}: {line.strip()}")
