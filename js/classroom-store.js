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

  var DEFAULTS = {
    coinsPerXp: 10,
    itemPrices: { common: 25, rare: 60, epic: 120, legendary: 250 },
    boxPrices: { WOODEN: 30, GILDED: 80, CELESTIAL: 180 },
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
  var BOX_INFO = {
    WOODEN: { name: 'Wooden Box', icon: '📦', odds: 'Common or Rare item' },
    GILDED: { name: 'Gilded Box', icon: '🎁', odds: 'Rare or Epic item' },
    CELESTIAL: { name: 'Celestial Box', icon: '✨', odds: 'Epic or Legendary item' }
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
    c.boxPrices = Object.assign({}, DEFAULTS.boxPrices, c.boxPrices || {});
    if (!Array.isArray(c.privileges)) c.privileges = clone(DEFAULTS.privileges);
    if (!c.coinsPerXp) c.coinsPerXp = DEFAULTS.coinsPerXp;
    return d;
  }
  function save() { store.saveState(); store.notify(); }

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
    if (['hat', 'glasses', 'accessory', 'backpack', 'clothing'].indexOf(item.category) !== -1) return !!(D && D.supportedItem(item.id));
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

  // ---------------------------------------------------------------- UI (shared)
  var studentTab = 'items', itemFilter = 'all';
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
      'Back-pay: everyone already started with their current XP ÷ ' + cfg.coinsPerXp + '.</div></div>';

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

    // students & coins
    html += card(h2('🪙 Students and coins' + (cls ? ' · ' + esc(cls.name || cls.id) : ''), 'Use the class menu at the top to switch class.') +
      '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:.85rem;">' +
      '<thead><tr style="text-align:left;color:var(--text-muted,#64748b);"><th style="padding:6px 8px;">Student</th><th style="padding:6px 8px;">XP</th><th style="padding:6px 8px;">Coins</th><th style="padding:6px 8px;">Give or take</th></tr></thead><tbody>' +
      students.map(function (s) {
        var xp = store.getStudentTotalXP ? store.getStudentTotalXP(s.id) : 0;
        return '<tr style="border-top:1px solid var(--border-light,#e2e8f0);color:var(--text-main,#0f172a);"><td style="padding:8px;font-weight:800;">' + esc(studentName(s.id)) + '</td><td style="padding:8px;">' + xp + '</td><td style="padding:8px;">' + coinPill(balance(s.id)) + '</td><td style="padding:8px;white-space:nowrap;">' +
          btn('+5', "ClassroomStore.ui.give('" + s.id + "',5)", 'ghost') + ' ' + btn('+10', "ClassroomStore.ui.give('" + s.id + "',10)", 'ghost') + ' ' + btn('−5', "ClassroomStore.ui.give('" + s.id + "',-5)", 'ghost') + ' ' + btn('Custom…', "ClassroomStore.ui.giveCustom('" + s.id + "')", 'ghost') + '</td></tr>';
      }).join('') + '</tbody></table></div>');

    // settings
    html += card(h2('⚙️ Prices and rewards', 'Change a price and it applies right away.') +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px;">' +
      ['common', 'rare', 'epic', 'legendary'].map(function (k) { return '<label style="font-size:.75rem;font-weight:800;color:var(--text-muted,#64748b);">' + k + ' item<input type="number" min="1" value="' + cfg.itemPrices[k] + '" onchange="ClassroomStore.ui.setPrice(\'item\',\'' + k + '\',this.value)" style="display:block;width:100%;margin-top:3px;padding:6px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>'; }).join('') +
      ['WOODEN', 'GILDED', 'CELESTIAL'].map(function (k) { return '<label style="font-size:.75rem;font-weight:800;color:var(--text-muted,#64748b);">' + BOX_INFO[k].name + '<input type="number" min="1" value="' + cfg.boxPrices[k] + '" onchange="ClassroomStore.ui.setPrice(\'box\',\'' + k + '\',this.value)" style="display:block;width:100%;margin-top:3px;padding:6px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>'; }).join('') + '</div>' +
      cfg.privileges.map(function (p) {
        return '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 0;border-top:1px solid var(--border-light,#e2e8f0);color:var(--text-main,#0f172a);">' +
          '<span style="font-size:1.3rem;">' + esc(p.icon) + '</span><div style="flex:1;min-width:180px;font-weight:800;">' + esc(p.name) + '</div>' +
          '<label style="font-size:.72rem;color:var(--text-muted,#64748b);">coins <input type="number" min="1" value="' + p.price + '" onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'price\',this.value)" style="width:70px;padding:5px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>' +
          '<label style="font-size:.72rem;color:var(--text-muted,#64748b);">per week <input type="number" min="0" value="' + (p.weeklyLimit || 0) + '" onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'weeklyLimit\',this.value)" style="width:60px;padding:5px;border-radius:8px;border:1px solid var(--border-light,#cbd5e1);color:#0f172a;background:#fff;font-weight:700;"></label>' +
          '<label style="font-size:.78rem;font-weight:700;"><input type="checkbox" ' + (p.active ? 'checked' : '') + ' onchange="ClassroomStore.ui.setPriv(\'' + p.id + '\',\'active\',this.checked)"> on sale</label>' +
          btn('Remove', "ClassroomStore.ui.removePriv('" + p.id + "')", 'ghost') + '</div>';
      }).join('') + '<div style="margin-top:10px;">' + btn('+ Add a reward', 'ClassroomStore.ui.addPriv()', 'ghost') + '</div>');

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
    if (item.category === 'background') return '<img src="assets/monsters/bg-art/bg_' + name + '.webp" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:12px;">';
    if (item.category === 'aura') return '<div style="width:72px;height:72px;margin:0 auto;background:#0f172a;border-radius:12px;display:flex;align-items:center;justify-content:center;"><img src="assets/monsters/aura-art/aura_' + name + '.webp" alt="" style="width:68px;height:68px;object-fit:contain;"></div>';
    var D = root.MonsterDressUp, pic = D && D.itemPicture ? D.itemPicture(item.id) : '';
    if (pic) return '<img src="' + pic + '" alt="" style="width:72px;height:72px;object-fit:contain;">';
    return '<div style="font-size:2.4rem;line-height:72px;height:72px;">' + esc(item.icon || '🎁') + '</div>';
  }
  function renderStudent(container) {
    var s = store.getActiveStudent ? store.getActiveStudent() : (store.getStudents() || [])[0];
    if (!s) { container.innerHTML = '<div style="padding:40px;text-align:center;">No active student profile found.</div>'; return; }
    var d = data(), cfg = d.config, bal = balance(s.id), w = wallet(s.id);
    var tabs = [['items', '🎨 Monster items'], ['boxes', '🎁 Mystery boxes'], ['rewards', '⭐ Class rewards'], ['orders', '🧾 My orders']];
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
      var cats = ['all', 'hat', 'glasses', 'accessory', 'backpack', 'clothing', 'background', 'aura', 'body'];
      var catLabel = { all: 'All', hat: 'Hats', glasses: 'Glasses', accessory: 'Accessories', backpack: 'Backpacks', clothing: 'Outfits', background: 'Worlds', aura: 'Auras', body: 'Colours' };
      var present = cats.filter(function (c) { return c === 'all' || list.some(function (x) { return x.item.category === c; }); });
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' + present.map(function (c) {
        return '<button type="button" onclick="ClassroomStore.ui.filter(\'' + c + '\')" style="padding:5px 11px;border-radius:999px;font-size:.78rem;font-weight:800;cursor:pointer;border:1px solid var(--border-light,#cbd5e1);background:' + (itemFilter === c ? '#0f172a' : 'transparent') + ';color:' + (itemFilter === c ? '#fff' : 'var(--text-main,#0f172a)') + ';">' + catLabel[c] + '</button>';
      }).join('') + '</div>';
      var shown = list.filter(function (x) { return itemFilter === 'all' || x.item.category === itemFilter; });
      html += shown.length ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;">' + shown.map(function (x) {
        var can = bal >= x.price;
        return '<div style="background:var(--bg-surface,#fff);border:1px solid var(--border-light,#e2e8f0);border-radius:16px;padding:12px;text-align:center;">' +
          itemPicHtml(x.item) + '<div style="font-weight:900;font-size:.88rem;margin-top:4px;color:var(--text-main,#0f172a);">' + esc(x.item.name) + '</div>' +
          '<div style="font-size:.7rem;font-weight:800;color:' + (RARITY_COLOR[x.item.rarity] || '#64748b') + ';text-transform:uppercase;">' + esc(x.item.rarity || 'common') + ' · opens at level ' + x.level + '</div>' +
          '<div style="margin:8px 0;">' + coinPill(x.price) + '</div>' + btn(can ? 'Buy now' : 'Need ' + (x.price - bal) + ' more', "ClassroomStore.ui.buyItem('" + x.item.id + "')", 'ok', !can) + '</div>';
      }).join('') + '</div>' : '<div style="padding:30px;text-align:center;color:var(--text-muted,#64748b);">You already have everything in this group. 🎉</div>';
    } else if (studentTab === 'boxes') {
      var mine = store.getMysteryBoxes ? store.getMysteryBoxes(s.id, false) : [];
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:18px;">' + ['WOODEN', 'GILDED', 'CELESTIAL'].map(function (t) {
        var price = cfg.boxPrices[t], can = bal >= price;
        return '<div style="background:var(--bg-surface,#fff);border:1px solid var(--border-light,#e2e8f0);border-radius:16px;padding:16px;text-align:center;"><div style="font-size:2.6rem;">' + BOX_INFO[t].icon + '</div><div style="font-weight:900;color:var(--text-main,#0f172a);">' + BOX_INFO[t].name + '</div><div style="font-size:.75rem;color:var(--text-muted,#64748b);margin:3px 0 8px;">' + BOX_INFO[t].odds + '</div>' + coinPill(price) + '<div style="margin-top:10px;">' + btn(can ? 'Buy box' : 'Need ' + (price - bal) + ' more', "ClassroomStore.ui.buyBox('" + t + "')", 'ok', !can) + '</div></div>';
      }).join('') + '</div>' +
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

  // ---------------------------------------------------------------- UI actions
  function activeStudentId() { var s = store.getActiveStudent ? store.getActiveStudent() : null; return s ? s.id : null; }
  function confirm(title, message, confirmText, fn) {
    if (root.confirmAction) root.confirmAction({ title: title, message: message, confirmText: confirmText, isDanger: false, onConfirm: fn });
    else if (root.confirm && root.confirm(title + '\n' + message)) fn();
  }
  var ui = {
    tab: function (t) { studentTab = t; rerender(); },
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
    giveCustom: function (sid) {
      var v = root.prompt ? root.prompt('How many coins? Use a minus sign to take coins away (for example -10).', '10') : null;
      if (v === null) return; ui.give(sid, Number(v));
    },
    setPrice: function (kind, key, v) { v = Math.max(1, Math.round(Number(v) || 1)); (kind === 'item' ? data().config.itemPrices : data().config.boxPrices)[key] = v; save(); },
    setPriv: function (id, field, v) {
      var p = privilege(id); if (!p) return;
      p[field] = field === 'active' ? !!v : Math.max(field === 'price' ? 1 : 0, Math.round(Number(v) || 0)); save();
    },
    removePriv: function (id) {
      confirm('Remove this reward?', 'Students will no longer see it. Past requests are kept.', 'Remove', function () { data().config.privileges = data().config.privileges.filter(function (p) { return p.id !== id; }); save(); rerender(); });
    },
    addPriv: function () {
      var name = root.prompt ? root.prompt('Name of the new reward (for example: Choose the story):', '') : null; if (!name) return;
      var price = root.prompt ? root.prompt('How many coins?', '50') : null; if (price === null) return;
      data().config.privileges.push({ id: uid('p'), icon: '🎁', name: name.trim(), price: Math.max(1, Math.round(Number(price) || 50)), weeklyLimit: 1, active: true }); save(); rerender();
    },
    undo: function (pid) {
      confirm('Undo this purchase?', 'The coins go back to the student and the item or unopened box is removed.', 'Undo purchase', function () { var r = undoPurchase(pid); notify(r.success ? 'Purchase undone, coins refunded' : r.error, r.success ? 'success' : 'error'); rerender(); });
    }
  };

  root.ClassroomStore = {
    ui: ui, data: data, wallet: wallet, balance: balance, grant: grant, buyItem: buyItem, buyBox: buyBox,
    requestPrivilege: requestPrivilege, decide: decide, undoPurchase: undoPurchase, shopItems: shopItems, usedThisWeek: usedThisWeek, DEFAULTS: DEFAULTS
  };
  root.renderClassroomStoreView = function (container) {
    var role = store.getRole ? store.getRole() : 'teacher';
    if (role === 'student') renderStudent(container); else renderTeacher(container);
  };
})(typeof window !== 'undefined' ? window : this);
