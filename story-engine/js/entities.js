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
      this.speechBark = null;
    }

    say(text, duration = 2.5) {
      this.speechBark = {
        text,
        timer: duration,
        maxTimer: duration,
        isThought: false
      };
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVoice) {
        root.StoryAudioEngine.playVoice({ text, character: this.npcType || this.id || 'rabbit' });
      }
    }

    think(text, duration = 2.8) {
      this.speechBark = {
        text,
        timer: duration,
        maxTimer: duration,
        isThought: true
      };
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVoice) {
        root.StoryAudioEngine.playVoice({ text, character: 'alice' });
      }
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
      if (this.speechBark) {
        this.speechBark.timer -= dt;
        if (this.speechBark.timer <= 0) {
          this.speechBark = null;
        }
      }
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
      this.facing = config.facing || 'down'; // 'down' | 'up' | 'left' | 'right'
      this.isMoving = false;
      this.walkTimer = 0;
      this.footstepSoundTimer = 0;
      this.characterName = config.name || 'Alice';
      this.skin = config.skin || 'alice'; // 'alice' | 'explorer'
      this.isCelebrating = false;
      this.celebrateTimer = 0;
      this.scale = config.scale || 1.0;
      this.targetScale = this.scale;
      this.startScale = this.scale;
      this.scaleTimer = 0;
      this.sizeState = config.sizeState || (this.scale < 0.6 ? 'TINY' : (this.scale > 1.2 ? 'BIG' : 'NORMAL'));
      this.movementMode = config.movementMode || 'standard'; // 'standard' | 'falling' | 'frozen'
      this.isFalling = (this.movementMode === 'falling') || Boolean(config.isFalling);
      this.isFrozen = (this.movementMode === 'frozen');
    }

    setMovementMode(mode) {
      this.movementMode = mode;
      this.isFalling = (mode === 'falling');
      this.isFrozen = (mode === 'frozen');
      if (mode === 'standard') {
        this.vx = 0;
        this.vy = 0;
      }
    }

    resetForScene(spawnX, spawnY, movementMode = 'standard', facing = 'down', sizeState = null, scale = null) {
      this.x = spawnX;
      this.y = spawnY;
      this.vx = 0;
      this.vy = 0;
      this.facing = facing;
      this.isMoving = false;
      this.walkTimer = 0;
      this.footstepSoundTimer = 0;
      this.isCelebrating = false;
      this.celebrateTimer = 0;
      this.speechBark = null;
      if (scale !== null && scale !== undefined) {
        this.scale = scale;
        this.targetScale = scale;
        this.startScale = scale;
        this.scaleTimer = 0;
      }
      if (sizeState !== null && sizeState !== undefined) {
        this.sizeState = sizeState;
      }
      this.setMovementMode(movementMode);
    }

    transformSize(targetScale, duration = 0.8, cue = null) {
      this.targetScale = targetScale;
      this.startScale = this.scale;
      this.scaleTimer = duration;
      if (targetScale < 0.6) {
        this.sizeState = 'TINY';
      } else if (targetScale > 1.2) {
        this.sizeState = 'BIG';
      } else {
        this.sizeState = 'NORMAL';
      }
      if (cue && root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation(cue, { volume: 0.85 });
      }
    }

    getHitbox() {
      const s = this.scale || 1.0;
      return {
        x: this.x + this.hitboxOffset.x * s,
        y: this.y + this.hitboxOffset.y * s,
        width: this.hitboxOffset.w * s,
        height: this.hitboxOffset.h * s
      };
    }

    update(dt, input, solidObstacles, worldBounds) {
      super.update(dt);

      if (this.isCelebrating) {
        this.celebrateTimer -= dt;
        if (this.celebrateTimer <= 0) {
          this.isCelebrating = false;
        }
      }

      if (this.scaleTimer > 0) {
        this.scaleTimer -= dt;
        const progress = 1.0 - Math.max(0, this.scaleTimer / 0.8);
        this.scale = this.startScale + (this.targetScale - this.startScale) * progress;
        if (this.scaleTimer <= 0) {
          this.scale = this.targetScale;
        }
      }

      // If controls are frozen (e.g. cutscenes / transitions)
      if (this.isFrozen || this.movementMode === 'frozen') {
        this.isMoving = false;
        return;
      }

      let moveX = 0;
      let moveY = 0;

      // 1. Process Click-to-Move Target
      if (input && input.moveTarget) {
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
      if (input) {
        const stick = input.getMovementVector();
        if (stick && stick.hasDirection) {
          moveX = stick.dx;
          moveY = stick.dy;
          input.moveTarget = null; // Keyboard cancels click target
        }
      }

      // 3. Falling mode physics (descent drift + horizontal steering)
      if (this.isFalling || this.movementMode === 'falling') {
        const fallSpeed = 195; // pixels per second downward
        const desiredDy = fallSpeed * dt;
        const steerSpeed = 220; // horizontal steering
        const desiredDx = moveX * steerSpeed * dt;

        const resolved = root.StoryWorld.Collision.resolveMovement(
          this.getHitbox(),
          desiredDx,
          desiredDy,
          solidObstacles,
          worldBounds
        );

        this.x += resolved.dx;
        this.y += resolved.dy;
        this.facing = 'down';
        this.isMoving = true;
        this.walkTimer += dt * 3;
        return;
      }

      // 4. Standard 8-directional player movement with collision resolution
      this.isMoving = (moveX !== 0 || moveY !== 0);

      if (this.isMoving) {
        // Update Facing Direction
        if (Math.abs(moveX) > Math.abs(moveY)) {
          this.facing = moveX > 0 ? 'right' : 'left';
        } else {
          this.facing = moveY > 0 ? 'down' : 'up';
        }

        // Apply Collision-Resolved Movement in both X and Y
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
          // Surface detection based on position
          let surface = 'grass';
          if (this.y >= 440 && this.y <= 580) {
            surface = (this.x > 1200) ? 'stone' : 'dirt';
          }
          if (root.StoryGame && root.StoryGame.events) {
            root.StoryGame.events.emit('PLAYER_FOOTSTEP', {
              x: this.x,
              y: this.y,
              surface
            });
          } else if (root.StoryBridge && root.StoryBridge.playFootstep) {
            root.StoryBridge.playFootstep(surface);
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
      this.customOnInteract = (typeof config.onInteract === 'function') ? config.onInteract : null;
    }

    onInteract(player, world) {
      if (this.customOnInteract) {
        this.customOnInteract(player, world);
        return;
      }
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
    constructor(config = {}) {
      const requiredItem = config.requiredItemId !== undefined ? config.requiredItemId : null;
      const isOpen = (requiredItem === null) ? (config.isOpen !== undefined ? Boolean(config.isOpen) : true) : Boolean(config.isOpen);

      super({
        id: config.id || 'gate-ancient',
        x: config.x || 800,
        y: config.y || 400,
        width: config.width || 80,
        height: config.height || 90,
        isSolid: !isOpen,
        isInteractable: true,
        interactionRadius: 85,
        interactionPrompt: config.interactionPrompt || (isOpen ? 'Enter' : 'Unlock Gate'),
        hitboxOffset: { x: 4, y: 40, w: 72, h: 48 }
      });

      this.name = config.name || 'Door';
      this.requiredItemId = requiredItem;
      this.isOpen = isOpen;
      this.targetArea = config.targetArea || 'sunny_meadow';
      this.targetSpawn = config.targetSpawn || 'from_gate';
      this.openProgress = this.isOpen ? 1.0 : 0.0;
      this.isArchedPassage = Boolean(config.isArchedPassage);
    }

    update(dt) {
      super.update(dt);
      if (this.isOpen && this.openProgress < 1.0) {
        this.openProgress = Math.min(1.0, this.openProgress + dt * 2.2);
      }
    }

    onInteract(player, world) {
      if (this.isOpen) {
        if (this.targetArea === 'hall_of_doors') {
          if (root.StoryGame && root.StoryGame.events) {
            root.StoryGame.events.emit('HALL_DOOR_ENTERED', { doorId: this.id });
          }
        }
        // Gate is already open -> Transition to target area with cinematic fade!
        if (world && typeof world.onTransition === 'function') {
          world.onTransition(this.targetArea, this.targetSpawn);
        } else if (world && world.loadArea) {
          world.loadArea(this.targetArea, this.targetSpawn);
        }
        return;
      }

      // Check if player has the required key
      const inv = root.StoryGame ? root.StoryGame.inventory : null;
      const hasKey = inv && this.requiredItemId && inv.hasItem(this.requiredItemId);

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
          root.StoryDialogue.showQuickToast(`🔒 The ${this.name} is locked!`);
        }
      }
    }

    render(ctx) {
      if (this.isArchedPassage) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Arched Subterranean Doorway to Wonderland
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(4, 0, this.width - 8, this.height, [24, 24, 0, 0]);
        ctx.fill();
        ctx.stroke();

        // Inner glowing magical corridor
        const glowGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        glowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.35)');
        glowGrad.addColorStop(1, 'rgba(254, 240, 138, 0.5)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.roundRect(10, 8, this.width - 20, this.height - 8, [18, 18, 0, 0]);
        ctx.fill();

        // Hanging ornate lantern above arch
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(this.width / 2, 6, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return;
      }

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
  // 5B. RABBIT HOLE GATE ENTITY (Top Entrance Gate to The Great Fall)
  // =========================================================================
  class RabbitHoleGate extends Entity {
    constructor(config = {}) {
      const isOpen = Boolean(config.isOpen);
      super({
        id: config.id || 'rabbit-hole-gate',
        x: config.x || 650,
        y: config.y || 240,
        width: config.width || 100,
        height: config.height || 90,
        isSolid: !isOpen,
        isInteractable: true,
        interactionRadius: 90,
        interactionPrompt: isOpen ? 'Enter Falling Passage' : 'Unlock Gate',
        hitboxOffset: { x: 4, y: 30, w: 92, h: 58 }
      });

      this.isOpen = isOpen;
      this.openProgress = isOpen ? 1.0 : 0.0;
      this.name = 'Falling Passage Gate';
    }

    update(dt, world) {
      super.update(dt);
      if (this.isOpen && this.openProgress < 1.0) {
        this.openProgress = Math.min(1.0, this.openProgress + dt * 2.0);
      }
    }

    onInteract(player, world) {
      if (this.isOpen) {
        // Already unlocked - player can step through
        if (player && player.think) {
          player.think("The passage is open! Into the deep well I go...", 2.5);
        }
        return;
      }

      // Check unlock requirement:
      // Must have completed Rabbit Woods quest AND returned White Rabbit's watch!
      const game = root.StoryGame;
      const quests = game ? game.quests : null;
      const isWoodsComplete = (quests && quests.isCompleted && quests.isCompleted('rabbit_watch')) ||
                              (game && (game.storyState === 'RABBIT_WOODS_COMPLETE' ||
                                        game.storyState === 'GREAT_FALL_UNLOCKED' ||
                                        game.storyState === 'GREAT_FALL_ACTIVE'));

      if (isWoodsComplete) {
        // Unlock the gate!
        this.isOpen = true;
        this.isSolid = false;
        this.interactionPrompt = 'Enter Falling Passage';

        // Sound effect
        if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
          root.StoryAudioEngine.playVariation('gate_grind', { volume: 0.85 });
        } else if (root.StoryBridge && root.StoryBridge.playSound) {
          root.StoryBridge.playSound('lock');
        }

        // Screen shake
        if (game && game.camera) {
          game.camera.shake(300, 5);
        }

        // Particle burst (golden sparks from latch)
        if (world && world.addParticle) {
          for (let i = 0; i < 16; i++) {
            world.addParticle({
              x: this.x + this.width / 2 + (Math.random() - 0.5) * 20,
              y: this.y + this.height / 2 + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 120,
              vy: (Math.random() - 0.5) * 120,
              life: 0.8,
              maxLife: 0.8,
              color: '#fde047',
              size: Math.random() * 4 + 2
            });
          }
        }

        // Alice reaction thought
        if (player && player.think) {
          player.think("The gate unlatched! The air below smells of curiosity and adventure!", 3.0);
        }

        if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🔓 Gate Unlocked! The Great Fall passage opens before you.', 3500);
        }

        // Update story state & emit event
        if (game) {
          game.storyState = 'GREAT_FALL_ACTIVE';
          if (game.events) {
            game.events.emit('GATE_UNLOCKED', { gateId: this.id });
          }
        }
      } else {
        // Locked
        if (player && player.think) {
          player.think("The gate is latched tight. I should make sure the White Rabbit is helped first!", 2.5);
        }
        if (root.StoryBridge && root.StoryBridge.playSound) {
          root.StoryBridge.playSound('wrong');
        }
      }
    }

    render(ctx) {
      const { x, y, width, height, openProgress } = this;
      ctx.save();
      ctx.translate(x, y);

      // Stone Arch Frame
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, [12, 12, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Deep dark shaft aperture inside the arch
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.roundRect(8, 10, width - 16, height - 10, [8, 8, 0, 0]);
      ctx.fill();

      // Golden mystical glow from within the shaft when opening
      if (openProgress > 0) {
        ctx.fillStyle = `rgba(254, 240, 138, ${openProgress * 0.4})`;
        ctx.beginPath();
        ctx.roundRect(10, 12, width - 20, height - 12, [6, 6, 0, 0]);
        ctx.fill();
      }

      // Ornate Wrought Iron Bars
      // Left gate wing slides left, right gate wing slides right
      const wingW = (width - 20) / 2;
      const slideDist = wingW * openProgress * 0.85;

      // Left wing
      ctx.save();
      ctx.translate(10 - slideDist, 12);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      for (let bx = 6; bx < wingW; bx += 9) {
        ctx.beginPath();
        ctx.moveTo(bx, 4);
        ctx.lineTo(bx, height - 14);
        ctx.stroke();
      }
      ctx.strokeRect(0, 2, wingW, height - 14);
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.translate(10 + wingW + slideDist, 12);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      for (let bx = 6; bx < wingW; bx += 9) {
        ctx.beginPath();
        ctx.moveTo(bx, 4);
        ctx.lineTo(bx, height - 14);
        ctx.stroke();
      }
      ctx.strokeRect(0, 2, wingW, height - 14);
      ctx.restore();

      // Center Padlock / Crest (fades out as it opens)
      if (openProgress < 0.8) {
        ctx.globalAlpha = 1.0 - openProgress * 1.2;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 8, height / 2 - 6, 16, 16, 3);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 - 6, 6, Math.PI, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 5C. DRIED LEAVES LANDING (Bottom Soft Touchdown in Rabbit Hole)
  // =========================================================================
  class DriedLeavesLanding extends Entity {
    constructor(config = {}) {
      super({
        id: config.id || 'leaves-landing',
        x: config.x || 550,
        y: config.y || 2320,
        width: config.width || 300,
        height: config.height || 70,
        isSolid: false,
        isInteractable: false
      });
      this.hasTriggered = false;
    }

    update(dt, world) {
      super.update(dt);
      if (this.hasTriggered || !world || !world.player) return;

      const player = world.player;
      // Check if Alice has entered the landing area at the bottom of the well
      const pFootY = player.y + player.height;

      if (pFootY >= this.y) {
        this.hasTriggered = true;

        // Alice touches down safely!
        player.setMovementMode('standard');
        player.isFalling = false;
        player.vy = 0;
        player.vx = 0;

        // Leaf rustle / landing sound
        if (root.StoryBridge && root.StoryBridge.playSound) {
          root.StoryBridge.playSound('correct');
        }

        // Particle leaf burst
        if (world && world.addParticle) {
          for (let i = 0; i < 24; i++) {
            world.addParticle({
              x: player.x + player.width / 2 + (Math.random() - 0.5) * 60,
              y: player.y + player.height + (Math.random() - 0.5) * 15,
              vx: (Math.random() - 0.5) * 90,
              vy: -Math.random() * 70 - 20,
              life: 1.2,
              maxLife: 1.2,
              color: ['#f59e0b', '#d97706', '#b45309', '#f97316'][Math.floor(Math.random() * 4)],
              size: Math.random() * 4 + 3
            });
          }
        }

        // Alice relief monologue
        if (player.think) {
          player.think("Thump! Down upon a heap of dry leaves! Not hurt a bit!", 3.2);
        }

        if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🍂 Alice landed softly upon a pile of dried autumn leaves!', 3500);
        }

        // Emit landing event
        if (root.StoryGame) {
          root.StoryGame.storyState = 'GREAT_FALL_COMPLETE';
          if (root.StoryGame.events) {
            root.StoryGame.events.emit('LANDED_ON_LEAVES');
          }
        }
      }
    }

    render(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Deep soft leaf bed mound
      const grad = ctx.createRadialGradient(
        this.width / 2, this.height / 2, 10,
        this.width / 2, this.height / 2, this.width / 2
      );
      grad.addColorStop(0, '#b45309');
      grad.addColorStop(0.6, '#78350f');
      grad.addColorStop(1, 'rgba(69, 26, 3, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(this.width / 2, this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Individual crisp autumn leaves
      const leafColors = ['#f59e0b', '#d97706', '#ea580c', '#ca8a04', '#9a3412'];
      for (let i = 0; i < 28; i++) {
        const lx = 20 + ((i * 37) % (this.width - 40));
        const ly = 10 + ((i * 19) % (this.height - 20));
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(lx, ly, 6, 3, (i * 0.7), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 5D. FALLING PASSAGE TRIGGER (Activates Falling Mode in Rabbit Hole)
  // =========================================================================
  class FallingPassageTrigger extends Entity {
    constructor(config = {}) {
      super({
        id: config.id || 'falling-passage-trigger',
        x: config.x || 420,
        y: config.y || 320,
        width: config.width || 560,
        height: config.height || 40,
        isSolid: false,
        isInteractable: false
      });
    }

    update(dt, world) {
      super.update(dt);
      if (!world || !world.player) return;
      const player = world.player;
      // If player crosses into shaft between y=320 and y=2320, activate falling mode
      if (player.y >= this.y && player.y < 2320 && player.movementMode !== 'falling') {
        player.setMovementMode('falling');
      }
    }

    render(ctx) {
      // Invisible trigger volume
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
      this.examineText = config.examineText || null;
      this.mushroomType = config.mushroomType || 'red'; // 'red' | 'glowing_blue' | 'purple'
    }

    onInteract(player, world) {
      if (this.examineText) {
        if (player && player.think) {
          player.think(this.examineText, 3.2);
        } else if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast(this.examineText);
        }
      } else if (this.signText && root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast(this.signText);
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.EnvironmentRenderer) {
        if (this.propType === 'mushroom' || this.propType === 'giant_mushroom') {
          root.StoryArt.EnvironmentRenderer.renderGiantMushroom(ctx, this.x, this.y, this.width, this.height, this.mushroomType || 'red', this.animTime);
          return;
        }
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

  // =========================================================================
  // 7. WHITE RABBIT NPC (Dynamic Chase, Watch Drop, and Rabbit Hole Entrance)
  // =========================================================================
  class WhiteRabbit extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-white-rabbit',
        name: 'White Rabbit',
        role: 'White Rabbit',
        x: config.x || 440,
        y: config.y || 490,
        width: 44,
        height: 52,
        isSolid: false,
        isInteractable: false,
        interactionRadius: 85,
        interactionPrompt: 'Talk to Rabbit',
        hitboxOffset: { x: 4, y: 30, w: 36, h: 22 }
      });

      this.npcType = 'white_rabbit';
      this.speed = config.speed || 175;
      this.state = config.state || 'intro_waiting'; // 'intro_waiting', 'running', 'dropping_watch', 'at_hole', 'watch_returned', 'hopped_down'
      this.waypoints = config.waypoints || [
        { x: 440, y: 490 },
        { x: 680, y: 440 },
        { x: 920, y: 520 },
        { x: 1140, y: 460 }, // Watch drops here!
        { x: 1380, y: 420 },
        { x: 1600, y: 480 },
        { x: 1675, y: 485 }  // At the Rabbit Hole!
      ];
      this.currentWaypointIndex = 0;
      this.watchDropPointIndex = 3;
      this.hasDroppedWatch = false;
      this.isCheckingWatch = true;
      this.isRunning = false;
      this.hopSoundTimer = 0;
      this.trailParticleTimer = 0;
      this.footprintTimer = 0;
      this.pauseTimer = 0;
      this.isPausedForPlayer = false;
      this.introTimer = 0;
      this.introStep = 0;
      this.dropPauseTimer = 0;
      this.disappearTimer = 0;
      this.idleBarkTimer = 0;
      this.scale = 1.0;
    }

    startChase() {
      if (this.state === 'running' || this.state === 'at_hole' || this.state === 'watch_returned' || this.state === 'hopped_down') return;
      this.state = 'running';
      this.isRunning = true;
      this.isCheckingWatch = false;
      this.isQuestReady = false;
      this.interactionPrompt = 'Follow Rabbit';
      this.currentWaypointIndex = 1;

      // Start chase music & emit chase event
      if (root.StoryAudioEngine && root.StoryAudioEngine.setState) {
        root.StoryAudioEngine.setState('chase');
      }
      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('RABBIT_CHASE_STARTED', { rabbit: this });
      }
    }

    update(dt, world) {
      super.update(dt);

      // 1. Playable Intro Sequence in Rabbit Woods
      if (this.state === 'intro_waiting') {
        this.introTimer += dt;
        // Step 1 at 0.6s: "Oh no! I'm late!"
        if (this.introStep === 0 && this.introTimer >= 0.6) {
          this.introStep = 1;
          this.facing = 'down';
          this.say("Oh no! I'm late!", 2.2);
          if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
            root.StoryAudioEngine.playVariation('rabbit_voice_late', { volume: 0.9 });
          }
          if (root.StoryGame && root.StoryGame.quests) {
            root.StoryGame.quests.startQuest('rabbit_watch');
          }
        }
        // Step 2 at 2.4s: "Follow me!" and start running down the trail
        else if (this.introStep === 1 && this.introTimer >= 2.4) {
          this.introStep = 2;
          this.facing = 'right';
          this.say("Follow me!", 1.8);
          this.startChase();
        }
        return;
      }

      // 2. Active Chase & Leading AI with Look-Back
      if (this.state === 'running') {
        const player = (world && world.player) || (root.StoryGame && root.StoryGame.player);
        let distToPlayer = 100;
        if (player) {
          distToPlayer = Math.hypot((this.x + 22) - (player.x + 22), (this.y + 26) - (player.y + 26));
        }

        // Catch-up / Look-back Logic:
        // If player is too far behind (> 320px), slow down and pause to look back
        if (distToPlayer > 320) {
          this.isPausedForPlayer = true;
          this.isMoving = false;
          this.facing = 'left'; // Turn and look back towards Alice
          this.pauseTimer += dt;

          // Call out if player hesitates for > 3.5s
          if (this.pauseTimer >= 3.5 && !this.speechBark) {
            this.pauseTimer = 0;
            const barks = ["Follow me! This way!", "Hurry, Alice! This way!", "Follow me!"];
            this.say(barks[Math.floor(Math.random() * barks.length)], 2.0);
            if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
              root.StoryAudioEngine.playVariation('rabbit_hop', { volume: 0.4 });
            }
          }
        } else if (distToPlayer <= 230) {
          // Alice caught up, unpause and resume running
          this.isPausedForPlayer = false;
          this.pauseTimer = 0;
        }

        if (!this.isPausedForPlayer) {
          const target = this.waypoints[this.currentWaypointIndex];
          if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 14) {
              // Reached waypoint
              if (this.currentWaypointIndex === this.watchDropPointIndex && !this.hasDroppedWatch) {
                // Drop pocket watch with dramatic pause!
                this.state = 'dropping_watch';
                this.dropPauseTimer = 1.4;
                this.dropPocketWatch(world);
                return;
              }

              this.currentWaypointIndex++;
              if (this.currentWaypointIndex >= this.waypoints.length) {
                // Arrived at the Rabbit Hole!
                this.state = 'at_hole';
                this.isRunning = false;
                this.isMoving = false;
                this.isCheckingWatch = true;
                this.isQuestReady = true;
                this.interactionPrompt = 'Talk to Rabbit';
                this.dialogueKey = 'rabbit_waiting_for_watch';

                if (root.StoryAudioEngine && root.StoryAudioEngine.setState) {
                  root.StoryAudioEngine.setState('exploration');
                }
                if (root.StoryGame && root.StoryGame.events) {
                  root.StoryGame.events.emit('RABBIT_ARRIVED_AT_HOLE', { rabbit: this });
                }
              }
            } else {
              // Move towards target waypoint
              this.isMoving = true;
              this.walkTimer += dt * 14;
              const moveDist = Math.min(dist, this.speed * dt);
              this.x += (dx / dist) * moveDist;
              this.y += (dy / dist) * moveDist;
              this.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');

              // Hop sound
              this.hopSoundTimer += dt;
              if (this.hopSoundTimer >= 0.28) {
                this.hopSoundTimer = 0;
                if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
                  root.StoryAudioEngine.playVariation('rabbit_hop', { volume: 0.5, spatial: { x: this.x, y: this.y, maxDistance: 600 } });
                }
              }

              // Trail particles (subtle dust motes & soft green clover on path)
              this.trailParticleTimer += dt;
              if (this.trailParticleTimer >= 0.22) {
                this.trailParticleTimer = 0;
                if (world && world.addParticle) {
                  world.addParticle({
                    x: this.x + 22 + (Math.random() - 0.5) * 10,
                    y: this.y + 46 + (Math.random() - 0.5) * 4,
                    vx: (Math.random() - 0.5) * 10,
                    vy: -4 - Math.random() * 8,
                    size: 2.2 + Math.random() * 2,
                    color: Math.random() > 0.4 ? '#86efac' : '#fde047',
                    life: 1.6,
                    maxLife: 1.6
                  });
                }
              }

              // Environmental rabbit pawprints on dirt path
              this.footprintTimer += dt;
              if (this.footprintTimer >= 0.32) {
                this.footprintTimer = 0;
                const angle = Math.atan2(dy, dx) + Math.PI / 2;
                if (world && world.addFootprint) {
                  world.addFootprint({
                    x: this.x + 22,
                    y: this.y + 46,
                    angle: angle,
                    alpha: 0.5
                  });
                }
              }
            }
          }
        }
      } else if (this.state === 'dropping_watch') {
        this.isMoving = false;
        this.dropPauseTimer -= dt;
        if (this.dropPauseTimer <= 0) {
          this.state = 'running';
          this.currentWaypointIndex++;
          this.say("No time! I must hurry!", 2.0);
        }
      } else if (this.state === 'at_hole') {
        // Anxious waiting near hole entrance
        this.isInteractable = true;
        this.isMoving = false;
        this.facing = (Math.sin(this.animTime * 1.5) > 0) ? 'left' : 'down';
        this.idleBarkTimer += dt;
        if (this.idleBarkTimer >= 7.0 && !this.speechBark) {
          this.idleBarkTimer = 0;
          this.say("Where is my watch?", 2.2);
          if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
            root.StoryAudioEngine.playVariation('rabbit_voice_watch', { volume: 0.8 });
          }
        }

        // Update interaction prompt based on inventory
        const inv = root.StoryGame ? root.StoryGame.inventory : null;
        if (inv && inv.hasItem('pocket_watch')) {
          this.interactionPrompt = 'Return Watch';
        } else {
          this.interactionPrompt = 'Talk to Rabbit';
        }
      } else if (this.state === 'watch_returned') {
        // Hopping down into the Rabbit Hole
        this.isInteractable = false;
        this.disappearTimer += dt;
        this.scale = Math.max(0, 1.0 - (this.disappearTimer / 1.2));
        this.y += dt * 18;
        if (this.disappearTimer >= 1.2) {
          this.state = 'hopped_down';
          this.isInteractable = false;
          if (world && world.activeArea) {
            world.activeArea.removeEntity(this.id);
          }
        }
      }
    }

    dropPocketWatch(world) {
      this.hasDroppedWatch = true;
      const watchX = this.x + 8;
      const watchY = this.y + 12;

      const watch = new PocketWatch({
        id: 'collectible-pocket-watch',
        x: watchX,
        y: watchY,
        isDropping: true
      });

      const activeArea = (world && world.activeArea) || (root.StoryGame && root.StoryGame.world && root.StoryGame.world.activeArea);
      if (activeArea) {
        activeArea.addEntity(watch);
      }

      this.say("Oh dear! My watch!", 1.8);

      // Play drop audio & chime
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('item_pickup', { volume: 0.5 });
      }

      // Emit event
      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('WATCH_DROPPED', { x: watchX, y: watchY });
      }
    }

    onInteract(player, world) {
      if (this.state === 'intro_waiting' || this.state === 'idle_clearing') {
        this.startChase();
        return;
      }

      if (this.state === 'running' || this.state === 'dropping_watch') {
        this.say("No time to talk! I must hurry!", 1.8);
        return;
      }

      if (this.state === 'at_hole') {
        const inv = root.StoryGame ? root.StoryGame.inventory : null;
        const hasWatch = inv && inv.hasItem('pocket_watch');

        if (hasWatch) {
          // Return watch to Rabbit!
          inv.removeItem('pocket_watch', 1);
          this.state = 'watch_returned';
          this.isQuestReady = false;
          this.isInteractable = false;
          const targetWorld = world || (root.StoryGame && root.StoryGame.world);
          if (targetWorld && targetWorld.activeInteractable === this) {
            targetWorld.activeInteractable = null;
          }

          // Rabbit celebration speech & fanfare
          this.say("My pocket watch! You found it! Thank you, Alice!", 2.8);

          if (player) {
            player.isCelebrating = true;
            player.celebrateTimer = 2.5;
          }

          if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
            root.StoryAudioEngine.playVariation('celebration', { volume: 0.8 });
            root.StoryAudioEngine.playVariation('rabbit_voice_thanks', { volume: 0.9 });
          }

          // Complete Quest
          if (root.StoryGame && root.StoryGame.quests) {
            root.StoryGame.quests.completeObjective('rabbit_watch', 'return_watch');
          }

          if (root.StoryGame && root.StoryGame.events) {
            root.StoryGame.events.emit('WATCH_RETURNED', { rabbit: this });
            root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
              word: 'thank you',
              label: 'Thank You! (Gratitude)',
              icon: '💖'
            });
          }

          // Unlock the Rabbit Hole for Chapter 2 cinematic transition
          const activeArea = (targetWorld && targetWorld.activeArea) || (root.StoryGame && root.StoryGame.world && root.StoryGame.world.activeArea);
          if (activeArea) {
            const hole = activeArea.getEntity('prop-rabbit-hole');
            if (hole) {
              hole.isUnlocked = true;
              hole.interactionPrompt = 'Jump Down Rabbit Hole';
            }
          }
        } else {
          // Doesn't have watch yet
          this.say("Where is my watch? Please help me find it!", 2.2);
          if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
            root.StoryAudioEngine.playVariation('rabbit_voice_watch', { volume: 0.85 });
          }
        }
      }
    }

    render(ctx) {
      if (this.state === 'hopped_down') return;

      ctx.save();
      if (this.scale < 1.0) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        ctx.translate(cx, cy);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-cx, -cy);
        ctx.globalAlpha = Math.max(0, this.scale);
      }

      if (root.StoryArt && root.StoryArt.CharacterRenderer) {
        root.StoryArt.CharacterRenderer.renderWhiteRabbit(ctx, this);
      } else {
        super.render(ctx);
      }
      ctx.restore();
    }
  }

  // =========================================================================
  // 8. POCKET WATCH COLLECTIBLE (Spatial Ticking & Learning Events)
  // =========================================================================
  class PocketWatch extends Collectible {
    constructor(config = {}) {
      super({
        id: config.id || 'collectible-pocket-watch',
        x: config.x || 1140,
        y: config.y || 460,
        width: 38,
        height: 38,
        itemId: 'pocket_watch',
        itemName: 'Golden Pocket Watch',
        itemIcon: '⏱️',
        description: 'An antique golden pocket watch ticking frantically.',
        vocabulary: 'watch',
        interactionPrompt: 'Pick Up Watch'
      });
      this.tickTimer = 0;

      if (config.isDropping) {
        this.dropAnim = {
          time: 0,
          duration: 0.75,
          startY: (config.y || 460) - 28,
          targetY: config.y || 460,
          hasClinked: false
        };
        this.y = this.dropAnim.startY;
      } else {
        this.dropAnim = null;
      }
    }

    update(dt, world) {
      super.update(dt);
      if (this.isCollected) return;

      // Drop and bounce physics animation
      if (this.dropAnim) {
        this.dropAnim.time += dt;
        const t = Math.min(1, this.dropAnim.time / this.dropAnim.duration);

        if (t < 0.45) {
          // Drop phase: quadratic ease-in
          const p = t / 0.45;
          this.y = this.dropAnim.startY + (this.dropAnim.targetY - this.dropAnim.startY) * (p * p);
        } else if (t < 0.75) {
          // Bounce 1: up 10px then down
          if (!this.dropAnim.hasClinked) {
            this.dropAnim.hasClinked = true;
            if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
              root.StoryAudioEngine.playVariation('item_pickup', { volume: 0.4 });
            }
          }
          const p = (t - 0.45) / 0.3;
          const bounceOffset = Math.sin(p * Math.PI) * 10;
          this.y = this.dropAnim.targetY - bounceOffset;
        } else {
          // Settle
          this.y = this.dropAnim.targetY;
          this.dropAnim = null;
        }
      }

      // Spatial ticking sound when player is nearby
      this.tickTimer += dt;
      if (this.tickTimer >= 1.0) {
        this.tickTimer = 0;
        if (root.StoryGame && root.StoryGame.player) {
          const p = root.StoryGame.player;
          const dist = Math.hypot((this.x + 19) - (p.x + p.width / 2), (this.y + 19) - (p.y + p.height / 2));
          if (dist < 260 && root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
            const vol = Math.max(0.1, 0.7 * (1 - dist / 260));
            root.StoryAudioEngine.playVariation('watch_tick', { volume: vol });
          }
        }
      }
    }

    onInteract(player, world) {
      if (this.isCollected) return;
      this.isCollected = true;
      this.isInteractable = false;

      const targetWorld = world || (root.StoryGame && root.StoryGame.world);
      if (targetWorld) {
        if (targetWorld.activeInteractable === this) {
          targetWorld.activeInteractable = null;
        }
        if (targetWorld.activeArea) {
          targetWorld.activeArea.removeEntity(this.id);
        }
      }

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

      // 2. Play Sound & Celebration Animation
      if (player) {
        player.isCelebrating = true;
        player.celebrateTimer = 2.0;
        // Alice in-world thought bubble
        player.think("A watch! I should return it to the White Rabbit!", 3.2);
      }

      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('watch_pickup', { volume: 0.85 });
      }

      // 3. Spawn golden star particles radiating outward
      if (targetWorld && targetWorld.addParticle) {
        for (let i = 0; i < 14; i++) {
          const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.2;
          const spd = 35 + Math.random() * 45;
          targetWorld.addParticle({
            x: this.x + 19,
            y: this.y + 19,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            size: 4 + Math.random() * 2.5,
            color: '#fef08a',
            isStar: true,
            life: 1.2,
            maxLife: 1.2
          });
        }
      }

      // 4. Complete Quest objective 'find_watch'
      if (root.StoryGame && root.StoryGame.quests) {
        root.StoryGame.quests.completeObjective('rabbit_watch', 'find_watch');
      }

      // 5. Emit learning event without blocking dialogue modal
      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
          word: 'watch',
          label: 'Pocket Watch (Clock)',
          icon: '⏱️'
        });
        root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
          word: 'late',
          label: 'Late (Running out of time)',
          icon: '⌛'
        });
      }
    }

    render(ctx) {
      if (this.isCollected) return;
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderPocketWatch) {
        root.StoryArt.ObjectRenderer.renderPocketWatch(ctx, this.x, this.y, this.width, this.height, this.animTime);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 9. RABBIT HOLE ENTITY (Ethereal Abyss, Spores, Ambient Hum)
  // =========================================================================
  class RabbitHole extends Entity {
    constructor(config = {}) {
      super({
        id: config.id || 'prop-rabbit-hole',
        x: config.x || 1680,
        y: config.y || 420,
        width: config.width || 140,
        height: config.height || 140,
        isSolid: false,
        isInteractable: true,
        interactionRadius: 95,
        interactionPrompt: 'Examine Rabbit Hole',
        hitboxOffset: { x: 20, y: 60, w: 100, h: 60 }
      });
      this.humTimer = 0;
      this.isUnlocked = false;
      this.targetArea = config.targetArea || 'rabbit_hole';
      this.targetSpawn = config.targetSpawn || 'top';
      this.transitionTriggered = false;
    }

    update(dt) {
      super.update(dt);
      this.humTimer += dt;
      if (this.humTimer >= 4.0) {
        this.humTimer = 0;
        if (root.StoryGame && root.StoryGame.player) {
          const p = root.StoryGame.player;
          const dist = Math.hypot((this.x + 70) - (p.x + p.width / 2), (this.y + 70) - (p.y + p.height / 2));
          if (dist < 320 && root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
            const vol = Math.max(0.1, (this.isUnlocked ? 0.75 : 0.4) * (1 - dist / 320));
            root.StoryAudioEngine.playVariation('rabbit_hole_hum', { volume: vol });
          }
        }
      }

      if (this.isUnlocked) {
        this.interactionPrompt = 'Jump Down Rabbit Hole';
      } else {
        this.interactionPrompt = 'Examine Rabbit Hole';
      }
    }

    onInteract(player, world) {
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('rabbit_hole_hum', { volume: 0.8 });
      }

      if (!this.isUnlocked) {
        // Locked / Pre-watch examination
        if (player && player.think) {
          player.think("A deep rabbit hole under the oak roots... but where did the White Rabbit go?", 3.0);
        } else if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🌀 A deep rabbit hole under the oak roots... the White Rabbit is still looking for his watch!');
        }
        if (root.StoryGame && root.StoryGame.events) {
          root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
            word: 'hole',
            label: 'Rabbit Hole (Deep entrance)',
            icon: '🕳️'
          });
        }
        return;
      }

      // Unlocked! Ready for story / cinematic jump into the Rabbit Hole
      if (this.transitionTriggered) return;
      this.transitionTriggered = true;
      this.isInteractable = false;

      const targetWorld = world || (root.StoryGame && root.StoryGame.world);
      if (targetWorld && targetWorld.activeInteractable === this) {
        targetWorld.activeInteractable = null;
      }

      // Alice celebration / jump feedback
      if (player && player.think) {
        player.think("Down the rabbit hole I go!", 2.5);
      }

      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('🌀 Down, down, down Alice jumped into the rabbit hole... entering Wonderland!', 4000);
      }

      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('rabbit_hole_hum', { volume: 1.0 });
      }

      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('RABBIT_HOLE_ENTERED', { hole: this });
      }

      // Trigger scene transition to Chapter 2: rabbit_hole
      setTimeout(() => {
        if (targetWorld && targetWorld.onTransition) {
          targetWorld.onTransition(this.targetArea, this.targetSpawn);
        } else if (targetWorld && targetWorld.loadArea) {
          targetWorld.loadArea(this.targetArea, this.targetSpawn);
        }
      }, 800);
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderRabbitHole) {
        root.StoryArt.ObjectRenderer.renderRabbitHole(ctx, this);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 9.5 GLASS TABLE (Three-legged solid glass table with Drink Me bottle)
  // =========================================================================
  class GlassTable extends Entity {
    constructor(config = {}) {
      const isExamined = Boolean(config.isExamined);
      super({
        id: config.id || 'prop-glass-table',
        x: config.x || 720,
        y: config.y || 480,
        width: config.width || 120,
        height: config.height || 60,
        isSolid: true,
        isInteractable: true,
        interactionRadius: 85,
        interactionPrompt: isExamined ? 'Glass Table' : 'Examine Glass Table',
        hitboxOffset: { x: 8, y: 15, w: 104, h: 42 }
      });
      this.isExamined = isExamined;
    }

    onInteract(player, world) {
      if (!this.isExamined) {
        this.isExamined = true;
        this.interactionPrompt = 'Glass Table';

        // Play crystal chime sound
        if (root.StoryAudio && root.StoryAudio.playKeyGlissando) {
          root.StoryAudio.playKeyGlissando();
        } else if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
          root.StoryAudioEngine.playVariation('chime', { volume: 0.85 });
        }

        // Alice voice monologue
        if (player && player.say) {
          player.say('A three-legged table of solid glass! And on it sits a curious bottle...', 3.5);
        } else if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🔍 Alice: "A three-legged table of solid glass! And on it sits a curious bottle..."', 4000);
        }

        // Particle sparkle burst
        if (world && world.addParticle) {
          for (let i = 0; i < 14; i++) {
            world.addParticle({
              x: this.x + 20 + Math.random() * (this.width - 40),
              y: this.y + 10 + Math.random() * 25,
              vx: (Math.random() - 0.5) * 45,
              vy: -20 - Math.random() * 30,
              size: 2.5 + Math.random() * 2.5,
              color: Math.random() > 0.5 ? '#e0f2fe' : '#38bdf8',
              life: 1.2,
              maxLife: 1.2
            });
          }
        }

        // Reveal DrinkMeBottle on table in active area
        const bottle = (world && world.activeArea && world.activeArea.entities) ?
          world.activeArea.entities.find(e => e.id === 'prop-drink-me' || e instanceof DrinkMeBottle) : null;
        if (bottle && bottle.reveal) {
          bottle.reveal();
        }

        // Authoritative Quest Objective 1 Completion ONLY
        if (root.StoryGame && root.StoryGame.quests) {
          root.StoryGame.quests.completeObjective('hall_transformation', 'find_bottle');
        }

        if (root.StoryGame && root.StoryGame.events) {
          root.StoryGame.events.emit('TABLE_EXAMINED', { entityId: this.id });
        }
      } else {
        if (player && player.think) {
          player.think('The three-legged glass table is solid crystal and cold to the touch.', 2.5);
        }
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderGlassTable) {
        root.StoryArt.ObjectRenderer.renderGlassTable(ctx, this.x, this.y, this.width, this.height, this.isExamined, this.animTime);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 10. DRINK ME BOTTLE (Shrinks Alice to 0.42x & Size = TINY)
  // =========================================================================
  class DrinkMeBottle extends Collectible {
    constructor(config = {}) {
      const isRevealed = config.isRevealed !== undefined ? Boolean(config.isRevealed) : false;
      const isConsumed = Boolean(config.isConsumed);
      super({
        id: config.id || 'prop-drink-me',
        x: config.x || 760,
        y: config.y || 450,
        width: 32,
        height: 36,
        itemId: 'drink_me_bottle',
        itemName: '"Drink Me" Bottle',
        itemIcon: '🍶',
        description: 'An ornate glass vial with a paper tag reading "DRINK ME".',
        vocabulary: 'drink',
        interactionPrompt: 'Drink Potion'
      });
      this.isRevealed = isRevealed;
      this.isConsumed = isConsumed;
      this.isCollected = isConsumed;
      this.isInteractable = isRevealed && !isConsumed;
      this.interactionRadius = 70;
    }

    reveal() {
      this.isRevealed = true;
      if (!this.isConsumed) {
        this.isInteractable = true;
      }
    }

    onInteract(player, world) {
      if (this.isConsumed || !this.isRevealed) return;
      this.isConsumed = true;
      this.isCollected = true;
      this.isInteractable = false;

      // Real player size transformation (TINY size and scaled hitbox)
      if (player && player.transformSize) {
        player.transformSize(0.42, 0.9, 'size_shrink');
      }

      // Voice monologue
      if (player && player.say) {
        player.say('What a curious feeling! I am shutting up like a telescope!', 3.5);
      } else if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('🍶 Alice: "What a curious feeling! I am shutting up like a telescope!" (Tiny Size)', 4000);
      }

      // Camera gentle zoom ease for visibility while tiny
      if (root.StoryGame && root.StoryGame.camera) {
        root.StoryGame.camera.zoom = 1.4;
      }

      // Condensation & magical shrinking particles
      if (world && world.addParticle) {
        for (let i = 0; i < 18; i++) {
          world.addParticle({
            x: (player ? player.x + player.width / 2 : this.x) + (Math.random() - 0.5) * 30,
            y: (player ? player.y + player.height / 2 : this.y) + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 50,
            vy: -15 - Math.random() * 35,
            size: 2 + Math.random() * 3,
            color: '#a5f3fc',
            life: 1.5,
            maxLife: 1.5
          });
        }
      }

      // Authoritative Quest Objective 2 Completion ONLY
      if (root.StoryGame && root.StoryGame.quests) {
        root.StoryGame.quests.completeObjective('hall_transformation', 'drink_potion');
      }

      // Set authoritative story state
      if (root.StoryGame) {
        root.StoryGame.storyState = 'ALICE_SHRUNK';
      }

      // Enable Tiny Door interaction
      const door = (world && world.activeArea && world.activeArea.entities) ?
        world.activeArea.entities.find(e => e.id === 'prop-tiny-door' || e instanceof TinyDoor) : null;
      if (door && door.setAvailable) {
        door.setAvailable();
      }

      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
          word: 'small',
          label: 'Small (Tiny / Little)',
          icon: '🔍'
        });
        root.StoryGame.events.emit('ALICE_TRANSFORMED', { size: 'tiny', scale: 0.42 });
      }
    }

    render(ctx) {
      if (this.isConsumed || !this.isRevealed) return;
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderDrinkMeBottle) {
        root.StoryArt.ObjectRenderer.renderDrinkMeBottle(ctx, this.x, this.y, this.width, this.height, this.animTime);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 11. EAT ME CAKE (Grows Alice to 1.5x)
  // =========================================================================
  class EatMeCake extends Collectible {
    constructor(config = {}) {
      super({
        id: config.id || 'item-eat-me',
        x: config.x || 840,
        y: config.y || 480,
        width: 32,
        height: 32,
        itemId: 'eat_me_cake',
        itemName: '"Eat Me" Cake',
        itemIcon: '🧁',
        description: 'A little currant cake frosted with the words "EAT ME".',
        vocabulary: 'eat',
        interactionPrompt: 'Eat Cake'
      });
    }

    onInteract(player, world) {
      if (this.isCollected) return;
      super.onInteract(player, world);

      if (player && player.transformSize) {
        player.transformSize(1.5, 0.8, 'size_grow');
      }

      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('🧁 Alice ate the cake: "Curiouser and curiouser! Now I\'m growing!" (Big Size)', 4000);
      }

      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
          word: 'big',
          label: 'Big (Large / Tall)',
          icon: '🦒'
        });
        root.StoryGame.events.emit('ALICE_TRANSFORMED', { size: 'big', scale: 1.5 });
      }
    }

    render(ctx) {
      if (this.isCollected) return;
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderEatMeCake) {
        root.StoryArt.ObjectRenderer.renderEatMeCake(ctx, this.x, this.y, this.width, this.height, this.animTime);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 12. TINY DOOR (Accessible only when Alice is Tiny / Shrunk)
  // =========================================================================
  class TinyDoor extends Entity {
    constructor(config = {}) {
      const isOpen = Boolean(config.isOpen);
      const doorState = isOpen ? 'OPEN' : (config.doorState || 'LOCKED');
      super({
        id: config.id || 'prop-tiny-door',
        x: config.x || 1460,
        y: config.y || 460,
        width: config.width || 44,
        height: config.height || 60,
        isSolid: !isOpen,
        isInteractable: true,
        interactionRadius: 70,
        interactionPrompt: isOpen ? 'Tiny Door (Open)' : (doorState === 'AVAILABLE' ? 'Unlock Golden Door' : 'Examine Tiny Door'),
        hitboxOffset: { x: 4, y: 10, w: 36, h: 48 }
      });

      this.name = 'Tiny Golden Door';
      this.targetArea = config.targetArea || 'queens_garden';
      this.targetSpawn = config.targetSpawn || 'default';
      this.isOpen = isOpen;
      this.doorState = doorState; // 'LOCKED' | 'AVAILABLE' | 'OPENING' | 'OPEN'
      this.openProgress = isOpen ? 1.0 : 0.0;
      this.hasTriggeredTransition = false;
    }

    setAvailable() {
      if (this.doorState === 'LOCKED') {
        this.doorState = 'AVAILABLE';
        this.interactionPrompt = 'Unlock Golden Door';
      }
    }

    onInteract(player, world) {
      if (this.isOpen || this.doorState === 'OPEN') {
        if (player && player.think) {
          player.think('The garden beyond is so lovely! I can just walk right through!', 2.5);
        }
        return;
      }

      // Check Alice scale / size:
      // Alice must be tiny (scale <= 0.6 or sizeState === 'TINY') to unlock the 15-inch door
      const isTiny = (player && (player.sizeState === 'TINY' || player.scale <= 0.6));

      if (!isTiny) {
        if (player && player.say) {
          player.say('I cannot fit through! The door is only 15 inches high, and I am far too tall!', 3.2);
        } else if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🔒 Alice: "I cannot fit through! The door is only 15 inches high, and I am far too tall!"', 3500);
        }
        if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
          root.StoryAudioEngine.playVariation('wrong', { volume: 0.5 });
        }
        return;
      }

      // Alice IS tiny: Unlock and begin opening animation
      this.doorState = 'OPENING';
      this.interactionPrompt = 'Tiny Door (Opening)';

      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('gate_grind', { volume: 0.75 });
      } else if (root.StoryBridge && root.StoryBridge.playSound) {
        root.StoryBridge.playSound('lock');
      }

      // Particle burst
      if (world && world.addParticle) {
        for (let i = 0; i < 14; i++) {
          world.addParticle({
            x: this.x + this.width / 2 + (Math.random() - 0.5) * 16,
            y: this.y + this.height / 2 + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 60,
            vy: (Math.random() - 0.5) * 60,
            color: '#fbbf24',
            size: Math.random() * 3 + 2,
            life: 0.8,
            maxLife: 0.8
          });
        }
      }

      // Important: Objective 3 is NOT completed on click. Physical passage is required!
    }

    update(dt, world) {
      super.update(dt);

      if (this.doorState === 'OPENING') {
        this.openProgress = Math.min(1.0, this.openProgress + dt * 1.25);
        if (this.openProgress >= 1.0) {
          this.doorState = 'OPEN';
          this.isOpen = true;
          this.isSolid = false;
          this.interactionPrompt = 'Pass Through Door';
        }
      }

      // Physical passage requirement:
      // When open, check if Alice's tiny sprite physically walks through the doorway threshold
      if (this.isOpen && !this.hasTriggeredTransition) {
        const game = root.StoryGame;
        const player = (world && world.player) || (game && game.player);
        if (player) {
          // Alice crosses threshold into garden portal
          const crossedThreshold = (player.x >= this.x + 10 || player.x >= 1475) &&
                                   (player.y >= this.y - 30 && player.y <= this.y + this.height + 40);

          if (crossedThreshold) {
            this.hasTriggeredTransition = true;

            // 1. Authoritative Objective 3 Completion
            if (game && game.quests) {
              game.quests.completeObjective('hall_transformation', 'pass_tiny_door');
            }

            if (root.StoryBridge && root.StoryBridge.unlockAchievement) {
              root.StoryBridge.unlockAchievement('ach-alice-3');
            }

            // 2. Play magical transition chime
            if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
              root.StoryAudioEngine.playVariation('chime', { volume: 0.85 });
            }

            // 3. Emit transition event
            if (game && game.events) {
              game.events.emit('TINY_DOOR_PASSED', {
                targetArea: this.targetArea,
                targetSpawn: this.targetSpawn
              });
            }

            // 4. Clean scene transition to Queen's Garden
            if (world && typeof world.onTransition === 'function') {
              world.onTransition(this.targetArea, this.targetSpawn);
            } else if (world && world.loadArea) {
              world.loadArea(this.targetArea, this.targetSpawn);
            }
          }
        }
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderTinyDoor) {
        root.StoryArt.ObjectRenderer.renderTinyDoor(ctx, this.x, this.y, this.width, this.height, this.isOpen, this.animTime);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 13. CATERPILLAR NPC (Mushroom Garden)
  // =========================================================================
  class Caterpillar extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-caterpillar',
        name: 'The Caterpillar',
        role: 'Wonderland Sage',
        x: config.x || 760,
        y: config.y || 440,
        width: 60,
        height: 65,
        dialogueKey: 'caterpillar_dialogue',
        hasQuest: true,
        interactionPrompt: 'Talk to Caterpillar'
      });
      this.npcType = 'caterpillar';
    }

    onInteract(player, world) {
      super.onInteract(player, world);

      // Gives Alice pieces of the magic mushroom if not yet given
      const inv = root.StoryGame ? root.StoryGame.inventory : null;
      if (inv && !inv.hasItem('mushroom_small')) {
        inv.addItem({
          id: 'mushroom_small',
          name: 'Mushroom (Small)',
          icon: '🍄',
          description: 'One side makes you smaller.',
          count: 1
        });
        inv.addItem({
          id: 'mushroom_grow',
          name: 'Mushroom (Grow)',
          icon: '🍄',
          description: 'The other side makes you grow taller.',
          count: 1
        });
        if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🍄 The Caterpillar gave you pieces of the magic mushroom!', 3500);
        }
      }
    }
  }

  // =========================================================================
  // 14. CHESHIRE CAT NPC (Tulgey Woods)
  // =========================================================================
  class CheshireCat extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-cheshire-cat',
        name: 'Cheshire Cat',
        role: 'Guiding Spirit',
        x: config.x || 840,
        y: config.y || 400,
        width: 56,
        height: 48,
        dialogueKey: 'cheshire_dialogue',
        interactionPrompt: 'Talk to Cheshire Cat'
      });
      this.npcType = 'cheshire_cat';
      this.fadeAlpha = 1.0;
      this.fadeDirection = -1;
    }

    update(dt) {
      super.update(dt);
      // Periodic subtle fade out and back in
      this.fadeAlpha += this.fadeDirection * dt * 0.35;
      if (this.fadeAlpha <= 0.2) {
        this.fadeAlpha = 0.2;
        this.fadeDirection = 1;
      } else if (this.fadeAlpha >= 1.0) {
        this.fadeAlpha = 1.0;
        this.fadeDirection = -1;
      }
    }

    onInteract(player, world) {
      super.onInteract(player, world);
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('cheshire_voice', { volume: 0.8 });
      }
    }
  }

  // =========================================================================
  // 15. MAD HATTER & MARCH HARE & DORMOUSE (Mad Tea Party)
  // =========================================================================
  class MadHatter extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-mad-hatter',
        name: 'The Mad Hatter',
        role: 'Tea Party Host',
        x: config.x || 720,
        y: config.y || 420,
        width: 48,
        height: 60,
        dialogueKey: 'hatter_dialogue',
        interactionPrompt: 'Talk to Mad Hatter'
      });
      this.npcType = 'mad_hatter';
    }

    onInteract(player, world) {
      super.onInteract(player, world);
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('hatter_voice', { volume: 0.85 });
      }
    }
  }

  class MarchHare extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-march-hare',
        name: 'The March Hare',
        role: 'Tea Guest',
        x: config.x || 840,
        y: config.y || 420,
        width: 48,
        height: 62,
        dialogueKey: 'march_hare_dialogue',
        interactionPrompt: 'Talk to March Hare'
      });
      this.npcType = 'march_hare';
    }
  }

  class Dormouse extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-dormouse',
        name: 'The Dormouse',
        role: 'Sleepy Guest',
        x: config.x || 780,
        y: config.y || 440,
        width: 40,
        height: 40,
        dialogueKey: 'dormouse_dialogue',
        interactionPrompt: 'Wake Dormouse'
      });
      this.npcType = 'dormouse';
    }
  }

  // =========================================================================
  // 16. CARD GARDENER & ROSE TREE (Queen's Croquet Garden)
  // =========================================================================
  class CardGardener extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-card-gardener',
        name: config.name || 'Two of Spades',
        role: 'Card Gardener',
        x: config.x || 640,
        y: config.y || 480,
        width: 44,
        height: 62,
        dialogueKey: 'gardener_dialogue',
        interactionPrompt: 'Talk to Gardener'
      });
      this.npcType = 'card_gardener';
      this.cardNumber = config.cardNumber || 2;
    }
  }

  class RoseTree extends Entity {
    constructor(config = {}) {
      super({
        id: config.id || 'prop-rose-tree',
        x: config.x || 720,
        y: config.y || 460,
        width: 75,
        height: 95,
        isSolid: true,
        isInteractable: true,
        interactionPrompt: 'Paint Rose Red',
        hitboxOffset: { x: 10, y: 55, w: 55, h: 35 }
      });
      this.paintedCount = 0;
      this.totalRoses = 3;
    }

    onInteract(player, world) {
      if (this.paintedCount < this.totalRoses) {
        this.paintedCount++;

        // Play paintbrush stroke sound
        if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
          root.StoryAudioEngine.playVariation('paintbrush_stroke', { volume: 0.7 });
        }

        if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast(`🌹 Painted white rose red! (${this.paintedCount}/${this.totalRoses})`, 2500);
        }

        if (root.StoryGame && root.StoryGame.events) {
          root.StoryGame.events.emit('VOCABULARY_INTRODUCED', {
            word: 'red',
            label: 'Red (Color of the Queen\'s roses)',
            icon: '🌹'
          });
          if (this.paintedCount >= this.totalRoses) {
            root.StoryGame.events.emit('ROSES_ALL_PAINTED');
            if (root.StoryGame.quests) {
              root.StoryGame.quests.completeObjective('paint_roses_red', 'paint_white_roses');
            }
          }
        }
      } else {
        if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
          root.StoryDialogue.showQuickToast('🌹 All the roses on this tree are now vibrant royal red!');
        }
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.EnvironmentRenderer && root.StoryArt.EnvironmentRenderer.renderRoseTree) {
        root.StoryArt.EnvironmentRenderer.renderRoseTree(ctx, this.x, this.y, this.width, this.height, this.paintedCount, this.totalRoses, this.animTime);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 17. QUEEN & KING OF HEARTS (Royal Courtroom)
  // =========================================================================
  class QueenOfHearts extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-queen-hearts',
        name: 'The Queen of Hearts',
        role: 'Monarch of Wonderland',
        x: config.x || 780,
        y: config.y || 320,
        width: 54,
        height: 66,
        dialogueKey: 'queen_trial_dialogue',
        interactionPrompt: 'Address the Queen'
      });
      this.npcType = 'queen_of_hearts';
      this.isAngry = false;
    }

    onInteract(player, world) {
      super.onInteract(player, world);
      if (root.StoryAudioEngine && root.StoryAudioEngine.playVariation) {
        root.StoryAudioEngine.playVariation('queen_voice_off_heads', { volume: 0.85 });
      }
    }
  }

  class KingOfHearts extends NPC {
    constructor(config = {}) {
      super({
        id: config.id || 'npc-king-hearts',
        name: 'The King of Hearts',
        role: 'Judge',
        x: config.x || 870,
        y: config.y || 330,
        width: 48,
        height: 58,
        dialogueKey: 'king_trial_dialogue',
        interactionPrompt: 'Speak to the King'
      });
      this.npcType = 'king_of_hearts';
    }
  }

  class TartPlatter extends Entity {
    constructor(config = {}) {
      super({
        id: config.id || 'prop-tart-platter',
        x: config.x || 790,
        y: config.y || 440,
        width: 48,
        height: 36,
        isSolid: false,
        isInteractable: true,
        interactionPrompt: 'Inspect Tart Platter'
      });
      this.hasTarts = true;
    }

    onInteract(player, world) {
      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('🥧 Golden plate of strawberry tarts! The evidence in the Knave\'s trial!');
      }
      if (root.StoryGame && root.StoryGame.quests) {
        root.StoryGame.quests.completeObjective('royal_trial', 'inspect_tarts');
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderTartPlatter) {
        root.StoryArt.ObjectRenderer.renderTartPlatter(ctx, this.x, this.y, this.width, this.height, this.hasTarts);
      } else {
        super.render(ctx);
      }
    }
  }

  // =========================================================================
  // 18. FALLING CURIOSITY (Floating objects in Rabbit Hole)
  // =========================================================================
  class FallingCuriosity extends Entity {
    constructor(config = {}) {
      super({
        id: config.id || 'curiosity',
        x: config.x || 600,
        y: config.y || 800,
        width: 32,
        height: 32,
        isSolid: false,
        isInteractable: true,
        interactionPrompt: 'Catch Curiosity'
      });
      this.curiosityType = config.curiosityType || 'marmalade';
      this.rotSpeed = config.rotSpeed || (Math.random() - 0.5) * 2;
      this.rot = 0;
      this.floatSpeed = config.floatSpeed || -40; // Floats upward relative to Alice
    }

    update(dt, world) {
      super.update(dt);
      this.rot += this.rotSpeed * dt;
      this.y += this.floatSpeed * dt;

      // Auto-catch curiosity when falling Alice steers into it
      if (world && world.player && world.player.isFalling) {
        const pCenterX = world.player.x + world.player.width / 2;
        const pCenterY = world.player.y + world.player.height / 2;
        const cCenterX = this.x + this.width / 2;
        const cCenterY = this.y + this.height / 2;
        if (Math.hypot(pCenterX - cCenterX, pCenterY - cCenterY) < 52) {
          this.onInteract(world.player, world);
        }
      }
    }

    onInteract(player, world) {
      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast(`✨ Alice caught a floating curiosity: ${this.curiosityType.toUpperCase()}!`, 2500);
      }
      if (root.StoryBridge && root.StoryBridge.playSound) {
        root.StoryBridge.playSound('clue');
      }
      if (world && world.addParticle) {
        for (let i = 0; i < 12; i++) {
          world.addParticle({
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            vx: (Math.random() - 0.5) * 80,
            vy: (Math.random() - 0.5) * 80,
            life: 0.6,
            maxLife: 0.6,
            color: '#fef08a',
            size: Math.random() * 3 + 2
          });
        }
      }
      if (world && world.activeArea) {
        world.activeArea.removeEntity(this.id);
      }
    }

    render(ctx) {
      if (root.StoryArt && root.StoryArt.ObjectRenderer && root.StoryArt.ObjectRenderer.renderFallingCuriosity) {
        root.StoryArt.ObjectRenderer.renderFallingCuriosity(ctx, this.x, this.y, this.curiosityType, this.rot, this.animTime);
      } else {
        super.render(ctx);
      }
    }
  }

  // Export to namespace
  root.StoryEntities = {
    Entity,
    Player,
    NPC,
    Collectible,
    Door,
    RabbitHoleGate,
    DriedLeavesLanding,
    FallingPassageTrigger,
    SceneryProp,
    WhiteRabbit,
    PocketWatch,
    RabbitHole,
    GlassTable,
    DrinkMeBottle,
    EatMeCake,
    TinyDoor,
    Caterpillar,
    CheshireCat,
    MadHatter,
    MarchHare,
    Dormouse,
    CardGardener,
    RoseTree,
    QueenOfHearts,
    KingOfHearts,
    TartPlatter,
    FallingCuriosity
  };

})(window);
