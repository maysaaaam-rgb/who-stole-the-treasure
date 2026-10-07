/* Karaoke Stage: sentence packs. Every pack is built from lessons we already teach, so the words stay the same everywhere.
   A card = one turn for one reader: 1 to 3 short lines, plus a picture. */
window.KaraokeData = (function () {
  var R = window.RevData || {}, C = window.CookData || {}, P = window.PARTY || {};
  var REV_ART = '../unit12-revision-g4/art/', COOK_ART = '../unit2-g3-cooking/art/', ALICE_ART = '../alice-party-home/assets/';
  var packs = [];

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
