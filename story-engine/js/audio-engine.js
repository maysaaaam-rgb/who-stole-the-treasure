/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — AUDIO ENGINE CORE (v1.0)
 * 
 * Generic, Story-Agnostic Audio Architecture supporting pluggable AudioPacks:
 * - Master Channel Mixer (Master, Music, Ambience, SFX, Voice)
 * - Dynamic Audio State Coordinator (exploration, suspense, chase, victory, cinematic)
 * - Event-Driven Audio Router (PLAYER_FOOTSTEP, ITEM_PICKED_UP, DOOR_OPENED, etc.)
 * - Voice & Dialogue Synchronizer (Voice playback synchronized with character mouth animation)
 * - Dual Mode: High-Fidelity Procedural Sound Synthesizer + Audio Asset URLs
 * Completely decoupled from specific story content (Forest, Alice, Peter Pan, etc.).
 * ============================================================================
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL SOUND SYNTHESIZER (Fallback & Procedural Audio Engine)
  // =========================================================================
  class SoundSynthesizer {
    constructor(audioCtx, channels) {
      this.ctx = audioCtx;
      this.channels = channels;
    }

    /**
     * Synthesizes surface-aware footsteps (dirt, grass, stone, wood, water).
     */
    synthFootstep(surface = 'dirt', volume = 0.05) {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        let baseFreq = 90;
        let endFreq = 30;
        let duration = 0.05;

        if (surface === 'grass') {
          baseFreq = 140;
          endFreq = 50;
          duration = 0.04;
        } else if (surface === 'stone') {
          baseFreq = 220;
          endFreq = 80;
          duration = 0.035;
        } else if (surface === 'wood') {
          baseFreq = 160;
          endFreq = 60;
          duration = 0.045;
        }

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq + Math.random() * 20, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.channels.sfx);

        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {}
    }

    /**
     * Synthesizes an upward or downward musical arpeggio (keys, discovery, items).
     */
    synthArpeggio(notes = [523, 659, 784, 1046], interval = 0.05, type = 'triangle', noteDuration = 0.3, volume = 0.08) {
      if (!this.ctx) return;
      try {
        notes.forEach((freq, idx) => {
          const now = this.ctx.currentTime + idx * interval;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(volume, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration);

          osc.connect(gain);
          gain.connect(this.channels.sfx);

          osc.start(now);
          osc.stop(now + noteDuration);
        });
      } catch (e) {}
    }

    /**
     * Synthesizes heavy low-frequency stone or mechanical rumble (doors, gates, quakes).
     */
    synthRumble(startFreq = 65, endFreq = 45, duration = 0.65, volume = 0.12) {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.linearRampToValueAtTime(endFreq, now + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.channels.sfx);

        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {}
    }

    /**
     * Synthesizes gentle birdsong warble.
     */
    synthBirdChirp(baseFreq = 2200, volume = 0.04) {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, now + 0.18);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

        osc.connect(gain);
        gain.connect(this.channels.ambience);

        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }
  }

  // =========================================================================
  // 2. STORY AUDIO ENGINE (Core Architecture)
  // =========================================================================
  class StoryAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.soundEnabled = true;
      this.activeAudioPack = null;
      this.currentState = 'exploration'; // 'exploration' | 'suspense' | 'chase' | 'victory' | 'cinematic'

      // Gain Channels
      this.channels = {
        master: null,
        music: null,
        ambience: null,
        sfx: null,
        voice: null
      };

      this.synthesizer = null;
      this.activeAmbienceHandle = null;
      this.activeMusicHandle = null;
      this.eventBus = null;
    }

    /**
     * Initializes the Web Audio Context and Master Mixer Channels.
     */
    initContext() {
      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        return this.audioCtx;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      const ctx = new AudioContextClass();
      this.audioCtx = ctx;

      // Master Channel
      const master = ctx.createGain();
      master.gain.setValueAtTime(1.0, ctx.currentTime);
      master.connect(ctx.destination);

      // Sub-channels
      const music = ctx.createGain();
      music.gain.setValueAtTime(0.7, ctx.currentTime);
      music.connect(master);

      const ambience = ctx.createGain();
      ambience.gain.setValueAtTime(0.6, ctx.currentTime);
      ambience.connect(master);

      const sfx = ctx.createGain();
      sfx.gain.setValueAtTime(0.8, ctx.currentTime);
      sfx.connect(master);

      const voice = ctx.createGain();
      voice.gain.setValueAtTime(1.0, ctx.currentTime);
      voice.connect(master);

      this.channels = { master, music, ambience, sfx, voice };
      this.synthesizer = new SoundSynthesizer(ctx, this.channels);

      return this.audioCtx;
    }

    /**
     * Loads a Story AudioPack (e.g. ForestAudioPack, AliceAudioPack, PeterPanAudioPack).
     */
    loadAudioPack(audioPack) {
      if (!audioPack) return;
      this.activeAudioPack = audioPack;
      console.log(`[StoryAudioEngine] Loaded AudioPack: "${audioPack.name || audioPack.id}"`);

      // Initialize context if audio is already active
      this.initContext();

      // Start initial ambience and music state
      this.setState(audioPack.defaultState || 'exploration');
    }

    /**
     * Binds the engine to the global EventBus to react to standard story events.
     */
    bindEventBus(eventBus) {
      this.eventBus = eventBus;
      if (!eventBus) return;

      const standardEvents = [
        'PLAYER_FOOTSTEP', 'PLAYER_INTERACT',
        'NPC_APPROACH', 'NPC_TALK', 'NPC_REACT',
        'ITEM_DISCOVERED', 'ITEM_PICKED_UP', 'ITEM_USED',
        'QUEST_STARTED', 'QUEST_UPDATED', 'QUEST_COMPLETED',
        'CHASE_STARTED', 'CHASE_ENDED',
        'DOOR_UNLOCKED', 'AREA_ENTERED',
        'CINEMATIC_STARTED', 'CINEMATIC_ENDED',
        'STORY_TRANSITION', 'LEARNING_DISCOVERY', 'REWARD_EARNED'
      ];

      standardEvents.forEach(evtName => {
        eventBus.on(evtName, (payload) => {
          this.handleEvent(evtName, payload);
        });
      });
    }

    /**
     * Dispatches game events to the active AudioPack's mapped sound cues.
     */
    handleEvent(eventName, payload = {}) {
      if (!this.soundEnabled || !this.activeAudioPack) return;
      this.initContext();

      // 1. Check AudioPack event handlers
      if (this.activeAudioPack.events && typeof this.activeAudioPack.events[eventName] === 'function') {
        try {
          this.activeAudioPack.events[eventName](payload, this.activeAudioPack, this);
        } catch (e) {
          console.warn(`[StoryAudioEngine] Error handling event "${eventName}":`, e);
        }
      }

      // 2. Automatic State Transitions based on events
      if (eventName === 'CHASE_STARTED') {
        this.setState('chase');
      } else if (eventName === 'CHASE_ENDED') {
        this.setState('exploration');
      } else if (eventName === 'QUEST_COMPLETED') {
        this.setState('victory');
      }
    }

    /**
     * Changes the dynamic audio state with smooth cross-fades.
     */
    setState(newState, transitionDuration = 1.2) {
      this.currentState = newState;
      if (!this.activeAudioPack || !this.activeAudioPack.states) return;

      const stateDef = this.activeAudioPack.states[newState] || this.activeAudioPack.states['exploration'];
      if (!stateDef) return;

      // Ambience transition
      if (stateDef.ambience && this.activeAudioPack.ambience) {
        const ambDef = this.activeAudioPack.ambience[stateDef.ambience];
        if (ambDef && typeof ambDef.start === 'function') {
          if (this.activeAmbienceHandle && typeof this.activeAmbienceHandle.stop === 'function') {
            this.activeAmbienceHandle.stop();
          }
          this.initContext();
          this.activeAmbienceHandle = ambDef.start(this.synthesizer, this.audioCtx, this.channels);
        }
      }

      // Music transition
      if (stateDef.music && this.activeAudioPack.music) {
        const musicDef = this.activeAudioPack.music[stateDef.music];
        if (musicDef && typeof musicDef.play === 'function') {
          this.initContext();
          musicDef.play(this.synthesizer, this.audioCtx, this.channels);
        }
      }
    }

    /**
     * Coordinates Voice & Character Talking Animation.
     * Synchronizes audio playback with speaker mouth movement and emotion.
     */
    playVoice(dialogueNode, speakerEntity = null, onEnd = null) {
      if (!dialogueNode) return;

      // Set speaker entity to talking animation
      if (speakerEntity) {
        speakerEntity.isTalking = true;
      }

      const finishVoice = () => {
        if (speakerEntity) {
          speakerEntity.isTalking = false;
        }
        if (onEnd) onEnd();
      };

      // 1. If dialogueNode specifies a real voice audio asset URL
      if (dialogueNode.voiceUrl && this.soundEnabled) {
        try {
          const audio = new Audio(dialogueNode.voiceUrl);
          audio.volume = this.channels.voice ? this.channels.voice.gain.value : 1.0;
          audio.onended = finishVoice;
          audio.onerror = () => {
            // Fallback to speech synthesis
            this._speakWithTTS(dialogueNode, finishVoice);
          };
          audio.play();
          return;
        } catch (e) {}
      }

      // 2. Fallback to Web Speech API with emotion-tuned pitch & rate
      this._speakWithTTS(dialogueNode, finishVoice);
    }

    _speakWithTTS(dialogueNode, onEnd) {
      const text = dialogueNode.text || '';
      if (!text) {
        if (onEnd) onEnd();
        return;
      }

      // Read voice profile from AudioPack or dialogueNode
      let pitch = dialogueNode.pitch || 1.0;
      let rate = dialogueNode.rate || 0.92;
      let gender = dialogueNode.gender || 'neutral';

      if (this.activeAudioPack && this.activeAudioPack.characters && dialogueNode.character) {
        const charDef = this.activeAudioPack.characters[dialogueNode.character];
        if (charDef && charDef.voice) {
          pitch = charDef.voice.pitch || pitch;
          rate = charDef.voice.rate || rate;
          gender = charDef.voice.gender || gender;
        }
      }

      // Emotion tuning
      if (dialogueNode.emotion === 'panic' || dialogueNode.emotion === 'urgency') {
        pitch *= 1.2;
        rate *= 1.25;
      } else if (dialogueNode.emotion === 'calm' || dialogueNode.emotion === 'wise') {
        pitch *= 0.88;
        rate *= 0.88;
      }

      if (root.StoryBridge && root.StoryBridge.speak) {
        root.StoryBridge.speak(text, {
          pitch,
          rate,
          gender,
          onEnd
        });
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.pitch = pitch;
        utt.rate = rate;
        utt.onend = onEnd;
        utt.onerror = onEnd;
        window.speechSynthesis.speak(utt);
      } else {
        if (onEnd) onEnd();
      }
    }

    /**
     * Master audio toggle (Mute / Unmute).
     */
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      if (this.channels.master && this.audioCtx) {
        const now = this.audioCtx.currentTime;
        this.channels.master.gain.setValueAtTime(this.soundEnabled ? 1.0 : 0.0, now);
      }
      return this.soundEnabled;
    }
  }

  // Export Singleton Engine Instance
  root.StoryAudioEngine = new StoryAudioEngine();

})(window);
