/* English Adventure Academy: offline safety net.
   Rule 1: when the internet works, ALWAYS use the internet (so a push is live at once
           and nobody ever gets an old version because of this file).
   Rule 2: keep a copy of everything that was opened, and use that copy only when the
           internet is down or too slow. So a lesson opened once keeps working if the
           school Wi-Fi drops.
   Never touched: the cloud database (Supabase), anything that is not a simple GET. */
'use strict';
var VERSION = 'eaa-offline-v1';
var CODE = VERSION + '-code';     // pages, scripts, styles, json
var MEDIA = VERSION + '-media';   // pictures, sounds, fonts, pdf
var MEDIA_MAX = 1500;             // oldest copies are dropped past this
var SLOW_MS = 6000;               // slower than this = use the saved copy
var EXTRA_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
var MEDIA_RE = /\.(png|jpe?g|webp|gif|svg|ico|mp3|wav|ogg|m4a|mp4|webm|woff2?|ttf|pdf)$/i;

self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('eaa-offline-') === 0 && k.indexOf(VERSION) !== 0; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function keep(cacheName, req, res) {
  // only whole, good answers (never partial video chunks or errors)
  if (!res || (res.status !== 200 && res.type !== 'opaque')) return;
  var copy = res.clone();
  caches.open(cacheName).then(function (c) {
    return c.put(req, copy).then(function () {
      if (cacheName !== MEDIA) return;
      return c.keys().then(function (keys) {
        if (keys.length <= MEDIA_MAX) return;
        return Promise.all(keys.slice(0, keys.length - MEDIA_MAX).map(function (k) { return c.delete(k); }));
      });
    });
  }).catch(function () {});
}

function saved(req) {
  return caches.match(req).then(function (hit) {
    if (hit) return hit;
    // same file asked with another ?v= number: any saved copy is better than nothing
    return caches.match(req, { ignoreSearch: true });
  });
}

function netFirst(req, cacheName) {
  return new Promise(function (resolve, reject) {
    var done = false;
    var timer = setTimeout(function () {
      saved(req).then(function (hit) { if (hit && !done) { done = true; resolve(hit); } });
    }, SLOW_MS);
    fetch(req).then(function (res) {
      clearTimeout(timer);
      keep(cacheName, req, res);
      if (!done) { done = true; resolve(res); }
    }).catch(function (err) {
      clearTimeout(timer);
      if (done) return;
      saved(req).then(function (hit) { done = true; if (hit) resolve(hit); else reject(err); });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  var same = url.origin === self.location.origin;
  if (!same && EXTRA_HOSTS.indexOf(url.hostname) < 0) return;      // Supabase etc. go straight through
  if (url.pathname.slice(-6) === '/sw.js') return;
  e.respondWith(netFirst(req, MEDIA_RE.test(url.pathname) ? MEDIA : CODE));
});

self.addEventListener('message', function (e) {
  if (e.data === 'eaa-offline-clear') {
    caches.keys().then(function (keys) { keys.forEach(function (k) { if (k.indexOf('eaa-offline-') === 0) caches.delete(k); }); });
  }
});
