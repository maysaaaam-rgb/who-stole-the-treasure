import os, glob

files = sorted(glob.glob("src/assets/sprites/shapes/*.svg"), key=lambda x: int(os.path.splitext(os.path.basename(x))[0]))
print(f"Total SVG shapes: {len(files)}")

# Check file sizes to identify large background / character shapes vs small icon shapes
for f in files:
    sz = os.path.getsize(f)
    if sz > 10000:
        print(f"Large shape (>10KB): {os.path.basename(f)} ({sz} bytes)")
