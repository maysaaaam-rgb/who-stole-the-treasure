/**
 * Monster Dress-Up: puts accessory pictures on the illustrated monsters.
 * Layers (back to front): background, aura, back items (backpack, cape), monster art,
 * outfits (scarf, vest, hoodie), neck items, glasses, hats, held items.
 * Positions come from window.MONSTER_ANCHORS (measured on each monster picture, 1024px space)
 * and window.MONSTER_ITEM_BOX (visible box of each accessory picture, 0..1), see js/monster-anchors.js.
 */
(function (root) {
  'use strict';

  var ART = 'assets/monsters/art/';
  var ITEMS = 'assets/monsters/item-art/';
  var SPECIES_BY_COLOR = { orange: 'emberwing', blue: 'aquafind', green: 'florasprout', purple: 'astralight', gold: 'sparktail', yellow: 'sparktail', pink: 'florasprout' };
  var STAGES = ['egg', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];

  // equipped id -> picture name (without "item_")
  var FILE = {
    'hat-crown': 'hat_crown', 'hat-explorer': 'hat_explorer', 'hat-scholar': 'hat_scholar', 'hat-wizard': 'hat_wizard',
    'hat-bow': 'hat_bow', 'hat-star-clip': 'hat_starclip', 'hat-flower': 'hat_flower', 'hat-headband': 'hat_headband',
    'glasses-round': 'glasses_round', 'glasses-goggles': 'glasses_goggles',
    'neck-star': 'neck_star', 'neck-medal': 'neck_medal', 'neck-pendant': 'neck_pendant', 'neck-badge': 'neck_badge',
    'bp-explorer': 'bp_explorer', 'bp-book': 'bp_book', 'bp-mini-wings': 'bp_miniwings', 'bp-adv-bag': 'bp_adventure',
    'acc-book': 'held_book', 'acc-wand': 'held_wand', 'acc-compass': 'held_compass', 'acc-trophy': 'held_trophy', 'acc-microphone': 'held_microphone',
    'clothing-scarf': 'outfit_scarf', 'clothing-cape': 'outfit_cape', 'clothing-vest': 'outfit_vest', 'clothing-hoodie': 'outfit_hoodie'
  };

  // How each picture is placed. anchor = which point of the picture touches the monster point.
  // w = width as a multiple of a measured width; dx/dy = shift as a multiple of that width.
  var RULE = {
    hat_crown:     { z: 60, at: 'hatBase', from: 'bottom', base: 'hatWidth', w: 0.72, dy: 0.12 },
    hat_explorer:  { z: 60, at: 'hatBase', from: 'bottom', base: 'hatWidth', w: 0.92, dy: 0.28 },
    hat_scholar:   { z: 60, at: 'hatBase', from: 'bottom', base: 'hatWidth', w: 0.88, dy: 0.12 },
    hat_wizard:    { z: 60, at: 'hatBase', from: 'bottom', base: 'hatWidth', w: 0.84, dy: 0.22 },
    hat_bow:       { z: 60, at: 'hatBase', from: 'center', base: 'hatWidth', w: 0.50, dx: 0.28, dy: 0.1 },
    hat_starclip:  { z: 60, at: 'hatBase', from: 'center', base: 'hatWidth', w: 0.26, dx: -0.30, dy: 0.12 },
    hat_flower:    { z: 60, at: 'hatBase', from: 'center', base: 'hatWidth', w: 1.00, dy: 0.2 },
    hat_headband:  { z: 60, at: 'hatBase', from: 'center', base: 'hatWidth', w: 0.98, dy: 0.32 },
    glasses_round:   { z: 50, at: 'eyeCenter', from: 'center', base: 'glassesWidth', w: 0.92 },
    glasses_goggles: { z: 50, at: 'eyeCenter', from: 'center', base: 'glassesWidth', w: 0.84 },
    neck_star:     { z: 40, at: 'neck', from: 'top', base: 'neckWidth', w: 0.62, dy: -0.12 },
    neck_medal:    { z: 40, at: 'neck', from: 'top', base: 'neckWidth', w: 0.48, dy: -0.12 },
    neck_pendant:  { z: 40, at: 'neck', from: 'top', base: 'neckWidth', w: 0.62, dy: -0.12 },
    neck_badge:    { z: 40, at: 'neck', from: 'top', base: 'neckWidth', w: 0.55, dy: -0.10 },
    outfit_scarf:  { z: 30, at: 'neck', from: 'top', base: 'neckWidth', w: 0.95, dy: -0.22 },
    outfit_vest:   { z: 30, at: 'neck', from: 'top', base: 'bodyWidth', w: 0.68, dy: 0.0 },
    outfit_hoodie: { z: 30, at: 'neck', from: 'top', base: 'bodyWidth', w: 0.78, dy: -0.05 },
    outfit_cape:   { z: 5, at: 'neck', from: 'top', base: 'bodyWidth', w: 1.35, dy: -0.05 },
    bp_explorer:   { z: 5, at: 'bodyCenter', from: 'center', base: 'bodyHeight', w: 1.5, dy: -0.62 },
    bp_book:       { z: 5, at: 'bodyCenter', from: 'center', base: 'bodyHeight', w: 1.5, dy: -0.62 },
    bp_miniwings:  { z: 5, at: 'bodyCenter', from: 'center', base: 'bodyHeight', w: 1.6, dy: -0.62 },
    bp_adventure:  { z: 5, at: 'bodyCenter', from: 'center', base: 'bodyHeight', w: 1.5, dy: -0.62 },
    held_book:       { z: 70, at: 'pawRight', from: 'center', base: 'bodyHeight', w: 0.5 },
    held_wand:       { z: 70, at: 'pawRight', from: 'center', base: 'bodyHeight', w: 0.55, dy: -0.20 },
    held_compass:    { z: 70, at: 'pawRight', from: 'center', base: 'bodyHeight', w: 0.42 },
    held_trophy:     { z: 70, at: 'pawRight', from: 'center', base: 'bodyHeight', w: 0.46, dy: -0.06 },
    held_microphone: { z: 70, at: 'pawRight', from: 'center', base: 'bodyHeight', w: 0.42, dy: -0.12 }
  };

  function speciesForColor(color) {
    var c = String(color || 'blue').toLowerCase().replace(/^body-/, '');
    return SPECIES_BY_COLOR[c] || 'aquafind';
  }

  function normStage(stage) {
    if (stage === 'cracking_egg') return 'egg';
    return STAGES.indexOf(stage) === -1 ? 'baby' : stage;
  }

  // Items hidden because the monster already wears something similar in that picture.
  function isHiddenByBaked(id, baked) {
    baked = baked || [];
    if (baked.indexOf('scarf') !== -1 && (id === 'clothing-scarf' || id === 'clothing-hoodie')) return true;
    if (baked.indexOf('satchel') !== -1 && /^bp-/.test(id)) return true;
    if (baked.indexOf('badge') !== -1 && id === 'neck-badge') return true;
    if (baked.indexOf('crown') !== -1 && /^hat-/.test(id)) return true;
    if (baked.indexOf('cape') !== -1 && (id === 'clothing-cape' || /^bp-/.test(id))) return true;
    return false;
  }

  function itemHtml(name, a, monsterKey) {
    var rule = RULE[name], box = root.MONSTER_ITEM_BOX && root.MONSTER_ITEM_BOX[name];
    if (!rule || !box || !a) return '';
    var pt = a[rule.at], baseW = a[rule.base];
    if (!pt || !baseW) return '';
    var ov = (root.MONSTER_OVERRIDES && root.MONSTER_OVERRIDES[monsterKey] && root.MONSTER_OVERRIDES[monsterKey][name]) || {};
    var contentW = baseW * rule.w * (ov.dw || 1);                       // wanted width of the visible part, in 1024px space
    var imgW = contentW / (box.r - box.l);               // width of the whole picture
    var px = (box.l + box.r) / 2;
    var py = rule.from === 'bottom' ? box.b : rule.from === 'top' ? box.t : (box.t + box.b) / 2;
    var cx = pt.x + ((rule.dx || 0) + (ov.dx || 0)) * baseW;
    var cy = pt.y + ((rule.dy || 0) + (ov.dy || 0)) * baseW;
    var left = cx - px * imgW, top = cy - py * imgW;
    return '<img class="eaa-dressup-item" data-item="' + name + '" src="' + ITEMS + 'item_' + name + '.webp" alt="" draggable="false" ' +
      'style="position:absolute;z-index:' + rule.z + ';left:' + (left / 10.24).toFixed(2) + '%;top:' + (top / 10.24).toFixed(2) + '%;width:' + (imgW / 10.24).toFixed(2) + '%;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(30,20,60,0.35));" />';
  }

  /**
   * options: { color | species, stage, equipped, size (px), showBackground, animated }
   * returns HTML, or '' when this monster has no illustrated art.
   */
  function render(options) {
    options = options || {};
    var equipped = options.equipped || {};
    var species = options.species || speciesForColor(options.color || equipped.body);
    var stage = normStage(options.stage);
    var key = species + '_' + stage;
    var anchors = root.MONSTER_ANCHORS && root.MONSTER_ANCHORS[key];
    var size = options.size || 280;
    var sizeCss = typeof size === 'number' ? ('width:' + size + 'px;height:' + size + 'px;') : ('width:' + size + ';aspect-ratio:1/1;');

    var layers = '';
    var MR = root.MonsterRenderer;
    if (options.showBackground && MR && MR.renderBackdropSvg) {
      layers += '<div style="position:absolute;inset:0;z-index:0;border-radius:16px;overflow:hidden;">' + MR.renderBackdropSvg(equipped.background || 'bg-meadow') + '</div>';
    }
    if (MR && MR.renderAuraSvg && equipped.aura && equipped.aura !== 'none') {
      layers += '<div style="position:absolute;inset:0;z-index:1;pointer-events:none;">' + MR.renderAuraSvg(equipped.aura, stage, options.color || equipped.body) + '</div>';
    }

    var items = '';
    if (anchors && anchors.kind === 'monster') {
      var wearing = [equipped.clothing, equipped.backpack, equipped.accessory, equipped.glasses, equipped.hat];
      wearing.forEach(function (id) {
        if (!id || id === 'none' || id === 'default') return;
        if (isHiddenByBaked(id, anchors.bakedItems)) return;
        var name = FILE[id];
        if (name) items += itemHtml(name, anchors, key);
      });
    }

    var bob = options.animated === false ? '' : 'animation:eaaDressBob 3.2s ease-in-out infinite;';
    return '<div class="eaa-dressup" data-monster="' + key + '" style="position:relative;' + sizeCss + 'margin:0 auto;">' +
      layers +
      '<div style="position:absolute;inset:7%;z-index:10;' + bob + '">' +
        items +
        '<img src="' + ART + key + '.webp" alt="" draggable="false" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:20;" />' +
      '</div>' +
      '</div>';
  }

  // Items are children of the same animated box as the monster, but their z-index must interleave with the art:
  // back items (z<20) go behind it, the rest in front. A flat stacking context keeps that order.
  var style = document.createElement('style');
  style.textContent = '@keyframes eaaDressBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3%)}}' +
    '.eaa-dressup>div:nth-child(n){isolation:auto}';
  if (document.head) document.head.appendChild(style);

  root.MonsterDressUp = {
    render: render,
    speciesForColor: speciesForColor,
    hasArt: function (color, stage) { var s = speciesForColor(color); return !!(root.MONSTER_ANCHORS && root.MONSTER_ANCHORS[s + '_' + normStage(stage)]); },
    supportedItem: function (id) { return !!FILE[id]; },
    isHiddenByBaked: isHiddenByBaked
  };
})(typeof window !== 'undefined' ? window : this);
