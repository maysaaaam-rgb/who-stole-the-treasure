/* English Adventure Academy · Games Collection · Classroom, Mascots, Avatars & Class Board XP Bridge (v2)
   - Privacy invariant (AGENTS.md §8): Real pupil first names & avatars appear ONLY when the
     teacher session is unlocked on this browser (`TeacherAuth`). Otherwise games use kawaii
     mascot teams (`Bunny`, `Kitty`, `Bear`, `Ducky`) with zero pupil data exposed.
   - Mascot Customizer: Every team gets an adorable illustrated mascot (`assets/games/mascots/*.webp`)
     with `< >` arrows to swap mascots and editable team names (persisted in preferences), plus
     live `− / ＋` teacher score controls during play.
   - Class Board XP: Writes idempotent awards (`team score ÷ pupils`, minimum `+5 XP` floor) to
     `localStorage['eaa_games_points_inbox']`, drained by `js/games-points-bridge.js`. */
(function (root) {
  'use strict';

  var Kit = root.Kit = root.Kit || {};
  var doc = root.document;

  var STORE_KEY = 'eaa_master_school_v6';
  var ACTIVE_CLASS_KEY = 'adventure_active_class';
  var INBOX_KEY = 'eaa_games_points_inbox';
  var ROSTER_PREFIX = 'eaa_games_team_roster_v1_';

  var PASTEL_BUBBLES = [
    { bg: '#ffe0ef', fg: '#b83270', bd: '#ff7eb6' },
    { bg: '#dff1ff', fg: '#1e6bb8', bd: '#6fbcff' },
    { bg: '#daf8ee', fg: '#167c60', bd: '#5fd3b3' },
    { bg: '#fff3cf', fg: '#9c6b08', bd: '#ffd36e' },
    { bg: '#ece3ff', fg: '#5a38b8', bd: '#a98bff' },
    { bg: '#ffe7dc', fg: '#b84b24', bd: '#ffad8a' }
  ];

  var avatarsBooted = false;

  function isTeacherSession() {
    try {
      if (sessionStorage.getItem('eaa_auth_unlocked') === 'true') return true;
      if (localStorage.getItem('eaa_device_trust_v2') === 'trusted' && localStorage.getItem('eaa_explicit_locked_v2') !== '1') return true;
    } catch (e) {}
    return false;
  }

  function readMasterStore() {
    if (!isTeacherSession()) return {};
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || {};
    } catch (e) {
      return {};
    }
  }

  function todayKey() {
    var d = new Date();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function absentMapFor(classId) {
    var map = {};
    if (!classId) return map;
    try {
      var raw = localStorage.getItem('eaa_board_absent_' + classId + '_' + todayKey());
      var arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) arr.forEach(function (id) { map[id] = 1; });
    } catch (e) {}
    return map;
  }

  function cleanFirstName(s) {
    var fn = String((s && s.firstName) || '').trim();
    if (!fn && s && s.name) fn = String(s.name).trim().split(/\s+/)[0] || '';
    if (!fn || /^Pupil\s+\d+$/i.test(fn)) return fn || 'Pupil';
    return fn.split(/\s+/)[0];
  }

  function classes() {
    var st = readMasterStore();
    if (!Array.isArray(st.classes)) return [];
    return st.classes
      .filter(function (c) {
        return c && !c.archived && !/store-sync|sync/i.test(c.id) && c.grade !== 'System' && c.grade !== 'Sync';
      })
      .map(function (c) {
        var shortLabel = String(c.name || c.id).replace(/^Grade\s*/i, '').trim();
        return {
          id: c.id,
          label: shortLabel || c.id,
          grade: String(c.grade || '').replace(/\D+/g, '') || (shortLabel.charAt(0) === '4' ? '4' : '3')
        };
      });
  }

  function defaultClassId() {
    var list = classes();
    if (!list.length) return '';
    try {
      var urlCls = new URLSearchParams(root.location.search || '').get('class') || '';
      if (urlCls && list.some(function (c) { return c.id === urlCls; })) {
        Kit.pref('classId', urlCls);
        return urlCls;
      }
    } catch (e0) {}
    var saved = Kit.pref('classId');
    if (saved === 'none') return '';
    if (saved && list.some(function (c) { return c.id === saved; })) return saved;
    try {
      var act = localStorage.getItem(ACTIVE_CLASS_KEY);
      if (act && list.some(function (c) { return c.id === act; })) return act;
    } catch (e) {}
    return list[0].id;
  }

  function pupils(classId, includeAbsent) {
    if (!classId || !isTeacherSession()) return [];
    var st = readMasterStore();
    if (!Array.isArray(st.students)) return [];
    var abs = includeAbsent ? {} : absentMapFor(classId);
    var out = st.students
      .filter(function (s) { return s && !s.archived && s.classId === classId && !abs[s.id]; })
      .map(function (s, idx) {
        return {
          id: s.id,
          name: cleanFirstName(s),
          initial: (cleanFirstName(s).charAt(0) || '?').toUpperCase(),
          palette: PASTEL_BUBBLES[idx % PASTEL_BUBBLES.length]
        };
      });
    out.sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });
    return out;
  }

  function groups(classId) {
    if (!classId || !isTeacherSession()) return [];
    var st = readMasterStore();
    if (!Array.isArray(st.groups)) return [];
    var byId = {};
    pupils(classId, false).forEach(function (p) { byId[p.id] = p; });
    return st.groups
      .filter(function (g) { return g && g.classId === classId && Array.isArray(g.studentIds); })
      .map(function (g) {
        var members = g.studentIds.map(function (id) { return byId[id]; }).filter(Boolean);
        return {
          id: g.id,
          name: String(g.name || 'Team').slice(0, 16),
          pupils: members
        };
      })
      .filter(function (g) { return g.pupils.length > 0; });
  }

  /* ---------------- Mascot Customization Preferences ---------------- */
  function getMascotSpecs() {
    var saved = Kit.pref('teamMascots');
    return (saved && typeof saved === 'object') ? saved : {};
  }

  function lookForSlot(slotIdx) {
    var looks = Kit.TEAM_LOOK || [];
    if (!looks.length) return { name: 'Team ' + (slotIdx + 1), c: '#ff74a6', bg: '#fff0f6', e: '⭐', img: '', lookIdx: 0 };
    var specs = getMascotSpecs();
    var sp = specs[slotIdx] || {};
    var lIdx = sp.lookIdx != null ? ((sp.lookIdx % looks.length) + looks.length) % looks.length : (slotIdx % looks.length);
    var base = looks[lIdx];
    return {
      name: (sp.customName && String(sp.customName).trim()) ? String(sp.customName).trim() : base.name,
      defaultName: base.name,
      c: base.c,
      bg: base.bg || '#fff0f6',
      e: base.e,
      img: base.img,
      lookIdx: lIdx
    };
  }

  function cycleSlotMascot(slotIdx, delta) {
    var looks = Kit.TEAM_LOOK || [];
    if (!looks.length) return;
    var specs = getMascotSpecs();
    var cur = specs[slotIdx] || {};
    var prevLook = lookForSlot(slotIdx);
    var nextIdx = (((cur.lookIdx != null ? cur.lookIdx : slotIdx) + delta) % looks.length + looks.length) % looks.length;
    var nextBase = looks[nextIdx];
    // Update name automatically if teacher hadn't typed a custom non-mascot name
    var wasDefault = !cur.customName || looks.some(function (l) { return l.name === cur.customName; }) || cur.customName === prevLook.defaultName;
    specs[slotIdx] = {
      lookIdx: nextIdx,
      customName: wasDefault ? nextBase.name : cur.customName
    };
    Kit.pref('teamMascots', specs);
  }

  function setSlotCustomName(slotIdx, newName) {
    var specs = getMascotSpecs();
    var cur = specs[slotIdx] || { lookIdx: slotIdx % (Kit.TEAM_LOOK || [1]).length };
    cur.customName = String(newName || '').slice(0, 16);
    specs[slotIdx] = cur;
    Kit.pref('teamMascots', specs);
  }

  /* ---------------- Lazy Pupil Avatar Loader ---------------- */
  function loadScriptOnce(url) {
    return new Promise(function (resolve) {
      var existing = doc.querySelector('script[data-eaa-src="' + url + '"]');
      if (existing) { resolve(true); return; }
      var s = doc.createElement('script');
      s.src = url;
      s.async = true;
      s.setAttribute('data-eaa-src', url);
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      doc.head.appendChild(s);
    });
  }

  function bootAvatars() {
    if (avatarsBooted || Kit.preview || !isTeacherSession()) return;
    avatarsBooted = true;
    var rootRel = root.KIT_ROOT || '../';
    root.EAA_AVATAR_BASE = rootRel + 'assets/avatars/';

    var chain = Promise.resolve();
    if (typeof navigator === 'undefined' || navigator.onLine !== false) {
      chain = chain
        .then(function () { return loadScriptOnce('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'); })
        .then(function () { return loadScriptOnce(rootRel + 'js/supabase-config.js?v=2.5'); })
        .then(function () { return loadScriptOnce(rootRel + 'js/supabase-client.js?v=4.6'); });
    }
    chain
      .then(function () { return loadScriptOnce(rootRel + 'js/monster-outfits.js?v=3'); })
      .then(function () { return loadScriptOnce(rootRel + 'js/pupil-avatars.js?v=31'); })
      .then(function () {
        if (root.PupilAvatars && typeof root.PupilAvatars.load === 'function') {
          try { root.PupilAvatars.load(); } catch (e) {}
        }
        refreshAvatarNodes();
      });

    root.addEventListener('eaa:avatars-ready', function () { refreshAvatarNodes(); });
  }

  function avatarUrlFor(studentId) {
    if (!studentId || !root.PupilAvatars) return '';
    try {
      if (typeof root.PupilAvatars.pictureFor === 'function') {
        return root.PupilAvatars.pictureFor(studentId) || '';
      }
    } catch (e) {}
    return '';
  }

  function refreshAvatarNodes() {
    if (!doc) return;
    var nodes = doc.querySelectorAll('[data-kit-pupil-av]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var sid = n.getAttribute('data-kit-pupil-av');
      var url = avatarUrlFor(sid);
      if (url && !n.querySelector('img')) {
        var initTxt = n.getAttribute('data-kit-pupil-init') || '★';
        n.innerHTML = '';
        var im = doc.createElement('img');
        im.src = url;
        im.alt = '';
        im.className = 'kit-av-img';
        im.onerror = function () { n.innerHTML = ''; n.textContent = initTxt; };
        n.appendChild(im);
      } else if (url && n.querySelector('img') && n.querySelector('img').getAttribute('src') !== url) {
        n.querySelector('img').setAttribute('src', url);
      }
    }
  }

  function avatarBubble(pupil, sizePx) {
    var sz = sizePx || 32;
    var pal = (pupil && pupil.palette) || PASTEL_BUBBLES[0];
    var initChar = (pupil && pupil.initial) || '★';
    var wrap = Kit.el('span', {
      class: 'kit-av-bubble',
      'data-kit-pupil-av': (pupil && pupil.id) || '',
      'data-kit-pupil-init': initChar,
      title: (pupil && pupil.name) || '',
      style: {
        width: sz + 'px',
        height: sz + 'px',
        background: pal.bg,
        color: pal.fg,
        borderColor: pal.bd,
        fontSize: Math.max(11, Math.round(sz * 0.44)) + 'px'
      }
    });
    var url = pupil && pupil.id ? avatarUrlFor(pupil.id) : '';
    if (url) {
      var imgNode = Kit.el('img', { src: url, alt: '', class: 'kit-av-img' });
      imgNode.onerror = function () { wrap.innerHTML = ''; wrap.textContent = initChar; };
      wrap.appendChild(imgNode);
    } else {
      wrap.textContent = initChar;
    }
    return wrap;
  }

  /* ---------------- Persistent Team Builder & Speaker Rotation ---------------- */
  function rosterCacheKey(classId, teamCount, teamMode) {
    return ROSTER_PREFIX + classId + '_' + teamCount + '_' + (teamMode || 'auto');
  }

  function clearSavedRoster(classId) {
    try {
      var keys = [];
      for (var i = 0; i < sessionStorage.length; i++) {
        var k = sessionStorage.key(i);
        if (k && k.indexOf(ROSTER_PREFIX + (classId || '')) === 0) keys.push(k);
      }
      keys.forEach(function (k) { sessionStorage.removeItem(k); });
    } catch (e) {}
  }

  function buildTeams(teamCount, opts) {
    opts = opts || {};
    var n = Math.max(2, Math.min(6, Number(teamCount) || 2));
    var classId = opts.classId !== undefined ? opts.classId : (Kit.pref('classId') === 'none' ? '' : defaultClassId());

    if (!classId || !isTeacherSession()) {
      var plain = [];
      for (var i = 0; i < n; i++) {
        var lk = lookForSlot(i);
        plain.push({ name: lk.name, color: lk.c, bg: lk.bg, emoji: lk.e, mascotImg: lk.img, lookIdx: lk.lookIdx, score: 0, pupils: [], speakerIdx: 0 });
      }
      return plain;
    }

    bootAvatars();
    var list = pupils(classId, false);
    if (!list.length) {
      var emptyTeams = [];
      for (var j = 0; j < n; j++) {
        var lk2 = lookForSlot(j);
        emptyTeams.push({ name: lk2.name, color: lk2.c, bg: lk2.bg, emoji: lk2.e, mascotImg: lk2.img, lookIdx: lk2.lookIdx, score: 0, pupils: [], speakerIdx: 0, classId: classId });
      }
      return emptyTeams;
    }

    var savedGroups = groups(classId);
    var mode = opts.teamMode || Kit.pref('teamMode') || (savedGroups.length >= 2 ? 'groups' : 'fair');
    var buckets = [];

    if (mode === 'groups' && savedGroups.length >= 2) {
      var gUse = savedGroups.slice(0, 6);
      n = gUse.length;
      for (var g = 0; g < n; g++) {
        var lkG = lookForSlot(g);
        buckets.push({
          name: gUse[g].name || lkG.name,
          color: lkG.c,
          bg: lkG.bg,
          emoji: lkG.e,
          mascotImg: lkG.img,
          lookIdx: lkG.lookIdx,
          score: 0,
          classId: classId,
          pupils: gUse[g].pupils.slice(),
          speakerIdx: 0
        });
      }
      return buckets;
    }

    var cKey = rosterCacheKey(classId, n, 'fair');
    var byId = {};
    list.forEach(function (p) { byId[p.id] = p; });
    var savedIds = null;
    if (!opts.forceRemix) {
      try { savedIds = JSON.parse(sessionStorage.getItem(cKey) || 'null'); } catch (e) {}
    }

    if (Array.isArray(savedIds) && savedIds.length === n) {
      var assigned = {};
      buckets = savedIds.map(function (idArr, idx) {
        var lkS = lookForSlot(idx);
        var mem = (idArr || []).map(function (id) { assigned[id] = 1; return byId[id]; }).filter(Boolean);
        return { name: lkS.name, color: lkS.c, bg: lkS.bg, emoji: lkS.e, mascotImg: lkS.img, lookIdx: lkS.lookIdx, score: 0, classId: classId, pupils: mem, speakerIdx: 0 };
      });
      list.forEach(function (p) {
        if (!assigned[p.id]) {
          buckets.slice().sort(function (a, b) { return a.pupils.length - b.pupils.length; })[0].pupils.push(p);
        }
      });
    } else {
      var shuffled = Kit.shuffle(list);
      for (var k = 0; k < n; k++) {
        var lkM = lookForSlot(k);
        buckets.push({ name: lkM.name, color: lkM.c, bg: lkM.bg, emoji: lkM.e, mascotImg: lkM.img, lookIdx: lkM.lookIdx, score: 0, classId: classId, pupils: [], speakerIdx: 0 });
      }
      shuffled.forEach(function (p, idx) { buckets[idx % n].pupils.push(p); });
      try {
        sessionStorage.setItem(cKey, JSON.stringify(buckets.map(function (b) { return b.pupils.map(function (p) { return p.id; }); })));
      } catch (e) {}
    }

    return buckets;
  }

  function currentSpeaker(team) {
    if (!team || !Array.isArray(team.pupils) || !team.pupils.length) return null;
    var idx = Math.abs(Number(team.speakerIdx) || 0) % team.pupils.length;
    return team.pupils[idx] || null;
  }

  function advanceSpeaker(team) {
    if (!team || !Array.isArray(team.pupils) || !team.pupils.length) return null;
    team.speakerIdx = ((Number(team.speakerIdx) || 0) + 1) % team.pupils.length;
    return currentSpeaker(team);
  }

  Kit.makeTeams = function (n, opts) {
    return buildTeams(n, opts);
  };

  Kit.renderTeams = function (box, teams, opts) {
    opts = opts || {};
    box.innerHTML = '';
    box.classList.add('teams');
    teams.forEach(function (t, i) {
      var isTurn = opts.turn === i;
      var spk = currentSpeaker(t);
      var ptsEl = Kit.el('span', { class: 'pts', text: String(t.score) });
      var kids = [
        Kit.mascotBadge ? Kit.mascotBadge(t, 40) : Kit.el('span', { class: 'dot', text: t.emoji }),
        Kit.el('span', { class: 't-info' }, [
          Kit.el('span', { class: 't-name', text: t.name }),
          (t.pupils && t.pupils.length && spk)
            ? Kit.el('small', { class: 't-spk', text: (isTurn ? '🎤 ' : '') + spk.name })
            : null
        ])
      ];
      if (t.pupils && t.pupils.length) {
        var avStrip = Kit.el('span', { class: 't-avs' });
        var shown = isTurn && spk ? [spk].concat(t.pupils.filter(function (p) { return p.id !== spk.id; })).slice(0, 3) : t.pupils.slice(0, 3);
        shown.forEach(function (p) { avStrip.appendChild(avatarBubble(p, 26)); });
        if (t.pupils.length > 3) {
          avStrip.appendChild(Kit.el('span', { class: 't-more', text: '+' + (t.pupils.length - 3) }));
        }
        kids.push(avStrip);
      }
      kids.push(ptsEl);
      if (opts.controls !== false && !Kit.preview) {
        kids.push(Kit.el('span', { class: 't-steps' }, [
          Kit.el('button', {
            type: 'button', class: 't-step', title: '−5 points', text: '−',
            onclick: function (ev) { ev.stopPropagation(); t.score = Math.max(0, t.score - 5); ptsEl.textContent = String(t.score); Kit.sound('tap'); }
          }),
          Kit.el('button', {
            type: 'button', class: 't-step', title: '+5 points', text: '＋',
            onclick: function (ev) { ev.stopPropagation(); Kit.award(box, teams, i, 5); }
          })
        ]));
      }

      var n = Kit.el('div', {
        class: 'team' + (isTurn ? ' now' : ''),
        style: { '--tc': t.color },
        'data-i': i
      }, kids);
      if (opts.onPick) {
        n.style.cursor = 'pointer';
        n.addEventListener('click', function () { opts.onPick(i, n); });
      }
      box.appendChild(n);
    });
  };

  /* ---------------- Setup Panel: Mascot Carousel Cards + Real Class/Groups ---------------- */
  function renderMascotCardsGrid(teamCount, previewTeams, allowNameEdit, onChange) {
    var grid = Kit.el('div', { class: 'mascot-setup-grid' });
    var count = previewTeams ? previewTeams.length : teamCount;
    for (var i = 0; i < count; i++) (function (slotIdx) {
      var lk = lookForSlot(slotIdx);
      var tObj = previewTeams ? previewTeams[slotIdx] : lk;
      var card = Kit.el('div', {
        class: 'mascot-card',
        style: { '--tc': tObj.color || lk.c, '--tbg': tObj.bg || lk.bg }
      });

      var portrait = Kit.el('div', { class: 'mascot-portrait' });
      var imgPath = tObj.mascotImg || lk.img;
      if (imgPath) {
        var im = Kit.el('img', { src: Kit.src(imgPath), alt: tObj.name || lk.name });
        im.onerror = function () { portrait.innerHTML = ''; portrait.textContent = tObj.emoji || lk.e; };
        portrait.appendChild(im);
      } else {
        portrait.textContent = tObj.emoji || lk.e;
      }
      card.appendChild(portrait);

      var arrows = Kit.el('div', { class: 'mascot-arrows' }, [
        Kit.el('button', {
          type: 'button', class: 'mascot-arr', title: 'Previous mascot', text: '‹',
          onclick: function () { Kit.sound('tap'); cycleSlotMascot(slotIdx, -1); onChange(); }
        }),
        Kit.el('button', {
          type: 'button', class: 'mascot-arr', title: 'Next mascot', text: '›',
          onclick: function () { Kit.sound('tap'); cycleSlotMascot(slotIdx, 1); onChange(); }
        })
      ]);
      card.appendChild(arrows);

      if (allowNameEdit) {
        var nameIn = Kit.el('input', {
          class: 'mascot-name-in',
          value: tObj.name || lk.name,
          'aria-label': 'Team ' + (slotIdx + 1) + ' name'
        });
        nameIn.addEventListener('change', function () {
          setSlotCustomName(slotIdx, nameIn.value.trim() || lk.defaultName);
          onChange();
        });
        card.appendChild(nameIn);
      } else {
        card.appendChild(Kit.el('div', { class: 'mascot-group-name', text: tObj.name }));
      }

      if (tObj.pupils && tObj.pupils.length) {
        var pChips = Kit.el('div', { class: 'kit-rp-pupils' });
        tObj.pupils.forEach(function (p) {
          pChips.appendChild(Kit.el('span', { class: 'kit-rp-chip' }, [
            avatarBubble(p, 20),
            Kit.el('span', { text: p.name })
          ]));
        });
        card.appendChild(pChips);
      }

      grid.appendChild(card);
    })(i);
    return grid;
  }

  function renderSetupClassPicker(stateObj, onChange) {
    var clsList = classes();
    var wrap = Kit.el('div', { class: 'kit-cls-setup' });

    if (clsList.length) {
      bootAvatars();
      var curClassId = stateObj.classId !== undefined ? stateObj.classId : defaultClassId();
      stateObj.classId = curClassId;

      wrap.appendChild(Kit.el('div', { class: 'label', text: '🏫 Class & Real Pupils' }));
      var row = Kit.el('div', { class: 'seg' });
      [{ id: '', label: '🐾 Mascot teams only' }].concat(clsList).forEach(function (c) {
        row.appendChild(Kit.el('button', {
          type: 'button',
          class: 'chip' + (curClassId === c.id ? ' on' : ''),
          text: c.id ? ('🎒 ' + c.label) : c.label,
          onclick: function () {
            stateObj.classId = c.id;
            Kit.pref('classId', c.id || 'none');
            if (c.id) {
              var gCount = groups(c.id).length;
              if (Kit.pref('teamMode') === 'groups' && gCount >= 2 && stateObj.teams) {
                stateObj.teams = gCount;
              }
            }
            onChange();
          }
        }));
      });
      wrap.appendChild(row);

      if (curClassId) {
        var savedGroups = groups(curClassId);
        var curMode = Kit.pref('teamMode') || (savedGroups.length >= 2 ? 'groups' : 'fair');
        if (curMode === 'groups' && savedGroups.length < 2) curMode = 'fair';

        if (stateObj.teams > 0) {
          var modeRow = Kit.el('div', { class: 'kit-cls-modes' });
          if (savedGroups.length >= 2) {
            modeRow.appendChild(Kit.el('button', {
              type: 'button',
              class: 'chip' + (curMode === 'groups' ? ' on' : ''),
              text: '👥 Class Groups (' + savedGroups.length + ')',
              onclick: function () {
                Kit.pref('teamMode', 'groups');
                stateObj.teams = savedGroups.length;
                Kit.pref('teams', stateObj.teams);
                onChange();
              }
            }));
          }
          modeRow.appendChild(Kit.el('button', {
            type: 'button',
            class: 'chip' + (curMode === 'fair' ? ' on' : ''),
            text: '🎲 Mix Fairly',
            onclick: function () { Kit.pref('teamMode', 'fair'); onChange(); }
          }));
          if (curMode === 'fair') {
            modeRow.appendChild(Kit.el('button', {
              type: 'button',
              class: 'chip',
              title: 'Shuffle pupils into fresh teams',
              text: '🔀 Remix',
              onclick: function () { clearSavedRoster(curClassId); Kit.sound('pop'); onChange(); }
            }));
          }
          wrap.appendChild(modeRow);

          var previewTeams = buildTeams(stateObj.teams, { classId: curClassId, teamMode: curMode });
          wrap.appendChild(renderMascotCardsGrid(previewTeams.length, previewTeams, curMode !== 'groups', onChange));
        } else {
          var pCount = pupils(curClassId, false).length;
          wrap.appendChild(Kit.el('p', {
            class: 'muted kit-cls-note',
            text: '✨ Whole class mode: ' + pCount + ' present pupils ready to earn Class Board XP together.'
          }));
        }
        return wrap;
      }
    }

    // Even when not signed into a class (or when "Mascot teams only" is chosen), show the adorable kawaii Mascot Team Cards!
    if (stateObj.teams > 0) {
      var plainTeams = buildTeams(stateObj.teams, { classId: '' });
      wrap.appendChild(renderMascotCardsGrid(stateObj.teams, plainTeams, true, onChange));
      return wrap;
    }

    return clsList.length ? wrap : null;
  }

  /* ---------------- Podium Class Board XP Panel (+5 XP Minimum Floor) ---------------- */
  function queueXpAwards(entries) {
    if (!Array.isArray(entries) || !entries.length) return 0;
    var inbox = [];
    try { inbox = JSON.parse(localStorage.getItem(INBOX_KEY) || '[]') || []; } catch (e) { inbox = []; }
    var existing = {};
    inbox.forEach(function (e) { if (e && e.id) existing[e.id] = 1; });
    var added = 0;
    entries.forEach(function (e) {
      if (e && e.id && !existing[e.id]) {
        inbox.push(e);
        existing[e.id] = 1;
        added++;
      }
    });
    try { localStorage.setItem(INBOX_KEY, JSON.stringify(inbox)); } catch (e) {}
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        var bc = new BroadcastChannel('eaa_games_xp');
        bc.postMessage({ type: 'XP_QUEUED', count: added });
        bc.close();
      }
    } catch (e) {}
    return added;
  }

  function renderPodiumXpPanel(opts) {
    opts = opts || {};
    var classId = opts.classId || (opts.teams && opts.teams[0] && opts.teams[0].classId) || '';
    if (!classId || !isTeacherSession()) return null;

    var gameId = opts.gameId || 'game';
    var gameTitle = opts.gameTitle || 'Games Collection';
    var sessionStamp = Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    var teams = Array.isArray(opts.teams) ? opts.teams.filter(function (t) { return t.pupils && t.pupils.length; }) : [];
    var sent = false;

    var card = Kit.el('div', { class: 'kit-xp-send-card' });
    card.appendChild(Kit.el('div', { class: 'kit-xp-head' }, [
      Kit.el('b', { text: '⭐ Send Points to Class Board' }),
      Kit.el('small', { class: 'muted', text: 'Score ÷ pupils · +5 XP minimum so everyone finishes positive' })
    ]));

    var rowsData = [];
    if (teams.length) {
      teams.forEach(function (t, idx) {
        var rawAvg = Math.round((Number(t.score) || 0) / Math.max(1, t.pupils.length));
        var xp = Kit.clamp(Math.max(5, rawAvg), 5, 60);
        rowsData.push({ label: t.emoji + ' ' + t.name, color: t.color, pupils: t.pupils, xp: xp, key: 't' + idx });
      });
    } else {
      var allPupils = pupils(classId, false);
      if (!allPupils.length) return null;
      var baseClassXp = Kit.clamp(Math.max(5, Math.round((Number(opts.classStars) || 20) / 4)), 5, 30);
      rowsData.push({ label: '🌟 Whole Class (' + allPupils.length + ' pupils)', color: '#3dd6a8', pupils: allPupils, xp: baseClassXp, key: 'all' });
    }

    var listEl = Kit.el('div', { class: 'kit-xp-rows' });
    var sendBtn = Kit.el('button', { type: 'button', class: 'btn mint', text: '' });

    function updateSendLabel() {
      var total = 0, pTotal = 0;
      rowsData.forEach(function (r) { total += r.xp * r.pupils.length; pTotal += r.pupils.length; });
      sendBtn.textContent = sent ? '✓ Sent to Class Board!' : ('⭐ Send +' + total + ' XP to ' + pTotal + ' Pupils');
    }

    function drawRows() {
      listEl.innerHTML = '';
      rowsData.forEach(function (r) {
        var valNode = Kit.el('b', { class: 'kit-xp-val', text: '+' + r.xp + ' XP each' });
        var minusBtn = Kit.el('button', {
          type: 'button', class: 'icon-btn kit-xp-step', text: '−', disabled: sent || r.xp <= 5 ? true : null,
          onclick: function () { r.xp = Math.max(5, r.xp - 5); drawRows(); updateSendLabel(); }
        });
        var plusBtn = Kit.el('button', {
          type: 'button', class: 'icon-btn kit-xp-step', text: '＋', disabled: sent || r.xp >= 60 ? true : null,
          onclick: function () { r.xp = Math.min(60, r.xp + 5); drawRows(); updateSendLabel(); }
        });
        listEl.appendChild(Kit.el('div', { class: 'kit-xp-row', style: { '--tc': r.color } }, [
          Kit.el('span', { class: 'kit-xp-team', text: r.label + ' · ' + r.pupils.length + 'p' }),
          Kit.el('div', { class: 'kit-xp-ctrl' }, [minusBtn, valNode, plusBtn])
        ]));
      });
    }

    sendBtn.addEventListener('click', function () {
      if (sent) return;
      var entries = [];
      rowsData.forEach(function (r) {
        r.pupils.forEach(function (p) {
          entries.push({
            id: 'gxp_' + gameId + '_' + sessionStamp + '_' + p.id,
            studentId: p.id,
            classId: classId,
            amount: r.xp,
            reason: gameTitle + ' (' + r.label.replace(/^[^\w]+/, '').trim() + ')',
            gameTitle: gameTitle,
            gameId: gameId,
            icon: opts.icon || '🎮',
            ts: Date.now()
          });
        });
      });
      queueXpAwards(entries);
      sent = true;
      sendBtn.disabled = true;
      drawRows();
      updateSendLabel();
      Kit.sound('fanfare');
      var c = Kit.centerOf(sendBtn);
      Kit.confetti(c.x, c.y, 70);
      Kit.toast('⭐ Sent to Class Board! Opens automatically on your platform tab.');
    });

    drawRows();
    updateSendLabel();
    card.appendChild(listEl);
    card.appendChild(sendBtn);
    return card;
  }

  Kit.classroom = {
    isTeacherSession: isTeacherSession,
    classes: classes,
    defaultClassId: defaultClassId,
    pupils: pupils,
    groups: groups,
    buildTeams: buildTeams,
    currentSpeaker: currentSpeaker,
    advanceSpeaker: advanceSpeaker,
    avatarBubble: avatarBubble,
    setupPanel: renderSetupClassPicker,
    podiumPanel: renderPodiumXpPanel,
    clearSavedRoster: clearSavedRoster,
    lookForSlot: lookForSlot
  };
})(window);
