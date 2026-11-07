/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Progress & Telemetry (island/js/core/progress.js)
   - Saves per-student per-clue progress locally first, then syncs to Supabase
   - Tracks: clueId, stopNum, grade, mode (easy/star), stars (1-3),
     tries, hintsUsed, timeMs, missedItems, completedAt
   - Bridges seamlessly with IslandApp / WORLD mission stars & coins
     so the harbour map, HUD stamps, and teacher dashboard stay in sync
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var STORAGE_PREFIX = 'eaa_ch1_progress_v1_';
  var TEACHER_INDEX_KEY = 'eaa_ch1_teacher_log_v1';
  var overrideGrade = null;

  function setActiveGrade(g) {
    if (Number(g) === 3 || Number(g) === 4) {
      overrideGrade = Number(g);
    }
    return getActiveGrade();
  }

  function getSession() {
    var st = root.IslandApp && typeof root.IslandApp.state === 'function' ? root.IslandApp.state() : null;
    return (st && st.session) || {};
  }

  function getStudentId() {
    var s = getSession();
    return (s.student && s.student.id) || 'demo-g3';
  }

  function getStudentName() {
    var s = getSession();
    return (s.student && (s.student.name || s.student.first_name)) || 'Explorer';
  }

  function getStudentClass() {
    var s = getSession();
    return (s.student && (s.student.className || s.student.class_name)) || (getActiveGrade() === 4 ? '4A' : '3A');
  }

  function getActiveGrade() {
    if (overrideGrade === 3 || overrideGrade === 4) return overrideGrade;
    try {
      var q = new URLSearchParams(root.location.search);
      var qg = Number(q.get('grade'));
      if (qg === 3 || qg === 4) return qg;
      var s = getSession();
      if (s.grade === 3 || s.grade === 4) return s.grade;
      if (s.student && (Number(s.student.grade) === 3 || Number(s.student.grade) === 4)) {
        return Number(s.student.grade);
      }
    } catch (e) { /* ignore */ }
    return 3;
  }

  function legacyMissionId(grade, stopNum, mode) {
    var g = grade === 4 ? 4 : 3;
    var n = Math.max(1, Math.min(5, Number(stopNum) || 1));
    if (mode === 'star') return 's_g' + g + '_z1_' + n;
    return 'm_g' + g + '_z1_' + n;
  }

  function readStudentRecord(studentId) {
    var sid = studentId || getStudentId();
    var fallback = {
      studentId: sid,
      studentName: getStudentName(),
      className: getStudentClass(),
      grade: getActiveGrade(),
      coins: 0,
      chestOpened: false,
      mapPiece1: false,
      benbowSticker: false,
      lastStop: 1,
      clues: {}
    };
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + sid);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          parsed.clues = parsed.clues || {};
          return Object.assign(fallback, parsed);
        }
      }
    } catch (e) { /* ignore */ }

    // Hydrate from legacy session.doc if available
    var s = getSession();
    if (s && s.doc && s.doc.ch1 && s.doc.ch1.clues) {
      return Object.assign(fallback, s.doc.ch1);
    }
    return fallback;
  }

  function writeStudentRecord(rec) {
    if (!rec || !rec.studentId) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + rec.studentId, JSON.stringify(rec));
    } catch (e) { /* ignore */ }

    // Update teacher rollup log in localStorage
    try {
      var all = {};
      var rawAll = localStorage.getItem(TEACHER_INDEX_KEY);
      if (rawAll) all = JSON.parse(rawAll) || {};
      all[rec.studentId] = rec;
      localStorage.setItem(TEACHER_INDEX_KEY, JSON.stringify(all));
    } catch (e) { /* ignore */ }

    // Mirror into IslandApp session.doc and trigger defensive Supabase sync
    try {
      var s = getSession();
      if (s && s.doc) {
        s.doc.ch1 = rec;
        s.doc.stars = s.doc.stars || {};
        Object.keys(rec.clues || {}).forEach(function (k) {
          var c = rec.clues[k];
          if (c && c.stopNum) {
            var legId = legacyMissionId(c.grade || rec.grade, c.stopNum, c.mode);
            s.doc.stars[legId] = Math.max(Number(s.doc.stars[legId]) || 0, Number(c.stars) || 0);
            if (c.mode === 'star') {
              var regId = legacyMissionId(c.grade || rec.grade, c.stopNum, 'easy');
              s.doc.stars[regId] = Math.max(Number(s.doc.stars[regId]) || 0, Number(c.stars) || 0);
            }
          }
        });
        if (rec.chestOpened) {
          s.doc.chests = s.doc.chests || {};
          s.doc.chests.z1 = true;
          s.doc.stickers = s.doc.stickers || {};
          s.doc.stickers['stk-z1-benbow'] = true;
        }
        if (root.IslandCloud && typeof root.IslandCloud.savePracticeDoc === 'function' && s.student && !s.isDemo) {
          Promise.resolve(root.IslandCloud.savePracticeDoc(s.student.id, s.doc)).catch(function () { /* offline safe */ });
        }
      }
    } catch (e) { /* ignore */ }
  }

  function recordClueResult(payload) {
    var grade = payload.grade || getActiveGrade();
    var stopNum = Math.max(1, Math.min(5, Number(payload.stopNum) || 1));
    var mode = payload.mode === 'star' ? 'star' : 'easy';
    var clueId = payload.clueId || ('g' + grade + '_c' + stopNum);
    var key = clueId + '_' + mode;

    var rec = readStudentRecord();
    rec.studentName = getStudentName();
    rec.className = getStudentClass();
    rec.grade = grade;

    var prev = rec.clues[key] || {};
    var stars = Math.max(1, Math.min(3, Number(payload.stars) || 3));
    var bestStars = Math.max(Number(prev.stars) || 0, stars);

    rec.clues[key] = {
      clueId: clueId,
      stopNum: stopNum,
      grade: grade,
      mode: mode,
      stars: bestStars,
      lastStars: stars,
      tries: Number(payload.tries) || 0,
      hintsUsed: Number(payload.hintsUsed) || 0,
      timeMs: Number(payload.timeMs) || 0,
      missedItems: Array.isArray(payload.missedItems) ? payload.missedItems.slice(0, 10) : [],
      attemptsCount: (Number(prev.attemptsCount) || 0) + 1,
      completedAt: new Date().toISOString()
    };

    // Also ensure easy slot is marked complete if they completed star mode
    var easyKey = clueId + '_easy';
    if (!rec.clues[easyKey]) {
      rec.clues[easyKey] = Object.assign({}, rec.clues[key], { mode: 'easy' });
    } else if (bestStars > (rec.clues[easyKey].stars || 0)) {
      rec.clues[easyKey].stars = bestStars;
    }

    // Award coins (saved for when Store unlocks in later chapters)
    var coinsEarned = stars * 5 + (mode === 'star' ? 5 : 0);
    rec.coins = (Number(rec.coins) || 0) + coinsEarned;
    if (root.WorldGame && typeof root.WorldGame.addBonusCoins === 'function') {
      root.WorldGame.addBonusCoins(coinsEarned);
    }

    // Advance lastStop pointer for resume
    if (stopNum >= (rec.lastStop || 1)) {
      rec.lastStop = Math.min(5, stopNum + 1);
    }

    writeStudentRecord(rec);
    return { record: rec, clueEntry: rec.clues[key], coinsEarned: coinsEarned };
  }

  function getClueStars(grade, stopNum, mode) {
    var g = grade || getActiveGrade();
    var rec = readStudentRecord();
    var clueId = 'g' + g + '_c' + stopNum;
    if (mode) {
      var entry = rec.clues[clueId + '_' + mode];
      if (entry && entry.stars) return Number(entry.stars) || 0;
    } else {
      var eStars = (rec.clues[clueId + '_easy'] && rec.clues[clueId + '_easy'].stars) || 0;
      var sStars = (rec.clues[clueId + '_star'] && rec.clues[clueId + '_star'].stars) || 0;
      if (eStars || sStars) return Math.max(eStars, sStars);
    }
    // Check legacy session stars too
    var s = getSession();
    var legId = legacyMissionId(g, stopNum, mode || 'easy');
    return Number((s.doc && s.doc.stars && s.doc.stars[legId]) || 0);
  }

  function isClueDone(grade, stopNum, mode) {
    return getClueStars(grade, stopNum, mode) > 0;
  }

  function getStampCount(grade) {
    var g = grade || getActiveGrade();
    var count = 0;
    for (var i = 1; i <= 5; i++) {
      if (getClueStars(g, i) > 0) count++;
    }
    return count;
  }

  function getTotalStars(grade) {
    var g = grade || getActiveGrade();
    var total = 0;
    for (var i = 1; i <= 5; i++) {
      total += getClueStars(g, i);
    }
    return total;
  }

  function getNextStop(grade) {
    var g = grade || getActiveGrade();
    for (var i = 1; i <= 5; i++) {
      if (getClueStars(g, i) === 0) return i;
    }
    return 5;
  }

  function isChestOpened(grade) {
    var rec = readStudentRecord();
    if (rec.chestOpened) return true;
    var s = getSession();
    return !!(s.doc && s.doc.chests && s.doc.chests.z1);
  }

  function markChestOpened(grade) {
    var rec = readStudentRecord();
    rec.chestOpened = true;
    rec.mapPiece1 = true;
    rec.benbowSticker = true;
    rec.coins = (Number(rec.coins) || 0) + 25;
    writeStudentRecord(rec);
    return rec;
  }

  function getAllStudentsReport() {
    var all = {};
    try {
      var raw = localStorage.getItem(TEACHER_INDEX_KEY);
      if (raw) all = JSON.parse(raw) || {};
    } catch (e) { /* ignore */ }
    var cur = readStudentRecord();
    if (cur && cur.studentId) all[cur.studentId] = cur;
    return all;
  }

  root.Ch1Progress = {
    getActiveGrade: getActiveGrade,
    setActiveGrade: setActiveGrade,
    getStudentId: getStudentId,
    getStudentName: getStudentName,
    readStudentRecord: readStudentRecord,
    recordClueResult: recordClueResult,
    getClueStars: getClueStars,
    isClueDone: isClueDone,
    getStampCount: getStampCount,
    getTotalStars: getTotalStars,
    getNextStop: getNextStop,
    isChestOpened: isChestOpened,
    markChestOpened: markChestOpened,
    legacyMissionId: legacyMissionId,
    getAllStudentsReport: getAllStudentsReport
  };
})(typeof window !== 'undefined' ? window : this);
