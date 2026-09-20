/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — ALICE IN WONDERLAND
 * LEVEL 1: RABBIT WOODS (Vertical Slice Data)
 * 
 * High-Fidelity 2D/2.5D Storybook Adventure Level:
 * - 2000 x 1200 Woodland Environment (Entry Glade, Winding Woodland Trail,
 *   Dropped Watch Glade, Giant Hollow Oak & Rabbit Hole)
 * - Animated Stream, Wildflowers, Giant Wonderland Mushrooms
 * - White Rabbit NPC with Dynamic Physical Chase & Watch-Drop Mechanics
 * - Pocket Watch Collectible with Spatial Ticking Sound
 * - Rabbit Hole with Mystical Swirling Fairy-Dust & Ambient Resonance
 * - CEFR A1/A1+ English Vocabulary Learning Events
 * 100% decoupled from engine runtime.
 * ============================================================================
 */

(function(root) {
  'use strict';

  function createRabbitWoodsWorld() {
    const { Area, World } = root.StoryWorld;
    const { NPC, Collectible, Door, SceneryProp, WhiteRabbit, PocketWatch, RabbitHole } = root.StoryEntities;

    const world = new World();

    // =========================================================================
    // 1. AREA: RABBIT WOODS (2000 x 1200)
    // =========================================================================
    const rabbitWoodsArea = new Area({
      id: 'rabbit_woods',
      name: 'Rabbit Woods',
      width: 2000,
      height: 1200,
      backgroundColor: '#064e3b',
      spawnPoints: {
        default: { x: 180, y: 500 },
        under_willow: { x: 180, y: 500 },
        near_rabbit_hole: { x: 1600, y: 480 }
      },
      renderTerrain(ctx, area, camX, camY, viewW, viewH) {
        const time = (root.StoryGame && root.StoryGame.renderer) ? root.StoryGame.renderer.renderTime : 0;

        // 1. Rich Layered Woodland Floor (Dark forest green with sun-dappled glades)
        const baseGrad = ctx.createLinearGradient(0, 0, 0, area.height);
        baseGrad.addColorStop(0, '#093622');
        baseGrad.addColorStop(0.3, '#14532d');
        baseGrad.addColorStop(0.7, '#166534');
        baseGrad.addColorStop(1, '#064e3b');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Soft Dappled Moss & Light Clearings (Sun-dappled woodland spots)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.14)';
        const dapples = [
          [220, 480, 180, 90], [520, 430, 200, 100], [840, 500, 220, 110],
          [1140, 460, 210, 105], [1460, 430, 230, 115], [1740, 470, 240, 120],
          [350, 720, 190, 95], [920, 750, 210, 100], [1480, 720, 200, 95]
        ];
        for (const [dx, dy, dw, dh] of dapples) {
          ctx.beginPath();
          ctx.ellipse(dx, dy, dw, dh, 0.15, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Organic Winding Woodland Dirt & Cobblestone Trail
        // Path Border: Deep loam earth & moss fringing
        ctx.save();
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 76;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(100, 510);
        ctx.quadraticCurveTo(380, 510, 680, 440);
        ctx.quadraticCurveTo(920, 520, 1120, 460);
        ctx.quadraticCurveTo(1380, 420, 1600, 480);
        ctx.lineTo(1760, 460);
        ctx.stroke();

        // Inner Path: Sandy earthen woodland trail
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 62;
        ctx.stroke();

        // Fine Gravel & Weathered Cobblestone Centers
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 44;
        ctx.stroke();

        // Individual Hand-Laid River Cobblestones along the trail
        ctx.fillStyle = '#a16207';
        const cobbleCoords = [
          [140, 510], [220, 508], [310, 506], [410, 498], [500, 478],
          [590, 456], [680, 442], [770, 458], [850, 485], [930, 512],
          [1010, 505], [1080, 482], [1140, 462], [1220, 448], [1300, 436],
          [1380, 428], [1460, 442], [1530, 462], [1610, 476], [1690, 468]
        ];
        for (const [cx, cy] of cobbleCoords) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, 7, 4.5, 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.ellipse(cx - 1, cy - 1, 4, 2, 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#a16207';
        }
        ctx.restore();

        // 3. Living Animated Forest Stream / Pond on Bottom Left
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          root.StoryArt.EnvironmentRenderer.renderWater(ctx, 180, 820, 440, 220, time);
        }

        // 4. Wildflowers & Undergrowth Scattered Across Rabbit Woods
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          const floraField = [
            [220, 380, 'buttercup'], [260, 420, 'bluebell'], [310, 390, 'bluebell'],
            [460, 390, 'buttercup'], [530, 370, 'bluebell'], [610, 390, 'buttercup'],
            [730, 360, 'bluebell'], [810, 390, 'buttercup'], [880, 370, 'bluebell'],
            [1040, 390, 'buttercup'], [1180, 380, 'bluebell'], [1260, 370, 'buttercup'],
            [1420, 360, 'bluebell'], [1500, 380, 'buttercup'], [1640, 370, 'bluebell'],
            [240, 620, 'bluebell'], [340, 650, 'buttercup'], [460, 610, 'bluebell'],
            [680, 620, 'buttercup'], [780, 640, 'bluebell'], [870, 610, 'buttercup'],
            [1020, 640, 'bluebell'], [1130, 620, 'buttercup'], [1240, 640, 'bluebell'],
            [1380, 610, 'buttercup'], [1490, 630, 'bluebell'], [1620, 610, 'buttercup']
          ];
          for (const [fx, fy, ftype] of floraField) {
            root.StoryArt.EnvironmentRenderer.renderFlora(ctx, fx, fy, ftype, time);
          }
        }
      }
    });

    // Perimeter Solid Boundaries
    rabbitWoodsArea.addObstacle({ x: 0, y: 0, width: 2000, height: 80 }); // Top border
    rabbitWoodsArea.addObstacle({ x: 0, y: 1120, width: 2000, height: 80 }); // Bottom border
    rabbitWoodsArea.addObstacle({ x: 0, y: 0, width: 60, height: 1200 }); // Left border
    rabbitWoodsArea.addObstacle({ x: 1940, y: 0, width: 60, height: 1200 }); // Right border

    // Outer Boundary Trees (Ancient Oaks & Silver Birches framing the wood)
    // Top border trees
    for (let x = 10; x < 2000; x += 110) {
      rabbitWoodsArea.addEntity(new SceneryProp({
        id: `tree-top-${x}`,
        x,
        y: 25,
        propType: 'tree',
        treeType: (x % 220 === 0 ? 'birch' : 'oak'),
        width: 85,
        height: 110
      }));
    }

    // Bottom border trees
    for (let x = 10; x < 2000; x += 115) {
      if (x < 160 || x > 640) { // Keep pond view open
        rabbitWoodsArea.addEntity(new SceneryProp({
          id: `tree-bot-${x}`,
          x,
          y: 1070,
          propType: 'tree',
          treeType: (x % 230 === 0 ? 'birch' : 'oak'),
          width: 85,
          height: 110
        }));
      }
    }

    // Left border trees (leaving path open)
    for (let y = 110; y < 1060; y += 125) {
      if (y < 430 || y > 580) {
        rabbitWoodsArea.addEntity(new SceneryProp({
          id: `tree-left-${y}`,
          x: 20,
          y,
          propType: 'tree',
          treeType: (y % 250 === 0 ? 'birch' : 'oak'),
          width: 80,
          height: 105
        }));
      }
    }

    // Right border trees behind the Giant Oak
    for (let y = 110; y < 1060; y += 125) {
      rabbitWoodsArea.addEntity(new SceneryProp({
        id: `tree-right-${y}`,
        x: 1910,
        y,
        propType: 'tree',
        treeType: (y % 250 === 0 ? 'birch' : 'oak'),
        width: 85,
        height: 110
      }));
    }

    // =========================================================================
    // 2. SCENERY PROPS & WONDERLAND ELEMENTS
    // =========================================================================

    // The Great Weeping Willow where Alice begins
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'tree-weeping-willow',
      x: 100,
      y: 350,
      propType: 'tree',
      treeType: 'oak',
      width: 130,
      height: 155
    }));

    // Mossy Boulders
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'rock-entry-glade',
      x: 320,
      y: 600,
      propType: 'rock',
      width: 65,
      height: 48
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'rock-watch-glade',
      x: 1060,
      y: 530,
      propType: 'rock',
      width: 72,
      height: 52
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'rock-hollow-oak',
      x: 1580,
      y: 540,
      propType: 'rock',
      width: 68,
      height: 50
    }));

    // Oak clusters along the winding trail
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'oak-trail-north-1',
      x: 580,
      y: 260,
      propType: 'tree',
      treeType: 'oak',
      width: 105,
      height: 135
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'oak-trail-south-1',
      x: 780,
      y: 580,
      propType: 'tree',
      treeType: 'oak',
      width: 110,
      height: 140
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'oak-trail-north-2',
      x: 1220,
      y: 250,
      propType: 'tree',
      treeType: 'birch',
      width: 95,
      height: 130
    }));

    // Giant Wonderland Mushrooms framing the environment
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-red-1',
      x: 480,
      y: 320,
      propType: 'giant_mushroom',
      mushroomType: 'red',
      width: 58,
      height: 64
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-blue-1',
      x: 940,
      y: 360,
      propType: 'giant_mushroom',
      mushroomType: 'glowing_blue',
      width: 54,
      height: 60
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-purple-1',
      x: 1320,
      y: 540,
      propType: 'giant_mushroom',
      mushroomType: 'purple',
      width: 52,
      height: 58
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-red-2',
      x: 1500,
      y: 320,
      propType: 'giant_mushroom',
      mushroomType: 'red',
      width: 62,
      height: 68
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-blue-2',
      x: 1810,
      y: 350,
      propType: 'giant_mushroom',
      mushroomType: 'glowing_blue',
      width: 58,
      height: 64
    }));

    // Rustic Signposts
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'signpost-rabbit-trail',
      x: 430,
      y: 520,
      propType: 'signpost',
      signTitle: 'RABBIT TRAIL',
      width: 55,
      height: 52,
      isInteractable: true,
      signText: '🐇 Rabbit Trail ahead! Follow the path to the Giant Oak!'
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'signpost-hollow-oak',
      x: 1510,
      y: 470,
      propType: 'signpost',
      signTitle: 'HOLLOW OAK',
      width: 55,
      height: 52,
      isInteractable: true,
      signText: '🌳 The Giant Hollow Oak. Mind the deep rabbit hole at the roots!'
    }));

    // =========================================================================
    // 3. STORY CHARACTERS & OBJECTS
    // =========================================================================

    // Colossal Hollow Oak & Rabbit Hole at the end of the trail
    const rabbitHole = new RabbitHole({
      id: 'prop-rabbit-hole',
      x: 1680,
      y: 390,
      width: 140,
      height: 140
    });
    rabbitWoodsArea.addEntity(rabbitHole);

    // The White Rabbit NPC
    const whiteRabbit = new WhiteRabbit({
      id: 'npc-white-rabbit',
      x: 440,
      y: 490,
      speed: 175,
      waypoints: [
        { x: 440, y: 490 },
        { x: 680, y: 440 },
        { x: 920, y: 520 },
        { x: 1140, y: 460 },
        { x: 1380, y: 420 },
        { x: 1600, y: 480 },
        { x: 1675, y: 485 }
      ]
    });
    rabbitWoodsArea.addEntity(whiteRabbit);

    world.registerArea(rabbitWoodsArea);

    // =========================================================================
    // 4. QUEST REGISTRATION
    // =========================================================================
    const questRabbitWatch = {
      id: 'rabbit_watch',
      title: "The White Rabbit's Watch",
      description: 'Follow the frantic White Rabbit through the woods, retrieve his dropped pocket watch, and return it to him at the Giant Hollow Oak!',
      rewardXP: 100,
      objectives: [
        { id: 'follow_rabbit', text: 'Follow the frantic White Rabbit down the trail' },
        { id: 'find_watch', text: 'Pick up the Golden Pocket Watch dropped on the trail' },
        { id: 'return_watch', text: 'Return the watch to the White Rabbit at the Giant Hollow Oak' }
      ]
    };

    // =========================================================================
    // 5. DIALOGUE TREE REGISTRATION
    // =========================================================================
    const rabbitIntroDialogue = [
      {
        speaker: 'White Rabbit',
        text: 'Oh dear, oh dear! Look at the time! I shall be too late!',
        voiceCue: 'rabbit_voice_late',
        startQuest: 'rabbit_watch'
      },
      {
        speaker: 'White Rabbit',
        text: 'The Duchess! She will be furious if I keep her waiting! I must run!'
      }
    ];

    const rabbitWaitingDialogue = [
      {
        speaker: 'White Rabbit',
        text: 'Oh no, oh no! Where is it?! Where is my golden pocket watch?!',
        voiceCue: 'rabbit_voice_watch'
      },
      {
        speaker: 'White Rabbit',
        text: 'I cannot tell how late I am without my watch! Please, did you find it along the path?'
      }
    ];

    const rabbitWatchReturnedDialogue = [
      {
        speaker: 'White Rabbit',
        text: 'My pocket watch! You found it! Oh thank goodness! Thank you, kind girl!',
        voiceCue: 'rabbit_voice_thanks'
      },
      {
        speaker: 'White Rabbit',
        text: 'Look at the hands—ten to twelve! No time to lose—down the rabbit hole I go! Goodbye!'
      }
    ];

    const aliceStoryIntroDialogue = [
      {
        speaker: 'Alice',
        text: 'What a curious white rabbit with a red waistcoat! And why is he in such a dreadful hurry?'
      }
    ];

    return {
      world,
      quests: [questRabbitWatch],
      dialogues: {
        rabbit_intro: rabbitIntroDialogue,
        rabbit_waiting_for_watch: rabbitWaitingDialogue,
        rabbit_watch_returned: rabbitWatchReturnedDialogue,
        alice_story_intro: aliceStoryIntroDialogue
      }
    };
  }

  root.StoryAliceWoods = {
    createRabbitWoodsWorld
  };

})(window);
