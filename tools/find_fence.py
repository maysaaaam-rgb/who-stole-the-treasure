import glob, re, os

for f in glob.glob("src/assets/sprites/shapes/*.svg"):
    with open(f, "r", encoding="utf-8") as fl:
        c = fl.read()
        w = re.search(r'width="([\d\.]+)px"', c)
        h = re.search(r'height="([\d\.]+)px"', c)
        if w and h:
            wf, hf = float(w.group(1)), float(h.group(1))
            if (30 <= wf <= 150 and 70 <= hf <= 300) or (70 <= wf <= 300 and 30 <= hf <= 150):
                colors = set(re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}', c))
                print(f"{os.path.basename(f):<10} w={wf:<6} h={hf:<6} colors={list(colors)[:3]}")
