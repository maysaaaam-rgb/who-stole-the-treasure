import os
import re

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Find all src and href references
srcs = re.findall(r'src=["\']([^"\']+)["\']', html)
hrefs = re.findall(r'href=["\']([^"\']+)["\']', html)

all_refs = srcs + [h for h in hrefs if not h.startswith('data:') and not h.startswith('#')]

print("=== CHECKING ASSETS IN INDEX.HTML ===")
missing = []
for ref in all_refs:
    # strip query params or hashes
    clean_ref = ref.split('?')[0].split('#')[0]
    if not os.path.exists(clean_ref):
        print(f"[MISSING] {clean_ref}")
        missing.append(clean_ref)
    else:
        size = os.path.getsize(clean_ref)
        print(f"[OK] {clean_ref} ({size} bytes)")

# Check data.js image references
with open('data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

data_imgs = re.findall(r'["\'](assets/images/[^"\']+)["\']', data_js)
print("\n=== CHECKING ASSETS IN DATA.JS ===")
for img in set(data_imgs):
    if not os.path.exists(img):
        print(f"[MISSING] {img}")
        missing.append(img)
    else:
        size = os.path.getsize(img)
        print(f"[OK] {img} ({size} bytes)")

if not missing:
    print("\nALL ASSET REFERENCES VERIFIED SUCCESSFULLY! ZERO MISSING FILES.")
else:
    print(f"\nFAILED: {len(missing)} missing files detected.")
    exit(1)
