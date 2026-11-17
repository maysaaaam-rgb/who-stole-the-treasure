/* Penalty Shootout 3D — English Adventure Academy
   Plays on the Football Pitch in Adventure Park (games/world).
   Right answer: pick a spot in the goal, your player runs up and SCORES.
   Wrong answer: the shot goes anyway, and the goalkeeper makes a big save (or it hits the post / flies over).
   Options: ?teams=2..4  ?kicks=1..6 (per team)  ?set=<id>  ?noworld  ?demo=1  ?capture=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, lerp = K.lerp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 44, fogNear: 90, fogFar: 260 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var KICKS = clamp(+K.Q.get('kicks') || 3, 1, 6);
  var TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) { return Object.assign({ score: 0, kicks: 0 }, t); });
  var QS = K.questions('g3-u5-vocab');

  /* pitch geometry (local metres): goal line at x = GX, shooting towards -X */
  var GX = -20, GW = 7.32, GH = 2.44, GD = 2.2, SPOT = GX + 11;
  var TARGETS = [[-2.6, 1.85], [0, 1.95], [2.6, 1.85], [-2.6, .55], [0, .5], [2.6, .55]];   // [z, y]

  /* ---------------- world ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x6fd07a);

  // pitch markings
  (function lines() {
    var m = new T3.MeshBasicMaterial({ color: 0xffffff });
    function line(x, z, w, d) { var l = new T3.Mesh(new T3.PlaneGeometry(w, d), m); l.rotation.x = -Math.PI / 2; l.position.set(x, .03, z); scene.add(l); }
    line(GX, 0, .12, 30);                         // goal line
    line(GX + 16.5 / 2, -10, 16.5, .12); line(GX + 16.5 / 2, 10, 16.5, .12); line(GX + 16.5, 0, .12, 20.12);   // penalty box
    line(GX + 2.75, -4.6, 5.5, .12); line(GX + 2.75, 4.6, 5.5, .12); line(GX + 5.5, 0, .12, 9.32);          // goal box
    var spot = new T3.Mesh(new T3.CircleGeometry(.14, 20), m); spot.rotation.x = -Math.PI / 2; spot.position.set(SPOT, .031, 0); scene.add(spot);
    var arc = new T3.Mesh(new T3.RingGeometry(9.1, 9.22, 48, 1, -Math.PI * .29, Math.PI * .58), m); arc.rotation.x = -Math.PI / 2; arc.position.set(SPOT, .03, 0); scene.add(arc);
    line(5, 0, .12, 30);                          // halfway line
    if (!IN_WORLD) { var stripes = [-15, -5, 5]; stripes.forEach(function (x) { var s = new T3.Mesh(new T3.PlaneGeometry(5, 30), K.mat(0x67c672)); s.rotation.x = -Math.PI / 2; s.position.set(x, .01, 0); scene.add(s); }); }
  })();

  /* ---------------- goal with a springy net ---------------- */
  var net = { A: 0, V: 0, y: 1, z: 0 };
  (function buildGoal() {
    var g = new T3.Group(); g.position.set(GX, 0, 0); scene.add(g);
    var white = K.mat(0xffffff);
    [-GW / 2, GW / 2].forEach(function (z) { var p = new T3.Mesh(new T3.CylinderGeometry(.07, .07, GH, 14), white); p.position.set(0, GH / 2, z); p.castShadow = true; g.add(p); });
    var bar = new T3.Mesh(new T3.CylinderGeometry(.07, .07, GW + .14, 14), white); bar.rotation.x = Math.PI / 2; bar.position.y = GH; bar.castShadow = true; g.add(bar);
    // back frame
    [-GW / 2, GW / 2].forEach(function (z) {
      var b = new T3.Mesh(new T3.CylinderGeometry(.03, .03, Math.hypot(GD, GH), 8), K.mat(0xdddddd)); b.position.set(-GD / 2, GH / 2, z); b.rotation.z = -Math.atan2(GD, GH); g.add(b);
      var gb = new T3.Mesh(new T3.CylinderGeometry(.03, .03, GD, 8), K.mat(0xdddddd)); gb.rotation.z = Math.PI / 2; gb.position.set(-GD / 2, .03, z); g.add(gb);
    });
    var tex = K.canvasTex(256, 256, function (c, w) { c.clearRect(0, 0, w, w); c.strokeStyle = '#ffffff'; c.lineWidth = 5; for (var i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, 256); c.stroke(); c.beginPath(); c.moveTo(0, i * 32); c.lineTo(256, i * 32); c.stroke(); } });
    tex.wrapS = tex.wrapT = T3.RepeatWrapping;
    function netMat(rx, ry) { var t = tex.clone(); t.needsUpdate = true; t.repeat.set(rx, ry); return new T3.MeshLambertMaterial({ map: t, transparent: true, alphaTest: .4, side: T3.DoubleSide }); }
    // back net (sloping) – deformable
    var backGeo = new T3.PlaneGeometry(GW, Math.hypot(GD, GH), 30, 12);
    var back = new T3.Mesh(backGeo, netMat(GW / .6, Math.hypot(GD, GH) / .6));
    back.position.set(-GD / 2, GH / 2, 0); back.rotation.set(0, Math.PI / 2, 0); back.rotateX(-Math.atan2(GD, GH)); g.add(back);
    net.mesh = back; net.base = backGeo.attributes.position.array.slice();
    // side nets
    [-1, 1].forEach(function (s) {
      var sh = new T3.Shape(); sh.moveTo(0, 0); sh.lineTo(-GD, 0); sh.lineTo(0, GH); sh.lineTo(0, 0);
      var side = new T3.Mesh(new T3.ShapeGeometry(sh), netMat(GD / .6, GH / .6));
      side.position.z = s * GW / 2; g.add(side);
    });
    var roof = new T3.Mesh(new T3.PlaneGeometry(.01, GW), netMat(1, GW / .6)); roof.visible = false; g.add(roof);
  })();
  K.onFrame(function (dt, t) {
    net.V += (-55 * net.A - 5 * net.V) * dt; net.A += net.V * dt;
    var p = net.mesh.geometry.attributes.position, b = net.base, H = Math.hypot(GD, GH), sig2 = 2 * 1.1 * 1.1;
    for (var i = 0; i < p.count; i++) {
      var x = b[i * 3], y = b[i * 3 + 1];   // x along goal width (world -z..), y along slope
      var wy = (y + H / 2) / H * GH;         // approx height
      var d2 = (x + net.z) * (x + net.z) + (wy - net.y) * (wy - net.y);
      var edge = Math.min(1, (GW / 2 - Math.abs(x)) / .8) * Math.min(1, (H / 2 - Math.abs(y)) / .5);
      p.array[i * 3 + 2] = -net.A * Math.exp(-d2 / sig2) * Math.max(0, edge) + Math.sin(t * 2 + x) * .015;
    }
    p.needsUpdate = true;
  });

  /* target circles in the goal mouth */
  var targets = TARGETS.map(function (tz, i) {
    var g = new T3.Group();
    var ring = new T3.Mesh(new T3.RingGeometry(.42, .55, 32), new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .95, side: T3.DoubleSide, depthTest: false }));
    var fill = new T3.Mesh(new T3.CircleGeometry(.42, 32), new T3.MeshBasicMaterial({ color: 0xffd84a, transparent: true, opacity: .35, side: T3.DoubleSide, depthTest: false }));
    var num = K.canvasTex(128, 128, function (c) { c.font = '900 84px Trebuchet MS'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 10; c.strokeStyle = '#2b1d40'; c.strokeText(i + 1, 64, 70); c.fillStyle = '#fff'; c.fillText(i + 1, 64, 70); });
    var lab = new T3.Mesh(new T3.PlaneGeometry(.5, .5), new T3.MeshBasicMaterial({ map: num, transparent: true, depthTest: false }));
    [ring, fill, lab].forEach(function (m) { m.renderOrder = 8; g.add(m); });
    g.rotation.y = Math.PI / 2; g.position.set(GX + .05, tz[1], -tz[0]);
    g.visible = false; scene.add(g);
    g.userData = { i: i, fill: fill }; return g;
  });
  K.onFrame(function (dt, t) { targets.forEach(function (g, i) { if (g.visible) { var s = 1 + .08 * Math.sin(t * 5 + i); g.scale.setScalar(s * (g.userData.hot ? 1.25 : 1)); g.userData.fill.material.opacity = g.userData.hot ? .8 : .35; } }); });

  /* ---------------- scoreboard screen (on the world's scoreboard) ---------------- */
  var board = null;
  function boardDraw() {
    if (!board) return;
    var c = board.ctx, w = 512, h = 232;
    c.fillStyle = '#2b1d40'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#ffd84a'; c.font = '900 34px Trebuchet MS'; c.textAlign = 'center'; c.fillText('⚽ PENALTIES', w / 2, 40);
    TEAMS.forEach(function (t, i) {
      var x = (i + .5) * w / TEAMS.length;
      c.fillStyle = t.c; c.font = '900 26px Trebuchet MS'; c.fillText(t.name, x, 100);
      c.fillStyle = '#fff'; c.font = '900 64px Trebuchet MS'; c.fillText(t.score, x, 170);
      c.fillStyle = 'rgba(255,255,255,.6)'; c.font = '700 20px Trebuchet MS'; c.fillText(t.kicks + '/' + KICKS, x, 205);
    });
    board.tex.needsUpdate = true;
  }
  function makeBoard(pos) {
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 232;
    board = { ctx: cv.getContext('2d'), tex: new T3.CanvasTexture(cv) }; board.tex.colorSpace = T3.SRGBColorSpace;
    var m = new T3.Mesh(new T3.PlaneGeometry(4.4, 2), new T3.MeshBasicMaterial({ map: board.tex }));
    m.position.copy(pos); scene.add(m); boardDraw();
  }

  /* ---------------- crowd on the stands ---------------- */
  var crowd = [], crowdHype = 0;
  function fillStands(stands) {
    var bodyG = new T3.CapsuleGeometry(.2, .3, 4, 8), headG = new T3.SphereGeometry(.17, 12, 8);
    var cols = [0xff8fb8, 0x8fc3ff, 0xffd166, 0x7ee0b0, 0xc3a6ff, 0xff9f68, 0xf5f5f5], skin = [0xffd9b8, 0xf1c39b, 0xc98d63, 0x8d5a3b];
    var spots = [];
    stands.forEach(function (s) {
      for (var r = 0; r < 4; r++) for (var i = 0; i < 10; i++) {
        if (Math.random() < .15) continue;
        spots.push({ x: s.x - 3.6 + i * .8 + rnd(-.1, .1), y: .55 * (r + 1) + .32, z: s.z + (s.r === 180 ? -1 : 1) * (1.5 - r), ph: rnd(0, 6), sp: rnd(5, 9) });
      }
    });
    var body = new T3.InstancedMesh(bodyG, new T3.MeshLambertMaterial(), spots.length), head = new T3.InstancedMesh(headG, new T3.MeshLambertMaterial(), spots.length);
    var c = new T3.Color();
    spots.forEach(function (s, i) { body.setColorAt(i, c.setHex(cols[i % cols.length])); head.setColorAt(i, c.setHex(skin[(Math.random() * skin.length) | 0])); });
    body.castShadow = true; scene.add(body); scene.add(head);
    var m4 = new T3.Matrix4();
    K.onFrame(function (dt, t) {
      crowdHype = Math.max(.1, crowdHype - dt * .25);
      spots.forEach(function (s, i) {
        var j = Math.max(0, Math.sin(t * s.sp * (.5 + crowdHype * .7) + s.ph)) * (.03 + crowdHype * .3);
        m4.makeTranslation(s.x, s.y + j, s.z); body.setMatrixAt(i, m4);
        m4.makeTranslation(s.x, s.y + j + .42, s.z); head.setMatrixAt(i, m4);
      });
      body.instanceMatrix.needsUpdate = true; head.instanceMatrix.needsUpdate = true;
    });
  }

  /* ---------------- ball ---------------- */
  var ball = new T3.Group(); scene.add(ball);
  (function makeBall() {
    var tex = K.canvasTex(256, 128, function (c, w, h) {
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2b1d40';
      for (var i = 0; i < 10; i++) { var x = (i % 5) * 52 + (i < 5 ? 10 : 36), y = i < 5 ? 34 : 92; c.beginPath(); for (var k = 0; k < 5; k++) { var a = k / 5 * Math.PI * 2 - Math.PI / 2; c.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14); } c.fill(); }
    });
    var m = new T3.Mesh(new T3.SphereGeometry(.11, 24, 16), new T3.MeshLambertMaterial({ map: tex })); m.castShadow = true; ball.add(m); ball.userData.mesh = m;
  })();
  K.tryGLB(K.ROOT + 'assets/3d/items/soccer-ball.glb').then(function (g) {
    if (!g) return; ball.remove(ball.userData.mesh);
    var m = K.fitModel(g.scene, .22); m.position.y -= .11; ball.add(m); ball.userData.mesh = m;
  });
  function resetBall() { ball.position.set(SPOT, .11, 0); ball.rotation.set(0, 0, 0); ballFly = null; ballPhys = null; }

  var ballFly = null, ballPhys = null;
  K.onFrame(function (dt) {
    if (ballFly) {
      ballFly.t += dt; var u = clamp(ballFly.t / ballFly.dur, 0, 1);
      var p = ballFly.from.clone().lerp(ballFly.to, u);
      p.y += Math.sin(u * Math.PI) * ballFly.arc; p.z += Math.sin(u * Math.PI) * ballFly.curve;
      ball.position.copy(p); ball.rotation.z += dt * 18; ball.rotation.x += dt * 9;
      if (Math.random() < .6) K.fx.puff(p.clone(), 1, { color: 0xffffff, size: .25, life: .35, opacity: .5 });
      if (u >= 1) { var f = ballFly.done; ballFly = null; if (f) f(); }
    }
    if (ballPhys) {   // simple bounce + roll
      var b = ballPhys; b.v.y -= 12 * dt; b.v.multiplyScalar(1 - .6 * dt);
      ball.position.addScaledVector(b.v, dt);
      if (ball.position.y < .11) { ball.position.y = .11; if (Math.abs(b.v.y) > 1) { b.v.y = -b.v.y * .5; K.sfx('thud', .4); } else b.v.y = 0; b.v.x *= .9; b.v.z *= .9; }
      if (b.inGoal) { ball.position.x = Math.max(GX - GD + .15, Math.min(GX - .15, ball.position.x)); ball.position.z = clamp(ball.position.z, -GW / 2 + .15, GW / 2 - .15); }
      ball.rotation.z -= b.v.x * dt * 8;
    }
  });

  /* ---------------- characters ---------------- */
  var chars = [], keeper = null;
  function lineupSpot(i) { return V(-2 + i * 1.7, 0, 8.5); }
  function holderize(ch, pos) {
    var h = new T3.Group(); h.add(ch.root); scene.add(h); ch.holder = h; h.position.copy(pos); return h;
  }
  K.onFrame(function (dt) {
    var showLabels = /title|turn|question|end/.test(phase);
    chars.forEach(function (c) { c.update(dt); if (c.label) c.label.visible = showLabels; });
    if (keeper) { keeper.update(dt); if (keeper.label) keeper.label.visible = showLabels; }
  });

  /* ---------------- camera ---------------- */
  function fov(f) { if (K.camera.fov !== f) { K.camera.fov = f; K.camera.updateProjectionMatrix(); } }
  function shot(name, extra) {
    K.cam.follow = null; fov(/aim|ball|run/.test(name) ? 30 : 44);
    if (name === 'title') { K.cam.follow = function () { var a = K.now * .1; K.cam.tPos.set(SPOT + 10 + Math.sin(a) * 3, 3.5, 9 + Math.cos(a) * 2); K.cam.tLook.set(GX + 3, 1.2, 0); }; K.cam.k = 1.5; }
    if (name === 'lineup') K.cam.set(V(1.5, 2.6, 15.5), V(.5, .4, 7), 2.5);
    if (name === 'aim') { fov(34); K.cam.set(V(SPOT + 6.5, 2.5, -.6), V(GX, .25, 0), 2.5); }
    if (name === 'run') K.cam.set(V(SPOT + 5.5, 1.8, 2.2), V(GX, 1.0, 0), 3);
    if (name === 'ball') { K.cam.k = 4; K.cam.follow = function () { var p = ball.position; K.cam.tPos.set(Math.max(GX + 6, p.x + 5), 1.7, p.z * .4 + 1.2); K.cam.tLook.set(GX, 1.1, p.z * .5); }; }
    if (name === 'goalcam') K.cam.set(V(GX + 6, 1.6, 5.5), V(GX - .6, 1.1, extra || 0), 3);
    if (name === 'celebrate') { K.cam.follow = function () { var c = extra.holder.position; K.cam.tPos.set(c.x + 3, 1.8, c.z + 3); K.cam.tLook.set(c.x, 1, c.z); }; K.cam.k = 2.5; }
    if (name === 'podium') { K.cam.follow = function () { var a = Math.sin(K.now * .3) * .5; K.cam.tPos.set(SPOT + 2.2 + a * 1.5, 1.9, 4.6); K.cam.tLook.set(SPOT - 1.4, 1.0, 0); }; K.cam.k = 2; }
  }

  /* ---------------- flow ---------------- */
  var hud, active = 0, round = 1, phase = 'loading', demoTurn = 0, DEMO_WRONG = [2, 6];
  function title() {
    phase = 'title'; shot('title'); K.cam.snap();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML = '<img class="logo" src="art/logo.png" alt="" onerror="this.remove()"><div class="say" style="--c:#2fc58a;font-size:1.6rem">⚽ Penalty Shootout — answer right, then SHOOT!</div>';
    var rows = K.el('div', 'rows'), go = K.el('button', 'btn green', '▶ Kick off');
    go.onclick = function () { K.audio(); K.loadSounds(['hello', 'correct', 'wrong', 'whistle', 'kick', 'goal', 'save', 'post', 'boo', 'win', 'whoosh', 'thud']); start(); };
    rows.appendChild(go); box.appendChild(rows); K.ui.topButtons();
    chars.forEach(function (c, i) { K.after(.4 + i * .45, function () { if (phase === 'title') { c.setState('hello'); K.after(1.3, function () { if (phase === 'title') c.setState('idle'); }); } }); });
    if (K.DEMO) K.after(2.2, function () { go.onclick(); });
  }
  function start() {
    K.ui.clear(); K.ui.topButtons();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' ⚽'; }); hud.refresh(-1);
    phase = 'intro'; K.sfx('whistle'); K.sfx('whoosh');
    K.cam.set(V(GX + 16, 7, 14), V(GX, 1, 0), 1.2);
    K.after(2.4, function () { active = 0; turn(); });
  }
  function turn() {
    phase = 'turn'; hud.refresh(active); boardDraw();
    var ch = chars[active], team = TEAMS[active];
    keeper.setState('keeper');
    shot('lineup'); ch.setState('hello'); K.sfx('hello');
    K.ui.toast('Round ' + round + ' of ' + KICKS + ' · Team ' + team.name, 1.8, team.c);
    K.after(1.1, function () {
      ch.setState('idle'); phase = 'question'; demoTurn++;
      K.ui.ask(QS.next(), team, { prompt: 'answer right to take the kick!', demoRight: DEMO_WRONG.indexOf(demoTurn) < 0, onAnswer: function (ok) {
        if (!ok) return noKick(ch, team);
        walkToBall(ch, function () { aim(ch, team); });
      } });
    });
  }
  /* wrong answer: no kick at all, the turn passes on */
  function noKick(ch, team) {
    phase = 'oops'; team.kicks++; boardDraw();
    ch.setState('headhands'); keeper.setState('cheer'); K.sfx('boo');
    K.ui.big('No kick!', 1.4, true);
    K.ui.toast('Wrong answer — Team ' + team.name + ' loses this kick', 2.2, team.c);
    K.after(2.4, next);
  }
  function walkToBall(ch, done) {
    phase = 'walk';
    var from = ch.holder.position.clone(), to = V(SPOT + 2.6, 0, .9), t = 0, dur = 1.1;
    ch.setState('run'); ch.speed = 3;
    var fn = K.onFrame(function (dt) {
      t += dt; var u = clamp(t / dur, 0, 1);
      ch.holder.position.lerpVectors(from, to, K.ease(u));
      var d = to.clone().sub(from); ch.root.rotation.y = Math.atan2(d.x, d.z);
      if (u >= 1) { K.offFrame(fn); ch.setState('idle'); ch.root.rotation.y = -Math.PI / 2 - .3; done(); }
    });
    shot('run');
  }

  /* ---- aiming: pull back and let go. Direction = where it goes, length = power ---- */
  var aimArrow = (function () {
    var g = new T3.Group(), m = new T3.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9, depthTest: false });
    var shaft = new T3.Mesh(new T3.BoxGeometry(1, .03, .16), m); shaft.position.x = -.5; g.add(shaft);
    var head = new T3.Mesh(new T3.ConeGeometry(.22, .45, 3), m); head.rotation.z = Math.PI / 2; head.rotation.x = Math.PI / 2; g.add(head);
    g.children.forEach(function (c) { c.renderOrder = 9; });
    g.visible = false; scene.add(g); g.userData.m = m; return g;
  })();
  var reticle = (function () {
    var g = new T3.Group();
    var ring = new T3.Mesh(new T3.RingGeometry(.28, .38, 32), new T3.MeshBasicMaterial({ color: 0xffffff, side: T3.DoubleSide, depthTest: false }));
    var dot = new T3.Mesh(new T3.CircleGeometry(.08, 16), new T3.MeshBasicMaterial({ color: 0xffffff, side: T3.DoubleSide, depthTest: false }));
    ring.renderOrder = dot.renderOrder = 9; g.add(ring); g.add(dot); g.rotation.y = Math.PI / 2; g.visible = false; scene.add(g);
    g.userData.ring = ring; return g;
  })();
  var SOFT = .35, STRONG = .86;
  function shotFrom(angle, power) {   // where the ball is going, before the keeper
    var z = -(angle / (Math.PI / 4)) * 4.4;
    var y = .25 + power * 1.75 + Math.max(0, power - STRONG) * 14;
    return { z: z, y: y, power: power };
  }
  function zoneColor(p) { return p < SOFT ? 0x8fc3ff : p <= STRONG ? 0x34c991 : 0xff5f5f; }
  function zoneText(p) { return p < SOFT ? 'Too soft' : p <= STRONG ? 'Good power!' : 'Too strong!'; }
  function showAim(angle, power) {
    var s = shotFrom(angle, power), col = zoneColor(power);
    aimArrow.visible = true; aimArrow.position.set(SPOT - .2, .06, 0);
    aimArrow.rotation.y = Math.atan2(-s.z, GX - SPOT);
    aimArrow.scale.set(.6 + power * 3.2, 1, 1); aimArrow.userData.m.color.setHex(col);
    reticle.visible = true; reticle.position.set(GX + .06, Math.min(s.y, GH + .9), s.z); reticle.userData.ring.material.color.setHex(col);
    if (meter) { meter.fill.style.height = (power * 100) + '%'; meter.fill.style.background = '#' + col.toString(16).padStart(6, '0'); meter.lab.textContent = zoneText(power); }
  }
  function hideAim() { aimArrow.visible = false; reticle.visible = false; if (meter) { meter.el.remove(); meter = null; } }
  var meter = null;
  function makeMeter(team) {
    var el = K.ui.add(K.el('div', 'powermeter'));
    el.innerHTML = '<div class="pm-bar"><div class="pm-zone"></div><div class="pm-fill"></div></div><div class="pm-lab">Power</div>';
    el.style.setProperty('--c', team.c);
    meter = { el: el, fill: el.querySelector('.pm-fill'), lab: el.querySelector('.pm-lab') };
  }
  function aim(ch, team) {
    phase = 'aim'; shot('aim'); makeMeter(team);
    var hint = K.ui.add(K.el('div', 'hint', '👆 Pull back · aim · let go to SHOOT!')); hint.style.setProperty('--c', team.c); hint.style.top = '84px'; hint.style.bottom = 'auto';
    var pad = K.ui.add(K.el('div', 'aimpad')); pad.style.cssText = 'position:fixed;inset:0;touch-action:none;cursor:grab';
    var start = null, angle = 0, power = 0, done = false;
    function upd(e) {
      var px = start.x - e.clientX, py = start.y - e.clientY, s = Math.min(innerWidth, innerHeight);
      var len = Math.hypot(px, py); if (len < 6) return;
      // pulling down = shooting forward; pulling left = shooting to the right of the screen
      angle = clamp(Math.atan2(px, -py), -Math.PI / 3, Math.PI / 3);
      power = clamp(len / (s * .42), 0, 1);
      showAim(angle, power);
    }
    pad.addEventListener('pointerdown', function (e) { start = { x: e.clientX, y: e.clientY }; pad.setPointerCapture(e.pointerId); });
    pad.addEventListener('pointermove', function (e) { if (start) upd(e); });
    pad.addEventListener('pointerup', function (e) { if (!start) return; upd(e); start = null; if (power > .1) fire(); });
    function key(e) {
      if (e.key === 'ArrowLeft') angle = clamp(angle + .05, -Math.PI / 3, Math.PI / 3);
      if (e.key === 'ArrowRight') angle = clamp(angle - .05, -Math.PI / 3, Math.PI / 3);
      if (e.key === 'ArrowUp') power = clamp(power + .04, 0, 1);
      if (e.key === 'ArrowDown') power = clamp(power - .04, 0, 1);
      showAim(angle, power);
      if ((e.key === ' ' || e.key === 'Enter') && power > .1) { e.preventDefault(); fire(); }
    }
    addEventListener('keydown', key);
    function fire() {
      if (done) return; done = true;
      removeEventListener('keydown', key); pad.remove(); hint.remove();
      var s = shotFrom(angle, power);
      K.after(.25, function () { hideAim(); kick(ch, team, s); });
    }
    if (K.DEMO) {   // pretend a pupil pulls back
      var ta = rnd(-.75, .75), tp = Math.random() < .2 ? rnd(.88, .98) : Math.random() < .15 ? rnd(.15, .3) : rnd(.45, .8), t = 0;
      K.after(.9, function () {
        var fn = K.onFrame(function (dt) {
          t += dt; var u = clamp(t / 1.4, 0, 1), e = K.ease(u);
          angle = ta * e; power = tp * e; showAim(angle, power);
          if (u >= 1) { K.offFrame(fn); K.after(.4, fire); }
        });
      });
    }
  }

  /* decide what happens: skill first, then a fair duel with the keeper */
  function decide(s) {
    var az = Math.abs(s.z);
    if (s.y > GH + .12) return { outcome: 'over', target: V(GX - .6, s.y + .4, s.z) };
    if (az > GW / 2 + .12) return { outcome: 'wide', target: V(GX - .6, Math.max(.4, s.y), s.z) };
    if (az > GW / 2 - .16 || s.y > GH - .14) return { outcome: 'post', target: V(GX, Math.min(s.y, GH), clamp(s.z, -GW / 2, GW / 2)) };
    var target = V(GX - .2, s.y, s.z);
    if (s.power < SOFT) return { outcome: 'save', soft: true, target: target, keeperZ: s.z };
    // the keeper guesses left / middle / right
    var zone = s.z < -1.25 ? -1 : s.z > 1.25 ? 1 : 0;
    var r = Math.random(), guess = r < .36 ? -1 : r < .72 ? 1 : 0;
    var corner = az > 2.75;                      // tucked into the corner: unreachable
    var saved = guess === zone && !corner;
    return { outcome: saved ? 'save' : 'goal', target: target, keeperZ: saved ? s.z : guess * 2.4 };
  }

  function kick(ch, team, s) {
    phase = 'kick';
    var d = decide(s);
    var from = ch.holder.position.clone(), to = V(SPOT + .55, 0, .28), t = 0;
    ch.setState('run'); ch.speed = 5; shot('run');
    var fn = K.onFrame(function (dt) {
      t += dt; var u = clamp(t / .75, 0, 1);
      ch.holder.position.lerpVectors(from, to, u);
      if (u >= 1) { K.offFrame(fn); ch.setState('kick'); K.after(.24, function () { strike(ch, team, s, d); }); }
    });
  }
  function strike(ch, team, s, d) {
    K.sfx('kick'); K.cam.shake(.08 + s.power * .1);
    K.fx.puff(V(SPOT, .1, 0), 4 + Math.round(s.power * 6), { color: 0xe9f6d8, size: .5 });
    var dur = lerp(1.15, .5, s.power);
    // the keeper reacts: a soft shot gets a calm step across, otherwise a visible dive
    var diveDur = d.soft ? Math.max(.55, dur * .82) : Math.max(.55, dur * .9);
    K.after(d.soft ? .22 : .06, function () {
      keeperDive(d.keeperZ !== undefined ? d.keeperZ : rnd(-1.5, 1.5), d.outcome === 'save' ? d.target.y : rnd(.6, 1.5), diveDur, d.outcome === 'save' && !d.soft);
    });
    ballFly = { t: 0, dur: dur, from: ball.position.clone(), to: d.target, arc: d.outcome === 'over' ? 1.1 : .15 + (1 - s.power) * .5, curve: s.z * -.08, done: function () { arrive(ch, team, d); } };
    shot('ball');
    if (d.outcome === 'goal' || (d.outcome === 'save' && !d.soft)) { K.timeScale = .55; K.after(.45, function () { K.timeScale = 1; }); }
  }
  function keeperDive(z, y, dur, forceDive) {
    var h = keeper.holder, z0 = h.position.z, t = 0, side = Math.sign(z - z0) || 1, reach = Math.min(3.3, Math.abs(z - z0)), walk = !forceDive && dur > .75 && reach < 1.0;
    keeper.setState(walk ? 'keeper' : 'dive');
    var fn = K.onFrame(function (dt) {
      t += dt; var u = clamp(t / dur, 0, 1);
      if (walk) { h.position.z = z0 + side * reach * K.ease(u); h.position.y = Math.sin(u * Math.PI) * .25; if (u >= 1) K.offFrame(fn); return; }
      h.position.z = z0 + side * reach * K.ease(u);
      h.position.y = Math.sin(u * Math.PI) * Math.min(.85, Math.max(.45, y * .55)) + u * .2;
      h.rotation.x = side * u * (reach < .6 ? .35 : (y > 1.3 ? .95 : 1.25));
      if (u >= 1) K.offFrame(fn);
    });
  }
  function reaction(ch, good, after) {
    K.after(1.2, function () { keeper.holder.rotation.set(0, 0, 0); keeper.holder.position.y = 0; ch.setState(good ? 'cheer' : 'headhands'); keeper.setState(good ? 'sad' : 'cheer'); shot('celebrate', ch); });
    K.after(after, next);
  }
  function arrive(ch, team, d) {
    var o = d.outcome, target = d.target;
    if (o === 'goal') {
      net.y = target.y; net.z = target.z; net.V = 9;
      ballPhys = { v: V(-3, -1, 0), inGoal: true };
      team.score++; K.sfx('goal'); crowdHype = 1; K.cam.shake(.3);
      K.fx.confetti(V(GX - 1, 3, 0), 160); K.fx.ring(target.clone(), team.hex, 4);
      K.ui.big(Math.abs(target.z) > 2.75 ? 'TOP CORNER!' : 'GOAL!', 1.8, Math.abs(target.z) > 2.75);
      shot('goalcam', target.z); hud.refresh(active); hud.bump(active);
      reaction(ch, true, 4.0);
    } else if (o === 'save') {
      ballPhys = null; K.sfx('save'); K.cam.shake(.2);
      ball.position.copy(keeper.holder.position).add(V(.3, d.soft ? .9 : .5, 0));
      K.ui.big(d.soft ? 'Too soft — easy catch!' : 'SAVED!', 1.6, true); shot('goalcam', target.z);
      K.after(.9, function () { ballPhys = { v: V(4, 3, rnd(-1, 1)) }; });
      reaction(ch, false, 3.8);
    } else if (o === 'post') {
      K.sfx('post'); K.cam.shake(.25); K.fx.ring(target.clone(), 0xffffff, 3);
      ballPhys = { v: V(5, 2, -Math.sign(target.z || 1) * 2.5) };
      K.ui.big(target.y >= GH - .02 ? 'Off the bar!' : 'Off the post!', 1.4, true); shot('goalcam', 0);
      reaction(ch, false, 3.6);
    } else {
      ballPhys = { v: V(-6, o === 'over' ? 2 : 0, o === 'wide' ? Math.sign(target.z) * 2 : 0) }; K.sfx('boo');
      K.ui.big(o === 'over' ? 'Too strong — over the bar!' : 'Wide!', 1.6, true);
      reaction(ch, false, 3.4);
    }
    team.kicks++; boardDraw();
  }
  function next() {
    // everyone back in place
    var ch = chars[active];
    K.fx.puff(ch.holder.position.clone().setY(.3), 8, { size: .9 });
    ch.holder.position.copy(lineupSpot(active)); ch.root.rotation.set(0, -.3, 0); ch.setState('idle');
    keeperHome(); resetBall();
    active++;
    if (active >= TEAMS.length) { active = 0; round++; }
    if (round > KICKS) return finish();
    turn();
  }
  function keeperHome() { var h = keeper.holder; h.position.set(GX + .7, 0, 0); h.rotation.set(0, 0, 0); keeper.setState('keeper'); }

  function finish() {
    phase = 'end'; window.__k3phase = 'end'; hud.refresh(-1); boardDraw();
    var best = Math.max.apply(null, TEAMS.map(function (t) { return t.score; }));
    var winners = TEAMS.filter(function (t) { return t.score === best; });
    // winners in the middle, others clapping around
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) { return TEAMS[b].score - TEAMS[a].score; });
    order.forEach(function (ti, k) {
      var ch = chars[ti], win = TEAMS[ti].score === best;
      K.fx.puff(ch.holder.position.clone().setY(.3), 8, { size: 1 });
      ch.holder.position.set(0, 0, (k - (TEAMS.length - 1) / 2) * 1.7);
      ch.holder.position.x = SPOT - 1 + (win ? -1 : .6);
      ch.root.rotation.set(0, Math.PI / 2, 0); ch.setState(win ? 'cheer' : 'clap');
    });
    keeper.setState('clap'); keeperHome(); keeper.setState('clap');
    shot('podium'); K.sfx('win'); crowdHype = 1;
    K.fx.confetti(V(SPOT - 1.5, 4, 0), 220);
    var names = winners.map(function (t) { return t.name; }).join(' & ');
    K.ui.big(winners.length > 1 ? names + ' tie!' : names + ' wins!', 2.4, true);
    K.after(2.6, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      box.innerHTML = '<div class="say" style="--c:' + winners[0].c + '">🏆 ' + order.map(function (i) { return TEAMS[i].name + ' ' + TEAMS[i].score; }).join(' · ') + '</div>';
      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn', '↻ Play again'); again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Games'); back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again); rows.appendChild(back); box.appendChild(rows);
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Getting the pitch ready…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'penalty', skip: ['goal'] }).catch(function (e) { console.warn('world', e); K.world.ground(0x6fd07a); return null; }) : Promise.resolve(null);
  var keeperP = K.loadGLB(K.ROOT + 'assets/3d/characters/kid-boy.glb').then(function (g) { return new K.Kid(g, 1.62); });
  Promise.all([worldP, keeperP].concat(TEAMS.map(function (t) {
    return K.loadGLB(K.ROOT + 'assets/3d/characters/kid-' + (t.kid === 'girl' ? 'girl' : 'boy') + '.glb').then(function (g) { return new K.Kid(g, 1.45); });
  })))
    .then(function (res) {
      var W = res[0]; keeper = res[1];
      res.slice(2).forEach(function (ch, i) { chars.push(ch); holderize(ch, lineupSpot(i)); ch.root.rotation.y = -.3;
        var ring = new T3.Mesh(new T3.RingGeometry(.45, .6, 32), new T3.MeshBasicMaterial({ color: TEAMS[i].hex })); ring.rotation.x = -Math.PI / 2; ring.position.copy(lineupSpot(i)).setY(.035); scene.add(ring);
        var lab = K.label(TEAMS[i].name, TEAMS[i].c); lab.position.y = ch.height + .45; ch.holder.add(lab); ch.label = lab;
      });
      // goalkeeper: bright gloves + label
      holderize(keeper, V(GX + .7, 0, 0)); keeper.root.rotation.y = Math.PI / 2;
      ['LeftHand', 'RightHand'].forEach(function (n) {
        var b = null; keeper.root.traverse(function (o) { if (o.isBone && o.name.replace(/^mixamorig:?/, '') === n) b = o; });
        if (b) { var glove = new T3.Mesh(new T3.SphereGeometry(.09, 12, 8), K.mat(0xffd84a)); var s = 1 / b.getWorldScale(V(0, 0, 0)).x; glove.scale.setScalar(s); b.add(glove); }
      });
      var kl = K.label('Keeper', '#9b7bff', 200); kl.position.y = 2.1; keeper.holder.add(kl); keeper.label = kl;
      keeper.setState('keeper');
      // stands + scoreboard from the world map
      if (W && W.map) {
        var z = W.zone, stands = W.map.pieces.filter(function (p) { return p.p === 'bleachers'; }).map(function (p) { return { x: p.x - z.x, z: p.z - z.z, r: p.r }; });
        fillStands(stands);
        var sb = W.map.pieces.filter(function (p) { return p.p === 'scoreboard'; })[0];
        if (sb) makeBoard(V(sb.x - z.x, 3.6, sb.z - z.z + .2));
      } else makeBoard(V(0, 3.6, -14));
      resetBall();
      loading.remove(); title(); K.start();
    })
    .catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
