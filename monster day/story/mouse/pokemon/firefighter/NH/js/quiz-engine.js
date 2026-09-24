/**
 * Adventure Academy - Quiz & Task-by-Task Worksheet Grading Engine
 * Pure Native Web Audio API — Zero External MP3 Dependencies
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. CLASSROOM SOUNDBOARD (Web Audio API)
  // =========================================================================
  class ClassroomSoundboard {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initHotkeys();
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    // 1. 🥳 The Party Horn / Noisemaker (Squealing paper flutter)
    playPartyHorn() {
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Main squeaker oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = "sawtooth";
      // Pitch scoop up then settle (mimics blowing into the horn)
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.12);
      osc.frequency.linearRampToValueAtTime(410, now + 0.55);

      // LFO to create rapid paper-buzz vibration
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(24, now); // 24 Hz rapid paper flutter
      lfoGain.gain.setValueAtTime(45, now);
      lfo.connect(osc.frequency);

      // Volume envelope
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.setValueAtTime(0.35, now + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 0.65);
      osc.stop(now + 0.65);
    }

    // 2. 🔔 Attention Desk Bell
    playAttentionBell() {
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      [1200, 1850, 2400].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        const amp = idx === 0 ? 0.35 : 0.15;
        gain.gain.setValueAtTime(amp, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 2.4);
      });
    }

    // 3. 🤫 Quiet Zen Chime
    playQuietChime() {
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      [432, 648].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 3.0);
      });
    }

    // 4. ⏱️ 3-2-1 Countdown & Buzzer
    playCountdownBuzzer() {
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // 3 short pips
      [0, 0.28, 0.56].forEach((delay) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now + delay);
        gain.gain.setValueAtTime(0.25, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });

      // Deep Buzzer
      const bzTime = now + 0.85;
      const bzOsc = this.ctx.createOscillator();
      const bzGain = this.ctx.createGain();
      bzOsc.type = "sawtooth";
      bzOsc.frequency.setValueAtTime(140, bzTime);
      bzGain.gain.setValueAtTime(0.3, bzTime);
      bzGain.gain.exponentialRampToValueAtTime(0.001, bzTime + 0.5);
      bzOsc.connect(bzGain);
      bzGain.connect(this.ctx.destination);
      bzOsc.start(bzTime);
      bzOsc.stop(bzTime + 0.5);
    }

    // 5. 👏 Quick Crowd Clapping
    playApplause() {
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 1.4;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.9));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }

    // 6. 🪙 Positive XP Coin Chime
    playCoinChime() {
      this.init();
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    // 7. 🎺 Victory TADA Fanfare
    playFanfare() {
      this.init();
      if (this.muted || !this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.38);
        }, idx * 110);
      });
    }

    // Hotkey Bindings
    initHotkeys() {
      window.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
        const key = e.key.toLowerCase();
        if (key === "p" || key === "1") this.playPartyHorn();
        if (key === "2") this.playAttentionBell();
        if (key === "3") this.playQuietChime();
        if (key === "4") this.playCountdownBuzzer();
        if (key === "5") this.playApplause();
        if (key === "6") this.playCoinChime();
        if (key === "7") this.playFanfare();
      });
    }
  }

  root.ClassroomSoundboard = ClassroomSoundboard;
  root.classSoundboard = new ClassroomSoundboard();

  // Audio helper aliases
  root.playCoinChime = function() { root.classSoundboard.playCoinChime(); };
  root.playPartyHorn = function() { root.classSoundboard.playPartyHorn(); };
  root.playFanfare = function() { root.classSoundboard.playFanfare(); };
  root.playAttentionBell = function() { root.classSoundboard.playAttentionBell(); };

  // =========================================================================
  // 2. CHECK STUDENT EVOLUTION HELPER
  // =========================================================================
  root.checkStudentEvolution = function(studentId, awardResult) {
    if (awardResult && awardResult.evolutionEvent && typeof root.openMonsterLevelUpModal === 'function') {
      root.openMonsterLevelUpModal(studentId, awardResult.evolutionEvent.prevLevel, awardResult.evolutionEvent.newLevel);
      return true;
    }
    const store = root.schoolStore || root.store;
    if (store && typeof store.getStudent === 'function') {
      const student = store.getStudent(studentId);
      if (student && student.evolutionEvent && typeof root.openMonsterLevelUpModal === 'function') {
        root.openMonsterLevelUpModal(studentId, student.evolutionEvent.prevLevel, student.evolutionEvent.newLevel);
        student.evolutionEvent = null;
        return true;
      }
    }
    return false;
  };

  // =========================================================================
  // 3. WORKSHEET TASK GRADING ENGINE
  // =========================================================================
  let currentStudentIndex = 0;
  let classRoster = [];

  // Individual Task Score State for the currently selected student
  let activeWorksheetScores = {
    t1: 10,
    t2: 10,
    t3: 10,
    t4: 20,
    t5: 20,
    t6: 15,
    t7: 15,
    t8_base: 10,
    t8_bonus: 20
  };

  const MAD_TEA_PARTY_ROLES = [
    "01 • Alice Kingsleigh",
    "02 • The Mad Hatter",
    "03 • The White Rabbit",
    "04 • The Cheshire Cat",
    "05 • The Red Queen",
    "06 • The White Queen",
    "07 • The March Hare",
    "08 • The Dormouse",
    "09 • The Caterpillar",
    "10 • Tweedledum",
    "11 • Tweedledee",
    "12 • Knave of Hearts",
    "13 • The Dodo",
    "14 • The Bandersnatch",
    "15 • Bayard the Bloodhound",
    "16 • Royal Card Soldier",
    "17 • Underland Teapot Master"
  ];

  // 1. Initialize Grader with Class Roster
  function openWorksheetGraderModal() {
    // Pull active roster from platform state or fallback
    classRoster = (root.AdventureAcademy && root.AdventureAcademy.getActiveStudents) 
      ? root.AdventureAcademy.getActiveStudents() 
      : [
          { id: "student-4a-343", name: "İpek İlhan", xp: 170 },
          { id: "student-4a-305", name: "Bahriye Ada Güler", xp: 160 },
          { id: "student-4a-310", name: "Ahmet Mete İnal", xp: 150 },
          { id: "student-4a-318", name: "Şimal Koyun", xp: 120 },
          { id: "student-4a-341", name: "Kemal Tahsin Demirtaş", xp: 110 },
          { id: "student-4a-342", name: "Melik Emir Başara", xp: 105 },
          { id: "student-4a-300", name: "Rüzgar Dener", xp: 100 },
          { id: "student-4a-320", name: "Sühan Bilbey", xp: 95 },
          { id: "student-4a-319", name: "Ozan Topçu", xp: 90 },
          { id: "student-4a-109", name: "Zeynep Derin Kılıç", xp: 85 },
          { id: "student-4b-346", name: "Ali İhsan Bıçakçı", xp: 80 },
          { id: "student-4b-338", name: "Derin Küçük", xp: 75 },
          { id: "student-4b-316", name: "Egehan Tekin", xp: 100 },
          { id: "student-4b-307", name: "Elif Asya Durmaz", xp: 70 },
          { id: "student-4a-315", name: "Emir Ali Gökalp", xp: 65 },
          { id: "student-4a-302", name: "Emir Ertem", xp: 60 },
          { id: "student-4a-314", name: "İclal Gökalp", xp: 70 }
        ];

    const dropdown = document.getElementById("grader-student-dropdown");
    if (dropdown) {
      dropdown.innerHTML = classRoster.map((s, idx) => 
        `<option value="${idx}">${s.name} (${s.xp || 0} XP)</option>`
      ).join("");
    }

    const roleDropdown = document.getElementById("grader-draft-role");
    if (roleDropdown && roleDropdown.options.length <= 1) {
      roleDropdown.innerHTML = '<option value="">-- Choose Claimed Role --</option>' +
        MAD_TEA_PARTY_ROLES.map(r => `<option value="${r.split(' • ')[1] || r}">${r}</option>`).join("");
    }

    const modal = document.getElementById("worksheet-grading-modal");
    if (modal) {
      modal.style.display = "flex";
      loadStudentGradeSheet(0);
    }
  }

  function closeGraderModal() {
    const modal = document.getElementById("worksheet-grading-modal");
    if (modal) modal.style.display = "none";
  }

  // 2. Load Student & Reset Task Chips to Full Default
  function loadStudentGradeSheet(index) {
    currentStudentIndex = parseInt(index, 10);
    const dropdown = document.getElementById("grader-student-dropdown");
    if (dropdown) dropdown.value = currentStudentIndex;
    
    const roleElem = document.getElementById("grader-draft-role");
    const student = classRoster[currentStudentIndex];
    if (roleElem) {
      roleElem.value = (student && student.claimedDraftRole) ? student.claimedDraftRole : "";
    }
    
    // Default all tasks to full points (optimistic grading)
    activeWorksheetScores = {
      t1: 10, t2: 10, t3: 10, t4: 20, t5: 20, t6: 15, t7: 15, t8_base: 10, t8_bonus: 20
    };
    refreshChipUI();
    updateTotalXPDisplay();
  }

  // 3. Task Chip Selection Handler
  function setTaskScore(taskId, points, buttonElem) {
    activeWorksheetScores[taskId] = parseInt(points, 10);

    // Update UI chip active state
    if (buttonElem) {
      const parent = buttonElem.closest(".xp-toggle-group");
      if (parent) {
        parent.querySelectorAll(".xp-chip").forEach(chip => chip.classList.remove("active"));
        buttonElem.classList.add("active");
      }
    }

    updateTotalXPDisplay();
    if (root.classSoundboard) {
      // Short click feedback
      try {
        const ctx = root.classSoundboard.ctx;
        if (ctx) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }
      } catch(e) {}
    }
  }

  function updateTotalXPDisplay() {
    const total = Object.values(activeWorksheetScores).reduce((acc, curr) => acc + curr, 0);
    const displayElem = document.getElementById("grader-total-xp");
    if (displayElem) displayElem.innerText = total;
  }

  function refreshChipUI() {
    Object.keys(activeWorksheetScores).forEach(taskId => {
      const row = document.querySelector(`.task-row[data-task-id="${taskId}"]`);
      if (!row) return;
      const chips = row.querySelectorAll(".xp-chip");
      chips.forEach(chip => {
        chip.classList.toggle("active", parseInt(chip.innerText, 10) === activeWorksheetScores[taskId]);
      });
    });
  }

  function resetCurrentScores() {
    activeWorksheetScores = {
      t1: 0, t2: 0, t3: 0, t4: 0, t5: 0, t6: 0, t7: 0, t8_base: 0, t8_bonus: 0
    };
    refreshChipUI();
    updateTotalXPDisplay();
    const roleElem = document.getElementById("grader-draft-role");
    if (roleElem) roleElem.value = "";
  }

  // 4. Save Score, Write to XP Ledger, Trigger Audio, and Advance
  function saveAndNextStudent() {
    const student = classRoster[currentStudentIndex];
    if (!student) return;

    const totalEarnedXP = Object.values(activeWorksheetScores).reduce((acc, curr) => acc + curr, 0);
    const chosenCharacter = (document.getElementById("grader-draft-role") && document.getElementById("grader-draft-role").value) || "Pending Draft";

    student.claimedDraftRole = chosenCharacter;
    student.xp = (student.xp || 0) + totalEarnedXP;

    let awardResult = null;

    // A. Award to Platform XP Ledger
    if (root.AdventureAcademy && root.AdventureAcademy.awardXP) {
      awardResult = root.AdventureAcademy.awardXP({
        studentId: student.id,
        amount: totalEarnedXP,
        source: `Worksheet: Unit 1 Master Quest (${totalEarnedXP} XP)`,
        metadata: {
          taskBreakdown: { ...activeWorksheetScores },
          claimedDraftRole: chosenCharacter
        },
        timestamp: new Date().toISOString()
      });
    }

    // B. Trigger Monster Evolution check
    if (typeof root.checkStudentEvolution === 'function') {
      root.checkStudentEvolution(student.id, awardResult);
    }

    // C. Trigger Web Audio Coin Chime
    if (typeof root.playCoinChime === "function") {
      root.playCoinChime();
    }

    // Update dropdown option text
    const dropdown = document.getElementById("grader-student-dropdown");
    if (dropdown && dropdown.options[currentStudentIndex]) {
      dropdown.options[currentStudentIndex].innerText = `${student.name} (${student.xp} XP)`;
    }

    // D. Advance to next student in the stack
    if (currentStudentIndex < classRoster.length - 1) {
      loadStudentGradeSheet(currentStudentIndex + 1);
    } else {
      if (typeof root.playFanfare === 'function') root.playFanfare();
      alert("🎉 All 17 students graded! Leaderboard is ready for the Mad Tea Party Draft!");
      closeGraderModal();
      if (typeof root.renderCurrentView === 'function') {
        root.renderCurrentView();
      }
    }
  }

  function nextStudent() {
    if (currentStudentIndex < classRoster.length - 1) loadStudentGradeSheet(currentStudentIndex + 1);
  }
  function prevStudent() {
    if (currentStudentIndex > 0) loadStudentGradeSheet(currentStudentIndex - 1);
  }

  // Keyboard shortcuts for rapid grading (Enter = Save & Next)
  window.addEventListener("keydown", (e) => {
    const modal = document.getElementById("worksheet-grading-modal");
    if (modal && modal.style.display !== "none") {
      if (e.key === "Enter") {
        e.preventDefault();
        saveAndNextStudent();
      } else if (e.key === "Escape") {
        closeGraderModal();
      }
    }
  });

  // Export functions to global scope
  root.openWorksheetGraderModal = openWorksheetGraderModal;
  root.openGraderModal = openWorksheetGraderModal;
  root.closeGraderModal = closeGraderModal;
  root.loadStudentGradeSheet = loadStudentGradeSheet;
  root.setTaskScore = setTaskScore;
  root.updateTotalXPDisplay = updateTotalXPDisplay;
  root.refreshChipUI = refreshChipUI;
  root.resetCurrentScores = resetCurrentScores;
  root.saveAndNextStudent = saveAndNextStudent;
  root.nextStudent = nextStudent;
  root.prevStudent = prevStudent;

})(typeof window !== 'undefined' ? window : global);
