/**
 * TIME MACHINE SCENE RENDERERS (14 SCREENS)
 * High-Resolution Vector Visuals, Smart Board Touch Stages, Steampunk Clockwork
 */

(function(root) {
  'use strict';

  class TimeMachineScenes {
    constructor(app) {
      this.app = app;
      this.data = root.TIME_MACHINE_DATA;
    }

    // =========================================================================
    // SCREEN 1: THE TIME MACHINE
    // =========================================================================
    renderScreen1(container) {
      const d = this.data.screen1;
      const isSpinning = this.app.state.clockSpinning;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h1 class="scene-main-title">⏰ ${d.title}</h1>
            <p class="scene-subtitle">"${d.subtitle}"</p>
          </div>

          <!-- Giant Victorian Clock Art -->
          <div style="position:relative; width:280px; height:280px; margin:10px auto 24px auto;">
            <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="clockFaceGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fef08a"/>
                  <stop offset="70%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#78350f"/>
                </radialGradient>
                <linearGradient id="gearBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fcd34d"/>
                  <stop offset="100%" stop-color="#b45309"/>
                </linearGradient>
              </defs>

              <!-- Outer Brass Rim with Filigree -->
              <circle cx="100" cy="100" r="95" fill="#0f172a" stroke="url(#gearBrass)" stroke-width="6"/>
              <circle cx="100" cy="100" r="86" fill="url(#clockFaceGrad)" stroke="#451a03" stroke-width="2"/>

              <!-- Clock Numerals -->
              <g font-family="serif" font-weight="900" font-size="13" fill="#451a03" text-anchor="middle" dominant-baseline="middle">
                <text x="100" y="28">XII</text>
                <text x="172" y="100">III</text>
                <text x="100" y="172">VI</text>
                <text x="28" y="100">IX</text>
                <text x="136" y="38">I</text>
                <text x="162" y="64">II</text>
                <text x="162" y="136">IV</text>
                <text x="136" y="162">V</text>
                <text x="64" y="162">VII</text>
                <text x="38" y="136">VIII</text>
                <text x="38" y="64">X</text>
                <text x="64" y="38">XI</text>
              </g>

              <!-- Clock Hands (Rotatable) -->
              <g id="clock-hands-group" class="${isSpinning ? 'clock-reverse-spin' : ''}" style="transform-origin: 100px 100px;">
                <!-- Hour Hand -->
                <line x1="100" y1="100" x2="100" y2="52" stroke="#1e1b4b" stroke-width="5" stroke-linecap="round"/>
                <polygon points="100,44 96,56 104,56" fill="#1e1b4b"/>
                <!-- Minute Hand -->
                <line x1="100" y1="100" x2="135" y2="100" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                <polygon points="144,100 132,96 132,104" fill="#7f1d1d"/>
              </g>

              <!-- Center Hub -->
              <circle cx="100" cy="100" r="7" fill="#1e1b4b" stroke="#fef08a" stroke-width="2"/>
            </svg>
          </div>

          <div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">
            <div style="background:rgba(15,23,42,0.85); border:1.5px solid rgba(255,255,255,0.15); border-radius:30px; padding:8px 20px; font-weight:800; font-size:1.05rem; color:#38bdf8;">
              👧 Alice &nbsp;·&nbsp; 🐇 White Rabbit &nbsp;·&nbsp; 🕰️ Time Machine
            </div>
          </div>

          <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.startMachineCountdown()">
            <span>${d.btnStart}</span>
          </button>

          <div style="margin-top:20px; font-size:1rem; color:#94a3b8; font-weight:700;">
            Teacher: "${d.teacherPrompt}" &nbsp;·&nbsp; Students: <span style="color:#fef08a;">"${d.studentResponse}"</span>
          </div>

          ${this.app.state.countdownActive ? `
            <div class="tm-countdown-overlay">
              <div style="font-size:1.8rem; font-weight:900; color:#f59e0b; letter-spacing:2px; margin-bottom:12px;">
                ⚠️ ${d.countdownText}
              </div>
              <div class="countdown-digits">
                ${this.app.state.countdownNumber}
              </div>
              <div style="font-size:1.5rem; color:#38bdf8; font-weight:800; margin-top:16px;">
                🌀 SPINNING BACKWARD INTO YESTERDAY...
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 2: NOW OR YESTERDAY? (Warm-Up Portals)
    // =========================================================================
    renderScreen2(container) {
      const d = this.data.screen2;
      const qIdx = this.app.state.nowYesterdayIndex || 0;
      const q = d.questions[qIdx] || d.questions[0];
      const feedback = this.app.state.nowYesterdayFeedback;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🔵 ${d.title} 🟡</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="background:var(--tm-bg-card); border:2.5px solid rgba(255,255,255,0.15); border-radius:var(--tm-radius-lg); padding:28px; width:100%; max-width:850px; text-align:center; box-shadow:var(--tm-shadow); margin-bottom:16px;">
            <div style="font-size:0.9rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">
              Sentence ${qIdx + 1} of ${d.questions.length}
            </div>
            <div style="font-family:var(--tm-font-display); font-size:clamp(1.6rem, 3.2vw, 2.3rem); font-weight:900; color:#ffffff; margin-bottom:14px;">
              "${q.text}"
            </div>
            <button type="button" class="hud-btn" style="padding:6px 14px; font-size:0.9rem;" onclick="window.timeMachineApp.speak('${q.text}')">
              🔊 Hear Sentence
            </button>
          </div>

          ${feedback ? `
            <div style="background:rgba(245,158,11,0.25); border:2px solid #f59e0b; border-radius:30px; padding:10px 24px; font-weight:900; font-size:1.15rem; color:#fef08a; margin-bottom:16px; animation:sceneFadeIn 0.2s ease;">
              ${feedback}
            </div>
          ` : ''}

          <div class="portals-container">
            <!-- Portal 1: NOW -->
            <div class="portal-button portal-now" onclick="window.timeMachineApp.answerNowYesterday('now')">
              <div style="font-size:3.5rem; margin-bottom:8px;">🔵</div>
              <div style="font-family:var(--tm-font-display); font-size:2rem; font-weight:900; color:#38bdf8;">
                NOW
              </div>
              <div style="font-size:0.9rem; font-weight:700; color:#94a3b8; margin-top:4px;">
                Today · Right now
              </div>
            </div>

            <!-- Portal 2: YESTERDAY -->
            <div class="portal-button portal-yesterday" onclick="window.timeMachineApp.answerNowYesterday('yesterday')">
              <div style="font-size:3.5rem; margin-bottom:8px;">🟡</div>
              <div style="font-family:var(--tm-font-display); font-size:2rem; font-weight:900; color:#f59e0b;">
                YESTERDAY
              </div>
              <div style="font-size:0.9rem; font-weight:700; color:#cbd5e1; margin-top:4px;">
                The Past · Completed
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 3: THE PAST SIMPLE MACHINE (Transformation)
    // =========================================================================
    renderScreen3(container) {
      const d = this.data.screen3;
      const transformed = this.app.state.transformedVerbs || {};

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">⚙️ ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div class="machine-transformer-box">
            <!-- Conveyor & Brass Machine Graphic -->
            <div style="background:linear-gradient(135deg, #1e1b4b, #0f172a); border:2px solid #f59e0b; border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:2.4rem;">⚙️</span>
                <div>
                  <div style="font-family:var(--tm-font-display); font-size:1.15rem; font-weight:900; color:#fef08a;">
                    VERB TRANSFORMER ENGINE
                  </div>
                  <div style="font-size:0.85rem; color:#94a3b8;">
                    ${d.conceptBanner}
                  </div>
                </div>
              </div>

              <div style="display:flex; gap:8px;">
                <span class="type-pill-regular">🟢 Regular: +ed</span>
                <span class="type-pill-irregular">🔵 Irregular: Special</span>
              </div>
            </div>

            <!-- Verb Cards Shelf -->
            <div class="verb-cards-shelf">
              ${d.verbs.map(v => {
                const isDone = Boolean(transformed[v.id]);
                return `
                  <div class="verb-transformer-card ${isDone ? 'is-transformed' : ''}"
                       onclick="window.timeMachineApp.transformVerb('${v.id}')">
                    <div style="font-size:2rem; margin-bottom:4px;">${v.icon}</div>
                    <div style="font-size:1.1rem; font-weight:900; color:${isDone ? '#fef08a' : '#ffffff'};">
                      ${isDone ? `${v.base} ➔ ${v.past}` : v.base}
                    </div>
                    <span class="${v.type === 'regular' ? 'type-pill-regular' : 'type-pill-irregular'}">
                      ${v.type === 'regular' ? '🟢 +ed' : '🔵 Special'}
                    </span>
                    <div style="font-size:0.75rem; color:#94a3b8; margin-top:6px;">
                      ${isDone ? '✓ Transformed' : 'Tap to transform'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <button type="button" class="hud-btn" onclick="window.timeMachineApp.transformAllVerbs()">
                ⚡ Transform All
              </button>
              <button type="button" class="hud-btn primary" style="padding:10px 24px; font-size:1.05rem;" onclick="window.timeMachineApp.nextScreen()">
                ALICE'S STORY ➔
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 4: BUILD ALICE'S STORY (Sequencing)
    // =========================================================================
    renderScreen4(container) {
      const d = this.data.screen4;
      const placed = this.app.state.storyPlacedOrder || [];
      const isComplete = placed.length === d.correctOrder.length;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🧩 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Target Sequence Slots -->
          <div style="background:rgba(15,23,42,0.8); border:2px dashed rgba(245,158,11,0.4); border-radius:var(--tm-radius-lg); padding:18px; width:100%; max-width:1150px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:0.95rem; font-weight:800; color:#f59e0b;">
                STORY TIMELINE (CHRONOLOGICAL ORDER)
              </span>
              <span style="font-size:0.85rem; color:#cbd5e1; font-weight:700;">
                ${placed.length} of ${d.correctOrder.length} placed
              </span>
            </div>

            <div class="sequencer-slots-grid">
              ${d.correctOrder.map((cardId, slotIdx) => {
                const isSlotFilled = slotIdx < placed.length;
                const card = isSlotFilled ? d.cards.find(c => c.id === placed[slotIdx]) : null;
                return `
                  <div class="story-card-box ${isSlotFilled ? 'is-placed' : ''}" style="${!isSlotFilled ? 'border-style:dashed; opacity:0.6;' : ''}">
                    <div style="font-size:0.85rem; font-weight:800; color:#38bdf8; margin-bottom:4px;">
                      Step ${slotIdx + 1}
                    </div>
                    ${card ? `
                      <div style="font-size:2.2rem; margin:4px 0;">${card.icon}</div>
                      <div style="font-size:1rem; font-weight:900; color:#fef08a;">${card.sentence}</div>
                      <button type="button" class="hud-btn" style="padding:4px 10px; font-size:0.75rem; margin-top:6px;" onclick="window.timeMachineApp.speak('${card.audio}')">
                        🔊 Listen
                      </button>
                    ` : `
                      <div style="font-size:1.8rem; margin:16px 0; color:#64748b;">⏳</div>
                      <div style="font-size:0.85rem; color:#94a3b8;">Waiting for card...</div>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Cards Available to Tap/Place -->
          ${!isComplete ? `
            <div style="width:100%; max-width:1150px;">
              <div style="font-size:0.9rem; font-weight:800; color:#38bdf8; margin-bottom:10px;">
                👇 Tap the NEXT event in the story:
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                ${d.cards.filter(c => !placed.includes(c.id)).map(card => `
                  <button type="button" class="hud-btn" style="padding:10px 18px; font-size:1rem; min-height:54px;" onclick="window.timeMachineApp.placeStoryCard('${card.id}')">
                    <span style="font-size:1.4rem;">${card.icon}</span>
                    <span>${card.title}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <div style="display:flex; gap:12px; align-items:center;">
              <button type="button" class="hud-btn" onclick="window.timeMachineApp.resetStorySequence()">
                🔄 Reset Order
              </button>
              <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
                <span>STORY COMPLETE! NEXT ➔</span>
              </button>
            </div>
          `}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 5: COMPLETE THE MAGIC SENTENCE
    // =========================================================================
    renderScreen5(container) {
      const d = this.data.screen5;
      const idx = this.app.state.magicSentenceIndex || 0;
      const c = d.challenges[idx] || d.challenges[0];
      const isLevelB = this.app.state.difficultyLevel === 'B';
      const feedback = this.app.state.magicSentenceFeedback;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">✨ ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="background:var(--tm-bg-card); border:3px solid rgba(245,158,11,0.4); border-radius:var(--tm-radius-lg); padding:32px; width:100%; max-width:850px; text-align:center; box-shadow:var(--tm-shadow);">
            <div style="font-size:4.5rem; margin-bottom:8px; filter:drop-shadow(0 0 15px rgba(245,158,11,0.5));">
              ${c.icon}
            </div>

            <div style="font-size:0.9rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:8px;">
              Sentence ${idx + 1} of ${d.challenges.length}
            </div>

            <!-- Incomplete Sentence Display -->
            <div style="font-family:var(--tm-font-display); font-size:clamp(1.7rem, 3.5vw, 2.5rem); font-weight:900; color:#ffffff; margin:16px 0;">
              ${c.sentenceStart} <span style="color:#f59e0b; text-decoration:underline; padding:0 8px;">______</span> ${c.sentenceEnd}
            </div>

            ${isLevelB ? `
              <div style="background:rgba(168,85,247,0.2); border:1.5px dashed #a855f7; border-radius:12px; padding:12px; margin:16px 0; font-size:1.1rem; color:#e9d5ff; font-weight:800;">
                🎯 LEVEL B CHALLENGE: Say the sentence aloud before tapping!
              </div>
            ` : ''}

            ${feedback ? `
              <div style="font-size:1.2rem; font-weight:900; color:#fef08a; margin:14px 0;">
                ${feedback}
              </div>
            ` : ''}

            <!-- Large Choice Buttons -->
            <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
              ${c.choices.map(choice => `
                <button type="button" class="hud-btn" style="padding:16px 36px; font-size:1.4rem; min-height:64px; border-width:2.5px;"
                        onclick="window.timeMachineApp.chooseSentenceVerb('${choice}')">
                  ${choice}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 6: VERB HUNT (5 Hidden Past Verbs)
    // =========================================================================
    renderScreen6(container) {
      const d = this.data.screen6;
      const found = this.app.state.foundHuntVerbs || [];
      const allFound = found.length >= d.items.length;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🔍 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; max-width:950px; margin-bottom:10px;">
            <div style="font-size:1.1rem; font-weight:900; color:#fef08a;">
              VERBS FOUND: ${found.length} / ${d.items.length}
            </div>
            ${allFound ? `
              <span style="font-size:1.1rem; font-weight:900; color:#10b981; animation:sceneFadeIn 0.3s ease;">
                🎉 TIME DETECTIVE!
              </span>
            ` : `
              <span style="font-size:0.9rem; color:#94a3b8; font-weight:700;">
                Look closely in the trees and flowers!
              </span>
            `}
          </div>

          <!-- Interactive Forest Scene -->
          <div class="verb-hunt-forest">
            <!-- Background Trees & Door SVG Art -->
            <svg viewBox="0 0 950 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:absolute; inset:0; pointer-events:none;">
              <!-- Deep Forest Canopy -->
              <path d="M 0 0 L 950 0 L 950 320 Q 700 240 475 300 Q 250 240 0 320 Z" fill="#0c1630" opacity="0.6"/>
              <!-- Ancient Tree Trunks -->
              <path d="M 120 480 Q 140 280 180 100 Q 220 280 240 480 Z" fill="#0f172a"/>
              <path d="M 700 480 Q 730 260 760 80 Q 800 260 840 480 Z" fill="#0f172a"/>
              <!-- Magical Door Frame -->
              <path d="M 680 480 C 680 340 760 340 760 480 Z" fill="#451a03" stroke="#f59e0b" stroke-width="4"/>
              <!-- Steaming Teapot on Table -->
              <ellipse cx="800" cy="220" rx="40" ry="24" fill="#312e81" stroke="#a855f7" stroke-width="2"/>
            </svg>

            <!-- 5 Hidden Verb Pins -->
            ${d.items.map(item => {
              const isFound = found.includes(item.id);
              return `
                <div class="hidden-verb-pin ${isFound ? 'is-found' : ''}"
                     style="left:${item.x}%; top:${item.y}%;"
                     onclick="window.timeMachineApp.discoverHuntVerb('${item.id}')"
                     title="${item.clue}">
                  <span>${item.icon}</span> ${item.verb}
                </div>
              `;
            }).join('')}
          </div>

          <div style="margin-top:20px;">
            ${allFound ? `
              <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
                <span>HATTER'S TEA PARTY ➔</span>
              </button>
            ` : `
              <button type="button" class="hud-btn" onclick="window.timeMachineApp.revealAllHuntVerbs()">
                💡 Reveal Clues
              </button>
            `}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 7: MAD HATTER'S STORY HAS A LIE
    // =========================================================================
    renderScreen7(container) {
      const d = this.data.screen7;
      const lieFound = this.app.state.madHatterLieFound;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Mad Hatter Dialogue Speech Bubble -->
          <div style="background:rgba(15,23,42,0.9); border:2.5px solid #f59e0b; border-radius:18px; padding:18px 24px; display:flex; align-items:center; gap:16px; width:100%; max-width:820px; box-shadow:var(--tm-shadow);">
            <div style="font-size:3.5rem; flex-shrink:0;">🎩</div>
            <div>
              <div style="font-family:var(--tm-font-display); font-size:1.15rem; font-weight:900; color:#fef08a;">
                MAD HATTER SAYS:
              </div>
              <div style="font-size:1.05rem; color:#ffffff; font-style:italic;">
                "${d.hatterQuote}"
              </div>
            </div>
          </div>

          <!-- 5 Statements Stack -->
          <div class="lie-statements-stack">
            ${d.statements.map(s => {
              const isMarked = s.isLie && lieFound;
              return `
                <div class="lie-card-row ${isMarked ? 'is-lie-found' : ''}"
                     onclick="window.timeMachineApp.checkHatterLie('${s.id}')">
                  <div style="display:flex; align-items:center; gap:14px;">
                    <span style="font-size:1.8rem;">${s.icon}</span>
                    <span style="font-size:1.25rem; font-weight:800; color:${isMarked ? '#fef08a' : '#ffffff'};">
                      ${s.text}
                    </span>
                  </div>
                  <div style="font-size:1rem; font-weight:900; color:${isMarked ? '#e11d48' : '#94a3b8'};">
                    ${isMarked ? '🤥 THE LIE!' : 'True or Lie?'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          ${lieFound ? `
            <div style="margin-top:24px; text-align:center; animation:sceneFadeIn 0.3s ease;">
              <div style="font-size:1.25rem; font-weight:900; color:#fef08a; margin-bottom:14px;">
                🎉 YES! HATS ARE FOR WEARING, NOT EATING! 🎩😂
              </div>
              <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
                <span>MAKE YOUR OWN LIE ➔</span>
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 8: MAKE YOUR OWN LIE
    // =========================================================================
    renderScreen8(container) {
      const d = this.data.screen8;
      const drawnCards = this.app.state.ownLieDrawnCards || [];
      const isLevelB = this.app.state.difficultyLevel === 'B';

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🤥 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- 3 Drawn Cards Row -->
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom:20px; width:100%; max-width:900px;">
            ${drawnCards.map((c, i) => `
              <div style="background:var(--tm-bg-card); border:2.5px solid #38bdf8; border-radius:var(--tm-radius-md); padding:20px; text-align:center; flex:1; min-width:180px; box-shadow:var(--tm-shadow);">
                <div style="font-size:3.5rem; margin-bottom:6px;">${c.icon}</div>
                <div style="font-size:1.2rem; font-weight:900; color:#fef08a;">${c.name}</div>
                <div style="font-size:0.85rem; color:#94a3b8; margin-top:4px;">"${c.sample}"</div>
              </div>
            `).join('')}
          </div>

          <!-- Sentence Support Frames -->
          <div style="background:rgba(15,23,42,0.9); border:2px solid rgba(255,255,255,0.15); border-radius:var(--tm-radius-md); padding:20px; width:100%; max-width:850px; margin-bottom:24px;">
            <div style="font-size:0.9rem; font-weight:800; color:#f59e0b; text-transform:uppercase; margin-bottom:8px;">
              💡 Speaking Support Frames:
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${(isLevelB ? d.supportFrames.levelB : d.supportFrames.levelA).map(frame => `
                <div style="font-size:1.25rem; font-weight:900; color:#ffffff;">
                  • " ${frame} "
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Class Voting Controls -->
          <div style="display:flex; gap:16px; justify-content:center; align-items:center; flex-wrap:wrap;">
            <button type="button" class="hud-btn" onclick="window.timeMachineApp.drawRandomLieCards()">
              🎲 Roll 3 New Cards
            </button>
            <button type="button" class="hud-btn" style="background:#065f46; border-color:#10b981; font-size:1.1rem; padding:12px 24px;" onclick="window.timeMachineApp.voteLie('true')">
              🤔 CLASS SAYS: TRUE!
            </button>
            <button type="button" class="hud-btn" style="background:#881337; border-color:#e11d48; font-size:1.1rem; padding:12px 24px;" onclick="window.timeMachineApp.voteLie('lie')">
              🤥 CLASS SAYS: LIE!
            </button>
            <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
              <span>ACT THE PAST ➔</span>
            </button>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 9: ACT THE PAST (TPR Theatre)
    // =========================================================================
    renderScreen9(container) {
      const d = this.data.screen9;
      const actIdx = this.app.state.tprIndex || 0;
      const act = d.actions[actIdx] || d.actions[0];

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="background:var(--tm-bg-card); border:3.5px solid #f59e0b; border-radius:var(--tm-radius-lg); padding:36px; width:100%; max-width:850px; text-align:center; box-shadow:var(--tm-shadow); margin-bottom:20px;">
            <div style="font-size:0.95rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:8px;">
              Action ${actIdx + 1} of ${d.actions.length}
            </div>

            <div style="font-size:5rem; margin-bottom:12px;">${act.icon || '🏃'}</div>

            <div style="font-family:var(--tm-font-display); font-size:2.6rem; font-weight:900; color:#fef08a; margin-bottom:8px;">
              ${act.prompt}
            </div>

            <div style="font-size:1.5rem; font-weight:800; color:#ffffff; margin-bottom:18px;">
              "${act.cue}"
            </div>

            <button type="button" class="hud-btn" style="padding:8px 18px; font-size:1rem;" onclick="window.timeMachineApp.speak('${act.speech}')">
              🔊 Hear Action Cue
            </button>
          </div>

          <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextTprAction()">
            <span>${actIdx + 1 >= d.actions.length ? 'SOLVE THE CASE ➔' : 'NEXT ACTION ➔'}</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 10: WHAT HAPPENED IN WONDERLAND? (Detective Board)
    // =========================================================================
    renderScreen10(container) {
      const d = this.data.screen10;
      const answers = this.app.state.detectiveAnswers || {};
      const allDone = Object.keys(answers).length >= d.clues.length;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:900px; margin-bottom:24px;">
            ${d.clues.map((clue, i) => {
              const userAns = answers[clue.id];
              const isCorrect = userAns === clue.correct;
              return `
                <div style="background:rgba(15,23,42,0.9); border:2px solid ${isCorrect ? '#10b981' : 'rgba(255,255,255,0.15)'}; border-radius:var(--tm-radius-md); padding:16px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                  <div style="display:flex; align-items:center; gap:14px;">
                    <span style="font-size:2rem;">${clue.photo}</span>
                    <div>
                      <div style="font-size:0.8rem; font-weight:800; color:#38bdf8;">${clue.label}</div>
                      <div style="font-size:1.25rem; font-weight:900; color:#ffffff;">
                        ${isCorrect ? clue.feedback : clue.sentence}
                      </div>
                    </div>
                  </div>

                  <div style="display:flex; gap:8px;">
                    ${clue.options.map(opt => `
                      <button type="button" class="hud-btn ${userAns === opt ? (isCorrect ? 'primary' : '') : ''}"
                              style="padding:8px 16px; font-size:1rem;"
                              onclick="window.timeMachineApp.answerDetectiveClue('${clue.id}', '${opt}')">
                        ${opt}
                      </button>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          ${allDone ? `
            <div style="text-align:center; animation:sceneFadeIn 0.3s ease;">
              <div style="font-size:1.8rem; font-weight:900; color:#fef08a; margin-bottom:14px;">
                🕵️ CASE SOLVED! ALL PAST VERBS VERIFIED!
              </div>
              <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
                <span>FIGHT THE TIME MONSTER ➔</span>
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 11: PAST SIMPLE BOSS BATTLE
    // =========================================================================
    renderScreen11(container) {
      const d = this.data.screen11;
      const roundIdx = this.app.state.bossRoundIndex || 0;
      const isBossDefeated = roundIdx >= d.rounds.length;
      const round = !isBossDefeated ? d.rounds[roundIdx] : null;

      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Boss Health Bar -->
          <div class="boss-health-bar">
            ${Array.from({ length: d.totalGems }).map((_, i) => `
              <div class="boss-gem ${i < roundIdx ? 'is-broken' : ''}"></div>
            `).join('')}
          </div>

          <!-- Friendly Clock Monster SVG -->
          <div style="width:200px; height:200px; margin:0 auto 16px auto;">
            <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <!-- Monster Clock Body -->
              <rect x="35" y="40" width="130" height="130" rx="25" fill="#312e81" stroke="#f59e0b" stroke-width="4"/>
              <!-- Googly Eyes -->
              <circle cx="75" cy="85" r="18" fill="#ffffff"/>
              <circle cx="77" cy="87" r="8" fill="#0f172a"/>
              <circle cx="125" cy="85" r="18" fill="#ffffff"/>
              <circle cx="123" cy="87" r="8" fill="#0f172a"/>
              <!-- Monster Smile with Cute Cuckoo Tongue -->
              <path d="M 70 125 Q 100 155 130 125" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
              <ellipse cx="100" cy="138" rx="8" ry="10" fill="#e11d48"/>
              <!-- Cuckoo Wings -->
              <path d="M 35 70 Q 10 90 35 110 Z" fill="#8b5cf6"/>
              <path d="M 165 70 Q 190 90 165 110 Z" fill="#8b5cf6"/>
              <!-- Clock Pendulum -->
              <line x1="100" y1="170" x2="100" y2="195" stroke="#f59e0b" stroke-width="4"/>
              <circle cx="100" cy="195" r="8" fill="#f59e0b"/>
            </svg>
          </div>

          ${!isBossDefeated ? `
            <div style="background:var(--tm-bg-card); border:2.5px solid #38bdf8; border-radius:var(--tm-radius-lg); padding:24px; width:100%; max-width:700px; text-align:center; box-shadow:var(--tm-shadow);">
              <div style="font-size:0.9rem; font-weight:800; color:#38bdf8; margin-bottom:6px;">
                Round ${roundIdx + 1} of ${d.rounds.length}
              </div>
              <div style="font-family:var(--tm-font-display); font-size:2.8rem; font-weight:900; color:#ffffff; margin-bottom:16px;">
                ${round.icon} ${round.base} ➔ ?
              </div>

              <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                ${round.options.map(opt => `
                  <button type="button" class="hud-btn" style="padding:14px 28px; font-size:1.3rem; min-height:60px;"
                          onclick="window.timeMachineApp.answerBossRound('${opt}')">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <div style="text-align:center; animation:sceneFadeIn 0.3s ease;">
              <div style="font-size:2.2rem; font-weight:900; color:#fef08a; margin-bottom:16px;">
                🎉 TIME MACHINE SAVED! THE MONSTER IS HAPPY!
              </div>
              <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
                <span>ORAL STORY CHALLENGE ➔</span>
              </button>
            </div>
          `}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 12: FINAL STORY CHALLENGE (Oral Storytelling)
    // =========================================================================
    renderScreen12(container) {
      const d = this.data.screen12;
      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">📖 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- 6 Milestones Path -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; width:100%; max-width:1050px; margin-bottom:24px;">
            ${d.pathItems.map((item, i) => `
              <div style="background:var(--tm-bg-card); border:2px solid #f59e0b; border-radius:var(--tm-radius-md); padding:16px 10px; text-align:center;">
                <div style="font-size:0.75rem; font-weight:800; color:#38bdf8; margin-bottom:4px;">#${i + 1}</div>
                <div style="font-size:2.5rem; margin-bottom:6px;">${item.icon}</div>
                <div style="font-size:0.95rem; font-weight:900; color:#fef08a;">${item.prompt}</div>
              </div>
            `).join('')}
          </div>

          <!-- Sentence Starters Box -->
          <div style="background:rgba(15,23,42,0.9); border:2px solid rgba(255,255,255,0.15); border-radius:var(--tm-radius-md); padding:20px; width:100%; max-width:850px; margin-bottom:24px;">
            <div style="font-size:0.9rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:8px;">
              🗣️ Student Spoken Sentence Sequence:
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${d.sentenceStarters.map(s => `
                <div style="font-size:1.15rem; font-weight:800; color:#ffffff;">
                  • "${s}"
                </div>
              `).join('')}
            </div>
          </div>

          <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
            <span>THEATRE STAGE ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 13: THEATRE CONNECTION
    // =========================================================================
    renderScreen13(container) {
      const d = this.data.screen13;
      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🎭 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Theatre Stage Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; width:100%; max-width:1050px; margin-bottom:24px;">
            ${d.characters.map(c => `
              <div style="background:rgba(15,23,42,0.9); border:2px solid ${c.color}; border-radius:var(--tm-radius-md); padding:16px; display:flex; align-items:center; gap:14px; cursor:pointer;"
                   onclick="window.timeMachineApp.speak('${c.name}: ${c.line}')">
                <span style="font-size:2.5rem;">${c.icon}</span>
                <div>
                  <div style="font-size:0.85rem; font-weight:900; color:${c.color};">${c.name}</div>
                  <div style="font-size:1.15rem; font-weight:900; color:#ffffff;">"${c.line}"</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="font-family:var(--tm-font-display); font-size:1.35rem; font-weight:900; color:#fef08a; margin-bottom:20px; text-align:center;">
            ${d.callToAction}
          </div>

          <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.nextScreen()">
            <span>WORKSHOP TEASER ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 14: WORKSHOP TEASER
    // =========================================================================
    renderScreen14(container) {
      const d = this.data.screen14;
      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🧰 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Mystery Chest SVG -->
          <div style="width:240px; height:180px; margin:0 auto 20px auto;">
            <svg viewBox="0 0 200 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="60" width="150" height="90" rx="10" fill="#78350f" stroke="#f59e0b" stroke-width="3"/>
              <path d="M 20 65 Q 100 20 180 65 Z" fill="#b45309" stroke="#f59e0b" stroke-width="3"/>
              <circle cx="100" cy="95" r="14" fill="#f59e0b"/>
              <circle cx="100" cy="92" r="4" fill="#000"/>
              <polygon points="98,94 102,94 101,104 99,104" fill="#000"/>
            </svg>
          </div>

          <!-- 9 Prop Silhouettes Grid -->
          <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; max-width:700px; margin-bottom:24px;">
            ${d.props.map(p => `
              <div style="background:rgba(30,41,59,0.7); border:1.5px dashed rgba(245,158,11,0.5); border-radius:10px; padding:10px 14px; font-size:1.8rem;" title="${p.name}">
                ${p.icon}
              </div>
            `).join('')}
          </div>

          <div style="background:rgba(15,23,42,0.9); border:2px solid #8b5cf6; border-radius:var(--tm-radius-md); padding:16px 28px; text-align:center; margin-bottom:24px;">
            <div style="font-size:0.9rem; font-weight:800; color:#a855f7; text-transform:uppercase;">
              ${d.nextLessonTitle}
            </div>
            <div style="font-size:1.3rem; font-weight:900; color:#ffffff; margin-top:4px;">
              ${d.workshopTeaser}
            </div>
          </div>

          <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.renderCelebration()">
            <span>CLAIM TIME TRAVEL REWARD 🏆</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // FINAL CELEBRATION REWARD SCREEN
    // =========================================================================
    renderCelebration(container) {
      const d = this.data.celebration;
      container.innerHTML = `
        <div class="tm-scene-wrap">
          <div style="background:radial-gradient(circle at center, #1e1b4b, #090d1a); border:3.5px solid #f59e0b; border-radius:var(--tm-radius-lg); padding:48px 36px; max-width:850px; width:100%; text-align:center; box-shadow:var(--tm-shadow);">
            <div style="font-size:6rem; margin-bottom:12px; filter:drop-shadow(0 0 30px rgba(245,158,11,0.7));">
              🏆
            </div>

            <h1 style="font-family:var(--tm-font-display); font-size:2.8rem; font-weight:900; color:#fef08a; margin-bottom:6px;">
              ${d.title}
            </h1>

            <p style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:18px;">
              "${d.subtitle}"
            </p>

            <div style="display:inline-flex; align-items:center; gap:10px; background:rgba(245,158,11,0.2); border:2px solid #f59e0b; border-radius:30px; padding:8px 24px; font-size:1.4rem; font-weight:900; color:#fef08a; margin-bottom:28px;">
              ⭐ +${d.bonusXp} BONUS WONDERLAND XP!
            </div>

            <!-- Past Verbs Recap -->
            <div style="background:rgba(15,23,42,0.9); border:2px dashed #38bdf8; border-radius:var(--tm-radius-md); padding:20px; max-width:700px; margin:0 auto 28px auto;">
              <div style="font-size:0.9rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:8px;">
                ⏰ TIME TRAVEL PAST VERBS MASTERED:
              </div>
              <div style="font-family:var(--tm-font-display); font-size:1.4rem; font-weight:900; color:#ffffff; line-height:1.6;">
                ${d.verbsRecap.join(' · ')}
              </div>
            </div>

            <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
              <a href="../index.html#library" class="hud-btn" style="padding:14px 28px; font-size:1.1rem; background:rgba(255,255,255,0.1);">
                📚 Back to Library
              </a>
              <button type="button" class="tm-btn-giant" onclick="window.timeMachineApp.restartLesson()">
                <span>🔄 Replay Lesson 2</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // TEACHER OBSERVATION MODAL
    // =========================================================================
    renderTeacherModal(container) {
      const g = this.data.teacherGuides[this.app.currentScreen] || this.data.teacherGuides[1];
      const rubric = this.app.state.rubric || {};

      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid rgba(245,158,11,0.3); padding-bottom:10px;">
          <div>
            <h3 style="font-size:1.35rem; color:#f59e0b; font-weight:900; margin:0;">
              🧑‍🏫 Teacher Guide &amp; Observation · Screen ${this.app.currentScreen}
            </h3>
            <span style="font-size:0.85rem; color:#38bdf8; font-weight:700;">Timing: ${g.timing}</span>
          </div>
          <button type="button" class="hud-btn" onclick="window.timeMachineApp.closeTeacherDrawer()">✕ Close</button>
        </div>

        <!-- Screen Fast Jumps (S1 to S14) -->
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px;">
          ${Array.from({ length: 14 }).map((_, i) => {
            const num = i + 1;
            return `
              <button type="button" class="hud-btn ${num === this.app.currentScreen ? 'primary' : ''}" style="padding:6px 12px; font-size:0.85rem;"
                      onclick="window.timeMachineApp.renderScreen(${num}); window.timeMachineApp.openTeacherDrawer();">
                S${num}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 4 Pedagogical Tiles -->
        <div class="teacher-grid-guides" style="margin-bottom:20px;">
          <div class="teacher-guide-tile">
            <h4>🎯 Pedagogical Objective</h4>
            <p>${g.objective}</p>
          </div>
          <div class="teacher-guide-tile">
            <h4>🗣️ Teacher Spoken Script</h4>
            <p style="color:#fef08a; font-style:italic;">${g.teacherScript}</p>
          </div>
          <div class="teacher-guide-tile">
            <h4>🏃 Student Physical Action</h4>
            <p>${g.studentAction}</p>
          </div>
          <div class="teacher-guide-tile">
            <h4>📱 Smart Board Tip</h4>
            <p>${g.boardTip}</p>
          </div>
        </div>

        <!-- Observation Checklist Rubric -->
        <div style="background:rgba(30,41,59,0.8); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:16px; margin-bottom:16px;">
          <h4 style="font-size:0.95rem; color:#f59e0b; font-weight:900; margin-bottom:10px; text-transform:uppercase;">
            📋 Teacher Observation Checklist (Grade 3 A1)
          </h4>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.recognizesVerbs ? 'checked' : ''} onchange="window.timeMachineApp.toggleRubric('recognizesVerbs')">
            <span>Recognizes target past verbs (went, saw, opened, found, met)</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.understandsYesterday ? 'checked' : ''} onchange="window.timeMachineApp.toggleRubric('understandsYesterday')">
            <span>Understands 'Yesterday' indicates completed past events</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.usesOrally ? 'checked' : ''} onchange="window.timeMachineApp.toggleRubric('usesOrally')">
            <span>Produces simple past simple sentences orally</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.participatesTPR ? 'checked' : ''} onchange="window.timeMachineApp.toggleRubric('participatesTPR')">
            <span>Participates actively in TPR physical theatre actions</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.tellsSequence ? 'checked' : ''} onchange="window.timeMachineApp.toggleRubric('tellsSequence')">
            <span>Can connect and tell a short chronological sequence</span>
          </label>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button type="button" class="hud-btn" onclick="window.timeMachineApp.restartLesson(); window.timeMachineApp.closeTeacherDrawer();">
            🔄 Restart Lesson
          </button>
          <a href="worksheet.html" target="_blank" class="hud-btn" style="background:#f0fdf4; color:#166534; font-weight:800;">
            🖨️ Open Companion Worksheet Dossier ➔
          </a>
        </div>
      `;
    }
  }

  root.TimeMachineScenes = TimeMachineScenes;

})(typeof window !== 'undefined' ? window : global);
