import os
from PIL import Image

for f in [1, 2, 70, 74, 98, 99, 100, 101, 102, 103, 104]:
    p = f"src/assets/sprites/assembled/frames/{f}.png"
    if os.path.exists(p):
        im = Image.open(p)
        print(f"Frame {f}: size={im.size}")
