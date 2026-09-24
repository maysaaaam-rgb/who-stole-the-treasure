/**
 * ADVENTURE ACADEMY — DISCRETE HOMEWORK XP TASKS DATA
 * Alice in Wonderland Individual Homework Quests & Verified XP Ledger Model
 */
(function(root) {
  'use strict';

  // 13 Discrete Verified Tasks matching the reference poster
  const ALICE_HOMEWORK_ASSIGNMENTS = [
    // Base Participation
    {
      id: "hw-alice-checkin",
      code: "HW-ALICE-000",
      tier: "Base Participation",
      level: 0,
      levelLabel: "Base Participation",
      title: "Base Reading Check-In / Submission Log",
      xp: 10,
      category: "Participation & Daily Habit",
      icon: "🐇",
      instructions: "No Challenge? That's okay! You'll still get 10 XP for being here and logging your reading check-in.",
      description: "Submit reading check-in log and daily reading participation confirmation.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },

    // Level 1: Get Started! (Vocabulary & Understanding)
    {
      id: "hw-alice-vocab10",
      code: "HW-ALICE-101",
      tier: "Level 1: Get Started!",
      level: 1,
      levelLabel: "Level 1",
      title: "Learn 10 new words and explain meanings",
      xp: 10,
      category: "Vocabulary & Understanding",
      icon: "📖",
      instructions: "Learn 10 new words from the story and explain their meanings.",
      description: "Find, define, and explain 10 unfamiliar vocabulary words encountered in the story.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-fav-char",
      code: "HW-ALICE-102",
      tier: "Level 1: Get Started!",
      level: 1,
      levelLabel: "Level 1",
      title: "Name favorite character + 3 reasons why",
      xp: 15,
      category: "Vocabulary & Understanding",
      icon: "❤️",
      instructions: "Tell us your favorite character and give 3 reasons why.",
      description: "Select one character from Wonderland and present 3 distinct reasons why you like them.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-draw",
      code: "HW-ALICE-103",
      tier: "Level 1: Get Started!",
      level: 1,
      levelLabel: "Level 1",
      title: "Draw a character/scene and explain",
      xp: 20,
      category: "Vocabulary & Understanding",
      icon: "🎨",
      instructions: "Draw a character or scene and explain your drawing.",
      description: "Create a colorful illustration of a character or key moment and explain what is happening.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-comp5",
      code: "HW-ALICE-104",
      tier: "Level 1: Get Started!",
      level: 1,
      levelLabel: "Level 1",
      title: "Answer 5 comprehension questions",
      xp: 20,
      category: "Vocabulary & Understanding",
      icon: "📝",
      instructions: "Answer 5 comprehension questions about the story.",
      description: "Demonstrate story understanding by formulating complete written answers to 5 comprehension queries.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },

    // Level 2: Go Deeper! (Thinking & Applied English)
    {
      id: "hw-alice-vocab25",
      code: "HW-ALICE-201",
      tier: "Level 2: Go Deeper!",
      level: 2,
      levelLabel: "Level 2",
      title: "Learn 25 words (use 10 in sentences)",
      xp: 40,
      category: "Thinking & Applied English",
      icon: "📚",
      instructions: "Learn 25 words from the story and use 10 of them in sentences.",
      description: "Master 25 story vocabulary words and compose original contextual sentences using at least 10 words.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-speech2m",
      code: "HW-ALICE-202",
      tier: "Level 2: Go Deeper!",
      level: 2,
      levelLabel: "Level 2",
      title: "2-minute character talk (personality, actions, role)",
      xp: 50,
      category: "Thinking & Applied English",
      icon: "💬",
      instructions: "Talk about one character for 2 minutes (personality, actions, and role).",
      description: "Deliver a structured 2-minute oral presentation analyzing a character's choices and story role.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-retell",
      code: "HW-ALICE-203",
      tier: "Level 2: Go Deeper!",
      level: 2,
      levelLabel: "Level 2",
      title: "Retell one key scene without reading from the book",
      xp: 50,
      category: "Thinking & Applied English",
      icon: "🎬",
      instructions: "Retell one important scene without reading from the book.",
      description: "Fluently retell a key scene from memory using descriptive time sequence transitions.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-new-ending",
      code: "HW-ALICE-204",
      tier: "Level 2: Go Deeper!",
      level: 2,
      levelLabel: "Level 2",
      title: "Write an alternate story ending (100–150 words)",
      xp: 50,
      category: "Thinking & Applied English",
      icon: "✍️",
      instructions: "Write a new ending for the story (100–150 words).",
      description: "Draft a creative alternate resolution for Alice in Wonderland in 100–150 descriptive words.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },

    // Level 3: Big Challenge! (Deep Mastery & Performance)
    {
      id: "hw-alice-char-compare",
      code: "HW-ALICE-301",
      tier: "Level 3: Big Challenge!",
      level: 3,
      levelLabel: "Level 3",
      title: "Compare two characters in detail (similarities & differences)",
      xp: 80,
      category: "Deep Mastery & Performance",
      icon: "👫",
      instructions: "Compare two characters in detail (similarities & differences).",
      description: "Analyze similarities and differences between two characters in personality, motives, and actions.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-journey",
      code: "HW-ALICE-302",
      tier: "Level 3: Big Challenge!",
      level: 3,
      levelLabel: "Level 3",
      title: "Explain Alice's journey and personal growth",
      xp: 80,
      category: "Deep Mastery & Performance",
      icon: "💡",
      instructions: "Explain Alice’s journey and how she changes throughout the story.",
      description: "Examine Alice's personal growth and evolution from curiosity and confusion to confidence.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-act-out",
      code: "HW-ALICE-303",
      tier: "Level 3: Big Challenge!",
      level: 3,
      levelLabel: "Level 3",
      title: "Act out a scene with partner/group or record video",
      xp: 100,
      category: "Deep Mastery & Performance",
      icon: "🎭",
      instructions: "Act out a scene with a partner or group (or make a video).",
      description: "Collaborate to rehearse and perform a dramatic reenactment of an iconic scene.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-full-summary",
      code: "HW-ALICE-304",
      tier: "Level 3: Big Challenge!",
      level: 3,
      levelLabel: "Level 3",
      title: "Spoken full-story summary (5–7 minutes in own words)",
      xp: 200,
      category: "Deep Mastery & Performance",
      icon: "👑",
      instructions: "Read the ENTIRE story and give a 5–7 minute summary in your own words.",
      description: "Deliver a master spoken oral summary covering Exposition, Rising Action, Climax, and Resolution.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    }
  ];

  // Collection Metadata
  const ALICE_WONDERLAND_XP_QUEST = {
    id: "alice-wonderland-xp-quest",
    title: "Alice in Wonderland XP Challenges",
    subtitle: "Choose a challenge. The more you challenge yourself, the more XP you earn!",
    quote: "Every adventure starts with a choice. — Alice ❤️",
    slogan: "Same Story. Different Challenges. Brighter Learners!",
    poster: "assets/homework/alice-xp-challenges-poster.jpg",
    totalTasks: ALICE_HOMEWORK_ASSIGNMENTS.length,
    levels: [
      { level: 1, title: "Level 1: Get Started!", subtitle: "Build your vocabulary and understanding.", color: "#10b981", badge: "Small steps lead to big adventures!" },
      { level: 2, title: "Level 2: Go Deeper!", subtitle: "Show your thinking and use your English.", color: "#0284c7", badge: "Curious minds go further!" },
      { level: 3, title: "Level 3: Big Challenge! 👑", subtitle: "Show your full understanding and creativity.", color: "#a855f7", badge: "Think deeper. Speak braver. Earn bigger!" },
      { level: 0, title: "Base Participation", subtitle: "Daily Reading Habit Check-In", color: "#64748b", badge: "You'll still get 10 XP for being here!" }
    ],
    tasks: ALICE_HOMEWORK_ASSIGNMENTS
  };

  // AdventureAcademy Global Hub
  root.ALICE_HOMEWORK_ASSIGNMENTS = ALICE_HOMEWORK_ASSIGNMENTS;
  root.ALICE_WONDERLAND_XP_QUEST = ALICE_WONDERLAND_XP_QUEST;
  root.AdventureAcademy = root.AdventureAcademy || {};

  /**
   * Directly updates student balance, triggers audio, and checks monster evolution
   * @param {Object} payload - { studentId, amount, source, timestamp, notes }
   */
  root.AdventureAcademy.awardXP = function(payload) {
    if (!payload || !payload.studentId) {
      console.warn('[AdventureAcademy.awardXP] Invalid payload:', payload);
      return null;
    }
    const store = root.store;
    if (!store || typeof store.giveXP !== 'function') {
      console.warn('[AdventureAcademy.awardXP] Platform store is not ready.');
      return null;
    }

    const amount = parseInt(payload.amount, 10) || 10;
    const source = payload.source || 'Homework Task';
    const res = store.giveXP(payload.studentId, amount, source, 'Homework');

    if (res) {
      // Audio cue: Play fanfare for big achievements (>= 80 XP), otherwise coin chime
      try {
        if (root.academyAudio) {
          if (amount >= 80 && typeof root.academyAudio.playFanfare === 'function') {
            root.academyAudio.playFanfare();
          } else if (typeof root.academyAudio.playCoin === 'function') {
            root.academyAudio.playCoin();
          }
        }
      } catch (err) {
        console.warn('Sound playback skipped:', err);
      }

      // Check Monster Evolution trigger
      if (res.evolutionEvent && typeof root.openMonsterLevelUpModal === 'function') {
        root.openMonsterLevelUpModal(payload.studentId, res.evolutionEvent.prevLevel, res.evolutionEvent.newLevel);
      }

      // Re-render views & update leaderboard standings
      if (typeof root.renderCurrentView === 'function') {
        root.renderCurrentView();
      }

      // Notify UI
      if (typeof root.showNotification === 'function') {
        const studentName = res.student ? (res.student.firstName + ' ' + (res.student.lastName || '')) : 'Student';
        root.showNotification('🎉 +' + amount + ' XP awarded to ' + studentName.trim() + ' for ' + source + '!');
      }
    }
    return res;
  };

  /**
   * Returns active student roster with current XP balances
   */
  root.AdventureAcademy.getActiveStudents = function() {
    const sStore = root.schoolStore || (root.store && root.store.schoolStore) || root.store;
    if (sStore && typeof sStore.getStudents === 'function') {
      const all = sStore.getStudents(false);
      if (all && all.length > 0) {
        return all.map(s => ({
          id: s.id,
          name: s.displayName || s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          xp: s.xp || 0,
          grade: s.grade || 'Grade 4',
          classId: s.classId || 'class-4a',
          avatar: s.avatar
        }));
      }
    }
    return [
      { id: "student-4a-343", name: "İpek İlhan", xp: 170 },
      { id: "student-4a-305", name: "Bahriye Ada Güler", xp: 160 },
      { id: "student-4a-310", name: "Ahmet Mete İnal", xp: 150 },
      { id: "student-4a-318", name: "Şimal Koyun", xp: 120 }
    ];
  };

  /**
   * Helper to award a single discrete assignment
   */
  root.awardHomeworkXP = function(studentId, assignmentId, notes = '') {
    const assignment = ALICE_HOMEWORK_ASSIGNMENTS.find(a => 
      a.id === assignmentId || 
      a.code === assignmentId || 
      (a.code && a.code.toLowerCase() === String(assignmentId).toLowerCase()) ||
      (a.id && a.id.toLowerCase() === String(assignmentId).toLowerCase())
    );

    if (!assignment) {
      console.error('[awardHomeworkXP] Unknown assignment ID:', assignmentId);
      return null;
    }

    // Mark homework submission in store
    const store = root.store;
    if (store && typeof store.recordHomeworkSubmission === 'function') {
      const hwItem = store.getHomeworkItem ? store.getHomeworkItem(assignment.id) : null;
      if (hwItem) {
        store.recordHomeworkSubmission(assignment.id, studentId, {
          status: 'COMPLETED',
          completedDate: new Date().toISOString().split('T')[0],
          notes: notes || ('Completed task: ' + assignment.title)
        });
      }
    }

    return root.AdventureAcademy.awardXP({
      studentId: studentId,
      amount: assignment.xp,
      source: `Homework: [${assignment.code}] ${assignment.title}`,
      notes: notes,
      timestamp: new Date().toISOString()
    });
  };

  /**
   * Helper to award multiple challenges simultaneously for a selected student
   * @param {string} studentId
   * @param {Array<string>} taskIds
   * @param {string} teacherEvidence
   */
  root.awardMultipleAliceTasks = function(studentId, taskIds = [], teacherEvidence = '') {
    if (!studentId || !Array.isArray(taskIds) || taskIds.length === 0) {
      alert('Please select a student and at least one challenge task.');
      return null;
    }

    const tasks = ALICE_HOMEWORK_ASSIGNMENTS.filter(a => 
      taskIds.includes(a.id) || taskIds.includes(a.code)
    );

    if (tasks.length === 0) {
      alert('No matching challenges found.');
      return null;
    }

    const totalXP = tasks.reduce((sum, t) => sum + (t.xp || 0), 0);
    const store = root.store;

    // Record submission for each task
    tasks.forEach(t => {
      if (store && typeof store.recordHomeworkSubmission === 'function') {
        const hwItem = store.getHomeworkItem ? store.getHomeworkItem(t.id) : null;
        if (hwItem) {
          store.recordHomeworkSubmission(t.id, studentId, {
            status: 'COMPLETED',
            completedDate: new Date().toISOString().split('T')[0],
            notes: teacherEvidence ? ('Evidence: ' + teacherEvidence) : ('Verified quest: ' + t.title)
          });
        }
      }
    });

    // Write aggregated reward to XP Ledger
    const taskTitles = tasks.map(t => t.code).join(', ');
    const res = root.AdventureAcademy.awardXP({
      studentId: studentId,
      amount: totalXP,
      source: `Alice XP Quest: ${taskTitles} (+${totalXP} XP)`,
      notes: teacherEvidence,
      timestamp: new Date().toISOString()
    });

    return { result: res, totalXP, tasks };
  };

})(typeof window !== 'undefined' ? window : global);
