from PIL import Image
import os

key_sprites = [
    ("Dog Idle / Walk / State", "DefineSprite_170"),
    ("Dog Hurt States", "DefineSprite_171"),
    ("Dog Throw Swing", "DefineSprite_205"),
    ("Dog Hurt Extended", "DefineSprite_166"),
    ("Dog Victory", "DefineSprite_418"),
    ("Cat Idle / Walk / State", "DefineSprite_288"),
    ("Cat Hurt States", "DefineSprite_289"),
    ("Cat Throw Swing", "DefineSprite_325"),
    ("Cat Victory", "DefineSprite_405"),
    ("Wind Indicator", "DefineSprite_216"),
    ("Dog Charging / Power", "DefineSprite_118"),
    ("Cat Charging / Power", "DefineSprite_257"),
    ("Dog Angle / Trajectory", "DefineSprite_246"),
    ("Cat Angle / Trajectory", "DefineSprite_364")
]

for desc, name in key_sprites:
    d = os.path.join("src/assets/sprites/assembled/sprites", name)
    if os.path.exists(d):
        p1 = os.path.join(d, "1.png")
        if os.path.exists(p1):
            im = Image.open(p1)
            print(f"{desc:<25} ({name}): frame 1 size={im.size}")
