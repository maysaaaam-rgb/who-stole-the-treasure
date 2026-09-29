import os, glob

key_sprites = [
    "DefineSprite_170", "DefineSprite_171", "DefineSprite_205", 
    "DefineSprite_288", "DefineSprite_289", "DefineSprite_325",
    "DefineSprite_405", "DefineSprite_418", "DefineSprite_216",
    "DefineSprite_246", "DefineSprite_364", "DefineSprite_166",
    "DefineSprite_118", "DefineSprite_126", "DefineSprite_257", "DefineSprite_281"
]

for ks in key_sprites:
    d = os.path.join("src/assets/sprites/assembled/sprites", ks)
    if os.path.exists(d):
        pngs = glob.glob(os.path.join(d, "*.png"))
        print(f"{ks}: {len(pngs)} frames (sample: {[os.path.basename(p) for p in pngs[:4]]})")
