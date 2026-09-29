from PIL import Image
import os, glob

# Let's inspect the shapes by rendering their SVG to PNG or checking their contents
print("Checking shapes for Dog Bowl, Garbage Can, Fence, Items...")

import xml.etree.ElementTree as ET

shapes_info = []
for p in sorted(glob.glob("src/assets/sprites/shapes/*.svg"), key=lambda x: int(os.path.splitext(os.path.basename(x))[0])):
    sid = int(os.path.splitext(os.path.basename(p))[0])
    try:
        tree = ET.parse(p)
        root = tree.getroot()
        w = root.get("width", "")
        h = root.get("height", "")
        # Get all fill colors
        colors = set()
        for elem in root.iter():
            f = elem.get("fill")
            if f and f.startswith("#"):
                colors.add(f.lower())
        shapes_info.append((sid, w, h, colors))
    except Exception as e:
        pass

for sid, w, h, colors in shapes_info:
    # Dog bowl: small, maybe red or silver or blue
    # Bone: white/cream (#ffffff, #ffe2b5)
    if "30.05px" in w or "66.2px" in w:
        print(f"Shape {sid}: w={w} h={h} (Possible dog bowl or item) colors={colors}")
    if any(c in colors for c in ["#996600", "#663300", "#857d50"]):
        if float(h.replace("px","")) > 40:
            print(f"Shape {sid}: w={w} h={h} (Wood/Fence) colors={colors}")
