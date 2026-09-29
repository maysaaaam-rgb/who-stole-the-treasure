from PIL import Image

for name in ["top_hud", "mutt_area", "cat_area", "center_top", "fence_center", "bottom_ui"]:
    im = Image.open(f"build/debug/{name}.png")
    print(f"{name}: size={im.size}")
