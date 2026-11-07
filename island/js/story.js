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
    /* Chapter 1 — Admiral Benbow Harbour */
    'g3-z1-m1': { title: "Clue 1: The Admiral Benbow Inn Door", prop: 'o_benbow_inn', propDone: 'o_benbow_inn',
      intro: ["Jim Hawkins and baby leopard Benbow welcome you to the Admiral Benbow Inn!", "Listen to the greeting clue and tap the matching card!"],
      outro: "Well done! The Admiral Benbow Inn door opens wide!",
      thanks: "Well done! The Admiral Benbow Inn door opens wide!" },
    'g3-z1-m2': { title: 'Clue 2: The Harbour Notice Board', prop: 'o_map_scroll', propDone: 'o_map_scroll',
      intro: ["Parrot Captain Flint flutters onto the Harbour Notice Board: 'Pieces of eight! Who is where at school?'", "Listen and match each person and school room!"],
      outro: "Splendid! You unlocked the Harbour Notice Board clue!",
      thanks: "Splendid! You unlocked the Harbour Notice Board clue!" },
    'g3-z1-m3': { title: "Clue 3: The Ship's Calendar Wheel", prop: 'o_ship_wheel', propDone: 'o_ship_wheel',
      intro: ["Benbow the spotted leopard cub points to the 12 spokes on the wooden Ship's Wheel!", "Put the months of the year in the right order on the wheel!"],
      outro: "Click-clack! The 12-spoke Calendar Wheel spins into place!",
      thanks: "Click-clack! The 12-spoke Calendar Wheel spins into place!" },
    'g3-z1-m4': { title: 'Clue 4: The Brass Harbour Telescope', prop: 'o_spyglass', propDone: 'o_spyglass',
      intro: ["Jim Hawkins peers through the brass telescope on the harbour lookout.", "Spot the right birthday clue, age, and party items through the lens!"],
      outro: "Sharp eyes, Captain! We spotted the secret birthday signal!",
      thanks: "Sharp eyes, Captain! We spotted the secret birthday signal!" },
    'g3-z1-m5': { title: "Clue 5: Billy Bones's Sea Chest", prop: 'o_billy_chest', propDone: 'o_treasure_gold',
      intro: ["We reached Billy Bones's brass-bound Sea Chest! Match the National Days and pass the final harbour review to open it!"],
      outro: "Hooray! Billy Bones's Sea Chest bursts open and Map Piece #1 is yours!",
      thanks: "Hooray! Billy Bones's Sea Chest bursts open and Map Piece #1 is yours!" },

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
    /* Chapter 1 — Admiral Benbow Harbour */
    'g4-z1-m1': { title: "Clue 1: The Admiral Benbow Inn Door", prop: 'o_benbow_inn', propDone: 'o_benbow_inn',
      intro: ["Jim Hawkins and baby leopard Benbow stand at the Admiral Benbow Inn door!", "Listen to each polite permission question and tap the right clue!"],
      outro: "Yes, you can! The Admiral Benbow Inn door opens!",
      thanks: "Yes, you can! The Admiral Benbow Inn door opens!" },
    'g4-z1-m2': { title: 'Clue 2: The Harbour Supply Crates', prop: 'o_barrel_dock', propDone: 'o_barrel_dock',
      intro: ["Parrot Captain Flint squawks: 'Pass the supplies, please! Match each polite request at the harbour crates!'"],
      outro: "Here you are! Every harbour crate is packed and ready!",
      thanks: "Here you are! Every harbour crate is packed and ready!" },
    'g4-z1-m3': { title: 'Clue 3: Captain Flint Says at the Helm', prop: 'o_ship_wheel', propDone: 'o_ship_wheel',
      intro: ["Captain Flint perches on the Ship's Wheel! Follow only the instructions when 'Flint says'!"],
      outro: "Sharp listening, Captain! You mastered every classroom command at the helm!",
      thanks: "Sharp listening, Captain! You mastered every classroom command at the helm!" },
    'g4-z1-m4': { title: 'Clue 4: Counting Through the Brass Telescope', prop: 'o_spyglass', propDone: 'o_spyglass',
      intro: ["Look through the brass telescope with Jim Hawkins and count the ships, barrels, and gulls up to 50!"],
      outro: "Brilliant counting! We have the exact numbers for the sea lock!",
      thanks: "Brilliant counting! We have the exact numbers for the sea lock!" },
    'g4-z1-m5': { title: "Clue 5: Billy Bones's Number-Lock Chest", prop: 'o_billy_chest', propDone: 'o_treasure_gold',
      intro: ["Spin the three brass number dials (1–50) and pass the final harbour review to unlock Billy Bones's Sea Chest!"],
      outro: "Hooray! Billy Bones's Sea Chest is open and Map Piece #1 is yours!",
      thanks: "Hooray! Billy Bones's Sea Chest is open and Map Piece #1 is yours!" },

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

  /* Parse mission IDs such as 'g3-z1-m2' or 'g4-z1-s1' */
  function parseId(missionId) {
    var m = /^g([34])-z([1-4])-([ms])(\d+)$/.exec(String(missionId || ''));
    if (!m) return { grade: 3, zone: 1, kind: 'm', num: 1, isStar: false };
    return {
      grade: Number(m[1]),
      zone: Number(m[2]),
      kind: m[3],
      num: Number(m[4]),
      isStar: m[3] === 's'
    };
  }

  /* Build intro cutscene steps for a mission (called by app.js before launching a mission) */
  function missionSteps(mission, docOrZone, gradeOpt, monsterHtmlOpt) {
    if (!mission) return [];
    var parsed = parseId(mission.id);
    var zoneNum = parsed.zone || 1;
    var c = CHARS[zoneNum] || CHARS[1];
    var p = PLOTS[mission.id];
    var mHtml = typeof monsterHtmlOpt === 'string'
      ? monsterHtmlOpt
      : (root.IslandApp && root.IslandApp.monsterHtml ? root.IslandApp.monsterHtml(92) : '');
    if (!p || !p.intro || !p.intro.length) {
      return [{
        bg: 'benbow',
        speaker: c.name,
        charKey: c.idle,
        prop: 'o_compass',
        voice: c.voice || 'pip',
        monsterHtml: mHtml,
        text: (mission.title ? (mission.title + ' — ') : '') + 'Ready for this harbour clue, Captain?'
      }];
    }
    return p.intro.map(function (line, idx) {
      return {
        bg: 'benbow',
        speaker: idx === 0 ? c.name : 'Parrot Flint',
        charKey: idx === 0 ? c.idle : 'c_pip_happy',
        prop: p.prop || 'o_compass',
        voice: idx === 0 ? (c.voice || 'bolt') : 'pip',
        monsterHtml: mHtml,
        text: line
      };
    });
  }

  /* Show a cutscene from an options object { steps, lastLabel, onDone } */
  function showScene(opts) {
    opts = opts || {};
    var steps = opts.steps || [];
    var onDone = opts.onDone || function () {};
    if (!steps.length) {
      onDone();
      return;
    }
    var mHtml = (steps[0] && steps[0].monsterHtml) || (root.IslandApp && root.IslandApp.monsterHtml ? root.IslandApp.monsterHtml(92) : '');
    showCutscene(steps, mHtml, onDone, opts.lastLabel);
  }

  /* Return spoken completion praise object { text, who } for a finished mission */
  function thanks(mission) {
    if (!mission) return null;
    var parsed = parseId(mission.id);
    var c = CHARS[parsed.zone || 1] || CHARS[1];
    var p = PLOTS[mission.id];
    var text = (p && (p.thanks || p.outro)) || 'Splendid work, Captain! You solved the clue!';
    return { text: text, who: c.voice || 'pip' };
  }

  /* Return HTML banner for the reward modal after completing a mission */
  function thanksHtml(mission) {
    if (!mission) return '';
    var parsed = parseId(mission.id);
    return missionOutroHtml(mission.id, parsed.zone || 1);
  }

  function playIntro(monsterHtml, onDone) {
    var slides = [
      { bg: 'benbow', speaker: 'Jim Hawkins & Benbow', charKey: 'c_jim_happy', prop: 'c_benbow_happy', voice: 'bolt',
        text: "Ahoy! Welcome to Admiral Benbow Harbour! My spotted leopard cub Benbow and I found Billy Bones's mysterious sea chest at the inn!" },
      { bg: 'benbow', speaker: 'Parrot Captain Flint', charKey: 'c_pip_happy', prop: 'o_map_scroll', voice: 'pip',
        text: "Squawk! Pieces of eight! Solve the 5 Harbour Clues in order — from the Benbow Inn door to Billy Bones's chest — to claim Map Piece #1!" },
      { bg: 'benbow', speaker: 'Captain Billy Bones', charKey: 'c_billy', prop: 'o_billy_chest', voice: 'bolt',
        text: "Keep a sharp eye out for a one-legged sailor, young captain! Use your English skills at every stop to unlock my sea chest!" }
    ];
    showCutscene(slides, monsterHtml, onDone);
  }

  function playChestCutscene(zoneNum, rewardName, rewardSticker, monsterHtml, onDone) {
    var c = CHARS[zoneNum] || CHARS[1];
    var nextZone = CHARS[zoneNum + 1];
    var slides = [
      { bg: 'benbow', speaker: c.name, charKey: c.happy, prop: 'o_treasure_gold', voice: c.voice,
        text: "Shiver me timbers! You solved all 5 Map Clues in " + c.zoneName + " and unlocked Billy Bones's Sea Chest! Inside is: " + rewardName + "!" },
      zoneNum === 1
        ? { bg: 'benbow', speaker: 'Long John Silver', charKey: 'c_silver', prop: 'o_hispaniola', voice: 'lulu',
            text: "A shadow falls across the harbour pier... Long John Silver tips his hat: 'Well done with Map Piece #1, young captain! See you aboard the Hispaniola in Chapter 2!'" }
        : (nextZone
          ? { bg: 'benbow', speaker: 'Parrot Flint', charKey: 'c_pip_happy', prop: 'o_hispaniola', voice: 'pip',
              text: "All hands on deck! The Hispaniola is ready at the pier! Set sail for " + nextZone.zoneName + " to meet " + nextZone.name + "!" }
          : { bg: 'benbow', speaker: 'Parrot Flint', charKey: 'c_pip_happy', prop: 'o_treasure_gold', voice: 'pip',
              text: "Pieces of eight! All 4 Sea Chests are open! You found the Great Treasure of Captain Flint!" })
    ];
    showCutscene(slides, monsterHtml, function () {
      if (!nextZone) playEnding(monsterHtml, onDone);
      else if (onDone) onDone();
    });
  }

  function playEnding(monsterHtml, onDone) {
    var rootEl = document.getElementById('isl-modal-root');
    if (!rootEl) { if (onDone) onDone(); return; }
    if (root.IslandAudio && root.IslandAudio.playFanfare) root.IslandAudio.playFanfare();
    var line = "Three cheers for the Grand Captain of Treasure Island! You sailed the Hispaniola and found Captain Flint's gold!";
    if (root.IslandAudio && root.IslandAudio.speak) root.IslandAudio.speak(line, null, 'pip');
    rootEl.innerHTML =
      '<div id="st-overlay" class="open">' +
        '<div class="st-backdrop" style="--st-bg:url(../art/bg_benbow.webp)"></div>' +
        '<div class="st-stage st-ending">' +
          '<div class="st-confetti"></div>' +
          '<h2 class="st-end-title">🏴‍☠️ Heroes of Treasure Island!</h2>' +
          '<div class="st-parade">' +
            '<div class="st-parade-mon">' + (monsterHtml || '') + '</div>' +
            '<div class="st-parade-mon">' + art('c_jim_happy', 'st-parade-char') + '</div>' +
            '<div class="st-parade-mon">' + art('c_benbow_happy', 'st-parade-char') + '</div>' +
            '<div class="st-parade-mon">' + art('c_pip_happy', 'st-parade-char') + '</div>' +
          '</div>' +
          '<div class="st-outro"><p class="st-outro-line">' + line + '</p></div>' +
          '<button type="button" class="isl-btn amber st-next" id="st-end-done">⚓ Back to the Harbour! 🚀</button>' +
        '</div>' +
      '</div>';
    document.getElementById('st-end-done').onclick = function () {
      if (root.IslandAudio && root.IslandAudio.playTap) root.IslandAudio.playTap();
      rootEl.innerHTML = '';
      if (onDone) onDone();
    };
  }

  function showCutscene(slides, monsterHtml, onDone, customLastLabel) {
    var rootEl = document.getElementById('isl-modal-root');
    if (!rootEl) { if (onDone) onDone(); return; }
    var i = 0;
    function render() {
      var s = slides[i];
      var bgFile = s.bg === 'benbow' ? 'bg_benbow.webp' : (MANIFEST['bg_' + s.bg] || ('bg_' + s.bg + '.webp'));
      var lastBtnText = customLastLabel || "Let's Set Sail! ⛵";
      rootEl.innerHTML =
        '<div id="st-overlay" class="open">' +
          '<div class="st-backdrop" style="--st-bg:url(../art/' + bgFile + ')"></div>' +
          '<div class="st-stage">' +
            '<button type="button" class="st-skip" id="st-skip">Skip ⏭</button>' +
            '<div class="st-actors">' +
              '<div class="st-actor left"><div class="st-monster">' + (monsterHtml || '') + '</div></div>' +
              '<div class="st-actor center">' + art(s.charKey, 'st-friend') + '</div>' +
              (s.prop ? '<div class="st-actor right">' + art(s.prop, 'st-prop') + '</div>' : '') +
            '</div>' +
            '<div class="st-dialog">' +
              '<div class="st-speaker">' + s.speaker + '</div>' +
              '<button type="button" class="st-say" id="st-say" title="Listen">🔊</button>' +
              '<div class="st-line">' + s.text + '</div>' +
              '<div class="st-dots">' + slides.map(function (_, idx) { return '<span class="st-dot ' + (idx === i ? 'on' : '') + '"></span>'; }).join('') + '</div>' +
              '<button type="button" class="st-next" id="st-next">' + (i < slides.length - 1 ? 'Next ▶' : lastBtnText) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      var speakSlide = function () {
        if (root.Ch1Audio && typeof root.Ch1Audio.speak === 'function') {
          root.Ch1Audio.speak(s.text);
        } else if (root.IslandAudio && root.IslandAudio.speak) {
          root.IslandAudio.speak(s.text, null, s.voice || 'pip');
        }
      };
      speakSlide();
      document.getElementById('st-say').onclick = function () {
        speakSlide();
      };
      document.getElementById('st-skip').onclick = finish;
      document.getElementById('st-next').onclick = function () {
        if (root.IslandAudio && root.IslandAudio.playTap) root.IslandAudio.playTap();
        i++;
        if (i < slides.length) render(); else finish();
      };
    }
    function finish() {
      if (root.IslandAudio && root.IslandAudio.playTap) root.IslandAudio.playTap();
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
          '<b>' + c.name + ' · ' + p.title + '</b><br>' +
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
        '<div style="display:flex;align-items:center;justify-content:center;gap:12px">' +
          '<div style="width:64px;height:64px">' + art(c.happy, 'st-outro-char') + '</div>' +
          '<div style="width:56px;height:56px">' + art(propKey, 'st-outro-prop') + '</div>' +
        '</div>' +
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
    parseId: parseId,
    missionSteps: missionSteps,
    showScene: showScene,
    thanks: thanks,
    thanksHtml: thanksHtml,
    playIntro: playIntro,
    playChestCutscene: playChestCutscene,
    playEnding: playEnding,
    missionBannerHtml: missionBannerHtml,
    missionOutroHtml: missionOutroHtml
  };
})(typeof window !== 'undefined' ? window : this);
