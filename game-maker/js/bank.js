/* Game Maker question bank adapter (bank.js).
   Turns the existing Grade 3 & Grade 4 Units 1, 2 and 3 question banks (BQ, ARC, U3DATA)
   into clean Game Maker question sets (by Unit and by Skill: Listening, Words, Sounds, Sentences, Reading),
   plus sentence-order and vocabulary helpers for Alley Fling and U().ask. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  var UNIT_META = {
    '3': {
      '1': { title: 'Unit 1 · Grade 3 (What Does It Do?)', e: '🛠️' },
      '2': { title: 'Unit 2 · Grade 3 (Thank You)', e: '🌾' },
      '3': { title: 'Unit 3 · Grade 3 (How Much Is It?)', e: '🪙' }
    },
    '4': {
      '1': { title: 'Unit 1 · Grade 4 (I Love Reading)', e: '📖' },
      '2': { title: 'Unit 2 · Grade 4 (What Lives Here?)', e: '🌲' },
      '3': { title: 'Unit 3 · Grade 4 (It Keeps Changing)', e: '🐻‍❄️' }
    }
  };
  var SKILL_EMOJI = {
    Listening: '🎧',
    Words: '📝',
    Sounds: '🔤',
    Sentences: '💬',
    Reading: '📖'
  };

  var stats = { converted: 0, orderConverted: 0, skipped: 0 };
  var allBuiltSets = [];
  var added = false;

  function scrambleDistractors(words) {
    var right = words.join(' '), out = [], tries = 0;
    while (out.length < 2 && tries++ < 20) {
      var copy = words.slice();
      if (copy.length >= 2) {
        var i = tries % (copy.length - 1);
        var tmp = copy[i]; copy[i] = copy[i + 1]; copy[i + 1] = tmp;
      }
      var s = copy.join(' ');
      if (s !== right && out.indexOf(s) < 0) out.push(s);
    }
    if (!out.length) out.push(words.slice().reverse().join(' '));
    return out;
  }

  function convertItem(raw, grade, unit) {
    if (!raw || typeof raw !== 'object') { stats.skipped++; return null; }
    var skill = String(raw.s || 'Words').trim();

    /* Sentence-order items (e.g., Put the words in order) */
    if (Array.isArray(raw.order) && raw.order.length >= 3) {
      var words = raw.order.map(function (w) { return String(w || '').trim(); }).filter(Boolean);
      if (words.length < 3) { stats.skipped++; return null; }
      var ans = words.join(' ');
      stats.converted++;
      stats.orderConverted++;
      return {
        q: 'Put the words in order: ' + words.slice().sort(function (a, b) { return a.localeCompare(b); }).join(' / '),
        a: ans,
        w: scrambleDistractors(words),
        pic: raw.pic || '🧩',
        skill: skill,
        grade: Number(grade),
        unit: Number(unit),
        order: words,
        speak: ans
      };
    }

    /* Standard multiple-choice items */
    var q = String(raw.q || '').trim();
    var a = raw.a != null ? String(raw.a).trim() : '';
    var opts = Array.isArray(raw.o) ? raw.o.map(function (x) { return String(x == null ? '' : x).trim(); }).filter(Boolean) : [];
    if (!q || !a || opts.length < 2) {
      stats.skipped++;
      return null;
    }
    var wrongs = opts.filter(function (x) { return x !== a; });
    if (!wrongs.length) {
      stats.skipped++;
      return null;
    }
    /* Pad 2-option grammar questions with a sensible 3rd distractor if needed */
    while (wrongs.length < 2) {
      var extra = a === 'has got' ? 'having' : a === 'have got' ? 'having' : a === 'do' ? 'doing' : a === 'does' ? 'doing' : a === 'clean' ? 'cleaning' : a === 'cleans' ? 'cleaning' : 'not ' + a;
      if (wrongs.indexOf(extra) < 0 && extra !== a) wrongs.push(extra);
      else break;
    }

    var pic = String(raw.pic || '').trim();
    if (!pic && raw.big && /^[^\w\s]{1,4}$/u.test(a)) {
      pic = '🔊';
    }
    var item = {
      q: q,
      a: a,
      w: wrongs.slice(0, 3),
      pic: pic,
      skill: skill,
      grade: Number(grade),
      unit: Number(unit)
    };
    if (raw.say) {
      item.speak = String(raw.say).trim();
      if (/^Listen\./i.test(item.q)) {
        item.q = item.q + '  🔊 “' + item.speak + '”';
      }
    }
    if (raw.pass) {
      item.pass = String(raw.pass).trim();
    }
    stats.converted++;
    return item;
  }

  var SKILL_KEY = {
    Listening: 'listen',
    Words: 'words',
    Sounds: 'sounds',
    Sentences: 'sentences',
    Reading: 'reading'
  };

  function buildAllSets() {
    if (allBuiltSets.length) return allBuiltSets;
    stats = { converted: 0, orderConverted: 0, skipped: 0 };
    var bq = (typeof BQ !== 'undefined' ? BQ : null) || root.BQ || {};
    var u3 = (root.U3DATA && root.U3DATA.BQ) || {};

    ['3', '4'].forEach(function (g) {
      var gBank = Object.assign({}, bq[g] || {});
      if (u3[g] && !gBank['3']) gBank['3'] = u3[g];

      ['1', '2', '3'].forEach(function (u) {
        var rawList = gBank[u];
        if (!Array.isArray(rawList) || !rawList.length) return;
        var items = [];
        var bySkill = {};
        rawList.forEach(function (raw) {
          var it = convertItem(raw, g, u);
          if (!it) return;
          items.push(it);
          var sk = it.skill || 'Words';
          (bySkill[sk] = bySkill[sk] || []).push(it);
        });
        /* Also add sentence-builder items from ARC / U3DATA.ARC into Sentences if available */
        var arcData = arcFor(g, u);
        if (arcData && Array.isArray(arcData.builders)) {
          arcData.builders.slice(0, 5).forEach(function (b) {
            if (!b || !Array.isArray(b.order) || b.order.length < 3) return;
            var words = b.order.slice();
            var ans = b.answer || words.join(' ');
            var it = {
              q: 'Put the words in order: ' + words.slice().sort().join(' / '),
              a: ans,
              w: scrambleDistractors(words),
              pic: '🧩',
              skill: 'Sentences',
              grade: Number(g),
              unit: Number(u),
              order: words,
              speak: ans
            };
            items.push(it);
            (bySkill.Sentences = bySkill.Sentences || []).push(it);
            stats.converted++;
            stats.orderConverted++;
          });
        }

        if (!items.length) return;
        var meta = (UNIT_META[g] && UNIT_META[g][u]) || { title: 'Unit ' + u + ' · Grade ' + g, e: '📚' };
        allBuiltSets.push({
          id: 'u' + u + '-g' + g,
          title: meta.title,
          e: meta.e,
          grade: Number(g),
          unit: Number(u),
          skill: '',
          items: items
        });

        ['Listening', 'Words', 'Sounds', 'Sentences', 'Reading'].forEach(function (sk) {
          if (bySkill[sk] && bySkill[sk].length >= 2) {
            var skSlug = SKILL_KEY[sk] || sk.toLowerCase();
            allBuiltSets.push({
              id: 'u' + u + '-g' + g + '-' + skSlug,
              title: 'G' + g + ' U' + u + ' · ' + sk,
              e: SKILL_EMOJI[sk] || '📚',
              grade: Number(g),
              unit: Number(u),
              skill: skSlug,
              skillOnly: true,
              items: bySkill[sk]
            });
          }
        });
      });
    });
    return allBuiltSets;
  }

  function arcFor(grade, unit) {
    var g = String(grade || 3), u = String(unit || 2);
    var globalArc = (typeof ARC !== 'undefined' ? ARC : null) || root.ARC;
    if (u === '3' && root.U3DATA && root.U3DATA.ARC && root.U3DATA.ARC[g]) return root.U3DATA.ARC[g];
    if (globalArc && globalArc[g]) return globalArc[g];
    if (root.U3DATA && root.U3DATA.ARC && root.U3DATA.ARC[g]) return root.U3DATA.ARC[g];
    return { words: [], concrete: [], builders: [] };
  }

  function add() {
    if (added) return GM.sets;
    added = true;
    GM.sets = GM.sets || [];
    var existing = {};
    GM.sets.forEach(function (s) { existing[s.id] = s; });
    buildAllSets().forEach(function (s) {
      if (!existing[s.id]) {
        GM.sets.push(s);
        existing[s.id] = s;
      }
      /* Enrich u14-g3 / u14-g4 with converted full-unit questions */
      if (!s.skillOnly && (s.grade === 3 || s.grade === 4)) {
        var mixSet = existing['u14-g' + s.grade];
        if (mixSet && Array.isArray(mixSet.items)) {
          var seenQ = {};
          mixSet.items.forEach(function (it) { seenQ[it.q] = true; });
          s.items.forEach(function (it) {
            if (!seenQ[it.q]) { mixSet.items.push(it); seenQ[it.q] = true; }
          });
        }
      }
    });
    return GM.sets;
  }

  GM.bank = {
    sets: function () { return buildAllSets(); },
    add: add,
    arc: arcFor,
    stats: function () { buildAllSets(); return Object.assign({}, stats); }
  };

  add();
})(typeof window !== 'undefined' ? window : this);
