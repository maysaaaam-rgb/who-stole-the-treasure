import React, { useMemo } from 'react';
import { getMonsterAsset, getMonsterStageAsset } from './StudentsDirectory';

/**
 * -----------------------------------------------------------------------------
 * MONSTER PREVIEW COMPONENT
 * Renders the live companion preview with decoupled horns/ears.
 * When horns === null, 'none', 'no_horns', or 'horns-none', the base body
 * is strictly an earless, hornless head dome.
 * -----------------------------------------------------------------------------
 */
export default function MonsterPreview({
  student = {},
  customizationDraft = {},
  selectedFeatures = {},
  size = 280,
  className = '',
  style = {},
  isAnimated = true
}) {
  // Merge draft sources for backward and forward compatibility
  const draft = {
    ...customizationDraft,
    ...selectedFeatures
  };

  const level = student.evolution_level || student.level || 3;
  const stage = student.evolution_stage || (level === 1 ? 'egg' : level === 2 ? 'cracking_egg' : level >= 7 ? 'ultimate' : level >= 4 ? 'growing' : 'baby');
  const furColor = draft.furColor || draft.color || student.furColor || student.color || 'blue';
  const normColor = String(furColor).toLowerCase().replace(/^body-/, '').replace(/^color-/, '');
  
  const rawHorns = draft.horns !== undefined ? draft.horns : (selectedFeatures.horns !== undefined ? selectedFeatures.horns : student.horns);
  const isNoHorns = !rawHorns || rawHorns === 'none' || rawHorns === 'no_horns' || rawHorns === 'horns-none' || rawHorns === 'null';

  // SVG procedural renderer branch
  const svgHtml = useMemo(() => {
    if (typeof window !== 'undefined' && window.MonsterRenderer && typeof window.MonsterRenderer.renderMonsterSVG === 'function') {
      const equipped = {
        body: `body-${normColor}`,
        colors: `color-${normColor}`,
        furColor: normColor,
        face: draft.eyes || draft.face || 'default',
        eyes: draft.eyes || draft.face || 'default',
        mouth: draft.mouth || 'smile',
        horns: isNoHorns ? 'none' : rawHorns,
        tail: draft.tail || 'none',
        tails: draft.tail || 'none',
        wings: draft.wings || 'none',
        clothing: draft.clothing || 'none',
        hat: draft.hat || 'none',
        hats: draft.hat || 'none',
        glasses: draft.glasses || 'none',
        accessories: draft.glasses || 'none',
        aura: draft.aura || 'none',
        background: draft.background || 'none'
      };

      return window.MonsterRenderer.renderMonsterSVG({
        stage,
        color: normColor,
        level,
        archetype: student.monster_archetype || student.archetype || 'ignis',
        equipped,
        size: typeof size === 'number' ? size : 200,
        animated: isAnimated,
        isAvatar: true
      });
    }
    return null;
  }, [stage, normColor, level, student.monster_archetype, student.archetype, isNoHorns, rawHorns, JSON.stringify(draft), isAnimated, size]);

  if (svgHtml) {
    return (
      <div 
        className={`monster-preview-canvas ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', ...style }}
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
    );
  }

  // Raster Layer Stack (Fallback & Component-level composition)
  return (
    <div 
      className={`monster-preview-layer-stack relative aspect-square flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, position: 'relative', margin: '0 auto', ...style }}
    >
      {/* 1. Pedestal Base - locked to bottom: 18% */}
      <div 
        className="pedestal-disk absolute z-10 pointer-events-none" 
        style={{ 
          position: 'absolute', 
          bottom: '18%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '74%', 
          height: '22px', 
          zIndex: 10, 
          background: 'radial-gradient(ellipse at center, rgba(234, 179, 8, 0.55) 0%, rgba(245, 158, 11, 0.22) 50%, transparent 75%)', 
          borderRadius: '50%' 
        }} 
      />

      {/* 2. Base Monster Assembly - shifted up 15% so bottom paws sit directly on pedestal surface with balanced margins */}
      <div 
        className="relative z-20 w-full h-full flex items-center justify-center"
        style={{ position: 'relative', zIndex: 20, width: '100%', height: '100%', transform: 'translateY(-15%)' }}
      >
        {/* Base Body (Clean, Earless/Hornless Dome) */}
        <img 
          src={`assets/monsters/base/body_${stage}_${normColor}.webp`} 
          className="absolute inset-0 w-full h-full object-contain z-20"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 20 }}
          alt="Base Body"
          onError={(e) => {
            e.currentTarget.src = getMonsterAsset(student.archetype, level);
          }}
        />

        {/* Horns / Ears Layer (ONLY render if an item is selected; omit if null or 'no_horns') */}
        {!isNoHorns && (
          <img 
            src={`assets/monsters/horns/${rawHorns}.webp`} 
            className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 30, pointerEvents: 'none' }}
            alt="Equipped Horns"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}

        {/* Clothing Layer */}
        {draft.clothing && draft.clothing !== 'none' && (
          <img 
            src={`assets/packs/items/${draft.clothing}.png`} 
            className="absolute inset-0 w-full h-full object-contain z-35 pointer-events-none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 35, pointerEvents: 'none' }}
            alt="Equipped Clothing"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}

        {/* Facial Accessories & Glasses (slot-glasses: top: 34%, left: 50%, width: 56%, z-index: 45) */}
        {draft.glasses && draft.glasses !== 'none' && (
          <img 
            src={`assets/packs/items/${draft.glasses}.png`} 
            className="slot-glasses accessory-round-wire-glasses absolute object-contain pointer-events-none"
            style={{ 
              position: 'absolute', 
              top: '34%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '56%', 
              zIndex: 45, 
              pointerEvents: 'none' 
            }}
            alt="Equipped Glasses"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}

        {/* Headwear Layer */}
        {draft.hat && draft.hat !== 'none' && (
          <img 
            src={`assets/packs/items/${draft.hat}.png`} 
            className="absolute inset-0 w-full h-full object-contain z-40 pointer-events-none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 40, pointerEvents: 'none' }}
            alt="Equipped Hat"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
      </div>
    </div>
  );
}

export { MonsterPreview as MonsterCompositeView, MonsterPreview as MonsterBodyRenderer };
