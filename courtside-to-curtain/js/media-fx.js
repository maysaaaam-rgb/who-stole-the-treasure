/* courtside-to-curtain/js/media-fx.js
 * 1) FXCanvas: 60fps 2D Canvas overlay for fairy-tale sparkles, basketball swishes, star bursts & golden confetti
 * 2) MediaStage: Reusable storybook animated stage (renders 60fps Canvas scenes using real 3D .webp artwork
 *    for Intro, 4 Action Video Loops in Node 7, 3 Comedic Scenes in Node 10, Zone 3 Train Cutscene & Grand Finale!)
 *    Zero broken video links, zero 404 console errors, zero hand-drawn SVG character blobs.
 */
(function (root) {
  'use strict';

  var IMG_CACHE = {};
  function getImg(src) {
    if (!src) return null;
    if (IMG_CACHE[src]) return IMG_CACHE[src];
    var im = new Image();
    im.src = src;
    IMG_CACHE[src] = im;
    return im;
  }

  /* ==================== 1. FXCanvas (60fps Particle Overlay) ==================== */
  var fxCanvas = null;
  var fxCtx = null;
  var particles = [];
  var fxRaf = null;
  var TEAM_COLS = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a', '#ffc93c', '#9b7bff'];

  function initFX(canvasEl) {
    fxCanvas = canvasEl;
    if (!fxCanvas) return;
    fxCtx = fxCanvas.getContext('2d');
    function resize() {
      fxCanvas.width = root.innerWidth;
      fxCanvas.height = root.innerHeight;
    }
    resize();
    root.addEventListener('resize', resize);
    if (!fxRaf) loopFX();
  }

  function burst(x, y, kind, count) {
    if (!fxCanvas) return;
    var cx = x != null ? x : fxCanvas.width * 0.5;
    var cy = y != null ? y : fxCanvas.height * 0.45;
    var n = count || (kind === 'confetti' ? 56 : 24);
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = (kind === 'confetti' ? 4 : 2.5) + Math.random() * 7;
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - (kind === 'confetti' ? 6 : 3.5),
        size: (kind === 'star' ? 9 : 7) + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.28,
        col: TEAM_COLS[i % TEAM_COLS.length],
        kind: kind || 'star',
        life: 1.0,
        decay: 0.014 + Math.random() * 0.014
      });
    }
  }

  function drawStar(c, r) {
    c.beginPath();
    for (var i = 0; i < 5; i++) {
      var a1 = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      var a2 = a1 + Math.PI / 5;
      if (i === 0) c.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
      else c.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
      c.lineTo(Math.cos(a2) * r * 0.45, Math.sin(a2) * r * 0.45);
    }
    c.closePath();
    c.fill();
  }

  function loopFX() {
    fxRaf = requestAnimationFrame(loopFX);
    if (!fxCtx || !fxCanvas) return;
    if (!particles.length) return;
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.rot += p.vrot;
      p.life -= p.decay;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      fxCtx.save();
      fxCtx.globalAlpha = Math.max(0, p.life);
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      fxCtx.fillStyle = p.col;
      if (p.kind === 'star') drawStar(fxCtx, p.size);
      else fxCtx.fillRect(-p.size * 0.6, -p.size * 0.35, p.size * 1.2, p.size * 0.7);
      fxCtx.restore();
    }
  }

  /* ==================== 2. MediaStage (Animated Storybook Canvas Scenes) ==================== */
  var activeStages = [];

  function drawCover(ctx, img, w, h) {
    if (!img || !img.complete || !img.naturalWidth) return;
    var ir = img.naturalWidth / img.naturalHeight;
    var cr = w / h;
    var dw = w, dh = h, dx = 0, dy = 0;
    if (ir > cr) { dw = h * ir; dx = (w - dw) / 2; }
    else { dh = w / ir; dy = (h - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function drawSprite(ctx, img, cx, cy, size, rot, flipX) {
    if (!img || !img.complete || !img.naturalWidth) return;
    ctx.save();
    ctx.translate(cx, cy);
    if (flipX) ctx.scale(-1, 1);
    if (rot) ctx.rotate(rot);
    var ar = img.naturalWidth / img.naturalHeight;
    var w = ar >= 1 ? size : size * ar;
    var h = ar >= 1 ? size / ar : size;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  function mountStage(container, sceneKey, opts) {
    opts = opts || {};
    var D = root.CTCData;
    var canvas = document.createElement('canvas');
    canvas.width = opts.width || 720;
    canvas.height = opts.height || 405;
    canvas.className = 'ms-canvas';

    var wrap = document.createElement('div');
    wrap.className = 'ms-wrap';
    wrap.appendChild(canvas);

    var paused = false;
    var t0 = performance.now();

    if (opts.controls !== false) {
      var bar = document.createElement('div');
      bar.className = 'ms-controls';
      var bPlay = document.createElement('button');
      bPlay.type = 'button'; bPlay.className = 'ms-btn'; bPlay.textContent = '⏸ Pause';
      bPlay.onclick = function () {
        paused = !paused;
        bPlay.textContent = paused ? '▶ Play' : '⏸ Pause';
      };
      var bRep = document.createElement('button');
      bRep.type = 'button'; bRep.className = 'ms-btn'; bRep.textContent = '🔁 Replay';
      bRep.onclick = function () { t0 = performance.now(); paused = false; bPlay.textContent = '⏸ Pause'; };
      bar.appendChild(bPlay);
      bar.appendChild(bRep);
      wrap.appendChild(bar);
    }

    container.innerHTML = '';
    container.appendChild(wrap);

    var ctx = canvas.getContext('2d');
    var handle = { alive: true };
    activeStages.push(handle);

    // Preload scene sprites
    var I = D.IMG;
    var bgCourt = getImg(I.bgCourt), bgPark = getImg(I.bgPark), bgPlat = getImg(I.bgPlatform), bgStage = getImg(I.bgStage);
    var imBall = getImg(I.basketball), imBasket = getImg(I.basket), imPlayer = getImg(I.player);
    var imDancers = getImg(I.dancers), imMusic = getImg(I.music), imTeam = getImg(I.team);
    var imTrain = getImg(I.train), imMom = getImg(I.mom), imHarry = getImg(I.harryTree);
    var imCoach = getImg(I.coach), imBear = getImg(I.polarBear), imGuitar = getImg(I.guitar);
    var imTrophy = getImg(I.trophy), imDrum = getImg(I.drum);
    var imM0 = getImg(D.TEAMS[0].img), imM1 = getImg(D.TEAMS[1].img), imM2 = getImg(D.TEAMS[2].img), imM3 = getImg(D.TEAMS[3].img);

    var elapsed = 0;
    var lastTs = performance.now();

    function render(now) {
      if (!handle.alive || !canvas.isConnected) return;
      requestAnimationFrame(render);
      var dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (!paused) elapsed += dt;
      var t = elapsed;
      var w = canvas.width, h = canvas.height;

      // Base sky gradient
      var grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#78c4ff');
      grd.addColorStop(1, '#dff4ff');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      if (sceneKey === 'intro_journey') {
        drawCover(ctx, bgCourt, w, h);
        ctx.fillStyle = 'rgba(255,248,236,0.16)';
        ctx.fillRect(0, 0, w, h);
        // Parabolic basketball arc
        var u = (t * 0.55) % 1;
        drawSprite(ctx, imBasket, w * 0.80, h * 0.42, 130, 0, false);
        drawSprite(ctx, imBall, w * (0.20 + u * 0.60), h * (0.68 - Math.sin(u * Math.PI) * 0.45), 62, t * 5, false);
        drawSprite(ctx, imM0, w * 0.16, h * 0.72 + Math.sin(t * 4) * 8, 118, 0, false);
        drawSprite(ctx, imM1, w * 0.34, h * 0.76 + Math.cos(t * 4) * 7, 108, 0, false);
        drawSprite(ctx, imHarry, w * 0.60, h * 0.72 + Math.sin(t * 3.5) * 6, 128, 0, false);
        drawSprite(ctx, imM3, w * 0.84, h * 0.76 + Math.cos(t * 3.8) * 7, 108, 0, false);
      } else if (sceneKey === 'act7_basketball') {
        drawCover(ctx, bgCourt, w, h);
        drawSprite(ctx, imBasket, w * 0.82, h * 0.36, 145, 0, false);
        drawSprite(ctx, imPlayer, w * 0.28 + Math.sin(t * 2.4) * 28, h * 0.66 - Math.abs(Math.sin(t * 4.2)) * 22, 175, 0, false);
        var bu = (t * 0.7) % 1;
        drawSprite(ctx, imBall, w * (0.34 + bu * 0.48), h * (0.58 - Math.sin(bu * Math.PI) * 0.40), 58, t * 7, false);
        drawSprite(ctx, imM0, w * 0.64, h * 0.76 + Math.sin(t * 5) * 9, 98, 0, false);
      } else if (sceneKey === 'act7_dancing') {
        drawCover(ctx, bgPark, w, h);
        // Colourful floating festival ribbons
        for (var i = 0; i < 6; i++) {
          ctx.strokeStyle = TEAM_COLS[i % TEAM_COLS.length];
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(w * (0.1 + i * 0.16), 0);
          ctx.quadraticCurveTo(w * (0.14 + i * 0.16) + Math.sin(t * 3 + i) * 35, h * 0.3, w * (0.1 + i * 0.16), h * 0.55);
          ctx.stroke();
        }
        drawSprite(ctx, imDancers, w * 0.50 + Math.sin(t * 2.5) * 34, h * 0.62 - Math.abs(Math.sin(t * 5)) * 26, 230, Math.sin(t * 4) * 0.14, false);
        drawSprite(ctx, imM2, w * 0.20, h * 0.72 - Math.abs(Math.sin(t * 5.2 + 1)) * 22, 115, Math.sin(t * 5) * 0.15, false);
        drawSprite(ctx, imM3, w * 0.80, h * 0.72 - Math.abs(Math.sin(t * 5.2 + 2)) * 22, 115, -Math.sin(t * 5) * 0.15, false);
      } else if (sceneKey === 'act7_music') {
        drawCover(ctx, bgPark, w, h);
        drawSprite(ctx, imMusic, w * 0.48, h * 0.62 + Math.sin(t * 4) * 8, 240, Math.sin(t * 3) * 0.05, false);
        drawSprite(ctx, imDrum, w * 0.18, h * 0.70, 128 + Math.sin(t * 10) * 6, 0, false);
        drawSprite(ctx, imM1, w * 0.82, h * 0.72 + Math.sin(t * 6) * 10, 112, 0, false);
        // Floating musical notes
        ctx.font = 'bold 34px Nunito, sans-serif';
        ['🎵', '🎶', '🎵', '🎶'].forEach(function (sym, idx) {
          var ny = h * 0.58 - ((t * 55 + idx * 45) % 180);
          var nx = w * (0.22 + idx * 0.18) + Math.sin(t * 4 + idx) * 18;
          ctx.fillText(sym, nx, ny);
        });
      } else if (sceneKey === 'act7_running') {
        drawCover(ctx, bgPark, w, h);
        // Track lane
        ctx.fillStyle = '#f3d38a';
        ctx.fillRect(0, h * 0.64, w, h * 0.26);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.setLineDash([22, 16]);
        ctx.beginPath(); ctx.moveTo(0, h * 0.77); ctx.lineTo(w, h * 0.77); ctx.stroke();
        ctx.setLineDash([]);
        var rx = ((t * 170) % (w + 220)) - 110;
        drawSprite(ctx, imTeam, rx, h * 0.63 - Math.abs(Math.sin(t * 11)) * 18, 195, Math.sin(t * 11) * 0.07, false);
        drawSprite(ctx, imM2, ((rx - 150 + w + 220) % (w + 220)) - 110, h * 0.72 - Math.abs(Math.sin(t * 12)) * 16, 104, 0, false);
      } else if (sceneKey === 'cutscene_festival_trip') {
        // 3-beat animated story cutscene: Home -> Train Stops -> Grand Theatre!
        var cycle = t % 12;
        if (cycle < 4) {
          drawCover(ctx, bgPlat, w, h);
          var tx = w * (0.15 + (cycle / 4) * 0.55);
          drawSprite(ctx, imTrain, tx, h * 0.62, 230, 0, false);
          drawSprite(ctx, imMom, w * 0.22, h * 0.72 + Math.sin(t * 4) * 5, 130, 0, false);
          drawSprite(ctx, imHarry, w * 0.35, h * 0.74 + Math.cos(t * 4) * 5, 118, 0, false);
        } else if (cycle < 8) {
          drawCover(ctx, bgPlat, w, h);
          var shk = Math.sin(t * 36) * 5;
          drawSprite(ctx, imTrain, w * 0.52 + shk, h * 0.62, 250, Math.sin(t * 20) * 0.03, false);
          ctx.fillStyle = '#fff8ec';
          ctx.strokeStyle = '#ff5fa2'; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.roundRect(w * 0.25, h * 0.14, w * 0.50, 56, 18); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#2b1d40'; ctx.font = '900 24px Nunito, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('⚠️ OH NO! THE TRAIN STOPPED!', w * 0.50, h * 0.14 + 36);
        } else {
          drawCover(ctx, bgStage, w, h);
          drawSprite(ctx, imHarry, w * 0.50, h * 0.66 - Math.abs(Math.sin(t * 6)) * 18, 175, 0, false);
          drawSprite(ctx, imM0, w * 0.24, h * 0.74 + Math.sin(t * 5) * 10, 115, 0, false);
          drawSprite(ctx, imM3, w * 0.76, h * 0.74 + Math.cos(t * 5) * 10, 115, 0, false);
          ctx.fillStyle = '#fff8ec'; ctx.strokeStyle = '#2fc58a'; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.roundRect(w * 0.22, h * 0.12, w * 0.56, 56, 18); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#2b1d40'; ctx.font = '900 24px Nunito, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('🎭 JUST IN TIME FOR THE FESTIVAL!', w * 0.50, h * 0.12 + 36);
        }
      } else if (sceneKey === 'finale_curtain_call') {
        drawCover(ctx, bgStage, w, h);
        // Golden stage spotlights
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(255, 226, 110, 0.18)';
        ctx.beginPath(); ctx.moveTo(w * 0.2, 0); ctx.lineTo(w * 0.05, h); ctx.lineTo(w * 0.45, h); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(w * 0.8, 0); ctx.lineTo(w * 0.55, h); ctx.lineTo(w * 0.95, h); ctx.closePath(); ctx.fill();
        ctx.restore();
        drawSprite(ctx, imM0, w * 0.18, h * 0.68 - Math.abs(Math.sin(t * 6)) * 22, 125, 0, false);
        drawSprite(ctx, imM1, w * 0.36, h * 0.70 - Math.abs(Math.sin(t * 6 + 0.8)) * 22, 125, 0, false);
        drawSprite(ctx, imHarry, w * 0.50, h * 0.64 - Math.abs(Math.sin(t * 5.5)) * 18, 155, 0, false);
        drawSprite(ctx, imM2, w * 0.64, h * 0.70 - Math.abs(Math.sin(t * 6 + 1.6)) * 22, 125, 0, false);
        drawSprite(ctx, imM3, w * 0.82, h * 0.68 - Math.abs(Math.sin(t * 6 + 2.4)) * 22, 125, 0, false);
        drawSprite(ctx, imTrophy, w * 0.50, h * 0.24 + Math.sin(t * 4) * 8, 95, Math.sin(t * 3) * 0.1, false);
      } else if (sceneKey === 'strange_court') {
        drawCover(ctx, bgCourt, w, h);
        drawSprite(ctx, imBasket, w * 0.18, h * 0.36, 130, 0, false);
        drawSprite(ctx, imPlayer, w * 0.35, h * 0.68, 150, 0, false);
        // Comedic strange detail at x=64%, y=54%: musician strumming on basketball court!
        drawSprite(ctx, imGuitar, w * 0.64, h * 0.56 + Math.sin(t * 4) * 6, 175, Math.sin(t * 5) * 0.08, false);
        ctx.font = 'bold 28px Nunito, sans-serif';
        ctx.fillText('🎸🎶', w * 0.71, h * 0.38 + Math.sin(t * 5) * 6);
      } else if (sceneKey === 'strange_theatre') {
        drawCover(ctx, bgStage, w, h);
        drawSprite(ctx, imHarry, w * 0.62, h * 0.52, 135, 0, false);
        // Comedic strange detail at x=28%, y=66%: giant bear eating popcorn in front row!
        drawSprite(ctx, imBear, w * 0.28, h * 0.66 + Math.sin(t * 3.5) * 5, 175, Math.sin(t * 3) * 0.06, false);
        ctx.font = 'bold 34px Nunito, sans-serif';
        ctx.fillText('🍿', w * 0.34, h * 0.62 + Math.sin(t * 6) * 5);
      } else if (sceneKey === 'strange_bench') {
        drawCover(ctx, bgCourt, w, h);
        drawSprite(ctx, imTeam, w * 0.24, h * 0.66, 155, 0, false);
        // Comedic strange detail at x=52%, y=74%: coach wearing bright scuba flippers!
        drawSprite(ctx, imCoach, w * 0.52, h * 0.56, 170, 0, false);
        // Chunky bright cartoon flippers at coach's feet
        ctx.fillStyle = '#26c6da'; ctx.strokeStyle = '#0d5ea6'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(w * 0.47, h * 0.80, 46, 16, -0.18 + Math.sin(t * 5) * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(w * 0.58, h * 0.80, 46, 16,  0.18 - Math.sin(t * 5) * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }

    requestAnimationFrame(render);
    return handle;
  }

  function destroyStages() {
    activeStages.forEach(function (h) { h.alive = false; });
    activeStages = [];
  }

  root.CTCMediaFX = {
    initFX: initFX,
    burst: burst,
    mountStage: mountStage,
    destroyStages: destroyStages
  };
})(window);
