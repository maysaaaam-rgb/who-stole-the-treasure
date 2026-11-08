/* Retired themes (2 Nov 2026): Alice in Wonderland and the Chuseok / Korean festival are gone from the platform.
   8 Nov 2026: Halloween too (the Pet Shop lesson and its homework). Its folder stays, so old links still open.
   Their homework, library items and resources are still in the saved data (pupils' XP history refers to them), so nothing is deleted:
   this file only marks them as archived every time the platform loads, and they disappear from the lists.
   The Unit 2 textbook lessons stay: they are curriculum, not a theme. The folders are in Documents\EAA-Backups\removed-themes-2026-11-02. */
(function (root) {
  'use strict';
  var ID = /alice|wonderland|^ws-tea-party|^hw-chuseok-|^res-chuseok-cooking|^chuseok-(festival|games)$|^chuseok-moon-song$|^moon-hw|halloween|^hal-pet/i;
  var ROUTE = /^(alice-|chuseok-(cooking|games|festival|moon-(song|homework))|halloween-)/i;

  function retire() {
    var s = root.schoolStore || root.store;
    if (!s || !s.state) return false;
    var n = 0;
    ['resources', 'worksheets', 'homework'].forEach(function (k) {
      (s.state[k] || []).forEach(function (x) {
        if (!x || x.archived) return;
        if (ID.test(String(x.id || '')) || ROUTE.test(String(x.route || x.url || ''))) { x.archived = true; n++; }
      });
    });
    return n;
  }
  root.RetiredThemes = { retire: retire };

  // the store loads after this file, and the cloud can bring newer lists a little later: run a few times
  var tries = 0;
  (function loop() {
    retire();
    if (++tries < 6) setTimeout(loop, tries < 3 ? 600 : 3000);
  })();
})(typeof window !== 'undefined' ? window : this);
