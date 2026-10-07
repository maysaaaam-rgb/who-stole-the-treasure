/* Karaoke Stage: sentence packs. Every pack is built from lessons we already teach, so the words stay the same everywhere.
   A card = one turn for one reader: 1 to 3 short lines, plus a picture. */
window.KaraokeData = (function () {
  var R = window.RevData || {}, C = window.CookData || {}, P = window.PARTY || {}, G3 = window.G3LessonsData || {}, G4 = window.ForestLessonsData || {};
  var REV_ART = '../unit12-revision-g4/art/', COOK_ART = '../unit2-g3-cooking/art/', ALICE_ART = '../alice-party-home/assets/';
  var G3_ART = '../unit2-g3-lessons/art/', G4_ART = '../unit2-forest-lessons/art/';
  var packs = [];

  /* Unit 2 readings: the stories of the Unit 2 lessons, one part per reader, in story order */
  function story(list, pics, dir) { return list.map(function (t, i) { return { lines: splitQ(t), img: pics[i] ? dir + pics[i] + '.webp' : null }; }); }
  if (G4.beats) packs.push({ id: 'g4read2', grade: 4, e: '🐦', title: 'Unit 2 Reading: The Swallow’s Gift', note: 'The story in order. Each reader reads the next part.',
    cards: story(G4.beats.map(function (b) { return b.pre + ' ' + b.gap + ' ' + b.post; }).concat(['Wen Shu felt sorry. He left a gift on the roof.', 'Wen Shu said sorry. Now they are friends.']),
      ['nest_eggs', 'baby_swallow', 'seed_gold', 'fruit_gold', 'slingshot_stone', 'coins', 'gift_box', 'wen_shu_sorry'], G4_ART) });
  if (G4.year) packs.push({ id: 'g4read1', grade: 4, e: '🌲', title: 'Unit 2 Reading: A Year in the Forest', note: 'Seasons, trees and animals in winter. In order.',
    cards: story(G4.year.map(function (y) { return y.say; }),
      ['tree_oak_spring', 'bear_awake', 'tree_oak_autumn', 'tree_oak_winter', 'thermometer_cold', 'bear_sleeping', 'hare_white', 'tree_pine_snow', 'squirrel'], G4_ART) });
  if (G3.farm) packs.push({ id: 'g3read2', grade: 3, e: '🚀', title: 'Unit 2 Reading: First Harvest', note: 'The farm story in order. Where is the farm?',
    cards: story(G3.farm.map(function (f) { return f.say; }),
      ['dome_greenhouse', 'apple_tree', 'dad_worried', 'pink_potatoes', 'striped_tomatoes', 'apple_pie', 'mom_spacesuit', 'planet_mars'], G3_ART) });
  if (G3.legend) packs.push({ id: 'g3read1', grade: 3, e: '🌕', title: 'Unit 2 Reading: Chuseok', note: 'The moon legend and Chuseok today. In order.',
    cards: story(G3.legend.map(function (l) { return l.say; }),
      ['king', 'loom_weaving', 'cloth_roll', 'moon_full', 'feast_table', 'thank_you_kid', 'family_travel', 'bow_ancestors'], G3_ART) });
  packs.sort(function (a, b) { return a.id < b.id ? -1 : 1; });   // Reading 1 before Reading 2

  /* Week Song: the lyrics the teacher pasted in the Week Song page (kept only in this browser, never in the project) */
  try {
    var ws = JSON.parse(localStorage.getItem('eaa_weeksong_v1') || 'null');
    if (ws && ws.lyrics) {
      var secs = [], cur = null;
      String(ws.lyrics).split(/\r?\n/).forEach(function (l) {
        l = l.trim(); if (!l) return; var m = /^\[(.+?)\]$/.exec(l);
        if (m) { cur = { name: m[1], lines: [] }; secs.push(cur); return; }
        if (!cur) { cur = { name: 'Song', lines: [] }; secs.push(cur); } cur.lines.push(l);
      });
      var picks = Array.isArray(ws.picks) ? ws.picks : secs.map(function (s, i) { return /chorus/i.test(s.name) ? i : -1; }).filter(function (i) { return i >= 0; });
      if (!picks.length && secs.length) picks = [0];
      var seen = {}, ls = [];
      picks.forEach(function (i) { (secs[i] ? secs[i].lines : []).forEach(function (t) { var k = t.toLowerCase(); if (!seen[k]) { seen[k] = 1; ls.push(t); } }); });
      var cards = []; for (var q = 0; q < ls.length; q += 2) cards.push({ lines: ls.slice(q, q + 2), e: '🎵' });
      if (cards.length) packs.unshift({ id: 'weeksong', grade: 4, e: '🎵', title: 'Week Song: ' + String(ws.title || 'our song').slice(0, 40), note: 'The lines we teach this week. Two lines each.', cards: cards });
    }
  } catch (e) { /* no week song on this computer */ }

  /* Grade 4: Alice Tea Party role lines (each pupil reads their own role when the name matches) */
  if (P.roles) {
    packs.push({
      id: 'alice', grade: 4, e: '🫖', title: 'Alice Tea Party: my role', note: 'Each pupil reads the 3 lines of their own role.',
      cards: Object.keys(P.roles).map(function (k) {
        var r = P.roles[k], photo = null;
        Object.keys(P.classes || {}).some(function (c) { return (P.classes[c].students || []).some(function (s) { if (s.role === k && s.photo) { photo = s.photo; return true; } return false; }); });
        return { key: k, title: r.name, lines: r.sentences.slice(0, 3), img: photo ? ALICE_ART + photo : null, e: r.words && r.words[0] ? r.words[0][1] : '🫖' };
      }),
      // the pupil's own role and costume photo, found by first name
      roleOf: function (name) {
        var n = norm(name), f = n.split(' ')[0], all = [];
        Object.keys(P.classes || {}).forEach(function (c) { all = all.concat(P.classes[c].students || []); });
        var same = all.filter(function (s) { return norm(s.name) === n; }), byFirst = all.filter(function (s) { return norm(s.name).split(' ')[0] === f; });
        var s = same[0] || (byFirst.length === 1 ? byFirst[0] : null);   // two pupils called Emir: only an exact name decides
        return s ? { role: s.role, img: s.photo ? ALICE_ART + s.photo : null } : null;
      }
    });
  }

  /* Grade 4: Revision Quest sentences */
  if (R.sent1) packs.push({ id: 'g4u1', grade: 4, e: '🐇', title: 'Unit 1 sentences', note: 'Alice, butterflies, the brain.',
    cards: R.sent1.map(function (x) { return { lines: splitQ(x.s), e: (x.pics || []).join(' ') }; }) });
  if (R.sent2) packs.push({ id: 'g4u2', grade: 4, e: '🌲', title: 'Unit 2 sentences', note: 'Forests, animals in winter, the swallow.',
    cards: R.sent2.map(function (x) { return { lines: [x.s], img: x.art && x.art.length ? REV_ART + x.art[x.art.length - 1] + '.webp' : null }; }) });
  if (R.boss) packs.push({ id: 'g4boss', grade: 4, e: '🧠', title: 'Memory challenge', note: 'Start with the words hidden. Read the cue, say it all.',
    hideStart: true, cards: R.boss.map(function (x) { return { lines: splitQ(x.ans), e: x.e || '', img: x.art ? REV_ART + x.art + '.webp' : null }; }) });

  /* Grade 3: Chuseok cooking */
  if (C.songpyeonSteps) packs.push({ id: 'g3steps', grade: 3, e: '🍡', title: 'Make songpyeon', note: 'One cooking step each.',
    cards: C.songpyeonSteps.map(function (x) { return { lines: [x.s], img: COOK_ART + 'songpyeon.webp', e: verbE(x.v) }; }) });
  if (C.recipes) packs.push({ id: 'g3recipes', grade: 3, e: '🍹', title: 'Read a recipe', note: 'First, Then, Finally. A whole recipe for strong readers.',
    cards: C.recipes.map(function (x) { return { title: x.n, lines: x.say.slice(0, 3).concat(x.say.length > 3 ? [x.say[x.say.length - 1]] : []).slice(0, 4), e: x.e }; }) });
  if (C.mystery) packs.push({ id: 'g3treats', grade: 3, e: '🍪', title: 'Treat clues', note: 'Read the clue. The class guesses the treat.',
    cards: C.mystery.map(function (x) { return { lines: x.clue.split(/(?<=\.)\s+/).slice(0, 3), e: '❓', answer: x.e + ' ' + x.n }; }) });

  function verbE(v) { var f = (C.verbs || []).filter(function (x) { return x.v === v; })[0]; return f ? f.e : ''; }
  function splitQ(s) { var parts = String(s).split(/(?<=[.?!])\s+/); return parts.length > 1 && parts.length <= 3 ? parts : [s]; }
  function norm(t) { return String(t || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim(); }

  return { packs: packs, norm: norm };
})();
