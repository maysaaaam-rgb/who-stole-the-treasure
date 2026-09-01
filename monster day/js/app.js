/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Main Application Orchestrator & Smart Screen Coordinator
 */

import { PHASES } from './data/phases.js';
import { PhaseManager } from './engine/phases.js';
import { renderSpeakingStation } from './engine/speakingStation.js';
import { state } from './engine/state.js';
import { audio } from './services/audio.js';

class JungleRangersApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.phaseManager = null;
    this.teacherDrawerOpen = false;
  }

  init() {
    this.renderShell();
    this.phaseManager = new PhaseManager(document.getElementById('phase-viewport'));

    // Subscribe to state changes
    state.subscribe((gameState) => {
      this.updateHeader(gameState);
      this.phaseManager.renderCurrentPhase();
    });

    // Render initial phase
    this.updateHeader(state);
    this.phaseManager.renderCurrentPhase();
    this.bindKeyboardShortcuts();
  }

  renderShell() {
    this.appContainer.innerHTML = `
      <div class="jungle-app-frame">
        <!-- Top App Navigation & Status Bar -->
        <header class="app-top-header">
          <div class="header-left">
            <button class="btn-menu-drawer" id="btn-menu-drawer" title="Open Stage Selector">
              ☰ <span class="btn-label">Phases</span>
            </button>
            <div class="app-brand">
              <span class="brand-icon">🌿</span>
              <div class="brand-text">
                <span class="brand-title">LIFE IN THE JUNGLE</span>
                <span class="brand-subtitle">THE JUNGLE RANGERS</span>
              </div>
            </div>
          </div>

          <!-- Ecosystem Health Bar -->
          <div class="header-center">
            <div class="health-meter-container">
              <div class="health-label-row">
                <span class="health-title">Ecosystem Health</span>
                <span class="health-val" id="header-health-val">100%</span>
              </div>
              <div class="health-bar-track">
                <div class="health-bar-fill" id="header-health-fill" style="width: 100%"></div>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="header-right">
            <button class="btn-speaking-station" id="btn-speaking-station" title="Open Classroom Speaking Station">
              🗣️ <span class="btn-label">Speaking</span>
            </button>
            <button class="btn-sound-toggle" id="btn-sound-toggle" title="Toggle Sound">
              🔊
            </button>
            <button class="btn-fullscreen-toggle" id="btn-fullscreen" title="Toggle Fullscreen">
              ⛶
            </button>
          </div>
        </header>

        <!-- Teacher Phase Navigation Drawer -->
        <aside class="teacher-navigation-drawer hidden" id="teacher-drawer">
          <div class="drawer-header">
            <h3>Jump to Phase (1 - 22)</h3>
            <button class="btn-close-drawer" id="btn-close-drawer">✕</button>
          </div>
          <div class="drawer-phases-list" id="drawer-phases-list">
            ${this.buildDrawerListHTML()}
          </div>
        </aside>

        <!-- Main Viewport Area -->
        <main class="phase-viewport" id="phase-viewport"></main>
      </div>
    `;

    // Bind Drawer Controls
    const drawerBtn = document.getElementById('btn-menu-drawer');
    const closeDrawerBtn = document.getElementById('btn-close-drawer');
    const drawer = document.getElementById('teacher-drawer');
    const speakingBtn = document.getElementById('btn-speaking-station');
    const soundBtn = document.getElementById('btn-sound-toggle');
    const fullBtn = document.getElementById('btn-fullscreen');

    drawerBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      drawer.classList.toggle('hidden');
    });

    closeDrawerBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      drawer.classList.add('hidden');
    });

    speakingBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      const modal = renderSpeakingStation();
      document.body.appendChild(modal);
    });

    soundBtn.addEventListener('pointerdown', () => {
      const isMuted = audio.toggleMute();
      soundBtn.textContent = isMuted ? '🔇' : '🔊';
    });

    fullBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Bind drawer phase items
    drawer.querySelectorAll('.drawer-phase-item').forEach(item => {
      item.addEventListener('pointerdown', () => {
        audio.playTap();
        const pIndex = parseInt(item.dataset.phaseIndex);
        const subAct = parseInt(item.dataset.subActivity || 1);
        state.setPhase(pIndex, subAct);
        drawer.classList.add('hidden');
      });
    });
  }

  buildDrawerListHTML() {
    return PHASES.map((p, idx) => `
      <div class="drawer-phase-item ${state.currentPhaseIndex === p.id - 1 && (p.subActivity === undefined || state.currentSubActivity === p.subActivity) ? 'active' : ''}" data-phase-index="${p.id - 1}" data-sub-activity="${p.subActivity || 1}">
        <span class="dphase-badge">${p.badge || `Phase ${p.id}`}</span>
        <span class="dphase-title">${p.title}</span>
      </div>
    `).join('');
  }

  updateHeader(gameState) {
    const healthFill = document.getElementById('header-health-fill');
    const healthVal = document.getElementById('header-health-val');
    if (healthFill && healthVal) {
      healthFill.style.width = `${gameState.ecosystemHealth}%`;
      healthVal.textContent = `${gameState.ecosystemHealth}%`;

      if (gameState.ecosystemHealth > 65) {
        healthFill.style.background = 'linear-gradient(90deg, #10B981, #34D399)';
      } else if (gameState.ecosystemHealth > 35) {
        healthFill.style.background = 'linear-gradient(90deg, #F59E0B, #FBBF24)';
      } else {
        healthFill.style.background = 'linear-gradient(90deg, #EF4444, #F87171)';
      }
    }
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        state.nextPhase();
      } else if (e.key === 'ArrowLeft') {
        state.prevPhase();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new JungleRangersApp();
  app.init();
});
