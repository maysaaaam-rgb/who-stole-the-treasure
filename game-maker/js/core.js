/* Game Maker core: small helpers, the question card every game uses, the team bar, effects and the podium. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  var A = function () { return GM.audio; };

  function h(tag, attrs, kids) {
    var el = document.createElement(tag), k;
    if (attrs) for (k in attrs) {
      if (k === 'class') el.className = attrs[k]; else if (k === 'text') el.textContent = attrs[k]; else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]); else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function btn(label, cls, fn) { var b = h('button', { type: 'button', class: 'gm-btn ' + (cls || ''), text: label }); b.addEventListener('click', function (e) { A().play('tap'); fn(e); }); return b; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function pic(p) { if (!p) return ''; return /\.(png|webp|jpe?g|gif|svg)/i.test(p) ? '<img alt="" src="' + p + '">' : '<span class="gm-emoji">' + p + '</span>'; }

  /* ---- art with a fallback: the file is used when it is in art/manifest.json, otherwise the emoji ---- */
  var ART = {};
  function loadArt() {
    try { var x = new XMLHttpRequest(); x.open('GET', 'art/manifest.json?v=' + Date.now(), true); x.onload = function () { try { if (x.status === 200) JSON.parse(x.responseText).forEach(function (n) { ART[n] = 1; }); } catch (e) { /* none */ } }; x.send(); } catch (e) { /* offline file */ }
  }
  function art(name, emoji, cls) { return ART[name] ? h('img', { class: 'gm-art ' + (cls || ''), src: 'art/' + name + '.webp', alt: '' }) : h('span', { class: 'gm-art-emoji ' + (cls || ''), text: emoji || '' }); }
  var FX = {};
  function loadFx() { try { var x = new XMLHttpRequest(); x.open('GET', 'art/effects.json?v=' + Date.now(), true); x.onload = function () { try { if (x.status === 200) FX = JSON.parse(x.responseText) || {}; } catch (e) { /* none */ } }; x.send(); } catch (e) { /* offline file */ } }
  loadArt(); loadFx();
  /* play a sprite strip (a horizontal row of frames) at a screen point or on an element; does nothing when the strip is not there */
  function fx(name, where, scale) {
    var d = FX[name] || FX['fx_' + name]; if (!d || !d.file) return; var layer = document.getElementById('gm-fx'); if (!layer) return;
    var r = where && where.getBoundingClientRect ? where.getBoundingClientRect() : { left: where.x, top: where.y, width: 0, height: 0 }, sc = scale || 1, w = d.frameWidth * sc, hh = d.frameHeight * sc, n = d.frames, secs = n / (d.fps || 12);
    var e = h('div', { class: 'gm-sprite' }); e.style.cssText = 'left:' + (r.left + r.width / 2 - w / 2) + 'px;top:' + (r.top + r.height / 2 - hh / 2) + 'px;width:' + w + 'px;height:' + hh + 'px;background-image:url(art/' + d.file + ');background-size:' + (w * n) + 'px ' + hh + 'px;--end:' + (-w * n) + 'px;animation:gmsprite ' + secs + 's steps(' + n + ') ' + (d.loop ? 'infinite' : '1 forwards');
    layer.appendChild(e); if (!d.loop) setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, secs * 1000 + 100);
    return e;
  }

  /* ---- effects ---- */
  function confetti(n) {
    var layer = document.getElementById('gm-fx'); if (!layer) return; var em = (GM.state && GM.state.theme === 'halloween') ? ['🎃', '👻', '🦇', '⭐', '✨', '🕸️'] : ['⭐', '🎉', '✨', '🌟', '🎊'];
    for (var i = 0; i < (n || 26); i++) {
      var s = h('span', { class: 'gm-conf', text: em[i % em.length] }); s.style.left = Math.random() * 100 + 'vw'; s.style.fontSize = (16 + Math.random() * 22) + 'px'; s.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; s.style.animationDelay = Math.random() * 0.5 + 's';
      layer.appendChild(s); (function (x) { setTimeout(function () { if (x.parentNode) x.parentNode.removeChild(x); }, 3800); })(s);
    }
  }
  function floatText(text, el, cls) {
    var layer = document.getElementById('gm-fx'); if (!layer || !el) return; var r = el.getBoundingClientRect();
    var s = h('span', { class: 'gm-float ' + (cls || ''), text: text }); s.style.left = (r.left + r.width / 2) + 'px'; s.style.top = (r.top + r.height / 2) + 'px'; layer.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 1500);
  }
  function wobble(el) { if (!el) return; el.classList.remove('gm-wobble'); void el.offsetWidth; el.classList.add('gm-wobble'); }
  function bump(el) { if (!el) return; el.classList.remove('gm-bump'); void el.offsetWidth; el.classList.add('gm-bump'); }

  /* ---- the team bar (top): monster, name, score; the active team glows ---- */
  function monFace(m, size) { var d = h('div', { class: 'gm-monface', html: GM.mon.svg(m, size * 1.5) }); d.style.width = d.style.height = size + 'px'; return d; }
  function teamBar(teams, active) {
    var bar = document.getElementById('gm-teams'); if (!bar) return; bar.innerHTML = '';
    teams.forEach(function (t, i) {
      var chip = h('div', { class: 'gm-team' + (i === active ? ' on' : ''), id: 'gm-team-' + i }, [monFace(t.mon, 44), h('div', { class: 'gm-tname' }, [h('b', { text: t.name }), h('span', { class: 'gm-score', text: String(t.score) })])]);
      chip.style.setProperty('--c', t.color); bar.appendChild(chip);
    });
  }
  function setScore(i, n) { var t = GM.state.teams[i]; t.score = Math.max(0, n); var c = document.querySelector('#gm-team-' + i + ' .gm-score'); if (c) { c.textContent = String(t.score); bump(c); } }
  function addScore(i, n) { setScore(i, GM.state.teams[i].score + n); }

  /* ---- THE QUESTION CARD: picture, sentence, Show, four answers, Okay. Resolves { ok } and never takes points away ---- */
  function ask(item, team, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var over = h('div', { class: 'gm-over' }), card = h('div', { class: 'gm-card gm-glass' }), picBox = h('div', { class: 'gm-qpic', html: pic(item.pic) }), q = h('div', { class: 'gm-q', text: item.q }), optBox = h('div', { class: 'gm-opts' }), foot = h('div', { class: 'gm-qfoot' }), msg = h('div', { class: 'gm-qmsg' });
      var head = h('div', { class: 'gm-qhead' }, [monFace(team.mon, 54), h('b', { text: team.name + (opts.label ? '  ·  ' + opts.label : '') }), h('span', { class: 'gm-grow' })]);
      head.style.setProperty('--c', team.color); if (GM.state && GM.state.theme === 'halloween') head.appendChild(art('c_pumpkin', '🎃', 'gm-corner'));
      var timerEl = h('span', { class: 'gm-timer', text: '' }); head.appendChild(timerEl);
      head.appendChild(btn('🔊', 'sm', function () { A().speak(item.q); }));
      var choice = null, tm = null, left = 0, done = false;
      if (!item.pic) picBox.style.display = 'none';
      card.appendChild(head); card.appendChild(picBox); card.appendChild(q); card.appendChild(optBox); card.appendChild(msg); card.appendChild(foot); over.appendChild(card);
      document.getElementById('gm-stage').appendChild(over);
      A().play('flip');
      function finish(ok) {
        if (done) return; done = true; clearInterval(tm);
        [].forEach.call(optBox.children, function (b) { b.disabled = true; if (b.dataset.ok === '1') b.classList.add('good'); });
        if (ok) { A().play('right'); confetti(14); fx('sparkle_burst', card, 1.4); msg.textContent = '✅ Well done!'; } else { A().play('soft'); wobble(card); msg.textContent = 'Almost! The answer is “' + item.a + '”. Good try!'; }
        setTimeout(function () { if (over.parentNode) over.parentNode.removeChild(over); resolve({ ok: ok }); }, ok ? 900 : 1700);
      }
      var show = btn('👀 Show the answers', 'big amber', function () {
        show.style.display = 'none'; A().play('flip');
        var opts2 = shuffle([item.a].concat((item.w || []).slice(0, 3)).filter(Boolean));
        opts2.forEach(function (t) { var b = h('button', { type: 'button', class: 'gm-opt gm-btn', text: t }); b.dataset.ok = t === item.a ? '1' : '0'; b.addEventListener('click', function () { if (done) return; A().play('tap'); choice = t; [].forEach.call(optBox.children, function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); okBtn.style.display = ''; }); optBox.appendChild(b); });
        if (opts.timer > 0) { left = opts.timer; timerEl.textContent = '⏱ ' + left; tm = setInterval(function () { left--; timerEl.textContent = '⏱ ' + left; if (left <= 3 && left > 0) A().play('tick'); if (left <= 0) { clearInterval(tm); msg.textContent = '⏰ Time is up!'; finish(false); } }, 1000); }
      });
      var okBtn = btn('✔ Okay!', 'big green', function () { if (choice == null) return; finish(choice === item.a); }); okBtn.style.display = 'none';
      foot.appendChild(show); foot.appendChild(okBtn);
      foot.appendChild(btn('⏭ Skip', 'sm ghost', function () { if (done) return; done = true; clearInterval(tm); if (over.parentNode) over.parentNode.removeChild(over); resolve({ ok: false, skipped: true }); }));
    });
  }

  /* ---- a simple choice dialog (for power-ups that need a team) ---- */
  function chooseTeam(title, teams, exceptIdx) {
    return new Promise(function (resolve) {
      var over = h('div', { class: 'gm-over' }), card = h('div', { class: 'gm-card gm-glass gm-pick' }, [h('div', { class: 'gm-q', text: title })]), row = h('div', { class: 'gm-pickrow' });
      teams.forEach(function (t, i) { if (i === exceptIdx) return; var b = h('button', { type: 'button', class: 'gm-btn gm-pickteam' }, [monFace(t.mon, 56), h('b', { text: t.name }), h('small', { text: t.score + ' points' })]); b.style.setProperty('--c', t.color); b.addEventListener('click', function () { A().play('tap'); over.remove(); resolve(i); }); row.appendChild(b); });
      card.appendChild(row); over.appendChild(card); document.getElementById('gm-stage').appendChild(over);
    });
  }

  /* ---- the end: podium ---- */
  function podium(teams, onAgain, onHome) {
    var stage = document.getElementById('gm-stage'); stage.innerHTML = '';
    var order = teams.map(function (t, i) { return { t: t, i: i }; }).sort(function (a, b) { return b.t.score - a.t.score; });
    var wrap = h('div', { class: 'gm-end' }, [h('h2', { text: '🏆 Game over!' })]), row = h('div', { class: 'gm-podium' });
    order.forEach(function (o, k) {
      var col = h('div', { class: 'gm-pcol r' + k }, [monFace(o.t.mon, k === 0 ? 120 : 84), h('b', { text: o.t.name }), h('span', { class: 'gm-pscore', text: o.t.score + ' points' }), h('div', { class: 'gm-pstep', text: String(k + 1) })]);
      col.style.setProperty('--c', o.t.color); col.style.setProperty('--h', Math.max(60, 150 - k * 28) + 'px'); row.appendChild(col);
    });
    wrap.appendChild(row); wrap.appendChild(h('div', { class: 'gm-row' }, [btn('🔁 Play again', 'big green', onAgain), btn('🏠 Home', 'ghost', onHome)])); stage.appendChild(wrap);
    A().play('fanfare'); confetti(40); setTimeout(function () { confetti(30); }, 900);
  }

  GM.u = { fx: fx, h: h, btn: btn, shuffle: shuffle, rand: rand, sleep: sleep, art: art, confetti: confetti, floatText: floatText, wobble: wobble, bump: bump, monFace: monFace, teamBar: teamBar, setScore: setScore, addScore: addScore, ask: ask, chooseTeam: chooseTeam, podium: podium, pic: pic };
})(window);
