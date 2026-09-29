from PIL import Image
import os

for s in ["DefineSprite_92", "DefineSprite_94", "DefineSprite_103", "DefineSprite_114", "DefineSprite_220"]:
    d = os.path.join("src/assets/sprites/assembled/sprites", s)
    im = Image.open(os.path.join(d, "1.png"))
    # get non-transparent bounding box
    bbox = im.getbbox()
    print(f"{s}: size={im.size}, bbox={bbox}")
