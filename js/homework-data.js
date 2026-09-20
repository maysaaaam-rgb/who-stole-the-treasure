/**
 * ADVENTURE ACADEMY — DISCRETE HOMEWORK XP TASKS DATA
 * Alice in Wonderland Individual Homework Quests & Verified XP Ledger Model
 */
(function(root) {
  'use strict';

  const ALICE_HOMEWORK_ASSIGNMENTS = [
    // Base Participation
    {
      id: "hw-alice-checkin",
      code: "HW-ALICE-000",
      tier: "Base",
      level: 0,
      title: "Completed Base Log / Reading Check-In",
      xp: 10,
      category: "Participation",
      description: "Submit reading check-in log and daily reading participation confirmation.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },

    // Tier 1: Level 1 — Get Started!
    {
      id: "hw-alice-vocab10",
      code: "HW-ALICE-101",
      tier: "Tier 1",
      level: 1,
      title: "Learn 10 New Words & Meanings",
      xp: 10,
      category: "Vocabulary",
      description: "Learn 10 new vocabulary words and their meanings from the chapter.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-fav-char",
      code: "HW-ALICE-102",
      tier: "Tier 1",
      level: 1,
      title: "Favorite Character + 3 Reasons",
      xp: 15,
      category: "Speaking/Writing",
      description: "Choose your favorite character from Wonderland and explain 3 reasons why.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-draw",
      code: "HW-ALICE-103",
      tier: "Tier 1",
      level: 1,
      title: "Draw a Scene/Character & Explain",
      xp: 20,
      category: "Creative",
      description: "Draw a colorful scene or character from Alice in Wonderland and write/speak an explanation.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-comp5",
      code: "HW-ALICE-104",
      tier: "Tier 1",
      level: 1,
      title: "Answer 5 Comprehension Questions",
      xp: 20,
      category: "Reading",
      description: "Answer 5 story comprehension questions in complete sentences.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },

    // Tier 2: Level 2 — Go Deeper!
    {
      id: "hw-alice-vocab25",
      code: "HW-ALICE-201",
      tier: "Tier 2",
      level: 2,
      title: "Learn 25 Words (10 Used in Sentences)",
      xp: 40,
      category: "Vocabulary",
      description: "Master 25 story vocabulary words and use at least 10 in original context sentences.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-speech2m",
      code: "HW-ALICE-202",
      tier: "Tier 2",
      level: 2,
      title: "2-Minute Character Talk (Actions & Role)",
      xp: 50,
      category: "Speaking",
      description: "Deliver a 2-minute oral presentation describing a character's key actions and role.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-retell",
      code: "HW-ALICE-203",
      tier: "Tier 2",
      level: 2,
      title: "Retell One Key Scene (Without Reading)",
      xp: 50,
      category: "Speaking",
      description: "Retell one key scene from memory using descriptive adverbs and sequence connectors.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-new-ending",
      code: "HW-ALICE-204",
      tier: "Tier 2",
      level: 2,
      title: "Write an Alternate Ending (100–150 Words)",
      xp: 50,
      category: "Writing",
      description: "Create and write a 100–150 word original alternate ending for Alice in Wonderland.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },

    // Tier 3: Level 3 — Big Challenge!
    {
      id: "hw-alice-char-compare",
      code: "HW-ALICE-301",
      tier: "Tier 3",
      level: 3,
      title: "Compare Two Characters in Detail",
      xp: 80,
      category: "Critical Thinking",
      description: "Conduct an in-depth character comparison analyzing personality traits, motivations, and conflicts.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-journey",
      code: "HW-ALICE-302",
      tier: "Tier 3",
      level: 3,
      title: "Explain Alice’s Journey & Character Arc",
      xp: 80,
      category: "Critical Thinking",
      description: "Detail Alice's growth from curiosity and confusion to confidence and problem-solving.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-act-out",
      code: "HW-ALICE-303",
      tier: "Tier 3",
      level: 3,
      title: "Act Out a Scene (Partner/Group Video)",
      xp: 100,
      category: "Speaking/Drama",
      description: "Collaborate with a partner or group to record and submit a dramatic scene reenactment.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    },
    {
      id: "hw-alice-full-summary",
      code: "HW-ALICE-304",
      tier: "Tier 3",
      level: 3,
      title: "Full Story Spoken Summary (5–7 Minutes)",
      xp: 200,
      category: "Speaking/Mastery",
      description: "Deliver a master spoken presentation summarizing the entire narrative with comprehensive detail.",
      poster: "assets/homework/alice-xp-challenges-poster.jpg"
    }
  ];

  // Global AdventureAcademy Hub
  root.ALICE_HOMEWORK_ASSIGNMENTS = ALICE_HOMEWORK_ASSIGNMENTS;
  root.AdventureAcademy = root.AdventureAcademy || {};

  /**
   * Directly updates student balance and triggers monster evolution check
   * @param {Object} payload - { studentId, amount, source, timestamp }
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
      // Trigger Monster Evolution Check if applicable
      if (res.evolutionEvent && typeof root.openMonsterLevelUpModal === 'function') {
        root.openMonsterLevelUpModal(payload.studentId, res.evolutionEvent.prevLevel, res.evolutionEvent.newLevel);
      }
      // Re-render current platform view to update UI counters
      if (typeof root.renderCurrentView === 'function') {
        root.renderCurrentView();
      }
      // Notify Teacher UI
      if (typeof root.showNotification === 'function') {
        const studentName = res.student ? (res.student.firstName + ' ' + (res.student.lastName || '')) : 'Student';
        root.showNotification('⭐ +' + amount + ' XP awarded to ' + studentName.trim() + ' for "' + source + '"!');
      }
    }
    return res;
  };

  /**
   * Helper to award directly to a selected learner in your XP Ledger
   * @param {string} studentId
   * @param {string} assignmentId - e.g. "hw-alice-vocab10" or "HW-ALICE-101"
   */
  root.awardHomeworkXP = function(studentId, assignmentId) {
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

    // Also mark homework submission in store if this homework item exists
    const store = root.store;
    if (store && typeof store.recordHomeworkSubmission === 'function') {
      const hwItem = store.getHomeworkItem ? store.getHomeworkItem(assignment.id) : null;
      if (hwItem) {
        store.recordHomeworkSubmission(assignment.id, studentId, {
          status: 'COMPLETED',
          completedDate: new Date().toISOString().split('T')[0],
          notes: 'Completed task: ' + assignment.title
        });
      }
    }

    // Directly updates student balance and triggers monster evolution check
    return root.AdventureAcademy.awardXP({
      studentId: studentId,
      amount: assignment.xp,
      source: 'Homework: ' + (assignment.code ? '[' + assignment.code + '] ' : '') + assignment.title,
      timestamp: new Date().toISOString()
    });
  };

})(typeof window !== 'undefined' ? window : global);
