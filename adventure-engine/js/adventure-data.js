/**
 * ADVENTURE ACADEMY ENGINE: CURRICULUM & MISSION DATA
 * Grade 3-5 CEFR A1+/A2 | CLIL Science, Energy & Inventions
 * Zero-bug safety: strictly defined labels, formulas, and spoken facts
 */

(function(root) {
  'use strict';

  const ADVENTURE_DATA = {
    meta: {
      id: 'adventure-engine',
      title: '⚡ Adventure Academy Engine: Eco-Rover Expedition',
      subtitle: 'POWER THE QUANTUM CORE & EXPLORE ALIEN WORLDS',
      grade: 'Grade 3–5',
      level: 'A1+ / A2',
      cefrLevel: 'A1+',
      duration: '30 min',
      xp: 150,
      curriculum: 'CLIL Science, Clean Energy & Engineering Design',
      coreFormula: 'The [Subsystem] uses [Energy] to [Verb].',
      motto: 'Curiosity powers discovery • Teamwork powers adventure!'
    },

    // 4 Key Subsystems mapped onto the Persistent Holographic Rover
    subsystems: {
      solar: {
        id: 'solar',
        name: 'Solar Canopy',
        shortName: 'Solar Array',
        icon: '☀️',
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.45)',
        energyType: 'Solar Radiation',
        actionVerb: 'collect clean sunlight and recharge the battery',
        primaryFormula: 'The solar canopy uses sunlight to recharge the battery.',
        roleInExpedition: 'Captures photons on daytime ridges to prevent core drainage.',
        status: 'Offline',
        coords: { x: '50%', y: '22%' },
        audioFact: 'The solar canopy unfolds high-efficiency photovoltaic cells to capture solar energy.'
      },
      kinetic: {
        id: 'kinetic',
        name: 'Kinetic Treads',
        shortName: 'Treads',
        icon: '⚙️',
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.45)',
        energyType: 'Mechanical Kinetic Energy',
        actionVerb: 'traverse rocky canyons and climb volcanic ridges',
        primaryFormula: 'The kinetic treads use mechanical motion to climb rocky terrain.',
        roleInExpedition: 'Adapts torque and traction across mud, gravel, and crystalline ice.',
        status: 'Offline',
        coords: { x: '35%', y: '68%' },
        audioFact: 'Heavy-duty kinetic treads convert rotational torque into forward exploration drive.'
      },
      radar: {
        id: 'radar',
        name: 'Synapse Radar',
        shortName: 'Sensor Dish',
        icon: '📡',
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.45)',
        energyType: 'Electromagnetic Pulses',
        actionVerb: 'scan terrain hazards and map mineral deposits',
        primaryFormula: 'The synapse radar uses electromagnetic waves to detect obstacles.',
        roleInExpedition: 'Transmits microwave telemetry to mission command in orbit.',
        status: 'Offline',
        coords: { x: '72%', y: '30%' },
        audioFact: 'The rotating synapse dish scans 360 degrees to detect chasms and alien minerals.'
      },
      shield: {
        id: 'shield',
        name: 'Shield Matrix',
        shortName: 'Force Field',
        icon: '🛡️',
        color: '#f43f5e',
        glowColor: 'rgba(244, 63, 94, 0.45)',
        energyType: 'Plasma Deflection Field',
        actionVerb: 'deflect cosmic radiation and violent dust storms',
        primaryFormula: 'The shield matrix uses magnetic plasma to protect the explorer crew.',
        roleInExpedition: 'Envelopes the chassis in a resonant electromagnetic barrier.',
        status: 'Offline',
        coords: { x: '68%', y: '62%' },
        audioFact: 'The plasma shield creates a protective bubble against extreme dust storms.'
      }
    },

    // PHASE 1: Subsystem Energy Alignment (Land / Input)
    phase1_alignment: {
      title: 'Subsystem Calibration Deck',
      subtitle: 'Slot the 4 essential energy modules into the Holographic Eco-Rover rig.',
      targetFormula: 'Target Formula: The [Module] uses [Energy] to [Action].',
      modules: [
        {
          id: 'mod-solar',
          targetSubsystem: 'solar',
          name: 'Photovoltaic Array',
          icon: '☀️',
          color: '#f59e0b',
          energySource: 'Sunlight',
          description: 'Gathers bright solar radiation to sustain long planetary journeys.',
          audioPrompt: 'Slot the solar canopy to capture sunlight for our journey.',
          spokenFact: 'Superb! The solar canopy is online and capturing pure solar energy!',
          softFailClue: 'Look closely at the top deck. Which system absorbs bright sunlight?'
        },
        {
          id: 'mod-radar',
          targetSubsystem: 'radar',
          name: 'Deep-Space Telemetry Dish',
          icon: '📡',
          color: '#38bdf8',
          energySource: 'Electromagnetic Wave',
          description: 'Sends pulsed sensor frequencies to locate crystal energy pods.',
          audioPrompt: 'Connect the synapse dish to scan the valley for hazards.',
          spokenFact: 'Sensors aligned! 360-degree radar coverage is active and scanning!',
          softFailClue: 'This module emits radio signals into space. Look for the dish!'
        },
        {
          id: 'mod-kinetic',
          targetSubsystem: 'kinetic',
          name: 'All-Terrain Traction System',
          icon: '⚙️',
          color: '#10b981',
          energySource: 'Rotational Torque',
          description: 'Twin titanium alloy tracks engineered for jagged volcanic boulders.',
          audioPrompt: 'Attach the kinetic treads to drive over rocky craters.',
          spokenFact: 'Treads locked in! High-traction rover suspension is ready to roll!',
          softFailClue: 'The rover needs tracks to drive on rocky ground. Look at the base!'
        },
        {
          id: 'mod-shield',
          targetSubsystem: 'shield',
          name: 'Ionized Plasma Barrier',
          icon: '🛡️',
          color: '#f43f5e',
          energySource: 'Magnetic Force',
          description: 'Emits a glowing kinetic bubble to deflect meteor debris and sand.',
          audioPrompt: 'Charge the shield matrix to deflect radioactive dust.',
          spokenFact: 'Shield matrix at 100%! Crew and quantum core are fully safeguarded!',
          softFailClue: 'This defense module shields the rover from falling debris.'
        }
      ]
    },

    // PHASE 2: Hazard Speed Relay & Magnetic Circuit Coupling (Interactive Challenge)
    phase2_relay: {
      title: 'Extreme Terrain Hazard Relay',
      subtitle: 'Couple the rover circuits under 0.45s to bypass environmental planetary hazards.',
      teamworkMotto: '⚡ Rapid Decision Relay: 3 Nodes • 1 Team • Instant Reaction',
      rounds: [
        {
          roundId: 1,
          hazardName: 'Canyon Dust Storm',
          icon: '🌪️',
          ambientColor: '#f59e0b',
          targetTimeSeconds: 0.45,
          situation: 'A sudden vortex of sharp silicon dust threatens to blind the forward cameras!',
          challengeText: 'Sequence: Scan Hazard (Radar) ➔ Shield Chassis (Shield) ➔ Accelerate Out (Treads)',
          steps: [
            {
              stepIdx: 0,
              subsystemId: 'radar',
              name: 'Radar Sweep',
              actionLabel: 'Detect Vortex Edge',
              color: '#38bdf8'
            },
            {
              stepIdx: 1,
              subsystemId: 'shield',
              name: 'Shield Flare',
              actionLabel: 'Deflect Silicon Dust',
              color: '#f43f5e'
            },
            {
              stepIdx: 2,
              subsystemId: 'kinetic',
              name: 'Tread Surge',
              actionLabel: 'Accelerate to Safety',
              color: '#10b981'
            }
          ]
        },
        {
          roundId: 2,
          hazardName: 'Sub-Zero Dark Ridge',
          icon: '❄️',
          ambientColor: '#38bdf8',
          targetTimeSeconds: 0.40,
          situation: 'Temperatures plummet to -120°C in the eclipse shadow, freezing battery fluid!',
          challengeText: 'Sequence: Harvest Solar Light (Solar) ➔ Sensor Echo (Radar) ➔ High Gear (Treads)',
          steps: [
            {
              stepIdx: 0,
              subsystemId: 'solar',
              name: 'Solar Boost',
              actionLabel: 'Preheat Core Reserve',
              color: '#f59e0b'
            },
            {
              stepIdx: 1,
              subsystemId: 'radar',
              name: 'Echo Probe',
              actionLabel: 'Find Warm Cavern',
              color: '#38bdf8'
            },
            {
              stepIdx: 2,
              subsystemId: 'kinetic',
              name: 'Track Drive',
              actionLabel: 'Enter Thermal Shelter',
              color: '#10b981'
            }
          ]
        },
        {
          roundId: 3,
          hazardName: 'Geothermal Crystal Chasm',
          icon: '🌋',
          ambientColor: '#f43f5e',
          targetTimeSeconds: 0.35,
          situation: 'Molten plasma fissures open beneath the ground as crystals pulse with energy!',
          challengeText: 'Sequence: Deflect Heat (Shield) ➔ Pinpoint Crystals (Radar) ➔ Solar Absorption (Solar)',
          steps: [
            {
              stepIdx: 0,
              subsystemId: 'shield',
              name: 'Plasma Wall',
              actionLabel: 'Hold Geothermal Wave',
              color: '#f43f5e'
            },
            {
              stepIdx: 1,
              subsystemId: 'radar',
              name: 'Crystal Lock',
              actionLabel: 'Locate Power Node',
              color: '#38bdf8'
            },
            {
              stepIdx: 2,
              subsystemId: 'solar',
              name: 'Core Sync',
              actionLabel: 'Absorb Clean Energy',
              color: '#f59e0b'
            }
          ]
        }
      ]
    },

    // PHASE 3: Live Synthesis & Broadcast Karaoke Teleprompter
    phase3_broadcast: {
      title: 'Mission Command Live Teleprompter',
      subtitle: 'Deliver your expedition broadcast to Earth with live word-by-word speech tracking.',
      teleprompterPrompt: 'Read aloud into the studio microphone as each target phrase illuminates!',
      lines: [
        {
          index: 0,
          speaker: 'Expedition Commander',
          text: 'Our Adventure Rover explores extreme alien worlds with resilience and science.',
          scaffoldFormula: 'Our [Subject] explores [Place] with [Values].',
          keyTerms: ['Adventure Rover', 'explores', 'alien worlds', 'science'],
          durationMs: 4200
        },
        {
          index: 1,
          speaker: 'Energy Specialist',
          text: 'We use the solar canopy and quantum core to collect clean energy.',
          scaffoldFormula: 'We use [System] to [Action].',
          keyTerms: ['solar canopy', 'quantum core', 'collect clean energy'],
          durationMs: 4200
        },
        {
          index: 2,
          speaker: 'Defense & Navigation Officer',
          text: 'When danger appears, the shields and synapse radar protect our crew.',
          scaffoldFormula: 'When [Event], the [Systems] protect [Object].',
          keyTerms: ['danger appears', 'shields', 'synapse radar', 'protect'],
          durationMs: 4400
        },
        {
          index: 3,
          speaker: 'Adventure Academy Team',
          text: 'Mission accomplished! Curiosity powers discovery and teamwork powers adventure!',
          scaffoldFormula: 'Mission accomplished! [Value] powers [Result]!',
          keyTerms: ['Mission accomplished', 'Curiosity', 'discovery', 'Teamwork'],
          durationMs: 4600
        }
      ]
    },

    // Achievement Badges
    badges: [
      { id: 'core_calibrated', name: 'Quantum Engineer', icon: '⚙️', desc: 'Calibrated all 4 Eco-Rover subsystems.' },
      { id: 'speed_navigator', name: 'Hazard Champion', icon: '⚡', desc: 'Cleared 3 hazard relays under time limits.' },
      { id: 'energy_overcharge', name: '100% Supercharged', icon: '🔋', desc: 'Maxed out metabolic energy reserves.' },
      { id: 'broadcast_orator', name: 'Voice of the Academy', icon: '🎙️', desc: 'Delivered a flawless mission debrief on-air.' },
      { id: 'master_explorer', name: 'Master Explorer Diploma', icon: '🎓', desc: 'Completed the full Adventure Academy expedition.' }
    ]
  };

  root.ADVENTURE_DATA = ADVENTURE_DATA;
})(typeof window !== 'undefined' ? window : global);
