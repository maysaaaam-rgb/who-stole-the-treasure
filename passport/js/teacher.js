/* My Passport — Teacher Studio Controller
   Provides:
   - Platform teacher lock enforcement
   - Waiting list queue ("Waiting for you (N)")
   - One-tap pupil approval ("✓ Approve" / "✕ Not now")
   - "✓ Approve all" with confirmation
   - Pupil hide toggle (hidden[studentId])
   - Class gallery on/off toggle (galleryOn[classId])
   - Concurrency-safe optimistic saving of class-passport-sync
*/
(function (root) {
  'use strict';

  var PassportTeacher = root.PassportTeacher = root.PassportTeacher || {};

  var CLASSES = [
    { id: 'class-4a', name: 'Grade 4-A' },
    { id: 'class-4b', name: 'Grade 4-B' },
    { id: 'class-3a', name: 'Grade 3-A' },
    { id: 'class-3b', name: 'Grade 3-B' }
  ];

  var state = {
    currentClassId: 'class-4a',
    syncDoc: { approved: {}, hidden: {}, galleryOn: {}, hiddenNotes: {}, shoutouts: {}, updatedAt: '' },
    pupils: [], // [{ student, passport }]
    quietPupils: [],
    classNotes: [],
    hiddenByPupils: []
  };

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderMonsterSvg(prof, size) {
    var renderer = root.MonsterRenderer;
    if (renderer && typeof renderer.renderMonsterSVG === 'function') {
      var p = prof || {};
      return renderer.renderMonsterSVG({
        stage: p.stage || 'stage-3-baby-monster',
        equipped: p.equipped || {},
        size: size || 60
      });
    }
    return '<div style="font-size:32px">👾</div>';
  }

  /* 1. LOCK / UNLOCK (Unified with js/teacher-auth.js — static PIN retired) */
  var studioInitialized = false;

  function unlock() {
    if (root.TeacherAuth && typeof root.TeacherAuth.isUnlocked === 'function' && root.TeacherAuth.isUnlocked()) {
      document.documentElement.classList.remove('platform-locked');
      if (!studioInitialized) {
        studioInitialized = true;
        initStudio();
      }
      return;
    }
    location.replace('../index.html?next=passport/teacher.html');
  }

  function relock() {
    if (root.TeacherAuth && typeof root.TeacherAuth.lock === 'function') {
      root.TeacherAuth.lock();
      return;
    }
    document.documentElement.classList.add('platform-locked');
    location.replace('../index.html?next=passport/teacher.html');
  }

  root.addEventListener('eaa:teacher-unlocked', function () {
    if (!studioInitialized) {
      studioInitialized = true;
      initStudio();
    }
  });
  if (root.TeacherAuth && root.TeacherAuth.ready) {
    root.TeacherAuth.ready.then(function () {
      if (root.TeacherAuth.isUnlocked() && !studioInitialized) {
        studioInitialized = true;
        initStudio();
      }
    });
  }

  /* 2. INITIALIZE STUDIO */
  function initStudio() {
    renderClassTabs();
    loadClassData(state.currentClassId);
  }

  function renderClassTabs() {
    var container = document.getElementById('tch-class-tabs');
    if (!container) return;
    container.innerHTML = CLASSES.map(function (c) {
      var isActive = c.id === state.currentClassId;
      return (
        '<button type="button" class="pass-btn' + (isActive ? ' cyan' : '') + '" style="min-height:40px;padding:6px 14px;font-size:0.92rem" onclick="PassportTeacher.switchClass(\'' + c.id + '\')">' +
          c.name +
        '</button>'
      );
    }).join('');
  }

  function switchClass(classId) {
    state.currentClassId = classId;
    renderClassTabs();
    return loadClassData(classId);
  }

  function loadClassData(classId) {
    showToast('Loading class records...');
    return Promise.all([
      root.PassportSync.readTeacherSync(),
      root.PassportSync.readClassPupilPassports(classId),
      root.PassportSync.readQuietPupils(classId),
      root.PassportSync.readClassNotes(classId),
      root.PassportSync.readHiddenByPupils(classId)
    ]).then(function (results) {
      state.syncDoc = results[0] || { approved: {}, hidden: {}, galleryOn: {}, hiddenNotes: {}, shoutouts: {}, updatedAt: '' };
      state.pupils = results[1] || [];
      state.quietPupils = results[2] || [];
      state.classNotes = results[3] || [];
      state.hiddenByPupils = results[4] || [];
      showToast('');
      renderStudioUI();
      return state;
    }).catch(function (err) {
      showToast('Error loading: ' + (err.message || 'network error'), true);
      throw err;
    });
  }

  /* 3. RENDER STUDIO UI */
  function renderStudioUI() {
    var classId = state.currentClassId;
    var sync = state.syncDoc;

    // Gallery toggle status
    var isGalleryOn = !!(sync.galleryOn && sync.galleryOn[classId]);
    var toggleEl = document.getElementById('tch-gallery-toggle');
    if (toggleEl) toggleEl.checked = isGalleryOn;
    var statusEl = document.getElementById('tch-gallery-status');
    if (statusEl) {
      statusEl.innerText = isGalleryOn ? 'Gallery Live 🌟' : 'Off';
      statusEl.style.color = isGalleryOn ? '#34d399' : '#94a3b8';
    }

    // Filter waiting list: pupils whose passport has content and is newer than approved copy
    var waitingPupils = state.pupils.filter(function (item) {
      var p = item.passport;
      if (!p || (!p.about || p.about.length === 0)) return false;
      var approved = sync.approved && sync.approved[item.student.id];
      if (!approved) return true; // Never approved
      return p.updatedAt && p.updatedAt !== approved.at; // Changed since last approval
    });

    var badge = document.getElementById('tch-waiting-badge');
    if (badge) badge.innerText = waitingPupils.length;

    renderWaitingGrid(waitingPupils);
    renderRosterList(state.pupils);
    renderQuietGrid(state.quietPupils);
    renderNotesList(state.classNotes);
    renderHiddenByPupilsList(state.hiddenByPupils);
  }

  function renderWaitingGrid(list) {
    var grid = document.getElementById('tch-waiting-grid');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:24px 0">All pupil passports for this class are up to date! 🎉</div>';
      return;
    }

    grid.innerHTML = list.map(function (item) {
      var st = item.student;
      var p = item.passport;
      var sentencesHtml = (p.about || []).map(function (it) {
        return '<li>“' + esc(root.PassportData.formatSentence(it.frame, it.pick)) + '”</li>';
      }).join('');

      var askHtml = (p.askMe || []).map(function (it) {
        var qDef = root.PassportData.ASK_ME_QUESTIONS.find(function (q) { return q.id === it.q; });
        var qText = qDef ? qDef.text : '';
        var aText = it.a ? root.PassportData.formatSentence(it.a.frame, it.a.pick) : '';
        return '<div>💬 <b>' + esc(qText) + '</b>: “' + esc(aText) + '”</div>';
      }).join('');

      return (
        '<div class="pass-waiting-item" id="waiting-item-' + esc(st.id) + '">' +
          '<div class="pass-pupil-row-header">' +
            '<div style="width:48px;height:48px">' + renderMonsterSvg(st.monsterProfile, 48) + '</div>' +
            '<div style="flex:1">' +
              '<div style="font-size:1.2rem;font-weight:800;color:#fde047">' + esc(st.firstName || st.name) + '</div>' +
              '<div style="font-size:0.8rem;color:#cbd5e1">Updated: ' + esc(p.updatedAt ? p.updatedAt.slice(0, 10) : 'Today') + '</div>' +
            '</div>' +
            '<img src="art/' + esc(p.stamp || 's_star') + '.webp" alt="" style="width:36px;height:36px;object-fit:contain">' +
          '</div>' +
          '<div style="font-size:0.92rem;color:#f8fafc;background:rgba(15,23,42,0.6);padding:10px 14px;border-radius:12px">' +
            '<ul style="margin:0;padding-left:18px">' + sentencesHtml + '</ul>' +
            (askHtml ? '<div style="margin-top:8px;border-top:1px dashed rgba(148,163,184,0.3);padding-top:6px">' + askHtml + '</div>' : '') +
          '</div>' +
          '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:4px">' +
            '<button type="button" class="pass-btn" style="min-height:38px;padding:4px 12px;font-size:0.88rem" onclick="PassportTeacher.rejectPupil(\'' + esc(st.id) + '\')">✕ Not now</button>' +
            '<button type="button" class="pass-btn emerald" style="min-height:38px;padding:4px 14px;font-size:0.88rem" onclick="PassportTeacher.approvePupil(\'' + esc(st.id) + '\')">✓ Approve</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderRosterList(list) {
    var container = document.getElementById('tch-roster-list');
    if (!container) return;

    var sync = state.syncDoc;
    var approvedMap = sync.approved || {};
    var hiddenMap = sync.hidden || {};

    container.innerHTML = list.map(function (item) {
      var st = item.student;
      var p = item.passport;
      var isApproved = !!approvedMap[st.id];
      var isHidden = !!hiddenMap[st.id];
      var hasDraft = p && p.about && p.about.length > 0;

      var statusBadge = '';
      if (isApproved) {
        statusBadge = '<span style="color:#34d399;font-weight:700;font-size:0.85rem">✓ Approved for Gallery</span>';
      } else if (hasDraft) {
        statusBadge = '<span style="color:#f59e0b;font-weight:700;font-size:0.85rem">⏳ Waiting for Approval</span>';
      } else {
        statusBadge = '<span style="color:#94a3b8;font-size:0.85rem">No passport saved yet</span>';
      }

      return (
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:rgba(30,41,59,0.7);border-radius:16px;border:1px solid rgba(148,163,184,0.25)">' +
          '<div style="display:flex;align-items:center;gap:12px">' +
            '<div style="width:40px;height:40px">' + renderMonsterSvg(st.monsterProfile, 40) + '</div>' +
            '<div>' +
              '<div style="font-weight:800;font-size:1.1rem;color:#ffffff">' + esc(st.firstName || st.name) + '</div>' +
              '<div>' + statusBadge + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:18px">' +
            '<label style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:#cbd5e1;cursor:pointer">' +
              '<span>Hide from gallery:</span>' +
              '<label class="pass-toggle-switch">' +
                '<input type="checkbox" ' + (isHidden ? 'checked' : '') + ' onchange="PassportTeacher.toggleHide(\'' + esc(st.id) + '\')">' +
                '<span class="pass-toggle-slider"></span>' +
              '</label>' +
            '</label>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* 4. APPROVAL ACTIONS */
  function approvePupil(studentId) {
    var pupilObj = state.pupils.find(function (x) { return x.student.id === studentId; });
    if (!pupilObj) return Promise.resolve(null);

    var p = pupilObj.passport;
    var st = pupilObj.student;

    showToast('Approving passport for ' + (st.firstName || st.name) + '...');
    return root.PassportSync.saveTeacherSync(function (doc) {
      doc.approved = doc.approved || {};
      doc.approved[studentId] = {
        about: p.about || [],
        askMe: p.askMe || [],
        stamp: p.stamp || 's_star',
        at: p.updatedAt || new Date().toISOString(),
        student: {
          id: st.id,
          firstName: st.firstName || st.name,
          classId: st.classId,
          xp: st.xp || 100,
          monsterProfile: st.monsterProfile || {}
        }
      };
    }).then(function (newDoc) {
      state.syncDoc = newDoc;
      showToast('Approved ✓ ' + (st.firstName || st.name) + "'s passport is published to the class gallery!");
      renderStudioUI();
      return newDoc;
    }).catch(function (err) {
      showToast('Error approving: ' + (err.message || 'concurrency conflict'), true);
      throw err;
    });
  }

  function rejectPupil(studentId) {
    // "Not now": removes from waiting view for current session without modifying approved copy
    state.pupils = state.pupils.filter(function (x) { return x.student.id !== studentId; });
    renderStudioUI();
    showToast('Skipped for now (existing approved copy kept).');
  }

  function approveAll() {
    var waitingPupils = state.pupils.filter(function (item) {
      var p = item.passport;
      if (!p || (!p.about || p.about.length === 0)) return false;
      var approved = state.syncDoc.approved && state.syncDoc.approved[item.student.id];
      if (!approved) return true;
      return p.updatedAt && p.updatedAt !== approved.at;
    });

    if (waitingPupils.length === 0) {
      showToast('No pending passports to approve for this class.');
      return Promise.resolve(state.syncDoc);
    }

    showToast('Approving ' + waitingPupils.length + ' passports...');
    return root.PassportSync.saveTeacherSync(function (doc) {
      doc.approved = doc.approved || {};
      waitingPupils.forEach(function (pupilObj) {
        var st = pupilObj.student;
        var p = pupilObj.passport;
        doc.approved[st.id] = {
          about: p.about || [],
          askMe: p.askMe || [],
          stamp: p.stamp || 's_star',
          at: p.updatedAt || new Date().toISOString(),
          student: {
            id: st.id,
            firstName: st.firstName || st.name,
            classId: st.classId,
            xp: st.xp || 100,
            monsterProfile: st.monsterProfile || {}
          }
        };
      });
    }).then(function (newDoc) {
      state.syncDoc = newDoc;
      showToast('Approved all ✓ ' + waitingPupils.length + ' pupil passports published!');
      renderStudioUI();
      return newDoc;
    }).catch(function (err) {
      showToast('Error approving all: ' + (err.message || 'error'), true);
      throw err;
    });
  }

  function toggleHide(studentId) {
    return root.PassportSync.saveTeacherSync(function (doc) {
      doc.hidden = doc.hidden || {};
      doc.hidden[studentId] = !doc.hidden[studentId];
    }).then(function (newDoc) {
      state.syncDoc = newDoc;
      renderStudioUI();
      return newDoc;
    });
  }

  function toggleGallery() {
    var classId = state.currentClassId;
    return root.PassportSync.saveTeacherSync(function (doc) {
      doc.galleryOn = doc.galleryOn || {};
      doc.galleryOn[classId] = !doc.galleryOn[classId];
    }).then(function (newDoc) {
      state.syncDoc = newDoc;
      renderStudioUI();
      var isLive = !!(newDoc.galleryOn && newDoc.galleryOn[classId]);
      showToast(isLive ? 'Gallery is now LIVE for ' + classId + ' 🌟' : 'Gallery is now OFF for ' + classId);
      return newDoc;
    });
  }

  function openSmartboard() {
    var url = 'index.html?board=1&class=' + encodeURIComponent(state.currentClassId);
    window.open(url, '_blank');
  }

  function showToast(msg, isError) {
    var el = document.getElementById('tch-toast');
    if (!el) return;
    el.innerText = msg;
    el.style.color = isError ? '#f87171' : '#34d399';
  }

  /* 5. STEP 3: QUIET PUPILS, NOTES MODERATION & HIDDEN BY PUPILS */
  function renderQuietGrid(list) {
    var container = document.getElementById('tch-quiet-grid');
    var badge = document.getElementById('tch-quiet-badge');
    if (badge) badge.innerText = list.length;
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:18px 0">Everyone in this class received encouragement this week! 🌟</div>';
      return;
    }

    container.innerHTML = list.map(function (item) {
      var st = item.student;
      return (
        '<div class="pass-quiet-card">' +
          '<div style="width:44px;height:44px">' + renderMonsterSvg(st.monsterProfile, 44) + '</div>' +
          '<div>' +
            '<div style="font-weight:800;font-size:1.05rem;color:#fde047">' + esc(st.firstName || st.name) + '</div>' +
            '<div style="font-size:0.82rem;color:#cbd5e1">Quiet for 7 days</div>' +
            '<div style="font-size:0.75rem;color:#38bdf8;margin-top:2px">Pair up in class 🤝</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderNotesList(list) {
    var container = document.getElementById('tch-notes-list');
    var badge = document.getElementById('tch-notes-badge');
    if (badge) badge.innerText = list.length;
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:20px 0">No kind notes exchanged in this class over the last 14 days yet.</div>';
      return;
    }

    container.innerHTML = list.map(function (n) {
      var sName = n.sender ? (n.sender.firstName || n.sender.name) : 'Classmate';
      var tName = n.target ? (n.target.firstName || n.target.name) : 'Classmate';
      var timeStr = n.at ? n.at.slice(0, 10) : '';

      return (
        '<div class="pass-mod-card' + (n.isHidden ? ' hidden-note' : '') + '">' +
          '<div style="flex:1;min-width:260px">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
              '<span style="font-weight:800;color:#38bdf8">' + esc(sName) + '</span>' +
              '<span style="color:#94a3b8;font-size:0.85rem">➔ sent to</span>' +
              '<span style="font-weight:800;color:#fde047">' + esc(tName) + '</span>' +
              '<span style="color:#94a3b8;font-size:0.8rem;margin-left:auto">' + esc(timeStr) + '</span>' +
            '</div>' +
            '<div style="font-size:1.05rem;font-weight:600;color:#ffffff;background:rgba(15,23,42,0.6);padding:8px 12px;border-radius:12px">“' + esc(n.text) + '”</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">' +
            '<label style="display:flex;align-items:center;gap:8px;font-size:0.88rem;color:#cbd5e1;cursor:pointer">' +
              '<span>Hide note:</span>' +
              '<label class="pass-toggle-switch">' +
                '<input type="checkbox" ' + (n.isHidden ? 'checked' : '') + ' onchange="PassportTeacher.toggleTeacherHideNote(\'' + esc(n.key) + '\')">' +
                '<span class="pass-toggle-slider"></span>' +
              '</label>' +
            '</label>' +
            '<label style="display:flex;align-items:center;gap:8px;font-size:0.88rem;color:#c084fc;cursor:pointer">' +
              '<span>⭐ Shout-Out:</span>' +
              '<label class="pass-toggle-switch">' +
                '<input type="checkbox" ' + (n.isShoutout ? 'checked' : '') + ' onchange="PassportTeacher.toggleShoutout(\'' + esc(n.key) + '\')">' +
                '<span class="pass-toggle-slider"></span>' +
              '</label>' +
            '</label>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderHiddenByPupilsList(list) {
    var container = document.getElementById('tch-hidden-pupils-list');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:16px 0">No notes hidden by pupils in this class.</div>';
      return;
    }

    container.innerHTML = list.map(function (item) {
      var st = item.student;
      return (
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:rgba(30,41,59,0.7);border-radius:14px;border:1px solid rgba(148,163,184,0.25)">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<div style="width:36px;height:36px">' + renderMonsterSvg(st.monsterProfile, 36) + '</div>' +
            '<div style="font-weight:700;color:#ffffff">' + esc(st.firstName || st.name) + '</div>' +
          '</div>' +
          '<div style="color:#f87171;font-size:0.88rem;font-weight:700">' + item.hiddenKeys.length + ' hidden notes</div>' +
        '</div>'
      );
    }).join('');
  }

  function toggleTeacherHideNote(noteKey) {
    return root.PassportSync.toggleTeacherHideNote(noteKey).then(function (newDoc) {
      state.syncDoc = newDoc;
      showToast('Note visibility updated.');
      return loadClassData(state.currentClassId);
    });
  }

  function toggleShoutout(noteKey) {
    return root.PassportSync.toggleShoutout(noteKey).then(function (newDoc) {
      state.syncDoc = newDoc;
      var isPick = !!(newDoc.shoutouts && newDoc.shoutouts[noteKey]);
      showToast(isPick ? '⭐ Added to Smartboard Shout-Outs!' : 'Removed from Smartboard Shout-Outs.');
      return loadClassData(state.currentClassId);
    });
  }

  PassportTeacher.unlock = unlock;
  PassportTeacher.relock = relock;
  PassportTeacher.switchClass = switchClass;
  PassportTeacher.approvePupil = approvePupil;
  PassportTeacher.rejectPupil = rejectPupil;
  PassportTeacher.approveAll = approveAll;
  PassportTeacher.toggleHide = toggleHide;
  PassportTeacher.toggleGallery = toggleGallery;
  PassportTeacher.openSmartboard = openSmartboard;
  PassportTeacher.toggleTeacherHideNote = toggleTeacherHideNote;
  PassportTeacher.toggleShoutout = toggleShoutout;

})(typeof window !== 'undefined' ? window : this);
