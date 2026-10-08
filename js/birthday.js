/* Birthday Star: press a birthday pupil's monster or name (roster card or Class Board) and a full-screen birthday
   celebration opens (confetti, cheerful chord, spoken wish, class sentence chips, optional bonus XP the teacher presses).
   Birthdays are kept on this device only (localStorage "eaa_birthdays_v1": pupil id -> "MM-DD"); nothing is written to the cloud.
   A birthday is celebrated on the day and for the next two days. Uras (4B) is built in for 8 October 2026. */
(function (root) {
  'use strict';
  var KEY = 'eaa_birthdays_v1', DAYS_AFTER = 2;
  var BUILT_IN = [{ first: 'uras', last: 'tekay', md: '10-08' }];
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').trim(); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* private mode */ } }
  function md(d) { return ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function isOn(bmd) {                                  // is today within [birthday, birthday + DAYS_AFTER]?
    var now = new Date(), y = now.getFullYear(), p = String(bmd).split('-'), m = parseInt(p[0], 10) - 1, d = parseInt(p[1], 10);
    if (isNaN(m) || isNaN(d)) return false;
    var start = new Date(y, m, d), t = new Date(y, now.getMonth(), now.getDate());
    var diff = Math.round((t - start) / 86400000);
    return diff >= 0 && diff <= DAYS_AFTER;
  }
  function student(id) { try { return S().getStudent ? S().getStudent(id) : null; } catch (e) { return null; } }
  function isBirthday(id) {
    var map = load(); if (map[id] && isOn(map[id])) return true;
    var st = student(id); if (!st) return false;
    var f = norm(st.firstName || st.name), l = norm(st.lastName);
    return BUILT_IN.some(function (b) { return f.indexOf(b.first) === 0 && (!b.last || l.indexOf(b.last) === 0) && isOn(b.md); });
  }
  function avatar(id) {
    try { var st = student(id), s = S(), prof = s.getMonsterProfile ? s.getMonsterProfile(id) : null, m = s.calculateMonsterState ? s.calculateMonsterState(id) : {}; return root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(st, prof, m) : ''; } catch (e) { return ''; }
  }

  var CSS = '.bd-ov{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:2vh;font-family:Fredoka,Nunito,system-ui,sans-serif;color:#fff;' +
    'background:radial-gradient(circle at 50% 30%,rgba(168,85,247,.55),rgba(6,9,17,.94) 70%);backdrop-filter:blur(10px);animation:bdIn .35s}@keyframes bdIn{from{opacity:0;transform:scale(1.04)}}' +
    '.bd-card{position:relative;text-align:center;max-width:min(980px,96vw);max-height:96vh;overflow:auto;border-radius:34px;padding:3vh 4vh 3vh;background:linear-gradient(180deg,rgba(76,29,149,.92),rgba(30,27,75,.94));border:3px solid rgba(253,224,71,.7);box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 60px rgba(253,224,71,.25)}' +
    '.bd-top{font-size:clamp(2.6rem,8vh,5rem);line-height:1;animation:bdBob 1.6s ease-in-out infinite}@keyframes bdBob{50%{transform:translateY(-1.4vh) rotate(4deg)}}' +
    '.bd-h{margin:.4vh 0;font-size:clamp(2rem,7vh,4.2rem);font-weight:700;color:#fde047;text-shadow:0 .6vh 0 rgba(0,0,0,.4);line-height:1.1}' +
    '.bd-sub{font-size:clamp(1.1rem,3vh,1.9rem);opacity:.92;margin:.4vh 0 1.4vh}' +
    '.bd-pic{position:relative;display:inline-block;margin:.6vh 0}.bd-pic img{height:clamp(130px,24vh,260px);width:auto;filter:drop-shadow(0 2vh 1.6vh rgba(0,0,0,.5));animation:bdBob 2.2s ease-in-out infinite}' +
    '.bd-pic .hat{position:absolute;left:50%;top:-4vh;transform:translateX(-50%) rotate(-8deg);font-size:clamp(3rem,9vh,5.4rem)}' +
    '.bd-chips{display:flex;flex-wrap:wrap;gap:1vh;justify-content:center;margin:1.2vh 0}.bd-chips button{border:0;border-bottom:4px solid rgba(0,0,0,.35);border-radius:99px;background:rgba(255,255,255,.18);color:#fff;font:600 clamp(.95rem,2.4vh,1.35rem) Fredoka,sans-serif;padding:.7vh 1.6vh;cursor:pointer}' +
    '.bd-chips button:active{transform:translateY(3px);border-bottom-width:1px}.bd-row{display:flex;flex-wrap:wrap;gap:1.2vh;justify-content:center;margin-top:1.2vh}' +
    '.bd-btn{border:0;border-bottom:5px solid rgba(0,0,0,.35);border-radius:18px;background:#22c55e;color:#fff;font:700 clamp(1rem,2.8vh,1.5rem) Fredoka,sans-serif;padding:1.2vh 2.6vh;cursor:pointer}.bd-btn.g2{background:rgba(255,255,255,.2)}.bd-btn.am{background:#f59e0b;color:#422006}' +
    '.bd-btn:active{transform:translateY(4px);border-bottom-width:1px}.bd-btn:disabled{opacity:.55}' +
    '.bd-conf{position:fixed;inset:0;pointer-events:none;z-index:100000;overflow:hidden}.bd-conf i{position:absolute;top:-8vh;font-style:normal;animation:bdFall 3.2s linear forwards}@keyframes bdFall{to{transform:translateY(116vh) rotate(600deg)}}';
  function ensureCss() { if (document.getElementById('bd-css')) return; var el = document.createElement('style'); el.id = 'bd-css'; el.textContent = CSS; document.head.appendChild(el); }
  function confetti() {
    var w = document.createElement('div'), em = ['🎉', '🎂', '🎈', '⭐', '🎁', '✨', '🎊', '🍰'], k; w.className = 'bd-conf';
    for (k = 0; k < 70; k++) { var i = document.createElement('i'); i.textContent = em[k % em.length]; i.style.left = (Math.random() * 98) + '%'; i.style.fontSize = (2 + Math.random() * 3) + 'rem'; i.style.animationDelay = (Math.random() * 1.6) + 's'; w.appendChild(i); }
    document.body.appendChild(w); setTimeout(function () { w.remove(); }, 5200);
  }
  function speak(text) {   // computer voice, calm settings from the platform rules
    try { if (!root.speechSynthesis) return; root.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05; root.speechSynthesis.speak(u); } catch (e) { /* optional */ }
  }
  function sound() {
    try { var sb = root.classSoundboard; if (sb) { (sb.playFanfare || function () {}).call(sb); setTimeout(function () { try { (sb.playApplause || function () {}).call(sb); } catch (e) { /* optional */ } }, 1300); } } catch (e) { /* optional */ }
  }

  var open = false;
  function celebrate(id) {
    if (open) return; ensureCss();
    var st = student(id); if (!st) return;
    var name = st.firstName || st.name || 'friend', img = avatar(id), ov = document.createElement('div'); open = true;
    ov.className = 'bd-ov'; ov.id = 'bd-ov';
    var chips = ['Happy birthday, ' + name + '!', 'You are kind.', 'You are funny.', 'You are clever.', 'You are a great friend.', 'We love you, ' + name + '!'];
    ov.innerHTML = '<div class="bd-card"><div class="bd-top">🎂</div><h1 class="bd-h">Happy Birthday, ' + esc(name) + '!</h1>' +
      '<div class="bd-sub">Today is a special day. Everybody say: <b>Happy birthday!</b></div>' +
      '<div class="bd-pic">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(name) + '">' : '<span style="font-size:20vh">🐾</span>') + '<span class="hat">🥳</span></div>' +
      '<div class="bd-sub">Say one sentence to ' + esc(name) + ':</div><div class="bd-chips">' + chips.map(function (c, k) { return '<button data-k="' + k + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="bd-row"><button class="bd-btn" id="bd-sing">🎶 Sing the birthday song!</button><button class="bd-btn am" id="bd-xp">🎁 Birthday bonus +20 XP</button><button class="bd-btn g2" id="bd-more">🎉 Confetti</button><button class="bd-btn g2" id="bd-x">Close</button></div></div>';
    document.body.appendChild(ov);
    confetti(); sound(); setTimeout(function () { speak('Happy birthday, ' + name + '!'); }, 700);
    ov.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) { if (e.target === ov) close(); return; }
      if (b.dataset.k != null) { speak(chips[+b.dataset.k]); try { root.classSoundboard && root.classSoundboard.playCoinReward && root.classSoundboard.playCoinReward(); } catch (x) { /* optional */ } }
    });
    ov.querySelector('#bd-more').onclick = function () { confetti(); sound(); };
    ov.querySelector('#bd-sing').onclick = function () { confetti(); speak('Everybody sing! Happy birthday to you, ' + name + '!'); try { root.classSoundboard && root.classSoundboard.playApplause && root.classSoundboard.playApplause(); } catch (x) { /* optional */ } };
    ov.querySelector('#bd-xp').onclick = function () {
      var b = this; b.disabled = true; b.textContent = '✓ +20 XP given!';
      try {
        if (root.ClassBoard && document.getElementById('cb-' + id)) root.ClassBoard.award(id, 20);
        else { S().giveXP(id, 20, 'Birthday bonus', 'Teacher', { category: 'positive', icon: '🎂' }); if (root.renderCurrentView) root.renderCurrentView(); }
      } catch (x) { b.textContent = 'Could not give XP'; }
      confetti();
    };
    function close() { open = false; ov.remove(); try { root.speechSynthesis && root.speechSynthesis.cancel(); } catch (x) { /* optional */ } }
    ov.querySelector('#bd-x').onclick = close;
    document.addEventListener('keydown', function esc2(e) { if (e.key === 'Escape') { document.removeEventListener('keydown', esc2); if (document.getElementById('bd-ov')) close(); } });
  }

  // Class Board: pressing the monster picture opens the party instead of marking the pupil away.
  // Class Board and roster: pressing the name opens it too.
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var cb = t.closest('.cb-st');
    if (cb && (t.closest('img') || t.closest('b.n')) && !t.closest('button')) {
      var id = cb.getAttribute('data-id'); if (id && isBirthday(id)) { e.stopPropagation(); e.preventDefault(); celebrate(id); }
      return;
    }
    var card = t.closest('.student-card');
    if (card && !t.closest('button, a, input, select, .card-dropdown-menu, .companion-tag')) {
      var sid = card.getAttribute('data-student-id');
      if (sid && (t.closest('.avatar-hero-container, .monster-viewport-stage') || t.closest('h2, h3, .student-name, .card-student-name, .student-card-name'))) {
        var real = (S().getStudents ? S().getStudents() : []).filter(function (s) { return s.id === sid || s.studentIdNumber === sid; })[0];
        var rid = real ? real.id : sid;
        if (isBirthday(rid)) celebrate(rid);
      }
    }
  }, true);

  root.Birthday = {
    celebrate: celebrate, isBirthday: isBirthday,
    setToday: function (id) { var m = load(); m[id] = md(new Date()); save(m); return m[id]; },
    set: function (id, mmdd) { var m = load(); m[id] = mmdd; save(m); },
    clear: function (id) { var m = load(); delete m[id]; save(m); }
  };
})(window);
