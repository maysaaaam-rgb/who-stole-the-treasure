import re, glob

for sid in [1, 5, 10, 11, 12, 19, 54, 68, 73, 87, 91, 93, 106, 107, 108, 110, 115, 119, 120, 124, 127, 128, 169, 189, 190, 191, 200, 201, 241, 250, 251, 256, 258, 259, 282, 283, 284, 285, 291, 311, 326, 327, 365, 366, 369, 376, 406, 407, 408, 415, 416, 417, 423, 426, 427, 428, 429]:
    p = f"src/assets/sprites/shapes/{sid}.svg"
    try:
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            c = f.read()
            vb = re.search(r'viewBox="([^"]+)"', c)
            vb_str = vb.group(1) if vb else ""
            # find colors or hints
            colors = set(re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}', c))
            print(f"Shape {sid:3d}: viewBox={vb_str:<25} colors={len(colors)}")
    except Exception as e:
        pass
