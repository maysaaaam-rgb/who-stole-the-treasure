# Adds Quaternius nature pieces (q-*) to map.json: flowers, bushes, rocks and mushrooms along the paths
# and round the plaza, and extra trees out in the meadows. Keeps every game zone and ground area free.
# Run again any time: it first removes the old q-* pieces, then places them again (same seed = same result).
import json, math, os, random
here = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(here, "..", "map.json")
m = json.load(open(P))
m["pieces"] = [p for p in m["pieces"] if not p["p"].startswith("q-")]
random.seed(11)
zones = [z["rect"] for z in m["zones"].values()]
grounds = m["grounds"]
def in_rect(x, z, r, pad): return r[0] - pad <= x <= r[2] + pad and r[1] - pad <= z <= r[3] + pad
def on_ground(x, z, pad):
    for g in grounds:
        if g.get("round"):
            if math.hypot((x - g["x"]) / (g["w"] / 2 + pad), (z - g["z"]) / (g["d"] / 2 + pad)) < 1: return True
        elif abs(x - g["x"]) < g["w"] / 2 + pad and abs(z - g["z"]) < g["d"] / 2 + pad: return True
    return False
BIG = ("tree", "q-tree", "q-pine", "q-autumn", "school", "cottage", "castle", "windmill", "carousel", "fountain", "bleachers", "goal", "scoreboard", "bridge")
def free(x, z, r):
    if abs(x) > 118 or z < -118 or z > 105: return False
    if any(in_rect(x, z, zr, 2.5) for zr in zones): return False
    if on_ground(x, z, 1.2): return False
    for q in m["pieces"]:
        need = r + (2.6 if q["p"].startswith(BIG) else 1.1)
        if abs(q["x"] - x) < need and abs(q["z"] - z) < need and math.hypot(q["x"] - x, q["z"] - z) < need: return False
    return True
def put(p, x, z): m["pieces"].append({"p": p, "x": round(x, 2), "z": round(z, 2), "r": random.randint(0, 359)})

# 1) small plants in clusters along both sides of every path and round the plaza
small = ["q-flowers-red"] * 4 + ["q-flowers-yellow"] * 4 + ["q-bush-flowers"] * 2 + ["q-bush"] + ["q-plant"] * 2 + ["q-mushroom"] * 2 + ["q-rock-b"]
edges = [g for g in grounds if g["g"] == "path"]
placed = 0
for g in edges:
    horiz = g["w"] > g["d"]; length = max(g["w"], g["d"]); half = min(g["w"], g["d"]) / 2
    for k in range(int(length / 3.2)):
        t = -length / 2 + 1.6 + k * 3.2 + random.uniform(-.6, .6)
        for side in (-1, 1):
            if random.random() < .45: continue
            off = side * (half + random.uniform(1.6, 3.2))
            x, z = (g["x"] + t, g["z"] + off) if horiz else (g["x"] + off, g["z"] + t)
            if free(x, z, .15): put(random.choice(small), x, z); placed += 1
for k in range(56):   # flower ring round the plaza
    a = k / 40 * math.tau + random.uniform(-.04, .04); r = 16.6 + random.uniform(0, 2.2)
    x, z = math.cos(a) * r, math.sin(a) * r
    if free(x, z, .15): put(random.choice(["q-flowers-red", "q-flowers-yellow", "q-flowers-red", "q-bush-flowers"]), x, z); placed += 1

# 2) trees, rocks and mushrooms out in the meadows (a few autumn trees for colour)
trees = ["q-tree-a", "q-tree-b", "q-tree-c"] * 4 + ["q-pine"] * 3 + ["q-autumn"]
want = {"tree": 46, "rock": 18, "mush": 14}
tries = 0
while want["tree"] > 0 and tries < 30000:
    tries += 1; x, z = random.uniform(-115, 115), random.uniform(-115, 100)
    if math.hypot(x, z) < 24: continue
    p = random.choice(trees)
    if p == "q-autumn" and sum(1 for q in m["pieces"] if q["p"] == "q-autumn") >= 6: continue
    if free(x, z, 2.4): put(p, x, z); want["tree"] -= 1
while (want["rock"] > 0 or want["mush"] > 0) and tries < 60000:
    tries += 1; x, z = random.uniform(-110, 110), random.uniform(-110, 98)
    if not free(x, z, 1.0): continue
    if want["rock"] > 0: put(random.choice(["q-rock-a", "q-rock-b"]), x, z); want["rock"] -= 1
    else: put("q-mushroom", x, z); want["mush"] -= 1
json.dump(m, open(P, "w"), indent=0)
from collections import Counter
print("small near paths:", placed, Counter(p["p"] for p in m["pieces"] if p["p"].startswith("q-")))
