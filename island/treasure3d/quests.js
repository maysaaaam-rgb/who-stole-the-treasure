/* island/treasure3d/quests.js
 * Polyphonic Web Audio SFX + Pre-Generated Local MP3 Voice Engine +
 * 100% In-World Progressive 5-Zone English Quests (Grade 3 & Grade 4)
 * Zero 2D Popup Quiz Modals — All conversations, clues, speaking & actions happen live in 3D!
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var TI3D = root.TI3D = root.TI3D || {};

  // ---------- 1. Polyphonic Web Audio + Local MP3 Voice Controller ----------
  function createAudioEngine() {
    var ctx = null;
    var muted = false;
    var manifest = null;
    var currentVoiceAudio = null;
    var seaAudio = null;

    fetch('treasure3d/sfx/voices/manifest.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { manifest = data; })
      .catch(function () {});

    function unlock() {
      if (!ctx) {
        var AC = root.AudioContext || root.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(function () {});
      }
      if (!seaAudio) {
        try {
          seaAudio = new Audio('audio/sfx/sea_waves.mp3');
          seaAudio.loop = true;
          seaAudio.volume = 0.14;
        } catch (e) {}
      }
      if (seaAudio && !muted && seaAudio.paused) {
        seaAudio.play().catch(function () {});
      }
    }

    function playNotePair(f1, f2, dur, vol, delay, waveType) {
      if (muted || !ctx) return;
      var now = ctx.currentTime + (delay || 0);
      var o1 = ctx.createOscillator();
      var o2 = ctx.createOscillator();
      var g = ctx.createGain();
      o1.type = waveType || 'triangle';
      o2.type = 'sine';
      o1.frequency.setValueAtTime(f1, now);
      o2.frequency.setValueAtTime(f2 || f1 * 1.5, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(vol || 0.08, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (dur || 0.35));
      o1.connect(g); o2.connect(g); g.connect(ctx.destination);
      o1.start(now); o2.start(now);
      o1.stop(now + (dur || 0.35) + 0.03);
      o2.stop(now + (dur || 0.35) + 0.03);
    }

    function playWinChord() {
      unlock();
      // Ascending C-Major Pentatonic Chord (AGENTS.md §1.3: C5 -> E5 -> G5 -> C6)
      [523.25, 659.25, 783.99, 1046.50].forEach(function (f, i) {
        playNotePair(f, f * 0.5, 0.42, 0.085, i * 0.075, 'triangle');
      });
    }

    function playSoftFail() {
      unlock();
      // Warm descending two-tone sine chime (246.94 Hz -> 220 Hz, zero harsh buzzers!)
      playNotePair(246.94, 370.0, 0.28, 0.07, 0, 'sine');
      playNotePair(220.00, 330.0, 0.36, 0.07, 0.14, 'sine');
    }

    function playCoin() {
      unlock();
      playNotePair(987.77, 493.88, 0.18, 0.075, 0, 'triangle');
      playNotePair(1318.51, 659.25, 0.32, 0.085, 0.07, 'triangle');
    }

    function playShellTone(freq) {
      unlock();
      playNotePair(freq, freq * 2.0, 0.52, 0.11, 0, 'sine');
    }

    function playJump() {
      unlock();
      if (muted || !ctx) return;
      var now = ctx.currentTime;
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o2.type = 'triangle';
      o.frequency.setValueAtTime(260, now);
      o.frequency.exponentialRampToValueAtTime(520, now + 0.18);
      o2.frequency.setValueAtTime(390, now);
      o2.frequency.exponentialRampToValueAtTime(780, now + 0.18);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.065, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      o.connect(g); o2.connect(g); g.connect(ctx.destination);
      o.start(now); o2.start(now); o.stop(now + 0.24); o2.stop(now + 0.24);
    }

    function playNoiseBurst(filterFreq, filterType, dur, vol) {
      if (muted || !ctx) return;
      var len = Math.floor(ctx.sampleRate * dur);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      var src = ctx.createBufferSource();
      src.buffer = buf;
      var flt = ctx.createBiquadFilter();
      flt.type = filterType || 'lowpass';
      flt.frequency.value = filterFreq || 600;
      var g = ctx.createGain();
      g.gain.value = vol || 0.05;
      src.connect(flt); flt.connect(g); g.connect(ctx.destination);
      src.start();
    }

    function playStep(surface) {
      if (muted || !ctx) return;
      if (surface === 'water') {
        playNoiseBurst(950, 'bandpass', 0.11, 0.055);
      } else if (surface === 'wood') {
        playNotePair(165 + Math.random() * 25, 240, 0.07, 0.045, 0, 'triangle');
      } else if (surface === 'sand') {
        playNoiseBurst(1300, 'lowpass', 0.065, 0.035);
      } else {
        playNoiseBurst(720, 'lowpass', 0.055, 0.030);
      }
    }

    function playSplash() {
      unlock();
      playNoiseBurst(880, 'bandpass', 0.26, 0.09);
    }

    function playOar() {
      if (muted || !ctx) return;
      playNoiseBurst(680, 'bandpass', 0.20, 0.065);
    }

    function playDig() {
      unlock();
      playNoiseBurst(920, 'lowpass', 0.18, 0.095);
      playNotePair(196, 294, 0.14, 0.05, 0.04, 'triangle');
    }

    function speakClipOrText(clipKey, fallbackText, onEnd) {
      unlock();
      if (muted) {
        if (onEnd) setTimeout(onEnd, 300);
        return;
      }
      if (currentVoiceAudio) {
        try { currentVoiceAudio.pause(); } catch (e) {}
        currentVoiceAudio = null;
      }
      if (root.speechSynthesis) {
        try { root.speechSynthesis.cancel(); } catch (e) {}
      }

      var entry = manifest && clipKey ? manifest[clipKey] : null;
      if (entry && entry.file) {
        var a = new Audio(entry.file);
        currentVoiceAudio = a;
        a.onended = function () { if (onEnd) onEnd(); };
        a.onerror = function () { speakTTS(fallbackText || entry.text, onEnd); };
        a.play().catch(function () { speakTTS(fallbackText || entry.text, onEnd); });
        return;
      }
      speakTTS(fallbackText, onEnd);
    }

    function speakTTS(text, onEnd) {
      if (muted || !text || !root.speechSynthesis) {
        if (onEnd) setTimeout(onEnd, 300);
        return;
      }
      try {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.88;
        u.pitch = 1.05;
        u.onend = function () { if (onEnd) onEnd(); };
        root.speechSynthesis.speak(u);
      } catch (e) {
        if (onEnd) onEnd();
      }
    }

    function toggleMute() {
      muted = !muted;
      if (muted) {
        if (currentVoiceAudio) { try { currentVoiceAudio.pause(); } catch (e) {} }
        if (seaAudio) { try { seaAudio.pause(); } catch (e) {} }
        if (root.speechSynthesis) { try { root.speechSynthesis.cancel(); } catch (e) {} }
      } else if (seaAudio) {
        seaAudio.play().catch(function () {});
      }
      return muted;
    }

    return {
      unlock: unlock,
      playWinChord: playWinChord,
      playSoftFail: playSoftFail,
      playCoin: playCoin,
      playShellTone: playShellTone,
      playJump: playJump,
      playStep: playStep,
      playSplash: playSplash,
      playOar: playOar,
      playDig: playDig,
      speakClipOrText: speakClipOrText,
      speakTTS: speakTTS,
      toggleMute: toggleMute,
      isMuted: function () { return muted; }
    };
  }

  // ---------- 2. Progressive 5-Zone Quest Engine + Bursting 3D Gold Coins ----------
  function createQuestSystem(scene, world, player, npcs, sfx, uiHooks) {
    var pfx = (uiHooks && uiHooks.pfx) || null;
    var grade = 3;
    var qState = {
      zone: 1,          // 1..5 (6 = completed!)
      subStep: 'talk',  // per-zone step
      bottleFound: false,
      shellsDone: false,
      shellCursor: 0,
      planksFixed: 0,
      wreckLooted: false,
      spyWaterfall: false,
      spyPalms: false,
      torchesCursor: 0,
      treasureFound: false,
      coins: 0,
      stars: 0,
      restedFire: false,
      restedHammock: false
    };

    // Pool of 55 Beveled Metallic Gold Coins & Sparkling Gems!
    var coinBursts = [];
    var coinGeo = new T3.CylinderGeometry(0.19, 0.19, 0.06, 16);
    coinGeo.rotateX(Math.PI * 0.5);
    var gemGeo = new T3.OctahedronGeometry(0.17, 0);
    var coinMats = [
      new T3.MeshStandardMaterial({ color: 0xffcf26, emissive: new T3.Color(0xd98200), emissiveIntensity: 0.28, roughness: 0.20, metalness: 0.72 }),
      new T3.MeshStandardMaterial({ color: 0xff5fa2, emissive: new T3.Color(0xc9266b), emissiveIntensity: 0.32, roughness: 0.16, metalness: 0.35, flatShading: true }),
      new T3.MeshStandardMaterial({ color: 0x3ce6dc, emissive: new T3.Color(0x129ab0), emissiveIntensity: 0.32, roughness: 0.16, metalness: 0.35, flatShading: true })
    ];
    for (var ci = 0; ci < 55; ci++) {
      var isGem = (ci % 4 === 3);
      var cm = new T3.Mesh(isGem ? gemGeo : coinGeo, coinMats[isGem ? (1 + (ci % 2)) : 0]);
      cm.castShadow = true;
      cm.visible = false;
      scene.add(cm);
      coinBursts.push({ mesh: cm, vx: 0, vy: 0, vz: 0, age: 99, maxAge: 2.0 });
    }

    function burstGoldCoins(x, y, z, count) {
      var n = Math.min(count || 20, coinBursts.length);
      var spawned = 0;
      for (var i = 0; i < coinBursts.length && spawned < n; i++) {
        var cb = coinBursts[i];
        if (cb.age >= cb.maxAge) {
          cb.age = 0;
          cb.maxAge = 1.6 + Math.random() * 0.7;
          cb.mesh.position.set(x, y + 0.5, z);
          var ang = Math.random() * Math.PI * 2;
          var spd = 1.8 + Math.random() * 4.2;
          cb.vx = Math.cos(ang) * spd;
          cb.vz = Math.sin(ang) * spd;
          cb.vy = 5.2 + Math.random() * 4.5;
          cb.mesh.visible = true;
          spawned++;
        }
      }
    }

    function setGrade(g) {
      grade = Number(g) === 4 ? 4 : 3;
      world.updatePlankLabelsForGrade(grade);
      refreshGuideAndGoal();
    }

    function loadSavedProgress(saved) {
      // Reset clean defaults first so switching Grade 3 <-> Grade 4 Demo never leaks progress!
      qState.zone = 1;
      qState.subStep = 'talk';
      qState.bottleFound = false;
      qState.shellsDone = false;
      qState.shellCursor = 0;
      qState.planksFixed = 0;
      qState.wreckLooted = false;
      qState.spyWaterfall = false;
      qState.spyPalms = false;
      qState.torchesCursor = 0;
      qState.treasureFound = false;
      qState.coins = 0;
      qState.stars = 0;
      if (world.state.bottle1Mesh) world.state.bottle1Mesh.visible = true;
      world.setBridgePlanksFixed(0);
      world.setGateOpen(1, false);
      world.setGateOpen(3, false);
      world.setGateOpen(4, false);
      if (npcs.moveCaptainToLagoonDock) npcs.moveCaptainToLagoonDock();
      world.state.shellObjs.forEach(function (s) { if (s.label) s.label.visible = true; });
      world.state.plankPickups.forEach(function (p) { p.taken = false; p.group.visible = true; if (p.label) p.label.visible = true; });
      world.state.moundObjs.forEach(function (m) { m.dug = false; m.scoops = 0; m.group.visible = true; m.group.scale.setScalar(1); });
      if (world.state.finalChestClosed) world.state.finalChestClosed.visible = false;
      if (world.state.finalChestOpen) world.state.finalChestOpen.visible = false;

      if (!saved || typeof saved !== 'object') {
        refreshGuideAndGoal();
        return;
      }
      qState.zone = saved.zone || 1;
      qState.subStep = saved.subStep || 'talk';
      qState.bottleFound = !!saved.bottleFound;
      qState.shellsDone = !!saved.shellsDone;
      qState.planksFixed = Number(saved.planksFixed) || 0;
      qState.wreckLooted = !!saved.wreckLooted;
      qState.spyWaterfall = !!saved.spyWaterfall;
      qState.spyPalms = !!saved.spyPalms;
      qState.torchesCursor = Number(saved.torchesCursor) || 0;
      qState.treasureFound = !!saved.treasureFound;
      qState.coins = Number(saved.coins) || 0;
      qState.stars = Number(saved.stars) || 0;

      // Sync world & tools to restored checkpoint!
      if (qState.bottleFound && world.state.bottle1Mesh) world.state.bottle1Mesh.visible = false;
      world.setBridgePlanksFixed(qState.planksFixed);
      if (qState.zone >= 2) world.setGateOpen(1, true);
      if (qState.zone >= 4) world.setGateOpen(3, true);
      if (qState.zone >= 5) {
        world.setGateOpen(4, true);
        npcs.moveCaptainToSunsetCove();
      }
      if (qState.wreckLooted || qState.zone >= 4) {
        player.unlockTool('spyglass');
        player.unlockTool('lantern');
        if (world.state.wreckChestClosed) world.state.wreckChestClosed.visible = false;
        if (world.state.wreckChestOpen) world.state.wreckChestOpen.visible = true;
      }
      if (qState.zone >= 5 || qState.treasureFound) {
        player.unlockTool('shovel');
      }
      for (var t = 0; t < world.state.caveTorches.length; t++) {
        world.state.caveTorches[t].lit = (t < qState.torchesCursor || qState.zone >= 5);
      }
      if (qState.treasureFound) {
        if (world.state.finalChestOpen) world.state.finalChestOpen.visible = true;
      }
      refreshGuideAndGoal();
    }

    function exportProgress() {
      return {
        zone: qState.zone,
        subStep: qState.subStep,
        bottleFound: qState.bottleFound,
        shellsDone: qState.shellsDone,
        planksFixed: qState.planksFixed,
        wreckLooted: qState.wreckLooted,
        spyWaterfall: qState.spyWaterfall,
        spyPalms: qState.spyPalms,
        torchesCursor: qState.torchesCursor,
        treasureFound: qState.treasureFound,
        coins: qState.coins,
        stars: qState.stars
      };
    }

    function awardReward(coinsAdd, zoneCompletedNum) {
      qState.coins += coinsAdd || 0;
      if (zoneCompletedNum >= 1 && zoneCompletedNum <= 5) {
        qState.stars = Math.max(qState.stars, zoneCompletedNum);
        if (pfx) {
          pfx.celebrateZone(zoneCompletedNum);
          pfx.spawn3D('firework-burst', player.state.x, player.state.y + 4.4, player.state.z, 3.6, { mode: 'center', additive: true });
        }
      }
      if (uiHooks.onStatsChanged) uiHooks.onStatsChanged(qState);
      if (uiHooks.onCheckpointSave) uiHooks.onCheckpointSave(exportProgress(), coinsAdd || 0, zoneCompletedNum ? 1 : 0, zoneCompletedNum || 0);
    }

    // Tell Pet Companion where the nearest uncollected secret is!
    player.state.secretTargetFn = function () {
      if (qState.zone === 1 && !qState.bottleFound) return world.SPOTS.bottle1;
      if (qState.zone === 2 && qState.shellsDone && qState.planksFixed < 3 && !player.state.carryingPlank) {
        for (var i = 0; i < world.state.plankPickups.length; i++) {
          var pk = world.state.plankPickups[i];
          if (pk.valid && !pk.taken) return pk;
        }
      }
      if (qState.zone === 3 && !qState.wreckLooted) return world.SPOTS.wreckChest;
      if (qState.zone === 4 && qState.spyWaterfall && qState.spyPalms && qState.torchesCursor < 3) {
        return world.state.caveTorches[qState.torchesCursor];
      }
      if (qState.zone >= 5 && !qState.treasureFound) return world.SPOTS.mounds[0];
      return null;
    };

    function refreshGuideAndGoal() {
      var goalTxt = '';
      var S = world.SPOTS;
      var isG4 = grade === 4;

      if (qState.zone === 1) {
        if (!qState.bottleFound) {
          goalTxt = qState.subStep === 'talk'
            ? 'Zone 1 · Talk to Benbow outside the Inn!'
            : 'Zone 1 · Splash into the shallow bay & grab the Bottle Map!';
          var t1 = qState.subStep === 'talk' ? S.benbowNpc : S.bottle1;
          npcs.setGuideTarget(t1.x + 2.3, 2.3, t1.z - 0.6);
        } else {
          goalTxt = 'Zone 1 · Tell Benbow where the bottle map leads!';
          npcs.setGuideTarget(S.benbowNpc.x + 2.3, 2.5, S.benbowNpc.z - 0.6);
        }
      } else if (qState.zone === 2) {
        if (!qState.shellsDone) {
          goalTxt = qState.subStep === 'talk'
            ? 'Zone 2 · Meet Cook by his bubbling soup pot!'
            : ('Zone 2 · Tap Giant Shells: ' + (isG4 ? 'BLUE → PINK → GREEN → YELLOW' : 'BLUE → PINK → YELLOW'));
          var t2 = qState.subStep === 'talk' ? S.cookNpc : S.shellsCenter;
          npcs.setGuideTarget(t2.x + 2.4, 2.8, t2.z - 0.5);
        } else if (qState.planksFixed < 3) {
          goalTxt = player.state.carryingPlank
            ? ('Zone 2 · Carry "' + player.state.carryingPlank.word + '" to the Broken Creek Bridge!')
            : ('Zone 2 · Carry 3 ' + (isG4 ? 'Adventure' : 'Past-Tense') + ' Planks to fix the Bridge (' + qState.planksFixed + '/3)');
          npcs.setGuideTarget(12.5, 3.2, 11.4);
        }
      } else if (qState.zone === 3) {
        if (!qState.wreckLooted) {
          goalTxt = player.state.mode === 'boat'
            ? 'Zone 3 · Row East to Shipwreck Island & open the Chest!'
            : 'Zone 3 · Talk to Captain & row the boat to Shipwreck Island!';
          var t3 = player.state.mode === 'boat' ? S.wreckChest : S.captainNpc;
          npcs.setGuideTarget(t3.x - 1.8, 2.8, t3.z - 1.2);
        } else {
          goalTxt = 'Zone 3 · Row back to the Dock & show Captain your Spyglass!';
          npcs.setGuideTarget(S.captainNpc.x - 1.8, 2.8, S.captainNpc.z - 1.0);
        }
      } else if (qState.zone === 4) {
        if (!qState.spyWaterfall || !qState.spyPalms) {
          goalTxt = player.state.mode === 'spyglass'
            ? 'Zone 4 · Aim Spyglass at Waterfall Cave (NW) & Twin Palms (W)!'
            : 'Zone 4 · Cross the swaying Rope Bridge & climb the Lookout Tower!';
          npcs.setGuideTarget(S.lookoutTower.x - 2.2, 6.2, S.lookoutTower.z + 1.2);
        } else {
          var words = isG4 ? ['COURAGE', 'WISDOM', 'TREASURE'] : ['SUN', 'MOON', 'STAR'];
          goalTxt = 'Zone 4 · Enter Dark Waterfall Cave with Lantern! Light: ' + (words[qState.torchesCursor] || 'Done!');
          npcs.setGuideTarget(S.caveMouth.x + 2.0, 5.6, S.caveMouth.z + 1.2);
        }
      } else if (qState.zone === 5 && !qState.treasureFound) {
        goalTxt = 'Zone 5 · Read Captain\'s clue & dig with Shovel between Twin Palms near Big Rock!';
        npcs.setGuideTarget(S.coveCaptNpc.x + 1.8, 3.2, S.coveCaptNpc.z - 1.2);
      } else {
        goalTxt = '🏆 Treasure Island Champion! Explore freely, row, or check your Passport!';
        npcs.setGuideTarget(S.mounds[0].x + 2.4, 3.0, S.mounds[0].z - 1.2);
      }

      if (uiHooks.onGoalText) uiHooks.onGoalText(goalTxt, qState.zone);
    }

    // ---------- 3. Live In-World NPC Conversations (With Spoken Reply Pills & Mic!) ----------
    function openDialogue(npcId, title, lineText, voiceKey, replies) {
      var npcObj = npcs.pirates[npcId] || null;
      Object.keys(npcs.pirates).forEach(function (k) { npcs.pirates[k].talking = (k === npcId); });
      if (npcObj) {
        player.state.dialogueFocus = { x: npcObj.x, y: npcObj.y, z: npcObj.z };
        player.state.yaw = Math.atan2(npcObj.x - player.state.x, npcObj.z - player.state.z);
        if (pfx) {
          pfx.spawn3D('exclamation', npcObj.x, (npcObj.y || 0) + (npcObj.height || 1.7) + 0.55, npcObj.z, 1.35, { mode: 'center', riseSpeed: 0.14 });
        }
      }
      sfx.speakClipOrText(voiceKey, lineText, function () {
        if (npcObj) npcObj.talking = false;
      });
      uiHooks.showDialogue({
        npcId: npcId,
        speaker: title,
        text: lineText,
        voiceKey: voiceKey,
        replies: replies || []
      });
    }

    function closeDialogue() {
      Object.keys(npcs.pirates).forEach(function (k) { npcs.pirates[k].talking = false; });
      player.state.dialogueFocus = null;
      uiHooks.hideDialogue();
    }

    function talkToBenbow() {
      var g4 = grade === 4;
      if (qState.zone === 1 && !qState.bottleFound) {
        qState.subStep = 'find_bottle';
        refreshGuideAndGoal();
        openDialogue(
          'benbow',
          '🐆 Innkeeper Benbow',
          g4
            ? 'Ahoy, brave explorer! Someone left a glass bottle near the shallow bay. Pick it up and read the first clue!'
            : 'Welcome to Treasure Island, explorer! Find the glass bottle by the shallow water and bring me the secret map!',
          g4 ? 'z1_benbow_hi_g4' : 'z1_benbow_hi_g3',
          [
            { text: g4 ? 'I will search the shallow bay!' : 'Okay! Let\'s find the bottle!', correct: true, onPick: function () { closeDialogue(); } }
          ]
        );
      } else if (qState.zone === 1 && qState.bottleFound) {
        openDialogue(
          'benbow',
          '🐆 Innkeeper Benbow',
          g4
            ? 'Read the bottle message carefully! Which way should we travel to reach the jungle camp?'
            : 'Look at the map! Where does the golden path go first?',
          g4 ? 'z1_benbow_ask_g4' : 'z1_benbow_ask_g3',
          g4
            ? [
                { text: 'Across the sunny jungle to Cook\'s camp!', correct: true, onPick: completeZone1 },
                { text: 'Under the deep cold ocean!', correct: false },
                { text: 'Back to sleep on the ship!', correct: false }
              ]
            : [
                { text: 'To the jungle camp!', correct: true, onPick: completeZone1 },
                { text: 'Into the deep sea!', correct: false },
                { text: 'Up to the moon!', correct: false }
              ]
        );
      } else {
        openDialogue('benbow', '🐆 Innkeeper Benbow', 'Brilliant work, explorer! Follow the jungle path to help Cook!', 'z1_benbow_win', [
          { text: 'Thank you, Benbow!', correct: true, onPick: closeDialogue }
        ]);
      }
    }

    function completeZone1() {
      qState.zone = 2;
      qState.subStep = 'talk';
      world.setGateOpen(1, true);
      sfx.playWinChord();
      burstGoldCoins(world.SPOTS.benbowNpc.x, 1.5, world.SPOTS.benbowNpc.z, 16);
      awardReward(20, 1);
      refreshGuideAndGoal();
      openDialogue(
        'benbow',
        '🐆 Innkeeper Benbow',
        'Brilliant work! Take this golden compass! The jungle gate is open now!',
        'z1_benbow_win',
        [{ text: 'Let\'s go to the Jungle Camp! 🌴', correct: true, onPick: closeDialogue }]
      );
    }

    function talkToCook() {
      var g4 = grade === 4;
      if (qState.zone < 2) {
        qState.zone = 2;
        world.setGateOpen(1, true);
      }
      if (!qState.shellsDone) {
        qState.subStep = 'shells';
        qState.shellCursor = 0;
        refreshGuideAndGoal();
        openDialogue(
          'cook',
          '🍲 Island Chef Cook',
          g4
            ? 'Welcome to my jungle kitchen! A storm broke our creek bridge! First, listen and tap the giant musical shells: blue, pink, green, yellow!'
            : 'Hello, friend! My wooden bridge broke yesterday! First, tap the three giant shells in my song order: blue, pink, yellow!',
          g4 ? 'z2_cook_hi_g4' : 'z2_cook_hi_g3',
          [
            {
              text: g4 ? 'Blue, pink, green, yellow!' : 'Blue, pink, yellow!',
              correct: true,
              onPick: function () {
                closeDialogue();
                demoPlayShellSong();
              }
            }
          ]
        );
      } else if (qState.planksFixed < 3) {
        openDialogue(
          'cook',
          '🍲 Island Chef Cook',
          g4
            ? 'Fantastic! Now carry the three adventure planks to repair the bridge: explored, climbed, discovered!'
            : 'Awesome! Now carry the three past-tense planks to fix the bridge: walked, jumped, sailed!',
          g4 ? 'z2_cook_planks_g4' : 'z2_cook_planks_g3',
          [{ text: 'I will fix the bridge! 🪵', correct: true, onPick: closeDialogue }]
        );
      } else {
        openDialogue('cook', '🍲 Island Chef Cook', 'Hooray! You fixed the wooden bridge! Cross the creek to the boat lagoon!', 'z2_cook_win', [
          { text: 'On my way, Chef! 🚣', correct: true, onPick: closeDialogue }
        ]);
      }
    }

    function demoPlayShellSong() {
      var seq = grade === 4 ? ['blue', 'pink', 'green', 'yellow'] : ['blue', 'pink', 'yellow'];
      seq.forEach(function (key, i) {
        setTimeout(function () {
          var sh = world.state.shellObjs.find(function (s) { return s.key === key; });
          if (sh) {
            sh.pulse = 1.0;
            sfx.playShellTone(sh.note);
          }
        }, 350 + i * 480);
      });
    }

    function tapMusicalShell(shellObj) {
      if (!shellObj) return;
      shellObj.pulse = 1.0;
      sfx.playShellTone(shellObj.note);
      if (qState.zone < 2 || qState.shellsDone) return;
      if (qState.subStep === 'talk') qState.subStep = 'shells';

      var seq = grade === 4 ? ['blue', 'pink', 'green', 'yellow'] : ['blue', 'pink', 'yellow'];
      var expected = seq[qState.shellCursor];
      if (shellObj.key === expected) {
        qState.shellCursor++;
        if (pfx) {
          pfx.spawn3D('collect-burst', shellObj.x, world.sampleTerrainHeight(shellObj.x, shellObj.z) + 1.15, shellObj.z, 1.85, { mode: 'center' });
        }
        uiHooks.showToast('🐚 ' + shellObj.key.toUpperCase() + '! (' + qState.shellCursor + '/' + seq.length + ')', '#2fc58a');
        if (qState.shellCursor >= seq.length) {
          qState.shellsDone = true;
          qState.subStep = 'planks';
          world.state.shellObjs.forEach(function (s) { if (s.label) s.label.visible = false; });
          sfx.playWinChord();
          burstGoldCoins(shellObj.x, 1.8, shellObj.z, 12);
          awardReward(15, 0);
          refreshGuideAndGoal();
          setTimeout(talkToCook, 550);
        }
      } else {
        qState.shellCursor = 0;
        sfx.playSoftFail();
        uiHooks.showToast('🎵 Listen again: ' + seq.join(' → ').toUpperCase() + '!', '#ffb320');
        setTimeout(demoPlayShellSong, 450);
      }
    }

    function tapPlankPickup(pk) {
      if (!pk || pk.taken) return;
      if (player.state.carryingPlank) {
        uiHooks.showToast('🪵 Walk to the Broken Creek Bridge to place your plank first!', '#4f9dff');
        return;
      }
      sfx.speakTTS(pk.word);
      if (!pk.valid) {
        sfx.playSoftFail();
        uiHooks.showToast('🦜 "' + pk.word + '" is not an action verb! Try an -ed adventure plank!', '#ffb320');
        return;
      }
      pk.taken = true;
      pk.group.visible = false;
      player.setCarryingPlank(pk);
      if (pfx) {
        pfx.spawn3D('collect-burst', pk.x, world.sampleTerrainHeight(pk.x, pk.z) + 0.75, pk.z, 1.75, { mode: 'center' });
      }
      sfx.playCoin();
      uiHooks.showToast('🪵 Carrying "' + pk.word + '"! Walk to the Broken Creek Bridge!', '#2fc58a');
      refreshGuideAndGoal();
    }

    function tryPlaceBridgePlank() {
      var carried = player.state.carryingPlank;
      if (!carried) return false;
      player.setCarryingPlank(null);
      qState.planksFixed = Math.min(3, qState.planksFixed + 1);
      world.setBridgePlanksFixed(qState.planksFixed);
      var pSlotX = 12.0 + (qState.planksFixed - 1) * 2.0;
      player.spawnDustPuff(pSlotX, 1.75, 13.5, 0xffe4b5, 5);
      if (pfx) {
        pfx.spawn3D('heavy-landing', pSlotX, 1.72, 13.5, 2.35);
        pfx.spawn3D('collect-burst', pSlotX, 2.30, 13.5, 1.90, { mode: 'center' });
      }
      sfx.playDig();
      sfx.playCoin();
      awardReward(10, qState.planksFixed >= 3 ? 2 : 0);

      if (qState.planksFixed >= 3) {
        qState.zone = Math.max(qState.zone, 3);
        qState.subStep = 'talk';
        sfx.playWinChord();
        burstGoldCoins(14.0, 2.2, 13.5, 18);
        refreshGuideAndGoal();
        openDialogue(
          'cook',
          '🍲 Island Chef Cook',
          'Hooray! You fixed the wooden bridge! Cross the creek to the boat lagoon!',
          'z2_cook_win',
          [{ text: 'Awesome! Across the bridge! 🌉', correct: true, onPick: closeDialogue }]
        );
      } else {
        uiHooks.showToast('🔨 Plank placed! (' + qState.planksFixed + '/3 fixed)', '#2fc58a');
        refreshGuideAndGoal();
      }
      return true;
    }

    function talkToCaptain() {
      var g4 = grade === 4;
      // If in Zone 5 (Sunset Cove Finale!)
      if (qState.zone >= 5) {
        if (!qState.treasureFound) {
          openDialogue(
            'captain',
            '⚓ Captain Smollett',
            g4
              ? 'Here is Billy\'s last riddle! Use your shovel to dig between the twin palm trees beside the giant boulder!'
              : 'Read the final clue! Dig with your shovel between the two tall palm trees near the big grey rock!',
            g4 ? 'z5_capt_clue_g4' : 'z5_capt_clue_g3',
            [
              {
                text: g4 ? 'Between the twin palms beside the boulder!' : 'Between the two palm trees near the big rock!',
                correct: true,
                onPick: function () {
                  player.setTool('shovel', false);
                  closeDialogue();
                }
              }
            ]
          );
        } else {
          openDialogue('captain', '⚓ Captain Smollett', 'You found the legendary Treasure of Adventure Island! Gold coins and your Passport Stamp are yours!', 'z5_finale_win', [
            { text: 'Best adventure ever! 🏆', correct: true, onPick: closeDialogue }
          ]);
        }
        return;
      }

      if (qState.zone < 3) qState.zone = 3;
      if (!qState.wreckLooted) {
        qState.subStep = 'row';
        refreshGuideAndGoal();
        openDialogue(
          'captain',
          '⚓ Captain Smollett',
          g4
            ? 'Ahoy, sailor! The deep sea is too deep for walking, so board the rowing boat and row east to Shipwreck Island!'
            : 'Ahoy, matey! Hop into the wooden rowing boat on the dock! Row across the deep bay to the old shipwreck!',
          g4 ? 'z3_capt_hi_g4' : 'z3_capt_hi_g3',
          [
            { text: g4 ? 'I will row east to Shipwreck Island!' : 'Let\'s row the boat!', correct: true, onPick: closeDialogue }
          ]
        );
      } else {
        completeZone3();
      }
    }

    function lootShipwreckChest() {
      if (qState.wreckLooted) return;
      qState.wreckLooted = true;
      if (world.state.wreckChestClosed) world.state.wreckChestClosed.visible = false;
      if (world.state.wreckChestOpen) world.state.wreckChestOpen.visible = true;
      var wcy = world.sampleTerrainHeight(world.SPOTS.wreckChest.x, world.SPOTS.wreckChest.z);
      if (pfx) {
        pfx.spawn3D('chest-open', world.SPOTS.wreckChest.x, wcy + 0.35, world.SPOTS.wreckChest.z, 2.55, { startFrame: 14, cropBottom: 0.26 });
        pfx.spawn3D('collect-burst', world.SPOTS.wreckChest.x, wcy + 1.45, world.SPOTS.wreckChest.z, 2.30, { mode: 'center' });
        pfx.spawn3D('firework-burst', world.SPOTS.wreckChest.x, wcy + 4.2, world.SPOTS.wreckChest.z, 3.4, { mode: 'center', additive: true });
      }
      player.unlockTool('spyglass');
      player.unlockTool('lantern');
      player.setTool('spyglass', false);
      sfx.playWinChord();
      sfx.speakClipOrText('z3_parrot_wreck', 'Look! Inside the shipwreck! Grab the brass spyglass and the glowing cave lantern!');
      burstGoldCoins(world.SPOTS.wreckChest.x, 1.5, world.SPOTS.wreckChest.z, 18);
      awardReward(25, 0);
      uiHooks.showToast('🔭 Unlocked Brass Spyglass & 🏮 Glowing Cave Lantern!', '#ffb320');
      refreshGuideAndGoal();
    }

    function completeZone3() {
      if (qState.zone < 4) {
        qState.zone = 4;
        qState.subStep = 'spyglass';
        world.setGateOpen(3, true);
        sfx.playWinChord();
        burstGoldCoins(world.SPOTS.captainNpc.x, 1.8, world.SPOTS.captainNpc.z, 18);
        awardReward(20, 3);
      }
      refreshGuideAndGoal();
      openDialogue(
        'captain',
        '⚓ Captain Smollett',
        'Shiver me timbers! You found the spyglass and the lantern! The rope bridge to the lookout tower is open!',
        'z3_capt_win',
        [{ text: 'Up to the Lookout Tower! 🔭', correct: true, onPick: closeDialogue }]
      );
    }

    function talkToFlint() {
      var g4 = grade === 4;
      if (qState.zone < 4) {
        qState.zone = 4;
        world.setGateOpen(3, true);
      }
      if (!qState.spyWaterfall || !qState.spyPalms) {
        openDialogue(
          'flint',
          '🦜 First Mate Flint',
          g4
            ? 'Halt, explorer! Cross the swaying rope bridge, climb the lookout tower, and scan the island with your spyglass!'
            : 'Squawk! I am Flint! Jump across the swaying rope bridge and climb the tall lookout tower!',
          g4 ? 'z4_flint_hi_g4' : 'z4_flint_hi_g3',
          [{ text: 'I will climb the tower and look! 🔭', correct: true, onPick: closeDialogue }]
        );
      } else if (qState.torchesCursor < 3) {
        openDialogue(
          'flint',
          '🦜 First Mate Flint',
          g4
            ? 'Your lantern lights the dark cave! Touch the three ancient crystals in order: courage, wisdom, treasure!'
            : 'Hold your lantern inside the dark waterfall cave! Light the three torches: sun, moon, star!',
          g4 ? 'z4_flint_cave_g4' : 'z4_flint_cave_g3',
          [
            {
              text: g4 ? 'Courage, wisdom, treasure!' : 'Sun, moon, star!',
              correct: true,
              onPick: function () {
                player.setTool('lantern', false);
                closeDialogue();
              }
            }
          ]
        );
      } else {
        openDialogue('flint', '🦜 First Mate Flint', 'Incredible! Take this golden shovel! Sunset Cove is open for the final treasure!', 'z4_flint_win', [
          { text: 'To Sunset Treasure Cove! ⛏️', correct: true, onPick: closeDialogue }
        ]);
      }
    }

    // Check Spyglass Reticle Aim!
    function checkSpyglassSpot() {
      if (player.state.mode !== 'spyglass') return null;
      var camDir = new T3.Vector3();
      player.playerGroup.parent && root.K3 && root.K3.camera && root.K3.camera.getWorldDirection(camDir);
      var camPos = root.K3.camera.position;

      var targets = [
        { key: 'waterfall', label: '🌊 Secret Waterfall Cave (North-West)', pos: new T3.Vector3(world.SPOTS.waterfall.x, 5.5, world.SPOTS.waterfall.z) },
        { key: 'palms',     label: '🌴 Twin Palms Treasure Cove (West)',    pos: new T3.Vector3(world.SPOTS.twinPalmA.x, 4.0, world.SPOTS.twinPalmA.z) },
        { key: 'wreck',     label: '🚢 Old Shipwreck Island (East)',        pos: new T3.Vector3(world.SPOTS.shipwreckModel.x, 3.0, world.SPOTS.shipwreckModel.z) }
      ];

      var best = null;
      targets.forEach(function (tg) {
        var toT = tg.pos.clone().sub(camPos).normalize();
        var dot = camDir.dot(toT);
        if (dot > 0.965) best = tg;
      });
      return best;
    }

    function confirmSpyglassSpot(spot) {
      if (!spot) return;
      if (spot.key === 'waterfall' && !qState.spyWaterfall) {
        qState.spyWaterfall = true;
        sfx.playCoin();
        uiHooks.showToast('🔭 Spotted: Secret Waterfall Cave!', '#4f9dff');
      } else if (spot.key === 'palms' && !qState.spyPalms) {
        qState.spyPalms = true;
        sfx.playCoin();
        uiHooks.showToast('🔭 Spotted: Twin Palms Treasure Cove!', '#2fc58a');
      } else {
        sfx.playCoin();
        uiHooks.showToast('🔭 ' + spot.label, '#ffb320');
      }
      if (qState.spyWaterfall && qState.spyPalms && qState.zone === 4 && qState.subStep !== 'cave') {
        qState.subStep = 'cave';
        sfx.playWinChord();
        awardReward(15, 0);
        refreshGuideAndGoal();
        setTimeout(function () {
          player.exitSpyglassTower();
          talkToFlint();
        }, 700);
      } else {
        refreshGuideAndGoal();
      }
    }

    function touchCaveCrystal(torchObj) {
      if (!torchObj || torchObj.lit) return;
      player.setTool('lantern', false);
      var word = grade === 4 ? torchObj.g4 : torchObj.g3;
      sfx.speakTTS(word);
      if (torchObj.idx === qState.torchesCursor) {
        torchObj.lit = true;
        qState.torchesCursor++;
        if (pfx) {
          pfx.spawn3D('collect-burst', torchObj.x, world.sampleTerrainHeight(torchObj.x, torchObj.z) + 1.85, torchObj.z, 2.25, { mode: 'center' });
        }
        sfx.playShellTone(523.25 + torchObj.idx * 130);
        uiHooks.showToast('🏮 Lit Crystal: ' + word.toUpperCase() + '! (' + qState.torchesCursor + '/3)', '#ffb320');
        if (qState.torchesCursor >= 3) {
          qState.zone = 5;
          qState.subStep = 'dig';
          player.unlockTool('shovel');
          world.setGateOpen(4, true);
          npcs.moveCaptainToSunsetCove();
          sfx.playWinChord();
          burstGoldCoins(torchObj.x, 5.2, torchObj.z, 20);
          awardReward(25, 4);
          refreshGuideAndGoal();
          setTimeout(function () {
            sfx.speakClipOrText('z4_flint_win', 'Incredible! Take this golden shovel! Sunset Cove is open for the final treasure!');
            uiHooks.showToast('⛏️ Unlocked Golden Shovel! Head West to Sunset Treasure Cove!', '#2fc58a');
          }, 500);
        } else {
          refreshGuideAndGoal();
        }
      } else {
        var orderTxt = grade === 4 ? 'COURAGE → WISDOM → TREASURE' : 'SUN → MOON → STAR';
        sfx.playSoftFail();
        uiHooks.showToast('🏮 Touch in order: ' + orderTxt + '!', '#ffb320');
      }
    }

    function digTreasureMound(moundObj) {
      if (!moundObj || moundObj.dug) return;
      player.playDigScoop(moundObj.x, moundObj.z);

      if (!moundObj.correct) {
        moundObj.dug = true;
        moundObj.group.scale.setScalar(0.65);
        sfx.playSoftFail();
        sfx.speakClipOrText('z5_parrot_wrong', 'Oops, only crabs and seashells here! Listen to the clue again: between the two palm trees near the big rock!');
        uiHooks.showToast('🦀 Oops! Only crabs here! Clue: BETWEEN the TWO palm trees NEAR the big grey rock!', '#ffb320');
        return;
      }

      moundObj.scoops = (moundObj.scoops || 0) + 1;
      if (moundObj.scoops === 1) {
        if (world.state.finalChestClosed) {
          world.state.finalChestClosed.visible = true;
          world.state.finalChestClosed.position.y = world.sampleTerrainHeight(moundObj.x, moundObj.z) - 0.35;
        }
        uiHooks.showToast('⛏️ *CLINK!* Something wooden is buried here! Dig again! (1/3)', '#ffb320');
      } else if (moundObj.scoops === 2) {
        if (world.state.finalChestClosed) {
          world.state.finalChestClosed.position.y = world.sampleTerrainHeight(moundObj.x, moundObj.z) - 0.08;
        }
        sfx.playCoin();
        uiHooks.showToast('⛏️ Almost out! One more big scoop! (2/3)', '#2fc58a');
      } else {
        moundObj.dug = true;
        moundObj.group.visible = false;
        if (world.state.finalChestClosed) world.state.finalChestClosed.visible = false;
        if (world.state.finalChestOpen) world.state.finalChestOpen.visible = true;
        qState.treasureFound = true;
        qState.zone = 6;
        sfx.playWinChord();
        var mgy = world.sampleTerrainHeight(moundObj.x, moundObj.z);
        if (pfx) {
          pfx.spawn3D('chest-open', moundObj.x, mgy + 0.38, moundObj.z, 3.10, { startFrame: 14, cropBottom: 0.26 });
          pfx.spawn3D('collect-burst', moundObj.x, mgy + 1.65, moundObj.z, 2.65, { mode: 'center' });
          [
            [0, 4.6, 0, 0],
            [-3.4, 5.8, -2.2, 320],
            [3.6, 6.2, 1.8, 650],
            [-2.2, 6.8, 2.8, 980],
            [2.5, 5.4, -2.8, 1320]
          ].forEach(function (fw) {
            setTimeout(function () {
              pfx.spawn3D('firework-burst', moundObj.x + fw[0], mgy + fw[1], moundObj.z + fw[2], 4.2, { mode: 'center', additive: true });
            }, fw[3]);
          });
        }
        burstGoldCoins(moundObj.x, mgy + 0.8, moundObj.z, 45);
        awardReward(50, 5);
        refreshGuideAndGoal();
        sfx.speakClipOrText('z5_finale_win', 'You found the legendary Treasure of Adventure Island! Gold coins and your Passport Stamp are yours!');
        if (uiHooks.onGrandFinale) uiHooks.onGrandFinale(qState);
      }
    }

    function pickupBottle1() {
      if (qState.bottleFound) return;
      qState.bottleFound = true;
      if (world.state.bottle1Mesh) world.state.bottle1Mesh.visible = false;
      if (pfx) {
        pfx.spawn3D('collect-burst', world.SPOTS.bottle1.x, 0.78, world.SPOTS.bottle1.z, 2.15, { mode: 'center' });
        pfx.spawn3D('splash', world.SPOTS.bottle1.x, 0.04, world.SPOTS.bottle1.z, 1.95, { startFrame: 5 });
      }
      sfx.playWinChord();
      burstGoldCoins(world.SPOTS.bottle1.x, 0.8, world.SPOTS.bottle1.z, 10);
      awardReward(10, 0);
      refreshGuideAndGoal();
      if (uiHooks.onShowBottleScroll) {
        uiHooks.onShowBottleScroll(grade);
      }
    }

    // ---------- 4. Contextual Nearby Action Detector (Updates Bottom Action Button Automatically!) ----------
    function detectContextAction() {
      var px = player.state.x, pz = player.state.z;
      function near(pt, r) { return Math.hypot(px - pt.x, pz - pt.z) <= r; }

      if (player.state.dialogueFocus) return null;

      if (player.state.mode === 'spyglass') {
        var sp = checkSpyglassSpot();
        if (sp) return { id: 'spy-spot', label: '🔭 Spot: ' + sp.label.split('(')[0], run: function () { confirmSpyglassSpot(sp); } };
        return { id: 'spy-exit', label: '🪜 Climb Down Tower', run: function () { player.exitSpyglassTower(); } };
      }

      if (player.state.mode === 'boat') {
        if (Math.hypot(px - world.SPOTS.boatWreckDock.x, pz - world.SPOTS.boatWreckDock.z) < 5.5) {
          return { id: 'dock-wreck', label: '⚓ Hop Ashore (Shipwreck Island)', run: function () { player.exitBoat(60.6, 13.0); refreshGuideAndGoal(); } };
        }
        if (Math.hypot(px - world.SPOTS.boatHome.x, pz - world.SPOTS.boatHome.z) < 5.2) {
          return { id: 'dock-home', label: '⚓ Hop onto Lagoon Dock', run: function () { player.exitBoat(36.8, 14.0); refreshGuideAndGoal(); } };
        }
        return null;
      }

      if (player.state.mode === 'rest') {
        return { id: 'stand-up', label: '🏃 Stand Up & Explore', run: function () { player.exitRest(); } };
      }

      // Bottle #1 in shallow bay
      if (!qState.bottleFound && near(world.SPOTS.bottle1, 2.8)) {
        return { id: 'bottle', label: '🍾 Pick Up Secret Bottle!', run: pickupBottle1 };
      }

      // Place carried plank at Broken Creek Bridge
      if (player.state.carryingPlank && px > 7.8 && px < 16.5 && Math.abs(pz - 13.5) < 3.6) {
        return { id: 'place-plank', label: '🔨 Fix Bridge with "' + player.state.carryingPlank.word + '"!', run: tryPlaceBridgePlank };
      }

      // Plank pickups
      if (!player.state.carryingPlank) {
        for (var pi = 0; pi < world.state.plankPickups.length; pi++) {
          var pk = world.state.plankPickups[pi];
          if (!pk.taken && near(pk, 2.2)) {
            return { id: 'pick-plank', label: '🪵 Pick Up Plank: "' + pk.word + '"', run: (function (p) { return function () { tapPlankPickup(p); }; })(pk) };
          }
        }
      }

      // Giant Musical Shells (only show context prompt before shell puzzle is completed!)
      if (!qState.shellsDone) {
        for (var si = 0; si < world.state.shellObjs.length; si++) {
          var sh = world.state.shellObjs[si];
          if (near(sh, 2.1)) {
            return { id: 'shell', label: '🐚 Tap ' + sh.key.toUpperCase() + ' Shell!', run: (function (s) { return function () { tapMusicalShell(s); }; })(sh) };
          }
        }
      }

      // Shipwreck Supply Chest
      if (!qState.wreckLooted && near(world.SPOTS.wreckChest, 3.0)) {
        return { id: 'wreck-chest', label: '🧰 Open Shipwreck Chest!', run: lootShipwreckChest };
      }

      // Rowing Boat Boarding (from Lagoon Dock or Shipwreck Shore)
      if (Math.hypot(px - player.boatGroup.position.x, pz - player.boatGroup.position.z) < 4.8) {
        return { id: 'board-boat', label: '🚣 Hop Into Rowing Boat!', run: function () { player.enterBoat(); refreshGuideAndGoal(); } };
      }

      // Lookout Tower Climb & Spyglass
      if (near(world.SPOTS.lookoutTower, 3.8)) {
        return { id: 'climb-tower', label: '🔭 Climb Tower & Use Spyglass!', run: function () { player.enterSpyglassTower(); refreshGuideAndGoal(); } };
      }

      // Dark Cave Crystals / Torches
      for (var ti = 0; ti < world.state.caveTorches.length; ti++) {
        var tc = world.state.caveTorches[ti];
        if (!tc.lit && near(tc, 2.5)) {
          var w = grade === 4 ? tc.g4 : tc.g3;
          return { id: 'torch', label: '🏮 Light Crystal: ' + w.toUpperCase(), run: (function (t) { return function () { touchCaveCrystal(t); }; })(tc) };
        }
      }

      // Zone 5 Diggable X Mounds
      for (var mi = 0; mi < world.state.moundObjs.length; mi++) {
        var md = world.state.moundObjs[mi];
        if (!md.dug && near(md, 2.5)) {
          return { id: 'dig', label: '⛏️ Dig X Mound Here!', run: (function (m) { return function () { digTreasureMound(m); }; })(md) };
        }
      }

      // Rigged Pirate NPCs
      if (npcs.pirates.benbow && near(npcs.pirates.benbow, 3.4)) return { id: 'talk-benbow', label: '💬 Talk to Benbow', run: talkToBenbow };
      if (npcs.pirates.cook && near(npcs.pirates.cook, 3.4)) return { id: 'talk-cook', label: '💬 Talk to Chef Cook', run: talkToCook };
      if (npcs.pirates.captain && near(npcs.pirates.captain, 3.6)) return { id: 'talk-captain', label: '💬 Talk to Captain', run: talkToCaptain };
      if (npcs.pirates.flint && near(npcs.pirates.flint, 3.4)) return { id: 'talk-flint', label: '💬 Talk to Flint', run: talkToFlint };

      // Friendly Classmates High-Five
      for (var cmi = 0; cmi < npcs.classmates.length; cmi++) {
        var cm = npcs.classmates[cmi];
        if (near(cm, 2.4) && cm.cheerTimer <= 0) {
          return {
            id: 'high-five',
            label: '✋ High-Five Classmate!',
            run: (function (c) {
              return function () {
                npcs.highFiveClassmate(c);
                if (pfx) pfx.spawn3D('collect-burst', c.x, (c.y || 0) + 1.35, c.z, 1.75, { mode: 'center' });
                awardReward(3, 0);
                uiHooks.showToast('✋ High-Five! +3 🪙', '#ff5fa2');
              };
            })(cm)
          };
        }
      }

      // Cozy Campfire & Palm Hammock Rest!
      if (near(world.SPOTS.campfire, 2.8)) {
        return {
          id: 'rest-fire',
          label: '🔥 Warm Up by Campfire',
          run: function () {
            player.enterRest('campfire', world.SPOTS.campfire.x - 1.4, world.SPOTS.campfire.z + 1.1, 0.9);
            if (!qState.restedFire) { qState.restedFire = true; sfx.playCoin(); awardReward(5, 0); }
            uiHooks.showToast('🔥 Cozy campfire rest! (+5 🪙)', '#ffb320');
          }
        };
      }
      if (near(world.SPOTS.hammock, 2.8)) {
        return {
          id: 'rest-hammock',
          label: '🌴 Relax on Palm Hammock',
          run: function () {
            player.enterRest('hammock', world.SPOTS.hammock.x, world.SPOTS.hammock.z, 0.85);
            if (!qState.restedHammock) { qState.restedHammock = true; sfx.playCoin(); awardReward(5, 0); }
            uiHooks.showToast('🌴 Swinging in the sea breeze! (+5 🪙)', '#2fc58a');
          }
        };
      }

      return null;
    }

    function update(dt) {
      for (var i = 0; i < coinBursts.length; i++) {
        var cb = coinBursts[i];
        if (cb.age < cb.maxAge) {
          cb.age += dt;
          cb.vy -= 14.0 * dt;
          cb.mesh.position.x += cb.vx * dt;
          cb.mesh.position.y += cb.vy * dt;
          cb.mesh.position.z += cb.vz * dt;
          var gy = world.sampleTerrainHeight(cb.mesh.position.x, cb.mesh.position.z) + 0.2;
          if (cb.mesh.position.y < gy) {
            cb.mesh.position.y = gy;
            cb.vy = Math.abs(cb.vy) * 0.45;
          }
          cb.mesh.rotation.y += dt * 9.0;
          if (cb.age >= cb.maxAge) cb.mesh.visible = false;
        }
      }
    }

    return {
      qState: qState,
      setGrade: setGrade,
      getGrade: function () { return grade; },
      loadSavedProgress: loadSavedProgress,
      exportProgress: exportProgress,
      refreshGuideAndGoal: refreshGuideAndGoal,
      detectContextAction: detectContextAction,
      talkToBenbow: talkToBenbow,
      talkToCook: talkToCook,
      talkToCaptain: talkToCaptain,
      talkToFlint: talkToFlint,
      tapMusicalShell: tapMusicalShell,
      tapPlankPickup: tapPlankPickup,
      tryPlaceBridgePlank: tryPlaceBridgePlank,
      lootShipwreckChest: lootShipwreckChest,
      touchCaveCrystal: touchCaveCrystal,
      digTreasureMound: digTreasureMound,
      pickupBottle1: pickupBottle1,
      closeDialogue: closeDialogue,
      burstGoldCoins: burstGoldCoins,
      update: update
    };
  }

  TI3D.createAudioEngine = createAudioEngine;
  TI3D.createQuestSystem = createQuestSystem;
})(typeof window !== 'undefined' ? window : this);
