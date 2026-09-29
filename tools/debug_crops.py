import os
from PIL import Image

os.makedirs("build/debug", exist_ok=True)
im = Image.open("src/assets/sprites/assembled/frames/104.png")

# Crop top HUD
im.crop((0, 0, 600, 80)).save("build/debug/top_hud.png")

# Crop Mutt area (left side)
im.crop((30, 180, 220, 360)).save("build/debug/mutt_area.png")

# Crop Cat area (right side)
im.crop((380, 180, 570, 360)).save("build/debug/cat_area.png")

# Crop center fence & wind
im.crop((220, 0, 380, 200)).save("build/debug/center_top.png")
im.crop((240, 180, 360, 380)).save("build/debug/fence_center.png")

# Crop bottom UI / powerup buttons
im.crop((0, 360, 600, 430)).save("build/debug/bottom_ui.png")

print("Saved debug crops to build/debug/")
