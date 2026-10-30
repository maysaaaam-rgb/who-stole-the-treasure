/* Practice Island — Cloud & Offline Sync Engine (island/js/sync.js)
   - In ?demo=1 mode: strictly uses localStorage (eaa_island_demo_*) and NEVER touches Supabase.
   - In live pupil mode (?p=CODE): reads class-island-sync + students + island-<studentId>,
     and writes ONLY to classes row id = "island-<studentId>" (never writes to students). */
(function (root) {
  'use strict';

  var DEMO_PREFIX = 'eaa_island_demo_';
  var LOCAL_STATE_PREFIX = 'eaa_island_state_';
  var PENDING_KEY = 'eaa_island_pending_v1';
  var LAST_CODE_KEY = 'eaa_island_last_code';
  var TEST_SYNC_KEY = 'eaa_island_test_sync';
  var TEST_STUDENTS_KEY = 'eaa_island_test_students';
  var TEST_DOC_PREFIX = 'eaa_island_test_doc_';

  function client() {
    return root.AdventureSupabase && root.AdventureSupabase.client ? root.AdventureSupabase.client : null;
  }

  function todayStr() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function yesterdayStr(fromDateStr) {
    var parts = String(fromDateStr || todayStr()).split('-').map(Number);
    var dt = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
    dt.setDate(dt.getDate() - 1);
    var yyyy = dt.getFullYear();
    var mm = String(dt.getMonth() + 1).padStart(2, '0');
    var dd = String(dt.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function emptyIslandDoc(studentId) {
    return {
      studentId: studentId,
      days: {},
      stars: {},
      chests: {},
      dailyDone: {},
      streak: 0,
      lastDay: '',
      streakBonuses: {},
      look: null,
      lookAt: '',
      updatedAt: new Date().toISOString()
    };
  }

  /* Merge two island-<studentId> documents safely by updatedAt without losing progress */
  function mergeIslandDocs(a, b) {
    var d1 = a || {};
    var d2 = b || {};
    var newerFirst = String(d2.updatedAt || '') >= String(d1.updatedAt || '');
    var primary = newerFirst ? d2 : d1;
    var base = emptyIslandDoc(primary.studentId || d1.studentId || d2.studentId || '');

    var allDays = Object.assign({}, d1.days || {});
    Object.keys(d2.days || {}).forEach(function (day) {
      if (!allDays[day]) {
        allDays[day] = JSON.parse(JSON.stringify(d2.days[day]));
      } else {
        var mSet = {};
        (allDays[day].missions || []).concat(d2.days[day].missions || []).forEach(function (m) { mSet[m] = true; });
        allDays[day] = {
          xp: Math.max(Number(allDays[day].xp) || 0, Number(d2.days[day].xp) || 0),
          missions: Object.keys(mSet)
        };
      }
    });
    base.days = allDays;

    var allStars = Object.assign({}, d1.stars || {});
    Object.keys(d2.stars || {}).forEach(function (mId) {
      allStars[mId] = Math.max(Number(allStars[mId]) || 0, Number(d2.stars[mId]) || 0);
    });
    base.stars = allStars;

    base.chests = Object.assign({}, d1.chests || {}, d2.chests || {});
    base.dailyDone = Object.assign({}, d1.dailyDone || {}, d2.dailyDone || {});
    base.streakBonuses = Object.assign({}, d1.streakBonuses || {}, d2.streakBonuses || {});

    if (String(d2.lookAt || '') >= String(d1.lookAt || '')) {
      base.look = d2.look !== undefined ? d2.look : (d1.look || null);
      base.lookAt = d2.lookAt || d1.lookAt || '';
    } else {
      base.look = d1.look !== undefined ? d1.look : (d2.look || null);
      base.lookAt = d1.lookAt || d2.lookAt || '';
    }

    if (String(d2.lastDay || '') >= String(d1.lastDay || '')) {
      base.lastDay = d2.lastDay || '';
      base.streak = Math.max(Number(d1.streak) || 0, Number(d2.streak) || 0);
    } else {
      base.lastDay = d1.lastDay || '';
      base.streak = Math.max(Number(d1.streak) || 0, Number(d2.streak) || 0);
    }

    base.updatedAt = new Date().toISOString();
    return base;
  }

  /* Calculate island XP not yet in applied (when applied cannot be read, compare day with today) */
  function calcUnappliedIslandXP(doc, appliedDays) {
    if (!doc || !doc.days) return 0;
    var today = todayStr();
    return Object.keys(doc.days).reduce(function (sum, day) {
      var dayXP = Number(doc.days[day] && doc.days[day].xp) || 0;
      if (appliedDays && typeof appliedDays === 'object') {
        var already = Number(appliedDays[day]) || 0;
        return sum + Math.max(0, dayXP - already);
      }
      /* Fallback when applied map cannot be read: include today's (and any future) unapplied XP */
      return day >= today ? (sum + dayXP) : sum;
    }, 0);
  }

  function inferGrade(studentRow, studentId) {
    if (studentRow && (Number(studentRow.grade) === 3 || Number(studentRow.grade) === 4)) {
      return Number(studentRow.grade);
    }
    var checkStr = String((studentRow && (studentRow.className || studentRow.classId || studentRow.class_id)) || studentId || '');
    if (/4[ab]|grade[-_\s]*4|-4[ab]-/i.test(checkStr)) return 4;
    return 3;
  }

  function parseJsonSafe(raw, fallback) {
    if (!raw) return fallback;
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function getPendingQueue() {
    try {
      return parseJsonSafe(localStorage.getItem(PENDING_KEY), {}) || {};
    } catch (e) {
      return {};
    }
  }

  function setPendingQueue(q) {
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify(q || {}));
    } catch (e) {}
  }

  /* Saves through the pupil's code. Falls back to the old direct save only while the cloud function does not exist yet. */
  async function saveToCloud(sb, sid, firstName, code, doc) {
    if (code) {
      var viaCode = await sb.rpc('island_save', { p_code: code, p_doc: doc });
      if (!viaCode.error || viaCode.error.code !== 'PGRST202') return viaCode;
    }
    return sb.from('classes').upsert({
      id: 'island-' + sid,
      name: 'Island ' + (firstName || 'Pupil'),
      grade: 'System',
      teacher: 'System',
      archived: true,
      description: JSON.stringify(doc)
    }, { onConflict: 'id' });
  }

  /* Retry any pending offline island-<studentId> saves */
  async function flushPendingSaves() {
    if (root.__islandForceOffline === true) return { ok: false, offline: true, flushed: 0 };
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return { ok: false, offline: true, flushed: 0 };
    var sb = client();
    if (!sb) return { ok: false, offline: true, flushed: 0 };

    var queue = getPendingQueue();
    var ids = Object.keys(queue);
    if (!ids.length) return { ok: true, flushed: 0 };

    var flushed = 0;
    for (var i = 0; i < ids.length; i++) {
      var sid = ids[i];
      var item = queue[sid];
      if (!item || !item.doc) {
        delete queue[sid];
        continue;
      }
      try {
        var res = await saveToCloud(sb, sid, item.firstName, item.code, item.doc);
        if (!res || !res.error) {
          delete queue[sid];
          flushed++;
        }
      } catch (e) {
        /* keep in queue for next retry */
      }
    }
    setPendingQueue(queue);
    return { ok: Object.keys(queue).length === 0, flushed: flushed, remaining: Object.keys(queue).length };
  }

  if (typeof root.addEventListener === 'function') {
    root.addEventListener('online', function () {
      flushPendingSaves();
    });
  }

  /* Demo Mode Loader & Saver */
  function loadDemoSession(demoPupilId) {
    var pupils = (root.IslandData && root.IslandData.DEMO_PUPILS) || {};
    var pid = (demoPupilId && pupils[demoPupilId]) ? demoPupilId : 'demo-g3';
    var template = JSON.parse(JSON.stringify(pupils[pid]));
    var savedRaw = null;
    try { savedRaw = localStorage.getItem(DEMO_PREFIX + 'doc_' + pid); } catch (e) {}
    var doc = parseJsonSafe(savedRaw, null) || emptyIslandDoc(pid);

    /* Pre-populate demo-g4 with Zone 1 completed so Zone 2 is unlocked right away in demo! */
    if (pid === 'demo-g4' && Object.keys(doc.stars || {}).length === 0) {
      doc.stars = { 'g4-z1-m1': 3, 'g4-z1-m2': 3, 'g4-z1-m3': 2, 'g4-z1-m4': 3 };
      doc.streak = 5;
      doc.lastDay = todayStr();
    } else if (pid === 'demo-star' && !doc.streak) {
      doc.streak = 3;
      doc.lastDay = todayStr();
    } else if (pid === 'demo-g3' && !doc.streak) {
      doc.streak = 2;
      doc.lastDay = todayStr();
    }

    if (doc.look && template.monsterProfile) {
      template.monsterProfile.equipped = Object.assign({}, template.monsterProfile.equipped, doc.look);
    }

    return Promise.resolve({
      status: 'ok',
      isDemo: true,
      code: 'DEMO',
      student: template,
      grade: template.grade,
      star: !!template.star,
      cap: template.star ? 45 : 30,
      appliedDays: {},
      appliedSum: 0,
      doc: doc
    });
  }

  function saveDemoDoc(studentId, doc) {
    try {
      doc.updatedAt = new Date().toISOString();
      localStorage.setItem(DEMO_PREFIX + 'doc_' + studentId, JSON.stringify(doc));
    } catch (e) {}
    return Promise.resolve({ ok: true, isDemo: true });
  }

  /* Live Cloud Session Loader (?p=CODE) */
  async function loadLiveSession(rawCode) {
    var code = String(rawCode || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!code || code.length < 4) {
      return { status: 'need_code' };
    }

    /* Flush any pending offline saves when page opens */
    await flushPendingSaves().catch(function () {});

    var sb = client();
    var testSync = null;
    try { testSync = parseJsonSafe(localStorage.getItem(TEST_SYNC_KEY), null) || root.__ISLAND_TEST_SYNC || null; } catch (e) {}

    if (!sb && !testSync) {
      return { status: 'error', message: 'Ask your teacher for your island link 🏝️' };
    }

    try {
      var syncDoc = testSync;
      /* The pupil's code opens only their own data. The direct reads below stay only until the cloud function exists. */
      var opened = null, canOpen = false;
      if (!syncDoc && sb) {
        var openRes = await sb.rpc('island_open', { p_code: code });
        canOpen = !openRes.error || openRes.error.code !== 'PGRST202';
        if (canOpen) opened = openRes.data;
        if (opened) syncDoc = opened.sync;
      }
      if (!syncDoc && sb && !canOpen) {
        var syncRes = await sb.from('classes').select('id,description').eq('id', 'class-island-sync').maybeSingle();
        syncDoc = parseJsonSafe(syncRes && syncRes.data && syncRes.data.description, null);
      }
      if (!syncDoc || !syncDoc.codes || !syncDoc.codes[code]) {
        return { status: 'invalid_code', code: code };
      }

      var studentId = syncDoc.codes[code];
      try { localStorage.setItem(LAST_CODE_KEY, code); } catch (e) {}

      var isStar = !!(syncDoc.star && syncDoc.star[studentId]);
      var cap = isStar ? (Number(syncDoc.starCap) || 45) : (Number(syncDoc.cap) || 30);

      var hasAppliedObj = !!(syncDoc.applied && typeof syncDoc.applied === 'object');
      var appliedDays = hasAppliedObj ? (syncDoc.applied[studentId] || {}) : null;
      var appliedSum = appliedDays ? Object.keys(appliedDays).reduce(function (sum, d) {
        return sum + (Number(appliedDays[d]) || 0);
      }, 0) : 0;

      /* Read pupil row from students table (or local test stub if present) */
      var testStudents = null;
      try { testStudents = parseJsonSafe(localStorage.getItem(TEST_STUDENTS_KEY), null); } catch (e) {}
      var stuRow = (testStudents && testStudents[studentId]) || (opened && opened.student) || null;
      if (!stuRow && sb) {
        var stuRes = await sb.from('students').select('*').eq('id', studentId).maybeSingle();
        stuRow = (stuRes && stuRes.data) || null;
      }
      stuRow = stuRow || { id: studentId, name: 'Explorer', xp: 0 };

      var profile = parseJsonSafe(stuRow.monster_profile || stuRow.monsterProfile, null) || {
        baseColor: 'blue',
        equipped: {},
        unlockedItems: []
      };
      var firstName = String(stuRow.first_name || stuRow.firstName || stuRow.name || 'Explorer').trim().split(/\s+/)[0];
      var baseXP = Number(stuRow.xp != null ? stuRow.xp : (stuRow.total_xp != null ? stuRow.total_xp : stuRow.totalXP)) || 0;
      var grade = inferGrade(stuRow, studentId);

      /* Read pupil's own island-<studentId> row from classes table */
      var testIslandDoc = null;
      try { testIslandDoc = parseJsonSafe(localStorage.getItem(TEST_DOC_PREFIX + studentId), null); } catch (e) {}
      var cloudDoc = testIslandDoc || (opened && opened.doc) || null;
      if (!cloudDoc && sb && !opened) {
        var islRes = await sb.from('classes').select('id,description').eq('id', 'island-' + studentId).maybeSingle();
        cloudDoc = parseJsonSafe(islRes && islRes.data && islRes.data.description, null);
      }
      cloudDoc = cloudDoc || emptyIslandDoc(studentId);

      var localRaw = null;
      try { localRaw = localStorage.getItem(LOCAL_STATE_PREFIX + studentId); } catch (e) {}
      var localDoc = parseJsonSafe(localRaw, null);

      var mergedDoc = localDoc ? mergeIslandDocs(cloudDoc, localDoc) : cloudDoc;
      mergedDoc.studentId = studentId;

      if (mergedDoc.look) {
        profile.equipped = Object.assign({}, profile.equipped || {}, mergedDoc.look);
      }

      try {
        localStorage.setItem(LOCAL_STATE_PREFIX + studentId, JSON.stringify(mergedDoc));
      } catch (e) {}

      return {
        status: 'ok',
        isDemo: false,
        code: code,
        student: {
          id: studentId,
          name: stuRow.name || firstName,
          firstName: firstName,
          grade: grade,
          totalXP: baseXP,
          monsterProfile: profile
        },
        grade: grade,
        star: isStar,
        cap: cap,
        appliedDays: appliedDays,
        appliedSum: appliedSum,
        doc: mergedDoc
      };
    } catch (err) {
      return { status: 'error', message: 'Ask your teacher for your island link 🏝️' };
    }
  }

  /* Save pupil's island-<studentId> row to classes table (and offline queue if offline/failed) */
  async function saveIslandDoc(session) {
    if (!session || !session.doc) return { ok: false };
    var studentId = session.student.id;
    var firstName = session.student.firstName || 'Pupil';

    if (session.isDemo) {
      return saveDemoDoc(studentId, session.doc);
    }

    var localPrev = null;
    try { localPrev = parseJsonSafe(localStorage.getItem(LOCAL_STATE_PREFIX + studentId), null); } catch (e) {}
    var doc = localPrev ? mergeIslandDocs(localPrev, session.doc) : session.doc;
    doc.studentId = studentId;
    doc.updatedAt = new Date().toISOString();
    session.doc = doc;

    try {
      localStorage.setItem(LOCAL_STATE_PREFIX + studentId, JSON.stringify(doc));
    } catch (e) {}

    /* Record in pending queue first so if offline or upsert fails, it is preserved and retried */
    var queue = getPendingQueue();
    queue[studentId] = {
      studentId: studentId,
      firstName: firstName,
      code: session.code,
      doc: doc,
      queuedAt: doc.updatedAt
    };
    setPendingQueue(queue);

    if (root.__islandForceOffline === true || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
      return { ok: false, offline: true, queued: true };
    }

    var sb = client();
    if (!sb) return { ok: false, offline: true, queued: true };

    try {
      var res = await saveToCloud(sb, studentId, firstName, session.code, doc);
      if (res && res.error) return { ok: false, offline: true, queued: true, error: res.error };

      var curQueue = getPendingQueue();
      delete curQueue[studentId];
      setPendingQueue(curQueue);
      return { ok: true };
    } catch (e) {
      return { ok: false, offline: true, queued: true };
    }
  }

  root.IslandSync = {
    todayStr: todayStr,
    yesterdayStr: yesterdayStr,
    emptyIslandDoc: emptyIslandDoc,
    mergeIslandDocs: mergeIslandDocs,
    calcUnappliedIslandXP: calcUnappliedIslandXP,
    getPendingQueue: getPendingQueue,
    flushPendingSaves: flushPendingSaves,
    loadDemoSession: loadDemoSession,
    loadLiveSession: loadLiveSession,
    saveIslandDoc: saveIslandDoc
  };

})(typeof window !== 'undefined' ? window : this);
