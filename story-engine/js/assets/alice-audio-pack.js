/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — ALICE IN WONDERLAND COMPLETE AUDIO PACK (v2.0)
 * 
 * Complete AudioPack for all 9 Chapters of Alice in Wonderland:
 * - Chapter 1: Rabbit Woods (Pastoral flute & harp, brisk chase, spatial watch tick)
 * - Chapter 2: Rabbit Hole (Rushing atmospheric wind, celestial chimes)
 * - Chapter 3: Hall of Doors & Tiny Door (Mysterious music box, size shrink & grow)
 * - Chapter 4: Mushroom Garden (Caterpillar smoky voice, hookah puff)
 * - Chapter 5: Tulgey Woods (Cheshire Cat purr, whimsical vanish chime)
 * - Chapter 6: Mad Tea Party (Lively 3/4 waltz, teacup clinks, Hatter greeting)
 * - Chapter 7: Queen's Croquet Ground (Regal baroque march, paintbrush, mallet hit)
 * - Chapter 8: Royal Courtroom (Courtroom pulse, gavel strike, Queen decree)
 * - Chapter 9: The Great Awakening (Tranquil morning harp, final fanfare)
 * 100% decoupled from the engine runtime.
 * ============================================================================
 */

(function(root) {
  'use strict';

  const AliceAudioPack = {
    id: 'alice_audio_pack',
    name: 'Alice in Wonderland: Complete Adventure Audio Pack',
    version: '2.0.0',
    author: 'Adventure Academy / Story Sound Studio',
    defaultState: 'exploration',

    // =======================================================================
    // 1. ASSET PRELOAD LIST
    // =======================================================================
    preloadList: [
      'audio/alice/alice_theme.wav',
      'audio/alice/rabbit_chase.wav',
      'audio/alice/wonderland_fanfare.wav',
      'audio/alice/rabbit_woods_ambience.wav',
      'audio/alice/watch_tick_loop.wav',
      'audio/alice/watch_pickup.wav',
      'audio/alice/rabbit_hole_hum.wav',
      'audio/alice/rabbit_voice_late.wav',
      'audio/alice/rabbit_voice_watch.wav',
      'audio/alice/rabbit_voice_thanks.wav',
      'audio/alice/rabbit_hop_01.wav',
      'audio/alice/rabbit_hop_02.wav',
      'audio/alice/falling_wind_loop.wav',
      'audio/alice/wonderland_ambient.wav',
      'audio/alice/size_shrink.wav',
      'audio/alice/size_grow.wav',
      'audio/alice/caterpillar_puff.wav',
      'audio/alice/caterpillar_voice.wav',
      'audio/alice/cheshire_voice.wav',
      'audio/alice/cheshire_cat_chime.wav',
      'audio/alice/tea_party_theme.wav',
      'audio/alice/teacup_clink.wav',
      'audio/alice/hatter_voice.wav',
      'audio/alice/croquet_garden_theme.wav',
      'audio/alice/paintbrush_stroke.wav',
      'audio/alice/croquet_hit.wav',
      'audio/alice/courtroom_tension.wav',
      'audio/alice/court_gavel.wav',
      'audio/alice/queen_voice_off_heads.wav',
      'audio/alice/awakening_theme.wav',
      'audio/sfx/player/footstep_grass_01.wav',
      'audio/sfx/player/footstep_dirt_01.wav',
      'audio/sfx/player/footstep_stone_01.wav',
      'audio/sfx/quests/quest_accepted.wav',
      'audio/sfx/quests/quest_complete.wav'
    ],

    // =======================================================================
    // 2. SOUND VARIATION POOLS
    // =======================================================================
    variations: {
      rabbit_hops: [
        'audio/alice/rabbit_hop_01.wav',
        'audio/alice/rabbit_hop_02.wav',
        'audio/alice/rabbit_hop_03.wav',
        'audio/alice/rabbit_hop_04.wav'
      ],
      teacup_clink: [
        'audio/alice/teacup_clink.wav'
      ],
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
        ambience: 'rabbit_woods',
        music: 'alice_theme'
      },
      chase: {
        ambience: 'rabbit_woods',
        music: 'rabbit_chase'
      },
      falling: {
        ambience: 'falling_wind',
        music: 'wonderland_ambient'
      },
      wonderland: {
        ambience: 'wonderland_ambient',
        music: 'wonderland_ambient'
      },
      mushroom_garden: {
        ambience: 'wonderland_ambient',
        music: 'alice_theme'
      },
      tea_party: {
        ambience: 'wonderland_ambient',
        music: 'tea_party_theme'
      },
      croquet_garden: {
        ambience: 'rabbit_woods',
        music: 'croquet_garden_theme'
      },
      courtroom: {
        ambience: 'courtroom_tension',
        music: 'courtroom_tension'
      },
      awakening: {
        ambience: 'rabbit_woods',
        music: 'awakening_theme'
      }
    },

    // =======================================================================
    // 4. MUSIC CUES
    // =======================================================================
    music: {
      alice_theme: {
        url: 'audio/alice/alice_theme.wav',
        loop: true,
        volume: 0.55
      },
      rabbit_chase: {
        url: 'audio/alice/rabbit_chase.wav',
        loop: true,
        volume: 0.70
      },
      wonderland_ambient: {
        url: 'audio/alice/wonderland_ambient.wav',
        loop: true,
        volume: 0.50
      },
      tea_party_theme: {
        url: 'audio/alice/tea_party_theme.wav',
        loop: true,
        volume: 0.60
      },
      croquet_garden_theme: {
        url: 'audio/alice/croquet_garden_theme.wav',
        loop: true,
        volume: 0.65
      },
      courtroom_tension: {
        url: 'audio/alice/courtroom_tension.wav',
        loop: true,
        volume: 0.60
      },
      awakening_theme: {
        url: 'audio/alice/awakening_theme.wav',
        loop: true,
        volume: 0.55
      },
      fanfare: {
        url: 'audio/alice/wonderland_fanfare.wav',
        loop: false,
        volume: 0.85
      }
    },

    // =======================================================================
    // 5. AMBIENCE LAYERS
    // =======================================================================
    ambience: {
      rabbit_woods: {
        url: 'audio/alice/rabbit_woods_ambience.wav',
        volume: 0.45,
        loop: true
      },
      falling_wind: {
        url: 'audio/alice/falling_wind_loop.wav',
        volume: 0.55,
        loop: true
      },
      wonderland_ambient: {
        url: 'audio/alice/wonderland_ambient.wav',
        volume: 0.40,
        loop: true
      },
      courtroom_tension: {
        url: 'audio/alice/courtroom_tension.wav',
        volume: 0.45,
        loop: true
      }
    },

    // =======================================================================
    // 6. SOUND EFFECT & VOICE EVENT MAPPINGS
    // =======================================================================
    soundEvents: {
      RABBIT_CHASE_STARTED: {
        action: 'setState',
        state: 'chase'
      },
      WATCH_DROPPED: {
        action: 'playVariation',
        variation: 'item_pickup',
        volume: 0.4
      },
      WATCH_COLLECTED: {
        action: 'playCue',
        cue: 'watch_pickup',
        volume: 0.8
      },
      WATCH_RETURNED: {
        action: 'playCue',
        cue: 'wonderland_fanfare',
        volume: 0.85
      },
      FALLING_STARTED: {
        action: 'setState',
        state: 'falling'
      },
      SIZE_SHRINK: {
        action: 'playCue',
        cue: 'size_shrink',
        volume: 0.75
      },
      SIZE_GROW: {
        action: 'playCue',
        cue: 'size_grow',
        volume: 0.75
      },
      CATERPILLAR_PUFF: {
        action: 'playCue',
        cue: 'caterpillar_puff',
        volume: 0.6
      },
      CHESHIRE_CAT_CHIME: {
        action: 'playCue',
        cue: 'cheshire_cat_chime',
        volume: 0.65
      },
      TEACUP_CLINK: {
        action: 'playCue',
        cue: 'teacup_clink',
        volume: 0.6
      },
      PAINTBRUSH_STROKE: {
        action: 'playCue',
        cue: 'paintbrush_stroke',
        volume: 0.6
      },
      CROQUET_HIT: {
        action: 'playCue',
        cue: 'croquet_hit',
        volume: 0.7
      },
      COURT_GAVEL: {
        action: 'playCue',
        cue: 'court_gavel',
        volume: 0.8
      },
      QUEEN_SHOUT: {
        action: 'playCue',
        cue: 'queen_voice_off_heads',
        volume: 0.85
      },
      QUEST_COMPLETED: {
        action: 'playCue',
        cue: 'wonderland_fanfare',
        volume: 0.85
      }
    },

    // =======================================================================
    // 7. DIRECT SOUND CUES
    // =======================================================================
    soundCues: {
      watch_tick: { url: 'audio/alice/watch_tick_loop.wav', volume: 0.6 },
      watch_pickup: { url: 'audio/alice/watch_pickup.wav', volume: 0.8 },
      rabbit_hole_hum: { url: 'audio/alice/rabbit_hole_hum.wav', volume: 0.6 },
      rabbit_voice_late: { url: 'audio/alice/rabbit_voice_late.wav', volume: 0.9 },
      rabbit_voice_watch: { url: 'audio/alice/rabbit_voice_watch.wav', volume: 0.9 },
      rabbit_voice_thanks: { url: 'audio/alice/rabbit_voice_thanks.wav', volume: 0.9 },
      rabbit_hop: { url: 'audio/alice/rabbit_hop_01.wav', volume: 0.5 },
      wonderland_fanfare: { url: 'audio/alice/wonderland_fanfare.wav', volume: 0.85 },
      size_shrink: { url: 'audio/alice/size_shrink.wav', volume: 0.75 },
      size_grow: { url: 'audio/alice/size_grow.wav', volume: 0.75 },
      caterpillar_puff: { url: 'audio/alice/caterpillar_puff.wav', volume: 0.6 },
      caterpillar_voice: { url: 'audio/alice/caterpillar_voice.wav', volume: 0.85 },
      cheshire_voice: { url: 'audio/alice/cheshire_voice.wav', volume: 0.8 },
      cheshire_cat_chime: { url: 'audio/alice/cheshire_cat_chime.wav', volume: 0.65 },
      teacup_clink: { url: 'audio/alice/teacup_clink.wav', volume: 0.6 },
      hatter_voice: { url: 'audio/alice/hatter_voice.wav', volume: 0.85 },
      paintbrush_stroke: { url: 'audio/alice/paintbrush_stroke.wav', volume: 0.6 },
      croquet_hit: { url: 'audio/alice/croquet_hit.wav', volume: 0.7 },
      court_gavel: { url: 'audio/alice/court_gavel.wav', volume: 0.8 },
      queen_voice_off_heads: { url: 'audio/alice/queen_voice_off_heads.wav', volume: 0.85 },
      awakening: { url: 'audio/alice/awakening_theme.wav', volume: 0.65 }
    }
  };

  root.AliceAudioPack = AliceAudioPack;

})(window);
