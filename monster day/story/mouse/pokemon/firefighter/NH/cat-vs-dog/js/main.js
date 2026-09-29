/**
 * Cat vs Dog (Fleabag vs Mutt) Main Game Controller
 * Integrates Canvas Rendering, State Loop, Touch/Mouse Input, and HUD
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

  // Preload assets and start render loop
  const loadingOverlay = document.getElementById('loading-overlay');
  sprites.loadAll().then(() => {
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 350);
    }
    requestAnimationFrame(renderLoop);
  });

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

    // Rematch button inside modal
    const rematchBtn = document.getElementById('btn-rematch');
    if (rematchBtn) {
      rematchBtn.addEventListener('click', () => {
        audio.play('click');
        engine.reset();
        hideGameOver();
      });
    }

    // Sound FX & Music toggle buttons
    const sfxBtn = document.getElementById('btn-toggle-sfx');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        const enabled = audio.toggleSfx();
        sfxBtn.textContent = enabled ? '🔊 SFX' : '🔇 SFX';
        sfxBtn.classList.toggle('active', enabled);
      });
    }

    const musicBtn = document.getElementById('btn-toggle-music');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        const enabled = audio.toggleMusic();
        musicBtn.textContent = enabled ? '🎵 Music' : '🚫 Music';
        musicBtn.classList.toggle('active', enabled);
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
    engine.onGameOver = (winner) => {
      showGameOver(winner);
    };

    // Canvas Input Handlers (Mouse & Touch)
    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mousemove', handlePointerMove);

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerDown(touch);
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      handlePointerUp(e);
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch);
    }, { passive: false });
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

    // Start charging if human turn
    if (!engine.isCpuTurn() && engine.turnState === 'IDLE') {
      const isCatTurn = engine.currentTurn === 'cat';
      const playerZone = isCatTurn ? pos.x < 300 : pos.x > 300;
      if (playerZone) {
        engine.startCharging();
      }
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
    title.textContent = isCat ? '🐱 Fleabag the Cat Wins!' : '🐶 Mutt the Dog Wins!';
    title.style.color = isCat ? '#38bdf8' : '#f59e0b';
    desc.textContent = isCat 
      ? 'Fleabag ruled the backyard with surgical can tosses!' 
      : 'Mutt defended the doghouse with supreme bone trajectory!';

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

    // Update state and physics
    engine.update(deltaMs);

    // Clear canvas
    ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

    // Apply Screen Shake if active
    const hasShake = engine.screenShake > 0;
    if (hasShake) {
      ctx.save();
      const sx = (Math.random() - 0.5) * engine.screenShake * 2;
      const sy = (Math.random() - 0.5) * engine.screenShake * 2;
      ctx.translate(sx, sy);
    }

    // 1. Authentic Background
    sprites.drawBackground(ctx, V_WIDTH, V_HEIGHT);

    // 2. HUD Elements (Health Bars & Wind Indicator)
    drawHUD();

    // 3. Characters
    drawCharacters();

    // 4. Projectiles & Effects
    drawProjectilesAndEffects();

    // 5. Power-Up Buttons
    drawHUDButtons();

    // 6. Charging Power Meter
    drawPowerMeter();

    // 7. Floating Comic Damage Numbers
    drawDamagePopups();

    if (hasShake) {
      ctx.restore();
    }

    // 8. Turn Banner Overlay
    drawTurnIndicator();

    requestAnimationFrame(renderLoop);
  }

  function drawHUD() {
    // Cat Health Bar (Left, top ~30px)
    const catBarIndex = Math.floor((1 - engine.cat.hp / 100) * 30);
    sprites.drawFrame(ctx, 'cat_bar', catBarIndex, 148, 44, { anchorX: 0.5, anchorY: 0.5 });

    // Dog Health Bar (Right, top ~30px)
    const dogBarIndex = Math.floor((1 - engine.dog.hp / 100) * 28);
    sprites.drawFrame(ctx, 'dog_bar', dogBarIndex, 451, 44, { anchorX: 0.5, anchorY: 0.5 });

    // Wind Indicator (Center top ~48px)
    sprites.drawFrame(ctx, 'wind', engine.windFrame - 1, 300, 48, { anchorX: 0.5, anchorY: 0.5 });

    // Wind text
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
    // Draw Cat
    const catAnim = `cat_${engine.cat.state}`;
    sprites.drawFrame(ctx, catAnim, engine.cat.frame, engine.cat.x, engine.cat.y, {
      anchorX: 0.5,
      anchorY: 1.0,
      scale: 1.0
    });

    // Draw Dog
    const dogAnim = `dog_${engine.dog.state}`;
    sprites.drawFrame(ctx, dogAnim, engine.dog.frame, engine.dog.x, engine.dog.y, {
      anchorX: 0.5,
      anchorY: 1.0,
      scale: 1.0
    });
  }

  function drawProjectilesAndEffects() {
    for (const p of engine.projectiles) {
      const animKey = p.type === 'bomb' ? 'proj_bomb' : (p.type === 'can' ? 'proj_can' : 'proj_bone');
      sprites.drawFrame(ctx, animKey, p.frame, p.x, p.y, {
        anchorX: 0.5,
        anchorY: 0.5,
        rotation: p.rotation,
        scale: p.type === 'bomb' ? 1.3 : 1.0
      });
    }

    for (const pt of engine.particles) {
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

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
      ctx.globalAlpha = dp.alpha;
      ctx.font = '900 22px "Plus Jakarta Sans", Impact, sans-serif';
      ctx.textAlign = 'center';

      // Thick comic black outline
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(dp.text, dp.x, dp.y);

      // Vivid fill color
      ctx.fillStyle = dp.color;
      ctx.fillText(dp.text, dp.x, dp.y);
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
