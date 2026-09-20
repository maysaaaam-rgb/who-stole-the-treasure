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
    saveProgress(storyKeyOrData, maybeData) {
      try {
        const key = (typeof storyKeyOrData === 'string') ? `story_adventure_progress_${storyKeyOrData}` : STORAGE_KEY;
        const data = (typeof storyKeyOrData === 'string') ? maybeData : storyKeyOrData;
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`[StoryBridge] Saved adventure state to ${key}`);
      } catch (e) {
        console.warn('[StoryBridge] Failed to write progress to localStorage', e);
      }
    },

    loadProgress(storyKey = 'alice') {
      try {
        const key = typeof storyKey === 'string' ? `story_adventure_progress_${storyKey}` : STORAGE_KEY;
        const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn('[StoryBridge] Failed to read progress from localStorage', e);
      }
      return null;
    },

    clearProgress(storyKey = 'alice') {
      try {
        const key = typeof storyKey === 'string' ? `story_adventure_progress_${storyKey}` : STORAGE_KEY;
        localStorage.removeItem(key);
        localStorage.removeItem(STORAGE_KEY);
        console.log(`[StoryBridge] Cleared progress for ${key}`);
      } catch (e) {}
    },

    // 7. Wonderland & Educational Story Achievements
    unlockAchievement(achievementId) {
      const student = this.getActiveStudent();
      const studentId = student ? student.id : 'student-3a-224';

      console.log(`[StoryBridge] Unlocking achievement "${achievementId}" for student: ${studentId}`);

      let award = null;
      if (root.schoolStore && typeof root.schoolStore.unlockAchievement === 'function') {
        award = root.schoolStore.unlockAchievement(studentId, achievementId);
      }

      if (award) {
        this.showAchievementToast(award);
      }
      return award;
    },

    showAchievementToast(award) {
      let achToast = document.getElementById('story-achievement-toast');
      if (!achToast) {
        achToast = document.createElement('div');
        achToast.id = 'story-achievement-toast';
        achToast.className = 'story-achievement-banner';
        achToast.style.cssText = `
          position: fixed;
          top: 65px;
          left: 50%;
          transform: translateX(-50%) translateY(-20px);
          background: linear-gradient(135deg, rgba(30, 27, 75, 0.95), rgba(15, 23, 42, 0.95));
          border: 2px solid #ca8a04;
          box-shadow: 0 10px 30px rgba(202, 138, 4, 0.4), 0 0 20px rgba(254, 240, 138, 0.2);
          border-radius: 16px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 10000;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        `;
        document.body.appendChild(achToast);
      }

      achToast.innerHTML = `
        <span style="font-size: 2.2rem; filter: drop-shadow(0 2px 8px rgba(254,240,138,0.5));">${award.icon || '🏆'}</span>
        <div>
          <div style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #fef08a;">Achievement Unlocked!</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-top: 1px;">${award.name}</div>
          <div style="font-size: 0.76rem; color: #a7f3d0; margin-top: 2px;">+${award.xpReward || 100} XP Awarded</div>
        </div>
      `;

      requestAnimationFrame(() => {
        achToast.style.opacity = '1';
        achToast.style.transform = 'translateX(-50%) translateY(0)';
      });

      this.playSound('correct');

      setTimeout(() => {
        achToast.style.opacity = '0';
        achToast.style.transform = 'translateX(-50%) translateY(-20px)';
      }, 4500);
    }
  };

  root.StoryBridge = StoryBridge;

})(window);
