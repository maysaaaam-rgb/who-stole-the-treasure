import os
for s in ["DefineSprite_92", "DefineSprite_94", "DefineSprite_103", "DefineSprite_114", "DefineSprite_220"]:
    d = os.path.join("src/assets/sprites/assembled/sprites", s)
    if os.path.exists(d):
        print(s, os.listdir(d))
