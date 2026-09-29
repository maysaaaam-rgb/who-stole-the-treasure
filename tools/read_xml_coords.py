import xml.etree.ElementTree as ET

tree = ET.parse("build/fleabag.xml")
root = tree.getroot()

tags = []
for elem in root.iter():
    if "PlaceObject" in elem.tag:
        name = elem.get("name")
        cid = elem.get("characterId")
        depth = elem.get("depth")
        # matrix
        matrix = elem.find(".//matrix") or elem.find(".//Matrix")
        tx = elem.get("translateX") or (matrix.get("translateX") if matrix is not None else "")
        ty = elem.get("translateY") or (matrix.get("translateY") if matrix is not None else "")
        if name or cid in ["181", "184", "187", "191", "193", "195", "197", "199", "216", "170", "288", "118", "257", "218", "368"]:
            tags.append((name, cid, depth, tx, ty))

for t in tags[:25]:
    print(f"Name={str(t[0]):<10} CID={str(t[1]):<6} Depth={str(t[2]):<4} tx={str(t[3]):<8} ty={str(t[4]):<8}")
