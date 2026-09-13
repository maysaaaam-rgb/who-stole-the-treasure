/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — QUEST, DIALOGUE & LEARNING SYSTEMS (v1.0)
 * 
 * Reactive Event Bus, Inventory System, Quest State Machine,
 * Compact Dialogue Bubble System with TTS Audio, and Learning Events.
 * ============================================================================
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. EVENT BUS
  // =========================================================================
  class EventBus {
    constructor() {
      this.listeners = new Map();
    }

    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
      return () => this.off(event, callback);
    }

    off(event, callback) {
      if (!this.listeners.has(event)) return;
      const arr = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, arr);
    }

    emit(event, payload = {}) {
      if (!this.listeners.has(event)) return;
      const callbacks = this.listeners.get(event);
      for (let i = 0; i < callbacks.length; i++) {
        try {
          callbacks[i](payload);
        } catch (err) {
          console.error(`Error in event listener for "${event}":`, err);
        }
      }
    }
  }

  // =========================================================================
  // 2. INVENTORY SYSTEM
  // =========================================================================
  class InventorySystem {
    constructor() {
      this.items = []; // Array of { id, name, icon, count, description }
      this.listeners = [];
    }

    subscribe(fn) {
      this.listeners.push(fn);
      fn(this.items);
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    _notify() {
      for (const fn of this.listeners) {
        fn(this.items);
      }
    }

    addItem(item) {
      const existing = this.items.find(i => i.id === item.id);
      if (existing) {
        existing.count += (item.count || 1);
      } else {
        this.items.push({
          id: item.id,
          name: item.name || 'Unknown Item',
          icon: item.icon || '📦',
          description: item.description || '',
          count: item.count || 1
        });
      }
      this._notify();
    }

    removeItem(itemId, count = 1) {
      const idx = this.items.findIndex(i => i.id === itemId);
      if (idx === -1) return false;

      const item = this.items[idx];
      item.count -= count;
      if (item.count <= 0) {
        this.items.splice(idx, 1);
      }
      this._notify();
      return true;
    }

    hasItem(itemId) {
      return this.items.some(i => i.id === itemId && i.count > 0);
    }

    getItem(itemId) {
      return this.items.find(i => i.id === itemId) || null;
    }

    clear() {
      this.items = [];
      this._notify();
    }
  }

  // =========================================================================
  // 3. QUEST SYSTEM
  // =========================================================================
  class QuestSystem {
    constructor(eventBus) {
      this.events = eventBus;
      this.quests = new Map();
      this.activeQuest = null;
      this.completedQuests = new Set();
      this.listeners = [];

      this._setupEventListeners();
    }

    subscribe(fn) {
      this.listeners.push(fn);
      fn(this.activeQuest);
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    _notify() {
      for (const fn of this.listeners) {
        fn(this.activeQuest);
      }
    }

    registerQuest(questDef) {
      this.quests.set(questDef.id, {
        id: questDef.id,
        title: questDef.title,
        description: questDef.description || '',
        rewardXP: questDef.rewardXP || 50,
        objectives: questDef.objectives.map(o => ({
          id: o.id,
          text: o.text,
          isCompleted: false
        })),
        isCompleted: false,
        isActive: false
      });
    }

    startQuest(questId) {
      const q = this.quests.get(questId);
      if (!q || q.isCompleted) return;

      q.isActive = true;
      this.activeQuest = q;
      this._notify();

      if (this.events) {
        this.events.emit('QUEST_STARTED', {
          questId: q.id,
          title: q.title
        });
      }

      // Play quest start chime
      if (root.StoryBridge && root.StoryBridge.playSound) {
        root.StoryBridge.playSound('clue');
      }
    }

    completeObjective(questId, objectiveId) {
      const q = this.quests.get(questId);
      if (!q) return;

      const obj = q.objectives.find(o => o.id === objectiveId);
      if (obj && !obj.isCompleted) {
        obj.isCompleted = true;
        this._notify();

        if (this.events) {
          this.events.emit('OBJECTIVE_COMPLETED', {
            questId: q.id,
            objectiveId: obj.id,
            text: obj.text
          });
        }

        // Check if all objectives are completed
        const allDone = q.objectives.every(o => o.isCompleted);
        if (allDone) {
          this.completeQuest(questId);
        }
      }
    }

    completeQuest(questId) {
      const q = this.quests.get(questId);
      if (!q || q.isCompleted) return;

      q.isCompleted = true;
      q.isActive = false;
      this.completedQuests.add(questId);
      this._notify();

      // 1. Play Fanfare Sound
      if (root.StoryBridge && root.StoryBridge.playSound) {
        root.StoryBridge.playSound('correct');
      }

      // 2. Award XP via SchoolStore Bridge
      if (root.StoryBridge && root.StoryBridge.awardXP) {
        root.StoryBridge.awardXP(q.rewardXP, `Completed Quest: "${q.title}"`);
      }

      // 3. Emit Reward & Story Events
      if (this.events) {
        this.events.emit('QUEST_COMPLETED', {
          questId: q.id,
          title: q.title,
          rewardXP: q.rewardXP
        });
        this.events.emit('REWARD_EARNED', {
          type: 'xp',
          amount: q.rewardXP,
          reason: q.title
        });
      }
    }

    _setupEventListeners() {
      if (!this.events) return;

      // Listen to game events to advance quest objectives automatically
      this.events.on('OBJECT_COLLECTED', (data) => {
        if (data.itemId === 'golden_key' && this.activeQuest && this.activeQuest.id === 'gatekeeper_key') {
          this.completeObjective('gatekeeper_key', 'find_key');
        }
      });

      this.events.on('DOOR_UNLOCKED', (data) => {
        if (data.doorId === 'gate-ancient' && this.activeQuest && this.activeQuest.id === 'gatekeeper_key') {
          this.completeObjective('gatekeeper_key', 'unlock_gate');
        }
      });
    }
  }

  // =========================================================================
  // 4. DIALOGUE SYSTEM (Speech Bubbles, Compact Box & TTS Audio)
  // =========================================================================
  class DialogueSystem {
    constructor() {
      this.dialogues = new Map();
      this.currentConversation = null;
      this.currentNodeIndex = 0;
      this.containerEl = null;
      this.speakerEl = null;
      this.textEl = null;
      this.actionBtnEl = null;
      this.isOpen = false;
    }

    init(containerEl) {
      this.containerEl = containerEl;
      if (!containerEl) return;

      this.speakerEl = containerEl.querySelector('.story-dialogue-speaker-tag');
      this.textEl = containerEl.querySelector('.story-dialogue-text');
      this.actionBtnEl = containerEl.querySelector('.story-dialogue-action-btn');

      if (this.actionBtnEl) {
        this.actionBtnEl.addEventListener('click', () => this.advanceDialogue());
      }

      window.addEventListener('keydown', (e) => {
        if (this.isOpen && (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter')) {
          e.preventDefault();
          this.advanceDialogue();
        }
      });
    }

    registerDialogue(key, dialogueNodes) {
      this.dialogues.set(key, dialogueNodes);
    }

    startDialogue(key, speakerEntity = null) {
      const nodes = this.dialogues.get(key);
      if (!nodes || nodes.length === 0) return;

      this.currentConversation = {
        key,
        speaker: speakerEntity,
        nodes
      };
      this.currentNodeIndex = 0;
      this.isOpen = true;

      this._renderCurrentNode();
    }

    _renderCurrentNode() {
      if (!this.currentConversation || !this.containerEl) return;

      const node = this.currentConversation.nodes[this.currentNodeIndex];
      const speakerName = node.speaker || (this.currentConversation.speaker ? this.currentConversation.speaker.name : 'Guide');

      if (this.speakerEl) {
        this.speakerEl.textContent = `🗣️ ${speakerName}`;
      }
      if (this.textEl) {
        this.textEl.textContent = node.text;
      }
      if (this.actionBtnEl) {
        const isLast = (this.currentNodeIndex === this.currentConversation.nodes.length - 1);
        this.actionBtnEl.textContent = isLast ? 'Finish ↵' : 'Next ↵';
      }

      this.containerEl.classList.add('is-visible');

      // Play Spoken Voice via StoryAudioEngine (synchronizes speaker talking animation)
      const speakerEntity = this.currentConversation.speaker;
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVoice) {
        root.StoryAudioEngine.playVoice(node, speakerEntity);
      } else if (root.StoryBridge && root.StoryBridge.speak) {
        root.StoryBridge.speak(node.text);
      }

      // If node triggers an immediate quest start
      if (node.startQuest && root.StoryGame && root.StoryGame.quests) {
        root.StoryGame.quests.startQuest(node.startQuest);
      }
    }

    advanceDialogue() {
      if (!this.currentConversation) return;

      this.currentNodeIndex++;
      if (this.currentNodeIndex < this.currentConversation.nodes.length) {
        this._renderCurrentNode();
      } else {
        this.closeDialogue();
      }
    }

    closeDialogue() {
      if (this.currentConversation && this.currentConversation.speaker) {
        this.currentConversation.speaker.isTalking = false;
      }
      this.isOpen = false;
      this.currentConversation = null;
      this.currentNodeIndex = 0;
      if (this.containerEl) {
        this.containerEl.classList.remove('is-visible');
      }
    }

    showQuickToast(message, durationMs = 2800) {
      let toast = document.getElementById('story-toast-notification');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'story-toast-notification';
        toast.className = 'story-learning-banner';
        document.body.appendChild(toast);
      }

      toast.innerHTML = `<span>💬</span> <span>${message}</span>`;
      toast.classList.add('is-shown');

      setTimeout(() => {
        toast.classList.remove('is-shown');
      }, durationMs);
    }
  }

  // =========================================================================
  // 5. LEARNING EVENT BUS (CEFR A1 Vocabulary & Grammar Highlights)
  // =========================================================================
  class LearningEventBus {
    constructor(eventBus) {
      this.events = eventBus;
      this.vocabularyLog = [];
      this._setupListeners();
    }

    _setupListeners() {
      if (!this.events) return;

      this.events.on('VOCABULARY_INTRODUCED', (data) => {
        this.vocabularyLog.push({
          word: data.word,
          label: data.label,
          timestamp: new Date().toISOString()
        });

        // Show floating banner in classroom
        let banner = document.getElementById('story-learning-banner');
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'story-learning-banner';
          banner.className = 'story-learning-banner';
          document.body.appendChild(banner);
        }

        banner.innerHTML = `<span>✨</span> <span><strong>New Word:</strong> ${data.label} (<em>${data.word}</em>)</span>`;
        banner.classList.add('is-shown');

        setTimeout(() => {
          banner.classList.remove('is-shown');
        }, 3200);
      });
    }
  }

  // Export to namespace
  root.StorySystems = {
    EventBus,
    InventorySystem,
    QuestSystem,
    DialogueSystem,
    LearningEventBus
  };

})(window);
