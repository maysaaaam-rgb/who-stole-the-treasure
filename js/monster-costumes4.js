/* Monster Costumes, batch 4: the Mythic shelf (5 animated pieces, the top of the store) and trails (6 effects that follow the monster in the Island's walking world).
   Bought in the Classroom Store or on the Island, never found in Mystery Boxes. Registers itself with MonsterCostumes.extend(). */
(function (root) {
  'use strict';
  if (!root.MonsterCostumes || !root.MonsterCostumes.extend) return;

  function it(id, name, category, sub, icon, rarity, desc, setId) {
    return { id: id, name: name, category: category, subCategory: sub, description: desc, icon: icon, unlockType: 'store', storeOnly: true,
      unlockRequirement: { label: 'Buy it in the Shop 🛒' }, rarity: rarity, status: 'active', setId: setId || null };
  }
  var SETS = {
    mythic: { name: 'Mythic Legend', icon: '🌈', title: 'Mythic Legend', pieces: ['cs-my-rainbow-crown', 'cs-my-phoenix-wings', 'cs-my-aurora'] }
  };
  var ITEMS = [
    it('cs-my-rainbow-crown', 'Rainbow Crown', 'hat', 'hats', '👑', 'mythic', 'A golden crown with shining rainbow jewels', 'mythic'),
    it('cs-my-phoenix-wings', 'Phoenix Wings', 'backpack', 'backpacks', '🔥', 'mythic', 'Wings of living fire that beat by themselves', 'mythic'),
    it('cs-my-galaxy-cape', 'Galaxy Cape', 'backpack', 'backpacks', '🌌', 'mythic', 'A cape full of real twinkling stars'),
    it('cs-my-aurora', 'Aurora Glow', 'aura', 'auras', '🌠', 'mythic', 'The northern lights dance around you', 'mythic'),
    it('cs-my-comet', 'Pocket Comet', 'accessory', 'accessories', '☄️', 'mythic', 'A tiny comet that flies around you'),
    it('cs-tr-sparkle', 'Sparkle Trail', 'trail', 'trails', '✨', 'common', 'Little sparkles follow you when you walk'),
    it('cs-tr-hearts', 'Heart Trail', 'trail', 'trails', '💖', 'rare', 'Hearts float up behind you'),
    it('cs-tr-bubbles', 'Bubble Trail', 'trail', 'trails', '🫧', 'rare', 'Shiny bubbles rise wherever you go'),
    it('cs-tr-flames', 'Flame Trail', 'trail', 'trails', '🔥', 'epic', 'Friendly flames behind every step'),
    it('cs-tr-rainbow', 'Rainbow Trail', 'trail', 'trails', '🌈', 'legendary', 'A rainbow of colours follows you'),
    it('cs-tr-comet', 'Comet Trail', 'trail', 'trails', '☄️', 'mythic', 'You leave a shower of shooting stars')
  ];
  var H = {}, AC = {}, BP = {}, AU = {}, V = {};

  function star(x, y, s, c) { return `<polygon points="${x},${y - s} ${x + s * 0.3},${y - s * 0.3} ${x + s},${y - s * 0.2} ${x + s * 0.45},${y + s * 0.25} ${x + s * 0.6},${y + s} ${x},${y + s * 0.55} ${x - s * 0.6},${y + s} ${x - s * 0.45},${y + s * 0.25} ${x - s},${y - s * 0.2} ${x - s * 0.3},${y - s * 0.3}" fill="${c}"/>`; }
  function twinkle(x, y, s, c, dur, begin) {
    return `<g>${star(x, y, s, c)}<animate attributeName="opacity" values="1;.2;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
  }

  /* ---------------- the crown ---------------- */
  H['cs-my-rainbow-crown'] = function (g) { var t = g.topY;
    var jewels = [['#ef4444', 66, 0], ['#f59e0b', 83, .3], ['#22c55e', 100, .6], ['#3b82f6', 117, .9], ['#a855f7', 134, 1.2]];
    return `<g class="monster-hat">
      <path d="M58 ${t + 12} L52 ${t - 24} L72 ${t - 4} L84 ${t - 34} L100 ${t - 8} L116 ${t - 34} L128 ${t - 4} L148 ${t - 24} L142 ${t + 12} Q100 ${t + 22} 58 ${t + 12} Z" fill="#fbbf24" stroke="#92400e" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M60 ${t + 3} Q100 ${t + 13} 140 ${t + 3}" fill="none" stroke="#fef3c7" stroke-width="3" opacity=".8"/>
      <path d="M58 ${t + 12} Q100 ${t + 22} 142 ${t + 12} L143 ${t + 4} Q100 ${t + 14} 57 ${t + 4} Z" fill="#d97706" stroke="#92400e" stroke-width="1.6"/>
      ${jewels.map(function (j, i) { var y = t + 8 + (i === 2 ? 3 : (i === 1 || i === 3) ? 2 : 0); return `<circle cx="${j[1]}" cy="${y}" r="5" fill="${j[0]}" stroke="#fff" stroke-width="1.3"><animate attributeName="r" values="5;6.4;5" dur="1.6s" begin="${j[2]}s" repeatCount="indefinite"/></circle>`; }).join('')}
      <circle cx="52" cy="${t - 25}" r="4" fill="#ef4444" stroke="#92400e" stroke-width="1.4"/><circle cx="84" cy="${t - 35}" r="4" fill="#22c55e" stroke="#92400e" stroke-width="1.4"/><circle cx="116" cy="${t - 35}" r="4" fill="#3b82f6" stroke="#92400e" stroke-width="1.4"/><circle cx="148" cy="${t - 25}" r="4" fill="#a855f7" stroke="#92400e" stroke-width="1.4"/>
      ${twinkle(68, t - 28, 4, '#fff', 1.4, 0)}${twinkle(130, t - 30, 4, '#fff', 1.7, .5)}${twinkle(100, t - 22, 3.4, '#fef9c3', 1.2, .9)}</g>`; };
  V['cs-my-rainbow-crown'] = '42 12 116 82';

  /* ---------------- the wings ---------------- */
  function flameWing(flip) {
    var s = flip ? -1 : 1;
    return `<g transform="translate(${flip ? 200 : 0},0) scale(${s},1)"><g>
      <path d="M66 112 Q30 104 8 70 Q22 76 30 74 Q16 58 16 36 Q32 56 44 58 Q38 40 46 22 Q56 52 70 66 Q76 86 76 106 Z" fill="#f97316" stroke="#7c2d12" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M66 106 Q42 96 26 76 Q38 80 46 76 Q38 62 40 48 Q50 64 60 68 Q68 84 70 102 Z" fill="#fbbf24"/>
      <path d="M66 100 Q54 92 46 80 Q54 82 60 78 Q64 88 67 98 Z" fill="#fef3c7"/>
      <animateTransform attributeName="transform" type="rotate" values="0 70 106;-7 70 106;0 70 106" dur="1.1s" repeatCount="indefinite"/></g></g>`;
  }
  BP['cs-my-phoenix-wings'] = function () {
    return `<g class="monster-backpack">${flameWing(false)}${flameWing(true)}${twinkle(24, 46, 3.6, '#fde047', 1.1, 0)}${twinkle(176, 46, 3.6, '#fde047', 1.3, .4)}${twinkle(44, 18, 3, '#fff7ed', 1.5, .7)}${twinkle(156, 18, 3, '#fff7ed', 1.2, .2)}</g>`; };
  V['cs-my-phoenix-wings'] = '0 8 200 112';

  /* ---------------- the cape ---------------- */
  BP['cs-my-galaxy-cape'] = function () {
    var pts = [[16, 150, 3.6], [30, 124, 3], [40, 150, 2.6], [26, 98, 2.6], [184, 150, 3.6], [170, 124, 3], [160, 150, 2.6], [174, 98, 2.6], [52, 108, 2.4], [148, 108, 2.4]];
    return `<g class="monster-backpack">
      <path d="M58 82 Q22 110 6 166 Q26 156 42 168 Q62 158 80 168 L120 168 Q138 158 158 168 Q174 156 194 166 Q178 110 142 82 Q120 96 100 96 Q80 96 58 82 Z" fill="#312e81" stroke="#0f0a2e" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M46 100 Q24 124 14 156 Q34 148 50 156 Q44 128 60 104 Z" fill="#7c3aed"/><path d="M154 100 Q176 124 186 156 Q166 148 150 156 Q156 128 140 104 Z" fill="#7c3aed"/>
      <path d="M30 138 Q40 122 52 124 Q46 138 36 148 Z" fill="#ec4899"/><path d="M170 138 Q160 122 148 124 Q154 138 164 148 Z" fill="#ec4899"/>
      ${pts.map(function (p, i) { return twinkle(p[0], p[1], p[2], i % 3 ? '#fff' : '#fde68a', 1 + (i % 4) * .4, i * .2); }).join('')}
      <path d="M60 86 Q80 100 100 100 Q120 100 140 86" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/></g>`; };
  V['cs-my-galaxy-cape'] = '0 78 200 96';

  /* ---------------- the glow ---------------- */
  function ribbon(d, c, dur, begin) { return `<path d="${d}" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round" opacity=".8"><animate attributeName="opacity" values=".55;.95;.55" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></path>`; }
  AU['cs-my-aurora'] = function () {
    return `<g class="monster-aura">
      ${ribbon('M14 96 Q34 40 76 34 Q120 28 150 44', '#34d399', 3, 0)}${ribbon('M186 100 Q168 44 124 30 Q88 22 56 42', '#60a5fa', 3.4, .6)}${ribbon('M22 136 Q10 84 44 52', '#a855f7', 2.8, 1.1)}${ribbon('M178 138 Q192 88 156 54', '#f472b6', 3.2, 1.6)}
      ${twinkle(30, 40, 4, '#fff', 1.3, 0)}${twinkle(170, 36, 4, '#fff', 1.6, .5)}${twinkle(100, 16, 3.6, '#fde68a', 1.1, .9)}${twinkle(16, 112, 3, '#a7f3d0', 1.8, .3)}${twinkle(184, 114, 3, '#bfdbfe', 1.4, 1.2)}</g>`; };
  V['cs-my-aurora'] = '0 0 200 160';

  /* ---------------- the comet ---------------- */
  AC['cs-my-comet'] = function () {
    return `<g class="monster-accessory"><g>
      <path d="M152 72 Q176 66 192 44 Q186 74 164 84 Z" fill="#7dd3fc" opacity=".55"/><path d="M150 76 Q170 74 184 60 Q178 80 160 86 Z" fill="#fef08a" opacity=".85"/>
      <circle cx="150" cy="80" r="11" fill="#fbbf24" stroke="#92400e" stroke-width="2.2"/><circle cx="146" cy="76" r="3.4" fill="#fef3c7"/><circle cx="154" cy="84" r="2.4" fill="#d97706"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;-10 10;0 16;10 8;0 0" dur="3s" repeatCount="indefinite"/></g>
      ${twinkle(170, 100, 3, '#fff', 1.2, 0)}${twinkle(132, 62, 2.6, '#fde68a', 1.5, .5)}</g>`; };
  V['cs-my-comet'] = '120 36 76 76';

  root.MonsterCostumes.extend({ sets: SETS, items: ITEMS, hat: H, accessory: AC, backpack: BP, aura: AU, views: V });
})(typeof window !== 'undefined' ? window : this);
