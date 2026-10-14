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
    'student-4a-342': '4a-emirb', 'student-4a-319': '4a-simal', 'student-4a-300': '4a-ruzgar', 'student-4a-312': '4a-belis', 'student-4a-313': '4a-ada',
    'student-4a-344': '4a-defne', 'student-4a-317': '4a-esila', 'student-4a-321': '4a-elif', 'student-4a-302': '4a-emire',
    'student-4b-338': '4b-derin', 'student-4b-301': '4b-ozanm', 'student-4b-439': '4b-mina', 'student-4b-303': '4b-ilay', 'student-4b-305': '4b-kerem',
    'student-4b-306': '4b-elifberen', 'student-4b-304': '4b-nilda', 'student-4b-208': '4b-ozan', 'student-4b-322': '4b-oyku', 'student-4b-346': '4b-ali',
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
  var PROP_ART = [['hat', 'prop_hat_big'], ['rabbit', 'prop_ears_hare'], ['long paper ears', 'prop_ears_hare'], ['cat ears', 'prop_ears_cat'], ['dog ears', 'prop_ears_dog'],
    ['mouse ears', 'prop_ears_mouse'], ['red paper crown', 'prop_crown_red'], ['crown', 'prop_crown_white'], ['watch', 'prop_watch'], ['big key', 'prop_key_big'], ['key', 'prop_key'],
    ['wings', 'prop_wings'], ['claws', 'prop_claws'], ['carrot', 'prop_carrot'], ['teapot', 'prop_teapot'], ['teacup', 'prop_teacup'], ['tiny cup', 'prop_cup_tiny'], ['small cup', 'prop_cup_tiny'],
    ['bottle', 'prop_bottle'], ['letter', 'prop_letter'], ['yarn', 'prop_yarn'], ['bone', 'prop_bone'], ['playing card', 'prop_card'], ['sword', 'prop_sword_toy'], ['book', 'prop_book'],
    ['flower', 'prop_flower'], ['cake', 'prop_cake_plate'], ['button', 'prop_button'], ['green hat', 'prop_hat_green'], ['bell', 'prop_bell'], ['antennae', 'prop_antennae'],
    ['mushroom', 'prop_mushroom'], ['tall hat', 'prop_hat_tall'], ['stick', 'prop_stick'], ['coat', 'prop_coat_green'], ['shell', 'prop_shell'], ['pearl', 'prop_pearl'], ['nice hat', 'prop_hat_nice']];
  var ROLE_EMOJI = { alice: '👧', hatter: '🎩', rabbit: '🐰', whitequeen: '👑', redqueen: '♥️', hare: '🐇', cheshire: '😸', cat: '🐈‍⬛', bayard: '🐕', dragon: '🐲', bandersnatch: '🧸',
    sister: '📖', mother: '👒', twosister1: '🎀', twosister2: '🎀', absolem: '🐛', hamish: '🎩', lowell: '🎩', dum: '🟢', dee: '🟢', dormouse1: '🐭', dormouse2: '🐭', oyster: '🦪' };
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
  /* picture fallback chain: data-fb = "next picture|next picture|emoji". A cut-out of the whole character is zoomed to its head when it stands in for an avatar. */
  function fb(img) {
    var list = String(img.getAttribute('data-fb') || '').split('|');
    var next = list.shift();
    img.setAttribute('data-fb', list.join('|'));
    if (next && /\.webp$/i.test(next)) {
      if (img.getAttribute('data-zoom')) { img.style.objectPosition = '50% 6%'; img.style.transform = 'scale(1.7)'; img.style.transformOrigin = '50% 12%'; }
      img.src = next;
    } else {
      var t = document.createTextNode(next || '🫖');
      if (img.parentNode) img.parentNode.replaceChild(t, img);
    }
  }

  function html(student) {
    var P = root.PARTY, store = root.schoolStore || root.store;
    var partyId = MAP[student.id];
    if (!P || !partyId || !P.find(partyId)) return noCharacter();
    var hwList = [];
    try { hwList = (store.getHomework ? store.getHomework() : []).filter(function (h) { return String(h.id).indexOf('hw-alice-tea-party') === 0; }); } catch (e) { hwList = []; }
    var hw1 = hwList.filter(function (h) { return h.id === 'hw-alice-tea-party-w1'; })[0] || null;
    var hw2 = hwList.filter(function (h) { return h.id === 'hw-alice-tea-party-w2'; })[0] || null;
    var w1sub = hw1 && hw1.submissions && hw1.submissions[student.id];
    var look = (root.ALICE_LOOKS || {})[student.id] || null;
    var mon = '';
    if (look && look.items && Object.keys(look.items).length) mon = monsterSvg(look.color || 'blue', 130, look.items);
    else { try { mon = root.renderStudentMonsterAvatar ? root.renderStudentMonsterAvatar(student.id, { size: 130, animated: true }) : ''; } catch (e) { mon = ''; } }
    var monster = '<div style="margin-top:16px; display:flex; gap:16px; align-items:center; flex-wrap:wrap; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:14px;">' +
      '<div style="position:relative; width:140px; height:140px; display:grid; place-items:center; flex:none;">' + mon + '</div>' +
      '<div style="flex:1; min-width:220px;"><h3 style="margin:0 0 4px; font-size:1.05rem;">👾 My monster</h3>' +
        '<p style="margin:0 0 10px; color:#475569; font-size:0.9rem;">Change the colour, face and accessories of your monster.' + (look && look.items && Object.keys(look.items).length ? ' <b>Alice costume chosen by the pupil:</b> ' + Object.keys(look.items).map(function (c) { var w = itemOf(look.items[c]); return esc(w ? w[2] : look.items[c]); }).join(', ') + '.' : ' Alice costumes chosen by the pupil on their own page will show here.') + '</p>' +
        '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
          '<button type="button" class="btn-primary-action" onclick="openMonsterCreator(\'' + esc(student.id) + '\')">🎨 Edit my monster</button>' +
          '<button type="button" class="btn-sm-secondary" onclick="switchStudentProfileTab(\'monster\')">👾 Monster &amp; Evolution</button>' +
        '</div></div></div>';
    return build(partyId, { R: '', w1: hwStatus(hw1, student.id), w2: hwStatus(hw2, student.id), w1date: w1sub && w1sub.completedDate, monster: monster });
  }

  /* on the pupils' own page (alice-party-home/profile.html): statuses come from this device */
  function localStatus(partyId) {
    var w1 = W1_DONE.indexOf(partyId) >= 0 ? 'done' : 'none', w2 = 'none', n2 = 0;
    var CFG = root.PARTY_CONFIG || {};
    var r1 = remoteHw(partyId, CFG.homework || 'alice-tea-party-a1plus'), r2 = remoteHw(partyId, 'alice-tea-party-w2');
    if (r1 && r1.finished) w1 = 'done';
    try { var a = JSON.parse(localStorage.getItem('eaa_party_home_a1plus_v1') || '{}'); if (a.done && a.done[partyId]) w1 = 'done'; } catch (e) { /* none */ }
    try { var b = JSON.parse(localStorage.getItem('eaa_party_w2_v1') || '{}'); var d = (b.done && b.done[partyId]) || {}; n2 = ['t1', 't2', 't3'].filter(function (t) { return d[t]; }).length; } catch (e2) { /* none */ }
    if (r2 && r2.steps > n2) n2 = r2.steps;
    w2 = n2 >= 3 ? 'done' : (n2 ? 'started' : 'none');
    return { w1: w1, w2: w2, n2: n2 };
  }
  function pupilPage(partyId) {
    var P = root.PARTY;
    if (!P || !P.find(partyId)) return noCharacter();
    var st = localStatus(partyId);
    var monster = studioHtml();
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
    var w1 = ctx.w1 || 'none', w2 = ctx.w2 || 'none';
    var earned = { ready: w1 === 'done', star: w2 === 'done' };

    /* ---- header: avatar + character ---- */
    var emo = ROLE_EMOJI[key] || '🫖';
    /* left picture: the character picture from the cards (Sühan's is the picture she sent). */
    var useCard = true;
    var cardPhoto = esc(encodeURI(CARD_ + party.photo));
    var cartoonAv = esc(ART_ + 'avatars/a_' + key + '.webp'), cartoonCh = esc(ART_ + 'characters/c_' + key + '.webp');
    var girlAv = key === 'absolem' ? esc(ART_ + 'avatars/a_absolem_girl.webp') : '';   /* Absolem is played by a girl: her own picture in the round frame */
    var avatar = girlAv
      ? '<img src="' + girlAv + '" alt="" data-fb="' + cardPhoto + '|' + emo + '" style="width:100%; height:100%; object-fit:cover; object-position:50% 20%;" onerror="AliceProfile.fb(this)">'
      : useCard
      ? '<img src="' + cardPhoto + '" alt="" data-fb="' + cartoonAv + '|' + emo + '" style="width:100%; height:100%; object-fit:cover; object-position:50% 14%;" onerror="AliceProfile.fb(this)">'
      : ('<img src="' + cartoonAv + '" alt="" data-fb="' + cartoonCh + '|' + emo + '" data-zoom="1" style="width:100%; height:100%; object-fit:cover;" onerror="AliceProfile.fb(this)">');
    var big = '<img src="' + esc(ART_ + 'characters/c_' + key + '.webp') + '" alt="' + esc(role.short) + '" data-fb="' + emo + '" style="display:block; width:100%; height:auto; max-height:230px; object-fit:contain;" onerror="AliceProfile.fb(this)">';
    var head = '<div style="display:flex; gap:18px; align-items:center; flex-wrap:wrap; background:linear-gradient(135deg,#fff7d6,#ffe4f1); border:2px solid #f59e0b; border-radius:18px; padding:16px;">' +
      '<div style="width:110px; height:110px; border-radius:50%; border:4px solid #f59e0b; background:#fff; overflow:hidden; flex:none; display:grid; place-items:center; font-size:3.4rem;">' + avatar + '</div>' +
      '<div style="flex:1; min-width:220px;">' +
        '<div style="font-size:0.72rem; font-weight:900; letter-spacing:0.08em; color:#92400e; text-transform:uppercase;">My story character</div>' +
        '<div style="font-size:1.6rem; font-weight:900; color:#7c2d12; line-height:1.1;">' + esc(role.name) + '</div>' +
        '<div style="font-size:0.9rem; color:#4c1d95; font-weight:700; margin-top:2px;">Class ' + esc(party.classLabel.replace('Class ', '')) + (partners.length ? ' · Partner: ' + partners.map(function (p) { return esc(p.name) + ' (' + esc(P.roles[p.role].short) + ')'; }).join(' + ') : '') + '</div>' +
        '<ul style="margin:8px 0 0; padding-left:20px; font-size:0.95rem;">' + (role.sentences || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '</div>' +
      '<div style="width:150px; flex:none; display:grid; place-items:center; min-height:120px; font-size:4rem;">' + big + '</div>' +
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
        '<div><b>Week 2 · Say it and record it</b><div style="font-size:0.8rem; color:#64748b;">3 short tasks: read, say with family, record 30 seconds · due 15 Oct</div></div>' +
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

  /* ------------------------------------------------------------------------------------------------
     Pupil monster studio (pupil page only): the pupil's monster, a colour to pick and Alice costume items to put on it.
     The costume closet opens for pupils who finished the Week 1 practice (list below, or finished on this device).
     The look is saved on this device and sent to the teacher's Google sheet (tab "Look"), so it can be copied into the platform.
     Costume items use pictures from assets/alice-cut/wear/ (made by Gemini). Items whose picture does not exist yet are not offered. */
  /* Pupils who finished the Week 1 practice (from the Results sheet, 11 Oct). Updated by hand each week until the live status link is switched on. */
  var W1_DONE = ['4a-alya', '4a-belis', '4a-ipek', '4a-suhan', '4b-ozan', '4b-ali', '4b-derin', '4b-egehan', '4b-elif', '4b-kerem', '4b-utku', '4a-ruzgar', '4b-elifberen', '4a-ada', '4b-ozanm', '4a-esila'];
  var REMOTE = null;   /* progress of every pupil from the sheet, once loaded: { partyId: { homework: { steps, finished } } } */
  function loadStatus(cb) {
    var CFG = root.PARTY_CONFIG || {};
    if (!CFG.submitUrl || !CFG.statusSync || typeof fetch !== 'function') return;
    fetch(CFG.submitUrl + '?action=status&token=' + encodeURIComponent(CFG.token || ''))
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.ok && j.status) { REMOTE = j.status; if (cb) cb(); } })
      .catch(function () { /* offline: the saved list and this device's progress are used */ });
  }
  function remoteHw(partyId, hw) { return REMOTE && REMOTE[partyId] && REMOTE[partyId][hw] ? REMOTE[partyId][hw] : null; }
  var DRESS_KEY = 'eaa_alice_dress_v1';
  var LOOK_PENDING_KEY = 'eaa_alice_look_pending_v1';
  var UNLOCKED = ['4a-alya', '4a-belis', '4a-ipek', '4a-suhan', '4b-ozan', '4b-ali', '4b-derin', '4b-egehan', '4b-elif', '4b-kerem', '4b-utku', '4a-ruzgar'];
  /* The closet uses the platform's own monster customization (the drawn monsters), with only Alice things in the menu.
     [item id in the platform, slot, name, emoji, week that unlocks it]. Week 1 opens 4, Week 2 opens 4 more, the last 4 wait for Week 3. */
  var ITEMS = [
    ['hat-bow', 'hat', "Alice's bow", '🎀', 1], ['glasses-round', 'glasses', "Rabbit's glasses", '👓', 1], ['clothing-vest', 'clothing', "Rabbit's waistcoat", '🦺', 1], ['acc-book', 'accessory', 'Storybook', '📖', 1],
    ['hat-crown', 'hat', "Red Queen's crown", '👑', 2], ['hat-explorer', 'hat', "Hatter's hat", '🎩', 2], ['neck-medal', 'accessory', 'Tea Party medal', '🏅', 2], ['clothing-cape', 'clothing', "Queen's cape", '🧣', 2],
    ['hat-flower', 'hat', 'Garden flower', '🌸', 3], ['wings-fairy', 'wings', 'Wonderland wings', '🧚', 3], ['clothing-royal-robe', 'clothing', "White Queen's robe", '👘', 3], ['glasses-star', 'glasses', 'Star glasses', '⭐', 3]
  ];
  var LAST_WEEK = 2;   /* weeks that exist so far; week 3 items show "Soon" */
  function itemOf(id) { return ITEMS.filter(function (w) { return w[0] === id; })[0] || null; }
  function dressLoad(partyId) {
    var all = {};
    try { all = JSON.parse(localStorage.getItem(DRESS_KEY) || '{}') || {}; } catch (e) { all = {}; }
    var me = all[partyId] || {}, items = {};
    Object.keys(me.items || {}).forEach(function (slot) { var w = itemOf(me.items[slot]); if (w && w[1] === slot) items[slot] = w[0]; });   /* only Alice items */
    var own = (root.ALICE_MONSTER_COLORS || {})[partyId];
    return { all: all, me: { color: own || me.color || 'blue', items: items } };
  }
  function dressSave(partyId, st) {
    st.all[partyId] = st.me;
    try { localStorage.setItem(DRESS_KEY, JSON.stringify(st.all)); } catch (e) { /* storage may be blocked */ }
  }
  /* the drawn monster of the platform with the chosen Alice things on (same drawing the whole platform uses) */
  function monsterSvg(color, size, items) {
    try {
      if (root.MonsterRenderer && root.MonsterRenderer.renderMonsterSVG) return root.MonsterRenderer.renderMonsterSVG({ stage: 'growing', color: color, equipped: Object.assign({}, items || {}), size: size || 260, animated: true, isAvatar: true });
    } catch (e) { /* fall through */ }
    return '<div style="font-size:7rem; text-align:center;">👾</div>';
  }
  function hasWeek1(partyId) { return localStatus(partyId).w1 === 'done'; }

  function studioHtml() {
    return '<div id="al-studio" style="margin-top:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:14px;">' +
      '<h3 style="margin:0 0 4px; font-size:1.05rem;">👾 My monster</h3>' +
      '<p style="margin:0 0 10px; color:#475569; font-size:0.9rem;">This is your own monster. Put on Alice things if you want. Your look is saved and your teacher can see it.</p>' +
      '<div style="display:flex; gap:16px; flex-wrap:wrap; align-items:flex-start;">' +
        '<div id="al-stage" style="position:relative; width:260px; height:260px; flex:none; margin:0 auto;"></div>' +
        '<div style="flex:1; min-width:240px;">' +
          '<div id="al-closet"></div></div></div></div>';
  }

  function wire(host, partyId) {
    var el = host && host.querySelector ? host.querySelector('#al-studio') : null;
    if (!el) return;
    var P = root.PARTY, party = P && P.find(partyId), key = party ? party.roleKey : '';
    var st = dressLoad(partyId);
    var stage = el.querySelector('#al-stage'), closet = el.querySelector('#al-closet');
    var unlocked = UNLOCKED.indexOf(partyId) >= 0 || hasWeek1(partyId);

    /* send the look to the teacher's Google sheet (kept and retried if there is no internet) */
    var CFG = root.PARTY_CONFIG || {};
    function pendingGet() { try { return JSON.parse(localStorage.getItem(LOOK_PENDING_KEY) || '{}'); } catch (e) { return {}; } }
    function pendingSet(o) { try { localStorage.setItem(LOOK_PENDING_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } }
    function flush() {
      if (!CFG.submitUrl) return;
      var p = pendingGet();
      Object.keys(p).forEach(function (id) {
        fetch(CFG.submitUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(p[id]) })
          .then(function () { var cur = pendingGet(); if (JSON.stringify(cur[id]) === JSON.stringify(p[id])) { delete cur[id]; pendingSet(cur); } })
          .catch(function () { /* retry later */ });
      });
    }
    var sendTimer = null;
    function sendLook() {
      if (!CFG.submitUrl || !CFG.lookSync) return;   /* lookSync is switched on in alice-party-home/config.js once the sheet script has been updated */
      clearTimeout(sendTimer);
      sendTimer = setTimeout(function () {
        var p = pendingGet();
        p[partyId] = { token: CFG.token, type: 'look', studentId: partyId, name: party.name, classLabel: party.classLabel, character: party.role.short, color: st.me.color, items: st.me.items, at: new Date().toISOString() };
        pendingSet(p); flush();
      }, 1200);
    }
    function save() { dressSave(partyId, st); sendLook(); }
    window.addEventListener('online', flush);

    function drawStage() {
      stage.innerHTML = '<div style="position:absolute; inset:0; z-index:2;">' + monsterSvg(st.me.color, 260, st.me.items) + '</div>';
    }
    function btn(label, attrs) {
      return '<button type="button" ' + attrs + ' style="font:inherit; font-weight:800; font-size:0.85rem; padding:6px 12px; border-radius:12px; cursor:pointer; margin:3px; border:2px solid #cbd5e1; background:#fff; color:#1e1b4b;">' + label + '</button>';
    }
    var week2 = localStatus(partyId).w2 === 'done';
    function open(w) { return w === 1 ? unlocked : (w === 2 ? week2 : false); }
    function drawCloset() {
      var nOpen = ITEMS.filter(function (w) { return open(w[4]); }).length;
      var html = '<div style="font-weight:800; font-size:0.9rem; color:#7c2d12; margin-bottom:6px;">🎩 My Alice closet · ' + nOpen + ' of ' + ITEMS.length + ' open</div>' +
        '<div style="font-size:0.8rem; color:#64748b; margin-bottom:6px;">Finish Week 1 to open 4 things. Finish Week 2 to open 4 more.</div><div style="display:flex; flex-wrap:wrap;">';
      ITEMS.forEach(function (w) {
        var ok = open(w[4]), on = st.me.items[w[1]] === w[0];
        var lock = ok ? '' : '<span style="font-size:0.62rem; font-weight:800; color:#92400e;">🔒 ' + (w[4] > LAST_WEEK ? 'Soon' : 'Week ' + w[4]) + '</span>';
        html += '<button type="button" data-w="' + w[0] + '" data-cat="' + w[1] + '" ' + (ok ? '' : 'disabled ') + 'title="' + esc(w[2]) + '" style="width:86px; min-height:84px; padding:4px 3px; margin:3px; border-radius:12px; cursor:' + (ok ? 'pointer' : 'not-allowed') + '; background:' + (on ? '#fff7d6' : '#fff') + '; border:2px solid ' + (on ? '#f59e0b' : '#cbd5e1') + '; opacity:' + (ok ? 1 : 0.55) + '; font:inherit; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">' +
          '<span style="font-size:1.9rem; line-height:1;' + (ok ? '' : ' filter:grayscale(0.8);') + '">' + w[3] + '</span><span style="font-size:0.7rem; font-weight:800; color:#1e1b4b; line-height:1.15;">' + esc(w[2]) + '</span>' + lock + '</button>';
      });
      html += '</div>';
      if (!unlocked) html += '<div style="margin-top:8px;"><a class="btn-sm-secondary" href="index.html?s=' + esc(partyId) + '" style="text-decoration:none;">Open Week 1</a></div>';
      else if (!week2) html += '<div style="margin-top:8px;"><a class="btn-sm-secondary" href="week2.html?s=' + esc(partyId) + '" style="text-decoration:none;">Open Week 2</a></div>';
      if (Object.keys(st.me.items).length) html += '<div>' + btn('🧹 Take all off', 'data-clear="1"') + '</div>';
      closet.innerHTML = html;
      closet.querySelectorAll('button[data-w]').forEach(function (b) { b.addEventListener('click', function () {
        var cat = b.getAttribute('data-cat'), id = b.getAttribute('data-w');
        if (st.me.items[cat] === id) delete st.me.items[cat]; else st.me.items[cat] = id;
        save(); drawCloset(); drawStage();
      }); });
      var clr = closet.querySelector('button[data-clear]'); if (clr) clr.addEventListener('click', function () { st.me.items = {}; save(); drawCloset(); drawStage(); });
    }
    drawStage(); drawCloset(); flush();
  }

  root.AliceProfile = { html: html, pupilPage: pupilPage, wire: wire, fb: fb, loadStatus: loadStatus, map: MAP, unlocked: UNLOCKED };
})(window);
