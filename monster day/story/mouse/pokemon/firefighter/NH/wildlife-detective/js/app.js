import { GAME_DATA } from './data.js';
import { SoundEngine } from './audio.js';

const audio = new SoundEngine();

const playerSession = {
  scoreXP: 0,
  currentPhase: 1,
  unlockedCards: new Set(),
  p2Index: 0,
  adaptationsUnlocked: new Set()
};

function addXP(pts) {
  playerSession.scoreXP += pts;
  const el = document.getElementById('score-val');
  if (el) el.innerText = playerSession.scoreXP;
}

function updateProgress(perc) {
  const fill = document.getElementById('meter-fill');
  if (fill) fill.style.width = perc + "%";
  const percEl = document.getElementById('meter-perc');
  if (percEl) percEl.innerText = perc + "%";
}

function renderPhase1() {
  playerSession.currentPhase = 1;
  updateProgress(25);
  const stage = document.getElementById('stage');
  if (!stage) return;
  stage.innerHTML = `
    <div class="stage-prompt">
      <h2>Mission 1: The Care Card Scanner</h2>
      <p>Tap each wild animal to inspect its true biological requirements.</p>
      <div class="pill-target">Grammar: It needs [noun]</div>
    </div>
    <div class="card-deck">
      ${GAME_DATA.phase1Cards.map(c => `
        <div class="flip-card" id="card-${c.id}" onclick="window.gameApp.flipDiscoveryCard('${c.id}')">
          <div class="card-face card-front">
            <div style="width:90px; height:80px; display:flex; align-items:center; justify-content:center;">${c.svg}</div>
            <h3 style="margin-top:8px; font-size:1.15rem; color:#fff;">${c.name}</h3>
            <span style="font-size:0.8rem; color:var(--accent-cyan); font-weight:700; margin-top:4px;">👆 TAP TO SCAN</span>
          </div>
          <div class="card-face card-back">
            <span class="card-badge-unlocked">SCANNED ✔</span>
            <p style="font-weight:700; font-size:1.05rem; color:#fff; line-height:1.4;">${c.requirement}</p>
            <span style="font-size:0.8rem; color:var(--primary-emerald); font-weight:800;">+10 XP EARNED</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function flipDiscoveryCard(id) {
  audio.playSnap();
  const cardEl = document.getElementById(`card-${id}`);
  if (cardEl && !cardEl.classList.contains('flipped')) {
    cardEl.classList.add('flipped');
    const data = GAME_DATA.phase1Cards.find(c => c.id === id);
    if (data) audio.speak(data.ttsPrompt);

    if (!playerSession.unlockedCards.has(id)) {
      playerSession.unlockedCards.add(id);
      addXP(10);
      audio.playXP();
    }

    if (playerSession.unlockedCards.size === GAME_DATA.phase1Cards.length) {
      setTimeout(() => {
        audio.playFanfare();
        renderPhase2();
      }, 2200);
    }
  }
}

function renderPhase2() {
  playerSession.currentPhase = 2;
  updateProgress(55);
  const round = GAME_DATA.phase2Scenarios[playerSession.p2Index];
  const stage = document.getElementById('stage');
  if (!stage || !round) return;

  stage.innerHTML = `
    <div class="stage-prompt">
      <h2>Mission 2: Screen vs. Reality Arena</h2>
      <p>Look at the TikTok feed. What is the Ranger-approved choice?</p>
      <div class="pill-target">Imperatives: Keep it wild! / Buy the toy!</div>
    </div>

    <div class="arena-showdown">
      <div class="trading-card" id="focus-card">
        <div class="trading-card-img">
          <div style="width:130px; height:110px;">${round.svg}</div>
          <div id="stamp-slot" class="rubber-stamp"></div>
        </div>
        <div class="trading-card-caption">
          <h4>${round.title}</h4>
          <p>${round.description}</p>
        </div>
      </div>

      <div style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">
        <button class="btn-3d btn-green" onclick="window.gameApp.evaluateArenaChoice(true)">
          🌿 KEEP IT WILD / BUY TOY!
        </button>
        <button class="btn-3d btn-coral" onclick="window.gameApp.evaluateArenaChoice(false)">
          📦 ORDER LIVE BEDROOM PET
        </button>
      </div>
    </div>
  `;
}

function evaluateArenaChoice(isEcoChoice) {
  const card = document.getElementById('focus-card');
  const stamp = document.getElementById('stamp-slot');

  if (isEcoChoice) {
    audio.playXP();
    if (stamp) {
      stamp.className = "rubber-stamp stamp-do";
      stamp.innerText = "KEEP IT WILD!";
    }
    const round = GAME_DATA.phase2Scenarios[playerSession.p2Index];
    if (round) audio.speak(round.ruleSpeech);
    addXP(25);

    setTimeout(() => {
      playerSession.p2Index++;
      if (playerSession.p2Index < GAME_DATA.phase2Scenarios.length) {
        renderPhase2();
      } else {
        audio.playFanfare();
        renderPhase3();
      }
    }, 2400);
  } else {
    audio.playSoftFail();
    if (stamp) {
      stamp.className = "rubber-stamp stamp-dont";
      stamp.innerText = "DON'T BUY!";
    }
    if (card) card.classList.add('wobble');
    audio.speak("Wait, detective! Wild animals cannot live in human bedrooms. Try again!");
    setTimeout(() => {
      if (card) card.classList.remove('wobble');
      if (stamp) stamp.className = "rubber-stamp";
    }, 1200);
  }
}

function renderPhase3() {
  playerSession.currentPhase = 3;
  updateProgress(80);
  const stage = document.getElementById('stage');
  if (!stage) return;

  stage.innerHTML = `
    <div class="stage-prompt">
      <h2>Mission 3: Living Room Escape & Teleprompter</h2>
      <p>Unlock 3 biological adaptations to teleport the capybara to the Pantanal wetland!</p>
      <div class="pill-target">Target: It needs [wetland] / It cannot live in a bedroom</div>
    </div>

    <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
      <div class="habitat-viewport" id="viewport">
        <div class="capy-rig" id="capy-rig">
          <div style="width:130px; height:110px;">${GAME_DATA.phase2Scenarios[0].svg}</div>
        </div>
      </div>

      <div class="adaptation-tray" id="adapt-tray">
        <button class="adapt-btn" id="ad-snorkel" onclick="window.gameApp.unlockAdaptation('snorkel')">
          <span style="font-size:1.8rem;">👀</span>
          <b>Snorkel Face</b>
          <span style="font-size:0.75rem; color:#94a3b8;">Eyes & nose on top</span>
        </button>
        <button class="adapt-btn" id="ad-feet" onclick="window.gameApp.unlockAdaptation('feet')">
          <span style="font-size:1.8rem;">🐾</span>
          <b>Webbed Feet</b>
          <span style="font-size:0.75rem; color:#94a3b8;">Paddle flippers to swim</span>
        </button>
        <button class="adapt-btn" id="ad-herd" onclick="window.gameApp.unlockAdaptation('herd')">
          <span style="font-size:1.8rem;">🌿</span>
          <b>Herd Life</b>
          <span style="font-size:0.75rem; color:#94a3b8;">Needs 20+ companions</span>
        </button>
      </div>

      <div class="teleprompter-box" id="teleprompter" style="display:none;">
        <div class="teleprompter-text" id="tele-text">
          ${GAME_DATA.teleprompterScript.map(w => `<span class="word">${w}</span>`).join(' ')}
        </div>
        <button class="btn-3d btn-amber" style="margin-top:16px;" onclick="window.gameApp.broadcastTeleprompter()">
          📢 BROADCAST TO CLASSROOM
        </button>
      </div>
    </div>
  `;
}

function unlockAdaptation(type) {
  if (playerSession.adaptationsUnlocked.has(type)) return;
  playerSession.adaptationsUnlocked.add(type);
  audio.playSnap();
  audio.playXP();
  addXP(15);

  const btn = document.getElementById(`ad-${type}`);
  if (btn) {
    btn.classList.add('unlocked');
    btn.innerHTML += `<span style="color:var(--primary-emerald); font-weight:800; font-size:0.8rem; margin-top:4px;">ACTIVE ✔</span>`;
  }

  if (type === 'snorkel') audio.speak("Snorkel face! Eyes and nostrils are high up to breathe while swimming!");
  if (type === 'feet') audio.speak("Webbed feet! Toes have skin flaps to paddle fast across rivers!");
  if (type === 'herd') audio.speak("Herd life! Capybaras get sick and lonely without a giant group!");

  if (playerSession.adaptationsUnlocked.size === 3) {
    setTimeout(() => {
      audio.playFanfare();
      triggerWetlandTeleport();
    }, 1800);
  }
}

function triggerWetlandTeleport() {
  updateProgress(100);
  const rig = document.getElementById('capy-rig');
  const viewport = document.getElementById('viewport');
  if (rig) rig.style.transform = "scale(1.25) translateY(-8px)";
  if (viewport) {
    viewport.style.background = "radial-gradient(circle at 50% 60%, #065f46 0%, #022c22 85%)";
    viewport.style.borderColor = "var(--primary-emerald)";
  }

  const tray = document.getElementById('adapt-tray');
  const tele = document.getElementById('teleprompter');
  if (tray) tray.style.display = 'none';
  if (tele) tele.style.display = 'block';
  audio.speak("Teleport success! Capybara returned safely to the South American Pantanal. Ready for broadcast!");
}

function broadcastTeleprompter() {
  const words = document.querySelectorAll('#tele-text .word');
  let idx = 0;
  const scriptText = GAME_DATA.teleprompterScript.join(' ');

  audio.speak(scriptText, () => {
    words.forEach(w => w.classList.remove('glow'));
    audio.playFanfare();
    renderDiplomaScreen();
  });

  const interval = setInterval(() => {
    if (idx < words.length) {
      words.forEach(w => w.classList.remove('glow'));
      words[idx].classList.add('glow');
      idx++;
    } else {
      clearInterval(interval);
    }
  }, 310);
}

function renderDiplomaScreen() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  stage.innerHTML = `
    <div style="text-align:center; padding:20px; max-width:600px;">
      <div style="font-size:4.5rem; margin-bottom:12px;">🎖️</div>
      <h2 style="font-size:2.4rem; color:var(--primary-emerald); margin-bottom:8px;">Junior Wildlife Ranger!</h2>
      <p style="font-size:1.15rem; color:#cbd5e1; margin-bottom:20px; font-weight:600;">
        Mission Accomplished! You protected wild species from social media fads and returned Capy to the wetland.
      </p>
      <div style="background:#0b1d14; border:2px dashed var(--panel-border); border-radius:20px; padding:20px; margin-bottom:24px;">
        <h4 style="color:var(--accent-amber); font-size:1.2rem;">RANGER CODE:</h4>
        <p style="color:#fff; font-weight:700; margin-top:6px;">"Wild animals stay in nature. Buy the toy, keep the wild!"</p>
        <div style="margin-top:10px; font-size:1.2rem; font-weight:800; color:var(--accent-cyan);">Total Score: ${playerSession.scoreXP} XP</div>
      </div>
      <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
        <a href="worksheet.html" target="_blank" class="btn-3d btn-amber" style="text-decoration:none;">📄 PRINT FIELD LOG</a>
        <button class="btn-3d btn-green" onclick="location.reload()">🔄 PLAY AGAIN</button>
      </div>
    </div>
  `;
}

window.gameApp = {
  flipDiscoveryCard,
  evaluateArenaChoice,
  unlockAdaptation,
  broadcastTeleprompter
};

document.addEventListener('DOMContentLoaded', renderPhase1);
