/**
 * YESTERDAY DETECTIVES — APPLICATION CONTROLLER & STATE MACHINE
 */

(function(root) {
  'use strict';

  class DetectivesApp {
    constructor() {
      this.sound = root.detectivesSound;
      this.data = root.DETECTIVES_DATA;
      this.scenes = new root.DetectivesScenes(this);

      // Application State
      this.currentStage = 1;
      this.totalStages = 14;
      this.xp = 0;
      this.teamA = 0;
      this.teamB = 0;

      // Sub-activity states
      this.selectedSortCard = null;
      this.memoryRound = 1;
      this.memoryTimer = null;
      this.memoryRemaining = 30;
      this.memorySelectedMissing = [];
      this.fixDetectiveIndex = 0;
      this.selectedLieId = null;
      this.lastSuspectQuestion = null;
      this.assembledStoryEvents = [];
      this.hardModeIndex = 0;
      this.assessmentScores = { 1: false, 2: false, 3: false, 4: false };

      this.stageTitles = [
        '1. 🕵️ Case Introduction (5m)',
        '2. 📚 Vocabulary Discovery (5m)',
        '3. 🕰️ Discover The Past (5m)',
        '4. 🎯 Easy Grammar Practice (5m)',
        '5. 🧠 The Memory Thief (7m)',
        '6. ⚡ Grammar Challenge: DID (5m)',
        '7. 🤥 Story Has A Lie (5m)',
        '8. 🧾 Physical Evidence (5m)',
        '9. 🔍 Interrogate Suspect (5m)',
        '10. ✍️ Build The Story (5m)',
        '11. 🤥 Create Your Own Lie (5m)',
        '12. 🏆 Detective Mode (5m)',
        '13. ⚡ Hard Mode Mystery (5m)',
        '14. 🎓 Final Assessment (5m)'
      ];
    }

    init() {
      this.renderStage(1);
    }

    // --- Navigation ---

    renderStage(stageNum) {
      if (stageNum < 1) stageNum = 1;
      if (stageNum > this.totalStages) stageNum = this.totalStages;
      this.currentStage = stageNum;

      const viewport = document.getElementById('detectives-viewport');
      const stageNameEl = document.getElementById('hud-stage-name');

      if (stageNameEl) {
        stageNameEl.innerText = this.stageTitles[stageNum - 1] || ('Stage ' + stageNum);
      }

      if (!viewport) return;

      const methodName = 'renderStage' + stageNum;
      if (typeof this.scenes[methodName] === 'function') {
        viewport.innerHTML = this.scenes[methodName]();
      }

      this.sound.playTick();
    }

    nextStage() {
      this.renderStage(this.currentStage + 1);
    }

    prevStage() {
      this.renderStage(this.currentStage - 1);
    }

    // --- HUD Scoreboard & Toast ---

    addScore(team, delta = 1) {
      if (team === 'teamA') {
        this.teamA += delta;
        const el = document.getElementById('score-teamA');
        if (el) el.innerText = this.teamA;
      } else if (team === 'teamB') {
        this.teamB += delta;
        const el = document.getElementById('score-teamB');
        if (el) el.innerText = this.teamB;
      }
      this.sound.playSuccess();
      this.showToast(`⭐ +${delta} Point awarded!`);
    }

    resetScores() {
      this.teamA = 0;
      this.teamB = 0;
      const elA = document.getElementById('score-teamA');
      const elB = document.getElementById('score-teamB');
      if (elA) elA.innerText = '0';
      if (elB) elB.innerText = '0';
      this.showToast('Scores reset to 0');
    }

    showToast(message) {
      const toast = document.getElementById('detectives-toast');
      if (!toast) return;
      toast.innerText = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2600);
    }

    addXP(pts) {
      this.xp += pts;
      this.showToast(`🌟 +${pts} XP earned! Total: ${this.xp} XP`);
    }

    // --- Stage 1 Handlers ---

    inspectIntroClue(type) {
      const box = document.getElementById('intro-clue-detail-box');
      this.sound.playClueChime();
      const messages = {
        glass: '🔍 Magnifying Glass: Look at the tiny scratches near the clock. Someone was here at 3:00 PM yesterday!',
        footprints: '👣 Footprints: Size 36 sneakers walked towards the kitchen and into the backyard.',
        backpack: '🎒 Lost Backpack: A red backpack containing a bus schedule and a half-eaten pizza slice!',
        note: '📝 Mystery Note: "I ate the pizza and went to the zoo. But one thing is not true..."',
        clock: '🕰️ Old Clock: Stopped ticking at exactly 4:15 PM yesterday.',
        photo: '📸 Polaroid Photo: Shows a happy suspect standing near the golden lion enclosure!'
      };
      if (box) {
        box.innerText = messages[type] || 'Clue analyzed!';
      }
    }

    // --- Stage 2 Handlers ---

    playWordSpeech(word) {
      this.sound.playClueChime();
      this.sound.speak(word);
      this.showToast(`🗣️ Pronouncing: "${word}"`);
    }

    checkActionQuiz(chosen) {
      if (chosen === 'eat') {
        this.sound.playSuccess();
        this.addXP(10);
        this.showToast('✅ Correct! "eat" is the action of having food!');
        const box = document.getElementById('quiz-action-prompt');
        if (box) {
          box.innerHTML = '🎉 Excellent Detective Work! <strong>eat</strong> is correct! 🍕';
          box.style.color = '#34d399';
        }
      } else {
        this.sound.playError();
        this.showToast('❌ Look closely at the picture: Eating pizza is "eat"!');
      }
    }

    // --- Stage 3 Handlers ---

    showTimelineVerb(present, past, type) {
      this.sound.playClueChime();
      const presBox = document.getElementById('timeline-present-verb');
      const pastBox = document.getElementById('timeline-past-verb');
      if (presBox) presBox.innerText = `I ${present}...`;
      if (pastBox) pastBox.innerText = `I ${past}...`;
      this.sound.speak(`${present} becomes ${past}`);
    }

    // --- Stage 4 Handlers ---

    checkMCQPractice(ans, isCorrect) {
      if (isCorrect) {
        this.sound.playSuccess();
        this.addXP(10);
        this.showToast('✅ Great! "Yesterday, I played football."');
      } else {
        this.sound.playError();
        this.showToast('❌ Yesterday means past time! Use "played" (+ED).');
      }
    }

    pickSortCard(el) {
      this.sound.playClueChime();
      document.querySelectorAll('.sortable-card').forEach(c => c.style.outline = 'none');
      el.style.outline = '3px solid var(--det-gold)';
      this.selectedSortCard = el;
      this.showToast(`Selected: "${el.innerText}" — Now tap Regular or Irregular!`);
    }

    depositSortCard(trayType) {
      if (!this.selectedSortCard) {
        this.showToast('👆 Tap a word card first!');
        return;
      }
      const cardType = this.selectedSortCard.dataset.type;
      if (cardType === trayType) {
        this.sound.playSuccess();
        this.addXP(5);
        const tray = document.getElementById(`tray-${trayType}-contents`);
        if (tray) {
          this.selectedSortCard.style.outline = 'none';
          this.selectedSortCard.onclick = null;
          this.selectedSortCard.style.cursor = 'default';
          tray.appendChild(this.selectedSortCard);
        }
        this.showToast(`✅ Correct sort: ${this.selectedSortCard.innerText} is ${trayType.toUpperCase()}!`);
        this.selectedSortCard = null;
      } else {
        this.sound.playError();
        this.showToast(`❌ Oops! Look at the ending: Regular verbs end with -ED!`);
      }
    }

    // --- Stage 5 Handlers (Memory Thief) ---

    startMemoryCountdown() {
      const btn = document.getElementById('btn-memory-start');
      if (btn) btn.style.display = 'none';

      this.memoryRemaining = 15; // 15 seconds brisk countdown for fun pacing
      this.sound.playClueChime();

      if (this.memoryTimer) clearInterval(this.memoryTimer);
      this.memoryTimer = setInterval(() => {
        this.memoryRemaining--;
        const digits = document.getElementById('memory-timer-digits');
        const fill = document.getElementById('memory-timer-fill');
        if (digits) digits.innerText = `⏱️ ${this.memoryRemaining}s`;
        if (fill) fill.style.width = `${(this.memoryRemaining / 15) * 100}%`;

        if (this.memoryRemaining <= 0) {
          clearInterval(this.memoryTimer);
          this.executeMemoryDisappearance();
        } else {
          this.sound.playTick();
        }
      }, 1000);
    }

    executeMemoryDisappearance() {
      this.sound.playDisappear();
      this.showToast('💨 POOF! The Memory Thief hid some cards!');

      // Hide cards: Pizza & Lion
      const c1 = document.getElementById('mem-card-c1');
      const c2 = document.getElementById('mem-card-c2');
      if (c1) {
        c1.classList.add('disappeared');
        c1.innerHTML = '<span style="font-size:2rem;">❓</span><span style="font-size:0.8rem; font-weight:800; color:var(--det-gold);">VANISHED</span>';
      }
      if (c2) {
        c2.classList.add('disappeared');
        c2.innerHTML = '<span style="font-size:2rem;">❓</span><span style="font-size:0.8rem; font-weight:800; color:var(--det-gold);">VANISHED</span>';
      }

      const panel = document.getElementById('memory-deduction-panel');
      if (panel) panel.style.display = 'block';
    }

    clickMemoryCard(id) {
      if (id === 'c1' || id === 'c2') {
        if (!this.memorySelectedMissing.includes(id)) {
          this.memorySelectedMissing.push(id);
          this.sound.playClueChime();
        }
        const summary = document.getElementById('memory-selection-summary');
        if (summary) {
          const names = this.memorySelectedMissing.map(item => item === 'c1' ? '🍕 Pizza (ate pizza)' : '🦁 Lion (saw a lion)').join(' + ');
          summary.innerHTML = `Identified: <strong>${names}</strong>`;
        }
      }
    }

    checkMemoryDeduction() {
      if (this.memorySelectedMissing.length >= 1) {
        this.sound.playSuccess();
        this.addXP(20);
        this.showToast('🎉 Memory Solved! "The boy ate pizza" & "The girl saw a lion!"');
      } else {
        this.sound.playError();
        this.showToast('Tap the mystery cards with ❓ to identify them!');
      }
    }

    // --- Stage 6 Handlers ---

    checkFixDetective(chosen) {
      const ch = this.data.FIX_DETECTIVE_CHALLENGES[this.fixDetectiveIndex];
      if (chosen === ch.correctVerb) {
        this.sound.playSuccess();
        this.addXP(15);
        this.showToast(`✅ Fixed! "${ch.fullFixed}"`);
        this.fixDetectiveIndex = (this.fixDetectiveIndex + 1) % this.data.FIX_DETECTIVE_CHALLENGES.length;
        setTimeout(() => this.renderStage(6), 800);
      } else {
        this.sound.playError();
        this.showToast(`❌ Remember: After DID, use the base form ("${ch.correctVerb}")!`);
      }
    }

    // --- Stage 7 Handlers ---

    selectLieCandidate(id) {
      this.sound.playClueChime();
      document.querySelectorAll('.statement-row').forEach(r => r.style.borderColor = 'rgba(255,255,255,0.15)');
      const el = document.getElementById(`stmt-${id}`);
      if (el) {
        el.style.borderColor = 'var(--det-gold)';
        el.style.background = 'rgba(245, 158, 11, 0.15)';
      }
      this.selectedLieId = id;
      this.showToast(`You suspect statement #${id.replace('s', '')} is the lie!`);
    }

    revealLieResult() {
      this.sound.playFanfare();
      const story = this.data.SUSPECT_STORIES[0];
      const lieRow = document.getElementById('stmt-s4');
      if (lieRow) {
        lieRow.classList.add('is-lie');
        lieRow.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:2rem;">❌</span>
            <span style="font-size:1.15rem; font-weight:900; color:#ef4444;">
              LIE CAUGHT: “I rode a horse.” ➔ TRUTH: "${story.truthCorrection}"
            </span>
          </div>
        `;
      }
      this.addXP(25);
      this.showToast('🚨 LIE EXPOSED! Inspector Sam did NOT ride a horse!');
    }

    // --- Stage 8 Handlers ---

    inspectEvidenceItem(name, details) {
      this.sound.playCameraClick();
      this.showToast(`📸 Evidence Analyzed: ${name} (${details})`);
    }

    concludeEvidenceStage() {
      this.sound.playSuccess();
      this.addXP(20);
      this.showToast('✅ Case Solid: "He went to the zoo, saw a lion, ate pizza, but DIDN\'T ride a horse!"');
      setTimeout(() => this.nextStage(), 1000);
    }

    // --- Stage 9 Handlers (Interrogation) ---

    askSuspectQuestion(qid) {
      const q = this.data.INTERROGATION_SUSPECT.questions.find(item => item.id === qid);
      if (!q) return;

      this.lastSuspectQuestion = q;
      this.sound.playClueChime();

      const bubble = document.getElementById('suspect-speech-text');
      if (bubble) {
        bubble.innerText = `“${q.answerSpeech}”`;
        bubble.style.border = q.answerType === 'no' ? '2px solid #ef4444' : '2px solid #38bdf8';
      }

      this.sound.speak(q.answerSpeech, { pitch: 0.9, rate: 0.88 });

      const logBox = document.getElementById('interrogation-log-box');
      if (logBox) {
        logBox.innerHTML = `
          <div><strong>Q:</strong> "${q.text}"</div>
          <div style="color:${q.answerType === 'no' ? '#f87171' : '#7dd3fc'}; margin-top:2px;">
            <strong>A:</strong> "${q.answerSpeech}" (${q.clue})
          </div>
        `;
      }

      if (qid === 'q2') {
        setTimeout(() => {
          this.sound.playFanfare();
          this.showToast('🕵️ CONTRADICTION! Chocolate frosting on sleeve proves he ATE the cake!');
        }, 1200);
      }
    }

    replaySuspectSpeech() {
      if (this.lastSuspectQuestion) {
        this.sound.speak(this.lastSuspectQuestion.answerSpeech, { pitch: 0.9, rate: 0.88 });
      }
    }

    // --- Stage 10 Handlers ---

    selectStoryEvent(evId) {
      const ev = this.data.STORY_BUILDER_EVENTS.find(e => e.id === evId);
      if (!ev) return;

      this.sound.playClueChime();
      if (!this.assembledStoryEvents.includes(ev)) {
        this.assembledStoryEvents.push(ev);
      }

      const connectors = ['Yesterday, I', 'Then I', 'After that, I', 'Finally, I'];
      const container = document.getElementById('story-assembled-container');

      if (container) {
        container.innerHTML = this.assembledStoryEvents.map((item, idx) => {
          const conn = connectors[idx] || 'Next, I';
          return `
            <div style="background:var(--det-bg-card); padding:8px 14px; border-radius:12px; border:1px solid var(--det-gold); font-size:1.05rem; font-weight:800;">
              <span style="color:var(--det-gold);">${conn}</span> <strong>${item.verbPast}</strong> ${item.object} ${item.icon}
            </div>
          `;
        }).join('');
      }
    }

    resetStoryBuilder() {
      this.assembledStoryEvents = [];
      const container = document.getElementById('story-assembled-container');
      if (container) {
        container.innerHTML = '<div style="color:var(--det-text-muted); font-size:1.1rem; width:100%; text-align:center;">Tap events above to slot into the story timeline!</div>';
      }
    }

    speakAssembledStory() {
      if (!this.assembledStoryEvents.length) return;
      const connectors = ['Yesterday, I', 'Then I', 'After that, I', 'Finally, I'];
      const text = this.assembledStoryEvents.map((item, idx) => {
        const conn = connectors[idx] || 'Next, I';
        return `${conn} ${item.verbPast} ${item.object}.`;
      }).join(' ');

      this.sound.speak(text);
      this.addXP(15);
      this.showToast('📖 Reading assembled Past Simple story!');
    }

    // --- Stage 11 Handlers ---

    saveAndPublishDossier() {
      this.sound.playSuccess();
      this.addXP(25);
      this.showToast('📁 Dossier Published! Ready for classroom cross-examination!');
    }

    // --- Stage 12 Handlers ---

    awardMasterBadge() {
      this.sound.playFanfare();
      this.addXP(50);
      this.showToast('🎖️ MASTER DETECTIVE BADGE AWARDED! Outstanding listening and deduction!');
    }

    // --- Stage 13 Handlers ---

    checkHardChallenge(optIdx) {
      const cur = this.data.HARD_MODE_CASE.challenges[this.hardModeIndex];
      if (optIdx === cur.correctIndex) {
        this.sound.playSuccess();
        this.addXP(20);
        this.showToast(`✅ ${cur.feedback}`);
        this.hardModeIndex = (this.hardModeIndex + 1) % this.data.HARD_MODE_CASE.challenges.length;
        setTimeout(() => this.renderStage(13), 1000);
      } else {
        this.sound.playError();
        this.showToast('❌ Re-read Mia’s statement carefully!');
      }
    }

    // --- Stage 14 Handlers ---

    scoreAssessment(partNum, isCorrect) {
      this.assessmentScores[partNum] = isCorrect;
      if (isCorrect) {
        this.sound.playSuccess();
        this.addXP(10);
        this.showToast(`✅ Part ${partNum} passed!`);
      } else {
        this.sound.playError();
        this.showToast(`❌ Try again on Part ${partNum}!`);
      }
    }

    generateCertificate() {
      this.sound.playFanfare();
      const viewport = document.getElementById('detectives-viewport');
      if (!viewport) return;

      viewport.innerHTML = `
        <div style="background:linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); border:4px double var(--det-gold); border-radius:24px; padding:36px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.7); max-width:800px; margin:0 auto;">
          <div style="font-size:3.8rem; margin-bottom:8px;">🏆</div>
          <div style="font-size:1.1rem; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:var(--det-gold); margin-bottom:6px;">
            OFFICIAL CEFR A1+ PROFICIENCY AWARD
          </div>
          <h1 style="font-size:2.8rem; font-weight:900; color:#ffffff; margin:0 0 14px 0;">
            CERTIFICATE OF DEDUCTION
          </h1>
          <p style="font-size:1.2rem; color:#cbd5e1; margin-bottom:20px;">
            This certifies that the <strong>Junior Yesterday Detective</strong> has demonstrated full command of the <strong>Past Simple (Regular &amp; Irregular Verbs, Questions with Did, Negatives with Didn’t)</strong>!
          </p>

          <div style="display:flex; justify-content:center; gap:24px; margin-bottom:28px;">
            <div style="background:rgba(255,255,255,0.08); padding:12px 24px; border-radius:12px; border:1px solid rgba(255,255,255,0.15);">
              <div style="font-size:0.8rem; text-transform:uppercase; color:var(--det-gold); font-weight:800;">Rank</div>
              <div style="font-size:1.5rem; font-weight:900; color:#ffffff;">Master Detective</div>
            </div>
            <div style="background:rgba(255,255,255,0.08); padding:12px 24px; border-radius:12px; border:1px solid rgba(255,255,255,0.15);">
              <div style="font-size:0.8rem; text-transform:uppercase; color:#34d399; font-weight:800;">Score</div>
              <div style="font-size:1.5rem; font-weight:900; color:#ffffff;">100% Case Solved</div>
            </div>
          </div>

          <div style="display:flex; justify-content:center; gap:14px;">
            <button class="hud-btn primary" onclick="window.print()" style="font-size:1.05rem; padding:10px 26px; border-radius:20px;">
              🖨️ Print Certificate
            </button>
            <a href="../index.html#library" class="hud-btn" style="font-size:1.05rem; padding:10px 26px; border-radius:20px; text-decoration:none;">
              📚 Return to Library
            </a>
          </div>
        </div>
      `;
    }
  }

  root.detectivesApp = new DetectivesApp();

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      root.detectivesApp.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
