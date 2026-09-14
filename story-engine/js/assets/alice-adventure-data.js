/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — ALICE IN WONDERLAND
 * COMPLETE 9-CHAPTER STORY ADVENTURE WORLD DATA
 * 
 * Connected 9-Chapter Narrative Arc:
 * 1. rabbit_woods      - The Chase & The Lost Pocket Watch
 * 2. rabbit_hole       - The Great Fall with Floating Curiosities
 * 3. hall_of_doors     - Drink Me & Eat Me Scale Transformation
 * 4. mushroom_garden   - The Blue Caterpillar & Alphabet Smoke Rings
 * 5. tulgey_woods      - The Vanishing Cheshire Cat & Branching Path Riddles
 * 6. tea_party         - The Mad Tea Party & Clean Cup Rotation
 * 7. queens_garden     - Painting White Roses Red & Royal Croquet
 * 8. royal_court       - The Trial of the Stolen Tarts
 * 9. awakening_bank    - Riverbank Awakening & +300 XP Story Master Celebration
 * 
 * Fully integrated with CEFR A1/A1+ Vocabulary Targets & Story Systems.
 * ============================================================================
 */

(function(root) {
  'use strict';

  function createAliceAdventureWorld() {
    const { Area, World } = root.StoryWorld;
    const { 
      NPC, Collectible, Door, RabbitHoleGate, DriedLeavesLanding, FallingPassageTrigger, SceneryProp, WhiteRabbit, PocketWatch, RabbitHole,
      GlassTable, DrinkMeBottle, EatMeCake, TinyDoor, Caterpillar, CheshireCat,
      MadHatter, MarchHare, Dormouse, CardGardener, RoseTree,
      QueenOfHearts, KingOfHearts, TartPlatter, FallingCuriosity
    } = root.StoryEntities;

    const world = new World();

    // =========================================================================
    // CHAPTER 1: RABBIT WOODS (2000 x 1200)
    // =========================================================================
    const rabbitWoodsArea = new Area({
      id: 'rabbit_woods',
      name: 'Rabbit Woods',
      width: 2000,
      height: 1200,
      movementMode: 'standard',
      backgroundColor: '#064e3b',
      spawnPoints: {
        default: { x: 280, y: 520 },
        under_willow: { x: 280, y: 520 },
        near_rabbit_hole: { x: 1600, y: 480 }
      },
      renderTerrain(ctx, area, camX, camY, viewW, viewH) {
        const time = (root.StoryGame && root.StoryGame.renderer) ? root.StoryGame.renderer.renderTime : 0;

        // 1. Organic Rolling Woodland Floor with Storybook Horizon Ridge
        // Ground starts at horizon ridge (Y: 230-260), allowing bg_forest_canopy to shine through!
        const horizonY = 240;

        const baseGrad = ctx.createLinearGradient(0, horizonY, 0, area.height);
        baseGrad.addColorStop(0, '#14532d');
        baseGrad.addColorStop(0.18, '#166534');
        baseGrad.addColorStop(0.45, '#15803d');
        baseGrad.addColorStop(0.8, '#14532d');
        baseGrad.addColorStop(1, '#064e3b');
        ctx.fillStyle = baseGrad;

        // Draw ground starting along the rolling horizon ridge
        ctx.beginPath();
        ctx.moveTo(0, horizonY + 20);
        ctx.bezierCurveTo(280, horizonY - 18, 620, horizonY + 22, 960, horizonY - 8);
        ctx.bezierCurveTo(1320, horizonY + 20, 1680, horizonY - 14, area.width, horizonY + 12);
        ctx.lineTo(area.width, area.height);
        ctx.lineTo(0, area.height);
        ctx.closePath();
        ctx.fill();

        // Atmospheric misty ridge transition (soft blend into canopy)
        const ridgeGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 45);
        ridgeGrad.addColorStop(0, 'rgba(6, 78, 59, 0.0)');
        ridgeGrad.addColorStop(0.5, 'rgba(6, 78, 59, 0.35)');
        ridgeGrad.addColorStop(1, 'rgba(20, 83, 45, 0.65)');
        ctx.fillStyle = ridgeGrad;
        ctx.beginPath();
        ctx.moveTo(0, horizonY + 20);
        ctx.bezierCurveTo(280, horizonY - 18, 620, horizonY + 22, 960, horizonY - 8);
        ctx.bezierCurveTo(1320, horizonY + 20, 1680, horizonY - 14, area.width, horizonY + 12);
        ctx.lineTo(area.width, horizonY + 55);
        ctx.lineTo(0, horizonY + 55);
        ctx.closePath();
        ctx.fill();

        // Soft animated golden sunbeams radiating from the canopy
        ctx.save();
        const rayAlpha = 0.05 + Math.sin(time * 0.8) * 0.02;
        ctx.fillStyle = `rgba(254, 240, 138, ${rayAlpha})`;
        const rays = [
          [180, 0, 180, 700],
          [640, 0, 220, 750],
          [1080, 0, 200, 800],
          [1540, 0, 240, 750]
        ];
        for (const [rx, ry, rw, rh] of rays) {
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx + rw * 0.5, ry);
          ctx.lineTo(rx + rw * 1.35, ry + rh);
          ctx.lineTo(rx + rw * 0.65, ry + rh);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Soft Dappled Moss & Light Clearings with organic radial feathering (no hard rings!)
        const sunClearings = [
          [280, 520, 140], [580, 480, 150], [880, 520, 160],
          [1160, 480, 150], [1440, 450, 150], [1720, 480, 170],
          [400, 720, 140], [920, 750, 160], [1480, 720, 150]
        ];
        for (const [cx, cy, radius] of sunClearings) {
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(134, 239, 172, 0.14)');
          grad.addColorStop(0.5, 'rgba(74, 222, 128, 0.07)');
          grad.addColorStop(1, 'rgba(20, 83, 45, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Warm golden center pool
          const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.55);
          sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.10)');
          sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Organic Winding Woodland Dirt & Cobblestone Trail
        // Path Border: Deep loam earth & moss fringing
        ctx.save();
        ctx.strokeStyle = '#2d1808';
        ctx.lineWidth = 86;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(100, 510);
        ctx.quadraticCurveTo(380, 510, 680, 440);
        ctx.quadraticCurveTo(920, 520, 1120, 460);
        ctx.quadraticCurveTo(1380, 420, 1600, 480);
        ctx.lineTo(1760, 460);
        ctx.stroke();

        // Mid Path: Warm rich earthen woodland trail
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 66;
        ctx.stroke();

        // Inner Path: Warm amber soil
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 46;
        ctx.stroke();

        // Sunlit path center: Fawn loam
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 26;
        ctx.stroke();

        // Individual Hand-Laid River Cobblestones along the trail
        ctx.fillStyle = '#713f12';
        const cobbleCoords = [
          [140, 510], [220, 508], [310, 506], [410, 498], [500, 478],
          [590, 456], [680, 442], [770, 458], [850, 485], [930, 512],
          [1010, 505], [1080, 482], [1140, 462], [1220, 448], [1300, 436],
          [1380, 428], [1460, 442], [1530, 462], [1610, 476], [1690, 468]
        ];
        for (const [cx, cy] of cobbleCoords) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, 8, 5, 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.ellipse(cx - 1, cy - 1, 5, 2.5, 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.ellipse(cx - 2, cy - 2, 2, 1, 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#713f12';
        }
        ctx.restore();

        // 3. Living Animated Forest Pond on Bottom Left
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          root.StoryArt.EnvironmentRenderer.renderWater(ctx, 160, 810, 460, 260, time);
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
      },
      renderForeground(ctx, camX, camY, viewW, viewH) {
        // Subtle foreground foliage vignette in corners
        ctx.save();
        ctx.fillStyle = 'rgba(6, 78, 59, 0.45)';
        ctx.beginPath();
        ctx.arc(-20, -20, 160, 0, Math.PI / 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(viewW + 20, -20, 160, Math.PI / 2, Math.PI);
        ctx.fill();
        ctx.restore();
      }
    });

    // Perimeter Solid Boundaries
    rabbitWoodsArea.addObstacle({ x: 0, y: 0, width: 2000, height: 230 });
    rabbitWoodsArea.addObstacle({ x: 0, y: 1120, width: 2000, height: 80 });
    rabbitWoodsArea.addObstacle({ x: 0, y: 0, width: 50, height: 1200 });
    rabbitWoodsArea.addObstacle({ x: 1940, y: 0, width: 60, height: 1200 });
    // Pond Water Collision
    rabbitWoodsArea.addObstacle({ x: 190, y: 840, width: 400, height: 200 });

    // Boundary Trees Framing Rabbit Woods
    // Top border trees staggered naturally along the horizon ridge
    for (let x = 20; x < 2000; x += 95) {
      const jitterY = 95 + Math.sin(x * 0.05) * 15;
      rabbitWoodsArea.addEntity(new SceneryProp({
        id: `tree-top-${x}`,
        x,
        y: jitterY,
        propType: 'tree',
        treeType: 'oak',
        width: 110 + (x % 3) * 10,
        height: 140 + (x % 2) * 15
      }));
    }

    // Bottom border trees (leaving pond visible)
    for (let x = 15; x < 2000; x += 110) {
      if (x < 140 || x > 660) {
        rabbitWoodsArea.addEntity(new SceneryProp({
          id: `tree-bot-${x}`,
          x,
          y: 1060 + (x % 30),
          propType: 'tree',
          treeType: 'oak',
          width: 105,
          height: 135
        }));
      }
    }

    // Left border trees (leaving path entrance open)
    const leftTreePos = [[15, 260], [35, 370], [15, 660], [35, 790], [20, 920], [30, 1040]];
    for (const [tx, ty] of leftTreePos) {
      rabbitWoodsArea.addEntity(new SceneryProp({
        id: `tree-left-${ty}`,
        x: tx,
        y: ty,
        propType: 'tree',
        treeType: 'oak',
        width: 100,
        height: 130
      }));
    }

    // Right border trees behind the Hollow Oak
    const rightTreePos = [[1910, 260], [1925, 380], [1905, 520], [1920, 660], [1910, 800], [1925, 940], [1915, 1050]];
    for (const [tx, ty] of rightTreePos) {
      rabbitWoodsArea.addEntity(new SceneryProp({
        id: `tree-right-${ty}`,
        x: tx,
        y: ty,
        propType: 'tree',
        treeType: 'oak',
        width: 105,
        height: 135
      }));
    }

    // =========================================================================
    // SCENERY PROPS & WONDERLAND FLORA
    // =========================================================================

    // The Great Weeping Willow where Alice begins
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'tree-weeping-willow',
      x: 110,
      y: 340,
      propType: 'tree',
      treeType: 'oak',
      width: 140,
      height: 165
    }));

    // Mossy Boulders (Hand-crafted storybook assets)
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'rock-entry-glade',
      x: 330,
      y: 615,
      propType: 'rock',
      width: 75,
      height: 60,
      isInteractable: true,
      interactionPrompt: 'Examine Boulder',
      examineText: 'An ancient boulder covered in soft emerald moss. Little bluebells grow in its cracks.'
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'rock-watch-glade',
      x: 1080,
      y: 530,
      propType: 'rock',
      width: 80,
      height: 65
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'rock-hollow-oak',
      x: 1600,
      y: 530,
      propType: 'rock',
      width: 80,
      height: 65
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'rock-pond-side',
      x: 640,
      y: 880,
      propType: 'rock',
      width: 75,
      height: 60,
      isInteractable: true,
      interactionPrompt: 'Examine Pond',
      examineText: 'A tranquil forest pond. Pink water lilies float serenely, and a dragonfly flutters past.'
    }));

    // Interior Fairytale Oak clusters along the winding trail
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'oak-trail-north-1',
      x: 640,
      y: 260,
      propType: 'tree',
      treeType: 'oak',
      width: 115,
      height: 145
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'oak-trail-south-1',
      x: 820,
      y: 580,
      propType: 'tree',
      treeType: 'oak',
      width: 115,
      height: 145
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'oak-trail-north-2',
      x: 1240,
      y: 250,
      propType: 'tree',
      treeType: 'oak',
      width: 110,
      height: 140
    }));

    // Giant Wonderland Toadstools (Hand-crafted storybook assets)
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-entry-glade',
      x: 380,
      y: 400,
      propType: 'giant_mushroom',
      mushroomType: 'red',
      width: 68,
      height: 74,
      isInteractable: true,
      interactionPrompt: 'Examine Toadstool',
      examineText: 'Colossal fairytale toadstools with white spots. They smell faintly of sweet woodland earth.'
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-trail-mid',
      x: 990,
      y: 410,
      propType: 'giant_mushroom',
      mushroomType: 'red',
      width: 68,
      height: 74,
      isInteractable: true,
      interactionPrompt: 'Examine Toadstool',
      examineText: 'A bright red woodland toadstool. The White Rabbit hurried right past here!'
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-trail-east',
      x: 1340,
      y: 530,
      propType: 'giant_mushroom',
      mushroomType: 'red',
      width: 68,
      height: 74
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-hollow-oak',
      x: 1500,
      y: 390,
      propType: 'giant_mushroom',
      mushroomType: 'red',
      width: 72,
      height: 78
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'shroom-pond-shore',
      x: 640,
      y: 770,
      propType: 'giant_mushroom',
      mushroomType: 'red',
      width: 70,
      height: 76
    }));

    // Rustic Storybook Signposts (Carved timber assets)
    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'signpost-rabbit-trail',
      x: 470,
      y: 525,
      propType: 'signpost',
      signTitle: 'RABBIT TRAIL',
      width: 50,
      height: 70,
      isInteractable: true,
      signText: '🐇 Rabbit Trail ahead! Follow the White Rabbit to the Hollow Oak!'
    }));

    rabbitWoodsArea.addEntity(new SceneryProp({
      id: 'signpost-hollow-oak',
      x: 1530,
      y: 440,
      propType: 'signpost',
      signTitle: 'HOLLOW OAK',
      width: 50,
      height: 70,
      isInteractable: true,
      signText: '🌳 The Giant Hollow Oak. Mind the deep rabbit hole at the roots!'
    }));

    // =========================================================================
    // CHAPTER 1 CHARACTERS & OBJECTS
    // =========================================================================

    const rabbitHole = new RabbitHole({
      id: 'prop-rabbit-hole',
      x: 1680,
      y: 360,
      width: 170,
      height: 170,
      targetArea: 'rabbit_hole',
      targetSpawn: 'top'
    });
    rabbitWoodsArea.addEntity(rabbitHole);

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
    // CHAPTER 2: THE GREAT FALL (RABBIT HOLE - 1400 x 2600)
    // =========================================================================
    const rabbitHoleArea = new Area({
      id: 'rabbit_hole',
      name: 'The Great Fall',
      width: 1400,
      height: 2600,
      movementMode: 'standard',
      backgroundColor: '#070a16',
      hasSkyBackdrop: false,
      spawnPoints: {
        default: { x: 700, y: 110 },
        top: { x: 700, y: 110 },
        bottom: { x: 700, y: 2420 }
      },
      renderTerrain(ctx, area) {
        // Deep mystical vertical well gradient
        const grad = ctx.createLinearGradient(0, 0, 0, area.height);
        grad.addColorStop(0, '#111827');
        grad.addColorStop(0.12, '#1e1b4b');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(0.85, '#172554');
        grad.addColorStop(1, '#030712');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Upper chamber stone floor (Y: 0..320, X: 520..880)
        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.fillRect(520, 0, 360, 320);

        // Side well masonry walls (extend infinitely to sides to fill full viewport seamlessly)
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(-2000, 0, 2420, area.height);
        ctx.fillRect(980, 0, 2500, area.height);

        // Well wall brick seams and masonry
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        for (let y = 0; y < area.height; y += 60) {
          ctx.strokeRect(20, y, 390, 30);
          ctx.strokeRect(990, y + 30, 390, 30);
        }

        // Shaft inner edge borders (mystical glowing vertical edge)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(420, 0); ctx.lineTo(420, area.height);
        ctx.moveTo(980, 0); ctx.lineTo(980, area.height);
        ctx.stroke();

        // Bottom landing room floor (Y: 2280..2600)
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(480, 2280, 440, 320);
      }
    });

    // Upper chamber obstacles
    rabbitHoleArea.addObstacle({ x: 0, y: 0, width: 550, height: 320 });
    rabbitHoleArea.addObstacle({ x: 850, y: 0, width: 550, height: 320 });
    rabbitHoleArea.addObstacle({ x: 0, y: 0, width: 1400, height: 40 });

    // Vertical shaft walls
    rabbitHoleArea.addObstacle({ x: 0, y: 320, width: 420, height: 1980 });
    rabbitHoleArea.addObstacle({ x: 980, y: 320, width: 420, height: 1980 });

    // Bottom landing obstacles
    rabbitHoleArea.addObstacle({ x: 0, y: 2300, width: 480, height: 300 });
    rabbitHoleArea.addObstacle({ x: 920, y: 2300, width: 480, height: 300 });
    rabbitHoleArea.addObstacle({ x: 0, y: 2560, width: 1400, height: 40 });

    // Top entrance gate to the falling passage
    rabbitHoleArea.addEntity(new RabbitHoleGate({
      id: 'gate-falling-passage',
      x: 650,
      y: 240,
      width: 100,
      height: 90
    }));

    // Falling passage trigger volume past the gate
    rabbitHoleArea.addEntity(new FallingPassageTrigger({
      id: 'trigger-falling-passage',
      x: 420,
      y: 320,
      width: 560,
      height: 40
    }));

    // Floating curiosities down the well
    const curiosityTypes = ['marmalade', 'clock', 'book', 'teacup', 'lamp', 'mirror'];
    for (let y = 450; y <= 2150; y += 150) {
      const xPos = 500 + ((y * 7) % 360);
      const cType = curiosityTypes[(y / 150) % curiosityTypes.length];
      rabbitHoleArea.addEntity(new FallingCuriosity({
        id: `curiosity-${y}`,
        x: xPos,
        y: y,
        curiosityType: cType
      }));
    }

    // Bottom landing pile of dried autumn leaves
    rabbitHoleArea.addEntity(new DriedLeavesLanding({
      id: 'leaves-landing',
      x: 550,
      y: 2320,
      width: 300,
      height: 70
    }));

    // Arched passageway into Wonderland / Hall of Doors
    rabbitHoleArea.addEntity(new Door({
      id: 'door-to-hall-of-doors',
      name: 'Passage into Wonderland',
      x: 655,
      y: 2470,
      width: 90,
      height: 90,
      isOpen: true,
      isArchedPassage: true,
      interactionPrompt: 'Enter Wonderland',
      targetArea: 'hall_of_doors',
      targetSpawn: 'default'
    }));

    world.registerArea(rabbitHoleArea);

    // =========================================================================
    // CHAPTER 3: HALL OF DOORS (1600 x 1000)
    // =========================================================================
    const hallOfDoorsArea = new Area({
      id: 'hall_of_doors',
      name: 'The Hall of Doors',
      width: 1600,
      height: 1000,
      movementMode: 'standard',
      ambientType: 'indoor',
      hasSkyBackdrop: false,
      backgroundColor: '#1e1b4b',
      spawnPoints: {
        default: { x: 220, y: 500 },
        table: { x: 750, y: 500 },
        door: { x: 1380, y: 500 }
      },
      renderTerrain(ctx, area) {
        // Deep Victorian Indigo Hall floor
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, area.width, area.height);

        // Subtle architectural wall baseboard moulding
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, area.width, 90);
        ctx.fillRect(0, area.height - 90, area.width, 90);
        ctx.fillRect(0, 0, 60, area.height);
        ctx.fillRect(area.width - 60, 0, 60, area.height);

        // Gold trim moulding accents
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 90, area.width - 120, area.height - 180);
      }
    });

    hallOfDoorsArea.addObstacle({ x: 0, y: 0, width: 1600, height: 90 });
    hallOfDoorsArea.addObstacle({ x: 0, y: 910, width: 1600, height: 90 });
    hallOfDoorsArea.addObstacle({ x: 0, y: 0, width: 60, height: 1000 });
    hallOfDoorsArea.addObstacle({ x: 1540, y: 0, width: 60, height: 1000 });

    // Solid Glass Three-Legged Table
    const glassTable = new GlassTable({
      id: 'prop-glass-table',
      x: 720,
      y: 480,
      width: 120,
      height: 60
    });
    hallOfDoorsArea.addEntity(glassTable);

    // "Drink Me" Bottle sitting on top of the Glass Table (revealed upon table inspection)
    const drinkMeBottle = new DrinkMeBottle({
      id: 'prop-drink-me',
      x: 760,
      y: 450,
      isRevealed: false
    });
    hallOfDoorsArea.addEntity(drinkMeBottle);

    // "Eat Me" Currant Cake
    hallOfDoorsArea.addEntity(new EatMeCake({
      id: 'prop-eat-me',
      x: 900,
      y: 480
    }));

    // Tiny 15-inch Golden Door at the far wall (leads to Queen's Croquet Ground)
    const tinyDoor = new TinyDoor({
      id: 'prop-tiny-door',
      x: 1460,
      y: 460,
      targetArea: 'queens_garden',
      targetSpawn: 'default'
    });
    hallOfDoorsArea.addEntity(tinyDoor);

    world.registerArea(hallOfDoorsArea);

    // =========================================================================
    // CHAPTER 4: MUSHROOM GARDEN (1800 x 1100)
    // =========================================================================
    const mushroomGardenArea = new Area({
      id: 'mushroom_garden',
      name: 'The Mushroom Garden',
      width: 1800,
      height: 1100,
      backgroundColor: '#064e3b',
      spawnPoints: {
        default: { x: 180, y: 520 },
        caterpillar: { x: 850, y: 500 }
      },
      renderTerrain(ctx, area) {
        const grad = ctx.createLinearGradient(0, 0, 0, area.height);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(1, '#022c22');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, area.width, area.height);
      }
    });

    mushroomGardenArea.addObstacle({ x: 0, y: 0, width: 1800, height: 80 });
    mushroomGardenArea.addObstacle({ x: 0, y: 1020, width: 1800, height: 80 });
    mushroomGardenArea.addObstacle({ x: 0, y: 0, width: 60, height: 1100 });
    mushroomGardenArea.addObstacle({ x: 1740, y: 0, width: 60, height: 1100 });

    // Blue Caterpillar on Giant Mushroom
    mushroomGardenArea.addEntity(new Caterpillar({
      id: 'npc-caterpillar',
      x: 900,
      y: 480
    }));

    // Garden exit to Tulgey Woods
    mushroomGardenArea.addEntity(new Door({
      id: 'door-to-tulgey',
      x: 1680,
      y: 500,
      width: 60,
      height: 60,
      targetArea: 'tulgey_woods',
      targetSpawn: 'default'
    }));

    world.registerArea(mushroomGardenArea);

    // =========================================================================
    // CHAPTER 5: TULGEY WOODS (2000 x 1200)
    // =========================================================================
    const tulgeyWoodsArea = new Area({
      id: 'tulgey_woods',
      name: 'Tulgey Woods',
      width: 2000,
      height: 1200,
      backgroundColor: '#1e1b4b',
      spawnPoints: {
        default: { x: 180, y: 520 },
        cheshire: { x: 920, y: 460 }
      },
      renderTerrain(ctx, area) {
        const grad = ctx.createLinearGradient(0, 0, 0, area.height);
        grad.addColorStop(0, '#111827');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, area.width, area.height);
      }
    });

    tulgeyWoodsArea.addObstacle({ x: 0, y: 0, width: 2000, height: 80 });
    tulgeyWoodsArea.addObstacle({ x: 0, y: 1120, width: 2000, height: 80 });
    tulgeyWoodsArea.addObstacle({ x: 0, y: 0, width: 60, height: 1200 });
    tulgeyWoodsArea.addObstacle({ x: 1940, y: 0, width: 60, height: 1200 });

    // Floating Cheshire Cat
    tulgeyWoodsArea.addEntity(new CheshireCat({
      id: 'npc-cheshire-cat',
      x: 960,
      y: 440
    }));

    // Path to Mad Tea Party
    tulgeyWoodsArea.addEntity(new Door({
      id: 'door-to-tea-party',
      x: 1860,
      y: 500,
      width: 60,
      height: 60,
      targetArea: 'tea_party',
      targetSpawn: 'default'
    }));

    world.registerArea(tulgeyWoodsArea);

    // =========================================================================
    // CHAPTER 6: THE MAD TEA PARTY (1800 x 1100)
    // =========================================================================
    const teaPartyArea = new Area({
      id: 'tea_party',
      name: 'The Mad Tea Party',
      width: 1800,
      height: 1100,
      backgroundColor: '#14532d',
      spawnPoints: {
        default: { x: 200, y: 520 },
        table: { x: 750, y: 520 }
      },
      renderTerrain(ctx, area) {
        const grad = ctx.createLinearGradient(0, 0, 0, area.height);
        grad.addColorStop(0, '#15803d');
        grad.addColorStop(1, '#14532d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Long Tea Party Table
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          root.StoryArt.EnvironmentRenderer.renderTeaPartyTable(ctx, 600, 480, 500, 120);
        }
      }
    });

    teaPartyArea.addObstacle({ x: 0, y: 0, width: 1800, height: 80 });
    teaPartyArea.addObstacle({ x: 0, y: 1020, width: 1800, height: 80 });
    teaPartyArea.addObstacle({ x: 0, y: 0, width: 60, height: 1100 });
    teaPartyArea.addObstacle({ x: 1740, y: 0, width: 60, height: 1100 });

    teaPartyArea.addEntity(new MadHatter({
      id: 'npc-mad-hatter',
      x: 700,
      y: 430
    }));

    teaPartyArea.addEntity(new MarchHare({
      id: 'npc-march-hare',
      x: 950,
      y: 430
    }));

    teaPartyArea.addEntity(new Dormouse({
      id: 'npc-dormouse',
      x: 825,
      y: 460
    }));

    // Exit to Queen's Garden
    teaPartyArea.addEntity(new Door({
      id: 'door-to-queens-garden',
      x: 1680,
      y: 500,
      width: 60,
      height: 60,
      targetArea: 'queens_garden',
      targetSpawn: 'default'
    }));

    world.registerArea(teaPartyArea);

    // =========================================================================
    // CHAPTER 7: QUEEN'S CROQUET GROUND (2000 x 1200)
    // =========================================================================
    const queensGardenArea = new Area({
      id: 'queens_garden',
      name: "The Queen's Croquet Ground",
      width: 2000,
      height: 1200,
      backgroundColor: '#166534',
      spawnPoints: {
        default: { x: 200, y: 520 },
        rose_tree: { x: 700, y: 500 }
      },
      renderTerrain(ctx, area) {
        ctx.fillStyle = '#166534';
        ctx.fillRect(0, 0, area.width, area.height);
      }
    });

    queensGardenArea.addObstacle({ x: 0, y: 0, width: 2000, height: 80 });
    queensGardenArea.addObstacle({ x: 0, y: 1120, width: 2000, height: 80 });
    queensGardenArea.addObstacle({ x: 0, y: 0, width: 60, height: 1200 });
    queensGardenArea.addObstacle({ x: 1940, y: 0, width: 60, height: 1200 });

    // Card Gardener Two painting white roses red
    queensGardenArea.addEntity(new CardGardener({
      id: 'npc-card-gardener-two',
      x: 620,
      y: 490,
      cardRank: '2',
      cardSuit: 'spade'
    }));

    queensGardenArea.addEntity(new RoseTree({
      id: 'prop-rose-tree-1',
      x: 740,
      y: 480,
      isPaintedRed: false
    }));

    // Croquet hoop
    queensGardenArea.addEntity(new SceneryProp({
      id: 'prop-croquet-hoop',
      x: 1150,
      y: 520,
      width: 50,
      height: 50,
      propType: 'croquet_hoop'
    }));

    // Exit to Royal Court
    queensGardenArea.addEntity(new Door({
      id: 'door-to-royal-court',
      x: 1860,
      y: 500,
      width: 60,
      height: 60,
      targetArea: 'royal_court',
      targetSpawn: 'default'
    }));

    world.registerArea(queensGardenArea);

    // =========================================================================
    // CHAPTER 8: THE ROYAL COURT (1800 x 1100)
    // =========================================================================
    const royalCourtArea = new Area({
      id: 'royal_court',
      name: 'The Royal Courtroom',
      width: 1800,
      height: 1100,
      backgroundColor: '#450a0a',
      spawnPoints: {
        default: { x: 220, y: 520 },
        throne: { x: 900, y: 460 }
      },
      renderTerrain(ctx, area) {
        // Grand Courtroom Carpet & Checkered Tiles
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          root.StoryArt.EnvironmentRenderer.renderCheckeredFloor(ctx, 0, 0, area.width, area.height, 50);
        } else {
          ctx.fillStyle = '#450a0a';
          ctx.fillRect(0, 0, area.width, area.height);
        }

        // Regal Red Carpet Down the Center
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(0, 440, area.width, 160);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 436, area.width, 4);
        ctx.fillRect(0, 600, area.width, 4);
      }
    });

    royalCourtArea.addObstacle({ x: 0, y: 0, width: 1800, height: 80 });
    royalCourtArea.addObstacle({ x: 0, y: 1020, width: 1800, height: 80 });
    royalCourtArea.addObstacle({ x: 0, y: 0, width: 60, height: 1100 });
    royalCourtArea.addObstacle({ x: 1740, y: 0, width: 60, height: 1100 });

    // King & Queen of Hearts
    royalCourtArea.addEntity(new QueenOfHearts({
      id: 'npc-queen-of-hearts',
      x: 950,
      y: 420
    }));

    royalCourtArea.addEntity(new KingOfHearts({
      id: 'npc-king-of-hearts',
      x: 820,
      y: 420
    }));

    // Platter of Stolen Jam Tarts on evidence stand
    royalCourtArea.addEntity(new TartPlatter({
      id: 'prop-tart-evidence',
      x: 880,
      y: 530
    }));

    // Exit back to awakening bank
    royalCourtArea.addEntity(new Door({
      id: 'door-to-awakening',
      x: 1680,
      y: 500,
      width: 60,
      height: 60,
      targetArea: 'awakening_bank',
      targetSpawn: 'default'
    }));

    world.registerArea(royalCourtArea);

    // =========================================================================
    // CHAPTER 9: AWAKENING BANK (1400 x 900)
    // =========================================================================
    const awakeningBankArea = new Area({
      id: 'awakening_bank',
      name: 'The Riverbank (Awakening)',
      width: 1400,
      height: 900,
      backgroundColor: '#065f46',
      spawnPoints: {
        default: { x: 300, y: 460 }
      },
      renderTerrain(ctx, area) {
        const grad = ctx.createLinearGradient(0, 0, 0, area.height);
        grad.addColorStop(0, '#10b981');
        grad.addColorStop(0.6, '#059669');
        grad.addColorStop(1, '#047857');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, area.width, area.height);

        // Peaceful River Stream
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          root.StoryArt.EnvironmentRenderer.renderWater(ctx, 100, 620, 600, 240, 0);
        }
      }
    });

    awakeningBankArea.addObstacle({ x: 0, y: 0, width: 1400, height: 60 });
    awakeningBankArea.addObstacle({ x: 0, y: 840, width: 1400, height: 60 });
    awakeningBankArea.addObstacle({ x: 0, y: 0, width: 50, height: 900 });
    awakeningBankArea.addObstacle({ x: 1350, y: 0, width: 50, height: 900 });

    // Golden Weeping Willow Tree
    awakeningBankArea.addEntity(new SceneryProp({
      id: 'prop-weeping-willow',
      name: 'Weeping Willow Tree',
      x: 180,
      y: 180,
      width: 240,
      height: 260,
      isSolid: false,
      render(ctx) {
        if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
          root.StoryArt.EnvironmentRenderer.renderTree(ctx, this.x + 120, this.y + 130, 'willow');
        }
      }
    }));

    // Alice's Sister NPC
    awakeningBankArea.addEntity(new NPC({
      id: 'npc-alice-sister',
      name: "Alice's Sister",
      role: 'Loving Sister',
      x: 460,
      y: 440,
      width: 50,
      height: 68,
      dialogueKey: 'awakening_intro',
      interactionPrompt: 'Talk to Sister',
      onInteract(player, world) {
        if (root.StoryDialogue && root.StoryDialogue.startDialogue) {
          root.StoryDialogue.startDialogue('awakening_intro');
        }
        if (root.StoryGame && root.StoryGame.quests) {
          root.StoryGame.quests.completeObjective('alice_awakening', 'awaken');
        }
        if (root.StoryBridge && root.StoryBridge.unlockAchievement) {
          root.StoryBridge.unlockAchievement('ach-alice-7');
        }
      }
    }));

    world.registerArea(awakeningBankArea);

    // =========================================================================
    // QUEST REGISTRY (ALL 9 CHAPTERS)
    // =========================================================================
    const quests = [
      {
        id: 'rabbit_watch',
        title: "The White Rabbit's Watch",
        description: 'Follow the frantic White Rabbit, pick up his golden pocket watch, and return it to him at the Hollow Oak!',
        rewardXP: 100,
        objectives: [
          { id: 'follow_rabbit', text: 'Follow the White Rabbit down the woodland path' },
          { id: 'find_watch', text: 'Pick up the Golden Pocket Watch dropped on the trail' },
          { id: 'return_watch', text: 'Return the watch to the White Rabbit at the Rabbit Hole' }
        ]
      },
      {
        id: 'rabbit_fall',
        title: 'The Great Fall',
        description: 'Unlock the gate, drift down the mystical rabbit hole, and enter Wonderland!',
        rewardXP: 100,
        objectives: [
          { id: 'unlock_gate', text: 'Unlock the gate to the falling passage' },
          { id: 'drift_down', text: 'Drift down the rabbit hole safely' },
          { id: 'reach_hall', text: 'Enter the doorway into Wonderland' }
        ]
      },
      {
        id: 'hall_transformation',
        title: 'The Tiny Golden Door',
        description: 'Drink the potion to shrink small enough to pass through the 15-inch Golden Door!',
        rewardXP: 120,
        objectives: [
          { id: 'find_bottle', text: 'Inspect the glass table and find the "Drink Me" bottle' },
          { id: 'drink_potion', text: 'Drink the potion to shrink to tiny size' },
          { id: 'pass_tiny_door', text: 'Pass through the Tiny Golden Door into the garden' }
        ]
      },
      {
        id: 'caterpillar_riddle',
        title: 'Advice from a Caterpillar',
        description: 'Speak to the Blue Caterpillar on the giant mushroom and answer: "Who are you?"',
        rewardXP: 100,
        objectives: [
          { id: 'talk_caterpillar', text: 'Speak to the Blue Caterpillar on the giant mushroom' },
          { id: 'speak_identity', text: 'Answer clearly: "Who are you?"' }
        ]
      },
      {
        id: 'cheshire_directions',
        title: 'The Cheshire Cat',
        description: 'Find the grinning Cheshire Cat in the Tulgey Woods and ask which path leads to tea!',
        rewardXP: 100,
        objectives: [
          { id: 'find_cheshire', text: 'Locate the glowing grin of the Cheshire Cat' },
          { id: 'take_tea_path', text: 'Follow the signpost to the Mad Tea Party' }
        ]
      },
      {
        id: 'mad_tea_party',
        title: 'A Mad Tea Party',
        description: 'Join the Mad Hatter, March Hare, and Dormouse, rotate places, and ask for a clean cup!',
        rewardXP: 140,
        objectives: [
          { id: 'join_tea_party', text: 'Approach the long tea party table' },
          { id: 'speak_clean_cup', text: 'Say: "Clean cup!" to change places' }
        ]
      },
      {
        id: 'paint_roses_red',
        title: "The Queen's Croquet Ground",
        description: 'Help the Card Gardeners paint white roses red before the Queen of Hearts arrives!',
        rewardXP: 130,
        objectives: [
          { id: 'help_gardeners', text: 'Speak with Card Gardener Two' },
          { id: 'paint_white_rose', text: 'Paint the white rose tree red' }
        ]
      },
      {
        id: 'trial_of_tarts',
        title: "Who Stole the Tarts?",
        description: 'Stand your ground in the Royal Court and defend the truth before the Queen of Hearts!',
        rewardXP: 180,
        objectives: [
          { id: 'present_evidence', text: 'Inspect the evidence platter of jam tarts' },
          { id: 'stand_ground', text: 'Stand tall and declare your courage!' }
        ]
      },
      {
        id: 'alice_awakening',
        title: "Alice's Awakening",
        description: 'Awaken under the weeping willow having mastered the language of Wonderland!',
        rewardXP: 300,
        objectives: [
          { id: 'awaken', text: 'Open your eyes beneath the weeping willow (+300 XP Bonus)' }
        ]
      }
    ];

    // =========================================================================
    // DIALOGUES REGISTRY
    // =========================================================================
    const dialogues = {
      rabbit_intro: [
        { speaker: 'White Rabbit', text: 'Oh dear, oh dear! Look at the time! I shall be too late!', voiceCue: 'rabbit_voice_late', startQuest: 'rabbit_watch' },
        { speaker: 'White Rabbit', text: 'The Duchess will be furious if I keep her waiting! Follow me!' }
      ],
      rabbit_waiting_for_watch: [
        { speaker: 'White Rabbit', text: 'Oh no, oh no! Where is my golden pocket watch?! Please, did you find it along the path?', voiceCue: 'rabbit_voice_watch' }
      ],
      rabbit_wrong_item: [
        { speaker: 'White Rabbit', text: "That is not my watch, kind girl! Look for the gold ticking timepiece on the trail!" }
      ],
      rabbit_watch_returned: [
        { speaker: 'White Rabbit', text: 'My pocket watch! You found it! Oh thank goodness! Thank you, Alice!', voiceCue: 'rabbit_voice_thanks' },
        { speaker: 'White Rabbit', text: 'Look at the hands—ten to twelve! Down the rabbit hole I go! Follow me if you dare!' }
      ],
      caterpillar_intro: [
        { speaker: 'Caterpillar', text: 'Who... are... you?', voiceCue: 'caterpillar_voice' },
        { speaker: 'Alice', text: 'I hardly know, sir, just at present—at least I know who I was when I got up this morning!' },
        { speaker: 'Caterpillar', text: 'One side makes you grow taller, and the other side makes you grow shorter... of the mushroom, of course!' }
      ],
      cheshire_intro: [
        { speaker: 'Cheshire Cat', text: 'We are all mad here. I am mad. You are mad.', voiceCue: 'cheshire_voice' },
        { speaker: 'Alice', text: 'Which way ought I to go from here?' },
        { speaker: 'Cheshire Cat', text: 'That depends a good deal on where you want to get to! Follow the right path to the Mad Hatter!' }
      ],
      hatter_intro: [
        { speaker: 'Mad Hatter', text: 'No room! No room!', voiceCue: 'hatter_voice' },
        { speaker: 'Alice', text: 'There is plenty of room! And why is a raven like a writing desk?' },
        { speaker: 'Mad Hatter', text: 'I have not the slightest idea! Change places! Clean cup!' }
      ],
      gardener_intro: [
        { speaker: 'Two of Spades', text: 'Look out now, Five! You are splattering red paint all over me!' },
        { speaker: 'Five of Spades', text: 'We planted a white rose tree by mistake! The Queen ordered red roses! Help us paint it red!' }
      ],
      queen_intro: [
        { speaker: 'Queen of Hearts', text: 'Who is this?! Who stole my tarts?! Off with their heads!', voiceCue: 'queen_voice_off_heads' },
        { speaker: 'King of Hearts', text: 'Consider your verdict, jury! Stolen tarts are serious business!' },
        { speaker: 'Alice', text: 'I will not leave! You are nothing but a pack of cards!' }
      ],
      awakening_intro: [
        { speaker: "Alice's Sister", text: "Wake up, Alice dear! What a long sleep you've had under the willow tree!" },
        { speaker: 'Alice', text: 'Oh, sister! I have had such a curious dream! Down the rabbit hole, tea with the Hatter, and cards that paint roses!' },
        { speaker: "Alice's Sister", text: "It was a wonderful dream! Come along now, run in to your tea; it's getting late!" },
        { speaker: 'Story Guide', text: '🌟 Congratulations! You have completed Alice in Wonderland and mastered the English language of Wonderland!' }
      ]
    };

    return {
      world,
      quests,
      dialogues
    };
  }

  // Export to namespace
  root.StoryAliceAdventure = {
    createAliceAdventureWorld
  };

})(window);
