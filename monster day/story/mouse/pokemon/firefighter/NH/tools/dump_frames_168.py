import subprocess

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
    if 167 <= current_frame <= 172:
        if any(k in line for k in ["PlaceObject", "DoAction", "FrameLabel", "StartSound"]):
            print(f"Frame {current_frame}: {line.strip()[:100]}")
