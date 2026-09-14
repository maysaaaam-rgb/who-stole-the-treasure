/**
 * ALICE'S WONDERLAND READING QUEST — APPLICATION CONTROLLER
 * State Management, Interactive Workflows, Lightweight Gamification & Teacher HUD
 */

(function(root) {
  'use strict';

  class AliceAppController {
    constructor() {
      this.state = {
        currentLesson: 'lesson1',
        currentStage: 1,
        adventureScore: 0,
        stars: 0,
        keys: 0,
        hearts: 3,
        combo: 0,
        badgesEarned: [],
        activeTeacherTab: 'lesson1',
        activeTeacherActIdx: 0,
        bossQuestionsAnswered: []
      };

      this.container = null;
      this.toastTimer = null;
    }

    init() {
      this.container = document.getElementById('alice-stage-container');
      this.loadSavedState();
      this.render();
      this.updateHud();
    }

    loadSavedState() {
      try {
        const raw = localStorage.getItem('eaa_alice_quest_state');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.adventureScore) this.state.adventureScore = parsed.adventureScore;
          if (parsed.stars) this.state.stars = parsed.stars;
          if (parsed.keys) this.state.keys = parsed.keys;
          if (parsed.badgesEarned) this.state.badgesEarned = parsed.badgesEarned;
        }
      } catch (e) {
        console.warn('Could not load saved Alice state:', e);
      }
    }

    saveState() {
      try {
        localStorage.setItem('eaa_alice_quest_state', JSON.stringify({
          adventureScore: this.state.adventureScore,
          stars: this.state.stars,
          keys: this.state.keys,
          badgesEarned: this.state.badgesEarned
        }));
      } catch (e) {}
    }

    // =========================================================================
    // NAVIGATION & STAGE ROUTING
    // =========================================================================
    switchLesson(lessonId) {
      this.state.currentLesson = lessonId;
      this.state.currentStage = 1;
      this.render();
      this.updateHud();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goToStage(lessonId, stageNum) {
      this.state.currentLesson = lessonId;
      this.state.currentStage = stageNum;
      this.render();
      this.updateHud();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevStage() {
      if (this.state.currentStage > 1) {
        this.goToStage(this.state.currentLesson, this.state.currentStage - 1);
      }
    }

    nextStage() {
      if (this.state.currentStage < 7) {
        this.goToStage(this.state.currentLesson, this.state.currentStage + 1);
      } else {
        this.showToast("You've completed all levels of this lesson!");
      }
    }

    render() {
      if (!this.container) return;
      const lesson = this.state.currentLesson;
      const stage = this.state.currentStage;

      if (lesson === 'lesson1') {
        switch (stage) {
          case 1: root.aliceScenes.renderFollowRabbit(this.container, this.state); break;
          case 2: root.aliceScenes.renderWhatHappened(this.container, this.state); break;
          case 3: root.aliceScenes.renderHumanAlice(this.container, this.state); break;
          case 4: root.aliceScenes.renderFeelingMonster(this.container, this.state); break;
          case 5: root.aliceScenes.renderFeelingDetective(this.container, this.state); break;
          case 6: root.aliceScenes.renderMysteryDoor(this.container, this.state); break;
          case 7: root.aliceScenes.renderSaveAliceBoss(this.container, this.state); break;
          default: root.aliceScenes.renderFollowRabbit(this.container, this.state);
        }
      } else if (lesson === 'lesson2') {
        switch (stage) {
          case 1: root.aliceScenes.renderDontRead(this.container, this.state); break;
          case 2: root.aliceScenes.renderEagleEyes(this.container, this.state); break;
          case 3: root.aliceScenes.renderAliceSpeedSkim(this.container, this.state); break;
          case 4: root.aliceScenes.renderSkimOrRead(this.container, this.state); break;
          case 5: root.aliceScenes.renderMainIdea(this.container, this.state); break;
          case 6: root.aliceScenes.renderBrainPower(this.container, this.state); break;
          case 7: root.aliceScenes.renderSpeedSkimmerBoss(this.container, this.state); break;
          default: root.aliceScenes.renderDontRead(this.container, this.state);
        }
      }
    }

    updateHud() {
      // Tab highlighting
      const tabL1 = document.getElementById('tab-lesson1');
      const tabL2 = document.getElementById('tab-lesson2');
      if (tabL1) tabL1.className = `lesson-tab-btn ${this.state.currentLesson === 'lesson1' ? 'active' : ''}`;
      if (tabL2) tabL2.className = `lesson-tab-btn gold ${this.state.currentLesson === 'lesson2' ? 'active' : ''}`;

      // Tracker title
      const tracker = document.getElementById('hud-stage-tracker');
      if (tracker) {
        if (this.state.currentLesson === 'lesson1') {
          const names = ["1. 🐇 Follow Rabbit", "2. 🧩 What Happened?", "3. 👥 Human Alice", "4. 😮 Feeling Monster", "5. 🕵️ Feeling Detective", "6. 🚪 Mystery Door", "7. ⚡ Save Alice Boss"];
          tracker.textContent = names[this.state.currentStage - 1] || 'Lesson 1';
        } else {
          const names = ["1. 👀 Don't Read — SKIM!", "2. 🦅 Eagle Eyes", "3. 🔎 Speed Skim", "4. ⚖️ Skim or Read?", "5. 🧠 Main Idea", "6. ⚡ Brain Power", "7. 🏆 Speed Skimmer Boss"];
          tracker.textContent = names[this.state.currentStage - 1] || 'Lesson 2';
        }
      }

      // Stats counters
      const scoreEl = document.getElementById('hud-score-val');
      if (scoreEl) scoreEl.textContent = `${this.state.adventureScore} XP`;

      const starsEl = document.getElementById('hud-stars-val');
      if (starsEl) starsEl.textContent = this.state.stars;

      const keysEl = document.getElementById('hud-keys-val');
      if (keysEl) keysEl.textContent = this.state.keys;

      // Combo Pill
      const comboPill = document.getElementById('hud-combo-pill');
      if (comboPill) {
        if (this.state.combo >= 3) {
          comboPill.style.display = 'flex';
          comboPill.textContent = this.state.combo >= 5 ? `🔥🔥 ${this.state.combo} COMBO!` : `🔥 ${this.state.combo} COMBO!`;
        } else {
          comboPill.style.display = 'none';
        }
      }
    }

    addPoints(pts, stars = 1, reason = "") {
      this.state.adventureScore += pts;
      this.state.stars += stars;
      this.state.combo++;
      this.updateHud();
      this.saveState();
      this.showToast(`+${pts} XP! ⭐ +${stars} Star! ${reason}`);
    }

    addKey(reason = "") {
      this.state.keys++;
      root.aliceAudio.playSparkle();
      this.updateHud();
      this.saveState();
      this.showToast(`🔑 Found a Golden Key! ${reason}`);
    }

    awardBadge(badgeId) {
      if (!this.state.badgesEarned.includes(badgeId)) {
        this.state.badgesEarned.push(badgeId);
        root.aliceAudio.playFanfare();
        const b = root.ALICE_DATA.badges.find(x => x.id === badgeId);
        this.showToast(`🏆 UNLOCKED BADGE: ${b ? b.title : badgeId}!`);
        root.aliceAudio.speak(`Congratulations! You unlocked the ${b ? b.title : badgeId} badge!`);
        this.saveState();
      }
    }

    showToast(msg) {
      const toast = document.getElementById('alice-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.style.display = 'block';
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }

    // =========================================================================
    // MISSION 1: FOLLOW THE RABBIT
    // =========================================================================
    playRabbitDialogue() {
      root.aliceAudio.speak("Rabbit says: Come on! I am late! Alice says: Wait! Where are you going?");
    }

    tapRabbit() {
      root.aliceScenes.rabbitHopCount++;
      root.aliceAudio.playHop();
      const rabbit = document.getElementById('rabbit-runner-actor');
      const bubble = document.getElementById('rabbit-speech-pop');

      if (root.aliceScenes.rabbitHopCount === 1) {
        if (rabbit) {
          rabbit.style.left = '520px';
          rabbit.style.bottom = '120px';
        }
        if (bubble) bubble.textContent = '"Hurry up! Follow me!" 🐇';
        this.addPoints(10, 1, "Followed the Rabbit!");
        root.aliceAudio.speak("Come on! Hurry up!");
      } else {
        if (rabbit) {
          rabbit.style.left = '760px';
          rabbit.style.bottom = '40px';
        }
        const hole = document.getElementById('rabbit-hole-box');
        if (hole) hole.style.display = 'flex';
        const banner = document.getElementById('jump-kinesthetic-banner');
        if (banner) banner.style.display = 'flex';

        this.addPoints(15, 1, "Found the Rabbit Hole!");
        root.aliceAudio.speak("Look! A rabbit hole! Everybody JUMP!");
      }
    }

    jumpIntoHole() {
      root.aliceAudio.playHop();
      root.aliceAudio.playSuccess();
      this.addPoints(20, 2, "Jumped into the Rabbit Hole!");
      this.addKey("Jumped in!");
      this.showToast("🌀 WHOOSH! Falling down the rabbit hole!");
      root.aliceAudio.speak("One, two, three... JUMP! You jumped into Wonderland!");
      setTimeout(() => {
        this.goToStage('lesson1', 2);
      }, 1500);
    }

    // =========================================================================
    // MISSION 2: WHAT HAPPENED?
    // =========================================================================
    assignCard(orderNum) {
      const cards = root.ALICE_DATA.lesson1.storyCards;
      const card = cards.find(c => c.order === orderNum);
      if (!card) return;

      for (let i = 1; i <= 6; i++) {
        if (!root.aliceScenes.storySlotAssignments[i]) {
          root.aliceScenes.storySlotAssignments[i] = card;
          root.aliceAudio.playClick();
          this.render();
          return;
        }
      }
      this.showToast("All 6 slots are filled! Tap 'Check Order'!");
    }

    clearStorySlot(slotNum) {
      delete root.aliceScenes.storySlotAssignments[slotNum];
      root.aliceAudio.playClick();
      this.render();
    }

    checkStorySequence() {
      const assigned = root.aliceScenes.storySlotAssignments;
      let allCorrect = true;

      for (let i = 1; i <= 6; i++) {
        if (!assigned[i] || assigned[i].order !== i) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        root.aliceAudio.playFanfare();
        this.addPoints(30, 3, "Story Reconstructed in Order!");
        this.awardBadge('story-master');
        this.showToast("✨ PERFECT SEQUENCE! You fixed Alice's Story!");
        root.aliceAudio.speak("Excellent! You put Alice's story in the exact order!");
      } else {
        root.aliceAudio.playError();
        this.state.combo = 0;
        this.updateHud();
        this.showToast("Almost! Look at what happened first by the river 🌳!");
        root.aliceAudio.speak("Almost! Look again! What happened first by the river?");
      }
    }

    // =========================================================================
    // MISSION 4: FEELING MONSTER
    // =========================================================================
    chooseFeeling(selectedId, correctId) {
      const monster = document.getElementById('monster-face');
      const fb = document.getElementById('feeling-feedback');
      const btn = document.getElementById(`feeling-btn-${selectedId}`);

      if (selectedId === correctId) {
        root.aliceAudio.playMonsterGiggle();
        root.aliceAudio.playSuccess();
        this.addPoints(15, 1, `Identified ${selectedId.toUpperCase()}!`);

        const fData = root.ALICE_DATA.lesson1.feelings.find(x => x.id === selectedId);
        if (monster) {
          monster.textContent = fData.emoji;
          monster.style.transform = 'scale(1.25) rotate(5deg)';
          setTimeout(() => { monster.style.transform = 'scale(1)'; }, 600);
        }

        if (fb) {
          fb.style.display = 'block';
          fb.innerHTML = `
            <div class="speaking-banner" style="border-color:var(--alice-green); margin-top:10px;">
              <div class="speak-text">
                ✓ Correct! Alice feels <span class="highlight">${selectedId.toUpperCase()}</span>!
              </div>
              <button class="action-btn green" onclick="window.aliceApp.nextFeelingSituation()">Next Situation ➡️</button>
            </div>
          `;
        }
        root.aliceAudio.speak(`Correct! She is ${selectedId}!`);
      } else {
        root.aliceAudio.playError();
        if (btn) btn.className = 'feeling-btn incorrect';
        this.showToast("Almost! Look at what just happened to Alice!");
        root.aliceAudio.speak("Look again! How does she feel?");
      }
    }

    nextFeelingSituation() {
      const sits = root.ALICE_DATA.lesson1.feelingSituations;
      if (root.aliceScenes.activeSituationIdx < sits.length - 1) {
        root.aliceScenes.activeSituationIdx++;
        this.render();
      } else {
        this.awardBadge('feeling-detective');
        this.goToStage('lesson1', 5);
      }
    }

    triggerCopyFaceGame() {
      const feelings = ["SURPRISED 😮", "BORED 🥱", "WORRIED 😟", "INTERESTED 👀"];
      const rand = feelings[Math.floor(Math.random() * feelings.length)];
      root.aliceAudio.playMonsterGiggle();
      this.showToast(`😜 COPY THE FACE: Show me ${rand}!`);
      root.aliceAudio.speak(`Show me ${rand.split(' ')[0].toLowerCase()}! Freeze!`);
    }

    // =========================================================================
    // MISSION 6: MYSTERY DOOR
    // =========================================================================
    selectWorld(worldId) {
      root.aliceScenes.selectedWorld = worldId;
      root.aliceAudio.playClick();
      this.render();
    }

    unlockDoorAnimation() {
      root.aliceAudio.playDoorOpen();
      root.aliceAudio.playSparkle();
      this.addPoints(20, 2, "Unlocked the Mystery Door!");
      this.showToast("🚪 The Golden Door Swings Open!");
      const doorIcon = document.getElementById('golden-door-icon');
      if (doorIcon) {
        doorIcon.textContent = '🏰✨';
        doorIcon.style.transform = 'scale(1.3) rotate(360deg)';
        doorIcon.style.transition = 'all 0.6s ease';
      }
      root.aliceAudio.speak("The door is open! What an amazing world you imagined!");
    }

    // =========================================================================
    // MISSION 7: MINI-BOSS
    // =========================================================================
    bossStep(stepNum) {
      if (!this.state.bossSteps) this.state.bossSteps = [];
      if (!this.state.bossSteps.includes(stepNum)) {
        this.state.bossSteps.push(stepNum);
        root.aliceAudio.playSuccess();
        this.addPoints(10, 1, `Step ${stepNum} locked in!`);

        if (this.state.bossSteps.length === 4) {
          const area = document.getElementById('boss-feedback-area');
          if (area) {
            area.innerHTML = `
              <div class="speaking-banner" style="border-color:var(--alice-gold);">
                <div class="speak-text">
                  🎉 <strong>YOU SAVED ALICE!</strong> The story is in perfect order!
                </div>
                <button class="action-btn gold" onclick="window.aliceApp.launchBossCeremony()">Collect Trophy 🏆</button>
              </div>
            `;
          }
          root.aliceAudio.speak("You saved Alice! The story is in perfect order!");
        }
      }
    }

    launchBossCeremony() {
      root.aliceAudio.playFanfare();
      this.awardBadge('story-master');
      this.showToast("🏆 INVENTOR OF STORIES! Lesson 1 Complete!");
    }

    // =========================================================================
    // LESSON 2: SKIMMING ACTIONS
    // =========================================================================
    startSkimTimer() {
      root.aliceScenes.skimCountdown = 8;
      root.aliceScenes.isSkimBlurred = false;
      this.render();

      clearInterval(root.aliceScenes.skimTimer);
      root.aliceScenes.skimTimer = setInterval(() => {
        root.aliceScenes.skimCountdown--;
        const disp = document.getElementById('skim-timer-display');
        if (disp) disp.textContent = `${root.aliceScenes.skimCountdown}s`;
        root.aliceAudio.playTimerTick();

        if (root.aliceScenes.skimCountdown <= 0) {
          clearInterval(root.aliceScenes.skimTimer);
          root.aliceScenes.isSkimBlurred = true;
          root.aliceAudio.playDoorOpen();
          this.render();
          root.aliceAudio.speak("Stop! Time is up! What did you see?");
        }
      }, 1000);
    }

    pickSkimItem(idx, isCorrect) {
      if (!root.aliceScenes.selectedSkimItems.includes(idx)) {
        root.aliceScenes.selectedSkimItems.push(idx);
        if (isCorrect) {
          root.aliceAudio.playSuccess();
          this.addPoints(10, 1, "Spotted correct object!");
        } else {
          root.aliceAudio.playError();
          this.showToast("That wasn't in the passage! Try again!");
        }
        this.render();
      }
    }

    spotKeyword(word) {
      root.aliceAudio.playSparkle();
      this.addPoints(10, 1, `Eagle Eyes spotted ${word}!`);
      this.showToast(`👁️ Eagle Eyes locked onto: ${word}!`);
      root.aliceAudio.speak(`Spotted: ${word}!`);
    }

    awardEagleEyesBadge() {
      this.awardBadge('eagle-eyes');
      this.addPoints(25, 2, "Eagle Eyes Superpower Unlocked!");
    }

    answerSpeedMission(idx, isCorrect) {
      if (isCorrect) {
        root.aliceAudio.playSuccess();
        this.addPoints(15, 1, "Speed Skim Answer Correct!");
        root.aliceAudio.speak("Correct! You found it with quick skimming!");

        setTimeout(() => {
          const missions = root.ALICE_DATA.lesson2.speedMissions;
          if (root.aliceScenes.activeSpeedMissionIdx < missions.length - 1) {
            root.aliceScenes.activeSpeedMissionIdx++;
            this.render();
          } else {
            this.showToast("All 3 Speed Skim missions complete!");
            this.goToStage('lesson2', 4);
          }
        }, 1200);
      } else {
        root.aliceAudio.playError();
        this.showToast("Look quickly again! Check numbers or capital letters!");
      }
    }

    chooseSkimOrRead(choice, correct) {
      const fb = document.getElementById('scenario-feedback');
      const cur = root.ALICE_DATA.lesson2.scenarios[root.aliceScenes.activeScenarioIdx || 0];

      if (choice === correct) {
        root.aliceAudio.playSuccess();
        this.addPoints(15, 1, "Correct reading strategy!");
        if (fb) {
          fb.style.display = 'block';
          fb.innerHTML = `
            <div class="speaking-banner" style="border-color:var(--alice-green);">
              <div class="speak-text">
                ✓ Correct! <strong>${choice}</strong> — ${cur.reason}
              </div>
              <button class="action-btn green" onclick="window.aliceApp.nextScenario()">Next Scenario ➡️</button>
            </div>
          `;
        }
        root.aliceAudio.speak(`Correct! ${choice}! ${cur.reason}`);
      } else {
        root.aliceAudio.playError();
        if (fb) {
          fb.style.display = 'block';
          fb.innerHTML = `
            <div style="color:var(--alice-rose); font-weight:800; font-size:1.05rem;">
              Think about why: ${cur.reason}
            </div>
          `;
        }
        root.aliceAudio.speak(`Think carefully! ${cur.reason}`);
      }
    }

    nextScenario() {
      const scenarios = root.ALICE_DATA.lesson2.scenarios;
      if (root.aliceScenes.activeScenarioIdx < scenarios.length - 1) {
        root.aliceScenes.activeScenarioIdx++;
        this.render();
      } else {
        this.goToStage('lesson2', 5);
      }
    }

    answerMainIdea(optIdx, isCorrect) {
      const fb = document.getElementById('main-idea-feedback');
      if (isCorrect) {
        root.aliceAudio.playSuccess();
        this.addPoints(25, 2, "Found the Main Idea!");
        if (fb) {
          fb.style.display = 'block';
          fb.innerHTML = `
            <div class="speaking-banner" style="border-color:var(--alice-green);">
              <div class="speak-text">
                ✓ <strong>CORRECT MAIN IDEA:</strong> "The different parts of the brain we use when we learn!"
              </div>
              <button class="action-btn green" onclick="window.aliceApp.goToStage('lesson2', 6)">Go to Brain Power ➡️</button>
            </div>
          `;
        }
        root.aliceAudio.speak("Correct! The main idea is the different parts of the brain we use when we learn!");
      } else {
        root.aliceAudio.playError();
        this.showToast("Look at the title: 'Learning and Your Brain'!");
        root.aliceAudio.speak("Look at the title! Learning and your brain!");
      }
    }

    activateBrainPower(name, sentence) {
      root.aliceAudio.playSparkle();
      this.addPoints(10, 1, `Activated ${name}!`);
      this.showToast(`🧠 ${name}: ${sentence}`);
      root.aliceAudio.speak(`My brain can ${name.toLowerCase()}! ${sentence}`);
    }

    startBossTimer() {
      root.aliceScenes.bossCountdown = 12;
      root.aliceScenes.isBossBlurred = false;
      this.render();

      clearInterval(root.aliceScenes.bossTimer);
      root.aliceScenes.bossTimer = setInterval(() => {
        root.aliceScenes.bossCountdown--;
        const disp = document.getElementById('boss-timer-display');
        if (disp) disp.textContent = `${root.aliceScenes.bossCountdown}s`;
        root.aliceAudio.playTimerTick();

        if (root.aliceScenes.bossCountdown <= 0) {
          clearInterval(root.aliceScenes.bossTimer);
          root.aliceScenes.isBossBlurred = true;
          root.aliceAudio.playDoorOpen();
          this.render();
          root.aliceAudio.speak("Time is up! Answer the 3 skimming questions!");
        }
      }, 1000);
    }

    answerBossQ(qNum) {
      if (!this.state.bossQuestionsAnswered.includes(qNum)) {
        this.state.bossQuestionsAnswered.push(qNum);
        root.aliceAudio.playSuccess();
        this.addPoints(15, 1, `Boss question ${qNum} answered!`);

        if (this.state.bossQuestionsAnswered.length === 3) {
          const vic = document.getElementById('boss-victory-area');
          if (vic) {
            vic.innerHTML = `
              <div class="speaking-banner" style="border-color:var(--alice-gold);">
                <div class="speak-text">
                  ⚡ <strong>BOSS DEFEATED!</strong> You are an Official Speed Skimmer!
                </div>
                <button class="action-btn gold" onclick="window.aliceApp.launchFinalCeremony()">Graduation Ceremony 🎓</button>
              </div>
            `;
          }
          this.awardBadge('speed-skimmer');
        }
      }
    }

    launchFinalCeremony() {
      root.aliceAudio.playFanfare();
      this.addPoints(100, 5, "Master Reading Adventure Certificate Awarded!");
      this.showToast("🎓 WONDERLAND QUEST COMPLETE! Certified Reading Adventurer!");
      root.aliceAudio.speak("Congratulations! You completed Alice's Wonderland Reading Quest!");
    }

    // =========================================================================
    // HINT SYSTEM
    // =========================================================================
    showHint() {
      root.aliceAudio.playSparkle();
      const hints = {
        lesson1: [
          "Tap the white rabbit to follow him along the riverbank!",
          "Look at the pictures: Tree = 1, Rabbit = 2, Hole = 3, Key = 6!",
          "Act it out: Sit, run, jump, fall, land, find the key!",
          "Look at Alice's face! Does she look surprised, bored, or worried?",
          "Use the frame: 'She is surprised because the rabbit has a watch!'",
          "Imagine anything you want behind the door! A castle, dragon, or space!",
          "Put Alice's story in order to defeat the mixed-up cards!"
        ],
        lesson2: [
          "Don't read every word! Just take a quick snapshot with your eyes!",
          "Look for big capital letters: DOOR, KEY, GARDEN, ALICE!",
          "Scan for digits like '38' or keywords like 'key' and 'garden'!",
          "Ask yourself: Do I need every small detail, or just the big idea?",
          "Look at the TITLE: 'Learning and Your Brain' tells you the main idea!",
          "The brain can think, learn, remember, and help you rest!",
          "Skim the robot story fast: Who is in it? What does it do?"
        ]
      };
      const list = hints[this.state.currentLesson] || hints.lesson1;
      const text = list[this.state.currentStage - 1] || "Look carefully and have fun!";
      this.showToast(`💡 HINT: ${text}`);
      root.aliceAudio.speak(text);
    }

    // =========================================================================
    // TEACHER CONTROL CENTER MODAL
    // =========================================================================
    openTeacherModal() {
      const modal = document.getElementById('alice-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      const tm = root.ALICE_DATA.teacherMode;
      const tab = this.state.activeTeacherTab || 'lesson1';
      const actList = tab === 'lesson1' ? tm.lesson1 : tm.lesson2;
      const cur = actList[this.state.activeTeacherActIdx || 0];

      let html = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--alice-border); padding-bottom:12px; margin-bottom:14px;">
            <h2 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--alice-gold);">
              ⚙️ Teacher HUD: 8 Pedagogical Dimensions
            </h2>
            <div style="display:flex; gap:8px;">
              <button class="lesson-tab-btn ${tab === 'lesson1' ? 'active' : ''}" onclick="window.aliceApp.switchTeacherTab('lesson1')">Lesson 1 (35m)</button>
              <button class="lesson-tab-btn gold ${tab === 'lesson2' ? 'active' : ''}" onclick="window.aliceApp.switchTeacherTab('lesson2')">Lesson 2 (35m)</button>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
      `;

      actList.forEach((a, i) => {
        const sel = i === (this.state.activeTeacherActIdx || 0) ? 'primary' : '';
        html += `<button class="hud-btn ${sel}" onclick="window.aliceApp.selectTeacherAct(${i})">${i + 1}. ${a.name} (${a.time})</button>`;
      });

      html += `
          </div>

          <div style="background:var(--alice-canvas); border:1px solid var(--alice-border); border-radius:12px; padding:16px; font-size:0.9rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--alice-teal);">${cur.name}</h3>
              <span class="stage-tracker-pill">${cur.time}</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--alice-gold);">1. Objective:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${cur.objective}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--alice-gold);">2. Classroom Setup:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${cur.setup}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--alice-gold);">3. Teacher Says:</strong>
                <p style="color:#e2e8f0; margin-top:2px; font-style:italic;">"${cur.teacherSays}"</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--alice-gold);">4. Student Action:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${cur.studentAction}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--alice-green);">5. Answer:</strong>
                <p style="color:var(--alice-green); margin-top:2px;">${cur.answer}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--alice-teal);">6. No-Tech Classroom Version:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${cur.noTechVersion}</p>
              </div>
              <div style="background:rgba(168,85,247,0.1); border:1px solid var(--alice-purple); padding:10px; border-radius:8px; grid-column:span 2;">
                <strong style="color:var(--alice-purple);">7. Optional Extension:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${cur.extension}</p>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
            <a href="worksheet.html" target="_blank" class="action-btn gold" style="text-decoration:none;">
              🖨️ Open 6-Page Printable Kit & Cutout Cards
            </a>
            <button class="action-btn primary" onclick="window.aliceApp.closeModal()">Close HUD</button>
          </div>
        </div>
      `;

      content.innerHTML = html;
      modal.style.display = 'flex';
    }

    switchTeacherTab(tabName) {
      this.state.activeTeacherTab = tabName;
      this.state.activeTeacherActIdx = 0;
      this.openTeacherModal();
    }

    selectTeacherAct(idx) {
      this.state.activeTeacherActIdx = idx;
      this.openTeacherModal();
    }

    closeModal() {
      const modal = document.getElementById('alice-modal');
      if (modal) modal.style.display = 'none';
    }
  }

  root.aliceApp = new AliceAppController();
  document.addEventListener('DOMContentLoaded', () => {
    root.aliceApp.init();
  });
})(window);
