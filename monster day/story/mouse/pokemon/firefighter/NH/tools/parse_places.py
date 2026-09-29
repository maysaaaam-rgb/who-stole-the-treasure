import re

with open("build/fleabag.xml", "r", encoding="utf-8") as f:
    content = f.read()

# Find all PlaceObject2Tag
pattern = re.compile(r'<item type="PlaceObject2Tag"([^>]+)>(.*?)</item>', re.DOTALL)
matches = pattern.findall(content)
print(f"Total PlaceObject2Tag matches: {len(matches)}")

for attrs, body in matches:
    # check characterId or name
    m_cid = re.search(r'characterId="(\d+)"', attrs)
    m_name = re.search(r'name="([^"]+)"', attrs)
    m_depth = re.search(r'depth="(\d+)"', attrs)
    m_tx = re.search(r'translateX="(-?\d+)"', body)
    m_ty = re.search(r'translateY="(-?\d+)"', body)
    
    cid = m_cid.group(1) if m_cid else None
    name = m_name.group(1) if m_name else None
    depth = m_depth.group(1) if m_depth else ""
    tx = int(m_tx.group(1)) / 20.0 if m_tx else 0
    ty = int(m_ty.group(1)) / 20.0 if m_ty else 0
    
    if name or cid in ["181", "184", "187", "191", "193", "195", "197", "199", "216", "170", "288", "118", "257", "218", "368", "171", "289"]:
        print(f"Name={str(name):<12} CID={str(cid):<6} Depth={depth:<4} X={tx:>6.1f} Y={ty:>6.1f}")
