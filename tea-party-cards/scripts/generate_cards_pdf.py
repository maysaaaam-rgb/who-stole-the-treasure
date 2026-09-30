"""
Alice in Wonderland: Mad Tea Party Double-Sided Trading Cards
Class 4-A High-Resolution Batch Generator (300 DPI Print Engine)

Generates:
1. 36 Individual 300 DPI Card PNGs for Class 4-A (Front & Back for all 18 characters)
2. Class_4A_Cards_Individual_Cards.pdf (36 Pages)
3. Class_4A_Tea_Party_Cards_Duplex_Sheets.pdf (4 Pages: 2 Front + 2 Back Duplex Sheets, exactly 18 cards)
"""

import os, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"c:\Users\maysa\Desktop\DV\tea-party-cards"
ASSETS_DIR = os.path.join(BASE_DIR, "assets", "characters")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
PNG_DIR = os.path.join(OUTPUT_DIR, "class_4a_png")

os.makedirs(PNG_DIR, exist_ok=True)

# 300 DPI Dimensions for 2.5" x 3.5" Poker Card
CARD_W = 750
CARD_H = 1050

def get_font(name, size):
    try:
        return ImageFont.truetype(name, size)
    except:
        return ImageFont.load_default()

FONT_TITLE = get_font("georgia.ttf", 34)
FONT_NAME = get_font("georgia.ttf", 36)
FONT_ACTOR = get_font("arial.ttf", 22)
FONT_ROLE = get_font("georgia.ttf", 20)
FONT_STAT_LBL = get_font("arial.ttf", 15)
FONT_STAT_VAL = get_font("georgia.ttf", 24)
FONT_BODY = get_font("georgia.ttf", 19)
FONT_BODY_BOLD = get_font("georgia.ttf", 19)
FONT_BODY_SM = get_font("georgia.ttf", 16)
FONT_HEADER_SM = get_font("arial.ttf", 16)

# Class 4-A Roster
CHARACTERS = [
    {
        "id": "alice", "num": 1, "name": "ALICE", "actor": "İpek",
        "role": "The Unconquerable Dreamer & Champion", "act": "Act I & IV: Garden & Royal Climax",
        "tp": 90, "mad": 94, "courage": 99,
        "ability": "Muchness Surge: Reclaims true self, stands tall, and wields the Vorpal blade.",
        "vocal": "Clear, earnest, curious, shifting to resolute confidence.",
        "quote": "It’s no use going back to yesterday, because I was a different person then.",
        "action": "Stands up abruptly in defiance: 'It is my life! Why must everyone decide what I ought to be?'",
        "speech": "Alice politely challenges stopped clocks, refuses to conform to expectations, and asserts her own identity.",
        "cue": "When Hamish says 'A habit we shall promptly cure', declare: 'It is my life!'",
        "costume": ["Cornflower blue tea dress with lace pinafore", "Blue satin hair bow & white stockings"],
        "props": ["Antique brass skeleton key", "Porcelain floral teacup & saucer"]
    },
    {
        "id": "white-queen", "num": 2, "name": "WHITE QUEEN 1", "actor": "İclal",
        "role": "Ethereal Sovereign of Marmoreal (Part 1)", "act": "Act II & III: The Alchemical Garden",
        "tp": 94, "mad": 85, "courage": 88,
        "ability": "Alchemical Elixir: Prepares restoring cordials to protect Alice and heal Underland.",
        "vocal": "Melodic, whisper-soft, floating with serene grace and unyielding will.",
        "quote": "It is a poor sort of memory that only works backwards.",
        "action": "Glides serenely forward, holding a crystalline potion vial aloft to catch the light.",
        "speech": "Welcomes Alice with gentle majesty, offers eccentric recipe advice, and speaks of prophecy and peace.",
        "cue": "When Alice wonders if impossible things exist, offer vial: 'It is a poor sort of memory.'",
        "costume": ["Pearl & diamond crown tiara", "Standing lace Medici collar & ivory brocade gown"],
        "props": ["Crystalline potion vial with silver dropper", "Silver chalice"]
    },
    {
        "id": "white-queen", "num": 3, "name": "WHITE QUEEN 2", "actor": "Şimal",
        "role": "Rightful Sovereign & Champion's Guide (Part 2)", "act": "Act IV: The Royal Confrontation",
        "tp": 93, "mad": 82, "courage": 94,
        "ability": "Harmonic Prophecy: Unveils the sacred Oraculum scroll, inspiring the champion.",
        "vocal": "Resolute, regal, inspiring, speaking with ethereal calmness.",
        "quote": "Your reign of fear ends at this table, sister. The champion has found her muchness.",
        "action": "Glides gracefully downstage, raising hands to cast a calming aura.",
        "speech": "Rallies Underland for the Frabjous Day, stands beside Alice, and dispels draconic terror.",
        "cue": "When Dragon ignites flame blade, step forward: 'Your reign of fear ends at this table.'",
        "costume": ["Crown tiara & white lace Elizabethan collar", "Silver brocade gown with chess filigree"],
        "props": ["Carved alabaster chess queen", "Oraculum prophecy scroll"]
    },
    {
        "id": "white-rabbit", "num": 4, "name": "WHITE RABBIT", "actor": "Bahriye",
        "role": "Frantic Royal Herald & Timekeeper", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 82, "mad": 76, "courage": 70,
        "ability": "Ticking Sprint: Dodges danger at double speed while delivering royal scrolls.",
        "vocal": "High-pitched, breathless, twitchy, speaking in frantic bursts.",
        "quote": "I’m late! For a very important date! The Queen will have my head!",
        "action": "Sprints across apron checking watch: 'No time, no time! Queen's tea is cold!'",
        "speech": "Paces around table checking watch, reads jumbled royal proclamation, and warns Alice.",
        "cue": "When Alice questions conformity, sprint across: 'No time! The Queen's tea is cold!'",
        "costume": ["Plush rabbit ears headband & lace jabot", "Damask brocade vest & velvet coat"],
        "props": ["Giant gold pocket watch on chain", "Royal proclamation scroll with wax seal"]
    },
    {
        "id": "cheshire-cat", "num": 5, "name": "CAT (THE GRIN)", "actor": "Ayla",
        "role": "Enigmatic Riddle-Weaver of the Woods", "act": "Act III: Wonderland Encounters",
        "tp": 88, "mad": 99, "courage": 87,
        "ability": "Grin Dispersal: Fades into transparent air, leaving only a mischievous smile.",
        "vocal": "Silky, purring, hypnotic, lingering with knowing smirk.",
        "quote": "We’re all mad here. If you don’t care where to get to, it doesn’t matter which way you walk.",
        "action": "Steps out holding painted grin mask: 'Every path leads somewhere, Hatter.'",
        "speech": "Appears from behind guests with teasing grin, taunts Alice with circular logic, and vanishes.",
        "cue": "When Hatter sighs for path to Marmoreal, lower mask: 'Every path leads somewhere.'",
        "costume": ["Plum velvet cat ears with pocket watches", "Striped velvet frock coat & clown collar"],
        "props": ["Handheld Cheshire grin mask on wand", "'To Wonderland' miniature signpost"]
    },
    {
        "id": "dinah", "num": 6, "name": "CAT (THE SHADOW)", "actor": "Emir Ali",
        "role": "Phantom Guide & Shadow Illusionist", "act": "Act III: Wonderland Encounters",
        "tp": 87, "mad": 98, "courage": 89,
        "ability": "Shadow Prowl: Slips through trees silently, reappearing with paradoxical truths.",
        "vocal": "Deep, purring, mocking, blending theatrical whisper with chuckle.",
        "quote": "I growl when pleased and wag when angry! Who says reality is real? Certainly not a cat!",
        "action": "Prowls silently from shadows, pointing paws in opposing directions.",
        "speech": "Prowls quietly behind tea table, vanishing behind trunks and offering perplexing directions.",
        "cue": "When Alice asks which way to go, step out: 'Walk long enough and you'll arrive somewhere!'",
        "costume": ["Olive velvet cat ears & curled brocade tail", "Green velvet tailcoat & paw mittens"],
        "props": ["Clockwork table clock", "Tiny potion vial labeled 'Drink Me'"]
    },
    {
        "id": "margaret", "num": 7, "name": "ALICE'S SISTER", "actor": "Belis",
        "role": "Dutiful Sister & High-Society Diplomat", "act": "Act I: The Victorian Garden Party",
        "tp": 79, "mad": 64, "courage": 75,
        "ability": "Sisterly Protocol: Whispers urgent warnings to shield Alice from scandal.",
        "vocal": "Soft, anxious, elder-sisterly, balancing propriety with affection.",
        "quote": "Alice, pay attention. What is the use of a book without pictures or conversations?",
        "action": "Glides in with antique book, sitting beside Alice with sisterly care.",
        "speech": "Urges Alice to stop daydreaming and fix stockings, confiding in whispers about sacrifices.",
        "cue": "When Mother turns to check tea service, whisper: 'Please, Alice, just smile today.'",
        "costume": ["Cornflower blue velvet dress with cameo brooch", "Gibson hair bun with pearl pins"],
        "props": ["Leather-bound illustrated poetry book", "Lace-edged embroidered handkerchief"]
    },
    {
        "id": "helen", "num": 8, "name": "ALICE'S MOTHER", "actor": "Ada",
        "role": "Imperious Matriarch of the Kingsleigh Estate", "act": "Act I: The Victorian Garden Party",
        "tp": 87, "mad": 69, "courage": 83,
        "ability": "Matriarch's Command: Commands spinal alignment with an icy stare and fan snap.",
        "vocal": "Regally composed, crisp, sharp Victorian etiquette.",
        "quote": "Posture, Alice. A young lady of good standing does not slouch. Smile, Alice.",
        "action": "Straightens Alice’s shoulders: 'A young lady of good standing does not slouch.'",
        "speech": "Instructs on holding teacups without trembling and demands obedience for Alice's societal future.",
        "cue": "As garden party bell chimes, straighten Alice: 'Posture, Alice. Ascot family is arriving.'",
        "costume": ["Wine-burgundy crushed velvet matriarch gown", "Cream lace collar & pearl jewelry"],
        "props": ["Antique painted folding fan with lace", "Gold open-face pocket watch on lapel"]
    },
    {
        "id": "bayard", "num": 9, "name": "BAYARD DOG", "actor": "Efe",
        "role": "Loyal Scent-Tracker & Underland Scout", "act": "Act IV: The Royal Confrontation",
        "tp": 84, "mad": 80, "courage": 96,
        "ability": "True Compass Scent: Detects card soldiers miles away to warn the innocent.",
        "vocal": "Deep, weary, gravelly, carrying sorrowful loyalty.",
        "quote": "Follow the scent... Red Queen holds my pups hostage, but my heart belongs to the true Queen.",
        "action": "Bounds in low, sniffing stage floor and raising brass compass high.",
        "speech": "Drops to knee to sniff stage, warns Stayne's cards are closing in, and urges Alice toward White Castle.",
        "cue": "When offstage drums beat, drop to knee: 'Beware! Scent of crimson steel! Run, Alice, run!'",
        "costume": ["Russet leather hood with drooping hound ears", "Weathered leather coat & paw gloves"],
        "props": ["Antique nautical brass compass", "Distressed parchment map of Underland"]
    },
    {
        "id": "mad-hatter", "num": 10, "name": "MAD HATTER", "actor": "Kemal",
        "role": "Mercurial Chronomancer & Tea Host", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 100, "mad": 100, "courage": 86,
        "ability": "Time Freeze Feud: Freezes clocks at 6:00 in an endless loop of tea and riddles.",
        "vocal": "Mercurial, rapid-fire, manic laughter to solemn gravity.",
        "quote": "Why is a raven like a writing desk? All the best people are bonkers.",
        "action": "Inspects pocket watch with butter knife, leaping up: 'No room! No room!'",
        "speech": "Demands tea before having any, inspects clocks with butter, and rallies the table for Frabjous Day.",
        "cue": "When Alice asks for directions, wave butter knife: 'No room! No room at all!'",
        "costume": ["Peacock-feathered blue damask top hat with '10/6' card", "Brocade waistcoat & velvet tailcoat"],
        "props": ["Silver teapot & butter knife", "Antique pocket watch & china cup"]
    },
    {
        "id": "red-queen", "num": 11, "name": "RED QUEEN", "actor": "Derin",
        "role": "Tyrannical Monarch of Underland", "act": "Act IV: The Royal Confrontation",
        "tp": 76, "mad": 91, "courage": 95,
        "ability": "Execution Mandate: Paralyzes opposition with terrifying tyrannical authority.",
        "vocal": "Shrill, explosive, haughty, unchallengeable decrees.",
        "quote": "Off with their heads! I’d far rather be feared than loved. Someone stole my tarts!",
        "action": "Sweeps downstage with heart scepter: 'Silence! Who dared host this tea party?!'",
        "speech": "Barges in inspecting table for treason, accuses guests of insolence, and orders executions.",
        "cue": "When Bayard warns 'Run, Alice!', roar: 'Silence! Who dared host an unauthorized tea party?!'",
        "costume": ["Heart-shaped coiffure with ruby tiara", "Burgundy ruff collar & crimson velvet gown"],
        "props": ["Ruby heart royal scepter", "Gilded Queen of Hearts card"]
    },
    {
        "id": "tweedledum", "num": 12, "name": "THE TWO SISTERS (1)", "actor": "Defne",
        "role": "Contrarian Scholar of Nonsense Fables (Tweedle)", "act": "Act III: Wonderland Encounters",
        "tp": 86, "mad": 95, "courage": 79,
        "ability": "Treacle Riddle: Weaves dizzying fables of sisters living in a treacle well.",
        "vocal": "Bouncy, rhythmic, argumentative, double-speed.",
        "quote": "Contrariwise! If it was so, it might be; but as it isn’t, it ain’t! That’s logic!",
        "action": "Marches mechanically in step with Sister Lacie, swinging giant wooden button.",
        "speech": "Argues over who greets guest first, challenges concept of reality, and recites treacle fables.",
        "cue": "When Alice crosses path, block way: 'Contrariwise! You are headed the wrong direction!'",
        "costume": ["Green bowler hat with hanging bell", "Striped Victorian suit & floppy bowtie"],
        "props": ["Oversized 6-inch carved button", "Stack of brass gears & treacle jar"]
    },
    {
        "id": "tweedledee", "num": 13, "name": "THE TWO SISTERS (2)", "actor": "Esila",
        "role": "Stubborn Herald of Contradiction & Tolls (Tweedle)", "act": "Act III: Wonderland Encounters",
        "tp": 86, "mad": 95, "courage": 79,
        "ability": "Nohow Toll: Demands ridiculous greeting ceremonies before anyone advances.",
        "vocal": "Mirroring Sister Elsie's cadence, interrupting with defiance.",
        "quote": "Nohow! And what’s more, you began it! The first thing in a visit is to say ‘How d’ye do?’",
        "action": "Elbows Sister Elsie out of way, ringing brass handbell with sharp comedic timing.",
        "speech": "Contradicts everything Elsie states, accuses her of ruining poetry, and demands Alice pick the smarter twin.",
        "cue": "When Elsie yells 'wrong direction!', chime bell: 'Nohow! You ought to pay toll!'",
        "costume": ["Matching green bowler hat with side bell", "Striped Edwardian jacket & rosette blush"],
        "props": ["Polished brass handheld bell", "Vintage umbrella with duck handle"]
    },
    {
        "id": "bandersnatch", "num": 14, "name": "BANDERSNATCH", "actor": "Rüzgar",
        "role": "Fierce Guardian of the Underland Keys", "act": "Act IV: The Royal Confrontation",
        "tp": 73, "mad": 77, "courage": 97,
        "ability": "Beast Compassion: Turns razor claws into shields for those who show kindness.",
        "vocal": "Low guttural growls shifting into rough protective warmth.",
        "quote": "Grrr... Give me back my eye! You bandaged my wound? No one has ever shown me kindness.",
        "action": "Snarls on all fours with claws, then freezes: 'The girl with gentle hands...'",
        "speech": "Circles table sniffing guests, bares claws at sudden moves, then kneels before Alice offering keys.",
        "cue": "When Red Queen orders 'Tear them!', lower claws: 'You healed my eye when she gave chains.'",
        "costume": ["Scale makeup & heavy fur-trimmed hooded robe", "Metallic gauntlet with razor claws"],
        "props": ["Heavy iron ring with Underland dungeon keys", "Faux leather muzzle with broken chains"]
    },
    {
        "id": "absolem", "num": 15, "name": "ABSOLEM", "actor": "Elif",
        "role": "Omniscient Oracle of the Sacred Mushroom", "act": "Act II & III: The Mushroom Forest",
        "tp": 91, "mad": 96, "courage": 86,
        "ability": "Chrysalis Metamorphosis: Blows smoke rings of prophecy, asking 'Who... are... you?'",
        "vocal": "Deep, languid, hypnotic, stretching vowels like smoke rings.",
        "quote": "Who... are... you? The chrysalis always breaks. One side makes you grow taller, the other shorter!",
        "action": "Perched regally on mushroom cushion, drawing slowly on hookah pipe and blowing mist rings.",
        "speech": "Challenges Alice's identity, chides her for forgetting who she is, and offers guidance on transformation.",
        "cue": "When Alice sighs 'I hardly know who I am!', lean forward through smoke: 'Who... are... you?'",
        "costume": ["Iridescent royal blue & emerald velvet robe", "Multi-layered silk ascot & antennae headpiece"],
        "props": ["Antique carved hookah pipe / bubble wand", "Miniature illuminated mushroom & prophecy scroll"]
    },
    {
        "id": "march-hare", "num": 16, "name": "MARCH HARE", "actor": "Ahmet",
        "role": "Erratic Co-Host of the Mad Tea Table", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 97, "mad": 98, "courage": 81,
        "ability": "Clean Cup Protocol: Forces everyone to scramble one seat to the left mid-sentence.",
        "vocal": "Jittery, eccentric, sudden shouts and nervous chuckles.",
        "quote": "Clean cup! Move down! Take some wine! Oh, there isn’t any, but it was polite to offer!",
        "action": "Clatters teacups maniacally, tossing imaginary sugar cubes.",
        "speech": "Erratically offers empty cups, insists butter belongs in clocks, and forces seat swaps.",
        "cue": "When Hatter shouts 'No room!', slide empty cup at Alice: 'Take some wine!'",
        "costume": ["Top hat with upright plush hare ears", "Moss green velvet tailcoat & carrot vest"],
        "props": ["Antique copper & porcelain teapot", "Tea party menu with gear seals"]
    },
    {
        "id": "jabberwocky", "num": 17, "name": "DRAGON (JABBERWOCKY)", "actor": "Emir B.",
        "role": "The Red Queen's Draconic Destroyer", "act": "Act IV: The Royal Confrontation",
        "tp": 60, "mad": 79, "courage": 100,
        "ability": "Biting Jaws & Flame Blade: Ignites draconic fire; armor shrugs off mortal blows.",
        "vocal": "Deep, guttural, slow, cold draconic malice.",
        "quote": "My jaws that bite, my claws that catch... You cannot escape the Frabjous Day.",
        "action": "Strides center stage with flared wings and glowing broadsword.",
        "speech": "Mocks Alice's mortal fragility, roars warnings of fire and ruin, and declares the Red Queen's realm will not fall.",
        "cue": "When Red Queen shouts 'Champion!', ignite sword: 'My jaws that bite, my claws that catch!'",
        "costume": ["Horned draconic crown & shoulder wings", "Scale leather armor & iron breastplate"],
        "props": ["Full glowing flame broadsword", "Stolen royal crimson velvet crown"]
    },
    {
        "id": "hamish", "num": 18, "name": "HAMISH ASCOT", "actor": "Emir E.",
        "role": "Arrogant Aristocrat & Reluctant Suitor", "act": "Act I: The Victorian Garden Party",
        "tp": 71, "mad": 46, "courage": 51,
        "ability": "Social Condescension: Freezes imagination with high-society snobbery.",
        "vocal": "Nasal, entitled, patronizing, stiff aristocratic pride.",
        "quote": "Alice, you must govern that runaway imagination. My digestion cannot tolerate excitement.",
        "action": "Enters with silver-topped cane, inspecting watch: 'Still daydreaming under the shade.'",
        "speech": "Complains about garden drafts, lectures Alice on marrying into society, and demands precise tea.",
        "cue": "When Belis steps back, tap cane: 'Ah, Alice. A habit we shall promptly cure.'",
        "costume": ["Burgundy velvet morning tailcoat", "Tall burgundy silk top hat & patterned vest"],
        "props": ["Silver-topped mahogany cane", "Gold pocket watch on double-Albert chain"]
    }
]

def draw_filigree_frame(draw, w, h, gold_light, gold_dark, fill_bg):
    draw.rectangle([0, 0, w, h], fill=fill_bg)
    draw.rectangle([10, 10, w - 10, h - 10], outline=gold_dark, width=6)
    draw.rectangle([18, 18, w - 18, h - 18], outline=gold_light, width=2)
    draw.rectangle([26, 26, w - 26, h - 26], outline=gold_dark, width=2)
    for cx, cy in [(22, 22), (w - 22, 22), (22, h - 22), (w - 22, h - 22)]:
        draw.polygon([(cx, cy - 8), (cx + 8, cy), (cx, cy + 8), (cx - 8, cy)], fill=gold_light, outline=gold_dark)

def render_front_card(char):
    img = Image.new("RGB", (CARD_W, CARD_H), color=(22, 18, 14))
    draw = ImageDraw.Draw(img)

    gold_dark = (180, 83, 9)
    gold_light = (254, 240, 138)
    gold_med = (217, 119, 6)

    draw_filigree_frame(draw, CARD_W, CARD_H, gold_light, gold_dark, fill_bg=(24, 20, 16))

    # Top Banner Box
    banner_box = [32, 32, CARD_W - 32, 85]
    draw.rectangle(banner_box, fill=(45, 26, 12), outline=gold_med, width=2)
    banner_txt = "TEA PARTY TRADING CARD"
    bbox = draw.textbbox((0, 0), banner_txt, font=FONT_TITLE)
    bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((CARD_W - bw) / 2, 42), banner_txt, fill=gold_light, font=FONT_TITLE)

    # Portrait Viewport Box
    pv_box = (36, 95, CARD_W - 36, 680)
    draw.rectangle([pv_box[0] - 2, pv_box[1] - 2, pv_box[2] + 2, pv_box[3] + 2], outline=gold_med, width=3)

    art_path = os.path.join(ASSETS_DIR, f"{char['id']}.jpg")
    if os.path.exists(art_path):
        art = Image.open(art_path)
        target_w = pv_box[2] - pv_box[0]
        target_h = pv_box[3] - pv_box[1]
        art_w, art_h = art.size
        scale = max(target_w / art_w, target_h / art_h)
        new_w, new_h = int(art_w * scale), int(art_h * scale)
        art_resized = art.resize((new_w, new_h), Image.Resampling.LANCZOS)
        left = (new_w - target_w) // 2
        top = int((new_h - target_h) * 0.15)
        crop_box = (left, top, left + target_w, top + target_h)
        cropped_art = art_resized.crop(crop_box)
        img.paste(cropped_art, (pv_box[0], pv_box[1]))
    else:
        draw.rectangle(pv_box, fill=(10, 10, 10))

    # Plaque Box
    plaque_box = [36, 695, CARD_W - 36, 885]
    draw.rectangle(plaque_box, fill=(35, 24, 14), outline=gold_med, width=2)
    draw.rectangle([plaque_box[0] + 4, plaque_box[1] + 4, plaque_box[2] - 4, plaque_box[3] - 4], outline=gold_dark, width=1)

    name_txt = char["name"]
    nb = draw.textbbox((0, 0), name_txt, font=FONT_NAME)
    draw.text(((CARD_W - (nb[2] - nb[0])) / 2, 706), name_txt, fill=(255, 255, 255), font=FONT_NAME)

    actor_txt = f"ACTOR: {char['actor'].upper()}"
    ab = draw.textbbox((0, 0), actor_txt, font=FONT_ACTOR)
    draw.text(((CARD_W - (ab[2] - ab[0])) / 2, 756), actor_txt, fill=gold_light, font=FONT_ACTOR)

    role_txt = f"Role: {char['role'][:42]}"
    rb = draw.textbbox((0, 0), role_txt, font=FONT_ROLE)
    draw.text(((CARD_W - (rb[2] - rb[0])) / 2, 792), role_txt, fill=(203, 213, 225), font=FONT_ROLE)

    ab_txt = f"★ {char['ability'][:65]}..."
    abb = draw.textbbox((0, 0), ab_txt, font=FONT_BODY_SM)
    draw.text(((CARD_W - (abb[2] - abb[0])) / 2, 832), ab_txt, fill=gold_light, font=FONT_BODY_SM)

    # Stat Ribbon
    ribbon_box = [36, 895, CARD_W - 36, 1005]
    badge_w = (ribbon_box[2] - ribbon_box[0] - 16) // 3
    
    stats_config = [
        ("TEA POWER", char["tp"], (56, 189, 248)),
        ("MADNESS / WIT", char["mad"], (244, 63, 94)),
        ("COURAGE", char["courage"], (250, 204, 21))
    ]

    for idx, (label, val, col) in enumerate(stats_config):
        bx1 = ribbon_box[0] + idx * (badge_w + 8)
        bx2 = bx1 + badge_w
        by1, by2 = ribbon_box[1], ribbon_box[3]
        draw.rectangle([bx1, by1, bx2, by2], fill=(18, 14, 10), outline=gold_med, width=1)
        lb = draw.textbbox((0, 0), label, font=FONT_STAT_LBL)
        draw.text((bx1 + (badge_w - (lb[2] - lb[0])) / 2, by1 + 18), label, fill=(148, 163, 184), font=FONT_STAT_LBL)
        vb = draw.textbbox((0, 0), f"{val}/100", font=FONT_STAT_VAL)
        draw.text((bx1 + (badge_w - (vb[2] - vb[0])) / 2, by1 + 48), f"{val}/100", fill=col, font=FONT_STAT_VAL)

    return img

def render_back_card(char):
    img = Image.new("RGB", (CARD_W, CARD_H), color=(247, 241, 225))
    draw = ImageDraw.Draw(img)

    gold_dark = (120, 53, 15)
    gold_med = (180, 83, 9)
    gold_light = (217, 119, 6)

    draw_filigree_frame(draw, CARD_W, CARD_H, gold_light, gold_dark, fill_bg=(247, 241, 225))

    # Header
    header_box = [34, 34, CARD_W - 34, 115]
    draw.rectangle(header_box, fill=(254, 249, 235), outline=gold_dark, width=2)
    title_txt = f"{char['name']} — {char['actor'].upper()}"
    tb = draw.textbbox((0, 0), title_txt, font=FONT_NAME)
    draw.text(((CARD_W - (tb[2] - tb[0])) / 2, 42), title_txt, fill=gold_dark, font=FONT_NAME)
    act_txt = f"• {char['act']} •"
    ab = draw.textbbox((0, 0), act_txt, font=FONT_ROLE)
    draw.text(((CARD_W - (ab[2] - ab[0])) / 2, 85), act_txt, fill=gold_med, font=FONT_ROLE)

    # 1. Costume & Prop Checklist Box
    c_box = [34, 128, CARD_W - 34, 330]
    draw.rectangle(c_box, fill=(255, 255, 255), outline=gold_med, width=1)
    draw.rectangle([c_box[0], c_box[1], c_box[2], c_box[1] + 32], fill=(254, 243, 199))
    draw.text((c_box[0] + 14, c_box[1] + 6), "COSTUME & PROP CHECKLIST", fill=gold_dark, font=FONT_HEADER_SM)

    y_cur = c_box[1] + 40
    for item in char["costume"][:2]:
        draw.rectangle([c_box[0] + 14, y_cur + 2, c_box[0] + 28, y_cur + 16], outline=gold_dark, width=2)
        draw.text((c_box[0] + 36, y_cur), f"{item[:55]}", fill=(45, 30, 15), font=FONT_BODY_SM)
        y_cur += 26

    for prop in char["props"][:2]:
        draw.rectangle([c_box[0] + 14, y_cur + 2, c_box[0] + 28, y_cur + 16], outline=gold_dark, width=2)
        draw.text((c_box[0] + 36, y_cur), f"Prop: {prop[:55]}", fill=(120, 53, 15), font=FONT_BODY_SM)
        y_cur += 26

    # 2. Performance Speech Box
    s_box = [34, 345, CARD_W - 34, 765]
    draw.rectangle(s_box, fill=(255, 255, 255), outline=gold_dark, width=2)
    draw.rectangle([s_box[0], s_box[1], s_box[2], s_box[1] + 32], fill=(254, 243, 199))
    draw.text((s_box[0] + 14, s_box[1] + 6), "1-MINUTE PERFORMANCE SPEECH & ACTING PROMPT", fill=gold_dark, font=FONT_HEADER_SM)

    draw.text((s_box[0] + 14, s_box[1] + 42), f"Vocal Tone: {char['vocal'][:60]}", fill=(146, 64, 14), font=FONT_BODY_SM)
    draw.text((s_box[0] + 14, s_box[1] + 74), f"Stage Action: {char['action'][:65]}", fill=(154, 52, 18), font=FONT_BODY_BOLD)

    q_box = [s_box[0] + 12, s_box[1] + 115, s_box[2] - 12, s_box[1] + 205]
    draw.rectangle(q_box, fill=(254, 242, 242), outline=(248, 113, 113), width=1)
    draw.text((q_box[0] + 10, q_box[1] + 8), f"Key Spoken Line:", fill=(153, 27, 27), font=FONT_HEADER_SM)
    
    q_words = char['quote'].split()
    line1 = " ".join(q_words[:8])
    line2 = " ".join(q_words[8:16])
    line3 = " ".join(q_words[16:])
    draw.text((q_box[0] + 10, q_box[1] + 32), f'"{line1}', fill=(127, 29, 29), font=FONT_BODY)
    if line2: draw.text((q_box[0] + 10, q_box[1] + 54), f'{line2}', fill=(127, 29, 29), font=FONT_BODY)
    if line3: draw.text((q_box[0] + 10, q_box[1] + 76), f'{line3}"', fill=(127, 29, 29), font=FONT_BODY)

    draw.text((s_box[0] + 14, s_box[1] + 225), "Speech Beat:", fill=gold_dark, font=FONT_BODY_BOLD)
    words = char["speech"].split()
    b1 = " ".join(words[:11])
    b2 = " ".join(words[11:22])
    b3 = " ".join(words[22:33])
    draw.text((s_box[0] + 14, s_box[1] + 252), b1, fill=(50, 40, 30), font=FONT_BODY_SM)
    if b2: draw.text((s_box[0] + 14, s_box[1] + 276), b2, fill=(50, 40, 30), font=FONT_BODY_SM)
    if b3: draw.text((s_box[0] + 14, s_box[1] + 300), b3, fill=(50, 40, 30), font=FONT_BODY_SM)

    # 3. Key Interaction Cue Box
    k_box = [34, 780, CARD_W - 34, 1005]
    draw.rectangle(k_box, fill=(254, 243, 199), outline=gold_dark, width=2)
    draw.rectangle([k_box[0], k_box[1], k_box[2], k_box[1] + 32], fill=(245, 158, 11))
    draw.text((k_box[0] + 14, k_box[1] + 6), "KEY INTERACTION CUE (EXACT STAGE TRIGGER)", fill=(120, 53, 15), font=FONT_HEADER_SM)

    cue_words = char["cue"].split()
    c1 = " ".join(cue_words[:10])
    c2 = " ".join(cue_words[10:20])
    c3 = " ".join(cue_words[20:])
    draw.text((k_box[0] + 14, k_box[1] + 46), c1, fill=(69, 26, 3), font=FONT_BODY)
    if c2: draw.text((k_box[0] + 14, k_box[1] + 74), c2, fill=(127, 29, 29), font=FONT_BODY_BOLD)
    if c3: draw.text((k_box[0] + 14, k_box[1] + 102), c3, fill=(127, 29, 29), font=FONT_BODY_BOLD)

    return img

def main():
    print("=" * 60)
    print("CLASS 4-A: 300 DPI TRADING CARD GENERATOR (18 STUDENTS)")
    print("=" * 60)

    front_images = []
    back_images = []

    for char in CHARACTERS:
        num = char["num"]
        slug = f"4a_{num:02d}_{char['actor'].lower().replace(' ', '_')}"
        
        front_img = render_front_card(char)
        f_path = os.path.join(PNG_DIR, f"{slug}_front.png")
        front_img.save(f_path, dpi=(300, 300))
        front_images.append(front_img)

        back_img = render_back_card(char)
        b_path = os.path.join(PNG_DIR, f"{slug}_back.png")
        back_img.save(b_path, dpi=(300, 300))
        back_images.append(back_img)

        print(f"Generated card {num:02d}/18: {char['name']} ({char['actor']})")

    # 1. Export Individual Cards Multi-Page PDF (36 pages)
    single_pdf_path = os.path.join(OUTPUT_DIR, "Class_4A_Cards_Individual_Cards.pdf")
    pages = []
    for f, b in zip(front_images, back_images):
        pages.append(f)
        pages.append(b)
    pages[0].save(single_pdf_path, save_all=True, append_images=pages[1:], resolution=300)
    print(f"Saved: {single_pdf_path} (36 Pages)")

    # 2. Export 3x3 Duplex Sheets (Exactly 2 sheets of 9 cards = 18 cards!)
    A4_W, A4_H = 2480, 3508
    sheet_pdf_path = os.path.join(OUTPUT_DIR, "Class_4A_Tea_Party_Cards_Duplex_Sheets.pdf")
    duplex_pages = []

    batches = [
        (0, 9),
        (9, 18)
    ]

    margin_x = (A4_W - 3 * CARD_W) // 2
    margin_y = (A4_H - 3 * CARD_H) // 2
    mirrored_map = [2, 1, 0, 5, 4, 3, 8, 7, 6]

    for b_idx, (start, end) in enumerate(batches):
        batch_chars = CHARACTERS[start:end]
        
        # FRONT SHEET
        front_sheet = Image.new("RGB", (A4_W, A4_H), color=(255, 255, 255))
        f_draw = ImageDraw.Draw(front_sheet)
        header_text = f"CLASS 4-A: MAD TEA PARTY CARDS — SHEET {b_idx + 1} (FRONTS) • 3x3 GRID (300 DPI)"
        f_draw.text((margin_x, margin_y - 80), header_text, fill=(50, 50, 50), font=FONT_TITLE)

        for i in range(9):
            card_img = front_images[start + i]
            row = i // 3
            col = i % 3
            pos_x = margin_x + col * CARD_W
            pos_y = margin_y + row * CARD_H
            front_sheet.paste(card_img, (pos_x, pos_y))
            f_draw.rectangle([pos_x, pos_y, pos_x + CARD_W, pos_y + CARD_H], outline=(200, 200, 200), width=1)

        duplex_pages.append(front_sheet)

        # BACK SHEET (DUPLEX HORIZONTALLY MIRRORED)
        back_sheet = Image.new("RGB", (A4_W, A4_H), color=(255, 255, 255))
        b_draw = ImageDraw.Draw(back_sheet)
        back_header = f"CLASS 4-A: MAD TEA PARTY CARDS — SHEET {b_idx + 1} (BACKS — DUPLEX ALIGNED) • FLIP ON LONG EDGE"
        b_draw.text((margin_x, margin_y - 80), back_header, fill=(50, 50, 50), font=FONT_TITLE)

        for i in range(9):
            target_idx = mirrored_map[i]
            card_img = back_images[start + target_idx]
            row = i // 3
            col = i % 3
            pos_x = margin_x + col * CARD_W
            pos_y = margin_y + row * CARD_H
            back_sheet.paste(card_img, (pos_x, pos_y))
            b_draw.rectangle([pos_x, pos_y, pos_x + CARD_W, pos_y + CARD_H], outline=(200, 200, 200), width=1)

        duplex_pages.append(back_sheet)

    duplex_pages[0].save(sheet_pdf_path, save_all=True, append_images=duplex_pages[1:], resolution=300)
    print(f"Saved: {sheet_pdf_path} (4 Pages, Duplex Registered)")

    print("=" * 60)
    print("CLASS 4-A GENERATION COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    main()
