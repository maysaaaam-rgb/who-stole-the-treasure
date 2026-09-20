'use strict';
// =============================================================
// MONSTER LAB — Animation Controller
// Drives the idle loop and named animations via requestAnimationFrame
// =============================================================

class AnimationController {

  constructor(renderer) {
    this.renderer      = renderer;
    this.rafId         = null;
    this.time          = 0;
    this.animStartTime = 0;
    this.current       = 'idle';
    this.returnToIdle  = null;   // setTimeout handle
    this.onStageChange = null;   // callback(stage)
    this.particles     = [];
  }

  // -----------------------------------------------------------
  // Start / Stop RAF loop
  // -----------------------------------------------------------
  start() {
    if (this.rafId) return;
    const loop = (ts) => {
      this.time  = ts;
      this._update(ts);
      this.renderer.draw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // -----------------------------------------------------------
  // Play a named animation
  // -----------------------------------------------------------
  play(name) {
    // Clear any pending return-to-idle
    if (this.returnToIdle) {
      clearTimeout(this.returnToIdle);
      this.returnToIdle = null;
    }
    this.current       = name;
    this.animStartTime = this.time;

    const durations = {
      happy:     1600,
      excited:   1400,
      wave:      2000,
      jump:       900,
      celebrate: 2400,
      blink:      200,
      evolution: 2200
    };
    const dur = durations[name];
    if (dur && name !== 'idle') {
      this.returnToIdle = setTimeout(() => {
        this._resetAnimParams();
        this.current = 'idle';
        this.returnToIdle = null;
        // Signal happy blink after returning to idle
        if (name === 'evolution' && this.onStageChange) this.onStageChange();
      }, dur);
    }
  }

  // -----------------------------------------------------------
  // Per-frame update
  // -----------------------------------------------------------
  _update(ts) {
    const ap      = this.renderer.animParams;
    const elapsed = (ts - this.animStartTime) * 0.001; // seconds
    const t       = ts * 0.001;

    // =====================
    // Always-on IDLE layer
    // =====================
    ap.breathOffset  = Math.sin(t * 2.0)  * 2.8;
    ap.tailSwayAngle = Math.sin(t * 1.4)  * 0.14;
    ap.glowPulse     = 1.0 + Math.sin(t * 2.8) * 0.08;

    // Blink every ~4 seconds (blinkCycle is ms within 4000ms period)
    const blinkCycle = ts % 4000;
    if (blinkCycle < 160) {
      ap.blinkScale = blinkCycle < 80
        ? 1 - (blinkCycle / 80)  * 0.92
        : 1 - ((160 - blinkCycle) / 80) * 0.92;
    } else {
      ap.blinkScale = 1.0;
    }

    // =====================
    // Named animation layer
    // =====================
    switch (this.current) {

      case 'idle':
        ap.bounceOffset  = 0;
        ap.waveArmAngle  = 0;
        ap.squishX       = 1;
        ap.squishY       = 1;
        ap.eyeHappy      = 0;
        ap.evolutionFlash = 0;
        this._clearParticles();
        break;

      case 'happy':
      case 'excited': {
        const freq  = this.current === 'excited' ? 3.5 : 2.5;
        ap.bounceOffset   = -Math.abs(Math.sin(elapsed * Math.PI * freq)) * 18;
        ap.tailSwayAngle  = Math.sin(t * 5) * 0.38;
        ap.eyeHappy       = Math.min(elapsed * 2, 1);
        ap.waveArmAngle   = this.current === 'excited' ? Math.sin(t * 6) * 0.4 : 0;
        break;
      }

      case 'wave':
        ap.waveArmAngle = Math.sin(elapsed * Math.PI * 3.2) * 0.62;
        ap.tailSwayAngle = Math.sin(t * 1.8) * 0.22;
        break;

      case 'jump': {
        const jumpProgress = Math.min(elapsed / 0.9, 1);
        if (jumpProgress < 0.5) {
          // Rising
          ap.bounceOffset = -Math.sin(jumpProgress / 0.5 * Math.PI) * 38;
          ap.squishX = 1 - Math.sin(jumpProgress / 0.5 * Math.PI) * 0.08;
          ap.squishY = 1 + Math.sin(jumpProgress / 0.5 * Math.PI) * 0.10;
        } else if (jumpProgress < 0.62) {
          // Landing squish
          const lp = (jumpProgress - 0.5) / 0.12;
          ap.squishX = 1 + lp * 0.22;
          ap.squishY = 1 - lp * 0.18;
          ap.bounceOffset = 0;
        } else {
          // Recover
          const rp = (jumpProgress - 0.62) / 0.38;
          ap.squishX = 1 + (1 - rp) * 0.22;
          ap.squishY = 1 - (1 - rp) * 0.18;
          ap.bounceOffset = 0;
        }
        break;
      }

      case 'celebrate':
        ap.bounceOffset   = -Math.abs(Math.sin(elapsed * Math.PI * 2.8)) * 22;
        ap.waveArmAngle   = Math.sin(elapsed * Math.PI * 4) * 0.70;
        ap.tailSwayAngle  = Math.sin(t * 6) * 0.45;
        ap.eyeHappy       = 1;
        this._spawnParticle();
        break;

      case 'evolution': {
        const ep = elapsed / 2.2;
        ap.glowPulse      = 1.0 + Math.sin(elapsed * Math.PI * 8) * 0.38;
        ap.evolutionFlash = ep < 0.25
          ? ep * 4
          : ep < 0.60
            ? Math.max(0, 1 - (ep - 0.25) / 0.35)
            : 0;
        // Stars
        this._spawnEvolutionParticle();
        break;
      }
    }

    // Update particles
    this._updateParticles();
    this.renderer.particles = this.particles;
  }

  // -----------------------------------------------------------
  // Particles
  // -----------------------------------------------------------
  _spawnParticle() {
    if (Math.random() > 0.35) return;
    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#C77DFF','#FF9F1C'];
    this.particles.push({
      x:     (Math.random() - 0.5) * 180,
      y:     (Math.random() - 0.5) * 80 - 60,
      vx:    (Math.random() - 0.5) * 3.5,
      vy:    -Math.random() * 4.5 - 1.5,
      life:  1.0,
      color: colors[Math.floor(Math.random() * colors.length)],
      size:  Math.random() * 7 + 3,
      rot:   Math.random() * Math.PI * 2
    });
  }

  _spawnEvolutionParticle() {
    if (Math.random() > 0.4) return;
    const colors = ['#FFE840','#FFFFFF','#FFB830','#FFA0FF'];
    this.particles.push({
      x:    (Math.random() - 0.5) * 220,
      y:    (Math.random() - 0.5) * 260 - 60,
      vx:   (Math.random() - 0.5) * 2,
      vy:   -Math.random() * 3 - 0.5,
      life: 1.0,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 5 + 2,
      rot:  Math.random() * Math.PI * 2
    });
  }

  _updateParticles() {
    this.particles = this.particles.filter(p => p.life > 0);
    for (const p of this.particles) {
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.12; // gravity
      p.life -= 0.022;
      p.rot  += 0.05;
    }
  }

  _clearParticles() {
    this.particles = [];
  }

  _resetAnimParams() {
    const ap = this.renderer.animParams;
    ap.bounceOffset   = 0;
    ap.waveArmAngle   = 0;
    ap.squishX        = 1;
    ap.squishY        = 1;
    ap.eyeHappy       = 0;
    ap.evolutionFlash = 0;
  }
}
