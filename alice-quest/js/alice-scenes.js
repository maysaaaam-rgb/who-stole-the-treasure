/**
 * ALICE'S WONDERLAND READING QUEST — SCENE RENDERERS
 * Dynamic DOM Renderers for All 14 Interactive Stages
 */

(function(root) {
  'use strict';

  class AliceSceneRenderer {
    constructor() {
      this.rabbitHopCount = 0;
      this.storySlotAssignments = {};
      this.activeSituationIdx = 0;
      this.selectedWorld = "dragon";
      this.skimCountdown = 8;
      this.skimTimer = null;
      this.isSkimBlurred = false;
      this.selectedSkimItems = [];
      this.activeSpeedMissionIdx = 0;
      this.activeScenarioIdx = 0;
      this.bossCountdown = 12;
      this.bossTimer = null;
      this.isBossBlurred = false;
    }

    // =========================================================================
    // LESSON 1 — STAGE 1: FOLLOW THE RABBIT (0–5 min)
    // =========================================================================
    renderFollowRabbit(container, state) {
      const data = root.ALICE_DATA.lesson1.mission1;
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Level 1 (0–5 min) • Riverbank Induction</span>
              <h2 class="stage-main-title">🐇 Mission 1: Follow the White Rabbit!</h2>
              <p class="stage-instruction">${data.rabbitHopPrompt}</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.playRabbitDialogue()">
                🔊 <span>Hear Rabbit & Alice</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">
              🗣️ Dialogue: <span class="highlight">Rabbit: "Come on!"</span> • <span class="highlight">Alice: "Wait!"</span>
            </div>
            <button class="hud-btn" onclick="window.aliceAudio.speak('Come on! Wait! Where are you going?')">🔊 Speak</button>
          </div>

          <div class="rabbit-field-container" id="rabbit-field">
            <div class="river-backdrop"></div>

            <!-- Alice Sitting by River -->
            <div style="position:absolute; bottom:30px; left:40px; font-size:3.5rem; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
              👧🌳
              <div style="font-size:0.85rem; font-weight:800; color:#cbd5e1; text-align:center;">Alice & Sister</div>
            </div>

            <!-- Moving White Rabbit -->
            <div class="rabbit-runner" id="rabbit-runner-actor" style="left:260px; bottom:60px;" onclick="window.aliceApp.tapRabbit()">
              <div class="speech-bubble-pop" id="rabbit-speech-pop">"Come on! I am late!" 🐇</div>
              <div class="rabbit-icon">🐇</div>
              <span style="font-size:0.8rem; font-weight:900; color:var(--alice-gold); background:rgba(0,0,0,0.6); padding:2px 8px; border-radius:10px;">
                Tap Me! 👆
              </span>
            </div>

            <!-- Rabbit Hole Target -->
            <div class="rabbit-hole-target" id="rabbit-hole-box" style="display:none;" onclick="window.aliceApp.jumpIntoHole()">
              <div class="hole-graphic">🕳️</div>
              <button class="action-btn purple" style="font-size:1.15rem; font-weight:900; padding:10px 20px;">
                🌀 JUMP INTO THE HOLE!
              </button>
            </div>
          </div>

          <div class="kinesthetic-banner" id="jump-kinesthetic-banner" style="margin-top:16px; display:none;">
            <span>🏃 CLASSROOM ACTION:</span>
            <strong>Everybody stand up! On count of 3... JUMP! 1... 2... 3... JUMP!</strong>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:16px;">
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson1', 2)">
              <span>Next: What Happened?</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 2: WHAT HAPPENED? (5–10 min)
    // =========================================================================
    renderWhatHappened(container, state) {
      const cards = root.ALICE_DATA.lesson1.storyCards;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Level 2 (5–10 min) • Sequence Reconstruction</span>
              <h2 class="stage-main-title">🧩 Mission 2: What Happened?</h2>
              <p class="stage-instruction">Help Alice! Tap the pictures in the correct order: 1 to 6!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.checkStorySequence()">
                ✨ <span>Check Order</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">
              🗣️ Sequence Language: <span class="highlight">"First... Second... Third... Fourth... Fifth... Last!"</span>
            </div>
            <button class="hud-btn" onclick="window.aliceAudio.speak('First, second, third, fourth, fifth, last!')">🔊 Listen</button>
          </div>

          <!-- 6 Ordered Target Slots -->
          <div class="story-timeline-slots">
      `;

      for (let i = 1; i <= 6; i++) {
        const assigned = this.storySlotAssignments[i];
        html += `
          <div class="story-slot ${assigned ? 'filled' : ''}" id="story-slot-${i}" onclick="window.aliceApp.clearStorySlot(${i})">
            <span class="story-slot-tag">Step ${i}</span>
            <div style="font-size:2.2rem;">${assigned ? assigned.icon : '❓'}</div>
            <div style="font-size:0.8rem; font-weight:800; color:#e2e8f0; margin-top:4px;">
              ${assigned ? assigned.title : '<span style="color:#64748b;">Tap a card</span>'}
            </div>
          </div>
        `;
      }

      html += `
          </div>

          <!-- 6 Scrambled Picture Cards (Visual Clues Only) -->
          <div class="story-cards-pool">
      `;

      cards.forEach(c => {
        const isAssigned = Object.values(this.storySlotAssignments).some(a => a && a.order === c.order);
        html += `
          <div class="story-picture-card ${isAssigned ? 'assigned' : ''}" id="story-pic-${c.order}" onclick="window.aliceApp.assignCard(${c.order})">
            <div class="story-card-icon">${c.icon}</div>
            <div class="story-card-desc">${c.text}</div>
            <span style="font-size:0.75rem; color:var(--alice-teal); font-weight:800; margin-top:auto;">
              💡 Clue: ${c.hint}
            </span>
          </div>
        `;
      });

      html += `
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson1', 1)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson1', 3)">
              <span>Next: Human Alice</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 3: HUMAN ALICE (10–15 min)
    // =========================================================================
    renderHumanAlice(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Level 3 (10–15 min) • Physical Classroom Theater</span>
              <h2 class="stage-main-title">👥 Mission 3: Human Alice</h2>
              <p class="stage-instruction">6 students hold the cards at the front of the class! Put them in order, then act it out!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceAudio.speak('One: Sit by the river. Two: Run like the rabbit. Three: Jump into the hole. Four: Fall down. Five: Land softly. Six: Find the golden key!')">
                🔊 <span>Class Choral Chant</span>
              </button>
            </div>
          </div>

          <div class="kinesthetic-banner">
            <span>🎭 THEATER DIRECTOR: "Fix Alice's Story!"</span>
            <strong>Class shouts: "Who is FIRST? River! Who is SECOND? Rabbit!"</strong>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:20px;">
            <div class="story-picture-card" style="border-color:var(--alice-teal);">
              <div style="font-size:2.4rem;">1. 🌳</div>
              <strong style="color:var(--alice-teal);">1. RIVER</strong>
              <div style="font-size:0.85rem; color:#cbd5e1;">Sit quietly with your sister.</div>
            </div>
            <div class="story-picture-card" style="border-color:var(--alice-gold);">
              <div style="font-size:2.4rem;">2. 🐇</div>
              <strong style="color:var(--alice-gold);">2. RABBIT</strong>
              <div style="font-size:0.85rem; color:#cbd5e1;">Run fast and check your watch!</div>
            </div>
            <div class="story-picture-card" style="border-color:var(--alice-purple);">
              <div style="font-size:2.4rem;">3. 🕳️</div>
              <strong style="color:var(--alice-purple);">3. JUMP</strong>
              <div style="font-size:0.85rem; color:#cbd5e1;">Jump into the dark hole!</div>
            </div>
            <div class="story-picture-card" style="border-color:var(--alice-rose);">
              <div style="font-size:2.4rem;">4. 🌀</div>
              <strong style="color:var(--alice-rose);">4. FALL</strong>
              <div style="font-size:0.85rem; color:#cbd5e1;">Wave arms and float down!</div>
            </div>
            <div class="story-picture-card" style="border-color:var(--alice-green);">
              <div style="font-size:2.4rem;">5. 🌸</div>
              <strong style="color:var(--alice-green);">5. LAND</strong>
              <div style="font-size:0.85rem; color:#cbd5e1;">Land softly: "Thump!"</div>
            </div>
            <div class="story-picture-card" style="border-color:var(--alice-gold);">
              <div style="font-size:2.4rem;">6. 🔑</div>
              <strong style="color:var(--alice-gold);">6. KEY</strong>
              <div style="font-size:0.85rem; color:#cbd5e1;">Find the room of doors & golden key!</div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson1', 2)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson1', 4)">
              <span>Next: Feeling Monster</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 4: FEELING MONSTER (15–22 min)
    // =========================================================================
    renderFeelingMonster(container, state) {
      const feelings = root.ALICE_DATA.lesson1.feelings;
      const sit = root.ALICE_DATA.lesson1.feelingSituations[this.activeSituationIdx || 0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Level 4 (15–22 min) • Emotional Recognition</span>
              <h2 class="stage-main-title">😮 Mission 4: Feeling Monster</h2>
              <p class="stage-instruction">Look at the situation! How does Alice feel? Tap the matching feeling!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.triggerCopyFaceGame()">
                😜 <span>Copy the Face Game!</span>
              </button>
            </div>
          </div>

          <div class="feeling-monster-stage">
            <div class="monster-avatar-box">
              <div class="monster-face-emoji" id="monster-face">😮</div>
            </div>

            <div style="max-width:650px;">
              <span style="font-size:0.85rem; font-weight:900; color:var(--alice-gold); text-transform:uppercase;">Situation #${sit.id}:</span>
              <div style="font-size:1.3rem; font-weight:800; color:#ffffff; margin:6px 0;">
                "${sit.situation}"
              </div>
            </div>

            <!-- 4 Core Feelings Buttons -->
            <div class="feeling-choices-grid">
      `;

      feelings.forEach(f => {
        html += `
          <div class="feeling-btn" id="feeling-btn-${f.id}" onclick="window.aliceApp.chooseFeeling('${f.id}', '${sit.correctFeeling}')">
            <span style="font-size:3rem;">${f.emoji}</span>
            <strong style="font-family:var(--font-heading); font-size:1.05rem; color:#ffffff;">${f.name}</strong>
            <span style="font-size:0.75rem; color:var(--alice-text-muted);">${f.gesture}</span>
          </div>
        `;
      });

      html += `
            </div>

            <div id="feeling-feedback" style="display:none; width:100%; max-width:650px;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson1', 3)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson1', 5)">
              <span>Next: Feeling Detective</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 5: FEELING DETECTIVE (22–27 min)
    // =========================================================================
    renderFeelingDetective(container, state) {
      const situations = root.ALICE_DATA.lesson1.feelingSituations;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Level 5 (22–27 min) • Situation & Why Reasoning</span>
              <h2 class="stage-main-title">🕵️ Mission 5: Feeling Detective</h2>
              <p class="stage-instruction">Explain WHY Alice feels this way using the speaking frame!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">4 Detective Cases</span>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">
              🗣️ Speaking Frame: <span class="highlight">"She is [feeling] because [reason]!"</span>
            </div>
            <button class="hud-btn" onclick="window.aliceAudio.speak('She is surprised because the rabbit has a watch!')">🔊 Model</button>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
      `;

      situations.forEach(s => {
        html += `
          <div class="story-picture-card" style="text-align:left; align-items:flex-start;">
            <div style="font-size:2.5rem;">${s.icon}</div>
            <h4 style="font-family:var(--font-heading); font-size:1.1rem; color:var(--alice-teal);">Case #${s.id}</h4>
            <p style="font-size:0.95rem; color:#e2e8f0; margin-bottom:8px;">${s.situation}</p>
            <div style="background:rgba(15,23,42,0.8); padding:8px 12px; border-radius:8px; width:100%; border-left:3px solid var(--alice-gold);">
              <strong style="color:var(--alice-gold); font-size:0.85rem;">Feeling:</strong> ${s.correctFeeling.toUpperCase()}<br>
              <strong style="color:var(--alice-teal); font-size:0.85rem;">Why:</strong> ${s.why}
            </div>
            <button class="hud-btn" style="margin-top:10px; width:100%; justify-content:center;" onclick="window.aliceAudio.speak('She is ${s.correctFeeling} because ${s.why}')">
              🔊 Hear Full Sentence
            </button>
          </div>
        `;
      });

      html += `
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson1', 4)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson1', 6)">
              <span>Next: What's Behind the Door?</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 6: WHAT'S BEHIND THE DOOR? (27–32 min)
    // =========================================================================
    renderMysteryDoor(container, state) {
      const worlds = root.ALICE_DATA.lesson1.imaginationWorlds;
      const curWorld = worlds.find(w => w.id === this.selectedWorld) || worlds[0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Level 6 (27–32 min) • Imagination & Discussion</span>
              <h2 class="stage-main-title">🚪 Mission 6: What's Behind the Door?</h2>
              <p class="stage-instruction">Turn the golden key 🔑! What do you imagine behind the door?</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.unlockDoorAnimation()">
                🔑 <span>Turn Key & Open Door</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">
              🗣️ Imagination Frame: <span class="highlight">"Behind the door, I imagine a ${curWorld.name}!"</span>
            </div>
            <button class="hud-btn" onclick="window.aliceAudio.speak('Behind the door, I imagine a ${curWorld.name.toLowerCase()}! ${curWorld.prompt}')">🔊 Speak</button>
          </div>

          <!-- The Mystery Door Display -->
          <div class="skimming-box-container" style="text-align:center;">
            <div style="font-size:5rem; filter:drop-shadow(0 0 20px var(--alice-gold-glow));" id="golden-door-icon">
              🚪🔑
            </div>
            <h3 style="font-family:var(--font-heading); font-size:1.6rem; color:var(--alice-gold); margin:8px 0;">
              THE GOLDEN KEY UNLOCKED: ${curWorld.name}!
            </h3>
            <p style="font-size:1.15rem; color:#e2e8f0; max-width:600px; margin:0 auto;">
              "${curWorld.prompt}"
            </p>

            <div style="margin-top:16px;">
              <span style="font-size:0.85rem; font-weight:800; color:var(--alice-teal); text-transform:uppercase;">Choose an Imagined World:</span>
              <div class="door-worlds-grid">
      `;

      worlds.forEach(w => {
        const sel = w.id === this.selectedWorld ? 'selected' : '';
        html += `
          <div class="door-world-card ${sel}" onclick="window.aliceApp.selectWorld('${w.id}')">
            <span style="font-size:2.2rem;">${w.icon}</span>
            <strong style="font-size:0.85rem; color:#ffffff;">${w.name}</strong>
          </div>
        `;
      });

      html += `
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson1', 5)">⬅️ Previous</button>
            <button class="action-btn red" onclick="window.aliceApp.goToStage('lesson1', 7)">
              <span>Mini-Boss: Save Alice!</span> ⚡
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 1 — STAGE 7: MINI-BOSS (32–35 min)
    // =========================================================================
    renderSaveAliceBoss(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 1 • Level 7 (32–35 min) • Mini-Boss Battle</span>
              <h2 class="stage-main-title">🐇 Final Challenge: Save Alice!</h2>
              <p class="stage-instruction">The White Rabbit mixed up Alice's story! Arrange the 4 key events before time expires!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.launchBossCeremony()">
                🏆 <span>Award Story Master Badge</span>
              </button>
            </div>
          </div>

          <div class="skimming-box-container" style="text-align:center; border-color:var(--alice-gold);">
            <div style="font-size:3.5rem;">🐇🌪️✨</div>
            <h3 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--alice-gold);">
              "THE RABBIT'S MIXED-UP STORY!"
            </h3>
            <p style="color:#cbd5e1; font-size:1.1rem; max-width:600px; margin:8px auto 16px;">
              Can you put Alice's adventure in order? Click each step from First to Last!
            </p>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; max-width:800px; margin:0 auto;">
              <button class="action-btn" onclick="window.aliceApp.bossStep(1)">1. 🌳 Sat by the River</button>
              <button class="action-btn" onclick="window.aliceApp.bossStep(2)">2. 🐇 White Rabbit Ran</button>
              <button class="action-btn" onclick="window.aliceApp.bossStep(3)">3. 🕳️ Jumped in the Hole</button>
              <button class="action-btn" onclick="window.aliceApp.bossStep(4)">4. 🔑 Found Golden Key</button>
            </div>

            <div id="boss-feedback-area" style="margin-top:20px;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson1', 6)">⬅️ Previous</button>
            <button class="action-btn green" onclick="window.aliceApp.switchLesson('lesson2')">
              <span>Go to Lesson 2: The Skimming Detectives</span> 🚀
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 1: DON'T READ — SKIM! (0–5 min)
    // =========================================================================
    renderDontRead(container, state) {
      const m1 = root.ALICE_DATA.lesson2.mission1;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Level 1 (0–5 min) • Skimming Introduction</span>
              <h2 class="stage-main-title">👀 Mission 1: Don't Read — SKIM!</h2>
              <p class="stage-instruction">Teacher says: "STOP! Don't read every word! LOOK QUICKLY!"</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.startSkimTimer()">
                ⏱️ <span>Start 8-Second Skim</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">
              💡 Core Rule: <span class="highlight">"SKIMMING = LOOK QUICKLY. DON'T READ EVERY WORD!"</span>
            </div>
            <button class="hud-btn" onclick="window.aliceAudio.speak('Skimming means look quickly! Do not read every word!')">🔊 Listen</button>
          </div>

          <div class="skimming-box-container">
            <div class="speed-timer-bar">
              <span style="font-weight:800; color:var(--alice-teal);">QUICK LOOK TIMER:</span>
              <span class="speed-countdown-num" id="skim-timer-display">${this.skimCountdown}s</span>
            </div>

            <div class="reading-passage-text ${this.isSkimBlurred ? 'blurred' : ''}" id="skim-passage-box">
              "${m1.text}"
            </div>

            <!-- Choices appearing after blur -->
            <div id="skim-choices-area" style="margin-top:20px; display:${this.isSkimBlurred ? 'block' : 'none'};">
              <h4 style="font-family:var(--font-heading); font-size:1.15rem; color:var(--alice-gold); margin-bottom:10px;">
                What did you see with your Eagle Eyes? (Tap all that apply):
              </h4>
              <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;">
      `;

      m1.choices.forEach((c, idx) => {
        const isSel = this.selectedSkimItems.includes(idx);
        html += `
          <button class="action-btn ${isSel ? 'green' : ''}" onclick="window.aliceApp.pickSkimItem(${idx}, ${c.isCorrect})">
            <span style="font-size:1.6rem;">${c.icon}</span>
            <span>${c.name}</span>
          </button>
        `;
      });

      html += `
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.switchLesson('lesson1')">⬅️ Back to Lesson 1</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson2', 2)">
              <span>Next: Eagle Eyes</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 2: EAGLE EYES (5–10 min)
    // =========================================================================
    renderEagleEyes(container, state) {
      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Level 2 (5–10 min) • Keyword Power</span>
              <h2 class="stage-main-title">🦅 Mission 2: Eagle Eyes Superpower!</h2>
              <p class="stage-instruction">Spot the 4 keywords as fast as you can to earn the Eagle Eyes badge!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.awardEagleEyesBadge()">
                👁️ <span>Activate Eagle Eyes</span>
              </button>
            </div>
          </div>

          <div class="kinesthetic-banner">
            <span>🦅 EAGLE EYE READERS:</span>
            <strong>Put hands like goggles around eyes! Scan the text for BIG WORDS!</strong>
          </div>

          <div class="skimming-box-container">
            <h3 style="font-family:var(--font-heading); font-size:1.3rem; color:var(--alice-teal); margin-bottom:12px;">
              Spot These 4 Important Words:
            </h3>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
              <button class="action-btn" onclick="window.aliceApp.spotKeyword('DOOR')">🚪 DOOR</button>
              <button class="action-btn" onclick="window.aliceApp.spotKeyword('KEY')">🔑 KEY</button>
              <button class="action-btn" onclick="window.aliceApp.spotKeyword('GARDEN')">🌷 GARDEN</button>
              <button class="action-btn" onclick="window.aliceApp.spotKeyword('ALICE')">👧 ALICE</button>
            </div>

            <div id="eagle-feedback-area" style="margin-top:16px;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson2', 1)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson2', 3)">
              <span>Next: Alice Speed Skim</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 3: ALICE SPEED SKIM (10–17 min)
    // =========================================================================
    renderAliceSpeedSkim(container, state) {
      const missions = root.ALICE_DATA.lesson2.speedMissions;
      const curMission = missions[this.activeSpeedMissionIdx || 0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Level 3 (10–17 min) • Reading Book 3 Page 17</span>
              <h2 class="stage-main-title">🔎 Mission 3: Alice Speed Skim</h2>
              <p class="stage-instruction">Look quickly at the authentic Page 17 reading text to find numbers, objects, and places!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">${curMission.title}</span>
            </div>
          </div>

          <div class="skimming-box-container">
            <div class="reading-passage-text" style="font-size:1.15rem; margin-bottom:16px;">
              "${root.ALICE_DATA.lesson2.page17Text}"
            </div>

            <div style="background:rgba(15,28,52,0.8); border:1.5px solid var(--alice-gold); border-radius:14px; padding:18px;">
              <h3 style="font-family:var(--font-heading); font-size:1.3rem; color:var(--alice-gold);">${curMission.title}</h3>
              <p style="font-size:1.05rem; color:#ffffff; margin:6px 0 14px;">${curMission.question}</p>

              <div style="display:flex; flex-direction:column; gap:10px;">
      `;

      curMission.options.forEach((opt, idx) => {
        html += `
          <button class="action-btn" style="justify-content:flex-start; text-align:left;" onclick="window.aliceApp.answerSpeedMission(${idx}, ${opt.isCorrect})">
            <span>${opt.text}</span>
          </button>
        `;
      });

      html += `
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson2', 2)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson2', 4)">
              <span>Next: Skim or Read?</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 4: SKIM OR READ? (17–22 min)
    // =========================================================================
    renderSkimOrRead(container, state) {
      const scenarios = root.ALICE_DATA.lesson2.scenarios;
      const cur = scenarios[this.activeScenarioIdx || 0];

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Level 4 (17–22 min) • Reading Strategy Choices</span>
              <h2 class="stage-main-title">⚖️ Mission 4: Skim or Read Carefully?</h2>
              <p class="stage-instruction">Would you SKIM (look quickly) or READ CAREFULLY? Move to your answer!</p>
            </div>
            <div class="hud-group">
              <span class="stage-tracker-pill">Scenario ${(this.activeScenarioIdx || 0) + 1} of ${scenarios.length}</span>
            </div>
          </div>

          <div class="kinesthetic-banner">
            <span>⬅️ LEFT SIDE: 🔎 SKIM (Quick look)</span>
            <span>• CLASSROOM SIDES •</span>
            <span>📖 READ CAREFULLY (Every word) ➡️</span>
          </div>

          <div class="skimming-box-container" style="text-align:center;">
            <div style="font-size:3rem;">${cur.icon}</div>
            <h3 style="font-family:var(--font-heading); font-size:1.5rem; color:#ffffff; max-width:680px; margin:10px auto;">
              "${cur.text}"
            </h3>

            <div style="display:flex; justify-content:center; gap:20px; margin-top:20px;">
              <button class="action-btn primary" style="font-size:1.3rem; padding:16px 36px;" onclick="window.aliceApp.chooseSkimOrRead('SKIM', '${cur.answer}')">
                🔎 SKIM
              </button>
              <button class="action-btn purple" style="font-size:1.3rem; padding:16px 36px;" onclick="window.aliceApp.chooseSkimOrRead('READ CAREFULLY', '${cur.answer}')">
                📖 READ CAREFULLY
              </button>
            </div>

            <div id="scenario-feedback" style="display:none; margin-top:16px;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson2', 3)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson2', 5)">
              <span>Next: Main Idea Detective</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 5: MAIN IDEA DETECTIVE (22–28 min)
    // =========================================================================
    renderMainIdea(container, state) {
      const art = root.ALICE_DATA.lesson2.brainArticle;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Level 5 (22–28 min) • Textbook Strategy: Title & Picture</span>
              <h2 class="stage-main-title">🧠 Mission 5: Main Idea Detective</h2>
              <p class="stage-instruction">Look at the TITLE, the PICTURE, and the IMPORTANT WORDS. What is the main idea?</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceAudio.speak('Strategy: Look at the title. Look at the picture. Look for important words to find the main idea!')">
                💡 <span>Skimming Strategy</span>
              </button>
            </div>
          </div>

          <div class="skimming-box-container">
            <div style="background:rgba(15,28,52,0.8); border:2px solid var(--alice-teal); border-radius:14px; padding:20px; margin-bottom:18px;">
              <div style="font-size:0.85rem; font-weight:900; color:var(--alice-teal);">📖 TEXTBOOK TITLE:</div>
              <h3 style="font-family:var(--font-heading); font-size:1.6rem; color:#ffffff; margin-bottom:6px;">"${art.title}"</h3>
              <div style="font-size:3rem;">🧠⚡📚</div>
              <p style="color:#cbd5e1; font-size:1.05rem; margin-top:6px;">"${art.textChunk}"</p>
            </div>

            <h4 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--alice-gold); margin-bottom:12px;">
              ${art.question}
            </h4>

            <div style="display:flex; flex-direction:column; gap:10px;">
      `;

      art.options.forEach((opt, idx) => {
        html += `
          <button class="action-btn" style="justify-content:flex-start; text-align:left;" id="main-idea-opt-${idx}" onclick="window.aliceApp.answerMainIdea(${idx}, ${opt.isCorrect})">
            <span>${opt.text}</span>
          </button>
        `;
      });

      html += `
            </div>
            <div id="main-idea-feedback" style="display:none; margin-top:14px;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson2', 4)">⬅️ Previous</button>
            <button class="action-btn primary" onclick="window.aliceApp.goToStage('lesson2', 6)">
              <span>Next: Brain Power</span> ➡️
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 6: BRAIN POWER (28–32 min)
    // =========================================================================
    renderBrainPower(container, state) {
      const abilities = root.ALICE_DATA.lesson2.brainAbilities;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Level 6 (28–32 min) • Brain Functions & Speaking</span>
              <h2 class="stage-main-title">⚡ Mission 6: Brain Power Studio</h2>
              <p class="stage-instruction">Animated Brain says: "HELLO! What can I do?" Tap the brain powers!</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceAudio.speak('Hello! I am your brain! I can help you think, learn, remember, and sleep!')">
                🔊 <span>Meet Brain</span>
              </button>
            </div>
          </div>

          <div class="speaking-banner">
            <div class="speak-text">
              🗣️ Speaking Frame: <span class="highlight">"The brain can... It can help me [verb]!"</span>
            </div>
            <button class="hud-btn" onclick="window.aliceAudio.speak('It can help me learn English!')">🔊 Listen</button>
          </div>

          <div class="skimming-box-container" style="text-align:center;">
            <div style="font-size:5rem; filter:drop-shadow(0 0 24px rgba(168, 85, 247, 0.4)); animation:pulseCombo 1.5s infinite alternate;">
              🧠✨
            </div>
            <h3 style="font-family:var(--font-heading); font-size:1.6rem; color:#ffffff; margin:10px 0;">
              "HELLO! I AM YOUR BRAIN!"
            </h3>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-top:20px;">
      `;

      abilities.forEach(a => {
        html += `
          <div class="story-picture-card" onclick="window.aliceApp.activateBrainPower('${a.name}', '${a.sentence}')">
            <span style="font-size:2.8rem;">${a.icon}</span>
            <strong style="font-size:1.15rem; color:var(--alice-gold);">${a.name}</strong>
            <p style="font-size:0.85rem; color:#cbd5e1;">${a.sentence}</p>
          </div>
        `;
      });

      html += `
            </div>
            <div id="brain-power-feedback" style="display:none; margin-top:16px;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson2', 5)">⬅️ Previous</button>
            <button class="action-btn red" onclick="window.aliceApp.goToStage('lesson2', 7)">
              <span>Final Boss: Speed Skimmer!</span> ⚡
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    // =========================================================================
    // LESSON 2 — STAGE 7: SPEED SKIMMER BOSS (32–35 min)
    // =========================================================================
    renderSpeedSkimmerBoss(container, state) {
      const boss = root.ALICE_DATA.lesson2.finalBoss;

      let html = `
        <div class="scene-wrapper">
          <div class="stage-header">
            <div class="stage-title-wrap">
              <span class="stage-tagline">Lesson 2 • Level 7 (32–35 min) • Final Skimming Boss</span>
              <h2 class="stage-main-title">🏆 Final Boss: The Speed Skimmer!</h2>
              <p class="stage-instruction">Skim the brand-new robot story in 12 seconds! Who? What? Main Idea?</p>
            </div>
            <div class="hud-group">
              <button class="action-btn gold" onclick="window.aliceApp.startBossTimer()">
                ⏱️ <span>Start 12s Boss Skim</span>
              </button>
            </div>
          </div>

          <div class="skimming-box-container">
            <div class="speed-timer-bar">
              <span style="font-weight:800; color:var(--alice-rose);">BOSS SKIMMER TIMER:</span>
              <span class="speed-countdown-num" id="boss-timer-display">${this.bossCountdown}s</span>
            </div>

            <div class="reading-passage-text ${this.isBossBlurred ? 'blurred' : ''}" id="boss-passage-box">
              "${boss.text}"
            </div>

            <div id="boss-questions-box" style="display:${this.isBossBlurred ? 'block' : 'none'}; margin-top:20px;">
              <h4 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--alice-gold); margin-bottom:12px;">
                Answer the 3 Skimming Questions:
              </h4>

              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px;">
                <div class="story-picture-card" onclick="window.aliceApp.answerBossQ(1)">
                  <strong style="color:var(--alice-teal);">1. WHO?</strong>
                  <p style="font-size:0.9rem; color:#ffffff;">Tom & his robot</p>
                </div>
                <div class="story-picture-card" onclick="window.aliceApp.answerBossQ(2)">
                  <strong style="color:var(--alice-gold);">2. WHAT?</strong>
                  <p style="font-size:0.9rem; color:#ffffff;">Robot cleans his room</p>
                </div>
                <div class="story-picture-card" onclick="window.aliceApp.answerBossQ(3)">
                  <strong style="color:var(--alice-purple);">3. MAIN IDEA?</strong>
                  <p style="font-size:0.9rem; color:#ffffff;">Tom's robot helper cleans</p>
                </div>
              </div>

              <div id="boss-victory-area" style="margin-top:16px;"></div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button class="action-btn" onclick="window.aliceApp.goToStage('lesson2', 6)">⬅️ Previous</button>
            <button class="action-btn gold" onclick="window.aliceApp.launchFinalCeremony()">
              <span>Grand Graduation Ceremony</span> 🎓
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }
  }

  root.aliceScenes = new AliceSceneRenderer();
})(window);
