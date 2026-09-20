/**
 * INVENTOR LAB — SCENE RENDERERS (STAGES 1 - 9)
 * High-engagement, interactive, touch-friendly renderers for smartboards.
 */

(function(root) {
  'use strict';

  const scenes = {

    // ----------------------------------------------------
    // STAGE 1: LAB INDUCTION & MISSION BRIEFING
    // ----------------------------------------------------
    renderStage1(container, state) {
      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">🚀 UNIT 1 MISSION</div>
          <h1 class="stage-title">Welcome to the Junior Inventor Lab!</h1>
          <p class="stage-subtitle">Discover what it takes to be an inventor, inspect clues, read Clara Doodle's story, and build your own machine.</p>
        </div>

        <div class="intro-hero">
          <div class="intro-art">
            <div class="intro-gear-icon">⚙️</div>
            <div class="intro-blueprint-card">
              <h3 style="color:#38bdf8; margin-bottom:8px;">📐 MISSION BLUEPRINT</h3>
              <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.5;">
                Today you will explore, think, read evidence, and become certified inventors!
              </p>
              <div style="margin-top:16px; font-size:2.4rem;">💡 🛠️ 🤖 🚀</div>
            </div>
          </div>

          <div class="intro-content">
            <h2 class="intro-title-large">
              What does it take to be an <span>INVENTOR?</span>
            </h2>
            <p class="intro-desc">
              Do inventors have magic powers? Do they give up when something breaks? 
              Follow the challenges to unlock the secrets of great inventors!
            </p>

            <div class="intro-mission-box">
              <h4>🎯 TODAY'S 5 INVENTOR CHALLENGES</h4>
              <ul>
                <li><span>🔍 1.</span> Mystery Room Investigation</li>
                <li><span>🧠 2.</span> See / Think / Wonder Routine</li>
                <li><span>📖 3.</span> Clara Doodle Guided Reading</li>
                <li><span>⚖️ 4.</span> Inventor Mindset Sorting</li>
                <li><span>🛠️ 5.</span> The Invention Studio Project</li>
              </ul>
            </div>

            <button class="btn-launch-large" onclick="window.inventorApp.nextStage()">
              <span>START MISSION</span> 🚀
            </button>
          </div>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 2: THE MYSTERY ROOM (Textbook Page 8)
    // ----------------------------------------------------
    renderStage2(container, state) {
      const hotspots = INVENTOR_DATA.hotspots;
      const activeHotspot = hotspots.find(h => h.id === state.selectedHotspot) || hotspots[0];

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">🔍 CHALLENGE 1: MYSTERY ROOM</div>
          <h1 class="stage-title">Who is this boy? What does he do?</h1>
          <p class="stage-subtitle">Tap the glowing yellow hotspots on the picture to discover clues and practice target speaking frames.</p>
        </div>

        <div class="mystery-layout">
          <!-- Picture with interactive Hotspots -->
          <div class="picture-viewer-card">
            <div class="hotspot-canvas-container">
              <img src="../assets/books/global-readings-2/page_08.jpg" alt="Mystery Room with Boy and Robot" class="hotspot-img">
              ${hotspots.map(h => {
                const isDiscovered = state.discoveredHotspots.includes(h.id);
                const isActive = state.selectedHotspot === h.id;
                return `
                  <button 
                    class="hotspot-marker ${isDiscovered ? 'discovered' : ''} ${isActive ? 'active' : ''}" 
                    style="left:${h.x}%; top:${h.y}%;" 
                    onclick="window.inventorApp.selectHotspot('${h.id}')"
                    title="${h.title}"
                  >
                    ${h.icon}
                  </button>
                `;
              }).join('')}
            </div>
            <div style="margin-top:10px; font-size:0.85rem; color:var(--text-muted);">
              💡 Click all 6 clues to complete the investigation! (${state.discoveredHotspots.length}/6 found)
            </div>
          </div>

          <!-- Hotspot Details Sidebar -->
          <div class="hotspot-details-panel">
            <div class="detail-card active-clue">
              <div class="detail-header">
                <h3 class="detail-title">${activeHotspot.icon} ${activeHotspot.title}</h3>
                <span style="font-size:0.85rem; color:var(--cyan-blue); font-weight:800;">CLUE INSPECTED</span>
              </div>
              
              <p style="color:#cbd5e1; font-size:1.05rem; line-height:1.5; margin-bottom:12px;">
                ${activeHotspot.detail}
              </p>

              <!-- Speaking Sentence Frame -->
              <div class="sentence-frame-box">
                <span id="active-sentence-text">"${activeHotspot.sentence}"</span>
                <button class="btn-speak-inline" onclick="window.inventorAudio.speak('${activeHotspot.sentence.replace(/'/g, "\\'")}')">
                  🔊 Speak
                </button>
              </div>

              <!-- Quick Questions -->
              <div class="oral-prompt-banner">
                <h4>🗣️ Classroom Speaking Prompt:</h4>
                <p style="font-weight:700;">${activeHotspot.prompt}</p>
                <div style="margin-top:8px; display:flex; gap:8px;">
                  <button class="hud-btn" onclick="window.inventorAudio.speak('I see a boy reading an old book.')">I see...</button>
                  <button class="hud-btn" onclick="window.inventorAudio.speak('I think he is an inventor.')">I think...</button>
                  <button class="hud-btn" onclick="window.inventorAudio.speak('Maybe he built the robot.')">Maybe...</button>
                </div>
              </div>
            </div>

            <!-- Team Reward Quick Action -->
            <div style="background:var(--bg-surface); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:0.92rem; color:#cbd5e1; font-weight:700;">Award point for good speaking answer:</span>
              <div style="display:flex; gap:8px;">
                <button class="hud-btn" onclick="window.inventorApp.addScore('teamA', 1)">+1 Team Alpha</button>
                <button class="hud-btn" onclick="window.inventorApp.addScore('teamB', 1)">+1 Team Beta</button>
              </div>
            </div>

            <button class="btn-launch-large" style="width:100%; justify-content:center;" onclick="window.inventorApp.nextStage()">
              <span>PROCEED TO SEE / THINK / WONDER</span> ➡️
            </button>
          </div>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 3: SEE / THINK / WONDER (Textbook Page 9)
    // ----------------------------------------------------
    renderStage3(container, state) {
      const items = INVENTOR_DATA.seeThinkWonderItems;
      const placed = state.stwPlaced || {};

      const seeItems = items.filter(it => placed[it.id] === 'see');
      const thinkItems = items.filter(it => placed[it.id] === 'think');
      const wonderItems = items.filter(it => placed[it.id] === 'wonder');
      const unplacedItems = items.filter(it => !placed[it.id]);

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">🧠 CHALLENGE 2: THINKING ROUTINE</div>
          <h1 class="stage-title">See, Think, Wonder</h1>
          <p class="stage-subtitle">Is it a visible fact (I SEE), a reasonable clue (I THINK), or a creative question (MAYBE / I WONDER)?</p>
        </div>

        <div class="stw-board">
          <!-- Zone 1: I SEE -->
          <div class="stw-zone zone-see">
            <div class="stw-zone-header">
              <h3 class="stw-zone-title">👁️ I SEE...</h3>
              <span style="font-size:0.85rem; color:#34d399; font-weight:800;">(Visible Facts)</span>
            </div>
            <div class="stw-card-list" id="zone-see-list">
              ${seeItems.map(it => `
                <div class="stw-item-card correct">
                  <span>${it.icon} ${it.text}</span>
                  <span style="color:#10b981;">✓</span>
                </div>
              `).join('')}
              ${seeItems.length === 0 ? '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:24px;">Items will appear here</p>' : ''}
            </div>
          </div>

          <!-- Zone 2: I THINK -->
          <div class="stw-zone zone-think">
            <div class="stw-zone-header">
              <h3 class="stw-zone-title">🧠 I THINK...</h3>
              <span style="font-size:0.85rem; color:#38bdf8; font-weight:800;">(Clues & Inferences)</span>
            </div>
            <div class="stw-card-list" id="zone-think-list">
              ${thinkItems.map(it => `
                <div class="stw-item-card correct">
                  <span>${it.icon} ${it.text}</span>
                  <span style="color:#10b981;">✓</span>
                </div>
              `).join('')}
              ${thinkItems.length === 0 ? '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:24px;">Items will appear here</p>' : ''}
            </div>
          </div>

          <!-- Zone 3: MAYBE / I WONDER -->
          <div class="stw-zone zone-wonder">
            <div class="stw-zone-header">
              <h3 class="stw-zone-title">❓ MAYBE / I WONDER</h3>
              <span style="font-size:0.85rem; color:#c084fc; font-weight:800;">(Curious Questions)</span>
            </div>
            <div class="stw-card-list" id="zone-wonder-list">
              ${wonderItems.map(it => `
                <div class="stw-item-card correct">
                  <span>${it.icon} ${it.text}</span>
                  <span style="color:#10b981;">✓</span>
                </div>
              `).join('')}
              ${wonderItems.length === 0 ? '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:24px;">Items will appear here</p>' : ''}
            </div>
          </div>
        </div>

        <!-- Clues Tray to Sort -->
        ${unplacedItems.length > 0 ? `
          <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-subtle); margin-bottom:24px;">
            <h4 style="color:var(--amber-gold); font-size:1rem; font-weight:800; margin-bottom:12px;">
              📦 CLUES WAITING TO BE SORTED (Click a category for each):
            </h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:12px;">
              ${unplacedItems.map(it => `
                <div class="stw-item-card" style="flex-direction:column; align-items:flex-start; gap:10px;">
                  <div style="font-size:1rem;">${it.icon} ${it.text}</div>
                  <div style="display:flex; gap:8px; width:100%;">
                    <button class="hud-btn" style="flex:1; padding:6px; font-size:0.8rem; justify-content:center; border-color:#10b981;" onclick="window.inventorApp.sortSTWItem('${it.id}', 'see')">👁️ I SEE</button>
                    <button class="hud-btn" style="flex:1; padding:6px; font-size:0.8rem; justify-content:center; border-color:#06b6d4;" onclick="window.inventorApp.sortSTWItem('${it.id}', 'think')">🧠 I THINK</button>
                    <button class="hud-btn" style="flex:1; padding:6px; font-size:0.8rem; justify-content:center; border-color:#8b5cf6;" onclick="window.inventorApp.sortSTWItem('${it.id}', 'wonder')">❓ WONDER</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div style="background:rgba(16, 185, 129, 0.2); border:1.5px solid #10b981; border-radius:var(--radius-lg); padding:18px; text-align:center; margin-bottom:24px;">
            <h3 style="color:#a7f3d0; font-size:1.3rem;">🎉 All Clues Sorted Correctly! +20 Points</h3>
          </div>
        `}

        <!-- Sentence Builder Tool -->
        <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-lg); border:1.5px solid var(--border-glow); display:flex; flex-direction:column; gap:12px;">
          <h4 style="color:#38bdf8; font-size:1.05rem; font-weight:800;">
            🗣️ SENTENCE BUILDER: "I think he is an inventor because..."
          </h4>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${INVENTOR_DATA.sentenceBuilderReasons.map(r => `
              <button class="hud-btn" onclick="window.inventorAudio.speak('${r.text.replace(/'/g, "\\'")}')">
                🔊 ...${r.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:20px; display:flex; justify-content:flex-end;">
          <button class="btn-launch-large" onclick="window.inventorApp.nextStage()">
            <span>NEXT: WHAT DO INVENTORS DO?</span> ➡️
          </button>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 4: WHAT DO INVENTORS DO? (Textbook Page 9 D & E)
    // ----------------------------------------------------
    renderStage4(container, state) {
      const quiz = INVENTOR_DATA.firstStepQuiz;
      const cycle = INVENTOR_DATA.inventionCycle;
      const selectedQuiz = state.firstStepAnswer;

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">💡 CHALLENGE 3: THE INVENTOR'S PROCESS</div>
          <h1 class="stage-title">What Do Inventors Do First?</h1>
          <p class="stage-subtitle">Discover the 5-Stage Invention Cycle from spark to finished machine!</p>
        </div>

        <!-- Part A: Page 9 Quiz -->
        <div class="cycle-quiz-box">
          <h2 style="color:#ffffff; font-size:1.5rem; margin-bottom:8px;">${quiz.question}</h2>
          <p style="color:var(--text-muted); font-size:1rem;">(Textbook Page 9, Exercise E)</p>

          <div class="quiz-options-row">
            ${quiz.options.map(opt => {
              let btnClass = 'quiz-opt-btn';
              if (selectedQuiz === opt.id) {
                btnClass += opt.correct ? ' correct' : ' wrong';
              }
              return `
                <button class="${btnClass}" onclick="window.inventorApp.answerFirstStepQuiz('${opt.id}')">
                  ${opt.text}
                </button>
              `;
            }).join('')}
          </div>

          ${selectedQuiz ? `
            <div style="margin-top:20px; padding:16px; border-radius:var(--radius-md); background:${quiz.options.find(o=>o.id===selectedQuiz).correct ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}; font-size:1.15rem; font-weight:800; color:#ffffff;">
              ${quiz.options.find(o => o.id === selectedQuiz).feedback}
            </div>
          ` : ''}
        </div>

        <!-- Part B: 5-Stage Cycle -->
        <div style="margin-top:24px;">
          <h3 style="text-align:center; color:var(--amber-gold); font-size:1.35rem; font-weight:900; margin-bottom:8px;">
            🔄 THE 5-STAGE INVENTION CYCLE
          </h3>
          <p style="text-align:center; color:var(--text-muted); font-size:0.95rem; margin-bottom:20px;">
            Click each stage to explore its role!
          </p>

          <div class="invention-cycle-grid">
            ${cycle.map(st => `
              <div class="cycle-step-card ${state.activeCycleStep === st.step ? 'active' : ''}" onclick="window.inventorApp.selectCycleStep(${st.step})">
                <div class="cycle-step-badge">${st.step}</div>
                <div class="cycle-step-icon">${st.icon}</div>
                <h4 class="cycle-step-title">${st.title}</h4>
                <p class="cycle-step-desc">${st.desc}</p>
                <button class="hud-btn" style="margin-top:12px; font-size:0.75rem; padding:4px 8px;" onclick="event.stopPropagation(); window.inventorAudio.speak('${st.title}. ${st.desc.replace(/'/g, "\\'")}')">
                  🔊 Listen
                </button>
              </div>
            `).join('')}
          </div>

          ${state.activeCycleStep ? `
            <div style="background:var(--bg-surface); border:2px solid var(--cyan-blue); border-radius:var(--radius-lg); padding:20px; margin-top:24px; text-align:center;">
              <h4 style="color:#38bdf8; font-size:1.2rem; margin-bottom:6px;">
                ${cycle[state.activeCycleStep - 1].icon} Step ${state.activeCycleStep}: ${cycle[state.activeCycleStep - 1].title}
              </h4>
              <p style="color:#ffffff; font-size:1.1rem; font-weight:700;">
                ${cycle[state.activeCycleStep - 1].example}
              </p>
            </div>
          ` : ''}
        </div>

        <div style="margin-top:32px; display:flex; justify-content:flex-end;">
          <button class="btn-launch-large" onclick="window.inventorApp.nextStage()">
            <span>NEXT: CLARA DOODLE GUIDED READING</span> 📖
          </button>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 5: GUIDED READING — CLARA DOODLE (Pages 10 - 15)
    // ----------------------------------------------------
    renderStage5(container, state) {
      const story = INVENTOR_DATA.claraStory;
      const missions = story.evidenceMissions;
      const currentMission = missions[state.currentMissionIndex || 0];
      const currentPassage = story.passages[state.storyPageIdx || 0];

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">📖 CHALLENGE 4: EVIDENCE DETECTIVE</div>
          <h1 class="stage-title">Clara Doodle: The After-School Inventor</h1>
          <p class="stage-subtitle">Read Clara's story and tap the exact sentence in the text that proves the answer!</p>
        </div>

        <div class="reading-layout">
          <!-- Book Illustration Frame -->
          <div class="story-book-frame">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center; margin-bottom:12px;">
              <button class="hud-btn" onclick="window.inventorApp.prevStoryPage()" ${state.storyPageIdx === 0 ? 'disabled' : ''}>⬅️ Prev Page</button>
              <span style="font-weight:900; color:var(--amber-gold);">Page ${currentPassage.page} of 15</span>
              <button class="hud-btn" onclick="window.inventorApp.nextStoryPage()" ${state.storyPageIdx >= story.passages.length - 1 ? 'disabled' : ''}>Next Page ➡️</button>
            </div>
            
            <img src="${currentPassage.image}" alt="Clara Doodle Story Illustration" class="story-book-img">

            <button class="hud-btn gold" style="margin-top:14px; width:100%; justify-content:center;" onclick="window.inventorApp.openGlossaryModal()">
              📚 View Words in Context Glossary
            </button>
          </div>

          <!-- Story Text & Evidence Detective Challenge -->
          <div class="story-interactive-text">
            <!-- Active Mission Banner -->
            <div class="evidence-mission-banner">
              <h4>🎯 EVIDENCE MISSION ${(state.currentMissionIndex || 0) + 1} OF ${missions.length}:</h4>
              <p>${currentMission.question}</p>
              <span style="font-size:0.85rem; color:#a5f3fc;">👉 Click the sentence below that gives the answer!</span>
            </div>

            <!-- Clickable Story Text Lines -->
            <div class="story-lines-container">
              ${currentPassage.textLines.map(line => {
                const isSelected = state.selectedStoryLine === line.id;
                const isCorrect = state.correctStoryLines && state.correctStoryLines.includes(line.id);
                let lineClass = 'story-line-bubble';
                if (isCorrect) lineClass += ' highlight-correct';
                else if (isSelected) lineClass += ' highlight-wrong';

                return `
                  <div class="${lineClass}" onclick="window.inventorApp.checkEvidenceLine('${line.id}', '${line.key || ''}')">
                    <span>"${line.text}"</span>
                    <button class="hud-btn" style="padding:4px 8px; font-size:0.8rem;" onclick="event.stopPropagation(); window.inventorAudio.speak('${line.text.replace(/'/g, "\\'")}')">
                      🔊
                    </button>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Feedback Bar -->
            ${state.evidenceFeedback ? `
              <div style="padding:14px; border-radius:var(--radius-md); background:${state.evidenceFeedback.success ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}; color:#ffffff; font-weight:800;">
                ${state.evidenceFeedback.text}
              </div>
            ` : ''}

            <!-- Next Mission Button -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
              <button class="hud-btn" onclick="window.inventorApp.advanceMission()">
                Next Evidence Mission ⏭️
              </button>
              <button class="btn-launch-large" onclick="window.inventorApp.nextStage()">
                <span>NEXT: INVENTOR OR NOT?</span> ➡️
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 6: BINARY SORTING — INVENTOR OR NOT?
    // ----------------------------------------------------
    renderStage6(container, state) {
      const scenarios = INVENTOR_DATA.inventorScenarios;
      const idx = state.scenarioIndex || 0;
      const current = scenarios[idx];
      const answerGiven = state.scenarioAnswer;

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">⚖️ CHALLENGE 5: MINDSET TEST</div>
          <h1 class="stage-title">Inventor or Not an Inventor?</h1>
          <p class="stage-subtitle">Does this person show the mindset of a true inventor? Decide together as a class!</p>
        </div>

        <div class="sorting-card-arena">
          <div class="scenario-display-card">
            <div class="scenario-counter">SCENARIO ${idx + 1} OF ${scenarios.length}</div>
            <h2 class="scenario-card-title">${current.title}</h2>
            <p class="scenario-card-text">"${current.text}"</p>

            ${answerGiven ? `
              <div style="padding:16px; border-radius:var(--radius-lg); background:${answerGiven.correct ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}; border:2px solid ${answerGiven.correct ? '#10b981' : '#f43f5e'}; margin-bottom:20px;">
                <h3 style="color:${answerGiven.correct ? '#a7f3d0' : '#fecdd3'}; font-size:1.3rem; margin-bottom:6px;">
                  ${answerGiven.correct ? '🎉 Correct!' : '❌ Think Again!'} ${current.badge}
                </h3>
                <p style="color:#ffffff; font-size:1.1rem; font-weight:700;">${current.reason}</p>
              </div>
            ` : ''}

            <!-- Choice Action Buttons -->
            <div class="sorting-actions-row">
              <button class="btn-sort-choice inventor" onclick="window.inventorApp.answerScenario(true)" ${answerGiven ? 'disabled' : ''}>
                💡 TRUE INVENTOR
              </button>
              <button class="btn-sort-choice not-inventor" onclick="window.inventorApp.answerScenario(false)" ${answerGiven ? 'disabled' : ''}>
                ❌ NOT AN INVENTOR
              </button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; width:100%; max-width:850px;">
            <button class="hud-btn" onclick="window.inventorApp.prevScenario()" ${idx === 0 ? 'disabled' : ''}>
              ⬅️ Previous Scenario
            </button>
            <button class="btn-launch-large" onclick="window.inventorApp.nextScenario()">
              ${idx < scenarios.length - 1 ? '<span>Next Scenario</span> ➡️' : '<span>Next: Problem Dilemma</span> 🚀'}
            </button>
          </div>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 7: PROBLEM-SOLVING DILEMMA (The Heavy Bag)
    // ----------------------------------------------------
    renderStage7(container, state) {
      const dilemma = INVENTOR_DATA.dilemma;
      const selectedIdea = state.dilemmaIdea;
      const testFailed = state.dilemmaTestFailed;

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">🎒 CHALLENGE 6: PROBLEM SOLVING</div>
          <h1 class="stage-title">${dilemma.title}</h1>
          <p class="stage-subtitle">Real inventors solve real daily problems! Can your class fix this school dilemma?</p>
        </div>

        <div class="dilemma-container">
          <!-- Problem Box -->
          <div class="dilemma-problem-box">
            <h2 style="color:#f59e0b; font-size:1.4rem; margin-bottom:8px;">⚠️ THE REAL-WORLD PROBLEM:</h2>
            <p style="color:#ffffff; font-size:1.3rem; font-weight:800; line-height:1.5;">
              "${dilemma.problem}"
            </p>
          </div>

          <!-- Step 1: Brainstorm 3 Ideas -->
          <h3 style="color:#38bdf8; font-size:1.2rem; font-weight:800;">${dilemma.step1Title}</h3>
          <div class="dilemma-ideas-grid">
            ${dilemma.ideas.map(idea => `
              <div class="dilemma-idea-card ${selectedIdea === idea.id ? 'selected' : ''}" onclick="window.inventorApp.selectDilemmaIdea('${idea.id}')">
                <h4 style="font-size:1.25rem; font-weight:900; color:#ffffff; margin-bottom:8px;">${idea.name}</h4>
                <p style="color:#cbd5e1; font-size:0.95rem; margin-bottom:12px;">${idea.desc}</p>
                <div style="font-size:0.85rem; color:#34d399; font-weight:700;">✅ ${idea.pros}</div>
                <div style="font-size:0.85rem; color:#fb7185; font-weight:700; margin-top:4px;">⚠️ ${idea.cons}</div>
              </div>
            `).join('')}
          </div>

          <!-- Step 2 & 3: Test & Fail Scenario -->
          ${testFailed ? `
            <div style="background:var(--bg-surface); border:2px solid #f43f5e; border-radius:var(--radius-xl); padding:28px; text-align:center;">
              <h3 style="color:#fb7185; font-size:1.5rem; margin-bottom:8px;">${dilemma.testFailScenario.title}</h3>
              <p style="color:#ffffff; font-size:1.2rem; line-height:1.5; margin-bottom:20px;">
                ${dilemma.testFailScenario.text}
              </p>
              <h4 style="color:var(--amber-gold); font-size:1.25rem; margin-bottom:16px;">
                ${dilemma.testFailScenario.question}
              </h4>
              
              <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:16px;">
                <button class="hud-btn" style="padding:16px; border-color:#f43f5e; justify-content:center;" onclick="window.inventorApp.answerDilemmaFail(false)">
                  ❌ Give up and carry the heavy bag again
                </button>
                <button class="btn-launch-large" style="justify-content:center;" onclick="window.inventorApp.answerDilemmaFail(true)">
                  🔧 MAKE CHANGES! Add mudguards!
                </button>
              </div>

              ${state.dilemmaFeedback ? `
                <div style="margin-top:16px; font-size:1.2rem; font-weight:800; color:#a7f3d0;">
                  ${state.dilemmaFeedback}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:flex-end;">
            <button class="btn-launch-large" onclick="window.inventorApp.nextStage()">
              <span>NEXT: THE INVENTION STUDIO</span> 🛠️
            </button>
          </div>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 8: THE INVENTION STUDIO (Invention Builder)
    // ----------------------------------------------------
    renderStage8(container, state) {
      const bData = INVENTOR_DATA.builder;
      const selBody = bData.bodies.find(b => b.id === state.builderBody) || bData.bodies[0];
      const selFunc = bData.functions.find(f => f.id === state.builderFunction) || bData.functions[0];
      const selFeat = bData.features.find(ft => ft.id === state.builderFeature) || bData.features[0];
      const invName = state.builderName || "The Turbo-Helper 3000";

      const pitchScript = `My invention is ${invName}! It is a ${selBody.name}. It can ${selFunc.action} using its ${selFeat.name}. It helps ${selFunc.helps} because it solves problems!`;

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">🛠️ FINAL PROJECT: THE INVENTOR STUDIO</div>
          <h1 class="stage-title">Build Your Own Invention!</h1>
          <p class="stage-subtitle">Combine parts, functions, and features to create a brand new classroom invention!</p>
        </div>

        <div class="builder-layout">
          <!-- Step Controls -->
          <div class="builder-controls-panel">
            <!-- 1. Body Base -->
            <div>
              <div class="builder-section-title">1. CHOOSE BASE BODY:</div>
              <div class="builder-pill-grid">
                ${bData.bodies.map(b => `
                  <button class="builder-pill-btn ${selBody.id === b.id ? 'active' : ''}" onclick="window.inventorApp.setBuilderPart('builderBody', '${b.id}')">
                    <span style="font-size:1.5rem;">${b.icon}</span>
                    <span>${b.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- 2. Primary Function -->
            <div>
              <div class="builder-section-title">2. CHOOSE PRIMARY FUNCTION:</div>
              <div class="builder-pill-grid">
                ${bData.functions.map(f => `
                  <button class="builder-pill-btn ${selFunc.id === f.id ? 'active' : ''}" onclick="window.inventorApp.setBuilderPart('builderFunction', '${f.id}')">
                    <span style="font-size:1.5rem;">${f.icon}</span>
                    <span>${f.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- 3. Special Feature -->
            <div>
              <div class="builder-section-title">3. CHOOSE SPECIAL FEATURE:</div>
              <div class="builder-pill-grid">
                ${bData.features.map(ft => `
                  <button class="builder-pill-btn ${selFeat.id === ft.id ? 'active' : ''}" onclick="window.inventorApp.setBuilderPart('builderFeature', '${ft.id}')">
                    <span style="font-size:1.5rem;">${ft.icon}</span>
                    <span>${ft.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- 4. Invention Name -->
            <div>
              <div class="builder-section-title">4. NAME YOUR CREATION:</div>
              <div style="display:flex; gap:10px;">
                <input 
                  type="text" 
                  value="${invName}" 
                  id="builder-name-input" 
                  onchange="window.inventorApp.setBuilderName(this.value)" 
                  style="flex:1; background:var(--bg-card); border:1.5px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px; color:#ffffff; font-size:1.1rem; font-weight:800;"
                >
                <button class="hud-btn" onclick="window.inventorApp.randomizeBuilderName()">
                  🎲 Randomize
                </button>
              </div>
            </div>
          </div>

          <!-- Blueprint Preview Card -->
          <div class="blueprint-card">
            <div>
              <div class="blueprint-header">
                <span style="font-size:0.85rem; color:#38bdf8; font-weight:800; letter-spacing:1px;">OFFICIAL BLUEPRINT SCHEMATIC</span>
                <h2 class="blueprint-title">${invName}</h2>
              </div>

              <!-- Graphic Schematic Simulation -->
              <div style="background:rgba(11, 19, 41, 0.8); border:1px solid rgba(56, 189, 248, 0.3); border-radius:var(--radius-lg); padding:24px; text-align:center; margin-bottom:16px;">
                <div style="font-size:4rem; margin-bottom:8px;">${selBody.icon} ⚡ ${selFeat.icon}</div>
                <div style="color:#a5f3fc; font-weight:800; font-size:1.1rem;">${selBody.name} with ${selFeat.name}</div>
                <div style="color:var(--text-muted); font-size:0.9rem; margin-top:4px;">Specialized for: ${selFunc.name}</div>
              </div>

              <!-- Speaking Presentation Pitch Script -->
              <div class="blueprint-script-box">
                <span style="font-size:0.85rem; color:var(--amber-gold); font-weight:800; display:block; margin-bottom:6px;">🗣️ INVENTOR'S PITCH SCRIPT:</span>
                "${pitchScript}"
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
              <button class="hud-btn primary" style="padding:14px; justify-content:center; font-size:1.1rem;" onclick="window.inventorAudio.speak('${pitchScript.replace(/'/g, "\\'")}')">
                🔊 Read Pitch Script Aloud
              </button>

              <button class="btn-launch-large" style="justify-content:center;" onclick="window.inventorApp.nextStage()">
                <span>PROCEED TO CLASSROOM PITCH & CEREMONY</span> 🏆
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // ----------------------------------------------------
    // STAGE 9: CLASSROOM PITCH, AWARDS & GRADUATION
    // ----------------------------------------------------
    renderStage9(container, state) {
      const awards = INVENTOR_DATA.pitchAwards;
      const votes = state.pitchVotes || {};
      const rules = INVENTOR_DATA.goldenRules;

      container.innerHTML = `
        <div class="stage-header">
          <div class="stage-badge">🏆 STAGE 9: INVENTOR GRADUATION</div>
          <h1 class="stage-title">Junior Inventor Certification Ceremony!</h1>
          <p class="stage-subtitle">Present your inventions, vote on classroom awards, and receive your Master Inventor Badge!</p>
        </div>

        <div class="graduation-hero">
          <!-- Classroom Pitch Award Voting -->
          <div style="background:var(--bg-surface); border:2px solid var(--border-glow); border-radius:var(--radius-xl); padding:28px; width:100%;">
            <h3 style="color:#38bdf8; font-size:1.35rem; font-weight:900; margin-bottom:16px;">
              🗳️ CLASSROOM INVENTOR AWARDS
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px;">
              ${awards.map(aw => `
                <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; text-align:center;">
                  <div style="font-size:2.2rem; margin-bottom:6px;">${aw.icon}</div>
                  <h4 style="font-size:1rem; color:#ffffff; margin-bottom:8px;">${aw.title}</h4>
                  <div style="font-size:1.5rem; font-weight:900; color:var(--amber-gold); margin-bottom:8px;">
                    ${votes[aw.id] || 0} Votes
                  </div>
                  <button class="hud-btn" style="width:100%; justify-content:center; padding:6px;" onclick="window.inventorApp.votePitchAward('${aw.id}')">
                    +1 Vote
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Master Inventor Badge Card -->
          <div class="badge-diploma-card">
            <div class="badge-grand-icon">🏅</div>
            <h2 style="font-size:2.4rem; font-weight:900; color:#ffffff; margin-bottom:8px;">
              CERTIFIED MASTER INVENTOR
            </h2>
            <p style="font-size:1.25rem; color:#fed7aa; max-width:680px; margin:0 auto;">
              Awarded to the Junior Inventors for displaying curiosity, planning, testing, and persistence!
            </p>

            <!-- 5 Golden Rules -->
            <div class="golden-rules-list">
              ${rules.map(r => `
                <div class="golden-rule-item">
                  <span class="rule-icon">${r.icon}</span>
                  <div>
                    <div class="rule-text">${r.rule}</div>
                    <div style="font-size:0.9rem; color:var(--text-muted);">${r.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top:28px; display:flex; gap:16px; justify-content:center;">
              <button class="btn-launch-large" onclick="window.inventorAudio.playFanfare(); window.inventorApp.showToast('🎉 CONGRATULATIONS! +150 XP EARNED!')">
                <span>CELEBRATE GRADUATION</span> 🎆
              </button>
              <a href="worksheet.html" target="_blank" class="hud-btn gold" style="padding:16px 24px; font-size:1.15rem; text-decoration:none;">
                🖨️ Open Printable Notebook
              </a>
              <a href="../index.html#library" class="hud-btn" style="padding:16px 24px; font-size:1.15rem; text-decoration:none;">
                📚 Return to Library
              </a>
            </div>
          </div>
        </div>
      `;
    }
  };

  root.inventorScenes = scenes;

})(typeof window !== 'undefined' ? window : this);
