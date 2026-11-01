/* Practice Island — the walking world, built on Phaser (island/lib).
   Each zone is a place to walk around. Walking up to a stop opens the same mission as the map, through IslandApp, so stars, XP limits and saving are unchanged.
   URL: ?demo=1 or ?p=CODE, plus ?zone=2  ?crowd=8 (extra monsters, demo only, to test speed)  ?fps=1 */
(function (root) {
  'use strict';

  var Q = new URLSearchParams(root.location.search);
  var W = 2400, H = 1500, CELL = 40, SPEED = 250, FRAME = 256, SHALLOW = 110;
  var STAGES = ['baby', 'baby', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];   // eggs cannot walk, so a level 1 or 2 pupil walks as a baby here

  var BEACH = 'world/beach/';
  // where the sand starts in Gemini's beach picture, every 120 across (traced by _tmp/world-trace-shore.py)
  var SHORE = [635, 697, 721, 702, 701, 667, 644, 655, 690, 700, 658, 586, 560, 501, 497, 493, 511, 553, 576, 547, 494];
  function shore(x) { var t = Math.max(0, Math.min(SHORE.length - 1.001, x / 120)), i = Math.floor(t), k = (1 - Math.cos((t - i) * Math.PI)) / 2; return SHORE[i] + (SHORE[i + 1] - SHORE[i]) * k; }
  function riverX(y) { return 1180 + 120 * Math.sin(y / 300); }
  var BRIDGE = { y0: 660, y1: 830 };

  /* Each stop: where it stands (x, y = feet), its picture and how tall. "done" swaps the picture when that mission is finished. */
  var ZONES = {
    1: {
      ground: 'meadow', npc: { art: 'z1/c_bolt', worried: 'z1/c_bolt_worried', happy: 'z1/c_bolt_happy', x: 620, y: 620 }, blocked: function (x, y) { return Math.pow((x - 1560) / 300, 2) + Math.pow((y - 300) / 170, 2) < 1; },
      stops: [{ x: 300, y: 1050, art: 'z1/o_machine_off', done: 'z1/o_machine_on', h: 210 }, { x: 700, y: 1250, art: 'z1/o_gear', h: 110 }, { x: 1120, y: 1040, art: 'o_book', h: 110 }, { x: 1520, y: 1240, art: 'z1/o_robot', h: 190 }, { x: 1880, y: 980, art: 'z1/o_engine', h: 170 }],
      chest: { x: 2130, y: 700 },
      decor: [{ art: 'd_hut', x: 900, y: 560, h: 340, sw: 210 }, { art: 'd_flag', x: 1250, y: 700, h: 170, sw: 24 }, { art: 'd_campfire', x: 400, y: 760, h: 110, sw: 70 }, { art: 'z_meadow', x: 2100, y: 330, h: 300, sw: 200 }],
      crate: { x: 1250, y: 880 }, ball: { x: 760, y: 950 }, shells: [{ x: 1250, y: 895, under: true }, { x: 1560, y: 500 }, { x: 200, y: 1380 }]
    },
    2: {
      ground: 'beach', npc: { art: BEACH + 'c_lulu_idle', worried: BEACH + 'c_lulu_worried', happy: BEACH + 'c_lulu_happy', x: 1810, y: 700, h: 140 }, blocked: function (x, y) { return y < shore(x) - SHALLOW; }, shallows: function (x, y) { return y < shore(x) - 6 && y >= shore(x) - SHALLOW; },
      stops: [{ x: 400, y: 665, art: 'z2/o_fish', h: 130 }, { x: 720, y: 980, art: 'd_lantern', h: 130 }, { x: 1120, y: 1240, art: 'z2/o_fishing_rod', h: 150 }, { x: 1540, y: 1000, art: 'z2/o_boat', h: 170 }, { x: 2040, y: 590, art: 'z2/o_lighthouse_off', done: 'z2/o_lighthouse_on', h: 500, sw: 130 }],
      chest: { x: 2190, y: 1050 },
      decor: [{ art: BEACH + 'o_palm_a', x: 170, y: 1000, h: 370, sw: 46, shake: true }, { art: BEACH + 'o_palm_b', x: 640, y: 1330, h: 340, sw: 46, shake: true }, { art: BEACH + 'o_palm_a', x: 1190, y: 740, h: 370, sw: 46, shake: true, shell: true }, { art: BEACH + 'o_palm_b', x: 1920, y: 1390, h: 340, sw: 46, shake: true }, { art: BEACH + 'o_palm_a', x: 2290, y: 1300, h: 370, sw: 46, shake: true }, { art: BEACH + 'o_palm_b', x: 90, y: 1430, h: 340, sw: 46, shake: true },
        { art: 'd_hut', x: 760, y: 770, h: 340, sw: 210 }, { art: 'd_umbrella', x: 1320, y: 1060, h: 260, sw: 26 },
        { art: BEACH + 'o_rock_a', x: 1000, y: 840, h: 100, sw: 90 }, { art: BEACH + 'o_rock_a', x: 2050, y: 860, h: 84, sw: 76 }, { art: BEACH + 'o_rock_b', x: 480, y: 830, h: 70, sw: 80 }, { art: BEACH + 'o_rock_b', x: 1700, y: 1230, h: 70, sw: 80 },
        { art: BEACH + 'o_bush', x: 430, y: 1440, h: 130, sw: 110 }, { art: BEACH + 'o_bush', x: 1640, y: 1440, h: 130, sw: 110 }, { art: BEACH + 'o_bush', x: 2100, y: 1420, h: 150, sw: 120 },
        { art: BEACH + 'o_sandcastle', x: 1040, y: 980, h: 120, sw: 90 }, { art: BEACH + 'o_driftwood', x: 1420, y: 730, h: 50, flat: true }, { art: BEACH + 'o_starfish', x: 880, y: 1140, h: 50, flat: true }, { art: BEACH + 'o_starfish', x: 1480, y: 1270, h: 44, flat: true }],
      crate: { x: 1740, y: 990 }, ball: { x: 960, y: 1100 }, shells: [{ x: 1740, y: 1005, under: true }, { x: 610, y: shore(610) - 62, wet: true }]
    },
    3: {
      ground: 'forest', npc: { art: 'z3/c_nutty', worried: 'z3/c_nutty_worried', happy: 'z3/c_nutty_happy', x: 860, y: 480 }, blocked: function (x, y) { return Math.abs(x - riverX(y)) < 95 && !(y > BRIDGE.y0 && y < BRIDGE.y1); },
      stops: [{ x: 300, y: 620, art: 'z3/o_stone', h: 110 }, { x: 640, y: 1080, art: 'z3/o_basket', h: 130 }, { x: 900, y: 860, art: 'o_book', h: 110 }, { x: 1560, y: 1040, art: 'z3/o_stone', h: 110 }, { x: 1900, y: 620, art: 'z3/o_market_closed', done: 'z3/o_market_open', h: 300, sw: 220 }],
      chest: { x: 2190, y: 1120 },
      decor: [{ art: 'z_forest', x: 450, y: 370, h: 330, sw: 220 }, { art: 'd_campfire', x: 1500, y: 1330, h: 110, sw: 70 }, { art: 'd_flag', x: 1480, y: 500, h: 170, sw: 24 }],
      crate: { x: 1700, y: 1250 }, ball: { x: 500, y: 1300 }, shells: [{ x: 1700, y: 1265, under: true }, { x: 2200, y: 300 }, { x: 150, y: 1400 }]
    },
    4: {
      ground: 'volcano', npc: { art: 'z4/c_ember', worried: 'z4/c_ember_worried', happy: 'z4/c_ember_happy', x: 760, y: 560 }, blocked: function (x, y) { return Math.pow((x - 1200) / 620, 2) + Math.pow((y - 90) / 250, 2) < 1; },
      stops: [{ x: 260, y: 700, art: 'z4/o_bubble', h: 130 }, { x: 640, y: 1100, art: 'z4/o_rocket', h: 170 }, { x: 1120, y: 780, art: 'z4/o_launcher', h: 140 }, { x: 1560, y: 1120, art: 'd_flag', h: 170 }, { x: 1950, y: 620, art: 'z4/o_volcano_angry', done: 'z4/o_volcano_calm', h: 300, sw: 240 }],
      chest: { x: 2180, y: 1120 },
      decor: [{ art: 'd_campfire', x: 1000, y: 1320, h: 110, sw: 70 }, { art: 'z_mountain', x: 330, y: 340, h: 260, sw: 190 }],
      crate: { x: 1300, y: 1000 }, ball: { x: 400, y: 1280 }, shells: [{ x: 1300, y: 1015, under: true }, { x: 2260, y: 280 }, { x: 900, y: 1420 }]
    }
  };
  var ART = ['z1/c_bolt', 'z1/c_bolt_worried', 'z1/c_bolt_happy', 'z3/c_nutty', 'z3/c_nutty_worried', 'z3/c_nutty_happy', 'z4/c_ember', 'z4/c_ember_worried', 'z4/c_ember_happy', 'z1/o_machine_off', 'z1/o_machine_on', 'z1/o_gear', 'z1/o_robot', 'z1/o_engine', 'z2/o_fish', 'z2/o_fishing_rod', 'z2/o_boat', 'z2/o_lighthouse_off', 'z2/o_lighthouse_on', 'z3/o_stone', 'z3/o_basket', 'z3/o_market_closed', 'z3/o_market_open', 'z4/o_bubble', 'z4/o_rocket', 'z4/o_launcher', 'z4/o_volcano_angry', 'z4/o_volcano_calm', 'o_book', 'o_chest', 'o_chest_open', 'o_gift', 'o_star_path', 'o_cloud_lock', 'd_hut', 'd_umbrella', 'd_ball', 'd_lantern', 'd_flag', 'd_campfire', 'z_meadow', 'z_forest', 'z_mountain'].concat(['g_beach', 'o_palm_a', 'o_palm_b', 'o_rock_a', 'o_rock_b', 'o_crate', 'o_coconut', 'o_bush', 'o_driftwood', 'o_starfish', 'o_sandcastle', 'o_shell', 'c_lulu_idle', 'c_lulu_happy', 'c_lulu_worried'].map(function (n) { return BEACH + n; }));

  var $ = function (id) { return document.getElementById(id); };
  var App = function () { return root.IslandApp; };
  var ses = function () { var st = App() && App().state(); return st && st.session; };
  var A = function () { return root.IslandAudio || {}; };
  function sound(n) { if (A()[n]) { try { A()[n](); } catch (e) { /* no sound */ } } }
  function say(t) { if (A().speak) A().speak(t); }

  var S = { joy: { x: 0, y: 0 }, path: [], onArrive: null, near: null, modal: false, ready: false, zone: 1 };
  var scene = null;

  /* ---------- progress, always read from the pupil's real saved game ---------- */
  function missions(z) { var s = ses(); return root.IslandData.getZoneMissions(s.grade || 3, z, !!s.star); }
  function starsOf(id) { var d = ses().doc || {}; return Number((d.stars || {})[id]) || 0; }
  function isOpen(z) {
    if (z <= 1) return true;
    var prev = missions(z - 1).regular.filter(function (m) { return starsOf(m.id) > 0; }).length;
    return prev >= 4;
  }
  function chestOpened(z) { var d = ses().doc || {}; return !!(d.chests && d.chests['z' + z]); }
  function zoneName(z) { var s = ses(), zz = root.IslandData.ZONES[z - 1]; return (zz.titles[s.grade || 3] || zz.titles[3]).name; }
  var SHELL_KEY = function () { return 'eaa_world_shells_' + ((ses().student && ses().student.id) || 'x'); };
  function foundShells() { try { return JSON.parse(localStorage.getItem(SHELL_KEY())) || {}; } catch (e) { return {}; } }
  function saveShell(k) { var f = foundShells(); f[k] = 1; try { localStorage.setItem(SHELL_KEY(), JSON.stringify(f)); } catch (e) { /* just for now */ } }

  /* ---------- the ground, painted for each zone ---------- */
  function speckle(c, w, h, n, colors) { for (var i = 0; i < n; i++) { c.fillStyle = colors[i % colors.length]; c.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2.4, 1 + Math.random() * 2.4); } }
  function patches(c, w, h, n, y0, color) { for (var i = 0; i < n; i++) { var x = Math.random() * w, y = y0 + Math.random() * (h - y0), g = c.createRadialGradient(x, y, 4, x, y, 60 + Math.random() * 80); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - 150, y - 150, 300, 300); } }
  function tufts(c, w, h, n, color) { c.strokeStyle = color; c.lineWidth = 1.6; c.lineCap = 'round'; for (var i = 0; i < n; i++) { var x = Math.random() * w, y = Math.random() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 3, y - 7); c.moveTo(x, y); c.lineTo(x + 3, y - 7); c.moveTo(x, y); c.lineTo(x, y - 9); c.stroke(); } }
  function paintGround(sc, z) {
    var key = 'ground' + z, scale = 2, w = W / scale, h = H / scale, kind = ZONES[z].ground;
    if (kind === 'beach') sc.add.image(0, 0, BEACH + 'g_beach').setOrigin(0).setDisplaySize(W, H).setDepth(-20);
    else if (!sc.textures.exists(key)) {
      var tex = sc.textures.createCanvas(key, w, h), c = tex.context, x, g;
      if (kind === 'meadow') {
        g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#9be36f'); g.addColorStop(1, '#6cc452'); c.fillStyle = g; c.fillRect(0, 0, w, h);
        patches(c, w, h, 22, 0, 'rgba(190,240,130,.5)'); tufts(c, w, h, 900, 'rgba(50,120,40,.5)');
        for (var f = 0; f < 150; f++) { c.fillStyle = ['#fff', '#fde047', '#f9a8d4'][f % 3]; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 2.2, 0, 7); c.fill(); }
        g = c.createRadialGradient(780, 150, 10, 780, 150, 150); g.addColorStop(0, '#38bdf8'); g.addColorStop(1, '#22a3d6'); c.save(); c.translate(780, 150); c.scale(1, 85 / 150); c.translate(-780, -150); c.fillStyle = g; c.beginPath(); c.arc(780, 150, 150, 0, 7); c.fill(); c.lineWidth = 8; c.strokeStyle = 'rgba(255,255,255,.6)'; c.stroke(); c.restore();
      } else if (kind === 'forest') {
        g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5a9e46'); g.addColorStop(1, '#3f8238'); c.fillStyle = g; c.fillRect(0, 0, w, h);
        patches(c, w, h, 26, 0, 'rgba(30,70,30,.35)'); patches(c, w, h, 14, 0, 'rgba(160,220,110,.35)'); tufts(c, w, h, 800, 'rgba(20,70,25,.55)');
        c.beginPath(); for (var y = 0; y <= h; y += 4) c.lineTo(riverX(y * scale) / scale - 48, y); for (y = h; y >= 0; y -= 4) c.lineTo(riverX(y * scale) / scale + 48, y); c.closePath(); c.fillStyle = '#38bdf8'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#d6c28f'; c.stroke();
        var by0 = BRIDGE.y0 / scale, by1 = BRIDGE.y1 / scale, bx = riverX((BRIDGE.y0 + BRIDGE.y1) / 2) / scale; for (var p = 0; p < 8; p++) { c.fillStyle = p % 2 ? '#a9743c' : '#b9823f'; c.fillRect(bx - 66, by0 + (by1 - by0) * p / 8, 132, (by1 - by0) / 8 - 1); } c.strokeStyle = '#6f4316'; c.lineWidth = 4; c.strokeRect(bx - 66, by0, 132, by1 - by0);
      } else {
        g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#c98a54'); g.addColorStop(1, '#a96e3f'); c.fillStyle = g; c.fillRect(0, 0, w, h);
        speckle(c, w, h, 2200, ['rgba(70,40,20,.2)', 'rgba(255,220,180,.15)']); patches(c, w, h, 20, 0, 'rgba(90,50,25,.28)');
        g = c.createRadialGradient(600, 30, 30, 600, 40, 340); g.addColorStop(0, '#6b3c20'); g.addColorStop(.8, '#8c5430'); g.addColorStop(1, 'rgba(140,84,48,0)'); c.save(); c.translate(600, 45); c.scale(1, 130 / 320); c.translate(-600, -45); c.fillStyle = g; c.beginPath(); c.arc(600, 45, 320, 0, 7); c.fill(); c.restore();
      }
      tex.refresh();
    }
    if (kind !== 'beach') sc.add.image(0, 0, key).setOrigin(0).setScale(scale).setDepth(-20);
    if (kind === 'beach') {
      if (!sc.textures.exists('foam')) {
        var fT = sc.textures.createCanvas('foam', w, 240), f2 = fT.context, xx;
        f2.strokeStyle = 'rgba(255,255,255,.9)'; f2.lineWidth = 6; f2.lineCap = 'round'; f2.beginPath();
        for (xx = 0; xx <= w; xx += 4) { var fy = (shore(xx * scale) - 8) / scale; if (!xx) f2.moveTo(xx, fy); else f2.lineTo(xx, fy); } f2.stroke(); fT.refresh();
      }
      var foam = sc.add.image(0, 0, 'foam').setOrigin(0).setScale(scale).setDepth(-19);
      foam.setAlpha(.1); sc.tweens.add({ targets: foam, y: -22, alpha: .75, duration: 2100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
  }
  function makeSmallTextures(sc) {
    if (sc.textures.exists('dot')) return;
    var t = sc.textures.createCanvas('dot', 24, 24), c = t.context, g = c.createRadialGradient(12, 12, 1, 12, 12, 12);
    g.addColorStop(0, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 24, 24); t.refresh();
    var s = sc.textures.createCanvas('shadow', 100, 40); c = s.context;
    g = c.createRadialGradient(50, 20, 2, 50, 20, 48); g.addColorStop(0, 'rgba(40,25,10,.5)'); g.addColorStop(1, 'rgba(40,25,10,0)');
    c.save(); c.scale(1, .4); c.fillStyle = g; c.beginPath(); c.arc(50, 50, 48, 0, 7); c.fill(); c.restore(); s.refresh();
    [['disc', '#334155'], ['disc_done', '#10b981'], ['disc_next', '#f59e0b']].forEach(function (d) {
      var b = sc.textures.createCanvas(d[0], 76, 76), x = b.context;
      x.fillStyle = '#fff'; x.beginPath(); x.arc(38, 38, 36, 0, 7); x.fill(); x.fillStyle = d[1]; x.beginPath(); x.arc(38, 38, 30, 0, 7); x.fill(); b.refresh();
    });
  }

  /* ---------- the pupil's own monster as ready-made pictures ---------- */
  function monsterLook() {
    var s = ses(), prof = (s.student && s.student.monsterProfile) || {}, thr = root.EAA_EVOLUTION_XP || [0, 30, 200, 500, 1000, 2000, 3500], xp = 0;
    try { xp = App().getEffectiveXP(); } catch (e) { xp = Number(s.student && s.student.xp) || 0; }
    var lvl = 1; thr.forEach(function (t, i) { if (xp >= t) lvl = i + 1; });
    return { stage: STAGES[Math.max(0, Math.min(6, lvl - 1))], color: prof.baseColor || 'blue', equipped: Object.assign({}, prof.equipped || {}, (s.doc && s.doc.look) || {}) };
  }
  function loadImg(url) { return new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = url; }); }
  async function bakeMonster(sc, key, opts) {
    var eq = Object.assign({}, opts.equipped || {}); delete eq.background; delete eq.aura;
    var markup = root.MonsterRenderer.renderMonsterSVG({ stage: opts.stage, color: opts.color, equipped: eq, size: FRAME, animated: false, isAvatar: true });
    var base = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
    ['.monster-pedestal-stage', '.mon-rig-shadow'].forEach(function (q) { var el = base.querySelector(q); if (el) el.remove(); });
    var feet = base.querySelector('.plush-feet');
    if (feet && feet.children.length >= 10) {
      var kids = [].slice.call(feet.children), half = kids.length / 2, NS = 'http://www.w3.org/2000/svg', l = document.createElementNS(NS, 'g'), r = document.createElementNS(NS, 'g');
      l.setAttribute('class', 'foot-l'); r.setAttribute('class', 'foot-r');
      kids.forEach(function (k, i) { (i < half ? l : r).appendChild(k); });
      feet.appendChild(l); feet.appendChild(r);
    }
    var poses = [{ bob: 0 }, { bob: -3, l: -7, armL: 14, armR: 14 }, { bob: 0 }, { bob: -3, r: -7, armL: -14, armR: -14 }, { bob: 0 }, { bob: -2, armL: 150, armR: -150 }];
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
    if (sc.textures.exists(key)) { sc.anims.remove(key + '-walk'); sc.textures.remove(key); }
    var tex = sc.textures.addCanvas(key, canvas);
    poses.forEach(function (_, n) { tex.add(n, 0, FRAME * n, 0, FRAME, FRAME); });
    sc.anims.create({ key: key + '-walk', frames: [1, 2, 3, 4].map(function (f) { return { key: key, frame: f }; }), frameRate: 9, repeat: -1 });
    if (key === 'me') S.lookStamp = JSON.stringify(opts);
  }
  function makeWalker(sc, key, x, y, scale) {
    var shadow = sc.add.image(x, y, 'shadow').setScale(scale * 1.15).setDepth(-5);
    var m = sc.physics.add.sprite(x, y, key, 0).setOrigin(.5, .84).setScale(scale);
    m.body.setCircle(44, FRAME / 2 - 44, FRAME * .84 - 44);
    m.setCollideWorldBounds(true); m.monKey = key; m.shadow = shadow;
    return m;
  }

  /* ---------- finding the way ---------- */
  function buildGrid(sc, zone) {
    var cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL), g = [], r, c;
    for (r = 0; r < rows; r++) { g[r] = []; for (c = 0; c < cols; c++) g[r][c] = zone.blocked(c * CELL + CELL / 2, r * CELL + CELL / 2) ? 1 : 0; }
    sc.solids.forEach(function (z) {
      var pad = 26, x0 = Math.floor((z.x - z.width / 2 - pad) / CELL), x1 = Math.floor((z.x + z.width / 2 + pad) / CELL), y0 = Math.floor((z.y - z.height / 2 - pad) / CELL), y1 = Math.floor((z.y + z.height / 2 + pad) / CELL);
      for (var a = Math.max(0, y0); a <= Math.min(rows - 1, y1); a++) for (var b = Math.max(0, x0); b <= Math.min(cols - 1, x1); b++) g[a][b] = 1;
    });
    return { g: g, cols: cols, rows: rows };
  }
  function nearestFree(G, c, r) {
    if (G.g[r] && G.g[r][c] === 0) return [c, r];
    for (var d = 1; d < 16; d++) for (var dy = -d; dy <= d; dy++) for (var dx = -d; dx <= d; dx++) { if (G.g[r + dy] && G.g[r + dy][c + dx] === 0) return [c + dx, r + dy]; }
    return null;
  }
  function findPath(G, sx, sy, tx, ty) {
    var cc = function (v) { return Math.max(0, Math.min(G.cols - 1, Math.floor(v / CELL))); }, cr = function (v) { return Math.max(0, Math.min(G.rows - 1, Math.floor(v / CELL))); };
    var a = nearestFree(G, cc(sx), cr(sy)), b = nearestFree(G, cc(tx), cr(ty));
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
        var nid = id(nc, nr), n = cost[cid] + (dx && dy ? 1.414 : 1);
        if (cost[nid] === undefined || n < cost[nid]) { cost[nid] = n; came[nid] = cid; open.push([n + Math.abs(nc - b[0]) + Math.abs(nr - b[1]), nc, nr]); }
      }
    }
    if (cost[goal] === undefined) return [];
    var out = [], step = goal;
    while (step !== start) { out.unshift({ x: (step % G.cols) * CELL + CELL / 2, y: Math.floor(step / G.cols) * CELL + CELL / 2 }); step = came[step]; }
    return out.filter(function (_, i) { return i % 2 === 1 || i === out.length - 1; });
  }
  function stopWalking() { S.path = []; S.onArrive = null; if (scene && scene.player && scene.player.body) scene.player.setVelocity(0); }
  function walkTo(x, y, onArrive) {
    var sc = scene, m = sc.player;
    S.path = findPath(sc.grid, m.x, m.y, x, y); S.onArrive = onArrive || null; S.stuck = 0;
    if (!S.path.length && onArrive) { S.onArrive = null; onArrive(); }
  }

  /* ---------- the panel: what can be done here ---------- */
  function panel(face, title, line, label, act) {
    $('w-face').src = 'art/' + face + '.webp';
    $('w-line').innerHTML = (title ? '<b>' + title + '</b>' : '') + line;
    $('w-next').textContent = label; $('w-next').onclick = function () { sound('playTap'); hidePanel(); act(); };
    $('w-talk').classList.add('on'); document.body.classList.add('w-talking');
  }
  function hidePanel() { $('w-talk').classList.remove('on'); document.body.classList.remove('w-talking'); }
  function setGoal() {
    var z = S.zone, ms = missions(z).regular, done = ms.filter(function (m) { return starsOf(m.id) > 0; }).length, total = ms.reduce(function (a, m) { return a + starsOf(m.id); }, 0);
    var tip = done < 5 ? 'Walk to the glowing stop!' : (chestOpened(z) ? 'Next place: follow the arrow!' : 'Open the treasure!');
    $('w-goal').innerHTML = zoneName(z) + ' · ⭐ ' + total + '<small>' + tip + '</small>';
  }

  /* ---------- stops ---------- */
  function solid(sc, x, y, w, h) { var z = sc.add.zone(x, y, w, h); sc.physics.add.existing(z, true); sc.solidGroup.add(z); sc.solids.push(z); return z; }
  function buildStops(sc, zone) {
    var ms = missions(S.zone);
    sc.stops = ms.regular.map(function (m, i) {
      var d = zone.stops[i], plot = root.IslandStory.plotOf(m.id) || m;
      var img = sc.add.image(d.x, d.y, d.art).setOrigin(.5, .96);
      img.setScale(d.h / img.height).setDepth(d.y);
      sc.add.image(d.x, d.y, 'shadow').setScale(Math.max(1, d.h / 110)).setDepth(-6);
      if (d.sw) solid(sc, d.x, d.y - 6, d.sw, 40);
      var badgeY = d.y - d.h - 38;
      var disc = sc.add.image(d.x, badgeY, 'disc').setDepth(4500).setScale(.8);
      var num = sc.add.text(d.x, badgeY, String(i + 1), { fontFamily: 'Fredoka, sans-serif', fontSize: '30px', fontStyle: '700', color: '#fff' }).setOrigin(.5).setDepth(4501);
      var st = sc.add.text(d.x, badgeY + 40, '', { fontFamily: 'Fredoka, sans-serif', fontSize: '22px', color: '#fde047', stroke: '#1e293b', strokeThickness: 4 }).setOrigin(.5).setDepth(4501);
      return { kind: 'mission', mission: m, plot: plot, def: d, img: img, disc: disc, num: num, starsText: st, x: d.x, y: d.y };
    });
    var cd = zone.chest;
    var chest = sc.add.image(cd.x, cd.y, chestOpened(S.zone) ? 'o_chest_open' : 'o_chest').setOrigin(.5, .96).setDepth(cd.y);
    chest.setScale(150 / chest.height); sc.add.image(cd.x, cd.y, 'shadow').setScale(1.6).setDepth(-6);
    sc.chest = { kind: 'chest', img: chest, x: cd.x, y: cd.y };
    // the daily gift, near where a pupil comes in
    var gift = sc.add.image(170, 1120, 'o_gift').setOrigin(.5, .96).setDepth(1120); gift.setScale(100 / gift.height);
    sc.gift = { kind: 'gift', img: gift, x: 170, y: 1120 };
    sc.tweens.add({ targets: gift, y: 1110, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    // Star Path stones: only ever built for a pupil on the Star Path
    sc.stones = [];
    (ms.star || []).forEach(function (sm, i) {
      var x = 860 + i * 110, y = 1420, st = sc.add.image(x, y, 'o_star_path').setOrigin(.5, .9).setDepth(y); st.setScale(74 / st.height);
      sc.add.text(x, y - 28, String(sm.num), { fontFamily: 'Fredoka, sans-serif', fontSize: '22px', fontStyle: '700', color: '#451a03' }).setOrigin(.5).setDepth(y + 1);
      sc.stones.push({ kind: 'star', mission: sm, img: st, x: x, y: y });
    });
    sc.arrow = sc.add.text(0, 0, '⬇️', { fontSize: '48px' }).setOrigin(.5).setDepth(4600);
    sc.ring = sc.add.circle(0, 0, 44, 0xfde047, .32).setDepth(-7);
    sc.tweens.add({ targets: sc.arrow, scale: 1.2, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    sc.tweens.add({ targets: sc.ring, scale: 1.7, alpha: .1, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  function refreshStops(celebrate) {
    var sc = scene; if (!sc || !sc.stops) return;
    var next = null;
    sc.stops.forEach(function (s) {
      var n = starsOf(s.mission.id);
      if (!n && !next) next = s;
      s.disc.setTexture(n ? 'disc_done' : (next === s ? 'disc_next' : 'disc'));
      s.starsText.setText(n ? '★'.repeat(n) + '☆'.repeat(3 - n) : '');
      if (n && s.def.done && s.img.texture.key !== s.def.done) { s.img.setTexture(s.def.done); if (celebrate) partyAt(s.x, s.y - s.def.h / 2); }
    });
    var chestReady = !next && !chestOpened(S.zone);
    sc.chest.img.setTexture(chestOpened(S.zone) ? 'o_chest_open' : 'o_chest');
    var t = next || (chestReady ? sc.chest : null);
    S.target = t;
    if (t) { var top = t.def ? t.def.y - t.def.h - 110 : t.y - 210; sc.arrow.setVisible(true).setPosition(t.x, top); sc.ring.setVisible(true).setPosition(t.x, t.y); }
    else { sc.arrow.setVisible(false); sc.ring.setVisible(false); }
    setHelperMood(sc, next);
    if (sc.gateR) sc.gateR.setLock();
    setGoal();
  }
  function helperArt() { return (scene && scene.npcSpot && scene.npcSpot.art) || ZONES[S.zone].npc.art; }
  function setHelperMood(sc, next) {
    var n = ZONES[S.zone].npc; if (!n.worried) return;
    var art = !next ? n.happy : (next === sc.stops[0] ? n.worried : n.art);
    if (sc.npcSpot.art !== art) { sc.npcSpot.art = art; sc.npcSpot.img.setTexture(art); }
  }
  function partyAt(x, y) { var sc = scene; sc.party.explode(60, x, y); sc.cameras.main.shake(220, .004); sound('playFanfare'); if (sc.player) cheer(sc.player, 1400); }
  function cheer(m, ms) {
    m.anims.stop(); m.setFrame(5); m.cheering = true;
    scene.time.delayedCall(ms || 900, function () { if (m.active) { m.cheering = false; m.setFrame(0); } });
  }

  /* What the pupil can do where they are standing */
  function interactables(sc) { return sc.stops.concat([sc.chest, sc.gift, sc.npcSpot], sc.stones); }
  function openThing(t) {
    var z = S.zone;
    if (t.kind === 'mission') {
      var n = starsOf(t.mission.id);
      panel(helperArt(), t.plot.title, n ? '★'.repeat(n) + ' Play again?' : 'Can you help me?', 'Play ▶', function () { App().tapPin(t.mission.id, z, false, null); });
      say(t.plot.title);
    } else if (t.kind === 'star') {
      panel('o_star_path', t.mission.title, 'A star mission!', 'Play ▶', function () { App().tapPin(t.mission.id, z, true, null); });
    } else if (t.kind === 'chest') {
      if (chestOpened(z)) panel('o_chest_open', 'Treasure', 'You opened this one!', 'OK', function () {});
      else panel('o_chest', 'Treasure', S.target === scene.chest ? 'Open the treasure!' : 'Finish all 5 stops first!', 'Open 🎁', function () { App().tapChest(z); refreshStops(true); });
    } else if (t.kind === 'gift') {
      panel('o_gift', "Today's quest", 'Five quick questions!', 'Play ▶', function () { App().startDailyQuest(); });
    } else if (t.kind === 'npc') {
      var name = root.IslandStory.CHARS[z].name, next = S.target;
      var line = next && next.plot && next.plot.intro ? next.plot.intro[0] : (next ? 'Open the treasure!' : 'Thank you, friend!');
      panel(helperArt(), name, line, 'OK', function () {});
      say(line);
    }
  }
  function onTap(ptr) {
    var sc = scene; if (!sc || !sc.player || S.modal) return;
    var x = ptr.worldX, y = ptr.worldY, list = interactables(sc), hit = null, best = 1e9;
    list.forEach(function (t) {
      var h = t.def ? t.def.h : 120, w = t.def ? Math.max(80, t.def.h * .55) : 70;
      if (Math.abs(x - t.x) < w && y < t.y + 30 && y > t.y - h - 60) { var d = Math.abs(x - t.x) + Math.abs(y - t.y); if (d < best) { best = d; hit = t; } }
    });
    if (hit) { hidePanel(); S.near = hit; walkTo(hit.x, hit.y + 54, function () { openThing(hit); }); return; }
    hidePanel(); S.near = null; walkTo(x, y);
  }

  function setupJoystick() {
    if (!(('ontouchstart' in root) || navigator.maxTouchPoints > 0)) return;
    document.body.classList.add('w-touch');
    var pad = $('w-joy'), knob = $('w-knob'), R = 48, active = null;
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

  /* ---------- gates to the next place ---------- */
  function makeGate(sc, dir) {
    var to = S.zone + dir;
    if (to < 1 || to > 4) return null;
    var x = dir > 0 ? W - 70 : 70, y = 760;
    var sign = sc.add.text(x + (dir > 0 ? -40 : 40), y - 80, '', { fontFamily: 'Fredoka, sans-serif', fontSize: '26px', fontStyle: '700', color: '#fff', backgroundColor: '#0f172aee', padding: { x: 12, y: 6 }, align: 'center' }).setOrigin(dir > 0 ? 1 : 0, .5).setDepth(4400);
    var pic = sc.add.text(x, y, dir > 0 ? '➡️' : '⬅️', { fontSize: '64px' }).setOrigin(.5).setDepth(4400);
    sc.tweens.add({ targets: pic, x: x + dir * 12, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    var g = { x: x, y: y, dir: dir, to: to, sign: sign, pic: pic, setLock: function () {
      var open = isOpen(to);
      sign.setText((open ? '' : '🔒 ') + zoneName(to));
      pic.setText(open ? (dir > 0 ? '➡️' : '⬅️') : '☁️');
    } };
    g.setLock();
    return g;
  }
  function goZone(to, fromDir) {
    var sc = scene; if (S.leaving) return;
    S.leaving = true; sound('playHop'); hidePanel(); stopWalking();
    $('w-fade').classList.add('on');
    setTimeout(function () { S.leaving = false; S.near = null; S.ready = false; sc.scene.restart({ zone: to, fromDir: fromDir }); }, 280);
  }

  /* ---------- the scene ---------- */
  var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function WorldScene() { Phaser.Scene.call(this, { key: 'world' }); },
    init: function (data) { S.zone = (data && data.zone) || S.zone; S.fromDir = (data && data.fromDir) || 0; },
    preload: function () { var sc = this; ART.forEach(function (n) { if (!sc.textures.exists(n)) sc.load.image(n, 'art/' + n + '.webp'); }); },
    create: function () {
      var sc = this; scene = sc;
      var zone = ZONES[S.zone];
      sc.player = null;
      sc.physics.world.setBounds(0, 0, W, H);
      makeSmallTextures(sc);
      paintGround(sc, S.zone);
      sc.solids = []; sc.solidGroup = sc.physics.add.staticGroup();
      sc.palms = []; sc.shells = []; sc.palmShellKey = null;

      zone.decor.forEach(function (d) {
        var img = sc.add.image(d.x, d.y, d.art).setOrigin(.5, .96); img.setScale(d.h / img.height); img.setDepth(d.flat ? -5 : d.y);
        if (!d.flat) sc.add.image(d.x, d.y, 'shadow').setScale(Math.max(1, (d.sw || 60) / 45)).setDepth(-6);
        if (d.sw) solid(sc, d.x, d.y - 4, d.sw, 30);
        if (d.shake) { img.hasShell = !!d.shell; sc.palms.push(img); }
      });
      var n = zone.npc, npc = sc.add.image(n.x, n.y, n.art).setOrigin(.5, .92); npc.setScale((n.h || 190) / npc.height).setDepth(n.y);
      sc.add.image(n.x, n.y, 'shadow').setScale(1.8).setDepth(-6); solid(sc, n.x, n.y - 4, 90, 34);
      sc.tweens.add({ targets: npc, scaleY: npc.scaleY * 1.05, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      sc.npcSpot = { kind: 'npc', img: npc, x: n.x, y: n.y };
      buildStops(sc, zone);

      sc.crate = sc.physics.add.image(zone.crate.x, zone.crate.y, BEACH + 'o_crate').setDepth(zone.crate.y); sc.crate.setScale(112 / sc.crate.height);
      sc.crate.body.setSize(sc.crate.width * .85, sc.crate.height * .8); sc.crate.setDrag(1400).setCollideWorldBounds(true).setMass(3).setBounce(.1);
      sc.ball = sc.physics.add.image(zone.ball.x, zone.ball.y, 'd_ball').setScale(.17).setDepth(zone.ball.y);
      sc.ball.body.setCircle(250, 6, 6); sc.ball.setDrag(170).setBounce(.8).setCollideWorldBounds(true).setMass(.4);
      sc.ballShadow = sc.add.image(zone.ball.x, zone.ball.y, 'shadow').setDepth(-6);
      sc.crateShadow = sc.add.image(zone.crate.x, zone.crate.y + 55, 'shadow').setScale(2.3).setDepth(-6);

      // hidden shells: a little something to find (kept on this device for now, no XP)
      var found = foundShells();
      zone.shells.forEach(function (sd, i) {
        var k = 'z' + S.zone + '_' + i; if (found[k]) return;
        var s = sc.add.image(sd.x, sd.y, BEACH + 'o_shell').setScale(.24).setDepth(sd.wet ? -12 : (sd.under ? sd.y - 100 : sd.y)); s.under = !!sd.under; s.key2 = k; sc.shells.push(s);
      });
      sc.palmShellKey = 'z' + S.zone + '_palm';
      if (found[sc.palmShellKey]) sc.palms.forEach(function (p) { p.hasShell = false; });

      sc.fx = sc.add.particles(0, 0, 'dot', { speed: { min: 60, max: 240 }, lifespan: 600, scale: { start: .8, end: 0 }, tint: [0xfde047, 0xffffff, 0xf472b6], emitting: false }).setDepth(5000);
      sc.party = sc.add.particles(0, 0, 'dot', { speed: { min: 140, max: 520 }, angle: { min: 200, max: 340 }, gravityY: 420, lifespan: 1500, scale: { start: 1, end: .2 }, tint: [0xfde047, 0x38bdf8, 0xf43f5e, 0x10b981, 0xa855f7], emitting: false }).setDepth(5000);
      sc.dust = sc.add.particles(0, 0, 'dot', { speed: { min: 8, max: 34 }, angle: { min: 200, max: 340 }, lifespan: 420, scale: { start: .55, end: 0 }, alpha: { start: .55, end: 0 }, tint: zone.ground === 'beach' ? 0xe6c88e : (zone.ground === 'volcano' ? 0x8c5430 : 0xd9f99d), emitting: false }).setDepth(-4);
      sc.waterFx = sc.add.particles(0, 0, 'dot', { speed: { min: 30, max: 120 }, angle: { min: 210, max: 330 }, gravityY: 240, lifespan: 480, scale: { start: .6, end: 0 }, tint: [0xffffff, 0xa5f3fc], emitting: false }).setDepth(-3);

      sc.gateL = makeGate(sc, -1); sc.gateR = makeGate(sc, 1);
      sc.grid = buildGrid(sc, zone);
      sc.keys = sc.input.keyboard ? sc.input.keyboard.createCursorKeys() : null;
      sc.wasd = sc.input.keyboard ? sc.input.keyboard.addKeys('W,A,S,D') : null;
      sc.input.on('pointerdown', onTap);
      sc.walkers = [];

      (async function () {
        var look = monsterLook();
        if (!sc.textures.exists('me') || S.lookStamp !== JSON.stringify(look)) await bakeMonster(sc, 'me', look);
        var isDemo = !!ses().isDemo, crowd = isDemo ? Math.max(0, Math.min(30, Number(Q.get('crowd') || 2))) : 0, colors = ['pink', 'gold', 'green', 'purple', 'orange'];
        for (var i = 0; i < Math.min(crowd, colors.length); i++) if (!sc.textures.exists('c' + i)) await bakeMonster(sc, 'c' + i, { stage: ['baby', 'growing', 'adventurer', 'advanced', 'ultimate'][i % 5], color: colors[i] });
        var sx = S.fromDir < 0 ? W - 220 : (S.fromDir > 0 ? 220 : 300), sy = S.fromDir ? 880 : 1200;
        var free = nearestFree(sc.grid, Math.floor(sx / CELL), Math.floor(sy / CELL)) || [5, 20];
        sc.player = makeWalker(sc, 'me', free[0] * CELL + 20, free[1] * CELL + 20, .68);
        sc.cameras.main.setBounds(0, 0, W, H);
        sc.cameras.main.startFollow(sc.player, true, .1, .1);
        var fit = function () { if (!sc.cameras || !sc.cameras.main) return; var w = sc.scale.width, h = sc.scale.height; sc.cameras.main.setZoom(Math.max(w / W, h / H, .7, Math.min(1.25, Math.min(w / 1050, h / 640)))); };
        fit(); sc.scale.off('resize'); sc.scale.on('resize', fit);
        sc.physics.add.collider(sc.player, sc.solidGroup);
        sc.physics.add.collider(sc.player, sc.crate);
        sc.physics.add.collider(sc.crate, sc.solidGroup);
        sc.physics.add.collider(sc.ball, sc.solidGroup);
        sc.physics.add.collider(sc.ball, sc.crate);
        sc.physics.add.collider(sc.player, sc.ball, function () {
          var dx = sc.ball.x - sc.player.x, dy = sc.ball.y - sc.player.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
          sc.ball.setVelocity(dx / len * 620, dy / len * 620); sound('playHop');
        });
        for (var k = 0; k < crowd; k++) {
          var w = makeWalker(sc, 'c' + (k % Math.min(crowd, colors.length)), 300 + Math.random() * 1800, 800 + Math.random() * 550, .56);
          w.wander = { x: w.x, y: w.y, wait: Math.random() * 2000 };
          sc.physics.add.collider(w, sc.solidGroup); sc.physics.add.collider(w, sc.ball);
          sc.walkers.push(w);
        }
        refreshStops(false);
        $('w-load').classList.remove('on');
        $('w-fade').classList.remove('on');
        S.cooldown = 500;
        S.ready = true;
      })().catch(function (e) { $('w-load').innerHTML = '😢 The monster could not load.<small>' + String(e && e.message || e).slice(0, 120) + '</small>'; S.error = String(e); });
    },
    update: function (time, delta) {
      var sc = this, m = sc.player;
      if (Q.get('fps') && time % 500 < delta) $('w-fps').textContent = Math.round(sc.game.loop.actualFps) + ' fps';
      if (!m || !m.body) return;

      // a mission, story or menu is open: the world waits; when it closes, read the new stars and look
      var modalNow = !!($('isl-modal-root') && $('isl-modal-root').children.length);
      if (modalNow !== S.modal) {
        S.modal = modalNow;
        if (modalNow) { hidePanel(); stopWalking(); }
        else {
          refreshStops(true);
          var look = monsterLook();
          if (S.lookStamp !== JSON.stringify(look)) { var fr = m; bakeMonster(sc, 'me', look).then(function () { if (fr.active) fr.setTexture('me', 0); }); }
          S.near = null; S.cooldown = 600;
        }
      }
      var zone = ZONES[S.zone], vx = 0, vy = 0, K = sc.keys, Wk = sc.wasd;
      if (!S.modal && !S.leaving) {
        if (S.joy.x || S.joy.y) { vx = S.joy.x; vy = S.joy.y; }
        else if (K && Wk) {
          vx = ((K.right.isDown || Wk.D.isDown) ? 1 : 0) - ((K.left.isDown || Wk.A.isDown) ? 1 : 0);
          vy = ((K.down.isDown || Wk.S.isDown) ? 1 : 0) - ((K.up.isDown || Wk.W.isDown) ? 1 : 0);
          if (vx || vy) { var l0 = Math.sqrt(vx * vx + vy * vy); vx /= l0; vy /= l0; S.path = []; S.onArrive = null; }
        }
        if (!vx && !vy && S.path.length) {
          var nx = S.path[0], dx = nx.x - m.x, dy = nx.y - m.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 24) { S.path.shift(); S.stuck = 0; if (!S.path.length && S.onArrive) { var cb = S.onArrive; S.onArrive = null; cb(); } }
          else {
            vx = dx / d; vy = dy / d;
            if (Math.abs(m.body.velocity.x) + Math.abs(m.body.velocity.y) < 30) S.stuck = (S.stuck || 0) + delta; else S.stuck = 0;
            if (S.stuck > 900) { S.path = []; S.onArrive = null; S.stuck = 0; vx = vy = 0; }
          }
        }
      }
      var wet = zone.shallows ? zone.shallows(m.x, m.y) : false, speed = SPEED * (wet ? .68 : 1);
      m.setVelocity(vx * speed, vy * speed);
      pushOut(m, zone);
      var moving = !!(vx || vy);
      if (moving && !m.cheering) {
        if (!m.anims.isPlaying) m.play('me-walk');
        if (vx) m.setFlipX(vx < 0);
        S.dustAt = (S.dustAt || 0) + delta;
        if (S.dustAt > (wet ? 150 : 190)) { S.dustAt = 0; (wet ? sc.waterFx : sc.dust).explode(wet ? 5 : 2, m.x, m.y + 4); }
      } else if (!m.cheering && m.anims.isPlaying) { m.anims.stop(); m.setFrame(0); }
      m.setDepth(m.y); m.shadow.setPosition(m.x, m.y + 2);

      sc.walkers.forEach(function (w) {
        var a = w.wander;
        if (a.wait > 0) { a.wait -= delta; w.setVelocity(0); if (w.anims.isPlaying) { w.anims.stop(); w.setFrame(0); } }
        else {
          var ddx = a.x - w.x, ddy = a.y - w.y, dd = Math.sqrt(ddx * ddx + ddy * ddy); a.life = (a.life || 0) + delta;
          if (dd < 20 || a.life > 6000) { a.wait = 800 + Math.random() * 2600; a.life = 0; a.x = 150 + Math.random() * 2100; a.y = 780 + Math.random() * 620; }
          else { w.setVelocity(ddx / dd * 120, ddy / dd * 120); w.setFlipX(ddx < 0); if (!w.anims.isPlaying) w.play(w.monKey + '-walk'); }
        }
        pushOut(w, zone); w.setDepth(w.y); w.shadow.setPosition(w.x, w.y + 2);
      });
      pushOut(sc.crate, zone); pushOut(sc.ball, zone);
      sc.crate.setDepth(sc.crate.y + 54); sc.crateShadow.setPosition(sc.crate.x, sc.crate.y + 54);
      sc.ball.setDepth(sc.ball.y + 40); sc.ball.rotation += sc.ball.body.velocity.x * delta * .00002; sc.ballShadow.setPosition(sc.ball.x, sc.ball.y + 42);

      if (S.modal || S.leaving) return;
      if (S.cooldown > 0) { S.cooldown -= delta; return; }

      // shells
      for (var i = sc.shells.length - 1; i >= 0; i--) {
        var sh = sc.shells[i];
        if (sh.under && Phaser.Math.Distance.Between(sc.crate.x, sc.crate.y, sh.x, sh.y) < 92) continue;
        if (Phaser.Math.Distance.Between(m.x, m.y, sh.x, sh.y) < 66) {
          sc.shells.splice(i, 1); saveShell(sh.key2); sound('playCorrect'); say('A shell!'); cheer(m); sc.fx.explode(14, sh.x, sh.y);
          sc.tweens.add({ targets: sh, y: sh.y - 90, alpha: 0, duration: 650, onComplete: function (tw, t) { t[0].destroy(); } });
        }
      }
      // the palm trees shake when you walk into them
      sc.palms.forEach(function (p) {
        if (!p.shaking && Phaser.Math.Distance.Between(m.x, m.y, p.x, p.y) < 74 && moving) shakePalm(p);
      });
      // gates
      [sc.gateL, sc.gateR].forEach(function (g) {
        if (!g) return;
        if (Phaser.Math.Distance.Between(m.x, m.y, g.x, g.y) < 90) {
          if (isOpen(g.to)) goZone(g.to, g.dir);
          else if (!g.told) { g.told = true; panel('o_cloud_lock', zoneName(g.to), 'Finish 4 stops here first!', 'OK', function () {}); say('Finish four stops here first!'); }
        } else g.told = false;
      });
      // what is here? the panel opens when you walk up to something, and closes when you walk away
      var here = null, best = 110;
      interactables(sc).forEach(function (t) { var dd2 = Phaser.Math.Distance.Between(m.x, m.y, t.x, t.y); if (dd2 < best) { best = dd2; here = t; } });
      if (here && here !== S.near && !S.path.length) { S.near = here; openThing(here); }
      else if (!here && S.near && !S.path.length) { S.near = null; hidePanel(); }
    }
  });
  function pushOut(o, zone) {
    if (!zone.blocked(o.x, o.y)) { o.lastX = o.x; o.lastY = o.y; return; }
    if (o.lastX !== undefined) { o.x = o.lastX; o.y = o.lastY; }
    if (o.body) { o.body.velocity.x *= -.4; o.body.velocity.y *= -.4; }
  }
  function shakePalm(p) {
    var sc = scene; p.shaking = true; sound('playPop');
    sc.tweens.add({ targets: p, angle: { from: -6, to: 6 }, duration: 90, yoyo: true, repeat: 3, onComplete: function () { p.angle = 0; sc.time.delayedCall(1200, function () { p.shaking = false; }); } });
    var drop = function (key, scale, tx, ty, then) {
      var d = sc.add.image(p.x + (tx > p.x ? 26 : -26), p.y - 280, key).setScale(scale).setDepth(ty + 1);
      sc.tweens.add({ targets: d, x: tx, duration: 750 });
      sc.tweens.add({ targets: d, y: ty, duration: 750, ease: 'Bounce.out', onComplete: function () { if (then) then(d); } });
    };
    if (p.hasShell) {
      p.hasShell = false;
      drop(BEACH + 'o_shell', .24, p.x + 150, p.y + 42, function (d) { d.under = false; d.key2 = sc.palmShellKey; sc.shells.push(d); });
    } else {
      drop(BEACH + 'o_coconut', .14, p.x - 70 + Math.random() * 140, p.y + 40, function (d) { sc.tweens.add({ targets: d, alpha: 0, delay: 1500, duration: 400, onComplete: function () { d.destroy(); } }); });
    }
  }

  /* ---------- start, once the pupil is known ---------- */
  function startWorld() {
    var want = Number(Q.get('zone')) || 1, z = 1;
    for (var i = 1; i <= 4; i++) if (i <= want && isOpen(i)) z = i;
    S.zone = z;
    document.body.classList.add('w-on');
    $('w-load').classList.add('on');
    setupJoystick();
    $('w-back').onclick = function () { var u = new URLSearchParams(root.location.search); u.delete('zone'); root.location.href = 'index.html?' + u.toString(); };
    $('w-wall').onclick = function () { if (root.IslandWall) root.IslandWall.open(); };
    $('w-book').onclick = function () { if (root.IslandRewards) root.IslandRewards.openStickerBook(); };
    $('w-dress').onclick = function () { App().openDressingRoom(); };
    if (Q.get('fps')) $('w-fps').style.display = 'block';
    root.WORLD.game = new Phaser.Game({
      type: Phaser.AUTO, parent: 'world', backgroundColor: '#0f6fb0',
      scale: { mode: Phaser.Scale.RESIZE, width: root.innerWidth, height: root.innerHeight },
      physics: { default: 'arcade', arcade: { debug: !!Q.get('debug') } },
      render: { antialias: true }, scene: [WorldScene]
    });
  }
  root.WORLD = { S: S, scene: function () { return scene; }, walkTo: walkTo, goZone: goZone, refresh: refreshStops, open: openThing };
  var tries = 0;
  (function waitForPupil() {
    var s = ses();
    if (s && s.status === 'ok') { startWorld(); return; }
    if (tries++ < 400) setTimeout(waitForPupil, 150);   // no pupil yet: the normal code screen is showing underneath
  })();
})(typeof window !== 'undefined' ? window : this);
