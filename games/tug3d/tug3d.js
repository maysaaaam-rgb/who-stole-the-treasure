/* Tug of War 3D — English Adventure Academy
   Plays at Tug Meadow in Adventure Park (games/world, zone "tug").
   Knockout: Pink v Blue, Yellow v Green, then the two winners in the final.
   The two sides answer in turns: right = a strong pull (1 step), wrong = the other side gets a small pull (½ step).
   The match ends when the red ribbon crosses a side's line (3 steps). After 10 questions the side ahead wins.
   Options: ?teams=2..4  ?set=<id>  ?noworld  ?demo=1  ?capture=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 40, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) { return Object.assign({ score: 0, wins: 0, place: 0 }, t); });
  var QS = K.questions('g3-u5-vocab');
  var WIN = 3, STRONG = 1, SMALL = .5, MAX_Q = 10;

  /* ---------------- meadow, mud pit, lines ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0x8fdc7a);

  var field = new T3.Group(); scene.add(field);
  (function buildField() {
    // a light sandy strip under the rope
    var strip = new T3.Mesh(new T3.PlaneGeometry(26, 6), K.mat(0xf3e2b8)); strip.rotation.x = -Math.PI / 2; strip.position.y = .02; strip.receiveShadow = true; field.add(strip);
    // the mud pit in the middle
    var mudMat = new T3.MeshLambertMaterial({ color: 0x8a5a34 });
    var pit = new T3.Mesh(new T3.CircleGeometry(1, 48), mudMat); pit.rotation.x = -Math.PI / 2; pit.scale.set(1.5, 2.3, 1); pit.position.y = .035; pit.receiveShadow = true; field.add(pit);
    var rim = new T3.Mesh(new T3.TorusGeometry(1, .09, 8, 48), K.mat(0x6e4325)); rim.rotation.x = Math.PI / 2; rim.scale.set(1.5, 2.3, 1); rim.position.y = .05; field.add(rim);
    for (var b = 0; b < 7; b++) {
      var bub = new T3.Mesh(new T3.SphereGeometry(rnd(.06, .12), 10, 8), new T3.MeshLambertMaterial({ color: 0x9c6a42 }));
      bub.position.set(rnd(-1, 1), .05, rnd(-1.6, 1.6)); field.add(bub);
      (function (m, ph) { K.onFrame(function (dt, t) { var u = (t * .5 + ph) % 1; m.scale.setScalar(.4 + u); m.position.y = .04 + u * .04; m.visible = u < .92; }); })(bub, Math.random());
    }
    // team posts at both ends with flags (coloured per match)
    [-1, 1].forEach(function (s) {
      var post = new T3.Mesh(new T3.CylinderGeometry(.1, .12, 3.4, 10), K.mat(0xffffff)); post.position.set(s * 12.5, 1.7, 2.4); post.castShadow = true; field.add(post);
    });
  })();
  // win lines (one per side, in that side's colour) and the white centre line
  function groundLine(x, color, w) {
    var m = new T3.Mesh(new T3.PlaneGeometry(w || .22, 5.6), new T3.MeshBasicMaterial({ color: color })); m.rotation.x = -Math.PI / 2; m.position.set(x, .045, 0); field.add(m); return m;
  }
  var centreLine = groundLine(0, 0xffffff, .12);
  var sideLine = { '-1': groundLine(-WIN, 0xff5fa2, .3), '1': groundLine(WIN, 0x4f9dff, .3) };
  var sideFlag = {};
  [-1, 1].forEach(function (s) {
    var f = new T3.Mesh(new T3.PlaneGeometry(1.5, .9), new T3.MeshLambertMaterial({ color: 0xffffff, side: T3.DoubleSide }));
    f.geometry.translate(-s * .75, 0, 0); f.position.set(s * 12.5, 3, 2.4); field.add(f); sideFlag[s] = f;
    K.onFrame(function (dt, t) { f.rotation.y = Math.sin(t * 2.4 + s) * .3; });
  });

  /* ---------------- the rope ---------------- */
  var pos = 0, posShow = 0;            // where the ribbon is: <0 towards the left side, >0 towards the right
  var ROPE_Y = 1.0, ROPE_HALF = 8.2;
  var ropeMat = new T3.MeshLambertMaterial({ color: 0xd9b27c });
  var rope = new T3.Mesh(new T3.BufferGeometry(), ropeMat); rope.castShadow = true; scene.add(rope);
  var ribbon = new T3.Group(); scene.add(ribbon);
  (function () {
    var knot = new T3.Mesh(new T3.SphereGeometry(.14, 12, 10), K.mat(0xff3b3b)); ribbon.add(knot);
    var tail = new T3.Mesh(new T3.PlaneGeometry(.22, .9), new T3.MeshLambertMaterial({ color: 0xff3b3b, side: T3.DoubleSide })); tail.position.y = -.45; ribbon.add(tail);
    K.onFrame(function (dt, t) { tail.rotation.y = Math.sin(t * 5) * .4; });
  })();
  function ropeCurve(off, tension) {
    var pts = [], sag = .25 * (1 - tension);
    for (var i = 0; i <= 24; i++) { var u = i / 24, x = -ROPE_HALF + u * ROPE_HALF * 2; pts.push(V(x + off, ROPE_Y - Math.sin(u * Math.PI) * sag, 0)); }
    return new T3.CatmullRomCurve3(pts);
  }
  var tension = 0;
  K.onFrame(function (dt, t) {
    posShow = K.lerp(posShow, pos, 1 - Math.exp(-dt * 6));
    tension = K.lerp(tension, playing ? 1 : 0, dt * 3);
    var wob = playing ? Math.sin(t * 9) * .03 : 0;
    var off = posShow + wob;
    rope.geometry.dispose(); rope.geometry = new T3.TubeGeometry(ropeCurve(off, tension), 48, .06, 6, false);
    ribbon.position.set(off, ROPE_Y - .25 * (1 - tension), 0);
    sides.forEach(function (sd) { placeSide(sd, off); });
    var h = Math.abs(posShow) / WIN;
    [-1, 1].forEach(function (s) { sideLine[s].material.opacity = 1; sideLine[s].scale.x = 1 + (Math.sign(posShow) === s ? h * .8 + .25 * Math.sin(t * 8) * h : 0); });
  });

  /* ---------------- characters: each team = its monster + two kids ---------------- */
  var crews = [];          // one per team: { mon, kids:[..], all:[..] }
  var sides = [];          // the two crews pulling now: { crew, s, team }
  var playing = false;
  K.onFrame(function (dt) { crews.forEach(function (c) { c.all.forEach(function (ch) { ch.update(dt); }); }); });
  var SLOTS_X = [3.2, 4.25, 5.25];   // distance from the ribbon for monster, kid, kid
  function placeSide(sd, off) {
    sd.crew.all.forEach(function (ch, k) {
      if (ch.inMud) return;
      var h = ch.holder;
      h.position.x = off + sd.s * SLOTS_X[k] + (ch.step || 0) * sd.s;
      h.position.z = (k % 2 ? .45 : -.45) * (k ? 1 : 0);
      h.rotation.y = sd.s < 0 ? Math.PI / 2 : -Math.PI / 2;
      h.rotation.z = K.lerp(h.rotation.z, playing ? -sd.s * .22 * (ch.lean || 1) : 0, .1);
    });
  }
  // teams that are not pulling wait on the side and cheer
  function benchSpot(ti, k) { var order = benchOrder.indexOf(ti); return V(-((order - (benchOrder.length - 1) / 2) * 5 + (k - 1) * 1.3), 0, 5.6 + (k === 0 ? 0 : .6)); }
  var benchOrder = [];
  function toBench(ti) {
    if (benchOrder.indexOf(ti) < 0) benchOrder.push(ti);
    benchOrder.forEach(function (bi) {
      crews[bi].all.forEach(function (ch, k) { ch.inMud = false; var p = benchSpot(bi, k); ch.holder.position.copy(p); ch.holder.rotation.set(0, Math.PI, 0); ch.holder.visible = true; ch.setState('idle'); });
    });
  }
  function offBench(ti) { var i = benchOrder.indexOf(ti); if (i >= 0) benchOrder.splice(i, 1); benchOrder.forEach(function (bi) { crews[bi].all.forEach(function (ch, k) { ch.holder.position.copy(benchSpot(bi, k)); }); }); }
  function cheerBench() { benchOrder.forEach(function (bi) { var ch = crews[bi].all[(Math.random() * 3) | 0]; if (ch.state === 'idle') { ch.setState(Math.random() < .5 ? 'clap' : 'hop'); K.after(1.2, function () { if (ch.state !== 'cheer') ch.setState('idle'); }); } }); }

  /* ---------------- camera ---------------- */
  function shot(name, extra) {
    K.cam.follow = null;
    if (name === 'title') { K.cam.follow = function () { var a = K.now * .12; K.cam.tPos.set(Math.sin(a) * 5, 5.8, -16 - Math.cos(a) * 1.2); K.cam.tLook.set(0, 1.1, 1); }; K.cam.k = 1.5; }
    if (name === 'match') { K.cam.follow = function () { K.cam.tPos.set(posShow * .6, 4.4, -12.5); K.cam.tLook.set(posShow * .6, .9, .5); }; K.cam.k = 2.2; }
    if (name === 'side') { var x = posShow * .6 + extra * 1.6; K.cam.set(V(x, 3.3, -11.5), V(x, -1.0, 0), 2.6); }   // scene sits in the top half, above the question card
    if (name === 'mud') K.cam.set(V(posShow * .3, 3, -7.4), V(0, .4, 0), 2.6);
    if (name === 'podium') { K.cam.follow = function () { var a = Math.sin(K.now * .3) * .5; K.cam.tPos.set(a * 2, 3.4, -11); K.cam.tLook.set(0, 1.2, 1.5); }; K.cam.k = 2; }
  }

  /* ---------------- knockout bracket ---------------- */
  // matches: [left team index, right team index]; a "W1" means the winner of match 1, etc.
  var BRACKET = nTeams === 4 ? [[0, 1], [2, 3], ['W0', 'W1']] : nTeams === 3 ? [[0, 1], ['W0', 2]] : [[0, 1]];
  var results = [];   // winner index for each match
  function resolve(x) { return typeof x === 'string' ? results[+x.slice(1)] : x; }
  function roundName(mi) { return mi === BRACKET.length - 1 ? 'Final' : nTeams === 4 ? 'Semi-final ' + (mi + 1) : 'Match ' + (mi + 1); }
  function bracketHTML(current) {
    function slot(x) { var ti = resolve(x); if (ti == null) return '<span class="tg-slot">?</span>'; var t = TEAMS[ti]; return '<span class="tg-slot" style="--c:' + t.c + '">' + t.name + '</span>'; }
    return BRACKET.map(function (m, mi) {
      var w = results[mi], st = mi === current ? ' now' : w != null ? ' done' : '';
      return '<div class="tg-match' + st + '"><small>' + roundName(mi) + '</small>' + slot(m[0]) + '<i>v</i>' + slot(m[1]) + (w != null ? '<b style="--c:' + TEAMS[w].c + '">🏆 ' + TEAMS[w].name + '</b>' : '') + '</div>';
    }).join('');
  }

  /* ---------------- HUD: the rope meter ---------------- */
  var meter = null;
  function showMeter(L, R) {
    if (meter) meter.remove();
    meter = K.ui.add(K.el('div', 'tg-meter'));
    meter.innerHTML = '<span class="tg-side" style="--c:' + L.c + '">' + L.name + '</span><div class="tg-bar"><i class="tg-line l" style="--c:' + L.c + '"></i><i class="tg-mid"></i><i class="tg-line r" style="--c:' + R.c + '"></i><b class="tg-knot"></b></div><span class="tg-side" style="--c:' + R.c + '">' + R.name + '</span><em class="tg-q"></em>';
  }
  function refreshMeter(qLeft) {
    if (!meter) return;
    meter.querySelector('.tg-knot').style.left = (50 - pos / WIN * 42) + '%';
    meter.querySelector('.tg-q').textContent = qLeft + ' questions left';
  }

  /* ---------------- flow ---------------- */
  var phase = 'loading', matchNo = 0, demoTurn = 0, DEMO_WRONG = [2, 5, 9];
  function title() {
    phase = 'title'; shot('title'); K.cam.snap();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML = '<img class="logo" src="art/logo.png" alt="" onerror="this.remove()"><div class="say" style="--c:#ff5f5f;font-size:1.5rem">🪢 Answer right to PULL! Pull the red ribbon over your line!</div><div class="tg-bracket">' + bracketHTML(-1) + '</div>';
    var rows = K.el('div', 'rows'), go = K.el('button', 'btn green', '▶ Start');
    go.onclick = function () { K.audio(); K.loadSounds(['hello', 'correct', 'wrong', 'pull', 'splash', 'whistle', 'win', 'whoosh']); K.cls.assign(TEAMS); start(); };
    rows.appendChild(go); box.appendChild(rows); K.cls.setupRow(box, nTeams); K.ui.topButtons();
    crews.forEach(function (c, i) { K.after(.4 + i * .45, function () { if (phase === 'title') { c.mon.setState('hello'); K.after(1.3, function () { if (phase === 'title') c.mon.setState('idle'); }); } }); });
    if (K.DEMO) K.after(2.4, function () { go.onclick(); });
  }
  function start() { K.ui.clear(); K.ui.topButtons(); matchNo = 0; showBracket(); }
  function showBracket() {
    phase = 'bracket'; shot('title');
    var box = K.ui.add(K.el('div', 'endbox tg-bbox'));
    var m = BRACKET[matchNo], L = TEAMS[resolve(m[0])], R = TEAMS[resolve(m[1])];
    box.innerHTML = '<div class="say" style="--c:#ff5f5f">' + roundName(matchNo) + ': <b style="color:' + L.c + '">' + L.name + '</b> v <b style="color:' + R.c + '">' + R.name + '</b></div><div class="tg-bracket">' + bracketHTML(matchNo) + '</div>';
    var rows = K.el('div', 'rows'), go = K.el('button', 'btn green', '🪢 Pull!');
    go.onclick = function () { box.remove(); match(resolve(m[0]), resolve(m[1])); };
    rows.appendChild(go); box.appendChild(rows);
    K.say(roundName(matchNo) + '. ' + L.name + ' against ' + R.name + '!');
    if (K.DEMO) K.after(1.6, function () { go.onclick(); });
  }
  function match(li, ri) {
    phase = 'match'; pos = 0; posShow = 0;
    crews.forEach(function (c, i) { if (i !== li && i !== ri) toBench(i); });
    offBench(li); offBench(ri);
    sides = [{ crew: crews[li], s: 1, team: TEAMS[li], ti: li }, { crew: crews[ri], s: -1, team: TEAMS[ri], ti: ri }];   // the camera looks north, so +x is on the left of the screen
    sides.forEach(function (sd) {
      sd.crew.all.forEach(function (ch) { ch.inMud = false; ch.step = 0; ch.lean = 1; ch.holder.visible = true; ch.holder.position.y = 0; ch.setState('ready'); });
      sideLine[sd.s].material.color.set(sd.team.hex); sideFlag[sd.s].material.color.set(sd.team.hex);
    });
    placeSide(sides[0], 0); placeSide(sides[1], 0);
    showMeter(sides[0].team, sides[1].team); refreshMeter(MAX_Q);
    shot('match'); K.sfx('whistle'); K.ui.big('PULL!', 1.2, true); K.say('Ready, steady, pull!');
    playing = true;
    var asked = 0, turnSide = matchNo % 2;   // sides take turns; the first side changes every match
    function turn() {
      if (Math.abs(pos) >= WIN - 1e-6) return win(pos > 0 ? sides[0] : sides[1], 'line');
      if (asked >= MAX_Q) return win(pos === 0 ? null : (pos > 0 ? sides[0] : sides[1]), 'time');
      var sd = sides[turnSide], other = sides[1 - turnSide];
      phase = 'question'; shot('side', sd.s); demoTurn++; asked++;
      sd.crew.mon.setState('hello'); K.sfx('hello'); K.after(.8, function () { sd.crew.mon.setState('ready'); });
      K.ui.toast('Team ' + sd.team.name + ' · answer to PULL!', 1.6, sd.team.c);
      K.after(.9, function () {
        K.ui.ask(QS.next(), sd.team, { prompt: 'answer right to pull the rope!', demoRight: DEMO_WRONG.indexOf(demoTurn) < 0, onAnswer: function (ok) {
          shot('match');
          if (ok) { sd.team.score += 1; pull(sd, other, STRONG, true); }
          else { K.sfx('wrong'); K.ui.toast('Oops! Team ' + other.team.name + ' gets a little pull', 1.8, other.team.c); pull(other, sd, SMALL, false); }
          refreshMeter(MAX_Q - asked);
          turnSide = 1 - turnSide;
          K.after(2.2, turn);
        } });
      });
    }
    K.after(1.6, turn);
  }
  function pull(winSide, loseSide, amount, big) {
    phase = 'pull';
    var before = pos;
    pos = clamp(pos + winSide.s * amount, -WIN, WIN);
    K.sfx(big ? 'pull' : 'whoosh'); if (big) K.say('Pull!');
    winSide.crew.all.forEach(function (ch, k) { K.after(k * .08, function () { ch.setState('run'); ch.lean = big ? 1.7 : 1.3; K.after(.7, function () { if (!ch.inMud) { ch.setState('ready'); ch.lean = 1; } }); }); });
    loseSide.crew.all.forEach(function (ch, k) { K.after(k * .08, function () { ch.setState('stumble'); ch.lean = .4; K.after(.9, function () { if (!ch.inMud) { ch.setState('ready'); ch.lean = 1; } }); }); });
    var p = V(pos, ROPE_Y + .4, 0);
    K.fx.puff(V(before + loseSide.s * SLOTS_X[0], .2, 0), 5, { size: .6, color: 0xe9d3a8 });
    if (big) { K.fx.text('PULL!', p.clone().add(V(0, 1, 0)), winSide.team.c, 1.4); K.cam.shake(.15); }
    cheerBench();
  }
  function win(sd, how) {
    playing = false; phase = 'won';
    if (!sd) {   // a draw after all the questions: the side with more right answers wins, otherwise a coin flip
      var a = sides[0].team.score, b = sides[1].team.score; sd = a === b ? sides[(Math.random() * 2) | 0] : a > b ? sides[0] : sides[1];
    }
    var lose = sides[0] === sd ? sides[1] : sides[0];
    results[matchNo] = sd.ti; sd.team.wins++;
    K.sfx('whistle');
    if (how === 'time') K.ui.toast('⏱ Time! Team ' + sd.team.name + ' is ahead!', 2, sd.team.c);
    // the losing monster slides into the mud!
    var front = lose.crew.mon;
    K.after(.5, function () {
      shot('mud'); front.inMud = true; front.setState('tumble'); K.sfx('splash');
      var h = front.holder, from = h.position.clone(), t0 = K.now;
      var fn = K.onFrame(function () {
        var u = Math.min(1, (K.now - t0) / .7);
        h.position.set(K.lerp(from.x, 0, u), Math.sin(u * Math.PI) * .9 - u * .35, K.lerp(from.z, -.3, u));
        h.rotation.z += .2;
        if (u >= 1) { K.offFrame(fn); h.rotation.set(0, 0, 0); front.setState('dizzy'); K.fx.puff(V(0, .3, 0), 14, { color: 0x8a5a34, size: 1.1, life: 1.1, opacity: .9 }); K.fx.burst(V(0, .4, 0), [0x8a5a34, 0x6e4325], 16, 5); K.cam.shake(.3); }
      });
      lose.crew.kids.forEach(function (k) { k.setState('sad'); });
      sd.crew.all.forEach(function (ch) { ch.setState('cheer'); });
      K.fx.confetti(V(sd.s * 5, 3, 0), 120);
      K.ui.big('Team ' + sd.team.name + ' wins!', 2, true); K.say('Team ' + sd.team.name + ' wins!');
    });
    K.after(3.8, function () {
      if (meter) { meter.remove(); meter = null; }
      lose.crew.all.forEach(function (ch) { ch.inMud = false; });
      lose.team.place = matchNo === BRACKET.length - 1 ? 2 : 1;   // final loser = 2nd place, everyone else who went out = 3rd
      matchNo++;
      if (matchNo >= BRACKET.length) return finish(sd.ti);
      toBench(sides[0].ti); toBench(sides[1].ti); sides = [];
      showBracket();
    });
  }

  function finish(champ) {
    phase = 'end'; window.__k3phase = 'end';
    // ranking for the points card: champion first, finalist second, the others share third
    TEAMS.forEach(function (t, i) { t.rank = i === champ ? 100 : t.place * 10; });
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) { return TEAMS[b].rank - TEAMS[a].rank; });
    benchOrder = []; sides = [];
    order.forEach(function (ti, k) {
      crews[ti].all.forEach(function (ch, j) {
        ch.inMud = false; ch.holder.visible = j === 0; ch.holder.rotation.set(0, Math.PI, 0);
        ch.holder.position.set(-(k - (order.length - 1) / 2) * 2.4, k === 0 ? .5 : 0, k === 0 ? 1.6 : .4);
        ch.setState(k === 0 ? 'cheer' : 'clap');
      });
    });
    var pod = new T3.Mesh(new T3.CylinderGeometry(1.1, 1.2, .5, 32), K.mat(0xffd84a)); pod.position.set((order.length - 1) / 2 * 2.4, .25, 1.6); pod.castShadow = true; scene.add(pod);
    rope.visible = ribbon.visible = false;
    shot('podium'); K.sfx('win'); K.fx.confetti(V(0, 5, -1), 240);
    var C = TEAMS[champ];
    K.ui.big('🏆 Team ' + C.name + '!', 2.4, true); K.say('Team ' + C.name + ' is the tug of war champion!');
    K.after(2.6, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      box.innerHTML = '<div class="say" style="--c:' + C.c + '">🏆 Champion: Team ' + C.name + '</div><div class="tg-bracket">' + bracketHTML(-1) + '</div>';
      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn', '↻ Play again'); again.onclick = function () { location.href = location.pathname + (nTeams !== 4 ? '?teams=' + nTeams : ''); };
      var back = K.el('button', 'btn soft', '🏠 Games'); back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again); rows.appendChild(back); box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'tug3d', title: 'Tug of War 3D', scoreOf: function (t) { return t.rank; } });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Getting the rope ready…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'tug', clear: true }).catch(function (e) { console.warn('world', e); K.world.ground(0x8fdc7a); return null; }) : Promise.resolve(null);
  var jobs = [worldP];
  TEAMS.forEach(function (t) {
    jobs.push(K.makeCharacter(t, { monHeight: 1.5, kidHeight: 1.4 }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: 'girl', kidHeight: 1.3 }).catch(function () { return null; }));
    jobs.push(K.makeCharacter(t, { kidsOnly: true, kid: 'boy', kidHeight: 1.25 }).catch(function () { return null; }));
  });
  Promise.all(jobs).then(function (res) {
    TEAMS.forEach(function (t, i) {
      var list = res.slice(1 + i * 3, 4 + i * 3).filter(Boolean), crew = { mon: list[0], kids: list.slice(1), all: list };
      list.forEach(function (ch, k) {
        var h = new T3.Group(); h.add(ch.root); scene.add(h); ch.holder = h;
        if (k === 0) { var lab = K.label(t.name, t.c); lab.scale.multiplyScalar(.7); lab.position.y = ch.height + .45; h.add(lab); }
      });
      crews.push(crew);
    });
    crews.forEach(function (c, i) { toBench(i); });
    loading.remove(); title(); K.start();
  }).catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
