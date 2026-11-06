/* Treasure Island — Story Cutscene & Chapter Narrative Engine (island/js/story.js)
   100% English interface and dialogue. Follows the classic Treasure Island adventure:
   - Guide & Narrator: Parrot Captain Flint (c_pip) & Baby Leopard Benbow (c_benbow)
   - Chapter 1 (Benbow Harbour): Jim Hawkins (c_jim), Captain Billy Bones (c_billy) & Baby Leopard Benbow (c_benbow)
   - Chapter 2 (Hispaniola Bay): Long John Silver (c_silver) & Parrot Flint
   - Chapter 3 (Stockade Island): Dr. Livesey (c_livesey), Squire Trelawney & Abraham Gray
   - Chapter 4 (Skull Treasure Peak): Captain Smollett (c_billy) & Ben Gunn */
(function (root) {
  'use strict';

  var MANIFEST = {};
  var ready = fetch('art/manifest.json').then(function (r) { return r.json(); }).then(function (m) {
    if (Array.isArray(m)) {
      m.forEach(function (k) { MANIFEST[k] = k + '.webp'; });
    } else if (m && typeof m === 'object') {
      MANIFEST = m;
    }
  }).catch(function () {});

  function art(key, cls, alt) {
    var f = MANIFEST[key] || (key + '.webp');
    return '<img class="st-art ' + (cls || '') + '" src="art/' + f + '" alt="' + (alt || '') + '" draggable="false">';
  }

  function pic(key, fallbackEmoji, cls) {
    if (!key) return fallbackEmoji || '✨';
    return '<img class="' + (cls || 'st-inline-pic') + '" src="art/' + (MANIFEST[key] || (key + '.webp')) + '" alt="" draggable="false">';
  }

  var CHARS = {
    pip:    { name: 'Parrot Flint',      idle: 'c_pip',     happy: 'c_pip_happy',     voice: 'pip' },
    benbow: { name: 'Benbow the Cub',    idle: 'c_benbow',  happy: 'c_benbow_happy',  voice: 'pip' },
    1:      { name: 'Jim Hawkins',       idle: 'c_jim',     worried: 'c_jim',         happy: 'c_jim_happy',     voice: 'bolt',
              zoneName: 'Chapter 1: Admiral Benbow Harbour',
              zoneIntro: 'Ahoy! I am Jim Hawkins, and this is my baby leopard Benbow! Solve all 5 Map Clues along Admiral Benbow Harbour to unlock Billy Bones\'s Sea Chest and board the Hispaniola!' },
    2:      { name: 'Captain Silver',    idle: 'c_silver',  worried: 'c_silver',      happy: 'c_silver_happy',  voice: 'lulu',
              zoneName: 'Chapter 2: Hispaniola Bay',
              zoneIntro: 'Welcome aboard the Hispaniola, matey! Help my crew along the bay and light the tall Spyglass Beacon at Clue 5!' },
    3:      { name: 'Dr. Livesey',       idle: 'c_livesey', worried: 'c_livesey',     happy: 'c_livesey_happy', voice: 'nutty',
              zoneName: 'Chapter 3: Stockade Island',
              zoneIntro: 'Good day, young sailor! Squire Trelawney, Abraham Gray, and I are guarding the map. Cross the river bridge and unlock the Stockade Fort!' },
    4:      { name: 'Captain Smollett',  idle: 'c_billy',   worried: 'c_billy',       happy: 'c_billy_happy',   voice: 'ember',
              zoneName: 'Chapter 4: Skull Treasure Peak',
              zoneIntro: 'Steady now! Ben Gunn found Captain Flint\'s secret cave! Solve the final 5 clues to open the Golden Treasure Vault!' }
  };

  function charPic(zoneNum, cls, mood) {
    var c = CHARS[zoneNum] || CHARS[1];
    var k = (mood === 'happy' && c.happy) ? c.happy : ((mood === 'worried' && c.worried) ? c.worried : c.idle);
    return art(k, cls || 'st-char-pic', c.name);
  }

  var PIP_LINES = [
    'Squawk! Pieces of eight! Follow the glowing compass clue!',
    'Ahoy Captain! Jim Hawkins and Benbow are waiting at Admiral Benbow Harbour!',
    'Solve all 5 clues in Benbow Harbour to unlock Billy Bones\'s Sea Chest!',
    'The great sailing ship Hispaniola is anchored at the wooden pier!',
    'Who is the bravest young captain on Treasure Island? You are!'
  ];
  function pipLine() {
    return PIP_LINES[Math.floor(Math.random() * PIP_LINES.length)];
  }

  var PLOTS = {
    /* ==================== GRADE 3 ==================== */
    /* Chapter 1 — Admiral Benbow Harbour (Unit 1: What Does It Do?) */
    'g3-z1-m1': { title: "Clue 1: Billy Bones's Brass Compass", prop: 'o_compass', propDone: 'o_compass',
      intro: ["Jim Hawkins and baby leopard Benbow found a brass compass outside the Admiral Benbow Inn!", "Listen to the clue and tap the right picture!"],
      outro: "Click-clack! The brass compass points east toward the harbour pier!",
      thanks: "Click-clack! The brass compass points east toward the harbour pier!" },
    'g3-z1-m2': { title: 'Clue 2: The Torn Sea Map', prop: 'o_map_scroll', propDone: 'o_map_scroll',
      intro: ["Parrot Captain Flint flutters down: 'Pieces of eight! Match the words on the torn parchment!'", "Match each word and picture to piece the map together!"],
      outro: "Well done! The torn sea map is pieced together!",
      thanks: "Well done! The torn sea map is pieced together!" },
    'g3-z1-m3': { title: "Clue 3: The Cliff Spyglass", prop: 'o_spyglass', propDone: 'o_spyglass',
      intro: ["Captain Billy Bones looks through his brass spyglass on the cliff.", "Read the sentences carefully to spot the ship in the bay!"],
      outro: "Great reading! We spotted the Hispaniola through the spyglass!",
      thanks: "Great reading! We spotted the Hispaniola through the spyglass!" },
    'g3-z1-m4': { title: "Clue 4: The Ship's Helm & Anchor", prop: 'o_ship_wheel', propDone: 'o_ship_wheel',
      intro: ["Benbow the leopard cub ran to the wooden ship wheel on the dock!", "Put the words in order to steer the ship into the harbour!"],
      outro: "Awesome sentence building! The helm is locked on course!",
      thanks: "Awesome sentence building! The helm is locked on course!" },
    'g3-z1-m5': { title: 'Clue 5: Boarding the Hispaniola', prop: 'o_barrel_dock', propDone: 'o_hispaniola',
      intro: ["The Hispaniola is waiting at the pier! Speak with a brave captain's voice to give the sailing order!"],
      outro: "Hooray! Billy Bones's Sea Chest is unlocked and the Hispaniola is ready to sail!",
      thanks: "Hooray! Billy Bones's Sea Chest is unlocked and the Hispaniola is ready to sail!" },

    /* Chapter 2 — Hispaniola Bay (Unit 2: Thank You) */
    'g3-z2-m1': { title: "Clue 1: Rations in Silver's Galley", prop: 'o_barrel_dock',
      intro: ["Long John Silver is preparing sea rations in the ship's galley!", "Listen carefully and pick what the crew needs!"],
      outro: "Yum! The crew is well fed for the voyage!", thanks: "Yum! The crew is well fed for the voyage!" },
    'g3-z2-m2': { title: 'Clue 2: Night Watch Lanterns', prop: 'o_compass',
      intro: ["Dark waves roll around the Hispaniola.", "Match the polite words to light the deck lanterns!"],
      outro: "The deck lanterns glow brightly across the bay!", thanks: "The deck lanterns glow brightly across the bay!" },
    'g3-z2-m3': { title: 'Clue 3: Message in a Sea Bottle', prop: 'o_map_scroll',
      intro: ["A bottle washed up on Hispaniola Beach!", "Read the note inside to find the safe landing cove."],
      outro: "You read the secret sea note!", thanks: "You read the secret sea note!" },
    'g3-z2-m4': { title: 'Clue 4: Rowing Ashore', prop: 'o_ship_wheel',
      intro: ["Jim Hawkins and Benbow jump into the wooden rowboat.", "Build the sentences to row safely through the waves!"],
      outro: "The rowboat lands safely on the sandy shore!", thanks: "The rowboat lands safely on the sandy shore!" },
    'g3-z2-m5': { title: 'Clue 5: The Spyglass Beacon', prop: 'o_spyglass', propDone: 'o_hispaniola',
      intro: ["The tall Spyglass Beacon is dark! Speak clearly to shine its light across Treasure Island!"],
      outro: "The Spyglass Beacon blazes across the sea! Chapter 2 Sea Chest unlocked!", thanks: "The Spyglass Beacon blazes across the sea!" },

    /* Chapter 3 — Stockade Island (Unit 3: How Much Is It?) */
    'g3-z3-m1': { title: 'Clue 1: Crossing the Jungle River', prop: 'o_compass',
      intro: ["Dr. Livesey and Squire Trelawney lead the crew to the jungle river.", "Listen to the numbers to cross the river bridge!"],
      outro: "Splash! Everyone crossed the jungle river safely!", thanks: "Splash! Everyone crossed the jungle river safely!" },
    'g3-z3-m2': { title: 'Clue 2: Supplies for the Stockade', prop: 'o_barrel_dock',
      intro: ["Abraham Gray is counting supplies inside the wooden Stockade.", "Match the items and prices to stock the fort!"],
      outro: "Every barrel and basket is counted!", thanks: "Every barrel and basket is counted!" },
    'g3-z3-m3': { title: "Clue 3: Dr. Livesey's Logbook", prop: 'o_book',
      intro: ["Dr. Livesey opens his leather logbook.", "Read the clues to see where Captain Flint hid the next marker!"],
      outro: "Brilliant reading! We know the trail to the peak!", thanks: "Brilliant reading! We know the trail to the peak!" },
    'g3-z3-m4': { title: 'Clue 4: Securing the Palisade Gate', prop: 'o_map_scroll',
      intro: ["Build strong sentences to secure the Stockade gate!"],
      outro: "The Stockade gate is locked tight and safe!", thanks: "The Stockade gate is locked tight and safe!" },
    'g3-z3-m5': { title: 'Clue 5: Raising the Captain Flag', prop: 'o_ship_wheel', propDone: 'o_treasure_gold',
      intro: ["Speak the password aloud so Dr. Livesey and Trelawney can raise the flag over the Stockade!"],
      outro: "The flag flies high over the Stockade! Chapter 3 Sea Chest unlocked!", thanks: "The flag flies high over the Stockade!" },

    /* Chapter 4 — Skull Treasure Peak (Unit 4: What Happened?) */
    'g3-z4-m1': { title: "Clue 1: Echoes in Ben Gunn's Cave", prop: 'o_compass',
      intro: ["Ben Gunn welcomes you to Skull Peak!", "Listen to what happened on the island long ago!"],
      outro: "Echo-echo! Ben Gunn shows you the secret mountain trail!", thanks: "Echo-echo! Ben Gunn shows you the secret mountain trail!" },
    'g3-z4-m2': { title: "Clue 2: Captain Flint's Compass Pointer", prop: 'o_compass',
      intro: ["Captain Smollett checks the golden compass.", "Match the past-tense clues to follow the pointer!"],
      outro: "The golden compass points straight to the tall pine!", thanks: "The golden compass points straight to the tall pine!" },
    'g3-z4-m3': { title: 'Clue 3: The Carvings on Spyglass Rock', prop: 'o_map_scroll',
      intro: ["Ancient words are carved into Spyglass Rock.", "Read them carefully to find the hidden vault door!"],
      outro: "The stone door rumbles open!", thanks: "The stone door rumbles open!" },
    'g3-z4-m4': { title: 'Clue 4: Raising the Signal Banner', prop: 'o_spyglass',
      intro: ["Put the words in order to signal the Hispaniola from the mountain top!"],
      outro: "The crew on the ship sees our banner!", thanks: "The crew on the ship sees our banner!" },
    'g3-z4-m5': { title: "Clue 5: Flint's Golden Treasure Vault", prop: 'o_billy_chest', propDone: 'o_treasure_gold',
      intro: ["Speak the final captain's command with Jim Hawkins, Benbow, and Parrot Flint to open the Great Treasure Vault!"],
      outro: "Click-boom! Captain Flint's Golden Vault opens wide!", thanks: "Click-boom! Captain Flint's Golden Vault opens wide!" },

    /* ==================== GRADE 4 ==================== */
    /* Chapter 1 — Admiral Benbow Harbour (Unit 1: I Love Reading) */
    'g4-z1-m1': { title: "Clue 1: Billy Bones's Sea Log", prop: 'o_compass', propDone: 'o_compass',
      intro: ["Jim Hawkins and baby leopard Benbow found an old sea log outside the Admiral Benbow Inn!", "Listen to the clue to begin our voyage!"],
      outro: "The sea log reveals the first secret of Treasure Island!",
      thanks: "The sea log reveals the first secret of Treasure Island!" },
    'g4-z1-m2': { title: 'Clue 2: Sorting the Map Pages', prop: 'o_map_scroll', propDone: 'o_map_scroll',
      intro: ["Parrot Captain Flint squawks: 'Match the pages to read the captain's chart!'"],
      outro: "Every page of the sea chart is in place!",
      thanks: "Every page of the sea chart is in place!" },
    'g4-z1-m3': { title: 'Clue 3: The Cliff Spyglass Clue', prop: 'o_spyglass', propDone: 'o_spyglass',
      intro: ["Read the story clue with Jim Hawkins and Captain Billy Bones to find which ship is sailing tonight!"],
      outro: "It is the Hispaniola! You read the clue!",
      thanks: "It is the Hispaniola! You read the clue!" },
    'g4-z1-m4': { title: "Clue 4: Squire Trelawney's Helm Order", prop: 'o_ship_wheel', propDone: 'o_ship_wheel',
      intro: ["Put the words in order to complete Squire Trelawney's sailing instructions!"],
      outro: "The instructions are ready and the crew is aboard!",
      thanks: "The instructions are ready and the crew is aboard!" },
    'g4-z1-m5': { title: 'Clue 5: All Hands on the Hispaniola', prop: 'o_barrel_dock', propDone: 'o_hispaniola',
      intro: ["Speak the captain's oath aloud with Jim Hawkins and Benbow to unlock the harbour!"],
      outro: "Hooray! Billy Bones's Sea Chest is open and the Hispaniola sets sail!",
      thanks: "Hooray! Billy Bones's Sea Chest is open and the Hispaniola sets sail!" },

    /* Chapter 2 — Hispaniola Bay (Unit 2: What Lives Here?) */
    'g4-z2-m1': { title: 'Clue 1: Creatures of the Coral Reef', prop: 'o_compass',
      intro: ["Long John Silver points down into the clear blue bay.", "Listen to discover what lives in Hispaniola Bay!"],
      outro: "Splash! The reef creatures show us the safe channel!", thanks: "Splash! The reef creatures show us the safe channel!" },
    'g4-z2-m2': { title: 'Clue 2: Sea Habitat Match', prop: 'o_barrel_dock',
      intro: ["Match each sea animal and habitat clue with Parrot Flint!"],
      outro: "Every creature is in its home!", thanks: "Every creature is in its home!" },
    'g4-z2-m3': { title: "Clue 3: Silver's Nature Notes", prop: 'o_map_scroll',
      intro: ["Read the coastal field notes to navigate past the rocks!"],
      outro: "Great reading! We steered clear of the reef!", thanks: "Great reading! We steered clear of the reef!" },
    'g4-z2-m4': { title: 'Clue 4: Launching the Shore Boat', prop: 'o_ship_wheel',
      intro: ["Build the sentences to row the crew boat onto Treasure Island!"],
      outro: "The boat glides onto the golden sand!", thanks: "The boat glides onto the golden sand!" },
    'g4-z2-m5': { title: 'Clue 5: Lighting Spyglass Point', prop: 'o_spyglass', propDone: 'o_hispaniola',
      intro: ["Speak clearly so the Spyglass Beacon shines for the whole fleet!"],
      outro: "Spyglass Point is shining bright! Chapter 2 Sea Chest unlocked!", thanks: "Spyglass Point is shining bright!" },

    /* Chapter 3 — Stockade Island (Unit 3: It Keeps Changing) */
    'g4-z3-m1': { title: 'Clue 1: Shifting Jungle Tides', prop: 'o_compass',
      intro: ["Dr. Livesey studies how the island river changes.", "Listen carefully to cross the river bridge!"],
      outro: "You crossed the river with Dr. Livesey and Gray!", thanks: "You crossed the river with Dr. Livesey and Gray!" },
    'g4-z3-m2': { title: 'Clue 2: Seasons of the Stockade', prop: 'o_barrel_dock',
      intro: ["Match the changing weather clues to protect the Stockade supplies!"],
      outro: "The Stockade supplies are safe and dry!", thanks: "The Stockade supplies are safe and dry!" },
    'g4-z3-m3': { title: "Clue 3: Trelawney's Almanac", prop: 'o_book',
      intro: ["Read Squire Trelawney's almanac to track the mountain wind!"],
      outro: "Now we know when the mist clears on Skull Peak!", thanks: "Now we know when the mist clears on Skull Peak!" },
    'g4-z3-m4': { title: 'Clue 4: Securing the Fort', prop: 'o_map_scroll',
      intro: ["Put the words in order to rebuild the Stockade lookout!"],
      outro: "The Stockade lookout stands strong!", thanks: "The Stockade lookout stands strong!" },
    'g4-z3-m5': { title: 'Clue 5: Opening the Command Post', prop: 'o_ship_wheel', propDone: 'o_treasure_gold',
      intro: ["Speak the command aloud to open Dr. Livesey's Stockade headquarters!"],
      outro: "The Command Post is open! Chapter 3 Sea Chest unlocked!", thanks: "The Command Post is open!" },

    /* Chapter 4 — Skull Treasure Peak (Unit 4: We Can Do It) */
    'g4-z4-m1': { title: "Clue 1: Ben Gunn's Mountain Trail", prop: 'o_compass',
      intro: ["Ben Gunn knows every rock on Skull Peak!", "Listen to the clue to climb the steep trail together!"],
      outro: "Up we go! Ben Gunn leads the way!", thanks: "Up we go! Ben Gunn leads the way!" },
    'g4-z4-m2': { title: "Clue 2: Smollett's Compass Code", prop: 'o_compass',
      intro: ["Match the teamwork clues with Captain Smollett!"],
      outro: "The compass code is unlocked!", thanks: "The compass code is unlocked!" },
    'g4-z4-m3': { title: 'Clue 3: The Red X on the Map', prop: 'o_map_scroll',
      intro: ["Read the final parchment lines with Jim Hawkins and Benbow!"],
      outro: "We found the exact spot marked with a Red X!", thanks: "We found the exact spot marked with a Red X!" },
    'g4-z4-m4': { title: 'Clue 4: Victory Banner on the Peak', prop: 'o_spyglass',
      intro: ["Build the sentences to raise our crew's victory banner!"],
      outro: "Our banner waves above the clouds!", thanks: "Our banner waves above the clouds!" },
    'g4-z4-m5': { title: "Clue 5: Captain Flint's Golden Vault", prop: 'o_billy_chest', propDone: 'o_treasure_gold',
      intro: ["Speak with your strongest captain's voice to open Captain Flint's Golden Treasure Vault!"],
      outro: "Hooray! The Golden Treasure Vault of Treasure Island is ours!", thanks: "Hooray! The Golden Treasure Vault of Treasure Island is ours!" }
  };

  function plotOf(missionId) { return PLOTS[missionId] || null; }

  function playIntro(monsterHtml, onDone) {
    var slides = [
      { bg: 'benbow', speaker: 'Jim Hawkins & Benbow', charKey: 'c_jim_happy', prop: 'o_map_scroll', voice: 'bolt',
        text: "Ahoy! Welcome to Admiral Benbow Harbour! My baby leopard Benbow and I just discovered Captain Flint's secret Treasure Map inside Billy Bones's sea chest!" },
      { bg: 'benbow', speaker: 'Parrot Captain Flint', charKey: 'c_pip_happy', prop: 'o_hispaniola', voice: 'pip',
        text: "Squawk! Pieces of eight! The great sailing ship Hispaniola is anchored at the harbour pier! Solve the 5 Map Clues along the coast to unlock the voyage!" },
      { bg: 'benbow', speaker: 'Captain Billy Bones', charKey: 'c_billy', prop: 'o_treasure_gold', voice: 'bolt',
        text: "Guard the map well, young captain! Walk along Benbow Harbour, use your English power at each glowing clue, and claim the gold of Treasure Island!" }
    ];
    showCutscene(slides, monsterHtml, onDone);
  }

  function playChestCutscene(zoneNum, rewardName, rewardSticker, monsterHtml, onDone) {
    var c = CHARS[zoneNum] || CHARS[1];
    var nextZone = CHARS[zoneNum + 1];
    var slides = [
      { bg: 'benbow', speaker: c.name, charKey: c.happy, prop: 'o_treasure_gold', voice: c.voice,
        text: "Shiver me timbers! You solved all 5 Map Clues in " + c.zoneName + " and unlocked the Sea Chest! Inside is: " + rewardName + "!" },
      nextZone
        ? { bg: 'benbow', speaker: 'Parrot Flint', charKey: 'c_pip_happy', prop: 'o_hispaniola', voice: 'pip',
            text: "All hands on deck! The Hispaniola is ready at the pier! Set sail for " + nextZone.zoneName + " to meet " + nextZone.name + "!" }
        : { bg: 'benbow', speaker: 'Parrot Flint', charKey: 'c_pip_happy', prop: 'o_treasure_gold', voice: 'pip',
            text: "Pieces of eight! All 4 Sea Chests are open! You found the Great Treasure of Captain Flint!" }
    ];
    showCutscene(slides, monsterHtml, function () {
      if (!nextZone) playEnding(monsterHtml, onDone);
      else if (onDone) onDone();
    });
  }

  function playEnding(monsterHtml, onDone) {
    var rootEl = document.getElementById('isl-modal-root');
    if (!rootEl) { if (onDone) onDone(); return; }
    root.IslandAudio.playFanfare();
    var line = "Three cheers for the Grand Captain of Treasure Island! You sailed the Hispaniola and found Captain Flint's gold!";
    root.IslandAudio.speak(line, null, 'pip');
    rootEl.innerHTML =
      '<div class="isl-modal-backdrop st-backdrop">' +
        '<div class="st-stage st-ending" style="--st-bg:url(../art/bg_benbow.webp)">' +
          '<div class="st-confetti">🎉 ✨ 🏆 🪙 ⛵ 🎉</div>' +
          '<h2 class="st-end-title">🏴‍☠️ Heroes of Treasure Island!</h2>' +
          '<div class="st-parade">' +
            '<div class="st-parade-mon">' + (monsterHtml || '') + '</div>' +
            art('c_jim_happy', 'st-parade-char') +
            art('c_benbow_happy', 'st-parade-char') +
            art('c_pip_happy', 'st-parade-char') +
            art('c_silver', 'st-parade-char') +
            art('c_livesey', 'st-parade-char') +
            art('c_billy', 'st-parade-char') +
          '</div>' +
          '<p class="st-line">' + line + '</p>' +
          '<button type="button" class="isl-btn amber st-next" id="st-end-done">⚓ Back to the Harbour! 🚀</button>' +
        '</div>' +
      '</div>';
    document.getElementById('st-end-done').onclick = function () {
      root.IslandAudio.playTap();
      rootEl.innerHTML = '';
      if (onDone) onDone();
    };
  }

  function showCutscene(slides, monsterHtml, onDone) {
    var rootEl = document.getElementById('isl-modal-root');
    if (!rootEl) { if (onDone) onDone(); return; }
    var i = 0;
    function render() {
      var s = slides[i];
      var bgFile = s.bg === 'benbow' ? 'bg_benbow.webp' : (MANIFEST['bg_' + s.bg] || ('bg_' + s.bg + '.webp'));
      rootEl.innerHTML =
        '<div class="isl-modal-backdrop st-backdrop">' +
          '<div class="st-stage" style="--st-bg:url(../art/' + bgFile + ')">' +
            '<button type="button" class="st-skip" id="st-skip">Skip ⏭</button>' +
            '<div class="st-actors">' +
              '<div class="st-monster">' + (monsterHtml || '') + '</div>' +
              art(s.charKey, 'st-friend') +
              (s.prop ? art(s.prop, 'st-prop') : '') +
            '</div>' +
            '<div class="st-dialog">' +
              '<div class="st-speaker">' + s.speaker + ' <button type="button" class="st-say" id="st-say" title="Listen">🔊</button></div>' +
              '<div class="st-line">' + s.text + '</div>' +
              '<div class="st-dots">' + slides.map(function (_, idx) { return '<span class="' + (idx === i ? 'on' : '') + '"></span>'; }).join('') + '</div>' +
              '<button type="button" class="isl-btn emerald st-next" id="st-next">' + (i < slides.length - 1 ? 'Next ▶' : "Let's Set Sail! ⛵") + '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      root.IslandAudio.speak(s.text, null, s.voice || 'pip');
      document.getElementById('st-say').onclick = function () { root.IslandAudio.speak(s.text, null, s.voice || 'pip'); };
      document.getElementById('st-skip').onclick = finish;
      document.getElementById('st-next').onclick = function () {
        root.IslandAudio.playTap();
        i++;
        if (i < slides.length) render(); else finish();
      };
    }
    function finish() {
      root.IslandAudio.playTap();
      rootEl.innerHTML = '';
      if (onDone) onDone();
    }
    render();
  }

  function missionBannerHtml(missionId, zoneNum, stepIdx) {
    var p = PLOTS[missionId];
    var c = CHARS[zoneNum] || CHARS[1];
    if (!p) return '';
    var line = stepIdx === 0 ? p.intro[0] : (p.intro[1] || p.intro[0]);
    var propKey = p.prop || 'o_compass';
    return (
      '<div class="st-mission-banner" onclick="IslandAudio.speak(' + JSON.stringify(line).replace(/"/g, '&quot;') + ',null,' + JSON.stringify(c.voice).replace(/"/g, '&quot;') + ')">' +
        art(c.idle, 'st-mb-char') +
        '<div class="st-mb-bubble">' +
          '<b>' + c.name + ' · ' + p.title + '</b>' +
          '<span>' + line + ' 🔊</span>' +
        '</div>' +
        art(propKey, 'st-mb-prop') +
      '</div>'
    );
  }

  function missionOutroHtml(missionId, zoneNum) {
    var p = PLOTS[missionId];
    var c = CHARS[zoneNum] || CHARS[1];
    if (!p) return '';
    var propKey = p.propDone || p.prop || 'o_compass';
    return (
      '<div class="st-outro">' +
        art(c.happy, 'st-outro-char') +
        art(propKey, 'st-outro-prop') +
        '<p class="st-outro-line">' + p.outro + '</p>' +
      '</div>'
    );
  }

  root.IslandStory = {
    ready: ready,
    CHARS: CHARS,
    PLOTS: PLOTS,
    art: art,
    pic: pic,
    charPic: charPic,
    pipLine: pipLine,
    plotOf: plotOf,
    playIntro: playIntro,
    playChestCutscene: playChestCutscene,
    playEnding: playEnding,
    missionBannerHtml: missionBannerHtml,
    missionOutroHtml: missionOutroHtml
  };
})(typeof window !== 'undefined' ? window : this);
