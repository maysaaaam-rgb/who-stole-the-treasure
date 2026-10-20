/* Monster Costumes, batch 3: Halloween. 4 themed sets and 3 standalone pieces (12 pieces), all friendly and funny.
   Bought in the Classroom Store (or found in Mystery Boxes). Registers itself with MonsterCostumes.extend(). Drawn as SVG in the same way as batch 2. */
(function (root) {
  'use strict';
  if (!root.MonsterCostumes || !root.MonsterCostumes.extend) return;

  var SETS = {
    witch: { name: 'Friendly Witch', icon: '🧙‍♀️', title: 'Friendly Witch', pieces: ['cs-witch-hat', 'cs-witch-cape', 'cs-witch-broom'] },
    vampire: { name: 'Count Cuddles', icon: '🧛', title: 'Count Cuddles', pieces: ['cs-vamp-hair', 'cs-vamp-cape', 'cs-vamp-bat'] },
    mummy: { name: 'Bandage Buddy', icon: '🧻', title: 'Bandage Buddy', pieces: ['cs-mummy-wrap', 'cs-ghost-aura'] },
    pumpkin: { name: 'Pumpkin Patch', icon: '🎃', title: 'Pumpkin Pal', pieces: ['cs-pumpkin-cap', 'cs-skeleton-hoodie', 'cs-pumpkin-aura'] }
  };
  function it(id, name, category, sub, icon, rarity, desc, setId) {
    return { id: id, name: name, category: category, subCategory: sub, description: desc, icon: icon, unlockType: 'store',
      unlockRequirement: { label: 'Buy it in the Shop 🛒 or find it in a Mystery Box' }, rarity: rarity, status: 'active', setId: setId || null };
  }
  var ITEMS = [
    it('cs-witch-hat', 'Witch Hat', 'hat', 'hats', '🧙‍♀️', 'epic', 'A floppy purple witch hat with a gold buckle', 'witch'),
    it('cs-witch-cape', 'Witch Cape', 'backpack', 'backpacks', '🌙', 'rare', 'A purple cape with golden moons', 'witch'),
    it('cs-witch-broom', 'Flying Broom', 'accessory', 'accessories', '🧹', 'epic', 'A little broom that is ready to fly', 'witch'),
    it('cs-vamp-hair', 'Count Hair', 'hat', 'hats', '🧛', 'rare', 'Slicked-back hair with a funny peak', 'vampire'),
    it('cs-vamp-cape', 'Count Cape', 'backpack', 'backpacks', '🦇', 'epic', 'A black cape with a red lining', 'vampire'),
    it('cs-vamp-bat', 'Bat Buddy', 'accessory', 'accessories', '🦇', 'rare', 'A small purple bat on your shoulder', 'vampire'),
    it('cs-mummy-wrap', 'Mummy Wraps', 'clothing', 'costumes', '🧻', 'rare', 'Cream bandages wrapped round and round', 'mummy'),
    it('cs-ghost-aura', 'Friendly Ghosts', 'aura', 'auras', '👻', 'rare', 'Tiny smiling ghosts floating around you', 'mummy'),
    it('cs-pumpkin-cap', 'Pumpkin Cap', 'hat', 'hats', '🎃', 'common', 'A round pumpkin with a curly stem', 'pumpkin'),
    it('cs-skeleton-hoodie', 'Skeleton Hoodie', 'clothing', 'costumes', '💀', 'rare', 'A black hoodie with cream ribs', 'pumpkin'),
    it('cs-pumpkin-aura', 'Lantern Glow', 'aura', 'auras', '🏮', 'rare', 'Little pumpkin lanterns glowing around you', 'pumpkin'),
    it('cs-spider-friend', 'Spider Friend', 'accessory', 'accessories', '🕷️', 'common', 'A smiling spider hanging from a thread')
  ];
  var H = {}, AC = {}, CL = {}, BP = {}, AU = {}, V = {};
  function star(x, y, s, c) { return `<polygon points="${x},${y - s} ${x + s * 0.3},${y - s * 0.3} ${x + s},${y - s * 0.2} ${x + s * 0.45},${y + s * 0.25} ${x + s * 0.6},${y + s} ${x},${y + s * 0.55} ${x - s * 0.6},${y + s} ${x - s * 0.45},${y + s * 0.25} ${x - s},${y - s * 0.2} ${x - s * 0.3},${y - s * 0.3}" fill="${c}"/>`; }

  /* ---------------- hats ---------------- */
  H['cs-witch-hat'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><ellipse cx="100" cy="${t + 6}" rx="54" ry="10" fill="#3b0764" stroke="#1e1b4b" stroke-width="2.4"/>
      <path d="M74 ${t + 5} Q78 ${t - 28} 102 ${t - 52} Q112 ${t - 62} 126 ${t - 58} Q112 ${t - 46} 118 ${t - 24} Q124 ${t - 6} 126 ${t + 5} Z" fill="#6d28d9" stroke="#2e1065" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M75 ${t + 1} Q100 ${t - 7} 125 ${t + 1} L126 ${t + 8} Q100 ${t + 1} 74 ${t + 8} Z" fill="#111827" stroke="#030712" stroke-width="1.6"/>
      <rect x="93" y="${t - 3}" width="14" height="11" rx="2" fill="#fbbf24" stroke="#a16207" stroke-width="1.6"/><rect x="97" y="${t + 0.5}" width="6" height="4" fill="#111827"/>
      ${star(96, t - 26, 5, '#fde047')}<circle cx="108" cy="${t - 38}" r="2" fill="#fde68a"/><circle cx="88" cy="${t - 10}" r="1.8" fill="#fef9c3"/></g>`; };
  H['cs-vamp-hair'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><path d="M60 ${t + 16} Q56 ${t - 12} 100 ${t - 16} Q144 ${t - 12} 140 ${t + 16} Q128 ${t + 2} 112 ${t + 10} L100 ${t + 22} L88 ${t + 10} Q72 ${t + 2} 60 ${t + 16} Z" fill="#111827" stroke="#000" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M72 ${t - 2} Q100 ${t - 14} 128 ${t - 2}" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" opacity="0.8"/><path d="M96 ${t - 14} L100 ${t - 26} L104 ${t - 14}" fill="#111827" stroke="#000" stroke-width="1.8" stroke-linejoin="round"/></g>`; };
  H['cs-pumpkin-cap'] = function (g) { var t = g.topY;
    return `<g class="monster-hat"><ellipse cx="100" cy="${t + 6}" rx="46" ry="26" fill="#f97316" stroke="#9a3412" stroke-width="2.6"/><path d="M100 ${t - 20} Q82 ${t + 6} 100 ${t + 32} M100 ${t - 20} Q118 ${t + 6} 100 ${t + 32} M78 ${t - 12} Q58 ${t + 6} 78 ${t + 28} M122 ${t - 12} Q142 ${t + 6} 122 ${t + 28}" fill="none" stroke="#c2410c" stroke-width="2.2" opacity="0.8"/>
      <ellipse cx="86" cy="${t - 6}" rx="10" ry="6" fill="#fdba74" opacity="0.75"/><path d="M98 ${t - 20} Q96 ${t - 34} 104 ${t - 38} Q106 ${t - 30} 108 ${t - 20} Z" fill="#16a34a" stroke="#14532d" stroke-width="2" stroke-linejoin="round"/>
      <path d="M108 ${t - 28} Q122 ${t - 40} 126 ${t - 30} Q116 ${t - 30} 112 ${t - 24}" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/></g>`; };

  /* ---------------- accessories (held / on the shoulder) ---------------- */
  AC['cs-witch-broom'] = function () {
    return `<g class="monster-acc" transform="translate(150,96) rotate(18)"><rect x="-3" y="-8" width="6" height="74" rx="3" fill="#92400e" stroke="#451a03" stroke-width="1.8"/>
      <path d="M-14 64 L14 64 L22 96 Q0 104 -22 96 Z" fill="#ca8a04" stroke="#713f12" stroke-width="2" stroke-linejoin="round"/><path d="M-9 66 L-12 94 M-3 66 L-4 98 M3 66 L4 98 M9 66 L12 94" stroke="#713f12" stroke-width="1.6" stroke-linecap="round"/>
      <rect x="-14" y="62" width="28" height="7" rx="2" fill="#7c3aed" stroke="#3b0764" stroke-width="1.6"/></g>`; };
  AC['cs-vamp-bat'] = function () {
    return `<g class="monster-acc" transform="translate(132,100)"><path d="M-4 6 Q-26 -14 -34 4 Q-22 2 -16 12 Q-12 4 -4 8 Z" fill="#7c3aed" stroke="#3b0764" stroke-width="2" stroke-linejoin="round"/><path d="M14 6 Q36 -14 44 4 Q32 2 26 12 Q22 4 14 8 Z" fill="#7c3aed" stroke="#3b0764" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="5" cy="14" rx="12" ry="14" fill="#8b5cf6" stroke="#3b0764" stroke-width="2.2"/><path d="M-3 -2 L-5 -12 L3 -4 M13 -2 L15 -12 L7 -4" fill="#8b5cf6" stroke="#3b0764" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="0" cy="12" r="3.6" fill="#fff" stroke="#3b0764" stroke-width="1.2"/><circle cx="10" cy="12" r="3.6" fill="#fff" stroke="#3b0764" stroke-width="1.2"/><circle cx="0.6" cy="12.6" r="1.6" fill="#111827"/><circle cx="10.6" cy="12.6" r="1.6" fill="#111827"/>
      <path d="M1 20 L3 24 L5 20 M7 20 L9 24 L5 20" fill="#fff" stroke="#3b0764" stroke-width="1"/></g>`; };
  AC['cs-spider-friend'] = function () {
    return `<g class="monster-acc" transform="translate(150,70)"><path d="M0 -50 L0 0" stroke="#e5e7eb" stroke-width="1.6"/><ellipse cx="0" cy="12" rx="12" ry="11" fill="#1f2937" stroke="#000" stroke-width="2"/>
      <path d="M-10 8 Q-24 0 -22 -12 M-11 14 Q-26 14 -24 26 M10 8 Q24 0 22 -12 M11 14 Q26 14 24 26" fill="none" stroke="#111827" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="-4.5" cy="9" r="3.6" fill="#fff"/><circle cx="4.5" cy="9" r="3.6" fill="#fff"/><circle cx="-4" cy="9.6" r="1.7" fill="#111827"/><circle cx="5" cy="9.6" r="1.7" fill="#111827"/><path d="M-4 16 Q0 20 4 16" fill="none" stroke="#f9a8d4" stroke-width="1.6" stroke-linecap="round"/></g>`; };

  /* ---------------- clothing (drawn on the belly) ---------------- */
  var BELLY = 'M62 108 C58 130 64 146 80 150 L120 150 C136 146 142 130 138 108 C126 112 112 114 100 114 C88 114 74 112 62 108 Z';
  CL['cs-mummy-wrap'] = function () {
    return `<g class="monster-clothing"><path d="${BELLY}" fill="#f5f0d8" stroke="#a8a07a" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M62 114 L96 136 M62 124 L110 148 M72 110 L120 142 M92 112 L136 134 M112 112 L138 124 M70 146 L100 114" stroke="#c8bf94" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M62 114 L96 136 M72 110 L120 142" stroke="#fffdf2" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/><path d="M130 130 Q144 134 142 148 Q134 142 128 140" fill="#f5f0d8" stroke="#a8a07a" stroke-width="2" stroke-linejoin="round"/></g>`; };
  CL['cs-skeleton-hoodie'] = function () {
    return `<g class="monster-clothing"><path d="${BELLY}" fill="#1f2937" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M100 114 L100 148" stroke="#f1ead0" stroke-width="3.2" stroke-linecap="round"/><path d="M84 122 Q100 118 116 122 M82 130 Q100 126 118 130 M84 138 Q100 134 116 138" fill="none" stroke="#f1ead0" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M88 110 L86 126 M112 110 L114 126" stroke="#9ca3af" stroke-width="2.2" stroke-linecap="round"/><circle cx="86" cy="127" r="2.2" fill="#9ca3af"/><circle cx="114" cy="127" r="2.2" fill="#9ca3af"/></g>`; };

  /* ---------------- back gear (capes) ---------------- */
  BP['cs-witch-cape'] = function () {
    return `<g class="monster-backpack"><path d="M52 104 Q44 138 38 156 Q52 150 62 158 Q74 150 86 158 L114 158 Q126 150 138 158 Q148 150 162 156 Q156 138 148 104 Q124 112 100 112 Q76 112 52 104 Z" fill="#6d28d9" stroke="#2e1065" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M60 124 a6 6 0 1 0 7 7 a4.6 4.6 0 1 1 -7 -7 z" fill="#fde047"/><path d="M138 132 a5 5 0 1 0 6 6 a4 4 0 1 1 -6 -6 z" fill="#fde047"/>${star(100, 140, 5, '#fde68a')}<path d="M56 112 Q76 120 100 120" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.7"/></g>`; };
  BP['cs-vamp-cape'] = function () {
    return `<g class="monster-backpack"><path d="M50 100 Q40 136 34 158 L72 150 L100 160 L128 150 L166 158 Q160 136 150 100 Q124 110 100 110 Q76 110 50 100 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M54 102 Q46 134 42 152 L72 145 L100 154 L128 145 L158 152 Q154 134 146 102 Q124 114 100 114 Q76 114 54 102 Z" fill="#1f2937" stroke="#030712" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M58 108 Q80 118 100 118" fill="none" stroke="#64748b" stroke-width="2" opacity="0.7"/></g>`; };

  /* ---------------- auras ---------------- */
  function ghostBit(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-9 8 L-9 -4 Q-9 -14 0 -14 Q9 -14 9 -4 L9 8 Q6 5 3 8 Q0 5 -3 8 Q-6 5 -9 8 Z" fill="#fff" fill-opacity="0.92" stroke="#c7d2fe" stroke-width="1.4"/><circle cx="-3.2" cy="-5" r="1.5" fill="#111827"/><circle cx="3.2" cy="-5" r="1.5" fill="#111827"/><path d="M-2.5 -1 Q0 1.5 2.5 -1" fill="none" stroke="#111827" stroke-width="1.1" stroke-linecap="round"/><circle cx="-6" cy="-1" r="1.6" fill="#fda4af" opacity="0.7"/><circle cx="6" cy="-1" r="1.6" fill="#fda4af" opacity="0.7"/></g>`; }
  AU['cs-ghost-aura'] = function () { return `<g class="monster-aura">${ghostBit(36, 62, 1.1)}${ghostBit(166, 56, 0.9)}${ghostBit(28, 124, 0.8)}${ghostBit(172, 122, 1.0)}${ghostBit(100, 26, 0.8)}</g>`; };
  function lantern(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="0" cy="0" r="13" fill="#fb923c" fill-opacity="0.28"/><ellipse cx="0" cy="1" rx="9" ry="8" fill="#f97316" stroke="#9a3412" stroke-width="1.6"/><path d="M-1 -7 Q0 -12 3 -11" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/><path d="M-4 -1 L-2 -4 L0 -1 Z M2 -1 L4 -4 L6 -1 Z" fill="#fde047"/><path d="M-5 4 Q0 8 5 4" fill="none" stroke="#fde047" stroke-width="1.6" stroke-linecap="round"/></g>`; }
  AU['cs-pumpkin-aura'] = function () { return `<g class="monster-aura">${lantern(38, 60, 1.1)}${lantern(164, 66, 1.0)}${lantern(30, 120, 0.8)}${lantern(170, 126, 0.9)}${lantern(100, 24, 0.8)}</g>`; };

  V['cs-witch-hat'] = '44 -4 112 78'; V['cs-vamp-hair'] = '52 4 96 60'; V['cs-pumpkin-cap'] = '50 0 100 70'; V['cs-witch-broom'] = '128 90 56 120'; V['cs-vamp-bat'] = '90 86 80 50';
  V['cs-spider-friend'] = '120 20 60 70'; V['cs-mummy-wrap'] = '54 104 92 50'; V['cs-skeleton-hoodie'] = '54 104 92 50'; V['cs-witch-cape'] = '30 96 140 66'; V['cs-vamp-cape'] = '28 94 144 70';
  root.MonsterCostumes.extend({ sets: SETS, items: ITEMS, hat: H, accessory: AC, clothing: CL, backpack: BP, aura: AU, views: V });
})(typeof window !== 'undefined' ? window : this);
