'use strict';
// =============================================================
// MONSTER LAB — Lumifox Canvas Renderer
// Component-based layered Canvas 2D character system
//
// Coordinate system: local space, body center = (0, 0)
//   Head center:  (0, -118)   Head radius: 68
//   Ear tips:     (±52, -245)
//   Feet bottom:  (±24, 102)
//   Tail tip:     (~200, -165) [plume]
// Canvas: 450 × 520  |  Character cx=175, cy=472-102*scale
// =============================================================

class MonsterRenderer {

  constructor() {
    this.canvas     = null;
    this.ctx        = null;
    this.state      = null;
    this.particles  = [];
    // Animation parameters — set by AnimationController each frame
    this.animParams = {
      breathOffset:   0,   // ±3px, whole-body gentle bob
      tailSwayAngle:  0,   // radians, tail rotates around base
      blinkScale:     1.0, // 1=open, 0=closed
      bounceOffset:   0,   // px, whole-character jump offset
      waveArmAngle:   0,   // radians, right arm rotates
      glowPulse:      1.0, // aura size pulse factor
      squishX:        1.0, // landing squish
      squishY:        1.0,
      evolutionFlash: 0,   // 0–1 white overlay for evolution
      eyeHappy:       0    // 0=normal, 1=happy squint
    };
  }

  // -----------------------------------------------------------
  // Public API
  // -----------------------------------------------------------
  mount(container, state) {
    this.canvas        = document.createElement('canvas');
    this.canvas.width  = 450;
    this.canvas.height = 520;
    this.canvas.style.cssText = 'width:100%;height:auto;display:block;image-rendering:auto;';
    container.appendChild(this.canvas);
    this.ctx   = this.canvas.getContext('2d', { alpha: true });
    this.state = { ...state };
    this.draw();
    return this;
  }

  update(newState) {
    this.state = { ...this.state, ...newState };
    this.draw();
  }

  setSkin(category, value) {
    this.state[category] = value;
    this.draw();
  }

  setEvolution(stage) {
    this.state.evolutionStage = stage;
    this.draw();
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx    = null;
  }

  // -----------------------------------------------------------
  // Main draw — called every frame by AnimationController
  // -----------------------------------------------------------
  draw() {
    if (!this.ctx) return;
    const ctx   = this.ctx;
    const W     = 450, H = 520;
    const ap    = this.animParams;
    const state = this.state;
    const stage = state.evolutionStage;

    ctx.clearRect(0, 0, W, H);

    // Special: egg stage
    if (stage === 'egg') {
      this._drawEgg(ctx, W / 2, H / 2 + 10, ap);
      return;
    }

    const ec       = this._getEvoConfig(stage);
    const scale    = ec.scale;
    const bounceY  = ap.bounceOffset || 0;
    const breathY  = (ap.breathOffset || 0) * scale;
    // Feet always land near y=472
    const cy       = 472 - 102 * scale + bounceY + breathY;
    const cx       = 175; // slightly left of centre — tail sweeps right

    // Ground shadow
    this._drawGroundShadow(ctx, cx, 478, scale);

    // Particle layer (celebration confetti)
    this._drawParticles(ctx, cx, 472 - 102 * scale + bounceY);

    // Entire character under one transform
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale * (ap.squishX || 1), scale * (ap.squishY || 1));

    this._drawAura(ctx, state, ap, ec);
    this._drawTail(ctx, state, ap, ec);
    this._drawEars(ctx, state, ap, ec);
    this._drawBody(ctx, state, ap, ec);
    this._drawOutfit(ctx, state, ap, ec);
    this._drawHead(ctx, state, ap, ec);
    this._drawEyes(ctx, state, ap, ec);
    this._drawMouth(ctx, state, ap, ec);
    this._drawAccessory(ctx, state, ap, ec);

    ctx.restore();

    // Legendary gold shimmer overlay
    if (stage === 'legendary') {
      this._drawLegendaryShimmer(ctx, cx, cy, scale, ap);
    }

    // Evolution flash
    if (ap.evolutionFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${ap.evolutionFlash})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // -----------------------------------------------------------
  // Evolution & Fur helpers
  // -----------------------------------------------------------
  _getEvoConfig(stage) {
    const configs = {
      baby:       { scale: 0.53, headScale: 1.38, detailLevel: 0 },
      tot:        { scale: 0.64, headScale: 1.22, detailLevel: 0 },
      young:      { scale: 0.77, headScale: 1.10, detailLevel: 1 },
      adventurer: { scale: 0.90, headScale: 1.00, detailLevel: 1 },
      elite:      { scale: 1.01, headScale: 1.00, detailLevel: 2 },
      legendary:  { scale: 1.14, headScale: 1.00, detailLevel: 3 }
    };
    return configs[stage] || configs.young;
  }

  _getFur(furType) {
    const p = {
      orange: { base:'#FF8C42', light:'#FFB878', shadow:'#C95E1E', dark:'#9A4010', belly:'#FFF0E0' },
      blue:   { base:'#4A9EFF', light:'#80C0FF', shadow:'#2B7AE0', dark:'#1A58B8', belly:'#E0EEFF' },
      purple: { base:'#A855F7', light:'#CC88FF', shadow:'#7C3AED', dark:'#5520C0', belly:'#F0E0FF' },
      green:  { base:'#34D399', light:'#70EABB', shadow:'#059669', dark:'#047857', belly:'#E0FFF5' },
      pink:   { base:'#F472B6', light:'#F8A8D4', shadow:'#DB2777', dark:'#BB1560', belly:'#FFE0F0' }
    };
    return p[furType] || p.orange;
  }

  // -----------------------------------------------------------
  // Ground Shadow
  // -----------------------------------------------------------
  _drawGroundShadow(ctx, cx, groundY, scale) {
    const g = ctx.createRadialGradient(cx, groundY, 0, cx, groundY, 72 * scale);
    g.addColorStop(0,   'rgba(0,0,0,0.28)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.10)');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx, groundY, 72 * scale, 20 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // -----------------------------------------------------------
  // Particles (celebration)
  // -----------------------------------------------------------
  _drawParticles(ctx, cx, groundY) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle   = p.color;
      ctx.translate(cx + p.x, groundY + p.y - 150);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
  }

  // -----------------------------------------------------------
  // AURA
  // -----------------------------------------------------------
  _drawAura(ctx, state, ap, ec) {
    if (!state.aura) return;
    const pulse  = ap.glowPulse || 1;
    const t      = Date.now() * 0.001;

    const auras = {
      fire:     { c0:'rgba(255,200,40,0.45)',  c1:'rgba(255,80,0,0.20)',    c2:'rgba(255,0,0,0)' },
      ice:      { c0:'rgba(180,240,255,0.45)', c1:'rgba(80,180,255,0.18)', c2:'rgba(0,120,255,0)' },
      electric: { c0:'rgba(255,240,50,0.50)',  c1:'rgba(180,40,255,0.22)', c2:'rgba(80,0,255,0)' },
      rainbow:  { c0:'rgba(255,180,255,0.40)', c1:'rgba(120,200,255,0.18)',c2:'rgba(100,255,180,0)' }
    };
    const a = auras[state.aura];
    if (!a) return;

    ctx.save();
    const grd = ctx.createRadialGradient(0, -105, 15 * pulse, 0, -105, 148 * pulse);
    grd.addColorStop(0,   a.c0);
    grd.addColorStop(0.5, a.c1);
    grd.addColorStop(1,   a.c2);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(0, -105, 135 * pulse, 175 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aura-specific effects
    if (state.aura === 'fire') {
      for (let i = 0; i < 6; i++) {
        const fx   = Math.sin(t * 1.3 + i * 1.05) * 55 + (i - 2.5) * 20;
        const fh   = 28 + Math.sin(t * 2.1 + i) * 14;
        const fGrd = ctx.createLinearGradient(fx, -65, fx, -65 - fh);
        fGrd.addColorStop(0, 'rgba(255,100,0,0.75)');
        fGrd.addColorStop(0.5,'rgba(255,200,20,0.45)');
        fGrd.addColorStop(1, 'rgba(255,255,100,0)');
        ctx.fillStyle = fGrd;
        ctx.beginPath();
        ctx.ellipse(fx, -65 - fh * 0.5, 9, fh * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (state.aura === 'electric') {
      ctx.strokeStyle = 'rgba(255,240,80,0.65)';
      ctx.lineWidth   = 1.8;
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 + t;
        const ex  = Math.cos(ang) * 100;
        const ey  = Math.sin(ang) * 130 - 105;
        const mx  = ex * 0.5 + Math.sin(t * 3 + i) * 22;
        const my  = ey * 0.5 + Math.cos(t * 3 + i) * 22;
        ctx.beginPath();
        ctx.moveTo(0, -105);
        ctx.lineTo(mx, my);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
    } else if (state.aura === 'rainbow') {
      const rc = ['rgba(255,80,80,0.22)','rgba(255,165,0,0.22)','rgba(255,255,60,0.22)',
                  'rgba(80,255,80,0.22)','rgba(60,60,255,0.22)','rgba(180,0,255,0.22)'];
      rc.forEach((c, i) => {
        ctx.strokeStyle = c;
        ctx.lineWidth   = 7;
        ctx.beginPath();
        ctx.arc(0, -105, 78 + i * 13 + Math.sin(t + i * 0.5) * 5, 0, Math.PI * 2);
        ctx.stroke();
      });
    } else if (state.aura === 'ice') {
      ctx.strokeStyle = 'rgba(200,240,255,0.55)';
      ctx.lineWidth   = 1.5;
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + t * 0.4;
        const r1  = 80 + Math.sin(t * 2 + i) * 12;
        ctx.beginPath();
        ctx.moveTo(0, -105);
        ctx.lineTo(Math.cos(ang) * r1, Math.sin(ang) * r1 - 105 + 105);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // -----------------------------------------------------------
  // TAIL
  // -----------------------------------------------------------
  _drawTail(ctx, state, ap, ec) {
    const fur  = this._getFur(state.fur);
    const sway = ap.tailSwayAngle || 0;

    ctx.save();
    // Rotate tail around its base at (55, 25)
    ctx.translate(55, 25);
    ctx.rotate(sway);
    ctx.translate(-55, -25);

    switch (state.tail) {
      case 'curl':      this._tailCurl(ctx, fur); break;
      case 'lightning': this._tailLightning(ctx, fur); break;
      case 'ribbon':    this._tailRibbon(ctx, fur); break;
      default:          this._tailPlume(ctx, fur); break;
    }
    ctx.restore();
  }

  _tailPlume(ctx, fur) {
    // Sweeping plume tail from hip right, curling up-right
    // Main body
    const g = ctx.createLinearGradient(55, 25, 195, -162);
    g.addColorStop(0,    fur.dark);
    g.addColorStop(0.12, fur.shadow);
    g.addColorStop(0.50, fur.base);
    g.addColorStop(0.80, fur.light);
    g.addColorStop(1,    '#FFFFFF');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(53, 23);
    ctx.bezierCurveTo(82,  2,  132, -58, 168, -128);
    ctx.bezierCurveTo(192, -162, 215, -182, 205, -172);
    ctx.bezierCurveTo(192, -158, 174, -148, 158, -128);
    ctx.bezierCurveTo(128,  -90, 112,  -38,  98,  12);
    ctx.bezierCurveTo( 88,   42,  65,   46,  57,  27);
    ctx.closePath();
    ctx.fill();

    // Fur stripe (inner shading stripe)
    const sg = ctx.createLinearGradient(78, 5, 130, -110);
    sg.addColorStop(0,   'rgba(0,0,0,0)');
    sg.addColorStop(0.4, 'rgba(0,0,0,0.08)');
    sg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.moveTo(64, 20);
    ctx.bezierCurveTo(88, 0, 134, -62, 162, -122);
    ctx.bezierCurveTo(148, -116, 108, -54, 82, 8);
    ctx.bezierCurveTo(75, 22, 67, 25, 64, 20);
    ctx.closePath();
    ctx.fill();

    // White plume tip — multiple overlapping fluffy blobs
    [[194,-168,48,32,-0.4], [178,-154,33,23,0.2], [162,-142,24,17,0.5]].forEach(([x,y,rx,ry,rot]) => {
      const tg = ctx.createRadialGradient(x, y, 4, x, y, rx);
      tg.addColorStop(0,   'rgba(255,255,255,1)');
      tg.addColorStop(0.55,'rgba(255,255,255,0.85)');
      tg.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
    });

    // Highlight along upper edge
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(55, 22);
    ctx.bezierCurveTo(76, 6, 118, -50, 153, -114);
    ctx.bezierCurveTo(138, -108, 100, -44, 72, 10);
    ctx.closePath();
    ctx.fill();

    // Subtle outline
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(53, 23);
    ctx.bezierCurveTo(82,2,132,-58,168,-128);
    ctx.bezierCurveTo(192,-162,215,-182,205,-172);
    ctx.bezierCurveTo(192,-158,174,-148,158,-128);
    ctx.bezierCurveTo(128,-90,112,-38,98,12);
    ctx.bezierCurveTo(88,42,65,46,57,27);
    ctx.closePath();
    ctx.stroke();
  }

  _tailCurl(ctx, fur) {
    // Thick spiral coiling tail
    const pts = [
      [55,25],  [120,-2], [160,-62], [150,-112],
      [138,-158],[80,-172],[50,-146],[22,-122],
      [32,-80],  [62,-68], [92,-60], [108,-98]
    ];
    // Outer stroke (shadow color)
    ctx.strokeStyle = fur.shadow;
    ctx.lineWidth   = 26;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]);
    ctx.stroke();
    // Base color
    ctx.strokeStyle = fur.base;
    ctx.lineWidth   = 20;
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]);
    ctx.stroke();
    // Inner light streak
    ctx.strokeStyle = fur.light;
    ctx.lineWidth   = 10;
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]);
    ctx.stroke();
    // Highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth   = 5;
    ctx.beginPath();
    ctx.moveTo(58, 22);
    ctx.bezierCurveTo(125,-5,162,-66,148,-110);
    ctx.stroke();
    // Round tip
    const tg = ctx.createRadialGradient(108,-100,2,108,-100,16);
    tg.addColorStop(0,'#FFFFFF');
    tg.addColorStop(1, fur.light);
    ctx.fillStyle = tg;
    ctx.beginPath();
    ctx.arc(108, -100, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  _tailLightning(ctx, fur) {
    const pts = [[55,25],[102,-28],[76,-80],[132,-130],[96,-162],[148,-202]];
    const drawZig = (lw, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'bevel';
      ctx.beginPath();
      ctx.moveTo(...pts[0]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]);
      ctx.stroke();
    };
    drawZig(24, fur.dark);
    drawZig(18, fur.base);
    drawZig(10, fur.light);
    // Electric glow
    ctx.shadowBlur  = 18;
    ctx.shadowColor = '#FFD700';
    drawZig(4, 'rgba(255,240,80,0.7)');
    ctx.shadowBlur  = 0;
    // Star at tip
    this._star(ctx, 148, -202, 13, '#FFE840');
  }

  _tailRibbon(ctx, fur) {
    const r1 = '#FF6BC8', r2 = '#FFA0DC';
    // Ribbon 1
    const stroke = (color, lw, cp) => {
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(55, 20);
      ctx.bezierCurveTo(...cp);
      ctx.stroke();
    };
    stroke(r1, 11, [100,-20,140,-78,128,-148]);
    stroke('rgba(255,255,255,0.4)', 5, [100,-22,140,-80,126,-146]);
    // Ribbon 2
    stroke(r2, 11, [98,10,158,-30,168,-98]);
    stroke('rgba(255,255,255,0.4)', 5, [98,8,156,-32,166,-100]);
    // Bow at base
    this._bow(ctx, 55, 22);
  }

  _bow(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    [[-9,0,13,9,-0.35],[9,0,13,9,0.35]].forEach(([bx,by,rx,ry,rot]) => {
      ctx.fillStyle   = '#FF6BC8';
      ctx.strokeStyle = '#CC2A88';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.ellipse(bx, by, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = '#CC2A88';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // -----------------------------------------------------------
  // EARS
  // -----------------------------------------------------------
  _drawEars(ctx, state, ap, ec) {
    const fur = this._getFur(state.fur);
    const hs  = ec.headScale || 1;
    ctx.save();
    // Scale ears with headScale around head center (0, -118)
    ctx.translate(0, -118);
    ctx.scale(hs, hs);
    ctx.translate(0, 118);
    switch (state.ears) {
      case 'pointy': this._earPointy(ctx, fur); break;
      case 'round':  this._earRound(ctx, fur);  break;
      default:       this._earFluffy(ctx, fur);  break;
    }
    ctx.restore();
  }

  _earFluffy(ctx, fur) {
    // Draw left then right (right is mirrored)
    [-1, 1].forEach(side => {
      ctx.save();
      ctx.scale(side, 1);
      // Outer ear
      const og = ctx.createLinearGradient(28, -190, 65, -170);
      og.addColorStop(0, fur.light);
      og.addColorStop(0.5, fur.base);
      og.addColorStop(1, fur.shadow);
      ctx.fillStyle   = og;
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth   = 1.8;
      ctx.beginPath();
      ctx.moveTo(22, -163);
      ctx.bezierCurveTo(26,-182, 34,-222, 48,-242);
      ctx.bezierCurveTo(55,-256, 68,-255, 70,-240);
      ctx.bezierCurveTo(72,-225, 65,-193, 60,-167);
      ctx.bezierCurveTo(55,-160, 34,-159, 22,-163);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Inner ear (warm pink)
      const ig = ctx.createLinearGradient(40,-235, 57,-170);
      ig.addColorStop(0,   'rgba(255,175,185,0.95)');
      ig.addColorStop(0.7, 'rgba(255,135,148,0.80)');
      ig.addColorStop(1,   'rgba(255,115,130,0.50)');
      ctx.fillStyle = ig;
      ctx.beginPath();
      ctx.moveTo(30,-170);
      ctx.bezierCurveTo(33,-186, 40,-219, 50,-236);
      ctx.bezierCurveTo(55,-247, 63,-246, 64,-234);
      ctx.bezierCurveTo(65,-220, 59,-192, 55,-172);
      ctx.bezierCurveTo(51,-163, 35,-162, 30,-170);
      ctx.closePath();
      ctx.fill();
      // Ear highlight
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.ellipse(40, -214, 8, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  _earPointy(ctx, fur) {
    [-1, 1].forEach(side => {
      ctx.save();
      ctx.scale(side, 1);
      const og = ctx.createLinearGradient(30,-200, 62,-170);
      og.addColorStop(0, fur.light);
      og.addColorStop(1, fur.shadow);
      ctx.fillStyle   = og;
      ctx.strokeStyle = 'rgba(0,0,0,0.20)';
      ctx.lineWidth   = 1.8;
      ctx.beginPath();
      ctx.moveTo(22,-163);
      ctx.bezierCurveTo(24,-192, 42,-258, 54,-278);
      ctx.bezierCurveTo(60,-268, 68,-252, 65,-230);
      ctx.bezierCurveTo(62,-205, 57,-178, 56,-165);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Inner
      ctx.fillStyle = 'rgba(255,155,168,0.85)';
      ctx.beginPath();
      ctx.moveTo(30,-170);
      ctx.bezierCurveTo(32,-195, 46,-250, 54,-270);
      ctx.bezierCurveTo(58,-260, 62,-244, 60,-226);
      ctx.bezierCurveTo(58,-204, 54,-180, 53,-170);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  _earRound(ctx, fur) {
    [-1, 1].forEach(side => {
      ctx.save();
      ctx.scale(side, 1);
      const rg = ctx.createRadialGradient(44,-196,5, 44,-196,34);
      rg.addColorStop(0,   fur.light);
      rg.addColorStop(0.6, fur.base);
      rg.addColorStop(1,   fur.shadow);
      ctx.fillStyle   = rg;
      ctx.strokeStyle = 'rgba(0,0,0,0.20)';
      ctx.lineWidth   = 1.8;
      ctx.beginPath();
      ctx.ellipse(44, -196, 33, 36, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,165,178,0.85)';
      ctx.beginPath();
      ctx.ellipse(44, -197, 21, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // -----------------------------------------------------------
  // BODY (torso + legs + arms)
  // -----------------------------------------------------------
  _drawBody(ctx, state, ap, ec) {
    const fur      = this._getFur(state.fur);
    const waveAng  = ap.waveArmAngle || 0;

    // ---- Torso ----
    const bg = ctx.createRadialGradient(-20,-30,8, 0,0,78);
    bg.addColorStop(0,   fur.light);
    bg.addColorStop(0.4, fur.base);
    bg.addColorStop(1,   fur.shadow);
    ctx.fillStyle   = bg;
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 60, 72, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Belly lighter spot
    const belly = ctx.createRadialGradient(0,10,4, 0,8,44);
    belly.addColorStop(0,   'rgba(255,255,255,0.68)');
    belly.addColorStop(0.55,'rgba(255,255,255,0.28)');
    belly.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 38, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top-left specular highlight
    const hl = ctx.createRadialGradient(-28,-38,2, -28,-38,38);
    hl.addColorStop(0,  'rgba(255,255,255,0.35)');
    hl.addColorStop(1,  'rgba(255,255,255,0)');
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.ellipse(-24,-33,33,28,-0.3,0,Math.PI*2);
    ctx.fill();

    // ---- Legs ----
    [[-22,68],[ 22,68]].forEach(([lx,ly]) => {
      const lg = ctx.createLinearGradient(lx-18, ly-18, lx+10, ly+25);
      lg.addColorStop(0, fur.base);
      lg.addColorStop(1, fur.shadow);
      ctx.fillStyle   = lg;
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.ellipse(lx, ly, 19, 28, lx < 0 ? -0.1 : 0.1, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    });

    // ---- Feet (paws) ----
    [[-24,90],[24,90]].forEach(([fx,fy]) => {
      const fg = ctx.createLinearGradient(fx-20,fy-4, fx+14,fy+12);
      fg.addColorStop(0, fur.shadow);
      fg.addColorStop(1, fur.base);
      ctx.fillStyle   = fg;
      ctx.strokeStyle = 'rgba(0,0,0,0.20)';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.ellipse(fx, fy, 21, 13, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // Toe lines
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth   = 1;
      [-7,0,7].forEach(dx => {
        ctx.beginPath();
        ctx.moveTo(fx+dx, fy-5);
        ctx.lineTo(fx+dx, fy+3);
        ctx.stroke();
      });
    });

    // ---- Left arm (static) ----
    ctx.fillStyle   = fur.base;
    ctx.strokeStyle = 'rgba(0,0,0,0.14)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(-60,-28);
    ctx.bezierCurveTo(-86,-22,-94,10,-82,30);
    ctx.bezierCurveTo(-72,42,-54,34,-50,18);
    ctx.bezierCurveTo(-46,4,-46,-22,-60,-28);
    ctx.fill(); ctx.stroke();
    const lpg = ctx.createRadialGradient(-82,30,3,-82,30,15);
    lpg.addColorStop(0, fur.light);
    lpg.addColorStop(1, fur.base);
    ctx.fillStyle = lpg;
    ctx.beginPath();
    ctx.ellipse(-82, 31, 15, 12, 0.3, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();

    // ---- Right arm (waves) ----
    ctx.save();
    ctx.translate(60, -28);
    ctx.rotate(waveAng);
    ctx.translate(-60, 28);
    ctx.fillStyle   = fur.base;
    ctx.strokeStyle = 'rgba(0,0,0,0.14)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(60,-28);
    ctx.bezierCurveTo(86,-22,94,10,82,30);
    ctx.bezierCurveTo(72,42,54,34,50,18);
    ctx.bezierCurveTo(46,4,46,-22,60,-28);
    ctx.fill(); ctx.stroke();
    const rpg = ctx.createRadialGradient(82,30,3,82,30,15);
    rpg.addColorStop(0, fur.light);
    rpg.addColorStop(1, fur.base);
    ctx.fillStyle = rpg;
    ctx.beginPath();
    ctx.ellipse(82, 31, 15, 12, -0.3, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  // -----------------------------------------------------------
  // OUTFIT
  // -----------------------------------------------------------
  _drawOutfit(ctx, state, ap, ec) {
    const isGirl = state.style === 'girl';
    switch (state.outfit) {
      case 'scholar': this._outfitScholar(ctx, isGirl, ec); break;
      case 'knight':  this._outfitKnight(ctx, isGirl, ec);  break;
      case 'casual':  this._outfitCasual(ctx, isGirl, ec);  break;
      default:        this._outfitExplorer(ctx, isGirl, ec); break;
    }
  }

  _outfitExplorer(ctx, isGirl, ec) {
    const jc = isGirl ? '#E8956A' : '#C8753A'; // jacket color
    const vc = isGirl ? '#D0784A' : '#A05828'; // vest
    const ic = '#F5DEBB';                        // inner shirt

    // Jacket sides
    ctx.fillStyle   = jc;
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth   = 1.5;
    [[-1],[1]].forEach(([s]) => {
      ctx.save(); ctx.scale(s,1);
      ctx.beginPath();
      ctx.moveTo(18,-55); ctx.lineTo(58,-45);
      ctx.bezierCurveTo(64,0,62,38,55,60);
      ctx.lineTo(18,60); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    });
    // Inner shirt
    ctx.fillStyle = ic;
    ctx.beginPath();
    ctx.moveTo(-18,-55); ctx.lineTo(18,-55); ctx.lineTo(18,60); ctx.lineTo(-18,60); ctx.closePath();
    ctx.fill();
    // Lapels
    [[1],[-1]].forEach(([s]) => {
      ctx.save(); ctx.scale(s,1);
      ctx.fillStyle = vc;
      ctx.beginPath();
      ctx.moveTo(22,-55); ctx.lineTo(0,-38); ctx.lineTo(0,-22); ctx.lineTo(28,-22);
      ctx.bezierCurveTo(38,-34,35,-55,22,-55); ctx.fill();
      ctx.restore();
    });
    // Belt
    const beltG = ctx.createLinearGradient(-62,18,62,26);
    beltG.addColorStop(0,'#6A3010'); beltG.addColorStop(0.5,'#8B4513'); beltG.addColorStop(1,'#6A3010');
    ctx.fillStyle = beltG;
    ctx.beginPath(); ctx.rect(-62,18,124,14); ctx.fill();
    // Buckle
    ctx.fillStyle='#D4AF37'; ctx.beginPath(); ctx.rect(-11,18,22,14); ctx.fill();
    ctx.strokeStyle='#B8860B'; ctx.lineWidth=2; ctx.strokeRect(-11,18,22,14);
    ctx.fillStyle='#8B6914'; ctx.beginPath(); ctx.rect(-5,21,10,8); ctx.fill();
    // Pocket
    ctx.fillStyle=vc; ctx.beginPath(); ctx.rect(-57,4,26,18); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.18)'; ctx.lineWidth=1; ctx.strokeRect(-57,4,26,18);
    if (isGirl) {
      ctx.fillStyle='#FFAAD8'; ctx.beginPath(); ctx.arc(-44,-12,7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FF6BB5'; ctx.beginPath(); ctx.arc(-44,-12,3.5,0,Math.PI*2); ctx.fill();
    } else {
      [0,-22,22].forEach(by => {
        ctx.beginPath(); ctx.arc(0,by-8,3.5,0,Math.PI*2);
        ctx.fillStyle='#7A5510'; ctx.fill();
      });
    }
  }

  _outfitScholar(ctx, isGirl, ec) {
    const uc = isGirl ? '#6A85C8' : '#3A5A8A';
    const ac = isGirl ? '#B090FF' : '#4A8AFF';
    // Jacket
    ctx.fillStyle   = uc;
    ctx.strokeStyle = 'rgba(0,0,0,0.14)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath(); ctx.ellipse(0,0,60,72,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Shirt front
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(-18,-55); ctx.lineTo(18,-55); ctx.lineTo(14,35); ctx.lineTo(-14,35); ctx.closePath();
    ctx.fill();
    if (isGirl) {
      // Bow tie
      [[-9,0,11,7,0.3],[9,0,11,7,-0.3]].forEach(([bx,by,rx,ry,rot]) => {
        ctx.fillStyle='#FF6BC8'; ctx.strokeStyle='#BB2278'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.ellipse(bx,by,rx,ry,rot,0,Math.PI*2); ctx.fill(); ctx.stroke();
      });
      ctx.fillStyle='#BB2278'; ctx.beginPath(); ctx.ellipse(0,0,5,4,0,0,Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle='#28406A';
      ctx.beginPath(); ctx.moveTo(-6,-48); ctx.lineTo(6,-48); ctx.lineTo(10,22); ctx.lineTo(0,30); ctx.lineTo(-10,22); ctx.closePath();
      ctx.fill();
    }
    // Trim lines
    ctx.strokeStyle = ac; ctx.lineWidth = 2.5;
    [[-1],[1]].forEach(([s]) => {
      ctx.save(); ctx.scale(s,1);
      ctx.beginPath(); ctx.moveTo(60,-28); ctx.bezierCurveTo(62,0,60,40,52,58); ctx.stroke();
      ctx.restore();
    });
    // Buttons
    for (let i=0;i<3;i++) {
      ctx.fillStyle=ac; ctx.beginPath(); ctx.arc(0,-38+i*18,3.5,0,Math.PI*2); ctx.fill();
    }
  }

  _outfitKnight(ctx, isGirl, ec) {
    const ph = '#FFFFFF'; // plate highlight
    const pb = isGirl ? '#D0C0E8' : '#C8C8D8'; // plate base
    const ps = isGirl ? '#8060A8' : '#6868A0'; // plate shadow
    const ac = isGirl ? '#E090D0' : '#60A0E0'; // accent
    // Chest plate
    const ag = ctx.createLinearGradient(-58,-55,58,65);
    ag.addColorStop(0, ph); ag.addColorStop(0.12, pb); ag.addColorStop(0.5, ps);
    ag.addColorStop(0.88, pb); ag.addColorStop(1, ps);
    ctx.fillStyle   = ag;
    ctx.strokeStyle = ps;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-50,-52);
    ctx.bezierCurveTo(-63,-20,-63,32,-50,62); ctx.lineTo(50,62);
    ctx.bezierCurveTo(63,32,63,-20,50,-52);
    ctx.bezierCurveTo(35,-66,-35,-66,-50,-52);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Ridge
    const rg = ctx.createLinearGradient(-5,-55,5,62);
    rg.addColorStop(0,ph); rg.addColorStop(0.5,pb); rg.addColorStop(1,ps);
    ctx.fillStyle=rg;
    ctx.beginPath(); ctx.moveTo(-5,-62); ctx.lineTo(5,-62); ctx.lineTo(8,62); ctx.lineTo(-8,62); ctx.closePath(); ctx.fill();
    // Pauldrons
    [-1,1].forEach(s => {
      ctx.save(); ctx.scale(s,1);
      const pg2 = ctx.createRadialGradient(-55,-34,5,-55,-34,28);
      pg2.addColorStop(0,ph); pg2.addColorStop(0.4,pb); pg2.addColorStop(1,ps);
      ctx.fillStyle=pg2; ctx.strokeStyle=ps; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.ellipse(-56,-34,27,20,0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.restore();
    });
    // Gem
    ctx.fillStyle=ac; ctx.beginPath(); ctx.ellipse(0,-18,11,14,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.58)'; ctx.beginPath(); ctx.ellipse(-3,-22,3,4.5,0,0,Math.PI*2); ctx.fill();
    // Waist plate
    ctx.fillStyle=ps; ctx.beginPath(); ctx.rect(-57,30,114,13); ctx.fill();
    ctx.fillStyle='#D4AF37'; ctx.beginPath(); ctx.rect(-13,30,26,13); ctx.fill();
  }

  _outfitCasual(ctx, isGirl, ec) {
    const c1 = isGirl ? '#FF9DE2' : '#5B8AC8';
    const c2 = isGirl ? '#C876B0' : '#3A6AA0';
    const c3 = '#FFFFFF';
    // Sweater base
    ctx.fillStyle   = c1;
    ctx.strokeStyle = 'rgba(0,0,0,0.10)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath(); ctx.ellipse(0,5,61,71,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Stripes
    for (let i=-3;i<=3;i++) {
      if (i%2===0) continue;
      const sy = i*13+5;
      ctx.save();
      ctx.beginPath(); ctx.ellipse(0,5,61,71,0,0,Math.PI*2); ctx.clip();
      ctx.fillStyle=c2; ctx.fillRect(-70,sy-4,140,8);
      ctx.restore();
    }
    // Collar
    ctx.fillStyle=c3;
    ctx.beginPath();
    ctx.moveTo(-22,-55); ctx.bezierCurveTo(-18,-72,18,-72,22,-55);
    ctx.lineTo(16,-42); ctx.bezierCurveTo(8,-50,-8,-50,-16,-42); ctx.closePath();
    ctx.fill(); ctx.strokeStyle=c2; ctx.lineWidth=1; ctx.stroke();
    if (isGirl) {
      // Heart pocket
      ctx.fillStyle='#FF6BC8';
      ctx.save(); ctx.translate(-36,6);
      ctx.beginPath(); ctx.moveTo(0,6);
      ctx.bezierCurveTo(-5,1,-13,-1,-13,-8); ctx.bezierCurveTo(-13,-16,-5,-16,0,-10);
      ctx.bezierCurveTo(5,-16,13,-16,13,-8); ctx.bezierCurveTo(13,-1,5,1,0,6);
      ctx.fill(); ctx.restore();
    } else {
      ctx.fillStyle=c3; ctx.font='bold 20px Arial';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('7', 0, 14);
    }
  }

  // -----------------------------------------------------------
  // HEAD
  // -----------------------------------------------------------
  _drawHead(ctx, state, ap, ec) {
    const fur = this._getFur(state.fur);
    const hs  = ec.headScale || 1;

    ctx.save();
    ctx.translate(0, -118);
    ctx.scale(hs, hs);
    ctx.translate(0, 118);

    const hcy = -118;
    const hr  = 68;

    // Head circle
    const hg = ctx.createRadialGradient(-22,-138,10, 0,hcy,78);
    hg.addColorStop(0,   fur.light);
    hg.addColorStop(0.4, fur.base);
    hg.addColorStop(1,   fur.shadow);
    ctx.fillStyle   = hg;
    ctx.strokeStyle = 'rgba(0,0,0,0.20)';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(0, hcy, hr, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Cheek blushes
    [[- 44,-90],[44,-90]].forEach(([cx,cy]) => {
      const cg = ctx.createRadialGradient(cx,cy,3,cx,cy,21);
      cg.addColorStop(0,'rgba(255,155,155,0.38)');
      cg.addColorStop(1,'rgba(255,155,155,0)');
      ctx.fillStyle=cg;
      ctx.beginPath(); ctx.ellipse(cx,cy,19,16,cx<0?0.2:-0.2,0,Math.PI*2); ctx.fill();
    });

    // Muzzle (lighter protrusion)
    const mg = ctx.createRadialGradient(0,-88,5,0,-88,37);
    mg.addColorStop(0,   fur.belly);
    mg.addColorStop(0.6, '#FFEEDD');
    mg.addColorStop(1,   fur.base);
    ctx.fillStyle   = mg;
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.ellipse(0,-90,36,27,0,0,Math.PI*2); ctx.fill(); ctx.stroke();

    // Nose (heart shape)
    const ng = ctx.createRadialGradient(-3,-76,1,0,-77,10);
    ng.addColorStop(0,'#FF9090'); ng.addColorStop(0.4,'#CC3344'); ng.addColorStop(1,'#881122');
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.moveTo(0,-73);
    ctx.bezierCurveTo(-5,-76,-11,-74,-11,-80); ctx.bezierCurveTo(-11,-84,-5,-85,0,-81);
    ctx.bezierCurveTo(5,-85,11,-84,11,-80);    ctx.bezierCurveTo(11,-74,5,-76,0,-73);
    ctx.fill();
    // Nose highlight
    ctx.fillStyle='rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.ellipse(-4,-80,3,2,0.4,0,Math.PI*2); ctx.fill();

    // Head specular
    const sg = ctx.createRadialGradient(-30,-155,2,-30,-155,32);
    sg.addColorStop(0,'rgba(255,255,255,0.40)'); sg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=sg;
    ctx.beginPath(); ctx.ellipse(-26,-152,27,20,-0.35,0,Math.PI*2); ctx.fill();

    ctx.restore();
  }

  // -----------------------------------------------------------
  // EYES
  // -----------------------------------------------------------
  _drawEyes(ctx, state, ap, ec) {
    const blink = ap.blinkScale !== undefined ? ap.blinkScale : 1;
    const happy = ap.eyeHappy || 0;
    const hs    = ec.headScale || 1;

    ctx.save();
    ctx.translate(0, -118);
    ctx.scale(hs, hs);
    ctx.translate(0, 118);

    switch (state.eyes) {
      case 'sleepy':  this._eyesSleepy(ctx, blink);      break;
      case 'fierce':  this._eyesFierce(ctx, blink);      break;
      case 'sparkle': this._eyesSparkle(ctx, blink);     break;
      default:        this._eyesBright(ctx, blink, happy); break;
    }
    ctx.restore();
  }

  _eyeCore(ctx, ex, ey, rx, ry, blink, irisC) {
    ctx.save();
    ctx.translate(ex, ey);
    ctx.scale(1, blink);

    // Sclera
    const sg = ctx.createRadialGradient(-rx*0.2,-ry*0.2,1, 0,0,rx*1.3);
    sg.addColorStop(0,'#FFFFFF'); sg.addColorStop(0.7,'#F8F8F0'); sg.addColorStop(1,'#E8E8D8');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.fill();

    // Upper shadow
    const ush = ctx.createLinearGradient(0,-ry,0,-ry*0.2);
    ush.addColorStop(0,'rgba(150,110,70,0.28)'); ush.addColorStop(1,'rgba(150,110,70,0)');
    ctx.fillStyle=ush;
    ctx.beginPath(); ctx.ellipse(0,-ry*0.2,rx,ry*0.45,0,0,Math.PI*2); ctx.fill();

    // Iris
    const ir  = rx * 0.68;
    const ig  = ctx.createRadialGradient(-ir*0.22,-ir*0.28,1, 0,0,ir*1.1);
    ig.addColorStop(0, irisC[0]); ig.addColorStop(0.4, irisC[1]); ig.addColorStop(0.8, irisC[2]); ig.addColorStop(1, irisC[3]);
    ctx.fillStyle=ig;
    ctx.beginPath(); ctx.arc(0,0,ir,0,Math.PI*2); ctx.fill();

    // Pupil
    const pr  = ir * 0.52;
    const pg  = ctx.createRadialGradient(-pr*0.15,-pr*0.18,0, 0,0,pr);
    pg.addColorStop(0,'#3A3A3A'); pg.addColorStop(0.6,'#1A1A1A'); pg.addColorStop(1,'#000000');
    ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(0,0,pr,0,Math.PI*2); ctx.fill();

    // Limbal ring
    ctx.strokeStyle='rgba(80,40,10,0.45)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(0,0,ir,0,Math.PI*2); ctx.stroke();

    // Main highlight (upper left)
    ctx.fillStyle='rgba(255,255,255,0.92)';
    ctx.beginPath(); ctx.ellipse(-rx*0.28,-ry*0.32,rx*0.22,rx*0.18,-0.5,0,Math.PI*2); ctx.fill();
    // Secondary highlight
    ctx.fillStyle='rgba(255,255,255,0.68)';
    ctx.beginPath(); ctx.ellipse(rx*0.22,-ry*0.10,rx*0.10,rx*0.08,0.3,0,Math.PI*2); ctx.fill();
    // Tiny dot
    ctx.fillStyle='rgba(255,255,255,0.80)';
    ctx.beginPath(); ctx.arc(-rx*0.1,ry*0.22,rx*0.065,0,Math.PI*2); ctx.fill();

    // Eye outline
    ctx.strokeStyle='rgba(50,30,10,0.35)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.stroke();

    ctx.restore();

    // Eyelid line (not blinkScaled — always at same Y)
    ctx.strokeStyle='#2A1808'; ctx.lineWidth=2.2; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(ex-rx*1.05, ey+2);
    ctx.bezierCurveTo(ex-rx*0.6, ey-ry*1.35*blink, ex+rx*0.6, ey-ry*1.35*blink, ex+rx*1.05, ey+2);
    ctx.stroke();
    // Eyelashes
    const lashX = [-0.75,-0.35,0.02,0.4,0.78];
    lashX.forEach((lx, i) => {
      const lyy   = ey - ry * Math.sqrt(1 - lx*lx) * blink;
      const ang   = lx * 0.45;
      const llen  = i === 2 ? 9 : 6;
      ctx.strokeStyle = '#2A1808';
      ctx.lineWidth   = i === 2 ? 2.4 : 1.6;
      ctx.beginPath();
      ctx.moveTo(ex + lx * rx, lyy);
      ctx.lineTo(ex + lx * rx + Math.sin(ang) * llen, lyy - Math.cos(ang) * llen * 0.85);
      ctx.stroke();
    });
  }

  _eyesBright(ctx, blink, happy) {
    const ic = ['#FFD860','#E89818','#C06010','#804010'];
    const ey = -122 + happy * 4;
    const ry = 19 * (1 - happy * 0.35);
    this._eyeCore(ctx, -28, ey, 17, ry, blink, ic);
    this._eyeCore(ctx,  28, ey, 17, ry, blink, ic);
    if (happy > 0.5) {
      // Happiness blush
      [[-44,-95],[44,-95]].forEach(([bx,by]) => {
        const bg = ctx.createRadialGradient(bx,by,1,bx,by,18);
        bg.addColorStop(0,'rgba(255,140,140,0.45)'); bg.addColorStop(1,'rgba(255,140,140,0)');
        ctx.fillStyle=bg; ctx.beginPath(); ctx.ellipse(bx,by,16,12,0,0,Math.PI*2); ctx.fill();
      });
    }
  }

  _eyesSleepy(ctx, blink) {
    // Half-lidded eyes using clip
    [-28, 28].forEach((ex, idx) => {
      ctx.save();
      ctx.translate(ex, -120);
      const rx=17, ry=18;
      // Clip to show only lower 60% of eye
      ctx.beginPath(); ctx.rect(-rx-4, ry*(-0.35), rx*2+8, ry*1.8); ctx.clip();
      // Sclera
      ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.ellipse(0,0,rx,ry*blink,0,0,Math.PI*2); ctx.fill();
      // Iris (teal)
      const ig = ctx.createRadialGradient(-2,3,1, 0,4,12);
      ig.addColorStop(0,'#60D8D0'); ig.addColorStop(0.5,'#20A8A0'); ig.addColorStop(1,'#085858');
      ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(0,4,12,0,Math.PI*2); ctx.fill();
      // Pupil
      ctx.fillStyle='#0A1818'; ctx.beginPath(); ctx.arc(0,4,5.5,0,Math.PI*2); ctx.fill();
      // Highlight
      ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.ellipse(-4,0,4,3,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
      // Heavy eyelid (covers upper portion)
      const fur2 = this._getFur(this.state.fur);
      ctx.fillStyle = fur2.base;
      ctx.beginPath();
      ctx.moveTo(ex-rx*1.1, -120-ry*0.35);
      ctx.bezierCurveTo(ex-rx*0.6,-120-ry*1.4,ex+rx*0.6,-120-ry*1.4,ex+rx*1.1,-120-ry*0.35);
      ctx.lineTo(ex+rx*1.1,-120-ry*1.6);
      ctx.bezierCurveTo(ex+rx*0.6,-120-ry*2,ex-rx*0.6,-120-ry*2,ex-rx*1.1,-120-ry*1.6);
      ctx.closePath(); ctx.fill();
      // Eyelid line
      ctx.strokeStyle='#085858'; ctx.lineWidth=2.8; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(ex-rx*1.05,-120-ry*0.35);
      ctx.bezierCurveTo(ex-rx*0.6,-120-ry*1.2,ex+rx*0.6,-120-ry*1.2,ex+rx*1.05,-120-ry*0.35);
      ctx.stroke();
    });
  }

  _eyesFierce(ctx, blink) {
    [-32, 32].forEach((ex, idx) => {
      const s = idx === 0 ? 1 : -1;
      ctx.save();
      ctx.translate(ex, -118);
      ctx.transform(1, s*0.22, 0, 1, 0, 0); // shear for angry slant
      // Sclera
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.ellipse(0,0,17,13*blink,0,0,Math.PI*2); ctx.fill();
      // Red iris
      const ig = ctx.createRadialGradient(-2,-2,1, 0,0,12);
      ig.addColorStop(0,'#FF7070'); ig.addColorStop(0.4,'#CC1818'); ig.addColorStop(1,'#440000');
      ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(0,0,11,0,Math.PI*2); ctx.fill();
      // Slit pupil
      ctx.fillStyle='#1A0000'; ctx.beginPath(); ctx.ellipse(0,0,4,9,0,0,Math.PI*2); ctx.fill();
      // Highlight
      ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.beginPath(); ctx.ellipse(-3,-3,3,2.5,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
      // Angry brow
      ctx.strokeStyle='#1A0808'; ctx.lineWidth=3.5; ctx.lineCap='round';
      ctx.beginPath();
      if (idx===0) { ctx.moveTo(ex-18,-136); ctx.lineTo(ex+13,-140); }
      else         { ctx.moveTo(ex-13,-140); ctx.lineTo(ex+18,-136); }
      ctx.stroke();
    });
  }

  _eyesSparkle(ctx, blink) {
    const t = Date.now() * 0.0018;
    [-30, 30].forEach((ex, idx) => {
      ctx.save();
      ctx.translate(ex, -122);
      ctx.scale(1, blink);
      // Sclera
      ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.ellipse(0,0,19,21,0,0,Math.PI*2); ctx.fill();
      // Violet iris
      const ig = ctx.createRadialGradient(-3,-4,1, 0,0,13);
      ig.addColorStop(0,'#E8AAFF'); ig.addColorStop(0.4,'#A040E0'); ig.addColorStop(0.8,'#6010B0'); ig.addColorStop(1,'#400080');
      ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(0,0,13,0,Math.PI*2); ctx.fill();
      // Dark pupil
      ctx.fillStyle='#200040'; ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2); ctx.fill();
      // Star in pupil
      ctx.fillStyle='rgba(255,215,255,0.82)';
      this._miniStar(ctx, 0, 0, 4);
      // Orbiting dots
      for (let i=0;i<5;i++) {
        const a = (i/5)*Math.PI*2 + t*0.5 + idx*0.28;
        const r = 16.5 + Math.sin(t + i)*1.5;
        ctx.fillStyle='rgba(255,190,255,0.80)';
        ctx.beginPath(); ctx.arc(Math.cos(a)*r, Math.sin(a)*r, 1.8,0,Math.PI*2); ctx.fill();
      }
      // Main highlight
      ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.ellipse(-5,-7,5,4,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
      // Eyelid
      ctx.strokeStyle='#6010B0'; ctx.lineWidth=2.5; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(ex-19*1.05,-122+2);
      ctx.bezierCurveTo(ex-12,-122-26,ex+12,-122-26,ex+19*1.05,-122+2);
      ctx.stroke();
    });
  }

  // -----------------------------------------------------------
  // MOUTH
  // -----------------------------------------------------------
  _drawMouth(ctx, state, ap, ec) {
    const hs    = ec.headScale || 1;
    const happy = ap.eyeHappy || 0;

    ctx.save();
    ctx.translate(0, -118);
    ctx.scale(hs, hs);
    ctx.translate(0, 118);

    // Smile
    ctx.strokeStyle = 'rgba(110,50,35,0.72)';
    ctx.lineWidth   = 2;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    if (happy > 0.5) {
      ctx.moveTo(-16,-72); ctx.bezierCurveTo(-16,-60,16,-60,16,-72);
    } else {
      ctx.moveTo(-10,-69); ctx.bezierCurveTo(-10,-63,10,-63,10,-69);
    }
    ctx.stroke();

    // Whisker dots (subtle)
    ctx.fillStyle = 'rgba(110,50,35,0.28)';
    [-36,-30,-25, 25,30,36].forEach(wx => {
      ctx.beginPath(); ctx.arc(wx, -90, 1.6, 0, Math.PI*2); ctx.fill();
    });

    ctx.restore();
  }

  // -----------------------------------------------------------
  // ACCESSORY
  // -----------------------------------------------------------
  _drawAccessory(ctx, state, ap, ec) {
    if (!state.accessory) return;
    const hs = ec.headScale || 1;
    ctx.save();
    ctx.translate(0, -118);
    ctx.scale(hs, hs);
    ctx.translate(0, 118);
    switch (state.accessory) {
      case 'glasses': this._accGlasses(ctx); break;
      case 'crown':   this._accCrown(ctx);   break;
      case 'scarf':   this._accScarf(ctx);   break;
    }
    ctx.restore();
  }

  _accGlasses(ctx) {
    ctx.strokeStyle = '#2A1808';
    ctx.lineWidth   = 2.6;
    ctx.fillStyle   = 'rgba(100,200,255,0.18)';
    [[-30,-115],[30,-115]].forEach(([lx,ly]) => {
      ctx.beginPath(); ctx.ellipse(lx,ly,19,15,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.beginPath(); ctx.ellipse(lx-5,ly-4,5,3.5,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(100,200,255,0.18)';
    });
    ctx.beginPath(); ctx.moveTo(-11,-115); ctx.lineTo(11,-115); ctx.stroke();
    [[-49,-115],[ 49,-115]].forEach(([ax,ay]) => {
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.bezierCurveTo(ax+(ax<0?-16:16),ay,ax+(ax<0?-20:20),ay+8,ax+(ax<0?-20:20),ay+18); ctx.stroke();
    });
  }

  _accCrown(ctx) {
    const gg = ctx.createLinearGradient(-36,-200,36,-172);
    gg.addColorStop(0,'#FFE55C'); gg.addColorStop(0.3,'#D4AF37');
    gg.addColorStop(0.6,'#FFF0A0'); gg.addColorStop(1,'#B8860B');
    ctx.fillStyle = gg;
    ctx.beginPath(); ctx.rect(-36,-188,72,16); ctx.fill();
    // Points
    const px = [-33,-14,0,14,33];
    const ph = [ 32, 18,42,18, 32];
    ctx.beginPath(); ctx.moveTo(-36,-188);
    px.forEach((x, i) => {
      ctx.lineTo(x,-188-ph[i]);
      if (i<px.length-1) ctx.lineTo((x+px[i+1])/2,-188-9);
    });
    ctx.lineTo(36,-188); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#B8860B'; ctx.lineWidth=1.5; ctx.strokeRect(-36,-188,72,16);
    [[-26,-191],[0,-191],[26,-191]].forEach(([gx,gy],i) => {
      ctx.fillStyle=['#FF3030','#30FF30','#3030FF'][i];
      ctx.beginPath(); ctx.ellipse(gx,gy,5.5,7,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(gx-1.5,gy-2,2,2,0,0,Math.PI*2); ctx.fill();
    });
  }

  _accScarf(ctx) {
    const sc = '#FF3344', sw = '#FFFFFF';
    const sy = -55;
    // Main wrap
    ctx.fillStyle=sc;
    ctx.beginPath();
    ctx.moveTo(-58,sy-13); ctx.bezierCurveTo(-58,sy-22,58,sy-22,58,sy-13);
    ctx.lineTo(58,sy+9); ctx.bezierCurveTo(58,sy+18,-58,sy+18,-58,sy+9); ctx.closePath(); ctx.fill();
    // White stripe
    ctx.save(); ctx.beginPath();
    ctx.moveTo(-58,sy-13); ctx.bezierCurveTo(-58,sy-22,58,sy-22,58,sy-13);
    ctx.lineTo(58,sy+9); ctx.bezierCurveTo(58,sy+18,-58,sy+18,-58,sy+9); ctx.closePath(); ctx.clip();
    ctx.fillStyle=sw; ctx.fillRect(-65,sy-3,130,5);
    ctx.restore();
    // Hanging tail
    ctx.fillStyle=sc;
    ctx.beginPath();
    ctx.moveTo(-52,sy+9); ctx.bezierCurveTo(-58,sy+32,-62,sy+72,-52,sy+92);
    ctx.lineTo(-36,sy+92); ctx.bezierCurveTo(-30,sy+62,-28,sy+30,-32,sy+9); ctx.closePath(); ctx.fill();
    ctx.fillStyle=sw; ctx.beginPath(); ctx.rect(-60,sy+42,30,5); ctx.fill();
    ctx.strokeStyle='rgba(180,0,20,0.45)'; ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(-58,sy-13); ctx.bezierCurveTo(-58,sy-22,58,sy-22,58,sy-13);
    ctx.lineTo(58,sy+9); ctx.bezierCurveTo(58,sy+18,-58,sy+18,-58,sy+9); ctx.closePath(); ctx.stroke();
  }

  // -----------------------------------------------------------
  // EGG STAGE
  // -----------------------------------------------------------
  _drawEgg(ctx, cx, cy, ap) {
    const t      = Date.now() * 0.001;
    const wobble = Math.sin(t * 1.6) * 3.5;

    ctx.save();
    ctx.translate(cx + wobble, cy);

    // Shadow
    const sg = ctx.createRadialGradient(0,92,0, 0,92,68);
    sg.addColorStop(0,'rgba(0,0,0,0.28)'); sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sg; ctx.beginPath(); ctx.ellipse(0,92,68,18,0,0,Math.PI*2); ctx.fill();

    // Egg body
    const eg = ctx.createRadialGradient(-26,-52,10, 0,0,104);
    eg.addColorStop(0,'#FFF5E0'); eg.addColorStop(0.4,'#F5DEAD'); eg.addColorStop(0.7,'#E0B87A'); eg.addColorStop(1,'#C09050');
    ctx.fillStyle=eg;
    ctx.beginPath();
    ctx.moveTo(0,-92); ctx.bezierCurveTo(62,-92,82,-30,82,32);
    ctx.bezierCurveTo(82,88,46,98,0,98);
    ctx.bezierCurveTo(-46,98,-82,88,-82,32);
    ctx.bezierCurveTo(-82,-30,-62,-92,0,-92);
    ctx.fill();

    // Lumifox markings (species pattern — stylized 'L' marks)
    ctx.strokeStyle='rgba(180,115,55,0.48)'; ctx.lineWidth=2.2; ctx.lineCap='round';
    [[-1],[1]].forEach(([s]) => {
      ctx.save(); ctx.scale(s,1);
      ctx.beginPath(); ctx.moveTo(28,-44); ctx.bezierCurveTo(48,-12,48,20,28,42); ctx.stroke();
      ctx.restore();
    });

    // Inner glow (life inside)
    const lg = ctx.createRadialGradient(0,10,6, 0,10,72);
    lg.addColorStop(0,'rgba(255,195,90,0.42)'); lg.addColorStop(1,'rgba(255,195,90,0)');
    ctx.fillStyle=lg; ctx.beginPath(); ctx.ellipse(0,10,68,78,0,0,Math.PI*2); ctx.fill();

    // Highlight
    const hl = ctx.createRadialGradient(-26,-52,2, -22,-46,36);
    hl.addColorStop(0,'rgba(255,255,255,0.62)'); hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl; ctx.beginPath(); ctx.ellipse(-23,-48,30,23,-0.4,0,Math.PI*2); ctx.fill();

    // Crack lines
    ctx.strokeStyle='rgba(148,92,42,0.42)'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(-12,-22); ctx.lineTo(-2,-6); ctx.lineTo(12,-20); ctx.stroke();

    // Egg outline
    ctx.strokeStyle='rgba(148,92,42,0.48)'; ctx.lineWidth=2.2;
    ctx.beginPath();
    ctx.moveTo(0,-92); ctx.bezierCurveTo(62,-92,82,-30,82,32);
    ctx.bezierCurveTo(82,88,46,98,0,98); ctx.bezierCurveTo(-46,98,-82,88,-82,32);
    ctx.bezierCurveTo(-82,-30,-62,-92,0,-92); ctx.stroke();

    // Orbiting sparkles
    for (let i=0;i<6;i++) {
      const a  = (i/6)*Math.PI*2 + t*0.32;
      const r  = 98 + Math.sin(t+i)*8;
      const sz = 3.5 + Math.sin(t*2+i)*1.5;
      ctx.globalAlpha = 0.5 + Math.sin(t+i)*0.3;
      this._star(ctx, Math.cos(a)*r, Math.sin(a)*r*0.68-10, sz, '#FFD040');
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // -----------------------------------------------------------
  // LEGENDARY shimmer
  // -----------------------------------------------------------
  _drawLegendaryShimmer(ctx, cx, cy, scale, ap) {
    const t   = Date.now() * 0.0012;
    const pts = [
      [ cx+160*scale-10, cy-165*scale ],
      [ cx-60*scale,     cy-180*scale ],
      [ cx+100*scale,    cy-60*scale  ],
      [ cx-40*scale,     cy-90*scale  ]
    ];
    pts.forEach(([ sx, sy ], i) => {
      const sz = (4 + Math.sin(t*2+i)*2) * scale;
      ctx.globalAlpha = 0.55 + Math.sin(t+i)*0.25;
      this._star(ctx, sx, sy, sz, '#FFE840');
    });
    ctx.globalAlpha = 1;
  }

  // -----------------------------------------------------------
  // Utility
  // -----------------------------------------------------------
  _star(ctx, x, y, r, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i=0;i<5;i++) {
      const a  = (i*4*Math.PI/5) - Math.PI/2;
      const ia = a + Math.PI/5;
      i===0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
            : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      ctx.lineTo(Math.cos(ia)*r*0.4, Math.sin(ia)*r*0.4);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  _miniStar(ctx, x, y, r) {
    ctx.beginPath();
    for (let i=0;i<5;i++) {
      const a  = (i*4*Math.PI/5) - Math.PI/2;
      const ia = a + Math.PI/5;
      i===0 ? ctx.moveTo(x+Math.cos(a)*r, y+Math.sin(a)*r)
            : ctx.lineTo(x+Math.cos(a)*r, y+Math.sin(a)*r);
      ctx.lineTo(x+Math.cos(ia)*r*0.4, y+Math.sin(ia)*r*0.4);
    }
    ctx.closePath(); ctx.fill();
  }
}
