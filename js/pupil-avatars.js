/* Pupil avatars (v2)
 * A cartoon kid made of layers: body by skin tone (public, generic) + T-shirt colour
 * + the pupil's own cartoon head (PRIVATE: Supabase bucket "pupil-avatars", teacher only)
 * + 124 shop clothes, trousers, shoes, wigs, hats, glasses, backpacks, and held items
 *   drawn on the same frame (assets/avatars/wear/).
 *
 * Nothing about a real pupil is ever stored in the public site: heads and choices live only in
 * the private bucket (heads/<studentId>.webp and avatars.json). Pictures are composed in memory.
 *
 * Teacher switch: Monsters / Avatars on the Class Board. A pupil without an approved avatar
 * keeps their monster.
 */
(function (root) {
  'use strict';

  var BUCKET = 'pupil-avatars';
  var LOOK_KEY = 'eaa_board_look';
  var BASE = 'assets/avatars/';
  var TONES = [
    { id: 'light', label: 'Light' }, { id: 'medium', label: 'Medium' },
    { id: 'tan', label: 'Tan' }, { id: 'dark', label: 'Dark' }
  ];
  var TEES = ['#ffffff', '#ef4444', '#f59e0b', '#facc15', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#1f2937'];

  // Frame: body art is 512x768 (from Gemini's 1024x1536). Neck top is at y 45, centre x 256.
  var BODY_W = 512, BODY_H = 768;
  var HEAD = 300;          // head picture (square) drawn this size
  var CHIN = 0.78;         // chin sits at 78% of the head picture
  var NECK_Y = 78;         // where the chin lands on the body
  var PAD = Math.ceil(HEAD * CHIN - NECK_Y) + 8; // room above the body for the head
  var OUT_SCALE = 0.75;    // final picture is 384 wide

  // Complete catalog of all 124 cutout wearable layers grouped by slot
  var CATALOG = [
    { key: 'clothing', label: '👕 Tops & Outfits', items: [
      'clothing-hoodie', 'clothing-school-jacket', 'clothing-winter', 'clothing-robe',
      'clothing-space', 'clothing-hero', 'clothing-knight-armor', 'cs-sport-shirt',
      'clothing-scarf', 'clothing-vest', 'clothing-travel-coat', 'cs-pyjamas',
      'cs-ninja-gi', 'clothing-adv-jacket', 'clothing-scholar', 'clothing-royal-robe',
      'clothing-royal', 'clothing-magic-robe', 'clothing-dragon-armor', 'cs-hanbok',
      'cs-space-suit', 'cs-trench', 'cs-apron', 'cs-hero-suit',
      'cs-wiz-robe', 'cs-knight-armor', 'cs-scarf', 'cs-mummy-wrap', 'cs-skeleton-hoodie'
    ]},
    { key: 'legs', label: '👖 Trousers & Skirts', items: [
      'av-legs-shorts', 'av-legs-denim-shorts', 'av-legs-skirt', 'av-legs-tutu',
      'av-legs-joggers', 'av-legs-cargo', 'av-legs-black', 'av-legs-rainbow'
    ]},
    { key: 'shoes', label: '👟 Shoes & Boots', items: [
      'av-shoes-red', 'av-shoes-boots', 'av-shoes-wellies', 'av-shoes-football',
      'av-shoes-sparkle', 'av-shoes-gold', 'av-shoes-light', 'av-shoes-slippers'
    ]},
    { key: 'hat', label: '🎩 Hats & Helmets', items: [
      'hat-crown', 'hat-wizard', 'cs-chef-hat', 'cs-pirate-hat', 'cs-beanie',
      'hat-flower', 'hat-star-clip', 'hat-bow', 'hat-scholar', 'cs-ninja-band',
      'cs-gat', 'cs-night-cap', 'cs-detective-cap', 'hat-explorer', 'hat-headband',
      'cs-space-helmet', 'cs-ranger-hat', 'cs-headband', 'cs-wiz-hat', 'cs-knight-helm',
      'cs-robot-antenna', 'cs-rock-bandana', 'cs-big-crown', 'cs-witch-hat', 'cs-vamp-hair',
      'cs-pumpkin-cap', 'cs-my-rainbow-crown'
    ]},
    { key: 'wig', label: '💇 Fun Wigs', items: [
      'av-wig-rainbow', 'av-wig-blue-spikes', 'av-wig-pink-bob'
    ]},
    { key: 'glasses', label: '🕶️ Glasses & Masks', items: [
      'glasses-round', 'glasses-goggles', 'cs-ninja-mask', 'cs-binoculars',
      'cs-hero-mask', 'cs-pirate-patch', 'cs-robot-visor', 'cs-diver-mask', 'cs-rock-shades'
    ]},
    { key: 'backpack', label: '🎒 Backpacks & Wings', items: [
      'bp-adv-bag', 'bp-explorer', 'bp-mini-wings', 'bp-book', 'clothing-cape',
      'cs-jetpack', 'cs-leaf-cape', 'cs-hero-cape', 'cs-robot-pack', 'cs-scuba-tank',
      'cs-fairy-wings', 'cs-witch-cape', 'cs-vamp-cape', 'cs-my-phoenix-wings', 'cs-my-galaxy-cape'
    ]},
    { key: 'neck', label: '🏅 Necklaces & Medals', items: [
      'neck-star', 'neck-badge', 'neck-medal', 'neck-pendant', 'cs-medal'
    ]},
    { key: 'accessory', label: '🪄 Held & Buddies', items: [
      'cs-teddy', 'acc-compass', 'acc-wand', 'acc-book', 'cs-magnifier',
      'acc-confetti', 'acc-companion', 'accessory-crown', 'acc-trophy', 'acc-microphone',
      'acc-floating-stars', 'cs-ladle', 'cs-parrot', 'cs-wiz-staff', 'cs-knight-shield',
      'cs-guitar', 'cs-witch-broom', 'cs-vamp-bat', 'cs-spider-friend', 'cs-my-comet'
    ]}
  ];

  var SLOT_BY_ITEM = {};
  CATALOG.forEach(function (cat) {
    cat.items.forEach(function (id) { SLOT_BY_ITEM[id] = cat.key; });
  });

  function prettyName(id) {
    return String(id || '')
      .replace(/^(clothing-|av-legs-|av-shoes-|av-wig-|hat-|glasses-|bp-|neck-|acc-|accessory-|cs-my-|cs-)/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  var BUILTIN_HEADS = [
    'student-3a-206', 'student-3a-209', 'student-3a-211', 'student-3a-219', 'student-3a-224', 'student-3a-229', 'student-3a-354',
    'student-3b-220', 'student-3b-352', 'student-3b-353',
    'student-4b-208', 'student-4b-306', 'student-4b-322', 'student-4b-338'
  ];
  var data = { approved: {}, pending: {} };   // from class-pupil-avatars (teacher-locked) or built-in heads
  var headB64 = {};        // studentId -> data:image/webp;base64,... (teacher-locked cloud sync)
  var heads = {};          // studentId -> HTMLImageElement (memory only)
  var composed = {};       // studentId -> data URL
  var imgCache = {};       // url -> Promise<Image>
  var wear = null;         // manifest of shop clothes made for avatars
  var state = 'idle';      // idle | loading | ready | nostore | error
  var lastError = '';
  var SYNC_ROW_ID = 'class-pupil-avatars';
  var LOCAL_KEY = 'eaa_pupil_avatars_v1';

  function client() { return root.AdventureSupabase && root.AdventureSupabase.client ? root.AdventureSupabase.client : null; }
  function store() { return root.schoolStore || root.SchoolStore || null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function firstName(st) { return st ? (st.firstName || String(st.name || '').split(' ')[0] || 'Pupil') : 'Pupil'; }

  function mode() { try { return localStorage.getItem(LOOK_KEY) === 'avatars' ? 'avatars' : 'monsters'; } catch (e) { return 'monsters'; } }
  function on() { return mode() === 'avatars'; }
  function setMode(m) {
    try { localStorage.setItem(LOOK_KEY, m === 'avatars' ? 'avatars' : 'monsters'); } catch (e) { /* private mode */ }
    if (m === 'avatars' && state === 'idle') load();
    rerender();
  }
  function rerender() { try { if (root.renderCurrentView) root.renderCurrentView(); } catch (e) { /* ignore */ } }

  function loadImg(url) {
    if (imgCache[url]) return imgCache[url];
    imgCache[url] = new Promise(function (res, rej) {
      var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { delete imgCache[url]; rej(new Error('picture ' + url)); }; im.src = url;
    });
    return imgCache[url];
  }

  // ---------- built-in heads + localStorage + teacher-locked cloud sync ----------
  function seedBuiltinDefaults() {
    var localDoc = null;
    try { localDoc = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); } catch (e) {}
    if (localDoc && localDoc.approved) {
      data.approved = Object.assign({}, localDoc.approved, data.approved);
    }
    if (localDoc && localDoc.pending) {
      data.pending = Object.assign({}, localDoc.pending, data.pending);
    }
    BUILTIN_HEADS.forEach(function (sid, i) {
      if (!data.approved[sid]) {
        data.approved[sid] = {
          skin: 'medium',
          tee: TEES[i % TEES.length],
          wear: {},
          head: true,
          at: '2026-11-10T19:00:00.000Z'
        };
      }
    });
  }
  function saveLocal() {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ approved: data.approved, pending: data.pending, at: new Date().toISOString() }));
    } catch (e) {}
  }
  function readSyncRow() {
    var sb = client(); if (!sb) return Promise.resolve(null);
    return sb.from('classes').select('description').eq('id', SYNC_ROW_ID).maybeSingle().then(function (r) {
      if (r.error || !r.data || !r.data.description) return null;
      try { return JSON.parse(r.data.description) || null; } catch (e) { return null; }
    }).catch(function () { return null; });
  }
  function writeSyncRow() {
    saveLocal();
    var sb = client(); if (!sb) return Promise.resolve();
    var doc = JSON.stringify({ v: 1, at: new Date().toISOString(), approved: data.approved, pending: data.pending, heads: headB64 });
    return sb.from('classes').upsert({
      id: SYNC_ROW_ID,
      name: 'Pupil Avatars (Teacher Private Sync)',
      grade: 'Sync',
      teacher: 'Teacher',
      description: doc
    }, { onConflict: 'id' }).then(function (r) {
      if (r.error) throw new Error(r.error.message || 'sync save failed');
    }).catch(function () { /* saved in localStorage */ });
  }
  function readJson() {
    var sb = client(); if (!sb) return Promise.resolve({ approved: {}, pending: {} });
    return readSyncRow().then(function (syncDoc) {
      if (syncDoc && (syncDoc.approved || syncDoc.heads)) {
        if (syncDoc.heads) headB64 = Object.assign({}, headB64, syncDoc.heads);
        return syncDoc;
      }
      return sb.storage.from(BUCKET).download('avatars.json').then(function (r) {
        if (r.error) return { approved: {}, pending: {} };
        return r.data.text().then(function (t) { try { return JSON.parse(t) || {}; } catch (e) { return {}; } });
      }).catch(function () { return { approved: {}, pending: {} }; });
    });
  }
  function writeJson() {
    saveLocal();
    var sb = client(); if (!sb) return Promise.resolve();
    return writeSyncRow().then(function () {
      var blob = new Blob([JSON.stringify({ approved: data.approved, pending: data.pending, at: new Date().toISOString() })], { type: 'application/json' });
      return sb.storage.from(BUCKET).upload('avatars.json', blob, { upsert: true, contentType: 'application/json', cacheControl: '0' }).catch(function () { /* sync row already saved */ });
    });
  }
  function fetchHead(id) {
    if (headB64[id]) {
      return loadImg(headB64[id]).catch(function () { return null; });
    }
    return loadImg(BASE + 'heads/' + id + '.webp').catch(function () {
      var sb = client(); if (!sb) return null;
      return sb.storage.from(BUCKET).download('heads/' + id + '.webp').then(function (r) {
        if (r.error || !r.data) return null;
        return loadImg(URL.createObjectURL(r.data)).catch(function () { return null; });
      }).catch(function () { return null; });
    });
  }
  function fetchWear() {
    if (wear) return Promise.resolve(wear);
    return fetch(BASE + 'wear/manifest.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (m) { wear = m || {}; return wear; });
  }

  function load() {
    if (state === 'loading') return Promise.resolve();
    state = 'loading';
    return Promise.all([readJson().catch(function () { return {}; }), fetchWear()]).then(function (res) {
      var d = res[0] || {};
      data = { approved: d.approved || {}, pending: d.pending || {} };
      seedBuiltinDefaults();
      var ids = Object.keys(data.approved).concat(Object.keys(data.pending));
      BUILTIN_HEADS.forEach(function (sid) { if (ids.indexOf(sid) < 0) ids.push(sid); });
      return Promise.all(ids.map(function (id) {
        return heads[id] ? null : fetchHead(id).then(function (im) { if (im) heads[id] = im; });
      }));
    }).then(function () {
      return Promise.all(Object.keys(data.approved).map(function (id) {
        return compose(data.approved[id], heads[id], equippedOf(id)).then(function (u) { composed[id] = u; }).catch(function () { /* keep monster */ });
      }));
    }).then(function () { state = 'ready'; if (on()) rerender(); })
      .catch(function (e) {
        lastError = String(e && e.message || e);
        state = 'ready';
        if (on()) rerender();
      });
  }

  function equippedOf(id) {
    try { var p = store() && store().getMonsterProfile ? store().getMonsterProfile(id) : null; return (p && p.equipped) || {}; } catch (e) { return {}; }
  }

  // ---------- drawing ----------
  function tint(ctx, maskImg, color, x, y, w, h) {
    if (!color || /^#?f{3,6}$/i.test(color)) return;
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d');
    g.drawImage(maskImg, 0, 0, w, h);
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(c, x, y); ctx.restore();
  }

  // equipped -> wear layers that exist. Ordered back-to-front for clean layering.
  function wearLayers(eq) {
    var w = wear || {}, bSet = w.body || [], hSet = w.head || [];
    var back = [], legs = [], shoes = [], tops = [], head = [];
    ['backpack'].forEach(function (slot) {
      var id = eq[slot];
      if (id && id !== 'none' && bSet.indexOf(id) >= 0) back.push(id);
    });
    ['legs'].forEach(function (slot) {
      var id = eq[slot];
      if (id && id !== 'none' && bSet.indexOf(id) >= 0) legs.push(id);
    });
    ['shoes'].forEach(function (slot) {
      var id = eq[slot];
      if (id && id !== 'none' && bSet.indexOf(id) >= 0) shoes.push(id);
    });
    ['clothing', 'outfit', 'neck', 'accessory'].forEach(function (slot) {
      var id = eq[slot];
      if (!id || id === 'none') return;
      if (SLOT_BY_ITEM[id] === 'legs' && bSet.indexOf(id) >= 0) { if (legs.indexOf(id) < 0) legs.push(id); }
      else if (SLOT_BY_ITEM[id] === 'shoes' && bSet.indexOf(id) >= 0) { if (shoes.indexOf(id) < 0) shoes.push(id); }
      else if (SLOT_BY_ITEM[id] === 'backpack' && bSet.indexOf(id) >= 0) { if (back.indexOf(id) < 0) back.push(id); }
      else if (bSet.indexOf(id) >= 0 && tops.indexOf(id) < 0) tops.push(id);
    });
    ['wig', 'glasses', 'hat'].forEach(function (slot) {
      var id = eq[slot];
      if (id && id !== 'none' && hSet.indexOf(id) >= 0 && head.indexOf(id) < 0) head.push(id);
    });
    return {
      back: back,
      legs: legs,
      shoes: shoes,
      tops: tops,
      body: back.concat(legs).concat(shoes).concat(tops),
      head: head
    };
  }

  function compose(choice, headImg, eq) {
    return fetchWear().then(function () {
      choice = choice || {};
      var mergedEq = Object.assign({}, eq || {}, choice.wear || {});
      var tone = TONES.some(function (t) { return t.id === choice.skin; }) ? choice.skin : 'medium';
      var L = wearLayers(mergedEq);
      var need = [loadImg(BASE + 'body_' + tone + '.webp'), loadImg(BASE + 'tee_' + tone + '.webp')]
        .concat(L.body.map(function (id) { return loadImg(BASE + 'wear/' + id + '.webp'); }))
        .concat(L.head.map(function (id) { return loadImg(BASE + 'wear/' + id + '.webp'); }));
      return Promise.all(need.map(function (p) { return p.catch(function () { return null; }); })).then(function (ims) {
        var body = ims[0], mask = ims[1]; if (!body) throw new Error('body');
        var W = BODY_W, H = BODY_H + PAD;
        var c = document.createElement('canvas'); c.width = Math.round(W * OUT_SCALE); c.height = Math.round(H * OUT_SCALE);
        var ctx = c.getContext('2d'); ctx.scale(OUT_SCALE, OUT_SCALE);

        var k = 2;
        var backIms = L.back.map(function () { return ims[k++]; });
        var legsIms = L.legs.map(function () { return ims[k++]; });
        var shoesIms = L.shoes.map(function () { return ims[k++]; });
        var topsIms = L.tops.map(function () { return ims[k++]; });

        // 1. Base body + T-shirt tint
        ctx.drawImage(body, 0, PAD, BODY_W, BODY_H);
        if (mask) tint(ctx, mask, choice.tee, 0, PAD, BODY_W, BODY_H);

        // 2. If custom legs or shoes are equipped, clear the base blue jeans / white trainers
        //    so narrower shorts, skirts, or slippers never show the base trousers/shoes behind them.
        if (legsIms.some(Boolean)) {
          ctx.clearRect(148, PAD + 374, 216, 294);
        }
        if (shoesIms.some(Boolean)) {
          ctx.clearRect(120, PAD + 676, 272, 92);
        }

        // 3. Draw back gear, legs, shoes, and tops/neck/held items in order
        backIms.forEach(function (im) { if (im) ctx.drawImage(im, 0, PAD, BODY_W, BODY_H); });
        legsIms.forEach(function (im) { if (im) ctx.drawImage(im, 0, PAD, BODY_W, BODY_H); });
        shoesIms.forEach(function (im) { if (im) ctx.drawImage(im, 0, PAD, BODY_W, BODY_H); });
        topsIms.forEach(function (im) { if (im) ctx.drawImage(im, 0, PAD, BODY_W, BODY_H); });

        // 4. Draw head + head wearables (wig -> glasses -> hat)
        var hx = (BODY_W - HEAD) / 2, hy = PAD + NECK_Y - HEAD * CHIN;
        if (headImg) ctx.drawImage(headImg, hx, hy, HEAD, HEAD);
        else drawBlankHead(ctx, hx, hy);
        L.head.forEach(function () { var im = ims[k++]; if (im) ctx.drawImage(im, hx, hy, HEAD, HEAD); });
        return c.toDataURL('image/webp', 0.9);
      });
    });
  }
  function drawBlankHead(ctx, hx, hy) {   // waiting for the cartoon head: a friendly grey head shape
    var cx = hx + HEAD / 2, cy = hy + HEAD * 0.5;
    ctx.save();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(cx, cy, HEAD * 0.34, HEAD * 0.31, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(cx, cy, HEAD * 0.31, HEAD * 0.28, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#64748b'; ctx.font = '700 ' + Math.round(HEAD * 0.28) + 'px Fredoka, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('?', cx, cy + 4);
    ctx.restore();
  }

  function imgFor(id) { return on() ? (composed[id] || '') : ''; }
  function has(id) { return !!composed[id]; }

  // ---------- builder (pupils in class) + wardrobe (all 124 items) + teacher review ----------
  var CSS = '.pa-ov{position:fixed;inset:0;z-index:10050;background:rgba(10,8,30,.82);display:flex;align-items:center;justify-content:center;font-family:Fredoka,Nunito,system-ui,sans-serif;color:#fff}' +
    '.pa-box{width:min(1180px,96vw);max-height:94vh;overflow:auto;background:linear-gradient(180deg,#2b1b6e,#4a2bb0);border-radius:28px;padding:22px 26px;box-shadow:0 30px 80px rgba(0,0,0,.6);position:relative}' +
    '.pa-box h2{margin:0 0 4px;font-size:1.8rem;font-weight:600}.pa-box p.s{margin:0 0 16px;opacity:.8}' +
    '.pa-x{position:absolute;right:16px;top:14px;border:0;background:rgba(255,255,255,.15);color:#fff;font-size:1.4rem;width:46px;height:46px;border-radius:50%;cursor:pointer}' +
    '.pa-names{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}' +
    '.pa-names button{min-height:64px;border:0;border-radius:18px;background:rgba(255,255,255,.14);color:#fff;font:600 1.25rem Fredoka,system-ui,sans-serif;cursor:pointer;position:relative;border-bottom:4px solid rgba(0,0,0,.28)}' +
    '.pa-names button.done{background:rgba(34,197,94,.35)}.pa-names button.wait{background:rgba(245,158,11,.35)}' +
    '.pa-names button small{display:block;font-size:.75rem;opacity:.85;font-weight:500}' +
    '.pa-make{display:grid;grid-template-columns:minmax(240px,340px) 1fr;gap:24px;align-items:start}@media(max-width:760px){.pa-make{grid-template-columns:1fr}}' +
    '.pa-prev{background:radial-gradient(circle at 50% 30%,rgba(255,255,255,.25),rgba(255,255,255,.05));border-radius:24px;padding:12px;text-align:center;position:sticky;top:8px}.pa-prev img{width:100%;max-height:54vh;object-fit:contain}' +
    '.pa-step{margin-bottom:16px}.pa-step b{display:block;font-size:1.15rem;margin-bottom:8px}' +
    '.pa-tones{display:flex;gap:12px;flex-wrap:wrap}.pa-tones button{width:64px;height:64px;border-radius:50%;border:4px solid transparent;cursor:pointer;box-shadow:0 6px 14px rgba(0,0,0,.35)}' +
    '.pa-tones button.on,.pa-tees button.on{border-color:#fde047;transform:scale(1.08)}' +
    '.pa-tees{display:flex;gap:10px;flex-wrap:wrap}.pa-tees button{width:50px;height:50px;border-radius:14px;border:4px solid rgba(255,255,255,.25);cursor:pointer}' +
    '.pa-go{border:0;border-radius:18px;padding:13px 22px;font:700 1.15rem Fredoka,system-ui,sans-serif;cursor:pointer;background:#22c55e;color:#fff;border-bottom:5px solid #15803d;margin-right:8px;margin-top:6px}' +
    '.pa-go.b{background:rgba(255,255,255,.18);border-bottom-color:rgba(0,0,0,.25)}.pa-go.r{background:#ef4444;border-bottom-color:#991b1b}' +
    '.pa-cats{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}.pa-cats button{border:0;border-radius:14px;padding:8px 13px;font:600 .92rem Fredoka,system-ui,sans-serif;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;border-bottom:4px solid rgba(0,0,0,.25)}' +
    '.pa-cats button.on{background:#38bdf8;color:#0f172a;border-bottom-color:#0284c7}' +
    '.pa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:10px;max-height:46vh;overflow-y:auto;padding:4px}' +
    '.pa-item{border:2px solid rgba(255,255,255,.16);border-bottom:5px solid rgba(0,0,0,.35);border-radius:16px;background:rgba(15,23,42,.55);color:#fff;padding:8px 6px;cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .12s}' +
    '.pa-item:hover{transform:translateY(-2px)}.pa-item.on{border-color:#fde047;background:rgba(250,204,21,.22)}' +
    '.pa-item img{width:76px;height:76px;object-fit:contain;filter:drop-shadow(0 3px 6px rgba(0,0,0,.4))}' +
    '.pa-item span{font-size:.78rem;line-height:1.15;font-weight:600}' +
    '.pa-rev{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}.pa-card{background:rgba(255,255,255,.1);border-radius:20px;padding:10px;text-align:center}.pa-card img{width:100%;height:220px;object-fit:contain}' +
    '.pa-card .row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px}.pa-card .row button,.pa-card label{border:0;border-radius:12px;padding:8px 12px;font:600 .95rem Fredoka,system-ui,sans-serif;cursor:pointer;background:rgba(255,255,255,.18);color:#fff}' +
    '.pa-card .row .ok{background:#22c55e}.pa-card .row .no{background:#ef4444}.pa-card input{display:none}' +
    '.pa-note{background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.6);border-radius:14px;padding:10px 14px;margin:0 0 14px}' +
    '.pa-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.pa-tabs button{border:0;border-radius:99px;padding:10px 18px;font:600 1rem Fredoka,system-ui,sans-serif;background:rgba(255,255,255,.14);color:#fff;cursor:pointer}.pa-tabs button.on{background:#fde047;color:#1e1b4b}' +
    '.cb-st img.cb-mon.pa-av{aspect-ratio:3/4;object-position:center bottom}';
  function ensureCss() { if (document.getElementById('pa-css')) return; var s = document.createElement('style'); s.id = 'pa-css'; s.textContent = CSS; document.head.appendChild(s); }

  var ui = { tab: 'make', pick: null, choice: null, cls: null, cat: 'clothing' };
  function close() { var o = document.getElementById('pa-ov'); if (o) o.remove(); }
  function pupils() {
    var st = store(); if (!st) return [];
    var cls = ui.cls || (st.getActiveClass ? st.getActiveClass() : null);
    return cls && st.getStudentsByClass ? st.getStudentsByClass(cls.id) : [];
  }
  function statusOf(id) { return data.approved[id] ? 'done' : (data.pending[id] ? 'wait' : ''); }

  function open(opts) {
    ensureCss();
    ui.tab = (opts && opts.tab) || 'make'; ui.pick = null; ui.choice = { skin: 'medium', tee: TEES[6], wear: {} };
    var st = store(); ui.cls = st && st.getActiveClass ? st.getActiveClass() : null;
    var p = state === 'idle' || state === 'error' ? load() : fetchWear();
    draw();
    p.then(draw);
  }
  function draw() {
    var o = document.getElementById('pa-ov');
    if (!o) { o = document.createElement('div'); o.id = 'pa-ov'; o.className = 'pa-ov'; document.body.appendChild(o); }
    var waiting = Object.keys(data.pending).filter(function (id) { return pupils().some(function (s) { return s.id === id; }); }).length;
    var html = '<div class="pa-box" role="dialog" aria-label="Avatars"><button class="pa-x" onclick="PupilAvatars.close()" aria-label="Close">✕</button>' +
      '<div class="pa-tabs">' +
      '<button class="' + (ui.tab === 'make' ? 'on' : '') + '" onclick="PupilAvatars._tab(\'make\')">🎨 Make my avatar</button>' +
      '<button class="' + (ui.tab === 'wardrobe' ? 'on' : '') + '" onclick="PupilAvatars._tab(\'wardrobe\')">👗 Wardrobe (124 items)</button>' +
      '<button class="' + (ui.tab === 'review' ? 'on' : '') + '" onclick="PupilAvatars._tab(\'review\')">✅ Teacher check' + (waiting ? ' (' + waiting + ')' : '') + '</button>' +
      '</div>';
    if (state === 'loading') html += '<p class="s">Loading avatars…</p>';
    if (state === 'nostore' && ui.tab !== 'wardrobe') html += '<div class="pa-note">Avatars are saved in a private cloud folder that is not ready yet. Ask your teacher to run <b>pupil_avatars_storage.sql</b> in Supabase, then sign in again.' + (lastError ? '<br><small>' + esc(lastError) + '</small>' : '') + '</div>';
    if (state === 'error') html += '<div class="pa-note">Could not reach the avatar folder. Check the internet and try again.<br><small>' + esc(lastError) + '</small></div>';
    html += ui.tab === 'review' ? reviewHtml() : (ui.tab === 'wardrobe' ? wardrobeHtml() : (ui.pick ? makeHtml() : namesHtml()));
    o.innerHTML = html + '</div>';
    if ((ui.tab === 'make' && ui.pick) || ui.tab === 'wardrobe') refreshPreview();
  }
  function namesHtml() {
    return '<h2>Who are you?</h2><p class="s">Tap your name, or open <b>👗 Wardrobe (124 items)</b> above to try on every outfit, hat, wig, and pair of shoes!</p><div class="pa-names">' +
      pupils().map(function (s) {
        var stt = statusOf(s.id);
        return '<button class="' + stt + '" onclick="PupilAvatars._pick(\'' + esc(s.id) + '\')">' + esc(firstName(s)) + (stt === 'done' ? '<small>✓ ready</small>' : stt === 'wait' ? '<small>waiting for teacher</small>' : '') + '</button>';
      }).join('') + '</div>';
  }
  function wardrobePickerHtml(c) {
    var activeCat = CATALOG.filter(function (x) { return x.key === ui.cat; })[0] || CATALOG[0];
    var curWear = (c && c.wear) || {};
    var curVal = curWear[activeCat.key] || '';
    return '<div class="pa-step"><b>3. Dress Up (' + CATALOG.reduce(function (n, x) { return n + x.items.length; }, 0) + ' items)</b>' +
      '<div class="pa-cats">' + CATALOG.map(function (cat) {
        var hasEq = curWear[cat.key] && curWear[cat.key] !== 'none';
        return '<button class="' + (activeCat.key === cat.key ? 'on' : '') + '" onclick="PupilAvatars._cat(\'' + cat.key + '\')">' +
          esc(cat.label) + ' (' + cat.items.length + ')' + (hasEq ? ' ✓' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="pa-grid">' +
      '<button class="pa-item ' + (!curVal || curVal === 'none' ? 'on' : '') + '" onclick="PupilAvatars._wear(\'' + activeCat.key + '\',\'none\')">' +
      '<div style="height:76px;display:flex;align-items:center;justify-content:center;font-size:2rem">🚫</div><span>None</span></button>' +
      activeCat.items.map(function (itemId) {
        var isOn = curVal === itemId;
        return '<button class="pa-item ' + (isOn ? 'on' : '') + '" onclick="PupilAvatars._wear(\'' + activeCat.key + '\',\'' + itemId + '\')">' +
          '<img src="' + BASE + 'wear/' + itemId + '.webp" loading="lazy" alt="' + esc(prettyName(itemId)) + '">' +
          '<span>' + esc(prettyName(itemId)) + '</span></button>';
      }).join('') +
      '</div></div>';
  }
  function makeHtml() {
    var s = pupils().filter(function (x) { return x.id === ui.pick; })[0];
    var c = ui.choice || { skin: 'medium', tee: TEES[6], wear: {} };
    return '<h2>Hello, ' + esc(firstName(s)) + '!</h2><p class="s">Choose your skin tone, T-shirt, and outfit, then tap “Send to my teacher”.</p>' +
      '<div class="pa-make"><div class="pa-prev"><img id="pa-prev" alt="Your avatar"></div><div>' +
      '<div class="pa-step"><b>1. Skin</b><div class="pa-tones">' + TONES.map(function (t) {
        var col = { light: '#f6d2bd', medium: '#e3a983', tan: '#c98a5e', dark: '#7a4b2e' }[t.id];
        return '<button class="' + (c.skin === t.id ? 'on' : '') + '" style="background:' + col + '" title="' + t.label + '" aria-label="' + t.label + '" onclick="PupilAvatars._set(\'skin\',\'' + t.id + '\')"></button>';
      }).join('') + '</div></div>' +
      '<div class="pa-step"><b>2. T-shirt</b><div class="pa-tees">' + TEES.map(function (col) {
        return '<button class="' + (c.tee === col ? 'on' : '') + '" style="background:' + col + '" aria-label="T-shirt colour" onclick="PupilAvatars._set(\'tee\',\'' + col + '\')"></button>';
      }).join('') + '</div></div>' +
      wardrobePickerHtml(c) +
      (heads[ui.pick] ? '' : '<p class="s">Your face picture is coming soon. Your teacher adds it.</p>') +
      '<div><button class="pa-go" onclick="PupilAvatars._send()">✓ Send to my teacher</button>' +
      '<button class="pa-go b" onclick="PupilAvatars._random()">🎲 Surprise me</button>' +
      '<button class="pa-go b" onclick="PupilAvatars._clearWear()">🧹 Plain outfit</button>' +
      '<button class="pa-go b" onclick="PupilAvatars._pick(null)">← Back</button></div>' +
      '</div></div>';
  }
  function wardrobeHtml() {
    var c = ui.choice || (ui.choice = { skin: 'medium', tee: TEES[6], wear: {} });
    var list = pupils();
    return '<h2>👗 Avatar Wardrobe — All 124 Cut-Out Items</h2>' +
      '<p class="s">Try on every new outfit, trousers/skirt, pair of shoes, wig, hat, glasses, backpack, and held accessory!</p>' +
      '<div class="pa-make"><div class="pa-prev"><img id="pa-prev" alt="Wardrobe preview">' +
      '<div style="margin-top:8px"><button class="pa-go b" style="padding:8px 14px;font-size:.95rem" onclick="PupilAvatars._random()">🎲 Random Outfit</button>' +
      '<button class="pa-go b" style="padding:8px 14px;font-size:.95rem" onclick="PupilAvatars._clearWear()">🧹 Clear</button></div></div><div>' +
      (list.length ? '<div class="pa-step"><b>Pupil model (optional)</b><div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<button class="pa-go b" style="padding:6px 12px;font-size:.9rem;' + (!ui.pick ? 'outline:3px solid #fde047' : '') + '" onclick="PupilAvatars._wardrobePick(null)">🙂 Demo Head</button>' +
        list.map(function (s) {
          return '<button class="pa-go b" style="padding:6px 12px;font-size:.9rem;' + (ui.pick === s.id ? 'outline:3px solid #fde047' : '') + '" onclick="PupilAvatars._wardrobePick(\'' + esc(s.id) + '\')">' + esc(firstName(s)) + (heads[s.id] ? ' 🙂' : '') + '</button>';
        }).join('') + '</div></div>' : '') +
      '<div class="pa-step"><b>1. Skin &amp; T-shirt</b><div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center"><div class="pa-tones">' + TONES.map(function (t) {
        var col = { light: '#f6d2bd', medium: '#e3a983', tan: '#c98a5e', dark: '#7a4b2e' }[t.id];
        return '<button class="' + (c.skin === t.id ? 'on' : '') + '" style="width:46px;height:46px;background:' + col + '" title="' + t.label + '" onclick="PupilAvatars._set(\'skin\',\'' + t.id + '\')"></button>';
      }).join('') + '</div><div class="pa-tees">' + TEES.map(function (col) {
        return '<button class="' + (c.tee === col ? 'on' : '') + '" style="width:38px;height:38px;background:' + col + '" onclick="PupilAvatars._set(\'tee\',\'' + col + '\')"></button>';
      }).join('') + '</div></div></div>' +
      wardrobePickerHtml(c) +
      (ui.pick ? '<div><button class="pa-go" onclick="PupilAvatars._saveDirect()">✓ Save &amp; Approve on Class Board</button></div>' : '') +
      '</div></div>';
  }
  function refreshPreview() {
    var el = document.getElementById('pa-prev'); if (!el) return;
    var id = ui.pick;
    var c = ui.choice || { skin: 'medium', tee: TEES[6], wear: {} };
    var headP = id ? (heads[id] ? Promise.resolve(heads[id]) : fetchHead(id).then(function (im) { if (im) heads[id] = im; return im; })) : (ui.tab === 'wardrobe' ? loadImg(BASE + 'head_demo.webp').catch(function () { return null; }) : Promise.resolve(null));
    headP.then(function (hIm) {
      return compose(c, hIm, id ? equippedOf(id) : {});
    }).then(function (u) {
      var curEl = document.getElementById('pa-prev');
      if (curEl) curEl.src = u;
    }).catch(function () { /* ignore */ });
  }
  function reviewHtml() {
    var list = pupils();
    var wait = list.filter(function (s) { return data.pending[s.id]; });
    var rest = list.filter(function (s) { return !data.pending[s.id]; });
    function card(s, pending) {
      var id = s.id, ch = pending ? data.pending[id] : data.approved[id];
      return '<div class="pa-card"><img id="pa-r-' + esc(id) + '" alt="' + esc(firstName(s)) + '">' +
        '<b>' + esc(firstName(s)) + '</b><br><small style="opacity:.75">' + esc(id) + '</small><br><small>' + (pending ? 'Waiting' : ch ? 'On the board' : 'No avatar yet') + (heads[id] ? ' · 🙂 face ready' : ' · no face yet') + '</small>' +
        '<div class="row">' + (pending ? '<button class="ok" onclick="PupilAvatars._approve(\'' + esc(id) + '\')">Approve</button><button class="no" onclick="PupilAvatars._reject(\'' + esc(id) + '\')">No</button>' : '') +
        '<label title="Add the cartoon head from Gemini (a PNG on the plain grey background)">🙂 Face<input type="file" accept="image/png,image/webp,image/jpeg" onchange="PupilAvatars._head(\'' + esc(id) + '\', this)"></label>' +
        '<button onclick="PupilAvatars._wardrobePick(\'' + esc(id) + '\');PupilAvatars._tab(\'wardrobe\')" title="Dress up this pupil">👗 Dress</button>' +
        (!pending && ch ? '<button onclick="PupilAvatars._remove(\'' + esc(id) + '\')" title="Back to the monster">Remove</button>' : '') +
        '</div></div>';
    }
    setTimeout(function () {
      list.forEach(function (s) {
        var ch = data.pending[s.id] || data.approved[s.id]; if (!ch && !heads[s.id]) return;
        compose(ch || {}, heads[s.id], equippedOf(s.id)).then(function (u) { var el = document.getElementById('pa-r-' + s.id); if (el) el.src = u; }).catch(function () { /* ignore */ });
      });
    }, 0);
    return '<h2>Teacher check</h2><p class="s">Approve an avatar to put it on the Class Board. Add each pupil\'s cartoon face from Gemini with “Face”, or upload the whole <code>heads\\</code> folder at once below. Faces stay in your private cloud folder.</p>' +
      '<div style="margin:0 0 16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
      '<label class="pa-go" style="display:inline-block;margin:0;cursor:pointer">📁 Upload all heads (select PNGs in heads\\)<input type="file" multiple accept="image/png,image/webp,image/jpeg" style="display:none" onchange="PupilAvatars._bulkHeads(this)"></label>' +
      '</div>' +
      (wait.length ? '<b>Waiting (' + wait.length + ')</b><div class="pa-rev" style="margin:8px 0 18px">' + wait.map(function (s) { return card(s, true); }).join('') + '</div>' : '<p>No avatars are waiting.</p>') +
      '<b>Everyone</b><div class="pa-rev" style="margin-top:8px">' + rest.map(function (s) { return card(s, false); }).join('') + '</div>';
  }

  // Cut the flat grey background off a Gemini head picture and save it as a 512 webp.
  function cleanHead(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var S = 512, c = document.createElement('canvas'); c.width = S; c.height = S;
        var g = c.getContext('2d'), side = Math.min(im.width, im.height);
        g.drawImage(im, (im.width - side) / 2, (im.height - side) / 2, side, side, 0, 0, S, S);
        var d = g.getImageData(0, 0, S, S), p = d.data;
        var bg = [p[0], p[1], p[2]];
        var seen = new Uint8Array(S * S), q = [];
        for (var i = 0; i < S; i++) { q.push(i, i + (S - 1) * S, i * S, i * S + S - 1); }
        function isBg(k) { var o = k * 4; return Math.abs(p[o] - bg[0]) < 22 && Math.abs(p[o + 1] - bg[1]) < 22 && Math.abs(p[o + 2] - bg[2]) < 22; }
        while (q.length) {
          var k = q.pop(); if (seen[k]) continue; seen[k] = 1;
          if (!isBg(k)) continue;
          p[k * 4 + 3] = 0;
          var x = k % S, y = (k / S) | 0;
          if (x > 0) q.push(k - 1); if (x < S - 1) q.push(k + 1); if (y > 0) q.push(k - S); if (y < S - 1) q.push(k + S);
        }
        g.putImageData(d, 0, 0);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? res(b) : rej(new Error('picture')); }, 'image/webp', 0.92);
      };
      im.onerror = function () { URL.revokeObjectURL(url); rej(new Error('Could not open that picture.')); };
      im.src = url;
    });
  }

  function toast(msg) { try { if (root.showToast) return root.showToast(msg); } catch (e) { /* ignore */ } try { console.info(msg); } catch (e2) { /* ignore */ } }
  function save() { return writeJson().catch(function (e) { toast('Could not save: ' + (e && e.message || e)); throw e; }); }
  function recompose(id) {
    delete composed[id];
    if (!data.approved[id]) return Promise.resolve();
    return compose(data.approved[id], heads[id], equippedOf(id)).then(function (u) { composed[id] = u; });
  }

  var api = {
    mode: mode, on: on, setMode: setMode, load: load, imgFor: imgFor, has: has, open: open, close: close,
    catalog: CATALOG,
    status: function () { return { state: state, error: lastError, approved: Object.keys(data.approved).length, pending: Object.keys(data.pending).length }; },
    toggleButton: function () {
      return '<button class="cb-look" onclick="PupilAvatars.setMode(PupilAvatars.on()?\'monsters\':\'avatars\')" title="Show monsters or the pupils\' avatars">' + (on() ? '🧒 Avatars' : '👾 Monsters') + '</button>' +
        (on() ? '<button class="cb-look" onclick="PupilAvatars.open()" title="Pupils make their avatar; the teacher checks it">🎨 Make avatars</button>' +
          '<button class="cb-look" onclick="PupilAvatars.open({tab:\'wardrobe\'})" title="Try on all 124 avatar clothes, shoes, wigs and hats">👗 Wardrobe</button>' : '');
    },
    _tab: function (t) {
      ui.tab = t;
      if (t === 'wardrobe' && !ui.choice) ui.choice = { skin: 'medium', tee: TEES[6], wear: {} };
      draw();
    },
    _cat: function (c) { ui.cat = c; draw(); },
    _wear: function (slot, itemId) {
      if (!ui.choice) ui.choice = { skin: 'medium', tee: TEES[6], wear: {} };
      if (!ui.choice.wear) ui.choice.wear = {};
      if (!itemId || itemId === 'none' || ui.choice.wear[slot] === itemId) delete ui.choice.wear[slot];
      else ui.choice.wear[slot] = itemId;
      draw();
    },
    _random: function () {
      if (!ui.choice) ui.choice = { skin: 'medium', tee: TEES[6], wear: {} };
      var w = {};
      ['clothing', 'legs', 'shoes', 'hat', 'glasses', 'backpack', 'accessory'].forEach(function (k) {
        var cat = CATALOG.filter(function (x) { return x.key === k; })[0];
        if (cat && cat.items.length && (k === 'clothing' || k === 'legs' || k === 'shoes' || Math.random() < 0.65)) {
          w[k] = cat.items[Math.floor(Math.random() * cat.items.length)];
        }
      });
      ui.choice.wear = w;
      draw();
    },
    _clearWear: function () {
      if (ui.choice) ui.choice.wear = {};
      draw();
    },
    _wardrobePick: function (id) {
      ui.pick = id || null;
      if (id) {
        var base = data.pending[id] || data.approved[id] || {};
        ui.choice = { skin: base.skin || 'medium', tee: base.tee || TEES[6], wear: Object.assign({}, base.wear || {}) };
      }
      draw();
    },
    _pick: function (id) {
      ui.pick = id || null;
      if (id) {
        var base = data.pending[id] || data.approved[id] || {};
        ui.choice = { skin: base.skin || 'medium', tee: base.tee || TEES[6], wear: Object.assign({}, base.wear || {}) };
      }
      draw();
    },
    _set: function (k, v) { if (!ui.choice) return; ui.choice[k] = v; draw(); },
    _send: function () {
      var id = ui.pick; if (!id) return;
      data.pending[id] = { skin: ui.choice.skin, tee: ui.choice.tee, wear: Object.assign({}, ui.choice.wear || {}), at: new Date().toISOString() };
      save().then(function () { try { root.classSoundboard && root.classSoundboard.playTaDa && root.classSoundboard.playTaDa(); } catch (e) { /* ignore */ } toast('Sent! Your teacher will check it.'); }).catch(function () { /* toast shown */ });
      ui.pick = null; draw();
    },
    _saveDirect: function () {
      var id = ui.pick; if (!id || !ui.choice) return;
      data.approved[id] = { skin: ui.choice.skin, tee: ui.choice.tee, wear: Object.assign({}, ui.choice.wear || {}), at: new Date().toISOString() };
      delete data.pending[id];
      recompose(id).then(function () {
        if (client()) return save();
      }).then(function () { toast('Saved onto the Class Board!'); draw(); if (on()) rerender(); }).catch(function () { draw(); if (on()) rerender(); });
    },
    _approve: function (id) {
      data.approved[id] = data.pending[id]; delete data.pending[id];
      save().then(function () { return recompose(id); }).then(function () { draw(); if (on()) rerender(); }).catch(function () { draw(); });
    },
    _reject: function (id) { delete data.pending[id]; save().then(draw).catch(draw); },
    _remove: function (id) { delete data.approved[id]; delete composed[id]; save().then(function () { draw(); rerender(); }).catch(draw); },
    _head: function (id, input) {
      var f = input && input.files && input.files[0]; if (!f) return;
      var sb = client();
      cleanHead(f).then(function (blob) {
        return new Promise(function (res) {
          var fr = new FileReader();
          fr.onload = function () { headB64[id] = fr.result; res(blob); };
          fr.onerror = function () { res(blob); };
          fr.readAsDataURL(blob);
        });
      }).then(function (blob) {
        if (sb) {
          sb.storage.from(BUCKET).upload('heads/' + id + '.webp', blob, { upsert: true, contentType: 'image/webp', cacheControl: '0' }).catch(function () {});
        }
        return loadImg(headB64[id] || URL.createObjectURL(blob));
      }).then(function (im) {
        heads[id] = im;
        if (!data.approved[id] && !data.pending[id]) {
          data.approved[id] = { skin: 'medium', tee: TEES[6], at: new Date().toISOString() };
        }
        return recompose(id);
      }).then(function () { if (sb) return save().catch(function () {}); })
        .then(function () { toast('Face saved.'); draw(); if (on()) rerender(); })
        .catch(function (e) { toast('Could not save the face: ' + (e && e.message || e)); });
    },
    _bulkHeads: function (input) {
      var files = input && input.files ? Array.prototype.slice.call(input.files) : [];
      if (!files.length) return;
      var sb = client();
      var count = 0;
      toast('Processing ' + files.length + ' head pictures…');
      var chain = Promise.resolve();
      files.forEach(function (f) {
        var m = String(f.name || '').match(/^(student-[a-z0-9-]+?)(-(?:laugh|wink))?\.(?:png|webp|jpe?g)$/i);
        if (!m) return;
        var studentId = m[1].toLowerCase();
        var suffix = (m[2] || '').toLowerCase();
        var stem = studentId + suffix;
        var storageName = 'heads/' + stem + '.webp';
        chain = chain.then(function () {
          return cleanHead(f).then(function (blob) {
            return new Promise(function (res) {
              var fr = new FileReader();
              fr.onload = function () { headB64[stem] = fr.result; res(blob); };
              fr.onerror = function () { res(blob); };
              fr.readAsDataURL(blob);
            });
          }).then(function (blob) {
            if (sb) {
              sb.storage.from(BUCKET).upload(storageName, blob, { upsert: true, contentType: 'image/webp', cacheControl: '0' }).catch(function () {});
            }
            return loadImg(headB64[stem]);
          }).then(function (im) {
            if (!suffix) {
              heads[studentId] = im;
              if (!data.approved[studentId]) {
                data.approved[studentId] = { skin: 'medium', tee: TEES[6], at: new Date().toISOString() };
              }
              count++;
              return recompose(studentId);
            }
          });
        }).catch(function (err) { console.warn('Skipped head', f.name, err); });
      });
      chain.then(function () {
        if (sb && count > 0) return save().catch(function () {});
      }).then(function () {
        toast('Uploaded and activated ' + count + ' pupil heads!');
        draw();
        if (on()) rerender();
      });
    },
    // for tests: compose without the cloud
    _compose: compose
  };
  root.PupilAvatars = api;

  // Start loading early when the teacher has the avatars look switched on.
  if (on()) { setTimeout(function () { if (state === 'idle') load(); }, 1500); }
})(typeof window !== 'undefined' ? window : this);
