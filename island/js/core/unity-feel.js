/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Unity Engine Feel, SceneDirector, Cinema & Games Hub
   (island/js/core/unity-feel.js)
   - `window.UnityFeel`: 2.5D perspective depth scaling, smooth WASD/Arrow + Click movement,
     footstep dust puffs, coin-to-HUD fountain, live outfit sprite re-baking, unified HUD
   - `window.SceneDirector`: Seamless routing across Ch.1 Harbour (`z=1`), Ch.2 Hispaniola Bay (`z=2`),
     Home Island Cabin & Builder (`z=0`), Ch.3 Stockade Forest (`z=3`), and Ch.4 Skull Peak (`z=4`)
   - `window.IslandCinema`: 6 HD 2.5D animated MP4 films with neural narration & chapter jump
   - `window.IslandGamesHub`: Football, Beach Volleyball, Friendly Word Battles, Cabin Decorator,
     Message-in-a-Bottle Global Reading Riddles, Sticker Log, and Class Plaza
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var activeZone = 1;
  var dressHooked = false;
  var dressListeners = [];
  var heldKeys = {};
  var keyListenersInstalled = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&quot;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getSession() {
    var st = root.IslandApp && typeof root.IslandApp.state === 'function' ? root.IslandApp.state() : null;
    return (st && st.session) || {};
  }

  function getLevelAndCoins() {
    var thr = root.EAA_EVOLUTION_XP || [0, 30, 200, 500, 1000, 2000, 3500];
    var xp = 0;
    try { xp = root.IslandApp && root.IslandApp.getEffectiveXP ? root.IslandApp.getEffectiveXP() : 0; } catch (e) { xp = 0; }
    var lvl = 1;
    for (var i = 0; i < thr.length; i++) if (xp >= thr[i]) lvl = i + 1;
    var coins = (root.IslandShop && root.IslandShop.getCoins) ? root.IslandShop.getCoins() : 130;
    return { level: lvl, xp: xp, coins: coins };
  }

  /* ── 1. 2.5D Y-Depth Perspective Scaling ── */
  function perspectiveScale(y, minY, maxY, minS, maxS) {
    var y0 = minY != null ? minY : 330;
    var y1 = maxY != null ? maxY : 780;
    var s0 = minS != null ? minS : 0.62;
    var s1 = maxS != null ? maxS : 1.04;
    var t = Math.max(0, Math.min(1, (Number(y) - y0) / Math.max(1, y1 - y0)));
    return s0 + (s1 - s0) * t;
  }

  /* ── 2. Footstep Dust Puff & Coin Arc Fountain Juice ── */
  function spawnDustPuff(stageEl, xPct, yPct) {
    if (!stageEl) return;
    var d = document.createElement('div');
    d.className = 'uf-dust-puff';
    d.style.left = xPct.toFixed(2) + '%';
    d.style.top = yPct.toFixed(2) + '%';
    stageEl.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 580);
  }

  function flyCoinsToHud(amount, fromX, fromY) {
    var target = document.querySelector('.uf-coin-pill') || document.getElementById('w-status');
    var tx = root.innerWidth * 0.14;
    var ty = 32;
    if (target) {
      var r = target.getBoundingClientRect();
      if (r.width > 0) {
        tx = r.left + r.width * 0.5;
        ty = r.top + r.height * 0.5;
      }
    }
    var sx = fromX != null ? fromX : root.innerWidth * 0.5;
    var sy = fromY != null ? fromY : root.innerHeight * 0.52;
    var n = Math.max(3, Math.min(8, Math.round((Number(amount) || 15) / 3)));

    for (var i = 0; i < n; i++) {
      (function (idx) {
        setTimeout(function () {
          var el = document.createElement('div');
          el.className = 'uf-fly-coin';
          el.textContent = '🪙';
          var jx = sx + (Math.random() - 0.5) * 64;
          var jy = sy + (Math.random() - 0.5) * 44;
          el.style.left = Math.round(jx) + 'px';
          el.style.top = Math.round(jy) + 'px';
          document.body.appendChild(el);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              el.style.left = Math.round(tx) + 'px';
              el.style.top = Math.round(ty) + 'px';
              el.style.transform = 'scale(0.55)';
              el.style.opacity = '0.35';
            });
          });
          setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
            if (idx === n - 1) {
              if (root.Ch1Audio && root.Ch1Audio.sfxCoin) root.Ch1Audio.sfxCoin();
              refreshAllUnifiedHuds(true);
            }
          }, 700);
        }, idx * 70);
      })(i);
    }
  }

  /* ── 3. Keyboard WASD / Arrow Vector Helper for Painted Worlds ── */
  function ensureKeyboard() {
    if (keyListenersInstalled || typeof window === 'undefined') return;
    keyListenersInstalled = true;
    root.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      heldKeys[e.code] = true;
    });
    root.addEventListener('keyup', function (e) {
      heldKeys[e.code] = false;
    });
    root.addEventListener('blur', function () {
      heldKeys = {};
    });
  }

  function getKeyboardInput() {
    ensureKeyboard();
    var modalOpen = !!(
      (document.getElementById('isl-modal-root') && document.getElementById('isl-modal-root').children.length) ||
      document.getElementById('ch1-modal') ||
      document.getElementById('ch1-modal-backdrop') ||
      document.getElementById('hb-scene') ||
      document.getElementById('ch2-scene') ||
      document.querySelector('#hb-game.on, #ch2-game.on, #hb-cutscene.on, #ch2-cutscene.on')
    );
    if (modalOpen) return { vx: 0, vy: 0 };
    var vx = ((heldKeys.ArrowRight || heldKeys.KeyD) ? 1 : 0) - ((heldKeys.ArrowLeft || heldKeys.KeyA) ? 1 : 0);
    var vy = ((heldKeys.ArrowDown || heldKeys.KeyS) ? 1 : 0) - ((heldKeys.ArrowUp || heldKeys.KeyW) ? 1 : 0);
    if (vx && vy) {
      vx *= 0.7071;
      vy *= 0.7071;
    }
    return { vx: vx, vy: vy };
  }

  /* ── 4. Live Outfit Re-Bake Subscription ── */
  function onLookChanged(fn) {
    if (typeof fn === 'function' && dressListeners.indexOf(fn) === -1) {
      dressListeners.push(fn);
    }
    hookDressEvents();
  }

  function notifyLookChanged() {
    refreshAllUnifiedHuds(false);
    dressListeners.forEach(function (fn) {
      try { fn(); } catch (e) { /* ignore */ }
    });
    if (root.WORLD && typeof root.WORLD.onSessionChanged === 'function') {
      try { root.WORLD.onSessionChanged(); } catch (e) { /* ignore */ }
    }
  }

  function hookDressEvents() {
    if (dressHooked || !root.IslandApp) return;
    dressHooked = true;
    ['selectDressItem', 'saveDressLook', 'switchDemo'].forEach(function (m) {
      var orig = root.IslandApp[m];
      if (typeof orig === 'function' && !orig.__ufWrapped) {
        var wrapped = function () {
          var res = orig.apply(this, arguments);
          setTimeout(notifyLookChanged, 90);
          return res;
        };
        wrapped.__ufWrapped = true;
        root.IslandApp[m] = wrapped;
      }
    });
  }

  /* ── 5. Unified HUD Renderer for Chapter 1 & Chapter 2 ── */
  var registeredHuds = {};

  function mountUnifiedHud(hostEl, cfg) {
    if (!hostEl) return;
    hookDressEvents();
    registeredHuds[cfg.chapter] = { host: hostEl, cfg: cfg };
    renderHudInto(hostEl, cfg, false);
  }

  function refreshAllUnifiedHuds(popCoins) {
    Object.keys(registeredHuds).forEach(function (k) {
      var item = registeredHuds[k];
      if (item && item.host && document.body.contains(item.host)) {
        renderHudInto(item.host, item.cfg, popCoins);
      }
    });
    if (root.WorldGame && root.WorldGame.updateStatusHud) {
      root.WorldGame.updateStatusHud(popCoins);
    }
  }

  function renderHudInto(hostEl, cfg, popCoins) {
    var ch = cfg.chapter || 1;
    var prog = ch === 2 ? root.Ch2Progress : root.Ch1Progress;
    var g = prog ? prog.getActiveGrade() : 3;
    var starMode = prog && prog.isStarPreferred ? prog.isStarPreferred() : false;
    var stats = getLevelAndCoins();
    var ses = getSession();
    var muted = root.Ch1Audio && root.Ch1Audio.isMuted ? root.Ch1Audio.isMuted() : false;
    var nextStop = prog ? prog.getNextStop(g) : 1;

    var stampsHtml = '';
    for (var i = 1; i <= 5; i++) {
      var st = prog ? prog.getClueStars(g, i) : 0;
      var cls = st > 0 ? 'done' : (i === nextStop ? 'next' : '');
      var starTiny = st > 0 ? ('<em>' + '★'.repeat(st) + '</em>') : '';
      stampsHtml +=
        '<button type="button" class="uf-stamp-slot ' + cls + '" data-stop="' + i + '" title="Stop ' + i + (st > 0 ? ' (' + st + ' stars)' : '') + '">' +
          (st > 0 ? '✓' : i) + starTiny +
        '</button>';
    }

    var unitSubtitle = ch === 1
      ? (g === 4 ? 'G4 Unit 1 · I Love Reading' : 'G3 Unit 1 · What Does It Do?')
      : (g === 4 ? 'G4 Unit 2 · What Lives Here?' : 'G3 Unit 2 · Thank You');

    var gradeSwitchHtml = '';
    if (!ses || ses.isDemo !== false) {
      gradeSwitchHtml =
        '<div class="uf-grade-switch" title="Switch Grade / Star Mode">' +
          '<button type="button" class="uf-grade-pill ' + (g === 3 && !starMode ? 'on' : '') + '" data-gmode="g3">G3</button>' +
          '<button type="button" class="uf-grade-pill ' + (g === 4 && !starMode ? 'on' : '') + '" data-gmode="g4">G4</button>' +
          '<button type="button" class="uf-grade-pill ' + (starMode ? 'star-on' : '') + '" data-gmode="star">⭐ Star</button>' +
        '</div>';
    }

    var findsCount = typeof cfg.getFindsCount === 'function' ? cfg.getFindsCount() : 0;
    var findsMax = cfg.findsMax || 5;
    var camOverview = typeof cfg.isOverview === 'function' ? cfg.isOverview() : false;

    hostEl.innerHTML =
      '<div class="uf-hud-bar">' +
        '<div class="uf-hud-cluster">' +
          '<button type="button" class="uf-btn cyan" data-uf-act="map" title="Open Grand Sea Chart">' +
            '🗺️ <span class="uf-lbl">Sea Chart</span>' +
          '</button>' +
          '<button type="button" class="uf-coin-pill' + (popCoins ? ' pop' : '') + '" data-uf-act="store" title="Open Island Store">' +
            '<span class="uf-lvl-tag">Lv.' + stats.level + '</span>' +
            '<span>🪙 ' + stats.coins + '</span>' +
          '</button>' +
          gradeSwitchHtml +
        '</div>' +

        '<div class="uf-center-strip">' +
          '<div class="uf-ch-title">' +
            '<b>' + esc(cfg.title || ('Chapter ' + ch)) + '</b>' +
            '<small>' + esc(unitSubtitle) + '</small>' +
          '</div>' +
          '<div class="uf-stamps-row">' + stampsHtml + '</div>' +
        '</div>' +

        '<div class="uf-hud-cluster">' +
          '<button type="button" class="uf-btn" data-uf-act="finds" title="Hidden Treasures Found">' +
            (ch === 2 ? '🐚 ' : '🦀 ') + findsCount + '/' + findsMax +
          '</button>' +
          '<button type="button" class="uf-btn unity-hud-mute" data-uf-act="mute" title="Sound On/Off">' +
            (muted ? '🔇' : '🔊') +
          '</button>' +
        '</div>' +
      '</div>' +

      '<div class="uf-bottom-dock">' +
        '<button type="button" class="uf-btn coral" data-uf-act="cinema" title="Watch Story & Reading Videos">🎬 <span class="uf-lbl">Videos</span></button>' +
        '<button type="button" class="uf-btn amber" data-uf-act="store" title="Island Store">🛒 <span class="uf-lbl">Store</span></button>' +
        '<button type="button" class="uf-btn violet" data-uf-act="look" title="Monster Dressing Room">👕 <span class="uf-lbl">Look</span></button>' +
        '<button type="button" class="uf-btn emerald" data-uf-act="games" title="Football, Volleyball, Battles & Cabin">🎮 <span class="uf-lbl">Games</span></button>' +
        '<button type="button" class="uf-btn" data-uf-act="cam" title="Toggle Camera View">' + (camOverview ? '🔍' : '🗺️') + '</button>' +
      '</div>';

    // Wire events cleanly
    hostEl.querySelectorAll('[data-uf-act]').forEach(function (btn) {
      btn.onclick = function (ev) {
        ev.stopPropagation();
        if (root.Ch1Audio) root.Ch1Audio.sfxTap();
        var act = btn.getAttribute('data-uf-act');
        if (act === 'map') {
          if (root.WorldGame && root.WorldGame.openWorldMap) root.WorldGame.openWorldMap();
        } else if (act === 'store') {
          if (root.IslandShop && root.IslandShop.open) root.IslandShop.open();
        } else if (act === 'look') {
          if (root.IslandApp && root.IslandApp.openDressingRoom) root.IslandApp.openDressingRoom();
        } else if (act === 'cinema') {
          openCinema(ch === 2 ? (g === 4 ? 'vid_g4_u2' : 'vid_g3_u2') : (g === 4 ? 'vid_g4_u1' : 'vid_g3_u1'));
        } else if (act === 'games') {
          openGamesHub();
        } else if (act === 'mute') {
          if (root.Ch1Audio) root.Ch1Audio.toggleMute();
          refreshAllUnifiedHuds(false);
        } else if (act === 'cam') {
          if (typeof cfg.onToggleCam === 'function') cfg.onToggleCam();
          renderHudInto(hostEl, cfg, false);
        } else if (act === 'finds') {
          if (typeof cfg.onTapFinds === 'function') cfg.onTapFinds();
        }
      };
    });

    hostEl.querySelectorAll('.uf-stamp-slot').forEach(function (slot) {
      slot.onclick = function (ev) {
        ev.stopPropagation();
        if (root.Ch1Audio) root.Ch1Audio.sfxTap();
        var n = Number(slot.getAttribute('data-stop')) || 1;
        if (typeof cfg.onSelectStop === 'function') cfg.onSelectStop(n);
      };
    });

    hostEl.querySelectorAll('[data-gmode]').forEach(function (gp) {
      gp.onclick = function (ev) {
        ev.stopPropagation();
        if (root.Ch1Audio) root.Ch1Audio.sfxTap();
        var gm = gp.getAttribute('data-gmode');
        if (gm === 'g3') {
          if (root.Ch1Progress) { root.Ch1Progress.setActiveGrade(3); root.Ch1Progress.setStarPreferred(false); }
          if (root.WorldGame && root.WorldGame.switchDemoPupil) root.WorldGame.switchDemoPupil('demo-g3');
        } else if (gm === 'g4') {
          if (root.Ch1Progress) { root.Ch1Progress.setActiveGrade(4); root.Ch1Progress.setStarPreferred(false); }
          if (root.WorldGame && root.WorldGame.switchDemoPupil) root.WorldGame.switchDemoPupil('demo-g4');
        } else if (gm === 'star') {
          var nextStar = !(prog && prog.isStarPreferred && prog.isStarPreferred());
          if (root.Ch1Progress) root.Ch1Progress.setStarPreferred(nextStar);
        }
        if (typeof cfg.onModeChanged === 'function') cfg.onModeChanged();
        setTimeout(function () { refreshAllUnifiedHuds(false); }, 120);
      };
    });
  }

  /* ── 6. Off-Screen Wayfinder Helper ── */
  function updateWayfinder(el, camState, targetPt, labelText) {
    if (!el) return;
    if (!camState || !targetPt || camState.overview) {
      el.hidden = true;
      return;
    }
    var vw = root.innerWidth, vh = root.innerHeight;
    // Convert stage coords (0..W, 0..H) to screen coords given transform: translate(tx, ty) scale(z)
    var sx = targetPt.screenX;
    var sy = targetPt.screenY;
    var marginX = 56, marginTop = 86, marginBot = 78;
    if (sx >= marginX && sx <= vw - marginX && sy >= marginTop && sy <= vh - marginBot) {
      el.hidden = true;
      return;
    }
    var cx = Math.max(96, Math.min(vw - 96, sx));
    var cy = Math.max(96, Math.min(vh - 88, sy));
    var arrow = sx > vw - marginX ? ' ➔' : (sx < marginX ? '⬅ ' : (sy < marginTop ? '⬆ ' : '⬇ '));
    var txt = labelText || 'Next Clue';
    el.textContent = sx < marginX ? (arrow + '🧭 ' + txt) : ('🧭 ' + txt + arrow);
    el.style.left = Math.round(cx) + 'px';
    el.style.top = Math.round(cy) + 'px';
    el.hidden = false;
  }

  /* ── 7. SceneDirector: Seamless Switching Across Painted Chapters & Phaser Sandbox ── */
  function hidePaintedWorlds() {
    var hb = document.getElementById('hb-root');
    if (hb) {
      hb.style.display = 'none';
      if (root.Harbour && typeof root.Harbour.pause === 'function') root.Harbour.pause();
    }
    var ch2 = document.getElementById('ch2-root');
    if (ch2) {
      ch2.style.display = 'none';
      if (root.BayWorld && typeof root.BayWorld.pause === 'function') root.BayWorld.pause();
    }
  }

  function hidePhaserWorld() {
    document.body.classList.remove('w-on');
    var ld = document.getElementById('w-load');
    if (ld) ld.classList.remove('on');
    if (root.WORLD && root.WORLD.game && root.WORLD.game.loop) {
      try { root.WORLD.game.loop.sleep(); } catch (e) { /* ignore */ }
    }
  }

  function goZone(zoneNum, opts) {
    opts = opts || {};
    var z = Number(zoneNum);
    if (isNaN(z)) z = 1;
    activeZone = z;

    var modalRoot = document.getElementById('isl-modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
    document.body.classList.remove('isl-modal-open');

    // Chapters 1 & 2 run in the real free-roam game engine (js/realgame/rg-engine.js) unless ?classic=1
    if ((z === 1 || z === 2) && root.RealIsland && root.RealIsland.enabled()) {
      hidePhaserWorld();
      var hbR = document.getElementById('hb-root');
      if (hbR) { hbR.style.display = 'none'; if (root.Harbour && typeof root.Harbour.pause === 'function') root.Harbour.pause(); }
      var ch2R = document.getElementById('ch2-root');
      if (ch2R) { ch2R.style.display = 'none'; if (root.BayWorld && typeof root.BayWorld.pause === 'function') root.BayWorld.pause(); }
      root.RealIsland.start(z, opts);
      return;
    }
    if (root.RealIsland && typeof root.RealIsland.pause === 'function') root.RealIsland.pause();

    if (z === 1 && root.Harbour) {
      hidePhaserWorld();
      var ch2 = document.getElementById('ch2-root');
      if (ch2) {
        ch2.style.display = 'none';
        if (root.BayWorld && typeof root.BayWorld.pause === 'function') root.BayWorld.pause();
      }
      var hb = document.getElementById('hb-root');
      if (hb) hb.style.display = '';
      root.Harbour.start();
      if (opts.stopNum && root.Harbour.walkToStop) {
        setTimeout(function () { root.Harbour.walkToStop(opts.stopNum); }, 180);
      }
      return;
    }

    if (z === 2 && root.BayWorld) {
      hidePhaserWorld();
      var hb2 = document.getElementById('hb-root');
      if (hb2) {
        hb2.style.display = 'none';
        if (root.Harbour && typeof root.Harbour.pause === 'function') root.Harbour.pause();
      }
      var ch2El = document.getElementById('ch2-root');
      if (ch2El) ch2El.style.display = '';
      root.BayWorld.start(opts);
      return;
    }

    // Zones 0 (Captain's Cabin & Yard), 3 (Stockade Forest), 4 (Skull Peak) run in Phaser WORLD!
    hidePaintedWorlds();
    document.body.classList.add('w-on');
    if (root.WORLD) {
      if (root.WORLD.game && root.WORLD.game.loop) {
        try { root.WORLD.game.loop.wake(); } catch (e) { /* ignore */ }
      }
      if (typeof root.WORLD.bootOrGoZone === 'function') {
        root.WORLD.bootOrGoZone(z, opts.inHouse);
      } else if (root.WORLD.scene && root.WORLD.scene()) {
        root.WORLD.goZone(z, 0, !!opts.inHouse);
      }
    }
  }

  /* ── 8. Island Cinema (`🎬 Videos & Story`) ── */
  var VIDEOS = [
    {
      id: 'vid_ti_intro',
      title: '🏴‍☠️ Treasure Island Voyage: The Torn Map',
      badge: 'Story Intro',
      src: 'videos/vid_ti_intro.mp4',
      thumb: 'art/ch1/bg_benbow_empty.webp',
      zone: 1,
      vo: 'Welcome aboard, Explorer! At Admiral Benbow Harbour, Jim Hawkins and baby leopard Benbow found Captain Flint\'s torn treasure map. Solve the five Global Reading clues to set sail!'
    },
    {
      id: 'vid_g3_u1',
      title: '⚙️ G3 Unit 1: What Does It Do? (Clara\'s Machine)',
      badge: 'Grade 3 · Ch. 1',
      src: 'videos/vid_g3_u1.mp4',
      thumb: 'art/z1/s_clara_machine.webp',
      zone: 1,
      grade: 3,
      vo: 'Clara Doodle invented a clever machine to clean her messy room! First, draw a plan. Second, build it. If it does not work, change your plan and try again!'
    },
    {
      id: 'vid_g4_u1',
      title: '📚 G4 Unit 1: I Love Reading (Alice & Your Brain)',
      badge: 'Grade 4 · Ch. 1',
      src: 'videos/vid_g4_u1.mp4',
      thumb: 'art/z1/s_visualize_read.webp',
      zone: 1,
      grade: 4,
      vo: 'Alice chased a White Rabbit in a waistcoat down a deep rabbit hole lined with bookshelves! Reading gives your brain lobes a superpower workout and connects glowing cell fibers!'
    },
    {
      id: 'vid_ch2_sail',
      title: '⛵ Voyage of the Hispaniola to Lighthouse Cove!',
      badge: 'Ch. 1 → Ch. 2',
      src: 'videos/vid_ch2_sail.mp4',
      thumb: 'art/ch2/bg_ch2_bay.webp',
      zone: 2,
      vo: 'Anchors aweigh! Sail aboard the Hispaniola across turquoise waves to Lighthouse Cove, where Long John Silver and Lulu the otter guard Map Piece Two!'
    },
    {
      id: 'vid_g3_u2',
      title: '🌕 G3 Unit 2: Thank You! (Harvest Moon & Mars Farm)',
      badge: 'Grade 3 · Ch. 2',
      src: 'videos/vid_g3_u2.mp4',
      thumb: 'art/ch2/bg_ch2_s2_moon.webp',
      zone: 2,
      grade: 3,
      vo: 'Under the bright full harvest moon, families share sweet songpyeon rice cakes, weave colourful cloth, pick fresh potatoes, and say what they are thankful for!'
    },
    {
      id: 'vid_g4_u2',
      title: '🌲 G4 Unit 2: What Lives Here? (Two Forests & Swallow)',
      badge: 'Grade 4 · Ch. 2',
      src: 'videos/vid_g4_u2.mp4',
      thumb: 'art/ch2/bg_ch2_s3_forest.webp',
      zone: 2,
      grade: 4,
      vo: 'Explore golden deciduous trees and snowy evergreen coniferous pines where animals adapt and hibernate! Then help a kind swallow heal its wing to receive a magical golden seed!'
    }
  ];

  var currentVidId = 'vid_ti_intro';

  function openCinema(selectId) {
    if (selectId) currentVidId = selectId;
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    document.body.classList.add('isl-modal-open');
    renderCinemaModal();
  }

  function renderCinemaModal() {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    var cur = VIDEOS.filter(function (v) { return v.id === currentVidId; })[0] || VIDEOS[0];

    var listHtml = VIDEOS.map(function (v) {
      var isAct = v.id === cur.id;
      return (
        '<button type="button" class="uf-vid-card' + (isAct ? ' active' : '') + '" onclick="IslandCinema.select(\'' + v.id + '\')">' +
          '<img class="uf-vid-thumb" src="' + esc(v.thumb) + '" alt="">' +
          '<div style="min-width:0">' +
            '<div style="font-size:0.74rem;font-weight:800;color:#38bdf8">' + esc(v.badge) + '</div>' +
            '<div style="font-size:0.94rem;font-weight:800;color:#fff;line-height:1.2">' + esc(v.title) + '</div>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="uf-cinema-backdrop">' +
        '<div class="isl-card-modal uf-cinema-modal">' +
          '<div class="isl-mission-top">' +
            '<div style="font-size:1.38rem;font-weight:800;color:#fde047">🎬 Island Story & Global Reading Cinema</div>' +
            '<button type="button" class="isl-btn" style="margin-left:auto;min-height:44px;min-width:44px;padding:6px 12px" onclick="IslandCinema.close()">✕</button>' +
          '</div>' +
          '<div class="uf-cinema-layout">' +
            '<div class="uf-video-stage">' +
              '<video id="uf-cinema-player" src="' + esc(cur.src) + '" poster="' + esc(cur.thumb) + '" controls autoplay playsinline></video>' +
              '<div class="uf-video-caption-tray">' +
                '<div style="font-size:1.15rem;font-weight:800;color:#fde047">' + esc(cur.title) + '</div>' +
                '<div style="font-size:0.98rem;color:#e2e8f0;line-height:1.38">' + esc(cur.vo) + '</div>' +
                '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">' +
                  '<button type="button" class="isl-btn amber" style="min-height:44px;padding:6px 14px;font-size:0.95rem" onclick="IslandCinema.narrate()">🔊 Read Story Aloud</button>' +
                  '<button type="button" class="isl-btn emerald" style="min-height:44px;padding:6px 16px;font-size:0.95rem" onclick="IslandCinema.playZone(' + cur.zone + ',' + (cur.grade || 0) + ')">⛵ Play Chapter ' + cur.zone + ' Now!</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="uf-video-playlist">' + listHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (root.Ch1Audio) {
      root.Ch1Audio.speak(cur.vo);
    }
  }

  function selectCinemaVideo(id) {
    if (root.Ch1Audio) root.Ch1Audio.sfxTap();
    currentVidId = id;
    renderCinemaModal();
  }

  function narrateCinemaVideo() {
    var cur = VIDEOS.filter(function (v) { return v.id === currentVidId; })[0] || VIDEOS[0];
    if (root.Ch1Audio) root.Ch1Audio.speak(cur.vo);
  }

  function closeCinema() {
    if (root.Ch1Audio) {
      root.Ch1Audio.sfxTap();
      root.Ch1Audio.stopVoice();
    }
    var modalRoot = document.getElementById('isl-modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
    document.body.classList.remove('isl-modal-open');
  }

  function playZoneFromCinema(z, gradeOpt) {
    closeCinema();
    if (gradeOpt === 3 || gradeOpt === 4) {
      if (root.Ch1Progress) root.Ch1Progress.setActiveGrade(gradeOpt);
    }
    goZone(z);
  }

  /* ── 9. Island Games & Arcade Hub (`🎮 Games`) + Message-in-a-Bottle Riddles ── */
  var BOTTLE_RIDDLES = [
    { q: 'Clara made a clever room-cleaning invention. If an invention fails, what should you do?', a: 'Change your plan and try again!', opts: ['Change your plan and try again!', 'Throw the book in the sea!', 'Go to sleep all day!'], speak: 'Change your plan and try again!' },
    { q: 'Which six-sided shape do bees build in a honeycomb?', a: 'A hexagon', opts: ['A hexagon', 'A triangle', 'A square'], speak: 'Bees build strong six-sided hexagons!' },
    { q: 'During Chuseok in Korea, what half-moon rice cakes do families make together?', a: 'Songpyeon', opts: ['Songpyeon', 'French fries', 'Ice cubes'], speak: 'Families make delicious songpyeon rice cakes!' },
    { q: 'In Alice\'s Adventures, what was the White Rabbit wearing when he ran past Alice?', a: 'A waistcoat with a watch', opts: ['A waistcoat with a watch', 'A spacesuit helmet', 'Snowshoes and skis'], speak: 'The White Rabbit wore a waistcoat and checked his pocket watch!' },
    { q: 'How do coniferous evergreen trees survive freezing snowy winters?', a: 'Waxy needles keep water inside', opts: ['Waxy needles keep water inside', 'They fly south like birds', 'They sleep inside caves'], speak: 'Coniferous trees have waxy needles and cones!' },
    { q: 'Why did the grateful swallow bring Go Ne a golden gourd seed?', a: 'Because Go Ne gently healed its broken leg', opts: ['Because Go Ne gently healed its broken leg', 'Because Go Ne used a slingshot', 'Because Go Ne locked it in a cage'], speak: 'Kindness brings wonderful rewards!' }
  ];
  var bottleIdx = 0;

  function openGamesHub() {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    document.body.classList.add('isl-modal-open');
    var battles = (root.WorldGame && root.WorldGame.BATTLES) || [];
    var pickBattleIdx = Math.floor(Math.random() * Math.max(1, battles.length));

    var cards = [
      {
        title: '⚽ Crew Football Arena',
        desc: 'Play 1v1, 2v2, or 4v4 Island Soccer! Pass with E and power-shoot with Space to win coins & trophies!',
        img: 'art/flat/o_ball.webp',
        act: 'IslandGamesHub.launch(\'soccer\')'
      },
      {
        title: '🏐 Beach Volleyball 4v4',
        desc: 'Bump, set, and jump-spike on Hispaniola Beach with your monster crew!',
        img: 'art/flat/c_lulu_happy.webp',
        act: 'IslandGamesHub.launch(\'volleyball\')'
      },
      {
        title: '⚔️ Friendly Word Battles',
        desc: 'Challenge Cheeky Sand Crab, Sleepy Cloud, or Pine Cone Bear with Global Reading power spells!',
        img: 'art/flat/e_sand_crab.webp',
        act: 'IslandGamesHub.launch(\'battle\',' + pickBattleIdx + ')'
      },
      {
        title: '🏡 Captain\'s Cabin & Builder',
        desc: 'Craft cosy furniture, complete Grandpa Bolt\'s English Blueprints, or walk around your Home Island!',
        img: 'art/flat/h_cottage.webp',
        act: 'IslandGamesHub.launch(\'cabin\')'
      },
      {
        title: '🍾 Message in a Bottle',
        desc: 'Open floating sea-bottle riddles from Clara, Alice, and Lulu to win +15 Gold Coins!',
        img: 'art/flat/o_map_scroll.webp',
        act: 'IslandGamesHub.openBottleRiddle()'
      },
      {
        title: '📒 Stickers & Class Plaza',
        desc: 'Inspect your shiny Treasure Island stickers, Map Pieces, and visit classmates\' islands!',
        img: 'art/flat/o_billy_chest.webp',
        act: 'IslandGamesHub.launch(\'stickers\')'
      }
    ];

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="uf-games-backdrop">' +
        '<div class="isl-card-modal" style="max-width:940px;width:95vw">' +
          '<div class="isl-mission-top">' +
            '<div style="font-size:1.42rem;font-weight:800;color:#fde047">🎮 Practice Island Arcade & Crew Activities</div>' +
            '<button type="button" class="isl-btn" style="margin-left:auto;min-height:44px;min-width:44px;padding:6px 12px" onclick="WorldGame.closeModal()">✕</button>' +
          '</div>' +
          '<div style="color:#bae6fd;font-size:0.95rem;font-weight:700">Take a fun crew break anytime — every game practices English and earns Gold Coins for the Island Store!</div>' +
          '<div class="uf-games-grid">' +
            cards.map(function (c) {
              return (
                '<button type="button" class="uf-game-card" onclick="' + c.act + '">' +
                  '<div class="uf-game-art"><img src="' + esc(c.img) + '" alt=""></div>' +
                  '<div class="uf-game-caption">' +
                    '<b>' + esc(c.title) + '</b>' +
                    '<span>' + esc(c.desc) + '</span>' +
                  '</div>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:14px">' +
            '<button type="button" class="isl-btn cyan" style="min-height:46px" onclick="SceneDirector.goZone(0)">🏝️ Walk Around My Home Island (Zone 0)</button>' +
            (root.IslandWall ? '<button type="button" class="isl-btn violet" style="min-height:46px" onclick="WorldGame.closeModal();IslandWall.open()">🌟 Open Class Harbour Plaza</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function launchGameActivity(kind, arg) {
    if (root.Ch1Audio) root.Ch1Audio.sfxTap();
    if (kind === 'soccer' && root.WorldGame) {
      root.WorldGame.openSportsArena('soccer', '2v2');
    } else if (kind === 'volleyball' && root.WorldGame) {
      root.WorldGame.openSportsArena('volleyball', '4v4');
    } else if (kind === 'battle' && root.WorldGame) {
      var list = root.WorldGame.BATTLES || [];
      var b = list[Number(arg) || 0] || list[0];
      if (b) root.WorldGame.openBattle(b);
    } else if (kind === 'cabin' && root.WorldGame) {
      root.WorldGame.openWorkshop('blueprints');
    } else if (kind === 'stickers') {
      if (root.WorldGame) root.WorldGame.closeModal();
      if (root.IslandRewards && root.IslandRewards.openStickerBook) root.IslandRewards.openStickerBook();
    }
  }

  function openBottleRiddle() {
    if (root.Ch1Audio) root.Ch1Audio.sfxTap();
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    var r = BOTTLE_RIDDLES[bottleIdx % BOTTLE_RIDDLES.length];
    var shuffled = r.opts.slice().sort(function () { return Math.random() - 0.5; });

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="uf-bottle-backdrop">' +
        '<div class="isl-card-modal" style="max-width:580px;text-align:center">' +
          '<div class="isl-mission-top">' +
            '<div style="font-size:1.3rem;font-weight:800;color:#fde047">🍾 Sea-Bottle Reading Riddle</div>' +
            '<button type="button" class="isl-btn" style="margin-left:auto;min-height:42px;min-width:44px;padding:6px 12px" onclick="IslandGamesHub.open()">↩ Back</button>' +
          '</div>' +
          '<img src="art/flat/o_map_scroll.webp" style="width:94px;height:94px;object-fit:contain;margin:4px auto;animation:idleBob 2.4s ease-in-out infinite" alt="">' +
          '<p style="font-size:1.22rem;font-weight:800;color:#fff;margin:8px 0 16px;line-height:1.35">' + esc(r.q) + '</p>' +
          '<div style="display:grid;gap:10px" id="uf-bottle-opts">' +
            shuffled.map(function (opt) {
              return '<button type="button" class="isl-btn" style="width:100%;justify-content:center;font-size:1.05rem" data-ans="' + esc(opt) + '">' + esc(opt) + '</button>';
            }).join('') +
          '</div>' +
          '<div id="uf-bottle-msg" style="min-height:28px;margin-top:12px;font-weight:800;color:#fde047"></div>' +
        '</div>' +
      '</div>';

    if (root.Ch1Audio) root.Ch1Audio.speak(r.q);

    modalRoot.querySelectorAll('#uf-bottle-opts button').forEach(function (btn) {
      btn.onclick = function () {
        var picked = btn.getAttribute('data-ans');
        var msg = document.getElementById('uf-bottle-msg');
        if (picked === r.a) {
          if (root.Ch1Audio) {
            root.Ch1Audio.sfxCorrect();
            root.Ch1Audio.speak(r.speak);
          }
          btn.classList.add('emerald');
          if (msg) msg.textContent = '🌟 Brilliant! +15 Gold Coins & +1 Sea Shell!';
          if (root.WorldGame) {
            if (root.WorldGame.addBonusCoins) root.WorldGame.addBonusCoins(15);
            if (root.WorldGame.giveMaterials) root.WorldGame.giveMaterials({ shell: 1 });
          }
          flyCoinsToHud(15);
          bottleIdx++;
          setTimeout(function () { openBottleRiddle(); }, 1850);
        } else {
          if (root.Ch1Audio) root.Ch1Audio.sfxWrong();
          btn.style.opacity = '0.45';
          btn.style.transform = 'translateX(-4px)';
          if (msg) msg.textContent = '💡 Try another clue, Captain!';
        }
      };
    });
  }

  root.UnityFeel = {
    perspectiveScale: perspectiveScale,
    spawnDustPuff: spawnDustPuff,
    flyCoinsToHud: flyCoinsToHud,
    getKeyboardInput: getKeyboardInput,
    onLookChanged: onLookChanged,
    notifyLookChanged: notifyLookChanged,
    mountUnifiedHud: mountUnifiedHud,
    refreshAllUnifiedHuds: refreshAllUnifiedHuds,
    updateWayfinder: updateWayfinder
  };

  root.SceneDirector = {
    goZone: goZone,
    getActiveZone: function () { return activeZone; }
  };

  root.IslandCinema = {
    VIDEOS: VIDEOS,
    open: openCinema,
    select: selectCinemaVideo,
    narrate: narrateCinemaVideo,
    playZone: playZoneFromCinema,
    close: closeCinema
  };

  root.IslandGamesHub = {
    open: openGamesHub,
    launch: launchGameActivity,
    openBottleRiddle: openBottleRiddle
  };
})(typeof window !== 'undefined' ? window : this);
