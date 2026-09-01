/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Game Controller, State Manager & Smart Screen Interaction Engine
   ========================================================================== */

class JungleGameEngine {
  constructor() {
    this.currentChapterIdx = 0;
    this.jungleHealth = 70;
    this.scores = { forest: 0, river: 0 };
    this.activeTurn = 'forest';
    this.selectedDraggable = null;
    this.activeSubState = {
      detectiveCaseIdx: 0,
      machineRoundIdx: 0,
      emergencyMissionIdx: 0,
      emergencyStep: 1,
      finalChallengeId: 'c1',
      selectedReportAnimal: 'frog'
    };

    this.init();
  }

  init() {
    this.bindGlobalEvents();
    this.renderCurrentChapter();
    this.updateHealthBar(this.jungleHealth);
    this.setupConfetti();
  }

  // =========================================================================
  // CHAPTER NAVIGATION & RENDERING
  // =========================================================================
  goToChapter(idx) {
    if (idx < 0 || idx >= window.JUNGLE_DATA.chapters.length) return;
    this.currentChapterIdx = idx;
    this.activeSubState = {
      detectiveCaseIdx: 0,
      machineRoundIdx: 0,
      emergencyMissionIdx: 0,
      emergencyStep: 1,
      finalChallengeId: 'c1',
      selectedReportAnimal: 'frog'
    };
    this.renderCurrentChapter();
    window.jungleAudio.playClick();
  }

  nextChapter() {
    if (this.currentChapterIdx < window.JUNGLE_DATA.chapters.length - 1) {
      this.goToChapter(this.currentChapterIdx + 1);
    } else {
      // Show Final Speaking Report / Certificate
      this.renderSpeakingStudio();
    }
  }

  prevChapter() {
    if (this.currentChapterIdx > 0) {
      this.goToChapter(this.currentChapterIdx - 1);
    }
  }

  renderCurrentChapter() {
    const chapter = window.JUNGLE_DATA.chapters[this.currentChapterIdx];
    if (!chapter) return;

    // Update Top HUD
    const chapterNumEl = document.getElementById('hud-chapter-num');
    const chapterTitleEl = document.getElementById('hud-chapter-title');
    if (chapterNumEl) chapterNumEl.textContent = `Ch. ${chapter.number}`;
    if (chapterTitleEl) chapterTitleEl.textContent = chapter.title;

    // Update Narration Bar
    const dialogueEl = document.getElementById('narrator-dialogue-text');
    const speakerEl = document.getElementById('narrator-speaker-name');
    if (dialogueEl && chapter.narrator) {
      dialogueEl.innerHTML = this.formatDialogueText(chapter.narrator.text);
    }
    if (speakerEl && chapter.narrator) {
      speakerEl.textContent = chapter.narrator.speaker;
    }

    // Update Teacher HUD Drawer
    this.updateTeacherHUD(chapter);

    // Render Stage View
    const stageContainer = document.getElementById('stage-canvas-area');
    if (!stageContainer) return;

    switch (chapter.type) {
      case 'needs_wheel':
        window.jungleViews.renderChapter1(stageContainer, chapter);
        break;
      case 'storm_animation':
        window.jungleViews.renderChapter2(stageContainer, chapter);
        this.triggerStormEffects();
        break;
      case 'prediction_choice':
        window.jungleViews.renderPredictionChoice(stageContainer, chapter);
        break;
      case 'habitat_drag':
        window.jungleViews.renderHabitatDrag(stageContainer, chapter);
        break;
      case 'detective_mystery':
        window.jungleViews.renderDetectiveMystery(stageContainer, chapter, this.activeSubState.detectiveCaseIdx);
        break;
      case 'feed_matcher':
        window.jungleViews.renderFeedMatcher(stageContainer, chapter);
        break;
      case 'timeline_order':
        window.jungleViews.renderTimelineOrder(stageContainer, chapter);
        break;
      case 'food_chain_builder':
        window.jungleViews.renderFoodChainBuilder(stageContainer, chapter);
        break;
      case 'ecosystem_cascade':
        window.jungleViews.renderEcosystemCascade(stageContainer, chapter);
        break;
      case 'prediction_machine':
        window.jungleViews.renderPredictionMachine(stageContainer, chapter, this.activeSubState.machineRoundIdx);
        break;
      case 'before_after_compare':
        window.jungleViews.renderBeforeAfter(stageContainer, chapter);
        break;
      case 'emergency_simulator':
        window.jungleViews.renderEmergencySimulator(
          stageContainer,
          chapter,
          this.activeSubState.emergencyMissionIdx,
          this.activeSubState.emergencyStep
        );
        break;
      case 'final_crisis_hub':
        window.jungleViews.renderFinalCrisisHub(stageContainer, chapter, this.activeSubState.finalChallengeId);
        break;
      default:
        stageContainer.innerHTML = `<div class="stage-board"><div style="color:#fff;">Loading chapter...</div></div>`;
    }

    // Attach Interaction Handlers for the newly rendered elements
    this.attachStageInteractionHandlers(chapter);

    // Speak Narration Line automatically if speech enabled
    if (window.jungleAudio.isSpeechEnabled && chapter.narrator) {
      window.jungleAudio.speak(chapter.narrator.spokenText || chapter.narrator.text);
    }
  }

  formatDialogueText(text) {
    return text
      .replace(/\b(will|WILL)\b/g, '<span class="highlight-will">$1</span>')
      .replace(/\b(might|MIGHT|may|MAY|could|COULD)\b/g, '<span class="highlight-might">$1</span>')
      .replace(/\b(if|IF|If)\b/g, '<span class="highlight-if">$1</span>')
      .replace(/\b(HABITAT|PREDATOR|PREY|ECOSYSTEM)\b/g, '<span class="highlight-vocab">$1</span>');
  }

  // =========================================================================
  // JUNGLE HEALTH SYSTEM & ENVIRONMENT REACTIVITY
  // =========================================================================
  changeHealth(delta) {
    this.jungleHealth = Math.max(10, Math.min(100, this.jungleHealth + delta));
    this.updateHealthBar(this.jungleHealth);
  }

  updateHealthBar(health) {
    const fillEl = document.getElementById('jungle-health-fill');
    const pctEl = document.getElementById('jungle-health-pct');
    const viewport = document.getElementById('stage-viewport');

    if (fillEl) fillEl.style.width = `${health}%`;
    if (pctEl) pctEl.textContent = `${health}%`;

    // Dynamic environment classes based on health
    if (viewport) {
      if (health < 40) {
        viewport.classList.add('polluted-mode');
        viewport.classList.remove('healthy-mode');
      } else if (health >= 80) {
        viewport.classList.add('healthy-mode');
        viewport.classList.remove('polluted-mode');
      } else {
        viewport.classList.remove('polluted-mode', 'healthy-mode');
      }
    }
  }

  triggerStormEffects() {
    const flash = document.getElementById('lightning-fx');
    const viewport = document.getElementById('stage-viewport');
    if (viewport) viewport.classList.add('storm-mode');

    window.jungleAudio.playWind();
    setTimeout(() => {
      window.jungleAudio.playThunder();
      if (flash) {
        flash.classList.add('flash-active');
        setTimeout(() => flash.classList.remove('flash-active'), 120);
        setTimeout(() => flash.classList.add('flash-active'), 250);
        setTimeout(() => flash.classList.remove('flash-active'), 350);
      }
    }, 800);

    setTimeout(() => {
      window.jungleAudio.playTreeCrash();
    }, 1800);
  }

  // =========================================================================
  // CLASSROOM TEAM POINTS
  // =========================================================================
  addTeamPoint(team, points = 1) {
    if (!this.scores[team] && this.scores[team] !== 0) return;
    this.scores[team] += points;

    const scoreEl = document.getElementById(`score-${team}`);
    if (scoreEl) scoreEl.textContent = this.scores[team];

    window.jungleAudio.playStarPoint();
    this.launchMiniConfetti();
  }

  switchActiveTurn(team) {
    this.activeTurn = team;
    document.querySelectorAll('.team-score-card').forEach(c => c.classList.remove('active-turn'));
    const card = document.getElementById(`team-card-${team}`);
    if (card) card.classList.add('active-turn');
  }

  // =========================================================================
  // INTERACTIVE STAGE EVENT HANDLERS
  // =========================================================================
  attachStageInteractionHandlers(chapter) {
    this.initDragAndDrop();

    // 1. Prediction Choices Handler
    document.querySelectorAll('.choice-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          btn.classList.add('correct-choice');
          window.jungleAudio.playSuccess();
          this.changeHealth(chapter.healthChange || 10);
          this.addTeamPoint(this.activeTurn, 2);

          // Reveal sub-tasks if available
          const subtask = document.getElementById('prediction-subtask');
          if (subtask) subtask.style.display = 'block';

          const cascade2 = document.getElementById('cascade-step-2');
          if (cascade2 && btn.classList.contains('cascade-q1-btn')) {
            cascade2.style.display = 'block';
          }
        } else {
          btn.classList.add('wrong-choice');
          btn.classList.add('drop-wrong-shake');
          window.jungleAudio.playHint();
          setTimeout(() => btn.classList.remove('drop-wrong-shake'), 600);
        }
      });
    });

    // 2. Berry Bush Tapper for Boris (Chapter 7)
    document.querySelectorAll('.berry-bush-btn').forEach(bush => {
      bush.addEventListener('click', () => {
        bush.textContent = '🍓 Berries!';
        bush.style.background = '#059669';
        window.jungleAudio.playMunch();
        this.addTeamPoint(this.activeTurn, 1);
      });
    });

    // 3. Detective Mystery Choices (Chapter 8)
    document.querySelectorAll('.detective-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          btn.classList.add('correct-choice');
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 2);
          setTimeout(() => {
            if (this.activeSubState.detectiveCaseIdx < chapter.cases.length - 1) {
              this.activeSubState.detectiveCaseIdx++;
              this.renderCurrentChapter();
            } else {
              this.nextChapter();
            }
          }, 1000);
        } else {
          btn.classList.add('drop-wrong-shake');
          window.jungleAudio.playHint();
          setTimeout(() => btn.classList.remove('drop-wrong-shake'), 600);
        }
      });
    });

    // 4. Prediction Machine Tokens (Chapter 14)
    document.querySelectorAll('.word-token-btn').forEach(tokBtn => {
      tokBtn.addEventListener('click', () => {
        const token = tokBtn.getAttribute('data-token');
        const slot = document.getElementById('machine-slot');
        const round = chapter.rounds[this.activeSubState.machineRoundIdx];

        if (slot && round) {
          slot.textContent = token;
          slot.classList.add('filled');
          window.jungleAudio.playClick();

          if (token === round.correctToken) {
            window.jungleAudio.playSuccess();
            this.addTeamPoint(this.activeTurn, 2);
            setTimeout(() => {
              if (this.activeSubState.machineRoundIdx < chapter.rounds.length - 1) {
                this.activeSubState.machineRoundIdx++;
                this.renderCurrentChapter();
              } else {
                this.nextChapter();
              }
            }, 1200);
          } else {
            slot.classList.add('drop-wrong-shake');
            window.jungleAudio.playHint();
            setTimeout(() => slot.classList.remove('drop-wrong-shake'), 600);
          }
        }
      });
    });

    // 5. Emergency Simulator Controls (Chapter 16)
    document.querySelectorAll('.mission-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeSubState.emergencyMissionIdx = parseInt(tab.getAttribute('data-idx'));
        this.activeSubState.emergencyStep = 1;
        this.renderCurrentChapter();
      });
    });

    const nextMissionBtn = document.getElementById('btn-next-mission');
    if (nextMissionBtn) {
      nextMissionBtn.addEventListener('click', () => {
        if (this.activeSubState.emergencyMissionIdx < chapter.missions.length - 1) {
          this.activeSubState.emergencyMissionIdx++;
          this.activeSubState.emergencyStep = 1;
          this.renderCurrentChapter();
        } else {
          this.nextChapter();
        }
      });
    }

    // 6. Emergency Step 1 & 2 Buttons
    document.querySelectorAll('.sim-step1-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('data-correct') === 'true') {
          btn.classList.add('correct-choice');
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 2);
          setTimeout(() => {
            this.activeSubState.emergencyStep = 2;
            this.renderCurrentChapter();
          }, 800);
        } else {
          btn.classList.add('drop-wrong-shake');
          window.jungleAudio.playHint();
          setTimeout(() => btn.classList.remove('drop-wrong-shake'), 600);
        }
      });
    });

    document.querySelectorAll('.sim-step2-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('data-correct') === 'true') {
          btn.classList.add('correct-choice');
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 2);
          setTimeout(() => {
            this.activeSubState.emergencyStep = 3;
            this.renderCurrentChapter();
          }, 800);
        } else {
          btn.classList.add('drop-wrong-shake');
          window.jungleAudio.playHint();
          setTimeout(() => btn.classList.remove('drop-wrong-shake'), 600);
        }
      });
    });

    // 7. Final Challenges Tabs (Chapter 17)
    document.querySelectorAll('[data-chall]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeSubState.finalChallengeId = btn.getAttribute('data-chall');
        this.renderCurrentChapter();
      });
    });

    // 8. Start Rescue Button (Chapter 2)
    const rescueStartBtn = document.getElementById('btn-start-emergency-rescue');
    if (rescueStartBtn) {
      rescueStartBtn.addEventListener('click', () => this.nextChapter());
    }
  }

  // =========================================================================
  // SMART SCREEN DRAG & DROP + TAP TO PLACE
  // =========================================================================
  initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropTargets = document.querySelectorAll('.drop-target');

    draggables.forEach(item => {
      // Tap-to-select fallback for whiteboard
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectedDraggable === item) {
          item.classList.remove('tap-selected');
          this.selectedDraggable = null;
        } else {
          if (this.selectedDraggable) {
            this.selectedDraggable.classList.remove('tap-selected');
          }
          this.selectedDraggable = item;
          item.classList.add('tap-selected');
          window.jungleAudio.playClick();
        }
      });

      // Pointer Drag Events
      item.addEventListener('pointerdown', (e) => {
        item.setPointerCapture(e.pointerId);
        item.classList.add('is-dragging');
        this.selectedDraggable = item;
      });

      item.addEventListener('pointerup', (e) => {
        item.releasePointerCapture(e.pointerId);
        item.classList.remove('is-dragging');

        // Check if dropped over a valid drop target
        const dropElem = document.elementFromPoint(e.clientX, e.clientY);
        if (dropElem) {
          const target = dropElem.closest('.drop-target');
          if (target) {
            this.handleDrop(item, target);
          }
        }
      });
    });

    // Direct Target Click (Tap-to-place completion)
    dropTargets.forEach(target => {
      target.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectedDraggable) {
          this.handleDrop(this.selectedDraggable, target);
          this.selectedDraggable.classList.remove('tap-selected');
          this.selectedDraggable = null;
        }
      });
    });
  }

  handleDrop(item, target) {
    const chapter = window.JUNGLE_DATA.chapters[this.currentChapterIdx];

    // Needs wheel dropping
    if (target.getAttribute('data-target') === 'survival-ring') {
      const isCorrect = item.getAttribute('data-correct') === 'true';
      const itemId = item.getAttribute('data-id');
      if (isCorrect) {
        const slot = document.getElementById(`slot-${itemId}`);
        if (slot) {
          slot.textContent = item.querySelector('.item-emoji')?.textContent || '✅';
          slot.classList.add('filled');
          item.style.display = 'none';
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 1);
        }
      } else {
        target.classList.add('drop-wrong-shake');
        window.jungleAudio.playHint();
        setTimeout(() => target.classList.remove('drop-wrong-shake'), 600);
      }
      return;
    }

    // Habitat dropping
    if (target.classList.contains('habitat-zone-card')) {
      const isCorrect = target.getAttribute('data-correct') === 'true';
      if (isCorrect) {
        target.querySelector('.habitat-actor-slot').textContent = '🐿️ Safe!';
        target.classList.add('drop-correct');
        window.jungleAudio.playSuccess();
        this.addTeamPoint(this.activeTurn, 2);
        const reasoningArea = document.getElementById('habitat-reasoning-area');
        if (reasoningArea) reasoningArea.style.display = 'block';
      } else {
        target.classList.add('drop-wrong-shake');
        window.jungleAudio.playHint();
        setTimeout(() => target.classList.remove('drop-wrong-shake'), 600);
      }
      return;
    }

    // Feeding animals
    if (target.classList.contains('feed-drop-target')) {
      const animal = target.getAttribute('data-animal');
      const match = item.getAttribute('data-match');
      if (animal === match) {
        target.classList.add('drop-correct');
        const badge = document.getElementById(`fed-${animal}`);
        if (badge) badge.textContent = 'Full & Happy! 💚';
        item.style.display = 'none';
        window.jungleAudio.playMunch();
        this.addTeamPoint(this.activeTurn, 1);
      } else {
        target.classList.add('drop-wrong-shake');
        window.jungleAudio.playHint();
        setTimeout(() => target.classList.remove('drop-wrong-shake'), 600);
      }
      return;
    }

    // Food Chain Builder
    if (target.classList.contains('chain-node-slot')) {
      const expect = target.getAttribute('data-expect');
      const cardId = item.getAttribute('data-id');
      if (expect === cardId) {
        target.classList.add('filled');
        target.innerHTML = `
          <span class="chain-role-tag">${target.querySelector('.chain-role-tag')?.textContent || ''}</span>
          <span style="font-size:3.2rem;">${item.querySelector('.item-emoji')?.textContent || ''}</span>
          <span style="font-family:var(--font-display); font-weight:800; color:#065f46;">${item.querySelector('.item-label')?.textContent || ''}</span>
        `;
        item.style.display = 'none';
        window.jungleAudio.playSuccess();
        this.addTeamPoint(this.activeTurn, 1);
      } else {
        target.classList.add('drop-wrong-shake');
        window.jungleAudio.playHint();
        setTimeout(() => target.classList.remove('drop-wrong-shake'), 600);
      }
      return;
    }

    // Emergency Simulator Step 3
    if (target.classList.contains('sim-action-target')) {
      target.textContent = '✅ Mission Accomplished!';
      target.classList.add('drop-correct');
      window.jungleAudio.playSuccess();
      this.addTeamPoint(this.activeTurn, 2);
      setTimeout(() => {
        this.activeSubState.emergencyStep = 4;
        this.renderCurrentChapter();
      }, 800);
      return;
    }
  }

  // =========================================================================
  // TEACHER HUD DRAWER & GUIDE
  // =========================================================================
  updateTeacherHUD(chapter) {
    const scriptBox = document.getElementById('teacher-script-say');
    const doBox = document.getElementById('teacher-script-do');
    const nextBox = document.getElementById('teacher-script-next');
    const chapterSelect = document.getElementById('teacher-chapter-select');

    if (chapter.teacherGuide) {
      if (scriptBox) scriptBox.textContent = chapter.teacherGuide.say;
      if (doBox) doBox.textContent = chapter.teacherGuide.do;
      if (nextBox) nextBox.textContent = chapter.teacherGuide.next;
    }

    if (chapterSelect) {
      chapterSelect.value = this.currentChapterIdx;
    }
  }

  toggleTeacherDrawer() {
    const drawer = document.getElementById('teacher-drawer');
    const btn = document.getElementById('btn-toggle-teacher');
    if (drawer) {
      drawer.classList.toggle('open');
      if (btn) btn.classList.toggle('active');
    }
  }

  // =========================================================================
  // SPEAKING STUDIO & CERTIFICATE MODAL
  // =========================================================================
  renderSpeakingStudio() {
    const stageContainer = document.getElementById('stage-canvas-area');
    if (stageContainer) {
      window.jungleViews.renderSpeakingReport(stageContainer, this.activeSubState.selectedReportAnimal);

      // Speaking Report Events
      document.querySelectorAll('.picker-animal-card').forEach(c => {
        c.addEventListener('click', () => {
          this.activeSubState.selectedReportAnimal = c.getAttribute('data-id');
          this.renderSpeakingStudio();
        });
      });

      const speakBtn = document.getElementById('btn-read-report');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          const report = window.JUNGLE_DATA.speakingReport.animals.find(a => a.id === this.activeSubState.selectedReportAnimal);
          if (report) {
            const speechText = `This is a ${report.name}. It lives ${report.habitat}. It eats ${report.food}. It needs ${report.needs}. If ${report.ifClause}, it will ${report.willAction}. It might do this because ${report.mightReason}.`;
            window.jungleAudio.speak(speechText);
          }
        });
      }

      const certBtn = document.getElementById('btn-show-certificate');
      if (certBtn) {
        certBtn.addEventListener('click', () => this.showCertificateModal());
      }
    }
  }

  showCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
      document.getElementById('cert-forest-score').textContent = this.scores.forest;
      document.getElementById('cert-river-score').textContent = this.scores.river;
      modal.classList.add('active');
      window.jungleAudio.playFanfare();
      this.launchVictoryConfetti();
    }
  }

  hideCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.remove('active');
  }

  // =========================================================================
  // GLOBAL EVENT BINDINGS & KEYBOARD SHORTCUTS
  // =========================================================================
  bindGlobalEvents() {
    // Navigation Buttons
    const nextBtn = document.getElementById('nav-btn-next');
    const prevBtn = document.getElementById('nav-btn-prev');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextChapter());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevChapter());

    // Teacher Guide Toggle
    const teacherToggleBtn = document.getElementById('btn-toggle-teacher');
    const teacherCloseBtn = document.getElementById('btn-close-teacher-drawer');
    if (teacherToggleBtn) teacherToggleBtn.addEventListener('click', () => this.toggleTeacherDrawer());
    if (teacherCloseBtn) teacherCloseBtn.addEventListener('click', () => this.toggleTeacherDrawer());

    // Audio & Speech Toggles
    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.jungleAudio.toggleMute();
        muteBtn.innerHTML = isMuted ? '<span>🔇</span>' : '<span>🔊</span>';
      });
    }

    const narratorSpeakBtn = document.getElementById('narrator-speak-btn');
    if (narratorSpeakBtn) {
      narratorSpeakBtn.addEventListener('click', () => {
        const chapter = window.JUNGLE_DATA.chapters[this.currentChapterIdx];
        if (chapter && chapter.narrator) {
          window.jungleAudio.speak(chapter.narrator.spokenText || chapter.narrator.text);
        }
      });
    }

    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById('btn-toggle-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen();
        }
      });
    }

    // Classroom Team Score Buttons
    const addForestBtn = document.getElementById('btn-add-forest');
    const addRiverBtn = document.getElementById('btn-add-river');
    if (addForestBtn) {
      addForestBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addTeamPoint('forest', 1);
        this.switchActiveTurn('forest');
      });
    }
    if (addRiverBtn) {
      addRiverBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addTeamPoint('river', 1);
        this.switchActiveTurn('river');
      });
    }

    // Soundboard FX Buttons
    document.querySelectorAll('[data-fx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fx = btn.getAttribute('data-fx');
        if (fx === 'wind') window.jungleAudio.playWind();
        if (fx === 'thunder') window.jungleAudio.playThunder();
        if (fx === 'crash') window.jungleAudio.playTreeCrash();
        if (fx === 'splash') window.jungleAudio.playWaterSplash();
        if (fx === 'munch') window.jungleAudio.playMunch();
        if (fx === 'fanfare') window.jungleAudio.playFanfare();
      });
    });

    // Chapter Select Dropdown in Teacher HUD
    const chapterSelect = document.getElementById('teacher-chapter-select');
    if (chapterSelect) {
      window.JUNGLE_DATA.chapters.forEach((chap, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `Ch ${chap.number}: ${chap.title}`;
        chapterSelect.appendChild(opt);
      });
      chapterSelect.addEventListener('change', (e) => {
        this.goToChapter(parseInt(e.target.value));
      });
    }

    // Keyboard Shortcuts for Classroom Whiteboard & Teacher Remote
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        this.nextChapter();
      } else if (e.key === 'ArrowLeft') {
        this.prevChapter();
      } else if (e.key === 't' || e.key === 'T') {
        this.toggleTeacherDrawer();
      } else if (e.key === 'm' || e.key === 'M') {
        if (muteBtn) muteBtn.click();
      } else if (e.key === 'f' || e.key === 'F') {
        if (fullscreenBtn) fullscreenBtn.click();
      }
    });
  }

  // =========================================================================
  // CELEBRATION CONFETTI ENGINE
  // =========================================================================
  setupConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.confettiParticles = [];

    const resize = () => {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  launchMiniConfetti() {
    for (let i = 0; i < 30; i++) {
      this.confettiParticles.push(this.createConfettiParticle());
    }
    this.animateConfetti();
  }

  launchVictoryConfetti() {
    for (let i = 0; i < 150; i++) {
      this.confettiParticles.push(this.createConfettiParticle());
    }
    this.animateConfetti();
  }

  createConfettiParticle() {
    const colors = ['#10b981', '#f59e0b', '#38bdf8', '#fbbf24', '#f43f5e', '#a78bfa'];
    return {
      x: Math.random() * window.innerWidth,
      y: -20,
      r: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 5 + 3,
      tilt: Math.random() * 10,
      tiltSpeed: Math.random() * 0.1 + 0.05
    };
  }

  animateConfetti() {
    if (!this.confettiCtx || this.confettiParticles.length === 0) return;
    this.confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.tilt += p.tiltSpeed;

      this.confettiCtx.beginPath();
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, Math.PI * 2);
      this.confettiCtx.fill();

      if (p.y > window.innerHeight) {
        this.confettiParticles.splice(i, 1);
      }
    }

    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    }
  }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.jungleGame = new JungleGameEngine();
});
