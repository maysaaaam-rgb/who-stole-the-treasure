/* Library clean-up: hide the lessons and games you do not want, star the best ones.
   Saved on this device only (localStorage). The Library and the Game Shelf skip hidden items.
   "Copy hidden list" gives a JSON list you can send to remove them for good; "Load list" reads a list from the Gemini audit
   (library-audit/out/hide-list.json). Nothing is ever deleted from the platform's code from here. */
(function (root) {
  'use strict';
  var KEY = 'eaa_lib_curate';
  var st = { hidden: {}, star: {} };
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s === 'object') { st.hidden = s.hidden || {}; st.star = s.star || {}; } } catch (e) { /* storage may be blocked */ } }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* storage may be blocked */ } }
  function known(id) { return (root.GAMES_DATA || []).some(function (g) { return g && g.id === id; }); }
  function msg(t, type) { if (root.showNotification) root.showNotification(t, type || 'success'); }
  load();

  var api = {
    isHidden: function (id) { return !!st.hidden[id]; },
    isStar: function (id) { return !!st.star[id]; },
    hide: function (id) { st.hidden[id] = 1; delete st.star[id]; persist(); },
    restore: function (id) { delete st.hidden[id]; persist(); },
    toggleStar: function (id) { if (st.star[id]) delete st.star[id]; else { st.star[id] = 1; delete st.hidden[id]; } persist(); },
    hiddenIds: function () { return Object.keys(st.hidden); },
    starIds: function () { return Object.keys(st.star); },
    clearAll: function () { st.hidden = {}; st.star = {}; persist(); },
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
