/**
 * 🧠 THE DAY YOUR BRAIN QUIT! — Interactive Scenes Renderer
 * Full 10-screen narrative & pedagogical adventure
 */

class BrainScenesRenderer {
  constructor(app) {
    this.app = app;
    this.data = window.BRAIN_LESSON_DATA;
    this.timerInterval = null;
    this.timerSeconds = 30;
  }

  // SCREEN 1: THE MYSTERIOUS MESSAGE
  renderScreen1(container) {
    const s1 = this.data.screen1;
    container.innerHTML = `
      <div class="screen1-wrap">
        <div class="letter-panel">
          <div class="letter-header">
            <div class="letter-title">${s1.urgentHeader}</div>
            <button class="hud-btn" id="s1-read-btn" title="Read Letter Aloud">
              🔊 <span>Listen</span>
            </button>
          </div>
          <div class="letter-body">
            ${s1.letter.map(line => `<p>${line}</p>`).join('')}
          </div>
          <div class="letter-sign">— Your Brain 🧠</div>

          <div class="screen1-question-box">
            <h4>${s1.question}</h4>
            <div class="choice-bubble-grid">
              ${s1.options.map(opt => `
                <button class="choice-btn" data-id="${opt.id}">
                  <strong>${opt.id}.</strong> ${opt.text}
                </button>
              `).join('')}
            </div>
            <div class="reaction-banner" id="s1-reaction"></div>
            <button class="start-mission-btn" id="s1-start-btn">
              START MISSION 🔎
            </button>
          </div>
        </div>
      </div>
    `;

    // Listen letter
    container.querySelector('#s1-read-btn').onclick = () => {
      this.app.audio.speak(s1.letter.join(' '));
    };

    // Options click
    const choiceBtns = container.querySelectorAll('.choice-btn');
    const reactionBox = container.querySelector('#s1-reaction');
    const startBtn = container.querySelector('#s1-start-btn');

    choiceBtns.forEach(btn => {
      btn.onclick = () => {
        choiceBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const optId = btn.getAttribute('data-id');
        const opt = s1.options.find(o => o.id === optId);

        reactionBox.style.display = 'block';
        reactionBox.innerHTML = `🧠 <em>"${opt.reaction}"</em>`;
        this.app.audio.playCorrect();
        this.app.audio.speak(opt.reaction);

        startBtn.style.display = 'flex';
      };
    });

    startBtn.onclick = () => {
      this.app.audio.playDoorOpen();
      this.app.goToStage(2);
    };

    // Auto chime on load
    setTimeout(() => {
      this.app.audio.playNotification();
    }, 400);
  }

  // SCREEN 2: BRAIN EMERGENCY MEETING
  renderScreen2(container) {
    const s2 = this.data.screen2;
    container.innerHTML = `
      <div class="screen2-wrap">
        <div class="screen2-content">
          <div class="screen-header-bar">
            <h2>🚨 BRAIN EMERGENCY MEETING</h2>
            <p>${s2.prompt} ${s2.subtitle}</p>
          </div>

          <div class="nodes-grid">
            ${s2.nodes.map(node => `
              <div class="node-card" data-id="${node.id}" style="--node-color: ${node.color}">
                <div class="node-icon-wrap">${node.icon}</div>
                <div class="node-title">${node.title}</div>
                <div class="node-headline">${node.headline}</div>
                <div class="node-example">${node.example}</div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: center; margin-top: 14px; gap: 14px;">
            <button class="hud-btn primary" id="s2-continue-btn" style="padding: 12px 28px; font-size: 16px;">
              INVESTIGATE WITH DETECTIVE EYES ➔
            </button>
          </div>
        </div>
      </div>
    `;

    const cards = container.querySelectorAll('.node-card');
    cards.forEach(card => {
      card.onclick = () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const nodeId = card.getAttribute('data-id');
        const node = s2.nodes.find(n => n.id === nodeId);
        this.app.audio.playSnap();
        this.app.audio.speak(node.voice);
      };
    });

    container.querySelector('#s2-continue-btn').onclick = () => {
      this.app.audio.playCorrect();
      this.app.goToStage(3);
    };
  }

  // SCREEN 3: SKIM LIKE A DETECTIVE (PEDAGOGICAL CORE)
  renderScreen3(container) {
    const s3 = this.data.screen3;
    this.timerSeconds = s3.timerSeconds;
    if (this.timerInterval) clearInterval(this.timerInterval);

    container.innerHTML = `
      <div class="screen3-wrap">
        <div class="screen3-left">
          <div class="detective-intro-box">
            <img src="../assets/detective_avatar.jpg" alt="Detective" class="detective-avatar-mini">
            <div class="detective-speech">
              "${s3.detectiveSaid}"<br>
              <span style="color:#f59e0b;">🧠 "${s3.brainSaid}"</span>
            </div>
          </div>

          <div class="timer-box">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #fca5a5; letter-spacing: 1px;">SKIMMING TIMER</div>
              <div class="timer-digits" id="timer-display">00:${this.timerSeconds < 10 ? '0' : ''}${this.timerSeconds}</div>
            </div>
            <div style="display:flex; gap: 8px;">
              <button class="timer-btn" id="start-timer-btn">⏱️ START</button>
              <button class="timer-btn" id="reset-timer-btn" style="background:#475569;">RESET</button>
            </div>
          </div>

          <div class="rules-card">
            <h3>📜 SKIMMING RULES:</h3>
            <ul class="rules-list">
              ${s3.rules.map(r => `
                <li class="${r.step === 5 ? 'highlight-rule' : ''}">
                  <span>${r.icon}</span>
                  <span>${r.step}. ${r.text}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <button class="hud-btn primary" id="s3-ready-btn" style="padding: 12px; font-size: 16px; justify-content: center;">
            DOORS CHALLENGE ➔
          </button>
        </div>

        <div class="screen3-right">
          <img src="../assets/textbook_brain_page.jpg" alt="Textbook Page" class="textbook-img">
          
          <div class="hotspot-tag title-pos" data-spot="title">
            🏷️ TITLE: How Your Brain Learns
          </div>
          <div class="hotspot-tag pic-pos" data-spot="diagram">
            🖼️ PICTURE: Brain Parts
          </div>
          <div class="hotspot-tag words-pos" data-spot="keywords">
            🔤 WORDS: learn, parts, remember
          </div>
        </div>
      </div>
    `;

    const timerDisplay = container.querySelector('#timer-display');
    const startTimerBtn = container.querySelector('#start-timer-btn');
    const resetTimerBtn = container.querySelector('#reset-timer-btn');

    const updateTimer = () => {
      timerDisplay.textContent = `00:${this.timerSeconds < 10 ? '0' : ''}${this.timerSeconds}`;
    };

    startTimerBtn.onclick = () => {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        startTimerBtn.textContent = 'RESUME';
        return;
      }
      startTimerBtn.textContent = 'PAUSE';
      this.timerInterval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
          this.app.audio.playClockTick();
          updateTimer();
        } else {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          this.app.audio.playClockAlarm();
          this.app.audio.speak("Time is up! What is the reading mainly about?");
          startTimerBtn.textContent = "TIME'S UP!";
        }
      }, 1000);
    };

    resetTimerBtn.onclick = () => {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.timerSeconds = 30;
      updateTimer();
      startTimerBtn.textContent = '⏱️ START';
    };

    // Hotspots click
    container.querySelectorAll('.hotspot-tag').forEach(tag => {
      tag.onclick = () => {
        const spotId = tag.getAttribute('data-spot');
        const spot = s3.textbookHotspots.find(h => h.id === spotId);
        this.app.audio.playSnap();
        this.app.audio.speak(`${spot.badge}: ${spot.title}. ${spot.text}`);
      };
    });

    container.querySelector('#s3-ready-btn').onclick = () => {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.app.goToStage(4);
    };
  }

  // SCREEN 4: THE FOUR DOORS (MAIN IDEA & CLUE 1)
  renderScreen4(container) {
    const s4 = this.data.screen4;
    container.innerHTML = `
      <div class="screen4-wrap">
        <div class="screen4-content">
          <div class="screen-header-bar">
            <h2>🚪 THE FOUR DOORS</h2>
            <p>${s4.question} ${s4.subQuestion}</p>
          </div>

          <div class="doors-grid">
            ${s4.doors.map(door => `
              <div class="door-card" data-id="${door.id}">
                <div class="door-letter-badge">${door.letter}</div>
                <div class="door-icon">${door.icon}</div>
                <div class="door-title">${door.title}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Metacognition Skimming Proof Modal -->
        <div class="metacog-modal" id="metacog-modal">
          <div class="metacog-card">
            <h2 style="font-size: 26px; color: #10b981; margin-bottom: 8px;">🎉 DOOR OPENED!</h2>
            <p style="font-size: 18px; color: #f8fafc; font-weight: 800;">${s4.metacognition.question}</p>
            
            <div class="metacog-tools-grid">
              ${s4.metacognition.tools.map(tool => `
                <button class="metacog-btn" data-tool="${tool.id}">
                  ${tool.label}
                </button>
              `).join('')}
            </div>

            <div id="metacog-feedback" style="min-height: 40px; font-size: 16px; font-weight: 800; color: #38bdf8; margin-bottom: 14px;"></div>

            <button class="hud-btn gold" id="collect-clue1-btn" style="padding: 12px 28px; font-size: 16px; margin: 0 auto; display: none;">
              🔍 COLLECT CLUE 1 ➔
            </button>
          </div>
        </div>
      </div>
    `;

    const doors = container.querySelectorAll('.door-card');
    const modal = container.querySelector('#metacog-modal');

    doors.forEach(door => {
      door.onclick = () => {
        const dId = door.getAttribute('data-id');
        const doorObj = s4.doors.find(d => d.id === dId);

        if (doorObj.correct) {
          door.classList.add('correct');
          this.app.audio.playDoorOpen();
          setTimeout(() => {
            modal.classList.add('show');
            this.app.audio.speak(s4.metacognition.question);
          }, 600);
        } else {
          door.classList.add('wrong');
          this.app.audio.playIncorrect();
          this.app.audio.speak(doorObj.hint);
        }
      };
    });

    const toolBtns = container.querySelectorAll('.metacog-btn');
    const feedbackBox = container.querySelector('#metacog-feedback');
    const collectBtn = container.querySelector('#collect-clue1-btn');

    toolBtns.forEach(btn => {
      btn.onclick = () => {
        const tId = btn.getAttribute('data-tool');
        const toolObj = s4.metacognition.tools.find(t => t.id === tId);
        feedbackBox.textContent = toolObj.feedback;
        this.app.audio.playCorrect();
        this.app.audio.speak(toolObj.feedback);
        collectBtn.style.display = 'inline-flex';
      };
    });

    collectBtn.onclick = () => {
      modal.classList.remove('show');
      this.app.unlockClue(1, s4.clueUnlocked.title, s4.clueUnlocked.desc);
      this.app.addXP(20);
      this.app.goToStage(5);
    };
  }

  // SCREEN 5: FIND THE EVIDENCE (BOARD & CLUE 2)
  renderScreen5(container) {
    const s5 = this.data.screen5;
    container.innerHTML = `
      <div class="screen5-wrap">
        <div class="evidence-slots-column">
          <div class="screen-header-bar" style="text-align: left; margin-bottom: 8px;">
            <h2 style="font-size: 26px;">🔍 ${s5.header}</h2>
            <p style="font-size: 15px;">${s5.instruction}</p>
          </div>

          ${s5.slots.map(slot => `
            <div class="evidence-slot-card" id="${slot.id}" data-tag="${slot.expectedTag}">
              <div class="evidence-slot-label">${slot.name} (${slot.label})</div>
              <div class="evidence-dropzone" id="dz-${slot.expectedTag}">
                👉 Click or drag matching evidence here...
              </div>
            </div>
          `).join('')}

          <div style="margin-top: 10px;">
            <button class="hud-btn gold" id="s5-clue2-btn" style="display: none; padding: 12px 24px; font-size: 16px;">
              🔍 UNLOCK CLUE 2 ➔
            </button>
          </div>
        </div>

        <div class="evidence-cards-column">
          <div style="font-size: 16px; font-weight: 900; color: #f59e0b; margin-bottom: 6px;">
            📋 TEXTBOOK EVIDENCE CARDS:
          </div>
          ${s5.cards.map(card => `
            <div class="evidence-card" draggable="true" data-tag="${card.tag}" id="${card.id}">
              <span style="font-size: 22px;">${card.icon}</span>
              <span>${card.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const cards = container.querySelectorAll('.evidence-card');
    const slots = container.querySelectorAll('.evidence-slot-card');
    const clue2Btn = container.querySelector('#s5-clue2-btn');
    let filledSlots = 0;

    cards.forEach(card => {
      card.onclick = () => {
        const tag = card.getAttribute('data-tag');
        if (tag === 'fake') {
          this.app.audio.playIncorrect();
          this.app.audio.speak("That's not from our reading about the brain!");
          return;
        }

        const targetSlot = container.querySelector(`.evidence-slot-card[data-tag="${tag}"]`);
        if (targetSlot && !targetSlot.classList.contains('filled')) {
          targetSlot.classList.add('filled');
          const dz = targetSlot.querySelector('.evidence-dropzone');
          dz.innerHTML = `✅ <strong>${card.textContent}</strong>`;
          card.classList.add('placed');
          this.app.audio.playSnap();
          filledSlots++;

          if (filledSlots === 3) {
            this.app.audio.playCorrect();
            this.app.audio.speak("Excellent! You didn't read every word. You skimmed like a detective!");
            clue2Btn.style.display = 'inline-flex';
          }
        }
      };
    });

    clue2Btn.onclick = () => {
      this.app.unlockClue(2, s5.clueUnlocked.title, s5.clueUnlocked.desc);
      this.app.addXP(20);
      this.app.goToStage(6);
    };
  }

  // SCREEN 6: BRAIN JOB APPLICATION (CLUE 3)
  renderScreen6(container) {
    const s6 = this.data.screen6;
    container.innerHTML = `
      <div class="screen6-wrap">
        <div class="job-app-panel">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px dashed #cbd5e1; padding-bottom: 8px;">
            <div style="font-size: 22px; font-weight: 900; color: #dc2626;">📄 ${s6.title}</div>
            <div style="font-size: 14px; font-weight: 800; color: #64748b;">Grade 4 Official Document</div>
          </div>

          <div style="font-size: 16px; font-weight: 800; color: #1e293b;">
            <strong>Name:</strong> 🧠 My Amazing Brain
          </div>

          <div style="font-size: 16px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px;">
            <strong>Job Title:</strong>
            <select class="exit-select" id="job-role-select" style="flex:1;">
              ${s6.jobRoles.map(r => `<option value="${r}">${r}</option>`).join('')}
            </select>
          </div>

          <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin-top: 6px;">
            Skills & Abilities (From Reading):
          </div>

          <div id="job-skills-list" style="display:flex; flex-direction: column; gap: 8px; min-height: 140px;">
            <div class="evidence-dropzone" id="skill-slot-1">1. Click a skill chip on the right...</div>
            <div class="evidence-dropzone" id="skill-slot-2">2. Click a skill chip on the right...</div>
            <div class="evidence-dropzone" id="skill-slot-3">3. Click a skill chip on the right...</div>
            <div class="evidence-dropzone" id="skill-slot-4">4. Click a skill chip on the right...</div>
          </div>

          <button class="hud-btn gold" id="s6-clue3-btn" style="display: none; padding: 12px; font-size: 16px; justify-content: center;">
            SUBMIT APPLICATION & UNLOCK CLUE 3 ➔
          </button>
        </div>

        <div class="job-skills-pool">
          <div style="font-size: 18px; font-weight: 900; color: #f59e0b; margin-bottom: 8px;">
            🎯 AVAILABLE BRAIN SKILLS:
          </div>
          ${s6.skills.map(skill => `
            <div class="skill-chip" data-id="${skill.id}" data-text="${skill.text}">
              <span>${skill.icon}</span>
              <span>${skill.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const chips = container.querySelectorAll('.skill-chip');
    const clue3Btn = container.querySelector('#s6-clue3-btn');
    let placedCount = 0;

    chips.forEach(chip => {
      chip.onclick = () => {
        if (placedCount < 4) {
          placedCount++;
          const slot = container.querySelector(`#skill-slot-${placedCount}`);
          slot.innerHTML = `✅ <strong>${chip.getAttribute('data-text')}</strong>`;
          chip.classList.add('used');
          this.app.audio.playSnap();

          if (placedCount === 4) {
            this.app.audio.playCorrect();
            this.app.audio.speak("Wow! I have so many important jobs! I didn't know I did so much work!");
            clue3Btn.style.display = 'flex';
          }
        }
      };
    });

    clue3Btn.onclick = () => {
      this.app.unlockClue(3, s6.clueUnlocked.title, s6.clueUnlocked.desc);
      this.app.addXP(20);
      this.app.goToStage(7);
    };
  }

  // SCREEN 7: LIFE WITHOUT A BRAIN? (CLUE 4)
  renderScreen7(container) {
    const s7 = this.data.screen7;
    container.innerHTML = `
      <div class="screen7-wrap">
        <div class="screen-header-bar" style="position: relative; z-index: 10;">
          <h2>🤪 ${s7.title}</h2>
          <p>${s7.subtitle}</p>
        </div>

        <div class="scenarios-grid">
          ${s7.situations.map((sit, idx) => `
            <div class="scenario-card" data-idx="${idx}">
              <div class="scenario-top">
                <div class="scenario-emoji">${sit.emoji}</div>
                <div>
                  <div class="scenario-title">${sit.title}</div>
                  <div style="font-size: 14px; font-weight: 700; color: #94a3b8;">${sit.question}</div>
                </div>
              </div>
              <div class="scenario-btns">
                <button class="yes-no-btn yes" data-choice="yes">YES 👍</button>
                <button class="yes-no-btn no" data-choice="no">NO 👎</button>
              </div>
              <div class="scenario-reaction-bubble" id="react-${idx}"></div>
            </div>
          `).join('')}
        </div>

        <div style="position: relative; z-index: 10; display: flex; justify-content: center;">
          <button class="hud-btn gold" id="s7-clue4-btn" style="display: none; padding: 12px 28px; font-size: 16px;">
            🔍 UNLOCK CLUE 4 ➔
          </button>
        </div>
      </div>
    `;

    const cards = container.querySelectorAll('.scenario-card');
    const clue4Btn = container.querySelector('#s7-clue4-btn');
    let answeredCount = 0;
    const answeredCards = new Set();

    cards.forEach(card => {
      const idx = parseInt(card.getAttribute('data-idx'));
      const sit = s7.situations[idx];
      const bubble = card.querySelector(`#react-${idx}`);

      card.querySelectorAll('.yes-no-btn').forEach(btn => {
        btn.onclick = () => {
          const choice = btn.getAttribute('data-choice');
          bubble.style.display = 'block';
          bubble.innerHTML = `🧠 <em>${choice === 'yes' ? sit.brainYesReaction : sit.brainNoReaction}</em>`;
          this.app.audio.playCorrect();
          this.app.audio.speak(choice === 'yes' ? sit.brainYesReaction : sit.brainNoReaction);

          if (!answeredCards.has(idx)) {
            answeredCards.add(idx);
            answeredCount++;
            if (answeredCount === 4) {
              clue4Btn.style.display = 'inline-flex';
            }
          }
        };
      });
    });

    clue4Btn.onclick = () => {
      this.app.unlockClue(4, s7.clueUnlocked.title, s7.clueUnlocked.desc);
      this.app.addXP(20);
      this.app.goToStage(8);
    };
  }

  // SCREEN 8: CONVINCE YOUR BRAIN (CLUE 5 & VOICE)
  renderScreen8(container) {
    const s8 = this.data.screen8;
    container.innerHTML = `
      <div class="screen8-wrap">
        <div class="convince-panel">
          <div class="screen-header-bar" style="text-align: left;">
            <h2>💬 SAVE YOUR BRAIN!</h2>
            <p>🧠 "${s8.dialogue}"</p>
          </div>

          <div class="sentence-builder-card" id="s8-card-1">
            <div class="sentence-prefix">1. The brain is <span id="s8-word-1" style="color:#f59e0b;">________</span>.</div>
            <div class="word-options-row">
              ${s8.sentenceStarters[0].options.map(w => `
                <button class="word-option-chip" data-target="1" data-val="${w}">${w}</button>
              `).join('')}
            </div>
          </div>

          <div class="sentence-builder-card" id="s8-card-2">
            <div class="sentence-prefix">2. It can <span id="s8-word-2" style="color:#38bdf8;">________</span>.</div>
            <div class="word-options-row">
              ${s8.sentenceStarters[1].options.map(w => `
                <button class="word-option-chip" data-target="2" data-val="${w}">${w}</button>
              `).join('')}
            </div>
          </div>

          <div class="sentence-builder-card" id="s8-card-3">
            <div class="sentence-prefix">3. It helps us <span id="s8-word-3" style="color:#ec4899;">________</span>.</div>
            <div class="word-options-row">
              ${s8.sentenceStarters[2].options.map(w => `
                <button class="word-option-chip" data-target="3" data-val="${w}">${w}</button>
              `).join('')}
            </div>
          </div>

          <div class="mic-section">
            <button class="mic-btn" id="mic-record-btn" title="Speak to Brain">
              🎤
            </button>
            <canvas id="waveCanvas" width="300" height="40"></canvas>
            <button class="hud-btn" id="mic-play-btn" style="display: none;">
              ▶️ <span>Listen</span>
            </button>
          </div>

          <button class="hud-btn gold" id="s8-save-brain-btn" style="padding: 14px; font-size: 18px; justify-content: center; display: none;">
            ❤️ SAVE YOUR BRAIN & UNLOCK CLUE 5!
          </button>
        </div>
      </div>
    `;

    const chips = container.querySelectorAll('.word-option-chip');
    const saveBtn = container.querySelector('#s8-save-brain-btn');
    const selectedWords = { 1: null, 2: null, 3: null };

    chips.forEach(chip => {
      chip.onclick = () => {
        const target = chip.getAttribute('data-target');
        const val = chip.getAttribute('data-val');
        selectedWords[target] = val;

        container.querySelector(`#s8-word-${target}`).textContent = val;
        this.app.audio.playSnap();

        // Highlight active chip
        container.querySelectorAll(`.word-option-chip[data-target="${target}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        if (selectedWords[1] && selectedWords[2] && selectedWords[3]) {
          saveBtn.style.display = 'flex';
          this.app.audio.playHeartbeat();
        }
      };
    });

    // Voice Recorder handling
    const micBtn = container.querySelector('#mic-record-btn');
    const playBtn = container.querySelector('#mic-play-btn');
    const waveCanvas = container.querySelector('#waveCanvas');

    micBtn.onclick = async () => {
      if (!this.app.audio.isRecording) {
        micBtn.classList.add('recording');
        micBtn.textContent = '⏹️';
        await this.app.audio.startRecording(waveCanvas, (blobUrl) => {
          micBtn.classList.remove('recording');
          micBtn.textContent = '🎤';
          playBtn.style.display = 'inline-flex';
          this.app.audio.playCorrect();
          this.app.audio.speak("That's a wonderful reason! I feel so happy!");
          saveBtn.style.display = 'flex';
        });
      } else {
        this.app.audio.stopRecording();
      }
    };

    playBtn.onclick = () => {
      this.app.audio.playRecording();
    };

    saveBtn.onclick = () => {
      this.app.unlockClue(5, s8.clueUnlocked.title, s8.clueUnlocked.desc);
      this.app.addXP(20);
      this.app.goToStage(9);
    };
  }

  // SCREEN 9: MISSION COMPLETE!
  renderScreen9(container) {
    const s9 = this.data.screen9;
    container.innerHTML = `
      <div class="screen9-wrap">
        <canvas id="confettiCanvas"></canvas>
        <div class="victory-panel">
          <h1>${s9.title}</h1>
          <h3 style="font-size: 22px; color: #fff; text-align: center;">${s9.subtitle}</h3>

          <div style="background: rgba(245, 158, 11, 0.15); border: 2px solid #f59e0b; border-radius: 16px; padding: 12px 18px; text-align: center;">
            <span style="font-size: 32px;">👑</span><br>
            <strong style="color: #fef08a; font-size: 16px;">🧠 "${s9.brainWords}"</strong>
          </div>

          <div class="checklist-box">
            <div style="font-size: 15px; font-weight: 900; color: #38bdf8;">DETECTIVE SKILLS MASTERED:</div>
            ${s9.checklist.map(item => `
              <div class="checklist-item">
                <span style="color:#10b981; font-size:18px;">✓</span>
                <span>${item}</span>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 8px;">
            <button class="hud-btn gold" id="s9-exit-btn" style="padding: 14px 28px; font-size: 18px;">
              WRITE DETECTIVE EXIT NOTE ➔
            </button>
          </div>
        </div>
      </div>
    `;

    this.app.audio.playCelebration();
    this.startConfetti(container.querySelector('#confettiCanvas'));

    container.querySelector('#s9-exit-btn').onclick = () => {
      this.app.goToStage(10);
    };
  }

  // SCREEN 10: EXIT TICKET
  renderScreen10(container) {
    const s10 = this.data.screen10;
    container.innerHTML = `
      <div class="screen10-wrap">
        <div class="exit-notebook">
          <h2>${s10.title}</h2>
          
          <div class="exit-field">
            <label>${s10.prompt1}</label>
            <select class="exit-select" id="exit-q1">
              ${s10.options1.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>

          <div class="exit-field">
            <label>${s10.prompt2}</label>
            <select class="exit-select" id="exit-q2">
              ${s10.options2.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>

          <div style="background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 12px; padding: 10px 16px; text-align: center;">
            <h4 style="color:#059669; font-weight: 900;">${s10.motto}</h4>
            <p style="font-size: 14px; font-style: italic; color:#334155;">${s10.footerQuote}</p>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="hud-btn primary" id="save-note-btn" style="padding: 12px 24px; font-size: 16px;">
              💾 SAVE NOTE & GET CERTIFICATE
            </button>
          </div>
        </div>

        <!-- Printable Certificate Modal -->
        <div class="cert-modal" id="cert-modal">
          <div class="cert-frame">
            <div style="font-size: 40px; margin-bottom: 8px;">🏅</div>
            <h1>OFFICIAL BRAIN DEFENDER</h1>
            <h3 style="font-size: 18px; color: #64748b; margin-bottom: 14px;">Grade 4 Detective Academy</h3>
            <p style="font-size: 18px; font-weight: 800; line-height: 1.5; color: #1e293b;">
              This certifies that <strong>BRAIN DETECTIVE</strong> has mastered <strong>SKIMMING</strong>,<br>
              unlocked all <strong>5 CLUES</strong>, and successfully <strong>SAVED THE BRAIN</strong>!
            </p>
            <div style="margin: 20px 0; font-size: 16px; font-weight: 800; color: #059669;">
              ✓ 100 XP AWARDED • GRADE 4 UNIT 1
            </div>
            <div style="display: flex; justify-content: center; gap: 14px;">
              <button class="hud-btn primary" onclick="window.print()" style="padding: 10px 20px;">
                🖨️ Print Certificate
              </button>
              <button class="hud-btn" id="close-cert-btn" style="padding: 10px 20px; background: #334155; color: #fff;">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const saveBtn = container.querySelector('#save-note-btn');
    const modal = container.querySelector('#cert-modal');
    const closeBtn = container.querySelector('#close-cert-btn');

    saveBtn.onclick = () => {
      this.app.audio.playCorrect();
      modal.classList.add('show');
    };

    closeBtn.onclick = () => {
      modal.classList.remove('show');
    };
  }

  // Particle Confetti Generator
  startConfetti(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 675;

    const particles = [];
    const colors = ['#f59e0b', '#ec4899', '#06b6d4', '#10b981', '#a855f7', '#ffffff'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 3,
        d: Math.random() * 120,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0
      });
    }

    let animationFrame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + (p.r / 2), p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 2));
        ctx.stroke();

        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - (i / 3)) * 15;

        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
        }
      }
      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 9000);
  }
}

if (typeof window !== 'undefined') {
  window.BrainScenesRenderer = BrainScenesRenderer;
}
