/* Practice Island 2.0 — Step C: Rewards, Surprises & Things to Come Back For
   1. The Sticker Book (o_book): Mission stickers, 3-star shiny editions, zone pages.
   2. My Island Corner (bg_my_corner): Beach plot next to Pip's hut, drag/tap decoration placement.
   3. The Daily Surprise (o_bottle): Message in a bottle once a day with jokes/facts & quest.
   4. Moments of Wonder: Level-up fireworks, 5s zone cut-scenes, rare Golden Fish (o_golden_fish).
   5. Pip's Tips: Helpful vocabulary reminders on map after repeated mistakes.
*/
(function (root) {
  'use strict';

  var IslandRewards = root.IslandRewards = root.IslandRewards || {};

  /* 1. STICKERS CATALOG (20 Zone Stickers + 6 Star Path + 3 Specials) */
  var STICKERS = [
    // Zone 1: Sunny Meadow
    { id: 'st_z1_1', zone: 1, name: 'Grandpa Bolt', pic: 'z_meadow', icon: '⚙️', desc: 'The clever inventor mole of Sunny Meadow!' },
    { id: 'st_z1_2', zone: 1, name: 'Golden Gear', pic: 'o_star_path', icon: '⚙️', desc: 'A shiny cog from Grandpa Bolt\'s cleanest clock.' },
    { id: 'st_z1_3', zone: 1, name: 'Meadow Daisy', pic: 'z_meadow', icon: '🌼', desc: 'A fresh white daisy picked by the cottage fence.' },
    { id: 'st_z1_4', zone: 1, name: 'Bronze Nut', pic: 'o_pin', icon: '🔩', desc: 'Holds the robot arms firmly in place.' },
    { id: 'st_z1_5', zone: 1, name: 'Sunny Clover', pic: 'z_meadow', icon: '🍀', desc: 'Four green leaves for the luckiest explorers.' },

    // Zone 2: Lighthouse Beach
    { id: 'st_z2_1', zone: 2, name: 'Lulu the Crab', pic: 'z_beach', icon: '🦀', desc: 'Keeper of the great red-and-white lighthouse!' },
    { id: 'st_z2_2', zone: 2, name: 'Beacon Light', pic: 'd_lantern', icon: '💡', desc: 'Shines through the dark sea fog for sailing ships.' },
    { id: 'st_z2_3', zone: 2, name: 'Sea Shell', pic: 'd_shell_pile', icon: '🐚', desc: 'Listen close and you can hear the ocean singing.' },
    { id: 'st_z2_4', zone: 2, name: 'Coral Star', pic: 'o_star_path', icon: '🪸', desc: 'A bright pink sea star from the tidal pools.' },
    { id: 'st_z2_5', zone: 2, name: 'Sand Dollar', pic: 'o_pin', icon: '🪙', desc: 'Washed ashore during the morning tide.' },

    // Zone 3: Treehouse Forest
    { id: 'st_z3_1', zone: 3, name: 'Mr. Nutty', pic: 'z_forest', icon: '🐿️', desc: 'The busiest squirrel shopkeeper in the woods!' },
    { id: 'st_z3_2', zone: 3, name: 'Golden Acorn', pic: 'o_star_path', icon: '🌰', desc: 'The sweetest treat in the treehouse canopy.' },
    { id: 'st_z3_3', zone: 3, name: 'Forest Pinecone', pic: 'd_palm', icon: '🌲', desc: 'Smells of warm wood and mountain rain.' },
    { id: 'st_z3_4', zone: 3, name: 'River Pebble', pic: 'o_pin', icon: '🪨', desc: 'Smooth and cool from the forest river.' },
    { id: 'st_z3_5', zone: 3, name: 'Green Canopy', pic: 'z_forest', icon: '🍃', desc: 'A lucky autumn leaf from the tallest oak.' },

    // Zone 4: Volcano Peak
    { id: 'st_z4_1', zone: 4, name: 'Ember the Dragon', pic: 'z_mountain', icon: '🐲', desc: 'A warm and friendly baby dragon friend!' },
    { id: 'st_z4_2', zone: 4, name: 'Happy Flame', pic: 'o_flame', icon: '🔥', desc: 'Never burns — only warms cosy cocoa mugs.' },
    { id: 'st_z4_3', zone: 4, name: 'Lava Crystal', pic: 'o_star_path', icon: '💎', desc: 'Glows like warm honey under the starry sky.' },
    { id: 'st_z4_4', zone: 4, name: 'Mountain Gem', pic: 'o_pin', icon: '✨', desc: 'Found near the peak after the hiccups stopped.' },
    { id: 'st_z4_5', zone: 4, name: 'Star Meteor', pic: 'z_mountain', icon: '🌠', desc: 'Fell from the night sky into the warm crater.' },

    // Secret & Specials
    { id: 'st_gold_fish', zone: 'special', name: 'Golden Fish', pic: 'o_golden_fish', icon: '🐟', desc: 'A rare and magical golden fish from deep island waters!' },
    { id: 'st_bottle_note', zone: 'special', name: 'Captain\'s Letter', pic: 'o_bottle', icon: '📜', desc: 'A kind message of friendship from Captain Pip.' },
    { id: 'st_island_hero', zone: 'special', name: 'Island Hero Star', pic: 'o_star_path', icon: '⭐', desc: 'Awarded to pupils who explored every corner of the island.' }
  ];

  /* 2. DECORATIONS CATALOG (Beach Corner plot items + Unlockable Zone Trophies) */
  var DECORATIONS = [
    { id: 'd_flag', name: 'Beach Flag', icon: '🚩', pic: 'd_flag', desc: 'A bright colorful pennant flag flapping in the sea breeze.' },
    { id: 'd_palm', name: 'Mini Palm Tree', icon: '🌴', pic: 'd_palm', desc: 'A tropical miniature palm with sweet little coconuts.' },
    { id: 'd_boat', name: 'Toy Sailboat', icon: '⛵', pic: 'd_boat', desc: 'A wooden sailboat ready to glide across calm tidal pools.' },
    { id: 'd_lantern', name: 'Warm Lantern', icon: '🏮', pic: 'd_lantern', desc: 'Gives off a warm golden glow when dusk falls.' },
    { id: 'd_hut', name: 'Beach Hut', icon: '🛖', pic: 'd_hut', desc: 'A cosy palm-leaf beach cabana for afternoon naps.' },
    { id: 'd_shell_pile', name: 'Shell Treasure', icon: '🐚', pic: 'd_shell_pile', desc: 'Sparkling colorful shells gathered along the shoreline.' },
    { id: 'd_umbrella', name: 'Sun Umbrella', icon: '⛱️', pic: 'd_umbrella', desc: 'A sunny striped beach umbrella for cool shade.' },
    // Zone Trophies (unlocked by opening each zone's treasure chest!)
    { id: 't_robot', name: 'Bolt\'s Robot', icon: '🤖', pic: 'z1/o_robot', zone: 1, desc: 'Grandpa Bolt\'s helper robot trophy from Sunny Meadow!' },
    { id: 't_light', name: 'Mini Lighthouse', icon: '🏮', pic: 'z2/o_lighthouse_on', zone: 2, desc: 'Lulu\'s shining beacon trophy from Lighthouse Beach!' },
    { id: 't_basket', name: 'Acorn Basket', icon: '🧺', pic: 'z3/o_basket', zone: 3, desc: 'Mr. Nutty\'s market basket trophy from Treehouse Forest!' },
    { id: 't_rocket', name: 'Water Rocket', icon: '🚀', pic: 'z4/o_rocket', zone: 4, desc: 'Ember\'s water rocket trophy from Volcano Peak!' }
  ];

  /* 3. CAPTAIN PIP\'S JOKES & FUN FACTS BANK */
  var JOKES = [
    { q: 'Why did the bird fly south in winter?', a: 'Because it was too far to walk! 🐦', type: 'joke' },
    { q: 'What do sea monsters eat for lunch?', a: 'Fish and ships! ⛵', type: 'joke' },
    { q: 'Why are fish so smart?', a: 'Because they always live in schools! 🐟', type: 'joke' },
    { q: 'What did one campfire say to the other?', a: 'Shall we go out tonight? 🔥', type: 'joke' },
    { q: 'Why did the cookie visit the doctor?', a: 'Because it was feeling crumbly! 🍪', type: 'joke' },
    { q: 'What did the ocean say to the beach?', a: 'Nothing, it just waved! 🌊', type: 'joke' },
    { q: 'Why was the math book feeling sad?', a: 'Because it had too many problems! 📚', type: 'joke' },
    { q: 'Did you know?', a: 'Sea stars do not have brains or blood, but they can grow back lost arms! ⭐', type: 'fact' },
    { q: 'Did you know?', a: 'Octopuses have three hearts and blue blood! 🐙', type: 'fact' },
    { q: 'Did you know?', a: 'Honey never ever spoils! Pots from ancient times are still sweet! 🍯', type: 'fact' },
    { q: 'Did you know?', a: 'Dolphins sleep with one eye open to watch out for their friends! 🐬', type: 'fact' },
    { q: 'Did you know?', a: 'Otters hold hands while sleeping so they do not drift away! 🦦', type: 'fact' }
  ];

  function getDailyJoke(dateStr) {
    var str = dateStr || new Date().toISOString().slice(0, 10);
    var hash = 0;
    for (var i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
    return JOKES[hash % JOKES.length];
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Award a sticker upon mission completion */
  function awardMissionSticker(doc, missionId, stars) {
    if (!doc) return null;
    doc.collection = doc.collection || {};
    doc.collection.stickers = doc.collection.stickers || {};

    // Map mission to sticker id
    var match = /^g([34])-z([1-4])-[ms](\d+)$/.exec(missionId);
    var stickerId = 'st_z1_1';
    if (match) {
      var z = Number(match[2]);
      var num = ((Number(match[3]) - 1) % 5) + 1;
      stickerId = 'st_z' + z + '_' + num;
    } else if (missionId.indexOf('daily') !== -1) {
      stickerId = 'st_bottle_note';
    }

    var existing = doc.collection.stickers[stickerId];
    var isNew = !existing;
    var madeShiny = stars >= 3 && (!existing || !existing.shiny);

    doc.collection.stickers[stickerId] = {
      unlocked: true,
      shiny: (existing && existing.shiny) || stars >= 3,
      date: new Date().toISOString().slice(0, 10)
    };

    var stDef = STICKERS.find(function (s) { return s.id === stickerId; }) || STICKERS[0];
    return {
      isNew: isNew,
      madeShiny: madeShiny,
      sticker: stDef,
      shiny: doc.collection.stickers[stickerId].shiny,
      isShiny: doc.collection.stickers[stickerId].shiny
    };
  }

  /* 4. THE STICKER BOOK MODAL */
  function openStickerBook(selectedZone) {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    root.IslandAudio.playTap();

    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    var doc = (ses && ses.doc) || {};
    var owned = (doc.collection && doc.collection.stickers) || {};

    var activeTab = selectedZone || 1;
    renderBookContent(modalRoot, activeTab, owned);
  }

  function renderBookContent(container, activeTab, owned) {
    var tabs = [
      { id: 1, label: '🌻 Meadow' },
      { id: 2, label: '🏖️ Beach' },
      { id: 3, label: '🌲 Forest' },
      { id: 4, label: '🌋 Mountain' },
      { id: 'special', label: '⭐ Specials' }
    ];

    var totalUnlocked = 0;
    var totalShiny = 0;
    STICKERS.forEach(function (s) {
      if (owned[s.id]) {
        totalUnlocked++;
        if (owned[s.id].shiny) totalShiny++;
      }
    });

    var filteredStickers = STICKERS.filter(function (s) {
      return String(s.zone) === String(activeTab);
    });

    var stickersGridHtml = filteredStickers.map(function (s) {
      var item = owned[s.id];
      var isUnlocked = !!item;
      var isShiny = item && !!item.shiny;

      if (!isUnlocked) {
        return (
          '<div class="isl-sticker-slot locked" onclick="IslandRewards.showStickerTip(\'' + esc(s.name) + '\', false)">' +
            '<div class="isl-sticker-silhouette">' + esc(s.icon) + '</div>' +
            '<span class="isl-sticker-lock-tag">🔒 Secret</span>' +
          '</div>'
        );
      }

      return (
        '<div class="isl-sticker-slot unlocked' + (isShiny ? ' shiny' : '') + '" onclick="IslandRewards.showStickerDetail(\'' + s.id + '\')">' +
          (isShiny ? '<span class="isl-shiny-badge">✨ Shiny</span>' : '') +
          '<img class="isl-sticker-img" src="art/' + esc(s.pic) + '.webp" alt="' + esc(s.name) + '">' +
          '<span class="isl-sticker-name">' + esc(s.name) + '</span>' +
        '</div>'
      );
    }).join('');

    container.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-book-backdrop">' +
        '<div class="isl-card-modal isl-book-card">' +
          '<div class="isl-mission-top" style="margin-bottom:14px">' +
            '<div style="font-size:1.35rem;font-weight:800;display:flex;align-items:center;gap:10px">' +
              '<img src="art/o_book.webp" alt="" style="width:38px;height:38px;object-fit:contain">' +
              '<span>Island Sticker Album</span>' +
            '</div>' +
            '<div class="isl-book-counter">Found: ' + totalUnlocked + ' / ' + STICKERS.length + ' (' + totalShiny + ' Shiny ✨)</div>' +
            '<button type="button" class="isl-btn" style="min-height:44px;min-width:44px;padding:6px 12px" onclick="IslandApp.closeModal()">✕</button>' +
          '</div>' +
          '<div class="isl-book-tabs">' +
            tabs.map(function (t) {
              return '<button type="button" class="isl-btn isl-book-tab' + (String(t.id) === String(activeTab) ? ' active' : '') + '" onclick="IslandRewards.switchBookTab(\'' + t.id + '\')">' + t.label + '</button>';
            }).join('') +
          '</div>' +
          '<div class="isl-stickers-grid" id="isl-stickers-grid">' +
            stickersGridHtml +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function switchBookTab(tabId) {
    root.IslandAudio.playTap();
    var modalRoot = document.getElementById('isl-modal-root');
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    var doc = (ses && ses.doc) || {};
    var owned = (doc.collection && doc.collection.stickers) || {};
    renderBookContent(modalRoot, tabId, owned);
  }

  function showStickerDetail(stickerId) {
    var st = STICKERS.find(function (s) { return s.id === stickerId; });
    if (!st) return;
    root.IslandAudio.playSparkle();
    root.IslandAudio.speak(st.name + '! ' + st.desc);
  }

  function showStickerTip(name, unlocked) {
    root.IslandAudio.playTap();
    root.IslandAudio.speak('Keep exploring missions to find the ' + name + ' sticker!');
  }

  /* 5. MY ISLAND CORNER PLOT */
  function openCorner() {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    root.IslandAudio.playTap();

    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    var doc = (ses && ses.doc) || {};
    doc.corner = doc.corner || { items: [] };

    // Default starter decorations if corner empty
    if (!doc.corner.items || doc.corner.items.length === 0) {
      doc.corner.items = [
        { id: 'd_palm', x: 28, y: 64 },
        { id: 'd_flag', x: 68, y: 58 },
        { id: 'd_umbrella', x: 80, y: 68 }
      ];
    }

    renderCornerContent(modalRoot, doc);
  }

  function isDecoUnlocked(d, doc) {
    if (!d || !d.zone) return true;
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    if (ses && ses.isDemo) return true;
    var chests = (doc && doc.chests) || {};
    return !!chests['z' + d.zone];
  }

  function renderCornerContent(container, doc) {
    var placed = doc.corner.items || [];
    var placedMap = {};
    placed.forEach(function (p) { placedMap[p.id] = true; });

    var itemsHtml = placed.map(function (item, idx) {
      var def = DECORATIONS.find(function (d) { return d.id === item.id; });
      if (!def) return '';
      return (
        '<div class="isl-corner-item" id="corner-item-' + idx + '" ' +
          'style="left:' + item.x + '%;top:' + item.y + '%;" ' +
          'onclick="IslandRewards.tapCornerItem(' + idx + ', event)">' +
          '<img src="art/' + esc(def.pic) + '.webp" alt="' + esc(def.name) + '">' +
        '</div>'
      );
    }).join('');

    var bagHtml = DECORATIONS.map(function (d) {
      var isPlaced = !!placedMap[d.id];
      var unlocked = isDecoUnlocked(d, doc);
      var trophyBadge = d.zone
        ? (unlocked ? '<small style="color:#fde047;font-size:0.7rem;font-weight:800">🏆 Zone ' + d.zone + ' Trophy</small>' : '<small class="monster-item-lock-pill">🔒 Zone ' + d.zone + ' Chest</small>')
        : '';
      return (
        '<button type="button" class="isl-btn isl-corner-bag-btn' + (isPlaced ? ' placed' : '') + (unlocked ? '' : ' locked') + '" ' +
          (unlocked ? 'onclick="IslandRewards.placeDecorationFromBag(\'' + d.id + '\')"' : 'disabled aria-disabled="true"') + '>' +
          '<img src="art/' + esc(d.pic) + '.webp" alt="">' +
          '<span>' + esc(d.name) + (isPlaced ? ' (Placed)' : '') + '</span>' +
          trophyBadge +
        '</button>'
      );
    }).join('');

    var monsterSvg = root.IslandApp.monsterHtml(110);

    container.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-corner-backdrop">' +
        '<div class="isl-corner-screen">' +
          '<div class="isl-corner-topbar">' +
            '<div style="font-size:1.35rem;font-weight:800;display:flex;align-items:center;gap:10px">' +
              '<img src="art/d_hut.webp" alt="" style="width:38px;height:38px;object-fit:contain">' +
              '<span>🏖️ My Sunny Beach Camp</span>' +
            '</div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">' +
              '<button type="button" class="isl-btn violet" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="IslandApp.openDressingRoom()">👕 Dress Up</button>' +
              '<button type="button" class="isl-btn amber" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="IslandRewards.openStickerBook()">📒 Stickers</button>' +
              (root.IslandWall ? '<button type="button" class="isl-btn wall-btn" style="min-height:42px;padding:6px 12px;font-size:0.9rem" onclick="IslandWall.open()">🌟 Classmates</button>' : '') +
              '<button type="button" class="isl-btn emerald" style="min-height:42px;padding:6px 14px;font-size:0.92rem" onclick="IslandRewards.saveCornerChanges()">Save & Exit 🌴</button>' +
              '<button type="button" class="isl-btn" style="min-height:42px;min-width:42px;padding:6px 12px" onclick="IslandApp.closeModal()">✕</button>' +
            '</div>' +
          '</div>' +
          '<div class="isl-corner-canvas" id="isl-corner-canvas" onclick="IslandRewards.tapCornerSand(event)">' +
            '<div class="isl-corner-monster">' +
              monsterSvg +
              '<div class="isl-map-pedestal" style="width:90px;height:24px;margin-top:-10px"></div>' +
            '</div>' +
            itemsHtml +
          '</div>' +
          '<div class="isl-corner-tray">' +
            '<div style="font-size:1.02rem;font-weight:800;color:#fde047;margin-bottom:6px">🎒 Island Decorations & Zone Trophies (Tap sand, then tap an item to place):</div>' +
            '<div class="isl-corner-bag-scroll">' + bagHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function tapCornerSand(ev) {
    if (ev.target.closest('.isl-corner-item')) return;
    var rect = ev.currentTarget.getBoundingClientRect();
    var x = Math.round(((ev.clientX - rect.left) / rect.width) * 100);
    var y = Math.round(((ev.clientY - rect.top) / rect.height) * 100);
    x = Math.max(8, Math.min(88, x));
    y = Math.max(30, Math.min(84, y));
    root.__lastSandTap = { x: x, y: y };
  }

  function placeDecorationFromBag(itemId) {
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    if (!ses || !ses.doc) return;
    var def = DECORATIONS.find(function (d) { return d.id === itemId; });
    if (!def || !isDecoUnlocked(def, ses.doc)) {
      root.IslandAudio.playSoftFail();
      return;
    }
    ses.doc.corner = ses.doc.corner || { items: [] };

    // If already placed, remove it
    var existingIdx = ses.doc.corner.items.findIndex(function (it) { return it.id === itemId; });
    if (existingIdx !== -1) {
      ses.doc.corner.items.splice(existingIdx, 1);
      root.IslandAudio.playTap();
      renderCornerContent(document.getElementById('isl-modal-root'), ses.doc);
      return;
    }

    // Place at clicked sand pos or natural beach spot
    var pos = root.__lastSandTap || { x: 45 + Math.floor(Math.random() * 20), y: 55 + Math.floor(Math.random() * 20) };
    ses.doc.corner.items.push({ id: itemId, x: pos.x, y: pos.y });
    root.IslandAudio.playHop();
    renderCornerContent(document.getElementById('isl-modal-root'), ses.doc);
  }

  function tapCornerItem(idx, ev) {
    ev.stopPropagation();
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    if (!ses || !ses.doc || !ses.doc.corner) return;
    var it = ses.doc.corner.items[idx];
    if (!it) return;

    // Remove back to bag
    ses.doc.corner.items.splice(idx, 1);
    root.IslandAudio.playTap();
    renderCornerContent(document.getElementById('isl-modal-root'), ses.doc);
  }

  function saveCornerChanges() {
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    if (ses && root.IslandSync) {
      root.IslandSync.saveIslandDoc(ses);
    }
    root.IslandAudio.playCorrect();
    root.IslandApp.closeModal();
  }

  /* 6. DAILY SURPRISE: MESSAGE IN A BOTTLE */
  function openBottleModal() {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) return;
    root.IslandAudio.playPop();
    root.IslandAudio.playSparkle();

    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    var today = root.IslandSync ? root.IslandSync.todayStr() : new Date().toISOString().slice(0, 10);
    if (ses && ses.doc) {
      ses.doc.bottleSeen = ses.doc.bottleSeen || {};
      ses.doc.bottleSeen[today] = true;
      awardMissionSticker(ses.doc, 'daily', 3);
      if (root.IslandSync) root.IslandSync.saveIslandDoc(ses);
    }

    var joke = getDailyJoke(today);
    setTimeout(function () {
      root.IslandAudio.speak('Captain Pip says: ' + joke.q + ' ' + joke.a, null, 'pip');
    }, 250);

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-bottle-backdrop">' +
        '<div class="isl-card-modal isl-parchment-card">' +
          '<div style="width:72px;height:72px;margin:0 auto 6px">' +
            '<img src="art/o_bottle.webp" alt="" style="width:100%;height:100%;object-fit:contain">' +
          '</div>' +
          '<h2 style="margin:2px 0 8px;font-size:1.75rem;color:#fef08a">📜 Captain Pip\'s Bottle Message!</h2>' +
          '<div class="isl-parchment-scroll">' +
            '<div style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:8px">' + esc(joke.q) + '</div>' +
            '<div style="font-size:1.25rem;font-weight:800;color:#0369a1">' + esc(joke.a) + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:16px">' +
            '<button type="button" class="isl-btn amber" onclick="IslandApp.closeModal();IslandApp.startDailyQuest()">🎁 Play Today\'s Quest (+5 XP)</button>' +
            '<button type="button" class="isl-btn emerald" onclick="IslandApp.closeModal()">Thanks Pip! 🦜</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* 7. MOMENTS OF WONDER: FIREWORKS & ZONE CUT-SCENE */
  function launchFireworks() {
    root.IslandAudio.playFirework();
    var host = document.getElementById('isl-main') || document.body;
    var container = document.createElement('div');
    container.className = 'isl-fireworks-layer';
    host.appendChild(container);

    var colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#a855f7', '#fbbf24'];
    for (var b = 0; b < 6; b++) {
      setTimeout(function () {
        var cx = 20 + Math.random() * 60;
        var cy = 20 + Math.random() * 40;
        for (var p = 0; p < 12; p++) {
          var spark = document.createElement('div');
          spark.className = 'isl-firework-spark';
          spark.style.left = cx + '%';
          spark.style.top = cy + '%';
          spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          var angle = (p / 12) * Math.PI * 2;
          var dist = 40 + Math.random() * 60;
          spark.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
          spark.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
          container.appendChild(spark);
        }
      }, b * 220);
    }

    setTimeout(function () {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 2400);
  }

  function playZoneCutScene(zoneNum, callback) {
    var modalRoot = document.getElementById('isl-modal-root');
    if (!modalRoot) {
      if (callback) callback();
      return;
    }

    var zoneNames = { 1: 'Sunny Meadow', 2: 'Lighthouse Beach', 3: 'Treehouse Forest', 4: 'Volcano Peak' };
    var characters = { 1: 'Grandpa Bolt', 2: 'Lulu the Crab', 3: 'Mr. Nutty', 4: 'Ember the Dragon' };
    var badges = { 1: 'z_meadow', 2: 'z_beach', 3: 'z_forest', 4: 'z_mountain' };

    root.IslandAudio.playChest();
    root.IslandAudio.speak('The magic shell is shining over ' + zoneNames[zoneNum] + '! Thank you!', null, zoneNum);

    modalRoot.innerHTML =
      '<div class="isl-modal-backdrop" id="isl-cutscene-backdrop">' +
        '<div class="isl-card-modal isl-cutscene-card">' +
          '<div class="isl-cutscene-shell-aura">' +
            '<img src="art/' + badges[zoneNum] + '.webp" alt="" class="isl-cutscene-badge">' +
            '<div class="isl-cutscene-rings"></div>' +
          '</div>' +
          '<h2 style="font-size:2rem;margin:10px 0 6px;color:#fef08a">✨ Magic Shell Returned! ✨</h2>' +
          '<p style="font-size:1.15rem;color:#cbd5e1;margin:0 0 14px"><b>' + characters[zoneNum] + '</b> dances with joy! ' + zoneNames[zoneNum] + ' is glowing bright again!</p>' +
          '<div style="font-size:2.8rem;animation:idleBob 1.2s ease-in-out infinite">🐚 ⭐ 💖 ⭐ 🐚</div>' +
        '</div>' +
      '</div>';

    setTimeout(function () {
      if (callback) callback();
    }, 4500);
  }

  /* 8. RARE GOLDEN FISH EVENT IN MISSIONS */
  function maybeSpawnGoldenFish(container, forceRate) {
    var chance = (typeof forceRate === 'number') ? forceRate : 0.35;
    if (!container || Math.random() > chance) return;
    if (container.querySelector('.isl-golden-fish-actor')) return;

    var fishEl = document.createElement('div');
    fishEl.className = 'isl-golden-fish-actor';
    fishEl.innerHTML = '<img src="art/o_golden_fish.webp" alt="Golden Fish"><span class="isl-fish-tap-tag">✨ Catch Me!</span>';
    fishEl.onclick = function (e) {
      e.stopPropagation();
      catchGoldenFish(fishEl);
    };
    container.appendChild(fishEl);
  }

  function catchGoldenFish(el) {
    root.IslandAudio.playSparkle();
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    if (ses && ses.doc) {
      ses.doc.collection = ses.doc.collection || {};
      ses.doc.collection.stickers = ses.doc.collection.stickers || {};
      ses.doc.collection.stickers['st_gold_fish'] = { unlocked: true, shiny: true, date: new Date().toISOString().slice(0, 10) };
      if (root.IslandSync) root.IslandSync.saveIslandDoc(ses);
    }
    if (el && el.parentNode) {
      el.innerHTML = '<div style="font-size:2.2rem;animation:pulseGlow 0.8s ease">✨ Caught! ✨</div>';
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 700);
    }
  }

  /* 9. PIP\'S HELPFUL VOCABULARY TIPS */
  function recordWrongWord(doc, word, meaning) {
    if (!doc || !word) return;
    doc.repeatWrong = doc.repeatWrong || {};
    doc.repeatWrong[word] = (doc.repeatWrong[word] || 0) + 1;
    if (doc.repeatWrong[word] >= 2) {
      doc.pipTip = {
        word: word,
        meaning: meaning || 'important',
        date: new Date().toISOString().slice(0, 10)
      };
    }
  }

  function renderPipTipBanner(docOrContainer, maybeDoc) {
    var doc = (maybeDoc && maybeDoc.pipTip) ? maybeDoc : (docOrContainer && docOrContainer.pipTip ? docOrContainer : null);
    if (!doc || !doc.pipTip) return '';
    var tip = doc.pipTip;
    return (
      '<div class="isl-pip-tip-banner" id="isl-pip-tip-banner">' +
        '<div style="font-size:1.8rem">🦜</div>' +
        '<div style="text-align:left">' +
          '<div style="font-weight:800;color:#fde047;font-size:0.95rem">💡 Captain Pip\'s Helpful Tip:</div>' +
          '<div style="font-size:0.92rem;color:#f8fafc">Remember: <b>' + esc(tip.word) + '</b> means ' + esc(tip.meaning) + '!</div>' +
        '</div>' +
        '<button type="button" class="isl-btn cyan" style="min-height:36px;padding:4px 10px;font-size:0.85rem" onclick="IslandRewards.speakPipTip()">' +
          '🔊 Hear Tip' +
        '</button>' +
        '<button type="button" class="isl-btn" style="min-height:36px;padding:4px 8px;font-size:0.85rem" onclick="IslandRewards.dismissPipTip()">' +
          '✓' +
        '</button>' +
      '</div>'
    );
  }

  function speakPipTip() {
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    if (ses && ses.doc && ses.doc.pipTip) {
      root.IslandAudio.speak('Captain Pip says: Remember, ' + ses.doc.pipTip.word + ' means ' + ses.doc.pipTip.meaning + '!', null, 'pip');
    }
  }

  function dismissPipTip() {
    var ses = root.IslandApp ? root.IslandApp.state().session : null;
    if (ses && ses.doc) {
      delete ses.doc.pipTip;
      if (root.IslandSync) root.IslandSync.saveIslandDoc(ses);
    }
    var el = document.getElementById('isl-pip-tip-banner');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  /* Expose Public Rewards API */
  IslandRewards.STICKERS = STICKERS;
  IslandRewards.DECORATIONS = DECORATIONS;
  IslandRewards.awardMissionSticker = awardMissionSticker;
  IslandRewards.openStickerBook = openStickerBook;
  IslandRewards.switchBookTab = switchBookTab;
  IslandRewards.showStickerDetail = showStickerDetail;
  IslandRewards.showStickerTip = showStickerTip;
  IslandRewards.openCorner = openCorner;
  IslandRewards.placeDecorationFromBag = placeDecorationFromBag;
  IslandRewards.tapCornerSand = tapCornerSand;
  IslandRewards.tapCornerItem = tapCornerItem;
  IslandRewards.saveCornerChanges = saveCornerChanges;
  IslandRewards.openBottleModal = openBottleModal;
  IslandRewards.launchFireworks = launchFireworks;
  IslandRewards.playZoneCutScene = playZoneCutScene;
  IslandRewards.maybeSpawnGoldenFish = maybeSpawnGoldenFish;
  IslandRewards.catchGoldenFish = catchGoldenFish;
  IslandRewards.recordWrongWord = recordWrongWord;
  IslandRewards.renderPipTipBanner = renderPipTipBanner;
  IslandRewards.speakPipTip = speakPipTip;
  IslandRewards.dismissPipTip = dismissPipTip;

})(typeof window !== 'undefined' ? window : this);
