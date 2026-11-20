// Island Tools Pack — GO Tools 2–9 on Adventure Island (home3d)
// 2: Freeze (F) · 3: Sun Timer · 4: Group Maker · 5: Line-up
// 6: Dice & Spinner · 7: Prize Drop · 8: Two Stars · 9: Birthday Party
// Follows island-work/ISLAND-TOOLS-PLAN.md & docs/STYLE_GUIDE.md
// Privacy: reads pupils ONLY from IslandTools.getRoster() / getStars(); never stores names, birthdays, or points.
(function () {
  'use strict';

  var IT = null, B = null, HOST = null, K = null, T3 = null, scene = null;
  var activeToolId = null;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); }

  function makeSpriteText(text, bgHex, borderHex, textHex, w, h, fontSize) {
    var cv = document.createElement('canvas');
    cv.width = w || 256; cv.height = h || 128;
    var g = cv.getContext('2d');
    var pad = 10, r = 28;
    g.fillStyle = bgHex || '#fffdf7';
    g.strokeStyle = borderHex || '#4f9dff';
    g.lineWidth = 10;
    g.beginPath();
    g.roundRect(pad, pad, cv.width - pad * 2, cv.height - pad * 2, r);
    g.fill(); g.stroke();
    g.fillStyle = textHex || '#2b1d40';
    g.font = '900 ' + (fontSize || 52) + 'px Nunito, Trebuchet MS, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, cv.width / 2, cv.height / 2 + 2);
    var tex = new T3.CanvasTexture(cv);
    tex.colorSpace = T3.SRGBColorSpace;
    var mat = new T3.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    var sp = new T3.Sprite(mat);
    return sp;
  }

  // =========================================================================
  // SHARED PROCEDURAL WEB AUDIO ENGINE (ice, melt, tick, horn, dice, pop, birthday)
  // =========================================================================
  var AUDIO = (function () {
    var ctx = null;
    function ensure() {
      if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(function () {}); return true; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try { ctx = new AC(); return true; } catch (e) { return false; }
    }
    function tone(freq, dur, type, vol, delay, endFreq) {
      if (!ensure()) return;
      var t = ctx.currentTime + (delay || 0);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol || 0.14, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.03);
    }
    return {
      ice: function () {
        [1760, 2093, 2637, 3136].forEach(function (f, i) { tone(f, 0.35, 'sine', 0.1, i * 0.045, f * 0.96); });
      },
      melt: function () {
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, 0.4, 'triangle', 0.12, i * 0.07); });
      },
      tick: function (hi) {
        tone(hi ? 920 : 640, 0.06, 'triangle', 0.11, 0, 320);
      },
      shipHorn: function () {
        // Warm deep brass ship's horn chord
        tone(110, 1.5, 'sawtooth', 0.07, 0);
        tone(164.81, 1.5, 'triangle', 0.11, 0);
        tone(220, 1.4, 'sine', 0.09, 0.05);
      },
      pop: function () {
        tone(340, 0.12, 'sine', 0.15, 0, 780);
        tone(523.25, 0.3, 'triangle', 0.12, 0.08);
        tone(783.99, 0.4, 'triangle', 0.12, 0.16);
      },
      birthdayMelody: function () {
        // Pure instrumental Happy Birthday melody (C major, no lyrics)
        var notes = [
          [261.63, 0.00, 0.28], [261.63, 0.30, 0.18], [293.66, 0.52, 0.42], [261.63, 0.98, 0.42], [349.23, 1.44, 0.42], [329.63, 1.90, 0.78],
          [261.63, 2.78, 0.28], [261.63, 3.08, 0.18], [293.66, 3.30, 0.42], [261.63, 3.76, 0.42], [392.00, 4.22, 0.42], [349.23, 4.68, 0.78],
          [261.63, 5.56, 0.28], [261.63, 5.86, 0.18], [523.25, 6.08, 0.42], [440.00, 6.54, 0.42], [349.23, 7.00, 0.42], [329.63, 7.46, 0.42], [293.66, 7.92, 0.65],
          [466.16, 8.66, 0.28], [466.16, 8.96, 0.18], [440.00, 9.18, 0.42], [349.23, 9.64, 0.42], [392.00, 10.10, 0.42], [349.23, 10.56, 0.85]
        ];
        notes.forEach(function (n) {
          tone(n[0], n[2] + 0.12, 'triangle', 0.11, n[1]);
          tone(n[0] * 2, n[2], 'sine', 0.035, n[1]);
        });
      }
    };
  })();

  // Helper: place center from HOST.places
  function placeCenter(id, fallback) {
    var p = HOST.places.filter(function (x) { return x.id === id; })[0];
    if (p && p.box) {
      var c = p.box.getCenter(new T3.Vector3());
      var gy = HOST.groundAt(c.x, c.z);
      return new T3.Vector3(c.x, (gy !== null && !isNaN(gy)) ? gy : (fallback ? fallback.y : 0.2), c.z);
    }
    return fallback ? fallback.clone() : new T3.Vector3(0, 0.2, 0);
  }

  // Helper: create a bottom floating dock
  function makeDock(title, borderHex) {
    var d = document.createElement('div');
    d.className = 'it-dock hidden';
    if (borderHex) {
      d.style.borderColor = borderHex;
      d.style.boxShadow = '0 14px 36px rgba(43,29,64,0.24), 0 6px 0 ' + borderHex;
    }
    d.innerHTML =
      '<div class="it-dock-head"><h4>' + title + '</h4>' +
      '<button type="button" class="it-close" aria-label="Close">✕</button></div>' +
      '<div class="it-dock-body"></div>';
    document.body.appendChild(d);
    return d;
  }

  // =========================================================================
  // TOOL 2 — ❄️ FREEZE! (Key F)
  // =========================================================================
  var FreezeTool = (function () {
    var frozen = false, counting = false;
    var overlay = null, card = null, bigEl = null, subEl = null;

    function build() {
      overlay = document.createElement('div');
      overlay.className = 'it-freeze-overlay';
      document.body.appendChild(overlay);

      card = document.createElement('div');
      card.className = 'it-freeze-card hidden';
      card.innerHTML = '<div class="it-freeze-big">❄️ FREEZE!</div><div class="it-freeze-sub">Tap here or press F to unfreeze</div>';
      card.onclick = function () { toggle(); };
      document.body.appendChild(card);
      bigEl = card.querySelector('.it-freeze-big');
      subEl = card.querySelector('.it-freeze-sub');

      window.addEventListener('keydown', function (e) {
        if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
        if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggle(); }
      });
    }

    function freeze() {
      if (frozen || counting) return;
      frozen = true;
      K.timeScale = 0;
      if (window.QuietIsland && window.QuietIsland.state && window.QuietIsland.state() !== 'calm') {
        // pause sound cleanly if needed
      }
      overlay.classList.add('on');
      bigEl.textContent = '❄️ FREEZE!';
      subEl.textContent = 'Tap here or press F to unfreeze';
      card.classList.remove('hidden');
      AUDIO.ice();
      if (K.say) K.say('Freeze!');
    }

    function unfreeze() {
      if (!frozen || counting) return;
      counting = true;
      var steps = ['3', '2', '1', 'Go!'];
      steps.forEach(function (txt, idx) {
        setTimeout(function () {
          bigEl.textContent = idx < 3 ? ('⏳ ' + txt + ' …') : '🌞 GO!';
          subEl.textContent = idx < 3 ? 'Get ready…' : 'Back to Adventure Island!';
          if (idx < 3) AUDIO.tick(true);
          else AUDIO.melt();
          if (K.say) K.say(txt);
          if (idx === 3) {
            K.timeScale = 1;
            overlay.classList.remove('on');
            setTimeout(function () {
              card.classList.add('hidden');
              frozen = false;
              counting = false;
            }, 650);
          }
        }, idx * 750);
      });
    }

    function toggle() { if (frozen) unfreeze(); else freeze(); }

    return { build: build, toggle: toggle, freeze: freeze, unfreeze: unfreeze, isFrozen: function () { return frozen; } };
  })();

  // =========================================================================
  // TOOL 3 — ⏱️ TIMER (THE SUN)
  // =========================================================================
  var SunTimerTool = (function () {
    var open = false, running = false, totalSec = 120, remSec = 120, lastWholeSec = 120;
    var dock = null, clockEl = null, sunMesh = null, haloMesh = null, flagWaveT = 0;
    var origSky = null, origSunCol = null, origSunInt = 1.28;

    function fmt(s) {
      s = Math.max(0, Math.ceil(s));
      var m = Math.floor(s / 60), r = s % 60;
      return m + ':' + (r < 10 ? '0' : '') + r;
    }

    function build() {
      clockEl = document.createElement('div');
      clockEl.className = 'it-sun-clock hidden';
      clockEl.textContent = '2:00';
      document.body.appendChild(clockEl);

      // 3D Sun + Halo moving across the sky
      sunMesh = new T3.Mesh(
        new T3.SphereGeometry(3.4, 22, 16),
        new T3.MeshBasicMaterial({ color: 0xffd84a })
      );
      haloMesh = new T3.Mesh(
        new T3.SphereGeometry(4.8, 18, 14),
        new T3.MeshBasicMaterial({ color: 0xffe896, transparent: true, opacity: 0.32, depthWrite: false })
      );
      sunMesh.add(haloMesh);
      sunMesh.visible = false;
      scene.add(sunMesh);

      dock = makeDock('⏱️ Sun Timer', '#ffb320');
      dock.querySelector('.it-close').onclick = close;
      var body = dock.querySelector('.it-dock-body');
      body.innerHTML =
        '<div class="it-dock-row">' +
          '<button type="button" class="it-btn" data-m="1">1 min</button>' +
          '<button type="button" class="it-btn" data-m="2">2 min</button>' +
          '<button type="button" class="it-btn" data-m="3">3 min</button>' +
          '<button type="button" class="it-btn" data-m="5">5 min</button>' +
          '<input type="number" class="it-input" id="itTimerCustom" min="10" max="1800" value="90" style="max-width:90px" title="Custom seconds">' +
          '<button type="button" class="it-btn" id="itTimerSetCustom">Set sec</button>' +
        '</div>' +
        '<div class="it-dock-row" style="margin-top:6px">' +
          '<button type="button" class="it-btn pick" id="itTimerStart">▶ Start</button>' +
          '<button type="button" class="it-btn back" id="itTimerPlus">+1 min</button>' +
          '<button type="button" class="it-btn" id="itTimerReset">🔄 Reset</button>' +
        '</div>';

      body.querySelectorAll('[data-m]').forEach(function (b) {
        b.onclick = function () { start(Number(b.getAttribute('data-m')) * 60); };
      });
      body.querySelector('#itTimerSetCustom').onclick = function () {
        var v = clamp(Number(body.querySelector('#itTimerCustom').value) || 60, 5, 3600);
        start(v);
      };
      body.querySelector('#itTimerStart').onclick = function () {
        if (remSec <= 0) remSec = totalSec;
        running = !running;
        updateBtns();
      };
      body.querySelector('#itTimerPlus').onclick = function () {
        totalSec += 60; remSec += 60; updateVisuals();
      };
      body.querySelector('#itTimerReset').onclick = function () {
        running = false; remSec = totalSec; B.hideBanner(); updateVisuals(); updateBtns();
      };
    }

    function updateBtns() {
      var b = dock.querySelector('#itTimerStart');
      if (b) b.textContent = running ? '⏸ Pause' : '▶ Start';
    }

    function updateVisuals() {
      var frac = totalSec > 0 ? clamp(1 - remSec / totalSec, 0, 1) : 1;
      clockEl.textContent = fmt(remSec);
      clockEl.classList.toggle('warm', frac >= 0.8 && remSec > 10);
      clockEl.classList.toggle('urgent', remSec <= 10);

      // Sun arc across the sky
      sunMesh.position.set(lerp(-42, 42, frac), 12 + Math.sin(frac * Math.PI) * 20, -48);
      var sunHex = remSec <= 10 ? 0xff6b3d : (frac >= 0.8 ? 0xff9b35 : 0xffd84a);
      sunMesh.material.color.setHex(sunHex);
      haloMesh.material.color.setHex(sunHex);

      // Warm lighting in last 20% & soft sunset sky in last 10s
      if (origSky && scene.background && scene.background.isColor) {
        var sunsetCol = new T3.Color(0xff9c6e);
        var warmCol = new T3.Color(0x9ec5eb);
        var targetSky = remSec <= 10 ? sunsetCol : (frac >= 0.8 ? warmCol : origSky);
        scene.background.copy(targetSky);
        if (scene.fog) scene.fog.color.copy(targetSky);
      }
      if (HOST.sun) {
        HOST.sun.color.setHex(remSec <= 10 ? 0xff9966 : (frac >= 0.8 ? 0xffcc88 : 0xfff4d6));
      }
    }

    function openTool() {
      B.closeOtherTools('timer');
      activeToolId = 'timer';
      open = true;
      if (!origSky && scene.background) origSky = scene.background.clone();
      if (!origSunCol && HOST.sun) { origSunCol = HOST.sun.color.clone(); origSunInt = HOST.sun.intensity; }
      dock.classList.remove('hidden');
      clockEl.classList.remove('hidden');
      sunMesh.visible = true;
      if (HOST.home) HOST.home();
      updateVisuals();
      updateBtns();
    }

    function start(sec) {
      if (!open) openTool();
      totalSec = sec || 120;
      remSec = totalSec;
      lastWholeSec = Math.ceil(remSec);
      running = true;
      B.hideBanner();
      updateVisuals();
      updateBtns();
    }

    function setRemaining(sec) {
      if (!open) openTool();
      remSec = clamp(sec, 0, totalSec);
      updateVisuals();
    }

    function close() {
      open = false; running = false;
      dock.classList.add('hidden');
      clockEl.classList.add('hidden');
      sunMesh.visible = false;
      B.hideBanner();
      if (origSky && scene.background) {
        scene.background.copy(origSky);
        if (scene.fog) scene.fog.color.copy(origSky);
      }
      if (HOST.sun && origSunCol) { HOST.sun.color.copy(origSunCol); HOST.sun.intensity = origSunInt; }
    }

    function update(dt) {
      if (!open) return;
      if (flagWaveT > 0 && HOST.ship) {
        flagWaveT = Math.max(0, flagWaveT - dt);
        HOST.ship.rotation.z = Math.sin(K.now * 10) * 0.12;
      }
      if (!running) return;
      remSec = Math.max(0, remSec - dt);
      var whole = Math.ceil(remSec);
      if (whole !== lastWholeSec) {
        lastWholeSec = whole;
        if (whole <= 10 && whole > 0) AUDIO.tick(whole <= 3);
      }
      updateVisuals();
      if (remSec <= 0) {
        running = false;
        flagWaveT = 4.0;
        AUDIO.shipHorn();
        B.showBannerText('⏱️ Time’s up!', '#ff5fa2');
        if (K.say) K.say('Time is up!');
        updateBtns();
      }
    }

    return { build: build, open: openTool, close: close, start: start, setRemaining: setRemaining, update: update };
  })();

  // =========================================================================
  // TOOL 4 — 👫 GROUP MAKER
  // =========================================================================
  var GroupMakerTool = (function () {
    var open = false, groupSize = 3, mixTeams = true, showList = false;
    var lastGroups = null; // kept in memory for this session ("same groups as last time")
    var dock = null, listCard = null, flagGroup = null, targets = [];

    function getSpots() {
      var amp = B.getAMP();
      return [
        { name: 'Beach',         pos: new T3.Vector3(HOST.DOCK.x - 4, 0.2, HOST.DOCK.z - 2) },
        { name: 'Flower Garden', pos: HOST.homes[3] ? HOST.homes[3].mon.clone().add(new T3.Vector3(-2, 0, 2)) : new T3.Vector3(14, 0.3, -12) },
        { name: 'Windmill',      pos: HOST.homes[2] ? HOST.homes[2].mon.clone().add(new T3.Vector3(3, 0, -2)) : new T3.Vector3(-28, 0.3, 19) },
        { name: 'Waterfall Pond',pos: HOST.homes[1] ? HOST.homes[1].mon.clone().add(new T3.Vector3(-4, 0, -2)) : new T3.Vector3(26, 0.3, 18) },
        { name: 'Castle Gate',   pos: placeCenter('today', new T3.Vector3(-5, 2.6, -20)).add(new T3.Vector3(0, 0, 7.5)) },
        { name: 'Plaza',         pos: new T3.Vector3(1, 0.2, 1.6) },
        { name: 'Library',       pos: placeCenter('library', new T3.Vector3(12, 0.2, 4)).add(new T3.Vector3(-3, 0, 5)) },
        { name: 'Stadium',       pos: placeCenter('games', new T3.Vector3(-4, 0.2, 9)) },
        { name: 'Amphitheatre',  pos: new T3.Vector3(amp.x, amp.y + 0.5, amp.z + 2) }
      ];
    }

    function build() {
      flagGroup = new T3.Group();
      scene.add(flagGroup);

      listCard = document.createElement('div');
      listCard.className = 'it-groups-card hidden';
      document.body.appendChild(listCard);

      dock = makeDock('👫 Group Maker', '#2fc58a');
      dock.querySelector('.it-close').onclick = close;
      var body = dock.querySelector('.it-dock-body');
      body.innerHTML =
        '<div class="it-dock-row">' +
          '<button type="button" class="it-btn pick" data-sz="2">Groups of 2</button>' +
          '<button type="button" class="it-btn pick" data-sz="3">Groups of 3</button>' +
          '<button type="button" class="it-btn pick" data-sz="4">Groups of 4</button>' +
          '<button type="button" class="it-btn toggle on" id="itGrpMix">🎨 Mix teams: ON</button>' +
          '<button type="button" class="it-btn" id="itGrpSame">🔁 Same as last</button>' +
          '<button type="button" class="it-btn toggle" id="itGrpList">📋 Show list</button>' +
        '</div>';

      body.querySelectorAll('[data-sz]').forEach(function (b) {
        b.onclick = function () { make(Number(b.getAttribute('data-sz')), mixTeams); };
      });
      body.querySelector('#itGrpMix').onclick = function (e) {
        mixTeams = !mixTeams;
        e.target.classList.toggle('on', mixTeams);
        e.target.textContent = mixTeams ? '🎨 Mix teams: ON' : '🎨 Mix teams: OFF';
      };
      body.querySelector('#itGrpSame').onclick = function () { if (lastGroups) applyGroups(lastGroups); };
      body.querySelector('#itGrpList').onclick = function (e) {
        showList = !showList;
        e.target.classList.toggle('on', showList);
        listCard.classList.toggle('hidden', !showList);
      };
    }

    function make(sz, mix) {
      groupSize = sz || 3;
      mixTeams = mix != null ? !!mix : mixTeams;
      return B.ensurePupils().then(function () {
        var ps = B.getPupils().slice();
        // Shuffle
        for (var i = ps.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = ps[i]; ps[i] = ps[j]; ps[j] = tmp;
        }
        var numGroups = Math.max(1, Math.ceil(ps.length / groupSize));
        var groups = [];
        for (var g = 0; g < numGroups; g++) groups.push([]);

        if (mixTeams) {
          // Sort by team first, then deal round-robin across groups so each group gets mixed colours
          ps.sort(function (a, b) { return a.team - b.team; });
          ps.forEach(function (p, idx) { groups[idx % numGroups].push(p); });
        } else {
          ps.forEach(function (p, idx) { groups[Math.floor(idx / groupSize)].push(p); });
        }
        lastGroups = groups;
        applyGroups(groups);
      });
    }

    function applyGroups(groups) {
      var sg = B.getSeatGroup();
      if (sg) sg.visible = true;
      while (flagGroup.children.length) flagGroup.remove(flagGroup.children[0]);
      targets = [];
      var spots = getSpots();
      var gCols = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a', '#9b7bff', '#ff8c42'];

      var html = '';
      groups.forEach(function (members, gi) {
        var spot = spots[gi % spots.length];
        var col = gCols[gi % gCols.length];
        var gy = HOST.groundAt(spot.pos.x, spot.pos.z);
        var sy = (gy !== null && !isNaN(gy)) ? gy : spot.pos.y;

        // Numbered flag at meeting spot
        var pole = new T3.Mesh(new T3.CylinderGeometry(0.1, 0.1, 4.4, 8), new T3.MeshStandardMaterial({ color: 0xffffff }));
        pole.position.set(spot.pos.x, sy + 2.2, spot.pos.z);
        flagGroup.add(pole);
        var fl = makeSpriteText('Group ' + (gi + 1), '#fffdf7', col, '#2b1d40', 256, 110, 48);
        fl.scale.set(4.8, 2.1, 1);
        fl.position.set(spot.pos.x, sy + 5.1, spot.pos.z);
        flagGroup.add(fl);

        html += '<div class="it-grp-box" style="border-color:' + col + '"><b>Group ' + (gi + 1) + ' · ' + spot.name + '</b>';
        members.forEach(function (p, mi) {
          var ang = (mi / Math.max(1, members.length)) * Math.PI * 2;
          var px = spot.pos.x + Math.cos(ang) * 2.1;
          var pz = spot.pos.z + Math.sin(ang) * 2.1;
          var py = HOST.groundAt(px, pz);
          if (py === null || isNaN(py)) py = sy;
          targets.push({ p: p, dest: new T3.Vector3(px, py + 0.06, pz) });
          p.ch.setState('run');
          html += '<div class="it-grp-mem"><span class="it-grp-dot" style="background:' + p.teamObj.c + '"></span>' + p.name + '</div>';
        });
        html += '</div>';
      });
      listCard.innerHTML = html;
      AUDIO.pop();
      if (HOST.home) HOST.home();
    }

    function openTool() {
      B.closeOtherTools('groups');
      activeToolId = 'groups';
      open = true;
      dock.classList.remove('hidden');
      make(groupSize, mixTeams);
    }

    function close() {
      open = false;
      dock.classList.add('hidden');
      listCard.classList.add('hidden');
      while (flagGroup.children.length) flagGroup.remove(flagGroup.children[0]);
      targets = [];
      B.getPupils().forEach(function (p) { p.root.position.copy(p.seatPos); p.ch.setState('idle'); });
      var sg = B.getSeatGroup();
      if (sg) sg.visible = false;
    }

    function update(dt) {
      if (!open || !targets.length) return;
      targets.forEach(function (t) {
        var d = t.p.root.position.distanceTo(t.dest);
        if (d > 0.15) {
          t.p.root.position.lerp(t.dest, clamp(dt * 3.8, 0, 1));
          t.p.root.rotation.y = Math.atan2(t.dest.x - t.p.root.position.x, t.dest.z - t.p.root.position.z);
        } else {
          t.p.ch.setState('cheer');
        }
      });
    }

    return {
      build: build, open: openTool, close: close, make: make, update: update,
      toggleList: function (v) { showList = v != null ? !!v : !showList; listCard.classList.toggle('hidden', !showList); }
    };
  })();

  // =========================================================================
  // TOOL 5 — 🚶 LINE-UP (Queue on the harbour dock by the pirate ship)
  // =========================================================================
  var LineUpTool = (function () {
    var open = false, dock = null, numGroup = null, queue = [], onBoat = null, hopT = 0;

    function build() {
      numGroup = new T3.Group();
      scene.add(numGroup);

      dock = makeDock('🚶 Line-up at the Dock', '#4f9dff');
      dock.querySelector('.it-close').onclick = close;
      var body = dock.querySelector('.it-dock-body');
      body.innerHTML =
        '<div class="it-dock-row">' +
          '<button type="button" class="it-btn pick" id="itLuNext">⛵ Next!</button>' +
          '<button type="button" class="it-btn" id="itLuAll">🔀 All Class</button>' +
          '<select class="it-select" id="itLuTeam">' +
            '<option value="-1">Filter: All teams</option>' +
            '<option value="0">Pink team only</option>' +
            '<option value="1">Blue team only</option>' +
            '<option value="2">Yellow team only</option>' +
            '<option value="3">Green team only</option>' +
          '</select>' +
        '</div>';

      body.querySelector('#itLuNext').onclick = next;
      body.querySelector('#itLuAll').onclick = function () { start(-1); };
      body.querySelector('#itLuTeam').onchange = function (e) { start(Number(e.target.value)); };
    }

    function layoutQueue() {
      while (numGroup.children.length) numGroup.remove(numGroup.children[0]);
      var deck = B.getShipDeck();
      queue.forEach(function (p, idx) {
        p.root.visible = true;
        var qx = HOST.DOCK.x + 6.5 - idx * 1.45;
        var qz = HOST.DOCK.z;
        var qy = HOST.groundAt(qx, qz);
        if (qy === null || isNaN(qy)) qy = 0.2;
        p._luTarget = new T3.Vector3(qx, Math.max(0.1, qy + 0.08), qz);
        p.root.rotation.y = Math.PI * 0.5;
        p.ch.setState('idle');

        var sp = makeSpriteText(String(idx + 1), '#fffdf7', p.teamObj.c, '#2b1d40', 96, 96, 56);
        sp.scale.set(1.35, 1.35, 1);
        sp.position.set(qx, p._luTarget.y + 3.0, qz);
        numGroup.add(sp);
        p._luNum = sp;
      });
      if (onBoat) {
        onBoat.root.visible = true;
        onBoat._luTarget = new T3.Vector3(deck.x, deck.y, deck.z);
      }
    }

    function start(teamFilter) {
      return B.ensurePupils().then(function () {
        var sg = B.getSeatGroup();
        if (sg) sg.visible = true;
        var all = B.getPupils();
        all.forEach(function (p) { p.root.visible = false; });
        queue = all.filter(function (p) { return teamFilter == null || teamFilter < 0 || p.team === teamFilter; });
        // Shuffle random order
        for (var i = queue.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = queue[i]; queue[i] = queue[j]; queue[j] = tmp;
        }
        onBoat = null;
        layoutQueue();
        // Snap initial positions cleanly
        queue.forEach(function (p) { p.root.position.copy(p._luTarget); });

        K.cam.follow = null;
        K.cam.set(
          new T3.Vector3(HOST.DOCK.x + 2, 13.5, HOST.DOCK.z + 24),
          new T3.Vector3(HOST.DOCK.x + 1, 1.5, HOST.DOCK.z + 1),
          3.0
        );
        AUDIO.pop();
      });
    }

    function next() {
      if (!queue.length) {
        B.showBannerText('🎉 Everyone had a turn!', '#2fc58a');
        return;
      }
      if (onBoat) { onBoat.root.visible = false; }
      onBoat = queue.shift();
      hopT = 0;
      onBoat._luFrom = onBoat.root.position.clone();
      onBoat.ch.setState('cheer');
      layoutQueue();
      AUDIO.pop();
      B.showBannerText('⛵ Next up: ' + onBoat.name + '!', onBoat.teamObj.c);
      if (K.say) K.say('Next, ' + onBoat.name + '!');
    }

    function openTool() {
      B.closeOtherTools('lineup');
      activeToolId = 'lineup';
      open = true;
      dock.classList.remove('hidden');
      start(-1);
    }

    function close() {
      open = false;
      dock.classList.add('hidden');
      B.hideBanner();
      while (numGroup.children.length) numGroup.remove(numGroup.children[0]);
      B.getPupils().forEach(function (p) { p.root.visible = true; p.root.position.copy(p.seatPos); p.ch.setState('idle'); });
      var sg = B.getSeatGroup();
      if (sg) sg.visible = false;
      if (HOST.home) HOST.home();
    }

    function update(dt) {
      if (!open) return;
      queue.forEach(function (p) {
        if (p._luTarget) {
          p.root.position.lerp(p._luTarget, clamp(dt * 6, 0, 1));
          if (p._luNum) p._luNum.position.set(p.root.position.x, p.root.position.y + 3.0, p.root.position.z);
        }
      });
      if (onBoat && onBoat._luTarget && onBoat._luFrom) {
        hopT = Math.min(1, hopT + dt * 1.9);
        onBoat.root.position.lerpVectors(onBoat._luFrom, onBoat._luTarget, easeOut(hopT));
        onBoat.root.position.y += Math.sin(hopT * Math.PI) * 3.2;
      }
    }

    return { build: build, open: openTool, close: close, start: start, next: next, update: update };
  })();

  // =========================================================================
  // TOOL 6 — 🎲 DICE AND SPINNER (in the Stadium)
  // =========================================================================
  var DiceSpinnerTool = (function () {
    var open = false, dock = null, grp = null, STAD = null;
    var diceMesh = null, diceState = { rolling: false, t: 0, dur: 1.5, result: 1, vx: 0, vz: 0, vy: 0, startRot: null, endRot: null };
    var wheelGroup = null, wheelMesh = null, pointerMesh = null;
    var segments = ['Pink', 'Blue', 'Yellow', 'Green', 'Bonus ★', 'Swap!'];
    var spinState = { spinning: false, ang: 0, vel: 0, lastWedge: -1 };

    // Orientation Euler angles so face N (1..6) faces straight UP (+Y)
    // BoxGeometry material order: 0:+X(3), 1:-X(4), 2:+Y(1), 3:-Y(6), 4:+Z(2), 5:-Z(5)
    var FACE_UP_EULER = {
      1: [0, 0, 0],
      2: [-Math.PI / 2, 0, 0],
      3: [0, 0, Math.PI / 2],
      4: [0, 0, -Math.PI / 2],
      5: [Math.PI / 2, 0, 0],
      6: [Math.PI, 0, 0]
    };

    function makeDieFace(n) {
      var cv = document.createElement('canvas'); cv.width = 256; cv.height = 256;
      var g = cv.getContext('2d');
      g.fillStyle = '#fffdf7'; g.fillRect(0, 0, 256, 256);
      g.strokeStyle = '#d8c8ee'; g.lineWidth = 14; g.strokeRect(7, 7, 242, 242);
      var cols = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a', '#9b7bff', '#ff5fa2'];
      g.fillStyle = cols[(n - 1) % 6];
      var pts = {
        1: [[128, 128]],
        2: [[72, 72], [184, 184]],
        3: [[68, 68], [128, 128], [188, 188]],
        4: [[72, 72], [184, 72], [72, 184], [184, 184]],
        5: [[68, 68], [188, 68], [128, 128], [68, 188], [188, 188]],
        6: [[72, 64], [184, 64], [72, 128], [184, 128], [72, 192], [184, 192]]
      }[n];
      pts.forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 24, 0, Math.PI * 2); g.fill(); });
      var tex = new T3.CanvasTexture(cv);
      tex.colorSpace = T3.SRGBColorSpace;
      return new T3.MeshStandardMaterial({ map: tex, roughness: 0.3 });
    }

    function rebuildWheel() {
      if (wheelMesh) { wheelGroup.remove(wheelMesh); wheelMesh.geometry.dispose(); }
      var n = clamp(segments.length, 2, 12);
      var cv = document.createElement('canvas'); cv.width = 512; cv.height = 512;
      var g = cv.getContext('2d'), cx = 256, cy = 256, rad = 244;
      var cols = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a', '#9b7bff', '#ff8c42'];
      var step = (Math.PI * 2) / n;
      for (var i = 0; i < n; i++) {
        var a0 = i * step, a1 = a0 + step;
        g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, rad, a0, a1); g.closePath();
        g.fillStyle = cols[i % cols.length]; g.fill();
        g.lineWidth = 5; g.strokeStyle = '#fffdf7'; g.stroke();
        g.save();
        g.translate(cx, cy);
        g.rotate(a0 + step / 2);
        g.fillStyle = '#ffffff';
        g.font = '900 ' + (n > 8 ? 24 : 32) + 'px Nunito, Trebuchet MS, sans-serif';
        g.textAlign = 'right'; g.textBaseline = 'middle';
        g.fillText(String(segments[i]).slice(0, 12), rad - 22, 0);
        g.restore();
      }
      g.beginPath(); g.arc(cx, cy, 34, 0, Math.PI * 2); g.fillStyle = '#fffdf7'; g.fill();
      var tex = new T3.CanvasTexture(cv); tex.colorSpace = T3.SRGBColorSpace;
      var mats = [
        new T3.MeshStandardMaterial({ color: 0xfffdf7, roughness: 0.4 }),
        new T3.MeshStandardMaterial({ map: tex, roughness: 0.35 }),
        new T3.MeshStandardMaterial({ color: 0xfffdf7, roughness: 0.4 })
      ];
      wheelMesh = new T3.Mesh(new T3.CylinderGeometry(4.4, 4.4, 0.36, 40), mats);
      wheelMesh.position.y = 0.25;
      wheelGroup.add(wheelMesh);
    }

    function build() {
      STAD = placeCenter('games', new T3.Vector3(-4, 0.2, 10));
      grp = new T3.Group();
      grp.visible = false;
      scene.add(grp);

      // Giant 3D Die (order: +X=3, -X=4, +Y=1, -Y=6, +Z=2, -Z=5)
      var dMats = [makeDieFace(3), makeDieFace(4), makeDieFace(1), makeDieFace(6), makeDieFace(2), makeDieFace(5)];
      diceMesh = new T3.Mesh(new T3.BoxGeometry(2.4, 2.4, 2.4), dMats);
      diceMesh.castShadow = true;
      diceMesh.position.set(STAD.x - 3.6, STAD.y + 2.2, STAD.z);
      grp.add(diceMesh);

      // 3D Spinner Wheel beside the die on top of the stadium turf
      wheelGroup = new T3.Group();
      wheelGroup.position.set(STAD.x + 2.4, STAD.y + 1.15, STAD.z);
      grp.add(wheelGroup);
      rebuildWheel();

      pointerMesh = new T3.Mesh(new T3.ConeGeometry(0.55, 1.35, 4), new T3.MeshStandardMaterial({ color: 0xff5fa2 }));
      pointerMesh.rotation.x = Math.PI * 0.5;
      pointerMesh.position.set(0, 0.72, -4.65);
      wheelGroup.add(pointerMesh);

      dock = makeDock('🎲 Stadium Dice & Spinner', '#9b7bff');
      dock.querySelector('.it-close').onclick = close;
      var body = dock.querySelector('.it-dock-body');
      body.innerHTML =
        '<div class="it-dock-row">' +
          '<button type="button" class="it-btn pick" id="itRollBtn">🎲 Roll Dice</button>' +
          '<button type="button" class="it-btn back" id="itSpinBtn">🎡 Spin Wheel</button>' +
          '<input type="text" class="it-input" id="itSegInput" value="Pink, Blue, Yellow, Green, Bonus ★, Swap!" placeholder="2–12 comma-separated items">' +
          '<button type="button" class="it-btn" id="itApplySegs">Update Wheel</button>' +
        '</div>';
      body.querySelector('#itRollBtn').onclick = rollDice;
      body.querySelector('#itSpinBtn').onclick = spinWheel;
      body.querySelector('#itApplySegs').onclick = function () {
        var raw = body.querySelector('#itSegInput').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        if (raw.length >= 2) { segments = raw.slice(0, 12); rebuildWheel(); AUDIO.tick(true); }
      };
    }

    function rollDice() {
      if (!open) openTool();
      B.hideBanner();
      diceState.rolling = true;
      diceState.t = 0;
      diceState.dur = 1.45;
      diceState.result = 1 + Math.floor(Math.random() * 6);
      var target = FACE_UP_EULER[diceState.result];
      diceState.startRot = new T3.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      diceState.endRot = new T3.Vector3(target[0] + Math.PI * 4, target[1] + Math.PI * 2, target[2] + Math.PI * 4);
      AUDIO.pop();
      K.cam.follow = null;
      K.cam.set(new T3.Vector3(STAD.x - 3.2, STAD.y + 13.5, STAD.z + 9.5), new T3.Vector3(STAD.x - 3.2, STAD.y + 1.2, STAD.z), 3.4);
    }

    function spinWheel() {
      if (!open) openTool();
      B.hideBanner();
      spinState.spinning = true;
      spinState.vel = 13 + Math.random() * 6;
      K.cam.follow = null;
      K.cam.set(new T3.Vector3(STAD.x + 2.8, STAD.y + 14.5, STAD.z + 10.5), new T3.Vector3(STAD.x + 2.8, STAD.y + 0.5, STAD.z), 3.2);
    }

    function openTool() {
      B.closeOtherTools('dice');
      activeToolId = 'dice';
      open = true;
      grp.visible = true;
      dock.classList.remove('hidden');
      K.cam.follow = null;
      K.cam.set(new T3.Vector3(STAD.x, STAD.y + 15.5, STAD.z + 14.5), new T3.Vector3(STAD.x, STAD.y + 0.5, STAD.z), 2.8);
    }

    function close() {
      open = false;
      grp.visible = false;
      dock.classList.add('hidden');
      B.hideBanner();
      if (HOST.home) HOST.home();
    }

    function update(dt) {
      if (!open) return;
      if (diceState.rolling) {
        diceState.t += dt;
        var k = clamp(diceState.t / diceState.dur, 0, 1);
        var ek = easeOut(k);
        var bounce = Math.abs(Math.sin(k * Math.PI * 3)) * (1 - k) * 4.8;
        diceMesh.position.set(STAD.x - 3.6 + Math.sin(k * Math.PI) * 1.4, STAD.y + 2.2 + bounce, STAD.z);
        diceMesh.rotation.set(
          lerp(diceState.startRot.x, diceState.endRot.x, ek),
          lerp(diceState.startRot.y, diceState.endRot.y, ek),
          lerp(diceState.startRot.z, diceState.endRot.z, ek)
        );
        if (k >= 1) {
          diceState.rolling = false;
          var e = FACE_UP_EULER[diceState.result];
          diceMesh.rotation.set(e[0], e[1], e[2]);
          diceMesh.position.set(STAD.x - 3.6, STAD.y + 2.2, STAD.z);
          AUDIO.pop();
          B.showBannerText('🎲 Rolled a ' + diceState.result + '!', '#ff5fa2');
          if (K.say) K.say('You rolled a ' + diceState.result + '!');
        }
      }
      if (spinState.spinning) {
        spinState.ang += spinState.vel * dt;
        spinState.vel *= Math.pow(0.28, dt);
        wheelMesh.rotation.y = spinState.ang;
        var n = segments.length;
        var wedge = Math.floor(((((-spinState.ang) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / ((Math.PI * 2) / n));
        if (wedge !== spinState.lastWedge) { spinState.lastWedge = wedge; AUDIO.tick(false); }
        if (spinState.vel < 0.14) {
          spinState.spinning = false;
          var win = segments[wedge % n];
          AUDIO.pop();
          if (K.fx && K.fx.confetti) K.fx.confetti(new T3.Vector3(STAD.x + 2.8, STAD.y + 3, STAD.z), 90);
          B.showBannerText('🎡 ' + win + '!', '#4f9dff');
          if (K.say) K.say(String(win));
        }
      }
    }

    return { build: build, open: openTool, close: close, rollDice: rollDice, spinWheel: spinWheel, update: update };
  })();

  // =========================================================================
  // TOOL 7 — 🎁 PRIZE DROP (Tripo box-gold.glb under hot-air balloon)
  // =========================================================================
  var PrizeDropTool = (function () {
    var open = false, dock = null, boxGroup = null, boxModel = null, prizeStar = null;
    var anim = { active: false, t: 0, target: 'Whole class', opened: false };
    var balloonHome = null;

    function build() {
      boxGroup = new T3.Group();
      boxGroup.visible = false;
      scene.add(boxGroup);

      // Cute placeholder box until box-gold.glb finishes loading
      var fallback = new T3.Mesh(new T3.BoxGeometry(2.2, 2.2, 2.2), new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: 0.3 }));
      fallback.position.y = 1.1;
      boxGroup.add(fallback);

      K.tryGLB('tools/models/box-gold.glb').then(function (gltf) {
        if (!gltf || !gltf.scene) return;
        boxModel = K.fitModel(gltf.scene, 2.8);
        boxGroup.remove(fallback);
        boxGroup.add(boxModel);
      }).catch(function () {});

      // Glowing placeholder prize star popping out when box opens
      prizeStar = new T3.Mesh(
        new T3.OctahedronGeometry(1.15, 0),
        new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffb320, emissiveIntensity: 0.45, roughness: 0.2 })
      );
      prizeStar.visible = false;
      scene.add(prizeStar);

      dock = makeDock('🎁 Prize Drop', '#ffb320');
      dock.querySelector('.it-close').onclick = close;
      var body = dock.querySelector('.it-dock-body');
      body.innerHTML =
        '<div class="it-dock-row">' +
          '<select class="it-select" id="itPrizeTarget">' +
            '<option value="Whole class">Whole class</option>' +
            '<option value="Team Pink">Team Pink</option>' +
            '<option value="Team Blue">Team Blue</option>' +
            '<option value="Team Yellow">Team Yellow</option>' +
            '<option value="Team Green">Team Green</option>' +
            '<option value="One pupil">One pupil</option>' +
          '</select>' +
          '<button type="button" class="it-btn pick" id="itDropBtn">🎈 Drop Mystery Box!</button>' +
        '</div>';
      body.querySelector('#itDropBtn').onclick = function () {
        drop(body.querySelector('#itPrizeTarget').value);
      };
    }

    function drop(target) {
      if (!open) openTool();
      var amp = B.getAMP();
      var bal = HOST.extrasByModel && HOST.extrasByModel['hot-air-balloon'];
      if (bal && !balloonHome) balloonHome = bal.group.position.clone();
      HOST.quietHooks.overrideBalloon = true;
      anim = { active: true, t: 0, target: target || 'Whole class', opened: false };
      boxGroup.visible = true;
      boxGroup.scale.setScalar(1);
      prizeStar.visible = false;
      B.hideBanner();
      AUDIO.pop();
      K.cam.follow = null;
      K.cam.set(new T3.Vector3(amp.x + 11, 13.5, amp.z + 20), new T3.Vector3(amp.x, 3.2, amp.z), 3.0);
    }

    function openTool() {
      B.closeOtherTools('prize');
      activeToolId = 'prize';
      open = true;
      dock.classList.remove('hidden');
      drop('Whole class');
    }

    function close() {
      open = false; anim.active = false;
      dock.classList.add('hidden');
      boxGroup.visible = false;
      prizeStar.visible = false;
      B.hideBanner();
      var bal = HOST.extrasByModel && HOST.extrasByModel['hot-air-balloon'];
      if (bal && balloonHome) bal.group.position.copy(balloonHome);
      HOST.quietHooks.overrideBalloon = false;
      if (HOST.home) HOST.home();
    }

    function update(dt) {
      if (!open || !anim.active) return;
      anim.t += dt;
      var amp = B.getAMP();
      var stageY = amp.y + 2.45;
      var bal = HOST.extrasByModel && HOST.extrasByModel['hot-air-balloon'];

      if (anim.t < 2.0) {
        // Float down under the hot-air balloon onto the amphitheatre stage
        var k = easeOut(anim.t / 2.0);
        var by = lerp(22, stageY, k);
        boxGroup.position.set(amp.x, by, amp.z);
        boxGroup.rotation.y = anim.t * 1.4;
        if (bal) bal.group.position.set(amp.x, by + 5.2, amp.z);
      } else if (anim.t < 3.1) {
        // Box sits on stage and wobbles with anticipation while balloon drifts up
        var w = (anim.t - 2.0) / 1.1;
        boxGroup.position.set(amp.x, stageY, amp.z);
        boxGroup.rotation.z = Math.sin(anim.t * 24) * 0.22 * (1 - w * 0.2);
        var sq = 1 + Math.sin(anim.t * 18) * 0.08;
        boxGroup.scale.set(sq, 1 / sq, sq);
        if (bal) bal.group.position.y += dt * 4.5;
      } else {
        // Pops open with sparkles & placeholder prize!
        if (!anim.opened) {
          anim.opened = true;
          AUDIO.melt();
          if (K.fx && K.fx.confetti) K.fx.confetti(new T3.Vector3(amp.x, stageY + 2.5, amp.z), 140);
          B.showBannerText('🎁 Mystery Prize for ' + anim.target + '!', '#ffb320');
          if (K.say) K.say('Mystery prize for ' + anim.target + '!');
          window.dispatchEvent(new CustomEvent('tools:prize-drop', { detail: { target: anim.target } }));
        }
        boxGroup.rotation.z = 0;
        boxGroup.position.set(amp.x, stageY, amp.z);
        boxGroup.scale.set(1.15, 0.85, 1.15);
        prizeStar.visible = true;
        prizeStar.position.set(amp.x, stageY + 3.6 + Math.sin(anim.t * 3.5) * 0.35, amp.z);
        prizeStar.rotation.y = anim.t * 2.5;
      }
    }

    return {
      build: build, open: openTool, close: close, drop: drop, update: update,
      seekOpen: function () { if (!open) openTool(); anim.t = 3.25; update(0.02); if (K.cam.snap) K.cam.snap(); }
    };
  })();

  // =========================================================================
  // TOOL 8 — ⭐ TWO STARS OF THE WEEK (at the Castle Gate, display only)
  // =========================================================================
  var TwoStarsTool = (function () {
    var open = false, dock = null, grp = null, floatStars = [], starPupils = [];

    function build() {
      grp = new T3.Group();
      grp.visible = false;
      scene.add(grp);

      dock = makeDock('⭐ Two Stars of the Week', '#ffb320');
      dock.querySelector('.it-close').onclick = close;
      dock.querySelector('.it-dock-body').innerHTML =
        '<div class="it-dock-row">' +
          '<button type="button" class="it-btn pick" id="itStarsCheer">🎉 Cheer Again!</button>' +
          '<span style="font-weight:800;color:#5b437a">Displayed from IslandTools.getStars() at the Castle Gate</span>' +
        '</div>';
      dock.querySelector('#itStarsCheer').onclick = function () {
        AUDIO.melt();
        var gate = placeCenter('today', new T3.Vector3(-4.9, 2.6, -24)).add(new T3.Vector3(0, 2, 7.5));
        if (K.fx && K.fx.confetti) K.fx.confetti(gate, 110);
      };
    }

    function openTool() {
      B.closeOtherTools('stars');
      activeToolId = 'stars';
      open = true;
      dock.classList.remove('hidden');

      var gate = placeCenter('today', new T3.Vector3(-4.9, 2.6, -24));
      var gy = HOST.groundAt(gate.x, gate.z + 7.2);
      var baseY = (gy !== null && !isNaN(gy)) ? gy : 2.5;

      while (grp.children.length) grp.remove(grp.children[0]);
      floatStars = []; starPupils = [];
      grp.visible = true;

      var stars = (IT.getStars && IT.getStars()) || IT.getRoster().slice(0, 2);
      var names = [];

      stars.slice(0, 2).forEach(function (st, idx) {
        names.push(st.name);
        var px = gate.x + (idx === 0 ? -3.2 : 3.2), pz = gate.z + 7.4;
        var team = K.TEAMS[(st.team || idx) % 4] || K.TEAMS[0];

        // Gold podium
        var pod = new T3.Mesh(
          new T3.CylinderGeometry(1.5, 1.85, 1.35, 22),
          new T3.MeshStandardMaterial({ color: 0xffd84a, roughness: 0.25, metalness: 0.15 })
        );
        pod.position.set(px, baseY + 0.68, pz);
        grp.add(pod);

        // Soft glow ring
        var ring = new T3.Mesh(
          new T3.RingGeometry(1.75, 2.35, 28),
          new T3.MeshBasicMaterial({ color: 0xffe88a, transparent: true, opacity: 0.65, side: T3.DoubleSide, depthWrite: false })
        );
        ring.rotation.x = -Math.PI * 0.5;
        ring.position.set(px, baseY + 0.08, pz);
        grp.add(ring);

        // Giant spinning gold star behind avatar
        var star = new T3.Mesh(
          new T3.OctahedronGeometry(1.3, 0),
          new T3.MeshStandardMaterial({ color: 0xffd84a, emissive: 0xffb320, emissiveIntensity: 0.5 })
        );
        star.position.set(px, baseY + 4.3, pz - 0.8);
        grp.add(star);
        floatStars.push({ mesh: star, y0: star.position.y, ph: idx * 2.1 });

        // Floating little stars
        for (var k = 0; k < 5; k++) {
          var sm = new T3.Mesh(new T3.OctahedronGeometry(0.26, 0), new T3.MeshBasicMaterial({ color: 0xffe875 }));
          sm.position.set(px + (Math.random() - 0.5) * 3.2, baseY + 1.5 + Math.random() * 3.5, pz + (Math.random() - 0.5) * 2.5);
          grp.add(sm);
          floatStars.push({ mesh: sm, y0: sm.position.y, ph: k * 1.4 + idx });
        }

        // Name plate
        var lab = makeSpriteText('⭐ ' + st.name, '#fffdf7', team.c, '#2b1d40', 256, 96, 42);
        lab.scale.set(3.6, 1.35, 1);
        lab.position.set(px, baseY + 5.7, pz);
        grp.add(lab);

        K.makeCharacter(team, { kidsOnly: true, kidHeight: 2.35 }).then(function (ch) {
          if (!open) return;
          ch.root.position.set(px, baseY + 1.38, pz);
          ch.setState('wave');
          grp.add(ch.root);
          starPupils.push(ch);
        });
      });

      K.cam.follow = null;
      K.cam.set(new T3.Vector3(gate.x, baseY + 8.5, gate.z + 23), new T3.Vector3(gate.x, baseY + 2.8, gate.z + 6), 3.0);
      AUDIO.melt();
      B.showBannerText('⭐ Stars of the Week: ' + names.join(' & ') + '!', '#ffb320');
      if (K.say) K.say('Stars of the week: ' + names.join(' and ') + '!');
    }

    function close() {
      open = false;
      grp.visible = false;
      dock.classList.add('hidden');
      B.hideBanner();
      starPupils = [];
      if (HOST.home) HOST.home();
    }

    function update(dt, t) {
      if (!open) return;
      starPupils.forEach(function (ch) { ch.update(dt); });
      floatStars.forEach(function (fs) {
        fs.mesh.position.y = fs.y0 + Math.sin(t * 2.8 + fs.ph) * 0.45;
        fs.mesh.rotation.y = t * 1.8 + fs.ph;
      });
    }

    return { build: build, open: openTool, close: close, update: update };
  })();

  // =========================================================================
  // TOOL 9 — 🎂 BIRTHDAY PARTY (Instrumental melody only, no lyrics, no storage)
  // =========================================================================
  var BirthdayTool = (function () {
    var open = false, dock = null, grp = null, balloons = [], flames = [], bdayCh = null, confettiT = 0;

    function build() {
      grp = new T3.Group();
      grp.visible = false;
      scene.add(grp);

      dock = makeDock('🎂 Birthday Party', '#ff5fa2');
      dock.querySelector('.it-close').onclick = close;
      var body = dock.querySelector('.it-dock-body');
      body.innerHTML =
        '<div class="it-dock-row">' +
          '<select class="it-select" id="itBdaySelect"></select>' +
          '<button type="button" class="it-btn pick" id="itBdayGo">🎂 Start Party!</button>' +
          '<button type="button" class="it-btn back" id="itBdayMusic">🎵 Play Melody</button>' +
        '</div>';
      body.querySelector('#itBdayGo').onclick = function () {
        celebrate(body.querySelector('#itBdaySelect').value);
      };
      body.querySelector('#itBdayMusic').onclick = function () { AUDIO.birthdayMelody(); };
    }

    function populateSelect() {
      var sel = dock.querySelector('#itBdaySelect');
      var roster = IT.getRoster() || [];
      sel.innerHTML = roster.map(function (r) {
        return '<option value="' + r.id + '">' + r.name + '</option>';
      }).join('');
    }

    function celebrate(pupilId) {
      var roster = IT.getRoster() || [];
      var chosen = roster.filter(function (r) { return r.id === pupilId; })[0] || roster[0];
      if (!chosen) return;
      var amp = B.getAMP();
      var stageY = amp.y + 1.35;

      while (grp.children.length) grp.remove(grp.children[0]);
      balloons = []; flames = []; bdayCh = null;
      grp.visible = true;

      // Multi-tier cartoon Birthday Cake on the amphitheatre stage
      var tier1 = new T3.Mesh(new T3.CylinderGeometry(2.1, 2.2, 1.2, 24), new T3.MeshStandardMaterial({ color: 0xffd1e8, roughness: 0.4 }));
      tier1.position.set(amp.x, stageY + 0.6, amp.z);
      var tier2 = new T3.Mesh(new T3.CylinderGeometry(1.45, 1.5, 1.0, 24), new T3.MeshStandardMaterial({ color: 0xfff8ec, roughness: 0.35 }));
      tier2.position.set(amp.x, stageY + 1.65, amp.z);
      var frosting = new T3.Mesh(new T3.TorusGeometry(1.48, 0.2, 10, 24), new T3.MeshStandardMaterial({ color: 0xff5fa2, roughness: 0.3 }));
      frosting.rotation.x = Math.PI * 0.5; frosting.position.set(amp.x, stageY + 2.1, amp.z);
      grp.add(tier1, tier2, frosting);

      // 5 glowing candles on top
      var cCols = [0xff5fa2, 0x4f9dff, 0xffb320, 0x2fc58a, 0x9b7bff];
      for (var ci = 0; ci < 5; ci++) {
        var ang = (ci / 5) * Math.PI * 2;
        var cx = amp.x + Math.cos(ang) * 0.72, cz = amp.z + Math.sin(ang) * 0.72;
        var candle = new T3.Mesh(new T3.CylinderGeometry(0.09, 0.09, 0.7, 8), new T3.MeshStandardMaterial({ color: cCols[ci] }));
        candle.position.set(cx, stageY + 2.5, cz);
        var flame = new T3.Mesh(new T3.SphereGeometry(0.14, 8, 6), new T3.MeshBasicMaterial({ color: 0xffe45e }));
        flame.scale.set(0.8, 1.45, 0.8);
        flame.position.set(cx, stageY + 2.95, cz);
        grp.add(candle, flame);
        flames.push({ mesh: flame, ph: ci * 1.3 });
      }

      // 14 floating colourful balloons rising around the amphitheatre stage
      var bCols = [0xff5fa2, 0x4f9dff, 0xffd84a, 0x2fc58a, 0x9b7bff];
      for (var bi = 0; bi < 14; bi++) {
        var ba = (bi / 14) * Math.PI * 2;
        var br = 3.8 + (bi % 3) * 1.4;
        var bg = new T3.Group();
        var ball = new T3.Mesh(new T3.SphereGeometry(0.68, 14, 12), new T3.MeshStandardMaterial({ color: bCols[bi % 5], roughness: 0.25 }));
        ball.scale.set(0.92, 1.12, 0.92);
        var str = new T3.Mesh(new T3.CylinderGeometry(0.02, 0.02, 2.2, 4), new T3.MeshBasicMaterial({ color: 0xffffff }));
        str.position.y = -1.6;
        bg.add(ball, str);
        bg.position.set(amp.x + Math.cos(ba) * br, stageY + 3.2 + (bi % 4) * 1.3, amp.z + Math.sin(ba) * br);
        grp.add(bg);
        balloons.push({ g: bg, y0: bg.position.y, ph: bi * 0.9 });
      }

      // Birthday pupil standing beside the cake
      var team = K.TEAMS[(chosen.team || 0) % 4] || K.TEAMS[0];
      K.makeCharacter(team, { kidsOnly: true, kidHeight: 2.45 }).then(function (ch) {
        if (!open) return;
        ch.root.position.set(amp.x + 2.8, stageY, amp.z + 1.2);
        ch.root.rotation.y = -0.3;
        ch.setState('cheer');
        grp.add(ch.root);
        bdayCh = ch;
      });

      // Monsters dance & cheer!
      HOST.mons.forEach(function (m) { if (m) m.setState('hop'); });

      K.cam.follow = null;
      K.cam.set(new T3.Vector3(amp.x + 8.5, stageY + 8.5, amp.z + 16.5), new T3.Vector3(amp.x + 0.8, stageY + 2.0, amp.z), 3.0);
      if (K.fx && K.fx.confetti) K.fx.confetti(new T3.Vector3(amp.x, stageY + 5, amp.z), 180);
      AUDIO.birthdayMelody();
      B.showBannerText('🎂 Happy Birthday, ' + chosen.name + '!', '#ff5fa2');
      if (K.say) K.say('Happy Birthday, ' + chosen.name + '!');
      confettiT = 2.2;
    }

    function openTool() {
      B.closeOtherTools('birthday');
      activeToolId = 'birthday';
      open = true;
      populateSelect();
      dock.classList.remove('hidden');
      var r = IT.getRoster();
      if (r && r[0]) celebrate(r[0].id);
    }

    function close() {
      open = false;
      grp.visible = false;
      dock.classList.add('hidden');
      B.hideBanner();
      bdayCh = null;
      HOST.mons.forEach(function (m) { if (m) m.setState('idle'); });
      if (HOST.home) HOST.home();
    }

    function update(dt, t) {
      if (!open) return;
      if (bdayCh) bdayCh.update(dt);
      balloons.forEach(function (b) {
        b.g.position.y = b.y0 + Math.sin(t * 1.8 + b.ph) * 0.75;
        b.g.rotation.z = Math.sin(t * 1.3 + b.ph) * 0.1;
      });
      flames.forEach(function (f) {
        var s = 0.85 + Math.sin(t * 18 + f.ph) * 0.2;
        f.mesh.scale.set(0.8 * s, 1.45 * s, 0.8 * s);
      });
      confettiT -= dt;
      if (confettiT <= 0) {
        confettiT = 2.8;
        var amp = B.getAMP();
        if (K.fx && K.fx.confetti) K.fx.confetti(new T3.Vector3(amp.x, amp.y + 6.5, amp.z), 70);
      }
    }

    return { build: build, open: openTool, close: close, celebrate: celebrate, update: update };
  })();

  // =========================================================================
  // INITIALIZE ALL 8 GO TOOLS & REGISTER INTO 🧰 TRAY
  // =========================================================================
  function initPack() {
    IT = window.IslandTools;
    B = IT && IT._bridge;
    if (!B) return;
    HOST = B.getHost();
    K = HOST.K; T3 = HOST.T3; scene = HOST.scene;

    FreezeTool.build();
    SunTimerTool.build();
    GroupMakerTool.build();
    LineUpTool.build();
    DiceSpinnerTool.build();
    PrizeDropTool.build();
    TwoStarsTool.build();
    BirthdayTool.build();

    // Register into the 🧰 Tools tray in exact plan order
    B.addTrayButton('itToolFreeze',   '❄️ Freeze!',                'F', function () { FreezeTool.toggle(); });
    B.addTrayButton('itToolTimer',    '⏱️ Sun Timer',              '',  function () { SunTimerTool.open(); });
    B.addTrayButton('itToolGroups',   '👫 Group Maker',            '',  function () { GroupMakerTool.open(); });
    B.addTrayButton('itToolLineup',   '🚶 Line-up',                '',  function () { LineUpTool.open(); });
    B.addTrayButton('itToolDice',     '🎲 Dice & Spinner',         '',  function () { DiceSpinnerTool.open(); });
    B.addTrayButton('itToolPrize',    '🎁 Prize Drop',             '',  function () { PrizeDropTool.open(); });
    B.addTrayButton('itToolStars',    '⭐ Two Stars of the Week',  '',  function () { TwoStarsTool.open(); });
    B.addTrayButton('itToolBirthday', '🎂 Birthday Party',         '',  function () { BirthdayTool.open(); });

    B.registerCloser(function (exceptId) {
      if (exceptId !== 'timer') SunTimerTool.close();
      if (exceptId !== 'groups') GroupMakerTool.close();
      if (exceptId !== 'lineup') LineUpTool.close();
      if (exceptId !== 'dice') DiceSpinnerTool.close();
      if (exceptId !== 'prize') PrizeDropTool.close();
      if (exceptId !== 'stars') TwoStarsTool.close();
      if (exceptId !== 'birthday') BirthdayTool.close();
    });

    // Expose public sub-APIs on window.IslandTools
    IT.freeze = FreezeTool;
    IT.timer = SunTimerTool;
    IT.groups = GroupMakerTool;
    IT.lineup = LineUpTool;
    IT.dice = DiceSpinnerTool;
    IT.prize = PrizeDropTool;
    IT.stars = TwoStarsTool;
    IT.birthday = BirthdayTool;

    K.onFrame(function (dt, t) {
      var stepDt = Math.min(dt, 0.05);
      SunTimerTool.update(stepDt, t);
      GroupMakerTool.update(stepDt, t);
      LineUpTool.update(stepDt, t);
      DiceSpinnerTool.update(stepDt, t);
      PrizeDropTool.update(stepDt, t);
      TwoStarsTool.update(stepDt, t);
      BirthdayTool.update(stepDt, t);
    });
  }

  if (window.IslandTools && window.IslandTools._ready) initPack();
  else window.addEventListener('islandtools:ready', initPack, { once: true });
})();
