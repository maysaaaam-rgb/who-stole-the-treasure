/* Alice in Wonderland tab on the student profile.
   Shows the pupil's story character (avatar, card, sentences, words), the tea-party homework history,
   props, badges and the pupil's monster with a button to edit it. Character pictures are the pupils' own trading cards (alice-cards-4a / 4b). Props, badges and costumes come from assets/alice-cut/ (Gemini pictures cut out with art-prompts/alice_cut.py);
   every picture falls back to the existing character card or an emoji, so the tab works today.
   Needs: alice-party-home/party-data.js (window.PARTY) and the platform store. */
(function (root) {
  'use strict';
  var ART = 'assets/alice-cut/', CARD = 'alice-party-home/assets/';

  /* platform pupil id -> pupil id in the tea party data (names matched and checked against the class lists) */
  var MAP = {
    'student-4a-343': '4a-ipek', 'student-4a-341': '4a-kemal', 'student-4a-320': '4a-suhan', 'student-4a-310': '4a-bahriye', 'student-4a-314': '4a-iclal',
    'student-4a-441': '4a-ahmet', 'student-4a-311': '4a-alya', 'student-4a-315': '4a-emirali', 'student-4a-345': '4a-efe', 'student-4a-109': '4a-derin',
    'student-4a-342': '4a-emirb', 'student-4b-208': '4a-simal', 'student-4a-300': '4a-ruzgar', 'student-4a-312': '4a-belis', 'student-4a-313': '4a-ada',
    'student-4a-344': '4a-defne', 'student-4a-317': '4a-esila', 'student-4a-321': '4a-elif', 'student-4a-302': '4a-emire',
    'student-4b-338': '4b-derin', 'student-4b-301': '4b-ozanm', 'student-4b-439': '4b-mina', 'student-4b-303': '4b-ilay', 'student-4b-305': '4b-kerem',
    'student-4b-306': '4b-elifberen', 'student-4b-304': '4b-nilda', 'student-4a-319': '4b-ozan', 'student-4b-322': '4b-oyku', 'student-4b-346': '4b-ali',
    'student-4b-349': '4b-lina', 'student-4b-307': '4b-elif', 'student-4b-348': '4b-elisa', 'student-4b-316': '4b-egehan', 'student-4b-339': '4b-uras',
    'student-4b-309': '4b-utku', 'student-4b-318': '4b-ertugrul', 'student-4b-308': '4b-yagmur', 'student-4b-440': '4b-nisa'
  };
  /* each pupil's own trading card (front) from the Class 4A / 4B card pages. Sühan joined later: her card is the picture she sent. */
  var CARDFRONT = {
    '4a-ipek': "alice-cards-4a/output/class_4a_png/class_4a_01_i̇pek_front.png",
    '4a-iclal': "alice-cards-4a/output/class_4a_png/class_4a_02_i̇clal_front.png",
    '4a-simal': "alice-cards-4a/output/class_4a_png/class_4a_03_şimal_front.png",
    '4a-bahriye': "alice-cards-4a/output/class_4a_png/class_4a_04_bahriye_front.png",
    '4a-alya': "alice-cards-4a/output/class_4a_png/class_4a_05_ayla_front.png",
    '4a-emirali': "alice-cards-4a/output/class_4a_png/class_4a_06_emir_ali_front.png",
    '4a-belis': "alice-cards-4a/output/class_4a_png/class_4a_07_belis_front.png",
    '4a-ada': "alice-cards-4a/output/class_4a_png/class_4a_08_ada_front.png",
    '4a-efe': "alice-cards-4a/output/class_4a_png/class_4a_09_efe_front.png",
    '4a-kemal': "alice-cards-4a/output/class_4a_png/class_4a_10_kemal_front.png",
    '4a-derin': "alice-cards-4a/output/class_4a_png/class_4a_11_derin_front.png",
    '4a-defne': "alice-cards-4a/output/class_4a_png/class_4a_12_defne_front.png",
    '4a-esila': "alice-cards-4a/output/class_4a_png/class_4a_13_esila_front.png",
    '4a-ruzgar': "alice-cards-4a/output/class_4a_png/class_4a_14_rüzgar_front.png",
    '4a-elif': "alice-cards-4a/output/class_4a_png/class_4a_15_elif_front.png",
    '4a-ahmet': "alice-cards-4a/output/class_4a_png/class_4a_16_ahmet_front.png",
    '4a-emirb': "alice-cards-4a/output/class_4a_png/class_4a_17_emir_b._front.png",
    '4a-emire': "alice-cards-4a/output/class_4a_png/class_4a_18_emir_e._front.png",
    '4b-derin': "alice-cards-4b/output/class_4b_png/class_4b_01_derin_front.png",
    '4b-elifberen': "alice-cards-4b/output/class_4b_png/class_4b_02_elif_beren_front.png",
    '4b-ilay': "alice-cards-4b/output/class_4b_png/class_4b_03_i̇lay_eskin_front.png",
    '4b-nilda': "alice-cards-4b/output/class_4b_png/class_4b_04_nilda___milda_front.png",
    '4b-yagmur': "alice-cards-4b/output/class_4b_png/class_4b_05_yağmur_front.png",
    '4b-nisa': "alice-cards-4b/output/class_4b_png/class_4b_06_nisa_front.png",
    '4b-ozan': "alice-cards-4b/output/class_4b_png/class_4b_07_ozan_front.png",
    '4b-mina': "alice-cards-4b/output/class_4b_png/class_4b_08_mina_front.png",
    '4b-kerem': "alice-cards-4b/output/class_4b_png/class_4b_09_kerem_front.png",
    '4b-ali': "alice-cards-4b/output/class_4b_png/class_4b_10_ali_front.png",
    '4b-lina': "alice-cards-4b/output/class_4b_png/class_4b_11_lina_front.png",
    '4b-utku': "alice-cards-4b/output/class_4b_png/class_4b_12_utku_front.png",
    '4b-elif': "alice-cards-4b/output/class_4b_png/class_4b_13_elif_front.png",
    '4b-egehan': "alice-cards-4b/output/class_4b_png/class_4b_14_egehan_front.png",
    '4b-uras': "alice-cards-4b/output/class_4b_png/class_4b_15_uras_front.png",
    '4b-ozanm': "alice-cards-4b/output/class_4b_png/class_4b_16_ozan_m._front.png",
    '4b-ertugrul': "alice-cards-4b/output/class_4b_png/class_4b_17_ertuğrul_front.png",
    '4b-elisa': "alice-cards-4b/output/class_4b_png/class_4b_18_elisa_front.png",
    '4b-oyku': "alice-cards-4b/output/class_4b_png/class_4b_19_öykü_front.png"
  };
  /* roles whose card picture shows a hookah and smoke: not shown to children until a safe picture exists */
  var HIDE_PIC = { absolem: true };
  var PROP_ART = [['hat', 'prop_hat_big'], ['rabbit', 'prop_ears_hare'], ['long paper ears', 'prop_ears_hare'], ['cat ears', 'prop_ears_cat'], ['dog ears', 'prop_ears_dog'],
    ['mouse ears', 'prop_ears_mouse'], ['red paper crown', 'prop_crown_red'], ['crown', 'prop_crown_white'], ['watch', 'prop_watch'], ['big key', 'prop_key_big'], ['key', 'prop_key'],
    ['wings', 'prop_wings'], ['claws', 'prop_claws'], ['carrot', 'prop_carrot'], ['teapot', 'prop_teapot'], ['teacup', 'prop_teacup'], ['tiny cup', 'prop_cup_tiny'], ['small cup', 'prop_cup_tiny'],
    ['bottle', 'prop_bottle'], ['letter', 'prop_letter'], ['yarn', 'prop_yarn'], ['bone', 'prop_bone'], ['playing card', 'prop_card'], ['sword', 'prop_sword_toy'], ['book', 'prop_book'],
    ['flower', 'prop_flower'], ['cake', 'prop_cake_plate'], ['button', 'prop_button'], ['green hat', 'prop_hat_green'], ['bell', 'prop_bell'], ['antennae', 'prop_antennae'],
    ['mushroom', 'prop_mushroom'], ['tall hat', 'prop_hat_tall'], ['stick', 'prop_stick'], ['coat', 'prop_coat_green'], ['shell', 'prop_shell'], ['pearl', 'prop_pearl'], ['nice hat', 'prop_hat_nice']];
  var BADGES = [
    { id: 'ready', file: 'b_tea_party_ready', e: '🫖', t: 'Tea Party Ready', how: 'Finish the Week 1 practice' },
    { id: 'star', file: 'b_tea_party_star', e: '🌟', t: 'Tea Party Star', how: 'Finish the Week 2 practice' },
    { id: 'dialogue', file: 'b_dialogue_master', e: '💬', t: 'Dialogue Master', how: 'Say your dialogue without the card' },
    { id: 'prop', file: 'b_prop_maker', e: '✂️', t: 'Prop Maker', how: 'Make and bring your prop' },
    { id: 'phrase', file: 'b_phrase_pro', e: '☕', t: 'Phrase Pro', how: 'Learn the 3 tea-party phrases' },
    { id: 'costume', file: 'b_costume_designer', e: '🎩', t: 'Costume Designer', how: 'Dress your monster in an Alice costume' }
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* picture with a fallback: the real art if it exists, otherwise the emoji (or the old card photo) */
  function pic(src, fallback, cls, style) {
    var fb = String(fallback || '🎨').replace(/'/g, '');
    var isImg = /\.(jpg|png|webp)$/i.test(fb);
    return '<img class="' + (cls || '') + '" src="' + esc(src) + '" alt="" style="' + (style || '') + '" onerror="' + (isImg ? "this.onerror=null;this.src='" + esc(fb) + "'" : "this.replaceWith(document.createTextNode('" + fb + "'))") + '">';
  }
  function propFile(text) {
    var t = String(text).toLowerCase();
    for (var i = 0; i < PROP_ART.length; i++) if (t.indexOf(PROP_ART[i][0]) >= 0) return PROP_ART[i][1];
    return '';
  }
  function propEmoji(text) {
    var t = String(text).toLowerCase();
    return t.indexOf('hat') >= 0 ? '🎩' : t.indexOf('ears') >= 0 ? '🐰' : t.indexOf('crown') >= 0 ? '👑' : t.indexOf('watch') >= 0 ? '⌚' : t.indexOf('key') >= 0 ? '🔑' : t.indexOf('wings') >= 0 ? '🐉'
      : t.indexOf('carrot') >= 0 ? '🥕' : t.indexOf('sword') >= 0 ? '⚔️' : t.indexOf('claws') >= 0 ? '🐾' : t.indexOf('teapot') >= 0 ? '🫖' : t.indexOf('cup') >= 0 ? '☕' : t.indexOf('book') >= 0 ? '📕'
      : t.indexOf('shell') >= 0 ? '🐚' : t.indexOf('pearl') >= 0 ? '🫧' : t.indexOf('cake') >= 0 ? '🍰' : t.indexOf('flower') >= 0 ? '🌸' : t.indexOf('bell') >= 0 ? '🔔' : t.indexOf('mushroom') >= 0 ? '🍄' : '🎨';
  }
  function hwStatus(h, id) {
    var sub = h && h.submissions && h.submissions[id];
    if (!sub) return 'none';
    var st = String(sub.status || '').toUpperCase();
    return st === 'COMPLETED' || st === 'COMPLETE' ? 'done' : 'started';
  }

  /* inside the platform: statuses come from the store, the monster block can edit the monster */
  function html(student) {
    var P = root.PARTY, store = root.schoolStore || root.store;
    var partyId = MAP[student.id];
    if (!P || !partyId || !P.find(partyId)) return noCharacter();
    var hwList = [];
    try { hwList = (store.getHomework ? store.getHomework() : []).filter(function (h) { return String(h.id).indexOf('hw-alice-tea-party') === 0; }); } catch (e) { hwList = []; }
    var hw1 = hwList.filter(function (h) { return h.id === 'hw-alice-tea-party-w1'; })[0] || null;
    var hw2 = hwList.filter(function (h) { return h.id === 'hw-alice-tea-party-w2'; })[0] || null;
    var w1sub = hw1 && hw1.submissions && hw1.submissions[student.id];
    var mon = '';
    try { mon = root.renderStudentMonsterAvatar ? root.renderStudentMonsterAvatar(student.id, { size: 130, animated: true }) : ''; } catch (e) { mon = ''; }
    var monster = '<div style="margin-top:16px; display:flex; gap:16px; align-items:center; flex-wrap:wrap; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:14px;">' +
      '<div style="width:140px; height:140px; display:grid; place-items:center; flex:none;">' + mon + '</div>' +
      '<div style="flex:1; min-width:220px;"><h3 style="margin:0 0 4px; font-size:1.05rem;">👾 My monster</h3>' +
        '<p style="margin:0 0 10px; color:#475569; font-size:0.9rem;">Change the colour, face and accessories of your monster. Alice costumes (hats, ears, crowns, bow ties) will appear here soon.</p>' +
        '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
          '<button type="button" class="btn-primary-action" onclick="openMonsterCreator(\'' + esc(student.id) + '\')">🎨 Edit my monster</button>' +
          '<button type="button" class="btn-sm-secondary" onclick="switchStudentProfileTab(\'monster\')">👾 Monster &amp; Evolution</button>' +
        '</div></div></div>';
    return build(partyId, { R: '', w1: hwStatus(hw1, student.id), w2: hwStatus(hw2, student.id), w1date: w1sub && w1sub.completedDate, monster: monster });
  }

  /* on the pupils' own page (alice-party-home/profile.html): statuses come from this device */
  function localStatus(partyId) {
    var w1 = 'none', w2 = 'none', n2 = 0;
    try { var a = JSON.parse(localStorage.getItem('eaa_party_home_a1plus_v1') || '{}'); if (a.done && a.done[partyId]) w1 = 'done'; } catch (e) { /* none */ }
    try { var b = JSON.parse(localStorage.getItem('eaa_party_w2_v1') || '{}'); var d = (b.done && b.done[partyId]) || {}; n2 = ['t1', 't2', 't3', 't4', 't5'].filter(function (t) { return d[t]; }).length; w2 = n2 >= 5 ? 'done' : (n2 ? 'started' : 'none'); } catch (e2) { /* none */ }
    return { w1: w1, w2: w2, n2: n2 };
  }
  function pupilPage(partyId) {
    var P = root.PARTY;
    if (!P || !P.find(partyId)) return noCharacter();
    var st = localStatus(partyId);
    var monster = '<div style="margin-top:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:14px;"><h3 style="margin:0 0 4px; font-size:1.05rem;">👾 My monster</h3>' +
      '<p style="margin:0; color:#475569; font-size:0.95rem;">Your monster lives in the school platform. Your teacher will show you how to change its look in class. Alice costumes are coming soon!</p></div>';
    return build(partyId, { R: '../', w1: st.w1, w2: st.w2, n2: st.n2, monster: monster });
  }
  function noCharacter() {
    return '<div style="padding:24px; text-align:center; color:#64748b;"><div style="font-size:2.4rem;">🫖</div><b>No Alice in Wonderland character yet</b>' +
      '<p style="margin:6px 0 0;">This pupil has not been given a story character. Add them in <code>alice-party-home/party-data.js</code>.</p></div>';
  }

  /* the profile itself; R is the path from the page to the project root ('' in the platform, '../' on the pupil page) */
  function build(partyId, ctx) {
    var P = root.PARTY, R = ctx.R || '';
    var party = P.find(partyId);
    var ART_ = R + ART, CARD_ = R + CARD;
    var role = party.role, key = party.roleKey;
    var partners = P.partners(party);
    var photo = CARD_ + party.photo;
    var front = CARDFRONT[partyId] ? R + CARDFRONT[partyId] : photo;
    var hidePic = !!HIDE_PIC[key];
    var w1 = ctx.w1 || 'none', w2 = ctx.w2 || 'none';
    var earned = { ready: w1 === 'done', star: w2 === 'done' };

    /* ---- header: avatar + character + my card ---- */
    var head = '<div style="display:flex; gap:18px; align-items:center; flex-wrap:wrap; background:linear-gradient(135deg,#fff7d6,#ffe4f1); border:2px solid #f59e0b; border-radius:18px; padding:16px;">' +
      '<div style="width:110px; height:110px; border-radius:50%; border:4px solid #f59e0b; background:#fff; overflow:hidden; flex:none; display:grid; place-items:center; font-size:3.4rem;">' +
        (hidePic ? '🐛' : '<img src="' + esc(encodeURI(photo)) + '" alt="" style="width:100%; height:100%; object-fit:cover; object-position:50% 14%;">') + '</div>' +
      '<div style="flex:1; min-width:220px;">' +
        '<div style="font-size:0.72rem; font-weight:900; letter-spacing:0.08em; color:#92400e; text-transform:uppercase;">My story character</div>' +
        '<div style="font-size:1.6rem; font-weight:900; color:#7c2d12; line-height:1.1;">' + esc(role.name) + '</div>' +
        '<div style="font-size:0.9rem; color:#4c1d95; font-weight:700; margin-top:2px;">Class ' + esc(party.classLabel.replace('Class ', '')) + (partners.length ? ' · Partner: ' + partners.map(function (p) { return esc(p.name) + ' (' + esc(P.roles[p.role].short) + ')'; }).join(' + ') : '') + '</div>' +
        '<ul style="margin:8px 0 0; padding-left:20px; font-size:0.95rem;">' + (role.sentences || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '</div>' +
      '<div style="width:150px; flex:none; border-radius:12px; overflow:hidden; border:3px solid #f59e0b; background:#1e1b18; display:grid; place-items:center; min-height:120px; font-size:3.4rem;">' +
        (hidePic ? '🐛' : '<img src="' + esc(encodeURI(front)) + '" alt="My card" style="display:block; width:100%; height:auto;">') + '</div>' +
    '</div>';

    /* ---- homework history ---- */
    var chip = function (st) {
      return st === 'done' ? '<span style="background:rgba(16,185,129,0.15); color:#047857; border:1px solid rgba(16,185,129,0.5); border-radius:999px; padding:3px 12px; font-weight:800; font-size:0.8rem;">✓ Finished</span>'
        : st === 'started' ? '<span style="background:rgba(245,158,11,0.15); color:#b45309; border:1px solid rgba(245,158,11,0.5); border-radius:999px; padding:3px 12px; font-weight:800; font-size:0.8rem;">⏳ Started</span>'
        : '<span style="background:rgba(148,163,184,0.15); color:#64748b; border:1px solid #cbd5e1; border-radius:999px; padding:3px 12px; font-weight:800; font-size:0.8rem;">Not started</span>';
    };
    var homework = '<div style="margin-top:16px;"><h3 style="margin:0 0 8px; font-size:1.05rem;">📚 Tea Party homework</h3><div style="display:grid; gap:8px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px; background:#fff;">' +
        '<div><b>Week 1 · Meet your character</b><div style="font-size:0.8rem; color:#64748b;">5 steps: meet, words, order, say, party' + (ctx.w1date ? ' · ' + esc(ctx.w1date) : '') + '</div></div>' +
        '<div style="display:flex; gap:8px; align-items:center;">' + chip(w1) + '<a href="' + R + 'alice-party-home/index.html?s=' + esc(partyId) + '" target="_blank" rel="noopener" class="btn-sm-secondary" style="text-decoration:none;">Open</a></div></div>' +
      '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px; background:#fff;">' +
        '<div><b>Week 2 · Say it, prop and phrases</b><div style="font-size:0.8rem; color:#64748b;">5 small tasks: read, say with family, record, prop, phrases · due 15 Oct</div></div>' +
        '<div style="display:flex; gap:8px; align-items:center;">' + chip(w2) + (ctx.n2 && w2 === 'started' ? '<span style="font-size:0.8rem; color:#b45309; font-weight:800;">' + ctx.n2 + '/5</span>' : '') + '<a href="' + R + 'alice-party-home/week2.html?s=' + esc(partyId) + '" target="_blank" rel="noopener" class="btn-sm-secondary" style="text-decoration:none;">Open</a></div></div>' +
      '</div></div>';

    /* ---- props and words ---- */
    var props = (role.props || []).map(function (p) {
      return '<div style="display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:8px 12px;"><div style="width:56px; height:56px; display:grid; place-items:center; font-size:2rem; flex:none;">' +
        pic(ART_ + 'props/' + propFile(p) + '.webp', propEmoji(p), '', 'width:100%; height:100%; object-fit:contain;') + '</div><b>' + esc(p) + '</b></div>';
    }).join('');
    var words = (role.words || []).map(function (w) { return '<span style="display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid #e2e8f0; border-radius:999px; padding:4px 12px; margin:3px; font-weight:700;"><span style="font-size:1.3rem;">' + esc(w[1]) + '</span>' + esc(w[0]) + '</span>'; }).join('');
    var propsWords = '<div style="margin-top:16px; display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px;">' +
      '<div><h3 style="margin:0 0 8px; font-size:1.05rem;">✂️ My props</h3><div style="display:grid; gap:8px;">' + props + '</div></div>' +
      '<div><h3 style="margin:0 0 8px; font-size:1.05rem;">🔤 My 6 words</h3><div>' + words + '</div></div></div>';

    /* ---- badges ---- */
    var badges = '<div style="margin-top:16px;"><h3 style="margin:0 0 8px; font-size:1.05rem;">🏅 Alice badges</h3><div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px;">' +
      BADGES.map(function (b) {
        var on = !!earned[b.id];
        return '<div title="' + esc(b.how) + '" style="text-align:center; background:#fff; border:2px solid ' + (on ? '#f59e0b' : '#e2e8f0') + '; border-radius:14px; padding:10px 6px; ' + (on ? '' : 'opacity:0.45; filter:grayscale(0.8);') + '">' +
          '<div style="width:64px; height:64px; margin:0 auto; display:grid; place-items:center; font-size:2.2rem;">' + pic(ART_ + 'badges/' + b.file + '.webp', b.e, '', 'width:100%; height:100%; object-fit:contain;') + '</div>' +
          '<div style="font-weight:800; font-size:0.82rem; margin-top:4px;">' + esc(b.t) + '</div><div style="font-size:0.7rem; color:#64748b;">' + (on ? 'Earned!' : esc(b.how)) + '</div></div>';
      }).join('') + '</div></div>';

    return head + homework + propsWords + (ctx.monster || '') + badges;
  }

  root.AliceProfile = { html: html, pupilPage: pupilPage, map: MAP };
})(window);
