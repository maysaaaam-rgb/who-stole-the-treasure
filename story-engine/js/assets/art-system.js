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
    renderNPC(ctx, npc) {
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
     * Renders detailed multi-tiered trees with textured gnarled trunks and wind-swayed foliage.
     */
    renderTree(ctx, x, y, width, height, type = 'oak', time = 0) {
      const centerX = x + width / 2;
      const footY = y + height;
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
