/* Practice Island — the store. Pupils buy monster items with the same coins as the teacher's platform.
   The cloud decides prices, levels and coins (island_shop, island_buy); this page only shows them. After buying, the normal Dressing Room lets them wear it. */
(function (root) {
  'use strict';

  var S = { data: null, tab: 'hat', ask: null, note: '', busy: false };
  var App = function () { return root.IslandApp; };
  var ses = function () { var st = App() && App().state && App().state(); return st && st.session; };
  var A = function () { return root.IslandAudio || {}; };
  function sound(n) { if (A()[n]) { try { A()[n](); } catch (e) { /* no sound */ } } }
  function say(t) { if (A().speak) A().speak(t); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sb() { return root.AdventureSupabase && root.AdventureSupabase.client; }
  function wearable() { var m = {}; root.IslandData.getAllMonsterItems().forEach(function (i) { m[i.id] = i; }); return m; }

  /* In demo mode nothing leaves the device */
  var RETIRED = { 'cs-gat': 1, 'cs-hanbok': 1, 'cs-lantern': 1 };
  var LADDER = { mythic: [500, 6], legendary: [200, 5], epic: [90, 4], rare: [40, 3], common: [15, 1] };
  var SHELVES = [['mythic', 'Mythic', '🔴', 'The far dreams'], ['legendary', 'Legendary', '🟡', 'Very few monsters have these'], ['epic', 'Epic', '🟣', 'Worth saving for'], ['rare', 'Cool', '🟢', 'Not far away'], ['common', 'Everyday', '⚪', 'Small wins, soon']];
  var XP_AT = [0, 30, 200, 500, 1000, 2000, 3500];
  function demoShop() {
    var xp = 0; try { xp = App().getEffectiveXP(); } catch (e) { xp = 0; }
    var lvl = 1; XP_AT.forEach(function (t, i) { if (xp >= t) lvl = i + 1; });
    var items = root.IslandData.getAllMonsterItems().filter(function (i) { return i.unlockType === 'store' && !RETIRED[i.id]; })
      .map(function (i) { var l = LADDER[i.rarity] || LADDER.common; return { id: i.id, name: i.name, icon: i.icon, category: i.category, rarity: i.rarity || 'common', price: l[0], level: l[1] }; });
    var tr = items.filter(function (i) { return i.rarity === 'epic' && i.level <= lvl; })[0];
    if (tr) { tr.was = tr.price; tr.price = Math.ceil(tr.price * .7); }
    return { coins: 130, level: lvl, xp: xp, owned: [], items: items, treasure: tr ? { id: tr.id, days: 4 } : null };
  }

  async function load() {
    var s = ses();
    if (s.isDemo) {
      S.demo = S.demo || demoShop();
      var d = s.doc || {}, paid = S.demoPaid = S.demoPaid || {};
      Object.keys(d.chests || {}).forEach(function (k) { if (d.chests[k] && !paid[k]) { paid[k] = 1; S.demo.coins += 10; } });
      Object.keys(d.dailyDone || {}).forEach(function (k) { if (d.dailyDone[k] && !paid[k]) { paid[k] = 1; S.demo.coins += 2; } });
      return S.demo;
    }
    var client = sb();
    if (!client) throw new Error('offline');
    var res = await client.rpc('island_shop', { p_code: s.code });
    if (res.error || !res.data) throw new Error((res.error && res.error.code) || 'closed');
    return res.data;
  }
  async function buy(item) {
    var s = ses();
    if (s.isDemo) {
      if (S.demo.coins < item.price) return { ok: false, error: 'coins' };
      S.demo.coins -= item.price; S.demo.owned.push(item.id);
      return { ok: true, coins: S.demo.coins, item: item.id };
    }
    var res = await sb().rpc('island_buy', { p_code: s.code, p_item: item.id });
    if (res.error) throw new Error(res.error.code || 'failed');
    return res.data;
  }
  /* The Dressing Room reads this list, so a new item can be worn straight away */
  function rememberOwned(id) {
    var st = ses().student; st.monsterProfile = st.monsterProfile || {};
    var list = st.monsterProfile.unlockedItems = st.monsterProfile.unlockedItems || [];
    if (list.indexOf(id) === -1) list.push(id);
  }

  function root2() { return document.getElementById('isl-modal-root'); }
  function frame(inner) {
    var d = S.data;
    root2().innerHTML =
      '<div class="isl-modal-backdrop" id="isl-shop-backdrop"><div class="isl-card-modal isl-shop">' +
        '<div class="isl-mission-top">' +
          '<div class="isl-shop-title">🛒 Store</div>' +
          (d ? '<div class="isl-shop-coins" id="isl-shop-coins">🪙 ' + (Number(d.coins) || 0) + '</div>' : '') +
          '<button type="button" class="isl-btn violet isl-shop-dress" onclick="IslandShop.toDress()">👕 Dress up</button>' +
          '<button type="button" class="isl-btn isl-shop-x" aria-label="Close" onclick="IslandApp.closeModal()">✕</button>' +
        '</div>' + inner +
      '</div></div>';
  }
  function message(icon, text) { frame('<div class="isl-shop-msg"><div class="isl-shop-msg-icon">' + icon + '</div>' + esc(text) + '</div>'); }

  function draw() {
    var d = S.data, known = wearable(), cats = root.IslandData.MONSTER_CATEGORIES, owned = {}, colorKey = ((ses().student.monsterProfile || {}).baseColor) || 'blue';
    (d.owned || []).forEach(function (id) { owned[id] = 1; });
    /* Only what a pupil can really wear here. What they own is in the Dressing Room, not on sale. */
    var sale = (d.items || []).filter(function (i) { return known[i.id] && !owned[i.id] && !RETIRED[i.id]; });
    if (!sale.length) { frame('<div class="isl-shop-msg"><div class="isl-shop-msg-icon">🎉</div>You have everything in the store!</div>'); return; }
    var card = function (i) {
      var locked = Number(i.level) > Number(d.level), thumb = thumbOf(i, known, colorKey, 72), cant = !locked && Number(d.coins) < Number(i.price);
      return '<div class="isl-shop-slot"><button type="button" class="isl-item-card isl-shop-card' + (locked ? ' locked' : '') + (cant ? ' isl-shop-cant' : '') + '" data-item-id="' + esc(i.id) + '"' +
        (locked ? ' disabled aria-disabled="true"' : ' onclick="IslandShop.pick(\'' + esc(i.id) + '\')"') + '>' + thumb + '<span>' + esc(i.name) + '</span>' +
        (isDream(i.id) ? '<span class="isl-shop-dream-tag">🌟 My dream</span>' : '') +
        (locked ? '<span class="monster-item-lock-pill">🔒 Level ' + Number(i.level) + '</span><span class="isl-shop-far">' + farText(i) + '</span>' : '<span class="isl-shop-price">🪙 ' + Number(i.price) + '</span>') + '</button>' +
        (locked && !isDream(i.id) ? '<button type="button" class="isl-shop-dreamlock" aria-label="Make it my dream" onclick="IslandShop.dreamOf(\'' + esc(i.id) + '\')">🌟</button>' : '') + '</div>';
    };
    var shelves = SHELVES.map(function (sh) {
      var row = sale.filter(function (i) { return (i.rarity || 'common') === sh[0]; });
      if (!row.length) return '';
      var head = row[0], locked = Number(head.level) > Number(d.level);
      return '<section class="isl-shelf isl-shelf-' + sh[0] + '" id="isl-shelf-' + sh[0] + '"><div class="isl-shelf-top"><b>' + sh[2] + ' ' + sh[1] + '</b><span>' + sh[3] + (locked ? ' · Level ' + Number(head.level) : '') + '</span></div>' +
        (sh[0] === 'mythic' ? mythicHero() : '') + '<div class="isl-shelf-row">' + row.map(card).join('') + '</div></section>';
    }).join('');
    var nowCan = sale.filter(function (i) { return Number(i.level) <= Number(d.level) && Number(i.price) <= Number(d.coins); }).length;
    var jump = '<div class="isl-shop-jump">' + SHELVES.map(function (sh) { return sale.some(function (i) { return (i.rarity || 'common') === sh[0]; }) ? '<button type="button" class="isl-btn" onclick="IslandShop.jump(\'' + sh[0] + '\')">' + sh[2] + ' ' + sh[1] + '</button>' : ''; }).join('') + '</div>';
    frame(treasureHtml(known, colorKey, owned) + (nowCan ? '<div class="isl-shop-now">✨ You can buy ' + nowCan + (nowCan === 1 ? ' thing' : ' things') + ' now!</div>' : '') + jump + '<div class="isl-shelves" id="isl-shop-items">' + shelves + '</div>' + askHtml());
    if (S.scrollTo) { var el = document.getElementById('isl-shelf-' + S.scrollTo); S.scrollTo = null; if (el) el.scrollIntoView({ block: 'start' }); }
    else if (S.keepTop !== undefined) { var box = document.getElementById('isl-shop-items'); if (box) box.scrollTop = S.keepTop; }
  }
  /* The dream in full colour: the pupil's own monster in the whole Mythic set. It is a picture, not a card, so the locked cards keep their lock. */
  function mythicHero() {
    var R = root.MonsterRenderer, s = ses(), prof = s.student.monsterProfile || {};
    if (!R || !R.renderMonsterSVG) return '';
    var eq = Object.assign({}, prof.equipped || {}, (s.doc && s.doc.look) || {}); delete eq.background;
    eq.hat = 'cs-my-rainbow-crown'; eq.backpack = 'cs-my-phoenix-wings'; eq.aura = 'cs-my-aurora';
    var stages = ['baby', 'baby', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'], svg = '';
    try { svg = R.renderMonsterSVG({ stage: stages[Math.max(0, Math.min(6, Number(S.data.level) - 1))], color: prof.baseColor || 'blue', equipped: eq, size: 150, animated: true, isAvatar: true }); } catch (e) { return ''; }
    return '<div class="isl-shop-hero"><div class="isl-shop-hero-pic">' + svg + '</div><div class="isl-shop-hero-text"><b>This could be you!</b><span>Level 6: ' + Math.max(0, 2000 - (Number(S.data.xp) || 0)) + ' XP to go</span></div></div>';
  }
  function thumbOf(i, known, colorKey, size) {
    var thumb = '<div class="isl-shop-emoji">' + esc(i.icon || '✨') + '</div>';
    if (root.MonsterRenderer && root.MonsterRenderer.renderMonsterItemThumbnail) {
      var svg = root.MonsterRenderer.renderMonsterItemThumbnail(known[i.id], { size: size, colorKey: colorKey });
      if (svg && /<(path|circle|rect|ellipse|polygon|image|text)/i.test(svg)) thumb = svg;
    }
    return thumb;
  }
  function farText(i) {
    var need = (XP_AT[Number(i.level) - 1] || 0) - (Number(S.data.xp) || 0);
    return need > 0 ? need + ' XP to go' : 'Soon!';
  }
  /* Try it on: the pupil's own monster wearing the item, before buying */
  function tryOn(a) {
    var R = root.MonsterRenderer, s = ses(), prof = s.student.monsterProfile || {};
    if (!R || !R.renderMonsterSVG || !a.category) return '';
    if (a.category === 'trail') return '';
    var stages = ['baby', 'baby', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];
    var slot = ((root.IslandData.MONSTER_CATEGORIES.filter(function (c) { return c.id === a.category; })[0]) || {}).slot || a.category;
    var eq = Object.assign({}, prof.equipped || {}, (s.doc && s.doc.look) || {}); delete eq.background; eq[slot] = a.id;
    try { return '<div class="isl-shop-try">' + R.renderMonsterSVG({ stage: stages[Math.max(0, Math.min(6, Number(S.data.level) - 1))], color: prof.baseColor || 'blue', equipped: eq, size: 170, animated: true, isAvatar: true }) + '</div>'; }
    catch (e) { return ''; }
  }
  function isDream(id) { var d = ses().doc; return !!(d && d.dream && d.dream.id === id); }
  function treasureHtml(known, colorKey, owned) {
    var d = S.data, t = d.treasure, item = t && (d.items || []).filter(function (i) { return i.id === t.id; })[0];
    if (!item || !known[item.id] || owned[item.id]) return '';
    var locked = Number(item.level) > Number(d.level), thumb = thumbOf(item, known, colorKey, 84);
    var days = Number(t.days) || 1;
    return '<button type="button" class="isl-shop-treasure' + (locked ? ' locked' : '') + '" id="isl-shop-treasure"' + (locked ? ' disabled aria-disabled="true"' : ' onclick="IslandShop.pick(\'' + esc(item.id) + '\')"') + '>' +
      '<div class="isl-shop-treasure-pic">' + thumb + '</div>' +
      '<div class="isl-shop-treasure-text"><small>💎 Treasure of the week</small><b>' + esc(item.name) + '</b>' +
        '<span>' + (locked ? '🔒 Level ' + Number(item.level) : (item.was ? '<s>🪙 ' + Number(item.was) + '</s> ' : '') + '🪙 ' + Number(item.price)) + ' · ' + days + (days === 1 ? ' day left' : ' days left') + '</span></div>' +
    '</button>';
  }
  function dreamButton(a) { return a.id && !isDream(a.id) ? '<button type="button" class="isl-btn amber" id="isl-shop-setdream" onclick="IslandShop.setDream()">🌟 My dream</button>' : ''; }
  function askHtml() {
    var a = S.ask; if (!a) return '';
    return '<div class="isl-shop-ask" id="isl-shop-ask"><div class="isl-shop-ask-card isl-tier-' + esc(a.rarity || 'common') + (a.done && (a.rarity === 'legendary' || a.rarity === 'mythic') ? ' isl-shop-burst' : '') + '">' +
      (a.done
        ? '<div class="isl-shop-ask-icon">🎉</div><div class="isl-shop-ask-line">It is yours!<small>' + esc(a.name) + '</small></div>' +
          '<div class="isl-shop-ask-row"><button type="button" class="isl-btn emerald" id="isl-shop-wear" onclick="IslandShop.wear()">👕 Wear it</button><button type="button" class="isl-btn" onclick="IslandShop.noAsk()">More 🛒</button></div>'
        : a.short
        ? '<div class="isl-shop-ask-icon">🪙</div><div class="isl-shop-ask-line">You need ' + a.short + ' more coins.<small>Play to earn coins!</small></div>' +
          '<div class="isl-shop-ask-row">' + dreamButton(a) + '<button type="button" class="isl-btn" onclick="IslandShop.noAsk()">OK</button></div>'
        : (tryOn(a) || '<div class="isl-shop-ask-icon">' + esc(a.icon || '✨') + '</div>') + '<div class="isl-shop-ask-line">Buy this?<small>' + esc(a.name) + ' · 🪙 ' + a.price + '</small></div>' +
          (a.err ? '<div class="isl-shop-ask-err">' + esc(a.err) + '</div>' : '') +
          '<div class="isl-shop-ask-row"><button type="button" class="isl-btn emerald" id="isl-shop-yes" onclick="IslandShop.yes()">Yes ✓</button>' + dreamButton(a) + '<button type="button" class="isl-btn" onclick="IslandShop.noAsk()">No</button></div>') +
      '</div></div>';
  }

  async function open(tab) {
    if (!ses() || !ses().student) return;
    sound('playTap');
    if (tab) S.tab = tab;
    S.ask = null; S.data = null;
    message('🛒', 'Opening the store...');
    try { S.data = await load(); }
    catch (e) { S.data = null; message('😴', 'The store is closed now. Try again later.'); return; }
    // anything on sale that the Island's own list does not know yet joins it, so it can be worn after buying
    var known = wearable();
    (S.data.items || []).forEach(function (i) { if (!known[i.id]) root.IslandData.BASE_MONSTER_ITEMS.push({ id: i.id, name: i.name, category: i.category, icon: i.icon, unlockType: 'store', unlockLevel: 1 }); });
    (S.data.owned || []).forEach(rememberOwned);
    draw();
  }
  function pick(id) {
    var d = S.data, item = (d.items || []).filter(function (i) { return i.id === id; })[0];
    if (!item) return;
    if (Number(item.level) > Number(d.level)) { sound('playSoftFail'); return; }   // the card is locked; refuse here too
    sound('playTap');
    var box = document.getElementById('isl-shop-items'); S.keepTop = box ? box.scrollTop : 0;
    S.ask = Number(d.coins) < Number(item.price)
      ? { short: Number(item.price) - Number(d.coins), id: item.id, name: item.name, icon: item.icon, price: Number(item.price), category: item.category, rarity: item.rarity }
      : { id: item.id, name: item.name, icon: item.icon, price: Number(item.price), category: item.category, rarity: item.rarity };
    if (S.ask.short) sound('playSoftFail');
    draw();
  }
  async function yes() {
    var a = S.ask, d = S.data; if (!a || S.busy) return;
    var item = (d.items || []).filter(function (i) { return i.id === a.id; })[0]; if (!item) return;
    S.busy = true;
    var r = null;
    try { r = await buy(item); } catch (e) { r = null; }
    S.busy = false;
    if (!r) { a.err = 'That did not work. Your coins are safe. Try again.'; draw(); return; }
    if (r.ok) {
      d.coins = r.coins; d.owned = (d.owned || []).concat([a.id]); rememberOwned(a.id);
      if (isDream(a.id)) clearDream();
      S.ask = { done: true, id: a.id, name: a.name, category: a.category, rarity: a.rarity };
      sound('playFanfare'); say('Well done!');
      if (a.rarity === 'legendary' || a.rarity === 'mythic') setTimeout(function () { sound('playFanfare'); }, 650);
    } else if (r.error === 'owned') {
      d.owned = (d.owned || []).concat([a.id]); rememberOwned(a.id);
      S.ask = { done: true, id: a.id, name: a.name, category: a.category, rarity: a.rarity };
    } else if (r.error === 'coins') {
      if (typeof r.coins === 'number') d.coins = r.coins;
      S.ask = { short: Math.max(1, Number(item.price) - Number(d.coins)), id: a.id, name: a.name, icon: a.icon, price: a.price }; sound('playSoftFail');
    } else if (r.error === 'level') {
      S.ask = null; d.level = Math.min(Number(d.level), Number(item.level) - 1); sound('playSoftFail');
    } else { a.err = 'That did not work. Your coins are safe. Try again.'; }
    draw();
  }
  function wear() {
    var a = S.ask; if (!a) return;
    var slot = ((root.IslandData.MONSTER_CATEGORIES.filter(function (c) { return c.id === a.category; })[0]) || {}).slot || a.category;
    App().openDressingRoom(); App().setDressTab(a.category); App().selectDressItem(slot, a.id);
  }

  /* ---------- the dream: one thing a pupil is saving for, always on screen ---------- */
  function saveDoc() { try { root.IslandSync.saveIslandDoc(ses()); } catch (e) { /* it saves next time */ } }
  function clearDream() { var doc = ses().doc; if (doc) { delete doc.dream; doc.updatedAt = new Date().toISOString(); saveDoc(); } }
  function setDream() {
    var a = S.ask, doc = ses().doc; if (!a || !a.id || !doc) return;
    doc.dream = { id: a.id, name: a.name, icon: a.icon, price: a.price, at: new Date().toISOString() };
    doc.updatedAt = doc.dream.at; saveDoc();
    S.ask = null; sound('playFanfare'); say('Your dream!');
    draw(); drawBar();
  }
  function dreamOf(id) {
    var item = (S.data.items || []).filter(function (i) { return i.id === id; })[0]; if (!item) return;
    S.ask = { id: item.id, name: item.name, icon: item.icon, price: Number(item.price) }; setDream();
  }
  function barEl() {
    var el = document.getElementById('isl-dream');
    if (!el) { el = document.createElement('button'); el.type = 'button'; el.id = 'isl-dream'; el.onclick = function () { open(); }; document.body.appendChild(el); }
    return el;
  }
  var lastCoins = null;
  function drawBar() {
    var s = ses(); if (!s || !s.student || !S.data) return;
    var el = barEl(), dr = s.doc && s.doc.dream, coins = Number(S.data.coins) || 0, gain = lastCoins !== null && coins > lastCoins ? coins - lastCoins : 0;
    lastCoins = coins;
    var live = dr && (S.data.items || []).filter(function (i) { return i.id === dr.id; })[0];
    if (dr && live) dr.price = live.price;   // the price can change, for example when it is the treasure
    if (!dr) { el.className = 'isl-dream-empty'; el.innerHTML = '🌟 Choose your dream <b>🪙 ' + coins + '</b>'; }
    else {
      var pct = Math.min(100, Math.round(coins / Math.max(1, Number(dr.price)) * 100)), ready = coins >= Number(dr.price) && !(live && Number(live.level) > Number(S.data.level));
      el.className = ready ? 'isl-dream-ready' : '';
      el.innerHTML = '<span class="isl-dream-icon">' + esc(dr.icon || '🌟') + '</span><span class="isl-dream-main"><span class="isl-dream-name">' + (ready ? 'You can buy it!' : esc(dr.name) + (live && Number(live.level) > Number(S.data.level) ? ' · 🔒 Level ' + Number(live.level) : '')) + '</span>' +
        '<span class="isl-dream-track"><span class="isl-dream-fill" style="width:' + pct + '%"></span></span></span><b>🪙 ' + coins + ' / ' + Number(dr.price) + '</b>';
    }
    if (gain) {
      var g = document.createElement('span'); g.className = 'isl-dream-gain'; g.textContent = '+' + gain + ' 🪙'; el.appendChild(g);
      sound('playCorrect'); setTimeout(function () { g.remove(); }, 1500);
    }
  }
  async function refreshBar() {
    if (S.refreshing || !ses() || !ses().student) return;
    S.refreshing = true;
    try { var fresh = await load(); if (!root2().querySelector('#isl-shop-backdrop')) S.data = fresh; (fresh.owned || []).forEach(rememberOwned); drawBar(); }
    catch (e) { /* no bar until the store can be reached */ }
    S.refreshing = false;
  }

  /* A Store button beside Dress up on the island map, and inside the Dressing Room */
  function addButtons() {
    var bar = document.getElementById('isl-btn-dress');
    if (bar && !document.getElementById('isl-btn-shop')) {
      var b = document.createElement('button'); b.type = 'button'; b.id = 'isl-btn-shop'; b.className = 'isl-btn amber'; b.textContent = '🛒 Store'; b.onclick = function () { open(); };
      bar.parentNode.insertBefore(b, bar.nextSibling);
    }
    var room = document.querySelector('#isl-dress-backdrop .isl-mission-top');
    if (room && !room.querySelector('.isl-shop-enter')) {
      var c = document.createElement('button'); c.type = 'button'; c.className = 'isl-btn amber isl-shop-enter'; c.textContent = '🛒 Store'; c.onclick = function () { open(); };
      room.insertBefore(c, room.lastElementChild);
    }
  }
  function watch() {
    var wasOpen = false;
    var run = function () {
      addButtons();
      var openNow = !!(root2() && root2().children.length);
      document.body.classList.toggle('isl-modal-open', openNow);
      if (wasOpen && !openNow) refreshBar();
      wasOpen = openNow;
    };
    var first = setInterval(function () { if (ses() && ses().student) { clearInterval(first); refreshBar(); } }, 400);
    ['isl-modal-root', 'isl-topbar'].forEach(function (id) { var el = document.getElementById(id); if (el) new MutationObserver(run).observe(el, { childList: true, subtree: id === 'isl-topbar' }); });
    run();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();

  root.IslandShop = {
    open: open, pick: pick, yes: yes, wear: wear, setDream: setDream, refresh: refreshBar,
    dreamOf: dreamOf,
    jump: function (k) { sound('playTap'); var el = document.getElementById('isl-shelf-' + k); if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); },
    noAsk: function () { var box = document.getElementById('isl-shop-items'); S.keepTop = box ? box.scrollTop : 0; S.ask = null; sound('playTap'); draw(); },
    toDress: function () { App().openDressingRoom(); }
  };
})(typeof window !== 'undefined' ? window : this);
