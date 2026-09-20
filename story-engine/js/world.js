/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — WORLD & COLLISION SYSTEM (v1.0)
 * 
 * Reusable World, Area Maps, Collision Detection, and Scene Transitions.
 * Supports large scrolling 2D environments.
 * ============================================================================
 */

(function(root) {
  'use strict';

  // =========================================================================
  // 1. COLLISION SYSTEM (AABB Math & Swept Movement Resolver)
  // =========================================================================
  const Collision = {
    // Tests standard Axis-Aligned Bounding Box overlap
    checkAABB(boxA, boxB) {
      return (
        boxA.x < boxB.x + boxB.width &&
        boxA.x + boxA.width > boxB.x &&
        boxA.y < boxB.y + boxB.height &&
        boxA.y + boxA.height > boxB.y
      );
    },

    // Computes Euclidean distance between two center points
    getDistance(pointA, pointB) {
      const dx = (pointA.x + (pointA.width || 0) / 2) - (pointB.x + (pointB.width || 0) / 2);
      const dy = (pointA.y + (pointA.height || 0) / 2) - (pointB.y + (pointB.height || 0) / 2);
      return Math.hypot(dx, dy);
    },

    // Resolves movement against obstacles along X and Y axes independently (allowing wall sliding)
    resolveMovement(hitbox, desiredDx, desiredDy, obstacles, worldBounds) {
      let resolvedDx = desiredDx;
      let resolvedDy = desiredDy;

      // 1. World Boundaries check
      if (hitbox.x + resolvedDx < worldBounds.minX) {
        resolvedDx = worldBounds.minX - hitbox.x;
      } else if (hitbox.x + hitbox.width + resolvedDx > worldBounds.maxX) {
        resolvedDx = worldBounds.maxX - (hitbox.x + hitbox.width);
      }

      if (hitbox.y + resolvedDy < worldBounds.minY) {
        resolvedDy = worldBounds.minY - hitbox.y;
      } else if (hitbox.y + hitbox.height + resolvedDy > worldBounds.maxY) {
        resolvedDy = worldBounds.maxY - (hitbox.y + hitbox.height);
      }

      // 2. Test X axis collision with solid obstacles
      const testBoxX = {
        x: hitbox.x + resolvedDx,
        y: hitbox.y,
        width: hitbox.width,
        height: hitbox.height
      };

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (obs.isSolid !== false && Collision.checkAABB(testBoxX, obs)) {
          // Collision on X: cancel horizontal movement
          resolvedDx = 0;
          break;
        }
      }

      // 3. Test Y axis collision with solid obstacles
      const testBoxY = {
        x: hitbox.x + resolvedDx,
        y: hitbox.y + resolvedDy,
        width: hitbox.width,
        height: hitbox.height
      };

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (obs.isSolid !== false && Collision.checkAABB(testBoxY, obs)) {
          // Collision on Y: cancel vertical movement
          resolvedDy = 0;
          break;
        }
      }

      return {
        dx: resolvedDx,
        dy: resolvedDy
      };
    }
  };

  // =========================================================================
  // 2. AREA (A specific room, glade, path, or level inside the World)
  // =========================================================================
  class Area {
    constructor(config) {
      this.id = config.id;
      this.name = config.name || 'Unnamed Area';
      this.width = config.width || 1400;
      this.height = config.height || 1000;
      this.spawnPoints = config.spawnPoints || { default: { x: 200, y: 500 } };
      this.obstacles = []; // Static solid bounding boxes
      this.entities = []; // Dynamic entities (Player, NPCs, Items, Doors)
      this.exits = config.exits || []; // Transitions to other areas
      this.terrainDrawer = config.renderTerrain || null;
      this.foregroundDrawer = config.renderForeground || null;
      this.backgroundColor = config.backgroundColor || '#14532d';
      this.ambientType = config.ambientType || 'forest'; // 'forest' | 'meadow' | 'indoor'
      this.movementMode = config.movementMode || 'standard'; // 'standard' | 'falling' | 'frozen'
      this.hasSkyBackdrop = config.hasSkyBackdrop !== undefined ? config.hasSkyBackdrop : (this.id === 'rabbit_woods' || this.id === 'forest_clearing');

      // Pre-baked offscreen canvas for complex terrain performance
      this._terrainCanvas = null;
      this.footprints = []; // Rabbit tracks and environmental footprints
    }

    addFootprint(fp) {
      if (!this.footprints) this.footprints = [];
      this.footprints.push(fp);
      if (this.footprints.length > 120) {
        this.footprints.shift();
      }
    }

    addObstacle(rect) {
      this.obstacles.push(rect);
    }

    addEntity(entity) {
      entity.area = this;
      this.entities.push(entity);
    }

    removeEntity(id) {
      const idx = this.entities.findIndex(e => e.id === id);
      if (idx !== -1) {
        return this.entities.splice(idx, 1)[0];
      }
      return null;
    }

    getEntity(id) {
      return this.entities.find(e => e.id === id) || null;
    }

    getSolidObstacles() {
      // Combines static obstacles with solid entities (e.g. closed doors, resting NPCs)
      const all = this.obstacles.slice();
      for (const ent of this.entities) {
        if (ent.isSolid) {
          all.push(ent.getHitbox());
        }
      }
      return all;
    }

    renderTerrain(ctx, camX, camY, viewW, viewH) {
      if (this.terrainDrawer) {
        this.terrainDrawer(ctx, this, camX, camY, viewW, viewH);
      } else {
        // Fallback default grassy ground
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
      }
    }

    renderForeground(ctx, camX, camY, viewW, viewH) {
      if (this.foregroundDrawer) {
        this.foregroundDrawer(ctx, this, camX, camY, viewW, viewH);
      }
    }
  }

  // =========================================================================
  // 3. WORLD COORDINATOR
  // =========================================================================
  class World {
    constructor() {
      this.areas = new Map();
      this.activeArea = null;
      this.player = null;
      this.activeInteractable = null;
      this.globalFlags = {};
      this.onTransition = null;
    }

    registerArea(area) {
      this.areas.set(area.id, area);
    }

    getArea(areaId) {
      return this.areas.get(areaId) || null;
    }

    setPlayer(playerEntity) {
      this.player = playerEntity;
    }

    loadArea(areaId, spawnName = 'default', immediate = true) {
      const area = this.areas.get(areaId);
      if (!area) {
        console.error(`[World] Area "${areaId}" not found in World.`);
        return false;
      }

      // 1. Deactivate previous area & clear interactions
      this.activeInteractable = null;
      if (this.activeArea && this.player) {
        this.activeArea.removeEntity(this.player.id);
      }

      // Clear any lingering environment particles from the previous scene
      if (root.StoryGame && root.StoryGame.renderer && root.StoryGame.renderer.clearParticles) {
        root.StoryGame.renderer.clearParticles();
      }

      // 2. Activate new area
      this.activeArea = area;

      // 3. Resolve Walkable Spawn Position
      const spawn = (area.spawnPoints && area.spawnPoints[spawnName]) ||
                    (area.spawnPoints && area.spawnPoints.default) ||
                    { x: 200, y: 200 };

      let spawnX = spawn.x;
      let spawnY = spawn.y;

      if (this.player) {
        const obstacles = area.getSolidObstacles();
        const hbOffset = this.player.hitboxOffset || { x: 6, y: 34, w: 32, h: 20 };
        const testHitbox = {
          x: spawnX + hbOffset.x,
          y: spawnY + hbOffset.y,
          width: hbOffset.w,
          height: hbOffset.h
        };

        // If spawn point collides with an obstacle, nudge into clear space
        for (const obs of obstacles) {
          if (Collision.checkAABB(testHitbox, obs)) {
            console.warn(`[World] Spawn (${spawnX}, ${spawnY}) collided with obstacle in area "${areaId}". Nudging to clear zone.`);
            if (spawnY < area.height / 2) {
              spawnY = obs.y + obs.height + 12;
            } else {
              spawnY = obs.y - hbOffset.y - hbOffset.h - 12;
            }
            break;
          }
        }

        // Clamp safely inside room perimeter
        spawnX = Math.max(60, Math.min(area.width - 60 - this.player.width, spawnX));
        spawnY = Math.max(60, Math.min(area.height - 60 - this.player.height, spawnY));

        // 4. Initialize Player Controller via resetForScene
        const targetMode = area.movementMode || 'standard';
        this.player.resetForScene(spawnX, spawnY, targetMode, spawn.facing || 'down');
        area.addEntity(this.player);
      }

      // 5. Reset Input Buffers
      if (root.StoryGame && root.StoryGame.input) {
        root.StoryGame.input.reset();
        root.StoryGame.input.ensureFocus();
      }

      // 6. Setup Camera Bounds and Immediate Alignment
      if (root.StoryGame && root.StoryGame.camera) {
        root.StoryGame.camera.setBounds(0, 0, area.width, area.height);
        if (this.player) {
          root.StoryGame.camera.follow(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, immediate);
        }
      }

      // 7. Update Area Name Badge in Top Bar
      const areaBadge = document.getElementById('story-area-name-badge');
      if (areaBadge) {
        areaBadge.textContent = area.name;
      }

      // 8. Trigger lifecycle events
      if (root.StoryGame && root.StoryGame.events) {
        root.StoryGame.events.emit('PLAYER_ENTER_AREA', {
          areaId: area.id,
          areaName: area.name
        });
        root.StoryGame.events.emit('SCENE_INITIALIZED', {
          areaId: area.id,
          areaName: area.name
        });
      }

      return true;
    }

    addParticle(p) {
      if (root.StoryGame && root.StoryGame.renderer) {
        root.StoryGame.renderer.addParticle(p);
      }
    }

    update(dt, input) {
      if (!this.activeArea || !this.player) return;

      const solidObstacles = this.activeArea.getSolidObstacles();
      const worldBounds = { minX: 0, minY: 0, maxX: this.activeArea.width, maxY: this.activeArea.height };

      // 1. Update Player
      this.player.update(dt, input, solidObstacles, worldBounds);

      // 2. Update Other Entities (NPCs, Collectibles, Doors)
      for (const ent of this.activeArea.entities) {
        if (ent !== this.player) {
          ent.update(dt, this);
        }
      }

      // 3. Proximity Interaction Checks
      let closestInteractable = null;
      let closestDist = Infinity;

      for (const ent of this.activeArea.entities) {
        if (ent !== this.player && ent.isInteractable) {
          const dist = Collision.getDistance(this.player, ent);
          const reach = (ent.interactionRadius || 70) + (this.player.width / 2);
          if (dist <= reach && dist < closestDist) {
            closestInteractable = ent;
            closestDist = dist;
          }
        }
      }

      this.activeInteractable = closestInteractable;

      // 4. Handle Interaction Trigger
      if (input.consumeInteract() && this.activeInteractable) {
        this.activeInteractable.onInteract(this.player, this);
      }

      // 5. Check Area Exit Portals
      for (const exit of this.activeArea.exits) {
        if (Collision.checkAABB(this.player.getHitbox(), exit.bounds)) {
          if (!exit.isLocked || (exit.isLocked && exit.isLocked() === false)) {
            if (this.onTransition) {
              this.onTransition(exit.targetArea, exit.targetSpawn);
            } else {
              this.loadArea(exit.targetArea, exit.targetSpawn);
            }
            break;
          }
        }
      }
    }
    addFootprint(fp) {
      if (this.activeArea && this.activeArea.addFootprint) {
        this.activeArea.addFootprint(fp);
      }
    }
  }

  // Export to namespace
  root.StoryWorld = {
    Collision,
    Area,
    World
  };

})(window);
