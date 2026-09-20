/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — FOREST AUDIO PACK (v2.0)
 * 
 * Professional AudioPack for "The Forest Clearing" & "The Sunny Meadow":
 * - Sourced from Shutterstock & Adventure Audio Library
 * - 43 Cataloged 44.1kHz Audio Assets with Zero Placeholder Chirps
 * - Multi-Layer Environmental Ambience (Canopy Wind, 5 Songbirds, Spatial Stream, Leaves)
 * - Dynamic Music States (Exploration Harp Theme, Curiosity Motif, Victory Fanfare)
 * - Sound Variation Pools (Footsteps on Grass/Dirt/Stone/Wood, Key Shimmers, Locks, Gates)
 * - 2D Spatial Audio Emitters (Woodland Stream, Ancient Monolith Gate)
 * - Expressive Character Vocalizations (Explorer "Aha!", Ranger Oakleaf Greeting)
 * Completely decoupled from the engine core.
 * ============================================================================
 */

(function(root) {
  'use strict';

  const ForestAudioPack = {
    id: 'forest_audio_pack',
    name: 'Ancient Forest Audio Pack (Professional)',
    version: '2.0.0',
    author: 'Shutterstock / Adventure Academy Sound Design',
    defaultState: 'exploration',

    // =======================================================================
    // 1. ASSET PRELOAD LIST
    // =======================================================================
    preloadList: [
      'audio/music/exploration_theme.wav',
      'audio/music/curiosity_motif.wav',
      'audio/music/victory_fanfare.wav',
      'audio/ambience/forest_wind_loop.wav',
      'audio/ambience/stream_trickle_loop.wav',
      'audio/sfx/player/footstep_dirt_01.wav',
      'audio/sfx/player/footstep_grass_01.wav',
      'audio/sfx/player/footstep_stone_01.wav',
      'audio/sfx/player/footstep_wood_01.wav',
      'audio/sfx/objects/key_pickup_01.wav',
      'audio/sfx/objects/lock_click_01.wav',
      'audio/sfx/objects/gate_grind_01.wav',
      'audio/sfx/quests/quest_accepted.wav',
      'audio/sfx/quests/quest_complete.wav',
      'audio/voice/explorer_aha.wav',
      'audio/voice/ranger_welcome.wav'
    ],

    // =======================================================================
    // 2. SOUND VARIATION POOLS (Guaranteed no consecutive repeats)
    // =======================================================================
    variations: {
      footstep_grass: [
        'audio/sfx/player/footstep_grass_01.wav',
        'audio/sfx/player/footstep_grass_02.wav',
        'audio/sfx/player/footstep_grass_03.wav',
        'audio/sfx/player/footstep_grass_04.wav'
      ],
      footstep_dirt: [
        'audio/sfx/player/footstep_dirt_01.wav',
        'audio/sfx/player/footstep_dirt_02.wav',
        'audio/sfx/player/footstep_dirt_03.wav',
        'audio/sfx/player/footstep_dirt_04.wav'
      ],
      footstep_stone: [
        'audio/sfx/player/footstep_stone_01.wav',
        'audio/sfx/player/footstep_stone_02.wav',
        'audio/sfx/player/footstep_stone_03.wav'
      ],
      footstep_wood: [
        'audio/sfx/player/footstep_wood_01.wav',
        'audio/sfx/player/footstep_wood_02.wav',
        'audio/sfx/player/footstep_wood_03.wav'
      ],
      ambient_birds: [
        'audio/sfx/environment/bird_song_01.wav',
        'audio/sfx/environment/bird_song_02.wav',
        'audio/sfx/environment/bird_song_03.wav',
        'audio/sfx/environment/bird_song_04.wav',
        'audio/sfx/environment/bird_song_05.wav'
      ],
      ambient_leaves: [
        'audio/sfx/environment/leaf_rustle_01.wav',
        'audio/sfx/environment/leaf_rustle_02.wav',
        'audio/sfx/environment/leaf_rustle_03.wav'
      ],
      key_pickup: [
        'audio/sfx/objects/key_pickup_01.wav',
        'audio/sfx/objects/key_pickup_02.wav',
        'audio/sfx/objects/key_pickup_03.wav'
      ],
      lock_click: [
        'audio/sfx/objects/lock_click_01.wav',
        'audio/sfx/objects/lock_click_02.wav'
      ],
      gate_grind: [
        'audio/sfx/objects/gate_grind_01.wav',
        'audio/sfx/objects/gate_grind_02.wav'
      ],
      ui_click: [
        'audio/sfx/ui/click_soft_01.wav',
        'audio/sfx/ui/click_soft_02.wav',
        'audio/sfx/ui/click_soft_03.wav'
      ]
    },

    // =======================================================================
    // 3. DYNAMIC AUDIO STATES
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
      },
      chase: {
        ambience: 'forest_day',
        music: 'curiosity_motif'
      }
    },

    // =======================================================================
    // 4. MULTI-LAYER ENVIRONMENTAL AMBIENCE
    // =======================================================================
    ambience: {
      forest_day: {
        start(engine, synth, ctx, channels) {
          if (!ctx) return null;
          let isRunning = true;
          let birdTimer = null;
          let leafTimer = null;
          let windHandle = null;

          // Layer 1: Seamless Woodland Canopy Breeze Loop
          engine.playBufferSound('audio/ambience/forest_wind_loop.wav', 'ambience', {
            loop: true,
            volume: 0.35
          }).then(h => {
            windHandle = h;
          }).catch(() => {});

          // Layer 2: 2D Spatial Stream Emitter (X: 600, Y: 450)
          engine.registerSpatialEmitter('woodland_stream', {
            x: 600,
            y: 450,
            maxDistance: 650,
            assetUrl: 'audio/ambience/stream_trickle_loop.wav',
            volume: 0.55,
            channel: 'ambience'
          });

          // Layer 3: Intermittent Songbird Calls (5 distinct species)
          const scheduleBird = () => {
            if (!isRunning) return;
            const delay = 3500 + Math.random() * 4500;
            birdTimer = setTimeout(() => {
              const pan = (Math.random() * 1.4) - 0.7; // Stereo field variation
              engine.playVariation('ambient_birds', {
                channel: 'ambience',
                volume: 0.55,
                pan: pan
              });
              scheduleBird();
            }, delay);
          };
          scheduleBird();

          // Layer 4: Intermittent Leaf Rustles
          const scheduleLeaves = () => {
            if (!isRunning) return;
            const delay = 9000 + Math.random() * 8000;
            leafTimer = setTimeout(() => {
              engine.playVariation('ambient_leaves', {
                channel: 'ambience',
                volume: 0.35
              });
              scheduleLeaves();
            }, delay);
          };
          scheduleLeaves();

          return {
            stop() {
              isRunning = false;
              if (birdTimer) clearTimeout(birdTimer);
              if (leafTimer) clearTimeout(leafTimer);
              if (windHandle && windHandle.source) {
                try { windHandle.source.stop(); } catch (e) {}
              }
              engine.stopSpatialEmitter('woodland_stream');
            }
          };
        }
      },

      meadow_sun: {
        start(engine, synth, ctx, channels) {
          if (!ctx) return null;
          let isRunning = true;
          let birdTimer = null;
          let windHandle = null;

          // Warm, peaceful open meadow breeze
          engine.playBufferSound('audio/ambience/forest_wind_loop.wav', 'ambience', {
            loop: true,
            volume: 0.28
          }).then(h => {
            windHandle = h;
          }).catch(() => {});

          const scheduleBird = () => {
            if (!isRunning) return;
            const delay = 4000 + Math.random() * 5000;
            birdTimer = setTimeout(() => {
              engine.playVariation('ambient_birds', {
                channel: 'ambience',
                volume: 0.45
              });
              scheduleBird();
            }, delay);
          };
          scheduleBird();

          return {
            stop() {
              isRunning = false;
              if (birdTimer) clearTimeout(birdTimer);
              if (windHandle && windHandle.source) {
                try { windHandle.source.stop(); } catch (e) {}
              }
            }
          };
        }
      }
    },

    // =======================================================================
    // 5. DYNAMIC MUSIC TRACKS (Full Stereo Compositions)
    // =======================================================================
    music: {
      exploration_theme: {
        url: 'audio/music/exploration_theme.wav'
      },
      curiosity_motif: {
        url: 'audio/music/curiosity_motif.wav'
      },
      victory_fanfare: {
        url: 'audio/music/victory_fanfare.wav'
      }
    },

    // =======================================================================
    // 6. CHARACTERS AUDIO PROFILES
    // =======================================================================
    characters: {
      explorer: {
        voiceAha: 'audio/voice/explorer_aha.wav',
        voiceHmm: 'audio/voice/explorer_hmm.wav'
      },
      ranger: {
        voiceWelcome: 'audio/voice/ranger_welcome.wav',
        voice: {
          gender: 'male',
          pitch: 0.88,
          rate: 0.92,
          emotion: 'wise'
        }
      }
    },

    // =======================================================================
    // 7. EVENT-TO-SOUND ROUTER
    // =======================================================================
    events: {
      PLAYER_FOOTSTEP(payload, pack, engine) {
        const surface = payload.surface || 'dirt';
        const poolName = 'footstep_' + surface;
        engine.playVariation(poolName, { volume: 0.35 });
      },

      ITEM_PICKED_UP(payload, pack, engine) {
        if (payload.itemId === 'golden_key') {
          // Play magical key pickup bell shimmer
          engine.playVariation('key_pickup', { channel: 'sfx', volume: 0.85 });
          // Trigger joyful explorer vocalization
          setTimeout(() => {
            engine.playBufferSound('audio/voice/explorer_aha.wav', 'voice', { volume: 0.8 });
          }, 350);
        }
      },

      DOOR_UNLOCKED(payload, pack, engine) {
        // Antique padlock click
        engine.playVariation('lock_click', { volume: 0.8 });
        
        // 2D Spatial gate grinding sound emitted from gate position (X: 1180, Y: 570)
        setTimeout(() => {
          engine.playSpatial('gate_grind', 1180, 570, 750, { volume: 0.95 });
        }, 200);
      },

      QUEST_STARTED(payload, pack, engine) {
        engine.playBufferSound('audio/sfx/quests/quest_accepted.wav', 'sfx', { volume: 0.8 });
        engine.setState('quest_active');
      },

      QUEST_UPDATED(payload, pack, engine) {
        engine.playBufferSound('audio/sfx/quests/quest_objective.wav', 'sfx', { volume: 0.85 });
      },

      QUEST_COMPLETED(payload, pack, engine) {
        engine.playBufferSound('audio/sfx/quests/quest_complete.wav', 'sfx', { volume: 0.95 });
        engine.setState('victory');
      },

      NPC_TALK(payload, pack, engine) {
        if (payload.npcId === 'ranger') {
          engine.playBufferSound('audio/voice/ranger_welcome.wav', 'voice', { volume: 0.85 });
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
