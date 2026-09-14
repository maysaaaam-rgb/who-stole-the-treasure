/**
 * CLARA'S INVENTOR MYSTERY & THE INVENTOR CHALLENGE
 * Dynamic Scene Renderers for All 13 Stages & Phonics Extension
 */

(function(root) {
  'use strict';

  class ClaraSceneRenderer {
    constructor() {
      // Local stage state caches
      this.activeMissionIdx = 0;
      this.activeTfIdx = 0;
      this.tabletState = { powered: false, code: '', playPressed: false, score: 0 };
      this.bunnyY = 0;
      this.storySlotAssignments = {};
      this.phonicsScore = 0;
    }

    // =========================================================================
    // LESSON 1 — STAGE 1: WACKY MYSTERY WARM-UP (0–5 min)
    // =========================================================================
    renderWarmup(container, state) {
      const data = root.CLARA_DATA.lesson1.warmup;
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 1 (0–5 min)</span>
              <h2 class="stage-main-title">🔍 Wacky Mystery Warm-up</h2>
              <p class="stage-instruction">${data.instruction}</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.playIntroBadge()">
                🏅 <span>Get Inventor Badge</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">🗣️ Speaking Frame: <span class="highlight">"What is it? It is a... It [does what]!"</span></div>
            <button class="hud-btn" onclick="window.claraAudio.speak('What is it? What does it do? It is an invention!')">🔊 Listen</button>
          </div>

          <div class="badge-hero-banner" id="badge-banner" style="display:none;">
            <div class="badge-graphic">🏅</div>
            <div class="badge-info">
              <h3 class="badge-title">OFFICIAL JUNIOR INVENTOR BADGE</h3>
              <p class="badge-desc">You are now a registered Junior Inventor! Today you will explore Clara's workshop, crack 6 reading mysteries, and invent something amazing!</p>
            </div>
          </div>

          <div class="mystery-grid">
      `;

      data.combos.forEach((c, idx) => {
        html += `
          <div class="mystery-card" id="card-${c.id}" onclick="window.claraApp.revealWarmupCombo('${c.id}')">
            <div class="mystery-equation">
              <span>${c.iconA}</span>
              <span style="color:var(--lab-cyan); font-size:1.6rem;">+</span>
              <span>${c.iconB}</span>
            </div>
            <h3 class="mystery-title">${c.nameA} + ${c.nameB}</h3>
            <p class="mystery-desc">Tap to reveal what Clara invented!</p>
            <div class="mystery-answer" id="ans-${c.id}" style="display:none;">
              <strong>💡 ${c.invention}</strong>
              <div style="font-size:0.85rem; margin-top:4px; color:#94a3b8;">${c.clue}</div>
            </div>
          </div>
        `;
      });

      html += `
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:16px;">
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson1', 2)">
              <span>Next: What Does It Do?</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 2: WHAT DOES IT DO? (5–10 min)
    // =========================================================================
    renderWhatDoesItDo(container, state) {
      const inventions = root.CLARA_DATA.lesson1.inventions;
      const targetInv = inventions[state.whatDoesItDoIndex || 0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 2 (5–10 min)</span>
              <h2 class="stage-main-title">🎴 What Does It Do?</h2>
              <p class="stage-instruction">Listen to the teacher's clue! Tap the correct invention from Clara's workshop.</p>
            </div>
            <div class="hud-group">
              <button class="hud-btn" onclick="window.claraApp.toggleInvMode()">
                🔄 <span>Mode: ${state.invMode === 'reverse' ? 'Show Invention -> Choose Clue' : 'Listen Clue -> Choose Invention'}</span>
              </button>
            </div>
          </div>

          <div class="clue-box">
            <div>
              <div style="font-size:0.82rem; font-weight:800; color:var(--lab-cyan); text-transform:uppercase;">Detective Clue #${(state.whatDoesItDoIndex || 0) + 1} of ${inventions.length}</div>
              <div class="clue-text-big">"${targetInv.clue}"</div>
            </div>
            <button class="action-btn gold" onclick="window.claraAudio.speak('${targetInv.clue}')">
              🔊 <span>Hear Clue</span>
            </button>
          </div>

          <div class="inventions-deck">
      `;

      inventions.forEach(inv => {
        html += `
          <div class="invention-card" id="inv-${inv.id}" onclick="window.claraApp.checkInventionChoice('${inv.id}', '${targetInv.id}')">
            <div class="inv-icon-box">${inv.icon}</div>
            <h4 class="inv-name">${inv.title}</h4>
            <div class="inv-textbook-quote">${inv.bookQuote}</div>
            <div style="font-size:0.75rem; color:var(--lab-gold); font-weight:800; margin-top:4px;">${inv.bookPage}</div>
          </div>
        `;
      });

      html += `
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson1', 1)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson1', 3)">
              <span>Next: Reading Detectives</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 3: READING DETECTIVES (10–17 min)
    // =========================================================================
    renderReadingDetectives(container, state) {
      const missions = root.CLARA_DATA.lesson1.readingMissions;
      const curMission = missions[this.activeMissionIdx];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 3 (10–17 min)</span>
              <h2 class="stage-main-title">🕵️ Reading Detective Missions</h2>
              <p class="stage-instruction">Read or listen to the story excerpt. Find the exact answer to crack the case!</p>
            </div>
            <div class="mission-breadcrumbs">
      `;

      missions.forEach((m, i) => {
        const cls = i === this.activeMissionIdx ? 'active' : (state.completedMissions && state.completedMissions.includes(i) ? 'done' : '');
        html += `<div class="mission-dot ${cls}" onclick="window.claraApp.selectMission(${i})">${i + 1}</div>`;
      });

      html += `
            </div>
          </div>

          <div class="mission-layout">
            <!-- Left: Textbook Reading Chunk -->
            <div class="story-chunk-box">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="story-chunk-page-tag">📖 Textbook ${curMission.page}</span>
                <button class="hud-btn" onclick="window.claraAudio.speak('${curMission.textChunk.replace(/'/g, "\\'")}')">🔊 Read Aloud</button>
              </div>
              <div class="story-sentence" id="story-sentence-display">
                "${curMission.textChunk}"
              </div>
              <div style="margin-top:auto; padding-top:12px; border-top:1px solid var(--lab-border);">
                <span style="font-size:0.85rem; color:var(--lab-text-muted);">💡 Detective Tip: Look for keywords like <em>'${curMission.questionCode}'</em></span>
              </div>
            </div>

            <!-- Right: Detective Mission Question -->
            <div class="mission-questions-box">
              <div style="font-size:0.85rem; font-weight:800; color:var(--lab-gold); text-transform:uppercase;">
                Mission #${curMission.id}: ${curMission.questionCode}
              </div>
              <h3 class="mission-q-title">${curMission.question}</h3>

              <div class="option-list">
      `;

      curMission.options.forEach((opt, optIdx) => {
        html += `
          <button class="option-choice-btn" id="opt-btn-${optIdx}" onclick="window.claraApp.answerMission(${optIdx})">
            <span>${opt.text}</span>
            <span style="font-size:1.2rem;">👉</span>
          </button>
        `;
      });

      html += `
              </div>

              <div id="mission-feedback-box" style="display:none; margin-top:10px;">
                <div class="speaking-banner" style="border-color:var(--lab-green);">
                  <div class="speak-text">✓ Text Evidence: <span class="highlight">"${curMission.sentenceHighlight}"</span></div>
                  <button class="action-btn green" onclick="window.claraApp.nextMission()">Next Mission ➡️</button>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson1', 2)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson1', 4)">
              <span>Next: 4-Corners True/False</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 4: FOUR CORNERS TRUE/FALSE (17–24 min)
    // =========================================================================
    renderFourCorners(container, state) {
      const questions = root.CLARA_DATA.lesson1.fourCorners;
      const curQ = questions[this.activeTfIdx];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 4 (17–24 min)</span>
              <h2 class="stage-main-title">🏃 Four Corners True / False</h2>
              <p class="stage-instruction">Physical Classroom Game! Stand up, listen to the statement, and run to the TRUE or FALSE corner!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">Statement ${this.activeTfIdx + 1} / ${questions.length}</span>
            </div>
          </div>

          <div class="kinesthetic-banner">
            <span>🏃 MOVE YOUR BODY!</span>
            <span>Corner A = TRUE 🟢</span>
            <span>Corner B = FALSE 🔴</span>
            <span>Then be ready to answer: <strong>"WHY?"</strong></span>
          </div>

          <div class="four-corners-box">
            <div class="statement-display" id="tf-statement-text">
              "${curQ.statement}"
            </div>

            <div class="tf-choice-row">
              <button class="tf-giant-btn true-btn" onclick="window.claraApp.handleTfChoice(true)">
                <span>🟢 TRUE</span>
                <span style="font-size:0.95rem; font-weight:700;">"Yes, that is right!"</span>
              </button>
              <button class="tf-giant-btn false-btn" onclick="window.claraApp.handleTfChoice(false)">
                <span>🔴 FALSE</span>
                <span style="font-size:0.95rem; font-weight:700;">"No, that is not right!"</span>
              </button>
            </div>

            <div id="tf-feedback" style="display:none; margin-top:16px;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson1', 3)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson1', 5)">
              <span>Next: Build Clara's Story</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 5: BUILD CLARA'S STORY (24–31 min)
    // =========================================================================
    renderBuildStory(container, state) {
      const cards = root.CLARA_DATA.lesson1.storyCards;
      const sequenceWords = ["First", "Next", "Then", "After that", "Then", "Finally"];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 5 (24–31 min)</span>
              <h2 class="stage-main-title">📜 Build Clara's Story</h2>
              <p class="stage-instruction">Reconstruct the 6 story events in chronological order from First to Finally!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.checkStorySequence()">
                ✓ <span>Check Sequence</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">🗣️ Retell Flow: <span class="highlight">First... Next... Then... After that... Finally...</span></div>
            <button class="hud-btn" onclick="window.claraAudio.speak('First, Clara invents things after school. Finally, she makes a clean-up machine!')">🔊 Listen</button>
          </div>

          <!-- Chronological Target Slots -->
          <div class="story-timeline-slots">
      `;

      sequenceWords.forEach((word, idx) => {
        const assignedCard = this.storySlotAssignments[idx];
        html += `
          <div class="timeline-slot" id="slot-${idx}" ondragover="window.claraApp.onDragOverSlot(event)" ondrop="window.claraApp.onDropSlot(event, ${idx})" onclick="window.claraApp.clickSlotToAssign(${idx})">
            <div class="slot-label">
              <span>Step ${idx + 1}:</span>
              <strong>${word.toUpperCase()}</strong>
            </div>
            <div class="slot-content-holder" id="slot-holder-${idx}">
              ${assignedCard ? `
                <div class="story-draggable-card in-slot" draggable="true" ondragstart="window.claraApp.onDragCard(event, ${assignedCard.order})">
                  <span>${assignedCard.icon}</span>
                  <span>${assignedCard.text}</span>
                </div>
              ` : `<span style="color:#64748b; font-size:0.85rem; font-style:italic;">Drop or tap event card here</span>`}
            </div>
          </div>
        `;
      });

      html += `
          </div>

          <!-- Pool of Draggable Story Cards -->
          <div style="background:var(--lab-surface); border:1.5px solid var(--lab-border); border-radius:16px; padding:16px; margin-top:10px;">
            <div style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan); margin-bottom:10px;">AVAILABLE STORY CARDS (Drag or tap to place):</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px;" id="story-pool-container">
      `;

      cards.forEach(c => {
        // Only show in pool if not assigned to a slot
        const isAssigned = Object.values(this.storySlotAssignments).some(assigned => assigned && assigned.order === c.order);
        if (!isAssigned) {
          html += `
            <div class="story-draggable-card" id="card-pool-${c.order}" draggable="true" ondragstart="window.claraApp.onDragCard(event, ${c.order})" onclick="window.claraApp.autoAssignCard(${c.order})">
              <span>${c.icon}</span>
              <span>${c.text}</span>
            </div>
          `;
        }
      });

      html += `
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson1', 4)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson1', 6)">
              <span>Next: My Invention Studio</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 6: MY INVENTION STUDIO & BADGES (31–35 min)
    // =========================================================================
    renderMyInvention(container, state) {
      const options = root.CLARA_DATA.lesson1.builderOptions;
      state.chosenBase = state.chosenBase || options.bases[0];
      state.chosenAdj = state.chosenAdj || options.adjectives[0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 6 (31–35 min)</span>
              <h2 class="stage-main-title">🎨 My Invention Studio</h2>
              <p class="stage-instruction">Junior Inventors design their own wacky creation! Pick features, generate your official blueprint, and practice your pitch!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.awardJuniorCertificate()">
                🏆 <span>Graduate Lesson 1</span>
              </button>
            </div>
          </div>

          <div class="studio-grid">
            <!-- Left: Picker Panel -->
            <div class="studio-picker-box">
              <div>
                <div style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan); margin-bottom:8px;">1. CHOOSE AN ADJECTIVE:</div>
                <div class="mashup-chips-row">
      `;

      options.adjectives.forEach(adj => {
        const sel = adj === state.chosenAdj ? 'selected' : '';
        html += `<button class="mashup-chip ${sel}" onclick="window.claraApp.pickAdj('${adj}')">${adj.toUpperCase()}</button>`;
      });

      html += `
                </div>
              </div>

              <div>
                <div style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan); margin-bottom:8px;">2. CHOOSE AN INVENTION BASE:</div>
                <div class="mashup-chips-row">
      `;

      options.bases.forEach(b => {
        const sel = b.name === state.chosenBase.name ? 'selected' : '';
        html += `<button class="mashup-chip ${sel}" onclick="window.claraApp.pickBase('${b.name}')">${b.icon} ${b.name.toUpperCase()}</button>`;
      });

      html += `
                </div>
              </div>

              <div style="margin-top:auto; padding-top:14px; border-top:1px solid var(--lab-border);">
                <div style="font-size:0.9rem; color:var(--lab-text-muted);">
                  💡 Classroom Drawing Notebook: Draw your invention on Page 4 of your companion worksheet!
                </div>
              </div>
            </div>

            <!-- Right: Live Blueprint Screen -->
            <div class="blueprint-preview-box">
              <div class="blueprint-header">
                <span class="blueprint-stamp">CONFIDENTIAL BLUEPRINT #001</span>
                <span style="font-size:0.85rem; color:var(--lab-cyan); font-weight:800;">CLARA'S WORKSHOP</span>
              </div>

              <div class="blueprint-screen">
                <div style="font-size:3.5rem;">${state.chosenBase.icon}</div>
                <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--lab-gold);">
                  THE ${state.chosenAdj.toUpperCase()} ${state.chosenBase.name.toUpperCase()}
                </h3>
                <p style="color:#cbd5e1; font-size:0.95rem;">Function: It ${state.chosenBase.action}!</p>
              </div>

              <div class="blueprint-speech-output">
                🗣️ <strong>Classroom Pitch Script:</strong><br>
                "My invention is a <strong>${state.chosenAdj} ${state.chosenBase.name}</strong>! It <strong>${state.chosenBase.action}</strong>!"
              </div>

              <button class="action-btn gold" onclick="window.claraAudio.speak('My invention is a ${state.chosenAdj} ${state.chosenBase.name}! It ${state.chosenBase.action}!')">
                🔊 Practice Pitch (TTS)
              </button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson1', 5)">⬅️ Previous</button>
            <button class="action-btn green" onclick="window.claraApp.switchLesson('lesson2')">
              <span>Go to Lesson 2: The Challenge</span> 🚀
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 1: BROKEN INVENTION REVIEW (0–5 min)
    // =========================================================================
    renderBrokenReview(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 1 (0–5 min)</span>
              <h2 class="stage-main-title">💥 The Broken Invention Review</h2>
              <p class="stage-instruction">Review your inventions from Lesson 1... but wait! SOMETHING IS WRONG!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn red" onclick="window.claraApp.triggerBrokenAlert()">
                ⚠️ <span>Simulate Machine Failure</span>
              </button>
            </div>
          </div>

          <div class="four-corners-box" style="border-color:var(--lab-red);">
            <div style="font-size:4rem; animation:shakeCard 0.8s infinite alternate;" id="broken-robot-icon">
              🤖💥💨
            </div>
            <h3 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--lab-red);">
              "OH NO! THE INVENTION DOESN'T WORK!"
            </h3>
            <p style="font-size:1.2rem; color:#e2e8f0; max-width:600px; margin:0 auto;">
              Gears are grinding, smoke is coming out, and the machine stopped! Why did it fail? Because we didn't follow the <strong>ORDER</strong>!
            </p>

            <div class="speaking-banner" style="background:rgba(239, 68, 68, 0.15); border-color:var(--lab-red);">
              <div class="speak-text">
                🗣️ Teacher Asks: <span class="highlight">"Can you test a machine before you make it?" — "NO!"</span>
              </div>
              <button class="hud-btn" onclick="window.claraAudio.speak('Oh no! The machine does not work! We need a plan! We need sequence!')">🔊 Speak</button>
            </div>

            <div style="display:flex; justify-content:center; gap:16px; margin-top:12px;">
              <div class="stage-tracker-pill">1. FIRST</div>
              <div class="stage-tracker-pill">2. SECOND</div>
              <div class="stage-tracker-pill">3. THIRD</div>
              <div class="stage-tracker-pill">4. LAST</div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:16px;">
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 2)">
              <span>Next: Human Tablet Simulator</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 2: THE HUMAN TABLET SIMULATOR (5–10 min)
    // =========================================================================
    renderHumanTablet(container, state) {
      const tb = this.tabletState;
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 2 (5–10 min) • Textbook Page 17</span>
              <h2 class="stage-main-title">📱 The Human Tablet Simulator</h2>
              <p class="stage-instruction">Physical Activity: 4 students hold instruction cards! Arrange them in order, then operate the digital tablet!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">First • Second • Third • Last</span>
            </div>
          </div>

          <div class="kinesthetic-banner">
            <span>👥 HUMAN TABLET: 4 Students stand at the front holding:</span>
            <strong>[Press on] • [Type password] • [Press play] • [Play the game]</strong>
          </div>

          <div class="tablet-container">
            <div class="tablet-frame">
              <button class="tablet-power-btn ${tb.powered ? 'powered' : ''}" onclick="window.claraApp.toggleTabletPower()">
                ${tb.powered ? 'POWER: ON 🟢' : 'POWER: OFF ⚪'}
              </button>

              <div class="tablet-screen ${tb.powered ? '' : 'screen-off'}">
      `;

      if (!tb.powered) {
        html += `
          <div style="font-size:2.8rem; opacity:0.4;">📱</div>
          <div style="font-size:1.1rem; margin-top:8px;">TABLET IS OFF</div>
          <div style="font-size:0.85rem; color:#64748b;">Step 1: Press ON button at the top!</div>
        `;
      } else if (tb.code !== '1234') {
        html += `
          <div style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan); text-transform:uppercase;">Step 2: Enter Password (1-2-3-4)</div>
          <div class="password-display">${tb.code.padEnd(4, '•')}</div>
          <div class="tablet-keypad">
            <button class="keypad-btn" onclick="window.claraApp.pressTabletKey('1')">1</button>
            <button class="keypad-btn" onclick="window.claraApp.pressTabletKey('2')">2</button>
            <button class="keypad-btn" onclick="window.claraApp.pressTabletKey('3')">3</button>
            <button class="keypad-btn" onclick="window.claraApp.pressTabletKey('4')">4</button>
            <button class="keypad-btn" onclick="window.claraApp.clearTabletKey()">⌫</button>
            <button class="keypad-btn" onclick="window.claraApp.pressTabletKey('0')">0</button>
          </div>
        `;
      } else if (!tb.playPressed) {
        html += `
          <div style="font-size:3rem;">🐰🥕</div>
          <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:#ffffff; margin:8px 0;">BUNNY ADVENTURE</h3>
          <div style="font-size:0.85rem; color:var(--lab-gold); margin-bottom:12px;">Step 3: Press PLAY to start!</div>
          <button class="action-btn green" onclick="window.claraApp.pressTabletPlay()">
            ▶️ <span>PRESS PLAY</span>
          </button>
        `;
      } else {
        html += `
          <div class="bunny-game-screen">
            <div style="display:flex; justify-content:space-between; width:100%; font-weight:800;">
              <span>Step 4: Play the Game!</span>
              <span style="color:var(--lab-gold);">🥕 Carrots: ${tb.score}</span>
            </div>
            <div class="bunny-canvas-area" onclick="window.claraApp.hopBunny()">
              <div class="carrot-sprite">🥕</div>
              <div class="bunny-sprite" id="bunny-actor" style="transform:translateY(${this.bunnyY}px);">🐰</div>
            </div>
            <button class="action-btn gold" onclick="window.claraApp.hopBunny()">
              🐰 <span>TAP TO JUMP & COLLECT CARROT!</span>
            </button>
          </div>
        `;
      }

      html += `
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson2', 1)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 3)">
              <span>Next: Sequence Builder</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 3: SEQUENCE BUILDER & SPOT THE BUG (10–15 min)
    // =========================================================================
    renderSequenceBuilder(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 3 (10–15 min)</span>
              <h2 class="stage-main-title">🧩 Sequence Builder & Bug Spotter</h2>
              <p class="stage-instruction">Match the 4 actions underneath First, Second, Third, and Last. Then spot deliberate errors!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn red" onclick="window.claraApp.generateSequenceBug()">
                🐛 <span>Spot the Bug!</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">🗣️ Sequence Words: <span class="highlight">First... Second... Third... Last!</span></div>
            <button class="hud-btn" onclick="window.claraAudio.speak('First, press on. Second, type password. Third, press play. Last, play the game!')">🔊 Listen</button>
          </div>

          <div class="process-grid" id="sequence-match-grid">
            <div class="process-card" id="seq-col-1">
              <span class="process-order-tag">1. FIRST</span>
              <div class="process-icon-box">🔘</div>
              <h4 class="process-action-title">Press on.</h4>
              <p class="process-action-desc">You must turn on the device before doing anything else.</p>
            </div>
            <div class="process-card gold-tag" id="seq-col-2">
              <span class="process-order-tag">2. SECOND</span>
              <div class="process-icon-box">🔢</div>
              <h4 class="process-action-title">Type password.</h4>
              <p class="process-action-desc">Unlock the screen by entering your security code.</p>
            </div>
            <div class="process-card purple-tag" id="seq-col-3">
              <span class="process-order-tag">3. THIRD</span>
              <div class="process-icon-box">▶️</div>
              <h4 class="process-action-title">Press play.</h4>
              <p class="process-action-desc">Open the app and launch the game menu.</p>
            </div>
            <div class="process-card green-tag" id="seq-col-4">
              <span class="process-order-tag">4. LAST</span>
              <div class="process-icon-box">🎮</div>
              <h4 class="process-action-title">Play the game.</h4>
              <p class="process-action-desc">Have fun and complete the game challenges!</p>
            </div>
          </div>

          <div id="bug-feedback-box" style="display:none; margin-top:16px;"></div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson2', 2)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 4)">
              <span>Next: 4-Stage Inventor Process</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 4: THE 4-STAGE INVENTOR PROCESS (15–21 min)
    // =========================================================================
    renderInventorProcess(container, state) {
      const stages = root.CLARA_DATA.lesson2.inventorStages;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 4 (15–21 min) • Textbook Page 17</span>
              <h2 class="stage-main-title">💡 The 4-Stage Inventor Process</h2>
              <p class="stage-instruction">How do inventors create something new? Learn the 4 official steps from the textbook!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraAudio.speak('First, an inventor has a good idea. Second, an inventor writes down the plan. Third, an inventor makes the invention. Last, an inventor tests the invention.')">
                🔊 <span>Listen to All 4 Steps</span>
              </button>
            </div>
          </div>

          <div class="process-grid">
      `;

      stages.forEach(s => {
        html += `
          <div class="process-card ${s.tagClass}">
            <span class="process-order-tag">${s.sequenceWord}</span>
            <div class="process-icon-box">${s.icon}</div>
            <h3 class="process-action-title">${s.title}</h3>
            <p class="process-action-desc">"${s.textbookText}"</p>
            <div style="margin-top:auto; padding-top:10px; border-top:1px solid var(--lab-border); width:100%;">
              <button class="hud-btn" style="width:100%; justify-content:center;" onclick="window.claraAudio.speak('${s.sequenceWord}, ${s.textbookText}')">
                🔊 Listen
              </button>
            </div>
          </div>
        `;
      });

      html += `
          </div>

          <!-- Classroom Discussion Card -->
          <div class="clue-box" style="border-color:var(--lab-gold); background:rgba(251, 191, 36, 0.1);">
            <div>
              <div style="font-size:0.85rem; font-weight:800; color:var(--lab-gold); text-transform:uppercase;">Textbook Discussion Question (Page 17)</div>
              <div class="clue-text-big">"Why do you think inventors have notebooks?"</div>
              <div style="color:#e2e8f0; font-size:1.1rem; margin-top:6px;">
                Expected Answer: <strong>"It's because they want to remember things!"</strong>
              </div>
            </div>
            <button class="action-btn gold" onclick="window.claraAudio.speak('Why do you think inventors have notebooks? Because they want to remember things!')">
              🔊 Discuss
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson2', 3)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 5)">
              <span>Next: Sequence Relay Race</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 5: SEQUENCE RELAY (21–27 min)
    // =========================================================================
    renderSequenceRelay(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 5 (21–27 min)</span>
              <h2 class="stage-main-title">⏱️ Sequence Relay Race</h2>
              <p class="stage-instruction">Team Alpha vs Team Beta! Teacher calls out a sequence word. First team to select the correct stage card wins points!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.startRelayRound()">
                🏁 <span>Next Callout</span>
              </button>
            </div>
          </div>

          <div class="relay-timer-bar">
            <div>
              <span style="font-size:0.85rem; font-weight:800; color:var(--lab-gold); text-transform:uppercase;">CURRENT TEACHER CALLOUT</span>
              <div style="font-size:2.4rem; font-weight:900; color:#ffffff;" id="relay-callout-text">
                "FIRST!"
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.85rem; color:#94a3b8;">Round Timer</span>
              <div class="relay-timer-num" id="relay-timer">30s</div>
            </div>
          </div>

          <div class="process-grid">
            <div class="process-card cyan-tag" onclick="window.claraApp.checkRelayAnswer('IDEA')">
              <span class="process-order-tag">IDEA</span>
              <div class="process-icon-box">💡</div>
              <h4 class="process-action-title">Have a good idea</h4>
            </div>
            <div class="process-card gold-tag" onclick="window.claraApp.checkRelayAnswer('PLAN')">
              <span class="process-order-tag">PLAN</span>
              <div class="process-icon-box">📝</div>
              <h4 class="process-action-title">Write down the plan</h4>
            </div>
            <div class="process-card purple-tag" onclick="window.claraApp.checkRelayAnswer('MAKE')">
              <span class="process-order-tag">MAKE</span>
              <div class="process-icon-box">🔨</div>
              <h4 class="process-action-title">Make the invention</h4>
            </div>
            <div class="process-card green-tag" onclick="window.claraApp.checkRelayAnswer('TEST')">
              <span class="process-order-tag">TEST</span>
              <div class="process-icon-box">🧪</div>
              <h4 class="process-action-title">Test the invention</h4>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson2', 4)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 6)">
              <span>Next: Inventor Lab Blueprint</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 6: INVENTOR LAB CHALLENGE (27–33 min)
    // =========================================================================
    renderLabChallenge(container, state) {
      const challenges = root.CLARA_DATA.lesson2.challenges;
      const activeChal = challenges[state.activeChalIdx || 0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 6 (27–33 min)</span>
              <h2 class="stage-main-title">🛠️ Inventor Lab Challenge</h2>
              <p class="stage-instruction">Pick a real-world dilemma for your student group and assemble your 4-step sequence blueprint!</p>
            </div>
            <div class="hud-group">
              <select class="hud-btn" onchange="window.claraApp.selectLabChallenge(this.value)" style="background:var(--lab-surface); color:#ffffff; font-weight:800;">
      `;

      challenges.forEach((c, idx) => {
        const sel = idx === (state.activeChalIdx || 0) ? 'selected' : '';
        html += `<option value="${idx}" ${sel}>${c.icon} ${c.title}</option>`;
      });

      html += `
              </select>
            </div>
          </div>

          <div class="studio-grid">
            <!-- Left: Dilemma Details -->
            <div class="studio-picker-box">
              <div style="font-size:3rem;">${activeChal.icon}</div>
              <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--lab-gold);">${activeChal.title}</h3>
              <p style="font-size:1.05rem; color:#e2e8f0; line-height:1.5;">${activeChal.problem}</p>

              <div style="margin-top:12px;">
                <span style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan);">PROPOSED MACHINE NAME:</span>
                <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:900; color:#ffffff; margin-top:4px;">
                  ✨ ${activeChal.machineName}
                </div>
              </div>
            </div>

            <!-- Right: 4-Step Sequence Process Blueprint -->
            <div class="blueprint-preview-box">
              <div class="blueprint-header">
                <span class="blueprint-stamp">4-STAGE SEQUENCE BLUEPRINT</span>
                <span style="font-size:0.85rem; color:var(--lab-cyan); font-weight:800;">GROUP TASK</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:10px;">
                <div style="background:rgba(15,23,42,0.8); padding:10px 14px; border-radius:10px; border-left:3px solid var(--lab-cyan);">
                  <strong style="color:var(--lab-cyan);">FIRST:</strong> ${activeChal.first}
                </div>
                <div style="background:rgba(15,23,42,0.8); padding:10px 14px; border-radius:10px; border-left:3px solid var(--lab-gold);">
                  <strong style="color:var(--lab-gold);">SECOND:</strong> ${activeChal.second}
                </div>
                <div style="background:rgba(15,23,42,0.8); padding:10px 14px; border-radius:10px; border-left:3px solid var(--lab-purple);">
                  <strong style="color:var(--lab-purple);">THIRD:</strong> ${activeChal.third}
                </div>
                <div style="background:rgba(15,23,42,0.8); padding:10px 14px; border-radius:10px; border-left:3px solid var(--lab-green);">
                  <strong style="color:var(--lab-green);">LAST:</strong> ${activeChal.last}
                </div>
              </div>

              <button class="action-btn gold" onclick="window.claraAudio.speak('Our invention is ${activeChal.machineName}! First, we ${activeChal.first}. Second, we ${activeChal.second}. Third, we ${activeChal.third}. Last, we ${activeChal.last}.')">
                🔊 Rehearse Group Pitch (TTS)
              </button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson2', 5)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 7)">
              <span>Next: Pitch & Graduation</span> 🏆
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 7: PITCH & GRADUATION CEREMONY (33–35 min)
    // =========================================================================
    renderPitchCeremony(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 7 (33–35 min)</span>
              <h2 class="stage-main-title">🏆 Final Inventor Presentation & Ceremony</h2>
              <p class="stage-instruction">Classroom Presentations! Groups present their blueprints while the audience awards stars!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.launchCeremonyFanfare()">
                🎉 <span>Award Master Certificate</span>
              </button>
            </div>
          </div>

          <div class="four-corners-box" style="border-color:var(--lab-gold);">
            <div style="font-size:3.5rem;">🌟 🏅 🚀</div>
            <h3 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--lab-gold);">
              MASTER INVENTOR PRESENTATION STAGE
            </h3>
            <p style="font-size:1.15rem; color:#cbd5e1; max-width:600px; margin:0 auto;">
              Audience Reaction Stars: Tap to vote for the best presentation qualities!
            </p>

            <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap; margin-top:12px;">
              <button class="action-btn gold" onclick="window.claraApp.awardPresentationStar('idea')">
                ⭐ <span>GREAT IDEA!</span> (<span id="star-count-idea">0</span>)
              </button>
              <button class="action-btn primary" onclick="window.claraApp.awardPresentationStar('useful')">
                ⭐ <span>SUPER USEFUL!</span> (<span id="star-count-useful">0</span>)
              </button>
              <button class="action-btn green" onclick="window.claraApp.awardPresentationStar('funny')">
                ⭐ <span>VERY FUNNY!</span> (<span id="star-count-funny">0</span>)
              </button>
            </div>

            <!-- Discussion Wrap-up -->
            <div class="speaking-banner" style="margin-top:20px; text-align:left;">
              <div class="speak-text">
                💡 Final Reflection: <span class="highlight">"Do you think it is easy or difficult to be an inventor? Why?"</span>
              </div>
              <button class="hud-btn" onclick="window.claraAudio.speak('I think it is difficult because you have to work hard and try again!')">🔊 Model Answer</button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson2', 6)">⬅️ Previous</button>
            <button class="action-btn gold" onclick="window.claraApp.switchLesson('phonics')">
              <span>Try Phonics Extension (CL/cl-)</span> 🔤
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // PHONICS EXTENSION: CL / cl- BLENDS (Page 16)
    // =========================================================================
    renderPhonicsStation(container, state) {
      const p = root.CLARA_DATA.phonics;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Phonics Extension • Textbook Page 16</span>
              <h2 class="stage-main-title">🔤 Phonics Station: Initial CL / cl- Blends</h2>
              <p class="stage-instruction">Listen to the /kl/ sound. Practice the 5 core words and search Clara's story for more!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">Sound: /kl/</span>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">🔊 Listen and Repeat: <span class="highlight">climb, clue, cloud, close, clap</span></div>
            <button class="hud-btn" onclick="window.claraAudio.speak('climb, clue, cloud, close, clap')">🔊 Listen All</button>
          </div>

          <div class="phonics-deck">
      `;

      p.coreWords.forEach(w => {
        html += `
          <div class="phonics-card" onclick="window.claraAudio.speak('${w.word}. ${w.sentence}')">
            <div style="font-size:2.5rem;">${w.icon}</div>
            <div class="phonics-word"><span class="cl-blend">cl</span>${w.word.substring(2)}</div>
            <div style="font-size:0.85rem; color:#94a3b8; line-height:1.3;">${w.sentence}</div>
            <button class="hud-btn" style="margin-top:6px; font-size:0.75rem;">🔊 Say</button>
          </div>
        `;
      });

      html += `
          </div>

          <!-- Story Scavenger Hunt -->
          <div class="studio-picker-box" style="margin-top:16px;">
            <h3 style="font-family:var(--font-heading); font-size:1.25rem; color:var(--lab-gold);">
              🕵️ Story Scavenger Hunt: Find CL- words in Clara Doodle's story!
            </h3>
            <div class="mashup-chips-row" style="margin-top:8px;">
      `;

      p.bookScavengerWords.forEach(sw => {
        html += `
          <div class="mashup-chip selected" onclick="window.claraAudio.speak('${sw.word}. Found on ${sw.page}')">
            <strong style="color:var(--lab-gold);">${sw.word}</strong> (${sw.page})
          </div>
        `;
      });

      html += `
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.switchLesson('lesson1')">⬅️ Back to Lesson 1</button>
            <button class="action-btn primary" onclick="window.claraApp.switchLesson('lesson2')">
              <span>Back to Lesson 2</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }
  }

  root.claraScenes = new ClaraSceneRenderer();
})(window);
