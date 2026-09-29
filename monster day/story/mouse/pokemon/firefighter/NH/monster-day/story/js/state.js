/**
 * CENTRAL APPLICATION STATE MANAGER
 */

import { STORY_DATA } from './storyData.js';

export const AppState = {
  currentMode: 'enter_story', // Modes: enter_story | prediction_intro | story_mode | character_mode | pair_interaction | story_decisions | activity_memory | activity_retell | activity_hotseat | activity_whatif | mini_theatre | teacher_assessment
  currentSceneIndex: 0,       // Pointer into STORY_DATA.scenes
  isMuted: false,
  isTeacherDrawerOpen: false,
  isFullscreen: false,

  // Enter the story state
  enterCluesRevealed: new Set(),
  activeVocabIndex: 0,

  // Prediction Intro state
  selectedPrediction: null,
  predictionRevealed: false,
  predictionVotes: { A: 0, B: 0, C: 0 },

  // Story Stop states
  storyStopAnswers: {
    stop_1: { selectedOption: null, revealed: false },
    stop_2: { selectedOption: null, revealed: false },
    stop_3: { selectedOption: null, revealed: false }
  },

  // Interactive Scene Props State (e.g. tin man oiled)
  tinManOiled: false,

  // Character Mode state
  selectedCharacterId: "dorothy",
  activeRoleCue: null,

  // Pair Dialogue state
  activeDialogueIndex: 0,

  // Story Decisions state
  activeDecisionIndex: 0,
  decisionChoices: {},
  decisionRevealed: false,

  // Story Memory Activity (8 Cards sequencing)
  memoryDeck: [],
  memorySlots: Array(8).fill(null),
  memoryFeedback: null,

  // Retell Activity state
  retellIndex: 0,
  retellHintsRevealed: { 0: 0, 1: 0, 2: 0, 3: 0 }, // 0: none, 1: keywords, 2: starter, 3: target

  // Hot Seat state
  hotSeatCharId: "lion",
  revealedQuestions: new Set(),

  // What If Activity state
  whatIfIndex: 0,
  selectedWhatIfChoice: null,

  // Mini Theatre state
  miniTheatreGroupIndex: 0,

  // Teacher Assessment state
  students: [
    { id: 1, name: "Student 1", ratings: { listening: 1, speaking: 1, interaction: 1, prediction: 1, roleplay: 1, retelling: 1 } },
    { id: 2, name: "Student 2", ratings: { listening: 1, speaking: 1, interaction: 1, prediction: 1, roleplay: 1, retelling: 1 } },
    { id: 3, name: "Student 3", ratings: { listening: 1, speaking: 1, interaction: 1, prediction: 1, roleplay: 1, retelling: 1 } },
    { id: 4, name: "Student 4", ratings: { listening: 1, speaking: 1, interaction: 1, prediction: 1, roleplay: 1, retelling: 1 } }
  ],

  // Initialize and Reset methods
  init() {
    this.resetMemoryDeck();
  },

  resetMemoryDeck() {
    // Shuffle the 8 cards
    const original = [...STORY_DATA.storyMemory.cards];
    for (let i = original.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [original[i], original[j]] = [original[j], original[i]];
    }
    this.memoryDeck = original;
    this.memorySlots = Array(8).fill(null);
    this.memoryFeedback = null;
  },

  setMode(mode) {
    this.currentMode = mode;
  },

  setSceneIndex(idx) {
    if (idx >= 0 && idx < STORY_DATA.scenes.length) {
      this.currentSceneIndex = idx;
    }
  },

  nextScene() {
    if (this.currentSceneIndex < STORY_DATA.scenes.length - 1) {
      this.currentSceneIndex++;
      return true;
    }
    return false;
  },

  prevScene() {
    if (this.currentSceneIndex > 0) {
      this.currentSceneIndex--;
      return true;
    }
    return false;
  }
};
