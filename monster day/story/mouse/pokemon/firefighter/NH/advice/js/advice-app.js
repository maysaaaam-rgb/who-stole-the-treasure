/**
 * Advice Academy Application Controller: 10-Stage Progression, Thinking Machine, 16:9 Auto-Scaling
 */

class AdviceAppController {
  constructor() {
    this.state = {
      currentStage: 1,
      difficulty: 'normal', // 'easy', 'normal', 'challenge'
      introChoice: null,
      snowSelectedItem: null,
      grammarRoundIndex: 0,
      grammarAnswer: null,
      consequenceCaseIndex: 0,
      selectedEffects: new Set(),
      bestAdviceSelected: null,
      tomActivePanel: 0,
      crazyAdviceChoice: null,
      roleplayCardIndex: 0,
      roleplaySwitched: false,
      selectedPuzzleCards: new Set(),
      crazyBattleIndex: 0,
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
    const stage = document.getElementById('advice-stage');
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
    const viewport = document.getElementById('advice-viewport');
    if (!viewport) return;

    // Update HUD stage label
    const indicator = document.getElementById('hud-adv-stage-name');
    if (indicator) {
      if (stageNum === 'award') {
        indicator.textContent = '🏆 10. Award Ceremony';
      } else {
        const stageInfo = window.ADVICE_DATA.stages.find(s => s.num === stageNum);
        indicator.textContent = stageInfo ? `${stageInfo.icon} ${stageInfo.title}` : `Stage ${stageNum}`;
      }
    }

    switch (stageNum) {
      case 1:
        viewport.innerHTML = window.AdviceScenes.renderEmergencyIntro(this.state);
        window.adviceSound.playEmergency();
        break;
      case 2:
        viewport.innerHTML = window.AdviceScenes.renderWhatsTheProblem(this.state);
        window.adviceSound.playPop();
        break;
      case 3:
        viewport.innerHTML = window.AdviceScenes.renderShouldOrShouldnt(this.state);
        window.adviceSound.playPop();
        break;
      case 4:
        viewport.innerHTML = window.AdviceScenes.renderConsequenceDetective(this.state);
        window.adviceSound.playPop();
        break;
      case 5:
        viewport.innerHTML = window.AdviceScenes.renderWhichAdviceIsBest(this.state);
        window.adviceSound.playPop();
        break;
      case 6:
        viewport.innerHTML = window.AdviceScenes.renderTomsMorning(this.state);
        window.adviceSound.playPop();
        break;
      case 7:
        viewport.innerHTML = window.AdviceScenes.renderPairRoleplay(this.state);
        window.adviceSound.playPop();
        break;
      case 8:
        viewport.innerHTML = window.AdviceScenes.renderAdvicePuzzle(this.state);
        window.adviceSound.playPop();
        break;
      case 9:
        viewport.innerHTML = window.AdviceScenes.renderCrazyAdviceBattle(this.state);
        window.adviceSound.playBoing();
        break;
      case 10:
        viewport.innerHTML = window.AdviceScenes.renderSaveProfessorShould(this.state);
        window.adviceSound.playEmergency();
        break;
      case 'award':
        viewport.innerHTML = window.AdviceScenes.renderAwardCeremony(this.state);
        window.adviceSound.playFanfare();
        this.launchConfetti();
        break;
      default:
        this.renderStage(1);
        break;
    }

    const stage = document.getElementById('advice-stage');
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
    const countElem = document.getElementById('hud-adv-stars');
    if (countElem) countElem.textContent = this.state.stars;
    this.showToast(`⭐ +${count} Stars: ${reason}`);
    window.adviceSound.playSparkle();
  }

  showToast(message) {
    const toast = document.getElementById('adv-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ================= STAGE 1: INTRO DILEMMA ================= */

  chooseIntroOption(optionId) {
    this.state.introChoice = optionId;
    const opt = window.ADVICE_DATA.introDilemma.options.find(o => o.id === optionId);

    if (opt.type === 'best') {
      window.adviceSound.playDing();
      this.addStars(10, "Great advice for Professor Should!");
    } else {
      window.adviceSound.playBoing();
    }

    window.adviceSound.speak(opt.reaction, true);
    this.renderStage(1);
  }

  /* ================= STAGE 2: SNOWSTORM PROBLEM ================= */

  selectSnowItem(itemId) {
    this.state.snowSelectedItem = itemId;
    const item = window.ADVICE_DATA.snowScene.nearbyItems.find(i => i.id === itemId);

    if (item.isSolution) {
      window.adviceSound.playDing();
    } else {
      window.adviceSound.playBoing();
    }

    this.renderStage(2);
  }

  speakSnowAdvice() {
    const item = window.ADVICE_DATA.snowScene.nearbyItems.find(i => i.id === this.state.snowSelectedItem);
    if (item) {
      window.adviceSound.speak(item.sentence);
      this.addStars(10, "Practiced speaking advice aloud!");
    } else {
      this.showToast("👆 Pick an item above first!");
    }
  }

  /* ================= STAGE 3: SHOULD OR SHOULDN'T ================= */

  submitGrammarAnswer(choice) {
    const round = window.ADVICE_DATA.grammarRounds[this.state.grammarRoundIndex];
    this.state.grammarAnswer = choice;

    if (choice === round.answer) {
      window.adviceSound.playDing();
      this.addStars(10, "Correct modal choice!");
      window.adviceSound.speak(round.reaction, true);
    } else {
      window.adviceSound.playBuzzer();
      window.adviceSound.speak(round.reaction, true);
    }

    this.renderStage(3);
  }

  nextGrammarRound() {
    this.state.grammarAnswer = null;
    const total = window.ADVICE_DATA.grammarRounds.length;

    if (this.state.grammarRoundIndex < total - 1) {
      this.state.grammarRoundIndex++;
      this.renderStage(3);
    } else {
      this.state.grammarRoundIndex = 0;
      this.renderStage(4);
    }
  }

  /* ================= STAGE 4: CONSEQUENCE DETECTIVE ================= */

  toggleEffect(effectIdx) {
    if (this.state.selectedEffects.has(effectIdx)) {
      this.state.selectedEffects.delete(effectIdx);
    } else {
      this.state.selectedEffects.add(effectIdx);
    }
    window.adviceSound.playPop();
    this.renderStage(4);
  }

  speakConsequence() {
    const curCase = window.ADVICE_DATA.consequenceCases[this.state.consequenceCaseIndex];
    window.adviceSound.speak(`${curCase.solution} Because ${curCase.reason}`);
    this.addStars(10, "Consequence reasoning!");
  }

  nextConsequenceCase() {
    this.state.selectedEffects.clear();
    const total = window.ADVICE_DATA.consequenceCases.length;

    if (this.state.consequenceCaseIndex < total - 1) {
      this.state.consequenceCaseIndex++;
      this.renderStage(4);
    } else {
      this.state.consequenceCaseIndex = 0;
      this.renderStage(5);
    }
  }

  /* ================= STAGE 5: WHICH ADVICE IS BEST ================= */

  selectBestAdvice(letter) {
    this.state.bestAdviceSelected = letter;
    const opt = window.ADVICE_DATA.bestAdviceDilemma.options.find(o => o.letter === letter);

    if (letter === 'B') {
      window.adviceSound.playDing();
      this.addStars(15, "Found the best advice!");
      window.adviceSound.speak(`Option B is best. ${opt.reason}`);
    } else {
      window.adviceSound.playBoing();
      window.adviceSound.speak(`${opt.rating}. ${opt.reason}`);
    }

    this.renderStage(5);
  }

  /* ================= STAGE 6: TOM'S MORNING ================= */

  selectTomPanel(idx) {
    this.state.tomActivePanel = idx;
    const panel = window.ADVICE_DATA.tomStory[idx];
    window.adviceSound.playPop();
    window.adviceSound.speak(panel.advice);
    this.renderStage(6);
  }

  submitCrazyAdvice(choice) {
    this.state.crazyAdviceChoice = choice;
    if (choice === 'crazy') {
      window.adviceSound.playDing();
      this.addStars(10, "Spotted the crazy advice!");
    } else {
      window.adviceSound.playBuzzer();
    }
    this.renderStage(6);
  }

  /* ================= STAGE 7: PAIR ROLEPLAY ================= */

  switchRoleplayRoles() {
    this.state.roleplaySwitched = !this.state.roleplaySwitched;
    window.adviceSound.playPop();
    this.showToast("🔄 Roles switched! Now speak your new part!");
    this.renderStage(7);
  }

  nextRoleplayCard() {
    const total = window.ADVICE_DATA.roleplayCards.length;
    this.state.roleplayCardIndex = (this.state.roleplayCardIndex + 1) % total;
    window.adviceSound.playPop();
    this.renderStage(7);
  }

  /* ================= STAGE 8: ADVICE PUZZLE ================= */

  togglePuzzleCard(cardId) {
    if (this.state.selectedPuzzleCards.has(cardId)) {
      this.state.selectedPuzzleCards.delete(cardId);
    } else {
      if (this.state.selectedPuzzleCards.size < 2) {
        this.state.selectedPuzzleCards.add(cardId);
      } else {
        this.showToast("You only need the BEST TWO pieces of advice!");
        return;
      }
    }
    window.adviceSound.playPop();
    this.renderStage(8);
  }

  checkPuzzle() {
    const puzzle = window.ADVICE_DATA.classroomPuzzle;
    const selected = Array.from(this.state.selectedPuzzleCards);

    if (selected.length < 2) {
      this.showToast("👆 Pick 2 cards first!");
      return;
    }

    const allBest = selected.every(id => {
      const card = puzzle.cards.find(c => c.id === id);
      return card && card.isBest;
    });

    if (allBest) {
      window.adviceSound.playSparkle();
      this.addStars(20, "Solved the classroom noise puzzle!");
      window.adviceSound.speak("Brilliant! You should speak quietly and listen to the teacher!");
    } else {
      window.adviceSound.playBoing();
      window.adviceSound.speak("One of those choices makes it even noisier! Think again!");
    }
  }

  /* ================= STAGE 9: CRAZY ADVICE BATTLE ================= */

  nextCrazyBattle() {
    const total = window.ADVICE_DATA.crazyBattles.length;
    this.state.crazyBattleIndex = (this.state.crazyBattleIndex + 1) % total;
    window.adviceSound.playBoing();
    this.renderStage(9);
  }

  /* ================= CONFETTI & CELEBRATION ================= */

  launchConfetti() {
    const container = document.getElementById('advice-viewport');
    if (!container || !document.createElement) return;

    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-particle';
      conf.style.left = `${Math.random() * 95}%`;
      conf.style.backgroundColor = ['#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'][Math.floor(Math.random() * 6)];
      conf.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      conf.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(conf);
      setTimeout(() => conf.remove(), 4000);
    }
  }

  /* ================= TEACHER CONTROLS ================= */

  setDifficulty(level) {
    this.state.difficulty = level;
    window.adviceSound.playPop();
    this.showToast(`🎯 Difficulty set to: ${level.toUpperCase()}`);
    this.renderStage(this.state.currentStage);
  }

  revealAnswer() {
    if (this.state.currentStage === 3) {
      const round = window.ADVICE_DATA.grammarRounds[this.state.grammarRoundIndex];
      this.submitGrammarAnswer(round.answer);
    } else if (this.state.currentStage === 5) {
      this.selectBestAdvice('B');
    } else {
      this.showToast("💡 Suggested solution revealed!");
    }
  }
}

window.adviceApp = new AdviceAppController();
