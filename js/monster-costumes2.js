/* Monster Costumes, batch 2: 8 more themed sets (24 pieces) and 4 standalone legendary pieces.
   All are bought in the Classroom Store (or found in Mystery Boxes). Registers itself with MonsterCostumes.extend(). */
(function (root) {
  'use strict';
  if (!root.MonsterCostumes || !root.MonsterCostumes.extend) return;

  var SETS = {
    pirate: { name: 'Pirate Captain', icon: '🏴‍☠️', title: 'Pirate Captain', pieces: ['cs-pirate-hat', 'cs-pirate-patch', 'cs-parrot'] },
    wizard: { name: 'Wizard Academy', icon: '🧙', title: 'Grand Wizard', pieces: ['cs-wiz-hat', 'cs-wiz-robe', 'cs-wiz-staff'] },
    ninja:  { name: 'Shadow Ninja', icon: '🥷', title: 'Shadow Ninja', pieces: ['cs-ninja-band', 'cs-ninja-mask', 'cs-ninja-gi'] },
    knight: { name: 'Brave Knight', icon: '🛡️', title: 'Brave Knight', pieces: ['cs-knight-helm', 'cs-knight-armor', 'cs-knight-shield'] },
    robot:  { name: 'Robot Pal', icon: '🤖', title: 'Robot Master', pieces: ['cs-robot-antenna', 'cs-robot-visor', 'cs-robot-pack'] },
    ocean:  { name: 'Ocean Diver', icon: '🐠', title: 'Ocean Explorer', pieces: ['cs-diver-mask', 'cs-bubbles', 'cs-scuba-tank'] },
    rock:   { name: 'Rock Star', icon: '🎸', title: 'Rock Star', pieces: ['cs-rock-bandana', 'cs-rock-shades', 'cs-guitar'] },
    winter: { name: 'Snow Day', icon: '⛄', title: 'Snow Champion', pieces: ['cs-beanie', 'cs-scarf', 'cs-snowflakes'] }
  };

  function it(id, name, category, sub, icon, rarity, desc, setId) {
    return { id: id, name: name, category: category, subCategory: sub, description: desc, icon: icon, unlockType: 'store',
      unlockRequirement: { label: 'Buy it in the Shop 🛒 or find it in a Mystery Box' }, rarity: rarity, status: 'active', setId: setId || null };
  }
  var ITEMS = [
    it('cs-pirate-hat', 'Pirate Hat', 'hat', 'hats', '🏴‍☠️', 'rare', 'A black captain hat with a skull badge', 'pirate'),
    it('cs-pirate-patch', 'Eye Patch', 'glasses', 'accessories', '🏴‍☠️', 'common', 'A black patch for a brave pirate', 'pirate'),
    it('cs-parrot', 'Pirate Parrot', 'accessory', 'accessories', '🦜', 'epic', 'A colourful parrot on your shoulder', 'pirate'),
    it('cs-wiz-hat', 'Wizard Hat', 'hat', 'hats', '🧙', 'epic', 'A tall purple hat with glowing stars', 'wizard'),
    it('cs-wiz-robe', 'Wizard Robe', 'clothing', 'costumes', '🪄', 'epic', 'A midnight robe with gold moons', 'wizard'),
    it('cs-wiz-staff', 'Magic Staff', 'accessory', 'accessories', '🔮', 'rare', 'A staff with a glowing crystal', 'wizard'),
    it('cs-ninja-band', 'Ninja Headband', 'hat', 'hats', '🥷', 'common', 'A black headband with a steel plate', 'ninja'),
    it('cs-ninja-mask', 'Ninja Mask', 'glasses', 'accessories', '🥷', 'rare', 'A dark mask with sharp eyes', 'ninja'),
    it('cs-ninja-gi', 'Ninja Suit', 'clothing', 'costumes', '🥋', 'rare', 'A black suit with a red belt', 'ninja'),
    it('cs-knight-helm', 'Knight Helmet', 'hat', 'hats', '🛡️', 'epic', 'A shiny steel helmet with a red plume', 'knight'),
    it('cs-knight-armor', 'Knight Armour', 'clothing', 'costumes', '⚔️', 'epic', 'Silver armour with a gold cross', 'knight'),
    it('cs-knight-shield', 'Hero Shield', 'accessory', 'accessories', '🛡️', 'rare', 'A round shield with a lion', 'knight'),
    it('cs-robot-antenna', 'Robot Antenna', 'hat', 'hats', '📡', 'common', 'A springy antenna with a blinking light', 'robot'),
    it('cs-robot-visor', 'Robot Visor', 'glasses', 'accessories', '🤖', 'rare', 'A glowing blue scanner visor', 'robot'),
    it('cs-robot-pack', 'Gear Backpack', 'backpack', 'backpacks', '⚙️', 'epic', 'Spinning gears and glowing wires', 'robot'),
    it('cs-diver-mask', 'Diving Mask', 'glasses', 'accessories', '🤿', 'common', 'A blue mask with a snorkel', 'ocean'),
    it('cs-bubbles', 'Bubble Cloud', 'aura', 'auras', '🫧', 'rare', 'Bubbles floating around you', 'ocean'),
    it('cs-scuba-tank', 'Scuba Tank', 'backpack', 'backpacks', '🫧', 'rare', 'Two yellow air tanks', 'ocean'),
    it('cs-rock-bandana', 'Rock Bandana', 'hat', 'hats', '🎸', 'common', 'A red bandana with white dots', 'rock'),
    it('cs-rock-shades', 'Star Shades', 'glasses', 'accessories', '🕶️', 'rare', 'Cool dark shades with gold stars', 'rock'),
    it('cs-guitar', 'Rock Guitar', 'accessory', 'accessories', '🎸', 'epic', 'A red electric guitar', 'rock'),
    it('cs-beanie', 'Snow Beanie', 'hat', 'hats', '🧢', 'common', 'A warm striped hat with a pom-pom', 'winter'),
    it('cs-scarf', 'Warm Scarf', 'clothing', 'costumes', '🧣', 'common', 'A long red and white scarf', 'winter'),
    it('cs-snowflakes', 'Snowflakes', 'aura', 'auras', '❄️', 'rare', 'Snowflakes falling softly', 'winter'),
    // standalone legendary / epic pieces
    it('cs-big-crown', 'Diamond Crown', 'hat', 'hats', '👑', 'legendary', 'A crown full of sparkling diamonds'),
    it('cs-fairy-wings', 'Fairy Wings', 'backpack', 'backpacks', '🧚', 'legendary', 'Shimmering fairy wings'),
    it('cs-aura-fire', 'Fire Aura', 'aura', 'auras', '🔥', 'epic', 'Friendly flames dancing around you'),
    it('cs-aura-hearts', 'Heart Aura', 'aura', 'auras', '💖', 'rare', 'Hearts floating up into the sky')
  ];

  var H = {}, GL = {}, AC = {}, CL = {}, BP = {}, AU = {}, V = {};

  /* ---------------- hats ---------------- */
  H['cs-pirate-hat'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><path d="M52 ${t + 10} Q58 ${t - 22} 100 ${t - 22} Q142 ${t - 22} 148 ${t + 10} Q124 ${t + 2} 100 ${t + 6} Q76 ${t + 2} 52 ${t + 10} Z" fill="#1f2937" stroke="#030712" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M60 ${t + 6} Q100 ${t - 2} 140 ${t + 6}" fill="none" stroke="#fbbf24" stroke-width="3"/>
      <circle cx="100" cy="${t - 8}" r="7" fill="#f8fafc" stroke="#475569" stroke-width="1.4"/><circle cx="97" cy="${t - 9}" r="1.7" fill="#111827"/><circle cx="103" cy="${t - 9}" r="1.7" fill="#111827"/>
      <path d="M96.5 ${t - 3} L103.5 ${t - 3}" stroke="#111827" stroke-width="1.4"/>
      <path d="M92 ${t - 13} L108 ${t - 3} M108 ${t - 13} L92 ${t - 3}" stroke="#f8fafc" stroke-width="1.6" opacity="0.9"/></g>`; };
  H['cs-wiz-hat'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><ellipse cx="100" cy="${t + 4}" rx="50" ry="9" fill="#5b21b6" stroke="#2e1065" stroke-width="2.2"/>
      <path d="M70 ${t + 3} Q80 ${t - 28} 112 ${t - 58} Q108 ${t - 30} 130 ${t + 3} Z" fill="#7c3aed" stroke="#2e1065" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M112 ${t - 58} Q126 ${t - 62} 128 ${t - 50}" fill="none" stroke="#2e1065" stroke-width="3" stroke-linecap="round"/>
      <rect x="72" y="${t - 6}" width="56" height="8" fill="#fbbf24" opacity="0.95" stroke="#a16207" stroke-width="1.4"/>
      <polygon points="96,${t - 20} 98,${t - 15} 103,${t - 15} 99,${t - 12} 100.5,${t - 7} 96,${t - 10} 91.5,${t - 7} 93,${t - 12} 89,${t - 15} 94,${t - 15}" fill="#fde047"/>
      <circle cx="108" cy="${t - 34}" r="2.4" fill="#fde047"/><circle cx="88" cy="${t - 4}" r="1.8" fill="#fef9c3"/></g>`; };
  H['cs-ninja-band'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><path d="M60 ${t + 20} Q100 ${t + 6} 140 ${t + 20} L140 ${t + 31} Q100 ${t + 17} 60 ${t + 31} Z" fill="#111827" stroke="#000" stroke-width="2"/>
      <rect x="86" y="${t + 14}" width="28" height="13" rx="3" fill="#94a3b8" stroke="#334155" stroke-width="1.8"/>
      <path d="M92 ${t + 20} L100 ${t + 16} L108 ${t + 20} L100 ${t + 25} Z" fill="#475569"/>
      <path d="M140 ${t + 24} Q154 ${t + 20} 160 ${t + 32} Q150 ${t + 30} 142 ${t + 30} Z M140 ${t + 26} Q152 ${t + 36} 158 ${t + 48} Q146 ${t + 40} 140 ${t + 31} Z" fill="#111827" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/></g>`; };
  H['cs-knight-helm'] = function (g) { var t = g.topY, e = g.eyeY;
    return `<g class="monster-hat"><path d="M58 ${e + 20} L58 ${t + 8} Q58 ${t - 22} 100 ${t - 24} Q142 ${t - 22} 142 ${t + 8} L142 ${e + 20} L128 ${e + 24} L128 ${t + 10} L72 ${t + 10} L72 ${e + 24} Z" fill="#cbd5e1" stroke="#334155" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M64 ${t - 2} Q100 ${t - 16} 136 ${t - 2}" fill="none" stroke="#f8fafc" stroke-width="3" opacity="0.8"/>
      <rect x="72" y="${t + 8}" width="56" height="7" rx="2" fill="#94a3b8" stroke="#334155" stroke-width="1.6"/>
      <path d="M100 ${t - 24} Q116 ${t - 48} 132 ${t - 36} Q122 ${t - 30} 112 ${t - 20} Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="64" cy="${t + 6}" r="2.2" fill="#64748b"/><circle cx="136" cy="${t + 6}" r="2.2" fill="#64748b"/></g>`; };
  H['cs-robot-antenna'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><path d="M100 ${t + 2} L100 ${t - 14} Q92 ${t - 20} 104 ${t - 26} Q96 ${t - 32} 100 ${t - 38}" fill="none" stroke="#64748b" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="100" cy="${t - 42}" r="7" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.8"/><circle cx="98" cy="${t - 44}" r="2.2" fill="#fecaca"/>
      <circle cx="100" cy="${t + 3}" r="5" fill="#94a3b8" stroke="#334155" stroke-width="1.8"/>
      <rect x="80" y="${t + 14}" width="40" height="8" rx="3" fill="#94a3b8" stroke="#334155" stroke-width="1.8" opacity="0.95"/><circle cx="90" cy="${t + 18}" r="1.8" fill="#22c55e"/><circle cx="100" cy="${t + 18}" r="1.8" fill="#facc15"/><circle cx="110" cy="${t + 18}" r="1.8" fill="#38bdf8"/></g>`; };
  H['cs-rock-bandana'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><path d="M60 ${t + 14} Q100 ${t - 2} 140 ${t + 14} L140 ${t + 28} Q100 ${t + 12} 60 ${t + 28} Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="76" cy="${t + 16}" r="2.4" fill="#fff"/><circle cx="90" cy="${t + 13}" r="2.4" fill="#fff"/><circle cx="104" cy="${t + 13}" r="2.4" fill="#fff"/><circle cx="118" cy="${t + 16}" r="2.4" fill="#fff"/><circle cx="84" cy="${t + 23}" r="2.4" fill="#fff"/><circle cx="98" cy="${t + 21}" r="2.4" fill="#fff"/><circle cx="112" cy="${t + 22}" r="2.4" fill="#fff"/>
      <path d="M140 ${t + 20} L156 ${t + 12} L152 ${t + 28} Z M140 ${t + 24} L154 ${t + 38} L145 ${t + 32} Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.8" stroke-linejoin="round"/></g>`; };
  H['cs-beanie'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><path d="M66 ${t + 12} Q68 ${t - 22} 100 ${t - 24} Q132 ${t - 22} 134 ${t + 12} Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2.2"/>
      <path d="M70 ${t - 8} Q100 ${t} 130 ${t - 8} M68 ${t + 1} Q100 ${t + 9} 132 ${t + 1}" fill="none" stroke="#ffffff" stroke-width="4.4" opacity="0.92"/>
      <rect x="62" y="${t + 8}" width="76" height="13" rx="6.5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
      <path d="M70 ${t + 10} L70 ${t + 19} M82 ${t + 10} L82 ${t + 19} M94 ${t + 10} L94 ${t + 19} M106 ${t + 10} L106 ${t + 19} M118 ${t + 10} L118 ${t + 19} M130 ${t + 10} L130 ${t + 19}" stroke="#cbd5e1" stroke-width="1.6"/>
      <circle cx="100" cy="${t - 28}" r="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/><circle cx="96" cy="${t - 31}" r="3" fill="#f1f5f9"/></g>`; };
  H['cs-big-crown'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><polygon points="62,${t + 8} 64,${t - 26} 82,${t - 6} 100,${t - 34} 118,${t - 6} 136,${t - 26} 138,${t + 8}" fill="#fcd34d" stroke="#a16207" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="60" y="${t + 4}" width="80" height="11" rx="4" fill="#f59e0b" stroke="#a16207" stroke-width="2"/>
      <polygon points="100,${t - 28} 106,${t - 20} 100,${t - 12} 94,${t - 20}" fill="#67e8f9" stroke="#0e7490" stroke-width="1.6"/>
      <polygon points="64,${t - 20} 69,${t - 13} 64,${t - 6} 59,${t - 13}" fill="#f0abfc" stroke="#86198f" stroke-width="1.4"/><polygon points="136,${t - 20} 141,${t - 13} 136,${t - 6} 131,${t - 13}" fill="#86efac" stroke="#166534" stroke-width="1.4"/>
      <circle cx="78" cy="${t + 9}" r="3" fill="#67e8f9" stroke="#0e7490" stroke-width="1"/><circle cx="100" cy="${t + 9}" r="3" fill="#f0abfc" stroke="#86198f" stroke-width="1"/><circle cx="122" cy="${t + 9}" r="3" fill="#67e8f9" stroke="#0e7490" stroke-width="1"/>
      <path d="M108 ${t - 36} l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#ffffff"/></g>`; };

  /* ---------------- glasses ---------------- */
  GL['cs-pirate-patch'] = function (g) { var y = g.eyeY, s = g.eyeSpacing;
    return `<g class="monster-glasses"><path d="M${100 - s - 20} ${y - 22} L${100 + s + 18} ${y + 12}" stroke="#111827" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="${100 + s}" cy="${y}" rx="12.5" ry="11" fill="#111827" stroke="#000" stroke-width="2"/><path d="M${100 + s - 6} ${y - 5} Q${100 + s} ${y - 8} ${100 + s + 6} ${y - 5}" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round"/></g>`; };
  GL['cs-ninja-mask'] = function (g) { var y = g.eyeY, s = g.eyeSpacing, w = s + 21;
    return `<g class="monster-glasses"><path fill-rule="evenodd" d="M${100 - w} ${y - 9} Q100 ${y - 16} ${100 + w} ${y - 9} L${100 + w} ${y + 10} Q100 ${y + 15} ${100 - w} ${y + 10} Z M${100 - s - 9} ${y - 1} Q${100 - s} ${y - 6} ${100 - s + 9} ${y - 2} L${100 - s + 8} ${y + 4} Q${100 - s} ${y + 6} ${100 - s - 9} ${y + 3} Z M${100 + s - 9} ${y - 2} Q${100 + s} ${y - 6} ${100 + s + 9} ${y - 1} L${100 + s + 9} ${y + 3} Q${100 + s} ${y + 6} ${100 + s - 8} ${y + 4} Z" fill="#111827" stroke="#000" stroke-width="2"/>
      <path d="M${100 - w + 2} ${y - 6} L${100 - s - 12} ${y - 3} M${100 + w - 2} ${y - 6} L${100 + s + 12} ${y - 3}" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round"/></g>`; };
  GL['cs-robot-visor'] = function (g) { var y = g.eyeY, s = g.eyeSpacing, w = s + 19;
    return `<g class="monster-glasses"><rect x="${100 - w}" y="${y - 11}" width="${w * 2}" height="22" rx="10" fill="#0f172a" stroke="#475569" stroke-width="2.6"/>
      <rect x="${100 - w + 5}" y="${y - 6}" width="${w * 2 - 10}" height="12" rx="6" fill="#22d3ee" opacity="0.88"/>
      <path d="M${100 - w + 10} ${y - 2} L${100 + w - 10} ${y - 2}" stroke="#ecfeff" stroke-width="2" opacity="0.75"/><circle cx="${100 - s}" cy="${y + 1}" r="3.4" fill="#0e7490"/><circle cx="${100 + s}" cy="${y + 1}" r="3.4" fill="#0e7490"/>
      <circle cx="${100 + w - 3}" cy="${y - 13}" r="2.4" fill="#22c55e"/></g>`; };
  GL['cs-diver-mask'] = function (g) { var y = g.eyeY, s = g.eyeSpacing, w = s + 17;
    return `<g class="monster-glasses"><path d="M${100 - w - 6} ${y - 3} L52 ${y - 8} M${100 + w + 6} ${y - 3} L148 ${y - 8}" stroke="#1d4ed8" stroke-width="3.4" stroke-linecap="round"/>
      <rect x="${100 - w}" y="${y - 12}" width="${w * 2}" height="25" rx="11" fill="#bae6fd" fill-opacity="0.35" stroke="#1d4ed8" stroke-width="4"/>
      <path d="M${100 - 4} ${y - 12} L${100 - 4} ${y + 13} M${100 + 4} ${y - 12} L${100 + 4} ${y + 13}" stroke="#1d4ed8" stroke-width="3" opacity="0"/>
      <path d="M${100 - w + 6} ${y - 6} Q${100 - w + 12} ${y - 9} ${100 - w + 20} ${y - 8}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>
      <path d="M${100 + w + 4} ${y - 14} L${100 + w + 14} ${y - 36} Q${100 + w + 22} ${y - 40} ${100 + w + 20} ${y - 30}" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/></g>`; };
  GL['cs-rock-shades'] = function (g) { var y = g.eyeY, s = g.eyeSpacing;
    function star(cx, cy) { return `<polygon points="${cx},${cy - 6} ${cx + 1.9},${cy - 1.9} ${cx + 6.4},${cy - 1.8} ${cx + 2.8},${cy + 1.2} ${cx + 4},${cy + 5.6} ${cx},${cy + 3} ${cx - 4},${cy + 5.6} ${cx - 2.8},${cy + 1.2} ${cx - 6.4},${cy - 1.8} ${cx - 1.9},${cy - 1.9}" fill="#facc15" stroke="#a16207" stroke-width="0.9"/>`; }
    return `<g class="monster-glasses"><path d="M${100 - s - 14} ${y - 8} L${100 + s + 14} ${y - 8} L${100 + s + 11} ${y + 4} Q${100 + s} ${y + 16} ${100 + s - 12} ${y + 8} Q100 ${y + 2} ${100 - s + 12} ${y + 8} Q${100 - s} ${y + 16} ${100 - s - 11} ${y + 4} Z" fill="#111827" stroke="#000" stroke-width="2.4" stroke-linejoin="round"/>
      ${star(100 - s, y + 1)}${star(100 + s, y + 1)}<path d="M${100 - s - 12} ${y - 5} L${100 - s + 6} ${y - 5}" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" opacity="0.7"/></g>`; };

  /* ---------------- accessories ---------------- */
  AC['cs-parrot'] = function () {
    return `<g class="monster-acc" transform="translate(134,96)"><path d="M8 40 Q2 52 8 60 Q14 52 12 42 Z M14 40 Q12 54 20 62 Q22 50 18 40 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.4" stroke-linejoin="round"/>
      <ellipse cx="14" cy="28" rx="12" ry="15" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/><ellipse cx="9" cy="30" rx="6" ry="9" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.4"/>
      <circle cx="17" cy="11" r="9" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/><circle cx="19" cy="9" r="3.4" fill="#fff" stroke="#111827" stroke-width="1.2"/><circle cx="20" cy="9" r="1.5" fill="#111827"/>
      <path d="M24 9 Q34 10 30 19 Q26 17 24 14 Z" fill="#facc15" stroke="#a16207" stroke-width="1.4" stroke-linejoin="round"/></g>`; };
  AC['cs-wiz-staff'] = function () {
    return `<g class="monster-acc" transform="translate(142,70)"><line x1="8" y1="14" x2="8" y2="92" stroke="#78350f" stroke-width="5.4" stroke-linecap="round"/><line x1="8" y1="14" x2="8" y2="92" stroke="#a16207" stroke-width="2" stroke-linecap="round"/>
      <path d="M-2 18 Q-4 4 8 2 Q20 4 18 18 Q8 12 -2 18 Z" fill="#7c3aed" stroke="#2e1065" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="8" cy="8" r="9" fill="#c4b5fd" stroke="#5b21b6" stroke-width="2"/><circle cx="5" cy="5" r="3" fill="#ffffff" opacity="0.9"/>
      <circle cx="8" cy="8" r="14" fill="#a78bfa" opacity="0.22"/></g>`; };
  AC['cs-knight-shield'] = function () {
    return `<g class="monster-acc" transform="translate(26,106)"><path d="M0 4 L34 4 L34 30 Q34 52 17 60 Q0 52 0 30 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M17 4 L17 60" stroke="#facc15" stroke-width="3.4"/><path d="M0 24 L34 24" stroke="#facc15" stroke-width="3.4"/>
      <path d="M4 8 L30 8" stroke="#93c5fd" stroke-width="2" opacity="0.7"/><circle cx="17" cy="24" r="5" fill="#facc15" stroke="#a16207" stroke-width="1.4"/></g>`; };
  AC['cs-guitar'] = function () {
    return `<g class="monster-acc" transform="translate(100,100) rotate(-22)"><rect x="26" y="-4" width="8" height="62" rx="3" fill="#78350f" stroke="#451a03" stroke-width="1.6"/>
      <path d="M22 -10 L38 -10 L38 4 L22 4 Z" fill="#451a03" stroke="#1c0a02" stroke-width="1.4"/><circle cx="26" cy="-6" r="1.6" fill="#e2e8f0"/><circle cx="34" cy="-6" r="1.6" fill="#e2e8f0"/>
      <path d="M30 56 Q4 54 8 78 Q10 94 30 92 Q50 94 52 78 Q56 54 30 56 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="30" cy="74" rx="6" ry="6" fill="#1f2937" stroke="#000" stroke-width="1.4"/><rect x="22" y="82" width="16" height="4" rx="2" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/>
      <path d="M28 4 L28 74 M32 4 L32 74" stroke="#e2e8f0" stroke-width="0.8" opacity="0.8"/><path d="M14 66 Q16 62 22 62" fill="none" stroke="#fecaca" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/></g>`; };

  /* ---------------- clothing (drawn on the belly, y 106 to 150) ---------------- */
  CL['cs-wiz-robe'] = function () {
    return `<g class="monster-clothing"><path d="M62 108 C58 130 64 146 80 150 L120 150 C136 146 142 130 138 108 C126 112 112 114 100 114 C88 114 74 112 62 108 Z" fill="#4c1d95" stroke="#2e1065" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M62 128 Q100 136 138 128 L138 134 Q100 142 62 134 Z" fill="#fbbf24" stroke="#a16207" stroke-width="1.6"/>
      <path d="M88 116 Q100 126 112 116" fill="none" stroke="#fbbf24" stroke-width="3"/>
      <path d="M76 124 a5 5 0 1 0 6 6 a4 4 0 1 1 -6 -6 z" fill="#fde047"/><polygon points="120,120 121.6,124 126,124.4 122.6,127 123.8,131 120,128.6 116.2,131 117.4,127 114,124.4 118.4,124" fill="#fde047"/>
      <path d="M70 140 a4 4 0 1 0 5 5 a3 3 0 1 1 -5 -5 z" fill="#fde047" opacity="0.9"/></g>`; };
  CL['cs-ninja-gi'] = function () {
    return `<g class="monster-clothing"><path d="M62 108 C58 130 64 146 80 150 L120 150 C136 146 142 130 138 108 C126 112 112 114 100 114 C88 114 74 112 62 108 Z" fill="#1f2937" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M82 110 L104 134 M118 110 L96 134" stroke="#374151" stroke-width="3.4" stroke-linecap="round"/>
      <rect x="62" y="130" width="76" height="9" rx="3" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.8"/><path d="M100 134 L90 146 L97 143 L100 148 L104 143 L111 146 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M68 118 L66 126 M132 118 L134 126" stroke="#4b5563" stroke-width="2.4" stroke-linecap="round"/></g>`; };
  CL['cs-knight-armor'] = function () {
    return `<g class="monster-clothing"><path d="M62 108 C58 130 64 146 80 150 L120 150 C136 146 142 130 138 108 C126 112 112 114 100 114 C88 114 74 112 62 108 Z" fill="#cbd5e1" stroke="#334155" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M66 110 Q78 106 88 112 L88 128 Q76 126 66 130 Z M134 110 Q122 106 112 112 L112 128 Q124 126 134 130 Z" fill="#94a3b8" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
      <rect x="94" y="116" width="12" height="30" fill="#facc15" stroke="#a16207" stroke-width="1.6"/><rect x="82" y="124" width="36" height="11" fill="#facc15" stroke="#a16207" stroke-width="1.6"/>
      <path d="M72 116 L84 116" stroke="#f8fafc" stroke-width="2.4" opacity="0.8" stroke-linecap="round"/><circle cx="76" cy="140" r="2" fill="#64748b"/><circle cx="124" cy="140" r="2" fill="#64748b"/></g>`; };
  CL['cs-scarf'] = function () {
    return `<g class="monster-clothing"><path d="M64 108 Q100 124 136 108 L138 120 Q100 136 62 120 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M70 114 Q100 128 130 114 M68 120 Q100 134 132 120" fill="none" stroke="#ffffff" stroke-width="3.4" opacity="0.92"/>
      <path d="M118 122 L130 150 L144 146 L134 118 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2.4" stroke-linejoin="round"/><path d="M122 132 L137 128 M126 141 L140 137" stroke="#ffffff" stroke-width="3.2"/>
      <path d="M130 150 L128 156 M134 149 L133 155 M138 148 L138 154 M142 147 L143 153" stroke="#b91c1c" stroke-width="1.8" stroke-linecap="round"/></g>`; };

  /* ---------------- back gear ---------------- */
  BP['cs-robot-pack'] = function () {
    function gear(cx, cy, r, c) { var teeth = ''; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; teeth += `<rect x="${cx - 3}" y="${cy - r - 5}" width="6" height="8" rx="1.5" fill="${c}" transform="rotate(${i * 45} ${cx} ${cy})"/>`; } return teeth + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" stroke="#334155" stroke-width="1.8"/><circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="#e2e8f0" stroke="#334155" stroke-width="1.2"/>`; }
    return `<g class="monster-backpack"><rect x="48" y="102" width="104" height="48" rx="10" fill="#64748b" stroke="#334155" stroke-width="2.6"/>${gear(70, 126, 11, '#94a3b8')}${gear(100, 120, 8, '#cbd5e1')}${gear(128, 128, 10, '#94a3b8')}
      <path d="M58 106 Q50 94 44 100 M142 106 Q150 94 156 100" fill="none" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="100" r="3.4" fill="#22d3ee"/><circle cx="156" cy="100" r="3.4" fill="#22d3ee"/>
      <circle cx="140" cy="108" r="2.8" fill="#22c55e"/><circle cx="132" cy="108" r="2.8" fill="#facc15"/></g>`; };
  BP['cs-scuba-tank'] = function () {
    return `<g class="monster-backpack"><rect x="44" y="98" width="18" height="46" rx="9" fill="#facc15" stroke="#a16207" stroke-width="2.4"/><rect x="138" y="98" width="18" height="46" rx="9" fill="#facc15" stroke="#a16207" stroke-width="2.4"/>
      <rect x="44" y="112" width="18" height="6" fill="#1d4ed8"/><rect x="138" y="112" width="18" height="6" fill="#1d4ed8"/><rect x="49" y="92" width="8" height="8" rx="2" fill="#64748b" stroke="#334155" stroke-width="1.4"/><rect x="143" y="92" width="8" height="8" rx="2" fill="#64748b" stroke="#334155" stroke-width="1.4"/>
      <path d="M53 92 Q60 70 100 74 Q140 70 147 92" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/><path d="M50 104 L56 104" stroke="#fff" stroke-width="2.4" opacity="0.8" stroke-linecap="round"/></g>`; };
  BP['cs-fairy-wings'] = function () {
    return `<g class="monster-backpack"><path d="M64 112 Q20 70 30 104 Q22 128 62 132 Z" fill="#f0abfc" fill-opacity="0.85" stroke="#a21caf" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M64 124 Q26 138 40 156 Q58 160 66 138 Z" fill="#a5f3fc" fill-opacity="0.85" stroke="#0891b2" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M136 112 Q180 70 170 104 Q178 128 138 132 Z" fill="#f0abfc" fill-opacity="0.85" stroke="#a21caf" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M136 124 Q174 138 160 156 Q142 160 134 138 Z" fill="#a5f3fc" fill-opacity="0.85" stroke="#0891b2" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M60 114 Q40 100 34 100 M58 124 Q44 122 38 126 M140 114 Q160 100 166 100 M142 124 Q156 122 162 126" fill="none" stroke="#fff" stroke-width="1.6" opacity="0.7"/>
      <polygon points="40,90 41.6,94 46,94.4 42.6,97 43.8,101 40,98.6 36.2,101 37.4,97 34,94.4 38.4,94" fill="#fde047"/><polygon points="160,90 161.6,94 166,94.4 162.6,97 163.8,101 160,98.6 156.2,101 157.4,97 154,94.4 158.4,94" fill="#fde047"/></g>`; };

  /* ---------------- auras ---------------- */
  function bubbleSet(list) { return list.map(function (b) { return `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="#bae6fd" fill-opacity="0.35" stroke="#7dd3fc" stroke-width="1.6"/><circle cx="${b[0] - b[2] * 0.35}" cy="${b[1] - b[2] * 0.35}" r="${b[2] * 0.25}" fill="#fff" opacity="0.85"/>`; }).join(''); }
  AU['cs-bubbles'] = function () { return `<g class="monster-aura">${bubbleSet([[40, 60, 9], [28, 96, 6], [164, 70, 10], [172, 112, 6], [150, 40, 5], [52, 130, 7], [160, 138, 8], [100, 24, 5]])}</g>`; };
  function flake(x, y, s) { var arms = ''; for (var i = 0; i < 3; i++) arms += `<line x1="${x}" y1="${y - s}" x2="${x}" y2="${y + s}" stroke="#e0f2fe" stroke-width="2" stroke-linecap="round" transform="rotate(${i * 60} ${x} ${y})"/>`; return arms + `<circle cx="${x}" cy="${y}" r="${s * 0.22}" fill="#fff"/>`; }
  AU['cs-snowflakes'] = function () { return `<g class="monster-aura"><g stroke-opacity="0.9">${flake(38, 62, 10)}${flake(168, 74, 12)}${flake(54, 124, 8)}${flake(158, 132, 9)}${flake(100, 22, 8)}${flake(26, 98, 6)}${flake(176, 108, 6)}</g><circle cx="38" cy="62" r="14" fill="#7dd3fc" opacity="0.12"/><circle cx="168" cy="74" r="16" fill="#7dd3fc" opacity="0.12"/></g>`; };
  function flame(x, y, s, c1, c2) { return `<path d="M${x} ${y - 22 * s} Q${x + 14 * s} ${y - 8 * s} ${x + 9 * s} ${y + 6 * s} Q${x} ${y + 14 * s} ${x - 9 * s} ${y + 6 * s} Q${x - 14 * s} ${y - 6 * s} ${x - 3 * s} ${y - 12 * s} Q${x - 2 * s} ${y - 17 * s} ${x} ${y - 22 * s} Z" fill="${c1}" stroke="#9a3412" stroke-width="1.4" stroke-linejoin="round"/><path d="M${x} ${y - 8 * s} Q${x + 6 * s} ${y - 1 * s} ${x + 3 * s} ${y + 6 * s} Q${x} ${y + 9 * s} ${x - 3 * s} ${y + 5 * s} Q${x - 5 * s} ${y - 1 * s} ${x} ${y - 8 * s} Z" fill="${c2}"/>`; }
  AU['cs-aura-fire'] = function () { return `<g class="monster-aura"><circle cx="100" cy="110" r="72" fill="#fb923c" opacity="0.1"/>${flame(34, 112, 1.1, '#f97316', '#fde047')}${flame(166, 108, 1.2, '#f97316', '#fde047')}${flame(52, 150, 0.8, '#ef4444', '#fdba74')}${flame(150, 152, 0.85, '#ef4444', '#fdba74')}${flame(30, 66, 0.7, '#fb923c', '#fef08a')}${flame(172, 64, 0.7, '#fb923c', '#fef08a')}</g>`; };
  function heart(x, y, s, c) { return `<path d="M${x} ${y + 7 * s} C${x - 14 * s} ${y - 2 * s} ${x - 8 * s} ${y - 12 * s} ${x} ${y - 5 * s} C${x + 8 * s} ${y - 12 * s} ${x + 14 * s} ${y - 2 * s} ${x} ${y + 7 * s} Z" fill="${c}" stroke="#9f1239" stroke-width="1.4" stroke-linejoin="round"/><circle cx="${x - 4 * s}" cy="${y - 4 * s}" r="${1.4 * s}" fill="#fff" opacity="0.8"/>`; }
  AU['cs-aura-hearts'] = function () { return `<g class="monster-aura">${heart(36, 70, 1.3, '#fb7185')}${heart(166, 60, 1.1, '#f472b6')}${heart(50, 128, 0.9, '#f43f5e')}${heart(160, 120, 1.4, '#fb7185')}${heart(100, 22, 1, '#f472b6')}${heart(24, 104, 0.7, '#fda4af')}${heart(178, 96, 0.7, '#fda4af')}</g>`; };

  V['cs-pirate-hat'] = '48 20 104 60'; V['cs-wiz-hat'] = '56 -6 80 80'; V['cs-ninja-band'] = '54 56 112 50'; V['cs-knight-helm'] = '52 8 96 86'; V['cs-robot-antenna'] = '70 4 60 70';
  V['cs-rock-bandana'] = '52 54 112 50'; V['cs-beanie'] = '56 14 88 70'; V['cs-big-crown'] = '54 14 92 64';
  V['cs-pirate-patch'] = '60 86 86 50'; V['cs-ninja-mask'] = '56 90 92 40'; V['cs-robot-visor'] = '56 92 88 40'; V['cs-diver-mask'] = '48 70 112 56'; V['cs-rock-shades'] = '56 94 88 36';
  V['cs-parrot'] = '130 86 40 82'; V['cs-wiz-staff'] = '134 62 34 100'; V['cs-knight-shield'] = '20 98 48 70'; V['cs-guitar'] = '66 84 100 96';
  V['cs-scarf'] = '54 100 100 64'; V['cs-robot-pack'] = '38 88 124 70'; V['cs-scuba-tank'] = '34 64 132 86'; V['cs-fairy-wings'] = '18 80 164 90';

  root.MonsterCostumes.extend({ sets: SETS, items: ITEMS, hat: H, glasses: GL, accessory: AC, clothing: CL, backpack: BP, aura: AU, views: V });
})(typeof window !== 'undefined' ? window : this);
