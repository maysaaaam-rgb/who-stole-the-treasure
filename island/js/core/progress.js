/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Multi-Chapter Progress & Telemetry (island/js/core/progress.js)
   - Powers both `window.Ch1Progress` (Chapter 1: Unit 1) and `window.Ch2Progress` (Chapter 2: Unit 2)
   - Saves per-student per-clue progress locally first, then syncs via IslandSync / IslandCloud
   - Writes canonical `g{3|4}-z{1|2}-m{1..5}` AND legacy `m_g{3|4}_z{1|2}_{1..5}` star keys
     so World Map, IslandApp, Stickers, Coins, XP, and Teacher Studio stay 100% in sync!
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var overrideGrade = null;
  var overrideStar = null;

  function getSession() {
    var st = root.IslandApp && typeof root.IslandApp.state === 'function' ? root.IslandApp.state() : null;
    return (st && st.session) || {};
  }

  function setActiveGrade(g) {
    if (Number(g) === 3 || Number(g) === 4) {
      overrideGrade = Number(g);
      var s = getSession();
      if (s && s.isDemo) s.grade = overrideGrade;
    }
    return getActiveGrade();
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

  function isStarPreferred() {
    if (overrideStar !== null) return !!overrideStar;
    try {
      var q = new URLSearchParams(root.location.search);
      if (q.get('mode') === 'star') return true;
    } catch (e) { /* ignore */ }
    var s = getSession();
    return !!(s && s.star);
  }

  function setStarPreferred(flag) {
    overrideStar = flag === null ? null : !!flag;
    return isStarPreferred();
  }

  function getStudentId() {
    var s = getSession();
    return (s.student && s.student.id) || 'demo-g3';
  }

  function getStudentName() {
    var s = getSession();
    return (s.student && (s.student.name || s.student.firstName || s.student.first_name)) || 'Explorer';
  }

  function getStudentClass() {
    var s = getSession();
    return (s.student && (s.student.className || s.student.class_name)) || (getActiveGrade() === 4 ? '4A' : '3A');
  }

  function makeChapterTracker(chNum) {
    var ch = Number(chNum) || 1;
    var STORAGE_PREFIX = 'eaa_ch' + ch + '_progress_v1_';
    var TEACHER_INDEX_KEY = 'eaa_ch' + ch + '_teacher_log_v1';
    var docKey = 'ch' + ch;
    var chestKey = 'z' + ch;
    var stickerId = ch === 2 ? 'stk-z2-lulu' : 'stk-z1-benbow';
    var mapPieceField = ch === 2 ? 'mapPiece2' : 'mapPiece1';
    var stickerField = ch === 2 ? 'luluSticker' : 'benbowSticker';

    function canonicalMissionId(grade, stopNum, mode) {
      var g = grade === 4 ? 4 : 3;
      var n = Math.max(1, Math.min(5, Number(stopNum) || 1));
      if (mode === 'star') return 'g' + g + '-z' + ch + '-s' + n;
      return 'g' + g + '-z' + ch + '-m' + n;
    }

    function legacyMissionId(grade, stopNum, mode) {
      var g = grade === 4 ? 4 : 3;
      var n = Math.max(1, Math.min(5, Number(stopNum) || 1));
      if (mode === 'star') return 's_g' + g + '_z' + ch + '_' + n;
      return 'm_g' + g + '_z' + ch + '_' + n;
    }

    function readStudentRecord(studentId) {
      var sid = studentId || getStudentId();
      var fallback = {
        chapter: ch,
        studentId: sid,
        studentName: getStudentName(),
        className: getStudentClass(),
        grade: getActiveGrade(),
        coins: 0,
        chestOpened: false,
        lastStop: 1,
        clues: {}
      };
      fallback[mapPieceField] = false;
      fallback[stickerField] = false;

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

      var s = getSession();
      if (s && s.doc && s.doc[docKey] && s.doc[docKey].clues) {
        return Object.assign(fallback, s.doc[docKey]);
      }
      return fallback;
    }

    function writeStudentRecord(rec) {
      if (!rec || !rec.studentId) return;
      try {
        localStorage.setItem(STORAGE_PREFIX + rec.studentId, JSON.stringify(rec));
      } catch (e) { /* ignore */ }

      try {
        var all = {};
        var rawAll = localStorage.getItem(TEACHER_INDEX_KEY);
        if (rawAll) all = JSON.parse(rawAll) || {};
        all[rec.studentId] = rec;
        localStorage.setItem(TEACHER_INDEX_KEY, JSON.stringify(all));
      } catch (e) { /* ignore */ }

      try {
        var s = getSession();
        if (s && s.doc) {
          s.doc[docKey] = rec;
          s.doc.stars = s.doc.stars || {};
          Object.keys(rec.clues || {}).forEach(function (k) {
            var c = rec.clues[k];
            if (c && c.stopNum) {
              var g = c.grade || rec.grade;
              var st = Number(c.stars) || 0;
              var canId = canonicalMissionId(g, c.stopNum, c.mode);
              var legId = legacyMissionId(g, c.stopNum, c.mode);
              s.doc.stars[canId] = Math.max(Number(s.doc.stars[canId]) || 0, st);
              s.doc.stars[legId] = Math.max(Number(s.doc.stars[legId]) || 0, st);
              if (c.mode === 'star') {
                var canEasy = canonicalMissionId(g, c.stopNum, 'easy');
                var legEasy = legacyMissionId(g, c.stopNum, 'easy');
                s.doc.stars[canEasy] = Math.max(Number(s.doc.stars[canEasy]) || 0, st);
                s.doc.stars[legEasy] = Math.max(Number(s.doc.stars[legEasy]) || 0, st);
              }
            }
          });
          if (rec.chestOpened) {
            s.doc.chests = s.doc.chests || {};
            s.doc.chests[chestKey] = true;
            s.doc.stickers = s.doc.stickers || {};
            s.doc.stickers[stickerId] = true;
            if (Array.isArray(s.doc.stickers)) {
              if (s.doc.stickers.indexOf(stickerId) === -1) s.doc.stickers.push(stickerId);
            }
          }
          if (root.IslandSync && typeof root.IslandSync.saveIslandDoc === 'function') {
            root.IslandSync.saveIslandDoc(s);
          } else if (root.IslandCloud && typeof root.IslandCloud.savePracticeDoc === 'function' && s.student && !s.isDemo) {
            Promise.resolve(root.IslandCloud.savePracticeDoc(s.student.id, s.doc)).catch(function () { /* offline safe */ });
          }
        }
      } catch (e) { /* ignore */ }
    }

    function recordClueResult(payload) {
      var grade = payload.grade || getActiveGrade();
      var stopNum = Math.max(1, Math.min(5, Number(payload.stopNum) || 1));
      var mode = payload.mode === 'star' ? 'star' : 'easy';
      var clueId = payload.clueId || ('g' + grade + '_ch' + ch + '_c' + stopNum);
      if (ch === 1 && !payload.clueId) clueId = 'g' + grade + '_c' + stopNum;
      var stdKey = 'g' + grade + '_c' + stopNum + '_' + mode;

      var rec = readStudentRecord();
      rec.studentName = getStudentName();
      rec.className = getStudentClass();
      rec.grade = grade;

      var prev = rec.clues[stdKey] || {};
      var stars = Math.max(1, Math.min(3, Number(payload.stars) || 3));
      var bestStars = Math.max(Number(prev.stars) || 0, stars);

      rec.clues[stdKey] = {
        clueId: clueId,
        chapter: ch,
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

      var easyKey = 'g' + grade + '_c' + stopNum + '_easy';
      if (!rec.clues[easyKey]) {
        rec.clues[easyKey] = Object.assign({}, rec.clues[stdKey], { mode: 'easy' });
      } else if (bestStars > (rec.clues[easyKey].stars || 0)) {
        rec.clues[easyKey].stars = bestStars;
      }

      var coinsEarned = stars * 5 + (mode === 'star' ? 5 : 0);
      rec.coins = (Number(rec.coins) || 0) + coinsEarned;
      if (root.WorldGame && typeof root.WorldGame.addBonusCoins === 'function') {
        root.WorldGame.addBonusCoins(coinsEarned);
      }

      if (root.IslandApp && typeof root.IslandApp.awardIslandXP === 'function') {
        try {
          root.IslandApp.awardIslandXP(stars * 3 + (mode === 'star' ? 3 : 0), canonicalMissionId(grade, stopNum, mode));
        } catch (e) { /* ignore */ }
      }

      if (stopNum >= (rec.lastStop || 1)) {
        rec.lastStop = Math.min(5, stopNum + 1);
      }

      writeStudentRecord(rec);
      if (root.IslandShop && typeof root.IslandShop.refresh === 'function') root.IslandShop.refresh();
      return { record: rec, clueEntry: rec.clues[stdKey], coinsEarned: coinsEarned };
    }

    function getClueStars(grade, stopNum, mode) {
      var g = grade || getActiveGrade();
      var rec = readStudentRecord();
      var base = 'g' + g + '_c' + stopNum;
      if (mode) {
        var entry = rec.clues[base + '_' + mode];
        if (entry && entry.stars) return Number(entry.stars) || 0;
      } else {
        var eStars = (rec.clues[base + '_easy'] && rec.clues[base + '_easy'].stars) || 0;
        var sStars = (rec.clues[base + '_star'] && rec.clues[base + '_star'].stars) || 0;
        if (eStars || sStars) return Math.max(eStars, sStars);
      }
      var s = getSession();
      var starsMap = (s && s.doc && s.doc.stars) || {};
      var canId = canonicalMissionId(g, stopNum, mode || 'easy');
      var legId = legacyMissionId(g, stopNum, mode || 'easy');
      return Math.max(Number(starsMap[canId]) || 0, Number(starsMap[legId]) || 0);
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

    function isChestOpened() {
      var rec = readStudentRecord();
      if (rec.chestOpened) return true;
      var s = getSession();
      return !!(s.doc && s.doc.chests && s.doc.chests[chestKey]);
    }

    function markChestOpened() {
      var rec = readStudentRecord();
      var firstTime = !rec.chestOpened;
      rec.chestOpened = true;
      rec[mapPieceField] = true;
      rec[stickerField] = true;
      if (firstTime) {
        rec.coins = (Number(rec.coins) || 0) + 25;
        if (root.WorldGame && typeof root.WorldGame.addBonusCoins === 'function') {
          root.WorldGame.addBonusCoins(25);
        }
      }
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

    return {
      chapter: ch,
      getActiveGrade: getActiveGrade,
      setActiveGrade: setActiveGrade,
      isStarPreferred: isStarPreferred,
      setStarPreferred: setStarPreferred,
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
      canonicalMissionId: canonicalMissionId,
      legacyMissionId: legacyMissionId,
      getAllStudentsReport: getAllStudentsReport
    };
  }

  var ch1 = makeChapterTracker(1);
  var ch2 = makeChapterTracker(2);
  ch1.forChapter = function (n) { return Number(n) === 2 ? ch2 : ch1; };

  root.Ch1Progress = ch1;
  root.Ch2Progress = ch2;
})(typeof window !== 'undefined' ? window : this);
