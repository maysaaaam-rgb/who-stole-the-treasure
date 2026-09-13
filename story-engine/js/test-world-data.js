/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — TEST WORLD DATA (v2.5 High-Fidelity)
 * 
 * High-Fidelity Storybook World Data for Test Slice:
 * - Area 1: "The Forest Clearing" (Ancient Oaks, Silver Birches, Stream, Winding Cobblestone Road)
 * - Area 2: "The Sunny Meadow" (Sunlit Flower Fields & Celebration Arch)
 * - Characters & Relics: Forest Ranger NPC, Ornate Golden Relic Key, Ancient Stone Gate
 * - Quests & Pedagogical Vocabulary Events
 * 100% decoupled from engine runtime.
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
        const time = (root.StoryGame && root.StoryGame.renderer) ? root.StoryGame.renderer.renderTime : 0;

        // 1. Rich Layered Woodland Floor (Dark forest green with sun-dappled patches)
        const baseGrad = ctx.createLinearGradient(0, 0, 0, area.height);
        baseGrad.addColorStop(0, '#0f3d2a');
        baseGrad.addColorStop(0.3, '#14532d');
        baseGrad.addColorStop(0.7, '#166534');
        baseGrad.addColorStop(1, '#064e3b');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Soft Dappled Moss & Light Clearings
        ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
        const dappleLocs = [
          [350, 480, 160, 80], [600, 360, 180, 90], [820, 520, 200, 100],
          [1100, 260, 140, 70], [450, 680, 170, 80], [980, 650, 190, 85]
        ];
        for (const [dx, dy, dw, dh] of dappleLocs) {
          ctx.beginPath();
          ctx.ellipse(dx, dy, dw, dh, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Organic Winding Cobblestone & Dirt Road
        // Path Border: Worn earth & scalloped grass fringing
        ctx.save();
        ctx.strokeStyle = '#451a03'; // Deep loam dirt border
        ctx.lineWidth = 72;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(80, 500);
        ctx.quadraticCurveTo(400, 525, 700, 480);
        ctx.quadraticCurveTo(1000, 435, 1260, 590);
        ctx.stroke();

        // Inner Path: Sandy earthen trail
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 58;
        ctx.stroke();

        // Fine Gravel & Cobblestone Centers
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 42;
        ctx.stroke();

        // Individual Hand-Laid River Cobblestones
        ctx.fillStyle = '#a16207';
        const cobbleCoords = [
          [160, 502], [220, 506], [290, 514], [370, 516], [450, 505],
          [530, 492], [610, 484], [690, 480], [770, 470], [850, 458],
          [930, 450], [1010, 465], [1080, 495], [1150, 532], [1210, 565]
        ];
        for (const [cx, cy] of cobbleCoords) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, 7, 4.5, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.ellipse(cx - 1, cy - 1, 4, 2, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#a16207';
        }
        ctx.restore();

        // 3. Living Animated Forest Stream / Pond on Bottom Left
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          root.StoryArt.EnvironmentRenderer.renderWater(ctx, 160, 720, 360, 180, time);
        }

        // 4. Wildflowers & Undergrowth Scattered Across Clearing
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          const floraField = [
            [220, 380, 'buttercup'], [260, 420, 'bluebell'], [300, 390, 'mushroom'],
            [460, 390, 'buttercup'], [510, 430, 'bluebell'], [580, 410, 'buttercup'],
            [720, 370, 'bluebell'], [780, 410, 'buttercup'], [860, 380, 'mushroom'],
            [440, 610, 'buttercup'], [490, 660, 'bluebell'], [560, 640, 'mushroom'],
            [670, 620, 'buttercup'], [740, 670, 'bluebell'], [810, 630, 'buttercup'],
            [890, 650, 'mushroom'], [970, 680, 'bluebell'], [1070, 350, 'buttercup'],
            [1140, 380, 'bluebell'], [1190, 330, 'mushroom']
          ];
          for (const [fx, fy, ftype] of floraField) {
            root.StoryArt.EnvironmentRenderer.renderFlora(ctx, fx, fy, ftype, time);
          }
        }
      }
    });

    // Perimeter Solid Boundaries
    forestArea.addObstacle({ x: 0, y: 0, width: 1400, height: 80 }); // Top border
    forestArea.addObstacle({ x: 0, y: 920, width: 1400, height: 80 }); // Bottom border
    forestArea.addObstacle({ x: 0, y: 0, width: 50, height: 1000 }); // Left border
    forestArea.addObstacle({ x: 1350, y: 0, width: 50, height: 1000 }); // Right border

    // Outer Boundary Trees (Mix of Majestic Ancient Oaks & Silver Birches)
    // Top border trees
    for (let x = 0; x < 1400; x += 95) {
      forestArea.addEntity(new SceneryProp({
        id: `tree-top-${x}`,
        x,
        y: 25,
        propType: 'tree',
        treeType: (x % 190 === 0 ? 'birch' : 'oak'),
        width: 80,
        height: 105
      }));
    }
    // Bottom border trees
    for (let x = 0; x < 1400; x += 105) {
      forestArea.addEntity(new SceneryProp({
        id: `tree-bot-${x}`,
        x,
        y: 870,
        propType: 'tree',
        treeType: (x % 210 === 0 ? 'birch' : 'oak'),
        width: 85,
        height: 105
      }));
    }
    // Left border trees
    for (let y = 130; y < 860; y += 120) {
      if (y < 420 || y > 560) { // Keep path entrance open
        forestArea.addEntity(new SceneryProp({
          id: `tree-left-${y}`,
          x: 20,
          y,
          propType: 'tree',
          treeType: (y % 240 === 0 ? 'birch' : 'oak'),
          width: 80,
          height: 105
        }));
      }
    }

    // Faceted Mossy Boulders inside the clearing
    forestArea.addEntity(new SceneryProp({
      id: 'rock-1',
      x: 580,
      y: 340,
      propType: 'rock',
      width: 65,
      height: 48
    }));

    forestArea.addEntity(new SceneryProp({
      id: 'rock-2',
      x: 840,
      y: 610,
      propType: 'rock',
      width: 72,
      height: 52
    }));

    // Oak Cluster Hiding the Golden Key to the North
    forestArea.addEntity(new SceneryProp({
      id: 'oak-cluster-1',
      x: 1030,
      y: 180,
      propType: 'tree',
      treeType: 'oak',
      width: 95,
      height: 125
    }));

    forestArea.addEntity(new SceneryProp({
      id: 'oak-cluster-2',
      x: 1190,
      y: 180,
      propType: 'tree',
      treeType: 'birch',
      width: 90,
      height: 125
    }));

    // Carved Wooden Signpost near path
    forestArea.addEntity(new SceneryProp({
      id: 'signpost-clearing',
      x: 950,
      y: 490,
      propType: 'signpost',
      signTitle: 'ANCIENT GATE',
      width: 55,
      height: 52,
      isInteractable: true,
      signText: '🧭 Ancient Stone Gate ahead. Only the Golden Key can unlock it!'
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
      description: 'An ornate filigree golden key engraved with oak leaves.',
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
        const time = (root.StoryGame && root.StoryGame.renderer) ? root.StoryGame.renderer.renderTime : 0;

        // Radiant Golden-Green Meadow Hills
        const meadowGrad = ctx.createLinearGradient(0, 0, 0, area.height);
        meadowGrad.addColorStop(0, '#86efac'); // Morning sunlit horizon
        meadowGrad.addColorStop(0.3, '#4ade80');
        meadowGrad.addColorStop(0.7, '#22c55e');
        meadowGrad.addColorStop(1, '#16a34a');
        ctx.fillStyle = meadowGrad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Rolling Hillock Arcs
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.arc(350, 600, 320, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(850, 550, 380, 0, Math.PI * 2);
        ctx.fill();

        // Thousands of Tiny Wild Meadow Blossoms (Pink & Yellow)
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          for (let i = 0; i < 35; i++) {
            const fx = (i * 97 + 50) % (area.width - 100);
            const fy = (i * 127 + 60) % (area.height - 120);
            const flowerType = (i % 2 === 0 ? 'buttercup' : 'bluebell');
            root.StoryArt.EnvironmentRenderer.renderFlora(ctx, fx, fy, flowerType, time);
          }
        }
      }
    });

    // Celebration Signpost in Sunny Meadow
    meadowArea.addEntity(new SceneryProp({
      id: 'signpost-victory',
      x: 520,
      y: 360,
      propType: 'signpost',
      signTitle: 'VICTORY!',
      width: 70,
      height: 60,
      isInteractable: true,
      signText: '🏆 SUCCESS! You completed the quest, opened the Ancient Gate, and explored the new world!'
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
        text: 'The Ancient Stone Gate to the east leads to the Sunny Meadow, but it is locked tight.',
        startQuest: 'gatekeeper_key'
      },
      {
        speaker: 'Forest Ranger',
        text: 'I lost my Golden Key somewhere near the oak trees to the north. Could you help me find it?'
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
