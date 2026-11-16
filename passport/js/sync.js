/* My Passport — Cloud & Offline Sync Engine
   Hard rules strictly enforced:
   - Pupil devices write ONLY passport-<studentId> in classes table.
   - Teacher page writes ONLY class-passport-sync with optimistic concurrency lock.
   - Real cloud writes are blocked and recorded during testing via _tmp/safe-cdp.js.
*/
(function (root) {
  'use strict';

  var PassportSync = root.PassportSync = root.PassportSync || {};

  var SYNC_ROW_ID = 'class-passport-sync';
  var DEMO_PREFIX = 'eaa_passport_demo_';
  var QUEUE_KEY = 'eaa_passport_offline_queue';

  function getClient() {
    return (root.AdventureSupabase && root.AdventureSupabase.client) ||
           (root.supabase && root.supabase.createClient && root.AdventureSupabase ? root.AdventureSupabase.client : null);
  }

  function parseJsonSafe(str, fallback) {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch (e) { return fallback; }
  }

  /* 1. DEMO SESSION LOADER */
  function loadDemoSession(demoPid) {
    var pupils = (root.PassportData && root.PassportData.DEMO_PUPILS) || {};
    var pid = (demoPid && pupils[demoPid]) ? demoPid : 'demo-p4';
    var template = JSON.parse(JSON.stringify(pupils[pid]));
    var savedRaw = null;
    try { savedRaw = localStorage.getItem(DEMO_PREFIX + pid); } catch (e) {}
    var passportData = parseJsonSafe(savedRaw, null) || template.passport || {
      studentId: pid,
      about: [],
      askMe: [],
      stamp: 's_star',
      updatedAt: new Date().toISOString()
    };

    return Promise.resolve({
      status: 'ok',
      isDemo: true,
      student: template,
      classId: template.classId,
      passport: passportData
    });
  }

  /* 2. RESOLVE REAL PUPIL FROM ISLAND CODE */
  function resolvePupilByCode(code) {
    var c = (code || '').trim().toUpperCase();
    if (!c) {
      return Promise.resolve({ status: 'error', message: 'Please enter your passport code!' });
    }

    var client = getClient();
    if (!client) {
      return loadDemoSession('demo-p4');
    }

    // Read class-island-sync to resolve code -> studentId
    return client
      .from('classes')
      .select('description')
      .eq('id', 'class-island-sync')
      .maybeSingle()
      .then(function (res) {
        if (res.error) throw res.error;
        var syncDoc = parseJsonSafe(res.data && res.data.description, {});
        var codesMap = syncDoc.codes || {};
        var studentId = codesMap[c];
        if (!studentId) {
          return { status: 'not_found', message: "Code '" + c + "' not found. Ask your teacher for your link 🌟" };
        }

        // Fetch student record
        return client
          .from('students')
          .select('id, name, first_name, class_id, xp, monster_profile')
          .eq('id', studentId)
          .maybeSingle()
          .then(function (sRes) {
            if (sRes.error) throw sRes.error;
            var st = sRes.data;
            if (!st) {
              return { status: 'not_found', message: 'Student record not found for this code.' };
            }
            var pupilObj = {
              id: st.id,
              name: st.name,
              firstName: st.first_name || (st.name ? st.name.split(' ')[0] : 'Pupil'),
              classId: st.class_id,
              xp: Number(st.xp) || 0,
              monsterProfile: st.monster_profile || {}
            };

            // Fetch pupil's own passport row
            var rowId = 'passport-' + st.id;
            return client
              .from('classes')
              .select('description, updated_at')
              .eq('id', rowId)
              .maybeSingle()
              .then(function (pRes) {
                var pDoc = parseJsonSafe(pRes.data && pRes.data.description, null);
                if (!pDoc) {
                  pDoc = {
                    studentId: st.id,
                    about: [],
                    askMe: [],
                    stamp: 's_star',
                    updatedAt: new Date().toISOString()
                  };
                }
                return {
                  status: 'ok',
                  isDemo: false,
                  student: pupilObj,
                  classId: pupilObj.classId,
                  passport: pDoc
                };
              });
          });
      })
      .catch(function (err) {
        return { status: 'error', message: err.message || 'Network error connecting to school platform.' };
      });
  }

  /* 3. SAVE PUPIL PASSPORT (Writes ONLY passport-<studentId>) */
  function savePassport(session, passportData) {
    if (!session || !passportData) return Promise.resolve(false);
    passportData.updatedAt = new Date().toISOString();
    session.passport = passportData;

    // Demo Mode: LocalStorage persistence
    if (session.isDemo) {
      try {
        localStorage.setItem(DEMO_PREFIX + session.student.id, JSON.stringify(passportData));
      } catch (e) {}
      return Promise.resolve(true);
    }

    var client = getClient();
    if (!client) {
      queueOfflineSave(session.student.id, passportData);
      return Promise.resolve(true);
    }

    var rowId = 'passport-' + session.student.id;
    var rowPayload = {
      id: rowId,
      archived: true,
      grade: 'System',
      teacher: 'System',
      name: 'Passport ' + (session.student.firstName || session.student.name || session.student.id),
      description: JSON.stringify(passportData)
    };

    return client
      .from('classes')
      .upsert(rowPayload, { onConflict: 'id' })
      .then(function (res) {
        if (res.error) {
          queueOfflineSave(session.student.id, passportData);
          return false;
        }
        return true;
      })
      .catch(function () {
        queueOfflineSave(session.student.id, passportData);
        return false;
      });
  }

  function queueOfflineSave(studentId, passportData) {
    try {
      var q = parseJsonSafe(localStorage.getItem(QUEUE_KEY), []);
      q.push({ studentId: studentId, passport: passportData, time: Date.now() });
      localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-20)));
    } catch (e) {}
  }

  /* 4. READ CLASS GALLERY (Reads class-passport-sync, ONLY approved copies) */
  function readClassGallery(classId) {
    if (!classId) return Promise.resolve({ galleryOn: false, list: [] });

    // Demo Mode gallery fallback
    if (classId === 'class-3a' || classId === 'class-4a') {
      var demoSyncRaw = null;
      try { demoSyncRaw = localStorage.getItem('eaa_passport_demo_sync'); } catch (e) {}
      var syncData = parseJsonSafe(demoSyncRaw, {
        galleryOn: { 'class-3a': true, 'class-4a': true },
        approved: {
          'demo-p3': {
            about: [{ frame: 'fav_animal', pick: 'lion' }, { frame: 'like_hobby', pick: 'football' }],
            askMe: [{ q: 'q_animal', a: { frame: 'fav_animal', pick: 'lion' } }],
            stamp: 's_star',
            at: '2026-10-29T10:00:00.000Z',
            student: { id: 'demo-p3', firstName: 'Leo', classId: 'class-3a', xp: 145, monsterProfile: { stage: 'stage-3-baby-monster', equipped: { body: 'body-amber' } } }
          },
          'demo-p4': {
            about: [{ frame: 'fav_animal', pick: 'dolphin' }, { frame: 'can_action', pick: 'swim_fast' }],
            askMe: [{ q: 'q_animal', a: { frame: 'fav_animal', pick: 'dolphin' } }],
            stamp: 's_rocket',
            at: '2026-10-29T11:00:00.000Z',
            student: { id: 'demo-p4', firstName: 'Maya', classId: 'class-4a', xp: 320, monsterProfile: { stage: 'stage-4-growing-monster', equipped: { body: 'body-aqua' } } }
          },
          'demo-p5': {
            about: [{ frame: 'fav_food', pick: 'pizza' }, { frame: 'like_hobby', pick: 'reading' }],
            askMe: [{ q: 'q_food', a: { frame: 'fav_food', pick: 'pizza' } }],
            stamp: 's_crown',
            at: '2026-10-29T12:00:00.000Z',
            student: { id: 'demo-p5', firstName: 'Sam', classId: 'class-4a', xp: 410, monsterProfile: { stage: 'stage-5-adventurer-monster', equipped: { body: 'body-verdant' } } }
          }
        },
        hidden: {}
      });

      var isGalleryOn = !!(syncData.galleryOn && syncData.galleryOn[classId]);
      var approvedMap = syncData.approved || {};
      var hiddenMap = syncData.hidden || {};

      var list = [];
      Object.keys(approvedMap).forEach(function (sid) {
        if (hiddenMap[sid]) return; // Hidden by teacher
        var item = approvedMap[sid];
        var st = item.student || {};
        if (st.classId === classId) {
          list.push({
            studentId: sid,
            firstName: st.firstName || 'Classmate',
            xp: st.xp || 100,
            monsterProfile: st.monsterProfile || {},
            about: item.about || [],
            askMe: item.askMe || [],
            stamp: item.stamp || 's_star',
            approvedAt: item.at
          });
        }
      });
      return Promise.resolve({ galleryOn: isGalleryOn, list: list });
    }

    var client = getClient();
    if (!client) {
      return Promise.resolve({ galleryOn: false, list: [] });
    }

    return client
      .from('classes')
      .select('description')
      .eq('id', SYNC_ROW_ID)
      .maybeSingle()
      .then(function (res) {
        if (res.error) throw res.error;
        var syncDoc = parseJsonSafe(res.data && res.data.description, {});
        var isGalleryOn = !!(syncDoc.galleryOn && syncDoc.galleryOn[classId]);
        var approvedMap = syncDoc.approved || {};
        var hiddenMap = syncDoc.hidden || {};

        var list = [];
        Object.keys(approvedMap).forEach(function (sid) {
          if (hiddenMap[sid]) return; // Hidden
          var item = approvedMap[sid];
          var st = item.student || {};
          if (st.classId === classId) {
            list.push({
              studentId: sid,
              firstName: st.firstName || 'Classmate',
              xp: st.xp || 100,
              monsterProfile: st.monsterProfile || {},
              about: item.about || [],
              askMe: item.askMe || [],
              stamp: item.stamp || 's_star',
              approvedAt: item.at
            });
          }
        });
        return { galleryOn: isGalleryOn, list: list };
      })
      .catch(function () {
        return { galleryOn: false, list: [] };
      });
  }

  /* 5. TEACHER OPTIMISTIC SAVE (Writes ONLY class-passport-sync with retry) */
  function saveTeacherSync(mutatorFn, retryCount) {
    var maxRetries = typeof retryCount === 'number' ? retryCount : 3;

    // Maintain local demo sync state
    var demoRaw = null;
    try { demoRaw = localStorage.getItem('eaa_passport_demo_sync'); } catch (e) {}
    var currentDemoDoc = parseJsonSafe(demoRaw, { approved: {}, hidden: {}, galleryOn: {}, updatedAt: new Date().toISOString() });
    mutatorFn(currentDemoDoc);
    currentDemoDoc.updatedAt = new Date().toISOString();
    try { localStorage.setItem('eaa_passport_demo_sync', JSON.stringify(currentDemoDoc)); } catch (e) {}

    var client = getClient();
    if (!client) {
      return Promise.resolve(currentDemoDoc);
    }

    function attempt(retriesLeft) {
      return client
        .from('classes')
        .select('id, description, updated_at')
        .eq('id', SYNC_ROW_ID)
        .maybeSingle()
        .then(function (res) {
          if (res.error) throw res.error;
          var row = res.data;
          var doc = parseJsonSafe(row && row.description, currentDemoDoc);
          var readUpdatedAt = row ? row.updated_at : null;

          mutatorFn(doc);
          doc.updatedAt = new Date().toISOString();

          var savePromise;
          if (!row) {
            savePromise = client
              .from('classes')
              .insert({
                id: SYNC_ROW_ID,
                archived: true,
                grade: 'System',
                teacher: 'System',
                name: 'Passport Sync',
                description: JSON.stringify(doc)
              });
          } else {
            savePromise = client
              .from('classes')
              .update({
                description: JSON.stringify(doc)
              })
              .eq('id', SYNC_ROW_ID)
              .eq('updated_at', readUpdatedAt);
          }

          return savePromise.then(function (upRes) {
            if (upRes.error) {
              if (retriesLeft > 0) return attempt(retriesLeft - 1);
              throw upRes.error;
            }
            return doc;
          });
        })
        .catch(function () {
          return currentDemoDoc;
        });
    }

    return attempt(maxRetries);
  }

  /* 6. TEACHER READ ALL PASSPORTS FOR CLASS */
  function readClassPupilPassports(classId, forceDemo) {
    var isDemoMode = forceDemo ||
      (typeof location !== 'undefined' && location.search && location.search.indexOf('demo') !== -1) ||
      (classId === 'class-3a' || classId === 'class-4a');
    var demoPupils = (root.PassportData && root.PassportData.DEMO_PUPILS) || {};

    function getDemoList() {
      var list = [];
      Object.keys(demoPupils).forEach(function (k) {
        var dp = demoPupils[k];
        if (dp.classId === classId || !classId) {
          var sRaw = null;
          try { sRaw = localStorage.getItem(DEMO_PREFIX + dp.id); } catch (e) {}
          list.push({ student: dp, passport: parseJsonSafe(sRaw, dp.passport) });
        }
      });
      return list;
    }

    if (isDemoMode) {
      return Promise.resolve(getDemoList());
    }

    var client = getClient();
    if (!client) {
      return Promise.resolve(getDemoList());
    }

    return client
      .from('students')
      .select('id, name, first_name, class_id, xp, monster_profile')
      .eq('class_id', classId)
      .then(function (sRes) {
        if (sRes.error) throw sRes.error;
        var students = sRes.data || [];
        if (students.length === 0) {
          // Fallback to demo class members if class has 0 students in cloud
          var demoPupils = (root.PassportData && root.PassportData.DEMO_PUPILS) || {};
          var dList = [];
          Object.keys(demoPupils).forEach(function (k) {
            var dp = demoPupils[k];
            if (dp.classId === classId || !classId) {
              var sRaw = null;
              try { sRaw = localStorage.getItem(DEMO_PREFIX + dp.id); } catch (e) {}
              dList.push({ student: dp, passport: parseJsonSafe(sRaw, dp.passport) });
            }
          });
          return dList;
        }

        return client
          .from('classes')
          .select('id, description')
          .like('id', 'passport-%')
          .then(function (pRes) {
            if (pRes.error) throw pRes.error;
            var rows = pRes.data || [];
            var rowMap = {};
            rows.forEach(function (r) { rowMap[r.id] = parseJsonSafe(r.description, null); });

            return students.map(function (st) {
              var pDoc = rowMap['passport-' + st.id] || {
                studentId: st.id,
                about: [],
                askMe: [],
                stamp: 's_star',
                updatedAt: ''
              };
              return {
                student: {
                  id: st.id,
                  name: st.name,
                  firstName: st.first_name || (st.name ? st.name.split(' ')[0] : 'Pupil'),
                  classId: st.class_id,
                  xp: Number(st.xp) || 0,
                  monsterProfile: st.monster_profile || {}
                },
                passport: pDoc
              };
            });
          });
      })
      .catch(function () {
        var demoPupils = (root.PassportData && root.PassportData.DEMO_PUPILS) || {};
        var dList = [];
        Object.keys(demoPupils).forEach(function (k) {
          var dp = demoPupils[k];
          if (dp.classId === classId || !classId) {
            dList.push({ student: dp, passport: dp.passport });
          }
        });
        return dList;
      });
  }

  /* 7. TEACHER READ SYNC ROW */
  function readTeacherSync() {
    var demoRaw = null;
    try { demoRaw = localStorage.getItem('eaa_passport_demo_sync'); } catch (e) {}
    var currentDemoDoc = parseJsonSafe(demoRaw, { approved: {}, hidden: {}, galleryOn: {}, updatedAt: new Date().toISOString() });

    var client = getClient();
    if (!client) {
      return Promise.resolve(currentDemoDoc);
    }
    return client
      .from('classes')
      .select('description')
      .eq('id', SYNC_ROW_ID)
      .maybeSingle()
      .then(function (res) {
        if (res.error) return currentDemoDoc;
        var cloudDoc = parseJsonSafe(res.data && res.data.description, null);
        if (cloudDoc) {
          return Object.assign({}, currentDemoDoc, cloudDoc);
        }
        return currentDemoDoc;
      })
      .catch(function () {
        return currentDemoDoc;
      });
  }

  /* ==========================================================================
     STEP 3: OUTBOX, KIND NOTES, WAVES & LIMIT ENFORCEMENT
     ========================================================================== */

  /* 8. SEND KIND NOTE (Writes ONLY sender's passport row) */
  function canSendNote(session, targetStudentId) {
    if (!session || !session.passport || !targetStudentId) {
      return { ok: false, reason: 'Invalid passport session.' };
    }
    if (session.student && session.student.id === targetStudentId) {
      return { ok: false, reason: 'You cannot send a note to yourself!' };
    }

    var sent = session.passport.sent || [];
    var todayStr = new Date().toISOString().slice(0, 10);

    var notesToday = sent.filter(function (x) {
      return x && x.kind === 'note' && (x.at || '').slice(0, 10) === todayStr;
    });

    if (notesToday.length >= 3) {
      return { ok: false, reason: 'You have sent 3 kind notes today! Come back tomorrow 🌟' };
    }

    var toPeerToday = notesToday.filter(function (x) {
      return x.to === targetStudentId;
    });

    if (toPeerToday.length >= 1) {
      return { ok: false, reason: 'You already sent a kind note to this classmate today! 💌' };
    }

    return { ok: true };
  }

  function sendNote(session, targetStudentId, parts, senderName) {
    var check = canSendNote(session, targetStudentId);
    if (!check.ok) {
      return Promise.reject(new Error(check.reason));
    }

    session.passport.sent = session.passport.sent || [];
    var noteObj = {
      to: targetStudentId,
      kind: 'note',
      parts: parts,
      senderName: senderName || (session.student ? session.student.firstName : 'Friend'),
      at: new Date().toISOString()
    };

    // Prepend to outbox, keep maximum 60
    session.passport.sent.unshift(noteObj);
    if (session.passport.sent.length > 60) {
      session.passport.sent = session.passport.sent.slice(0, 60);
    }

    return savePassport(session, session.passport).then(function (ok) {
      if (!ok) throw new Error('Could not save note to your passport outbox.');
      return noteObj;
    });
  }

  /* 9. SEND MONSTER WAVE (Writes ONLY sender's passport row) */
  function canSendWave(session, targetStudentId) {
    if (!session || !session.passport || !targetStudentId) {
      return { ok: false, reason: 'Invalid passport session.' };
    }
    if (session.student && session.student.id === targetStudentId) {
      return { ok: false, reason: 'You cannot wave to yourself!' };
    }

    var sent = session.passport.sent || [];
    var todayStr = new Date().toISOString().slice(0, 10);

    var wavesToday = sent.filter(function (x) {
      return x && x.kind === 'wave' && (x.at || '').slice(0, 10) === todayStr;
    });

    if (wavesToday.length >= 5) {
      return { ok: false, reason: 'You have sent 5 monster waves today! Come back tomorrow 👋' };
    }

    return { ok: true };
  }

  function sendWave(session, targetStudentId, waveType, senderName) {
    var check = canSendWave(session, targetStudentId);
    if (!check.ok) {
      return Promise.reject(new Error(check.reason));
    }

    session.passport.sent = session.passport.sent || [];
    var waveObj = {
      to: targetStudentId,
      kind: 'wave',
      waveType: waveType || 'wave',
      senderName: senderName || (session.student ? session.student.firstName : 'Friend'),
      at: new Date().toISOString()
    };

    session.passport.sent.unshift(waveObj);
    if (session.passport.sent.length > 60) {
      session.passport.sent = session.passport.sent.slice(0, 60);
    }

    return savePassport(session, session.passport).then(function (ok) {
      if (!ok) throw new Error('Could not save wave to your passport outbox.');
      return waveObj;
    });
  }

  /* 10. HIDE RECEIVED NOTE BY PUPIL */
  function hideReceivedNote(session, noteKey) {
    if (!session || !session.passport || !noteKey) return Promise.resolve(false);
    session.passport.hideIn = session.passport.hideIn || [];
    if (session.passport.hideIn.indexOf(noteKey) === -1) {
      session.passport.hideIn.push(noteKey);
    }
    return savePassport(session, session.passport);
  }

  /* 11. COLLECT RECEIVED ITEMS FOR PUPIL
     Scans classmates' sent arrays, enforces 14-day limit, daily limits,
     filters teacher hiddenNotes & pupil hideIn, and adds Captain Pip if 0 in 7 days.
  */
  function collectReceivedItems(pupilId, classId, pupilPassport) {
    var isDemo = (pupilId && pupilId.indexOf('demo-') === 0);
    return Promise.all([
      readTeacherSync(),
      readClassPupilPassports(classId, isDemo)
    ]).then(function (res) {
      var sync = res[0] || {};
      var allPassports = res[1] || [];

      var isGalleryOn = !!(sync.galleryOn && sync.galleryOn[classId]);
      var isPupilHidden = !!(sync.hidden && sync.hidden[pupilId]);

      if (!isGalleryOn || isPupilHidden) {
        return { notes: [], waves: [], pipNote: null };
      }

      var teacherHiddenNotes = sync.hiddenNotes || {};
      var shoutoutsMap = sync.shoutouts || {};
      var approvedMap = sync.approved || {};
      var hiddenPupilsMap = sync.hidden || {};

      var pPass = pupilPassport || {};
      var pupilHiddenList = pPass.hideIn || [];

      var nowMs = Date.now();
      var maxAgeMs = 14 * 24 * 60 * 60 * 1000; // 14 days
      var quietAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days

      var collectedNotes = [];
      var collectedWaves = [];
      var recent7DayCount = 0;

      // Group classmates' sent items and filter
      allPassports.forEach(function (classmate) {
        var senderId = classmate.student ? classmate.student.id : '';
        if (!senderId || senderId === pupilId) return; // Ignore own items

        // Sender must be in same class, approved, and not hidden by teacher
        if (!approvedMap[senderId] || hiddenPupilsMap[senderId]) return;

        var senderPassport = classmate.passport || {};
        var sentItems = senderPassport.sent || [];

        // Sort chronological to enforce daily limits accurately
        var chronoSent = sentItems.slice().sort(function (a, b) {
          return new Date(a.at || 0) - new Date(b.at || 0);
        });

        // Enforce sender daily limits: max 3 notes/day, max 1 note to same peer/day, max 5 waves/day
        var dayCounts = {}; // { 'YYYY-MM-DD': { notes: N, waves: N, noteToPeer: { peerId: N } } }

        chronoSent.forEach(function (item) {
          if (!item || !item.at) return;
          var itemTime = new Date(item.at).getTime();
          if (isNaN(itemTime)) return;
          if (nowMs - itemTime > maxAgeMs) return; // Older than 14 days

          var day = item.at.slice(0, 10);
          dayCounts[day] = dayCounts[day] || { notes: 0, waves: 0, noteToPeer: {} };
          var dc = dayCounts[day];

          var noteKey = senderId + '|' + item.at;

          if (item.kind === 'note') {
            dc.notes++;
            dc.noteToPeer[item.to] = (dc.noteToPeer[item.to] || 0) + 1;

            // Enforce limit: 4th note or 2nd note to same peer ignored
            if (dc.notes > 3 || dc.noteToPeer[item.to] > 1) return;

            // Check if addressed to our pupil
            if (item.to === pupilId) {
              if (teacherHiddenNotes[noteKey]) return; // Hidden by teacher
              if (pupilHiddenList.indexOf(noteKey) !== -1) return; // Hidden by pupil

              if (nowMs - itemTime <= quietAgeMs) {
                recent7DayCount++;
              }

              var senderFirst = (classmate.student && classmate.student.firstName) || item.senderName || 'Classmate';
              var noteText = (root.PassportData && root.PassportData.renderNoteText) ?
                root.PassportData.renderNoteText(item.parts, pPass.firstName || 'friend', senderFirst) :
                'Kind note from ' + senderFirst;

              collectedNotes.push({
                key: noteKey,
                senderId: senderId,
                senderName: senderFirst,
                senderMonster: classmate.student && classmate.student.monsterProfile,
                parts: item.parts,
                text: noteText,
                at: item.at,
                isShoutout: !!shoutoutsMap[noteKey]
              });
            }
          } else if (item.kind === 'wave') {
            dc.waves++;
            if (dc.waves > 5) return; // Enforce max 5 waves/day

            if (item.to === pupilId) {
              if (nowMs - itemTime <= quietAgeMs) {
                recent7DayCount++;
              }

              var sName = (classmate.student && classmate.student.firstName) || item.senderName || 'Classmate';
              collectedWaves.push({
                key: noteKey,
                senderId: senderId,
                senderName: sName,
                senderMonster: classmate.student && classmate.student.monsterProfile,
                waveType: item.waveType || 'wave',
                at: item.at
              });
            }
          }
        });
      });

      // Sort newest first
      collectedNotes.sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
      collectedWaves.sort(function (a, b) { return new Date(b.at) - new Date(a.at); });

      // Captain Pip: if received 0 in the last 7 days, inject encouraging note
      var pipNote = null;
      if (recent7DayCount === 0) {
        var pipText = (root.PassportData && root.PassportData.PIP_NOTES && root.PassportData.PIP_NOTES[0]) ||
                      'Captain Pip says: You are a star explorer! Keep shining bright! 🦜⭐';
        pipNote = {
          key: 'pip-notice',
          senderId: 'pip',
          senderName: 'Captain Pip',
          isPip: true,
          text: pipText,
          at: new Date().toISOString()
        };
        collectedNotes.unshift(pipNote);
      }

      return {
        notes: collectedNotes,
        waves: collectedWaves,
        pipNote: pipNote,
        recent7DayCount: recent7DayCount
      };
    });
  }

  /* 12. TEACHER TOGGLES FOR NOTES */
  function toggleTeacherHideNote(noteKey) {
    return saveTeacherSync(function (doc) {
      doc.hiddenNotes = doc.hiddenNotes || {};
      doc.hiddenNotes[noteKey] = !doc.hiddenNotes[noteKey];
    });
  }

  function toggleShoutout(noteKey) {
    return saveTeacherSync(function (doc) {
      doc.shoutouts = doc.shoutouts || {};
      doc.shoutouts[noteKey] = !doc.shoutouts[noteKey];
    });
  }

  /* 13. TEACHER QUERIES: QUIET PUPILS ("Got nothing this week") */
  function readQuietPupils(classId) {
    return Promise.all([
      readTeacherSync(),
      readClassPupilPassports(classId)
    ]).then(function (res) {
      var sync = res[0] || {};
      var pupils = res[1] || [];
      var approved = sync.approved || {};
      var hidden = sync.hidden || {};

      var nowMs = Date.now();
      var quietAgeMs = 7 * 24 * 60 * 60 * 1000;

      // Filter only approved, non-hidden pupils
      var activePupils = pupils.filter(function (p) {
        var sid = p.student ? p.student.id : '';
        return approved[sid] && !hidden[sid];
      });

      var quietList = [];

      activePupils.forEach(function (target) {
        var targetId = target.student.id;
        var receivedCount = 0;

        pupils.forEach(function (sender) {
          if (!sender.student || sender.student.id === targetId) return;
          var sent = (sender.passport && sender.passport.sent) || [];
          sent.forEach(function (it) {
            if (it && it.to === targetId && it.at) {
              var t = new Date(it.at).getTime();
              if (nowMs - t <= quietAgeMs) {
                receivedCount++;
              }
            }
          });
        });

        if (receivedCount === 0) {
          quietList.push({
            student: target.student,
            passport: target.passport,
            daysQuiet: 7
          });
        }
      });

      return quietList;
    });
  }

  /* 14. TEACHER QUERIES: HIDDEN BY PUPILS */
  function readHiddenByPupils(classId) {
    return readClassPupilPassports(classId).then(function (pupils) {
      var list = [];
      pupils.forEach(function (p) {
        var hiddenKeys = (p.passport && p.passport.hideIn) || [];
        if (hiddenKeys.length > 0) {
          list.push({
            student: p.student,
            hiddenKeys: hiddenKeys
          });
        }
      });
      return list;
    });
  }

  /* 15. TEACHER QUERIES: ALL CLASS NOTES FOR MODERATION */
  function readClassNotes(classId) {
    return Promise.all([
      readTeacherSync(),
      readClassPupilPassports(classId)
    ]).then(function (res) {
      var sync = res[0] || {};
      var pupils = res[1] || [];
      var hiddenNotes = sync.hiddenNotes || {};
      var shoutouts = sync.shoutouts || {};

      var pupilMap = {};
      pupils.forEach(function (p) {
        if (p.student) pupilMap[p.student.id] = p.student;
      });

      var nowMs = Date.now();
      var maxAgeMs = 14 * 24 * 60 * 60 * 1000;
      var notesList = [];

      pupils.forEach(function (sender) {
        var sid = sender.student ? sender.student.id : '';
        var sent = (sender.passport && sender.passport.sent) || [];
        sent.forEach(function (item) {
          if (!item || item.kind !== 'note' || !item.at) return;
          var itemTime = new Date(item.at).getTime();
          if (nowMs - itemTime > maxAgeMs) return;

          var noteKey = sid + '|' + item.at;
          var targetStudent = pupilMap[item.to] || { firstName: 'Classmate', name: 'Classmate' };
          var senderStudent = sender.student || { firstName: item.senderName, name: item.senderName };

          var noteText = (root.PassportData && root.PassportData.renderNoteText) ?
            root.PassportData.renderNoteText(item.parts, targetStudent.firstName || targetStudent.name, senderStudent.firstName || senderStudent.name) :
            'Kind note';

          notesList.push({
            key: noteKey,
            senderId: sid,
            sender: senderStudent,
            targetId: item.to,
            target: targetStudent,
            text: noteText,
            at: item.at,
            isHidden: !!hiddenNotes[noteKey],
            isShoutout: !!shoutouts[noteKey]
          });
        });
      });

      notesList.sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
      return notesList;
    });
  }

  PassportSync.SYNC_ROW_ID = SYNC_ROW_ID;
  PassportSync.loadDemoSession = loadDemoSession;
  PassportSync.resolvePupilByCode = resolvePupilByCode;
  PassportSync.savePassport = savePassport;
  PassportSync.readClassGallery = readClassGallery;
  PassportSync.saveTeacherSync = saveTeacherSync;
  PassportSync.readClassPupilPassports = readClassPupilPassports;
  PassportSync.readTeacherSync = readTeacherSync;
  PassportSync.canSendNote = canSendNote;
  PassportSync.sendNote = sendNote;
  PassportSync.canSendWave = canSendWave;
  PassportSync.sendWave = sendWave;
  PassportSync.hideReceivedNote = hideReceivedNote;
  PassportSync.collectReceivedItems = collectReceivedItems;
  PassportSync.toggleTeacherHideNote = toggleTeacherHideNote;
  PassportSync.toggleShoutout = toggleShoutout;
  PassportSync.readQuietPupils = readQuietPupils;
  PassportSync.readHiddenByPupils = readHiddenByPupils;
  PassportSync.readClassNotes = readClassNotes;

})(typeof window !== 'undefined' ? window : this);
