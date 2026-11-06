/* Classroom Instructions Challenge — 4-Stage Smartboard Controller */
(function (root) {
  'use strict';

  var D = root.InstructionsData;
  var A = root.ChallengeAudio;

  var state = {
    phase: 1,
    scores: [0, 0, 0, 0],
    cmdIdx: 0,
    turboRunning: false,
    turboSec: 3.5,
    turboPct: 100,
    turboCount: 0,
    comboIdx: 0,
    comboVerified: [],
    leaderNum: 1,
    leaderMode: 'single',
    leaderStep1: null,
    leaderStep2: null,
    leaderProjected: null
  };

  var turboInterval = null;

  function stopTurbo() {
    state.turboRunning = false;
    if (turboInterval) { clearInterval(turboInterval); turboInterval = null; }
  }

  function findCmd(id) {
    return D.commands.filter(function (c) { return c.id === id; })[0] || D.commands[0];
  }

  function toast(msg) {
    var el = document.getElementById('sb-toast');
    if (!el) return;
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(state._toastTimer);
    state._toastTimer = setTimeout(function () { el.style.opacity = '0'; }, 2200);
  }

  function addTeamPoint(teamIdx, pts) {
    state.scores[teamIdx] = (state.scores[teamIdx] || 0) + (pts || 10);
    A.playCorrect();
    renderScoreboard();
    toast('⭐ Team ' + (teamIdx + 1) + ' +' + (pts || 10) + ' Points!');
    try {
      if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
        root.AdventureAcademy.awardXP(pts || 10, 'classroom-instructions-challenge');
      }
    } catch (e) {}
  }

  function renderScoreboard() {
    var box = document.getElementById('sb-teams');
    if (!box) return;
    box.innerHTML = [0, 1, 2, 3].map(function (i) {
      return '<button type="button" class="sb-team-chip t' + (i + 1) + '" onclick="InstructionsApp.addTeamPoint(' + i + ', 10)">' +
        '<span>⚡ Team ' + (i + 1) + '</span>' +
        '<span class="sb-team-pts">⭐ ' + state.scores[i] + '</span>' +
      '</button>';
    }).join('');
  }

  function setPhase(p) {
    stopTurbo();
    A.playTap();
    state.phase = p;
    render();
    if (p === 1) {
      var c = D.commands[state.cmdIdx];
      A.speak(c.text, c.clip);
    } else if (p === 2) {
      A.speak('Stage 2: Turbo Speed Round! The instructions are faster now. Stay sharp and move fast!', 'i_phase2');
    } else if (p === 3) {
      var cb = D.combos[state.comboIdx];
      A.speak(cb.text, cb.clip);
    } else if (p === 4) {
      A.speak('Stage 4: Student Leader Console! Come to the smartboard, choose the instructions, and lead your class!', 'i_phase4');
    }
  }

  function speakCurrentCmd() {
    var c = D.commands[state.cmdIdx];
    A.speak(c.text, c.clip);
  }

  function speakCurrentCombo() {
    var cb = D.combos[state.comboIdx];
    A.speak(cb.text, cb.clip);
  }

  function speakLeaderProjected() {
    if (!state.leaderProjected) return;
    A.speak(state.leaderProjected.text, state.leaderProjected.clip || null);
  }

  function cheerClass() {
    A.playFanfare();
    A.speak('Awesome action! Super fast, everyone!', 'i_cheer');
  }

  function goCmd(idx) {
    state.cmdIdx = (idx + D.commands.length) % D.commands.length;
    var c = D.commands[state.cmdIdx];
    A.playTap();
    A.speak(c.text, c.clip);
    render();
  }

  function renderPhase1() {
    var c = D.commands[state.cmdIdx];
    var strip = D.commands.slice(0, 8).map(function (cmd, i) {
      return '<button type="button" class="btn-3d ' + (i === state.cmdIdx ? 'cyan' : '') + '" style="padding:8px 14px;font-size:0.95rem" onclick="InstructionsApp.goCmd(' + i + ')">' +
        '<span>' + (i + 1) + '. ' + cmd.short + '</span>' +
      '</button>';
    }).join('');

    return '<div class="sb-banner">' +
        '<div class="sb-banner-text">' +
          '<h2>📢 Stage 1 · Classroom Instructions Radar (' + (state.cmdIdx + 1) + ' / 8)</h2>' +
          '<p>Watch the smartboard, listen to the command, and do the action immediately at your desk!</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px">' +
          '<button type="button" class="btn-3d" onclick="InstructionsApp.goCmd(' + (state.cmdIdx - 1) + ')">◀ Prev</button>' +
          '<button type="button" class="btn-3d amber" onclick="InstructionsApp.speakCurrentCmd()">🔊 Say Again</button>' +
          '<button type="button" class="btn-3d emerald" onclick="InstructionsApp.goCmd(' + (state.cmdIdx + 1) + ')">Next Command ▶</button>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">' + strip + '</div>' +
      '<div class="cmd-hero-card">' +
        '<div class="art-viewport" style="border-radius:22px;min-height:290px">' +
          '<img src="' + c.art + '" class="art-sprite" style="width:230px;height:230px" alt="' + c.text + '">' +
          '<div class="pedestal-disc"></div>' +
        '</div>' +
        '<div>' +
          '<div style="display:inline-block;padding:6px 16px;border-radius:99px;background:rgba(56,189,248,0.2);border:1px solid #38bdf8;color:#7dd3fc;font-weight:800;font-size:1rem">COMMAND #' + (state.cmdIdx + 1) + ' · DO IT NOW!</div>' +
          '<div class="cmd-big-text">' + c.emoji + ' ' + c.text + '</div>' +
          '<p style="font-size:1.25rem;color:#cbd5e1;margin:0 0 22px">💡 Action Tip: <b>' + c.hint + '</b></p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
            '<button type="button" class="btn-3d amber" onclick="InstructionsApp.speakCurrentCmd()">🔊 Speak Command</button>' +
            '<button type="button" class="btn-3d emerald" onclick="InstructionsApp.cheerClass()">🎉 Class Did It! (Cheer)</button>' +
            '<button type="button" class="btn-3d cyan" onclick="InstructionsApp.goCmd(' + (state.cmdIdx + 1) + ')">👉 Next Instruction ▶</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function startTurbo() {
    stopTurbo();
    state.turboRunning = true;
    state.turboPct = 100;
    nextTurboCard();
    var stepMs = 80;
    turboInterval = setInterval(function () {
      if (!state.turboRunning) return;
      state.turboPct -= (stepMs / (state.turboSec * 1000)) * 100;
      var bar = document.getElementById('turbo-bar-fill');
      if (bar) bar.style.width = Math.max(0, state.turboPct) + '%';
      if (state.turboPct <= 0) {
        state.turboPct = 100;
        nextTurboCard();
      }
    }, stepMs);
    render();
  }

  function nextTurboCard() {
    var pool = D.commands.slice(0, 8);
    var next = Math.floor(Math.random() * pool.length);
    if (next === state.cmdIdx) next = (next + 1) % pool.length;
    state.cmdIdx = next;
    state.turboCount++;
    var c = pool[state.cmdIdx];
    A.playBeat(true);
    A.speak(c.text, c.clip);
    if (state.phase === 2) render();
  }

  function setTurboSpeed(sec) {
    state.turboSec = sec;
    A.playTap();
    if (state.turboRunning) startTurbo();
    else render();
  }

  function renderPhase2() {
    var c = D.commands[state.cmdIdx];
    return '<div class="sb-banner">' +
        '<div class="sb-banner-text">' +
          '<h2>⚡ Stage 2 · Turbo Speed Reaction Round! (Round #' + (state.turboCount || 1) + ')</h2>' +
          '<p>Instructions change automatically! Watch the timer bar and perform each command before it switches!</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button type="button" class="btn-3d ' + (state.turboSec === 4.5 ? 'cyan' : '') + '" onclick="InstructionsApp.setTurboSpeed(4.5)">🐢 4.5s</button>' +
          '<button type="button" class="btn-3d ' + (state.turboSec === 3.5 ? 'amber' : '') + '" onclick="InstructionsApp.setTurboSpeed(3.5)">⚡ 3.5s Fast</button>' +
          '<button type="button" class="btn-3d ' + (state.turboSec === 2.4 ? 'coral' : '') + '" onclick="InstructionsApp.setTurboSpeed(2.4)">🔥 2.4s Turbo</button>' +
          (state.turboRunning
            ? '<button type="button" class="btn-3d coral" onclick="InstructionsApp.stopTurbo()">⏸ Pause Turbo</button>'
            : '<button type="button" class="btn-3d emerald" onclick="InstructionsApp.startTurbo()">▶ Start Turbo Stream</button>') +
          '<button type="button" class="btn-3d cyan" onclick="InstructionsApp.nextTurboCard()">⏭ Instant Next!</button>' +
        '</div>' +
      '</div>' +
      '<div class="turbo-bar-wrap"><div class="turbo-bar-fill" id="turbo-bar-fill" style="width:' + state.turboPct + '%"></div></div>' +
      '<div class="cmd-hero-card" style="border-color:#f59e0b">' +
        '<div class="art-viewport" style="border-radius:22px;min-height:270px">' +
          '<img src="' + c.art + '" class="art-sprite" style="width:220px;height:220px" alt="' + c.text + '">' +
          '<div class="pedestal-disc"></div>' +
        '</div>' +
        '<div>' +
          '<div style="display:inline-block;padding:6px 16px;border-radius:99px;background:rgba(245,158,11,0.22);border:1px solid #f59e0b;color:#fde047;font-weight:800">⚡ TURBO COMMAND · FAST REACTION!</div>' +
          '<div class="cmd-big-text" style="color:#fde047">' + c.emoji + ' ' + c.text + '</div>' +
          '<p style="font-size:1.18rem;color:#cbd5e1;margin:0 0 18px">Award +10 points to the fastest team below:</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
            '<button type="button" class="btn-3d cyan" onclick="InstructionsApp.addTeamPoint(0, 10)">+10 Team 1</button>' +
            '<button type="button" class="btn-3d amber" onclick="InstructionsApp.addTeamPoint(1, 10)">+10 Team 2</button>' +
            '<button type="button" class="btn-3d emerald" onclick="InstructionsApp.addTeamPoint(2, 10)">+10 Team 3</button>' +
            '<button type="button" class="btn-3d violet" onclick="InstructionsApp.addTeamPoint(3, 10)">+10 Team 4</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function goCombo(idx) {
    state.comboIdx = (idx + D.combos.length) % D.combos.length;
    state.comboVerified = [];
    var cb = D.combos[state.comboIdx];
    A.playTap();
    A.speak(cb.text, cb.clip);
    render();
  }

  function verifyComboStep(cmdId, btnEl) {
    var cb = D.combos[state.comboIdx];
    var needed = state.comboVerified.length === 0 ? cb.step1 : cb.step2;
    if (cmdId === needed) {
      state.comboVerified.push(cmdId);
      A.playCorrect();
      if (state.comboVerified.length === 2) {
        A.playFanfare();
        toast('🌟 Perfect Order! Step 1 ➔ Step 2 Completed!');
      }
      render();
    } else {
      A.playSoftFail();
      A.speak('Check the order! Step 1 first, then Step 2!', 'i_try');
      if (btnEl) { btnEl.classList.remove('wobble'); void btnEl.offsetWidth; btnEl.classList.add('wobble'); }
    }
  }

  function renderPhase3() {
    var cb = D.combos[state.comboIdx];
    var c1 = findCmd(cb.step1);
    var c2 = findCmd(cb.step2);
    var done1 = state.comboVerified.length >= 1;
    var done2 = state.comboVerified.length >= 2;

    var navBtns = D.combos.map(function (item, i) {
      return '<button type="button" class="btn-3d ' + (i === state.comboIdx ? 'amber' : '') + '" onclick="InstructionsApp.goCombo(' + i + ')">Combo #' + (i + 1) + '</button>';
    }).join('');

    return '<div class="sb-banner">' +
        '<div class="sb-banner-text">' +
          '<h2>🔗 Stage 3 · Double Instruction Combo (' + (state.comboIdx + 1) + ' / ' + D.combos.length + ')</h2>' +
          '<p>Two instructions together! Students must perform <b>Step 1 FIRST</b> and <b>Step 2 SECOND</b> in exact order!</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px">' +
          '<button type="button" class="btn-3d amber" onclick="InstructionsApp.speakCurrentCombo()">🔊 Speak Full Combo</button>' +
          '<button type="button" class="btn-3d emerald" onclick="InstructionsApp.goCombo(' + (state.comboIdx + 1) + ')">Next Combo ▶</button>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">' + navBtns + '</div>' +
      '<div class="speech-Stage-card" style="margin-bottom:18px;padding:18px">' +
        '<div class="speech-sentence" style="font-size:2.2rem;margin:4px 0">"' + cb.text + '"</div>' +
      '</div>' +
      '<div class="combo-grid">' +
        '<div class="art-card-3d" style="border-color:' + (done1 ? '#10b981' : '#38bdf8') + '">' +
          '<div class="art-viewport">' +
            '<span style="position:absolute;top:12px;left:14px;padding:4px 12px;border-radius:99px;background:#0284c7;font-weight:800">STEP 1 · FIRST</span>' +
            '<img src="' + c1.art + '" class="art-sprite" alt="' + c1.short + '">' +
            '<div class="pedestal-disc"></div>' +
          '</div>' +
          '<div class="art-caption-tray">' +
            '<div style="font-size:1.55rem;font-weight:800;color:#fff;margin-bottom:10px">' + c1.emoji + ' ' + c1.short + '</div>' +
            '<button type="button" class="btn-3d ' + (done1 ? 'emerald' : 'cyan') + '" data-cmd="' + c1.id + '" onclick="InstructionsApp.verifyComboStep(this.getAttribute(\'data-cmd\'), this)">' + (done1 ? '✅ Step 1 Done!' : '1️⃣ Tap When Class Does Step 1') + '</button>' +
          '</div>' +
        '</div>' +
        '<div style="font-size:3rem;font-weight:800;color:#fde047;text-align:center">➔</div>' +
        '<div class="art-card-3d" style="border-color:' + (done2 ? '#10b981' : '#f59e0b') + '">' +
          '<div class="art-viewport">' +
            '<span style="position:absolute;top:12px;left:14px;padding:4px 12px;border-radius:99px;background:#b45309;font-weight:800">STEP 2 · SECOND</span>' +
            '<img src="' + c2.art + '" class="art-sprite" alt="' + c2.short + '">' +
            '<div class="pedestal-disc"></div>' +
          '</div>' +
          '<div class="art-caption-tray">' +
            '<div style="font-size:1.55rem;font-weight:800;color:#fff;margin-bottom:10px">' + c2.emoji + ' ' + c2.short + '</div>' +
            '<button type="button" class="btn-3d ' + (done2 ? 'emerald' : 'amber') + '" data-cmd="' + c2.id + '" onclick="InstructionsApp.verifyComboStep(this.getAttribute(\'data-cmd\'), this)">' + (done2 ? '✅ Step 2 Done!' : '2️⃣ Tap When Class Does Step 2') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function pickRandomLeader() {
    state.leaderNum = 1 + Math.floor(Math.random() * 24);
    A.playFanfare();
    toast('👑 Student Leader #' + state.leaderNum + ' comes to the Smartboard!');
    render();
  }

  function leaderPickCmd(cmdId) {
    var cmd = findCmd(cmdId);
    if (state.leaderMode === 'single') {
      state.leaderProjected = { mode: 'single', c1: cmd, text: cmd.text, clip: cmd.clip };
      A.playCorrect();
      A.speak(cmd.text, cmd.clip);
      render();
    } else {
      if (!state.leaderStep1) {
        state.leaderStep1 = cmd;
        A.playTap();
        render();
      } else {
        state.leaderStep2 = cmd;
        var fullText = state.leaderStep1.short + ' and ' + cmd.short.charAt(0).toLowerCase() + cmd.short.slice(1) + '.';
        state.leaderProjected = { mode: 'combo', c1: state.leaderStep1, c2: cmd, text: fullText, clip: null };
        state.leaderStep1 = null;
        state.leaderStep2 = null;
        A.playFanfare();
        A.speak(fullText);
        render();
      }
    }
  }

  function renderPhase4() {
    var p = state.leaderProjected;
    var padHtml = D.commands.map(function (c) {
      var isS1 = state.leaderStep1 && state.leaderStep1.id === c.id;
      return '<button type="button" class="leader-tile" style="' + (isS1 ? 'border-color:#fde047;box-shadow:0 0 20px rgba(253,224,71,0.35)' : '') + '" data-cmd="' + c.id + '" onclick="InstructionsApp.leaderPickCmd(this.getAttribute(\'data-cmd\'))">' +
        '<img src="' + c.art + '" alt="">' +
        '<div style="text-align:left"><div style="font-size:1.1rem">' + c.emoji + ' ' + c.short + '</div>' +
        (isS1 ? '<small style="color:#fde047">Step 1 Selected! Tap Step 2...</small>' : '') + '</div>' +
      '</button>';
    }).join('');

    var screenHtml = '';
    if (!p) {
      screenHtml =
        '<div class="speech-Stage-card" style="margin-bottom:18px;padding:24px">' +
          '<div style="font-size:1.35rem;color:#fde047;font-weight:800">👑 STUDENT LEADER #' + state.leaderNum + ' IS AT THE BOARD!</div>' +
          '<div style="font-size:1.7rem;font-weight:800;color:#fff;margin-top:6px">' +
            (state.leaderMode === 'single' ? 'Tap any instruction tile below to project it for the class!' : (state.leaderStep1 ? ('Step 1: ' + state.leaderStep1.short + ' ➔ Now tap Step 2!') : 'Tap Step 1, then tap Step 2 to build a Double Command!')) +
          '</div>' +
        '</div>';
    } else if (p.mode === 'single') {
      screenHtml =
        '<div class="cmd-hero-card" style="margin-bottom:18px;border-color:#a855f7">' +
          '<div class="art-viewport" style="min-height:200px">' +
            '<img src="' + p.c1.art + '" class="art-sprite" style="width:170px;height:170px" alt="">' +
            '<div class="pedestal-disc"></div>' +
          '</div>' +
          '<div>' +
            '<div style="color:#c084fc;font-weight:800">👑 STUDENT LEADER COMMAND:</div>' +
            '<div class="cmd-big-text" style="font-size:2.6rem">' + p.c1.emoji + ' ' + p.text + '</div>' +
            '<div style="display:flex;gap:10px">' +
              '<button type="button" class="btn-3d amber" onclick="InstructionsApp.speakLeaderProjected()">🔊 Repeat Voice</button>' +
              '<button type="button" class="btn-3d emerald" onclick="InstructionsApp.cheerClass()">🎉 Great Job Class!</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    } else {
      screenHtml =
        '<div class="speech-Stage-card" style="margin-bottom:18px;padding:20px;border-color:#a855f7">' +
          '<div style="color:#c084fc;font-weight:800">👑 STUDENT LEADER 2-STEP COMBO:</div>' +
          '<div class="speech-sentence" style="font-size:2.2rem">"' + p.text + '"</div>' +
          '<div style="display:flex;justify-content:center;align-items:center;gap:24px;flex-wrap:wrap;margin-top:10px">' +
            '<div style="display:flex;align-items:center;gap:10px"><img src="' + p.c1.art + '" style="width:84px;height:84px;object-fit:contain" alt=""><b>1. ' + p.c1.short + '</b></div>' +
            '<span style="font-size:2rem;color:#fde047">➔</span>' +
            '<div style="display:flex;align-items:center;gap:10px"><img src="' + p.c2.art + '" style="width:84px;height:84px;object-fit:contain" alt=""><b>2. ' + p.c2.short + '</b></div>' +
            '<button type="button" class="btn-3d amber" onclick="InstructionsApp.speakLeaderProjected()">🔊 Speak Combo</button>' +
          '</div>' +
        '</div>';
    }

    return '<div class="sb-banner">' +
        '<div class="sb-banner-text">' +
          '<h2>👑 Stage 4 · Student Leader Command Console</h2>' +
          '<p>Choose a student to come to the smartboard and launch commands for the whole class to follow!</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button type="button" class="btn-3d amber" onclick="InstructionsApp.pickRandomLeader()">🎲 Pick Student Leader (#' + state.leaderNum + ')</button>' +
          '<button type="button" class="btn-3d ' + (state.leaderMode === 'single' ? 'cyan' : '') + '" onclick="InstructionsApp.setLeaderMode(\'single\')">1️⃣ Single Command Mode</button>' +
          '<button type="button" class="btn-3d ' + (state.leaderMode === 'combo' ? 'violet' : '') + '" onclick="InstructionsApp.setLeaderMode(\'combo\')">🔗 2-Step Combo Builder</button>' +
        '</div>' +
      '</div>' +
      screenHtml +
      '<div class="leader-pad-grid">' + padHtml + '</div>';
  }

  function render() {
    renderScoreboard();
    var tabs = document.querySelectorAll('.sb-phase-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', (i + 1) === state.phase);
    }
    var stage = document.getElementById('sb-stage');
    if (!stage) return;
    if (state.phase === 1) stage.innerHTML = renderPhase1();
    else if (state.phase === 2) stage.innerHTML = renderPhase2();
    else if (state.phase === 3) stage.innerHTML = renderPhase3();
    else stage.innerHTML = renderPhase4();
  }

  root.InstructionsApp = {
    init: function () { render(); },
    setPhase: setPhase,
    speakCurrentCmd: speakCurrentCmd,
    speakCurrentCombo: speakCurrentCombo,
    speakLeaderProjected: speakLeaderProjected,
    cheerClass: cheerClass,
    addTeamPoint: addTeamPoint,
    goCmd: goCmd,
    startTurbo: startTurbo,
    stopTurbo: function () { stopTurbo(); render(); },
    nextTurboCard: nextTurboCard,
    setTurboSpeed: setTurboSpeed,
    goCombo: goCombo,
    verifyComboStep: verifyComboStep,
    pickRandomLeader: pickRandomLeader,
    setLeaderMode: function (m) { A.playTap(); state.leaderMode = m; state.leaderStep1 = null; state.leaderProjected = null; render(); },
    leaderPickCmd: leaderPickCmd,
    toggleMute: function () {
      var m = A.toggleMute();
      var btn = document.getElementById('sb-mute-btn');
      if (btn) btn.textContent = m ? '🔇 Muted' : '🔊 Sound';
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    root.InstructionsApp.init();
  });
})(typeof window !== 'undefined' ? window : this);
