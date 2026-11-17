/* English Adventure Academy · Games Collection · Question Packs & Quiz Card Engine
   - Directly imports all 75 existing Game Maker curriculum & speaking sets (`GM.sets`)
     from local scripts (Units 1–5 for Grade 3 & Grade 4 + speaking sets) with zero retyping.
   - Stores teacher's custom / edited Question Packs in IndexedDB `eaa-games` -> `qsets`.
   - Supports Excel/Sheets TSV paste, CSV template download/upload, 4-choice cards with
     speaker audio on EVERY choice button, and open "Speak Aloud -> Teacher taps ✓" cards. */
(function (root) {
  'use strict';

  var Kit = root.Kit = root.Kit || {};
  var doc = root.document;

  var QSTORE = 'qsets';
  var bankPromise = null;

  var BANK_SCRIPTS = [
    'bamboozle/data.js?v=1',
    'unit2-arcade/data.js?v=1',
    'unit3-data/data.js?v=1',
    'game-maker/js/data.js?v=8',
    'game-maker/js/sets-unit4.js?v=2',
    'game-maker/js/sets-unit5.js?v=3',
    'game-maker/js/sets-units14.js?v=2',
    'game-maker/js/sets-speaking.js?v=3',
    'game-maker/js/bank.js?v=2'
  ];

  // Fallback built-in starter pack if bank scripts haven't loaded yet or in preview mode
  var STARTER_PACK = {
    id: 'starter-quiz',
    name: 'Quick Classroom Quiz',
    sub: 'Everyday English · Grade 3 & 4',
    grade: 'All',
    unit: '',
    e: '🌟',
    builtIn: true,
    items: [
      { q: 'A ____ is a king of ancient Egypt.', a: 'pharaoh', w: ['farmer', 'pilot', 'doctor'], pic: '👑', grade: '3', unit: '5', skill: 'Words' },
      { q: 'Yesterday Jannah ____ the special book.', a: 'opened', w: ['opens', 'opening', 'open'], pic: '📘', grade: '3', unit: '5', skill: 'Reading' },
      { q: 'Sound artists use coconut shells to make horse ____!', a: 'footsteps', w: ['feathers', 'flowers', 'fingers'], pic: '🥥', grade: '4', unit: '5', skill: 'Reading' },
      { q: 'We all live on planet ____.', a: 'Earth', w: ['Mars', 'Moon', 'Sun'], pic: '🌍', grade: '3', unit: '5', skill: 'Words' },
      { q: 'When the director says “Quiet!”, everyone ____ be quiet.', a: 'has to', w: ['have to', 'having', 'had'], pic: '🎬', grade: '4', unit: '5', skill: 'Sentences' },
      { q: 'People make a ____ to save objects for the future.', a: 'time capsule', w: ['toy car', 'lunch box', 'paper boat'], pic: '📦', grade: '3', unit: '5', skill: 'Words' }
    ]
  };

  function loadLocalScript(relPath) {
    return new Promise(function (resolve) {
      var full = (root.KIT_ROOT || '../') + relPath;
      var existing = doc.querySelector('script[data-qbank="' + relPath + '"]');
      if (existing) { resolve(true); return; }
      var s = doc.createElement('script');
      s.src = full;
      s.setAttribute('data-qbank', relPath);
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      doc.head.appendChild(s);
    });
  }

  function ensureLoaded() {
    if (bankPromise) return bankPromise;
    if (Kit.preview) return Promise.resolve([STARTER_PACK]);
    bankPromise = BANK_SCRIPTS.reduce(function (p, src) {
      return p.then(function () { return loadLocalScript(src); });
    }, Promise.resolve()).then(function () {
      if (root.GM && root.GM.bank && typeof root.GM.bank.add === 'function') {
        try { root.GM.bank.add(); } catch (e) {}
      }
      return builtIn();
    });
    return bankPromise;
  }

  function normalizeItem(raw, fallbackGrade, fallbackUnit) {
    if (!raw || !raw.q || raw.a == null) return null;
    var wrongs = Array.isArray(raw.w) ? raw.w.map(function (x) { return String(x == null ? '' : x).trim(); }).filter(Boolean) : [];
    var pic = String(raw.img || raw.pic || '').trim();
    var isImgPath = /\.(webp|png|jpe?g|gif|svg)$/i.test(pic) || /^data:image\//i.test(pic);
    return {
      q: String(raw.q || '').trim(),
      a: String(raw.a || '').trim(),
      w: wrongs.slice(0, 3),
      img: isImgPath ? pic : '',
      pic: isImgPath ? '' : pic,
      act: String(raw.act || '').trim(),
      words: Array.isArray(raw.words) ? raw.words.slice() : [],
      speak: raw.speak || (wrongs.length === 0 ? 1 : 0),
      grade: String(raw.grade || fallbackGrade || 'All'),
      unit: raw.unit != null ? String(raw.unit) : String(fallbackUnit || ''),
      skill: String(raw.skill || (wrongs.length === 0 ? 'Speaking' : 'Reading'))
    };
  }

  function emojiForSet(s) {
    if (s.e) return s.e;
    var t = String(s.title || s.name || '').toLowerCase();
    if (/speak/.test(t)) return '🎤';
    if (/egypt|time|u5.*g3|g3.*u5/.test(t)) return '🏺';
    if (/noise|sound|foley|beethoven|u5.*g4|g4.*u5/.test(t)) return '🎬';
    if (/mountain|volcano/.test(t)) return '🌋';
    if (/mona|museum/.test(t)) return '🖼️';
    if (/show|play/.test(t)) return '🎭';
    if (/halloween/.test(t)) return '🎃';
    if (/moon|chuseok/.test(t)) return '🌕';
    return s.grade == 4 ? '📘' : '📗';
  }

  function builtIn() {
    var gmSets = (root.GM && Array.isArray(root.GM.sets)) ? root.GM.sets : [];
    if (!gmSets.length) return [STARTER_PACK];

    var out = [];
    var seen = {};
    // Put Unit 5 & full-unit sets first so today's lessons sit right at the top!
    var sorted = gmSets.slice().sort(function (a, b) {
      var aU5 = /u5/.test(a.id) ? -10 : 0;
      var bU5 = /u5/.test(b.id) ? -10 : 0;
      var aSkillOnly = a.skillOnly ? 5 : 0;
      var bSkillOnly = b.skillOnly ? 5 : 0;
      return (aU5 + aSkillOnly) - (bU5 + bSkillOnly);
    });

    sorted.forEach(function (s) {
      if (!s || !s.id || seen[s.id] || !Array.isArray(s.items) || !s.items.length) return;
      seen[s.id] = 1;
      var grade = s.grade ? String(s.grade) : (/g4/i.test(s.id) ? '4' : (/g3/i.test(s.id) ? '3' : 'All'));
      var unitMatch = /u(\d)/i.exec(s.id);
      var unit = s.unit ? String(s.unit) : (unitMatch ? unitMatch[1] : '');
      var items = s.items.map(function (it) { return normalizeItem(it, grade, unit); }).filter(Boolean);
      if (!items.length) return;
      var hasSpeakingOnly = items.every(function (it) { return !it.w.length; });
      out.push({
        id: s.id,
        name: String(s.title || s.name || s.id),
        sub: (grade !== 'All' ? 'Grade ' + grade : 'All Grades') + (unit ? ' · Unit ' + unit : '') + (hasSpeakingOnly ? ' · Speaking' : ''),
        grade: grade,
        unit: unit,
        skillOnly: !!s.skillOnly,
        speaking: hasSpeakingOnly,
        e: emojiForSet(s),
        builtIn: true,
        items: items
      });
    });

    return out.length ? out : [STARTER_PACK];
  }

  function mine() {
    if (!Kit.dbTx) return Promise.resolve([]);
    return Kit.dbTx(QSTORE, 'readonly', function (s) { return s.getAll(); })
      .then(function (r) {
        return (r || []).sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
      })
      .catch(function () { return []; });
  }

  function all() {
    return ensureLoaded().then(function () {
      var b = builtIn();
      return mine().then(function (m) { return m.concat(b); });
    });
  }

  function get(id) {
    return all().then(function (list) {
      return list.filter(function (s) { return s.id === id; })[0] || list[0] || STARTER_PACK;
    });
  }

  function save(pack) {
    pack.updated = Date.now();
    delete pack.builtIn;
    return Kit.dbTx(QSTORE, 'readwrite', function (s) { s.put(pack); });
  }

  function remove(id) {
    return Kit.dbTx(QSTORE, 'readwrite', function (s) { s.delete(id); });
  }

  // =========================================================================
  // TSV (EXCEL PASTE) & CSV TEMPLATE IMPORT / EXPORT
  // =========================================================================
  function csvCell(v) {
    var s = String(v == null ? '' : v);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function toCsv(items, grade, unit) {
    var lines = ['question,answer,wrong1,wrong2,wrong3,picture,grade,unit'];
    (items || []).forEach(function (it) {
      var w = it.w || [];
      lines.push([
        csvCell(it.q),
        csvCell(it.a),
        csvCell(w[0] || ''),
        csvCell(w[1] || ''),
        csvCell(w[2] || ''),
        csvCell(it.img || it.pic || ''),
        csvCell(it.grade || grade || ''),
        csvCell(it.unit || unit || '')
      ].join(','));
    });
    return lines.join('\r\n');
  }

  function splitCsvLine(line, sep) {
    var out = [], cur = '', inQ = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line.charAt(i);
      if (inQ) {
        if (ch === '"' && line.charAt(i + 1) === '"') { cur += '"'; i++; }
        else if (ch === '"') inQ = false;
        else cur += ch;
      } else {
        if (ch === '"') inQ = true;
        else if (ch === sep) { out.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  }

  function parseTabular(text, defaultGrade, defaultUnit) {
    var lines = String(text || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    if (!lines.length) return [];
    var sep = lines[0].indexOf('\t') >= 0 ? '\t' : ',';
    var out = [];
    lines.forEach(function (line, idx) {
      var cols = splitCsvLine(line, sep);
      if (idx === 0 && /^question$/i.test(cols[0] || '')) return; // skip header row
      var q = cols[0] || '', a = cols[1] || '';
      if (!q || !a) return;
      var wrongs = [cols[2], cols[3], cols[4]].map(function (x) { return String(x || '').trim(); }).filter(Boolean);
      var item = normalizeItem({
        q: q,
        a: a,
        w: wrongs,
        pic: cols[5] || '',
        grade: cols[6] || defaultGrade || 'All',
        unit: cols[7] || defaultUnit || ''
      }, defaultGrade, defaultUnit);
      if (item) out.push(item);
    });
    return out;
  }

  function downloadCsvTemplate(pack) {
    var sample = (pack && pack.items && pack.items.length) ? pack.items : STARTER_PACK.items;
    var csv = toCsv(sample, pack && pack.grade, pack && pack.unit);
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    var a = doc.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = ((pack && pack.name ? pack.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'questions-template') || 'questions') + '.csv';
    doc.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  // =========================================================================
  // REUSABLE QUIZ / SPEAKING CARD RENDERER (AUDIO ON EVERY CHOICE + TIMER)
  // =========================================================================
  function renderAskCard(container, item, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var answered = false;
    var timerId = 0;
    var secLeft = Number(opts.timerSec) || 0;
    var isSpeaking = !item.w || item.w.length === 0 || item.speak === 1;

    var card = Kit.el('div', { class: 'kit-qcard' });

    // Top row: speaker pupil chip (if provided) + audio button + optional countdown
    var topBar = Kit.el('div', { class: 'kit-qtop' });
    if (opts.team) {
      var spk = Kit.classroom && Kit.classroom.currentSpeaker ? Kit.classroom.currentSpeaker(opts.team) : null;
      topBar.appendChild(Kit.el('div', { class: 'kit-qteam', style: { '--tc': opts.team.color } }, [
        Kit.el('span', { text: opts.team.emoji + ' ' + opts.team.name }),
        spk ? Kit.el('strong', { text: ' · 🎤 ' + spk.name }) : null
      ]));
    } else {
      topBar.appendChild(Kit.el('div', { class: 'kit-qteam', text: isSpeaking ? '🎤 Speaking Time' : '❓ Question' }));
    }

    var rightTools = Kit.el('div', { class: 'kit-qtools' });
    var timerPill = secLeft > 0 ? Kit.el('span', { class: 'kit-qtimer', text: '⏱ ' + secLeft + 's' }) : null;
    if (timerPill) rightTools.appendChild(timerPill);
    rightTools.appendChild(Kit.el('button', {
      type: 'button',
      class: 'icon-btn',
      title: 'Read question aloud (R)',
      text: '🔊',
      onclick: function () {
        var toRead = typeof item.speak === 'string' && item.speak ? item.speak : (isSpeaking ? item.a : item.q.replace(/_+/g, ' blank '));
        Kit.say(toRead);
      }
    }));
    topBar.appendChild(rightTools);
    card.appendChild(topBar);

    // Prompt + optional picture/emoji
    var promptRow = Kit.el('div', { class: 'kit-qprompt' });
    if (item.img) {
      promptRow.appendChild(Kit.el('img', { src: Kit.src(item.img), alt: '', class: 'kit-qimg' }));
    } else if (item.pic) {
      promptRow.appendChild(Kit.el('div', { class: 'kit-qemoji', text: item.pic }));
    }
    promptRow.appendChild(Kit.el('h3', { class: 'kit-qtext', text: item.q }));
    card.appendChild(promptRow);

    var popKeys = function () {};

    function finish(correct, chosenText) {
      if (answered) return;
      answered = true;
      clearInterval(timerId);
      popKeys();
      if (opts.onAnswer) opts.onAnswer(!!correct, chosenText);
    }

    if (isSpeaking) {
      var spkBox = Kit.el('div', { class: 'kit-speak-stage' }, [
        Kit.el('div', { class: 'kit-speak-target' }, [
          Kit.el('span', { text: item.a }),
          Kit.el('button', { type: 'button', class: 'icon-btn', title: 'Hear sentence', text: '🔈', onclick: function () { Kit.say(item.a); } })
        ]),
        item.act ? Kit.el('div', { class: 'kit-speak-act', text: item.act }) : null,
        (item.words && item.words.length)
          ? Kit.el('div', { class: 'kit-speak-words' }, item.words.map(function (w) {
              return Kit.el('button', { type: 'button', class: 'chip', text: '🔈 ' + w, onclick: function () { Kit.say(w); } });
            }))
          : null,
        Kit.el('div', { class: 'kit-speak-btns' }, [
          Kit.el('button', { type: 'button', class: 'btn mint lg', text: '🌟 Said it aloud! ✓', onclick: function () { Kit.sound('correct'); finish(true, item.a); } }),
          Kit.el('button', { type: 'button', class: 'btn soft', text: '⏭ Pass turn', onclick: function () { Kit.sound('soft'); finish(false, ''); } })
        ])
      ]);
      card.appendChild(spkBox);
      popKeys = Kit.overlayKeys({
        space: function () { Kit.sound('correct'); finish(true, item.a); },
        enter: function () { Kit.sound('correct'); finish(true, item.a); },
        r: function () { Kit.say(item.a); }
      });
    } else {
      var choices = Kit.shuffle([item.a].concat((item.w || []).slice(0, 3)));
      var letters = ['A', 'B', 'C', 'D'];
      var grid = Kit.el('div', { class: 'kit-qchoices' });
      var btnNodes = [];

      choices.forEach(function (choiceText, idx) {
        var btn = Kit.el('div', {
          class: 'kit-qchoice',
          role: 'button',
          tabindex: '0',
          onclick: function () { pickChoice(idx); }
        }, [
          Kit.el('span', { class: 'kit-qletter', text: letters[idx] }),
          Kit.el('span', { class: 'kit-qlabel', text: choiceText }),
          Kit.el('button', {
            type: 'button',
            class: 'icon-btn kit-qsay',
            title: 'Hear "' + choiceText + '"',
            text: '🔈',
            onclick: function (ev) { ev.stopPropagation(); Kit.say(choiceText); }
          })
        ]);
        btnNodes.push(btn);
        grid.appendChild(btn);
      });

      function pickChoice(idx) {
        if (answered || !btnNodes[idx]) return;
        var chosen = choices[idx];
        var ok = chosen === item.a;
        if (ok) {
          btnNodes[idx].classList.add('right');
          Kit.sound('correct');
          Kit.say(item.a);
          setTimeout(function () { finish(true, chosen); }, 650);
        } else {
          btnNodes[idx].classList.add('wrong');
          btnNodes.forEach(function (b, j) { if (choices[j] === item.a) b.classList.add('right'); });
          Kit.sound('soft');
          setTimeout(function () { finish(false, chosen); }, 950);
        }
      }

      card.appendChild(grid);
      popKeys = Kit.overlayKeys({
        1: function () { pickChoice(0); }, a: function () { pickChoice(0); },
        2: function () { pickChoice(1); }, b: function () { pickChoice(1); },
        3: function () { pickChoice(2); }, c: function () { pickChoice(2); },
        4: function () { pickChoice(3); }, d: function () { pickChoice(3); },
        r: function () { Kit.say(item.q.replace(/_+/g, ' blank ')); }
      });
    }

    if (secLeft > 0) {
      timerId = setInterval(function () {
        if (answered) { clearInterval(timerId); return; }
        secLeft--;
        if (timerPill) {
          timerPill.textContent = '⏱ ' + secLeft + 's';
          if (secLeft <= 5) timerPill.classList.add('urgent');
        }
        if (secLeft <= 0) {
          clearInterval(timerId);
          Kit.sound('soft');
          finish(false, '');
        } else if (secLeft <= 4) {
          Kit.sound('tick');
        }
      }, 1000);
    }

    container.appendChild(card);
    if (opts.autoRead !== false && !Kit.preview) {
      var initSpeech = typeof item.speak === 'string' && item.speak ? item.speak : (isSpeaking ? item.q + ' ' + item.a : item.q.replace(/_+/g, ' '));
      Kit.say(initSpeech);
    }
    return { cancel: function () { answered = true; clearInterval(timerId); popKeys(); } };
  }

  Kit.questions = {
    ensureLoaded: ensureLoaded,
    builtIn: builtIn,
    mine: mine,
    all: all,
    get: get,
    save: save,
    remove: remove,
    parseTabular: parseTabular,
    toCsv: toCsv,
    downloadCsvTemplate: downloadCsvTemplate,
    askCard: renderAskCard
  };

  /* =========================================================================
     PAST SIMPLE SENTENCE PACKS & FORM GENERATOR (`Kit.sentences` — Time Train)
     ========================================================================= */
  var SSTORE = 'ssets';
  var U5TB = 'review-g3-time-book/img/';
  var U5TC = 'review-g3-time-capsule/img/';
  var U5G4 = 'review-g4-sound-detectives/img/';
  var GM_ART = 'game-maker/art/';

  var BUILTIN_SENTENCE_PACKS = [
    {
      id: 'g3-u5-time-train',
      name: "Let's Go Back! (G3 Unit 5)",
      sub: 'Grade 3 · Unit 5 · Jannah, Egypt & Time Capsules',
      grade: '3',
      unit: '5',
      e: '🏺',
      builtIn: true,
      items: [
        { when: 'Yesterday', subj: 'Jannah', pron: 'she', base: 'open', past: 'opened', rest: 'the special book', img: U5TB + 'book.webp', pic: '📘', ansYes: true },
        { when: 'Then', subj: 'Jannah', pron: 'she', base: 'see', past: 'saw', rest: 'a huge chariot in the street', img: U5TB + 'chariot.webp', pic: '🛞', ansYes: true },
        { when: 'In 1977', subj: 'Voyager 1', pron: 'it', base: 'go', past: 'went', rest: 'into space', img: U5TC + 'spacecraft.webp', pic: '🚀', ansYes: true },
        { when: 'In Egypt', subj: 'The old woman', pron: 'she', base: 'be', past: 'was', rest: 'very surprised', img: U5TB + 'surprised.webp', pic: '😮', ansYes: true },
        { when: 'At the palace', subj: 'The guards', pron: 'they', base: 'shout', past: 'shouted', rest: 'at Jannah', img: U5TB + 'guards.webp', pic: '💂', ansYes: true },
        { when: 'In 1795', subj: 'People', pron: 'they', base: 'put', past: 'put', rest: 'coins in the time capsule', img: U5TC + 'coins.webp', pic: '🪙', ansYes: true },
        { when: 'Quickly', subj: 'Jannah', pron: 'she', base: 'run', past: 'ran', rest: 'through the ancient city', img: U5TB + 'city.webp', pic: '🏃‍♀️', ansYes: true },
        { when: 'In the morning', subj: 'Her mom', pron: 'she', base: 'say', past: 'said', rest: 'wake up to Jannah', img: U5TB + 'bed.webp', pic: '🛏️', ansYes: true },
        { when: 'In the street', subj: 'Jannah', pron: 'she', base: 'give', past: 'gave', rest: 'her red glasses to the woman', img: U5TB + 'glasses.webp', pic: '👓', ansYes: true },
        { when: 'Long ago', subj: 'The pharaoh', pron: 'he', base: 'ride', past: 'rode', rest: 'in a golden chariot', img: U5TB + 'pharaoh.webp', pic: '👑', ansYes: true },
        { when: 'In 2014', subj: 'Workers', pron: 'they', base: 'find', past: 'found', rest: 'the old Boston time capsule', img: U5TC + 'capsule.webp', pic: '📦', ansYes: true },
        { when: 'At night', subj: 'Jannah', pron: 'she', base: 'wear', past: 'wore', rest: 'modern pajamas in Egypt', img: U5TB + 'strange.webp', pic: '🤔', ansYes: false },
        { when: 'In ancient Egypt', subj: 'People', pron: 'they', base: 'make', past: 'made', rest: 'beautiful glass bowls', img: U5TB + 'ancient.webp', pic: '🏺', ansYes: true },
        { when: 'In the garden', subj: 'The children', pron: 'they', base: 'dig', past: 'dug', rest: 'a hole for the capsule', img: U5TC + 'garden-dig.webp', pic: '⛏️', ansYes: true },
        { when: 'For the future', subj: 'The boy', pron: 'he', base: 'write', past: 'wrote', rest: 'a letter about today', img: U5TC + 'letter.webp', pic: '✉️', ansYes: true },
        { when: 'On Voyager', subj: 'Scientists', pron: 'they', base: 'send', past: 'sent', rest: 'a shiny gold disc', img: U5TC + 'disc.webp', pic: '💿', ansYes: true },
        { when: 'In the street', subj: 'Jannah', pron: 'she', base: 'be', past: 'was', rest: 'scared of the guards', img: U5TB + 'scared.webp', pic: '😨', ansYes: true },
        { when: 'In ancient times', subj: 'The streets', pron: 'they', base: 'be', past: 'were', rest: 'hot and dusty', img: U5TB + 'city.webp', pic: '🏜️', ansYes: true },
        { when: 'Before bed', subj: 'Jannah', pron: 'she', base: 'look', past: 'looked', rest: 'at a picture of an old street', img: U5TB + 'jannah.webp', pic: '📖', ansYes: true },
        { when: 'Long ago', subj: 'People', pron: 'they', base: 'read', past: 'read', rest: 'newspapers from 1795', img: U5TC + 'newspaper.webp', pic: '📰', ansYes: false }
      ]
    },
    {
      id: 'everyday-past',
      name: 'My Yesterday (Everyday Past)',
      sub: 'Grade 3 & 4 · Regular & Irregular Past Simple',
      grade: 'All',
      unit: '',
      e: '🌈',
      builtIn: true,
      items: [
        { when: 'Yesterday', subj: 'She', pron: 'she', base: 'play', past: 'played', rest: 'football in the park', img: GM_ART + 'o_football.webp', pic: '⚽', ansYes: true },
        { when: 'Last Saturday', subj: 'We', pron: 'we', base: 'go', past: 'went', rest: 'to the concert hall', img: U5G4 + 'concert-hall.webp', pic: '🎻', ansYes: true },
        { when: 'After school', subj: 'He', pron: 'he', base: 'watch', past: 'watched', rest: 'a funny movie', img: U5G4 + 'studio.webp', pic: '🎬', ansYes: true },
        { when: 'This morning', subj: 'The cat', pron: 'it', base: 'chase', past: 'chased', rest: 'the ball of yarn', img: GM_ART + 'c_cat_ready.webp', pic: '🐱', ansYes: true },
        { when: 'Last night', subj: 'My sister', pron: 'she', base: 'listen', past: 'listened', rest: 'to piano music', img: U5G4 + 'beethoven-piano.webp', pic: '🎹', ansYes: true },
        { when: 'On Sunday', subj: 'They', pron: 'they', base: 'sail', past: 'sailed', rest: 'a wooden boat on the river', img: 'assets/egypt-book/egypt_boat.webp', pic: '⛵', ansYes: false },
        { when: 'Yesterday', subj: 'The puppy', pron: 'it', base: 'find', past: 'found', rest: 'a big tasty bone', img: GM_ART + 'c_dog_ready.webp', pic: '🐶', ansYes: true },
        { when: 'Last week', subj: 'Our class', pron: 'we', base: 'visit', past: 'visited', rest: 'the science museum', img: U5TC + 'earth.webp', pic: '🌍', ansYes: true },
        { when: 'In the morning', subj: 'He', pron: 'he', base: 'clean', past: 'cleaned', rest: 'his bedroom', img: U5TB + 'bedroom.webp', pic: '🛏️', ansYes: true },
        { when: 'At the party', subj: 'She', pron: 'she', base: 'open', past: 'opened', rest: 'the pink present', img: GM_ART + 'pu_gift.webp', pic: '🎁', ansYes: true },
        { when: 'Yesterday', subj: 'The knight', pron: 'he', base: 'carry', past: 'carried', rest: 'a shiny sword', img: U5G4 + 'knight.webp', pic: '🛡️', ansYes: true },
        { when: 'Last winter', subj: 'The train', pron: 'it', base: 'stop', past: 'stopped', rest: 'at the snowy station', img: 'assets/unit3-arctic/o_train.png', pic: '🚂', ansYes: false }
      ]
    },
    {
      id: 'irregular-express',
      name: 'Irregular Verbs Express',
      sub: 'Grade 3 & 4 · High-Frequency Irregular Verbs',
      grade: 'All',
      unit: '',
      e: '⚡',
      builtIn: true,
      items: [
        { when: 'Yesterday', subj: 'She', pron: 'she', base: 'see', past: 'saw', rest: 'an eagle in the sky', img: U5G4 + 'eagle.webp', pic: '🦅', ansYes: true },
        { when: 'Last summer', subj: 'They', pron: 'they', base: 'go', past: 'went', rest: 'to the pyramids', img: 'assets/egypt-book/egypt_pyramid.webp', pic: '🏜️', ansYes: true },
        { when: 'At noon', subj: 'The horse', pron: 'it', base: 'run', past: 'ran', rest: 'across the green field', img: U5G4 + 'horse.webp', pic: '🐎', ansYes: true },
        { when: 'In music class', subj: 'The children', pron: 'they', base: 'sing', past: 'sang', rest: 'a cheerful song', img: U5G4 + 'voices.webp', pic: '🎵', ansYes: true },
        { when: 'Last night', subj: 'Beethoven', pron: 'he', base: 'write', past: 'wrote', rest: 'beautiful music', img: U5G4 + 'composer.webp', pic: '🎼', ansYes: true },
        { when: 'In the ocean', subj: 'The fish', pron: 'it', base: 'swim', past: 'swam', rest: 'under the ice', img: 'assets/unit3-arctic/o_fish.png', pic: '🐟', ansYes: true },
        { when: 'Yesterday', subj: 'He', pron: 'he', base: 'take', past: 'took', rest: 'a photo of his family', img: U5TC + 'photo.webp', pic: '📷', ansYes: true },
        { when: 'At lunch', subj: 'The rabbit', pron: 'it', base: 'eat', past: 'ate', rest: 'fresh green lettuce', img: U5G4 + 'lettuce.webp', pic: '🥬', ansYes: true },
        { when: 'On Monday', subj: 'My friend', pron: 'she', base: 'make', past: 'made', rest: 'a paper rocket', img: GM_ART + 'pu_rocket.webp', pic: '🚀', ansYes: false },
        { when: 'In the morning', subj: 'The explorer', pron: 'he', base: 'find', past: 'found', rest: 'a treasure chest', img: GM_ART + 'o_pirates_a.webp', pic: '💎', ansYes: true },
        { when: 'Yesterday', subj: 'She', pron: 'she', base: 'give', past: 'gave', rest: 'a flower to the singer', img: U5G4 + 'lina-wave.webp', pic: '🌸', ansYes: true },
        { when: 'In the studio', subj: 'The artist', pron: 'he', base: 'hit', past: 'hit', rest: 'the big drum loudly', img: U5G4 + 'drum.webp', pic: '🥁', ansYes: true }
      ]
    }
  ];

  var PROPER_SUBJ = /^(Jannah|Voyager|Beethoven|Cairo|Boston|Earth|Egypt|Lina|Jack|Monday|Sunday)\b/;

  function inferPronoun(subj, explicit) {
    if (explicit) return String(explicit).toLowerCase();
    var s = String(subj || '').trim();
    if (/^(i)$/i.test(s)) return 'you';
    if (/^(we|our\s)/i.test(s)) return 'we';
    if (/^(they|people|workers|scientists|the\s+(guards|children|streets|knights|boys|girls|students))$/i.test(s) || /s$/i.test(s) && !/^(his|this|bus|class)$/i.test(s)) return 'they';
    if (/^(she|jannah|lina|her\s+mom|my\s+sister|the\s+(old\s+woman|woman|girl|queen|singer))$/i.test(s)) return 'she';
    if (/^(he|beethoven|the\s+(pharaoh|boy|man|knight|explorer|artist|composer))$/i.test(s)) return 'he';
    return 'it';
  }

  function subjInQuestion(subj) {
    var s = String(subj || '').trim();
    if (!s) return 'she';
    if (s === 'I') return 'I';
    if (PROPER_SUBJ.test(s)) return s;
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  function thirdPerson(base) {
    var b = String(base || '').toLowerCase();
    if (b === 'be') return 'is';
    if (b === 'have') return 'has';
    if (/(sh|ch|x|s|z|o)$/.test(b)) return b + 'es';
    if (/[^aeiou]y$/.test(b)) return b.slice(0, -1) + 'ies';
    return b + 's';
  }

  function ingForm(base) {
    var b = String(base || '').toLowerCase();
    if (b === 'be') return 'being';
    if (b === 'see') return 'seeing';
    if (/ie$/.test(b)) return b.slice(0, -2) + 'ying';
    if (/e$/.test(b) && !/ee$/.test(b)) return b.slice(0, -1) + 'ing';
    if (/^(run|put|dig|hit|swim|stop|sit|get)$/.test(b)) return b + b.slice(-1) + 'ing';
    return b + 'ing';
  }

  function overRegular(base, past) {
    var b = String(base || '').toLowerCase();
    if (b === String(past || '').toLowerCase()) return b + 'ed'; // put -> puted, hit -> hited, read -> readed
    if (!/ed$/i.test(past)) return /e$/.test(b) ? b + 'd' : b + 'ed'; // see -> seed, go -> goed
    return 'did ' + b;
  }

  function normalizeSentenceItem(raw) {
    if (!raw || !raw.subj || !raw.base || !raw.past || !raw.rest) return null;
    var pic = String(raw.img || raw.pic || '').trim();
    var isImg = /\.(webp|png|jpe?g|gif|svg)$/i.test(pic) || /^data:image\//i.test(pic);
    var base = String(raw.base).trim().toLowerCase();
    var past = String(raw.past).trim().toLowerCase();
    return {
      when: String(raw.when || '').trim(),
      subj: String(raw.subj || '').trim(),
      pron: inferPronoun(raw.subj, raw.pron),
      base: base,
      past: past,
      rest: String(raw.rest || '').trim().replace(/[.?!]+$/, ''),
      img: isImg ? pic : '',
      pic: isImg ? (raw.pic || '🚂') : (pic || '🚂'),
      ansYes: raw.ansYes === false || String(raw.ansYes).toLowerCase() === 'no' || String(raw.ansYes) === '0' ? false : true,
      isBe: base === 'be' || past === 'was' || past === 'were'
    };
  }

  function buildSentenceForms(item) {
    var it = normalizeSentenceItem(item);
    if (!it) return null;
    var posFull = (it.when ? it.when + ', ' : '') + (it.when && !PROPER_SUBJ.test(it.subj) && it.subj !== 'I' ? it.subj.charAt(0).toLowerCase() + it.subj.slice(1) : it.subj) + ' ' + it.past + ' ' + it.rest + '.';
    var posPlain = it.subj + ' ' + it.past + ' ' + it.rest + '.';
    var negFull = it.subj + " didn't " + it.base + ' ' + it.rest + '.';
    var qSubj = subjInQuestion(it.subj);
    var qFull = 'Did ' + qSubj + ' ' + it.base + ' ' + it.rest + '?';

    var st1Choices;
    if (it.isBe) {
      st1Choices = [it.past, it.past === 'was' ? 'were' : 'was', 'is', 'are'];
    } else {
      var cand = [it.past];
      [it.base, thirdPerson(it.base), ingForm(it.base), overRegular(it.base, it.past)].forEach(function (c) {
        if (c && cand.indexOf(c) < 0 && cand.length < 4) cand.push(c);
      });
      st1Choices = cand;
    }

    var trapPast = it.past === it.base ? thirdPerson(it.base) : it.past;

    return {
      item: it,
      posFull: posFull,
      posPlain: posPlain,
      negFull: negFull,
      qFull: qFull,
      qSubj: qSubj,
      st1Choices: st1Choices,
      trapPast: trapPast,
      hint: it.isBe ? ('Past of "be" → ' + it.past) : (it.base + ' → ' + it.past),
      yesText: 'Yes, ' + it.pron + ' did!',
      noText: 'No, ' + it.pron + " didn't!"
    };
  }

  function sBuiltIn() {
    return BUILTIN_SENTENCE_PACKS.map(function (p) {
      return Object.assign({}, p, {
        builtIn: true,
        items: p.items.map(normalizeSentenceItem).filter(Boolean)
      });
    });
  }

  function sMine() {
    if (!Kit.dbTx) return Promise.resolve([]);
    return Kit.dbTx(SSTORE, 'readonly', function (s) { return s.getAll(); })
      .then(function (r) { return (r || []).sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); }); })
      .catch(function () { return []; });
  }

  function sAll() {
    var b = sBuiltIn();
    return sMine().then(function (m) {
      return m.map(function (p) {
        p.items = (p.items || []).map(normalizeSentenceItem).filter(Boolean);
        return p;
      }).concat(b);
    });
  }

  function sGet(id) {
    return sAll().then(function (list) {
      return list.filter(function (s) { return s.id === id; })[0] || list[0];
    });
  }

  function sSave(pack) {
    pack.updated = Date.now();
    delete pack.builtIn;
    return Kit.dbTx(SSTORE, 'readwrite', function (s) { s.put(pack); });
  }

  function sRemove(id) {
    return Kit.dbTx(SSTORE, 'readwrite', function (s) { s.delete(id); });
  }

  function sToCsv(items) {
    var lines = ['when,subject,base_verb,past_verb,rest_of_sentence,yes_or_no,picture'];
    (items || []).forEach(function (it) {
      lines.push([
        csvCell(it.when || ''),
        csvCell(it.subj || ''),
        csvCell(it.base || ''),
        csvCell(it.past || ''),
        csvCell(it.rest || ''),
        csvCell(it.ansYes === false ? 'no' : 'yes'),
        csvCell(it.img || it.pic || '')
      ].join(','));
    });
    return lines.join('\r\n');
  }

  function sParseTabular(text) {
    var lines = String(text || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    if (!lines.length) return [];
    var sep = lines[0].indexOf('\t') >= 0 ? '\t' : ',';
    var out = [];
    lines.forEach(function (line, idx) {
      var cols = splitCsvLine(line, sep);
      if (idx === 0 && /^(when|subject)$/i.test(cols[0] || '')) return;
      var item;
      // Support either 5+ columns (when, subj, base, past, rest, yes/no, pic) OR 4 columns (subj, base, past, rest)
      if (cols.length >= 5) {
        item = normalizeSentenceItem({
          when: cols[0], subj: cols[1], base: cols[2], past: cols[3], rest: cols[4],
          ansYes: cols[5] ? !/^n/i.test(cols[5]) : true, pic: cols[6] || ''
        });
      } else if (cols.length === 4) {
        item = normalizeSentenceItem({ when: 'Yesterday', subj: cols[0], base: cols[1], past: cols[2], rest: cols[3], ansYes: true });
      }
      if (item) out.push(item);
    });
    return out;
  }

  function sDownloadCsv(pack) {
    var sample = (pack && pack.items && pack.items.length) ? pack.items : BUILTIN_SENTENCE_PACKS[0].items;
    var csv = sToCsv(sample);
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    var a = doc.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = ((pack && pack.name ? pack.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'time-train-sentences') || 'sentences') + '.csv';
    doc.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  Kit.sentences = {
    builtIn: sBuiltIn,
    mine: sMine,
    all: sAll,
    get: sGet,
    save: sSave,
    remove: sRemove,
    forms: buildSentenceForms,
    normalize: normalizeSentenceItem,
    parseTabular: sParseTabular,
    toCsv: sToCsv,
    downloadCsvTemplate: sDownloadCsv
  };
})(window);
