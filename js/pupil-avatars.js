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
  var ASSET_V = '?v=17';
  var TONES = [
    { id: 'auto', label: 'Match Face ✨' },
    { id: 'light', label: 'Light' }, { id: 'medium', label: 'Medium' },
    { id: 'tan', label: 'Tan' }, { id: 'dark', label: 'Dark' }
  ];
  var TONE_PRESET_RGB = {
    light: [225, 169, 142],
    medium: [208, 142, 102],
    tan: [182, 118, 76],
    dark: [132, 80, 54]
  };
  var STANCES = [
    { id: 'natural', label: '🧍 Natural' },
    { id: 'hip',     label: '😎 Hip' },
    { id: 'wave',    label: '👋 Wave' },
    { id: 'cheer',   label: '🎉 Cheer' }
  ];
  var TEES = ['#ffffff', '#ef4444', '#f59e0b', '#facc15', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#1f2937'];

  // Frame: body art is 512x768 (from Gemini's 1024x1536). Seamless neck integration at y 86.
  var BODY_W = 512, BODY_H = 768;
  var HEAD = 300;          // head picture (square) drawn this size
  var CHIN = 0.78;         // chin sits at 78% of the head picture
  var NECK_Y = 86;         // where the chin lands smoothly on the neck
  var PAD = Math.ceil(HEAD * CHIN - NECK_Y) + 12; // room above the body for the head + sticker outline
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

  // Smart hair-tucking sets so wigs, helmets, and fitted hats never clash with big hair
  var WIG_LIKE = {
    'av-wig-rainbow': 1, 'av-wig-blue-spikes': 1, 'av-wig-pink-bob': 1, 'cs-vamp-hair': 1
  };
  var FITTED_HATS = {
    'cs-beanie': 1, 'cs-pumpkin-cap': 1, 'cs-night-cap': 1, 'cs-detective-cap': 1,
    'cs-chef-hat': 1, 'hat-scholar': 1, 'cs-pirate-hat': 1, 'hat-wizard': 1,
    'cs-wiz-hat': 1, 'cs-witch-hat': 1, 'hat-explorer': 1, 'cs-ranger-hat': 1
  };
  var VNECK_TOPS = {
    'cs-hanbok': 1, 'cs-ninja-gi': 1, 'cs-wiz-robe': 1, 'cs-pyjamas': 1,
    'cs-trench': 1, 'clothing-adv-jacket': 1, 'clothing-travel-coat': 1, 'clothing-vest': 1
  };
  var CHEST_SHADOW_ITEMS = {
    'neck-star': 1, 'neck-badge': 1, 'neck-medal': 1, 'neck-pendant': 1, 'cs-medal': 1, 'accessory-crown': 1
  };
  var FULL_BODY_SUITS = {
    'clothing-space': 1, 'clothing-hero': 1, 'clothing-knight-armor': 1, 'cs-pyjamas': 1,
    'cs-ninja-gi': 1, 'clothing-robe': 1, 'clothing-royal': 1, 'clothing-magic-robe': 1,
    'clothing-dragon-armor': 1, 'cs-hanbok': 1, 'cs-space-suit': 1, 'cs-hero-suit': 1,
    'cs-wiz-robe': 1, 'cs-knight-armor': 1, 'cs-mummy-wrap': 1, 'cs-skeleton-hoodie': 1
  };
  var DRAPED_ROBES = {
    'clothing-royal-robe': 1, 'clothing-robe': 1, 'clothing-magic-robe': 1, 'cs-wiz-robe': 1, 'clothing-hero': 1,
    'clothing-winter': 1, 'clothing-space': 1, 'clothing-scholar': 1, 'cs-hanbok': 1
  };
  var TORSO_ONLY_TOPS = {
    'clothing-scarf': 1, 'clothing-vest': 1, 'cs-scarf': 1
  };
  var GLOVED_SUITS = {
    'clothing-space': 1, 'clothing-hero': 1, 'cs-space-suit': 1,
    'cs-hero-suit': 1, 'cs-knight-armor': 1, 'cs-mummy-wrap': 1
  };
  var THREE_QUARTER_SLEEVES = {
    'clothing-travel-coat': 1, 'clothing-adv-jacket': 1
  };
  var RIGHT_HAND_PROPS = {
    'cs-teddy': 1, 'acc-compass': 1, 'acc-wand': 1, 'acc-book': 1, 'cs-magnifier': 1,
    'acc-trophy': 1, 'acc-microphone': 1, 'cs-ladle': 1, 'cs-wiz-staff': 1, 'cs-knight-shield': 1, 'cs-witch-broom': 1
  };
  var STAFF_PROPS = { 'cs-wiz-staff': 1, 'cs-witch-broom': 1, 'cs-ladle': 1 };
  var UPRIGHT_PROPS = { 'acc-trophy': 1, 'acc-book': 1, 'cs-teddy': 1, 'cs-knight-shield': 1 };
  var FREE_STARTER_ITEMS = {
    'clothing-hoodie': 1, 'clothing-school-jacket': 1, 'cs-sport-shirt': 1, 'clothing-scarf': 1,
    'av-legs-shorts': 1, 'av-legs-denim-shorts': 1, 'av-legs-skirt': 1, 'av-legs-joggers': 1,
    'av-shoes-red': 1, 'av-shoes-boots': 1, 'hat-star-clip': 1, 'hat-bow': 1, 'hat-headband': 1,
    'glasses-round': 1, 'bp-adv-bag': 1
  };

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
  var BUILTIN_EMOTIONS = {
    'student-3a-206-laugh': 1, 'student-3a-206-wink': 1,
    'student-3a-209-laugh': 1, 'student-3a-209-wink': 1,
    'student-3a-211-laugh': 1, 'student-3a-211-wink': 1,
    'student-3a-219-laugh': 1, 'student-3a-219-wink': 1,
    'student-3a-224-laugh': 1, 'student-3a-224-wink': 1,
    'student-3a-229-laugh': 1, 'student-3a-229-wink': 1,
    'student-3a-354-laugh': 1, 'student-3a-354-wink': 1,
    'student-3b-220-laugh': 1, 'student-3b-220-wink': 1,
    'student-3b-352-laugh': 1, 'student-3b-352-wink': 1,
    'student-3b-353-laugh': 1, 'student-3b-353-wink': 1,
    'student-4b-208-laugh': 1, 'student-4b-208-wink': 1,
    'student-4b-306-laugh': 1, 'student-4b-306-wink': 1,
    'student-4b-322-laugh': 1, 'student-4b-322-wink': 1,
    'student-4b-338-laugh': 1, 'student-4b-338-wink': 1
  };

  var data = { approved: {}, pending: {}, settings: { lockMode: 'free' } };
  var headB64 = {};        // stem -> data:image/webp;base64,... (teacher-locked cloud sync)
  var heads = {};          // studentId -> HTMLImageElement (memory only)
  var emotionHeads = {};   // stem (studentId-laugh / -wink) -> HTMLImageElement
  var composed = {};       // studentId -> data URL
  var composedEmotion = {};// studentId:kind -> data URL
  var emotionTimers = {};  // studentId -> timeout handle
  var imgCache = {};       // url -> Promise<Image>
  var wear = null;         // manifest of shop clothes made for avatars
  var state = 'idle';      // idle | loading | ready | nostore | error
  var lastError = '';
  var SYNC_ROW_ID = 'class-pupil-avatars';
  var LOCAL_KEY = 'eaa_pupil_avatars_v2';
  var headInfoCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  var gradedBodyCache = {};
  var gradedLegCache = {};
  var gradedTopCache = {};
  var bodyRefRgb = null;

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
  function lockMode() {
    return (data.settings && data.settings.lockMode === 'earned') ? 'earned' : 'free';
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
      data.approved = Object.assign({}, data.approved, localDoc.approved);
    }
    if (localDoc && localDoc.pending) {
      data.pending = Object.assign({}, data.pending, localDoc.pending);
    }
    if (localDoc && localDoc.settings) {
      data.settings = Object.assign({ lockMode: 'free' }, data.settings || {}, localDoc.settings);
    }
    if (!data.settings) data.settings = { lockMode: 'free' };
    BUILTIN_HEADS.forEach(function (sid, i) {
      if (!data.approved[sid]) {
        data.approved[sid] = {
          skin: 'auto',
          tee: TEES[i % TEES.length],
          wear: {},
          head: true,
          at: '2026-11-10T22:50:00.000Z'
        };
      } else if (!data.approved[sid].manualSkin) {
        data.approved[sid].skin = 'auto';
      }
    });
    Object.keys(data.approved).forEach(function (sid) {
      if (data.approved[sid] && !data.approved[sid].manualSkin) {
        data.approved[sid].skin = 'auto';
      }
    });
  }
  function saveLocal() {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({
        approved: data.approved,
        pending: data.pending,
        settings: data.settings || { lockMode: 'free' },
        at: new Date().toISOString()
      }));
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
    var doc = JSON.stringify({
      v: 2,
      at: new Date().toISOString(),
      approved: data.approved,
      pending: data.pending,
      settings: data.settings || { lockMode: 'free' },
      heads: headB64
    });
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
    var sb = client(); if (!sb) return Promise.resolve({ approved: {}, pending: {}, settings: { lockMode: 'free' } });
    return readSyncRow().then(function (syncDoc) {
      if (syncDoc && (syncDoc.approved || syncDoc.heads)) {
        if (syncDoc.v >= 2 && syncDoc.heads) headB64 = Object.assign({}, headB64, syncDoc.heads);
        return syncDoc;
      }
      return sb.storage.from(BUCKET).download('avatars.json').then(function (r) {
        if (r.error) return { approved: {}, pending: {}, settings: { lockMode: 'free' } };
        return r.data.text().then(function (t) { try { return JSON.parse(t) || {}; } catch (e) { return {}; } });
      }).catch(function () { return { approved: {}, pending: {}, settings: { lockMode: 'free' } }; });
    });
  }
  function writeJson() {
    saveLocal();
    var sb = client(); if (!sb) return Promise.resolve();
    return writeSyncRow().then(function () {
      var blob = new Blob([JSON.stringify({
        v: 2,
        approved: data.approved,
        pending: data.pending,
        settings: data.settings || { lockMode: 'free' },
        at: new Date().toISOString()
      })], { type: 'application/json' });
      return sb.storage.from(BUCKET).upload('avatars.json', blob, { upsert: true, contentType: 'application/json', cacheControl: '0' }).catch(function () { /* sync row already saved */ });
    });
  }
  function fetchHead(id) {
    if (headB64[id]) {
      return loadImg(headB64[id]).catch(function () { return null; });
    }
    return loadImg(BASE + 'heads/' + id + '.webp' + ASSET_V).catch(function () {
      var sb = client(); if (!sb) return null;
      return sb.storage.from(BUCKET).download('heads/' + id + '.webp').then(function (r) {
        if (r.error || !r.data) return null;
        return loadImg(URL.createObjectURL(r.data)).catch(function () { return null; });
      }).catch(function () { return null; });
    });
  }
  function fetchEmotionHead(id, kind) {
    if (!id || (kind !== 'laugh' && kind !== 'wink')) return Promise.resolve(null);
    var stem = id + '-' + kind;
    if (emotionHeads[stem]) return Promise.resolve(emotionHeads[stem]);
    if (headB64[stem]) {
      return loadImg(headB64[stem]).then(function (im) { emotionHeads[stem] = im; return im; }).catch(function () { return null; });
    }
    if (!BUILTIN_EMOTIONS[stem]) return Promise.resolve(null);
    return loadImg(BASE + 'heads/' + stem + '.webp' + ASSET_V).then(function (im) {
      emotionHeads[stem] = im;
      return im;
    }).catch(function () { return null; });
  }
  function fetchWear() {
    if (wear) return Promise.resolve(wear);
    return fetch(BASE + 'wear/manifest.json' + ASSET_V, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (m) { wear = m || {}; return wear; });
  }

  var loadPromise = null;
  function load() {
    ensureCss();
    if (state === 'loading' && loadPromise) return loadPromise;
    state = 'loading';
    loadPromise = Promise.all([readJson().catch(function () { return {}; }), fetchWear()]).then(function (res) {
      var d = res[0] || {};
      data = { approved: d.approved || {}, pending: d.pending || {}, settings: d.settings || { lockMode: 'free' } };
      seedBuiltinDefaults();
      var ids = Object.keys(data.approved).concat(Object.keys(data.pending));
      BUILTIN_HEADS.forEach(function (sid) { if (ids.indexOf(sid) < 0) ids.push(sid); });
      return Promise.all(ids.map(function (id) {
        return heads[id] ? null : fetchHead(id).then(function (im) { if (im) heads[id] = im; });
      }));
    }).then(function () {
      return Promise.all(Object.keys(data.approved).map(function (id) {
        return compose(data.approved[id], heads[id], equippedOf(id), 'smile', id).then(function (u) { composed[id] = u; }).catch(function () { /* keep monster */ });
      }));
    }).then(function () { state = 'ready'; loadPromise = null; if (on()) rerender(); })
      .catch(function (e) {
        lastError = String(e && e.message || e);
        state = 'ready';
        loadPromise = null;
        if (on()) rerender();
      });
    return loadPromise;
  }

  function equippedOf(id) {
    try { var p = store() && store().getMonsterProfile ? store().getMonsterProfile(id) : null; return (p && p.equipped) || {}; } catch (e) { return {}; }
  }

  // ---------- Teacher Earned-Mode vs Free Dress-Up lock helper ----------
  function itemLockInfo(studentId, itemId) {
    if (ui.tab === 'wardrobe' || lockMode() !== 'earned') return { locked: false, label: '' };
    if (!itemId || itemId === 'none' || FREE_STARTER_ITEMS[itemId]) return { locked: false, label: '' };
    if (studentId && data.approved[studentId] && data.approved[studentId].wear) {
      var aw = data.approved[studentId].wear;
      for (var k in aw) { if (aw[k] === itemId) return { locked: false, label: '' }; }
    }
    var st = store();
    var pupilLvl = 1;
    if (st && studentId && st.calculateMonsterState) {
      try {
        var ms = st.calculateMonsterState(studentId);
        pupilLvl = Number(ms && ms.level) || 1;
      } catch (e) { pupilLvl = 1; }
    }
    // Check schoolStore inventory & unlockedItems
    try {
      if (st && studentId) {
        var prof = st.getMonsterProfile ? st.getMonsterProfile(studentId) : null;
        if (prof && Array.isArray(prof.unlockedItems) && prof.unlockedItems.indexOf(itemId) >= 0) {
          return { locked: false, label: '' };
        }
        if (st.getStudentInventory) {
          var inv = st.getStudentInventory(studentId) || [];
          if (inv.some(function (e) { return e && (e.itemId === itemId || e.id === itemId || e.refId === itemId); })) {
            return { locked: false, label: '' };
          }
        }
      }
      if (root.ClassroomStore && studentId) {
        if (root.ClassroomStore.cosmetics && root.ClassroomStore.cosmetics.owns && root.ClassroomStore.cosmetics.owns(studentId, itemId)) return { locked: false, label: '' };
        if (root.ClassroomStore.owns && root.ClassroomStore.owns(studentId, itemId)) return { locked: false, label: '' };
      }
    } catch (e2) {}
    // Check Monster Studio level items (unlockRequirement.level or unlockLevel)
    if (st && st.getMonsterItems) {
      try {
        var mItems = st.getMonsterItems() || [];
        for (var i = 0; i < mItems.length; i++) {
          if (mItems[i].id === itemId) {
            var req = Number((mItems[i].unlockRequirement && mItems[i].unlockRequirement.level) || mItems[i].unlockLevel) || 1;
            if (pupilLvl >= req) return { locked: false, label: '' };
            return { locked: true, label: '🔒 Lv ' + req };
          }
        }
      } catch (e3) {}
    }
    var fallbackReq = itemId.indexOf('cs-my-') === 0 ? 6 : (itemId.indexOf('cs-') === 0 ? 4 : 3);
    if (pupilLvl >= fallbackReq) return { locked: false, label: '' };
    return { locked: true, label: itemId.indexOf('cs-') === 0 ? ('🪙 Shop · Lv ' + fallbackReq) : ('🔒 Lv ' + fallbackReq) };
  }

  // ---------- seamless skin-tone matching & 3D neck integration ----------
  function medianOf(arr) {
    if (!arr.length) return 0;
    var s = arr.slice().sort(function (a, b) { return a - b; });
    return s[s.length >> 1];
  }

  function analyzeHead(headImg) {
    if (!headImg) return { skinRgb: TONE_PRESET_RGB.light, backHair: null };
    if (headInfoCache && headInfoCache.has(headImg)) return headInfoCache.get(headImg);
    var S = 128, c = document.createElement('canvas'); c.width = S; c.height = S;
    var g = c.getContext('2d');
    g.drawImage(headImg, 0, 0, S, S);
    var px = g.getImageData(0, 0, S, S).data;

    function samplePatch(x0, y0, x1, y1) {
      var rs = [], gs = [], bs = [];
      for (var y = y0; y < y1; y++) {
        for (var x = x0; x < x1; x++) {
          var o = (y * S + x) * 4;
          var r = px[o], gr = px[o + 1], b = px[o + 2], a = px[o + 3];
          if (a > 220 && r > gr && (r - b) > 18 && r < 248) {
            rs.push(r); gs.push(gr); bs.push(b);
          }
        }
      }
      return rs.length > 4 ? [medianOf(rs), medianOf(gs), medianOf(bs)] : null;
    }

    var cL = samplePatch(44, 72, 53, 83);
    var cR = samplePatch(75, 72, 84, 83);
    var ch = samplePatch(57, 88, 71, 97);
    var pts = [];
    if (cL) pts.push(cL);
    if (cR) pts.push(cR);
    if (ch) { pts.push(ch); pts.push(ch); }
    var skinRgb = TONE_PRESET_RGB.light.slice();
    if (pts.length) {
      var sr = 0, sg = 0, sb = 0;
      pts.forEach(function (p) { sr += p[0]; sg += p[1]; sb += p[2]; });
      skinRgb = [
        Math.max(60, Math.min(245, Math.round((sr / pts.length) * 1.05))),
        Math.max(45, Math.min(220, Math.round((sg / pts.length) * 1.05))),
        Math.max(35, Math.min(205, Math.round((sb / pts.length) * 1.05)))
      ];
    }

    var lCount = 0, rCount = 0, hPts = [];
    for (var hy = 93; hy < 114; hy++) {
      for (var lx = 28; lx < 46; lx++) {
        var lo = (hy * S + lx) * 4;
        if (px[lo + 3] > 180) { lCount++; hPts.push([px[lo], px[lo + 1], px[lo + 2]]); }
      }
      for (var rx = 82; rx < 100; rx++) {
        var ro = (hy * S + rx) * 4;
        if (px[ro + 3] > 180) { rCount++; hPts.push([px[ro], px[ro + 1], px[ro + 2]]); }
      }
    }
    var backHair = null;
    if (lCount > 60 && rCount > 60 && hPts.length > 120) {
      var lums = hPts.map(function (p) { return (p[0] + p[1] + p[2]) / 3; }).sort(function (a, b) { return a - b; });
      var q25 = lums[Math.floor(lums.length * 0.25)] + 12;
      var dr = [], dg = [], db = [];
      hPts.forEach(function (p) {
        if ((p[0] + p[1] + p[2]) / 3 <= q25) { dr.push(p[0]); dg.push(p[1]); db.push(p[2]); }
      });
      var hr = Math.max(12, Math.min(200, Math.round(medianOf(dr) * 0.78)));
      var hg = Math.max(10, Math.min(190, Math.round(medianOf(dg) * 0.78)));
      var hb = Math.max(10, Math.min(185, Math.round(medianOf(db) * 0.78)));
      var minX = S, maxX = 0, maxY = 96;
      for (var sx = 0; sx < S; sx++) {
        if (px[(98 * S + sx) * 4 + 3] > 160) {
          if (sx < minX) minX = sx;
          if (sx > maxX) maxX = sx;
        }
      }
      for (var sy = 90; sy < S; sy++) {
        var rowHit = false;
        for (var cx = 26; cx < 48; cx++) { if (px[(sy * S + cx) * 4 + 3] > 160) rowHit = true; }
        for (var cx2 = 80; cx2 < 102; cx2++) { if (px[(sy * S + cx2) * 4 + 3] > 160) rowHit = true; }
        if (rowHit && sy > maxY) maxY = sy;
      }
      if (maxX > minX + 16) {
        backHair = {
          color: 'rgb(' + hr + ',' + hg + ',' + hb + ')',
          x1Norm: (minX + 3.5) / S,
          x2Norm: (maxX - 3.5) / S,
          y1Norm: 89 / S,
          y2Norm: (maxY - 1.5) / S
        };
      }
    }

    var out = { skinRgb: skinRgb, backHair: backHair };
    if (headInfoCache) headInfoCache.set(headImg, out);
    return out;
  }

  function getGradedBody(bodyLightImg, skinMaskImg, targetRgb, tag) {
    if (!skinMaskImg) return bodyLightImg;
    var key = (tag || '') + ':' + targetRgb.join(',');
    if (gradedBodyCache[key]) return gradedBodyCache[key];

    var c = document.createElement('canvas'); c.width = BODY_W; c.height = BODY_H;
    var g = c.getContext('2d');
    g.drawImage(bodyLightImg, 0, 0, BODY_W, BODY_H);
    var bd = g.getImageData(0, 0, BODY_W, BODY_H), bp = bd.data;

    var mc = document.createElement('canvas'); mc.width = BODY_W; mc.height = BODY_H;
    var mg = mc.getContext('2d');
    mg.drawImage(skinMaskImg, 0, 0, BODY_W, BODY_H);
    var mp = mg.getImageData(0, 0, BODY_W, BODY_H).data;

    if (!bodyRefRgb) {
      var rrs = [], rgs = [], rbs = [];
      for (var ry = 54; ry < 80; ry++) {
        for (var rx = 236; rx < 276; rx++) {
          var ro = (ry * BODY_W + rx) * 4;
          if (bp[ro + 3] > 200) { rrs.push(bp[ro]); rgs.push(bp[ro + 1]); rbs.push(bp[ro + 2]); }
        }
      }
      bodyRefRgb = rrs.length ? [medianOf(rrs), medianOf(rgs), medianOf(rbs)] : [232, 173, 146];
    }

    var kR = targetRgb[0] / Math.max(1, bodyRefRgb[0]);
    var kG = targetRgb[1] / Math.max(1, bodyRefRgb[1]);
    var kB = targetRgb[2] / Math.max(1, bodyRefRgb[2]);
    var cyChin = NECK_Y - 2;

    for (var y = 0; y < BODY_H; y++) {
      var dyNorm = (y - cyChin) / 16.0;
      var dy2 = dyNorm * dyNorm;
      for (var x = 0; x < BODY_W; x++) {
        var i = (y * BODY_W + x) * 4;
        var sa = mp[i + 3] / 255.0;
        if (sa <= 0.004) continue;
        var nr = Math.min(255, bp[i] * kR);
        var ng = Math.min(255, bp[i + 1] * kG);
        var nb = Math.min(255, bp[i + 2] * kB);
        var rMix = bp[i] * (1 - sa) + nr * sa;
        var gMix = bp[i + 1] * (1 - sa) + ng * sa;
        var bMix = bp[i + 2] * (1 - sa) + nb * sa;

        if (dy2 < 1.0 && x > 220 && x < 292) {
          var dxNorm = (x - 256.0) / 34.0;
          var ell = dxNorm * dxNorm + dy2;
          if (ell < 1.0) {
            var sh = (1.0 - ell) * 0.22 * sa;
            rMix *= (1.0 - sh * 0.75);
            gMix *= (1.0 - sh * 0.92);
            bMix *= (1.0 - sh * 1.05);
          }
        }
        bp[i] = rMix; bp[i + 1] = gMix; bp[i + 2] = bMix;
      }
    }
    g.putImageData(bd, 0, 0);
    gradedBodyCache[key] = c;
    return c;
  }

  function getGradedLeg(legImg, legId, targetRgb) {
    if (!legImg || (legId !== 'av-legs-shorts' && legId !== 'av-legs-denim-shorts' && legId !== 'av-legs-skirt')) {
      return legImg;
    }
    var key = legId + ':' + targetRgb.join(',');
    if (gradedLegCache[key]) return gradedLegCache[key];

    var c = document.createElement('canvas'); c.width = BODY_W; c.height = BODY_H;
    var g = c.getContext('2d');
    g.drawImage(legImg, 0, 0, BODY_W, BODY_H);
    var idat = g.getImageData(0, 495, BODY_W, 175), p = idat.data;
    var kR = targetRgb[0] / 165.0, kG = targetRgb[1] / 121.0, kB = targetRgb[2] / 90.0;
    for (var i = 0; i < p.length; i += 4) {
      if (p[i + 3] < 80) continue;
      var r = p[i], gr = p[i + 1], b = p[i + 2];
      if (Math.abs(r - 165) < 46 && Math.abs(gr - 121) < 40 && Math.abs(b - 90) < 38 && (r - gr) > 20 && (gr - b) > 12) {
        p[i] = Math.min(255, Math.round(r * kR));
        p[i + 1] = Math.min(255, Math.round(gr * kG));
        p[i + 2] = Math.min(255, Math.round(b * kB));
      }
    }
    g.putImageData(idat, 0, 495);
    gradedLegCache[key] = c;
    return c;
  }

  // Match any exposed V-neck / collar chest skin on open-collar outfits to pupil's exact skin tone
  function getGradedTop(topImg, topId, targetRgb) {
    if (!topImg || !VNECK_TOPS[String(topId).split('__')[0]]) return topImg;
    var key = topId + ':' + targetRgb.join(',');
    if (gradedTopCache[key]) return gradedTopCache[key];

    var c = document.createElement('canvas'); c.width = BODY_W; c.height = BODY_H;
    var g = c.getContext('2d');
    g.drawImage(topImg, 0, 0, BODY_W, BODY_H);
    var idat = g.getImageData(180, 0, 152, 240), p = idat.data;
    var kR = targetRgb[0] / 166.0, kG = targetRgb[1] / 122.0, kB = targetRgb[2] / 91.0;
    var changed = false;
    for (var i = 0; i < p.length; i += 4) {
      if (p[i + 3] < 80) continue;
      var r = p[i], gr = p[i + 1], b = p[i + 2];
      if (Math.abs(r - 166) < 42 && Math.abs(gr - 122) < 38 && Math.abs(b - 91) < 36 && (r - gr) > 20 && (gr - b) > 12) {
        p[i] = Math.min(255, Math.round(r * kR));
        p[i + 1] = Math.min(255, Math.round(gr * kG));
        p[i + 2] = Math.min(255, Math.round(b * kB));
        changed = true;
      }
    }
    if (changed) g.putImageData(idat, 180, 0);
    gradedTopCache[key] = c;
    return c;
  }

  // Smart hair-tucking so wigs, knight helmets, space helmets, and fitted hats fit every hairstyle cleanly
  function prepareHead(headImg, headIds) {
    if (!headImg || !headIds || !headIds.length) return { img: headImg, suppressBackHair: false };
    var hasWig = headIds.some(function (id) { return !!WIG_LIKE[id]; });
    var hasKnight = headIds.indexOf('cs-knight-helm') >= 0;
    var hasSpace = headIds.indexOf('cs-space-helmet') >= 0;
    var hasFitted = headIds.some(function (id) { return !!FITTED_HATS[id]; });
    if (!hasWig && !hasKnight && !hasSpace && !hasFitted) return { img: headImg, suppressBackHair: false };

    var c = document.createElement('canvas'); c.width = HEAD; c.height = HEAD;
    var g = c.getContext('2d');
    g.drawImage(headImg, 0, 0, HEAD, HEAD);

    if (hasWig || hasKnight || hasSpace) {
      var m = document.createElement('canvas'); m.width = HEAD; m.height = HEAD;
      var mg = m.getContext('2d');
      try { mg.filter = 'blur(2.5px)'; } catch (e) {}
      mg.fillStyle = '#ffffff';
      mg.beginPath();
      if (hasKnight) {
        mg.ellipse(HEAD * 0.50, HEAD * 0.60, HEAD * 0.17, HEAD * 0.16, 0, 0, Math.PI * 2);
      } else if (hasSpace) {
        mg.ellipse(HEAD * 0.50, HEAD * 0.485, HEAD * 0.29, HEAD * 0.295, 0, 0, Math.PI * 2);
      } else {
        mg.ellipse(HEAD * 0.50, HEAD * 0.565, HEAD * 0.185, HEAD * 0.225, 0, 0, Math.PI * 2);
        mg.fill();
        mg.beginPath();
        mg.ellipse(HEAD * 0.50, HEAD * 0.575, HEAD * 0.23, HEAD * 0.085, 0, 0, Math.PI * 2);
      }
      mg.fill();
      g.globalCompositeOperation = 'destination-in';
      g.drawImage(m, 0, 0);
      return { img: c, suppressBackHair: true };
    }

    // Fitted hat: tuck only the top hair dome (y < 35% of HEAD) while keeping shoulder hair & backHair!
    g.save();
    g.globalCompositeOperation = 'destination-out';
    try { g.filter = 'blur(3px)'; } catch (e2) {}
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, HEAD, Math.round(HEAD * 0.35));
    g.restore();
    return { img: c, suppressBackHair: false };
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

  // ---------- 2.5D Adaptive Pixar Skeletal Pose Engine ----------
  var rigMasksCache = null;
  function seamCurveL(y) {
    if (y < 170) return 146.0;
    if (y < 230) {
      var t = (y - 170.0) / 60.0;
      return 146.0 + (169.5 - 146.0) * (t * t * (3.0 - 2.0 * t));
    }
    if (y <= 265) return 169.5;
    return Math.max(146.0, 169.5 - (y - 265.0) * 0.175);
  }
  function getRigMasks() {
    if (rigMasksCache) return rigMasksCache;
    var W = BODY_W, H = BODY_H;
    var torsoKeep = new Float32Array(W * H);
    var armBaseL = new Float32Array(W * H);
    var Sx = 156.0, Sy = 180.0;
    for (var y = 0; y < H; y++) {
      var seamL = seamCurveL(y);
      for (var x = 0; x < W; x++) {
        var idx = y * W + x;
        var dxL = x - Sx, dyL = y - Sy;
        var distSL = Math.sqrt(dxL * dxL + dyL * dyL);
        var inArmL = ((y >= 172 && y <= 475 && x < seamL) ||
                      (distSL <= 40.0 && x < 176.0) ||
                      (y >= 144 && y < 185 && x < 154.0));
        armBaseL[idx] = inArmL ? 1.0 : 0.0;

        var xr = (W - 1) - x;
        // Keep inner collarbone shoulder cap (x >= 153 && y < 196) on torso, while releasing outer deltoid & full sleeve cleanly!
        var erL = (y >= 166 && y <= 475 && x < seamL && !(x >= 153.0 && y < 196.0)) ? 1.0 : 0.0;
        var erR = (y >= 166 && y <= 475 && xr < seamL && !(xr >= 153.0 && y < 196.0)) ? 1.0 : 0.0;
        torsoKeep[idx] = Math.max(0.0, 1.0 - erL - erR);
      }
    }
    // 1px box-feather on torsoKeep & armBaseL for silky anti-aliased transitions
    function feather3x3(src) {
      var dst = new Float32Array(W * H);
      dst.set(src);
      for (var fy = 1; fy < H - 1; fy++) {
        var row = fy * W;
        for (var fx = 1; fx < W - 1; fx++) {
          var k = row + fx;
          dst[k] = (src[k] * 4.0 + src[k - 1] + src[k + 1] + src[k - W] + src[k + W]) * 0.125;
        }
      }
      return dst;
    }
    rigMasksCache = {
      torsoKeep: feather3x3(torsoKeep),
      armBaseL: feather3x3(armBaseL)
    };
    return rigMasksCache;
  }

  function rotVec(dx, dy, deg) {
    var r = deg * Math.PI / 180.0;
    var c = Math.cos(r), s = Math.sin(r);
    return [dx * c - dy * s, dx * s + dy * c];
  }

  function hashId(str) {
    var h = 2166136261;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul ? Math.imul(h, 16777619) : ((h * 16777619) | 0);
    }
    return Math.abs(h | 0);
  }

  function resolvePoseSpec(choice, studentId, poseKind, L) {
    var stId = (choice && choice.stance) || 'natural';
    if (poseKind === 'laugh' || poseKind === 'dedicated-laugh') {
      stId = 'cheer';
    } else if ((poseKind === 'wink' || poseKind === 'dedicated-wink') && stId === 'natural') {
      stId = 'wave';
    }

    var sp;
    if (stId === 'hip') {
      sp = {
        armL_sh: -9.0, armL_el: -52.0, armR_sh: 17.0, armR_el: 15.0,
        legL_hip: 3.6, legL_knee: -2.5, legL_ankle: 2.5,
        legR_hip: -5.2, legR_knee: 8.2, legR_ankle: -5.0,
        torso_tilt: -1.4
      };
    } else if (stId === 'wave') {
      sp = {
        armL_sh: -16.5, armL_el: -15.5, armR_sh: 4.0, armR_el: -138.0,
        legL_hip: 2.2, legL_knee: -2.0, legL_ankle: 2.5,
        legR_hip: -3.8, legR_knee: 5.8, legR_ankle: -4.0,
        torso_tilt: -1.2
      };
    } else if (stId === 'cheer') {
      sp = {
        armL_sh: -4.0, armL_el: 138.0, armR_sh: 4.0, armR_el: -138.0,
        legL_hip: 3.8, legL_knee: -3.0, legL_ankle: 2.5,
        legR_hip: -3.8, legR_knee: 3.0, legR_ankle: -2.5,
        torso_tilt: 0.0
      };
    } else {
      sp = {
        armL_sh: -16.5, armL_el: -15.5, armR_sh: 16.5, armR_el: 15.5,
        legL_hip: 1.8, legL_knee: -1.8, legL_ankle: 2.5,
        legR_hip: -4.2, legR_knee: 6.8, legR_ankle: -4.5,
        torso_tilt: 0.8
      };
      // Subtle organic classroom personality so 17 pupils never look like identical clones
      if (studentId && !(choice && choice.stance)) {
        var h = hashId(studentId);
        var mirror = (h % 2) === 1;
        var micro = ((h % 7) - 3) * 0.45;
        if (mirror) {
          sp = {
            armL_sh: -16.5 + micro, armL_el: -15.5, armR_sh: 16.5 + micro, armR_el: 15.5,
            legL_hip: 4.2, legL_knee: -6.8, legL_ankle: 4.5,
            legR_hip: -1.8, legR_knee: 1.8, legR_ankle: -2.5,
            torso_tilt: -0.8
          };
        } else {
          sp.armL_sh += micro;
          sp.armR_sh += micro;
        }
        if ((h % 5) === 2) {
          sp.armL_sh = -12.5; sp.armL_el = -28.0;
        } else if ((h % 5) === 4) {
          sp.armR_sh = 12.5; sp.armR_el = 28.0;
        }
      }
    }

    // Smart wearable & prop adaptations
    var tops = (L && L.tops) || [];
    var legs = (L && L.legs) || [];
    sp.isSkirt = legs.some(function (id) { return id === 'av-legs-skirt' || id === 'av-legs-tutu'; });
    sp.hasDrapedRobe = tops.some(function (id) { return !!DRAPED_ROBES[id]; });

    if (tops.indexOf('cs-guitar') >= 0) {
      sp.armL_sh = -13.0; sp.armL_el = -28.0;
      sp.armR_sh = 12.0;  sp.armR_el = 24.0;
    }
    if (tops.some(function (id) { return !!STAFF_PROPS[id]; })) {
      sp.armR_sh = 11.0; sp.armR_el = 8.0;
    } else if (tops.some(function (id) { return !!UPRIGHT_PROPS[id]; }) && Math.abs(sp.armR_el) > 60.0) {
      sp.armR_sh = 10.0; sp.armR_el = -24.0;
    }
    if (sp.hasDrapedRobe) {
      // Gentle relaxed drape so velvet/wizard capes stay seamlessly attached
      sp.armL_sh = Math.max(-13.0, Math.min(8.0, sp.armL_sh * 0.72));
      sp.armL_el = Math.max(-22.0, Math.min(22.0, sp.armL_el * 0.55));
      sp.armR_sh = Math.max(-8.0, Math.min(13.0, sp.armR_sh * 0.72));
      sp.armR_el = Math.max(-22.0, Math.min(22.0, sp.armR_el * 0.55));
    }
    return sp;
  }

  function evalChainPoint(px, py, sx, sy, ex, ey, wx, wy, deg1, deg2, deg3) {
    var v1 = rotVec(ex - sx, ey - sy, deg1);
    var epX = sx + v1[0], epY = sy + v1[1];
    var tot2 = deg1 + deg2;
    var v2 = rotVec(wx - ex, wy - ey, tot2);
    var wpX = epX + v2[0], wpY = epY + v2[1];
    var tot3 = tot2 + (deg3 || 0);

    var l1 = Math.hypot(v1[0], v1[1]) || 1, l2 = Math.hypot(v2[0], v2[1]) || 1;
    var u1x = v1[0] / l1, u1y = v1[1] / l1;
    var u2x = v2[0] / l2, u2y = v2[1] / l2;
    var bx = u1x + u2x, by = u1y + u2y;
    var bl = Math.hypot(bx, by);
    if (bl < 0.2) { bx = -u1y; by = u1x; } else { bx /= bl; by /= bl; }

    var sEl = (px - epX) * bx + (py - epY) * by;
    var tEl = Math.max(0.0, Math.min(1.0, (sEl + 24.0) / 48.0));
    var wFore = tEl * tEl * (3.0 - 2.0 * tEl);

    var sWr = (px - wpX) * u2x + (py - wpY) * u2y;
    var tWr = Math.max(0.0, Math.min(1.0, (sWr + 16.0) / 32.0));
    var wHand = tWr * tWr * (3.0 - 2.0 * tWr);

    var b1 = rotVec(px - sx, py - sy, -deg1);
    var x1 = sx + b1[0], y1 = sy + b1[1];
    var b2 = rotVec(px - epX, py - epY, -tot2);
    var x2 = ex + b2[0], y2 = ey + b2[1];
    var b3 = rotVec(px - wpX, py - wpY, -tot3);
    var x3 = wx + b3[0], y3 = wy + b3[1];

    var fx = x2 * (1.0 - wHand) + x3 * wHand;
    var fy = y2 * (1.0 - wHand) + y3 * wHand;
    return [x1 * (1.0 - wFore) + fx * wFore, y1 * (1.0 - wFore) + fy * wFore];
  }

  function resampleFromCoarseGrid(srcCanvas, gxArr, gyArr, GW, GH) {
    var W = BODY_W, H = BODY_H;
    var sCtx = srcCanvas.getContext('2d');
    var sData = sCtx.getImageData(0, 0, W, H).data;
    var outCanvas = document.createElement('canvas'); outCanvas.width = W; outCanvas.height = H;
    var oCtx = outCanvas.getContext('2d');
    var oImg = oCtx.createImageData(W, H);
    var oData = oImg.data;

    var scaleX = (GW - 1.0) / (W - 1.0);
    var scaleY = (GH - 1.0) / (H - 1.0);

    for (var y = 0; y < H; y++) {
      var gy = y * scaleY;
      var iy = gy | 0; if (iy >= GH - 1) iy = GH - 2;
      var fy = gy - iy;
      var r0 = iy * GW, r1 = (iy + 1) * GW;
      for (var x = 0; x < W; x++) {
        var gx = x * scaleX;
        var ix = gx | 0; if (ix >= GW - 1) ix = GW - 2;
        var fx = gx - ix;

        var w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
        var i00 = r0 + ix, i10 = i00 + 1, i01 = r1 + ix, i11 = i01 + 1;
        var sx = gxArr[i00] * w00 + gxArr[i10] * w10 + gxArr[i01] * w01 + gxArr[i11] * w11;
        var sy = gyArr[i00] * w00 + gyArr[i10] * w10 + gyArr[i01] * w01 + gyArr[i11] * w11;

        if (sx < 0 || sx >= W - 1 || sy < 0 || sy >= H - 1) continue;
        var six = sx | 0, siy = sy | 0;
        var sfx = sx - six, sfy = sy - siy;
        var p00 = (siy * W + six) * 4;
        var p10 = p00 + 4;
        var p01 = p00 + W * 4;
        var p11 = p01 + 4;

        var a00 = sData[p00 + 3], a10 = sData[p10 + 3], a01 = sData[p01 + 3], a11 = sData[p11 + 3];
        if ((a00 | a10 | a01 | a11) === 0) continue;

        var sw00 = (1 - sfx) * (1 - sfy), sw10 = sfx * (1 - sfy), sw01 = (1 - sfx) * sfy, sw11 = sfx * sfy;
        var outA = a00 * sw00 + a10 * sw10 + a01 * sw01 + a11 * sw11;
        if (outA < 1.0) continue;

        var pm00 = sw00 * a00, pm10 = sw10 * a10, pm01 = sw01 * a01, pm11 = sw11 * a11;
        var invA = 1.0 / outA;
        var di = (y * W + x) * 4;
        oData[di]     = (sData[p00] * pm00 + sData[p10] * pm10 + sData[p01] * pm01 + sData[p11] * pm11) * invA;
        oData[di + 1] = (sData[p00 + 1] * pm00 + sData[p10 + 1] * pm10 + sData[p01 + 1] * pm01 + sData[p11 + 1] * pm11) * invA;
        oData[di + 2] = (sData[p00 + 2] * pm00 + sData[p10 + 2] * pm10 + sData[p01 + 2] * pm01 + sData[p11 + 2] * pm11) * invA;
        oData[di + 3] = outA;
      }
    }
    oCtx.putImageData(oImg, 0, 0);
    return outCanvas;
  }

  function extractAdaptiveArmPieces(armSrcCanvas, side) {
    var W = BODY_W, H = BODY_H;
    var sData = armSrcCanvas.getContext('2d').getImageData(0, 0, W, H).data;
    var masks = getRigMasks();
    var armBaseL = masks.armBaseL;

    // Measure actual opaque elbow half-width perpendicular to bind arm axis at (104, 286)
    var Ex0 = side === 'R' ? (W - 1.0 - 104.0) : 104.0, Ey0 = 286.0;
    var nx = side === 'R' ? -0.900 : 0.900, ny = 0.436;
    var firstT = null, lastT = null;
    for (var t = -44; t <= 44; t++) {
      var qx = Math.round(Ex0 + t * nx), qy = Math.round(Ey0 + t * ny);
      if (qx >= 0 && qx < W && qy >= 0 && qy < H) {
        if (sData[(qy * W + qx) * 4 + 3] > 80) {
          if (firstT === null) firstT = t;
          lastT = t;
        }
      }
    }
    var Ex = Ex0, Ey = Ey0, Rel = 22.0;
    if (firstT !== null && (lastT - firstT) >= 6) {
      var midT = 0.5 * (firstT + lastT);
      Ex = Ex0 + midT * nx;
      Ey = Ey0 + midT * ny;
      Rel = Math.max(14.0, 0.5 * (lastT - firstT) - 1.0);
    }

    var Sx = side === 'R' ? (W - 1.0 - 156.0) : 156.0, Sy = 180.0;
    var dxSE = Ex - Sx, dySE = Ey - Sy;
    var lSE = Math.hypot(dxSE, dySE) || 1.0;
    var ux = dxSE / lSE, uy = dySE / lSE;
    var pnx = -uy, pny = ux;

    var upCanvas = document.createElement('canvas'); upCanvas.width = W; upCanvas.height = H;
    var foCanvas = document.createElement('canvas'); foCanvas.width = W; foCanvas.height = H;
    var upCtx = upCanvas.getContext('2d'), foCtx = foCanvas.getContext('2d');
    var upImg = upCtx.createImageData(W, H), foImg = foCtx.createImageData(W, H);
    var upD = upImg.data, foD = foImg.data;

    for (var y = 135; y < 485; y++) {
      var row = y * W;
      for (var x = 0; x < W; x++) {
        if (side === 'L' && x > 188) continue;
        if (side === 'R' && x < W - 189) continue;
        var si = (row + x) * 4;
        var sa = sData[si + 3];
        if (sa === 0) continue;
        var mIdx = side === 'R' ? (row + (W - 1 - x)) : (row + x);
        var baseW = armBaseL[mIdx];
        if (baseW <= 0.004) continue;

        var rx = x - Ex, ry = y - Ey;
        var proj = rx * ux + ry * uy;
        var perp = Math.abs(rx * pnx + ry * pny);
        var dist = Math.sqrt(proj * proj + perp * perp);

        // Concentric rounded elbow cap with 1.5px soft edge
        var inUp = ((proj <= 0.0 && (proj <= -5.0 || perp <= Rel + 1.5)) || dist <= Rel + 0.6);
        var inFo = ((proj >= 0.0 && (proj >= 5.0 || perp <= Rel + 1.5)) || dist <= Rel - 0.4);

        if (inUp) {
          var uw = baseW;
          if (proj > 0.0 && dist > Rel - 1.0) uw *= Math.max(0.0, (Rel + 0.6 - dist) / 1.6);
          upD[si] = sData[si]; upD[si + 1] = sData[si + 1]; upD[si + 2] = sData[si + 2];
          upD[si + 3] = sa * uw;
        }
        if (inFo) {
          var fw = baseW;
          if (proj < 0.0 && dist > Rel - 2.0) fw *= Math.max(0.0, (Rel - 0.4 - dist) / 1.6);
          foD[si] = sData[si]; foD[si + 1] = sData[si + 1]; foD[si + 2] = sData[si + 2];
          foD[si + 3] = sa * fw;
        }
      }
    }
    upCtx.putImageData(upImg, 0, 0);
    foCtx.putImageData(foImg, 0, 0);
    return { up: upCanvas, fo: foCanvas, S: [Sx, Sy], E: [Ex, Ey] };
  }

  function drawPivotedCanvas(ctx, piece, srcPiv, dstPiv, deg) {
    ctx.save();
    ctx.translate(dstPiv[0], dstPiv[1]);
    ctx.rotate(deg * Math.PI / 180.0);
    ctx.translate(-srcPiv[0], -srcPiv[1]);
    ctx.drawImage(piece, 0, 0);
    ctx.restore();
  }

  function poseCharacterCanvas(torsoSrcCanvas, armSrcCanvas, rightHandPropCanvases, spec) {
    var W = BODY_W, H = BODY_H;
    var GH = 65, GW = 45;
    var gxArr = new Float32Array(GW * GH);
    var gyArr = new Float32Array(GW * GH);
    var tilt = spec.torso_tilt || 0.0;

    for (var iy = 0; iy < GH; iy++) {
      var py = iy * (H - 1.0) / (GH - 1.0);
      var ty = Math.max(0.0, Math.min(1.0, (py - 406.0) / 38.0));
      var wy = ty * ty * (3.0 - 2.0 * ty);

      // For wide draped robes, gently relax upper sleeves continuously on the same grid
      var tArmY = Math.max(0.0, Math.min(1.0, (py - 190.0) / 50.0)) * Math.max(0.0, Math.min(1.0, (475.0 - py) / 40.0));

      for (var ix = 0; ix < GW; ix++) {
        var px = ix * (W - 1.0) / (GW - 1.0);
        var dT = rotVec(px - 256.0, py - 415.0, -tilt);
        var torX = 256.0 + dT[0], torY = 415.0 + dT[1];

        if (spec.hasDrapedRobe && tArmY > 0.01) {
          if (px < 185.0) {
            var wAL = Math.max(0.0, Math.min(1.0, (180.0 - px) / 40.0)) * tArmY;
            var pAL = evalChainPoint(px, py, 156, 180, 105, 286, 62, 374, spec.armL_sh, spec.armL_el, 0);
            torX = torX * (1 - wAL) + pAL[0] * wAL;
            torY = torY * (1 - wAL) + pAL[1] * wAL;
          } else if (px > 327.0) {
            var wAR = Math.max(0.0, Math.min(1.0, (px - 332.0) / 40.0)) * tArmY;
            var pAR = evalChainPoint(px, py, 356, 180, 407, 286, 450, 374, spec.armR_sh, spec.armR_el, 0);
            torX = torX * (1 - wAR) + pAR[0] * wAR;
            torY = torY * (1 - wAR) + pAR[1] * wAR;
          }
        }

        var sx, sy;
        if (spec.isSkirt) {
          var pSk = evalChainPoint(px, py, 256, 420, 256, 555, 256, 680, spec.legL_hip * 0.55, spec.legL_knee * 0.55, 0);
          sx = torX * (1.0 - wy) + pSk[0] * wy;
          sy = torY * (1.0 - wy) + pSk[1] * wy;
        } else {
          var pLL = evalChainPoint(px, py, 210, 426, 205, 552, 200, 680, spec.legL_hip, spec.legL_knee, spec.legL_ankle);
          var pLR = evalChainPoint(px, py, 302, 426, 307, 552, 312, 680, spec.legR_hip, spec.legR_knee, spec.legR_ankle);
          var tx = Math.max(0.0, Math.min(1.0, (px - 244.0) / 24.0));
          var wx = tx * tx * (3.0 - 2.0 * tx);
          var wLL = wy * (1.0 - wx), wLR = wy * wx, wTor = 1.0 - wy;
          sx = torX * wTor + pLL[0] * wLL + pLR[0] * wLR;
          sy = torY * wTor + pLL[1] * wLL + pLR[1] * wLR;
        }
        var gi = iy * GW + ix;
        gxArr[gi] = sx;
        gyArr[gi] = sy;
      }
    }

    var outCanvas = resampleFromCoarseGrid(torsoSrcCanvas, gxArr, gyArr, GW, GH);
    var outCtx = outCanvas.getContext('2d');

    if (!spec.hasDrapedRobe && armSrcCanvas) {
      ['L', 'R'].forEach(function (side) {
        var shDeg = side === 'L' ? spec.armL_sh : spec.armR_sh;
        var elDeg = side === 'L' ? spec.armL_el : spec.armR_el;
        var pcs = extractAdaptiveArmPieces(armSrcCanvas, side);
        var dS = rotVec(pcs.S[0] - 256.0, pcs.S[1] - 415.0, tilt);
        var sDst = [256.0 + dS[0], 415.0 + dS[1]];
        var vE = rotVec(pcs.E[0] - pcs.S[0], pcs.E[1] - pcs.S[1], shDeg + tilt);
        var eDst = [sDst[0] + vE[0], sDst[1] + vE[1]];

        var armComb = document.createElement('canvas'); armComb.width = W; armComb.height = H;
        var ac = armComb.getContext('2d');
        drawPivotedCanvas(ac, pcs.up, pcs.S, sDst, shDeg + tilt);
        drawPivotedCanvas(ac, pcs.fo, pcs.E, eDst, shDeg + elDeg + tilt);

        if (side === 'R' && rightHandPropCanvases && rightHandPropCanvases.length) {
          rightHandPropCanvases.forEach(function (propIm) {
            drawPivotedCanvas(ac, propIm, pcs.E, eDst, shDeg + elDeg + tilt);
          });
        }

        // Subtle 3D contact shadow onto lower torso/hips (clipped to torso alpha so zero shadow floats outside)
        var shLayer = document.createElement('canvas'); shLayer.width = W; shLayer.height = H;
        var shc = shLayer.getContext('2d');
        shc.save();
        try { shc.filter = 'blur(3.5px)'; } catch (e) {}
        shc.drawImage(armComb, 0, 3);
        shc.restore();
        shc.globalCompositeOperation = 'source-in';
        var grad = shc.createLinearGradient(0, 232, 0, 268);
        grad.addColorStop(0, 'rgba(8, 12, 28, 0)');
        grad.addColorStop(1, 'rgba(8, 12, 28, 0.20)');
        shc.fillStyle = grad;
        shc.fillRect(0, 0, W, H);
        shc.globalCompositeOperation = 'destination-in';
        shc.drawImage(outCanvas, 0, 0);

        outCtx.drawImage(shLayer, 0, 0);
        outCtx.drawImage(armComb, 0, 0);
      });
    } else if (rightHandPropCanvases && rightHandPropCanvases.length) {
      rightHandPropCanvases.forEach(function (propIm) {
        outCtx.drawImage(propIm, 0, 0, W, H);
      });
    }

    return outCanvas;
  }

  function applyMaskAlpha(canvas, maskFloatArr) {
    var ctx = canvas.getContext('2d');
    var id = ctx.getImageData(0, 0, BODY_W, BODY_H);
    var p = id.data;
    for (var i = 0, n = BODY_W * BODY_H; i < n; i++) {
      p[i * 4 + 3] = (p[i * 4 + 3] * maskFloatArr[i]) | 0;
    }
    ctx.putImageData(id, 0, 0);
  }

  // lowest row where an outfit still covers both legs (in body-frame pixels), cached per item
  var LEG_COVER = {};
  function legCover(id, im) {
    if (LEG_COVER[id]) return LEG_COVER[id];
    var c = document.createElement('canvas'); c.width = BODY_W; c.height = BODY_H;
    var g = c.getContext('2d'); g.drawImage(im, 0, 0, BODY_W, BODY_H);
    var d = g.getImageData(0, 0, BODY_W, BODY_H).data, y = 700;
    function row(yy) { var n = 0; for (var x = 180; x < 332; x += 2) if (d[(yy * BODY_W + x) * 4 + 3] > 128) n++; return n; }
    while (y > 380 && row(y) < 40) y -= 2;
    LEG_COVER[id] = y; return y;
  }
  function compose(choice, headImg, eq, poseKind, studentId) {
    return fetchWear().then(function () {
      choice = choice || {};
      var mergedEq = Object.assign({}, eq || {}, choice.wear || {});
      var tone = TONES.some(function (t) { return t.id === choice.skin; }) ? choice.skin : 'auto';
      var L = wearLayers(mergedEq);
      // Drawn poses (arms only): laugh -> cheer, wink -> wave. Used when every top the pupil wears was drawn in that pose.
      var pose = /laugh/.test(poseKind || '') ? 'cheer' : (/wink/.test(poseKind || '') ? 'wave' : '');
      var poseIds = (wear && wear.poses && wear.poses[pose]) || null;
      if (pose && (!poseIds || L.tops.some(function (tid) { return SLOT_BY_ITEM[tid] === 'clothing' && poseIds.indexOf(tid) < 0; }))) pose = '';
      function wearUrl(id) { return BASE + 'wear/' + id + ((pose && poseIds.indexOf(id) >= 0) ? '__' + pose : '') + '.webp' + ASSET_V; }
      var need = [
        loadImg(BASE + (pose ? 'body_' + pose : 'body_light') + '.webp' + ASSET_V),
        loadImg(BASE + (pose ? 'skin_' + pose : 'skin_mask') + '.webp' + ASSET_V),
        loadImg(BASE + (pose ? 'tee_' + pose : 'tee_light') + '.webp' + ASSET_V)
      ]
        .concat(L.body.map(function (id) { return loadImg(wearUrl(id)); }))
        .concat(L.head.map(function (id) { return loadImg(BASE + 'wear/' + id + '.webp' + ASSET_V); }));
      return Promise.all(need.map(function (p) { return p.catch(function () { return null; }); })).then(function (ims) {
        var bodyLight = ims[0], skinMask = ims[1], teeMask = ims[2];
        if (!bodyLight) throw new Error('body');

        var info = analyzeHead(headImg);
        var targetRgb = TONE_PRESET_RGB[tone] || info.skinRgb;
        var gradedBody = getGradedBody(bodyLight, skinMask, targetRgb, pose);

        var W = BODY_W, H = BODY_H + PAD;
        var c = document.createElement('canvas'); c.width = Math.round(W * OUT_SCALE); c.height = Math.round(H * OUT_SCALE);
        var ctx = c.getContext('2d'); ctx.scale(OUT_SCALE, OUT_SCALE);

        var k = 3;
        var backIms = L.back.map(function () { return ims[k++]; });
        var legsIms = L.legs.map(function () { return ims[k++]; });
        var shoesIms = L.shoes.map(function () { return ims[k++]; });
        var topsIms = L.tops.map(function () { return ims[k++]; });
        var headIms = L.head.map(function () { return ims[k++]; });

        var poseSpec = resolvePoseSpec(choice, studentId, poseKind, L);
        // Clean pose: the body and every item are drawn exactly as the artist drew them (no bending of arms or legs).
        // The bending engine cut arms at the elbow and doubled hands, so it is off unless RIG_ON is set for testing.
        var straight = !root.__PA_RIG_ON;
        if (straight) poseSpec = { torso_tilt: 0, hasDrapedRobe: true, straight: true };
        var neckShift = rotVec(0, NECK_Y - 415.0, poseSpec.torso_tilt || 0.0);
        var neckDx = neckShift[0], neckDy = neckShift[1] - (NECK_Y - 415.0);

        var hx = (BODY_W - HEAD) / 2 + neckDx, hy = PAD + NECK_Y - HEAD * CHIN + neckDy;
        var prep = prepareHead(headImg, L.head);
        var bh = (!prep.suppressBackHair) ? info.backHair : null;
        var bx1 = 0, bx2 = 0, by1 = 0, by2 = 0;
        if (bh && headImg) {
          bx1 = Math.round(hx + bh.x1Norm * HEAD);
          bx2 = Math.round(hx + bh.x2Norm * HEAD);
          by1 = Math.round(hy + bh.y1Norm * HEAD);
          by2 = Math.min(Math.round(hy + bh.y2Norm * HEAD), PAD + 104);
        }

        // Compose character onto offscreen charCanvas so one unified outer sticker border wraps everything seamlessly
        var charCanvas = document.createElement('canvas'); charCanvas.width = W; charCanvas.height = H;
        var cc = charCanvas.getContext('2d');

        // 1. Back-hair curtain fill behind neck & collar for bob/long-haired pupils
        if (bh && headImg && bx2 > bx1 && by2 > by1) {
          cc.fillStyle = bh.color;
          cc.fillRect(bx1, by1, bx2 - bx1, by2 - by1);
        }

        // 2. Prepare skin-matched base body + T-shirt tint (punching out jeans along the T-shirt's natural curved hem)
        var hasFullSuit = L.tops.some(function (tid) { return !!FULL_BODY_SUITS[tid]; });
        var bodyLayer = document.createElement('canvas'); bodyLayer.width = BODY_W; bodyLayer.height = BODY_H;
        var bg = bodyLayer.getContext('2d');
        bg.drawImage(gradedBody, 0, 0, BODY_W, BODY_H);
        if (teeMask) {
          tint(bg, teeMask, choice.tee, 0, 0, BODY_W, BODY_H);
          bg.save();
          bg.globalCompositeOperation = 'destination-in';
          bg.drawImage(gradedBody, 0, 0, BODY_W, BODY_H);
          bg.restore();
        }
        if (hasFullSuit || legsIms.some(Boolean)) {
          bg.save();
          bg.globalCompositeOperation = 'destination-out';
          bg.beginPath();
          // erase the jeans only as far down as the outfit really covers the legs (a knee-length robe keeps the legs below its hem)
          var cutTo = 670;
          if (hasFullSuit && !legsIms.some(Boolean)) {
            cutTo = 378;
            L.tops.forEach(function (tid, ix) { if (FULL_BODY_SUITS[tid] && topsIms[ix]) cutTo = Math.max(cutTo, Math.min(670, legCover(tid, topsIms[ix]) - 10)); });
          }
          bg.moveTo(136, 378);
          bg.quadraticCurveTo(256, 391, 376, 378);
          bg.lineTo(376, cutTo);
          bg.lineTo(136, cutTo);
          bg.closePath();
          bg.fill();
          bg.restore();
        }
        if (shoesIms.some(Boolean)) {
          bg.clearRect(115, 672, 282, 96);
        }
        // Punch out hidden upper arms / T-shirt sleeves beneath long-sleeved or gloved outfits so zero inner arm sliver peeks out
        var armEraseMaxY = 0;
        L.tops.forEach(function (tid, idx) {
          if (!topsIms[idx]) return;
          if (SLOT_BY_ITEM[tid] === 'accessory' || CHEST_SHADOW_ITEMS[tid] || TORSO_ONLY_TOPS[tid] || tid === 'cs-sport-shirt') return;
          if (GLOVED_SUITS[tid]) armEraseMaxY = Math.max(armEraseMaxY, 470);
          else if (THREE_QUARTER_SLEEVES[tid]) armEraseMaxY = Math.max(armEraseMaxY, 304);
          else armEraseMaxY = Math.max(armEraseMaxY, 346);
        });
        if (armEraseMaxY > 0 && pose && teeMask) {
          // drawn pose: hide the T-shirt sleeves under a long-sleeved outfit
          var sl = document.createElement('canvas'); sl.width = BODY_W; sl.height = BODY_H;
          var slg = sl.getContext('2d'); slg.drawImage(teeMask, 0, 0, BODY_W, BODY_H); slg.clearRect(170, 0, 172, BODY_H);
          bg.save(); bg.globalCompositeOperation = 'destination-out'; bg.drawImage(sl, 0, 0); bg.restore();
        }
        if (armEraseMaxY > 0 && !pose) {
          bg.clearRect(0, 148, 171, armEraseMaxY - 148);
          bg.clearRect(BODY_W - 171, 148, 171, armEraseMaxY - 148);
        }

        // 3. Assemble bind-pose Torso+Legs canvas AND Arm+Sleeves canvas for 2.5D skeletal articulation
        var torsoSrc = document.createElement('canvas'); torsoSrc.width = BODY_W; torsoSrc.height = BODY_H;
        var tc = torsoSrc.getContext('2d');
        var armSrc = document.createElement('canvas'); armSrc.width = BODY_W; armSrc.height = BODY_H;
        var ac = armSrc.getContext('2d');

        if (!hasFullSuit) {
          legsIms.forEach(function (im, idx) {
            if (im && L.legs[idx] !== 'av-legs-tutu') {
              tc.drawImage(getGradedLeg(im, L.legs[idx], targetRgb), 0, 0, BODY_W, BODY_H);
            }
          });
        }

        // Base body goes to both armSrc (for sleeves/hands) and torsoSrc (masked by torsoKeep if articulated arms)
        ac.drawImage(bodyLayer, 0, 0);
        if (!poseSpec.hasDrapedRobe) {
          var bodyTorsoOnly = document.createElement('canvas'); bodyTorsoOnly.width = BODY_W; bodyTorsoOnly.height = BODY_H;
          bodyTorsoOnly.getContext('2d').drawImage(bodyLayer, 0, 0);
          applyMaskAlpha(bodyTorsoOnly, getRigMasks().torsoKeep);
          tc.drawImage(bodyTorsoOnly, 0, 0);
        } else {
          tc.drawImage(bodyLayer, 0, 0);
        }

        if (!hasFullSuit) {
          legsIms.forEach(function (im, idx) {
            if (im && L.legs[idx] === 'av-legs-tutu') {
              tc.drawImage(im, 0, 0, BODY_W, BODY_H);
            }
          });
        }

        backIms.forEach(function (im) { if (im) tc.drawImage(im, 0, 0, BODY_W, BODY_H); });
        shoesIms.forEach(function (im) { if (im) tc.drawImage(im, 0, 0, BODY_W, BODY_H); });

        var confettiIm = null;
        var rightHandProps = [];
        topsIms.forEach(function (im, idx) {
          if (!im) return;
          var tid = L.tops[idx];
          if (tid === 'acc-confetti') { confettiIm = im; return; }
          if (pose && RIGHT_HAND_PROPS[tid]) return;   // held things wait for their own pose drawings
          var graded = getGradedTop(im, tid + (pose ? '__' + pose : ''), targetRgb);
          if (RIGHT_HAND_PROPS[tid]) {
            rightHandProps.push(graded);
            return;
          }
          if (CHEST_SHADOW_ITEMS[tid]) {
            tc.save();
            tc.shadowColor = 'rgba(10, 8, 30, 0.24)';
            tc.shadowBlur = 4;
            tc.shadowOffsetY = 2;
            tc.drawImage(graded, 0, 0, BODY_W, BODY_H);
            tc.restore();
            return;
          }
          if (SLOT_BY_ITEM[tid] === 'accessory' || TORSO_ONLY_TOPS[tid] || poseSpec.hasDrapedRobe) {
            tc.drawImage(graded, 0, 0, BODY_W, BODY_H);
          } else {
            // Sleeved / fitted outfit: sleeves bend with armSrc, torso stays on torsoSrc!
            ac.drawImage(graded, 0, 0, BODY_W, BODY_H);
            var topTorsoOnly = document.createElement('canvas'); topTorsoOnly.width = BODY_W; topTorsoOnly.height = BODY_H;
            topTorsoOnly.getContext('2d').drawImage(graded, 0, 0, BODY_W, BODY_H);
            applyMaskAlpha(topTorsoOnly, getRigMasks().torsoKeep);
            tc.drawImage(topTorsoOnly, 0, 0);
          }
        });

        var posedBodyCanvas;
        if (straight) { rightHandProps.forEach(function (im) { tc.drawImage(im, 0, 0, BODY_W, BODY_H); }); posedBodyCanvas = torsoSrc; }
        else posedBodyCanvas = poseCharacterCanvas(torsoSrc, armSrc, rightHandProps, poseSpec);
        cc.drawImage(posedBodyCanvas, 0, PAD, BODY_W, BODY_H);

        // 5. Draw prepared head + head wearables (following subtle torso posture & playful emotion tilt)
        var headTiltRad = ((poseSpec.torso_tilt || 0) * 0.65) * Math.PI / 180.0;
        if (poseKind === 'laugh') headTiltRad += -0.055;
        else if (poseKind === 'wink') headTiltRad += 0.065;

        cc.save();
        if (Math.abs(headTiltRad) > 0.001) {
          var pivX = BODY_W / 2 + neckDx, pivY = PAD + NECK_Y + neckDy;
          cc.translate(pivX, pivY);
          cc.rotate(headTiltRad);
          cc.translate(-pivX, -pivY);
        }
        if (prep.img) cc.drawImage(prep.img, hx, hy, HEAD, HEAD);
        else drawBlankHead(cc, hx, hy);
        headIms.forEach(function (im) {
          if (!im) return;
          cc.save();
          cc.shadowColor = 'rgba(10, 8, 30, 0.22)';
          cc.shadowBlur = 4;
          cc.shadowOffsetY = 2;
          cc.drawImage(im, hx, hy, HEAD, HEAD);
          cc.restore();
        });
        cc.restore();

        // 6. Grounded elliptical contact shadow beneath the shoes
        var shGrad = ctx.createRadialGradient(BODY_W / 2, PAD + 754, 12, BODY_W / 2, PAD + 754, 122);
        shGrad.addColorStop(0, 'rgba(6, 9, 20, 0.36)');
        shGrad.addColorStop(0.65, 'rgba(6, 9, 20, 0.16)');
        shGrad.addColorStop(1, 'rgba(6, 9, 20, 0)');
        ctx.save();
        ctx.translate(BODY_W / 2, PAD + 754);
        ctx.scale(1, 0.14);
        ctx.fillStyle = shGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 122, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 7. Stamp one unified 5.0px pure-white outer sticker border around the entire composed character (thresholded so faint edges stay razor-clean)
        var sil = document.createElement('canvas'); sil.width = W; sil.height = H;
        var sg = sil.getContext('2d');
        sg.drawImage(charCanvas, 0, 0);
        var silData = sg.getImageData(0, 0, W, H), spx = silData.data;
        for (var si2 = 0, sn2 = W * H; si2 < sn2; si2++) {
          var sa2 = spx[si2 * 4 + 3];
          spx[si2 * 4] = 255; spx[si2 * 4 + 1] = 255; spx[si2 * 4 + 2] = 255;
          spx[si2 * 4 + 3] = sa2 > 48 ? 255 : 0;
        }
        sg.putImageData(silData, 0, 0);

        for (var aIdx = 0; aIdx < 20; aIdx++) {
          var ang = (aIdx / 20) * Math.PI * 2;
          ctx.drawImage(sil, Math.cos(ang) * 5.0, Math.sin(ang) * 5.0);
        }
        for (var aIdx2 = 0; aIdx2 < 12; aIdx2++) {
          var ang2 = (aIdx2 / 12) * Math.PI * 2;
          ctx.drawImage(sil, Math.cos(ang2) * 2.5, Math.sin(ang2) * 2.5);
        }
        ctx.drawImage(sil, 0, 0);

        // 8. Draw composed character + floating confetti (if equipped)
        ctx.drawImage(charCanvas, 0, 0);
        if (confettiIm) ctx.drawImage(confettiIm, 0, PAD, BODY_W, BODY_H);

        return c.toDataURL('image/webp', 0.9);
      });
    });
  }

  function composeForPose(id, choice, baseHeadImg, eq, pose) {
    if (!pose || pose === 'smile') return compose(choice, baseHeadImg, eq, 'smile', id);
    if (!id) return compose(choice, baseHeadImg, eq, pose, null);
    return fetchEmotionHead(id, pose).then(function (emHead) {
      if (emHead) return compose(choice, emHead, eq, 'dedicated-' + pose, id);
      return compose(choice, baseHeadImg, eq, pose, id);
    });
  }

  function triggerEmotion(id, kind, ms) {
    if (!on() || !id || !data.approved[id]) return Promise.resolve('');
    var dur = ms || 2300;
    var key = id + ':' + kind;
    var p = composedEmotion[key]
      ? Promise.resolve(composedEmotion[key])
      : composeForPose(id, data.approved[id], heads[id], equippedOf(id), kind).then(function (u) {
          if (u) composedEmotion[key] = u;
          return u;
        }).catch(function () { return ''; });

    return p.then(function (u) {
      if (!u) return '';
      var card = document.getElementById('cb-' + id);
      var img = card ? card.querySelector('img.cb-mon') : null;
      if (img) {
        img.src = u;
        img.classList.remove('cb-bounce');
        void img.offsetWidth;
        img.classList.add('cb-bounce');
      }
      if (emotionTimers[id]) clearTimeout(emotionTimers[id]);
      emotionTimers[id] = setTimeout(function () {
        delete emotionTimers[id];
        var cNow = document.getElementById('cb-' + id);
        var iNow = cNow ? cNow.querySelector('img.cb-mon') : null;
        if (iNow && composed[id]) iNow.src = composed[id];
      }, dur);
      return u;
    });
  }

  function drawBlankHead(ctx, hx, hy) {
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
    '.pa-x{position:absolute;right:16px;top:14px;border:0;border-bottom:4px solid rgba(0,0,0,.3);background:rgba(255,255,255,.15);color:#fff;font-size:1.4rem;width:46px;height:46px;border-radius:50%;cursor:pointer}' +
    '.pa-names{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}' +
    '.pa-names button{min-height:64px;border:0;border-radius:18px;background:rgba(255,255,255,.14);color:#fff;font:600 1.25rem Fredoka,system-ui,sans-serif;cursor:pointer;position:relative;border-bottom:5px solid rgba(0,0,0,.32);transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
    '.pa-names button:active{transform:translateY(4px);border-bottom-width:1px}' +
    '.pa-names button.done{background:rgba(34,197,94,.35)}.pa-names button.wait{background:rgba(245,158,11,.35)}' +
    '.pa-names button small{display:block;font-size:.75rem;opacity:.85;font-weight:500}' +
    '.pa-make{display:grid;grid-template-columns:minmax(240px,340px) 1fr;gap:24px;align-items:start}@media(max-width:760px){.pa-make{grid-template-columns:1fr}}' +
    '.pa-prev{background:radial-gradient(circle at 50% 30%,rgba(255,255,255,.25),rgba(255,255,255,.05));border-radius:24px;padding:12px;text-align:center;position:sticky;top:8px}.pa-prev img{width:100%;max-height:52vh;object-fit:contain}' +
    '.pa-poses{display:flex;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap}.pa-poses button{border:0;border-bottom:4px solid rgba(0,0,0,.3);border-radius:99px;padding:6px 12px;font:600 .88rem Fredoka,system-ui,sans-serif;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
    '.pa-poses button.on{background:#fde047;color:#1e1b4b;border-bottom-color:#ca8a04}.pa-poses button:active{transform:translateY(3px);border-bottom-width:1px}' +
    '.pa-step{margin-bottom:16px}.pa-step b{display:block;font-size:1.15rem;margin-bottom:8px}' +
    '.pa-tones{display:flex;gap:12px;flex-wrap:wrap}.pa-tones button{width:64px;height:64px;border-radius:50%;border:4px solid transparent;cursor:pointer;box-shadow:0 6px 14px rgba(0,0,0,.35)}' +
    '.pa-tones button.on,.pa-tees button.on{border-color:#fde047;transform:scale(1.08)}' +
    '.pa-tees{display:flex;gap:10px;flex-wrap:wrap}.pa-tees button{width:50px;height:50px;border-radius:14px;border:4px solid rgba(255,255,255,.25);cursor:pointer}' +
    '.pa-go{border:0;border-radius:18px;padding:13px 22px;font:700 1.15rem Fredoka,system-ui,sans-serif;cursor:pointer;background:#22c55e;color:#fff;border-bottom:5px solid #15803d;margin-right:8px;margin-top:6px;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
    '.pa-go:active{transform:translateY(4px);border-bottom-width:1px}' +
    '.pa-go.b{background:rgba(255,255,255,.18);border-bottom-color:rgba(0,0,0,.28)}.pa-go.r{background:#ef4444;border-bottom-color:#991b1b}.pa-go.gold{background:#f59e0b;color:#1e1b4b;border-bottom-color:#b45309}' +
    '.pa-cats{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}.pa-cats button{border:0;border-radius:14px;padding:8px 13px;font:600 .92rem Fredoka,system-ui,sans-serif;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;border-bottom:5px solid rgba(0,0,0,.28);transition:transform .12s}' +
    '.pa-cats button:active{transform:translateY(4px);border-bottom-width:1px}.pa-cats button.on{background:#38bdf8;color:#0f172a;border-bottom-color:#0284c7}' +
    '.pa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:10px;max-height:46vh;overflow-y:auto;padding:4px}' +
    '.pa-item{position:relative;border:2px solid rgba(255,255,255,.16);border-bottom:5px solid rgba(0,0,0,.35);border-radius:16px;background:rgba(15,23,42,.55);color:#fff;padding:8px 6px;cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
    '.pa-item:hover{transform:translateY(-2px)}.pa-item:active{transform:translateY(4px);border-bottom-width:2px}.pa-item.on{border-color:#fde047;background:rgba(250,204,21,.22)}' +
    '.pa-item.locked{pointer-events:none!important;opacity:.45!important;filter:grayscale(.7)!important;cursor:not-allowed!important}' +
    '.pa-lock{position:absolute;top:5px;right:5px;background:rgba(15,23,42,.9);border:1px solid rgba(251,191,36,.6);color:#fde68a;border-radius:99px;padding:1px 6px;font-size:.66rem;font-weight:700}' +
    '.pa-item img{width:76px;height:76px;object-fit:contain;filter:drop-shadow(0 3px 6px rgba(0,0,0,.4))}' +
    '.pa-item span{font-size:.78rem;line-height:1.15;font-weight:600}' +
    '.pa-rev{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}.pa-card{background:rgba(255,255,255,.1);border-radius:20px;padding:10px;text-align:center}.pa-card img{width:100%;height:220px;object-fit:contain}' +
    '.pa-card .row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px}.pa-card .row button,.pa-card label{border:0;border-bottom:4px solid rgba(0,0,0,.28);border-radius:12px;padding:8px 12px;font:600 .95rem Fredoka,system-ui,sans-serif;cursor:pointer;background:rgba(255,255,255,.18);color:#fff}' +
    '.pa-card .row .ok{background:#22c55e;border-bottom-color:#15803d}.pa-card .row .no{background:#ef4444;border-bottom-color:#991b1b}.pa-card input{display:none}' +
    '.pa-note{background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.6);border-radius:14px;padding:10px 14px;margin:0 0 14px}' +
    '.pa-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.pa-tabs button{border:0;border-bottom:5px solid rgba(0,0,0,.28);border-radius:99px;padding:10px 18px;font:600 1rem Fredoka,system-ui,sans-serif;background:rgba(255,255,255,.14);color:#fff;cursor:pointer}.pa-tabs button.on{background:#fde047;color:#1e1b4b;border-bottom-color:#ca8a04}' +
    '@keyframes paIdleBreath{0%,100%{transform:translateY(0) scale(1.12)}50%{transform:translateY(-4px) scale(1.135)}}' +
    '.cb-st img.cb-mon.pa-av{aspect-ratio:3/4;object-position:center bottom}' +
    '.cb-mg.scene .cb-pw img.cb-mon.pa-av{transform:scale(1.12);transform-origin:50% 94%;animation:paIdleBreath 3.6s ease-in-out infinite;animation-delay:calc(var(--i,0) * -0.37s)}' +
    '.cb-mg.scene .cb-pw img.cb-mon.pa-av.cb-bounce{animation:cbMonBounce .45s cubic-bezier(.175,.885,.32,1.275)!important}';
  function ensureCss() {
    if (typeof document === 'undefined' || !document.head || document.getElementById('pa-css')) return;
    var s = document.createElement('style'); s.id = 'pa-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  var ui = { isOpen: false, tab: 'make', pick: null, choice: null, cls: null, cat: 'clothing', pose: 'smile' };
  function close() { ui.isOpen = false; var o = document.getElementById('pa-ov'); if (o) o.remove(); }
  function pupils() {
    var st = store(); if (!st) return [];
    var cls = ui.cls || (st.getActiveClass ? st.getActiveClass() : null);
    return cls && st.getStudentsByClass ? st.getStudentsByClass(cls.id) : [];
  }
  function statusOf(id) { return data.approved[id] ? 'done' : (data.pending[id] ? 'wait' : ''); }

  function toneBg(id) {
    return {
      auto: 'linear-gradient(135deg,#f8c6ad 0%,#e59c72 50%,#9b5c38 100%)',
      light: '#e8ad92',
      medium: '#d08e66',
      tan: '#b6764c',
      dark: '#845036'
    }[id] || '#d08e66';
  }

  function choiceForStudent(id) {
    var base = data.pending[id] || data.approved[id] || {};
    return {
      skin: base.manualSkin ? base.skin : 'auto',
      manualSkin: !!base.manualSkin,
      tee: base.tee || TEES[6],
      stance: base.stance || '',
      wear: Object.assign({}, base.wear || {})
    };
  }

  function open(opts) {
    ensureCss();
    ui.isOpen = true;
    ui.tab = (opts && opts.tab) || 'make';
    ui.pose = 'smile';
    ui.pick = (opts && opts.pick) || null;
    ui.choice = ui.pick ? choiceForStudent(ui.pick) : { skin: 'auto', tee: TEES[6], stance: '', wear: {} };
    var hadLoaded = (state === 'ready');
    var st = store(); ui.cls = st && st.getActiveClass ? st.getActiveClass() : null;
    var p = state === 'idle' || state === 'error' ? load() : fetchWear();
    draw();
    p.then(function () {
      if (!hadLoaded && ui.pick) ui.choice = choiceForStudent(ui.pick);
      draw();
    });
  }
  function poseBarHtml() {
    var poses = [
      { id: 'smile', label: '🙂 Smile' },
      { id: 'laugh', label: '😄 Laugh' },
      { id: 'wink', label: '😉 Wink' }
    ];
    return '<div class="pa-poses">' + poses.map(function (p) {
      return '<button type="button" class="' + (ui.pose === p.id ? 'on' : '') + '" onclick="PupilAvatars._pose(\'' + p.id + '\')">' + p.label + '</button>';
    }).join('') + '</div>';
  }
  function stanceBarHtml(c) {
    var cur = (c && c.stance) || 'natural';
    if (!root.__PA_RIG_ON) return '';   // stance buttons hidden while the clean pose is used
    return '<div class="pa-poses" style="margin-top:6px">' + STANCES.map(function (st) {
      return '<button type="button" class="' + (cur === st.id ? 'on' : '') + '" onclick="PupilAvatars._stance(\'' + st.id + '\')">' + st.label + '</button>';
    }).join('') + '</div>';
  }
  function draw() {
    ensureCss();
    if (!ui.isOpen) return;
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
    var earnedNote = (ui.tab === 'make' && lockMode() === 'earned') ? ' · <small style="color:#fde047">🪙 Earned Mode: level up your monster to unlock more!</small>' : '';
    return '<div class="pa-step"><b>3. Dress Up (' + CATALOG.reduce(function (n, x) { return n + x.items.length; }, 0) + ' items)' + earnedNote + '</b>' +
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
        var lk = itemLockInfo(ui.pick, itemId);
        return '<button class="pa-item ' + (isOn ? 'on ' : '') + (lk.locked ? 'locked' : '') + '" ' +
          (lk.locked ? 'disabled aria-disabled="true"' : 'onclick="PupilAvatars._wear(\'' + activeCat.key + '\',\'' + itemId + '\')"') + '>' +
          (lk.locked ? '<small class="pa-lock">' + esc(lk.label) + '</small>' : '') +
          '<img src="' + BASE + 'wear/' + itemId + '.webp' + ASSET_V + '" loading="lazy" alt="' + esc(prettyName(itemId)) + '">' +
          '<span>' + esc(prettyName(itemId)) + '</span></button>';
      }).join('') +
      '</div></div>';
  }
  function makeHtml() {
    var s = pupils().filter(function (x) { return x.id === ui.pick; })[0];
    var c = ui.choice || { skin: 'auto', tee: TEES[6], stance: '', wear: {} };
    return '<h2>Hello, ' + esc(firstName(s)) + '!</h2><p class="s">Choose your skin tone, T-shirt, pose, and outfit, then tap “Send to my teacher”.</p>' +
      '<div class="pa-make"><div class="pa-prev"><img id="pa-prev" alt="Your avatar">' + poseBarHtml() + stanceBarHtml(c) + '</div><div>' +
      '<div class="pa-step"><b>1. Skin</b><div class="pa-tones">' + TONES.map(function (t) {
        return '<button class="' + ((c.skin || 'auto') === t.id ? 'on' : '') + '" style="background:' + toneBg(t.id) + ';color:#fff;font:700 1.25rem Fredoka,sans-serif" title="' + t.label + '" aria-label="' + t.label + '" onclick="PupilAvatars._set(\'skin\',\'' + t.id + '\')">' + (t.id === 'auto' ? '✨' : '') + '</button>';
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
    var c = ui.choice || (ui.choice = { skin: 'auto', tee: TEES[6], stance: '', wear: {} });
    var list = pupils();
    return '<h2>👗 Avatar Wardrobe — All 124 Cut-Out Items</h2>' +
      '<p class="s">Try on every outfit, trousers/skirt, pair of shoes, wig, hat, glasses, backpack, held accessory, and body pose!</p>' +
      '<div class="pa-make"><div class="pa-prev"><img id="pa-prev" alt="Wardrobe preview">' + poseBarHtml() + stanceBarHtml(c) +
      '<div style="margin-top:8px"><button class="pa-go b" style="padding:8px 14px;font-size:.95rem" onclick="PupilAvatars._random()">🎲 Random Outfit</button>' +
      '<button class="pa-go b" style="padding:8px 14px;font-size:.95rem" onclick="PupilAvatars._clearWear()">🧹 Clear</button></div></div><div>' +
      (list.length ? '<div class="pa-step"><b>Pupil model (optional)</b><div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<button class="pa-go b" style="padding:6px 12px;font-size:.9rem;' + (!ui.pick ? 'outline:3px solid #fde047' : '') + '" onclick="PupilAvatars._wardrobePick(null)">🙂 Demo Head</button>' +
        list.map(function (s) {
          return '<button class="pa-go b" style="padding:6px 12px;font-size:.9rem;' + (ui.pick === s.id ? 'outline:3px solid #fde047' : '') + '" onclick="PupilAvatars._wardrobePick(\'' + esc(s.id) + '\')">' + esc(firstName(s)) + (heads[s.id] ? ' 🙂' : '') + '</button>';
        }).join('') + '</div></div>' : '') +
      '<div class="pa-step"><b>1. Skin &amp; T-shirt</b><div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center"><div class="pa-tones">' + TONES.map(function (t) {
        return '<button class="' + ((c.skin || 'auto') === t.id ? 'on' : '') + '" style="width:46px;height:46px;background:' + toneBg(t.id) + ';color:#fff;font:700 1.05rem Fredoka,sans-serif" title="' + t.label + '" onclick="PupilAvatars._set(\'skin\',\'' + t.id + '\')">' + (t.id === 'auto' ? '✨' : '') + '</button>';
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
    var c = ui.choice || { skin: 'auto', tee: TEES[6], wear: {} };
    var headP = id ? (heads[id] ? Promise.resolve(heads[id]) : fetchHead(id).then(function (im) { if (im) heads[id] = im; return im; })) : (ui.tab === 'wardrobe' ? loadImg(BASE + 'head_demo.webp' + ASSET_V).catch(function () { return null; }) : Promise.resolve(null));
    headP.then(function (hIm) {
      return composeForPose(id, c, hIm, id ? equippedOf(id) : {}, ui.pose || 'smile');
    }).then(function (u) {
      var curEl = document.getElementById('pa-prev');
      if (curEl) curEl.src = u;
    }).catch(function () { /* ignore */ });
  }
  function reviewHtml() {
    var list = pupils();
    var wait = list.filter(function (s) { return data.pending[s.id]; });
    var rest = list.filter(function (s) { return !data.pending[s.id]; });
    var isEarned = lockMode() === 'earned';
    function card(s, pending) {
      var id = s.id, ch = pending ? data.pending[id] : data.approved[id];
      var hasPreview = !!(ch || heads[id]);
      var monFallback = '';
      if (!hasPreview && store()) {
        try {
          var ms = store().calculateMonsterState ? store().calculateMonsterState(id) : {};
          var mp = store().getMonsterProfile ? store().getMonsterProfile(id) : null;
          monFallback = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, mp, ms) : '';
        } catch (e) { monFallback = ''; }
      }
      var mediaHtml = hasPreview
        ? '<img id="pa-r-' + esc(id) + '" alt="' + esc(firstName(s)) + '">'
        : (monFallback
            ? '<img src="' + esc(monFallback) + '" alt="' + esc(firstName(s)) + '" style="opacity:.72;padding:24px">'
            : '<div style="height:220px;display:grid;place-items:center;font-size:4rem;opacity:.45">🙂</div>');
      return '<div class="pa-card">' + mediaHtml +
        '<b>' + esc(firstName(s)) + '</b><br><small style="opacity:.75">' + esc(id) + '</small><br><small>' + (pending ? 'Waiting' : ch ? 'On the board' : 'Using monster') + (heads[id] ? ' · 🙂 face ready' : ' · no face yet') + '</small>' +
        '<div class="row">' + (pending ? '<button class="ok" onclick="PupilAvatars._approve(\'' + esc(id) + '\')">Approve</button><button class="no" onclick="PupilAvatars._reject(\'' + esc(id) + '\')">No</button>' : '') +
        '<label title="Add the cartoon head from Gemini (a PNG on the plain grey background)">🙂 Face<input type="file" accept="image/png,image/webp,image/jpeg" onchange="PupilAvatars._head(\'' + esc(id) + '\', this)"></label>' +
        '<button onclick="PupilAvatars._wardrobePick(\'' + esc(id) + '\');PupilAvatars._tab(\'wardrobe\')" title="Dress up this pupil">👗 Dress</button>' +
        (!pending && ch ? '<button onclick="PupilAvatars._remove(\'' + esc(id) + '\')" title="Back to the monster">Remove</button>' : '') +
        '</div></div>';
    }
    setTimeout(function () {
      list.forEach(function (s) {
        var ch = data.pending[s.id] || data.approved[s.id]; if (!ch && !heads[s.id]) return;
        compose(ch || {}, heads[s.id], equippedOf(s.id), 'smile', s.id).then(function (u) { var el = document.getElementById('pa-r-' + s.id); if (el) el.src = u; }).catch(function () { /* ignore */ });
      });
    }, 0);
    return '<h2>Teacher check</h2><p class="s">Approve an avatar to put it on the Class Board. Add each pupil\'s cartoon face from Gemini with “Face”, or switch between Free Dress-Up and Earned Mode below.</p>' +
      '<div style="margin:0 0 16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
      '<label class="pa-go" style="display:inline-block;margin:0;cursor:pointer">📁 Upload all heads (select PNGs in heads\\)<input type="file" multiple accept="image/png,image/webp,image/jpeg" style="display:none" onchange="PupilAvatars._bulkHeads(this)"></label>' +
      '<button type="button" class="pa-go ' + (isEarned ? 'gold' : 'b') + '" style="margin:0" onclick="PupilAvatars._toggleLockMode()" title="Choose whether pupils can wear all 124 items freely or unlock special items by Monster Level &amp; Shop">' +
        (isEarned ? '🪙 Earned Mode (Level &amp; Shop Unlocks)' : '🔓 Free Dress-Up (All 124 Open)') +
      '</button>' +
      '</div>' +
      (wait.length ? '<b>Waiting (' + wait.length + ')</b><div class="pa-rev" style="margin:8px 0 18px">' + wait.map(function (s) { return card(s, true); }).join('') + '</div>' : '<p>No avatars are waiting.</p>') +
      '<b>Everyone</b><div class="pa-rev" style="margin-top:8px">' + rest.map(function (s) { return card(s, false); }).join('') + '</div>';
  }

  function cleanHead(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var S = 512, c = document.createElement('canvas'); c.width = S; c.height = S;
        var g = c.getContext('2d'), side = Math.min(im.width, im.height);
        g.drawImage(im, (im.width - side) / 2, (im.height - side) / 2, side, side, 0, 0, S, S);
        var d = g.getImageData(0, 0, S, S), p = d.data;
        var bg = [p[0], p[1], p[2]];
        var bgGrey = new Uint8Array(S * S), q = [];
        for (var i = 0; i < S; i++) { q.push(i, i + (S - 1) * S, i * S, i * S + S - 1); }
        function isGrey(k) {
          var o = k * 4, r = p[o], gr = p[o + 1], b = p[o + 2];
          var mx = Math.max(r, gr, b), mn = Math.min(r, gr, b), lum = (r + gr + b) / 3;
          return (Math.abs(r - bg[0]) < 22 && Math.abs(gr - bg[1]) < 22 && Math.abs(b - bg[2]) < 22) || ((mx - mn) <= 16 && lum >= 182 && lum <= 246);
        }
        while (q.length) {
          var k = q.pop(); if (bgGrey[k]) continue;
          if (!isGrey(k)) continue;
          bgGrey[k] = 1;
          var x = k % S, y = (k / S) | 0;
          if (x > 0) q.push(k - 1); if (x < S - 1) q.push(k + 1); if (y > 0) q.push(k - S); if (y < S - 1) q.push(k + S);
        }
        var dist = new Uint8Array(S * S); dist.fill(255);
        var bfs = [], headIdx = 0;
        for (var j = 0; j < S * S; j++) { if (bgGrey[j]) { dist[j] = 0; bfs.push(j); } }
        while (headIdx < bfs.length) {
          var cur = bfs[headIdx++], cd = dist[cur];
          if (cd >= 17) continue;
          var cx = cur % S, cy = (cur / S) | 0;
          var nb = [cx > 0 ? cur - 1 : -1, cx < S - 1 ? cur + 1 : -1, cy > 0 ? cur - S : -1, cy < S - 1 ? cur + S : -1];
          for (var ni = 0; ni < 4; ni++) {
            var nk = nb[ni];
            if (nk >= 0 && dist[nk] === 255) { dist[nk] = cd + 1; bfs.push(nk); }
          }
        }
        var bgAll = new Uint8Array(bgGrey), q2 = [];
        for (var m = 0; m < S * S; m++) { if (bgGrey[m]) q2.push(m); }
        while (q2.length) {
          var k2 = q2.pop();
          var x2 = k2 % S, y2 = (k2 / S) | 0;
          var nb2 = [x2 > 0 ? k2 - 1 : -1, x2 < S - 1 ? k2 + 1 : -1, y2 > 0 ? k2 - S : -1, y2 < S - 1 ? k2 - S : -1];
          nb2[3] = y2 < S - 1 ? k2 + S : -1;
          for (var n2 = 0; n2 < 4; n2++) {
            var t = nb2[n2];
            if (t < 0 || bgAll[t] || dist[t] > 17) continue;
            var o2 = t * 4, r2 = p[o2], g2 = p[o2 + 1], b2 = p[o2 + 2];
            var sat2 = Math.max(r2, g2, b2) - Math.min(r2, g2, b2), lum2 = (r2 + g2 + b2) / 3;
            if ((sat2 <= 24 && lum2 >= 175) || (lum2 >= 230 && sat2 <= 38)) {
              bgAll[t] = 1; q2.push(t);
            }
          }
        }
        for (var idx = 0; idx < S * S; idx++) {
          if (bgAll[idx]) { p[idx * 4 + 3] = 0; continue; }
          var ex = idx % S, ey = (idx / S) | 0;
          var nearBg = (ex > 0 && bgAll[idx - 1]) || (ex < S - 1 && bgAll[idx + 1]) || (ey > 0 && bgAll[idx - S]) || (ey < S - 1 && bgAll[idx + S]);
          if (nearBg) p[idx * 4 + 3] = 0;
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
  function clearEmotionCache(id) {
    delete composedEmotion[id + ':laugh'];
    delete composedEmotion[id + ':wink'];
  }
  function recompose(id) {
    delete composed[id];
    clearEmotionCache(id);
    if (!data.approved[id]) return Promise.resolve();
    return compose(data.approved[id], heads[id], equippedOf(id), 'smile', id).then(function (u) { composed[id] = u; });
  }

  var api = {
    mode: mode, on: on, setMode: setMode, load: load, imgFor: imgFor, has: has, open: open, close: close,
    lockMode: lockMode,
    triggerEmotion: triggerEmotion,
    catalog: CATALOG,
    status: function () { return { state: state, error: lastError, approved: Object.keys(data.approved).length, pending: Object.keys(data.pending).length, lockMode: lockMode() }; },
    toggleButton: function () {
      return '<button class="cb-look" onclick="PupilAvatars.setMode(PupilAvatars.on()?\'monsters\':\'avatars\')" title="Show monsters or the pupils\' avatars">' + (on() ? '🧒 Avatars' : '👾 Monsters') + '</button>' +
        (on() ? '<button class="cb-look" onclick="PupilAvatars.open()" title="Pupils make their avatar; the teacher checks it">🎨 Make avatars</button>' +
          '<button class="cb-look" onclick="PupilAvatars.open({tab:\'wardrobe\'})" title="Try on all 124 avatar clothes, shoes, wigs and hats">👗 Wardrobe</button>' : '');
    },
    _tab: function (t) {
      ui.tab = t;
      ui.pose = 'smile';
      if (t === 'wardrobe' && !ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], wear: {} };
      draw();
    },
    _pose: function (p) {
      ui.pose = p || 'smile';
      draw();
    },
    _stance: function (st) {
      if (!ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], stance: '', wear: {} };
      ui.choice.stance = (!st || st === 'natural') ? '' : st;
      ui.pose = 'smile';
      draw();
    },
    _toggleLockMode: function () {
      if (!data.settings) data.settings = { lockMode: 'free' };
      data.settings.lockMode = (lockMode() === 'earned') ? 'free' : 'earned';
      save().catch(function () {});
      toast(data.settings.lockMode === 'earned' ? '🪙 Earned Mode ON: special items unlock by Monster Level & Shop.' : '🔓 Free Dress-Up ON: all 124 items are open to everyone.');
      draw();
    },
    _cat: function (c) { ui.cat = c; draw(); },
    _wear: function (slot, itemId) {
      if (itemId && itemId !== 'none' && itemLockInfo(ui.pick, itemId).locked) return;
      if (!ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], wear: {} };
      if (!ui.choice.wear) ui.choice.wear = {};
      if (!itemId || itemId === 'none' || ui.choice.wear[slot] === itemId) delete ui.choice.wear[slot];
      else ui.choice.wear[slot] = itemId;
      draw();
    },
    _random: function () {
      if (!ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], wear: {} };
      var w = {};
      ['clothing', 'legs', 'shoes', 'hat', 'glasses', 'backpack', 'accessory'].forEach(function (k) {
        var cat = CATALOG.filter(function (x) { return x.key === k; })[0];
        if (!cat || !cat.items.length) return;
        var allowed = cat.items.filter(function (id) { return !itemLockInfo(ui.pick, id).locked; });
        if (allowed.length && (k === 'clothing' || k === 'legs' || k === 'shoes' || Math.random() < 0.65)) {
          w[k] = allowed[Math.floor(Math.random() * allowed.length)];
        }
      });
      ui.choice.wear = w;
      draw();
    },
    _clearWear: function () {
      if (ui.choice) { ui.choice.wear = {}; ui.choice.stance = ''; }
      draw();
    },
    _wardrobePick: function (id) {
      ui.pick = id || null;
      ui.pose = 'smile';
      if (id) ui.choice = choiceForStudent(id);
      draw();
    },
    _pick: function (id) {
      ui.pick = id || null;
      ui.pose = 'smile';
      if (id) ui.choice = choiceForStudent(id);
      draw();
    },
    _set: function (k, v) {
      if (!ui.choice) return;
      ui.choice[k] = v;
      if (k === 'skin') ui.choice.manualSkin = (v !== 'auto');
      draw();
    },
    _send: function () {
      var id = ui.pick; if (!id) return;
      data.pending[id] = { skin: ui.choice.skin || 'auto', manualSkin: !!ui.choice.manualSkin, tee: ui.choice.tee, stance: ui.choice.stance || '', wear: Object.assign({}, ui.choice.wear || {}), at: new Date().toISOString() };
      save().then(function () { try { root.classSoundboard && root.classSoundboard.playTaDa && root.classSoundboard.playTaDa(); } catch (e) { /* ignore */ } toast('Sent! Your teacher will check it.'); }).catch(function () { /* toast shown */ });
      ui.pick = null; draw();
    },
    _saveDirect: function () {
      var id = ui.pick; if (!id || !ui.choice) return;
      data.approved[id] = { skin: ui.choice.skin || 'auto', manualSkin: !!ui.choice.manualSkin, tee: ui.choice.tee, stance: ui.choice.stance || '', wear: Object.assign({}, ui.choice.wear || {}), at: new Date().toISOString() };
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
    _remove: function (id) { delete data.approved[id]; delete composed[id]; clearEmotionCache(id); save().then(function () { draw(); rerender(); }).catch(draw); },
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
          data.approved[id] = { skin: 'auto', tee: TEES[6], at: new Date().toISOString() };
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
                data.approved[studentId] = { skin: 'auto', tee: TEES[6], at: new Date().toISOString() };
              }
              count++;
              return recompose(studentId);
            } else {
              emotionHeads[stem] = im;
              BUILTIN_EMOTIONS[stem] = 1;
              clearEmotionCache(studentId);
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
    _compose: compose
  };
  root.PupilAvatars = api;

  if (on()) { setTimeout(function () { if (state === 'idle') load(); }, 1500); }
})(typeof window !== 'undefined' ? window : this);
