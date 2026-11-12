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
  var ASSET_V = '?v=22';
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
    { id: 'stand', label: '🧍 Stand' },
    { id: 'wave',  label: '👋 Wave' },
    { id: 'cheer', label: '🎉 Cheer' }
  ];
  var TEES = ['#ffffff', '#ef4444', '#f59e0b', '#facc15', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#1f2937'];

  // Frame: body art is 512x768 (from Gemini's 1024x1536). Seamless neck integration at y 86.
  // Option A "Subway Arcade Toy 3D": +12% expressive head ratio + glowing 3D cyber-glass arcade pedestal.
  var BODY_W = 512, BODY_H = 768;
  var HEAD = 336;          // head picture (square) drawn at Subway Arcade Toy 3D scale
  var CHIN = 0.78;         // chin sits at 78% of the head picture
  var NECK_Y = 86;         // where the chin lands smoothly on the neck
  var PAD = Math.ceil(HEAD * CHIN - NECK_Y) + 14; // room above the body for the head + sticker outline
  var PAD_BOTTOM = 32;     // room below sneakers for the 3D cyber-glass arcade pedestal disc
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
    { key: 'aura', label: '✨ Auras', items: [
      'aura-sparkle', 'aura-star', 'aura-blossom', 'aura-flame', 'aura-ice', 'cs-aura-hearts', 'cs-bubbles', 'cs-snowflakes',
      'cs-pumpkin-aura', 'cs-ghost-aura', 'aura-rainbow', 'aura-lightning', 'cs-aura-fire', 'cs-lantern',
      'aura-cosmic', 'aura-dragon', 'aura-royal', 'cs-my-aurora'
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
  var POSED_TOPS = {};
  CATALOG.forEach(function (cat) {
    cat.items.forEach(function (id) {
      SLOT_BY_ITEM[id] = cat.key;
      if (cat.key === 'clothing') POSED_TOPS[id] = 1;
    });
  });
  var HAND_HELD_PROPS = {
    'cs-teddy': 1, 'acc-compass': 1, 'acc-wand': 1, 'acc-book': 1, 'cs-magnifier': 1,
    'acc-trophy': 1, 'acc-microphone': 1, 'cs-ladle': 1, 'cs-wiz-staff': 1, 'cs-knight-shield': 1,
    'cs-witch-broom': 1, 'cs-guitar': 1, 'cs-parrot': 1, 'cs-vamp-bat': 1, 'cs-spider-friend': 1, 'cs-my-comet': 1
  };
  var CAPE_CLASP_ITEMS = {
    'clothing-cape': 1, 'cs-vamp-cape': 1, 'cs-hero-cape': 1, 'cs-witch-cape': 1, 'cs-leaf-cape': 1, 'cs-my-galaxy-cape': 1
  };
  var STAND_CUTOUT_BACK_ITEMS = {
    'cs-fairy-wings': 1, 'cs-my-phoenix-wings': 1, 'clothing-cape': 1,
    'cs-vamp-cape': 1, 'cs-hero-cape': 1, 'cs-witch-cape': 1, 'cs-leaf-cape': 1, 'cs-my-galaxy-cape': 1
  };
  // Monster Studio -> Avatar Wear 1:1 equivalents so pupils' monster wings show up on their avatars
  var MONSTER_TO_AVATAR_EQUIV = {
    'wings-starter':   'bp-mini-wings',
    'wings-fairy':     'cs-fairy-wings',
    'wings-bat':       'cs-vamp-cape',
    'wings-dragon':    'cs-my-phoenix-wings',
    'wings-celestial': 'cs-my-phoenix-wings'
  };
  var AVATAR_TO_MONSTER_EQUIV = {
    'bp-mini-wings':       ['wings-starter'],
    'cs-fairy-wings':      ['wings-fairy'],
    'cs-vamp-cape':        ['wings-bat'],
    'cs-my-phoenix-wings': ['wings-dragon', 'wings-celestial']
  };

  // Aura pictures (some monster auras had no clean picture: they use the closest glow)
  var AURA_ART = {
    'cs-snowflakes': 'aura-ice', 'cs-aura-fire': 'aura-flame', 'cs-my-aurora': 'aura-cosmic', 'cs-lantern': 'aura-star',
    'cs-pumpkin-aura': 'aura-flame', 'cs-ghost-aura': 'aura-sparkle'
  };
  function auraUrl(id) { return id ? (BASE + 'aura/' + (AURA_ART[id] || id) + '.webp' + ASSET_V) : ''; }
  // Buddies that are not in the pet list: the Sky Dragon creature that 16 pupils bought walks next to their avatar
  var EXTRA_PETS = {};   // the Sky Dragon creature was refunded to the pupils who bought it (12 Nov 2026)
  function petById(id) {
    if (!id || id === 'none') return null;
    if (EXTRA_PETS[id]) return EXTRA_PETS[id];
    try { return (root.MonsterPets && root.MonsterPets.byId) ? root.MonsterPets.byId(id) : null; } catch (e) { return null; }
  }
  function petImageUrl(id, pose) {
    var p = petById(id);
    if (p) {
      if (p.poses) {
        if (pose === 'wave' && p.poses.wave) return p.poses.wave;
        if (pose === 'cheer' && p.poses.cheer) return p.poses.cheer;
        if (p.poses.idle) return p.poses.idle;
      }
      if (p.imageSrc) return p.imageSrc;
    }
    if (String(id || '').indexOf('pet-') === 0) return 'assets/monsters/pets/' + id + '.png';
    return '';
  }
  function pickerCategories(studentId) {
    var pets = (root.MonsterPets && Array.isArray(root.MonsterPets.items)) ? root.MonsterPets.items : [];
    var visiblePets = pets.concat(Object.keys(EXTRA_PETS).map(function (k) { return EXTRA_PETS[k]; })).filter(function (p) {
      return !p.notForSale || (studentId && studentOwnsItem(studentId, p.id));   // pets no longer sold still show for pupils who have them
    });
    if (!visiblePets.length) return CATALOG;
    return CATALOG.concat([{
      key: 'pet',
      label: '🐾 Pet Buddies',
      isPet: true,
      items: visiblePets.map(function (p) { return p.id; })
    }]);
  }

  function allItemCount() {
    return pickerCategories(null).reduce(function (n, c) { return n + (c.items ? c.items.length : 0); }, 0);
  }
  // Class Mode = the smartboard in front of the pupils: the teacher's approval tab is hidden there.
  function inClassMode() {
    try { return !!(root.ClassMode && root.ClassMode.on && root.ClassMode.on()); } catch (e) { return false; }
  }
  function prettyName(id) {
    var p = petById(id);
    if (p && p.name) return p.name;
    return String(id || '')
      .replace(/^(clothing-|av-legs-|av-shoes-|av-wig-|hat-|glasses-|bp-|neck-|acc-|accessory-|cs-my-|cs-|pet-crew-|pet-hal-|pet-hero-|pet-)/, '')
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

  var data = { approved: {}, pending: {}, removed: {}, settings: { lockMode: 'earned' } };
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

  // Monsters are hidden on the platform (11 Nov 2026). Monster levels still run quietly for unlocks.
  function monstersHidden() { return root.EAA_HIDE_MONSTERS !== false; }
  function mode() { if (monstersHidden()) return 'avatars'; try { return localStorage.getItem(LOOK_KEY) === 'avatars' ? 'avatars' : 'monsters'; } catch (e) { return 'monsters'; } }
  function on() { return mode() === 'avatars'; }
  function setMode(m) {
    try { localStorage.setItem(LOOK_KEY, m === 'avatars' ? 'avatars' : 'monsters'); } catch (e) { /* private mode */ }
    if (m === 'avatars' && state === 'idle') load();
    rerender();
  }
  function lockMode() {
    return (data.settings && data.settings.lockMode === 'free') ? 'free' : 'earned';
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
    // the newest change for each pupil wins (cloud or this device), so an old tablet cannot undo newer work
    if (localDoc) data = mergeDocs(data, localDoc);
    if (!data.settings) data.settings = { lockMode: 'earned' };
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
        removed: data.removed || {},
        settings: data.settings || { lockMode: 'earned' },
        at: new Date().toISOString()
      }));
    } catch (e) {}
  }
  function nowIso() { return new Date().toISOString(); }
  // Merge two avatar documents pupil by pupil: the newer entry wins; a newer "removed" mark deletes.
  function mergeDocs(a, b) {
    a = a || {}; b = b || {};
    var out = { approved: {}, pending: {}, removed: {}, settings: null };
    [a.removed || {}, b.removed || {}].forEach(function (r) {
      Object.keys(r).forEach(function (k) { if (!out.removed[k] || r[k] > out.removed[k]) out.removed[k] = r[k]; });
    });
    ['approved', 'pending'].forEach(function (kind) {
      var A = a[kind] || {}, B = b[kind] || {}, pre = kind === 'approved' ? 'a:' : 'p:';
      Object.keys(A).concat(Object.keys(B)).forEach(function (id) {
        if (out[kind][id]) return;
        var x = A[id], y = B[id];
        var win = !x ? y : (!y ? x : (String(y.at || '') > String(x.at || '') ? y : x));
        if (!win) return;
        var rm = out.removed[pre + id];
        if (rm && rm >= String(win.at || '')) return;
        out[kind][id] = win;
      });
    });
    var sa = a.settings, sb = b.settings;
    out.settings = !sa ? sb : (!sb ? sa : (String(sb.at || '') > String(sa.at || '') ? sb : sa));
    if (!out.settings) out.settings = { lockMode: 'earned' };
    return out;
  }
  function markRemoved(kind, id) {
    if (!data.removed) data.removed = {};
    data.removed[(kind === 'approved' ? 'a:' : 'p:') + id] = nowIso();
  }
  // Cloud layout (teacher-only table "classes", hidden rows with grade 'System'):
  //   class-pupil-avatars             -> small document: choices, pending, settings, removed marks (no pictures)
  //   class-pupil-avatar-head-<stem>  -> one face picture each (data URL)
  // Older versions kept every face inside the first row (1.4 MB rewritten on every save); that row is
  // split the first time the teacher saves.
  var HEAD_ROW_PREFIX = 'class-pupil-avatar-head-';
  var legacyHeadsInRow = false;
  function readSyncRow() {
    var sb = client(); if (!sb) return Promise.resolve(null);
    return sb.from('classes').select('description').eq('id', SYNC_ROW_ID).maybeSingle().then(function (r) {
      if (r.error || !r.data || !r.data.description) return null;
      try { return JSON.parse(r.data.description) || null; } catch (e) { return null; }
    }).catch(function () { return null; });
  }
  function hiddenRow(id, name, description) {
    return { id: id, name: name, grade: 'System', teacher: 'System', archived: true, description: description };
  }
  function writeHeadRows(stems) {
    var sb = client(); if (!sb) return Promise.resolve();
    var rows = stems.filter(function (st) { return headB64[st]; }).map(function (st) {
      return hiddenRow(HEAD_ROW_PREFIX + st, 'Pupil Avatar Face', headB64[st]);
    });
    var chain = Promise.resolve();
    for (var i = 0; i < rows.length; i += 8) {
      (function (part) {
        chain = chain.then(function () {
          return sb.from('classes').upsert(part, { onConflict: 'id' }).then(function (r) {
            if (r.error) throw new Error(r.error.message || 'face save failed');
          });
        });
      })(rows.slice(i, i + 8));
    }
    return chain;
  }
  function readHeadRows(stems) {
    var sb = client(); if (!sb || !stems.length) return Promise.resolve();
    var parts = [];
    for (var i = 0; i < stems.length; i += 30) parts.push(stems.slice(i, i + 30));
    return Promise.all(parts.map(function (part) {
      return sb.from('classes').select('id,description').in('id', part.map(function (st) { return HEAD_ROW_PREFIX + st; })).then(function (r) {
        (r.data || []).forEach(function (row) {
          if (row && row.description && String(row.description).indexOf('data:image') === 0) headB64[row.id.slice(HEAD_ROW_PREFIX.length)] = row.description;
        });
      }).catch(function () { /* faces fall back to the built-in pictures */ });
    }));
  }
  function writeSyncRow() {
    saveLocal();
    var sb = client(); if (!sb) return Promise.resolve();
    // 1. a one-time move of the faces out of the old big row (only after this succeeds is the big row shrunk)
    var move = legacyHeadsInRow ? writeHeadRows(Object.keys(headB64)).then(function () { legacyHeadsInRow = false; }) : Promise.resolve();
    return move.then(function () {
      // 2. read the newest cloud copy and merge, so two devices saving at the same time keep both changes
      return readSyncRow();
    }).then(function (remote) {
      if (remote && remote.heads && legacyHeadsInRow) throw new Error('faces not moved yet');
      var merged = mergeDocs(remote || {}, data);
      data.approved = merged.approved; data.pending = merged.pending; data.removed = merged.removed; data.settings = merged.settings;
      saveLocal();
      return sb.from('classes').upsert(hiddenRow(SYNC_ROW_ID, 'Pupil Avatars (Teacher Private Sync)', JSON.stringify({
        v: 3, at: nowIso(), approved: data.approved, pending: data.pending, removed: data.removed, settings: data.settings
      })), { onConflict: 'id' }).then(function (r) {
        if (r.error) throw new Error(r.error.message || 'sync save failed');
      });
    });
  }
  function readJson() {
    var sb = client(); if (!sb) return Promise.resolve({});
    return readSyncRow().then(function (doc) {
      doc = doc || {};
      if (doc.heads) {                         // old layout: faces inside the row
        headB64 = Object.assign({}, doc.heads, headB64);
        legacyHeadsInRow = Object.keys(doc.heads).length > 0;
      }
      return doc;
    });
  }
  function writeJson() {
    return writeSyncRow().catch(function (e) { saveLocal(); throw e; });
  }
  function fetchHead(id) {
    if (headB64[id]) {
      return loadImg(headB64[id]).catch(function () { return null; });
    }
    return loadImg(BASE + 'heads/' + id + '.webp' + ASSET_V).catch(function () {
      return readHeadRows([id]).then(function () {
        return headB64[id] ? loadImg(headB64[id]).catch(function () { return null; }) : null;
      });
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
  var lastEquipSig = {};
  function equipSignature(id) {
    try { return JSON.stringify(avatarEquipFromMonster(equippedOf(id))); } catch (e) { return ''; }
  }
  function load() {
    ensureCss();
    installStoreSyncHook();
    if (state === 'loading' && loadPromise) return loadPromise;
    state = 'loading';
    loadPromise = Promise.all([readJson().catch(function () { return {}; }), fetchWear()]).then(function (res) {
      var d = res[0] || {};
      // Earned Mode is the default when nothing was chosen; a saved choice (Free or Earned) is respected.
      data = { approved: d.approved || {}, pending: d.pending || {}, removed: d.removed || {}, settings: Object.assign({ lockMode: 'earned' }, d.settings || {}) };
      seedBuiltinDefaults();
      var ids = Object.keys(data.approved).concat(Object.keys(data.pending));
      BUILTIN_HEADS.forEach(function (sid) { if (ids.indexOf(sid) < 0) ids.push(sid); });
      var missing = ids.filter(function (id) { return !headB64[id] && BUILTIN_HEADS.indexOf(id) < 0; });
      return readHeadRows(missing).then(function () { return ids; });
    }).then(function (ids) {
      return Promise.all(ids.map(function (id) {
        return heads[id] ? null : fetchHead(id).then(function (im) { if (im) heads[id] = im; });
      }));
    }).then(function () {
      return Promise.all(Object.keys(data.approved).map(function (id) {
        var eq = equippedOf(id);
        lastEquipSig[id] = JSON.stringify(avatarEquipFromMonster(eq));
        return compose(ownedLook(id, data.approved[id]), heads[id], eq, 'smile', id).then(function (u) { composed[id] = u; }).catch(function () { /* keep monster */ });
      }));
    }).then(function () {
      state = 'ready';
      loadPromise = null;
      if (on()) rerender();
      setTimeout(syncAllChanged, 2500);
      setTimeout(syncAllChanged, 6500);
    }).catch(function (e) {
      lastError = String(e && e.message || e);
      state = 'ready';
      loadPromise = null;
      if (on()) rerender();
    });
    return loadPromise;
  }

  function studentRecord(id) {
    var st = store();
    if (!st || !id) return null;
    try {
      if (st.getStudentById) return st.getStudentById(id);
      if (st.getStudents) {
        var all = st.getStudents() || [];
        for (var i = 0; i < all.length; i++) { if (all[i] && all[i].id === id) return all[i]; }
      }
    } catch (e) {}
    return null;
  }

  function equippedOf(id) {
    try {
      var st = store();
      var sRec = studentRecord(id);
      var mcEq = (sRec && sRec.monster_customization && sRec.monster_customization.equipped) || {};
      var p = st && st.getMonsterProfile ? st.getMonsterProfile(id) : null;
      var pEq = (p && p.equipped) || {};
      return Object.assign({}, mcEq, pEq);
    } catch (e) { return {}; }
  }

  // Normalize Monster Studio / Closet equipped slots into Avatar slots so hats, wings, medals, held props & pets all sync cleanly
  function avatarEquipFromMonster(rawEq) {
    var out = {};
    if (!rawEq || typeof rawEq !== 'object') return out;
    var checkSlots = ['backpack', 'cape', 'legs', 'shoes', 'clothing', 'outfit', 'neck', 'accessory', 'wig', 'glasses', 'headwear', 'hats', 'hat'];
    for (var i = 0; i < checkSlots.length; i++) {
      var slot = checkSlots[i];
      var val = rawEq[slot];
      if (!val || val === 'none') continue;
      var mapped = MONSTER_TO_AVATAR_EQUIV[val] || val;
      var targetSlot = SLOT_BY_ITEM[mapped];
      if (targetSlot) out[targetSlot] = mapped;
    }
    if (rawEq.wings && rawEq.wings !== 'none' && !out.backpack) {
      var wId = MONSTER_TO_AVATAR_EQUIV[rawEq.wings] || rawEq.wings;
      if (SLOT_BY_ITEM[wId] === 'backpack') out.backpack = wId;
    }
    if (rawEq.pet && rawEq.pet !== 'none') out.pet = rawEq.pet;
    if (!out.pet && rawEq.creature && EXTRA_PETS[rawEq.creature]) out.pet = rawEq.creature;
    if (rawEq.aura && rawEq.aura !== 'none') out.aura = rawEq.aura;
    return out;
  }

  function effectiveWear(choice, eq) {
    var merged = avatarEquipFromMonster(eq);
    var cw = (choice && choice.wear) || {};
    Object.keys(cw).forEach(function (slot) {
      var v = cw[slot];
      if (v === 'none') {
        delete merged[slot];
      } else if (v) {
        merged[slot] = MONSTER_TO_AVATAR_EQUIV[v] || v;
      }
    });
    return merged;
  }

  function studentOwnsItem(studentId, itemId) {
    if (!studentId || !itemId || itemId === 'none') return false;
    try { if (root.ClassroomStore && root.ClassroomStore.avatar && root.ClassroomStore.avatar.owns(studentId, itemId)) return true; } catch (eS) { /* shop not loaded */ }
    var st = store();
    var checkIds = [itemId].concat(AVATAR_TO_MONSTER_EQUIV[itemId] || []);
    try {
      var monEq = avatarEquipFromMonster(equippedOf(studentId));
      for (var mk in monEq) { if (monEq[mk] === itemId) return true; }
      if (st) {
        var prof = st.getMonsterProfile ? st.getMonsterProfile(studentId) : null;
        if (prof && Array.isArray(prof.unlockedItems)) {
          if (checkIds.some(function (cid) { return prof.unlockedItems.indexOf(cid) >= 0; })) return true;
        }
        var sRec = studentRecord(studentId);
        var mcUnl = sRec && sRec.monster_customization && sRec.monster_customization.unlockedItems;
        if (Array.isArray(mcUnl) && checkIds.some(function (cid) { return mcUnl.indexOf(cid) >= 0; })) return true;
        if (st.getStudentInventory) {
          var inv = st.getStudentInventory(studentId) || [];
          if (inv.some(function (e) {
            if (!e) return false;
            var eid = typeof e === 'string' ? e : (e.itemId || e.id || e.refId);
            return checkIds.indexOf(eid) >= 0;
          })) return true;
        }
      }
      if (root.ClassroomStore) {
        for (var ci = 0; ci < checkIds.length; ci++) {
          var cid2 = checkIds[ci];
          if (root.ClassroomStore.cosmetics && root.ClassroomStore.cosmetics.owns && root.ClassroomStore.cosmetics.owns(studentId, cid2)) return true;
          if (root.ClassroomStore.owns && root.ClassroomStore.owns(studentId, cid2)) return true;
        }
      }
    } catch (e2) {}
    return false;
  }

  // ---------- Teacher Earned-Mode vs Free Dress-Up lock helper ----------
  var LEVEL_BY_RARITY = { common: 2, rare: 3, epic: 5, legendary: 6 };
  function pupilLevel(studentId) {
    var st = store(), lvl = 1;
    if (st && studentId && st.calculateMonsterState) {
      try {
        var ms = st.calculateMonsterState(studentId), sRec = studentRecord(studentId);
        lvl = Number((ms && (ms.currentLevel || ms.level || ms.highestUnlockedLevel)) || (sRec && sRec.level)) || 1;
      } catch (e) { lvl = 1; }
    }
    return lvl;
  }
  function itemLockInfo(studentId, itemId) {
    if ((ui.tab === 'wardrobe' && !studentId) || lockMode() !== 'earned') return { locked: false, label: '' };
    if (!itemId || itemId === 'none' || FREE_STARTER_ITEMS[itemId]) return { locked: false, label: '' };
    if (studentOwnsItem(studentId, itemId)) return { locked: false, label: '' };
    var pObj = petById(itemId);
    if (pObj) {
      return { locked: true, label: '🪙 Shop' };
    }
    // Levels (12 Nov 2026): Everyday items open at level 2, Cool at 3, Epic at 5, Legendary at 6.
    // Mythic items are shop / box only. Anything locked can also be bought early in the Shop.
    var req = LEVEL_BY_RARITY[rarityOf(itemId)];
    if (!req) return { locked: true, label: '🪙 Shop' };
    var lvl = pupilLevel(studentId);
    if (lvl >= req) return { locked: false, label: '' };
    return { locked: true, label: '🔒 Lv ' + req };
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

  function getGradedBody(bodyLightImg, skinMaskImg, targetRgb, pose) {
    if (!skinMaskImg) return bodyLightImg;
    var key = (pose || 'stand') + ':' + targetRgb.join(',');
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

  // Hands for Wave / Cheer: most drawn outfits stop at the wrist, so the pupil's own hands are drawn back on top.
  // Boxes are in body-picture pixels (512 x 768); the bottom (raised hands) or top (hanging hand) fades over 12 px.
  var HAND_BOXES = {
    wave:  [{ x0: 355, x1: 505, y0: 36, y1: 150, fade: 'bottom' }, { x0: 76, x1: 172, y0: 345, y1: 472, fade: 'top' }],
    cheer: [{ x0: 8, x1: 158, y0: 36, y1: 150, fade: 'bottom' }, { x0: 354, x1: 504, y0: 36, y1: 150, fade: 'bottom' }]
  };
  var topHandsCache = {}, handLayerCache = {};
  /** true when a drawn Wave/Cheer outfit picture already has hands or gloves in it */
  function topHasHands(img, pose) {
    if (!img || !HAND_BOXES[pose]) return true;
    var key = (img.src || '') + '|' + pose;
    if (key in topHandsCache) return topHandsCache[key];
    var c = document.createElement('canvas'); c.width = BODY_W; c.height = BODY_H;
    var g = c.getContext('2d'); g.drawImage(img, 0, 0, BODY_W, BODY_H);
    var b = HAND_BOXES[pose][0], d = g.getImageData(b.x0, b.y0, b.x1 - b.x0, 60).data, n = 0;
    for (var i = 3; i < d.length; i += 4) if (d[i] > 120) n++;
    return (topHandsCache[key] = n > 100);   // fingertip area: gloves or hands drawn in the outfit
  }
  /** the pupil's hands only (skin-toned body cut by the skin mask inside the hand boxes) */
  function handLayer(gradedBody, skinMask, pose, toneKey) {
    var key = pose + ':' + toneKey;
    if (handLayerCache[key]) return handLayerCache[key];
    var c = document.createElement('canvas'); c.width = BODY_W; c.height = BODY_H;
    var g = c.getContext('2d');
    g.drawImage(gradedBody, 0, 0, BODY_W, BODY_H);
    var m = document.createElement('canvas'); m.width = BODY_W; m.height = BODY_H;
    var mg = m.getContext('2d');
    if (skinMask) mg.drawImage(skinMask, 0, 0, BODY_W, BODY_H);
    var md = mg.getImageData(0, 0, BODY_W, BODY_H).data, out = g.getImageData(0, 0, BODY_W, BODY_H), od = out.data;
    var boxes = HAND_BOXES[pose] || [];
    for (var y = 0; y < BODY_H; y++) for (var x = 0; x < BODY_W; x++) {
      var o = (y * BODY_W + x) * 4, keep = 0;
      for (var k = 0; k < boxes.length; k++) {
        var bx = boxes[k];
        if (x >= bx.x0 && x < bx.x1 && y >= bx.y0 && y < bx.y1) {
          var f = bx.fade === 'bottom' ? Math.min(1, (bx.y1 - y) / 12) : Math.min(1, (y - bx.y0) / 12);
          keep = Math.max(keep, f);
        }
      }
      od[o + 3] = Math.round(od[o + 3] * keep * (skinMask ? md[o + 3] / 255 : 1));
    }
    g.putImageData(out, 0, 0);
    return (handLayerCache[key] = c);
  }

  // Match any exposed V-neck collar, forearm, or hand skin on outfits to the pupil's exact skin tone
  function getGradedTop(topImg, topId, targetRgb, pose) {
    if (!topImg) return topImg;
    var pName = pose || 'stand';
    var isPosedOutfit = (pName === 'wave' || pName === 'cheer') && !!POSED_TOPS[topId] && !TORSO_ONLY_TOPS[topId];
    if (!VNECK_TOPS[topId] && !isPosedOutfit) return topImg;

    var key = topId + ':' + pName + ':' + targetRgb.join(',');
    if (gradedTopCache[key]) return gradedTopCache[key];

    var c = document.createElement('canvas'); c.width = BODY_W; c.height = BODY_H;
    var g = c.getContext('2d');
    g.drawImage(topImg, 0, 0, BODY_W, BODY_H);

    if (!isPosedOutfit) {
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

    // Posed Wave / Cheer outfit: grade exposed 5-finger hands, short-sleeve forearms, and V-neck collars
    var full = g.getImageData(0, 36, BODY_W, 450), fp = full.data;
    var pkR = targetRgb[0] / 200.0, pkG = targetRgb[1] / 160.0, pkB = targetRgb[2] / 133.0;
    var hasVneck = !!VNECK_TOPS[topId];
    var hasBareHands = (topId !== 'cs-mummy-wrap' && topId !== 'cs-knight-armor');
    var anyChanged = false;

    for (var py = 0; py < 450; py++) {
      var absY = py + 36;
      var rowOff = py * BODY_W;
      for (var px = 0; px < BODY_W; px++) {
        var inVneck = hasVneck && px >= 184 && px <= 328 && absY >= 45 && absY <= 205;
        var inArmZone = hasBareHands && (px < 172 || px > 340);
        if (!inVneck && !inArmZone) continue;

        var idx = (rowOff + px) * 4;
        if (fp[idx + 3] < 75) continue;
        var pr = fp[idx], pgr = fp[idx + 1], pb = fp[idx + 2];
        var rgDiff = pr - pgr, gbDiff = pgr - pb;
        if (pr >= 130 && pr <= 242 && pb >= 80 && rgDiff >= 21 && rgDiff <= 58 && gbDiff >= 13 && gbDiff <= 42 && rgDiff >= gbDiff - 1) {
          fp[idx] = Math.min(255, Math.round(pr * pkR));
          fp[idx + 1] = Math.min(255, Math.round(pgr * pkG));
          fp[idx + 2] = Math.min(255, Math.round(pb * pkB));
          anyChanged = true;
        }
      }
    }
    if (anyChanged) g.putImageData(full, 0, 36);
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
    ['backpack', 'cape'].forEach(function (slot) {
      var id = eq[slot];
      if (id && id !== 'none' && bSet.indexOf(id) >= 0 && back.indexOf(id) < 0) back.push(id);
    });
    ['legs'].forEach(function (slot) {
      var id = eq[slot];
      if (id && id !== 'none' && bSet.indexOf(id) >= 0 && legs.indexOf(id) < 0) legs.push(id);
    });
    ['shoes'].forEach(function (slot) {
      var id = eq[slot];
      if (id && id !== 'none' && bSet.indexOf(id) >= 0 && shoes.indexOf(id) < 0) shoes.push(id);
    });
    ['clothing', 'outfit', 'neck', 'accessory'].forEach(function (slot) {
      var id = eq[slot];
      if (!id || id === 'none') return;
      if (SLOT_BY_ITEM[id] === 'legs' && bSet.indexOf(id) >= 0) { if (legs.indexOf(id) < 0) legs.push(id); }
      else if (SLOT_BY_ITEM[id] === 'shoes' && bSet.indexOf(id) >= 0) { if (shoes.indexOf(id) < 0) shoes.push(id); }
      else if (SLOT_BY_ITEM[id] === 'backpack' && bSet.indexOf(id) >= 0) { if (back.indexOf(id) < 0) back.push(id); }
      else if (bSet.indexOf(id) >= 0 && tops.indexOf(id) < 0) tops.push(id);
    });
    ['wig', 'glasses', 'hat', 'hats', 'headwear'].forEach(function (slot) {
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

  // ---------- Option A: Drawn Pose Layering (Stand / Wave / Cheer) + 3D Arcade Pedestal ----------
  function hashId(str) {
    var h = 2166136261;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul ? Math.imul(h, 16777619) : ((h * 16777619) | 0);
    }
    return Math.abs(h | 0);
  }

  function resolveDrawnPose(choice, studentId, poseKind, L) {
    var raw = (choice && choice.stance) || '';
    var pose = 'stand';
    if (raw === 'wave' || raw === 'cheer') {
      pose = raw;
    } else if (raw === 'stand' || raw === 'natural' || raw === 'hip') {
      pose = 'stand';
    } else if (studentId) {
      var tops = (L && L.tops) || [];
      var back = (L && L.back) || [];
      var hasHeld = tops.some(function (id) { return !!HAND_HELD_PROPS[id]; });
      var hasStandBack = back.some(function (id) { return !!STAND_CUTOUT_BACK_ITEMS[id]; });
      if (!hasHeld && !hasStandBack) {
        var bucket = hashId(studentId) % 20;
        pose = bucket < 9 ? 'stand' : (bucket < 15 ? 'wave' : 'cheer');
      }
    }
    if (poseKind === 'laugh' || poseKind === 'dedicated-laugh') {
      pose = 'cheer';
    } else if (poseKind === 'wink' || poseKind === 'dedicated-wink') {
      pose = 'wave';
    }
    return pose;
  }

  var PEDESTAL_ACCENTS = [
    { hex: '#38bdf8', glow: 'rgba(56, 189, 248, 0.42)', soft: 'rgba(56, 189, 248, 0.14)' },
    { hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.42)', soft: 'rgba(168, 85, 247, 0.14)' },
    { hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.42)', soft: 'rgba(245, 158, 11, 0.14)' },
    { hex: '#10b981', glow: 'rgba(16, 185, 129, 0.42)', soft: 'rgba(16, 185, 129, 0.14)' },
    { hex: '#f43f5e', glow: 'rgba(244, 63, 94, 0.42)',  soft: 'rgba(244, 63, 94, 0.14)' }
  ];

  function pedestalAccent(choice, studentId, eff) {
    var aura = String((eff && eff.aura) || '').toLowerCase();
    if (aura === 'aura-ice' || aura === 'cs-bubbles' || aura === 'cs-snowflakes') return PEDESTAL_ACCENTS[0];
    if (aura === 'aura-sparkle' || aura === 'aura-rainbow') return PEDESTAL_ACCENTS[1];
    if (aura === 'aura-lightning' || aura === 'aura-star' || aura === 'aura-flame' || aura === 'cs-pumpkin-aura') return PEDESTAL_ACCENTS[2];
    if (aura === 'aura-blossom' || aura === 'cs-aura-hearts') return PEDESTAL_ACCENTS[4];
    var tee = String((choice && choice.tee) || '').toLowerCase();
    if (tee === '#3b82f6' || tee === '#14b8a6') return PEDESTAL_ACCENTS[0];
    if (tee === '#8b5cf6') return PEDESTAL_ACCENTS[1];
    if (tee === '#f59e0b' || tee === '#facc15') return PEDESTAL_ACCENTS[2];
    if (tee === '#22c55e') return PEDESTAL_ACCENTS[3];
    if (tee === '#ef4444' || tee === '#ec4899') return PEDESTAL_ACCENTS[4];
    var idx = studentId ? (hashId(studentId) % PEDESTAL_ACCENTS.length) : 0;
    return PEDESTAL_ACCENTS[idx];
  }

  function drawArcadePedestal(ctx, cx, cy, acc) {
    ctx.save();
    // 1. Ambient neon floor bloom
    ctx.save();
    ctx.translate(cx, cy + 7);
    ctx.scale(1, 0.19);
    var bloom = ctx.createRadialGradient(0, 0, 35, 0, 0, 158);
    bloom.addColorStop(0, acc.glow);
    bloom.addColorStop(0.58, acc.soft);
    bloom.addColorStop(1, 'rgba(6, 9, 17, 0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(0, 0, 158, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Extruded 3D obsidian base cylinder lip (sized to match monster pedestals on Class Board)
    var rx = 148, ry = 25, lipH = 13;
    var sideGrad = ctx.createLinearGradient(cx - rx, cy, cx + rx, cy + lipH);
    sideGrad.addColorStop(0, '#070b16');
    sideGrad.addColorStop(0.5, '#17223b');
    sideGrad.addColorStop(1, '#060912');
    ctx.fillStyle = sideGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + lipH, rx, ry, 0, 0, Math.PI, false);
    ctx.lineTo(cx - rx, cy);
    ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();

    // Subtle dark base rim border
    ctx.strokeStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(cx, cy + lipH, rx, ry, 0, 0, Math.PI, false);
    ctx.stroke();

    // 3. Top cyber-glass platform surface
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    var topGrad = ctx.createRadialGradient(0, -18, 12, 0, 0, rx);
    topGrad.addColorStop(0, '#243454');
    topGrad.addColorStop(0.62, '#111a2e');
    topGrad.addColorStop(0.92, '#0a1020');
    topGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Inner neon energy ring + outer glowing neon bezel
    ctx.save();
    ctx.strokeStyle = acc.soft;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.72, ry * 0.70, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowColor = acc.hex;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = acc.hex;
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 1.5, ry - 0.8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 5. Crisp front glass specular highlight arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 2.5, ry - 1.4, 0, Math.PI * 0.16, Math.PI * 0.84, false);
    ctx.stroke();

    // 6. Grounded sneaker cast shadow on top of the disc
    ctx.save();
    ctx.translate(cx, cy - 1);
    ctx.scale(1, 0.14);
    var shGrad = ctx.createRadialGradient(0, 0, 14, 0, 0, 106);
    shGrad.addColorStop(0, 'rgba(3, 6, 15, 0.55)');
    shGrad.addColorStop(0.68, 'rgba(3, 6, 15, 0.24)');
    shGrad.addColorStop(1, 'rgba(3, 6, 15, 0)');
    ctx.fillStyle = shGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 106, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function loadWithFallback(primaryUrl, fallbackUrl) {
    return loadImg(primaryUrl).catch(function () {
      return fallbackUrl ? loadImg(fallbackUrl) : null;
    });
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

  // Tight opaque bounding box of each Pet Buddy image so square padding never shrinks the buddy
  var PET_BBOX = {};
  function getPetTightBox(petIm, key) {
    if (!petIm || !petIm.width || !petIm.height) return null;
    if (key && PET_BBOX[key]) return PET_BBOX[key];
    var w = petIm.width, h = petIm.height;
    try {
      var tc = document.createElement('canvas'); tc.width = w; tc.height = h;
      var tg = tc.getContext('2d');
      tg.drawImage(petIm, 0, 0);
      var d = tg.getImageData(0, 0, w, h).data;
      var x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          if (d[(y * w + x) * 4 + 3] > 24) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 >= x0 && y1 >= y0) {
        var box = { sx: x0, sy: y0, sw: x1 - x0 + 1, sh: y1 - y0 + 1 };
        if (key) PET_BBOX[key] = box;
        return box;
      }
    } catch (e) {}
    return { sx: 0, sy: 0, sw: w, sh: h };
  }

  function compose(choice, headImg, eq, poseKind, studentId) {
    return fetchWear().then(function () {
      choice = choice || {};
      var mergedEq = effectiveWear(choice, eq || {});
      var tone = TONES.some(function (t) { return t.id === choice.skin; }) ? choice.skin : 'auto';
      var L = wearLayers(mergedEq);
      var pose = resolveDrawnPose(choice, studentId, poseKind, L);
      var poseSuf = (pose === 'wave' || pose === 'cheer') ? ('__' + pose) : '';
      var petUrl = mergedEq.pet ? petImageUrl(mergedEq.pet, pose) : '';

      var need = [
        poseSuf
          ? loadWithFallback(BASE + 'body_' + pose + '.webp' + ASSET_V, BASE + 'body_light.webp' + ASSET_V)
          : loadImg(BASE + 'body_light.webp' + ASSET_V),
        poseSuf
          ? loadWithFallback(BASE + 'skin_' + pose + '.webp' + ASSET_V, BASE + 'skin_mask.webp' + ASSET_V)
          : loadImg(BASE + 'skin_mask.webp' + ASSET_V),
        poseSuf
          ? loadWithFallback(BASE + 'tee_' + pose + '.webp' + ASSET_V, BASE + 'tee_light.webp' + ASSET_V)
          : loadImg(BASE + 'tee_light.webp' + ASSET_V)
      ]
        .concat(L.body.map(function (id) {
          if (poseSuf && POSED_TOPS[id]) {
            return loadWithFallback(BASE + 'wear/' + id + poseSuf + '.webp' + ASSET_V, BASE + 'wear/' + id + '.webp' + ASSET_V);
          }
          return loadImg(BASE + 'wear/' + id + '.webp' + ASSET_V);
        }))
        .concat(L.head.map(function (id) { return loadImg(BASE + 'wear/' + id + '.webp' + ASSET_V); }))
        .concat(petUrl ? [loadImg(petUrl + ASSET_V)] : [])
        .concat(mergedEq.aura ? [loadImg(auraUrl(mergedEq.aura))] : []);

      return Promise.all(need.map(function (p) { return p.catch(function () { return null; }); })).then(function (ims) {
        var bodyLight = ims[0], skinMask = ims[1], teeMask = ims[2];
        if (!bodyLight) throw new Error('body');

        var info = analyzeHead(headImg);
        var targetRgb = TONE_PRESET_RGB[tone] || info.skinRgb;
        var gradedBody = getGradedBody(bodyLight, skinMask, targetRgb, pose);

        var k = 3;
        var backIms = L.back.map(function () { return ims[k++]; });
        var legsIms = L.legs.map(function () { return ims[k++]; });
        var shoesIms = L.shoes.map(function () { return ims[k++]; });
        var topsIms = L.tops.map(function () { return ims[k++]; });
        var headIms = L.head.map(function () { return ims[k++]; });
        var petIm = petUrl ? ims[k++] : null;
        var auraIm = mergedEq.aura ? ims[k++] : null;
        var hasPet = !!(petIm && petIm.width > 0 && petIm.height > 0);

        var W = hasPet ? 690 : BODY_W, H = BODY_H + PAD + PAD_BOTTOM;
        var c = document.createElement('canvas'); c.width = Math.round(W * OUT_SCALE); c.height = Math.round(H * OUT_SCALE);
        var ctx = c.getContext('2d'); ctx.scale(OUT_SCALE, OUT_SCALE);

        var hx = (BODY_W - HEAD) / 2, hy = PAD + NECK_Y - HEAD * CHIN;
        var prep = prepareHead(headImg, L.head);
        var bh = (!prep.suppressBackHair) ? info.backHair : null;
        var bx1 = 0, bx2 = 0, by1 = 0, by2 = 0;
        if (bh && headImg) {
          bx1 = Math.round(hx + bh.x1Norm * HEAD);
          bx2 = Math.round(hx + bh.x2Norm * HEAD);
          by1 = Math.round(hy + bh.y1Norm * HEAD);
          by2 = Math.min(Math.round(hy + bh.y2Norm * HEAD), PAD + 108);
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

        // Punch out hidden base arms beneath outfits so zero inner T-shirt sleeve or doubled bare arm peeks out
        if (pose === 'stand') {
          var armEraseMaxY = 0;
          L.tops.forEach(function (tid, idx) {
            if (!topsIms[idx]) return;
            if (SLOT_BY_ITEM[tid] === 'accessory' || CHEST_SHADOW_ITEMS[tid] || TORSO_ONLY_TOPS[tid] || tid === 'cs-sport-shirt') return;
            if (GLOVED_SUITS[tid]) armEraseMaxY = Math.max(armEraseMaxY, 470);
            else if (THREE_QUARTER_SLEEVES[tid]) armEraseMaxY = Math.max(armEraseMaxY, 304);
            else armEraseMaxY = Math.max(armEraseMaxY, 346);
          });
          if (armEraseMaxY > 0) {
            bg.clearRect(0, 148, 171, armEraseMaxY - 148);
            bg.clearRect(BODY_W - 171, 148, 171, armEraseMaxY - 148);
          }
        } else {
          // Drawn Wave / Cheer outfits include their own complete drawn sleeves & 5-finger hands:
          // erase base arms outside chest [172..340] above waist and outside jeans hips [138..374] below waist
          var hasPosedSleeveTop = L.tops.some(function (tid, idx) {
            return !!topsIms[idx] && !!POSED_TOPS[tid] && !TORSO_ONLY_TOPS[tid];
          });
          if (hasPosedSleeveTop) {
            bg.clearRect(0, 0, 172, 392);            // from the very top, so no fingertip outline is left floating
            bg.clearRect(BODY_W - 172, 0, 172, 392);
            bg.clearRect(0, 392, 144, 98);
            bg.clearRect(BODY_W - 144, 392, 144, 98);
          }
        }

        // 3. Layer drawn body + wearables cleanly in anatomical z-order
        var bodyComp = document.createElement('canvas'); bodyComp.width = BODY_W; bodyComp.height = BODY_H;
        var bc = bodyComp.getContext('2d');

        backIms.forEach(function (im, idx) {
          if (!im) return;
          if (L.back[idx] === 'cs-fairy-wings') {
            bc.save();
            bc.beginPath();
            bc.rect(0, 0, BODY_W, 395);
            bc.clip();
            bc.drawImage(im, 0, 0, BODY_W, BODY_H);
            bc.restore();
          } else {
            bc.drawImage(im, 0, 0, BODY_W, BODY_H);
          }
        });

        if (!hasFullSuit) {
          legsIms.forEach(function (im, idx) {
            if (im && L.legs[idx] !== 'av-legs-tutu') {
              bc.drawImage(getGradedLeg(im, L.legs[idx], targetRgb), 0, 0, BODY_W, BODY_H);
            }
          });
        }

        bc.drawImage(bodyLayer, 0, 0);

        if (!hasFullSuit) {
          legsIms.forEach(function (im, idx) {
            if (im && L.legs[idx] === 'av-legs-tutu') {
              bc.drawImage(im, 0, 0, BODY_W, BODY_H);
            }
          });
        }

        shoesIms.forEach(function (im) { if (im) bc.drawImage(im, 0, 0, BODY_W, BODY_H); });

        var confettiIm = null;
        topsIms.forEach(function (im, idx) {
          if (!im) return;
          var tid = L.tops[idx];
          if (tid === 'acc-confetti') { confettiIm = im; return; }
          var graded = getGradedTop(im, tid, targetRgb, pose);
          if (CHEST_SHADOW_ITEMS[tid]) {
            bc.save();
            bc.shadowColor = 'rgba(10, 8, 30, 0.24)';
            bc.shadowBlur = 4;
            bc.shadowOffsetY = 2;
            bc.drawImage(graded, 0, 0, BODY_W, BODY_H);
            bc.restore();
            return;
          }
          if (RIGHT_HAND_PROPS[tid] && pose === 'wave') {
            // Hold handheld prop naturally in the relaxed left hand while waving with the right hand!
            bc.save();
            bc.translate(BODY_W, 0);
            bc.scale(-1, 1);
            bc.drawImage(graded, 0, 0, BODY_W, BODY_H);
            bc.restore();
            return;
          }
          if (RIGHT_HAND_PROPS[tid] && pose === 'cheer') {
            bc.save();
            if (!STAFF_PROPS[tid]) {
              bc.translate(10, -258);
              bc.drawImage(graded, 0, 0, BODY_W, BODY_H);
            } else {
              bc.drawImage(graded, 0, 0, BODY_W, BODY_H);
            }
            bc.restore();
            return;
          }
          bc.drawImage(graded, 0, 0, BODY_W, BODY_H);
        });

        // Stamp cape front collar clasps over the T-shirt/chest neckline so gold clasps sit in front
        backIms.forEach(function (im, idx) {
          var bid = L.back[idx];
          if (!im || !CAPE_CLASP_ITEMS[bid]) return;
          bc.save();
          bc.beginPath();
          bc.rect(152, 0, 208, 168);
          bc.clip();
          bc.drawImage(im, 0, 0, BODY_W, BODY_H);
          bc.restore();
        });

        // Wave / Cheer outfits drawn without hands: put the pupil's own hands back on top
        if (pose === 'wave' || pose === 'cheer') {
          var needHands = L.tops.some(function (tid, idx) {
            return !!topsIms[idx] && !!POSED_TOPS[tid] && !TORSO_ONLY_TOPS[tid] && !topHasHands(topsIms[idx], pose);
          });
          if (needHands) bc.drawImage(handLayer(gradedBody, skinMask, pose, targetRgb.join(',')), 0, 0, BODY_W, BODY_H);
        }
        var slim = (genderOf(studentId, choice, headImg) === 'girl') ? 0.93 : 1;
        cc.drawImage(bodyComp, Math.round(BODY_W * (1 - slim) / 2), PAD, Math.round(BODY_W * slim), BODY_H);

        // 4. Draw prepared expressive head + head wearables (with subtle lively tilt anchored at the neck)
        var headTiltRad = 0;
        if (pose === 'wave') headTiltRad = 0.032;
        else if (pose === 'cheer') headTiltRad = -0.022;
        if (poseKind === 'laugh' || poseKind === 'dedicated-laugh') headTiltRad = -0.052;
        else if (poseKind === 'wink' || poseKind === 'dedicated-wink') headTiltRad = 0.062;

        cc.save();
        if (Math.abs(headTiltRad) > 0.001) {
          var pivX = BODY_W / 2, pivY = PAD + NECK_Y;
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

        // 4b. Aura: a glow ring behind the head and chest
        if (auraIm && auraIm.width) {
          var aS = 500;
          ctx.save(); ctx.globalAlpha = 0.95;
          ctx.drawImage(auraIm, Math.round(BODY_W / 2 - aS / 2), Math.round(PAD + 120 - aS / 2), aS, aS);
          ctx.restore();
        }
        // 5. Draw glowing 3D cyber-glass arcade pedestal disc underneath the character
        drawArcadePedestal(ctx, BODY_W / 2, PAD + 744, pedestalAccent(choice, studentId, mergedEq));

        // 6. Stamp one unified 5.2px pure-white outer sticker border around the character
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
          ctx.drawImage(sil, Math.cos(ang) * 5.2, Math.sin(ang) * 5.2);
        }
        for (var aIdx2 = 0; aIdx2 < 12; aIdx2++) {
          var ang2 = (aIdx2 / 12) * Math.PI * 2;
          ctx.drawImage(sil, Math.cos(ang2) * 2.6, Math.sin(ang2) * 2.6);
        }
        ctx.drawImage(sil, 0, 0);

        // 7. Stamp composed character + large 3D Pet Buddy companion + floating confetti
        ctx.drawImage(charCanvas, 0, 0);
        if (hasPet) {
          var pBox = getPetTightBox(petIm, petUrl) || { sx: 0, sy: 0, sw: petIm.width, sh: petIm.height };
          var aspect = pBox.sw / Math.max(1, pBox.sh);
          var maxPW = aspect > 1.15 ? 323 : (aspect >= 0.75 ? 297 : 285); // 25% smaller (teacher asked)
          var maxPH = aspect < 0.62 ? 450 : (aspect < 0.82 ? 383 : 345);
          var pSc = Math.min(maxPW / pBox.sw, maxPH / pBox.sh);
          var pW = Math.round(pBox.sw * pSc), pH = Math.round(pBox.sh * pSc);
          var pCx = aspect < 0.62 ? 530 : 516, pBottom = PAD + 756;
          var pX = Math.max(304, Math.min(W - pW - 10, Math.round(pCx - pW / 2)));
          var pY = Math.round(pBottom - pH);

          var pPad = 8;
          var pSil = document.createElement('canvas'); pSil.width = pW + pPad * 2; pSil.height = pH + pPad * 2;
          var psg = pSil.getContext('2d');
          psg.drawImage(petIm, pBox.sx, pBox.sy, pBox.sw, pBox.sh, pPad, pPad, pW, pH);
          var pSilData = psg.getImageData(0, 0, pSil.width, pSil.height), ppx = pSilData.data;
          for (var pi = 0, pn = pSil.width * pSil.height; pi < pn; pi++) {
            var pa = ppx[pi * 4 + 3];
            ppx[pi * 4] = 255; ppx[pi * 4 + 1] = 255; ppx[pi * 4 + 2] = 255;
            ppx[pi * 4 + 3] = pa > 42 ? 255 : 0;
          }
          psg.putImageData(pSilData, 0, 0);

          ctx.save();
          ctx.fillStyle = 'rgba(3, 6, 15, 0.48)';
          ctx.beginPath();
          ctx.ellipse(pX + pW / 2, pBottom - 4, Math.round(pW * 0.40), 10, 0, 0, Math.PI * 2);
          ctx.fill();
          for (var paIdx = 0; paIdx < 16; paIdx++) {
            var pang = (paIdx / 16) * Math.PI * 2;
            ctx.drawImage(pSil, pX - pPad + Math.cos(pang) * 4.4, pY - pPad + Math.sin(pang) * 4.4);
          }
          ctx.shadowColor = 'rgba(6, 9, 17, 0.48)';
          ctx.shadowBlur = 11;
          ctx.shadowOffsetY = 4;
          ctx.drawImage(petIm, pBox.sx, pBox.sy, pBox.sw, pBox.sh, pX, pY, pW, pH);
          ctx.restore();
        }
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
      : composeForPose(id, ownedLook(id, data.approved[id]), heads[id], equippedOf(id), kind).then(function (u) {
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

  function imgFor(id) { return on() ? (composed[id] || (monstersHidden() ? pictureFor(id) : '')) : ''; }
  var DEFAULT_PIC = BASE + 'head_demo.webp' + ASSET_V;
  var composedDefault = {}, pendingDefault = {}, defaultTimer = 0;
  function defaultChoice(id) { return { skin: 'auto', tee: TEES[hashId(String(id || '')) % TEES.length], stance: 'stand', wear: {} }; }
  function scheduleRerender() {
    if (defaultTimer) return;
    defaultTimer = setTimeout(function () { defaultTimer = 0; rerender(); }, 400);
  }
  /** The picture to show for a pupil anywhere on the platform (never a monster). */
  function pictureFor(id) {
    if (!id) return DEFAULT_PIC;
    if (composed[id]) return composed[id];
    if (composedDefault[id]) return composedDefault[id];
    if (state === 'idle') load();
    if (state === 'ready' && !data.approved[id] && !pendingDefault[id]) {
      pendingDefault[id] = 1;
      var headP = heads[id] ? Promise.resolve(heads[id]) : fetchHead(id).then(function (im) { return im || defaultHeadFor(id); });
      headP.then(function (h) { return compose(defaultChoice(id), h, {}, 'smile', id); })
        .then(function (u) { composedDefault[id] = u; scheduleRerender(); })
        .catch(function () { /* keep the placeholder */ });
    }
    return DEFAULT_PIC;
  }
  /* ---------- for the shop: item facts, try-on and wearing ---------- */
  function allStoreItemIds(studentId) {
    var ids = [];
    pickerCategories(studentId || null).forEach(function (c) { (c.items || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
    return ids;
  }
  function slotOf(id) { return petById(id) ? 'pet' : (SLOT_BY_ITEM[id] || ''); }
  function rarityOf(id) {
    var st = store(), ids = [id].concat(AVATAR_TO_MONSTER_EQUIV[id] || []);
    var p = petById(id); if (p && p.rarity) return p.rarity;
    try {
      var items = st && st.getMonsterItems ? (st.getMonsterItems() || []) : [];
      for (var i = 0; i < items.length; i++) if (ids.indexOf(items[i].id) >= 0 && items[i].rarity) return items[i].rarity;
    } catch (e) { /* use the rule below */ }
    if (String(id).indexOf('cs-my-') === 0) return 'legendary';
    if (String(id).indexOf('cs-') === 0) return 'epic';
    var sl = slotOf(id);
    if (sl === 'legs' || sl === 'shoes' || sl === 'glasses' || sl === 'wig') return 'common';
    return 'rare';
  }
  function itemInfo(id) {
    var sl = slotOf(id); if (!sl) return null;
    var pic = sl === 'pet' ? (petImageUrl(id, 'stand') + ASSET_V) : sl === 'aura' ? auraUrl(id) : (BASE + 'wear/' + id + '.webp' + ASSET_V);
    var nm = '';
    if (sl === 'aura') { try { var mi = (store() && store().getMonsterItems ? store().getMonsterItems() : []).filter(function (x) { return x.id === id; })[0]; nm = mi && mi.name; } catch (e) { nm = ''; } }
    return { id: id, name: nm || prettyName(id), slot: sl, rarity: rarityOf(id), pic: pic, free: !!FREE_STARTER_ITEMS[id] };
  }
  function lookOf(id) {
    var base = data.approved[id] || data.pending[id] || defaultChoice(id);
    var c = JSON.parse(JSON.stringify(base)); if (!c.wear) c.wear = {};
    return c;
  }
  /** The pupil wearing one more item (nothing saved). Resolves to a picture address. */
  function previewWith(id, itemId) {
    var c = lookOf(id), sl = itemId ? slotOf(itemId) : '';
    if (sl) c.wear[sl] = itemId;
    var headP = heads[id] ? Promise.resolve(heads[id]) : fetchHead(id).then(function (im) { return im || defaultHeadFor(id); });
    return fetchWear().then(function () { return headP; }).then(function (h) { return compose(c, h, equippedOf(id), 'smile', id); });
  }
  /** Put an owned item on (or take a slot off) and save it to the board. */
  function wearItem(id, itemId, slot) {
    var c = lookOf(id), sl = slot || slotOf(itemId); if (!sl) return Promise.resolve(false);
    if (itemId) c.wear[sl] = itemId; else delete c.wear[sl];
    c.at = nowIso();
    data.approved[id] = c;
    if (data.pending[id]) { delete data.pending[id]; markRemoved('pending', id); }
    delete composedDefault[id];
    return recompose(id).then(function () { rerender(); return save().catch(function () { return null; }); }).then(function () { return true; });
  }
  function wearingOf(id) { var c = data.approved[id]; return (c && c.wear) ? JSON.parse(JSON.stringify(c.wear)) : {}; }
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
    '.pa-own{position:absolute;top:5px;right:5px;background:rgba(6,78,59,.92);border:1px solid rgba(52,211,153,.75);color:#a7f3d0;border-radius:99px;padding:1px 6px;font-size:.64rem;font-weight:700}' +
    '.pa-mon-tag{position:absolute;top:5px;left:5px;background:rgba(30,27,75,.9);border:1px solid rgba(56,189,248,.7);color:#bae6fd;border-radius:99px;padding:1px 5px;font-size:.62rem;font-weight:700}' +
    '.pa-item img{width:76px;height:76px;object-fit:contain;filter:drop-shadow(0 3px 6px rgba(0,0,0,.4))}' +
    '.pa-item span{font-size:.78rem;line-height:1.15;font-weight:600}' +
    '.pa-rev{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}.pa-card{background:rgba(255,255,255,.1);border-radius:20px;padding:10px;text-align:center}.pa-card img{width:100%;height:220px;object-fit:contain}' +
    '.pa-card .row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px}.pa-card .row button,.pa-card label{border:0;border-bottom:4px solid rgba(0,0,0,.28);border-radius:12px;padding:8px 12px;font:600 .95rem Fredoka,system-ui,sans-serif;cursor:pointer;background:rgba(255,255,255,.18);color:#fff}' +
    '.pa-card .row .ok{background:#22c55e;border-bottom-color:#15803d}.pa-card .row .no{background:#ef4444;border-bottom-color:#991b1b}.pa-card input{display:none}' +
    '.pa-note{background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.6);border-radius:14px;padding:10px 14px;margin:0 0 14px}' +
    '.pa-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.pa-tabs button{border:0;border-bottom:5px solid rgba(0,0,0,.28);border-radius:99px;padding:10px 18px;font:600 1rem Fredoka,system-ui,sans-serif;background:rgba(255,255,255,.14);color:#fff;cursor:pointer}.pa-tabs button.on{background:#fde047;color:#1e1b4b;border-bottom-color:#ca8a04}' +
    '@keyframes paIdleBreath{0%,100%{transform:translateY(0) scale(1.12)}50%{transform:translateY(-4px) scale(1.135)}}' +
    '.cb-st img.cb-mon.pa-av{aspect-ratio:3/4;object-position:center bottom}' +
    '.cb-pw:has(img.pa-av)>i.cb-ped{display:none}' +
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

  // Girl or boy look: 1) the teacher's choice in Dress up, 2) the first name, 3) for names used by both, long hair
  // in the pupil's face picture. Common Turkish first names only; real pupil names are never stored in this file.
  var GIRL_NAMES = ('ada alya aslihan ayca ayse ayla aylin azra bahar bahriye begum belis beren beste betul bugce buglem buse cansu ceren cemre damla defne derya dilara dila duru ebru ece ecem eda ela elif elisa ella elvan esila esma esra eylul feyza gizem gokce gulce gulsen gunes hande hazal hira ilay iclal ilayda ilgin ipek irem irmak kumsal lal lara lina masal melda melek melis melisa melodi meryem mila mina mira miray nehir nil nilda nilsu nisa naz ozge oyku pelin pinar rabia rana sare seda selin sena serra sila simal sude suhan su tuana tugce yagmur yaren yasemin zehra zeynep zumra')
    .split(' ').reduce(function (o, n) { o[n] = 1; return o; }, {});
  var BOY_NAMES = ('ahmet ali alp alparslan aras arda ates ayaz baran baris berat berk burak can cinar demir doruk efe egehan emir emre enes eren ertugrul eymen fatih furkan goktug gurur hasan huseyin ibrahim ilker kaan kemal kerem kuzey mehmet melik mert metehan miran mustafa omer onur ozan poyraz salih selim taha tuna ugur umut uras utku yigit yunus yusuf')
    .split(' ').reduce(function (o, n) { o[n] = 1; return o; }, {});
  function foldName(s) {
    return String(s || '').trim().split(/\s+/)[0].toLocaleLowerCase('tr')
      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/i̇/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/[^a-z]/g, '');
  }
  function longHair(headImg) {
    if (!headImg) return false;
    try { var bh = analyzeHead(headImg).backHair; return !!(bh && (bh.y2Norm - bh.y1Norm) > 0.12); } catch (e) { return false; }
  }
  function genderOf(id, choice, headImg) {
    var c = choice || data.approved[id] || data.pending[id];
    if (c && (c.gender === 'girl' || c.gender === 'boy')) return c.gender;
    var st = studentRecord(id), fn = foldName(st && (st.firstName || st.name));
    if (GIRL_NAMES[fn]) return 'girl';
    if (BOY_NAMES[fn]) return 'boy';
    return longHair(headImg || heads[id]) ? 'girl' : 'boy';
  }
  var DEFAULT_GIRL_PIC = BASE + 'head_demo_girl.webp' + ASSET_V;
  function defaultHeadFor(id) {
    var url = genderOf(id) === 'girl' ? DEFAULT_GIRL_PIC : (BASE + 'head_demo.webp' + ASSET_V);
    return loadImg(url).catch(function () { return loadImg(BASE + 'head_demo.webp' + ASSET_V).catch(function () { return null; }); });
  }

  function ownedWear(id, wear) {
    var out = {}, t = ui.tab; ui.tab = 'make';
    try {
      Object.keys(wear || {}).forEach(function (sl) {
        var it = wear[sl];
        if (!it || it === 'none' || !itemLockInfo(id, it).locked) out[sl] = it;
      });
    } finally { ui.tab = t; }
    return out;
  }
  /** the saved look with only the items the pupil really has (used when the board draws the avatar) */
  function ownedLook(id, choice) {
    if (!choice || lockMode() !== 'earned') return choice;
    var c = Object.assign({}, choice); c.wear = ownedWear(id, choice.wear);
    return c;
  }
  function choiceForStudent(id) {
    var base = data.pending[id] || data.approved[id] || {};
    return {
      skin: base.manualSkin ? base.skin : 'auto',
      manualSkin: !!base.manualSkin,
      tee: base.tee || TEES[6],
      stance: base.stance || '',
      gender: (base.gender === 'girl' || base.gender === 'boy') ? base.gender : '',
      wear: Object.assign({}, base.wear || {})
    };
  }

  function open(opts) {
    ensureCss();
    ui.isOpen = true;
    ui.tab = (opts && opts.tab) || 'make';
    if (ui.tab === 'review' && inClassMode()) ui.tab = 'make';
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
    var raw = (c && c.stance) || '';
    var eff = effectiveWear(c, ui.pick ? equippedOf(ui.pick) : {});
    var cur = (raw === 'wave' || raw === 'cheer') ? raw : ((raw === 'stand' || raw === 'natural' || raw === 'hip') ? 'stand' : (ui.pick ? resolveDrawnPose(c, ui.pick, 'smile', wearLayers(eff)) : 'stand'));
    var g = ui.pick ? genderOf(ui.pick, c, heads[ui.pick]) : ((c && c.gender) || 'boy');
    return '<div class="pa-poses" style="margin-top:6px">' + STANCES.map(function (st) {
      return '<button type="button" class="' + (cur === st.id ? 'on' : '') + '" onclick="PupilAvatars._stance(\'' + st.id + '\')">' + st.label + '</button>';
    }).join('') + '</div>' +
      '<div class="pa-poses" style="margin-top:6px">' + [['girl', '👧 Girl'], ['boy', '👦 Boy']].map(function (x) {
        return '<button type="button" class="' + (g === x[0] ? 'on' : '') + '" onclick="PupilAvatars._gender(\'' + x[0] + '\')">' + x[1] + '</button>';
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
      '<button class="' + (ui.tab === 'wardrobe' ? 'on' : '') + '" onclick="PupilAvatars._tab(\'wardrobe\')">👗 Wardrobe (' + allItemCount() + ' items)</button>' +
      (inClassMode() ? '' : '<button class="' + (ui.tab === 'review' ? 'on' : '') + '" onclick="PupilAvatars._tab(\'review\')">✅ Teacher check' + (waiting ? ' (' + waiting + ')' : '') + '</button>') +
      '</div>';
    if (state === 'loading') html += '<p class="s">Loading avatars…</p>';
    if (state === 'nostore' && ui.tab !== 'wardrobe') html += '<div class="pa-note">Avatars are saved in a private cloud folder that is not ready yet. Ask your teacher to run <b>pupil_avatars_storage.sql</b> in Supabase, then sign in again.' + (lastError ? '<br><small>' + esc(lastError) + '</small>' : '') + '</div>';
    if (state === 'error') html += '<div class="pa-note">Could not reach the avatar folder. Check the internet and try again.<br><small>' + esc(lastError) + '</small></div>';
    html += ui.tab === 'review' ? reviewHtml() : (ui.tab === 'wardrobe' ? wardrobeHtml() : (ui.pick ? makeHtml() : namesHtml()));
    o.innerHTML = html + '</div>';
    if ((ui.tab === 'make' && ui.pick) || ui.tab === 'wardrobe') refreshPreview();
  }
  function namesHtml() {
    return '<h2>Who are you?</h2><p class="s">Tap your name, or open <b>👗 Wardrobe</b> above to try on every outfit, hat, wig, pet buddy, and pair of shoes!</p><div class="pa-names">' +
      pupils().map(function (s) {
        var stt = statusOf(s.id);
        return '<button class="' + stt + '" onclick="PupilAvatars._pick(\'' + esc(s.id) + '\')">' + esc(firstName(s)) + (stt === 'done' ? '<small>✓ ready</small>' : stt === 'wait' ? '<small>waiting for teacher</small>' : '') + '</button>';
      }).join('') + '</div>';
  }
  function wardrobePickerHtml(c) {
    var cats = pickerCategories(ui.pick);
    var activeCat = cats.filter(function (x) { return x.key === ui.cat; })[0] || cats[0];
    var monEq = ui.pick ? avatarEquipFromMonster(equippedOf(ui.pick)) : {};
    var effWear = effectiveWear(c, ui.pick ? equippedOf(ui.pick) : {});
    var curVal = effWear[activeCat.key] || '';
    var earnedNote = (ui.tab === 'make' && lockMode() === 'earned') ? ' · <small style="color:#fde047">🪙 Earned Mode: earn XP or buy items in the Shop to unlock more!</small>' : '';
    var syncNote = ui.pick ? (monstersHidden() ? '' : ' · <small style="color:#7dd3fc">👾 Synced with Monster belongings</small>') : '';
    return '<div class="pa-step"><b>3. Dress Up (' + cats.reduce(function (n, x) { return n + x.items.length; }, 0) + ' items)' + syncNote + earnedNote + '</b>' +
      '<div class="pa-cats">' + cats.map(function (cat) {
        var hasEq = effWear[cat.key] && effWear[cat.key] !== 'none';
        return '<button class="' + (activeCat.key === cat.key ? 'on' : '') + '" onclick="PupilAvatars._cat(\'' + cat.key + '\')">' +
          esc(cat.label) + ' (' + cat.items.length + ')' + (hasEq ? ' ✓' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="pa-grid">' +
      '<button class="pa-item ' + (!curVal || curVal === 'none' ? 'on' : '') + '" onclick="PupilAvatars._wear(\'' + activeCat.key + '\',\'none\')">' +
      '<div style="height:76px;display:flex;align-items:center;justify-content:center;font-size:2rem">🚫</div><span>None</span></button>' +
      activeCat.items.map(function (itemId) {
        var isOn = curVal === itemId;
        var lk = itemLockInfo(ui.pick, itemId);
        var isOwned = !lk.locked && ui.pick && studentOwnsItem(ui.pick, itemId);
        var isOnMonster = ui.pick && monEq[activeCat.key] === itemId;
        var thumbSrc = activeCat.isPet ? (petImageUrl(itemId, 'stand') + ASSET_V) : activeCat.key === 'aura' ? auraUrl(itemId) : (BASE + 'wear/' + itemId + '.webp' + ASSET_V);
        return '<button class="pa-item ' + (isOn ? 'on ' : '') + (lk.locked ? 'locked' : '') + '" ' +
          (lk.locked ? 'disabled aria-disabled="true"' : 'onclick="PupilAvatars._wear(\'' + activeCat.key + '\',\'' + itemId + '\')"') + '>' +
          (lk.locked ? '<small class="pa-lock">' + esc(lk.label) + '</small>' : (isOwned ? '<small class="pa-own">🎒 Owned</small>' : '')) +
          (isOnMonster && !monstersHidden() ? '<small class="pa-mon-tag" title="Equipped on Monster">👾</small>' : '') +
          '<img src="' + thumbSrc + '" loading="lazy" alt="' + esc(prettyName(itemId)) + '">' +
          '<span>' + esc(prettyName(itemId)) + '</span></button>';
      }).join('') +
      '</div></div>';
  }
  function makeHtml() {
    var s = pupils().filter(function (x) { return x.id === ui.pick; })[0] || studentRecord(ui.pick);
    var c = ui.choice || { skin: 'auto', tee: TEES[6], stance: '', wear: {} };
    return '<h2>Hello, ' + esc(firstName(s)) + '!</h2><p class="s">Your items from the Shop and boxes are ready. Change anything you like, then tap “Send to my teacher”.</p>' +
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
      '<button class="pa-go b" onclick="PupilAvatars._syncMonster()" title="Wear everything your Monster wears">👾 Match Monster</button>' +
      '<button class="pa-go b" onclick="PupilAvatars._random()">🎲 Surprise me</button>' +
      '<button class="pa-go b" onclick="PupilAvatars._clearWear()">🧹 Plain outfit</button>' +
      '<button class="pa-go b" onclick="PupilAvatars._pick(null)">← Back</button></div>' +
      '</div></div>';
  }
  function wardrobeHtml() {
    var c = ui.choice || (ui.choice = { skin: 'auto', tee: TEES[6], stance: '', wear: {} });
    var list = pupils();
    return '<h2>👗 Avatar Wardrobe — Belongings &amp; Full Dress-Up</h2>' +
      '<p class="s">Select a pupil to see their synced Monster gear &amp; 🎒 Owned belongings, or try on any outfit, pet buddy, hat, and pose!</p>' +
      '<div class="pa-make"><div class="pa-prev"><img id="pa-prev" alt="Wardrobe preview">' + poseBarHtml() + stanceBarHtml(c) +
      '<div style="margin-top:8px">' +
      (ui.pick ? '<button class="pa-go b" style="padding:8px 12px;font-size:.9rem" onclick="PupilAvatars._syncMonster()">👾 Match Monster</button>' : '') +
      '<button class="pa-go b" style="padding:8px 12px;font-size:.9rem" onclick="PupilAvatars._random()">🎲 Random</button>' +
      '<button class="pa-go b" style="padding:8px 12px;font-size:.9rem" onclick="PupilAvatars._clearWear()">🧹 Plain</button></div></div><div>' +
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
    var headP = id ? (heads[id] ? Promise.resolve(heads[id]) : fetchHead(id).then(function (im) { if (im) heads[id] = im; return im || defaultHeadFor(id); })) : (ui.tab === 'wardrobe' ? loadImg(BASE + 'head_demo.webp' + ASSET_V).catch(function () { return null; }) : Promise.resolve(null));
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
    var eq = equippedOf(id);
    lastEquipSig[id] = JSON.stringify(avatarEquipFromMonster(eq));
    return compose(ownedLook(id, data.approved[id]), heads[id], eq, 'smile', id).then(function (u) { composed[id] = u; return u; });
  }
  function updateBoardAvatarDom(id) {
    if (!on() || !id || !composed[id] || typeof document === 'undefined') return;
    var card = document.getElementById('cb-' + id);
    var img = card ? card.querySelector('img.cb-mon.pa-av') : null;
    if (img) img.src = composed[id];
  }
  function syncStudent(id) {
    if (!id || state !== 'ready' || !data.approved[id]) return Promise.resolve();
    return recompose(id).then(function () {
      updateBoardAvatarDom(id);
      if (ui.isOpen && ui.pick === id) draw();
    }).catch(function () {});
  }
  function syncAllChanged() {
    installStoreSyncHook();
    if (state !== 'ready') return Promise.resolve(0);
    var changed = Object.keys(data.approved).filter(function (id) {
      return equipSignature(id) !== (lastEquipSig[id] || '');
    });
    if (!changed.length) return Promise.resolve(0);
    return Promise.all(changed.map(function (id) {
      return recompose(id).then(function () { updateBoardAvatarDom(id); }).catch(function () {});
    })).then(function () {
      if (ui.isOpen && ui.pick && changed.indexOf(ui.pick) >= 0) draw();
      return changed.length;
    });
  }
  function installStoreSyncHook() {
    var st = store();
    if (!st || st._paProfileHooked) return;
    st._paProfileHooked = true;
    if (typeof st.updateMonsterProfile === 'function') {
      var origUpdate = st.updateMonsterProfile;
      st.updateMonsterProfile = function (studentId) {
        var res = origUpdate.apply(this, arguments);
        if (studentId) setTimeout(function () { syncStudent(studentId); }, 40);
        return res;
      };
    }
    if (typeof st.subscribe === 'function') {
      var syncTimer = null;
      try {
        st.subscribe(function () {
          if (state !== 'ready') return;
          if (syncTimer) clearTimeout(syncTimer);
          syncTimer = setTimeout(syncAllChanged, 350);
        });
      } catch (e) {}
    }
  }

  var api = {
    mode: mode, on: on, setMode: setMode, load: load, imgFor: imgFor, has: has, open: open, close: close,
    lockMode: lockMode,
    genderOf: function (id) { return genderOf(id); },
    pictureFor: pictureFor, itemInfo: itemInfo, storeItemIds: allStoreItemIds, previewWith: previewWith,
    wearItem: wearItem, wearingOf: wearingOf, monstersHidden: monstersHidden,
    // lock check for the shop (ignores which tab the dress-up window was last on)
    levelFor: function (id) { return LEVEL_BY_RARITY[rarityOf(id)] || 0; },
    lockFor: function (sid, id) { var t = ui.tab; ui.tab = 'make'; try { return itemLockInfo(sid, id); } finally { ui.tab = t; } },
    // test helper: draw one pupil in a chosen stance without saving anything
    _debugCompose: function (id, stance, itemId) {
      var ch = Object.assign({}, data.approved[id] || {}, { stance: stance || '' });
      if (itemId) { ch.wear = Object.assign({}, ch.wear || {}); ch.wear[slotOf(itemId)] = itemId; }
      return (heads[id] ? Promise.resolve(heads[id]) : fetchHead(id).then(function (im) { return im || defaultHeadFor(id); })).then(function (h) { return compose(ch, h, equippedOf(id), 'smile', id); });
    },
    triggerEmotion: triggerEmotion,
    syncStudent: syncStudent,
    syncAll: syncAllChanged,
    owns: studentOwnsItem,
    catalog: CATALOG,
    status: function () { return { state: state, error: lastError, approved: Object.keys(data.approved).length, pending: Object.keys(data.pending).length, lockMode: lockMode() }; },
    toggleButton: function () {
      return (monstersHidden() ? '' : '<button class="cb-look" onclick="PupilAvatars.setMode(PupilAvatars.on()?\'monsters\':\'avatars\')" title="Show monsters or the pupils\' avatars">' + (on() ? '🧒 Avatars' : '👾 Monsters') + '</button>') +
        (on() ? '<button class="cb-look" onclick="PupilAvatars.open()" title="Make an avatar, try on the wardrobe' + (inClassMode() ? '' : ', check pupils\' avatars') + '">🎨 Dress up</button>' : '');
    },
    _tab: function (t) {
      if (t === 'review' && inClassMode()) t = 'make';   // pupils at the board cannot approve avatars
      ui.tab = t;
      ui.pose = 'smile';
      if (t === 'wardrobe' && !ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], wear: {} };
      draw();
    },
    _pose: function (p) {
      ui.pose = p || 'smile';
      draw();
    },
    _gender: function (g) {
      if (!ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], stance: '', wear: {} };
      ui.choice.gender = (g === 'girl') ? 'girl' : 'boy';
      draw();
    },
    _stance: function (st) {
      if (!ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], stance: '', wear: {} };
      ui.choice.stance = st || 'stand';
      ui.pose = 'smile';
      draw();
    },
    _toggleLockMode: function () {
      if (!data.settings) data.settings = { lockMode: 'earned' };
      data.settings.lockMode = (lockMode() === 'earned') ? 'free' : 'earned';
      data.settings.at = nowIso();
      save().catch(function () {});
      toast(data.settings.lockMode === 'earned' ? '🪙 Earned Mode ON: special items unlock by Monster Level & Shop.' : '🔓 Free Dress-Up ON: all items are open to everyone.');
      draw();
    },
    _cat: function (c) { ui.cat = c; draw(); },
    _wear: function (slot, itemId) {
      if (itemId && itemId !== 'none' && itemLockInfo(ui.pick, itemId).locked) return;
      if (!ui.choice) ui.choice = { skin: 'auto', tee: TEES[6], wear: {} };
      if (!ui.choice.wear) ui.choice.wear = {};
      var monEq = ui.pick ? avatarEquipFromMonster(equippedOf(ui.pick)) : {};
      var eff = effectiveWear(ui.choice, ui.pick ? equippedOf(ui.pick) : {});
      if (!itemId || itemId === 'none' || eff[slot] === itemId) {
        if (monEq[slot]) ui.choice.wear[slot] = 'none';
        else delete ui.choice.wear[slot];
      } else if (monEq[slot] === itemId) {
        delete ui.choice.wear[slot];
      } else {
        ui.choice.wear[slot] = itemId;
      }
      draw();
    },
    _syncMonster: function () {
      if (ui.choice) { ui.choice.wear = {}; }
      toast('👾 Synced with Monster outfit & Pet Buddy!');
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
      if (ui.choice) {
        var monEq = ui.pick ? avatarEquipFromMonster(equippedOf(ui.pick)) : {};
        var noneMap = {};
        Object.keys(monEq).forEach(function (k) { if (k !== 'aura') noneMap[k] = 'none'; });
        ui.choice.wear = noneMap;
        ui.choice.stance = '';
      }
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
      data.pending[id] = { skin: ui.choice.skin || 'auto', manualSkin: !!ui.choice.manualSkin, tee: ui.choice.tee, stance: ui.choice.stance || '', gender: ui.choice.gender || '', wear: ownedWear(id, ui.choice.wear), at: new Date().toISOString() };
      save().then(function () { try { root.classSoundboard && root.classSoundboard.playTaDa && root.classSoundboard.playTaDa(); } catch (e) { /* ignore */ } toast('Sent! Your teacher will check it.'); }).catch(function () { /* toast shown */ });
      ui.pick = null; draw();
    },
    _saveDirect: function () {
      var id = ui.pick; if (!id || !ui.choice) return;
      data.approved[id] = { skin: ui.choice.skin || 'auto', manualSkin: !!ui.choice.manualSkin, tee: ui.choice.tee, stance: ui.choice.stance || '', gender: ui.choice.gender || '', wear: ownedWear(id, ui.choice.wear), at: new Date().toISOString() };
      if (data.pending[id]) { delete data.pending[id]; markRemoved('pending', id); }
      recompose(id).then(function () {
        if (client()) return save();
      }).then(function () { toast('Saved onto the Class Board!'); draw(); if (on()) rerender(); }).catch(function () { draw(); if (on()) rerender(); });
    },
    _approve: function (id) {
      data.approved[id] = Object.assign({}, data.pending[id], { at: nowIso() }); delete data.pending[id]; markRemoved('pending', id);
      save().then(function () { return recompose(id); }).then(function () { draw(); if (on()) rerender(); }).catch(function () { draw(); });
    },
    _reject: function (id) { delete data.pending[id]; markRemoved('pending', id); save().then(draw).catch(draw); },
    _remove: function (id) { delete data.approved[id]; markRemoved('approved', id); delete composed[id]; clearEmotionCache(id); save().then(function () { draw(); rerender(); }).catch(draw); },
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
        if (sb) writeHeadRows([id]).catch(function () { toast('The face is on this device only: sign in and try again.'); });
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
            if (sb) writeHeadRows([stem]).catch(function () {});
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
