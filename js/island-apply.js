/* Practice Island — Platform XP & Monster Look Auto-Applier (js/island-apply.js)
   Runs only on the teacher platform after the store has loaded its data and only when online
   (~20s after start, then every 3 minutes, or on demand via window.IslandApply.run()).
   Reads class-island-sync and island-* rows from classes, writes updated applied/lookApplied
   to class-island-sync FIRST, and only if that save succeeds calls schoolStore.awardXP(...)
   once per pupil and updates monsterProfile.equipped for valid unlocked items. */
(function (root) {
  'use strict';

  var LOCK_KEY = 'eaa_island_apply_lock';
  var LOCK_TTL_MS = 120000; /* 2 minutes */
  var START_DELAY_MS = 20000; /* ~20 seconds after start */
  var INTERVAL_MS = 180000; /* every 3 minutes */
  var inFlight = false;

  function getStore() {
    return root.schoolStore || root.store || null;
  }

  function getClient() {
    return root.AdventureSupabase && root.AdventureSupabase.client ? root.AdventureSupabase.client : null;
  }

  function todayStr() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function isValidRecentDate(dateStr, today) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || ''))) return false;
    if (dateStr > today) return false;
    var p1 = dateStr.split('-').map(Number);
    var p2 = today.split('-').map(Number);
    var dt1 = Date.UTC(p1[0], (p1[1] || 1) - 1, p1[2] || 1);
    var dt2 = Date.UTC(p2[0], (p2[1] || 1) - 1, p2[2] || 1);
    var diffDays = (dt2 - dt1) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 14;
  }

  function parseJsonSafe(raw, fallback) {
    if (!raw) return fallback;
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function firstNameOf(student) {
    if (!student) return 'Pupil';
    return String(student.firstName || student.first_name || student.name || student.id || 'Pupil').trim().split(/\s+/)[0];
  }

  /* Validate pupil's requested look:
     Only allow slots whose item is in the pupil's unlockedItems (or is a free item)
     AND whose unlockLevel is not above the pupil's level. Never unlock, buy or create items. */
  function validatePupilLook(store, student, rawLook) {
    if (!rawLook || typeof rawLook !== 'object' || !student) return null;
    var studentId = student.id;
    var profile = (store.getMonsterProfile && store.getMonsterProfile(studentId)) || student.monsterProfile || {};
    var mState = null;
    try { mState = store.calculateMonsterState ? store.calculateMonsterState(studentId) : null; } catch (e) {}

    var pupilLevel = (mState && Number(mState.currentLevel)) || Number(student.level) || 1;
    var unlockedArr = Array.isArray(profile.unlockedItems) ? profile.unlockedItems : [];
    var allItems = (store.getMonsterItems && store.getMonsterItems(null, true)) || [];
    var itemById = {};
    allItems.forEach(function (it) { if (it && it.id) itemById[it.id] = it; });

    var validEquipped = {};
    var hasAnyValidSlot = false;

    Object.keys(rawLook).forEach(function (slot) {
      var itemId = String(rawLook[slot] || '').trim();
      if (!itemId || itemId === 'none') {
        validEquipped[slot] = 'none';
        hasAnyValidSlot = true;
        return;
      }
      var it = itemById[itemId];
      if (!it) return; /* Never create unknown items */

      var reqLvl = Number(it.unlockLevel != null ? it.unlockLevel : (it.unlockRequirement && it.unlockRequirement.level)) || 1;
      if (reqLvl > pupilLevel) return; /* Locked by level */

      var isOwned = unlockedArr.indexOf(itemId) !== -1;
      var isStoreItem = it.unlockType === 'store' || Number(it.price) > 0 || Number(it.cost) > 0;
      var isFreeItem = !isStoreItem && (it.unlockType === 'default' || it.unlockType === 'level' || !it.unlockType);

      if (isOwned || isFreeItem) {
        validEquipped[slot] = itemId;
        hasAnyValidSlot = true;
      }
    });

    return hasAnyValidSlot ? validEquipped : null;
  }

  async function run(opts) {
    var options = opts || {};
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { ok: false, reason: 'offline' };
    }

    var store = getStore();
    var sb = getClient();
    if (!store || !sb) {
      return { ok: false, reason: 'store_or_supabase_not_ready' };
    }

    var allStudents = (store.getStudents && store.getStudents(null, true)) || [];
    if (!allStudents.length) {
      return { ok: false, reason: 'store_empty' };
    }

    /* 1. In-process & multi-tab localStorage lock (< 2 minutes) so two runs never overlap */
    if (inFlight) {
      return { ok: false, reason: 'locked_in_flight' };
    }
    if (!options.force) {
      try {
        var rawLock = localStorage.getItem(LOCK_KEY);
        var lastLock = Number(rawLock) || 0;
        if (lastLock && (Date.now() - lastLock) < LOCK_TTL_MS) {
          return { ok: false, reason: 'locked_by_other_tab' };
        }
      } catch (e) {}
    }

    inFlight = true;
    try {
      localStorage.setItem(LOCK_KEY, String(Date.now()));
    } catch (e) {}

    try {
      /* 2. Read class-island-sync and all rows whose id starts with island- */
      var syncRes = await sb.from('classes').select('id,description,updated_at').eq('id', 'class-island-sync').maybeSingle();
      var syncStamp = syncRes && syncRes.data ? syncRes.data.updated_at : null;   /* used to make sure nobody changed the row before we save */
      if (syncRes && syncRes.error) {
        return { ok: false, error: syncRes.error };
      }
      var syncDoc = parseJsonSafe(syncRes && syncRes.data && syncRes.data.description, null) || {
        codes: {},
        star: {},
        cap: 30,
        starCap: 45,
        applied: {},
        lookApplied: {}
      };
      if (!syncDoc.applied || typeof syncDoc.applied !== 'object') syncDoc.applied = {};
      if (!syncDoc.lookApplied || typeof syncDoc.lookApplied !== 'object') syncDoc.lookApplied = {};

      var rowsRes = await sb.from('classes').select('id,description').like('id', 'island-%');
      if (rowsRes && rowsRes.error) {
        return { ok: false, error: rowsRes.error };
      }
      var rows = (rowsRes && Array.isArray(rowsRes.data)) ? rowsRes.data : [];
      if (!rows.length) {
        return { ok: true, appliedCount: 0, totalXP: 0, looksCount: 0 };
      }

      var today = todayStr();
      var pendingXP = {};
      var pendingLooks = {};
      var syncDirty = false;

      /* 3. Process each pupil row */
      rows.forEach(function (row) {
        if (!row || !row.id || row.id === 'class-island-sync') return;
        var pDoc = parseJsonSafe(row.description, null);
        if (!pDoc) return;

        var studentId = String(pDoc.studentId || String(row.id).replace(/^island-/, '')).trim();
        if (!studentId) return;

        /* Skip if pupil does not exist in store or is archived */
        var student = store.getStudent ? store.getStudent(studentId) : null;
        if (!student || student.archived === true) return;

        var isStar = !!(syncDoc.star && syncDoc.star[studentId]);
        var cap = Math.floor(Number(syncDoc.cap)) || 30;
        var starCap = Math.floor(Number(syncDoc.starCap)) || 45;
        var limit = isStar ? starCap : cap;

        if (!syncDoc.applied[studentId] || typeof syncDoc.applied[studentId] !== 'object') {
          syncDoc.applied[studentId] = {};
        }

        var daysMap = (pDoc.days && typeof pDoc.days === 'object') ? pDoc.days : {};
        Object.keys(daysMap).forEach(function (dateStr) {
          if (!isValidRecentDate(dateStr, today)) return;
          var dayObj = daysMap[dateStr];
          var rawXP = Math.floor(Number(dayObj && dayObj.xp));
          if (!Number.isFinite(rawXP) || rawXP <= 0) return;

          var earned = Math.min(rawXP, limit);
          var already = Math.max(0, Math.floor(Number(syncDoc.applied[studentId][dateStr]) || 0));
          var add = Math.floor(earned - already);

          if (Number.isInteger(add) && add > 0) {
            syncDoc.applied[studentId][dateStr] = earned;
            syncDirty = true;
            if (!pendingXP[studentId]) {
              pendingXP[studentId] = { student: student, total: 0, logs: [] };
            }
            pendingXP[studentId].total += add;
            pendingXP[studentId].logs.push({ date: dateStr, add: add });
          }
        });

        /* 5. Look requests: if lookAt is newer than lookApplied[id] */
        var lookAt = String(pDoc.lookAt || '');
        var prevLookAt = String(syncDoc.lookApplied[studentId] || '');
        if (pDoc.look && typeof pDoc.look === 'object' && lookAt && lookAt > prevLookAt) {
          var validEq = validatePupilLook(store, student, pDoc.look);
          syncDoc.lookApplied[studentId] = lookAt;
          syncDirty = true;
          if (validEq) {
            pendingLooks[studentId] = { student: student, equipped: validEq };
          }
        }
      });

      if (!syncDirty) {
        return { ok: true, appliedCount: 0, totalXP: 0, looksCount: 0 };
      }

      /* 4. Write the new applied & lookApplied values to class-island-sync FIRST */
      /* Save only if the row is still exactly as we read it (another computer or the teacher page may have saved in between).
         If it changed, nothing is awarded now and the next run starts again from the new row: XP can never be added twice. */
      var nowIso = new Date().toISOString();
      syncDoc.updatedAt = nowIso;
      var row = { description: JSON.stringify(syncDoc), updated_at: nowIso };
      var upRes = syncStamp
        ? await sb.from('classes').update(row).eq('id', 'class-island-sync').eq('updated_at', syncStamp).select('id')
        : await sb.from('classes').insert(Object.assign({ id: 'class-island-sync', name: 'Island Sync', grade: 'System', teacher: 'System', archived: true }, row)).select('id');

      if (!upRes || upRes.error || !Array.isArray(upRes.data) || !upRes.data.length) {
        console.warn('[Island] class-island-sync changed or could not be saved; awarding nothing and will retry next time.', upRes && upRes.error);
        return { ok: false, reason: 'changed_meanwhile', error: (upRes && upRes.error) || null };
      }

      /* Only after class-island-sync save succeeds: award XP once per pupil & apply valid looks */
      var appliedStudents = 0;
      var grandTotalXP = 0;

      Object.keys(pendingXP).forEach(function (studentId) {
        var item = pendingXP[studentId];
        var total = Math.floor(Number(item && item.total));
        if (Number.isInteger(total) && total > 0 && !Number.isNaN(total) && typeof store.awardXP === 'function') {
          store.awardXP({
            studentId: studentId,
            amount: total,
            type: 'island',
            reason: 'Practice Island'
          });
          appliedStudents++;
          grandTotalXP += total;
          item.logs.forEach(function (lg) {
            console.log('[Island] +' + lg.add + ' XP ' + firstNameOf(item.student) + ' (' + lg.date + ')');
          });
        }
      });

      var appliedLooks = 0;
      Object.keys(pendingLooks).forEach(function (studentId) {
        var lk = pendingLooks[studentId];
        if (lk && lk.equipped && typeof store.updateMonsterProfile === 'function') {
          store.updateMonsterProfile(studentId, { equipped: lk.equipped });
          appliedLooks++;
          console.log('[Island] new look ' + firstNameOf(lk.student));
        }
      });

      return {
        ok: true,
        appliedCount: appliedStudents,
        totalXP: grandTotalXP,
        looksCount: appliedLooks
      };
    } catch (err) {
      console.warn('[Island] Error during IslandApply.run:', err);
      return { ok: false, error: err };
    } finally {
      inFlight = false;
      try { localStorage.removeItem(LOCK_KEY); } catch (e) {}
    }
  }

  root.IslandApply = {
    run: run,
    todayStr: todayStr
  };

  /* Schedule only on the teacher platform (~20s after start, then every 3 minutes) */
  if (typeof window !== 'undefined' && !/\/island\//i.test(window.location.pathname || '')) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        run();
      }, START_DELAY_MS);
      setInterval(function () {
        run();
      }, INTERVAL_MS);
    });
  }

})(typeof window !== 'undefined' ? window : this);
