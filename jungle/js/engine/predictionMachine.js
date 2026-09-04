/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Interactive Prediction Machine Laboratory Module
 */

import { audio } from '../services/audio.js';

export function renderPredictionMachine(scenario, onResolved) {
  let selectedModal = null;
  let selectedOutcome = null;

  const container = document.createElement('div');
  container.className = 'prediction-machine-cabinet';

  container.innerHTML = `
    <div class="machine-header">
      <div class="machine-gauge">
        <span class="gauge-dial">🔮</span>
        <span class="machine-title">RANGER PREDICTION MACHINE</span>
      </div>
      <div class="machine-status-light pulse-glow">SYSTEM READY</div>
    </div>

    <!-- Condition Display -->
    <div class="machine-condition-screen">
      <div class="condition-badge">CONDITION:</div>
      <div class="condition-text">${scenario.condition}</div>
    </div>

    <!-- Interactive Formula Controls -->
    <div class="machine-controls-grid">
      <!-- Modal Verb Selector -->
      <div class="control-panel-column">
        <div class="panel-label">1. CHOOSE PREDICTION WORD:</div>
        <div class="modal-buttons-group">
          ${scenario.modalOptions.map(mod => `
            <button class="btn-machine-modal" data-modal="${mod}">${mod}</button>
          `).join('')}
        </div>
      </div>

      <!-- Outcome Selector -->
      <div class="control-panel-column">
        <div class="panel-label">2. CHOOSE OUTCOME:</div>
        <div class="outcome-buttons-group">
          ${scenario.outcomeOptions.map(out => `
            <button class="btn-machine-outcome" data-outcome="${out}">${out}</button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Live Formula Sentence Preview -->
    <div class="formula-preview-box">
      <span class="formula-prefix">${scenario.condition.replace('...', '')}</span>
      <span class="formula-slot slot-modal">[CHOOSE WORD]</span>
      <span class="formula-slot slot-outcome">[CHOOSE OUTCOME]</span>
    </div>

    <!-- Run Simulation Button -->
    <div class="machine-actions">
      <button class="btn-run-simulation disabled" disabled>
        <span class="btn-icon">⚡</span> RUN PREDICTION SIMULATION!
      </button>
    </div>

    <!-- Simulation Screen Output -->
    <div class="simulation-screen hidden">
      <div class="sim-animation-viewport"></div>
      <div class="sim-result-narration"></div>
    </div>
  `;

  // Bind modal buttons
  const modalButtons = container.querySelectorAll('.btn-machine-modal');
  const outcomeButtons = container.querySelectorAll('.btn-machine-outcome');
  const slotModal = container.querySelector('.slot-modal');
  const slotOutcome = container.querySelector('.slot-outcome');
  const runBtn = container.querySelector('.btn-run-simulation');
  const simScreen = container.querySelector('.simulation-screen');
  const animViewport = container.querySelector('.sim-animation-viewport');
  const simNarration = container.querySelector('.sim-result-narration');

  modalButtons.forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      audio.playTap();
      modalButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedModal = btn.dataset.modal;
      slotModal.textContent = selectedModal;
      slotModal.classList.add('filled');
      checkReady();
    });
  });

  outcomeButtons.forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      audio.playTap();
      outcomeButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedOutcome = btn.dataset.outcome;
      slotOutcome.textContent = selectedOutcome;
      slotOutcome.classList.add('filled');
      checkReady();
    });
  });

  function checkReady() {
    if (selectedModal && selectedOutcome) {
      runBtn.classList.remove('disabled');
      runBtn.removeAttribute('disabled');
      runBtn.classList.add('pulse-glow');
    }
  }

  runBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!selectedModal || !selectedOutcome) return;

    audio.playFanfare();
    container.classList.add('simulating-active');

    const isCorrect = (selectedOutcome === scenario.correctOutcome);

    setTimeout(() => {
      container.classList.remove('simulating-active');
      simScreen.classList.remove('hidden');

      if (isCorrect) {
        audio.playSuccess();
        animViewport.innerHTML = `
          <div class="sim-success-badge">
            <div class="sparkle-rotator">✨🌟✨</div>
            <div class="sim-text-success">PREDICTION CONFIRMED!</div>
          </div>
        `;
        simNarration.innerHTML = `<p class="sim-speech">${scenario.sentenceResult}</p>`;
        audio.speak(scenario.sentenceResult, simNarration.querySelector('.sim-speech'));
        
        setTimeout(() => {
          if (onResolved) onResolved(true);
        }, 3500);
      } else {
        audio.playGentleRetry();
        animViewport.innerHTML = `
          <div class="sim-retry-badge">
            <div class="sim-icon">🤔</div>
            <div class="sim-text-retry">Think about what animals need. Let's try again!</div>
          </div>
        `;
      }
    }, 1500);
  });

  return container;
}
