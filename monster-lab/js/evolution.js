'use strict';
// =============================================================
// MONSTER LAB — Evolution Manager
// Maps XP → stage, drives the XP slider UI and timeline
// =============================================================

class EvolutionManager {

  constructor(onStageChange) {
    this.onStageChange = onStageChange; // callback(stage, xp, prevStage)
    this.currentStage  = null;
    this.currentXP     = 0;
  }

  // -----------------------------------------------------------
  // Set XP — computes stage, fires callback on stage change
  // -----------------------------------------------------------
  setXP(xp, silent = false) {
    xp = Math.max(0, Math.min(xp, MonsterData.MAX_XP));
    const stage    = MonsterData.xpToStage(xp);
    const prevStage = this.currentStage;

    this.currentXP    = xp;
    this.currentStage = stage.id;

    if (!silent && prevStage && prevStage !== stage.id) {
      // Stage changed — fire callback
      if (this.onStageChange) {
        this.onStageChange(stage.id, xp, prevStage);
      }
    }

    return stage;
  }

  // -----------------------------------------------------------
  // Render the evolution timeline bar
  // -----------------------------------------------------------
  renderTimeline(container) {
    const stages   = MonsterData.EVOLUTION_STAGES;
    const maxXP    = MonsterData.MAX_XP;
    const currentXP = this.currentXP;
    const activeIdx = MonsterData.stageIndex(this.currentStage);

    container.innerHTML = '';

    const bar = document.createElement('div');
    bar.className = 'evo-timeline';

    // Track line
    const track = document.createElement('div');
    track.className = 'evo-track';

    // Progress fill
    const fill = document.createElement('div');
    fill.className  = 'evo-track-fill';
    fill.style.width = `${(currentXP / maxXP) * 100}%`;
    track.appendChild(fill);

    stages.forEach((stage, idx) => {
      const pct = (stage.xpRequired / maxXP) * 100;

      // Node dot
      const node = document.createElement('div');
      node.className  = 'evo-node' + (idx === activeIdx ? ' active' : idx < activeIdx ? ' past' : '');
      node.style.left = `${pct}%`;
      node.title      = `${stage.label} (${stage.xpRequired} XP)`;

      // Label
      const label = document.createElement('span');
      label.className = 'evo-label';
      label.textContent = stage.label;
      node.appendChild(label);

      track.appendChild(node);
    });

    bar.appendChild(track);
    container.appendChild(bar);
  }

  // -----------------------------------------------------------
  // Render XP numeric display
  // -----------------------------------------------------------
  renderXPDisplay(container, xp) {
    const stage    = MonsterData.xpToStage(xp);
    const next     = MonsterData.xpToNextStage(xp);
    const progress = next
      ? Math.round(((xp - stage.xpRequired) / (next.xpRequired - stage.xpRequired)) * 100)
      : 100;

    container.innerHTML = `
      <span class="xp-stage">${stage.label}</span>
      <span class="xp-amount">${xp.toLocaleString()} XP</span>
      ${next ? `<span class="xp-next">→ ${next.label} at ${next.xpRequired.toLocaleString()} XP (${progress}%)</span>` : '<span class="xp-next">⭐ LEGENDARY MAX</span>'}
    `;
  }
}
