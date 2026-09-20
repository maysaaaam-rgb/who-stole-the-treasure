'use strict';
// =============================================================
// MONSTER LAB — Character Data & Options Catalogue
// Species: Lumifox — fox-like RPG companion
// =============================================================

const MonsterData = {

  // -----------------------------------------------------------
  // Default character state
  // -----------------------------------------------------------
  DEFAULT_STATE: {
    species:        'lumifox',
    evolutionStage: 'young',
    style:          'boy',
    fur:            'orange',
    eyes:           'bright',
    ears:           'fluffy',
    tail:           'plume',
    outfit:         'explorer',
    accessory:      null,
    aura:           null,
    xp:             700
  },

  // -----------------------------------------------------------
  // All customization options per category
  // -----------------------------------------------------------
  CUSTOMIZATION_OPTIONS: {
    fur: [
      { id: 'orange',  label: 'Amber',    color: '#FF8C42' },
      { id: 'blue',    label: 'Sapphire', color: '#4A9EFF' },
      { id: 'purple',  label: 'Amethyst', color: '#A855F7' },
      { id: 'green',   label: 'Emerald',  color: '#34D399' },
      { id: 'pink',    label: 'Rose',     color: '#F472B6' }
    ],
    eyes: [
      { id: 'bright',  label: 'Bright',   icon: '✨' },
      { id: 'sleepy',  label: 'Sleepy',   icon: '😴' },
      { id: 'fierce',  label: 'Fierce',   icon: '⚡' },
      { id: 'sparkle', label: 'Sparkle',  icon: '🌟' }
    ],
    ears: [
      { id: 'fluffy',  label: 'Fluffy',  icon: '🌿' },
      { id: 'pointy',  label: 'Pointy',  icon: '△' },
      { id: 'round',   label: 'Round',   icon: '○' }
    ],
    tail: [
      { id: 'plume',     label: 'Plume',     icon: '🪶' },
      { id: 'curl',      label: 'Curl',      icon: '🌀' },
      { id: 'lightning', label: 'Lightning', icon: '⚡' },
      { id: 'ribbon',    label: 'Ribbon',    icon: '🎀' }
    ],
    outfit: [
      { id: 'explorer', label: 'Explorer', icon: '🗺️' },
      { id: 'scholar',  label: 'Scholar',  icon: '📚' },
      { id: 'knight',   label: 'Knight',   icon: '⚔️' },
      { id: 'casual',   label: 'Casual',   icon: '👕' }
    ],
    accessory: [
      { id: null,       label: 'None',    icon: '—'  },
      { id: 'glasses',  label: 'Glasses', icon: '🕶️' },
      { id: 'crown',    label: 'Crown',   icon: '👑' },
      { id: 'scarf',    label: 'Scarf',   icon: '🧣' }
    ],
    aura: [
      { id: null,       label: 'None',     color: '#555566' },
      { id: 'fire',     label: 'Fire',     color: '#FF4500' },
      { id: 'ice',      label: 'Ice',      color: '#00BFFF' },
      { id: 'electric', label: 'Electric', color: '#FFD700' },
      { id: 'rainbow',  label: 'Rainbow',  color: '#FF69B4' }
    ]
  },

  // -----------------------------------------------------------
  // Evolution stages (XP thresholds)
  // -----------------------------------------------------------
  EVOLUTION_STAGES: [
    { id: 'egg',        label: 'Egg',        xpRequired: 0,    scale: 0.45 },
    { id: 'baby',       label: 'Baby',       xpRequired: 100,  scale: 0.53 },
    { id: 'tot',        label: 'Tot',        xpRequired: 300,  scale: 0.64 },
    { id: 'young',      label: 'Young',      xpRequired: 700,  scale: 0.77 },
    { id: 'adventurer', label: 'Adventurer', xpRequired: 1200, scale: 0.90 },
    { id: 'elite',      label: 'Elite',      xpRequired: 2500, scale: 1.01 },
    { id: 'legendary',  label: 'Legendary',  xpRequired: 5000, scale: 1.14 }
  ],

  MAX_XP: 6000,

  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  xpToStage(xp) {
    const stages = MonsterData.EVOLUTION_STAGES;
    let result = stages[0];
    for (const stage of stages) {
      if (xp >= stage.xpRequired) result = stage;
      else break;
    }
    return result;
  },

  xpToNextStage(xp) {
    const stages = MonsterData.EVOLUTION_STAGES;
    for (let i = 0; i < stages.length; i++) {
      if (xp < stages[i].xpRequired) return stages[i];
    }
    return null; // already legendary
  },

  stageIndex(stageId) {
    return MonsterData.EVOLUTION_STAGES.findIndex(s => s.id === stageId);
  },

  randomState() {
    const opts = MonsterData.CUSTOMIZATION_OPTIONS;
    const rand  = arr => arr[Math.floor(Math.random() * arr.length)];
    const xp    = Math.floor(Math.random() * MonsterData.MAX_XP);
    return {
      species:        'lumifox',
      evolutionStage: MonsterData.xpToStage(xp).id,
      style:          Math.random() > 0.5 ? 'boy' : 'girl',
      fur:            rand(opts.fur).id,
      eyes:           rand(opts.eyes).id,
      ears:           rand(opts.ears).id,
      tail:           rand(opts.tail).id,
      outfit:         rand(opts.outfit).id,
      accessory:      rand(opts.accessory).id,
      aura:           rand(opts.aura).id,
      xp
    };
  }
};
