/* Rewards Hall: the smartboard Podium & Badges view inside the unified Store & Podium Hub.
   Shows each pupil's monster, level badge (Star, Rocket, Crown), XP gem and coins, the top three on a podium, and the class party fund. */
(function (root) {
  'use strict';
  var ART = 'platform-art/';
  function S() { return root.schoolStore || root.store; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function avatarOf(p) {
    var M = root.MilestoneCeremony, u = (M && M.pictureOf ? M.pictureOf(p) : (M && (M.photos.get(p.id) || M.photos.get(p.name)))) || p.avatarUrl || '';
    return u ? '<img class="cr-av' + (M && M.isAvatar(u) ? ' is-cartoon' : '') + '" src="' + esc(u) + '" alt="">' : '';
  }
  function goldTitle(p) {
    var M = root.MilestoneCeremony, t = M && (M.titleFor(p.id) || M.titleFor(p.name));
    return t ? '<span class="cr-gold">🏅 ' + esc(t) + '</span>' : '';
  }
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
      return { id: s.id, name: s.firstName || s.name || 'Student', firstName: s.firstName, lastName: s.lastName, avatarUrl: s.avatarUrl, extraData: s.extraData, xp: Number(m.totalXP != null ? m.totalXP : s.xp) || 0, level: Number(m.currentLevel) || 1, img: img, coins: coins };
    }).sort(function (a, b) { return b.xp - a.xp; });
  }

  function css() {
    if (document.getElementById('cr-css')) return;
    var st = document.createElement('style'); st.id = 'cr-css';
    st.textContent = '' +
      '.cr{font-family:"Plus Jakarta Sans",Fredoka,Nunito,system-ui,sans-serif;color:#e5edff;max-width:1200px;margin:0 auto;padding:6px 8px 80px}' +
      '.cr-hd{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:14px}.cr-hd h1{margin:0;font-size:clamp(1.6rem,2.6vw,2.1rem);font-weight:700;display:flex;align-items:center;gap:12px}.cr-hd h1 img{height:1.4em}' +
      '.cr-hd small{display:block;font-size:.95rem;font-weight:600;color:#cbd5e1}' +
      '.cr-btn{font:inherit;font-weight:800;font-size:.92rem;cursor:pointer;border:1.5px solid #26324a;border-bottom:4px solid #26324a;border-radius:13px;padding:9px 16px;background:rgba(15, 23, 42, 0.86);color:#e5edff;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}.cr-btn:active{transform:translateY(3px);border-bottom-width:1px}' +
      '.cr-podium{display:flex;align-items:flex-end;justify-content:center;gap:2vw;margin:2vh 0 1.5vh;min-height:28vh}' +
      '.cr-pod{position:relative;display:flex;flex-direction:column;align-items:center;width:clamp(130px,19vw,210px);padding:1.2vh 1vw;border-radius:24px 24px 14px 14px;border:1.5px solid #26324a;border-bottom:6px solid #26324a;background:linear-gradient(180deg,rgba(15, 23, 42, 0.86),var(--c));box-shadow:0 8px 20px -8px rgba(37,36,43,.14)}' +
      '.cr-pod .mon{height:12.5vh;width:auto;object-fit:contain;filter:drop-shadow(0 .6vh .6vh rgba(0,0,0,.22));animation:crBob 3s ease-in-out infinite}.cr-pod .med{height:6vh;margin-top:-1vh}.cr-pod b{font-size:1.15rem;font-weight:800;color:#e5edff}.cr-pod .xp{display:flex;align-items:center;gap:6px;font-weight:800;font-size:1.05rem;color:#a894f9}.cr-pod .xp img{height:1.4em}' +
      '.cr-pod.p1{--c:#FEF3C7;min-height:29vh;border-color:#F59E0B;border-bottom-color:#B45309}.cr-pod.p2{--c:#EFEBF9;min-height:25vh;border-color:#8D75E6;border-bottom-color:#4C389E}.cr-pod.p3{--c:#FFEDD5;min-height:22vh;border-color:#FB923C;border-bottom-color:#C2410C}' +
      '.cr-legend{display:flex;gap:2vw;justify-content:center;flex-wrap:wrap;margin:1vh 0 2vh;background:rgba(15, 23, 42, 0.86);border:1.5px solid #26324a;border-bottom:3px solid #26324a;border-radius:18px;padding:10px 18px}.cr-legend span{display:flex;align-items:center;gap:8px;font-weight:700;font-size:.95rem;color:#e5edff}.cr-legend img{height:4.2vh}' +
      '.cr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:14px}' +
      '.cr-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 12px 16px;border:1.5px solid #26324a;border-bottom:5px solid #26324a;border-radius:20px;background:rgba(15, 23, 42, 0.86);cursor:pointer;font:inherit;color:#e5edff;box-shadow:0 4px 14px rgba(37,36,43,.06);transition:transform .12s cubic-bezier(.175,.885,.32,1.275),border-color .14s}' +
      '.cr-card:hover{transform:translateY(-3px);border-color:#6E56CF}.cr-card:active{transform:translateY(3px);border-bottom-width:1px}' +
      '.cr-card .mon{height:11.5vh;width:auto;max-width:90%;object-fit:contain;filter:drop-shadow(0 .6vh .6vh rgba(0,0,0,.2))}' +
      '.cr-card .bdg{position:absolute;left:8px;top:8px;height:8vh;width:auto;filter:drop-shadow(0 .3vh .3vh rgba(0,0,0,.22))}' +
      '.cr-card b.n{font-size:1.08rem;font-weight:800;color:#e5edff}.cr-card .row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center}' +
      '.cr-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(232, 153, 48, 0.18);border-radius:99px;padding:3px 10px 3px 6px;font-weight:800;font-size:.92rem;border:1.5px solid #26324a;color:#e5edff}.cr-pill img{height:1.35em}' +
      '.cr-fund{display:flex;align-items:center;gap:1.4vw;background:rgba(15, 23, 42, 0.86);border:1.5px solid #26324a;border-radius:20px;padding:14px 18px;margin-bottom:18px;border-bottom:5px solid #10b981;box-shadow:0 4px 14px rgba(37,36,43,.05)}.cr-fund img{height:9vh}.cr-fund .bar{flex:1;height:2.2vh;border-radius:99px;background:rgba(232, 166, 48, 0.18);overflow:hidden;margin-top:6px}.cr-fund .bar i{display:block;height:100%;background:linear-gradient(90deg,#6E56CF,#10b981);border-radius:99px}' +
      '.cr-av{position:absolute;right:8px;top:8px;width:7.5vh;height:7.5vh;min-width:48px;min-height:48px;border-radius:50%;object-fit:cover;border:2.5px solid #f59e0b;background:rgba(15, 23, 42, 0.86);box-shadow:0 3px 8px rgba(0,0,0,.2)}.cr-av.is-cartoon{object-fit:contain;background:rgba(232, 196, 48, 0.18)}.cr-big .cr-av-big{position:static;display:inline-block;width:16vh;height:16vh;margin:1vh 0 0}' +
      '.cr-gold{font-size:.74rem;font-weight:900;letter-spacing:.04em;padding:2px 10px;border-radius:99px;color:#f9ca94;background:linear-gradient(180deg,rgba(232, 210, 48, 0.18),#f59e0b);border-bottom:3px solid #b45309}' +
      '.cr-empty{text-align:center;font-size:1.1rem;padding:4vh;color:#94a3b8}' +
      '.cr-burst{position:fixed;inset:0;z-index:99999;background:rgba(37,36,43,.55);display:flex;align-items:center;justify-content:center;animation:crFade .25s}' +
      '.cr-big{background:rgba(15, 23, 42, 0.86);border-radius:30px;border:2px solid #26324a;border-bottom:7px solid #6E56CF;padding:3vh 4vw;text-align:center;font-family:"Plus Jakarta Sans",Fredoka,sans-serif;color:#e5edff;animation:crPop .45s cubic-bezier(.175,.885,.32,1.275)}.cr-big .mon{height:24vh;width:auto}.cr-big .bdg{height:12vh;width:auto}.cr-big h2{margin:.6vh 0;font-size:2.1rem;font-family:"Fraunces",Georgia,serif}.cr-big p{margin:0 0 1vh;font-size:1.2rem;font-weight:700;color:#cbd5e1}' +
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
      return '<div class="cr-pod ' + cls3[r] + '">' + (r === 0 ? '<img class="crown" src="' + ART + 'r_badge_crown.webp" alt="">' : '') + avatarOf(p) + '<i class="place">' + place + '</i>' + monsterImg(p, 'mon') + '<img class="med" src="' + ART + medal + '.webp" alt=""><b>' + esc(p.name) + '</b><span class="xp"><img src="' + ART + 'r_xp_gem.webp" alt="">' + fmt(p.xp) + '</span></div>';
    }).join('');
    var fundHtml = fund && fund.goal ? '<div class="cr-fund"><img src="' + ART + 'r_chest.webp" alt=""><div style="flex:1"><b style="font-size:1.25rem;color:#e5edff">' + esc(fund.name || 'Class party') + '</b><div class="bar"><i style="width:' + Math.min(100, Math.round((fund.raised || 0) / fund.goal * 100)) + '%"></i></div></div><b style="font-size:1.4rem;color:#94f9da">' + fmt(fund.raised) + ' / ' + fmt(fund.goal) + ' 🪙</b></div>' : '';
    var hubBar = '<div class="tines-hub-bar">' +
      '<div class="tines-hub-tabs">' +
        '<button type="button" class="tines-tab-btn" onclick="switchView(\'store\')">🛍️ Coin Shop &amp; Mystery Boxes</button>' +
        '<button type="button" class="tines-tab-btn is-active" onclick="switchView(\'rewards\')">🏆 Class Podium &amp; Badges</button>' +
        '<button type="button" class="tines-tab-btn" onclick="switchView(\'store\');setTimeout(function(){if(window.ClassroomStore&&ClassroomStore.ui&&ClassroomStore.ui.openDrawer)ClassroomStore.ui.openDrawer();},60);">📄 Worksheet Coins &amp; Requests</button>' +
        (root.EAA_ILLUSTRATED_MONSTERS === true ? '<button type="button" class="tines-tab-btn" onclick="MonsterCloset.open()">👗 Monster Closet</button>' : '') +
      '</div>' +
      '<button type="button" class="tines-tab-btn" onclick="switchView(\'board\')">📺 Give Points on Board →</button>' +
    '</div>';
    container.innerHTML = '<div class="cr">' +
      '<div class="cr-hd"><div><h1><img src="' + ART + 'r_trophy.webp" alt="">Class Podium &amp; Badges</h1><small>' + esc(cls.name) + ' · ' + fmt(totalXP) + ' XP together · ' + fmt(totalCoins) + ' coins</small></div></div>' +
      hubBar +
      fundHtml +
      (list.length >= 1 ? '<div class="cr-podium">' + pod + '</div>' : '') +
      '<div class="cr-legend">' + TIERS.slice().reverse().map(function (t) { return '<span><img src="' + ART + t.pic + '.webp" alt="">' + t.name + (t.min > 1 ? ' · level ' + t.min + '+' : ' · levels 1-3') + '</span>'; }).join('') + '</div>' +
      '<div class="cr-grid">' + (list.length ? list.map(function (p) {
        var t = tierOf(p.level);
        return '<button type="button" class="cr-card" style="--c:' + t.c + '" onclick="ClassRewards.show(\'' + esc(p.id) + '\')"><img class="bdg" src="' + ART + t.pic + '.webp" alt="' + t.name + '">' + avatarOf(p) + monsterImg(p, 'mon') +
          '<b class="n">' + esc(p.name) + '</b>' + goldTitle(p) + '<div class="row"><span class="cr-pill"><img src="' + ART + 'r_xp_gem.webp" alt="">' + fmt(p.xp) + '</span><span class="cr-pill">🪙 ' + fmt(p.coins) + '</span></div></button>';
      }).join('') : '<p class="cr-empty">No pupils in this class yet.</p>') + '</div></div>';
  }

  var api = {
    show: function (id) {
      var cls = S().getActiveClass(), p = pupils(cls).filter(function (x) { return x.id === id; })[0]; if (!p) return;
      var t = tierOf(p.level), w = document.createElement('div'); w.className = 'cr-burst';
      w.innerHTML = '<div class="cr-big">' + monsterImg(p, 'mon') + '<br><img class="bdg" src="' + ART + t.pic + '.webp" alt="">' + avatarOf(p).replace('class="cr-av', 'class="cr-av cr-av-big') + '<h2>' + esc(p.name) + '</h2><p>' + t.name + ' · level ' + p.level + '</p><p><img src="' + ART + 'r_xp_gem.webp" alt="" style="height:1.4em;vertical-align:middle"> ' + fmt(p.xp) + ' XP &nbsp; 🪙 ' + fmt(p.coins) + '</p>' + (root.EAA_ILLUSTRATED_MONSTERS === true ? '<button type="button" class="cr-btn" style="margin-top:6px" onclick="this.closest(\'.cr-burst\').remove();MonsterCloset.open(\'' + esc(p.id) + '\')">👗 Dress up</button>' : '') + '</div>';
      w.addEventListener('click', function () { w.remove(); }); document.body.appendChild(w);
      try { root.classSoundboard && root.classSoundboard.playFanfare && root.classSoundboard.playFanfare(); } catch (e) { /* optional */ }
      try { if (root.speechSynthesis) { var u = new SpeechSynthesisUtterance('Well done, ' + p.name + '!'); u.rate = 0.88; u.pitch = 1.05; u.lang = 'en-US'; root.speechSynthesis.cancel(); root.speechSynthesis.speak(u); } } catch (e2) { /* optional */ }
      setTimeout(function () { if (w.parentNode) w.remove(); }, 6000);
    }
  };
  root.ClassRewards = api; root.renderRewardsHall = render;
})(typeof window !== 'undefined' ? window : this);
