/* Board Game 3D — English Adventure Academy
   Plays at Board Game Meadow in Adventure Park (games/world, zone "board").
   A winding path of 30 squares; each team's monster is its playing piece.
   Each turn: answer a question. Right → roll the big die and move. Wrong → one small step (nobody stands still).
   Ladders take you up, slides take you down, a star square gives +2. First to the treasure chest wins;
   after 8 rounds the team furthest along wins. Points go to the Class Board at the end.
   Options: ?teams=2..4  ?rounds=4..12  ?set=<id>  ?noworld  ?demo=1  ?capture=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 40, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4), MAX_ROUNDS = clamp(+K.Q.get('rounds') || 8, 4, 12);
  var TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) { return Object.assign({ pos: 0, rights: 0, finished: 0 }, t); });
  var QS = K.questions('g3-u5-vocab');

  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x8fdc7a);

  /* ---------------- the board: 30 squares winding in rows (square 0 = start pad, 30 = treasure) ---------------- */
  var N = 30, COLS = 6, STEP = 2.5, ROWS = 5;
  var LADDERS = { 3: 10, 14: 23, 17: 20 }, SLIDES = { 28: 21, 22: 15, 11: 2 }, STARS = { 6: 1, 18: 1, 26: 1 };   // each ladder/slide joins two squares straight above each other
  function tilePos(n) {   // square 1..30 on a serpentine; 0 is the start pad in front of square 1
    if (n <= 0) return V(-(COLS - 1) / 2 * STEP - STEP, 0, (ROWS - 1) / 2 * STEP);
    var i = n - 1, row = Math.floor(i / COLS), col = i % COLS; if (row % 2) col = COLS - 1 - col;
    return V((col - (COLS - 1) / 2) * STEP, 0, ((ROWS - 1) / 2 - row) * STEP);
  }
  var pastel = [0xffd3e6, 0xd3e6ff, 0xffeac2, 0xc9f2df];
  var tiles = [];
  (function buildBoard() {
    var base = new T3.Mesh(new T3.BoxGeometry(COLS * STEP + 3.4, .4, ROWS * STEP + 2.2), K.mat(0xb98a57)); base.position.y = .05; base.receiveShadow = true; base.castShadow = true; scene.add(base);
    var top = new T3.Mesh(new T3.BoxGeometry(COLS * STEP + 2.8, .06, ROWS * STEP + 1.6), K.mat(0xfff3d6)); top.position.y = .28; top.receiveShadow = true; scene.add(top);
    for (var n = 0; n <= N; n++) {
      var p = tilePos(n), special = LADDERS[n] ? 'ladder' : SLIDES[n] ? 'slide' : STARS[n] ? 'star' : '';
      var col = n === 0 ? 0xffffff : n === N ? 0xffd84a : special === 'ladder' ? 0x9be7a8 : special === 'slide' ? 0xffb3a7 : special === 'star' ? 0xfff07a : pastel[n % 4];
      var face = K.canvasTex(256, 256, (function (n, special) { return function (c, W, H) {
        c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, H);   // white base: the tile colour shows through
        c.font = '900 ' + (n === 0 ? 60 : 92) + 'px "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = 'rgba(43,29,64,.82)';
        c.fillText(n === 0 ? 'START' : n === N ? '🏆' : special === 'star' ? '⭐' : String(n), W / 2, H / 2 + 6);
        if (special === 'star') { c.font = '900 40px "Trebuchet MS"'; c.fillText(String(n), W / 2, H - 34); }
      }; })(n, special));
      var tile = new T3.Mesh(new T3.BoxGeometry(STEP * .9, .22, STEP * .9), [K.mat(col), K.mat(col), new T3.MeshLambertMaterial({ color: col, map: face }), K.mat(col), K.mat(col), K.mat(col)]);
      tile.position.set(p.x, .42, p.z); tile.castShadow = true; tile.receiveShadow = true; scene.add(tile); tiles[n] = tile;
    }
    // ladders: two rails and rungs from the bottom square up to the top square
    Object.keys(LADDERS).forEach(function (a) {
      var A = tilePos(+a).add(V(0, .6, 0)), B = tilePos(LADDERS[a]).add(V(0, .6, 0)), d = B.clone().sub(A), len = d.length(), g = new T3.Group();
      g.position.copy(A.clone().lerp(B, .5)); g.position.y = .95; g.lookAt(B.x, .95, B.z); scene.add(g);
      [-.32, .32].forEach(function (x) { var r = new T3.Mesh(new T3.BoxGeometry(.1, .1, len * .9), K.mat(0xc98a55)); r.position.x = x; r.castShadow = true; g.add(r); });
      for (var k = 0; k < Math.round(len / .45); k++) { var rung = new T3.Mesh(new T3.CylinderGeometry(.04, .04, .64, 6), K.mat(0xe0a96b)); rung.rotation.z = Math.PI / 2; rung.position.z = -len * .45 + k * .45 + .2; g.add(rung); }
    });
    // slides: a bright curved chute from the top square down to the bottom square
    Object.keys(SLIDES).forEach(function (a, si) {
      var A = tilePos(+a), B = tilePos(SLIDES[a]), mid = A.clone().lerp(B, .5);
      var side = V(-(B.z - A.z), 0, B.x - A.x).normalize().multiplyScalar(.75);   // bulges into the gap between columns
      var curve = new T3.CatmullRomCurve3([V(A.x, 1.6, A.z), V(mid.x + side.x, 1.1, mid.z + side.z), V(B.x, .65, B.z)]);
      var tube = new T3.Mesh(new T3.TubeGeometry(curve, 40, .2, 10, false), K.mat([0xff5fa2, 0x4f9dff, 0xffb320][si % 3])); tube.castShadow = true; scene.add(tube);
      var post = new T3.Mesh(new T3.CylinderGeometry(.07, .07, 1.2, 8), K.mat(0xffffff)); post.position.set(A.x, 1, A.z); scene.add(post);
    });
  })();
  var chestSpot = tilePos(N).add(V(0, .55, 0));

  /* ---------------- the big die ---------------- */
  var die = (function () {
    var PIPS = { 1: [[.5, .5]], 2: [[.27, .27], [.73, .73]], 3: [[.25, .25], [.5, .5], [.75, .75]], 4: [[.27, .27], [.73, .27], [.27, .73], [.73, .73]], 5: [[.25, .25], [.75, .25], [.5, .5], [.25, .75], [.75, .75]], 6: [[.27, .22], [.73, .22], [.27, .5], [.73, .5], [.27, .78], [.73, .78]] };
    function face(v) { return new T3.MeshLambertMaterial({ map: K.canvasTex(128, 128, function (c, W, H) { c.fillStyle = '#fffdf7'; c.fillRect(0, 0, W, H); c.fillStyle = v === 1 ? '#ff3b3b' : '#2b1d40'; PIPS[v].forEach(function (p) { c.beginPath(); c.arc(p[0] * W, p[1] * H, 12, 0, 7); c.fill(); }); }) }); }
    // box faces: +x, -x, +y, -y, +z, -z  →  3, 4, 1, 6, 2, 5
    var m = new T3.Mesh(new T3.BoxGeometry(1.1, 1.1, 1.1), [face(3), face(4), face(1), face(6), face(2), face(5)]); m.castShadow = true;
    var g = new T3.Group(); g.add(m); g.visible = false; scene.add(g);
    var UP = { 1: [0, 0, 0], 6: [Math.PI, 0, 0], 2: [-Math.PI / 2, 0, 0], 5: [Math.PI / 2, 0, 0], 3: [0, 0, Math.PI / 2], 4: [0, 0, -Math.PI / 2] };
    return {
      roll: function (at, value, done) {
        g.visible = true; g.position.copy(at).add(V(0, 3.2, 0)); var t0 = K.now, spin = V(rnd(6, 10), rnd(4, 8), rnd(6, 10));
        var target = new T3.Quaternion().setFromEuler(new T3.Euler(UP[value][0], UP[value][1], UP[value][2])).premultiply(new T3.Quaternion().setFromAxisAngle(V(0, 1, 0), rnd(-.5, .5)));
        var start = null;
        var fn = K.onFrame(function (dt) {
          var t = K.now - t0;
          if (t < .9) { m.rotation.x += spin.x * dt; m.rotation.y += spin.y * dt; m.rotation.z += spin.z * dt; g.position.y = at.y + 1.2 + Math.abs(Math.sin(t * 7)) * 1.6 * (1 - t / .9); }
          else {
            if (!start) start = m.quaternion.clone();
            var u = Math.min(1, (t - .9) / .3); m.quaternion.copy(start).slerp(target, u); g.position.y = at.y + 1.2;
            if (u >= 1) { K.offFrame(fn); K.sfx('pop'); K.after(.6, function () { done(); }); }
          }
        });
      },
      hide: function () { g.visible = false; }
    };
  })();

  /* ---------------- pieces: the team monsters ---------------- */
  var mons = [], holders = [];
  K.onFrame(function (dt) { mons.forEach(function (m) { if (m) m.update(dt); }); });
  function spotOn(n, ti) {   // several pieces on one square stand in its corners
    var p = tilePos(n), here = TEAMS.filter(function (t) { return t.pos === n; }).length, k = ti % 4;
    var off = here > 1 || n === 0 ? [[-.5, -.45], [.5, -.45], [-.5, .45], [.5, .45]][k] : [0, 0];
    return V(p.x + off[0], .53, p.z + off[1]);
  }
  function placeAll(except) { TEAMS.forEach(function (t, i) { if (i !== except && holders[i]) holders[i].position.copy(spotOn(t.pos, i)); }); }
  // hop one square at a time
  function walk(ti, path, done) {
    var h = holders[ti], m = mons[ti], k = 0;
    if (m) m.setState('hop');
    (function next() {
      if (k >= path.length) { if (m) m.setState('idle'); placeAll(); return done(); }
      var from = h.position.clone(), to = spotOn(path[k], ti), t0 = K.now; TEAMS[ti].pos = path[k];
      h.lookAt(to.x, h.position.y, to.z);
      var fn = K.onFrame(function () {
        var u = Math.min(1, (K.now - t0) / .32); h.position.lerpVectors(from, to, u); h.position.y = to.y + Math.sin(u * Math.PI) * .7;
        if (u >= 1) { K.offFrame(fn); K.sfx('step'); k++; next(); }
      });
    })();
  }
  // ride a ladder or a slide: glide straight to the other square
  function glide(ti, to, up, done) {
    var h = holders[ti], m = mons[ti], from = h.position.clone(), end = spotOn(to, ti), t0 = K.now, dur = up ? 1.1 : .9;
    TEAMS[ti].pos = to; if (m) m.setState(up ? 'cheer' : 'tumble');
    var fn = K.onFrame(function () {
      var u = Math.min(1, (K.now - t0) / dur); h.position.lerpVectors(from, end, u); h.position.y = end.y + Math.sin(u * Math.PI) * (up ? 1.8 : 1.1);
      if (up) h.rotation.y += .0; else h.rotation.y += .25;
      if (u >= 1) { K.offFrame(fn); h.rotation.y = 0; if (m) m.setState(up ? 'cheer' : 'dizzy'); K.after(.9, function () { if (m) m.setState('idle'); placeAll(); done(); }); }
    });
  }

  /* ---------------- camera ---------------- */
  function shot(name, at) {
    K.cam.follow = null;
    if (name === 'title') { K.cam.follow = function () { var a = Math.sin(K.now * .15) * .25; K.cam.tPos.set(Math.sin(a) * 18, 15, Math.cos(a) * 18); K.cam.tLook.set(0, 0, -.5); }; K.cam.k = 1.4; }
    if (name === 'board') K.cam.set(V(0, 15.5, 15), V(0, 0, -.6), 2.2);
    if (name === 'ask') K.cam.set(V(0, 31, 13.5), V(0, 0, 4.4), 2.2);   // the whole board above the question card   // the whole board in the top half, above the question card
    if (name === 'follow') { K.cam.follow = function () { var p = holders[at].position; K.cam.tPos.set(p.x * .6, 9.5, p.z + 9); K.cam.tLook.set(p.x * .8, .5, p.z - .5); }; K.cam.k = 2.6; }
    if (name === 'end') { K.cam.follow = function () { var a = Math.sin(K.now * .3) * .4; K.cam.tPos.set(chestSpot.x + Math.sin(a) * 7, 5.2, chestSpot.z + Math.cos(a) * 7); K.cam.tLook.set(chestSpot.x - 1, 1, chestSpot.z); }; K.cam.k = 2; }
  }

  /* ---------------- HUD: the race order ---------------- */
  var hud;
  function refresh(active) { hud.refresh(active); }

  /* ---------------- flow ---------------- */
  var phase = 'loading', round = 0, turnI = 0, demoN = 0, DEMO_WRONG = [3, 8, 12], winner = null;
  function title() {
    phase = 'title'; shot('title'); K.cam.snap();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML = '<img class="logo" src="art/logo.png" alt="" onerror="this.remove()"><div class="say" style="--c:#ff5f5f;font-size:1.5rem">🎲 Answer right to roll the dice! Race to the treasure chest!</div><div class="say" style="--c:#2fc58a">🪜 Ladders go up · 🛝 slides go down · ⭐ = 2 more steps</div>';
    var rows = K.el('div', 'rows'), go = K.el('button', 'btn green', '▶ Start');
    go.onclick = function () { K.audio(); K.loadSounds(['hello', 'correct', 'wrong', 'dice', 'step', 'ladder', 'slide', 'star', 'pop', 'whoosh', 'win']); K.cls.assign(TEAMS); start(); };
    rows.appendChild(go); box.appendChild(rows); K.cls.setupRow(box, nTeams); K.ui.topButtons();
    mons.forEach(function (m, i) { K.after(.4 + i * .45, function () { if (phase === 'title' && m) { m.setState('hello'); K.after(1.3, function () { if (phase === 'title') m.setState('idle'); }); } }); });
    if (K.DEMO) K.after(2.2, function () { go.onclick(); });
  }
  function start() {
    K.ui.clear(); K.ui.topButtons();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.pos === N ? '🏆' : '▢ ' + t.pos; }); refresh(-1);
    round = 0; turnI = 0; nextTurn();
  }
  function nextTurn() {
    if (winner !== null) return finish();
    if (turnI >= nTeams) { turnI = 0; round++; }
    if (round >= MAX_ROUNDS) return finish();
    var t = TEAMS[turnI], ti = turnI, m = mons[ti];
    phase = 'ask'; refresh(ti); demoN++;
    if (ti === 0) K.ui.big('Round ' + (round + 1) + ' of ' + MAX_ROUNDS, 1.1, true);
    shot('ask'); if (m) { m.setState('hello'); K.after(.8, function () { m.setState('idle'); }); } K.sfx('hello');
    K.after(.9, function () {
      K.ui.ask(QS.next(), t, { prompt: 'answer right to roll the dice!', demoRight: DEMO_WRONG.indexOf(demoN) < 0, onAnswer: function (ok) {
        if (ok) {
          t.rights++; K.sfx('correct'); shot('follow', ti);
          var v = 1 + Math.floor(Math.random() * 6);
          K.sfx('dice'); die.roll(holders[ti].position.clone(), v, function () { die.hide(); K.ui.toast('Team ' + t.name + ' rolled ' + v + '!', 1.4, t.c); K.say(String(v)); move(ti, v); });
        } else { K.sfx('wrong'); shot('follow', ti); K.ui.toast('One little step…', 1.4, t.c); K.after(.6, function () { move(ti, 1); }); }
      } });
    });
  }
  function move(ti, steps) {
    phase = 'move';
    var t = TEAMS[ti], target = Math.min(N, t.pos + steps), path = [];
    for (var n = t.pos + 1; n <= target; n++) path.push(n);
    walk(ti, path, function () { refresh(ti); land(ti); });
  }
  function land(ti) {
    var t = TEAMS[ti], n = t.pos, at = tilePos(n).add(V(0, 2, 0));
    if (n >= N) { winner = ti; K.sfx('win'); K.fx.confetti(chestSpot.clone().add(V(0, 2, 0)), 200); K.ui.big('🏆 Team ' + t.name + ' found the treasure!', 2.2, true); K.say('Team ' + t.name + ' found the treasure!'); if (mons[ti]) mons[ti].setState('cheer'); return K.after(2.4, finish); }
    if (LADDERS[n]) { K.sfx('ladder'); K.fx.text('Ladder! Up!', at, '#2fc58a', 1.2); return glide(ti, LADDERS[n], true, function () { refresh(ti); after(); }); }
    if (SLIDES[n]) { K.sfx('slide'); K.fx.text('Slide! Wheee!', at, '#ff5fa2', 1.2); return glide(ti, SLIDES[n], false, function () { refresh(ti); after(); }); }
    if (STARS[n]) { K.sfx('star'); K.fx.text('⭐ +2', at, '#ffb320', 1.2); K.fx.burst(at, [0xffd84a, 0xffffff], 18, 4); return K.after(.7, function () { var path = []; for (var k = n + 1; k <= Math.min(N, n + 2); k++) path.push(k); walk(ti, path, function () { refresh(ti); land(ti); }); }); }
    after();
    function after() { K.after(.9, function () { turnI++; nextTurn(); }); }
  }
  function finish() {
    phase = 'end'; window.__k3phase = 'end'; refresh(-1);
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) { return (TEAMS[b].pos - TEAMS[a].pos) || (TEAMS[b].rights - TEAMS[a].rights); });
    var best = TEAMS[order[0]];
    order.forEach(function (ti, k) { var h = holders[ti]; h.position.set(chestSpot.x - 1.6 - k * 1.25, .53, chestSpot.z + (k ? 1.2 : 0)); h.rotation.y = 0; if (mons[ti]) mons[ti].setState(k === 0 ? 'cheer' : 'clap'); });
    shot('end');
    if (winner === null) { K.sfx('win'); K.fx.confetti(chestSpot.clone().add(V(0, 2, 0)), 160); K.ui.big('⏱ Team ' + best.name + ' got furthest!', 2.2, true); K.say('Team ' + best.name + ' wins!'); }
    K.after(2.4, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      box.innerHTML = '<div class="say" style="--c:' + best.c + '">🏆 Team ' + best.name + (best.pos === N ? ' found the treasure!' : ' got furthest!') + '</div><div class="bd-table">' + order.map(function (ti, k) { var t = TEAMS[ti]; return '<div style="--c:' + t.c + '"><b>' + (k + 1) + '. ' + t.name + '</b><span>' + t.rights + ' right answers</span><i>' + (t.pos === N ? '🏆' : 'square ' + t.pos) + '</i></div>'; }).join('') + '</div>';
      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn', '↻ Play again'); again.onclick = function () { location.reload(); };
      var back = K.el('button', 'btn soft', '🏠 Games'); back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again); rows.appendChild(back); box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'board3d', title: 'Board Game 3D', scoreOf: function (t) { return t.pos * 10 + t.rights; } });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Setting up the board…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'board', clear: true }).catch(function (e) { console.warn('world', e); K.world.ground(0x8fdc7a); return null; }) : Promise.resolve(null);
  var chestP = K.tryGLB(K.ROOT + 'assets/3d/world/pirate/Prop_Chest_Gold.glb').then(function (g) { return g ? K.fitModel(g.scene, 1.1) : null; });
  Promise.all([worldP, chestP].concat(TEAMS.map(function (t) { return K.makeCharacter(t, { monHeight: 1.15, kidHeight: 1.1 }); }))).then(function (res) {
    var chest = res[1];
    if (chest) { chest.position.set(chestSpot.x + .55, .53, chestSpot.z - .45); chest.rotation.y = -.4; scene.add(chest); var cl = new T3.PointLight(0xffd84a, 2.2, 6); cl.position.set(chestSpot.x, 2, chestSpot.z); scene.add(cl); }
    res.slice(2).forEach(function (ch, i) {
      var h = new T3.Group(); h.add(ch.root); scene.add(h); holders[i] = h; mons[i] = ch;
      var lab = K.label(TEAMS[i].name, TEAMS[i].c); lab.scale.multiplyScalar(.6); lab.position.y = ch.height + .35; h.add(lab);
    });
    placeAll(); loading.remove(); title(); K.start();
  }).catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
