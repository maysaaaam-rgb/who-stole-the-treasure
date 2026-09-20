/**
 * ENGLISH ADVENTURE ACADEMY — CANONICAL ILLUSTRATED MONSTER ENGINE
 * 
 * Master Visual Blueprint Implementation:
 * - ONE SPECIES ONLY: Cute fluffy blue fantasy companion
 * - 7 Canonical Physical Growth Stages (Level 0 Egg through Level 6 Legendary)
 * - Pure body growth across stages (NOT accessories)
 * - Boy / Girl Style Toggle (Girl style features delicate pink ribbon hair bow)
 * - 5 Vibrant Fur Colors (Sky Blue, Berry Pink, Lavender Purple, Leaf Green, Sunset Orange)
 * - Customization cleanly separated from evolution
 * - High-resolution transparent PNG layers (zero-lag compositing)
 */

(function(root) {
  'use strict';

  // 7 Canonical Evolution Stages (Levels 0 through 6)
  const EVOLUTION_STAGES = [
    {
      level: 0,
      stageKey: 'egg',
      name: 'Egg',
      subtitle: 'A new friend is waiting!',
      xpRequired: 0,
      description: 'A smooth, mysterious speckled egg resting in a cozy nest, waiting for your English journey to begin.',
      image: 'assets/monsters/canonical/stage-0-egg-blue.png',
      unlockedFeatures: ['Mystery Egg in Nest']
    },
    {
      level: 1,
      stageKey: 'baby',
      name: 'Baby',
      subtitle: 'Tiny and curious',
      xpRequired: 0,
      description: 'Tiny and curious! Your newly hatched companion takes its first steps with large curious eyes and short baby legs.',
      image: 'assets/monsters/canonical/stage-1-baby-blue.png',
      unlockedFeatures: ['Tiny body', 'Large head', 'Short legs']
    },
    {
      level: 2,
      stageKey: 'tot',
      name: 'Tot',
      subtitle: 'Growing fast',
      xpRequired: 100,
      description: 'Growing fast and active! Ears perk up and playful paws grow stronger as vocabulary expands.',
      image: 'assets/monsters/canonical/stage-2-tot-blue.png',
      unlockedFeatures: ['Growing body', 'Playful posture', 'Perky ears']
    },
    {
      level: 3,
      stageKey: 'young',
      name: 'Young',
      subtitle: 'More confident',
      xpRequired: 300,
      description: 'More confident and standing tall! Upright posture with attentive ears ready for reading adventures.',
      image: 'assets/monsters/canonical/stage-3-young-blue.png',
      unlockedFeatures: ['Standing upright', 'Taller torso', 'Free arms']
    },
    {
      level: 4,
      stageKey: 'adventurer',
      name: 'Adventurer',
      subtitle: 'Ready for adventures',
      xpRequired: 700,
      description: 'Ready for bigger adventures! Mature proportions, athletic frame, and bushy white-tipped tail.',
      image: 'assets/monsters/canonical/stage-4-adventurer-blue.png',
      unlockedFeatures: ['Mature proportions', 'Wider chest', 'Bushy tail']
    },
    {
      level: 5,
      stageKey: 'elite',
      name: 'Elite',
      subtitle: 'Stronger than ever',
      xpRequired: 1200,
      description: 'Stronger than ever! Broad chest, powerful posture, and majestic fur reflecting deep English fluency.',
      image: 'assets/monsters/canonical/stage-5-elite-blue.png',
      unlockedFeatures: ['Large muscular body', 'Proud posture']
    },
    {
      level: 6,
      stageKey: 'legendary',
      name: 'Legendary',
      subtitle: 'A true legend',
      xpRequired: 2000,
      description: 'A true legend! The most magnificent silhouette with sweeping bushy tail, proudest stance, and full collection mastery.',
      image: 'assets/monsters/canonical/stage-6-legendary-blue.png',
      unlockedFeatures: ['Largest silhouette', 'Glorious mane & tail']
    }
  ];

  // Girl hair bow placement offsets per stage
  const GIRL_BOW_OFFSETS = {
    egg: { top: '24%', left: '46%', width: '18%' },
    baby: { top: '8%', left: '46%', width: '20%' },
    tot: { top: '7%', left: '47%', width: '19%' },
    young: { top: '6%', left: '46%', width: '19%' },
    adventurer: { top: '5%', left: '47%', width: '18%' },
    elite: { top: '5%', left: '46%', width: '18%' },
    legendary: { top: '5%', left: '46%', width: '18%' }
  };

  // Optional closet item offsets
  const ITEM_OFFSETS = {
    // Horns (only rendered if explicitly equipped by student in closet)
    'horns-gold': { top: '3%', left: '18%', width: '64%', zIndex: 6 },
    'horns-curved': { top: '3%', left: '18%', width: '64%', zIndex: 6 },
    'horns-crystal': { top: '1%', left: '33%', width: '34%', zIndex: 6 },
    'horns-dragon': { top: '8%', left: '14%', width: '72%', zIndex: 6 },
    'horns-cosmic': { top: '5%', left: '18%', width: '64%', zIndex: 6 },
    'horns-starter': { top: '15%', left: '36%', width: '28%', zIndex: 6 },

    // Hats
    'hat-explorer': { top: '2%', left: '30%', width: '40%', zIndex: 7 },
    'hat-scholar': { top: '2%', left: '28%', width: '44%', zIndex: 7 },
    'hat-crown': { top: '2%', left: '34%', width: '32%', zIndex: 7 },

    // Clothing (only rendered if explicitly equipped by student in closet)
    'clothing-vest': { top: '48%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-cape': { top: '46%', left: '30%', width: '40%', zIndex: 5 },
    'clothing-adv-jacket': { top: '47%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-robe': { top: '42%', left: '30%', width: '40%', zIndex: 5 },
    'clothing-knight': { top: '46%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-knight-armor': { top: '46%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-scientist': { top: '44%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-travel-coat': { top: '44%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-space': { top: '44%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-uniform': { top: '47%', left: '32%', width: '36%', zIndex: 5 },
    'clothing-scarf': { top: '45%', left: '33%', width: '34%', zIndex: 5 },
    'clothing-hoodie': { top: '46%', left: '31%', width: '38%', zIndex: 5 },

    // Wings (rendered behind body)
    'wings-fairy': { top: '4%', left: '14%', width: '72%', zIndex: 2 },
    'wings-crystal': { top: '4%', left: '14%', width: '72%', zIndex: 2 },
    'wings-dragon': { top: '6%', left: '16%', width: '68%', zIndex: 2 },
    'wings-cosmic': { top: '4%', left: '14%', width: '72%', zIndex: 2 },
    'wings-celestial': { top: '4%', left: '14%', width: '72%', zIndex: 2 },

    // Backpacks
    'bp-explorer': { top: '44%', left: '20%', width: '32%', zIndex: 4 },
    'bp-scholar': { top: '44%', left: '20%', width: '32%', zIndex: 4 },

    // Glasses
    'glasses-round': { top: '27%', left: '36%', width: '28%', zIndex: 7 },
    'glasses-sun': { top: '27%', left: '36%', width: '28%', zIndex: 7 }
  };

  function normalizeStageKey(key) {
    if (key === undefined || key === null) return 'baby';
    const s = String(key).toLowerCase().trim();
    if (s === '0' || s === 'egg') return 'egg';
    if (s === '1' || s === 'baby') return 'baby';
    if (s === '2' || s === 'tot' || s === 'cracking' || s === 'cracking_egg' || s === 'growing') return 'tot';
    if (s === '3' || s === 'young') return 'young';
    if (s === '4' || s === 'adventurer') return 'adventurer';
    if (s === '5' || s === 'elite' || s === 'advanced') return 'elite';
    if (s === '6' || s === '7' || s === 'legendary' || s === 'ultimate') return 'legendary';
    return 'baby';
  }

  function getMonsterForEvolution(levelOrKeyOrXP) {
    if (typeof levelOrKeyOrXP === 'number') {
      if (levelOrKeyOrXP >= 0 && levelOrKeyOrXP <= 6) {
        return EVOLUTION_STAGES.find(s => s.level === levelOrKeyOrXP) || EVOLUTION_STAGES[1];
      }
      // Treat as XP
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
    return EVOLUTION_STAGES.find(s => s.stageKey === key) || EVOLUTION_STAGES[1];
  }

  function getMonsterStageImage(stageKey, color = 'blue') {
    const evo = getMonsterForEvolution(stageKey);
    const validColors = ['blue', 'pink', 'purple', 'green', 'orange'];
    const cleanColor = validColors.includes(color) ? color : 'blue';
    return `assets/monsters/canonical/stage-${evo.level}-${evo.stageKey}-${cleanColor}.png`;
  }

  /**
   * Master Canonical Monster Compositor
   */
  function renderMonsterArtwork(options = {}) {
    const size = options.size || 256;
    let stageKey = 'baby';
    if (options.stage !== undefined) stageKey = normalizeStageKey(options.stage);
    else if (options.level !== undefined) stageKey = normalizeStageKey(options.level);
    else if (options.xp !== undefined) stageKey = getMonsterForEvolution(options.xp).stageKey;

    const evo = getMonsterForEvolution(stageKey);

    // Color resolution
    let rawColor = options.color || options.baseColor || (options.equipped && options.equipped.body) || 'blue';
    rawColor = String(rawColor).replace('body-', '').toLowerCase();
    const validColors = ['blue', 'pink', 'purple', 'green', 'orange'];
    const color = validColors.includes(rawColor) ? rawColor : 'blue';

    // Style (Boy vs Girl)
    const rawStyle = options.monsterStyle || (options.style === 'boy' || options.style === 'girl' ? options.style : null) || options.gender || 'boy';
    const isGirl = String(rawStyle).toLowerCase() === 'girl';
    const customCss = (typeof options.style === 'string' && options.style !== 'boy' && options.style !== 'girl') ? options.style : (options.customStyle || '');

    const eq = options.equipped || {};
    const isRound = options.round !== false;
    const borderRadius = typeof options.radius === 'number' ? options.radius + 'px' : (isRound ? (size >= 100 ? '20px' : '12px') : '0px');
    const showWorld = options.showWorld === true && !options.transparent;
    const showPedestal = options.showPedestal === true;
    const animated = options.animated !== false;
    const paused = options.paused === true || !animated;

    const layers = [];

    // 1. World Background (if explicitly enabled)
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

    // 2. Stone Pedestal (beneath creature)
    if (showPedestal) {
      layers.push(`
        <img class="monster-layer layer-pedestal" src="assets/monsters/canonical/stone-pedestal.png" alt="Pedestal" style="position:absolute; bottom:0; left:8%; width:84%; height:26%; object-fit:contain; z-index:2; pointer-events:none;" />
      `);
    }

    // 3. Custom Wings (Behind Body — ONLY if student explicitly equipped them in closet)
    const wingId = eq.wings && eq.wings !== 'none' && eq.wings !== 'wings-none' ? eq.wings : null;
    if (wingId) {
      const wOff = ITEM_OFFSETS[wingId] || ITEM_OFFSETS['wings-fairy'];
      const wFile = (wingId.includes('crystal')) ? 'wings-crystal.png' :
                    (wingId.includes('dragon')) ? 'wings-dragon.png' :
                    (wingId.includes('cosmic') || wingId.includes('celestial')) ? 'wings-cosmic.png' : 'wings-fairy.png';

      layers.push(`
        <img class="monster-layer layer-wings ${animated && !paused ? 'eaa-monster-wing-anim' : ''}" src="assets/monsters/layers/wings/${wFile}" alt="Wings" style="position:absolute; top:${wOff.top}; left:${wOff.left}; width:${wOff.width}; z-index:3; pointer-events:none;" />
      `);
    }

    // 4. Canonical Physical Monster Character (Exact Illustrated Species)
    const creatureImg = `assets/monsters/canonical/stage-${evo.level}-${evo.stageKey}-${color}.png`;
    layers.push(`
      <img class="monster-layer layer-canonical-character" src="${creatureImg}" alt="${evo.name}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:4; pointer-events:none;" />
    `);

    // 5. Custom Outfits (ONLY if student explicitly equipped them in closet)
    const clothId = eq.clothing && eq.clothing !== 'none' && eq.clothing !== 'clothing-none' ? eq.clothing : null;
    if (clothId && evo.level > 0) {
      const cOff = ITEM_OFFSETS[clothId] || ITEM_OFFSETS['clothing-vest'];
      const cFile = (clothId.includes('robe')) ? 'clothing-robe.png' :
                    (clothId.includes('knight')) ? 'clothing-knight-armor.png' :
                    (clothId.includes('scientist') || clothId.includes('travel')) ? 'clothing-scientist.png' :
                    (clothId.includes('space')) ? 'clothing-space.png' :
                    (clothId.includes('uniform') || clothId.includes('scarf') || clothId.includes('hoodie')) ? 'clothing-uniform.png' : 'clothing-vest.png';

      layers.push(`
        <img class="monster-layer layer-clothing" src="assets/monsters/layers/clothing/${cFile}" alt="Clothing" style="position:absolute; top:${cOff.top}; left:${cOff.left}; width:${cOff.width}; z-index:5; pointer-events:none;" />
      `);
    }

    // 6. Girl Style Ribbon Bow (Centered on head tuft)
    if (isGirl && evo.level > 0) {
      const bowOff = GIRL_BOW_OFFSETS[evo.stageKey] || GIRL_BOW_OFFSETS.baby;
      layers.push(`
        <img class="monster-layer layer-girl-bow" src="assets/monsters/canonical/pink-hair-bow.png" alt="Girl Ribbon" style="position:absolute; top:${bowOff.top}; left:${bowOff.left}; width:${bowOff.width}; z-index:6; pointer-events:none;" />
      `);
    }

    // 7. Custom Hats (ONLY if student explicitly equipped them in closet)
    const hatId = eq.hat && eq.hat !== 'none' && eq.hat !== 'hat-none' ? eq.hat : null;
    if (hatId && evo.level > 0) {
      const hOff = ITEM_OFFSETS[hatId] || ITEM_OFFSETS['hat-explorer'];
      const hFile = hatId.includes('scholar') ? 'hat-scholar.png' :
                    hatId.includes('crown') ? 'hat-crown.png' : 'hat-explorer.png';
      layers.push(`
        <img class="monster-layer layer-hat" src="assets/monsters/layers/clothing/${hFile}" alt="Hat" style="position:absolute; top:${hOff.top}; left:${hOff.left}; width:${hOff.width}; z-index:7; pointer-events:none;" />
      `);
    }

    // 8. Custom Horns (ONLY if student explicitly equipped them in closet, NEVER by default)
    const hornId = eq.horns && eq.horns !== 'none' && eq.horns !== 'horns-ears' && eq.horns !== 'horns-none' ? eq.horns : null;
    if (hornId && evo.level > 0) {
      const hnOff = ITEM_OFFSETS[hornId] || ITEM_OFFSETS['horns-gold'];
      const hnFile = (hornId.includes('crystal') || hornId.includes('ice')) ? 'horns-crystal.png' :
                     (hornId.includes('dragon')) ? 'horns-dragon.png' :
                     (hornId.includes('cosmic') || hornId.includes('star')) ? 'horns-cosmic.png' :
                     (hornId.includes('starter') || hornId.includes('nub')) ? 'horns-starter.png' : 'horns-gold.png';

      layers.push(`
        <img class="monster-layer layer-horns" src="assets/monsters/layers/horns/${hnFile}" alt="Horns" style="position:absolute; top:${hnOff.top}; left:${hnOff.left}; width:${hnOff.width}; z-index:7; pointer-events:none;" />
      `);
    }

    const animClass = (animated && !paused) ? 'eaa-monster-artwork-anim' : '';
    const pauseClass = paused ? 'is-paused' : '';

    return `
      <div class="monster-compositor-box ${animClass} ${pauseClass} ${options.className || ''}" style="width:${size}px; height:${size}px; position:relative; overflow:hidden; border-radius:${borderRadius}; display:inline-block; vertical-align:middle; background:${showWorld ? 'transparent' : 'transparent'}; user-select:none; ${customCss}">
        ${layers.join('\n')}
      </div>
    `.trim();
  }

  function renderMonsterSVG(options = {}) {
    return renderMonsterArtwork(options);
  }

  function renderMonsterItemThumbnail(item, options = {}) {
    if (!item) return '';
    const size = options.size || 48;

    if (item.category === 'body') {
      const colKey = item.id.replace('body-', '');
      return `
        <div style="width:${size}px; height:${size}px; border-radius:10px; overflow:hidden; position:relative; background:#0f172a; display:flex; align-items:center; justify-content:center;">
          <img src="assets/monsters/canonical/stage-3-young-${colKey}.png" style="width:110%; height:110%; object-fit:contain;" alt="${item.name}" />
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
            <p style="font-size:0.84rem; color:#94a3b8; margin:4px 0 0 0;">A real visual evolution, not accessories. Monsters grow physical proportions as students earn XP!</p>
          </div>
          <div style="font-size:0.75rem; color:#38bdf8; font-weight:800; letter-spacing:0.05em; text-transform:uppercase;">
            Same Spirit • Pure Body Growth • 7 Canonical Stages • One True Companion
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; align-items:stretch;">
          ${stages.map((st, idx) => `
            <div class="evolution-stage-card-premium" style="background:rgba(15,23,42,0.85); border:1.5px solid ${idx === 6 ? '#f59e0b' : 'rgba(56,189,248,0.3)'}; border-radius:14px; padding:12px 10px; display:flex; flex-direction:column; align-items:center; text-align:center; transition:transform 0.2s ease, box-shadow 0.2s ease; position:relative;">
              <div style="font-size:0.68rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:2px;">Level ${st.level}</div>
              <div style="font-size:0.82rem; font-weight:900; color:#f8fafc; margin-bottom:8px; line-height:1.2;">${st.name}</div>
              
              <div style="width:100%; aspect-ratio:1; border-radius:10px; overflow:hidden; margin-bottom:8px; background:#020617; border:1px solid rgba(255,255,255,0.1); box-shadow:inset 0 2px 8px rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; position:relative;">
                <img src="assets/monsters/canonical/stone-pedestal.png" alt="Pedestal" style="position:absolute; bottom:0; left:10%; width:80%; height:26%; object-fit:contain; z-index:1;" />
                <img src="${getMonsterStageImage(st.stageKey)}" alt="${st.name}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; z-index:2; display:block;" />
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

  function renderMonster(opts = {}) {
    let student = opts.student;
    let studentId = null;
    if (typeof opts === 'string') {
      studentId = opts;
    } else if (typeof student === 'string') {
      studentId = student;
      student = null;
    } else if (student && student.id) {
      studentId = student.id;
    }

    const store = (typeof window !== 'undefined' ? (window.store || window.schoolStore) : null);
    if (!student && studentId && store && store.getStudent) {
      student = store.getStudent(studentId);
    }

    let stageKey = opts.stage;
    let level = opts.level;
    let color = opts.color;
    let gender = opts.gender || opts.monsterStyle;
    let equipped = opts.customization || (student && student.equipped) || {};

    if (studentId && store) {
      if (!stageKey && store.calculateMonsterState) {
        const ms = store.calculateMonsterState(studentId);
        if (ms) {
          stageKey = ms.stageKey;
          level = ms.currentLevel;
        }
      }
      if (store.getMonsterProfile) {
        const mp = store.getMonsterProfile(studentId);
        if (mp) {
          if (!color) color = mp.baseColor;
          if (!gender) gender = mp.style;
          if (!opts.customization && mp.equipped) equipped = mp.equipped;
        }
      }
    }

    return renderMonsterArtwork({
      stage: stageKey || 'adventurer',
      level: level || 4,
      color: color || 'blue',
      monsterStyle: gender || 'boy',
      equipped: equipped,
      size: opts.size || 220,
      showPedestal: opts.showPedestal !== undefined ? opts.showPedestal : true,
      animated: opts.animated !== undefined ? opts.animated : true,
      customStyle: opts.style
    });
  }

  root.renderMonster = renderMonster;
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

  if (typeof window !== 'undefined') {
    window.renderMonster = renderMonster;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonsterEvolutionRenderer;
  }

})(typeof window !== 'undefined' ? window : global);
