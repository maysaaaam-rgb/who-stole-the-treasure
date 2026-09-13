/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — PLATFORM INTEGRATION BRIDGE (v1.0)
 * 
 * Seamlessly interfaces with existing Adventure Academy platform services:
 * - XP Transaction Ledger (`store.giveXP`)
 * - Student Profile & Avatar data
 * - Web Audio API procedural sound engine & Web Speech API TTS
 * - LocalStorage Progress Persistence
 * Zero duplicate systems.
 * ============================================================================
 */

(function(root) {
  'use strict';

  const STORAGE_KEY = 'story_adventure_progress_test';

  // Instantiate SoundEngine if not globally available
  let localSoundEngine = root.soundEngine || null;
  if (!localSoundEngine && typeof root.SoundEngine === 'function') {
    localSoundEngine = new root.SoundEngine();
  }

  const StoryBridge = {
    // 1. Get Current Student Profile
    getActiveStudent() {
      if (root.schoolStore && typeof root.schoolStore.getActiveStudent === 'function') {
        return root.schoolStore.getActiveStudent();
      }
      return {
        id: 'student-3a-224',
        firstName: 'Explorer',
        lastName: 'Student',
        overallCefr: 'A1'
      };
    },

    // 2. Award XP directly via existing store.giveXP()
    awardXP(amount, reason = 'Story Quest Completed') {
      const student = this.getActiveStudent();
      const studentId = student ? student.id : 'student-3a-224';

      console.log(`[StoryBridge] Awarding ${amount} XP to student ${studentId} for: "${reason}"`);

      if (root.schoolStore && typeof root.schoolStore.giveXP === 'function') {
        root.schoolStore.giveXP(studentId, amount, reason, 'Story Adventure', {
          category: 'positive',
          icon: '⭐'
        });
      } else {
        console.log('[StoryBridge] schoolStore not active, XP logged in memory.');
      }

      // Show XP popup notification in HUD
      let xpToast = document.getElementById('story-xp-toast');
      if (!xpToast) {
        xpToast = document.createElement('div');
        xpToast.id = 'story-xp-toast';
        xpToast.className = 'story-badge-pill';
        xpToast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#f59e0b; color:#0f172a; font-weight:800; z-index:9999; box-shadow:0 8px 24px rgba(245,158,11,0.5);';
        document.body.appendChild(xpToast);
      }
      xpToast.innerHTML = `⭐ +${amount} XP Earned!`;
      xpToast.style.display = 'inline-flex';
      setTimeout(() => {
        xpToast.style.display = 'none';
      }, 3500);
    },

    // 3. Play Sound Effect (Routes to StoryAudioEngine with fallback)
    playSound(type) {
      if (root.StoryAudioEngine && root.StoryAudioEngine.soundEnabled) {
        if (type === 'correct') {
          root.StoryAudioEngine.handleEvent('QUEST_COMPLETED');
          return;
        } else if (type === 'clue') {
          root.StoryAudioEngine.handleEvent('ITEM_PICKED_UP', { itemId: 'golden_key' });
          return;
        } else if (type === 'lock') {
          root.StoryAudioEngine.handleEvent('DOOR_UNLOCKED');
          return;
        }
      }

      const se = root.soundEngine || localSoundEngine;
      if (!se) return;

      if (type === 'correct') {
        if (se.playCorrect) se.playCorrect();
      } else if (type === 'wrong') {
        if (se.playWrong) se.playWrong();
      } else if (type === 'clue') {
        if (se.playClue) se.playClue();
      } else if (type === 'click') {
        if (se.playClick) se.playClick();
      } else if (type === 'lock') {
        if (se.playLockClick) se.playLockClick();
        else if (se.playClick) se.playClick();
      }
    },

    // 4. Footstep Procedural Sound
    playFootstep(surface = 'dirt') {
      if (root.StoryAudioEngine && root.StoryAudioEngine.soundEnabled) {
        root.StoryAudioEngine.handleEvent('PLAYER_FOOTSTEP', { surface });
        return;
      }

      const se = root.soundEngine || localSoundEngine;
      if (!se || !se.audioCtx) return;

      try {
        const now = se.audioCtx.currentTime;
        const osc = se.audioCtx.createOscillator();
        const gain = se.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(90 + Math.random() * 20, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(se.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {}
    },

    // 5. Speak English Speech using Text-to-Speech
    speak(text) {
      const se = root.soundEngine || localSoundEngine;
      if (se && typeof se.speak === 'function') {
        se.speak(text, { rate: 0.9, pitch: 1.05 });
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.9;
        window.speechSynthesis.speak(utt);
      }
    },

    // 6. Save & Load Adventure Progress
    saveProgress(progressData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      } catch (e) {
        console.warn('[StoryBridge] Failed to write progress to localStorage', e);
      }
    },

    loadProgress() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn('[StoryBridge] Failed to read progress from localStorage', e);
      }
      return null;
    },

    clearProgress() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  root.StoryBridge = StoryBridge;

})(window);
