/**
 * Predictions Application Controller: 10-Stage Progression, Dramatic Reveal Timing, Team Scoreboard
 */

class PredictionsAppController {
  constructor() {
    this.state = {
      currentStage: 1,
      difficulty: 'normal', // 'easy', 'normal', 'challenge'
      introChoice: null,
      introRevealed: false,
      lookPredictIndex: 0,
      lookPredictRevealed: false,
      listenGuessIndex: 0,
      listenGuessRevealed: false,
      sequenceIndex: 0,
      sequenceRevealed: false,
      whatWillDoIndex: 0,
      whatWillDoRevealed: false,
      bingoBoard: JSON.parse(JSON.stringify(window.PREDICTIONS_DATA.bingoBoard)),
      crazyScenarioIndex: 0,
      detectiveIndex: 0,
      cluesFound: new Set(),
      teams: JSON.parse(JSON.stringify(window.PREDICTIONS_DATA.teams)),
      boxRevealed: false,
      activeBoxReveal: window.PREDICTIONS_DATA.showdownBox.reveals[0],
      stars: 10
    };

    this.init();
  }

  init() {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', () => this.resizeStage());
      window.addEventListener('orientationchange', () => this.resizeStage());
    }

    setTimeout(() => this.resizeStage(), 50);
    this.renderStage(1);
  }

  resizeStage() {
    const stage = document.getElementById('predictions-stage');
    if (!stage) return;

    const baseWidth = 1200;
    const baseHeight = 675;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    stage.style.transform = `scale(${scale})`;
  }

  renderStage(stageNum) {
    this.state.currentStage = stageNum;
    const viewport = document.getElementById('predictions-viewport');
    if (!viewport) return;

    // Update HUD stage label
    const indicator = document.getElementById('hud-pred-stage-name');
    if (indicator) {
      if (stageNum === 'award') {
        indicator.textContent = '🏆 10. Award Ceremony';
      } else {
        const stageInfo = window.PREDICTIONS_DATA.stages.find(s => s.num === stageNum);
        indicator.textContent = stageInfo ? `${stageInfo.icon} ${stageInfo.title}` : `Stage ${stageNum}`;
      }
    }

    switch (stageNum) {
      case 1:
        viewport.innerHTML = window.PredictionsScenes.renderIntroFreeze(this.state);
        window.predictionsSound.playPop();
        break;
      case 2:
        viewport.innerHTML = window.PredictionsScenes.renderPredictionLanguage(this.state);
        window.predictionsSound.playPop();
        break;
      case 3:
        viewport.innerHTML = window.PredictionsScenes.renderLookAndPredict(this.state);
        window.predictionsSound.playPop();
        break;
      case 4:
        viewport.innerHTML = window.PredictionsScenes.renderListenAndGuess(this.state);
        window.predictionsSound.playPop();
        break;
      case 5:
        viewport.innerHTML = window.PredictionsScenes.renderPictureSequences(this.state);
        window.predictionsSound.playPop();
        break;
      case 6:
        viewport.innerHTML = window.PredictionsScenes.renderWhatWillTheyDo(this.state);
        window.predictionsSound.playPop();
        break;
      case 7:
        viewport.innerHTML = window.PredictionsScenes.renderPredictionBingo(this.state);
        window.predictionsSound.playPop();
        break;
      case 8:
        viewport.innerHTML = window.PredictionsScenes.renderCrazyPredictions(this.state);
        window.predictionsSound.playPop();
        break;
      case 9:
        viewport.innerHTML = window.PredictionsScenes.renderPredictionDetectives(this.state);
        window.predictionsSound.playPop();
        break;
      case 10:
        viewport.innerHTML = window.PredictionsScenes.renderBigShowdown(this.state);
        window.predictionsSound.playPop();
        break;
      case 'award':
        viewport.innerHTML = window.PredictionsScenes.renderAwardCeremony(this.state);
        window.predictionsSound.playFanfare();
        this.launchConfetti();
        break;
      default:
        this.renderStage(1);
        break;
    }

    const stage = document.getElementById('predictions-stage');
    if (stage) stage.scrollTop = 0;
  }

  nextStage() {
    if (typeof this.state.currentStage === 'number') {
      if (this.state.currentStage < 10) {
        this.renderStage(this.state.currentStage + 1);
      } else {
        this.renderStage('award');
      }
    } else {
      this.renderStage(1);
    }
  }

  prevStage() {
    if (typeof this.state.currentStage === 'number' && this.state.currentStage > 1) {
      this.renderStage(this.state.currentStage - 1);
    } else {
      this.renderStage(1);
    }
  }

  addStars(count, reason = "") {
    this.state.stars += count;
    const countElem = document.getElementById('hud-pred-stars');
    if (countElem) countElem.textContent = this.state.stars;
    this.showToast(`⭐ +${count} Stars: ${reason}`);
    window.predictionsSound.playSparkle();
  }

  showToast(message) {
    const toast = document.getElementById('pred-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ================= STAGE 1: INTRO FREEZE ================= */

  chooseIntroChoice(choiceId) {
    this.state.introChoice = choiceId;
    window.predictionsSound.playPop();
    this.renderStage(1);
  }

  revealIntroEvent() {
    window.predictionsSound.playDrumRoll(() => {
      window.predictionsSound.playSlideWhistle();
      setTimeout(() => {
        window.predictionsSound.playDogBark();
        this.state.introRevealed = true;
        this.addStars(10, "Revealed the future outcome!");
        window.predictionsSound.speak(window.PREDICTIONS_DATA.introFreeze.revealText);
        this.renderStage(1);
      }, 400);
    });
  }

  /* ================= STAGE 3: LOOK & PREDICT ================= */

  selectLookChoice(isCorrect) {
    if (isCorrect) {
      window.predictionsSound.playSparkle();
      this.addStars(10, "Good observation!");
    } else {
      window.predictionsSound.playPop();
    }
    this.revealLookPredict();
  }

  revealLookPredict() {
    this.state.lookPredictRevealed = true;
    const curCase = window.PREDICTIONS_DATA.lookPredictCases[this.state.lookPredictIndex];
    window.predictionsSound.speak(curCase.sentence);
    this.renderStage(3);
  }

  nextLookPredictCase() {
    this.state.lookPredictRevealed = false;
    const total = window.PREDICTIONS_DATA.lookPredictCases.length;
    if (this.state.lookPredictIndex < total - 1) {
      this.state.lookPredictIndex++;
      this.renderStage(3);
    } else {
      this.state.lookPredictIndex = 0;
      this.renderStage(4);
    }
  }

  /* ================= STAGE 4: LISTEN & GUESS ================= */

  selectListenChoice(isCorrect) {
    this.state.listenGuessRevealed = true;
    const curCase = window.PREDICTIONS_DATA.listenGuessCases[this.state.listenGuessIndex];
    if (isCorrect) {
      window.predictionsSound.playSparkle();
      this.addStars(10, "Great listening prediction!");
    } else {
      window.predictionsSound.playPop();
    }
    window.predictionsSound.speak(curCase.sentence);
    this.renderStage(4);
  }

  nextListenGuessCase() {
    this.state.listenGuessRevealed = false;
    const total = window.PREDICTIONS_DATA.listenGuessCases.length;
    if (this.state.listenGuessIndex < total - 1) {
      this.state.listenGuessIndex++;
      this.renderStage(4);
    } else {
      this.state.listenGuessIndex = 0;
      this.renderStage(5);
    }
  }

  /* ================= STAGE 5: SEQUENCES ================= */

  selectSeqChoice(isCorrect) {
    if (isCorrect) {
      this.revealSequence();
    } else {
      window.predictionsSound.playPop();
      this.showToast("Try another prediction!");
    }
  }

  revealSequence() {
    this.state.sequenceRevealed = true;
    const curSeq = window.PREDICTIONS_DATA.sequences[this.state.sequenceIndex];
    if (this.state.sequenceIndex === 0) {
      window.predictionsSound.playSplash();
    } else {
      window.predictionsSound.playSparkle();
    }
    window.predictionsSound.speak(curSeq.reveal.text);
    this.addStars(15, "Completed the sequence prediction!");
    this.renderStage(5);
  }

  nextSequence() {
    this.state.sequenceRevealed = false;
    const total = window.PREDICTIONS_DATA.sequences.length;
    this.state.sequenceIndex = (this.state.sequenceIndex + 1) % total;
    window.predictionsSound.playPop();
    this.renderStage(5);
  }

  /* ================= STAGE 6: WHAT WILL THEY DO ================= */

  selectWhatWillDoItem(isBest) {
    this.state.whatWillDoRevealed = true;
    const curCase = window.PREDICTIONS_DATA.whatWillDoCases[this.state.whatWillDoIndex];
    window.predictionsSound.playSparkle();
    window.predictionsSound.speak(curCase.prediction);
    this.addStars(10, "Predicted character choice!");
    this.renderStage(6);
  }

  nextWhatWillDoCase() {
    this.state.whatWillDoRevealed = false;
    const total = window.PREDICTIONS_DATA.whatWillDoCases.length;
    this.state.whatWillDoIndex = (this.state.whatWillDoIndex + 1) % total;
    window.predictionsSound.playPop();
    this.renderStage(6);
  }

  /* ================= STAGE 7: PREDICTION BINGO ================= */

  toggleBingoCell(cellId) {
    const cell = this.state.bingoBoard.find(c => c.id === cellId);
    if (cell) {
      cell.marked = !cell.marked;
      if (cell.marked) {
        window.predictionsSound.playSparkle();
        this.addStars(5, `Marked: ${cell.text}`);
      } else {
        window.predictionsSound.playPop();
      }
      this.renderStage(7);
    }
  }

  resetBingo() {
    this.state.bingoBoard.forEach(c => c.marked = false);
    window.predictionsSound.playPop();
    this.showToast("🔄 Bingo Board Reset!");
    this.renderStage(7);
  }

  /* ================= STAGE 8: CRAZY PREDICTIONS ================= */

  nextCrazyScenario() {
    const total = window.PREDICTIONS_DATA.crazyScenarios.length;
    this.state.crazyScenarioIndex = (this.state.crazyScenarioIndex + 1) % total;
    window.predictionsSound.playPop();
    this.renderStage(8);
  }

  /* ================= STAGE 9: DETECTIVES ================= */

  toggleClue(clueId) {
    this.state.cluesFound.add(clueId);
    window.predictionsSound.playPop();
    const curCase = window.PREDICTIONS_DATA.detectiveCases[this.state.detectiveIndex];

    if (this.state.cluesFound.size === curCase.clues.length) {
      window.predictionsSound.playSparkle();
      window.predictionsSound.speak(curCase.prediction);
      this.addStars(15, "All clues found! Synthesized prediction!");
    }
    this.renderStage(9);
  }

  nextDetectiveCase() {
    this.state.cluesFound.clear();
    const total = window.PREDICTIONS_DATA.detectiveCases.length;
    this.state.detectiveIndex = (this.state.detectiveIndex + 1) % total;
    window.predictionsSound.playPop();
    this.renderStage(9);
  }

  /* ================= STAGE 10: SHOWDOWN ================= */

  addTeamPoint(teamId, pts) {
    const team = this.state.teams.find(t => t.id === teamId);
    if (team) {
      team.score += pts;
      window.predictionsSound.playSparkle();
      this.showToast(`🎉 ${team.name} scored +${pts} Points!`);
      this.renderStage(10);
    }
  }

  revealMysteryBox() {
    window.predictionsSound.playDrumRoll(() => {
      const box = window.PREDICTIONS_DATA.showdownBox;
      const randomIdx = Math.floor(Math.random() * box.reveals.length);
      this.state.activeBoxReveal = box.reveals[randomIdx];
      this.state.boxRevealed = true;
      window.predictionsSound.playCelebrationFanfare();
      window.predictionsSound.speak(this.state.activeBoxReveal.text);
      this.renderStage(10);
    });
  }

  /* ================= CONFETTI & CELEBRATION ================= */

  launchConfetti() {
    const container = document.getElementById('predictions-viewport');
    if (!container || !document.createElement) return;

    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-particle';
      conf.style.left = `${Math.random() * 95}%`;
      conf.style.backgroundColor = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)];
      conf.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      conf.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(conf);
      setTimeout(() => conf.remove(), 4000);
    }
  }

  /* ================= TEACHER CONTROLS ================= */

  setDifficulty(level) {
    this.state.difficulty = level;
    window.predictionsSound.playPop();
    this.showToast(`🎯 Difficulty set to: ${level.toUpperCase()}`);
    this.renderStage(this.state.currentStage);
  }

  revealAnswer() {
    if (this.state.currentStage === 1) {
      this.revealIntroEvent();
    } else if (this.state.currentStage === 3) {
      this.revealLookPredict();
    } else if (this.state.currentStage === 5) {
      this.revealSequence();
    } else {
      this.showToast("💡 Future event revealed by teacher!");
    }
  }
}

window.predictionsApp = new PredictionsAppController();
