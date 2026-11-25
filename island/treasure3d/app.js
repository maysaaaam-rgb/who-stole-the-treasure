/* island/treasure3d/app.js
 * Main Orchestrator for 3D Open-World Treasure Island (Practice Island 3D)
 * Connects:
 * - K3 QHD/MSAA Renderer + StylizedWater + Morning-to-Sunset & Cave Atmosphere
 * - 5-Zone Sculpted Terrain + Offshore Shipwreck Island
 * - Real Pupil 3D Avatar + Pet Companion + Rowing Boat + Lookout Spyglass + Tool Belt
 * - Rigged Pirate Cast + Flying Guide Parrot + Roaming Classmates + Scuttling Crabs
 * - Grade 3 & Grade 4 In-World Spoken Quests + Optional Mic Bonus + IslandSync Cloud/Local Checkpoints
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var TI3D = root.TI3D = root.TI3D || {};

  function $(id) { return document.getElementById(id); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  // Lazy-load Supabase SDK only when online & signing in with a real Passport Code (100% instant offline!)
  var _sbLoadPromise = null;
  function ensureSupabaseLoaded() {
    if (root.AdventureSupabase && root.AdventureSupabase.client) return Promise.resolve(true);
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return Promise.resolve(false);
    if (_sbLoadPromise) return _sbLoadPromise;
    _sbLoadPromise = new Promise(function (resolve) {
      function addScript(src, next) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = function () { next(true); };
        s.onerror = function () { next(false); };
        document.head.appendChild(s);
      }
      addScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', function (ok) {
        if (!ok) { resolve(false); return; }
        addScript('../js/supabase-config.js?v=2.5', function () {
          addScript('../js/supabase-client.js?v=4.6', function () {
            setTimeout(function () { resolve(!!(root.AdventureSupabase && root.AdventureSupabase.client)); }, 80);
          });
        });
      });
    });
    return _sbLoadPromise;
  }

  function boot() {
    var K = root.K3;
    if (!K || !T3) return;

    // Ensure K3 asset paths resolve cleanly from /island/index.html
    K.ROOT = '../';

    var params = new URLSearchParams(root.location.search);
    if (params.get('mode') === '2d' || params.get('classic') === '1') {
      root.location.replace('classic.html' + root.location.search);
      return;
    }

    var isDemoParam = params.has('demo') || params.get('from') === 'home3d';
    var urlCode = (params.get('p') || '').trim().toUpperCase();
    var savedCode = '';
    try { savedCode = (localStorage.getItem('eaa_island_last_code') || '').trim().toUpperCase(); } catch (e) {}

    var loadFill = $('ti-load-fill');
    var loadSub = $('ti-load-sub');
    function setProgress(pct, msg) {
      if (loadFill) loadFill.style.width = pct + '%';
      if (loadSub && msg) loadSub.textContent = msg;
    }

    setProgress(22, 'Preparing sunlit tropical ocean & 5 island zones…');

    K.init({
      canvas: $('ti-canvas'),
      fov: 44,
      far: 450,
      fog: 0xe6f4ff,
      fogDensity: 0.0022,
      bloom: false
    });
    K.cam.manual = true; // Player & Spyglass cameras control K.camera directly!

    var loader = new T3.GLTFLoader();
    var sfx = TI3D.createAudioEngine();

    // Unlock Web Audio on first user touch/click/key anywhere
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (evName) {
      root.addEventListener(evName, function onFirst() {
        sfx.unlock();
        root.removeEventListener(evName, onFirst);
      }, { passive: true });
    });

    var session = null;
    var activeContextAction = null;
    var toastTimer = null;

    function showToast(msg, borderHex) {
      var el = $('ti-toast');
      if (!el) return;
      el.textContent = msg;
      el.style.borderColor = borderHex || '#ff5fa2';
      el.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3100);
    }

    var world = TI3D.createWorldMap(K.scene, loader, {});
    var atmosphere = TI3D.createAtmosphere(K.scene, K.renderer, world.waterMesh);
    var pfx = TI3D.createPixelFxSystem ? TI3D.createPixelFxSystem(K.scene, K.camera, {}) : null;

    // ---------- Populate Ambient 3D PixelFX Flipbooks Across All 5 Zones ----------
    var pfxRefs = {
      bottleBeam: null,
      bottleBubbles: null,
      wreckBeam: null,
      coveBeam: null,
      caveFlames: []
    };
    if (pfx) {
      var S = world.SPOTS;
      var hAt = world.sampleTerrainHeight;

      // Zone 1: Roaring Beach Campfire, Floating Bottle Bubbles & Golden Beam, Shallow-Bay Fish, Wildflower Butterflies
      pfx.addLoop3D('campfire', S.campfire.x, hAt(S.campfire.x, S.campfire.z) + 0.24, S.campfire.z, 2.35, { cropBottom: 0.18 });
      pfxRefs.bottleBubbles = pfx.addLoop3D('bubbles', S.bottle1.x, 0.02, S.bottle1.z, 1.45, { phase: 0.4, additive: true, opacity: 0.88 });
      pfxRefs.bottleBeam = pfx.addLoop3D('loot-beam', S.bottle1.x, 0.12, S.bottle1.z, 2.15, { cropBottom: 0.25, additive: true, opacity: 0.88 });
      pfx.addLoop3D('fish-school', -32.4, -0.05, 46.4, 2.1, { mode: 'water', wanderRadius: 2.2, wanderSpeed: 0.52, phase: 0.2, opacity: 0.85 });
      pfx.addLoop3D('fish-school', -38.2, -0.05, 48.8, 1.9, { mode: 'water', wanderRadius: 2.0, wanderSpeed: 0.48, phase: 2.7, opacity: 0.85 });
      pfx.addLoop3D('butterfly', -33.4, hAt(-33.4, 31.2) + 0.95, 31.2, 1.15, { mode: 'center', wanderRadius: 1.4, wanderSpeed: 0.9, phase: 0.5 });
      pfx.addLoop3D('butterfly', -40.8, hAt(-40.8, 35.4) + 0.95, 35.4, 1.10, { mode: 'center', wanderRadius: 1.3, wanderSpeed: 0.85, phase: 2.1, flipX: true });

      // Zone 2: Chef Cook's Jungle Hearth Fire + Simmering Soup Bubbles + Jungle Butterflies
      pfx.addLoop3D('campfire', S.soupPot.x, hAt(S.soupPot.x, S.soupPot.z) + 0.06, S.soupPot.z, 1.60, { cropBottom: 0.18, phase: 1.7 });
      pfx.addLoop3D('bubbles', S.soupPot.x, hAt(S.soupPot.x, S.soupPot.z) + 0.82, S.soupPot.z, 1.10, { phase: 1.2, additive: true, opacity: 0.82 });
      pfx.addLoop3D('butterfly', -9.4, hAt(-9.4, 16.4) + 1.0, 16.4, 1.15, { mode: 'center', wanderRadius: 1.6, wanderSpeed: 0.95, phase: 1.1 });
      pfx.addLoop3D('butterfly', 2.4, hAt(2.4, 12.2) + 1.0, 12.2, 1.10, { mode: 'center', wanderRadius: 1.4, wanderSpeed: 0.82, phase: 3.6, flipX: true });

      // Zone 3: Lagoon Pier Torch Lanterns, Clear-Lagoon Fish Schools & Shipwreck Supply Chest Golden Loot Beam
      pfx.addLoop3D('torch', 39.0, 2.38, 12.48, 1.55, { cropBottom: 0.28, phase: 0.3 });
      pfx.addLoop3D('torch', 39.0, 2.38, 15.52, 1.55, { cropBottom: 0.28, phase: 1.9 });
      pfx.addLoop3D('fish-school', 36.6, -0.06, 11.4, 2.3, { mode: 'water', wanderRadius: 2.6, wanderSpeed: 0.55, phase: 0.8 });
      pfx.addLoop3D('fish-school', 42.5, -0.06, 16.2, 2.4, { mode: 'water', wanderRadius: 3.0, wanderSpeed: 0.46, phase: 3.1 });
      pfx.addLoop3D('fish-school', 58.6, -0.06, 14.4, 2.2, { mode: 'water', wanderRadius: 2.4, wanderSpeed: 0.50, phase: 4.5 });
      pfxRefs.wreckBeam = pfx.addLoop3D('loot-beam', S.wreckChest.x, hAt(S.wreckChest.x, S.wreckChest.z) + 0.38, S.wreckChest.z, 2.55, { cropBottom: 0.25, additive: true });

      // Zone 4: Churning Highland Waterfall Plunge Spray, Bioluminescent Cave Fireflies & Ignitable Crystal Flames
      pfx.addLoop3D('waterfall', S.waterfall.x + 0.8, 4.05, S.waterfall.z + 1.05, 3.65, { phase: 0.0 });
      pfx.addLoop3D('waterfall', S.waterfall.x + 0.8, 6.25, S.waterfall.z + 0.92, 3.15, { phase: 0.5, opacity: 0.90 });
      pfx.addLoop3D('fireflies', S.caveCenter.x, 4.35, S.caveCenter.z - 1.5, 4.8, { mode: 'center', additive: true, opacity: 0.92, maxDist: 42 });
      world.state.caveTorches.forEach(function (tc, idx) {
        var cFlame = pfx.addLoop3D('torch', tc.x, hAt(tc.x, tc.z) + 2.05, tc.z, 1.65, {
          cropBottom: 0.28,
          additive: true,
          visible: false,
          phase: idx * 1.1
        });
        pfxRefs.caveFlames.push(cFlame);
      });

      // Zone 5: Sunset Cove Golden Fireflies & Shimmering Final Treasure Rarity Beam
      pfx.addLoop3D('fireflies', -38.5, hAt(-38.5, -15.5) + 0.55, -15.5, 4.6, { mode: 'center', additive: true, opacity: 0.85 });
      pfxRefs.coveBeam = pfx.addLoop3D('loot-beam', S.mounds[0].x, hAt(S.mounds[0].x, S.mounds[0].z) + 0.18, S.mounds[0].z, 2.35, {
        cropBottom: 0.25,
        additive: true,
        opacity: 0.78,
        visible: false
      });
    }

    var player = TI3D.createPlayerSystem(K.scene, K.camera, world, sfx, {
      pfx: pfx,
      isDemo: isDemoParam || !urlCode,
      onToast: showToast,
      onDeepWaterWarning: function (wx, wz) {
        if (wx > 8 && wx < 20 && wz > -20 && wz < 32) {
          if (quests && quests.qState && quests.qState.planksFixed >= 3) {
            showToast('🌉 Walk up onto the wooden Creek Bridge ramp to cross!', '#2fc58a');
          } else {
            showToast('🌊 Creek is too deep! Carry 3 English Planks to repair the Wooden Bridge! 🪵', '#2fc58a');
          }
        } else {
          showToast('🌊 Deep sea ahead! Hop into the wooden Rowing Boat on the Lagoon Dock! 🚣', '#4f9dff');
        }
      },
      onGateBlocked: function (gateId) {
        var msgs = {
          1: '🔒 Finish Benbow\'s Bottle Map quest on the beach to open the Jungle Gate!',
          3: '🔒 Show Captain your Shipwreck Spyglass & Lantern to open the Highland Rope Bridge!',
          4: '🔒 Light the 3 Dark Cave Crystals with your Lantern to open Sunset Treasure Cove!'
        };
        showToast(msgs[gateId] || '🔒 Complete this zone\'s quest first!', '#ffb320');
      },
      onToolChanged: function (activeTool, unlocked) {
        var slots = document.querySelectorAll('.ti-tool-slot');
        slots.forEach(function (btn) {
          var t = btn.getAttribute('data-tool');
          btn.classList.toggle('active', t === activeTool);
          var isLocked = (t !== 'hand' && !unlocked[t] && !(session && session.isDemo));
          btn.classList.toggle('locked', isLocked);
        });
      },
      onModeChanged: function (mode) {
        var spyHud = $('ti-spyglass-hud');
        if (spyHud) spyHud.classList.toggle('active', mode === 'spyglass');
        var hdr = $('ti-hud-header');
        if (hdr) hdr.style.display = mode === 'spyglass' ? 'none' : 'flex';
      }
    });

    var npcs = TI3D.createNpcSystem(K.scene, loader, world, player, sfx, {});

    // ---------- UI Hooks for In-World Quests, Speech Replies, Voice Mic & Cloud Checkpoints ----------
    var activeDlgData = null;

    function showDialogue(dlg) {
      activeDlgData = dlg;
      var box = $('ti-dialogue');
      if (!box) return;
      $('ti-dlg-speaker').textContent = dlg.speaker || 'Explorer';
      $('ti-dlg-line').textContent = dlg.text || '';
      var repWrap = $('ti-dlg-replies');
      repWrap.innerHTML = '';

      var rawReplies = (dlg.replies || []).slice();
      var isMultiChoice = rawReplies.length > 1;
      if (isMultiChoice && K.shuffle) {
        rawReplies = K.shuffle(rawReplies);
      }

      rawReplies.forEach(function (rep) {
        var b = document.createElement('button');
        b.type = 'button';
        // Neutral blue styling on multi-choice quizzes so the right answer is NEVER given away!
        b.className = 'ti-btn ti-reply-btn ' + (isMultiChoice ? 'blue' : 'green');
        b.textContent = '💬 ' + rep.text;
        b.onclick = function () {
          sfx.speakTTS(rep.text);
          if (rep.correct) {
            b.classList.remove('blue');
            b.classList.add('green');
            sfx.playCoin();
            if (rep.onPick) rep.onPick();
          } else {
            sfx.playSoftFail();
            b.classList.remove('ti-wobble');
            void b.offsetWidth;
            b.classList.add('ti-wobble');
            showToast('🦜 Listen closely and try another answer!', '#ffb320');
          }
        };
        repWrap.appendChild(b);
      });

      // Optional Microphone "Speak It! (+⭐)" Button when Web Speech Recognition is supported!
      var SR = root.SpeechRecognition || root.webkitSpeechRecognition;
      var correctReply = (dlg.replies || []).find(function (r) { return r.correct; });
      if (SR && correctReply) {
        var micBtn = document.createElement('button');
        micBtn.type = 'button';
        micBtn.className = 'ti-btn pink';
        micBtn.innerHTML = '🎤 Speak! (+5 🪙)';
        micBtn.onclick = function () {
          try {
            var rec = new SR();
            rec.lang = 'en-US';
            rec.interimResults = false;
            rec.maxAlternatives = 2;
            micBtn.textContent = '🎙️ Listening…';
            rec.onresult = function () {
              sfx.playWinChord();
              quests.qState.coins += 5;
              updateTopHudStats();
              showToast('🌟 Great English speaking! +5 Bonus Coins!', '#2fc58a');
              if (correctReply.onPick) correctReply.onPick();
            };
            rec.onerror = function () {
              micBtn.innerHTML = '🎤 Try Again (or Tap Reply!)';
              showToast('💬 Good try! Tap the green answer button or speak again!', '#4f9dff');
            };
            rec.start();
          } catch (e) {
            showToast('💬 Tap your answer button below!', '#4f9dff');
          }
        };
        repWrap.appendChild(micBtn);
      }

      box.classList.add('open');
    }

    function hideDialogue() {
      activeDlgData = null;
      var box = $('ti-dialogue');
      if (box) box.classList.remove('open');
    }

    function updateTopHudStats() {
      var coinEl = $('ti-coins-val');
      var starEl = $('ti-stars-val');
      var gradeBtn = $('ti-grade-btn');
      if (coinEl) coinEl.textContent = String(quests.qState.coins || 0);
      if (starEl) starEl.textContent = Math.min(5, Number(quests.qState.stars) || 0) + '/5';
      if (gradeBtn) gradeBtn.textContent = '📘 Grade ' + quests.getGrade();
    }

    function saveCheckpointToSync(progressSnap, coinsAdded, starsAdded, zoneDoneNum) {
      updateTopHudStats();
      // 1. Always persist instant local checkpoint keyed by active pupil or demo
      var sid = (session && session.student && session.student.id) || 'demo';
      try {
        localStorage.setItem('eaa_treasure3d_cp_' + sid, JSON.stringify(progressSnap));
      } catch (e) {}

      // 2. Credit Home 3D Treasure Bridge & Practice Island 3D Reward Ledger!
      if (coinsAdded > 0 || starsAdded > 0) {
        try {
          var bKey = 'eaa_home3d_bridge_xp_v1';
          var today = new Date().toISOString().slice(0, 10);
          var bData = JSON.parse(localStorage.getItem(bKey) || '{}') || {};
          if (bData.day !== today) bData = { day: today, bonus: 0, games: [] };
          bData.bonus = (Number(bData.bonus) || 0) + (starsAdded * 15 + 10);
          localStorage.setItem(bKey, JSON.stringify(bData));
        } catch (e) {}
      }

      // 3. Persist into IslandSync (both Demo localStorage AND Live Supabase `island-<studentId>`!)
      if (session && session.doc && root.IslandSync) {
        var doc = session.doc;
        doc.story = doc.story || {};
        doc.story.treasure3d = progressSnap;
        var g = quests.getGrade();
        // 25 Nov 2026: the 3D game keeps its own progress in doc.story.treasure3d. It no longer fills in stars or chests
        // of the old island's missions (those must be earned by playing them). Finishing all 5 zones gives the stamp.
        if (zoneDoneNum === 5) {
          doc.chests = doc.chests || {};
          doc.chests.treasure3d_champion = true;
          doc.collection = doc.collection || { stickers: {} };
          doc.collection.stickers = doc.collection.stickers || {};
          doc.collection.stickers['stamp-treasure-island-3d'] = { earnedAt: new Date().toISOString(), shiny: true };
        }
        var dStr = root.IslandSync.todayStr();
        doc.days = doc.days || {};
        doc.days[dStr] = doc.days[dStr] || { xp: 0, missions: [] };
        doc.days[dStr].xp = Math.min(session.cap || 45, (Number(doc.days[dStr].xp) || 0) + Math.max(5, starsAdded * 5));
        doc.world = doc.world || {};
        doc.world.coins = (Number(doc.world.coins) || 0) + (coinsAdded || 0);
        root.IslandSync.saveIslandDoc(session);
      }
    }

    var quests = TI3D.createQuestSystem(K.scene, world, player, npcs, sfx, {
      pfx: pfx,
      showDialogue: showDialogue,
      hideDialogue: hideDialogue,
      showToast: showToast,
      onStatsChanged: updateTopHudStats,
      onCheckpointSave: saveCheckpointToSync,
      onGoalText: function (txt, zoneNum) {
        var gb = $('ti-goal-text');
        if (gb) gb.textContent = txt;
        for (var z = 1; z <= 5; z++) {
          var dot = $('ti-zdot-' + z);
          if (!dot) continue;
          dot.classList.toggle('done', z < zoneNum);
          dot.classList.toggle('active', z === zoneNum);
        }
      },
      onShowBottleScroll: function (g) {
        var ov = $('ti-bottle-modal');
        var txt = $('ti-bottle-clue-text');
        if (txt) {
          txt.textContent = g === 4
            ? '"Brave Explorer! Travel ACROSS THE SUNNY JUNGLE TO COOK\'S CAMP to fix the broken bridge and reach the lagoon boat!"'
            : '"Hello Explorer! Follow the golden path TO THE JUNGLE CAMP first! Tell Benbow what this map says!"';
        }
        if (ov) ov.classList.add('open');
        sfx.speakTTS(txt ? txt.textContent : '');
      },
      onGrandFinale: function (qSt) {
        var fin = $('ti-finale-modal');
        var sum = $('ti-finale-summary');
        if (sum) {
          sum.textContent = 'You earned ' + qSt.coins + ' Gold Coins, ' + qSt.stars + ' Adventure Stars, and unlocked your shiny Treasure Island Passport Stamp!';
        }
        if (fin) fin.classList.add('open');
      }
    });

    // ---------- Session & Avatar Loader ----------
    function applySession(ses) {
      session = ses;
      var g = (ses && ses.grade === 4) ? 4 : 3;
      quests.setGrade(g);

      var sid = (ses && ses.student && ses.student.id) || 'demo-g3';
      var nameEl = $('ti-explorer-name');
      if (nameEl) nameEl.textContent = (ses && ses.student && ses.student.firstName) ? ses.student.firstName : 'Explorer';

      // Restore saved checkpoint from cloud doc or local cache
      var savedCp = (ses && ses.doc && ses.doc.story && ses.doc.story.treasure3d) || null;
      if (!savedCp) {
        try {
          var raw = localStorage.getItem('eaa_treasure3d_cp_' + sid);
          if (raw) savedCp = JSON.parse(raw);
        } catch (e) {}
      }
      quests.loadSavedProgress(savedCp);
      updateTopHudStats();

      // Build Hero 3D Avatar + Equipped Cosmetics
      var eq = (ses && ses.student && ses.student.monsterProfile && ses.student.monsterProfile.equipped) || {};
      var wornList = Object.keys(eq).map(function (k) { return eq[k]; }).filter(Boolean);
      return player.loadHeroAvatar({
        id: sid,
        teamIdx: g === 4 ? 0 : 1,
        items: wornList
      });
    }

    // ---------- Build World & Start ----------
    var initGrade = (params.get('demo') === 'g4' || params.get('grade') === '4') ? 4 : 3;
    Promise.all([
      world.populateAllProps(initGrade),
      npcs.initAll()
    ]).then(function () {
      setProgress(82, 'Summoning explorer avatar & island crew…');

      if (urlCode) {
        return ensureSupabaseLoaded().then(function () {
          return root.IslandSync.loadLiveSession(urlCode);
        }).then(function (ses) {
          if (ses && ses.status === 'ok') return applySession(ses);
          return root.IslandSync.loadDemoSession('demo-g3').then(applySession);
        });
      } else if (isDemoParam) {
        var dKey = initGrade === 4 ? 'demo-g4' : 'demo-g3';
        return root.IslandSync.loadDemoSession(dKey).then(applySession);
      } else if (savedCode) {
        return ensureSupabaseLoaded().then(function () {
          return root.IslandSync.loadLiveSession(savedCode);
        }).then(function (ses) {
          if (ses && ses.status === 'ok') return applySession(ses);
          $('ti-login-modal').classList.add('open');
          return root.IslandSync.loadDemoSession('demo-g3').then(applySession);
        });
      } else {
        // Show friendly Passport Code / Quick Play card on bare /island/ entry!
        $('ti-login-modal').classList.add('open');
        return root.IslandSync.loadDemoSession('demo-g3').then(applySession);
      }
    }).then(function () {
      setProgress(100, 'Welcome to Treasure Island!');
      setTimeout(function () {
        var ld = $('ti-loading');
        if (ld) ld.classList.add('hidden');
        sfx.speakClipOrText('z1_parrot_tip', 'Squawk! Follow me! You can splash in the shallow water or rest on the hammock!');
      }, 280);
    });

    // ---------- Pointer: Tap-to-Walk / Tap-to-Interact + Drag-to-Orbit / Spyglass Aim ----------
    var canvas = $('ti-canvas');
    var raycaster = new T3.Raycaster();
    var ndc = new T3.Vector2();
    var ptr = { down: false, id: -1, sx: 0, sy: 0, lx: 0, ly: 0, moved: false };

    canvas.addEventListener('pointerdown', function (ev) {
      ptr.down = true;
      ptr.id = ev.pointerId;
      ptr.sx = ptr.lx = ev.clientX;
      ptr.sy = ptr.ly = ev.clientY;
      ptr.moved = false;
    });

    root.addEventListener('pointermove', function (ev) {
      if (!ptr.down || ev.pointerId !== ptr.id) return;
      var dx = ev.clientX - ptr.lx;
      var dy = ev.clientY - ptr.ly;
      ptr.lx = ev.clientX;
      ptr.ly = ev.clientY;
      if (Math.hypot(ev.clientX - ptr.sx, ev.clientY - ptr.sy) > 8) {
        ptr.moved = true;
      }
      if (ptr.moved) {
        if (player.state.mode === 'spyglass') {
          player.state.spyYaw += dx * 0.0038;
          player.state.spyPitch = clamp(player.state.spyPitch + dy * 0.0032, -0.55, 0.35);
        } else {
          player.state.camYaw -= dx * 0.0055;
          player.state.camPitch = clamp(player.state.camPitch + dy * 0.0042, 0.18, 0.88);
          player.state.lastManualOrbitAt = K.now;
        }
      }
    });

    root.addEventListener('pointerup', function (ev) {
      if (!ptr.down || ev.pointerId !== ptr.id) return;
      ptr.down = false;
      if (!ptr.moved) {
        handleTapOnWorld(ev.clientX, ev.clientY);
      }
    });

    canvas.addEventListener('wheel', function (ev) {
      if (player.state.mode === 'spyglass') {
        player.state.spyFov = clamp(player.state.spyFov + (ev.deltaY > 0 ? 2.5 : -2.5), 18, 42);
      } else {
        player.state.camDist = clamp(player.state.camDist + (ev.deltaY > 0 ? 0.9 : -0.9), 6.2, 18.5);
      }
    }, { passive: true });

    function handleTapOnWorld(clientX, clientY) {
      if (player.state.mode === 'spyglass') {
        if (activeContextAction && activeContextAction.id === 'spy-spot') activeContextAction.run();
        return;
      }
      var rect = canvas.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, K.camera);

      // Raycast against terrain & water plane
      var targets = [world.terrainMesh];
      if (world.waterMesh) targets.push(world.waterMesh);
      var hits = raycaster.intersectObjects(targets, false);
      if (!hits.length) return;
      var pt = hits[0].point;

      // Check if tap landed right on an interactive NPC, Shell, Plank, Boat, Tower, Crystal, or Mound!
      function nearTap(o, r) { return o && Math.hypot(pt.x - o.x, pt.z - o.z) <= r; }

      // Guide Parrot clue tap
      var gp = npcs.getGuideParrot();
      if (gp && Math.hypot(pt.x - gp.root.position.x, pt.z - gp.root.position.z) < 2.2) {
        sfx.speakClipOrText('z1_parrot_tip', 'Follow the active goal banner at the top!');
        showToast('🦜 Squawk! Follow me to the next treasure clue!', '#2fc58a');
        return;
      }

      // Musical Shells: walk right up & tap!
      for (var si = 0; si < world.state.shellObjs.length; si++) {
        var sh = world.state.shellObjs[si];
        if (nearTap(sh, 1.65)) {
          if (Math.hypot(player.state.x - sh.x, player.state.z - sh.z) < 2.8) {
            quests.tapMusicalShell(sh);
          } else {
            player.setWalkTarget(sh.x, sh.z + 1.1, function () { quests.tapMusicalShell(sh); });
          }
          return;
        }
      }

      // Plank pickups
      for (var pi = 0; pi < world.state.plankPickups.length; pi++) {
        var pk = world.state.plankPickups[pi];
        if (!pk.taken && nearTap(pk, 1.7)) {
          player.setWalkTarget(pk.x, pk.z, function () { quests.tapPlankPickup(pk); });
          return;
        }
      }

      // Pirate NPCs
      var npcHandlers = [
        ['benbow', quests.talkToBenbow],
        ['cook', quests.talkToCook],
        ['captain', quests.talkToCaptain],
        ['flint', quests.talkToFlint]
      ];
      for (var ni = 0; ni < npcHandlers.length; ni++) {
        var npcObj = npcs.pirates[npcHandlers[ni][0]];
        var fn = npcHandlers[ni][1];
        if (npcObj && nearTap(npcObj, 2.2)) {
          if (Math.hypot(player.state.x - npcObj.x, player.state.z - npcObj.z) < 3.6) fn();
          else player.setWalkTarget(npcObj.x - 1.2, npcObj.z + 1.5, fn);
          return;
        }
      }

      // Bottle #1
      if (!quests.qState.bottleFound && nearTap(world.SPOTS.bottle1, 2.2)) {
        player.setWalkTarget(world.SPOTS.bottle1.x, world.SPOTS.bottle1.z, quests.pickupBottle1);
        return;
      }

      // Rowing boat tap
      if (player.state.mode === 'walk' && Math.hypot(pt.x - player.boatGroup.position.x, pt.z - player.boatGroup.position.z) < 3.0) {
        if (Math.hypot(player.state.x - player.boatGroup.position.x, player.state.z - player.boatGroup.position.z) < 4.8) {
          player.enterBoat();
          quests.refreshGuideAndGoal();
        } else {
          player.setWalkTarget(world.SPOTS.lagoonDockEnd.x, world.SPOTS.lagoonDockEnd.z, function () {
            player.enterBoat();
            quests.refreshGuideAndGoal();
          });
        }
        return;
      }

      // Dig mounds
      for (var mi = 0; mi < world.state.moundObjs.length; mi++) {
        var md = world.state.moundObjs[mi];
        if (!md.dug && nearTap(md, 1.9)) {
          if (Math.hypot(player.state.x - md.x, player.state.z - md.z) < 2.8) quests.digTreasureMound(md);
          else player.setWalkTarget(md.x + 1.1, md.z + 1.1, function () { quests.digTreasureMound(md); });
          return;
        }
      }

      // Default: Walk (or Row!) smoothly to tapped point!
      player.setWalkTarget(pt.x, pt.z, null);
    }

    // ---------- Virtual Thumbstick (#ti-joy) ----------
    var joyEl = $('ti-joy');
    var knobEl = $('ti-joy-knob');
    if (joyEl && knobEl) {
      var jId = -1;
      var maxR = 38;
      function updateJoy(cx, cy) {
        var r = joyEl.getBoundingClientRect();
        var dx = cx - (r.left + r.width * 0.5);
        var dy = cy - (r.top + r.height * 0.5);
        var dist = Math.hypot(dx, dy);
        if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
        knobEl.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
        player.joyVec.x = dx / maxR;
        player.joyVec.y = dy / maxR;
        player.joyVec.active = Math.hypot(player.joyVec.x, player.joyVec.y) > 0.1;
      }
      function resetJoy() {
        jId = -1;
        knobEl.style.transform = 'translate(0px,0px)';
        player.joyVec.x = 0; player.joyVec.y = 0; player.joyVec.active = false;
      }
      joyEl.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation();
        jId = ev.pointerId;
        joyEl.setPointerCapture(ev.pointerId);
        updateJoy(ev.clientX, ev.clientY);
      });
      joyEl.addEventListener('pointermove', function (ev) {
        if (ev.pointerId === jId) updateJoy(ev.clientX, ev.clientY);
      });
      joyEl.addEventListener('pointerup', function (ev) {
        if (ev.pointerId === jId) resetJoy();
      });
      joyEl.addEventListener('pointercancel', resetJoy);
    }

    // ---------- Bind HUD Buttons, Tool Belt & Passport Sign-In ----------
    $('ti-jump-btn').onclick = function () { player.triggerJump(); };
    if ($('ti-dash-btn')) $('ti-dash-btn').onclick = function () { player.triggerDash(); };
    $('ti-run-btn').onclick = function () {
      var next = !player.getRunToggle();
      player.setRunToggle(next);
      $('ti-run-btn').classList.toggle('green', next);
      $('ti-run-btn').classList.toggle('blue', !next);
    };
    $('ti-context-btn').onclick = function () {
      if (activeContextAction && activeContextAction.run) activeContextAction.run();
    };
    root.addEventListener('keydown', function (ev) {
      if (ev.target && /INPUT|TEXTAREA/.test(ev.target.tagName)) return;
      if ((ev.code === 'KeyE' || ev.code === 'Enter') && activeContextAction && activeContextAction.run) {
        ev.preventDefault();
        activeContextAction.run();
      }
    });
    $('ti-mute-btn').onclick = function () {
      var m = sfx.toggleMute();
      $('ti-mute-btn').textContent = m ? '🔇' : '🔊';
    };
    $('ti-dlg-hear').onclick = function () {
      if (activeDlgData) sfx.speakClipOrText(activeDlgData.voiceKey, activeDlgData.text);
    };
    $('ti-dlg-close').onclick = function () { quests.closeDialogue(); };
    $('ti-grade-btn').onclick = function () {
      var nextG = quests.getGrade() === 3 ? 4 : 3;
      if (session && session.isDemo) {
        root.IslandSync.loadDemoSession(nextG === 4 ? 'demo-g4' : 'demo-g3').then(applySession);
      } else {
        quests.setGrade(nextG);
        updateTopHudStats();
      }
      showToast('📘 Switched English Quests to Grade ' + nextG + '!', '#4f9dff');
    };
    $('ti-goal-banner').onclick = function () {
      var gp = npcs.getGuideParrot();
      if (gp) {
        showToast('🦜 Follow the green Parrot to your next goal!', '#2fc58a');
      }
    };
    $('ti-2d-btn').onclick = function () {
      root.location.href = 'classic.html' + (root.location.search || '?demo=1');
    };
    $('ti-spy-zoom-in').onclick = function () { player.state.spyFov = clamp(player.state.spyFov - 4, 18, 42); };
    $('ti-spy-zoom-out').onclick = function () { player.state.spyFov = clamp(player.state.spyFov + 4, 18, 42); };
    $('ti-spy-exit-btn').onclick = function () { player.exitSpyglassTower(); };

    document.querySelectorAll('.ti-zone-dot').forEach(function (zBtn) {
      zBtn.onclick = function () {
        var zNum = Number(zBtn.getAttribute('data-zone')) || 1;
        var canJump = (session && session.isDemo) || zNum <= quests.qState.zone;
        if (!canJump) {
          showToast('🔒 Complete Zone ' + quests.qState.zone + ' first to unlock Zone ' + zNum + '!', '#ffb320');
          return;
        }
        root.TreasureIsland3D.teleportToZone(zNum);
        var zNames = {
          1: 'Zone 1 · Admiral Benbow Beach',
          2: 'Zone 2 · Cook\'s Jungle & Bridge',
          3: 'Zone 3 · Lagoon Boat & Shipwreck',
          4: 'Zone 4 · Spyglass Tower & Cave',
          5: 'Zone 5 · Sunset Treasure Cove'
        };
        showToast('🧭 ' + (zNames[zNum] || ('Zone ' + zNum)), '#4f9dff');
      };
    });

    document.querySelectorAll('.ti-tool-slot').forEach(function (btn) {
      btn.onclick = function () {
        var t = btn.getAttribute('data-tool');
        if (t === 'spyglass' && Math.hypot(player.state.x - world.SPOTS.lookoutTower.x, player.state.z - world.SPOTS.lookoutTower.z) < 5.5) {
          player.enterSpyglassTower();
          return;
        }
        player.setTool(t, true);
      };
    });

    $('ti-bottle-close').onclick = function () {
      $('ti-bottle-modal').classList.remove('open');
      showToast('🐆 Now bring the Bottle Clue back to Benbow!', '#2fc58a');
    };
    $('ti-finale-stay').onclick = function () {
      $('ti-finale-modal').classList.remove('open');
    };

    // Passport Code Modal Actions
    $('ti-code-btn').onclick = function () {
      $('ti-login-modal').classList.add('open');
    };
    $('ti-login-demo-g3').onclick = function () {
      $('ti-login-modal').classList.remove('open');
      root.IslandSync.loadDemoSession('demo-g3').then(applySession);
    };
    $('ti-login-demo-g4').onclick = function () {
      $('ti-login-modal').classList.remove('open');
      root.IslandSync.loadDemoSession('demo-g4').then(applySession);
    };
    $('ti-login-submit').onclick = function () {
      var raw = ($('ti-code-field').value || '').trim().toUpperCase();
      var errEl = $('ti-login-err');
      if (raw.length < 4) {
        errEl.textContent = 'Enter your Passport Code (or tap Grade 3 / Grade 4 Demo below)!';
        return;
      }
      errEl.textContent = 'Connecting to your Island Passport…';
      ensureSupabaseLoaded().then(function () {
        return root.IslandSync.loadLiveSession(raw);
      }).then(function (ses) {
        if (ses && ses.status === 'ok') {
          errEl.textContent = '';
          $('ti-login-modal').classList.remove('open');
          applySession(ses);
          showToast('🛂 Welcome back, ' + ses.student.firstName + '!', '#2fc58a');
        } else {
          errEl.textContent = 'Code not found — check with your teacher or play Demo!';
        }
      });
    };

    // ---------- Main 60 FPS Frame Loop + Crisp CSS 2D World Label Projector ----------
    var ctxBtn = $('ti-context-btn');
    var spyCompass = $('ti-spy-compass');
    var labelsRoot = $('ti-world-labels');
    var labelDomMap = {};
    var _projV = new T3.Vector3();

    function syncScreenSpaceLabels() {
      if (!labelsRoot) return;
      var hideAll = player.state.mode === 'spyglass' || !!activeDlgData;
      var W = root.innerWidth || 1280;
      var H = root.innerHeight || 720;
      var list = world.state.worldLabels;

      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var dom = labelDomMap[item.id];
        if (!dom) {
          dom = document.createElement('div');
          dom.className = 'ti-wlabel';
          dom.style.borderColor = item.borderHex || '#4f9dff';
          dom.textContent = item.text;
          labelsRoot.appendChild(dom);
          labelDomMap[item.id] = dom;
        }
        if (dom.textContent !== item.text) dom.textContent = item.text;

        if (hideAll || !item.visible) {
          dom.style.opacity = '0';
          continue;
        }
        var distCam = K.camera.position.distanceTo(item.pos);
        if (distCam > item.maxDist) {
          dom.style.opacity = '0';
          continue;
        }
        _projV.copy(item.pos).project(K.camera);
        if (_projV.z > 1.0 || _projV.z < -1.0) {
          dom.style.opacity = '0';
          continue;
        }
        var sx = (_projV.x * 0.5 + 0.5) * W;
        var sy = (-_projV.y * 0.5 + 0.5) * H;
        if (sx < -80 || sx > W + 80 || sy < 70 || sy > H - 70) {
          dom.style.opacity = '0';
          continue;
        }
        var fade = clamp(1.0 - (distCam - item.maxDist * 0.68) / (item.maxDist * 0.32), 0.15, 1.0);
        dom.style.opacity = fade.toFixed(2);
        dom.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0) translate(-50%,-50%)';
      }
    }

    K.onFrame(function (dt, elapsed) {
      player.update(dt, elapsed);
      var gi = world.getGroundInfo(player.state.x, player.state.z);
      world.update(dt, elapsed, player.state, K.camera.position);
      syncScreenSpaceLabels();

      // Update dynamic story lighting + player hand-lantern PointLight!
      atmosphere.lanternLight.position.set(
        player.state.x + Math.sin(player.state.yaw) * 0.45,
        player.state.y + 1.15,
        player.state.z + Math.cos(player.state.yaw) * 0.45
      );
      atmosphere.update(
        dt,
        elapsed,
        player.state,
        gi.inCave,
        player.state.activeTool === 'lantern',
        quests.qState.zone
      );

      npcs.update(dt, elapsed);
      quests.update(dt);

      if (pfx) {
        if (pfxRefs.bottleBeam) pfxRefs.bottleBeam.setVisible(!quests.qState.bottleFound);
        if (pfxRefs.bottleBubbles) pfxRefs.bottleBubbles.setVisible(!quests.qState.bottleFound);
        if (pfxRefs.wreckBeam) pfxRefs.wreckBeam.setVisible(!quests.qState.wreckLooted);
        if (pfxRefs.coveBeam) pfxRefs.coveBeam.setVisible(quests.qState.zone >= 5 && !quests.qState.treasureFound);
        for (var cfi = 0; cfi < pfxRefs.caveFlames.length; cfi++) {
          var tcState = world.state.caveTorches[cfi];
          if (tcState) pfxRefs.caveFlames[cfi].setVisible(!!tcState.lit);
        }
        pfx.update(dt, elapsed);
      }

      // Refresh contextual interaction button
      activeContextAction = quests.detectContextAction();
      if (ctxBtn) {
        if (activeContextAction) {
          ctxBtn.style.display = 'inline-flex';
          if (ctxBtn.textContent !== activeContextAction.label) {
            ctxBtn.textContent = activeContextAction.label;
          }
        } else {
          ctxBtn.style.display = 'none';
        }
      }

      // Update Spyglass Compass Bearing
      if (player.state.mode === 'spyglass' && spyCompass) {
        var deg = Math.round((((-player.state.spyYaw * 180 / Math.PI) % 360) + 360) % 360);
        var dir = deg < 23 || deg >= 338 ? 'N' : (deg < 68 ? 'NE' : (deg < 113 ? 'E' : (deg < 158 ? 'SE' : (deg < 203 ? 'S' : (deg < 248 ? 'SW' : (deg < 293 ? 'W' : 'NW'))))));
        var spot = activeContextAction && activeContextAction.id === 'spy-spot' ? ' · 🎯 TARGET LOCKED!' : '';
        spyCompass.textContent = '🧭 ' + dir + ' (' + deg + '°)' + spot;
      }
    });

    K.start();

    // Expose clean API for debugging & automated verification
    root.TreasureIsland3D = {
      world: world,
      atmosphere: atmosphere,
      player: player,
      npcs: npcs,
      quests: quests,
      sfx: sfx,
      pfx: pfx,
      teleportToZone: function (z) {
        var inZ4Tower = (z === 4 && Math.hypot(player.state.x - 6.4, player.state.z + 25.2) < 4.5);
        var targets = {
          1: { x: -35.8, z: 34.8, yaw: 2.5 },
          2: { x: -5.8,  z: 14.2, yaw: 2.8 },
          3: { x: 37.8,  z: 14.0, yaw: 1.57 },
          4: inZ4Tower ? { x: -18.5, z: -40.5, yaw: 3.1 } : { x: 6.4, z: -25.2, yaw: 2.4 },
          5: { x: -38.2, z: -14.8, yaw: -2.2 }
        };
        var t = targets[z] || targets[1];
        if (player.state.mode === 'boat') player.exitBoat(t.x, t.z);
        if (player.state.mode === 'spyglass') player.exitSpyglassTower();
        player.state.introFlyTimer = 0;
        player.walkTarget = null;
        player.state.walkTarget = null;
        player.state.x = t.x;
        player.state.z = t.z;
        player.state.y = world.getGroundInfo(t.x, t.z).y;
        player.state.yaw = t.yaw || 0;
        player.state.vy = 0;
        if (z >= 2) world.setGateOpen(1, true);
        if (z >= 3) world.setBridgePlanksFixed(3);
        if (z >= 4) {
          world.setGateOpen(3, true);
          player.unlockTool('spyglass');
          player.unlockTool('lantern');
          if (inZ4Tower) {
            player.setTool('lantern', false);
            player.state.camYaw = 0.0;
          }
        }
        if (z >= 5) {
          world.setGateOpen(4, true);
          player.unlockTool('shovel');
          player.setTool('shovel', false);
          npcs.moveCaptainToSunsetCove();
        }
        quests.qState.zone = Math.max(quests.qState.zone, z);
        quests.refreshGuideAndGoal();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : this);
