/**
 * Sound Detective Pro: Reactive Engine & 5-Stage Controller
 * Level: CEFR A2 / A2+ | Primary CLIL & ESL
 */
(function() {
  'use strict';

  const data = window.SOUND_PRO_DATA || window.SOUND_DETECTIVE_DATA;

  const state = {
    xp: 0,
    currentStage: 1,
    // Stage 1
    s1TargetIndex: 0,
    s1Target: null,
    waveAnimId: null,
    // Stage 2
    s2TargetIndex: 0,
    s2PlacedParts: new Set(),
    // Stage 3
    s3Index: 0,
    s3SelectedCard: null,
    // Stage 4
    s4Broadcasting: false,
    // Stage 5 (Baamboozle)
    bActiveTeam: 'cyan', // 'cyan' | 'amber'
    bScores: { cyan: 0, amber: 0 },
    bClaimedCards: new Set(),
    bCurrentCard: null,
    bTimerInterval: null,
    bTimeLeft: 15,
    bDoubleBuff: { cyan: false, amber: false }
  };

  const dom = {
    hudXP: document.getElementById('hud-xp'),
    hudTimerChip: document.getElementById('hud-timer-chip'),
    hudTimer: document.getElementById('hud-timer'),
    // Steppers
    steps: [1, 2, 3, 4, 5].map(i => document.getElementById(`step-${i}`)),
    // Panels
    panels: {
      1: document.getElementById('stage-scanner'),
      2: document.getElementById('stage-anatomy'),
      3: document.getElementById('stage-deduction'),
      4: document.getElementById('stage-foley'),
      5: document.getElementById('stage-baamboozle')
    },
    // Stage 1
    wavePath: document.getElementById('wave-path'),
    sliderPitch: document.getElementById('slider-pitch'),
    sliderTexture: document.getElementById('slider-texture'),
    valPitch: document.getElementById('val-pitch'),
    valTexture: document.getElementById('val-texture'),
    btnScannerPlay: document.getElementById('btn-scanner-play'),
    btnScannerConfirm: document.getElementById('btn-scanner-confirm'),
    scannerFeedback: document.getElementById('scanner-feedback'),
    // Stage 2
    anatomyMachineName: document.getElementById('anatomy-machine-name'),
    anatomySentenceStem: document.getElementById('anatomy-sentence-stem'),
    anatomyPartsTray: document.getElementById('anatomy-parts-tray'),
    btnAnatomyNext: document.getElementById('btn-anatomy-next'),
    // Stage 3
    deductionClue: document.getElementById('deduction-clue'),
    cardChoiceA: document.getElementById('card-choice-a'),
    iconChoiceA: document.getElementById('icon-choice-a'),
    labelChoiceA: document.getElementById('label-choice-a'),
    cardChoiceB: document.getElementById('card-choice-b'),
    iconChoiceB: document.getElementById('icon-choice-b'),
    labelChoiceB: document.getElementById('label-choice-b'),
    btnDeduceMust: document.getElementById('btn-deduce-must'),
    btnDeduceCant: document.getElementById('btn-deduce-cant'),
    // Stage 4
    proTele1: document.getElementById('pro-tele-1'),
    proTele2: document.getElementById('pro-tele-2'),
    proTele3: document.getElementById('pro-tele-3'),
    btnFoleyBroadcast: document.getElementById('btn-foley-broadcast'),
    // Stage 5
    scoreCyan: document.getElementById('score-cyan'),
    scoreAmber: document.getElementById('score-amber'),
    turnIndicator: document.getElementById('turn-indicator'),
    baamboozleBoard: document.getElementById('baamboozle-board'),
    cardModal: document.getElementById('card-modal'),
    modalCardHeader: document.getElementById('modal-card-header'),
    modalTimerBar: document.getElementById('modal-timer-bar'),
    timerFill: document.getElementById('timer-fill'),
    modalCardContent: document.getElementById('modal-card-content'),
    modalCardAnswer: document.getElementById('modal-card-answer'),
    btnShowAnswer: document.getElementById('btn-show-answer'),
    evalBtns: document.getElementById('eval-btns'),
    btnEvalCorrect: document.getElementById('btn-eval-correct'),
    btnEvalWrong: document.getElementById('btn-eval-wrong'),
    btnCloseTrap: document.getElementById('btn-close-trap')
  };

  function addXP(amount) {
    state.xp += amount;
    if (dom.hudXP) dom.hudXP.textContent = state.xp;
    if (window.SoundAudio) window.SoundAudio.playXP();
  }

  // --- STAGE SWITCHING ---
  window.switchStage = function(stageNum) {
    state.currentStage = stageNum;
    dom.steps.forEach((chip, i) => {
      if (chip) chip.classList.toggle('active', i + 1 === stageNum);
    });
    Object.keys(dom.panels).forEach(k => {
      const panel = dom.panels[k];
      if (panel) panel.style.display = (parseInt(k, 10) === stageNum) ? 'flex' : 'none';
    });

    if (dom.hudTimerChip) {
      dom.hudTimerChip.style.display = (stageNum === 5) ? 'flex' : 'none';
    }

    if (stageNum === 1) initStage1();
    if (stageNum === 2) initStage2();
    if (stageNum === 3) initStage3();
    if (stageNum === 4) initStage4();
    if (stageNum === 5) initStage5();
  };

  // =========================================================================
  // STAGE 1: SONIC SPECTRUM SCANNER
  // =========================================================================
  const pitchLabels = { 1: "Low", 2: "Medium", 3: "High" };
  const textureLabels = { 1: "Intermittent", 2: "Continuous" };

  function initStage1() {
    state.s1Target = data.mechanics[state.s1TargetIndex % data.mechanics.length];
    if (dom.scannerFeedback) dom.scannerFeedback.style.display = 'none';
    startOscilloscope();

    dom.sliderPitch.oninput = () => {
      dom.valPitch.textContent = pitchLabels[dom.sliderPitch.value];
    };
    dom.sliderTexture.oninput = () => {
      dom.valTexture.textContent = textureLabels[dom.sliderTexture.value];
    };

    dom.btnScannerPlay.onclick = () => {
      if (window.SoundAudio && window.SoundAudio[state.s1Target.audioMethod]) {
        window.SoundAudio[state.s1Target.audioMethod]();
      }
    };

    dom.btnScannerConfirm.onclick = () => {
      const userPitch = parseInt(dom.sliderPitch.value, 10);
      const userTexture = parseInt(dom.sliderTexture.value, 10);
      const isPitchMatch = (userPitch === state.s1Target.pitchVal);
      const isTextureMatch = (userTexture === state.s1Target.textureVal);

      if (isPitchMatch && isTextureMatch) {
        dom.scannerFeedback.className = "feedback-banner success";
        dom.scannerFeedback.innerHTML = `🎯 <strong>CALIBRATION LOCKED!</strong> ${state.s1Target.name} confirmed (${state.s1Target.soundType}). (+20 XP)`;
        addXP(20);
        if (window.SoundAudio) {
          window.SoundAudio.speak(`Excellent calibration! That is the ${state.s1Target.name}, which ${state.s1Target.actionVerb}.`);
        }
        setTimeout(() => {
          window.switchStage(2);
        }, 1800);
      } else {
        dom.scannerFeedback.className = "feedback-banner fail";
        dom.scannerFeedback.innerHTML = `⚠️ <strong>CALIBRATION MISMATCH:</strong> Listen again! Is the acoustic frequency high or low? Continuous or intermittent?`;
        if (window.SoundAudio) {
          window.SoundAudio.playSoftFail();
          window.SoundAudio.speak("Acoustic mismatch. Adjust the frequency and texture sliders.");
        }
      }
    };
  }

  function startOscilloscope() {
    let phase = 0;
    function renderWave() {
      if (state.currentStage !== 1) return;
      phase += 0.08;
      const pitch = parseInt(dom.sliderPitch ? dom.sliderPitch.value : 2, 10);
      const texture = parseInt(dom.sliderTexture ? dom.sliderTexture.value : 1, 10);

      const freq = pitch === 1 ? 0.02 : pitch === 2 ? 0.04 : 0.07;
      const amp = texture === 1 ? 26 : 38;

      let d = `M 0 80`;
      for (let x = 0; x <= 600; x += 15) {
        const y = 80 + Math.sin(x * freq + phase) * amp;
        d += ` L ${x} ${y.toFixed(1)}`;
      }
      if (dom.wavePath) dom.wavePath.setAttribute('d', d);
      requestAnimationFrame(renderWave);
    }
    requestAnimationFrame(renderWave);
  }

  // =========================================================================
  // STAGE 2: ACOUSTIC ANATOMY LAB
  // =========================================================================
  function initStage2() {
    const item = data.mechanics[state.s2TargetIndex % data.mechanics.length];
    state.s2PlacedParts.clear();

    dom.anatomyMachineName.textContent = `${item.name} Assembly`;
    dom.anatomySentenceStem.textContent = `When [Component] vibrates, it ${item.actionVerb}.`;

    // Reset sockets
    ['p1', 'p2', 'p3'].forEach((pId, idx) => {
      const socket = document.getElementById(`socket-${pId}`);
      if (socket) {
        socket.className = 'blueprint-socket';
        socket.querySelector('.socket-name').textContent = `${item.parts[idx].name} Socket`;
      }
    });

    // Populate Parts Tray
    dom.anatomyPartsTray.innerHTML = '';
    const shuffledParts = [...item.parts].sort(() => 0.5 - Math.random());
    shuffledParts.forEach(part => {
      const chip = document.createElement('div');
      chip.className = 'component-chip';
      chip.id = `chip-${part.id}`;
      chip.innerHTML = `
        <h4>⚙️ ${part.name}</h4>
        <p>${part.function}</p>
      `;
      chip.onclick = () => placeAnatomyPart(part, item, chip);
      dom.anatomyPartsTray.appendChild(chip);
    });

    dom.btnAnatomyNext.onclick = () => {
      if (state.s2PlacedParts.size >= 3) {
        if (window.SoundAudio && window.SoundAudio[item.audioMethod]) {
          window.SoundAudio[item.audioMethod]();
        }
        addXP(30);
        if (window.SoundAudio) {
          window.SoundAudio.speak(`Mechanism test successful! ${item.deduction}`);
        }
        setTimeout(() => {
          window.switchStage(3);
        }, 2200);
      } else {
        if (window.SoundAudio) window.SoundAudio.speak("Mount all three internal components first.");
      }
    };
  }

  function placeAnatomyPart(part, item, chipElement) {
    if (state.s2PlacedParts.has(part.id)) return;
    state.s2PlacedParts.add(part.id);
    chipElement.classList.add('placed');

    const socket = document.getElementById(`socket-${part.id}`);
    if (socket) {
      socket.classList.add('filled');
      socket.querySelector('.socket-name').innerHTML = `✅ <strong>${part.name}</strong> (${part.function})`;
    }

    if (window.SoundAudio) {
      window.SoundAudio.playXP();
      window.SoundAudio.speak(part.name + ": " + part.function);
    }

    if (state.s2PlacedParts.size >= 3) {
      dom.anatomySentenceStem.innerHTML = `🌟 <strong>COMPLETE MECHANISM:</strong> ${item.deduction}`;
    }
  }

  // =========================================================================
  // STAGE 3: THE DEDUCTION ARENA
  // =========================================================================
  function initStage3() {
    renderDeductionTrial();
  }

  function renderDeductionTrial() {
    const trial = data.deductionTrials[state.s3Index % data.deductionTrials.length];
    state.s3SelectedCard = null;

    dom.deductionClue.textContent = `"${trial.cue}"`;

    dom.iconChoiceA.textContent = trial.correctIcon;
    dom.labelChoiceA.textContent = trial.correctLabel;
    dom.cardChoiceA.className = "versus-card";
    dom.cardChoiceA.onclick = () => selectDeductionCard('correct', dom.cardChoiceA);

    dom.iconChoiceB.textContent = trial.distractorIcon;
    dom.labelChoiceB.textContent = trial.distractorLabel;
    dom.cardChoiceB.className = "versus-card";
    dom.cardChoiceB.onclick = () => selectDeductionCard('distractor', dom.cardChoiceB);

    dom.btnDeduceMust.onclick = () => handleDeductionChoice('must', trial);
    dom.btnDeduceCant.onclick = () => handleDeductionChoice('cant', trial);
  }

  function selectDeductionCard(type, element) {
    state.s3SelectedCard = type;
    dom.cardChoiceA.classList.remove('selected');
    dom.cardChoiceB.classList.remove('selected');
    element.classList.add('selected');
    if (window.SoundAudio) window.SoundAudio.playXP();
  }

  function handleDeductionChoice(modalVerb, trial) {
    if (!state.s3SelectedCard) {
      if (window.SoundAudio) window.SoundAudio.speak("Select a machine card first!");
      return;
    }

    const isTarget = (state.s3SelectedCard === 'correct');
    const isMust = (modalVerb === 'must');

    if (isTarget && isMust) {
      addXP(20);
      if (window.SoundAudio) window.SoundAudio.speak(trial.mustReason);
      advanceDeduction();
    } else if (!isTarget && !isMust) {
      addXP(20);
      if (window.SoundAudio) window.SoundAudio.speak(trial.cantReason);
      advanceDeduction();
    } else {
      if (window.SoundAudio) {
        window.SoundAudio.playSoftFail();
        window.SoundAudio.speak(isTarget ? "Use 'must be' for evidence that matches!" : "Use 'can't be' for impossible matches!");
      }
    }
  }

  function advanceDeduction() {
    state.s3Index++;
    if (state.s3Index >= 3) {
      setTimeout(() => window.switchStage(4), 1600);
    } else {
      setTimeout(renderDeductionTrial, 1400);
    }
  }

  // =========================================================================
  // STAGE 4: FOLEY STUDIO & BROADCAST
  // =========================================================================
  function initStage4() {
    dom.btnFoleyBroadcast.disabled = false;
    dom.btnFoleyBroadcast.onclick = runFoleyBroadcast;
  }

  function runFoleyBroadcast() {
    if (state.s4Broadcasting) return;
    state.s4Broadcasting = true;
    dom.btnFoleyBroadcast.disabled = true;

    dom.proTele1.classList.add('active');
    dom.proTele2.classList.remove('active');
    dom.proTele3.classList.remove('active');

    if (window.SoundAudio) {
      window.SoundAudio.speak(
        "We analyzed the acoustic frequency of the mystery household object.",
        () => {
          dom.proTele1.classList.remove('active');
          dom.proTele2.classList.add('active');
          window.SoundAudio.speak(
            "It produces a continuous, high-pitched sound, so it must be a kettle.",
            () => {
              dom.proTele2.classList.remove('active');
              dom.proTele3.classList.add('active');
              window.SoundAudio.speak(
                "The whistle occurs when pressurized steam forces through the narrow nozzle.",
                () => {
                  window.SoundAudio.playKettleBoil();
                  addXP(40);
                  state.s4Broadcasting = false;
                  setTimeout(() => window.switchStage(5), 2400);
                }
              );
            }
          );
        }
      );
    }
  }

  // =========================================================================
  // STAGE 5: 24-GRID BAAMBOOZLE TOURNAMENT
  // =========================================================================
  function initStage5() {
    renderBaamboozleBoard();
    updateBaamboozleHUD();
  }

  function renderBaamboozleBoard() {
    dom.baamboozleBoard.innerHTML = '';
    data.baamboozleDeck.forEach(card => {
      const btn = document.createElement('button');
      btn.className = `baamboozle-card ${state.bClaimedCards.has(card.id) ? 'claimed' : ''}`;
      btn.textContent = card.id < 10 ? `0${card.id}` : `${card.id}`;
      btn.onclick = () => openBaamboozleModal(card, btn);
      dom.baamboozleBoard.appendChild(btn);
    });
  }

  function updateBaamboozleHUD() {
    dom.scoreCyan.textContent = state.bScores.cyan;
    dom.scoreAmber.textContent = state.bScores.amber;
    dom.turnIndicator.innerHTML = `TURN: <strong style="color:var(--${state.bActiveTeam})">TEAM ${state.bActiveTeam.toUpperCase()}</strong>`;
  }

  function openBaamboozleModal(card, cardBtn) {
    if (state.bClaimedCards.has(card.id)) return;
    state.bCurrentCard = card;

    dom.cardModal.style.display = 'flex';
    dom.modalCardAnswer.style.display = 'none';
    dom.evalBtns.style.display = 'none';

    if (card.type === 'trap') {
      dom.modalCardHeader.textContent = `Card ${card.id} • TRAP EVENT!`;
      dom.modalTimerBar.style.display = 'none';
      dom.modalCardContent.innerHTML = `
        <div style="font-size:2.8rem; margin-bottom:8px;">⚠️</div>
        <h3 style="color:var(--amber); margin-bottom:8px;">${card.title}</h3>
        <p style="font-size:1.15rem; color:#cbd5e1;">${card.desc}</p>
      `;
      dom.btnShowAnswer.style.display = 'none';
      dom.btnCloseTrap.style.display = 'inline-flex';
      dom.btnCloseTrap.onclick = () => executeTrap(card, cardBtn);
      if (window.SoundAudio) window.SoundAudio.playSoftFail();
    } else {
      dom.modalCardHeader.textContent = `Card ${card.id} • ${card.pts} Pts`;
      dom.modalTimerBar.style.display = 'block';
      dom.timerFill.style.width = '100%';
      dom.modalCardContent.textContent = card.q;
      dom.modalCardAnswer.textContent = "Answer: " + card.a;
      dom.btnShowAnswer.style.display = 'inline-flex';
      dom.btnCloseTrap.style.display = 'none';

      startModalTimer(data.config.timerSeconds || 15);

      dom.btnShowAnswer.onclick = () => {
        clearInterval(state.bTimerInterval);
        dom.modalCardAnswer.style.display = 'block';
        dom.btnShowAnswer.style.display = 'none';
        dom.evalBtns.style.display = 'flex';
      };

      dom.btnEvalCorrect.onclick = () => scoreBaamboozleCard(true, card, cardBtn);
      dom.btnEvalWrong.onclick = () => scoreBaamboozleCard(false, card, cardBtn);

      if (window.SoundAudio) window.SoundAudio.speak(card.q);
    }
  }

  function startModalTimer(seconds) {
    clearInterval(state.bTimerInterval);
    state.bTimeLeft = seconds;
    if (dom.hudTimer) dom.hudTimer.textContent = state.bTimeLeft;

    state.bTimerInterval = setInterval(() => {
      state.bTimeLeft--;
      if (dom.hudTimer) dom.hudTimer.textContent = state.bTimeLeft;
      if (dom.timerFill) {
        dom.timerFill.style.width = `${(state.bTimeLeft / seconds) * 100}%`;
      }
      if (state.bTimeLeft <= 0) {
        clearInterval(state.bTimerInterval);
        if (window.SoundAudio) window.SoundAudio.playSoftFail();
      }
    }, 1000);
  }

  function scoreBaamboozleCard(isCorrect, card, cardBtn) {
    clearInterval(state.bTimerInterval);
    dom.cardModal.style.display = 'none';
    state.bClaimedCards.add(card.id);
    cardBtn.classList.add('claimed');

    if (isCorrect) {
      let pts = card.pts || 15;
      if (state.bDoubleBuff[state.bActiveTeam]) {
        pts *= 2;
        state.bDoubleBuff[state.bActiveTeam] = false;
      }
      state.bScores[state.bActiveTeam] += pts;
      addXP(pts);
      if (window.SoundAudio) window.SoundAudio.playXP();
    } else {
      if (window.SoundAudio) window.SoundAudio.playSoftFail();
    }

    // Switch turn
    state.bActiveTeam = (state.bActiveTeam === 'cyan') ? 'amber' : 'cyan';
    updateBaamboozleHUD();
  }

  function executeTrap(card, cardBtn) {
    dom.cardModal.style.display = 'none';
    state.bClaimedCards.add(card.id);
    cardBtn.classList.add('claimed');

    const otherTeam = (state.bActiveTeam === 'cyan') ? 'amber' : 'cyan';

    if (card.trapType === 'swap') {
      const tmp = state.bScores.cyan;
      state.bScores.cyan = state.bScores.amber;
      state.bScores.amber = tmp;
    } else if (card.trapType === 'steal') {
      const stolen = Math.min(state.bScores[otherTeam], card.pts || 20);
      state.bScores[otherTeam] -= stolen;
      state.bScores[state.bActiveTeam] += stolen;
    } else if (card.trapType === 'bankrupt') {
      state.bScores[state.bActiveTeam] = 0;
    } else if (card.trapType === 'double') {
      state.bDoubleBuff[state.bActiveTeam] = true;
    } else if (card.trapType === 'bonus') {
      state.bScores[state.bActiveTeam] += (card.pts || 25);
    } else if (card.trapType === 'drain') {
      state.bScores[state.bActiveTeam] = Math.max(0, state.bScores[state.bActiveTeam] - (card.pts || 15));
    }

    state.bActiveTeam = otherTeam;
    updateBaamboozleHUD();
  }

  // --- BOOT ENGINE ---
  document.addEventListener('DOMContentLoaded', () => {
    window.switchStage(1);
  });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.switchStage(1);
  }
})();
