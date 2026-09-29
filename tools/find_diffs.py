from PIL import Image

bg = Image.open("src/assets/sprites/png_shapes/30.png").convert("RGBA")
f104 = Image.open("src/assets/sprites/assembled/frames/104.png").convert("RGBA")

# Resize or align if needed
bw, bh = bg.size
fw, fh = f104.size
print(f"BG size: {bw}x{bh}, Frame 104 size: {fw}x{fh}")

diff_mask = Image.new("L", (fw, fh), 0)
for y in range(min(bh, fh)):
    for x in range(min(bw, fw)):
        p1 = bg.getpixel((x, y))
        p2 = f104.getpixel((x, y))
        # if colors differ significantly
        dist = sum(abs(c1 - c2) for c1, c2 in zip(p1[:3], p2[:3]))
        if dist > 30:
            diff_mask.putpixel((x, y), 255)

# Find bounding boxes of difference regions
from PIL import ImageDraw
bbox = diff_mask.getbbox()
print("Total diff bbox:", bbox)

# Let's save diff_mask to see where the objects are
diff_mask.save("build/diff_mask.png")

# Now let's segment diffs by regions
# Left (Mutt): x < 250
# Center (Wind / Fence top): 250 <= x <= 350
# Right (Cat): x > 350
box_left = diff_mask.crop((0, 0, 250, fh)).getbbox()
box_center = diff_mask.crop((250, 0, 350, fh)).getbbox()
box_right = diff_mask.crop((350, 0, fw, fh)).getbbox()

print("Left (Mutt & HUD) bbox:", box_left)
print("Center (Wind meter) bbox:", box_center)
print("Right (Cat & HUD) bbox:", box_right)
