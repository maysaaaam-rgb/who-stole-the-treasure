/**
 * Cat vs Dog (Fleabag vs Mutt) Authentic Physics & Battle Engine
 * Faithful port of original Flash ActionScript physics, wind ranges, and combat
 */
class BattleEngine {
  constructor(audio, sprites) {
    this.audio = audio;
    this.sprites = sprites;

    // Viewport dimensions (Native Flash resolution)
    this.width = 600;
    this.height = 430;

    // Ground and obstacle positions
    this.groundY = 338;
    this.fenceX = 300;
    this.fenceTopY = 195;
    this.fenceWidth = 16;

    // Game rules & options
    this.gameMode = '1P'; // '1P' (vs CPU) or '2P' (local pass-and-play)
    this.difficulty = 'normal'; // 'easy' or 'normal' / 'hard'
    this.playerSide = 'dog'; // In 1P, player controls Dog (or Cat)

    // Current turn: 'cat' or 'dog'
    this.currentTurn = 'cat';
    this.turnState = 'IDLE'; // 'IDLE', 'CHARGING', 'THROWING', 'FLIGHT', 'RESOLVING', 'GAME_OVER'

    // Wind system
    this.wind = 0; // -7 to +7
    this.windFrame = 2; // Frame for DefineSprite_216

    // Power charging meter
    this.isCharging = false;
    this.chargeStartTime = 0;
    this.chargePower = 0; // 0.0 to 1.0 (1 to 32)
    this.meterOscillationPeriod = 1150; // ms for full 0 -> 100 -> 0 cycle

    // Active projectiles in flight
    this.projectiles = [];
    this.particles = [];
    this.activeToxicClouds = [];

    // Characters
    this.cat = this.createCharacter('cat', 85, this.groundY);
    this.dog = this.createCharacter('dog', 525, this.groundY);

    // AI state
    this.aiState = {
      isCharging: false,
      targetPower: 0,
      chargeStart: 0,
      previousShotError: 0
    };

    // Callbacks for UI
    this.onStateChange = null;
    this.onTurnChange = null;
    this.onGameOver = null;

    this.reset();
  }

  createCharacter(type, x, y) {
    return {
      type: type,
      x: x,
      y: y,
      hp: 100,
      maxHp: 100,
      state: 'idle', // 'idle', 'charging', 'throwing', 'hurt', 'healing', 'victory', 'defeated'
      stateFrame: 0,
      stateTimer: 0,
      remainingThrows: 1,
      selectedPowerup: null, // 'x2', 'bomb', 'gas'
      powerups: {
        x2: true,
        bomb: true,
        gas: true,
        heal: true
      },
      hitbox: {
        w: 55,
        h: 75
      }
    };
  }

  reset() {
    this.cat = this.createCharacter('cat', 85, this.groundY);
    this.dog = this.createCharacter('dog', 525, this.groundY);
    this.projectiles = [];
    this.particles = [];
    this.activeToxicClouds = [];
    this.currentTurn = 'cat';
    this.turnState = 'IDLE';
    this.isCharging = false;
    this.chargePower = 0;
    this.aiState.previousShotError = 0;
    this.generateWind();
  }

  generateWind() {
    if (this.difficulty === 'easy') {
      // Flash easy mode: wind is in {-1, 0, 1}
      const choices = [-1, 0, 1];
      this.wind = choices[Math.floor(Math.random() * choices.length)];
    } else {
      // Flash normal mode: random integer -7 to +7
      this.wind = Math.floor(Math.random() * 15) - 7;
    }

    // Map to DefineSprite_216 frame:
    // Frame 2: 0 wind
    // Frames 9..3: -1 to -7 (left)
    // Frames 16..10: +1 to +7 (right)
    if (this.wind === 0) {
      this.windFrame = 2;
    } else if (this.wind < 0) {
      this.windFrame = 10 + this.wind; // -1 -> 9, -7 -> 3
    } else {
      this.windFrame = 17 - this.wind; // 1 -> 16, 7 -> 10
    }
  }

  getActiveCharacter() {
    return this.currentTurn === 'cat' ? this.cat : this.dog;
  }

  getOpponentCharacter() {
    return this.currentTurn === 'cat' ? this.dog : this.cat;
  }

  isCpuTurn() {
    if (this.gameMode === '2P') return false;
    // In 1P mode, CPU controls the side not chosen by player
    return this.currentTurn !== this.playerSide;
  }

  usePowerup(characterType, powerup) {
    const char = characterType === 'cat' ? this.cat : this.dog;
    if (char.type !== this.currentTurn || this.turnState !== 'IDLE') return false;
    if (!char.powerups[powerup]) return false;

    if (powerup === 'heal') {
      // First Aid Bandage heals immediately and consumes turn
      char.powerups.heal = false;
      char.hp = Math.min(char.maxHp, char.hp + 28);
      char.state = 'healing';
      char.stateFrame = 0;
      this.audio.play('heal');
      this.spawnHealParticles(char.x, char.y - 40);

      this.turnState = 'RESOLVING';
      setTimeout(() => {
        char.state = 'idle';
        this.endTurn();
      }, 1200);
      return true;
    }

    // Toggle selected attack power-up
    if (char.selectedPowerup === powerup) {
      char.selectedPowerup = null;
    } else {
      char.selectedPowerup = powerup;
      this.audio.play('powerup_select');
    }
    return true;
  }

  startCharging() {
    if (this.turnState !== 'IDLE' || this.isCharging) return;
    const char = this.getActiveCharacter();
    char.state = 'charging';
    char.stateFrame = 0;
    this.isCharging = true;
    this.chargeStartTime = performance.now();
  }

  releaseCharge() {
    if (!this.isCharging || this.turnState !== 'IDLE') return;
    this.isCharging = false;
    const char = this.getActiveCharacter();

    // Check if double attack active
    if (char.selectedPowerup === 'x2') {
      char.remainingThrows = 2;
      char.powerups.x2 = false;
    } else {
      char.remainingThrows = 1;
    }

    this.executeThrow(char, this.chargePower);
  }

  executeThrow(char, powerNormalized) {
    this.turnState = 'THROWING';
    char.state = 'throwing';
    char.stateFrame = 0;

    // Power index p is 1 to 32
    const p = Math.max(1, Math.min(32, Math.round(powerNormalized * 31) + 1));
    const isCat = char.type === 'cat';

    // Play throw whoosh sound
    if (isCat) {
      this.audio.play('cat_throw');
    } else {
      this.audio.play('dog_throw');
    }

    // Trigger projectile spawn at throw release frame (~frame 30 of 70)
    setTimeout(() => {
      this.spawnProjectile(char, p);
    }, 450);
  }

  spawnProjectile(char, powerVal) {
    const isCat = char.type === 'cat';
    const startX = isCat ? char.x + 35 : char.x - 35;
    const startY = char.y - 65;

    // Exact ballistics scaled to canvas
    // Launch angle: ~53 degrees
    const angleRad = (53 * Math.PI) / 180;
    const baseSpeed = 7.2 + (powerVal / 32) * 9.4;

    const vx = Math.cos(angleRad) * baseSpeed * (isCat ? 1 : -1);
    const vy = -Math.sin(angleRad) * baseSpeed;

    const projType = char.selectedPowerup === 'bomb' ? 'bomb' : (isCat ? 'can' : 'bone');
    const isGas = char.selectedPowerup === 'gas';

    // Consume used attack powerup
    if (char.selectedPowerup === 'bomb') char.powerups.bomb = false;
    if (char.selectedPowerup === 'gas') char.powerups.gas = false;
    char.selectedPowerup = null;

    this.projectiles.push({
      type: projType,
      isGas: isGas,
      owner: char.type,
      x: startX,
      y: startY,
      vx: vx,
      vy: vy,
      gravity: 0.38,
      rotation: 0,
      rotSpeed: isCat ? 0.3 : 0.25,
      power: powerVal,
      active: true,
      frame: 0
    });

    this.turnState = 'FLIGHT';
  }

  update(deltaMs) {
    // 1. Update power meter oscillation if charging
    if (this.isCharging) {
      const elapsed = performance.now() - this.chargeStartTime;
      const progress = (elapsed % this.meterOscillationPeriod) / this.meterOscillationPeriod;
      // Triangular wave 0 -> 1 -> 0
      this.chargePower = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
    }

    // 2. CPU AI Turn Handling
    if (this.isCpuTurn() && this.turnState === 'IDLE') {
      this.handleCpuTurn(deltaMs);
    }

    // 3. Update character animations
    this.updateCharacterAnim(this.cat, deltaMs);
    this.updateCharacterAnim(this.dog, deltaMs);

    // 4. Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (!p.active) continue;

      // Ballistic physics step:
      // Apply horizontal wind acceleration
      const windForce = this.wind * 0.048;
      p.vx += windForce;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.frame = (p.frame + 0.5) % 8;

      // Trail particle
      if (Math.random() < 0.35) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: 0.6,
          size: p.type === 'bomb' ? 6 : 3,
          color: p.isGas ? '#33cccc' : '#f8fafc',
          life: 250
        });
      }

      // Collision checks
      this.checkProjectileCollisions(p);

      if (!p.active) {
        this.projectiles.splice(i, 1);
        this.handlePostThrow();
      }
    }

    // 5. Update particles & toxic gas clouds
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.02;
      pt.life -= deltaMs;
      if (pt.life <= 0 || pt.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.activeToxicClouds.length - 1; i >= 0; i--) {
      const cloud = this.activeToxicClouds[i];
      cloud.life -= deltaMs;
      cloud.frame = (cloud.frame + 0.1) % 3;
      if (cloud.life <= 0) {
        this.activeToxicClouds.splice(i, 1);
      }
    }
  }

  checkProjectileCollisions(p) {
    const isCat = p.owner === 'cat';
    const target = isCat ? this.dog : this.cat;

    // A. Center Fence Collision
    if (p.x >= this.fenceX - 10 && p.x <= this.fenceX + 10 && p.y >= this.fenceTopY) {
      p.active = false;
      this.audio.play('hit_fence');
      this.spawnImpactParticles(p.x, p.y, '#996600', 8);
      return;
    }

    // B. Opponent Character Collision
    const hw = target.hitbox.w / 2;
    if (p.x >= target.x - hw && p.x <= target.x + hw && p.y >= target.y - target.hitbox.h && p.y <= target.y) {
      p.active = false;
      this.applyHit(target, p);
      return;
    }

    // C. Ground Collision
    if (p.y >= this.groundY) {
      p.active = false;
      this.audio.play('hit_ground');
      this.spawnImpactParticles(p.x, this.groundY, '#d2801c', 6);
      return;
    }

    // D. Off-screen Left/Right/Bottom Bounds
    if (p.x < -60 || p.x > this.width + 60 || p.y > this.height + 60) {
      p.active = false;
    }
  }

  applyHit(target, projectile) {
    let damage = Math.floor(Math.random() * 5) + 18; // 18-22 base damage
    if (projectile.type === 'bomb') {
      damage *= 2; // double damage for Power Bomb
    }

    target.hp = Math.max(0, target.hp - damage);
    target.state = 'hurt';
    target.stateFrame = 0;

    // Authentic audio
    this.audio.play('hit_char');
    if (target.type === 'cat') {
      this.audio.play('cat_hurt');
    } else {
      this.audio.play('dog_hurt');
    }

    // Spawn impact flash and particles
    this.spawnImpactParticles(target.x, target.y - 45, '#ef4444', 12);

    // Spawn toxic gas cloud if stink attack
    if (projectile.isGas) {
      this.activeToxicClouds.push({
        x: target.x,
        y: target.y - 40,
        frame: 0,
        life: 2500
      });
      target.hp = Math.max(0, target.hp - 8);
    }

    // Check KO
    if (target.hp <= 0) {
      this.triggerGameOver(projectile.owner);
    }
  }

  handlePostThrow() {
    const char = this.getActiveCharacter();
    char.remainingThrows--;

    if (char.remainingThrows > 0 && this.turnState !== 'GAME_OVER') {
      // Double throw: immediate follow-up throw!
      setTimeout(() => {
        this.executeThrow(char, this.chargePower);
      }, 500);
    } else if (this.turnState !== 'GAME_OVER') {
      this.turnState = 'RESOLVING';
      setTimeout(() => {
        this.endTurn();
      }, 1000);
    }
  }

  endTurn() {
    if (this.turnState === 'GAME_OVER') return;

    this.currentTurn = this.currentTurn === 'cat' ? 'dog' : 'cat';
    this.turnState = 'IDLE';
    this.isCharging = false;
    this.chargePower = 0;

    // Reset character states to idle if not KO
    if (this.cat.hp > 0 && this.cat.state !== 'victory') this.cat.state = 'idle';
    if (this.dog.hp > 0 && this.dog.state !== 'victory') this.dog.state = 'idle';

    // Generate new wind for the new round
    this.generateWind();

    if (this.onTurnChange) {
      this.onTurnChange(this.currentTurn, this.wind);
    }
  }

  triggerGameOver(winnerType) {
    this.turnState = 'GAME_OVER';
    const winner = winnerType === 'cat' ? this.cat : this.dog;
    const loser = winnerType === 'cat' ? this.dog : this.cat;

    winner.state = 'victory';
    winner.stateFrame = 0;
    loser.state = 'defeated';
    loser.stateFrame = 0;

    // Play authentic fanfare
    this.audio.play('victory');

    if (this.onGameOver) {
      this.onGameOver(winnerType);
    }
  }

  handleCpuTurn(deltaMs) {
    if (!this.aiState.isCharging) {
      // AI initiates charge
      this.aiState.isCharging = true;
      this.aiState.chargeStart = performance.now();

      // Original Flash AI formula:
      // Mutt: p_ideal = 21 - wind * 1.05
      // Fleabag: p_ideal = 21 + wind * 1.05
      const isDog = this.currentTurn === 'dog';
      let idealPower = isDog ? 21.5 - this.wind * 1.05 : 21.5 + this.wind * 1.05;

      // Add difficulty variance
      let variance = 0;
      if (this.difficulty === 'easy') {
        variance = (Math.random() - 0.5) * 7.0; // easy makes mistakes
      } else {
        variance = (Math.random() - 0.5) * 2.2; // normal / hard is sharp
        // adaptive learning from previous shot
        idealPower += this.aiState.previousShotError * 0.4;
      }

      const finalP = Math.max(1, Math.min(32, Math.round(idealPower + variance)));
      this.aiState.targetPower = finalP / 32;

      // Randomly use a powerup if available (30% chance)
      const cpuChar = this.getActiveCharacter();
      if (Math.random() < 0.3) {
        if (cpuChar.hp < 40 && cpuChar.powerups.heal) {
          this.usePowerup(cpuChar.type, 'heal');
          this.aiState.isCharging = false;
          return;
        } else if (cpuChar.powerups.bomb) {
          cpuChar.selectedPowerup = 'bomb';
        } else if (cpuChar.powerups.x2) {
          cpuChar.selectedPowerup = 'x2';
        } else if (cpuChar.powerups.gas) {
          cpuChar.selectedPowerup = 'gas';
        }
      }

      this.startCharging();
    } else {
      // Check if current charge reached target power
      if (this.chargePower >= this.aiState.targetPower) {
        this.aiState.isCharging = false;
        this.releaseCharge();
      }
    }
  }

  updateCharacterAnim(char, deltaMs) {
    char.stateTimer += deltaMs;
    const animKey = `${char.type}_${char.state}`;
    const anim = this.sprites.animations[animKey];
    if (!anim) return;

    const frameStep = (anim.fps * deltaMs) / 1000;
    char.stateFrame = (char.stateFrame + frameStep) % anim.count;
  }

  spawnImpactParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        alpha: 1.0,
        size: Math.random() * 4 + 2,
        color: color,
        life: 400
      });
    }
  }

  spawnHealParticles(x, y) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 1.0,
        vy: -Math.random() * 2.5 - 1.0,
        alpha: 1.0,
        size: 5,
        color: '#10b981',
        life: 600
      });
    }
  }
}

window.BattleEngine = BattleEngine;
