/* Monster Costumes: 8 themed sets x 3 pieces (24 new drawn items).
   Sold in the Classroom Store (and found in Mystery Boxes). Drawn in the same flat plush style as the other monster items.
   The renderer calls the hooks at the bottom (foreground, clothing, backpack, aura, thumbnail). No filters or gradients from the page
   are needed, so the same drawings also work as small shop icons. */
(function (root) {
  'use strict';

  var SETS = {
    chuseok:   { name: 'Chuseok Star',    icon: '🌕', title: 'Chuseok Star',    pieces: ['cs-gat', 'cs-hanbok', 'cs-lantern'] },
    space:     { name: 'Space Explorer',  icon: '🚀', title: 'Space Explorer',  pieces: ['cs-space-helmet', 'cs-space-suit', 'cs-jetpack'] },
    ranger:    { name: 'Forest Ranger',   icon: '🌲', title: 'Forest Ranger',   pieces: ['cs-ranger-hat', 'cs-binoculars', 'cs-leaf-cape'] },
    detective: { name: 'Detective',       icon: '🕵️', title: 'Super Detective', pieces: ['cs-detective-cap', 'cs-trench', 'cs-magnifier'] },
    chef:      { name: 'Chef Monster',    icon: '👨‍🍳', title: 'Master Chef',     pieces: ['cs-chef-hat', 'cs-apron', 'cs-ladle'] },
    hero:      { name: 'Superhero',       icon: '🦸', title: 'Super Hero',      pieces: ['cs-hero-mask', 'cs-hero-suit', 'cs-hero-cape'] },
    pyjama:    { name: 'Pyjama Party',    icon: '🌙', title: 'Sleepy Star',     pieces: ['cs-night-cap', 'cs-pyjamas', 'cs-teddy'] },
    sports:    { name: 'Sports Day',      icon: '🏅', title: 'Sports Champion', pieces: ['cs-headband', 'cs-sport-shirt', 'cs-medal'] }
  };

  function it(id, name, category, sub, icon, rarity, desc, setId) {
    return {
      id: id, name: name, category: category, subCategory: sub, description: desc, icon: icon,
      unlockType: 'store', unlockRequirement: { label: 'Buy it in the Shop 🛒 or find it in a Mystery Box' },
      rarity: rarity, status: 'active', setId: setId
    };
  }
  var ITEMS = [
    it('cs-gat', 'Traditional Gat Hat', 'hat', 'hats', '🎩', 'rare', 'A black hat with a wide brim, worn for Chuseok', 'chuseok'),
    it('cs-hanbok', 'Chuseok Hanbok', 'clothing', 'costumes', '👘', 'epic', 'A pink and blue hanbok for the harvest festival', 'chuseok'),
    it('cs-lantern', 'Moon Lanterns', 'aura', 'auras', '🏮', 'epic', 'Warm lanterns that float under the full moon', 'chuseok'),
    it('cs-space-helmet', 'Space Helmet', 'hat', 'hats', '👨‍🚀', 'epic', 'A glass bubble helmet for long space trips', 'space'),
    it('cs-space-suit', 'Space Suit', 'clothing', 'costumes', '🧑‍🚀', 'epic', 'A white suit with an orange stripe and a mission patch', 'space'),
    it('cs-jetpack', 'Rocket Jetpack', 'backpack', 'backpacks', '🚀', 'legendary', 'Two silver rockets for super fast flying', 'space'),
    it('cs-ranger-hat', 'Ranger Hat', 'hat', 'hats', '🤠', 'rare', 'A wide hat with a green band and a red feather', 'ranger'),
    it('cs-binoculars', 'Ranger Binoculars', 'glasses', 'accessories', '🔭', 'rare', 'Spot animals from far away', 'ranger'),
    it('cs-leaf-cape', 'Leaf Cape', 'backpack', 'backpacks', '🍃', 'epic', 'A green cape made of forest leaves', 'ranger'),
    it('cs-detective-cap', 'Detective Cap', 'hat', 'hats', '🧢', 'rare', 'A checked cap with two little peaks', 'detective'),
    it('cs-trench', 'Trench Coat', 'clothing', 'costumes', '🧥', 'epic', 'A long tan coat with a belt', 'detective'),
    it('cs-magnifier', 'Magnifying Glass', 'accessory', 'accessories', '🔍', 'rare', 'Find every clue', 'detective'),
    it('cs-chef-hat', 'Chef Hat', 'hat', 'hats', '👨‍🍳', 'common', 'A tall white chef hat', 'chef'),
    it('cs-apron', 'Chef Apron', 'clothing', 'costumes', '🍳', 'common', 'A white apron with a big pocket', 'chef'),
    it('cs-ladle', 'Golden Ladle', 'accessory', 'accessories', '🥄', 'rare', 'Stir the soup like a master chef', 'chef'),
    it('cs-hero-mask', 'Hero Mask', 'glasses', 'accessories', '🎭', 'rare', 'A blue mask with star corners', 'hero'),
    it('cs-hero-suit', 'Hero Suit', 'clothing', 'costumes', '🦸', 'epic', 'A blue suit with a red star badge', 'hero'),
    it('cs-hero-cape', 'Hero Cape', 'backpack', 'backpacks', '🦸‍♂️', 'epic', 'A flowing red cape with a gold clasp', 'hero'),
    it('cs-night-cap', 'Sleepy Night Cap', 'hat', 'hats', '😴', 'common', 'A striped cap with a fluffy pom-pom', 'pyjama'),
    it('cs-pyjamas', 'Star Pyjamas', 'clothing', 'costumes', '🌟', 'rare', 'Soft striped pyjamas with little stars', 'pyjama'),
    it('cs-teddy', 'Teddy Bear', 'accessory', 'accessories', '🧸', 'rare', 'A cuddly friend for bedtime', 'pyjama'),
    it('cs-headband', 'Sports Headband', 'hat', 'hats', '🏃', 'common', 'A red headband with a white stripe', 'sports'),
    it('cs-sport-shirt', 'Team Shirt', 'clothing', 'costumes', '👕', 'rare', 'A red team shirt with a white V neck', 'sports'),
    it('cs-medal', 'Gold Medal', 'accessory', 'accessories', '🥇', 'rare', 'For the champion of Sports Day', 'sports')
  ];
  var BY_ID = {};
  ITEMS.forEach(function (i) { BY_ID[i.id] = i; });

  /* ---------------- hats: sit on the crown (topY) ---------------- */
  function hatSvg0(id, g) {
    var t = g.topY, e = g.eyeY, c = g.cheekY;
    switch (id) {
      case 'cs-gat':
        return '<g class="monster-hat"><ellipse cx="100" cy="' + (t + 3) + '" rx="46" ry="9" fill="#1f2937" stroke="#030712" stroke-width="2"/>' +
          '<path d="M82 ' + (t + 1) + ' L84 ' + (t - 26) + ' Q100 ' + (t - 32) + ' 116 ' + (t - 26) + ' L118 ' + (t + 1) + ' Z" fill="#374151" stroke="#030712" stroke-width="2"/>' +
          '<ellipse cx="100" cy="' + (t - 26) + '" rx="16" ry="4" fill="#4b5563" stroke="#030712" stroke-width="1.5"/>' +
          '<path d="M88 ' + (t - 20) + ' L88 ' + (t - 2) + ' M100 ' + (t - 22) + ' L100 ' + (t - 2) + ' M112 ' + (t - 20) + ' L112 ' + (t - 2) + '" stroke="#6b7280" stroke-width="1.2" opacity="0.7"/>' +
          '<path d="M56 ' + (t + 8) + ' Q60 ' + (c - 6) + ' 76 ' + (e + 30) + ' M144 ' + (t + 8) + ' Q140 ' + (c - 6) + ' 124 ' + (e + 30) + '" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/></g>';
      case 'cs-space-helmet': {
        var top = t - 9, bot = e + 34, cy = (top + bot) / 2, ry = (bot - top) / 2;
        return '<g class="monster-hat"><ellipse cx="100" cy="' + cy + '" rx="55" ry="' + ry + '" fill="#bae6fd" fill-opacity="0.3" stroke="#7dd3fc" stroke-width="3.5"/>' +
          '<path d="M64 ' + (cy - ry * 0.55) + ' Q74 ' + (cy - ry * 0.9) + ' 92 ' + (cy - ry * 0.95) + '" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.75"/>' +
          '<circle cx="62" cy="' + (cy - ry * 0.25) + '" r="2.4" fill="#fff" opacity="0.8"/>' +
          '<rect x="50" y="' + (bot - 6) + '" width="100" height="11" rx="5" fill="#94a3b8" stroke="#475569" stroke-width="2.4"/>' +
          '<circle cx="62" cy="' + (bot - 0.5) + '" r="2.2" fill="#ef4444"/><circle cx="138" cy="' + (bot - 0.5) + '" r="2.2" fill="#22c55e"/>' +
          '<rect x="140" y="' + (top + 6) + '" width="4" height="16" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/><circle cx="142" cy="' + (top + 4) + '" r="3.4" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/></g>';
      }
      case 'cs-ranger-hat':
        return '<g class="monster-hat"><ellipse cx="100" cy="' + (t + 4) + '" rx="47" ry="9.5" fill="#a16207" stroke="#422006" stroke-width="2"/>' +
          '<path d="M72 ' + (t + 2) + ' Q74 ' + (t - 22) + ' 100 ' + (t - 24) + ' Q126 ' + (t - 22) + ' 128 ' + (t + 2) + ' Z" fill="#ca8a04" stroke="#422006" stroke-width="2"/>' +
          '<path d="M73 ' + (t - 4) + ' Q100 ' + (t + 3) + ' 127 ' + (t - 4) + ' L127 ' + (t - 11) + ' Q100 ' + (t - 5) + ' 73 ' + (t - 11) + ' Z" fill="#15803d" stroke="#14532d" stroke-width="1.6"/>' +
          '<path d="M120 ' + (t - 8) + ' Q140 ' + (t - 26) + ' 134 ' + (t - 34) + ' Q124 ' + (t - 24) + ' 118 ' + (t - 10) + ' Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.4"/></g>';
      case 'cs-detective-cap':
        return '<g class="monster-hat"><path d="M66 ' + (t + 6) + ' Q68 ' + (t - 24) + ' 100 ' + (t - 26) + ' Q132 ' + (t - 24) + ' 134 ' + (t + 6) + ' Z" fill="#a8896a" stroke="#451a03" stroke-width="2"/>' +
          '<path d="M72 ' + (t - 14) + ' L128 ' + (t - 14) + ' M70 ' + (t - 5) + ' L130 ' + (t - 5) + ' M86 ' + (t - 24) + ' L84 ' + (t + 5) + ' M100 ' + (t - 26) + ' L100 ' + (t + 5) + ' M114 ' + (t - 24) + ' L116 ' + (t + 5) + '" stroke="#78350f" stroke-width="1.6" opacity="0.65"/>' +
          '<path d="M60 ' + (t + 8) + ' Q80 ' + (t + 16) + ' 100 ' + (t + 8) + ' L84 ' + (t + 2) + ' Z" fill="#78350f" stroke="#451a03" stroke-width="1.6"/>' +
          '<path d="M140 ' + (t + 8) + ' Q120 ' + (t + 16) + ' 100 ' + (t + 8) + ' L116 ' + (t + 2) + ' Z" fill="#78350f" stroke="#451a03" stroke-width="1.6"/>' +
          '<circle cx="100" cy="' + (t - 27) + '" r="3.4" fill="#78350f" stroke="#451a03" stroke-width="1.2"/></g>';
      case 'cs-chef-hat':
        return '<g class="monster-hat"><circle cx="82" cy="' + (t - 12) + '" r="15" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>' +
          '<circle cx="118" cy="' + (t - 12) + '" r="15" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>' +
          '<circle cx="100" cy="' + (t - 22) + '" r="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>' +
          '<rect x="74" y="' + (t - 7) + '" width="52" height="15" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>' +
          '<path d="M86 ' + (t - 4) + ' L86 ' + (t + 6) + ' M100 ' + (t - 4) + ' L100 ' + (t + 6) + ' M114 ' + (t - 4) + ' L114 ' + (t + 6) + '" stroke="#e2e8f0" stroke-width="2"/></g>';
      case 'cs-night-cap':
        return '<g class="monster-hat"><path d="M68 ' + (t + 6) + ' Q72 ' + (t - 24) + ' 104 ' + (t - 22) + ' Q130 ' + (t - 20) + ' 146 ' + (t + 22) + ' Q130 ' + (t + 6) + ' 132 ' + (t + 6) + ' Z" fill="#60a5fa" stroke="#1e3a8a" stroke-width="2"/>' +
          '<path d="M76 ' + (t - 10) + ' Q100 ' + (t - 2) + ' 128 ' + (t - 8) + ' M72 ' + (t - 1) + ' Q100 ' + (t + 6) + ' 130 ' + (t) + '" fill="none" stroke="#dbeafe" stroke-width="4" opacity="0.85"/>' +
          '<rect x="64" y="' + (t) + '" width="72" height="11" rx="5.5" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>' +
          '<circle cx="146" cy="' + (t + 24) + '" r="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/></g>';
      case 'cs-headband':
        return '<g class="monster-hat"><path d="M62 ' + (t + 20) + ' Q100 ' + (t + 6) + ' 138 ' + (t + 20) + ' L138 ' + (t + 30) + ' Q100 ' + (t + 16) + ' 62 ' + (t + 30) + ' Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/>' +
          '<path d="M64 ' + (t + 24) + ' Q100 ' + (t + 10) + ' 136 ' + (t + 24) + '" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.9"/>' +
          '<path d="M138 ' + (t + 24) + ' L152 ' + (t + 18) + ' L148 ' + (t + 30) + ' Z M138 ' + (t + 26) + ' L150 ' + (t + 36) + ' L142 ' + (t + 34) + ' Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.6" stroke-linejoin="round"/></g>';
    }
    return '';
  }

  /* ---------------- glasses: centred on the eyes ---------------- */
  function glassesSvg0(id, g) {
    var y = g.eyeY, s = g.eyeSpacing;
    if (id === 'cs-binoculars') {
      return '<g class="monster-glasses"><rect x="' + (100 - 6) + '" y="' + (y - 4) + '" width="12" height="8" rx="3" fill="#475569" stroke="#0f172a" stroke-width="1.6"/>' +
        '<circle cx="' + (100 - s) + '" cy="' + y + '" r="12.5" fill="#334155" stroke="#0f172a" stroke-width="2.4"/><circle cx="' + (100 + s) + '" cy="' + y + '" r="12.5" fill="#334155" stroke="#0f172a" stroke-width="2.4"/>' +
        '<circle cx="' + (100 - s) + '" cy="' + y + '" r="8.4" fill="#38bdf8" stroke="#0369a1" stroke-width="1.4"/><circle cx="' + (100 + s) + '" cy="' + y + '" r="8.4" fill="#38bdf8" stroke="#0369a1" stroke-width="1.4"/>' +
        '<circle cx="' + (100 - s - 3) + '" cy="' + (y - 3) + '" r="2.6" fill="#ffffff" opacity="0.85"/><circle cx="' + (100 + s - 3) + '" cy="' + (y - 3) + '" r="2.6" fill="#ffffff" opacity="0.85"/>' +
        '<path d="M' + (100 - s - 12) + ' ' + (y - 2) + ' L52 ' + (y - 14) + ' M' + (100 + s + 12) + ' ' + (y - 2) + ' L148 ' + (y - 14) + '" stroke="#475569" stroke-width="2.4" stroke-linecap="round"/></g>';
    }
    if (id === 'cs-hero-mask') {
      var w = s + 17, h = 11.5;
      return '<g class="monster-glasses"><path fill-rule="evenodd" d="M' + (100 - w) + ' ' + (y - 2) + ' Q' + (100 - w - 3) + ' ' + (y - 14) + ' ' + (100 - w + 10) + ' ' + (y - 14) + ' Q100 ' + (y - 10) + ' ' + (100 + w - 10) + ' ' + (y - 14) + ' Q' + (100 + w + 3) + ' ' + (y - 14) + ' ' + (100 + w) + ' ' + (y - 2) + ' Q' + (100 + w) + ' ' + (y + h) + ' ' + (100 + w - 12) + ' ' + (y + h) + ' Q100 ' + (y + h - 4) + ' ' + (100 - w + 12) + ' ' + (y + h) + ' Q' + (100 - w) + ' ' + (y + h) + ' ' + (100 - w) + ' ' + (y - 2) + ' Z ' +
        'M' + (100 - s - 8) + ' ' + y + ' a8 7 0 1 0 16 0 a8 7 0 1 0 -16 0 Z M' + (100 + s - 8) + ' ' + y + ' a8 7 0 1 0 16 0 a8 7 0 1 0 -16 0 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="2"/>' +
        '<polygon points="' + (100 - w + 2) + ',' + (y - 15) + ' ' + (100 - w - 4) + ',' + (y - 21) + ' ' + (100 - w + 7) + ',' + (y - 19) + '" fill="#facc15" stroke="#a16207" stroke-width="1.2"/>' +
        '<polygon points="' + (100 + w - 2) + ',' + (y - 15) + ' ' + (100 + w + 4) + ',' + (y - 21) + ' ' + (100 + w - 7) + ',' + (y - 19) + '" fill="#facc15" stroke="#a16207" stroke-width="1.2"/></g>';
    }
    return '';
  }

  /* ---------------- accessories: held or worn on the chest ---------------- */
  function accessorySvg0(id) {
    switch (id) {
      case 'cs-magnifier':
        return '<g class="monster-acc" transform="translate(136,108)"><line x1="14" y1="16" x2="30" y2="38" stroke="#78350f" stroke-width="6" stroke-linecap="round"/><line x1="14" y1="16" x2="30" y2="38" stroke="#a16207" stroke-width="2.4" stroke-linecap="round"/>' +
          '<circle cx="8" cy="8" r="14" fill="#bae6fd" fill-opacity="0.5" stroke="#92400e" stroke-width="4"/><path d="M-1 2 Q2 -4 9 -4" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.9"/></g>';
      case 'cs-ladle':
        return '<g class="monster-acc" transform="translate(140,96)"><rect x="6" y="0" width="5" height="42" rx="2.5" fill="#fbbf24" stroke="#a16207" stroke-width="1.6"/>' +
          '<path d="M-4 40 Q8 62 22 40 Z" fill="#fcd34d" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/><ellipse cx="9" cy="40" rx="13" ry="3.4" fill="#fde68a" stroke="#a16207" stroke-width="1.4"/><circle cx="8.5" cy="-1" r="3.4" fill="#fbbf24" stroke="#a16207" stroke-width="1.4"/></g>';
      case 'cs-teddy':
        return '<g class="monster-acc" transform="translate(30,112)"><ellipse cx="14" cy="30" rx="12" ry="13" fill="#b45309" stroke="#78350f" stroke-width="2"/>' +
          '<circle cx="14" cy="12" r="11" fill="#c2701c" stroke="#78350f" stroke-width="2"/><circle cx="6" cy="4" r="4.5" fill="#c2701c" stroke="#78350f" stroke-width="2"/><circle cx="22" cy="4" r="4.5" fill="#c2701c" stroke="#78350f" stroke-width="2"/>' +
          '<ellipse cx="14" cy="15" rx="5.5" ry="4.2" fill="#fcd9a0" stroke="#78350f" stroke-width="1.2"/><circle cx="11" cy="10" r="1.7" fill="#1f2937"/><circle cx="17" cy="10" r="1.7" fill="#1f2937"/><ellipse cx="14" cy="14" rx="1.8" ry="1.3" fill="#1f2937"/>' +
          '<ellipse cx="2" cy="28" rx="4" ry="6" fill="#b45309" stroke="#78350f" stroke-width="1.6"/><ellipse cx="26" cy="28" rx="4" ry="6" fill="#b45309" stroke="#78350f" stroke-width="1.6"/>' +
          '<path d="M6 21 Q14 25 22 21 L20 24 Q14 27 8 24 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/></g>';
      case 'cs-medal':   // ribbon starts under the mouth (it used to start at eye level), medal rests on the belly
        return '<g class="monster-acc"><path d="M86 125 L100 140 L114 125 L108 124 L100 133 L92 124 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.6" stroke-linejoin="round"/>' +
          '<path d="M92 124 L100 133 L98 135 L87 125 Z" fill="#2563eb" opacity="0.85"/>' +
          '<circle cx="100" cy="144" r="8.5" fill="#facc15" stroke="#a16207" stroke-width="2"/><circle cx="100" cy="144" r="5.6" fill="none" stroke="#fde68a" stroke-width="1.2"/>' +
          '<polygon transform="translate(100 144) scale(0.85) translate(-100 -140)" points="100,134.5 101.8,138.4 106,138.8 102.8,141.6 103.8,145.6 100,143.4 96.2,145.6 97.2,141.6 94,138.8 98.2,138.4" fill="#f59e0b" stroke="#a16207" stroke-width="0.8"/></g>';
    }
    return '';
  }

  /* ---------------- clothing: drawn over the torso ---------------- */
  function clothingSvg0(id) {
    switch (id) {
      case 'cs-hanbok':
        return '<g class="monster-clothing"><path d="M64 110 C62 128 66 142 80 148 L120 148 C134 142 138 128 136 110 C126 106 112 108 100 118 C88 108 74 106 64 110 Z" fill="#fb7185" stroke="#9f1239" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M64 112 C76 106 88 110 100 124 C112 110 124 106 136 112 L136 118 C124 112 112 116 100 130 C88 116 76 112 64 118 Z" fill="#ffffff" stroke="#9f1239" stroke-width="1.8" stroke-linejoin="round"/>' +
          '<path d="M62 132 Q100 140 138 132 L138 138 Q100 146 62 138 Z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2" stroke-linejoin="round"/>' +
          '<path d="M100 124 Q92 128 88 138 Q96 134 100 128 Q104 134 112 138 Q108 128 100 124 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.6" stroke-linejoin="round"/><circle cx="100" cy="127" r="2.8" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1"/></g>';
      case 'cs-space-suit':
        return '<g class="monster-clothing"><path d="M64 108 C60 128 66 144 80 148 L120 148 C134 144 140 128 136 108 C124 112 112 114 100 114 C88 114 76 112 64 108 Z" fill="#f1f5f9" stroke="#475569" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M66 124 Q100 132 134 124 L134 130 Q100 138 66 130 Z" fill="#fb923c" stroke="#9a3412" stroke-width="1.6"/>' +
          '<rect x="86" y="114" width="28" height="16" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="1.8"/><circle cx="93" cy="122" r="2.6" fill="#ef4444"/><circle cx="100" cy="122" r="2.6" fill="#22c55e"/><circle cx="107" cy="122" r="2.6" fill="#3b82f6"/>' +
          '<rect x="68" y="108" width="64" height="6" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="1.6"/><circle cx="74" cy="138" r="5" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.4"/><polygon points="74,134.5 75.2,137.2 78,137.4 75.8,139.2 76.6,142 74,140.4 71.4,142 72.2,139.2 70,137.4 72.8,137.2" fill="#fde047"/></g>';
      case 'cs-trench':
        return '<g class="monster-clothing"><path d="M62 108 C58 130 64 146 78 150 L122 150 C136 146 142 130 138 108 L124 106 L100 126 L76 106 Z" fill="#c8a574" stroke="#5b3a1b" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M76 106 L66 96 L84 100 L100 126 Z" fill="#d6b48a" stroke="#5b3a1b" stroke-width="2" stroke-linejoin="round"/><path d="M124 106 L134 96 L116 100 L100 126 Z" fill="#d6b48a" stroke="#5b3a1b" stroke-width="2" stroke-linejoin="round"/>' +
          '<rect x="62" y="128" width="76" height="8" rx="3" fill="#92400e" stroke="#451a03" stroke-width="1.8"/><rect x="95" y="126" width="10" height="12" rx="2" fill="#fbbf24" stroke="#a16207" stroke-width="1.6"/>' +
          '<circle cx="92" cy="116" r="2" fill="#78350f"/><circle cx="108" cy="116" r="2" fill="#78350f"/><circle cx="92" cy="142" r="2" fill="#78350f"/><circle cx="108" cy="142" r="2" fill="#78350f"/></g>';
      case 'cs-apron':
        return '<g class="monster-clothing"><path d="M84 106 L78 118 L72 150 L128 150 L122 118 L116 106 Q100 114 84 106 Z" fill="#ffffff" stroke="#64748b" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<path d="M84 106 L74 98 M116 106 L126 98" stroke="#64748b" stroke-width="2.4" stroke-linecap="round"/>' +
          '<path d="M78 122 Q100 130 122 122" fill="none" stroke="#fda4af" stroke-width="3"/><rect x="86" y="132" width="28" height="14" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.8"/>' +
          '<path d="M96 138 L104 138 M100 134 L100 142" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M72 122 Q64 124 62 132 M128 122 Q136 124 138 132" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round"/></g>';
      case 'cs-hero-suit':
        return '<g class="monster-clothing"><path d="M64 108 C60 128 66 144 80 148 L120 148 C134 144 140 128 136 108 C124 112 112 114 100 114 C88 114 76 112 64 108 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M100 114 L82 120 L86 138 L100 146 L114 138 L118 120 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" stroke-linejoin="round"/>' +
          '<polygon points="100,121 102.8,127.6 110,128.2 104.6,132.8 106.4,139.8 100,136 93.6,139.8 95.4,132.8 90,128.2 97.2,127.6" fill="#facc15" stroke="#a16207" stroke-width="1.2"/>' +
          '<rect x="64" y="140" width="72" height="7" rx="3" fill="#facc15" stroke="#a16207" stroke-width="1.6"/></g>';
      case 'cs-pyjamas':
        return '<g class="monster-clothing"><path d="M64 108 C60 128 66 144 80 148 L120 148 C134 144 140 128 136 108 C124 112 112 114 100 114 C88 114 76 112 64 108 Z" fill="#bfdbfe" stroke="#1e3a8a" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M64 120 Q100 128 136 120 L135 126 Q100 134 65 126 Z M64 134 Q100 142 136 134 L134 140 Q100 148 66 140 Z" fill="#ffffff" opacity="0.85"/>' +
          '<path d="M86 110 L100 128 L114 110 L108 108 L100 118 L92 108 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1.6" stroke-linejoin="round"/>' +
          '<circle cx="100" cy="130" r="2.4" fill="#1e3a8a"/><circle cx="100" cy="141" r="2.4" fill="#1e3a8a"/>' +
          '<polygon points="76,134 77.2,137 80.4,137.2 77.9,139.2 78.8,142.2 76,140.5 73.2,142.2 74.1,139.2 71.6,137.2 74.8,137" fill="#fde047"/></g>';
      case 'cs-sport-shirt':
        return '<g class="monster-clothing"><path d="M64 108 C60 128 66 144 80 148 L120 148 C134 144 140 128 136 108 C124 112 112 114 100 114 C88 114 76 112 64 108 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M84 110 L100 130 L116 110 L110 108 L100 120 L90 108 Z" fill="#ffffff" stroke="#7f1d1d" stroke-width="1.8" stroke-linejoin="round"/>' +
          '<path d="M64 118 L61 138 M136 118 L139 138" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>' +
          '<polygon points="100,134 102.4,139.4 108,140 103.8,143.6 105,149 100,146.2 95,149 96.2,143.6 92,140 97.6,139.4" fill="#ffffff" opacity="0.95"/></g>';
    }
    return '';
  }

  /* ---------------- back gear: behind the body ---------------- */
  function backpackSvg0(id) {
    switch (id) {
      case 'cs-jetpack':
        return '<g class="monster-backpack">' +
          '<rect x="46" y="100" width="18" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2.4"/><rect x="136" y="100" width="18" height="40" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2.4"/>' +
          '<rect x="46" y="112" width="18" height="6" fill="#ef4444"/><rect x="136" y="112" width="18" height="6" fill="#ef4444"/>' +
          '<path d="M48 140 L62 140 L58 150 L52 150 Z M138 140 L152 140 L148 150 L142 150 Z" fill="#64748b" stroke="#334155" stroke-width="1.6"/>' +
          '<path d="M55 150 Q50 162 55 170 Q60 162 55 150 Z M145 150 Q140 162 145 170 Q150 162 145 150 Z" fill="#fb923c" stroke="#c2410c" stroke-width="1.4"/>' +
          '<path d="M55 152 Q53 160 55 164 Q57 160 55 152 Z M145 152 Q143 160 145 164 Q147 160 145 152 Z" fill="#fde047"/></g>';
      case 'cs-leaf-cape':
        return '<g class="monster-backpack"><path d="M64 106 L40 156 Q100 170 160 156 L136 106 Z" fill="#22c55e" stroke="#14532d" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<path d="M50 150 Q58 134 70 130 Q70 146 50 150 Z M150 150 Q142 134 130 130 Q130 146 150 150 Z M96 160 Q86 146 94 132 Q106 146 96 160 Z M114 160 Q112 146 122 138 Q128 152 114 160 Z M76 158 Q72 142 80 134 Q90 146 76 158 Z" fill="#4ade80" stroke="#166534" stroke-width="1.5"/>' +
          '<path d="M60 150 L70 134 M96 158 L94 138 M144 150 L132 134" stroke="#166534" stroke-width="1.2" fill="none"/></g>';
      case 'cs-hero-cape':
        return '<g class="monster-backpack"><path d="M66 106 L36 160 Q100 172 164 160 L134 106 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<path d="M70 110 L48 154 Q70 160 82 156 L84 112 Z" fill="#b91c1c" opacity="0.7"/>' +
          '<circle cx="70" cy="106" r="5.4" fill="#facc15" stroke="#a16207" stroke-width="1.8"/><circle cx="130" cy="106" r="5.4" fill="#facc15" stroke="#a16207" stroke-width="1.8"/></g>';
    }
    return '';
  }

  /* ---------------- aura: floating decoration around the monster ---------------- */
  function auraSvg0(id) {
    if (id === 'cs-lantern') {
      function lamp(x, y, s) {
        return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><circle cx="0" cy="0" r="16" fill="#fdba74" opacity="0.28"/>' +
          '<line x1="0" y1="-16" x2="0" y2="-10" stroke="#78350f" stroke-width="1.6"/><ellipse cx="0" cy="-10" rx="5" ry="2" fill="#92400e"/>' +
          '<ellipse cx="0" cy="0" rx="10" ry="12" fill="#f97316" stroke="#9a3412" stroke-width="1.6"/><ellipse cx="0" cy="0" rx="6" ry="12" fill="#fb923c" opacity="0.8"/>' +
          '<path d="M-9 -4 Q0 -7 9 -4 M-9 4 Q0 7 9 4" fill="none" stroke="#9a3412" stroke-width="1" opacity="0.7"/>' +
          '<rect x="-4" y="11" width="8" height="2.6" rx="1" fill="#92400e"/><path d="M-2 13 L-3 21 M0 13 L0 22 M2 13 L3 21" stroke="#dc2626" stroke-width="1.4" stroke-linecap="round"/></g>';
      }
      return '<g class="monster-aura"><circle cx="156" cy="52" r="15" fill="#fef9c3" opacity="0.92"/><circle cx="150" cy="48" r="13" fill="#fef08a" opacity="0.8"/>' +
        lamp(38, 76, 1) + lamp(164, 98, 0.9) + lamp(48, 126, 0.75) +
        '<polygon points="100,22 101.8,26.4 106.6,26.8 103,30 104.2,34.8 100,32.2 95.8,34.8 97,30 93.4,26.8 98.2,26.4" fill="#fde047" opacity="0.9"/></g>';
    }
    return '';
  }


  /* ---- extension point: js/monster-costumes2.js registers more drawings here ---- */
  var EXT = { hat: {}, glasses: {}, accessory: {}, clothing: {}, backpack: {}, aura: {}, views: {} };
  function hatSvg(id, g) { return EXT.hat[id] ? EXT.hat[id](g) : hatSvg0(id, g); }
  function glassesSvg(id, g) { return EXT.glasses[id] ? EXT.glasses[id](g) : glassesSvg0(id, g); }
  function accessorySvg(id) { return EXT.accessory[id] ? EXT.accessory[id]() : accessorySvg0(id); }
  function clothingSvg(id) { return EXT.clothing[id] ? EXT.clothing[id]() : clothingSvg0(id); }
  function backpackSvg(id) { return EXT.backpack[id] ? EXT.backpack[id]() : backpackSvg0(id); }
  function auraSvg(id) { return EXT.aura[id] ? EXT.aura[id]() : auraSvg0(id); }

  /* ---------------- small shop / dress-up icons ---------------- */
  var VIEW = { hat: '50 8 100 78', glasses: '56 78 88 50', accessory: '20 80 160 90', clothing: '54 92 92 66', backpack: '30 92 140 84', aura: '10 10 180 160' };
  var VIEW_BY_ID = { 'cs-magnifier': '122 98 60 58', 'cs-ladle': '128 90 48 82', 'cs-teddy': '22 104 52 56', 'cs-medal': '66 96 68 60', 'cs-space-helmet': '40 40 120 110', 'cs-chef-hat': '56 12 88 70', 'cs-night-cap': '56 18 100 80', 'cs-headband': '50 54 110 56', 'cs-binoculars': '46 90 108 40', 'cs-hero-mask': '62 90 76 40' };
  function thumbnail(item, size) {
    var cat = item.category, id = item.id, g = { topY: 62, eyeY: 112, eyeSpacing: 16.5, cheekY: 100 }, body = '';
    if (cat === 'hat') body = hatSvg(id, g);
    else if (cat === 'glasses') body = glassesSvg(id, g);
    else if (cat === 'accessory') body = accessorySvg(id);
    else if (cat === 'clothing') body = clothingSvg(id);
    else if (cat === 'backpack') body = backpackSvg(id);
    else if (cat === 'aura') body = auraSvg(id);
    if (!body) return null;
    var vb = EXT.views[id] || VIEW_BY_ID[id] || VIEW[cat] || '0 0 200 200', p = vb.split(' ').map(Number);
    var back = '<rect x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" rx="' + Math.round(Math.min(p[2], p[3]) * 0.18) + '" fill="' + (cat === 'aura' ? '#3b3a7a' : '#dbeafe') + '"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (size || 56) + '" height="' + (size || 56) + '" viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible">' + back + body + '</svg>';
  }

  root.MonsterCostumes = {
    /** Register more costumes: { sets, items, hat, glasses, accessory, clothing, backpack, aura, views } */
    extend: function (x) {
      Object.keys(x.sets || {}).forEach(function (k) { SETS[k] = x.sets[k]; });
      (x.items || []).forEach(function (i) { if (!BY_ID[i.id]) { ITEMS.push(i); BY_ID[i.id] = i; } });
      ['hat', 'glasses', 'accessory', 'clothing', 'backpack', 'aura', 'views'].forEach(function (k) { Object.keys(x[k] || {}).forEach(function (id) { EXT[k][id] = x[k][id]; }); });
    },
    sets: SETS,
    items: ITEMS,
    has: function (id) { return !!BY_ID[id]; },
    byId: function (id) { return BY_ID[id] || null; },
    setOf: function (id) { return BY_ID[id] ? BY_ID[id].setId : null; },
    foreground: function (stage, g, ids) {
      return { hat: hatSvg(ids.hat, g), glasses: glassesSvg(ids.glasses, g), accessory: accessorySvg(ids.accessory) };
    },
    clothing: function (id) {
      var c = clothingSvg(String(id || '').toLowerCase().trim());
      // the face sits low on these chibi monsters, so outfits are drawn only on the belly (below the mouth)
      return c ? '<g transform="translate(0,150) scale(1,0.6) translate(0,-150)">' + c + '</g>' : null;
    },
    backpack: function (stage, id) { return backpackSvg(id) || null; },
    aura: function (id, stage) { return auraSvg(id) || null; },
    thumbnail: thumbnail,
    /** Add any missing costume items to a store's saved item list. Safe to run many times. */
    install: function (store) {
      if (!store || !store.state) return 0;
      if (!store.state.monsterItems) return 0;
      var have = {}, added = 0;
      store.state.monsterItems.forEach(function (i) { have[i.id] = true; });
      ITEMS.forEach(function (i) { if (!have[i.id]) { store.state.monsterItems.push(JSON.parse(JSON.stringify(i))); added++; } });
      if (added && store.saveState) store.saveState();
      return added;
    },
    /** Which costume sets does this list of owned item ids complete? */
    completedSets: function (ownedIds) {
      var out = [];
      Object.keys(SETS).forEach(function (k) {
        if (SETS[k].pieces.every(function (p) { return ownedIds.indexOf(p) !== -1; })) out.push(k);
      });
      return out;
    }
  };
})(typeof window !== 'undefined' ? window : this);
