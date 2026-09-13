/**
 * YESTERDAY DETECTIVES — SCENE RENDERERS (14 INTERACTIVE STAGES)
 * Complete interactive classroom-ready game engine for Past Simple A1+.
 */

(function(root) {
  'use strict';

  const D = root.DETECTIVES_DATA;

  class DetectivesScenes {
    constructor(app) {
      this.app = app;
    }

    // =======================================================================
    // STAGE 1 — DETECTIVE INTRODUCTION
    // =======================================================================
    renderStage1() {
      return `
        <div class="detective-case-briefing">
          <div style="font-size:3.8rem; margin-bottom:8px; animation:bounce 2s infinite;">🕵️</div>
          <h1 style="font-size:2.6rem; font-weight:900; color:var(--det-gold); margin-bottom:6px; letter-spacing:-0.5px;">
            YESTERDAY DETECTIVES
          </h1>
          <h3 style="font-size:1.35rem; font-weight:700; color:#e2e8f0; margin-bottom:14px;">
            “Something strange happened yesterday…”
          </h3>
          <p style="font-size:1.05rem; color:var(--det-text-muted); max-width:650px; margin:0 auto 24px auto; line-height:1.5;">
            A secret was lost in time. Your mission as a junior detective is to investigate clues, uncover what happened yesterday, and crack the mystery of the past!
          </p>

          <!-- Interactive Crime Scene Clues -->
          <div style="font-size:0.85rem; font-weight:800; color:var(--det-gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
            🔍 Tap any clue to inspect the scene:
          </div>
          <div class="crime-scene-clues-grid">
            <div class="clue-item-card" onclick="window.detectivesApp.inspectIntroClue('glass')">
              <span style="font-size:2.2rem;">🔍</span>
              <div style="font-weight:800; margin-top:6px;">Magnifying Glass</div>
              <div style="font-size:0.75rem; color:var(--det-text-muted);">Inspect tracks</div>
            </div>
            <div class="clue-item-card" onclick="window.detectivesApp.inspectIntroClue('footprints')">
              <span style="font-size:2.2rem;">👣</span>
              <div style="font-weight:800; margin-top:6px;">Footprints</div>
              <div style="font-size:0.75rem; color:var(--det-text-muted);">Someone walked here</div>
            </div>
            <div class="clue-item-card" onclick="window.detectivesApp.inspectIntroClue('backpack')">
              <span style="font-size:2.2rem;">🎒</span>
              <div style="font-weight:800; margin-top:6px;">Lost Backpack</div>
              <div style="font-size:0.75rem; color:var(--det-text-muted);">Left behind</div>
            </div>
            <div class="clue-item-card" onclick="window.detectivesApp.inspectIntroClue('note')">
              <span style="font-size:2.2rem;">📝</span>
              <div style="font-weight:800; margin-top:6px;">Mystery Note</div>
              <div style="font-size:0.75rem; color:var(--det-text-muted);">“I ate the cake...”</div>
            </div>
            <div class="clue-item-card" onclick="window.detectivesApp.inspectIntroClue('clock')">
              <span style="font-size:2.2rem;">🕰️</span>
              <div style="font-weight:800; margin-top:6px;">Old Clock</div>
              <div style="font-size:0.75rem; color:var(--det-text-muted);">Stopped yesterday</div>
            </div>
            <div class="clue-item-card" onclick="window.detectivesApp.inspectIntroClue('photo')">
              <span style="font-size:2.2rem;">📸</span>
              <div style="font-weight:800; margin-top:6px;">Polaroid Photo</div>
              <div style="font-size:0.75rem; color:var(--det-text-muted);">Lion &amp; pizza</div>
            </div>
          </div>

          <div id="intro-clue-detail-box" style="min-height:48px; margin-bottom:24px; font-size:1.05rem; font-weight:700; color:#38bdf8;">
            Select a clue above to start your investigation notes!
          </div>

          <button type="button" class="hud-btn primary" onclick="window.detectivesApp.nextStage()" style="font-size:1.3rem; padding:14px 44px; border-radius:30px; cursor:pointer;">
            🚀 START INVESTIGATION
          </button>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 2 — VOCABULARY DISCOVERY
    // =======================================================================
    renderStage2() {
      const verbs = D.ALL_VERBS;
      return `
        <div>
          <div style="text-align:center; margin-bottom:18px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 2: Action Vocabulary Discovery
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Detectives must know their action words! Tap each verb to hear its pronunciation.
            </p>
          </div>

          <!-- Cards Grid -->
          <div class="vocab-cards-grid">
            ${verbs.map(v => `
              <div class="vocab-card" onclick="window.detectivesApp.playWordSpeech('${v.base}')">
                <span style="font-size:2.8rem; margin-bottom:6px;">${v.icon}</span>
                <div style="font-size:1.25rem; font-weight:900; color:#ffffff; text-transform:capitalize;">${v.base}</div>
                <div style="font-size:0.78rem; color:var(--det-gold); font-weight:800; margin-top:2px;">
                  ${v.type.toUpperCase()}
                </div>
                <button type="button" class="hud-btn" style="margin-top:10px; padding:3px 10px; font-size:0.75rem;" onclick="event.stopPropagation(); window.detectivesApp.playWordSpeech('${v.base}')">
                  🔊 Listen
                </button>
              </div>
            `).join('')}
          </div>

          <!-- What's the Action Mini Quiz -->
          <div class="action-quiz-card">
            <div style="font-size:0.82rem; font-weight:900; text-transform:uppercase; color:var(--det-gold); letter-spacing:1px; margin-bottom:6px;">
              ⚡ Quick Check: What's the Action?
            </div>
            <div id="quiz-action-prompt" style="font-size:1.3rem; font-weight:800; color:#ffffff; margin-bottom:12px;">
              A child eating a hot slice of pizza: 🍕
            </div>
            <div class="quiz-options-row">
              <button class="quiz-option-btn" onclick="window.detectivesApp.checkActionQuiz('play')">A. play</button>
              <button class="quiz-option-btn" onclick="window.detectivesApp.checkActionQuiz('eat')">B. eat</button>
              <button class="quiz-option-btn" onclick="window.detectivesApp.checkActionQuiz('ride')">C. ride</button>
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 3 — DISCOVER THE PAST (TIMELINE)
    // =======================================================================
    renderStage3() {
      return `
        <div>
          <div style="text-align:center; margin-bottom:20px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 3: Discover The Past
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Watch how words transform when time moves from TODAY to YESTERDAY!
            </p>
          </div>

          <!-- Animated Timeline Track -->
          <div class="timeline-track">
            <div class="timeline-box today">
              <div style="font-size:0.85rem; font-weight:800; text-transform:uppercase; color:var(--det-blue); margin-bottom:4px;">TODAY (Present)</div>
              <div id="timeline-present-verb" style="font-size:2.2rem; font-weight:900; color:#ffffff;">I play football.</div>
              <div style="font-size:2.5rem; margin-top:8px;">⚽</div>
            </div>

            <div class="timeline-arrow">➔</div>

            <div class="timeline-box yesterday">
              <div style="font-size:0.85rem; font-weight:800; text-transform:uppercase; color:var(--det-gold); margin-bottom:4px;">YESTERDAY (Past)</div>
              <div id="timeline-past-verb" style="font-size:2.2rem; font-weight:900; color:#fbbf24;">I played football.</div>
              <div style="font-size:0.9rem; font-weight:800; color:#34d399; margin-top:8px;">+ED added!</div>
            </div>
          </div>

          <!-- Interactive Verbs Transformer Selector -->
          <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:24px;">
            <button class="hud-btn" onclick="window.detectivesApp.showTimelineVerb('play', 'played', 'regular')">play ➔ played</button>
            <button class="hud-btn" onclick="window.detectivesApp.showTimelineVerb('watch', 'watched', 'regular')">watch ➔ watched</button>
            <button class="hud-btn" onclick="window.detectivesApp.showTimelineVerb('walk', 'walked', 'regular')">walk ➔ walked</button>
            <button class="hud-btn" onclick="window.detectivesApp.showTimelineVerb('go', 'went', 'irregular')">go ➔ went</button>
            <button class="hud-btn" onclick="window.detectivesApp.showTimelineVerb('eat', 'ate', 'irregular')">eat ➔ ate</button>
            <button class="hud-btn" onclick="window.detectivesApp.showTimelineVerb('see', 'saw', 'irregular')">see ➔ saw</button>
            <button class="hud-btn" onclick="window.detectivesApp.showTimelineVerb('ride', 'rode', 'irregular')">ride ➔ rode</button>
          </div>

          <!-- Rule Pill Box -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; max-width:800px; margin:0 auto;">
            <div style="background:rgba(16,185,129,0.12); border:1.5px solid var(--det-emerald); border-radius:14px; padding:16px; text-align:center;">
              <h4 style="color:#34d399; font-size:1.1rem; font-weight:900; margin-bottom:4px;">🟢 REGULAR VERBS</h4>
              <p style="color:#e2e8f0; font-size:0.95rem; margin:0;">Easy! Just add <strong>-ED</strong> to the end (play ➔ play<strong>ed</strong>).</p>
            </div>
            <div style="background:rgba(168,85,247,0.12); border:1.5px solid var(--det-purple); border-radius:14px; padding:16px; text-align:center;">
              <h4 style="color:#c084fc; font-size:1.1rem; font-weight:900; margin-bottom:4px;">🟣 IRREGULAR VERBS</h4>
              <p style="color:#e2e8f0; font-size:0.95rem; margin:0;">Mystery shapeshifters! The whole word changes (go ➔ <strong>went</strong>).</p>
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 4 — EASY GRAMMAR PRACTICE (SORTING & MULTIPLE CHOICE)
    // =======================================================================
    renderStage4() {
      return `
        <div>
          <div style="text-align:center; margin-bottom:16px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 4: Practice &amp; Sort Verbs
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Tap or drag each verb into the correct detective case box!
            </p>
          </div>

          <!-- Quick Sentence Multiple Choice -->
          <div style="background:rgba(15,23,42,0.7); border:1.5px solid rgba(255,255,255,0.1); border-radius:14px; padding:16px 20px; margin-bottom:18px; text-align:center;">
            <span style="font-size:0.8rem; font-weight:800; color:var(--det-gold); text-transform:uppercase;">Challenge: Fill the blank</span>
            <div style="font-size:1.4rem; font-weight:800; margin:8px 0;">“Yesterday, I <span style="color:var(--det-gold); text-decoration:underline;">______</span> football with my friends.”</div>
            <div style="display:flex; justify-content:center; gap:12px; margin-top:8px;">
              <button class="hud-btn" onclick="window.detectivesApp.checkMCQPractice('play', false)">play</button>
              <button class="hud-btn" onclick="window.detectivesApp.checkMCQPractice('played', true)" style="border-color:var(--det-emerald);">played ✅</button>
              <button class="hud-btn" onclick="window.detectivesApp.checkMCQPractice('playing', false)">playing</button>
            </div>
          </div>

          <!-- Card Sorting Pool -->
          <div style="text-align:center; font-size:0.85rem; font-weight:800; color:var(--det-text-muted); margin-bottom:8px;">
            Tap a word below, then tap REGULAR or IRREGULAR to sort:
          </div>
          <div id="sort-pool-container" class="sort-cards-pool">
            <div class="sortable-card" data-type="regular" onclick="window.detectivesApp.pickSortCard(this)">walked 🚶</div>
            <div class="sortable-card" data-type="irregular" onclick="window.detectivesApp.pickSortCard(this)">went 🚌</div>
            <div class="sortable-card" data-type="regular" onclick="window.detectivesApp.pickSortCard(this)">watched 📺</div>
            <div class="sortable-card" data-type="irregular" onclick="window.detectivesApp.pickSortCard(this)">ate 🍕</div>
            <div class="sortable-card" data-type="irregular" onclick="window.detectivesApp.pickSortCard(this)">saw 🦁</div>
            <div class="sortable-card" data-type="regular" onclick="window.detectivesApp.pickSortCard(this)">cleaned 🧹</div>
            <div class="sortable-card" data-type="irregular" onclick="window.detectivesApp.pickSortCard(this)">rode 🚲</div>
            <div class="sortable-card" data-type="regular" onclick="window.detectivesApp.pickSortCard(this)">visited 🏡</div>
          </div>

          <!-- Sorting Trays -->
          <div class="sort-trays-container">
            <div class="sort-tray regular" onclick="window.detectivesApp.depositSortCard('regular')">
              <div class="tray-title" style="color:#34d399;">🟢 REGULAR (+ED)</div>
              <div id="tray-regular-contents" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
            </div>
            <div class="sort-tray irregular" onclick="window.detectivesApp.depositSortCard('irregular')">
              <div class="tray-title" style="color:#c084fc;">🟣 IRREGULAR (Changes)</div>
              <div id="tray-irregular-contents" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 5 — MEMORY THIEF GAME (ROUNDS 1-4)
    // =======================================================================
    renderStage5() {
      const roundInfo = D.MEMORY_ROUNDS[this.app.memoryRound - 1] || D.MEMORY_ROUNDS[0];
      return `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
            <div>
              <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold); margin:0;">
                Stage 5: The Memory Thief 🧠
              </h2>
              <p style="color:var(--det-text-muted); font-size:0.9rem; margin:2px 0 0 0;">
                ${roundInfo.title} — ${roundInfo.desc}
              </p>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.1rem; font-weight:800;" id="memory-timer-digits">⏱️ 30s</span>
              <button class="hud-btn primary" id="btn-memory-start" onclick="window.detectivesApp.startMemoryCountdown()">
                ▶ Start Memorizing!
              </button>
            </div>
          </div>

          <!-- Timer Bar -->
          <div class="memory-countdown-bar">
            <div id="memory-timer-fill" class="memory-countdown-fill" style="width:100%;"></div>
          </div>

          <!-- 10 Memory Cards Grid -->
          <div class="memory-grid" id="memory-cards-container">
            ${D.MEMORY_THIEF_DECK.map(c => `
              <div class="memory-card" id="mem-card-${c.id}" onclick="window.detectivesApp.clickMemoryCard('${c.id}')">
                <span class="mem-icon" style="font-size:2.8rem;">${c.icon}</span>
                <span class="mem-label" style="font-size:0.95rem; font-weight:800; margin-top:4px;">${c.label}</span>
              </div>
            `).join('')}
          </div>

          <!-- Deduction & Sentence Response Box -->
          <div id="memory-deduction-panel" style="background:rgba(15,23,42,0.8); border:1.5px solid var(--det-gold); border-radius:14px; padding:16px; margin-top:10px; display:none;">
            <div style="font-size:1.1rem; font-weight:800; color:var(--det-gold); margin-bottom:8px;">
              🕵️ What disappeared? Tap the missing cards above and complete the sentence:
            </div>
            <div id="memory-selection-summary" style="font-size:1rem; font-weight:700; color:#e2e8f0; margin-bottom:12px;">
              Selected: None
            </div>
            <button class="hud-btn primary" onclick="window.detectivesApp.checkMemoryDeduction()">
              Check Missing Clues &amp; Sentence (+20 XP)
            </button>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 6 — GRAMMAR CHALLENGE: DID & FIX THE DETECTIVE
    // =======================================================================
    renderStage6() {
      const ch = D.FIX_DETECTIVE_CHALLENGES[this.app.fixDetectiveIndex] || D.FIX_DETECTIVE_CHALLENGES[0];
      return `
        <div>
          <div style="text-align:center; margin-bottom:18px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 6: Grammar Challenge — The Power of DID
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              When we ask questions with DID or make negatives with DIDN'T, the verb returns to normal!
            </p>
          </div>

          <!-- Rule Visualizer -->
          <div style="background:linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(59,130,246,0.1) 100%); border:2px solid var(--det-gold); border-radius:18px; padding:20px; margin-bottom:20px; text-align:center;">
            <div style="font-size:0.85rem; font-weight:900; text-transform:uppercase; color:var(--det-gold); letter-spacing:1px; margin-bottom:6px;">
              ⚡ THE TIME-THIEF RULE
            </div>
            <div style="display:flex; justify-content:center; align-items:center; gap:16px; font-size:1.3rem; font-weight:800; flex-wrap:wrap;">
              <span style="color:#ef4444; text-decoration:line-through;">❌ Did you went?</span>
              <span style="font-size:1.6rem; color:var(--det-gold);">➔</span>
              <span style="color:#34d399;">✅ Did you GO?</span>
            </div>
            <div style="font-size:0.95rem; color:var(--det-text-muted); margin-top:8px;">
              DID takes the past tense away. The verb goes back to base form: <strong>DID + GO</strong>!
            </div>
          </div>

          <!-- Fix The Detective Challenge Card -->
          <div style="background:var(--det-bg-card); border:2px solid rgba(255,255,255,0.15); border-radius:18px; padding:24px; text-align:center; max-width:750px; margin:0 auto;">
            <span style="font-size:0.8rem; font-weight:800; color:var(--det-crimson); text-transform:uppercase;">
              Broken Sentence #${this.app.fixDetectiveIndex + 1}
            </span>
            <div class="broken-sentence-box">
              ❌ “${ch.broken}”
            </div>

            <div style="font-size:1rem; font-weight:700; color:#e2e8f0; margin-bottom:14px;">
              Choose the correct replacement verb:
            </div>
            <div style="display:flex; justify-content:center; gap:12px; margin-bottom:20px;">
              ${ch.options.map(opt => `
                <button class="quiz-option-btn" onclick="window.detectivesApp.checkFixDetective('${opt}')">
                  ${opt}
                </button>
              `).join('')}
            </div>

            <div id="fix-detective-rule-box" style="font-size:0.95rem; font-weight:700; color:var(--det-gold); min-height:24px;">
              ${ch.rule}
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 7 — STORY HAS A LIE
    // =======================================================================
    renderStage7() {
      const story = D.SUSPECT_STORIES[0];
      return `
        <div>
          <div style="text-align:center; margin-bottom:16px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 7: The Suspect Has A Lie! 🤥
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              ${story.suspectName} gave 4 statements about yesterday. ONE OF THEM IS A LIE!
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.85); border:2px solid var(--det-gold); border-radius:18px; padding:20px; max-width:780px; margin:0 auto 20px auto;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
              <span style="font-size:3rem;">${story.avatar}</span>
              <div>
                <div style="font-size:1.2rem; font-weight:900; color:#ffffff;">${story.suspectName}</div>
                <div style="font-size:0.85rem; color:var(--det-text-muted);">“${story.intro}”</div>
              </div>
            </div>

            <div class="statements-list">
              ${story.statements.map((stmt, idx) => `
                <div class="statement-row" id="stmt-${stmt.id}" onclick="window.detectivesApp.selectLieCandidate('${stmt.id}')">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:1.6rem;">${stmt.icon}</span>
                    <span style="font-size:1.15rem; font-weight:800;">${idx + 1}. “${stmt.text}”</span>
                  </div>
                  <span style="font-size:0.85rem; font-weight:800; color:var(--det-gold);">Tap to vote Lie</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="text-align:center;">
            <button class="hud-btn primary" onclick="window.detectivesApp.revealLieResult()" style="font-size:1.2rem; padding:12px 36px; border-radius:24px;">
              ⚖️ REVEAL THE TRUTH &amp; CATCH THE LIE
            </button>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 8 — EVIDENCE SYSTEM
    // =======================================================================
    renderStage8() {
      const story = D.SUSPECT_STORIES[0];
      return `
        <div>
          <div style="text-align:center; margin-bottom:16px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 8: Examine Physical Evidence 🧾
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Compare the suspect's story with the physical receipts, tickets, and photos!
            </p>
          </div>

          <div class="evidence-dossier">
            <!-- Left: Statements -->
            <div style="background:rgba(15,23,42,0.8); border:1.5px solid rgba(255,255,255,0.15); border-radius:18px; padding:18px;">
              <h3 style="font-size:1.1rem; font-weight:900; color:#38bdf8; margin-bottom:12px;">
                📋 Suspect Statements:
              </h3>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${story.statements.map(s => `
                  <div style="background:var(--det-bg-card); padding:10px 14px; border-radius:10px; font-size:0.95rem; font-weight:800; display:flex; justify-content:space-between; align-items:center;">
                    <span>${s.icon} ${s.text}</span>
                    <span id="evidence-check-${s.id}" style="font-size:0.8rem; font-weight:800; color:var(--det-text-muted);">Unverified</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Right: Real Physical Evidence -->
            <div style="background:rgba(15,23,42,0.8); border:1.5px solid var(--det-gold); border-radius:18px; padding:18px;">
              <h3 style="font-size:1.1rem; font-weight:900; color:var(--det-gold); margin-bottom:12px;">
                🗂️ Discovered Evidence Dossier:
              </h3>
              <div class="evidence-items-deck">
                ${story.evidence.map(ev => `
                  <div class="evidence-badge" onclick="window.detectivesApp.inspectEvidenceItem('${ev.name}', '${ev.details}')" style="cursor:pointer;">
                    <span style="font-size:1.8rem;">${ev.icon}</span>
                    <div>
                      <div style="font-size:0.95rem; font-weight:900; color:#ffffff;">${ev.name}</div>
                      <div style="font-size:0.78rem; color:var(--det-text-muted);">${ev.details}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div style="text-align:center; margin-top:20px;">
            <div style="font-size:1.05rem; font-weight:800; color:#34d399; margin-bottom:10px;">
              Evidence Conclusion: Notice what is missing? No horse ticket or photo exists!
            </div>
            <button class="hud-btn primary" onclick="window.detectivesApp.concludeEvidenceStage()" style="padding:10px 30px; font-size:1.1rem; border-radius:20px;">
              ✔️ Confirm Deduction: "He didn't ride a horse!"
            </button>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 9 — DETECTIVE QUESTIONING (INTERROGATION ROOM)
    // =======================================================================
    renderStage9() {
      const suspect = D.INTERROGATION_SUSPECT;
      return `
        <div>
          <div style="text-align:center; margin-bottom:14px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 9: Interrogate the Suspect 🕵️‍♂️
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Question ${suspect.name}! Ask about yesterday to uncover the truth.
            </p>
          </div>

          <div class="interrogation-stage">
            <!-- Suspect Avatar & Response -->
            <div class="suspect-profile-card">
              <span style="font-size:4.5rem; display:block; margin-bottom:6px;">${suspect.avatar}</span>
              <h3 style="font-size:1.25rem; font-weight:900; color:#ffffff; margin-bottom:4px;">${suspect.name}</h3>
              <div style="font-size:0.8rem; color:var(--det-gold); font-weight:800; text-transform:uppercase; margin-bottom:14px;">
                Chief Butler · Under Investigation
              </div>

              <!-- Suspect Speech Bubble -->
              <div class="suspect-speech-bubble" id="suspect-speech-text">
                “${suspect.initialSpeech}”
              </div>

              <button class="hud-btn" onclick="window.detectivesApp.replaySuspectSpeech()" style="font-size:0.8rem;">
                🔊 Replay Suspect Voice
              </button>
            </div>

            <!-- Interrogation Questions Notebook -->
            <div style="background:rgba(15,23,42,0.8); border:1.5px solid rgba(255,255,255,0.15); border-radius:var(--det-radius-lg); padding:20px;">
              <h4 style="font-size:1.1rem; font-weight:900; color:#38bdf8; margin-bottom:12px;">
                ❓ Detective Question Options (Tap to Ask):
              </h4>
              <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
                ${suspect.questions.map(q => `
                  <button class="hud-btn" style="text-align:left; justify-content:flex-start; padding:10px 14px; font-size:0.95rem;" onclick="window.detectivesApp.askSuspectQuestion('${q.id}')">
                    🗣️ “${q.text}”
                  </button>
                `).join('')}
              </div>

              <!-- Clues Discovered Log -->
              <div style="background:rgba(0,0,0,0.3); border-radius:12px; padding:12px;">
                <div style="font-size:0.8rem; font-weight:800; color:var(--det-gold); text-transform:uppercase; margin-bottom:6px;">
                  📝 Interrogation Log:
                </div>
                <div id="interrogation-log-box" style="font-size:0.88rem; color:#cbd5e1; min-height:40px;">
                  Tap a question above to record Barnaby’s answers!
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 10 — BUILD THE STORY
    // =======================================================================
    renderStage10() {
      return `
        <div>
          <div style="text-align:center; margin-bottom:16px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 10: Build The Chronological Story ✍️
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Select 4 event cards to sequence a day using past time connectors!
            </p>
          </div>

          <!-- Event Cards Options -->
          <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:20px;">
            ${D.STORY_BUILDER_EVENTS.map(ev => `
              <div class="sortable-card" onclick="window.detectivesApp.selectStoryEvent('${ev.id}')">
                <span style="font-size:1.4rem; margin-right:4px;">${ev.icon}</span>
                <span>${ev.label}</span>
              </div>
            `).join('')}
          </div>

          <!-- Assembled Narrative Box -->
          <div class="sentence-builder-strip" id="story-assembled-container">
            <div style="font-size:1.15rem; font-weight:800; color:var(--det-text-muted); width:100%; text-align:center;">
              Tap events above to slot them into the story timeline!
            </div>
          </div>

          <div style="display:flex; justify-content:center; gap:12px; margin-top:18px;">
            <button class="hud-btn" onclick="window.detectivesApp.resetStoryBuilder()">↺ Reset Events</button>
            <button class="hud-btn primary" onclick="window.detectivesApp.speakAssembledStory()">🔊 Read Aloud Story</button>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 11 — CREATE YOUR OWN LIE STUDIO
    // =======================================================================
    renderStage11() {
      return `
        <div>
          <div style="text-align:center; margin-bottom:14px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 11: Create Your Own Lie! 🤥
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Now YOU are the suspect! Create a story with <strong>4 True Events</strong> and <strong>1 Believable Lie</strong>.
            </p>
          </div>

          <div class="lie-creation-studio">
            <!-- Studio Inputs -->
            <div style="background:rgba(15,23,42,0.85); border:1.5px solid rgba(255,255,255,0.15); border-radius:18px; padding:20px;">
              <h3 style="font-size:1.1rem; font-weight:900; color:#38bdf8; margin-bottom:14px;">
                ✏️ Your 5 Past Simple Sentences:
              </h3>

              <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                  <label style="font-size:0.8rem; font-weight:800; color:#34d399;">1. True Event:</label>
                  <input type="text" id="user-sent-1" class="hud-btn" style="width:100%; cursor:text; padding:8px 12px;" value="Yesterday, I played football in the park.">
                </div>
                <div>
                  <label style="font-size:0.8rem; font-weight:800; color:#34d399;">2. True Event:</label>
                  <input type="text" id="user-sent-2" class="hud-btn" style="width:100%; cursor:text; padding:8px 12px;" value="I ate a big slice of pizza for dinner.">
                </div>
                <div>
                  <label style="font-size:0.8rem; font-weight:800; color:#34d399;">3. True Event:</label>
                  <input type="text" id="user-sent-3" class="hud-btn" style="width:100%; cursor:text; padding:8px 12px;" value="I saw a fluffy golden puppy on the street.">
                </div>
                <div>
                  <label style="font-size:0.8rem; font-weight:800; color:#34d399;">4. True Event:</label>
                  <input type="text" id="user-sent-4" class="hud-btn" style="width:100%; cursor:text; padding:8px 12px;" value="I visited my best friend after school.">
                </div>
                <div>
                  <label style="font-size:0.8rem; font-weight:800; color:var(--det-crimson);">5. The Believable Lie (Secret!):</label>
                  <input type="text" id="user-sent-lie" class="hud-btn" style="width:100%; cursor:text; padding:8px 12px; border-color:var(--det-crimson);" value="I rode a white horse through the city center.">
                </div>
              </div>
            </div>

            <!-- Case File Output Card -->
            <div style="background:var(--det-bg-card); border:2px solid var(--det-gold); border-radius:18px; padding:20px; text-align:center;">
              <span style="font-size:2.8rem;">📁</span>
              <h3 style="font-size:1.25rem; font-weight:900; color:#ffffff; margin:6px 0;">Official Detective Dossier</h3>
              <p style="font-size:0.85rem; color:var(--det-text-muted); margin-bottom:16px;">
                Ready for classmates to cross-examine and interrogate!
              </p>

              <div id="dossier-preview-box" style="background:rgba(0,0,0,0.3); border-radius:12px; padding:14px; text-align:left; font-size:0.92rem; line-height:1.6; margin-bottom:18px;">
                1. Yesterday, I played football in the park.<br>
                2. I ate a big slice of pizza for dinner.<br>
                3. I saw a fluffy golden puppy on the street.<br>
                4. I visited my best friend after school.<br>
                5. I rode a white horse through the city center.
              </div>

              <button class="hud-btn primary" onclick="window.detectivesApp.saveAndPublishDossier()">
                ⭐ Save Case Dossier (+25 XP)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 12 — DETECTIVE MODE (CLASSROOM PAIR/TEAM GAME)
    // =======================================================================
    renderStage12() {
      return `
        <div>
          <div style="text-align:center; margin-bottom:16px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 12: Detective Mode — Interrogate &amp; Score 🏆
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Present stories to a partner or team. Ask questions and catch the lie!
            </p>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
            <!-- Investigation Rules & Points -->
            <div style="background:rgba(15,23,42,0.8); border:1.5px solid rgba(255,255,255,0.15); border-radius:18px; padding:20px;">
              <h3 style="font-size:1.15rem; font-weight:900; color:var(--det-gold); margin-bottom:12px;">
                🎯 How Points Are Awarded:
              </h3>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
                  <span>🧠 Remembering the 5 events accurately</span>
                  <strong style="color:#38bdf8;">+10 XP</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
                  <span>🗣️ Correct Past Simple grammar</span>
                  <strong style="color:#34d399;">+10 XP</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
                  <span>❓ Asking a sharp question ("Did you...?")</span>
                  <strong style="color:#f59e0b;">+10 XP</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
                  <span>🕵️ Correctly finding &amp; proving the lie</span>
                  <strong style="color:#a855f7;">+20 XP</strong>
                </div>
              </div>
            </div>

            <!-- Interactive Badge Showcase -->
            <div style="background:linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(234,179,8,0.25) 100%); border:2px solid var(--det-gold); border-radius:18px; padding:24px; text-align:center;">
              <span style="font-size:4rem;">🎖️</span>
              <h3 style="font-size:1.4rem; font-weight:900; color:#fbbf24; margin:8px 0 4px 0;">MASTER DETECTIVE</h3>
              <p style="font-size:0.9rem; color:#e2e8f0; margin-bottom:16px;">
                Awarded to the detective who unmasks the lie through rigorous questioning!
              </p>
              <button class="hud-btn primary" onclick="window.detectivesApp.awardMasterBadge()" style="font-size:1.05rem; padding:10px 24px; border-radius:20px;">
                🏅 Award Master Detective Badge!
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 13 — HARD MODE (5-EVENT ADVANCED MYSTERY)
    // =======================================================================
    renderStage13() {
      const hCase = D.HARD_MODE_CASE;
      const curChallenge = hCase.challenges[this.app.hardModeIndex] || hCase.challenges[0];

      return `
        <div>
          <div style="text-align:center; margin-bottom:14px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-crimson);">
              ⚡ Stage 13: Hard Mode Mystery Case
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Mia’s Day contains 2 regular verbs, 2 irregular verbs, and 1 negative statement!
            </p>
          </div>

          <!-- Mia's Case File -->
          <div style="background:rgba(15,23,42,0.85); border:2px solid var(--det-crimson); border-radius:18px; padding:18px; max-width:780px; margin:0 auto 18px auto;">
            <div style="font-size:0.8rem; font-weight:900; color:var(--det-crimson); text-transform:uppercase; margin-bottom:8px;">
              📁 Evidence Transcript: Mia’s Statement
            </div>
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:6px; font-size:1rem; font-weight:700;">
              ${hCase.storyText.map((line, i) => `
                <li style="background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
                  ${i + 1}. ${line}
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Challenge Question Card -->
          <div style="background:var(--det-bg-card); border:1.5px solid rgba(255,255,255,0.15); border-radius:18px; padding:20px; text-align:center; max-width:780px; margin:0 auto;">
            <div style="font-size:0.85rem; font-weight:900; color:var(--det-gold); text-transform:uppercase; margin-bottom:4px;">
              ${curChallenge.title}
            </div>
            <h3 style="font-size:1.25rem; font-weight:900; color:#ffffff; margin-bottom:14px;">
              ${curChallenge.prompt}
            </h3>

            <div style="display:flex; flex-direction:column; gap:8px; max-width:520px; margin:0 auto;">
              ${curChallenge.options.map((opt, optIdx) => `
                <button class="hud-btn" style="padding:10px 16px; font-size:0.95rem; text-align:left; justify-content:flex-start;" onclick="window.detectivesApp.checkHardChallenge(${optIdx})">
                  ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // STAGE 14 — FINAL ASSESSMENT & CERTIFICATE
    // =======================================================================
    renderStage14() {
      const data = D.FINAL_ASSESSMENT_DATA;
      return `
        <div>
          <div style="text-align:center; margin-bottom:16px;">
            <h2 style="font-size:1.8rem; font-weight:900; color:var(--det-gold);">
              Stage 14: Final Detective Assessment 🎓
            </h2>
            <p style="color:var(--det-text-muted); font-size:0.95rem;">
              Complete the 5 assessment parts to earn your official A1+ Past Simple Certificate!
            </p>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
            <!-- Part 1: Vocabulary -->
            <div class="assessment-question-card">
              <h4 style="color:#38bdf8; font-size:1.05rem; font-weight:900; margin-bottom:8px;">Part 1: Action Vocabulary</h4>
              <p style="font-size:0.85rem; color:var(--det-text-muted); margin-bottom:10px;">Select the action verb for the clue:</p>
              <div style="background:rgba(0,0,0,0.25); padding:10px; border-radius:8px; font-weight:800; margin-bottom:8px;">
                🚲 Pedaling a bicycle:
              </div>
              <div style="display:flex; gap:8px;">
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(1, true)">ride ✅</button>
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(1, false)">clean</button>
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(1, false)">jump</button>
              </div>
            </div>

            <!-- Part 2: Grammar Forms -->
            <div class="assessment-question-card">
              <h4 style="color:#34d399; font-size:1.05rem; font-weight:900; margin-bottom:8px;">Part 2: Past Simple Form</h4>
              <p style="font-size:0.85rem; color:var(--det-text-muted); margin-bottom:10px;">Choose the correct past tense verb:</p>
              <div style="background:rgba(0,0,0,0.25); padding:10px; border-radius:8px; font-weight:800; margin-bottom:8px;">
                “Yesterday, I <span style="color:var(--det-gold);">___</span> to the museum.”
              </div>
              <div style="display:flex; gap:8px;">
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(2, true)">went ✅</button>
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(2, false)">go</button>
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(2, false)">going</button>
              </div>
            </div>

            <!-- Part 3: Fix The Mistake -->
            <div class="assessment-question-card">
              <h4 style="color:#f59e0b; font-size:1.05rem; font-weight:900; margin-bottom:8px;">Part 3: Fix The Mistake (DID)</h4>
              <p style="font-size:0.85rem; color:var(--det-text-muted); margin-bottom:10px;">Correct the sentence:</p>
              <div style="background:rgba(0,0,0,0.25); padding:10px; border-radius:8px; font-weight:800; margin-bottom:8px;">
                “Did you <span style="color:#ef4444; text-decoration:line-through;">went</span> to the cinema?”
              </div>
              <div style="display:flex; gap:8px;">
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(3, true)">Did you go ✅</button>
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(3, false)">Did you went</button>
              </div>
            </div>

            <!-- Part 4: Production -->
            <div class="assessment-question-card">
              <h4 style="color:#a855f7; font-size:1.05rem; font-weight:900; margin-bottom:8px;">Part 4: Negative Sentence</h4>
              <p style="font-size:0.85rem; color:var(--det-text-muted); margin-bottom:10px;">Which sentence is 100% correct?</p>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(4, true)" style="text-align:left;">
                  ✅ “I didn't eat pizza yesterday.”
                </button>
                <button class="hud-btn" onclick="window.detectivesApp.scoreAssessment(4, false)" style="text-align:left;">
                  ❌ “I didn't ate pizza yesterday.”
                </button>
              </div>
            </div>
          </div>

          <!-- Certificate Action -->
          <div style="text-align:center;">
            <button class="hud-btn primary" onclick="window.detectivesApp.generateCertificate()" style="font-size:1.25rem; padding:12px 36px; border-radius:30px;">
              📜 VIEW OFFICIAL MASTER DETECTIVE CERTIFICATE
            </button>
          </div>
        </div>
      `;
    }
  }

  root.DetectivesScenes = DetectivesScenes;

})(typeof window !== 'undefined' ? window : global);
