import os, glob

for f in sorted(glob.glob("src/assets/audio/*.mp3")):
    name = os.path.basename(f)
    sz = os.path.getsize(f)
    print(f"{name:<12} {sz:>6} bytes")
