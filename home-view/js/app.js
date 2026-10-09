/* Home view: simple homework page for pupils. One page per grade (?g=3 or ?g=4).
   Steps: listen, tap games, say it, done. Stars are saved only on this device (localStorage). No login, nothing is sent. */
(function () {
  'use strict';
  var HV = window.HV, A = window.ForestAudio;
  var q = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { var kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var G = q.g === '4' ? 4 : 3, C = HV[G], KEY = 'eaa_home_' + HV.week + '_g' + G;
  var root = document.getElementById('app'), save = { name: '', done: {} };
  function $(t, a, k) {
    var e = document.createElement(t), x; a = a || {};
    for (x in a) { if (x === 'class') e.className = a[x]; else if (x === 'text') e.textContent = a[x]; else if (x === 'html') e.innerHTML = a[x]; else if (x === 'style') e.style.cssText = a[x]; else if (x.indexOf('on') === 0) e.addEventListener(x.slice(2), a[x]); else e.setAttribute(x, a[x]); }
    (k || []).forEach(function (n) { if (n != null) e.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); });
    return e;
  }
  function shuffle(a) { var b = a.slice(), i, j, t; for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s === 'object') { save.name = String(s.name || '').slice(0, 20); save.done = s.done && typeof s.done === 'object' ? s.done : {}; } } catch (e) { /* storage may be blocked */ } }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* storage may be blocked */ } }
  function sfx(n) { try { A.play(n); } catch (e) { /* audio optional */ } }
  function say(t) { try { A.speak(t); } catch (e) { /* audio optional */ } }
  function btn(text, cls, fn) { return $('button', { type: 'button', class: 'hbtn ' + (cls || ''), text: text, onclick: fn }); }
  function img(src, cls, alt) { var i = $('img', { src: src, alt: alt || '', class: cls || '', draggable: 'false' }); return i; }
  function totalStars() { var n = 0, k; for (k in save.done) n += Number(save.done[k]) || 0; return n; }
  function stepsBeforeDone() { return C.steps.filter(function (s) { return s.kind !== 'done'; }); }
  function allDone() { return stepsBeforeDone().every(function (s) { return save.done[s.id]; }); }
  function unlocked(i) { return i === 0 || (i < C.steps.length && save.done[C.steps[i - 1].id] && (C.steps[i].kind !== 'done' || allDone())); }

  function shell(title, back) {
    root.innerHTML = '';
    root.style.setProperty('--accent', C.color);
    var top = $('header', { class: 'top' }, [
      back ? btn('◀ Back', 'small ghost', back) : $('span'),
      $('div', { class: 'ttl' }, [$('b', { text: title }), $('small', { text: C.name })]),
      $('div', { class: 'stars' }, [img('../platform-art/r_star.webp', 'sticon'), $('b', { text: String(totalStars()) })])
    ]);
    var main = $('main', { class: 'card' });
    root.appendChild(top); root.appendChild(main);
    return main;
  }

  /* ---------- welcome ---------- */
  function welcome() {
    root.innerHTML = ''; root.style.setProperty('--accent', C.color);
    var input = $('input', { type: 'text', class: 'name', maxlength: '20', placeholder: 'My first name', value: save.name, autocomplete: 'off' });
    var go = btn('▶ Start', 'big', function () {
      var n = input.value.replace(/[<>]/g, '').trim();
      if (!n) { input.classList.add('wob'); setTimeout(function () { input.classList.remove('wob'); }, 500); say('Please write your first name.'); return; }
      save.name = n.slice(0, 20); persist(); sfx('win'); path();
    });
    root.appendChild($('main', { class: 'card welcome' }, [
      img(C.guide, 'guide'), $('h1', { text: C.name }), $('p', { class: 'intro', text: C.intro }),
      btn('🔊 Hear it', 'small ghost', function () { say(C.intro); }), input, go,
      $('p', { class: 'tiny', text: 'Your stars stay on this device. Only your first name, please.' })
    ]));
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go.click(); });
  }

  /* ---------- week path ---------- */
  function path() {
    var main = shell('Hello, ' + save.name + '!', function () { welcome(); });
    var row = $('div', { class: 'path' });
    C.steps.forEach(function (s, i) {
      var open = unlocked(i), done = !!save.done[s.id];
      var b = $('button', { type: 'button', class: 'stop' + (done ? ' done' : '') + (open ? '' : ' locked'), onclick: function () { if (!open) { sfx('tap'); say('Do the step before first.'); return; } sfx('tap'); run(i); } }, [
        $('span', { class: 'stn', text: String(i + 1) }), img(s.icon, 'sic'), $('b', { text: s.t }),
        done ? $('span', { class: 'chk' }, [img('../platform-art/h_tick_stamp.webp', 'chkimg')]) : $('span', { class: 'chk' })
      ]);
      row.appendChild(b);
    });
    main.appendChild($('p', { class: 'lead', text: 'Your week path: do the steps one by one.' })); main.appendChild(row);
    var next = -1; C.steps.forEach(function (s, i) { if (next < 0 && !save.done[s.id] && unlocked(i)) next = i; });
    if (next >= 0) { main.appendChild(btn('▶ ' + C.steps[next].t, 'big', function () { run(next); })); }
    else main.appendChild($('p', { class: 'lead', text: '⭐ All done! Show your teacher.' }));
    if (!path.said) { path.said = 1; say('Hello, ' + save.name + '!'); }
  }

  function finish(step, stars) {
    var prev = Number(save.done[step.id]) || 0; save.done[step.id] = Math.max(prev, stars); persist(); sfx('win');
  }
  function run(i) {
    var s = C.steps[i];
    if (s.kind === 'listen') return listen(i, s);
    if (s.kind === 'tap') return tap(i, s);
    if (s.kind === 'say') return sayIt(i, s);
    return done(i, s);
  }

  /* ---------- listen ---------- */
  function listen(i, s) {
    var main = shell(s.t, path), heard = {}, count = 0, prog = $('p', { class: 'lead', text: '👂 0 / ' + s.cards.length });
    main.appendChild($('p', { class: 'lead', text: s.say })); main.appendChild(prog);
    var grid = $('div', { class: 'lgrid' }), fin = btn('⭐ Finish', 'big', function () { finish(s, 1); path(); }); fin.style.display = 'none';
    s.cards.forEach(function (c, k) {
      var face = c.pic ? img(c.pic, 'lpic') : $('span', { class: 'lem', text: c.emoji || '' });
      var b = $('button', { type: 'button', class: 'lcard' }, [face, $('b', { text: c.w })]);
      b.addEventListener('click', function () {
        say(c.say); sfx('tap'); b.classList.add('heard');
        if (!heard[k]) { heard[k] = 1; count++; prog.textContent = '👂 ' + count + ' / ' + s.cards.length; if (count === s.cards.length) { fin.style.display = 'inline-flex'; sfx('correct'); } }
      });
      grid.appendChild(b);
    });
    main.appendChild(grid); main.appendChild(fin);
  }

  /* ---------- tap games ---------- */
  function tap(i, s) {
    var main = shell(s.t, path), n = 0, mistakes = 0, locked = false;
    var rounds = s.rounds;
    function round() {
      main.innerHTML = '';
      if (n >= rounds.length) { var stars = mistakes === 0 ? 3 : (mistakes <= 2 ? 2 : 1); finish(s, stars); end(stars); return; }
      var r = rounds[n]; locked = false;
      main.appendChild($('p', { class: 'lead', text: s.say }));
      main.appendChild($('div', { class: 'dots' }, rounds.map(function (x, k) { return $('i', { class: k < n ? 'on' : (k === n ? 'cur' : '') }); })));
      main.appendChild(btn('🔊 Listen again', 'big ear', function () { say(r.q); }));
      var grid = $('div', { class: 'ogrid c' + r.o.length });
      r.o.forEach(function (op, k) {
        var face = op.pic ? img(op.pic, 'opic') : (op.num ? $('span', { class: 'onum', text: op.n }) : $('span', { class: 'oem', text: op.e }));
        var b = $('button', { type: 'button', class: 'opt' }, [face]);
        b.addEventListener('click', function () {
          if (locked) return;
          if (k === r.a) { locked = true; b.classList.add('right'); sfx('correct'); say(r.ok); setTimeout(function () { n++; round(); }, 1500); }
          else { mistakes++; b.classList.add('wrong'); sfx('tap'); say('Try again.'); setTimeout(function () { b.classList.remove('wrong'); }, 500); }
        });
        grid.appendChild(b);
      });
      main.appendChild(grid); setTimeout(function () { say(r.q); }, 300);
    }
    function end(stars) {
      main.innerHTML = '';
      main.appendChild($('p', { class: 'big', text: 'Well done!' }));
      main.appendChild($('div', { class: 'starrow' }, [1, 2, 3].map(function (k) { return img('../platform-art/r_star.webp', 'bigstar' + (k <= stars ? '' : ' off')); })));
      main.appendChild(btn('▶ Next', 'big', path)); confetti();
    }
    round();
  }

  /* ---------- say it ---------- */
  function sayIt(i, s) {
    var main = shell(s.t, path), got = 0;
    main.appendChild($('p', { class: 'lead', text: s.say }));
    var fin = btn('⭐ Finish', 'big', function () { finish(s, 2); path(); }); fin.style.display = 'none';
    s.lines.forEach(function (ln) {
      var tick = btn('✅ I said it!', 'small ok', null);
      var row = $('div', { class: 'sayrow' }, [btn('🔊', 'small', function () { say(ln); }), $('b', { class: 'sl', text: ln }), tick]);
      tick.addEventListener('click', function () { if (row.classList.contains('said')) return; row.classList.add('said'); sfx('coin'); got++; if (got === s.lines.length) { fin.style.display = 'inline-flex'; sfx('correct'); } });
      main.appendChild(row);
    });
    main.appendChild(fin);
  }

  /* ---------- done ---------- */
  function done(i, s) {
    finish(s, 1); var main = shell(s.t, path);
    main.appendChild($('div', { class: 'stamp' }, [img('../platform-art/h_tick_stamp.webp', 'stampimg')]));
    main.appendChild($('p', { class: 'big', text: s.say }));
    main.appendChild($('p', { class: 'lead', text: save.name + ', you have ' + totalStars() + ' stars this week!' }));
    main.appendChild($('p', { class: 'lead', text: 'Show this page to your teacher. See you in class!' }));
    main.appendChild(btn('🏠 Back to my path', 'big', path)); confetti(); say('Great work, ' + save.name + '!');
  }

  function confetti() {
    var w = $('div', { class: 'confetti' }), em = ['⭐', '🎉', '✨', '🌟'], k;
    for (k = 0; k < 22; k++) w.appendChild($('i', { text: em[k % em.length], style: 'left:' + Math.random() * 96 + '%;animation-delay:' + Math.random() * 0.5 + 's;font-size:' + (2 + Math.random() * 2.4) + 'rem' }));
    document.body.appendChild(w); setTimeout(function () { w.remove(); }, 2600);
  }

  document.documentElement.style.background = 'linear-gradient(rgba(6,9,17,.5), rgba(6,9,17,.78)), url(' + C.bg + ') center / cover fixed no-repeat';
  document.title = C.name + ' • Home • English Adventure Academy';
  load(); if (save.name) path(); else welcome();
})();
