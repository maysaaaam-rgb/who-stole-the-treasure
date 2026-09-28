import React, { useState, useMemo, useEffect } from 'react';

/**
 * -----------------------------------------------------------------------------
 * 1. ASSET LAYERING & RESOLUTION HELPER
 * Resolves monster sprites across 5 archetypes and evolution stages 1 to 7.
 * Standardizes relative asset paths (no leading slashes for offline/gh-pages support).
 * -----------------------------------------------------------------------------
 */
export function getMonsterAsset(archetype = 'ignis', evolutionLevel = 3) {
  const lvl = parseInt(evolutionLevel, 10) || 1;
  if (lvl === 1) return 'assets/monsters/stage-1-mystery-egg.png';
  if (lvl === 2) return 'assets/monsters/stage-2-cracking-egg.png';

  const raw = String(archetype || 'ignis').toLowerCase().trim();
  let species = 'emberwing';
  if (raw.includes('flora') || raw.includes('leaf') || raw.includes('golem') || raw.includes('verdant') || raw.includes('earth')) {
    species = 'florasprout';
  } else if (raw.includes('volt') || raw.includes('spark') || raw.includes('thunder') || raw.includes('electric')) {
    species = 'sparktail';
  } else if (raw.includes('astral') || raw.includes('star') || raw.includes('spirit') || raw.includes('cosmic')) {
    species = 'astralight';
  } else if (raw.includes('aqua') || raw.includes('water') || raw.includes('sea')) {
    species = 'aquafind';
  } else if (raw.includes('ember') || raw.includes('ignis') || raw.includes('fire') || raw.includes('dragon')) {
    species = 'emberwing';
  }

  if (lvl >= 7) {
    return `assets/monsters/${species}_stage_ultimate.png`;
  } else if (lvl === 6) {
    return 'assets/monsters/stage-6-advanced-monster.png';
  } else if (lvl === 5) {
    return 'assets/monsters/stage-5-adventurer-monster.png';
  } else if (lvl >= 4) {
    return `assets/monsters/${species}_stage_growing.png`;
  } else {
    return `assets/monsters/${species}_stage_baby.png`;
  }
}

/**
 * Stage Asset Resolver from XP, Evolution Level, and Archetype
 */
export function getMonsterStageAsset(xp = 0, evolutionLevel = 3, archetype = 'ignis') {
  let lvl = parseInt(evolutionLevel, 10);
  if (!lvl || isNaN(lvl)) {
    const totalXp = parseInt(xp, 10) || 0;
    if (totalXp >= 3500) lvl = 7;
    else if (totalXp >= 2500) lvl = 6;
    else if (totalXp >= 1500) lvl = 5;
    else if (totalXp >= 600) lvl = 4;
    else if (totalXp >= 200) lvl = 3;
    else if (totalXp >= 50) lvl = 2;
    else lvl = 1;
  }
  return getMonsterAsset(archetype, lvl);
}

/**
 * High-Contrast Archetype Badge Helper
 */
export function getArchetypeBadgeClass(archetype = '') {
  const raw = String(archetype || '').toLowerCase();
  if (raw.includes('flora') || raw.includes('leaf') || raw.includes('verdant')) {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  }
  if (raw.includes('ignis') || raw.includes('ember') || raw.includes('fire')) {
    return 'bg-rose-100 text-rose-800 border border-rose-200';
  }
  if (raw.includes('astral') || raw.includes('star') || raw.includes('cosmic')) {
    return 'bg-purple-100 text-purple-800 border border-purple-200';
  }
  return 'bg-amber-100 text-amber-900 border border-amber-200';
}

/**
 * Standard Catalog Items with Colors, Eyes, Horns, Clothing, Hats, Wings, Tails, Auras & Accessories
 */
export const DEFAULT_CATALOG = [
  // Colors (Category: furColor / colors)
  { id: 'color-blue', category: 'colors', name: 'Sky Blue', icon: '🔵', unlockLevel: 1 },
  { id: 'color-pink', category: 'colors', name: 'Berry Pink', icon: '🌸', unlockLevel: 1 },
  { id: 'color-green', category: 'colors', name: 'Leaf Green', icon: '🟢', unlockLevel: 1 },
  { id: 'color-orange', category: 'colors', name: 'Sunset Orange', icon: '🟠', unlockLevel: 2 },
  { id: 'color-purple', category: 'colors', name: 'Lavender Void', icon: '🟣', unlockLevel: 3 },
  { id: 'color-gold', category: 'colors', name: 'Royal Gold', icon: '🟡', unlockLevel: 5 },

  // Eyes & Expression (Category: eyes / face)
  { id: 'eyes-default', category: 'eyes', name: 'Curious Eyes', icon: '👀', unlockLevel: 1 },
  { id: 'eyes-happy', category: 'eyes', name: 'Happy Eyes', icon: '😊', unlockLevel: 1 },
  { id: 'eyes-sparkle', category: 'eyes', name: 'Sparkle Stare', icon: '✨', unlockLevel: 2 },
  { id: 'eyes-wink', category: 'eyes', name: 'Playful Wink', icon: '😉', unlockLevel: 3 },

  // Horns & Crests (Category: horns)
  { id: 'horns-sprout', category: 'horns', name: 'Dual Sprout Nubs', icon: '🌱', unlockLevel: 1 },
  { id: 'horns-curved', category: 'horns', name: 'Curved Ram Horns', icon: '🪶', unlockLevel: 3 },
  { id: 'horns-crystal', category: 'horns', name: 'Crystal Spikes', icon: '💎', unlockLevel: 5 },
  { id: 'horns-antlers', category: 'horns', name: 'Sovereign Antlers', icon: '🦌', unlockLevel: 6 },

  // Hats & Headwear (Category: hats / hat)
  { id: 'hat-cap', category: 'hats', name: 'Explorer Cap', icon: '🧢', unlockLevel: 2 },
  { id: 'hat-wizard', category: 'hats', name: 'Wizard Hat', icon: '🧙', unlockLevel: 4 },
  { id: 'hat-crown', category: 'hats', name: 'Golden Crown', icon: '👑', unlockLevel: 7 },

  // Wings (Category: wings)
  { id: 'wings-fairy', category: 'wings', name: 'Gossamer Fairy Wings', icon: '🪽', unlockLevel: 3 },
  { id: 'wings-dragon', category: 'wings', name: 'Obsidian Dragon Wings', icon: '🦇', unlockLevel: 5 },
  { id: 'wings-angel', category: 'wings', name: 'Celestial Feather Wings', icon: '🕊️', unlockLevel: 6 },

  // Tails (Category: tails / tail)
  { id: 'tail-puff', category: 'tails', name: 'Puff Bunny Tail', icon: '🐇', unlockLevel: 1 },
  { id: 'tail-flame', category: 'tails', name: 'Ignis Flame Tail', icon: '🔥', unlockLevel: 2 },
  { id: 'tail-star', category: 'tails', name: 'Cosmic Star Tail', icon: '⭐', unlockLevel: 4 },
  { id: 'tail-dragon', category: 'tails', name: 'Spiked Dragon Tail', icon: '🦎', unlockLevel: 5 },

  // Auras (Category: auras / aura)
  { id: 'aura-sparkle', category: 'auras', name: 'Sparkle Starlight', icon: '✨', unlockLevel: 2 },
  { id: 'aura-flame', category: 'auras', name: 'Inferno Flames', icon: '🔥', unlockLevel: 4 },
  { id: 'aura-cosmic', category: 'auras', name: 'Cosmic Constellation', icon: '🌌', unlockLevel: 6 },

  // Clothing (Category: clothing)
  { id: 'clothing-vest', category: 'clothing', name: 'Explorer Leather Vest', icon: '🦺', unlockLevel: 2 },
  { id: 'clothing-robe', category: 'clothing', name: 'Mystic Academy Robe', icon: '🥋', unlockLevel: 4 },
  { id: 'clothing-cloak', category: 'clothing', name: 'Heroic Cloak', icon: '🦸', unlockLevel: 5 },
  { id: 'clothing-hoodie', category: 'clothing', name: 'Cyber Sport Hoodie', icon: '🧥', unlockLevel: 3 },

  // Accessories & Eyewear (Category: accessories / glasses)
  { id: 'glasses-round', category: 'accessories', name: 'Round Wire Spectacles', icon: '👓', unlockLevel: 2 },
  { id: 'glasses-goggles', category: 'accessories', name: 'Aviator Brass Goggles', icon: '🥽', unlockLevel: 4 },
  { id: 'acc-satchel', category: 'accessories', name: 'Scholar Satchel', icon: '🎒', unlockLevel: 3 },
  { id: 'acc-medal', category: 'accessories', name: 'Champion Star Medal', icon: '🏅', unlockLevel: 5 }
];

/**
 * -----------------------------------------------------------------------------
 * 2. MONSTER COMPOSITE VIEW / BODY RENDERER COMPONENT
 * Renders the live SVG procedural monster body with live color tint,
 * face features, horns, wings, and tail from MonsterRenderer.
 * -----------------------------------------------------------------------------
 */
export function MonsterBodyRenderer({
  color = 'blue',
  furColor,
  face = 'default',
  eyes,
  mouth = 'smile',
  horns = 'none',
  wings = 'none',
  tail = 'none',
  clothing = 'none',
  hat = 'none',
  glasses = 'none',
  aura = 'none',
  background = 'none',
  level = 3,
  stage,
  archetype = 'ignis',
  className = 'w-full h-full object-contain z-20',
  style = {},
  isAnimated = true
}) {
  const chosenColor = furColor || color || 'blue';
  const normColor = String(chosenColor).toLowerCase().replace(/^body-/, '').replace(/^color-/, '');
  const chosenEyes = eyes || face || 'default';
  const stageKey = level === 1 ? 'egg' : (level === 2 ? 'cracking_egg' : (level >= 7 ? 'ultimate' : (level >= 4 ? 'growing' : (stage || 'baby'))));

  const isNoHorns = !horns || horns === 'none' || horns === 'no_horns' || horns === 'horns-none' || horns === 'null';
  const equipped = {
    body: `body-${normColor}`,
    colors: `color-${normColor}`,
    furColor: normColor,
    face: chosenEyes,
    eyes: chosenEyes,
    mouth: mouth || 'smile',
    horns: isNoHorns ? 'none' : horns,
    wings: wings || 'none',
    tail: tail || 'none',
    tails: tail || 'none',
    clothing: clothing || 'none',
    hat: hat || 'none',
    hats: hat || 'none',
    glasses: glasses || 'none',
    accessories: glasses || 'none',
    aura: aura || 'none',
    auras: aura || 'none',
    background: background || 'none'
  };

  const svgHtml = useMemo(() => {
    if (typeof window !== 'undefined' && window.MonsterRenderer && typeof window.MonsterRenderer.renderMonsterSVG === 'function') {
      return window.MonsterRenderer.renderMonsterSVG({
        stage: stageKey,
        color: normColor,
        level: level,
        archetype: archetype,
        equipped: equipped,
        size: 200,
        animated: isAnimated,
        isAvatar: true
      });
    }
    return null;
  }, [normColor, stageKey, level, archetype, JSON.stringify(equipped), isAnimated]);

  if (svgHtml) {
    return (
      <div 
        className={className}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
    );
  }

  // Fallback to static raster image if MonsterRenderer is not available
  const fallbackAsset = getMonsterAsset(archetype, level);
  return (
    <img 
      src={fallbackAsset} 
      alt="Monster Body" 
      className={className} 
      style={{ objectFit: 'contain', ...style }} 
      onError={(e) => { e.currentTarget.src = 'assets/monsters/stage-3-baby-monster.png'; }}
    />
  );
}

// Alias for seamless backward and forward compatibility
export const MonsterCompositeView = MonsterBodyRenderer;

/**
 * -----------------------------------------------------------------------------
 * 3. MONSTER MULTI-LAYER COMPOSITE COMPONENT
 * Renders the 8-layer composite stage adhering to strict Z-index stacking order:
 * Pedestal -> Aura (z-0) -> Wings/Back (z-10) -> Body (z-20) -> Clothing (z-30) ->
 * Face (z-40) -> Glasses (z-50) -> Horns (z-60) -> Headwear/Hat (z-70)
 * -----------------------------------------------------------------------------
 */
export function MonsterSpriteLayer({ student, size = 160, isAnimated = true }) {
  const level = student.evolution_level || (student.monster_state && student.monster_state.currentLevel) || 3;
  const archetype = student.monster_archetype || student.archetype || 'ignis';
  const customAvatar = student.custom_avatar_url;
  const equipped = student.equipped_cosmetics || student.equipped || {};

  const baseAsset = customAvatar || getMonsterStageAsset(student.xp || student.totalXP, level, archetype);

  return (
    <div 
      className={`monster-composite-stage pb-2 ${isAnimated ? 'eaa-monster-animated bobbing' : ''}`}
      style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '0 auto', paddingBottom: '8px' }}
    >
      {/* z-0: Aura Layer */}
      {equipped.aura && equipped.aura !== 'none' && (
        <div id="layer-aura-back" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div className="aura-glow-effect" style={{ width: '100%', height: '100%', filter: 'blur(8px)', opacity: 0.8 }} />
        </div>
      )}

      {/* z-10: Back Gear (Wings, Tails, Capes) */}
      {(equipped.wings || equipped.tail || equipped.tails) && (
        <div id="layer-back-gear" style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          {equipped.wings && equipped.wings !== 'none' && (
            <img src={`assets/packs/items/${equipped.wings}.png`} alt="Wings" className="layer-asset" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          )}
        </div>
      )}

      {/* z-20: Dynamic Base Monster Body Model */}
      <div id="layer-body" style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
        <img 
          src={baseAsset} 
          alt={student.firstName || student.name || 'Monster'} 
          className="mascot-sprite-img monster-hero-3d object-contain p-2" 
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'assets/monsters/stage-3-baby-monster.png'; }}
        />
      </div>

      {/* z-30: Tailored Clothing */}
      {equipped.clothing && equipped.clothing !== 'none' && (
        <div id="layer-clothing" style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
          <img src={`assets/packs/items/${equipped.clothing}.png`} alt="Clothing" className="layer-asset" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      )}

      {/* z-40: Face Features */}
      {equipped.face && equipped.face !== 'none' && (
        <div id="layer-face" style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none' }} />
      )}

      {/* z-50: Glasses / Eyewear (slot-glasses: top: 34%, left: 50%, width: 56%, z-index: 45) */}
      {equipped.glasses && equipped.glasses !== 'none' && (
        <div id="layer-glasses" className="slot-glasses accessory-round-wire-glasses" style={{ position: 'absolute', top: '34%', left: '50%', transform: 'translate(-50%, -50%)', width: '56%', zIndex: 45, pointerEvents: 'none' }}>
          <img src={`assets/packs/items/${equipped.glasses}.png`} alt="Glasses" className="layer-asset" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      )}

      {/* z-60: Horns & Crests */}
      {equipped.horns && equipped.horns !== 'none' && equipped.horns !== 'no_horns' && equipped.horns !== 'horns-none' && (
        <div id="layer-horns" style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
          <img src={`assets/packs/items/${equipped.horns}.png`} alt="Horns" className="layer-asset" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      )}

      {/* z-70: Headwear & Hats */}
      {equipped.hat && equipped.hat !== 'none' && (
        <div id="layer-headwear" style={{ position: 'absolute', inset: 0, zIndex: 70, pointerEvents: 'none' }}>
          <img src={`assets/packs/items/${equipped.hat}.png`} alt="Hat" className="layer-asset" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      )}

      {/* Grounded Isometric Pedestal Disc */}
      <div className="pedestal-disk" id="preview-pedestal" style={{ position: 'absolute', bottom: '6px', left: '15%', width: '70%', height: '16px', zIndex: 1 }} />
    </div>
  );
}

/**
 * -----------------------------------------------------------------------------
 * 4. STUDENT CARD COMPONENT
 * Interactive 3D hover physics, pencil edit badge, evolution tier & XP progress.
 * Adheres strictly to the aspect-square dark glass container specifications.
 * Ensures badges do NOT leak z-index into overlays.
 * -----------------------------------------------------------------------------
 */
export function StudentCard({ student, onCustomize, onQuickXP }) {
  const level = student.evolution_level || (student.monster_state && student.monster_state.currentLevel) || student.level || 1;
  const archetype = (student.monster_archetype || student.archetype || 'ignis').toLowerCase();
  const xp = student.totalXP || student.xp || 0;
  const streak = student.streakDays || student.streak || 0;
  const cefr = student.overallCefr || student.cefr || 'A1';
  const stageName = level === 1 ? 'Mystery Egg' : level === 2 ? 'Cracking Egg' : level === 7 ? 'Apex Ultimate' : `Stage ${level} Companion`;
  const xpToNext = student.xpToNext !== undefined ? student.xpToNext : Math.max(0, 500 - (xp % 500));
  const progressPct = student.progressPct !== undefined ? student.progressPct : Math.min(100, Math.round(((xp % 500) / 500) * 100));
  const archetypeBadgeStyle = getArchetypeBadgeClass(archetype);

  return (
    <div className={`student-directory-card student-card relative isolate rounded-2xl bg-white element-${archetype} archetype-${archetype}`} style={{ position: 'relative', isolation: 'isolate', zIndex: 0 }}>
      {/* Top Overlay Badges */}
      <div className="card-overlay-top" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className="student-card-status-dot status-active" />
          <span className="badge-cefr">{cefr}</span>
          <span className={`badge-archetype archetype-${archetype} ${archetypeBadgeStyle} px-2 py-0.5 rounded-full text-xs font-bold uppercase`}>
            {archetype.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 student-card-streak-pill">
            🔥 {streak}d
          </span>
          <button 
            type="button" 
            className="btn-card-more-3dots"
            onClick={() => onCustomize(student)}
            title="More Options"
          >
            •••
          </button>
        </div>
      </div>

      {/* Monster Stage Platform with Hover Physics & Pencil Edit Badge */}
      <div 
        className={`monster-stage element-${archetype} pb-2`} 
        style={{ paddingBottom: '8px', cursor: 'pointer', position: 'relative' }}
        onClick={() => onCustomize(student)}
        title={`Lvl ${level} ${stageName} — Click to customize`}
      >
        <button 
          type="button" 
          className="monster-stage-edit-badge"
          onClick={(e) => { e.stopPropagation(); onCustomize(student); }}
          title="Customize Monster"
        >
          ✏️
        </button>
        
        {/* Approved Aspect-Square Dark Glass Container with Drop Shadow */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900/60 flex items-center justify-center p-2">
          <img 
            src={student.custom_avatar_url || getMonsterStageAsset(student.xp || student.totalXP, level, archetype)} 
            alt={student.name || student.firstName || 'Student Avatar'} 
            className="w-full h-full object-contain filter drop-shadow-md mascot-sprite-img monster-hero-3d" 
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = getMonsterAsset(archetype, level);
            }}
          />
        </div>

        {/* Evolution Badge */}
        <span className="stage-level-badge relative z-0 px-3 py-1 text-xs font-bold rounded-full bg-slate-900 text-white" style={{ marginTop: '6px', display: 'inline-block', position: 'relative', zIndex: 0 }}>
          Lvl {level} • {stageName}
        </span>
      </div>

      {/* Card Info & Tactile 3D Action Button */}
      <div className="student-card-content" style={{ width: '100%', marginTop: '12px' }}>
        <div className="student-name-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h3 className="font-bold text-slate-850 text-base leading-tight line-clamp-2 min-h-[2.5rem] break-words student-name" style={{ margin: 0, minHeight: '2.5rem' }}>
            {student.firstName || student.name} {student.lastName || ''}
          </h3>
          <span className="student-xp-pill" style={{ flexShrink: 0 }}>⭐ {xp.toLocaleString()}</span>
        </div>

        {/* Evolution Progress Rail */}
        <div className="evolution-progress-rail my-2" style={{ margin: '8px 0 6px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b', marginBottom: '3px', fontWeight: 600 }}>
            <span>Evolution Progress</span>
            <span>{level >= 7 ? '👑 Apex Form' : (xpToNext > 0 ? `${xpToNext.toLocaleString()} XP to evolve` : 'Ready to evolve!')}</span>
          </div>
          <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden my-2 w-full progress-track student-xp-progress-bar" style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300 progress-fill student-xp-progress-fill" 
              style={{ width: `${progressPct}%`, height: '100%', background: '#4f46e5', borderRadius: '9999px' }} 
            />
          </div>
        </div>

        <div className="student-card-action-bar" style={{ marginTop: '10px' }}>
          <button 
            type="button" 
            className="btn-3d btn-3d-success btn-dominant-xp btn-xp-3d w-full"
            onClick={(e) => { e.stopPropagation(); onQuickXP && onQuickXP(student.id, 10); }}
          >
            +10 XP
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * -----------------------------------------------------------------------------
 * 5. MONSTER STUDIO & CUSTOMIZER MODAL
 * - Fully isolated z-50 fixed stacking context with pointer-events-auto.
 * - Reactive customizationDraft: { furColor, eyes, mouth, horns, tail, wings, clothing, aura, background, hat, glasses }.
 * - Interactive <button> grid tiles with instant selection checkmark (✓).
 * - Real-time reactive preview with MonsterCompositeView and golden pedestal base.
 * - Instant synchronization to parent directory on Save Changes.
 * -----------------------------------------------------------------------------
 */
export function ClosetCustomizerModal({ 
  student, 
  isOpen, 
  onClose, 
  onSave, 
  onUpdateSuccess, 
  catalog = [], 
  studentInventory = [] 
}) {
  const [activeTab, setActiveTab] = useState('colors');

  // Mutable local customization state initialized from the selected student
  const [customizationDraft, setCustomizationDraft] = useState({
    furColor: 'blue',
    eyes: 'default',
    mouth: 'smile',
    horns: 'none',
    tail: 'none',
    wings: 'none',
    clothing: 'none',
    aura: 'none',
    background: 'none',
    hat: 'none',
    glasses: 'none'
  });

  useEffect(() => {
    if (student) {
      const equipped = student.equipped_cosmetics || student.equipped || {};
      const rawColor = student.furColor || student.color || equipped.colors || equipped.body || 'blue';
      const normColor = String(rawColor).toLowerCase().replace(/^body-/, '').replace(/^color-/, '');
      
      setCustomizationDraft({
        furColor: normColor || 'blue',
        eyes: student.eyes || student.face || equipped.eyes || equipped.face || 'default',
        mouth: student.mouth || equipped.mouth || 'smile',
        horns: student.horns || equipped.horns || 'none',
        tail: student.tail || equipped.tail || equipped.tails || 'none',
        wings: student.wings || equipped.wings || 'none',
        clothing: student.clothing || equipped.clothing || 'none',
        aura: student.aura || equipped.aura || equipped.auras || 'none',
        background: student.background || equipped.background || 'none',
        hat: student.hat || equipped.hat || equipped.hats || 'none',
        glasses: student.glasses || equipped.glasses || equipped.accessories || 'none'
      });
    }
  }, [student]);

  // Prevent stacking context leak by locking body and demoting background badges
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const currentLevel = student.evolution_level || student.level || 1;
  const inventorySet = new Set(studentInventory.map(item => item.id || item.itemId));
  const activeCatalog = (catalog && catalog.length > 0) ? catalog : DEFAULT_CATALOG;

  // Category Tabs Definition with mapping to draft fields
  const TABS = [
    { id: 'colors', label: 'Colors', icon: '🎨', field: 'furColor' },
    { id: 'eyes', label: 'Face', icon: '👀', field: 'eyes' },
    { id: 'horns', label: 'Horns', icon: '🪶', field: 'horns' },
    { id: 'hats', label: 'Hats', icon: '🎩', field: 'hat' },
    { id: 'wings', label: 'Wings', icon: '🪽', field: 'wings' },
    { id: 'tails', label: 'Tails', icon: '🦎', field: 'tail' },
    { id: 'clothing', label: 'Clothing', icon: '👔', field: 'clothing' },
    { id: 'auras', label: 'Auras', icon: '✨', field: 'aura' },
    { id: 'accessories', label: 'Accessories', icon: '👓', field: 'glasses' }
  ];

  const currentTabDef = TABS.find(t => t.id === activeTab) || TABS[0];

  const filteredItems = activeCatalog.filter(item => {
    if (activeTab === 'colors') return item.category === 'colors' || item.category === 'body';
    if (activeTab === 'eyes') return item.category === 'eyes' || item.category === 'face';
    if (activeTab === 'hats') return item.category === 'hats' || item.category === 'hat';
    if (activeTab === 'tails') return item.category === 'tails' || item.category === 'tail';
    if (activeTab === 'auras') return item.category === 'auras' || item.category === 'aura';
    if (activeTab === 'accessories') return item.category === 'accessories' || item.category === 'glasses' || item.category === 'accessory';
    return item.category === activeTab;
  });

  // Interactive item selection handler
  const handleSelectItem = (field, itemId) => {
    setCustomizationDraft(prev => {
      if (field === 'furColor') {
        const cleanColor = itemId.replace(/^color-/, '').replace(/^body-/, '');
        return { ...prev, furColor: cleanColor };
      }
      const currentVal = prev[field];
      const nextVal = currentVal === itemId ? 'none' : itemId;
      return { ...prev, [field]: nextVal };
    });
  };

  // Synchronize and persist customization
  const handleSaveChanges = async () => {
    try {
      let customAvatarUrl = student.custom_avatar_url;
      const stage = currentLevel === 1 ? 'egg' : (currentLevel === 2 ? 'cracking_egg' : (currentLevel >= 7 ? 'ultimate' : (currentLevel >= 4 ? 'growing' : 'baby')));
      const normColor = String(customizationDraft.furColor || 'blue').replace(/^color-/, '').replace(/^body-/, '');
      
      const equippedDraft = {
        body: `body-${normColor}`,
        colors: `color-${normColor}`,
        furColor: normColor,
        eyes: customizationDraft.eyes,
        face: customizationDraft.eyes,
        mouth: customizationDraft.mouth,
        horns: customizationDraft.horns,
        tail: customizationDraft.tail,
        tails: customizationDraft.tail,
        wings: customizationDraft.wings,
        clothing: customizationDraft.clothing,
        aura: customizationDraft.aura,
        auras: customizationDraft.aura,
        hat: customizationDraft.hat,
        hats: customizationDraft.hat,
        glasses: customizationDraft.glasses,
        accessories: customizationDraft.glasses,
        background: customizationDraft.background
      };

      if (typeof window !== 'undefined' && window.MonsterRenderer && typeof window.MonsterRenderer.renderMonsterSVG === 'function') {
        const svg = window.MonsterRenderer.renderMonsterSVG({
          stage: stage,
          color: normColor,
          archetype: student.monster_archetype || student.archetype || 'ignis',
          level: currentLevel,
          equipped: equippedDraft,
          size: 200,
          animated: true,
          isAvatar: true
        });
        if (svg) {
          customAvatarUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        }
      }

      // Notify parent callbacks immediately
      if (onSave) {
        onSave(student.id, customizationDraft, customAvatarUrl);
      }
      if (onUpdateSuccess) {
        onUpdateSuccess(student.id, customizationDraft, customAvatarUrl);
      }

      onClose();
    } catch (err) {
      console.error("Failed to save companion customization:", err);
    }
  };

  const stageKey = currentLevel === 1 ? 'egg' : (currentLevel === 2 ? 'cracking_egg' : (currentLevel >= 7 ? 'ultimate' : (currentLevel >= 4 ? 'growing' : 'baby')));

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden"
      style={{ position: 'fixed', inset: 0, zIndex: 9999999, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      <div 
        className="relative z-50 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ background: '#ffffff', borderRadius: '24px', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)', padding: '24px', position: 'relative', zIndex: 50, isolation: 'isolate' }}
      >
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              🎨 Monster Studio &amp; Customizer: {student.firstName || student.name}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              Select colors, horns, and gear. Updates reflect instantly in live preview.
            </p>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose} 
            style={{ 
              cursor: 'pointer',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontWeight: 700,
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* 2-Column Customizer Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Column 1: Live Interactive Preview with Golden Pedestal */}
          <div style={{ background: '#060911', borderRadius: '18px', padding: '20px', border: '1px solid rgba(56, 189, 248, 0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8', marginBottom: '12px', letterSpacing: '0.05em' }}>
              Live Avatar Preview
            </div>
            
            <div className="relative w-64 h-64 mx-auto rounded-3xl bg-slate-950 flex items-center justify-center p-4 overflow-hidden shadow-inner border border-slate-800/80" style={{ position: 'relative', width: '256px', height: '256px', margin: '0 auto' }}>
              {/* Container maintaining a 1:1 aspect ratio with centered anchor */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 1. Golden Pedestal Base - locked to bottom: 18% with comfortable breathing room */}
                <div 
                  className="pedestal-disk" 
                  id="preview-pedestal"
                  style={{ 
                    position: 'absolute', 
                    bottom: '18%', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: '74%', 
                    height: '22px', 
                    zIndex: 10,
                    background: 'radial-gradient(ellipse at center, rgba(234, 179, 8, 0.6) 0%, rgba(245, 158, 11, 0.22) 50%, transparent 75%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                  }} 
                />

                {/* 2. Base Monster Assembly - shifted up by 15% to seat paws directly on pedestal and center cleanly */}
                <div 
                  className="relative z-20 w-full h-full flex items-center justify-center"
                  style={{ 
                    position: 'relative', 
                    zIndex: 20, 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transform: 'translateY(-15%)' 
                  }}
                >
                  <MonsterCompositeView 
                    stage={stageKey}
                    color={customizationDraft.furColor}
                    furColor={customizationDraft.furColor}
                    eyes={customizationDraft.eyes}
                    face={customizationDraft.eyes}
                    mouth={customizationDraft.mouth}
                    horns={customizationDraft.horns}
                    tail={customizationDraft.tail}
                    wings={customizationDraft.wings}
                    clothing={customizationDraft.clothing}
                    aura={customizationDraft.aura}
                    hat={customizationDraft.hat}
                    glasses={customizationDraft.glasses}
                    level={currentLevel}
                    archetype={student.monster_archetype || student.archetype || 'ignis'}
                    className="w-full h-full object-contain relative z-20"
                    style={{ width: '100%', height: '100%', position: 'relative', zIndex: 20 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0' }}>
              Level {currentLevel} • {(student.monster_archetype || student.archetype || 'Ignis').toUpperCase()}
            </div>
          </div>

          {/* Column 2: Tabbed Items Grid with Interactive <button> Tiles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Category Tab Bar */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`classroom-nav-tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ 
                    padding: '8px 14px', 
                    fontSize: '0.84rem', 
                    fontWeight: 700, 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : '#f1f5f9',
                    color: activeTab === tab.id ? '#0284c7' : '#64748b',
                    border: activeTab === tab.id ? '1px solid #0284c7' : '1px solid #e2e8f0'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Items Grid with Interactive <button> Elements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxHeight: '320px', overflowY: 'auto', padding: '4px' }}>
              {filteredItems.map(item => {
                const targetField = currentTabDef.field;
                const activeVal = customizationDraft[targetField];
                
                // Compare selected state
                let isSelected = false;
                if (targetField === 'furColor') {
                  const itemColor = item.id.replace(/^color-/, '').replace(/^body-/, '');
                  isSelected = activeVal === itemColor;
                } else {
                  isSelected = activeVal === item.id;
                }

                const isLevelLocked = item.unlockLevel > currentLevel;
                const isInventoryUnlocked = inventorySet.has(item.id);
                const isUnlocked = isInventoryUnlocked || (!isLevelLocked && (!item.unlockType || item.unlockType === 'level'));

                const lockLabel = isLevelLocked ? `🔒 Level ${item.unlockLevel}` : '🔒 Rare Drop';

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => isUnlocked && handleSelectItem(targetField, item.id)}
                    disabled={!isUnlocked}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#f8fafc',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.45,
                      filter: isUnlocked ? 'none' : 'grayscale(0.7)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '88px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {!isUnlocked && (
                      <span className="monster-item-lock-pill" style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '0.65rem', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>
                        {lockLabel}
                      </span>
                    )}
                    {isSelected && (
                      <span style={{ position: 'absolute', top: '6px', left: '6px', color: '#0284c7', fontWeight: 900, fontSize: '0.9rem' }}>✓</span>
                    )}
                    <div style={{ fontSize: '2rem', margin: '4px 0', lineHeight: 1 }}>{item.icon || '✨'}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <button 
                type="button" 
                className="btn-sm-secondary" 
                onClick={onClose} 
                style={{ 
                  cursor: 'pointer',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary-action btn-3d btn-3d-primary"
                onClick={handleSaveChanges}
                style={{ padding: '10px 22px', fontWeight: 800, cursor: 'pointer' }}
              >
                ✓ Save Changes
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// Alias ClosetCustomizerModal as MonsterStudioModal
export const MonsterStudioModal = ClosetCustomizerModal;

/**
 * -----------------------------------------------------------------------------
 * 6. MAIN STUDENTS DIRECTORY COMPONENT
 * Clean, contiguous 4-column CSS Grid layout with ZERO spliced navbar bugs.
 * -----------------------------------------------------------------------------
 */
export default function StudentsDirectory({ students = [], onUpdateStudentXP, onSaveCosmetics, catalog = [] }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localStudents, setLocalStudents] = useState(students);

  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  const handleOpenCustomizer = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveCosmetics = (studentId, customizationDraft, customAvatarUrl) => {
    setLocalStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          ...customizationDraft,
          equipped_cosmetics: customizationDraft,
          equipped: customizationDraft,
          custom_avatar_url: customAvatarUrl || s.custom_avatar_url
        };
      }
      return s;
    }));
    if (onSaveCosmetics) {
      onSaveCosmetics(studentId, customizationDraft, customAvatarUrl);
    }
  };

  return (
    <div className="students-directory-view" style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main, #f8fafc)', margin: '0 0 6px 0' }}>
          👧 Students Directory &amp; Monster Companions
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #94a3b8)', margin: 0 }}>
          Manage student cohorts, track XP evolution tiers, and customize living learning companions.
        </p>
      </div>

      {/* Uninterrupted 4-Column Grid: No Spliced Top Navbars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 students-grid students-directory-grid">
        {localStudents.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            onCustomize={handleOpenCustomizer}
            onQuickXP={(id, amount) => onUpdateStudentXP && onUpdateStudentXP(id, amount)}
          />
        ))}
      </div>

      {/* Monster Studio & Customizer Modal */}
      {selectedStudent && (
        <ClosetCustomizerModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCosmetics}
          onUpdateSuccess={handleSaveCosmetics}
          catalog={catalog.length > 0 ? catalog : DEFAULT_CATALOG}
          studentInventory={selectedStudent.inventory || []}
        />
      )}

    </div>
  );
}
