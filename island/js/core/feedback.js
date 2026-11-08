/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Game Feel & Rewards (island/js/core/feedback.js)
   - Squash-and-stretch on tap, sparkle bursts, floating "+1 ⭐"
   - Gentle wrong-answer wobble ("Almost! Try again" — zero penalty)
   - Gold Map Stamp fly-to-HUD animation (1/5 -> 5/5)
   - Benbow happy jump & Captain Flint wing flap
   - Chapter 1 Finale: Chest burst open, Map Piece #1, Benbow Sticker,
     and Long John Silver's voiced cliffhanger teaser
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var A = function () { return root.Ch1Audio || {}; };

  function centerOf(el) {
    if (el && typeof el.getBoundingClientRect === 'function') {
      var r = el.getBoundingClientRect();
      if (r.width > 0 || r.height > 0) {
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
    }
    return { x: root.innerWidth / 2, y: root.innerHeight / 2 };
  }

  function squashPop(el) {
    if (!el || !el.animate) return;
    try {
      el.animate([
        { transform: 'scale(1, 1)' },
        { transform: 'scale(1.12, 0.88)' },
        { transform: 'scale(0.95, 1.06)' },
        { transform: 'scale(1, 1)' }
      ], { duration: 320, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
    } catch (e) { /* ignore */ }
  }

  var KENNEY_PARTICLES = [
    'art/kenney/p_star.webp',
    'art/kenney/p_magic.webp',
    'art/kenney/star_gold.webp',
    'art/kenney/p_spark.webp'
  ];

  function sparkleAt(el, count) {
    var pt = centerOf(el);
    var n = count || 16;
    for (var i = 0; i < n; i++) {
      var sp = document.createElement('img');
      sp.className = 'ch1-fx-sparkle';
      sp.src = KENNEY_PARTICLES[i % KENNEY_PARTICLES.length];
      sp.alt = '';
      var sz = 22 + Math.round(Math.random() * 18);
      var angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
      var dist = 46 + Math.random() * 78;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 20;
      sp.style.cssText =
        'position:fixed;z-index:9999;pointer-events:none;width:' + sz + 'px;height:' + sz + 'px;object-fit:contain;' +
        'filter:drop-shadow(0 2px 6px rgba(253,224,71,0.85));' +
        'left:' + Math.round(pt.x) + 'px;top:' + Math.round(pt.y) + 'px;' +
        'transform:translate(-50%,-50%) scale(0.35);opacity:1;transition:transform 0.62s cubic-bezier(.17,.89,.32,1.28), opacity 0.62s ease;';
      document.body.appendChild(sp);
      (function (node, tx, ty) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            node.style.transform = 'translate(calc(-50% + ' + Math.round(tx) + 'px), calc(-50% + ' + Math.round(ty) + 'px)) scale(1.15) rotate(' + Math.round((Math.random() - 0.5) * 90) + 'deg)';
            node.style.opacity = '0';
          });
        });
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 620);
      })(sp, dx, dy);
    }
  }

  function floatStar(el, text, color) {
    var pt = centerOf(el);
    var badge = document.createElement('div');
    badge.className = 'ch1-fx-float';
    badge.textContent = text || '+1 ⭐';
    badge.style.cssText =
      'position:fixed;z-index:9999;pointer-events:none;font:900 1.35rem "Fredoka","Nunito",sans-serif;' +
      'color:' + (color || '#fde047') + ';text-shadow:0 3px 8px rgba(0,0,0,0.85);' +
      'left:' + Math.round(pt.x) + 'px;top:' + Math.round(pt.y - 12) + 'px;' +
      'transform:translate(-50%,-50%) scale(0.7);opacity:1;transition:transform 0.75s cubic-bezier(.17,.89,.32,1.28), opacity 0.75s ease;';
    document.body.appendChild(badge);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        badge.style.transform = 'translate(-50%, -74px) scale(1.15)';
        badge.style.opacity = '0';
      });
    });
    setTimeout(function () { if (badge.parentNode) badge.parentNode.removeChild(badge); }, 800);
  }

  function wiggleWrong(el, hintText) {
    if (A().sfxWrong) A().sfxWrong();
    if (el) {
      el.classList.remove('ch1-wobble');
      void el.offsetWidth;
      el.classList.add('ch1-wobble');
      setTimeout(function () { el.classList.remove('ch1-wobble'); }, 520);
    }
    var banner = document.getElementById('ch1-feedback-banner');
    if (banner) {
      banner.innerHTML = '💡 <b>Almost! Try again!</b> ' + (hintText ? '<span>' + hintText + '</span>' : '');
      banner.className = 'ch1-feedback-banner hint on';
    }
  }

  function showRightBanner(msg) {
    var banner = document.getElementById('ch1-feedback-banner');
    if (banner) {
      banner.innerHTML = '🌟 <b>' + (msg || 'Great job!') + '</b>';
      banner.className = 'ch1-feedback-banner ok on';
    }
  }

  function benbowJump() {
    var b = document.querySelector('.ch1-npc-benbow, .ch1-actor-benbow');
    if (b && b.animate) {
      try {
        b.animate([
          { transform: 'translateY(0) scale(1)' },
          { transform: 'translateY(-18px) scale(1.08)' },
          { transform: 'translateY(0) scale(0.95, 1.05)' },
          { transform: 'translateY(-10px) scale(1.04)' },
          { transform: 'translateY(0) scale(1)' }
        ], { duration: 540, easing: 'ease-out' });
      } catch (e) { /* ignore */ }
    }
  }

  function flintFlap() {
    var f = document.querySelector('.ch1-npc-flint, .ch1-actor-flint');
    if (f && f.animate) {
      try {
        f.animate([
          { transform: 'translateY(0) rotate(0deg)' },
          { transform: 'translateY(-14px) rotate(-10deg) scale(1.1)' },
          { transform: 'translateY(-6px) rotate(10deg) scale(1.08)' },
          { transform: 'translateY(0) rotate(0deg) scale(1)' }
        ], { duration: 480, easing: 'ease-in-out' });
      } catch (e) { /* ignore */ }
    }
  }

  function flyStampToHud(fromEl, stopNum, onDone) {
    if (A().sfxStamp) A().sfxStamp();
    var start = centerOf(fromEl);
    var targetSlot = document.getElementById('ch1-stamp-slot-' + stopNum);
    var end = targetSlot ? centerOf(targetSlot) : { x: root.innerWidth / 2, y: 36 };

    var fly = document.createElement('div');
    fly.className = 'ch1-flying-stamp';
    fly.innerHTML = '<img src="art/flat/o_map_stamp.webp" onerror="this.src=\'art/flat/o_compass.webp\'" alt="Golden Map Stamp">';
    fly.style.cssText =
      'position:fixed;z-index:10000;pointer-events:none;width:72px;height:72px;' +
      'left:' + Math.round(start.x) + 'px;top:' + Math.round(start.y) + 'px;' +
      'transform:translate(-50%,-50%) scale(0.4) rotate(-25deg);' +
      'filter:drop-shadow(0 8px 18px rgba(245,158,11,0.85));' +
      'transition:left 0.72s cubic-bezier(.22,1,.36,1), top 0.72s cubic-bezier(.22,1,.36,1), transform 0.72s cubic-bezier(.17,.89,.32,1.28), opacity 0.25s ease;';
    fly.querySelector('img').style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
    document.body.appendChild(fly);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fly.style.transform = 'translate(-50%,-50%) scale(1.35) rotate(0deg)';
        setTimeout(function () {
          fly.style.left = Math.round(end.x) + 'px';
          fly.style.top = Math.round(end.y) + 'px';
          fly.style.transform = 'translate(-50%,-50%) scale(0.55) rotate(360deg)';
        }, 180);
      });
    });

    setTimeout(function () {
      if (targetSlot) {
        targetSlot.classList.add('earned', 'pop');
        sparkleAt(targetSlot, 10);
        setTimeout(function () { targetSlot.classList.remove('pop'); }, 500);
      }
      if (fly.parentNode) fly.parentNode.removeChild(fly);
      if (onDone) onDone();
    }, 920);
  }

  function playChestFinale(onDone) {
    if (A().sfxChestOpen) A().sfxChestOpen();
    var overlay = document.createElement('div');
    overlay.id = 'ch1-finale-overlay';
    overlay.className = 'ch1-finale-overlay';
    overlay.innerHTML =
      '<div class="ch1-finale-card" role="dialog" aria-label="Chapter 1 Complete!">' +
        '<div class="ch1-finale-rays"></div>' +
        '<div class="ch1-finale-step" id="ch1-fin-step1">' +
          '<div class="ch1-finale-badge">🏴‍☠️ CHAPTER 1 COMPLETE · 5 / 5 STAMPS!</div>' +
          '<h2 class="ch1-finale-title">Billy Bones\'s Sea Chest Bursts Open!</h2>' +
          '<div class="ch1-finale-loot-row">' +
            '<div class="ch1-loot-item">' +
              '<img src="art/flat/o_chest_open.webp" onerror="this.src=\'art/flat/o_treasure_gold.webp\'" alt="Open Sea Chest">' +
              '<span>Billy\'s Chest Unlocked!</span>' +
            '</div>' +
            '<div class="ch1-loot-item highlight">' +
              '<img src="art/flat/o_map_piece1.webp" onerror="this.src=\'art/flat/o_map_scroll.webp\'" alt="Map Piece #1">' +
              '<span>🗺️ Map Piece #1 Found!</span>' +
            '</div>' +
            '<div class="ch1-loot-item">' +
              '<img src="art/flat/c_benbow_happy.webp" alt="Benbow the Leopard Sticker">' +
              '<span>🐆 Benbow Sticker Earned!</span>' +
            '</div>' +
          '</div>' +
          '<p class="ch1-finale-msg">"Shiver me timbers! You solved all five harbour clues and found Captain Flint\'s first map piece!"</p>' +
          '<div class="ch1-finale-actions">' +
            '<button type="button" class="ch1-btn gold" id="ch1-fin-next" aria-label="Next: Who is at the dock?">Next: Who is at the Dock? ▶</button>' +
          '</div>' +
        '</div>' +
        '<div class="ch1-finale-step" id="ch1-fin-step2" hidden>' +
          '<div class="ch1-finale-badgeamber">⚓ LONG JOHN SILVER APPEARS!</div>' +
          '<div class="ch1-silver-stage">' +
            '<img src="art/flat/c_silver_happy.webp" class="ch1-silver-art" alt="Long John Silver">' +
            '<div class="ch1-silver-bubble">' +
              '<b>Long John Silver</b>' +
              '<p id="ch1-silver-line">"Ahoy, young Captain! You found Map Piece Number One... but I know where the second piece is hidden on Spyglass Shore! See you aboard the Hispaniola!"</p>' +
              '<button type="button" class="ch1-btn cyan sm" id="ch1-silver-replay" aria-label="Listen again">🔊 Listen Again</button>' +
            '</div>' +
          '</div>' +
          '<div class="ch1-finale-actions">' +
            '<button type="button" class="ch1-btn emerald" id="ch1-fin-done" aria-label="Finish Chapter 1">🎉 Claim Rewards &amp; Return to Harbour ✓</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    sparkleAt(overlay.querySelector('.ch1-finale-card'), 22);

    if (A().speak) {
      A().speak('Hooray! Billy Bones\'s sea chest bursts open! You found Map Piece Number One and earned the Benbow leopard sticker!', { lineId: 'ch1_finale_billy' });
    }

    var silverLine = 'Ahoy, young Captain! You found Map Piece Number One, but I know where the second piece is hidden on Spyglass Shore! See you aboard the Hispaniola!';
    var nextBtn = document.getElementById('ch1-fin-next');
    if (nextBtn) {
      nextBtn.onclick = function () {
        if (A().sfxTap) A().sfxTap();
        document.getElementById('ch1-fin-step1').hidden = true;
        document.getElementById('ch1-fin-step2').hidden = false;
        if (A().sfxFanfare) A().sfxFanfare();
        if (A().speak) A().speak(silverLine, { lineId: 'ch1_finale_silver' });
      };
    }
    var replayBtn = document.getElementById('ch1-silver-replay');
    if (replayBtn) {
      replayBtn.onclick = function () {
        if (A().speak) A().speak(silverLine, { lineId: 'ch1_finale_silver' });
      };
    }
    var doneBtn = document.getElementById('ch1-fin-done');
    if (doneBtn) {
      doneBtn.onclick = function () {
        if (A().sfxCorrect) A().sfxCorrect();
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (onDone) onDone();
      };
    }
  }

  root.Ch1Feedback = {
    squashPop: squashPop,
    sparkleAt: sparkleAt,
    floatStar: floatStar,
    wiggleWrong: wiggleWrong,
    showRightBanner: showRightBanner,
    benbowJump: benbowJump,
    flintFlap: flintFlap,
    flyStampToHud: flyStampToHud,
    playChestFinale: playChestFinale
  };
})(typeof window !== 'undefined' ? window : this);
