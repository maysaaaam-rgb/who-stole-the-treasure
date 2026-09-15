/**
 * WONDERLAND SCENE RENDERERS
 * High-Resolution Victorian Fantasy Visuals & Smart Board Touch Stages
 */

(function(root) {
  'use strict';

  class WonderlandScenes {
    constructor(app) {
      this.app = app;
      this.data = root.WONDERLAND_DATA;
    }

    // =========================================================================
    // SCREEN 1: WONDERLAND IS CALLING
    // =========================================================================
    renderScreen1(container) {
      const d = this.data.screen1;
      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="entrance-stage">
            <!-- High-Res Vector Keyhole Door in Ancient Oak -->
            <div class="entrance-door-art">
              <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="treeGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#312e81"/>
                    <stop offset="70%" stop-color="#1e1b4b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                  </radialGradient>
                  <linearGradient id="doorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="50%" stop-color="#f59e0b"/>
                    <stop offset="100%" stop-color="#b45309"/>
                  </linearGradient>
                  <filter id="glowFilt" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                  </filter>
                </defs>
                <!-- Ancient Tree Trunk -->
                <path d="M 20 200 C 35 120, 45 60, 100 20 C 155 60, 165 120, 180 200 Z" fill="url(#treeGrad)"/>
                <!-- Enchanted Door Frame -->
                <path d="M 55 190 C 55 105, 145 105, 145 190 Z" fill="#0f172a" stroke="#f59e0b" stroke-width="4"/>
                <!-- Glowing Golden Keyhole -->
                <path d="M 65 185 C 65 120, 135 120, 135 185 Z" fill="url(#doorGlow)" filter="url(#glowFilt)"/>
                <circle cx="100" cy="148" r="10" fill="#0f172a"/>
                <polygon points="94,152 106,152 103,170 97,170" fill="#0f172a"/>
                <!-- Magical Mushrooms -->
                <ellipse cx="40" cy="188" rx="14" ry="9" fill="#e11d48"/>
                <rect x="37" y="188" width="6" height="12" fill="#f8fafc"/>
                <circle cx="36" cy="186" r="2" fill="#ffffff"/>
                <circle cx="44" cy="186" r="2.5" fill="#ffffff"/>
                <!-- Sparkles -->
                <circle cx="45" cy="55" r="3" fill="#fef08a" opacity="0.8"/>
                <circle cx="155" cy="70" r="2.5" fill="#fef08a" opacity="0.9"/>
                <circle cx="130" cy="35" r="3.5" fill="#38bdf8" opacity="0.85"/>
              </svg>
            </div>

            <div class="scene-title-group">
              <h1 class="scene-main-title">🐇 ${d.title}</h1>
              <p class="scene-subtitle">"${d.subtitle}"</p>
            </div>

            <div style="margin-top:16px;">
              <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.enterWonderland()">
                <span>${d.btnText}</span>
              </button>
            </div>

            <div style="margin-top:24px; font-size:1.05rem; color:#94a3b8; font-weight:700;">
              Teacher: "${d.teacherPrompt}" &nbsp;·&nbsp; Students: <span style="color:#fef08a;">"${d.studentResponse}"</span>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 2: THE WHITE RABBIT
    // =========================================================================
    renderScreen2(container) {
      const d = this.data.screen2;
      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="rabbit-dialogue-card">
            <!-- White Rabbit Avatar SVG -->
            <div style="width:110px; height:110px; flex-shrink:0;">
              <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#f59e0b" stroke-width="3"/>
                <!-- Long Ears -->
                <ellipse cx="38" cy="22" rx="7" ry="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
                <ellipse cx="38" cy="22" rx="4" ry="14" fill="#f472b6"/>
                <ellipse cx="62" cy="22" rx="7" ry="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
                <ellipse cx="62" cy="22" rx="4" ry="14" fill="#f472b6"/>
                <!-- Face -->
                <circle cx="50" cy="62" r="28" fill="#ffffff"/>
                <circle cx="42" cy="58" r="4" fill="#0f172a"/>
                <circle cx="58" cy="58" r="4" fill="#0f172a"/>
                <polygon points="48,65 52,65 50,69" fill="#f472b6"/>
                <!-- Whiskers -->
                <line x1="32" y1="64" x2="18" y2="62" stroke="#94a3b8" stroke-width="1.5"/>
                <line x1="32" y1="67" x2="18" y2="69" stroke="#94a3b8" stroke-width="1.5"/>
                <line x1="68" y1="64" x2="82" y2="62" stroke="#94a3b8" stroke-width="1.5"/>
                <line x1="68" y1="67" x2="82" y2="69" stroke="#94a3b8" stroke-width="1.5"/>
                <!-- Pocket Watch in Paw -->
                <circle cx="76" cy="80" r="10" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
                <circle cx="76" cy="80" r="7" fill="#ffffff"/>
                <line x1="76" y1="80" x2="76" y2="76" stroke="#000" stroke-width="1"/>
                <line x1="76" y1="80" x2="79" y2="80" stroke="#000" stroke-width="1"/>
              </svg>
            </div>

            <div style="flex:1;">
              <div class="speech-bubble">
                <span>🐰 "${d.rabbitQuote}"</span>
                <button type="button" class="hud-btn" style="padding:6px 12px; margin-left:auto; font-size:0.85rem;" onclick="window.wonderlandApp.speak('${d.rabbitSpeech}')">
                  🔊 Replay
                </button>
              </div>
              <div style="font-size:1.35rem; font-weight:900; color:#f59e0b; margin-top:14px;">
                ${d.question}
              </div>
            </div>
          </div>

          <div class="choices-row-giant">
            ${d.options.map(opt => `
              <div class="choice-box-giant ${this.app.state.screen2Answer === opt.id ? (opt.isCorrect ? 'is-correct' : 'is-wrong') : ''}"
                   onclick="window.wonderlandApp.handleScreen2Choice('${opt.id}')">
                <span style="font-size:3.5rem;">${opt.icon}</span>
                <span class="choice-box-label">${opt.label}</span>
              </div>
            `).join('')}
          </div>

          ${this.app.state.screen2Feedback ? `
            <div style="margin-top:20px; font-size:1.3rem; font-weight:900; color:${this.app.state.screen2IsCorrect ? '#10b981' : '#f59e0b'};">
              ${this.app.state.screen2Feedback}
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 3: WONDERLAND SCAVENGER HUNT (6 Hidden Items)
    // =========================================================================
    renderScreen3(container) {
      const d = this.data.screen3;
      const collectedCount = this.app.state.collectedItems.length;
      const isComplete = collectedCount >= d.items.length;

      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="scene-title-group" style="margin-bottom:14px;">
            <h2 class="scene-main-title">🔍 ${d.instruction}</h2>
            <p class="scene-subtitle">${d.hint}</p>
          </div>

          <div class="scavenger-canvas-wrap">
            <!-- Enchanted Forest Scene Background SVG -->
            <svg viewBox="0 0 1000 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="scavBg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#0f172a"/>
                  <stop offset="60%" stop-color="#1e1b4b"/>
                  <stop offset="100%" stop-color="#064e3b"/>
                </linearGradient>
              </defs>
              <rect width="1000" height="480" fill="url(#scavBg)"/>
              <!-- Whimsical Trees -->
              <path d="M -50 480 Q 80 200 150 0 L 220 0 Q 180 250 320 480 Z" fill="#090d1a" opacity="0.8"/>
              <path d="M 800 480 Q 880 180 920 0 L 980 0 Q 940 220 1050 480 Z" fill="#090d1a" opacity="0.8"/>
              <!-- Glowing Flora and Mushrooms -->
              <circle cx="200" cy="420" r="30" fill="#a855f7" opacity="0.3"/>
              <circle cx="780" cy="400" r="35" fill="#f59e0b" opacity="0.3"/>
              <circle cx="480" cy="380" r="45" fill="#059669" opacity="0.25"/>
            </svg>

            <!-- 6 Clickable Hidden Pins -->
            ${d.items.map(item => {
              const isCollected = this.app.state.collectedItems.includes(item.id);
              return `
                <div class="scavenger-target-pin ${isCollected ? 'collected' : ''}"
                     style="left:${item.x}%; top:${item.y}%;"
                     onclick="window.wonderlandApp.collectScavengerItem('${item.id}')"
                     title="${item.name} (${item.clue})">
                  <span>${item.icon}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Bottom Collection Status Bar -->
          <div class="collection-bar">
            <div style="font-family:var(--wl-font-display); font-size:1.2rem; font-weight:900; color:#fef08a;">
              WONDERLAND COLLECTION: ${collectedCount} / ${d.items.length}
            </div>

            <div class="collected-icons-row">
              ${d.items.map(item => {
                const isFound = this.app.state.collectedItems.includes(item.id);
                return `
                  <div class="collected-badge-slot ${isFound ? 'filled' : ''}" title="${item.name}">
                    ${isFound ? item.icon : '❓'}
                  </div>
                `;
              }).join('')}
            </div>

            ${isComplete ? `
              <button type="button" class="hud-btn primary" style="font-size:1.1rem; padding:10px 22px;" onclick="window.wonderlandApp.nextScreen()">
                🎉 ALL FOUND! NEXT ➔
              </button>
            ` : `
              <span style="font-size:0.92rem; color:#cbd5e1; font-weight:700;">Tap all 6 to continue!</span>
            `}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 4: MEET THE CHARACTERS (9 Gallery)
    // =========================================================================
    renderScreen4(container) {
      const chars = this.data.characters;
      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="scene-title-group" style="margin-bottom:16px;">
            <h2 class="scene-main-title">🎭 Meet the Characters</h2>
            <p class="scene-subtitle">Tap a character to hear their Wonderland sentence!</p>
          </div>

          <div class="characters-grid-9">
            ${chars.map(c => {
              const isSelected = this.app.state.selectedCharId === c.id;
              return `
                <div class="character-card-box ${isSelected ? 'is-selected' : ''}"
                     onclick="window.wonderlandApp.selectCharacter('${c.id}')">
                  <div class="char-card-avatar" style="border-color:${c.badgeColor};">
                    ${c.icon}
                  </div>
                  <div class="char-card-name" style="color:${c.badgeColor};">
                    ${c.name}
                  </div>
                  <div class="char-card-sentence">
                    "${c.sentence}"
                  </div>
                  <button type="button" class="hud-btn" style="padding:4px 10px; font-size:0.75rem; margin-top:2px;"
                          onclick="event.stopPropagation(); window.wonderlandApp.speak('${c.audioSpeech}')">
                    🔊 Listen
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 5: CHARACTER + PROP MATCH
    // =========================================================================
    renderScreen5(container) {
      const d = this.data.propMatch;
      const matched = this.app.state.matchedPairs || {};
      const allMatched = Object.keys(matched).length >= d.pairs.length;

      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="scene-title-group" style="margin-bottom:18px;">
            <h2 class="scene-main-title">🧩 Match the Character &amp; Prop</h2>
            <p class="scene-subtitle">${d.instruction}</p>
          </div>

          <div class="match-game-grid">
            <!-- Left Column: Characters -->
            <div class="match-column">
              <h3 style="color:#f59e0b; font-size:1.1rem; font-weight:900; margin-bottom:4px;">CHARACTERS</h3>
              ${d.pairs.map(p => {
                const isMatched = Boolean(matched[p.charId]);
                const isActive = this.app.state.activeCharMatch === p.charId;
                return `
                  <div class="match-item-card ${isMatched ? 'is-matched' : ''} ${isActive ? 'is-active-select' : ''}"
                       onclick="window.wonderlandApp.selectMatchChar('${p.charId}')">
                    <span style="font-size:2.2rem;">👤</span>
                    <div>
                      <div style="font-size:1.2rem; font-weight:900; color:#fff;">${p.charName}</div>
                      <div style="font-size:0.85rem; color:#94a3b8;">${isMatched ? '✓ Prop Equipped' : 'Tap to select'}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Right Column: Props -->
            <div class="match-column">
              <h3 style="color:#38bdf8; font-size:1.1rem; font-weight:900; margin-bottom:4px;">THEATRE PROPS</h3>
              ${d.pairs.map(p => {
                const isMatched = Object.values(matched).includes(p.propId);
                const isActive = this.app.state.activePropMatch === p.propId;
                return `
                  <div class="match-item-card ${isMatched ? 'is-matched' : ''} ${isActive ? 'is-active-select' : ''}"
                       onclick="window.wonderlandApp.selectMatchProp('${p.propId}')">
                    <span style="font-size:2.4rem;">${p.icon}</span>
                    <div>
                      <div style="font-size:1.2rem; font-weight:900; color:#fef08a;">${p.propName}</div>
                      <div style="font-size:0.85rem; color:#94a3b8;">${isMatched ? '✓ Matched' : 'Tap to match'}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div style="margin-top:24px;">
            ${allMatched ? `
              <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.nextScreen()">
                ✨ MAGIC MATCH COMPLETE! NEXT ➔
              </button>
            ` : `
              <div style="font-size:1.05rem; color:#cbd5e1; font-weight:700;">
                Select a character on the left, then select their prop on the right!
              </div>
            `}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 6: THE TIME MACHINE (PAST SIMPLE DISCOVERY)
    // =========================================================================
    renderScreen6(container) {
      const d = this.data.timeMachine;
      const isPast = this.app.state.timeMachineIsPast;

      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="time-machine-box">
            <h2 style="font-family:var(--wl-font-display); font-size:2.2rem; font-weight:900; color:#f59e0b; margin-bottom:12px;">
              🕰️ The Wonderland Time Machine
            </h2>

            <!-- Spinning Reverse Clock -->
            <div class="clock-reverse-dial ${this.app.state.clockSpinning ? 'spinning' : ''}">
              🕰️
            </div>

            <div style="font-size:1.4rem; font-weight:900; color:${isPast ? '#fef08a' : '#38bdf8'}; margin-bottom:8px;">
              ${isPast ? '🟡 YESTERDAY (The Past)' : '🔵 TODAY (Now)'}
            </div>

            <div style="font-size:2rem; font-weight:900; color:#ffffff; margin-bottom:20px;">
              ${isPast ? `
                Alice <span class="past-verb-highlight">${d.targetVerb}</span> to Wonderland.
              ` : `
                ${d.nowSentence}
              `}
            </div>

            <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.toggleTimeMachine()">
              <span>${isPast ? '↺ Spin to Today' : '⚡ Turn Back Time (Yesterday) ➔'}</span>
            </button>
          </div>

          <!-- 4 Story Events Overview -->
          <div style="width:100%; max-width:900px; display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
            ${d.events.map(ev => `
              <div style="background:var(--wl-bg-card); border:1.5px solid rgba(255,255,255,0.12); border-radius:14px; padding:12px; text-align:center;">
                <div style="font-size:2rem; margin-bottom:6px;">${ev.icon}</div>
                <div style="font-size:0.95rem; font-weight:800; color:#fff;">${ev.text}</div>
                <div style="font-size:0.78rem; color:#f59e0b; margin-top:4px; font-weight:900;">Verb: ${ev.verb}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 7: WHAT HAPPENED? (4 Moments)
    // =========================================================================
    renderScreen7(container) {
      const items = this.data.whatHappened;
      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="scene-title-group">
            <h2 class="scene-main-title">📖 What Happened?</h2>
            <p class="scene-subtitle">Tap each story moment to hear and highlight the past verb!</p>
          </div>

          <div class="story-moments-grid">
            ${items.map(item => {
              const isTapped = Boolean(this.app.state.tappedMoments && this.app.state.tappedMoments[item.id]);
              return `
                <div class="story-moment-card ${isTapped ? 'is-active-select' : ''}"
                     onclick="window.wonderlandApp.tapMoment('${item.id}')">
                  <div style="font-size:3.2rem; flex-shrink:0;">${item.icon}</div>
                  <div>
                    <div style="font-size:0.85rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">
                      ${item.label}
                    </div>
                    <div style="font-size:1.35rem; font-weight:900; color:#ffffff; margin:4px 0;">
                      ${isTapped ? `
                        Alice <span class="past-verb-highlight">${item.verb}</span> ${item.sentence.replace('Alice ' + item.verb.toLowerCase() + ' ', '')}
                      ` : item.sentence}
                    </div>
                    <button type="button" class="hud-btn" style="padding:4px 10px; font-size:0.78rem;"
                            onclick="event.stopPropagation(); window.wonderlandApp.speak('${item.audio}')">
                      🔊 Listen
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 8: NOW OR YESTERDAY? (Two Giant Buttons)
    // =========================================================================
    renderScreen8(container) {
      const questions = this.data.nowOrYesterday;
      const qIdx = this.app.state.nowYesterdayIndex || 0;
      const q = questions[qIdx] || questions[0];

      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="scene-title-group">
            <h2 class="scene-main-title">⏰ NOW or YESTERDAY?</h2>
            <p class="scene-subtitle">Question ${qIdx + 1} of ${questions.length}</p>
          </div>

          <div style="background:var(--wl-bg-card); border:3px solid rgba(245,158,11,0.4); border-radius:var(--wl-radius-lg); padding:36px; max-width:800px; width:100%; text-align:center; box-shadow:var(--wl-shadow);">
            <div style="font-size:2.2rem; font-weight:900; color:#ffffff; margin-bottom:12px;">
              "${q.sentence}"
            </div>
            <button type="button" class="hud-btn" style="padding:6px 14px; font-size:0.9rem;" onclick="window.wonderlandApp.speak('${q.sentence}')">
              🔊 Read Aloud
            </button>

            <div class="now-yesterday-buttons">
              <button type="button" class="btn-choice-now" onclick="window.wonderlandApp.answerNowYesterday('now')">
                🔵 NOW
              </button>
              <button type="button" class="btn-choice-yesterday" onclick="window.wonderlandApp.answerNowYesterday('yesterday')">
                🟡 YESTERDAY
              </button>
            </div>

            ${this.app.state.nowYesterdayFeedback ? `
              <div style="margin-top:24px; font-size:1.3rem; font-weight:900; color:${this.app.state.nowYesterdayIsCorrect ? '#10b981' : '#f59e0b'};">
                ${this.app.state.nowYesterdayFeedback}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 9: ACT IT! (TPR Physical Theatre)
    // =========================================================================
    renderScreen9(container) {
      const actions = this.data.tprActions;
      const actIdx = this.app.state.tprIndex || 0;
      const act = actions[actIdx] || actions[0];

      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="scene-title-group">
            <h2 class="scene-main-title">🎭 ACT IT! Classroom Theatre</h2>
            <p class="scene-subtitle">Action ${actIdx + 1} of ${actions.length}: Everyone stand up and move!</p>
          </div>

          <div style="background:radial-gradient(circle at center, #1e1b4b, #090d1a); border:3px solid #8b5cf6; border-radius:var(--wl-radius-lg); padding:40px; max-width:850px; width:100%; text-align:center; box-shadow:var(--wl-shadow);">
            <div style="font-size:5rem; margin-bottom:12px;">${act.icon}</div>
            <div style="font-size:2.4rem; font-family:var(--wl-font-display); font-weight:900; color:#fef08a; margin-bottom:10px;">
              "${act.sentence}"
            </div>
            <div style="font-size:1.4rem; font-weight:800; color:#38bdf8; margin-bottom:12px;">
              ${act.actionTitle}
            </div>
            <p style="font-size:1.15rem; color:#cbd5e1; max-width:600px; margin:0 auto 24px auto;">
              ${act.instruction}
            </p>

            <div style="display:flex; gap:16px; justify-content:center; align-items:center;">
              <button type="button" class="hud-btn" style="padding:12px 20px; font-size:1rem;" onclick="window.wonderlandApp.speak('${act.audioPrompt}')">
                🔊 Audio Command
              </button>
              <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.nextTprAction()">
                <span>${actIdx + 1 >= actions.length ? 'Finish Acting! ➔' : 'Next Action ➔'}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 10: THE MYSTERIOUS WORKSHOP CHEST (Prop Unveiling)
    // =========================================================================
    renderScreen10(container) {
      const props = this.data.chestProps;
      const isOpen = this.app.state.chestIsOpen;

      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="chest-unveiling-wrap">
            <div class="scene-title-group" style="margin-bottom:16px;">
              <h2 class="scene-main-title">🧰 The Mysterious Workshop Chest</h2>
              <p class="scene-subtitle">${isOpen ? 'THEY ARE OUR THEATRE PROPS! 🎭' : 'Tap the giant locked chest to see what is inside!'}</p>
            </div>

            <!-- Giant Chest Artwork -->
            <div class="mystery-chest-box" onclick="window.wonderlandApp.openChest()">
              <svg viewBox="0 0 200 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#b45309"/>
                    <stop offset="50%" stop-color="#78350f"/>
                    <stop offset="100%" stop-color="#451a03"/>
                  </linearGradient>
                  <linearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="100%" stop-color="#f59e0b"/>
                  </linearGradient>
                </defs>
                <!-- Chest Body -->
                <rect x="25" y="70" width="150" height="90" rx="10" fill="url(#chestWood)" stroke="#f59e0b" stroke-width="3"/>
                <!-- Chest Bands -->
                <rect x="45" y="70" width="14" height="90" fill="url(#chestGold)"/>
                <rect x="141" y="70" width="14" height="90" fill="url(#chestGold)"/>
                <!-- Chest Lid -->
                <path d="M 20 75 Q 100 ${isOpen ? '10' : '20'} 180 75 Z" fill="url(#chestWood)" stroke="#f59e0b" stroke-width="3"/>
                <!-- Keyhole / Padlock -->
                <circle cx="100" cy="110" r="14" fill="url(#chestGold)"/>
                <circle cx="100" cy="106" r="4" fill="#000"/>
                <polygon points="98,108 102,108 101,118 99,118" fill="#000"/>
              </svg>
            </div>

            ${!isOpen ? `
              <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.openChest()">
                <span>🔓 UNLOCK THE CHEST</span>
              </button>
            ` : `
              <div class="props-revealed-grid">
                ${props.map(p => `
                  <div class="prop-reveal-chip">
                    <span style="font-size:2rem;">${p.icon}</span>
                    <div>
                      <div style="color:#fef08a;">${p.name}</div>
                      <div style="font-size:0.75rem; color:#cbd5e1; font-weight:600;">${p.detail}</div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div style="margin-top:24px;">
                <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.nextScreen()">
                  <span>OUR BIG MISSION ➔</span>
                </button>
              </div>
            `}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 11: OUR BIG MISSION (The Stage)
    // =========================================================================
    renderScreen11(container) {
      const steps = this.data.missionSteps;
      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="theatre-stage-frame">
            <!-- Stage Velvet Curtains SVG Accent -->
            <div style="position:absolute; top:0; left:0; right:0; height:60px; pointer-events:none;">
              <svg viewBox="0 0 1000 60" width="100%" height="100%" preserveAspectRatio="none">
                <path d="M 0 0 Q 125 50 250 15 Q 375 50 500 15 Q 625 50 750 15 Q 875 50 1000 0 L 1000 0 L 0 0 Z" fill="#e11d48"/>
              </svg>
            </div>

            <div style="font-size:1.15rem; font-weight:900; color:#f59e0b; letter-spacing:2px; margin-bottom:14px;">
              THEATRE WORKSHOP &amp; PLAY PREP
            </div>

            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:28px;">
              ${steps.map((text, i) => `
                <div style="font-family:var(--wl-font-display); font-size:${i === steps.length - 1 ? '2.4rem' : '1.4rem'}; font-weight:900; color:${i === steps.length - 1 ? '#fef08a' : '#ffffff'}; text-shadow:0 2px 10px rgba(0,0,0,0.5);">
                  ${text}
                </div>
              `).join('')}
            </div>

            <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.nextScreen()">
              <span>ARE YOU READY? YES! ➔</span>
            </button>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 12: EXIT TICKET (Oral Assessment Support)
    // =========================================================================
    renderScreen12(container) {
      const tickets = this.data.exitTickets;
      const current = tickets[this.app.state.exitTicketIndex || 0];

      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div class="scene-title-group">
            <h2 class="scene-main-title">🎫 Exit Ticket: Tell Me One Sentence!</h2>
            <p class="scene-subtitle">Look at the Wonderland object and say your sentence!</p>
          </div>

          <div style="background:var(--wl-bg-card); border:3px solid rgba(245,158,11,0.4); border-radius:var(--wl-radius-lg); padding:36px; max-width:800px; width:100%; text-align:center; box-shadow:var(--wl-shadow);">
            <div style="font-size:5.5rem; margin-bottom:12px; filter:drop-shadow(0 0 20px rgba(245,158,11,0.5));">
              ${current.icon}
            </div>

            <div style="font-size:1.8rem; font-weight:900; color:#f59e0b; margin-bottom:8px;">
              ${current.name}
            </div>

            <div style="background:rgba(15,23,42,0.8); border:1.5px solid rgba(255,255,255,0.15); border-radius:var(--wl-radius-md); padding:16px 20px; margin:20px 0; text-align:left;">
              <div style="font-size:0.85rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:6px;">
                💡 Speaking Support Frames:
              </div>
              <div style="font-size:1.35rem; font-weight:900; color:#ffffff; margin-bottom:4px;">
                " ${current.target} "
              </div>
              <div style="font-size:1.1rem; font-weight:700; color:#94a3b8;">
                Challenge: " ${current.challenge} "
              </div>
            </div>

            <div style="display:flex; gap:14px; justify-content:center; align-items:center;">
              <button type="button" class="hud-btn" style="padding:14px 22px; font-size:1.05rem;" onclick="window.wonderlandApp.randomExitTicket()">
                🎲 Random Prop
              </button>
              <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.renderCelebration()">
                <span>COMPLETE LESSON 1 🏆</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // FINAL CELEBRATION REWARD SCREEN
    // =========================================================================
    renderCelebration(container) {
      container.innerHTML = `
        <div class="wonderland-scene-wrap">
          <div style="background:radial-gradient(circle at center, #1e1b4b, #090d1a); border:3.5px solid #f59e0b; border-radius:var(--wl-radius-lg); padding:48px 36px; max-width:850px; width:100%; text-align:center; box-shadow:var(--wl-shadow);">
            <div style="font-size:6rem; margin-bottom:12px; filter:drop-shadow(0 0 30px rgba(245,158,11,0.7));">
              🏆
            </div>

            <h1 style="font-family:var(--wl-font-display); font-size:2.8rem; font-weight:900; color:#fef08a; margin-bottom:6px;">
              WONDERLAND EXPLORER
            </h1>

            <p style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:18px;">
              You entered Wonderland and discovered the characters and props!
            </p>

            <div style="display:inline-flex; align-items:center; gap:10px; background:rgba(245,158,11,0.2); border:2px solid #f59e0b; border-radius:30px; padding:8px 24px; font-size:1.4rem; font-weight:900; color:#fef08a; margin-bottom:28px;">
              ⭐ +10 BONUS WONDERLAND XP!
            </div>

            <!-- Lesson 2 Teaser -->
            <div style="background:rgba(15,23,42,0.9); border:2px dashed #8b5cf6; border-radius:var(--wl-radius-md); padding:20px; max-width:650px; margin:0 auto 28px auto;">
              <div style="font-size:0.9rem; font-weight:800; color:#a855f7; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
                ⏰ NEXT LESSON PREVIEW
              </div>
              <div style="font-size:1.4rem; font-weight:900; color:#ffffff;">
                Lesson 2: The Wonderland Time Machine
              </div>
              <div style="font-size:1.05rem; color:#cbd5e1; margin-top:4px;">
                "What happened to Alice? Find out in our next adventure!"
              </div>
            </div>

            <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
              <a href="../index.html#library" class="hud-btn" style="padding:14px 28px; font-size:1.1rem; background:rgba(255,255,255,0.1);">
                📚 Back to Library
              </a>
              <button type="button" class="wl-btn-giant" onclick="window.wonderlandApp.restartLesson()">
                <span>🔄 Replay Lesson 1</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  root.WonderlandScenes = WonderlandScenes;

})(typeof window !== 'undefined' ? window : global);
