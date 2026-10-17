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
    if (!studentId || !active()) return base;
    var look = LOOK[roleKeyOf(studentId)]; if (!look) return base;
    var out = Object.assign({}, base);
    Object.keys(look).forEach(function (k) { out[k] = look[k]; });
    return out;
  }
  /** a copy of the monster profile for DRAWING (the saved profile object is never changed) */
  function view(studentId, profile) {
    if (!profile || !studentId || !active()) return profile;
    var look = LOOK[roleKeyOf(studentId)]; if (!look) return profile;
    var copy = Object.assign({}, profile); copy.equipped = equippedFor(studentId, profile.equipped); copy.aliceWeek = true;
    return copy;
  }
  root.AliceWeek = { active: active, equippedFor: equippedFor, view: view, look: function (role) { return LOOK[role] || null; }, from: FROM, until: UNTIL };
})(typeof window !== 'undefined' ? window : this);
