/* Practice Island — Adventure screens (Zone 1 first). Full-screen games instead of a question window:
   a parts belt (listen), a robot that gets built (match), a picture plan (read), a word train (build), and a machine you wake with your voice (say).
   Every word has a picture and every sentence has a scene, so a pupil can understand without reading well.
   Answers still go through IslandApp, so stars, XP limits and saved progress work exactly as before. */
(function (root) {
  'use strict';

  var have = {};
  var artDir = {};
  function loadZoneArt(dir) {
    return fetch(dir + 'manifest.json?v=6').then(function (r) { return r.json(); }).then(function (l) {
      l.forEach(function (n) { have[n] = true; artDir[n] = dir; });
    }).catch(function () {});
  }
  var ready = Promise.all([loadZoneArt('art/z1/'), loadZoneArt('art/z2/'), loadZoneArt('art/z3/'), loadZoneArt('art/z4/')]);

  var ZONES_ON = { 1: true, 2: true, 3: true, 4: true };
  var ZONE_CFG = {
    1: {
      bg: 'bg_benbow', cast: 'c_jim', name: 'Jim Hawkins',
      gear: 'o_compass', gearEmoji: '🧭',
      off: 'o_billy_chest', on: 'o_treasure_gold',
      buildObj: 'o_hispaniola', vehicle: 'o_hispaniola',
      sparks: ['🧭', '🪙', '⛵'],
      right: ['Ahoy! That fits the clue!', 'Great job, Captain!', 'Pieces of eight! Yes!', 'You found the clue!'],
      sayGood: ['Loud and clear, Captain!', 'Great captain voice!', 'The crew heard you!'],
      matchDone: 'Look! The Hispaniola ship is ready!',
      train: ['All hands on deck!', 'Set sail!', 'Great sentence, Captain!'],
      wake: 'The Sea Chest is unlocked! Hooray!'
    },
    2: {
      bg: 'bg_beach', cast: 'c_silver', name: 'Captain Silver',
      gear: 'o_compass', gearEmoji: '🧭',
      off: 'o_lighthouse_off', on: 'o_lighthouse_on',
      buildObj: 'o_lighthouse_on', vehicle: 'o_boat',
      sparks: ['⚓', '🪙', '✨'],
      right: ['Aye aye, Captain!', 'Good job! It works!', 'Shiver me timbers! Great!', 'Yes! That is it!'],
      sayGood: ['Wow! I can hear you!', 'Great voice!', 'The beacon shines!'],
      matchDone: 'Look! The Spyglass Beacon is ready!',
      train: ['Splish splash!', 'Row ashore!', 'Great sentence!'],
      wake: 'The Spyglass Beacon shines! Hooray!'
    },
    3: {
      bg: 'bg_river', cast: 'c_livesey', name: 'Dr. Livesey',
      gear: 'o_compass', gearEmoji: '🧭',
      off: 'o_market_closed', on: 'o_market_open',
      buildObj: 'o_basket', vehicle: 'o_stone',
      sparks: ['📜', '🧭', '✨'],
      right: ['Splendid work!', 'Good job! That is right!', 'Bravo, young sailor!', 'Yes! That is it!'],
      sayGood: ['Clear and brave!', 'Great voice!', 'The Stockade is secure!'],
      matchDone: 'Look! The Stockade supplies are ready!',
      train: ['Steady now!', 'Across the river!', 'Great sentence!'],
      wake: 'The Stockade Fort is open! Hooray!'
    },
    4: {
      bg: 'bg_volcano', cast: 'c_billy', name: 'Captain Smollett',
      gear: 'o_compass', gearEmoji: '🧭',
      off: 'o_billy_chest', on: 'o_treasure_gold',
      buildObj: 'o_treasure_gold', vehicle: 'o_hispaniola',
      sparks: ['👑', '🪙', '✨'],
      right: ['Steady on course!', 'Good job, Captain!', 'Golden clue found!', 'Yes! That is it!'],
      sayGood: ['A true captain voice!', 'Great voice!', 'The vault is opening!'],
      matchDone: 'Look! Flint\'s Golden Treasure is revealed!',
      train: ['All hands!', 'To the peak!', 'Great sentence!'],
      wake: 'Captain Flint\'s Golden Vault is open! Hooray!'
    }
  };

  var WORD_PIC = {
    // Zone 1 (G3 & G4)
    machine: 'w_machine', invent: 'w_invent', tidy: 'w_tidy', mess: 'w_mess', mirror: 'w_mirror', mirrors: 'w_mirror', plan: 'w_plan', 'try': 'w_try', sleep: 'w_sleep', hide: 'w_hide',
    wheels: 'w_wheels', brooms: 'w_broom', hexagon: 'w_hexagon', 'make something new': 'w_invent', 'eat your lunch': 'w_lunch', 'run very fast': 'w_run',
    journey: 'w_journey', visualize: 'w_visualize', freeze: 'w_freeze', sleepy: 'w_sleepy', chase: 'w_chase', chased: 'w_chase', curious: 'w_curious', workout: 'w_workout', shelf: 'w_shelf', creative: 'w_creative',
    // Zone 2 (G3 & G4)
    harvest: 'w_harvest', thankful: 'w_thankful', moon: 'w_moon', potatoes: 'w_potatoes', delicious: 'w_delicious', pineapple: 'w_pineapple',
    vet: 'w_vet', 'a doctor for animals': 'w_vet', 'a deep ocean boat': 'w_ocean_boat', 'a baking tool': 'w_baking_tool',
    needle: 'w_needles', needles: 'w_needles', fur: 'w_fur', cone: 'w_cone', cones: 'w_cone', built: 'w_built', grew: 'w_grew',
    // Zone 3 (G3 & G4)
    barter: 'w_barter', bartered: 'w_barter', expensive: 'w_expensive', 'costs a lot of money': 'w_expensive', 'costs no money': 'w_free', 'very small': 'w_small',
    cashier: 'w_cashier', plastic: 'w_plastic', coins: 'w_coins', save: 'w_save', saved: 'w_save', grain: 'w_grain', shells: 'w_shells', painted: 'w_painted',
    farmer: 'w_farmer', goat: 'w_goat', walked: 'w_walked', walk: 'w_walked',
    energy: 'w_energy', noisy: 'w_noisy', thin: 'w_thin', 'not thick; easy to break': 'w_thin', trap: 'w_trap', electric: 'w_electric', polar: 'w_polar',
    quiet: 'w_quiet', slow: 'w_slow', trash: 'w_trash', 'very big': 'w_big', 'very hot': 'w_hot',
    // Zone 4 (G3 & G4)
    thunder: 'w_thunder', sunrise: 'w_sunrise', ship: 'w_ship', museum: 'w_museum', barked: 'w_barked', island: 'w_island',
    music: 'w_music', rain: 'w_rain', 'by boat': 'w_boat', boat: 'w_boat', 'by train': 'w_train', 'a train': 'w_train', 'by bus': 'w_bus', 'a bus': 'w_bus',
    lunch: 'w_lunch', bedtime: 'w_bedtime', danced: 'w_danced', sang: 'w_sang', plane: 'w_plane', bike: 'w_bike',
    teamwork: 'w_teamwork', championship: 'w_championship', 'the championship': 'w_championship', court: 'w_court', platform: 'w_platform',
    perform: 'w_perform', league: 'w_league', cancel: 'w_cancel', forget: 'w_forget'
  };
  var WORD_EMOJI = {
    // Question & grammar words
    who: '🧑', where: '📍', when: '⏰', why: '❓', what: '💬',
    'for': '💝', to: '➡️', at: '📍', 'in': '📦', 'with': '🤝', of: '🔗',
    is: '1️⃣', are: '2️⃣', am: '🙋', was: '⏳', were: '⏳',
    go: '🏃', goes: '🏃', going: '🏃',
    because: '💡', so: '👉', instead: '🔄', but: '⚖️', or: '🔀',
    than: '⚖️', then: '⏭️', that: '👉',
    builded: '❌', building: '🏗️', growed: '❌', growing: '🌱', gived: '❌', giving: '🎁', gave: '🎁',
    walking: '🚶', home: '🏠', under: '⬇️', quick: '⚡',
    five: '5️⃣', ten: '🔟', two: '2️⃣',
    'three points': '3️⃣', 'two points': '2️⃣', 'one point': '1️⃣',
    work: '💪',
    // Zone 2 words
    harvest: '🌾', thankful: '🙏', moon: '🌕', potatoes: '🥔', delicious: '🍲', pineapple: '🍍',
    vet: '🩺', 'a doctor for animals': '🩺', 'a deep ocean boat': '🚢', 'a baking tool': '🥣',
    needle: '🌲', needles: '🌲', fur: '🦊', cone: ' pinecones'[0] === ' ' ? '🌰' : '🌰', cones: '🌰', built: '🦫', grew: '🌱',
    // Zone 3 words
    barter: '🤝', bartered: '🤝', expensive: '💎', 'costs a lot of money': '💎', 'costs no money': '🆓', 'very small': '🐜',
    cashier: '🧑‍💼', plastic: '💳', coins: '🪙', save: '🐷', saved: '🐷', grain: '🌾', shells: '🐚', painted: '🎨',
    farmer: '👨‍🌾', goat: '🐐', walked: '🚶', walk: '🚶',
    energy: '⚡', noisy: '🔊', thin: '🧊', 'not thick; easy to break': '🧊', trap: '🪤', electric: '🔋', polar: '🐻‍❄️',
    quiet: '🤫', slow: '🐌', trash: '🗑️', 'very big': '🐘', 'very hot': '☀️',
    // Zone 4 words
    thunder: '⛈️', sunrise: '🌅', ship: '🚢', museum: '🏛️', barked: '🐕', island: '🏝️',
    music: '🎵', rain: '🌧️', 'by boat': '⛵', boat: '⛵', 'by train': '🚆', 'a train': '🚆', 'by bus': '🚌', 'a bus': '🚌',
    lunch: '🥪', bedtime: '🛌', danced: '💃', sang: '🎤', plane: '✈️', bike: '🚲',
    teamwork: '🤝', championship: '🏆', 'the championship': '🏆', court: '🏀', platform: '🚉',
    perform: '🎭', league: '🥇', cancel: '🚫', forget: '🤔'
  };
  var SCENES = [
    // Zone 1
    [/clara builds/, 's_clara_machine'], [/tidy your room/, 's_tidy_room'], [/room is a/, 's_mess_room'], [/does not work|do not stop|do not give up/, 's_try_again'],
    [/plan/, 's_new_plan'], [/what does this machine/, 's_what_machine'], [/cleans the floor/, 's_cleans_floor'], [/invent/, 's_invent_new'], [/bicycle/, 's_bicycle'],
    [/rabbit sees|can freeze/, 's_rabbit_freeze'], [/butterflies/, 's_butterflies'], [/visualize/, 's_visualize_read'], [/tired|sleepy|why was alice/, 's_alice_sleepy'],
    [/alice (ran|chase)|alice chased|did alice chase/, 's_alice_chase'], [/alice fall|where did the rabbit go/, 's_alice_fall'], [/love reading/, 's_love_reading'], [/curious and brave|curious about/, 's_curious_brave'],
    // Zone 2
    [/thankful .* teacher/, 's_thankful_teacher'], [/thankful .* food|delicious food/, 's_thankful_food'], [/full moon/, 's_full_moon'],
    [/potatoes/, 's_potatoes_soil'], [/go outside/, 's_go_outside'], [/harvest/, 's_harvest_festival'], [/thankful for my family/, 's_thankful_family'],
    [/vet|doctor for animals/, 's_vet_animals'], [/cones|needles/, 's_pine_cones'], [/winter fur|thick fur/, 's_winter_fur'],
    [/beaver|verb build/i, 's_beaver_home'], [/plant grew|trees grew|verb grow/i, 's_plant_grew'], [/live in the forest/, 's_forest_animals'], [/verb give/i, 's_gave_gift'],
    // Zone 3
    [/barter/, 's_barter_goat'], [/credit card/, 's_credit_card'], [/cashier/, 's_cashier_shop'], [/paige/, 's_paige_walk'],
    [/paper money|save my gold coins/, 's_paper_coins'], [/save my money|piggy/, 's_save_bank'], [/expensive/, 's_expensive_toy'], [/how much is this book/, 's_how_much'],
    [/uses energy/, 's_car_energy'], [/gasoline|noisy/, 's_noisy_car'], [/thin/, 's_thin_ice'], [/electric cars/, 's_electric_car'],
    [/ride a bike|ride my bike|air dirty/, 's_ride_bike'], [/polar bears/, 's_polar_bears'], [/changing planet/, 's_help_planet'],
    // Zone 4
    [/sounded like|mountain made a loud/, 's_mountain_noise'], [/leave the island|left .* by boat/, 's_family_boat'], [/dogs .* barked|dogs barked/, 's_dogs_bark'],
    [/ship saw them|ship helped/, 's_ship_saved'], [/sunrise/, 's_sunrise_island'], [/mona lisa|louvre|museum/, 's_museum_painting'],
    [/teamwork/, 's_teamwork'], [/players .* court/, 's_players_court'], [/sparks win|won the .* championship/, 's_won_trophy'],
    [/basket from far away/, 's_basket_far'], [/harry was late/, 's_harry_late'], [/train platform/, 's_platform_wait'],
    [/perform the show/, 's_perform_show'], [/work together/, 's_work_together']
  ];
  var LINES = {
    right: ['Ahoy! That fits the clue!', 'Great job, Captain!', 'Pieces of eight! Yes!', 'You found the clue!'],
    wrong: ['Not that clue! Try again!', 'Oops! Look closely at the map!', 'Hmm! Try another one!'],
    wrongListen: ['Listen to the clue again!', 'Oops! Listen one more time!'],
    start: {
      listen: 'Listen to the clue! Tap the right picture.',
      match: 'Tap a word. Then tap its picture on the map.',
      read: 'Read the clue! Which word is missing?',
      build: 'Tap the words in order to build the clue.',
      say: 'Listen to the captain. Then you say it!'
    },
    firstWord: 'Tap a word first!',
    robot: 'Look! The Hispaniola ship is ready!',
    train: ['All hands on deck!', 'Set sail!', 'Great sentence, Captain!'],
    sayNow: 'Now you say it!',
    hearing: 'I am listening!',
    sayGood: ['Loud and clear, Captain!', 'Great captain voice!', 'The crew heard you!'],
    sayAlmost: 'Almost! Listen and try again.',
    sayMove: 'Great try! Let us sail on!',
    sayQuiet: 'I cannot hear you. Say it like a captain!',
    sayByHand: 'Say it loud. Then tap the green button.',
    machineOn: 'The Sea Chest is unlocked! Hooray!'
  };

  var S = null;   // the screen of the running mission: { run, el, q, ... }

  function zcfg(run) {
    var z = (run && run.zone) || (S && S.run && S.run.zone) || 1;
    return ZONE_CFG[z] || ZONE_CFG[1];
  }
  function castPoseName(pose) {
    var base = zcfg().cast;
    if (!pose || pose === 'talk') return base;
    return base + '_' + pose;
  }
  function srcOf(name) { return (artDir[name] || 'art/z1/') + name + '.webp'; }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function reduce() { try { return root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function img(name, cls) { return have[name] ? '<img class="' + (cls || '') + '" src="' + srcOf(name) + '" alt="" draggable="false">' : ''; }
  function $(id) { return document.getElementById(id); }

  function picFor(word, fallbackEmoji) {
    var k = String(word || '').toLowerCase().trim();
    if (WORD_PIC[k] && have[WORD_PIC[k]]) return '<img class="adv-card-pic" src="' + srcOf(WORD_PIC[k]) + '" alt="" draggable="false">';
    return '<span class="adv-card-emoji">' + esc(WORD_EMOJI[k] || fallbackEmoji || '✨') + '</span>';
  }

  function sceneFor(q) {
    var text = String((q && (q.speak || q.text || q.q)) || '').toLowerCase();
    for (var i = 0; i < SCENES.length; i++) if (SCENES[i][0].test(text) && have[SCENES[i][1]]) return SCENES[i][1];
    return '';
  }

  function handles(run) {
    var cfg = zcfg(run);
    return !!(run && ZONES_ON[run.zone] && have[cfg.bg] && new URLSearchParams(root.location.search).get('oldgames') !== '1');
  }
  function active() { return !!(S && S.run && root.IslandApp && root.IslandApp.state() && root.IslandApp.state().missionRun === S.run); }

  /* ---------- talking ---------- */
  function setBubble(text) {
    var b = $('adv-bubble'); if (!b) return;
    b.textContent = text; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  }
  function bolt(pose, text, spoken, onEnd) {
    var el = $('adv-bolt'), pName = castPoseName(pose);
    if (el && have[pName]) el.src = srcOf(pName);
    else if (el && have[zcfg().cast]) el.src = srcOf(zcfg().cast);
    if (el) { el.classList.remove('adv-bolt-hop'); void el.offsetWidth; if (pose === 'happy') el.classList.add('adv-bolt-hop'); }
    if (text) setBubble(text);
    if (spoken) root.IslandAudio.speak(spoken === true ? text : spoken, onEnd, S && S.run && S.run.zone);
    else if (onEnd) onEnd();
  }
  function monster(move) {
    var svg = document.querySelector('#adv-monster svg');
    if (svg && root.MonsterRenderer && root.MonsterRenderer.play && !reduce()) { try { root.MonsterRenderer.play(svg, move); } catch (e) { /* stays still */ } }
  }

  /* ---------- small animations ---------- */
  function centre(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function flyTo(fromEl, toEl, html, ms, done) {
    if (!fromEl || !toEl || !fromEl.animate || reduce()) { if (done) done(); return; }
    var a = centre(fromEl), b = centre(toEl), f = document.createElement('div');
    f.className = 'adv-fly'; f.innerHTML = html; f.style.left = a.x + 'px'; f.style.top = a.y + 'px';
    document.body.appendChild(f);
    var dx = b.x - a.x, dy = b.y - a.y, up = Math.min(0, dy) - 70;
    var anim = f.animate([
      { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)' },
      { transform: 'translate(calc(-50% + ' + dx * 0.5 + 'px),calc(-50% + ' + up + 'px)) scale(1.15) rotate(180deg)', offset: 0.55 },
      { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(.45) rotate(360deg)' }
    ], { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
    anim.onfinish = function () { f.remove(); if (done) done(); };
  }
  function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function burstAt(el, list, n) {
    if (!el || reduce()) return;
    var c = centre(el);
    for (var i = 0; i < (n || 8); i++) {
      var s = document.createElement('div'), ang = (i / (n || 8)) * Math.PI * 2;
      s.className = 'adv-spark'; s.textContent = list[i % list.length];
      s.style.left = c.x + 'px'; s.style.top = c.y + 'px';
      s.style.setProperty('--dx', Math.round(Math.cos(ang) * 90) + 'px'); s.style.setProperty('--dy', Math.round(Math.sin(ang) * 80) + 'px');
      document.body.appendChild(s);
      (function (x) { setTimeout(function () { x.remove(); }, 800); })(s);
    }
  }
  /* calls done once, after the voice has ended but never earlier than minMs (and never later than maxMs if a voice fails) */
  function when(minMs, maxMs) {
    var started = Date.now(), ended = false, fn = null, fired = false;
    function fire() { if (fired || !fn) return; fired = true; fn(); }
    setTimeout(fire, maxMs);
    return {
      voiceEnded: function () { ended = true; var left = minMs - (Date.now() - started); if (left <= 0) fire(); else setTimeout(fire, left); },
      then: function (f) { fn = f; if (ended && Date.now() - started >= minMs) fire(); }
    };
  }

  /* ---------- the stage ---------- */
  function lightGears(run) {
    var box = $('adv-gears'); if (!box) return;
    var cfg = zcfg(run);
    var n = run.total, on = run.qIndex, out = '';
    for (var i = 0; i < n; i++) out += '<span class="adv-gear' + (i < on ? ' on' : (i === on ? ' now' : '')) + '">' + (have[cfg.gear] ? '<img src="' + srcOf(cfg.gear) + '" alt="">' : cfg.gearEmoji) + '</span>';
    box.innerHTML = out;
  }
  function buildStage(run, monsterHtml) {
    var m = run.mission, root0 = $('isl-modal-root'), cfg = zcfg(run);
    root0.innerHTML =
      '<div class="adv adv-z' + (run.zone || 1) + '" id="adv-stage">' +
        '<div class="adv-bg" style="background-image:url(' + srcOf(cfg.bg) + ')"></div>' +
        '<header class="adv-top">' +
          '<button type="button" class="adv-btn adv-x" aria-label="Back to the map" onclick="IslandApp.closeModal()">✕</button>' +
          '<div class="adv-gears" id="adv-gears"></div>' +
        '</header>' +
        '<div class="adv-world">' +
          '<div class="adv-actor adv-monster" id="adv-monster">' + monsterHtml + '</div>' +
          '<div class="adv-goal" id="adv-goal"></div>' +
          '<div class="adv-actor adv-friend" id="adv-friend">' +
            '<div class="adv-bubble" id="adv-bubble"></div>' +
            '<img class="adv-bolt" id="adv-bolt" src="' + srcOf(cfg.cast) + '" alt="' + esc(cfg.name) + '" onclick="IslandAdventure.tapBolt()">' +
          '</div>' +
        '</div>' +
        '<div class="adv-play" id="adv-play"></div>' +
      '</div>';
    S = { run: run, el: $('adv-stage'), type: '', qIndex: -1, said: false, tries: 0, wrongs: 0 };
    document.documentElement.classList.add('adv-on');
    var svg = document.querySelector('#adv-monster svg');
    if (svg) { svg.removeAttribute('width'); svg.removeAttribute('height'); }
    void m;
  }

  /* ---------- what each question looks like ---------- */
  function card(word, idx, opts) {
    opts = opts || {};
    var speaker = opts.speaker ? '<span class="adv-card-say" onclick="event.stopPropagation(); IslandApp.speakText(\'' + esc(word).replace(/'/g, "\\'") + '\')">🔊</span>' : '';
    return '<button type="button" class="adv-card isl-opt-btn" style="--i:' + idx + '" data-opt="' + esc(word) + '" onclick="IslandApp.pickOption(' + idx + ',this)">' +
      '<span class="adv-card-art">' + picFor(word, opts.emoji) + '</span>' +
      '<span class="adv-card-word">' + esc(word) + speaker + '</span>' +
    '</button>';
  }
  function sentenceHtml(text) {
    var parts = String(text).split(/_{2,}/);
    if (parts.length < 2) return esc(text);
    return esc(parts[0]) + '<span class="adv-blank" id="adv-blank"></span>' + esc(parts.slice(1).join(''));
  }
  function hearBtn(label) {
    return '<button type="button" class="adv-btn adv-hear" onclick="IslandApp.replayMissionAudio()" aria-label="Hear it again">🔊' + (label ? ' ' + esc(label) : '') + '</button>';
  }
  function setGoal(html, cls) { var g = $('adv-goal'); if (g) { g.className = 'adv-goal ' + (cls || ''); g.innerHTML = html; } }
  function once(key) { if (S.goalKey === key) return false; S.goalKey = key; return true; }
  function sceneGoal(q) {
    if (!once(q)) return;
    var s = sceneFor(q);
    if (s) setGoal('<div class="adv-frame" id="adv-scene">' + img(s, 'adv-frame-pic') + '</div>', 'adv-goal-scene');
    else setGoal('<div class="adv-frame adv-frame-emoji" id="adv-scene">' + esc(q.pic || '✨') + '</div>', 'adv-goal-scene');
  }
  function machineGoal(run) {
    if (!once('machine')) return;
    var cfg = zcfg(run);
    var on = run.qIndex >= run.total;
    setGoal('<div class="adv-machine" id="adv-machine">' + img(on ? cfg.on : cfg.off, 'adv-machine-pic') + '</div>', 'adv-goal-machine');
  }
  function robotGoal(run) {
    if (!once('robot')) return;
    var cfg = zcfg(run);
    var hidden = Math.max(0, 100 - Math.round((run.qIndex / run.total) * 100));
    setGoal('<div class="adv-robot" id="adv-robot">' + img(cfg.buildObj, 'adv-robot-ghost') + img(cfg.buildObj, 'adv-robot-built') + '</div>', 'adv-goal-robot');
    var b = document.querySelector('.adv-robot-built');
    if (b) b.style.clipPath = 'inset(' + hidden + '% 0 0 0)';
  }

  function renderListen(run, q) {
    machineGoal(run);
    var opts = q.options || [q.a];
    var blank = /_{2,}/.test(q.prompt || '');
    $('adv-play').innerHTML =
      (blank ? '<div class="adv-sentence">' + sentenceHtml(q.prompt) + '</div>' : '') +
      '<div class="adv-belt-row">' + hearBtn('') +
        '<div class="adv-belt"><div class="adv-belt-track"></div><div class="adv-cards" data-n="' + opts.length + '">' +
          opts.map(function (o, i) { return card(o, i, { emoji: q.pic, speaker: !!run.mission.isStar }); }).join('') +
        '</div></div>' +
      '</div>';
  }
  function renderRead(run, q) {
    sceneGoal(q);
    var opts = q.options || [q.a];
    $('adv-play').innerHTML =
      '<div class="adv-plan"><div class="adv-sentence">' + sentenceHtml(q.q) + '</div>' + hearBtn('') + '</div>' +
      '<div class="adv-cards" data-n="' + opts.length + '">' + opts.map(function (o, i) { return card(o, i, { emoji: q.pic, speaker: true }); }).join('') + '</div>';
  }
  function renderMatch(run) {
    robotGoal(run);
    var all = run.mission.pairs || run.mission.questions || [];
    var board = all.slice(0, Math.min(4, all.length));
    if (run.qIndex >= 4 && all.length > 4) board = all.slice(2, 6);
    var order = board.slice().sort(function (a, b) { return a.word.localeCompare(b.word); });
    if (!S.matchOrder || S.matchKey !== board.map(function (p) { return p.word; }).join()) {
      S.matchKey = board.map(function (p) { return p.word; }).join();
      S.matchOrder = order.map(function (p) { return p.word; }).sort(function (a, b) { return (a.length * 7 + a.charCodeAt(1)) % 5 - (b.length * 7 + b.charCodeAt(1)) % 5; });
    }
    var quiet = S.shownBoard === S.matchKey ? ' adv-quiet' : '';
    S.shownBoard = S.matchKey;
    $('adv-play').innerHTML =
      '<div class="adv-chips' + quiet + '">' + board.map(function (p) {
        var done = !!run.matchDonePairs[p.word], sel = run.matchSelectedLeft === p.word;
        return '<button type="button" class="adv-chip isl-match-tile' + (done ? ' done' : (sel ? ' sel' : '')) + '" data-word="' + esc(p.word) + '" onclick="IslandApp.tapMatchLeft(\'' + esc(p.word) + '\')">🔊 ' + esc(p.word) + '</button>';
      }).join('') + '</div>' +
      '<div class="adv-cards adv-cards-match' + quiet + '" data-n="' + S.matchOrder.length + '">' + S.matchOrder.map(function (w, i) {
        var done = !!run.matchDonePairs[w], pair = board.filter(function (p) { return p.word === w; })[0];
        return '<button type="button" class="adv-card isl-match-tile' + (done ? ' done' : '') + '" style="--i:' + i + '" data-match="' + esc(w) + '" onclick="IslandApp.tapMatchRight(\'' + esc(w) + '\',this)">' +
          '<span class="adv-card-art">' + picFor(w, pair && pair.pic) + '</span>' +
          '<span class="adv-card-word">' + (done ? esc(w) + ' ✓' : '?') + '</span></button>';
      }).join('') + '</div>';
  }
  function renderBuild(run, q) {
    sceneGoal(q);
    var slots = '';
    for (var i = 0; i < q.order.length; i++) {
      var w = run.buildPlaced[i];
      slots += w
        ? '<button type="button" class="adv-wagon' + (i === run.buildPlaced.length - 1 && S.justPlaced ? ' adv-wagon-in' : '') + '" onclick="IslandApp.unplaceBuildWord(' + i + ')"><span>' + esc(w) + '</span><i></i><i></i></button>'
        : '<span class="adv-wagon adv-wagon-empty"><i></i><i></i></span>';
    }
    S.justPlaced = false;
    var quiet = S.shownBuild === q ? ' adv-quiet' : '';
    S.shownBuild = q;
    var cfg = zcfg(run);
    $('adv-play').innerHTML =
      '<div class="adv-train-row">' + hearBtn('') + '<div class="adv-train" id="adv-train"><div class="adv-rail"></div><div class="adv-wagons">' + slots + img(cfg.vehicle, 'adv-engine') + '</div></div></div>' +
      '<div class="adv-bank' + quiet + '" id="isl-build-bank">' + run.buildBank.map(function (w, idx) {
        return '<button type="button" class="adv-word" style="--i:' + idx + '" data-word="' + esc(w) + '" onclick="IslandApp.placeBuildWord(' + idx + ',this)">' + esc(w) + '</button>';
      }).join('') + '</div>';
  }
  function renderSay(run, q) {
    sceneGoal(q);
    var words = String(q.text).split(/\s+/);
    var can = !!(root.SpeechRecognition || root.webkitSpeechRecognition) && !S.noMic;
    $('adv-play').innerHTML =
      '<div class="adv-say">' +
        '<div class="adv-karaoke" id="adv-karaoke">' + words.map(function (w, i) { return '<span class="adv-kw" data-i="' + i + '">' + esc(w) + '</span>'; }).join(' ') + '</div>' +
        '<div class="adv-say-btns">' + hearBtn('Listen') +
          (can
            ? '<button type="button" class="adv-btn adv-mic" id="adv-mic" onclick="IslandAdventure.mic()"><span class="adv-mic-ring"></span>🎤 Say it</button>'
            : '<button type="button" class="adv-btn adv-said" id="adv-said" onclick="IslandAdventure.saidByHand()">🎤 I said it ✓</button>') +
        '</div>' +
      '</div>';
  }

  /* ---------- the voice for a new question ---------- */
  function blanked(text) { return String(text).replace(/_{2,}/g, 'hmm'); }   // the voice says "hmm" for the missing word, so it never gives the answer away
  function hearText(q, type) {
    if (type === 'read' && !(S.run.mission.isStar)) return blanked(q.q);
    return q.speak || q.word || q.q || q.text;
  }
  function startQuestion(run, q, type) {
    var first = S.type === '';
    S.type = type; S.q = q; S.tries = 0; S.wrongs = 0; S.done = false;
    bolt('talk', LINES.start[type] || '', null);
    var play = function () { if (active() && S.q === q) root.IslandAudio.speak(hearText(q, type), type === 'say' ? function () { if (active() && S.q === q) micNudge(); } : null); };
    if (first) root.IslandAudio.speak(LINES.start[type], function () { if (active() && S.q === q) setTimeout(play, 150); }, run.zone);
    else setTimeout(play, 350);
    if (root.IslandRewards && root.IslandRewards.maybeSpawnGoldenFish) { try { root.IslandRewards.maybeSpawnGoldenFish(S.el); } catch (e) { /* no fish today */ } }
  }
  function micNudge() {
    var m = $('adv-mic'); if (m) m.classList.add('nudge');
    bolt('idea', LINES.sayNow, true);
  }

  function render(run, q, type, monsterHtml) {
    if (!S || S.run !== run || !$('adv-stage')) buildStage(run, monsterHtml);
    var newQ = S.qIndex !== run.qIndex || S.type !== type;
    if (type === 'match') { var firstMatch = S.type === ''; renderMatch(run); if (firstMatch) { S.type = 'match'; bolt('talk', LINES.start.match, true); } S.qIndex = run.qIndex; lightGears(run); return; }
    S.qIndex = run.qIndex;
    lightGears(run);
    if (type === 'listen') renderListen(run, q);
    else if (type === 'read') renderRead(run, q);
    else if (type === 'build') renderBuild(run, q);
    else if (type === 'say') renderSay(run, q);
    if (newQ) startQuestion(run, q, type);
  }

  /* ---------- answers ---------- */
  function onRight(btn, run, q, done) {
    var type = q.type || run.mission.type;
    var w = when(type === 'read' ? 1400 : 1100, 6500);
    monster('cheer');
    if (btn) { btn.classList.add('adv-right'); }
    var art = btn && btn.querySelector('.adv-card-art');
    var machine = $('adv-machine');
    var cfg = zcfg(run);
    if (type === 'read') {
      var blank = $('adv-blank');
      if (blank) { blank.textContent = q.a; blank.classList.add('filled'); }
      var sc = $('adv-scene'); restart(sc, 'adv-pop');
      bolt('happy', pick(cfg.right || LINES.right), null);
      root.IslandAudio.speak(q.speak, w.voiceEnded);
    } else {
      var line = pick(cfg.right || LINES.right);
      flyTo(art, machine, art ? art.innerHTML : '', 520, function () {
        restart(machine, 'adv-shake');
        burstAt(machine, cfg.sparks, 9);
        root.IslandAudio.playPop && root.IslandAudio.playPop();
      });
      bolt('happy', line, true, w.voiceEnded);
    }
    S.rightsThisRun = (S.rightsThisRun || 0) + 1;
    var box = document.querySelectorAll('#adv-gears .adv-gear')[run.qIndex];
    if (box) { box.classList.remove('now'); box.classList.add('on'); }
    w.then(done);
  }
  function onWrong(btn) {
    if (!S) return;
    S.wrongs++;
    monster('wiggle');
    if (btn) { restart(btn, 'adv-boing'); }
    var hearAgain = S.type === 'listen';
    var line = pick(hearAgain ? LINES.wrongListen : LINES.wrong);
    var q = S.q;
    bolt('worried', line, true, function () {
      if (active() && hearAgain && S.q === q) root.IslandAudio.speak(hearText(q, 'listen'));
    });
    if (S.wrongs >= 2 && S.type === 'build') {
      var expected = q.order[S.run.buildPlaced.length];
      var el = document.querySelector('#isl-build-bank [data-word="' + esc(expected) + '"]');
      if (el) el.classList.add('adv-hint');
    }
    if (S.wrongs >= 3 && S.type !== 'build') {
      var c = document.querySelector('.adv-card[data-opt="' + esc(q && q.a) + '"]');
      if (c) c.classList.add('adv-hint');
    }
  }
  function onMatchRight(run, word, finished, done) {
    var tile = document.querySelector('.adv-card[data-match="' + esc(word) + '"]');
    monster(finished ? 'cheer' : 'hop');
    var robot = $('adv-robot');
    var art = tile && tile.querySelector('.adv-card-art');
    flyTo(art, robot, art ? art.innerHTML : '', 480, function () {
      var b = document.querySelector('.adv-robot-built');
      var total = run.total, did = Object.keys(run.matchDonePairs).length;
      if (b) b.style.clipPath = 'inset(' + Math.max(0, 100 - Math.round((did / total) * 100)) + '% 0 0 0)';
      burstAt(robot, ['🔩', '✨'], 6);
    });
    if (finished) {
      var w = when(1500, 4500), cfg = zcfg(run);
      setTimeout(function () { restart(robot, 'adv-dance'); }, 500);
      bolt('happy', cfg.matchDone || LINES.robot, true, w.voiceEnded);
      w.then(done);
    } else {
      bolt('happy', pick(zcfg(run).right || LINES.right), true);
      setTimeout(done, 620);
    }
  }
  function placed() { if (S) S.justPlaced = true; monster('hop'); }
  function onBuildDone(run, q, done) {
    var train = $('adv-train'), w = when(1800, 6500), cfg = zcfg(run);
    monster('cheer');
    bolt('happy', pick(cfg.train || LINES.train), null);
    setTimeout(function () {
      if (train) train.classList.add('adv-train-go');
      if (root.IslandAudio.playHop) root.IslandAudio.playHop();
    }, 500);
    root.IslandAudio.speak(q.speak, w.voiceEnded);
    w.then(done);
  }
  function onSayDone(run, done, grateful) {
    var w = when(1400, 5000), cfg = zcfg(run);
    monster('cheer');
    var last = run.qIndex + 1 >= run.total;
    if (last) setGoal('<div class="adv-machine" id="adv-machine">' + img(cfg.on, 'adv-machine-pic adv-dance') + '</div>', 'adv-goal-machine');
    restart($('adv-scene'), 'adv-pop');
    burstAt($('adv-goal'), ['✨', '⭐', '💨'], 10);
    var line = last ? (cfg.wake || LINES.machineOn) : (grateful || pick(cfg.sayGood || LINES.sayGood));
    bolt('happy', line, true, w.voiceEnded);
    w.then(done);
  }

  /* ---------- the microphone: Chrome checks the words, and a miss never blocks a pupil ---------- */
  var rec = null;
  function norm(s) { return String(s).toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function stopMic() { if (rec) { try { rec.onresult = rec.onend = rec.onerror = null; rec.abort(); } catch (e) { /* already stopped */ } rec = null; } var m = $('adv-mic'); if (m) m.classList.remove('live'); }
  function lightHeard(transcripts) {
    var heard = {};
    transcripts.forEach(function (t) { norm(t).split(' ').forEach(function (w) { heard[w] = true; }); });
    var spans = document.querySelectorAll('#adv-karaoke .adv-kw'), got = 0;
    [].forEach.call(spans, function (s) { var on = !!heard[norm(s.textContent)]; if (on) got++; s.classList.toggle('heard', on); });
    return spans.length ? got / spans.length : 0;
  }
  function micResult(score, heardAny) {
    if (!S || !S.q) return;
    if (score >= 0.6) { root.IslandApp.sayPassed(); return; }
    if (!heardAny) { monster('wiggle'); bolt('worried', LINES.sayQuiet, true); return; }
    S.tries++;
    if (S.tries >= 2) { root.IslandApp.sayPassed(LINES.sayMove); return; }
    monster('wiggle');
    var q = S.q;
    bolt('worried', LINES.sayAlmost, true, function () { if (active() && S.q === q) root.IslandAudio.speak(q.speak || q.text); });
  }
  function fallbackToHand() {
    if (!S) return;
    S.noMic = true;
    stopMic();
    renderSay(S.run, S.q);
    bolt('idea', LINES.sayByHand, true);
  }
  function mic() {
    var SR = root.SpeechRecognition || root.webkitSpeechRecognition;
    if (!SR) { fallbackToHand(); return; }
    if (rec) { stopMic(); return; }
    root.IslandAudio.stopSpeech && root.IslandAudio.stopSpeech();
    var heard = [], best = 0;
    try {
      rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 4;
    } catch (e) { fallbackToHand(); return; }
    var m = $('adv-mic'); if (m) { m.classList.add('live'); m.classList.remove('nudge'); }
    bolt('talk', LINES.hearing, null);
    rec.onresult = function (ev) {
      for (var i = 0; i < ev.results.length; i++) for (var k = 0; k < ev.results[i].length; k++) heard.push(ev.results[i][k].transcript);
      best = Math.max(best, lightHeard(heard));
    };
    rec.onerror = function (ev) {
      var code = ev && ev.error;
      if (code === 'not-allowed' || code === 'service-not-allowed' || code === 'network' || code === 'audio-capture' || code === 'language-not-supported') { rec.onend = null; rec = null; fallbackToHand(); }
    };
    rec.onend = function () { rec = null; var mm = $('adv-mic'); if (mm) mm.classList.remove('live'); micResult(best, heard.length > 0); };
    try { rec.start(); } catch (e) { rec = null; fallbackToHand(); }
  }

  function close() { stopMic(); S = null; document.documentElement.classList.remove('adv-on'); }

  root.IslandAdventure = {
    ready: ready,
    handles: handles,
    active: active,
    render: render,
    onRight: onRight,
    onWrong: onWrong,
    onMatchRight: onMatchRight,
    placed: placed,
    onBuildDone: onBuildDone,
    onSayDone: onSayDone,
    hearText: function (q, type) { return hearText(q, type); },
    firstWord: function () { bolt('idea', LINES.firstWord, true); },
    mic: mic,
    saidByHand: function () { root.IslandApp.sayPassed(); },
    tapBolt: function () { if (S && S.q) root.IslandAudio.speak(hearText(S.q, S.type)); },
    close: close,
    sceneOf: sceneFor,
    hasPic: function (w) { var k = String(w || '').toLowerCase().trim(); return !!(WORD_PIC[k] && have[WORD_PIC[k]]) || !!WORD_EMOJI[k]; },
    LINES: LINES
  };
})(typeof window !== 'undefined' ? window : this);
