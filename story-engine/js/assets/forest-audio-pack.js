/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — FOREST AUDIO PACK (v1.0)
 * 
 * Concrete AudioPack for "The Forest Clearing" & "The Sunny Meadow":
 * - Story-Specific Ambience: Forest breeze, birdsong warbles, pond murmur
 * - Dynamic States: exploration, quest_active, victory
 * - Character Audio: Explorer surface-aware footsteps, Forest Ranger voice profile
 * - Object Sounds: Ornate Golden Key pickup arpeggio, Ancient Gate heavy stone rumble
 * - Event-to-Sound mappings (PLAYER_FOOTSTEP, ITEM_PICKED_UP, DOOR_UNLOCKED, QUEST_COMPLETED)
 * Zero hard-coding in the engine core.
 * ============================================================================
 */

(function(root) {
  'use strict';

  const ForestAudioPack = {
    id: 'forest_audio_pack',
    name: 'Ancient Forest Audio Pack',
    author: 'Adventure Academy',
    defaultState: 'exploration',

    // =======================================================================
    // 1. DYNAMIC AUDIO STATES
    // =======================================================================
    states: {
      exploration: {
        ambience: 'forest_day',
        music: 'exploration_theme'
      },
      quest_active: {
        ambience: 'forest_day',
        music: 'curiosity_motif'
      },
      victory: {
        ambience: 'meadow_sun',
        music: 'victory_fanfare'
      }
    },

    // =======================================================================
    // 2. AMBIENCE DEFINITIONS
    // =======================================================================
    ambience: {
      forest_day: {
        start(synth, ctx, channels) {
          if (!ctx) return null;
          let isRunning = true;
          let birdTimer = null;
          let breezeSource = null;

          try {
            // Soft woodland breeze noise filter
            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              b0 = 0.99 * b0 + white * 0.05;
              b1 = 0.96 * b1 + white * 0.11;
              b2 = 0.86 * b2 + white * 0.25;
              output[i] = (b0 + b1 + b2) * 0.12;
            }

            breezeSource = ctx.createBufferSource();
            breezeSource.buffer = noiseBuffer;
            breezeSource.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, ctx.currentTime);

            breezeSource.connect(filter);
            filter.connect(channels.ambience);
            breezeSource.start();

            // Intermittent bird calls
            const scheduleBird = () => {
              if (!isRunning) return;
              const delay = 3500 + Math.random() * 5000;
              birdTimer = setTimeout(() => {
                if (synth) synth.synthBirdChirp(2100 + Math.random() * 600, 0.035);
                scheduleBird();
              }, delay);
            };
            scheduleBird();
          } catch (e) {}

          return {
            stop() {
              isRunning = false;
              if (birdTimer) clearTimeout(birdTimer);
              if (breezeSource) {
                try { breezeSource.stop(); } catch (e) {}
              }
            }
          };
        }
      },

      meadow_sun: {
        start(synth, ctx, channels) {
          if (!ctx) return null;
          return {
            stop() {}
          };
        }
      }
    },

    // =======================================================================
    // 3. MUSIC MOTIFS & STINGERS
    // =======================================================================
    music: {
      exploration_theme: {
        play(synth, ctx, channels) {
          // Gentle woodland intro chime
          if (synth) synth.synthArpeggio([523, 659, 784], 0.12, 'sine', 0.4, 0.04);
        }
      },
      curiosity_motif: {
        play(synth, ctx, channels) {
          if (synth) synth.synthArpeggio([587, 740, 880], 0.1, 'triangle', 0.35, 0.05);
        }
      },
      victory_fanfare: {
        play(synth, ctx, channels) {
          if (synth) {
            synth.synthArpeggio([523.25, 659.25, 783.99, 1046.50], 0.08, 'triangle', 0.5, 0.1);
          }
        }
      }
    },

    // =======================================================================
    // 4. CHARACTERS AUDIO PROFILES
    // =======================================================================
    characters: {
      explorer: {
        footsteps: {
          dirt: (synth) => synth.synthFootstep('dirt', 0.04),
          grass: (synth) => synth.synthFootstep('grass', 0.035),
          stone: (synth) => synth.synthFootstep('stone', 0.06)
        },
        celebrate: (synth) => {
          synth.synthArpeggio([523, 659, 784, 1046], 0.05, 'sine', 0.3, 0.08);
        }
      },
      ranger: {
        voice: {
          gender: 'male',
          pitch: 0.88,
          rate: 0.92,
          emotion: 'wise'
        },
        tapStaff: (synth) => synth.synthFootstep('wood', 0.06)
      }
    },

    // =======================================================================
    // 5. OBJECTS AUDIO PROFILES
    // =======================================================================
    objects: {
      golden_key: {
        pickup: (synth) => {
          synth.synthArpeggio([523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98], 0.05, 'triangle', 0.35, 0.08);
        }
      },
      ancient_gate: {
        unlock: (synth) => {
          synth.synthArpeggio([440, 554, 659], 0.06, 'triangle', 0.25, 0.06);
        },
        open: (synth) => {
          synth.synthRumble(65, 45, 0.65, 0.12);
        }
      }
    },

    // =======================================================================
    // 6. EVENT-TO-SOUND ROUTER
    // =======================================================================
    events: {
      PLAYER_FOOTSTEP(payload, pack, engine) {
        const surface = payload.surface || 'dirt';
        const char = pack.characters.explorer;
        if (char && char.footsteps && char.footsteps[surface]) {
          char.footsteps[surface](engine.synthesizer);
        } else if (engine.synthesizer) {
          engine.synthesizer.synthFootstep('dirt', 0.04);
        }
      },

      ITEM_PICKED_UP(payload, pack, engine) {
        if (payload.itemId === 'golden_key' && pack.objects.golden_key) {
          pack.objects.golden_key.pickup(engine.synthesizer);
        }
      },

      DOOR_UNLOCKED(payload, pack, engine) {
        if (pack.objects.ancient_gate) {
          pack.objects.ancient_gate.unlock(engine.synthesizer);
          pack.objects.ancient_gate.open(engine.synthesizer);
        }
      },

      QUEST_STARTED(payload, pack, engine) {
        engine.setState('quest_active');
      },

      QUEST_COMPLETED(payload, pack, engine) {
        engine.setState('victory');
        if (pack.music.victory_fanfare) {
          pack.music.victory_fanfare.play(engine.synthesizer, engine.audioCtx, engine.channels);
        }
      },

      AREA_ENTERED(payload, pack, engine) {
        if (payload.areaId === 'sunny_meadow') {
          engine.setState('victory');
        } else {
          engine.setState('exploration');
        }
      }
    }
  };

  // Export to global namespace
  root.ForestAudioPack = ForestAudioPack;

})(window);
