"""Turns Gemini's Game Maker output into files the engine uses. Safe to run any time: folders that do not exist yet are skipped.
   art:    unit4-work/art-gamemaker-halloween, art-gamemaker-powerups  -> game-maker/art/*.webp + art/manifest.json
   effects:unit4-work/art-gamemaker-effects                            -> game-maker/art/fx_*.webp + art/effects.json
   audio:  unit4-work/audio-gamemaker                                  -> game-maker/audio/*.mp3 + audio/manifest.json
   scenes: unit4-work/art-roster-scenes                                -> assets/scenes/*.webp (class board scenes)"""
import os, sys, json, shutil
sys.path.insert(0, '_tmp')
from process_cut import cut_rgba
from PIL import Image
import numpy as np
from scipy import ndimage as ndi

def cut_keep_aspect(src, width=512, thr=10):
    im = Image.open(src).convert('RGB'); a = np.array(im).astype(int)
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]); bgc = np.median(border, axis=0)
    cand = np.abs(a - bgc).max(axis=2) < thr; lab, n = ndi.label(cand)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge)); alpha = Image.fromarray(np.where(bg, 0, 255).astype('uint8'))
    out = im.convert('RGBA'); out.putalpha(alpha); bb = out.getbbox() or (0, 0, out.width, out.height); out = out.crop(bb)
    return out.resize((width, max(1, round(out.height * width / out.width))), Image.LANCZOS)

def do_art(folders, dst):
    os.makedirs(dst, exist_ok=True); names = []
    for fo in folders:
        if not os.path.isdir(fo): print('skip', fo); continue
        for f in sorted(os.listdir(fo)):
            if not f.lower().endswith('.png'): continue
            n = f[:-4]; src = os.path.join(fo, f)
            if n.startswith(('bg_', 'tile_', 'card_')):
                im = Image.open(src).convert('RGB'); w = 1280 if n.startswith('bg_') else (800 if n.startswith('card_') else 512); im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS); im.save(os.path.join(dst, n + '.webp'), quality=82)
            else:
                cut_rgba(src, 512, 10).save(os.path.join(dst, n + '.webp'), quality=88)
            names.append(n)
    if names:
        mp = os.path.join(dst, 'manifest.json'); old = json.load(open(mp)) if os.path.exists(mp) else []
        json.dump(sorted(set(old + names)), open(mp, 'w')); print(len(names), 'pictures ->', dst)

def do_fx(fo, dst):
    if not os.path.isdir(fo): print('skip', fo); return
    meta = json.load(open(os.path.join(fo, 'effects.json'))) if os.path.exists(os.path.join(fo, 'effects.json')) else {}
    out = {}
    for f in sorted(os.listdir(fo)):
        if not f.lower().endswith('.png'): continue
        n = f[:-4]; Image.open(os.path.join(fo, f)).convert('RGBA').save(os.path.join(dst, n + '.webp'), quality=88)
        d = dict(meta.get(f) or meta.get(n) or {}); d['file'] = n + '.webp'; out[n] = d
    if out: json.dump(out, open(os.path.join(dst, 'effects.json'), 'w'), indent=1); print(len(out), 'effects')

def do_audio(fo, dst):
    if not os.path.isdir(fo): print('skip', fo); return
    os.makedirs(dst, exist_ok=True); names = []
    for f in sorted(os.listdir(fo)):
        if f.lower().endswith('.mp3'): shutil.copy(os.path.join(fo, f), os.path.join(dst, f)); names.append(f[:-4])
    if names: json.dump(names, open(os.path.join(dst, 'manifest.json'), 'w')); print(len(names), 'sounds')

def do_scenes(fo, dst):
    if not os.path.isdir(fo): print('skip', fo); return
    os.makedirs(dst, exist_ok=True); n = 0
    for f in sorted(os.listdir(fo)):
        if not f.lower().endswith('.png'): continue
        b = f[:-4]; src = os.path.join(fo, f)
        if b.startswith('bg_'):
            im = Image.open(src).convert('RGB'); im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS); im.save(os.path.join(dst, b + '.webp'), quality=80)
        elif b.startswith('sign_'): cut_keep_aspect(src, 512).save(os.path.join(dst, b + '.webp'), quality=88)
        else: cut_keep_aspect(src, 512).save(os.path.join(dst, b + '.webp'), quality=88)
        n += 1
    print(n, 'scene pictures ->', dst)

if __name__ == '__main__':
    U = 'unit4-work/'
    do_art([U + 'art-gamemaker-halloween', U + 'art-gamemaker-powerups', U + 'art-gamemaker-classic'], 'game-maker/art')
    do_fx(U + 'art-gamemaker-effects', 'game-maker/art')
    do_audio(U + 'audio-gamemaker', 'game-maker/audio')
    do_scenes(U + 'art-roster-scenes', 'assets/scenes')
