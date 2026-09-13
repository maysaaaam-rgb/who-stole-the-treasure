/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — TEST WORLD DATA (v1.0)
 * 
 * Vertical Slice Test Content for Engine Validation (Step 25):
 * - Area 1: "Forest Clearing" (Ranger NPC, Hidden Golden Key, Ancient Gate)
 * - Area 2: "Sunny Meadow" (Scene Transition Target)
 * - Quest: "The Gatekeeper's Key"
 * Completely decoupled from the generic engine core.
 * ============================================================================
 */

(function(root) {
  'use strict';

  function createTestWorld() {
    const { Area, World } = root.StoryWorld;
    const { NPC, Collectible, Door, SceneryProp } = root.StoryEntities;

    const world = new World();

    // =========================================================================
    // 1. AREA 1: FOREST CLEARING (1400 x 1000)
    // =========================================================================
    const forestArea = new Area({
      id: 'forest_clearing',
      name: 'The Forest Clearing',
      width: 1400,
      height: 1000,
      backgroundColor: '#064e3b',
      spawnPoints: {
        default: { x: 180, y: 500 },
        from_meadow: { x: 1200, y: 580 }
      },
      renderTerrain(ctx, area, camX, camY, viewW, viewH) {
        // Lush Forest Floor
        const grad = ctx.createLinearGradient(0, 0, 0, area.height);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.5, '#047857');
        grad.addColorStop(1, '#064e3b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Winding Dirt Pathway
        ctx.save();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 64;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(100, 500);
        ctx.quadraticCurveTo(400, 520, 700, 480);
        ctx.quadraticCurveTo(1000, 440, 1260, 590);
        ctx.stroke();

        // Cobblestone Pebbles inside Path
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 48;
        ctx.stroke();
        ctx.restore();

        // Forest Stream / Pond on Bottom Left
        ctx.save();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.ellipse(320, 820, 140, 65, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(310, 815, 110, 45, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Wildflowers Scattered Across Clearing
        ctx.fillStyle = '#fde047'; // Yellow buttercups
        const flowerLocs = [
          [220, 380], [280, 420], [480, 390], [540, 430], [740, 360],
          [820, 410], [920, 370], [980, 420], [450, 620], [520, 660],
          [680, 630], [760, 680], [860, 640], [960, 690], [1080, 340]
        ];
        for (const [fx, fy] of flowerLocs) {
          ctx.beginPath();
          ctx.arc(fx, fy, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      renderForeground(ctx, area, camX, camY, viewW, viewH) {
        // Canopy Vignette on top edges
        ctx.save();
        const vig = ctx.createLinearGradient(0, 0, 0, 120);
        vig.addColorStop(0, 'rgba(2, 44, 34, 0.6)');
        vig.addColorStop(1, 'rgba(2, 44, 34, 0)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, area.width, 120);
        ctx.restore();
      }
    });

    // Perimeter Solid Boundaries
    forestArea.addObstacle({ x: 0, y: 0, width: 1400, height: 80 }); // Top border
    forestArea.addObstacle({ x: 0, y: 920, width: 1400, height: 80 }); // Bottom border
    forestArea.addObstacle({ x: 0, y: 0, width: 50, height: 1000 }); // Left border
    forestArea.addObstacle({ x: 1350, y: 0, width: 50, height: 1000 }); // Right border

    // Outer Boundary Tree Obstacles (Prevent walking out of world bounds)
    // Top border trees
    for (let x = 0; x < 1400; x += 90) {
      forestArea.addEntity(new SceneryProp({
        id: `tree-top-${x}`,
        x,
        y: 30,
        propType: 'tree',
        width: 70,
        height: 90
      }));
    }
    // Bottom border trees
    for (let x = 0; x < 1400; x += 110) {
      forestArea.addEntity(new SceneryProp({
        id: `tree-bot-${x}`,
        x,
        y: 880,
        propType: 'tree',
        width: 70,
        height: 90
      }));
    }
    // Left border trees
    for (let y = 140; y < 860; y += 120) {
      if (y < 420 || y > 560) { // Leave gap for path
        forestArea.addEntity(new SceneryProp({
          id: `tree-left-${y}`,
          x: 20,
          y,
          propType: 'tree',
          width: 70,
          height: 90
        }));
      }
    }

    // Mossy Rocks & Decorative Trees inside the clearing
    forestArea.addEntity(new SceneryProp({
      id: 'rock-1',
      x: 580,
      y: 350,
      propType: 'rock',
      width: 55,
      height: 40
    }));

    forestArea.addEntity(new SceneryProp({
      id: 'rock-2',
      x: 840,
      y: 620,
      propType: 'rock',
      width: 60,
      height: 45
    }));

    // Oak Cluster Hiding the Golden Key to the North
    forestArea.addEntity(new SceneryProp({
      id: 'oak-cluster-1',
      x: 1040,
      y: 190,
      propType: 'tree',
      width: 85,
      height: 110
    }));

    forestArea.addEntity(new SceneryProp({
      id: 'oak-cluster-2',
      x: 1190,
      y: 190,
      propType: 'tree',
      width: 85,
      height: 110
    }));

    // Signpost near path
    forestArea.addEntity(new SceneryProp({
      id: 'signpost-clearing',
      x: 950,
      y: 490,
      propType: 'signpost',
      width: 50,
      height: 50,
      isInteractable: true,
      signText: '🧭 Ancient Stone Gate ahead. Only the Golden Key can open it!'
    }));

    // NPC: Forest Ranger
    const rangerNPC = new NPC({
      id: 'npc-ranger',
      name: 'Forest Ranger',
      role: 'Ancient Woods Guide',
      x: 360,
      y: 460,
      dialogueKey: 'ranger_dialogue',
      hasQuest: true
    });
    forestArea.addEntity(rangerNPC);

    // Collectible: Golden Key (tucked between the north oaks)
    const goldenKey = new Collectible({
      id: 'collectible-golden-key',
      itemId: 'golden_key',
      itemName: 'Golden Key',
      itemIcon: '🗝️',
      description: 'An ornate golden key engraved with oak leaves.',
      x: 1130,
      y: 240,
      vocabulary: 'key'
    });
    forestArea.addEntity(goldenKey);

    // Door: Ancient Stone Gate
    const ancientGate = new Door({
      id: 'gate-ancient',
      name: 'Ancient Stone Gate',
      requiredItemId: 'golden_key',
      x: 1260,
      y: 540,
      targetArea: 'sunny_meadow',
      targetSpawn: 'from_gate'
    });
    forestArea.addEntity(ancientGate);

    world.registerArea(forestArea);

    // =========================================================================
    // 2. AREA 2: SUNNY MEADOW (Transition Destination Area)
    // =========================================================================
    const meadowArea = new Area({
      id: 'sunny_meadow',
      name: 'The Sunny Meadow',
      width: 1200,
      height: 800,
      backgroundColor: '#15803d',
      spawnPoints: {
        from_gate: { x: 180, y: 400 },
        default: { x: 180, y: 400 }
      },
      renderTerrain(ctx, area, camX, camY, viewW, viewH) {
        // Bright Sunny Green Grass
        const grad = ctx.createRadialGradient(area.width / 2, area.height / 2, 80, area.width / 2, area.height / 2, 700);
        grad.addColorStop(0, '#4ade80');
        grad.addColorStop(1, '#16a34a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Sunny flower meadow patches
        ctx.fillStyle = '#f472b6'; // Pink blossoms
        for (let i = 0; i < 40; i++) {
          const fx = (i * 97) % area.width;
          const fy = (i * 127) % area.height;
          ctx.beginPath();
          ctx.arc(fx, fy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Celebration Signpost in Sunny Meadow
    meadowArea.addEntity(new SceneryProp({
      id: 'signpost-victory',
      x: 520,
      y: 360,
      propType: 'signpost',
      width: 70,
      height: 60,
      isInteractable: true,
      signText: '🏆 SUCCESS! You completed the quest, opened the gate, and verified the engine foundation!'
    }));

    world.registerArea(meadowArea);

    // =========================================================================
    // 3. QUEST REGISTRATION
    // =========================================================================
    const questGatekeeper = {
      id: 'gatekeeper_key',
      title: "The Gatekeeper's Key",
      description: 'Help the Forest Ranger find the lost Golden Key and unlock the Ancient Stone Gate.',
      rewardXP: 50,
      objectives: [
        { id: 'find_key', text: 'Find the Golden Key hidden in the north woods' },
        { id: 'unlock_gate', text: 'Unlock the Ancient Stone Gate' }
      ]
    };

    // =========================================================================
    // 4. DIALOGUE TREE REGISTRATION
    // =========================================================================
    const rangerDialogue = [
      {
        speaker: 'Forest Ranger',
        text: 'Hello there, young explorer! Welcome to the Ancient Forest.'
      },
      {
        speaker: 'Forest Ranger',
        text: 'The Ancient Stone Gate to the east is locked tight, and I lost my Golden Key!',
        startQuest: 'gatekeeper_key'
      },
      {
        speaker: 'Forest Ranger',
        text: 'Can you search near the great oak trees to the north and bring the key to the gate?'
      }
    ];

    return {
      world,
      quests: [questGatekeeper],
      dialogues: {
        ranger_dialogue: rangerDialogue
      }
    };
  }

  root.StoryTestData = {
    createTestWorld
  };

})(window);
