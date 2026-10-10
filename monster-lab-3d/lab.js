/* 3D Monster Lab: a safe test area. It only READS the monster art and the dress-up code. It never touches pupils, XP, storage or the cloud.
   Use it to: try items on every species and stage, spot items that sit wrong, check how one outfit fits all eight species,
   and preview new fit measurements (paste anchors3.json) before they are merged into js/monster-anchors.js. */
(function () {
  'use strict';
  var D = window.MonsterDressUp, ITEMS = window.LAB_ITEMS || [];
  var SPECIES = [
    { id: 'aquafind', name: 'Aqua Fin' }, { id: 'astralight', name: 'Astra Light' }, { id: 'breezefin', name: 'Breeze Fin' }, { id: 'emberwing', name: 'Ember Wing' },
    { id: 'florasprout', name: 'Flora Sprout' }, { id: 'frostfluff', name: 'Frost Fluff' }, { id: 'sparktail', name: 'Spark Tail' }, { id: 'terrashell', name: 'Terra Shell' }
  ];
  var STAGES = ['egg', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];
  var SLOTS = [['hat', 'Hats'], ['glasses', 'Glasses'], ['accessory', 'Extras'], ['backpack', 'Backpacks'], ['clothing', 'Outfits']];
  var st = { species: 'aquafind', stage: 'growing', bg: 'none', aura: 'none', slot: 'hat', worn: {}, view: 'one', showAll: false };
  var extraAnchors = {};
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hasFit(sp, stg) { var A = window.MONSTER_ANCHORS || {}; var a = A[sp + '_' + stg]; return !!(a && a.kind === 'monster'); }
  function nameOf(id) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return String(ITEMS[i].name || id).replace(/^[^\w]+/u, ''); return id; }
  function itemsOf(slot) {
    return ITEMS.filter(function (i) { return (i.category === slot || (slot === 'accessory' && i.category === 'accessory')) && D.supportedItem(i.id); });
  }
  function eq(extra) { var e = Object.assign({}, st.worn, extra || {}); if (st.bg !== 'none') e.background = 'bg-' + st.bg; if (st.aura !== 'none') e.aura = 'aura-' + st.aura; return e; }
  function monster(sp, stg, equipped, size, bg) {
    try { return D.render({ species: sp, stage: stg, equipped: equipped, size: size || '100%', showBackground: !!bg }); } catch (e) { return '<div class="err">render error</div>'; }
  }
  function opt(list, cur) { return list.map(function (x) { var v = x.id || x, n = x.name || x; return '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + n + '</option>'; }).join(''); }

  function viewOne() {
    var tabs = SLOTS.map(function (s) { return '<button class="tab' + (st.slot === s[0] ? ' on' : '') + '" onclick="Lab.slot(\'' + s[0] + '\')">' + s[1] + '</button>'; }).join('');
    var list = itemsOf(st.slot), wornId = st.worn[st.slot];
    var cards = '<button class="card' + (!wornId ? ' on' : '') + '" onclick="Lab.wear(\'' + st.slot + '\',\'none\')"><div class="none">✕</div><span>None</span></button>' + list.map(function (i) {
      return '<button class="card' + (wornId === i.id ? ' on' : '') + '" onclick="Lab.wear(\'' + st.slot + '\',\'' + i.id + '\')" title="' + esc(i.id) + '"><img src="' + D.itemPicture(i.id) + '" alt=""><span>' + esc(nameOf(i.id)) + '</span><i>lvl ' + i.level + '</i></button>';
    }).join('');
    var warn = (st.stage === 'egg') ? '<p class="warn">Eggs cannot wear items.</p>' : (!hasFit(st.species, st.stage) ? '<p class="warn">⚠ No fit data for ' + st.species + ' ' + st.stage + ' yet: items will not show. Paste anchors3.json below to preview.</p>' : '');
    return '<div class="two"><div class="prev"><div class="stage">' + monster(st.species, st.stage, eq(), '100%', st.bg !== 'none') + '</div><b>' + esc(nameOfSpecies()) + ' · ' + st.stage + '</b>' + warn +
      '<div class="row"><button class="btn" onclick="Lab.clear()">✕ Take everything off</button><button class="btn" onclick="Lab.random()">🎲 Random outfit</button></div></div>' +
      '<div><div class="tabs">' + tabs + '</div><div class="grid">' + cards + '</div></div></div>';
  }
  function nameOfSpecies() { return SPECIES.filter(function (s) { return s.id === st.species; })[0].name; }

  /* every item on this monster, one by one: look for items that float, cover the face, or sit off the body */
  function viewFit() {
    if (!hasFit(st.species, st.stage)) return '<p class="warn">⚠ No fit data for ' + st.species + ' ' + st.stage + '.</p>';
    var out = '';
    SLOTS.forEach(function (s) {
      var list = itemsOf(s[0]); if (!list.length) return;
      out += '<h3>' + s[1] + ' (' + list.length + ')</h3><div class="mini">' + list.map(function (i) {
        var e = {}; e[s[0]] = i.id; return '<div class="cell"><div class="stage s">' + monster(st.species, st.stage, e, '100%', false) + '</div><span>' + esc(nameOf(i.id)) + '</span></div>';
      }).join('') + '</div>';
    });
    return '<p class="hint">Each item alone on <b>' + esc(nameOfSpecies()) + ' · ' + st.stage + '</b>. Look for items that float, hide the face or sit off the body.</p>' + out;
  }
  /* the current outfit on every species at this stage */
  function viewSpecies() {
    return '<p class="hint">Your current outfit on all 8 species at the <b>' + st.stage + '</b> stage.</p><div class="mini big">' + SPECIES.map(function (s) {
      var ok = hasFit(s.id, st.stage) || st.stage === 'egg';
      return '<div class="cell"><div class="stage s">' + monster(s.id, st.stage, eq(), '100%', false) + '</div><span>' + s.name + (ok ? '' : ' <em>(no fit data)</em>') + '</span></div>';
    }).join('') + '</div>';
  }
  function viewStages() {
    return '<p class="hint">Your current outfit on <b>' + esc(nameOfSpecies()) + '</b> at every stage.</p><div class="mini big">' + STAGES.map(function (g) {
      var ok = hasFit(st.species, g) || g === 'egg';
      return '<div class="cell"><div class="stage s">' + monster(st.species, g, eq(), '100%', false) + '</div><span>' + g + (ok ? '' : ' <em>(no fit data)</em>') + '</span></div>';
    }).join('') + '</div>';
  }

  function importBox() {
    return '<details class="imp"' + (Object.keys(extraAnchors).length ? ' open' : '') + '><summary>📥 Preview new fit measurements (anchors3.json from Gemini)</summary>' +
      '<p>Paste the whole <b>anchors3.json</b>. Numbers are in 512-pixel space; the lab doubles them to match the platform. This only changes this page, not the platform.</p>' +
      '<textarea id="imp" placeholder="{ &quot;image_size&quot;: 512, &quot;monsters&quot;: { ... } }"></textarea><div class="row"><button class="btn go" onclick="Lab.importAnchors()">Load into the lab</button><button class="btn" onclick="Lab.copyPatch()">📋 Copy 1024-space patch</button></div><p id="impmsg">' + (Object.keys(extraAnchors).length ? 'Loaded ' + Object.keys(extraAnchors).length + ' fit sets.' : '') + '</p></details>';
  }

  function draw() {
    var v = st.view;
    var body = v === 'one' ? viewOne() : (v === 'fit' ? viewFit() : (v === 'species' ? viewSpecies() : viewStages()));
    var bgs = ['none'].concat(D.lists.backgrounds), auras = ['none'].concat(D.lists.auras);
    $('app').innerHTML = '<section class="bar"><label>Monster <select onchange="Lab.set(\'species\',this.value)">' + opt(SPECIES, st.species) + '</select></label>' +
      '<label>Stage <select onchange="Lab.set(\'stage\',this.value)">' + opt(STAGES, st.stage) + '</select></label>' +
      '<label>World <select onchange="Lab.set(\'bg\',this.value)">' + opt(bgs, st.bg) + '</select></label>' +
      '<label>Aura <select onchange="Lab.set(\'aura\',this.value)">' + opt(auras, st.aura) + '</select></label></section>' +
      '<nav class="views">' + [['one', '👗 Dress up'], ['fit', '🔎 Fit check (every item)'], ['species', '🐾 One outfit, all species'], ['stages', '📈 One outfit, all stages']].map(function (x) { return '<button class="tab' + (v === x[0] ? ' on' : '') + '" onclick="Lab.view(\'' + x[0] + '\')">' + x[1] + '</button>'; }).join('') + '</nav>' +
      body + importBox();
  }

  window.Lab = {
    set: function (k, v) { st[k] = v; draw(); },
    view: function (v) { st.view = v; draw(); },
    slot: function (s) { st.slot = s; draw(); },
    wear: function (slot, id) { if (id === 'none') delete st.worn[slot]; else st.worn[slot] = id; draw(); },
    clear: function () { st.worn = {}; draw(); },
    random: function () { st.worn = {}; SLOTS.forEach(function (s) { var l = itemsOf(s[0]); if (l.length && Math.random() < 0.6) st.worn[s[0]] = l[Math.floor(Math.random() * l.length)].id; }); draw(); },
    importAnchors: function () {
      var m = $('impmsg'), data;
      try { data = JSON.parse($('imp').value); } catch (e) { m.textContent = 'That is not valid JSON.'; return; }
      var mons = (data && data.monsters) || data, k = (data && data.image_size) === 1024 ? 1 : 2, n = 0;
      function sc(o) { if (!o || typeof o !== 'object') return o; var r = {}; Object.keys(o).forEach(function (key) { r[key] = Math.round(o[key] * k); }); return r; }
      Object.keys(mons).forEach(function (key) {
        var a = mons[key]; if (!a || a.kind !== 'monster') return;
        var b = { kind: 'monster', hatBase: sc(a.hatBase), hatWidth: Math.round(a.hatWidth * k), eyeCenter: sc(a.eyeCenter), eyeSpan: Math.round(a.eyeSpan * k), glassesWidth: Math.round(a.glassesWidth * k), neck: sc(a.neck), neckWidth: Math.round(a.neckWidth * k), chest: sc(a.chest), bodyCenter: sc(a.bodyCenter), bodyHeight: Math.round(a.bodyHeight * k), pawRight: sc(a.pawRight), bakedItems: a.bakedItems || [] };
        b.bodyWidth = Math.round((a.neckWidth || 150) * k * 1.2);
        extraAnchors[key] = b; window.MONSTER_ANCHORS[key] = b; n++;
      });
      m.textContent = n ? 'Loaded ' + n + ' fit sets. Try them in the views above.' : 'No monster entries found.'; draw(); $('impmsg').textContent = 'Loaded ' + n + ' fit sets.';
    },
    copyPatch: function () {
      var t = JSON.stringify(extraAnchors, null, 1);
      try { navigator.clipboard.writeText(t); $('impmsg').textContent = 'Copied ' + Object.keys(extraAnchors).length + ' fit sets (1024 space).'; } catch (e) { window.prompt('Copy this:', t); }
    }
  };
  draw();
})();
