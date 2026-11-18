/* Bowling 3D — English Adventure Academy
   Plays at the Bowling Green in Adventure Park (games/world, zone "bowl").
   One lane per team, side by side. Each turn: answer a question.
     right  → an arrow swings across the lane; a pupil taps to stop it and aim the ball
     wrong  → the ball still rolls, but wobbly and with a random aim (no team gets zero)
   Pins knocked down = points; a strike (all 10) gets +5. 3 rounds. Points go to the Class Board at the end.
   Options: ?teams=2..4  ?rounds=1..5  ?set=<id>  ?noworld  ?demo=1  ?capture=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 42, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4), ROUNDS = clamp(+K.Q.get('rounds') || 3, 1, 5);
  var TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) { return Object.assign({ score: 0, strikes: 0, rolls: [] }, t); });
  var QS = K.questions('g3-u5-vocab');

  /* ---------------- the bowling green: lanes, gutters, pin decks ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x8fdc7a);

  var LANE_W = 2.3, HALF = LANE_W / 2, GAP = 1.3, FOUL_Z = 7.5, HEAD_Z = -6.2, PIT_Z = -9.4;
  var BALL_R = .3, PIN_R = .16, PIN_H = .95;
  function laneX(i) { return (i - (nTeams - 1) / 2) * (LANE_W + GAP); }
  var woodTex = K.canvasTex(256, 1024, function (c, W, H) {   // light maple boards along the lane
    for (var b = 0; b < 8; b++) { var g = 205 + ((b * 37) % 25); c.fillStyle = 'rgb(' + (g + 25) + ',' + (g - 10) + ',' + (g - 70) + ')'; c.fillRect(b * W / 8, 0, W / 8, H); c.fillStyle = 'rgba(120,70,20,.15)'; c.fillRect(b * W / 8, 0, 2, H); }
    for (var k = 0; k < 60; k++) { c.fillStyle = 'rgba(150,90,30,.06)'; c.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 3, 30 + Math.random() * 80); }
  });
  var lanes = [];
  (function buildLanes() {
    var deck = new T3.Mesh(new T3.BoxGeometry(nTeams * (LANE_W + GAP) + 2, .3, 20), K.mat(0xd8c3a0)); deck.position.set(0, .1, -1); deck.receiveShadow = true; scene.add(deck);
    for (var i = 0; i < nTeams; i++) {
      var x = laneX(i), t = TEAMS[i], g = new T3.Group(); g.position.x = x; scene.add(g);
      var lane = new T3.Mesh(new T3.BoxGeometry(LANE_W, .12, FOUL_Z - PIT_Z + 1), new T3.MeshLambertMaterial({ map: woodTex })); lane.position.set(0, .3, (FOUL_Z + PIT_Z) / 2 - .5); lane.receiveShadow = true; g.add(lane);
      [-1, 1].forEach(function (s) {   // rounded gutters and team-coloured bumper rails
        var gut = new T3.Mesh(new T3.CylinderGeometry(.3, .3, FOUL_Z - PIT_Z, 16, 1, true, -Math.PI / 2, Math.PI), K.mat(0xb7bec7, { side: T3.DoubleSide }));   // open channel (the bottom half of a pipe)
        gut.rotation.x = Math.PI / 2; gut.position.set(s * (HALF + .3), .36, (FOUL_Z + PIT_Z) / 2); g.add(gut);
        var rail = new T3.Mesh(new T3.BoxGeometry(.14, .26, FOUL_Z - PIT_Z), K.mat(t.hex)); rail.position.set(s * (HALF + .7), .42, (FOUL_Z + PIT_Z) / 2); rail.castShadow = true; g.add(rail);
      });
      // foul line, aiming arrows and dots
      var fl = new T3.Mesh(new T3.PlaneGeometry(LANE_W, .08), new T3.MeshBasicMaterial({ color: 0x2b1d40 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, .37, FOUL_Z); g.add(fl);
      for (var a = 0; a < 5; a++) {
        var ar = new T3.Mesh(new T3.ConeGeometry(.1, .32, 3), new T3.MeshBasicMaterial({ color: t.hex })); ar.rotation.x = -Math.PI / 2; ar.position.set((a - 2) * .42, .37, 1.2 - Math.abs(a - 2) * .35); g.add(ar);
      }
      // pin deck back wall + team sign
      var wall = new T3.Mesh(new T3.BoxGeometry(LANE_W + 1.6, 1.6, .3), K.mat(0xfff3d6)); wall.position.set(0, 1, PIT_Z - .6); wall.castShadow = true; g.add(wall);
      var stripe = new T3.Mesh(new T3.BoxGeometry(LANE_W + 1.62, .32, .32), K.mat(t.hex)); stripe.position.set(0, 1.55, PIT_Z - .6); g.add(stripe);
      var lab = K.label(t.name, t.c); lab.scale.multiplyScalar(.9); lab.position.set(0, 2.5, PIT_Z - .6); g.add(lab);
      lanes.push({ i: i, x: x, group: g, team: t, pins: [] });
    }
    // an arch over the whole green
    var w = nTeams * (LANE_W + GAP) + 1.6;
    [-1, 1].forEach(function (s) { var post = new T3.Mesh(new T3.CylinderGeometry(.18, .2, 4.4, 12), K.mat(0xffffff)); post.position.set(s * w / 2, 2.2, PIT_Z - 1.4); post.castShadow = true; scene.add(post); });
    var beam = new T3.Mesh(new T3.BoxGeometry(w + .6, .9, .4), K.mat(0xff5f5f)); beam.position.set(0, 4.5, PIT_Z - 1.4); beam.castShadow = true; scene.add(beam);
    var sign = K.label('🎳 BOWLING GREEN', '#ff5f5f', 560); sign.scale.multiplyScalar(1.1); sign.position.set(0, 5.6, PIT_Z - 1.4); scene.add(sign);
  })();

  /* ---------------- pins (made in code) and the ball ---------------- */
  var pinProfile = [[0, 0], [.09, 0], [.12, .08], [.16, .24], [.15, .38], [.09, .56], [.065, .66], [.085, .76], [.09, .84], [.065, .92], [0, .95]].map(function (p) { return new T3.Vector2(p[0], p[1]); });
  var pinGeo = new T3.LatheGeometry(pinProfile, 20);
  var pinWhite = K.mat(0xffffff);
  var PIN_SPOTS = (function () { var s = [], d = .44; for (var r = 0; r < 4; r++) for (var k = 0; k <= r; k++) s.push([(k - r / 2) * d * 1.15, HEAD_Z - r * d * 1.0]); return s; })();
  function makePin(t) {
    var g = new T3.Group(), body = new T3.Mesh(pinGeo, pinWhite); body.castShadow = true; g.add(body);
    [.66, .74].forEach(function (y) { var band = new T3.Mesh(new T3.CylinderGeometry(.071, .075, .035, 16), K.mat(t.hex)); band.position.y = y; g.add(band); });
    return g;
  }
  function rackPins(lane) {
    lane.pins.forEach(function (p) { lane.group.remove(p.mesh); });
    lane.pins = PIN_SPOTS.map(function (s) {
      var m = makePin(lane.team); m.position.set(s[0], .36, s[1]); lane.group.add(m);
      return { mesh: m, x: s[0], z: s[1], vx: 0, vz: 0, down: false, fall: 0, axis: V(1, 0, 0) };
    });
  }
  var ballGeo = new T3.SphereGeometry(BALL_R, 28, 20);
  function makeBall(t) {
    var g = new T3.Group(), b = new T3.Mesh(ballGeo, new T3.MeshStandardMaterial({ color: t.hex, roughness: .25, metalness: .05 })); b.castShadow = true; g.add(b);
    [[-.08, .1], [.08, .1], [0, -.04]].forEach(function (h) { var hole = new T3.Mesh(new T3.CircleGeometry(.045, 12), new T3.MeshBasicMaterial({ color: 0x2b1d40 })); hole.position.set(h[0], h[1], BALL_R - .004); b.add(hole); });
    var sw = new T3.Mesh(new T3.TorusGeometry(BALL_R * .99, .02, 6, 32), K.mat(0xffffff)); sw.rotation.y = Math.PI / 2; b.add(sw);
    g.userData.spin = b; return g;
  }

  /* ---------------- physics: a simple top-down sim, fixed steps (same result every time) ---------------- */
  var roll = null;   // the ball in play
  function stepPhysics(h) {
    if (!roll) return;
    var L = roll.lane, b = roll;
    if (!b.done) {
      b.vx += b.hook * h; b.x += b.vx * h; b.z += b.vz * h;
      if (b.wobble) b.x += Math.sin(b.z * 3.2) * b.wobble * h;
      if (!b.gutter && Math.abs(b.x) > HALF - .05) { b.gutter = true; b.x = Math.sign(b.x) * (HALF + .3); b.vx = 0; b.hook = 0; K.sfx('gutter'); K.fx.text('Gutter!', V(L.x + b.x, 1.4, b.z), '#8a9099', .9); }
      if (!b.gutter) L.pins.forEach(function (p) {
        var dx = p.x - b.x, dz = p.z - b.z, d = Math.hypot(dx, dz);
        if (d < BALL_R + PIN_R && !p.hitByBall) {
          p.hitByBall = true; var nx = dx / (d || 1), nz = dz / (d || 1);
          p.vx = b.vx * .6 + nx * 3; p.vz = b.vz * .6 + nz * 3; knock(p);
          b.vz *= .88; b.vx -= nx * 1.1;   // the ball bounces off a little, so only a ball into the pocket clears them all
        }
      });
      if (b.z < PIT_Z + .3) { b.done = true; b.settle = 1.3; }
    } else b.settle -= h;
    // pins knock pins (tuned with test rolls: a ball in the middle ≈ strike, near the edge ≈ 2–3 pins)
    L.pins.forEach(function (p) {
      if (!p.down && !p.moving) return;
      var sp = Math.hypot(p.vx, p.vz);
      if (sp > .05) {
        p.x += p.vx * h; p.z += p.vz * h; var f = Math.max(0, 1 - 2.6 * h); p.vx *= f; p.vz *= f;
        L.pins.forEach(function (q) {
          if (q === p || q.down) return;
          var dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz);
          if (d < PIN_R * 2.15 && sp > 2.2 && Math.random() < .65) { var nx = dx / (d || 1), nz = dz / (d || 1); q.vx = p.vx * .45 + nx * 1.0; q.vz = p.vz * .45 + nz * 1.0; knock(q); p.vx *= .6; p.vz *= .6; }
        });
      }
    });
  }
  function knock(p) {
    if (p.down) return; p.down = true; p.moving = true;
    var v = V(p.vx, 0, p.vz); if (v.lengthSq() < .01) v.set(0, 0, -1);
    p.axis = V(v.z, 0, -v.x).normalize(); p.fall = 0;
  }
  var ACC = 0;
  K.onFrame(function (dt) {
    ACC += Math.min(dt, .05); var H = 1 / 120;
    while (ACC >= H) { stepPhysics(H); ACC -= H; }
    lanes.forEach(function (L) {
      L.pins.forEach(function (p) {
        if (p.down && p.fall < Math.PI / 2) p.fall = Math.min(Math.PI / 2, p.fall + dt * 7);
        p.mesh.position.set(p.x, .36 + (p.down ? Math.sin(p.fall) * PIN_R * .8 : 0), p.z);
        if (p.down) p.mesh.quaternion.setFromAxisAngle(p.axis, -p.fall);
        if (p.z < PIT_Z - .2 || Math.abs(p.x) > HALF + .9) p.mesh.visible = false;
      });
    });
    if (roll && roll.mesh) {
      var b = roll;
      b.mesh.position.set(b.x, b.gutter ? .1 + BALL_R * .2 : .36 + BALL_R, b.z);
      b.mesh.userData.spin.rotation.x -= b.vz * dt / BALL_R * -1;
      if (b.z < PIT_Z) b.mesh.visible = false;
    }
  });

  /* ---------------- aiming: an arrow swings across the lane, tap to stop it ---------------- */
  var aimArrow = (function () {
    var g = new T3.Group(), m = new T3.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: .9 });
    var shaft = new T3.Mesh(new T3.BoxGeometry(.12, .02, 1.6), m); shaft.position.z = -.8; g.add(shaft);
    var head = new T3.Mesh(new T3.ConeGeometry(.26, .5, 3), m); head.rotation.x = -Math.PI / 2; head.position.z = -1.75; g.add(head);
    g.visible = false; g.position.y = .4; scene.add(g); return g;
  })();
  function aim(lane, done) {
    var t0 = K.now, stopped = false, sweep = HALF * .92;
    aimArrow.visible = true; aimArrow.position.z = FOUL_Z - .6;
    var fn = K.onFrame(function () { aimArrow.position.x = lane.x + Math.sin((K.now - t0) * 2.6) * sweep; });
    var bar = K.ui.add(K.el('div', 'bw-aim', '👆 Tap to stop the arrow!'));
    var btn = K.el('button', 'btn green', '🎳 Roll!'); bar.appendChild(btn);
    function stop() {
      if (stopped) return; stopped = true; K.offFrame(fn); bar.remove(); K.renderer.domElement.removeEventListener('pointerdown', stop);
      var x = aimArrow.position.x - lane.x; aimArrow.visible = false; done(x);
    }
    btn.onclick = stop; K.renderer.domElement.addEventListener('pointerdown', stop);
    if (K.DEMO) K.after(.9 + Math.random() * .6, stop);
  }

  /* ---------------- characters: each team's monster bowls ---------------- */
  var mons = [];
  K.onFrame(function (dt) { mons.forEach(function (m) { if (m) m.update(dt); }); });
  function monSpot(i) { return V(laneX(i) + .9, .25, FOUL_Z + 1.6); }

  /* ---------------- camera ---------------- */
  function shot(name, lane) {
    K.cam.follow = null;
    if (name === 'title') { K.cam.follow = function () { var a = Math.sin(K.now * .15) * 2.5; K.cam.tPos.set(a, 5.5, FOUL_Z + 9); K.cam.tLook.set(0, .5, -2); }; K.cam.k = 1.5; }
    if (name === 'ask') K.cam.set(V(lane.x, 4.6, FOUL_Z + 6), V(lane.x, -2.2, -5.5), 2.4);   // whole lane, pins near the top, above the question card   // lane in the top half, above the question card
    if (name === 'aim') K.cam.set(V(lane.x, 2.4, FOUL_Z + 4.2), V(lane.x, .4, -2), 2.6);
    if (name === 'roll') { K.cam.follow = function () { var z = roll ? Math.max(roll.z, HEAD_Z + 1) : 0; K.cam.tPos.set(lane.x + (roll ? roll.x * .4 : 0), 2.2, z + 4.2); K.cam.tLook.set(lane.x, .4, z - 3); }; K.cam.k = 3.2; }
    if (name === 'pins') K.cam.set(V(lane.x + 1.2, 2.2, HEAD_Z + 3.4), V(lane.x, .4, HEAD_Z - .6), 3);
    if (name === 'end') { K.cam.follow = function () { var a = Math.sin(K.now * .3) * 1.5; K.cam.tPos.set(a, 4.2, FOUL_Z + 8); K.cam.tLook.set(0, 1.2, FOUL_Z); }; K.cam.k = 2; }
  }

  /* ---------------- flow ---------------- */
  var hud, phase = 'loading', round = 0, turnI = 0, demoN = 0, DEMO_WRONG = [3, 7];
  function title() {
    phase = 'title'; shot('title'); K.cam.snap();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML = '<img class="logo" src="art/logo.png" alt="" onerror="this.remove()"><div class="say" style="--c:#ff5f5f;font-size:1.5rem">🎳 Answer right, then tap to aim! Knock down the pins!</div><div class="say" style="--c:#4f9dff">' + ROUNDS + ' rounds · every pin = 1 point · STRIKE = +5</div>';
    var rows = K.el('div', 'rows'), go = K.el('button', 'btn green', '▶ Start');
    go.onclick = function () { K.audio(); K.loadSounds(['hello', 'correct', 'wrong', 'roll', 'strike', 'pins', 'gutter', 'whoosh', 'win']); K.cls.assign(TEAMS); start(); };
    rows.appendChild(go); box.appendChild(rows); K.cls.setupRow(box, nTeams); K.ui.topButtons();
    mons.forEach(function (m, i) { K.after(.4 + i * .45, function () { if (phase === 'title' && m) { m.setState('hello'); K.after(1.3, function () { if (phase === 'title') m.setState('idle'); }); } }); });
    if (K.DEMO) K.after(2.2, function () { go.onclick(); });
  }
  function start() {
    K.ui.clear(); K.ui.topButtons();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' 🎳'; }); hud.refresh(-1);
    round = 0; turnI = 0; nextTurn();
  }
  function nextTurn() {
    if (turnI >= nTeams) { turnI = 0; round++; }
    if (round >= ROUNDS) return finish();
    var lane = lanes[turnI], t = lane.team, m = mons[turnI];
    phase = 'ask'; hud.refresh(turnI); demoN++;
    if (!lane.pins.length || lane.pins.some(function (p) { return p.down; })) rackPins(lane);
    if (turnI === 0) K.ui.big('Round ' + (round + 1) + ' of ' + ROUNDS, 1.2, true);
    shot('ask', lane);
    if (m) { m.setState('hello'); K.after(.8, function () { m.setState('ready'); }); }
    K.sfx('hello');
    K.after(.9, function () {
      K.ui.ask(QS.next(), t, { prompt: 'answer right to aim your ball!', demoRight: DEMO_WRONG.indexOf(demoN) < 0, onAnswer: function (ok) {
        if (ok) { K.sfx('correct'); shot('aim', lane); K.after(.5, function () { aim(lane, function (x) { bowl(lane, x, false); }); }); }
        else { K.sfx('wrong'); K.ui.toast('Oops! A wobbly ball…', 1.6, t.c); shot('aim', lane); K.after(1.2, function () { bowl(lane, rnd(-HALF * 1.1, HALF * 1.1), true); }); }
      } });
    });
  }
  function bowl(lane, x, wobbly) {
    phase = 'roll';
    var t = lane.team, m = mons[lane.i], ball = makeBall(t); lane.group.add(ball);
    roll = { lane: lane, mesh: ball, x: clamp(x, -HALF + .1, HALF - .1), z: FOUL_Z - .2, vx: (wobbly ? rnd(-.25, .25) : 0), vz: wobbly ? -6.2 : -8.6, hook: wobbly ? rnd(-.4, .4) : rnd(-.08, .08), wobble: wobbly ? rnd(.6, 1.1) : 0, gutter: false, done: false, settle: 0 };
    if (m) { m.root.parent.rotation.y = Math.PI; m.setState('run'); K.after(.6, function () { m.setState('ready'); }); }
    K.sfx('roll'); shot('roll', lane);
    var fn = K.onFrame(function () {
      if (roll && roll.z < HEAD_Z + 2.4 && !roll.camPins) { roll.camPins = true; shot('pins', lane); }
      if (roll && roll.done && roll.settle <= 0) { K.offFrame(fn); result(lane); }
    });
  }
  function result(lane) {
    var t = lane.team, m = mons[lane.i], n = lane.pins.filter(function (p) { return p.down; }).length, strike = n === 10;
    lane.group.remove(roll.mesh); roll = null;
    var pts = n + (strike ? 5 : 0); t.score += pts; t.rolls.push(n); if (strike) t.strikes++;
    hud.refresh(lane.i); hud.bump(lane.i);
    var head = V(lane.x, 1.8, HEAD_Z);
    if (strike) { K.sfx('strike'); K.ui.big('STRIKE! +15', 1.6); K.fx.confetti(head.clone().add(V(0, 1, 0)), 140); K.say('Strike!'); K.cam.shake(.25); if (m) m.setState('cheer'); }
    else if (n > 0) { K.sfx('pins'); K.fx.text(n + (n === 1 ? ' pin!' : ' pins!'), head, t.c, 1.3); K.say(n + (n === 1 ? ' pin' : ' pins')); if (m) m.setState(n >= 7 ? 'cheer' : 'clap'); }
    else { K.fx.text('0 pins', head, '#8a9099', 1.1); K.say('Oh no!'); if (m) m.setState('shrug'); }
    K.after(2.2, function () { if (m) { m.setState('idle'); m.root.parent.rotation.y = 0; } turnI++; nextTurn(); });
  }
  function finish() {
    phase = 'end'; window.__k3phase = 'end'; hud.refresh(-1);
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) { return TEAMS[b].score - TEAMS[a].score; });
    var best = TEAMS[order[0]];
    order.forEach(function (ti, k) { var m = mons[ti]; if (!m) return; m.root.parent.position.set((k - (order.length - 1) / 2) * 2.2, .25 + (k === 0 ? .4 : 0), FOUL_Z + 1.2); m.root.parent.rotation.y = 0; m.setState(k === 0 ? 'cheer' : 'clap'); });
    var pod = new T3.Mesh(new T3.CylinderGeometry(.9, 1, .4, 32), K.mat(0xffd84a)); pod.position.set(-(order.length - 1) / 2 * 2.2, .3, FOUL_Z + 1.2); scene.add(pod);
    shot('end'); K.sfx('win'); K.fx.confetti(V(0, 4, FOUL_Z), 220);
    K.ui.big('🏆 Team ' + best.name + '!', 2.4, true); K.say('Team ' + best.name + ' wins the bowling!');
    K.after(2.6, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      box.innerHTML = '<div class="say" style="--c:' + best.c + '">🏆 Team ' + best.name + ' · ' + best.score + ' points</div><div class="bw-table">' + order.map(function (ti) { var t = TEAMS[ti]; return '<div style="--c:' + t.c + '"><b>' + t.name + '</b><span>' + t.rolls.join(' · ') + '</span><i>' + (t.strikes ? '⚡' + t.strikes + ' ' : '') + t.score + '</i></div>'; }).join('') + '</div>';
      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn', '↻ Play again'); again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Games'); back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again); rows.appendChild(back); box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'bowling3d', title: 'Bowling 3D', scoreOf: function (t) { return t.score; } });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Polishing the lanes…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'bowl', clear: true }).catch(function (e) { console.warn('world', e); K.world.ground(0x8fdc7a); return null; }) : Promise.resolve(null);
  Promise.all([worldP].concat(TEAMS.map(function (t) { return K.makeCharacter(t, { monHeight: 1.4, kidHeight: 1.3 }); }))).then(function (res) {
    res.slice(1).forEach(function (ch, i) {
      var h = new T3.Group(); h.add(ch.root); h.position.copy(monSpot(i)); scene.add(h); mons[i] = ch;   // faces the camera; turns to the pins only to bowl
    });
    lanes.forEach(rackPins);
    loading.remove(); title(); K.start();
  }).catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
