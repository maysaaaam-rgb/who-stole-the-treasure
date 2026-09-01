/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Smart Screen & Touch-First Tap-to-Tap Interaction Manager
 */

import { audio } from './audio.js';

export class TapInteractionManager {
  constructor() {
    this.selectedSource = null;
    this.onPlaceCallback = null;
  }

  /**
   * Reset active selection state
   */
  clearSelection() {
    if (this.selectedSource) {
      this.selectedSource.element.classList.remove('tap-selected', 'pulse-glow');
    }
    this.selectedSource = null;
  }

  /**
   * Register a selectable source item (e.g. food card, shelter badge, animal card, story card)
   */
  makeSelectableSource(element, data, onSelect = null) {
    element.classList.add('tap-source-item');
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');

    const handleSelect = (e) => {
      e.stopPropagation();
      e.preventDefault();
      audio.playTap();

      // If already selected, deselect
      if (this.selectedSource && this.selectedSource.element === element) {
        this.clearSelection();
        return;
      }

      // Clear previous
      this.clearSelection();

      // Set new selection with rich visual pulse
      this.selectedSource = { element, data };
      element.classList.add('tap-selected', 'pulse-glow');

      if (onSelect) onSelect(data, element);
    };

    element.addEventListener('pointerdown', handleSelect);
  }

  /**
   * Register a target slot / recipient (e.g. hungry animal, shelter slot, sequence slot)
   */
  makeTargetSlot(element, targetData, onMatchCheck) {
    element.classList.add('tap-target-slot');
    element.setAttribute('role', 'region');

    const handleTargetTap = (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (!this.selectedSource) {
        // Gentle nudge indicating student needs to tap a source item first
        element.classList.add('shake-gentle');
        setTimeout(() => element.classList.remove('shake-gentle'), 500);
        audio.playGentleRetry();
        return;
      }

      const sourceData = this.selectedSource.data;
      const sourceEl = this.selectedSource.element;

      // Validate match
      const isCorrect = onMatchCheck(sourceData, targetData, sourceEl, element);

      if (isCorrect) {
        audio.playSuccess();
        element.classList.add('target-matched', 'sparkle-glow');
        sourceEl.classList.remove('tap-selected', 'pulse-glow');
        sourceEl.classList.add('source-used');
        this.selectedSource = null;
      } else {
        audio.playGentleRetry();
        element.classList.add('shake-error');
        setTimeout(() => element.classList.remove('shake-error'), 500);
      }
    };

    element.addEventListener('pointerdown', handleTargetTap);
  }

  /**
   * Single-tap choice button helper (e.g. modal prediction button, MCQ option)
   */
  bindDirectTap(element, onClick) {
    element.classList.add('direct-tap-button');
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');

    element.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      audio.playTap();
      onClick(e);
    });
  }
}

export const interaction = new TapInteractionManager();
