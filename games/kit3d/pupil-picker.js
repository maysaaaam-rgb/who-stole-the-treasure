/* Shared Live Groups & Pupil Picker for Standalone 3D Lessons (Courtside 3D, Build the Bridge 3D)
 * Uses games/kit/classroom.js with strict AGENTS.md §8 privacy invariant:
 * Real pupil names & avatars appear ONLY when TeacherAuth is unlocked in this browser.
 */
(function (root) {
  'use strict';

  var TEAM_COLORS = ['#ff5fa2', '#4f9dff', '#ffb320', '#2fc58a'];
  var TEAM_DEFAULTS = ['Ember', 'Aqua', 'Spark', 'Flora'];
  var CUSTOM_PREFIX = 'eaa_k3_custom_groups_v1_';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function loadScript(url) {
    return new Promise(function (res) {
      if (document.querySelector('script[data-pp-src="' + url + '"]')) return res(true);
      var s = document.createElement('script');
      s.src = url; s.async = true; s.setAttribute('data-pp-src', url);
      s.onload = function () { res(true); };
      s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }

  function ensureKitShim() {
    var Kit = root.Kit = root.Kit || {};
    if (!Kit.pref) {
      var PKEY = 'eaa_games_prefs', prefs = {};
      try { prefs = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { prefs = {}; }
      Kit.pref = function (k, v) {
        if (arguments.length < 2) return prefs[k];
        prefs[k] = v;
        try { localStorage.setItem(PKEY, JSON.stringify(prefs)); } catch (e) {}
        return v;
      };
    }
    if (!Kit.shuffle) {
      Kit.shuffle = function (arr) {
        var a = (arr || []).slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
      };
    }
    if (!Kit.clamp) Kit.clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
    if (!Kit.TEAM_LOOK) Kit.TEAM_LOOK = [];
    if (Kit.preview == null) Kit.preview = false;
    if (!root.KIT_ROOT) root.KIT_ROOT = '../';
    return Kit;
  }

  function injectCss() {
    if (document.getElementById('eaa-pp3d-css')) return;
    var st = document.createElement('style');
    st.id = 'eaa-pp3d-css';
    st.textContent = [
      '.pp3d-btn{appearance:none;border:3px solid #2b1d40;border-bottom:5px solid #2b1d40;background:#fff8ec;color:#2b1d40;font-family:inherit;font-weight:900;font-size:14px;height:44px;padding:0 14px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(43,29,64,.16);}',
      '.pp3d-btn:active{transform:translateY(3px);border-bottom-width:2px;}',
      '.pp3d-spk-pill{position:fixed;left:50%;top:66px;transform:translateX(-50%);z-index:18;pointer-events:auto;display:inline-flex;align-items:center;gap:8px;background:#fff8ec;border:4px solid var(--c,#4f9dff);border-bottom-width:6px;border-radius:999px;padding:5px 14px 5px 8px;font-weight:900;font-size:15px;color:#2b1d40;box-shadow:0 8px 20px rgba(43,29,64,.22);cursor:pointer;}',
      '.pp3d-spk-pill:hover{transform:translateX(-50%) scale(1.04);}',
      '.pp3d-spk-pill .av{width:30px;height:30px;border-radius:50%;overflow:hidden;display:inline-grid;place-items:center;background:#e8defa;color:#5a3cc4;font-weight:900;font-size:13px;}',
      '.pp3d-spk-pill .av img{width:100%;height:280%;object-fit:cover;object-position:50% 4%;}',
      '.pp3d-spk-next{border:0;background:#4f9dff;color:#fff;border-radius:999px;padding:3px 10px;font-family:inherit;font-weight:900;font-size:12px;cursor:pointer;}',
      '.pp3d-ov{position:fixed;inset:0;z-index:9999;background:rgba(43,29,64,.55);display:flex;align-items:center;justify-content:center;padding:16px;}',
      '.pp3d-card{background:#fff8ec;border:5px solid #4f9dff;border-bottom-width:9px;border-radius:28px;padding:18px 20px;width:min(940px,96vw);max-height:88vh;overflow-y:auto;box-shadow:0 22px 60px rgba(43,29,64,.38);font-family:Nunito,system-ui,sans-serif;color:#2b1d40;}',
      '.pp3d-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}',
      '.pp3d-head h3{margin:0;font-size:22px;font-weight:900;}',
      '.pp3d-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:10px;}',
      '.pp3d-tab{appearance:none;border:3px solid #d5c7eb;border-bottom-width:5px;background:#fff;color:#2b1d40;border-radius:999px;padding:6px 15px;font-family:inherit;font-weight:900;font-size:14px;cursor:pointer;}',
      '.pp3d-tab.on{background:#4f9dff;color:#fff;border-color:#256ec9;}',
      '.pp3d-tab.green{background:#2fc58a;color:#fff;border-color:#178b5d;}',
      '.pp3d-hint{text-align:center;font-size:13px;font-weight:800;background:#fff1d6;border:2px solid #ffd073;border-radius:999px;padding:5px 14px;margin:0 auto 10px;max-width:fit-content;}',
      '.pp3d-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}',
      '@media(max-width:760px){.pp3d-grid{grid-template-columns:repeat(2,1fr);}}',
      '.pp3d-col{background:#fff;border:4px solid var(--c);border-radius:20px;padding:8px;display:flex;flex-direction:column;gap:6px;min-height:110px;transition:transform .14s;}',
      '.pp3d-col.drop{background:#fffdf0;box-shadow:0 0 0 4px rgba(255,179,32,.6);cursor:pointer;transform:translateY(-3px);}',
      '.pp3d-col-hd{text-align:center;font-weight:900;font-size:15px;color:var(--c);}',
      '.pp3d-kids{display:flex;flex-wrap:wrap;gap:5px;}',
      '.pp3d-kid{appearance:none;display:inline-flex;align-items:center;gap:5px;background:#f4effa;border:2px solid #dfd3f2;border-bottom-width:4px;border-radius:999px;padding:3px 7px 3px 4px;font-family:inherit;font-weight:800;font-size:13px;color:#2b1d40;cursor:pointer;}',
      '.pp3d-kid.sel{background:#ffe066;border-color:#c77e00;transform:scale(1.05);}',
      '.pp3d-kid.spk{background:#dff9ee;border-color:#2fc58a;}',
      '.pp3d-kid .av{width:24px;height:24px;border-radius:50%;overflow:hidden;display:inline-grid;place-items:center;background:#e4d9f7;color:#5a3cc4;font-weight:900;font-size:11px;flex:none;}',
      '.pp3d-kid .av img{width:100%;height:280%;object-fit:cover;object-position:50% 4%;}',
      '.pp3d-kid .act{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;font-size:11px;cursor:pointer;}',
      '.pp3d-kid .act.mic{background:#c5f3df;color:#145e40;}',
      '.pp3d-kid .act.x{background:#f0e2f7;color:#6a5485;}',
      '.pp3d-bench{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;margin-top:10px;padding:8px 12px;border:2px dashed #cbb5e0;border-radius:16px;background:#fff;}'
    ].join('\n');
    document.head.appendChild(st);
  }

  var S = {
    ready: false,
    classId: '',
    teamMode: 'groups',
    teams: [{ pupils: [], speakerIdx: 0 }, { pupils: [], speakerIdx: 0 }, { pupils: [], speakerIdx: 0 }, { pupils: [], speakerIdx: 0 }],
    benched: [],
    hasSavedGroups: false,
    activeTeamIdx: 0,
    spkPill: null
  };

  function R() { return root.Kit && root.Kit.classroom; }
  function faceOf(id) {
    try { return (root.PupilAvatars && root.PupilAvatars.pictureFor && root.PupilAvatars.pictureFor(id)) || ''; } catch (e) { return ''; }
  }
  function paintFaces(scope) {
    (scope || document).querySelectorAll('[data-pp-face]').forEach(function (el) {
      var u = faceOf(el.getAttribute('data-pp-face'));
      if (!u) return;
      var im = el.querySelector('img');
      if (!im) { el.textContent = ''; im = document.createElement('img'); im.alt = ''; el.appendChild(im); }
      if (im.getAttribute('src') !== u) im.setAttribute('src', u);
    });
  }

  function saveCustom() {
    if (!S.classId) return;
    try {
      sessionStorage.setItem(CUSTOM_PREFIX + S.classId + '_4', JSON.stringify({
        teams: S.teams.map(function (t) { return { name: t.customName || '', ids: (t.pupils || []).map(function (p) { return p.id; }) }; }),
        benched: (S.benched || []).map(function (p) { return p.id; })
      }));
    } catch (e) {}
  }

  function loadGroups(opts) {
    opts = opts || {};
    if (!S.classId || !R() || !R().isTeacherSession()) {
      S.teams = TEAM_DEFAULTS.map(function (nm) { return { name: nm, customName: '', pupils: [], speakerIdx: 0 }; });
      S.benched = []; S.hasSavedGroups = false;
      syncSpeakerPill();
      return;
    }
    var allP = R().pupils(S.classId, false) || [];
    var byId = {}; allP.forEach(function (p) { byId[p.id] = p; });
    var savedG = (R().groups && R().groups(S.classId)) || [];
    S.hasSavedGroups = savedG.length >= 2;
    var mode = opts.teamMode || S.teamMode || (S.hasSavedGroups ? 'groups' : 'fair');
    if (mode === 'groups' && !S.hasSavedGroups) mode = 'fair';
    S.teamMode = mode;

    if (!opts.remix && !opts.ignoreCustom) {
      try {
        var custom = JSON.parse(sessionStorage.getItem(CUSTOM_PREFIX + S.classId + '_4') || 'null');
        if (custom && Array.isArray(custom.teams) && custom.teams.length === 4) {
          var seen = {}, bMap = {};
          (custom.benched || []).forEach(function (id) { bMap[id] = 1; });
          S.teams = custom.teams.map(function (ct, i) {
            var mem = (ct.ids || []).map(function (id) { seen[id] = 1; return byId[id]; }).filter(Boolean);
            return { name: ct.name || TEAM_DEFAULTS[i], customName: ct.name || '', pupils: mem, speakerIdx: 0 };
          });
          S.benched = [];
          allP.forEach(function (p) {
            if (bMap[p.id]) S.benched.push(p);
            else if (!seen[p.id]) S.teams.slice().sort(function (a, b) { return a.pupils.length - b.pupils.length; })[0].pupils.push(p);
          });
          syncSpeakerPill();
          return;
        }
      } catch (e) {}
    }

    if (mode === 'groups' && S.hasSavedGroups) {
      S.teams = [0, 1, 2, 3].map(function (i) {
        var g = savedG[i];
        return { name: (g && g.name) || TEAM_DEFAULTS[i], customName: (g && g.name) || '', pupils: (g && g.pupils) ? g.pupils.slice() : [], speakerIdx: 0 };
      });
      for (var ex = 4; ex < savedG.length; ex++) {
        if (savedG[ex] && savedG[ex].pupils) S.teams[ex % 4].pupils = S.teams[ex % 4].pupils.concat(savedG[ex].pupils);
      }
      var inG = {};
      S.teams.forEach(function (t) { t.pupils.forEach(function (p) { inG[p.id] = 1; }); });
      allP.forEach(function (p) {
        if (!inG[p.id]) S.teams.slice().sort(function (a, b) { return a.pupils.length - b.pupils.length; })[0].pupils.push(p);
      });
      S.benched = [];
    } else {
      var built = R().buildTeams(4, { classId: S.classId, teamMode: 'fair', forceRemix: !!opts.remix }) || [];
      S.teams = [0, 1, 2, 3].map(function (i) {
        return { name: TEAM_DEFAULTS[i], customName: '', pupils: (built[i] && built[i].pupils) ? built[i].pupils.slice() : [], speakerIdx: 0 };
      });
      S.benched = [];
    }
    syncSpeakerPill();
  }

  function detectActiveTeamIdx() {
    var pills = document.querySelectorAll('.team-pill, .t-pill');
    for (var i = 0; i < pills.length; i++) {
      if (pills[i].classList.contains('active') || pills[i].classList.contains('on')) return i % 4;
    }
    return S.activeTeamIdx || 0;
  }

  function syncSpeakerPill() {
    var idx = detectActiveTeamIdx();
    S.activeTeamIdx = idx;
    var t = S.teams[idx];
    var sp = (t && t.pupils && t.pupils.length) ? t.pupils[(t.speakerIdx || 0) % t.pupils.length] : null;
    if (!sp || !S.classId) {
      if (S.spkPill) S.spkPill.style.display = 'none';
      return;
    }
    if (!S.spkPill) {
      S.spkPill = document.createElement('div');
      S.spkPill.className = 'pp3d-spk-pill';
      S.spkPill.title = 'Tap to choose pupil or change groups';
      S.spkPill.onclick = function (ev) {
        if (ev.target && ev.target.classList.contains('pp3d-spk-next')) return;
        openModal();
      };
      document.body.appendChild(S.spkPill);
    }
    S.spkPill.style.display = 'inline-flex';
    S.spkPill.style.setProperty('--c', TEAM_COLORS[idx % 4]);
    S.spkPill.innerHTML = '<span class="av" data-pp-face="' + sp.id + '">' + esc(sp.initial) + '</span><span>🎤 ' + esc(sp.name) + ' <small style="opacity:.7">(' + esc(t.name) + ')</small></span><button type="button" class="pp3d-spk-next" title="Next pupil in team">Next ▸</button>';
    S.spkPill.querySelector('.pp3d-spk-next').onclick = function (ev) {
      ev.stopPropagation();
      if (t && t.pupils.length) {
        t.speakerIdx = ((t.speakerIdx || 0) + 1) % t.pupils.length;
        syncSpeakerPill();
      }
    };
    paintFaces(S.spkPill);
  }

  function openModal() {
    var old = document.getElementById('pp3d-ov'); if (old) old.remove();
    var ov = document.createElement('div'); ov.id = 'pp3d-ov'; ov.className = 'pp3d-ov';
    var card = document.createElement('div'); card.className = 'pp3d-card';
    var selected = null;

    function render() {
      card.innerHTML = '';
      var hd = document.createElement('div'); hd.className = 'pp3d-head';
      hd.innerHTML = '<h3>👥 Change Groups &amp; Choose Pupil</h3><button type="button" class="pp3d-tab" id="pp3d-x">✕ Close</button>';
      hd.querySelector('#pp3d-x').onclick = function () { ov.remove(); };
      card.appendChild(hd);

      if (!R() || !R().isTeacherSession() || !R().classes().length) {
        var msg = document.createElement('p');
        msg.style.cssText = 'text-align:center;font-weight:800;font-size:16px;padding:18px;';
        msg.textContent = 'Sign in as teacher on the main English Adventure Academy platform first so your class rosters & groups unlock safely here!';
        card.appendChild(msg);
        return;
      }

      var clsRow = document.createElement('div'); clsRow.className = 'pp3d-row';
      R().classes().forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button';
        b.className = 'pp3d-tab' + (S.classId === c.id ? ' on' : '');
        b.textContent = c.label;
        b.onclick = function () { S.classId = c.id; root.Kit.pref('classId', c.id); selected = null; loadGroups(); render(); };
        clsRow.appendChild(b);
      });
      var bNone = document.createElement('button'); bNone.type = 'button';
      bNone.className = 'pp3d-tab' + (!S.classId ? ' on' : '');
      bNone.textContent = '🎨 No names';
      bNone.onclick = function () { S.classId = ''; root.Kit.pref('classId', 'none'); selected = null; loadGroups(); render(); };
      clsRow.appendChild(bNone);
      card.appendChild(clsRow);

      if (!S.classId) return;

      var modeRow = document.createElement('div'); modeRow.className = 'pp3d-row';
      if (S.hasSavedGroups) {
        var bG = document.createElement('button'); bG.type = 'button';
        bG.className = 'pp3d-tab' + (S.teamMode === 'groups' ? ' on' : '');
        bG.textContent = '👥 Class Groups';
        bG.onclick = function () {
          root.Kit.pref('teamMode', 'groups'); S.teamMode = 'groups';
          try { sessionStorage.removeItem(CUSTOM_PREFIX + S.classId + '_4'); } catch (e) {}
          selected = null; loadGroups({ teamMode: 'groups', ignoreCustom: true }); render();
        };
        modeRow.appendChild(bG);
      }
      var bF = document.createElement('button'); bF.type = 'button';
      bF.className = 'pp3d-tab' + (S.teamMode !== 'groups' ? ' on' : '');
      bF.textContent = '🎲 Random Teams';
      bF.onclick = function () {
        root.Kit.pref('teamMode', 'fair'); S.teamMode = 'fair';
        try { sessionStorage.removeItem(CUSTOM_PREFIX + S.classId + '_4'); } catch (e) {}
        selected = null; loadGroups({ teamMode: 'fair', ignoreCustom: true }); render();
      };
      modeRow.appendChild(bF);
      var bMix = document.createElement('button'); bMix.type = 'button';
      bMix.className = 'pp3d-tab'; bMix.textContent = '🔀 Shuffle';
      bMix.onclick = function () {
        root.Kit.pref('teamMode', 'fair'); S.teamMode = 'fair';
        try { sessionStorage.removeItem(CUSTOM_PREFIX + S.classId + '_4'); } catch (e) {}
        selected = null; loadGroups({ teamMode: 'fair', remix: true, ignoreCustom: true }); render();
      };
      modeRow.appendChild(bMix);
      card.appendChild(modeRow);

      var hint = document.createElement('div'); hint.className = 'pp3d-hint';
      hint.innerHTML = selected
        ? ('👆 Tap any group box to move <b>' + esc(selected.name) + '</b>!')
        : '💡 Tap any pupil to move them between groups · tap <b>🎤</b> to make them speak right now!';
      card.appendChild(hint);

      var grid = document.createElement('div'); grid.className = 'pp3d-grid';
      S.teams.forEach(function (t, ti) {
        var col = document.createElement('div');
        col.className = 'pp3d-col' + (selected && selected.from !== ti ? ' drop' : '');
        col.style.setProperty('--c', TEAM_COLORS[ti]);
        col.onclick = function (ev) {
          if (!selected) return;
          if (ev.target && ev.target.closest && ev.target.closest('.pp3d-kid')) return;
          move(selected, ti);
        };
        var hd2 = document.createElement('div'); hd2.className = 'pp3d-col-hd';
        hd2.textContent = t.name + ' (' + t.pupils.length + ')';
        col.appendChild(hd2);
        var kw = document.createElement('div'); kw.className = 'pp3d-kids';
        t.pupils.forEach(function (p, pi) {
          var isSel = selected && selected.id === p.id;
          var isSpk = ((t.speakerIdx || 0) % Math.max(1, t.pupils.length)) === pi;
          var btn = document.createElement('button'); btn.type = 'button';
          btn.className = 'pp3d-kid' + (isSel ? ' sel' : '') + (isSpk ? ' spk' : '');
          btn.innerHTML = '<span class="av" data-pp-face="' + p.id + '">' + esc(p.initial) + '</span><span>' + esc(p.name) + '</span>';
          btn.onclick = function (ev) {
            ev.stopPropagation();
            if (selected && selected.id === p.id) { move(selected, (ti + 1) % 4); return; }
            if (selected && selected.from !== ti) { move(selected, ti); return; }
            selected = { from: ti, id: p.id, name: p.name };
            render();
          };
          var mic = document.createElement('span'); mic.className = 'act mic'; mic.textContent = '🎤';
          mic.title = 'Choose ' + p.name + ' to speak now!';
          mic.onclick = function (ev) {
            ev.stopPropagation();
            t.speakerIdx = pi;
            S.activeTeamIdx = ti;
            // Also switch active team pill on the game dock if present!
            var dockPills = document.querySelectorAll('.team-pill, .t-pill');
            if (dockPills[ti]) dockPills[ti].click();
            syncSpeakerPill();
            ov.remove();
          };
          var x = document.createElement('span'); x.className = 'act x'; x.textContent = '✕';
          x.title = 'Sit out ' + p.name;
          x.onclick = function (ev) {
            ev.stopPropagation();
            var rem = t.pupils.splice(pi, 1)[0];
            if (rem) S.benched.push(rem);
            selected = null; saveCustom(); syncSpeakerPill(); render();
          };
          btn.appendChild(mic); btn.appendChild(x);
          kw.appendChild(btn);
        });
        col.appendChild(kw);
        grid.appendChild(col);
      });
      card.appendChild(grid);

      if (S.benched.length) {
        var bw = document.createElement('div'); bw.className = 'pp3d-bench';
        bw.innerHTML = '<small style="font-weight:800;color:#6a5485;">🪑 Sitting out (tap to add back):</small>';
        S.benched.forEach(function (p) {
          var b = document.createElement('button'); b.type = 'button';
          b.className = 'pp3d-kid' + (selected && selected.id === p.id ? ' sel' : '');
          b.innerHTML = '<span class="av" data-pp-face="' + p.id + '">' + esc(p.initial) + '</span><span>+ ' + esc(p.name) + '</span>';
          b.onclick = function () {
            if (selected && selected.id === p.id) {
              var smallest = 0;
              for (var k = 1; k < 4; k++) if (S.teams[k].pupils.length < S.teams[smallest].pupils.length) smallest = k;
              move(selected, smallest);
              return;
            }
            selected = { from: 'bench', id: p.id, name: p.name };
            render();
          };
          bw.appendChild(b);
        });
        card.appendChild(bw);
      }
      paintFaces(card);
    }

    function move(sel, toTeam) {
      var moved = null;
      if (sel.from === 'bench') {
        var bi = S.benched.findIndex(function (p) { return p.id === sel.id; });
        if (bi >= 0) moved = S.benched.splice(bi, 1)[0];
      } else {
        var pi = S.teams[sel.from].pupils.findIndex(function (p) { return p.id === sel.id; });
        if (pi >= 0) moved = S.teams[sel.from].pupils.splice(pi, 1)[0];
      }
      if (moved) S.teams[toTeam].pupils.push(moved);
      selected = null; saveCustom(); syncSpeakerPill(); render();
    }

    ov.appendChild(card);
    ov.onclick = function (ev) { if (ev.target === ov) ov.remove(); };
    document.body.appendChild(ov);
    render();
  }

  function boot() {
    injectCss();
    ensureKitShim();
    var targetBar = document.querySelector('.top-right-nav') || document.querySelector('.top-right');
    if (targetBar && !document.getElementById('btn-pp3d-groups')) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.id = 'btn-pp3d-groups'; btn.className = 'pp3d-btn';
      btn.textContent = '👥 Pupils';
      btn.title = 'Change Groups & Choose Pupils';
      btn.onclick = openModal;
      targetBar.insertBefore(btn, targetBar.firstChild);
    }

    loadScript('../games/kit/classroom.js?v=3').then(function () {
      if (R() && R().isTeacherSession()) {
        S.ready = true;
        var saved = root.Kit.pref('classId');
        var list = R().classes();
        S.classId = saved === 'none' ? '' : (list.some(function (c) { return c.id === saved; }) ? saved : R().defaultClassId());
        loadGroups();
      }
    });

    // Keep active speaker pill synced when teacher switches teams on the bottom dock
    document.addEventListener('click', function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest('.team-pill, .t-pill')) {
        setTimeout(syncSpeakerPill, 40);
      }
    });
    root.addEventListener('eaa:avatars-ready', function () { paintFaces(document); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  root.EAA_PUPIL_PICKER_3D = { open: openModal, sync: syncSpeakerPill, state: S };
})(window);
