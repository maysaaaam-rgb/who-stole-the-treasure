import subprocess, re

out = subprocess.check_output(['tools/jre/bin/java.exe', '-jar', 'tools/ffdec/ffdec.jar', '-dumpSWF', 'build/fleabag_vs_mutt.swf'], text=True)
for line in out.splitlines():
    if 'name: "' in line or 'FrameLabel' in line:
        print(line.strip()[:110])
