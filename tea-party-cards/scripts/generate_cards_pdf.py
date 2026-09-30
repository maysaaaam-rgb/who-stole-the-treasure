"""
Alice in Wonderland: Mad Tea Party Double-Sided Trading Cards
Python High-Resolution Batch Generator (300 DPI Print Engine)

Generates:
1. 38 Individual 300 DPI Card PNGs (Front & Back for all 19 characters)
2. Tea_Party_Cards_Individual_Cards.pdf (Single-card presentation & digital distribution)
3. Tea_Party_Trading_Cards_Duplex_Sheets.pdf (3x3 grid A4 duplex sheets with horizontal column mirroring for precise double-sided cardstock printing)
"""

import os, re, sys
from PIL import Image, ImageDraw, ImageFont
import fitz

BASE_DIR = r"c:\Users\maysa\Desktop\DV\tea-party-cards"
ASSETS_DIR = os.path.join(BASE_DIR, "assets", "characters")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
PNG_DIR = os.path.join(OUTPUT_DIR, "cards_png")

os.makedirs(PNG_DIR, exist_ok=True)

# 300 DPI Dimensions for 2.5" x 3.5" Poker Card
CARD_W = 750
CARD_H = 1050

# Fonts setup
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

# Load data from js/data.js
# Parse the JSON-like data or define directly
from PIL import ImageColor

# Character roster definitions
CHARACTERS = [
    {
        "id": "alice", "num": 1, "name": "ALICE", "actor": "Derin",
        "role": "The Unconquerable Dreamer & Champion", "act": "Act I & IV: Garden & Royal Climax",
        "tp": 88, "mad": 92, "courage": 98,
        "ability": "Muchness Surge: Reclaims true identity & wields the Vorpal determination.",
        "vocal": "Clear, earnest, curious, shifting to resolute confidence.",
        "quote": "It’s no use going back to yesterday, because I was a different person then.",
        "action": "Stands up abruptly in defiance: 'It is my life! Why must everyone decide what I ought to be?'",
        "speech": "Alice politely questions stopped clocks, refuses to be told she is not quite Alice, and asserts her own identity against nonsensical rules.",
        "cue": "When Lowell says 'Marriage is simply sensible business', declare: 'It is my life!'",
        "costume": ["Cornflower blue tea dress with lace pinafore", "Blue satin hair bow & white stockings"],
        "props": ["Antique brass skeleton key", "Porcelain teacup & saucer"]
    },
    {
        "id": "mad-hatter", "num": 2, "name": "MAD HATTER", "actor": "Ozan M.",
        "role": "Mercurial Chronomancer & Tea Host", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 99, "mad": 100, "courage": 85,
        "ability": "Time Freeze Feud: Freezes clocks at 6:00 in an endless loop of tea and riddles.",
        "vocal": "Mercurial, rapid-fire, manic laughter to solemn gravity.",
        "quote": "Why is a raven like a writing desk? All the best people are bonkers.",
        "action": "Inspects pocket watch with butter knife, leaping up: 'No room! No room!'",
        "speech": "Rants on feud with Time, demands tea before having any, inspects clocks with butter, and rallies the table for the Frabjous Day.",
        "cue": "When Alice asks for directions, wave butter knife: 'No room! No room at all!'",
        "costume": ["Peacock-feathered blue damask top hat with '10/6' card", "Brocade waistcoat & velvet tailcoat"],
        "props": ["Silver teapot & butter knife", "Antique pocket watch & china cup"]
    },
    {
        "id": "red-queen", "num": 3, "name": "RED QUEEN", "actor": "Öykü",
        "role": "Tyrannical Monarch of Underland", "act": "Act IV: The Royal Confrontation",
        "tp": 75, "mad": 90, "courage": 94,
        "ability": "Execution Mandate: Paralyzes opposition with terrifying tyrannical authority.",
        "vocal": "Shrill, explosive, haughty, unchallengeable decrees.",
        "quote": "Off with their heads! I’d far rather be feared than loved.",
        "action": "Sweeps downstage with heart scepter: 'Silence! Who dared host this tea party?!'",
        "speech": "Inspects table for treason, demands to know who painted white roses red, and orders executions for minor table manner infractions.",
        "cue": "When Bayard warns 'Run, Alice!', roar: 'Silence! Who dared host an unauthorized tea party?!'",
        "costume": ["Heart-shaped coiffure with ruby tiara", "Burgundy ruff collar & crimson velvet gown"],
        "props": ["Ruby heart royal scepter", "Gilded Queen of Hearts card"]
    },
    {
        "id": "white-queen", "num": 4, "name": "WHITE QUEEN", "actor": "İlay Eşkin",
        "role": "Ethereal Sovereign of Marmoreal", "act": "Act IV: The Royal Confrontation",
        "tp": 92, "mad": 82, "courage": 90,
        "ability": "Harmonic Potion: Restores peace and awakens the champion's true courage.",
        "vocal": "Ethereal, melodic, whisper-soft, serene grace.",
        "quote": "It is a poor sort of memory that only works backwards.",
        "action": "Glides serenely downstage beside Alice: 'Your reign of fear ends at this table.'",
        "speech": "Welcomes guests in dreamlike voice, offers alchemical recipe advice, and gently inspires Alice to confront the Jabberwocky.",
        "cue": "When Jabberwocky flares wings, step forward: 'Your reign of fear ends at this table, sister.'",
        "costume": ["Pearl & diamond crown tiara", "Ivory & silver brocade Medici lace gown"],
        "props": ["Carved alabaster chess queen", "Crystalline potion vial with dropper"]
    },
    {
        "id": "white-rabbit", "num": 5, "name": "WHITE RABBIT", "actor": "Mina",
        "role": "Frantic Royal Herald & Timekeeper", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 80, "mad": 75, "courage": 68,
        "ability": "Ticking Sprint: Dodges danger at double speed while reading proclamations.",
        "vocal": "High-pitched, breathless, twitchy, frantic bursts.",
        "quote": "I’m late! For a very important date! The Queen will have my head!",
        "action": "Sprints across apron checking watch: 'No time, no time! Queen's tea is cold!'",
        "speech": "Paces around table checking watch, reads jumbled royal proclamation, and warns Alice that the Red Knights are hunting her.",
        "cue": "When Alice questions her identity, sprint across: 'No time, no time! The Queen's tea is cold!'",
        "costume": ["Plush rabbit ears headband & lace jabot", "Damask waistcoat & velvet coat"],
        "props": ["Giant gold pocket watch & chain", "Parchment proclamation scroll"]
    },
    {
        "id": "march-hare", "num": 6, "name": "MARCH HARE", "actor": "Kerem",
        "role": "Erratic Co-Host of the Mad Tea Table", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 96, "mad": 98, "courage": 80,
        "ability": "Clean Cup Protocol: Forces everyone to scramble one seat to the left mid-sentence.",
        "vocal": "Jittery, eccentric, sudden shouts and nervous chuckles.",
        "quote": "Clean cup! Move down! Take some wine! Oh, there isn’t any, but it was polite to offer!",
        "action": "Clatters teacups maniacally, tossing imaginary sugar cubes.",
        "speech": "Erratically offers empty cups, insists butter belongs in clocks, and forces everyone to switch seats without explanation.",
        "cue": "When Hatter shouts 'No room!', slide empty cup at Alice: 'Take some wine!'",
        "costume": ["Top hat with upright plush hare ears", "Moss green velvet tailcoat & carrot vest"],
        "props": ["Antique copper & porcelain teapot", "Tea party menu with gear seals"]
    },
    {
        "id": "dormouse-nisa", "num": 7, "name": "DORMOUSE", "actor": "Nisa",
        "role": "Drowsy Teapot Guardian & Rapier Duelist", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 84, "mad": 86, "courage": 91,
        "ability": "Treacle Wake: Instantly awakens into fierce combat if 'cat' or tyranny is spoken.",
        "vocal": "Drowsy, muffled mumbles snapping into fierce bravery.",
        "quote": "Twinkle, twinkle, little bat... I wasn't sleeping, I heard every word!",
        "action": "Jolts awake from teapot with 'Zzz' handkerchief and brandished spoon.",
        "speech": "Wakes face-down, denies being asleep, tells fragmented fable of treacle well, threatens anyone mentioning cats, and nods back off.",
        "cue": "When Hare clatters cups over head, shoot upright: 'I wasn't asleep! Contemplating treacle!'",
        "costume": ["Patchwork mouse-ear nightcap", "Patched tweed frock coat & brown vest"],
        "props": ["Porcelain demitasse cup", "'Zzz' handkerchief & teaspoon rapier"]
    },
    {
        "id": "dormouse-yagmur", "num": 8, "name": "DORMOUSE", "actor": "Yağmur",
        "role": "Skeptical Tea Critic & Clockkeeper", "act": "Act II: Down the Rabbit Hole & Tea Table",
        "tp": 82, "mad": 88, "courage": 89,
        "ability": "Muchness Meter: Cuts through pretense and rings brass bells to wake allies.",
        "vocal": "Heavy-lidded grumbling with sharp territorial squeaks.",
        "quote": "You’ve got the wrong Alice, Hatter! She’s lost her muchness. Wake me when fighting starts.",
        "action": "Rattles brass alarm clock on table: 'She’s completely lost her muchness!'",
        "speech": "Complains about cold tea, defends spot in teapot, warns Alice she lacks courage for dragons, and clatters spoon in exhaustion.",
        "cue": "When Alice insists on identity, slam alarm clock: 'She's the wrong Alice, Hatter!'",
        "costume": ["Earth-toned mouse nightcap", "Frayed tweed coat & gold velvet vest"],
        "props": ["Twin-bell brass alarm clock", "Antique 'History of Dreams' book"]
    },
    {
        "id": "cheshire-cat", "num": 9, "name": "CHESHIRE CAT", "actor": "Elif Beren",
        "role": "Enigmatic Riddle-Weaver of the Woods", "act": "Act III: Wonderland Encounters",
        "tp": 87, "mad": 99, "courage": 88,
        "ability": "Grin Dispersal: Fades into thin air leaving an inescapable paradoxical grin.",
        "vocal": "Silky, purring, hypnotic, lingering with knowing smirk.",
        "quote": "We’re all mad here. If you don’t care where to get to, it doesn’t matter which way you walk.",
        "action": "Steps from behind screen holding painted grin mask: 'Every path leads somewhere.'",
        "speech": "Taunts Alice with circular directions, mocks Hatter's sanity, questions whether anything at the table is real, and vanishes.",
        "cue": "When Hatter sighs for path to Marmoreal, lower mask: 'Every path leads somewhere, Hatter.'",
        "costume": ["Plum velvet cat ears with pocket watches", "Striped velvet frock coat & clown collar"],
        "props": ["Handheld Cheshire grin mask on wand", "Miniature dragon & 'Drink Me' vial"]
    },
    {
        "id": "dinah", "num": 10, "name": "DINAH", "actor": "Nilda",
        "role": "Gentle Hearth Guardian & Waking Tether", "act": "Act III: Wonderland Encounters",
        "tp": 81, "mad": 74, "courage": 86,
        "ability": "Hearth Anchor: Reminds dreamers of warm hearths, piercing Underland illusions.",
        "vocal": "Purring, gentle, blending feline curiosity with primness.",
        "quote": "Do cats eat bats? Or do bats eat cats? Wonderland has no saucers of cream.",
        "action": "Steps forward with padded grace: 'Do you remember home, Alice? The gentle fire...'",
        "speech": "Observes table as outsider, playfully stalks teacups, reminds Alice of home, and wonders why forest creatures act uncivilized.",
        "cue": "When Tweedles bicker, slip between them: 'Do you remember home, Alice?'",
        "costume": ["Olive cat ears with mini clocks & curled tail", "Green velvet tailcoat & paw mittens"],
        "props": ["Clockwork rabbit house music box", "Fish-shaped table clock & saucer"]
    },
    {
        "id": "jabberwocky", "num": 11, "name": "JABBERWOCKY", "actor": "Ali",
        "role": "The Red Queen's Draconic Destroyer", "act": "Act IV: The Royal Confrontation",
        "tp": 60, "mad": 78, "courage": 99,
        "ability": "Biting Jaws & Flame Blade: Ignites draconic fire; armor shrugs off mortal blows.",
        "vocal": "Deep, guttural, slow, cold draconic malice.",
        "quote": "My jaws that bite, my claws that catch... You cannot escape the Frabjous Day.",
        "action": "Strides center stage with flared wings and glowing broadsword.",
        "speech": "Mocks Alice's mortal fragility, roars warnings of fire and ruin, and declares the Red Queen's domain will never fall.",
        "cue": "When Red Queen shouts 'Champion!', ignite sword: 'My jaws that bite, my claws that catch!'",
        "costume": ["Horned draconic crown & shoulder wings", "Scale leather armor & iron breastplate"],
        "props": ["Full glowing flame broadsword", "Stolen royal crimson velvet crown"]
    },
    {
        "id": "bandersnatch", "num": 12, "name": "BANDERSNATCH", "actor": "Lina",
        "role": "Fierce Guardian of the Underland Keys", "act": "Act IV: The Royal Confrontation",
        "tp": 72, "mad": 76, "courage": 96,
        "ability": "Beast Compassion: Turns razor claws into shields for those who show kindness.",
        "vocal": "Low guttural growls shifting into rough protective warmth.",
        "quote": "Grrr... Give me back my eye! You bandaged my wound? No one has ever shown me kindness.",
        "action": "Snarls on all fours with claws, then freezes: 'The girl with gentle hands...'",
        "speech": "Circles table sniffing guests, bares claws at sudden moves, then kneels before Alice offering dungeon keys for compassion.",
        "cue": "When Red Queen orders 'Tear them!', lower claws: 'You healed my eye when she gave chains.'",
        "costume": ["Scale makeup & heavy fur-trimmed hooded robe", "Metallic gauntlet with razor claws"],
        "props": ["Heavy iron ring with Underland dungeon keys", "Faux leather muzzle with broken chains"]
    },
    {
        "id": "tweedledum", "num": 13, "name": "TWEEDLEDUM", "actor": "Egehan",
        "role": "Contrarian Scholar of Nonsense Logic", "act": "Act III: Wonderland Encounters",
        "tp": 85, "mad": 94, "courage": 78,
        "ability": "Contrariwise Axiom: Inverts any statement into an endless logical loop.",
        "vocal": "Bouncy, rhythmic, argumentative, double-speed.",
        "quote": "Contrariwise! If it was so, it might be; but as it isn’t, it ain’t! That’s logic!",
        "action": "Marches mechanically shoulder-to-shoulder, swinging giant wooden button.",
        "speech": "Argues over who greets guest first, challenges Alice's concept of reality, recites half a nonsense poem, and demands criss-cross handshakes.",
        "cue": "When Alice enters woods, block path: 'Contrariwise! You are headed the wrong direction!'",
        "costume": ["Green bowler hat with hanging bell", "Striped Victorian suit & floppy bowtie"],
        "props": ["Oversized 6-inch carved button", "Stack of brass clockwork gears"]
    },
    {
        "id": "tweedledee", "num": 14, "name": "TWEEDLEDEE", "actor": "Uras",
        "role": "Stubborn Herald of Contradiction", "act": "Act III: Wonderland Encounters",
        "tp": 85, "mad": 94, "courage": 78,
        "ability": "Nohow Toll: Blocks forward progress until etiquette tolls are paid in full.",
        "vocal": "Mirroring Dum's cadence, interrupting with defiance.",
        "quote": "Nohow! And what’s more, you began it! The first thing in a visit is to say ‘How d’ye do?’",
        "action": "Elbows Tweedledum out of way, ringing brass handbell vigorously.",
        "speech": "Contradicts everything Dum states, accuses twin of ruining poetry, challenges Hatter to umbrella duel, and demands Alice pick the smarter twin.",
        "cue": "When Dum yells 'wrong direction!', chime bell: 'Nohow! You ought to pay toll!'",
        "costume": ["Matching green bowler hat with side bell", "Striped Edwardian suit & rosette blush"],
        "props": ["Polished brass handheld bell", "Vintage umbrella with duck handle"]
    },
    {
        "id": "hamish", "num": 15, "name": "HAMISH ASCOT", "actor": "Utku",
        "role": "Arrogant Aristocrat & Reluctant Suitor", "act": "Act I: The Victorian Garden Party",
        "tp": 70, "mad": 45, "courage": 50,
        "ability": "Social Condescension: Freezes imagination with high-society snobbery.",
        "vocal": "Nasal, entitled, patronizing, stiff aristocratic pride.",
        "quote": "Alice, you must govern that runaway imagination. My digestion cannot tolerate excitement.",
        "action": "Enters with silver-topped cane, inspecting watch: 'Still daydreaming under the shade.'",
        "speech": "Complains about garden drafts, lectures Alice on marrying into society, demands precise tea, and scoffs at artists and eccentrics.",
        "cue": "When Margaret steps back, tap cane: 'Ah, Alice. A habit we shall promptly cure.'",
        "costume": ["Burgundy velvet morning tailcoat", "Tall burgundy silk top hat & patterned vest"],
        "props": ["Silver-topped mahogany cane", "Gold pocket watch on double-Albert chain"]
    },
    {
        "id": "bayard", "num": 16, "name": "BAYARD", "actor": "Ozan",
        "role": "Loyal Scent-Tracker & Underland Scout", "act": "Act IV: The Royal Confrontation",
        "tp": 83, "mad": 80, "courage": 95,
        "ability": "True Compass Scent: Detects card soldiers miles away, guiding the innocent.",
        "vocal": "Deep, weary, gravelly, sorrowful loyalty.",
        "quote": "Follow the scent... Red Queen holds my pups hostage, but my heart belongs to the true Queen.",
        "action": "Bounds in low, sniffing stage floor and raising brass compass high.",
        "speech": "Drops to knee to sniff stage, warns Stayne's cards are closing in, explains price of protecting family, and urges Alice toward White Castle.",
        "cue": "When offstage drums beat, drop to knee: 'Beware! Scent of crimson steel! Run, Alice, run!'",
        "costume": ["Russet leather hood with drooping hound ears", "Weathered leather coat & paw gloves"],
        "props": ["Antique nautical brass compass", "Distressed parchment map of Underland"]
    },
    {
        "id": "margaret", "num": 17, "name": "MARGARET", "actor": "Elif Asya",
        "role": "Dutiful Sister & High-Society Diplomat", "act": "Act I: The Victorian Garden Party",
        "tp": 78, "mad": 62, "courage": 74,
        "ability": "Sisterly Protocol: Shields sister from public embarrassment with gentle poise.",
        "vocal": "Soft, anxious, elder-sisterly Victorian decorum.",
        "quote": "Alice, pay attention. What is the use of a book without pictures or conversations?",
        "action": "Glides in with antique book, sitting beside Alice with sisterly care.",
        "speech": "Urges Alice to stop daydreaming and fix stockings, confides in whispers about societal sacrifices, and pleads not to embarrass family.",
        "cue": "When Helen turns to check catering, whisper: 'Please, Alice, just smile today.'",
        "costume": ["Cornflower blue velvet dress with cameo brooch", "Gibson hair bun with pearl pins"],
        "props": ["Leather-bound illustrated poetry book", "Lace-edged embroidered handkerchief"]
    },
    {
        "id": "helen", "num": 18, "name": "HELEN", "actor": "Elisa",
        "role": "Imperious Matriarch of the Kingsleigh Estate", "act": "Act I: The Victorian Garden Party",
        "tp": 86, "mad": 68, "courage": 82,
        "ability": "Matriarch's Command: Commands spinal alignment with an icy stare and fan snap.",
        "vocal": "Regally composed, crisp, sharp Victorian etiquette.",
        "quote": "A proper lady does not run into rabbit warrens! Smile, Alice. The world is watching.",
        "action": "Straightens Alice’s shoulders: 'A young lady of good standing does not slouch.'",
        "speech": "Instructs on holding teacups without trembling, defends honor against gossip, and demands obedience for Alice's societal future.",
        "cue": "As curtain opens on terrace, straighten Alice: 'Posture, Alice. Ascot family is arriving.'",
        "costume": ["Wine-burgundy crushed velvet matriarch gown", "Cream lace collar & pearl jewelry"],
        "props": ["Antique painted folding fan with lace", "Gold open-face pocket watch on lapel"]
    },
    {
        "id": "lowell", "num": 19, "name": "LOWELL", "actor": "Ertuğrul",
        "role": "Cynical Man of Commerce & Society", "act": "Act I: The Victorian Garden Party",
        "tp": 76, "mad": 70, "courage": 65,
        "ability": "Cynical Ledger: Reduces dreams and adventures to financial transactions.",
        "vocal": "Smooth, arrogant, cynical, bored dismissive charm.",
        "quote": "In the real world, men make rules and women mind manners. Marriage is a business transaction.",
        "action": "Leans against column twirling lion-headed cane with cynical smirk.",
        "speech": "Checks pocket watch in disgust, laughs off rabbit holes as hysteria, brags of investments, and warns nonconformity brings ruin.",
        "cue": "When Hamish gestures pompously, smirk: 'Do not fight the current. Marriage is business.'",
        "costume": ["Emerald green velvet tailcoat & top hat", "Gold gear-patterned waistcoat & mesh glove"],
        "props": ["Ornate brass lion-headed walking cane", "Large gold chain watch & ledger"]
    }
]

def draw_filigree_frame(draw, w, h, gold_light, gold_dark, fill_bg):
    # Base fill
    draw.rectangle([0, 0, w, h], fill=fill_bg)
    
    # Outer gold border
    draw.rectangle([10, 10, w - 10, h - 10], outline=gold_dark, width=6)
    draw.rectangle([18, 18, w - 18, h - 18], outline=gold_light, width=2)
    
    # Inner border
    draw.rectangle([26, 26, w - 26, h - 26], outline=gold_dark, width=2)
    
    # Corner diamonds / flourishes
    for cx, cy in [(22, 22), (w - 22, 22), (22, h - 22), (w - 22, h - 22)]:
        draw.polygon([(cx, cy - 8), (cx + 8, cy), (cx, cy + 8), (cx - 8, cy)], fill=gold_light, outline=gold_dark)

def render_front_card(char):
    img = Image.new("RGB", (CARD_W, CARD_H), color=(22, 18, 14))
    draw = ImageDraw.Draw(img)

    gold_dark = (180, 83, 9)
    gold_light = (254, 240, 138)
    gold_med = (217, 119, 6)

    # Filigree border frame
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

    # Load character image
    art_path = os.path.join(ASSETS_DIR, f"{char['id']}.jpg")
    if os.path.exists(art_path):
        art = Image.open(art_path)
        # Center crop & fit
        target_w = pv_box[2] - pv_box[0]
        target_h = pv_box[3] - pv_box[1]
        
        art_w, art_h = art.size
        scale = max(target_w / art_w, target_h / art_h)
        new_w, new_h = int(art_w * scale), int(art_h * scale)
        art_resized = art.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center horizontally, bias top-20% vertically
        left = (new_w - target_w) // 2
        top = int((new_h - target_h) * 0.15)
        crop_box = (left, top, left + target_w, top + target_h)
        cropped_art = art_resized.crop(crop_box)
        img.paste(cropped_art, (pv_box[0], pv_box[1]))
    else:
        draw.rectangle(pv_box, fill=(10, 10, 10))

    # Identity Plaque (Bottom)
    plaque_box = [36, 695, CARD_W - 36, 885]
    draw.rectangle(plaque_box, fill=(35, 24, 14), outline=gold_med, width=2)
    draw.rectangle([plaque_box[0] + 4, plaque_box[1] + 4, plaque_box[2] - 4, plaque_box[3] - 4], outline=gold_dark, width=1)

    # Character Name
    name_txt = char["name"]
    nb = draw.textbbox((0, 0), name_txt, font=FONT_NAME)
    draw.text(((CARD_W - (nb[2] - nb[0])) / 2, 706), name_txt, fill=(255, 255, 255), font=FONT_NAME)

    # Actor Subtext
    actor_txt = f"ACTOR: {char['actor'].upper()}"
    ab = draw.textbbox((0, 0), actor_txt, font=FONT_ACTOR)
    draw.text(((CARD_W - (ab[2] - ab[0])) / 2, 756), actor_txt, fill=gold_light, font=FONT_ACTOR)

    # Role Archetype
    role_txt = f"Role: {char['role']}"
    rb = draw.textbbox((0, 0), role_txt, font=FONT_ROLE)
    draw.text(((CARD_W - (rb[2] - rb[0])) / 2, 792), role_txt, fill=(203, 213, 225), font=FONT_ROLE)

    # Special ability line
    ab_txt = f"★ {char['ability'][:65]}..."
    abb = draw.textbbox((0, 0), ab_txt, font=FONT_BODY_SM)
    draw.text(((CARD_W - (abb[2] - abb[0])) / 2, 832), ab_txt, fill=gold_light, font=FONT_BODY_SM)

    # Stat Ribbon (Footer)
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
        
        # Label
        lb = draw.textbbox((0, 0), label, font=FONT_STAT_LBL)
        draw.text((bx1 + (badge_w - (lb[2] - lb[0])) / 2, by1 + 18), label, fill=(148, 163, 184), font=FONT_STAT_LBL)
        
        # Value
        vb = draw.textbbox((0, 0), f"{val}/100", font=FONT_STAT_VAL)
        draw.text((bx1 + (badge_w - (vb[2] - vb[0])) / 2, by1 + 48), f"{val}/100", fill=col, font=FONT_STAT_VAL)

    return img

def render_back_card(char):
    # Warm Antique Storybook Parchment
    img = Image.new("RGB", (CARD_W, CARD_H), color=(247, 241, 225))
    draw = ImageDraw.Draw(img)

    gold_dark = (120, 53, 15)
    gold_med = (180, 83, 9)
    gold_light = (217, 119, 6)

    # Parchment Border Frame
    draw_filigree_frame(draw, CARD_W, CARD_H, gold_light, gold_dark, fill_bg=(247, 241, 225))

    # Back Header
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

    # 2. 1-Minute Performance Speech Box
    s_box = [34, 345, CARD_W - 34, 765]
    draw.rectangle(s_box, fill=(255, 255, 255), outline=gold_dark, width=2)
    draw.rectangle([s_box[0], s_box[1], s_box[2], s_box[1] + 32], fill=(254, 243, 199))
    draw.text((s_box[0] + 14, s_box[1] + 6), "1-MINUTE PERFORMANCE SPEECH & ACTING PROMPT", fill=gold_dark, font=FONT_HEADER_SM)

    # Vocal Tone
    draw.text((s_box[0] + 14, s_box[1] + 42), f"Vocal Tone: {char['vocal'][:60]}", fill=(146, 64, 14), font=FONT_BODY_SM)
    
    # Stage Action
    draw.text((s_box[0] + 14, s_box[1] + 74), f"Stage Action: {char['action'][:65]}", fill=(154, 52, 18), font=FONT_BODY_BOLD)

    # Dialogue Quote
    q_box = [s_box[0] + 12, s_box[1] + 115, s_box[2] - 12, s_box[1] + 205]
    draw.rectangle(q_box, fill=(254, 242, 242), outline=(248, 113, 113), width=1)
    draw.text((q_box[0] + 10, q_box[1] + 8), f"Key Spoken Line:", fill=(153, 27, 27), font=FONT_HEADER_SM)
    
    # Wrap quote lines
    q_words = char['quote'].split()
    line1 = " ".join(q_words[:8])
    line2 = " ".join(q_words[8:16])
    line3 = " ".join(q_words[16:])
    draw.text((q_box[0] + 10, q_box[1] + 32), f'"{line1}', fill=(127, 29, 29), font=FONT_BODY)
    if line2: draw.text((q_box[0] + 10, q_box[1] + 54), f'{line2}', fill=(127, 29, 29), font=FONT_BODY)
    if line3: draw.text((q_box[0] + 10, q_box[1] + 76), f'{line3}"', fill=(127, 29, 29), font=FONT_BODY)

    # Speech Beat Description
    draw.text((s_box[0] + 14, s_box[1] + 225), "Speech Beat:", fill=gold_dark, font=FONT_BODY_BOLD)
    words = char["speech"].split()
    b1 = " ".join(words[:11])
    b2 = " ".join(words[11:22])
    b3 = " ".join(words[22:33])
    draw.text((s_box[0] + 14, s_box[1] + 252), b1, fill=(50, 40, 30), font=FONT_BODY_SM)
    if b2: draw.text((s_box[0] + 14, s_box[1] + 276), b2, fill=(50, 40, 30), font=FONT_BODY_SM)
    if b3: draw.text((s_box[0] + 14, s_box[1] + 300), b3, fill=(50, 40, 30), font=FONT_BODY_SM)

    # 3. Key Interaction Cue Box (Bottom)
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
    print("MAD TEA PARTY 300 DPI TRADING CARD GENERATOR")
    print("=" * 60)

    front_images = []
    back_images = []

    for char in CHARACTERS:
        num = char["num"]
        slug = char["id"]
        
        # Front
        front_img = render_front_card(char)
        f_path = os.path.join(PNG_DIR, f"{num:02d}_{slug}_front.png")
        front_img.save(f_path, dpi=(300, 300))
        front_images.append(front_img)

        # Back
        back_img = render_back_card(char)
        b_path = os.path.join(PNG_DIR, f"{num:02d}_{slug}_back.png")
        back_img.save(b_path, dpi=(300, 300))
        back_images.append(back_img)

        print(f"Generated card {num:02d}/19: {char['name']} (Front & Back)")

    # 1. Export Individual Cards Multi-Page PDF
    single_pdf_path = os.path.join(OUTPUT_DIR, "Tea_Party_Cards_Individual_Cards.pdf")
    pages = []
    for f, b in zip(front_images, back_images):
        pages.append(f)
        pages.append(b)
    
    pages[0].save(single_pdf_path, save_all=True, append_images=pages[1:], resolution=300)
    print(f"Saved: {single_pdf_path} (38 Pages)")

    # 2. Export 3x3 Grid Duplex Sheets (A4 / Cardstock Print-Ready)
    # A4 at 300 DPI: 2480 x 3508 pixels
    A4_W, A4_H = 2480, 3508
    sheet_pdf_path = os.path.join(OUTPUT_DIR, "Tea_Party_Trading_Cards_Duplex_Sheets.pdf")
    duplex_pages = []

    # 3 batches: 0-9, 9-18, 18-19
    batches = [
        (0, 9),
        (9, 18),
        (18, 19)
    ]

    # Grid layout parameters: 3 columns x 3 rows
    # Card size: 750 x 1050
    # 3 * 750 = 2250 -> margin_x = (2480 - 2250) / 2 = 115 px
    # 3 * 1050 = 3150 -> margin_y = (3508 - 3150) / 2 = 179 px
    margin_x = (A4_W - 3 * CARD_W) // 2
    margin_y = (A4_H - 3 * CARD_H) // 2

    # Column mirroring index mapping for duplex backing:
    # Row 0: 0, 1, 2 -> Mirrored: 2, 1, 0
    # Row 1: 3, 4, 5 -> Mirrored: 5, 4, 3
    # Row 2: 6, 7, 8 -> Mirrored: 8, 7, 6
    mirrored_map = [2, 1, 0, 5, 4, 3, 8, 7, 6]

    for b_idx, (start, end) in enumerate(batches):
        batch_chars = CHARACTERS[start:end]
        
        # --- FRONT SHEET ---
        front_sheet = Image.new("RGB", (A4_W, A4_H), color=(255, 255, 255))
        f_draw = ImageDraw.Draw(front_sheet)
        header_text = f"MAD TEA PARTY TRADING CARDS — SHEET {b_idx + 1} (FRONT SIDES) • 3x3 GRID (300 DPI)"
        f_draw.text((margin_x, margin_y - 80), header_text, fill=(50, 50, 50), font=FONT_TITLE)

        for i in range(9):
            if i < len(batch_chars):
                card_img = front_images[start + i]
                row = i // 3
                col = i % 3
                pos_x = margin_x + col * CARD_W
                pos_y = margin_y + row * CARD_H
                front_sheet.paste(card_img, (pos_x, pos_y))
                # Cut guide
                f_draw.rectangle([pos_x, pos_y, pos_x + CARD_W, pos_y + CARD_H], outline=(200, 200, 200), width=1)

        duplex_pages.append(front_sheet)

        # --- BACK SHEET (DUPLEX HORIZONTALLY MIRRORED) ---
        back_sheet = Image.new("RGB", (A4_W, A4_H), color=(255, 255, 255))
        b_draw = ImageDraw.Draw(back_sheet)
        back_header = f"MAD TEA PARTY TRADING CARDS — SHEET {b_idx + 1} (BACK SIDES — DUPLEX ALIGNED) • FLIP ON LONG EDGE"
        b_draw.text((margin_x, margin_y - 80), back_header, fill=(50, 50, 50), font=FONT_TITLE)

        for i in range(9):
            target_idx = mirrored_map[i]
            if target_idx < len(batch_chars):
                card_img = back_images[start + target_idx]
                row = i // 3
                col = i % 3
                pos_x = margin_x + col * CARD_W
                pos_y = margin_y + row * CARD_H
                back_sheet.paste(card_img, (pos_x, pos_y))
                b_draw.rectangle([pos_x, pos_y, pos_x + CARD_W, pos_y + CARD_H], outline=(200, 200, 200), width=1)

        duplex_pages.append(back_sheet)

    duplex_pages[0].save(sheet_pdf_path, save_all=True, append_images=duplex_pages[1:], resolution=300)
    print(f"Saved: {sheet_pdf_path} (6 Pages, Duplex Registered)")

    print("=" * 60)
    print("ALL ASSETS SUCCESSFULLY GENERATED!")
    print("=" * 60)

if __name__ == "__main__":
    main()
