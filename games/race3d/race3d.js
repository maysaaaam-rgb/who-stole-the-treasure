/* Sprint Race 3D — English Adventure Academy
   Plays on the Sprint Track in Adventure Park (games/world).
   Built on kit3d + world3d, keeping fair turns, all sounds/art, crowd & confetti.
   Options: ?teams=2..4  ?steps=2..10  ?set=<id>  ?noworld  ?demo=1  ?capture=1  ?q=low */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, lerp = K.lerp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 44, fogNear: IN_WORLD ? 90 : 45, fogFar: IN_WORLD ? 260 : 120 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var STEPS = clamp(+K.Q.get('steps') || 6, 2, 10);
  var TRACK = 30;
  var STEP = TRACK / STEPS;
  var LANE = 1.7;
  var TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) { return Object.assign({ score: 0 }, t); });
  var QS = K.questions('g3-u5-vocab');

  function laneZ(i) { return (i - (nTeams - 1) / 2) * LANE; }

  /* ---------------- world ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -70, 90);
  if (!IN_WORLD) {
    K.world.ground(0x72cf7a);
    K.world.hills(-30, 70, -40, 10);
    for (var ti = 0; ti < 20; ti++) K.world.tree(rnd(-14, 48), ti % 2 ? rnd(-24, -13) : rnd(13, 24), rnd(.9, 1.5), ti % 5 === 0);
  }

  /* ---------------- running track ---------------- */
  var trackW = nTeams * LANE + 1.4;
  var trackMesh = new T3.Mesh(new T3.BoxGeometry(38, .12, trackW), K.mat(0xe06d53));
  trackMesh.position.set(14, .06, 0); trackMesh.receiveShadow = true; scene.add(trackMesh);
  // kerbs
  [-trackW / 2 - .15, trackW / 2 + .15].forEach(function (z) {
    var k = new T3.Mesh(new T3.BoxGeometry(38.2, .16, .28), K.mat(0xfff4e6));
    k.position.set(14, .08, z); k.receiveShadow = true; scene.add(k);
  });
  // lane lines + start/finish lines
  var lineMat = new T3.MeshBasicMaterial({ color: 0xffffff });
  for (var li = 0; li <= nTeams; li++) {
    var lz = (li - nTeams / 2) * LANE;
    var ln = new T3.Mesh(new T3.PlaneGeometry(36, .08), lineMat);
    ln.rotation.x = -Math.PI / 2; ln.position.set(14, .125, lz); scene.add(ln);
  }
  var startLine = new T3.Mesh(new T3.PlaneGeometry(.24, trackW - .6), lineMat);
  startLine.rotation.x = -Math.PI / 2; startLine.position.set(0, .126, 0); scene.add(startLine);

  // lane numbers
  for (var i = 0; i < nTeams; i++) {
    (function (idx) {
      var tex = K.canvasTex(128, 128, function (c) {
        c.fillStyle = TEAMS[idx].c; c.beginPath(); c.arc(64, 64, 56, 0, Math.PI * 2); c.fill();
        c.lineWidth = 8; c.strokeStyle = '#fff'; c.stroke();
        c.fillStyle = '#fff'; c.font = '900 72px Trebuchet MS'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(String(idx + 1), 64, 68);
      });
      var d = new T3.Mesh(new T3.PlaneGeometry(1.1, 1.1), new T3.MeshBasicMaterial({ map: tex, transparent: true }));
      d.rotation.x = -Math.PI / 2; d.position.set(-1.3, .127, laneZ(idx)); scene.add(d);
    })(i);
  }

  // checkered finish line
  (function finishStrip() {
    var tex = K.canvasTex(64, 256, function (c) {
      for (var r = 0; r < 16; r++) for (var q = 0; q < 2; q++) {
        c.fillStyle = (r + q) % 2 ? '#231f20' : '#ffffff';
        c.fillRect(q * 32, r * 16, 32, 16);
      }
    });
    var fin = new T3.Mesh(new T3.PlaneGeometry(1.0, trackW - .6), new T3.MeshBasicMaterial({ map: tex }));
    fin.rotation.x = -Math.PI / 2; fin.position.set(TRACK, .128, 0); scene.add(fin);
  })();

  /* ---------------- finish arch + snapping tape ---------------- */
  var tape, tapeHalves = [];
  (function buildArch() {
    var archZ = trackW / 2 + .55;
    [-archZ, archZ].forEach(function (z) {
      var p = new T3.Mesh(new T3.CylinderGeometry(.2, .24, 4.6, 16), K.mat(0xffffff));
      p.position.set(TRACK, 2.3, z); p.castShadow = true; scene.add(p);
      var ring = new T3.Mesh(new T3.TorusGeometry(.28, .08, 10, 20), K.mat(0xffd166));
      ring.rotation.x = Math.PI / 2; ring.position.set(TRACK, 1.15, z); scene.add(ring);
      [0xff5fa2, 0x4f9dff, 0xffb320].forEach(function (col, bi) {
        var b = new T3.Mesh(new T3.SphereGeometry(.32, 14, 12), K.mat(col));
        b.scale.y = 1.2;
        b.position.set(TRACK + (bi - 1) * .35, 4.7 + (bi === 1 ? .3 : 0), z + (z > 0 ? .2 : -.2));
        scene.add(b);
      });
    });
    var fbTex = K.canvasTex(512, 64, function (c) {
      c.fillStyle = '#fff4e6'; c.fillRect(0, 0, 512, 64);
      c.fillStyle = '#ff5fa2'; c.fillRect(0, 0, 512, 10); c.fillRect(0, 54, 512, 10);
      c.fillStyle = '#ff5fa2'; c.font = '900 40px Trebuchet MS'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('FINISH', 256, 33);
    });
    var bannerMat = new T3.MeshLambertMaterial({ map: fbTex });
    K.art('finish-banner.png', function (t) { bannerMat.map = t; bannerMat.needsUpdate = true; });
    var banner = new T3.Mesh(new T3.BoxGeometry(.35, 1.05, archZ * 2 + .5), bannerMat);
    banner.position.set(TRACK, 4.4, 0); banner.castShadow = true; scene.add(banner);

    var tMat = K.mat(0xff5fa2);
    tape = new T3.Mesh(new T3.BoxGeometry(.05, .14, archZ * 2 - .3), tMat);
    tape.position.set(TRACK, 1.15, 0); scene.add(tape);
    [-1, 1].forEach(function (side) {
      var h = new T3.Mesh(new T3.BoxGeometry(.05, .14, archZ - .15), tMat);
      h.position.set(TRACK, 1.15, side * (archZ / 2)); h.visible = false;
      h.userData = { s: side, t: 0 }; scene.add(h); tapeHalves.push(h);
    });
  })();

  /* ---------------- flags + cheer boards + crowd ---------------- */
  var flags = [], crowdSpecs = [];
  (function buildFlagsAndBoards() {
    var flagFiles = ['flag-pink.png', 'flag-blue.png', 'flag-yellow.png', 'flag-green.png'];
    [3, 11, 19, 27].forEach(function (x, i) {
      var t = TEAMS[i % TEAMS.length];
      var pole = new T3.Mesh(new T3.CylinderGeometry(.06, .08, 4.2, 10), K.mat(0xffffff));
      pole.position.set(x, 2.1, -trackW / 2 - 1.4); pole.castShadow = true; scene.add(pole);
      var fGeo = new T3.PlaneGeometry(1.5, .95, 10, 4); fGeo.translate(.75, 0, 0);
      var fMat = new T3.MeshLambertMaterial({ color: t.hex, side: T3.DoubleSide });
      K.art(flagFiles[i % flagFiles.length], function (tex) { fMat.map = tex; fMat.color.set(0xffffff); fMat.needsUpdate = true; });
      var fl = new T3.Mesh(fGeo, fMat);
      fl.position.set(x, 3.65, -trackW / 2 - 1.4); fl.userData.phase = i * 1.1; scene.add(fl); flags.push(fl);
    });
    var phrases = ['GO, GO, GO!', 'YOU CAN DO IT!', 'RUN FAST!', 'WELL DONE!'];
    [4, 12, 20, 28].forEach(function (x, i) {
      var tex = K.canvasTex(512, 128, function (c) {
        c.fillStyle = '#fffaf3'; c.fillRect(0, 0, 512, 128);
        c.strokeStyle = TEAMS[i % TEAMS.length].c; c.lineWidth = 10; c.strokeRect(8, 8, 496, 112);
        c.fillStyle = TEAMS[i % TEAMS.length].c; c.font = '900 54px Trebuchet MS'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(phrases[i], 256, 66);
      });
      var bMat = new T3.MeshLambertMaterial({ map: tex });
      K.art('board-' + (i + 1) + '.png', function (t) { bMat.map = t; bMat.needsUpdate = true; });
      var bd = new T3.Mesh(new T3.BoxGeometry(3.8, .95, .15), bMat);
      bd.position.set(x, .58, -trackW / 2 - 2.3); scene.add(bd);
    });
  })();

  function fillStands() {
    var standG = new T3.Group(); scene.add(standG);
    var cols = [0xff8fb8, 0x8fc3ff, 0xffd166, 0x7ee0b0, 0xc3a6ff, 0xfff4e6];
    for (var bx = 2; bx <= 26; bx += 8) {
      for (var r = 0; r < 3; r++) {
        var step = new T3.Mesh(new T3.BoxGeometry(7.2, .5 * (r + 1), .9), K.mat(r % 2 ? 0xd8ecff : 0xeaf4ff));
        step.position.set(bx + 2, .25 * (r + 1), -trackW / 2 - 4.2 - r * .95);
        step.receiveShadow = true; step.castShadow = true; standG.add(step);
        for (var k = -3; k <= 3; k++) {
          var sp = new T3.Group();
          sp.position.set(bx + 2 + k * .95, .5 * (r + 1) + .25, -trackW / 2 - 4.2 - r * .95);
          var c = cols[Math.abs(k + r + bx) % cols.length];
          var body = new T3.Mesh(new T3.CylinderGeometry(.18, .22, .55, 8), K.mat(c));
          var head = new T3.Mesh(new T3.SphereGeometry(.18, 8, 8), K.mat(0xffdfc4)); head.position.y = .42;
          sp.add(body); sp.add(head); sp.userData = { y0: sp.position.y, ph: rnd(0, 6.28) };
          standG.add(sp); crowdSpecs.push(sp);
        }
      }
    }
  }
  fillStands();

  /* ---------------- frame updates (flags, crowd, tape) ---------------- */
  var crowdHype = 0;
  K.onFrame(function (dt, t) {
    flags.forEach(function (fl) {
      var p = fl.geometry.attributes.position;
      for (var i = 0; i < p.count; i++) {
        var x = p.getX(i);
        p.setZ(i, Math.sin(t * 5 + x * 2.5 + fl.userData.phase) * .09 * (x / 1.5));
      }
      p.needsUpdate = true;
    });
    crowdSpecs.forEach(function (sp) {
      var amp = .03 + crowdHype * .16;
      sp.position.y = sp.userData.y0 + Math.abs(Math.sin(t * (3 + crowdHype * 5) + sp.userData.ph)) * amp;
    });
    tapeHalves.forEach(function (h) {
      if (!h.visible) return;
      h.userData.t += dt; var tt = h.userData.t;
      h.rotation.x = h.userData.s * Math.min(1.3, tt * 3);
      h.position.y = Math.max(.18, 1.15 - tt * tt * 1.5);
    });
  });

  /* ---------------- camera presets ---------------- */
  function camFor(mode, who) {
    if (mode === 'orbit') {
      var a = .5;
      K.cam.set(V(-3, 5.5, 11.5), V(6, 1.1, 0), true);
      var fn = K.onFrame(function (dt) {
        if (game.phase !== 'title') { K.offFrame(fn); return; }
        a += dt * .22;
        K.cam.set(V(Math.sin(a) * 11, 4.8, Math.cos(a) * 11), V(2, 1.0, 0), true);
      });
    } else if (mode === 'intro') {
      K.cam.set(V(TRACK + 3, 5.5, 9), V(TRACK - 4, 1.2, 0), true);
      K.after(.1, function () { K.cam.set(V(-4.5, 3.2, 6.2), V(4, 1.0, 0)); });
    } else if (mode === 'start') {
      K.cam.set(V(-4.2, 2.6, 5.4), V(3, 1.0, 0));
    } else if (mode === 'question') {
      var rx = who ? who.x : 0, rz = who ? who.z : 0;
      K.cam.set(V(rx - 4.2, 2.6, rz + 5.2), V(rx + 2.5, .9, rz));
    } else if (mode === 'follow' && who) {
      K.cam.set(V(who.x + 2, 2.8, who.z + 6.5), V(who.x + 3.5, 1.0, who.z));
    } else if (mode === 'stumble' && who) {
      K.cam.set(V(who.x + 1.8, 2.2, who.z + 4.8), V(who.x, .8, who.z));
    } else if (mode === 'finish' && who) {
      // Positioned clear of the arch posts so nothing blocks the winners
      K.cam.set(V(TRACK + 6.5, 2.8, 5.2), V(TRACK + .2, 1.1, 0));
    }
  }

  /* ---------------- runners ---------------- */
  var runners = [], activeIdx = 0, startOffset = 0, roundStep = 0;
  var game = { phase: 'loading', winner: -1 };
  var hud = null;

  function makeRunner(kid, team, i) {
    var holder = new T3.Group();
    holder.position.set(0, .12, laneZ(i));
    scene.add(holder);
    kid.root.rotation.y = Math.PI / 2;
    holder.add(kid.root);

    var ring = new T3.Mesh(new T3.RingGeometry(.45, .62, 32), new T3.MeshBasicMaterial({ color: team.hex }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = .02; holder.add(ring);

    var lab = K.label(team.name, team.c); lab.position.y = kid.height + .45; holder.add(lab);

    var r = {
      i: i, team: team, kid: kid, holder: holder, lab: lab,
      x: 0, z: laneZ(i), score: 0, finished: false,
      runDist: 0, speed: 0, onDone: null, onCross: null,
      setState: function (s) { kid.setState(s); },
      sprint: function (dist, cb) {
        r.runDist = dist; r.speed = 6.2; r.onDone = cb || null;
        kid.setState('run');
      }
    };
    K.onFrame(function (dt) {
      kid.update(dt);
      if (r.runDist > 0) {
        var step = Math.min(r.runDist, r.speed * dt);
        r.x += step; r.runDist -= step;
        holder.position.x = r.x;
        if (r.x >= TRACK && !r.finished && r.onCross) {
          var fn = r.onCross; r.onCross = null; fn();
        }
        if (r.runDist <= 0) {
          kid.setState(r.finished ? 'cheer' : 'idle');
          var done = r.onDone; r.onDone = null; if (done) done();
        }
      }
    });
    return r;
  }

  /* ---------------- game flow ---------------- */
  function titleScreen() {
    game.phase = 'title'; camFor('orbit');
    var box = K.ui.add(K.el('div', 'endbox'));
    var logoEl = K.el('img', 'logo'); logoEl.src = 'art/logo.png';
    logoEl.onerror = function () { logoEl.remove(); };
    box.appendChild(logoEl);
    box.appendChild(K.el('div', 'say', '🏃 Sprint Race 3D — answer to run!'));
    box.lastChild.style.setProperty('--c', '#9b7bff');
    var rows = K.el('div', 'rows');
    var go = K.el('button', 'btn green', '▶ Start race');
    go.onclick = function () {
      K.audio(); K.loadSounds(['countdown', 'go', 'correct', 'wrong', 'step', 'stumble', 'hello', 'whoosh', 'win']);
      K.cls.assign(TEAMS); box.remove(); startRace();
    };
    rows.appendChild(go); box.appendChild(rows);
    K.cls.setupRow(box, nTeams);
    K.ui.topButtons();
    runners.forEach(function (r, idx) {
      K.after(.6 + idx * .45, function () {
        if (game.phase !== 'title') return;
        r.setState('hello'); K.sfx('hello');
        K.after(1.5, function () { if (game.phase === 'title') r.setState('idle'); });
      });
    });
    if (K.DEMO) K.after(2.4, function () { go.onclick(); });
  }

  function startRace() {
    K.ui.clear();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + '/' + STEPS; });
    K.ui.topButtons();
    game.phase = 'intro'; camFor('intro'); K.sfx('whoosh');
    K.after(2.8, function () {
      camFor('start'); game.phase = 'ready';
      runners.forEach(function (r) { r.setState('ready'); });
      var n = 3;
      (function count() {
        if (n > 0) { K.ui.big(String(n), .8); K.sfx('countdown'); n--; K.after(.9, count); return; }
        K.ui.big('GO!', .9); K.sfx('go'); crowdHype = 1; K.cam.shake(.28);
        game.phase = 'go';
        runners.forEach(function (r) { r.finished = false; r.sprint(1.2 + Math.random() * .3); });
        startOffset = Math.floor(Math.random() * runners.length);
        roundStep = 0;
        K.after(2.2, function () { crowdHype = .15; activeIdx = startOffset; nextTurn(); });
      })();
    });
  }

  function nextTurn() {
    if (game.phase === 'end') return;
    game.phase = 'turn'; hud.refresh(activeIdx);
    var r = runners[activeIdx];
    camFor('question', r);
    r.setState('hello'); K.sfx('hello');
    K.after(1.0, function () { r.setState('idle'); askQuestion(r); });
  }

  function askQuestion(r) {
    game.phase = 'question';
    var item = QS.next();
    K.ui.ask(item, r.team, { prompt: 'answer to run!' }).then(function (ok) {
      if (ok) correct(r); else wrong(r);
    });
  }

  function advanceRound() {
    roundStep++;
    if (roundStep >= runners.length) {
      roundStep = 0;
      var winners = runners.filter(function (x) { return x.finished || x.score >= STEPS; });
      if (winners.length) { finish(winners); return; }
    }
    activeIdx = (startOffset + roundStep) % runners.length;
    if (runners[activeIdx].finished) return advanceRound();   // already over the line: skip to the next team
    nextTurn();
  }

  function correct(r) {
    game.phase = 'run'; r.score++; r.team.score = r.score;
    hud.refresh(activeIdx); hud.bump(activeIdx);
    camFor('follow', r); crowdHype = .7;
    K.ui.big('+1 RUN!', .8, true);
    r.onCross = function () {
      r.finished = true;
      if (tape.visible) {
        tape.visible = false; tapeHalves.forEach(function (h) { h.visible = true; h.userData.t = 0; });
        K.fx.confetti(V(TRACK, 3.5, 0), 120);
      }
      K.ui.big('🏁 ' + r.team.name + ' finished!', 1.0, true);
    };
    var stepHandle = K.onFrame(function (dt) {
      if (r.runDist <= 0) { K.offFrame(stepHandle); return; }
      if (Math.random() < dt * 7) K.fx.puff(V(r.x - .2, .18, r.z), 2);
      if (Math.random() < dt * 5) K.sfx('step');
    });
    r.sprint(STEP + .05, function () {
      if (game.phase === 'end') return;
      crowdHype = .15;
      K.after(.5, advanceRound);
    });
  }

  function wrong(r) {
    game.phase = 'oops'; camFor('stumble', r);
    r.setState('stumble'); K.sfx('stumble');
    K.fx.puff(V(r.x + .3, .2, r.z), 8, { color: 0xfff0e0 });
    var stars = K.dizzyStars(r.holder, r.kid.height + .1);
    K.ui.big('Oops!', .9, true);
    K.after(1.6, function () {
      stars.remove(); r.setState('sad');
      K.after(.8, function () { r.setState('idle'); advanceRound(); });
    });
  }

  function finish(winners) {
    var w = winners[0];
    game.phase = 'end'; game.winner = w.i;
    if (tape.visible) {
      tape.visible = false; tapeHalves.forEach(function (h) { h.visible = true; h.userData.t = 0; });
    }
    K.sfx('win'); crowdHype = 1; K.cam.shake(.35);
    K.fx.confetti(V(TRACK, 4, 0), 220);
    K.after(.9, function () { K.fx.confetti(V(TRACK + 1, 5, -1.5), 150); });
    K.after(1.0, function () {
      camFor('finish', w);
      runners.forEach(function (r) {
        r.setState(winners.indexOf(r) >= 0 ? 'cheer' : 'clap');
      });
      var names = winners.map(function (x) { return x.team.name; }).join(' & ');
      K.ui.big(winners.length > 1 ? names + ' tie!' : w.team.name + ' wins!', 2.4, true);
      hud.refresh(-1);
      K.after(2.6, function () {
        var box = K.ui.add(K.el('div', 'endbox'));
        var msg = winners.length > 1 ? '🏆 Tie! ' + names + ' share 1st place!' : '🏆 Team ' + w.team.name + ' won the race!';
        var say = K.el('div', 'say', msg); say.style.setProperty('--c', w.team.c);
        box.appendChild(say);
        var rows = K.el('div', 'rows');
        var again = K.el('button', 'btn', '↻ Race again'); again.onclick = function () { location.reload(); };
        var back = K.el('button', 'btn soft', '🏠 Games'); back.onclick = function () { location.href = '../index.html'; };
        rows.appendChild(again); rows.appendChild(back); box.appendChild(rows);
        K.cls.pointsPanel(box, TEAMS, { game: 'race3d', title: 'Sprint Race 3D' });
      });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Getting the track ready…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'race' }).catch(function (e) { console.warn('world', e); K.world.ground(0x72cf7a); return null; }) : Promise.resolve(null);
  Promise.all([worldP].concat(TEAMS.map(function (t) {
    return K.loadGLB(K.ROOT + 'assets/3d/characters/kid-' + (t.kid === 'girl' ? 'girl' : 'boy') + '.glb').then(function (g) { return new K.Kid(g, 1.45); });
  }))).then(function (res) {
    res.slice(1).forEach(function (kid, i) { runners.push(makeRunner(kid, TEAMS[i], i)); });
    loading.remove(); titleScreen(); K.start();
  }).catch(function (e) {
    loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>';
    console.error(e);
  });
})();
