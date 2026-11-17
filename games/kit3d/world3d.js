/* world3d — Adventure Park: one shared 3D world for all the 3D games.
   Built from pieces (games/world/pieces.json) placed by a map (games/world/map.json).
   Each piece uses Gemini's model from assets/3d/world/<file> when it exists,
   otherwise a simple built-in stand-in shape, so the world always works.
   Usage (after kit3d.js):
     K.World.load({ zone: 'cannon' }).then(function (w) { ... })
   The zone's x,z becomes 0,0, so a game keeps its own coordinates. */
(function () {
  'use strict';
  var K = window.K3, T3 = window.THREE;
  var W = K.World = {};
  var MODEL_DIR = K.ROOT + 'assets/3d/world/';
  var DATA_DIR = K.ROOT + 'games/world/';

  function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); }); }
  var m = function (c, o) { return K.mat(c, o); };
  function box(w, h, d, c) { var x = new T3.Mesh(new T3.BoxGeometry(w, h, d), m(c)); return x; }
  function cyl(rt, rb, h, c, seg) { return new T3.Mesh(new T3.CylinderGeometry(rt, rb, h, seg || 12), m(c)); }
  function sph(r, c, ws) { return new T3.Mesh(new T3.SphereGeometry(r, ws || 14, 10), m(c)); }
  function at(o, x, y, z) { o.position.set(x, y, z); return o; }

  /* ---------- stand-in shapes (used until a real model exists) ---------- */
  var FB = {
    tree: function () { var g = new T3.Group(); g.add(at(cyl(.18, .26, 1.6, 0xb07a52), 0, .8, 0)); [[0, 2.3, 0, 1.25], [.5, 2.9, .2, .9], [-.4, 3.1, -.2, .85]].forEach(function (b) { g.add(at(sph(b[3], 0x5cc46a), b[0], b[1], b[2])); }); return g; },
    pine: function () { var g = new T3.Group(); g.add(at(cyl(.15, .22, 1.2, 0xa0704a), 0, .6, 0)); [[1.3, 1.9, 1.6], [1.0, 1.6, 2.7], [.65, 1.3, 3.7]].forEach(function (c) { g.add(at(new T3.Mesh(new T3.ConeGeometry(c[0], c[1], 10), m(0x3fae6a)), 0, c[2], 0)); }); return g; },
    blossom: function () { var g = FB.tree(); g.children.forEach(function (c, i) { if (i) c.material = m(0xf7a8cc); }); return g; },
    bush: function () { var g = new T3.Group(); [[0, .45, 0, .55], [.45, .35, .1, .42], [-.45, .35, -.05, .42]].forEach(function (b) { g.add(at(sph(b[3], 0x56b866), b[0], b[1], b[2])); }); return g; },
    flowers: function () { var g = new T3.Group(); g.add(at(cyl(.95, 1, .3, 0xc98d63, 16), 0, .15, 0)); g.add(at(cyl(.85, .85, .08, 0x6cbf5a, 16), 0, .32, 0)); var cs = [0xff8fb8, 0xffe066, 0xffffff, 0xc3a6ff]; for (var i = 0; i < 9; i++) { var a = i * 2.4, r = .25 + (i % 3) * .2; g.add(at(sph(.12, cs[i % 4], 8), Math.cos(a) * r, .45, Math.sin(a) * r)); } return g; },
    rock: function () { var r = new T3.Mesh(new T3.DodecahedronGeometry(.6, 0), m(0xbfc5d6)); r.scale.set(1.2, .8, 1); r.position.y = .4; var g = new T3.Group(); g.add(r); return g; },
    fence: function () { var g = new T3.Group(); [-1.9, 0, 1.9].forEach(function (x) { g.add(at(box(.14, 1, .14, 0xffffff), x, .5, 0)); }); [.35, .75].forEach(function (y) { g.add(at(box(4, .1, .08, 0xffffff), 0, y, 0)); }); return g; },
    hedge: function () { var g = new T3.Group(); var h = at(box(4, 1.2, .9, 0x4fb562), 0, .6, 0); g.add(h); return g; },
    bench: function () { var g = new T3.Group(); g.add(at(box(2, .12, .6, 0xf2a7c3), 0, .5, 0)); g.add(at(box(2, .5, .1, 0xf2a7c3), 0, .8, -.28)); [-.85, .85].forEach(function (x) { g.add(at(box(.1, .5, .5, 0x6c6c8a), x, .25, 0)); }); return g; },
    lamp: function () { var g = new T3.Group(); g.add(at(cyl(.07, .1, 3.2, 0x5a4fcf), 0, 1.6, 0)); var b = at(sph(.28, 0xfff3b0), 0, 3.35, 0); b.material = new T3.MeshBasicMaterial({ color: 0xfff3b0 }); g.add(b); g.add(at(new T3.Mesh(new T3.ConeGeometry(.35, .25, 12), m(0x5a4fcf)), 0, 3.65, 0)); return g; },
    signpost: function () { var g = new T3.Group(); g.add(at(cyl(.07, .07, 2.4, 0xc98d63), 0, 1.2, 0)); g.add(at(box(1.3, .35, .08, 0xffd166), .3, 2.1, 0)); g.add(at(box(1.1, .3, .08, 0x8fc3ff), -.25, 1.6, 0)); return g; },
    picnic: function () { var g = new T3.Group(); g.add(at(box(2.1, .1, .9, 0xe0a878), 0, .75, 0)); [-.75, .75].forEach(function (z) { g.add(at(box(2.1, .08, .3, 0xe0a878), 0, .45, z)); }); [-.8, .8].forEach(function (x) { g.add(at(box(.1, .75, 1.6, 0xc98d63), x, .37, 0)); }); return g; },
    fountain: function () { var g = new T3.Group(); g.add(at(cyl(3.4, 3.5, .6, 0xe7e2ff, 32), 0, .3, 0)); var w = at(cyl(3.1, 3.1, .1, 0x7fd3ff, 32), 0, .58, 0); w.material = new T3.MeshLambertMaterial({ color: 0x7fd3ff, emissive: 0x2a8fd0, emissiveIntensity: .25 }); g.add(w); g.add(at(cyl(.4, .5, 2, 0xe7e2ff), 0, 1.2, 0)); g.add(at(cyl(1.3, .9, .3, 0xe7e2ff, 24), 0, 2.2, 0)); g.add(at(sph(.35, 0x9fe0ff), 0, 2.7, 0)); return g; },
    stall: function () { var g = new T3.Group(); g.add(at(box(2.6, 1.1, 1.4, 0xffffff), 0, .8, 0)); [-1, 1].forEach(function (x) { g.add(at(cyl(.3, .3, .1, 0x5a4fcf, 16), x, .3, .75)); }); g.add(at(cyl(.05, .05, 1.4, 0xffffff), 0, 2, 0)); var u = at(new T3.Mesh(new T3.ConeGeometry(1.6, .7, 12), m(0xff8fb8)), 0, 2.75, 0); g.add(u); g.add(at(new T3.Mesh(new T3.ConeGeometry(.35, .6, 10), m(0xffd9a0)), 1.1, 1.6, 0)); g.add(at(sph(.3, 0xff9fc8), 1.1, 2.0, 0)); return g; },
    bleachers: function () { var g = new T3.Group(); for (var r = 0; r < 4; r++) g.add(at(box(8, .55 * (r + 1), 1, r % 2 ? 0xbfe0ff : 0xd8ecff), 0, .275 * (r + 1), 1.5 - r)); return g; },
    goal: function () { var g = new T3.Group(); var w = 0xffffff; g.add(at(cyl(.07, .07, 2.44, w), -3.66, 1.22, 0)); g.add(at(cyl(.07, .07, 2.44, w), 3.66, 1.22, 0)); var bar = at(cyl(.07, .07, 7.32, w), 0, 2.44, 0); bar.rotation.z = Math.PI / 2; g.add(bar); var net = at(box(7.3, 2.4, .05, 0xffffff), 0, 1.2, -1.8); net.material = new T3.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: .35 }); g.add(net); return g; },
    board: function () { var g = new T3.Group(); [-2, 2].forEach(function (x) { g.add(at(cyl(.12, .12, 5, 0xffffff), x, 2.5, 0)); }); g.add(at(box(4.8, 2.4, .3, 0x2b1d40), 0, 3.6, 0)); var s = at(box(4.4, 2, .05, 0x4fe0a0), 0, 3.6, .16); s.material = new T3.MeshBasicMaterial({ color: 0x3fc890 }); g.add(s); return g; },
    windmill: function () { var g = new T3.Group(); g.add(at(cyl(1.8, 2.8, 8, 0xfff0e0, 16), 0, 4, 0)); g.add(at(new T3.Mesh(new T3.ConeGeometry(2.3, 2.6, 16), m(0xff8fb8)), 0, 9.3, 0)); g.add(at(box(1, 1.6, .2, 0x8a5a3a), 0, .8, 2.6)); return g; },
    blades: function () { var g = new T3.Group(); for (var i = 0; i < 4; i++) { var b = box(.6, 4.2, .1, 0xffffff); b.position.y = 2.2; var arm = new T3.Group(); arm.add(b); arm.rotation.z = i * Math.PI / 2; g.add(arm); } g.add(sph(.4, 0xffd166)); return g; },
    carousel: function () { var g = new T3.Group(); g.add(at(cyl(4.4, 4.5, .5, 0xffe3f0, 32), 0, .25, 0)); g.add(at(cyl(.4, .4, 4.5, 0xffd166), 0, 2.5, 0)); g.add(at(new T3.Mesh(new T3.ConeGeometry(4.8, 1.8, 24), m(0x9b7bff)), 0, 5.4, 0)); var cs = [0xffffff, 0x8fc3ff, 0xffe066, 0xff9fc8]; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; g.add(at(cyl(.05, .05, 4, 0xffd166), Math.cos(a) * 3.4, 2.5, Math.sin(a) * 3.4)); var h = at(box(.4, .7, 1.1, cs[i % 4]), Math.cos(a) * 3.4, 1.8, Math.sin(a) * 3.4); h.rotation.y = -a; g.add(h); } return g; },
    house: function () { var g = new T3.Group(); g.add(at(box(1, .7, 1, 0xfff4e6), 0, .35, 0)); var roof = at(new T3.Mesh(new T3.ConeGeometry(.82, .55, 4), m(0xff8f8f)), 0, .97, 0); roof.rotation.y = Math.PI / 4; g.add(roof); g.add(at(box(.2, .35, .02, 0x8a5a3a), 0, .17, .51)); [-.28, .28].forEach(function (x) { g.add(at(box(.18, .18, .02, 0x8fd0ff), x, .45, .51)); }); return g; },
    castle: function () { var g = new T3.Group(), c = 0xf3e9ff; g.add(at(box(18, 10, 12, c), 0, 5, 0)); [[-9, -6], [9, -6], [-9, 6], [9, 6]].forEach(function (p) { g.add(at(cyl(2.4, 2.6, 15, c, 16), p[0], 7.5, p[1])); g.add(at(new T3.Mesh(new T3.ConeGeometry(3, 5, 16), m(0x9b7bff)), p[0], 17.5, p[1])); }); g.add(at(cyl(3, 3.2, 16, c, 16), 0, 13, 0)); g.add(at(new T3.Mesh(new T3.ConeGeometry(3.8, 6, 16), m(0xff8fb8)), 0, 24, 0)); return g; },
    balloon: function () { var g = new T3.Group(); var b = at(sph(2.4, 0xff8fb8, 20), 0, 4.6, 0); b.scale.y = 1.15; g.add(b); for (var i = 0; i < 6; i++) { var s = at(sph(2.42, i % 2 ? 0xffd166 : 0xff8fb8, 20), 0, 4.6, 0); s.scale.set(.2, 1.15, 1); s.rotation.y = i * Math.PI / 6; g.add(s); } g.add(at(box(1.1, .8, 1.1, 0xc98d63), 0, .4, 0)); return g; },
    arch: function () { var g = new T3.Group(); [-2.6, 2.6].forEach(function (x) { g.add(at(cyl(.3, .35, 4.4, 0xffffff), x, 2.2, 0)); g.add(at(sph(.45, 0xffd166), x, 4.6, 0)); }); var a = new T3.Mesh(new T3.TorusGeometry(2.6, .28, 10, 24, Math.PI), m(0xff8fb8)); a.position.y = 4.2; g.add(a); return g; },
    bridge: function () { var g = new T3.Group(); var d = new T3.Mesh(new T3.CylinderGeometry(5, 5, 4, 24, 1, false, -0.9, 1.8), m(0xe0a878)); d.rotation.z = Math.PI / 2; d.rotation.y = Math.PI / 2; d.position.y = -3.6; d.scale.set(1, 1, 1); g.add(d); [-1.9, 1.9].forEach(function (z) { g.add(at(box(7, .12, .1, 0xffffff), 0, 1.6, z)); }); return g; }
  };

  /* fit a model into its footprint (w x d), feet on the ground */
  function fitTo(obj, w, d) {
    obj.updateMatrixWorld(true);
    var b = new T3.Box3().setFromObject(obj), s = b.getSize(new T3.Vector3());
    var k = Math.min(w / Math.max(s.x, 1e-3), d / Math.max(s.z, 1e-3));
    if (!isFinite(k) || k <= 0) k = 1;
    obj.scale.multiplyScalar(k); obj.updateMatrixWorld(true);
    b.setFromObject(obj); var c = b.getCenter(new T3.Vector3());
    obj.position.x -= c.x; obj.position.z -= c.z; obj.position.y -= b.min.y;
    return obj;
  }

  /* turn a group into instanced meshes: one draw call per mesh, however many copies */
  function instance(proto, placements, parent) {
    proto.updateMatrixWorld(true);
    var meshes = []; proto.traverse(function (o) { if (o.isMesh) meshes.push(o); });
    var pm = new T3.Matrix4(), q = new T3.Quaternion(), up = new T3.Vector3(0, 1, 0), one = new T3.Vector3(1, 1, 1);
    meshes.forEach(function (mesh) {
      var im = new T3.InstancedMesh(mesh.geometry, mesh.material, placements.length);
      placements.forEach(function (p, i) {
        q.setFromAxisAngle(up, (p.r || 0) * Math.PI / 180);
        pm.compose(new T3.Vector3(p.x, p.y || 0, p.z), q, one.clone().multiplyScalar(p.s || 1));
        im.setMatrixAt(i, pm.clone().multiply(mesh.matrixWorld));
      });
      im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false;
      parent.add(im);
    });
  }

  W.load = function (opts) {
    opts = opts || {};
    var root = new T3.Group(); K.scene.add(root);
    var report = { real: [], standIn: [] };
    return Promise.all([getJSON(DATA_DIR + 'pieces.json'), getJSON(DATA_DIR + 'map.json')]).then(function (res) {
      var defs = res[0].pieces, grounds = res[0].grounds, map = res[1];
      var zone = map.zones[opts.zone || 'plaza'] || { x: 0, z: 0 };
      root.position.set(-zone.x, 0, -zone.z);
      W.map = map; W.zone = zone; W.root = root; W.report = report;

      /* ground: big grass + areas */
      function groundMat(kind) {
        var g = grounds[kind] || { color: '#8fdc7a', tile: 8 };
        var mt = new T3.MeshLambertMaterial({ color: g.color });
        new T3.TextureLoader().load(DATA_DIR + 'art/' + g.texture, function (t) {
          t.colorSpace = T3.SRGBColorSpace; t.wrapS = t.wrapT = T3.RepeatWrapping; t.anisotropy = 8;
          mt.map = t; mt.color.set(0xffffff); mt.needsUpdate = true; mt.userData.tile = g.tile;
          if (mt.userData.onTex) mt.userData.onTex(t);
        }, undefined, function () {});
        return mt;
      }
      if (!opts.noGrass) {
        var gm = groundMat('grass'), grass = new T3.Mesh(new T3.PlaneGeometry(700, 700), gm);
        gm.userData.onTex = function (t) { t.repeat.set(700 / 8, 700 / 8); };
        grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; root.add(grass);
      }
      map.grounds.forEach(function (a, i) {
        if (opts.skipGrounds && opts.skipGrounds.indexOf(a.g) >= 0) return;
        var mt = groundMat(a.g), tile = (grounds[a.g] || {}).tile || 6;
        var geo = a.round ? new T3.CircleGeometry(.5, 48) : new T3.PlaneGeometry(1, 1);
        var mesh = new T3.Mesh(geo, mt); mesh.scale.set(a.w, a.d, 1);
        mt.userData.onTex = function (t) { t.repeat.set(a.w / tile, a.d / tile); };
        mesh.rotation.x = -Math.PI / 2; mesh.position.set(a.x, .012 + i * .004, a.z); mesh.receiveShadow = true;
        mesh.renderOrder = -1; root.add(mesh);
      });

      /* distant hills ring */
      var hc = [0x7fcf6e, 0x9ae08a, 0x6fc46a];
      for (var h = 0; h < 22; h++) {
        var a = h / 22 * Math.PI * 2, r = 165 + (h % 3) * 12;
        var hill = new T3.Mesh(new T3.SphereGeometry(28 + (h % 4) * 6, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), m(hc[h % 3]));
        hill.scale.y = .32 + (h % 3) * .08; hill.position.set(Math.cos(a) * r, -1, Math.sin(a) * r); root.add(hill);
      }

      /* pieces, grouped by type */
      var byType = {};
      map.pieces.forEach(function (p) { (byType[p.p] = byType[p.p] || []).push(p); });
      var jobs = Object.keys(byType).map(function (id) {
        var def = defs[id]; if (!def) return Promise.resolve();
        if (opts.skip && opts.skip.indexOf(id) >= 0) return Promise.resolve();
        return K.tryGLB(MODEL_DIR + def.file).then(function (gltf) {
          var proto;
          if (gltf) {
            proto = gltf.scene; report.real.push(id);
            proto.traverse(function (o) { if (o.isMesh && o.material) { o.material.metalness = 0; o.material.roughness = Math.max(.6, o.material.roughness || .6); } });
            fitTo(proto, def.w, def.d);
          } else {
            proto = (FB[def.fallback] || FB.rock)(); report.standIn.push(id);
            if (def.fallback === 'house') proto.scale.set(def.w, def.h / 1.2, def.d);
            fitTo(proto, def.w, def.d);
          }
          var wrap = new T3.Group(); wrap.add(proto);
          if (def.spin || def.turn || def.float) {   // animated pieces: real copies, not instances
            byType[id].forEach(function (p) {
              var c = wrap.clone(true); c.position.set(p.x, p.y || 0, p.z); c.rotation.y = (p.r || 0) * Math.PI / 180;
              c.traverse(function (o) { if (o.isMesh) { o.castShadow = true; } });
              var inner = c.children[0], ph = Math.random() * 6;
              if (def.spin) { inner.position.y -= def.h / 2; var piv = new T3.Group(); piv.position.y = 0; c.remove(inner); piv.add(inner); c.add(piv); K.onFrame(function (dt) { piv.rotation.z += dt * .8; }); }
              if (def.turn) K.onFrame(function (dt) { inner.rotation.y += dt * .5; });
              if (def.float) { var y0 = c.position.y; K.onFrame(function (dt, t) { c.position.y = y0 + Math.sin(t * .4 + ph) * .8; c.rotation.y += dt * .05; }); }
              root.add(c);
            });
          } else instance(wrap, byType[id], root);
        });
      });
      return Promise.all(jobs).then(function () { return W; });
    });
  };

  /* is a world point free for a game to use? (inside its own zone) */
  W.inZone = function (name, x, z) { var r = W.map.zones[name].rect; return x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3]; };
})();
