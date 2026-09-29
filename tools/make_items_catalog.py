from PIL import Image
import os, glob

items = [
    "DefineSprite_92", "DefineSprite_94", "DefineSprite_103", "DefineSprite_114",
    "DefineSprite_220", "DefineSprite_409", "DefineSprite_430", "DefineSprite_82",
    "DefineSprite_84", "DefineSprite_13", "DefineSprite_14", "DefineSprite_16"
]

html = ["<html><body style='background:#333;color:#fff;'>"]
for it in items:
    d = os.path.join("src/assets/sprites/assembled/sprites", it)
    if os.path.exists(d):
        pngs = sorted(glob.glob(os.path.join(d, "*.png")))
        html.append(f"<h3>{it} ({len(pngs)} frames)</h3><div style='display:flex;gap:5px;'>")
        for p in pngs:
            html.append(f"<div style='border:1px solid #777;padding:4px;'><img src='../../{p.replace(chr(92), '/')}'><br><small>{os.path.basename(p)}</small></div>")
        html.append("</div>")

html.append("</body></html>")
with open("build/items_catalog.html", "w", encoding="utf-8") as f:
    f.write("\n".join(html))
print("Wrote build/items_catalog.html")
