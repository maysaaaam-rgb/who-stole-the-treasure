/* Practice Island — the walking world (test: one beach). Built on Phaser (island/lib).
   The monster walks, bumps, pushes and splashes; Lulu needs 3 shells to light her lamp. Nothing is saved and no pupil data is touched.
   URL options: ?color=pink  ?stage=baby  ?crowd=8 (more monsters walking, to test speed)  ?fps=1 */
(function (root) {
  'use strict';

  var Q = new URLSearchParams(root.location.search);
  var WORLD_W = 2400, WORLD_H = 1500, CELL = 40, SPEED = 250, SHALLOW = 110, FRAME = 256;
  var LINES = {
    hello: ['Oh no! My light went out!', 'The ships cannot see. I need 3 magic shells.', 'Shake the tree. Push the box. Look in the water!'],
    wait: ['Please find 3 shells!', 'Shake the tree. Push the box. Look in the water!'],
    thanks: ['You found the shells! Thank you!', 'One more thing. Which one is the pineapple?'],
    done: 'Hooray! The light is back! Thank you, friend!',
    again: 'Hello again, friend! Look at my light!',
    shell: 'A shell!',
    wrong: 'Not that one! Try again.'
  };
  var CARDS = ['w_moon', 'w_pineapple', 'w_potatoes'];

  var A = function () { return root.IslandAudio || {}; };
  var $ = function (id) { return document.getElementById(id); };
  var S = { shells: 0, stage: 'start', talking: false, joy: { x: 0, y: 0 }, path: [], target: null, onArrive: null };
  var scene = null;

  function say(t, done) { if (A().speak) A().speak(t, done); else if (done) done(); }
  function sound(n) { if (A()[n]) { try { A()[n](); } catch (e) { /* no sound */ } } }

  /* ---------- the shape of the beach ---------- */
  function shore(x) { return 380 + 70 * Math.sin(x / 420) + 30 * Math.sin(x / 150 + 1); }
  function isDeep(x, y) { return y < shore(x) - SHALLOW; }
  function inShallows(x, y) { return y < shore(x) - 6 && !isDeep(x, y); }

  function paintGround(sc) {
    var scale = 2, w = WORLD_W / scale, h = WORLD_H / scale;
    var tex = sc.textures.createCanvas('ground', w, h), c = tex.context, x, i;
    var sand = c.createLinearGradient(0, 120, 0, h);
    sand.addColorStop(0, '#f7dfa3'); sand.addColorStop(1, '#eec983');
    c.fillStyle = sand; c.fillRect(0, 0, w, h);
    for (i = 0; i < 2600; i++) { c.fillStyle = i % 3 ? 'rgba(180,130,70,.13)' : 'rgba(255,255,255,.22)'; c.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); }
    // soft dunes and grass, so the sand has shape
    for (i = 0; i < 16; i++) { var gx = Math.random() * w, gy = 250 + Math.random() * (h - 250), g = c.createRadialGradient(gx, gy, 4, gx, gy, 60 + Math.random() * 70); g.addColorStop(0, 'rgba(255,240,195,.55)'); g.addColorStop(1, 'rgba(255,240,195,0)'); c.fillStyle = g; c.fillRect(gx - 140, gy - 140, 280, 280); }
    [[60, 700, 210, 110], [300, 755, 240, 80], [1140, 720, 200, 110], [980, 760, 170, 60]].forEach(function (p) {
      var gr = c.createRadialGradient(p[0], p[1], 10, p[0], p[1], p[2]); gr.addColorStop(0, '#7ccf5f'); gr.addColorStop(.72, '#5fb84c'); gr.addColorStop(.78, 'rgba(95,184,76,0)');
      c.save(); c.translate(p[0], p[1]); c.scale(1, p[3] / p[2]); c.translate(-p[0], -p[1]); c.fillStyle = gr; c.beginPath(); c.arc(p[0], p[1], p[2], 0, 7); c.fill(); c.restore();
    });
    var line = function (off) { c.beginPath(); c.moveTo(0, 0); for (x = 0; x <= w; x += 4) c.lineTo(x, (shore(x * scale) + off) / scale); c.lineTo(w, 0); c.closePath(); };
    line(26); c.fillStyle = 'rgba(160,115,70,.33)'; c.fill();              // wet sand
    line(0); c.fillStyle = '#58d6e2'; c.fill();                            // shallow water
    line(-SHALLOW * .55); c.fillStyle = '#2fb9d6'; c.fill();
    line(-SHALLOW); var sea = c.createLinearGradient(0, 0, 0, 200); sea.addColorStop(0, '#0f6fb0'); sea.addColorStop(1, '#1b98c9'); c.fillStyle = sea; c.fill();
    for (i = 0; i < 90; i++) { var wx = Math.random() * w, wy = Math.random() * ((shore(wx * scale) - SHALLOW) / scale); c.strokeStyle = 'rgba(255,255,255,.2)'; c.lineWidth = 2; c.beginPath(); c.moveTo(wx, wy); c.quadraticCurveTo(wx + 12, wy - 5, wx + 24, wy); c.stroke(); }
    tex.refresh();
    sc.add.image(0, 0, 'ground').setOrigin(0).setScale(scale).setDepth(-20);

    var fTex = sc.textures.createCanvas('foam', w, 240), f = fTex.context;
    f.strokeStyle = 'rgba(255,255,255,.92)'; f.lineWidth = 7; f.lineCap = 'round'; f.beginPath();
    for (x = 0; x <= w; x += 4) { var fy = (shore(x * scale) - 2) / scale; if (x === 0) f.moveTo(x, fy); else f.lineTo(x, fy); } f.stroke();
    f.strokeStyle = 'rgba(255,255,255,.4)'; f.lineWidth = 3; f.beginPath();
    for (x = 0; x <= w; x += 4) { var fz = (shore(x * scale) - 40) / scale; if (x === 0) f.moveTo(x, fz); else f.lineTo(x, fz); } f.stroke();
    fTex.refresh();
    var foam = sc.add.image(0, 0, 'foam').setOrigin(0).setScale(scale).setDepth(-19);
    sc.tweens.add({ targets: foam, y: 14, duration: 1900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    sc.tweens.add({ targets: foam, alpha: .65, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  function makeSmallTextures(sc) {
    var t = sc.textures.createCanvas('dot', 24, 24), c = t.context, g = c.createRadialGradient(12, 12, 1, 12, 12, 12);
    g.addColorStop(0, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 24, 24); t.refresh();
    var k = sc.textures.createCanvas('crate', 120, 120); c = k.context;
    c.fillStyle = '#b9793d'; c.fillRect(6, 6, 108, 108); c.strokeStyle = '#6f4316'; c.lineWidth = 7; c.strokeRect(6, 6, 108, 108);
    c.lineWidth = 6; c.beginPath(); c.moveTo(10, 10); c.lineTo(110, 110); c.moveTo(110, 10); c.lineTo(10, 110); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(12, 12, 96, 16); k.refresh();
    var n = sc.textures.createCanvas('coconut', 48, 48); c = n.context;
    g = c.createRadialGradient(18, 15, 2, 24, 24, 22); g.addColorStop(0, '#a56a35'); g.addColorStop(1, '#4e2c12'); c.fillStyle = g; c.beginPath(); c.arc(24, 24, 20, 0, 7); c.fill(); n.refresh();
    var s = sc.textures.createCanvas('shadow', 100, 40); c = s.context;
    g = c.createRadialGradient(50, 20, 2, 50, 20, 48); g.addColorStop(0, 'rgba(60,35,10,.5)'); g.addColorStop(1, 'rgba(60,35,10,0)');
    c.save(); c.scale(1, .4); c.fillStyle = g; c.beginPath(); c.arc(50, 50, 48, 0, 7); c.fill(); c.restore(); s.refresh();
  }

  /* ---------- your monster as ready-made pictures, so many can walk at once on a phone ---------- */
  function loadImg(url) { return new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = url; }); }
  async function bakeMonster(sc, key, opts) {
    var markup = root.MonsterRenderer.renderMonsterSVG({ stage: opts.stage, color: opts.color, equipped: opts.equipped || {}, size: FRAME, animated: false, isAvatar: true });
    var base = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
    ['.monster-pedestal-stage', '.mon-rig-shadow'].forEach(function (q) { var el = base.querySelector(q); if (el) el.remove(); });
    // the two feet are drawn in one group: split them so they can step
    var feet = base.querySelector('.plush-feet');
    if (feet && feet.children.length >= 10) {
      var kids = [].slice.call(feet.children), half = kids.length / 2, NS = 'http://www.w3.org/2000/svg';
      var l = document.createElementNS(NS, 'g'), r = document.createElementNS(NS, 'g');
      l.setAttribute('class', 'foot-l'); r.setAttribute('class', 'foot-r');
      kids.forEach(function (k, i) { (i < half ? l : r).appendChild(k); });
      feet.appendChild(l); feet.appendChild(r);
    }
    var poses = [
      { bob: 0 },
      { bob: -3, l: -7, armL: 14, armR: 14 },
      { bob: 0 },
      { bob: -3, r: -7, armL: -14, armR: -14 },
      { bob: 0 },
      { bob: -2, armL: 150, armR: -150 }
    ];
    var canvas = document.createElement('canvas'); canvas.width = FRAME * poses.length; canvas.height = FRAME;
    var c = canvas.getContext('2d'), ser = new XMLSerializer();
    for (var i = 0; i < poses.length; i++) {
      var p = poses[i], svg = base.cloneNode(true);
      var set = function (q, tr, css) { [].forEach.call(svg.querySelectorAll(q), function (el) { if (css) el.style.transform = tr; else el.setAttribute('transform', tr); }); };
      set('.monster-bob-group', 'translate(0 ' + p.bob + ')');
      if (p.l) set('.foot-l', 'translate(0 ' + p.l + ')');
      if (p.r) set('.foot-r', 'translate(0 ' + p.r + ')');
      if (p.armL) set('.mon-arm-l', 'rotate(' + p.armL + 'deg)', true);
      if (p.armR) set('.mon-arm-r', 'rotate(' + p.armR + 'deg)', true);
      svg.setAttribute('width', FRAME); svg.setAttribute('height', FRAME);
      var url = URL.createObjectURL(new Blob([ser.serializeToString(svg)], { type: 'image/svg+xml' }));
      var img = await loadImg(url);
      c.drawImage(img, FRAME * i, 0, FRAME, FRAME);
      URL.revokeObjectURL(url);
    }
    var tex = sc.textures.addCanvas(key, canvas);
    poses.forEach(function (_, n) { tex.add(n, 0, FRAME * n, 0, FRAME, FRAME); });
    sc.anims.create({ key: key + '-walk', frames: [1, 2, 3, 4].map(function (f) { return { key: key, frame: f }; }), frameRate: 9, repeat: -1 });
  }
  function makeWalker(sc, key, x, y, scale) {
    var shadow = sc.add.image(x, y, 'shadow').setScale(scale * 1.15).setDepth(-5);
    var m = sc.physics.add.sprite(x, y, key, 0).setOrigin(.5, .84).setScale(scale);
    m.body.setCircle(44, FRAME / 2 - 44, FRAME * .84 - 44);
    m.setCollideWorldBounds(true);
    m.monKey = key; m.shadow = shadow;
    return m;
  }

  /* ---------- finding the way ---------- */
  function buildGrid(sc) {
    var cols = Math.ceil(WORLD_W / CELL), rows = Math.ceil(WORLD_H / CELL), g = [];
    for (var r = 0; r < rows; r++) { g[r] = []; for (var c = 0; c < cols; c++) g[r][c] = isDeep(c * CELL + CELL / 2, r * CELL + CELL / 2) ? 1 : 0; }
    sc.solids.forEach(function (z) {
      var pad = 26, x0 = Math.floor((z.x - z.width / 2 - pad) / CELL), x1 = Math.floor((z.x + z.width / 2 + pad) / CELL), y0 = Math.floor((z.y - z.height / 2 - pad) / CELL), y1 = Math.floor((z.y + z.height / 2 + pad) / CELL);
      for (var r2 = Math.max(0, y0); r2 <= Math.min(rows - 1, y1); r2++) for (var c2 = Math.max(0, x0); c2 <= Math.min(cols - 1, x1); c2++) g[r2][c2] = 1;
    });
    return { g: g, cols: cols, rows: rows };
  }
  function nearestFree(G, c, r) {
    if (G.g[r] && G.g[r][c] === 0) return [c, r];
    for (var d = 1; d < 14; d++) for (var dy = -d; dy <= d; dy++) for (var dx = -d; dx <= d; dx++) { if (G.g[r + dy] && G.g[r + dy][c + dx] === 0) return [c + dx, r + dy]; }
    return null;
  }
  function findPath(G, sx, sy, tx, ty) {
    var clampC = function (v) { return Math.max(0, Math.min(G.cols - 1, Math.floor(v / CELL))); }, clampR = function (v) { return Math.max(0, Math.min(G.rows - 1, Math.floor(v / CELL))); };
    var a = nearestFree(G, clampC(sx), clampR(sy)), b = nearestFree(G, clampC(tx), clampR(ty));
    if (!a || !b) return [];
    var id = function (c, r) { return r * G.cols + c; }, came = {}, cost = {}, open = [[0, a[0], a[1]]], start = id(a[0], a[1]), goal = id(b[0], b[1]);
    cost[start] = 0;
    while (open.length) {
      var best = 0; for (var o = 1; o < open.length; o++) if (open[o][0] < open[best][0]) best = o;
      var cur = open.splice(best, 1)[0], cid = id(cur[1], cur[2]);
      if (cid === goal) break;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nc = cur[1] + dx, nr = cur[2] + dy;
        if (!G.g[nr] || G.g[nr][nc] !== 0) continue;
        if (dx && dy && (G.g[cur[2]][nc] !== 0 || G.g[nr][cur[1]] !== 0)) continue;
        var nid = id(nc, nr), nCost = cost[cid] + (dx && dy ? 1.414 : 1);
        if (cost[nid] === undefined || nCost < cost[nid]) { cost[nid] = nCost; came[nid] = cid; open.push([nCost + Math.abs(nc - b[0]) + Math.abs(nr - b[1]), nc, nr]); }
      }
    }
    if (cost[goal] === undefined) return [];
    var out = [], step = goal;
    while (step !== start) { out.unshift({ x: (step % G.cols) * CELL + CELL / 2, y: Math.floor(step / G.cols) * CELL + CELL / 2 }); step = came[step]; }
    return out.filter(function (_, i) { return i % 2 === 1 || i === out.length - 1; });
  }

  /* ---------- talking ---------- */
  function showLines(lines, onDone) {
    S.talking = true; stopWalking();
    var i = 0;
    function draw() {
      $('w-talk').classList.add('on');
      $('w-line').innerHTML = '<b>Lulu</b>' + lines[i];
      say(lines[i]);
      $('w-next').style.display = '';
      $('w-next').onclick = function () {
        sound('playTap'); i++;
        if (i < lines.length) draw();
        else { $('w-talk').classList.remove('on'); S.talking = false; if (A().stopSpeech) A().stopSpeech(); if (onDone) onDone(); }
      };
    }
    draw();
  }
  function showCards() {
    S.talking = true;
    $('w-talk').classList.add('on');
    $('w-next').style.display = 'none';
    var box = $('w-cards');
    box.innerHTML = CARDS.map(function (n) { return '<button type="button" class="w-card" data-c="' + n + '"><img src="art/z2/' + n + '.webp" alt=""></button>'; }).join('');
    box.classList.add('on');
    [].forEach.call(box.children, function (b) {
      b.onclick = function () {
        if (b.getAttribute('data-c') === 'w_pineapple') {
          box.classList.remove('on'); box.innerHTML = '';
          $('w-talk').classList.remove('on'); S.talking = false;
          lightUp();
        } else {
          sound('playSoftFail'); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
          $('w-line').innerHTML = '<b>Lulu</b>' + LINES.wrong; say(LINES.wrong);
        }
      };
    });
  }
  function setGoal() {
    var pics = ''; for (var i = 0; i < 3; i++) pics += '<img class="' + (i < S.shells ? 'on' : '') + '" src="art/o_shell.webp" alt="">';
    var text = S.stage === 'start' ? 'Talk to Lulu!' : S.stage === 'hunt' ? 'Find the shells' : S.stage === 'back' ? 'Go back to Lulu!' : '🌟 The light is back!';
    $('w-goal').innerHTML = text + (S.stage === 'hunt' || S.stage === 'back' ? '<span id="w-shells">' + pics + '</span>' : '');
  }

  /* ---------- moments ---------- */
  function cheer(m, ms) {
    m.anims.stop(); m.setFrame(5); m.cheering = true;
    scene.tweens.add({ targets: m, scaleY: m.scaleY * .88, scaleX: m.scaleX * 1.08, duration: 110, yoyo: true, repeat: 1 });
    scene.time.delayedCall(ms || 900, function () { m.cheering = false; m.setFrame(0); });
  }
  function pickShell(sh) {
    if (sh.taken) return;
    sh.taken = true; S.shells++;
    sound('playCorrect'); say(LINES.shell); cheer(scene.player);
    scene.fx.explode(14, sh.x, sh.y);
    scene.tweens.add({ targets: sh, y: sh.y - 90, scale: sh.scale * 1.5, alpha: 0, duration: 650, ease: 'Cubic.out', onComplete: function () { sh.destroy(); } });
    if (S.shells >= 3) S.stage = 'back';
    setGoal();
  }
  function talkToLulu() {
    var lulu = scene.lulu;
    scene.tweens.add({ targets: lulu, y: lulu.y - 26, duration: 170, yoyo: true, ease: 'Quad.out' });
    if (S.stage === 'start') showLines(LINES.hello, function () { S.stage = 'hunt'; setGoal(); });
    else if (S.stage === 'hunt') showLines(LINES.wait);
    else if (S.stage === 'back') showLines(LINES.thanks.slice(0, 1), function () { $('w-talk').classList.add('on'); $('w-line').innerHTML = '<b>Lulu</b>' + LINES.thanks[1]; say(LINES.thanks[1]); showCards(); });
    else showLines([LINES.again]);
  }
  function lightUp() {
    var sc = scene, l = sc.lighthouse;
    S.stage = 'done'; setGoal();
    sound('playFanfare'); say(LINES.done);
    S.talking = true;
    sc.cameras.main.stopFollow();
    sc.cameras.main.pan(l.x, l.y - 150, 900, 'Sine.easeInOut', false, function (cam, p) {
      if (p !== 1) return;
      l.setTexture('light_on');
      sc.beam.setVisible(true).setAlpha(0);
      sc.tweens.add({ targets: sc.beam, alpha: .7, duration: 500 });
      sc.tweens.add({ targets: sc.beam, angle: 235, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.party.explode(70, l.x, l.y - 300);
      sc.cameras.main.shake(260, .004);
      sc.time.delayedCall(2400, function () {
        cheer(sc.player, 1500);
        sc.cameras.main.startFollow(sc.player, true, .1, .1);
        S.talking = false;
      });
    });
  }
  function shakePalm(p) {
    var sc = scene;
    if (p.shaking) return;
    p.shaking = true;
    sound('playPop');
    sc.tweens.add({ targets: p, angle: { from: -6, to: 6 }, duration: 90, yoyo: true, repeat: 3, onComplete: function () { p.angle = 0; p.shaking = false; } });
    var drop = function (key, scale, tx, ty, then) {
      var d = sc.add.image(p.x + (tx > p.x ? 26 : -26), p.y - 280, key).setScale(scale).setDepth(ty + 1);
      sc.tweens.add({ targets: d, x: tx, duration: 750 });
      sc.tweens.add({ targets: d, y: ty, duration: 750, ease: 'Bounce.out', onComplete: function () { if (then) then(d); } });
      return d;
    };
    if (p.hasShell && S.stage === 'hunt') {
      p.hasShell = false;
      drop('shell', .17, p.x + 90, p.y + 42, function (d) { d.isShell = true; sc.shells.push(d); });
    } else {
      drop('coconut', .8, p.x - 70 + Math.random() * 140, p.y + 40, function (d) { sc.tweens.add({ targets: d, alpha: 0, delay: 1500, duration: 400, onComplete: function () { d.destroy(); } }); });
    }
  }

  /* ---------- walking orders ---------- */
  function stopWalking() { S.path = []; S.onArrive = null; if (scene && scene.player) scene.player.setVelocity(0); }
  function walkTo(x, y, onArrive) {
    var sc = scene, m = sc.player;
    S.path = findPath(sc.grid, m.x, m.y, x, y);
    S.onArrive = onArrive || null;
    S.stuck = 0;
    if (!S.path.length && onArrive) { S.onArrive = null; onArrive(); }
    if (S.marker) { S.marker.setPosition(x, y).setAlpha(.8).setScale(.2); sc.tweens.add({ targets: S.marker, scale: .05, alpha: 0, duration: 500 }); }
  }
  function onTap(ptr) {
    var sc = scene;
    if (S.talking) return;
    var x = ptr.worldX, y = ptr.worldY, m = sc.player;
    var near = function (o, r) { return Phaser.Math.Distance.Between(o.x, o.y - 40, x, y) < r; };
    if (near(sc.lulu, 90)) { walkTo(sc.lulu.x - 90, sc.lulu.y + 40, talkToLulu); return; }
    for (var i = 0; i < sc.palms.length; i++) {
      var p = sc.palms[i];
      if (Math.abs(x - p.x) < 110 && y < p.y + 30 && y > p.y - 340) { walkTo(p.x + 70, p.y + 46, function (pp) { return function () { shakePalm(pp); }; }(p)); return; }
    }
    walkTo(x, y);
    void m;
  }

  function setupJoystick() {
    if (!(('ontouchstart' in root) || navigator.maxTouchPoints > 0)) return;
    document.body.classList.add('touch');
    var pad = $('w-joy'), knob = $('w-knob'), R = 50, active = null;
    var move = function (e) {
      var r = pad.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), len = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(1, len / R);
      S.joy.x = dx / len * k; S.joy.y = dy / len * k;
      knob.style.transform = 'translate(' + S.joy.x * R + 'px,' + S.joy.y * R + 'px)';
    };
    pad.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); active = e.pointerId; pad.setPointerCapture(e.pointerId); stopWalking(); move(e); });
    pad.addEventListener('pointermove', function (e) { if (e.pointerId === active) move(e); });
    var end = function () { active = null; S.joy.x = S.joy.y = 0; knob.style.transform = ''; };
    pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end);
  }

  /* ---------- the scene ---------- */
  var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function WorldScene() { Phaser.Scene.call(this, { key: 'world' }); },
    preload: function () {
      this.load.image('palm', 'art/d_palm.webp');
      this.load.image('hut', 'art/d_hut.webp');
      this.load.image('umbrella', 'art/d_umbrella.webp');
      this.load.image('ball', 'art/d_ball.webp');
      this.load.image('shell', 'art/o_shell.webp');
      this.load.image('lulu', 'art/z2/c_lulu.webp');
      this.load.image('light_off', 'art/z2/o_lighthouse_off.webp');
      this.load.image('light_on', 'art/z2/o_lighthouse_on.webp');
      this.load.image('boat', 'art/z2/o_boat.webp');
      this.load.image('fish', 'art/z2/o_fish.webp');
    },
    create: function () {
      var sc = this; scene = sc;
      sc.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
      makeSmallTextures(sc);
      paintGround(sc);
      sc.solids = [];
      sc.solidGroup = sc.physics.add.staticGroup();
      var solid = function (x, y, w, h) { var z = sc.add.zone(x, y, w, h); sc.physics.add.existing(z, true); sc.solidGroup.add(z); sc.solids.push(z); return z; };
      var deco = function (key, x, y, height, solidW, solidH) {
        var img = sc.add.image(x, y, key).setOrigin(.5, .96); img.setScale(height / img.height); img.setDepth(y);
        sc.add.image(x, y, 'shadow').setScale(Math.max(1, (solidW || 60) / 45)).setDepth(-6);
        if (solidW) solid(x, y - 4, solidW, solidH || 30);
        return img;
      };
      sc.palms = [[330, 760], [640, 1190], [1190, 700], [1560, 1260], [2230, 1130], [130, 1320]].map(function (p) { return deco('palm', p[0], p[1], 400, 46, 26); });
      sc.palms[2].hasShell = true;
      deco('hut', 760, 690, 340, 210, 50);
      deco('umbrella', 1270, 1110, 260, 26, 20);
      sc.lighthouse = deco('light_off', 2040, 560, 500, 130, 60);
      sc.lulu = sc.add.image(1810, 700, 'lulu').setOrigin(.5, .92).setScale(.42).setDepth(700);
      sc.add.image(1810, 700, 'shadow').setScale(1.8).setDepth(-6);
      solid(1810, 696, 90, 34);
      sc.tweens.add({ targets: sc.lulu, scaleY: .44, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.help = sc.add.text(1810, 560, '❗', { fontSize: '46px' }).setOrigin(.5).setDepth(5000);
      sc.tweens.add({ targets: sc.help, y: 540, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      // the lamp's beam: it starts at the lamp and sweeps over the sea
      var bTex = sc.textures.createCanvas('beam', 500, 1100), bc = bTex.context, bg = bc.createLinearGradient(0, 0, 0, 1100);
      bg.addColorStop(0, 'rgba(255,244,190,.95)'); bg.addColorStop(1, 'rgba(255,244,190,0)');
      bc.fillStyle = bg; bc.beginPath(); bc.moveTo(250, 0); bc.lineTo(500, 1100); bc.lineTo(0, 1100); bc.closePath(); bc.fill(); bTex.refresh();
      sc.beam = sc.add.image(2040, 172, 'beam').setOrigin(.5, 0).setDepth(561).setAlpha(0).setVisible(false).setAngle(130);
      sc.beam.setBlendMode(Phaser.BlendModes.ADD);

      var boat = sc.add.image(1000, 120, 'boat').setScale(.55).setDepth(-15);
      sc.tweens.add({ targets: boat, angle: { from: -3, to: 3 }, y: 132, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      var fish = sc.add.image(0, 0, 'fish').setScale(.26).setDepth(-14).setVisible(false);
      sc.time.addEvent({ delay: 3400, loop: true, callback: function () {
        var x = 200 + Math.random() * 1900, y = shore(x) - SHALLOW - 40 - Math.random() * 100;
        fish.setPosition(x, y).setVisible(true).setFlipX(Math.random() < .5).setAngle(-30);
        sc.tweens.add({ targets: fish, y: y - 90, duration: 420, yoyo: true, ease: 'Quad.out', onComplete: function () { fish.setVisible(false); if (sc.waterFx) sc.waterFx.explode(10, x, y); } });
        sc.tweens.add({ targets: fish, angle: 30, duration: 840 });
      } });

      // things that move
      sc.crate = sc.physics.add.image(1500, 930, 'crate').setScale(.92).setDepth(930);
      sc.crate.setDrag(1400).setCollideWorldBounds(true).setMass(3).setBounce(.1);
      sc.ball = sc.physics.add.image(1050, 1010, 'ball').setScale(.17).setDepth(1010);
      sc.ball.body.setCircle(250, 6, 6); sc.ball.setDrag(170).setBounce(.8).setCollideWorldBounds(true).setMass(.4);
      sc.ballShadow = sc.add.image(1050, 1010, 'shadow').setScale(1).setDepth(-6);
      sc.crateShadow = sc.add.image(1500, 985, 'shadow').setScale(2.3).setDepth(-6);

      // the shells: under the box, in the water; the third falls from a palm tree
      sc.shells = [];
      var s1 = sc.add.image(1500, 945, 'shell').setScale(.17).setDepth(900); s1.isShell = true; s1.underCrate = true; sc.shells.push(s1);
      var s2 = sc.add.image(420, shore(420) - 62, 'shell').setScale(.17).setDepth(-12); s2.isShell = true; sc.shells.push(s2);
      sc.tweens.add({ targets: s2, y: s2.y - 8, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

      sc.fx = sc.add.particles(0, 0, 'dot', { speed: { min: 60, max: 240 }, lifespan: 600, scale: { start: .8, end: 0 }, tint: [0xfde047, 0xffffff, 0xf472b6], emitting: false }).setDepth(5000);
      sc.party = sc.add.particles(0, 0, 'dot', { speed: { min: 140, max: 520 }, angle: { min: 200, max: 340 }, gravityY: 420, lifespan: 1500, scale: { start: 1, end: .2 }, tint: [0xfde047, 0x38bdf8, 0xf43f5e, 0x10b981, 0xa855f7], emitting: false }).setDepth(5000);
      sc.dust = sc.add.particles(0, 0, 'dot', { speed: { min: 8, max: 34 }, angle: { min: 200, max: 340 }, lifespan: 420, scale: { start: .55, end: 0 }, alpha: { start: .55, end: 0 }, tint: 0xe6c88e, emitting: false }).setDepth(-4);
      sc.waterFx = sc.add.particles(0, 0, 'dot', { speed: { min: 30, max: 120 }, angle: { min: 210, max: 330 }, gravityY: 240, lifespan: 480, scale: { start: .6, end: 0 }, tint: [0xffffff, 0xa5f3fc], emitting: false }).setDepth(-3);

      sc.grid = buildGrid(sc);
      S.marker = sc.add.image(0, 0, 'dot').setDepth(-2).setAlpha(0);

      setupJoystick();
      sc.keys = sc.input.keyboard ? sc.input.keyboard.createCursorKeys() : null;
      sc.wasd = sc.input.keyboard ? sc.input.keyboard.addKeys('W,A,S,D') : null;
      sc.input.on('pointerdown', onTap);

      var opts = { stage: Q.get('stage') || 'adventurer', color: Q.get('color') || 'blue' };
      var crowd = Math.max(0, Math.min(30, Number(Q.get('crowd')) || 2));
      var colors = ['pink', 'gold', 'green', 'purple', 'orange'];
      var t0 = performance.now();
      sc.walkers = [];
      (async function () {
        await bakeMonster(sc, 'me', opts);
        var used = {};
        for (var i = 0; i < Math.min(crowd, colors.length); i++) { await bakeMonster(sc, 'c' + i, { stage: ['baby', 'growing', 'adventurer', 'advanced', 'ultimate'][i % 5], color: colors[i] }); used[i] = 1; }
        S.bakeMs = Math.round(performance.now() - t0);
        sc.player = makeWalker(sc, 'me', 1520, 1120, .68);
        sc.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
        sc.cameras.main.startFollow(sc.player, true, .1, .1);
        var fit = function () { var w = sc.scale.width, h = sc.scale.height; sc.cameras.main.setZoom(Math.max(w / WORLD_W, h / WORLD_H, .7, Math.min(1.25, Math.min(w / 1050, h / 640)))); };
        fit(); sc.scale.on('resize', fit);
        var movers = [sc.crate, sc.ball];
        sc.physics.add.collider(sc.player, sc.solidGroup);
        sc.physics.add.collider(sc.player, sc.crate);
        sc.physics.add.collider(sc.crate, sc.solidGroup);
        sc.physics.add.collider(sc.ball, sc.solidGroup);
        sc.physics.add.collider(sc.ball, sc.crate);
        sc.physics.add.collider(sc.player, sc.ball, function () {
          var dx = sc.ball.x - sc.player.x, dy = sc.ball.y - sc.player.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
          sc.ball.setVelocity(dx / len * 620, dy / len * 620);
          sound('playHop');
        });
        for (var k = 0; k < crowd; k++) {
          var w = makeWalker(sc, 'c' + (k % Math.min(crowd, colors.length)), 300 + Math.random() * 1800, 800 + Math.random() * 550, .56);
          w.wander = { x: w.x, y: w.y, wait: Math.random() * 2000 };
          sc.physics.add.collider(w, sc.solidGroup);
          sc.physics.add.collider(w, sc.ball);
          sc.walkers.push(w);
        }
        void movers;
        setGoal();
        $('w-load').style.display = 'none';
        S.ready = true;
      })().catch(function (e) { $('w-load').innerHTML = '😢 The monster could not load.<small>' + String(e && e.message || e).slice(0, 120) + '</small>'; S.error = String(e); });

      if (Q.get('fps')) $('w-fps').style.display = 'block';
    },
    update: function (time, delta) {
      var sc = this, m = sc.player;
      if (Q.get('fps') && time % 500 < delta) $('w-fps').textContent = Math.round(sc.game.loop.actualFps) + ' fps';
      if (!m) return;

      // orders: joystick, then keys, then the tapped path
      var vx = 0, vy = 0, K = sc.keys, W = sc.wasd;
      if (!S.talking) {
        if (S.joy.x || S.joy.y) { vx = S.joy.x; vy = S.joy.y; }
        else if (K && W) {
          vx = ((K.right.isDown || W.D.isDown) ? 1 : 0) - ((K.left.isDown || W.A.isDown) ? 1 : 0);
          vy = ((K.down.isDown || W.S.isDown) ? 1 : 0) - ((K.up.isDown || W.W.isDown) ? 1 : 0);
          if (vx || vy) { var l0 = Math.sqrt(vx * vx + vy * vy); vx /= l0; vy /= l0; S.path = []; S.onArrive = null; }
        }
        if (!vx && !vy && S.path.length) {
          var n = S.path[0], dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 24) {
            S.path.shift(); S.stuck = 0;
            if (!S.path.length && S.onArrive) { var cb = S.onArrive; S.onArrive = null; cb(); }
          } else {
            vx = dx / d; vy = dy / d;
            var moved = Math.abs(m.body.velocity.x) + Math.abs(m.body.velocity.y);
            if (moved < 30) S.stuck = (S.stuck || 0) + delta; else S.stuck = 0;
            if (S.stuck > 900) { S.path = []; S.onArrive = null; S.stuck = 0; vx = vy = 0; }
          }
        }
      }
      var wet = inShallows(m.x, m.y), speed = SPEED * (wet ? .68 : 1);
      m.setVelocity(vx * speed, vy * speed);
      keepDry(m);
      var moving = !!(vx || vy);
      if (moving && !m.cheering) {
        if (!m.anims.isPlaying) m.play('me-walk');
        if (vx) m.setFlipX(vx < 0);
        S.dustAt = (S.dustAt || 0) + delta;
        if (S.dustAt > (wet ? 150 : 190)) { S.dustAt = 0; (wet ? sc.waterFx : sc.dust).explode(wet ? 5 : 2, m.x, m.y + 4); }
      } else if (!m.cheering && m.anims.isPlaying) { m.anims.stop(); m.setFrame(0); }
      m.setDepth(m.y); m.shadow.setPosition(m.x, m.y + 2);

      // the wanderers
      sc.walkers.forEach(function (w) {
        var a = w.wander;
        if (a.wait > 0) { a.wait -= delta; w.setVelocity(0); if (w.anims.isPlaying) { w.anims.stop(); w.setFrame(0); } }
        else {
          var ddx = a.x - w.x, ddy = a.y - w.y, dd = Math.sqrt(ddx * ddx + ddy * ddy);
          a.life = (a.life || 0) + delta;
          if (dd < 20 || a.life > 6000) { a.wait = 800 + Math.random() * 2600; a.life = 0; a.x = 150 + Math.random() * 2100; a.y = 780 + Math.random() * 620; }
          else { w.setVelocity(ddx / dd * 120, ddy / dd * 120); w.setFlipX(ddx < 0); if (!w.anims.isPlaying) w.play(w.monKey + '-walk'); }
        }
        keepDry(w); w.setDepth(w.y); w.shadow.setPosition(w.x, w.y + 2);
      });

      // the box and the ball
      keepDry(sc.crate); keepDry(sc.ball);
      sc.crate.setDepth(sc.crate.y + 54); sc.crateShadow.setPosition(sc.crate.x, sc.crate.y + 54);
      sc.ball.setDepth(sc.ball.y + 40); sc.ball.rotation += sc.ball.body.velocity.x * delta * .00002; sc.ballShadow.setPosition(sc.ball.x, sc.ball.y + 42);

      // picking up shells
      if (S.stage === 'hunt') {
        for (var i = sc.shells.length - 1; i >= 0; i--) {
          var sh = sc.shells[i];
          if (sh.taken) { sc.shells.splice(i, 1); continue; }
          if (sh.underCrate && Phaser.Math.Distance.Between(sc.crate.x, sc.crate.y, sh.x, sh.y) < 92) continue;
          if (Phaser.Math.Distance.Between(m.x, m.y, sh.x, sh.y) < 66) pickShell(sh);
        }
      }
      if (sc.help) sc.help.setVisible(S.stage === 'start' || S.stage === 'back');
    }
  });

  function keepDry(o) {
    var limit = shore(o.x) - SHALLOW;
    if (o.y < limit) { o.y = limit; if (o.body) { if (o.body.velocity.y < 0) o.body.velocity.y = Math.abs(o.body.velocity.y) * .4; } }
  }

  $('w-back').onclick = function () { root.location.href = 'index.html?demo=1'; };

  var game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'world',
    backgroundColor: '#0f6fb0',
    scale: { mode: Phaser.Scale.RESIZE, width: root.innerWidth, height: root.innerHeight },
    physics: { default: 'arcade', arcade: { debug: !!Q.get('debug') } },
    render: { antialias: true },
    scene: [WorldScene]
  });

  root.WORLD = { game: game, S: S, scene: function () { return scene; }, walkTo: walkTo, talk: talkToLulu, shake: shakePalm };
})(typeof window !== 'undefined' ? window : this);
