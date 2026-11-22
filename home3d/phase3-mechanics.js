// Phase 3: Core Classroom Mechanics & Balanced Economy for 3D Adventure Island (home3d)
// 1) <= 2.5s Quick-Award Drawer with 60% Collective (Hot Air Balloon) / 40% Individual (Pupil Wallet) split
// 2) Amphitheater Fair Random Picker (zero repeats) + Rest Tent (absent pupil exclusion)
// 3) Windmill & Volcano 3-Mode Mic Meter (Whisper / Group Work / Festival lifting the Hot Air Balloon)
// 4) Running Track 4-Way Bottom-Screen Multi-Touch Split (90s 4-team Smartboard sprint)
// 5) Pupil Shop Vouchers + Thursday Visiting Ship + 3 Modular Build Pads (live 3D growth) + 1 Free Weekly Gratitude Heart
(function (root) {
  'use strict';

  var HOST = null, K = null, T3 = null;
  var IS_DEMO = /[?&]demo=1/.test(location.search);
  var STORE_KEY = 'eaa_home3d_phase3_v1';

  var REASONS = [
    { id: 'teamwork',    ico: '🤝', label: 'Teamwork',    c: '#ff5fa2', d: '#c93776', dark: false },
    { id: 'persistence', ico: '💪', label: 'Persistence', c: '#4f9dff', d: '#286ec2', dark: false },
    { id: 'focus',       ico: '🎯', label: 'Focus',       c: '#ffb320', d: '#c98200', dark: true  },
    { id: 'helping',     ico: '💛', label: 'Helping',     c: '#2fc58a', d: '#1b8f61', dark: false }
  ];

  var VOUCHERS = [
    { id: 'v-seat',   ico: '💺', name: 'Pick Your Seat',    cost: 15, desc: 'Choose your favorite seat for one lesson!', c: '#4f9dff', d: '#286ec2' },
    { id: 'v-helper', ico: '⭐', name: 'Teacher Helper',    cost: 20, desc: 'Be the official smartboard & class helper!', c: '#ffb320', d: '#c98200', dark: true },
    { id: 'v-song',   ico: '🎵', name: 'Pick Class Song',   cost: 25, desc: 'Choose our warm-up or clean-up English song!', c: '#ff5fa2', d: '#c93776' },
    { id: 'v-line',   ico: '👑', name: 'Line Leader Pass',  cost: 15, desc: 'Lead the class adventure line today!', c: '#2fc58a', d: '#1b8f61' }
  ];

  var THURSDAY_DROPS = [
    { id: 'th-compass', ico: '🧭', name: 'Golden Explorer Compass', cost: 25, desc: 'Thursday Visiting Ship special badge!', c: '#ffb320', d: '#c98200', dark: true },
    { id: 'th-pirate',  ico: '🏴‍☠️', name: 'Captain Hat Voucher',   cost: 30, desc: 'Limited Thursday ship arrival — wear in class!', c: '#ff5fa2', d: '#c93776' },
    { id: 'th-parrot',  ico: '🦜', name: 'Parrot Sidekick Pass',    cost: 20, desc: 'Choose the next class mascot cheer!', c: '#2fc58a', d: '#1b8f61' }
  ];

  var GRATITUDE_NOTES = [
    '💖 Thank you for helping me!',
    '🌟 Awesome teamwork today!',
    '😊 You made me smile!',
    '🙌 Great English speaking!'
  ];

  function weekStamp() {
    var d = new Date();
    var first = new Date(d.getFullYear(), 0, 1);
    var wk = Math.ceil((((d - first) / 86400000) + first.getDay() + 1) / 7);
    return d.getFullYear() + '-W' + wk;
  }

  function loadState() {
    var def = {
      pickedIds: [],
      restTentIds: [],
      pads: { 'pad-1': 15, 'pad-2': 10, 'pad-3': 5 },
      thursdayShip: new Date().getDay() === 4,
      gratitudeWeek: weekStamp(),
      gratitudeSentBy: [],
      gratitudeWall: [],
      vouchersClaimed: [],
      micMode: 'whisper'
    };
    if (IS_DEMO) return def;
    try {
      var raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!raw || typeof raw !== 'object') return def;
      var st = Object.assign(def, raw);
      if (st.gratitudeWeek !== weekStamp()) {
        st.gratitudeWeek = weekStamp();
        st.gratitudeSentBy = [];
      }
      st.pads = Object.assign({ 'pad-1': 0, 'pad-2': 0, 'pad-3': 0 }, st.pads || {});
      return st;
    } catch (e) { return def; }
  }

  var state = loadState();
  function saveState() {
    if (IS_DEMO) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function getRoster() {
    if (root.ClassroomHub && typeof root.ClassroomHub.getRoster === 'function') {
      return root.ClassroomHub.getRoster() || [];
    }
    return [];
  }
  function getTeams() {
    if (root.ClassroomHub && typeof root.ClassroomHub.getTeams === 'function') {
      return root.ClassroomHub.getTeams();
    }
    return [
      { id: 0, name: 'Pink',   c: '#ff5fa2', d: '#c93776' },
      { id: 1, name: 'Blue',   c: '#4f9dff', d: '#286ec2' },
      { id: 2, name: 'Yellow', c: '#ffb320', d: '#c98200' },
      { id: 3, name: 'Green',  c: '#2fc58a', d: '#1b8f61' }
    ];
  }
  function isTeacherUnlocked() {
    return !!(root.ClassroomHub && typeof root.ClassroomHub.isTeacherUnlocked === 'function' && root.ClassroomHub.isTeacherUnlocked());
  }
  function chime(kind) {
    if (HOST && HOST.playShortChime) HOST.playShortChime(kind || 'preset');
  }
  function lockCam(locked) {
    if (HOST && HOST.setCameraLock) HOST.setCameraLock(!!locked);
  }

  // ── 3D Modular Build Pad Landmark Growth (0 -> 50 pts builds real 3D landmarks on the front shoreline!) ──
  function rebuild3DPads() {
    if (!HOST || !HOST.buildPadGroups || !T3) return;
    var mat = function (hex) { return new T3.MeshStandardMaterial({ color: hex, roughness: 0.72, metalness: 0.04 }); };
    Object.keys(HOST.buildPadGroups).forEach(function (pid) {
      var pg = HOST.buildPadGroups[pid];
      if (!pg || !pg.stage) return;
      while (pg.stage.children.length) pg.stage.remove(pg.stage.children[0]);
      var pts = Number(state.pads[pid]) || 0;
      if (pts <= 0) return;
      var pct = Math.min(1, pts / 50);
      var stage = pct >= 1 ? 3 : (pct >= 0.5 ? 2 : 1);

      if (pid === 'pad-1') {
        // Class Garden: Stage 1 raised beds -> Stage 2 trellis arch -> Stage 3 blooming colourful garden & fountain!
        var bed = new T3.Mesh(new T3.CylinderGeometry(1.55, 1.7, 0.34, 20), mat(0xa66a38));
        bed.position.y = 0.17; bed.castShadow = true; pg.stage.add(bed);
        var soil = new T3.Mesh(new T3.CylinderGeometry(1.42, 1.42, 0.08, 20), mat(0x528f44));
        soil.position.y = 0.35; pg.stage.add(soil);
        if (stage >= 2) {
          [-0.9, 0.9].forEach(function (ox) {
            var post = new T3.Mesh(new T3.CylinderGeometry(0.09, 0.1, 1.6, 10), mat(0xd99b52));
            post.position.set(ox, 1.1, 0); post.castShadow = true; pg.stage.add(post);
          });
          var arch = new T3.Mesh(new T3.TorusGeometry(0.9, 0.11, 10, 20, Math.PI), mat(0x2fc58a));
          arch.position.set(0, 1.85, 0); pg.stage.add(arch);
        }
        if (stage >= 3) {
          var flCols = [0xff5fa2, 0xffb320, 0x4f9dff, 0x9b7bff];
          for (var i = 0; i < 8; i++) {
            var a = (i / 8) * Math.PI * 2;
            var fl = new T3.Mesh(new T3.SphereGeometry(0.24, 10, 8), mat(flCols[i % 4]));
            fl.position.set(Math.cos(a) * 1.05, 0.56, Math.sin(a) * 1.05); fl.castShadow = true; pg.stage.add(fl);
          }
          var star = new T3.Mesh(new T3.OctahedronGeometry(0.36, 0), mat(0xffd84a));
          star.position.set(0, 2.75, 0); pg.stage.add(star);
        }
      } else if (pid === 'pad-2') {
        // Wonder Stage: Stage 1 wooden deck -> Stage 2 colourful backdrop -> Stage 3 starlit theater canopy!
        var deck = new T3.Mesh(new T3.CylinderGeometry(1.75, 1.9, 0.42, 24), mat(0xd99b52));
        deck.position.y = 0.21; deck.castShadow = true; pg.stage.add(deck);
        if (stage >= 2) {
          var back = new T3.Mesh(new T3.BoxGeometry(2.5, 1.6, 0.22), mat(0x9b7bff));
          back.position.set(0, 1.2, -0.85); back.castShadow = true; pg.stage.add(back);
        }
        if (stage >= 3) {
          var roof = new T3.Mesh(new T3.ConeGeometry(2.05, 0.95, 6), mat(0xff5fa2));
          roof.position.set(0, 2.45, -0.1); roof.castShadow = true; pg.stage.add(roof);
          var gem = new T3.Mesh(new T3.OctahedronGeometry(0.35, 0), mat(0xffd84a));
          gem.position.set(0, 3.15, -0.1); pg.stage.add(gem);
        }
      } else {
        // Treehouse: Stage 1 sturdy trunk -> Stage 2 wooden deck & cabin -> Stage 3 lush leafy canopy & flag!
        var trunk = new T3.Mesh(new T3.CylinderGeometry(0.38, 0.56, 1.55, 12), mat(0x8c5828));
        trunk.position.y = 0.78; trunk.castShadow = true; pg.stage.add(trunk);
        if (stage >= 2) {
          var plat = new T3.Mesh(new T3.CylinderGeometry(1.45, 1.35, 0.22, 16), mat(0xd99b52));
          plat.position.y = 1.58; plat.castShadow = true; pg.stage.add(plat);
          var cabin = new T3.Mesh(new T3.BoxGeometry(1.35, 1.05, 1.2), mat(0xffb320));
          cabin.position.y = 2.2; cabin.castShadow = true; pg.stage.add(cabin);
        }
        if (stage >= 3) {
          var crown = new T3.Mesh(new T3.DodecahedronGeometry(1.45, 1), mat(0x2fc58a));
          crown.position.set(0, 3.35, 0); crown.scale.set(1.2, 0.72, 1.15); crown.castShadow = true; pg.stage.add(crown);
          var pole = new T3.Mesh(new T3.CylinderGeometry(0.05, 0.05, 1.1, 8), mat(0xffffff));
          pole.position.set(0, 4.35, 0); pg.stage.add(pole);
          var flag = new T3.Mesh(new T3.BoxGeometry(0.75, 0.42, 0.06), mat(0x4f9dff));
          flag.position.set(0.38, 4.68, 0); pg.stage.add(flag);
        }
      }
    });
  }

  // ── Shared Modal Shell ──
  var backdrop = null, sheet = null, headEl = null, bodyEl = null;
  var currentModalKind = '';
  function ensureModal() {
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'h3-p3-backdrop hidden';
    backdrop.id = 'h3P3Backdrop';
    backdrop.innerHTML =
      '<div class="h3-p3-sheet" id="h3P3Sheet">' +
        '<div class="h3-p3-head" id="h3P3Head"></div>' +
        '<div class="h3-p3-body" id="h3P3Body"></div>' +
      '</div>';
    document.body.appendChild(backdrop);
    sheet = backdrop.querySelector('#h3P3Sheet');
    headEl = backdrop.querySelector('#h3P3Head');
    bodyEl = backdrop.querySelector('#h3P3Body');
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
    root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) closeModal(); });
  }
  function openModal(kind, title, sub, color, darkColor, center) {
    ensureModal();
    currentModalKind = kind;
    backdrop.classList.toggle('center', !!center);
    sheet.style.setProperty('--sc', color || '#4f9dff');
    sheet.style.setProperty('--sd', darkColor || '#286ec2');
    headEl.innerHTML =
      '<div><h2>' + title + '</h2>' + (sub ? '<div class="h3-p3-sub">' + sub + '</div>' : '') + '</div>' +
      '<button type="button" class="h3-p3-close" id="h3P3Close">✕ Close</button>';
    headEl.querySelector('#h3P3Close').onclick = closeModal;
    bodyEl.innerHTML = '';
    backdrop.classList.remove('hidden');
    lockCam(true);
    chime('preset');
  }
  function closeModal() {
    if (micStream) stopMicMeter();
    if (backdrop) backdrop.classList.add('hidden');
    currentModalKind = '';
    lockCam(false);
  }

  // =========================================================================
  // 1. <= 2.5s QUICK-AWARD DRAWER (60% Collective Balloon / 40% Individual Wallet)
  // =========================================================================
  var selectedReason = REASONS[0];
  function applySplitAward(pupil, reasonObj) {
    var totalPts = 5;
    var collectivePts = 3; // 60% -> Class Hot Air Balloon
    var individualPts = 2; // 40% -> Pupil Shop Wallet (via schoolStore.giveXP when unlocked!)
    if (root.ClassroomHub && typeof root.ClassroomHub.awardPupilXP === 'function') {
      root.ClassroomHub.awardPupilXP(pupil, individualPts, reasonObj.label + ' (40% individual)');
    }
    if (HOST && HOST.addBalloonLift) {
      HOST.addBalloonLift(collectivePts);
    }
    if (HOST && HOST.highlightPupil) {
      HOST.highlightPupil(pupil.id);
    }
    chime('reward');
    if (K && K.ui && K.ui.toast) {
      K.ui.toast(
        reasonObj.ico + ' ' + pupil.name + ': +' + individualPts + ' Wallet (40%) · 🎈 +' + collectivePts + ' Balloon (60%)!',
        2.6,
        reasonObj.c
      );
    }
  }

  function openQuickAward(preselectedPupilId) {
    openModal(
      'quick-award',
      '⭐ Quick Award <span class="h3-qa-split-note">🎈 60% Class Balloon · 🛍️ 40% Pupil Wallet</span>',
      'Tap a reason, then tap a student (<= 2.5 s) — zero public bottom rankings!',
      '#ffb320', '#c98200', false
    );
    var teams = getTeams();
    var roster = getRoster();

    var rGrid = document.createElement('div');
    rGrid.className = 'h3-qa-reasons';
    REASONS.forEach(function (r) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'h3-qa-reason' + (r.dark ? ' dark-txt' : '') + (selectedReason.id === r.id ? ' active' : '');
      b.style.setProperty('--rc', r.c);
      b.style.setProperty('--rd', r.d);
      b.innerHTML = '<i>' + r.ico + '</i><b>' + r.label + '</b><small>+3 🎈 · +2 🛍️</small>';
      b.onclick = function () {
        selectedReason = r;
        rGrid.querySelectorAll('.h3-qa-reason').forEach(function (el) { el.classList.remove('active'); });
        b.classList.add('active');
        chime('preset');
      };
      rGrid.appendChild(b);
    });
    bodyEl.appendChild(rGrid);

    var pGrid = document.createElement('div');
    pGrid.className = 'h3-qa-pupils';
    roster.forEach(function (pu) {
      var tm = teams[pu.team || 0] || teams[0];
      var resting = state.restTentIds.indexOf(pu.id) >= 0;
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'h3-qa-chip' + (resting ? ' resting' : '');
      chip.style.setProperty('--tc', tm.c || '#4f9dff');
      chip.style.setProperty('--td', tm.d || '#286ec2');
      if (preselectedPupilId && pu.id === preselectedPupilId) {
        chip.style.boxShadow = '0 0 0 4px #ffb320';
      }
      chip.innerHTML =
        '<span style="display:inline-flex;align-items:center;gap:7px">' +
          '<i class="h3-qa-dot"></i>' + esc(pu.name) +
        '</span>' +
        '<span>' + (resting ? '⛺' : '⭐') + '</span>';
      chip.onclick = function () {
        applySplitAward(pu, selectedReason);
        closeModal();
      };
      pGrid.appendChild(chip);
    });
    bodyEl.appendChild(pGrid);
  }

  // =========================================================================
  // 2. AMPHITHEATER FAIR RANDOM PICKER (Zero Repeats + Rest Tent Attendance)
  // =========================================================================
  var lastPicked = null;
  function openFairPicker() {
    openModal(
      'picker',
      '🏛️ Amphitheater Fair Picker & ⛺ Rest Tent',
      'Every present student is picked once before reshuffling — absent students rest peacefully in the Rest Tent!',
      '#ff5fa2', '#c93776', true
    );
    renderFairPickerBody();
  }

  function renderFairPickerBody() {
    var roster = getRoster();
    var teams = getTeams();
    var present = roster.filter(function (p) { return state.restTentIds.indexOf(p.id) < 0; });
    var remaining = present.filter(function (p) { return state.pickedIds.indexOf(p.id) < 0; });
    var pickedCount = present.length - remaining.length;

    bodyEl.innerHTML =
      '<div class="h3-pick-stage">' +
        '<div style="font-weight:900;color:#5b4975">Fair Cycle: ' + pickedCount + ' of ' + present.length + ' picked · ' + remaining.length + ' remaining · ' + state.restTentIds.length + ' in ⛺ Rest Tent</div>' +
        '<div class="h3-pick-spotlight" id="h3PickSpot">' +
          (lastPicked ? ('🌟 ' + esc(lastPicked.name) + '!') : '🎲 Tap Pick Next Star!') +
        '</div>' +
        '<div class="h3-pick-actions">' +
          '<button type="button" class="h3-p3-bigbtn" id="h3PickSpin" style="--bc:#ff5fa2">🎲 Pick Next Star!</button>' +
          (lastPicked && isTeacherUnlocked() ? '<button type="button" class="h3-p3-bigbtn dark-txt" id="h3PickAward" style="--bc:#ffb320">⭐ Award ' + esc(lastPicked.name) + '</button>' : '') +
          '<button type="button" class="h3-p3-bigbtn" id="h3PickReset" style="--bc:#4f9dff;min-width:130px">↻ Reset Cycle</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-weight:900;margin-bottom:8px;color:#1f1430">⛺ Attendance & Rest Tent (tap ⛺ to mark absent/resting):</div>' +
      '<div class="h3-pick-roster" id="h3PickRoster"></div>';

    var spot = bodyEl.querySelector('#h3PickSpot');
    var spinBtn = bodyEl.querySelector('#h3PickSpin');
    spinBtn.onclick = function () {
      var curPresent = getRoster().filter(function (p) { return state.restTentIds.indexOf(p.id) < 0; });
      if (!curPresent.length) {
        spot.textContent = '⛺ Everyone is resting in the Rest Tent!';
        return;
      }
      var pool = curPresent.filter(function (p) { return state.pickedIds.indexOf(p.id) < 0; });
      if (!pool.length) {
        state.pickedIds = [];
        pool = curPresent.slice();
      }
      var chosen = pool[Math.floor(Math.random() * pool.length)];
      spinBtn.disabled = true;
      var ticks = 0;
      var iv = setInterval(function () {
        ticks++;
        var rItem = curPresent[Math.floor(Math.random() * curPresent.length)];
        spot.textContent = '🎲 ' + rItem.name + '…';
        chime('preset');
        if (ticks >= 8) {
          clearInterval(iv);
          state.pickedIds.push(chosen.id);
          lastPicked = chosen;
          saveState();
          chime('reward');
          if (root.__home3d && root.__home3d.setPreset) root.__home3d.setPreset('amphitheater');
          if (HOST && HOST.highlightPupil) HOST.highlightPupil(chosen.id);
          renderFairPickerBody();
        }
      }, 90);
    };

    var awBtn = bodyEl.querySelector('#h3PickAward');
    if (awBtn && lastPicked) {
      awBtn.onclick = function () { openQuickAward(lastPicked.id); };
    }
    bodyEl.querySelector('#h3PickReset').onclick = function () {
      state.pickedIds = [];
      lastPicked = null;
      saveState();
      renderFairPickerBody();
    };

    var rEl = bodyEl.querySelector('#h3PickRoster');
    roster.forEach(function (pu) {
      var tm = teams[pu.team || 0] || teams[0];
      var isRest = state.restTentIds.indexOf(pu.id) >= 0;
      var isPicked = !isRest && state.pickedIds.indexOf(pu.id) >= 0;
      var card = document.createElement('div');
      card.className = 'h3-pick-card' + (isRest ? ' absent' : (isPicked ? ' picked' : ''));
      card.innerHTML =
        '<span style="display:inline-flex;align-items:center;gap:6px">' +
          '<i class="h3-qa-dot" style="--tc:' + (tm.c || '#4f9dff') + '"></i>' +
          esc(pu.name) + (isPicked ? ' ✓' : '') +
        '</span>';
      var tBtn = document.createElement('button');
      tBtn.type = 'button';
      tBtn.className = 'h3-tent-btn' + (isRest ? ' on' : '');
      tBtn.textContent = isRest ? '⛺ Resting' : '⛺ Rest';
      tBtn.onclick = function () {
        var idx = state.restTentIds.indexOf(pu.id);
        if (idx >= 0) state.restTentIds.splice(idx, 1);
        else state.restTentIds.push(pu.id);
        saveState();
        renderFairPickerBody();
      };
      card.appendChild(tBtn);
      rEl.appendChild(card);
    });
  }

  // =========================================================================
  // 3. WINDMILL & VOLCANO 3-MODE CLASSROOM MIC METER (Whisper / Group Work / Festival)
  // =========================================================================
  var micStream = null, micCtx = null, micAnalyser = null, micData = null, micRAF = 0;
  var micLevelLive = 0.14, micFestivalAccum = 0;

  var MIC_MODES = [
    { id: 'whisper',  ico: '🤫', label: 'Whisper',    desc: 'Calm quiet focus · gentle breeze',      c: '#4f9dff', d: '#286ec2', dark: false, speed: 0.55 },
    { id: 'group',    ico: '🗣️', label: 'Group Work', desc: 'Happy partner talk · steady windmill',  c: '#2fc58a', d: '#1b8f61', dark: false, speed: 1.35 },
    { id: 'festival', ico: '🎉', label: 'Festival',   desc: 'Loud cheers lift the 🎈 Hot Air Balloon!', c: '#ffb320', d: '#c98200', dark: true,  speed: 3.20 }
  ];

  function stopMicMeter() {
    if (micRAF) { cancelAnimationFrame(micRAF); micRAF = 0; }
    if (micStream) {
      try { micStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      micStream = null;
    }
    if (micCtx) { try { micCtx.close(); } catch (e) {} micCtx = null; }
    micAnalyser = null;
  }

  function applyMicLevel(lvl) {
    micLevelLive = Math.max(0, Math.min(1, lvl));
    var modeObj = MIC_MODES.filter(function (m) { return m.id === state.micMode; })[0] || MIC_MODES[0];
    if (root.__home3dSetWindmillSpeed) {
      root.__home3dSetWindmillSpeed(modeObj.speed + micLevelLive * (state.micMode === 'festival' ? 3.5 : 1.4));
    }
    var fill = document.getElementById('h3MicFill');
    var stEl = document.getElementById('h3MicStatus');
    if (fill) fill.style.width = Math.round(Math.max(6, micLevelLive * 100)) + '%';
    if (stEl) {
      if (state.micMode === 'festival') {
        stEl.textContent = micLevelLive > 0.62 ? '🎉 ROARING CHEER! 🎈 Lifting Hot Air Balloon!' : '🎉 Cheer loud together to lift the Balloon!';
      } else if (state.micMode === 'group') {
        stEl.textContent = micLevelLive > 0.78 ? '🌋 Volcano rumbling — lower voices a bit!' : '🗣️ Great Group Work volume!';
      } else {
        stEl.textContent = micLevelLive > 0.55 ? '🌋 Shhh — back to Whisper voices!' : '🤫 Calm Whisper breeze!';
      }
    }
    if (state.micMode === 'festival' && micLevelLive > 0.65) {
      micFestivalAccum += 0.08;
      if (micFestivalAccum >= 1) {
        micFestivalAccum = 0;
        if (HOST && HOST.addBalloonLift) HOST.addBalloonLift(5);
        chime('reward');
      }
    }
  }

  function openMicMeter() {
    openModal(
      'mic',
      '🌬️ Windmill & 🌋 Volcano Classroom Meter',
      'Choose Whisper, Group Work, or Festival (loud cheers spin the Windmill & lift the 🎈 Hot Air Balloon!)',
      '#2fc58a', '#1b8f61', true
    );
    renderMicBody();
  }

  function renderMicBody() {
    var mGrid = document.createElement('div');
    mGrid.className = 'h3-mic-modes';
    MIC_MODES.forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'h3-mic-mode' + (m.dark ? ' dark-txt' : '') + (state.micMode === m.id ? ' active' : '');
      b.style.setProperty('--mc', m.c);
      b.style.setProperty('--md', m.d);
      b.innerHTML = '<i>' + m.ico + '</i><b>' + m.label + '</b><small>' + m.desc + '</small>';
      b.onclick = function () {
        state.micMode = m.id;
        saveState();
        chime('preset');
        applyMicLevel(micLevelLive);
        renderMicBody();
      };
      mGrid.appendChild(b);
    });

    bodyEl.innerHTML = '';
    bodyEl.appendChild(mGrid);

    var gauge = document.createElement('div');
    gauge.className = 'h3-mic-gauge';
    gauge.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
        '<b id="h3MicStatus" style="font-size:1.05rem">🤫 Calm Whisper breeze!</b>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button type="button" class="h3-p3-bigbtn" id="h3MicToggle" style="--bc:' + (micStream ? '#ff5fa2' : '#4f9dff') + ';min-height:54px;min-width:140px;font-size:0.95rem">' +
            (micStream ? '⏹️ Stop Mic' : '🎤 Start Live Mic') +
          '</button>' +
          '<button type="button" class="h3-p3-bigbtn dark-txt" id="h3MicCheer" style="--bc:#ffb320;min-height:54px;min-width:140px;font-size:0.95rem">🎉 Test Cheer Boost!</button>' +
        '</div>' +
      '</div>' +
      '<div class="h3-mic-track"><div class="h3-mic-fill" id="h3MicFill" style="width:' + Math.round(micLevelLive * 100) + '%"></div></div>' +
      '<small style="color:#5b4975;font-weight:800">🔒 Privacy-safe: mic measures volume level locally only — audio is never recorded or sent anywhere.</small>';
    bodyEl.appendChild(gauge);

    gauge.querySelector('#h3MicToggle').onclick = function () {
      if (micStream) { stopMicMeter(); renderMicBody(); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (K && K.ui && K.ui.toast) K.ui.toast('🎤 Mic unavailable here — use Test Cheer Boost!', 2.4, '#ffb320');
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        micStream = stream;
        var AC = root.AudioContext || root.webkitAudioContext;
        micCtx = new AC();
        var src = micCtx.createMediaStreamSource(stream);
        micAnalyser = micCtx.createAnalyser();
        micAnalyser.fftSize = 512;
        micData = new Uint8Array(micAnalyser.fftSize);
        src.connect(micAnalyser);
        renderMicBody();
        function loop() {
          if (!micAnalyser) return;
          micAnalyser.getByteTimeDomainData(micData);
          var sum = 0;
          for (var i = 0; i < micData.length; i++) {
            var v = (micData[i] - 128) / 128;
            sum += v * v;
          }
          var rms = Math.sqrt(sum / micData.length);
          applyMicLevel(Math.min(1, rms * 4.2));
          micRAF = requestAnimationFrame(loop);
        }
        loop();
      }).catch(function () {
        if (K && K.ui && K.ui.toast) K.ui.toast('🎤 Mic permission denied — use Test Cheer Boost!', 2.4, '#ffb320');
      });
    };

    gauge.querySelector('#h3MicCheer').onclick = function () {
      state.micMode = 'festival';
      saveState();
      applyMicLevel(0.92);
      if (HOST && HOST.addBalloonLift) HOST.addBalloonLift(10);
      chime('reward');
      if (K && K.ui && K.ui.toast) K.ui.toast('🎉 Festival Cheer! 🌬️ Windmill turbo + 🎈 +10 Balloon lift!', 2.4, '#ffb320');
      renderMicBody();
    };
    applyMicLevel(micLevelLive);
  }

  // =========================================================================
  // 4. RUNNING TRACK 4-WAY BOTTOM-SCREEN MULTI-TOUCH SPLIT (90-SECOND SPRINT)
  // =========================================================================
  var sprintEl = null, sprintTimer = null, sprintSec = 90, sprintRunning = false;
  var sprintScores = [0, 0, 0, 0];
  var SPRINT_GOAL = 60;

  function openTouchSprint() {
    if (!sprintEl) {
      sprintEl = document.createElement('div');
      sprintEl.className = 'h3-sprint-overlay hidden';
      sprintEl.id = 'h3SprintOverlay';
      document.body.appendChild(sprintEl);
    }
    var teams = getTeams();
    sprintScores = [0, 0, 0, 0];
    sprintSec = 90;
    sprintRunning = true;
    lockCam(true);

    var runners = ['🦊', '🐬', '🦁', '🐸'];
    var lanesHtml = teams.slice(0, 4).map(function (t, i) {
      return '<div class="h3-lane" style="--lc:' + t.c + '">' +
        '<div class="h3-lane-fill" id="h3LaneFill' + i + '"></div>' +
        '<span class="h3-lane-lbl">' + esc(t.name) + ' · <b id="h3LanePts' + i + '">0</b></span>' +
        '<span class="h3-lane-runner" id="h3LaneRun' + i + '">' + runners[i] + '</span>' +
        '<span class="h3-lane-finish">🏁</span>' +
      '</div>';
    }).join('');

    var padsHtml = teams.slice(0, 4).map(function (t, i) {
      var dark = i === 2;
      return '<button type="button" class="h3-sprint-pad' + (dark ? ' dark-txt' : '') + '" data-lane="' + i + '" style="--lc:' + t.c + '">' +
        '<i>' + runners[i] + '</i>' +
        '<b>' + esc(t.name) + '</b>' +
        '<span>TAP FAST!</span>' +
      '</button>';
    }).join('');

    sprintEl.innerHTML =
      '<div class="h3-sprint-top">' +
        '<h2 style="margin:0;font-size:1.35rem;font-weight:900">🏁 Running Track — 4-Team Multi-Touch Sprint!</h2>' +
        '<div class="h3-sprint-timer" id="h3SprintTime">⏱ 90s</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button type="button" class="h3-p3-close" id="h3SprintReset">↻ Restart</button>' +
          '<button type="button" class="h3-p3-close" id="h3SprintExit">✕ Back to Island</button>' +
        '</div>' +
      '</div>' +
      '<div class="h3-sprint-lanes">' + lanesHtml + '</div>' +
      '<div class="h3-sprint-pads">' + padsHtml + '</div>';

    sprintEl.classList.remove('hidden');
    chime('preset');

    function finishSprint(winnerIdx) {
      sprintRunning = false;
      if (sprintTimer) { clearInterval(sprintTimer); sprintTimer = null; }
      var wTeam = teams[winnerIdx] || teams[0];
      chime('reward');
      if (HOST && HOST.addBalloonLift) HOST.addBalloonLift(15);
      if (K && K.ui && K.ui.toast) {
        K.ui.toast('🏆 ' + wTeam.name + ' finished first! Everyone lifts the 🎈 Balloon +15!', 3.6, wTeam.c);
      }
      var tEl = sprintEl.querySelector('#h3SprintTime');
      if (tEl) tEl.textContent = '🏆 ' + wTeam.name + ' Wins!';
    }

    function tapLane(idx, btn) {
      if (!sprintRunning) return;
      sprintScores[idx]++;
      var pct = Math.min(100, (sprintScores[idx] / SPRINT_GOAL) * 100);
      var f = sprintEl.querySelector('#h3LaneFill' + idx);
      var r = sprintEl.querySelector('#h3LaneRun' + idx);
      var p = sprintEl.querySelector('#h3LanePts' + idx);
      if (f) f.style.width = Math.max(6, pct) + '%';
      if (r) r.style.left = Math.min(90, 4 + pct * 0.86) + '%';
      if (p) p.textContent = String(sprintScores[idx]);
      if (btn) {
        btn.classList.add('pressed');
        setTimeout(function () { btn.classList.remove('pressed'); }, 80);
      }
      if (sprintScores[idx] >= SPRINT_GOAL) finishSprint(idx);
    }

    // Simultaneous 4-finger / 4-child smartboard multi-touch via independent pointerdown!
    sprintEl.querySelectorAll('.h3-sprint-pad').forEach(function (btn) {
      var idx = Number(btn.getAttribute('data-lane')) || 0;
      btn.addEventListener('pointerdown', function (ev) {
        ev.preventDefault();
        tapLane(idx, btn);
      });
    });

    if (sprintTimer) clearInterval(sprintTimer);
    sprintTimer = setInterval(function () {
      if (!sprintRunning) return;
      sprintSec--;
      var tEl = sprintEl.querySelector('#h3SprintTime');
      if (tEl) tEl.textContent = '⏱ ' + sprintSec + 's';
      if (sprintSec <= 0) {
        var best = 0;
        for (var i = 1; i < 4; i++) if (sprintScores[i] > sprintScores[best]) best = i;
        finishSprint(best);
      }
    }, 1000);

    sprintEl.querySelector('#h3SprintReset').onclick = openTouchSprint;
    sprintEl.querySelector('#h3SprintExit').onclick = function () {
      sprintRunning = false;
      if (sprintTimer) { clearInterval(sprintTimer); sprintTimer = null; }
      sprintEl.classList.add('hidden');
      lockCam(false);
    };
  }

  // =========================================================================
  // 5. PUPIL SHOP VOUCHERS, THURSDAY VISITING SHIP, 3 BUILD PADS & WEEKLY GRATITUDE HEART
  // =========================================================================
  var activeShopTab = 'vouchers';
  var selectedGratNote = GRATITUDE_NOTES[0];

  function openShopTab(tabId, focusPadId) {
    activeShopTab = tabId || 'vouchers';
    openModal(
      'shop',
      '🛍️ Pupil Shop, ⛵ Visiting Ship & 🏗️ Island Economy',
      'Classroom vouchers, Thursday limited ship drops, voluntary 5-pt Build Pads & 1 free weekly 💖 Gratitude Heart!',
      '#ffb320', '#c98200', true
    );
    renderShopBody(focusPadId);
  }

  function renderShopBody(focusPadId) {
    bodyEl.innerHTML = '';
    var tabsBar = document.createElement('div');
    tabsBar.className = 'h3-p3-tabs';
    var tabs = [
      { id: 'vouchers',  lbl: '🎟️ Class Vouchers' },
      { id: 'ship',      lbl: '⛵ Thursday Ship' + (state.thursdayShip ? ' ✨' : '') },
      { id: 'pads',      lbl: '🏗️ 3 Build Pads' },
      { id: 'gratitude', lbl: '💖 Gratitude Heart' }
    ];
    tabs.forEach(function (tb) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'h3-p3-tab' + (activeShopTab === tb.id ? ' active' : '');
      b.textContent = tb.lbl;
      b.onclick = function () { activeShopTab = tb.id; chime('preset'); renderShopBody(); };
      tabsBar.appendChild(b);
    });
    // Safe route to full platform Avatar Cosmetics Store (NEVER nests ../index.html!)
    var fullStoreBtn = document.createElement('button');
    fullStoreBtn.type = 'button';
    fullStoreBtn.className = 'h3-p3-tab';
    fullStoreBtn.style.marginLeft = 'auto';
    fullStoreBtn.textContent = '👕 Avatar Cosmetics Store →';
    fullStoreBtn.onclick = function () {
      closeModal();
      if (root.ClassroomHub && root.ClassroomHub.goPlatformView) root.ClassroomHub.goPlatformView('store-pupil');
    };
    tabsBar.appendChild(fullStoreBtn);
    bodyEl.appendChild(tabsBar);

    if (activeShopTab === 'vouchers') {
      var g = document.createElement('div');
      g.className = 'h3-shop-grid';
      VOUCHERS.forEach(function (v) {
        var c = document.createElement('div');
        c.className = 'h3-shop-card';
        c.style.setProperty('--cc', v.c);
        c.style.setProperty('--cd', v.d);
        c.innerHTML =
          '<div class="h3-shop-ico">' + v.ico + '</div>' +
          '<b>' + esc(v.name) + '</b>' +
          '<p>' + esc(v.desc) + '</p>' +
          '<button type="button" class="h3-shop-act' + (v.dark ? ' dark-txt' : '') + '">🎟️ Claim Pass (' + v.cost + ' 🪙)</button>';
        c.querySelector('button').onclick = function () {
          state.vouchersClaimed.push({ id: v.id, name: v.name, ts: Date.now() });
          saveState();
          chime('reward');
          if (K && K.ui && K.ui.toast) K.ui.toast('🎟️ ' + v.name + ' voucher pass issued!', 2.6, v.c);
        };
        g.appendChild(c);
      });
      bodyEl.appendChild(g);
    } else if (activeShopTab === 'ship') {
      var headerBox = document.createElement('div');
      headerBox.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 16px;border-radius:18px;background:#fff1cc;border:3px solid #ffb320;margin-bottom:14px;font-weight:900';
      headerBox.innerHTML =
        '<span>⛵ Thursday Visiting Ship Status: <b>' + (state.thursdayShip ? '✨ DOCKED & OPEN!' : '🌊 Sailing (arrives Thursday)') + '</b></span>' +
        '<button type="button" class="h3-p3-tab ' + (state.thursdayShip ? 'active' : '') + '" id="h3ToggleThuShip">' +
          (state.thursdayShip ? '⛵ Docked ON (Tap to Sail)' : '✨ Toggle Thursday Ship ON') +
        '</button>';
      bodyEl.appendChild(headerBox);
      headerBox.querySelector('#h3ToggleThuShip').onclick = function () {
        state.thursdayShip = !state.thursdayShip;
        saveState();
        if (root.__home3dSetThursdayShip) root.__home3dSetThursdayShip(state.thursdayShip);
        chime(state.thursdayShip ? 'reward' : 'preset');
        renderShopBody();
      };

      var sg = document.createElement('div');
      sg.className = 'h3-shop-grid';
      THURSDAY_DROPS.forEach(function (item) {
        var card = document.createElement('div');
        card.className = 'h3-shop-card';
        card.style.setProperty('--cc', item.c);
        card.style.setProperty('--cd', item.d);
        card.style.opacity = state.thursdayShip ? '1' : '0.55';
        card.innerHTML =
          '<div class="h3-shop-ico">' + item.ico + '</div>' +
          '<b>' + esc(item.name) + '</b>' +
          '<p>' + esc(item.desc) + '</p>' +
          '<button type="button" class="h3-shop-act' + (item.dark ? ' dark-txt' : '') + '"' + (state.thursdayShip ? '' : ' disabled') + '>' +
            (state.thursdayShip ? ('✨ Claim Thursday Drop (' + item.cost + ' 🪙)') : '🔒 Opens Thursday') +
          '</button>';
        card.querySelector('button').onclick = function () {
          if (!state.thursdayShip) return;
          chime('reward');
          if (K && K.ui && K.ui.toast) K.ui.toast('⛵ Claimed Thursday Treasure: ' + item.name + '!', 2.6, item.c);
        };
        sg.appendChild(card);
      });
      bodyEl.appendChild(sg);
    } else if (activeShopTab === 'pads') {
      var padMeta = [
        { id: 'pad-1', ico: '🌻', name: 'Pad 1 · Class Garden',  c: '#2fc58a', d: '#1b8f61' },
        { id: 'pad-2', ico: '🎭', name: 'Pad 2 · Wonder Stage',  c: '#9b7bff', d: '#6b4ce0' },
        { id: 'pad-3', ico: '🌳', name: 'Pad 3 · Cozy Treehouse', c: '#ffb320', d: '#c98200', dark: true }
      ];
      var pg = document.createElement('div');
      pg.className = 'h3-shop-grid';
      padMeta.forEach(function (pm) {
        var pts = Number(state.pads[pm.id]) || 0;
        var pct = Math.min(100, Math.round((pts / 50) * 100));
        var stLbl = pct >= 100 ? '🏆 Built!' : (pct >= 50 ? '🔨 Halfway Built' : '🧱 Foundation');
        var card = document.createElement('div');
        card.className = 'h3-shop-card';
        card.style.setProperty('--cc', pm.c);
        card.style.setProperty('--cd', pm.d);
        if (focusPadId === pm.id) card.style.boxShadow = '0 0 0 4px #ffb320';
        card.innerHTML =
          '<div class="h3-shop-ico">' + pm.ico + '</div>' +
          '<b>' + esc(pm.name) + '</b>' +
          '<p>' + stLbl + ' · ' + pts + ' / 50 pts</p>' +
          '<div class="h3-pad-bar"><i style="width:' + pct + '%;background:' + pm.c + '"></i></div>' +
          '<button type="button" class="h3-shop-act' + (pm.dark ? ' dark-txt' : '') + '">' +
            (pct >= 100 ? '🎉 Landmark Complete!' : '🏗️ Contribute +5 Voluntary Pts') +
          '</button>';
        card.querySelector('button').onclick = function () {
          if (pts >= 50) return;
          state.pads[pm.id] = Math.min(50, pts + 5);
          saveState();
          rebuild3DPads();
          chime('reward');
          var padObj = HOST && HOST.buildPadGroups && HOST.buildPadGroups[pm.id];
          if (padObj && K && K.fx && K.fx.confetti) {
            K.fx.confetti(new T3.Vector3(padObj.x, padObj.y + 2.4, padObj.z), 42);
          }
          if (K && K.ui && K.ui.toast) {
            K.ui.toast('🏗️ +5 pts added to ' + pm.name + ' (' + state.pads[pm.id] + '/50)!', 2.4, pm.c);
          }
          renderShopBody(pm.id);
        };
        pg.appendChild(card);
      });
      bodyEl.appendChild(pg);
    } else if (activeShopTab === 'gratitude') {
      var roster = getRoster();
      var gBox = document.createElement('div');
      gBox.className = 'h3-grat-box';
      gBox.innerHTML =
        '<div style="font-weight:900;font-size:1.05rem">💖 1 Free Weekly Gratitude Heart per Student</div>' +
        '<div style="font-size:0.88rem;font-weight:800;color:#6e3a58">Send a kind thank-you heart to a classmate! (No student-to-student point or coin transfers.)</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
          '<label style="font-weight:900">From: <select id="h3GratFrom" style="padding:8px 12px;border-radius:12px;border:3px solid #ff5fa2;font-weight:800">' +
            roster.map(function (p) {
              var used = state.gratitudeSentBy.indexOf(p.id) >= 0;
              return '<option value="' + esc(p.id) + '">' + esc(p.name) + (used ? ' (✓ Sent this week)' : ' (1 free 💖)') + '</option>';
            }).join('') +
          '</select></label>' +
          '<label style="font-weight:900">To: <select id="h3GratTo" style="padding:8px 12px;border-radius:12px;border:3px solid #4f9dff;font-weight:800">' +
            roster.map(function (p, idx) {
              return '<option value="' + esc(p.id) + '"' + (idx === 1 ? ' selected' : '') + '>' + esc(p.name) + '</option>';
            }).join('') +
          '</select></label>' +
        '</div>' +
        '<div class="h3-grat-note-row" id="h3GratNotes"></div>' +
        '<button type="button" class="h3-p3-bigbtn" id="h3GratSend" style="--bc:#ff5fa2;min-height:62px">💖 Send Free Weekly Gratitude Heart!</button>';
      bodyEl.appendChild(gBox);

      var nRow = gBox.querySelector('#h3GratNotes');
      GRATITUDE_NOTES.forEach(function (nt) {
        var nb = document.createElement('button');
        nb.type = 'button';
        nb.className = 'h3-grat-note' + (selectedGratNote === nt ? ' active' : '');
        nb.textContent = nt;
        nb.onclick = function () {
          selectedGratNote = nt;
          nRow.querySelectorAll('.h3-grat-note').forEach(function (el) { el.classList.remove('active'); });
          nb.classList.add('active');
        };
        nRow.appendChild(nb);
      });

      gBox.querySelector('#h3GratSend').onclick = function () {
        var fId = gBox.querySelector('#h3GratFrom').value;
        var tId = gBox.querySelector('#h3GratTo').value;
        if (fId === tId) {
          if (K && K.ui && K.ui.toast) K.ui.toast('💖 Pick a classmate to send your Gratitude Heart to!', 2.2, '#ff5fa2');
          return;
        }
        if (state.gratitudeSentBy.indexOf(fId) >= 0) {
          if (K && K.ui && K.ui.toast) K.ui.toast('💖 Already sent this week’s free Gratitude Heart!', 2.4, '#9b7bff');
          return;
        }
        var fromP = roster.filter(function (p) { return p.id === fId; })[0];
        var toP   = roster.filter(function (p) { return p.id === tId; })[0];
        state.gratitudeSentBy.push(fId);
        state.gratitudeWall.unshift({ from: fromP ? fromP.name : 'Friend', to: toP ? toP.name : 'Classmate', note: selectedGratNote });
        if (state.gratitudeWall.length > 8) state.gratitudeWall.length = 8;
        saveState();
        if (HOST && HOST.highlightPupil && toP) HOST.highlightPupil(toP.id);
        if (HOST && HOST.addBalloonLift) HOST.addBalloonLift(2);
        chime('reward');
        if (K && K.ui && K.ui.toast) {
          K.ui.toast('💖 ' + (fromP ? fromP.name : '') + ' → ' + (toP ? toP.name : '') + ': ' + selectedGratNote, 3.0, '#ff5fa2');
        }
        renderShopBody();
      };

      if (state.gratitudeWall.length) {
        var wall = document.createElement('div');
        wall.style.cssText = 'margin-top:12px;display:flex;flex-wrap:wrap;gap:8px';
        state.gratitudeWall.forEach(function (w) {
          var pill = document.createElement('span');
          pill.style.cssText = 'padding:6px 12px;border-radius:999px;background:#ffffff;border:2.5px solid #ff5fa2;font-weight:800;font-size:0.86rem';
          pill.textContent = '💖 ' + w.from + ' → ' + w.to + ': ' + w.note;
          wall.appendChild(pill);
        });
        bodyEl.appendChild(wall);
      }
    }
  }

  // =========================================================================
  // 6. CONTEXTUAL LANDMARK ACTION BAR + TEACHER QUICK-AWARD FAB
  // =========================================================================
  var ctxBarEl = null, awardFabEl = null;
  function updateContextualBar() {
    if (!ctxBarEl) return;
    var preset = (root.__home3d && root.__home3d.getPreset) ? root.__home3d.getPreset() : 'overview';
    ctxBarEl.innerHTML = '';
    var actions = [];
    if (preset === 'amphitheater') {
      actions.push({ lbl: '🎲 Fair Student Picker & ⛺ Rest Tent', c: '#ff5fa2', d: '#c93776', fn: openFairPicker });
    } else if (preset === 'shop') {
      actions.push({ lbl: '🛍️ Shop · ⛵ Ship · 🏗️ Pads · 💖 Heart', c: '#ffb320', d: '#c98200', dark: true, fn: function () { openShopTab('vouchers'); } });
    } else if (preset === 'racetrack') {
      actions.push({ lbl: '🏁 Start 4-Team Multi-Touch Sprint (90s)', c: '#4f9dff', d: '#286ec2', fn: openTouchSprint });
    } else if (preset === 'castle') {
      actions.push({ lbl: '🌬️ Windmill & 🌋 Volcano Mic Meter', c: '#2fc58a', d: '#1b8f61', fn: openMicMeter });
    }
    ctxBarEl.classList.toggle('empty', actions.length === 0);
    actions.forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'h3-p3-pill' + (a.dark ? ' dark-txt' : '');
      b.style.setProperty('--pc', a.c);
      b.style.setProperty('--pd', a.d);
      b.textContent = a.lbl;
      b.onclick = a.fn;
      ctxBarEl.appendChild(b);
    });
    if (awardFabEl) {
      awardFabEl.classList.toggle('hidden', !isTeacherUnlocked());
    }
  }

  function initPhase3() {
    HOST = root.__home3dQuietHost;
    if (!HOST) return;
    K = HOST.K; T3 = HOST.T3;

    ctxBarEl = document.createElement('div');
    ctxBarEl.className = 'h3-p3-ctx-bar empty';
    document.body.appendChild(ctxBarEl);

    awardFabEl = document.createElement('button');
    awardFabEl.type = 'button';
    awardFabEl.className = 'h3-p3-award-fab' + (isTeacherUnlocked() ? '' : ' hidden');
    awardFabEl.title = 'Quick Award (<= 2.5s · 60% Balloon / 40% Wallet)';
    awardFabEl.innerHTML = '<span>⭐</span><b>Quick Award</b>';
    awardFabEl.onclick = function () { openQuickAward(); };
    document.body.appendChild(awardFabEl);

    // Build initial 3D landmarks on Modular Build Pads & sync Thursday ship lanterns
    rebuild3DPads();
    if (root.__home3dSetThursdayShip) root.__home3dSetThursdayShip(state.thursdayShip);

    // Keep contextual landmark pill synced when user taps any of the 5 bottom presets
    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('.h3-cam-btn')) {
        setTimeout(updateContextualBar, 40);
      }
    });
    updateContextualBar();
  }

  root.Home3DPhase3 = {
    openQuickAward: openQuickAward,
    openFairPicker: openFairPicker,
    openMicMeter: openMicMeter,
    openTouchSprint: openTouchSprint,
    openShopTab: openShopTab,
    closeModal: closeModal,
    rebuild3DPads: rebuild3DPads,
    updateContextualBar: updateContextualBar,
    getState: function () { return state; }
  };

  if (root.__home3dQuietHost) initPhase3();
  else root.addEventListener('home3d:ready', initPhase3, { once: true });
})(window);
