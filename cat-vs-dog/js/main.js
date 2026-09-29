/**
 * Cat vs Dog (Fleabag vs Mutt) Main Game Controller
 * Integrates Canvas Rendering, State Loop, Touch/Pointer Input, Debris VFX,
 * Scoreboard Tracker, and Mute Controls
 */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('battle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const audio = new GameAudio('assets/audio/');
  const sprites = new SpriteManager('assets/sprites/');
  const engine = new BattleEngine(audio, sprites);

  // Canvas Logical Dimensions (Native Flash 600x430)
  const V_WIDTH = 600;
  const V_HEIGHT = 430;

  let isPointerDown = false;
  let hoveredButton = null;
  let lastTimestamp = performance.now();

  // Power-up button hit areas on Canvas (Native Flash HUD layout)
  const hudButtons = [
    // Cat Power-ups (Left)
    { id: 'cat_x2', char: 'cat', type: 'x2', x: 74, y: 55, w: 30, h: 30 },
    { id: 'cat_bomb', char: 'cat', type: 'bomb', x: 116, y: 55, w: 30, h: 30 },
    { id: 'cat_gas', char: 'cat', type: 'gas', x: 157, y: 55, w: 30, h: 30 },
    { id: 'cat_heal', char: 'cat', type: 'heal', x: 198, y: 55, w: 30, h: 30 },

    // Dog Power-ups (Right)
    { id: 'dog_x2', char: 'dog', type: 'x2', x: 372, y: 55, w: 30, h: 30 },
    { id: 'dog_bomb', char: 'dog', type: 'bomb', x: 413, y: 55, w: 30, h: 30 },
    { id: 'dog_gas', char: 'dog', type: 'gas', x: 454, y: 55, w: 30, h: 30 },
    { id: 'dog_heal', char: 'dog', type: 'heal', x: 495, y: 55, w: 30, h: 30 }
  ];

  setupUIControls();
  updateScoreboardUI(engine.scores);

  // Preload assets and launch
  const loadingOverlay = document.getElementById('loading-overlay');
  let gameStarted = false;
  const launchGame = () => {
    if (gameStarted) return;
    gameStarted = true;
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 350);
    }
    requestAnimationFrame(renderLoop);
  };

  // Safe fallback: start within 1.5s maximum even on slow connections
  setTimeout(launchGame, 1500);
  sprites.loadAll().then(launchGame).catch(launchGame);

  function setupUIControls() {
    // Mode toggles
    const modeSelect = document.getElementById('game-mode-select');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        engine.gameMode = e.target.value;
        engine.reset();
      });
    }

    // Difficulty toggles
    const diffSelect = document.getElementById('difficulty-select');
    if (diffSelect) {
      diffSelect.addEventListener('change', (e) => {
        engine.difficulty = e.target.value;
        engine.generateWind();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        audio.play('click');
        engine.reset();
        hideGameOver();
      });
    }

    // Reset Scores button
    const resetScoreBtn = document.getElementById('btn-reset-score');
    if (resetScoreBtn) {
      resetScoreBtn.addEventListener('click', () => {
        audio.play('click');
        engine.resetScores();
        updateScoreboardUI(engine.scores);
      });
    }

    // Rematch button inside modal
    const rematchBtn = document.getElementById('btn-rematch');
    if (rematchBtn) {
      rematchBtn.addEventListener('click', () => {
        audio.play('click');
        engine.reset();
        hideGameOver();
      });
    }

    // Persistent Mute Toggle button
    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
      updateMuteButtonUI(muteBtn);
      muteBtn.addEventListener('click', () => {
        audio.toggleMute();
        updateMuteButtonUI(muteBtn);
      });
    }

    // Fullscreen Smartboard mode
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        const wrapper = document.querySelector('.game-frame');
        if (!document.fullscreenElement) {
          wrapper.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Game over hook
    engine.onGameOver = (winner, scores) => {
      showGameOver(winner);
      updateScoreboardUI(scores);
    };

    engine.onScoreUpdate = (scores) => {
      updateScoreboardUI(scores);
    };

    // Universal Pointer Event Handlers (Zero touch lag on mobile)
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
  }

  function updateMuteButtonUI(btn) {
    if (!btn) return;
    btn.textContent = audio.isMuted ? '🔇 Muted' : '🔊 Sound';
    btn.classList.toggle('active', !audio.isMuted);
  }

  function updateScoreboardUI(scores) {
    const scoreElem = document.getElementById('scoreboard-pill');
    if (scoreElem) {
      scoreElem.innerHTML = `🐱 <b>${scores.catWins}</b> &nbsp;|&nbsp; <b>${scores.dogWins}</b> 🐶`;
    }
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = V_WIDTH / rect.width;
    const scaleY = V_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function handlePointerDown(e) {
    e.preventDefault();
    audio.init();
    const pos = getCanvasCoords(e);
    isPointerDown = true;

    // Check powerup buttons
    for (const btn of hudButtons) {
      if (pos.x >= btn.x && pos.x <= btn.x + btn.w && pos.y >= btn.y && pos.y <= btn.y + btn.h) {
        engine.usePowerup(btn.char, btn.type);
        return;
      }
    }

    // Start charging if player turn (click anywhere on canvas to charge)
    if (!engine.isCpuTurn() && engine.turnState === 'IDLE') {
      engine.startCharging();
    }
  }

  function handlePointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;

    if (engine.isCharging && !engine.isCpuTurn()) {
      engine.releaseCharge();
    }
  }

  function handlePointerMove(e) {
    e.preventDefault();
    const pos = getCanvasCoords(e);
    hoveredButton = null;

    for (const btn of hudButtons) {
      if (pos.x >= btn.x && pos.x <= btn.x + btn.w && pos.y >= btn.y && pos.y <= btn.y + btn.h) {
        hoveredButton = btn.id;
        break;
      }
    }
    canvas.style.cursor = hoveredButton ? 'pointer' : 'default';
  }

  function showGameOver(winner) {
    const modal = document.getElementById('game-over-modal');
    const title = document.getElementById('game-over-title');
    const desc = document.getElementById('game-over-desc');
    const winnerBadge = document.getElementById('winner-avatar');

    if (!modal) return;
    const isCat = winner === 'cat';
    title.textContent = isCat ? '🐱 Fleabag Wins The Round!' : '🐶 Mutt Wins The Round!';
    title.style.color = isCat ? '#38bdf8' : '#f59e0b';
    desc.textContent = isCat 
      ? 'Fleabag celebrated with an alley cat smirk!' 
      : 'Mutt danced around the backyard triumphantly!';

    if (winnerBadge) {
      winnerBadge.textContent = isCat ? '🐱' : '🐶';
    }

    modal.style.display = 'flex';
  }

  function hideGameOver() {
    const modal = document.getElementById('game-over-modal');
    if (modal) modal.style.display = 'none';
  }

  function renderLoop(currentTimestamp) {
    const deltaMs = Math.min(50, currentTimestamp - lastTimestamp);
    lastTimestamp = currentTimestamp;

    // Physics step
    engine.update(deltaMs);

    // Clear canvas
    ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

    // Apply Screen Shake
    const isShaking = engine.screenShakeFrames > 0;
    if (isShaking) {
      ctx.save();
      const intensity = engine.screenShakeIntensity;
      const sx = (Math.random() - 0.5) * intensity * 2;
      const sy = (Math.random() - 0.5) * intensity * 2;
      ctx.translate(sx, sy);
    }

    // 1. Authentic Background
    sprites.drawBackground(ctx, V_WIDTH, V_HEIGHT);

    // 2. HUD Elements (Health Bars & Wind Indicator)
    drawHUD();

    // 3. Characters
    drawCharacters();

    // 4. Projectiles & Debris VFX
    drawProjectilesAndEffects();

    // 5. Power-Up Buttons
    drawHUDButtons();

    // 6. Charging Power Meter
    drawPowerMeter();

    // 7. Floating Comic Damage Text
    drawDamagePopups();

    // 8. Victory Confetti
    drawConfetti();

    if (isShaking) {
      ctx.restore();
    }

    // 9. Turn Banner Overlay
    drawTurnIndicator();

    requestAnimationFrame(renderLoop);
  }

  function drawHUD() {
    // Cat Health Bar
    const catBarIndex = Math.floor((1 - engine.cat.hp / 100) * 30);
    sprites.drawFrame(ctx, 'cat_bar', catBarIndex, 148, 44, { anchorX: 0.5, anchorY: 0.5 });

    // Dog Health Bar
    const dogBarIndex = Math.floor((1 - engine.dog.hp / 100) * 28);
    sprites.drawFrame(ctx, 'dog_bar', dogBarIndex, 451, 44, { anchorX: 0.5, anchorY: 0.5 });

    // Wind Indicator
    sprites.drawFrame(ctx, 'wind', engine.windFrame - 1, 300, 48, { anchorX: 0.5, anchorY: 0.5 });

    // Wind speed label
    ctx.save();
    ctx.font = '900 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    const windText = engine.wind === 0 ? 'CALM' : (engine.wind > 0 ? `+${engine.wind} ➔` : `⬅ ${Math.abs(engine.wind)}`);
    ctx.fillText(windText, 300, 30);
    ctx.restore();

    // HP Numerals overlay
    ctx.save();
    ctx.font = '800 12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(engine.cat.hp)} HP`, 148, 22);
    ctx.fillText(`${Math.round(engine.dog.hp)} HP`, 451, 22);
    ctx.restore();
  }

  function drawCharacters() {
    // Cat
    const catAnim = `cat_${engine.cat.state}`;
    sprites.drawFrame(ctx, catAnim, engine.cat.frame, engine.cat.x, engine.cat.y, {
      anchorX: 0.5,
      anchorY: 1.0,
      scale: 1.0
    });

    // Dog
    const dogAnim = `dog_${engine.dog.state}`;
    sprites.drawFrame(ctx, dogAnim, engine.dog.frame, engine.dog.x, engine.dog.y, {
      anchorX: 0.5,
      anchorY: 1.0,
      scale: 1.0
    });
  }

  function drawProjectilesAndEffects() {
    // Projectiles
    for (const p of engine.projectiles) {
      const animKey = p.type === 'bomb' ? 'proj_bomb' : (p.type === 'can' ? 'proj_can' : 'proj_bone');
      sprites.drawFrame(ctx, animKey, p.frame, p.x, p.y, {
        anchorX: 0.5,
        anchorY: 0.5,
        rotation: p.rotation,
        scale: p.type === 'bomb' ? 1.35 : 1.0
      });
    }

    // Particles (Sparks, Wood Splinters, Dirt Puffs, Smoke Rings)
    for (const pt of engine.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.alpha);

      if (pt.type === 'splinter') {
        // Wood Splinters with rotation
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot || 0);
        ctx.fillStyle = pt.color;
        ctx.fillRect(-pt.w / 2, -pt.h / 2, pt.w, pt.h);
      } else if (pt.type === 'dirt') {
        // Dirt puffs
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, pt.radius), 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.type === 'ring') {
        // Shockwave rings
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, pt.radius), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Sparks
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size || 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Toxic Gas Clouds
    for (const cloud of engine.activeToxicClouds) {
      const shapeImg = sprites.getImage(`assets/sprites/png_shapes/40${6 + Math.floor(cloud.frame)}.png`);
      if (shapeImg) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.drawImage(shapeImg, cloud.x - 25, cloud.y - 25, 50, 50);
        ctx.restore();
      }
    }
  }

  function drawHUDButtons() {
    for (const btn of hudButtons) {
      const char = btn.char === 'cat' ? engine.cat : engine.dog;
      const isAvailable = char.powerups[btn.type];
      const isSelected = char.selectedPowerup === btn.type;
      const isHovered = hoveredButton === btn.id;

      let state = 'up';
      if (isSelected || isHovered) state = 'over';
      if (isPointerDown && isHovered) state = 'down';

      sprites.drawButton(ctx, btn.id, state, btn.x, btn.y, btn.w, btn.h, !isAvailable);

      if (isSelected) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(btn.x - 2, btn.y - 2, btn.w + 4, btn.h + 4);
        ctx.restore();
      }
    }
  }

  function drawPowerMeter() {
    if (!engine.isCharging) return;

    const char = engine.getActiveCharacter();
    const isCat = char.type === 'cat';
    const meterAnim = isCat ? 'cat_meter' : 'dog_meter';

    const meterFrame = Math.max(0, Math.min(36, Math.floor(engine.chargePower * 36)));
    const meterX = isCat ? char.x + 10 : char.x - 10;
    const meterY = char.y - 85;

    sprites.drawFrame(ctx, meterAnim, meterFrame, meterX, meterY, {
      anchorX: 0.5,
      anchorY: 1.0,
      scale: 1.0
    });

    ctx.save();
    ctx.font = '900 12px system-ui, sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(engine.chargePower * 100)}%`, meterX, meterY - 50);
    ctx.restore();
  }

  function drawDamagePopups() {
    for (const dp of engine.damagePopups) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, dp.alpha);
      ctx.font = '900 23px "Plus Jakarta Sans", Impact, sans-serif';
      ctx.textAlign = 'center';

      // Thick comic black outline
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(dp.text, dp.x, dp.y);

      // Vivid fill
      ctx.fillStyle = dp.color;
      ctx.fillText(dp.text, dp.x, dp.y);
      ctx.restore();
    }
  }

  function drawConfetti() {
    for (const c of engine.confetti) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, c.alpha);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }
  }

  function drawTurnIndicator() {
    if (engine.turnState === 'GAME_OVER') return;

    ctx.save();
    ctx.font = '800 12px system-ui, sans-serif';
    ctx.textAlign = 'center';

    const isCat = engine.currentTurn === 'cat';
    const charName = isCat ? "Fleabag's Turn (Cat)" : "Mutt's Turn (Dog)";
    const color = isCat ? '#38bdf8' : '#f59e0b';

    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect ? ctx.roundRect(V_WIDTH / 2 - 90, 85, 180, 24, 6) : ctx.rect(V_WIDTH / 2 - 90, 85, 180, 24);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.fillText(charName, V_WIDTH / 2, 101);
    ctx.restore();
  }
});
