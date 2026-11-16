/* Turns on the offline safety net (sw.js) and shows a small note when the internet is down.
   To switch it off on one device: open the site with ?offline=off once. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  var ROOT = (document.currentScript && document.currentScript.src || '').replace(/js\/offline\.js.*$/, '');
  if (!ROOT) return;

  if (/[?&]offline=off/.test(location.search)) {
    navigator.serviceWorker.getRegistrations().then(function (rs) { rs.forEach(function (r) { r.unregister(); }); });
    if (window.caches) caches.keys().then(function (ks) { ks.forEach(function (k) { if (k.indexOf('eaa-offline-') === 0) caches.delete(k); }); });
    return;
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(ROOT + 'sw.js?v=20261116', { scope: ROOT }).then(function (reg) {
      try { reg.update(); } catch (e) {}
    }).catch(function () {});
  });

  window.EAAOffline = {
    forceRefresh: async function () {
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'EAA_FORCE_REFRESH' });
        }
        if (window.caches) {
          var ks = await caches.keys();
          await Promise.all(ks.filter(function (k) { return k.indexOf('eaa-offline-') === 0; }).map(function (k) { return caches.delete(k); }));
        }
        if (navigator.serviceWorker) {
          var regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(function (r) { return r.update().catch(function () {}); }));
        }
      } catch (e) {}
      var u = new URL(location.href);
      u.searchParams.set('refreshed', String(Date.now()));
      location.replace(u.toString());
    }
  };

  var pill = null;
  function show() {
    var off = navigator.onLine === false;
    if (off && !pill) {
      pill = document.createElement('div');
      pill.id = 'eaa-offline-pill';
      pill.setAttribute('role', 'status');
      pill.textContent = '📡 No internet · using saved copy';
      pill.style.cssText = 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:99999;' +
        'background:#b45309;color:#fff;font:600 15px/1.2 system-ui,sans-serif;padding:9px 16px;border-radius:99px;' +
        'box-shadow:0 6px 18px rgba(0,0,0,.4);pointer-events:none';
      (document.body || document.documentElement).appendChild(pill);
    } else if (!off && pill) {
      pill.remove(); pill = null;
    }
  }
  window.addEventListener('online', show);
  window.addEventListener('offline', show);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
