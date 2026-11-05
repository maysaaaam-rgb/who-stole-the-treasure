/* Practice Island — the Island Wall & Living Class Plaza: a safe, lively class hangout space.
   Pupils hang out in the 3D Sunny Class Plaza with their classmates' monsters, wave/cheer/dance together,
   post a drawing, a photo or a few words (teacher-moderated), react with ready-made reactions,
   visit classmates' decorated Sunny Beach Corners, send a High-Five, give a copy of a sticker, and play solo or for their team. */
(function (root) {
  'use strict';

  var REACTIONS = ['⭐', '👏', '❤️', '😂', '🤩'];
  var STARTERS = ['Today I ', 'I like ', 'My monster is ', 'I can ', 'Look! This is ', 'Thank you, '];
  var COLORS = ['#0f172a', '#ef4444', '#f59e0b', '#fde047', '#10b981', '#38bdf8', '#a855f7', '#ec4899', '#ffffff'];
  var PHOTO_MAX = 800, PHOTO_Q = 0.7;

  var PLAZA_SPOTS = [
    { x: 16, y: 72 },
    { x: 34, y: 66 },
    { x: 66, y: 66 },
    { x: 84, y: 72 },
    { x: 25, y: 78 },
    { x: 75, y: 78 }
  ];

  var W = {
    tab: 'wall',
    feed: [],
    people: null,
    teams: [],
    me: '',
    compose: null,
    visiting: null,
    _peekAsked: false,
    myPos: { x: 50, y: 74 },
    myBubble: '👋 Hi class!'
  };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ses() { var st = root.IslandApp && root.IslandApp.state(); return st && st.session; }
  function client() { return root.AdventureSupabase && root.AdventureSupabase.client; }
  function $(id) { return document.getElementById(id); }
  function tap() { if (root.IslandAudio && root.IslandAudio.playTap) root.IslandAudio.playTap(); }
  function say(t) { if (root.IslandAudio) root.IslandAudio.speak(t); }

  /* ---------- demo data: lives only in this browser ---------- */
  var DEMO_KEY = 'eaa_island_demo_wall_v2';
  var DEMO_CORNERS = {
    'demo-a': [{ id: 'd_palm', x: 16, y: 56 }, { id: 'd_sandcastle', x: 34, y: 74 }, { id: 't_robot', x: 68, y: 66 }, { id: 't_light', x: 84, y: 56 }],
    'demo-b': [{ id: 'd_hut', x: 20, y: 58 }, { id: 'd_boat', x: 72, y: 72 }, { id: 't_robot', x: 84, y: 60 }],
    'demo-c': [{ id: 'd_palm', x: 15, y: 54 }, { id: 'd_campfire', x: 34, y: 72 }, { id: 't_robot', x: 66, y: 66 }, { id: 't_light', x: 78, y: 56 }, { id: 't_basket', x: 86, y: 72 }],
    'demo-d': [{ id: 'd_umbrella', x: 22, y: 60 }, { id: 'd_ball', x: 68, y: 74 }, { id: 'd_shell_pile', x: 82, y: 70 }]
  };
  var DEMO_EQUIPPED = {
    'demo-a': { hat: 'hat-crown', glasses: 'glasses-star' },
    'demo-b': { hat: 'hat-cap' },
    'demo-c': { hat: 'hat-wizard', glasses: 'glasses-round' },
    'demo-d': {}
  };

  function demoLoad() {
    try {
      var raw = localStorage.getItem(DEMO_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.people)) {
          parsed.people.forEach(function (p) {
            if (!p.corner && DEMO_CORNERS[p.id]) p.corner = DEMO_CORNERS[p.id];
            if ((!p.equipped || !Object.keys(p.equipped).length) && DEMO_EQUIPPED[p.id]) p.equipped = DEMO_EQUIPPED[p.id];
          });
        }
        return parsed;
      }
    } catch (e) { /* start fresh */ }
    var now = Date.now();
    return {
      posts: [
        { id: 'd1', student_id: 'demo-a', first_name: 'Sky', kind: 'post', body: 'Look! This is my monster with a big crown!', status: 'approved', created_at: new Date(now - 3600000).toISOString(), reactions: { '⭐': 3, '😂': 2 }, my_reaction: null, has_photo: false },
        { id: 'd2', student_id: 'demo-b', first_name: 'River', kind: 'news', body: 'got 3 stars on a mission!', status: 'approved', created_at: new Date(now - 7200000).toISOString(), reactions: { '👏': 4 }, my_reaction: null, has_photo: false },
        { id: 'd3', student_id: 'demo-c', first_name: 'Sunny', kind: 'post', body: 'I can make a machine. It makes socks!', status: 'approved', created_at: new Date(now - 90000000).toISOString(), reactions: { '🤩': 2 }, my_reaction: null, has_photo: false }
      ],
      photos: {},
      gifts: [{ from: 'Sky', sticker: 'st_z1_3' }],
      people: [
        { id: 'demo-a', first_name: 'Sky', color: 'pink', equipped: DEMO_EQUIPPED['demo-a'], level: 3, solo: false, stars: 14, zones: 2, stickers: 8, corner: DEMO_CORNERS['demo-a'] },
        { id: 'demo-b', first_name: 'River', color: 'blue', equipped: DEMO_EQUIPPED['demo-b'], level: 2, solo: false, stars: 9, zones: 1, stickers: 5, corner: DEMO_CORNERS['demo-b'] },
        { id: 'demo-c', first_name: 'Sunny', color: 'gold', equipped: DEMO_EQUIPPED['demo-c'], level: 4, solo: true, stars: 21, zones: 3, stickers: 12, corner: DEMO_CORNERS['demo-c'] },
        { id: 'demo-d', first_name: 'Robin', color: 'green', equipped: DEMO_EQUIPPED['demo-d'], level: 1, solo: false, stars: 3, zones: 1, stickers: 2, corner: DEMO_CORNERS['demo-d'] }
      ],
      teams: [{ id: 't1', name: 'Rockets', color: '#38bdf8', members: ['demo-a', 'demo-b'] }, { id: 't2', name: 'Comets', color: '#f59e0b', members: ['demo-c', 'demo-d'] }]
    };
  }
  function demoSave(d) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(d)); } catch (e) { /* demo only */ } }

  /* ---------- talking to the cloud (or the demo) ---------- */
  var api = {
    feed: async function () {
      var s = ses();
      if (s.isDemo) return demoLoad().posts.slice().sort(function (a, b) { return String(b.created_at).localeCompare(a.created_at); }).map(function (p) { return Object.assign({ mine: p.student_id === s.student.id }, p); });
      var r = await client().rpc('wall_feed', { p_code: s.code });
      return r.error ? null : (r.data || []);
    },
    photo: async function (id) {
      var s = ses();
      if (s.isDemo) return demoLoad().photos[id] || null;
      var r = await client().rpc('wall_photo', { p_code: s.code, p_id: id });
      return r.error ? null : r.data;
    },
    post: async function (body, photo) {
      var s = ses();
      if (s.isDemo) {
        var d = demoLoad(), id = 'p' + Date.now();
        if (photo) d.photos[id] = photo;
        d.posts.unshift({ id: id, student_id: s.student.id, first_name: s.student.firstName || 'Me', kind: 'post', body: body, status: 'pending', created_at: new Date().toISOString(), reactions: {}, my_reaction: null, has_photo: !!photo });
        demoSave(d);
        return { ok: true };
      }
      var r = await client().rpc('wall_post', { p_code: s.code, p_body: body, p_photo: photo });
      return r.error ? { ok: false, why: 'net' } : r.data;
    },
    react: async function (id, emoji) {
      var s = ses();
      if (s.isDemo) {
        var d = demoLoad(), p = d.posts.filter(function (x) { return x.id === id; })[0];
        if (p) { if (p.my_reaction) p.reactions[p.my_reaction] = Math.max(0, (p.reactions[p.my_reaction] || 1) - 1); p.my_reaction = emoji; p.reactions[emoji] = (p.reactions[emoji] || 0) + 1; demoSave(d); }
        return true;
      }
      var r = await client().rpc('wall_react', { p_code: s.code, p_id: id, p_emoji: emoji });
      return !r.error && r.data;
    },
    people: async function () {
      var s = ses();
      if (s.isDemo) {
        var d = demoLoad(), doc = s.doc || {}, stars = doc.stars || {};
        var mine = Object.keys(stars).filter(function (k) { return /-m\d+$/.test(k); });
        var me = { id: s.student.id, first_name: s.student.firstName || 'Me', color: (s.student.monsterProfile || {}).baseColor || 'blue', equipped: Object.assign({}, (s.student.monsterProfile || {}).equipped || {}, doc.look || {}), level: 3, solo: !!doc.solo,
          stars: mine.reduce(function (a, k) { return a + (Number(stars[k]) || 0); }, 0), zones: new Set(mine.map(function (k) { return k.split('-')[1]; })).size,
          stickers: Object.keys((doc.collection && doc.collection.stickers) || {}).filter(function (k) { return /^st_z/.test(k); }).length };
        var teams = d.teams.map(function (t) { return t.id === 't1' ? Object.assign({}, t, { members: t.members.concat(me.id) }) : t; });
        return { me: me.id, people: d.people.concat(me), teams: teams };
      }
      var r = await client().rpc('wall_people', { p_code: s.code });
      return r.error ? null : r.data;
    },
    gift: async function (to, sticker) {
      var s = ses();
      if (s.isDemo) return { ok: true };
      var r = await client().rpc('wall_gift', { p_code: s.code, p_to: to, p_sticker: sticker });
      return r.error ? { ok: false, why: 'net' } : r.data;
    },
    openGifts: async function () {
      var s = ses();
      if (s.isDemo) { var d = demoLoad(), g = d.gifts || []; d.gifts = []; demoSave(d); return g; }
      var r = await client().rpc('wall_open_gifts', { p_code: s.code });
      return r.error ? [] : (r.data || []);
    },
    news: async function (kind, n) {
      var s = ses();
      if (s.isDemo) {
        var d = demoLoad(), text = kind === 'stars' ? 'got 3 stars on a mission!' : kind === 'level' ? 'has a stronger monster now: Level ' + n + '!' : 'opened a treasure chest in Zone ' + n + '!';
        d.posts.unshift({ id: 'n' + Date.now(), student_id: s.student.id, first_name: s.student.firstName || 'Me', kind: 'news', body: text, status: 'approved', created_at: new Date().toISOString(), reactions: {}, my_reaction: null, has_photo: false });
        demoSave(d);
        return;
      }
      try { await client().rpc('wall_news', { p_code: s.code, p_kind: kind, p_n: n || null }); } catch (e) { /* good news can wait */ }
    }
  };

  /* ---------- monsters of classmates, as small pictures ---------- */
  var monsterCache = {};
  function monsterPic(p, size) {
    var color = String(p.color || 'blue');
    var key = color + '|' + p.level + '|' + JSON.stringify(p.equipped || {});
    if (!monsterCache[key] && root.MonsterRenderer) {
      var stages = ['egg', 'cracking_egg', 'baby', 'growing', 'adventurer', 'advanced', 'ultimate'];
      try {
        var svg = root.MonsterRenderer.renderMonsterSVG({ stage: stages[Math.max(0, Math.min(6, (p.level || 1) - 1))], color: color, equipped: p.equipped || {}, size: 200, animated: false, isAvatar: true });
        monsterCache[key] = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      } catch (e) { monsterCache[key] = ''; }
    }
    return monsterCache[key] ? '<img class="wl-mon" src="' + monsterCache[key] + '" alt="" style="width:' + size + 'px;height:' + size + 'px">' : '<span style="font-size:' + Math.round(size * 0.6) + 'px">🐣</span>';
  }

  /* ---------- Social Network: Player Pro Rating & 5-Star Island Reviews ---------- */
  var RATING_STORE_KEY = 'eaa_island_social_ratings_v1';
  function loadSocialRatings() {
    try { return JSON.parse(localStorage.getItem(RATING_STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveSocialRatings(obj) {
    try { localStorage.setItem(RATING_STORE_KEY, JSON.stringify(obj)); } catch (e) { /* ignore */ }
  }
  function calcPersonProStats(p) {
    if (!p) return { rating: '3.5', proScore: 180, houseName: 'Straw Hut', houseTier: 2, sportsWins: 1, title: '🧭 Explorer' };
    if (p.id === W.me && root.WorldGame && root.WorldGame.getPlayerRating) {
      var myR = root.WorldGame.getPlayerRating();
      var tiers = ['Cosy Tent', 'Straw Hut', 'Red-Roof Cottage', 'Two-Floor House', 'Fairy-Tale Castle'];
      return {
        rating: myR.ratingFixed,
        proScore: myR.proScore,
        houseTier: myR.houseTier,
        houseName: tiers[Math.max(0, Math.min(4, myR.houseTier - 1))],
        sportsWins: myR.sportsWins,
        title: myR.rankTitle
      };
    }
    var ratings = loadSocialRatings();
    var myVote = Number(ratings[p.id]) || 0;
    var stars = Number(p.stars) || 6;
    var zones = Number(p.zones) || 1;
    var stickers = Number(p.stickers) || 3;
    var lvl = Number(p.level) || 2;
    var hTier = p.id === 'demo-c' ? 4 : (p.id === 'demo-a' ? 3 : 2);
    var spWins = p.id === 'demo-a' ? 4 : (p.id === 'demo-c' ? 5 : (p.id === 'demo-b' ? 2 : 1));
    var baseScore = (stars * 14) + (zones * 65) + (stickers * 12) + (lvl * 45) + (hTier * 55) + (spWins * 30) + (myVote * 15);
    var rawRate = Math.min(5.0, 2.4 + (stars / 25) * 1.1 + (lvl / 5) * 0.7 + (hTier / 5) * 0.5 + (myVote ? (myVote - 3) * 0.12 : 0.2));
    var rFixed = (Math.round(rawRate * 10) / 10).toFixed(1);
    var tiers2 = ['Cosy Tent', 'Straw Hut', 'Red-Roof Cottage', 'Two-Floor House', 'Fairy-Tale Castle'];
    var title = rawRate >= 4.5 ? '👑 Island Legend' : (rawRate >= 3.8 ? '🏆 Pro Builder' : '🧭 Island Explorer');
    return {
      rating: rFixed,
      proScore: baseScore,
      houseTier: hTier,
      houseName: tiers2[hTier - 1] || 'Straw Hut',
      sportsWins: spWins,
      myVote: myVote,
      title: title
    };
  }

  function byId(id) { return ((W.people && W.people.people) || []).filter(function (p) { return p.id === id; })[0]; }

  function latestBubbleFor(person) {
    var posts = (W.feed || []).filter(function (f) { return f.student_id === person.id && f.status !== 'pending'; });
    if (posts.length && posts[0].body) {
      var b = posts[0].kind === 'news' ? ('🎉 ' + posts[0].body) : posts[0].body;
      return b.length > 36 ? b.slice(0, 34) + '…' : b;
    }
    if ((person.stars || 0) >= 10) return '⭐ ' + person.stars + ' stars!';
    return '👋 Hi friends!';
  }

  /* ---------- screens ---------- */
  function shell(inner) {
    var tabs = [['wall', '🌟 Class Plaza'], ['friends', '🏡 Visit & Rate Islands'], ['team', '🏆 Pro Rankings & Teams']];
    return '<div class="wl" id="wl">' +
      '<header class="wl-top"><button type="button" class="wl-btn wl-x" onclick="IslandWall.close()" aria-label="Back to the island">◀ 🏝️ Island</button>' +
        '<div class="wl-tabs">' + tabs.map(function (t) { return '<button type="button" class="wl-btn wl-tab' + (W.tab === t[0] ? ' on' : '') + '" onclick="IslandWall.tab(\'' + t[0] + '\')">' + t[1] + '</button>'; }).join('') + '</div>' +
      '</header><main class="wl-main" id="wl-main">' + inner + '</main></div>';
  }
  function timeAgo(iso) {
    var d = (Date.now() - new Date(iso).getTime()) / 60000;
    if (d < 60) return 'today';
    if (d < 1440) return new Date(iso).toDateString() === new Date().toDateString() ? 'today' : 'yesterday';
    var days = Math.max(1, Math.round(d / 1440)); return days === 1 ? 'yesterday' : days + ' days ago';
  }
  function postCard(p) {
    var person = byId(p.student_id);
    var pending = p.status === 'pending';
    var news = p.kind === 'news';
    var visitBtn = (!p.mine && p.student_id)
      ? '<button type="button" class="wl-btn wl-visit-mini" onclick="IslandWall.visit(\'' + esc(p.student_id) + '\')">🏖️ Visit Beach</button>'
      : '';
    var react = pending ? '<div class="wl-wait">⏳ ' + esc('Your teacher will look at this soon. Only you can see it now.') + '</div>'
      : '<div class="wl-reacts">' + REACTIONS.map(function (e) {
        var n = (p.reactions && p.reactions[e]) || 0;
        return '<button type="button" class="wl-react' + (p.my_reaction === e ? ' on' : '') + '" onclick="IslandWall.react(\'' + esc(p.id) + '\',\'' + e + '\')">' + e + (n ? ' <b>' + n + '</b>' : '') + '</button>';
      }).join('') + visitBtn + '</div>';
    return '<article class="wl-post' + (news ? ' wl-news' : '') + (pending ? ' wl-pending' : '') + '">' +
      '<div class="wl-head">' + (person ? monsterPic(person, 54) : '<span class="wl-dot">🐾</span>') +
        '<div style="flex:1"><b>' + esc(p.first_name) + (p.mine ? ' (you)' : '') + '</b><small>' + timeAgo(p.created_at) + '</small></div></div>' +
      (p.has_photo ? '<div class="wl-photo" data-photo="' + esc(p.id) + '"><span class="wl-photo-load">🖼️</span></div>' : '') +
      (p.body ? '<p class="wl-body' + (news ? ' wl-body-news' : '') + '">' + (news ? '🎉 ' + esc(p.first_name) + ' ' : '') + esc(p.body) + '</p>' : '') +
      react +
    '</article>';
  }

  function plazaStageHtml() {
    var ppl = ((W.people && W.people.people) || []).filter(function (p) { return p.id !== W.me; }).slice(0, 6);
    var meObj = byId(W.me) || { id: 'me', first_name: (ses() && ses().student && ses().student.firstName) || 'Me', color: 'blue', level: 3, equipped: {} };

    var friendsInPlaza = ppl.map(function (p, i) {
      var sp = PLAZA_SPOTS[i] || { x: 20 + i * 15, y: 60 };
      var bubble = latestBubbleFor(p);
      return '<button type="button" class="wl-plaza-actor wl-plaza-friend" id="plaza-friend-' + esc(p.id) + '" ' +
        'style="left:' + sp.x + '%;top:' + sp.y + '%" onclick="event.stopPropagation(); IslandWall.visit(\'' + esc(p.id) + '\')" title="Visit ' + esc(p.first_name) + '\'s Beach Camp">' +
          '<span class="wl-plaza-bubble">' + esc(bubble) + '</span>' +
          '<span class="wl-plaza-sprite">' + monsterPic(p, 84) + '</span>' +
          '<span class="wl-plaza-pedestal"></span>' +
          '<span class="wl-plaza-name">👋 ' + esc(p.first_name) + ' <small>Lv.' + (p.level || 1) + '</small></span>' +
        '</button>';
    }).join('');

    var myActor =
      '<div class="wl-plaza-actor wl-plaza-me" id="wl-plaza-me" style="left:' + W.myPos.x + '%;top:' + W.myPos.y + '%">' +
        '<span class="wl-plaza-bubble wl-my-bubble" id="wl-my-bubble">' + esc(W.myBubble || '👋 Hi class!') + '</span>' +
        '<span class="wl-plaza-sprite">' + monsterPic(meObj, 94) + '</span>' +
        '<span class="wl-plaza-pedestal my-pedestal"></span>' +
        '<span class="wl-plaza-name my-name">⭐ ' + esc(meObj.first_name) + ' (You)</span>' +
      '</div>';

    return '<section class="wl-plaza-wrap">' +
      '<div class="wl-plaza-stage" id="wl-plaza-stage" onclick="IslandWall.walkPlaza(event)">' +
        '<div class="wl-plaza-hint">✨ Tap the plaza to walk around · Tap any classmate to visit their Beach Camp!</div>' +
        '<div class="wl-plaza-campfire"><img src="art/d_campfire.webp" alt=""></div>' +
        friendsInPlaza +
        myActor +
        '<div class="wl-plaza-fx" id="wl-plaza-fx"></div>' +
      '</div>' +
      '<div class="wl-plaza-bar">' +
        '<div class="wl-emote-group">' +
          '<button type="button" class="wl-btn wl-emote-btn" onclick="IslandWall.emote(\'👋\',\'Hello friends!\')">👋 Wave</button>' +
          '<button type="button" class="wl-btn wl-emote-btn" onclick="IslandWall.emote(\'🎉\',\'You are doing an awesome job!\')">🎉 Cheer</button>' +
          '<button type="button" class="wl-btn wl-emote-btn" onclick="IslandWall.emote(\'❤️\',\'High five! Awesome beach corner!\')">❤️ High-Five</button>' +
          '<button type="button" class="wl-btn wl-emote-btn" onclick="IslandWall.emote(\'💃\',\'Let us practice English together!\')">💃 Dance</button>' +
        '</div>' +
        '<button type="button" class="wl-btn wl-new-inline" onclick="IslandWall.compose()">✏️ Draw or Post on the Board</button>' +
      '</div>' +
    '</section>';
  }

  function wallView() {
    var list = W.feed || [];
    return plazaStageHtml() +
      '<div class="wl-board-header"><h3>📌 Class Plaza Board</h3><span>Approve-safe class drawings, photos & good news</span></div>' +
      (list.length ? '<div class="wl-feed">' + list.map(postCard).join('') + '</div>'
        : '<div class="wl-empty"><div style="font-size:3rem">🌴</div><b>The Plaza Board is empty.</b><p>Tap "Draw or Post on the Board" to share the first message!</p></div>');
  }
  function friendsView() {
    var ppl = (W.people && W.people.people) || [];
    if (!ppl.length) return '<div class="wl-empty"><b>No classmates here yet.</b></div>';
    return '<div class="wl-board-header" style="margin-bottom:10px"><h3>🏡 Classmates\' Islands & Pro Ratings</h3><span>Visit any classmate\'s 2D Home Island, rate their design, or send a gift!</span></div>' +
      '<div class="wl-grid">' + ppl.filter(function (p) { return p.id !== W.me; }).map(function (p) {
      var st = calcPersonProStats(p);
      return '<button type="button" class="wl-friend" onclick="IslandWall.visit(\'' + esc(p.id) + '\')">' +
        '<div style="display:flex;justify-content:space-between;width:100%;font-size:12px;font-weight:800;color:#fde047;margin-bottom:4px">' +
          '<span>⭐ ' + st.rating + '</span>' +
          '<span style="color:#38bdf8">🏆 ' + st.proScore + ' pts</span>' +
        '</div>' +
        monsterPic(p, 104) +
        '<b>' + esc(p.first_name) + ' <small style="color:#a7f3d0;font-weight:700">Lv.' + (p.level || 1) + '</small></b>' +
        '<small style="color:#cbd5e1">' + esc(st.houseName) + ' · ⚽ ' + st.sportsWins + ' Wins</small>' +
        '<span style="margin-top:6px;display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(56,189,248,0.18);border:1px solid rgba(56,189,248,0.4);color:#7dd3fc;font-size:11px;font-weight:800">🏡 Visit & Rate Island ▶</span>' +
      '</button>';
    }).join('') + '</div>';
  }
  function cornerItemsFor(p) {
    if (p && Array.isArray(p.corner) && p.corner.length) return p.corner;
    if (p && DEMO_CORNERS[p.id]) return DEMO_CORNERS[p.id];
    var items = [
      { id: 'd_palm', x: 16, y: 56 },
      { id: 'd_sandcastle', x: 34, y: 74 },
      { id: 'd_umbrella', x: 78, y: 60 }
    ];
    var z = Number(p && p.zones) || 0;
    if (z >= 1) items.push({ id: 't_robot', x: 66, y: 68 });
    if (z >= 2) items.push({ id: 't_light', x: 84, y: 56 });
    if (z >= 3) items.push({ id: 't_basket', x: 28, y: 66 });
    if (z >= 4) items.push({ id: 't_rocket', x: 74, y: 74 });
    return items;
  }
  function visitView(p) {
    if (!p) return friendsView();
    var decos = (root.IslandRewards && root.IslandRewards.DECORATIONS) || [];
    var cItems = cornerItemsFor(p);
    var decosHtml = cItems.map(function (it) {
      var def = decos.filter(function (d) { return d.id === it.id; })[0];
      var pic = def ? def.pic : it.id;
      var name = def ? def.name : it.id;
      return '<div class="wl-visit-deco" style="left:' + it.x + '%;top:' + it.y + '%"><img src="art/' + esc(pic) + '.webp" alt="' + esc(name) + '" title="' + esc(name) + '"></div>';
    }).join('');
    return '<div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">' +
        '<button type="button" class="wl-btn wl-back" onclick="IslandWall.tab(\'wall\')">◀ 🌟 Class Plaza</button>' +
        '<button type="button" class="wl-btn wl-back" onclick="IslandWall.visit(null)">👋 All Classmates</button>' +
      '</div>' +
      '<div class="wl-profile">' +
        '<div class="wl-visit-corner" id="wl-visit-corner">' +
          decosHtml +
          '<div class="wl-visit-mon" id="wl-visit-mon">' +
            monsterPic(p, 136) +
            '<div class="isl-map-pedestal" style="width:92px;height:22px;margin:-12px auto 0"></div>' +
          '</div>' +
          '<div class="wl-visit-fx" id="wl-visit-fx"></div>' +
        '</div>' +
        (function () {
          var pst = calcPersonProStats(p);
          var starBtns = [1, 2, 3, 4, 5].map(function (n) {
            var on = (pst.myVote || 0) >= n;
            return '<button type="button" class="wl-btn" style="min-width:38px;min-height:36px;padding:4px 8px;font-size:1.05rem;background:' + (on ? 'linear-gradient(180deg,#f59e0b,#d97706)' : 'rgba(15,23,42,0.8)') + ';border-color:' + (on ? '#fde047' : 'rgba(148,163,184,0.3)') + '" onclick="IslandWall.rateFriend(\'' + esc(p.id) + '\',' + n + ')">' + (on ? '⭐' : '☆') + '</button>';
          }).join('');
          return '<h2>🏖️ ' + esc(p.first_name) + '\'s Island (' + esc(pst.title) + ')</h2>' +
            '<div class="wl-chips">' +
              '<span style="border-color:#fde047;color:#fde047">⭐ ' + pst.rating + ' / 5.0 Rating</span>' +
              '<span style="border-color:#38bdf8;color:#7dd3fc">🏆 ' + pst.proScore + ' Pro Pts</span>' +
              '<span>🏡 ' + esc(pst.houseName) + '</span>' +
              '<span>⚽ ' + pst.sportsWins + ' Sports Wins</span>' +
              '<span>🌟 Lv.' + (p.level || 1) + ' · ' + (p.stars || 0) + ' ★</span>' +
            '</div>' +
            '<div style="margin:10px auto;padding:8px 14px;border-radius:14px;background:rgba(15,23,42,0.75);border:1px solid rgba(250,204,21,0.3);display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center">' +
              '<b style="font-size:0.88rem;color:#fde047">🌟 Rate ' + esc(p.first_name) + '\'s Island:</b>' +
              starBtns +
              (pst.myVote ? '<small style="color:#6ee7b7;font-weight:800">✓ You rated ' + pst.myVote + '/5 ⭐</small>' : '<small style="color:#94a3b8">(+5 🪙 reward!)</small>') +
            '</div>';
        })() +
        '<div class="wl-visit-actions">' +
          '<button type="button" class="wl-btn wl-hi5" id="wl-btn-visit2d" style="background:linear-gradient(180deg,#10b981,#059669);border-bottom-color:#064e3b;color:#fff" onclick="IslandWall.visit2DHome(\'' + esc(p.id) + '\')">🏡 Walk in 2D Home</button>' +
          '<button type="button" class="wl-btn wl-hi5" id="wl-btn-hi5" onclick="IslandWall.highFive(\'' + esc(p.id) + '\')">👋 High-Five!</button>' +
          '<button type="button" class="wl-btn wl-gift" id="wl-btn-gift" onclick="IslandWall.giftPicker(\'' + esc(p.id) + '\')">🎁 Give a sticker</button>' +
        '</div>' +
      '</div><div id="wl-gift-area"></div>';
  }
  function teamView() {
    var t = W.people || {}, teams = t.teams || [], mine = teams.filter(function (x) { return (x.members || []).indexOf(W.me) !== -1; })[0];
    var s = ses(), solo = !!(s.doc && s.doc.solo);
    var starsOf = function (team) { return (team.members || []).reduce(function (a, id) { var p = byId(id); return a + (p && !p.solo ? (p.stars || 0) : 0); }, 0); };
    var top = Math.max.apply(null, [1].concat(teams.map(starsOf)));
    var choice = '<div class="wl-choice"><button type="button" class="wl-btn' + (solo ? '' : ' on') + '" onclick="IslandWall.setSolo(false)">🚀 Play for my team</button><button type="button" class="wl-btn' + (solo ? ' on' : '') + '" onclick="IslandWall.setSolo(true)">🦸 Play solo</button></div>';
    if (!teams.length) return choice + '<div class="wl-empty"><div style="font-size:3rem">🚀</div><b>Your teacher will make teams soon!</b></div>';
    var mineCard = mine ? '<section class="wl-team" style="--c:' + esc(mine.color || '#38bdf8') + '"><h2>' + esc(mine.name) + '</h2><div class="wl-grid wl-grid-small">' + (mine.members || []).map(function (id) {
      var p = byId(id); return p ? '<div class="wl-friend wl-mate' + (p.solo ? ' solo' : '') + '" onclick="IslandWall.visit(\'' + esc(p.id) + '\')" style="cursor:pointer">' + monsterPic(p, 80) + '<b>' + esc(p.first_name) + '</b>' + (p.solo ? '<small>🦸 solo</small>' : '<small>🏖️ Visit</small>') + '</div>' : '';
    }).join('') + '</div></section>' : '';
    var allPeople = (t.people || []).slice();
    var ranked = allPeople.map(function (p) {
      return { p: p, st: calcPersonProStats(p) };
    }).sort(function (a, b) { return b.st.proScore - a.st.proScore; });
    var boardHtml = '<section class="wl-race" style="margin-bottom:14px"><h3>🏅 Class Island Pro Leaderboard (Story · Home · Sports · Stars)</h3>' +
      ranked.map(function (row, idx) {
        var p = row.p, st = row.st, isMe = p.id === W.me;
        var medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : '#' + (idx + 1)));
        return '<div class="wl-bar-row" style="padding:8px 12px;border-radius:12px;margin-bottom:6px;background:' + (isMe ? 'rgba(56,189,248,0.18)' : 'rgba(15,23,42,0.65)') + ';border:1px solid ' + (isMe ? '#38bdf8' : 'rgba(148,163,184,0.2)') + ';display:flex;align-items:center;gap:10px;cursor:pointer" onclick="' + (isMe ? 'IslandWall.close()' : 'IslandWall.visit(\'' + esc(p.id) + '\')') + '">' +
          '<b style="min-width:32px;font-size:1.1rem">' + medal + '</b>' +
          monsterPic(p, 44) +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:800;color:#f8fafc">' + esc(p.first_name) + (isMe ? ' (You)' : '') + ' <small style="color:#fde047">⭐ ' + st.rating + '</small></div>' +
            '<div style="font-size:11px;color:#94a3b8">' + esc(st.title) + ' · 🏡 ' + esc(st.houseName) + ' · ⚽ ' + st.sportsWins + ' Wins</div>' +
          '</div>' +
          '<span style="font-weight:900;color:#38bdf8;font-size:0.95rem">🏆 ' + st.proScore + ' pts</span>' +
        '</div>';
      }).join('') +
    '</section>';
    var race = '<section class="wl-race"><h3>⭐ Class Team Star Race</h3>' + teams.slice().sort(function (a, b) { return starsOf(b) - starsOf(a); }).map(function (x) {
      var n = starsOf(x); return '<div class="wl-bar-row"><b>' + esc(x.name) + '</b><div class="wl-bar"><i style="width:' + Math.round(n / top * 100) + '%;background:' + esc(x.color || '#38bdf8') + '"></i></div><span>⭐ ' + n + '</span></div>';
    }).join('') + '</section>';
    return choice + boardHtml + mineCard + race;
  }

  function draw() {
    var m = $('wl-main');
    var inner = W.tab === 'wall' ? wallView() : W.tab === 'team' ? teamView() : (W.visiting ? visitView(byId(W.visiting)) : friendsView());
    if (m) m.innerHTML = inner;
    else $('isl-modal-root').innerHTML = shell(inner);
    loadPhotos();
  }
  function redrawShell() { var inner = W.tab === 'wall' ? wallView() : W.tab === 'team' ? teamView() : (W.visiting ? visitView(byId(W.visiting)) : friendsView()); $('isl-modal-root').innerHTML = shell(inner); loadPhotos(); }

  var photoCache = {};
  function loadPhotos() {
    [].forEach.call(document.querySelectorAll('.wl-photo[data-photo]'), function (el) {
      var id = el.getAttribute('data-photo');
      var put = function (src) { if (src) el.innerHTML = '<img src="' + esc(src) + '" alt="">'; };
      if (photoCache[id]) { put(photoCache[id]); return; }
      api.photo(id).then(function (src) { if (src && /^data:image\//.test(src)) { photoCache[id] = src; put(src); } });
    });
  }

  /* ---------- share something ---------- */
  function composer() {
    var c = W.compose;
    var preview = c.photo ? '<div class="wl-preview"><img src="' + esc(c.photo) + '" alt=""><button type="button" class="wl-btn wl-x" onclick="IslandWall.clearPic()">✕</button></div>' : '';
    $('isl-modal-root').innerHTML =
      '<div class="wl wl-compose" id="wl"><header class="wl-top"><button type="button" class="wl-btn wl-x" onclick="IslandWall.cancelCompose()" aria-label="Back">✕</button><h2>✏️ Share on the Class Plaza Board</h2></header>' +
      '<main class="wl-main">' + preview +
        (c.photo ? '' : '<div class="wl-pick"><button type="button" class="wl-btn wl-big" onclick="IslandWall.openDraw()">🎨 Draw a Picture</button><label class="wl-btn wl-big wl-photo-btn">📷 Add a Photo<input type="file" accept="image/*" id="wl-file" onchange="IslandWall.pickPhoto(this)"></label></div>' +
          '<p class="wl-safe">📷 Photos: ask a grown-up first. No faces of other people, please!</p>') +
        '<div class="wl-starters">' + STARTERS.map(function (s) { return '<button type="button" class="wl-btn wl-starter" onclick="IslandWall.starter(\'' + esc(s) + '\')">' + esc(s.trim()) + '…</button>'; }).join('') + '</div>' +
        '<textarea id="wl-text" maxlength="200" rows="3" placeholder="Write your English sentence here...">' + esc(c.text || '') + '</textarea>' +
        '<button type="button" class="wl-btn wl-send" onclick="IslandWall.send()">📨 Send to my teacher</button>' +
        '<p class="wl-note" id="wl-note">Your teacher looks at it first. Then your class can see it in the Plaza!</p>' +
      '</main></div>';
  }
  function keepText() { var t = $('wl-text'); if (t && W.compose) W.compose.text = t.value; }

  function shrink(file) {
    return new Promise(function (ok, no) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var k = Math.min(1, PHOTO_MAX / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok(c.toDataURL('image/jpeg', PHOTO_Q));
      };
      img.onerror = function () { URL.revokeObjectURL(url); no(new Error('not a picture')); };
      img.src = url;
    });
  }

  /* ---------- the drawing pad ---------- */
  var pad = null;
  function openDraw() {
    keepText();
    $('isl-modal-root').innerHTML =
      '<div class="wl wl-draw" id="wl"><header class="wl-top"><button type="button" class="wl-btn wl-x" onclick="IslandWall.compose(true)" aria-label="Back">✕</button><h2>🎨 Draw for the Plaza</h2></header>' +
      '<main class="wl-main"><canvas id="wl-canvas" width="800" height="600"></canvas>' +
        '<div class="wl-colors">' + COLORS.map(function (c, i) { return '<button type="button" class="wl-color' + (i === 0 ? ' on' : '') + '" style="background:' + c + '" data-c="' + c + '" aria-label="colour"></button>'; }).join('') +
          '<button type="button" class="wl-btn wl-size" data-s="6">●</button><button type="button" class="wl-btn wl-size" data-s="16">⬤</button><button type="button" class="wl-btn" id="wl-undo">↩️</button></div>' +
        '<button type="button" class="wl-btn wl-send" id="wl-draw-done">✅ Done</button>' +
      '</main></div>';
    var cv = $('wl-canvas'), ctx = cv.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    pad = { color: COLORS[0], size: 8, undo: [] };
    var drawing = false, last = null;
    var at = function (e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
    cv.addEventListener('pointerdown', function (e) { e.preventDefault(); cv.setPointerCapture(e.pointerId); pad.undo.push(ctx.getImageData(0, 0, cv.width, cv.height)); if (pad.undo.length > 12) pad.undo.shift(); drawing = true; last = at(e); ctx.fillStyle = pad.color; ctx.beginPath(); ctx.arc(last.x, last.y, pad.size / 2, 0, 7); ctx.fill(); });
    cv.addEventListener('pointermove', function (e) { if (!drawing) return; var p = at(e); ctx.strokeStyle = pad.color; ctx.lineWidth = pad.size; ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p; });
    ['pointerup', 'pointercancel'].forEach(function (n) { cv.addEventListener(n, function () { drawing = false; }); });
    [].forEach.call(document.querySelectorAll('.wl-color'), function (b) { b.onclick = function () { pad.color = b.getAttribute('data-c'); [].forEach.call(document.querySelectorAll('.wl-color'), function (x) { x.classList.toggle('on', x === b); }); }; });
    [].forEach.call(document.querySelectorAll('.wl-size'), function (b) { b.onclick = function () { pad.size = Number(b.getAttribute('data-s')); }; });
    $('wl-undo').onclick = function () { var u = pad.undo.pop(); if (u) ctx.putImageData(u, 0, 0); };
    $('wl-draw-done').onclick = function () { W.compose.photo = cv.toDataURL('image/jpeg', 0.75); composer(); };
  }

  /* ---------- gifts ---------- */
  function stickerList() {
    var R = root.IslandRewards, cat = (R && R.STICKERS) || [];
    var s = ses(), owned = (s.doc && s.doc.collection && s.doc.collection.stickers) || {};
    return cat.filter(function (x) { return owned[x.id] && /^st_z/.test(x.id); });
  }
  function stickerName(id) {
    var cat = (root.IslandRewards && root.IslandRewards.STICKERS) || [];
    return cat.filter(function (x) { return x.id === id; })[0];
  }
  async function checkGifts() {
    var s = ses(); if (!s) return;
    var got = await api.openGifts();
    if (!got || !got.length) return;
    s.doc.collection = s.doc.collection || {}; s.doc.collection.stickers = s.doc.collection.stickers || {};
    got.forEach(function (g) { if (!s.doc.collection.stickers[g.sticker]) s.doc.collection.stickers[g.sticker] = { unlocked: true, shiny: false, gift: true, date: new Date().toISOString().slice(0, 10) }; });
    if (!s.isDemo) root.IslandSync.saveIslandDoc(s);
    W.giftsToShow = got;
    showGifts();
  }
  function showGifts() {
    var g = W.giftsToShow && W.giftsToShow[0], box = $('wl');
    if (!g || !box) return;
    W.giftsToShow = W.giftsToShow.slice(1);
    var st = stickerName(g.sticker) || { name: 'A sticker', icon: '🎁' };
    var el = document.createElement('div'); el.className = 'wl-giftpop';
    el.innerHTML = '<div class="wl-giftcard"><div class="wl-gift-big">' + esc(st.icon || '🎁') + '</div><h2>🎁 A gift from ' + esc(g.from) + '!</h2><p>' + esc(st.name) + '</p><button type="button" class="wl-btn wl-send">Thank you! 😊</button></div>';
    el.querySelector('button').onclick = function () { el.remove(); showGifts(); };
    box.appendChild(el);
    if (root.IslandAudio.playFanfare) root.IslandAudio.playFanfare();
  }

  /* ---------- open ---------- */
  async function refresh() {
    var f = await api.feed(), p = await api.people();
    if (f) W.feed = f;
    if (p) { W.people = p; W.me = p.me; }
    W.offline = !f;
  }
  var pub = {
    open: async function () {
      var s = ses(); if (!s) return;
      tap();
      W.tab = 'wall'; W.visiting = null; W.compose = null;
      document.documentElement.classList.add('adv-on');
      $('isl-modal-root').innerHTML = shell('<div class="wl-empty"><div style="font-size:3rem">🌴</div></div>');
      await refresh();
      if (W.offline) { $('wl-main').innerHTML = '<div class="wl-empty"><div style="font-size:3rem">📶</div><b>The Plaza needs the internet.</b><p>Please try again later.</p></div>'; return; }
      redrawShell();
      checkGifts();
    },
    openFriend: async function (id) {
      var s = ses(); if (!s) return;
      tap();
      W.tab = 'friends'; W.visiting = id; W.compose = null;
      document.documentElement.classList.add('adv-on');
      $('isl-modal-root').innerHTML = shell('<div class="wl-empty"><div style="font-size:3rem">🌴</div></div>');
      await refresh();
      if (W.offline) { $('wl-main').innerHTML = '<div class="wl-empty"><div style="font-size:3rem">📶</div><b>The Plaza needs the internet.</b><p>Please try again later.</p></div>'; return; }
      redrawShell();
      checkGifts();
    },
    walkPlaza: function (ev) {
      var st = $('wl-plaza-stage'), me = $('wl-plaza-me');
      if (!st || !me) return;
      var r = st.getBoundingClientRect();
      var x = Math.round(((ev.clientX - r.left) / r.width) * 100);
      var y = Math.round(((ev.clientY - r.top) / r.height) * 100);
      x = Math.max(12, Math.min(88, x));
      y = Math.max(46, Math.min(84, y));
      var prev = W.myPos || { x: 50, y: 66 };
      var dir = (x < prev.x - 1) ? -1 : ((x > prev.x + 1) ? 1 : (W.myDir || 1));
      W.myDir = dir;
      W.myPos = { x: x, y: y };
      me.style.left = x + '%';
      me.style.top = y + '%';
      me.style.setProperty('--dir', dir);
      me.classList.remove('wl-hi5-hop');
      void me.offsetWidth;
      me.classList.add('wl-hi5-hop');
      var svgEl = me.querySelector('svg');
      if (svgEl && root.MonsterRenderer && root.MonsterRenderer.play) {
        root.MonsterRenderer.play(svgEl, 'cheer', { stay: true, speed: 1.35 });
      }
      var ring = document.createElement('span');
      ring.className = 'wl-tap-ring';
      ring.style.left = x + '%';
      ring.style.top = y + '%';
      st.appendChild(ring);
      setTimeout(function () { if (ring && ring.parentNode) ring.parentNode.removeChild(ring); }, 520);
      if (root.IslandAudio && root.IslandAudio.playHop) root.IslandAudio.playHop();
    },
    emote: function (emoji, spokenLine) {
      if (root.IslandAudio && root.IslandAudio.playSparkle) root.IslandAudio.playSparkle();
      if (spokenLine) say(spokenLine);
      W.myBubble = emoji + ' ' + (spokenLine || '');
      var b = $('wl-my-bubble');
      if (b) b.textContent = W.myBubble;
      var me = $('wl-plaza-me');
      if (me) {
        me.classList.remove('wl-hi5-hop');
        void me.offsetWidth;
        me.classList.add('wl-hi5-hop');
      }
      [].forEach.call(document.querySelectorAll('.wl-plaza-friend'), function (el, idx) {
        setTimeout(function () {
          el.classList.remove('wl-hi5-hop');
          void el.offsetWidth;
          el.classList.add('wl-hi5-hop');
        }, 120 + idx * 90);
      });
      var fx = $('wl-plaza-fx');
      if (fx) {
        fx.innerHTML = '<span class="wl-hi5-pop">' + emoji + ' ✨ 🌟 ' + emoji + '</span>';
        setTimeout(function () { if (fx) fx.innerHTML = ''; }, 1300);
      }
    },
    peekFriends: function () {
      var s = ses();
      if (!s) return [];
      var list = [];
      if (W.people && Array.isArray(W.people.people)) {
        list = W.people.people.filter(function (p) { return p.id !== W.me; });
      } else if (s.isDemo) {
        list = demoLoad().people || [];
      } else if (!W._peekAsked && navigator.onLine) {
        W._peekAsked = true;
        api.people().then(function (p) {
          if (p && Array.isArray(p.people)) {
            W.people = p; W.me = p.me;
            if (root.IslandApp && root.IslandApp.renderMap) root.IslandApp.renderMap();
          }
        });
      }
      return list.slice(0, 3).map(function (p) {
        return {
          id: p.id,
          first_name: p.first_name,
          level: p.level || 1,
          picHtml: monsterPic(p, 58)
        };
      });
    },
    hasGifts: function () {
      var s = ses();
      if (!s || !s.isDemo) return false;
      var d = demoLoad();
      return !!(d.gifts && d.gifts.length);
    },
    close: function () { document.documentElement.classList.remove('adv-on'); $('isl-modal-root').innerHTML = ''; W.compose = null; if (root.IslandApp && root.IslandApp.renderMap) root.IslandApp.renderMap(); },
    tab: function (t) { tap(); W.tab = t; W.visiting = null; redrawShell(); },
    visit: function (id) { tap(); W.tab = id ? 'friends' : W.tab; W.visiting = id; redrawShell(); },
    visit2DHome: function (id) {
      tap();
      var p = byId(id) || { id: id, first_name: 'Friend', color: 'pink', level: 3 };
      if (root.WORLD && root.WORLD.visitFriendHome) {
        pub.close();
        root.WORLD.visitFriendHome(p);
        return;
      }
      var q = new URLSearchParams(root.location.search || '?demo=1');
      q.set('zone', '0');
      q.set('visit', id);
      root.location.href = 'world.html?' + q.toString();
    },
    rateFriend: function (id, stars) {
      tap();
      var p = byId(id);
      var ratings = loadSocialRatings();
      var firstVote = !ratings[id];
      ratings[id] = Math.max(1, Math.min(5, Number(stars) || 5));
      saveSocialRatings(ratings);
      if (root.IslandAudio && root.IslandAudio.playFanfare) root.IslandAudio.playFanfare();
      say('You rated ' + (p ? p.first_name : 'your friend') + 's island ' + ratings[id] + ' stars!');
      if (firstVote && root.WorldGame && root.WorldGame.addBonusCoins) {
        root.WorldGame.addBonusCoins(5);
      }
      redrawShell();
      var a = $('wl-gift-area');
      if (a && p) {
        a.innerHTML = '<p class="wl-note wl-ok">🌟 You rated ' + esc(p.first_name) + '\'s Island <b>' + ratings[id] + ' / 5 Stars</b>!' + (firstVote ? ' (+5 🪙 Kindness Coins!)' : '') + '</p>';
      }
    },
    highFive: function (id) {
      var p = byId(id);
      if (root.IslandAudio && root.IslandAudio.playCorrect) root.IslandAudio.playCorrect();
      if (root.IslandAudio && root.IslandAudio.playSparkle) root.IslandAudio.playSparkle();
      say('High five! Awesome beach corner!');
      var mon = $('wl-visit-mon');
      if (mon) {
        mon.classList.remove('wl-hi5-hop');
        void mon.offsetWidth;
        mon.classList.add('wl-hi5-hop');
      }
      var fx = $('wl-visit-fx');
      if (fx) {
        fx.innerHTML = '<span class="wl-hi5-pop">👋 ✨ 💖 🌟</span>';
        setTimeout(function () { if (fx) fx.innerHTML = ''; }, 1400);
      }
      var a = $('wl-gift-area');
      if (a && p) {
        a.innerHTML = '<p class="wl-note wl-ok">👋 You sent a big High-Five to ' + esc(p.first_name) + '! ✨</p>';
      }
    },
    react: async function (id, e) {
      tap();
      var p = W.feed.filter(function (x) { return x.id === id; })[0]; if (!p) return;
      if (p.my_reaction === e) return;
      if (p.my_reaction) p.reactions[p.my_reaction] = Math.max(0, (p.reactions[p.my_reaction] || 1) - 1);
      p.my_reaction = e; p.reactions = p.reactions || {}; p.reactions[e] = (p.reactions[e] || 0) + 1;
      draw();
      await api.react(id, e);
    },
    compose: function (keep) { tap(); if (!keep || !W.compose) W.compose = { text: '', photo: null }; composer(); },
    cancelCompose: function () { W.compose = null; redrawShell(); },
    clearPic: function () { keepText(); W.compose.photo = null; composer(); },
    starter: function (s) { var t = $('wl-text'); if (!t) return; t.value = s; t.focus(); },
    openDraw: openDraw,
    pickPhoto: async function (input) {
      keepText();
      var f = input.files && input.files[0]; if (!f) return;
      try { W.compose.photo = await shrink(f); composer(); }
      catch (e) { var n = $('wl-note'); if (n) n.textContent = 'That picture did not work. Try another one.'; }
    },
    send: async function () {
      keepText();
      var c = W.compose, n = $('wl-note'); if (!c) return;
      var text = String(c.text || '').trim();
      if (!text && !c.photo) { if (n) n.textContent = 'Draw, add a photo, or write something first!'; return; }
      var btn = document.querySelector('.wl-send'); if (btn) btn.disabled = true;
      var res = await api.post(text, c.photo);
      if (!res || !res.ok) {
        if (btn) btn.disabled = false;
        if (n) n.textContent = res && res.why === 'limit' ? 'That is 5 posts today. Come back tomorrow!' : res && res.why === 'photo' ? 'That picture is too big. Try another one.' : 'It did not send. Please try again.';
        return;
      }
      if (root.IslandAudio.playCorrect) root.IslandAudio.playCorrect();
      W.myBubble = text || '🎨 Look at my picture!';
      W.compose = null; W.tab = 'wall';
      await refresh();
      redrawShell();
    },
    giftPicker: function (toId) {
      tap();
      var a = $('wl-gift-area'), list = stickerList(); if (!a) return;
      a.innerHTML = list.length
        ? '<h3>Which sticker? You keep yours too!</h3><div class="wl-stickers">' + list.map(function (s) { return '<button type="button" class="wl-sticker" onclick="IslandWall.give(\'' + esc(toId) + '\',\'' + esc(s.id) + '\')"><span>' + esc(s.icon || '🎁') + '</span><small>' + esc(s.name) + '</small></button>'; }).join('') + '</div>'
        : '<p class="wl-note">Finish a mission to get your first sticker. Then you can give one!</p>';
    },
    give: async function (toId, stickerId) {
      var a = $('wl-gift-area');
      var r = await api.gift(toId, stickerId);
      if (a) a.innerHTML = r && r.ok ? '<p class="wl-note wl-ok">🎁 Sent! What a kind friend!</p>' : '<p class="wl-note">' + (r && r.why === 'limit' ? 'That is 3 gifts today. Come back tomorrow!' : 'It did not send. Please try again.') + '</p>';
      if (r && r.ok && root.IslandAudio.playCorrect) root.IslandAudio.playCorrect();
    },
    setSolo: function (v) {
      tap();
      var s = ses(); if (!s || !s.doc) return;
      s.doc.solo = !!v;
      if (!s.isDemo) root.IslandSync.saveIslandDoc(s);
      var me = byId(W.me); if (me) me.solo = !!v;
      draw();
    },
    news: function (kind, n) { var s = ses(); if (s && !(s.doc && s.doc.quiet)) api.news(kind, n); },
    _state: W
  };
  void client;
  root.IslandWall = pub;
})(typeof window !== 'undefined' ? window : this);
