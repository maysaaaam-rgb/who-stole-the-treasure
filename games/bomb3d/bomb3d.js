/* Bomb or Bonus 3D — English Adventure Academy
   Plays on a gift-box stage at the Funfair in Adventure Park (games/world).
   Answer right, then pick one of 12 numbered gift boxes. Inside: points, Swap, Steal, Double … or a silly bomb (−5).
   Mode "Keep it or Give it": before the box opens, the team decides to keep it or give it to another team.
   Options: ?mode=keepgive  ?teams=2..4  ?set=<id>  ?noworld  ?demo=1  ?capture=1 */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var rnd = K.rnd, clamp = K.clamp, V = function (x, y, z) { return new T3.Vector3(x, y, z); };
  var IN_WORLD = !!K.World && !K.Q.has('noworld');
  K.init({ fov: 42, fogNear: 80, fogFar: 240 });
  var scene = K.scene;

  var nTeams = clamp(+K.Q.get('teams') || 4, 2, 4);
  var MODE = K.Q.get('mode') === 'keepgive' ? 'keepgive' : 'classic';
  var TEAMS = K.TEAMS.slice(0, nTeams).map(function (t) { return Object.assign({ score: 0 }, t); });
  var QS = K.questions('g3-u5-vocab');

  /* ---------------- what is inside the 12 boxes ---------------- */
  var KINDS = {
    bomb:   { icon: '💣', text: 'BOMB! −5', say: 'Oh no, a bomb! Minus five!', color: '#ff5f5f' },
    p5:     { icon: '⭐', text: '+5', say: 'Plus five!', color: '#ffd84a', pts: 5 },
    p10:    { icon: '⭐', text: '+10', say: 'Plus ten!', color: '#ffd84a', pts: 10 },
    p20:    { icon: '🌟', text: '+20', say: 'Plus twenty! Wow!', color: '#ffb320', pts: 20 },
    swap:   { icon: '🔄', text: 'SWAP!', say: 'Swap!', color: '#9b7bff' },
    steal:  { icon: '🦊', text: 'STEAL 5!', say: 'Steal five!', color: '#4f9dff' },
    double: { icon: '✖️2', text: 'DOUBLE!', say: 'Double!', color: '#2fc58a' }
  };
  var CONTENTS = K.shuffle(['bomb', 'bomb', 'bomb', 'bomb', 'p5', 'p5', 'p10', 'p10', 'p20', 'swap', 'steal', 'double']);

  /* ---------------- world + stage ---------------- */
  K.world.sky(0x78c4ff, 0xc8eaff, 0xfff0e0);
  K.world.lights();
  K.world.clouds(14, -80, 80);
  if (!IN_WORLD) K.world.ground(0xf3e2b8);

  var STAGE_Z = -2.6, STAGE_R = 7.2, STAGE_H = .45;
  var SLOTS = [];   // 3 rising rows of 4 boxes: 1-4 at the back (highest), 9-12 at the front
  [[STAGE_Z - 2.0, STAGE_H + .9], [STAGE_Z - .3, STAGE_H + .45], [STAGE_Z + 1.4, STAGE_H]].forEach(function (row) {
    [-3.3, -1.1, 1.1, 3.3].forEach(function (x) { SLOTS.push({ x: x, y: row[1], z: row[0] }); });
  });
  (function buildStage() {
    var stripes = K.canvasTex(512, 64, function (c, w, h) { for (var i = 0; i < 16; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#ff6fae'; c.fillRect(i * w / 16, 0, w / 16 + 1, h); } });
    stripes.wrapS = T3.RepeatWrapping; stripes.repeat.set(3, 1);
    var top = K.mat(0xfff3d6), side = new T3.MeshLambertMaterial({ map: stripes });
    var base = new T3.Mesh(new T3.CylinderGeometry(STAGE_R, STAGE_R + .15, STAGE_H, 64, 1, false), [side, top, top]);
    base.position.set(0, STAGE_H / 2, STAGE_Z); base.receiveShadow = true; base.castShadow = true; scene.add(base);
    // two rising steps at the back for the box rows
    [[STAGE_H + .225, STAGE_Z - 1.15, 3.4], [STAGE_H + .675, STAGE_Z - 2.0, 1.7]].forEach(function (s) {   // [centre y, centre z, depth]
      var st = new T3.Mesh(new T3.BoxGeometry(9.8, .45, s[2]), [side, side, top, top, side, side]);
      st.position.set(0, s[0], s[1]); st.receiveShadow = true; st.castShadow = true; scene.add(st);
    });
    // a sign arch behind the stage
    var post = K.mat(0xffffff);
    [-5.4, 5.4].forEach(function (x) { var p = new T3.Mesh(new T3.CylinderGeometry(.16, .2, 5.6, 16), post); p.position.set(x, 2.8, STAGE_Z - 4.4); p.castShadow = true; scene.add(p);
      var ball = new T3.Mesh(new T3.SphereGeometry(.34, 20, 14), K.mat(0xffd84a)); ball.position.set(x, 5.75, STAGE_Z - 4.4); scene.add(ball); });
    var sign = K.canvasTex(1024, 220, function (c, w, h) {
      K.roundRect(c, 6, 6, w - 12, h - 12, 60); c.fillStyle = '#ffffff'; c.fill(); c.lineWidth = 12; c.strokeStyle = '#ff6fae'; c.stroke();
      c.font = '900 118px Trebuchet MS'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 18; c.strokeStyle = '#2b1d40'; c.strokeText('BOMB or BONUS', w / 2, h / 2 + 6);
      var g = c.createLinearGradient(0, 40, 0, 180); g.addColorStop(0, '#ffd84a'); g.addColorStop(1, '#ff9f38'); c.fillStyle = g; c.fillText('BOMB or BONUS', w / 2, h / 2 + 6);
    });
    var sm = new T3.Mesh(new T3.PlaneGeometry(10, 2.15), new T3.MeshBasicMaterial({ map: sign, transparent: true }));
    sm.position.set(0, 4.75, STAGE_Z - 4.35); scene.add(sm);
    // bunting from the sign to the front corners
    var flagCols = [0xff6fae, 0x4f9dff, 0xffb320, 0x2fc58a];
    [-1, 1].forEach(function (s) {
      var a = V(s * 5.4, 5.3, STAGE_Z - 4.4), b = V(s * 7.6, 3.2, STAGE_Z + 5.5);
      for (var i = 0; i <= 12; i++) {
        var u = i / 12, p = a.clone().lerp(b, u); p.y -= Math.sin(u * Math.PI) * .9;
        var f = new T3.Mesh(new T3.ConeGeometry(.22, .5, 3), K.mat(flagCols[i % 4])); f.rotation.x = Math.PI; f.position.copy(p).add(V(0, -.25, 0)); scene.add(f);
      }
    });
  })();

  /* ---------------- the 12 gift boxes ---------------- */
  var boxes = [], pickMode = false;
  var giftProto = null, bombProto = null;
  function iconTag(kind) {
    var k = KINDS[kind];
    var tex = K.canvasTex(256, 128, function (c, w, h) {
      K.roundRect(c, 6, 10, w - 12, h - 20, 40); c.fillStyle = 'rgba(255,255,255,.92)'; c.fill(); c.lineWidth = 8; c.strokeStyle = k.color; c.stroke();
      c.font = '900 58px Trebuchet MS'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2b1d40';
      c.fillText(kind === 'bomb' ? '💣' : kind === 'swap' ? '🔄' : kind === 'steal' ? '🦊' : kind === 'double' ? '×2' : k.text, w / 2, h / 2 + 4);
    });
    var s = new T3.Sprite(new T3.SpriteMaterial({ map: tex, transparent: true, opacity: .9 })); s.scale.set(1.0, .5, 1); return s;
  }
  function fallbackGift(hue) {
    var g = new T3.Group(), col = [0xff8fb8, 0x8fc3ff, 0xffd166, 0x7ee0b0][hue % 4];
    var b = new T3.Mesh(new T3.BoxGeometry(.9, .75, .9), K.mat(col)); b.position.y = .375; g.add(b);
    var lid = new T3.Mesh(new T3.BoxGeometry(1, .2, 1), K.mat(0xfff3d6)); lid.position.y = .85; g.add(lid);
    var r1 = new T3.Mesh(new T3.BoxGeometry(.18, .97, 1.02), K.mat(0xffd84a)); r1.position.y = .48; g.add(r1);
    var r2 = new T3.Mesh(new T3.BoxGeometry(1.02, .97, .18), K.mat(0xffd84a)); r2.position.y = .48; g.add(r2);
    return g;
  }
  function tintGift(model, i) {   // keep Gemini's box, but give each one a team colour so the stage is colourful
    var cols = [0xff8fb8, 0x8fc3ff, 0xffd166, 0x7ee0b0];
    model.traverse(function (o) {
      if (!o.isMesh || !o.material) return;
      o.material = o.material.clone();
      if (o.material.color) { var hsl = {}; o.material.color.getHSL(hsl); if (hsl.h > .85 || hsl.h < .05) o.material.color.lerp(new T3.Color(cols[i % 4]), .75); }
      o.castShadow = true;
    });
  }
  function buildBoxes() {
    SLOTS.forEach(function (s, i) {
      var holder = new T3.Group(); holder.position.set(s.x, s.y, s.z); scene.add(holder);
      var ped = new T3.Mesh(new T3.CylinderGeometry(.62, .7, .14, 32), K.mat(0xffffff)); ped.position.y = .07; ped.receiveShadow = true; holder.add(ped);
      var model;
      if (giftProto) { model = giftProto.clone(true); K.fitModel(model, 1.0); tintGift(model, i); }
      else model = fallbackGift(i);
      var spin = new T3.Group(); spin.position.y = .14; spin.add(model); holder.add(spin);
      // a big invisible "touch area" round each box, so small fingers can't miss it
      var hit = new T3.Mesh(new T3.BoxGeometry(1.9, 2.0, 1.9), new T3.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      hit.position.y = .9; holder.add(hit);
      var glow = new T3.Mesh(new T3.RingGeometry(.72, .95, 40), new T3.MeshBasicMaterial({ color: 0xffd84a, transparent: true, opacity: 0, side: T3.DoubleSide, depthWrite: false }));
      glow.rotation.x = -Math.PI / 2; glow.position.y = .16; holder.add(glow);
      var box = { i: i, n: i + 1, kind: CONTENTS[i], holder: holder, spin: spin, model: model, hit: hit, glow: glow, open: false, ph: rnd(0, 6), shake: 0 };
      hit.userData.box = box;
      boxes.push(box);
    });
  }
  K.onFrame(function (dt, t) {
    boxes.forEach(function (b) {
      if (b.open) return;
      var hot = b.hot ? 1 : 0;
      b.spin.position.y = .14 + Math.abs(Math.sin(t * 2 + b.ph)) * (.06 + hot * .14);
      b.spin.rotation.y = Math.sin(t * .8 + b.ph) * .25;
      if (b.shake > 0) { b.spin.rotation.z = Math.sin(t * 40) * .12 * Math.min(1, b.shake); b.spin.rotation.x = Math.cos(t * 33) * .08 * Math.min(1, b.shake); }
      else { b.spin.rotation.z = 0; b.spin.rotation.x = 0; }
      b.glow.material.opacity = hot ? .9 : (pickMode ? .35 + .2 * Math.sin(t * 4 + b.ph) : 0);
      b.spin.scale.setScalar(1 + hot * .12);
    });
  });

  /* ---------------- team monsters in front of the stage ---------------- */
  var chars = [];
  function homeSpot(i) { return V((i - (nTeams - 1) / 2) * 2.7, 0, 5.4); }
  K.onFrame(function (dt) { chars.forEach(function (c) { c.update(dt); }); });

  /* ---------------- camera ---------------- */
  function shot(name, extra) {
    K.cam.follow = null;
    if (name === 'title') { K.cam.follow = function () { var a = K.now * .12; K.cam.tPos.set(Math.sin(a) * 4, 6.2, 15.5 + Math.cos(a) * 1.2); K.cam.tLook.set(0, 1.6, -2); }; K.cam.k = 1.5; }
    if (name === 'stage') K.cam.set(V(0, 6.9, 15.6), V(0, 1.8, -2.5), 2.5);
    if (name === 'pick') K.cam.set(V(0, 4.9, 9.7), V(0, 1.5, -2.7), 2.5);
    if (name === 'team') { var p = chars[extra].holder.position; K.cam.set(V(p.x * .7, 2.6, p.z + 6.2), V(p.x, 1.1, p.z - 1), 2.8); }
    if (name === 'box') { var h = extra.holder.position; K.cam.set(V(h.x * .8, h.y + 2.3, h.z + 4.6), V(h.x, h.y + .7, h.z), 3); }
    if (name === 'podium') { K.cam.follow = function () { var a = Math.sin(K.now * .3) * .5; K.cam.tPos.set(a * 2, 3.1, 12.5); K.cam.tLook.set(0, 1.3, 4); }; K.cam.k = 2; }
  }

  /* ---------------- flow ---------------- */
  var hud, active = 0, phase = 'loading', demoTurn = 0, DEMO_WRONG = [3, 8];
  function opened() { return boxes.filter(function (b) { return b.open; }).length; }
  function title() {
    phase = 'title'; shot('title'); K.cam.snap();
    var box = K.ui.add(K.el('div', 'endbox'));
    box.innerHTML = '<img class="logo" src="art/logo.png" alt="" onerror="this.remove()"><div class="say" style="--c:#ff6fae;font-size:1.5rem">🎁 Answer right, pick a gift box… points or a silly BOMB?</div>';
    var modes = K.el('div', 'clspick');
    [['classic', '🎁 Bomb or Bonus'], ['keepgive', '🎀 Keep it or Give it']].forEach(function (m) {
      var b = K.el('button', 'clsbtn' + (MODE === m[0] ? ' on' : ''), m[1]);
      b.onclick = function () { MODE = m[0]; Array.prototype.forEach.call(modes.children, function (x) { x.classList.toggle('on', x === b); }); };
      modes.appendChild(b);
    });
    box.appendChild(modes);
    var rows = K.el('div', 'rows'), go = K.el('button', 'btn green', '▶ Start');
    go.onclick = function () { K.audio(); K.loadSounds(['hello', 'correct', 'wrong', 'pop', 'boom', 'fuse', 'win', 'whoosh']); K.cls.assign(TEAMS); start(); };
    rows.appendChild(go); box.appendChild(rows); K.cls.setupRow(box, nTeams); K.ui.topButtons();
    chars.forEach(function (c, i) { K.after(.4 + i * .45, function () { if (phase === 'title') { c.setState('hello'); K.after(1.3, function () { if (phase === 'title') c.setState('idle'); }); } }); });
    if (K.DEMO) K.after(2.4, function () { go.onclick(); });
  }
  function start() {
    K.ui.clear(); K.ui.topButtons();
    hud = K.ui.teamBar(TEAMS, function (t) { return t.score + ' ⭐'; }); hud.refresh(-1);
    phase = 'intro'; K.sfx('whoosh'); shot('stage');
    K.ui.toast(MODE === 'keepgive' ? '🎀 Keep it or Give it!' : '🎁 12 boxes · 4 bombs inside!', 2.4, '#ff6fae');
    K.after(2.4, function () { active = 0; turn(); });
  }
  function turn() {
    phase = 'turn'; hud.refresh(active);
    var ch = chars[active], team = TEAMS[active];
    shot('team', active); ch.setState('hello'); K.sfx('hello');
    K.ui.toast('Team ' + team.name + ' · ' + (12 - opened()) + ' boxes left', 1.8, team.c);
    K.after(1.1, function () {
      ch.setState('idle'); phase = 'question'; demoTurn++;
      K.ui.ask(QS.next(), team, { prompt: 'answer right to pick a box!', demoRight: DEMO_WRONG.indexOf(demoTurn) < 0, onAnswer: function (ok) {
        if (!ok) return noPick(ch, team);
        ch.setState('cheer'); K.after(.9, function () { ch.setState('idle'); pick(team); });
      } });
    });
  }
  function noPick(ch, team) {
    phase = 'oops'; ch.setState('sad'); K.sfx('wrong');
    K.ui.big('No box!', 1.3, true); K.say('No box this time.');
    K.ui.toast('Wrong answer — no box for Team ' + team.name, 2.2, team.c);
    K.after(2.4, next);
  }

  /* ---- pick a box: tap the 3D box or its number ---- */
  var ray = new T3.Raycaster(), mouse = new T3.Vector2();
  function pick(team) {
    phase = 'pick'; shot('pick'); K.say('Pick a box!'); pickMode = true;
    var hint = K.ui.add(K.el('div', 'hint', '👆 Team ' + team.name + ': tap a gift box!')); hint.style.setProperty('--c', team.c);
    var done = false, canvas = K.renderer.domElement, hover = null;
    function boxAt(e) {
      var r = canvas.getBoundingClientRect(); mouse.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(mouse, K.camera);
      var hits = ray.intersectObjects(boxes.filter(function (b) { return !b.open; }).map(function (b) { return b.hit; }), false);
      return hits.length ? hits[0].object.userData.box : null;
    }
    function onMove(e) { var b = boxAt(e); if (hover && hover !== b) hover.hot = false; hover = b; if (b) b.hot = true; canvas.style.cursor = b ? 'pointer' : ''; }
    function onTap(e) { var b = boxAt(e); if (b) choose(b); }
    canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerdown', onTap);
    function choose(b) {
      if (done || b.open) return; done = true; pickMode = false;
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerdown', onTap); canvas.style.cursor = '';
      hint.remove(); boxes.forEach(function (x) { x.hot = false; });
      K.sfx('pop'); b.hot = true;
      K.after(.35, function () { b.hot = false; decideOwner(team, b); });
    }
    if (K.DEMO) K.after(1.2, function () { var left = boxes.filter(function (b) { return !b.open; }); choose(left[(Math.random() * left.length) | 0]); });
  }

  /* ---- Keep it or Give it: decide BEFORE the box opens ---- */
  function decideOwner(team, b) {
    if (MODE !== 'keepgive') return openBox(b, team, team, false);
    phase = 'keepgive'; shot('box', b); b.shake = .35; K.say('Keep it, or give it?');
    var giver = team;
    var choices = [{ label: '🎁 Keep it', value: -1, color: team.c }].concat(TEAMS.filter(function (t) { return t !== team; }).map(function (t) {
      return { label: '➡️ Give to ' + t.name, value: TEAMS.indexOf(t), color: t.c };
    }));
    K.ui.choose('Keep this box, or give it away?', choices, { color: team.c, demo: function () { return Math.random() < .5 ? -1 : TEAMS.indexOf(TEAMS.filter(function (t) { return t !== team; })[0]); } }).then(function (v) {
      b.shake = 0;
      var owner = v < 0 ? team : TEAMS[v];
      if (v >= 0) { K.ui.toast('Team ' + team.name + ' gives the box to Team ' + owner.name + '!', 2, owner.c); chars[v].setState('shrug'); }
      openBox(b, owner, giver, v >= 0);
    });
  }

  /* ---- open the box with a little drama ---- */
  function openBox(b, owner, giver, given) {
    phase = 'open'; shot('box', b);
    b.shake = 1; K.sfx('fuse');
    K.after(1.3, function () {
      b.shake = 0; b.open = true; K.sfx('pop');
      var top = b.holder.position.clone().add(V(0, .9, 0));
      K.fx.confetti(top.clone(), b.kind === 'bomb' ? 20 : 90);
      K.fx.puff(top.clone(), 6, { color: 0xffffff, size: .8 });
      b.spin.visible = false; b.glow.visible = false;
      if (b.kind === 'bomb') return bomb(b, owner);
      reveal(b, owner, giver, given);
    });
  }
  function leaveIcon(b) { var ic = iconTag(b.kind); ic.position.set(0, .75, 0); b.holder.add(ic); }
  function bomb(b, owner) {
    var oi = TEAMS.indexOf(owner), ch = chars[oi];
    var bm = bombProto ? bombProto.clone(true) : new T3.Mesh(new T3.SphereGeometry(.45, 24, 16), K.mat(0x3a3a48));
    if (bombProto) K.fitModel(bm, .95); else bm.position.y = .45;
    var g = new T3.Group(); g.add(bm); g.position.copy(b.holder.position).add(V(0, .2, 0)); scene.add(g);
    var t0 = K.now, fn = K.onFrame(function (dt, t) { var u = K.now - t0; g.scale.setScalar(1 + u * .25 + .06 * Math.sin(u * 30)); g.position.y = b.holder.position.y + .2 + Math.abs(Math.sin(u * 9)) * .12; if (Math.random() < .5) K.fx.burst(g.position.clone().add(V(.15, 1.0, 0)), [0xffd84a, 0xff9f38], 1, 2.5); });
    K.ui.big('💣', 1.0, true); K.say(KINDS.bomb.say);
    K.after(1.1, function () {
      K.offFrame(fn); scene.remove(g);
      K.sfx('boom'); K.cam.shake(.5);
      var p = b.holder.position.clone().add(V(0, .7, 0));
      K.fx.puff(p.clone(), 16, { color: 0x6b6b78, size: 1.6, life: 1.4, opacity: .75 });
      K.fx.ring(p.clone(), 0xff9f38, 6); K.fx.burst(p.clone(), [0x3a3a48, 0xffd84a, 0xff6f3c], 18, 7);
      var lost = Math.min(5, owner.score); owner.score -= lost;
      if (lost) K.fx.text('−' + lost, p.clone().add(V(0, 1, 0)), '#ff5f5f', 1.8);
      K.ui.big(lost ? 'BOOM! −' + lost : 'BOOM!', 1.6, true);
      ch.setState('dizzy'); var stars = K.dizzyStars(ch.holder, ch.height + .3);
      shot('team', oi); hud.refresh(active); hud.bump(oi);
      leaveIcon(b);
      K.after(2.6, function () { stars.remove(); ch.setState('idle'); next(); });
    });
  }
  function reveal(b, owner, giver, given) {
    var k = KINDS[b.kind], oi = TEAMS.indexOf(owner), ch = chars[oi];
    var p = b.holder.position.clone().add(V(0, 1.1, 0));
    K.sfx('correct'); K.fx.ring(p.clone(), new T3.Color(k.color).getHex(), 4); K.say(k.say);
    leaveIcon(b);
    if (k.pts) {
      owner.score += k.pts; K.fx.text(k.text, p.clone(), k.color, 1.8); K.ui.big(k.text, 1.4, true);
      return reward(oi, ch);
    }
    if (b.kind === 'double') {
      var add = clamp(owner.score, 5, 30); owner.score += add;
      K.fx.text('×2', p.clone(), k.color, 1.8); K.ui.big('DOUBLE! +' + add, 1.6, true);
      return reward(oi, ch);
    }
    // swap / steal: given boxes act against the team that gave them; kept boxes let the team choose
    K.fx.text(k.icon, p.clone(), k.color, 1.8); K.ui.big(k.text, 1.3, true);
    var others = TEAMS.filter(function (t) { return t !== owner; });
    var target = given ? Promise.resolve(giver) : K.ui.choose(
      b.kind === 'swap' ? 'Swap scores with which team?' : 'Steal 5 points from which team?',
      others.map(function (t) { return { label: t.name + ' (' + t.score + ')', value: TEAMS.indexOf(t), color: t.c }; }),
      { color: owner.c, demo: function () { return TEAMS.indexOf(others.slice().sort(function (a, c) { return c.score - a.score; })[0]); } }
    ).then(function (v) { return TEAMS[v]; });
    target.then(function (t) {
      var ti = TEAMS.indexOf(t);
      if (b.kind === 'swap') {
        var s = owner.score; owner.score = t.score; t.score = s; K.sfx('whoosh');
        K.ui.toast('🔄 ' + owner.name + ' and ' + t.name + ' swap scores!', 2.2, k.color);
        chars[ti].setState('hop'); K.after(.8, function () { chars[ti].setState('idle'); });
      } else {
        var take = Math.min(5, t.score); t.score -= take; owner.score += take; K.sfx('whoosh');
        K.ui.toast('🦊 ' + owner.name + ' steals ' + take + ' from ' + t.name + '!', 2.2, k.color);
        chars[ti].setState('sad'); K.after(1.6, function () { chars[ti].setState('idle'); });
        hud.bump(ti);
      }
      reward(oi, ch);
    });
  }
  function reward(oi, ch) {
    shot('team', oi); ch.setState('cheer'); hud.refresh(active); hud.bump(oi);
    K.fx.confetti(ch.holder.position.clone().add(V(0, 2.2, 0)), 70);
    K.after(2.6, function () { ch.setState('idle'); next(); });
  }
  function next() {
    hud.refresh(-1);
    if (opened() >= boxes.length) return finish();
    active = (active + 1) % TEAMS.length;
    turn();
  }

  function finish() {
    phase = 'end'; window.__k3phase = 'end'; hud.refresh(-1);
    var best = Math.max.apply(null, TEAMS.map(function (t) { return t.score; }));
    var winners = TEAMS.filter(function (t) { return t.score === best; });
    var order = TEAMS.map(function (t, i) { return i; }).sort(function (a, b) { return TEAMS[b].score - TEAMS[a].score; });
    order.forEach(function (ti, k) {
      var ch = chars[ti], win = TEAMS[ti].score === best;
      K.fx.puff(ch.holder.position.clone().setY(.3), 8, { size: 1 });
      ch.holder.position.set((k - (TEAMS.length - 1) / 2) * 2.2, win ? STAGE_H : 0, win ? 3.3 : 5.2);
      ch.setState(win ? 'cheer' : 'clap');
    });
    shot('podium'); K.sfx('win');
    K.fx.confetti(V(0, 5, 2), 240);
    var names = winners.map(function (t) { return t.name; }).join(' & ');
    K.ui.big(winners.length > 1 ? names + ' tie!' : names + ' wins!', 2.4, true);
    K.say(winners.length > 1 ? 'It is a tie!' : 'Team ' + names + ' wins!');
    K.after(2.6, function () {
      var box = K.ui.add(K.el('div', 'endbox'));
      box.innerHTML = '<div class="say" style="--c:' + winners[0].c + '">🏆 ' + order.map(function (i) { return TEAMS[i].name + ' ' + TEAMS[i].score; }).join(' · ') + '</div>';
      var rows = K.el('div', 'rows');
      var again = K.el('button', 'btn', '↻ Play again'); again.onclick = function () { location.href = location.pathname + (MODE === 'keepgive' ? '?mode=keepgive' : ''); };
      var back = K.el('button', 'btn soft', '🏠 Games'); back.onclick = function () { location.href = '../index.html'; };
      rows.appendChild(again); rows.appendChild(back); box.appendChild(rows);
      K.cls.pointsPanel(box, TEAMS, { game: 'bomb3d', title: MODE === 'keepgive' ? 'Keep it or Give it 3D' : 'Bomb or Bonus 3D' });
    });
  }

  /* ---------------- boot ---------------- */
  var loading = K.ui.add(K.el('div', 'loading', '<span>Wrapping the gift boxes…</span>'));
  var worldP = IN_WORLD ? K.World.load({ zone: 'fair', skip: ['carousel', 'picnic-table', 'hot-air-balloon'] }).catch(function (e) { console.warn('world', e); K.world.ground(0xf3e2b8); return null; }) : Promise.resolve(null);
  var giftP = K.tryGLB(K.ROOT + 'assets/3d/items/gift-box.glb').then(function (g) { if (g) giftProto = g.scene; });
  var bombP = K.tryGLB(K.ROOT + 'assets/3d/items/cartoon-bomb.glb').then(function (g) { if (g) bombProto = g.scene; });
  Promise.all([worldP, giftP, bombP].concat(TEAMS.map(function (t) { return K.makeCharacter(t, { monHeight: 1.35, kidHeight: 1.45 }); })))
    .then(function (res) {
      buildBoxes();
      res.slice(3).forEach(function (ch, i) {
        var h = new T3.Group(); h.add(ch.root); scene.add(h); ch.holder = h; h.position.copy(homeSpot(i)); chars.push(ch);
        var ring = new T3.Mesh(new T3.RingGeometry(.55, .72, 32), new T3.MeshBasicMaterial({ color: TEAMS[i].hex })); ring.rotation.x = -Math.PI / 2; ring.position.copy(homeSpot(i)).setY(.035); scene.add(ring);
        var lab = K.label(TEAMS[i].name, TEAMS[i].c); lab.scale.multiplyScalar(.7); lab.position.y = ch.height + .45; h.add(lab);
      });
      loading.remove(); title(); K.start();
    })
    .catch(function (e) { loading.innerHTML = '<span>Could not load 😢<br><small>' + e.message + '</small></span>'; console.error(e); });
})();
