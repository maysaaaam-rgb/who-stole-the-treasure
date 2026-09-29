from PIL import Image
import os

for f in [167, 168, 175, 185, 195, 200, 307, 308, 315, 325, 335, 340]:
    p = f"src/assets/sprites/assembled/frames/{f}.png"
    if os.path.exists(p):
        print(f"Frame {f} exists: size={Image.open(p).size}")
