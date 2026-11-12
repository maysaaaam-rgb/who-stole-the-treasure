/**
 * Monsters hidden (11 Nov 2026).
 *
 * Pupils are shown as their avatars everywhere. Monster levels, XP and unlocks keep running quietly
 * (they decide which avatar items open up), but no monster picture is shown.
 *   - window.EAA_HIDE_MONSTERS = false (set before this file) brings the monsters back.
 *   - Monster Studio and the Monster Closet open the pupil shop instead.
 *   - Level-up shows the pupil's avatar with "Level N!".
 *   - Sleepy Mio (the class quiet-time mascot) is not a pupil monster and stays.
 */
(function (root) {
  'use strict';
  if (root.EAA_HIDE_MONSTERS === undefined) root.EAA_HIDE_MONSTERS = true;
  if (root.EAA_HIDE_MONSTERS === false || typeof document === 'undefined') return;

  document.documentElement.classList.add('eaa-no-monsters');
  var css = document.createElement('style');
  css.id = 'eaa-no-monsters-style';
  css.textContent =
    '.eaa-no-monsters .cb-pet-badge,.eaa-no-monsters .cb-st-av-bubble.cb-pet-badge{display:none!important}' +
    '.eaa-nm-ovl{position:fixed;inset:0;z-index:10050;display:flex;align-items:center;justify-content:center;padding:16px;' +
      'background:radial-gradient(circle at 50% 30%,rgba(13,21,39,.92) 0%,rgba(6,9,17,.96) 100%)}' +
    '.eaa-nm-card{width:min(420px,100%);text-align:center;color:#e5edff;background:rgba(15,23,42,.86);backdrop-filter:blur(14px);' +
      'border:2px solid #f59e0b;border-radius:24px;padding:22px 20px;box-shadow:0 20px 60px rgba(0,0,0,.55)}' +
    '.eaa-nm-card img{width:220px;height:300px;object-fit:contain;filter:drop-shadow(0 10px 18px rgba(0,0,0,.5))}' +
    '@media (prefers-reduced-motion:no-preference){.eaa-nm-card img{animation:eaaNmBob 2.6s ease-in-out infinite}}' +
    '@keyframes eaaNmBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}' +
    '.eaa-nm-lvl{font-size:2.2rem;font-weight:900;color:#fde047;margin:6px 0 2px}' +
    '.eaa-nm-btn{margin-top:14px;padding:11px 22px;border-radius:14px;font-weight:900;font-size:1rem;cursor:pointer;color:#fff;' +
      'background:#10b981;border:0;border-bottom:5px solid #047857;transition:transform .15s cubic-bezier(.175,.885,.32,1.275)}' +
    '.eaa-nm-btn:active{transform:translateY(4px);border-bottom-width:1px}';
  (document.head || document.documentElement).appendChild(css);

  function pic(id) { try { return root.PupilAvatars && root.PupilAvatars.pictureFor ? root.PupilAvatars.pictureFor(id) : ''; } catch (e) { return ''; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function px(size) { var n = Number(size); return n > 0 ? n : 120; }
  function star(size) {
    var n = px(size);
    return '<div style="width:' + n + 'px;height:' + n + 'px;display:inline-flex;align-items:center;justify-content:center;font-size:' + Math.round(n * 0.55) + 'px;line-height:1;">⭐</div>';
  }
  var STAR_URL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><text x="60" y="88" font-size="80" text-anchor="middle">⭐</text></svg>');

  /* any monster drawing becomes the pupil's avatar (when we know the pupil) or a star */
  function wrapRender(orig) {
    if (!orig || orig.__eaaNm) return orig;
    var f = function (opts) {
      opts = opts || {};
      if (opts.mascot) return orig.apply(this, arguments);           // Sleepy Mio keeps its picture
      var sid = opts.studentId || (opts.student && opts.student.id) || '';
      var n = px(opts.size);
      if (sid) { var u = pic(sid); if (u) return '<img src="' + esc(u) + '" alt="" style="width:' + n + 'px;height:' + n + 'px;object-fit:contain;">'; }
      return star(n);
    };
    f.__eaaNm = true;
    return f;
  }

  /* level up: the pupil's avatar and the new level, nothing about monsters */
  function levelUp(student, stage) {
    var store = root.store || root.schoolStore;
    var s = (typeof student === 'string' && store && store.getStudent) ? store.getStudent(student) : student;
    if (!s || !document.body) return;
    var lvl = (stage && (stage.level || stage.currentLevel)) || '';
    var o = document.createElement('div');
    o.className = 'eaa-nm-ovl';
    o.innerHTML = '<div class="eaa-nm-card"><img src="' + esc(pic(s.id)) + '" alt="">' +
      '<div class="eaa-nm-lvl">🎉 Level ' + esc(lvl) + '!</div>' +
      '<div style="font-size:1.15rem;font-weight:800;">Well done, ' + esc(s.firstName || s.name || 'explorer') + '!</div>' +
      '<div style="font-size:.9rem;color:#cbd5e1;margin-top:6px;">New avatar items can open up in the shop.</div>' +
      '<button type="button" class="eaa-nm-btn">⭐ Great!</button></div>';
    o.addEventListener('click', function (e) { if (e.target === o || (e.target && e.target.classList.contains('eaa-nm-btn'))) o.remove(); });
    document.body.appendChild(o);
    try { if (root.classSoundboard && root.classSoundboard.playFanfare) root.classSoundboard.playFanfare(); } catch (e) { /* sound is optional */ }
  }

  function install() {
    var done = true;
    var R = root.MonsterRenderer;
    if (R) {
      if (R.renderMonsterSVG && !R.renderMonsterSVG.__eaaNm) R.renderMonsterSVG = wrapRender(R.renderMonsterSVG);
      if (R.getMonsterStageImage && !R.getMonsterStageImage.__eaaNm) { R.getMonsterStageImage = function () { return STAR_URL; }; R.getMonsterStageImage.__eaaNm = true; }
      if (R.renderMonsterEvolutionStagesBanner && !R.renderMonsterEvolutionStagesBanner.__eaaNm) { R.renderMonsterEvolutionStagesBanner = function () { return ''; }; R.renderMonsterEvolutionStagesBanner.__eaaNm = true; }
    } else done = false;
    if (root.renderMonsterSVG && !root.renderMonsterSVG.__eaaNm) root.renderMonsterSVG = wrapRender(root.renderMonsterSVG);
    var G = root.GamificationMilestones;
    if (G && G.triggerEvolutionCeremony && !G.triggerEvolutionCeremony.__eaaNm) {
      G.triggerEvolutionCeremony = levelUp; G.triggerEvolutionCeremony.__eaaNm = true;
      root.triggerEvolutionCeremony = levelUp;
    } else if (!G) done = false;
    if (root.switchView && !root.switchView.__eaaNm) {
      var sv = root.switchView;
      root.switchView = function (v) {
        if (v === 'monster' || v === 'closet') v = 'store-pupil';
        return sv.apply(this, [v].concat([].slice.call(arguments, 1)));
      };
      root.switchView.__eaaNm = true;
    } else if (!root.switchView) done = false;
    if (root.MonsterCloset && root.MonsterCloset.open && !root.MonsterCloset.open.__eaaNm) {
      root.MonsterCloset.open = function (sid) {
        if (root.ClassroomStore && root.ClassroomStore.ui && root.ClassroomStore.ui.openStudio) root.ClassroomStore.ui.openStudio({ pick: sid || null, mode: 'avatar' });
        else if (root.switchView) root.switchView('store-pupil');
      };
      root.MonsterCloset.open.__eaaNm = true;
    }
    if (root.openMonsterCreator && !root.openMonsterCreator.__eaaNm) {
      root.openMonsterCreator = function (sid) {
        if (root.ClassroomStore && root.ClassroomStore.ui && root.ClassroomStore.ui.openStudio) root.ClassroomStore.ui.openStudio({ pick: sid || null, mode: 'avatar' });
        else if (root.PupilAvatars && root.PupilAvatars.open) root.PupilAvatars.open({ pick: sid });
      };
      root.openMonsterCreator.__eaaNm = true;
    }
    return done;
  }
  root.EAANoMonsters = { install: install, levelUp: levelUp };
  install();
  var tries = 0, t = setInterval(function () { if (install() || ++tries > 60) clearInterval(t); }, 500);
  root.addEventListener('load', install);
})(typeof window !== 'undefined' ? window : this);
