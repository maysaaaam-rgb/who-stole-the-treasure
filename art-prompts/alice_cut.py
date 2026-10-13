"""Cut the Alice pictures made by Gemini out of their flat green / magenta background.
Reads   assets/alice/<folder>/<name>.png   (the originals stay untouched, Gemini may still be working)
Writes  assets/alice-cut/<folder>/<name>.webp   (transparent, trimmed, max 768 px on the long side)
Only pictures marked OK in assets/alice/PROGRESS.txt are used; the log says G (green) or M (magenta) for each.
Backdrops (no key colour) are just converted. Safe to run again: finished files are skipped unless the original is newer.
usage:  python art-prompts/alice_cut.py
"""
import os, re, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'assets', 'alice')
DST = os.path.join(ROOT, 'assets', 'alice-cut')
KEYS = {'G': (0, 255, 0), 'M': (255, 0, 255)}
FOLDERS = ['characters', 'avatars', 'props', 'wear', 'badges', 'backgrounds']
MAXSIDE = {'characters': 900, 'avatars': 640, 'props': 512, 'wear': 512, 'badges': 512, 'backgrounds': 1600}


def cut(path, key):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.float32)
    k = np.array(KEYS[key], dtype=np.float32)
    corners = np.concatenate([a[:14, :14].reshape(-1, 3), a[:14, -14:].reshape(-1, 3), a[-14:, :14].reshape(-1, 3), a[-14:, -14:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    dist = np.minimum(np.sqrt(((a - k) ** 2).sum(axis=2)), np.sqrt(((a - bg) ** 2).sum(axis=2)))
    alpha = np.clip((dist - 70.0) / (150.0 - 70.0), 0, 1)
    rgb = a.copy()
    if key == 'G':
        spill = np.maximum(rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]), 0)
        edge = (alpha < 0.98).astype(np.float32)
        rgb[..., 1] -= spill * 0.9 * edge
    else:
        spill = np.maximum(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0)
        edge = (alpha < 0.98).astype(np.float32)
        rgb[..., 0] -= spill * 0.8 * edge
        rgb[..., 2] -= spill * 0.8 * edge
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    al = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    out = Image.fromarray(rgb).convert('RGBA')
    out.putalpha(al)
    bbox = out.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    if not bbox:
        raise ValueError('nothing left after cut-out')
    pad = 6
    bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(out.width, bbox[2] + pad), min(out.height, bbox[3] + pad))
    return out.crop(bbox)


def main():
    log = os.path.join(SRC, 'PROGRESS.txt')
    ok = {}
    if os.path.exists(log):
        for line in open(log, encoding='utf-8', errors='replace'):
            m = re.match(r'\s*([\w\-]+\.png)\s*:?\s*OK\s*\[?([GM])?\]?', line)
            if m:
                ok[m.group(1)] = m.group(2) or 'G'
    done = skipped = failed = 0
    for folder in FOLDERS:
        d = os.path.join(SRC, folder)
        if not os.path.isdir(d):
            continue
        os.makedirs(os.path.join(DST, folder), exist_ok=True)
        for fn in sorted(os.listdir(d)):
            if not fn.lower().endswith('.png') or fn not in ok:
                continue
            src = os.path.join(d, fn)
            dst = os.path.join(DST, folder, fn[:-4] + '.webp')
            if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                skipped += 1
                continue
            try:
                if folder == 'backgrounds':
                    img = Image.open(src).convert('RGB')
                else:
                    img = cut(src, ok[fn])
                scale = min(1.0, MAXSIDE[folder] / max(img.size))
                if scale < 1:
                    img = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)
                img.save(dst, 'WEBP', quality=88, method=6)
                done += 1
            except Exception as e:
                failed += 1
                print('FAILED', folder, fn, e)
    print('cut %d, skipped %d, failed %d' % (done, skipped, failed))


if __name__ == '__main__':
    sys.exit(main())
