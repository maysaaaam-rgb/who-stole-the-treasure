/* The pupil plays the island as their own avatar (the same one as on the Class Board).
   - The avatar comes from the cloud function island_avatar(p_code): it returns ONLY the avatar of the
     pupil that owns that island code (T-shirt colour, skin tone, clothes and their approved cartoon face).
   - The picture is composed here with the platform's own avatar engine (../js/pupil-avatars.js) and turned
     into the walking sheet the island already uses (7 columns, 21 frames), so every island scene shows it.
   - No avatar (not approved yet, function missing, offline): the island keeps the monster, as before.
   The face is never saved on this device and never written to the website's files. */
(function (root) {
  'use strict';
  var W = root.IslandWalker;
  if (!W || !W.bakeSheet) return;
  var FRAME = 256, COLS = 7, COUNT = 21, WAIT_MS = 5000;
  var monsterBake = W.bakeSheet;
  var pending = null;      // Promise<sheet|null> for the current pupil
  var readySheet = null;

  function client() { var A = root.AdventureSupabase; try { return A && A.client ? A.client : null; } catch (e) { return null; } }
  function loadImg(src) {
    return new Promise(function (res) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; });
  }

  /* cloud: the avatar of the pupil who owns this code (or null) */
  function fetchLook(code) {
    var test = null;
    try { test = JSON.parse(localStorage.getItem('eaa_island_test_avatar') || 'null'); } catch (e) { test = null; }
    if (test) return Promise.resolve(test);                       // local test harness only
    var sb = client();
    if (!sb || !code) return Promise.resolve(null);
    return sb.rpc('island_avatar', { p_code: code }).then(function (r) { return r && !r.error ? r.data : null; }, function () { return null; });
  }

  /* one standing picture of the avatar, composed by the platform's avatar engine */
  function composeStanding(look) {
    var P = root.PupilAvatars;
    if (!P || !P._compose || !look) return Promise.resolve(null);
    var wear = Object.assign({}, look.wear || {});
    delete wear.pet; delete wear.aura; delete wear.background;      // the walker is the pupil only
    var choice = { tee: look.tee, skin: look.skin || 'auto', wear: wear, stance: 'stand' };
    if (look.gender === 'girl' || look.gender === 'boy') choice.gender = look.gender;
    var head = look.head && String(look.head).indexOf('data:image') === 0 ? loadImg(look.head) : Promise.resolve(null);
    return head.then(function (headImg) {
      var h = headImg ? Promise.resolve(headImg) : loadImg((root.EAA_AVATAR_BASE || '../assets/avatars/') + (choice.gender === 'girl' ? 'head_demo_girl.webp' : 'head_demo.webp'));
      return h.then(function (hi) { return P._compose(choice, hi, {}, 'smile', null); });
    }).then(function (out) {
      if (!out) return null;
      if (typeof out === 'string') return loadImg(out);
      if (out.toDataURL) return loadImg(out.toDataURL('image/png'));
      return out;
    }).catch(function () { return null; });
  }

  /* crop the transparent margins so the pupil fills the frame */
  function tightBox(img) {
    var c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    var g = c.getContext('2d'); g.drawImage(img, 0, 0);
    var d; try { d = g.getImageData(0, 0, c.width, c.height).data; } catch (e) { return { x: 0, y: 0, w: img.width, h: img.height }; }
    var x0 = c.width, x1 = -1, y0 = c.height, y1 = -1;
    for (var y = 0; y < c.height; y += 2) for (var x = 0; x < c.width; x += 2) {
      if (d[(y * c.width + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 < 0) return { x: 0, y: 0, w: img.width, h: img.height };
    return { x: x0, y: y0, w: x1 - x0 + 2, h: y1 - y0 + 2 };
  }

  /* Walking sheet. There is one drawing of the avatar (from the front), so walking is a lively hop:
     the body bobs, leans left and right and squashes a little on landing. Frames match the monster sheet:
     0 idle · 1-4 walk down · 5 idle · 6-9 walk diagonal · 10 idle · 11-14 walk sideways · 15 idle · 16-19 walk up · 20 cheer */
  function buildSheet(img) {
    var box = tightBox(img);
    var canvas = document.createElement('canvas'); canvas.width = FRAME * COLS; canvas.height = FRAME * Math.ceil(COUNT / COLS);
    var g = canvas.getContext('2d');
    var maxH = FRAME * 0.80, sc = Math.min(maxH / box.h, (FRAME * 0.62) / box.w);
    var dw = box.w * sc, dh = box.h * sc, floor = FRAME * 0.93;
    var HOP = [[0, -5, 1], [-0.085, 0, 1], [0, 5, 1], [-0.045, 0, 0.965]];   // [lift (share of frame), lean (deg), squash]
    function draw(n, lift, lean, squash, lunge) {
      var cx = FRAME * (n % COLS) + FRAME / 2, fy = FRAME * Math.floor(n / COLS) + floor;
      g.save();
      g.translate(cx + (lunge || 0), fy + lift * FRAME);
      g.rotate(lean * Math.PI / 180);
      g.scale(1 / Math.sqrt(squash), squash);
      g.drawImage(img, box.x, box.y, box.w, box.h, -dw / 2, -dh, dw, dh);
      g.restore();
    }
    for (var n = 0; n < COUNT; n++) {
      var row = Math.floor(n / 5), k = n % 5;
      if (n === 20) { draw(n, -0.11, 0, 1.04, 0); continue; }             // cheer: a happy jump
      if (k === 0) { draw(n, 0, 0, 1, 0); continue; }                     // idle
      var h = HOP[k - 1], side = row === 2 ? 1.6 : row === 1 ? 1.25 : 1;  // sideways walking leans more
      draw(n, h[0], h[1] * side + (row === 2 ? 5 : row === 1 ? 3 : 0), h[2], row === 2 ? 4 : 0);
    }
    return { canvas: canvas, cols: COLS, frame: FRAME, count: COUNT, avatar: true };
  }

  function prepare(code, firstName) {
    readySheet = null;
    pending = fetchLook(code).then(function (look) {
      if (!look) return null;
      if (!look.gender && firstName && root.PupilAvatars && root.PupilAvatars.genderForName) look.gender = root.PupilAvatars.genderForName(firstName) || undefined;
      return composeStanding(look);
    }).then(function (img) {
      readySheet = img ? buildSheet(img) : null;
      if (readySheet) try { document.documentElement.classList.add('isl-avatar-player'); } catch (e) { /* optional */ }
      return readySheet;
    }).catch(function () { return null; });
    return pending;
  }

  /* every island scene asks IslandWalker.bakeSheet for the player: give the avatar when there is one */
  W.bakeSheet = function (opts) {
    if (readySheet) return Promise.resolve(readySheet);
    if (!pending) return monsterBake(opts);
    var timeout = new Promise(function (res) { setTimeout(function () { res(null); }, WAIT_MS); });
    return Promise.race([pending, timeout]).then(function (sheet) { return sheet || monsterBake(opts); });
  };

  /* start as soon as the pupil's island opens */
  var S = root.IslandSync;
  function hook(name) {
    if (!S || typeof S[name] !== 'function') return;
    var orig = S[name];
    S[name] = function () {
      var out = orig.apply(S, arguments);
      Promise.resolve(out).then(function (ses) {
        if (ses && ses.status === 'ok') prepare(ses.code || '', (ses.student && (ses.student.firstName || ses.student.first_name)) || ses.firstName || '');
      }, function () { /* the island shows its own message */ });
      return out;
    };
  }
  hook('loadLiveSession'); hook('loadDemoSession');
  root.IslandAvatarWalker = { prepare: prepare, ready: function () { return !!readySheet; }, _sheet: function () { return readySheet; } };
})(typeof window !== 'undefined' ? window : this);
