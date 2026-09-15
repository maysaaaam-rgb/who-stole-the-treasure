/**
 * WONDERLAND STORY SCENE RENDERERS (11 SCREENS + CELEBRATION)
 * Theatrical Stage Vector Illustrations & Smart Board Touch Interactions
 */

(function(root) {
  'use strict';

  class WonderlandStoryScenes {
    constructor(app) {
      this.app = app;
      this.data = root.WONDERLAND_STORY_DATA;
    }

    // =========================================================================
    // SCREEN 1: WELCOME BACK TO WONDERLAND
    // =========================================================================
    renderScreen1(container) {
      const d = this.data.screen1;
      const isEntered = this.app.state.enteredPortal;

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h1 class="scene-main-title">🎭 ${d.title}</h1>
            <p class="scene-subtitle">"${d.subtitle}"</p>
          </div>

          <!-- Theatrical Wonderland Entrance SVG -->
          <div style="width:280px; height:240px; margin:0 auto 20px auto;">
            <svg viewBox="0 0 240 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fef08a"/>
                  <stop offset="60%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#1e1b4b"/>
                </radialGradient>
              </defs>
              <!-- Stage Velvet Curtains -->
              <path d="M 0 0 L 240 0 L 240 50 Q 180 30 120 45 Q 60 30 0 50 Z" fill="#b91c1c"/>
              <path d="M 0 0 L 45 0 L 35 200 L 0 200 Z" fill="#991b1b"/>
              <path d="M 240 0 L 195 0 L 205 200 L 240 200 Z" fill="#991b1b"/>
              <!-- Ancient Oak Tree Door -->
              <path d="M 60 200 C 70 120 85 80 120 50 C 155 80 170 120 180 200 Z" fill="#0f172a"/>
              <path d="M 85 195 C 85 110 155 110 155 195 Z" fill="url(#portalGlow)"/>
              <!-- Golden Keyhole -->
              <circle cx="120" cy="145" r="9" fill="#0f172a"/>
              <polygon points="114,149 126,149 123,165 117,165" fill="#0f172a"/>
              <!-- Magic Mushrooms & Teapot -->
              <circle cx="50" cy="185" r="10" fill="#e11d48"/>
              <circle cx="190" cy="185" r="12" fill="#38bdf8"/>
            </svg>
          </div>

          ${!isEntered ? `
            <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.enterPortal()">
              <span>${d.btnEnter}</span>
            </button>
          ` : `
            <div style="text-align:center; animation:sceneFadeIn 0.3s ease;">
              <div style="font-family:var(--ws-font-display); font-size:1.6rem; font-weight:900; color:#fef08a; margin-bottom:14px;">
                ${d.readyPrompt}
              </div>
              <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
                ${d.readyOptions.map(opt => `
                  <button type="button" class="ws-btn-giant" style="padding:14px 28px; font-size:1.3rem;"
                          onclick="window.wonderlandStoryApp.chooseReadiness('${opt.id}')">
                    <span>${opt.text}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 2: QUICK MEMORY CHALLENGE
    // =========================================================================
    renderScreen2(container) {
      const d = this.data.screen2;
      const qIdx = this.app.state.memoryQuestionIndex || 0;
      const q = d.questions[qIdx] || d.questions[0];

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🧠 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="background:var(--ws-bg-card); border:3px solid #f59e0b; border-radius:var(--ws-radius-lg); padding:32px; width:100%; max-width:820px; text-align:center; box-shadow:var(--ws-shadow); margin-bottom:20px;">
            <div style="font-size:0.85rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:8px;">
              Question ${qIdx + 1} of ${d.questions.length}
            </div>

            <div style="font-size:5rem; margin-bottom:12px; filter:drop-shadow(0 0 20px rgba(245,158,11,0.5));">
              ${q.icon}
            </div>

            <div style="font-family:var(--ws-font-display); font-size:2rem; font-weight:900; color:#ffffff; margin-bottom:16px;">
              ${q.question}
            </div>

            <button type="button" class="hud-btn" style="padding:6px 14px; margin-bottom:20px;" onclick="window.wonderlandStoryApp.speak('${q.audioPrompt}')">
              🔊 Hear Clue
            </button>

            <!-- 3 Choices -->
            <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
              ${q.choices.map(choice => `
                <button type="button" class="hud-btn" style="padding:14px 28px; font-size:1.25rem; min-height:60px;"
                        onclick="window.wonderlandStoryApp.answerMemoryQuestion('${choice}')">
                  ${choice}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 3: WHAT HAPPENED? (Illustrated Sequencing)
    // =========================================================================
    renderScreen3(container) {
      const d = this.data.screen3;
      const placed = this.app.state.whatHappenedPlaced || [];
      const allPlaced = placed.length === d.correctOrder.length;

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🕵️ ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Timeline 1 to 4 -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; width:100%; max-width:1100px; margin-bottom:24px;">
            ${d.correctOrder.map((sceneId, slotIdx) => {
              const isFilled = slotIdx < placed.length;
              const scene = isFilled ? d.scenes.find(s => s.id === placed[slotIdx]) : null;
              return `
                <div style="background:var(--ws-bg-card); border:2.5px solid ${isFilled ? '#10b981' : 'rgba(245,158,11,0.3)'}; border-radius:var(--ws-radius-md); padding:18px; text-align:center; min-height:200px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div style="font-size:0.85rem; font-weight:800; color:#38bdf8;">Step ${slotIdx + 1}</div>
                  ${scene ? `
                    <div style="font-size:3rem; margin:6px 0;">${scene.icon}</div>
                    <div style="font-size:1.05rem; font-weight:900; color:#fef08a;">${scene.sentence}</div>
                    <div style="font-size:0.75rem; font-weight:800; color:#10b981; margin-top:4px;">VERB: ${scene.verb}</div>
                  ` : `
                    <div style="font-size:2rem; margin:20px 0; color:#64748b;">⏳</div>
                    <div style="font-size:0.85rem; color:#94a3b8;">Waiting for scene...</div>
                  `}
                </div>
              `;
            }).join('')}
          </div>

          ${!allPlaced ? `
            <div style="width:100%; max-width:1100px;">
              <div style="font-size:0.95rem; font-weight:800; color:#38bdf8; margin-bottom:10px;">
                👇 Tap what happened next:
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                ${d.scenes.filter(s => !placed.includes(s.id)).map(scene => `
                  <button type="button" class="hud-btn" style="padding:12px 20px; font-size:1.05rem; min-height:56px;"
                          onclick="window.wonderlandStoryApp.placeWhatHappened('${scene.id}')">
                    <span style="font-size:1.6rem;">${scene.icon}</span>
                    <span>${scene.title}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <div style="display:flex; gap:14px; align-items:center;">
              <button type="button" class="hud-btn" onclick="window.wonderlandStoryApp.resetWhatHappened()">
                🔄 Reset Order
              </button>
              <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
                <span>BUILD THE STORY ➔</span>
              </button>
            </div>
          `}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 4: BUILD THE STORY (Interactive Story Builder)
    // =========================================================================
    renderScreen4(container) {
      const d = this.data.screen4;
      const selected = this.app.state.storyBuilderSelected || [];

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">📚 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Selected Story Timeline -->
          <div class="story-timeline-shelf">
            ${selected.length === 0 ? `
              <div style="padding:20px; color:#94a3b8; font-weight:700; width:100%; text-align:center;">
                Tap cards below to build Alice's adventure story! (3 to 5 cards)
              </div>
            ` : selected.map((cardId, idx) => {
              const card = d.cards.find(c => c.id === cardId);
              return `
                <div class="timeline-event-card is-active-step" onclick="window.wonderlandStoryApp.removeStoryCard('${card.id}')">
                  <div style="font-size:0.75rem; font-weight:800; color:#38bdf8;">#${idx + 1}</div>
                  <div style="font-size:2.2rem; margin:4px 0;">${card.icon}</div>
                  <div style="font-size:0.95rem; font-weight:900; color:#fef08a;">${card.phrase}</div>
                  <div style="font-size:0.7rem; color:#f87171; margin-top:4px;">Tap to remove</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Cards Available to Pick -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; width:100%; max-width:1100px; margin-bottom:20px;">
            ${d.cards.map(card => {
              const isPicked = selected.includes(card.id);
              return `
                <div style="background:rgba(30,41,59,0.8); border:2px solid ${isPicked ? '#10b981' : 'rgba(255,255,255,0.15)'}; border-radius:var(--ws-radius-md); padding:14px 8px; text-align:center; cursor:pointer;"
                     onclick="window.wonderlandStoryApp.toggleStoryCard('${card.id}')">
                  <div style="font-size:2.2rem; margin-bottom:4px;">${card.icon}</div>
                  <div style="font-size:0.95rem; font-weight:900; color:#ffffff;">${card.name}</div>
                  <div style="font-size:0.75rem; font-weight:800; color:#f59e0b;">${card.verb}</div>
                </div>
              `;
            }).join('')}
          </div>

          ${selected.length >= 3 ? `
            <div style="display:flex; gap:12px; align-items:center;">
              <button type="button" class="hud-btn" onclick="window.wonderlandStoryApp.readFullGeneratedStory()">
                🔊 Read Full Story
              </button>
              <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
                <span>CHARACTER VOICES ➔</span>
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 5: CHARACTER VOICE CHALLENGE
    // =========================================================================
    renderScreen5(container) {
      const d = this.data.screen5;
      const selectedChar = this.app.state.selectedVoiceChar || d.characters[0];

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🗣️ ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Character Selector Pills -->
          <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:20px;">
            ${d.characters.map(c => `
              <button type="button" class="hud-btn ${c.id === selectedChar.id ? 'primary' : ''}"
                      style="border-color:${c.badgeColor};"
                      onclick="window.wonderlandStoryApp.selectVoiceChar('${c.id}')">
                <span>${c.icon}</span>
                <span>${c.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Character Stage Card -->
          <div style="background:var(--ws-bg-card); border:3px solid ${selectedChar.badgeColor}; border-radius:var(--ws-radius-lg); padding:32px; width:100%; max-width:850px; text-align:center; box-shadow:var(--ws-shadow); margin-bottom:20px;">
            <div style="font-size:4.5rem; margin-bottom:8px;">${selectedChar.icon}</div>
            <div style="font-family:var(--ws-font-display); font-size:2rem; font-weight:900; color:${selectedChar.badgeColor}; margin-bottom:12px;">
              ${selectedChar.name}
            </div>

            <!-- 2-3 Lines -->
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">
              ${selectedChar.lines.map(line => `
                <div style="font-size:1.35rem; font-weight:900; color:#ffffff; background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 16px;">
                  "${line}"
                </div>
              `).join('')}
            </div>

            <div style="font-size:1.1rem; color:#fef08a; font-style:italic; margin-bottom:20px;">
              🎭 Acting Cue: "${selectedChar.actionPrompt}"
            </div>

            <!-- Action Buttons: LISTEN / SAY IT / ACT IT -->
            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
              <button type="button" class="hud-btn" style="padding:10px 20px; font-size:1.05rem;"
                      onclick="window.wonderlandStoryApp.speakCharacterLines()">
                🔊 LISTEN
              </button>
              <button type="button" class="hud-btn" style="padding:10px 20px; font-size:1.05rem;"
                      onclick="window.wonderlandStoryApp.promptSayIt()">
                🎤 SAY IT
              </button>
              <button type="button" class="hud-btn primary" style="padding:10px 20px; font-size:1.05rem;"
                      onclick="window.wonderlandStoryApp.promptActIt()">
                🎭 ACT IT
              </button>
            </div>
          </div>

          <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
            <span>FREEZE FRAME THEATRE ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 6: FREEZE FRAME THEATRE
    // =========================================================================
    renderScreen6(container) {
      const d = this.data.screen6;
      const sceneIdx = this.app.state.freezeSceneIndex || 0;
      const currentScene = d.scenes[sceneIdx] || d.scenes[0];
      const isFreezing = this.app.state.isFreezeActive;

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🧊 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="background:var(--ws-bg-card); border:3.5px solid #38bdf8; border-radius:var(--ws-radius-lg); padding:32px; width:100%; max-width:850px; text-align:center; box-shadow:var(--ws-shadow); position:relative; margin-bottom:20px; overflow:hidden;">
            <div style="font-size:0.85rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:8px;">
              Scene ${sceneIdx + 1} of ${d.scenes.length}
            </div>

            <div style="font-size:5rem; margin-bottom:10px;">${currentScene.icon}</div>

            <div style="font-family:var(--ws-font-display); font-size:2.2rem; font-weight:900; color:#fef08a; margin-bottom:8px;">
              ${currentScene.title}
            </div>

            <div style="font-size:1.25rem; font-weight:800; color:#ffffff; margin-bottom:16px;">
              Pose: "${currentScene.pose}"
            </div>

            ${isFreezing ? `
              <div class="freeze-active-alert">
                <div style="font-family:var(--ws-font-display); font-size:4.5rem; font-weight:900; color:#fef08a; text-shadow:0 0 30px #e11d48; margin-bottom:10px;">
                  🧊 FREEZE!
                </div>
                <div style="font-size:1.6rem; font-weight:900; color:#ffffff;">
                  What happened?
                </div>
                <div style="font-size:1.4rem; font-weight:800; color:#38bdf8; margin-top:6px;">
                  "${currentScene.sentence}"
                </div>
              </div>
            ` : ''}

            <div style="display:flex; gap:14px; justify-content:center; align-items:center; margin-top:20px;">
              <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.startFreezeGame()">
                <span>▶ START MUSIC &amp; FREEZE</span>
              </button>
              <button type="button" class="hud-btn" onclick="window.wonderlandStoryApp.nextFreezeScene()">
                🎲 Next Scene
              </button>
            </div>
          </div>

          <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
            <span>CREATE MINI SCENE ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 7: CREATE OUR MINI SCENE
    // =========================================================================
    renderScreen7(container) {
      const d = this.data.screen7;
      const selectedPresetId = this.app.state.selectedScenePreset || "sc-teaparty";
      const preset = d.presets.find(p => p.id === selectedPresetId) || d.presets[0];

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🎬 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Preset Setting Chips -->
          <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:20px;">
            ${d.presets.map(p => `
              <button type="button" class="hud-btn ${p.id === preset.id ? 'primary' : ''}"
                      onclick="window.wonderlandStoryApp.selectScenePreset('${p.id}')">
                <span>${p.icon}</span>
                <span>${p.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Scene Building Canvas -->
          <div style="background:var(--ws-bg-card); border:2.5px solid #f59e0b; border-radius:var(--ws-radius-lg); padding:24px; width:100%; max-width:920px; box-shadow:var(--ws-shadow); margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:10px;">
              <h3 style="font-size:1.3rem; font-weight:900; color:#fef08a; margin:0;">
                ${preset.icon} ${preset.name}
              </h3>
              <span style="font-size:0.85rem; color:#38bdf8; font-weight:800;">Classroom Group Rehearsal</span>
            </div>

            <!-- Characters, Props, Actions Grid -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; margin-bottom:16px;">
              <div style="background:rgba(30,41,59,0.8); padding:14px; border-radius:10px;">
                <div style="font-size:0.85rem; font-weight:800; color:#f59e0b; margin-bottom:6px;">🎭 ACTORS:</div>
                <div style="font-size:1.05rem; font-weight:700; color:#fff;">${preset.availableCharacters.join(' · ')}</div>
              </div>
              <div style="background:rgba(30,41,59,0.8); padding:14px; border-radius:10px;">
                <div style="font-size:0.85rem; font-weight:800; color:#38bdf8; margin-bottom:6px;">🧰 PROPS NEEDED:</div>
                <div style="font-size:1.05rem; font-weight:700; color:#fff;">${preset.availableProps.join(' · ')}</div>
              </div>
            </div>

            <div style="background:rgba(15,23,42,0.9); border:1.5px solid rgba(255,255,255,0.1); border-radius:10px; padding:14px;">
              <div style="font-size:0.85rem; font-weight:800; color:#10b981; margin-bottom:6px;">📖 SCENE STORY MOMENTS:</div>
              ${preset.sentenceCards.map(s => `
                <div style="font-size:1.05rem; color:#e2e8f0; margin-bottom:4px;">• "${s}"</div>
              `).join('')}
            </div>
          </div>

          <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
            <span>GENERATE MINI SCRIPT ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 8: MINI SCRIPT BUILDER
    // =========================================================================
    renderScreen8(container) {
      const d = this.data.screen8;
      const presetId = this.app.state.selectedScenePreset || "sc-teaparty";
      const scriptLines = d.scripts[presetId] || d.scripts["sc-teaparty"];

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">📜 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Script Parchment -->
          <div class="script-parchment-box">
            <div style="text-align:center; font-family:serif; font-size:1.3rem; font-weight:900; color:#78350f; border-bottom:2px solid #b45309; padding-bottom:8px; margin-bottom:16px;">
              ACT I: ${presetId.replace('sc-', '').toUpperCase()} REHEARSAL SCRIPT
            </div>

            ${scriptLines.map((line, idx) => `
              <div class="script-dialogue-row">
                <div class="script-speaker-tag">${line.speaker}:</div>
                <div class="script-line-text">"${line.line}"</div>
                <button type="button" class="hud-btn" style="padding:4px 10px; font-size:0.75rem; background:#78350f; color:#fff;"
                        onclick="window.wonderlandStoryApp.speak('${line.speech}')">
                  🔊
                </button>
              </div>
            `).join('')}
          </div>

          <!-- Theatrical Controls -->
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <button type="button" class="hud-btn" onclick="window.wonderlandStoryApp.readEntireScript(1.0)">
              🔊 READ ENTIRE SCRIPT
            </button>
            <button type="button" class="hud-btn" onclick="window.wonderlandStoryApp.readEntireScript(0.78)">
              🐢 SLOW AUDIO
            </button>
            <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
              <span>EQUIP THEATRE PROPS ➔</span>
            </button>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 9: PROP CONNECTION
    // =========================================================================
    renderScreen9(container) {
      const d = this.data.screen9;
      const equipped = this.app.state.equippedProps || [];

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🧰 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <div style="font-size:1.1rem; font-weight:900; color:#fef08a; margin-bottom:14px;">
            EQUIPPED FOR YOUR PLAY: ${equipped.length} PROPS
          </div>

          <!-- 11 Props Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; width:100%; max-width:1050px; margin-bottom:24px;">
            ${d.allProps.map(prop => {
              const isEquipped = equipped.includes(prop.id);
              return `
                <div style="background:rgba(30,41,59,0.8); border:2.5px solid ${isEquipped ? '#10b981' : 'rgba(245,158,11,0.3)'}; border-radius:var(--ws-radius-md); padding:16px 8px; text-align:center; cursor:pointer;"
                     onclick="window.wonderlandStoryApp.toggleProp('${prop.id}')">
                  <div style="font-size:2.6rem; margin-bottom:4px;">${prop.icon}</div>
                  <div style="font-size:0.95rem; font-weight:900; color:${isEquipped ? '#fef08a' : '#ffffff'};">
                    ${prop.name}
                  </div>
                  <div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">
                    ${isEquipped ? '✓ Equipped' : 'Tap to equip'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
            <span>FINAL PERFORMANCE STAGE ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 10: FINAL PERFORMANCE CHALLENGE
    // =========================================================================
    renderScreen10(container) {
      const d = this.data.screen10;
      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🌟 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- Theatre Footlights & Stage Backdrop -->
          <div style="background:radial-gradient(circle at center, #1e1b4b, #090d1f); border:3px solid #b91c1c; border-radius:var(--ws-radius-lg); padding:36px; width:100%; max-width:900px; text-align:center; box-shadow:var(--ws-shadow-theatre); margin-bottom:24px;">
            <div style="font-size:4.5rem; margin-bottom:12px;">🎭✨</div>
            <div style="font-family:var(--ws-font-display); font-size:2.2rem; font-weight:900; color:#fef08a; margin-bottom:10px;">
              ${d.promptChallenge}
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; max-width:650px; margin:0 auto 20px auto;">
              ${d.starterFrames.map(frame => `
                <div style="font-size:1.25rem; font-weight:800; color:#ffffff; background:rgba(15,23,42,0.75); padding:8px 16px; border-radius:8px;">
                  • "${frame}"
                </div>
              `).join('')}
            </div>

            <button type="button" class="hud-btn" style="padding:10px 22px; font-size:1.1rem;" onclick="window.wonderlandStoryApp.triggerApplause()">
              👏 Play Audience Applause!
            </button>
          </div>

          <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.nextScreen()">
            <span>EXIT TICKET ➔</span>
          </button>
        </div>
      `;
    }

    // =========================================================================
    // SCREEN 11: EXIT TICKET
    // =========================================================================
    renderScreen11(container) {
      const d = this.data.screen11;
      const checked = this.app.state.exitTicketSelections || [];

      container.innerHTML = `
        <div class="ws-scene-wrap">
          <div class="scene-title-box">
            <h2 class="scene-main-title">🎫 ${d.title}</h2>
            <p class="scene-subtitle">${d.subtitle}</p>
          </div>

          <!-- 4 Visual Choices -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px; width:100%; max-width:850px; margin-bottom:24px;">
            ${d.choices.map(c => {
              const isSelected = checked.includes(c.id);
              return `
                <div style="background:rgba(30,41,59,0.85); border:2.5px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.15)'}; border-radius:var(--ws-radius-md); padding:18px; text-align:center; cursor:pointer;"
                     onclick="window.wonderlandStoryApp.toggleExitChoice('${c.id}')">
                  <div style="font-size:2.8rem; margin-bottom:6px;">${c.icon}</div>
                  <div style="font-size:1.05rem; font-weight:900; color:#ffffff;">${c.text}</div>
                  <div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">${isSelected ? '✓ Selected' : 'Tap to mark'}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Oral Speaking Starters -->
          <div style="background:rgba(15,23,42,0.9); border:2px solid rgba(255,255,255,0.15); border-radius:var(--ws-radius-md); padding:18px 24px; width:100%; max-width:850px; margin-bottom:24px;">
            <div style="font-size:0.9rem; font-weight:800; color:#38bdf8; text-transform:uppercase; margin-bottom:6px;">
              🗣️ Say ONE sentence about Wonderland:
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              ${d.speakingStarters.map(s => `
                <span style="font-size:1.1rem; font-weight:800; color:#fef08a; background:rgba(30,41,59,0.8); padding:6px 14px; border-radius:20px;">
                  "${s}"
                </span>
              `).join('')}
            </div>
          </div>

          <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.renderCelebration()">
            <span>CLAIM HERO REWARDS 🏆</span>
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
        <div class="ws-scene-wrap">
          <div style="background:radial-gradient(circle at center, #1e1b4b, #090d1a); border:3.5px solid #f59e0b; border-radius:var(--ws-radius-lg); padding:44px 36px; max-width:880px; width:100%; text-align:center; box-shadow:var(--ws-shadow-gold);">
            <div style="font-size:5.5rem; margin-bottom:12px; filter:drop-shadow(0 0 30px rgba(245,158,11,0.7));">
              🏆
            </div>

            <h1 style="font-family:var(--ws-font-display); font-size:2.8rem; font-weight:900; color:#fef08a; margin-bottom:6px;">
              ${d.title}
            </h1>

            <p style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:20px;">
              "${d.subtitle}"
            </p>

            <div style="display:inline-flex; align-items:center; gap:10px; background:rgba(245,158,11,0.2); border:2px solid #f59e0b; border-radius:30px; padding:8px 24px; font-size:1.4rem; font-weight:900; color:#fef08a; margin-bottom:24px;">
              ⭐ +${d.bonusXp} BONUS WONDERLAND XP!
            </div>

            <!-- 4 Achievement Stars -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; max-width:750px; margin:0 auto 28px auto;">
              ${d.stars.map(s => `
                <div style="background:rgba(15,23,42,0.9); border:1.5px solid #38bdf8; border-radius:10px; padding:14px;">
                  <div style="font-size:2rem; margin-bottom:4px;">${s.icon}</div>
                  <div style="font-size:0.9rem; font-weight:900; color:#fff;">${s.label}</div>
                </div>
              `).join('')}
            </div>

            <!-- Transition to Physical Workshop -->
            <div style="background:rgba(15,23,42,0.9); border:2px dashed #10b981; border-radius:var(--ws-radius-md); padding:20px; max-width:700px; margin:0 auto 28px auto;">
              <div style="font-size:1.3rem; font-weight:900; color:#34d399; margin-bottom:6px;">
                ${d.nextStopTitle}
              </div>
              <div style="font-size:1.05rem; color:#e2e8f0;">
                ${d.nextStopDesc}
              </div>
            </div>

            <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
              <a href="../index.html#library" class="hud-btn" style="padding:14px 28px; font-size:1.1rem; background:rgba(255,255,255,0.1);">
                📚 Back to Library
              </a>
              <button type="button" class="ws-btn-giant" onclick="window.wonderlandStoryApp.restartLesson()">
                <span>🔄 Replay Lesson 3</span>
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
              🧑‍🏫 Teacher Guide &amp; Theatre Rubric · Screen ${this.app.currentScreen}
            </h3>
            <span style="font-size:0.85rem; color:#38bdf8; font-weight:700;">Timing: ${g.timing}</span>
          </div>
          <button type="button" class="hud-btn" onclick="window.wonderlandStoryApp.closeTeacherDrawer()">✕ Close</button>
        </div>

        <!-- Screen Fast Jumps (S1 to S11) -->
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px;">
          ${Array.from({ length: 11 }).map((_, i) => {
            const num = i + 1;
            return `
              <button type="button" class="hud-btn ${num === this.app.currentScreen ? 'primary' : ''}" style="padding:6px 12px; font-size:0.85rem;"
                      onclick="window.wonderlandStoryApp.renderScreen(${num}); window.wonderlandStoryApp.openTeacherDrawer();">
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
            📋 Teacher Observation Checklist (Grade 3 A1 Performance)
          </h4>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.recallsCharacters ? 'checked' : ''} onchange="window.wonderlandStoryApp.toggleRubric('recallsCharacters')">
            <span>Recognizes core Wonderland characters and props</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.ordersStory ? 'checked' : ''} onchange="window.wonderlandStoryApp.toggleRubric('ordersStory')">
            <span>Sequences 4 story events chronologically</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.usesPastSimple ? 'checked' : ''} onchange="window.wonderlandStoryApp.toggleRubric('usesPastSimple')">
            <span>Uses Past Simple affirmative forms orally</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.actsInRole ? 'checked' : ''} onchange="window.wonderlandStoryApp.toggleRubric('actsInRole')">
            <span>Performs character lines with gestures and facial expressions</span>
          </label>
          <label class="rubric-checkbox-row">
            <input type="checkbox" ${rubric.teamworkRehearsal ? 'checked' : ''} onchange="window.wonderlandStoryApp.toggleRubric('teamworkRehearsal')">
            <span>Collaborates with peers during mini-scene rehearsal</span>
          </label>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button type="button" class="hud-btn" onclick="window.wonderlandStoryApp.restartLesson(); window.wonderlandStoryApp.closeTeacherDrawer();">
            🔄 Restart Lesson
          </button>
          <a href="worksheet.html" target="_blank" class="hud-btn" style="background:#f0fdf4; color:#166534; font-weight:800;">
            🖨️ Open Companion Play Dossier ➔
          </a>
        </div>
      `;
    }
  }

  root.WonderlandStoryScenes = WonderlandStoryScenes;

})(typeof window !== 'undefined' ? window : global);
