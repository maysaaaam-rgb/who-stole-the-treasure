/* Tea Party week: for the party week only, every Grade 4 pupil's monster wears the look of their Alice character
   (ears, crowns, hats, wings, vests...) so the pupils remember what to wear and bring.
   It only changes what is DRAWN. The monster that is saved never changes, so the pupil's own choices come back by themselves
   when the week ends (after UNTIL) or when the teacher switches it off:  localStorage.setItem('eaa_alice_week_off', '1')  */
(function (root) {
  'use strict';
  var FROM = '2026-10-17', UNTIL = '2026-10-26';   // inclusive
  /* Alice role -> monster items (slot: item id from the monster shop). Only items that exist in the monster shop. */
  var LOOK = {
    alice:        { hat: 'hat-bow', clothing: 'clothing-scarf' },
    hatter:       { hat: 'hat-explorer', clothing: 'clothing-vest' },
    rabbit:       { horns: 'horns-ears', tail: 'tail-puff', glasses: 'glasses-round', clothing: 'clothing-vest', accessory: 'acc-compass' },
    whitequeen:   { hat: 'hat-crown', clothing: 'clothing-royal-robe', accessory: 'acc-wand' },
    redqueen:     { hat: 'hat-crown', clothing: 'clothing-royal' },
    hare:         { horns: 'horns-ears', tail: 'tail-puff' },
    cheshire:     { horns: 'horns-ears', tail: 'tail-perky', mouth: 'mouth-laughing' },
    cat:          { horns: 'horns-ears', tail: 'tail-perky' },
    bayard:       { horns: 'horns-ears', accessory: 'neck-badge' },
    dragon:       { wings: 'wings-dragon', tail: 'tail-dragon', horns: 'horns-curved' },
    bandersnatch: { horns: 'horns-curved', tail: 'tail-perky', clothing: 'clothing-dragon-armor' },
    sister:       { hat: 'hat-bow', accessory: 'acc-book' },
    mother:       { hat: 'hat-flower', clothing: 'clothing-scarf' },
    twosister1:   { hat: 'hat-headband', accessory: 'neck-badge' },
    twosister2:   { hat: 'hat-headband', accessory: 'neck-star' },
    absolem:      { horns: 'horns-nub', hat: 'hat-star-clip' },
    hamish:       { hat: 'hat-scholar', accessory: 'acc-wand', clothing: 'clothing-school-jacket' },
    lowell:       { hat: 'hat-scholar', clothing: 'clothing-adv-jacket' },
    dum:          { hat: 'hat-headband', accessory: 'neck-badge' },
    dee:          { hat: 'hat-headband', accessory: 'neck-star' },
    dormouse1:    { horns: 'horns-ears', tail: 'tail-puff' },
    dormouse2:    { horns: 'horns-ears', tail: 'tail-puff', eyes: 'eyes-sleepy' },
    oyster:       { accessory: 'neck-pendant', hat: 'hat-star-clip' }
  };
  function today() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
  function active() {
    try { if (localStorage.getItem('eaa_alice_week_off') === '1') return false; } catch (e) { /* storage may be blocked */ }
    var t = today(); return t >= FROM && t <= UNTIL;
  }
  function roleKeyOf(studentId) {
    try {
      var map = root.AliceProfile && root.AliceProfile.map, P = root.PARTY;
      var pid = map && map[studentId]; if (!pid || !P || !P.find) return '';
      var st = P.find(pid); return st ? st.roleKey : '';
    } catch (e) { return ''; }
  }
  /** the equipped items to DRAW for this pupil: the saved ones with the Alice look on top (or the saved ones when the week is over) */
  function equippedFor(studentId, saved) {
    var base = saved || {};
    if (!studentId || !active() || mode() !== 'costume') return base;
    var look = LOOK[roleKeyOf(studentId)]; if (!look) return base;
    var out = Object.assign({}, base);
    Object.keys(look).forEach(function (k) { out[k] = look[k]; });
    return out;
  }
  /** a copy of the monster profile for DRAWING (the saved profile object is never changed) */
  function view(studentId, profile) {
    if (!profile || !studentId || !active() || mode() !== 'costume') return profile;
    var look = LOOK[roleKeyOf(studentId)]; if (!look) return profile;
    var copy = Object.assign({}, profile); copy.equipped = equippedFor(studentId, profile.equipped); copy.aliceWeek = true;
    return copy;
  }
  /* ---------- the three looks: 'both' (character picture with the monster in a corner circle), 'characters', 'monsters' (the costume look above) ---------- */
  var MODE_KEY = 'eaa_alice_week_mode';
  function mode() { var m = ''; try { m = localStorage.getItem(MODE_KEY) || ''; } catch (e) { /* default */ } return m === 'characters' || m === 'monsters' || m === 'costume' ? m : 'both'; }
  var chars = {}, comp = {}, loading = false;      // role -> data URL of the character picture; role|monster -> composed picture
  function charPath(role) { return 'assets/alice-cut/avatars/a_' + role + '.webp'; }
  function hash(str) { var h = 5381, n = Math.min(str.length, 6000); for (var i = 0; i < n; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return h + ':' + str.length; }
  function refresh() { try { if (root.renderCurrentView) root.renderCurrentView(); } catch (e) { /* the next screen change redraws */ } }
  function loadChars() {
    if (loading || typeof fetch !== 'function') return; loading = true;
    var roles = Object.keys(LOOK).filter(function (r) { return !chars[r]; }), left = roles.length;
    if (!left) { loading = false; return; }
    roles.forEach(function (r) {
      fetch(charPath(r)).then(function (x) { return x.blob(); }).then(function (b) {
        return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { chars[r] = String(fr.result); ok(); }; fr.onerror = ok; fr.readAsDataURL(b); });
      }).catch(function () { /* that character stays as the monster */ }).then(function () { if (--left === 0) { loading = false; comp = {}; refresh(); } });
    });
  }
  function compose(data, monster) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><clipPath id="c"><circle cx="150" cy="150" r="40"/></clipPath></defs>' +
      '<image href="' + data + '" x="4" y="4" width="192" height="192" preserveAspectRatio="xMidYMid meet"/>' +
      '<circle cx="150" cy="150" r="46" fill="#0f172a" stroke="#f59e0b" stroke-width="5"/>' +
      '<image href="' + monster + '" x="110" y="110" width="80" height="80" clip-path="url(#c)" preserveAspectRatio="xMidYMid slice"/></svg>';
    // a short blob address instead of a 100 KB data address: the page stays small (a board with 19 pupils was 3 MB of HTML before)
    try { return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })); } catch (e) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
  }
  /** the picture to show for a pupil: the monster as it is, the Alice character, or both */
  function wrapUrl(student, base) {
    if (!student || !base || !active()) return base;
    var m = mode(); if (m === 'monsters' || m === 'costume') return base;
    var role = roleKeyOf(student.id); if (!role) return base;
    if (m === 'characters') return charPath(role);
    if (!chars[role]) { loadChars(); return base; }
    if (String(base).indexOf('data:') !== 0) return charPath(role);   // an illustrated monster is a file, which cannot sit inside a picture: show the character
    var k = role + '|' + hash(String(base));
    return comp[k] || (comp[k] = compose(chars[role], String(base)));
  }
  var LABEL = { both: '🎭 Look: character + my monster', characters: '🎭 Look: characters only', costume: '🎭 Look: monsters in costume', monsters: '🎭 Look: my monsters (normal)' };
  function setMode(m) { try { localStorage.setItem(MODE_KEY, m); } catch (e) { /* not remembered */ } comp = {}; paintChip(); refresh(); }
  function paintChip() {
    var c = document.getElementById('aw-chip');
    var show = active() && !document.documentElement.classList.contains('platform-locked');
    try { if (root.schoolStore && root.schoolStore.getRole && root.schoolStore.getRole() !== 'teacher') show = false; } catch (e) { /* show */ }
    if (!show) { if (c) c.style.display = 'none'; return; }
    if (!c) {
      c = document.createElement('button'); c.id = 'aw-chip'; c.type = 'button'; c.title = 'Tea Party week: choose what the pupils\' pictures show (tap to change)';
      c.style.cssText = 'position:fixed;left:12px;bottom:84px;z-index:95;max-width:230px;border:0;border-bottom:5px solid #92400e;border-radius:14px;background:#f59e0b;color:#1c1203;font:800 .9rem/1.1 inherit;padding:9px 14px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.35);transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-bottom-width .12s';
      c.onmousedown = function () { c.style.transform = 'translateY(4px)'; c.style.borderBottomWidth = '1px'; };
      c.onmouseup = c.onmouseleave = function () { c.style.transform = ''; c.style.borderBottomWidth = '5px'; };
      c.onclick = function () { var order = ['both', 'characters', 'costume', 'monsters']; setMode(order[(order.indexOf(mode()) + 1) % 4]); };
      document.body.appendChild(c);
    }
    c.style.display = ''; c.textContent = LABEL[mode()];
  }
  function start() { paintChip(); setInterval(paintChip, 1500); if (active() && mode() === 'both') loadChars(); }
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start(); }

  root.AliceWeek = { wrapUrl: wrapUrl, mode: mode, setMode: setMode, active: active, equippedFor: equippedFor, view: view, look: function (role) { return LOOK[role] || null; }, from: FROM, until: UNTIL };
})(typeof window !== 'undefined' ? window : this);
