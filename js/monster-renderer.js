/**
 * ENGLISH ADVENTURE ACADEMY — CANONICAL MONSTER RUNTIME ENGINE
 * Architecture: Spine 2D Rigged Character + PixiJS HTML5 Canvas Renderer
 * Single Source of Truth for Character Customization, Progression & Animation
 */
(function(root) {
  'use strict';

  // =========================================================================
  // 1. CANONICAL EVOLUTION STAGES SPECIFICATION
  // =========================================================================
  const EVOLUTION_STAGES = [
    { level: 0, key: 'egg', name: 'Egg', subtitle: 'Enchanted Cosmic Egg', xpRequired: 0, scale: 0.85, hasArmor: false },
    { level: 1, key: 'baby', name: 'Baby', subtitle: 'Tiny & Cuddly Hatchling', xpRequired: 100, scale: 0.90, hasArmor: false },
    { level: 2, key: 'tot', name: 'Tot', subtitle: 'Playful Growing Explorer', xpRequired: 300, scale: 0.95, hasArmor: false },
    { level: 3, key: 'young', name: 'Young', subtitle: 'Energetic Agile Juvenile', xpRequired: 700, scale: 1.00, hasArmor: true },
    { level: 4, key: 'adventurer', name: 'Adventurer', subtitle: 'Quest-Ready Hero Guardian', xpRequired: 1200, scale: 1.05, hasArmor: true },
    { level: 5, key: 'elite', name: 'Elite', subtitle: 'Ascended Winged Champion', xpRequired: 2500, scale: 1.10, hasArmor: true, hasWings: true },
    { level: 6, key: 'legendary', name: 'Legendary', subtitle: 'Sovereign Mythic Dragon-Fox', xpRequired: 5000, scale: 1.15, hasArmor: true, hasWings: true }
  ];

  // =========================================================================
  // 2. PALETTES ARCHITECTURE (5 OFFICIAL COLORWAYS)
  // =========================================================================
  const FUR_PALETTES = {
    blue: {
      name: 'Sky Azure',
      primary: '#3b82f6',
      primaryDark: '#1d4ed8',
      primaryLight: '#93c5fd',
      innerEar: '#f472b6',
      belly: '#f8fafc',
      bellyShadow: '#cbd5e1',
      blush: '#fda4af',
      hornBase: '#d97706',
      hornTip: '#fbbf24',
      aura: 'rgba(56, 189, 248, 0.4)'
    },
    purple: {
      name: 'Lavender Arcane',
      primary: '#a855f7',
      primaryDark: '#7e22ce',
      primaryLight: '#d8b4fe',
      innerEar: '#f472b6',
      belly: '#faf5ff',
      bellyShadow: '#e9d5ff',
      blush: '#f472b6',
      hornBase: '#d97706',
      hornTip: '#fde047',
      aura: 'rgba(168, 85, 247, 0.4)'
    },
    green: {
      name: 'Leaf Emerald',
      primary: '#10b981',
      primaryDark: '#047857',
      primaryLight: '#6ee7b7',
      innerEar: '#fb7185',
      belly: '#f0fdf4',
      bellyShadow: '#bbf7d0',
      blush: '#fca5a5',
      hornBase: '#b45309',
      hornTip: '#fcd34d',
      aura: 'rgba(16, 185, 129, 0.4)'
    },
    orange: {
      name: 'Sunset Amber',
      primary: '#f97316',
      primaryDark: '#c2410c',
      primaryLight: '#fdba74',
      innerEar: '#f43f5e',
      belly: '#fffbeb',
      bellyShadow: '#fed7aa',
      blush: '#fb7185',
      hornBase: '#9a3412',
      hornTip: '#fde047',
      aura: 'rgba(249, 115, 22, 0.4)'
    },
    pink: {
      name: 'Berry Blossom',
      primary: '#ec4899',
      primaryDark: '#be185d',
      primaryLight: '#fbcfe8',
      innerEar: '#fb7185',
      belly: '#fff1f2',
      bellyShadow: '#fecdd3',
      blush: '#f43f5e',
      hornBase: '#d97706',
      hornTip: '#fde047',
      aura: 'rgba(236, 72, 153, 0.4)'
    }
  };

  // =========================================================================
  // 3. SPINE RIG & SLOT SPECIFICATION
  // =========================================================================
  const SPINE_SPEC = {
    bones: [
      { name: 'root', parent: null, x: 200, y: 350 },
      { name: 'pedestal', parent: 'root', x: 0, y: 0 },
      { name: 'aura', parent: 'root', x: 0, y: -120 },
      { name: 'tail_base', parent: 'root', x: 40, y: -70 },
      { name: 'tail_mid', parent: 'tail_base', x: 30, y: -40 },
      { name: 'tail_tip', parent: 'tail_mid', x: 20, y: -40 },
      { name: 'wings_base', parent: 'root', x: 0, y: -140 },
      { name: 'body', parent: 'root', x: 0, y: -80 },
      { name: 'chest', parent: 'body', x: 0, y: -40 },
      { name: 'neck', parent: 'chest', x: 0, y: -40 },
      { name: 'head', parent: 'neck', x: 0, y: -30 },
      { name: 'ear_left', parent: 'head', x: -50, y: -60 },
      { name: 'ear_right', parent: 'head', x: 50, y: -60 },
      { name: 'horn_left', parent: 'head', x: -25, y: -70 },
      { name: 'horn_right', parent: 'head', x: 25, y: -70 },
      { name: 'eyes', parent: 'head', x: 0, y: -10 },
      { name: 'muzzle', parent: 'head', x: 0, y: 15 },
      { name: 'accessory', parent: 'head', x: 0, y: -75 },
      { name: 'outfit', parent: 'chest', x: 0, y: 0 }
    ],
    slots: [
      'slot_pedestal',
      'slot_aura',
      'slot_wings',
      'slot_tail',
      'slot_hind_legs',
      'slot_body',
      'slot_chest_tufts',
      'slot_outfit',
      'slot_front_paws',
      'slot_ears',
      'slot_horns',
      'slot_head',
      'slot_crest',
      'slot_eyes',
      'slot_muzzle',
      'slot_blush',
      'slot_accessory'
    ],
    animations: ['idle', 'blink', 'happy', 'excited', 'wave', 'jump', 'celebrate', 'evolution']
  };

  // Cache of active PixiJS Applications mapped by host DOM element
  const activePixiInstances = new Map();

  // Helper to normalize hex colors
  function hexToInt(hex) {
    if (!hex) return 0x3b82f6;
    if (typeof hex === 'number') return hex;
    return parseInt(hex.replace('#', ''), 16);
  }

  // =========================================================================
  // 4. CANONICAL MONSTER PROGRESSION CALCULATOR
  // =========================================================================
  function getMonsterProgress(studentOrId) {
    if (typeof window !== 'undefined' && typeof window.getMonsterProgress === 'function' && window.getMonsterProgress !== getMonsterProgress) {
      return window.getMonsterProgress(studentOrId);
    }
    let totalXP = 0;
    if (typeof studentOrId === 'number') totalXP = studentOrId;
    else if (typeof studentOrId === 'string' && root.schoolStore) totalXP = root.schoolStore.getStudentTotalXP(studentOrId);
    else if (studentOrId && typeof studentOrId.xp === 'number') totalXP = studentOrId.xp;

    let stageIdx = 0;
    for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
      if (totalXP >= EVOLUTION_STAGES[i].xpRequired) {
        stageIdx = i;
        break;
      }
    }

    const cur = EVOLUTION_STAGES[stageIdx];
    const next = EVOLUTION_STAGES[stageIdx + 1] || null;
    const stageStartXP = cur.xpRequired;
    const nextStageXP = next ? next.xpRequired : cur.xpRequired;
    const xpInStage = totalXP - stageStartXP;
    const xpNeededForStage = next ? (nextStageXP - stageStartXP) : 0;
    const progressPct = next ? Math.min(100, Math.max(0, parseFloat(((xpInStage / xpNeededForStage) * 100).toFixed(1)))) : 100;

    return {
      totalXP,
      level: cur.level,
      stageIndex: cur.level,
      evolutionStage: cur.level,
      stageKey: cur.key,
      stageName: cur.name,
      name: cur.name,
      subtitle: cur.subtitle,
      stageStartXP,
      nextStageXP,
      xpInStage,
      xpNeededForStage,
      xpToNext: next ? Math.max(0, nextStageXP - totalXP) : 0,
      progressPct,
      percentage: progressPct,
      isMaxStage: !next,
      isHatched: cur.level >= 1
    };
  }

  // =========================================================================
  // 5. MONSTER SERVICE API
  // =========================================================================
  const MonsterService = {
    getMonster(studentId) {
      const store = root.schoolStore;
      if (store && store.getStudentMonster) {
        return store.getStudentMonster(studentId);
      }
      return {
        species: "academy-companion",
        style: "boy",
        evolutionStage: 4,
        furColor: "blue",
        eyes: "round",
        ears: "fox",
        tail: "fluffy",
        outfit: "adventurer_jacket",
        accessory: null,
        aura: null
      };
    },

    getProgress(studentId) {
      return getMonsterProgress(studentId);
    },

    setCustomization(studentId, category, value) {
      const store = root.schoolStore;
      if (!store) return null;
      const val = (value === 'none' || value === null || value === 'null') ? null : value;
      const updates = {};
      if (category === 'fur') updates.furColor = val;
      else updates[category] = val;

      store.updateStudentMonster(studentId, updates);
      if (typeof root.updateLiveStudioMonster === 'function') {
        root.updateLiveStudioMonster(studentId);
      }
      return store.getStudentMonster(studentId);
    },

    setStyle(studentId, style) {
      const store = root.schoolStore;
      if (!store) return null;
      store.updateStudentMonster(studentId, { style: style });
      if (typeof root.updateLiveStudioMonster === 'function') {
        root.updateLiveStudioMonster(studentId);
      }
      return store.getStudentMonster(studentId);
    },

    evolve(studentId, targetStage) {
      const store = root.schoolStore;
      if (!store) return null;
      const newStage = typeof targetStage === 'number' ? targetStage : (this.getProgress(studentId).level + 1);
      store.updateStudentMonster(studentId, { evolutionStage: Math.min(6, newStage) });
      if (typeof root.updateLiveStudioMonster === 'function') {
        root.updateLiveStudioMonster(studentId);
      }
      return store.getStudentMonster(studentId);
    },

    palettes: FUR_PALETTES,
    stages: EVOLUTION_STAGES,
    SPINE_SPEC: SPINE_SPEC
  };

  // =========================================================================
  // 6. PIXI COMPONENT VECTOR GRAPHICS GENERATOR (HIGH-RES TEXTURE FACTORY)
  // =========================================================================
  function createCharacterDisplayObject(PIXI, mConfig, options = {}) {
    const palKey = mConfig.furColor || 'blue';
    const pal = FUR_PALETTES[palKey] || FUR_PALETTES.blue;
    const stageIdx = (mConfig.evolutionStage !== undefined && mConfig.evolutionStage !== null) ? Number(mConfig.evolutionStage) : 4;
    const stageConf = EVOLUTION_STAGES[stageIdx] || EVOLUTION_STAGES[4];
    const isGirl = (mConfig.style || 'boy') === 'girl';
    const showPedestal = options.showPedestal !== false;
    const animated = options.animated !== false;

    const charContainer = new PIXI.Container();
    charContainer.name = 'spine_character_root';

    // -------------------------------------------------------------
    // Stage 0: Egg Special State
    // -------------------------------------------------------------
    if (stageIdx === 0) {
      const eggGraphics = new PIXI.Graphics();
      // Pedestal
      if (showPedestal) {
        eggGraphics.beginFill(0x0e274c, 0.7);
        eggGraphics.drawEllipse(200, 360, 110, 26);
        eggGraphics.endFill();
        eggGraphics.lineStyle(2, 0x38bdf8, 0.8);
        eggGraphics.drawEllipse(200, 355, 95, 20);
      }
      // Cosmic Egg Shell
      eggGraphics.lineStyle(3, 0x38bdf8, 0.9);
      eggGraphics.beginFill(hexToInt(pal.primaryDark), 0.95);
      eggGraphics.drawEllipse(200, 240, 75, 105);
      eggGraphics.endFill();

      // Egg belly glow & stardust runes
      eggGraphics.beginFill(hexToInt(pal.primary), 0.8);
      eggGraphics.drawEllipse(200, 240, 58, 85);
      eggGraphics.endFill();

      eggGraphics.lineStyle(2.5, 0xfde047, 0.85);
      eggGraphics.moveTo(175, 200);
      eggGraphics.lineTo(195, 230);
      eggGraphics.lineTo(185, 255);
      eggGraphics.lineTo(215, 280);

      // Star Sparkles
      eggGraphics.beginFill(0xffffff, 0.9);
      eggGraphics.drawCircle(165, 180, 4);
      eggGraphics.drawCircle(235, 210, 3);
      eggGraphics.drawCircle(190, 310, 3.5);
      eggGraphics.endFill();

      charContainer.addChild(eggGraphics);
      return { container: charContainer, tickerUpdate: () => {} };
    }

    // -------------------------------------------------------------
    // Rigged Slots Container Hierarchy (Bones)
    // -------------------------------------------------------------
    const slotPedestal = new PIXI.Container();
    const slotAura = new PIXI.Container();
    const slotWings = new PIXI.Container();
    const slotTail = new PIXI.Container();
    const slotHindLegs = new PIXI.Container();
    const slotBody = new PIXI.Container();
    const slotChest = new PIXI.Container();
    const slotOutfit = new PIXI.Container();
    const slotFrontPaws = new PIXI.Container();
    const slotHead = new PIXI.Container();
    const slotEars = new PIXI.Container();
    const slotHorns = new PIXI.Container();
    const slotFace = new PIXI.Container();
    const slotEyes = new PIXI.Container();
    const slotMuzzle = new PIXI.Container();
    const slotBlush = new PIXI.Container();
    const slotCrest = new PIXI.Container();
    const slotAccessory = new PIXI.Container();

    charContainer.addChild(slotPedestal);
    charContainer.addChild(slotAura);
    charContainer.addChild(slotWings);
    charContainer.addChild(slotTail);
    charContainer.addChild(slotHindLegs);
    charContainer.addChild(slotBody);
    charContainer.addChild(slotChest);
    charContainer.addChild(slotOutfit);
    charContainer.addChild(slotFrontPaws);
    charContainer.addChild(slotHead);

    slotHead.addChild(slotEars);
    slotHead.addChild(slotHorns);
    slotHead.addChild(slotFace);
    slotHead.addChild(slotCrest);
    slotHead.addChild(slotEyes);
    slotHead.addChild(slotMuzzle);
    slotHead.addChild(slotBlush);
    slotHead.addChild(slotAccessory);

    // Dynamic Scale by Evolution Stage
    const sScale = stageConf.scale || 1.0;
    charContainer.pivot.set(200, 360);
    charContainer.position.set(200, 360);
    charContainer.scale.set(sScale, sScale);

    // 1. Pedestal & Shadow
    if (showPedestal) {
      const gPed = new PIXI.Graphics();
      // Drop Shadow
      gPed.beginFill(0x020617, 0.5);
      gPed.drawEllipse(200, 355, 125, 28);
      gPed.endFill();
      // Stone Dais Ring
      gPed.lineStyle(3, 0x38bdf8, 0.85);
      gPed.beginFill(0x0e274c, 0.8);
      gPed.drawEllipse(200, 350, 110, 22);
      gPed.endFill();
      // Inner Rune Circuit
      gPed.lineStyle(1.5, 0x7dd3fc, 0.6);
      gPed.drawEllipse(200, 350, 85, 16);
      slotPedestal.addChild(gPed);
    }

    // 2. Aura (Equipped Aura or Evolution Halo)
    const auraType = mConfig.aura;
    if (auraType || stageIdx >= 5) {
      const gAura = new PIXI.Graphics();
      const auraColor = hexToInt(pal.primaryLight);
      gAura.lineStyle(2, auraColor, 0.35);
      gAura.drawCircle(200, 210, 140);
      gAura.lineStyle(1, 0xfde047, 0.4);
      gAura.drawCircle(200, 210, 155);
      // Floating sparkles
      gAura.beginFill(0xffffff, 0.7);
      gAura.drawCircle(130, 140, 3.5);
      gAura.drawCircle(275, 160, 4);
      gAura.drawCircle(145, 260, 3);
      gAura.drawCircle(260, 270, 3.5);
      gAura.endFill();
      slotAura.addChild(gAura);
    }

    // 3. Wings (Stages 5 & 6)
    if (stageConf.hasWings) {
      const gWings = new PIXI.Graphics();
      // Left Wing
      gWings.lineStyle(2, 0xffffff, 0.7);
      gWings.beginFill(0xffffff, 0.88);
      gWings.moveTo(150, 210);
      gWings.bezierCurveTo(80, 130, 40, 110, 25, 80);
      gWings.bezierCurveTo(60, 115, 90, 150, 100, 190);
      gWings.bezierCurveTo(115, 170, 135, 195, 150, 220);
      gWings.endFill();

      // Right Wing
      gWings.beginFill(0xffffff, 0.88);
      gWings.moveTo(250, 210);
      gWings.bezierCurveTo(320, 130, 360, 110, 375, 80);
      gWings.bezierCurveTo(340, 115, 310, 150, 300, 190);
      gWings.bezierCurveTo(285, 170, 265, 195, 250, 220);
      gWings.endFill();
      slotWings.addChild(gWings);
    }

    // 4. Tail (Dynamic Plume with Golden Scales & White Tip)
    const tailType = mConfig.tail || 'fluffy';
    const gTail = new PIXI.Graphics();
    gTail.lineStyle(2.5, hexToInt(pal.primaryDark), 0.9);
    gTail.beginFill(hexToInt(pal.primary), 1.0);

    if (tailType === 'dragon') {
      gTail.moveTo(225, 280);
      gTail.bezierCurveTo(290, 260, 345, 210, 335, 140);
      gTail.bezierCurveTo(315, 175, 280, 230, 210, 310);
      gTail.endFill();
      // Golden dorsal plates
      gTail.lineStyle(0);
      gTail.beginFill(0xf59e0b, 1.0);
      gTail.drawPolygon([300, 205, 315, 195, 308, 220]);
      gTail.drawPolygon([325, 165, 340, 150, 330, 180]);
      gTail.endFill();
    } else {
      // Sweeping Celestial Fluffy Plume
      gTail.moveTo(215, 285);
      gTail.bezierCurveTo(285, 275, 355, 220, 340, 145);
      gTail.bezierCurveTo(320, 130, 290, 140, 280, 175);
      gTail.bezierCurveTo(265, 195, 240, 250, 210, 310);
      gTail.endFill();

      // White fluffy crest tip
      gTail.lineStyle(1.5, 0xe2e8f0, 0.8);
      gTail.beginFill(0xffffff, 1.0);
      gTail.moveTo(340, 145);
      gTail.bezierCurveTo(330, 135, 305, 145, 295, 160);
      gTail.bezierCurveTo(315, 170, 335, 165, 340, 145);
      gTail.endFill();

      // Gold Dragon Accent Scales
      gTail.lineStyle(0);
      gTail.beginFill(0xf59e0b, 0.95);
      gTail.drawPolygon([305, 215, 320, 205, 312, 230]);
      gTail.endFill();
    }
    slotTail.addChild(gTail);

    // 5. Hind Legs & Body Haunches
    const gHind = new PIXI.Graphics();
    gHind.lineStyle(2, hexToInt(pal.primaryDark), 0.9);
    gHind.beginFill(hexToInt(pal.primary), 1.0);
    // Left haunch
    gHind.drawEllipse(155, 305, 32, 40);
    // Right haunch
    gHind.drawEllipse(245, 305, 32, 40);
    gHind.endFill();
    slotHindLegs.addChild(gHind);

    // 6. Torso & Cream Chest Bib
    const gBody = new PIXI.Graphics();
    gBody.lineStyle(2.5, hexToInt(pal.primaryDark), 0.9);
    gBody.beginFill(hexToInt(pal.primary), 1.0);
    // Pear-shaped organic body
    gBody.drawEllipse(200, 265, 58, 65);
    gBody.endFill();

    // Cream Belly & 3-Tier Layered Chest Bib
    const gChest = new PIXI.Graphics();
    gChest.lineStyle(1.5, hexToInt(pal.bellyShadow), 0.8);
    gChest.beginFill(hexToInt(pal.belly), 1.0);
    gChest.moveTo(170, 230);
    gChest.quadraticCurveTo(200, 220, 230, 230);
    gChest.quadraticCurveTo(235, 265, 220, 295);
    gChest.quadraticCurveTo(200, 310, 180, 295);
    gChest.quadraticCurveTo(165, 265, 170, 230);
    gChest.endFill();

    // Fluffy Bib Fur Tufts
    gChest.lineStyle(1.5, hexToInt(pal.bellyShadow), 0.8);
    gChest.beginFill(0xffffff, 1.0);
    gChest.moveTo(185, 245);
    gChest.lineTo(200, 262);
    gChest.lineTo(215, 245);
    gChest.quadraticCurveTo(200, 252, 185, 245);
    gChest.endFill();
    slotChest.addChild(gChest);
    slotBody.addChild(gBody);

    // 7. Front Legs and Paws with Pink Toe Pads
    const gFront = new PIXI.Graphics();
    gFront.lineStyle(2, hexToInt(pal.primaryDark), 0.9);
    gFront.beginFill(hexToInt(pal.primary), 1.0);
    // Left leg
    gFront.drawRoundedRect(165, 265, 24, 65, 12);
    // Right leg
    gFront.drawRoundedRect(211, 265, 24, 65, 12);
    gFront.endFill();

    // Rounded Paws with soft pink pads
    gFront.lineStyle(1.5, hexToInt(pal.bellyShadow), 0.8);
    gFront.beginFill(0xffffff, 1.0);
    gFront.drawEllipse(177, 332, 15, 10);
    gFront.drawEllipse(223, 332, 15, 10);
    gFront.endFill();

    gFront.beginFill(0xf472b6, 0.95);
    // Left paw pads
    gFront.drawCircle(177, 332, 4);
    gFront.drawCircle(171, 330, 2.2);
    gFront.drawCircle(183, 330, 2.2);
    // Right paw pads
    gFront.drawCircle(223, 332, 4);
    gFront.drawCircle(217, 330, 2.2);
    gFront.drawCircle(229, 330, 2.2);
    gFront.endFill();
    slotFrontPaws.addChild(gFront);

    // 8. Outfits (Adventurer Harness, Scholar Vest, Hero Cape, Mystic Robe)
    const outfitType = (stageConf.hasArmor || mConfig.outfit) ? mConfig.outfit : null;
    if (outfitType && outfitType !== 'none') {
      const gOut = new PIXI.Graphics();
      if (outfitType === 'adventurer_jacket' || outfitType === 'adventurer') {
        // Brown leather chest harness with gold buckle
        gOut.lineStyle(2, 0x451a03, 1.0);
        gOut.beginFill(0x78350f, 1.0);
        gOut.drawRect(178, 275, 10, 48);
        gOut.drawRect(212, 275, 10, 48);
        gOut.drawRoundedRect(170, 298, 60, 14, 4);
        gOut.endFill();
        // Brass buckle
        gOut.lineStyle(1.5, 0xb45309, 1.0);
        gOut.beginFill(0xfbbf24, 1.0);
        gOut.drawRect(193, 295, 14, 20);
        gOut.endFill();
      } else if (outfitType === 'vest') {
        // Scholar Navy Vest
        gOut.lineStyle(2, 0x0f172a, 1.0);
        gOut.beginFill(0x1e293b, 1.0);
        gOut.drawRoundedRect(172, 270, 56, 45, 8);
        gOut.endFill();
        // Golden buttons
        gOut.beginFill(0xfbbf24, 1.0);
        gOut.drawCircle(200, 280, 2.5);
        gOut.drawCircle(200, 295, 2.5);
        gOut.endFill();
      } else if (outfitType === 'cape') {
        // Crimson Hero Cape
        gOut.lineStyle(2, 0x881337, 1.0);
        gOut.beginFill(0xe11d48, 1.0);
        gOut.drawPolygon([168, 255, 140, 320, 200, 305, 260, 320, 232, 255]);
        gOut.endFill();
        // Gold brooch
        gOut.beginFill(0xfbbf24, 1.0);
        gOut.drawCircle(200, 258, 6);
        gOut.endFill();
      } else if (outfitType === 'robe') {
        // Mystic Arcane Robe
        gOut.lineStyle(2, 0x3b0764, 1.0);
        gOut.beginFill(0x6b21a8, 1.0);
        gOut.drawRoundedRect(165, 265, 70, 60, 10);
        gOut.endFill();
        gOut.lineStyle(2, 0xfacc15, 1.0);
        gOut.moveTo(200, 265);
        gOut.lineTo(200, 325);
      }
      slotOutfit.addChild(gOut);
    }

    // 9. Head & Facial Anatomy
    const gFace = new PIXI.Graphics();
    // Head Contour with chubby cheek fluff
    gFace.lineStyle(2.5, hexToInt(pal.primaryDark), 0.9);
    gFace.beginFill(hexToInt(pal.primary), 1.0);
    gFace.moveTo(150, 150);
    gFace.bezierCurveTo(130, 175, 125, 220, 155, 235);
    gFace.quadraticCurveTo(200, 248, 245, 235);
    gFace.bezierCurveTo(275, 220, 270, 175, 250, 150);
    gFace.bezierCurveTo(230, 138, 170, 138, 150, 150);
    gFace.endFill();

    // Cream Lower Cheek & Muzzle Bib
    gFace.lineStyle(1.5, hexToInt(pal.bellyShadow), 0.8);
    gFace.beginFill(hexToInt(pal.belly), 1.0);
    gFace.moveTo(160, 210);
    gFace.quadraticCurveTo(145, 230, 170, 238);
    gFace.quadraticCurveTo(200, 244, 230, 238);
    gFace.quadraticCurveTo(255, 230, 240, 210);
    gFace.quadraticCurveTo(200, 218, 160, 210);
    gFace.endFill();
    slotFace.addChild(gFace);

    // 10. Fennec Ears (Outer Fur, Warm Pink Canal, Inner Fluff)
    const earType = mConfig.ears || 'fox';
    const gEars = new PIXI.Graphics();
    // Left Ear
    gEars.lineStyle(2.5, hexToInt(pal.primaryDark), 0.9);
    gEars.beginFill(hexToInt(pal.primary), 1.0);
    gEars.moveTo(165, 165);
    gEars.bezierCurveTo(140, 120, 100, 85, 95, 75);
    gEars.bezierCurveTo(125, 110, 155, 130, 178, 150);
    gEars.endFill();
    // Left Inner Ear Pink
    gEars.lineStyle(1, 0xf43f5e, 0.7);
    gEars.beginFill(hexToInt(pal.innerEar), 0.9);
    gEars.moveTo(160, 155);
    gEars.bezierCurveTo(140, 122, 112, 95, 108, 88);
    gEars.bezierCurveTo(128, 112, 148, 130, 168, 145);
    gEars.endFill();

    // Right Ear
    gEars.lineStyle(2.5, hexToInt(pal.primaryDark), 0.9);
    gEars.beginFill(hexToInt(pal.primary), 1.0);
    gEars.moveTo(235, 165);
    gEars.bezierCurveTo(260, 120, 300, 85, 305, 75);
    gEars.bezierCurveTo(275, 110, 245, 130, 222, 150);
    gEars.endFill();
    // Right Inner Ear Pink
    gEars.lineStyle(1, 0xf43f5e, 0.7);
    gEars.beginFill(hexToInt(pal.innerEar), 0.9);
    gEars.moveTo(240, 155);
    gEars.bezierCurveTo(260, 122, 288, 95, 292, 88);
    gEars.bezierCurveTo(272, 112, 252, 130, 232, 145);
    gEars.endFill();

    // White fluffy inner ear tufts
    gEars.lineStyle(0);
    gEars.beginFill(0xffffff, 0.9);
    gEars.drawPolygon([155, 152, 142, 140, 162, 146]);
    gEars.drawPolygon([245, 152, 258, 140, 238, 146]);
    gEars.endFill();
    slotEars.addChild(gEars);

    // 11. Curved Dragon Horns with Golden Segment Rings
    const gHorns = new PIXI.Graphics();
    // Left Horn
    gHorns.lineStyle(2, hexToInt(pal.hornBase), 1.0);
    gHorns.beginFill(hexToInt(pal.hornTip), 1.0);
    gHorns.moveTo(175, 145);
    gHorns.bezierCurveTo(165, 105, 140, 75, 135, 65);
    gHorns.bezierCurveTo(155, 80, 178, 110, 188, 140);
    gHorns.endFill();
    // Right Horn
    gHorns.moveTo(225, 145);
    gHorns.bezierCurveTo(235, 105, 260, 75, 265, 65);
    gHorns.bezierCurveTo(245, 80, 222, 110, 212, 140);
    gHorns.endFill();
    // Golden Ring Bands
    gHorns.lineStyle(2, 0xd97706, 1.0);
    gHorns.moveTo(168, 120); gHorns.lineTo(178, 123);
    gHorns.moveTo(232, 120); gHorns.lineTo(222, 123);
    slotHorns.addChild(gHorns);

    // 12. Boy Cowlick Tuft / Girl Ribbon Bow Crest
    const gCrest = new PIXI.Graphics();
    if (isGirl) {
      // Girl Style: Pastel Satin Ribbon Bow at Ear Base
      gCrest.lineStyle(1.5, 0xbe185d, 1.0);
      gCrest.beginFill(0xf472b6, 1.0);
      // Left bow loop
      gCrest.drawPolygon([172, 155, 155, 145, 158, 165]);
      // Right bow loop
      gCrest.drawPolygon([172, 155, 189, 145, 186, 165]);
      // Center knot
      gCrest.beginFill(0xfde047, 1.0);
      gCrest.drawCircle(172, 155, 4.5);
      gCrest.endFill();
    } else {
      // Boy Style: Spiky Swept Cowlick Plume
      gCrest.lineStyle(2, hexToInt(pal.primaryDark), 1.0);
      gCrest.beginFill(hexToInt(pal.primaryLight), 1.0);
      gCrest.moveTo(195, 142);
      gCrest.lineTo(200, 124);
      gCrest.lineTo(205, 142);
      gCrest.endFill();
    }
    slotCrest.addChild(gCrest);

    // 13. Anime Jewel Eyes with Cornea Reflex & Specular Highlights
    const eyeType = mConfig.eyes || 'round';
    const gEyes = new PIXI.Graphics();
    // Eyelid crease lines
    gEyes.lineStyle(2, 0x0f172a, 1.0);
    gEyes.moveTo(165, 180); gEyes.quadraticCurveTo(180, 172, 192, 180);
    gEyes.moveTo(208, 180); gEyes.quadraticCurveTo(220, 172, 235, 180);

    // Sclera (White base)
    gEyes.lineStyle(1.5, 0x0f172a, 1.0);
    gEyes.beginFill(0xffffff, 1.0);
    gEyes.drawEllipse(178, 192, 13, 16);
    gEyes.drawEllipse(222, 192, 13, 16);
    gEyes.endFill();

    // Iris (Deep Sapphire / Obsidian Gradient)
    gEyes.beginFill(0x0f172a, 1.0);
    gEyes.drawEllipse(178, 192, 11, 14);
    gEyes.drawEllipse(222, 192, 11, 14);
    gEyes.endFill();

    // Bottom Iris Luster (Purple / Blue bounce)
    gEyes.beginFill(hexToInt(pal.primary), 0.9);
    gEyes.drawEllipse(178, 197, 8, 7);
    gEyes.drawEllipse(222, 197, 8, 7);
    gEyes.endFill();

    // Dual Specular Catchlights (The Anime Sparkle)
    gEyes.lineStyle(0);
    gEyes.beginFill(0xffffff, 1.0);
    // Primary catchlight
    gEyes.drawCircle(174, 187, 4.5);
    gEyes.drawCircle(218, 187, 4.5);
    // Secondary reflex sparkle
    gEyes.drawCircle(182, 198, 2.2);
    gEyes.drawCircle(226, 198, 2.2);
    gEyes.endFill();
    slotEyes.addChild(gEyes);

    // Eyelid blink overlay (for procedural blink animation)
    const gBlink = new PIXI.Graphics();
    gBlink.lineStyle(2.5, 0x0f172a, 1.0);
    gBlink.beginFill(hexToInt(pal.primary), 1.0);
    gBlink.drawRoundedRect(162, 176, 32, 24, 6);
    gBlink.drawRoundedRect(206, 176, 32, 24, 6);
    gBlink.endFill();
    gBlink.visible = false;
    slotEyes.addChild(gBlink);

    // 14. Sweet Button Nose & Feline Joy Smile (:3)
    const gMuzzle = new PIXI.Graphics();
    // Soft dark nose
    gMuzzle.beginFill(0x0f172a, 1.0);
    gMuzzle.drawEllipse(200, 206, 4, 3);
    gMuzzle.endFill();
    // Smile lines
    gMuzzle.lineStyle(2, 0x0f172a, 1.0);
    gMuzzle.moveTo(194, 212);
    gMuzzle.quadraticCurveTo(197, 217, 200, 213);
    gMuzzle.quadraticCurveTo(203, 217, 206, 212);
    slotMuzzle.addChild(gMuzzle);

    // 15. Rosy Cheek Blush
    const gBlush = new PIXI.Graphics();
    gBlush.beginFill(0xf43f5e, 0.35);
    gBlush.drawEllipse(158, 208, 10, 6);
    gBlush.drawEllipse(242, 208, 10, 6);
    gBlush.endFill();
    slotBlush.addChild(gBlush);

    // 16. Equipped Accessory (Crown, Satin Bow, Scout Bandana, Glasses, Badge)
    const accType = mConfig.accessory;
    if (accType && accType !== 'none') {
      const gAcc = new PIXI.Graphics();
      if (accType === 'crown') {
        // Monarch 3D Golden Crown with Ruby Jewels
        gAcc.lineStyle(2, 0xb45309, 1.0);
        gAcc.beginFill(0xfbbf24, 1.0);
        gAcc.drawPolygon([172, 138, 170, 110, 185, 125, 200, 95, 215, 125, 230, 110, 228, 138]);
        gAcc.endFill();
        // Ruby jewels
        gAcc.beginFill(0xe11d48, 1.0);
        gAcc.drawCircle(170, 110, 3.5);
        gAcc.drawCircle(200, 95, 4.5);
        gAcc.drawCircle(230, 110, 3.5);
        gAcc.endFill();
      } else if (accType === 'bow') {
        // Satin Ribbon Bow
        gAcc.lineStyle(2, 0x0284c7, 1.0);
        gAcc.beginFill(0x38bdf8, 1.0);
        gAcc.drawPolygon([200, 252, 180, 240, 182, 264]);
        gAcc.drawPolygon([200, 252, 220, 240, 218, 264]);
        gAcc.beginFill(0xffffff, 1.0);
        gAcc.drawCircle(200, 252, 4);
        gAcc.endFill();
      } else if (accType === 'bandana') {
        // Heroic Red Folded Kerchief
        gAcc.lineStyle(2, 0x991b1b, 1.0);
        gAcc.beginFill(0xef4444, 1.0);
        gAcc.drawPolygon([180, 245, 220, 245, 200, 275]);
        gAcc.endFill();
      } else if (accType === 'glasses') {
        // Round Wire Spectacles
        gAcc.lineStyle(2.5, 0xf59e0b, 1.0);
        gAcc.drawCircle(178, 192, 15);
        gAcc.drawCircle(222, 192, 15);
        gAcc.moveTo(193, 192); gAcc.lineTo(207, 192);
      } else if (accType === 'badge') {
        // Academy Guild Medal
        gAcc.lineStyle(1.5, 0xb45309, 1.0);
        gAcc.beginFill(0xf59e0b, 1.0);
        gAcc.drawCircle(188, 280, 8);
        gAcc.endFill();
      }
      slotAccessory.addChild(gAcc);
    }

    // -------------------------------------------------------------
    // Procedural Rigged Animation Loop (Sine-Wave Breathing + Wag + Blinking)
    // -------------------------------------------------------------
    let animTime = 0;
    let blinkTimer = 0;
    const tickerUpdate = (delta) => {
      if (!animated) return;
      animTime += 0.04 * delta;
      blinkTimer += 0.016 * delta;

      // 1. Subtle rhythmic chest & haunches breathing
      const breath = Math.sin(animTime * 2.2) * 1.5;
      slotChest.position.y = breath;
      slotHead.position.y = breath * 0.8;

      // 2. Majestic tail wagging oscillation
      const tailSweep = Math.sin(animTime * 1.8) * 0.08;
      slotTail.rotation = tailSweep;

      // 3. Subtle ear flick
      const earFlick = Math.sin(animTime * 2.5) * 0.03;
      slotEars.rotation = earFlick;

      // 4. Procedural natural eye blinking (every ~3.5s)
      if (blinkTimer > 3.5) {
        gBlink.visible = true;
        if (blinkTimer > 3.65) {
          gBlink.visible = false;
          blinkTimer = 0;
        }
      }
    };

    return { container: charContainer, tickerUpdate };
  }

  // =========================================================================
  // 7. CANONICAL MONSTER RENDERER API (PIXIJS WEB RUNTIME)
  // =========================================================================
  const MonsterRenderer = {
    SPINE_SPEC: SPINE_SPEC,
    palettes: FUR_PALETTES,
    stages: EVOLUTION_STAGES,

    getStageInfo(stageIdxOrKey) {
      if (typeof stageIdxOrKey === 'number') {
        return EVOLUTION_STAGES[stageIdxOrKey] || EVOLUTION_STAGES[4];
      }
      return EVOLUTION_STAGES.find(s => s.key === stageIdxOrKey) || EVOLUTION_STAGES[4];
    },

    getMonsterStageImage(stageKey) {
      const stg = this.getStageInfo(stageKey);
      return 'assets/monsters/canonical/stage-' + stg.level + '-' + stg.key + '-blue.png';
    },

    /**
     * Canonical Mount Method:
     * Mounts a live, rigged PixiJS canvas application into a target DOM container.
     */
    mount(targetContainerOrSelector, configOrStudentOrId, options = {}) {
      if (typeof document === 'undefined') return null;
      let el = null;
      if (typeof targetContainerOrSelector === 'string') {
        el = document.querySelector(targetContainerOrSelector);
      } else if (targetContainerOrSelector && targetContainerOrSelector.nodeType) {
        el = targetContainerOrSelector;
      }
      if (!el) return null;

      // Resolve monster configuration
      let mConfig = configOrStudentOrId;
      if (typeof configOrStudentOrId === 'string' || (configOrStudentOrId && configOrStudentOrId.id)) {
        const studentId = typeof configOrStudentOrId === 'string' ? configOrStudentOrId : configOrStudentOrId.id;
        mConfig = MonsterService.getMonster(studentId);
      } else if (!mConfig) {
        mConfig = MonsterService.getMonster(null);
      }

      // Cleanup existing Pixi instance on this container to prevent leaks
      this.destroy(el);

      const size = options.size || 400;

      // Check if PIXI is available
      const PIXI = root.PIXI;
      if (!PIXI) {
        el.innerHTML = '<div class="pixi-loading-placeholder" style="width:' + size + 'px; height:' + size + 'px; display:flex; align-items:center; justify-content:center; color:#38bdf8; font-weight:800;">✨ Initializing Canvas...</div>';
        setTimeout(() => {
          if (root.PIXI) this.mount(el, mConfig, options);
        }, 100);
        return null;
      }

      // Initialize real PIXI.Application
      const app = new PIXI.Application({
        width: 400,
        height: 400,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(2, root.devicePixelRatio || 1),
        autoDensity: true
      });

      const canvas = app.view;
      canvas.className = 'monster-pixi-canvas' + (options.className ? ' ' + options.className : '');
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%';
      canvas.style.aspectRatio = '1 / 1';
      if (options.round) canvas.style.borderRadius = '50%';

      // Build rigged character display object
      const { container, tickerUpdate } = createCharacterDisplayObject(PIXI, mConfig, options);
      app.stage.addChild(container);

      // Add ticker update for dynamic breathing, blinking & tail wagging
      if (options.animated !== false) {
        app.ticker.add(tickerUpdate);
      }

      // Mount into container
      el.innerHTML = '';
      el.appendChild(canvas);

      // Register active instance
      activePixiInstances.set(el, { app, config: mConfig, options });
      return canvas;
    },

    /**
     * Synchronous Render helper:
     * Generates a self-mounting host container element with immediate Pixi canvas mounting.
     */
    render(configOrStudentOrId, options = {}) {
      const size = options.size || 400;
      const hostId = 'monster-pixi-host-' + Math.random().toString(36).substr(2, 9);
      const studentId = typeof configOrStudentOrId === 'string' ? configOrStudentOrId : (configOrStudentOrId && configOrStudentOrId.id ? configOrStudentOrId.id : '');

      // Schedule immediate canvas mounting on the next animation frame
      if (typeof root.requestAnimationFrame !== 'undefined') {
        root.requestAnimationFrame(() => {
          const hostEl = document.getElementById(hostId);
          if (hostEl) {
            MonsterRenderer.mount(hostEl, configOrStudentOrId, options);
          }
        });
      }

      // Return host markup
      const roundStyle = options.round ? 'border-radius:50%; overflow:hidden;' : '';
      return '<div id="' + hostId + '" class="monster-pixi-host" data-student-id="' + studentId + '" style="width:' + size + 'px; height:' + size + 'px; min-width:' + size + 'px; min-height:' + size + 'px; display:inline-flex; align-items:center; justify-content:center; position:relative; ' + roundStyle + ' ' + (options.style || '') + '"></div>';
    },

    /**
     * Updates an existing mounted Pixi instance on a container
     */
    update(targetContainerOrSelector, updates) {
      let el = null;
      if (typeof targetContainerOrSelector === 'string') el = document.querySelector(targetContainerOrSelector);
      else if (targetContainerOrSelector && targetContainerOrSelector.nodeType) el = targetContainerOrSelector;
      if (!el) return;

      const instance = activePixiInstances.get(el);
      if (instance) {
        const mergedConfig = Object.assign({}, instance.config, updates);
        this.mount(el, mergedConfig, instance.options);
      }
    },

    /**
     * Destroys Pixi application on container and frees GPU textures
     */
    destroy(targetContainerOrSelector) {
      let el = null;
      if (typeof targetContainerOrSelector === 'string') el = document.querySelector(targetContainerOrSelector);
      else if (targetContainerOrSelector && targetContainerOrSelector.nodeType) el = targetContainerOrSelector;
      if (!el) return;

      if (activePixiInstances.has(el)) {
        const { app } = activePixiInstances.get(el);
        try {
          app.destroy(true, { children: true, texture: false });
        } catch (e) {
          console.warn('[MonsterRenderer] Pixi destroy warning:', e);
        }
        activePixiInstances.delete(el);
      }
    },

    /**
     * Destroys all active instances (e.g. on view transitions)
     */
    destroyAll() {
      activePixiInstances.forEach((val, key) => {
        try {
          val.app.destroy(true, { children: true, texture: false });
        } catch (e) {}
      });
      activePixiInstances.clear();
    },

    /**
     * Universal avatar renderer for tables, lists, and cards
     */
    renderMonsterAvatar(studentOrId, options = {}) {
      const size = options.size || 54;
      return this.render(studentOrId, Object.assign({}, options, { size, round: options.round !== false }));
    },

    // Backward compatibility bridges
    renderMonsterArtwork(opts) {
      return this.render(opts, opts);
    },
    renderMonsterSVG(opts) {
      return this.render(opts, opts);
    }
  };

  // Expose canonical APIs globally
  root.MonsterService = MonsterService;
  root.MonsterRenderer = MonsterRenderer;
  root.renderMonsterAvatar = function(studentOrId, options) {
    return MonsterRenderer.renderMonsterAvatar(studentOrId, options);
  };
  root.renderStudentMonsterAvatar = function(studentId, options) {
    return MonsterRenderer.renderMonsterAvatar(studentId, options);
  };
  root.renderMonster = function(opts, options) {
    return MonsterRenderer.render(opts, options || opts);
  };

})(typeof window !== 'undefined' ? window : global);
