/* Game Maker core: small helpers, the question card every game uses, the team bar, effects and the podium. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  var A = function () { return GM.audio; };
  GM.sessionMissed = GM.sessionMissed || [];

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

  /* Fair pupil rotation inside a team when a class roster is active */
  function advanceTeamPupil(t) {
    if (!t || !Array.isArray(t.roster) || t.roster.length < 2) return;
    t.rIdx = ((t.rIdx || 0) + 1) % t.roster.length;
    t.mon = t.roster[t.rIdx];
  }

  function teamBar(teams, active) {
    var bar = document.getElementById('gm-teams'); if (!bar) return; bar.innerHTML = '';
    var n = teams.length, k = Math.max(0.75, Math.min(1.45, (root.innerHeight || 900) / 900)), size = Math.round((n <= 2 ? 132 : n <= 4 ? 112 : n <= 6 ? 92 : 78) * k);
    bar.className = 'gm-teams n' + n;
    teams.forEach(function (t, i) {
      var pupilName = (t.mon && t.mon.name) ? ' · ' + t.mon.name : '';
      var pod = h('div', { class: 'gm-pod' + (i === active ? ' on' : ''), id: 'gm-team-' + i }, [
        h('div', { class: 'gm-pod-mon' }, [monFull(t.mon, size)]),
        h('div', { class: 'gm-pod-plate' }, [
          h('b', { class: 'gm-pod-name', text: t.name + (i === active ? pupilName : '') }),
          h('span', { class: 'gm-score', text: String(t.score) })
        ])
      ]);
      pod.style.setProperty('--c', t.color); bar.appendChild(pod);
    });
  }
  function setScore(i, n) { var t = GM.state.teams[i]; t.score = Math.max(0, n); var c = document.querySelector('#gm-team-' + i + ' .gm-score'); if (c) { c.textContent = String(t.score); bump(c); } }
  function addScore(i, n) { setScore(i, GM.state.teams[i].score + n); }

  /* ---- THE QUESTION CARD: picture, sentence, Show, coloured answers A-D (plus optional word-tile builder), Okay. Resolves { ok } and never takes points away ---- */
  var LETTERS = ['A', 'B', 'C', 'D'];
  function fillSentence(qText, ans) {
    var s = String(qText || '');
    if (!ans) return h('span', { text: s });
    if (/_{2,}/.test(s)) {
      var parts = s.split(/_{2,}/);
      var wrap = h('span');
      parts.forEach(function (p, i) {
        if (p) wrap.appendChild(document.createTextNode(p));
        if (i < parts.length - 1) wrap.appendChild(h('span', { class: 'gm-qfill', text: ' ' + ans + ' ' }));
      });
      return wrap;
    }
    return h('span', { text: s });
  }
  function spokenSentenceOf(item) {
    if (!item) return '';
    if (item.speak) return String(item.speak);
    var q = String(item.q || ''), a = String(item.a || '');
    if (a && /_{2,}/.test(q)) return q.replace(/_{2,}/g, a);
    return a ? (q + ' ' + a) : q;
  }

  function ask(item, team, opts) {
    opts = opts || {};
    item = item || { q: 'Ready?', a: 'Yes!', w: ['Not yet'] };
    return new Promise(function (resolve) {
      var pupilSub = (team && team.mon && team.mon.name) ? ('👤 ' + team.mon.name + (opts.label ? ' · ' + opts.label : '')) : (opts.label || '');
      var over = h('div', { class: 'gm-over' }), card = h('div', { class: 'gm-qcard' }), body = h('div', { class: 'gm-qbody' }), picBox = h('div', { class: 'gm-qpic', html: pic(item.pic) }), qWrap = h('div', { class: 'gm-qstack' }), q = h('div', { class: 'gm-q', text: item.q }), optBox = h('div', { class: 'gm-opts' }), foot = h('div', { class: 'gm-qfoot' }), msg = h('div', { class: 'gm-qmsg' });
      var timerEl = h('div', { class: 'gm-timer' }), head = h('div', { class: 'gm-qhead' }, [
        h('div', { class: 'gm-qmon' }, [monFull(team.mon, 92)]),
        h('div', { class: 'gm-qwho' }, [h('b', { text: team.name }), h('small', { text: pupilSub })]),
        h('span', { class: 'gm-grow' }),
        timerEl,
        btn('🔊', 'round sm', function () { A().speak(done ? spokenSentenceOf(item) : (item.speak || item.pass || item.q)); })
      ]);
      head.style.setProperty('--c', team.color); card.style.setProperty('--c', team.color);
      var choice = null, tm = null, closeTm = null, left = 0, done = false, closed = false, lastOutcome = false;

      if (item.pic) body.appendChild(picBox); else card.classList.add('nopic');
      if (item.pass) {
        var passBox = h('div', { class: 'gm-qpass' }, [
          h('span', { class: 'gm-qpass-tag', text: '📖 Read' }),
          h('span', { text: ' ' + item.pass })
        ]);
        qWrap.appendChild(passBox);
      }
      qWrap.appendChild(q);
      body.appendChild(qWrap);

      /* Optional tap-to-order word-tile tray when item.order is present */
      var orderTray = null;
      if (Array.isArray(item.order) && item.order.length >= 3) {
        orderTray = h('div', { class: 'gm-order-wrap', style: 'display:none' });
        qWrap.appendChild(orderTray);
      }

      card.appendChild(head); card.appendChild(body); card.appendChild(optBox); card.appendChild(msg); card.appendChild(foot); over.appendChild(card);
      document.getElementById('gm-stage').appendChild(over);
      A().play('flip');
      setTimeout(function () {
        over.classList.add('in');
        card.classList.add('in');
      }, 16);

      function closeModal(resObj) {
        if (closed) return;
        closed = true;
        clearInterval(tm);
        clearTimeout(closeTm);
        over.classList.remove('in');
        over.classList.add('out');
        card.classList.remove('in');
        card.classList.add('out');
        /* Rotate to next pupil on this team for their next turn */
        if (team && Array.isArray(team.roster) && team.roster.length > 1 && !(resObj && resObj.skipped)) {
          advanceTeamPupil(team);
        }
        setTimeout(function () {
          if (over.parentNode) over.parentNode.removeChild(over);
          resolve(resObj);
        }, 260);
      }

      function finish(ok) {
        if (done) return; done = true; lastOutcome = !!ok; clearInterval(tm);
        [].forEach.call(optBox.children, function (b) { b.disabled = true; if (b.dataset.ok === '1') b.classList.add('good'); else if (b.classList.contains('sel')) b.classList.add('bad'); });
        okBtn.style.display = 'none';
        skipBtn.style.display = 'none';
        sayTogetherBtn.style.display = '';
        nextBtn.style.display = '';
        if (item.a && /_{2,}/.test(item.q || '')) {
          q.innerHTML = '';
          q.appendChild(fillSentence(item.q, item.a));
        }
        if (ok) {
          A().play('right'); confetti(14); fx('sparkle_burst', card, 1.6);
          msg.className = 'gm-qmsg ok'; msg.textContent = '✅ Well done, ' + team.name + '! Say the full sentence together!';
        } else {
          A().play('soft'); wobble(card);
          msg.className = 'gm-qmsg soft'; msg.textContent = 'Good try! The answer is \u201c' + item.a + '\u201d.';
          if (GM.sessionMissed && item && item.q && !GM.sessionMissed.some(function (x) { return x.q === item.q; })) {
            GM.sessionMissed.push(item);
          }
        }
        var reviewDelay = opts.reviewDelay || (ok ? 1850 : 2800);
        closeTm = setTimeout(function () { closeModal({ ok: ok }); }, reviewDelay);
      }

      var show = btn('👀  Show the answers', 'huge amber', function () {
        show.style.display = 'none'; A().play('flip');
        if (item.speak && /^Listen\./i.test(item.q || '')) {
          try { A().speak(item.speak); } catch (e) { /* ignore */ }
        }
        if (orderTray && Array.isArray(item.order)) {
          orderTray.style.display = '';
          var picked = [], bankWords = shuffle(item.order.slice());
          var slotsEl = h('div', { class: 'gm-order-slots' }), chipsEl = h('div', { class: 'gm-order-chips' });
          function syncOrder() {
            slotsEl.innerHTML = '';
            if (!picked.length) {
              slotsEl.appendChild(h('span', { class: 'gm-order-placeholder', text: 'Tap the words below in order — or pick A / B / C below!' }));
            } else {
              picked.forEach(function (wObj, idx) {
                var sb = h('button', { type: 'button', class: 'gm-order-word on', text: wObj.w });
                sb.addEventListener('click', function () {
                  if (done) return;
                  A().play('tap');
                  wObj.btn.disabled = false;
                  picked.splice(idx, 1);
                  syncOrder();
                });
                slotsEl.appendChild(sb);
              });
            }
            if (picked.length === item.order.length) {
              choice = picked.map(function (x) { return x.w; }).join(' ');
              okBtn.style.display = '';
            }
          }
          bankWords.forEach(function (w) {
            var wb = h('button', { type: 'button', class: 'gm-order-word', text: w });
            wb.addEventListener('click', function () {
              if (done || wb.disabled) return;
              A().play('tap');
              wb.disabled = true;
              picked.push({ w: w, btn: wb });
              syncOrder();
            });
            chipsEl.appendChild(wb);
          });
          orderTray.appendChild(slotsEl);
          orderTray.appendChild(chipsEl);
          syncOrder();
        }
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
      var sayTogetherBtn = btn('🗣️ Say it together 🔊', 'big amber', function () {
        clearTimeout(closeTm);
        A().speak(spokenSentenceOf(item));
      });
      sayTogetherBtn.style.display = 'none';
      var nextBtn = btn('Continue ▶', 'big cyan', function () { closeModal({ ok: lastOutcome }); }); nextBtn.style.display = 'none';
      var skipBtn = btn('Skip ⏭', 'sm ghost', function () { if (done) return; done = true; closeModal({ ok: false, skipped: true }); });
      foot.appendChild(show); foot.appendChild(okBtn); foot.appendChild(sayTogetherBtn); foot.appendChild(nextBtn); foot.appendChild(skipBtn);
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

  /* ---- the end: podium with the monsters standing on it + missed questions replay ---- */
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

    var missed = (GM.sessionMissed || []).slice(0, 6);
    var actions = [btn('🔁  Play again', 'huge green', onAgain)];
    if (missed.length && GM.rev && typeof GM.rev.remember === 'function') {
      actions.push(btn('🧠 Practice ' + missed.length + ' missed question' + (missed.length > 1 ? 's' : ''), 'big amber', function () {
        GM.sessionMissed = [];
        GM.rev.remember(missed, { points: missed.length, check: Math.min(3, missed.length) }, function () {
          podium(teams, onAgain, onHome);
        });
      }));
    }
    if (GM.rev && GM.rev.hardList && (GM.sessionTally || []).length) {
      var hard = GM.rev.hardList().length;
      actions.unshift(btn('📋 What we found hard' + (hard ? ' (' + hard + ')' : ''), 'huge amber', function () { GM.rev.hardReview(function () { podium(teams, onAgain, onHome); }); }));
    }
    actions.push(btn('☰  Other games', 'big ghost', onHome));
    wrap.appendChild(h('div', { class: 'gm-row' }, actions));
    stage.appendChild(wrap);
    A().play('fanfare'); confetti(40); setTimeout(function () { confetti(30); }, 900); setTimeout(function () { fx('sparkle_burst', pod, 2); }, 300);
  }

  /* ---- GameEngineCore (GM.engine): decoupled state machine, 1-8 team rotation, managed timers/RAFs/tweens ---- */
  var EASE = {
    linear: function (t) { return t; },
    outQuad: function (t) { return t * (2 - t); },
    outCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    outBack: function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outElastic: function (t) { return t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1; },
    outBounce: function (t) {
      var n1 = 7.5625, d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  };

  function createSession(ctx, opts) {
    opts = opts || {};
    var teams = (GM.state && GM.state.teams) || [];
    var nt = Math.max(1, teams.length);
    var listeners = {}, cleanups = [], rafs = [], timers = [], intervals = [];
    var state = {
      phase: opts.initialPhase || 'idle',
      turn: opts.initialTurn || 0,
      round: 0,
      maxRounds: opts.maxRounds || 1,
      busy: false,
      alive: true,
      data: opts.data || {}
    };

    function on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); return function () { off(ev, fn); }; }
    function off(ev, fn) { if (listeners[ev]) listeners[ev] = listeners[ev].filter(function (f) { return f !== fn; }); }
    function emit(ev, payload) { (listeners[ev] || []).slice().forEach(function (fn) { try { fn(payload, state); } catch (e) { /* guard */ } }); }

    function setPhase(p, payload) {
      if (!state.alive) return;
      state.phase = p;
      state.busy = (p !== 'idle' && p !== 'action');
      emit('phase', { phase: p, detail: payload });
    }

    function activeTeam() { return teams[state.turn] || teams[0]; }

    function setTurn(idx, silent) {
      if (!state.alive) return state.turn;
      state.turn = ((idx % nt) + nt) % nt;
      teamBar(teams, state.turn);
      if (!silent) A().play('turn_switch');
      emit('turn', { turn: state.turn, team: activeTeam() });
      return state.turn;
    }

    function nextTurn(silent) { return setTurn(state.turn + 1, silent); }

    function award(teamIdx, pts, originEl, label) {
      if (!state.alive) return;
      var cleanPts = Math.max(0, Math.round(Number(pts) || 0));
      if (originEl && (cleanPts > 0 || label)) {
        floatText(label || ('+' + cleanPts), originEl, cleanPts > 0 ? 'good' : 'soft');
      }
      if (cleanPts > 0) addScore(teamIdx, cleanPts);
      emit('score', { teamIdx: teamIdx, points: cleanPts, total: teams[teamIdx] ? teams[teamIdx].score : 0 });
    }

    function timeout(fn, ms) {
      var id = setTimeout(function () {
        var idx = timers.indexOf(id); if (idx >= 0) timers.splice(idx, 1);
        if (state.alive) fn();
      }, ms);
      timers.push(id);
      return function () { clearTimeout(id); };
    }

    function interval(fn, ms) {
      var id = setInterval(function () { if (state.alive) fn(); else clearInterval(id); }, ms);
      intervals.push(id);
      return function () { clearInterval(id); };
    }

    function wait(ms) {
      return new Promise(function (resolve) { timeout(function () { resolve(state.alive); }, ms); });
    }

    function raf(stepFn) {
      var active = true, id = 0, last = performance.now();
      function loop(now) {
        if (!active || !state.alive) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
        last = now;
        if (stepFn(dt, now) !== false && active && state.alive) id = requestAnimationFrame(loop);
      }
      id = requestAnimationFrame(loop);
      var stop = function () { active = false; cancelAnimationFrame(id); };
      rafs.push(stop);
      return stop;
    }

    function tween(durMs, easeName, onUpdate, onDone) {
      var easeFn = typeof easeName === 'function' ? easeName : (EASE[easeName] || EASE.outCubic);
      var t0 = performance.now(), dur = Math.max(16, durMs);
      return raf(function (dt, now) {
        var u = Math.min(1, (now - t0) / dur);
        onUpdate(easeFn(u), u);
        if (u >= 1) { if (onDone && state.alive) onDone(); return false; }
        return true;
      });
    }

    function listen(target, type, handler, options) {
      if (!target || !target.addEventListener) return function () {};
      target.addEventListener(type, handler, options);
      var remove = function () { try { target.removeEventListener(type, handler, options); } catch (e) { /* ignore */ } };
      cleanups.push(remove);
      return remove;
    }

    function askQuestion(item, askOpts) {
      if (!state.alive) return Promise.resolve({ ok: false, cancelled: true });
      setPhase('question');
      var qItem = item || (ctx && ctx.nextItem ? ctx.nextItem() : null);
      return GM.u.ask(qItem, activeTeam(), Object.assign({ timer: (ctx && ctx.cfg && +ctx.cfg.timer) || 0 }, askOpts || {})).then(function (res) {
        if (!state.alive) return { ok: false, cancelled: true };
        return res;
      });
    }

    function advanceRound() {
      if (!state.alive) return false;
      state.round++;
      emit('round', { round: state.round, maxRounds: state.maxRounds });
      if (state.round >= state.maxRounds) { finish(); return false; }
      return true;
    }

    function destroy() {
      if (!state.alive) return;
      state.alive = false;
      state.phase = 'ended';
      timers.forEach(clearTimeout); timers.length = 0;
      intervals.forEach(clearInterval); intervals.length = 0;
      rafs.forEach(function (stop) { try { stop(); } catch (e) { /* ignore */ } }); rafs.length = 0;
      cleanups.forEach(function (fn) { try { fn(); } catch (e) { /* ignore */ } }); cleanups.length = 0;
      listeners = {};
    }

    function finish() {
      if (!state.alive) return;
      emit('end', state);
      destroy();
      if (ctx && typeof ctx.end === 'function') ctx.end();
    }

    if (ctx && typeof ctx.onEnd === 'function') ctx.onEnd(destroy);

    return {
      ctx: ctx, state: state, teams: teams, teamCount: nt, ease: EASE,
      on: on, off: off, emit: emit, setPhase: setPhase,
      activeTeam: activeTeam, setTurn: setTurn, nextTurn: nextTurn,
      award: award, timeout: timeout, interval: interval, wait: wait,
      raf: raf, tween: tween, listen: listen, ask: askQuestion,
      advanceRound: advanceRound, finish: finish, destroy: destroy
    };
  }

  GM.engine = { createSession: createSession, ease: EASE };
  GM.u = { fx: fx, hasArt: hasArt, monFull: monFull, advanceTeamPupil: advanceTeamPupil, h: h, btn: btn, shuffle: shuffle, rand: rand, sleep: sleep, art: art, confetti: confetti, floatText: floatText, wobble: wobble, bump: bump, monFace: monFace, teamBar: teamBar, setScore: setScore, addScore: addScore, ask: ask, chooseTeam: chooseTeam, podium: podium, pic: pic };
})(window);
