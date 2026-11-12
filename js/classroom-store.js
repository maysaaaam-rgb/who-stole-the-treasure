/**
 * Classroom Store: coins, buying monster items and mystery boxes, and classroom privileges.
 *
 * Rules (so XP and monster levels are never touched):
 *  - Coins are separate from XP. A student's coins = the most XP/10 they ever reached + coins the teacher gave - coins spent.
 *    (If a teacher later lowers someone's XP, coins already earned are NOT taken back.)
 *  - Buying never changes XP. Privilege requests hold the coins until the teacher approves (kept) or declines (refunded).
 *  - Everything is saved in the same local state as the existing mystery boxes and inventory (store.state.classroomStore).
 */
(function (root) {
  'use strict';
  var store = root.schoolStore || root.store;
  if (!store) return;
  try { if (root.MonsterCostumes) root.MonsterCostumes.install(store); } catch (e) { /* costumes are optional */ }
  try { if (root.MonsterPets) root.MonsterPets.install(store); } catch (e) { /* pets are optional */ }

  var DEFAULTS = {
    coinsPerXp: 10,
    itemPrices: { common: 20, rare: 40, epic: 80, legendary: 150, mythic: 250 },
    boxPrices: { BRONZE: 15, WOODEN: 30, GILDED: 80, CELESTIAL: 180 },
    privileges: [
      { id: 'p-cat-sticker',    icon: '🐱', image: 'assets/store/prize_cat_stickers.webp',  badge: 'REAL PRIZE · KEEP IT!',   name: '1× Funny Cat Meme Sticker (Pick Your Favourite!)', price: 40, weeklyLimit: 2, coinsOnly: true, active: true },
      { id: 'p-cat-pack',       icon: '😻', image: 'assets/store/prize_cat_stickers.webp',  badge: 'REAL PRIZE · 3 PACK!',    name: '3× Funny Cat Meme Sticker Pack',                  price: 100, weeklyLimit: 1, coinsOnly: true, active: true },
      { id: 'p-topper-mystery', icon: '🎁', image: 'assets/store/prize_pencil_topper.webp', badge: 'REAL 3D TOY PRIZE!',      name: 'Mystery 3D Cute Pencil Topper (Blind Draw)',      price: 120, weeklyLimit: 1, coinsOnly: true, active: true },
      { id: 'p-topper-vip',     icon: '👑', image: 'assets/store/prize_pencil_topper.webp', badge: 'VIP REAL 3D PRIZE!',      name: 'VIP Choice 3D Cute Pencil Topper (Pick Any One!)', price: 160, weeklyLimit: 1, coinsOnly: true, active: true },
      { id: 'p-song', icon: '🎵', name: 'Choose the warm-up song', price: 40, weeklyLimit: 2, active: true },
      { id: 'p-seat', icon: '🪑', name: 'Sit anywhere for one lesson', price: 30, weeklyLimit: 2, active: true },
      { id: 'p-helper', icon: '🧑‍🏫', name: "Be the teacher's helper", price: 50, weeklyLimit: 1, active: true },
      { id: 'p-game', icon: '🎲', name: 'Pick the next game', price: 60, weeklyLimit: 1, active: true },
      { id: 'p-dj', icon: '🎧', name: 'Class DJ for 5 minutes', price: 70, weeklyLimit: 1, active: true },
      { id: 'p-sticker', icon: '🌟', name: 'Special sticker', price: 35, weeklyLimit: 2, active: true },
      { id: 'p-hwpass', icon: '🎟️', name: 'Homework pass (one small task)', price: 150, weeklyLimit: 1, active: true }
    ]
  };
  var SELL_CATEGORIES = ['hat', 'glasses', 'accessory', 'backpack', 'clothing', 'background', 'aura', 'body', 'creature', 'pet', 'trail'];
  // Four kinds of mystery box. The saved ids stay WOODEN / GILDED / CELESTIAL (old boxes keep working); they are shown as Silver / Gold / Diamond.
  var TIERS = ['BRONZE', 'WOODEN', 'GILDED', 'CELESTIAL'];
  var BOX_INFO = {
    BRONZE:    { name: 'Bronze Box',  icon: '🥉', pill: 'tier-bronze',    color: '#c2783e', text: '#fdba74', title: 'Little Treasure',   blurb: 'A small surprise for a few coins.',                  odds: 'Common items, small prizes, a few coins' },
    WOODEN:    { name: 'Silver Box',  icon: '🥈', pill: 'tier-wooden',    color: '#cbd5e1', text: '#e2e8f0', title: 'Silver Strongbox',  blurb: 'Good prizes: items, sounds, titles, free rewards.',  odds: 'Items, sounds, titles, free rewards or coins' },
    GILDED:    { name: 'Gold Box',    icon: '🥇', pill: 'tier-gilded',    color: '#eab308', text: '#fef08a', title: 'Golden Reliquary',  blurb: 'Better items and big coin wins.',                    odds: 'Rare and epic prizes, free rewards, big coins' },
    CELESTIAL: { name: 'Diamond Box', icon: '💎', pill: 'tier-celestial', color: '#22d3ee', text: '#cffafe', title: 'Diamond Vault',     blurb: 'The best prizes: epic and legendary, jackpots.',     odds: 'Epic and legendary prizes, free rewards, jackpots' }
  };
  /** Name, icon and colours of a box kind (works for old saved ids too). */
  root.boxTierInfo = function (tier) {
    var t = String(tier || '').toUpperCase(), alias = { SILVER: 'WOODEN', GOLD: 'GILDED', DIAMOND: 'CELESTIAL' };
    return BOX_INFO[alias[t] || t] || BOX_INFO.WOODEN;
  };
  var RARITY_COLOR = { common: '#64748b', rare: '#16a34a', epic: '#7c3aed', legendary: '#d97706', mythic: '#e11d48' };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid(p) { return p + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); }
  function notify(msg, type) { if (root.showNotification) root.showNotification(msg, type || 'success'); }
  function rerender() { if (root.renderCurrentView) root.renderCurrentView(); }

  // ---------------------------------------------------------------- data
  function data() {
    if (!store.state.classroomStore || typeof store.state.classroomStore !== 'object') store.state.classroomStore = {};
    var d = store.state.classroomStore;
    if (!d.wallets) d.wallets = {};
    if (!Array.isArray(d.requests)) d.requests = [];
    if (!Array.isArray(d.purchases)) d.purchases = [];
    if (!d.config) d.config = clone(DEFAULTS);
    var c = d.config;
    c.itemPrices = Object.assign({}, DEFAULTS.itemPrices, c.itemPrices || {});
    var hadBronze = !!(c.boxPrices && c.boxPrices.BRONZE);
    c.boxPrices = Object.assign({}, DEFAULTS.boxPrices, c.boxPrices || {});
    if (!hadBronze) c.boxPrices.BRONZE = Math.max(1, Math.round(c.boxPrices.WOODEN / 2));   // the cheapest box costs half a Silver Box
    if (!Array.isArray(c.privileges)) c.privileges = clone(DEFAULTS.privileges);
    if (!c.physicalPrizesV1) {
      var existingIds = c.privileges.map(function (p) { return p.id; });
      DEFAULTS.privileges.filter(function (p) { return p.coinsOnly && existingIds.indexOf(p.id) === -1; }).reverse().forEach(function (p) {
        c.privileges.unshift(clone(p));
      });
      c.privileges.forEach(function (p) {
        var def = DEFAULTS.privileges.filter(function (dp) { return dp.id === p.id; })[0];
        if (def && def.coinsOnly) { p.image = def.image; p.badge = def.badge; p.coinsOnly = true; }
      });
      c.physicalPrizesV1 = 1;
    }
    if (!c.physicalPrizesV2) {   // 10 Nov 2026: real prizes cheaper (a pupil earns about 6 coins a week); only prices still at the first defaults change
      var P2 = { 'p-cat-sticker': [120, 40], 'p-cat-pack': [280, 100], 'p-topper-mystery': [300, 120], 'p-topper-vip': [400, 160] };
      c.privileges.forEach(function (p) { var x = P2[p.id]; if (x && Number(p.price) === x[0]) p.price = x[1]; });
      c.physicalPrizesV2 = 1;
    }
    if (!c.coinsPerXp) c.coinsPerXp = DEFAULTS.coinsPerXp;
    if (!c.balanceV1) {   // 30 Oct 2026: boxes were cheaper than the coins inside them; the cheapest class rewards cost less than a hat
      var BOX = { BRONZE: 8, WOODEN: 15, GILDED: 30, CELESTIAL: 60 }, PRIV = { 'p-song': 15, 'p-seat': 15, 'p-sticker': 15, 'p-helper': 20, 'p-game': 20, 'p-dj': 30, 'p-hwpass': 40 };
      Object.keys(BOX).forEach(function (k) { c.boxPrices[k] = Math.max(Number(c.boxPrices[k]) || 0, BOX[k]); });
      c.privileges.forEach(function (pv) { if (PRIV[pv.id]) pv.price = Math.max(Number(pv.price) || 0, PRIV[pv.id]); });
      c.balanceV1 = 1; c.updatedAt = Date.now();
    }
    if (!c.balanceV2) {   // 1 Nov 2026: the ladder. Small wins come soon, big dreams stay far. One price for each tier, in both stores.
      c.itemPrices = Object.assign({}, DEFAULTS.itemPrices); c.balanceV2 = 1; c.updatedAt = Date.now();
    }
    if (!c.itemPrices.mythic) c.itemPrices.mythic = DEFAULTS.itemPrices.mythic;
    if (!c.priceV3) {   // 12 Nov 2026: pupils get about 20 coins a week (8 from the teacher, 12 from XP). Everyday = 1 week, Cool = 2, Epic = 4, Legendary = 7, Mythic = 12.
      c.itemPrices = { common: 20, rare: 40, epic: 80, legendary: 150, mythic: 250 };
      c.priceV3 = 1; c.updatedAt = Date.now();
    }
    if (!c.boardGoals || typeof c.boardGoals !== 'object') c.boardGoals = {};
    if (!c.partyFunds || typeof c.partyFunds !== 'object') c.partyFunds = {};
    if (!c.off || typeof c.off !== 'object') c.off = {};
    ['tabs', 'cats', 'boxes'].forEach(function (k) { if (!c.off[k] || typeof c.off[k] !== 'object') c.off[k] = {}; });
    if (!d.cosmetics || typeof d.cosmetics !== 'object') d.cosmetics = {};
    if (!d.worksheets || typeof d.worksheets !== 'object') d.worksheets = {};
    return d;
  }
  // Giving coins to a whole class calls save() once per pupil. Each save writes all the platform's data, so the calls are joined into one.
  var saveTimer = 0;
  function flushSave() { saveTimer = 0; store.saveState(); store.notify(); schedulePush(); }
  function save() { if (!saveTimer) saveTimer = setTimeout(flushSave, 40); }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', function () { if (saveTimer) { clearTimeout(saveTimer); flushSave(); } });

  function wallet(studentId) {
    var d = data();
    var w = d.wallets[studentId];
    if (!w) { w = d.wallets[studentId] = { earnedHigh: 0, grants: 0, spent: 0, ledger: [] }; }
    var xp = (store.getStudentTotalXP ? store.getStudentTotalXP(studentId) : 0) || 0;
    var earned = Math.floor(xp / d.config.coinsPerXp);
    if (earned > w.earnedHigh) w.earnedHigh = earned;        // back-pay and growth: the high-water mark only goes up
    return w;
  }
  function balance(studentId) { var w = wallet(studentId); return Math.max(0, w.earnedHigh + w.grants - w.spent); }
  function log(w, delta, type, reason, ref) {
    w.ledger.unshift({ id: uid('l'), ts: new Date().toISOString(), delta: delta, type: type, reason: reason, ref: ref || null });
    if (w.ledger.length > 200) w.ledger.length = 200;
  }

  function grant(studentId, amount, reason) {
    amount = Math.round(Number(amount) || 0);
    if (!amount) return { success: false, error: 'Enter a number of coins' };
    var w = wallet(studentId), bal = balance(studentId);
    if (amount < 0 && -amount > bal) amount = -bal;          // never below zero
    if (!amount) return { success: false, error: 'This student has no coins to take' };
    w.grants += amount;
    log(w, amount, amount > 0 ? 'grant' : 'take', reason || (amount > 0 ? 'Teacher gave coins' : 'Teacher took coins'));
    save();
    return { success: true, amount: amount, balance: balance(studentId) };
  }
  function spend(studentId, amount, type, reason, ref) {
    var w = wallet(studentId);
    w.spent += amount;
    log(w, -amount, type, reason, ref);
  }
  function refund(studentId, amount, reason, ref) {
    var w = wallet(studentId);
    w.spent = Math.max(0, w.spent - amount);
    log(w, amount, 'refund', reason, ref);
  }

  // ---------------------------------------------------------------- items
  function allItems() { var a = store.getMonsterItems ? store.getMonsterItems(null, false) : []; return Array.isArray(a) ? a : []; }
  function findItem(id) { return allItems().filter(function (i) { return i.id === id; })[0] || null; }
  function levelOf(studentId) { var m = store.calculateMonsterState ? store.calculateMonsterState(studentId) : null; return (m && m.currentLevel) || 1; }
  function reqLevel(item) { return (item.unlockRequirement && item.unlockRequirement.level) || item.unlockLevel || 1; }
  var RARITY_LEVEL = { common: 1, rare: 3, epic: 4, legendary: 5, mythic: 6 };
  function isLevelReward(item) { return !item.unlockType || item.unlockType === 'level'; }   // free when the pupil reaches the level
  function shopLevel(item) { if (item && item.shopLevel) return item.shopLevel; return isLevelReward(item) ? reqLevel(item) : Math.max(reqLevel(item), RARITY_LEVEL[item.rarity] || 1); }
  function isOwned(studentId, item) {
    var inv = store.getStudentInventory ? store.getStudentInventory(studentId) : [];
    if (inv.some(function (e) { return e.itemId === item.id; })) return true;
    var p = store.getMonsterProfile ? store.getMonsterProfile(studentId) : null;
    return !!(p && p.unlockedItems && p.unlockedItems.indexOf(item.id) !== -1);
  }
  function isAvailable(studentId, item) {
    if (isOwned(studentId, item)) return true;
    if (item.unlockType === 'default') return true;
    if (!item.unlockType || item.unlockType === 'level') return levelOf(studentId) >= reqLevel(item);
    return false;
  }
  function itemPrice(item) {
    return data().config.itemPrices[item.rarity] || data().config.itemPrices.common;
  }
  /* Halloween things are sold (and found in boxes) only from 1 October to 7 November; pupils keep the ones they have all year */
  var SEASON_HALLOWEEN = /^(pet-hal-|cs-(witch|vamp|mummy|ghost-aura|pumpkin|skeleton|spider))/;
  function inSeason(item) {
    if (!item || !SEASON_HALLOWEEN.test(String(item.id))) return true;
    var d = new Date(), m = d.getMonth();
    return m === 9 || (m === 10 && d.getDate() <= 7);
  }
  var RETIRED_ITEMS = ['cs-gat', 'cs-hanbok', 'cs-lantern'];   // the Chuseok set: no longer sold, pupils who own them keep them
  function canSell(item) {
    if (RETIRED_ITEMS.indexOf(item && item.id) !== -1 || (item && item.notForSale)) return false;
    if (!inSeason(item)) return false;
    if (SELL_CATEGORIES.indexOf(item.category) === -1) return false;
    var D = root.MonsterDressUp;
    if (['hat', 'glasses', 'accessory', 'backpack', 'clothing'].indexOf(item.category) !== -1) return root.EAA_ILLUSTRATED_MONSTERS === true ? !!(D && D.supportedItem(item.id)) : true;
    return true;
  }
  /** Items the student cannot use yet, which they can buy now. */
  function isOff(kind, key) { var o = data().config.off; return !!(o && o[kind] && o[kind][key]); }
  function shopItems(studentId) {
    return allItems().filter(function (i) { return canSell(i) && !isOff('cats', i.category) && !isAvailable(studentId, i); })
      .map(function (i) { return { item: i, price: itemPrice(i), level: shopLevel(i) }; })
      .sort(function (a, b) { return a.price - b.price || a.item.name.localeCompare(b.item.name); });
  }

  function buyItem(studentId, itemId) {
    var item = findItem(itemId);
    if (!item) return { success: false, error: 'Item not found' };
    if (isAvailable(studentId, item)) return { success: false, error: 'You already have this item' };
    if (isOff('tabs', 'items') || isOff('cats', item.category)) return { success: false, error: 'Your teacher has closed this part of the shop for now' };
    if (levelOf(studentId) < shopLevel(item)) return { success: false, error: (isLevelReward(item) ? 'This is free at level ' : 'This opens at level ') + shopLevel(item) + '. Keep earning XP!' };
    var price = itemPrice(item);
    if (balance(studentId) < price) return { success: false, error: 'Not enough coins (need ' + price + ')' };
    var inv = store.getStudentInventory(studentId);
    var pid = uid('buy');
    inv.push({
      id: uid('inv'), studentId: studentId, itemId: item.id, name: item.name, category: item.category, rarity: item.rarity,
      icon: item.icon, isEquipped: false, quantity: 1, acquiredAt: new Date().toISOString(), source: 'store', purchaseId: pid
    });
    var prof = store.getMonsterProfile(studentId);
    if (prof) {
      if (!prof.unlockedItems) prof.unlockedItems = [];
      if (prof.unlockedItems.indexOf(item.id) === -1) prof.unlockedItems.push(item.id);
      store.updateMonsterProfile(studentId, { unlockedItems: prof.unlockedItems });
    }
    spend(studentId, price, 'buy-item', 'Bought ' + item.name, pid);
    data().purchases.unshift({ id: pid, studentId: studentId, kind: 'item', refId: item.id, name: item.name, icon: item.icon, price: price, ts: new Date().toISOString(), status: 'done' });
    save();
    return { success: true, item: item, price: price, balance: balance(studentId) };
  }

  function buyBox(studentId, tier) {
    tier = String(tier).toUpperCase();
    var price = data().config.boxPrices[tier];
    if (!price || !BOX_INFO[tier]) return { success: false, error: 'Unknown box' };
    if (isOff('tabs', 'boxes') || isOff('boxes', tier)) return { success: false, error: 'Your teacher has closed this box for now' };
    if (balance(studentId) < price) return { success: false, error: 'Not enough coins (need ' + price + ')' };
    var box = store.grantMysteryBox(studentId, tier);
    var pid = uid('buy');
    spend(studentId, price, 'buy-box', 'Bought a ' + BOX_INFO[tier].name, pid);
    data().purchases.unshift({ id: pid, studentId: studentId, kind: 'box', refId: box.id, name: BOX_INFO[tier].name, icon: BOX_INFO[tier].icon, price: price, ts: new Date().toISOString(), status: 'done' });
    save();
    return { success: true, box: box, price: price, balance: balance(studentId) };
  }

  // ---------------------------------------------------------------- privileges
  function weekStart(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); var day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); return x.getTime(); }
  function usedThisWeek(studentId, privId) {
    var ws = weekStart(new Date());
    return data().requests.filter(function (r) { return r.studentId === studentId && r.privilegeId === privId && r.status !== 'declined' && new Date(r.createdAt).getTime() >= ws; }).length;
  }
  function privilege(id) { return data().config.privileges.filter(function (p) { return p.id === id; })[0] || null; }
  function requestPrivilege(studentId, privId) {
    var p = privilege(privId);
    if (!p || !p.active) return { success: false, error: 'This reward is not available' };
    if (isOff('tabs', 'rewards')) return { success: false, error: 'Class rewards are closed for now' };
    if (p.weeklyLimit && usedThisWeek(studentId, privId) >= p.weeklyLimit) return { success: false, error: 'You already used this reward ' + p.weeklyLimit + ' time(s) this week' };
    if (balance(studentId) < p.price) return { success: false, error: 'Not enough coins (need ' + p.price + ')' };
    var rid = uid('req');
    data().requests.unshift({ id: rid, studentId: studentId, privilegeId: p.id, name: p.name, icon: p.icon, price: p.price, status: 'pending', createdAt: new Date().toISOString(), decidedAt: null, note: '' });
    spend(studentId, p.price, 'reward', 'Requested: ' + p.name, rid);
    save();
    return { success: true, request: data().requests[0], balance: balance(studentId) };
  }
  function decide(requestId, status, note) {
    var r = data().requests.filter(function (x) { return x.id === requestId; })[0];
    if (!r) return { success: false, error: 'Request not found' };
    if (r.status !== 'pending' && !(status === 'used' && r.status === 'approved')) return { success: false, error: 'Already decided' };
    if (status === 'declined') refund(r.studentId, r.price, 'Declined: ' + r.name + (note ? ' (' + note + ')' : ''), r.id);
    r.status = status; r.decidedAt = new Date().toISOString(); if (note) r.note = note;
    save();
    return { success: true, request: r };
  }

  function undoPurchase(purchaseId) {
    var p = data().purchases.filter(function (x) { return x.id === purchaseId; })[0];
    if (!p || p.status !== 'done') return { success: false, error: 'Purchase not found' };
    if (p.kind === 'box') {
      var boxes = store.state.mysteryBoxes || [];
      var bi = boxes.findIndex ? boxes.findIndex(function (b) { return b.id === p.refId; }) : -1;
      if (bi === -1 || boxes[bi].isOpened) return { success: false, error: 'This box was already opened, so it cannot be refunded' };
      boxes.splice(bi, 1);
    } else if (p.kind === 'avatar') {
      var al = avOwnedList(p.studentId), ai = al.indexOf(p.refId);
      if (ai !== -1) al.splice(ai, 1);
      touchCos(p.studentId);
      try {
        var PAu = PA(), wearing = PAu && PAu.wearingOf ? PAu.wearingOf(p.studentId) : {}, inf = PAu && PAu.itemInfo ? PAu.itemInfo(p.refId) : null;
        if (inf && wearing[inf.slot] === p.refId) PAu.wearItem(p.studentId, null, inf.slot);
      } catch (eU) { /* the avatar can be changed by hand */ }
    } else if (p.kind === 'extra') {
      var ce = cosEntry(p.studentId), xi = ce.owned.indexOf(p.refId);
      if (xi !== -1) ce.owned.splice(xi, 1);
      Object.keys(ce.equipped).forEach(function (k) { if (ce.equipped[k] === p.refId) delete ce.equipped[k]; });
      touchCos(p.studentId);
    } else {
      var inv = store.getStudentInventory(p.studentId);
      var ii = inv.findIndex(function (e) { return e.purchaseId === p.id; });
      if (ii !== -1) inv.splice(ii, 1);
      var prof = store.getMonsterProfile(p.studentId);
      if (prof) {
        var eq = {};
        if (prof.equipped) Object.keys(prof.equipped).forEach(function (k) { if (prof.equipped[k] === p.refId) eq[k] = 'none'; });
        store.updateMonsterProfile(p.studentId, { unlockedItems: (prof.unlockedItems || []).filter(function (id) { return id !== p.refId; }), equipped: eq });
      }
    }
    refund(p.studentId, p.price, 'Refund: ' + p.name, p.id);
    p.status = 'refunded';
    save();
    return { success: true };
  }


  // ---------------------------------------------------------------- extras: sounds, titles, animals, name plates
  function CCo() { return root.ClassroomCosmetics || null; }
  function cosEntry(studentId) {
    var d = data(), e = d.cosmetics[studentId];
    if (!e) e = d.cosmetics[studentId] = { owned: [], equipped: {}, updatedAt: 0 };
    if (!Array.isArray(e.owned)) e.owned = [];
    if (!e.equipped || typeof e.equipped !== 'object') e.equipped = {};
    return e;
  }
  function ownedMonsterIds(studentId) {
    var inv = store.getStudentInventory ? store.getStudentInventory(studentId) : [];
    var ids = inv.map(function (e) { return e.itemId; });
    var p = store.getMonsterProfile ? store.getMonsterProfile(studentId) : null;
    if (p && p.unlockedItems) ids = ids.concat(p.unlockedItems);
    return ids;
  }
  function setTitleFor(k) {
    var M = root.MonsterCostumes; if (!M || !M.sets[k]) return null;
    var st = M.sets[k];
    return { kind: 'title', id: 'set-' + k, name: st.title, icon: st.icon, rarity: 'epic', desc: 'You finished the ' + st.name + ' costume set!', fromSet: k };
  }
  function setTitleItems(studentId) {
    var M = root.MonsterCostumes; if (!M) return [];
    return M.completedSets(ownedMonsterIds(studentId)).map(setTitleFor).filter(Boolean);
  }
  function findExtra(id) {
    id = String(id);
    if (id.indexOf('set-') === 0) return setTitleFor(id.slice(4));
    var C = CCo(); return C ? C.byId(id) : null;
  }
  function extraOwned(studentId, id) {
    if (String(id).indexOf('set-') === 0) return setTitleItems(studentId).some(function (t) { return t.id === id; });
    return cosEntry(studentId).owned.indexOf(id) !== -1;
  }
  function extraPrice(x) { return data().config.itemPrices[x.rarity] || data().config.itemPrices.common; }
  function touchCos(studentId) { cosEntry(studentId).updatedAt = Date.now(); }
  function buyExtra(studentId, id) {
    var x = findExtra(id);
    if (!x || String(id).indexOf('set-') === 0) return { success: false, error: 'This is not for sale' };
    if (extraOwned(studentId, id)) return { success: false, error: 'You already have this' };
    if (isOff('tabs', 'extras')) return { success: false, error: 'Your teacher has closed this part of the shop for now' };
    var price = extraPrice(x);
    if (balance(studentId) < price) return { success: false, error: 'Not enough coins (need ' + price + ')' };
    var e = cosEntry(studentId), pid = uid('buy');
    e.owned.push(id);
    if (!e.equipped[x.kind]) e.equipped[x.kind] = id;               // wear the first one right away
    touchCos(studentId);
    spend(studentId, price, 'buy-extra', 'Bought ' + x.name, pid);
    data().purchases.unshift({ id: pid, studentId: studentId, kind: 'extra', refId: id, name: x.name, icon: x.icon, price: price, ts: new Date().toISOString(), status: 'done' });
    save();
    return { success: true, item: x, price: price, balance: balance(studentId) };
  }
  function giveExtra(studentId, id) {                              // prizes: no price
    var x = findExtra(id); if (!x) return false;
    var e = cosEntry(studentId);
    if (e.owned.indexOf(id) === -1) e.owned.push(id);
    if (!e.equipped[x.kind]) e.equipped[x.kind] = id;
    touchCos(studentId);
    return true;
  }
  function equipExtra(studentId, kind, id) {
    var e = cosEntry(studentId);
    if (!id) { delete e.equipped[kind]; touchCos(studentId); save(); return { success: true }; }
    var x = findExtra(id);
    if (!x || x.kind !== kind) return { success: false, error: 'Not found' };
    if (!extraOwned(studentId, id)) return { success: false, error: 'You do not own this yet' };
    e.equipped[kind] = id; touchCos(studentId); save();
    return { success: true, item: x };
  }
  /** What the student is wearing: { sound, title, pack, plate } (missing ones are left out). */
  function equippedExtras(studentId) {
    var e = cosEntry(studentId), out = {};
    ['sound', 'title', 'pack', 'plate'].forEach(function (k) {
      var id = e.equipped[k], x = id ? findExtra(id) : null;
      if (x && extraOwned(studentId, id)) out[k] = x;
    });
    return out;
  }

  // ---------------------------------------------------------------- avatar items (11 Nov 2026: the shop sells avatar clothes, not monster items)
  // Bought and won avatar items are kept in the pupil's cosmetics entry (cosmetics[id].avatar), which the cloud bundle already saves.
  function PA() { return root.PupilAvatars || null; }
  function monstersHidden() { return root.EAA_HIDE_MONSTERS !== false; }
  function avOwnedList(studentId) { var e = cosEntry(studentId); if (!Array.isArray(e.avatar)) e.avatar = []; return e.avatar; }
  function avOwns(studentId, id) { var e = data().cosmetics[studentId]; return !!(e && Array.isArray(e.avatar) && e.avatar.indexOf(id) !== -1); }
  function avItems(studentId) {
    var P = PA(); if (!P || !P.storeItemIds) return [];
    return P.storeItemIds(studentId).map(function (id) { return P.itemInfo(id); }).filter(function (x) { return x && !isOff('cats', 'av-' + x.slot); });
  }
  /* 'have' = the pupil can wear it already (bought, won, free starter or already on their avatar); 'level' = free at their level */
  function avState(studentId, id) {
    var P = PA(), x = P && P.itemInfo ? P.itemInfo(id) : null;
    if (!x) return 'none';
    if (x.free || avOwns(studentId, id)) return 'have';
    try { if (P.owns && P.owns(studentId, id)) return 'have'; } catch (e) { /* ignore */ }
    try { var lk = P.lockFor ? P.lockFor(studentId, id) : null; if (lk && !lk.locked) return 'level'; } catch (e2) { /* ignore */ }
    return 'shop';
  }
  function avPrice(x) { return data().config.itemPrices[x.rarity] || data().config.itemPrices.common; }
  function buyAvatar(studentId, id) {
    var P = PA(), x = P && P.itemInfo ? P.itemInfo(id) : null;
    if (!x) return { success: false, error: 'Item not found' };
    if (avState(studentId, id) !== 'shop') return { success: false, error: 'You can already wear this' };
    if (isOff('tabs', 'avatar') || isOff('cats', 'av-' + x.slot)) return { success: false, error: 'Your teacher has closed this part of the shop for now' };
    var price = avPrice(x);
    if (balance(studentId) < price) return { success: false, error: 'Not enough coins (need ' + price + ')' };
    var pid = uid('buy');
    avOwnedList(studentId).push(id); touchCos(studentId);
    spend(studentId, price, 'buy-avatar', 'Bought ' + x.name, pid);
    data().purchases.unshift({ id: pid, studentId: studentId, kind: 'avatar', refId: id, name: x.name, icon: '👕', price: price, ts: new Date().toISOString(), status: 'done' });
    save();
    return { success: true, item: x, price: price, balance: balance(studentId) };
  }
  function rewardAvatar(studentId, rarity) {
    var all = avItems().filter(function (x) { return !x.free && avState(studentId, x.id) === 'shop' && x.rarity !== 'mythic'; });
    var pool = all.filter(function (x) { return x.rarity === rarity; });
    if (!pool.length) pool = all;
    if (!pool.length) return null;
    var x = pickOne(pool);
    avOwnedList(studentId).push(x.id); touchCos(studentId);
    return { type: 'item', item: { id: x.id, name: x.name, category: 'avatar ' + x.slot, rarity: x.rarity, icon: '👕', image: x.pic, avatar: true, description: 'A new avatar item! It is yours to wear.' } };
  }

  // ---------------------------------------------------------------- class party fund
  function classOfStudent(studentId) { var st = store.getStudent ? store.getStudent(studentId) : null; return st ? (st.classId || null) : null; }
  function fundFor(classId) { return classId ? (data().config.partyFunds[classId] || null) : null; }
  function setFund(classId, name, goal) {
    goal = Math.max(1, Math.round(Number(goal) || 0));
    if (!classId) return { success: false, error: 'Choose a class first' };
    var f = data().config.partyFunds[classId];
    if (!f) f = data().config.partyFunds[classId] = { name: '', goal: 0, raised: 0, donors: {} };
    f.name = String(name || 'Class party').slice(0, 40); f.goal = goal;
    data().config.updatedAt = Date.now(); save();
    return { success: true, fund: f };
  }
  function donate(studentId, amount) {
    var f = fundFor(classOfStudent(studentId));
    amount = Math.round(Number(amount) || 0);
    if (!f || !f.goal) return { success: false, error: 'There is no party fund yet' };
    if (isOff('tabs', 'party')) return { success: false, error: 'The party fund is closed for now' };
    if (f.raised >= f.goal) return { success: false, error: 'The fund is already full!' };
    amount = Math.min(amount, f.goal - f.raised);
    if (amount < 1) return { success: false, error: 'Choose how many coins' };
    if (balance(studentId) < amount) return { success: false, error: 'Not enough coins' };
    spend(studentId, amount, 'donate', 'Gave to the ' + f.name);
    f.raised += amount; f.donors[studentId] = (f.donors[studentId] || 0) + amount;
    data().config.updatedAt = Date.now(); save();
    return { success: true, fund: f, full: f.raised >= f.goal, amount: amount, balance: balance(studentId) };
  }
  function resetFund(classId) {
    var f = fundFor(classId); if (!f) return;
    f.raised = 0; f.donors = {}; data().config.updatedAt = Date.now(); save();
  }

  // ---------------------------------------------------------------- mystery boxes 2.0
  // Each box can hold a monster item, a sound / title / animal / name plate, a free class reward, coins, or a rare jackpot.
  // It never gives something the student already has (that would be a wasted box).
  var BOX_ODDS = {
    BRONZE:    [['item', 55], ['extra', 14], ['voucher', 7],  ['coins', 19], ['jackpot', 5]],
    WOODEN:    [['item', 60], ['extra', 15], ['voucher', 10], ['coins', 10], ['jackpot', 5]],
    GILDED:    [['item', 55], ['extra', 20], ['voucher', 12], ['coins', 8],  ['jackpot', 5]],
    CELESTIAL: [['item', 50], ['extra', 20], ['voucher', 15], ['coins', 10], ['jackpot', 5]]
  };
  var BOX_RARITY = { BRONZE: [['common', 85], ['rare', 15]], WOODEN: [['common', 70], ['rare', 30]], GILDED: [['rare', 65], ['epic', 35]], CELESTIAL: [['epic', 60], ['legendary', 40]] };
  var BOX_COINS = { BRONZE: [8, 20], WOODEN: [20, 40], GILDED: [50, 100], CELESTIAL: [120, 250] };
  var BOX_VOUCHER_CAP = { BRONZE: 40, WOODEN: 70, GILDED: 100, CELESTIAL: 100000 };
  function rollTable(t) { var r = Math.random() * 100, a = 0; for (var i = 0; i < t.length; i++) { a += t[i][1]; if (r < a) return t[i][0]; } return t[t.length - 1][0]; }
  function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
  function grantMonsterItem(studentId, item) {
    var inv = store.getStudentInventory(studentId);
    inv.push({ id: uid('inv'), studentId: studentId, itemId: item.id, name: item.name, category: item.category, rarity: item.rarity, icon: item.icon, isEquipped: false, quantity: 1, acquiredAt: new Date().toISOString(), source: 'mystery-box' });
    var prof = store.getMonsterProfile(studentId);
    if (prof) {
      if (!prof.unlockedItems) prof.unlockedItems = [];
      if (prof.unlockedItems.indexOf(item.id) === -1) prof.unlockedItems.push(item.id);
      store.updateMonsterProfile(studentId, { unlockedItems: prof.unlockedItems });
    }
  }
  function rewardItem(studentId, rarity) {
    if (monstersHidden() && PA()) return rewardAvatar(studentId, rarity);
    var all = allItems().filter(function (i) { return canSell(i) && !isAvailable(studentId, i) && i.category !== 'creature' && i.rarity !== 'mythic'; });   // creatures and Mythic items are bought with coins, never found in a box
    var pool = all.filter(function (i) { return i.rarity === rarity; });
    if (!pool.length) pool = all;
    if (!pool.length) return null;
    var it = pickOne(pool);
    grantMonsterItem(studentId, it);
    return { type: 'item', item: { id: it.id, name: it.name, category: it.category, rarity: it.rarity, icon: it.icon || '✨', description: it.description || '' } };
  }
  function rewardExtra(studentId, rarity) {
    var C = CCo(); if (!C) return null;
    var all = C.CATALOG.filter(function (x) { return !extraOwned(studentId, x.id); });
    var pool = all.filter(function (x) { return x.rarity === rarity; });
    if (!pool.length) pool = all;
    if (!pool.length) return null;
    var x = pickOne(pool);
    giveExtra(studentId, x.id);
    return { type: 'extra', kind: x.kind, item: { id: x.id, name: x.name, category: C.KINDS[x.kind].one, rarity: x.rarity, icon: x.icon, description: x.desc } };
  }
  function rewardVoucher(studentId, tier) {
    var cap = Math.min(BOX_VOUCHER_CAP[tier] || 70, (Number(data().config.boxPrices[tier]) || 10) * 3);   // a free reward is worth at most 3 boxes
    var pool = data().config.privileges.filter(function (p) { return p.active && p.price <= cap; });
    if (!pool.length) return null;
    var p = pickOne(pool), rid = uid('req'), now = new Date().toISOString();
    data().requests.unshift({ id: rid, studentId: studentId, privilegeId: p.id, name: 'FREE: ' + p.name, icon: p.icon, price: 0, status: 'approved', createdAt: now, decidedAt: now, note: 'Won in a Mystery Box', voucher: true });
    return { type: 'voucher', item: { id: 'voucher', name: 'Free: ' + p.name, category: 'free reward', rarity: tier === 'WOODEN' ? 'rare' : 'epic', icon: p.icon, description: 'Show your teacher. This one is free!' } };
  }
  function boxCoins(tier) { var pr = Number(data().config.boxPrices[tier]) || 10; return [Math.max(2, Math.round(pr * 0.4)), Math.max(3, Math.round(pr * 0.9))]; }
  function jackpotCoins(tier) { return Math.max(10, (Number(data().config.boxPrices[tier]) || 10) * 3); }
  function rewardCoins(studentId, tier, fixed) {
    var r = boxCoins(tier);
    var n = fixed || (r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1)));
    var w = wallet(studentId);
    w.grants += n; log(w, n, 'box', 'Mystery box coins');
    return { type: 'coins', amount: n, item: { id: 'coins', name: '+' + n + ' coins!', category: 'coins', rarity: 'rare', icon: '🪙', description: 'The box was full of coins!' } };
  }
  function openBox2(boxId, studentId) {
    if (store._ensureMysteryBoxState) store._ensureMysteryBoxState();
    var box = (store.state.mysteryBoxes || []).filter(function (b) { return b.id === boxId; })[0];
    if (!box) return { success: false, error: 'Mystery box not found' };
    if (box.studentId !== studentId) return { success: false, error: 'This box belongs to another student' };
    if (box.isOpened) return { success: false, error: 'This mystery box is already opened' };
    var tier = BOX_ODDS[box.boxTier] ? box.boxTier : 'WOODEN';
    var kind = rollTable(BOX_ODDS[tier]), rarity = rollTable(BOX_RARITY[tier]), res = null;
    if (kind === 'item') res = rewardItem(studentId, rarity) || rewardExtra(studentId, rarity);
    else if (kind === 'extra') res = rewardExtra(studentId, rarity) || rewardItem(studentId, rarity);
    else if (kind === 'voucher') res = rewardVoucher(studentId, tier);
    else if (kind === 'coins') res = rewardCoins(studentId, tier);
    else res = rewardItem(studentId, 'legendary') || rewardExtra(studentId, 'legendary') || rewardCoins(studentId, tier, jackpotCoins(tier));
    if (!res) res = rewardCoins(studentId, tier);
    box.isOpened = true; box.openedAt = new Date().toISOString();
    save();
    return { success: true, boxId: box.id, boxTier: box.boxTier, item: res.item, isDuplicate: false, bonusXp: 0, bonusCoins: res.type === 'coins' ? res.amount : 0,
      reward: { type: res.type, kind: res.kind || null, amount: res.amount || 0, rolled: kind }, openedAt: box.openedAt };
  }


  // ---------------------------------------------------------------- cloud save
  // One hidden row in the classes table (grade "System", archived), same pattern the cloud library already uses.
  // It holds a small bundle per student: coins, purchases, requests, boxes and items. Newest copy of each student wins.
  var CLOUD_ID = 'class-classroom-store-sync';
  var cloudState = 'local';            // local | saving | saved | error
  var cloudAt = 0, pushTimer = null, pulling = false, lastPull = 0;

  function cloudClient() {
    var A = root.AdventureSupabase;
    if (!A || !A.isConfigured) return null;
    try { return A.client || (A._ensureClient && A._ensureClient()) || null; } catch (e) { return null; }
  }
  function stampOf(id) {
    var d = data(), t = 0;
    function up(x) { var v = x ? new Date(x).getTime() : 0; if (v > t) t = v; }
    var w = d.wallets[id];
    if (w) (w.ledger || []).forEach(function (l) { up(l.ts); });
    d.requests.forEach(function (r) { if (r.studentId === id) { up(r.createdAt); up(r.decidedAt); } });
    d.purchases.forEach(function (p) { if (p.studentId === id) up(p.ts); });
    // the platform re-creates 3 starter boxes (ids ending -wood-1, -gilded-1, -celestial-1) on every fresh device: they say nothing about what the student did
    (store.state.mysteryBoxes || []).forEach(function (b) { if (b.studentId === id) { if (!/-(wood|gilded|celestial)-1$/.test(String(b.id))) up(b.createdAt); up(b.openedAt); } });
    ((store.state.studentInventories || {})[id] || []).forEach(function (e) { up(e.acquiredAt); });
    if (d.cosmetics && d.cosmetics[id] && d.cosmetics[id].updatedAt) up(d.cosmetics[id].updatedAt);
    return t;
  }
  function bundleFor(id) {
    var d = data(), w = d.wallets[id];
    if (!w) return null;
    var boxes = (store.state.mysteryBoxes || []).filter(function (b) { return b.studentId === id; });
    return {
      v: 1, updatedAt: stampOf(id),
      wallet: { earnedHigh: w.earnedHigh, grants: w.grants, spent: w.spent, ledger: (w.ledger || []).slice(0, 20) },
      requests: d.requests.filter(function (r) { return r.studentId === id; }).slice(0, 40),
      purchases: d.purchases.filter(function (p) { return p.studentId === id; }).slice(0, 40),
      boxes: boxes.filter(function (b) { return !b.isOpened; }).concat(boxes.filter(function (b) { return b.isOpened; }).slice(-10)),
      inventory: ((store.state.studentInventories || {})[id] || []).slice(0, 150),
      cosmetics: (d.cosmetics && d.cosmetics[id]) ? JSON.parse(JSON.stringify(d.cosmetics[id])) : null
    };
  }
  function adoptBundle(id, b) {
    var d = data();
    if (store._ensureMysteryBoxState) store._ensureMysteryBoxState();
    d.wallets[id] = { earnedHigh: b.wallet.earnedHigh || 0, grants: b.wallet.grants || 0, spent: b.wallet.spent || 0, ledger: (b.wallet.ledger || []).slice() };
    d.requests = d.requests.filter(function (r) { return r.studentId !== id; }).concat(b.requests || []).sort(function (a, c) { return String(c.createdAt).localeCompare(String(a.createdAt)); });
    d.purchases = d.purchases.filter(function (p) { return p.studentId !== id; }).concat(b.purchases || []).sort(function (a, c) { return String(c.ts).localeCompare(String(a.ts)); });
    store.state.mysteryBoxes = (store.state.mysteryBoxes || []).filter(function (x) { return x.studentId !== id; }).concat(b.boxes || []);
    if (!store.state.studentInventories) store.state.studentInventories = {};
    store.state.studentInventories[id] = (b.inventory || []).slice();
    if (b.cosmetics) d.cosmetics[id] = b.cosmetics;
  }
  /** Take the cloud copy of any student that is newer than ours. Returns true when something changed. */
  function adoptDoc(doc) {
    if (!doc || typeof doc !== 'object') return false;
    var changed = false, d = data();
    Object.keys(doc.students || {}).forEach(function (id) {
      var b = doc.students[id];
      if (!b || !b.wallet) return;
      if ((b.updatedAt || 0) > stampOf(id) || !d.wallets[id]) { adoptBundle(id, b); changed = true; }
    });
    if (doc.cfg) { if ((doc.cfgAt || 0) > (d.config.updatedAt || 0)) { d.config = doc.cfg; d.config.updatedAt = doc.cfgAt; data(); changed = true; } else if (Array.isArray(doc.cfg.calendar)) { d.config.calendar = d.config.calendar || []; var have = {}; d.config.calendar.forEach(function (ev) { if (ev && ev.id) have[ev.id] = 1; }); doc.cfg.calendar.forEach(function (ev) { if (ev && ev.id && /^ev-/.test(ev.id) && !have[ev.id]) { d.config.calendar.push(ev); changed = true; } }); } } try { if (root.CalendarView && root.CalendarView.ensureSeeded) root.CalendarView.ensureSeeded(); } catch (e) { /* ignore */ }
    return changed;
  }
  function parseRow(row) { try { return row && row.description ? JSON.parse(row.description) : null; } catch (e) { return null; } }

  // 12 Nov 2026: monsters are hidden. Shop items that have no avatar version (the Sky Dragon creature) are refunded once.
  // Runs on the teacher's signed-in device right after the cloud copy is read, so it works on the newest data;
  // the flag in the shared settings stops it from running twice. Coins go back with "Refund: <item>" in the pupil's history.
  function retiredItem(refId) {
    var P = PA();
    if (!P || !P.itemInfo) return false;
    if (String(refId).indexOf('set-') === 0) return false;
    return !P.itemInfo(refId);
  }
  function refundRetired() {
    var d = data();
    if (d.config.refundRetiredV1 || !monstersHidden() || !PA() || !PA().itemInfo) return 0;
    var n = 0;
    d.purchases.slice().forEach(function (p) {
      if (p.kind !== 'item' || p.status !== 'done' || !retiredItem(p.refId)) return;
      var r = undoPurchase(p.id); if (r && r.success) n++;
    });
    d.config.refundRetiredV1 = 1; d.config.refundRetiredCount = n; d.config.updatedAt = Date.now();
    save();
    return n;
  }
  async function cloudPull() {
    var client = cloudClient();
    if (!client || pulling) return false;
    pulling = true;
    try {
      var res = await client.from('classes').select('description').eq('id', CLOUD_ID).maybeSingle();
      lastPull = Date.now();
      if (res && res.error) throw res.error;
      var changed = adoptDoc(parseRow(res && res.data));
      if (changed) { store.saveState(); store.notify(); }
      try { if (refundRetired()) changed = true; } catch (eR) { /* try again next time */ }
      return changed;
    } catch (e) { cloudState = 'error'; return false; }
    finally { pulling = false; }
  }
  async function cloudPush() {
    var client = cloudClient();
    if (!client) { cloudState = 'local'; return false; }
    cloudState = 'saving';
    try {
      var res = await client.from('classes').select('description').eq('id', CLOUD_ID).maybeSingle();
      if (res && res.error) throw res.error;
      var remote = parseRow(res && res.data) || { v: 1, students: {}, cfg: null, cfgAt: 0 };
      if (!remote.students) remote.students = {};
      var d = data();
      Object.keys(d.wallets).forEach(function (id) {
        var lb = bundleFor(id), rb = remote.students[id];
        if (lb && (!rb || (lb.updatedAt || 0) >= (rb.updatedAt || 0))) remote.students[id] = lb;
      });
      if ((d.config.updatedAt || 0) >= (remote.cfgAt || 0)) { remote.cfg = d.config; remote.cfgAt = d.config.updatedAt || 0; }
      var up = await client.from('classes').upsert({ id: CLOUD_ID, name: 'Classroom Store Sync', grade: 'System', teacher: 'System', description: JSON.stringify(remote), archived: true, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (up && up.error) throw up.error;
      cloudState = 'saved'; cloudAt = Date.now();
      return true;
    } catch (e) { cloudState = 'error'; return false; }
  }
  function schedulePush() {
    if (!cloudClient()) { cloudState = 'local'; return; }
    cloudState = 'saving';
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushTimer = null; cloudPush().then(function () { if (root.__csRefreshStatus) root.__csRefreshStatus(); }); }, 1500);
  }
  function cloudLabel() {
    var map = { local: '💾 Saved on this device only', saving: '☁️ Saving to the cloud…', saved: '☁️ Saved to the cloud', error: '⚠️ Cloud save failed, kept on this device' };
    var k = cloudClient() ? cloudState : 'local';
    return k === 'local' ? '' : (map[k] || '');
  }
  // pull once the cloud connection is ready, and again whenever the window gets focus (at most once a minute)
  (function startCloud() {
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (cloudClient()) { clearInterval(t); cloudPull().then(function (c) { if (c && root.renderCurrentView) root.renderCurrentView(); }); }
      else if (tries > 40) clearInterval(t);
    }, 1500);
    if (root.addEventListener) root.addEventListener('focus', function () {
      if (cloudClient() && Date.now() - lastPull > 60000) cloudPull().then(function (c) { if (c && root.renderCurrentView) root.renderCurrentView(); });
    });
  })();
  // Mystery boxes 2.0: the platform's box opening now goes through openBox2 (see above); it saves and syncs by itself
  if (store.openMysteryBox && !store.openMysteryBox.__cs) {
    store.openMysteryBox = function (boxId, studentId) { return openBox2(boxId, studentId); };
    store.openMysteryBox.__cs = true;
  }

  // ---------------------------------------------------------------- UI (shared)
  var studentTab = (root.EAA_HIDE_MONSTERS !== false) ? 'avatar' : 'items', itemFilter = 'all';
  var studioMode = 'avatar'; // 'avatar' | 'prizes' | 'teacher'
  var avSlot = 'all', avOwnFilter = 'all', avEmotion = 'smile', avTryId = '', avPrevSid = '', avPrevTimer = 0;
  var avColorsOpen = false;
  var avTrimmed = {};   // wear pictures sit on a full body-sized canvas: crop them to the item for the shop cards
  function inClassMode() {
    try { return !!(root.ClassMode && root.ClassMode.on && root.ClassMode.on()); } catch (e) { return false; }
  }
  // ---- worksheet coins: one score (0 to 10) per pupil, given as coins once; pressing again only fixes the difference
  var wsDraft = {}, wsName = 'Revision worksheet';
  function wsId() { return String(wsName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'worksheet'; }
  function wsGiven(sid) { var w = data().worksheets[wsId()]; return w && w.scores && w.scores[sid] != null ? w.scores[sid] : null; }
  function wsRowHtml(sid) {
    var cur = wsDraft[sid] != null ? wsDraft[sid] : null, given = wsGiven(sid), out = '', n;
    for (n = 0; n <= 10; n++) {
      var on = cur === n;
      out += '<button type="button" class="cs-3d-mini' + (on ? ' on' : '') + '" onclick="ClassroomStore.ui.wsPick(\'' + sid + '\',' + n + ')">' + n + '</button>';
    }
    return out + (given != null ? ' <span style="font-size:.76rem;font-weight:800;color:#fde047;white-space:nowrap;">✓ ' + given + ' given</span>' : '');
  }
  // ---- clean-up of items nobody earned: the old automatic starter boxes, what came out of test openings, and test titles
  var TEST_TITLES = { 'student-3a-224': ['ttl-legend'] };     // added by a platform test on 5 Oct 2026
  var CLEAN_KEY = 'eaa_unearned_backup_v1';
  function isSeedBox(b) { return /^box-.+-(wood|gilded|celestial)-1$/.test(String(b.id)); }
  function findUnearned() {
    var d = data(), boxes = (store.state.mysteryBoxes || []), inv = store.state.studentInventories || {}, out = { boxes: [], items: [], titles: [], requests: [] };
    boxes.forEach(function (b) { if (isSeedBox(b) || TEST_TITLES[b.studentId]) out.boxes.push(b); });
    Object.keys(inv).forEach(function (id) { (inv[id] || []).forEach(function (e) { if (e.source === 'mystery-box' || (TEST_TITLES[id] && (e.source === 'mystery-box' || !e.source))) out.items.push({ studentId: id, entry: e }); }); });
    Object.keys(TEST_TITLES).forEach(function (id) { var ce = d.cosmetics && d.cosmetics[id]; if (ce) TEST_TITLES[id].forEach(function (t) { if ((ce.owned || []).indexOf(t) >= 0 || (ce.equipped && ce.equipped.title === t)) out.titles.push({ studentId: id, id: t }); }); });
    d.requests.forEach(function (r) { if (/^FREE:/.test(String(r.name || '')) && !Number(r.price)) out.requests.push(r); });
    // test openings: a box nobody bought, created and opened within a minute (the old "test unboxing" buttons did this)
    var bought = {}; d.purchases.forEach(function (pp) { if (pp.kind === 'box') bought[pp.refId] = 1; });
    out.coins = []; out.extras = [];
    boxes.forEach(function (b) {
      if (!b.isOpened || bought[b.id] || isSeedBox(b) || TEST_TITLES[b.studentId]) return;
      var made = new Date(b.createdAt || 0).getTime(), opened = new Date(b.openedAt || 0).getTime();
      if (!made || !opened || opened - made > 60000) return;
      out.boxes.push(b);
      var w = d.wallets[b.studentId];
      ((w && w.ledger) || []).forEach(function (l) { if (l.type === 'box' && Math.abs(new Date(l.ts).getTime() - opened) < 5000 && out.coins.indexOf(l) < 0) out.coins.push({ studentId: b.studentId, entry: l }); });
    });
    // titles, plates, sounds and animal packs a pupil owns without a purchase came out of a box: list them for pupils with test openings
    var testPupils = {}; out.boxes.forEach(function (b) { if (!isSeedBox(b) && !TEST_TITLES[b.studentId]) testPupils[b.studentId] = 1; });
    Object.keys(testPupils).forEach(function (id) {
      var ce = d.cosmetics && d.cosmetics[id]; if (!ce) return;
      var paid = {}; d.purchases.forEach(function (pp) { if (pp.studentId === id && pp.status !== 'refunded') paid[pp.refId] = 1; });
      (ce.owned || []).forEach(function (x) { if (!paid[x]) out.extras.push({ studentId: id, id: x }); });
    });
    out.orphans = [];
    (store.getStudents ? store.getStudents() : []).forEach(function (stu) {
      var prof = store.getMonsterProfile ? store.getMonsterProfile(stu.id) : null; if (!prof || !prof.unlockedItems) return;
      var have = {}; (inv[stu.id] || []).forEach(function (e) { have[e.itemId] = 1; });
      var removing = {}; out.items.forEach(function (x) { if (x.studentId === stu.id) removing[x.entry.itemId] = 1; });
      prof.unlockedItems.forEach(function (iid) { var it = findItem(iid); if (it && it.unlockType === 'store' && !have[iid] && !removing[iid]) out.orphans.push({ studentId: stu.id, id: iid, name: it.name }); });
    });
    out.total = out.boxes.length + out.items.length + out.titles.length + out.requests.length + out.coins.length + out.extras.length + out.orphans.length;
    out.pupils = {}; out.boxes.concat(out.requests).forEach(function (x) { out.pupils[x.studentId] = 1; }); out.items.concat(out.titles, out.coins, out.extras, out.orphans).forEach(function (x) { out.pupils[x.studentId] = 1; });
    return out;
  }
  function touchStudent(id) { var d = data(); if (!d.cosmetics[id]) d.cosmetics[id] = { owned: [], equipped: {}, updatedAt: 0 }; d.cosmetics[id].updatedAt = Date.now(); wallet(id); }
  function cleanUnearned() {
    var f = findUnearned(), d = data(); if (!f.total) return 0;
    var backup = { at: new Date().toISOString(), boxes: f.boxes, items: f.items, titles: f.titles, requests: f.requests, extras: f.extras || [], coins: f.coins || [], profiles: {} };
    var boxIds = {}; f.boxes.forEach(function (b) { boxIds[b.id] = 1; });
    store.state.mysteryBoxes = (store.state.mysteryBoxes || []).filter(function (b) { return !boxIds[b.id]; });
    f.items.forEach(function (x) {
      var list = store.state.studentInventories[x.studentId] || [];
      store.state.studentInventories[x.studentId] = list.filter(function (e) { return e !== x.entry && e.id !== x.entry.id; });
      var prof = store.getMonsterProfile ? store.getMonsterProfile(x.studentId) : null;
      if (prof && prof.unlockedItems && prof.unlockedItems.indexOf(x.entry.itemId) >= 0) {
        if (!backup.profiles[x.studentId]) backup.profiles[x.studentId] = { unlockedItems: prof.unlockedItems.slice(), equipped: JSON.parse(JSON.stringify(prof.equipped || {})) };
        var eq = JSON.parse(JSON.stringify(prof.equipped || {})); Object.keys(eq).forEach(function (k) { if (eq[k] === x.entry.itemId) eq[k] = 'none'; });
        store.updateMonsterProfile(x.studentId, { unlockedItems: prof.unlockedItems.filter(function (i) { return i !== x.entry.itemId; }), equipped: eq });
      }
    });
    (f.orphans || []).forEach(function (x) {
      var prof = store.getMonsterProfile ? store.getMonsterProfile(x.studentId) : null; if (!prof || !prof.unlockedItems) return;
      if (!backup.profiles[x.studentId]) backup.profiles[x.studentId] = { unlockedItems: prof.unlockedItems.slice(), equipped: JSON.parse(JSON.stringify(prof.equipped || {})) };
      var eq = JSON.parse(JSON.stringify(prof.equipped || {})); Object.keys(eq).forEach(function (k) { if (eq[k] === x.id) eq[k] = 'none'; });
      store.updateMonsterProfile(x.studentId, { unlockedItems: prof.unlockedItems.filter(function (i) { return i !== x.id; }), equipped: eq });
    });
    f.titles.concat(f.extras || []).forEach(function (x) { var ce = d.cosmetics[x.studentId]; if (!ce) return; ce.owned = (ce.owned || []).filter(function (t) { return t !== x.id; }); Object.keys(ce.equipped || {}).forEach(function (k) { if (ce.equipped[k] === x.id) delete ce.equipped[k]; }); });
    (f.coins || []).forEach(function (x) { var amt = Number(x.entry.delta) || 0; if (amt > 0) grant(x.studentId, -amt, 'Removed coins from a test mystery box'); });
    var reqIds = {}; f.requests.forEach(function (r) { reqIds[r.id] = 1; });
    d.requests = d.requests.filter(function (r) { return !reqIds[r.id]; });
    try { localStorage.setItem(CLEAN_KEY, JSON.stringify(backup)); } catch (e) { /* backup is best effort */ }
    Object.keys(f.pupils).forEach(touchStudent);
    save();
    return f.total;
  }
  function undoClean() {
    var b = null; try { b = JSON.parse(localStorage.getItem(CLEAN_KEY) || 'null'); } catch (e) { b = null; }
    if (!b) return false;
    var d = data(), pupils = {};
    store.state.mysteryBoxes = (store.state.mysteryBoxes || []).concat(b.boxes || []);
    (b.items || []).forEach(function (x) { (store.state.studentInventories[x.studentId] = store.state.studentInventories[x.studentId] || []).push(x.entry); pupils[x.studentId] = 1; });
    Object.keys(b.profiles || {}).forEach(function (id) { store.updateMonsterProfile(id, b.profiles[id]); });
    (b.titles || []).forEach(function (x) { var ce = d.cosmetics[x.studentId] || (d.cosmetics[x.studentId] = { owned: [], equipped: {} }); if ((ce.owned || []).indexOf(x.id) < 0) (ce.owned = ce.owned || []).push(x.id); ce.equipped = ce.equipped || {}; ce.equipped.title = x.id; pupils[x.studentId] = 1; });
    d.requests = d.requests.concat(b.requests || []);
    (b.extras || []).forEach(function (x) { var ce = d.cosmetics[x.studentId] || (d.cosmetics[x.studentId] = { owned: [], equipped: {} }); if ((ce.owned || []).indexOf(x.id) < 0) (ce.owned = ce.owned || []).push(x.id); pupils[x.studentId] = 1; });
    (b.coins || []).forEach(function (x) { var amt = Number(x.entry.delta) || 0; if (amt > 0) grant(x.studentId, amt, 'Undo: coins from a test mystery box'); pupils[x.studentId] = 1; });
    (b.boxes || []).concat(b.requests || []).forEach(function (x) { pupils[x.studentId] = 1; });
    Object.keys(pupils).forEach(touchStudent);
    try { localStorage.removeItem(CLEAN_KEY); } catch (e) { /* ignore */ }
    save(); return true;
  }

  function card(inner, extra) { return '<div class="cs-glass-card" style="' + (extra || '') + '">' + inner + '</div>'; }
  function h2(t, sub) { return '<div style="margin-bottom:12px;"><div style="font-size:1.05rem;font-weight:900;color:#f8fafc;font-family:\'Fraunces\',Georgia,serif;">' + t + '</div>' + (sub ? '<div style="font-size:.82rem;color:#94a3b8;margin-top:3px;">' + sub + '</div>' : '') + '</div>'; }
  function btn(label, onclick, kind, disabled) {
    var cls = 'cs-3d-btn' + (kind === 'danger' ? ' danger' : kind === 'ghost' ? ' ghost' : kind === 'ok' ? ' ok' : kind === 'gold' ? ' gold' : '');
    return '<button type="button" class="' + cls + '" ' + (disabled ? 'disabled ' : 'onclick="' + onclick + '"') + '>' + label + '</button>';
  }
  function coinPill(n) { return '<span class="cs-coin-pill">🪙 ' + n + '</span>'; }
  function when(ts) { try { return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function studentName(id) { var s = store.getStudent ? store.getStudent(id) : null; return s ? ((s.firstName || '') + ' ' + (s.lastName || '')).trim() : 'Student'; }

  var teacherDrawerOpen = false;
  var shopStudentId = null;

  // ---------------------------------------------------------------- Teacher data & sections (Cyber-Glass)
  function renderTeacher(container, mode) {
    var d = data(), cfg = d.config;
    var cls = store.getActiveClass ? store.getActiveClass() : null;
    var students = (cls && store.getStudentsByClass ? store.getStudentsByClass(cls.id) : (store.getStudents ? store.getStudents() : [])) || [];
    var pending = d.requests.filter(function (r) { return r.status === 'pending'; });
    var approved = d.requests.filter(function (r) { return r.status === 'approved'; });

    var curStu = (shopStudentId && students.filter(function (x) { return x.id === shopStudentId; })[0]) ||
      (store.getActiveStudent && students.filter(function (x) { var a = store.getActiveStudent(); return a && x.id === a.id; })[0]) ||
      students[0] || (store.getActiveStudent ? store.getActiveStudent() : null);
    if (curStu) shopStudentId = curStu.id;

    var drawerHtml = '<div>';
    var marks = []; function mark(n) { marks.push([n, drawerHtml.length]); }

    mark('requests');
    drawerHtml += card(h2('📬 Reward requests waiting for you (' + pending.length + ')', 'Approve to keep the coins, decline to refund them immediately.') +
      (pending.length ? pending.map(function (r) {
        return '<div class="cs-row-line">' +
          '<span style="font-size:1.5rem;">' + esc(r.icon) + '</span><div style="flex:1;min-width:200px;"><div style="font-weight:800;color:#f8fafc;">' + esc(r.name) + '</div>' +
          '<div style="font-size:.78rem;color:#94a3b8;">' + esc(studentName(r.studentId)) + ' · ' + when(r.createdAt) + ' · ' + coinPill(r.price) + '</div></div>' +
          btn('✓ Approve', "ClassroomStore.ui.decide('" + r.id + "','approved')", 'ok') + ' ' + btn('✕ Decline', "ClassroomStore.ui.decline('" + r.id + "')", 'danger') + '</div>';
      }).join('') : '<div style="font-size:.85rem;color:#94a3b8;">No reward requests waiting right now.</div>') +
      (approved.length ? '<div style="margin-top:12px;font-weight:800;font-size:.82rem;color:#38bdf8;">Approved, not used yet (' + approved.length + ')</div>' + approved.map(function (r) {
        return '<div class="cs-row-line"><span>' + esc(r.icon) + '</span><div style="flex:1;font-size:.85rem;color:#e5edff;">' + esc(r.name) + ' <span style="color:#94a3b8;">· ' + esc(studentName(r.studentId)) + '</span></div>' + btn('✓ Mark used', "ClassroomStore.ui.decide('" + r.id + "','used')", 'ghost') + '</div>';
      }).join('') : ''));

    mark('clean');
    var unearned = findUnearned(), hasBackup = false; try { hasBackup = !!localStorage.getItem(CLEAN_KEY); } catch (e) { hasBackup = false; }
    if (unearned.total) drawerHtml += card(h2('🧹 Items nobody earned (' + unearned.total + ')', 'Leftover automatic starter boxes or old test openings.') +
      '<div style="font-size:.86rem;color:#cbd5e1;margin-bottom:10px;">' + unearned.boxes.length + ' mystery boxes · ' + (unearned.items.length + unearned.extras.length + unearned.titles.length) + ' prizes · ' + unearned.orphans.length + ' orphan items · ' + unearned.coins.length + ' coin prizes · ' + unearned.requests.length + ' free rewards · for: ' + esc(Object.keys(unearned.pupils).map(studentName).join(', ')) + '. XP is untouched.</div>' +
      btn('🧹 Remove them', 'ClassroomStore.ui.cleanUnearned()', 'danger'), 'border-color:#f59e0b;');
    else if (hasBackup) drawerHtml += card(h2('🧹 Clean-up done', 'A backup copy is stored on this device.') + btn('Undo clean-up', 'ClassroomStore.ui.undoClean()', 'ghost'));

    mark('worksheet');
    drawerHtml += card(h2('📝 Worksheet coins' + (cls ? ' · ' + esc(cls.name || cls.id) : ''), '1 coin per correct answer (0–10). Tap a score for each pupil who completed the sheet, then press Give coins.') +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:12px;"><label class="cs-field-lbl">Worksheet name<input id="cs-ws-name" class="cs-dark-inp" type="text" maxlength="40" value="' + esc(wsName) + '" onchange="ClassroomStore.ui.wsName(this.value)" style="width:240px;"></label>' +
      '<span id="cs-ws-count" style="font-size:.85rem;font-weight:800;color:#38bdf8;">0 scores picked</span>' + btn('🪙 Give coins', 'ClassroomStore.ui.wsGive()', 'ok') + btn('Clear', 'ClassroomStore.ui.wsClear()', 'ghost') + '</div>' +
      '<div style="overflow-x:auto;">' + students.map(function (s) {
        return '<div class="cs-row-line"><div style="width:140px;font-weight:800;font-size:.86rem;color:#f8fafc;">' + esc(studentName(s.id)) + '</div><div id="cs-ws-' + esc(s.id) + '" style="flex:1;min-width:340px;">' + wsRowHtml(s.id) + '</div></div>';
      }).join('') + '</div>');

    mark('coins');
    drawerHtml += card(h2('🪙 Students & coin balances' + (cls ? ' · ' + esc(cls.name || cls.id) : ''), 'Quick +5 / +10 / −5 adjustments per student.') +
      '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:.85rem;color:#e5edff;">' +
      '<thead><tr style="text-align:left;color:#94a3b8;"><th style="padding:6px 8px;">Student</th><th style="padding:6px 8px;">XP</th><th style="padding:6px 8px;">Coins</th><th style="padding:6px 8px;">Titles &amp; Sound</th><th style="padding:6px 8px;">Quick adjust</th></tr></thead><tbody>' +
      students.map(function (s) {
        var xp = store.getStudentTotalXP ? store.getStudentTotalXP(s.id) : 0;
        return '<tr style="border-top:1px solid rgba(51,65,85,.65);"><td style="padding:8px;font-weight:800;color:#f8fafc;">' + esc(studentName(s.id)) + '</td><td style="padding:8px;color:#cbd5e1;">' + xp + '</td><td style="padding:8px;">' + coinPill(balance(s.id)) + '</td><td style="padding:8px;font-size:.76rem;color:#94a3b8;">' + (function () {
            var e = equippedExtras(s.id), bits = [];
            if (e.title) bits.push('🏷️ ' + esc(e.title.name)); if (e.pack) bits.push(esc(e.pack.icon) + ' ' + esc(e.pack.name)); if (e.plate) bits.push('🖼️ ' + esc(e.plate.name)); if (e.sound) bits.push('🔊 ' + esc(e.sound.name));
            return bits.length ? bits.join(' · ') : '—';
          })() + '</td><td style="padding:8px;white-space:nowrap;">' +
          btn('+5', "ClassroomStore.ui.give('" + s.id + "',5)", 'ghost') + ' ' + btn('+10', "ClassroomStore.ui.give('" + s.id + "',10)", 'ghost') + ' ' + btn('−5', "ClassroomStore.ui.give('" + s.id + "',-5)", 'ghost') + ' ' + btn('Custom…', "ClassroomStore.ui.giveCustom('" + s.id + "')", 'ghost') + '</td></tr>';
      }).join('') + '</tbody></table></div>');

    mark('prices');
    drawerHtml += card(h2('⚙️ Prices & classroom rewards', 'Any price edit takes effect immediately.') +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin-bottom:14px;">' +
      ['common', 'rare', 'epic', 'legendary', 'mythic'].map(function (k) { return '<label class="cs-field-lbl">' + RARITY_NAME[k] + ' item<input class="cs-dark-inp" type="number" min="1" value="' + cfg.itemPrices[k] + '" onchange="ClassroomStore.ui.setPrice(\'item\',\'' + k + '\',this.value)"></label>'; }).join('') +
      TIERS.map(function (k) { return '<label class="cs-field-lbl">' + BOX_INFO[k].name + '<input class="cs-dark-inp" type="number" min="1" value="' + cfg.boxPrices[k] + '" onchange="ClassroomStore.ui.setPrice(\'box\',\'' + k + '\',this.value)"></label>'; }).join('') + '</div>' +
      cfg.privileges.map(function (p) {
        return '<div class="cs-row-line">' +
          '<span style="font-size:1.3rem;">' + esc(p.icon) + '</span><div style="flex:1;min-width:180px;font-weight:800;color:#f8fafc;">' + esc(p.name) + '</div>' +
          '<label style="font-size:.74rem;color:#94a3b8;">coins <input class="cs-dark-inp" type="number" min="1" value="' + p.price + '" onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'price\',this.value)" style="width:74px;display:inline-block;margin-left:4px;"></label>' +
          '<label style="font-size:.74rem;color:#94a3b8;">/week <input class="cs-dark-inp" type="number" min="0" value="' + (p.weeklyLimit || 0) + '" onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'weeklyLimit\',this.value)" style="width:62px;display:inline-block;margin-left:4px;"></label>' +
          '<label style="font-size:.78rem;font-weight:700;color:#e5edff;cursor:pointer;"><input type="checkbox" ' + (p.active ? 'checked' : '') + ' onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'active\',this.checked)"> active</label>' +
          btn('Remove', "ClassroomStore.ui.removePriv('" + p.id + "')", 'ghost') + '</div>';
      }).join('') + '<div style="margin-top:12px;">' + btn('+ Add classroom reward', 'ClassroomStore.ui.addPriv()', 'ghost') + '</div>');

    mark('party');
    if (cls) {
      var fund = fundFor(cls.id);
      drawerHtml += card(h2('🎉 Class party fund · ' + esc(cls.name || cls.id), 'Pupils pool coins together toward a shared class celebration.') +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;"><label class="cs-field-lbl">Goal title<input id="cs-fund-name" class="cs-dark-inp" type="text" maxlength="40" value="' + esc(fund ? fund.name : 'Class game day') + '" style="width:220px;"></label>' +
        '<label class="cs-field-lbl">Goal (coins)<input id="cs-fund-goal" class="cs-dark-inp" type="number" min="1" value="' + (fund && fund.goal ? fund.goal : 200) + '" style="width:110px;"></label>' +
        btn(fund && fund.goal ? 'Save goal' : 'Start fund', "ClassroomStore.ui.setFund('" + cls.id + "')", 'ok') + (fund && fund.goal ? ' ' + btn('Reset bar', "ClassroomStore.ui.resetFund('" + cls.id + "')", 'ghost') : '') + '</div>' +
        (fund && fund.goal ? '<div style="margin-top:12px;font-weight:800;color:#fde047;">' + fund.raised + ' / ' + fund.goal + ' coins' + (fund.raised >= fund.goal ? ' · 🎊 GOAL REACHED!' : '') + '</div><div style="margin-top:6px;background:#0b1222;border:1.5px solid #334155;border-radius:999px;height:16px;overflow:hidden;"><div style="width:' + Math.min(100, Math.round(fund.raised / fund.goal * 100)) + '%;height:100%;background:linear-gradient(90deg,#10b981,#f59e0b,#f43f5e);"></div></div>' : ''));
    }

    mark('odds');
    drawerHtml += card(h2('🎁 Mystery box prize odds', 'Boxes never duplicate an item the pupil already owns.') +
      '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:.82rem;color:#e5edff;"><thead><tr style="text-align:left;color:#94a3b8;"><th style="padding:5px 8px;">Box</th><th style="padding:5px 8px;">Avatar item</th><th style="padding:5px 8px;">Sound / Title / Plate</th><th style="padding:5px 8px;">Free reward</th><th style="padding:5px 8px;">Coins</th><th style="padding:5px 8px;">Jackpot</th></tr></thead><tbody>' +
      TIERS.map(function (t) {
        var o = {}; BOX_ODDS[t].forEach(function (r) { o[r[0]] = r[1]; });
        return '<tr style="border-top:1px solid rgba(51,65,85,.65);"><td style="padding:6px 8px;font-weight:800;color:#f8fafc;">' + BOX_INFO[t].icon + ' ' + BOX_INFO[t].name + '</td><td style="padding:6px 8px;">' + o.item + '%</td><td style="padding:6px 8px;">' + o.extra + '%</td><td style="padding:6px 8px;">' + o.voucher + '% (up to ' + Math.min(BOX_VOUCHER_CAP[t], (Number(data().config.boxPrices[t]) || 10) * 3) + ' coins)</td><td style="padding:6px 8px;">' + o.coins + '% (' + boxCoins(t)[0] + '–' + boxCoins(t)[1] + ')</td><td style="padding:6px 8px;">' + o.jackpot + '% (' + jackpotCoins(t) + ' 🪙)</td></tr>';
      }).join('') + '</tbody></table></div>');

    mark('history');
    var recent = d.purchases.slice(0, 15);
    drawerHtml += card(h2('🧾 Recent purchases', 'Undo refunds the coins and removes the item or unopened box.') +
      (recent.length ? recent.map(function (p) {
        return '<div class="cs-row-line"><span style="font-size:1.2rem;">' + esc(p.icon) + '</span><div style="flex:1;min-width:180px;"><b>' + esc(p.name) + '</b> <span style="color:#94a3b8;">· ' + esc(studentName(p.studentId)) + ' · ' + when(p.ts) + '</span></div>' + coinPill(p.price) +
          (p.status === 'done' ? btn('Undo', "ClassroomStore.ui.undo('" + p.id + "')", 'ghost') : '<span style="font-size:.75rem;color:#94a3b8;">refunded</span>') + '</div>';
      }).join('') : '<div style="font-size:.85rem;color:#94a3b8;">Nothing bought yet.</div>'));

    mark('end');
    drawerHtml += '</div>';

    var sections = {}; marks.forEach(function (m, k) { if (k < marks.length - 1) sections[m[0]] = drawerHtml.slice(m[1], marks[k + 1][1]); });
    if (mode === 'parts') return { sections: sections, students: students, cls: cls, curStu: curStu, pending: pending, approved: approved };
    if (container) renderUnifiedStudio(container, 'teacher');
    return null;
  }

  // ---------------------------------------------------------------- UI: Unified 60-30-10 Cyber-Glass Avatar Studio & Shop
  var SHOP_ART = {};
  try { fetch('assets/store/items/manifest.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (l) { (Array.isArray(l) ? l : []).forEach(function (id) { SHOP_ART[id] = 'assets/store/items/' + id + '.webp'; }); }).catch(function () {}); } catch (e) { /* offline */ }
  function itemPicHtml(item) {
    if (item && item.category === 'pet' && root.MonsterPets && root.MonsterPets.thumbnailHtml) {
      var petTh = root.MonsterPets.thumbnailHtml(item, 72);
      if (petTh) return petTh;
    }
    var name = String(item.id).replace(/^(bg|aura)-/, ''), artOn = root.EAA_ILLUSTRATED_MONSTERS === true, D0 = root.MonsterDressUp;
    if (item.category === 'background' && (!D0 || !D0.lists || D0.lists.backgrounds.indexOf(name) !== -1)) return '<img src="assets/monsters/bg-art/bg_' + name + '.webp" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:12px;">';
    if (item.category === 'aura' && (!D0 || !D0.lists || D0.lists.auras.indexOf(name) !== -1)) return '<div style="width:72px;height:72px;margin:0 auto;background:#0f172a;border-radius:12px;display:flex;align-items:center;justify-content:center;"><img src="assets/monsters/aura-art/aura_' + name + '.webp" alt="" style="width:68px;height:68px;object-fit:contain;"></div>';
    var D = root.MonsterDressUp, pic = D && D.itemPicture ? D.itemPicture(item.id) : '';
    if (!pic && D && D.itemArt) pic = D.itemArt(item.id);
    if (!pic && SHOP_ART[item.id]) pic = SHOP_ART[item.id];
    if (pic) return '<img src="' + pic + '" alt="" style="width:72px;height:72px;object-fit:contain;">';
    if (!artOn && root.MonsterRenderer && root.MonsterRenderer.renderMonsterItemThumbnail) {
      try { var th = root.MonsterRenderer.renderMonsterItemThumbnail(item, { size: 72, colorKey: 'blue' }); if (th) return '<div style="width:72px;height:72px;margin:0 auto;display:flex;align-items:center;justify-content:center;">' + th + '</div>'; } catch (e) { /* use the emoji */ }
    }
    return '<div style="font-size:2.4rem;line-height:72px;height:72px;">' + esc(item.icon || '🎁') + '</div>';
  }
  var RARITY_NAME = { common: 'Everyday', rare: 'Cool', epic: 'Epic', legendary: 'Legendary', mythic: 'Mythic' };
  var SHELVES = [['mythic', '🔴', 'The far dreams. Only the greatest explorers get here.'], ['legendary', '🟡', 'Very few explorers have these.'], ['epic', '🟣', 'Worth saving for.'], ['rare', '🟢', 'Cool things, not far away.'], ['common', '⚪', 'Small wins, soon.']];
  function shelvesHtml(shown, bal, lvl) {
    return SHELVES.map(function (sh) {
      var row = shown.filter(function (x) { return (x.item.rarity || 'common') === sh[0]; });
      if (!row.length) return '';
      return '<div class="cs-shelf" style="--rc:' + RARITY_COLOR[sh[0]] + ';"><div class="cs-shelf-top"><b>' + sh[1] + ' ' + RARITY_NAME[sh[0]] + '</b><span>' + sh[2] + '</span></div><div class="cs-grid">' +
        row.map(function (x) { return itemCardHtml(x, bal, lvl); }).join('') + '</div></div>';
    }).join('');
  }
  function itemCardHtml(x, bal, lvl) {
    var it = x.item, locked = lvl < x.level, can = !locked && bal >= x.price;
    return '<div class="cs-item' + (locked ? ' is-locked' : '') + '" style="--rc:' + (RARITY_COLOR[it.rarity] || '#64748b') + ';">' +
      '<button type="button" class="cs-art"' + (locked ? ' tabindex="-1"' : ' title="Try it on" onclick="ClassroomStore.ui.tryOn(\'' + esc(it.id) + '\')"') + '>' +
        '<span class="cs-rar">' + esc(RARITY_NAME[it.rarity] || 'Common') + '</span><span class="cs-pic">' + itemPicHtml(it) + '</span><i class="cs-ped"></i>' +
        (locked ? '' : '<span class="cs-try">👀 Try on</span>') + '</button>' +
      '<div class="cs-info"><div class="cs-nm">' + esc(it.name) + '</div>' +
        (locked ? '<span class="monster-item-lock-pill">' + (isLevelReward(it) ? '🎁 Free at level ' : '🔒 Level ') + x.level + '</span>'
          : coinPill(x.price) + '<div style="margin-top:8px;">' + btn(can ? 'Buy' : 'Need ' + (x.price - bal) + ' more', "ClassroomStore.ui.buyItem('" + it.id + "')", 'ok', !can) + '</div>') +
      '</div></div>';
  }
  function tryOnHtml(sid, item) {
    var R = root.MonsterRenderer, prof = store.getMonsterProfile ? store.getMonsterProfile(sid) : null, m = store.calculateMonsterState ? store.calculateMonsterState(sid) : null;
    if (!R || !R.renderMonsterSVG || !prof) return '';
    var stage = m && m.stageKey && m.stageKey !== 'egg' && m.stageKey !== 'cracking_egg' ? m.stageKey : 'baby';
    var eq = JSON.parse(JSON.stringify(prof.equipped || {})), color = prof.baseColor || 'blue';
    if (item.category === 'body') color = String(item.id).replace(/^body-/, '') || color; else eq[item.category] = item.id;
    try { return R.renderMonsterSVG({ stage: stage, color: color, equipped: eq, size: 260, animated: true, isAvatar: true }); } catch (e) { return ''; }
  }

  function ensureStudioStyle() {
    if (!root.document || document.getElementById('cs-studio-style')) return;
    var st = document.createElement('style'); st.id = 'cs-studio-style';
    st.textContent =
      '.cs-studio{--spring:cubic-bezier(.175,.885,.32,1.275);max-width:1260px;margin:0 auto;padding:8px 12px 70px;color:#e5edff;font-family:"Plus Jakarta Sans",system-ui,sans-serif}' +
      '.cs-glass-card{background:rgba(15,23,42,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1.5px solid #26324a;border-radius:20px;padding:16px 18px;margin-bottom:14px;box-shadow:0 4px 20px -2px rgba(0,0,0,.45),0 2px 6px -1px rgba(0,0,0,.22);color:#e5edff}' +
      '.cs-row-line{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid rgba(51,65,85,.65);flex-wrap:wrap}' +
      '.cs-field-lbl{display:flex;flex-direction:column;gap:4px;font-size:.76rem;font-weight:800;color:#94a3b8}' +
      '.cs-dark-inp{padding:8px 10px;border-radius:11px;border:1.5px solid #334155;background:#0b1222;color:#f8fafc;font-weight:800;font-family:inherit;font-size:.86rem}' +
      '.cs-dark-inp:focus{outline:2px solid #38bdf8;border-color:#38bdf8}' +
      '.cs-coin-pill{display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,.18);border:1.5px solid rgba(245,158,11,.6);color:#fde047;border-radius:999px;padding:2px 10px;font-weight:900;font-size:.8rem;white-space:nowrap}' +
      '.cs-lvl-pill{display:inline-flex;align-items:center;gap:4px;background:rgba(56,189,248,.16);border:1.5px solid rgba(56,189,248,.55);color:#7dd3fc;border-radius:999px;padding:2px 10px;font-weight:900;font-size:.8rem;white-space:nowrap}' +
      '.cs-3d-btn{border:1.5px solid #38bdf8;border-bottom:5px solid #0284c7;background:#0ea5e9;color:#fff;font-weight:800;font-size:.84rem;border-radius:12px;padding:8px 14px;cursor:pointer;font-family:inherit;transition:transform .14s var(--spring),filter .14s;display:inline-flex;align-items:center;justify-content:center;gap:5px;line-height:1.15}' +
      '.cs-3d-btn:hover:not([disabled]){filter:brightness(1.07)}' +
      '.cs-3d-btn:active:not([disabled]){transform:translateY(4px);border-bottom-width:1px}' +
      '.cs-3d-btn.ok{background:#10b981;border-color:#34d399;border-bottom-color:#047857;color:#fff}' +
      '.cs-3d-btn.gold{background:#f59e0b;border-color:#fbbf24;border-bottom-color:#b45309;color:#111827}' +
      '.cs-3d-btn.danger{background:#f43f5e;border-color:#fb7185;border-bottom-color:#be123c;color:#fff}' +
      '.cs-3d-btn.ghost{background:#1e293b;border-color:#334155;border-bottom-color:#0f172a;color:#e5edff}' +
      '.cs-3d-btn[disabled]{opacity:.45;cursor:not-allowed;filter:grayscale(.45)}' +
      '.cs-3d-mini{width:34px;height:34px;margin:2px;border-radius:9px;border:1.5px solid #334155;border-bottom:5px solid #0f172a;background:#1e293b;color:#e5edff;font-weight:900;font-size:.82rem;cursor:pointer;transition:transform .14s var(--spring)}' +
      '.cs-3d-mini.on{background:#10b981;border-color:#34d399;border-bottom-color:#047857;color:#fff}' +
      '.cs-3d-mini:active{transform:translateY(4px);border-bottom-width:1px}' +
      /* Studio Header + Mode Bar */
      '.cs-studio-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px;background:rgba(15,23,42,.82);backdrop-filter:blur(14px);border:1.5px solid #26324a;border-radius:20px;padding:12px 16px;box-shadow:0 4px 20px -2px rgba(0,0,0,.4)}' +
      '.cs-studio-title{font:800 clamp(1.25rem,2vw,1.6rem)/1.15 Fraunces,Georgia,serif;color:#f8fafc;margin:0;flex:1;min-width:200px}' +
      '.cs-mode-pills{display:flex;gap:8px;flex-wrap:wrap}' +
      '.cs-mode-btn{padding:9px 16px;border-radius:14px;font-weight:900;font-size:.88rem;cursor:pointer;background:#1e293b;color:#cbd5e1;border:1.5px solid #334155;border-bottom:5px solid #0f172a;transition:transform .14s var(--spring)}' +
      '.cs-mode-btn.on{background:#a855f7;border-color:#c084fc;border-bottom-color:#6b21a8;color:#fff}' +
      '.cs-mode-btn:active{transform:translateY(4px);border-bottom-width:1px}' +
      /* Pupil Roster Strip */
      '.cs-pstrip{display:flex;gap:7px;overflow-x:auto;padding:4px 2px 10px;margin-bottom:12px;scrollbar-width:thin}' +
      '.cs-pbtn{flex:0 0 auto;min-width:104px;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 10px;border-radius:14px;cursor:pointer;background:rgba(15,23,42,.85);color:#e5edff;border:1.5px solid #334155;border-bottom:5px solid #0f172a;font-weight:800;font-size:.86rem;transition:transform .14s var(--spring)}' +
      '.cs-pbtn span{font-size:.74rem;color:#fde047;font-weight:900}' +
      '.cs-pbtn.on{background:linear-gradient(180deg,#7c3aed,#6d28d9);border-color:#c084fc;border-bottom-color:#4c1d95;color:#fff}' +
      '.cs-pbtn:active{transform:translateY(4px);border-bottom-width:1px}' +
      /* Avatar Studio Two-Column Split */
      '.cs-avwrap{display:grid;grid-template-columns:minmax(290px,355px) 1fr;gap:16px;align-items:start}' +
      '@media (max-width:860px){.cs-avwrap{grid-template-columns:1fr}.cs-avstage{position:static!important}}' +
      '.cs-avstage{position:sticky;top:10px;background:rgba(15,23,42,.85);backdrop-filter:blur(14px);border:1.5px solid #26324a;border-bottom:5px solid #0f172a;border-radius:22px;padding:14px;text-align:center;box-shadow:0 8px 28px rgba(0,0,0,.45)}' +
      '.cs-avstage-hd{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:8px;flex-wrap:wrap}' +
      '.cs-avstage-nm{font:800 1.15rem/1.1 Fraunces,Georgia,serif;color:#f8fafc}' +
      '.cs-avstage-in{position:relative;height:336px;display:flex;align-items:flex-end;justify-content:center;border-radius:18px;background:radial-gradient(circle at 50% 38%,rgba(56,189,248,.26) 0%,rgba(168,85,247,.12) 45%,transparent 72%),linear-gradient(180deg,#111a2e,#060911);border:1px solid rgba(56,189,248,.22);overflow:hidden}' +
      '.cs-avstage-in img{position:relative;z-index:1;max-height:326px;max-width:100%;object-fit:contain;transition:opacity .18s}' +
      '.cs-avstage-in i{position:absolute;bottom:8px;left:50%;width:168px;height:24px;margin-left:-84px;border-radius:50%;background:radial-gradient(ellipse,rgba(56,189,248,.48) 0%,transparent 72%)}' +
      '.cs-ctrl-row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:9px}' +
      '.cs-pose-btn{padding:6px 10px;border-radius:11px;font-size:.77rem;font-weight:800;cursor:pointer;background:#1e293b;color:#cbd5e1;border:1.5px solid #334155;border-bottom:5px solid #0f172a;transition:transform .14s var(--spring)}' +
      '.cs-pose-btn.on{background:#38bdf8;border-color:#7dd3fc;border-bottom-color:#0284c7;color:#06101f}' +
      '.cs-pose-btn.id-girl.on{background:#ec4899;border-color:#f9a8d4;border-bottom-color:#9d174d;color:#fff}' +
      '.cs-pose-btn.id-boy.on{background:#38bdf8;border-color:#7dd3fc;border-bottom-color:#0284c7;color:#06101f}' +
      '.cs-pose-btn:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cs-swtray{margin-top:10px;padding:10px;border-radius:14px;background:rgba(6,9,17,.65);border:1px solid #26324a;text-align:left}' +
      '.cs-swtray-lbl{font-size:.72rem;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
      '.cs-swrow{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:8px}' +
      '.cs-swatch{width:34px;height:34px;border-radius:10px;border:2px solid rgba(255,255,255,.28);border-bottom:5px solid rgba(0,0,0,.45);cursor:pointer;transition:transform .14s var(--spring)}' +
      '.cs-swatch.round{border-radius:50%}' +
      '.cs-swatch.on{border-color:#fde047;box-shadow:0 0 0 2px #fde047}' +
      '.cs-swatch:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cs-wearing-box{margin-top:10px;padding-top:9px;border-top:1px solid rgba(51,65,85,.65);text-align:left}' +
      '.cs-wchips{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}' +
      '.cs-wchip{display:inline-flex;align-items:center;gap:4px;background:#1e293b;border:1px solid #334155;border-radius:999px;padding:3px 4px 3px 9px;font-size:.73rem;font-weight:800;color:#e5edff}' +
      '.cs-wchip-x{border:0;border-bottom:3px solid #0f172a;background:#334155;color:#fca5a5;border-radius:999px;width:20px;height:20px;font-size:.7rem;font-weight:900;cursor:pointer;line-height:1;padding:0}' +
      '.cs-avbar{margin-top:10px;padding:10px;border-radius:14px;background:rgba(16,185,129,.12);border:1.5px solid rgba(52,211,153,.45);color:#e5edff}' +
      '.cs-avbar-name{font-weight:900;font-size:.98rem;color:#f8fafc}' +
      /* Right Closet & Shop Grid */
      '.cs-avFilterRow{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}' +
      '.cs-avchips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}' +
      '.cs-avchip{padding:7px 12px;border-radius:12px;font-size:.8rem;font-weight:800;cursor:pointer;background:#1e293b;color:#cbd5e1;border:1.5px solid #334155;border-bottom:5px solid #0f172a;transition:transform .14s var(--spring)}' +
      '.cs-avchip.on{background:#a855f7;border-color:#c084fc;border-bottom-color:#6b21a8;color:#fff}' +
      '.cs-avchip:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cs-avgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(144px,1fr));gap:11px}' +
      '.cs-avcard{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:5px;padding:26px 8px 10px;border-radius:18px;color:#e5edff;text-align:center;' +
        'background:radial-gradient(circle at 50% 34%,color-mix(in srgb,var(--rc) 32%,transparent) 0%,transparent 70%),rgba(15,23,42,.86);border:1.5px solid #26324a;border-bottom:5px solid #0f172a;transition:transform .16s var(--spring),border-color .16s}' +
      '.cs-avcard:hover{transform:translateY(-2px);border-color:var(--rc)}' +
      '.cs-avcard.sel{border-color:#fde047;box-shadow:0 0 0 2px #fde047}' +
      '.cs-avcard.is-locked{pointer-events:none!important;opacity:.45!important;filter:grayscale(.7)!important;cursor:not-allowed!important}' +
      '.cs-avcard-pic{border:0;background:none;padding:0;cursor:pointer;width:100%;display:flex;flex-direction:column;align-items:center;gap:4px;color:inherit;font:inherit}' +
      '.cs-avcard-pic img{width:84px;height:84px;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,.5))}' +
      '.cs-avcard-pic b{font-size:.82rem;line-height:1.18;font-weight:800;color:#f8fafc}' +
      '.cs-avcard-act{width:100%;padding:6px 8px;border-radius:10px;font-size:.76rem;font-weight:900;cursor:pointer;border:1.5px solid #334155;border-bottom:5px solid #0f172a;background:#1e293b;color:#e5edff;transition:transform .14s var(--spring)}' +
      '.cs-avcard-act.wear{background:#0ea5e9;border-color:#7dd3fc;border-bottom-color:#0369a1;color:#fff}' +
      '.cs-avcard-act.on{background:#10b981;border-color:#34d399;border-bottom-color:#047857;color:#fff}' +
      '.cs-avcard-act.buy{background:#f59e0b;border-color:#fbbf24;border-bottom-color:#b45309;color:#111827}' +
      '.cs-avcard-act.short{background:#1e293b;border-color:#334155;border-bottom-color:#0f172a;color:#94a3b8}' +
      '.cs-avcard-act:active:not([disabled]){transform:translateY(4px);border-bottom-width:1px}' +
      '.cs-rar{position:absolute;top:7px;left:7px;z-index:2;font-size:.64rem;font-weight:900;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--rc) 32%,#0b1222);color:#fff;border:1px solid var(--rc)}' +
      '.cs-free-tag{position:absolute;top:7px;right:7px;z-index:2;font-size:.62rem;font-weight:900;padding:2px 7px;border-radius:999px;background:rgba(16,185,129,.22);color:#6ee7b7;border:1px solid rgba(52,211,153,.55)}' +
      /* Boxes, Prizes & Folded History */
      '.cs-prize-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:14px}' +
      '.cs-prize-card{background:rgba(15,23,42,.85);backdrop-filter:blur(14px);border:1.5px solid #26324a;border-bottom:5px solid #0f172a;border-radius:18px;padding:14px;text-align:center;display:flex;flex-direction:column;justify-content:space-between;color:#e5edff;box-shadow:0 4px 18px rgba(0,0,0,.35)}' +
      '.cs-prize-card.real{border-color:rgba(245,158,11,.75)}' +
      '.cs-fold{background:rgba(15,23,42,.82);border:1.5px solid #26324a;border-radius:18px;margin-top:16px;overflow:hidden;color:#e5edff}' +
      '.cs-fold summary{cursor:pointer;padding:13px 18px;font-weight:900;font-size:.92rem;list-style:none;display:flex;justify-content:space-between;align-items:center}' +
      '.cs-fold summary::-webkit-details-marker{display:none}' +
      '.cs-fold summary:after{content:"▾";color:#38bdf8;font-size:1rem}' +
      '.cs-fold[open] summary:after{content:"▴"}' +
      '.cs-sw{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:12px;border:1.5px solid #334155;border-bottom:4px solid #0f172a;background:#1e293b;color:#e5edff;font-weight:800;font-size:.83rem;cursor:pointer;margin:0 8px 8px 0}' +
      '.cs-sw input{width:17px;height:17px}.cs-sw.off{opacity:.5;text-decoration:line-through}' +
      '.cs-shelf{margin-bottom:20px;padding:12px;border:1.5px solid color-mix(in srgb,var(--rc) 55%,transparent);border-radius:20px;background:color-mix(in srgb,var(--rc) 9%,rgba(15,23,42,.5))}' +
      '.cs-shelf-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:10px;color:#e5edff}.cs-shelf-top b{font-size:1.02rem;font-weight:900}.cs-shelf-top span{font-size:.8rem;color:#cbd5e1}' +
      '.cs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(174px,1fr));gap:14px}' +
      '.cs-item{display:flex;flex-direction:column;background:rgba(15,23,42,.86);border:1.5px solid #26324a;border-bottom:5px solid #0f172a;border-radius:18px;overflow:hidden;color:#e5edff}' +
      '.cs-item.is-locked{pointer-events:none!important;opacity:.45!important;filter:grayscale(.7)!important;cursor:not-allowed!important}' +
      '.cs-art{position:relative;height:146px;border:0;padding:0;cursor:pointer;background:radial-gradient(circle at 50% 45%,color-mix(in srgb,var(--rc) 38%,transparent) 0%,transparent 68%),linear-gradient(180deg,#111a2e,#0b1222);display:flex;align-items:center;justify-content:center}' +
      '.cs-pic{position:relative;z-index:1;transform:scale(1.4)}.cs-ped{position:absolute;bottom:14px;left:50%;width:92px;height:16px;margin-left:-46px;border-radius:50%;background:radial-gradient(ellipse,color-mix(in srgb,var(--rc) 55%,#000) 0%,transparent 70%);opacity:.8}' +
      '.cs-info{padding:10px 12px 12px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;justify-content:flex-end}.cs-nm{font-weight:900;font-size:.9rem;line-height:1.15}' +
      '.cs-try-ovl{position:fixed;inset:0;z-index:9999;background:rgba(6,9,17,.82);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.cs-try-card{width:min(380px,100%);background:rgba(15,23,42,.96);border:2px solid var(--rc);border-radius:22px;padding:18px;text-align:center;color:#e5edff;box-shadow:0 20px 60px rgba(0,0,0,.5)}' +
      '.cs-try-mon{height:260px;display:flex;align-items:center;justify-content:center;border-radius:16px}.cs-try-mon svg{width:240px;height:240px}';
    document.head.appendChild(st);
  }

  var SHOP_TABS = (root.EAA_HIDE_MONSTERS !== false ? [['avatar', '👕 Avatar & Closet']] : [['items', '🎨 Items']]).concat([['extras', '🔊 Titles & Sounds'], ['boxes', '🎁 Mystery Boxes'], ['party', '🎉 Party Fund'], ['rewards', '⭐ Real Prizes']]);
  var AV_SLOTS = [
    ['all', 'All'],
    ['clothing', '👕 Tops & Outfits'],
    ['legs', '👖 Bottoms'],
    ['shoes', '👟 Shoes'],
    ['hat', '🎩 Hats'],
    ['wig', '💇 Wigs'],
    ['glasses', '🕶️ Glasses'],
    ['backpack', '🎒 Bags & Wings'],
    ['neck', '🏅 Necklaces'],
    ['accessory', '🪄 Held Props'],
    ['aura', '✨ Auras'],
    ['pet', '🐾 Pet Buddies'],
    ['extras', '🔊 Titles & Sounds']
  ];
  var AV_STATE_ORDER = { have: 0, level: 1, shop: 2 };

  function avRefreshPreview(sid) {
    var P = PA(), el = root.document && document.getElementById('cs-av-preview');
    if (!P || !el || !sid) return;
    var want = sid + '|' + avTryId + '|' + avEmotion;
    avPrevSid = want;
    if (!avTryId && avEmotion === 'smile' && P.has && P.has(sid)) {
      el.src = P.pictureFor(sid);
      el.style.opacity = '1';
      return;
    }
    if (!P.previewLook) {
      if (!avTryId) { el.src = P.pictureFor(sid); return; }
      P.previewWith(sid, avTryId).then(function (u) {
        var el2 = document.getElementById('cs-av-preview');
        if (el2 && avPrevSid === want && u) { el2.src = u; el2.style.opacity = '1'; }
      });
      return;
    }
    el.style.opacity = '.72';
    P.previewLook(sid, { itemId: avTryId || '', emotion: avEmotion || 'smile' }).then(function (u) {
      var el2 = document.getElementById('cs-av-preview');
      if (el2 && avPrevSid === want && u) { el2.src = u; el2.style.opacity = '1'; }
    }).catch(function () {
      var el3 = document.getElementById('cs-av-preview');
      if (el3) el3.style.opacity = '1';
    });
  }

  var extraKind = 'sound';
  function plateStyle(x) { return (x && x.css) || ''; }
  function extraCard(s, x, bal) {
    var owned = extraOwned(s.id, x.id), eq = equippedExtras(s.id)[x.kind], wearing = eq && eq.id === x.id, price = extraPrice(x), can = bal >= price;
    var pic = x.kind === 'plate' ? '<div style="height:54px;border-radius:12px;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.9rem;' + plateStyle(x) + '">' + esc(s.firstName || 'Name') + '</div>'
      : x.kind === 'title' ? '<div style="font-size:1.9rem;">' + x.icon + '</div><div style="display:inline-block;background:rgba(245,158,11,.2);border:1.5px solid #f59e0b;color:#fde68a;border-radius:999px;padding:2px 10px;font-weight:900;font-size:.74rem;margin:2px 0;">' + esc(x.name) + '</div>'
      : x.kind === 'pack' ? '<img src="bamboozle/memes/' + x.animal + '_celebrate.webp" alt="" style="width:64px;height:64px;object-fit:contain;" onerror="this.outerHTML=\'<div style=&quot;font-size:2.3rem;&quot;>' + x.icon + '</div>\'">'
      : '<div style="font-size:2.2rem;">' + x.icon + '</div>';
    var actions = '';
    if (x.kind === 'sound') actions += btn('▶ Play', "ClassroomStore.ui.previewSound('" + x.id + "')", 'ghost') + ' ';
    if (owned) actions += wearing ? btn('✓ On (Remove)', "ClassroomStore.ui.equip('" + x.kind + "','')", 'ok') : btn('Equip', "ClassroomStore.ui.equip('" + x.kind + "','" + x.id + "')");
    else if (String(x.id).indexOf('set-') === 0) actions += '<span style="font-size:.72rem;color:#94a3b8;">Complete costume set</span>';
    else actions += btn(can ? '🪙 Buy ' + price : 'Need ' + (price - bal) + ' more', "ClassroomStore.ui.buyExtra('" + x.id + "')", 'gold', !can);
    return '<div class="cs-avcard" style="padding:14px 10px;--rc:' + (RARITY_COLOR[x.rarity] || '#64748b') + ';">' +
      '<div>' + pic + '<div style="font-weight:900;font-size:.84rem;margin-top:4px;color:#f8fafc;">' + esc(x.name) + '</div>' +
      '<div style="font-size:.66rem;font-weight:800;color:' + (RARITY_COLOR[x.rarity] || '#94a3b8') + ';text-transform:uppercase;">' + esc(RARITY_NAME[x.rarity] || x.rarity) + '</div>' +
      '<div style="font-size:.72rem;color:#94a3b8;margin:4px 0 8px;min-height:2em;">' + esc(x.desc || '') + '</div></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;">' + actions + '</div></div>';
  }

  function renderExtrasPane(s, bal) {
    var C = CCo();
    if (!C) return '<div class="cs-glass-card" style="text-align:center;">Titles &amp; Sounds are loading…</div>';
    var eq = equippedExtras(s.id), K = C.KINDS;
    var chips = Object.keys(K).map(function (k) {
      var on = extraKind === k;
      return '<button type="button" class="cs-avchip' + (on ? ' on' : '') + '" onclick="ClassroomStore.ui.extraKind(\'' + k + '\')">' + K[k].icon + ' ' + K[k].label + '</button>';
    }).join('');
    var list = C.ofKind(extraKind).slice();
    if (extraKind === 'title') list = setTitleItems(s.id).concat(list);
    list.sort(function (a, b) { var o = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4 }; return (o[a.rarity] - o[b.rarity]) || a.name.localeCompare(b.name); });
    var note = extraKind === 'sound' ? '🔊 Victory sounds play on the Class Board when your name is picked or awarded XP.'
      : extraKind === 'title' ? '🏷️ Titles appear under your name on the Class Board.'
      : extraKind === 'pack' ? '🦊 Animal stickers react on your Class Board card.'
      : '🖼️ Name plates style your Class Board card.';
    var summary = '<div class="cs-glass-card" style="padding:11px 14px;margin-bottom:10px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;font-size:.82rem;">' +
      '<b style="color:#38bdf8;">Active Board Flair:</b>' +
      '<span>🏷️ ' + (eq.title ? '<b style="color:#fde047;">' + esc(eq.title.name) + '</b>' : '<i style="color:#94a3b8;">None</i>') + '</span>' +
      '<span>🔊 ' + (eq.sound ? '<b style="color:#34d399;">' + esc(eq.sound.name) + '</b>' : '<i style="color:#94a3b8;">None</i>') + '</span>' +
      '<span>🦊 ' + (eq.pack ? '<b>' + esc(eq.pack.name) + '</b>' : '<i style="color:#94a3b8;">None</i>') + '</span>' +
      '<span>🖼️ ' + (eq.plate ? '<b>' + esc(eq.plate.name) + '</b>' : '<i style="color:#94a3b8;">Plain</i>') + '</span></div>';
    return summary + '<div class="cs-avchips">' + chips + '</div><div style="font-size:.8rem;color:#94a3b8;margin-bottom:10px;">' + note + '</div>' +
      '<div class="cs-avgrid" style="grid-template-columns:repeat(auto-fill,minmax(168px,1fr));">' + list.map(function (x) { return extraCard(s, x, bal); }).join('') + '</div>';
  }

  function avatarStudioHtml(s, bal) {
    if (!monstersHidden()) {
      var listM = shopItems(s.id), lvlM = levelOf(s.id);
      return shelvesHtml(listM, bal, lvlM);
    }
    var P = PA();
    if (!P || !P.storeItemIds) return '<div class="cs-glass-card" style="text-align:center;padding:30px;">Loading Avatar Studio…</div>';
    if (P.on && !P.on() && P.load) P.load();
    var items = avItems(s.id);
    var wearing = P.wearingOf ? P.wearingOf(s.id) : {};
    var st = P.styleOf ? P.styleOf(s.id) : { skin: 'auto', tee: '#22c55e', stance: 'stand', gender: 'boy' };
    var pLvl = P.pupilLevel ? P.pupilLevel(s.id) : levelOf(s.id);
    if (avTryId && !items.some(function (x) { return x.id === avTryId; })) avTryId = '';
    var tryX = avTryId ? P.itemInfo(avTryId) : null;
    var tryState = tryX ? avState(s.id, tryX.id) : '';

    // Left Stage: Emotions, Stance, Girl/Boy Identity, Skin & Tee Swatches, Active Wearing Chips, Try-On Action
    var emoRow = '<div class="cs-ctrl-row">' +
      [['smile', '🙂 Smile'], ['laugh', '😄 Laugh'], ['wink', '😉 Wink']].map(function (e) {
        return '<button type="button" class="cs-pose-btn' + (avEmotion === e[0] ? ' on' : '') + '" onclick="ClassroomStore.ui.avEmotion(\'' + e[0] + '\')">' + e[1] + '</button>';
      }).join('') + '</div>';

    var stanceList = (P.stances && P.stances.length) ? P.stances : [{ id: 'stand', label: '🧍 Stand' }, { id: 'wave', label: '👋 Wave' }, { id: 'cheer', label: '🎉 Cheer' }];
    var stanceRow = '<div class="cs-ctrl-row">' + stanceList.map(function (sp) {
      return '<button type="button" class="cs-pose-btn' + (st.stance === sp.id ? ' on' : '') + '" onclick="ClassroomStore.ui.avSetStyle(\'stance\',\'' + sp.id + '\')">' + sp.label + '</button>';
    }).join('') + '</div>';

    var idRow = '<div class="cs-ctrl-row">' +
      '<button type="button" class="cs-pose-btn id-girl' + (st.gender === 'girl' ? ' on' : '') + '" onclick="ClassroomStore.ui.avSetStyle(\'gender\',\'girl\')" title="Girl body shape &amp; fit">👧 Girl</button>' +
      '<button type="button" class="cs-pose-btn id-boy' + (st.gender === 'boy' ? ' on' : '') + '" onclick="ClassroomStore.ui.avSetStyle(\'gender\',\'boy\')" title="Boy body shape &amp; fit">👦 Boy</button>' +
      '<button type="button" class="cs-pose-btn' + (avColorsOpen ? ' on' : '') + '" onclick="ClassroomStore.ui.avToggleColors()">🎨 Skin &amp; Tee</button>' +
      '<button type="button" class="cs-pose-btn" onclick="ClassroomStore.ui.avSurprise()" title="Random outfit from unlocked closet">🎲 Surprise</button>' +
      '<button type="button" class="cs-pose-btn" onclick="ClassroomStore.ui.avReset()" title="Plain tee &amp; starter bottoms">🧹 Plain</button>' +
      '</div>';

    var colorTray = '';
    if (avColorsOpen) {
      var tones = P.tones || [{ id: 'auto', label: 'Match Face' }, { id: 'light', label: 'Light' }, { id: 'medium', label: 'Medium' }, { id: 'tan', label: 'Tan' }, { id: 'dark', label: 'Deep' }];
      var tees = P.tees || ['#ef4444', '#f97316', '#facc15', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];
      colorTray = '<div class="cs-swtray">' +
        '<div class="cs-swtray-lbl">Skin Tone</div><div class="cs-swrow">' +
        tones.map(function (t) {
          var bg = P.toneBg ? P.toneBg(t.id) : '#d08e66';
          var on = (st.skin || 'auto') === t.id;
          return '<button type="button" class="cs-swatch round' + (on ? ' on' : '') + '" style="background:' + bg + ';" title="' + esc(t.label) + '" onclick="ClassroomStore.ui.avSetStyle(\'skin\',\'' + t.id + '\')"></button>';
        }).join('') + '</div>' +
        '<div class="cs-swtray-lbl">Shirt Colour (shown when no jacket/costume is worn)</div><div class="cs-swrow" style="margin-bottom:0;">' +
        tees.map(function (hex) {
          var on = String(st.tee || '').toLowerCase() === String(hex).toLowerCase();
          return '<button type="button" class="cs-swatch' + (on ? ' on' : '') + '" style="background:' + hex + ';" title="' + esc(hex) + '" onclick="ClassroomStore.ui.avSetStyle(\'tee\',\'' + hex + '\')"></button>';
        }).join('') + '</div></div>';
    }

    var wearSlots = ['clothing', 'legs', 'shoes', 'hat', 'wig', 'glasses', 'backpack', 'neck', 'accessory', 'aura', 'pet'];
    var wearChips = [];
    wearSlots.forEach(function (sl) {
      var iid = wearing[sl];
      if (!iid || iid === 'none') return;
      var inf = P.itemInfo(iid);
      wearChips.push('<span class="cs-wchip">' + esc(inf ? inf.name : iid) + '<button type="button" class="cs-wchip-x" title="Take off" onclick="ClassroomStore.ui.avWear(\'' + esc(iid) + '\',false,\'' + sl + '\')">✕</button></span>');
    });
    var wearingHtml = '<div class="cs-wearing-box"><div class="cs-swtray-lbl" style="margin-bottom:2px;">Wearing Now (' + wearChips.length + ')</div>' +
      (wearChips.length ? '<div class="cs-wchips">' + wearChips.join('') + '</div>' : '<div style="font-size:.76rem;color:#94a3b8;">Plain shirt &amp; jeans — tap any item on the right!</div>') + '</div>';

    var tryBar = '';
    if (tryX) {
      var p2 = avPrice(tryX), isWorn = wearing[tryX.slot] === tryX.id, actBtn = '';
      if (tryState === 'shop') {
        actBtn = btn(bal >= p2 ? '🪙 Buy & Wear (' + p2 + ')' : 'Need ' + (p2 - bal) + ' more coins', "ClassroomStore.ui.avBuy('" + tryX.id + "')", 'gold', bal < p2);
      } else {
        actBtn = isWorn ? btn('✕ Take Off', "ClassroomStore.ui.avWear('" + tryX.id + "',false,'" + tryX.slot + "')", 'ghost') : btn('👕 Wear Now', "ClassroomStore.ui.avWear('" + tryX.id + "',true,'" + tryX.slot + "')", 'ok');
      }
      tryBar = '<div class="cs-avbar"><div class="cs-avbar-name">👀 Trying on: ' + esc(tryX.name) + '</div>' +
        '<div style="font-size:.76rem;color:#cbd5e1;margin:3px 0 8px;">' + esc(RARITY_NAME[tryX.rarity] || 'Everyday') +
        (tryX.free ? ' · Free Starter' : tryState === 'level' ? ' · Unlocked by your Level!' : tryState === 'have' ? ' · In your Closet' : ' · ' + p2 + ' coins') + '</div>' +
        '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">' + actBtn + btn('Done', "ClassroomStore.ui.avTry('')", 'ghost') + '</div></div>';
    }

    // Right Pane: Ownership filter + Slot chips + Item Grid (or Extras Pane)
    var slotChips = AV_SLOTS.filter(function (c) {
      if (c[0] === 'all') return true;
      if (c[0] === 'extras') return !isOff('tabs', 'extras');
      return items.some(function (x) { return x.slot === c[0]; });
    }).map(function (c) {
      return '<button type="button" class="cs-avchip' + (avSlot === c[0] ? ' on' : '') + '" onclick="ClassroomStore.ui.avSlot(\'' + c[0] + '\')">' + c[1] + '</button>';
    }).join('');

    var rightBody = '';
    if (avSlot === 'extras') {
      rightBody = renderExtrasPane(s, bal);
    } else {
      var readyCount = items.filter(function (x) { return avState(s.id, x.id) !== 'shop'; }).length;
      var shopCount = items.length - readyCount;
      var ownPills = '<div class="cs-avFilterRow">' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
          [['all', '✨ All (' + items.length + ')'], ['mine', '🎒 Ready to Wear (' + readyCount + ')'], ['shop', '🛒 Buy with Coins (' + shopCount + ')']].map(function (f) {
            return '<button type="button" class="cs-pose-btn' + (avOwnFilter === f[0] ? ' on' : '') + '" onclick="ClassroomStore.ui.avOwnFilter(\'' + f[0] + '\')">' + f[1] + '</button>';
          }).join('') +
        '</div>' +
        '<div style="font-size:.78rem;color:#94a3b8;font-weight:700;">Tap picture to preview · tap button to wear or buy</div></div>';

      var shown = items.filter(function (x) {
        if (avSlot !== 'all' && x.slot !== avSlot) return false;
        var stX = avState(s.id, x.id);
        if (avOwnFilter === 'mine') return stX !== 'shop';
        if (avOwnFilter === 'shop') return stX === 'shop';
        return true;
      });
      shown.sort(function (a, b) {
        var wa = wearing[a.slot] === a.id ? -1 : 0, wb = wearing[b.slot] === b.id ? -1 : 0;
        if (wa !== wb) return wa - wb;
        var sa = AV_STATE_ORDER[avState(s.id, a.id)] || 0, sb = AV_STATE_ORDER[avState(s.id, b.id)] || 0;
        return (sa - sb) || (avPrice(a) - avPrice(b)) || a.name.localeCompare(b.name);
      });

      var grid = shown.map(function (x) {
        var stX = avState(s.id, x.id), price = avPrice(x), isOn = wearing[x.slot] === x.id;
        var badgeRight = x.free ? '<span class="cs-free-tag">Starter</span>'
          : stX === 'level' ? '<span class="cs-free-tag">Lv Unlock</span>'
          : (stX === 'shop' && P.levelFor && P.levelFor(x.id) && x.slot !== 'pet' ? '<span class="cs-free-tag" style="background:rgba(56,189,248,.16);color:#bae6fd;border-color:rgba(56,189,248,.4);">Free Lv ' + P.levelFor(x.id) + '</span>' : '');
        var actHtml = '';
        if (stX !== 'shop') {
          actHtml = isOn
            ? '<button type="button" class="cs-avcard-act on" onclick="ClassroomStore.ui.avWear(\'' + esc(x.id) + '\',false,\'' + x.slot + '\')">✓ Wearing</button>'
            : '<button type="button" class="cs-avcard-act wear" onclick="ClassroomStore.ui.avWear(\'' + esc(x.id) + '\',true,\'' + x.slot + '\')">👕 Wear</button>';
        } else {
          var canAfford = bal >= price;
          actHtml = '<button type="button" class="cs-avcard-act ' + (canAfford ? 'buy' : 'short') + '" onclick="ClassroomStore.ui.avBuy(\'' + esc(x.id) + '\')">' +
            (canAfford ? '🪙 Buy ' + price : '🪙 ' + price + ' (need ' + (price - bal) + ')') + '</button>';
        }
        return '<div class="cs-avcard' + (avTryId === x.id ? ' sel' : '') + '" style="--rc:' + (RARITY_COLOR[x.rarity] || '#64748b') + ';">' +
          '<span class="cs-rar">' + esc(RARITY_NAME[x.rarity] || 'Everyday') + '</span>' + badgeRight +
          '<button type="button" class="cs-avcard-pic" onclick="ClassroomStore.ui.avTry(\'' + esc(x.id) + '\')" title="Preview on ' + firstName(s) + '">' +
            '<img src="' + esc(avTrimmed[x.pic] || x.pic) + '" alt="" loading="lazy" onload="ClassroomStore.ui.avTrim(this)" onerror="this.style.visibility=\'hidden\'">' +
            '<b>' + esc(x.name) + '</b></button>' +
          actHtml + '</div>';
      }).join('');

      rightBody = ownPills + (shown.length ? '<div class="cs-avgrid">' + grid + '</div>' : '<div class="cs-glass-card" style="text-align:center;padding:28px;color:#94a3b8;">No items in this filter right now.</div>');
    }

    clearTimeout(avPrevTimer);
    avPrevTimer = setTimeout(function () { avRefreshPreview(s.id); }, 0);

    return '<div class="cs-avwrap">' +
      '<div class="cs-avstage">' +
        '<div class="cs-avstage-hd"><span class="cs-avstage-nm">' + firstName(s) + '</span><div style="display:flex;gap:6px;align-items:center;"><span class="cs-lvl-pill">⭐ Lv ' + pLvl + '</span>' + coinPill(bal) + '</div></div>' +
        '<div class="cs-avstage-in"><img id="cs-av-preview" src="' + esc(P.pictureFor(s.id)) + '" alt="' + firstName(s) + '"><i></i></div>' +
        tryBar + emoRow + stanceRow + idRow + colorTray + wearingHtml +
      '</div>' +
      '<div class="cs-avlist"><div class="cs-avchips">' + slotChips + '</div>' + rightBody + '</div>' +
    '</div>';
  }

  function prizesModeHtml(s, bal) {
    var d = data(), cfg = d.config, w = wallet(s.id);
    var mine = store.getMysteryBoxes ? store.getMysteryBoxes(s.id, false) : [];
    var out = '';

    // 1. Unopened Mystery Boxes banner (if any)
    if (mine.length) {
      out += card(h2('🎁 Unopened Mystery Boxes (' + mine.length + ')', 'Tap a box to open your surprise right now!') +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + mine.map(function (b) {
          var bi = BOX_INFO[b.boxTier] || BOX_INFO.WOODEN;
          return btn(bi.icon + ' Open ' + bi.name, "ClassroomStore.ui.openBox('" + b.id + "')", 'gold');
        }).join('') + '</div>', 'border-color:#f59e0b;');
    }

    // 2. Mystery Boxes Shelf
    if (!isOff('tabs', 'boxes')) {
      var visibleTiers = TIERS.filter(function (t) { return !isOff('boxes', t); });
      if (visibleTiers.length) {
        out += '<div style="margin-bottom:18px;">' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' +
            '<div style="font:800 1.15rem Fraunces,Georgia,serif;color:#f8fafc;">🎁 Mystery Boxes</div>' +
            '<div style="font-size:.8rem;color:#94a3b8;">Every box guarantees a non-duplicate item, board flair, free class pass, or coin jackpot!</div>' +
          '</div>' +
          '<div class="cs-prize-grid">' + visibleTiers.map(function (t) {
            var price = cfg.boxPrices[t], can = bal >= price, bi = BOX_INFO[t];
            return '<div class="cs-prize-card" style="border-color:' + bi.color + ';">' +
              '<div><div style="font-size:2.7rem;line-height:1.1;">' + (root.MysteryBoxArt ? root.MysteryBoxArt(t) : bi.icon) + '</div>' +
              '<div style="font-weight:900;font-size:1.02rem;color:' + bi.text + ';margin-top:4px;">' + bi.name + '</div>' +
              '<div style="font-size:.76rem;color:#cbd5e1;margin:4px 0 10px;">' + bi.blurb + '</div></div>' +
              '<div><div style="margin-bottom:8px;">' + coinPill(price) + '</div>' +
              btn(can ? '🪙 Buy ' + bi.name : 'Need ' + (price - bal) + ' more', "ClassroomStore.ui.buyBox('" + t + "')", can ? 'gold' : 'ghost', !can) + '</div></div>';
          }).join('') + '</div></div>';
      }
    }

    // 3. Shared Class Party Fund (compact dark Cyber-Glass banner)
    if (!isOff('tabs', 'party')) {
      var cid = classOfStudent(s.id), f = fundFor(cid);
      if (f && f.goal) {
        var pct = Math.min(100, Math.round(f.raised / f.goal * 100)), full = f.raised >= f.goal;
        var donors = Object.keys(f.donors || {}).map(function (id) { return { id: id, n: f.donors[id] }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 5);
        out += card('<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;">' +
          '<div style="flex:1;min-width:220px;"><div style="font-weight:900;font-size:1.08rem;color:#fde047;">' + (full ? '🎊 ' : '🎉 ') + 'Class Party Goal: ' + esc(f.name) + '</div>' +
          '<div style="margin:8px 0;background:#0b1222;border-radius:999px;height:18px;overflow:hidden;border:1.5px solid #334155;"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#10b981,#f59e0b,#f43f5e);transition:width .4s;"></div></div>' +
          '<div style="font-size:.82rem;font-weight:800;color:#e5edff;">' + f.raised + ' / ' + f.goal + ' coins (' + pct + '%)' + (donors.length ? ' · Top helpers: ' + donors.map(function (dn) { return esc(studentName(dn.id).split(' ')[0]) + ' (' + dn.n + ')'; }).join(', ') : '') + '</div></div>' +
          (full ? '<span class="cs-coin-pill" style="font-size:.9rem;padding:6px 14px;">🎊 GOAL REACHED!</span>'
            : '<div style="display:flex;gap:6px;flex-wrap:wrap;">' + [5, 10, 25].map(function (n) { return btn('Donate ' + n + ' 🪙', 'ClassroomStore.ui.donate(' + n + ')', 'ok', bal < n); }).join('') + '</div>') +
        '</div>');
      }
    }

    // 4. Real Classroom Prizes & Privileges
    if (!isOff('tabs', 'rewards')) {
      var activePrivs = cfg.privileges.filter(function (p) { return p.active; });
      out += '<div style="margin-top:6px;">' +
        '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' +
          '<div style="font:800 1.15rem Fraunces,Georgia,serif;color:#f8fafc;">⭐ Real Prizes &amp; Classroom Passes</div>' +
          '<div style="font-size:.8rem;color:#94a3b8;">Your teacher approves each request — if declined, coins return automatically.</div>' +
        '</div>' +
        '<div class="cs-prize-grid">' + activePrivs.map(function (p) {
          var used = usedThisWeek(s.id, p.id), left = p.weeklyLimit ? Math.max(0, p.weeklyLimit - used) : 99, can = bal >= p.price && left > 0;
          var visual = p.image
            ? '<div style="position:relative;height:132px;margin:-4px -4px 8px;border-radius:12px;overflow:hidden;background:#060911;"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
              (p.badge ? '<span style="position:absolute;top:6px;left:6px;background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-size:.64rem;font-weight:900;padding:2px 8px;border-radius:999px;">' + esc(p.badge) + '</span>' : '') + '</div>'
            : '<div style="font-size:2.4rem;margin:6px 0;">' + esc(p.icon) + '</div>';
          return '<div class="cs-prize-card' + (p.image ? ' real' : '') + '"><div>' + visual +
            '<div style="font-weight:900;margin:4px 0 6px;color:#f8fafc;font-size:.9rem;line-height:1.25;">' + esc(p.name) + '</div></div>' +
            '<div>' + coinPill(p.price) +
            '<div style="font-size:.72rem;color:#94a3b8;margin:5px 0;">' + (p.weeklyLimit ? left + ' left this week' : 'Unlimited') + '</div>' +
            btn(left <= 0 ? 'Used this week' : (bal < p.price ? 'Need ' + (p.price - bal) + ' more' : '🙋 Ask Teacher'), "ClassroomStore.ui.request('" + p.id + "')", can ? 'ok' : 'ghost', !can) + '</div></div>';
        }).join('') + '</div></div>';
    }

    // 5. Collapsible Recent Orders & Coin Ledger
    var reqs = d.requests.filter(function (r) { return r.studentId === s.id; });
    var buys = d.purchases.filter(function (p) { return p.studentId === s.id; });
    var STAT = { pending: '⏳ Waiting for teacher', approved: '✅ Approved!', declined: '↩️ Declined (refunded)', used: '✔️ Completed' };
    out += '<details class="cs-fold"><summary><span>🧾 ' + firstName(s) + '’s Recent Orders, Requests &amp; Coin History (' + (reqs.length + buys.length) + ')</span></summary>' +
      '<div style="padding:0 18px 16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;">' +
        '<div><div style="font-weight:800;font-size:.82rem;color:#38bdf8;margin-bottom:6px;">Reward Requests</div>' +
          (reqs.length ? reqs.slice(0, 10).map(function (r) { return '<div class="cs-row-line"><span>' + esc(r.icon) + '</span><span style="flex:1;font-size:.83rem;">' + esc(r.name) + '</span><b style="font-size:.76rem;color:#fde047;">' + (STAT[r.status] || r.status) + '</b></div>'; }).join('') : '<div style="font-size:.8rem;color:#94a3b8;">No requests yet.</div>') + '</div>' +
        '<div><div style="font-weight:800;font-size:.82rem;color:#34d399;margin-bottom:6px;">Items Bought</div>' +
          (buys.length ? buys.slice(0, 10).map(function (p) { return '<div class="cs-row-line"><span>' + esc(p.icon) + '</span><span style="flex:1;font-size:.83rem;">' + esc(p.name) + '</span>' + coinPill(p.price) + (p.status === 'refunded' ? '<i style="font-size:.72rem;color:#94a3b8;">refunded</i>' : '') + '</div>'; }).join('') : '<div style="font-size:.8rem;color:#94a3b8;">Nothing bought yet.</div>') + '</div>' +
        '<div><div style="font-weight:800;font-size:.82rem;color:#fbbf24;margin-bottom:6px;">Coin Ledger</div>' +
          (w.ledger.length ? w.ledger.slice(0, 10).map(function (l) { return '<div class="cs-row-line"><span style="flex:1;font-size:.8rem;color:#cbd5e1;">' + esc(l.reason) + '</span><b style="color:' + (l.delta >= 0 ? '#4ade80' : '#fb7185') + ';">' + (l.delta >= 0 ? '+' : '') + l.delta + '</b></div>'; }).join('') : '<div style="font-size:.8rem;color:#94a3b8;">1 coin earned per ' + cfg.coinsPerXp + ' XP.</div>') + '</div>' +
      '</div></details>';

    return out;
  }

  root.renderBoxTierCardsHtml = function () {
    var cfg = data().config;
    function pct(t, k) { var f = BOX_ODDS[t].filter(function (r) { return r[0] === k; })[0]; return f ? f[1] : 0; }
    return '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:14px; margin-bottom:24px;">' + TIERS.map(function (t) {
      var i = BOX_INFO[t], rar = BOX_RARITY[t].map(function (r) { return r[1] + '% ' + r[0]; }).join(' / ');
      return '<div style="background:linear-gradient(135deg, rgba(15,23,42,0.55), rgba(30,41,59,0.55)); border:1.5px solid ' + i.color + '; border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">' +
        '<div><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><span style="font-size:2.2rem;">' + i.icon + '</span><span class="box-tier-pill ' + i.pill + '">' + i.name.toUpperCase() + '</span></div>' +
        '<div style="font-weight:900; font-size:1rem; color:' + i.text + '; margin-bottom:4px;">' + i.title + '</div>' +
        '<p style="font-size:0.78rem; color:#cbd5e1; margin:0 0 10px 0; line-height:1.35;">' + i.blurb + '</p>' +
        '<div style="background:rgba(0,0,0,0.3); border-radius:8px; padding:8px; font-size:0.74rem; margin-bottom:10px; color:#e2e8f0; line-height:1.55;">' +
        '👕 Avatar item <b>' + pct(t, 'item') + '%</b> (' + rar + ')<br>✨ Sound / title / animal / plate <b>' + pct(t, 'extra') + '%</b><br>🎟️ Free class reward <b>' + pct(t, 'voucher') + '%</b><br>🪙 Coins <b>' + pct(t, 'coins') + '%</b> (' + boxCoins(t)[0] + ' to ' + boxCoins(t)[1] + ')<br>💎 Jackpot <b>' + pct(t, 'jackpot') + '%</b><br>Price in the shop: <b>' + cfg.boxPrices[t] + ' coins</b></div></div>' +
        '<div style="display:flex; gap:6px;"><button type="button" class="btn-3d btn-3d-secondary" onclick="window.handleGrantClassMysteryBox(\'' + t + '\')" style="flex:1; font-size:0.74rem; padding:6px 8px;">+ Class Grant</button>' +
        '<button type="button" class="btn-3d btn-3d-primary" onclick="window.handleTestTierUnboxing(\'' + t + '\')" style="font-size:0.74rem; padding:6px 10px;">🎁 Demo Open</button></div></div>';
    }).join('') + '</div>';
  };

  // ---------------------------------------------------------------- UI actions
  var studioModeHold = false;
  var teacherGroup = 'approvals', teacherTab = 'prices', histPupil = 'all', histKind = 'buys';

  function activeStudentId() {
    var role = store.getRole ? store.getRole() : 'teacher';
    if (role !== 'student' && shopStudentId) return shopStudentId;
    var s = store.getActiveStudent ? store.getActiveStudent() : null;
    return s ? s.id : null;
  }
  function confirm(title, message, confirmText, fn) {
    if (root.confirmAction) root.confirmAction({ title: title, message: message, confirmText: confirmText, isDanger: false, onConfirm: fn });
    else if (root.confirm && root.confirm(title + '\n' + message)) fn();
  }
  var ui = {
    openStudio: function (opts) {
      opts = opts || {};
      try {
        var doc = root.document;
        if (doc) {
          ['pa-ov', 'cb-pop'].forEach(function (id) { var el = doc.getElementById(id); if (el) el.remove(); });
          doc.querySelectorAll('.cb-flagm,.cb-grp').forEach(function (el) { el.remove(); });
        }
      } catch (e) {}
      try { if (root.closeModal) root.closeModal('modal-student-detail'); } catch (e2) {}
      if (opts.cls && opts.cls.id && store.setActiveClass) store.setActiveClass(opts.cls.id);
      if (opts.pick) {
        var pStu = store.getStudent ? store.getStudent(opts.pick) : null;
        if (pStu && pStu.classId && store.setActiveClass) {
          var curC = store.getActiveClass ? store.getActiveClass() : null;
          if (!curC || curC.id !== pStu.classId) store.setActiveClass(pStu.classId);
        }
        shopStudentId = opts.pick;
        if (store.setActiveStudent) store.setActiveStudent(opts.pick);
      }
      avTryId = '';
      avEmotion = 'smile';
      if (opts.slot) avSlot = opts.slot;
      var m = opts.mode || (opts.tab === 'review' ? 'teacher' : 'avatar');
      if (m === 'teacher' && inClassMode()) m = 'avatar';
      studioMode = m;
      if (m === 'teacher' && opts.tab === 'review') teacherGroup = 'approvals';
      studioModeHold = true;
      var targetView = (m === 'teacher') ? 'store-teacher' : 'store-pupil';
      if (root.switchView) root.switchView(targetView);
      else rerender();
    },
    mode: function (m) {
      if (m === 'teacher' && inClassMode()) m = 'avatar';
      studioMode = m || 'avatar';
      studioModeHold = true;
      rerender();
    },
    tGroup: function (g) { teacherGroup = g || 'approvals'; studioMode = 'teacher'; studioModeHold = true; rerender(); },
    toggleDrawer: function () { studioMode = (studioMode === 'teacher') ? 'avatar' : 'teacher'; studioModeHold = true; rerender(); },
    openDrawer: function () { if (!inClassMode()) { studioMode = 'teacher'; studioModeHold = true; } rerender(); },
    pickStudent: function (sid) {
      var pStu = sid && store.getStudent ? store.getStudent(sid) : null;
      if (pStu && pStu.classId && store.setActiveClass) {
        var curC = store.getActiveClass ? store.getActiveClass() : null;
        if (!curC || curC.id !== pStu.classId) store.setActiveClass(pStu.classId);
      }
      shopStudentId = sid; avTryId = ''; avEmotion = 'smile';
      if (store.setActiveStudent) store.setActiveStudent(sid);
      studioModeHold = true;
      rerender();
    },
    pick: function (sid) { return ui.pickStudent(sid); },
    tab: function (t) {
      studentTab = t;
      if (t === 'boxes' || t === 'party' || t === 'rewards' || t === 'orders') studioMode = 'prizes';
      else { studioMode = 'avatar'; if (t === 'extras') avSlot = 'extras'; }
      studioModeHold = true;
      rerender();
    },
    avSlot: function (k) { avSlot = k; studioModeHold = true; rerender(); },
    avOwnFilter: function (f) { avOwnFilter = f || 'all'; studioModeHold = true; rerender(); },
    avEmotion: function (e) {
      avEmotion = e || 'smile';
      studioModeHold = true;
      rerender();
    },
    avToggleColors: function () { avColorsOpen = !avColorsOpen; studioModeHold = true; rerender(); },
    avSetStyle: function (k, v) {
      var sid = activeStudentId(), P = PA();
      if (!sid || !P || !P.setStyle) return;
      var patch = {}; patch[k] = v;
      if (k === 'stance') avEmotion = 'smile';
      studioModeHold = true;
      P.setStyle(sid, patch).then(function () { studioModeHold = true; rerender(); });
    },
    avSurprise: function () {
      var sid = activeStudentId(), P = PA();
      if (!sid || !P || !P.surpriseMe) return;
      avTryId = ''; avEmotion = 'smile'; studioModeHold = true;
      P.surpriseMe(sid).then(function () { notify('🎲 New outfit on!'); studioModeHold = true; rerender(); });
    },
    avReset: function () {
      var sid = activeStudentId(), P = PA();
      if (!sid || !P || !P.resetLook) return;
      avTryId = ''; avEmotion = 'smile'; studioModeHold = true;
      P.resetLook(sid).then(function () { notify('🧹 Back to starter outfit.'); studioModeHold = true; rerender(); });
    },
    avTrim: function (im) {
      try {
        if (!im || im.__trim || /^data:/.test(im.src)) return;
        im.__trim = 1;
        var key = im.getAttribute('src'), W = im.naturalWidth, H = im.naturalHeight; if (!W || !H) return;
        if (avTrimmed[key]) { im.src = avTrimmed[key]; return; }
        var c = document.createElement('canvas'); c.width = W; c.height = H;
        var g = c.getContext('2d'); g.drawImage(im, 0, 0);
        var d = g.getImageData(0, 0, W, H).data, x0 = W, y0 = H, x1 = -1, y1 = -1;
        for (var y = 0; y < H; y += 2) for (var x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (x1 < 0) return;
        var bw = x1 - x0 + 1, bh = y1 - y0 + 1;
        if (bw * bh > W * H * 0.45) { avTrimmed[key] = key; return; }
        var pad = Math.round(Math.max(bw, bh) * 0.08), side = Math.max(bw, bh) + pad * 2;
        var o = document.createElement('canvas'); o.width = side; o.height = side;
        o.getContext('2d').drawImage(c, x0, y0, bw, bh, Math.round((side - bw) / 2), Math.round((side - bh) / 2), bw, bh);
        avTrimmed[key] = o.toDataURL('image/png'); im.src = avTrimmed[key];
      } catch (e) { /* keep the full picture */ }
    },
    giftBox: function (tier) {
      var P = renderTeacher(null, 'parts'), sel = root.document && document.getElementById('cs-gift-target');
      var ids = giveTargets(sel ? sel.value : 'class', P.cls, P.students);
      if (!ids.length) { notify('Pick who gets the box', 'error'); return; }
      confirm('Gift a ' + BOX_INFO[tier].name + '?', ids.length + (ids.length === 1 ? ' pupil gets' : ' pupils get') + ' a free box to open in the shop.', 'Gift it', function () {
        var n = giftBoxes(ids, tier); notify('🎁 Gifted ' + n + ' ' + BOX_INFO[tier].name + (n === 1 ? '' : 'es') + '!'); studioModeHold = true; rerender();
      });
    },
    avTry: function (id) { avTryId = (avTryId === id ? '' : (id || '')); studioModeHold = true; rerender(); },
    avBuy: function (id) {
      var sid = activeStudentId(), P = PA(), x = P && P.itemInfo ? P.itemInfo(id) : null; if (!sid || !x) return;
      var pr = avPrice(x), bal = balance(sid);
      if (bal < pr) { avTryId = id; notify('Need ' + (pr - bal) + ' more coins — previewing on ' + studentName(sid).split(' ')[0] + '!', 'info'); studioModeHold = true; rerender(); return; }
      confirm('Buy ' + x.name + '?', 'It costs ' + pr + ' coins. You have ' + bal + '.', 'Buy & Wear', function () {
        var r = buyAvatar(sid, id);
        notify(r.success ? 'You bought ' + r.item.name + '! Wearing it now.' : r.error, r.success ? 'success' : 'error');
        studioModeHold = true;
        if (r.success) {
          avTryId = '';
          try { if (root.classSoundboard && root.classSoundboard.playCoinReward) root.classSoundboard.playCoinReward(); } catch (e) { /* optional */ }
          P.wearItem(sid, id, x.slot).then(function () { studioModeHold = true; rerender(); });
        } else rerender();
      });
    },
    avWear: function (id, on, slot) {
      var sid = activeStudentId(), P = PA(), x = (id && P && P.itemInfo) ? P.itemInfo(id) : null;
      var sl = slot || (x && x.slot) || '';
      if (!sid || !P || !sl) return;
      if (on && id && avState(sid, id) === 'shop') { notify('Buy it first!', 'error'); return; }
      studioModeHold = true;
      P.wearItem(sid, on ? id : null, sl).then(function () {
        notify(on && x ? 'Now wearing ' + x.name + '!' : 'Taken off.');
        if (!on && avTryId === id) avTryId = '';
        studioModeHold = true;
        rerender();
      });
    },
    avApprove: function (sid) { var P = PA(); if (P && P._approve) { studioModeHold = true; P._approve(sid); setTimeout(function () { studioModeHold = true; rerender(); }, 180); } },
    avReject: function (sid) { var P = PA(); if (P && P._reject) { studioModeHold = true; P._reject(sid); setTimeout(function () { studioModeHold = true; rerender(); }, 180); } },
    avLockToggle: function () { var P = PA(); if (P && P._toggleLockMode) { studioModeHold = true; P._toggleLockMode(); setTimeout(function () { studioModeHold = true; rerender(); }, 80); } },
    extraKind: function (k) { extraKind = k; studioModeHold = true; rerender(); },
    previewSound: function (id) { if (root.ClassroomCosmetics) root.ClassroomCosmetics.playSound(id); },
    buyExtra: function (id) {
      var sid = activeStudentId(), x = findExtra(id); if (!sid || !x) return;
      confirm('Buy ' + x.name + '?', 'It costs ' + extraPrice(x) + ' coins. You have ' + balance(sid) + '.', 'Buy', function () {
        var r = buyExtra(sid, id); notify(r.success ? 'You bought ' + r.item.name + '! Equipped right away.' : r.error, r.success ? 'success' : 'error');
        if (r.success && x.kind === 'sound' && root.ClassroomCosmetics) root.ClassroomCosmetics.playSound(id);
        studioModeHold = true; rerender();
      });
    },
    equip: function (kind, id) {
      var sid = activeStudentId(); if (!sid) return;
      var r = equipExtra(sid, kind, id); notify(r.success ? (id ? 'Equipped!' : 'Removed.') : r.error, r.success ? 'success' : 'error');
      if (r.success && id && kind === 'sound' && root.ClassroomCosmetics) root.ClassroomCosmetics.playSound(id);
      studioModeHold = true; rerender();
    },
    donate: function (n) {
      var sid = activeStudentId(); if (!sid) return;
      var r = donate(sid, n); notify(r.success ? (r.full ? 'The fund is FULL! Thank you! 🎉' : 'Thank you! You gave ' + r.amount + ' coins.') : r.error, r.success ? 'success' : 'error');
      studioModeHold = true; rerender();
    },
    setFund: function (classId) {
      var nm = document.getElementById('cs-fund-name'), gl = document.getElementById('cs-fund-goal');
      var r = setFund(classId, nm ? nm.value : '', gl ? gl.value : 0); notify(r.success ? 'Party fund saved' : r.error, r.success ? 'success' : 'error');
      studioModeHold = true; rerender();
    },
    resetFund: function (classId) { confirm('Start the fund again?', 'The coins already given stay spent. The bar goes back to zero.', 'Reset', function () { resetFund(classId); studioModeHold = true; rerender(); }); },
    filter: function (c) { itemFilter = c; studioModeHold = true; rerender(); },
    tryOn: function (itemId) {
      var id = activeStudentId(), item = findItem(itemId); if (!id || !item) return;
      var price = itemPrice(item), bal = balance(id), lvl = levelOf(id), locked = lvl < shopLevel(item), mon = tryOnHtml(id, item);
      var o = document.createElement('div'); o.className = 'cs-try-ovl';
      o.innerHTML = '<div class="cs-try-card" style="--rc:' + (RARITY_COLOR[item.rarity] || '#64748b') + ';"><div style="font-weight:900;font-size:1.15rem;margin-bottom:6px;">' + esc(item.name) + '</div>' +
        '<div class="cs-try-mon" style="background:radial-gradient(circle at 50% 55%,color-mix(in srgb,var(--rc) 30%,transparent) 0%,transparent 65%),url(assets/store/shop_stage.webp) center/cover no-repeat;">' + (mon || itemPicHtml(item)) + '</div>' +
        '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px;">' + (locked ? '<span class="monster-item-lock-pill">' + (isLevelReward(item) ? '🎁 Free at level ' : '🔒 Level ') + shopLevel(item) + '</span>' : btn(bal >= price ? 'Buy for 🪙 ' + price : 'Need ' + (price - bal) + ' more', "this.closest('.cs-try-ovl').remove();ClassroomStore.ui.buyItem('" + item.id + "')", 'ok', bal < price)) +
        btn('Close', "this.closest('.cs-try-ovl').remove()", 'ghost') + '</div></div>';
      o.addEventListener('click', function (e) { if (e.target === o) o.remove(); });
      document.body.appendChild(o);
    },
    buyItem: function (itemId) {
      var id = activeStudentId(), item = findItem(itemId); if (!id || !item) return;
      confirm('Buy ' + item.name + '?', 'It costs ' + itemPrice(item) + ' coins. You have ' + balance(id) + '.', 'Buy', function () {
        var r = buyItem(id, itemId); notify(r.success ? 'You bought ' + r.item.name + '!' : r.error, r.success ? 'success' : 'error'); studioModeHold = true; rerender();
      });
    },
    buyBox: function (tier) {
      var id = activeStudentId(); if (!id) return;
      confirm('Buy a ' + BOX_INFO[tier].name + '?', 'It costs ' + data().config.boxPrices[tier] + ' coins.', 'Buy', function () {
        var r = buyBox(id, tier); notify(r.success ? 'Box bought! Open it right at the top.' : r.error, r.success ? 'success' : 'error'); studioMode = 'prizes'; studioModeHold = true; rerender();
      });
    },
    openBox: function (boxId) { var id = activeStudentId(); if (root.openMysteryBoxModal) root.openMysteryBoxModal(boxId, id, { onClose: function () { studioModeHold = true; rerender(); } }); else notify('Mystery box viewer is not loaded', 'error'); },
    request: function (privId) {
      var id = activeStudentId(), p = privilege(privId); if (!id || !p) return;
      confirm('Ask for: ' + p.name + '?', 'It costs ' + p.price + ' coins. Your teacher will say yes or no. If no, you get the coins back.', 'Ask', function () {
        var r = requestPrivilege(id, privId); notify(r.success ? 'Request sent to your teacher!' : r.error, r.success ? 'success' : 'error'); studioModeHold = true; rerender();
      });
    },
    decide: function (rid, status) { var r = decide(rid, status); notify(r.success ? (status === 'approved' ? 'Approved' : 'Marked as used') : r.error, r.success ? 'success' : 'error'); studioModeHold = true; rerender(); },
    decline: function (rid) {
      var note = root.prompt ? root.prompt('Reason for the student (optional):', '') : '';
      if (note === null) return;
      var r = decide(rid, 'declined', note || ''); notify(r.success ? 'Declined. Coins given back.' : r.error, r.success ? 'success' : 'error'); studioModeHold = true; rerender();
    },
    give: function (sid, n) { var r = grant(sid, n); notify(r.success ? (r.amount > 0 ? 'Gave ' + r.amount + ' coins' : 'Took ' + (-r.amount) + ' coins') : r.error, r.success ? 'success' : 'error'); studioModeHold = true; rerender(); },
    cleanUnearned: function () {
      confirm('Remove items nobody earned?', 'Automatic and test mystery boxes, the prizes that came out of them (items, titles, name plates, coins) and the free test reward will be removed. XP stays the same. A copy is kept on this device so you can undo.', 'Remove them', function () {
        var n = cleanUnearned(); notify(n ? 'Removed ' + n + ' unearned items.' : 'Nothing to remove.'); studioModeHold = true; rerender();
      });
    },
    undoClean: function () { var ok = undoClean(); notify(ok ? 'Clean-up undone.' : 'No copy found on this device.', ok ? 'success' : 'error'); studioModeHold = true; rerender(); },
    wsName: function (v) { wsName = String(v || '').trim() || 'Revision worksheet'; wsDraft = {}; studioModeHold = true; rerender(); },
    wsPick: function (sid, n) {
      wsDraft[sid] = Math.max(0, Math.min(10, Math.round(Number(n) || 0)));
      var el = root.document && root.document.getElementById('cs-ws-' + sid); if (el) el.innerHTML = wsRowHtml(sid);
      var c = root.document && root.document.getElementById('cs-ws-count'); if (c) { var k = Object.keys(wsDraft).length; c.textContent = k + (k === 1 ? ' score picked' : ' scores picked'); }
    },
    wsClear: function () { wsDraft = {}; studioModeHold = true; rerender(); },
    wsGive: function () {
      var ids = Object.keys(wsDraft); if (!ids.length) { notify('Pick a score for at least one pupil first.', 'error'); return; }
      var w = data().worksheets, id = wsId();
      if (!w[id]) w[id] = { name: wsName, scores: {}, created: new Date().toISOString() };
      var given = 0, coins = 0;
      ids.forEach(function (sid) {
        var n = wsDraft[sid], prev = w[id].scores[sid] || 0, diff = n - prev;
        if (diff !== 0) { var r = grant(sid, diff, 'Worksheet: ' + wsName + ' (' + n + '/10)'); if (!r.success) return; coins += r.amount; given++; }
        w[id].scores[sid] = n;
      });
      w[id].updatedAt = new Date().toISOString(); save();
      wsDraft = {}; notify('Worksheet coins saved: ' + given + ' pupils changed, ' + coins + ' coins in total.'); studioModeHold = true; rerender();
    },
    giveCustom: function (sid) {
      var v = root.prompt ? root.prompt('How many coins? Use a minus sign to take coins away (for example -10).', '10') : null;
      if (v === null) return; ui.give(sid, Number(v));
    },
    getTimetable: function () { return data().config.timetable || {}; },
    setTimetable: function (tt) { data().config.timetable = tt || {}; data().config.updatedAt = Date.now(); save(); },
    getCalendar: function () { return data().config.calendar || []; },
    setCalendar: function (list) { data().config.calendar = Array.isArray(list) ? list : []; data().config.updatedAt = Date.now(); save(); },
    getCalendarFlag: function (k) { return !!(data().config.calendarFlags && data().config.calendarFlags[k]); },
    setCalendarFlag: function (k) { var c = data().config; c.calendarFlags = c.calendarFlags || {}; c.calendarFlags[k] = 1; c.updatedAt = Date.now(); save(); },
    getBoardGoal: function (classId) { return data().config.boardGoals[classId] || null; },
    setBoardGoal: function (classId, g) { data().config.boardGoals[classId] = g; data().config.updatedAt = Date.now(); save(); },
    setPrice: function (kind, key, v) { v = Math.max(1, Math.round(Number(v) || 1)); (kind === 'item' ? data().config.itemPrices : data().config.boxPrices)[key] = v; data().config.updatedAt = Date.now(); save(); },
    setPriv: function (id, field, v) {
      var p = privilege(id); if (!p) return;
      p[field] = field === 'active' ? !!v : Math.max(field === 'price' ? 1 : 0, Math.round(Number(v) || 0)); data().config.updatedAt = Date.now(); save();
    },
    removePriv: function (id) {
      confirm('Remove this reward?', 'Students will no longer see it. Past requests are kept.', 'Remove', function () { data().config.privileges = data().config.privileges.filter(function (p) { return p.id !== id; }); data().config.updatedAt = Date.now(); save(); studioModeHold = true; rerender(); });
    },
    addPriv: function () {
      var name = root.prompt ? root.prompt('Name of the new reward (for example: Choose the story):', '') : null; if (!name) return;
      var price = root.prompt ? root.prompt('How many coins?', '50') : null; if (price === null) return;
      data().config.privileges.push({ id: uid('p'), icon: '🎁', name: name.trim(), price: Math.max(1, Math.round(Number(price) || 50)), weeklyLimit: 1, active: true }); data().config.updatedAt = Date.now(); save(); studioModeHold = true; rerender();
    },
    setOff: function (kind, key, v) { var o = data().config.off; if (!o[kind]) o[kind] = {}; if (v) o[kind][key] = 1; else delete o[kind][key]; data().config.updatedAt = Date.now(); save(); notify(v ? 'Closed in the shop' : 'Open in the shop again'); studioModeHold = true; rerender(); },
    tTab: function (t) {
      teacherTab = t;
      studioMode = 'teacher';
      if (t === 'requests') teacherGroup = 'approvals';
      else if (t === 'coins' || t === 'gift' || t === 'worksheet' || t === 'party') teacherGroup = 'coins';
      else teacherGroup = 'prices';
      studioModeHold = true;
      rerender();
    },
    hist: function (k, v) { if (k === 'pupil') histPupil = v; else histKind = v; studioModeHold = true; rerender(); },
    giveTo: function (n) {
      var P = renderTeacher(null, 'parts'), tEl = document.getElementById('cs-give-target'), rEl = document.getElementById('cs-give-reason');
      var ids = giveTargets(tEl ? tEl.value : 'class', P.cls, P.students), why = rEl && rEl.value.trim() ? rEl.value.trim() : '';
      if (!ids.length) { notify('Nobody to give coins to', 'error'); return; }
      if (n === undefined) { var v = root.prompt ? root.prompt('How many coins for each pupil? Use a minus sign to take (for example -10).', '10') : null; if (v === null) return; n = Math.round(Number(v) || 0); }
      if (!n) return;
      function go() { var c = 0; ids.forEach(function (sid) { var r = grant(sid, n, why || null); if (r.success) c++; }); notify((n > 0 ? 'Gave ' + n : 'Took ' + (-n)) + ' coins · ' + c + (c === 1 ? ' pupil' : ' pupils')); studioModeHold = true; rerender(); }
      if (ids.length > 1 || n < 0) confirm((n > 0 ? 'Give ' + n : 'Take ' + (-n)) + ' coins?', ids.length + (ids.length === 1 ? ' pupil' : ' pupils') + (why ? ' · ' + why : ''), n > 0 ? 'Give' : 'Take', go); else go();
    },
    undo: function (pid) {
      confirm('Undo this purchase?', 'The coins go back to the student and the item or unopened box is removed.', 'Undo purchase', function () { var r = undoPurchase(pid); notify(r.success ? 'Purchase undone, coins refunded' : r.error, r.success ? 'success' : 'error'); studioModeHold = true; rerender(); });
    }
  };

  // ---------------------------------------------------------------- Dark Cyber-Glass Teacher Cards & Unified Studio
  function firstName(s) { var n = String(s.firstName || s.name || 'Pupil'); return esc(/^Pupil \d+$/.test(n) ? n : n.split(' ')[0]); }

  function onOffCard() {
    var cats = [['pet', '🐾 Pets'], ['creature', '🐉 Creatures'], ['hat', '🎩 Hats'], ['glasses', '👓 Glasses'], ['accessory', '💍 Accessories'], ['backpack', '🎒 Backpacks'], ['clothing', '👕 Outfits'], ['background', '🌄 Worlds'], ['aura', '✨ Auras'], ['trail', '💫 Trails'], ['body', '🎨 Colours']];
    function sw(kind, key, label) {
      var off = isOff(kind, key);
      return '<label class="cs-sw' + (off ? ' off' : '') + '"><input type="checkbox" ' + (off ? '' : 'checked') + ' onchange="ClassroomStore.ui.setOff(\'' + kind + '\',\'' + key + '\',!this.checked)"> ' + label + '</label>';
    }
    return card(h2('🔛 What is on sale', 'Untick to hide a section in the pupil shop. Pupils keep everything they already own.') +
      '<div style="font-weight:800;font-size:.78rem;color:#94a3b8;margin:4px 0 6px;">Shop sections</div>' +
      SHOP_TABS.map(function (t) { return sw('tabs', t[0], t[1]); }).join('') +
      (monstersHidden() ? '<div style="font-weight:800;font-size:.78rem;color:#94a3b8;margin:10px 0 6px;">Avatar closet categories</div>' +
        AV_SLOTS.filter(function (c) { return c[0] !== 'all' && c[0] !== 'extras'; }).map(function (c) { return sw('cats', 'av-' + c[0], c[1]); }).join('')
      : '<div style="font-weight:800;font-size:.78rem;color:#94a3b8;margin:10px 0 6px;">Monster item groups</div>' +
        cats.map(function (c) { return sw('cats', c[0], c[1]); }).join('')) +
      '<div style="font-weight:800;font-size:.78rem;color:#94a3b8;margin:10px 0 6px;">Mystery boxes</div>' +
      TIERS.map(function (t) { return sw('boxes', t, BOX_INFO[t].icon + ' ' + BOX_INFO[t].name); }).join(''));
  }

  function giveCard(cls, students) {
    var groups = (cls && store.getGroups) ? (store.getGroups(cls.id) || []) : [];
    var opts = '<option value="class">👥 Whole class (' + students.length + ')</option>' +
      groups.map(function (g) { return '<option value="group:' + esc(g.id) + '">🏳️ Team ' + esc(g.name) + ' (' + (g.studentIds || []).length + ')</option>'; }).join('') +
      students.map(function (s) { return '<option value="pupil:' + esc(s.id) + '">🧑‍🎓 ' + esc(studentName(s.id)) + ' (🪙 ' + balance(s.id) + ')</option>'; }).join('');
    return card(h2('🪙 Give or take coins', 'Pick who, add an optional note, then tap a coin button. Balances never go below zero.') +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">' +
        '<label class="cs-field-lbl">Who<select id="cs-give-target" class="cs-dark-inp" style="min-width:240px;">' + opts + '</select></label>' +
        '<label class="cs-field-lbl">Reason (pupils see it)<input id="cs-give-reason" class="cs-dark-inp" type="text" maxlength="50" placeholder="Great speaking teamwork" style="width:230px;"></label>' +
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">' +
        [1, 5, 10, 20].map(function (n) { return btn('+' + n + ' 🪙', 'ClassroomStore.ui.giveTo(' + n + ')', 'ok'); }).join('') +
        [-5, -10].map(function (n) { return btn('−' + (-n), 'ClassroomStore.ui.giveTo(' + n + ')', 'danger'); }).join('') +
        btn('Custom…', 'ClassroomStore.ui.giveTo()', 'ghost') +
      '</div>');
  }

  function giftCard(cls, students) {
    var groups = (cls && store.getGroups) ? (store.getGroups(cls.id) || []) : [];
    var opts = '<option value="class">👥 Whole class (' + students.length + ')</option>' +
      groups.map(function (g) { return '<option value="group:' + esc(g.id) + '">🏳️ Team ' + esc(g.name) + ' (' + (g.studentIds || []).length + ')</option>'; }).join('') +
      students.map(function (s) { return '<option value="pupil:' + esc(s.id) + '">🧑‍🎓 ' + esc(studentName(s.id)) + '</option>'; }).join('');
    var waiting = {};
    (store.state.mysteryBoxes || []).forEach(function (b) { if (!b.isOpened) waiting[b.studentId] = (waiting[b.studentId] || 0) + 1; });
    var list = students.filter(function (s) { return waiting[s.id]; }).map(function (s) { return esc(studentName(s.id)) + ' (' + waiting[s.id] + ')'; });
    return card(h2('🎁 Gift a free Mystery Box', 'Pupils open gifted boxes inside Boxes &amp; Prizes.') +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">' +
        '<label class="cs-field-lbl">Who<select id="cs-gift-target" class="cs-dark-inp" style="min-width:240px;">' + opts + '</select></label>' +
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">' +
        TIERS.map(function (t) { return btn(BOX_INFO[t].icon + ' Gift ' + BOX_INFO[t].name, "ClassroomStore.ui.giftBox('" + t + "')", 'gold'); }).join('') +
      '</div>' +
      '<div style="margin-top:10px;font-size:.8rem;color:#94a3b8;">' + (list.length ? '📦 Waiting to be opened: ' + list.join(', ') : 'No unopened boxes in this class right now.') + '</div>');
  }

  function giftBoxes(ids, tier) {
    var n = 0;
    ids.forEach(function (id) {
      var b = store.grantMysteryBox ? store.grantMysteryBox(id, tier) : null;
      if (b) { b.gift = true; n++; var w = wallet(id); log(w, 0, 'gift', 'Gift from your teacher: ' + BOX_INFO[tier].name); }
    });
    save();
    return n;
  }

  function historyCard(students) {
    var d = data(), ids = {}; students.forEach(function (s) { ids[s.id] = 1; });
    var sel = '<select class="cs-dark-inp" onchange="ClassroomStore.ui.hist(\'pupil\',this.value)"><option value="all">Everyone in class</option>' +
      students.map(function (s) { return '<option value="' + esc(s.id) + '"' + (histPupil === s.id ? ' selected' : '') + '>' + esc(studentName(s.id)) + '</option>'; }).join('') + '</select>';
    var kinds = [['buys', '🛍️ Bought'], ['coins', '🪙 Coins given / taken'], ['all', '📜 Everything']];
    var kb = kinds.map(function (k) { return btn(k[1], "ClassroomStore.ui.hist('kind','" + k[0] + "')", histKind === k[0] ? '' : 'ghost'); }).join(' ');
    function who(id) { return histPupil !== 'all' ? (histPupil === id) : !!ids[id]; }
    var rows = [];
    if (histKind === 'buys') {
      d.purchases.filter(function (p) { return who(p.studentId); }).forEach(function (p) { rows.push({ ts: new Date(p.ts).getTime(), sid: p.studentId, icon: p.icon, text: p.name, n: -p.price, undo: p.status === 'done' ? p.id : null, refunded: p.status !== 'done' }); });
      d.requests.filter(function (r) { return who(r.studentId); }).forEach(function (r) { rows.push({ ts: new Date(r.createdAt).getTime(), sid: r.studentId, icon: r.icon, text: r.name + ' (reward · ' + r.status + ')', n: r.status === 'declined' ? 0 : -r.price }); });
    } else {
      students.forEach(function (s) {
        if (!who(s.id)) return;
        (wallet(s.id).ledger || []).forEach(function (l) {
          if (histKind === 'coins' && ['grant', 'take'].indexOf(l.type) === -1 && !/^Worksheet/.test(l.reason || '')) return;
          rows.push({ ts: l.ts, sid: s.id, icon: l.delta > 0 ? '➕' : '➖', text: l.reason || l.type, n: l.delta });
        });
      });
    }
    rows.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
    var total = rows.length; rows = rows.slice(0, 80);
    return card(h2('🧾 Full Class Ledger', 'Newest first. Undo refunds coins and removes the item or unopened box.') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px;">' + sel + ' ' + kb + '</div>' +
      (rows.length ? rows.map(function (r) {
        return '<div class="cs-row-line" style="font-size:.85rem;">' +
          '<span style="font-size:1.15rem;width:24px;text-align:center;">' + esc(r.icon || '•') + '</span>' +
          '<b style="min-width:120px;color:#f8fafc;">' + esc(studentName(r.sid)) + '</b><span style="flex:1;color:#cbd5e1;">' + esc(r.text) + '</span>' +
          '<span style="font-weight:900;color:' + (r.n > 0 ? '#4ade80' : r.n < 0 ? '#fb7185' : '#94a3b8') + ';">' + (r.n > 0 ? '+' : '') + r.n + '</span>' +
          '<span style="font-size:.74rem;color:#94a3b8;width:105px;text-align:right;">' + when(r.ts) + '</span>' +
          (r.undo ? btn('Undo', "ClassroomStore.ui.undo('" + r.undo + "')", 'ghost') : (r.refunded ? '<span style="font-size:.72rem;color:#94a3b8;">refunded</span>' : '')) + '</div>';
      }).join('') + (total > rows.length ? '<div style="font-size:.78rem;color:#94a3b8;padding-top:6px;">Showing newest 80 of ' + total + '. Pick one pupil to filter.</div>' : '')
        : '<div style="font-size:.85rem;color:#94a3b8;">Nothing logged yet.</div>'));
  }

  function avatarTeacherCard(students) {
    var P = PA();
    if (!P) return '';
    var pendIds = P.pendingIds ? P.pendingIds() : [];
    var lockM = P.lockMode ? P.lockMode() : 'earned';
    var pendHtml = pendIds.length ? '<div style="margin-bottom:14px;"><div style="font-weight:900;color:#fde047;margin-bottom:6px;">⏳ Pupil Avatars Waiting for Approval (' + pendIds.length + ')</div>' +
      pendIds.map(function (pid) {
        return '<div class="cs-row-line"><img src="' + esc(P.pictureFor(pid)) + '" alt="" style="width:46px;height:60px;object-fit:contain;border-radius:8px;background:#060911;">' +
          '<div style="flex:1;font-weight:800;color:#f8fafc;">' + esc(studentName(pid)) + '</div>' +
          btn('✓ Approve', "ClassroomStore.ui.avApprove('" + esc(pid) + "')", 'ok') + ' ' +
          btn('✕ Reject', "ClassroomStore.ui.avReject('" + esc(pid) + "')", 'danger') + '</div>';
      }).join('') + '</div>' : '';

    var controls = '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px;">' +
      btn(lockM === 'earned' ? '🪙 Earned Mode ON (Switch to Free Dress-Up)' : '🔓 Free Dress-Up ON (Switch to Earned Mode)', 'ClassroomStore.ui.avLockToggle()', lockM === 'earned' ? '' : 'gold') +
      '<label class="cs-3d-btn ghost" style="cursor:pointer;">📁 Bulk Upload Head Photos<input type="file" accept="image/*" multiple style="display:none;" onchange="if(window.PupilAvatars&&PupilAvatars._bulkHeads)PupilAvatars._bulkHeads(this)"></label>' +
      '</div>';

    var rosterFaces = '<details class="cs-fold" style="margin-top:6px;"><summary><span>🙂 Pupil 3D Face Photos (' + students.filter(function (s) { return P.hasHead && P.hasHead(s.id); }).length + ' / ' + students.length + ' ready in this class)</span></summary>' +
      '<div style="padding:0 16px 14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:8px;">' +
      students.map(function (s) {
        var ok = P.hasHead ? P.hasHead(s.id) : true;
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding:7px 10px;border-radius:12px;background:#0b1222;border:1px solid ' + (ok ? '#1e293b' : '#f59e0b') + ';">' +
          '<div style="min-width:0;"><div style="font-weight:800;font-size:.8rem;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + firstName(s) + '</div>' +
          '<div style="font-size:.68rem;color:' + (ok ? '#4ade80' : '#fbbf24') + ';">' + (ok ? '✓ Custom face' : '⚠ Demo face') + '</div></div>' +
          '<label class="cs-3d-btn ghost" style="padding:5px 9px;font-size:.72rem;cursor:pointer;">📷<input type="file" accept="image/*" style="display:none;" onchange="if(window.PupilAvatars&&PupilAvatars._head)PupilAvatars._head(\'' + esc(s.id) + '\',this)"></label></div>';
      }).join('') + '</div></details>';

    return card(h2('🧒 Avatar Closet Mode, Approvals &amp; Face Photos', 'Manage Earned vs Free Dress-Up mode, approve pupil-submitted looks, or update 3D head portraits.') + pendHtml + controls + rosterFaces);
  }

  function teacherModeHtml(P) {
    var S = P.sections, cls = P.cls, students = P.students;
    var avPend = (PA() && PA().pendingIds) ? PA().pendingIds().length : 0;
    var reqCount = P.pending.length + avPend;
    var groups = [
      ['approvals', '📬 Approvals & Faces' + (reqCount ? ' (' + reqCount + ')' : '')],
      ['coins', '🪙 Coins, Boxes & Worksheets'],
      ['prices', '🏷️ Prices, Sale Rules & Ledger']
    ];
    var nav = '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px;">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + groups.map(function (g) {
        return '<button type="button" class="cs-avchip' + (teacherGroup === g[0] ? ' on' : '') + '" onclick="ClassroomStore.ui.tGroup(\'' + g[0] + '\')">' + g[1] + '</button>';
      }).join('') + '</div>' +
      '<div id="cs-cloud-status" style="font-size:.78rem;font-weight:800;color:#94a3b8;">' + cloudLabel() + '</div></div>';

    var body = '';
    if (teacherGroup === 'approvals') {
      body = (S.requests || '') + avatarTeacherCard(students) + (S.clean || '');
    } else if (teacherGroup === 'coins') {
      body = giveCard(cls, students) + giftCard(cls, students) + (S.party || '') + (S.worksheet || '') + (S.coins || '');
    } else {
      body = onOffCard() + (S.prices || '') + (S.odds || '') + historyCard(students);
    }
    return nav + body;
  }

  function renderUnifiedStudio(container, defaultMode) {
    ensureStudioStyle();
    try { var cp = root.document && document.getElementById('cb-pop'); if (cp) cp.remove(); } catch (e) {}
    var role = store.getRole ? store.getRole() : 'teacher';
    var isStudentRole = (role === 'student');
    if (!studioModeHold && defaultMode) {
      if (defaultMode === 'teacher' && !inClassMode() && !isStudentRole) studioMode = 'teacher';
      else if (defaultMode === 'pupil' && studioMode === 'teacher') studioMode = 'avatar';
    }
    studioModeHold = false;
    if (studioMode === 'teacher' && (inClassMode() || isStudentRole)) studioMode = 'avatar';

    var P = renderTeacher(null, 'parts');
    var cls = P.cls, students = P.students, cur = P.curStu;
    if (isStudentRole) {
      cur = (store.getActiveStudent ? store.getActiveStudent() : null) || students[0] || null;
    }
    var avPend = (PA() && PA().pendingIds) ? PA().pendingIds().length : 0;
    var badgeN = P.pending.length + avPend;
    var unopenedN = cur && store.getMysteryBoxes ? (store.getMysteryBoxes(cur.id, false) || []).length : 0;

    var modes = [
      ['avatar', '👕 Avatar & Closet'],
      ['prizes', '🎁 Boxes & Prizes' + (unopenedN ? ' (' + unopenedN + ')' : '')]
    ];
    if (!isStudentRole && !inClassMode()) {
      modes.push(['teacher', '⚙️ Teacher' + (badgeN ? ' (' + badgeN + ')' : '')]);
    }

    var topBar = '<div class="cs-studio-top">' +
      (!isStudentRole ? btn('← Class Board', "switchView('board')", 'ghost') : '') +
      '<h1 class="cs-studio-title">🛍️ Avatar Studio &amp; Shop' + (cls && !isStudentRole ? ' · ' + esc(cls.name || cls.id) : '') + '</h1>' +
      '<div class="cs-mode-pills">' + modes.map(function (m) {
        return '<button type="button" class="cs-mode-btn' + (studioMode === m[0] ? ' on' : '') + '" onclick="ClassroomStore.ui.mode(\'' + m[0] + '\')">' + m[1] + '</button>';
      }).join('') + '</div>' +
      (!isStudentRole ? btn('🏆 Podium', "switchView('rewards')", 'ghost') : '') +
    '</div>';

    var rosterStrip = '';
    if (!isStudentRole && studioMode !== 'teacher') {
      rosterStrip = students.length
        ? '<div class="cs-pstrip">' + students.map(function (s) {
            var on = cur && s.id === cur.id;
            return '<button type="button" class="cs-pbtn' + (on ? ' on' : '') + '" onclick="ClassroomStore.ui.pickStudent(\'' + esc(s.id) + '\')"><b>' + firstName(s) + '</b><span>🪙 ' + balance(s.id) + '</span></button>';
          }).join('') + '</div>'
        : '<div class="cs-glass-card" style="text-align:center;">No pupils enrolled in this class yet.</div>';
    }

    var mainBody = '';
    if (studioMode === 'teacher') {
      mainBody = teacherModeHtml(P);
    } else if (!cur) {
      mainBody = '<div class="cs-glass-card" style="text-align:center;padding:32px;">Select a class with pupils to open the Studio.</div>';
    } else if (studioMode === 'prizes') {
      mainBody = prizesModeHtml(cur, balance(cur.id));
    } else {
      mainBody = avatarStudioHtml(cur, balance(cur.id));
    }

    container.innerHTML = '<div class="cs-studio">' + topBar + rosterStrip + mainBody + '</div>';
  }

  function renderStudent(container) {
    renderUnifiedStudio(container, 'pupil');
  }

  function giveTargets(v, cls, students) {
    if (v === 'class') return students.map(function (s) { return s.id; });
    if (v.indexOf('group:') === 0) { var g = store.getGroup ? store.getGroup(v.slice(6)) : null; return g ? (g.studentIds || []) : []; }
    if (v.indexOf('pupil:') === 0) return [v.slice(6)];
    return [];
  }

  root.ClassroomStore = {
    cosmetics: { equipped: equippedExtras, equip: equipExtra, buy: buyExtra, give: giveExtra, owned: extraOwned, entry: cosEntry, find: findExtra, setTitles: setTitleItems },
    fund: { get: fundFor, set: setFund, donate: donate, reset: resetFund },
    itemPic: itemPicHtml, refundRetired: refundRetired,
    avatar: { owns: avOwns, state: avState, buy: buyAvatar, items: avItems, price: avPrice, gift: giftBoxes,
      wear: function (sid, id, slot) { var P = PA(); return P ? P.wearItem(sid, id, slot) : Promise.resolve(false); } },
    openBox: openBox2, BOX_ODDS: BOX_ODDS, TIERS: TIERS, BOX_INFO: BOX_INFO,
    ui: ui, findUnearned: findUnearned, getTimetable: ui.getTimetable, setTimetable: ui.setTimetable, getCalendar: ui.getCalendar, setCalendar: ui.setCalendar, getCalendarFlag: ui.getCalendarFlag, setCalendarFlag: ui.setCalendarFlag, getBoardGoal: ui.getBoardGoal, setBoardGoal: ui.setBoardGoal, data: data, wallet: wallet, balance: balance, grant: grant, buyItem: buyItem, buyBox: buyBox,
    requestPrivilege: requestPrivilege, decide: decide, cloud: { pull: cloudPull, push: cloudPush, bundleFor: bundleFor, adoptDoc: adoptDoc, stampOf: stampOf, id: CLOUD_ID, state: function () { return cloudState; } }, undoPurchase: undoPurchase, shopItems: shopItems, usedThisWeek: usedThisWeek, DEFAULTS: DEFAULTS
  };
  root.__csRefreshStatus = function () { var el = document.getElementById('cs-cloud-status'); if (el) el.textContent = cloudLabel(); };
  root.renderClassroomStoreView = function (container) {
    var role = store.getRole ? store.getRole() : 'teacher';
    if (cloudClient() && Date.now() - lastPull > 30000) cloudPull().then(function (c) { if (c && root.renderCurrentView) root.renderCurrentView(); });
    if (role === 'student') renderStudent(container); else renderUnifiedStudio(container, 'teacher');
  };
  root.renderPupilShopView = function (container) {
    if (cloudClient() && Date.now() - lastPull > 30000) cloudPull().then(function (c) { if (c && root.renderCurrentView) root.renderCurrentView(); });
    renderUnifiedStudio(container, 'pupil');
  };
})(typeof window !== 'undefined' ? window : this);
