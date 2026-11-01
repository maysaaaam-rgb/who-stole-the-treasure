/* Practice Island Teacher Studio — the Island Wall: approve what pupils share, and make the teams.
   Nothing a pupil shares reaches the class until it is approved here. A declined post simply disappears, with no message to the class. */
(function (root) {
  'use strict';

  var DEMO_KEY = 'eaa_island_demo_wall';
  var TEAM_NAMES = ['Rockets', 'Comets', 'Stars', 'Dragons', 'Sharks', 'Tigers', 'Eagles', 'Robots'];
  var TEAM_COLORS = ['#38bdf8', '#f59e0b', '#a855f7', '#10b981', '#f43f5e', '#fde047', '#22d3ee', '#fb923c'];
  var T = { state: null, pending: [], approved: [], loadedFor: '' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function client() { return root.AdventureSupabase && root.AdventureSupabase.client; }
  function classKey(name) { return 'class-' + String(name).toLowerCase(); }
  function demo() { return !!(T.state && T.state.isDemo); }
  function demoData() { try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || { posts: [], photos: {} }; } catch (e) { return { posts: [], photos: {} }; } }

  async function load() {
    var cls = T.state.activeClass;
    if (demo()) {
      var d = demoData();
      var withPic = function (p) { return Object.assign({}, p, { photo: d.photos && d.photos[p.id] }); };
      T.pending = (d.posts || []).filter(function (p) { return p.status === 'pending'; }).map(withPic);
      T.approved = (d.posts || []).filter(function (p) { return p.status === 'approved' && p.kind === 'post'; }).map(withPic);
      return;
    }
    var sb = client(); if (!sb) { T.pending = []; T.approved = []; return; }
    var r = await sb.from('island_wall').select('id,student_id,first_name,kind,body,photo,status,created_at').eq('class_id', classKey(cls)).eq('kind', 'post').in('status', ['pending', 'approved']).order('created_at', { ascending: false }).limit(60);
    var rows = (r && r.data) || [];
    T.tableMissing = !!(r && r.error);
    T.pending = rows.filter(function (p) { return p.status === 'pending'; });
    T.approved = rows.filter(function (p) { return p.status === 'approved'; });
  }

  function card(p, approved) {
    return '<div class="tch-wall-card">' +
      '<b>' + esc(p.first_name) + '</b> <small style="color:#94a3b8">' + esc(new Date(p.created_at).toLocaleString()) + '</small>' +
      (p.photo ? '<img src="' + esc(p.photo) + '" alt="" style="display:block;width:100%;max-height:300px;object-fit:contain;background:#fff;border-radius:12px;margin:8px 0">' : '') +
      (p.body ? '<div style="font-size:1.1rem;font-weight:600;margin:6px 0;overflow-wrap:anywhere">' + esc(p.body) + '</div>' : '') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
        (approved
          ? '<button type="button" class="isl-btn" onclick="IslandTeacherWall.review(\'' + esc(p.id) + '\',\'declined\')">🗑️ Take it down</button>'
          : '<button type="button" class="isl-btn emerald" onclick="IslandTeacherWall.review(\'' + esc(p.id) + '\',\'approved\')">✅ Approve</button>' +
            '<button type="button" class="isl-btn" onclick="IslandTeacherWall.review(\'' + esc(p.id) + '\',\'declined\')">✖ Not this one</button>') +
      '</div></div>';
  }

  function drawWall() {
    var box = document.getElementById('tch-wall-list'); if (!box) return;
    if (T.tableMissing) { box.innerHTML = '<p style="color:#fde68a;font-weight:700">The Wall is not switched on in the cloud yet.</p>'; return; }
    box.innerHTML =
      '<h3 style="margin:8px 0">⏳ Waiting for you (' + T.pending.length + ')</h3>' +
      (T.pending.length ? '<div class="tch-grid-cards">' + T.pending.map(function (p) { return card(p, false); }).join('') + '</div>' : '<p style="color:#94a3b8">Nothing is waiting.</p>') +
      '<h3 style="margin:16px 0 8px">✅ On the Wall (' + T.approved.length + ')</h3>' +
      (T.approved.length ? '<div class="tch-grid-cards">' + T.approved.map(function (p) { return card(p, true); }).join('') + '</div>' : '<p style="color:#94a3b8">Nothing approved yet.</p>');
  }

  /* ---------- teams ---------- */
  function teams() {
    var sd = T.state.syncDoc; sd.teams = sd.teams || {};
    var k = classKey(T.state.activeClass);
    sd.teams[k] = sd.teams[k] || [];
    return sd.teams[k];
  }
  function pupils() {
    return (T.state.studentsByClass[T.state.activeClass] || []).slice().sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || '')); });
  }
  function teamOf(id) { return teams().filter(function (t) { return (t.members || []).indexOf(id) !== -1; })[0]; }
  function drawTeams() {
    var box = document.getElementById('tch-teams'); if (!box) return;
    var ts = teams(), list = pupils();
    box.innerHTML =
      '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">' +
        '<label style="font-weight:700">Teams: <input type="number" id="tch-team-n" class="tch-input-num" min="2" max="8" value="' + (ts.length || 4) + '"></label>' +
        '<button type="button" class="isl-btn violet" onclick="IslandTeacherWall.split()">🎲 Split the class</button>' +
        '<button type="button" class="isl-btn emerald" onclick="IslandTeacherWall.saveTeams()">💾 Save teams</button>' +
      '</div>' +
      (ts.length
        ? '<div class="tch-grid-cards">' + ts.map(function (t) {
            return '<div class="tch-wall-card" style="border-color:' + esc(t.color) + '"><input value="' + esc(t.name) + '" aria-label="Team name" onchange="IslandTeacherWall.rename(\'' + esc(t.id) + '\',this.value)" style="font:800 1.1rem Fredoka,sans-serif;width:100%;background:#090d16;color:' + esc(t.color) + ';border:1px solid #334155;border-radius:10px;padding:6px 10px">' +
              '<div style="margin-top:6px;color:#cbd5e1;font-weight:600">' + ((t.members || []).length ? (t.members || []).map(function (id) { var p = list.filter(function (s) { return s.id === id; })[0]; return p ? esc(p.name) : ''; }).filter(Boolean).join(', ') : 'Nobody yet') + '</div></div>';
          }).join('') + '</div>' +
          '<h3 style="margin:14px 0 6px">Move a pupil</h3><div class="tch-grid-cards">' + list.map(function (s) {
            var cur = teamOf(s.id);
            return '<label style="display:flex;justify-content:space-between;gap:8px;align-items:center;font-weight:700">' + esc(s.name) +
              '<select onchange="IslandTeacherWall.move(\'' + esc(s.id) + '\',this.value)" style="background:#090d16;color:#fff;border:1px solid #334155;border-radius:10px;padding:6px;font:600 0.95rem Fredoka,sans-serif">' +
                '<option value="">— no team —</option>' + ts.map(function (t) { return '<option value="' + esc(t.id) + '"' + (cur && cur.id === t.id ? ' selected' : '') + '>' + esc(t.name) + '</option>'; }).join('') +
              '</select></label>';
          }).join('') + '</div>'
        : '<p style="color:#94a3b8">No teams yet. Choose how many, then split the class. You can move pupils afterwards.</p>');
  }

  root.IslandTeacherWall = {
    render: function (state) {
      T.state = state;
      drawTeams();
      if (T.loadedFor !== state.activeClass) {
        T.loadedFor = state.activeClass;
        load().then(drawWall);
      } else drawWall();
    },
    refresh: function () { load().then(drawWall); },
    review: async function (id, status) {
      if (demo()) {
        var d = demoData(), p = (d.posts || []).filter(function (x) { return x.id === id; })[0];
        if (p) { p.status = status; localStorage.setItem(DEMO_KEY, JSON.stringify(d)); }
      } else {
        var sb = client(); if (!sb) return;
        var r = await sb.from('island_wall').update({ status: status, reviewed_at: new Date().toISOString() }).eq('id', id);
        if (r && r.error) { alert('That did not save. Please try again.'); return; }
      }
      await load(); drawWall();
    },
    split: function () {
      var n = Math.max(2, Math.min(8, Number((document.getElementById('tch-team-n') || {}).value) || 4));
      if (teams().length && !confirm('Make new teams? The current teams for this class will be replaced when you save.')) return;
      var list = pupils().map(function (s) { return s.id; });
      for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = list[i]; list[i] = list[j]; list[j] = x; }
      var ts = [];
      for (var k = 0; k < n; k++) ts.push({ id: 't' + (k + 1) + '-' + Date.now(), name: TEAM_NAMES[k], color: TEAM_COLORS[k], members: [] });
      list.forEach(function (id, idx) { ts[idx % n].members.push(id); });
      T.state.syncDoc.teams = T.state.syncDoc.teams || {};
      T.state.syncDoc.teams[classKey(T.state.activeClass)] = ts;
      drawTeams();
    },
    rename: function (id, name) { var t = teams().filter(function (x) { return x.id === id; })[0]; if (t) t.name = String(name || '').trim().slice(0, 24) || t.name; },
    move: function (sid, tid) {
      teams().forEach(function (t) { t.members = (t.members || []).filter(function (m) { return m !== sid; }); });
      var t = teams().filter(function (x) { return x.id === tid; })[0];
      if (t) t.members.push(sid);
      drawTeams();
    },
    saveTeams: function () { if (root.IslandTeacher) root.IslandTeacher.saveSyncDoc(); }
  };
})(typeof window !== 'undefined' ? window : this);
