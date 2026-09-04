/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Classroom Speaking Station & Sentence Frame Builder
 */

import { ANIMALS, renderAnimalSVG } from '../data/animals.js';
import { SPEAKING_PROMPTS } from '../data/phases.js';
import { audio } from '../services/audio.js';

export function renderSpeakingStation(onClose) {
  const container = document.createElement('div');
  container.className = 'speaking-station-modal';

  let currentPromptIndex = 0;
  let currentPrompt = SPEAKING_PROMPTS[currentPromptIndex];

  function buildContent() {
    currentPrompt = SPEAKING_PROMPTS[currentPromptIndex];
    const animal = ANIMALS[currentPrompt.animal] || ANIMALS.rabbit;

    container.innerHTML = `
      <div class="speaking-modal-backdrop"></div>
      <div class="speaking-station-card">
        <div class="speaking-header">
          <div class="speaking-title-group">
            <span class="speaking-icon">🗣️</span>
            <div>
              <h2 class="speaking-title">CLASSROOM SPEAKING STATION</h2>
              <p class="speaking-subtitle">Turn to your partner and speak in English!</p>
            </div>
          </div>
          <button class="btn-close-speaking">✕</button>
        </div>

        <div class="speaking-body-grid">
          <!-- Left: Large Visual Character Card -->
          <div class="speaking-visual-column">
            <div class="speaking-animal-plate">
              ${renderAnimalSVG(animal.id, 'happy', 180, 180)}
              <div class="speaking-animal-name">${animal.title}</div>
              <div class="speaking-animal-badge">Habitat: ${animal.habitatName}</div>
            </div>
            
            <div class="speaking-partner-turn">
              <span class="partner-badge">Partner A / B Turn</span>
              <button class="btn-listen-model">
                <span class="btn-icon">🔊</span> Listen to Model
              </button>
            </div>
          </div>

          <!-- Right: Interactive Sentence Frames -->
          <div class="speaking-frames-column">
            <div class="frames-heading">${currentPrompt.title}</div>
            
            <div class="sentence-stems-list">
              ${currentPrompt.stems.map((stem, idx) => `
                <div class="sentence-stem-card" data-index="${idx}">
                  <span class="stem-number">${idx + 1}</span>
                  <span class="stem-text">${stem}</span>
                </div>
              `).join('')}
            </div>

            <!-- Helpful Word Bank -->
            <div class="speaking-word-bank">
              <span class="bank-label">Word Bank:</span>
              <div class="bank-tags">
                ${currentPrompt.vocab.map(v => `<span class="bank-tag">${v}</span>`).join('')}
              </div>
            </div>

            <div class="speaking-actions">
              <button class="btn-prev-prompt ${currentPromptIndex === 0 ? 'disabled' : ''}">◀ Previous Prompt</button>
              <button class="btn-i-spoke pulse-glow">⭐ I Spoke to My Partner!</button>
              <button class="btn-next-prompt ${currentPromptIndex === SPEAKING_PROMPTS.length - 1 ? 'disabled' : ''}">Next Prompt ▶</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners
    const closeBtn = container.querySelector('.btn-close-speaking');
    const backdrop = container.querySelector('.speaking-modal-backdrop');
    const modelBtn = container.querySelector('.btn-listen-model');
    const spokeBtn = container.querySelector('.btn-i-spoke');
    const prevBtn = container.querySelector('.btn-prev-prompt');
    const nextBtn = container.querySelector('.btn-next-prompt');

    closeBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      container.remove();
      if (onClose) onClose();
    });

    backdrop.addEventListener('pointerdown', () => {
      container.remove();
      if (onClose) onClose();
    });

    modelBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      const exampleText = currentPrompt.stems.map(s => s.replace(/______|\(|\)/g, '')).join('. ');
      audio.speak(exampleText);
    });

    spokeBtn.addEventListener('pointerdown', () => {
      audio.playSuccess();
      spokeBtn.classList.remove('pulse-glow');
      spokeBtn.textContent = '🎉 Awesome Job, Ranger!';
      setTimeout(() => {
        if (currentPromptIndex < SPEAKING_PROMPTS.length - 1) {
          currentPromptIndex++;
          buildContent();
        }
      }, 1500);
    });

    prevBtn.addEventListener('pointerdown', () => {
      if (currentPromptIndex > 0) {
        audio.playTap();
        currentPromptIndex--;
        buildContent();
      }
    });

    nextBtn.addEventListener('pointerdown', () => {
      if (currentPromptIndex < SPEAKING_PROMPTS.length - 1) {
        audio.playTap();
        currentPromptIndex++;
        buildContent();
      }
    });
  }

  buildContent();
  return container;
}
