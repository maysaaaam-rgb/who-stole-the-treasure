import os, glob

svgs = sorted(glob.glob("src/assets/sprites/shapes/*.svg"), key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))

html = [
    "<!DOCTYPE html><html><head><title>Sprite Catalog</title>",
    "<style>body{background:#222;color:#fff;font-family:sans-serif;display:flex;flex-wrap:wrap;gap:12px;padding:20px;}",
    ".card{background:#333;border:1px solid #555;padding:8px;border-radius:6px;text-align:center;width:140px;}",
    ".card img{max-width:120px;max-height:120px;display:block;margin:0 auto;background:#444;}",
    ".card div{font-size:12px;margin-top:6px;}</style></head><body>"
]

for s in svgs:
    name = os.path.basename(s)
    sid = os.path.splitext(name)[0]
    html.append(f'<div class="card"><img src="{s}"><div>Shape {sid}</div></div>')

html.append("</body></html>")

with open("build/shape_catalog.html", "w", encoding="utf-8") as f:
    f.write("\n".join(html))

print("Created build/shape_catalog.html with", len(svgs), "shapes.")
