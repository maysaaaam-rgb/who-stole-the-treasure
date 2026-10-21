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
  function hasArt(name) { return !!ART[name]; }
  function loadArt() {
    try { var x = new XMLHttpRequest(); x.open('GET', 'art/manifest.json?v=' + Date.now(), true); x.onload = function () { try { if (x.status === 200) JSON.parse(x.responseText).forEach(function (n) { ART[n] = 1; }); } catch (e) { /* none */ } try { if (GM.app && GM.state && !GM.state.playing && (GM.state.screen === 'home' || GM.state.screen === 'setup')) GM.app.go(GM.state.screen); } catch (e) { /* ignore */ } }; x.send(); } catch (e) { /* offline file */ }
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

  /* ---- the team pods (bottom of the play screen): each team's monster BIG on a pedestal, name and score; the active team jumps ---- */
  function monFace(m, size) { var d = h('div', { class: 'gm-monface', html: GM.mon.svg(m, size * 1.5) }); d.style.width = d.style.height = size + 'px'; return d; }
  function monFull(m, size) { var d = h('div', { class: 'gm-monfull', html: GM.mon.svg(m, size) }); d.style.width = d.style.height = size + 'px'; return d; }
  function teamBar(teams, active) {
    var bar = document.getElementById('gm-teams'); if (!bar) return; bar.innerHTML = '';
    var n = teams.length, k = Math.max(0.75, Math.min(1.45, (root.innerHeight || 900) / 900)), size = Math.round((n <= 2 ? 132 : n <= 4 ? 112 : n <= 6 ? 92 : 78) * k);
    bar.className = 'gm-teams n' + n;
    teams.forEach(function (t, i) {
      var pod = h('div', { class: 'gm-pod' + (i === active ? ' on' : ''), id: 'gm-team-' + i }, [h('div', { class: 'gm-pod-mon' }, [monFull(t.mon, size)]), h('div', { class: 'gm-pod-plate' }, [h('b', { class: 'gm-pod-name', text: t.name }), h('span', { class: 'gm-score', text: String(t.score) })])]);
      pod.style.setProperty('--c', t.color); bar.appendChild(pod);
    });
  }
  function setScore(i, n) { var t = GM.state.teams[i]; t.score = Math.max(0, n); var c = document.querySelector('#gm-team-' + i + ' .gm-score'); if (c) { c.textContent = String(t.score); bump(c); } }
  function addScore(i, n) { setScore(i, GM.state.teams[i].score + n); }

  /* ---- THE QUESTION CARD: picture, sentence, Show, coloured answers A-D, Okay. Resolves { ok } and never takes points away ---- */
  var LETTERS = ['A', 'B', 'C', 'D'];
  function ask(item, team, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var over = h('div', { class: 'gm-over' }), card = h('div', { class: 'gm-qcard' }), body = h('div', { class: 'gm-qbody' }), picBox = h('div', { class: 'gm-qpic', html: pic(item.pic) }), q = h('div', { class: 'gm-q', text: item.q }), optBox = h('div', { class: 'gm-opts' }), foot = h('div', { class: 'gm-qfoot' }), msg = h('div', { class: 'gm-qmsg' });
      var timerEl = h('div', { class: 'gm-timer' }), head = h('div', { class: 'gm-qhead' }, [h('div', { class: 'gm-qmon' }, [monFull(team.mon, 92)]), h('div', { class: 'gm-qwho' }, [h('b', { text: team.name }), h('small', { text: opts.label || '' })]), h('span', { class: 'gm-grow' }), timerEl, btn('🔊', 'round sm', function () { A().speak(item.q); })]);
      head.style.setProperty('--c', team.color); card.style.setProperty('--c', team.color);
      var choice = null, tm = null, left = 0, done = false;
      if (item.pic) body.appendChild(picBox); else card.classList.add('nopic');
      body.appendChild(q); card.appendChild(head); card.appendChild(body); card.appendChild(optBox); card.appendChild(msg); card.appendChild(foot); over.appendChild(card);
      document.getElementById('gm-stage').appendChild(over);
      A().play('flip'); requestAnimationFrame(function () { card.classList.add('in'); });
      function finish(ok) {
        if (done) return; done = true; clearInterval(tm);
        [].forEach.call(optBox.children, function (b) { b.disabled = true; if (b.dataset.ok === '1') b.classList.add('good'); else if (b.classList.contains('sel')) b.classList.add('bad'); });
        okBtn.style.display = 'none';
        if (ok) { A().play('right'); confetti(14); fx('sparkle_burst', card, 1.6); msg.className = 'gm-qmsg ok'; msg.textContent = '✅ Well done, ' + team.name + '!'; } else { A().play('soft'); wobble(card); msg.className = 'gm-qmsg soft'; msg.textContent = 'Good try! The answer is \u201c' + item.a + '\u201d.'; }
        setTimeout(function () { card.classList.remove('in'); card.classList.add('out'); setTimeout(function () { if (over.parentNode) over.parentNode.removeChild(over); resolve({ ok: ok }); }, 220); }, ok ? 1000 : 1800);
      }
      var show = btn('👀  Show the answers', 'huge amber', function () {
        show.style.display = 'none'; A().play('flip');
        var opts2 = shuffle([item.a].concat((item.w || []).slice(0, 3)).filter(Boolean));
        optBox.className = 'gm-opts n' + opts2.length;
        opts2.forEach(function (t, k) {
          var b = h('button', { type: 'button', class: 'gm-opt c' + k }, [h('span', { class: 'gm-optl', text: LETTERS[k] }), h('span', { class: 'gm-optt', text: t })]); b.dataset.ok = t === item.a ? '1' : '0';
          b.addEventListener('click', function () { if (done) return; A().play('tap'); choice = t; [].forEach.call(optBox.children, function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); okBtn.style.display = ''; });
          b.style.animationDelay = (k * 70) + 'ms'; optBox.appendChild(b);
        });
        if (opts.timer > 0) {
          left = opts.timer; timerEl.innerHTML = '<b>' + left + '</b>'; timerEl.style.setProperty('--p', '100'); timerEl.classList.add('on');
          tm = setInterval(function () { left--; timerEl.innerHTML = '<b>' + Math.max(0, left) + '</b>'; timerEl.style.setProperty('--p', String(Math.max(0, left) / opts.timer * 100)); if (left <= 3 && left > 0) { A().play('tick'); timerEl.classList.add('low'); } if (left <= 0) { clearInterval(tm); msg.textContent = '⏰ Time is up!'; finish(false); } }, 1000);
        }
      });
      var okBtn = btn('✔  Okay!', 'huge green', function () { if (choice == null) return; finish(choice === item.a); }); okBtn.style.display = 'none';
      foot.appendChild(show); foot.appendChild(okBtn);
      foot.appendChild(btn('Skip ⏭', 'sm ghost', function () { if (done) return; done = true; clearInterval(tm); if (over.parentNode) over.parentNode.removeChild(over); resolve({ ok: false, skipped: true }); }));
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

  /* ---- the end: podium with the monsters standing on it ---- */
  function podium(teams, onAgain, onHome) {
    var stage = document.getElementById('gm-stage'); stage.innerHTML = '';
    var order = teams.map(function (t, i) { return { t: t, i: i }; }).sort(function (a, b) { return b.t.score - a.t.score; });
    var tie = order.length > 1 && order[0].t.score === order[1].t.score;
    var wrap = h('div', { class: 'gm-end' }, [h('div', { class: 'gm-end-title' }, [art('ui_trophy', '🏆', 'gm-trophy'), h('h2', { text: tie ? 'It is a tie!' : (order[0] ? order[0].t.name + ' wins!' : 'Game over!') })])]);
    var pod = h('div', { class: 'gm-podium' });
    [1, 0, 2].forEach(function (k) {
      var o = order[k]; var col = h('div', { class: 'gm-pcol r' + k + (o ? '' : ' empty') });
      if (o) { col.style.setProperty('--c', o.t.color); col.appendChild(h('div', { class: 'gm-pmon' }, [monFull(o.t.mon, k === 0 ? 170 : 130)])); col.appendChild(h('b', { class: 'gm-pname', text: o.t.name })); col.appendChild(h('span', { class: 'gm-pscore', text: o.t.score + ' points' })); }
      col.appendChild(h('div', { class: 'gm-pstep', text: String(k + 1) })); pod.appendChild(col);
    });
    wrap.appendChild(pod);
    if (order.length > 3) wrap.appendChild(h('div', { class: 'gm-rest' }, order.slice(3).map(function (o, k) { var r = h('div', { class: 'gm-restrow' }, [h('b', { text: (k + 4) + '.' }), monFace(o.t.mon, 40), h('span', { text: o.t.name }), h('em', { text: o.t.score + ' points' })]); r.style.setProperty('--c', o.t.color); return r; })));
    wrap.appendChild(h('div', { class: 'gm-row' }, [btn('🔁  Play again', 'huge green', onAgain), btn('☰  Other games', 'big ghost', onHome)])); stage.appendChild(wrap);
    A().play('fanfare'); confetti(40); setTimeout(function () { confetti(30); }, 900); setTimeout(function () { fx('sparkle_burst', pod, 2); }, 300);
  }

  GM.u = { fx: fx, hasArt: hasArt, monFull: monFull, h: h, btn: btn, shuffle: shuffle, rand: rand, sleep: sleep, art: art, confetti: confetti, floatText: floatText, wobble: wobble, bump: bump, monFace: monFace, teamBar: teamBar, setScore: setScore, addScore: addScore, ask: ask, chooseTeam: chooseTeam, podium: podium, pic: pic };
})(window);
