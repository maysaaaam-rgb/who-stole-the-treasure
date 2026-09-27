/**
 * MYSTERY OF THE TWIN GATES: THE CRYSTAL CITADEL
 * Comprehensive Story Curriculum & Pedagogical Database
 * Grade 3–4 | CEFR A1–A1+ | 45-Minute Master Interactive Quest • Total XP: 200
 */

(function(root) {
  'use strict';

  const TWIN_GATES_DATA = {
    meta: {
      id: "twin-gates",
      title: "🚪 Mystery of the Twin Gates: The Crystal Citadel",
      subtitle: "Spatial Directions, Sensory Clues & The Golden Airship Escape",
      category: "Language & Quests",
      track: "Track 3: Communication & Interactive Storytelling",
      grade: "Grade 3–4",
      level: "CEFR A1–A1+",
      duration: "45 min",
      totalChambers: 5,
      totalXP: 200,
      grammarTargets: [
        "Spatial & Directional: Go through the [left / right] door! It is [behind / under] the rock.",
        "Sensory & Condition: I hear [fire / ice]! It is [cold / hot / dangerous].",
        "Cause & Necessity: I need a [torch / shield] to [melt / block] the [ice / fire]."
      ]
    },

    inventoryItems: [
      { id: "shield", name: "Frost Shield", icon: "🛡️", img: "assets/shield_item.webp", desc: "Deflects frost shards & molten sparks" },
      { id: "torch", name: "Blazing Torch", icon: "🕯️", img: "assets/torch_item.webp", desc: "Melts thick ice & lights dark tunnels" },
      { id: "gear", name: "Bronze Gear", icon: "⚙️", img: "assets/bronze_gear.webp", desc: "Restores ancient clockwork mechanisms" },
      { id: "crystal", name: "Crystal Shard", icon: "💎", img: "assets/crystal_gem.webp", desc: "Fuels the celestial airship core" }
    ],

    chambers: [
      // CHAMBER 1: The Entrance Gate
      {
        id: 1,
        title: "Chamber 1: The Twin Entrance Gates",
        subtitle: "The Citadel Threshold",
        breadcrumb: "Entrance",
        audioClueType: "wind_vs_fire",
        narration: {
          line1: "Listen carefully to the wind and the crackling fire!",
          line2: "Equip your elemental shield, then choose the Left or Right Gate to enter!"
        },
        prompt: "Choose the correct shield to safely pass the threshold.",
        puzzle: {
          type: "elemental_shield",
          question: "Which shield protects against freezing cold ice wind?",
          options: [
            { id: "frost_shield", label: "Frost Crystal Shield", icon: "🛡️", isCorrect: true, formula: "I need a Frost Shield to block the freezing wind!" },
            { id: "paper_kite", label: "Paper Kite", icon: "🪁", isCorrect: false, formula: "Paper is too fragile for freezing ice storms!" }
          ]
        },
        doors: {
          left: {
            id: "door_frost",
            name: "Frost Rune Gate",
            theme: "frost",
            glow: "#38bdf8",
            img: "assets/gate_frost_left.webp",
            destChamber: 2,
            pathKey: "frost",
            cueText: "I hear whistling ice wind behind the Left Gate!"
          },
          right: {
            id: "door_magma",
            name: "Magma Ember Gate",
            theme: "magma",
            glow: "#f59e0b",
            img: "assets/gate_magma_right.webp",
            destChamber: 2,
            pathKey: "magma",
            cueText: "I hear popping hot embers behind the Right Gate!"
          }
        }
      },

      // CHAMBER 2: The Creature Den
      {
        id: 2,
        title: "Chamber 2: The Creature Den",
        subtitle: "Meeting the Citadel Guardian",
        breadcrumb: "Creature Den",
        branches: {
          frost: {
            creatureName: "Yeti Companion",
            creatureImg: "assets/yeti_companion.webp",
            theme: "frost",
            narration: {
              line1: "Look! A friendly Yeti is shivering behind the giant ice crystal.",
              line2: "Offer a warm blazing torch to melt the ice and earn its trust!"
            },
            puzzle: {
              type: "item_offering",
              neededItem: "torch",
              hint: "I need a torch to melt the ice for the Yeti.",
              actionLabel: "🕯️ Offer Blazing Torch to the Yeti"
            },
            doors: {
              left: {
                id: "door_upper_peak",
                name: "Upper Glacier Arch",
                theme: "frost",
                glow: "#38bdf8",
                img: "assets/gate_frost_left.webp",
                destChamber: 3,
                pathKey: "glacier",
                cueText: "Go up through the icy glacier archway!"
              },
              right: {
                id: "door_crystal_tunnel",
                name: "Deep Crystal Tunnel",
                theme: "magma",
                glow: "#f59e0b",
                img: "assets/gate_magma_right.webp",
                destChamber: 3,
                pathKey: "tunnel",
                cueText: "Go down through the warm cavern tunnel!"
              }
            }
          },
          magma: {
            creatureName: "Baby Fire Dragon",
            creatureImg: "assets/baby_dragon.webp",
            theme: "magma",
            narration: {
              line1: "Look! A cute baby dragon is playing under the volcanic rock.",
              line2: "Offer a radiant crystal gem to feed the dragon and make peace!"
            },
            puzzle: {
              type: "item_offering",
              neededItem: "crystal",
              hint: "I need a glowing crystal gem to feed the baby dragon.",
              actionLabel: "💎 Offer Crystal Gem to the Dragon"
            },
            doors: {
              left: {
                id: "door_upper_peak",
                name: "Upper Volcanic Ridge",
                theme: "frost",
                glow: "#38bdf8",
                img: "assets/gate_frost_left.webp",
                destChamber: 3,
                pathKey: "glacier",
                cueText: "Go up toward the cool mountain ridge!"
              },
              right: {
                id: "door_crystal_tunnel",
                name: "Deep Magma Conduit",
                theme: "magma",
                glow: "#f59e0b",
                img: "assets/gate_magma_right.webp",
                destChamber: 3,
                pathKey: "tunnel",
                cueText: "Go through the glowing magma conduit!"
              }
            }
          }
        }
      },

      // CHAMBER 3: The Collapsing Chasm Bridge
      {
        id: 3,
        title: "Chamber 3: The Collapsing Chasm Bridge",
        subtitle: "Rune Rhythm Memory Path",
        breadcrumb: "Chasm Bridge",
        narration: {
          line1: "Ancient stone tiles hover above the bottomless chasm!",
          line2: "Step on the glowing rune tiles in the correct rhythm to cross safely."
        },
        puzzle: {
          type: "tile_sequence",
          sequence: [0, 2, 1], // Tile sequence: Left (0) -> Right (2) -> Center (1)
          tileLabels: ["Cyan Frost Rune", "Gold Sun Rune", "Amber Ember Rune"],
          hint: "Follow the rune chime: Left Frost ➔ Right Ember ➔ Center Sun!"
        },
        doors: {
          left: {
            id: "door_clockwork",
            name: "Clockwork Gear Gate",
            theme: "clockwork",
            glow: "#f59e0b",
            img: "assets/gate_clockwork.webp",
            destChamber: 4,
            pathKey: "gears",
            cueText: "I hear heavy bronze gears turning behind the Left Door!"
          },
          right: {
            id: "door_vault_gold",
            name: "Citadel Vault Portal",
            theme: "gold",
            glow: "#38bdf8",
            img: "assets/gate_vault_gold.webp",
            destChamber: 4,
            pathKey: "vault",
            cueText: "I see radiant starlight gleaming behind the Right Door!"
          }
        }
      },

      // CHAMBER 4: The Clockwork Riddle Vault
      {
        id: 4,
        title: "Chamber 4: The Clockwork Riddle Vault",
        subtitle: "The Mechanical Guardian",
        breadcrumb: "Clockwork Vault",
        guardianImg: "assets/clockwork_golem.webp",
        guardianName: "Clockwork Guardian Golem",
        narration: {
          line1: "The Clockwork Guardian stands guard before the engine lifts.",
          line2: "Listen to the ancient riddle: What has moving teeth but cannot bite?"
        },
        puzzle: {
          type: "riddle_gear",
          question: "Riddle: 'What has twenty teeth, spins in circles, and powers the machines?'",
          options: [
            { id: "gear", label: "A Bronze Cog Gear", icon: "⚙️", isCorrect: true, formula: "It is a bronze gear! We need it to fix the lift!" },
            { id: "comb", label: "A Plastic Hair Comb", icon: "🪮", isCorrect: false, formula: "A comb cannot turn the citadel steam engines!" }
          ],
          actionLabel: "⚙️ Snap Bronze Gear into the Central Axis"
        },
        doors: {
          left: {
            id: "door_sky_dock",
            name: "Sky Dock Portal",
            theme: "gold",
            glow: "#f59e0b",
            img: "assets/gate_vault_gold.webp",
            destChamber: 5,
            pathKey: "skydock",
            cueText: "The sky dock leads directly to the Golden Airship!"
          },
          right: {
            id: "door_core_engine",
            name: "Core Engine Gate",
            theme: "clockwork",
            glow: "#38bdf8",
            img: "assets/gate_clockwork.webp",
            destChamber: 5,
            pathKey: "skydock",
            cueText: "The steam lift ascends right up to the flight deck!"
          }
        }
      },

      // CHAMBER 5: Grand Escape & Teleprompter Studio
      {
        id: 5,
        title: "Chamber 5: The Golden Airship Launchpad",
        subtitle: "Grand Escape & Broadcast Studio",
        breadcrumb: "Airship Launch",
        airshipImg: "assets/airship_golden.webp",
        narration: {
          line1: "The magnificent Golden Airship awaits at the summit of the Citadel!",
          line2: "Slot your gathered relics into the engine, then deliver the final broadcast!"
        },
        relicSlots: [
          { id: "relic_shield", label: "Elemental Shield", icon: "🛡️" },
          { id: "relic_gear", label: "Bronze Clockwork Gear", icon: "⚙️" },
          { id: "relic_crystal", label: "Aetheric Power Crystal", icon: "💎" }
        ],
        teleprompter: {
          title: "Crystal Citadel Graduation Debrief",
          line1: "We explored the Crystal Citadel and unlocked the magic gates!",
          line2: "We solved the ancient riddles and passed the creatures safely!",
          line3: "We launched the Golden Airship — mission complete!"
        }
      }
    ],

    // Worksheet & Comic Strip Companion Data
    comicPanels: [
      {
        panel: 1,
        title: "Panel 1: The Twin Gates",
        caption: "We arrived at the Citadel threshold. We chose the frost gate!",
        formula: "Go through the left door! I hear cold wind."
      },
      {
        panel: 2,
        title: "Panel 2: Friendly Creature",
        caption: "We made friends with the guardian creature in the den.",
        formula: "I need a torch to melt the ice."
      },
      {
        panel: 3,
        title: "Panel 3: Chasm Bridge",
        caption: "We stepped across the glowing rune stones in harmony.",
        formula: "Step on the cyan, gold, and amber stones!"
      },
      {
        panel: 4,
        title: "Panel 4: Golden Airship",
        caption: "We powered the celestial engine and flew into the sunrise!",
        formula: "The Golden Airship is ready to fly!"
      }
    ]
  };

  root.TWIN_GATES_DATA = TWIN_GATES_DATA;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TWIN_GATES_DATA;
  }
})(typeof window !== 'undefined' ? window : global);
