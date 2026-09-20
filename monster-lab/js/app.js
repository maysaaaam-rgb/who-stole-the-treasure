'use strict';
// =============================================================
// MONSTER LAB — App Bootstrap
// Wires together: renderer, animation, evolution, customization
// Handles localStorage persistence, dev panel, reset, randomize
// =============================================================

const STORAGE_KEY = 'monster-lab-state-v1';

// -----------------------------------------------------------
// Persistence
// -----------------------------------------------------------
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[MonsterLab] Could not save state:', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...MonsterData.DEFAULT_STATE, ...saved };
    }
  } catch (e) {
    console.warn('[MonsterLab] Could not load state:', e);
  }
  return { ...MonsterData.DEFAULT_STATE };
}

// -----------------------------------------------------------
// Main init (runs on DOMContentLoaded)
// -----------------------------------------------------------
function initMonsterLab() {
  // Load persisted or default state
  let state = loadState();

  // -------- Renderer --------
  const showcaseEl = document.getElementById('monster-showcase');
  const renderer   = new MonsterRenderer();
  renderer.mount(showcaseEl, state);

  // -------- Animation --------
  const anim = new AnimationController(renderer);
  anim.start();

  // -------- Evolution --------
  const evoDisplay  = document.getElementById('xp-display');
  const evoTimeline = document.getElementById('evo-timeline');
  const xpSlider    = document.getElementById('xp-slider');

  const evoMgr = new EvolutionManager((newStageId, xp, prevStage) => {
    // Stage changed — trigger evolution animation
    anim.play('evolution');
    renderer.setEvolution(newStageId);
    updateNameplate(state, newStageId, xp);
    // Flash panel
    showcaseEl.classList.add('evo-flash');
    setTimeout(() => showcaseEl.classList.remove('evo-flash'), 800);
  });

  evoMgr.currentStage = state.evolutionStage;
  evoMgr.currentXP    = state.xp;

  // Initial timeline render
  evoMgr.renderTimeline(evoTimeline);
  evoMgr.renderXPDisplay(evoDisplay, state.xp);

  // XP slider sync
  if (xpSlider) {
    xpSlider.max   = MonsterData.MAX_XP;
    xpSlider.value = state.xp;
    xpSlider.addEventListener('input', () => {
      const xp = parseInt(xpSlider.value, 10);
      state.xp = xp;
      const stage = evoMgr.setXP(xp);
      state.evolutionStage = stage.id;
      renderer.setEvolution(stage.id);
      evoMgr.renderTimeline(evoTimeline);
      evoMgr.renderXPDisplay(evoDisplay, xp);
      updateNameplate(state, stage.id, xp);
      updateDevPanel(state);
      saveState(state);
    });
  }

  // -------- Customization panel --------
  const cpContainer = document.getElementById('customization-panel');
  const panel       = new CustomizationPanel((category, value) => {
    state[category] = value;
    renderer.setSkin(category, value);
    updateDevPanel(state);
    saveState(state);
  });
  panel.render(cpContainer, state);

  // -------- Animation preview buttons --------
  document.querySelectorAll('[data-anim]').forEach(btn => {
    btn.addEventListener('click', () => {
      const animName = btn.dataset.anim;
      anim.play(animName);
      // Brief visual feedback on button
      btn.classList.add('anim-active');
      setTimeout(() => btn.classList.remove('anim-active'), 300);
    });
  });

  // -------- Dev panel --------
  updateDevPanel(state);
  updateNameplate(state, state.evolutionStage, state.xp);

  // Reset button
  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = { ...MonsterData.DEFAULT_STATE };
      applyFullState(state, renderer, panel, evoMgr, xpSlider, evoDisplay, evoTimeline);
      anim.play('idle');
    });
  }

  // Randomize button
  const randBtn = document.getElementById('btn-randomize');
  if (randBtn) {
    randBtn.addEventListener('click', () => {
      state = MonsterData.randomState();
      applyFullState(state, renderer, panel, evoMgr, xpSlider, evoDisplay, evoTimeline);
      anim.play('celebrate');
    });
  }

  // Dev panel toggle
  const devToggle = document.getElementById('dev-toggle');
  const devPanel  = document.getElementById('dev-panel');
  if (devToggle && devPanel) {
    devToggle.addEventListener('click', () => {
      devPanel.classList.toggle('hidden');
    });
  }

  // -------- Initial nameplate --------
  updateNameplate(state, state.evolutionStage, state.xp);
}

// -----------------------------------------------------------
// Apply a full state object to all components
// -----------------------------------------------------------
function applyFullState(state, renderer, panel, evoMgr, xpSlider, evoDisplay, evoTimeline) {
  renderer.update(state);
  panel.render(document.getElementById('customization-panel'), state);
  evoMgr.currentStage = state.evolutionStage;
  evoMgr.currentXP    = state.xp;
  evoMgr.setXP(state.xp, true);
  if (xpSlider) xpSlider.value = state.xp;
  evoMgr.renderTimeline(evoTimeline || document.getElementById('evo-timeline'));
  evoMgr.renderXPDisplay(evoDisplay || document.getElementById('xp-display'), state.xp);
  updateDevPanel(state);
  updateNameplate(state, state.evolutionStage, state.xp);
  saveState(state);
}

// -----------------------------------------------------------
// Nameplate (top of showcase)
// -----------------------------------------------------------
function updateNameplate(state, stageId, xp) {
  const nameEl  = document.getElementById('monster-name');
  const stageEl = document.getElementById('monster-stage');
  const xpEl    = document.getElementById('monster-xp-badge');

  const stage = MonsterData.EVOLUTION_STAGES.find(s => s.id === stageId);

  if (nameEl)  nameEl.textContent  = 'Lumifox';
  if (stageEl) stageEl.textContent = stage ? stage.label.toUpperCase() : '';
  if (xpEl)    xpEl.textContent    = `${(xp || 0).toLocaleString()} XP`;
}

// -----------------------------------------------------------
// Dev panel
// -----------------------------------------------------------
function updateDevPanel(state) {
  const panel = document.getElementById('dev-state');
  if (!panel) return;
  panel.textContent = JSON.stringify(state, null, 2);
}

// -----------------------------------------------------------
// Boot
// -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', initMonsterLab);
