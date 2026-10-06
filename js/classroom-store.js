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

  var DEFAULTS = {
    coinsPerXp: 10,
    itemPrices: { common: 25, rare: 60, epic: 120, legendary: 250 },
    boxPrices: { BRONZE: 15, WOODEN: 30, GILDED: 80, CELESTIAL: 180 },
    privileges: [
      { id: 'p-song', icon: '🎵', name: 'Choose the warm-up song', price: 40, weeklyLimit: 2, active: true },
      { id: 'p-seat', icon: '🪑', name: 'Sit anywhere for one lesson', price: 30, weeklyLimit: 2, active: true },
      { id: 'p-helper', icon: '🧑‍🏫', name: "Be the teacher's helper", price: 50, weeklyLimit: 1, active: true },
      { id: 'p-game', icon: '🎲', name: 'Pick the next game', price: 60, weeklyLimit: 1, active: true },
      { id: 'p-dj', icon: '🎧', name: 'Class DJ for 5 minutes', price: 70, weeklyLimit: 1, active: true },
      { id: 'p-sticker', icon: '🌟', name: 'Special sticker', price: 35, weeklyLimit: 2, active: true },
      { id: 'p-hwpass', icon: '🎟️', name: 'Homework pass (one small task)', price: 150, weeklyLimit: 1, active: true }
    ]
  };
  var SELL_CATEGORIES = ['hat', 'glasses', 'accessory', 'backpack', 'clothing', 'background', 'aura', 'body'];
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
  var RARITY_COLOR = { common: '#64748b', rare: '#2563eb', epic: '#7c3aed', legendary: '#d97706' };

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
    if (!c.coinsPerXp) c.coinsPerXp = DEFAULTS.coinsPerXp;
    if (!c.boardGoals || typeof c.boardGoals !== 'object') c.boardGoals = {};
    if (!c.partyFunds || typeof c.partyFunds !== 'object') c.partyFunds = {};
    if (!d.cosmetics || typeof d.cosmetics !== 'object') d.cosmetics = {};
    if (!d.worksheets || typeof d.worksheets !== 'object') d.worksheets = {};
    return d;
  }
  function save() { store.saveState(); store.notify(); schedulePush(); }

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
  function itemPrice(item) { return data().config.itemPrices[item.rarity] || data().config.itemPrices.common; }
  function canSell(item) {
    if (SELL_CATEGORIES.indexOf(item.category) === -1) return false;
    var D = root.MonsterDressUp;
    if (['hat', 'glasses', 'accessory', 'backpack', 'clothing'].indexOf(item.category) !== -1) return root.EAA_ILLUSTRATED_MONSTERS === true ? !!(D && D.supportedItem(item.id)) : true;
    return true;
  }
  /** Items the student cannot use yet, which they can buy now. */
  function shopItems(studentId) {
    return allItems().filter(function (i) { return canSell(i) && !isAvailable(studentId, i); })
      .map(function (i) { return { item: i, price: itemPrice(i), level: reqLevel(i) }; })
      .sort(function (a, b) { return a.price - b.price || a.item.name.localeCompare(b.item.name); });
  }

  function buyItem(studentId, itemId) {
    var item = findItem(itemId);
    if (!item) return { success: false, error: 'Item not found' };
    if (isAvailable(studentId, item)) return { success: false, error: 'You already have this item' };
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
    var all = allItems().filter(function (i) { return canSell(i) && !isAvailable(studentId, i); });
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
    var cap = BOX_VOUCHER_CAP[tier] || 70;
    var pool = data().config.privileges.filter(function (p) { return p.active && p.price <= cap; });
    if (!pool.length) return null;
    var p = pickOne(pool), rid = uid('req'), now = new Date().toISOString();
    data().requests.unshift({ id: rid, studentId: studentId, privilegeId: p.id, name: 'FREE: ' + p.name, icon: p.icon, price: 0, status: 'approved', createdAt: now, decidedAt: now, note: 'Won in a Mystery Box', voucher: true });
    return { type: 'voucher', item: { id: 'voucher', name: 'Free: ' + p.name, category: 'free reward', rarity: tier === 'WOODEN' ? 'rare' : 'epic', icon: p.icon, description: 'Show your teacher. This one is free!' } };
  }
  function rewardCoins(studentId, tier, fixed) {
    var r = BOX_COINS[tier] || BOX_COINS.WOODEN;
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
    else res = rewardItem(studentId, 'legendary') || rewardExtra(studentId, 'legendary') || rewardCoins(studentId, tier, 300);
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
    if (doc.cfg && (doc.cfgAt || 0) > (d.config.updatedAt || 0)) { d.config = doc.cfg; d.config.updatedAt = doc.cfgAt; data(); changed = true; }
    return changed;
  }
  function parseRow(row) { try { return row && row.description ? JSON.parse(row.description) : null; } catch (e) { return null; } }

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
    return map[cloudClient() ? cloudState : 'local'] || map.local;
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
  var studentTab = 'items', itemFilter = 'all';
  // ---- worksheet coins: one score (0 to 10) per pupil, given as coins once; pressing again only fixes the difference
  var wsDraft = {}, wsName = 'Revision worksheet';
  function wsId() { return String(wsName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'worksheet'; }
  function wsGiven(sid) { var w = data().worksheets[wsId()]; return w && w.scores && w.scores[sid] != null ? w.scores[sid] : null; }
  function wsRowHtml(sid) {
    var cur = wsDraft[sid] != null ? wsDraft[sid] : null, given = wsGiven(sid), out = '', n;
    for (n = 0; n <= 10; n++) {
      var on = cur === n;
      out += '<button type="button" onclick="ClassroomStore.ui.wsPick(\'' + sid + '\',' + n + ')" style="min-width:34px;padding:7px 0;margin:0 2px 2px 0;border-radius:9px;font-weight:900;font-size:.85rem;cursor:pointer;border:' + (on ? '2px solid #16a34a' : '1px solid var(--border-light,#cbd5e1)') + ';background:' + (on ? '#16a34a' : 'transparent') + ';color:' + (on ? '#fff' : 'var(--text-main,#0f172a)') + ';">' + n + '</button>';
    }
    return out + (given != null ? ' <span style="font-size:.74rem;font-weight:800;color:#92400e;white-space:nowrap;">✓ ' + given + ' given</span>' : '');
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
    out.total = out.boxes.length + out.items.length + out.titles.length + out.requests.length;
    out.pupils = {}; out.boxes.concat(out.requests).forEach(function (x) { out.pupils[x.studentId] = 1; }); out.items.concat(out.titles).forEach(function (x) { out.pupils[x.studentId] = 1; });
    return out;
  }
  function touchStudent(id) { var d = data(); if (!d.cosmetics[id]) d.cosmetics[id] = { owned: [], equipped: {}, updatedAt: 0 }; d.cosmetics[id].updatedAt = Date.now(); wallet(id); }
  function cleanUnearned() {
    var f = findUnearned(), d = data(); if (!f.total) return 0;
    var backup = { at: new Date().toISOString(), boxes: f.boxes, items: f.items, titles: f.titles, requests: f.requests, profiles: {} };
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
    f.titles.forEach(function (x) { var ce = d.cosmetics[x.studentId]; ce.owned = (ce.owned || []).filter(function (t) { return t !== x.id; }); if (ce.equipped && ce.equipped.title === x.id) delete ce.equipped.title; });
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
    (b.boxes || []).concat(b.requests || []).forEach(function (x) { pupils[x.studentId] = 1; });
    Object.keys(pupils).forEach(touchStudent);
    try { localStorage.removeItem(CLEAN_KEY); } catch (e) { /* ignore */ }
    save(); return true;
  }

  function card(inner, extra) { return '<div style="background:var(--bg-surface,#fff);border:1px solid var(--border-light,#e2e8f0);border-radius:16px;padding:18px;margin-bottom:16px;' + (extra || '') + '">' + inner + '</div>'; }
  function h2(t, sub) { return '<div style="margin-bottom:12px;"><div style="font-size:1.05rem;font-weight:900;color:var(--text-main,#0f172a);">' + t + '</div>' + (sub ? '<div style="font-size:.8rem;color:var(--text-muted,#64748b);margin-top:2px;">' + sub + '</div>' : '') + '</div>'; }
  function btn(label, onclick, kind, disabled) {
    var bg = kind === 'danger' ? '#dc2626' : kind === 'ghost' ? 'transparent' : '#16a34a';
    var color = kind === 'ghost' ? 'var(--text-main,#0f172a)' : '#fff';
    var border = kind === 'ghost' ? '1px solid var(--border-light,#cbd5e1)' : 'none';
    return '<button type="button" ' + (disabled ? 'disabled ' : 'onclick="' + onclick + '" ') + 'style="padding:7px 12px;border-radius:10px;font-weight:800;font-size:.78rem;cursor:' + (disabled ? 'not-allowed' : 'pointer') + ';background:' + bg + ';color:' + color + ';border:' + border + ';opacity:' + (disabled ? .45 : 1) + ';">' + label + '</button>';
  }
  function coinPill(n) { return '<span style="display:inline-flex;align-items:center;gap:4px;background:#fef3c7;color:#92400e;border:1px solid #fcd34d;border-radius:999px;padding:2px 10px;font-weight:900;font-size:.82rem;">🪙 ' + n + '</span>'; }
  function when(ts) { try { return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function studentName(id) { var s = store.getStudent ? store.getStudent(id) : null; return s ? ((s.firstName || '') + ' ' + (s.lastName || '')).trim() : 'Student'; }

  // ---------------------------------------------------------------- UI (teacher)
  function renderTeacher(container) {
    var d = data(), cfg = d.config;
    var cls = store.getActiveClass ? store.getActiveClass() : null;
    var students = (cls && store.getStudentsByClass ? store.getStudentsByClass(cls.id) : (store.getStudents ? store.getStudents() : [])) || [];
    var pending = d.requests.filter(function (r) { return r.status === 'pending'; });
    var approved = d.requests.filter(function (r) { return r.status === 'approved'; });

    var html = '<div style="max-width:980px;margin:0 auto;padding:6px 4px 40px;">' +
      '<div style="margin-bottom:18px;"><div style="font-size:1.6rem;font-weight:900;color:var(--text-main,#0f172a);">🛍️ Classroom Store</div>' +
      '<div style="font-size:.88rem;color:var(--text-muted,#64748b);margin-top:4px;">Students earn <b>1 coin for every ' + cfg.coinsPerXp + ' XP</b> automatically. Coins never reduce XP or monster level. ' +
      'Back-pay: everyone already started with their current XP ÷ ' + cfg.coinsPerXp + '.</div>' +
      '<div id="cs-cloud-status" style="margin-top:6px;font-size:.78rem;font-weight:800;color:var(--text-muted,#64748b);">' + cloudLabel() + '</div></div>';

    // pending requests
    html += card(h2('📬 Reward requests waiting for you (' + pending.length + ')', 'Approve to keep the coins, decline to give them back.') +
      (pending.length ? pending.map(function (r) {
        return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 0;border-top:1px solid var(--border-light,#e2e8f0);">' +
          '<span style="font-size:1.5rem;">' + esc(r.icon) + '</span><div style="flex:1;min-width:200px;"><div style="font-weight:800;color:var(--text-main,#0f172a);">' + esc(r.name) + '</div>' +
          '<div style="font-size:.78rem;color:var(--text-muted,#64748b);">' + esc(studentName(r.studentId)) + ' · ' + when(r.createdAt) + ' · ' + coinPill(r.price) + '</div></div>' +
          btn('✓ Approve', "ClassroomStore.ui.decide('" + r.id + "','approved')") + btn('✕ Decline', "ClassroomStore.ui.decline('" + r.id + "')", 'danger') + '</div>';
      }).join('') : '<div style="font-size:.85rem;color:var(--text-muted,#64748b);">No requests right now.</div>') +
      (approved.length ? '<div style="margin-top:10px;font-weight:800;font-size:.82rem;color:var(--text-main,#0f172a);">Approved, not used yet</div>' + approved.map(function (r) {
        return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--border-light,#e2e8f0);"><span>' + esc(r.icon) + '</span><div style="flex:1;font-size:.85rem;color:var(--text-main,#0f172a);">' + esc(r.name) + ' <span style="color:var(--text-muted,#64748b);">· ' + esc(studentName(r.studentId)) + '</span></div>' + btn('Mark as used', "ClassroomStore.ui.decide('" + r.id + "','used')", 'ghost') + '</div>';
      }).join('') : ''));

    // items nobody earned (old automatic boxes, test leftovers): the teacher removes them with one press
    var unearned = findUnearned(), hasBackup = false; try { hasBackup = !!localStorage.getItem(CLEAN_KEY); } catch (e) { hasBackup = false; }
    if (unearned.total) html += card(h2('🧹 Items nobody earned (' + unearned.total + ')', 'The platform used to give every pupil free mystery boxes on a new device, and a test on 5 October left a title and prizes on Aslıhan. Pupils did not earn these.') +
      '<div style="font-size:.88rem;color:var(--text-main,#0f172a);margin-bottom:10px;">' + unearned.boxes.length + ' mystery boxes · ' + unearned.items.length + ' prizes from boxes · ' + unearned.titles.length + ' title · ' + unearned.requests.length + ' free reward · for ' + Object.keys(unearned.pupils).length + ' pupils. Coins and XP are not touched.</div>' +
      btn('🧹 Remove them', 'ClassroomStore.ui.cleanUnearned()', 'danger'), 'border:2px solid #f59e0b;');
    else if (hasBackup) html += card(h2('🧹 Clean-up done', 'Unearned boxes, prizes and the test title were removed. A copy is kept on this device in case you need it back.') + btn('Undo the clean-up', 'ClassroomStore.ui.undoClean()', 'ghost'));

    // worksheet coins (quick entry)
    html += card(h2('📝 Worksheet coins' + (cls ? ' · ' + esc(cls.name || cls.id) : ''), '1 coin for each correct answer, 0 to 10. Tap a score for every pupil who did the sheet, then press Give coins. Pupils you skip get nothing. Pressing it again only fixes the difference, so nobody is paid twice.') +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px;"><label style="font-size:.75rem;font-weight:800;color:var(--text-muted,#64748b);">Worksheet name<input id="cs-ws-name" type="text" maxlength="40" value="' + esc(wsName) + '" onchange="ClassroomStore.ui.wsName(this.value)" style="display:block;margin-top:3px;padding:7px;border-radius:9px;border:1px solid var(--border-light,#cbd5e1);width:240px;"></label>' +
      '<span id="cs-ws-count" style="font-size:.85rem;font-weight:800;color:var(--text-main,#0f172a);">0 scores picked</span>' + btn('🪙 Give coins', 'ClassroomStore.ui.wsGive()') + btn('Clear', 'ClassroomStore.ui.wsClear()', 'ghost') + '</div>' +
      '<div style="overflow-x:auto;">' + students.map(function (s) {
        return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-top:1px solid var(--border-light,#e2e8f0);flex-wrap:wrap;"><div style="width:130px;font-weight:800;font-size:.85rem;color:var(--text-main,#0f172a);">' + esc(studentName(s.id)) + '</div><div id="cs-ws-' + esc(s.id) + '" style="flex:1;min-width:340px;">' + wsRowHtml(s.id) + '</div></div>';
      }).join('') + '</div>');

    // students & coins
    html += card(h2('🪙 Students and coins' + (cls ? ' · ' + esc(cls.name || cls.id) : ''), 'Use the class menu at the top to switch class.') +
      '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:.85rem;">' +
      '<thead><tr style="text-align:left;color:var(--text-muted,#64748b);"><th style="padding:6px 8px;">Student</th><th style="padding:6px 8px;">XP</th><th style="padding:6px 8px;">Coins</th><th style="padding:6px 8px;">Wearing</th><th style="padding:6px 8px;">Give or take</th></tr></thead><tbody>' +
      students.map(function (s) {
        var xp = store.getStudentTotalXP ? store.getStudentTotalXP(s.id) : 0;
        return '<tr style="border-top:1px solid var(--border-light,#e2e8f0);color:var(--text-main,#0f172a);"><td style="padding:8px;font-weight:800;">' + esc(studentName(s.id)) + '</td><td style="padding:8px;">' + xp + '</td><td style="padding:8px;">' + coinPill(balance(s.id)) + '</td><td style="padding:8px;font-size:.74rem;color:var(--text-muted,#64748b);">' + (function () {
            var e = equippedExtras(s.id), bits = [];
            if (e.title) bits.push('🏷️ ' + esc(e.title.name)); if (e.pack) bits.push(esc(e.pack.icon) + ' ' + esc(e.pack.name)); if (e.plate) bits.push('🖼️ ' + esc(e.plate.name)); if (e.sound) bits.push('🔊 ' + esc(e.sound.name));
            return bits.length ? bits.join(' · ') : '—';
          })() + '</td><td style="padding:8px;white-space:nowrap;">' +
          btn('+5', "ClassroomStore.ui.give('" + s.id + "',5)", 'ghost') + ' ' + btn('+10', "ClassroomStore.ui.give('" + s.id + "',10)", 'ghost') + ' ' + btn('−5', "ClassroomStore.ui.give('" + s.id + "',-5)", 'ghost') + ' ' + btn('Custom…', "ClassroomStore.ui.giveCustom('" + s.id + "')", 'ghost') + '</td></tr>';
      }).join('') + '</tbody></table></div>');

    // settings
    html += card(h2('⚙️ Prices and rewards', 'Change a price and it applies right away.') +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px;">' +
      ['common', 'rare', 'epic', 'legendary'].map(function (k) { return '<label style="font-size:.75rem;font-weight:800;color:var(--text-muted,#64748b);">' + k + ' item<input type="number" min="1" value="' + cfg.itemPrices[k] + '" onchange="ClassroomStore.ui.setPrice(\'item\',\'' + k + '\',this.value)" style="display:block;width:100%;margin-top:3px;padding:6px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>'; }).join('') +
      TIERS.map(function (k) { return '<label style="font-size:.75rem;font-weight:800;color:var(--text-muted,#64748b);">' + BOX_INFO[k].name + '<input type="number" min="1" value="' + cfg.boxPrices[k] + '" onchange="ClassroomStore.ui.setPrice(\'box\',\'' + k + '\',this.value)" style="display:block;width:100%;margin-top:3px;padding:6px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>'; }).join('') + '</div>' +
      cfg.privileges.map(function (p) {
        return '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 0;border-top:1px solid var(--border-light,#e2e8f0);color:var(--text-main,#0f172a);">' +
          '<span style="font-size:1.3rem;">' + esc(p.icon) + '</span><div style="flex:1;min-width:180px;font-weight:800;">' + esc(p.name) + '</div>' +
          '<label style="font-size:.72rem;color:var(--text-muted,#64748b);">coins <input type="number" min="1" value="' + p.price + '" onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'price\',this.value)" style="width:70px;padding:5px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>' +
          '<label style="font-size:.72rem;color:var(--text-muted,#64748b);">per week <input type="number" min="0" value="' + (p.weeklyLimit || 0) + '" onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'weeklyLimit\',this.value)" style="width:60px;padding:5px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>' +
          '<label style="font-size:.78rem;font-weight:700;"><input type="checkbox" ' + (p.active ? 'checked' : '') + ' onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'active\',this.checked)"> on sale</label>' +
          btn('Remove', "ClassroomStore.ui.removePriv('" + p.id + "')", 'ghost') + '</div>';
      }).join('') + '<div style="margin-top:10px;">' + btn('+ Add a reward', 'ClassroomStore.ui.addPriv()', 'ghost') + '</div>');

    // class party fund
    if (cls) {
      var fund = fundFor(cls.id);
      html += card(h2('🎉 Class party fund' + ' · ' + esc(cls.name || cls.id), 'Pupils give coins together toward a class goal, like a game day or a movie. The goal bar shows on their Party fund tab.') +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;"><label style="font-size:.75rem;font-weight:800;color:var(--text-muted,#64748b);">What is it for?<input id="cs-fund-name" type="text" maxlength="40" value="' + esc(fund ? fund.name : 'Class game day') + '" style="display:block;width:220px;margin-top:3px;padding:6px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>' +
        '<label style="font-size:.75rem;font-weight:800;color:var(--text-muted,#64748b);">Goal (coins)<input id="cs-fund-goal" type="number" min="1" value="' + (fund && fund.goal ? fund.goal : 200) + '" style="display:block;width:100px;margin-top:3px;padding:6px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>' +
        btn(fund && fund.goal ? 'Save changes' : 'Start the fund', "ClassroomStore.ui.setFund('" + cls.id + "')") + (fund && fund.goal ? ' ' + btn('Start again', "ClassroomStore.ui.resetFund('" + cls.id + "')", 'ghost') : '') + '</div>' +
        (fund && fund.goal ? '<div style="margin-top:12px;font-weight:800;color:var(--text-main,#0f172a);">' + fund.raised + ' / ' + fund.goal + ' coins' + (fund.raised >= fund.goal ? ' · 🎊 GOAL REACHED, time to plan the party!' : '') + '</div><div style="margin-top:6px;background:#e2e8f0;border-radius:999px;height:16px;overflow:hidden;"><div style="width:' + Math.min(100, Math.round(fund.raised / fund.goal * 100)) + '%;height:100%;background:linear-gradient(90deg,#22c55e,#facc15,#f97316);"></div></div>' : ''));
    }

    // mystery box odds (information for the teacher)
    html += card(h2('🎁 What a mystery box can hold', 'Never something the pupil already has. Free rewards show up in “Approved, not used yet” above for you to honour.') +
      '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:.82rem;color:var(--text-main,#0f172a);"><thead><tr style="text-align:left;color:var(--text-muted,#64748b);"><th style="padding:5px 8px;">Box</th><th style="padding:5px 8px;">Monster item</th><th style="padding:5px 8px;">Sound / title / animal / plate</th><th style="padding:5px 8px;">Free reward</th><th style="padding:5px 8px;">Coins</th><th style="padding:5px 8px;">Jackpot</th></tr></thead><tbody>' +
      TIERS.map(function (t) {
        var o = {}; BOX_ODDS[t].forEach(function (r) { o[r[0]] = r[1]; });
        return '<tr style="border-top:1px solid var(--border-light,#e2e8f0);"><td style="padding:6px 8px;font-weight:800;">' + BOX_INFO[t].icon + ' ' + BOX_INFO[t].name + '</td><td style="padding:6px 8px;">' + o.item + '%</td><td style="padding:6px 8px;">' + o.extra + '%</td><td style="padding:6px 8px;">' + o.voucher + '% (up to ' + (BOX_VOUCHER_CAP[t] > 1000 ? 'any' : BOX_VOUCHER_CAP[t]) + ' coins)</td><td style="padding:6px 8px;">' + o.coins + '% (' + BOX_COINS[t][0] + ' to ' + BOX_COINS[t][1] + ')</td><td style="padding:6px 8px;">' + o.jackpot + '% (legendary or 300 coins)</td></tr>';
      }).join('') + '</tbody></table></div>');

    // history
    var recent = d.purchases.slice(0, 15);
    html += card(h2('🧾 Recent purchases', 'Undo gives the coins back and removes the item or unopened box.') +
      (recent.length ? recent.map(function (p) {
        return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 0;border-top:1px solid var(--border-light,#e2e8f0);color:var(--text-main,#0f172a);font-size:.85rem;"><span style="font-size:1.2rem;">' + esc(p.icon) + '</span><div style="flex:1;min-width:180px;"><b>' + esc(p.name) + '</b> <span style="color:var(--text-muted,#64748b);">· ' + esc(studentName(p.studentId)) + ' · ' + when(p.ts) + '</span></div>' + coinPill(p.price) +
          (p.status === 'done' ? btn('Undo', "ClassroomStore.ui.undo('" + p.id + "')", 'ghost') : '<span style="font-size:.75rem;color:var(--text-muted,#64748b);">refunded</span>') + '</div>';
      }).join('') : '<div style="font-size:.85rem;color:var(--text-muted,#64748b);">Nothing bought yet.</div>'));

    container.innerHTML = html + '</div>';
  }

  // ---------------------------------------------------------------- UI (student)
  function itemPicHtml(item) {
    var name = String(item.id).replace(/^(bg|aura)-/, '');
    var artOn = root.EAA_ILLUSTRATED_MONSTERS === true;
    if (artOn && item.category === 'background') return '<img src="assets/monsters/bg-art/bg_' + name + '.webp" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:12px;">';
    if (artOn && item.category === 'aura') return '<div style="width:72px;height:72px;margin:0 auto;background:#0f172a;border-radius:12px;display:flex;align-items:center;justify-content:center;"><img src="assets/monsters/aura-art/aura_' + name + '.webp" alt="" style="width:68px;height:68px;object-fit:contain;"></div>';
    var D = root.MonsterDressUp, pic = D && D.itemPicture ? D.itemPicture(item.id) : '';
    if (pic) return '<img src="' + pic + '" alt="" style="width:72px;height:72px;object-fit:contain;">';
    if (!artOn && root.MonsterRenderer && root.MonsterRenderer.renderMonsterItemThumbnail) {
      try { var th = root.MonsterRenderer.renderMonsterItemThumbnail(item, { size: 72, colorKey: 'blue' }); if (th) return '<div style="width:72px;height:72px;margin:0 auto;display:flex;align-items:center;justify-content:center;">' + th + '</div>'; } catch (e) { /* use the emoji */ }
    }
    return '<div style="font-size:2.4rem;line-height:72px;height:72px;">' + esc(item.icon || '🎁') + '</div>';
  }
  function renderStudent(container) {
    var s = store.getActiveStudent ? store.getActiveStudent() : (store.getStudents() || [])[0];
    if (!s) { container.innerHTML = '<div style="padding:40px;text-align:center;">No active student profile found.</div>'; return; }
    var d = data(), cfg = d.config, bal = balance(s.id), w = wallet(s.id);
    var tabs = [['items', '🎨 Monster items'], ['extras', '✨ Extras'], ['boxes', '🎁 Mystery boxes'], ['party', '🎉 Party fund'], ['rewards', '⭐ Class rewards'], ['orders', '🧾 My orders']];
    var html = '<div style="max-width:980px;margin:0 auto;padding:6px 4px 40px;">' +
      '<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #fcd34d;border-radius:20px;padding:20px;margin-bottom:18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">' +
      '<div style="font-size:3rem;">🪙</div><div style="flex:1;min-width:200px;"><div style="font-size:.8rem;font-weight:800;color:#92400e;">YOUR COINS</div><div style="font-size:2.4rem;font-weight:900;color:#78350f;line-height:1;">' + bal + '</div>' +
      '<div style="font-size:.8rem;color:#92400e;margin-top:4px;">You earn 1 coin for every ' + cfg.coinsPerXp + ' XP. Spending coins never lowers your XP or your monster level.</div></div></div>' +
      '<div style="display:flex;gap:8px;overflow-x:auto;margin-bottom:16px;">' + tabs.map(function (t) {
        var on = studentTab === t[0];
        return '<button type="button" onclick="ClassroomStore.ui.tab(\'' + t[0] + '\')" style="padding:9px 14px;border-radius:12px;font-weight:800;font-size:.85rem;white-space:nowrap;cursor:pointer;border:1px solid ' + (on ? '#16a34a' : 'var(--border-light,#cbd5e1)') + ';background:' + (on ? '#16a34a' : 'var(--bg-surface,#fff)') + ';color:' + (on ? '#fff' : 'var(--text-main,#0f172a)') + ';">' + t[1] + '</button>';
      }).join('') + '</div>';

    if (studentTab === 'items') {
      var list = shopItems(s.id);
      var cats = ['all', 'sets', 'hat', 'glasses', 'accessory', 'backpack', 'clothing', 'background', 'aura', 'body'];
      var catLabel = { all: 'All', sets: '🎭 Costume sets', hat: 'Hats', glasses: 'Glasses', accessory: 'Accessories', backpack: 'Backpacks', clothing: 'Outfits', background: 'Worlds', aura: 'Auras', body: 'Colours' };
      var present = cats.filter(function (c) { return c === 'all' || (c === 'sets' && root.MonsterCostumes) || list.some(function (x) { return x.item.category === c; }); });
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' + present.map(function (c) {
        return '<button type="button" onclick="ClassroomStore.ui.filter(\'' + c + '\')" style="padding:5px 11px;border-radius:999px;font-size:.78rem;font-weight:800;cursor:pointer;border:1px solid var(--border-light,#cbd5e1);background:' + (itemFilter === c ? '#0f172a' : 'transparent') + ';color:' + (itemFilter === c ? '#fff' : 'var(--text-main,#0f172a)') + ';">' + catLabel[c] + '</button>';
      }).join('') + '</div>';
      var shown = list.filter(function (x) { return itemFilter === 'all' || x.item.category === itemFilter; });
      if (itemFilter === 'sets' && root.MonsterCostumes) {
        var M = root.MonsterCostumes, mine = ownedMonsterIds(s.id);
        html += Object.keys(M.sets).map(function (k) {
          var st = M.sets[k], have = st.pieces.filter(function (pid) { return mine.indexOf(pid) !== -1; }).length, done = have === st.pieces.length;
          return '<div style="background:var(--bg-surface,#fff);border:2px solid ' + (done ? '#16a34a' : 'var(--border-light,#e2e8f0)') + ';border-radius:18px;padding:12px 14px;margin-bottom:12px;">' +
            '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;"><span style="font-size:1.6rem;">' + st.icon + '</span><div style="flex:1;min-width:160px;"><div style="font-weight:900;color:var(--text-main,#0f172a);">' + esc(st.name) + '</div>' +
            '<div style="font-size:.74rem;color:var(--text-muted,#64748b);">' + (done ? '✅ Set complete! You earned the title “' + esc(st.title) + '”' : 'Collect all 3 to earn the title “' + esc(st.title) + '”') + '</div></div>' +
            '<span style="font-weight:900;font-size:.85rem;color:' + (done ? '#16a34a' : '#64748b') + ';">' + have + ' / ' + st.pieces.length + '</span></div>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">' + st.pieces.map(function (pid) {
              var it = findItem(pid) || (M.byId(pid)), owned = mine.indexOf(pid) !== -1, price = it ? itemPrice(it) : 0, can = bal >= price;
              if (!it) return '';
              return '<div style="text-align:center;border:1px solid var(--border-light,#e2e8f0);border-radius:14px;padding:8px;opacity:' + (owned ? .75 : 1) + ';">' + itemPicHtml(it) +
                '<div style="font-weight:800;font-size:.8rem;margin-top:2px;color:var(--text-main,#0f172a);">' + esc(it.name) + '</div>' +
                '<div style="font-size:.66rem;font-weight:800;color:' + (RARITY_COLOR[it.rarity] || '#64748b') + ';text-transform:uppercase;">' + esc(it.rarity) + '</div>' +
                '<div style="margin-top:6px;">' + (owned ? '<span style="font-weight:900;color:#16a34a;">✓ You have it</span>' : coinPill(price) + '<div style="margin-top:6px;">' + btn(can ? 'Buy' : 'Need ' + (price - bal) + ' more', "ClassroomStore.ui.buyItem('" + pid + "')", 'ok', !can) + '</div>') + '</div></div>';
            }).join('') + '</div></div>';
        }).join('');
        shown = [];
      }
      html += itemFilter === 'sets' ? '' : shown.length ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;">' + shown.map(function (x) {
        var can = bal >= x.price;
        return '<div style="background:var(--bg-surface,#fff);border:1px solid var(--border-light,#e2e8f0);border-radius:16px;padding:12px;text-align:center;">' +
          itemPicHtml(x.item) + '<div style="font-weight:900;font-size:.88rem;margin-top:4px;color:var(--text-main,#0f172a);">' + esc(x.item.name) + '</div>' +
          '<div style="font-size:.7rem;font-weight:800;color:' + (RARITY_COLOR[x.item.rarity] || '#64748b') + ';text-transform:uppercase;">' + esc(x.item.rarity || 'common') + ' · opens at level ' + x.level + '</div>' +
          '<div style="margin:8px 0;">' + coinPill(x.price) + '</div>' + btn(can ? 'Buy now' : 'Need ' + (x.price - bal) + ' more', "ClassroomStore.ui.buyItem('" + x.item.id + "')", 'ok', !can) + '</div>';
      }).join('') + '</div>' : '<div style="padding:30px;text-align:center;color:var(--text-muted,#64748b);">You already have everything in this group. 🎉</div>';
    } else if (studentTab === 'extras') {
      html += renderExtrasTab(s, bal);
    } else if (studentTab === 'party') {
      html += renderPartyTab(s, bal);
    } else if (studentTab === 'boxes') {
      var mine = store.getMysteryBoxes ? store.getMysteryBoxes(s.id, false) : [];
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:18px;">' + TIERS.map(function (t) {
        var price = cfg.boxPrices[t], can = bal >= price;
        return '<div style="background:var(--bg-surface,#fff);border:1px solid var(--border-light,#e2e8f0);border-radius:16px;padding:16px;text-align:center;"><div style="font-size:2.6rem;">' + BOX_INFO[t].icon + '</div><div style="font-weight:900;color:var(--text-main,#0f172a);">' + BOX_INFO[t].name + '</div><div style="font-size:.75rem;color:var(--text-muted,#64748b);margin:3px 0 8px;">' + BOX_INFO[t].blurb + '</div>' + coinPill(price) + '<div style="margin-top:10px;">' + btn(can ? 'Buy box' : 'Need ' + (price - bal) + ' more', "ClassroomStore.ui.buyBox('" + t + "')", 'ok', !can) + '</div></div>';
      }).join('') + '</div>' +
        card(h2('What can be inside?', 'Every box is a surprise. You never get something you already have.') +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;font-size:.82rem;color:var(--text-main,#0f172a);">' +
          [['🎨', 'A monster item or costume piece'], ['🔊', 'A victory sound, title, animal or name plate'], ['🎟️', 'A FREE class reward from your teacher'], ['🪙', 'A pile of coins'], ['💎', 'A rare legendary jackpot']].map(function (r) { return '<div style="display:flex;gap:8px;align-items:center;"><span style="font-size:1.4rem;">' + r[0] + '</span><span>' + r[1] + '</span></div>'; }).join('') + '</div>') +
        card(h2('🎁 Your unopened boxes (' + mine.length + ')') + (mine.length ? mine.map(function (b) { return '<span style="display:inline-block;margin:0 8px 8px 0;">' + btn((BOX_INFO[b.boxTier] ? BOX_INFO[b.boxTier].icon : '🎁') + ' Open ' + (BOX_INFO[b.boxTier] ? BOX_INFO[b.boxTier].name : 'box'), "ClassroomStore.ui.openBox('" + b.id + "')") + '</span>'; }).join('') : '<div style="font-size:.85rem;color:var(--text-muted,#64748b);">No unopened boxes.</div>'));
    } else if (studentTab === 'rewards') {
      html += '<div style="font-size:.85rem;color:var(--text-muted,#64748b);margin-bottom:10px;">Ask for a reward. Your teacher says yes or no. If it is a no, your coins come back.</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">' + cfg.privileges.filter(function (p) { return p.active; }).map(function (p) {
          var used = usedThisWeek(s.id, p.id), left = p.weeklyLimit ? Math.max(0, p.weeklyLimit - used) : 99, can = bal >= p.price && left > 0;
          return '<div style="background:var(--bg-surface,#fff);border:1px solid var(--border-light,#e2e8f0);border-radius:16px;padding:14px;text-align:center;"><div style="font-size:2.2rem;">' + esc(p.icon) + '</div><div style="font-weight:900;margin:4px 0;color:var(--text-main,#0f172a);">' + esc(p.name) + '</div>' + coinPill(p.price) +
            '<div style="font-size:.72rem;color:var(--text-muted,#64748b);margin:6px 0;">' + (p.weeklyLimit ? left + ' left this week' : '') + '</div>' + btn(left <= 0 ? 'Used this week' : (bal < p.price ? 'Need ' + (p.price - bal) + ' more' : 'Ask for this'), "ClassroomStore.ui.request('" + p.id + "')", 'ok', !can) + '</div>';
        }).join('') + '</div>';
    } else {
      var reqs = d.requests.filter(function (r) { return r.studentId === s.id; });
      var buys = d.purchases.filter(function (p) { return p.studentId === s.id; });
      var STAT = { pending: '⏳ Waiting', approved: '✅ Approved', declined: '↩️ Declined (coins back)', used: '✔️ Done' };
      html += card(h2('Reward requests') + (reqs.length ? reqs.map(function (r) { return '<div style="display:flex;gap:10px;padding:8px 0;border-top:1px solid var(--border-light,#e2e8f0);font-size:.88rem;color:var(--text-main,#0f172a);"><span>' + esc(r.icon) + '</span><div style="flex:1;">' + esc(r.name) + '</div><b>' + (STAT[r.status] || r.status) + '</b></div>'; }).join('') : '<div style="font-size:.85rem;color:var(--text-muted,#64748b);">No requests yet.</div>')) +
        card(h2('What you bought') + (buys.length ? buys.map(function (p) { return '<div style="display:flex;gap:10px;padding:8px 0;border-top:1px solid var(--border-light,#e2e8f0);font-size:.88rem;color:var(--text-main,#0f172a);"><span>' + esc(p.icon) + '</span><div style="flex:1;">' + esc(p.name) + '</div>' + coinPill(p.price) + (p.status === 'refunded' ? '<i>refunded</i>' : '') + '</div>'; }).join('') : '<div style="font-size:.85rem;color:var(--text-muted,#64748b);">Nothing yet.</div>')) +
        card(h2('Coin history') + (w.ledger.length ? w.ledger.slice(0, 12).map(function (l) { return '<div style="display:flex;gap:10px;padding:6px 0;border-top:1px solid var(--border-light,#e2e8f0);font-size:.82rem;color:var(--text-main,#0f172a);"><div style="flex:1;">' + esc(l.reason) + '</div><b style="color:' + (l.delta >= 0 ? '#16a34a' : '#dc2626') + ';">' + (l.delta >= 0 ? '+' : '') + l.delta + '</b></div>'; }).join('') : '<div style="font-size:.85rem;color:var(--text-muted,#64748b);">Your coins come from XP, and from your teacher.</div>'));
    }
    container.innerHTML = html + '</div>';
  }

  /** The four kind cards shown on the teacher's Mystery Boxes screen. */
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
        '🎨 Monster item <b>' + pct(t, 'item') + '%</b> (' + rar + ')<br>✨ Sound / title / animal / plate <b>' + pct(t, 'extra') + '%</b><br>🎟️ Free class reward <b>' + pct(t, 'voucher') + '%</b><br>🪙 Coins <b>' + pct(t, 'coins') + '%</b> (' + BOX_COINS[t][0] + ' to ' + BOX_COINS[t][1] + ')<br>💎 Jackpot <b>' + pct(t, 'jackpot') + '%</b><br>Price in the shop: <b>' + cfg.boxPrices[t] + ' coins</b></div></div>' +
        '<div style="display:flex; gap:6px;"><button type="button" class="btn-3d btn-3d-secondary" onclick="window.handleGrantClassMysteryBox(\'' + t + '\')" style="flex:1; font-size:0.74rem; padding:6px 8px;">+ Class Grant</button>' +
        '<button type="button" class="btn-3d btn-3d-primary" onclick="window.handleTestTierUnboxing(\'' + t + '\')" style="font-size:0.74rem; padding:6px 10px;">🎁 Demo Open</button></div></div>';
    }).join('') + '</div>';
  };

  var extraKind = 'sound';
  function plateStyle(x) { return (x && x.css) || ''; }
  function extraCard(s, x, bal) {
    var owned = extraOwned(s.id, x.id), eq = equippedExtras(s.id)[x.kind], wearing = eq && eq.id === x.id, price = extraPrice(x), can = bal >= price;
    var pic = x.kind === 'plate' ? '<div style="height:54px;border-radius:12px;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.9rem;' + plateStyle(x) + '">' + esc(s.firstName || 'Name') + '</div>'
      : x.kind === 'title' ? '<div style="font-size:2rem;">' + x.icon + '</div><div style="display:inline-block;background:#fef3c7;border:2px solid #f59e0b;color:#78350f;border-radius:999px;padding:1px 10px;font-weight:900;font-size:.76rem;margin:2px 0;">' + esc(x.name) + '</div>'
      : x.kind === 'pack' ? '<img src="bamboozle/memes/' + x.animal + '_celebrate.webp" alt="" style="width:64px;height:64px;object-fit:contain;" onerror="this.outerHTML=\'<div style=&quot;font-size:2.4rem;&quot;>' + x.icon + '</div>\'">'
      : '<div style="font-size:2.2rem;">' + x.icon + '</div>';
    var actions = '';
    if (x.kind === 'sound') actions += btn('▶ Listen', "ClassroomStore.ui.previewSound('" + x.id + "')", 'ghost') + ' ';
    if (owned) actions += wearing ? '<span style="font-weight:900;color:#16a34a;font-size:.8rem;">✓ Wearing</span>' : btn('Wear it', "ClassroomStore.ui.equip('" + x.kind + "','" + x.id + "')");
    else if (String(x.id).indexOf('set-') === 0) actions += '<span style="font-size:.72rem;color:var(--text-muted,#64748b);">Finish the costume set</span>';
    else actions += btn(can ? 'Buy' : 'Need ' + (price - bal) + ' more', "ClassroomStore.ui.buyExtra('" + x.id + "')", 'ok', !can);
    return '<div style="background:var(--bg-surface,#fff);border:' + (wearing ? '2px solid #16a34a' : '1px solid var(--border-light,#e2e8f0)') + ';border-radius:16px;padding:10px;text-align:center;">' + pic +
      '<div style="font-weight:900;font-size:.84rem;margin-top:2px;color:var(--text-main,#0f172a);">' + esc(x.name) + '</div>' +
      '<div style="font-size:.66rem;font-weight:800;color:' + (RARITY_COLOR[x.rarity] || '#64748b') + ';text-transform:uppercase;">' + esc(x.rarity) + '</div>' +
      '<div style="font-size:.72rem;color:var(--text-muted,#64748b);margin:3px 0;min-height:2.2em;">' + esc(x.desc || '') + '</div>' +
      (owned || String(x.id).indexOf('set-') === 0 ? '' : '<div style="margin:4px 0;">' + coinPill(price) + '</div>') + '<div>' + actions + '</div></div>';
  }
  function renderExtrasTab(s, bal) {
    var C = CCo();
    if (!C) return '<div style="padding:30px;text-align:center;color:var(--text-muted,#64748b);">Extras are not loaded.</div>';
    var eq = equippedExtras(s.id), K = C.KINDS;
    var look = '<div style="background:linear-gradient(135deg,#ede9fe,#e0f2fe);border:1px solid #c4b5fd;border-radius:16px;padding:12px 14px;margin-bottom:14px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;">' +
      '<div style="font-weight:900;color:#4c1d95;">Your look</div>' +
      '<div style="font-size:.85rem;color:#1e1b4b;">🏷️ ' + (eq.title ? '<b>' + esc(eq.title.name) + '</b>' : '<i>no title</i>') + '</div>' +
      '<div style="font-size:.85rem;color:#1e1b4b;">🦊 ' + (eq.pack ? '<b>' + esc(eq.pack.name) + '</b>' : '<i>no animal</i>') + '</div>' +
      '<div style="font-size:.85rem;color:#1e1b4b;">🔊 ' + (eq.sound ? '<b>' + esc(eq.sound.name) + '</b> ' + btn('▶', "ClassroomStore.ui.previewSound('" + eq.sound.id + "')", 'ghost') : '<i>no sound</i>') + '</div>' +
      '<div style="font-size:.85rem;color:#1e1b4b;">🖼️ ' + (eq.plate ? '<b>' + esc(eq.plate.name) + '</b>' : '<i>plain card</i>') + '</div></div>';
    var chips = Object.keys(K).map(function (k) {
      var on = extraKind === k;
      return '<button type="button" onclick="ClassroomStore.ui.extraKind(\'' + k + '\')" style="padding:6px 13px;border-radius:999px;font-size:.8rem;font-weight:800;cursor:pointer;border:1px solid var(--border-light,#cbd5e1);background:' + (on ? '#0f172a' : 'transparent') + ';color:' + (on ? '#fff' : 'var(--text-main,#0f172a)') + ';">' + K[k].icon + ' ' + K[k].label + '</button>';
    }).join(' ');
    var list = C.ofKind(extraKind).slice();
    if (extraKind === 'title') list = setTitleItems(s.id).concat(list);
    list.sort(function (a, b) { var o = { common: 0, rare: 1, epic: 2, legendary: 3 }; return (o[a.rarity] - o[b.rarity]) || a.name.localeCompare(b.name); });
    var note = extraKind === 'sound' ? 'A victory sound plays on the board when your name is picked or you get a star.'
      : extraKind === 'title' ? 'Your title shows next to your name. Finish a costume set to earn a special title for free.'
      : extraKind === 'pack' ? 'Your animal is the sticker that reacts when you play.'
      : 'Your name plate decorates your card on the Class Board.';
    return look + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">' + chips + '</div>' +
      '<div style="font-size:.82rem;color:var(--text-muted,#64748b);margin-bottom:10px;">' + note + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;">' + list.map(function (x) { return extraCard(s, x, bal); }).join('') + '</div>';
  }
  function renderPartyTab(s, bal) {
    var cid = classOfStudent(s.id), f = fundFor(cid);
    if (!f || !f.goal) return card('<div style="text-align:center;padding:20px;"><div style="font-size:3rem;">🎉</div><div style="font-weight:900;font-size:1.1rem;color:var(--text-main,#0f172a);">No class party fund yet</div><div style="font-size:.85rem;color:var(--text-muted,#64748b);margin-top:6px;">Ask your teacher to start one. Then everyone can give coins to reach the goal together!</div></div>');
    var pct = Math.min(100, Math.round(f.raised / f.goal * 100)), full = f.raised >= f.goal;
    var donors = Object.keys(f.donors || {}).map(function (id) { return { id: id, n: f.donors[id] }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 6);
    return card('<div style="text-align:center;"><div style="font-size:2.6rem;">' + (full ? '🎊' : '🎉') + '</div><div style="font-weight:900;font-size:1.25rem;color:var(--text-main,#0f172a);">' + esc(f.name) + '</div>' +
      '<div style="margin:12px auto;max-width:520px;background:#e2e8f0;border-radius:999px;height:26px;overflow:hidden;border:2px solid #0f172a;"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#22c55e,#facc15,#f97316);transition:width .5s;"></div></div>' +
      '<div style="font-weight:900;color:var(--text-main,#0f172a);">' + f.raised + ' / ' + f.goal + ' coins' + (full ? ' · GOAL REACHED! 🎉' : '') + '</div>' +
      (full ? '<div style="font-size:.85rem;color:#15803d;font-weight:800;margin-top:6px;">The class did it together! Your teacher will plan the party.</div>' :
        '<div style="margin-top:12px;font-size:.82rem;color:var(--text-muted,#64748b);">You have ' + bal + ' coins. Give some to help the class:</div><div style="margin-top:8px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
        [5, 10, 25].map(function (n) { return btn('Give ' + n, "ClassroomStore.ui.donate(" + n + ")", 'ok', bal < n); }).join('') + '</div>') + '</div>' +
      (donors.length ? '<div style="margin-top:14px;border-top:1px solid var(--border-light,#e2e8f0);padding-top:10px;"><div style="font-weight:800;font-size:.82rem;margin-bottom:6px;color:var(--text-main,#0f172a);">⭐ Biggest helpers</div>' + donors.map(function (d) { return '<div style="display:flex;justify-content:space-between;font-size:.84rem;padding:2px 0;color:var(--text-main,#0f172a);"><span>' + esc(studentName(d.id)) + '</span><b>' + d.n + ' 🪙</b></div>'; }).join('') + '</div>' : ''));
  }

  // ---------------------------------------------------------------- UI actions
  function activeStudentId() { var s = store.getActiveStudent ? store.getActiveStudent() : null; return s ? s.id : null; }
  function confirm(title, message, confirmText, fn) {
    if (root.confirmAction) root.confirmAction({ title: title, message: message, confirmText: confirmText, isDanger: false, onConfirm: fn });
    else if (root.confirm && root.confirm(title + '\n' + message)) fn();
  }
  var ui = {
    tab: function (t) { studentTab = t; rerender(); },
    extraKind: function (k) { extraKind = k; rerender(); },
    previewSound: function (id) { if (root.ClassroomCosmetics) root.ClassroomCosmetics.playSound(id); },
    buyExtra: function (id) {
      var sid = activeStudentId(), x = findExtra(id); if (!sid || !x) return;
      confirm('Buy ' + x.name + '?', 'It costs ' + extraPrice(x) + ' coins. You have ' + balance(sid) + '.', 'Buy', function () {
        var r = buyExtra(sid, id); notify(r.success ? 'You bought ' + r.item.name + '! It is on right away.' : r.error, r.success ? 'success' : 'error');
        if (r.success && x.kind === 'sound' && root.ClassroomCosmetics) root.ClassroomCosmetics.playSound(id);
        rerender();
      });
    },
    equip: function (kind, id) {
      var sid = activeStudentId(); if (!sid) return;
      var r = equipExtra(sid, kind, id); notify(r.success ? 'Now wearing it!' : r.error, r.success ? 'success' : 'error');
      if (r.success && kind === 'sound' && root.ClassroomCosmetics) root.ClassroomCosmetics.playSound(id);
      rerender();
    },
    donate: function (n) {
      var sid = activeStudentId(); if (!sid) return;
      var r = donate(sid, n); notify(r.success ? (r.full ? 'The fund is FULL! Thank you! 🎉' : 'Thank you! You gave ' + r.amount + ' coins.') : r.error, r.success ? 'success' : 'error'); rerender();
    },
    setFund: function (classId) {
      var nm = document.getElementById('cs-fund-name'), gl = document.getElementById('cs-fund-goal');
      var r = setFund(classId, nm ? nm.value : '', gl ? gl.value : 0); notify(r.success ? 'Party fund saved' : r.error, r.success ? 'success' : 'error'); rerender();
    },
    resetFund: function (classId) { confirm('Start the fund again?', 'The coins already given stay spent. The bar goes back to zero.', 'Reset', function () { resetFund(classId); rerender(); }); },
    filter: function (c) { itemFilter = c; rerender(); },
    buyItem: function (itemId) {
      var id = activeStudentId(), item = findItem(itemId); if (!id || !item) return;
      confirm('Buy ' + item.name + '?', 'It costs ' + itemPrice(item) + ' coins. You have ' + balance(id) + '.', 'Buy', function () {
        var r = buyItem(id, itemId); notify(r.success ? 'You bought ' + r.item.name + '! Find it in Monster Studio.' : r.error, r.success ? 'success' : 'error'); rerender();
      });
    },
    buyBox: function (tier) {
      var id = activeStudentId(); if (!id) return;
      confirm('Buy a ' + BOX_INFO[tier].name + '?', 'It costs ' + data().config.boxPrices[tier] + ' coins.', 'Buy', function () {
        var r = buyBox(id, tier); notify(r.success ? 'Box bought! Open it below.' : r.error, r.success ? 'success' : 'error'); studentTab = 'boxes'; rerender();
      });
    },
    openBox: function (boxId) { var id = activeStudentId(); if (root.openMysteryBoxModal) root.openMysteryBoxModal(boxId, id, { onClose: rerender }); else notify('Mystery box viewer is not loaded', 'error'); },
    request: function (privId) {
      var id = activeStudentId(), p = privilege(privId); if (!id || !p) return;
      confirm('Ask for: ' + p.name + '?', 'It costs ' + p.price + ' coins. Your teacher will say yes or no. If no, you get the coins back.', 'Ask', function () {
        var r = requestPrivilege(id, privId); notify(r.success ? 'Request sent to your teacher!' : r.error, r.success ? 'success' : 'error'); rerender();
      });
    },
    decide: function (rid, status) { var r = decide(rid, status); notify(r.success ? (status === 'approved' ? 'Approved' : 'Marked as used') : r.error, r.success ? 'success' : 'error'); rerender(); },
    decline: function (rid) {
      var note = root.prompt ? root.prompt('Reason for the student (optional):', '') : '';
      if (note === null) return;
      var r = decide(rid, 'declined', note || ''); notify(r.success ? 'Declined. Coins given back.' : r.error, r.success ? 'success' : 'error'); rerender();
    },
    give: function (sid, n) { var r = grant(sid, n); notify(r.success ? (r.amount > 0 ? 'Gave ' + r.amount + ' coins' : 'Took ' + (-r.amount) + ' coins') : r.error, r.success ? 'success' : 'error'); rerender(); },
    cleanUnearned: function () {
      confirm('Remove items nobody earned?', 'All automatic mystery boxes, the prizes that came out of them, the test title on Aslıhan and the free test reward will be removed. Coins and XP stay the same. A copy is kept on this device so you can undo.', 'Remove them', function () {
        var n = cleanUnearned(); notify(n ? 'Removed ' + n + ' unearned items.' : 'Nothing to remove.'); rerender();
      });
    },
    undoClean: function () { var ok = undoClean(); notify(ok ? 'Clean-up undone.' : 'No copy found on this device.', ok ? 'success' : 'error'); rerender(); },
    wsName: function (v) { wsName = String(v || '').trim() || 'Revision worksheet'; wsDraft = {}; rerender(); },
    wsPick: function (sid, n) {
      wsDraft[sid] = Math.max(0, Math.min(10, Math.round(Number(n) || 0)));
      var el = root.document && root.document.getElementById('cs-ws-' + sid); if (el) el.innerHTML = wsRowHtml(sid);
      var c = root.document && root.document.getElementById('cs-ws-count'); if (c) { var k = Object.keys(wsDraft).length; c.textContent = k + (k === 1 ? ' score picked' : ' scores picked'); }
    },
    wsClear: function () { wsDraft = {}; rerender(); },
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
      wsDraft = {}; notify('Worksheet coins saved: ' + given + ' pupils changed, ' + coins + ' coins in total.'); rerender();
    },
    giveCustom: function (sid) {
      var v = root.prompt ? root.prompt('How many coins? Use a minus sign to take coins away (for example -10).', '10') : null;
      if (v === null) return; ui.give(sid, Number(v));
    },
    getTimetable: function () { return data().config.timetable || {}; },
    setTimetable: function (tt) { data().config.timetable = tt || {}; data().config.updatedAt = Date.now(); save(); },
    getBoardGoal: function (classId) { return data().config.boardGoals[classId] || null; },
    setBoardGoal: function (classId, g) { data().config.boardGoals[classId] = g; data().config.updatedAt = Date.now(); save(); },
    setPrice: function (kind, key, v) { v = Math.max(1, Math.round(Number(v) || 1)); (kind === 'item' ? data().config.itemPrices : data().config.boxPrices)[key] = v; data().config.updatedAt = Date.now(); save(); },
    setPriv: function (id, field, v) {
      var p = privilege(id); if (!p) return;
      p[field] = field === 'active' ? !!v : Math.max(field === 'price' ? 1 : 0, Math.round(Number(v) || 0)); data().config.updatedAt = Date.now(); save();
    },
    removePriv: function (id) {
      confirm('Remove this reward?', 'Students will no longer see it. Past requests are kept.', 'Remove', function () { data().config.privileges = data().config.privileges.filter(function (p) { return p.id !== id; }); data().config.updatedAt = Date.now(); save(); rerender(); });
    },
    addPriv: function () {
      var name = root.prompt ? root.prompt('Name of the new reward (for example: Choose the story):', '') : null; if (!name) return;
      var price = root.prompt ? root.prompt('How many coins?', '50') : null; if (price === null) return;
      data().config.privileges.push({ id: uid('p'), icon: '🎁', name: name.trim(), price: Math.max(1, Math.round(Number(price) || 50)), weeklyLimit: 1, active: true }); data().config.updatedAt = Date.now(); save(); rerender();
    },
    undo: function (pid) {
      confirm('Undo this purchase?', 'The coins go back to the student and the item or unopened box is removed.', 'Undo purchase', function () { var r = undoPurchase(pid); notify(r.success ? 'Purchase undone, coins refunded' : r.error, r.success ? 'success' : 'error'); rerender(); });
    }
  };

  root.ClassroomStore = {
    cosmetics: { equipped: equippedExtras, equip: equipExtra, buy: buyExtra, give: giveExtra, owned: extraOwned, entry: cosEntry, find: findExtra, setTitles: setTitleItems },
    fund: { get: fundFor, set: setFund, donate: donate, reset: resetFund },
    openBox: openBox2, BOX_ODDS: BOX_ODDS, TIERS: TIERS, BOX_INFO: BOX_INFO,
    ui: ui, findUnearned: findUnearned, getTimetable: ui.getTimetable, setTimetable: ui.setTimetable, getBoardGoal: ui.getBoardGoal, setBoardGoal: ui.setBoardGoal, data: data, wallet: wallet, balance: balance, grant: grant, buyItem: buyItem, buyBox: buyBox,
    requestPrivilege: requestPrivilege, decide: decide, cloud: { pull: cloudPull, push: cloudPush, bundleFor: bundleFor, adoptDoc: adoptDoc, stampOf: stampOf, id: CLOUD_ID, state: function () { return cloudState; } }, undoPurchase: undoPurchase, shopItems: shopItems, usedThisWeek: usedThisWeek, DEFAULTS: DEFAULTS
  };
  root.__csRefreshStatus = function () { var el = document.getElementById('cs-cloud-status'); if (el) el.textContent = cloudLabel(); };
  root.renderClassroomStoreView = function (container) {
    var role = store.getRole ? store.getRole() : 'teacher';
    if (cloudClient() && Date.now() - lastPull > 30000) cloudPull().then(function (c) { if (c && root.renderCurrentView) root.renderCurrentView(); });
    if (role === 'student') renderStudent(container); else renderTeacher(container);
  };
})(typeof window !== 'undefined' ? window : this);
