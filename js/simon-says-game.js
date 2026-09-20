/**
 * ENGLISH ADVENTURE ACADEMY — SIMON SAYS CLASSROOM GAME
 * 
 * High-engagement, projector-optimized physical classroom activity tool.
 * - Automatically loads existing classes & students from authoritative SchoolStore.
 * - 100% teacher-driven physical observation & manual elimination.
 * - Permanent rules banner (Valid vs Trick vs Mistake).
 * - Massive high-contrast command card visible from 30+ feet.
 * - Procedural Web Audio API sound effects & Web Speech API TTS.
 * - Winner celebration with +25 XP classroom champion award.
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. COMMAND BANK & PEDAGOGICAL CATEGORIES
  // =========================================================================

  const COMMAND_CATEGORIES = {
    body: { label: 'Body Parts', icon: '👤', color: '#3b82f6' },
    movement: { label: 'Movement', icon: '🏃', color: '#10b981' },
    classroom: { label: 'Classroom Actions', icon: '🏫', color: '#8b5cf6' },
    funny: { label: 'Funny & Expressive', icon: '🎭', color: '#f59e0b' },
    hard: { label: 'Hard Mode / Combos', icon: '⚡', color: '#ec4899' }
  };

  const COMMAND_BANK = [
    // --- Body Parts ---
    { id: 'b1', category: 'body', actionText: 'touch your head', speechText: 'touch your head', icon: '🙆‍♂️' },
    { id: 'b2', category: 'body', actionText: 'touch your nose', speechText: 'touch your nose', icon: '👃' },
    { id: 'b3', category: 'body', actionText: 'touch your ears', speechText: 'touch your ears', icon: '👂' },
    { id: 'b4', category: 'body', actionText: 'touch your knees', speechText: 'touch your knees', icon: '🦵' },
    { id: 'b5', category: 'body', actionText: 'touch your toes', speechText: 'touch your toes', icon: '🦶' },
    { id: 'b6', category: 'body', actionText: 'touch your shoulders', speechText: 'touch your shoulders', icon: '💪' },
    { id: 'b7', category: 'body', actionText: 'cover your eyes', speechText: 'cover your eyes', icon: '🙈' },
    { id: 'b8', category: 'body', actionText: 'put hands on your hips', speechText: 'put hands on your hips', icon: '🧍' },
    { id: 'b9', category: 'body', actionText: 'touch your elbows', speechText: 'touch your elbows', icon: '🦾' },
    { id: 'b10', category: 'body', actionText: 'touch your chin', speechText: 'touch your chin', icon: '🤔' },
    { id: 'b11', category: 'body', actionText: 'touch your stomach', speechText: 'touch your stomach', icon: '🥪' },
    { id: 'b12', category: 'body', actionText: 'touch your cheeks', speechText: 'touch your cheeks', icon: '😊' },

    // --- Movement ---
    { id: 'm1', category: 'movement', actionText: 'stand on one foot', speechText: 'stand on one foot', icon: '🦩' },
    { id: 'm2', category: 'movement', actionText: 'jump twice', speechText: 'jump twice', icon: '🦘' },
    { id: 'm3', category: 'movement', actionText: 'turn around in a circle', speechText: 'turn around in a circle', icon: '🔄' },
    { id: 'm4', category: 'movement', actionText: 'march in place', speechText: 'march in place', icon: '💂‍♂️' },
    { id: 'm5', category: 'movement', actionText: 'freeze like a statue', speechText: 'freeze like a statue', icon: '🗿' },
    { id: 'm6', category: 'movement', actionText: 'reach high up to the sky', speechText: 'reach high up to the sky', icon: '🌤️' },
    { id: 'm7', category: 'movement', actionText: 'take one big step forward', speechText: 'take one big step forward', icon: '🚶' },
    { id: 'm8', category: 'movement', actionText: 'take one step backward', speechText: 'take one step backward', icon: '🔙' },
    { id: 'm9', category: 'movement', actionText: 'tiptoe in place', speechText: 'tiptoe in place', icon: '🩰' },
    { id: 'm10', category: 'movement', actionText: 'hop three times on your right foot', speechText: 'hop three times on your right foot', icon: '🐰' },
    { id: 'm11', category: 'movement', actionText: 'walk in slow motion', speechText: 'walk in slow motion', icon: '🐢' },

    // --- Classroom Actions ---
    { id: 'c1', category: 'classroom', actionText: 'raise your right hand', speechText: 'raise your right hand', icon: '✋' },
    { id: 'c2', category: 'classroom', actionText: 'raise your left hand', speechText: 'raise your left hand', icon: '🤚' },
    { id: 'c3', category: 'classroom', actionText: 'put both hands in the air', speechText: 'put both hands in the air', icon: '🙌' },
    { id: 'c4', category: 'classroom', actionText: 'cross your arms', speechText: 'cross your arms', icon: '🙅‍♂️' },
    { id: 'c5', category: 'classroom', actionText: 'clap your hands twice', speechText: 'clap your hands twice', icon: '👏' },
    { id: 'c6', category: 'classroom', actionText: 'wave hello to a classmate', speechText: 'wave hello to a classmate', icon: '👋' },
    { id: 'c7', category: 'classroom', actionText: 'point to the ceiling', speechText: 'point to the ceiling', icon: '☝️' },
    { id: 'c8', category: 'classroom', actionText: 'point to the floor', speechText: 'point to the floor', icon: '👇' },
    { id: 'c9', category: 'classroom', actionText: 'give two thumbs up', speechText: 'give two thumbs up', icon: '👍' },
    { id: 'c10', category: 'classroom', actionText: 'pretend to open a book', speechText: 'pretend to open a book', icon: '📖' },
    { id: 'c11', category: 'classroom', actionText: 'pretend to write with a pen', speechText: 'pretend to write with a pen', icon: '✏️' },
    { id: 'c12', category: 'classroom', actionText: 'shrug your shoulders', speechText: 'shrug your shoulders', icon: '🤷' },

    // --- Funny & Expressive ---
    { id: 'f1', category: 'funny', actionText: 'make a silly face', speechText: 'make a silly face', icon: '🤪' },
    { id: 'f2', category: 'funny', actionText: 'roar like a fierce lion', speechText: 'roar like a fierce lion', icon: '🦁' },
    { id: 'f3', category: 'funny', actionText: 'flap your arms like a bird', speechText: 'flap your arms like a bird', icon: '🦅' },
    { id: 'f4', category: 'funny', actionText: 'pretend to play an electric guitar', speechText: 'pretend to play an electric guitar', icon: '🎸' },
    { id: 'f5', category: 'funny', actionText: 'act like a robot', speechText: 'act like a robot', icon: '🤖' },
    { id: 'f6', category: 'funny', actionText: 'bark like a happy puppy', speechText: 'bark like a happy puppy', icon: '🐶' },
    { id: 'f7', category: 'funny', actionText: 'pretend you are swimming', speechText: 'pretend you are swimming', icon: '🏊' },
    { id: 'f8', category: 'funny', actionText: 'laugh silently with big smiles', speechText: 'laugh silently with big smiles', icon: '😆' },
    { id: 'f9', category: 'funny', actionText: 'yawn and stretch out wide', speechText: 'yawn and stretch out wide', icon: '🥱' },
    { id: 'f10', category: 'funny', actionText: 'pretend to sleep and snore gently', speechText: 'pretend to sleep and snore gently', icon: '😴' },

    // --- Hard Mode / Combos ---
    { id: 'h1', category: 'hard', actionText: 'touch your left ear with your right hand', speechText: 'touch your left ear with your right hand', icon: '🤹' },
    { id: 'h2', category: 'hard', actionText: 'touch your right knee with your left hand', speechText: 'touch your right knee with your left hand', icon: '🤸' },
    { id: 'h3', category: 'hard', actionText: 'blink your eyes four times quickly', speechText: 'blink your eyes four times quickly', icon: '👀' },
    { id: 'h4', category: 'hard', actionText: 'touch your toes, then jump once', speechText: 'touch your toes, then jump once', icon: '⚡' },
    { id: 'h5', category: 'hard', actionText: 'pat your head and rub your stomach at the same time', speechText: 'pat your head and rub your stomach at the same time', icon: '🤯' },
    { id: 'h6', category: 'hard', actionText: 'spin around once and strike a superhero pose', speechText: 'spin around once and strike a superhero pose', icon: '🦸' }
  ];

  // =========================================================================
  // 2. PROCEDURAL SOUND ENGINE (NO BROKEN ASSETS)
  // =========================================================================

  class SimonAudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    getAudioContext() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    playCountdownTick() {
      if (this.muted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {}
    }

    playCountdownGo() {
      if (this.muted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        [880, 1174.66, 1760].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.25, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.38);
        });
      } catch (e) {}
    }

    playValidCommand() {
      if (this.muted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } catch (e) {}
    }

    playTrickCommand() {
      if (this.muted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.2); // C4
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}
    }

    playElimination() {
      if (this.muted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.35); // A2
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.42);
      } catch (e) {}
    }

    playVictoryFanfare() {
      if (this.muted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const startTime = now + idx * 0.12;
          const duration = idx === notes.length - 1 ? 0.8 : 0.22;
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.3, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + duration + 0.05);
        });
      } catch (e) {}
    }
  }

  // =========================================================================
  // 3. PROCEDURAL CONFETTI GENERATOR
  // =========================================================================

  class SimonConfetti {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.active = false;
    }

    start() {
      if (!this.canvas || !this.ctx) return;
      this.active = true;
      this.resize();
      this.particles = [];
      const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#eab308'];
      for (let i = 0; i < 90; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height - this.canvas.height,
          size: Math.random() * 9 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 3 + 2.5,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 8
        });
      }
      this.loop();
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
      this.canvas.height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    }

    loop() {
      if (!this.active || !this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.y > this.canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * this.canvas.width;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rot * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      });

      this.animId = requestAnimationFrame(() => this.loop());
    }

    stop() {
      this.active = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // =========================================================================
  // 4. SIMON SAYS GAME CONTROLLER
  // =========================================================================

  class SimonSaysController {
    constructor() {
      this.audio = new SimonAudioEngine();
      this.confetti = null;

      // Configuration & Settings
      this.selectedClassId = null;
      this.speechEnabled = true;
      this.speechVoice = null;
      this.autoAdvance = false;
      this.paceSeconds = 5; // 3.5, 5, 7, 10
      this.trickProbability = 0.4; // 40% trick rate
      this.activeCategories = ['body', 'movement', 'classroom', 'funny'];

      // Game States: 'IDLE' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
      this.state = 'IDLE';
      this.round = 0;
      this.currentCommand = null; // { id, isValid, fullDisplay, speechText, icon, category }
      this.autoTimer = null;
      this.countdownTimer = null;
      this.countdownNumber = 3;

      // Student Roster
      // Each student item: { id, firstName, lastName, fullName, inGame: true, eliminatedRound: null, reason: '' }
      this.students = [];
      this.pendingEliminateStudentId = null;

      // Bind keys
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    init() {
      this.initVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
      this.loadClassData();
      window.removeEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keydown', this.handleKeyDown);
    }

    initVoices() {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      if (!voices || !voices.length) return;
      // Prefer clear natural English voices
      const preferred = voices.find(v => v.lang && v.lang.startsWith('en') && (
        v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')
      )) || voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
      this.speechVoice = preferred;
    }

    loadClassData(targetClassId = null) {
      if (typeof store === 'undefined') {
        this.students = [];
        return;
      }

      // Determine active class
      const classes = store.getClasses ? store.getClasses().filter(c => !c.archived) : [];
      let cls = null;

      if (targetClassId && store.getClass) {
        cls = store.getClass(targetClassId);
      }
      if (!cls && typeof selectedClassDetailId !== 'undefined' && selectedClassDetailId && store.getClass) {
        cls = store.getClass(selectedClassDetailId);
      }
      if (!cls && store.getActiveClass) {
        cls = store.getActiveClass();
      }
      if (!cls && classes.length > 0) {
        cls = classes[0];
      }

      this.selectedClassId = cls ? cls.id : null;

      // Strictly load from authoritative platform store
      let rawStudents = [];
      if (this.selectedClassId && store.getStudentsByClass) {
        rawStudents = store.getStudentsByClass(this.selectedClassId);
      }
      if ((!rawStudents || !rawStudents.length) && store.getStudents) {
        rawStudents = store.getStudents();
        if (this.selectedClassId) {
          rawStudents = rawStudents.filter(s => s.classId === this.selectedClassId || (s.classes && s.classes.includes(this.selectedClassId)));
        }
      }

      const activeList = (rawStudents || []).filter(s => !s.archived);

      this.students = activeList.map(s => ({
        id: s.id,
        firstName: s.firstName || 'Student',
        lastName: s.lastName || '',
        fullName: ((s.firstName || '') + ' ' + (s.lastName || '')).trim() || 'Student',
        xp: s.xp || 0,
        inGame: true,
        eliminatedRound: null,
        reason: ''
      }));
    }

    switchClass(classId) {
      this.stopAutoAdvance();
      this.state = 'IDLE';
      this.round = 0;
      this.currentCommand = null;
      this.loadClassData(classId);
      this.render();
    }

    startCountdown() {
      if (this.getActiveStudents().length === 0) {
        this.resetRoster();
      }
      this.state = 'COUNTDOWN';
      this.countdownNumber = 3;
      this.audio.playCountdownTick();
      this.render();

      if (this.countdownTimer) clearInterval(this.countdownTimer);
      this.countdownTimer = setInterval(() => {
        this.countdownNumber--;
        if (this.countdownNumber > 0) {
          this.audio.playCountdownTick();
          this.render();
        } else if (this.countdownNumber === 0) {
          this.audio.playCountdownGo();
          this.render();
        } else {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          this.startGame();
        }
      }, 900);
    }

    startGame() {
      this.state = 'PLAYING';
      this.round = 0;
      this.nextCommand();
    }

    nextCommand() {
      if (this.state !== 'PLAYING') return;

      // Check remaining active students
      const active = this.getActiveStudents();
      if (active.length <= 1 && this.students.length > 1) {
        this.finishGame(active[0] || null);
        return;
      }

      this.round++;

      // Filter available commands by active categories
      let available = COMMAND_BANK.filter(cmd => this.activeCategories.includes(cmd.category));
      if (available.length === 0) available = COMMAND_BANK;

      const pick = available[Math.floor(Math.random() * available.length)];
      const isValid = Math.random() >= this.trickProbability;

      const fullDisplay = isValid
        ? 'Simon says... ' + pick.actionText.toUpperCase() + '!'
        : pick.actionText.toUpperCase() + '!';

      this.currentCommand = {
        id: pick.id,
        category: pick.category,
        icon: pick.icon,
        actionText: pick.actionText,
        isValid: isValid,
        fullDisplay: fullDisplay
      };

      if (isValid) {
        this.audio.playValidCommand();
      } else {
        this.audio.playTrickCommand();
      }

      this.render();
      this.speakCommand(this.currentCommand);

      // Manage auto-advance timer if enabled
      if (this.autoAdvance) {
        this.scheduleAutoAdvance();
      }
    }

    scheduleAutoAdvance() {
      if (this.autoTimer) clearTimeout(this.autoTimer);
      this.autoTimer = setTimeout(() => {
        if (this.state === 'PLAYING') {
          this.nextCommand();
        }
      }, this.paceSeconds * 1000);
    }

    stopAutoAdvance() {
      if (this.autoTimer) {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
      }
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.stopAutoAdvance();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } else if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        if (this.autoAdvance) {
          this.scheduleAutoAdvance();
        }
      }
      this.render();
    }

    speakCommand(cmd) {
      if (!this.speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();

        if (cmd.isValid) {
          // Speak "Simon says..." with slight pause then action
          const introUtterance = new SpeechSynthesisUtterance("Simon says");
          introUtterance.rate = 0.92;
          if (this.speechVoice) introUtterance.voice = this.speechVoice;

          const actionUtterance = new SpeechSynthesisUtterance(cmd.actionText);
          actionUtterance.rate = 1.0;
          if (this.speechVoice) actionUtterance.voice = this.speechVoice;

          window.speechSynthesis.speak(introUtterance);
          // 450ms pause before action delivery
          setTimeout(() => {
            if (this.state === 'PLAYING') {
              window.speechSynthesis.speak(actionUtterance);
            }
          }, 450);
        } else {
          // Direct trick command delivery
          const trickUtterance = new SpeechSynthesisUtterance(cmd.actionText);
          trickUtterance.rate = 1.05;
          if (this.speechVoice) trickUtterance.voice = this.speechVoice;
          window.speechSynthesis.speak(trickUtterance);
        }
      } catch (e) {
        console.warn('TTS Error:', e);
      }
    }

    // =======================================================================
    // 5. TEACHER MANUAL ELIMINATION MODAL & ROSTER MANAGEMENT
    // =======================================================================

    requestEliminateStudent(studentId) {
      const student = this.students.find(s => s.id === studentId);
      if (!student || !student.inGame) return;

      this.pendingEliminateStudentId = studentId;
      this.renderEliminationModal(student);
    }

    confirmEliminateStudent(studentId, reason) {
      const student = this.students.find(s => s.id === studentId);
      if (student) {
        student.inGame = false;
        student.eliminatedRound = this.round;
        student.reason = reason || 'Moved without Simon says';
        this.audio.playElimination();
      }
      this.pendingEliminateStudentId = null;
      this.closeEliminationModal();
      this.render();

      // Check win condition
      const active = this.getActiveStudents();
      if (active.length === 1 && this.students.length > 1 && this.state === 'PLAYING') {
        setTimeout(() => this.finishGame(active[0]), 600);
      }
    }

    reviveStudent(studentId) {
      const student = this.students.find(s => s.id === studentId);
      if (student) {
        student.inGame = true;
        student.eliminatedRound = null;
        student.reason = '';
      }
      this.render();
    }

    resetRoster() {
      this.students.forEach(s => {
        s.inGame = true;
        s.eliminatedRound = null;
        s.reason = '';
      });
      this.round = 0;
      this.currentCommand = null;
      this.state = 'IDLE';
      this.stopAutoAdvance();
      if (this.confetti) this.confetti.stop();
      this.render();
    }

    finishGame(winnerStudent = null) {
      this.state = 'GAME_OVER';
      this.stopAutoAdvance();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      this.audio.playVictoryFanfare();
      this.render(winnerStudent);
      setTimeout(() => {
        const canvas = document.getElementById('simon-confetti-canvas');
        if (canvas) {
          if (!this.confetti) this.confetti = new SimonConfetti(canvas);
          this.confetti.start();
        }
      }, 50);
    }

    awardWinnerXP(studentId, xpAmount = 25) {
      if (typeof store === 'undefined' || !store.awardXP) {
        if (typeof showNotification === 'function') {
          showNotification('XP awarded (+25 XP)!');
        }
        return;
      }
      try {
        const student = this.students.find(s => s.id === studentId);
        const name = student ? student.firstName : 'Winner';
        store.awardXP(studentId, xpAmount, 'Classroom Champion: Simon Says Winner', 'Teacher');
        const btn = document.getElementById('simon-award-xp-btn');
        if (btn) {
          btn.innerHTML = '✨ ' + xpAmount + ' XP Awarded to ' + name + '!';
          btn.disabled = true;
          btn.style.background = '#059669';
          btn.style.cursor = 'default';
        }
        if (typeof showNotification === 'function') {
          showNotification('🎉 Awarded +' + xpAmount + ' XP to ' + name + '!');
        }
      } catch (err) {
        console.error('Error awarding XP:', err);
      }
    }

    getActiveStudents() {
      return this.students.filter(s => s.inGame);
    }

    getEliminatedStudents() {
      return this.students.filter(s => !s.inGame);
    }

    handleKeyDown(e) {
      // Spacebar advances to next command when modal open and playing
      const modal = document.getElementById('modal-simon-says');
      const isVisible = modal && modal.classList.contains('is-open');
      if (!isVisible) return;

      if (e.code === 'Space' && !e.target.matches('input, textarea, select')) {
        e.preventDefault();
        if (this.state === 'PLAYING') {
          this.nextCommand();
        } else if (this.state === 'IDLE' || this.state === 'GAME_OVER') {
          this.startCountdown();
        }
      }
    }

    // =======================================================================
    // 6. PROJECTOR-READY HTML UI RENDERERS
    // =======================================================================

    render(winner = null) {
      const mainContainer = document.getElementById('simon-game-main-container');
      if (!mainContainer) return;

      if (this.state === 'IDLE') {
        mainContainer.innerHTML = this.renderReadyScreen();
      } else if (this.state === 'COUNTDOWN') {
        mainContainer.innerHTML = this.renderCountdownScreen();
      } else if (this.state === 'PLAYING' || this.state === 'PAUSED') {
        mainContainer.innerHTML = this.renderPlayingScreen();
      } else if (this.state === 'GAME_OVER') {
        mainContainer.innerHTML = this.renderWinnerScreen(winner);
      }

      this.updateHeaderStats();
    }

    updateHeaderStats() {
      const activeCount = this.getActiveStudents().length;
      const totalCount = this.students.length;
      const outCount = totalCount - activeCount;

      const statActive = document.getElementById('simon-stat-active');
      if (statActive) statActive.innerText = activeCount + ' / ' + totalCount;

      const statRound = document.getElementById('simon-stat-round');
      if (statRound) statRound.innerText = 'Round ' + this.round;

      const statOut = document.getElementById('simon-stat-out');
      if (statOut) statOut.innerText = outCount;
    }

    renderReadyScreen() {
      const classes = (typeof store !== 'undefined' && store.getClasses) ? store.getClasses().filter(c => !c.archived) : [];
      const classOptionsHtml = classes.map(c => 
        `<option value="${c.id}" ${c.id === this.selectedClassId ? 'selected' : ''}>${c.name} (${c.grade || 'Primary'})</option>`
      ).join('');

      return `
        <div class="simon-ready-panel" style="text-align:center; padding:36px 20px; max-width:780px; margin:0 auto;">
          <div style="font-size:4rem; margin-bottom:12px; animation:simonBounce 2s infinite;">🗣️</div>
          <h1 style="font-size:2.6rem; font-weight:900; color:var(--text-main); margin:0 0 8px 0; letter-spacing:-0.5px;">
            Simon Says: Physical Classroom Game
          </h1>
          <p style="font-size:1.15rem; color:var(--text-muted); margin:0 0 24px 0; max-width:600px; margin-left:auto; margin-right:auto;">
            Projector &amp; Smartboard tool for high-energy listening practice. Watch students closely and tap names to eliminate anyone who makes a mistake!
          </p>

          <!-- Class Selector & Student Roster Count -->
          <div style="background:var(--bg-card); border:1.5px solid var(--border-light); border-radius:16px; padding:18px 24px; margin-bottom:28px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:1.5rem;">🎒</span>
              <div style="text-align:left;">
                <label style="display:block; font-size:0.8rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.5px;">Current Class</label>
                <select id="simon-class-select" class="filter-select" onchange="window.simonGame.switchClass(this.value)" style="font-size:1rem; font-weight:700; padding:6px 14px; border-radius:8px;">
                  ${classOptionsHtml || '<option value="">Default Class</option>'}
                </select>
              </div>
            </div>
            <div style="background:var(--bg-canvas); padding:8px 16px; border-radius:10px; border:1px solid var(--border-light); font-size:0.95rem; font-weight:700; color:var(--text-main);">
              👥 <strong>${this.students.length}</strong> Students Ready
            </div>
          </div>

          <!-- Quick Rules Box -->
          <div class="simon-rules-card" style="background:linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.08) 100%); border:2px solid rgba(16,185,129,0.3); border-radius:18px; padding:20px; margin-bottom:30px; text-align:left;">
            <div style="font-size:0.85rem; font-weight:900; text-transform:uppercase; color:#059669; letter-spacing:1px; margin-bottom:10px;">📋 How to Play in Class</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px;">
              <div style="display:flex; gap:10px; align-items:flex-start;">
                <span style="font-size:1.4rem;">🟢</span>
                <div style="font-size:0.9rem; line-height:1.4;"><strong>"Simon says..."</strong><br><span style="color:var(--text-muted);">Students MUST do the action quickly.</span></div>
              </div>
              <div style="display:flex; gap:10px; align-items:flex-start;">
                <span style="font-size:1.4rem;">🔴</span>
                <div style="font-size:0.9rem; line-height:1.4;"><strong>No "Simon says..."</strong><br><span style="color:var(--text-muted);">Students MUST FREEZE &amp; NOT MOVE.</span></div>
              </div>
              <div style="display:flex; gap:10px; align-items:flex-start;">
                <span style="font-size:1.4rem;">👆</span>
                <div style="font-size:0.9rem; line-height:1.4;"><strong>Teacher Eliminates</strong><br><span style="color:var(--text-muted);">Tap any student to eliminate when caught.</span></div>
              </div>
            </div>
          </div>

          <!-- Category Selection -->
          <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:14px; padding:14px 18px; margin-bottom:30px; text-align:left;">
            <div style="font-size:0.8rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">Command Categories</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px;">
              ${Object.entries(COMMAND_CATEGORIES).map(([catKey, cat]) => `
                <label style="display:flex; align-items:center; gap:6px; background:var(--bg-card); padding:6px 12px; border-radius:8px; border:1px solid var(--border-light); cursor:pointer; font-size:0.86rem; font-weight:700;">
                  <input type="checkbox" ${this.activeCategories.includes(catKey) ? 'checked' : ''} onchange="window.simonGame.toggleCategory('${catKey}')">
                  <span>${cat.icon} ${cat.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Giant Start Button -->
          <button type="button" class="btn-primary-action" onclick="window.simonGame.startCountdown()" style="font-size:1.5rem; font-weight:900; padding:18px 48px; border-radius:50px; background:linear-gradient(135deg, #059669 0%, #10b981 100%); border:none; box-shadow:0 12px 28px rgba(16,185,129,0.35); cursor:pointer; transition:transform 0.15s ease;">
            🚀 START CLASS GAME
          </button>
        </div>
      `;
    }

    renderCountdownScreen() {
      const num = this.countdownNumber > 0 ? this.countdownNumber : 'GO!';
      const color = this.countdownNumber === 0 ? '#10b981' : '#f59e0b';
      return `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:480px; text-align:center;">
          <div style="font-size:1.5rem; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:var(--text-muted); margin-bottom:20px;">
            Get Ready Students! Stand Up!
          </div>
          <div style="font-size:9rem; font-weight:900; color:${color}; line-height:1; transform:scale(1); animation:simonPulse 0.8s ease-in-out infinite;">
            ${num}
          </div>
          <div style="font-size:1.3rem; font-weight:700; color:var(--text-main); margin-top:24px;">
            Watch out for tricks!
          </div>
        </div>
      `;
    }

    renderPlayingScreen() {
      const cmd = this.currentCommand || { isValid: true, fullDisplay: 'Get Ready...', icon: '👀', category: 'movement' };
      const isValid = cmd.isValid;
      const isPaused = this.state === 'PAUSED';

      // Card style themes
      const cardBg = isValid 
        ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(2, 44, 34, 0.98) 100%)' 
        : 'linear-gradient(135deg, rgba(127, 29, 29, 0.95) 0%, rgba(69, 10, 10, 0.98) 100%)';
      const cardBorder = isValid ? '#10b981' : '#ef4444';
      const badgeBg = isValid ? '#059669' : '#dc2626';
      const badgeText = isValid ? '✅ SIMON SAYS — DO THIS!' : '🚫 TRICK! DO NOT MOVE!';

      const activeStudents = this.getActiveStudents();
      const eliminatedStudents = this.getEliminatedStudents();

      return `
        <div class="simon-game-board" style="display:flex; flex-direction:column; gap:20px;">
          
          <!-- GIANT COMMAND DISPLAY CARD -->
          <div class="simon-command-card ${isValid ? 'is-valid' : 'is-trick'}" style="background:${cardBg}; border:3.5px solid ${cardBorder}; border-radius:24px; padding:28px 24px; text-align:center; box-shadow:0 16px 36px rgba(0,0,0,0.3); color:#ffffff; position:relative; overflow:hidden;">
            
            <!-- Category & Trick/Valid Badge -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:18px;">
              <span style="background:rgba(255,255,255,0.15); backdrop-filter:blur(4px); padding:6px 14px; border-radius:30px; font-size:0.85rem; font-weight:800; letter-spacing:0.5px; text-transform:uppercase;">
                Round ${this.round} · ${cmd.icon} ${cmd.category.toUpperCase()}
              </span>
              <span style="background:${badgeBg}; color:#ffffff; padding:8px 18px; border-radius:30px; font-size:1.05rem; font-weight:900; letter-spacing:1px; box-shadow:0 4px 14px rgba(0,0,0,0.25);">
                ${badgeText}
              </span>
            </div>

            <!-- Huge Action Text (Visible across room) -->
            <div class="simon-action-text" style="font-size:clamp(2.2rem, 5vw, 3.8rem); font-weight:900; line-height:1.2; letter-spacing:-0.5px; margin:24px 0; text-shadow:0 3px 12px rgba(0,0,0,0.5);">
              ${cmd.fullDisplay}
            </div>

            <!-- In-Card Audio / Speech Prompt -->
            <div style="display:flex; justify-content:center; align-items:center; gap:12px;">
              <button type="button" class="btn-sm-secondary" onclick="window.simonGame.replaySpeech()" style="background:rgba(255,255,255,0.18); border:none; color:#fff; font-size:0.9rem; font-weight:800; border-radius:20px; padding:6px 16px; cursor:pointer;">
                🔊 Repeat Voice
              </button>
            </div>
          </div>

          <!-- TEACHER ACTION BAR -->
          <div class="simon-teacher-bar" style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:18px; padding:14px 20px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:14px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
            <div style="display:flex; align-items:center; gap:10px;">
              <button type="button" class="btn-primary-action" onclick="window.simonGame.nextCommand()" style="font-size:1.15rem; font-weight:900; padding:12px 28px; border-radius:12px; background:#2563eb;">
                ⏩ Next Command <span style="font-size:0.8rem; opacity:0.8; margin-left:4px;">(Space)</span>
              </button>
              <button type="button" class="btn-sm-secondary" onclick="window.simonGame.togglePause()" style="font-size:1rem; font-weight:800; padding:12px 18px; border-radius:12px;">
                ${isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
            </div>

            <!-- Auto Advance & Speed -->
            <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
              <label style="display:flex; align-items:center; gap:8px; font-size:0.9rem; font-weight:700; cursor:pointer;">
                <input type="checkbox" ${this.autoAdvance ? 'checked' : ''} onchange="window.simonGame.toggleAutoAdvance(this.checked)">
                <span>⏱️ Auto-Advance</span>
              </label>

              <select class="filter-select" onchange="window.simonGame.setPace(this.value)" style="font-size:0.85rem; font-weight:700; padding:6px 12px; border-radius:8px;">
                <option value="3.5" ${this.paceSeconds === 3.5 ? 'selected' : ''}>Fast (3.5s)</option>
                <option value="5" ${this.paceSeconds === 5 ? 'selected' : ''}>Normal (5s)</option>
                <option value="7" ${this.paceSeconds === 7 ? 'selected' : ''}>Slow (7s)</option>
                <option value="10" ${this.paceSeconds === 10 ? 'selected' : ''}>Relaxed (10s)</option>
              </select>

              <button type="button" class="btn-sm-secondary" onclick="window.simonGame.finishGame()" style="color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:0.85rem; font-weight:800; padding:8px 14px; border-radius:8px;">
                Crown Winner 🏆
              </button>
            </div>
          </div>

          <!-- STUDENT ROSTER & ELIMINATION DECK -->
          <div style="display:grid; grid-template-columns: 1fr; gap:20px;">
            
            <!-- In The Game -->
            <div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:18px; padding:18px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.3rem;">🟢</span>
                  <h3 style="font-size:1.1rem; font-weight:800; margin:0; color:var(--text-main);">
                    In The Game (${activeStudents.length})
                  </h3>
                </div>
                <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">
                  👉 Tap student to eliminate when they make a mistake
                </span>
              </div>

              <!-- Student Tiles Grid -->
              <div class="simon-student-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(135px, 1fr)); gap:10px; max-height:280px; overflow-y:auto; padding:4px;">
                ${activeStudents.map(s => this.renderStudentActiveTile(s)).join('')}
              </div>
            </div>

            <!-- Eliminated / Out of the Game (if any) -->
            ${eliminatedStudents.length > 0 ? `
              <div style="background:var(--bg-canvas); border:1px dashed var(--border-medium); border-radius:18px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:1.1rem;">❌</span>
                    <h4 style="font-size:0.95rem; font-weight:800; margin:0; color:var(--text-muted);">
                      Eliminated Students (${eliminatedStudents.length})
                    </h4>
                  </div>
                  <span style="font-size:0.75rem; color:var(--text-muted);">Tap to revive if misclicked</span>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:8px; max-height:140px; overflow-y:auto; padding:2px;">
                  ${eliminatedStudents.map(s => `
                    <div onclick="window.simonGame.reviveStudent('${s.id}')" title="Click to revive ${s.fullName}" style="display:flex; align-items:center; gap:6px; background:var(--bg-card); border:1px solid var(--border-light); border-radius:20px; padding:4px 10px; cursor:pointer; opacity:0.65; transition:opacity 0.15s ease;">
                      <span style="font-size:0.8rem; text-decoration:line-through; font-weight:700; color:var(--text-muted);">${s.fullName}</span>
                      <span style="font-size:0.7rem; background:#fee2e2; color:#b91c1c; padding:1px 6px; border-radius:10px; font-weight:800;">R${s.eliminatedRound || '-'}</span>
                      <span style="font-size:0.75rem; color:#10b981;" title="Revive">↺</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </div>

        </div>
      `;
    }

    renderStudentActiveTile(student) {
      const avatarHtml = (typeof window.renderMonsterAvatar === 'function')
        ? window.renderMonsterAvatar(student.id, { size: 40, animated: false })
        : '👾';

      return `
        <div class="simon-student-tile" onclick="window.simonGame.requestEliminateStudent('${student.id}')" style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--bg-canvas); border:1.5px solid var(--border-light); border-radius:14px; padding:10px 8px; cursor:pointer; transition:all 0.15s ease; user-select:none; text-align:center;">
          <div style="width:40px; height:40px; margin-bottom:6px; pointer-events:none;">
            ${avatarHtml}
          </div>
          <div style="font-size:0.88rem; font-weight:800; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; pointer-events:none;">
            ${student.firstName}
          </div>
          <div style="font-size:0.72rem; color:var(--text-muted); pointer-events:none;">
            ${student.lastName ? student.lastName[0] + '.' : ''}
          </div>
          <div style="font-size:0.68rem; font-weight:800; color:#ef4444; margin-top:4px; opacity:0; transition:opacity 0.15s;" class="simon-tile-hover-out">
            Tap to Out ✕
          </div>
        </div>
      `;
    }

    renderWinnerScreen(student = null) {
      const active = this.getActiveStudents();
      const winner = student || (active.length === 1 ? active[0] : (this.students[0] || null));
      const winnerName = winner ? winner.fullName : 'Champion Student';
      const winnerId = winner ? winner.id : null;

      const avatarHtml = (winnerId && typeof window.renderMonsterAvatar === 'function')
        ? window.renderMonsterAvatar(winnerId, { size: 120, animated: true })
        : '👑';

      return `
        <div class="simon-winner-panel" style="text-align:center; padding:40px 20px; max-width:680px; margin:0 auto; position:relative; z-index:2;">
          <div style="font-size:3.5rem; margin-bottom:8px;">🏆</div>
          <div style="font-size:1rem; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#f59e0b; margin-bottom:10px;">
            LAST PLAYER STANDING!
          </div>
          <h1 style="font-size:2.8rem; font-weight:900; color:var(--text-main); margin:0 0 16px 0;">
            ${winnerName}
          </h1>

          <!-- Winner Monster Avatar -->
          <div style="width:140px; height:140px; margin:0 auto 20px auto; background:linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(234,179,8,0.2) 100%); border:3px solid #f59e0b; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 32px rgba(245,158,11,0.3);">
            <div style="transform:scale(1.1);">
              ${avatarHtml}
            </div>
          </div>

          <p style="font-size:1.1rem; color:var(--text-muted); margin:0 0 28px 0;">
            Incredible listening and focus! Survived ${this.round} rounds of Simon Says!
          </p>

          <!-- Reward & Navigation Actions -->
          <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
            ${winnerId ? `
              <button id="simon-award-xp-btn" type="button" class="btn-primary-action" onclick="window.simonGame.awardWinnerXP('${winnerId}', 25)" style="font-size:1.15rem; font-weight:900; padding:14px 32px; border-radius:30px; background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border:none; box-shadow:0 8px 24px rgba(245,158,11,0.35); cursor:pointer;">
                ⭐ Award +25 XP Classroom Champion
              </button>
            ` : ''}

            <div style="display:flex; gap:12px; margin-top:8px;">
              <button type="button" class="btn-primary-action" onclick="window.simonGame.resetRoster(); window.simonGame.startCountdown();" style="font-size:1rem; font-weight:800; padding:10px 24px; border-radius:12px; background:#059669;">
                🔄 Play Again
              </button>
              <button type="button" class="btn-sm-secondary" onclick="window.simonGame.closeModal(); window.openClassroomToolkitModal('simon');" style="font-size:1rem; font-weight:800; padding:10px 20px; border-radius:12px;">
                🧰 Back to Toolkit
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =======================================================================
    // 7. ELIMINATION CONFIRMATION DIALOG (TEACHER-CONTROLLED)
    // =======================================================================

    renderEliminationModal(student) {
      let modalOverlay = document.getElementById('simon-elimination-overlay');
      if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'simon-elimination-overlay';
        modalOverlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:99999;';
        document.body.appendChild(modalOverlay);
      }

      const avatarHtml = (typeof window.renderMonsterAvatar === 'function')
        ? window.renderMonsterAvatar(student.id, { size: 60, animated: false })
        : '👾';

      modalOverlay.innerHTML = `
        <div style="background:var(--bg-surface, #ffffff); border-radius:20px; max-width:440px; width:90vw; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,0.5); text-align:center; border:1px solid var(--border-light, #e2e8f0);">
          <div style="width:60px; height:60px; margin:0 auto 10px auto;">${avatarHtml}</div>
          <h3 style="font-size:1.3rem; font-weight:900; margin:0 0 6px 0; color:var(--text-main, #0f172a);">
            Eliminate ${student.fullName}?
          </h3>
          <p style="font-size:0.88rem; color:var(--text-muted, #64748b); margin:0 0 18px 0;">
            Select the observation reason:
          </p>

          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px; text-align:left;">
            <label style="display:flex; align-items:center; gap:10px; padding:10px 14px; border:1.5px solid var(--border-light, #cbd5e1); border-radius:10px; cursor:pointer; font-size:0.9rem; font-weight:700;">
              <input type="radio" name="simon-out-reason" value="Moved without Simon says" checked>
              <span>🔴 Moved when they shouldn't (Trick)</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 14px; border:1.5px solid var(--border-light, #cbd5e1); border-radius:10px; cursor:pointer; font-size:0.9rem; font-weight:700;">
              <input type="radio" name="simon-out-reason" value="Wrong action performed">
              <span>🟡 Performed the wrong action</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; padding:10px 14px; border:1.5px solid var(--border-light, #cbd5e1); border-radius:10px; cursor:pointer; font-size:0.9rem; font-weight:700;">
              <input type="radio" name="simon-out-reason" value="Too slow / delayed response">
              <span>⏱️ Too slow / delayed reaction</span>
            </label>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn-sm-secondary" onclick="window.simonGame.closeEliminationModal()" style="padding:8px 16px;">Cancel</button>
            <button type="button" class="btn-primary-action" onclick="window.simonGame.handleConfirmEliminate('${student.id}')" style="background:#dc2626; border-color:#dc2626; padding:8px 20px;">
              Confirm Out
            </button>
          </div>
        </div>
      `;
      modalOverlay.style.display = 'flex';
    }

    handleConfirmEliminate(studentId) {
      const radios = document.getElementsByName('simon-out-reason');
      let reason = 'Moved without Simon says';
      for (const r of radios) {
        if (r.checked) {
          reason = r.value;
          break;
        }
      }
      this.confirmEliminateStudent(studentId, reason);
    }

    closeEliminationModal() {
      const modalOverlay = document.getElementById('simon-elimination-overlay');
      if (modalOverlay) {
        modalOverlay.style.display = 'none';
      }
    }

    // =======================================================================
    // 8. SETTINGS & CONTROLS
    // =======================================================================

    toggleCategory(catKey) {
      if (this.activeCategories.includes(catKey)) {
        if (this.activeCategories.length > 1) {
          this.activeCategories = this.activeCategories.filter(c => c !== catKey);
        }
      } else {
        this.activeCategories.push(catKey);
      }
    }

    toggleAutoAdvance(checked) {
      this.autoAdvance = checked;
      if (checked && this.state === 'PLAYING') {
        this.scheduleAutoAdvance();
      } else {
        this.stopAutoAdvance();
      }
    }

    setPace(val) {
      this.paceSeconds = parseFloat(val) || 5;
      if (this.autoAdvance && this.state === 'PLAYING') {
        this.scheduleAutoAdvance();
      }
    }

    toggleMuteAudio(checked) {
      this.audio.muted = checked;
    }

    toggleSpeech(checked) {
      this.speechEnabled = checked;
    }

    replaySpeech() {
      if (this.currentCommand) {
        this.speakCommand(this.currentCommand);
      }
    }

    closeModal() {
      this.stopAutoAdvance();
      if (this.confetti) this.confetti.stop();
      if (typeof window.closeModal === 'function') {
        window.closeModal('modal-simon-says');
      }
    }
  }

  // Instantiate singleton
  const simonGame = new SimonSaysController();
  root.SimonSaysController = SimonSaysController;
  root.simonGame = simonGame;

  // =========================================================================
  // 9. TOOLKIT TAB VIEW & PROJECTOR MODAL LAUNCHERS
  // =========================================================================

  root.renderToolkitSimonView = function() {
    // Return the preview inside the standard toolkit modal
    const classes = (typeof store !== 'undefined' && store.getClasses) ? store.getClasses().filter(c => !c.archived) : [];
    const classCount = classes.length;
    const activeClass = (typeof store !== 'undefined' && store.getActiveClass) ? store.getActiveClass() : (classes[0] || null);

    return `
      <div style="padding:16px 8px; text-align:center;">
        <div style="background:linear-gradient(135deg, #064e3b 0%, #042f2e 100%); color:#ffffff; border-radius:20px; padding:28px 20px; box-shadow:0 12px 28px rgba(6,78,59,0.25); margin-bottom:20px; text-align:center;">
          <span style="font-size:3.5rem;">🗣️</span>
          <h2 style="font-size:1.8rem; font-weight:900; margin:10px 0 6px 0;">Simon Says: Smartboard Edition</h2>
          <p style="font-size:0.95rem; color:#a7f3d0; margin:0 0 20px 0; max-width:520px; margin-left:auto; margin-right:auto;">
            Physical classroom listening &amp; reaction game. Massive projector-optimized commands, procedural sound effects, and 100% teacher-driven observation &amp; elimination.
          </p>

          <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.15); padding:8px 18px; border-radius:30px; font-size:0.88rem; font-weight:700; margin-bottom:24px;">
            🎒 Class: <strong>${activeClass ? activeClass.name : 'All Students'}</strong>
          </div>

          <div>
            <button type="button" class="btn-primary-action" onclick="window.openSimonSaysModal()" style="font-size:1.2rem; font-weight:900; padding:14px 36px; border-radius:30px; background:#10b981; border:none; box-shadow:0 8px 20px rgba(16,185,129,0.4); cursor:pointer;">
              🚀 Open Full Smartboard Projector View
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; text-align:left;">
          <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:12px; padding:14px;">
            <div style="font-size:1.3rem; margin-bottom:4px;">👥</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">Existing Student List</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Auto-loads your classroom roster without manual typing.</div>
          </div>
          <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:12px; padding:14px;">
            <div style="font-size:1.3rem; margin-bottom:4px;">👁️</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">Teacher-Controlled</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Observe real students and click names to eliminate.</div>
          </div>
          <div style="background:var(--bg-canvas); border:1px solid var(--border-light); border-radius:12px; padding:14px;">
            <div style="font-size:1.3rem; margin-bottom:4px;">🏆</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">XP Celebration</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Crown the last player standing with confetti &amp; +25 XP.</div>
          </div>
        </div>
      </div>
    `;
  };

  root.openSimonSaysModal = function(classId = null) {
    if (typeof window.closeModal === 'function') {
      window.closeModal('modal-classroom-toolkit');
    }
    const modal = document.getElementById('modal-simon-says');
    if (!modal) return;

    simonGame.init();
    if (classId) {
      simonGame.switchClass(classId);
    } else {
      simonGame.loadClassData();
      simonGame.render();
    }

    if (typeof window.openModal === 'function') {
      window.openModal('modal-simon-says');
    } else {
      modal.classList.add('is-open');
    }
  };

  // DOM ready check
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => simonGame.init());
    } else {
      simonGame.init();
    }
  }

})(typeof window !== 'undefined' ? window : global);
