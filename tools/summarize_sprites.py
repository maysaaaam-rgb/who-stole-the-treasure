import os, json

sprites_base = "cat-vs-dog/assets/sprites/assembled/sprites"
summary = {}

for s in sorted(os.listdir(sprites_base)):
    sp = os.path.join(sprites_base, s)
    if os.path.isdir(sp):
        files = [f for f in os.listdir(sp) if f.endswith(".png")]
        # sort naturally by frame number
        files.sort(key=lambda x: int(os.path.splitext(x)[0]) if os.path.splitext(x)[0].isdigit() else 999)
        summary[s] = len(files)

print(json.dumps(summary, indent=2))
