/**
 * ENGLISH ADVENTURE ACADEMY — HIGH-QUALITY ILLUSTRATED MONSTER COMPOSITOR
 * 
 * Production illustrated asset compositor.
 * Replaces procedural vector shapes with high-quality transparent art layers
 * matching the project's original fantasy companion art style.
 * 
 * Features:
 * - 100% Layer-based Illustrated Asset Compositor
 * - High-resolution transparent PNG layers (512x512 normalized space)
 * - 6 Illustrated Fur Palettes (Sky Blue, Berry Pink, Leaf Green, Sunset Orange, Lavender Purple, Royal Gold)
 * - 8 Illustrated Painted Eye Expressions
 * - 6 Illustrated Expressive Mouth Sculptures
 * - 5 Sculpted 3D Horn Sets
 * - 5 Species Ears Sets
 * - 6 Detailed Outfits wrapping character anatomy
 * - 4 Layered Fantasy Wings & 4 Animated Tails
 * - 7 High-Resolution Illustrated Fantasy World Environments
 * - Non-destructive colorization preserving highlights, textures, and 3D shadows
 * - Zero external dependencies, instant zero-lag compositing
 */

(function(root) {
  'use strict';

  // 7 Canonical Evolution Stages
  const EVOLUTION_STAGES = [
    {
      level: 1,
      stageKey: 'egg',
      name: 'Mystery Egg',
      subtitle: 'A new adventure begins...',
      xpRequired: 0,
      image: 'assets/monsters/stage-1-mystery-egg.png',
      unlockedFeatures: ['Mystery Egg Hatching Glow']
    },
    {
      level: 2,
      stageKey: 'cracking_egg',
      name: 'Cracking Egg',
      subtitle: 'Life is waking up!',
      xpRequired: 100,
      image: 'assets/monsters/stage-2-cracking-egg.png',
      unlockedFeatures: ['Curious Chirps', 'First Cracks']
    },
    {
      level: 3,
      stageKey: 'baby',
      name: 'Baby Monster',
      subtitle: 'Small steps, big dreams!',
      xpRequired: 250,
      image: 'assets/monsters/stage-3-baby-monster.png',
      unlockedFeatures: ['Soft Baby Paws', 'Cute Smile', 'Starter Horns']
    },
    {
      level: 4,
      stageKey: 'growing',
      name: 'Growing Monster',
      subtitle: 'Stronger every day!',
      xpRequired: 500,
      image: 'assets/monsters/stage-4-growing-monster.png',
      unlockedFeatures: ['Curved Horns', 'Fluffy Tail', 'Explorer Vest']
    },
    {
      level: 5,
      stageKey: 'adventurer',
      name: 'Adventurer Monster',
      subtitle: 'Ready for bigger quests!',
      xpRequired: 1000,
      image: 'assets/monsters/stage-5-adventurer-monster.png',
      unlockedFeatures: ['Golden Horns', 'Adventure Pack', 'Hero Aura']
    },
    {
      level: 6,
      stageKey: 'advanced',
      name: 'Advanced Monster',
      subtitle: 'New powers, new places!',
      xpRequired: 2000,
      image: 'assets/monsters/stage-6-advanced-monster.png',
      unlockedFeatures: ['Crystal Horns', 'Fairy Wings', 'Wizard Robe']
    },
    {
      level: 7,
      stageKey: 'ultimate',
      name: 'Ultimate Monster',
      subtitle: 'A true hero!',
      xpRequired: 5000,
      image: 'assets/monsters/stage-7-ultimate-monster.png',
      unlockedFeatures: ['Celestial Wings', 'Royal Crown', 'Cosmic Aura']
    }
  ];

  // Layer Placement Coordinates (percentage of container)
  const ITEM_OFFSETS = {
    // Horns
    'horns-gold': { top: '3%', left: '18%', width: '64%', zIndex: 5 },
    'horns-curved': { top: '3%', left: '18%', width: '64%', zIndex: 5 },
    'horns-crystal': { top: '1%', left: '33%', width: '34%', zIndex: 5 },
    'horns-dragon': { top: '8%', left: '14%', width: '72%', zIndex: 5 },
    'horns-cosmic': { top: '5%', left: '18%', width: '64%', zIndex: 5 },
    'horns-star': { top: '5%', left: '18%', width: '64%', zIndex: 5 },
    'horns-starter': { top: '15%', left: '36%', width: '28%', zIndex: 5 },
    'horns-nub': { top: '15%', left: '36%', width: '28%', zIndex: 5 },
    'horns-nature': { top: '5%', left: '18%', width: '64%', zIndex: 5 },
    'horns-flame': { top: '3%', left: '18%', width: '64%', zIndex: 5 },
    'horns-ice': { top: '1%', left: '33%', width: '34%', zIndex: 5 },

    // Ears
    'ears-default': { top: '8%', left: '24%', width: '52%', zIndex: 4 },
    'horns-ears': { top: '8%', left: '24%', width: '52%', zIndex: 4 },
    'ears-fox': { top: '6%', left: '24%', width: '52%', zIndex: 4 },
    'ears-cat': { top: '10%', left: '25%', width: '50%', zIndex: 4 },
    'ears-dragon': { top: '10%', left: '22%', width: '56%', zIndex: 4 },
    'ears-elf': { top: '12%', left: '18%', width: '64%', zIndex: 4 },

    // Outfits
    'clothing-vest': { top: '47%', left: '34%', width: '33%', zIndex: 6 },
    'clothing-cape': { top: '47%', left: '34%', width: '33%', zIndex: 6 },
    'clothing-adv-jacket': { top: '47%', left: '34%', width: '33%', zIndex: 6 },
    'clothing-robe': { top: '42%', left: '31%', width: '38%', zIndex: 6 },
    'clothing-knight': { top: '46%', left: '32%', width: '36%', zIndex: 6 },
    'clothing-knight-armor': { top: '46%', left: '32%', width: '36%', zIndex: 6 },
    'clothing-scientist': { top: '44%', left: '32%', width: '36%', zIndex: 6 },
    'clothing-travel-coat': { top: '44%', left: '32%', width: '36%', zIndex: 6 },
    'clothing-space': { top: '44%', left: '32%', width: '36%', zIndex: 6 },
    'clothing-uniform': { top: '47%', left: '33%', width: '34%', zIndex: 6 },
    'clothing-scarf': { top: '47%', left: '33%', width: '34%', zIndex: 6 },
    'clothing-hoodie': { top: '47%', left: '33%', width: '34%', zIndex: 6 },

    // Wings
    'wings-fairy': { top: '4%', left: '15%', width: '70%', zIndex: 2 },
    'wings-crystal': { top: '4%', left: '15%', width: '70%', zIndex: 2 },
    'wings-dragon': { top: '6%', left: '16%', width: '68%', zIndex: 2 },
    'wings-cosmic': { top: '4%', left: '14%', width: '72%', zIndex: 2 },
    'wings-celestial': { top: '4%', left: '14%', width: '72%', zIndex: 2 },
    'wings-starter': { top: '4%', left: '15%', width: '70%', zIndex: 2 },

    // Tails
    'tail-puff': { top: '40%', left: '8%', width: '30%', zIndex: 2 },
    'tail-perky': { top: '35%', left: '6%', width: '34%', zIndex: 2 },
    'tail-dragon': { top: '40%', left: '4%', width: '38%', zIndex: 2 },
    'tail-star': { top: '38%', left: '6%', width: '34%', zIndex: 2 },
    'tail-flame': { top: '38%', left: '6%', width: '34%', zIndex: 2 },

    // Eyes
    defaultEyes: { top: '25%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-sparkle': { top: '25%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-happy': { top: '27%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-wink': { top: '25%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-brave': { top: '25%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-sleepy': { top: '25%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-star': { top: '25%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-galaxy': { top: '25%', left: '38%', width: '26%', zIndex: 7 },
    'eyes-dragon': { top: '25%', left: '38%', width: '26%', zIndex: 7 },

    // Mouths
    defaultMouth: { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-smile': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-tiny': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-grin': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-toothy': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-cheer': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-excited': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-sleepy': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-brave': { top: '35%', left: '40%', width: '22%', zIndex: 8 },
    'mouth-dragon': { top: '35%', left: '40%', width: '22%', zIndex: 8 }
  };

  function normalizeStageKey(key) {
    if (!key) return 'growing';
    const s = String(key).toLowerCase();
    if (s.includes('1') || s === 'egg') return 'egg';
    if (s.includes('2') || s === 'cracking' || s === 'cracking_egg') return 'cracking_egg';
    if (s.includes('3') || s === 'baby') return 'baby';
    if (s.includes('4') || s === 'growing') return 'growing';
    if (s.includes('5') || s === 'adventurer') return 'adventurer';
    if (s.includes('6') || s === 'advanced') return 'advanced';
    if (s.includes('7') || s === 'ultimate') return 'ultimate';
    return 'growing';
  }

  function getMonsterForEvolution(levelOrKeyOrXP) {
    if (typeof levelOrKeyOrXP === 'number') {
      if (levelOrKeyOrXP >= 1 && levelOrKeyOrXP <= 7) {
        return EVOLUTION_STAGES.find(s => s.level === levelOrKeyOrXP) || EVOLUTION_STAGES[3];
      }
      let match = EVOLUTION_STAGES[0];
      for (let i = 0; i < EVOLUTION_STAGES.length; i++) {
        if (levelOrKeyOrXP >= EVOLUTION_STAGES[i].xpRequired) {
          match = EVOLUTION_STAGES[i];
        } else {
          break;
        }
      }
      return match;
    }
    const key = normalizeStageKey(levelOrKeyOrXP);
    return EVOLUTION_STAGES.find(s => s.stageKey === key) || EVOLUTION_STAGES[3];
  }

  function getMonsterStageImage(stageKey) {
    const evo = getMonsterForEvolution(stageKey);
    return evo.image || 'assets/monsters/stage-4-growing-monster.png';
  }

  /**
   * High-Quality Layered Illustrated Compositor
   */
  function renderMonsterArtwork(options = {}) {
    const size = options.size || 256;
    const stage = normalizeStageKey(options.stage || options.level || options.xp);
    const color = (options.color || (options.equipped && options.equipped.body) || 'blue').replace('body-', '');
    const eq = options.equipped || {};
    const isRound = options.round !== false;
    const borderRadius = typeof options.radius === 'number' ? options.radius + 'px' : (isRound ? (size >= 100 ? '20px' : '12px') : '0px');
    const showWorld = options.showWorld !== false && !options.transparent;
    const animated = options.animated !== false;
    const paused = options.paused === true || !animated;

    // 1. Egg Stages (render painted egg art)
    if (stage === 'egg') {
      return `
        <div class="monster-compositor-box ${options.className || ''}" style="width:${size}px; height:${size}px; position:relative; overflow:hidden; border-radius:${borderRadius}; display:inline-block; vertical-align:middle; background:#0b132b; ${options.style || ''}">
          <img src="assets/monsters/stage-1-mystery-egg.png" alt="Mystery Egg" style="width:100%; height:100%; object-fit:cover;" />
        </div>
      `.trim();
    }
    if (stage === 'cracking_egg') {
      return `
        <div class="monster-compositor-box ${options.className || ''}" style="width:${size}px; height:${size}px; position:relative; overflow:hidden; border-radius:${borderRadius}; display:inline-block; vertical-align:middle; background:#0b132b; ${options.style || ''}">
          <img src="assets/monsters/stage-2-cracking-egg.png" alt="Cracking Egg" style="width:100%; height:100%; object-fit:cover;" />
        </div>
      `.trim();
    }

    // 2. Character Assembly from High-Quality Illustrated Transparent Layers
    const layers = [];

    // Layer 1: Scenic World Background
    if (showWorld) {
      const bgId = eq.background || 'bg-meadow';
      const bgFile = (bgId === 'bg-cosmos' || bgId === 'bg-space') ? 'bg-cosmos.jpg' : 
                     (bgId === 'bg-forest') ? 'bg-forest.jpg' :
                     (bgId === 'bg-volcano') ? 'bg-volcano.jpg' :
                     (bgId === 'bg-winter') ? 'bg-winter.jpg' :
                     (bgId === 'bg-cloud') ? 'bg-cloud.jpg' : 'bg-meadow.jpg';

      layers.push(`
        <img class="monster-layer layer-world" src="assets/monsters/layers/worlds/${bgFile}" alt="World" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:1; pointer-events:none;" />
      `);
    }

    // Layer 2: Wings (Behind Body)
    const wingId = eq.wings && eq.wings !== 'none' ? eq.wings : null;
    if (wingId) {
      const wOff = ITEM_OFFSETS[wingId] || ITEM_OFFSETS['wings-fairy'];
      const wFile = (wingId.includes('crystal')) ? 'wings-crystal.png' :
                    (wingId.includes('dragon')) ? 'wings-dragon.png' :
                    (wingId.includes('cosmic') || wingId.includes('celestial')) ? 'wings-cosmic.png' : 'wings-fairy.png';

      layers.push(`
        <img class="monster-layer layer-wings ${animated && !paused ? 'eaa-monster-wing-anim' : ''}" src="assets/monsters/layers/wings/${wFile}" alt="Wings" style="position:absolute; top:${wOff.top}; left:${wOff.left}; width:${wOff.width}; z-index:2; pointer-events:none;" />
      `);
    }

    // Layer 3: Tail (Behind Body)
    const tailId = eq.tail && eq.tail !== 'none' ? eq.tail : 'tail-perky';
    if (tailId) {
      const tOff = ITEM_OFFSETS[tailId] || ITEM_OFFSETS['tail-perky'];
      const tFile = (tailId.includes('puff')) ? 'tail-puff.png' :
                    (tailId.includes('dragon')) ? 'tail-dragon.png' :
                    (tailId.includes('star') || tailId.includes('flame')) ? 'tail-star.png' : 'tail-perky.png';

      layers.push(`
        <img class="monster-layer layer-tail ${animated && !paused ? 'eaa-monster-tail-anim' : ''}" src="assets/monsters/layers/tail/${tFile}" alt="Tail" style="position:absolute; top:${tOff.top}; left:${tOff.left}; width:${tOff.width}; z-index:2; pointer-events:none;" />
      `);
    }

    // Layer 4: Master Body Base with Illustrated Fur Color
    const validColors = ['blue', 'pink', 'green', 'orange', 'purple', 'gold'];
    const colKey = validColors.includes(color) ? color : 'blue';
    layers.push(`
      <img class="monster-layer layer-body" src="assets/monsters/layers/body/body-${colKey}.png" alt="Body" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:3; pointer-events:none;" />
    `);

    // Layer 5: Species Ears
    const earId = eq.ears && eq.ears !== 'none' ? eq.ears : (eq.horns === 'horns-ears' ? 'horns-ears' : 'ears-default');
    if (earId && earId !== 'none') {
      const eOff = ITEM_OFFSETS[earId] || ITEM_OFFSETS['ears-default'];
      const eFile = (earId.includes('fox')) ? 'ears-fox.png' :
                    (earId.includes('cat')) ? 'ears-cat.png' :
                    (earId.includes('dragon')) ? 'ears-dragon.png' :
                    (earId.includes('elf')) ? 'ears-elf.png' : 'ears-default.png';

      layers.push(`
        <img class="monster-layer layer-ears" src="assets/monsters/layers/ears/${eFile}" alt="Ears" style="position:absolute; top:${eOff.top}; left:${eOff.left}; width:${eOff.width}; z-index:4; pointer-events:none;" />
      `);
    }

    // Layer 6: 3D Sculpted Horns
    const hornId = eq.horns && eq.horns !== 'none' && eq.horns !== 'horns-ears' ? eq.horns : 'horns-gold';
    if (hornId && hornId !== 'none' && hornId !== 'horns-ears') {
      const hOff = ITEM_OFFSETS[hornId] || ITEM_OFFSETS['horns-gold'];
      const hFile = (hornId.includes('crystal') || hornId.includes('ice')) ? 'horns-crystal.png' :
                    (hornId.includes('dragon')) ? 'horns-dragon.png' :
                    (hornId.includes('cosmic') || hornId.includes('star')) ? 'horns-cosmic.png' :
                    (hornId.includes('starter') || hornId.includes('nub')) ? 'horns-starter.png' : 'horns-gold.png';

      layers.push(`
        <img class="monster-layer layer-horns" src="assets/monsters/layers/horns/${hFile}" alt="Horns" style="position:absolute; top:${hOff.top}; left:${hOff.left}; width:${hOff.width}; z-index:5; pointer-events:none;" />
      `);
    }

    // Layer 7: Dimensional Clothing
    const clothId = eq.clothing && eq.clothing !== 'none' ? eq.clothing : 'clothing-vest';
    if (clothId && clothId !== 'none') {
      const cOff = ITEM_OFFSETS[clothId] || ITEM_OFFSETS['clothing-vest'];
      const cFile = (clothId.includes('robe')) ? 'clothing-robe.png' :
                    (clothId.includes('knight')) ? 'clothing-knight-armor.png' :
                    (clothId.includes('scientist') || clothId.includes('travel')) ? 'clothing-scientist.png' :
                    (clothId.includes('space')) ? 'clothing-space.png' :
                    (clothId.includes('uniform') || clothId.includes('scarf') || clothId.includes('hoodie')) ? 'clothing-uniform.png' : 'clothing-vest.png';

      layers.push(`
        <img class="monster-layer layer-clothing" src="assets/monsters/layers/clothing/${cFile}" alt="Clothing" style="position:absolute; top:${cOff.top}; left:${cOff.left}; width:${cOff.width}; z-index:6; pointer-events:none;" />
      `);
    }

    // Layer 8: Expressive Glossy Eyes
    const eyeId = eq.eyes && eq.eyes !== 'none' ? eq.eyes : 'eyes-sparkle';
    const eyOff = ITEM_OFFSETS[eyeId] || ITEM_OFFSETS.defaultEyes;
    const eyFile = (eyeId.includes('happy')) ? 'eyes-happy.png' :
                   (eyeId.includes('wink')) ? 'eyes-wink.png' :
                   (eyeId.includes('brave')) ? 'eyes-brave.png' :
                   (eyeId.includes('sleepy')) ? 'eyes-sleepy.png' :
                   (eyeId.includes('star')) ? 'eyes-star.png' :
                   (eyeId.includes('galaxy')) ? 'eyes-galaxy.png' :
                   (eyeId.includes('dragon')) ? 'eyes-dragon.png' : 'eyes-sparkle.png';

    layers.push(`
      <img class="monster-layer layer-eyes" src="assets/monsters/layers/eyes/${eyFile}" alt="Eyes" style="position:absolute; top:${eyOff.top}; left:${eyOff.left}; width:${eyOff.width}; z-index:7; pointer-events:none;" />
    `);

    // Layer 9: Expressive Painted Mouth & Snout
    const mouthId = eq.mouth && eq.mouth !== 'none' ? eq.mouth : 'mouth-smile';
    const mOff = ITEM_OFFSETS[mouthId] || ITEM_OFFSETS.defaultMouth;
    const mFile = (mouthId.includes('grin') || mouthId.includes('toothy')) ? 'mouth-grin.png' :
                  (mouthId.includes('cheer') || mouthId.includes('excited')) ? 'mouth-cheer.png' :
                  (mouthId.includes('sleepy')) ? 'mouth-sleepy.png' :
                  (mouthId.includes('brave')) ? 'mouth-brave.png' :
                  (mouthId.includes('dragon')) ? 'mouth-dragon.png' : 'mouth-smile.png';

    layers.push(`
      <img class="monster-layer layer-mouth" src="assets/monsters/layers/mouths/${mFile}" alt="Mouth" style="position:absolute; top:${mOff.top}; left:${mOff.left}; width:${mOff.width}; z-index:8; pointer-events:none;" />
    `);

    const animClass = animated ? 'eaa-monster-artwork-anim' : '';
    const pauseClass = paused ? 'is-paused' : '';

    return `
      <div class="monster-compositor-box ${animClass} ${pauseClass} ${options.className || ''}" style="width:${size}px; height:${size}px; position:relative; overflow:hidden; border-radius:${borderRadius}; display:inline-block; vertical-align:middle; background:${showWorld ? 'transparent' : 'rgba(15,23,42,0.04)'}; user-select:none; ${options.style || ''}">
        ${layers.join('\n')}
      </div>
    `.trim();
  }

  /**
   * Backwards-compatible drop-in for renderMonsterSVG
   */
  function renderMonsterSVG(options = {}) {
    return renderMonsterArtwork(options);
  }

  /**
   * Catalog item thumbnail generator
   */
  function renderMonsterItemThumbnail(item, options = {}) {
    if (!item) return '';
    const size = options.size || 48;

    if (item.category === 'body') {
      const colKey = item.id.replace('body-', '');
      return `
        <div style="width:${size}px; height:${size}px; border-radius:10px; overflow:hidden; position:relative; background:#0f172a; display:flex; align-items:center; justify-content:center;">
          <img src="assets/monsters/layers/body/body-${colKey}.png" style="width:120%; height:120%; object-fit:contain;" alt="${item.name}" />
        </div>
      `.trim();
    }

    let src = '';
    if (item.category === 'eyes') src = `assets/monsters/layers/eyes/${item.id}.png`;
    else if (item.category === 'horns') src = `assets/monsters/layers/horns/${item.id}.png`;
    else if (item.category === 'clothing') src = `assets/monsters/layers/clothing/${item.id}.png`;
    else if (item.category === 'wings') src = `assets/monsters/layers/wings/${item.id}.png`;
    else if (item.category === 'ears') src = `assets/monsters/layers/ears/${item.id}.png`;
    else if (item.category === 'tail') src = `assets/monsters/layers/tail/${item.id}.png`;
    else if (item.category === 'mouth') src = `assets/monsters/layers/mouths/${item.id}.png`;
    else if (item.category === 'background') src = `assets/monsters/layers/worlds/${item.id}.jpg`;

    if (src) {
      return `
        <div style="width:${size}px; height:${size}px; border-radius:10px; overflow:hidden; position:relative; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; padding:4px;">
          <img src="${src}" style="width:100%; height:100%; object-fit:contain;" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
          <span style="display:none; font-size:${size*0.5}px;">${item.icon || '✨'}</span>
        </div>
      `.trim();
    }

    return `
      <div style="width:${size}px; height:${size}px; border-radius:10px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-size:${size*0.5}px;">
        ${item.icon || '✨'}
      </div>
    `.trim();
  }

  function renderMonsterEvolutionStagesBanner() {
    const stages = EVOLUTION_STAGES;
    return `
      <div class="monster-evolution-upgrade-banner" style="background:linear-gradient(180deg, #071328 0%, #0c1e3d 100%); border-radius:20px; padding:24px; color:#fff; box-shadow:0 12px 36px rgba(0,0,0,0.4); margin-bottom:24px; border:1px solid rgba(56,189,248,0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.4rem;">👾</span>
              <h2 style="font-size:1.35rem; font-weight:900; margin:0; letter-spacing:0.02em; color:#fff;">Monster Evolution Upgrade (Visual Progression)</h2>
            </div>
            <p style="font-size:0.84rem; color:#94a3b8; margin:4px 0 0 0;">A real visual evolution, not just accessories. Monsters grow and change as students earn XP!</p>
          </div>
          <div style="font-size:0.75rem; color:#38bdf8; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">
            Same Spirit • Greater Growth • More Adventures • A Brighter You!
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; align-items:stretch;">
          ${stages.map((st, idx) => `
            <div class="evolution-stage-card-premium" style="background:rgba(15,23,42,0.85); border:1.5px solid ${idx === 6 ? '#f59e0b' : 'rgba(56,189,248,0.3)'}; border-radius:14px; padding:12px 10px; display:flex; flex-direction:column; align-items:center; text-align:center; transition:transform 0.2s ease, box-shadow 0.2s ease; position:relative;">
              <div style="font-size:0.68rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:2px;">Level ${st.level}</div>
              <div style="font-size:0.82rem; font-weight:900; color:#f8fafc; margin-bottom:8px; line-height:1.2;">${st.name}</div>
              
              <div style="width:100%; aspect-ratio:1; border-radius:10px; overflow:hidden; margin-bottom:8px; background:#020617; border:1px solid rgba(255,255,255,0.1); box-shadow:inset 0 2px 8px rgba(0,0,0,0.6);">
                <img src="${getMonsterStageImage(st.stageKey)}" alt="${st.name}" style="width:100%; height:100%; object-fit:cover; display:block;" />
              </div>

              <div style="font-size:0.78rem; font-weight:900; color:#fbbf24; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); padding:3px 10px; border-radius:12px; margin-bottom:6px; width:90%;">
                ${st.xpRequired.toLocaleString()} XP
              </div>
              <div style="font-size:0.68rem; color:#cbd5e1; line-height:1.3; font-style:italic;">
                "${st.subtitle}"
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `.trim();
  }

  function getStageInfo(stageKey) {
    return getMonsterForEvolution(stageKey);
  }

  const MonsterEvolutionRenderer = {
    getMonsterForEvolution: getMonsterForEvolution,
    getMonsterStageImage: getMonsterStageImage,
    renderMonsterArtwork: renderMonsterArtwork,
    renderMonsterEvolutionStagesBanner: renderMonsterEvolutionStagesBanner,
    renderMonsterSVG: renderMonsterSVG,
    renderModularMonsterSVG: renderMonsterSVG,
    renderMonsterItemThumbnail: renderMonsterItemThumbnail,
    getStageInfo: getStageInfo,
    stages: EVOLUTION_STAGES,
    EVOLUTION_STAGES: EVOLUTION_STAGES
  };

  root.MonsterEvolutionRenderer = MonsterEvolutionRenderer;
  root.MonsterRenderer = MonsterEvolutionRenderer;
  root.getMonsterForEvolution = getMonsterForEvolution;
  root.renderMonsterSVG = renderMonsterSVG;
  root.renderModularMonsterSVG = renderMonsterSVG;
  root.renderMonsterItemThumbnail = renderMonsterItemThumbnail;
  root.getStageInfo = getStageInfo;
  root.getMonsterStageImage = getMonsterStageImage;
  root.renderMonsterArtwork = renderMonsterArtwork;
  root.renderMonsterEvolutionStagesBanner = renderMonsterEvolutionStagesBanner;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonsterEvolutionRenderer;
  }

})(typeof window !== 'undefined' ? window : global);
