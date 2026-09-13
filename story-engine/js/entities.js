/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — ENTITY SYSTEM (v1.0)
 * 
 * Base Entity, Player Controller (8-directional, collision, click-to-move),
 * Animated NPCs with speech prompts, Collectibles, Doors, and Props.
 * ============================================================================
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. BASE ENTITY
  // =========================================================================
  class Entity {
    constructor(config) {
      this.id = config.id || ('ent-' + Math.random().toString(36).substr(2, 7));
      this.x = config.x || 0;
      this.y = config.y || 0;
      this.width = config.width || 48;
      this.height = config.height || 48;
      this.isSolid = Boolean(config.isSolid);
      this.isInteractable = Boolean(config.isInteractable);
      this.interactionRadius = config.interactionRadius || 70;
      this.interactionPrompt = config.interactionPrompt || 'Interact';
      this.hitboxOffset = config.hitboxOffset || { x: 4, y: 24, w: 40, h: 22 };
      this.area = null;
      this.animTime = Math.random() * 10;
    }

    getHitbox() {
      return {
        x: this.x + this.hitboxOffset.x,
        y: this.y + this.hitboxOffset.y,
        width: this.hitboxOffset.w,
        height: this.hitboxOffset.h
      };
    }

    renderShadow(ctx, rx = 18, ry = 8, alpha = 0.25) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(this.x + this.width / 2, this.y + this.height - 4, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    update(dt) {
      this.animTime += dt;
    }

    render(ctx) {
      // Default placeholder wireframe
      this.renderShadow(ctx);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    onInteract(player, world) {
      // Override in subclasses
    }
  }

  // =========================================================================
  // 2. PLAYER ENTITY
  // =========================================================================
  class Player extends Entity {
    constructor(config = {}) {
      super({
        id: 'player',
        x: config.x || 200,
        y: config.y || 500,
        width: 44,
        height: 56,
        isSolid: false,
        isInteractable: false,
        hitboxOffset: { x: 6, y: 34, w: 32, h: 20 }
      });

      this.speed = config.speed || 210; // Pixels per second
      this.facing = 'down'; // 'down' | 'up' | 'left' | 'right'
      this.isMoving = false;
      this.walkTimer = 0;
      this.footstepSoundTimer = 0;
      this.characterName = config.name || 'Explorer';
      this.isCelebrating = false;
      this.celebrateTimer = 0;
    }

    update(dt, input, solidObstacles, worldBounds) {
      super.update(dt);

      if (this.isCelebrating) {
        this.celebrateTimer -= dt;
        if (this.celebrateTimer <= 0) {
          this.isCelebrating = false;
        }
      }

      let moveX = 0;
      let moveY = 0;

      // 1. Process Click-to-Move Target
      if (input.moveTarget) {
        const playerCenterX = this.x + this.width / 2;
        const playerCenterY = this.y + this.height - 10;
        const dx = input.moveTarget.x - playerCenterX;
        const dy = input.moveTarget.y - playerCenterY;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          moveX = dx / dist;
          moveY = dy / dist;
        } else {
          // Arrived at destination
          input.moveTarget = null;
        }
      }

      // 2. Process Keyboard / Virtual Joystick (Overrides click-to-move)
      const stick = input.getMovementVector();
      if (stick.hasDirection) {
        moveX = stick.dx;
        moveY = stick.dy;
        input.moveTarget = null; // Keyboard cancels click target
      }

      this.isMoving = (moveX !== 0 || moveY !== 0);

      if (this.isMoving) {
        // Update Facing Direction
        if (Math.abs(moveX) > Math.abs(moveY)) {
          this.facing = moveX > 0 ? 'right' : 'left';
        } else {
          this.facing = moveY > 0 ? 'down' : 'up';
        }

        // Apply Collision-Resolved Movement
        const desiredDx = moveX * this.speed * dt;
        const desiredDy = moveY * this.speed * dt;

        const resolved = root.StoryWorld.Collision.resolveMovement(
          this.getHitbox(),
          desiredDx,
          desiredDy,
          solidObstacles,
          worldBounds
        );

        this.x += resolved.dx;
        this.y += resolved.dy;

        // Animate walk cycle
        this.walkTimer += dt * 10;
        this.footstepSoundTimer += dt;
        if (this.footstepSoundTimer > 0.32) {
          this.footstepSoundTimer = 0;
          if (root.StoryBridge && root.StoryBridge.playFootstep) {
            root.StoryBridge.playFootstep();
          }
        }

        // Footstep dust puff particles
        if (root.StoryGame && root.StoryGame.renderer && Math.random() > 0.5) {
          root.StoryGame.renderer.addParticle({
            x: this.x + this.width / 2 + (Math.random() - 0.5) * 8,
            y: this.y + this.height - 2,
            vx: (Math.random() - 0.5) * 6,
            vy: -4 - Math.random() * 4,
            size: 1.5 + Math.random() * 1.5,
            color: '#d4b996',
            life: 0.35,
            maxLife: 0.35
          });
        }
      } else {
        this.walkTimer = 0;
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.CharacterRenderer) {
        root.StoryArt.CharacterRenderer.renderPlayer(ctx, this);
        return;
      }
      const centerX = this.x + this.width / 2;
      const footY = this.y + this.height;

      // 1. Soft Elliptical Shadow
      this.renderShadow(ctx, 16, 7, 0.3);

      // Walk cycle bobbing calculation
      const bob = this.isMoving ? Math.sin(this.walkTimer) * 2.5 : Math.sin(this.animTime * 2) * 0.8;
      const legOffset = this.isMoving ? Math.sin(this.walkTimer) * 5 : 0;

      ctx.save();
      ctx.translate(this.x, this.y + bob);

      // 2. Legs / Shoes
      ctx.fillStyle = '#1e293b'; // Boots
      ctx.fillRect(10 - legOffset * 0.6, 44, 10, 10);
      ctx.fillRect(24 + legOffset * 0.6, 44, 10, 10);

      // 3. Pants (Explorer Khaki)
      ctx.fillStyle = '#b45309';
      ctx.fillRect(11, 36, 22, 10);

      // 4. Torso / Explorer Jacket (Vibrant Royal Blue)
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(8, 20, 28, 18, 5);
      ctx.fill();

      // Belt & Brass Buckle
      ctx.fillStyle = '#451a03';
      ctx.fillRect(10, 33, 24, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(19, 32, 6, 6);

      // 5. Backpack (Brown leather)
      if (this.facing !== 'down') {
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.roundRect(this.facing === 'left' ? 26 : 2, 21, 10, 15, 3);
        ctx.fill();
      }

      // 6. Head & Face
      ctx.fillStyle = '#fed7aa'; // Skin tone
      ctx.beginPath();
      ctx.arc(22, 14, 10, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(22, 10, 10, Math.PI, Math.PI * 2);
      ctx.fill();

      // Eyes based on facing
      ctx.fillStyle = '#0f172a';
      if (this.facing === 'down') {
        ctx.fillRect(17, 13, 2.5, 3.5);
        ctx.fillRect(24, 13, 2.5, 3.5);
      } else if (this.facing === 'left') {
        ctx.fillRect(14, 13, 2.5, 3.5);
      } else if (this.facing === 'right') {
        ctx.fillRect(27, 13, 2.5, 3.5);
      }

      // 7. Explorer Safari Hat
      ctx.fillStyle = '#d97706'; // Hat base
      ctx.beginPath();
      ctx.ellipse(22, 8, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309'; // Hat crown
      ctx.beginPath();
      ctx.roundRect(14, 0, 16, 9, [5, 5, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#1e3a8a'; // Hat band
      ctx.fillRect(14, 6, 16, 2.5);

      ctx.restore();
    }
  }

  // =========================================================================
  // 3. NPC ENTITY (Non-Player Character with Animated Prompt & Dialog)
  // =========================================================================
  class NPC extends Entity {
    constructor(config) {
      super({
        id: config.id || 'npc',
        x: config.x || 300,
        y: config.y || 400,
        width: config.width || 48,
        height: config.height || 60,
        isSolid: true,
        isInteractable: true,
        interactionRadius: config.interactionRadius || 80,
        interactionPrompt: config.interactionPrompt || 'Talk',
        hitboxOffset: config.hitboxOffset || { x: 6, y: 36, w: 36, h: 22 }
      });

      this.name = config.name || 'Friendly Guide';
      this.role = config.role || 'Forest Ranger';
      this.avatarColor = config.avatarColor || '#15803d'; // Forest Green
      this.dialogueKey = config.dialogueKey || 'ranger_intro';
      this.hasQuest = Boolean(config.hasQuest);
      this.isQuestReady = Boolean(config.hasQuest);
    }

    onInteract(player, world) {
      if (root.StoryDialogue && root.StoryDialogue.startDialogue) {
        root.StoryDialogue.startDialogue(this.dialogueKey, this);
      }
      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('NPC_TALKED_TO', {
          npcId: this.id,
          npcName: this.name
        });
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.CharacterRenderer) {
        root.StoryArt.CharacterRenderer.renderNPC(ctx, this);
        return;
      }
      // 1. Shadow
      this.renderShadow(ctx, 18, 8, 0.3);

      const bob = Math.sin(this.animTime * 2.2) * 1.5;

      ctx.save();
      ctx.translate(this.x, this.y + bob);

      // 2. Feet
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(10, 48, 11, 10);
      ctx.fillRect(27, 48, 11, 10);

      // 3. Trousers (Dark Olive)
      ctx.fillStyle = '#365314';
      ctx.fillRect(10, 38, 28, 12);

      // 4. Ranger Tunic (Forest Green)
      ctx.fillStyle = this.avatarColor;
      ctx.beginPath();
      ctx.roundRect(7, 20, 34, 20, 6);
      ctx.fill();

      // Belt
      ctx.fillStyle = '#451a03';
      ctx.fillRect(9, 34, 30, 4);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(22, 33, 6, 6);

      // Ranger Badge on chest
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(15, 26, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 5. Head
      ctx.fillStyle = '#fcd34d'; // Skin tone
      ctx.beginPath();
      ctx.arc(24, 13, 11, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(19, 12, 2.5, 3);
      ctx.fillRect(26, 12, 2.5, 3);

      // Friendly smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(24, 15, 4, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Ranger Feather Hat
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.ellipse(24, 7, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.roundRect(16, -2, 16, 9, [4, 4, 0, 0]);
      ctx.fill();
      // Red feather
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(14, 1, 3, 7, -0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 6. Floating Quest Exclamation Mark (!)
      if (this.isQuestReady) {
        const bounce = Math.sin(this.animTime * 4) * 4;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y - 16 + bounce);
        
        // Golden glow aura
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Exclamation badge
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, 1);
        ctx.restore();
      }
    }
  }

  // =========================================================================
  // 4. COLLECTIBLE ENTITY (Items with Bobbing, Glow, & Learning Events)
  // =========================================================================
  class Collectible extends Entity {
    constructor(config) {
      super({
        id: config.id || 'item-key',
        x: config.x || 500,
        y: config.y || 300,
        width: config.width || 36,
        height: config.height || 36,
        isSolid: false,
        isInteractable: true,
        interactionRadius: 65,
        interactionPrompt: config.interactionPrompt || 'Pick Up',
        hitboxOffset: { x: 2, y: 2, w: 32, h: 32 }
      });

      this.itemId = config.itemId || 'golden_key';
      this.itemName = config.itemName || 'Golden Key';
      this.itemIcon = config.itemIcon || '🗝️';
      this.description = config.description || 'A shiny ornate key that opens ancient locks.';
      this.isCollected = false;
      this.vocabulary = config.vocabulary || 'key';
    }

    onInteract(player, world) {
      if (this.isCollected) return;
      this.isCollected = true;

      // 1. Add to Inventory
      if (root.StoryGame && root.StoryGame.inventory) {
        root.StoryGame.inventory.addItem({
          id: this.itemId,
          name: this.itemName,
          icon: this.itemIcon,
          description: this.description,
          count: 1
        });
      }

      // 2. Play Sound & Celebration
      if (player) {
        player.isCelebrating = true;
        player.celebrateTimer = 2.5;
      }
      if (root.StoryAudio && root.StoryAudio.playKeyGlissando) {
        root.StoryAudio.playKeyGlissando();
      } else if (root.StoryBridge && root.StoryBridge.playSound) {
        root.StoryBridge.playSound('clue');
      }

      // 3. Emit Story & Learning Events
      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('OBJECT_COLLECTED', {
          objectId: this.id,
          itemId: this.itemId,
          itemName: this.itemName,
          vocabulary: this.vocabulary
        });
        root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
          word: this.vocabulary,
          label: this.itemName,
          icon: this.itemIcon
        });
      }

      // 4. Spawn Sparkle Burst & Remove from Area
      if (world && world.activeArea) {
        world.activeArea.removeEntity(this.id);
        if (root.StoryGame && root.StoryGame.renderer) {
          for (let i = 0; i < 14; i++) {
            const angle = (Math.PI * 2 * i) / 14;
            const spd = 60 + Math.random() * 80;
            root.StoryGame.renderer.addParticle({
              x: this.x + this.width / 2,
              y: this.y + this.height / 2,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              size: 3 + Math.random() * 3,
              color: '#fde047',
              life: 0.6,
              maxLife: 0.6
            });
          }
        }
      }
    }

    render(ctx) {
      if (this.isCollected) return;

      if (root.StoryArt && root.StoryArt.ObjectRenderer) {
        root.StoryArt.ObjectRenderer.renderGoldenKey(ctx, this.x, this.y, this.width, this.height, this.animTime);
        return;
      }

      // Subtle shadow on ground
      this.renderShadow(ctx, 12, 5, 0.2);

      // Sine wave bobbing
      const floatY = Math.sin(this.animTime * 3) * 5;

      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + floatY);

      // Pulsing golden aura
      const auraSize = 18 + Math.sin(this.animTime * 4) * 3;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, auraSize, 0, Math.PI * 2);
      ctx.fill();

      // Render Ornate Golden Key
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;

      // Key Ring Loop
      ctx.beginPath();
      ctx.arc(-6, -6, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      // Hole inside ring
      ctx.fillStyle = '#06101e';
      ctx.beginPath();
      ctx.arc(-6, -6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Key Shaft
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.rotate((45 * Math.PI) / 180);
      ctx.fillRect(-2, -4, 4, 18);
      // Key Teeth
      ctx.fillRect(2, 6, 5, 3);
      ctx.fillRect(2, 11, 4, 3);

      ctx.restore();
    }
  }

  // =========================================================================
  // 5. DOOR / GATE ENTITY (Locked / Unlocked Scene Transition Gate)
  // =========================================================================
  class Door extends Entity {
    constructor(config) {
      super({
        id: config.id || 'gate-ancient',
        x: config.x || 800,
        y: config.y || 400,
        width: config.width || 80,
        height: config.height || 90,
        isSolid: !Boolean(config.isOpen),
        isInteractable: true,
        interactionRadius: 85,
        interactionPrompt: config.isOpen ? 'Enter' : 'Unlock Gate',
        hitboxOffset: { x: 4, y: 40, w: 72, h: 48 }
      });

      this.name = config.name || 'Ancient Stone Gate';
      this.requiredItemId = config.requiredItemId || 'golden_key';
      this.isOpen = Boolean(config.isOpen);
      this.targetArea = config.targetArea || 'sunny_meadow';
      this.targetSpawn = config.targetSpawn || 'from_gate';
      this.openProgress = this.isOpen ? 1.0 : 0.0;
    }

    update(dt) {
      super.update(dt);
      if (this.isOpen && this.openProgress < 1.0) {
        this.openProgress = Math.min(1.0, this.openProgress + dt * 2.2);
      }
    }

    onInteract(player, world) {
      if (this.isOpen) {
        // Gate is already open -> Transition to target area!
        if (world && world.loadArea) {
          world.loadArea(this.targetArea, this.targetSpawn);
        }
        return;
      }

      // Check if player has the required key
      const inv = root.StoryGame ? root.StoryGame.inventory : null;
      const hasKey = inv && inv.hasItem(this.requiredItemId);

      if (hasKey) {
        // Unlock Gate!
        this.isOpen = true;
        this.isSolid = false;
        this.interactionPrompt = 'Enter';

        // Play Mechanical Unlock Chime & Stone Gate Grind
        if (root.StoryAudio && root.StoryAudio.playGateGrind) {
          root.StoryAudio.playGateGrind();
        }
        if (root.StoryBridge && root.StoryBridge.playSound) {
          root.StoryBridge.playSound('lock');
        }

        // Camera Shake on heavy stone door opening
        if (root.StoryGame && root.StoryGame.camera) {
          root.StoryGame.camera.shake(350, 6);
        }

        // Emit Door Unlocked Event
        if (root.StoryGame && root.StoryGame.events) {
          root.StoryGame.events.emit('DOOR_UNLOCKED', {
            doorId: this.id,
            doorName: this.name,
            keyUsed: this.requiredItemId
          });
        }
      } else {
        // Missing Key -> Show locked feedback
        if (root.StoryBridge && root.StoryBridge.playSound) {
          root.StoryBridge.playSound('wrong');
        }
        if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🔒 The Ancient Gate is locked! You need a Golden Key.');
        }
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.ObjectRenderer) {
        root.StoryArt.ObjectRenderer.renderAncientGate(ctx, this);
        return;
      }
      ctx.save();
      ctx.translate(this.x, this.y);

      // Stone Pillars on Left & Right
      ctx.fillStyle = '#64748b'; // Slate stone
      ctx.beginPath();
      ctx.roundRect(0, 10, 18, 76, 4);
      ctx.roundRect(62, 10, 18, 76, 4);
      ctx.fill();

      // Pillar Ornaments
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(9, 10, 8, 0, Math.PI * 2);
      ctx.arc(71, 10, 8, 0, Math.PI * 2);
      ctx.fill();

      // Arch Header
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(6, 4, 68, 12, 3);
      ctx.fill();

      if (!this.isOpen) {
        // Closed Heavy Iron Bars
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(18, 16, 44, 70);

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        for (let i = 24; i < 60; i += 8) {
          ctx.beginPath();
          ctx.moveTo(i, 16);
          ctx.lineTo(i, 86);
          ctx.stroke();
        }

        // Large Brass Padlock in Center
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(35, 46, 12, 14, 3);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(41, 46, 4, Math.PI, Math.PI * 2);
        ctx.stroke();
      } else {
        // Open Gate (Glowing sunny portal)
        ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.fillRect(18, 16, 44, 70);

        // Open swing bars angled to sides
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(18, 16);
        ctx.lineTo(8, 80);
        ctx.moveTo(62, 16);
        ctx.lineTo(72, 80);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 6. SCENERY OBSTACLE (Trees, Rocks, Bushes with depth & collision)
  // =========================================================================
  class SceneryProp extends Entity {
    constructor(config) {
      super({
        id: config.id || 'prop',
        x: config.x || 0,
        y: config.y || 0,
        width: config.width || 60,
        height: config.height || 70,
        isSolid: true,
        isInteractable: Boolean(config.isInteractable),
        interactionPrompt: config.interactionPrompt || 'Examine',
        hitboxOffset: config.hitboxOffset || { x: 8, y: 44, w: 44, h: 24 }
      });

      this.propType = config.propType || 'tree'; // 'tree' | 'rock' | 'bush' | 'signpost' | 'flora'
      this.treeType = config.treeType || 'oak'; // 'oak' | 'birch'
      this.signTitle = config.signTitle || 'ANCIENT GATE';
      this.floraType = config.floraType || 'flower';
      this.signText = config.signText || null;
    }

    onInteract(player, world) {
      if (this.signText && root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast(this.signText);
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
        if (this.propType === 'tree') {
          root.StoryArt.EnvironmentRenderer.renderTree(ctx, this.x, this.y, this.width, this.height, this.treeType, this.animTime);
          return;
        }
        if (this.propType === 'rock') {
          root.StoryArt.EnvironmentRenderer.renderRock(ctx, this.x, this.y, this.width, this.height);
          return;
        }
        if (this.propType === 'signpost') {
          root.StoryArt.EnvironmentRenderer.renderSignpost(ctx, this.x, this.y, this.width, this.height, this.signTitle);
          return;
        }
        if (this.propType === 'flora') {
          root.StoryArt.EnvironmentRenderer.renderFlora(ctx, this.x, this.y, this.floraType, this.animTime);
          return;
        }
      }
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.propType === 'tree') {
        // Tree Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, this.height - 4, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tree Trunk
        ctx.fillStyle = '#78350f';
        ctx.fillRect(this.width / 2 - 8, this.height - 36, 16, 32);

        // Tree Foliage (Layered green domes)
        ctx.fillStyle = '#15803d'; // Dark forest green
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height - 42, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22c55e'; // Highlight green
        ctx.beginPath();
        ctx.arc(this.width / 2 - 6, this.height - 48, 20, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.propType === 'rock') {
        // Mossy Boulder
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, this.height - 4, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, this.height / 2 + 4, 22, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Moss patch
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.ellipse(this.width / 2 - 4, this.height / 2, 10, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.propType === 'signpost') {
        // Wooden Signpost
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, this.height - 4, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#78350f';
        ctx.fillRect(this.width / 2 - 4, 14, 8, this.height - 18);

        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.roundRect(4, 8, this.width - 8, 22, 4);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ANCIENT GATE', this.width / 2, 22);
      }

      ctx.restore();
    }
  }

  // Export to namespace
  root.StoryEntities = {
    Entity,
    Player,
    NPC,
    Collectible,
    Door,
    SceneryProp
  };

})(window);
