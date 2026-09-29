import re, glob

for sid in [1, 5, 10, 11, 12, 19, 54, 68, 73, 87, 91, 93, 106, 107, 108, 110, 115, 119, 120, 124, 127, 128, 169, 190, 200, 250, 258, 282, 311, 326, 365, 406, 415, 426]:
    p = f"src/assets/sprites/shapes/{sid}.svg"
    try:
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            c = f.read()
            svg_tag = re.search(r'<svg[^>]+>', c)
            if svg_tag:
                tag = svg_tag.group(0)
                # clean up namespaces
                tag = re.sub(r'xmlns[^=]*="[^"]*"', '', tag)
                print(f"Shape {sid:3d}: {tag[:100]}")
    except Exception as e:
        pass
