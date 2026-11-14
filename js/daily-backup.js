/* Daily backup of the classroom data (XP, coins, shop, attendance) on this device.
   - One copy per day, kept for 21 days, stored in the browser (IndexedDB), never sent anywhere.
   - If the XP suddenly drops by more than half, the good copy of that day is NOT replaced
     and a warning is shown, so a wipe can always be undone.
   - The teacher can download a copy as a file or restore one from More > Backups.
   The copies hold pupil data: they stay on the device; a downloaded file must be kept private. */
(function (root) {
  'use strict';
  var KEYS = ['eaa_master_school_v6', 'adventure_students'];
  var DB = 'eaa_daily_backup', STORE = 'snaps', KEEP = 21;
  var FIRST_MS = 25000, EVERY_MS = 20 * 60 * 1000;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function day(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function num(n) { n = Number(n); return isFinite(n) ? n : 0; }

  function db() {
    return new Promise(function (res, rej) {
      if (!root.indexedDB) return rej(new Error('no indexedDB'));
      var rq = root.indexedDB.open(DB, 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore(STORE, { keyPath: 'id' }); };
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { rej(rq.error); };
    });
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var t = d.transaction(STORE, mode), out = fn(t.objectStore(STORE));
        t.oncomplete = function () { d.close(); res(out && 'result' in out ? out.result : undefined); };
        t.onerror = t.onabort = function () { d.close(); rej(t.error); };
      });
    });
  }
  function all() { return tx('readonly', function (s) { return s.getAll(); }).then(function (l) { return (l || []).sort(function (a, b) { return a.id < b.id ? 1 : -1; }); }); }

  function read() {
    var data = {}, size = 0;
    KEYS.forEach(function (k) { var v = null; try { v = localStorage.getItem(k); } catch (e) { v = null; } if (v != null) { data[k] = v; size += v.length; } });
    return { data: data, size: size };
  }
  function summary(data) {
    var pupils = 0, xp = 0, coins = 0;
    try {
      var st = JSON.parse(data.eaa_master_school_v6 || '{}');
      (st.students || []).forEach(function (s) { if (s && !s.archived) { pupils++; xp += num(s.xp); } });
      var cs = st.classroomStore || {}, wal = cs.wallets || cs.students || cs.balances || {};
      Object.keys(wal).forEach(function (k) { var w = wal[k]; coins += num(w && typeof w === 'object' ? (w.coins != null ? w.coins : w.balance) : w); });
    } catch (e) { /* unreadable: counts stay 0 */ }
    return { pupils: pupils, xp: xp, coins: coins };
  }

  var warning = null;
  function snapshot(why) {
    var r = read(), sum = summary(r.data), id = day();
    if (!r.size || !sum.pupils) return Promise.resolve(null);          // nothing worth keeping (fresh or locked device)
    return all().then(function (list) {
      var last = list.filter(function (x) { return !x.afterDrop; })[0];
      var drop = last && last.sum.xp > 100 && sum.xp < last.sum.xp * 0.5;
      var rec = { id: drop ? id + '-after-drop' : id, at: Date.now(), why: why || 'auto', sum: sum, size: r.size, data: r.data, afterDrop: !!drop };
      warning = drop ? { from: last.sum.xp, to: sum.xp, good: last.id } : null;
      return tx('readwrite', function (s) {
        s.put(rec);
        list.filter(function (x) { return x.id !== rec.id; }).slice(KEEP - 1).forEach(function (x) { s.delete(x.id); });
      }).then(function () { if (warning) warn(); return rec; });
    }).catch(function () { return null; });
  }

  function warn() {
    if (!warning || document.getElementById('eaa-bk-warn')) return;
    var w = document.createElement('button');
    w.id = 'eaa-bk-warn'; w.type = 'button';
    w.textContent = '⚠️ XP dropped from ' + warning.from + ' to ' + warning.to + '. A good copy is saved. Tap to look.';
    w.style.cssText = 'position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:99998;background:#b91c1c;color:#fff;border:0;border-bottom:5px solid #7f1d1d;' +
      'font:600 15px/1.2 system-ui,sans-serif;padding:10px 16px;border-radius:14px;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer;max-width:92vw';
    w.onclick = function () { w.remove(); open(); };
    document.body.appendChild(w);
  }

  function download(id) {
    return all().then(function (list) {
      var rec = list.filter(function (x) { return x.id === id; })[0]; if (!rec) return;
      var blob = new Blob([JSON.stringify({ app: 'English Adventure Academy', backup: rec.id, savedAt: new Date(rec.at).toISOString(), summary: rec.sum, data: rec.data })], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'adventure-academy-backup-' + rec.id + '.json';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
    });
  }
  function restore(id) {
    return snapshotBeforeRestore().then(all).then(function (list) {
      var rec = list.filter(function (x) { return x.id === id; })[0]; if (!rec) return false;
      Object.keys(rec.data).forEach(function (k) { if (KEYS.indexOf(k) >= 0) localStorage.setItem(k, rec.data[k]); });
      try { sessionStorage.setItem('eaa_bk_restored', rec.id); } catch (e) { /* optional */ }
      location.reload(); return true;
    });
  }
  /* keep what is on the device right now, so a restore can itself be undone */
  function snapshotBeforeRestore() {
    var r = read(), sum = summary(r.data);
    if (!r.size) return Promise.resolve();
    return tx('readwrite', function (s) { s.put({ id: day() + '-before-restore', at: Date.now(), why: 'before restore', sum: sum, size: r.size, data: r.data, afterDrop: true }); }).catch(function () {});
  }

  /* ------------------------------------------------------------------ the Backups window */
  var CSS = '<style>#eaa-bk{position:fixed;inset:0;z-index:99990;background:rgba(3,6,15,.72);backdrop-filter:blur(6px);display:grid;place-items:center;padding:18px;font-family:Fredoka,"Plus Jakarta Sans",system-ui,sans-serif;color:#fff}' +
    '#eaa-bk .box{width:min(760px,100%);max-height:88vh;overflow:auto;background:rgba(15,23,42,.94);border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:22px 24px;box-shadow:0 4px 20px -2px rgba(0,0,0,.4),0 24px 60px rgba(0,0,0,.5)}' +
    '#eaa-bk h2{margin:0 0 4px;font-size:1.6rem;font-weight:600}#eaa-bk p{margin:0 0 14px;opacity:.82;font-size:1rem;line-height:1.4}' +
    '#eaa-bk .row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.07);margin-bottom:8px}' +
    '#eaa-bk .row.bad{background:rgba(244,63,94,.16)}#eaa-bk .row b{font-size:1.1rem;font-weight:600}#eaa-bk .row small{display:block;opacity:.78;font-size:.92rem;margin-top:2px}' +
    '#eaa-bk button{font:600 .98rem Fredoka,system-ui,sans-serif;border:0;border-bottom:5px solid rgba(0,0,0,.35);border-radius:14px;padding:10px 14px;min-height:46px;cursor:pointer;color:#fff;background:#334155;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
    '#eaa-bk button:active{transform:translateY(4px);border-bottom-width:1px}#eaa-bk button.g{background:#10b981}#eaa-bk button.b{background:#0ea5e9}#eaa-bk button.r{background:#f43f5e}' +
    '#eaa-bk .acts{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}#eaa-bk .top{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 14px}' +
    '#eaa-bk .note{background:rgba(245,158,11,.16);border:1px solid rgba(245,158,11,.5);border-radius:14px;padding:10px 14px;margin:0 0 12px}</style>';
  var asking = null;
  function when(rec) {
    var d = new Date(rec.at), t = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + t;
  }
  function draw() {
    var el = document.getElementById('eaa-bk'); if (!el) return;
    all().then(function (list) {
      var now = summary(read().data), restored = null;
      try { restored = sessionStorage.getItem('eaa_bk_restored'); sessionStorage.removeItem('eaa_bk_restored'); } catch (e) { restored = null; }
      var html = CSS + '<div class="box" role="dialog" aria-label="Backups"><h2>💾 Backups</h2>' +
        '<p>This device keeps one copy of the classroom data for each of the last ' + KEEP + ' days. Right now: <b>' + now.pupils + ' pupils, ' + now.xp + ' XP</b>.</p>' +
        (restored ? '<div class="note">✅ Restored the copy from ' + esc(restored) + '. Check the Teacher Hub before you sync with the cloud.</div>' : '') +
        (warning ? '<div class="note">⚠️ XP dropped from ' + warning.from + ' to ' + warning.to + ' since the last good copy (' + esc(warning.good) + '). That copy was kept.</div>' : '') +
        '<div class="top"><button type="button" class="g" data-a="now">💾 Save a copy now</button><button type="button" data-a="close">Close</button></div>';
      if (!list.length) html += '<p>No copies yet. The first one is made about half a minute after the platform opens.</p>';
      list.forEach(function (rec) {
        var ask = asking === rec.id;
        html += '<div class="row' + (rec.afterDrop ? ' bad' : '') + '"><span><b>' + esc(when(rec)) + '</b><small>' + rec.sum.pupils + ' pupils · ' + rec.sum.xp + ' XP' +
          (rec.afterDrop ? ' · ' + esc(rec.why === 'before restore' ? 'kept before a restore' : 'after a big XP drop') : '') + '</small></span><span class="acts">' +
          (ask ? '<button type="button" class="r" data-a="yes" data-id="' + esc(rec.id) + '">Yes, put this copy back</button><button type="button" data-a="no">Cancel</button>'
            : '<button type="button" class="b" data-a="dl" data-id="' + esc(rec.id) + '">⬇ Download</button><button type="button" data-a="ask" data-id="' + esc(rec.id) + '">↩ Restore</button>') +
          '</span></div>';
      });
      html += '<p style="margin-top:12px;font-size:.92rem">Restore changes this device only and reloads the page. What is on the device now is kept as an extra copy first. A downloaded file holds pupil data: keep it private.</p></div>';
      el.innerHTML = html;
    });
  }
  function open() {
    var el = document.getElementById('eaa-bk');
    if (!el) {
      el = document.createElement('div'); el.id = 'eaa-bk';
      el.addEventListener('click', function (e) {
        if (e.target === el) return close();
        var b = e.target.closest ? e.target.closest('button[data-a]') : null; if (!b) return;
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
        if (a === 'close') close();
        else if (a === 'now') snapshot('teacher').then(draw);
        else if (a === 'dl') download(id);
        else if (a === 'ask') { asking = id; draw(); }
        else if (a === 'no') { asking = null; draw(); }
        else if (a === 'yes') { asking = null; restore(id); }
      });
      document.body.appendChild(el);
    }
    asking = null; draw();
  }
  function close() { var el = document.getElementById('eaa-bk'); if (el) el.remove(); }

  function start() {
    setTimeout(function () { snapshot('auto'); }, FIRST_MS);
    setInterval(function () { snapshot('auto'); }, EVERY_MS);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') snapshot('auto'); });
    try { if (sessionStorage.getItem('eaa_bk_restored')) setTimeout(open, 1500); } catch (e) { /* optional */ }
  }
  root.DailyBackup = { open: open, close: close, snapshot: snapshot, list: all, restore: restore, download: download, _summary: summary };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})(window);
