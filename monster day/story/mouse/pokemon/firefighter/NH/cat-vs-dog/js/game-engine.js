/**
 * Cat vs Dog (Fleabag vs Mutt) Authentic Physics & Battle Engine
 * Faithful port of original Flash ActionScript physics, wind ranges, and combat
 * Includes 24 FPS tick sequencing, comic damage popups, and exact hitboxes
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
    this.fenceWidth = 20;

    // Fixed 24 FPS tick timing
    this.flashFps = 24;
    this.frameDuration = 1000 / this.flashFps; // ~41.67 ms

    // Game rules & options
    this.gameMode = '1P'; // '1P' (vs CPU) or '2P' (local pass-and-play)
    this.difficulty = 'normal'; // 'easy' or 'normal'
    this.playerSide = 'dog'; // In 1P, player controls Dog (or Cat)

    // Current turn: 'cat' or 'dog'
    this.currentTurn = 'cat';
    this.turnState = 'IDLE'; // 'IDLE', 'WINDUP', 'RELEASE', 'FLIGHT', 'RESOLVING', 'GAME_OVER'

    // Wind system
    this.wind = 0; // -7 to +7
    this.windFrame = 2; // Frame for DefineSprite_216

    // Power charging meter
    this.isCharging = false;
    this.chargeStartTime = 0;
    this.chargePower = 0; // 0.0 to 1.0 (1 to 32)
    this.meterOscillationPeriod = 1150; // ms for full 0 -> 100 -> 0 cycle

    // Active projectiles in flight & visual effects
    this.projectiles = [];
    this.particles = [];
    this.damagePopups = [];
    this.activeToxicClouds = [];
    this.screenShake = 0;

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
      state: 'idle', // 'idle', 'windup', 'release', 'hit_hurt', 'victory', 'defeat'
      frame: 0,
      frameAccumulator: 0,
      remainingThrows: 1,
      selectedPowerup: null, // 'x2', 'bomb', 'gas'
      powerups: {
        x2: true,
        bomb: true,
        gas: true,
        heal: true
      },
      hitbox: {
        w: type === 'cat' ? 56 : 60,
        h: type === 'cat' ? 75 : 80
      }
    };
  }

  reset() {
    this.cat = this.createCharacter('cat', 85, this.groundY);
    this.dog = this.createCharacter('dog', 525, this.groundY);
    this.projectiles = [];
    this.particles = [];
    this.damagePopups = [];
    this.activeToxicClouds = [];
    this.screenShake = 0;
    this.currentTurn = 'cat';
    this.turnState = 'IDLE';
    this.isCharging = false;
    this.chargePower = 0;
    this.aiState.previousShotError = 0;
    this.generateWind();
  }

  generateWind() {
    if (this.difficulty === 'easy') {
      const choices = [-1, 0, 1];
      this.wind = choices[Math.floor(Math.random() * choices.length)];
    } else {
      this.wind = Math.floor(Math.random() * 15) - 7;
    }

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
    return this.currentTurn !== this.playerSide;
  }

  usePowerup(characterType, powerup) {
    const char = characterType === 'cat' ? this.cat : this.dog;
    if (char.type !== this.currentTurn || this.turnState !== 'IDLE') return false;
    if (!char.powerups[powerup]) return false;

    if (powerup === 'heal') {
      char.powerups.heal = false;
      const healAmount = 28;
      char.hp = Math.min(char.maxHp, char.hp + healAmount);
      char.state = 'idle';
      this.audio.play('heal');
      this.spawnHealParticles(char.x, char.y - 40);
      this.spawnDamagePopup(char.x, char.y - 70, `+${healAmount} HEAL`, '#10b981');

      this.turnState = 'RESOLVING';
      setTimeout(() => {
        this.endTurn();
      }, 1100);
      return true;
    }

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
    char.state = 'windup';
    char.frame = 0;
    this.isCharging = true;
    this.chargeStartTime = performance.now();
    this.audio.play('charge_whistle', { volume: 0.6 });
  }

  releaseCharge() {
    if (!this.isCharging || this.turnState !== 'IDLE') return;
    this.isCharging = false;
    const char = this.getActiveCharacter();

    if (char.selectedPowerup === 'x2') {
      char.remainingThrows = 2;
      char.powerups.x2 = false;
    } else {
      char.remainingThrows = 1;
    }

    this.executeThrow(char, this.chargePower);
  }

  executeThrow(char, powerNormalized) {
    this.turnState = 'RELEASE';
    char.state = 'release';
    char.frame = 0;

    const p = Math.max(1, Math.min(32, Math.round(powerNormalized * 31) + 1));
    const isCat = char.type === 'cat';

    if (isCat) {
      this.audio.play('cat_throw');
    } else {
      this.audio.play('dog_throw');
    }

    // Trigger projectile spawn at arm release (~350ms into 24 FPS animation)
    setTimeout(() => {
      this.spawnProjectile(char, p);
    }, 380);
  }

  spawnProjectile(char, powerVal) {
    const isCat = char.type === 'cat';
    const startX = isCat ? char.x + 35 : char.x - 35;
    const startY = char.y - 65;

    // Exact ballistics scaled to canvas
    const angleRad = (53 * Math.PI) / 180;
    const baseSpeed = 7.2 + (powerVal / 32) * 9.4;

    const vx = Math.cos(angleRad) * baseSpeed * (isCat ? 1 : -1);
    const vy = -Math.sin(angleRad) * baseSpeed;

    const projType = char.selectedPowerup === 'bomb' ? 'bomb' : (isCat ? 'can' : 'bone');
    const isGas = char.selectedPowerup === 'gas';

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
      rotSpeed: isCat ? 0.32 : 0.28,
      power: powerVal,
      active: true,
      frame: 0
    });

    this.turnState = 'FLIGHT';
  }

  update(deltaMs) {
    // 1. Power meter oscillation
    if (this.isCharging) {
      const elapsed = performance.now() - this.chargeStartTime;
      const progress = (elapsed % this.meterOscillationPeriod) / this.meterOscillationPeriod;
      this.chargePower = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
    }

    // 2. CPU AI Turn Handling
    if (this.isCpuTurn() && this.turnState === 'IDLE') {
      this.handleCpuTurn(deltaMs);
    }

    // 3. Update character animations at locked 24 FPS
    this.updateCharacterAnim(this.cat, deltaMs);
    this.updateCharacterAnim(this.dog, deltaMs);

    // 4. Update Screen Shake
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - deltaMs * 0.04);
    }

    // 5. Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (!p.active) continue;

      const windForce = this.wind * 0.048;
      p.vx += windForce;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.frame = (p.frame + 0.4) % 8;

      // Trail particle
      if (Math.random() < 0.4) {
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

      this.checkProjectileCollisions(p);

      if (!p.active) {
        this.projectiles.splice(i, 1);
        this.handlePostThrow();
      }
    }

    // 6. Update particles, toxic clouds, and comic damage popups
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.025;
      pt.life -= deltaMs;
      if (pt.life <= 0 || pt.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.damagePopups.length - 1; i >= 0; i--) {
      const dp = this.damagePopups[i];
      dp.y += dp.vy;
      dp.vy += 0.04; // decelerate upward
      dp.life -= deltaMs;
      dp.alpha = Math.max(0, dp.life / 800);
      if (dp.life <= 0) {
        this.damagePopups.splice(i, 1);
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

    // A. Center Fence Collision (Exact Flash boundaries)
    const fenceHalf = this.fenceWidth / 2;
    if (p.x >= this.fenceX - fenceHalf && p.x <= this.fenceX + fenceHalf && p.y >= this.fenceTopY && p.y <= this.groundY) {
      p.active = false;
      this.audio.play('hit_fence');
      this.screenShake = 3;
      this.spawnImpactParticles(p.x, p.y, '#996600', 10);
      this.spawnDamagePopup(this.fenceX, this.fenceTopY - 10, 'CLANG!', '#f59e0b');
      return;
    }

    // B. Opponent Character Collision (Exact Flash movieclip bounds)
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
      this.spawnDamagePopup(p.x, this.groundY - 15, 'MISS!', '#94a3b8');
      return;
    }

    // D. Off-screen bounds
    if (p.x < -60 || p.x > this.width + 60 || p.y > this.height + 60) {
      p.active = false;
    }
  }

  applyHit(target, projectile) {
    let damage = Math.floor(Math.random() * 5) + 18; // 18-22 normal
    let isCrit = false;

    if (projectile.type === 'bomb') {
      damage *= 2; // double damage
      isCrit = true;
      this.screenShake = 8;
    } else {
      this.screenShake = 4;
    }

    target.hp = Math.max(0, target.hp - damage);
    target.state = 'hit_hurt';
    target.frame = 0;

    // Authentic audio
    this.audio.play('hit_char');
    if (target.type === 'cat') {
      this.audio.play('cat_hurt');
    } else {
      this.audio.play('dog_hurt');
    }

    // Spawn floating comic damage text
    const label = isCrit ? `-${damage} CRITICAL!` : `-${damage}`;
    const color = isCrit ? '#ef4444' : '#fbbf24';
    this.spawnDamagePopup(target.x, target.y - 75, label, color);
    this.spawnImpactParticles(target.x, target.y - 45, color, isCrit ? 16 : 10);

    // Toxic Stink Attack
    if (projectile.isGas) {
      this.activeToxicClouds.push({
        x: target.x,
        y: target.y - 40,
        frame: 0,
        life: 2500
      });
      target.hp = Math.max(0, target.hp - 8);
      this.spawnDamagePopup(target.x, target.y - 100, '-8 POISON', '#10b981');
    }

    // Check KO
    if (target.hp <= 0) {
      this.triggerGameOver(projectile.owner);
    } else {
      // Revert from hurt to idle after 600ms
      setTimeout(() => {
        if (target.hp > 0 && target.state === 'hit_hurt') {
          target.state = 'idle';
        }
      }, 650);
    }
  }

  handlePostThrow() {
    const char = this.getActiveCharacter();
    char.remainingThrows--;

    if (char.remainingThrows > 0 && this.turnState !== 'GAME_OVER') {
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

    if (this.cat.hp > 0 && this.cat.state !== 'victory') this.cat.state = 'idle';
    if (this.dog.hp > 0 && this.dog.state !== 'victory') this.dog.state = 'idle';

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
    winner.frame = 0;
    loser.state = 'defeat';
    loser.frame = 4; // dazed frame

    this.audio.play('victory');

    if (this.onGameOver) {
      this.onGameOver(winnerType);
    }
  }

  handleCpuTurn(deltaMs) {
    if (!this.aiState.isCharging) {
      this.aiState.isCharging = true;
      this.aiState.chargeStart = performance.now();

      const isDog = this.currentTurn === 'dog';
      let idealPower = isDog ? 21.5 - this.wind * 1.05 : 21.5 + this.wind * 1.05;

      let variance = 0;
      if (this.difficulty === 'easy') {
        variance = (Math.random() - 0.5) * 7.0;
      } else {
        variance = (Math.random() - 0.5) * 2.2;
        idealPower += this.aiState.previousShotError * 0.4;
      }

      const finalP = Math.max(1, Math.min(32, Math.round(idealPower + variance)));
      this.aiState.targetPower = finalP / 32;

      const cpuChar = this.getActiveCharacter();
      if (Math.random() < 0.35) {
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
      if (this.chargePower >= this.aiState.targetPower) {
        this.aiState.isCharging = false;
        this.releaseCharge();
      }
    }
  }

  updateCharacterAnim(char, deltaMs) {
    const animKey = `${char.type}_${char.state}`;
    const anim = this.sprites.animations[animKey];
    if (!anim) return;

    // Accumulator tick counter locked strictly to 24 FPS
    char.frameAccumulator = (char.frameAccumulator || 0) + deltaMs;
    while (char.frameAccumulator >= this.frameDuration) {
      char.frameAccumulator -= this.frameDuration;
      char.frame = (char.frame + 1) % anim.count;
    }
  }

  spawnDamagePopup(x, y, text, color = '#fbbf24') {
    this.damagePopups.push({
      x: x,
      y: y,
      vy: -1.8,
      text: text,
      color: color,
      alpha: 1.0,
      life: 800
    });
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
    for (let i = 0; i < 12; i++) {
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
