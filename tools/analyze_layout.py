from PIL import Image

im = Image.open("src/assets/sprites/assembled/frames/104.png")
w, h = im.size
print(f"Canvas size: {w}x{h}")

# In frame 104, let us locate the buttons, health bars, characters
# Let us inspect the bottom bar (buttons)
# Buttons are near bottom or top?
# Let us scan rows
for y in range(0, h, 20):
    # sample x across 50, 150, 275, 400, 500
    samples = [im.getpixel((x, y)) for x in [50, 150, 275, 400, 520]]
    # if not all background-like
    # print line info
