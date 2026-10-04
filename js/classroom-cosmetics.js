/* Classroom Store extras: the catalog and the sounds.
   Four kinds of things a pupil can buy and wear besides monster items:
     sound  = a victory sound that plays when the pupil's name is picked or they win on the Class Board
     title  = a name title shown next to the name ("Word Wizard")
     pack   = a reaction animal (the sticker that pops up for the pupil in games)
     plate  = a name-plate style for the pupil's card on the Class Board
   Everything here is plain data and synthesized sound: no pictures, no internet. */
(function (root) {
  'use strict';

  var KINDS = {
    sound: { label: 'Victory sounds', icon: '🔊', one: 'sound' },
    title: { label: 'Name titles', icon: '🏷️', one: 'title' },
    pack:  { label: 'Reaction animals', icon: '🦊', one: 'animal' },
    plate: { label: 'Name plates', icon: '🖼️', one: 'name plate' }
  };

  function c(kind, id, name, icon, rarity, desc, extra) {
    var o = { kind: kind, id: id, name: name, icon: icon, rarity: rarity, desc: desc };
    if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }

  var CATALOG = [
    // ---- victory sounds ----
    c('sound', 'snd-horn',    'Party Horn',      '📯', 'common',    'A happy party horn'),
    c('sound', 'snd-tada',    'Ta-da!',          '🎉', 'common',    'A bright "ta-da" fanfare'),
    c('sound', 'snd-sparkle', 'Magic Sparkle',   '✨', 'rare',      'A shimmering magic run'),
    c('sound', 'snd-drum',    'Drum Roll Hit',   '🥁', 'rare',      'A drum roll and a big hit'),
    c('sound', 'snd-cheer',   'Crowd Cheer',     '📣', 'rare',      'A crowd going wild'),
    c('sound', 'snd-trumpet', 'Royal Trumpet',   '🎺', 'epic',      'A royal trumpet call'),
    c('sound', 'snd-space',   'Space Zoom',      '🚀', 'epic',      'A whoosh through the stars'),
    c('sound', 'snd-legend',  'Legend Fanfare',  '🏆', 'legendary', 'The biggest victory fanfare'),
    // ---- name titles ----
    c('title', 'ttl-explorer', 'Word Explorer',      '🧭', 'common',    'Finds new words every day'),
    c('title', 'ttl-listener', 'Super Listener',     '👂', 'common',    'Listens carefully'),
    c('title', 'ttl-brave',    'Brave Speaker',      '🦁', 'common',    'Speaks up in English'),
    c('title', 'ttl-wizard',   'Word Wizard',        '🧙', 'rare',      'A master of vocabulary'),
    c('title', 'ttl-grammar',  'Grammar Hero',       '🦸', 'rare',      'Saves every sentence'),
    c('title', 'ttl-spelling', 'Spelling Star',      '⭐', 'rare',      'Never misses a letter'),
    c('title', 'ttl-reading',  'Reading Rocket',     '🚀', 'rare',      'Reads fast and well'),
    c('title', 'ttl-unit',     'Unit Champion',      '🏅', 'epic',      'Finished the unit like a champion'),
    c('title', 'ttl-speaking', 'Speaking Superstar', '🎤', 'epic',      'Always ready to talk'),
    c('title', 'ttl-legend',   'Class Legend',       '👑', 'epic',      'Everyone knows this name'),
    c('title', 'ttl-master',   'English Master',     '🏆', 'legendary', 'The top title in class'),
    // ---- reaction animals ----
    c('pack', 'pack-fox',     'Fox',     '🦊', 'rare', 'Your reactions come from Fox',     { animal: 'fox' }),
    c('pack', 'pack-frog',    'Frog',    '🐸', 'rare', 'Your reactions come from Frog',    { animal: 'frog' }),
    c('pack', 'pack-panda',   'Panda',   '🐼', 'rare', 'Your reactions come from Panda',   { animal: 'panda' }),
    c('pack', 'pack-lion',    'Lion',    '🦁', 'rare', 'Your reactions come from Lion',    { animal: 'lion' }),
    c('pack', 'pack-octopus', 'Octopus', '🐙', 'rare', 'Your reactions come from Octopus', { animal: 'octopus' }),
    c('pack', 'pack-unicorn', 'Unicorn', '🦄', 'rare', 'Your reactions come from Unicorn', { animal: 'unicorn' }),
    // ---- name plates (css for the card on the Class Board) ----
    c('plate', 'plt-candy',   'Candy Pop',     '🍬', 'rare',      'Pink and mint stripes',        { css: 'background:linear-gradient(135deg,#fbcfe8,#bbf7d0);border:4px solid #db2777;color:#831843;' }),
    c('plate', 'plt-ice',     'Ice Cave',      '🧊', 'rare',      'Cool blue crystal',            { css: 'background:linear-gradient(135deg,#e0f2fe,#a5f3fc);border:4px solid #0284c7;color:#0c4a6e;' }),
    c('plate', 'plt-jungle',  'Jungle',        '🌴', 'rare',      'Leafy green',                  { css: 'background:linear-gradient(135deg,#bbf7d0,#4ade80);border:4px solid #15803d;color:#14532d;' }),
    c('plate', 'plt-gold',    'Golden Card',   '🥇', 'epic',      'Shiny gold',                   { css: 'background:linear-gradient(135deg,#fef08a,#f59e0b);border:4px solid #92400e;color:#451a03;' }),
    c('plate', 'plt-fire',    'Fire Blaze',    '🔥', 'epic',      'Hot orange flames',            { css: 'background:linear-gradient(135deg,#fed7aa,#f87171);border:4px solid #b91c1c;color:#7f1d1d;' }),
    c('plate', 'plt-space',   'Space Night',   '🌌', 'epic',      'Deep space and stars',         { css: 'background:linear-gradient(135deg,#312e81,#6d28d9);border:4px solid #a78bfa;color:#ede9fe;' }),
    c('plate', 'plt-rainbow', 'Rainbow',       '🌈', 'epic',      'Every colour at once',         { css: 'background:linear-gradient(135deg,#fecaca,#fde68a,#bbf7d0,#bae6fd,#ddd6fe);border:4px solid #7c3aed;color:#3b0764;' }),
    c('plate', 'plt-galaxy',  'Galaxy Legend', '🪐', 'legendary', 'A glowing galaxy',             { css: 'background:radial-gradient(circle at 30% 20%,#7c3aed,#1e1b4b 70%);border:4px solid #fbbf24;color:#fef9c3;box-shadow:0 0 18px #a78bfa;' })
  ];
  var BY_ID = {};
  CATALOG.forEach(function (x) { BY_ID[x.id] = x; });

  /* ---------------- victory sounds (synthesized, pitched, soft starts) ---------------- */
  var actx = null, master = null;
  function ensure() {
    if (!actx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return false;
      actx = new AC();
      master = actx.createGain(); master.gain.value = 0.9;
      var comp = actx.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 20; comp.ratio.value = 8; comp.attack.value = 0.002; comp.release.value = 0.15;
      master.connect(comp); comp.connect(actx.destination);
    }
    if (actx.state === 'suspended' && actx.resume) actx.resume();
    return true;
  }
  function tone(t, f0, f1, dur, type, peak, attack) {
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + (attack || 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function bell(t, f, peak, decay) { tone(t, f, f, decay, 'sine', peak, 0.006); tone(t, f * 2.76, f * 2.76, decay * 0.45, 'sine', peak * 0.28, 0.004); }
  function brass(t, f, dur, peak) { tone(t, f, f, dur, 'triangle', peak, 0.03); tone(t, f * 2, f * 2, dur, 'sine', peak * 0.35, 0.03); tone(t, f * 0.5, f * 0.5, dur, 'sine', peak * 0.3, 0.03); }
  function wood(t, f, peak) { tone(t, f * 1.5, f, 0.05, 'triangle', peak, 0.002); }
  var N = { C4: 261.63, G4: 392, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G6: 1568 };
  var SOUNDS = {
    'snd-horn': function (t) { brass(t, N.G4, 0.22, 0.28); brass(t + 0.26, N.G4, 0.12, 0.26); brass(t + 0.4, N.C5, 0.5, 0.3); },
    'snd-tada': function (t) { bell(t, N.C5, 0.3, 0.3); bell(t + 0.12, N.E5, 0.3, 0.3); [N.G5, N.C6, N.E6].forEach(function (f, i) { bell(t + 0.3 + i * 0.01, f, 0.24, 0.8); }); },
    'snd-sparkle': function (t) { [N.C5, N.E5, N.G5, N.C6, N.E6, N.G6, N.E6, N.C6].forEach(function (f, i) { bell(t + i * 0.06, f, 0.2, 0.4); }); },
    'snd-drum': function (t) { for (var i = 0; i < 9; i++) tone(t + i * 0.07, 150, 100, 0.09, 'triangle', 0.1 + i * 0.03, 0.004); tone(t + 0.7, 130, 55, 0.35, 'sine', 0.55, 0.004); wood(t + 0.7, 200, 0.4); [N.C5, N.G5, N.C6].forEach(function (f) { bell(t + 0.72, f, 0.16, 0.7); }); },
    'snd-cheer': function (t) { for (var i = 0; i < 10; i++) tone(t + i * 0.07, 380 + (i % 4) * 90, 470 + (i % 3) * 110, 0.28, 'triangle', 0.07, 0.04); [N.C5, N.E5, N.G5, N.C6].forEach(function (f, i) { bell(t + 0.1 + i * 0.08, f, 0.18, 0.5); }); },
    'snd-trumpet': function (t) { brass(t, N.C5, 0.16, 0.3); brass(t + 0.18, N.C5, 0.16, 0.3); brass(t + 0.36, N.E5, 0.16, 0.3); brass(t + 0.54, N.G5, 0.7, 0.34); },
    'snd-space': function (t) { tone(t, 180, 1400, 0.7, 'sine', 0.26, 0.05); tone(t + 0.02, 270, 2100, 0.7, 'sine', 0.08, 0.05); [N.G5, N.C6, N.E6].forEach(function (f, i) { bell(t + 0.62 + i * 0.07, f, 0.2, 0.7); }); },
    'snd-legend': function (t) { [[N.C5, 0], [N.E5, 0.14], [N.G5, 0.28], [N.C6, 0.42]].forEach(function (p) { brass(t + p[1], p[0], 0.3, 0.26); bell(t + p[1], p[0] * 2, 0.14, 0.5); }); [N.C5, N.E5, N.G5, N.C6, N.E6].forEach(function (f) { brass(t + 0.64, f, 1.1, 0.14); bell(t + 0.64, f, 0.12, 1.2); }); }
  };

  root.ClassroomCosmetics = {
    KINDS: KINDS,
    CATALOG: CATALOG,
    byId: function (id) { return BY_ID[id] || null; },
    ofKind: function (kind) { return CATALOG.filter(function (x) { return x.kind === kind; }); },
    /** Play a victory sound by id (needs a user gesture first, like all web audio). Returns true if it played. */
    playSound: function (id) {
      if (!SOUNDS[id] || !ensure()) return false;
      SOUNDS[id](actx.currentTime + 0.02);
      return true;
    },
    soundIds: function () { return Object.keys(SOUNDS); },
    /** Render a sound recipe into an offline context (used for testing). */
    _renderOffline: function (id, offlineCtx) {
      var sa = actx, sm = master;
      actx = offlineCtx; master = offlineCtx.createGain(); master.gain.value = 0.9; master.connect(offlineCtx.destination);
      try { SOUNDS[id](0); } finally { actx = sa; master = sm; }
    }
  };
})(typeof window !== 'undefined' ? window : this);
