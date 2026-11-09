/* Library clean-up: hide the lessons and games you do not want, star the best ones.
   Saved on this device only (localStorage). The Library and the Game Shelf skip hidden items.
   "Copy hidden list" gives a JSON list you can send to remove them for good; "Load list" reads a list from the Gemini audit
   (library-audit/out/hide-list.json). Nothing is ever deleted from the platform's code from here. */
(function (root) {
  'use strict';
  var KEY = 'eaa_lib_curate';
  var st = { hidden: {}, star: {}, restored: {} };
  // Hidden for everyone from 17 Oct 2026 (teacher: focus on the new Tea Party work). Press "restore" on one to see it again; nothing is deleted.
  var DEFAULT_HIDDEN = ['alice-cards-4a', 'alice-cards-4b', 'alice-quest', 'story-engine-alice', 'alice-homework', 'wonderland-lesson1', 'wonderland-lesson2', 'wonderland-lesson3', 'wonderland-quiz-briefing'];
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s === 'object') { st.hidden = s.hidden || {}; st.star = s.star || {}; st.restored = s.restored || {}; } } catch (e) { /* storage may be blocked */ } }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* storage may be blocked */ } }
  function known(id) { return (root.GAMES_DATA || []).some(function (g) { return g && g.id === id; }); }
  function msg(t, type) { if (root.showNotification) root.showNotification(t, type || 'success'); }
  load();

  /* Old lessons (Units 1–4, Halloween, Alice, Wonderland, Chuseok) live in the Archive from 9 Nov 2026: hidden from the Library
     and the Game Shelf, still found by Search and listed under More → Old lessons. "Bring back" puts one back on this device. */
  var AKEY = 'eaa_lib_archive';
  var ar = { back: {} };
  try { var a0 = JSON.parse(localStorage.getItem(AKEY) || 'null'); if (a0 && a0.back) ar.back = a0.back; } catch (e) { /* storage may be blocked */ }
  function persistAr() { try { localStorage.setItem(AKEY, JSON.stringify(ar)); } catch (e) { /* storage may be blocked */ } }
  var KEEP = /^(karaoke-stage|alley-fling.*|watch-answer.*|simon-says.*|school-subjects-challenge|classroom-instructions-challenge|dino-.*|biome-crafter|gamemaker-.*|smart-board|magic-book|practice-island.*)$/;
  var OLD_IDS = /^(week4-.*|city-mouse|wind-and-sun|forest-rangers-g4|swallow-gift-g4|first-harvest-g3|good-ideas-lab|inventor-lab|clara-inventor|inventor-forge|brain-quit|brain-explorers|u[1-4]-.*|rev-.*|lingo-g3-u3-review|board-u3-.*|revision-quest-.*|bamboozle-.*-u[1-4]|arcade-.*-u[1-4]|race-.*-u[1-4]|shop-counter-.*|print-g[34]-u[1-4]|worksheet-store-.*-u12|quiz-g[34]-u14|speak-g4-u4|unit[1-4].*|money-l\d-.*|changing-l\d-.*|bear-l\d-.*|ice-l\d-.*|poem-l\d-.*|cars-l\d-.*)$/;
  function isOld(g) {
    if (!g || KEEP.test(g.id)) return false;
    var t = (g.id + ' ' + (g.title || '')).toLowerCase(), u = Number(g.unit);
    if (u >= 1 && u <= 4) return true;
    if (OLD_IDS.test(g.id)) return true;
    return /\bunits? ?[1-4]\b|halloween|alice|wonderland|chuseok/.test(t);
  }

  function byId(id) { return (root.GAMES_DATA || []).filter(function (g) { return g && g.id === id; })[0]; }
  function archived(id) { var g = byId(id) || ((root.Timetable && root.Timetable.catalog) || []).filter(function (c) { return c && c.id === id; })[0]; return !!g && isOld(g) && !ar.back[id]; }

  var api = {
    isHidden: function (id) { return !!st.hidden[id] || (DEFAULT_HIDDEN.indexOf(id) >= 0 && !st.restored[id]) || archived(id); },
    isArchived: archived,
    isBack: function (id) { return !!ar.back[id]; },
    isOld: isOld,
    archivedList: function () {
      var out = [], seen = {};
      (root.GAMES_DATA || []).forEach(function (g) { if (g && isOld(g)) { seen[g.id] = 1; out.push(g); } });
      var cat = (root.Timetable && root.Timetable.catalog) || [];
      cat.forEach(function (c) { if (c && c.route && c.kind !== 'nav' && !seen[c.id] && isOld(c)) { seen[c.id] = 1; out.push({ id: c.id, title: (c.icon ? c.icon + ' ' : '') + c.title, url: c.route }); } });
      return out;
    },
    bringBack: function (id) { ar.back[id] = 1; delete st.hidden[id]; if (DEFAULT_HIDDEN.indexOf(id) >= 0) st.restored[id] = 1; persist(); persistAr(); },
    sendToArchive: function (id) { delete ar.back[id]; persistAr(); },
    isStar: function (id) { return !!st.star[id]; },
    hide: function (id) { st.hidden[id] = 1; delete st.restored[id]; delete st.star[id]; persist(); },
    restore: function (id) { delete st.hidden[id]; if (DEFAULT_HIDDEN.indexOf(id) >= 0) st.restored[id] = 1; if (archived(id)) { ar.back[id] = 1; persistAr(); } persist(); },
    toggleStar: function (id) { if (st.star[id]) delete st.star[id]; else { st.star[id] = 1; delete st.hidden[id]; } persist(); },
    hiddenIds: function () { var o = {}; Object.keys(st.hidden).forEach(function (k) { o[k] = 1; }); DEFAULT_HIDDEN.forEach(function (k) { if (!st.restored[k]) o[k] = 1; }); return Object.keys(o); },
    starIds: function () { return Object.keys(st.star); },
    clearAll: function () { st.hidden = {}; st.star = {}; st.restored = {}; DEFAULT_HIDDEN.forEach(function (k) { st.restored[k] = 1; }); persist(); },
    copy: function () {
      var text = JSON.stringify({ hide: api.hiddenIds(), star: api.starIds() }, null, 1);
      function fallback() { try { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); msg('Copied ' + api.hiddenIds().length + ' hidden ids.'); } catch (e) { root.prompt && root.prompt('Copy this list:', text); } }
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { msg('Copied ' + api.hiddenIds().length + ' hidden ids.'); }, fallback); else fallback(); } catch (e) { fallback(); }
    },
    importList: function (text, opts) {
      var data; try { data = JSON.parse(text); } catch (e) { return { ok: false, error: 'That is not a valid list. Paste the content of hide-list.json.' }; }
      var hide = (data && data.hide) || [], star = (data && data.star) || [], h = 0, s = 0;
      if (!Array.isArray(hide) || !Array.isArray(star)) return { ok: false, error: 'The list needs "hide" and "star" arrays.' };
      hide.forEach(function (id) { if (known(id)) { st.hidden[id] = 1; delete st.star[id]; h++; } });
      star.forEach(function (id) { if (known(id) && !st.hidden[id]) { st.star[id] = 1; s++; } });
      persist(); return { ok: true, hidden: h, star: s, skipped: hide.length + star.length - h - s };
    },
    /* a small window to paste a list into */
    openImport: function (done) {
      var w = document.createElement('div');
      w.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;padding:16px';
      w.innerHTML = '<div style="background:#fff;color:#2f2e6b;border-radius:22px;padding:20px;width:min(640px,96vw);font-family:Fredoka,Nunito,sans-serif"><h2 style="margin:0 0 6px">Load a clean-up list</h2><p style="margin:0 0 10px;font-size:.95rem">Paste the content of <b>hide-list.json</b>. Items in "hide" will be hidden, items in "star" will get a star. You can restore any time.</p><textarea style="width:100%;height:200px;border:2px solid #c4b5fd;border-radius:12px;padding:10px;font:13px monospace"></textarea><div style="margin-top:10px;display:flex;gap:10px;justify-content:flex-end"><button type="button" data-x style="font:inherit;font-weight:700;padding:8px 16px;border:0;border-bottom:4px solid #94a3b8;border-radius:12px;background:#fff;cursor:pointer">Cancel</button><button type="button" data-ok style="font:inherit;font-weight:700;padding:8px 18px;border:0;border-bottom:4px solid #b45309;border-radius:12px;background:#f59e0b;color:#2b1700;cursor:pointer">Load list</button></div><p data-m style="margin:8px 0 0;font-weight:700"></p></div>';
      document.body.appendChild(w);
      w.querySelector('[data-x]').onclick = function () { w.remove(); };
      w.querySelector('[data-ok]').onclick = function () {
        var r = api.importList(w.querySelector('textarea').value), m = w.querySelector('[data-m]');
        if (!r.ok) { m.textContent = r.error; m.style.color = '#b91c1c'; return; }
        w.remove(); msg('Hidden ' + r.hidden + ', starred ' + r.star + (r.skipped ? ', skipped ' + r.skipped + ' unknown' : '') + '.'); if (done) done();
      };
    },
    open: function () { if (root.ClassMode) { root.ClassMode.curate(true); } }
  };
  root.LibraryCurate = api;
})(typeof window !== 'undefined' ? window : this);
