"""
Alice in Wonderland: Mad Tea Party Student Role Dossiers PDF Generator
Generates A4 printable PDFs where each page is an individual student acting dossier
with portrait, role details, stats, costumes, props, and performance script.
Supports Class 4-A (18 Students) and Class 4-B (19 Students).
"""

import os, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"c:\Users\maysa\Desktop\DV\tea-party-cards"
ASSETS_DIR = os.path.join(BASE_DIR, "assets", "characters")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# A4 dimensions at 150 DPI
PAGE_W = 1240
PAGE_H = 1754

def get_font(name, size):
    try:
        return ImageFont.truetype(name, size)
    except:
        return ImageFont.load_default()

F_HEADER = get_font("georgia.ttf", 36)
F_SUB = get_font("arial.ttf", 16)
F_NAME = get_font("georgia.ttf", 28)
F_ROLE = get_font("georgia.ttf", 20)
F_SEC = get_font("georgia.ttf", 20)
F_BODY = get_font("georgia.ttf", 17)
F_BODY_BOLD = get_font("georgia.ttf", 17)
F_SM = get_font("arial.ttf", 14)

from generate_cards_pdf import CHARACTERS_4A, CHARACTERS_4B

def render_dossier_page(char, class_title="CLASS 4-A"):
    img = Image.new("RGB", (PAGE_W, PAGE_H), color=(253, 250, 242))
    draw = ImageDraw.Draw(img)

    gold_dark = (120, 53, 15)
    gold_med = (180, 83, 9)
    gold_light = (217, 119, 6)
    slate_dark = (30, 41, 59)

    # Outer border
    draw.rectangle([20, 20, PAGE_W - 20, PAGE_H - 20], outline=gold_dark, width=3)
    draw.rectangle([28, 28, PAGE_W - 28, PAGE_H - 28], outline=gold_med, width=1)

    # 1. Header Banner
    draw.rectangle([35, 35, PAGE_W - 35, 125], fill=(254, 243, 199), outline=gold_med, width=2)
    draw.text((55, 48), f"{char['name']} — {class_title.upper()} ACTING DOSSIER", fill=gold_dark, font=F_HEADER)
    draw.text((55, 92), f"ALICE IN WONDERLAND: MAD TEA PARTY • {char['act'].upper()}", fill=gold_med, font=F_SUB)

    # Actor badge
    badge_x = PAGE_W - 295
    draw.rectangle([badge_x, 46, PAGE_W - 50, 115], fill=gold_dark, outline=gold_light, width=2)
    draw.text((badge_x + 15, 54), "STUDENT ACTOR", fill=(254, 240, 138), font=F_SM)
    draw.text((badge_x + 15, 74), char['actor'].upper()[:16], fill=(255, 255, 255), font=F_NAME)

    # 2. Portrait + Role + Stats
    p_box = (45, 145, 345, 525)
    draw.rectangle([p_box[0] - 2, p_box[1] - 2, p_box[2] + 2, p_box[3] + 2], outline=gold_med, width=3)
    
    img_ref = char.get("image", f"{char['id']}.jpg")
    img_filename = os.path.basename(img_ref)
    art_path = os.path.join(ASSETS_DIR, img_filename)
    if not os.path.exists(art_path):
        art_path = os.path.join(ASSETS_DIR, f"{char['id']}.jpg")
    if os.path.exists(art_path):
        art = Image.open(art_path)
        art_resized = art.resize((300, 380), Image.Resampling.LANCZOS)
        img.paste(art_resized, (p_box[0], p_box[1]))
    else:
        draw.rectangle(p_box, fill=(20, 20, 20))

    rx = 370
    draw.text((rx, 150), f"ROLE ARCHETYPE:", fill=gold_dark, font=F_SM)
    draw.text((rx, 172), char['role'], fill=slate_dark, font=F_ROLE)

    # Stat Pills
    stat_box_y = 220
    draw.rectangle([rx, stat_box_y, PAGE_W - 45, stat_box_y + 80], fill=(255, 255, 255), outline=gold_med, width=1)
    
    col_w = (PAGE_W - 45 - rx) // 3
    stats = [
        ("TEA POWER", f"{char['tp']}/100", (2, 132, 199)),
        ("MADNESS / WIT", f"{char['mad']}/100", (225, 29, 72)),
        ("COURAGE", f"{char['courage']}/100", (202, 138, 4))
    ]
    for s_idx, (lbl, val, col) in enumerate(stats):
        cx = rx + s_idx * col_w
        draw.text((cx + 20, stat_box_y + 14), lbl, fill=(100, 116, 139), font=F_SM)
        draw.text((cx + 20, stat_box_y + 36), val, fill=col, font=F_NAME)

    # Ability
    ab_y = 315
    draw.rectangle([rx, ab_y, PAGE_W - 45, ab_y + 90], fill=(254, 249, 235), outline=gold_dark, width=1)
    draw.text((rx + 15, ab_y + 10), "★ SPECIAL CHARACTER ABILITY", fill=gold_dark, font=F_SM)
    draw.text((rx + 15, ab_y + 34), char['ability'], fill=slate_dark, font=F_BODY)

    # Vocal Delivery
    vc_y = 420
    draw.rectangle([rx, vc_y, PAGE_W - 45, vc_y + 105], fill=(255, 255, 255), outline=gold_med, width=1)
    draw.text((rx + 15, vc_y + 10), "🎙️ VOCAL TONE & ACTING DELIVERY", fill=gold_dark, font=F_SM)
    draw.text((rx + 15, vc_y + 36), char['vocal'], fill=(154, 52, 18), font=F_BODY)

    # 3. Two Column Checklists
    y_col = 545
    box_w = (PAGE_W - 90 - 20) // 2

    # Costume Box
    c_box = (45, y_col, 45 + box_w, y_col + 230)
    draw.rectangle(c_box, fill=(255, 255, 255), outline=gold_med, width=1)
    draw.rectangle([c_box[0], c_box[1], c_box[2], c_box[1] + 36], fill=(254, 243, 199))
    draw.text((c_box[0] + 15, c_box[1] + 8), "👗 COSTUME & MAKEUP CHECKLIST", fill=gold_dark, font=F_SEC)

    cy = c_box[1] + 50
    for item in char['costume']:
        draw.rectangle([c_box[0] + 18, cy + 2, c_box[0] + 34, cy + 18], outline=gold_dark, width=2)
        draw.text((c_box[0] + 44, cy), item[:48], fill=slate_dark, font=F_BODY)
        cy += 32

    # Props Box
    p_box_c = (45 + box_w + 20, y_col, PAGE_W - 45, y_col + 230)
    draw.rectangle(p_box_c, fill=(255, 255, 255), outline=gold_med, width=1)
    draw.rectangle([p_box_c[0], p_box_c[1], p_box_c[2], p_box_c[1] + 36], fill=(254, 243, 199))
    draw.text((p_box_c[0] + 15, p_box_c[1] + 8), "🧰 PHYSICAL PROPS TO BRING", fill=gold_dark, font=F_SEC)

    py = p_box_c[1] + 50
    for prop in char['props']:
        draw.rectangle([p_box_c[0] + 18, py + 2, p_box_c[0] + 34, py + 18], outline=gold_dark, width=2)
        draw.text((p_box_c[0] + 44, py), prop[:48], fill=slate_dark, font=F_BODY)
        py += 32

    # 4. Performance Monologue & Script
    s_top = 790
    draw.rectangle([45, s_top, PAGE_W - 45, s_top + 450], fill=(255, 255, 255), outline=gold_dark, width=2)
    draw.rectangle([45, s_top, PAGE_W - 45, s_top + 38], fill=(254, 243, 199))
    draw.text((60, s_top + 8), "🎭 1-MINUTE PERFORMANCE MONOLOGUE & ACTING PROMPT", fill=gold_dark, font=F_SEC)

    draw.text((65, s_top + 55), "🎬 Stage Action Directions:", fill=(154, 52, 18), font=F_BODY_BOLD)
    draw.text((65, s_top + 85), char['action'], fill=slate_dark, font=F_BODY)

    q_y = s_top + 130
    draw.rectangle([65, q_y, PAGE_W - 65, q_y + 110], fill=(254, 242, 242), outline=(239, 68, 68), width=1)
    draw.text((80, q_y + 10), "⭐ Key Script Line to Memorize:", fill=(153, 27, 27), font=F_SM)
    draw.text((80, q_y + 38), f'"{char["quote"]}"', fill=(127, 29, 29), font=F_ROLE)

    draw.text((65, s_top + 265), "📖 Performance Context & Monologue Beat:", fill=gold_dark, font=F_BODY_BOLD)
    words = char["speech"].split()
    w1 = " ".join(words[:16])
    w2 = " ".join(words[16:32])
    w3 = " ".join(words[32:])
    draw.text((65, s_top + 295), w1, fill=slate_dark, font=F_BODY)
    if w2: draw.text((65, s_top + 325), w2, fill=slate_dark, font=F_BODY)
    if w3: draw.text((65, s_top + 355), w3, fill=slate_dark, font=F_BODY)

    # 5. Key Interaction Cue
    cue_top = 1260
    draw.rectangle([45, cue_top, PAGE_W - 45, cue_top + 220], fill=(254, 243, 199), outline=gold_dark, width=2)
    draw.rectangle([45, cue_top, PAGE_W - 45, cue_top + 38], fill=(245, 158, 11))
    draw.text((60, cue_top + 8), "⚡ KEY INTERACTION CUE — EXACT STAGE TRIGGER & RESPONSE", fill=(120, 53, 15), font=F_SEC)

    draw.text((65, cue_top + 55), "When your stage partner speaks this cue:", fill=gold_dark, font=F_SM)
    draw.text((65, cue_top + 80), char["cue"], fill=(153, 27, 27), font=F_ROLE)

    # 6. Rehearsal Notes & Sign-Off Footer
    notes_top = 1500
    draw.rectangle([45, notes_top, PAGE_W - 45, PAGE_H - 45], fill=(255, 255, 255), outline=gold_med, width=1)
    draw.text((60, notes_top + 10), "STUDENT REHEARSAL CHECKLIST & TEACHER SIGN-OFF", fill=gold_dark, font=F_SM)
    
    draw.rectangle([65, notes_top + 40, 85, notes_top + 60], outline=gold_dark, width=2)
    draw.text((95, notes_top + 42), "Costume Prepared", fill=slate_dark, font=F_SM)

    draw.rectangle([280, notes_top + 40, 300, notes_top + 60], outline=gold_dark, width=2)
    draw.text((310, notes_top + 42), "Props Packed", fill=slate_dark, font=F_SM)

    draw.rectangle([470, notes_top + 40, 490, notes_top + 60], outline=gold_dark, width=2)
    draw.text((500, notes_top + 42), "Lines Memorized", fill=slate_dark, font=F_SM)

    draw.rectangle([670, notes_top + 40, 690, notes_top + 60], outline=gold_dark, width=2)
    draw.text((700, notes_top + 42), "Cue Rehearsed", fill=slate_dark, font=F_SM)

    draw.text((PAGE_W - 320, notes_top + 42), "Director Sign-off: _______________", fill=gold_dark, font=F_SM)

    return img

def generate_dossiers_for_class(class_id, char_list, pdf_filename, class_title):
    print("=" * 65)
    print(f"GENERATING {class_title.upper()} STUDENT ROLE DOSSIERS PDF ({len(char_list)} STUDENTS)")
    print("=" * 65)

    pages = []
    for char in char_list:
        print(f"Rendering Dossier {char['num']:02d}/{len(char_list)}: {char['name']} ({char['actor']})")
        page_img = render_dossier_page(char, class_title)
        pages.append(page_img)

    out_pdf = os.path.join(OUTPUT_DIR, pdf_filename)
    pages[0].save(out_pdf, save_all=True, append_images=pages[1:], resolution=150)
    print(f"Saved: {out_pdf} ({len(pages)} Pages)")

def main():
    generate_dossiers_for_class("4a", CHARACTERS_4A, "Class_4A_Student_Role_Dossiers.pdf", "Class 4-A")
    generate_dossiers_for_class("4b", CHARACTERS_4B, "Class_4B_Student_Role_Dossiers.pdf", "Class 4-B")
    print("=" * 65)
    print("ALL DOSSIERS GENERATED SUCCESSFULLY!")
    print("=" * 65)

if __name__ == "__main__":
    main()
