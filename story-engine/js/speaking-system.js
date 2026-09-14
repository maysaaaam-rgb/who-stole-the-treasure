/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — IN-GAME SPEAKING & SPEECH SYSTEM
 * 
 * Embeds speaking into natural character interaction moments:
 * - Uses Web Speech API (webkitSpeechRecognition / SpeechRecognition)
 * - Evaluates target phrase match, vocabulary inclusion & intelligibility
 * - Non-Intrusive In-Character Speech UI with Audio Waveform Animation
 * - Full Accessible Fallback: Keyboard input or single-click story skip
 * - Fires SPEAKING_ATTEMPT, SPEAKING_SUCCESS, SPEAKING_NEEDS_SUPPORT
 * ============================================================================
 */

(function(root) {
  'use strict';

  class SpeakingSystem {
    constructor(eventBus) {
      this.events = eventBus;
      this.recognition = null;
      this.isSupported = false;
      this.isListening = false;
      this.activePrompt = null;
      this.containerEl = null;

      this._initSpeechRecognition();
    }

    _initSpeechRecognition() {
      const SpeechRecognition = root.SpeechRecognition || root.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
          this.recognition.maxAlternatives = 3;

          this.recognition.onstart = () => {
            this.isListening = true;
            this._updateUIState('listening');
          };

          this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                finalTranscript += res[0].transcript;
              } else {
                interimTranscript += res[0].transcript;
              }
            }

            const currentText = (finalTranscript || interimTranscript).trim();
            this._updateHeardText(currentText);

            if (finalTranscript) {
              this._evaluateSpokenInput(finalTranscript);
            }
          };

          this.recognition.onerror = (event) => {
            console.warn('[SpeakingSystem] Recognition error:', event.error);
            this.isListening = false;
            this._updateUIState('error', event.error);
          };

          this.recognition.onend = () => {
            this.isListening = false;
            if (this.activePrompt && !this.activePrompt.completed) {
              this._updateUIState('idle');
            }
          };

          this.isSupported = true;
        } catch (e) {
          console.warn('[SpeakingSystem] SpeechRecognition initialization failed', e);
          this.isSupported = false;
        }
      } else {
        this.isSupported = false;
      }
    }

    /**
     * Mounts the speaking UI modal container into the DOM
     */
    initUI() {
      let el = document.getElementById('story-speech-modal');
      if (!el) {
        el = document.createElement('div');
        el.id = 'story-speech-modal';
        el.className = 'story-speech-modal';
        el.style.cssText = `
          display: none;
          position: fixed;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          border: 2px solid #3b82f6;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.25);
          border-radius: 20px;
          padding: 18px 24px;
          color: #f8fafc;
          z-index: 9999;
          font-family: 'Plus Jakarta Sans', sans-serif;
          max-width: 480px;
          width: 90%;
          text-align: center;
        `;

        el.innerHTML = `
          <div class="speech-modal-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="font-size:0.8rem; font-weight:800; color:#93c5fd; text-transform:uppercase; letter-spacing:0.06em;" id="speech-speaker-name">🗣️ Character Speaking</div>
            <span id="speech-support-badge" style="font-size:0.7rem; background:rgba(59,130,246,0.2); color:#bfdbfe; padding:2px 8px; border-radius:12px;">Interactive English</span>
          </div>
          <div id="speech-instruction-text" style="font-size:0.9rem; color:#cbd5e1; margin-bottom:8px;">Repeat after the character:</div>
          <div id="speech-target-phrase" style="font-size:1.35rem; font-weight:800; color:#fef08a; margin-bottom:14px; text-shadow:0 2px 10px rgba(254,240,138,0.3);">"Follow me!"</div>
          
          <!-- Animated Mic Waveform -->
          <div id="speech-waveform-container" style="display:flex; justify-content:center; align-items:center; gap:6px; height:36px; margin-bottom:14px;">
            <div class="speech-wave-bar" style="width:5px; height:12px; background:#38bdf8; border-radius:3px; animation: waveAnim 1s ease-in-out infinite;"></div>
            <div class="speech-wave-bar" style="width:5px; height:24px; background:#38bdf8; border-radius:3px; animation: waveAnim 0.8s ease-in-out infinite 0.1s;"></div>
            <div class="speech-wave-bar" style="width:5px; height:32px; background:#60a5fa; border-radius:3px; animation: waveAnim 0.9s ease-in-out infinite 0.2s;"></div>
            <div class="speech-wave-bar" style="width:5px; height:18px; background:#38bdf8; border-radius:3px; animation: waveAnim 0.7s ease-in-out infinite 0.15s;"></div>
            <div class="speech-wave-bar" style="width:5px; height:10px; background:#38bdf8; border-radius:3px; animation: waveAnim 1.1s ease-in-out infinite 0.05s;"></div>
          </div>

          <!-- Heard Live Preview -->
          <div id="speech-heard-preview" style="min-height:24px; font-size:0.95rem; color:#a5f3fc; font-style:italic; margin-bottom:14px;">Listening... Speak clearly into your mic!</div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:center; gap:12px;">
            <button type="button" id="speech-btn-mic" style="background:#2563eb; color:#fff; border:none; padding:8px 18px; border-radius:24px; font-weight:700; cursor:pointer; font-size:0.85rem; display:inline-flex; align-items:center; gap:6px;">
              <span>🎤</span> <span id="speech-mic-btn-label">Tap to Speak</span>
            </button>
            <button type="button" id="speech-btn-skip" style="background:rgba(255,255,255,0.12); color:#cbd5e1; border:1px solid rgba(255,255,255,0.2); padding:8px 16px; border-radius:24px; font-weight:600; cursor:pointer; font-size:0.85rem;">
              <span>⌨️</span> <span>Skip / Continue</span>
            </button>
          </div>
        `;
        document.body.appendChild(el);
      }
      this.containerEl = el;

      // Event handlers
      const btnMic = el.querySelector('#speech-btn-mic');
      if (btnMic) {
        btnMic.onclick = () => this.toggleListening();
      }
      const btnSkip = el.querySelector('#speech-btn-skip');
      if (btnSkip) {
        btnSkip.onclick = () => this.skipActivePrompt('User skipped via button');
      }
    }

    /**
     * Prompts the player to speak a target phrase in character.
     */
    promptSpeaking({ speaker, targetPhrase, targetWord, instruction, onComplete }) {
      this.initUI();

      this.activePrompt = {
        speaker: speaker || 'Guide',
        targetPhrase: targetPhrase || 'Hello',
        targetWord: targetWord || null,
        instruction: instruction || 'Say the phrase aloud:',
        onComplete: onComplete || null,
        completed: false,
        attempts: 0
      };

      const speakerEl = this.containerEl.querySelector('#speech-speaker-name');
      const instructionEl = this.containerEl.querySelector('#speech-instruction-text');
      const targetEl = this.containerEl.querySelector('#speech-target-phrase');
      const previewEl = this.containerEl.querySelector('#speech-heard-preview');

      if (speakerEl) speakerEl.textContent = `🗣️ ${this.activePrompt.speaker}`;
      if (instructionEl) instructionEl.textContent = this.activePrompt.instruction;
      if (targetEl) targetEl.textContent = `"${this.activePrompt.targetPhrase}"`;
      if (previewEl) {
        previewEl.textContent = this.isSupported 
          ? 'Listening... Speak into your microphone!' 
          : 'Speech recognition not supported in this browser. Click "Skip / Continue" to proceed!';
      }

      this.containerEl.style.display = 'block';

      if (this.events) {
        this.events.emit('SPEAKING_ATTEMPT', {
          targetPhrase: this.activePrompt.targetPhrase,
          targetWord: this.activePrompt.targetWord
        });
      }

      // Automatically start listening if supported
      if (this.isSupported && this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {
          // Already active
        }
      }
    }

    toggleListening() {
      if (!this.isSupported) {
        this._updateHeardText('Microphone unavailable. You can click Skip / Continue!');
        return;
      }

      if (this.isListening) {
        try {
          this.recognition.stop();
        } catch (e) {}
      } else {
        try {
          this.recognition.start();
        } catch (e) {}
      }
    }

    _updateUIState(state, info = '') {
      if (!this.containerEl) return;
      const btnLabel = this.containerEl.querySelector('#speech-mic-btn-label');
      const wave = this.containerEl.querySelector('#speech-waveform-container');

      if (state === 'listening') {
        if (btnLabel) btnLabel.textContent = 'Listening...';
        if (wave) wave.style.opacity = '1';
      } else if (state === 'idle') {
        if (btnLabel) btnLabel.textContent = 'Tap to Speak';
        if (wave) wave.style.opacity = '0.3';
      } else if (state === 'error') {
        if (btnLabel) btnLabel.textContent = 'Retry Speak';
        if (wave) wave.style.opacity = '0.2';
        this._updateHeardText(info === 'not-allowed' ? 'Microphone permission denied. Click Skip to proceed!' : 'Could not hear you clearly. Click Retry or Skip.');
      }
    }

    _updateHeardText(text) {
      if (!this.containerEl) return;
      const previewEl = this.containerEl.querySelector('#speech-heard-preview');
      if (previewEl) {
        previewEl.textContent = text ? `"${text}"` : 'Listening...';
      }
    }

    _evaluateSpokenInput(spokenText) {
      if (!this.activePrompt || this.activePrompt.completed) return;

      this.activePrompt.attempts++;
      const target = this.activePrompt.targetPhrase.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const spoken = spokenText.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const targetWord = (this.activePrompt.targetWord || '').toLowerCase();

      // Check match degree
      const exactMatch = spoken.includes(target) || target.includes(spoken);
      const wordMatch = targetWord ? spoken.includes(targetWord) : false;

      // Calculate simple token overlap similarity
      const targetTokens = target.split(' ');
      const spokenTokens = spoken.split(' ');
      const matchingTokens = targetTokens.filter(t => spokenTokens.includes(t));
      const matchScore = matchingTokens.length / Math.max(1, targetTokens.length);

      if (exactMatch || wordMatch || matchScore >= 0.6) {
        // SUCCESS!
        this.activePrompt.completed = true;
        this._updateHeardText(`✨ Excellent pronunciation! ("${spokenText}")`);
        
        if (root.StoryBridge && root.StoryBridge.playSound) {
          root.StoryBridge.playSound('correct');
        }

        if (this.events) {
          this.events.emit('SPEAKING_SUCCESS', {
            spoken: spokenText,
            targetPhrase: this.activePrompt.targetPhrase,
            targetWord: this.activePrompt.targetWord,
            accuracyScore: matchScore
          });
        }

        setTimeout(() => {
          this.closeUI();
          if (this.activePrompt && this.activePrompt.onComplete) {
            this.activePrompt.onComplete(true, spokenText);
          }
        }, 1200);

      } else {
        // Needs encouragement / support
        this._updateHeardText(`Almost! Try saying: "${this.activePrompt.targetPhrase}"`);

        if (this.events) {
          this.events.emit('SPEAKING_NEEDS_SUPPORT', {
            spoken: spokenText,
            targetPhrase: this.activePrompt.targetPhrase,
            targetWord: this.activePrompt.targetWord,
            attempts: this.activePrompt.attempts
          });
        }

        // If 2 attempts failed, offer direct pass
        if (this.activePrompt.attempts >= 2) {
          setTimeout(() => {
            this.skipActivePrompt('Two attempts completed');
          }, 1800);
        }
      }
    }

    skipActivePrompt(reason = 'Skipped') {
      if (!this.activePrompt) return;
      this.activePrompt.completed = true;

      this.closeUI();
      if (this.activePrompt.onComplete) {
        this.activePrompt.onComplete(false, reason);
      }
    }

    closeUI() {
      if (this.recognition && this.isListening) {
        try { this.recognition.stop(); } catch (e) {}
      }
      this.isListening = false;
      if (this.containerEl) {
        this.containerEl.style.display = 'none';
      }
      this.activePrompt = null;
    }
  }

  // Export to namespace
  root.StoryAdaptive = root.StoryAdaptive || {};
  root.StoryAdaptive.SpeakingSystem = SpeakingSystem;

})(window);
