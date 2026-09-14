/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — ART ASSET SYSTEM (v2.5)
 * 
 * High-Fidelity 2D / 2.5D Storybook Adventure Art System:
 * - CharacterRenderer: Explorer Hero & Forest Ranger NPC (4-direction, expressive poses, animations)
 * - EnvironmentRenderer: Multi-tiered Oaks, Birches, Faceted Rocks, Flora, Organic Paths & Water
 * - ObjectRenderer: Ornate 2.5D Golden Relic Key & Ancient Stone Gate with Opening Animation
 * - AtmosphereRenderer: Parallax Mountain Backdrop, Sunlight God Rays & Canopy Framing
 * Completely decoupled from gameplay and narrative logic.
 * ============================================================================
 */

(function(root) {
  'use strict';

  // =========================================================================
  // UTILITY DRAWING HELPERS
  // =========================================================================
  const DrawUtils = {
    drawDropShadow(ctx, x, y, rx, ry, alpha = 0.3) {
      ctx.save();
      ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fillStyle) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.restore();
    }
  };

  // =========================================================================
  // 1. CHARACTER RENDERER (Player Explorer & Forest Ranger NPC)
  // =========================================================================
  const CharacterRenderer = {
    /**
     * Renders the Player Explorer Hero with expressive face, clothing, and 4-dir walk cycles.
     */
    renderPlayer(ctx, player) {
      if (player.skin === 'alice' || player.characterName === 'Alice') {
        this.renderAlice(ctx, player);
        return;
      }
      const { x, y, width, height, facing, isMoving, walkTimer = 0, animTime = 0, isCelebrating = false } = player;
      const centerX = x + width / 2;
      const footY = y + height;

      // 1. Soft Ambient Ground Shadow
      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 16, 7, 0.35);

      // Animation calculations
      const bob = isMoving ? Math.sin(walkTimer) * 3 : Math.sin(animTime * 2.2) * 1;
      const legCycle = isMoving ? Math.sin(walkTimer) * 7 : 0;
      const armCycle = isMoving ? Math.cos(walkTimer) * 6 : 0;
      const hatFlutter = isMoving ? Math.sin(walkTimer * 2) * 1.5 : 0;
      const celebrateJump = isCelebrating ? Math.abs(Math.sin(animTime * 8)) * 14 : 0;

      ctx.save();
      ctx.translate(x, y + bob - celebrateJump);

      // --- CELEBRATION SPARKLES ---
      if (isCelebrating) {
        DrawUtils.drawStar(ctx, 22, -12, 4, 8, 3, '#fef08a');
        DrawUtils.drawStar(ctx, 6, -6, 4, 5, 2, '#38bdf8');
        DrawUtils.drawStar(ctx, 38, -8, 4, 6, 2.5, '#f472b6');
      }

      // --- BACKPACK (When facing Up, Left, Right) ---
      if (facing === 'up') {
        // Full leather backpack with bedroll
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.roundRect(11, 16, 22, 20, 4);
        ctx.fill();
        // Bedroll on top
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.roundRect(8, 12, 28, 7, 3);
        ctx.fill();
        // Straps
        ctx.fillStyle = '#38220f';
        ctx.fillRect(15, 16, 3, 20);
        ctx.fillRect(26, 16, 3, 20);
      } else if (facing === 'left') {
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.roundRect(26, 18, 11, 18, 3);
        ctx.fill();
      } else if (facing === 'right') {
        ctx.fillStyle = '#5c3a21';
        ctx.beginPath();
        ctx.roundRect(7, 18, 11, 18, 3);
        ctx.fill();
      }

      // --- LEGS & BOOTS ---
      const bootColor = '#292524';
      const bootSole = '#78350f';
      const pantColor = '#a16207'; // Explorer Khaki Cargo Pants

      if (facing === 'down' || facing === 'up') {
        // Left Leg
        ctx.fillStyle = pantColor;
        ctx.fillRect(11, 35 - (legCycle > 0 ? legCycle * 0.4 : 0), 9, 12);
        ctx.fillStyle = bootColor;
        ctx.fillRect(10, 45 - (legCycle > 0 ? legCycle * 0.6 : 0), 10, 9);
        ctx.fillStyle = bootSole;
        ctx.fillRect(9, 52 - (legCycle > 0 ? legCycle * 0.6 : 0), 12, 3);

        // Right Leg
        ctx.fillStyle = pantColor;
        ctx.fillRect(24, 35 + (legCycle < 0 ? legCycle * 0.4 : 0), 9, 12);
        ctx.fillStyle = bootColor;
        ctx.fillRect(24, 45 + (legCycle < 0 ? legCycle * 0.6 : 0), 10, 9);
        ctx.fillStyle = bootSole;
        ctx.fillRect(23, 52 + (legCycle < 0 ? legCycle * 0.6 : 0), 12, 3);
      } else {
        // Side view legs
        const isLeft = facing === 'left';
        const legFrontX = isLeft ? 14 : 20;
        const legBackX = isLeft ? 22 : 12;

        // Back leg
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(legBackX, 36 - legCycle * 0.5, 9, 11);
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(legBackX - (isLeft ? 2 : 0), 45 - legCycle * 0.7, 10, 9);
        ctx.fillStyle = bootSole;
        ctx.fillRect(legBackX - (isLeft ? 3 : 0), 52 - legCycle * 0.7, 12, 3);

        // Front leg
        ctx.fillStyle = pantColor;
        ctx.fillRect(legFrontX, 36 + legCycle * 0.5, 9, 11);
        ctx.fillStyle = bootColor;
        ctx.fillRect(legFrontX - (isLeft ? 2 : 0), 45 + legCycle * 0.7, 10, 9);
        ctx.fillStyle = bootSole;
        ctx.fillRect(legFrontX - (isLeft ? 3 : 0), 52 + legCycle * 0.7, 12, 3);
      }

      // --- TORSO & JACKET ---
      const jacketBase = '#2563eb'; // Vibrant Royal Explorer Blue
      const jacketDark = '#1d4ed8';
      const shirtCream = '#fef3c7';

      ctx.fillStyle = jacketBase;
      ctx.beginPath();
      ctx.roundRect(9, 20, 26, 18, 5);
      ctx.fill();

      // Belt with brass buckle
      ctx.fillStyle = '#38220f';
      ctx.fillRect(9, 34, 26, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(19, 33, 6, 6);
      ctx.fillStyle = '#38220f';
      ctx.fillRect(21, 35, 2, 2);

      if (facing === 'down') {
        // Shirt collar V-neck & golden zipper
        ctx.fillStyle = shirtCream;
        ctx.beginPath();
        ctx.moveTo(18, 20);
        ctx.lineTo(26, 20);
        ctx.lineTo(22, 27);
        ctx.closePath();
        ctx.fill();

        // Jacket lapels & buttons
        ctx.fillStyle = jacketDark;
        ctx.fillRect(16, 22, 2, 12);
        ctx.fillRect(26, 22, 2, 12);
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(15, 28, 1.5, 0, Math.PI * 2);
        ctx.arc(29, 28, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Cross-body satchel leather strap
        ctx.strokeStyle = '#5c3a21';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(11, 21);
        ctx.lineTo(31, 36);
        ctx.stroke();
      }

      // --- ARMS & HANDS ---
      const skinTone = '#fcd34d';
      if (facing === 'down') {
        // Left arm
        ctx.fillStyle = jacketBase;
        ctx.fillRect(5, 21 - armCycle * 0.5, 5, 12);
        ctx.fillStyle = skinTone;
        ctx.beginPath();
        ctx.arc(7.5, 34 - armCycle * 0.5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Right arm (celebrating if active)
        if (isCelebrating) {
          ctx.fillStyle = jacketBase;
          ctx.fillRect(34, 12, 5, 12);
          ctx.fillStyle = skinTone;
          ctx.beginPath();
          ctx.arc(36.5, 11, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = jacketBase;
          ctx.fillRect(34, 21 + armCycle * 0.5, 5, 12);
          ctx.fillStyle = skinTone;
          ctx.beginPath();
          ctx.arc(36.5, 34 + armCycle * 0.5, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (facing === 'left' || facing === 'right') {
        const isLeft = facing === 'left';
        ctx.fillStyle = jacketBase;
        ctx.fillRect(isLeft ? 12 : 27, 21 + armCycle * 0.6, 6, 12);
        ctx.fillStyle = skinTone;
        ctx.beginPath();
        ctx.arc(isLeft ? 15 : 30, 34 + armCycle * 0.6, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- HEAD & HAIR ---
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(22, 14, 9.5, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful rosy cheeks
      ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
      ctx.beginPath();
      ctx.arc(17, 16, 2.5, 0, Math.PI * 2);
      ctx.arc(27, 16, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Hair (Rich Auburn / Chestnut)
      ctx.fillStyle = '#451a03';
      if (facing === 'down') {
        // Front bangs
        ctx.beginPath();
        ctx.arc(22, 11, 9.5, Math.PI, Math.PI * 2);
        ctx.lineTo(31, 14);
        ctx.lineTo(28, 12);
        ctx.lineTo(22, 15);
        ctx.lineTo(16, 12);
        ctx.lineTo(13, 14);
        ctx.closePath();
        ctx.fill();
      } else if (facing === 'up') {
        // Back of head full hair
        ctx.beginPath();
        ctx.arc(22, 13, 10, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Side profile hair
        const isLeft = facing === 'left';
        ctx.beginPath();
        ctx.arc(22, 11, 9.5, Math.PI, Math.PI * 2);
        ctx.lineTo(isLeft ? 31 : 13, 17);
        ctx.fill();
      }

      // --- EYES & EXPRESSION ---
      if (facing === 'down') {
        // Big expressive anime/storybook eyes with highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(16, 12, 4.5, 5.5, 2);
        ctx.roundRect(23.5, 12, 4.5, 5.5, 2);
        ctx.fill();

        // Dark iris
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(17, 13, 3, 4);
        ctx.fillRect(24.5, 13, 3, 4);

        // Catchlight sparkles
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(17.8, 13.8, 1, 0, Math.PI * 2);
        ctx.arc(25.3, 13.8, 1, 0, Math.PI * 2);
        ctx.fill();

        // Friendly smile
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(22, 17, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else if (facing === 'left' || facing === 'right') {
        const isLeft = facing === 'left';
        const eyeX = isLeft ? 15 : 26;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(eyeX, 12, 4, 5, 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(isLeft ? eyeX : eyeX + 1, 13, 2.5, 3.5);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(isLeft ? eyeX + 0.8 : eyeX + 1.8, 13.8, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- SAFARI EXPLORER HAT ---
      const hatBase = '#d97706';
      const hatCrown = '#b45309';
      const hatBand = '#1e3a8a';

      // Hat Brim (Elliptical curved 3D brim)
      ctx.save();
      ctx.translate(0, hatFlutter);
      ctx.fillStyle = hatBase;
      ctx.beginPath();
      ctx.ellipse(22, 8, 16, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hat Crown
      ctx.fillStyle = hatCrown;
      ctx.beginPath();
      ctx.roundRect(14, -1, 16, 9.5, [6, 6, 1, 1]);
      ctx.fill();

      // Blue hat ribbon band with brass buckle
      ctx.fillStyle = hatBand;
      ctx.fillRect(14, 5, 16, 2.5);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(20.5, 4.5, 3.5, 3.5);

      // Adventurer's red feather
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(13, 2, 2.5, 6, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    },

    /**
     * Renders the Forest Ranger NPC with distinctive ranger garb, silver beard, and wooden staff.
     */
    /**
     * Renders Alice with Victorian Cerulean Blue dress, crisp white pinafore apron,
     * golden blonde hair, iconic black ribbon headband, and 4-dir expressive animations.
     */
    renderAlice(ctx, player) {
      const { x, y, width, height, facing = 'down', isMoving, walkTimer = 0, animTime = 0, isCelebrating = false, isFalling = false, scale = 1.0 } = player;
      const centerX = x + width / 2;
      const footY = y + height;

      if (root.StoryAssetManager && root.StoryAssetManager.has('alice_sprite')) {
        ctx.save();
        if (scale !== 1.0) {
          ctx.translate(centerX, footY);
          ctx.scale(scale, scale);
          ctx.translate(-centerX, -footY);
        }
        const bob = isMoving ? Math.sin(walkTimer * 2) * 2.5 : Math.sin(animTime * 2.2) * 1;
        const celebrateJump = isCelebrating ? Math.abs(Math.sin(animTime * 8)) * 14 : 0;

        root.StoryAssetManager.drawSprite(ctx, 'alice_sprite', centerX, footY, 50, 84, {
          anchorX: 0.5,
          anchorY: 1.0,
          flipX: (facing === 'left'),
          bobY: bob - celebrateJump,
          shadow: true
        });

        if (isCelebrating) {
          DrawUtils.drawStar(ctx, centerX + 18, footY - 70, 4, 8, 3, '#fef08a');
          DrawUtils.drawStar(ctx, centerX - 18, footY - 65, 4, 6, 2, '#38bdf8');
          DrawUtils.drawStar(ctx, centerX, footY - 80, 4, 7, 2.5, '#f472b6');
        }
        ctx.restore();
        return;
      }

      ctx.save();
      if (scale !== 1.0) {
        ctx.translate(centerX, footY);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -footY);
      }

      // 1. Soft Ambient Ground Shadow
      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 16, 7, 0.35);

      // Animation dynamics
      const bob = isMoving ? Math.sin(walkTimer) * 2.8 : Math.sin(animTime * 2.2) * 1;
      const legCycle = isMoving ? Math.sin(walkTimer) * 6 : 0;
      const armCycle = isMoving ? Math.cos(walkTimer) * 5 : 0;
      const skirtSway = isMoving ? Math.sin(walkTimer * 2) * 2 : 0;
      const hairSway = isMoving ? Math.sin(walkTimer) * 2.5 : Math.sin(animTime * 1.8) * 1;
      const celebrateJump = isCelebrating ? Math.abs(Math.sin(animTime * 8)) * 14 : 0;

      ctx.save();
      ctx.translate(x, y + bob - celebrateJump);

      // Celebration Star Sparkles
      if (isCelebrating) {
        DrawUtils.drawStar(ctx, 22, -14, 4, 8, 3, '#fef08a');
        DrawUtils.drawStar(ctx, 6, -8, 4, 5, 2, '#38bdf8');
        DrawUtils.drawStar(ctx, 38, -10, 4, 6, 2.5, '#f472b6');
      }

      // --- LEGS & MARY JANE SHOES ---
      const legY = 38;
      const legW = 6;
      const legH = 14;

      if (facing === 'up' || facing === 'down') {
        // Left Leg & Shoe (White stockings)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(13, legY + (facing === 'down' ? legCycle : -legCycle), legW, legH);
        // Left Mary Jane Shoe
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(11, legY + legH - 4 + (facing === 'down' ? legCycle : -legCycle), 9, 6, [2, 2, 3, 3]);
        ctx.fill();
        // Shoe buckle strap
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(13, legY + legH - 3 + (facing === 'down' ? legCycle : -legCycle), 5, 1.5);

        // Right Leg & Shoe (White stockings)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(25, legY - (facing === 'down' ? legCycle : -legCycle), legW, legH);
        // Right Mary Jane Shoe
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(24, legY + legH - 4 - (facing === 'down' ? legCycle : -legCycle), 9, 6, [2, 2, 3, 3]);
        ctx.fill();
        // Shoe buckle strap
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(26, legY + legH - 3 - (facing === 'down' ? legCycle : -legCycle), 5, 1.5);
      } else {
        // Side profile legs
        const isLeft = facing === 'left';
        const lx = isLeft ? 18 : 20;

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(lx + legCycle * 0.7, legY, legW, legH);
        ctx.fillRect(lx - legCycle * 0.7, legY, legW, legH);

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(lx - (isLeft ? 3 : 0) + legCycle * 0.7, legY + legH - 4, 10, 6, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(lx - (isLeft ? 3 : 0) - legCycle * 0.7, legY + legH - 4, 10, 6, 2);
        ctx.fill();
      }

      // --- BACK HAIR (Cascading behind dress when facing down or side) ---
      if (facing === 'down') {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.roundRect(10 + hairSway * 0.5, 12, 24, 26, [8, 8, 12, 12]);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.roundRect(12 + hairSway * 0.5, 14, 20, 22, [6, 6, 10, 10]);
        ctx.fill();
      } else if (facing === 'left' || facing === 'right') {
        const isLeft = facing === 'left';
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.roundRect(isLeft ? 22 : 6, 12, 16, 26, [8, 8, 10, 10]);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.roundRect(isLeft ? 21 : 7, 14, 14, 22, [6, 6, 8, 8]);
        ctx.fill();
      }

      // --- VICTORIAN CERULEAN BLUE DRESS ---
      const dressBlue = '#2563eb';
      const dressShadow = '#1d4ed8';
      const dressHighlight = '#3b82f6';

      // Flared Bell Skirt
      ctx.fillStyle = dressBlue;
      ctx.beginPath();
      if (facing === 'down' || facing === 'up') {
        ctx.moveTo(15, 26);
        ctx.lineTo(29, 26);
        ctx.lineTo(35 + skirtSway, 42);
        ctx.lineTo(9 + skirtSway, 42);
      } else {
        const isLeft = facing === 'left';
        ctx.moveTo(16, 26);
        ctx.lineTo(28, 26);
        ctx.lineTo(isLeft ? 8 : 12, 42);
        ctx.lineTo(isLeft ? 32 : 36, 42);
      }
      ctx.closePath();
      ctx.fill();

      // Skirt Folds / Shadows
      ctx.fillStyle = dressShadow;
      ctx.beginPath();
      ctx.moveTo(19, 26);
      ctx.lineTo(17 + skirtSway, 42);
      ctx.lineTo(21 + skirtSway, 42);
      ctx.lineTo(22, 26);
      ctx.fill();

      // White Petticoat Lace Trim (Peeking out beneath blue skirt)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      const petticoatY = 41;
      for (let px = 9 + skirtSway; px <= 33 + skirtSway; px += 4) {
        ctx.arc(px + 2, petticoatY + 1.5, 2.2, 0, Math.PI);
      }
      ctx.fill();

      // Dress Bodice (Torso)
      ctx.fillStyle = dressBlue;
      ctx.beginPath();
      ctx.roundRect(14, 17, 16, 11, 3);
      ctx.fill();

      // --- CRISP WHITE PINAFORE APRON ---
      ctx.fillStyle = '#ffffff';

      if (facing === 'down') {
        // Front Apron Bib
        ctx.beginPath();
        ctx.roundRect(16, 18, 12, 9, 2);
        ctx.fill();

        // Apron shoulder ruffle straps
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(13, 17, 4, 10, 2);
        ctx.roundRect(27, 17, 4, 10, 2);
        ctx.fill();

        // Apron Skirt Overlay
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(16, 26);
        ctx.lineTo(28, 26);
        ctx.lineTo(31 + skirtSway * 0.7, 39);
        ctx.lineTo(13 + skirtSway * 0.7, 39);
        ctx.closePath();
        ctx.fill();

        // Apron hem lace scallops
        ctx.fillStyle = '#f8fafc';
        for (let ax = 14 + skirtSway * 0.7; ax <= 29 + skirtSway * 0.7; ax += 3.5) {
          ctx.beginPath();
          ctx.arc(ax + 1.5, 39, 1.6, 0, Math.PI);
          ctx.fill();
        }

        // Apron waist band
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(15, 25.5, 14, 2);

      } else if (facing === 'up') {
        // Back View: Big crisp white apron bow with dangling ribbon tails
        ctx.fillStyle = '#ffffff';
        // Apron straps over back
        ctx.fillRect(15, 17, 3, 10);
        ctx.fillRect(26, 17, 3, 10);

        // Waistband
        ctx.fillRect(14, 25, 16, 2.5);

        // Bow Loops
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(18, 26, 4.5, 3, -0.3, 0, Math.PI * 2);
        ctx.ellipse(26, 26, 4.5, 3, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Bow center knot
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.arc(22, 26, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Dangling ribbon tails fluttering
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(21, 27);
        ctx.lineTo(18 + skirtSway, 36);
        ctx.lineTo(21 + skirtSway, 36);
        ctx.lineTo(22, 27);
        ctx.lineTo(23, 27);
        ctx.lineTo(26 + skirtSway, 36);
        ctx.lineTo(23 + skirtSway, 36);
        ctx.closePath();
        ctx.fill();

      } else {
        // Side profile apron
        const isLeft = facing === 'left';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(isLeft ? 15 : 23, 18, 6, 9);
        // Side apron skirt
        ctx.beginPath();
        ctx.moveTo(isLeft ? 16 : 22, 26);
        ctx.lineTo(isLeft ? 22 : 28, 26);
        ctx.lineTo(isLeft ? 14 : 32, 38);
        ctx.lineTo(isLeft ? 20 : 26, 38);
        ctx.closePath();
        ctx.fill();

        // Back bow knot peeking
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(isLeft ? 27 : 17, 26, 3, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- PUFFED SLEEVES & ARMS ---
      const armY = 18;
      if (isCelebrating) {
        // Both arms raised high in triumph!
        ctx.fillStyle = dressBlue;
        ctx.beginPath();
        ctx.arc(12, armY, 4.5, 0, Math.PI * 2);
        ctx.arc(32, armY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Forearms reaching up
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(9, armY - 12, 4, 12);
        ctx.fillRect(31, armY - 12, 4, 12);
        // Hands
        ctx.beginPath();
        ctx.arc(11, armY - 13, 2.8, 0, Math.PI * 2);
        ctx.arc(33, armY - 13, 2.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (facing === 'down') {
        // Puffed shoulder sleeves
        ctx.fillStyle = dressBlue;
        ctx.beginPath();
        ctx.arc(12, armY + 2, 4.5, 0, Math.PI * 2);
        ctx.arc(32, armY + 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        // White frill cuffs
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, armY + 5, 4, 2);
        ctx.fillRect(30, armY + 5, 4, 2);

        // Arms swinging gently
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(10, armY + 7 + armCycle * 0.5, 3.5, 7);
        ctx.fillRect(30, armY + 7 - armCycle * 0.5, 3.5, 7);
        // Little hands
        ctx.beginPath();
        ctx.arc(11.8, armY + 14 + armCycle * 0.5, 2.2, 0, Math.PI * 2);
        ctx.arc(31.8, armY + 14 - armCycle * 0.5, 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (facing === 'up') {
        // Back arms
        ctx.fillStyle = dressBlue;
        ctx.beginPath();
        ctx.arc(12, armY + 2, 4.5, 0, Math.PI * 2);
        ctx.arc(32, armY + 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(10, armY + 6 - armCycle * 0.5, 3.5, 7);
        ctx.fillRect(30, armY + 6 + armCycle * 0.5, 3.5, 7);
      } else {
        // Side arms
        const isLeft = facing === 'left';
        ctx.fillStyle = dressBlue;
        ctx.beginPath();
        ctx.arc(isLeft ? 16 : 28, armY + 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(isLeft ? 14 : 26, armY + 5, 4, 2);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(isLeft ? 14 + armCycle * 0.6 : 26 - armCycle * 0.6, armY + 7, 3.5, 7);
      }

      // --- HEAD & FACE ---
      const headX = 22;
      const headY = 12;

      // Soft Warm Peach Complexion
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(headX, headY, 9.5, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful Rosy Cheeks
      ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
      ctx.beginPath();
      ctx.arc(headX - 5.5, headY + 2.5, 2.2, 0, Math.PI * 2);
      ctx.arc(headX + 5.5, headY + 2.5, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // --- GOLDEN BLONDE HAIR (Front styling & bangs) ---
      ctx.fillStyle = '#facc15';

      if (facing === 'down') {
        // Center-parted soft fringe / bangs
        ctx.beginPath();
        ctx.arc(headX, headY - 1, 9.5, Math.PI, Math.PI * 2);
        ctx.lineTo(headX + 9.5, headY + 3);
        ctx.lineTo(headX + 5, headY - 1);
        ctx.lineTo(headX, headY + 2);
        ctx.lineTo(headX - 5, headY - 1);
        ctx.lineTo(headX - 9.5, headY + 3);
        ctx.closePath();
        ctx.fill();

        // Side locks framing face
        ctx.beginPath();
        ctx.roundRect(headX - 10, headY, 3.5, 12, 2);
        ctx.roundRect(headX + 6.5, headY, 3.5, 12, 2);
        ctx.fill();

        // Sunlight highlights
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(headX - 6, headY - 8, 12, 2.5);

        // --- STORYBOOK BLUE EYES ---
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(headX - 6.5, headY - 1.5, 4.5, 5.5, 2);
        ctx.roundRect(headX + 2, headY - 1.5, 4.5, 5.5, 2);
        ctx.fill();

        // Cerulean iris
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(headX - 5.5, headY - 0.5, 3, 4);
        ctx.fillRect(headX + 3, headY - 0.5, 3, 4);

        // Dark pupil
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(headX - 5, headY + 0.5, 2, 2.5);
        ctx.fillRect(headX + 3.5, headY + 0.5, 2, 2.5);

        // Catchlight sparkle dots
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(headX - 4.8, headY + 0.2, 1, 0, Math.PI * 2);
        ctx.arc(headX + 3.7, headY + 0.2, 1, 0, Math.PI * 2);
        ctx.fill();

        // Sweet gentle smile
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(headX, headY + 4, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();

      } else if (facing === 'up') {
        // Back of head full golden hair
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(headX, headY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d97706'; // Hair shading
        ctx.beginPath();
        ctx.roundRect(headX - 9, headY, 18, 16, [0, 0, 8, 8]);
        ctx.fill();

      } else {
        // Side profile face
        const isLeft = facing === 'left';
        const eyeX = isLeft ? headX - 6 : headX + 2.5;

        // Side bangs
        ctx.beginPath();
        ctx.arc(headX, headY - 1, 9.5, Math.PI, Math.PI * 2);
        ctx.lineTo(isLeft ? headX + 9 : headX - 9, headY + 4);
        ctx.fill();

        // Side eye
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(eyeX, headY - 1.5, 4, 5, 2);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(isLeft ? eyeX : eyeX + 1, headY - 0.5, 2.8, 3.5);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(isLeft ? eyeX + 0.8 : eyeX + 1.8, headY + 0.2, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Little smile
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(isLeft ? headX - 3 : headX + 3, headY + 4, 2, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }

      // --- ICONIC BLACK RIBBON HEADBAND & BOW ---
      ctx.fillStyle = '#0f172a';
      // Headband arc
      ctx.beginPath();
      ctx.arc(headX, headY - 2, 10, Math.PI * 1.1, Math.PI * 1.9);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Top Ribbon Bow perched at crown
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(headX - 3.5, headY - 11, 3.8, 2.2, -0.3, 0, Math.PI * 2);
      ctx.ellipse(headX + 3.5, headY - 11, 3.8, 2.2, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Bow knot
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(headX, headY - 11, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      if (scale !== 1.0) {
        ctx.restore();
      }
    },

    /**
     * Renders the White Rabbit NPC with fluffy white coat, pink perky twitching ears,
     * ruby red velvet waistcoat, bright yellow bowtie, gold pocket-watch chain,
     * frantic watch-checking gesture, and fast hopping run cycle.
     */
    /**
     * Renders the Blue Hookah Caterpillar resting on mushroom cap with puffing alphabet smoke rings.
     */
    renderCaterpillar(ctx, npc) {
      const { x, y, width = 60, height = 65, animTime = 0 } = npc;
      const centerX = x + width / 2;
      const footY = y + height;
      const breath = Math.sin(animTime * 2.0) * 1.5;

      DrawUtils.drawDropShadow(ctx, centerX, footY - 2, 22, 7, 0.35);

      ctx.save();
      ctx.translate(x, y + breath);

      // Blue Segmented Caterpillar Body
      const segments = [
        { cx: 20, cy: 46, r: 10, c: '#0284c7' },
        { cx: 26, cy: 38, r: 9.5, c: '#0369a1' },
        { cx: 32, cy: 30, r: 9, c: '#0284c7' },
        { cx: 36, cy: 21, r: 8.5, c: '#38bdf8' },
        { cx: 38, cy: 12, r: 8, c: '#7dd3fc' }
      ];

      for (const seg of segments) {
        ctx.fillStyle = seg.c;
        ctx.beginPath();
        ctx.arc(seg.cx, seg.cy, seg.r, 0, Math.PI * 2);
        ctx.fill();
        // Segment ring highlight
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Yellow spots down caterpillar back
      ctx.fillStyle = '#fde047';
      for (const seg of segments) {
        ctx.beginPath();
        ctx.arc(seg.cx - 3, seg.cy - 1, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tiny white waistcoat and folded arms
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(30, 18, 12, 10, 3);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Caterpillar Head & Expression
      const headX = 38;
      const headY = 11;
      // Sleepy half-closed eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(headX + 1, headY - 2, 4, 1.8);
      // Puffed cheeks
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(headX + 5, headY + 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Antennae
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(headX, headY - 7);
      ctx.quadraticCurveTo(headX - 4, headY - 15, headX - 8, headY - 14);
      ctx.moveTo(headX + 2, headY - 7);
      ctx.quadraticCurveTo(headX + 6, headY - 15, headX + 10, headY - 14);
      ctx.stroke();

      // Turkish Hookah (Water pipe) standing beside him
      ctx.fillStyle = '#d97706'; // Brass/copper base
      ctx.beginPath();
      ctx.roundRect(8, 38, 12, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.fillRect(12, 28, 4, 10);
      // Hookah coal bowl
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(14, 26, 4, 0, Math.PI * 2);
      ctx.fill();

      // Flexible Hookah Hose curling to mouth
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(14, 34);
      ctx.quadraticCurveTo(24, 42, 34, 26);
      ctx.lineTo(headX + 3, headY + 2);
      ctx.stroke();

      // Puffing Alphabet Smoke Rings (W, H, O) rising into the air
      const smokeTime = animTime * 1.5;
      for (let i = 0; i < 3; i++) {
        const pPhase = (smokeTime + i * 1.8) % 4.0;
        const pScale = 0.5 + pPhase * 0.4;
        const pAlpha = Math.max(0, 1.0 - (pPhase / 3.8)) * 0.7;
        const px = headX + 10 + pPhase * 10;
        const py = headY - 4 - pPhase * 16;
        const letters = ['O', 'H', 'W'];

        ctx.save();
        ctx.globalAlpha = pAlpha;
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(px, py, 6 * pScale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letters[i % letters.length], px, py);
        ctx.restore();
      }

      ctx.restore();
    },

    /**
     * Renders the Cheshire Cat perched in trees with vanishing effect and glowing crescent smile.
     */
    renderCheshireCat(ctx, npc) {
      const { x, y, width = 56, height = 48, animTime = 0, fadeAlpha = 1.0 } = npc;
      const centerX = x + width / 2;
      const tailWag = Math.sin(animTime * 3.0) * 8;

      ctx.save();
      ctx.translate(x, y);

      // Body and Fur (Opacity based on fadeAlpha)
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, fadeAlpha));

      // Striped Plum / Magenta Body
      ctx.fillStyle = '#a21caf';
      ctx.beginPath();
      ctx.ellipse(28, 28, 20, 14, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Pink Fur Stripes
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, 16); ctx.lineTo(22, 38);
      ctx.moveTo(28, 14); ctx.lineTo(30, 40);
      ctx.moveTo(36, 16); ctx.lineTo(38, 38);
      ctx.stroke();

      // Long curled striped tail with animated wag
      ctx.strokeStyle = '#a21caf';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(46, 28);
      ctx.quadraticCurveTo(56 + tailWag, 20, 52 + tailWag, 8);
      ctx.stroke();
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cat Paws resting on branch
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(16, 36, 4, 0, Math.PI * 2);
      ctx.arc(26, 36, 4, 0, Math.PI * 2);
      ctx.fill();

      // Cat Head
      ctx.fillStyle = '#a21caf';
      ctx.beginPath();
      ctx.arc(18, 18, 12, 0, Math.PI * 2);
      ctx.fill();

      // Pointed Cat Ears
      ctx.fillStyle = '#86198f';
      ctx.beginPath();
      ctx.moveTo(10, 12); ctx.lineTo(6, 2); ctx.lineTo(16, 8); ctx.closePath();
      ctx.moveTo(22, 8); ctx.lineTo(28, 2); ctx.lineTo(28, 12); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.moveTo(10, 10); ctx.lineTo(8, 4); ctx.lineTo(14, 8); ctx.closePath();
      ctx.fill();

      // Luminous Chartreuse Cat Eyes
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(13, 15, 3.5, 4.5, -0.15, 0, Math.PI * 2);
      ctx.ellipse(22, 15, 3.5, 4.5, 0.15, 0, Math.PI * 2);
      ctx.fill();
      // Slit pupils
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(12.5, 12, 1.4, 6);
      ctx.fillRect(21.5, 12, 1.4, 6);

      ctx.restore(); // End body alpha

      // Iconic Glowing Cheshire Cat Crescent Grin (Always bright even when body fades!)
      const smileAlpha = Math.max(fadeAlpha, 0.9);
      ctx.save();
      ctx.globalAlpha = smileAlpha;

      // Glow halo
      ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
      ctx.beginPath();
      ctx.arc(18, 22, 10, 0, Math.PI);
      ctx.fill();

      // Giant wide white toothy grin
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(18, 18, 9.5, 0.2, Math.PI - 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#581c87';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Teeth grid
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let tx = 11; tx <= 25; tx += 3) {
        ctx.moveTo(tx, 19); ctx.lineTo(tx, 25);
      }
      ctx.moveTo(9, 21); ctx.lineTo(27, 21);
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    },

    /**
     * Renders the Mad Hatter with 10/6 top hat, green frock coat, orange hair, and teacup.
     */
    renderMadHatter(ctx, npc) {
      const { x, y, width = 48, height = 60, animTime = 0 } = npc;
      const centerX = x + width / 2;
      const footY = y + height;
      const bob = Math.sin(animTime * 2.4) * 1.5;

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 16, 6, 0.35);

      ctx.save();
      ctx.translate(x, y + bob);

      // Trousers & Boots
      ctx.fillStyle = '#78350f';
      ctx.fillRect(14, 46, 7, 10);
      ctx.fillRect(27, 46, 7, 10);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(12, 53, 9, 5);
      ctx.fillRect(27, 53, 9, 5);

      // Emerald Green Frock Coat
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.roundRect(10, 24, 28, 24, 4);
      ctx.fill();

      // Yellow Waistcoat & Huge Polka-Dot Bowtie
      ctx.fillStyle = '#facc15';
      ctx.fillRect(18, 26, 12, 14);
      // Bowtie
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(17, 24, 6, 3.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(31, 24, 6, 3.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(24, 24, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Arms: Holding teacup in right hand
      ctx.fillStyle = '#059669';
      ctx.fillRect(6, 26, 6, 14);
      ctx.fillRect(36, 26, 6, 10);

      // Porcelain Teacup in Hand
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(36, 20, 9, 8, [1, 1, 4, 4]);
      ctx.fill();
      ctx.fillStyle = '#f472b6'; // Pink rose pattern on cup
      ctx.fillRect(38, 23, 5, 2);
      // Teacup handle
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(46, 24, 2.5, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Wild Untamed Orange Hair
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(14, 18, 7, 0, Math.PI * 2);
      ctx.arc(34, 18, 7, 0, Math.PI * 2);
      ctx.fill();

      // Head & Eccentric Face
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(24, 16, 9.5, 0, Math.PI * 2);
      ctx.fill();

      // Wide eccentric eyes & gap-toothed smile
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(20, 15, 3.5, 0, Math.PI * 2);
      ctx.arc(28, 15, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(20, 14, 2, 2.5);
      ctx.fillRect(28, 14, 2, 2.5);
      // Manic grin
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(24, 19, 4, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Colossal Iconic 10/6 Top Hat
      ctx.fillStyle = '#047857';
      // Wide curved brim
      ctx.beginPath();
      ctx.ellipse(24, 8, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Flared Crown
      ctx.beginPath();
      ctx.moveTo(11, 7);
      ctx.lineTo(8, -16);
      ctx.lineTo(40, -16);
      ctx.lineTo(37, 7);
      ctx.closePath();
      ctx.fill();

      // Coral hat band
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(10, 1, 28, 5);

      // Iconic 10/6 Price Tag tucked into band!
      ctx.fillStyle = '#fefce8';
      ctx.beginPath();
      ctx.moveTo(27, 2); ctx.lineTo(39, -6); ctx.lineTo(37, -14); ctx.lineTo(25, -6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('10/6', 28, -7);

      ctx.restore();
    },

    /**
     * Renders the March Hare with straw in fur and manic energetic stance.
     */
    renderMarchHare(ctx, npc) {
      const { x, y, width = 48, height = 62, animTime = 0 } = npc;
      const centerX = x + width / 2;
      const footY = y + height;
      const jitter = Math.sin(animTime * 8.0) * 1.0;

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 16, 6, 0.35);

      ctx.save();
      ctx.translate(x + jitter, y);

      // Tawny Brown Hare Body
      ctx.fillStyle = '#b45309';
      ctx.fillRect(14, 46, 7, 12);
      ctx.fillRect(27, 46, 7, 12);

      // Red Checkered Waistcoat
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(11, 24, 26, 22, 4);
      ctx.fill();

      // Yellow bowtie
      ctx.fillStyle = '#fde047';
      ctx.fillRect(20, 23, 8, 3.5);

      // Head & Whiskers
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(24, 16, 10, 0, Math.PI * 2);
      ctx.fill();

      // Wide manic pinkish eyes
      ctx.fillStyle = '#fee2e2';
      ctx.beginPath();
      ctx.arc(19, 15, 3.5, 0, Math.PI * 2);
      ctx.arc(29, 15, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(19, 14, 2, 2.5);
      ctx.fillRect(29, 14, 2, 2.5);

      // Long Ears with yellow straw bits stuck in them
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(13, -16, 6, 24, 3);
      ctx.roundRect(29, -16, 6, 24, 3);
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(14.5, -13, 3, 18);
      ctx.fillRect(30.5, -13, 3, 18);

      // Pieces of yellow straw poking out!
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(10, -5); ctx.lineTo(4, -12);
      ctx.moveTo(35, -4); ctx.lineTo(44, -10);
      ctx.moveTo(24, 6); ctx.lineTo(26, -2);
      ctx.stroke();

      ctx.restore();
    },

    /**
     * Renders the sleepy Dormouse curled up in a copper teapot with Zzz particles.
     */
    renderDormouse(ctx, npc) {
      const { x, y, width = 40, height = 40, animTime = 0 } = npc;
      ctx.save();
      ctx.translate(x, y);

      // Copper Teapot base
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(4, 16, 32, 22, 8);
      ctx.fill();
      // Teapot spout
      ctx.beginPath();
      ctx.moveTo(4, 24); ctx.lineTo(-4, 18); ctx.lineTo(-2, 14); ctx.lineTo(8, 20); ctx.closePath();
      ctx.fill();
      // Teapot handle
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(38, 26, 6, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Plump Mouse Head poking out of top
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(20, 14, 8, 0, Math.PI * 2);
      ctx.fill();
      // Round ears
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(14, 8, 4, 0, Math.PI * 2);
      ctx.arc(26, 8, 4, 0, Math.PI * 2);
      ctx.fill();

      // Closed sleepy eyes (curved arcs)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(17, 14, 2, 0.1, Math.PI - 0.1);
      ctx.arc(23, 14, 2, 0.1, Math.PI - 0.1);
      ctx.stroke();

      // Floating Zzz particles
      const zPhase = (animTime * 1.5) % 3.0;
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('z', 26 + zPhase * 3, 6 - zPhase * 6);
      ctx.fillText('Z', 30 + zPhase * 4, 0 - zPhase * 8);

      ctx.restore();
    },

    /**
     * Renders Playing Card Gardeners (Two, Five, Seven of Spades) with dripping red paintbrushes.
     */
    renderCardGardener(ctx, npc) {
      const { x, y, width = 44, height = 62, cardNumber = 2, animTime = 0 } = npc;
      const centerX = x + width / 2;
      const footY = y + height;
      const paintBob = Math.sin(animTime * 3.0) * 2;

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 15, 6, 0.35);

      ctx.save();
      ctx.translate(x, y);

      // Slender Black Legs
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(14, 46, 4, 14);
      ctx.fillRect(26, 46, 4, 14);
      // Red paint splattered shoes!
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(12, 56, 7, 4);
      ctx.fillRect(24, 56, 7, 4);

      // Playing Card Rectangular Body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(8, 12, 28, 36, 3);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Card Value & Suit (Spades ♠)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText(String(cardNumber), 11, 21);
      ctx.fillText(String(cardNumber), 29, 44);
      // Center Spade symbol
      ctx.fillText('♠', 20, 32);

      // Card Soldier Flat Pike Cap
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(16, 6, 12, 6);

      // Right Arm holding Paintbrush (Animated stroke)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(34, 20);
      ctx.lineTo(42, 28 + paintBob);
      ctx.stroke();

      // Wooden Paintbrush
      ctx.fillStyle = '#78350f';
      ctx.fillRect(41, 22 + paintBob, 3, 12);
      // Paintbrush ferrule & bristles soaked in red paint!
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(40, 33 + paintBob, 5, 6, 2);
      ctx.fill();

      // Red paint drip falling
      ctx.beginPath();
      ctx.arc(42.5, 41 + paintBob, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    /**
     * Renders the Queen of Hearts with grand crimson gown, golden heart crown, and scepter.
     */
    renderQueenOfHearts(ctx, npc) {
      const { x, y, width = 54, height = 66, animTime = 0, isAngry = false } = npc;
      const centerX = x + width / 2;
      const footY = y + height;
      const pompousBob = Math.sin(animTime * 2.0) * 1.2;

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 22, 8, 0.45);

      ctx.save();
      ctx.translate(x, y + pompousBob);

      // Grand Bell-Shaped Royal Gown (Quarters of red velvet and black silk)
      ctx.fillStyle = '#dc2626'; // Red side
      ctx.beginPath();
      ctx.moveTo(18, 22); ctx.lineTo(27, 22); ctx.lineTo(36, 56); ctx.lineTo(6, 56);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a'; // Black side
      ctx.beginPath();
      ctx.moveTo(27, 22); ctx.lineTo(36, 22); ctx.lineTo(48, 56); ctx.lineTo(27, 56);
      ctx.closePath();
      ctx.fill();

      // Gold embroidery & ermine fur trim
      ctx.fillStyle = '#facc15';
      ctx.fillRect(25.5, 22, 3, 34);
      // Gold hem
      ctx.fillRect(6, 53, 42, 3);

      // Puffed Shoulders & Sleeves
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(14, 22, 6, 0, Math.PI * 2);
      ctx.arc(40, 22, 6, 0, Math.PI * 2);
      ctx.fill();

      // Gold Heart Scepter in Right Hand
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(44, 18, 3, 26);
      // Scepter Heart Topper
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(44, 16, 3, 0, Math.PI * 2);
      ctx.arc(47, 16, 3, 0, Math.PI * 2);
      ctx.fill();

      // White Pleated Elizabethan Ruff Collar
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(27, 17, 12, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head & Stern Facial Expression
      ctx.fillStyle = '#fcd34d';
      ctx.beginPath();
      ctx.arc(27, 12, 9, 0, Math.PI * 2);
      ctx.fill();

      // Hair (Tight dark curls)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(21, 8, 4.5, 0, Math.PI * 2);
      ctx.arc(33, 8, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Haughty / Furious Expression
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(23, 10, 2, 2.5);
      ctx.fillRect(29, 10, 2, 2.5);
      // Angled eyebrows
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(21, 8); ctx.lineTo(25, 10);
      ctx.moveTo(33, 8); ctx.lineTo(29, 10);
      ctx.stroke();

      // Open shouting mouth if angry!
      if (isAngry) {
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.arc(27, 15, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(27, 15, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Golden Heart Coronet / Crown
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(19, 5); ctx.lineTo(22, -1); ctx.lineTo(25, 4);
      ctx.lineTo(27, -3); ctx.lineTo(29, 4); ctx.lineTo(32, -1); ctx.lineTo(35, 5);
      ctx.closePath();
      ctx.fill();
      // Red jewel in crown
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(27, 1, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    /**
     * Renders the King of Hearts with curled judge's powdered wig and spectacles.
     */
    renderKingOfHearts(ctx, npc) {
      const { x, y, width = 48, height = 58, animTime = 0 } = npc;
      const centerX = x + width / 2;
      const footY = y + height;

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 18, 6, 0.35);

      ctx.save();
      ctx.translate(x, y);

      // Short Round Ermine Robe
      ctx.fillStyle = '#1e3a8a'; // Royal blue
      ctx.beginPath();
      ctx.roundRect(10, 24, 28, 28, 6);
      ctx.fill();

      // Large White Powdered Judge Wig
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(14, 18, 8, 0, Math.PI * 2);
      ctx.arc(34, 18, 8, 0, Math.PI * 2);
      ctx.arc(24, 10, 11, 0, Math.PI * 2);
      ctx.fill();

      // Round Friendly Face & Spectacles
      ctx.fillStyle = '#fcd34d';
      ctx.beginPath();
      ctx.arc(24, 18, 8, 0, Math.PI * 2);
      ctx.fill();

      // Gold wire spectacles
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(21, 17, 3, 0, Math.PI * 2);
      ctx.arc(27, 17, 3, 0, Math.PI * 2);
      ctx.moveTo(24, 17); ctx.lineTo(24, 17);
      ctx.stroke();

      // Friendly mustache
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(24, 22, 5, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Small gold crown perched on top of giant wig
      ctx.fillStyle = '#facc15';
      ctx.fillRect(20, -1, 8, 4);

      ctx.restore();
    },

    renderWhiteRabbit(ctx, rabbit) {
      const { x, y, width, height, facing = 'down', isMoving, walkTimer = 0, animTime = 0, isCheckingWatch = false, isRunning = false, isQuestReady = false } = rabbit;
      const centerX = x + width / 2;
      const footY = y + height;

      // Hop Animation Physics
      const hopCycle = isMoving ? Math.abs(Math.sin(walkTimer * 2.2)) * 8 : Math.sin(animTime * 2.5) * 1.2;

      if (root.StoryAssetManager && root.StoryAssetManager.has('white_rabbit_sprite')) {
        root.StoryAssetManager.drawSprite(ctx, 'white_rabbit_sprite', centerX, footY, 52, 86, {
          anchorX: 0.5,
          anchorY: 1.0,
          flipX: (facing === 'left'),
          bobY: -hopCycle,
          shadow: true
        });
        return;
      }

      // 1. Drop Shadow
      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 15, 6, 0.35);

      const earTwitch = Math.sin(animTime * 6) * 2;
      const earFold = isRunning ? 0.38 : 0; // Sweep back ears when running!
      const watchGesture = isCheckingWatch || (animTime % 4 > 2.5 && !isMoving);

      ctx.save();
      ctx.translate(x, y - hopCycle);

      // --- COTTON TAIL (On back/side) ---
      if (facing === 'up' || facing === 'left' || facing === 'right') {
        const tx = facing === 'left' ? 32 : (facing === 'right' ? 10 : 22);
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(tx, 38, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(tx - 1, 37, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- HIND LEGS & WHITE PAWS ---
      const legOffset = isMoving ? Math.sin(walkTimer * 2.2) * 5 : 0;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      // Left foot
      ctx.roundRect(11, 40 + legOffset * 0.5, 8, 12, 4);
      // Right foot
      ctx.roundRect(25, 40 - legOffset * 0.5, 8, 12, 4);
      ctx.fill();

      // Pink paw pads
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(15, 50 + legOffset * 0.5, 2, 0, Math.PI * 2);
      ctx.arc(29, 50 - legOffset * 0.5, 2, 0, Math.PI * 2);
      ctx.fill();

      // --- FLUFFY WHITE BODY & RED WAISTCOAT ---
      // White underfur base
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(12, 20, 20, 22, 8);
      ctx.fill();

      // Red Velvet Waistcoat / Vest
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(11, 21, 22, 19, 6);
      ctx.fill();

      // Waistcoat dark shading
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(11, 36, 22, 4);

      // Waistcoat lapel opening showing white rabbit chest
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(17, 21);
      ctx.lineTo(27, 21);
      ctx.lineTo(22, 30);
      ctx.closePath();
      ctx.fill();

      // Golden Brass Buttons down vest
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(22, 28, 1.3, 0, Math.PI * 2);
      ctx.arc(22, 32, 1.3, 0, Math.PI * 2);
      ctx.arc(22, 36, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Golden Pocket Watch Chain looping from pocket
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(15, 33);
      ctx.quadraticCurveTo(18, 38, 22, 34);
      ctx.stroke();

      // --- BRIGHT YELLOW BOWTIE ---
      ctx.fillStyle = '#facc15';
      // Left bow wing
      ctx.beginPath();
      ctx.moveTo(22, 20);
      ctx.lineTo(15, 17);
      ctx.lineTo(15, 23);
      ctx.closePath();
      ctx.fill();
      // Right bow wing
      ctx.beginPath();
      ctx.moveTo(22, 20);
      ctx.lineTo(29, 17);
      ctx.lineTo(29, 23);
      ctx.closePath();
      ctx.fill();
      // Bow knot
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(22, 20, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // --- WHITE PAWS / ARMS & FRANTIC WATCH CHECK ---
      ctx.fillStyle = '#f8fafc';
      if (watchGesture) {
        // Left arm raising gold pocket watch to face!
        ctx.beginPath();
        ctx.roundRect(8, 22, 7, 10, 3);
        ctx.fill();

        // Right paw holding watch
        ctx.beginPath();
        ctx.roundRect(18, 18, 9, 6, 2);
        ctx.fill();

        // Miniature Gold Watch in paw!
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(27, 20, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Watch enamel face
        ctx.fillStyle = '#fefce8';
        ctx.beginPath();
        ctx.arc(27, 20, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Tiny watch hands pointing to late!
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(27, 20); ctx.lineTo(27, 18);
        ctx.moveTo(27, 20); ctx.lineTo(29, 20);
        ctx.stroke();

        // Anxious sweat drop
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(33, 10, 1.8, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Normal running/idle paws
        ctx.beginPath();
        ctx.roundRect(9, 24 + (isMoving ? legOffset * 0.4 : 0), 6, 9, 3);
        ctx.roundRect(29, 24 - (isMoving ? legOffset * 0.4 : 0), 6, 9, 3);
        ctx.fill();
      }

      // --- ROUND FLUFFY HEAD ---
      const headX = 22;
      const headY = 12;

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(headX, headY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy cheek tufts
      ctx.beginPath();
      ctx.moveTo(headX - 8, headY + 4);
      ctx.lineTo(headX - 13, headY + 6);
      ctx.lineTo(headX - 8, headY + 8);
      ctx.moveTo(headX + 8, headY + 4);
      ctx.lineTo(headX + 13, headY + 6);
      ctx.lineTo(headX + 8, headY + 8);
      ctx.fill();

      // Cute Pink Rabbit Nose
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(headX, headY + 3.5, 2, 0, Math.PI * 2);
      ctx.fill();

      // Whiskers
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Left whiskers
      ctx.moveTo(headX - 3, headY + 3); ctx.lineTo(headX - 14, headY + 1);
      ctx.moveTo(headX - 3, headY + 4); ctx.lineTo(headX - 13, headY + 5);
      // Right whiskers
      ctx.moveTo(headX + 3, headY + 3); ctx.lineTo(headX + 14, headY + 1);
      ctx.moveTo(headX + 3, headY + 4); ctx.lineTo(headX + 13, headY + 5);
      ctx.stroke();

      // Expressive Ruby / Dark Rabbit Eyes
      ctx.fillStyle = '#9f1239'; // Ruby red
      ctx.beginPath();
      if (watchGesture) {
        // Wide panicked circular eyes!
        ctx.arc(headX - 4.5, headY - 1, 3.2, 0, Math.PI * 2);
        ctx.arc(headX + 4.5, headY - 1, 3.2, 0, Math.PI * 2);
      } else {
        ctx.ellipse(headX - 4.5, headY - 1, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.ellipse(headX + 4.5, headY - 1, 2.5, 3.5, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // Catchlight Sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX - 3.8, headY - 2, 1.2, 0, Math.PI * 2);
      ctx.arc(headX + 5.2, headY - 2, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // --- TALL PERKY RABBIT EARS (With Twitch & Run Wind Fold) ---
      // Left Ear
      ctx.save();
      ctx.translate(headX - 4, headY - 7);
      ctx.rotate(-0.15 + (isRunning ? -earFold : 0) + earTwitch * 0.03);
      // Outer white fur
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-4, -20, 8, 22, [6, 6, 2, 2]);
      ctx.fill();
      // Inner soft pink ear
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.roundRect(-2.5, -17, 5, 17, 3);
      ctx.fill();
      ctx.restore();

      // Right Ear
      ctx.save();
      ctx.translate(headX + 4, headY - 7);
      ctx.rotate(0.15 + (isRunning ? earFold : 0) - earTwitch * 0.03);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-4, -20, 8, 22, [6, 6, 2, 2]);
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.roundRect(-2.5, -17, 5, 17, 3);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      // Floating Quest Exclamation Mark (!) if ready to interact
      if (isQuestReady) {
        const bounce = Math.sin(animTime * 4) * 4;
        const badgeY = y - 24 + bounce;

        ctx.save();
        ctx.translate(centerX, badgeY);

        const aura = 13 + Math.sin(animTime * 5) * 3;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, aura, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, 1);
        ctx.restore();
      }
    },

    renderNPC(ctx, npc) {
      if (npc.npcType === 'white_rabbit' || npc.role === 'White Rabbit' || npc.id === 'npc-white-rabbit') {
        this.renderWhiteRabbit(ctx, npc);
        return;
      }
      if (npc.npcType === 'caterpillar') {
        this.renderCaterpillar(ctx, npc);
        return;
      }
      if (npc.npcType === 'cheshire_cat') {
        this.renderCheshireCat(ctx, npc);
        return;
      }
      if (npc.npcType === 'mad_hatter') {
        this.renderMadHatter(ctx, npc);
        return;
      }
      if (npc.npcType === 'march_hare') {
        this.renderMarchHare(ctx, npc);
        return;
      }
      if (npc.npcType === 'dormouse') {
        this.renderDormouse(ctx, npc);
        return;
      }
      if (npc.npcType === 'card_gardener') {
        this.renderCardGardener(ctx, npc);
        return;
      }
      if (npc.npcType === 'queen_of_hearts') {
        this.renderQueenOfHearts(ctx, npc);
        return;
      }
      if (npc.npcType === 'king_of_hearts') {
        this.renderKingOfHearts(ctx, npc);
        return;
      }
      const { x, y, width, height, animTime = 0, isQuestReady = false } = npc;
      const centerX = x + width / 2;
      const footY = y + height;

      // Ground shadow
      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 20, 8, 0.4);

      // Gentle breathing idle & occasional staff tap
      const breath = Math.sin(animTime * 2.4) * 1.5;
      const staffTap = Math.sin(animTime * 1.2) > 0.85 ? Math.sin(animTime * 8) * 2 : 0;

      ctx.save();
      ctx.translate(x, y + breath);

      // --- CARVED WOODEN RANGER STAFF (in left hand) ---
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(6, 4 + staffTap, 4, 54 - staffTap);
      // Staff Crook & Glowing Forest Amber Gem
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(8, 4 + staffTap, 6, Math.PI, Math.PI * 2);
      ctx.lineTo(14, 7 + staffTap);
      ctx.fill();
      // Glowing Amber on staff
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(8, 2 + staffTap, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Amber glow halo
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.beginPath();
      ctx.arc(8, 2 + staffTap, 7, 0, Math.PI * 2);
      ctx.fill();

      // --- BOOTS & TROUSERS ---
      ctx.fillStyle = '#292524'; // Boots
      ctx.fillRect(14, 50, 10, 9);
      ctx.fillRect(26, 50, 10, 9);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(13, 56, 12, 3);
      ctx.fillRect(25, 56, 12, 3);

      ctx.fillStyle = '#365314'; // Forest Olive Trousers
      ctx.fillRect(14, 40, 22, 12);

      // --- RANGER TUNIC (Deep Moss Green with Leaf Trimming) ---
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.roundRect(11, 20, 28, 22, 5);
      ctx.fill();

      // Ranger Leather Shoulder Mantle
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(9, 19, 32, 7, 3);
      ctx.fill();

      // Wide leather belt & brass buckle
      ctx.fillStyle = '#451a03';
      ctx.fillRect(11, 35, 28, 5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(22, 34, 7, 7);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(24.5, 36, 2, 3);

      // Belt Potion Pouch
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(31, 35, 6, 8, 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e'; // Green potion vial stopper
      ctx.fillRect(33, 33, 2, 3);

      // Golden Ranger Leaf Badge
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(17, 27, 3.5, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // --- HANDS ---
      ctx.fillStyle = '#fcd34d';
      ctx.beginPath();
      ctx.arc(8, 28 + staffTap, 3.5, 0, Math.PI * 2); // Hand on staff
      ctx.arc(38, 30, 3.5, 0, Math.PI * 2); // Resting right hand
      ctx.fill();

      // --- HEAD & NOBLE WHITE/GRAY BEARD ---
      ctx.fillStyle = '#fcd34d'; // Skin
      ctx.beginPath();
      ctx.arc(25, 14, 10, 0, Math.PI * 2);
      ctx.fill();

      // Generous friendly white/silver beard & mustache
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(17, 16);
      ctx.quadraticCurveTo(25, 30, 33, 16);
      ctx.lineTo(31, 14);
      ctx.quadraticCurveTo(25, 20, 19, 14);
      ctx.closePath();
      ctx.fill();

      // Mustache highlights
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(21, 18, 4, 2.2, -0.3, 0, Math.PI * 2);
      ctx.ellipse(29, 18, 4, 2.2, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Kind eyes & bushy gray eyebrows
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(20, 13, 2.5, 3);
      ctx.fillRect(27, 13, 2.5, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(20.5, 13.5, 1, 1);
      ctx.fillRect(27.5, 13.5, 1, 1);

      // Bushy eyebrows
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(19, 11, 4, 1.8);
      ctx.fillRect(26.5, 11, 4, 1.8);

      // --- ROBIN HOOD STYLE RANGER CAP ---
      ctx.fillStyle = '#14532d'; // Dark forest wool
      ctx.beginPath();
      ctx.moveTo(14, 11);
      ctx.lineTo(36, 11);
      ctx.lineTo(38, 4);
      ctx.lineTo(24, 0);
      ctx.lineTo(13, 7);
      ctx.closePath();
      ctx.fill();

      // Folded brim
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.roundRect(13, 8, 24, 4, 2);
      ctx.fill();

      // Tall scarlet pheasant feather
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(14, 2, 2.5, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(13, 0, 1.5, 4);

      ctx.restore();

      // --- FLOATING QUEST EXCLAMATION (!) BADGE ---
      if (isQuestReady) {
        const bounce = Math.sin(animTime * 4) * 4;
        const badgeY = y - 18 + bounce;

        ctx.save();
        ctx.translate(centerX, badgeY);

        // Golden celestial halo pulse
        const aura = 14 + Math.sin(animTime * 5) * 3;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, aura, 0, Math.PI * 2);
        ctx.fill();

        // Golden enameled badge with shine
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, 1);

        // Little star sparkles around badge
        DrawUtils.drawStar(ctx, -13, -7, 4, 3.5, 1.5, '#fef08a');
        DrawUtils.drawStar(ctx, 13, 7, 4, 3, 1.2, '#fde047');
        ctx.restore();
      }
    }
  };

  // =========================================================================
  // 2. ENVIRONMENT RENDERER (Trees, Rocks, Stream, Paths, Undergrowth)
  // =========================================================================
  const EnvironmentRenderer = {
    /**
     * Renders polished marble checkered floor (Hall of Doors).
     */
    renderCheckeredFloor(ctx, x, y, width, height, tileSize = 48) {
      ctx.save();
      for (let ty = y; ty < y + height; ty += tileSize) {
        for (let tx = x; tx < x + width; tx += tileSize) {
          const isBlack = (Math.floor(tx / tileSize) + Math.floor(ty / tileSize)) % 2 === 0;
          ctx.fillStyle = isBlack ? '#0f172a' : '#f8fafc';
          ctx.fillRect(tx, ty, tileSize, tileSize);
          // Tile border bevel
          ctx.strokeStyle = isBlack ? '#1e293b' : '#e2e8f0';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(tx, ty, tileSize, tileSize);
        }
      }
      ctx.restore();
    },

    /**
     * Renders the Mad Tea Party banquet table with festive tablecloth, teapots, and cups.
     */
    renderTeaPartyTable(ctx, x, y, width = 380, height = 90, time = 0) {
      DrawUtils.drawDropShadow(ctx, x + width / 2, y + height - 2, width * 0.48, 14, 0.4);

      ctx.save();
      ctx.translate(x, y);

      // Long Banquet Table Cloth (Buttercup Yellow with scalloped edge)
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.roundRect(0, 14, width, height - 16, 6);
      ctx.fill();

      // Tablecloth Runner (Pastel Cyan with polka dots)
      ctx.fillStyle = '#a5f3fc';
      ctx.fillRect(10, 20, width - 20, height - 28);

      // Multi-tiered Pastry Stand in Center
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(width / 2 - 2, 0, 4, 30);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(width / 2, 22, 28, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(width / 2, 10, 20, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Cupcakes on stand
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(width / 2 - 12, 19, 3.5, 0, Math.PI * 2);
      ctx.arc(width / 2 + 12, 19, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Mismatched Floral Teapots & Cups along the table
      const teaStations = [40, 110, 190, 270, 330];
      for (let i = 0; i < teaStations.length; i++) {
        const sx = teaStations[i];
        // Saucer & Cup
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(sx, 32, 9, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = (i % 2 === 0 ? '#38bdf8' : '#ec4899');
        ctx.beginPath();
        ctx.roundRect(sx - 5, 23, 10, 8, [1, 1, 4, 4]);
        ctx.fill();

        // Little curl of steam rising
        const steamShift = Math.sin(time * 2.5 + i) * 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, 20);
        ctx.quadraticCurveTo(sx + steamShift, 14, sx, 8);
        ctx.stroke();
      }

      ctx.restore();
    },

    /**
     * Renders standard topiary Rose Tree with white roses being painted red.
     */
    renderRoseTree(ctx, x, y, width = 75, height = 95, paintedCount = 0, totalCount = 3, time = 0) {
      const centerX = x + width / 2;
      const footY = y + height;

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, width * 0.38, 9, 0.35);

      ctx.save();
      ctx.translate(x, y);

      // Slender Brown Trunk
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(width / 2 - 4, height * 0.45, 8, height * 0.52);

      // Manicured Round Topiary Foliage Crown
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.35, width * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(width / 2 - 6, height * 0.3, width * 0.32, 0, Math.PI * 2);
      ctx.fill();

      // 3 Roses on Tree
      const roseLocs = [
        [width * 0.35, height * 0.28],
        [width * 0.65, height * 0.25],
        [width * 0.5, height * 0.45]
      ];

      for (let i = 0; i < totalCount; i++) {
        const [rx, ry] = roseLocs[i];
        const isPainted = i < paintedCount;

        // Rose Petals Base
        ctx.fillStyle = isPainted ? '#dc2626' : '#f8fafc';
        ctx.beginPath();
        ctx.arc(rx, ry, 7, 0, Math.PI * 2);
        ctx.fill();

        // Rose Petals Center
        ctx.fillStyle = isPainted ? '#991b1b' : '#cbd5e1';
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Red paint drip if painted!
        if (isPainted) {
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(rx, ry + 8, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    },

    /**
     * Renders arched Playing Card Soldier croquet hoop.
     */
    renderCroquetHoop(ctx, x, y) {
      DrawUtils.drawDropShadow(ctx, x + 16, y + 26, 16, 5, 0.3);

      ctx.save();
      ctx.translate(x, y);

      // Arched Card Soldier bent into hoop
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(16, 16, 14, Math.PI, 0);
      ctx.stroke();

      ctx.strokeStyle = '#dc2626'; // Red Heart / Diamond trim
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(16, 16, 15.5, Math.PI, 0);
      ctx.stroke();

      // Card legs anchored in ground
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 16, 3, 12);
      ctx.fillRect(29, 16, 3, 12);

      ctx.restore();
    },

    /**
     * Renders Royal Courtroom Dais and Throne of Hearts.
     */
    renderCourtThrone(ctx, x, y, width = 120, height = 130) {
      DrawUtils.drawDropShadow(ctx, x + width / 2, y + height - 2, width * 0.48, 16, 0.45);

      ctx.save();
      ctx.translate(x, y);

      // Gold Dais Steps
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(10, height - 20, width - 20, 18, 3);
      ctx.fill();
      // Crimson Carpet Runner
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(width * 0.25, height - 20, width * 0.5, 18);

      // Carved Gilded Throne Backrest (Colossal Heart)
      ctx.fillStyle = '#f59e0b'; // Gold border
      ctx.beginPath();
      ctx.arc(width * 0.38, 36, 26, 0, Math.PI * 2);
      ctx.arc(width * 0.62, 36, 26, 0, Math.PI * 2);
      ctx.fill();

      // Tufted Red Velvet Cushion
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(width * 0.38, 36, 22, 0, Math.PI * 2);
      ctx.arc(width * 0.62, 36, 22, 0, Math.PI * 2);
      ctx.fill();

      // Throne Armrests
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(width * 0.18, 62, 12, 32);
      ctx.fillRect(width * 0.70, 62, 12, 32);

      ctx.restore();
    },

    /**
     * Renders Wonderland Giant Mushrooms (Red Toadstool, Glowing Blue Bioluminescent, or Mystical Purple)
     */
    renderGiantMushroom(ctx, x, y, width, height, type = 'red', time = 0) {
      const centerX = x + width / 2;
      const footY = y + height;

      if (root.StoryAssetManager && root.StoryAssetManager.has('toadstools')) {
        root.StoryAssetManager.drawSprite(ctx, 'toadstools', centerX, footY, width * 1.35, height * 1.35, {
          anchorX: 0.5,
          anchorY: 1.0,
          shadow: true
        });
        return;
      }

      const pulse = Math.sin(time * 2.5 + x) * 0.15;

      // 1. Broad Ground Drop Shadow
      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, width * 0.42, 10, 0.35);

      ctx.save();
      ctx.translate(x, y);

      // 2. Thick Curved Mushroom Stalk (Ivory/cream with textured striations)
      const stalkW = width * 0.32;
      const stalkX = width / 2 - stalkW / 2;
      const stalkTopY = height * 0.38;
      const stalkH = height * 0.62;

      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.moveTo(stalkX + 2, stalkTopY);
      ctx.quadraticCurveTo(stalkX - 4, stalkTopY + stalkH * 0.5, stalkX - 2, height - 4);
      ctx.lineTo(stalkX + stalkW + 2, height - 4);
      ctx.quadraticCurveTo(stalkX + stalkW + 4, stalkTopY + stalkH * 0.5, stalkX + stalkW - 2, stalkTopY);
      ctx.closePath();
      ctx.fill();

      // Stalk shading & gills on underside
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.ellipse(width / 2, stalkTopY + 2, width * 0.38, height * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fine underside radial gill striations
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      for (let i = -width * 0.32; i <= width * 0.32; i += 6) {
        ctx.beginPath();
        ctx.moveTo(width / 2, stalkTopY);
        ctx.lineTo(width / 2 + i, stalkTopY + height * 0.1);
        ctx.stroke();
      }

      // Fungal Veil Ring around mid-stalk
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(width / 2, stalkTopY + stalkH * 0.38, stalkW * 0.75, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Oversized Wonderland Mushroom Cap
      const capH = height * 0.46;
      const capW = width;

      if (type === 'glowing_blue') {
        // Ethereal Bioluminescent Azure
        const capGrad = ctx.createRadialGradient(width / 2, capH * 0.3, 5, width / 2, capH * 0.5, capW * 0.55);
        capGrad.addColorStop(0, '#67e8f9');
        capGrad.addColorStop(0.6, '#06b6d4');
        capGrad.addColorStop(1, '#0e7490');
        ctx.fillStyle = capGrad;

        ctx.beginPath();
        ctx.moveTo(4, capH);
        ctx.bezierCurveTo(4, -4, width - 4, -4, width - 4, capH);
        ctx.closePath();
        ctx.fill();

        // Glowing cyan bioluminescent spots
        ctx.fillStyle = '#a5f3fc';
        const spots = [[width * 0.28, capH * 0.45, 6], [width * 0.5, capH * 0.3, 8], [width * 0.72, capH * 0.48, 6.5], [width * 0.4, capH * 0.65, 5]];
        for (const [sx, sy, sr] of spots) {
          ctx.beginPath();
          ctx.arc(sx, sy, sr * (1 + pulse), 0, Math.PI * 2);
          ctx.fill();
        }

        // Floating spore sparkles
        ctx.fillStyle = 'rgba(165, 243, 252, 0.75)';
        for (let i = 0; i < 3; i++) {
          const spX = width * 0.3 + (i * 18 + time * 12) % (width * 0.5);
          const spY = capH - ((i * 14 + time * 16) % (height * 0.6));
          ctx.beginPath();
          ctx.arc(spX, spY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (type === 'purple') {
        // Mystical Amethyst Violet
        const capGrad = ctx.createRadialGradient(width / 2, capH * 0.3, 5, width / 2, capH * 0.5, capW * 0.55);
        capGrad.addColorStop(0, '#c084fc');
        capGrad.addColorStop(0.6, '#7c3aed');
        capGrad.addColorStop(1, '#4c1d95');
        ctx.fillStyle = capGrad;

        ctx.beginPath();
        ctx.moveTo(4, capH);
        ctx.bezierCurveTo(4, -4, width - 4, -4, width - 4, capH);
        ctx.closePath();
        ctx.fill();

        // Golden spore dots
        ctx.fillStyle = '#fef08a';
        const spots = [[width * 0.3, capH * 0.42, 5.5], [width * 0.5, capH * 0.28, 7], [width * 0.7, capH * 0.46, 5], [width * 0.42, capH * 0.65, 4.5]];
        for (const [sx, sy, sr] of spots) {
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // Classic Scarlet Red Toadstool with Bold White Polka Dots
        const capGrad = ctx.createRadialGradient(width * 0.45, capH * 0.35, 5, width / 2, capH * 0.5, capW * 0.55);
        capGrad.addColorStop(0, '#ef4444');
        capGrad.addColorStop(0.7, '#dc2626');
        capGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = capGrad;

        ctx.beginPath();
        ctx.moveTo(4, capH);
        ctx.bezierCurveTo(4, -4, width - 4, -4, width - 4, capH);
        ctx.closePath();
        ctx.fill();

        // Bold Creamy-White Polka Dots
        ctx.fillStyle = '#ffffff';
        const spots = [
          [width * 0.28, capH * 0.42, 7],
          [width * 0.5, capH * 0.26, 8.5],
          [width * 0.72, capH * 0.44, 7.5],
          [width * 0.38, capH * 0.68, 5.5],
          [width * 0.62, capH * 0.66, 6],
          [width * 0.15, capH * 0.6, 4]
        ];
        for (const [sx, sy, sr] of spots) {
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    },

    /**
     * Renders detailed multi-tiered trees with textured gnarled trunks and wind-swayed foliage.
     */
    renderTree(ctx, x, y, width, height, type = 'oak', time = 0) {
      const centerX = x + width / 2;
      const footY = y + height;

      if (root.StoryAssetManager && root.StoryAssetManager.has('fairytale_oak')) {
        root.StoryAssetManager.drawSprite(ctx, 'fairytale_oak', centerX, footY, width * 1.35, height * 1.35, {
          anchorX: 0.5,
          anchorY: 1.0,
          shadow: true
        });
        return;
      }

      const sway = Math.sin(time * 1.5 + x * 0.05) * 2.5;

      // 1. Broad Ground Drop Shadow
      DrawUtils.drawDropShadow(ctx, centerX, footY - 4, width * 0.42, 12, 0.35);

      ctx.save();
      ctx.translate(x, y);

      if (type === 'birch') {
        // --- SILVER BIRCH ---
        // Slender pale trunk
        const trunkW = 14;
        const trunkX = width / 2 - trunkW / 2;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(trunkX, height - 55, trunkW, 52);
        // Birch dark horizontal bark striations
        ctx.fillStyle = '#334155';
        for (let i = height - 48; i < height - 8; i += 7) {
          ctx.fillRect(trunkX + 1, i, (i % 2 === 0 ? 8 : 11), 2);
        }

        // Airy weeping golden/emerald foliage clusters
        ctx.save();
        ctx.translate(sway, 0);
        const clusters = [
          { cx: width / 2, cy: height - 60, r: 26, c: '#4ade80' },
          { cx: width / 2 - 12, cy: height - 75, r: 22, c: '#86efac' },
          { cx: width / 2 + 14, cy: height - 72, r: 24, c: '#22c55e' },
          { cx: width / 2, cy: height - 90, r: 22, c: '#a7f3d0' }
        ];
        for (const cl of clusters) {
          ctx.fillStyle = cl.c;
          ctx.beginPath();
          ctx.arc(cl.cx, cl.cy, cl.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

      } else {
        // --- GRAND ANCIENT OAK ---
        const trunkW = width * 0.28;
        const trunkH = height * 0.48;
        const trunkX = width / 2 - trunkW / 2;
        const trunkY = height - trunkH;

        // Gnarled Sprawling Roots
        ctx.fillStyle = '#38220f';
        ctx.beginPath();
        ctx.moveTo(trunkX - 10, height - 2);
        ctx.quadraticCurveTo(trunkX + 4, trunkY + 15, trunkX + 4, trunkY);
        ctx.lineTo(trunkX + trunkW - 4, trunkY);
        ctx.quadraticCurveTo(trunkX + trunkW - 4, trunkY + 15, trunkX + trunkW + 10, height - 2);
        ctx.closePath();
        ctx.fill();

        // Trunk Body with Deep Bark Furrows
        const trunkGrad = ctx.createLinearGradient(trunkX, 0, trunkX + trunkW, 0);
        trunkGrad.addColorStop(0, '#2d1808');
        trunkGrad.addColorStop(0.3, '#5c3a21');
        trunkGrad.addColorStop(0.7, '#78350f');
        trunkGrad.addColorStop(1, '#2d1808');
        ctx.fillStyle = trunkGrad;
        ctx.fillRect(trunkX, trunkY, trunkW, trunkH);

        // Vertical Bark Ridge Lines
        ctx.strokeStyle = '#1e1106';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(trunkX + 6, trunkY + 6);
        ctx.lineTo(trunkX + 5, height - 4);
        ctx.moveTo(trunkX + trunkW / 2, trunkY + 4);
        ctx.lineTo(trunkX + trunkW / 2 + 1, height - 4);
        ctx.moveTo(trunkX + trunkW - 6, trunkY + 8);
        ctx.lineTo(trunkX + trunkW - 5, height - 4);
        ctx.stroke();

        // Moss Clump at Trunk Base
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(trunkX + 4, height - 4, 8, 4, -0.2, 0, Math.PI * 2);
        ctx.ellipse(trunkX + trunkW - 2, height - 4, 7, 3.5, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Multi-Tiered Foliage Domes (Deep shadow -> Vibrant midtone -> Sunlit rim highlight)
        ctx.save();
        ctx.translate(sway, 0);

        const foliageDomes = [
          // Bottom Tier (Dark foliage shadows)
          { cx: width / 2 - 18, cy: height - 52, r: 28, fill: '#14532d' },
          { cx: width / 2 + 18, cy: height - 50, r: 30, fill: '#166534' },
          // Mid Tier (Rich emerald foliage)
          { cx: width / 2 - 24, cy: height - 70, r: 27, fill: '#15803d' },
          { cx: width / 2 + 22, cy: height - 68, r: 28, fill: '#16a34a' },
          { cx: width / 2, cy: height - 65, r: 34, fill: '#15803d' },
          // Top Tier (Sunlit golden-green crowns)
          { cx: width / 2 - 10, cy: height - 88, r: 25, fill: '#22c55e' },
          { cx: width / 2 + 12, cy: height - 86, r: 24, fill: '#4ade80' },
          { cx: width / 2, cy: height - 102, r: 20, fill: '#86efac' }
        ];

        for (const dome of foliageDomes) {
          ctx.fillStyle = dome.fill;
          ctx.beginPath();
          ctx.arc(dome.cx, dome.cy, dome.r, 0, Math.PI * 2);
          ctx.fill();

          // Leaf Rim Texture on larger domes
          if (dome.r > 24) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(dome.cx - dome.r * 0.3, dome.cy - dome.r * 0.3, dome.r * 0.55, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      ctx.restore();
    },

    /**
     * Renders faceted, moss-covered boulders with directional light shading.
     */
    renderRock(ctx, x, y, width, height) {
      const centerX = x + width / 2;
      const footY = y + height;

      if (root.StoryAssetManager && root.StoryAssetManager.has('mossy_boulder')) {
        root.StoryAssetManager.drawSprite(ctx, 'mossy_boulder', centerX, footY, width * 1.35, height * 1.35, {
          anchorX: 0.5,
          anchorY: 1.0,
          shadow: true
        });
        return;
      }

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, width * 0.45, height * 0.22, 0.32);

      ctx.save();
      ctx.translate(x, y);

      // Main Boulder Silhouette (Faceted polygonal shape)
      ctx.fillStyle = '#475569'; // Shadow tone (Slate-600)
      ctx.beginPath();
      ctx.moveTo(8, height - 6);
      ctx.lineTo(2, height * 0.55);
      ctx.lineTo(14, 6);
      ctx.lineTo(width * 0.55, 2);
      ctx.lineTo(width - 6, 12);
      ctx.lineTo(width - 2, height * 0.6);
      ctx.lineTo(width - 8, height - 4);
      ctx.closePath();
      ctx.fill();

      // Top Sunlit Facet (Lighter gray)
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(14, 6);
      ctx.lineTo(width * 0.55, 2);
      ctx.lineTo(width * 0.7, height * 0.45);
      ctx.lineTo(width * 0.3, height * 0.5);
      ctx.closePath();
      ctx.fill();

      // Top-left Specular Edge Rim
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(14, 6);
      ctx.lineTo(width * 0.55, 2);
      ctx.stroke();

      // Dark Geological Cracks
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(width * 0.45, height * 0.35);
      ctx.lineTo(width * 0.4, height * 0.7);
      ctx.lineTo(width * 0.55, height - 8);
      ctx.stroke();

      // Moss Blanket on Top Crest
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(width * 0.45, 8, width * 0.25, 5, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(width * 0.48, 10, width * 0.2, 3, -0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    /**
     * Renders wild vegetation (buttercups, bluebells, red toadstools, fern fronds).
     */
    renderFlora(ctx, x, y, type = 'flower', time = 0) {
      const sway = Math.sin(time * 2 + x) * 1.5;

      ctx.save();
      ctx.translate(x, y);

      if (type === 'mushroom') {
        // Red spotted fly-agaric toadstool
        DrawUtils.drawDropShadow(ctx, 8, 14, 6, 2.5, 0.25);
        // Cream Stalk
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(6, 6, 4, 8);
        // Red Cap
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(8, 6, 7.5, Math.PI, Math.PI * 2);
        ctx.fill();
        // White Polka Dots
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(5, 3, 1.2, 0, Math.PI * 2);
        ctx.arc(8, 1, 1.4, 0, Math.PI * 2);
        ctx.arc(11, 3.5, 1.2, 0, Math.PI * 2);
        ctx.arc(7, 5, 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Tiny baby mushroom beside it
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(15, 9, 2.5, 5);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(16, 9, 4, Math.PI, Math.PI * 2);
        ctx.fill();

      } else if (type === 'bluebell') {
        // Gentle Bluebells with green stem
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(6, 16);
        ctx.quadraticCurveTo(8, 8, 10 + sway, 2);
        ctx.stroke();

        // Bell blossoms
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(10 + sway, 4, 3, 0, Math.PI * 2);
        ctx.arc(8 + sway * 0.7, 8, 2.5, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Golden Buttercups / Daisies
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(6, 14);
        ctx.lineTo(6 + sway, 4);
        ctx.stroke();

        // Petals
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(6 + sway, 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Golden center
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(6 + sway, 4, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    },

    /**
     * Renders living, multi-layered water stream / forest pond with animated wave ripples and water lilies.
     */
    renderWater(ctx, x, y, width, height, time = 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      if (root.StoryAssetManager && root.StoryAssetManager.has('storybook_pond')) {
        root.StoryAssetManager.drawSprite(ctx, 'storybook_pond', centerX, centerY, width, height, {
          anchorX: 0.5,
          anchorY: 0.5,
          shadow: false
        });

        // Subtle shimmering water sparkles
        ctx.save();
        const sparkles = [
          [x + width * 0.35, y + height * 0.38, 0.8],
          [x + width * 0.58, y + height * 0.45, 1.4],
          [x + width * 0.45, y + height * 0.58, 0.5],
          [x + width * 0.32, y + height * 0.52, 2.1]
        ];
        for (const [sx, sy, phase] of sparkles) {
          const sparkleAlpha = 0.25 + Math.sin(time * 3 + phase) * 0.22;
          if (sparkleAlpha > 0.08) {
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
            ctx.beginPath();
            ctx.arc(sx + Math.sin(time + phase) * 5, sy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
        return;
      }

      ctx.save();
      ctx.translate(x, y);

      // 1. Shoreline Bed (Wet river sand & rounded river pebbles)
      ctx.fillStyle = '#1e3a1e';
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, width / 2 + 10, height / 2 + 8, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Shore pebbles
      ctx.fillStyle = '#64748b';
      const pebbleLocs = [[- width * 0.4, 10], [width * 0.35, -height * 0.3], [width * 0.42, 14], [-width * 0.2, height * 0.4]];
      for (const [px, py] of pebbleLocs) {
        ctx.beginPath();
        ctx.ellipse(width / 2 + px, height / 2 + py, 5, 3, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Main Deep Water Body (Multi-stop gradient from Azure to Deep Navy)
      const waterGrad = ctx.createRadialGradient(
        width * 0.45, height * 0.45, 10,
        width * 0.5, height * 0.5, width * 0.52
      );
      waterGrad.addColorStop(0, '#38bdf8');   // Light turquoise center
      waterGrad.addColorStop(0.5, '#0284c7'); // Rich azure mid
      waterGrad.addColorStop(1, '#0c4a6e');   // Deep mysterious navy edge
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, width / 2, height / 2, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // 3. Animated Shimmering Wavelet Highlights (Sine wave ripples)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';

      for (let i = 0; i < 4; i++) {
        const offsetPhase = time * 2 + i * 1.5;
        const waveY = height * 0.3 + i * (height * 0.15) + Math.sin(offsetPhase) * 3;
        const waveX = width * 0.25 + Math.cos(offsetPhase * 0.8) * 14;
        const waveLen = width * 0.35 + Math.sin(offsetPhase) * 10;

        ctx.beginPath();
        ctx.moveTo(waveX, waveY);
        ctx.quadraticCurveTo(waveX + waveLen / 2, waveY - 2.5, waveX + waveLen, waveY);
        ctx.stroke();
      }

      // 4. Floating Water Lily Pads with blooming pink water lilies
      const lilyPads = [
        { lx: width * 0.32, ly: height * 0.4, r: 12, hasFlower: true },
        { lx: width * 0.65, ly: height * 0.55, r: 15, hasFlower: false },
        { lx: width * 0.48, ly: height * 0.68, r: 10, hasFlower: true }
      ];

      for (const lily of lilyPads) {
        // Floating green notch pad
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(lily.lx, lily.ly, lily.r, 0.3, Math.PI * 2 - 0.3);
        ctx.lineTo(lily.lx, lily.ly);
        ctx.closePath();
        ctx.fill();

        if (lily.hasFlower) {
          // Pink blooming water lily
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(lily.lx, lily.ly, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(lily.lx, lily.ly, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    },

    /**
     * Renders a rustic hand-crafted wooden signpost with carved directional arrow.
     */
    renderSignpost(ctx, x, y, width, height, label = 'ANCIENT GATE') {
      const centerX = x + width / 2;
      const footY = y + height;

      if (root.StoryAssetManager && root.StoryAssetManager.has('wooden_signpost')) {
        root.StoryAssetManager.drawSprite(ctx, 'wooden_signpost', centerX, footY, width * 1.5, height * 1.6, {
          anchorX: 0.5,
          anchorY: 1.0,
          shadow: true
        });
        return;
      }

      DrawUtils.drawDropShadow(ctx, centerX, footY - 3, 14, 6, 0.3);

      ctx.save();
      ctx.translate(x, y);

      // Wooden Post Trunk
      ctx.fillStyle = '#451a03';
      ctx.fillRect(width / 2 - 4, 12, 8, height - 15);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(width / 2 - 3, 12, 6, height - 15);

      // Carved Wooden Plaque (Arrow pointing right)
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(4, 8);
      ctx.lineTo(width - 12, 8);
      ctx.lineTo(width, 18);
      ctx.lineTo(width - 12, 28);
      ctx.lineTo(4, 28);
      ctx.closePath();
      ctx.fill();

      // Wood Grain Border & Iron Rivets
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#292524'; // Iron nails
      ctx.beginPath();
      ctx.arc(8, 18, 1.5, 0, Math.PI * 2);
      ctx.arc(width - 14, 18, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Carved Label
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, (width - 6) / 2, 18.5);

      ctx.restore();
    }
  };

  // =========================================================================
  // 3. OBJECT RENDERER (Golden Relic Key & Ancient Stone Gate)
  // =========================================================================
  const ObjectRenderer = {
    /**
     * Renders the ornate "DRINK ME" glass vial with glowing liquid and label.
     */
    renderDrinkMeBottle(ctx, x, y, width, height, time = 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const bob = Math.sin(time * 3.2) * 3.5;

      DrawUtils.drawDropShadow(ctx, centerX, y + height + 2, 12, 4.5, 0.28);

      ctx.save();
      ctx.translate(centerX, centerY + bob);

      // Radiant Amethyst Aura
      const auraRad = 18 + Math.sin(time * 4) * 3;
      const auraGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, auraRad);
      auraGrad.addColorStop(0, 'rgba(192, 132, 252, 0.6)');
      auraGrad.addColorStop(0.5, 'rgba(126, 34, 206, 0.25)');
      auraGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, auraRad, 0, Math.PI * 2);
      ctx.fill();

      // Glass Bottle Body
      ctx.fillStyle = 'rgba(240, 249, 255, 0.85)';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-7, -4, 14, 18, 4);
      ctx.fill();
      ctx.stroke();

      // Glowing Cherry/Purple Potion Liquid Inside
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.roundRect(-5.5, 0, 11, 13, [0, 0, 3, 3]);
      ctx.fill();

      // Bottle Neck & Cork Stopper
      ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
      ctx.fillRect(-3, -9, 6, 6);
      ctx.fillStyle = '#b45309'; // Cork
      ctx.fillRect(-3.5, -12, 7, 4);

      // Paper Label: "DRINK ME"
      ctx.fillStyle = '#fefce8';
      ctx.beginPath();
      ctx.roundRect(-8, 3, 16, 7, 1.5);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 5.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DRINK ME', 0, 8);

      ctx.restore();
    },

    /**
     * Renders the frosted "EAT ME" currant cake with pink icing.
     */
    renderEatMeCake(ctx, x, y, width, height, time = 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const bob = Math.sin(time * 3.0) * 3;

      DrawUtils.drawDropShadow(ctx, centerX, y + height + 2, 12, 4.5, 0.28);

      ctx.save();
      ctx.translate(centerX, centerY + bob);

      // Golden radiance
      const auraRad = 17 + Math.sin(time * 3.5) * 3;
      ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, auraRad, 0, Math.PI * 2);
      ctx.fill();

      // Sponge Cake Base
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.roundRect(-8, -2, 16, 12, 3);
      ctx.fill();

      // Pink Glossy Frosting
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.roundRect(-9, -6, 18, 7, 3);
      ctx.fill();

      // Currants spelling EAT ME
      ctx.fillStyle = '#451a03';
      ctx.font = 'bold 5.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EAT ME', 0, -1);

      ctx.restore();
    },

    /**
     * Renders the Solid Glass Three-Legged Table with realistic refraction and reflections.
     */
    renderGlassTable(ctx, x, y, width = 120, height = 60, isExamined = false, time = 0) {
      const centerX = x + width / 2;
      const baseY = y + height;

      // Drop shadow for the tabletop and 3 glass legs
      DrawUtils.drawDropShadow(ctx, centerX, baseY - 4, width * 0.42, 10, 0.28);
      DrawUtils.drawDropShadow(ctx, x + 24, baseY - 2, 8, 4, 0.2);
      DrawUtils.drawDropShadow(ctx, x + width - 24, baseY - 2, 8, 4, 0.2);
      DrawUtils.drawDropShadow(ctx, centerX, baseY - 1, 9, 4.5, 0.22);

      ctx.save();

      // 1. Three Tapered Glass Legs
      // Left leg
      const legGradL = ctx.createLinearGradient(x + 20, y + 25, x + 24, baseY);
      legGradL.addColorStop(0, 'rgba(224, 242, 254, 0.7)');
      legGradL.addColorStop(0.5, 'rgba(186, 230, 253, 0.45)');
      legGradL.addColorStop(1, 'rgba(125, 211, 252, 0.6)');
      ctx.fillStyle = legGradL;
      ctx.beginPath();
      ctx.moveTo(x + 28, y + 25);
      ctx.lineTo(x + 36, y + 25);
      ctx.lineTo(x + 26, baseY - 2);
      ctx.lineTo(x + 22, baseY - 2);
      ctx.closePath();
      ctx.fill();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(x + width - 36, y + 25);
      ctx.lineTo(x + width - 28, y + 25);
      ctx.lineTo(x + width - 22, baseY - 2);
      ctx.lineTo(x + width - 26, baseY - 2);
      ctx.closePath();
      ctx.fill();

      // Center back leg
      const legGradC = ctx.createLinearGradient(centerX - 4, y + 25, centerX + 4, baseY);
      legGradC.addColorStop(0, 'rgba(224, 242, 254, 0.6)');
      legGradC.addColorStop(1, 'rgba(56, 189, 248, 0.5)');
      ctx.fillStyle = legGradC;
      ctx.beginPath();
      ctx.moveTo(centerX - 5, y + 25);
      ctx.lineTo(centerX + 5, y + 25);
      ctx.lineTo(centerX + 3, baseY - 1);
      ctx.lineTo(centerX - 3, baseY - 1);
      ctx.closePath();
      ctx.fill();

      // Leg specular highlight lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 30, y + 26);
      ctx.lineTo(x + 23, baseY - 2);
      ctx.moveTo(x + width - 30, y + 26);
      ctx.lineTo(x + width - 23, baseY - 2);
      ctx.moveTo(centerX, y + 26);
      ctx.lineTo(centerX, baseY - 1);
      ctx.stroke();

      // 2. Solid Glass Oval Tabletop
      // Glass thickness / rim
      const rimGrad = ctx.createLinearGradient(0, y + 10, 0, y + 30);
      rimGrad.addColorStop(0, 'rgba(186, 230, 253, 0.5)');
      rimGrad.addColorStop(1, 'rgba(56, 189, 248, 0.35)');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, y + 24, width * 0.46, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tabletop upper surface
      const topGrad = ctx.createLinearGradient(centerX - width * 0.4, y + 10, centerX + width * 0.4, y + 26);
      topGrad.addColorStop(0, 'rgba(240, 249, 255, 0.85)');
      topGrad.addColorStop(0.3, 'rgba(224, 242, 254, 0.65)');
      topGrad.addColorStop(0.7, 'rgba(186, 230, 253, 0.5)');
      topGrad.addColorStop(1, 'rgba(125, 211, 252, 0.7)');
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, y + 20, width * 0.44, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Prismatic glass edge bevel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(centerX, y + 20, width * 0.44, 13, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Specular glare arcs (reflection of subterranean chandeliers)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(centerX - 12, y + 16, width * 0.28, 6, -0.15, Math.PI * 0.95, Math.PI * 1.65);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(centerX + 18, y + 22, width * 0.16, 4, 0.1, 0, Math.PI * 0.7);
      ctx.stroke();

      // Sparkling crystal glint
      const glintPulse = (Math.sin(time * 3) + 1) * 0.5;
      if (glintPulse > 0.4) {
        ctx.fillStyle = `rgba(255, 255, 255, ${glintPulse * 0.85})`;
        ctx.beginPath();
        ctx.arc(centerX - width * 0.25, y + 16, 2.5 * glintPulse, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    },

    /**
     * Renders the Tiny 15-inch Golden Door.
     */
    renderTinyDoor(ctx, x, y, width = 36, height = 48, isOpen = false, time = 0) {
      DrawUtils.drawDropShadow(ctx, x + width / 2, y + height - 2, width * 0.45, 6, 0.35);

      ctx.save();
      ctx.translate(x, y);

      // Ornate Golden Arch Frame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, [14, 14, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Door Opening
      if (isOpen) {
        // Bright radiant sunlight streaming from the garden!
        const gardenGrad = ctx.createLinearGradient(0, 0, 0, height);
        gardenGrad.addColorStop(0, '#fef08a');
        gardenGrad.addColorStop(0.5, '#86efac');
        gardenGrad.addColorStop(1, '#22c55e');
        ctx.fillStyle = gardenGrad;
        ctx.beginPath();
        ctx.roundRect(4, 4, width - 8, height - 6, [10, 10, 1, 1]);
        ctx.fill();
      } else {
        // Closed polished rosewood door with keyhole
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.roundRect(4, 4, width - 8, height - 6, [10, 10, 1, 1]);
        ctx.fill();

        // Brass Keyhole Escutcheon
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.55, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.55 - 1, 1.5, 0, Math.PI * 2);
        ctx.rect(width / 2 - 0.8, height * 0.55, 1.6, 2.5);
        ctx.fill();
      }

      ctx.restore();
    },

    /**
     * Renders Royal Tart Platter with strawberry tarts.
     */
    renderTartPlatter(ctx, x, y, width = 48, height = 36, hasTarts = true) {
      DrawUtils.drawDropShadow(ctx, x + width / 2, y + height - 2, 18, 6, 0.3);

      ctx.save();
      ctx.translate(x, y);

      // Silver Pedestal Stand
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 4, 14, 8, 14, 2);
      ctx.roundRect(width / 2 - 12, 26, 24, 6, 2);
      ctx.fill();

      // Platter Plate
      ctx.beginPath();
      ctx.ellipse(width / 2, 14, 20, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (hasTarts) {
        // Golden pastry shells filled with crimson strawberry jam
        const tartLocs = [[width / 2 - 9, 11], [width / 2 + 9, 11], [width / 2, 8]];
        for (const [tx, ty] of tartLocs) {
          ctx.fillStyle = '#f59e0b'; // Pastry
          ctx.beginPath();
          ctx.ellipse(tx, ty, 6, 3.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#dc2626'; // Strawberry jam
          ctx.beginPath();
          ctx.arc(tx, ty - 1, 3.5, 0, Math.PI * 2);
          ctx.fill();
          // Whipped cream dot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(tx, ty - 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    },

    /**
     * Renders floating curiosity props for the Rabbit Hole descent.
     */
    renderFallingCuriosity(ctx, x, y, type = 'marmalade', rot = 0, time = 0) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      if (type === 'marmalade') {
        // Orange marmalade glass jar
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(-8, -10, 16, 20, 4);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(-7, -4, 14, 8);
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MARMALADE', 0, 1);
      } else if (type === 'clock') {
        // Floating grandfather clock face
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.roundRect(-10, -14, 20, 28, 4);
        ctx.fill();
        ctx.fillStyle = '#fefce8';
        ctx.beginPath();
        ctx.arc(0, -4, 7, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'teacup') {
        // Floating blue teacup
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(-8, -6, 16, 12, [2, 2, 6, 6]);
        ctx.fill();
      }

      ctx.restore();
    },

    /**
     * Renders the Antique 2.5D Golden Pocket Watch with Roman dial, ticking escapement hand,
     * attached golden chain, pulsing radiance halo, and glint sparkles.
     */
    renderPocketWatch(ctx, x, y, width, height, time = 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const floatBob = Math.sin(time * 3.5) * 4;

      // 1. Ground Drop Shadow
      DrawUtils.drawDropShadow(ctx, centerX, y + height + 2, 14, 5, 0.28);

      ctx.save();
      ctx.translate(centerX, centerY + floatBob);

      // 2. Radiant Golden Aura Halo (Pulsing warm glow)
      const auraRad = 20 + Math.sin(time * 4) * 4;
      const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, auraRad);
      auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
      auraGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
      auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, auraRad, 0, Math.PI * 2);
      ctx.fill();

      // 3. Rotating Glint Sparkles around Watch
      const glintAngle = time * 2;
      DrawUtils.drawStar(ctx, Math.cos(glintAngle) * 15, Math.sin(glintAngle) * 15, 4, 4.5, 1.8, '#ffffff');
      DrawUtils.drawStar(ctx, Math.cos(glintAngle + Math.PI) * 13, Math.sin(glintAngle + Math.PI) * 13, 4, 3.5, 1.4, '#fef08a');

      if (root.StoryAssetManager && root.StoryAssetManager.has('pocket_watch')) {
        root.StoryAssetManager.drawSprite(ctx, 'pocket_watch', 0, 0, width * 1.05, height * 1.05, {
          anchorX: 0.5,
          anchorY: 0.5,
          shadow: false
        });
        ctx.restore();
        return;
      }

      // 4. Attached Golden Curb Chain trailing to side
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.quadraticCurveTo(12, -18, 16, -8);
      ctx.quadraticCurveTo(20, 2, 14, 10);
      ctx.stroke();

      // 5. Watch Outer Casing (Polished antique gold)
      const goldGrad = ctx.createLinearGradient(-12, -12, 12, 12);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.4, '#f59e0b');
      goldGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // Beaded / Filigree Casing Rim
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Top Winding Crown Knob & Loop Ring at 12 o'clock
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-2, -15, 4, 3.5);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -15, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Enamel Watch Dial (Cream porcelain face)
      ctx.fillStyle = '#fefce8';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      // Dial inner ring
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, 8.2, 0, Math.PI * 2);
      ctx.stroke();

      // 12 Roman / Hour Tick Marks
      ctx.fillStyle = '#451a03';
      for (let i = 0; i < 12; i++) {
        const rad = (i * Math.PI) / 6;
        const tx = Math.sin(rad) * 6.8;
        const ty = -Math.cos(rad) * 6.8;
        ctx.fillRect(tx - 0.5, ty - 0.5, 1, 1);
      }

      // Hour Hand (Pointing towards 12)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0.5, -4.5);
      ctx.stroke();

      // Minute Hand (Pointing towards 10)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-4.2, -3.2);
      ctx.stroke();

      // Stepped Ticking Escapement Second Hand (Red needle)
      const tickStep = Math.floor(time * 2.5) * (Math.PI / 6);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.sin(tickStep) * 6, -Math.cos(tickStep) * 6);
      ctx.stroke();

      // Center jewel pivot
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    /**
     * Renders the Giant Hollow Oak & Rabbit Hole with gnarled ancient roots,
     * deep cosmic/mystical abyss portal, floating fairy-dust motes, and ambient luminescence.
     */
    renderRabbitHole(ctx, entity) {
      const { x, y, width = 140, height = 140, animTime = 0 } = entity;
      const centerX = x + width / 2;
      const footY = y + height;

      if (root.StoryAssetManager && root.StoryAssetManager.has('rabbit_hole_oak')) {
        // Render Illustrated Hollow Oak Tree Sprite
        root.StoryAssetManager.drawSprite(ctx, 'rabbit_hole_oak', centerX, footY, width * 1.5, height * 1.5, {
          anchorX: 0.5,
          anchorY: 1.0,
          shadow: true
        });

        // Overlay mystical swirling fairy dust and glowing amber portal within the hollow roots
        ctx.save();
        ctx.translate(x, y);
        const holeW = width * 0.44;
        const holeH = height * 0.38;
        const holeX = width * 0.28;
        const holeY = height * 0.58;

        for (let i = 0; i < 8; i++) {
          const pSpeed = 0.8 + (i % 3) * 0.4;
          const phase = animTime * pSpeed + i * 1.6;
          const px = holeX + holeW * 0.5 + Math.sin(phase * 1.5) * (holeW * 0.3);
          const py = (holeY + holeH * 0.8) - ((animTime * 22 + i * 16) % (holeH * 1.1));
          const pAlpha = Math.sin(Math.max(0, Math.min(1, (py - holeY) / holeH)) * Math.PI) * 0.85;

          if (pAlpha > 0) {
            ctx.fillStyle = (i % 2 === 0 ? `rgba(254, 240, 138, ${pAlpha})` : `rgba(167, 139, 250, ${pAlpha})`);
            ctx.beginPath();
            ctx.arc(px, py, 1.8 + (i % 2), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        const pulseAura = Math.sin(animTime * 2.2) * 0.1 + 0.22;
        ctx.fillStyle = `rgba(245, 158, 11, ${pulseAura})`;
        ctx.beginPath();
        ctx.ellipse(holeX + holeW / 2, holeY + holeH * 0.75, holeW * 0.45, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return;
      }

      // 1. Heavy Broad Root Shadow
      DrawUtils.drawDropShadow(ctx, centerX, footY - 6, width * 0.48, 16, 0.45);

      ctx.save();
      ctx.translate(x, y);

      // 2. Colossal Hollow Oak Trunk & Twisted Root Arch
      // Dark wood gradient
      const trunkGrad = ctx.createLinearGradient(0, 0, width, 0);
      trunkGrad.addColorStop(0, '#2e1c0c');
      trunkGrad.addColorStop(0.3, '#451a03');
      trunkGrad.addColorStop(0.7, '#5c2c0e');
      trunkGrad.addColorStop(1, '#2e1c0c');
      ctx.fillStyle = trunkGrad;

      // Main Arching Oak Base
      ctx.beginPath();
      ctx.moveTo(width * 0.15, 0);
      ctx.bezierCurveTo(width * 0.1, height * 0.5, 0, height * 0.85, 2, height - 10);
      ctx.lineTo(width * 0.25, height - 8);
      // Arch inner contour (The cavern frame)
      ctx.bezierCurveTo(width * 0.3, height * 0.45, width * 0.7, height * 0.45, width * 0.75, height - 8);
      ctx.lineTo(width - 2, height - 10);
      ctx.bezierCurveTo(width, height * 0.85, width * 0.9, height * 0.5, width * 0.85, 0);
      ctx.closePath();
      ctx.fill();

      // Gnarled Bark Knots & Ridges
      ctx.strokeStyle = '#291807';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Left root twists
      ctx.moveTo(width * 0.16, 20); ctx.quadraticCurveTo(width * 0.12, 60, 10, height - 12);
      ctx.moveTo(width * 0.22, 35); ctx.quadraticCurveTo(width * 0.18, 70, width * 0.15, height - 10);
      // Right root twists
      ctx.moveTo(width * 0.84, 20); ctx.quadraticCurveTo(width * 0.88, 60, width - 10, height - 12);
      ctx.moveTo(width * 0.78, 35); ctx.quadraticCurveTo(width * 0.82, 70, width * 0.85, height - 10);
      ctx.stroke();

      // Moss & Ivy Clinging to Root Arch
      ctx.fillStyle = '#166534';
      const mossClumps = [
        [width * 0.15, 30, 8, 5], [width * 0.18, 55, 10, 6], [12, height - 16, 14, 7],
        [width * 0.82, 32, 9, 5], [width * 0.8, 60, 11, 6], [width - 16, height - 15, 13, 7],
        [width * 0.48, 12, 16, 7]
      ];
      for (const [mx, my, mrx, mry] of mossClumps) {
        ctx.beginPath();
        ctx.ellipse(mx, my, mrx, mry, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Deep Subterranean Mystical Portal Void (The Rabbit Hole)
      const holeW = width * 0.52;
      const holeH = height * 0.54;
      const holeX = width * 0.24;
      const holeY = height * 0.38;

      const portalGrad = ctx.createRadialGradient(
        holeX + holeW / 2, holeY + holeH * 0.6, 5,
        holeX + holeW / 2, holeY + holeH * 0.5, holeW * 0.6
      );
      portalGrad.addColorStop(0, '#581c87'); // Mystical purple vortex core
      portalGrad.addColorStop(0.4, '#1e1b4b'); // Deep cosmic navy
      portalGrad.addColorStop(0.8, '#090d16');
      portalGrad.addColorStop(1, '#020617'); // Pitch darkness edge
      ctx.fillStyle = portalGrad;

      ctx.beginPath();
      ctx.ellipse(holeX + holeW / 2, holeY + holeH * 0.55, holeW * 0.48, holeH * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. Mystical Swirling Fairy-Dust Particles rising from the Rabbit Hole
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const pSpeed = 0.8 + (i % 3) * 0.4;
        const phase = animTime * pSpeed + i * 1.6;
        const px = holeX + holeW * 0.5 + Math.sin(phase * 1.5) * (holeW * 0.28);
        const py = (holeY + holeH * 0.8) - ((animTime * 25 + i * 18) % (holeH * 0.95));
        const pAlpha = Math.sin((py - holeY) / holeH * Math.PI) * 0.85;

        if (pAlpha > 0) {
          ctx.fillStyle = (i % 2 === 0 ? `rgba(254, 240, 138, ${pAlpha})` : `rgba(167, 139, 250, ${pAlpha})`);
          ctx.beginPath();
          ctx.arc(px, py, 1.8 + (i % 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 5. Pulsing Ambient Luminescence at Hole Threshold
      const pulseAura = Math.sin(animTime * 2.2) * 0.08 + 0.18;
      ctx.fillStyle = `rgba(168, 85, 247, ${pulseAura})`;
      ctx.beginPath();
      ctx.ellipse(holeX + holeW / 2, holeY + holeH * 0.85, holeW * 0.44, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },

    /**
     * Renders the 2.5D Ornate Filigree Golden Relic Key with rotating shine and radiant aura.
     */
    renderGoldenKey(ctx, x, y, width, height, time = 0) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const floatBob = Math.sin(time * 3.5) * 5;

      // 1. Ground Light Projection Shadow
      DrawUtils.drawDropShadow(ctx, centerX, y + height + 2, 14, 5, 0.25);

      ctx.save();
      ctx.translate(centerX, centerY + floatBob);

      // 2. Radiant Golden Aura Halo (Pulsing warm glow)
      const auraRad = 22 + Math.sin(time * 4) * 4;
      const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, auraRad);
      auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
      auraGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
      auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, auraRad, 0, Math.PI * 2);
      ctx.fill();

      // 3. Rotating Glint Sparkles around Key
      const glintAngle = time * 2;
      DrawUtils.drawStar(ctx, Math.cos(glintAngle) * 16, Math.sin(glintAngle) * 16, 4, 5, 1.8, '#ffffff');
      DrawUtils.drawStar(ctx, Math.cos(glintAngle + Math.PI) * 14, Math.sin(glintAngle + Math.PI) * 14, 4, 4, 1.5, '#fef08a');

      // 4. Ornate Filigree Golden Key
      ctx.rotate((45 * Math.PI) / 180);

      // Key Ring Loop (Ornate antique scrollwork)
      const goldDark = '#b45309';
      const goldMid = '#f59e0b';
      const goldLight = '#fef08a';

      // Outer ring
      ctx.fillStyle = goldMid;
      ctx.strokeStyle = goldLight;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -10, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner ring hole
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -10, 5, 0, Math.PI * 2);
      ctx.fill();

      // Center Inset Sapphire Jewel
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -10, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Key Shaft
      ctx.fillStyle = goldMid;
      ctx.fillRect(-2.5, 0, 5, 22);

      // Shaft Specular Highlight Line
      ctx.fillStyle = goldLight;
      ctx.fillRect(-1.5, 0, 1.5, 22);

      // Shaft Collar Rings
      ctx.fillStyle = goldDark;
      ctx.fillRect(-4, 0, 8, 2.5);
      ctx.fillRect(-4, 18, 8, 2.5);

      // Antique Key Ward Teeth
      ctx.fillStyle = goldMid;
      ctx.fillRect(2.5, 10, 6, 3.5);
      ctx.fillRect(2.5, 15, 8, 3.5);
      ctx.fillRect(2.5, 20, 5, 2.5);

      ctx.restore();
    },

    /**
     * Renders the Ancient Stone Gate with ashlar masonry, carved runes, creeping ivy,
     * wrought iron gates, and smooth animated outward door opening.
     */
    renderAncientGate(ctx, door) {
      const { x, y, width, height, isOpen, openProgress = (isOpen ? 1 : 0), animTime = 0 } = door;
      const footY = y + height;

      // Heavy Ground Drop Shadow
      DrawUtils.drawDropShadow(ctx, x + width / 2, footY - 4, width * 0.48, 14, 0.45);

      ctx.save();
      ctx.translate(x, y);

      const pillarW = 22;
      const pillarH = height - 12;

      // 1. LEFT STONE PILLAR (Ashlar blocks with carved runes & cracks)
      const stoneGrad = ctx.createLinearGradient(0, 0, pillarW, 0);
      stoneGrad.addColorStop(0, '#334155');
      stoneGrad.addColorStop(0.5, '#64748b');
      stoneGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.roundRect(0, 12, pillarW, pillarH, 4);
      ctx.fill();

      // Stone Block Horizontal Seams
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 32); ctx.lineTo(pillarW, 32);
      ctx.moveTo(0, 52); ctx.lineTo(pillarW, 52);
      ctx.moveTo(0, 72); ctx.lineTo(pillarW, 72);
      ctx.stroke();

      // 2. RIGHT STONE PILLAR
      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.roundRect(width - pillarW, 12, pillarW, pillarH, 4);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width - pillarW, 32); ctx.lineTo(width, 32);
      ctx.moveTo(width - pillarW, 52); ctx.lineTo(width, 52);
      ctx.moveTo(width - pillarW, 72); ctx.lineTo(width, 72);
      ctx.stroke();

      // 3. PILLAR CAPITALS & ORNATE GLOBES
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(-2, 8, pillarW + 4, 8, 2);
      ctx.roundRect(width - pillarW - 2, 8, pillarW + 4, 8, 2);
      ctx.fill();

      // Stone carved globes on tops of pillars
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(pillarW / 2, 6, 8, 0, Math.PI * 2);
      ctx.arc(width - pillarW / 2, 6, 8, 0, Math.PI * 2);
      ctx.fill();

      // 4. ARCH HEADER (Ancient lintel with glowing carved runes)
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(pillarW - 4, 10, width - (pillarW * 2) + 8, 16, 4);
      ctx.fill();

      // Carved Celtic / Runic Symbols along Header
      ctx.strokeStyle = isOpen ? '#38bdf8' : '#fbbf24';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const runeY = 18;
      // Rune 1
      ctx.moveTo(pillarW + 8, runeY - 4); ctx.lineTo(pillarW + 8, runeY + 4);
      ctx.lineTo(pillarW + 14, runeY - 1);
      // Rune 2 (Diamond)
      ctx.moveTo(width / 2, runeY - 4); ctx.lineTo(width / 2 + 5, runeY);
      ctx.lineTo(width / 2, runeY + 4); ctx.lineTo(width / 2 - 5, runeY); ctx.closePath();
      // Rune 3
      ctx.moveTo(width - pillarW - 8, runeY - 4); ctx.lineTo(width - pillarW - 8, runeY + 4);
      ctx.lineTo(width - pillarW - 14, runeY - 1);
      ctx.stroke();

      // 5. CREEPING GREEN IVY VINES CLINGING TO PILLARS
      ctx.fillStyle = '#15803d';
      const ivyLeaves = [
        [4, 28], [12, 38], [6, 48], [14, 62], [5, 74],
        [width - 8, 26], [width - 16, 42], [width - 7, 56], [width - 14, 68]
      ];
      for (const [ix, iy] of ivyLeaves) {
        ctx.beginPath();
        ctx.ellipse(ix, iy, 4, 2.5, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. PORTAL PASSAGE (Inside the arch)
      const gateInnerW = width - (pillarW * 2);
      const gateInnerX = pillarW;
      const gateInnerY = 24;
      const gateInnerH = height - 26;

      if (openProgress > 0) {
        // Glowing Sunny Portal Opening into Area 2 (The Sunny Meadow)
        const portalGrad = ctx.createLinearGradient(0, gateInnerY, 0, gateInnerY + gateInnerH);
        portalGrad.addColorStop(0, '#fef08a'); // Warm celestial sunlight
        portalGrad.addColorStop(0.5, '#4ade80'); // Green meadow shimmer
        portalGrad.addColorStop(1, '#22c55e');
        ctx.fillStyle = portalGrad;
        ctx.fillRect(gateInnerX, gateInnerY, gateInnerW, gateInnerH);

        // Floating portal light particles
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 6; i++) {
          const px = gateInnerX + ((i * 13 + animTime * 20) % gateInnerW);
          const py = gateInnerY + ((i * 17 + animTime * 15) % gateInnerH);
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Dark forest passage beyond closed gate
        ctx.fillStyle = '#09131f';
        ctx.fillRect(gateInnerX, gateInnerY, gateInnerW, gateInnerH);
      }

      // 7. WROUGHT-IRON GATE BARS (Animated swing outward)
      // When closed: bars fill the frame. When open: doors swing to sides.
      const swingAngle = openProgress * (Math.PI / 2.2); // Swing angle from 0 to ~80 deg
      const halfGateW = gateInnerW / 2;

      // Left Iron Gate Wing
      ctx.save();
      ctx.translate(gateInnerX, gateInnerY);
      // Perspective foreshortening during swing
      ctx.transform(Math.cos(swingAngle), 0, -Math.sin(swingAngle) * 0.15, 1, 0, 0);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(0, 0, halfGateW, gateInnerH);

      // Vertical Iron Spindles with Gothic spear tips
      for (let bx = 6; bx < halfGateW - 2; bx += 7) {
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx, gateInnerH);
        ctx.stroke();
        // Spear tip
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(bx - 2, 6); ctx.lineTo(bx + 2, 6); ctx.lineTo(bx, 0); ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Right Iron Gate Wing
      ctx.save();
      ctx.translate(gateInnerX + gateInnerW, gateInnerY);
      ctx.transform(Math.cos(swingAngle), 0, Math.sin(swingAngle) * 0.15, 1, 0, 0);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-halfGateW, 0, halfGateW, gateInnerH);

      for (let bx = -halfGateW + 6; bx < -2; bx += 7) {
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx, gateInnerH);
        ctx.stroke();
        // Spear tip
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(bx - 2, 6); ctx.lineTo(bx + 2, 6); ctx.lineTo(bx, 0); ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 8. HEAVY BRASS PADLOCK (Only when locked)
      if (openProgress < 0.2) {
        const lockX = width / 2;
        const lockY = gateInnerY + gateInnerH * 0.55;

        // Brass Padlock Body
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(lockX - 8, lockY - 4, 16, 18, 3);
        ctx.fill();

        // Shackle
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(lockX, lockY - 4, 5.5, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Keyhole
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(lockX, lockY + 3, 2.5, 0, Math.PI * 2);
        ctx.rect(lockX - 1.5, lockY + 3, 3, 5);
        ctx.fill();
      }

      ctx.restore();
    }
  };

  // =========================================================================
  // 4. ATMOSPHERE & LIGHTING RENDERER (Parallax, God Rays, Canopy Framing)
  // =========================================================================
  const AtmosphereRenderer = {
    /**
     * Renders a multi-layered parallax backdrop behind the playable area.
     */
    renderParallaxBackground(ctx, camX, camY, viewW, viewH) {
      if (root.StoryAssetManager && root.StoryAssetManager.has('bg_forest_canopy')) {
        const bgImg = root.StoryAssetManager.get('bg_forest_canopy');
        if (bgImg) {
          const scale = Math.max(viewW / bgImg.width, viewH / bgImg.height) * 1.25;
          const drawW = bgImg.width * scale;
          const drawH = bgImg.height * scale;
          const paraX = -(camX * 0.22) % drawW;
          const paraY = -(camY * 0.08);

          ctx.drawImage(bgImg, paraX, paraY, drawW, drawH);
          if (paraX + drawW < viewW) {
            ctx.drawImage(bgImg, paraX + drawW, paraY, drawW, drawH);
          }
          return;
        }
      }

      // 1. Storybook Sky Gradient (Morning Cerulean to Soft Cream Sunlight)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
      skyGrad.addColorStop(0, '#0c4a6e');   // Deep storybook blue
      skyGrad.addColorStop(0.4, '#38bdf8'); // Morning cyan
      skyGrad.addColorStop(0.7, '#bae6fd'); // Pale sky
      skyGrad.addColorStop(1, '#fef08a');   // Horizon morning glow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, viewW, viewH);

      // 2. Parallax Mountain Ridge Silhouettes (pans at 0.15x camera speed)
      const paraX = -camX * 0.15;
      ctx.save();
      ctx.fillStyle = '#164e63'; // Atmospheric misty teal mountain
      ctx.beginPath();
      ctx.moveTo(0, viewH);
      for (let x = -100; x < viewW + 200; x += 120) {
        const peakH = 140 + Math.sin((x - paraX) * 0.01) * 60;
        ctx.lineTo(x + (paraX % 120), viewH * 0.5 - peakH);
      }
      ctx.lineTo(viewW, viewH);
      ctx.closePath();
      ctx.fill();

      // 3. Distant Forest Canopy Ridgeline (pans at 0.25x camera speed)
      const paraX2 = -camX * 0.25;
      ctx.fillStyle = '#064e3b'; // Distant dark pine silhouettes
      ctx.beginPath();
      ctx.moveTo(0, viewH);
      for (let x = -60; x < viewW + 120; x += 60) {
        const treePeak = 80 + Math.cos((x - paraX2) * 0.03) * 35;
        ctx.lineTo(x + (paraX2 % 60), viewH * 0.62 - treePeak);
      }
      ctx.lineTo(viewW, viewH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },

    /**
     * Renders diagonal sunlight shafts (God rays) filtering through the canopy.
     */
    renderGodRays(ctx, camX, camY, viewW, viewH, time = 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const numRays = 4;
      for (let i = 0; i < numRays; i++) {
        const pulse = 0.08 + Math.sin(time * 1.5 + i * 1.8) * 0.04;
        const startX = (i * 280) - (camX * 0.1);
        const rayW = 120;

        const rayGrad = ctx.createLinearGradient(startX, 0, startX + 350, viewH);
        rayGrad.addColorStop(0, `rgba(254, 240, 138, ${pulse * 1.4})`);
        rayGrad.addColorStop(0.5, `rgba(254, 240, 138, ${pulse})`);
        rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX + rayW, 0);
        ctx.lineTo(startX + rayW + 400, viewH);
        ctx.lineTo(startX + 400, viewH);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    },

    /**
     * Renders overhanging lush leafy canopy and dangling vine fronds in the foreground.
     */
    renderForegroundCanopy(ctx, camX, camY, viewW, viewH, time = 0) {
      const sway = Math.sin(time * 1.8) * 4;

      ctx.save();
      // Top-Left Overhanging Canopy Vines
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.arc(-20, -20, 180, 0, Math.PI / 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(-10, -10, 140, 0, Math.PI / 2);
      ctx.closePath();
      ctx.fill();

      // Dangling vine fronds with sway
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 20);
      ctx.quadraticCurveTo(85 + sway, 70, 75 + sway, 110);
      ctx.moveTo(140, 10);
      ctx.quadraticCurveTo(150 + sway * 0.7, 50, 145 + sway * 0.7, 85);
      ctx.stroke();

      // Top-Right Overhanging Leaf Domes
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.arc(viewW + 20, -20, 190, Math.PI / 2, Math.PI);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(viewW + 10, -10, 150, Math.PI / 2, Math.PI);
      ctx.closePath();
      ctx.fill();

      // Soft vignette on bottom border for depth
      const botVig = ctx.createLinearGradient(0, viewH - 40, 0, viewH);
      botVig.addColorStop(0, 'rgba(6, 16, 30, 0)');
      botVig.addColorStop(1, 'rgba(6, 16, 30, 0.45)');
      ctx.fillStyle = botVig;
      ctx.fillRect(0, viewH - 40, viewW, 40);

      ctx.restore();
    }
  };

  // Export to global namespace
  root.StoryArt = {
    DrawUtils,
    CharacterRenderer,
    EnvironmentRenderer,
    ObjectRenderer,
    AtmosphereRenderer
  };

})(window);
