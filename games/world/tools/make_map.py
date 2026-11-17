"""Builds games/world/map.json, the layout of Adventure Park.
Run:  python games/world/tools/make_map.py
You can also edit map.json by hand: every piece is {"p": id, "x": .., "z": .., "r": degrees}.
Zones are the game areas: nothing is placed inside them (the games put their own things there)."""
import json, math, random, os
random.seed(7)

ZONES = {
    # name: origin (where the game's 0,0 is), rect of the play area (x0, z0, x1, z1) in world metres
    "plaza":   {"x": 0,   "z": 0,   "rect": [-13, -13, 13, 13],   "title": "Adventure Plaza"},
    "cannon":  {"x": 40,  "z": 0,   "rect": [30, -12, 104, 12],   "title": "Cannon Meadow"},
    "race":    {"x": -15, "z": -55, "rect": [-28, -71, 42, -44],  "title": "Sprint Track"},
    "penalty": {"x": -75, "z": 0,   "rect": [-102, -17, -49, 17], "title": "Football Pitch"},
    "fair":    {"x": 0,   "z": 62,  "rect": [-16, 49, 16, 76],    "title": "Funfair"},
}
PATHS = [  # x, z, w, d
    [21, 0, 18, 4], [0, -28.5, 4, 31], [-31, 0, 36, 4], [0, 31, 4, 36], [-7.5, -44, 15, 4],
]
grounds = [
    {"g": "plaza", "x": 0, "z": 0, "w": 26, "d": 26, "round": True},
    {"g": "pitch", "x": -75, "z": 0, "w": 50, "d": 32},
    {"g": "track", "x": 6, "z": -55, "w": 66, "d": 9},
    {"g": "sand", "x": 0, "z": 62, "w": 30, "d": 24, "round": True},
    {"g": "water", "x": 70, "z": 40, "w": 26, "d": 18, "round": True},
] + [{"g": "path", "x": p[0], "z": p[1], "w": p[2], "d": p[3]} for p in PATHS]

pieces = []
def put(p, x, z, r=0, y=None):
    o = {"p": p, "x": round(x, 2), "z": round(z, 2), "r": round(r)}
    if y is not None: o["y"] = y
    pieces.append(o)

def in_rect(x, z, r, pad=0):
    return r[0] - pad <= x <= r[2] + pad and r[1] - pad <= z <= r[3] + pad
def blocked(x, z, pad=2.5):
    if any(in_rect(x, z, Z["rect"], pad) for Z in ZONES.values()): return True
    for p in PATHS:
        if abs(x - p[0]) < p[2] / 2 + pad and abs(z - p[1]) < p[3] / 2 + pad: return True
    for g in grounds:
        if g["g"] == "water" and abs(x - g["x"]) < g["w"] / 2 + 1 and abs(z - g["z"]) < g["d"] / 2 + 1: return True
    return False

# --- plaza: fountain, benches, lamps, flower beds, hedges, ice cream
put("fountain", 0, 0)
for a in range(0, 360, 90):
    rad = math.radians(a + 45)
    put("bench", math.cos(rad) * 8, math.sin(rad) * 8, -a - 45 + 90)
    put("flower-bed", math.cos(rad) * 10.5, math.sin(rad) * 10.5)
    put("lamp", math.cos(rad) * 11.8, math.sin(rad) * 11.8)
put("ice-cream-cart", 6, -9, 20)
put("signpost", 5, 4, 45)
put("gate-arch", 12.5, 0, 90)

# --- lamps along the paths
for p in PATHS:
    horiz = p[2] > p[3]
    n = int(max(p[2], p[3]) // 8)
    for i in range(n):
        t = (i + .5) / n - .5
        x = p[0] + (t * p[2] if horiz else 0) + (0 if horiz else p[2] / 2 + .8)
        z = p[1] + (t * p[3] if not horiz else 0) + (p[3] / 2 + .8 if horiz else 0)
        if not any(in_rect(x, z, Z["rect"], 1) for Z in ZONES.values()): put("lamp", x, z)

# --- fences around the game areas (gaps where paths come in)
def fence_rect(r, gaps):
    x0, z0, x1, z1 = r[0] - 1, r[1] - 1, r[2] + 1, r[3] + 1
    def run(ax, az, bx, bz, rot):
        L = math.hypot(bx - ax, bz - az); n = int(L // 4)
        for i in range(n):
            t = (i + .5) / n; x = ax + (bx - ax) * t; z = az + (bz - az) * t
            if any(math.hypot(x - g[0], z - g[1]) < 4 for g in gaps): continue
            put("fence", x, z, rot)
    run(x0, z0, x1, z0, 0); run(x0, z1, x1, z1, 0); run(x0, z0, x0, z1, 90); run(x1, z0, x1, z1, 90)
fence_rect(ZONES["cannon"]["rect"], [[29, 0]])
fence_rect(ZONES["penalty"]["rect"], [[-48, 0]])
fence_rect(ZONES["race"]["rect"], [[0, -43], [-7.5, -43]])

# --- hedges round the plaza (gaps on the 4 paths)
for a in range(0, 360, 15):
    if a % 90 in (0, 15, 345) or a % 90 == 75: continue
    rad = math.radians(a); put("hedge", math.cos(rad) * 15, math.sin(rad) * 15, -a + 90)

# --- football pitch: goal, bleachers, scoreboard
put("goal", -97, 0, 90)
for x in range(-92, -55, 9): put("bleachers", x, -21, 0); put("bleachers", x, 21, 180)
put("scoreboard", -75, -27, 0)

# --- funfair
put("carousel", 0, 64)
put("ice-cream-cart", -10, 56, -30)
put("picnic-table", 10, 55, 15); put("picnic-table", 11, 69, -10)
put("hot-air-balloon", -9, 70, 0, 9)

# --- landmarks round the edge
put("windmill", 64, -34, -20); put("windmill-blades", 64 + 3.1 * math.sin(math.radians(-20)), -34 + 3.1 * math.cos(math.radians(-20)), -20, 8.5)
put("school", -44, -26, 30)
for (x, z, r) in [(36, 34, -30), (-38, 40, 20), (-30, 28, 60), (48, 52, -10)]: put("cottage", x, z, r)
put("castle", -10, -132, 0)
put("bridge", 70, 40, 0)
for (x, z, y) in [(55, -60, 22), (-60, 50, 26), (100, 30, 30)]: put("hot-air-balloon", x, z, 0, y)

# --- nature: trees, bushes, rocks everywhere that is free
kinds = ["tree-round"] * 5 + ["tree-pine"] * 3 + ["tree-blossom"] * 2
tries = 0; placed = 0
while placed < 230 and tries < 20000:
    tries += 1
    x, z = random.uniform(-125, 125), random.uniform(-120, 110)
    if blocked(x, z): continue
    if any(math.hypot(x - q["x"], z - q["z"]) < 4.2 for q in pieces if q["p"].startswith("tree")): continue
    if any(math.hypot(x - q["x"], z - q["z"]) < 9 for q in pieces if q["p"] in ("school", "cottage", "windmill", "castle", "carousel")): continue
    put(random.choice(kinds), x, z, random.uniform(0, 360)); placed += 1
for _ in range(120):
    x, z = random.uniform(-100, 100), random.uniform(-100, 95)
    if blocked(x, z, 1.5): continue
    put(random.choice(["bush", "bush", "rock", "flower-bed"]), x, z, random.uniform(0, 360))

out = {"_about": "Adventure Park layout. Units are metres. Games open in their zone: the zone's x,z becomes the game's 0,0.",
       "size": 260, "zones": ZONES, "grounds": grounds, "pieces": pieces}
here = os.path.dirname(os.path.abspath(__file__))
json.dump(out, open(os.path.join(here, "..", "map.json"), "w"), indent=0)
print(len(pieces), "pieces")
