/**
 * CLARA'S INVENTION MYSTERY & THE INVENTOR CHALLENGE
 * Dynamic Scene Renderers for All 13 Stages & Phonics Extension
 * Based on Reading Book 3 / Global Readings 2 (pp. 16–17)
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
      this.drawingCtx = null;
      this.isDrawing = false;
    }

    // =========================================================================
    // LESSON 1 — STAGE 1: INVENTOR MYSTERY WARM-UP (0–5 min)
    // =========================================================================
    renderWarmup(container, state) {
      const data = root.CLARA_DATA.lesson1.warmup;
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 1 (0–5 min) • Reading Book 3 p. 16</span>
              <h2 class="stage-main-title">🔍 Inventor Mystery Warm-up</h2>
              <p class="stage-instruction">${data.instruction}</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.playIntroBadge()">
                🏅 <span>Get Junior Inventor Badge</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">🗣️ Teacher Language: <span class="highlight">"Look! What is this? What does it do? Today, YOU are inventors!"</span></div>
            <button class="hud-btn" onclick="window.claraAudio.speak('Look! What is this? What does it do? Today, you are inventors!')">🔊 Listen</button>
          </div>

          <div class="badge-hero-banner" id="badge-banner" style="display:none;">
            <div class="badge-graphic">⭐</div>
            <div class="badge-info">
              <h3 class="badge-title">⭐ OFFICIAL JUNIOR INVENTOR BADGE</h3>
              <p class="badge-desc">You are now a registered Junior Inventor! Today you will explore Clara's workshop, investigate 5 wacky inventions, solve 6 reading mysteries, and build your own creation!</p>
            </div>
          </div>

          <div class="mystery-grid">
      `;

      data.combos.forEach((c) => {
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

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="hud-btn" onclick="window.claraApp.openTeacherModal()">📖 Teacher HUD</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson1', 2)">
              <span>Next: What Does The Invention Do?</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 2: WHAT DOES THE INVENTION DO? (5–10 min)
    // =========================================================================
    renderWhatDoesItDo(container, state) {
      const inventions = root.CLARA_DATA.lesson1.inventions;
      const targetInv = inventions[state.whatDoesItDoIndex || 0];
      const think = root.CLARA_DATA.lesson1.thinkAndDiscuss;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 2 (5–10 min) • 5 Textbook Inventions</span>
              <h2 class="stage-main-title">🎴 What Does The Invention Do?</h2>
              <p class="stage-instruction">Listen to the clue! Tap the correct invention from Clara's workshop.</p>
            </div>
            <div class="hud-group">
              <button class="hud-btn" onclick="window.claraApp.openPhonicsMini()">
                🔤 <span>2-Min Phonics Challenge</span>
              </button>
              <button class="hud-btn" onclick="window.claraApp.toggleInvMode()">
                🔄 <span>Mode: ${state.invMode === 'reverse' ? 'Invention -> Clue' : 'Clue -> Invention'}</span>
              </button>
            </div>
          </div>

          <div class="clue-box">
            <div>
              <div style="font-size:0.82rem; font-weight:800; color:var(--lab-cyan); text-transform:uppercase;">Clue #${(state.whatDoesItDoIndex || 0) + 1} of ${inventions.length}</div>
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
            <div class="inv-textbook-quote">"${inv.bookQuote}"</div>
            <div style="font-size:0.75rem; color:var(--lab-gold); font-weight:800; margin-top:4px;">${inv.bookPage}</div>
          </div>
        `;
      });

      html += `
          </div>

          <!-- Think & Discuss Box (Page 16) -->
          <div class="clue-box" style="border-color:var(--lab-gold); background:rgba(251, 191, 36, 0.08); margin-top:16px;">
            <div>
              <div style="font-size:0.82rem; font-weight:800; color:var(--lab-gold); text-transform:uppercase;">🤔 Think and Discuss (Page 16)</div>
              <div class="clue-text-big">"${think.question}"</div>
              <div style="color:#e2e8f0; font-size:1.05rem; margin-top:6px;">
                Expected Response: <strong>"${think.expectedAnswer}"</strong>
              </div>
            </div>
            <button class="action-btn gold" onclick="window.claraAudio.speak('${think.speechText.replace(/'/g, "\\'")}')">
              🔊 <span>Discuss (TTS)</span>
            </button>
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
              <span class="stage-tagline">Lesson 1 • Part 3 (10–17 min) • Reading Comprehension</span>
              <h2 class="stage-main-title">🕵️ Reading Detective Missions</h2>
              <p class="stage-instruction">Read the short story chunk. Find the exact evidence to answer the mission question!</p>
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
                <span style="font-size:0.85rem; color:var(--lab-text-muted);">💡 Detective Mission: <strong>${curMission.questionCode}</strong></span>
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
              <span>Next: True or False — MOVE!</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 4: TRUE OR FALSE — MOVE! (17–24 min)
    // =========================================================================
    renderFourCorners(container, state) {
      const items = root.CLARA_DATA.lesson1.fourCorners;
      const curItem = items[this.activeTfIdx];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 4 (17–24 min) • Kinesthetic Comprehension</span>
              <h2 class="stage-main-title">🏃 True or False — MOVE!</h2>
              <p class="stage-instruction">Classroom Movement: Move to TRUE (Left) or FALSE (Right)! Then say WHY!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">Statement ${this.activeTfIdx + 1} of ${items.length}</span>
            </div>
          </div>

          <div class="kinesthetic-banner">
            <span>⬅️ LEFT SIDE: TRUE</span>
            <span style="font-size:1.1rem; color:var(--lab-gold); font-weight:900;">• PHYSICAL MOVEMENT ZONE •</span>
            <span>RIGHT SIDE: FALSE ➡️</span>
          </div>

          <div class="four-corners-box">
            <div class="statement-label">STATEMENT #${this.activeTfIdx + 1}</div>
            <div class="statement-big" id="tf-statement-text">"${curItem.statement}"</div>

            <div class="tf-buttons-row">
              <button class="tf-giant-btn true-btn" onclick="window.claraApp.checkTfAnswer(true)">
                <span style="font-size:2.8rem;">👍</span>
                <span>TRUE</span>
              </button>
              <button class="tf-giant-btn false-btn" onclick="window.claraApp.checkTfAnswer(false)">
                <span style="font-size:2.8rem;">👎</span>
                <span>FALSE</span>
              </button>
            </div>

            <div class="tf-explanation-box" id="tf-feedback" style="display:none;"></div>
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

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 5 (24–31 min) • Narrative Chronology</span>
              <h2 class="stage-main-title">📜 Build Clara's Story</h2>
              <p class="stage-instruction">Drag or click the 6 cards in chronological order from First to Finally!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.validateStoryOrder()">
                ✨ <span>Check Story Order</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">🗣️ Retell Story: <span class="highlight">"First... Then... Next... Finally!"</span></div>
            <button class="hud-btn" onclick="window.claraAudio.speak('First, Clara invents after school. Then she has an idea and makes a plan. The mirror does not work, but she tries again! Finally, she makes a clean-up machine!')">🔊 Listen</button>
          </div>

          <!-- Destination Timeline Slots -->
          <div class="timeline-row">
      `;

      for (let i = 1; i <= 6; i++) {
        const assigned = this.storySlotAssignments[i];
        const stepName = i === 1 ? 'FIRST' : (i === 6 ? 'FINALLY' : (i % 2 === 0 ? 'THEN' : 'NEXT'));
        html += `
          <div class="timeline-slot ${assigned ? 'filled' : ''}" id="slot-${i}" onclick="window.claraApp.clearSlot(${i})">
            <span class="slot-num">${i}. ${stepName}</span>
            <div class="slot-content">${assigned ? assigned.text : '<span style="color:#64748b; font-size:0.8rem;">Tap card below</span>'}</div>
          </div>
        `;
      }

      html += `
          </div>

          <!-- Scrambled Source Cards -->
          <div class="story-cards-pool" id="cards-pool">
      `;

      cards.forEach((c) => {
        const isAssigned = Object.values(this.storySlotAssignments).some(a => a && a.order === c.order);
        html += `
          <div class="story-drag-card ${isAssigned ? 'used' : ''}" id="card-event-${c.order}" onclick="window.claraApp.assignCardToNextSlot(${c.order})">
            <span style="font-size:1.8rem;">${c.icon}</span>
            <div style="font-weight:700; font-size:0.95rem;">${c.text}</div>
          </div>
        `;
      });

      html += `
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson1', 4)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson1', 6)">
              <span>Next: Create Your Invention</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 6: CREATE YOUR INVENTION (31–35 min)
    // =========================================================================
    renderMyInvention(container, state) {
      const options = root.CLARA_DATA.lesson1.builderOptions;
      const combos = options.combinations;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Part 6 (31–35 min) • Studio Workshop</span>
              <h2 class="stage-main-title">🎨 Create Your Invention</h2>
              <p class="stage-instruction">Pick wacky parts or sketch your invention! Fill in your speaking frame and pitch to your partner!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.finishLesson1()">
                ⭐ <span>Finish Lesson 1</span>
              </button>
            </div>
          </div>

          <div class="studio-grid">
            <!-- Left: Combinations & Drawing Pad -->
            <div class="studio-picker-box">
              <div style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan); margin-bottom:8px;">1. CHOOSE A WACKY COMBINATION:</div>
              <div class="mashup-chips-row">
      `;

      combos.forEach((c, idx) => {
        const sel = idx === (state.chosenComboIdx || 0) ? 'selected' : '';
        html += `<button class="mashup-chip ${sel}" onclick="window.claraApp.pickCombo(${idx})">${c.icon} ${c.name}</button>`;
      });

      html += `
              </div>

              <!-- Interactive Drawing Pad on Smartboard -->
              <div style="margin-top:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span style="font-size:0.85rem; font-weight:800; color:var(--lab-gold);">✏️ SMARTBOARD SKETCH PAD:</span>
                  <button class="hud-btn" style="padding:2px 8px; font-size:0.75rem;" onclick="window.claraApp.clearDrawing()">🧹 Clear</button>
                </div>
                <canvas id="studio-drawing-canvas" width="360" height="180" style="background:#0b1329; border:2px dashed var(--lab-cyan); border-radius:10px; cursor:crosshair; width:100%; touch-action:none;"></canvas>
              </div>
            </div>

            <!-- Right: Live Blueprint & Speaking Frame -->
            <div class="blueprint-preview-box">
              <div class="blueprint-header">
                <span class="blueprint-stamp">CONFIDENTIAL BLUEPRINT #001</span>
                <span style="font-size:0.85rem; color:var(--lab-cyan); font-weight:800;">JUNIOR INVENTOR</span>
              </div>

              <div class="blueprint-screen">
                <div style="font-size:3.5rem;">${combos[state.chosenComboIdx || 0].icon}</div>
                <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--lab-gold);">
                  THE ${combos[state.chosenComboIdx || 0].name}
                </h3>
                <p style="color:#cbd5e1; font-size:0.95rem;">${combos[state.chosenComboIdx || 0].desc}</p>
              </div>

              <div class="blueprint-speech-output">
                🗣️ <strong>Speaking Frame:</strong><br>
                "My invention is a <strong>${combos[state.chosenComboIdx || 0].name}</strong>."<br>
                "It can <strong>${combos[state.chosenComboIdx || 0].desc}</strong>."
              </div>

              <button class="action-btn gold" onclick="window.claraAudio.speak('My invention is a ${combos[state.chosenComboIdx || 0].name}! It can ${combos[state.chosenComboIdx || 0].desc}!')">
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
      this.initDrawingCanvas();
    }

    initDrawingCanvas() {
      const canvas = document.getElementById('studio-drawing-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      this.drawingCtx = ctx;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#38bdf8';

      let drawing = false;

      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * (canvas.width / rect.width),
          y: (clientY - rect.top) * (canvas.height / rect.height)
        };
      };

      const start = (e) => {
        drawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      };

      const move = (e) => {
        if (!drawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      };

      const end = () => { drawing = false; };

      canvas.onmousedown = start;
      canvas.onmousemove = move;
      window.onmouseup = end;
      canvas.ontouchstart = start;
      canvas.ontouchmove = move;
      window.ontouchend = end;
    }

    // =========================================================================
    // LESSON 2 — STAGE 1: THE BROKEN INVENTION (0–5 min)
    // =========================================================================
    renderBrokenReview(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 1 (0–5 min) • Review & Problem Intro</span>
              <h2 class="stage-main-title">💥 The Broken Invention Review</h2>
              <p class="stage-instruction">Review your inventions from Lesson 1... but wait! SOMETHING IS WRONG!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn red" onclick="window.claraApp.triggerBrokenAlert()">
                ⚠️ <span>Simulate Failure</span>
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
                🗣️ Teacher Language: <span class="highlight">"Oh no! The invention doesn't work! What do we do? We need a PLAN!"</span>
              </div>
              <button class="hud-btn" onclick="window.claraAudio.speak('Oh no! The invention does not work! What do we do? We need a plan! We need sequence!')">🔊 Speak</button>
            </div>

            <div style="display:flex; justify-content:center; gap:16px; margin-top:12px; flex-wrap:wrap;">
              <div class="stage-tracker-pill">1. IDEA 💡</div>
              <div class="stage-tracker-pill">2. PLAN 📝</div>
              <div class="stage-tracker-pill">3. MAKE 🔨</div>
              <div class="stage-tracker-pill">4. TEST 🧪</div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.switchLesson('lesson1')">⬅️ Back to Lesson 1</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 2)">
              <span>Next: Human Tablet Simulator</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 2: HUMAN TABLET (5–10 min)
    // =========================================================================
    renderHumanTablet(container, state) {
      const tb = this.tabletState;
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 2 (5–10 min) • Reading Book 3 Page 17</span>
              <h2 class="stage-main-title">📱 Human Tablet Simulator</h2>
              <p class="stage-instruction">Physical Activity: 4 students hold instruction cards! Put them in order: FIRST, SECOND, THIRD, LAST!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">FIRST • SECOND • THIRD • LAST</span>
            </div>
          </div>

          <div class="kinesthetic-banner">
            <span>👥 HUMAN TABLET: 4 Students stand at the front holding:</span>
            <strong>[Press play] • [Type password] • [Play the game] • [Press on]</strong>
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
          <div style="font-size:0.85rem; color:#64748b;">Step: Press ON button at the top!</div>
        `;
      } else if (tb.code !== '1234') {
        html += `
          <div style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan); text-transform:uppercase;">Step: Type Password (1-2-3-4)</div>
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
          <div style="font-size:0.85rem; color:var(--lab-gold); margin-bottom:12px;">Step: Press PLAY to begin!</div>
          <button class="action-btn green" onclick="window.claraApp.pressTabletPlay()">
            ▶️ <span>PRESS PLAY</span>
          </button>
        `;
      } else {
        html += `
          <div class="bunny-game-screen">
            <div style="display:flex; justify-content:space-between; width:100%; font-weight:800;">
              <span>Step: Play the Game!</span>
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
              <span>Next: Sequence Builder & Bug Spotter</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 3: SEQUENCE BUILDER & BUG SPOTTER (10–15 min)
    // =========================================================================
    renderSequenceBuilder(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 3 (10–15 min) • Sequence Logic</span>
              <h2 class="stage-main-title">🧩 Sequence Builder & Bug Spotter</h2>
              <p class="stage-instruction">Match the 4 actions under First, Second, Third, and Last. Spot deliberate bugs!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn red" onclick="window.claraApp.generateSequenceBug()">
                🐛 <span>Spot the Bug!</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">🗣️ Sequence Words: <span class="highlight">"First, press play. Second, type password. Third, play the game. Last, press on!"</span></div>
            <button class="hud-btn" onclick="window.claraAudio.speak('First, press play. Second, type password. Third, play the game. Last, press on!')">🔊 Listen</button>
          </div>

          <div class="process-grid" id="sequence-match-grid">
            <div class="process-card" id="seq-col-1">
              <span class="process-order-tag">1. FIRST</span>
              <div class="process-icon-box">▶️</div>
              <h4 class="process-action-title">Press play.</h4>
              <p class="process-action-desc">Tap the play button to start the system.</p>
            </div>
            <div class="process-card gold-tag" id="seq-col-2">
              <span class="process-order-tag">2. SECOND</span>
              <div class="process-icon-box">🔢</div>
              <h4 class="process-action-title">Type password.</h4>
              <p class="process-action-desc">Unlock screen with your secret 4-digit code.</p>
            </div>
            <div class="process-card purple-tag" id="seq-col-3">
              <span class="process-order-tag">3. THIRD</span>
              <div class="process-icon-box">🎮</div>
              <h4 class="process-action-title">Play the game.</h4>
              <p class="process-action-desc">Jump into the adventure and score points.</p>
            </div>
            <div class="process-card green-tag" id="seq-col-4">
              <span class="process-order-tag">4. LAST</span>
              <div class="process-icon-box">🔘</div>
              <h4 class="process-action-title">Press on.</h4>
              <p class="process-action-desc">Confirm device activation and save game.</p>
            </div>
          </div>

          <div id="bug-feedback-box" style="display:none; margin-top:16px;"></div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="action-btn" onclick="window.claraApp.goToStage('lesson2', 2)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.claraApp.goToStage('lesson2', 4)">
              <span>Next: Inventor Process</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 4: INVENTOR PROCESS (15–21 min)
    // =========================================================================
    renderInventorProcess(container, state) {
      const stages = root.CLARA_DATA.lesson2.inventorStages;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 4 (15–21 min) • Reading Book 3 Page 17</span>
              <h2 class="stage-main-title">💡 The 4-Stage Inventor Process</h2>
              <p class="stage-instruction">How do inventors work? Learn the 4 official textbook stages!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraAudio.speak('First, an inventor has a good idea for an invention. Second, an inventor writes down the plan for the invention. Third, an inventor makes the invention. Last, an inventor tests the invention.')">
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
              <button class="hud-btn" style="width:100%; justify-content:center;" onclick="window.claraAudio.speak('${s.sequenceWord}: ${s.textbookText}')">
                🔊 Listen
              </button>
            </div>
          </div>
        `;
      });

      html += `
          </div>

          <!-- Textbook Discussion Card (Page 17) -->
          <div class="clue-box" style="border-color:var(--lab-gold); background:rgba(251, 191, 36, 0.1); margin-top:16px;">
            <div>
              <div style="font-size:0.85rem; font-weight:800; color:var(--lab-gold); text-transform:uppercase;">Discussion (Page 17)</div>
              <div class="clue-text-big">"Why do you think inventors have notebooks?"</div>
              <div style="color:#e2e8f0; font-size:1.1rem; margin-top:6px;">
                Possible Answer: <strong>"Because they want to remember things."</strong>
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
              <span class="stage-tagline">Lesson 2 • Part 5 (21–27 min) • Team Physical Game</span>
              <h2 class="stage-main-title">⏱️ Sequence Relay Race</h2>
              <p class="stage-instruction">Teacher calls 'FIRST!', 'SECOND!', 'THIRD!', or 'LAST!'. Tap the matching stage! Accuracy = 10 points!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.claraApp.startRelayRound()">
                🏁 <span>Next Callout</span>
              </button>
            </div>
          </div>

          <div class="relay-timer-bar">
            <div>
              <span style="font-size:0.85rem; font-weight:800; color:var(--lab-gold); text-transform:uppercase;">CURRENT CALLOUT</span>
              <div style="font-size:2.4rem; font-weight:900; color:#ffffff;" id="relay-callout-text">
                "FIRST!"
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.85rem; color:#94a3b8;">Scoring Rule</span>
              <div style="font-weight:800; color:var(--lab-green);">10 pts for Accuracy!</div>
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
              <span>Next: Inventor Lab</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 6: INVENTOR LAB (27–33 min) - All 8 Dilemmas
    // =========================================================================
    renderLabChallenge(container, state) {
      const challenges = root.CLARA_DATA.lesson2.challenges;
      const activeChal = challenges[state.activeChalIdx || 0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 6 (27–33 min) • Group Innovation</span>
              <h2 class="stage-main-title">🛠️ Inventor Lab</h2>
              <p class="stage-instruction">Select 1 of 8 real-world dilemmas for your group and explain the 4-step process!</p>
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
                <span style="font-size:0.85rem; font-weight:800; color:var(--lab-cyan);">PROPOSED INVENTION:</span>
                <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:900; color:#ffffff; margin-top:4px;">
                  ✨ ${activeChal.machineName}
                </div>
              </div>
            </div>

            <!-- Right: 4-Step Process Speaking Blueprint -->
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
              <span>Next: Inventor Presentation & Ceremony</span> 🏆
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 7: INVENTOR PRESENTATION (33–35 min)
    // =========================================================================
    renderPitchCeremony(container, state) {
      const badges = root.CLARA_DATA.badges;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Part 7 (33–35 min) • Final Presentation</span>
              <h2 class="stage-main-title">🏆 Inventor Presentation & Ceremony</h2>
              <p class="stage-instruction">2–3 groups present their invention! Classmates vote with reaction stars!</p>
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
              🏆 INVENTOR SCORE: ${state.xp} XP
            </h3>
            <p style="font-size:1.15rem; color:#cbd5e1; max-width:600px; margin:0 auto;">
              Audience Reaction Stars: Tap to vote for the best presentation qualities!
            </p>

            <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap; margin-top:12px;">
              <button class="action-btn gold" onclick="window.claraApp.awardPresentationStar('idea')">
                ⭐ <span>GOOD IDEA</span> (<span id="star-count-idea">${state.presentationStars.idea || 0}</span>)
              </button>
              <button class="action-btn primary" onclick="window.claraApp.awardPresentationStar('useful')">
                ⭐ <span>USEFUL</span> (<span id="star-count-useful">${state.presentationStars.useful || 0}</span>)
              </button>
              <button class="action-btn green" onclick="window.claraApp.awardPresentationStar('funny')">
                ⭐ <span>FUNNY</span> (<span id="star-count-funny">${state.presentationStars.funny || 0}</span>)
              </button>
              <button class="action-btn gold" onclick="window.claraApp.awardPresentationStar('applause')">
                👏 <span>APPLAUSE</span> (<span id="star-count-applause">${state.presentationStars.applause || 0}</span>)
              </button>
            </div>

            <!-- Earned Badges Showcase -->
            <div style="margin-top:20px;">
              <h4 style="color:var(--lab-cyan); font-size:1.1rem; margin-bottom:10px;">🎖️ Badges Earned Today:</h4>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; text-align:left;">
      `;

      badges.forEach(b => {
        html += `
          <div style="background:rgba(15,23,42,0.7); border:1px solid var(--lab-gold); padding:10px 12px; border-radius:10px;">
            <div style="font-size:1.5rem;">${b.icon}</div>
            <strong style="color:var(--lab-gold); font-size:0.9rem;">${b.title}</strong>
            <div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;">${b.desc}</div>
          </div>
        `;
      });

      html += `
              </div>
            </div>

            <!-- Notebook Discussion Wrap-up -->
            <div class="speaking-banner" style="margin-top:20px; text-align:left;">
              <div class="speak-text">
                💡 Final Reflection: <span class="highlight">"Why do inventors have notebooks?" — "To remember their ideas."</span>
              </div>
              <button class="hud-btn" onclick="window.claraAudio.speak('Why do inventors have notebooks? To remember their ideas!')">🔊 Model Answer</button>
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
              <span class="stage-tagline">Phonics Extension • Reading Book 3 Page 16</span>
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
              🕵️ Story Scavenger Hunt: Words starting with CL- in Clara's reading!
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
