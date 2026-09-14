/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — AUDIO ENGINE CORE (v2.0)
 * 
 * Generic, Story-Agnostic Professional Audio Architecture:
 * - 5-Channel Master Mixer (Master, Music, Ambience, SFX, Voice) with Gain Staging
 * - Priority Voice Ducking (-8dB music ducking during dialogue speech)
 * - Dynamic Audio State Coordinator (exploration, quest_active, victory, chase)
 * - Seamless Dynamic Music Cross-Fading (2.0s linear/exponential cross-fade)
 * - Sound Variation System (Randomized pools without consecutive repeats)
 * - 2D Spatial Audio Engine (Distance attenuation + Stereo Panning)
 * - Multi-Layer Environmental Ambience Coordinator
 * - Native AudioBuffer decoding & asset caching with procedural fallbacks
 * - Real-Time Audio Diagnostics for Developer Debug Panel
 * - Pluggable AudioPack system (Zero narrative audio hard-coded into engine)
 * ============================================================================
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL SOUND SYNTHESIZER (Fallback & Dynamic Procedural Effects)
  // =========================================================================
  class SoundSynthesizer {
    constructor(audioCtx, channels) {
      this.ctx = audioCtx;
      this.channels = channels;
    }

    synthFootstep(surface = 'dirt', volume = 0.05) {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        let baseFreq = 100;
        let endFreq = 40;
        let duration = 0.05;

        if (surface === 'grass') {
          baseFreq = 140;
          endFreq = 50;
          duration = 0.04;
        } else if (surface === 'stone') {
          baseFreq = 240;
          endFreq = 90;
          duration = 0.035;
        } else if (surface === 'wood') {
          baseFreq = 180;
          endFreq = 70;
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
  // 2. STORY AUDIO ENGINE (Core Architecture v2.0)
  // =========================================================================
  class StoryAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.soundEnabled = true;
      this.activeAudioPack = null;
      this.currentState = 'exploration'; // 'exploration' | 'quest_active' | 'victory' | 'chase'

      // Master 5-Channel Mixer Gain Levels
      this.channelLevels = {
        master: 1.0,
        music: 0.38,
        ambience: 0.32,
        sfx: 0.75,
        voice: 0.95
      };

      this.channels = {
        master: null,
        music: null,
        ambience: null,
        sfx: null,
        voice: null
      };

      this.synthesizer = null;
      this.bufferCache = new Map(); // url -> AudioBuffer
      this.variationPools = new Map(); // poolName -> { items: [], lastIndex: -1 }
      this.spatialEmitters = new Map(); // id -> { x, y, maxDistance, source, gainNode, pannerNode, isLooping }
      
      this.listener = { x: 0, y: 0 };
      this.activeAmbienceHandles = [];
      this.activeMusic = {
        name: null,
        source: null,
        gainNode: null
      };

      this.lastSfx = { name: 'None', variation: '', timestamp: 0 };
      this.isDucked = false;
      this.eventBus = null;
    }

    /**
     * Initializes the Web Audio Context, 5-Channel Mixer, and unlock listeners.
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

      // 1. Master Channel
      const master = ctx.createGain();
      master.gain.setValueAtTime(this.soundEnabled ? this.channelLevels.master : 0.0, ctx.currentTime);
      master.connect(ctx.destination);

      // 2. Sub-Channels
      const music = ctx.createGain();
      music.gain.setValueAtTime(this.channelLevels.music, ctx.currentTime);
      music.connect(master);

      const ambience = ctx.createGain();
      ambience.gain.setValueAtTime(this.channelLevels.ambience, ctx.currentTime);
      ambience.connect(master);

      const sfx = ctx.createGain();
      sfx.gain.setValueAtTime(this.channelLevels.sfx, ctx.currentTime);
      sfx.connect(master);

      const voice = ctx.createGain();
      voice.gain.setValueAtTime(this.channelLevels.voice, ctx.currentTime);
      voice.connect(master);

      this.channels = { master, music, ambience, sfx, voice };
      this.synthesizer = new SoundSynthesizer(ctx, this.channels);

      console.log('[StoryAudioEngine] Initialized 5-channel audio mixer (44.1kHz).');
      return this.audioCtx;
    }

    // =========================================================================
    // ASSET LOADING & AUDIO BUFFER MANAGEMENT
    // =========================================================================

    /**
     * Asynchronously fetches and decodes an audio file into an AudioBuffer.
     */
    async loadBuffer(url) {
      if (!url) return null;
      if (this.bufferCache.has(url)) {
        return this.bufferCache.get(url);
      }

      this.initContext();
      if (!this.audioCtx) return null;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status} loading ${url}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(url, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`[StoryAudioEngine] Could not load audio buffer for "${url}":`, err.message);
        return null;
      }
    }

    /**
     * Preloads an array of audio file URLs in parallel.
     */
    async preloadAssets(urls = []) {
      const promises = urls.map(u => this.loadBuffer(u));
      return Promise.all(promises);
    }

    // =========================================================================
    // AUDIO VARIATION SYSTEM
    // =========================================================================

    /**
     * Registers a sound variation pool (array of audio file URLs or fallback functions).
     */
    registerVariationPool(poolName, items = []) {
      if (!poolName || !items || items.length === 0) return;
      this.variationPools.set(poolName, {
        items: items,
        lastIndex: -1
      });
    }

    /**
     * Plays a sound from a variation pool, guaranteeing no consecutive repeats.
     */
    async playVariation(poolName, options = {}) {
      if (!this.soundEnabled) return;
      this.initContext();

      const pool = this.variationPools.get(poolName);
      if (!pool || pool.items.length === 0) return;

      let idx = 0;
      if (pool.items.length > 1) {
        do {
          idx = Math.floor(Math.random() * pool.items.length);
        } while (idx === pool.lastIndex);
      }
      pool.lastIndex = idx;
      const item = pool.items[idx];

      this.lastSfx = {
        name: poolName,
        variation: `[${idx + 1}/${pool.items.length}]`,
        timestamp: Date.now()
      };

      // 1. If item is an audio asset URL string
      if (typeof item === 'string') {
        const volume = options.volume !== undefined ? options.volume : 1.0;
        const channelName = options.channel || 'sfx';
        return this.playBufferSound(item, channelName, { ...options, volume });
      }

      // 2. If item is a procedural sound generator function
      if (typeof item === 'function') {
        try {
          item(this.synthesizer, this.audioCtx, this.channels);
        } catch (e) {}
      }
    }

    /**
     * Plays an audio buffer on a target mixer channel with options.
     */
    async playBufferSound(url, channelName = 'sfx', options = {}) {
      if (!this.soundEnabled) return null;
      const buffer = await this.loadBuffer(url);
      if (!buffer || !this.audioCtx) return null;

      try {
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;

        const gainNode = this.audioCtx.createGain();
        const baseVol = options.volume !== undefined ? options.volume : 1.0;
        gainNode.gain.setValueAtTime(baseVol, this.audioCtx.currentTime);

        const targetChannel = this.channels[channelName] || this.channels.sfx;

        // Panning support
        if (options.pan !== undefined && this.audioCtx.createStereoPanner) {
          const panner = this.audioCtx.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-1, Math.min(1, options.pan)), this.audioCtx.currentTime);
          source.connect(gainNode);
          gainNode.connect(panner);
          panner.connect(targetChannel);
        } else {
          source.connect(gainNode);
          gainNode.connect(targetChannel);
        }

        source.loop = !!options.loop;
        source.start(0);
        return { source, gainNode };
      } catch (e) {
        console.warn(`[StoryAudioEngine] Playback error for "${url}":`, e);
        return null;
      }
    }

    // =========================================================================
    // 2D SPATIAL AUDIO SYSTEM
    // =========================================================================

    /**
     * Updates listener position in the 2D game world (typically player X, Y).
     */
    updateListener(x, y) {
      this.listener.x = x;
      this.listener.y = y;

      // Update active looping spatial emitters
      for (const [id, emitter] of this.spatialEmitters.entries()) {
        if (!emitter.isLooping || !emitter.gainNode) continue;
        const dx = emitter.x - x;
        const dy = emitter.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = emitter.maxDistance || 600;

        // Distance attenuation
        const normDist = Math.max(0, Math.min(1, dist / maxDist));
        const gain = (1.0 - normDist) * (emitter.baseVolume || 1.0);
        const now = this.audioCtx ? this.audioCtx.currentTime : 0;
        emitter.gainNode.gain.setValueAtTime(gain, now);

        // Stereo panning (-1 left, +1 right)
        if (emitter.pannerNode) {
          const pan = Math.max(-1, Math.min(1, dx / maxDist));
          emitter.pannerNode.pan.setValueAtTime(pan, now);
        }
      }
    }

    /**
     * Plays a 2D spatialized one-shot sound.
     */
    async playSpatial(assetOrPool, sourceX, sourceY, maxDistance = 650, options = {}) {
      if (!this.soundEnabled) return;
      const dx = sourceX - this.listener.x;
      const dy = sourceY - this.listener.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > maxDistance) return; // Outside audible horizon

      const normDist = dist / maxDistance;
      const distGain = Math.max(0, 1.0 - normDist);
      const pan = Math.max(-1, Math.min(1, dx / maxDistance));
      const finalVolume = (options.volume !== undefined ? options.volume : 1.0) * distGain;

      if (finalVolume <= 0.01) return;

      if (typeof assetOrPool === 'string' && this.variationPools.has(assetOrPool)) {
        return this.playVariation(assetOrPool, { ...options, volume: finalVolume, pan });
      } else if (typeof assetOrPool === 'string') {
        return this.playBufferSound(assetOrPool, options.channel || 'sfx', { ...options, volume: finalVolume, pan });
      } else if (typeof assetOrPool === 'function') {
        assetOrPool(this.synthesizer, this.audioCtx, this.channels, { volume: finalVolume, pan });
      }
    }

    /**
     * Registers and starts a looping 2D spatial audio emitter (e.g. river stream, ancient portal).
     */
    async registerSpatialEmitter(id, config = {}) {
      if (this.spatialEmitters.has(id)) {
        this.stopSpatialEmitter(id);
      }

      const { x, y, maxDistance = 600, assetUrl, volume = 0.5, channel = 'ambience' } = config;
      const buffer = await this.loadBuffer(assetUrl);
      if (!buffer || !this.audioCtx) return;

      try {
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gainNode = this.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);

        let pannerNode = null;
        if (this.audioCtx.createStereoPanner) {
          pannerNode = this.audioCtx.createStereoPanner();
          source.connect(gainNode);
          gainNode.connect(pannerNode);
          pannerNode.connect(this.channels[channel] || this.channels.ambience);
        } else {
          source.connect(gainNode);
          gainNode.connect(this.channels[channel] || this.channels.ambience);
        }

        source.start(0);

        const emitter = {
          x,
          y,
          maxDistance,
          baseVolume: volume,
          source,
          gainNode,
          pannerNode,
          isLooping: true
        };
        this.spatialEmitters.set(id, emitter);

        // Initial volume update based on current listener
        this.updateListener(this.listener.x, this.listener.y);
        return emitter;
      } catch (e) {
        console.warn(`[StoryAudioEngine] Failed to start spatial emitter "${id}":`, e);
      }
    }

    /**
     * Stops and removes a spatial audio emitter.
     */
    stopSpatialEmitter(id) {
      const emitter = this.spatialEmitters.get(id);
      if (emitter) {
        try {
          if (emitter.source) emitter.source.stop();
        } catch (e) {}
        this.spatialEmitters.delete(id);
      }
    }

    // =========================================================================
    // DYNAMIC MUSIC SYSTEM WITH SEAMLESS CROSS-FADING
    // =========================================================================

    /**
     * Plays a dynamic music track with smooth cross-fading over durationSec.
     */
    async playMusic(musicAssetUrl, durationSec = 2.0) {
      if (!this.soundEnabled || !musicAssetUrl) return;
      this.initContext();
      if (!this.audioCtx) return;

      const buffer = await this.loadBuffer(musicAssetUrl);
      if (!buffer) return;

      const now = this.audioCtx.currentTime;
      const targetGain = this.channelLevels.music;

      // 1. Cross-fade out old music track
      if (this.activeMusic.source && this.activeMusic.gainNode) {
        const oldGain = this.activeMusic.gainNode;
        const oldSource = this.activeMusic.source;
        try {
          oldGain.gain.setValueAtTime(oldGain.gain.value, now);
          oldGain.gain.linearRampToValueAtTime(0.001, now + durationSec);
          setTimeout(() => {
            try { oldSource.stop(); } catch (e) {}
          }, durationSec * 1000 + 100);
        } catch (e) {}
      }

      // 2. Start new music track fading in
      try {
        const newSource = this.audioCtx.createBufferSource();
        newSource.buffer = buffer;
        newSource.loop = true;

        const newGain = this.audioCtx.createGain();
        newGain.gain.setValueAtTime(0.001, now);
        newGain.gain.linearRampToValueAtTime(targetGain, now + durationSec);

        newSource.connect(newGain);
        newGain.connect(this.channels.music);
        newSource.start(0);

        this.activeMusic = {
          name: musicAssetUrl.split('/').pop().replace('.wav', ''),
          source: newSource,
          gainNode: newGain
        };
      } catch (e) {
        console.warn('[StoryAudioEngine] Music playback error:', e);
      }
    }

    // =========================================================================
    // 5-CHANNEL MIXER & PRIORITY VOICE DUCKING
    // =========================================================================

    /**
     * Automatically ducks the music channel during voice dialogue.
     */
    startDucking(duckVolume = 0.12, fadeTime = 0.3) {
      if (!this.audioCtx || !this.channels.music || this.isDucked) return;
      this.isDucked = true;
      const now = this.audioCtx.currentTime;
      this.channels.music.gain.cancelScheduledValues(now);
      this.channels.music.gain.setValueAtTime(this.channels.music.gain.value, now);
      this.channels.music.gain.linearRampToValueAtTime(duckVolume, now + fadeTime);
    }

    /**
     * Restores music channel volume after dialogue finishes.
     */
    stopDucking(restoreTime = 0.8) {
      if (!this.audioCtx || !this.channels.music || !this.isDucked) return;
      this.isDucked = false;
      const now = this.audioCtx.currentTime;
      this.channels.music.gain.cancelScheduledValues(now);
      this.channels.music.gain.setValueAtTime(this.channels.music.gain.value, now);
      this.channels.music.gain.linearRampToValueAtTime(this.channelLevels.music, now + restoreTime);
    }

    /**
     * Sets volume for a specific mixer channel (0.0 to 1.0).
     */
    setChannelVolume(channelName, volume) {
      const vol = Math.max(0, Math.min(1, volume));
      this.channelLevels[channelName] = vol;
      if (this.channels[channelName] && this.audioCtx) {
        const now = this.audioCtx.currentTime;
        this.channels[channelName].gain.setValueAtTime(vol, now);
      }
    }

    // =========================================================================
    // VOICE & DIALOGUE SYNCHRONIZATION
    // =========================================================================

    /**
     * Coordinates Voice Audio Playback, Music Ducking & Character Mouth Movement.
     */
    playVoice(dialogueNode, speakerEntity = null, onEnd = null) {
      if (!dialogueNode) return;

      if (speakerEntity) {
        speakerEntity.isTalking = true;
      }

      // Priority music ducking
      this.startDucking(0.12, 0.3);

      const finishVoice = () => {
        if (speakerEntity) {
          speakerEntity.isTalking = false;
        }
        this.stopDucking(0.8);
        if (onEnd) onEnd();
      };

      // 1. Check if dialogueNode specifies an audio asset URL
      if (dialogueNode.voiceUrl && this.soundEnabled) {
        try {
          const audio = new Audio(dialogueNode.voiceUrl);
          audio.volume = this.channelLevels.voice;
          audio.onended = finishVoice;
          audio.onerror = () => {
            this._speakWithTTS(dialogueNode, finishVoice);
          };
          audio.play().catch(() => {
            this._speakWithTTS(dialogueNode, finishVoice);
          });
          return;
        } catch (e) {}
      }

      // 2. Fallback to Web Speech API with emotion tuning
      this._speakWithTTS(dialogueNode, finishVoice);
    }

    _speakWithTTS(dialogueNode, onEnd) {
      const text = dialogueNode.text || '';
      if (!text) {
        if (onEnd) onEnd();
        return;
      }

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

    // =========================================================================
    // AUDIOPACK LOADER & STATE COORDINATOR
    // =========================================================================

    /**
     * Loads a concrete story AudioPack (e.g. ForestAudioPack, future AliceAudioPack).
     */
    loadAudioPack(audioPack) {
      if (!audioPack) return;
      this.activeAudioPack = audioPack;
      console.log(`[StoryAudioEngine] Loaded AudioPack: "${audioPack.name || audioPack.id}"`);

      this.initContext();

      // Register variations defined in AudioPack
      if (audioPack.variations) {
        for (const [poolName, items] of Object.entries(audioPack.variations)) {
          this.registerVariationPool(poolName, items);
        }
      }

      // Preload assets if pack specifies asset list
      if (audioPack.preloadList) {
        this.preloadAssets(audioPack.preloadList);
      }

      // Initial state
      this.setState(audioPack.defaultState || 'exploration');
    }

    /**
     * Transitions the engine to a new dynamic state ('exploration', 'quest_active', 'victory').
     */
    setState(newState, transitionDuration = 2.0) {
      this.currentState = newState;
      if (!this.activeAudioPack || !this.activeAudioPack.states) return;

      const stateDef = this.activeAudioPack.states[newState] || this.activeAudioPack.states['exploration'];
      if (!stateDef) return;

      this.initContext();

      // 1. Ambience transition
      if (stateDef.ambience && this.activeAudioPack.ambience) {
        const ambDef = this.activeAudioPack.ambience[stateDef.ambience];
        if (ambDef && typeof ambDef.start === 'function') {
          // Stop previous ambient handles
          this.activeAmbienceHandles.forEach(h => {
            try { if (h && typeof h.stop === 'function') h.stop(); } catch (e) {}
          });
          this.activeAmbienceHandles = [];

          const handle = ambDef.start(this, this.synthesizer, this.audioCtx, this.channels);
          if (handle) this.activeAmbienceHandles.push(handle);
        }
      }

      // 2. Music transition with smooth cross-fade
      if (stateDef.music && this.activeAudioPack.music) {
        const musicDef = this.activeAudioPack.music[stateDef.music];
        if (musicDef) {
          if (musicDef.url) {
            this.playMusic(musicDef.url, transitionDuration);
          } else if (typeof musicDef.play === 'function') {
            musicDef.play(this.synthesizer, this.audioCtx, this.channels);
          }
        }
      }
    }

    /**
     * Binds engine to global EventBus.
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
     * Routes game events to the active AudioPack.
     */
    handleEvent(eventName, payload = {}) {
      if (!this.soundEnabled || !this.activeAudioPack) return;
      this.initContext();

      // 1. AudioPack specific event handler
      if (this.activeAudioPack.events && typeof this.activeAudioPack.events[eventName] === 'function') {
        try {
          this.activeAudioPack.events[eventName](payload, this.activeAudioPack, this);
        } catch (e) {
          console.warn(`[StoryAudioEngine] Error handling event "${eventName}":`, e);
        }
      }

      // 2. Built-in Dynamic State Transitions
      if (eventName === 'CHASE_STARTED') {
        this.setState('chase');
      } else if (eventName === 'CHASE_ENDED') {
        this.setState('exploration');
      } else if (eventName === 'QUEST_COMPLETED') {
        this.setState('victory');
      }
    }

    /**
     * Master audio toggle (Mute / Unmute).
     */
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      if (this.channels.master && this.audioCtx) {
        const now = this.audioCtx.currentTime;
        this.channels.master.gain.setValueAtTime(this.soundEnabled ? this.channelLevels.master : 0.0, now);
      }
      return this.soundEnabled;
    }

    // =========================================================================
    // DEVELOPER DIAGNOSTICS
    // =========================================================================

    /**
     * Returns live telemetry for the Developer Debug Panel.
     */
    getDiagnostics() {
      return {
        soundEnabled: this.soundEnabled,
        currentState: this.currentState,
        activeMusic: this.activeMusic.name || 'None',
        activeAmbience: this.activeAmbienceHandles.length > 0 ? 'Active (Multi-Layer)' : 'None',
        lastSfx: this.lastSfx,
        listener: { x: Math.round(this.listener.x), y: Math.round(this.listener.y) },
        spatialEmittersCount: this.spatialEmitters.size,
        channelVolumes: {
          master: Math.round(this.channelLevels.master * 100),
          music: Math.round(this.channelLevels.music * 100),
          ambience: Math.round(this.channelLevels.ambience * 100),
          sfx: Math.round(this.channelLevels.sfx * 100),
          voice: Math.round(this.channelLevels.voice * 100)
        }
      };
    }
  }

  // Export Singleton Engine Instance
  root.StoryAudioEngine = new StoryAudioEngine();

})(window);
