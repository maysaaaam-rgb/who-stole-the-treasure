/* My Passport — Pupil Application Controller & Smartboard Engine
   Supports:
   - Pupil passport editor (?p=CODE or ?demo=1)
   - Class gallery modal ("Our class" button)
   - Smartboard projector presentation mode (?board=1&class=CLASS_ID)
*/
(function (root) {
  'use strict';

  var PassportApp = root.PassportApp = root.PassportApp || {};

  var state = {
    session: null,
    currentTab: 'cover',
    isBoardMode: false,
    boardClassId: 'class-4a',
    boardIndex: 0,
    boardList: [],
    boardViewMode: 'passports', // 'passports' or 'shoutouts'
    boardShoutoutsList: [],
    boardShoutoutIndex: 0,
    galleryList: [],
    galleryOn: false,
    activePickingFrame: null,
    activePickingIndex: null,
    activePickingType: 'about', // 'about' or 'askMe'
    isSavedNotice: false,
    receivedNotes: [],
    receivedWaves: [],
    pipNote: null,
    activeNoteBuilder: null
  };

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getQueryParam(name) {
    var u = new URLSearchParams(window.location.search);
    return u.get(name);
  }

  /* Seeded PRNG for Daily Random Order */
  function seededRandom(seedStr) {
    var h = 0;
    for (var i = 0; i < seedStr.length; i++) {
      h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507) | 0;
      h = Math.imul(h ^ (h >>> 13), 3266489909) | 0;
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  function shuffleWithSeed(array, seedStr) {
    var rng = seededRandom(seedStr);
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function renderMonsterSvg(prof, size) {
    var renderer = root.MonsterRenderer;
    if (renderer && typeof renderer.renderMonsterSVG === 'function') {
      var p = prof || {};
      return renderer.renderMonsterSVG({
        stage: p.stage || 'stage-3-baby-monster',
        equipped: p.equipped || {},
        size: size || 160
      });
    }
    return '<div style="font-size:' + (size ? size * 0.5 : 80) + 'px">👾</div>';
  }

  /* Initialize App */
  function init() {
    var boardParam = getQueryParam('board');
    if (boardParam === '1' || boardParam === 'true') {
      state.isBoardMode = true;
      state.boardClassId = getQueryParam('class') || 'class-4a';
      initSmartboardMode();
      return;
    }

    var demoParam = getQueryParam('demo');
    var codeParam = getQueryParam('p');

    if (demoParam) {
      var demoId = (demoParam === '1' || demoParam === 'true') ? 'demo-p4' : demoParam;
      PassportSync.loadDemoSession(demoId).then(function (res) {
        state.session = res;
        ensureDefaultPassport(state.session);
        renderTopBar();
        renderBook();
        checkIncomingItems();
      });
      return;
    }

    if (codeParam) {
      PassportSync.resolvePupilByCode(codeParam).then(function (res) {
        if (res.status === 'ok') {
          state.session = res;
          ensureDefaultPassport(state.session);
          renderTopBar();
          renderBook();
          checkIncomingItems();
        } else {
          renderCodeEntry(res.message);
        }
      });
      return;
    }

    renderCodeEntry();
  }

  function ensureDefaultPassport(ses) {
    if (!ses || !ses.passport) return;
    var p = ses.passport;
    if (!Array.isArray(p.about) || p.about.length === 0) {
      p.about = [
        { frame: 'fav_animal', pick: 'dolphin' },
        { frame: 'fav_colour', pick: 'blue' },
        { frame: 'can_action', pick: 'swim_fast' }
      ];
    }
    if (!Array.isArray(p.askMe) || p.askMe.length === 0) {
      p.askMe = [
        { q: 'q_animal', a: { frame: 'fav_animal', pick: 'dolphin' } },
        { q: 'q_hobby', a: { frame: 'like_hobby', pick: 'swimming' } }
      ];
    }
    if (!p.stamp) p.stamp = 's_star';
  }

  function renderCodeEntry(errorMsg) {
    var main = document.getElementById('pass-main');
    if (!main) return;
    renderTopBar();
    main.innerHTML =
      '<div class="pass-booklet-wrap" style="max-width:480px;text-align:center">' +
        '<div class="pass-book" style="padding:32px 24px;min-height:0">' +
          '<div style="font-size:3.5rem;margin-bottom:12px">🛂</div>' +
          '<h2 style="font-size:1.9rem;margin-bottom:8px">Welcome to My Passport</h2>' +
          '<p style="color:#5b4a75;margin-bottom:20px;font-size:1.05rem">Enter your secret Island link code to view and edit your passport!</p>' +
          (errorMsg ? '<div style="color:#f87171;font-weight:700;margin-bottom:16px;background:rgba(239,68,68,0.15);padding:10px;border-radius:12px">' + esc(errorMsg) + '</div>' : '') +
          '<div style="display:flex;gap:10px;justify-content:center">' +
            '<input type="text" id="pass-code-input" placeholder="CODE" maxlength="8" style="text-transform:uppercase;font-size:1.4rem;font-weight:800;letter-spacing:3px;text-align:center;width:160px;padding:10px;border-radius:14px;border:3px solid #4f9dff;background:#fff8ec;color:#2b1d40">' +
            '<button type="button" class="pass-btn cyan" onclick="PassportApp.submitCode()">Open 🚀</button>' +
          '</div>' +
          '<div style="margin-top:24px;border-top:1px dashed rgba(148,163,184,0.3);padding-top:18px">' +
            '<button type="button" class="pass-btn amber" onclick="window.location.search=\'?demo=1\'">Try Demo Mode ✨</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function submitCode() {
    var el = document.getElementById('pass-code-input');
    if (!el) return;
    var code = el.value.trim();
    if (!code) return;
    window.location.search = '?p=' + encodeURIComponent(code);
  }

  /* Render Header */
  function renderTopBar() {
    var bar = document.getElementById('pass-topbar');
    if (!bar) return;
    var ses = state.session;

    if (!ses || ses.status !== 'ok') {
      bar.innerHTML =
        '<div class="pass-pupil-meta">' +
          '<a class="pass-btn emerald" href="../index.html#home" onclick="try{if(window.parent&&window.parent!==window){window.parent.postMessage({type:\'eaa:closeOverlay\'},\'*\');return false;}}catch(e){}" style="min-height:40px;padding:6px 14px;font-size:0.9rem">🏝️ ← Island</a>' +
          '<img src="art/o_passport_book.webp" alt="" style="width:40px;height:40px;object-fit:contain">' +
          '<span class="pass-pupil-name">My Passport</span>' +
        '</div>';
      return;
    }

    var st = ses.student || {};
    var muted = PassportAudio.isMuted();

    var demoSwitcher = '';
    if (ses.isDemo) {
      demoSwitcher =
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
          '<button type="button" class="pass-btn ' + (st.id === 'demo-p3' ? 'cyan' : '') + '" style="min-height:38px;padding:4px 10px;font-size:0.85rem" onclick="PassportApp.switchDemo(\'demo-p3\')">Leo (G3)</button>' +
          '<button type="button" class="pass-btn ' + (st.id === 'demo-p4' ? 'cyan' : '') + '" style="min-height:38px;padding:4px 10px;font-size:0.85rem" onclick="PassportApp.switchDemo(\'demo-p4\')">Maya (G4)</button>' +
          '<button type="button" class="pass-btn ' + (st.id === 'demo-p5' ? 'cyan' : '') + '" style="min-height:38px;padding:4px 10px;font-size:0.85rem" onclick="PassportApp.switchDemo(\'demo-p5\')">Sam (G4)</button>' +
        '</div>';
    }

    bar.innerHTML =
      '<div class="pass-pupil-meta">' +
        '<a class="pass-btn emerald" href="../index.html#home" onclick="try{if(window.parent&&window.parent!==window){window.parent.postMessage({type:\'eaa:closeOverlay\'},\'*\');return false;}}catch(e){}" style="min-height:40px;padding:6px 12px;font-size:0.88rem" title="Back to 3D Adventure Island">🏝️ Island</a>' +
        '<div style="width:42px;height:42px;border-radius:12px;overflow:hidden;background:#eef7ff;border:2px solid #cfe6ff;display:flex;align-items:center;justify-content:center">' +
          renderMonsterSvg(st.monsterProfile, 38) +
        '</div>' +
        '<div>' +
          '<div class="pass-pupil-name">' + esc(st.firstName || st.name) + "'s Passport</div>" +
          '<div class="pass-pupil-sub">' + esc(st.className || (st.grade ? 'Grade ' + st.grade : 'Academy')) + ' • ' + (st.xp || 100) + ' XP</div>' +
        '</div>' +
      '</div>' +
      demoSwitcher +
      '<div class="pass-actions">' +
        '<button type="button" class="pass-btn amber" id="pass-btn-island" onclick="PassportApp.goToIsland()" title="Practice Island Story Quest">⛵ Quest</button>' +
        '<button type="button" class="pass-btn violet" id="pass-btn-gallery" onclick="PassportApp.openClassGallery()">👥 Our class</button>' +
        '<button type="button" class="pass-btn emerald" id="pass-btn-save" onclick="PassportApp.savePupilPassport()">💾 Save</button>' +
        '<button type="button" class="pass-btn" id="pass-btn-mute" onclick="PassportApp.toggleMute()" title="Sound">' + (muted ? '🔇' : '🔊') + '</button>' +
      '</div>';
  }

  function switchDemo(pid) {
    PassportAudio.playTap();
    window.location.search = '?demo=' + pid;
  }

  function goToIsland() {
    var ses = state.session;
    if (ses && ses.isDemo) {
      var curId = ses.student && ses.student.id;
      var islDemo = 'demo-g3';
      if (curId === 'demo-p4') islDemo = 'demo-g4';
      if (curId === 'demo-p5') islDemo = 'demo-star';
      window.location.href = '../island/index.html?demo=' + (islDemo === 'demo-star' ? 'star' : (islDemo === 'demo-g4' ? 'g4' : '1'));
    } else if (ses && ses.code) {
      window.location.href = '../island/index.html?p=' + encodeURIComponent(ses.code);
    } else {
      window.location.href = '../island/index.html';
    }
  }

  function goHome() {
    window.location.href = '../index.html';
  }

  function toggleMute() {
    PassportAudio.toggleMute();
    renderTopBar();
  }

  /* Render Main Passport Booklet */
  function renderBook() {
    var main = document.getElementById('pass-main');
    if (!main || !state.session) return;
    var ses = state.session;
    var tab = state.currentTab;

    var navTabsHtml =
      '<div class="pass-nav-tabs">' +
        '<button type="button" class="pass-tab-btn' + (tab === 'cover' ? ' active' : '') + '" onclick="PassportApp.switchTab(\'cover\')">🛂 Cover</button>' +
        '<button type="button" class="pass-tab-btn' + (tab === 'about' ? ' active' : '') + '" onclick="PassportApp.switchTab(\'about\')">📝 All About Me</button>' +
        '<button type="button" class="pass-tab-btn' + (tab === 'ask' ? ' active' : '') + '" onclick="PassportApp.switchTab(\'ask\')">💬 Ask Me in Class</button>' +
        '<button type="button" class="pass-tab-btn' + (tab === 'badges' ? ' active' : '') + '" onclick="PassportApp.switchTab(\'badges\')">🏅 My Badges</button>' +
        '<button type="button" class="pass-tab-btn' + (tab === 'stamp' ? ' active' : '') + '" onclick="PassportApp.switchTab(\'stamp\')">⭐ My Stamp</button>' +
        '<button type="button" class="pass-tab-btn' + (tab === 'mailbox' ? ' active' : '') + '" onclick="PassportApp.switchTab(\'mailbox\')">📬 Mailbox' + (state.receivedNotes.length > 0 ? ' (' + state.receivedNotes.length + ')' : '') + '</button>' +
      '</div>';

    var pageContent = '';
    if (tab === 'cover') pageContent = renderPageCover();
    else if (tab === 'about') pageContent = renderPageAbout();
    else if (tab === 'ask') pageContent = renderPageAsk();
    else if (tab === 'badges') pageContent = renderPageBadges();
    else if (tab === 'stamp') pageContent = renderPageStamp();
    else if (tab === 'mailbox') pageContent = renderPageMailbox();

    var savedToast = state.isSavedNotice ?
      '<div style="background:rgba(16,185,129,0.9);color:#ffffff;font-weight:800;padding:8px 18px;border-radius:9999px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,0,0,0.3);animation:idleBob 2s ease infinite">' +
        'Saved ✓ Your teacher will look at it soon 🌟' +
      '</div>' : '';

    main.innerHTML =
      '<div class="pass-booklet-wrap">' +
        savedToast +
        '<div class="pass-book">' +
          navTabsHtml +
          '<div class="pass-page">' +
            pageContent +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function switchTab(t) {
    PassportAudio.playPageFlip();
    state.currentTab = t;
    renderBook();
  }

  /* Page 1: Cover */
  function renderPageCover() {
    var ses = state.session;
    var st = ses.student || {};
    var p = ses.passport || {};
    var stampId = p.stamp || 's_star';

    return (
      '<div class="pass-cover-layout">' +
        '<div class="pass-crest-badge">🛡️ Passport of the English Adventure Academy</div>' +
        '<div class="pass-monster-stage">' +
          '<div class="pass-monster-sprite">' + renderMonsterSvg(st.monsterProfile, 170) + '</div>' +
          '<div class="pass-pedestal-disk"></div>' +
        '</div>' +
        '<h1 class="pass-pupil-title">' + esc(st.firstName || st.name) + '</h1>' +
        '<div class="pass-pupil-level-pill">Level Explorer • ' + (st.xp || 100) + ' XP</div>' +
        '<p style="color:#5b4a75;font-size:0.98rem;max-width:380px;margin-top:6px">Official Pupil Explorer Profile. Tap the tabs above to share your favourite things in English!</p>' +
        '<div class="pass-stamp-seal" onclick="PassportApp.switchTab(\'stamp\')" title="My Stamp">' +
          '<img src="art/' + esc(stampId) + '.webp" alt="Stamp">' +
        '</div>' +
      '</div>'
    );
  }

  /* Page 2: All About Me */
  function renderPageAbout() {
    var ses = state.session;
    var p = ses.passport || {};
    var sentences = p.about || [];

    var listHtml = sentences.map(function (item, idx) {
      var frame = PassportData.FRAMES.find(function (f) { return f.id === item.frame; });
      if (!frame) return '';
      var choice = frame.choices.find(function (c) { return c.id === item.pick; });
      var choiceText = choice ? choice.text : '...';
      var choiceIcon = choice ? choice.icon : '✨';
      var fullSentence = PassportData.formatSentence(item.frame, item.pick);

      return (
        '<div class="pass-sentence-row" id="about-row-' + idx + '">' +
          '<div class="pass-sentence-text">' +
            '<span>' + esc(frame.template.split('{pick}')[0]) + '</span>' +
            '<span class="pass-gap-pill filled" onclick="PassportApp.openChoicePicker(\'about\', ' + idx + ', \'' + frame.id + '\')">' +
              choiceIcon + ' ' + esc(choiceText) + ' ✏️' +
            '</span>' +
            '<span>' + esc(frame.template.split('{pick}')[1] || '') + '</span>' +
          '</div>' +
          '<div class="pass-sentence-btns">' +
            '<button type="button" class="pass-btn cyan" style="min-height:40px;min-width:40px;padding:6px 10px" onclick="PassportApp.speakSentence(\'' + esc(fullSentence) + '\')" title="Listen">🔊</button>' +
            '<button type="button" class="pass-btn" style="min-height:40px;min-width:40px;padding:6px 10px;color:#f87171" onclick="PassportApp.removeSentence(' + idx + ')" title="Remove">✕</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var addBtnHtml = '';
    if (sentences.length < 5) {
      addBtnHtml =
        '<button type="button" class="pass-btn amber" style="margin-top:16px" onclick="PassportApp.openAddSentenceModal()">' +
          '➕ Add another sentence (' + sentences.length + '/5)' +
        '</button>';
    }

    return (
      '<div style="width:100%;max-width:680px">' +
        '<div style="text-align:center;margin-bottom:18px">' +
          '<h2 style="font-size:1.7rem">All About Me 🌟</h2>' +
          '<p style="color:#5b4a75;font-size:0.95rem">Choose up to 5 sentences. Tap any gap to change your words!</p>' +
        '</div>' +
        '<div class="pass-sentences-list">' +
          listHtml +
        '</div>' +
        '<div style="text-align:center">' + addBtnHtml + '</div>' +
      '</div>'
    );
  }

  /* Page 3: Ask Me in Class */
  function renderPageAsk() {
    var ses = state.session;
    var p = ses.passport || {};
    var askList = p.askMe || [];

    var cardsHtml = askList.map(function (item, idx) {
      var qDef = PassportData.ASK_ME_QUESTIONS.find(function (q) { return q.id === item.q; });
      var qText = qDef ? qDef.text : "What's your favourite thing?";
      var aSentence = item.a ? PassportData.formatSentence(item.a.frame, item.a.pick) : '';

      return (
        '<div class="pass-ask-card" id="ask-card-' + idx + '">' +
          '<div class="pass-ask-header">Question ' + (idx + 1) + ' for classmates</div>' +
          '<div class="pass-ask-q">“' + esc(qText) + '”</div>' +
          '<div class="pass-ask-a">' +
            '<div><b>My Answer:</b> “' + esc(aSentence) + '”</div>' +
            '<div style="display:flex;gap:6px">' +
              '<button type="button" class="pass-btn cyan" style="min-height:36px;padding:4px 10px;font-size:0.85rem" onclick="PassportApp.speakSentence(\'' + esc(qText + ' ' + aSentence) + '\')">🔊</button>' +
              '<button type="button" class="pass-btn violet" style="min-height:36px;padding:4px 10px;font-size:0.85rem" onclick="PassportApp.openAskQuestionPicker(' + idx + ')">Change ✏️</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div style="width:100%;max-width:640px">' +
        '<div style="text-align:center;margin-bottom:18px">' +
          '<h2 style="font-size:1.7rem">Ask Me in Class! 💬</h2>' +
          '<p style="color:#5b4a75;font-size:0.95rem">Pick 2 questions your classmates can ask you when we play warm-up games!</p>' +
        '</div>' +
        '<div class="pass-ask-list">' +
          cardsHtml +
        '</div>' +
      '</div>'
    );
  }

  /* Page 4: Badges & Stickers */
  function renderPageBadges() {
    var ses = state.session;
    var st = ses.student || {};
    var prof = st.monsterProfile || {};
    var itemsCount = (prof.unlockedItems && prof.unlockedItems.length) || 3;

    return (
      '<div style="width:100%;max-width:680px;text-align:center">' +
        '<h2 style="font-size:1.7rem;margin-bottom:6px">My Academy Badges 🏅</h2>' +
        '<p style="color:#5b4a75;font-size:0.95rem;margin-bottom:20px">Badges and achievements earned on Practice Island and classroom arcade games!</p>' +
        '<div class="pass-badges-grid">' +
          '<div class="pass-badge-item">' +
            '<div class="pass-badge-icon">⭐</div>' +
            '<div class="pass-badge-name">' + (st.xp || 100) + ' XP</div>' +
            '<div class="pass-badge-sub">Lifetime Points</div>' +
          '</div>' +
          '<div class="pass-badge-item">' +
            '<div class="pass-badge-icon">👗</div>' +
            '<div class="pass-badge-name">' + itemsCount + ' Items</div>' +
            '<div class="pass-badge-sub">Monster Wardrobe</div>' +
          '</div>' +
          '<div class="pass-badge-item">' +
            '<div class="pass-badge-icon">🏝️</div>' +
            '<div class="pass-badge-name">Island Explorer</div>' +
            '<div class="pass-badge-sub">Practice Island</div>' +
          '</div>' +
          '<div class="pass-badge-item">' +
            '<div class="pass-badge-icon">🤝</div>' +
            '<div class="pass-badge-name">Friendly Speaker</div>' +
            '<div class="pass-badge-sub">Classroom Star</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* Page 5: Stamp Selection */
  function renderPageStamp() {
    var ses = state.session;
    var p = ses.passport || {};
    var currentStamp = p.stamp || 's_star';

    var stampsHtml = PassportData.STAMPS.map(function (s) {
      var isSelected = s.id === currentStamp;
      return (
        '<div class="pass-stamp-slot' + (isSelected ? ' selected' : '') + '" onclick="PassportApp.selectStamp(\'' + s.id + '\')">' +
          '<img src="art/' + esc(s.pic) + '.webp" alt="' + esc(s.name) + '">' +
          '<div class="pass-stamp-name">' + esc(s.name) + '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div style="width:100%;max-width:680px;text-align:center">' +
        '<h2 style="font-size:1.7rem;margin-bottom:6px">Choose Your Passport Stamp ⭐</h2>' +
        '<p style="color:#5b4a75;font-size:0.95rem;margin-bottom:20px">Pick the stamp that best represents your adventure spirit!</p>' +
        '<div class="pass-stamps-grid">' +
          stampsHtml +
        '</div>' +
      '</div>'
    );
  }

  function selectStamp(stampId) {
    if (!state.session || !state.session.passport) return;
    state.session.passport.stamp = stampId;
    PassportAudio.playStamp();
    renderBook();
  }

  /* Sentence Frame Selection Modal */
  function openChoicePicker(type, index, frameId) {
    PassportAudio.playTap();
    state.activePickingType = type;
    state.activePickingIndex = index;
    state.activePickingFrame = frameId;

    var frame = PassportData.FRAMES.find(function (f) { return f.id === frameId; });
    if (!frame) return;

    var modalRoot = document.getElementById('pass-modal-root');
    if (!modalRoot) return;

    var choicesHtml = frame.choices.map(function (c) {
      return (
        '<button type="button" class="pass-choice-btn" onclick="PassportApp.choosePick(\'' + c.id + '\')">' +
          '<span class="pass-choice-icon">' + c.icon + '</span>' +
          '<span>' + esc(c.text) + '</span>' +
        '</button>'
      );
    }).join('');

    modalRoot.innerHTML =
      '<div class="pass-modal-backdrop" id="pass-choice-backdrop">' +
        '<div class="pass-modal-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="font-size:1.4rem">' + esc(frame.label) + '</h3>' +
            '<button type="button" class="pass-btn" style="min-height:40px;min-width:40px;padding:4px 8px" onclick="PassportApp.closeModal()">✕</button>' +
          '</div>' +
          '<p style="color:#5b4a75;margin-top:6px">Tap your favourite choice:</p>' +
          '<div class="pass-choices-grid">' +
            choicesHtml +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function choosePick(pickId) {
    PassportAudio.playTap();
    var ses = state.session;
    if (!ses || !ses.passport) return;

    if (state.activePickingType === 'about') {
      var arr = ses.passport.about || [];
      if (arr[state.activePickingIndex]) {
        arr[state.activePickingIndex].pick = pickId;
      }
    } else if (state.activePickingType === 'askMe') {
      var askArr = ses.passport.askMe || [];
      if (askArr[state.activePickingIndex] && askArr[state.activePickingIndex].a) {
        askArr[state.activePickingIndex].a.pick = pickId;
      }
    }

    closeModal();
    renderBook();
  }

  function openAddSentenceModal() {
    PassportAudio.playTap();
    var modalRoot = document.getElementById('pass-modal-root');
    if (!modalRoot) return;

    var ses = state.session;
    var usedFrames = (ses.passport && ses.passport.about ? ses.passport.about.map(function (x) { return x.frame; }) : []);
    var available = PassportData.FRAMES.filter(function (f) { return usedFrames.indexOf(f.id) === -1; });

    var framesHtml = available.map(function (f) {
      return (
        '<button type="button" class="pass-choice-btn" style="text-align:left;align-items:flex-start;padding:12px 14px" onclick="PassportApp.addNewSentence(\'' + f.id + '\')">' +
          '<div style="font-size:1.5rem;margin-bottom:4px">' + f.icon + ' ' + esc(f.label) + '</div>' +
          '<div style="font-size:0.88rem;color:#5b4a75">' + esc(f.template.replace('{pick}', '_____')) + '</div>' +
        '</button>'
      );
    }).join('');

    modalRoot.innerHTML =
      '<div class="pass-modal-backdrop" id="pass-choice-backdrop">' +
        '<div class="pass-modal-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="font-size:1.4rem">Add a New Sentence</h3>' +
            '<button type="button" class="pass-btn" style="min-height:40px;min-width:40px;padding:4px 8px" onclick="PassportApp.closeModal()">✕</button>' +
          '</div>' +
          '<div class="pass-choices-grid" style="grid-template-columns:1fr">' +
            framesHtml +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function addNewSentence(frameId) {
    PassportAudio.playTap();
    var ses = state.session;
    if (!ses || !ses.passport) return;
    var frame = PassportData.FRAMES.find(function (f) { return f.id === frameId; });
    if (!frame) return;
    var defaultPick = frame.choices[0] ? frame.choices[0].id : '';

    ses.passport.about = ses.passport.about || [];
    ses.passport.about.push({ frame: frameId, pick: defaultPick });
    closeModal();
    renderBook();
  }

  function removeSentence(idx) {
    PassportAudio.playTap();
    var ses = state.session;
    if (!ses || !ses.passport || !ses.passport.about) return;
    ses.passport.about.splice(idx, 1);
    renderBook();
  }

  /* Ask Question Picker */
  function openAskQuestionPicker(idx) {
    PassportAudio.playTap();
    var modalRoot = document.getElementById('pass-modal-root');
    if (!modalRoot) return;

    var qListHtml = PassportData.ASK_ME_QUESTIONS.map(function (q) {
      return (
        '<button type="button" class="pass-choice-btn" style="text-align:left;align-items:flex-start;padding:12px 14px" onclick="PassportApp.setAskQuestion(' + idx + ', \'' + q.id + '\')">' +
          '<div style="font-size:1.2rem;font-weight:800;color:#b45309">' + q.icon + ' “' + esc(q.text) + '”</div>' +
        '</button>'
      );
    }).join('');

    modalRoot.innerHTML =
      '<div class="pass-modal-backdrop">' +
        '<div class="pass-modal-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="font-size:1.4rem">Choose Question ' + (idx + 1) + '</h3>' +
            '<button type="button" class="pass-btn" style="min-height:40px;min-width:40px;padding:4px 8px" onclick="PassportApp.closeModal()">✕</button>' +
          '</div>' +
          '<div class="pass-choices-grid" style="grid-template-columns:1fr">' +
            qListHtml +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function setAskQuestion(idx, qId) {
    PassportAudio.playTap();
    var ses = state.session;
    if (!ses || !ses.passport) return;
    var qDef = PassportData.ASK_ME_QUESTIONS.find(function (q) { return q.id === qId; });
    if (!qDef) return;

    var frame = PassportData.FRAMES.find(function (f) { return f.id === qDef.frameId; });
    var pick = (frame && frame.choices[0]) ? frame.choices[0].id : '';

    ses.passport.askMe = ses.passport.askMe || [];
    ses.passport.askMe[idx] = {
      q: qId,
      a: { frame: qDef.frameId, pick: pick }
    };
    closeModal();
    // Prompt to pick an answer
    openChoicePicker('askMe', idx, qDef.frameId);
  }

  function speakSentence(text) {
    PassportAudio.speak(text);
  }

  function closeModal() {
    var modalRoot = document.getElementById('pass-modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
  }

  /* Save Pupil Passport */
  function savePupilPassport() {
    if (!state.session) return;
    PassportSync.savePassport(state.session, state.session.passport).then(function () {
      PassportAudio.playSuccess();
      state.isSavedNotice = true;
      renderBook();
      setTimeout(function () {
        state.isSavedNotice = false;
        renderBook();
      }, 4000);
    });
  }

  /* ==========================================================================
     CLASS GALLERY (Our Class)
     ========================================================================== */
  function openClassGallery() {
    PassportAudio.playTap();
    var ses = state.session;
    if (!ses) return;

    var classId = ses.classId || 'class-4a';
    PassportSync.readClassGallery(classId).then(function (res) {
      state.galleryOn = res.galleryOn;
      state.galleryList = res.list;
      renderClassGalleryModal();
    });
  }

  function renderClassGalleryModal() {
    var modalRoot = document.getElementById('pass-modal-root');
    if (!modalRoot || !state.session) return;

    var ses = state.session;
    var myId = ses.student ? ses.student.id : '';

    if (!state.galleryOn) {
      modalRoot.innerHTML =
        '<div class="pass-modal-backdrop" id="pass-gallery-backdrop">' +
          '<div class="pass-modal-card" style="text-align:center;max-width:480px">' +
            '<div style="font-size:3.5rem;margin-bottom:12px">🔒</div>' +
            '<h2 style="font-size:1.8rem;margin-bottom:8px">Class Gallery Opening Soon</h2>' +
            '<p style="color:#5b4a75;font-size:1.05rem;margin-bottom:20px">Your teacher has not opened the gallery for this class yet. Keep polishing your sentences!</p>' +
            '<button type="button" class="pass-btn emerald" onclick="PassportApp.closeModal()">Back to my passport ✓</button>' +
          '</div>' +
        '</div>';
      return;
    }

    // Daily randomized order seeded by pupil id + today's date
    var todayStr = new Date().toISOString().slice(0, 10);
    var seed = myId + '_' + todayStr;
    var ordered = shuffleWithSeed(state.galleryList, seed);

    var isMyApproved = ordered.some(function (p) { return p.studentId === myId; });
    var topBanner = !isMyApproved ?
      '<div style="background:#fff4d9;border:2px solid #ffb320;color:#92400e;font-weight:700;padding:8px 14px;border-radius:12px;margin-bottom:12px;text-align:center">' +
        'Your passport will be in the gallery soon 🌟' +
      '</div>' : '';

    var cardsHtml = ordered.map(function (c) {
      return (
        '<div class="pass-classmate-card" onclick="PassportApp.openClassmateDetail(\'' + esc(c.studentId) + '\')">' +
          '<div class="pass-classmate-stamp"><img src="art/' + esc(c.stamp || 's_star') + '.webp" alt=""></div>' +
          '<div class="pass-classmate-sprite">' + renderMonsterSvg(c.monsterProfile, 100) + '</div>' +
          '<div class="pass-classmate-name">' + esc(c.firstName) + '</div>' +
          '<div style="font-size:0.8rem;color:#68537d;margin-top:2px">' + c.about.length + ' sentences</div>' +
        '</div>'
      );
    }).join('');

    if (ordered.length === 0) {
      cardsHtml = '<div style="grid-column:1/-1;text-align:center;color:#68537d;padding:40px 0">No approved classmate passports yet.</div>';
    }

    modalRoot.innerHTML =
      '<div class="pass-modal-backdrop" id="pass-gallery-backdrop">' +
        '<div class="pass-modal-card pass-gallery-card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<div>' +
              '<h2 style="font-size:1.8rem;display:flex;align-items:center;gap:10px">👥 Our Class Passports</h2>' +
              '<div style="font-size:0.9rem;color:#68537d">Tap any classmate to hear what they like!</div>' +
            '</div>' +
            '<button type="button" class="pass-btn" style="min-height:40px;min-width:40px;padding:4px 8px" onclick="PassportApp.closeModal()">✕</button>' +
          '</div>' +
          topBanner +
          '<div class="pass-gallery-grid">' +
            cardsHtml +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function openClassmateDetail(studentId) {
    PassportAudio.playTap();
    var classmate = state.galleryList.find(function (c) { return c.studentId === studentId; });
    if (!classmate) return;

    var modalRoot = document.getElementById('pass-modal-root');
    if (!modalRoot) return;

    var sentencesHtml = classmate.about.map(function (item) {
      var fullSentence = PassportData.formatSentence(item.frame, item.pick);
      return (
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;background:#fff8ec;border-radius:14px;margin-bottom:8px">' +
          '<div style="font-size:1.1rem;font-weight:600;color:#2b1d40">“' + esc(fullSentence) + '”</div>' +
          '<button type="button" class="pass-btn cyan" style="min-height:36px;min-width:36px;padding:4px 8px" onclick="PassportApp.speakSentence(\'' + esc(fullSentence) + '\')">🔊</button>' +
        '</div>'
      );
    }).join('');

    var askHtml = classmate.askMe.map(function (item) {
      var qDef = PassportData.ASK_ME_QUESTIONS.find(function (q) { return q.id === item.q; });
      var qText = qDef ? qDef.text : '';
      var aSentence = item.a ? PassportData.formatSentence(item.a.frame, item.a.pick) : '';
      return (
        '<div style="padding:12px 16px;background:rgba(168,85,247,0.15);border:1px solid #a855f7;border-radius:16px;margin-bottom:10px">' +
          '<div style="font-size:1.15rem;font-weight:800;color:#b45309">“' + esc(qText) + '”</div>' +
          '<div style="font-size:0.95rem;color:#e2e8f0;margin-top:4px">Ask in class! 💬 “' + esc(aSentence) + '”</div>' +
        '</div>'
      );
    }).join('');

    modalRoot.innerHTML =
      '<div class="pass-modal-backdrop">' +
        '<div class="pass-modal-card" style="max-width:540px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
            '<div style="display:flex;align-items:center;gap:12px">' +
              '<div style="width:54px;height:54px">' + renderMonsterSvg(classmate.monsterProfile, 54) + '</div>' +
              '<div>' +
                '<h2 style="font-size:1.6rem">' + esc(classmate.firstName) + "'s Passport</h2>" +
                '<div style="color:#38bdf8;font-size:0.88rem">Approved by Teacher ✓</div>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="pass-btn" style="min-height:40px;min-width:40px;padding:4px 8px" onclick="PassportApp.openClassGallery()">Back</button>' +
          '</div>' +
          '<div style="max-height:60vh;overflow-y:auto;padding-right:4px">' +
            '<div style="font-size:0.95rem;font-weight:800;color:#c084fc;text-transform:uppercase;margin-bottom:8px">About ' + esc(classmate.firstName) + ':</div>' +
            sentencesHtml +
            '<div style="font-size:0.95rem;font-weight:800;color:#c084fc;text-transform:uppercase;margin:16px 0 8px">Ask ' + esc(classmate.firstName) + ' in Class:</div>' +
            askHtml +
            (classmate.studentId !== myId ? (
              '<div style="margin-top:20px;border-top:1px dashed rgba(148,163,184,0.3);padding-top:16px">' +
                '<div style="font-size:0.95rem;font-weight:800;color:#38bdf8;text-transform:uppercase;margin-bottom:10px">Send Encouragement:</div>' +
                '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
                  '<button type="button" class="pass-btn cyan" style="flex:1;min-width:140px" onclick="PassportApp.openNoteBuilder(\'' + esc(classmate.studentId) + '\')">💌 Send a kind note</button>' +
                '</div>' +
                '<div style="display:flex;gap:8px;margin-top:12px;align-items:center;flex-wrap:wrap">' +
                  '<span style="font-size:0.88rem;color:#5b4a75;font-weight:700">Monster Waves:</span>' +
                  '<button type="button" class="pass-btn" style="min-height:38px;padding:4px 12px;font-size:0.9rem" onclick="PassportApp.sendClassmateWave(\'' + esc(classmate.studentId) + '\', \'wave\')">👋 Wave</button>' +
                  '<button type="button" class="pass-btn" style="min-height:38px;padding:4px 12px;font-size:0.9rem" onclick="PassportApp.sendClassmateWave(\'' + esc(classmate.studentId) + '\', \'dance\')">💃 Dance</button>' +
                  '<button type="button" class="pass-btn" style="min-height:38px;padding:4px 12px;font-size:0.9rem" onclick="PassportApp.sendClassmateWave(\'' + esc(classmate.studentId) + '\', \'highfive\')">✋ High-Five</button>' +
                '</div>' +
              '</div>'
            ) : '') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ==========================================================================
     STEP 3: MAILBOX, KIND NOTES & MONSTER WAVES
     ========================================================================== */

  function alertToast(msg, isSuccess) {
    var toast = document.createElement('div');
    toast.className = 'pass-toast-notice';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:' + (isSuccess ? 'rgba(16,185,129,0.95)' : 'rgba(15,23,42,0.95)') + ';color:#ffffff;font-weight:800;font-size:1.05rem;padding:12px 24px;border-radius:9999px;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:2px solid ' + (isSuccess ? '#10b981' : '#38bdf8') + ';z-index:9999;animation:idleBob 2s ease infinite;text-align:center';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3500);
  }

  function checkIncomingItems() {
    var ses = state.session;
    if (!ses || !ses.student) return Promise.resolve(null);

    return PassportSync.collectReceivedItems(ses.student.id, ses.classId, ses.passport).then(function (res) {
      state.receivedNotes = res.notes || [];
      state.receivedWaves = res.waves || [];
      state.pipNote = res.pipNote;

      renderTopBar();

      // Check if there is an unseen wave
      var seenKey = '';
      try { seenKey = localStorage.getItem('eaa_passport_seen_wave_' + ses.student.id) || ''; } catch (e) {}

      if (state.receivedWaves.length > 0) {
        var latestWave = state.receivedWaves[0];
        if (latestWave && latestWave.key !== seenKey) {
          openWaveCelebrationModal(latestWave);
        }
      }

      if (state.currentTab === 'mailbox') {
        renderBook();
      }

      return res;
    });
  }

  /* Mailbox View */
  function renderPageMailbox() {
    var notes = state.receivedNotes || [];

    if (notes.length === 0) {
      return (
        '<div style="text-align:center;padding:36px 16px">' +
          '<img src="art/o_envelope.webp" alt="Mailbox" style="width:110px;height:110px;object-fit:contain;margin-bottom:12px;animation:idleBob 3s ease-in-out infinite">' +
          '<h2 style="font-size:1.6rem;margin-bottom:8px">Your Mailbox is Quiet</h2>' +
          '<p style="color:#5b4a75;font-size:1.05rem;max-width:400px;margin:0 auto 20px">Send a kind note or a monster wave to a classmate from "Our Class" 👥 to start sharing encouragement!</p>' +
          '<button type="button" class="pass-btn violet" onclick="PassportApp.openClassGallery()">👥 Open Our Class</button>' +
        '</div>'
      );
    }

    var listHtml = notes.map(function (n) {
      var isPip = n.isPip;
      var senderAvatar = isPip ?
        '<img src="art/c_pip.webp" alt="Pip" style="width:48px;height:48px;object-fit:contain">' :
        '<div style="width:48px;height:48px">' + renderMonsterSvg(n.senderMonster, 48) + '</div>';

      var shoutoutBadge = n.isShoutout ?
        '<span class="pass-shoutout-badge-pill">⭐ Class Shout-Out!</span>' : '';

      var actionsHtml = isPip ?
        ('<div class="pass-note-actions">' +
          '<button type="button" class="pass-btn amber" style="min-height:38px;padding:4px 14px;font-size:0.9rem" onclick="PassportApp.speakSentence(\'' + esc(n.text) + '\')">🔊 Listen</button>' +
          '<button type="button" class="pass-btn emerald" style="min-height:38px;padding:4px 14px;font-size:0.9rem" onclick="PassportApp.sayPipThanks()">Thank you Pip! 🦜</button>' +
        '</div>') :
        ('<div class="pass-note-actions">' +
          '<button type="button" class="pass-btn amber" style="min-height:38px;padding:4px 14px;font-size:0.9rem" onclick="PassportApp.speakSentence(\'' + esc(n.text) + '\')">🔊 Listen</button>' +
          '<button type="button" class="pass-btn emerald" style="min-height:38px;padding:4px 14px;font-size:0.9rem" onclick="PassportApp.sendQuickThanks(\'' + esc(n.senderId) + '\')">Thank you! 💖</button>' +
          '<button type="button" class="pass-btn cyan" style="min-height:38px;padding:4px 14px;font-size:0.9rem" onclick="PassportApp.openNoteBuilderForSender(\'' + esc(n.senderId) + '\', \'' + esc(n.senderName) + '\')">Send note back 💌</button>' +
          '<button type="button" class="pass-btn" style="min-height:38px;padding:4px 10px;font-size:0.85rem;color:#68537d" onclick="PassportApp.hideNote(\'' + esc(n.key) + '\')">✕ Hide</button>' +
        '</div>');

      return (
        '<div class="pass-note-card' + (isPip ? ' pip-card' : '') + (n.isShoutout ? ' shoutout-active' : '') + '">' +
          shoutoutBadge +
          '<div class="pass-note-header">' +
            '<div class="pass-note-sender">' +
              senderAvatar +
              '<div>' +
                '<div class="pass-note-sender-name">' + esc(n.senderName) + (isPip ? ' (Island Guide 🦜)' : '') + '</div>' +
                '<div class="pass-note-time">' + (isPip ? 'Special Delivery' : esc(n.at ? n.at.slice(0, 10) : 'Recent')) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="pass-note-body">“' + esc(n.text) + '”</div>' +
          actionsHtml +
        '</div>'
      );
    }).join('');

    return (
      '<div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
          '<h2 style="font-size:1.6rem;display:flex;align-items:center;gap:10px">' +
            '<img src="art/o_envelope.webp" alt="" style="width:36px;height:36px;object-fit:contain">' +
            'Notes for Me' +
          '</h2>' +
          '<div style="font-size:0.9rem;color:#68537d">' + notes.length + ' encouraging messages</div>' +
        '</div>' +
        '<div class="pass-mailbox-list">' +
          listHtml +
        '</div>' +
      '</div>'
    );
  }

  /* Wave Celebration Modal */
  function openWaveCelebrationModal(wave) {
    var modalRoot = document.getElementById('pass-modal-root');
    if (!modalRoot || !state.session) return;
    var mySt = state.session.student || {};

    var actionLabel = 'waved hello! 👋';
    var animClass = 'pass-monster-wave';
    if (wave.waveType === 'dance') {
      actionLabel = 'danced with your monster! 💃';
      animClass = 'pass-monster-dance';
    } else if (wave.waveType === 'highfive') {
      actionLabel = 'gave your monster a high-five! ✋';
      animClass = 'pass-monster-wave';
    }

    try { localStorage.setItem('eaa_passport_seen_wave_' + mySt.id, wave.key); } catch (e) {}

    PassportAudio.playFanfare();

    modalRoot.innerHTML =
      '<div class="pass-modal-backdrop">' +
        '<div class="pass-modal-card" style="max-width:540px;text-align:center">' +
          '<div style="font-size:2.8rem;margin-bottom:8px">🎉</div>' +
          '<h2 style="font-size:1.8rem;color:#b45309;margin-bottom:4px">' + esc(wave.senderName) + ' ' + actionLabel + '</h2>' +
          '<div class="pass-wave-stage">' +
            '<div class="pass-wave-partner">' +
              '<div class="' + animClass + '">' + renderMonsterSvg(wave.senderMonster, 110) + '</div>' +
              '<div class="pass-wave-partner-name">' + esc(wave.senderName) + '</div>' +
            '</div>' +
            '<div style="font-size:2.4rem">✨</div>' +
            '<div class="pass-wave-partner">' +
              '<div class="' + animClass + '">' + renderMonsterSvg(mySt.monsterProfile, 110) + '</div>' +
              '<div class="pass-wave-partner-name">' + esc(mySt.firstName) + ' (You)</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:12px;justify-content:center;margin-top:16px">' +
            '<button type="button" class="pass-btn cyan" onclick="PassportApp.replyWave(\'' + esc(wave.senderId) + '\', \'' + esc(wave.waveType) + '\')">Wave back 👋</button>' +
            '<button type="button" class="pass-btn emerald" onclick="PassportApp.closeModal()">Awesome! ✨</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function replyWave(targetId, waveType) {
    PassportAudio.playTap();
    PassportSync.sendWave(state.session, targetId, waveType, state.session.student.firstName)
      .then(function () {
        PassportAudio.playSuccess();
        closeModal();
        alertToast('Waved back! 👋✨', true);
      })
      .catch(function (err) {
        alertToast(err.message || 'Could not wave back.');
        closeModal();
      });
  }

  function sendClassmateWave(studentId, waveType) {
    PassportAudio.playTap();
    PassportSync.sendWave(state.session, studentId, waveType, state.session.student.firstName)
      .then(function () {
        PassportAudio.playSuccess();
        var label = waveType === 'dance' ? 'Danced with monster! 💃' : (waveType === 'highfive' ? 'High-five given! ✋' : 'Waved hello! 👋');
        alertToast(label + ' Sent to outbox! 🌟', true);
      })
      .catch(function (err) {
        alertToast(err.message || 'Could not wave.');
      });
  }

  /* Note Builder */
  function openNoteBuilder(targetStudentId) {
    PassportAudio.playTap();
    var classmate = state.galleryList.find(function (c) { return c.studentId === targetStudentId; });
    var targetName = classmate ? classmate.firstName : 'Classmate';

    state.activeNoteBuilder = {
      targetId: targetStudentId,
      targetName: targetName,
      greeting: 'g_hi',
      compliment: 'm_monster',
      closing: 'c_from'
    };

    renderNoteBuilderModal();
  }

  function openNoteBuilderForSender(senderId, senderName) {
    PassportAudio.playTap();
    state.activeNoteBuilder = {
      targetId: senderId,
      targetName: senderName,
      greeting: 'g_hi',
      compliment: 'm_thanks',
      closing: 'c_from'
    };
    renderNoteBuilderModal();
  }

  function renderNoteBuilderModal() {
    var modalRoot = document.getElementById('pass-modal-root');
    var b = state.activeNoteBuilder;
    if (!modalRoot || !b || !state.session) return;

    var myFirst = state.session.student ? state.session.student.firstName : 'Explorer';
    var fullNoteText = PassportData.renderNoteText([b.greeting, b.compliment, b.closing], b.targetName, myFirst);

    var greetingsHtml = PassportData.NOTE_PARTS.greetings.map(function (g) {
      var isSel = g.id === b.greeting;
      var preview = g.template.replace('{name}', b.targetName);
      return (
        '<button type="button" class="pass-part-choice-btn' + (isSel ? ' selected' : '') + '" onclick="PassportApp.selectNotePart(\'greeting\', \'' + g.id + '\')">' +
          esc(preview) +
        '</button>'
      );
    }).join('');

    var complimentsHtml = PassportData.NOTE_PARTS.compliments.map(function (m) {
      var isSel = m.id === b.compliment;
      return (
        '<button type="button" class="pass-part-choice-btn' + (isSel ? ' selected' : '') + '" onclick="PassportApp.selectNotePart(\'compliment\', \'' + m.id + '\')">' +
          esc(m.text) +
        '</button>'
      );
    }).join('');

    modalRoot.innerHTML =
      '<div class="pass-modal-backdrop">' +
        '<div class="pass-modal-card" style="max-width:580px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<h2 style="font-size:1.6rem;display:flex;align-items:center;gap:10px">💌 Send a Kind Note</h2>' +
            '<button type="button" class="pass-btn" style="min-height:38px;min-width:38px;padding:4px 8px" onclick="PassportApp.closeModal()">✕</button>' +
          '</div>' +
          '<p style="color:#5b4a75;font-size:0.95rem;margin-bottom:12px">Pick sentence parts to build an encouraging note in English for ' + esc(b.targetName) + ':</p>' +
          '<div class="pass-postcard">' +
            '<div class="pass-postcard-preview">“' + esc(fullNoteText) + '”</div>' +
          '</div>' +
          '<div style="max-height:48vh;overflow-y:auto;padding-right:4px">' +
            '<div class="pass-part-selector">' +
              '<div class="pass-part-label">1. Greeting:</div>' +
              '<div class="pass-part-grid">' + greetingsHtml + '</div>' +
            '</div>' +
            '<div class="pass-part-selector">' +
              '<div class="pass-part-label">2. Encouragement:</div>' +
              '<div class="pass-part-grid">' + complimentsHtml + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px;border-top:1px dashed rgba(148,163,184,0.3);padding-top:14px">' +
            '<button type="button" class="pass-btn amber" onclick="PassportApp.speakSentence(\'' + esc(fullNoteText) + '\')">🔊 Listen</button>' +
            '<button type="button" class="pass-btn cyan" onclick="PassportApp.submitKindNote()">Send Note 🚀</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function selectNotePart(partType, partId) {
    if (!state.activeNoteBuilder) return;
    PassportAudio.playTap();
    state.activeNoteBuilder[partType] = partId;
    renderNoteBuilderModal();
  }

  function submitKindNote() {
    var b = state.activeNoteBuilder;
    if (!b || !state.session) return;

    var parts = [b.greeting, b.compliment, b.closing];
    var myFirst = state.session.student ? state.session.student.firstName : 'Friend';

    PassportSync.sendNote(state.session, b.targetId, parts, myFirst)
      .then(function () {
        PassportAudio.playSuccess();
        closeModal();
        alertToast('Note sent! 💌 Your kind words are on their way!', true);
        checkIncomingItems();
      })
      .catch(function (err) {
        alertToast(err.message || 'Could not send note.');
      });
  }

  function sendQuickThanks(senderId) {
    PassportAudio.playTap();
    var parts = ['g_hi', 'm_thanks', 'c_from'];
    var myFirst = state.session.student ? state.session.student.firstName : 'Friend';
    PassportSync.sendNote(state.session, senderId, parts, myFirst)
      .then(function () {
        PassportAudio.playSuccess();
        alertToast('Sent "Thank you!" note! 💖', true);
        checkIncomingItems();
      })
      .catch(function (err) {
        alertToast(err.message || 'Could not send thank you.');
      });
  }

  function hideNote(noteKey) {
    PassportAudio.playTap();
    return PassportSync.hideReceivedNote(state.session, noteKey).then(function () {
      alertToast('Note hidden.');
      return checkIncomingItems();
    });
  }

  function sayPipThanks() {
    PassportAudio.playSuccess();
    alertToast('Captain Pip says: Squawk! You are very welcome! 🦜🌟', true);
  }

  /* ==========================================================================
     SMARTBOARD MODE (?board=1&class=CLASS_ID)
     ========================================================================== */
  function initSmartboardMode() {
    Promise.all([
      PassportSync.readClassGallery(state.boardClassId),
      PassportSync.readClassNotes(state.boardClassId)
    ]).then(function (res) {
      state.boardList = res[0].list || [];
      var allNotes = res[1] || [];
      state.boardShoutoutsList = allNotes.filter(function (n) { return n.isShoutout && !n.isHidden; });
      state.boardIndex = 0;
      state.boardShoutoutIndex = 0;
      renderSmartboard();
    });
  }

  function setBoardViewMode(mode) {
    PassportAudio.playTap();
    state.boardViewMode = mode;
    renderSmartboard();
  }

  function renderSmartboard() {
    var main = document.getElementById('pass-main');
    if (!main) return;

    var mode = state.boardViewMode;
    var passCount = state.boardList.length;
    var shoutCount = state.boardShoutoutsList.length;

    var modeSwitcherHtml =
      '<div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px">' +
        '<button type="button" class="pass-btn' + (mode === 'passports' ? ' cyan' : '') + '" style="font-size:1.15rem;padding:8px 20px" onclick="PassportApp.setBoardViewMode(\'passports\')">📺 Class Passports (' + passCount + ')</button>' +
        '<button type="button" class="pass-btn' + (mode === 'shoutouts' ? ' violet' : '') + '" style="font-size:1.15rem;padding:8px 20px" onclick="PassportApp.setBoardViewMode(\'shoutouts\')">⭐ Class Shout-Outs (' + shoutCount + ')</button>' +
      '</div>';

    if (mode === 'shoutouts') {
      renderSmartboardShoutouts(main, modeSwitcherHtml);
      return;
    }

    var list = state.boardList;
    if (list.length === 0) {
      main.innerHTML =
        '<div class="pass-smartboard-container">' +
          modeSwitcherHtml +
          '<div class="pass-smartboard-card" style="max-width:600px">' +
            '<div style="font-size:4rem;margin-bottom:16px">📺</div>' +
            '<h2 style="font-size:2.2rem;margin-bottom:12px">No Approved Passports Yet</h2>' +
            '<p style="color:#5b4a75;font-size:1.2rem">Open the Teacher Studio to approve pupil passports for this class!</p>' +
          '</div>' +
        '</div>';
      return;
    }

    var idx = state.boardIndex;
    if (idx >= list.length) idx = 0;
    if (idx < 0) idx = list.length - 1;
    state.boardIndex = idx;
    var pupil = list[idx];

    var sentencesHtml = pupil.about.map(function (item) {
      return PassportData.formatSentence(item.frame, item.pick);
    }).join(' • ');

    var askBoxes = pupil.askMe.map(function (item) {
      var qDef = PassportData.ASK_ME_QUESTIONS.find(function (q) { return q.id === item.q; });
      return '<div class="pass-smartboard-ask-box">💬 “' + esc(qDef ? qDef.text : '') + '”</div>';
    }).join('');

    main.innerHTML =
      '<div class="pass-smartboard-container">' +
        modeSwitcherHtml +
        '<div class="pass-smartboard-prompt">Who can ask ' + esc(pupil.firstName) + ' a question? 🎤</div>' +
        '<div class="pass-smartboard-card">' +
          '<div class="pass-smartboard-monster">' + renderMonsterSvg(pupil.monsterProfile, 220) + '</div>' +
          '<div class="pass-smartboard-name">' + esc(pupil.firstName) + '</div>' +
          '<div class="pass-smartboard-sentences">“' + esc(sentencesHtml) + '”</div>' +
          '<div class="pass-smartboard-ask">' + askBoxes + '</div>' +
          '<div style="display:flex;gap:18px;align-items:center">' +
            '<button type="button" class="pass-btn cyan" style="font-size:1.3rem;padding:12px 24px" onclick="PassportApp.prevBoard()">◀ Previous</button>' +
            '<button type="button" class="pass-btn amber" style="font-size:1.3rem;padding:12px 24px" onclick="PassportApp.speakSentence(\'Who can ask ' + esc(pupil.firstName) + ' a question?\')">🔊 Speak Prompt</button>' +
            '<button type="button" class="pass-btn cyan" style="font-size:1.3rem;padding:12px 24px" onclick="PassportApp.nextBoard()">Next ▶</button>' +
          '</div>' +
          '<div style="margin-top:16px;color:#68537d;font-size:1.1rem">' + (idx + 1) + ' of ' + list.length + ' pupils</div>' +
        '</div>' +
      '</div>';
  }

  function renderSmartboardShoutouts(main, modeSwitcherHtml) {
    var shoutouts = state.boardShoutoutsList;
    if (shoutouts.length === 0) {
      main.innerHTML =
        '<div class="pass-smartboard-container">' +
          modeSwitcherHtml +
          '<div class="pass-smartboard-card" style="max-width:600px">' +
            '<div style="font-size:4rem;margin-bottom:16px">⭐</div>' +
            '<h2 style="font-size:2.2rem;margin-bottom:12px">No Shout-Outs Picked Yet</h2>' +
            '<p style="color:#5b4a75;font-size:1.2rem">Open the Teacher Studio and star kind notes to show them here as warm-up shout-outs!</p>' +
          '</div>' +
        '</div>';
      return;
    }

    var sIdx = state.boardShoutoutIndex;
    if (sIdx >= shoutouts.length) sIdx = 0;
    if (sIdx < 0) sIdx = shoutouts.length - 1;
    state.boardShoutoutIndex = sIdx;
    var item = shoutouts[sIdx];

    var senderName = item.sender ? (item.sender.firstName || item.sender.name) : 'A classmate';
    var targetName = item.target ? (item.target.firstName || item.target.name) : 'A classmate';

    main.innerHTML =
      '<div class="pass-smartboard-container">' +
        modeSwitcherHtml +
        '<div class="pass-smartboard-prompt">🌟 Class Encouragement Shout-Out! 🌟</div>' +
        '<div class="pass-shoutout-board-card">' +
          '<div class="pass-shoutout-monsters-duo">' +
            '<div style="text-align:center">' +
              '<div style="width:140px;height:140px">' + renderMonsterSvg(item.sender && item.sender.monsterProfile, 140) + '</div>' +
              '<div style="font-size:1.3rem;font-weight:800;color:#38bdf8;margin-top:6px">' + esc(senderName) + '</div>' +
            '</div>' +
            '<div style="font-size:3.5rem;animation:idleBob 2s ease infinite">💌</div>' +
            '<div style="text-align:center">' +
              '<div style="width:140px;height:140px">' + renderMonsterSvg(item.target && item.target.monsterProfile, 140) + '</div>' +
              '<div style="font-size:1.3rem;font-weight:800;color:#b45309;margin-top:6px">' + esc(targetName) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="pass-shoutout-text">“' + esc(item.text) + '”</div>' +
          '<div style="display:flex;gap:18px;justify-content:center;align-items:center">' +
            '<button type="button" class="pass-btn violet" style="font-size:1.3rem;padding:12px 24px" onclick="PassportApp.prevShoutout()">◀ Previous</button>' +
            '<button type="button" class="pass-btn amber" style="font-size:1.3rem;padding:12px 24px" onclick="PassportApp.speakSentence(\'' + esc(item.text) + '\')">🔊 Read Aloud</button>' +
            '<button type="button" class="pass-btn violet" style="font-size:1.3rem;padding:12px 24px" onclick="PassportApp.nextShoutout()">Next ▶</button>' +
          '</div>' +
          '<div style="margin-top:20px;color:#68537d;font-size:1.15rem">' + (sIdx + 1) + ' of ' + shoutouts.length + ' shout-outs</div>' +
        '</div>' +
      '</div>';
  }

  function nextShoutout() {
    PassportAudio.playPageFlip();
    state.boardShoutoutIndex = (state.boardShoutoutIndex + 1) % state.boardShoutoutsList.length;
    renderSmartboard();
  }

  function prevShoutout() {
    PassportAudio.playPageFlip();
    state.boardShoutoutIndex = (state.boardShoutoutIndex - 1 + state.boardShoutoutsList.length) % state.boardShoutoutsList.length;
    renderSmartboard();
  }

  function nextBoard() {
    PassportAudio.playPageFlip();
    state.boardIndex = (state.boardIndex + 1) % state.boardList.length;
    renderSmartboard();
  }

  function prevBoard() {
    PassportAudio.playPageFlip();
    state.boardIndex = (state.boardIndex - 1 + state.boardList.length) % state.boardList.length;
    renderSmartboard();
  }

  /* Expose Public API */
  PassportApp.init = init;
  PassportApp.state = function () { return state; };
  PassportApp.submitCode = submitCode;
  PassportApp.switchDemo = switchDemo;
  PassportApp.toggleMute = toggleMute;
  PassportApp.switchTab = switchTab;
  PassportApp.selectStamp = selectStamp;
  PassportApp.openChoicePicker = openChoicePicker;
  PassportApp.choosePick = choosePick;
  PassportApp.openAddSentenceModal = openAddSentenceModal;
  PassportApp.addNewSentence = addNewSentence;
  PassportApp.removeSentence = removeSentence;
  PassportApp.openAskQuestionPicker = openAskQuestionPicker;
  PassportApp.setAskQuestion = setAskQuestion;
  PassportApp.speakSentence = speakSentence;
  PassportApp.closeModal = closeModal;
  PassportApp.savePupilPassport = savePupilPassport;
  PassportApp.openClassGallery = openClassGallery;
  PassportApp.openClassmateDetail = openClassmateDetail;
  PassportApp.nextBoard = nextBoard;
  PassportApp.prevBoard = prevBoard;
  PassportApp.setBoardViewMode = setBoardViewMode;
  PassportApp.nextShoutout = nextShoutout;
  PassportApp.prevShoutout = prevShoutout;
  PassportApp.openWaveCelebrationModal = openWaveCelebrationModal;
  PassportApp.replyWave = replyWave;
  PassportApp.sendClassmateWave = sendClassmateWave;
  PassportApp.openNoteBuilder = openNoteBuilder;
  PassportApp.openNoteBuilderForSender = openNoteBuilderForSender;
  PassportApp.selectNotePart = selectNotePart;
  PassportApp.submitKindNote = submitKindNote;
  PassportApp.sendQuickThanks = sendQuickThanks;
  PassportApp.hideNote = hideNote;
  PassportApp.sayPipThanks = sayPipThanks;
  PassportApp.checkIncomingItems = checkIncomingItems;
  PassportApp.goToIsland = goToIsland;
  PassportApp.goHome = goHome;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(typeof window !== 'undefined' ? window : this);
