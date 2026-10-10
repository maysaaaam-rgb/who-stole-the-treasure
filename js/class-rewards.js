/* Rewards Hall: the smartboard version of the Classroom Store.
   Shows each pupil's monster, level badge (Star, Rocket, Crown), XP gem and coins, the top three on a podium, and the class party fund.
   Read-only: points are still given on the Class Board, and the teacher store (coins, boxes, requests) stays one tap away.
   Adds the view "rewards". */
(function (root) {
  'use strict';
  var ART = 'platform-art/';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return Number(n || 0).toLocaleString('en-US'); }

  var TIERS = [
    { min: 5, pic: 'r_badge_crown', name: 'Crown', c: '#ef4444' },
    { min: 4, pic: 'r_badge_rocket', name: 'Rocket', c: '#8b5cf6' },
    { min: 1, pic: 'r_badge_star', name: 'Star', c: '#38bdf8' }
  ];
  function tierOf(level) { level = Number(level) || 1; for (var i = 0; i < TIERS.length; i++) if (level >= TIERS[i].min) return TIERS[i]; return TIERS[TIERS.length - 1]; }

  function pupils(cls) {
    var st = S(), CS = root.ClassroomStore;
    return st.getStudentsByClass(cls.id).map(function (s) {
      var m = st.calculateMonsterState ? st.calculateMonsterState(s.id) : {}, prof = st.getMonsterProfile ? st.getMonsterProfile(s.id) : null, img = '';
      try { img = root.getStudentMonsterAvatarUrl ? root.getStudentMonsterAvatarUrl(s, prof, m) : ''; } catch (e) { img = ''; }
      var coins = 0; try { coins = CS && CS.balance ? CS.balance(s.id) : 0; } catch (e2) { coins = 0; }
      return { id: s.id, name: s.firstName || s.name || 'Student', xp: Number(m.totalXP != null ? m.totalXP : s.xp) || 0, level: Number(m.currentLevel) || 1, img: img, coins: coins };
    }).sort(function (a, b) { return b.xp - a.xp; });
  }

  function css() {
    if (document.getElementById('cr-css')) return;
    var st = document.createElement('style'); st.id = 'cr-css';
    st.textContent = '' +
      '.cr{font-family:Fredoka,Nunito,system-ui,sans-serif;color:#0f2a4a}' +
      '.cr-hd{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}.cr-hd h1{margin:0;font-size:clamp(1.8rem,3.4vw,2.6rem);font-weight:700;display:flex;align-items:center;gap:12px}.cr-hd h1 img{height:1.5em}' +
      '.cr-hd small{display:block;font-size:1.05rem;font-weight:600;opacity:.7}' +
      '.cr-btn{font:inherit;font-weight:800;font-size:1.05rem;cursor:pointer;border:0;border-bottom:5px solid #475569;border-radius:16px;padding:10px 18px;background:#fff;color:#0f2a4a;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}.cr-btn:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cr-podium{display:flex;align-items:flex-end;justify-content:center;gap:2vw;margin:2.4vh 0 1vh;min-height:30vh}' +
      '.cr-pod{display:flex;flex-direction:column;align-items:center;width:clamp(120px,19vw,210px);padding:1vh 1vw;border-radius:26px 26px 12px 12px;border-bottom:6px solid rgba(0,0,0,.28);background:linear-gradient(180deg,#fff,var(--c));box-shadow:0 10px 22px -10px rgba(15,42,74,.5)}' +
      '.cr-pod .mon{height:13vh;width:auto;object-fit:contain;filter:drop-shadow(0 .8vh .8vh rgba(0,0,0,.3));animation:crBob 3s ease-in-out infinite}.cr-pod .med{height:6.5vh;margin-top:-1vh}.cr-pod b{font-size:1.25rem;font-weight:700}.cr-pod .xp{display:flex;align-items:center;gap:6px;font-weight:700;font-size:1.1rem}.cr-pod .xp img{height:1.5em}' +
      '.cr-pod.p1{--c:#fde68a;min-height:31vh}.cr-pod.p2{--c:#e2e8f0;min-height:26vh}.cr-pod.p3{--c:#fed7aa;min-height:23vh}' +
      '.cr-legend{display:flex;gap:2vw;justify-content:center;flex-wrap:wrap;margin:1vh 0 2vh;background:rgba(255,255,255,.75);border-radius:22px;padding:1vh 2vw}.cr-legend span{display:flex;align-items:center;gap:8px;font-weight:700;font-size:1.05rem}.cr-legend img{height:5vh}' +
      '.cr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:2vh 1.2vw}' +
      '.cr-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:.4vh;padding:1.4vh 1vw 1.6vh;border:0;border-bottom:6px solid color-mix(in srgb,var(--c) 70%,#000);border-radius:26px;background:linear-gradient(180deg,#fff,color-mix(in srgb,var(--c) 22%,#fff));cursor:pointer;font:inherit;color:#0f2a4a;box-shadow:0 8px 18px -10px rgba(15,42,74,.5);transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
      '.cr-card:hover{transform:translateY(-3px)}.cr-card:active{transform:translateY(4px);border-bottom-width:1px}' +
      '.cr-card .mon{height:13vh;width:auto;max-width:90%;object-fit:contain;filter:drop-shadow(0 .8vh .8vh rgba(0,0,0,.28))}' +
      '.cr-card .bdg{position:absolute;left:8px;top:8px;height:10vh;width:auto;filter:drop-shadow(0 .4vh .4vh rgba(0,0,0,.3))}' +
      '.cr-card b.n{font-size:1.2rem;font-weight:700}.cr-card .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}' +
      '.cr-pill{display:inline-flex;align-items:center;gap:5px;background:#fff;border-radius:99px;padding:2px 12px 2px 6px;font-weight:700;font-size:1.05rem;border:2px solid rgba(15,42,74,.12)}.cr-pill img{height:1.5em}' +
      '.cr-fund{display:flex;align-items:center;gap:1.4vw;background:rgba(255,255,255,.85);border-radius:26px;padding:1.6vh 2vw;margin-bottom:2vh;border-bottom:6px solid #10b981}.cr-fund img{height:11vh}.cr-fund .bar{flex:1;height:2.6vh;border-radius:99px;background:#d1fae5;overflow:hidden}.cr-fund .bar i{display:block;height:100%;background:linear-gradient(90deg,#10b981,#fde047);border-radius:99px}' +
      '.cr-empty{text-align:center;font-size:1.3rem;padding:4vh}' +
      '.cr-burst{position:fixed;inset:0;z-index:99999;background:rgba(15,42,74,.55);display:flex;align-items:center;justify-content:center;animation:crFade .25s}' +
      '.cr-big{background:#fff;border-radius:34px;border-bottom:8px solid #38bdf8;padding:3vh 4vw;text-align:center;font-family:Fredoka,Nunito,sans-serif;color:#0f2a4a;animation:crPop .45s cubic-bezier(.175,.885,.32,1.275)}.cr-big .mon{height:26vh;width:auto}.cr-big .bdg{height:14vh;width:auto}.cr-big h2{margin:.6vh 0;font-size:2.4rem}.cr-big p{margin:0 0 1vh;font-size:1.3rem;font-weight:700}' +
      '@keyframes crBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-.8vh)}}@keyframes crFade{from{opacity:0}}@keyframes crPop{from{transform:scale(.4);opacity:0}}';
    document.head.appendChild(st);
  }
  function monsterImg(p, cls) { return p.img ? '<img class="' + cls + '" src="' + esc(p.img) + '" alt="" draggable="false">' : '<span class="' + cls + '" style="font-size:9vh">🐾</span>'; }

  function render(container) {
    css();
    var cls = S().getActiveClass(), list = pupils(cls), CS = root.ClassroomStore, fund = null;
    try { fund = CS && CS.fund ? CS.fund.get(cls.id) : null; } catch (e) { fund = null; }
    var totalXP = list.reduce(function (n, p) { return n + p.xp; }, 0), totalCoins = list.reduce(function (n, p) { return n + p.coins; }, 0);
    var top = list.slice(0, 3), order = top.length === 3 ? [top[1], top[0], top[2]] : top, cls3 = { 0: 'p1', 1: 'p2', 2: 'p3' };
    var rank = function (p) { return top.indexOf(p); };
    var pod = order.map(function (p) {
      var r = rank(p), medal = r === 0 ? 'r_trophy' : 'r_medal', place = ['1st', '2nd', '3rd'][r];
      return '<div class="cr-pod ' + cls3[r] + '">' + (r === 0 ? '<img class="crown" src="' + ART + 'r_badge_crown.webp" alt="">' : '') + '<i class="place">' + place + '</i>' + monsterImg(p, 'mon') + '<img class="med" src="' + ART + medal + '.webp" alt=""><b>' + esc(p.name) + '</b><span class="xp"><img src="' + ART + 'r_xp_gem.webp" alt="">' + fmt(p.xp) + '</span></div>';
    }).join('');
    var fundHtml = fund && fund.goal ? '<div class="cr-fund"><img src="' + ART + 'r_chest.webp" alt=""><div style="flex:1"><b style="font-size:1.4rem">' + esc(fund.name || 'Class party') + '</b><div class="bar"><i style="width:' + Math.min(100, Math.round((fund.raised || 0) / fund.goal * 100)) + '%"></i></div></div><b style="font-size:1.6rem">' + fmt(fund.raised) + ' / ' + fmt(fund.goal) + ' 🪙</b></div>' : '';
    container.innerHTML = '<div class="cr">' +
      '<div class="cr-hd"><div><h1><img src="' + ART + 'r_trophy.webp" alt="">Rewards</h1><small>' + esc(cls.name) + ' · ' + fmt(totalXP) + ' XP together · ' + fmt(totalCoins) + ' coins</small></div>' +
      '<div>' + (root.EAA_ILLUSTRATED_MONSTERS === true ? '<button type="button" class="cr-btn" onclick="MonsterCloset.open()">👗 Dress up</button> ' : '') + '<button type="button" class="cr-btn" onclick="switchView(\'board\')">⭐ Give points</button> <button type="button" class="cr-btn" onclick="switchView(\'store\')">🛍️ Teacher store</button></div></div>' +
      fundHtml +
      (list.length >= 1 ? '<div class="cr-podium">' + pod + '</div>' : '') +
      '<div class="cr-legend">' + TIERS.slice().reverse().map(function (t) { return '<span><img src="' + ART + t.pic + '.webp" alt="">' + t.name + (t.min > 1 ? ' · level ' + t.min + '+' : ' · levels 1-3') + '</span>'; }).join('') + '</div>' +
      '<div class="cr-grid">' + (list.length ? list.map(function (p) {
        var t = tierOf(p.level);
        return '<button type="button" class="cr-card" style="--c:' + t.c + '" onclick="ClassRewards.show(\'' + esc(p.id) + '\')"><img class="bdg" src="' + ART + t.pic + '.webp" alt="' + t.name + '">' + monsterImg(p, 'mon') +
          '<b class="n">' + esc(p.name) + '</b><div class="row"><span class="cr-pill"><img src="' + ART + 'r_xp_gem.webp" alt="">' + fmt(p.xp) + '</span><span class="cr-pill">🪙 ' + fmt(p.coins) + '</span></div></button>';
      }).join('') : '<p class="cr-empty">No pupils in this class yet.</p>') + '</div></div>';
  }

  var api = {
    show: function (id) {
      var cls = S().getActiveClass(), p = pupils(cls).filter(function (x) { return x.id === id; })[0]; if (!p) return;
      var t = tierOf(p.level), w = document.createElement('div'); w.className = 'cr-burst';
      w.innerHTML = '<div class="cr-big">' + monsterImg(p, 'mon') + '<br><img class="bdg" src="' + ART + t.pic + '.webp" alt=""><h2>' + esc(p.name) + '</h2><p>' + t.name + ' · level ' + p.level + '</p><p><img src="' + ART + 'r_xp_gem.webp" alt="" style="height:1.4em;vertical-align:middle"> ' + fmt(p.xp) + ' XP &nbsp; 🪙 ' + fmt(p.coins) + '</p>' + (root.EAA_ILLUSTRATED_MONSTERS === true ? '<button type="button" class="cr-btn" style="margin-top:6px" onclick="this.closest(\'.cr-burst\').remove();MonsterCloset.open(\'' + esc(p.id) + '\')">👗 Dress up</button>' : '') + '</div>';
      w.addEventListener('click', function () { w.remove(); }); document.body.appendChild(w);
      try { root.classSoundboard && root.classSoundboard.playFanfare && root.classSoundboard.playFanfare(); } catch (e) { /* optional */ }
      try { if (root.speechSynthesis) { var u = new SpeechSynthesisUtterance('Well done, ' + p.name + '!'); u.rate = 0.88; u.pitch = 1.05; u.lang = 'en-US'; root.speechSynthesis.cancel(); root.speechSynthesis.speak(u); } } catch (e2) { /* optional */ }
      setTimeout(function () { if (w.parentNode) w.remove(); }, 6000);
    }
  };
  root.ClassRewards = api; root.renderRewardsHall = render;
})(typeof window !== 'undefined' ? window : this);
