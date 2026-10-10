/* Monster Closet: pick a pupil, try things on the 3D monster, save.
   Big live preview, picture cards, category tabs. Uses the same rules as the old studio:
   level locks, shop items must be owned, saved through store.updateMonsterProfile. Adds the view "closet".
   Only meant for the 3D (illustrated) monsters: the entry points are hidden while window.EAA_ILLUSTRATED_MONSTERS is not true. */
(function (root) {
  'use strict';
  var ART = 'platform-art/';
  function S() { return root.schoolStore || root.store; }
  function D() { return root.MonsterDressUp; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function on3d() { return root.EAA_ILLUSTRATED_MONSTERS === true && !!D(); }
  function clone(o) { return JSON.parse(JSON.stringify(o || {})); }

  var TABS = [
    { id: 'species', label: 'Monster', icon: 'species' },
    { id: 'hat', label: 'Hats', cat: 'hat', slot: 'hat' },
    { id: 'glasses', label: 'Glasses', cat: 'glasses', slot: 'glasses' },
    { id: 'accessory', label: 'Extras', cat: 'accessory', slot: 'accessory' },
    { id: 'clothing', label: 'Outfits', cat: 'clothing', slot: 'clothing' },
    { id: 'backpack', label: 'Backpacks', cat: 'backpack', slot: 'backpack' },
    { id: 'aura', label: 'Auras', cat: 'aura', slot: 'aura' },
    { id: 'background', label: 'Worlds', cat: 'background', slot: 'background' }
  ];
  var SPECIES = [
    { color: 'blue', species: 'aquafind', name: 'Aqua Fin' }, { color: 'orange', species: 'emberwing', name: 'Ember Wing' },
    { color: 'green', species: 'florasprout', name: 'Flora Sprout' }, { color: 'purple', species: 'astralight', name: 'Astra Light' },
    { color: 'gold', species: 'sparktail', name: 'Spark Tail' }, { color: 'white', species: 'frostfluff', name: 'Frost Fluff' },
    { color: 'teal', species: 'breezefin', name: 'Breeze Fin' }, { color: 'brown', species: 'terrashell', name: 'Terra Shell' }
  ];
  var mc = null; // { id, tab, draft:{baseColor, equipped}, orig, state }

  function students() {
    var st = S(), role = st.getRole ? st.getRole() : 'teacher';
    if (role === 'student') { var me = st.getActiveStudent ? st.getActiveStudent() : null; return me ? [me] : []; }   /* a pupil dresses only their own monster */
    var c = st.getActiveClass(); return c ? st.getStudentsByClass(c.id) : [];
  }
  function monsterState(id) { try { return S().calculateMonsterState(id) || {}; } catch (e) { return {}; } }
  function reqLevel(item) { return (item.unlockRequirement && item.unlockRequirement.level) || item.unlockLevel || 1; }
  function owns(id, item) {
    if (!item || item.unlockType !== 'store') return true;
    try {
      var inv = S().getStudentInventory ? S().getStudentInventory(id) : [];
      if (inv.some(function (e) { return e.itemId === item.id; })) return true;
      var pr = S().getMonsterProfile(id); return !!(pr && pr.unlockedItems && pr.unlockedItems.indexOf(item.id) !== -1);
    } catch (e) { return false; }
  }
  function nameOf(id) { var s = S().getStudent(id); return s ? (s.firstName || s.name || 'Pupil') : 'Pupil'; }

  /* items of one tab that the 3D art can show */
  function itemsFor(tab) {
    var dr = D(), list = [];
    if (tab.id === 'aura' || tab.id === 'background') {
      var names = tab.id === 'aura' ? dr.lists.auras : dr.lists.backgrounds, pre = tab.id === 'aura' ? 'aura-' : 'bg-';
      (S().getMonsterItems(tab.cat) || []).forEach(function (it) { var n = String(it.id).replace(pre, ''); if (names.indexOf(n) !== -1) list.push({ item: it, pic: (tab.id === 'aura' ? 'assets/monsters/aura-art/aura_' : 'assets/monsters/bg-art/bg_') + n + '.webp' }); });
    } else {
      (S().getMonsterItems(tab.cat) || []).forEach(function (it) { if (dr.supportedItem(it.id)) list.push({ item: it, pic: dr.itemPicture(it.id) }); });
    }
    return list;
  }

  function css() {
    if (document.getElementById('mc-css')) return;
    var st = document.createElement('style'); st.id = 'mc-css';
    st.textContent = '' +
      '.mc{font-family:Fredoka,Nunito,system-ui,sans-serif;color:#fff;border-radius:24px;padding:16px 20px 30px;background:radial-gradient(circle at 10% 6%,rgba(255,255,255,.35),transparent 42%),linear-gradient(180deg,#6b7be3 0%,#7c68d8 55%,#9170db 100%)}' +
      '.mc h1{margin:0;font-size:1.8rem;font-weight:600;display:flex;align-items:center;gap:10px}.mc h1 img{height:1.4em}' +
      '.mc-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}' +
      '.mc-pupils{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 10px;margin-bottom:8px}.mc-pupils::-webkit-scrollbar{height:6px}' +
      '.mc-p{flex:none;display:flex;flex-direction:column;align-items:center;gap:2px;width:84px;padding:6px 4px 5px;border:0;border-bottom:4px solid rgba(60,50,140,.35);border-radius:16px;background:rgba(255,255,255,.88);color:#2f2e6b;font:700 .8rem Fredoka,sans-serif;cursor:pointer;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
      '.mc-p img{height:52px;width:auto;object-fit:contain}.mc-p span{max-width:78px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mc-p:active{transform:translateY(3px);border-bottom-width:1px}.mc-p.on{background:#f59e0b;color:#2b1700;border-bottom-color:#b45309}' +
      '.mc-main{display:grid;grid-template-columns:minmax(300px,380px) 1fr;gap:18px;align-items:start}' +
      '.mc-prev{position:sticky;top:72px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.35);border-radius:24px;padding:14px;text-align:center;backdrop-filter:blur(8px);box-shadow:0 10px 22px -12px rgba(30,20,100,.6)}' +
      '.mc-stage{width:100%;aspect-ratio:1/1;border-radius:20px;overflow:hidden;background:rgba(255,255,255,.2)}.mc-stage>*{width:100%!important;height:100%!important}' +
      '.mc-prev b{display:block;font-size:1.5rem;font-weight:600;margin-top:8px}.mc-prev small{opacity:.92;font-size:1rem;font-weight:600}' +
      '.mc-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px}' +
      '.mc-btn{font:700 1.05rem Fredoka,sans-serif;cursor:pointer;border:0;border-bottom:5px solid rgba(60,50,140,.35);border-radius:14px;padding:9px 16px;background:#fff;color:#2f2e6b;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}.mc-btn:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.mc-btn.go{background:#10b981;color:#fff;border-bottom-color:#047857}.mc-btn[disabled]{opacity:.45;pointer-events:none}' +
      '.mc-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}' +
      '.mc-tab{display:flex;align-items:center;gap:6px;font:700 .95rem Fredoka,sans-serif;cursor:pointer;border:0;border-bottom:4px solid rgba(60,50,140,.3);border-radius:14px;padding:6px 12px 6px 8px;background:rgba(255,255,255,.88);color:#2f2e6b}.mc-tab img{height:30px;width:30px;object-fit:contain}.mc-tab.on{background:#f59e0b;color:#2b1700;border-bottom-color:#b45309}' +
      '.mc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px}' +
      '.mc-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px 8px;border:0;border-bottom:5px solid rgba(60,50,140,.3);border-radius:18px;background:rgba(255,255,255,.92);color:#2f2e6b;font:700 .85rem Fredoka,sans-serif;cursor:pointer;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
      '.mc-card:hover{transform:translateY(-2px)}.mc-card:active{transform:translateY(4px);border-bottom-width:1px}.mc-card img{height:76px;width:100%;object-fit:contain}.mc-card .none{height:76px;display:flex;align-items:center;justify-content:center;font-size:2.4rem;opacity:.6}' +
      '.mc-card.on{outline:4px solid #f59e0b;background:#fff7e0}.mc-card.lock{opacity:.5;filter:grayscale(.7);pointer-events:none;cursor:not-allowed}' +
      '.mc-note{background:rgba(255,255,255,.9);color:#2f2e6b;border-radius:18px;padding:18px 20px;font-weight:700;font-size:1.1rem}.mc-pill{font:700 .7rem Fredoka,sans-serif;background:#3730a3;color:#fff;border-radius:99px;padding:1px 8px}.mc-card.wob{animation:mcWob .45s}' +
      '@keyframes mcWob{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateX(-3px)}}' +
      '@media(max-width:900px){.mc-main{grid-template-columns:1fr}.mc-prev{position:static}}';
    document.head.appendChild(st);
  }

  function open(id) { root.MonsterCloset.pupil = id; if (root.switchView) root.switchView('closet'); }
  function dirty() { return JSON.stringify(mc.draft) !== JSON.stringify(mc.orig); }

  function setPupil(id) {
    var st = S(), prof = clone(st.getMonsterProfile(id)), m = monsterState(id);
    var eq = Object.assign({}, prof.equipped || {});
    mc = { id: id, tab: (mc && mc.tab) || 'species', draft: { baseColor: prof.baseColor || 'blue', equipped: eq }, orig: null, level: Number(m.currentLevel) || 1, stage: m.stageKey || 'baby' };
    mc.orig = clone(mc.draft);
  }

  function previewHtml() {
    var dr = D(), eq = Object.assign({}, mc.draft.equipped, { body: 'body-' + mc.draft.baseColor });
    try { return dr.render({ color: mc.draft.baseColor, stage: mc.stage, equipped: eq, size: '100%', showBackground: true }); } catch (e) { return ''; }
  }
  function cardHtml(tab, entry) {
    var it = entry.item, locked = reqLevel(it) > mc.level, notOwned = !owns(mc.id, it), cur = mc.draft.equipped[tab.slot] === it.id;
    var pill = locked ? '<span class="mc-pill">🔒 Level ' + reqLevel(it) + '</span>' : (notOwned ? '<span class="mc-pill">🛍 Shop</span>' : '');
    return '<button type="button" class="mc-card' + (cur ? ' on' : '') + ((locked || notOwned) ? ' lock' : '') + '" ' + ((locked || notOwned) ? 'tabindex="-1" aria-disabled="true"' : 'onclick="MonsterCloset.pick(\'' + esc(tab.id) + '\',\'' + esc(it.id) + '\')"') + '>' +
      '<img src="' + esc(entry.pic) + '" alt="" draggable="false" onerror="this.style.opacity=0.2"><span>' + esc(String(it.name || it.id).replace(/^[^\w]+/u, '')) + '</span>' + pill + '</button>';
  }
  function gridHtml() {
    var tab = TABS.filter(function (t) { return t.id === mc.tab; })[0], dr = D();
    var canWear = dr.hasArt(mc.draft.baseColor, mc.stage === 'cracking_egg' ? 'egg' : mc.stage) && mc.stage !== 'egg';
    if (tab.id !== 'species' && tab.id !== 'aura' && tab.id !== 'background' && !canWear) return '<div class="mc-note">🥚 This monster cannot wear things yet' + (mc.stage === 'egg' || mc.stage === 'cracking_egg' ? ' (it is still an egg).' : ' (its fit is still being measured). Pick another monster, or choose an aura or a world.') + '</div>';
    if (tab.id === 'species') {
      var curSp = dr.speciesForColor(mc.draft.baseColor);
      return '<div class="mc-grid">' + SPECIES.map(function (sp) {
        return '<button type="button" class="mc-card' + (sp.species === curSp ? ' on' : '') + '" onclick="MonsterCloset.pickSpecies(\'' + sp.color + '\')"><img src="assets/monsters/art/' + sp.species + '_baby.webp" alt="" draggable="false"><span>' + esc(sp.name) + '</span></button>';
      }).join('') + '</div>';
    }
    var cards = itemsFor(tab).map(function (e) { return cardHtml(tab, e); }).join('');
    var none = '<button type="button" class="mc-card' + ((!mc.draft.equipped[tab.slot] || mc.draft.equipped[tab.slot] === 'none') ? ' on' : '') + '" onclick="MonsterCloset.pick(\'' + tab.id + '\',\'none\')"><div class="none">✕</div><span>None</span></button>';
    return '<div class="mc-grid">' + none + cards + '</div>';
  }
  function tabIcon(tab) {
    var dr = D(); if (tab.id === 'species') return 'assets/monsters/art/aquafind_baby.webp';
    if (tab.id === 'aura') return 'assets/monsters/aura-art/aura_sparkle.webp'; if (tab.id === 'background') return 'assets/monsters/bg-art/bg_meadow.webp';
    var first = itemsFor(tab)[0]; return first ? first.pic : '';
  }

  function render(container) {
    css();
    if (!on3d()) { container.innerHTML = '<div style="padding:40px;text-align:center">The Monster Closet is for the 3D monsters, which are switched off right now.</div>'; return; }
    var list = students(); if (!list.length) { container.innerHTML = '<div style="padding:40px;text-align:center">No pupils in this class yet.</div>'; return; }
    var want = (root.MonsterCloset && root.MonsterCloset.pupil) || (mc && mc.id); if (!list.some(function (s) { return s.id === want; })) want = list[0].id;
    if (!mc || mc.id !== want) setPupil(want);
    var st = S(), name = nameOf(mc.id), isStu = (st.getRole && st.getRole() === 'student'), backView = isStu ? 'monster' : 'rewards', backLabel = isStu ? 'My monster' : 'Rewards';
    container.innerHTML = '<div class="mc"><div class="mc-top"><h1><img src="' + ART + 'r_chest.webp" alt="">Monster Closet</h1><div class="mc-btns" style="margin:0"><button type="button" class="mc-btn" onclick="switchView(\'' + backView + '\')">← ' + backLabel + '</button></div></div>' +
      (list.length > 1 ? '<div class="mc-pupils">' : '<div class="mc-pupils" style="display:none">') + list.map(function (s) {
        var m = monsterState(s.id), prof = st.getMonsterProfile(s.id), img = ''; try { img = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, prof, m) : ''; } catch (e) { img = ''; }
        return '<button type="button" class="mc-p' + (s.id === mc.id ? ' on' : '') + '" onclick="MonsterCloset.who(\'' + esc(s.id) + '\')">' + (img ? '<img src="' + esc(img) + '" alt="">' : '<span style="font-size:2rem">🐾</span>') + '<span>' + esc(s.firstName || s.name || '') + '</span></button>';
      }).join('') + '</div>' +
      '<div class="mc-main"><div class="mc-prev"><div class="mc-stage" id="mc-stage">' + previewHtml() + '</div><b>' + esc(name) + '’s monster</b><small>Level ' + mc.level + '</small>' +
      '<div class="mc-btns"><button type="button" class="mc-btn go" id="mc-save" onclick="MonsterCloset.save()" ' + (dirty() ? '' : 'disabled') + '>💾 Save</button><button type="button" class="mc-btn" id="mc-undo" onclick="MonsterCloset.undo()" ' + (dirty() ? '' : 'disabled') + '>↺ Undo</button></div></div>' +
      '<div><div class="mc-tabs">' + TABS.map(function (t) { var ic = tabIcon(t); return '<button type="button" class="mc-tab' + (t.id === mc.tab ? ' on' : '') + '" onclick="MonsterCloset.tab(\'' + t.id + '\')">' + (ic ? '<img src="' + esc(ic) + '" alt="">' : '') + esc(t.label) + '</button>'; }).join('') + '</div><div id="mc-grid">' + gridHtml() + '</div></div></div></div>';
  }
  function refresh() {
    var c = document.getElementById('app-view-container'); if (!c || !document.getElementById('mc-stage')) return;
    document.getElementById('mc-stage').innerHTML = previewHtml();
    document.getElementById('mc-grid').innerHTML = gridHtml();
    var d = dirty(); var s = document.getElementById('mc-save'), u = document.getElementById('mc-undo'); if (s) s.disabled = !d; if (u) u.disabled = !d;
    [].forEach.call(document.querySelectorAll('.mc-tab'), function (b) { b.classList.toggle('on', b.getAttribute('onclick').indexOf("'" + mc.tab + "'") !== -1); });
  }

  var api = {
    pupil: null, render: render, open: open, on3d: on3d,
    who: function (id) { if (mc && mc.id !== id && dirty() && root.confirm && !root.confirm('Leave without saving?')) return; root.MonsterCloset.pupil = id; mc = null; var c = document.getElementById('app-view-container'); if (c) render(c); },
    tab: function (id) { mc.tab = id; refresh(); },
    pickSpecies: function (color) { mc.draft.baseColor = color; mc.draft.equipped.body = 'body-' + color; refresh(); },
    pick: function (tabId, itemId) {
      var tab = TABS.filter(function (t) { return t.id === tabId; })[0]; if (!tab) return;
      if (itemId === 'none') { mc.draft.equipped[tab.slot] = 'none'; refresh(); return; }
      var it = S().getMonsterItem ? S().getMonsterItem(itemId) : null; if (!it) return;
      if (reqLevel(it) > mc.level || !owns(mc.id, it)) return;            // locked or not owned: never wear it
      if (tab.id !== 'aura' && tab.id !== 'background' && !D().hasArt(mc.draft.baseColor, mc.stage)) return;
      mc.draft.equipped[tab.slot] = itemId; refresh();
    },
    undo: function () { mc.draft = clone(mc.orig); refresh(); },
    save: function () {
      var st = S(), student = st.getStudent(mc.id); if (!student) return;
      var eq = mc.draft.equipped, was = mc.orig.equipped || {}, bad = Object.keys(eq).filter(function (k) { var id = eq[k]; if (!id || id === 'none' || id === was[k]) return false; var it = st.getMonsterItem(id); return it && (reqLevel(it) > mc.level || !owns(mc.id, it)); });   /* only what was changed here must be allowed */
      if (bad.length) { if (root.showNotification) root.showNotification('Some items are locked for this monster.', 'error'); return; }
      delete student.custom_avatar_url; delete student.custom_avatar;
      student.monster_customization = { baseColor: mc.draft.baseColor, equipped: Object.assign({}, eq) };
      st.updateMonsterProfile(mc.id, { baseColor: mc.draft.baseColor, equipped: eq, custom_avatar_url: undefined });
      if (st.saveState) st.saveState();
      if (root.showNotification) root.showNotification('✓ ' + nameOf(mc.id) + '’s monster saved!');
      mc.orig = clone(mc.draft); refresh();
      try { root.classSoundboard && root.classSoundboard.playFanfare && root.classSoundboard.playFanfare(); } catch (e) { /* optional */ }
    }
  };
  root.MonsterCloset = api; root.renderMonsterCloset = render;
})(typeof window !== 'undefined' ? window : this);
