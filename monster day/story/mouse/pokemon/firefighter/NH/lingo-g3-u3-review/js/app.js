/* Lingo review lesson: a journey map with five short stations. Each station is led by one monster who talks (recorded voice),
   reacts (cheers on a right answer, wobbles and encourages on a wrong one) and celebrates. No reading is needed to play:
   every instruction is spoken; the speech bubble shows the words for the teacher and for readers (CC button hides it). */
(function () {
  'use strict';
  var D = window.LINGO, A = window.LingoAudio;
  var ART = '../unit3-g4-lessons/art/', MON = '../assets/monsters/art/';
  var $ = function (id) { return document.getElementById(id); };
  var castArt = {};          // names drawn by Gemini for the new cast (cast/manifest.json), e.g. "nova_idle"
  var state = { stars: 0, done: {}, host: 'nova', busy: false, token: 0 };
  var FAST = /[?&]fast/.test(location.search);   // test mode: no waiting for lines that have no recording

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'class') e.className = attrs[k]; else if (k === 'text') e.textContent = attrs[k]; else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function img(src, cls) { return el('img', { src: src, alt: '', class: cls || '', draggable: 'false' }); }
  function art(name) { return ART + name + '.webp'; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------------- monster pictures ---------------- */
  function monPic(who, pose) {
    var c = D.cast[who];
    if (castArt[who + '_' + pose]) return { src: 'cast/' + who + '_' + pose + '.webp', tint: '' };
    if (pose === 'talk' || pose === 'blink') return null;
    if (castArt[who + '_idle']) return { src: 'cast/' + who + '_idle.webp', tint: '' };   // the new cast cheers and wobbles with movement (no extra picture needed)                       // the old pictures have no talking / blinking frames
    var map = { idle: '_growing', cheer: '_growing_cheer', oops: '_growing_oops', think: '_growing_think' };
    return { src: MON + c.species + (map[pose] || '_growing') + '.webp', tint: c.tint || '' };
  }

  var host = { box: null, frames: {}, blinkT: 0 };
  function buildHost() {
    host.box = el('div', { class: 'host left', id: 'host' }, [el('div', { class: 'pedestal' }), el('div', { class: 'body' }, [el('div', { class: 'talker', id: 'talker' })])]);
    $('stage').appendChild(host.box);
    $('stage').appendChild(el('div', { class: 'bubble', id: 'bubble' }, [el('span', { class: 'who', id: 'bubble-who' }), el('span', { class: 'txt', id: 'bubble-txt' })]));
  }
  function setHost(who) {
    state.host = who; var c = D.cast[who], t = $('talker');
    document.documentElement.style.setProperty('--host', c.color); document.documentElement.style.setProperty('--host-dark', c.dark);
    t.innerHTML = ''; host.frames = {};
    ['idle', 'talk', 'blink', 'cheer', 'oops'].forEach(function (p) {
      var m = monPic(who, p); if (!m) return;
      var i = img(m.src, 'frame' + (p === 'idle' ? ' on' : '')); if (m.tint) i.style.filter = m.tint + ' drop-shadow(0 10px 14px rgba(0,0,0,.35))';
      host.frames[p] = i; t.appendChild(i);
    });
    clearInterval(host.blinkT);
    if (host.frames.blink) host.blinkT = setInterval(function () { if (show.pose === 'idle' && !show.talking) { frame('blink'); setTimeout(function () { if (show.pose === 'idle' && !show.talking) frame('idle'); }, 140); } }, 3200 + Math.random() * 1800);
  }
  var show = { pose: 'idle', talking: false };
  function frame(p) { Object.keys(host.frames).forEach(function (k) { host.frames[k].classList.toggle('on', k === p); }); }
  function pose(p, ms) {
    show.pose = p; var f = host.frames[p] ? p : 'idle'; frame(f);
    host.box.classList.remove('cheer', 'oops'); void host.box.offsetWidth;
    if (p === 'cheer' || p === 'oops') host.box.classList.add(p);
    if (ms) setTimeout(function () { if (show.pose === p) { show.pose = 'idle'; frame('idle'); host.box.classList.remove('cheer', 'oops'); } }, ms);
  }

  /* the monster says a line: bubble + recorded voice; the mouth (talk frame) or the whole body moves with the voice */
  function speak(id, who) {
    var line = D.LINES[id]; if (!line) return Promise.resolve();
    who = who || line[0]; if (who !== state.host) setHost(who);
    $('bubble-who').textContent = D.cast[who].name;
    var txt = $('bubble-txt'); txt.textContent = line[1] + ' ';
    var re = el('button', { class: 'replay', type: 'button', 'aria-label': 'Say it again', text: '↻', onclick: function (e) { e.stopPropagation(); A.sfx.tap(); speak(id, who); } });
    txt.appendChild(re);
    $('bubble').classList.add('on');
    var talker = $('talker'), hasMouth = !!host.frames.talk;
    show.talking = true;
    var played = A.say(id, function (lv) {
      if (hasMouth) { if (show.pose === 'idle' || show.pose === 'talk') frame(lv > 0.12 ? 'talk' : 'idle'); }
      else talker.style.transform = 'scale(' + (1 + lv * 0.05) + ',' + (1 - lv * 0.03) + ') translateY(' + (-lv * 6) + 'px)';
    });
    return played.then(function (ok) {
      if (!ok) {   // no recording yet: the mouth moves while the words are shown, so the monster still "talks"
        var ms = FAST ? 30 : Math.max(1200, line[1].length * 55), t0 = Date.now(), open = false;
        return new Promise(function (res) {
          (function flap() {
            if (Date.now() - t0 >= ms) { show.talking = false; talker.style.transform = ''; if (show.pose === 'idle') frame('idle'); return res(); }
            open = !open && Math.random() > 0.15;
            if (hasMouth) { if (show.pose === 'idle' || show.pose === 'talk') frame(open ? 'talk' : 'idle'); }
            else talker.style.transform = open ? 'scale(1.03,.98) translateY(-3px)' : '';
            setTimeout(flap, 110 + Math.random() * 90);
          })();
        });
      }
      show.talking = false; talker.style.transform = ''; if (show.pose === 'idle') frame('idle');
    });
  }
  function hideBubble() { $('bubble').classList.remove('on'); }

  /* ---------------- rewards ---------------- */
  function addStar(x, y) {
    state.stars++; $('stars').textContent = '⭐ ' + state.stars; A.sfx.star();
    if (x != null) for (var i = 0; i < 8; i++) {
      var b = el('div', { class: 'burst', text: pick(['⭐', '✨', '💫']) });
      var ang = i / 8 * Math.PI * 2; b.style.left = x + 'px'; b.style.top = y + 'px';
      b.style.setProperty('--dx', Math.cos(ang) * 120 + 'px'); b.style.setProperty('--dy', Math.sin(ang) * 120 + 'px');
      document.body.appendChild(b); setTimeout(b.remove.bind(b), 950);
    }
  }
  function confetti(n) {
    var cols = ['#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#a855f7', '#facc15'];
    for (var i = 0; i < (n || 70); i++) {
      var c = el('div', { class: 'confetti' }); c.style.left = Math.random() * 100 + 'vw'; c.style.background = pick(cols);
      c.style.animationDuration = (1.8 + Math.random() * 1.8) + 's'; c.style.animationDelay = Math.random() * .6 + 's';
      document.body.appendChild(c); setTimeout(c.remove.bind(c), 4200);
    }
  }
  function centerOf(node) { var r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function right(who, node) {
    A.sfx.correct(); pose('cheer', 1100); if (node) { var p = centerOf(node); addStar(p[0], p[1]); } else addStar();
    return speak(pick(D.praise[who]), who);
  }
  function wrong(who) { A.sfx.softFail(); pose('oops', 700); return speak(D.retry[who], who); }

  /* ---------------- screens ---------------- */
  function setBg(name) { var b = $('bg'); b.style.backgroundImage = name ? 'url(' + art(name) + ')' : ''; }
  function clearPlay() { document.body.classList.remove('in-finale'); var p = $('play'); if (p) p.remove(); var m = $('map'); if (m) m.remove(); var f = $('finale'); if (f) f.remove(); }
  function newPlay() { clearPlay(); document.body.classList.remove('on-map'); var p = el('div', { class: 'play', id: 'play' }); $('stage').appendChild(p); return p; }
  function progress(n, k) { return el('div', { class: 'progress' }, Array.from({ length: n }, function (_, i) { return el('i', { class: i < k ? 'done' : (i === k ? 'now' : '') }); })); }
  function title(t) { $('title').textContent = t; }

  var STOPS = [[38, 27], [54, 66], [67, 27], [80, 64], [91, 30]];     // map positions (% of the stage)
  function showMap(first) {
    state.token++; A.stop(); clearPlay(); title('It Keeps Changing · Review'); setBg('bg_arctic_ice');
    var map = el('div', { class: 'map', id: 'map' });
    var d = 'M ' + STOPS.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ');
    map.innerHTML = '<svg class="path" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + d + '" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.1" stroke-dasharray="2 2" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:8px"/></svg>';
    var nextIdx = D.stations.findIndex(function (s) { return !state.done[s.id]; });
    D.stations.forEach(function (s, i) {
      var c = D.cast[s.who], m = monPic(s.who, 'idle');
      var mon = img(m.src, 'mon'); if (m.tint) mon.style.filter = m.tint;
      var b = el('button', { class: 'stop' + (state.done[s.id] ? ' done' : '') + (i === nextIdx ? ' next' : ''), type: 'button', 'aria-label': s.title,
        onclick: function () { A.sfx.whoosh(); run(s); } }, [
        el('div', { class: 'disc' }, [el('div', { class: 'badge', text: '⭐' }), img(art(s.icon), 'pic'), mon]),
        el('span', { class: 'lab', text: s.title })
      ]);
      b.style.left = STOPS[i][0] + '%'; b.style.top = STOPS[i][1] + '%'; b.style.setProperty('--c', c.color);
      map.appendChild(b);
    });
    $('stage').appendChild(map);
    setHost('nova'); pose('idle');
    if (nextIdx === -1) return finale();
    document.body.classList.add('on-map');
    speak(first ? 'welcome' : 'map_next', 'nova').then(function () { if ($('map')) hideBubble(); });
  }

  function run(s) {
    var tok = ++state.token; A.stop(); setBg(s.bg); title(s.title); setHost(s.who); pose('idle');
    var alive = function () { return tok === state.token; };
    var fn = { words: playWords, story: playStory, ng: playNg, cars: playCars, change: playChange }[s.id];
    fn(s, alive).then(function (finished) {
      if (!finished || !alive()) return;
      state.done[s.id] = true; A.sfx.fanfare(); confetti(); pose('cheer', 1600);
      return wait(FAST ? 100 : 1800).then(function () { if (alive()) showMap(false); });
    });
  }

  /* 1 · Bubbles: listen and pop the right bubble */
  function playWords(s, alive) {
    var rounds = shuffle(D.words), k = 0, p = newPlay();
    var pool = D.words.map(function (w) { return w.a; }).concat(D.wordDistractors);
    function round() {
      if (!alive()) return Promise.resolve(false);
      if (k >= rounds.length) return Promise.resolve(true);
      var r = rounds[k], twins = { w_thin: 'w_crack', w_crack: 'w_thin', w_ice: 'w_melting', w_melting: 'w_ice' };   // pictures that look too alike never appear together
      var opts = shuffle([r.a].concat(shuffle(pool.filter(function (a) { return a !== r.a && a !== twins[r.a]; })).slice(0, 2)));
      p.innerHTML = ''; p.appendChild(progress(rounds.length, k));
      var row = el('div', { class: 'choices' }); p.appendChild(row);
      return new Promise(function (resolve) {
        var locked = false;
        opts.forEach(function (a) {
          var b = el('button', { class: 'bub', type: 'button', 'aria-label': 'bubble', 'data-ok': a === r.a ? '1' : '0', onclick: function () {
            if (locked || !alive()) return;
            if (a === r.a) {
              locked = true; A.sfx.pop(); b.classList.add('pop');
              right('bubbles', b).then(function () { k++; resolve(round()); });
            } else { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); wrong('bubbles').then(function () { if (!locked && alive()) speak(r.line); }); }
          } }, [img(art(a))]);
          row.appendChild(b);
        });
        speak(r.line);
      });
    }
    return speak('b_intro').then(round);
  }

  /* 2 · Nova: put the poem in order */
  function playStory(s, alive) {
    var p = newPlay(), k = 0, strip = el('div', { class: 'strip' }), row = el('div', { class: 'choices' });
    var slots = D.story.map(function (_, i) { var sl = el('div', { class: 'slot', text: String(i + 1) }); strip.appendChild(sl); return sl; });
    p.appendChild(strip); p.appendChild(row);
    return new Promise(function (resolve) {
      var busy = true;
      shuffle(D.story.map(function (st, i) { return { st: st, i: i }; })).forEach(function (o) {
        var card = el('button', { class: 'card-pic', type: 'button', 'aria-label': 'story picture', 'data-i': o.i, onclick: function () {
          if (busy || !alive()) return;
          if (o.i === k) {
            busy = true; card.classList.add('right'); A.sfx.correct(); var c = centerOf(card); addStar(c[0], c[1]); pose('cheer', 900);
            slots[k].textContent = ''; slots[k].appendChild(img(art(o.st.a))); slots[k].classList.add('filled');
            setTimeout(function () { card.classList.add('gone'); }, 350);
            k++;
            speak(o.st.line).then(function () {
              if (!alive()) return resolve(false);
              if (k >= D.story.length) return speak('n_outro').then(function () { resolve(true); });
              busy = false; speak('n_next');
            });
          } else { card.classList.remove('wrong'); void card.offsetWidth; card.classList.add('wrong'); wrong('nova'); }
        } }, [el('div', { class: 'pic' }, [img(art(o.st.a))])]);
        card.classList.add('small'); card.style.aspectRatio = '1'; card.querySelector('.pic').style.height = '100%';
        row.appendChild(card);
      });
      speak('n_intro').then(function () { busy = false; });
    });
  }

  /* 3 · Rosie: which word ends with ng? */
  function playNg(s, alive) {
    var rounds = shuffle(D.ng), k = 0, p = newPlay();
    function face(o) { return el('div', { class: 'pic' }, [o.a ? img(art(o.a)) : el('span', { class: 'emo', text: o.e })]); }
    function round() {
      if (!alive()) return Promise.resolve(false);
      if (k >= rounds.length) return speak('r_outro').then(function () { return true; });
      var r = rounds[k], opts = shuffle([['yes', r.yes], ['no', r.no]]);
      p.innerHTML = ''; p.appendChild(progress(rounds.length, k));
      var row = el('div', { class: 'choices' }); p.appendChild(row);
      return new Promise(function (resolve) {
        var locked = false;
        opts.forEach(function (o) {
          var card = el('button', { class: 'card-pic', type: 'button', 'aria-label': o[1].w, 'data-ok': o[0] === 'yes' ? '1' : '0', onclick: function () {
            if (locked || !alive()) return;
            if (o[0] === 'yes') { locked = true; card.classList.add('right'); right('rosie', card).then(function () { k++; resolve(round()); }); }
            else { card.classList.remove('wrong'); void card.offsetWidth; card.classList.add('wrong'); wrong('rosie').then(function () { if (!locked && alive()) speak(r.line); }); }
          } }, [face(o[1]), el('div', { class: 'cap', text: o[1].w })]);
          card.style.setProperty('--cd', D.cast.rosie.dark);
          row.appendChild(card);
        });
        speak(r.line);
      });
    }
    return speak('r_intro').then(round);
  }

  /* 4 · Blaze: listen and find the car */
  function playCars(s, alive) {
    var rounds = shuffle(D.cars), k = 0, p = newPlay();
    function round() {
      if (!alive()) return Promise.resolve(false);
      if (k >= rounds.length) return speak('z_outro').then(function () { return true; });
      var r = rounds[k], opts = shuffle([r].concat(shuffle(D.cars.filter(function (c) { return c !== r; })).slice(0, 2)));
      p.innerHTML = ''; p.appendChild(progress(rounds.length, k));
      var row = el('div', { class: 'choices' }); p.appendChild(row);
      return new Promise(function (resolve) {
        var locked = false;
        opts.forEach(function (o) {
          var card = el('button', { class: 'card-pic', type: 'button', 'aria-label': o.w, 'data-ok': o === r ? '1' : '0', onclick: function () {
            if (locked || !alive()) return;
            if (o === r) { locked = true; card.classList.add('right'); right('blaze', card).then(function () { k++; resolve(round()); }); }
            else { card.classList.remove('wrong'); void card.offsetWidth; card.classList.add('wrong'); wrong('blaze').then(function () { if (!locked && alive()) speak(r.line); }); }
          } }, [el('div', { class: 'pic' }, [img(art(o.a))]), el('div', { class: 'cap', text: o.w })]);
          card.style.setProperty('--cd', D.cast.blaze.dark);
          row.appendChild(card);
        });
        speak(r.line);
      });
    }
    return speak('z_intro').then(round);
  }

  /* 5 · Sprout: choose a good change, hear the sentence, say it together */
  function playChange(s, alive) {
    var p = newPlay(), said = {};
    function menu() {
      if (!alive()) return Promise.resolve(false);
      p.innerHTML = ''; var count = Object.keys(said).length;
      p.appendChild(progress(D.changes.length, count));
      var row = el('div', { class: 'choices' }); p.appendChild(row);
      return new Promise(function (resolve) {
        var locked = false;
        D.changes.forEach(function (c) {
          var card = el('button', { class: 'card-pic' + (said[c.line] ? ' gone' : ''), type: 'button', 'aria-label': c.t, onclick: function () {
            if (locked || !alive()) return; locked = true; A.sfx.tap(); card.classList.add('right');
            sayIt(c).then(function () { said[c.line] = true; resolve(menu()); });
          } }, [el('div', { class: 'pic' }, [img(art(c.a))])]);
          card.style.aspectRatio = '1'; card.querySelector('.pic').style.height = '100%'; card.style.setProperty('--cd', D.cast.sprout.dark);
          row.appendChild(card);
        });
        if (count >= 2) {
          p.appendChild(el('div', { class: 'say-row' }, [el('button', { class: 'btn big', type: 'button', style: '--c:#16a34a;--cd:#14532d', text: '🌍 We can make good changes!', onclick: function () {
            if (locked) return; locked = true; speak('s_outro').then(function () { resolve(true); });
          } })]));
        }
      });
    }
    function sayIt(c) {
      return speak(c.line).then(function () { return speak('s_you'); }).then(function () {
        if (!alive()) return;
        var row = el('div', { class: 'say-row' });
        return new Promise(function (resolve) {
          row.appendChild(el('button', { class: 'btn', type: 'button', style: '--c:#0284c7;--cd:#075985', text: '🔁 Again', onclick: function () { A.sfx.tap(); speak(c.line); } }));
          row.appendChild(el('button', { class: 'btn big', type: 'button', style: '--c:#f59e0b;--cd:#b45309', text: '⭐ We said it!', onclick: function () {
            row.remove(); right('sprout', null).then(resolve);
          } }));
          p.appendChild(row);
        });
      });
    }
    return speak('s_intro').then(menu);
  }

  function finale() {
    clearPlay(); setBg('bg_clean_city'); title('Hooray!');
    var f = el('div', { class: 'finale', id: 'finale' }, [el('div', {}, [
      el('div', { class: 'row' }, ['bubbles', 'blaze', 'nova', 'sprout', 'rosie'].map(function (w) { var m = monPic(w, 'cheer'); var i = img(m.src); if (m.tint) i.style.filter = m.tint; return i; })),
      el('h2', { text: '⭐ ' + state.stars + ' stars!' }),
      el('div', { class: 'say-row' }, [el('button', { class: 'btn big', type: 'button', style: '--c:#a855f7;--cd:#6b21a8', text: '🔁 Play again', onclick: function () { state.done = {}; state.stars = 0; $('stars').textContent = '⭐ 0'; showMap(true); } })])
    ])]);
    $('stage').appendChild(f); host.box.style.visibility = 'hidden'; document.body.classList.add('in-finale');
    A.sfx.fanfare(); confetti(120);
    speak('finale1', 'nova').then(function () { return speak('finale2', 'rosie'); }).then(function () { host.box.style.visibility = ''; });
  }

  /* ---------------- start ---------------- */
  function boot() {
    buildHost(); setHost('nova');
    var row = $('cast-row');
    ['bubbles', 'blaze', 'nova', 'sprout', 'rosie'].forEach(function (w) { var m = monPic(w, 'idle'); var i = img(m.src); if (m.tint) i.style.filter = m.tint; row.appendChild(i); });
    $('go').addEventListener('click', function () {
      A.init(); A.sfx.fanfare(); $('start').remove(); showMap(true);
    });
    $('btn-map').addEventListener('click', function () { A.init(); A.sfx.tap(); host.box.style.visibility = ''; showMap(false); });
    $('btn-sound').addEventListener('click', function () { A.setMuted(!A.isMuted()); this.textContent = A.isMuted() ? '🔇' : '🔊'; });
    $('btn-cc').addEventListener('click', function () { document.body.classList.toggle('no-subs'); this.style.opacity = document.body.classList.contains('no-subs') ? '.55' : '1'; });
    $('btn-full').addEventListener('click', function () { var d = document.documentElement; if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen().catch(function () {}); else if (document.exitFullscreen) document.exitFullscreen().catch(function () {}); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('start')) showMap(false); });
  }
  Promise.all([
    A.loadManifest(),
    fetch('cast/manifest.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (l) { (l || []).forEach(function (n) { castArt[n] = true; }); }, function () {})
  ]).then(boot, boot);
})();
