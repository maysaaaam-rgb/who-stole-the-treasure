/**
 * "HOW WOULD YOU FEEL?" — Main Application Controller
 * Handles 16:9 Scaling, 10-Stage Lifecycle, Canvas Spinning Wheel,
 * Classroom Team Scores, Timers, and Audio Sync.
 */

class FeelingsApp {
  constructor() {
    this.state = {
      currentStage: 1,
      teamScores: { teamA: 0, teamB: 0 },

      // Stage 1
      mysteryFaceIndex: 0,
      mysteryFaceAnswered: false,

      // Stage 2
      showAllFeelings: false,

      // Stage 3
      whichFeelingIndex: 0,
      whichFeelingAnswered: false,
      thinkTimerFinished: false,
      thinkTimerSeconds: 5,

      // Stage 4
      situationIndex: 0,
      situationChoices: {},

      // Stage 5
      dilemmaIndex: 0,
      dilemmaVotes: {},

      // Stage 6
      currentSpinnerItem: null,
      spinnerAngle: 0,
      isSpinning: false,
      spinnerFeelingChosen: null,
      spinnerActionChosen: null,

      // Stage 7
      matchedTriplets: new Set(),
      selectedMatchSit: null,
      selectedMatchFeel: null,

      // Stage 8
      songRound: 1,
      activeSongVerse: null,
      songRevealed: {},

      // Stage 9
      bossCardIndex: 0,
      bossTimerSeconds: 5,
      bossActive: false,

      // Stage 10
      currentExitSituation: window.FEELINGS_DATA ? window.FEELINGS_DATA.mainSituations[0] : null,
      exitTier: 2
    };

    this.timerInterval = null;
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.resizeStage());
      window.addEventListener('orientationchange', () => this.resizeStage());
    }

    setTimeout(() => {
      this.resizeStage();
      this.renderStage(1);
    }, 50);
  }

  // ================= 16:9 AUTO-SCALING =================
  resizeStage() {
    const stage = document.getElementById('feelings-stage');
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

  // ================= STAGE RENDER & HUD =================
  renderStage(stageNum) {
    this.clearIntervals();
    this.state.currentStage = stageNum;

    const viewport = document.getElementById('feelings-viewport');
    if (!viewport) return;

    const stageNames = {
      1: "1. 🎭 Mystery Face",
      2: "2. 🧠 Feeling Discovery",
      3: "3. 🎯 Which Feeling?",
      4: "4. 🎭 How Would You Feel?",
      5: "5. 🤔 Harder Thinking",
      6: "6. 🎡 Spin & React",
      7: "7. 🔄 Match Triplet",
      8: "8. 🎵 Feelings Song",
      9: "9. ⚡ Boss Challenge",
      10: "10. 🎫 Exit Ticket"
    };

    const hudLabel = document.getElementById('hud-stage-name');
    if (hudLabel) hudLabel.textContent = stageNames[stageNum] || `Stage ${stageNum}`;

    // Render stage scene
    switch (stageNum) {
      case 1:
        viewport.innerHTML = window.FeelingsScenes.renderStage1(this.state);
        break;
      case 2:
        viewport.innerHTML = window.FeelingsScenes.renderStage2(this.state);
        break;
      case 3:
        viewport.innerHTML = window.FeelingsScenes.renderStage3(this.state);
        this.startThinkTimer();
        break;
      case 4:
        viewport.innerHTML = window.FeelingsScenes.renderStage4(this.state);
        break;
      case 5:
        viewport.innerHTML = window.FeelingsScenes.renderStage5(this.state);
        break;
      case 6:
        viewport.innerHTML = window.FeelingsScenes.renderStage6(this.state);
        setTimeout(() => this.drawWheel(), 50);
        break;
      case 7:
        viewport.innerHTML = window.FeelingsScenes.renderStage7(this.state);
        break;
      case 8:
        viewport.innerHTML = window.FeelingsScenes.renderStage8(this.state);
        break;
      case 9:
        viewport.innerHTML = window.FeelingsScenes.renderStage9(this.state);
        break;
      case 10:
        viewport.innerHTML = window.FeelingsScenes.renderStage10(this.state);
        break;
      default:
        viewport.innerHTML = window.FeelingsScenes.renderStage1(this.state);
    }
  }

  prevStage() {
    if (this.state.currentStage > 1) {
      this.renderStage(this.state.currentStage - 1);
    }
  }

  nextStage() {
    if (this.state.currentStage < 10) {
      this.renderStage(this.state.currentStage + 1);
    }
  }

  clearIntervals() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.state.bossActive = false;
  }

  // ================= STAGE 1: MYSTERY FACE =================
  handleMysteryChoice(selectedId, targetId) {
    if (selectedId === targetId) {
      window.feelingsSound.playCorrect();
      this.state.mysteryFaceAnswered = true;
      this.renderStage(1);
      window.feelingsSound.speak(`Correct! He feels ${targetId}!`);
    } else {
      window.feelingsSound.playGentle();
      this.showToast("Look closely at the expression! Try again!");
    }
  }

  nextMysteryFace() {
    this.state.mysteryFaceIndex = (this.state.mysteryFaceIndex + 1) % window.FEELINGS_DATA.mysteryFaces.length;
    this.state.mysteryFaceAnswered = false;
    this.renderStage(1);
  }

  // ================= STAGE 2: FEELING DISCOVERY =================
  speakEmotion(name, chunk, gesture) {
    window.feelingsSound.playCorrect();
    window.feelingsSound.speak(`${name}. ${chunk}.`);
    this.showToast(`👉 Gesture: ${gesture}`);
  }

  toggleDiscoveryFeelings() {
    this.state.showAllFeelings = !this.state.showAllFeelings;
    this.renderStage(2);
  }

  // ================= STAGE 3: WHICH FEELING =================
  startThinkTimer() {
    this.state.thinkTimerFinished = false;
    this.state.thinkTimerSeconds = 5;

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.state.thinkTimerSeconds > 1) {
        this.state.thinkTimerSeconds--;
        window.feelingsSound.playTick();
        const secEl = document.querySelector('.timer-seconds-text');
        const barEl = document.querySelector('.timer-bar-inner');
        if (secEl) secEl.textContent = `${this.state.thinkTimerSeconds}s`;
        if (barEl) barEl.style.width = `${(this.state.thinkTimerSeconds / 5) * 100}%`;
      } else {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.state.thinkTimerFinished = true;
        this.state.thinkTimerSeconds = 0;
        window.feelingsSound.playBoing();
        this.renderStage(3);
        window.feelingsSound.speak("Time is up! Choose your feeling!");
      }
    }, 1000);
  }

  handleWhichFeelingChoice(chosenId, answerId) {
    if (chosenId === answerId) {
      window.feelingsSound.playCorrect();
      this.state.whichFeelingAnswered = true;
      this.renderStage(3);
      window.feelingsSound.speak(`Yes! You are ${answerId}!`);
    } else {
      window.feelingsSound.playGentle();
      this.showToast("Think about the situation! Try another feeling!");
    }
  }

  nextWhichFeeling() {
    this.state.whichFeelingIndex = (this.state.whichFeelingIndex + 1) % window.FEELINGS_DATA.whichFeelingScenarios.length;
    this.state.whichFeelingAnswered = false;
    this.renderStage(3);
  }

  // ================= STAGE 4: 10 SITUATIONS =================
  handleSituationChoice(sitId, optId) {
    const sit = window.FEELINGS_DATA.mainSituations.find(s => s.id === sitId);
    const opt = sit ? sit.options.find(o => o.id === optId) : null;
    if (!opt) return;

    window.feelingsSound.playCorrect();
    this.state.situationChoices[sitId] = opt;
    this.renderStage(4);
    window.feelingsSound.speak(opt.chunk);
  }

  prevSituation() {
    if (this.state.situationIndex > 0) {
      this.state.situationIndex--;
      this.renderStage(4);
    }
  }

  nextSituation() {
    if (this.state.situationIndex < window.FEELINGS_DATA.mainSituations.length - 1) {
      this.state.situationIndex++;
      this.renderStage(4);
    }
  }

  // ================= STAGE 5: HARDER THINKING =================
  handleDilemmaVote(dilemmaId, optId) {
    if (!this.state.dilemmaVotes[dilemmaId]) {
      this.state.dilemmaVotes[dilemmaId] = {};
    }
    const current = this.state.dilemmaVotes[dilemmaId][optId] || 0;
    this.state.dilemmaVotes[dilemmaId][optId] = current + 1;

    window.feelingsSound.playCorrect();
    this.renderStage(5);

    const dilemma = window.FEELINGS_DATA.harderThinking.find(d => d.id === dilemmaId);
    const opt = dilemma ? dilemma.options.find(o => o.id === optId) : null;
    if (opt) window.feelingsSound.speak(opt.chunk);
  }

  prevDilemma() {
    if (this.state.dilemmaIndex > 0) {
      this.state.dilemmaIndex--;
      this.renderStage(5);
    }
  }

  nextDilemma() {
    if (this.state.dilemmaIndex < window.FEELINGS_DATA.harderThinking.length - 1) {
      this.state.dilemmaIndex++;
      this.renderStage(5);
    }
  }

  // ================= STAGE 6: DIGITAL SPINNER =================
  drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const items = window.FEELINGS_DATA.spinnerItems;
    const numSlices = items.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(this.state.spinnerAngle);

    const colors = [
      '#fef08a', '#bfdbfe', '#fecaca', '#ddd6fe',
      '#fed7aa', '#bbf7d0', '#fbcfe8', '#cffafe',
      '#fef3c7', '#e0e7ff', '#dcfce7', '#fed7d7'
    ];

    for (let i = 0; i < numSlices; i++) {
      const angle = i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 4, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Label & Icon
      ctx.save();
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px Nunito, sans-serif';
      ctx.fillText(`${items[i].icon} ${items[i].label}`, radius - 20, 5);
      ctx.restore();
    }

    ctx.restore();
  }

  spinWheel() {
    if (this.state.isSpinning) return;
    this.state.isSpinning = true;
    this.state.spinnerFeelingChosen = null;
    this.state.spinnerActionChosen = null;

    const items = window.FEELINGS_DATA.spinnerItems;
    const targetIdx = Math.floor(Math.random() * items.length);
    const numSlices = items.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    // Pointer is at the TOP (angle = 3*PI/2)
    const targetAngle = (3 * Math.PI / 2) - (targetIdx * sliceAngle + sliceAngle / 2);
    const totalSpins = 4 + Math.floor(Math.random() * 3);
    const finalAngle = targetAngle + (totalSpins * 2 * Math.PI);

    let startAngle = this.state.spinnerAngle % (2 * Math.PI);
    let duration = 3500;
    let startTime = null;

    const animateSpin = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.state.spinnerAngle = startAngle + (finalAngle - startAngle) * ease;
      this.drawWheel();

      if (Math.floor(elapsed / 120) % 2 === 0) {
        window.feelingsSound.playSpinnerTick();
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        this.state.isSpinning = false;
        this.state.currentSpinnerItem = items[targetIdx];
        window.feelingsSound.playBoing();
        this.renderStage(6);
        window.feelingsSound.speak(`${items[targetIdx].label}! ${items[targetIdx].feelPrompt}`);
      }
    };

    requestAnimationFrame(animateSpin);
  }

  handleSpinnerFeeling(feelId, feelName) {
    this.state.spinnerFeelingChosen = feelName;
    window.feelingsSound.playCorrect();
    this.renderStage(6);
    const cur = this.state.currentSpinnerItem;
    if (cur) window.feelingsSound.speak(`I'd feel ${feelName}! Now, ${cur.actionPrompt}`);
  }

  handleSpinnerAction(actId, actChunk) {
    this.state.spinnerActionChosen = actChunk;
    window.feelingsSound.playCorrect();
    this.renderStage(6);
    window.feelingsSound.speak(actChunk);
  }

  // ================= STAGE 7: MATCHING TRIPLETS =================
  selectMatchSit(id) {
    this.state.selectedMatchSit = id;
    window.feelingsSound.playTick();
    this.renderStage(7);
  }

  selectMatchFeel(id) {
    this.state.selectedMatchFeel = id;
    window.feelingsSound.playTick();
    this.renderStage(7);
  }

  selectMatchAction(id) {
    if (this.state.selectedMatchSit === id && this.state.selectedMatchFeel === id) {
      // Complete Triplet match!
      window.feelingsSound.playCorrect();
      this.state.matchedTriplets.add(id);
      this.state.selectedMatchSit = null;
      this.state.selectedMatchFeel = null;
      this.renderStage(7);

      const trip = window.FEELINGS_DATA.matchingTriplets.find(t => t.id === id);
      if (trip) {
        window.feelingsSound.speak(`${trip.situation.label}! I'd feel ${trip.feeling.label}! ${trip.action.label}!`);
      }
    } else {
      window.feelingsSound.playGentle();
      this.showToast("That doesn't match! Try another connection!");
    }
  }

  resetMatching() {
    this.state.matchedTriplets.clear();
    this.state.selectedMatchSit = null;
    this.state.selectedMatchFeel = null;
    this.renderStage(7);
  }

  // ================= STAGE 8: FEELINGS SONG =================
  setSongRound(r) {
    this.state.songRound = r;
    this.renderStage(8);
  }

  playVerse(idx) {
    const v = window.FEELINGS_DATA.songVerses[idx];
    if (!v) return;

    this.state.activeSongVerse = idx;
    this.renderStage(8);

    window.feelingsSound.playSongTone(v.freq, 0.4);
    window.feelingsSound.speak(`${v.cue} I'm ${v.targetName}!`, () => {
      this.state.activeSongVerse = null;
      this.renderStage(8);
    });
  }

  revealSongBlank(idx) {
    this.state.songRevealed[idx] = true;
    window.feelingsSound.playCorrect();
    this.renderStage(8);
    const v = window.FEELINGS_DATA.songVerses[idx];
    if (v) window.feelingsSound.speak(`Yes! ${v.targetName}!`);
  }

  playFullSong() {
    let currentIdx = 0;
    const verses = window.FEELINGS_DATA.songVerses;

    const playNext = () => {
      if (currentIdx >= verses.length) {
        this.state.activeSongVerse = null;
        this.renderStage(8);
        window.feelingsSound.playFanfare();
        this.showToast("🎵 Great Singing & Movement!");
        return;
      }

      this.state.activeSongVerse = currentIdx;
      this.renderStage(8);

      const v = verses[currentIdx];
      window.feelingsSound.playSongTone(v.freq, 0.5);
      window.feelingsSound.speak(`${v.cue} I'm ${v.targetName}!`, () => {
        currentIdx++;
        setTimeout(playNext, 600);
      });
    };

    playNext();
  }

  // ================= STAGE 9: BOSS CHALLENGE =================
  startBossTimer() {
    this.state.bossActive = true;
    this.state.bossTimerSeconds = 5;

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.state.bossTimerSeconds > 1) {
        this.state.bossTimerSeconds--;
        window.feelingsSound.playTick();
        const circle = document.querySelector('.boss-timer-circle');
        if (circle) circle.textContent = `${this.state.bossTimerSeconds}s`;
      } else {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.state.bossTimerSeconds = 0;
        this.state.bossActive = false;
        window.feelingsSound.playBoing();
        this.renderStage(9);
        window.feelingsSound.speak("Time's up! Say what you'd feel and do!");
      }
    }, 1000);

    this.renderStage(9);
  }

  handleBossSuccess() {
    this.clearIntervals();
    window.feelingsSound.playCorrect();
    this.addScore('teamA', 1);
    this.addScore('teamB', 1);
    this.showToast("⚡ Rapid Reaction Master! +2 Points!");
    this.nextBossCard();
  }

  nextBossCard() {
    this.clearIntervals();
    this.state.bossCardIndex = (this.state.bossCardIndex + 1) % window.FEELINGS_DATA.bossCards.length;
    this.state.bossTimerSeconds = 5;
    this.state.bossActive = false;
    this.renderStage(9);
  }

  // ================= STAGE 10: EXIT TICKET =================
  rollRandomExitSituation() {
    const list = window.FEELINGS_DATA.mainSituations;
    const randomSit = list[Math.floor(Math.random() * list.length)];
    this.state.currentExitSituation = randomSit;
    window.feelingsSound.playBoing();
    this.renderStage(10);
  }

  setExitTier(tier) {
    this.state.exitTier = tier;
    this.renderStage(10);
  }

  // ================= TEAM SCORES =================
  addScore(team, pts) {
    if (this.state.teamScores[team] !== undefined) {
      this.state.teamScores[team] += pts;
      window.feelingsSound.playCorrect();

      const el = document.getElementById(`score-${team}`);
      if (el) el.textContent = this.state.teamScores[team];
    }
  }

  resetScores() {
    this.state.teamScores.teamA = 0;
    this.state.teamScores.teamB = 0;
    const a = document.getElementById('score-teamA');
    const b = document.getElementById('score-teamB');
    if (a) a.textContent = 0;
    if (b) b.textContent = 0;
    this.showToast("Scores reset!");
  }

  // ================= TOAST NOTIFICATION =================
  showToast(msg, duration = 2400) {
    const toast = document.getElementById('feelings-toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}

if (typeof window !== 'undefined') {
  window.FeelingsApp = FeelingsApp;
}
