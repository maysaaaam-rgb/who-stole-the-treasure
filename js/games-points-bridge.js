/**
 * ENGLISH ADVENTURE ACADEMY — GAMES COLLECTION XP BRIDGE (js/games-points-bridge.js)
 *
 * Drains `localStorage['eaa_games_points_inbox']` written by standalone games in `games/`
 * into `window.schoolStore.giveXP(...)` with strict idempotency (`sourceId` + processed ID log),
 * triggers Supabase Cloud Sync when verified online, and displays a classroom celebration toast.
 */
(function (root) {
  'use strict';

  var INBOX_KEY = 'eaa_games_points_inbox';
  var DONE_KEY = 'eaa_games_points_done_v1';
  var MAX_DONE_HISTORY = 400;
  var draining = false;

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function getStore() {
    return root.schoolStore || root.store || null;
  }

  function showAwardToast(totalXp, pupilCount, gameTitle) {
    if (typeof document === 'undefined' || !document.body) return;
    var existing = document.getElementById('eaa-games-xp-bridge-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'eaa-games-xp-bridge-toast';
    toast.setAttribute('role', 'status');
    toast.style.cssText =
      'position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;align-items:center;gap:12px;' +
      'padding:14px 20px;border-radius:18px;background:rgba(15,23,42,0.94);border:2px solid #10b981;' +
      'border-bottom:5px solid #047857;color:#f8fafc;font-family:"Plus Jakarta Sans",system-ui,sans-serif;' +
      'font-weight:800;font-size:0.95rem;box-shadow:0 18px 40px rgba(0,0,0,0.55);backdrop-filter:blur(14px);' +
      'transform:translateY(16px);opacity:0;transition:transform 0.25s cubic-bezier(0.175,0.885,0.32,1.275),opacity 0.2s ease;';

    var badge = document.createElement('span');
    badge.textContent = '🎮';
    badge.style.cssText = 'font-size:1.5rem;line-height:1;';

    var txt = document.createElement('div');
    var titleSpan = document.createElement('div');
    titleSpan.style.cssText = 'color:#34d399;font-size:1rem;font-weight:900;';
    titleSpan.textContent = '+' + totalXp + ' XP added to Class Board!';
    var subSpan = document.createElement('div');
    subSpan.style.cssText = 'color:#cbd5e1;font-size:0.8rem;font-weight:700;margin-top:2px;';
    subSpan.textContent = pupilCount + (pupilCount === 1 ? ' pupil' : ' pupils') + (gameTitle ? ' · ' + gameTitle : '');

    txt.appendChild(titleSpan);
    txt.appendChild(subSpan);
    toast.appendChild(badge);
    toast.appendChild(txt);
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    try {
      if (root.classSoundboard && typeof root.classSoundboard.playCoinReward === 'function') {
        root.classSoundboard.playCoinReward();
      }
    } catch (e) {}

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 280);
    }, 4500);
  }

  async function drainInbox() {
    if (draining) return { processed: 0 };
    var store = getStore();
    if (!store || typeof store.giveXP !== 'function') return { processed: 0 };

    var inbox = readJson(INBOX_KEY, []);
    if (!Array.isArray(inbox) || !inbox.length) return { processed: 0 };

    draining = true;
    try {
      var doneList = readJson(DONE_KEY, []);
      if (!Array.isArray(doneList)) doneList = [];
      var doneMap = {};
      doneList.forEach(function (id) { doneMap[id] = 1; });

      var remaining = [];
      var awardedCount = 0;
      var awardedTotalXp = 0;
      var lastGameTitle = '';
      var touchedStudents = [];

      inbox.forEach(function (entry) {
        if (!entry || !entry.id || !entry.studentId) return;
        if (entry.done || doneMap[entry.id]) return;

        var amt = Math.max(1, Math.min(200, Math.round(Number(entry.amount) || 0)));
        var student = store.getStudent ? store.getStudent(entry.studentId) : null;
        if (!student) {
          // Keep entry if store hasn't hydrated this pupil yet (unless >7 days old)
          if (entry.ts && (Date.now() - Number(entry.ts) < 7 * 86400000)) {
            remaining.push(entry);
          }
          return;
        }

        var res = store.giveXP(
          student.id,
          amt,
          entry.reason || 'Classroom Game Reward',
          'Games Collection',
          {
            id: 'tx_' + entry.id,
            sourceId: entry.id,
            type: 'game',
            category: 'positive',
            icon: entry.icon || '🎮',
            classId: entry.classId || student.classId || null
          }
        );

        doneMap[entry.id] = 1;
        doneList.push(entry.id);

        if (res && !res.duplicate) {
          awardedCount++;
          awardedTotalXp += amt;
          lastGameTitle = entry.gameTitle || entry.reason || lastGameTitle;
          touchedStudents.push({ student: student, tx: res.transaction });
        }
      });

      if (doneList.length > MAX_DONE_HISTORY) {
        doneList = doneList.slice(doneList.length - MAX_DONE_HISTORY);
      }

      writeJson(DONE_KEY, doneList);
      writeJson(INBOX_KEY, remaining);

      if (awardedCount > 0) {
        showAwardToast(awardedTotalXp, awardedCount, lastGameTitle);

        // Persist updated students & XP ledger transactions to Supabase Cloud if verified online
        if (root.SchoolCloudSync && (!root.TeacherAuth || root.TeacherAuth.canSyncCloud())) {
          for (var i = 0; i < touchedStudents.length; i++) {
            var item = touchedStudents[i];
            try {
              if (item.tx && root.SchoolCloudSync.saveXPTransaction) {
                await root.SchoolCloudSync.saveXPTransaction(item.tx);
              }
              if (item.student && root.SchoolCloudSync.saveStudent) {
                await root.SchoolCloudSync.saveStudent(item.student);
              }
            } catch (e) {}
          }
        }
      }

      return { processed: awardedCount, totalXp: awardedTotalXp };
    } finally {
      draining = false;
    }
  }

  function scheduleDrain(delayMs) {
    setTimeout(function () { drainInbox().catch(function () {}); }, delayMs || 120);
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('focus', function () { scheduleDrain(80); });
    window.addEventListener('storage', function (ev) {
      if (!ev || ev.key === INBOX_KEY) scheduleDrain(60);
    });
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') scheduleDrain(80);
      });
    }
    window.addEventListener('eaa:teacher-unlocked', function () { scheduleDrain(400); });
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        var bc = new BroadcastChannel('eaa_games_xp');
        bc.onmessage = function () { scheduleDrain(50); };
      } catch (e) {}
    }

    // Initial boot drain after store & cloud settle
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { scheduleDrain(900); });
    } else {
      scheduleDrain(900);
    }
  }

  root.GamesPointsBridge = {
    drain: drainInbox,
    INBOX_KEY: INBOX_KEY
  };
})(typeof window !== 'undefined' ? window : this);
