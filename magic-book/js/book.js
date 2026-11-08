/* The Magic Book — storybook reader with curling pages.
   Reads the Unit 5 data (MAGIC_BOOK_DATA) and page images from BASE.
   Works out-of-the-box from /magic-book/ anywhere (no manual upload needed); can also override with ?base=<url>. */
(function () {
  'use strict';

  var qs = new URLSearchParams(location.search);
  var defaultBase = location.pathname.indexOf('/platform-work/') !== -1 ? '../../magic-book/' : './';
  var BASE = new URL(qs.get('base') || defaultBase, location.href).href;
  var RATIO = 1602 / 2046;             // page width / height
  var N = 14;                          // strips in a turning page (more = smoother curl)
  var CURL = 55;                       // max curl in degrees
  var BOOKS = [
    { key: 'g3', color: '#1f4fa8', cover: 'g3_cover.png', label: 'Grade 3' },
    { key: 'g4', color: '#b4402c', cover: 'g4_cover.png', label: 'Grade 4' }
  ];
  var PALETTE = ['#e53935', '#1e63d6', '#18a346', '#222222', '#ffd600', '#ff4fa3'];
  var STAMPS = ['⭐', '✅', '❤️', '😀', '👍', '❓'];

  var $ = function (id) { return document.getElementById(id); };
  var S = {
    data: null, g: null, book: null, cls: null, spreads: [], si: 0, single: false,
    busy: false, tool: null, color: PALETTE[0], stamp: STAMPS[0], showAns: false,
    zoom: 1, panX: 0, panY: 0, pw: 0, ph: 0, ink: {}, inkHist: [], solved: {}
  };

  function url(p) {
    if (!p) return '';
    var clean = String(p);
    if (BASE.indexOf('unit5-work') === -1) {
      clean = clean.replace(/^(\.\.\/)+/, '');
    }
    return new URL(clean, BASE).href;
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------------- sound (made in the browser, no files needed) ---------------- */
  var AC = null;
  function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function swish() {
    var a = ac(); if (!a) return;
    var len = a.sampleRate * .5, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = a.createBufferSource(); src.buffer = buf;
    var f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = .9;
    f.frequency.setValueAtTime(700, a.currentTime); f.frequency.exponentialRampToValueAtTime(3200, a.currentTime + .35);
    var g = a.createGain(); g.gain.setValueAtTime(0, a.currentTime); g.gain.linearRampToValueAtTime(.32, a.currentTime + .06); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + .5);
    src.connect(f); f.connect(g); g.connect(a.destination); src.start();
  }
  function chime(ok) {
    var a = ac(); if (!a) return;
    var notes = ok ? [523, 659, 784, 1047] : [330, 262];
    notes.forEach(function (fr, i) {
      var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * .09;
      o.type = ok ? 'triangle' : 'sine'; o.frequency.value = fr;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .35);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + .4);
    });
  }

  /* ---------------- speech ---------------- */
  var voice = null;
  function pickVoice() {
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
    var pref = ['Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Jenny', 'Google UK English Female', 'Microsoft Zira'];
    for (var i = 0; i < pref.length; i++) { var v = vs.find(function (x) { return x.name.indexOf(pref[i]) === 0; }); if (v) return v; }
    return vs[0] || null;
  }
  if ('speechSynthesis' in window) { voice = pickVoice(); speechSynthesis.onvoiceschanged = function () { voice = pickVoice(); }; }
  function say(text, opts) {
    if (!('speechSynthesis' in window)) return null;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice; u.lang = voice ? voice.lang : 'en-US'; u.rate = (opts && opts.rate) || .88; u.pitch = 1.05;
    if (opts && opts.boundary) u.onboundary = opts.boundary;
    if (opts && opts.end) { u.onend = opts.end; u.onerror = opts.end; }
    speechSynthesis.speak(u); return u;
  }

  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 1600);
  }

  /* ---------------- dust ---------------- */
  (function dust() {
    var c = $('dust'), x = c.getContext('2d'), P = [];
    function size() { c.width = innerWidth; c.height = innerHeight; }
    size(); addEventListener('resize', size);
    for (var i = 0; i < 70; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 2.2 + .4, s: Math.random() * .00025 + .00008, p: Math.random() * 6 });
    (function tick(t) {
      x.clearRect(0, 0, c.width, c.height);
      P.forEach(function (d) {
        d.y -= d.s; d.x += Math.sin(t / 3000 + d.p) * .00018; if (d.y < -.02) { d.y = 1.02; d.x = Math.random(); }
        var a = .25 + .35 * Math.sin(t / 900 + d.p);
        x.beginPath(); x.arc(d.x * c.width, d.y * c.height, d.r, 0, 7); x.fillStyle = 'rgba(255,220,150,' + a.toFixed(2) + ')'; x.fill();
      });
      requestAnimationFrame(tick);
    })(0);
  })();

  /* ---------------- data ---------------- */
  function initFromData() {
    S.data = window.MAGIC_BOOK_DATA;
    if (!S.data) return fail('The book file loaded but has no MAGIC_BOOK_DATA.');
    buildShelf();
    var wantBook = qs.get('book');
    var wantGrade = qs.get('grade');
    var key = wantBook && S.data[wantBook] ? wantBook : (wantGrade && S.data['g' + wantGrade] ? 'g' + wantGrade : null);
    if (key) openBook(key, true);
  }

  function loadData() {
    if (window.MAGIC_BOOK_DATA && !qs.get('base')) {
      initFromData();
      return;
    }
    var s = document.createElement('script');
    s.src = BASE + 'js/book-data.js?t=' + Date.now();
    s.onload = initFromData;
    s.onerror = function () {
      if (window.MAGIC_BOOK_DATA) { initFromData(); return; }
      fail('I cannot find the book pages.<br>Make sure the book files are in <b>magic-book/</b>.');
    };
    document.head.appendChild(s);
  }
  function fail(msg) { var e = el('div', 'err', msg); $('room').appendChild(e); }

  function coverHTML(b, d) {
    var t = (d.title || '').replace(/^Unit\s*\d+:\s*/i, '');
    var sp = '';
    for (var i = 0; i < 7; i++) sp += '<i class="sparkle" style="left:' + (12 + Math.random() * 78).toFixed(0) + '%;top:' + (8 + Math.random() * 84).toFixed(0) + '%;animation-delay:-' + (Math.random() * 2.4).toFixed(2) + 's"></i>';
    return '<div class="cover" style="--cv:' + b.color + '">' +
      '<div class="ct">' + esc(t) + '</div>' +
      '<div class="art" style="background-image:url(\'' + url(b.cover) + '\')"></div>' +
      '<div class="cu">Unit 5</div><div class="cs">' + esc(d.bookTitle || '') + '</div>' + sp + '</div>';
  }

  function buildShelf() {
    var box = $('shelf-books'); box.innerHTML = '';
    BOOKS.forEach(function (b) {
      var d = S.data[b.key]; if (!d) return;
      var btn = el('button', 'shelf-book', coverHTML(b, d) + '<div class="label">' + b.label + '</div>');
      btn.onclick = function () { ac(); openBook(b.key); };
      box.appendChild(btn);
    });
  }

  /* ---------------- open / close ---------------- */
  function openBook(key, instant) {
    S.g = key; S.book = BOOKS.find(function (b) { return b.key === key; });
    var d = S.data[key];
    var nums = Object.keys(d.pages).map(Number).sort(function (a, b) { return a - b; });
    S.pageList = nums.map(function (n) { return d.pages[n]; });
    S.cls = store('mb-class-' + key) || (d.classes && d.classes[0]) || 'A';
    loadClassData();
    $('tb-title').textContent = d.title || '';
    var cb = $('tb-classes'); cb.innerHTML = '';
    (d.classes || []).forEach(function (c) {
      var x = el('button', c === S.cls ? 'on' : '', esc(c));
      x.onclick = function () { S.cls = c; store('mb-class-' + key, c); [].forEach.call(cb.children, function (y) { y.classList.toggle('on', y === x); }); loadClassData(); render(); };
      cb.appendChild(x);
    });
    $('book').style.setProperty('--cv', S.book.color);
    $('shelf-view').hidden = true; $('book-view').hidden = false;
    S.si = 0; layout();
    var saved = store('mb-pos-' + key);
    if (instant || saved) { S.si = clamp(saved || 0, 0, S.spreads.length - 1); render(); return; }
    openCover();
  }

  function goShelf() {
    if (S.scene && window.MagicScene) MagicScene.close(true);
    stopRead(); closeModal(); setTool(null); resetZoom();
    $('book-view').hidden = true; $('shelf-view').hidden = false;
  }

  function openCover() {
    // closed book: cover lying on the right half, then it swings open
    S.busy = true; render();
    var book = $('book'), cl = $('cover-leaf');
    book.classList.add('closed');
    var sp = S.spreads[0], back = sp[0] ? url(sp[0].img) : '';
    cl.innerHTML = '';
    var leaf = el('div', 'strip'); leaf.style.width = '100%'; leaf.style.left = '0';
    var f = el('div', 'face front'); f.innerHTML = coverHTML(S.book, S.data[S.g]); f.style.background = 'none';
    var bk = el('div', 'face back'); if (back) bk.style.backgroundImage = 'url("' + back + '")'; bk.style.backgroundSize = '100% 100%';
    leaf.appendChild(f); leaf.appendChild(bk); cl.appendChild(leaf);
    cl.style.display = 'block';
    if (S.single) { cl.style.left = '0'; cl.style.width = '100%'; } else { cl.style.left = '50%'; cl.style.width = '50%'; }
    book.animate([{ transform: 'translateY(40px) scale(.55) rotateX(18deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.2,.9,.3,1.1)' });
    setTimeout(function () {
      swish();
      var t0 = performance.now(), dur = 1300;
      (function step(t) {
        var p = clamp((t - t0) / dur, 0, 1), e = ease(p);
        leaf.style.transform = 'rotateY(' + (-180 * e) + 'deg)';
        f.style.filter = 'brightness(' + (1 - .4 * Math.sin(e * Math.PI)) + ')';
        if (p > .5) book.classList.remove('closed');
        if (p < 1) requestAnimationFrame(step); else { cl.style.display = 'none'; cl.innerHTML = ''; S.busy = false; render(); }
      })(t0);
    }, 750);
  }

  /* ---------------- layout ---------------- */
  function layout() {
    var W = innerWidth, H = innerHeight;
    var top = document.querySelector('.topbar').offsetHeight || 50, bot = $('ribbon').offsetHeight || 56, arw = $('btn-next').offsetWidth || 40;
    var availH = H - top - bot - 16, availW = W - 2 * arw - 24;
    S.single = (availW / availH) < 1.2;
    if (S.single) S.spreads = S.pageList.map(function (p) { return [null, p]; });
    else {
      var L = S.pageList.slice(); if (L.length && L[0].page % 2 === 1) L.unshift(null);
      S.spreads = []; for (var i = 0; i < L.length; i += 2) S.spreads.push([L[i], L[i + 1] || null]);
    }
    var ph = Math.floor(Math.min(availH, (S.single ? availW : availW / 2) / RATIO));
    var pw = Math.floor(ph * RATIO);
    S.ph = ph; S.pw = pw;
    var b = $('book'); b.style.width = (S.single ? pw : pw * 2) + 'px'; b.style.height = ph + 'px';
    b.classList.toggle('single', S.single);
  }

  /* ---------------- rendering ---------------- */
  function pageEl(p, side) {
    var wrap = el('div', 'page');
    if (!p) return wrap;
    wrap.style.backgroundImage = 'url("' + url(p.img) + '")';
    wrap.dataset.page = p.page;
    var c = el('canvas', 'ink'); c.dataset.page = p.page; wrap.appendChild(c);
    var m = el('div', 'marks'); wrap.appendChild(m);
    bindInk(c);
    return wrap;
  }

  function render() {
    if (!S.spreads.length) return;
    S.si = clamp(S.si, 0, S.spreads.length - 1);
    var sp = S.spreads[S.si];
    fillSlot('slot-left', sp[0]); fillSlot('slot-right', sp[1]);
    var vis = sp.filter(Boolean);
    $('tb-pages').textContent = vis.length === 2 ? 'pp. ' + vis[0].page + '–' + vis[1].page : 'p. ' + (vis[0] ? vis[0].page : '');
    $('btn-prev').disabled = S.si === 0; $('btn-next').disabled = S.si === S.spreads.length - 1;
    var hint = document.querySelector('.corner-hint'); if (hint) hint.remove();
    if (S.si === 0 && S.spreads.length > 1) $('slot-right').appendChild(el('div', 'corner-hint'));
    store('mb-pos-' + S.g, S.si);
    drawAllInk(); drawMarks(); buildRibbon(); preload();
    if (window.MagicScene) MagicScene.onSpread();
  }
  function fillSlot(id, p) {
    var s = $(id); s.innerHTML = ''; s.classList.toggle('empty', !p);
    if (p) s.appendChild(pageEl(p));
  }
  function preload() {
    [S.si - 1, S.si + 1, S.si + 2].forEach(function (i) {
      var sp = S.spreads[i]; if (!sp) return;
      sp.forEach(function (p) { if (p) { var im = new Image(); im.src = url(p.img); } });
    });
  }
  function visiblePages() { return (S.spreads[S.si] || []).filter(Boolean); }

  /* ---------------- the turning page (curled strips) ---------------- */
  function buildLeaf(frontImg, backImg) {
    var holder = $('leaf-holder'); holder.innerHTML = '';
    var w = S.pw, sw = w / N, parent = holder, strips = [], shades = [];
    for (var i = 0; i < N; i++) {
      var s = el('div', 'strip');
      s.style.width = (sw + .8) + 'px'; s.style.left = (i === 0 ? 0 : sw) + 'px';
      var f = el('div', 'face front'), b = el('div', 'face back');
      [[f, frontImg, -i * sw], [b, backImg, -(w - (i + 1) * sw)]].forEach(function (a) {
        if (a[1]) a[0].style.backgroundImage = 'url("' + a[1] + '")';
        a[0].style.backgroundSize = w + 'px ' + S.ph + 'px';
        a[0].style.backgroundPosition = a[2] + 'px 0';
        var sh = el('div', 'sh'); a[0].appendChild(sh); shades.push(sh);
      });
      s.appendChild(f); s.appendChild(b); parent.appendChild(s); parent = s; strips.push(s);
    }
    holder.style.display = 'block';
    return { strips: strips, shades: shades };
  }
  function setLeaf(leaf, p, dir) {
    // p: 0 = lying on the right, 1 = lying on the left. dir: -1 turning forward, +1 back
    var c = Math.sin(p * Math.PI) * CURL;
    var base = -180 * p - dir * c * .45, acc = base;
    for (var i = 0; i < N; i++) {
      var a = i === 0 ? base : dir * c * 2 * i / (N * (N - 1));
      if (i) acc += a;
      leaf.strips[i].style.transform = 'rotateY(' + a.toFixed(2) + 'deg)';
      var light = (1 - Math.abs(Math.cos(acc * Math.PI / 180))) * .42;
      leaf.shades[i * 2].style.opacity = light.toFixed(3);
      leaf.shades[i * 2 + 1].style.opacity = (light * .8).toFixed(3);
    }
  }
  function clearLeaf() { var h = $('leaf-holder'); h.innerHTML = ''; h.style.display = 'none'; }

  function prepTurn(dir) {
    // dir -1 = forward (next), +1 = back (prev). Returns turn object or null.
    var to = S.si + (dir < 0 ? 1 : -1);
    if (S.busy || to < 0 || to >= S.spreads.length) return null;
    var cur = S.spreads[S.si], nxt = S.spreads[to], leaf;
    stopRead(); resetZoom();
    if (dir < 0) {
      fillSlot('slot-right', nxt[1]);
      leaf = buildLeaf(cur[1] && url(cur[1].img), S.single ? '' : (nxt[0] && url(nxt[0].img)));
      setLeaf(leaf, 0, dir);
    } else {
      if (S.single) { leaf = buildLeaf(nxt[1] && url(nxt[1].img), ''); }
      else { fillSlot('slot-left', nxt[0]); leaf = buildLeaf(nxt[1] && url(nxt[1].img), cur[0] && url(cur[0].img)); }
      setLeaf(leaf, 1, dir);
    }
    S.busy = true;
    return { dir: dir, to: to, leaf: leaf, p: dir < 0 ? 0 : 1 };
  }
  function runTurn(T, target, done) {
    var from = T.p, t0 = performance.now(), dur = 260 + 700 * Math.abs(target - from);
    (function step(t) {
      var k = clamp((t - t0) / dur, 0, 1), p = from + (target - from) * ease(k);
      T.p = p; setLeaf(T.leaf, p, T.dir);
      if (k < 1) requestAnimationFrame(step); else done();
    })(t0);
  }
  function finishTurn(T, completed) {
    clearLeaf(); S.busy = false;
    if (completed) S.si = T.to;
    render();
  }
  function turn(dir) {
    if (S.scene) return;
    var T = prepTurn(dir); if (!T) return;
    swish();
    runTurn(T, dir < 0 ? 1 : 0, function () { finishTurn(T, true); });
  }

  /* drag a corner to turn */
  var drag = null;
  function bookDown(e) {
    if (S.scene) return;
    if (e.pointerType === 'pen' && !S.tool) {
      $('tray').hidden = false; $('pencil').classList.add('open');
      setTool('pen');
      return;
    }
    if (S.scene || S.tool || S.busy || e.button > 0) return;
    var r = $('book').getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (S.zoom > 1) { drag = { pan: true, x: e.clientX, y: e.clientY, px: S.panX, py: S.panY }; $('book').setPointerCapture(e.pointerId); return; }
    var zone = S.single ? .32 : .24;
    var dir = x > 1 - zone ? -1 : x < zone ? 1 : 0;
    drag = { dir: dir, x0: e.clientX, w: r.width, moved: false, T: null, t0: Date.now() };
    $('book').setPointerCapture(e.pointerId);
  }
  function bookMove(e) {
    if (!drag) return;
    if (drag.pan) { S.panX = drag.px + e.clientX - drag.x; S.panY = drag.py + e.clientY - drag.y; applyZoom(); return; }
    if (!drag.dir) return;
    var dx = e.clientX - drag.x0;
    if (!drag.moved && Math.abs(dx) > 10) {
      drag.moved = true; drag.T = prepTurn(drag.dir); if (!drag.T) { drag = null; return; } swish();
    }
    if (drag.T) {
      var span = S.single ? drag.w * 1.1 : drag.w * .95;
      var p = drag.dir < 0 ? clamp(-dx / span, 0, 1) : clamp(1 - dx / span, 0, 1);
      drag.T.p = p; setLeaf(drag.T.leaf, p, drag.dir);
    }
  }
  function bookUp() {
    if (!drag) return;
    var d = drag; drag = null;
    if (d.pan || !d.dir) return;
    if (!d.T) { if (Date.now() - d.t0 < 500) turn(d.dir); return; }
    var T = d.T, go = T.dir < 0 ? T.p > .28 : T.p < .72;
    runTurn(T, go ? (T.dir < 0 ? 1 : 0) : (T.dir < 0 ? 0 : 1), function () { finishTurn(T, go); });
  }

  /* zoom (double-tap a page) */
  // The book is a 3D object: it tilts a little toward the pointer, and the scene code takes it over in 3D mode.
  S.tiltX = 5; S.tiltY = 0;
  function composeBook() {
    if (S.scene) return;
    var b = $('book');
    b.style.transform = (S.zoom > 1 ? 'translate(' + S.panX + 'px,' + S.panY + 'px) scale(' + S.zoom + ') ' : '') +
      'rotateX(' + S.tiltX.toFixed(2) + 'deg) rotateY(' + S.tiltY.toFixed(2) + 'deg)';
    b.classList.toggle('zoomed', S.zoom > 1);
  }
  function applyZoom() { composeBook(); }
  var tiltRaf = 0;
  function stageTilt(e) {
    if (S.scene || S.busy || drag || S.zoom > 1) return;
    var r = $('stage').getBoundingClientRect();
    var tx = 5 - ((e.clientY - r.top) / r.height - .5) * 5, ty = ((e.clientX - r.left) / r.width - .5) * 8;
    if (tiltRaf) return;
    tiltRaf = requestAnimationFrame(function () { tiltRaf = 0; S.tiltX = tx; S.tiltY = ty; composeBook(); });
  }
  function resetZoom() { S.zoom = 1; S.panX = S.panY = 0; applyZoom(); }
  function toggleZoom(e) {
    if (S.scene || S.tool || S.busy) return;
    if (S.zoom > 1) return resetZoom();
    var b = $('book'), r = b.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2, z = 2.1;
    S.zoom = z; S.panX = (cx - e.clientX) * (z - 1); S.panY = (cy - e.clientY) * (z - 1); applyZoom();
  }

  /* ---------------- ink: pen, highlighter, eraser, stamps ---------------- */
  function inkKey() { return 'mb-ink-' + S.g + '-' + S.cls; }
  function loadClassData() {
    S.ink = store(inkKey()) || {}; S.inkHist = [];
    S.solved = store('mb-solved-' + S.g + '-' + S.cls) || {};
  }
  function saveInk() { store(inkKey(), S.ink); }

  function drawInk(c) {
    var n = c.dataset.page, dpr = Math.min(devicePixelRatio || 1, 2), w = S.pw, h = S.ph;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    var x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
    (S.ink[n] || []).forEach(function (s) { drawStroke(x, s, w, h); });
  }
  function drawStroke(x, s, w, h) {
    if (s.t === 'stamp') {
      x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
      x.font = Math.round(w * .07) + 'px "Segoe UI Emoji","Apple Color Emoji",sans-serif';
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s.s, s.x * w, s.y * h); return;
    }
    if (!s.pts.length) return;
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.globalCompositeOperation = s.t === 'hl' ? 'multiply' : 'source-over';
    x.globalAlpha = s.t === 'hl' ? .4 : 1;
    x.strokeStyle = s.c; x.lineWidth = (s.t === 'hl' ? .026 : .0055) * w;
    x.beginPath(); x.moveTo(s.pts[0][0] * w, s.pts[0][1] * h);
    for (var i = 1; i < s.pts.length; i++) x.lineTo(s.pts[i][0] * w, s.pts[i][1] * h);
    if (s.pts.length === 1) x.lineTo(s.pts[0][0] * w + .1, s.pts[0][1] * h);
    x.stroke(); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  }
  function drawAllInk() { [].forEach.call(document.querySelectorAll('#book .page-slot .ink'), drawInk); }

  function bindInk(c) {
    var cur = null;
    function pt(e) { var r = c.getBoundingClientRect(); return [clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1)]; }
    var blockTouch = function (e) { if (S.tool || cur) e.preventDefault(); };
    c.addEventListener('touchstart', blockTouch, { passive: false });
    c.addEventListener('touchmove', blockTouch, { passive: false });
    c.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'pen' && !S.tool) {
        $('tray').hidden = false; $('pencil').classList.add('open');
        setTool('pen');
      }
      if (!S.tool) return; e.stopPropagation(); e.preventDefault();
      var n = c.dataset.page, p = pt(e); S.ink[n] = S.ink[n] || [];
      if (S.tool === 'stamp') { S.ink[n].push({ t: 'stamp', s: S.stamp, x: p[0], y: p[1] }); S.inkHist.push(n); chime(true); drawInk(c); saveInk(); return; }
      if (S.tool === 'erase') { cur = { erase: true }; eraseAt(n, p); drawInk(c); }
      else { cur = { t: S.tool, c: S.color, pts: [p] }; S.ink[n].push(cur); S.inkHist.push(n); drawInk(c); }
      try { c.setPointerCapture(e.pointerId); } catch (err) { }
    });
    c.addEventListener('pointermove', function (e) {
      if (!cur) return;
      e.preventDefault();
      var n = c.dataset.page, p = pt(e);
      if (cur.erase) { if (eraseAt(n, p)) drawInk(c); return; }
      var last = cur.pts[cur.pts.length - 1];
      if (Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]) > .0015) { cur.pts.push(p); drawInk(c); }
    });
    var up = function () { if (cur) { cur = null; saveInk(); } };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  }
  function eraseAt(n, p) {
    var L = S.ink[n] || [], r = .025, before = L.length;
    S.ink[n] = L.filter(function (s) {
      if (s.t === 'stamp') return Math.hypot(s.x - p[0], (s.y - p[1]) / RATIO) > r * 1.6;
      return !s.pts.some(function (q) { return Math.hypot(q[0] - p[0], (q[1] - p[1]) / RATIO) < r; });
    });
    return S.ink[n].length !== before;
  }

  function setTool(t) {
    S.tool = t;
    $('book').classList.toggle('drawing', !!t);
    [].forEach.call(document.querySelectorAll('#tray .tool[data-tool]'), function (b) { b.classList.toggle('on', b.dataset.tool === t); });
    $('stamps').style.display = t === 'stamp' ? 'flex' : 'none';
    $('colors').style.display = t === 'pen' || t === 'hl' ? 'flex' : 'none';
    if (t) resetZoom();
  }
  function buildTray() {
    var cs = $('colors'); cs.style.display = 'flex';
    PALETTE.forEach(function (col, i) {
      var b = el('button', 'sw' + (i === 0 ? ' on' : '')); b.style.background = col;
      b.onclick = function () { S.color = col; [].forEach.call(cs.children, function (y) { y.classList.toggle('on', y === b); }); };
      cs.appendChild(b);
    });
    var ss = $('stamps');
    STAMPS.forEach(function (st, i) {
      var b = el('button', 'st' + (i === 0 ? ' on' : ''), st);
      b.onclick = function () { S.stamp = st; [].forEach.call(ss.children, function (y) { y.classList.toggle('on', y === b); }); };
      ss.appendChild(b);
    });
    [].forEach.call(document.querySelectorAll('#tray .tool[data-tool]'), function (b) {
      b.onclick = function () { setTool(S.tool === b.dataset.tool ? null : b.dataset.tool); };
    });
    $('pencil-btn').onclick = function () {
      var open = $('tray').hidden; $('tray').hidden = !open; $('pencil').classList.toggle('open', open);
      setTool(open ? 'pen' : null);
    };
    $('btn-done').onclick = function () { $('tray').hidden = true; $('pencil').classList.remove('open'); setTool(null); };
    $('btn-undo').onclick = function () {
      var n = S.inkHist.pop(); if (n == null) return;
      if (typeof n === 'object') { S.ink[n.page] = n.strokes; } else if (S.ink[n]) S.ink[n].pop();
      saveInk(); drawAllInk();
    };
    $('btn-clear').onclick = function () {
      visiblePages().forEach(function (p) { if ((S.ink[p.page] || []).length) { S.inkHist.push({ page: p.page, strokes: S.ink[p.page] }); S.ink[p.page] = []; } });
      saveInk(); drawAllInk(); toast('Pages cleaned ✨ (↶ to undo)');
    };
    setTool(null);
  }

  /* ---------------- answers, stars ---------------- */
  function drawMarks() {
    [].forEach.call(document.querySelectorAll('#book .page-slot .page'), function (pg) {
      var n = pg.dataset.page; if (!n) return;
      var m = pg.querySelector('.marks'); m.innerHTML = '';
      var p = S.data[S.g].pages[n]; if (!p) return;
      (p.spots || []).forEach(function (s) {
        if (S.showAns && (s.type !== 'choice' || s.correct)) {
          var a = el('div', 'ans', esc(s.type === 'choice' ? '✓ ' + (s.text || s.answer) : s.answer));
          a.style.left = s.x + '%'; a.style.top = s.y + '%'; a.style.minWidth = s.w + '%'; a.style.height = s.h + '%';
          a.style.setProperty('--af', Math.max(12, Math.min(S.ph * s.h / 100 * .78, S.ph * .03)) + 'px');
          m.appendChild(a);
          var maxW = (100 - s.x - 1) / 100 * S.pw;
          if (a.scrollWidth > maxW) a.style.fontSize = (parseFloat(getComputedStyle(a).fontSize) * maxW / a.scrollWidth) + 'px';
        }
        if (S.solved[s.id] && (s.type !== 'choice' || s.correct)) {
          var st = el('div', 'gstar', '⭐');
          st.style.left = Math.min(97, s.x + s.w + 1.5) + '%'; st.style.top = (s.y + s.h / 2) + '%';
          st.style.setProperty('--sf', Math.round(S.pw * .055) + 'px');
          m.appendChild(st);
        }
      });
    });
  }

  /* ---------------- exercises as magic cards ---------------- */
  function exItems() {
    var out = [], groups = {};
    visiblePages().forEach(function (p) {
      (p.spots || []).forEach(function (s) {
        if (s.type === 'choice') {
          var g = s.group || s.id;
          if (!groups[g]) {
            var ex = (p.exercises || []).find(function (x) { return s.x >= x.x - 2 && s.x <= x.x + x.w && s.y >= x.y - 2 && s.y <= x.y + x.h; });
            groups[g] = { kind: 'choice', page: p.page, id: g, num: String(s.num || '').replace(/\d+$/, '') || '★', prompt: ex ? ex.label.replace(/^Ex\s*\w+:\s*/i, '') : 'Choose the right answer', opts: [], correct: null, spots: [], hint: s.hint };
            out.push(groups[g]);
          }
          groups[g].opts.push(s.text || s.answer); groups[g].spots.push(s);
          if (s.correct) { groups[g].correct = s.text || s.answer; groups[g].solveId = s.id; }
        } else {
          out.push({ kind: 'blank', page: p.page, id: s.id, solveId: s.id, num: s.num, prompt: s.prompt, opts: (s.options || []).slice(), correct: s.answer, hint: s.hint });
        }
      });
    });
    out.forEach(function (it) { if (it.kind === 'blank' && it.opts.length) shuffle(it.opts); });
    return out;
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function openExercises(start) {
    var items = exItems(); if (!items.length) { toast('No exercises on these pages'); return; }
    var i = start || items.findIndex(function (it) { return !S.solved[it.solveId]; }); if (i < 0) i = 0;
    showCard(items, i);
  }
  function showCard(items, i) {
    var it = items[i], card = $('modal-card');
    stopRead();
    var dots = items.map(function (x, k) { return '<span class="' + (S.solved[x.solveId] ? 'done' : '') + (k === i ? ' cur' : '') + '"></span>'; }).join('');
    card.innerHTML = '<button class="x-btn" data-x>✕</button>' +
      '<span class="ex-tag">Page ' + it.page + ' · ' + esc(it.num) + '</span>' +
      '<div class="ex-q">' + esc(it.prompt) + ' <button class="x-btn" style="position:static;width:40px;height:40px;font-size:18px;vertical-align:middle" data-say>🔊</button></div>' +
      '<div class="opts">' + (it.opts.length ? it.opts.map(function (o) { return '<button class="opt">' + esc(o) + '</button>'; }).join('') : '<button class="opt" data-reveal>Tap to see the answer</button>') + '</div>' +
      '<div class="ex-hint" hidden></div>' +
      '<div class="ex-nav"><button data-prev' + (i === 0 ? ' disabled style="opacity:.3"' : '') + '>‹ Back</button><div class="ex-dots">' + dots + '</div><button class="go" data-show>Show answer</button><button data-next' + (i === items.length - 1 ? ' disabled style="opacity:.3"' : '') + '>Next ›</button></div>';
    openModal();
    var hint = card.querySelector('.ex-hint');
    card.querySelector('[data-x]').onclick = closeModal;
    card.querySelector('[data-say]').onclick = function () { say(it.prompt); };
    card.querySelector('[data-prev]').onclick = function () { if (i > 0) showCard(items, i - 1); };
    card.querySelector('[data-next]').onclick = function () { if (i < items.length - 1) showCard(items, i + 1); };
    card.querySelector('[data-show]').onclick = function () { markRight(card, it); hint.hidden = false; hint.innerHTML = '✅ <b>' + esc(it.correct) + '</b>'; };
    [].forEach.call(card.querySelectorAll('.opt'), function (b) {
      b.onclick = function () {
        if (b.hasAttribute('data-reveal')) { hint.hidden = false; hint.innerHTML = '✅ <b>' + esc(it.correct) + '</b>'; return; }
        if (norm(b.textContent) === norm(it.correct)) {
          b.classList.add('right'); chime(true); say(it.correct, { rate: .9 });
          if (!S.solved[it.solveId]) { S.solved[it.solveId] = 1; store('mb-solved-' + S.g + '-' + S.cls, S.solved); }
          toast('⭐ Great job!'); drawMarks(); updateExCount();
          var d = card.querySelectorAll('.ex-dots span')[i]; if (d) d.classList.add('done');
          setTimeout(function () { if (!$('modal').hidden && card.contains(b) && i < items.length - 1) showCard(items, i + 1); }, 1600);
        } else {
          b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); chime(false);
          if (it.hint) { hint.hidden = false; hint.textContent = '💡 ' + it.hint; }
        }
      };
    });
    say(it.prompt);
  }
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }
  function markRight(card, it) { [].forEach.call(card.querySelectorAll('.opt'), function (b) { if (norm(b.textContent) === norm(it.correct)) b.classList.add('right'); }); }
  function updateExCount() {
    var items = exItems(), left = items.filter(function (it) { return !S.solved[it.solveId]; }).length;
    $('ex-count').textContent = items.length ? (left ? left : '✓') : '';
    $('btn-ex').classList.toggle('empty', !items.length);
  }

  /* ---------------- ribbon: words, read, 3D scene, video, sound ---------------- */
  function buildRibbon() {
    var seen = {}, box = $('rb-words'); box.innerHTML = '';
    visiblePages().forEach(function (p) {
      (p.popWords || []).forEach(function (w) {
        if (seen[w.word]) return; seen[w.word] = 1;
        var b = el('button', 'word-chip', '<img alt="" src="' + url(w.img) + '" onerror="this.style.visibility=\'hidden\'">' + esc(w.word));
        b.onclick = function () { popWord(w); };
        box.appendChild(b);
      });
    });
    var sc3d = visiblePages().filter(function (p) { return p.scene3d; });
    var vids = visiblePages().filter(function (p) { return p.video; });
    var snd = visiblePages().filter(function (p) { return p.sound; });
    if ($('btn-scene')) {
      $('btn-scene').classList.toggle('empty', true);
      $('btn-scene').onclick = function () { if (sc3d.length) open3dScene(sc3d[0]); };
    }
    $('btn-video').classList.toggle('empty', !vids.length);
    $('btn-sound').classList.toggle('empty', !snd.length);
    $('btn-video').onclick = function () { if (vids.length) playVideo(vids[0]); };
    $('btn-sound').onclick = function () { if (!snd.length) return; var a = new Audio(url(snd[0].sound)); a.play().catch(function () { toast('Sound not found'); }); };
    $('btn-answers').classList.toggle('on', S.showAns);
    updateExCount();
  }

  function open3dScene(p) {
    var sc = p.scene3d; if (!sc) return;
    stopRead();
    var itemsHtml = (sc.items || []).map(function (it, idx) {
      return '<button class="scene3d-item" data-idx="' + idx + '" style="left:' + it.x + '%;top:' + it.y + '%;width:' + it.w + '%;animation-delay:-' + (idx * 0.7).toFixed(1) + 's">' +
        '<img alt="" src="' + url(it.img) + '">' +
        '<span class="scene3d-speech" hidden>' + esc(it.say) + '</span>' +
        '</button>';
    }).join('');
    $('modal-card').innerHTML = '<button class="x-btn" data-x style="z-index:5">✕</button>' +
      '<div class="scene3d-wrap">' +
      '<div class="scene3d-stage" style="background-image:url(\'' + url(sc.bg) + '\')">' +
      itemsHtml +
      '<div class="scene3d-badge">✨ Tap characters & objects to hear them!</div>' +
      '</div>' +
      '<div class="card-btns"><button data-narrate>🔊 Read Scene</button></div>' +
      '</div>';
    $('modal-card').classList.add('vid');
    openModal();
    chime(true);
    $('modal-card').querySelector('[data-x]').onclick = closeModal;
    $('modal-card').querySelector('[data-narrate]').onclick = function () {
      say(p.narration || (sc.items && sc.items[0] && sc.items[0].say) || '');
    };
    [].forEach.call($('modal-card').querySelectorAll('.scene3d-item'), function (btn) {
      btn.onclick = function () {
        var idx = Number(btn.dataset.idx);
        var it = sc.items[idx]; if (!it) return;
        chime(true);
        [].forEach.call($('modal-card').querySelectorAll('.scene3d-speech'), function (sp) { sp.hidden = true; });
        var sp = btn.querySelector('.scene3d-speech');
        if (sp) sp.hidden = false;
        btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
        say(it.say, { rate: .88 });
      };
    });
  }

  function popWord(w) {
    stopRead();
    $('modal-card').innerHTML = '<button class="x-btn" data-x>✕</button><div class="word-pop">' +
      '<img alt="" src="' + url(w.img) + '" onerror="this.style.display=\'none\'"><div class="w">' + esc(w.word) + '</div><div class="m">' + esc(w.meaning || '') + '</div>' +
      '<div class="card-btns"><button data-again>🔊 Say it again</button></div></div>';
    openModal(); chime(true);
    $('modal-card').querySelector('[data-x]').onclick = closeModal;
    var go = function () { say(w.word, { rate: .75, end: function () { setTimeout(function () { if (!$('modal').hidden) say(w.meaning || '', { rate: .9 }); }, 300); } }); };
    $('modal-card').querySelector('[data-again]').onclick = go; setTimeout(go, 350);
  }

  function playVideo(p) {
    stopRead();
    $('modal-card').innerHTML = '<button class="x-btn" data-x style="z-index:2">✕</button><div class="vid-card"><video src="' + url(p.video) + '" controls autoplay playsinline></video>' +
      '<div class="card-btns"><button data-again>↻ Play again</button></div></div>';
    $('modal-card').classList.add('vid');
    openModal();
    var v = $('modal-card').querySelector('video');
    v.onerror = function () { toast('Video not found'); };
    $('modal-card').querySelector('[data-x]').onclick = closeModal;
    $('modal-card').querySelector('[data-again]').onclick = function () { v.currentTime = 0; v.play(); };
  }

  function openModal() { $('modal').hidden = false; }
  function closeModal() {
    var v = document.querySelector('#modal video'); if (v) v.pause();
    $('modal').hidden = true; $('modal-card').innerHTML = ''; $('modal-card').classList.remove('vid');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  var reading = false;
  function readPage() {
    if (reading) return stopRead();
    var text = visiblePages().map(function (p) { return p.narration || ''; }).join(' ').trim();
    if (!text) { toast('Nothing to read here'); return; }
    var cap = $('caption'), words = text.split(/(\s+)/), starts = [], pos = 0, html = '';
    words.forEach(function (w) { if (/\S/.test(w)) { starts.push(pos); html += '<span class="cw">' + esc(w) + '</span>'; } else html += w; pos += w.length; });
    cap.innerHTML = html; cap.hidden = false; reading = true; $('btn-read').classList.add('on'); $('btn-read').textContent = '⏹ Stop';
    var spans = cap.querySelectorAll('.cw');
    say(text, {
      rate: .88,
      boundary: function (e) {
        if (e.name && e.name !== 'word') return;
        var k = 0; while (k + 1 < starts.length && starts[k + 1] <= e.charIndex) k++;
        [].forEach.call(spans, function (s, j) { s.classList.toggle('on', j === k); });
        var sp = spans[k]; if (sp && sp.offsetTop > cap.scrollTop + cap.clientHeight - 30) cap.scrollTop = sp.offsetTop - 20;
      },
      end: function () { stopRead(); }
    });
  }
  function stopRead() {
    if (!reading) return; reading = false;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    $('caption').hidden = true; $('btn-read').classList.remove('on'); $('btn-read').textContent = '🗣️ Read to me';
  }

  /* ---------------- wiring ---------------- */
  function wire() {
    var b = $('book');
    b.addEventListener('pointerdown', bookDown);
    b.addEventListener('pointermove', bookMove);
    b.addEventListener('pointerup', bookUp);
    b.addEventListener('pointercancel', bookUp);
    b.addEventListener('dblclick', toggleZoom);
    $('stage').addEventListener('pointermove', stageTilt);
    $('stage').addEventListener('pointerleave', function () { if (!S.scene) { S.tiltX = 5; S.tiltY = 0; composeBook(); } });
    $('btn-next').onclick = function () { turn(-1); };
    $('btn-prev').onclick = function () { turn(1); };
    $('btn-home').onclick = goShelf;
    $('btn-full').onclick = function () { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () { }); };
    $('btn-read').onclick = readPage;
    $('btn-ex').onclick = function () { openExercises(); };
    $('btn-answers').onclick = function () { S.showAns = !S.showAns; drawMarks(); $('btn-answers').classList.toggle('on', S.showAns); };
    $('modal').addEventListener('pointerdown', function (e) { if (e.target === $('modal')) closeModal(); });
    addEventListener('keydown', function (e) {
      if (!$('modal').hidden) { if (e.key === 'Escape') closeModal(); return; }
      if ($('book-view').hidden) return;
      if (S.scene) { if (e.key === 'Escape' && window.MagicScene) MagicScene.close(); return; }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); turn(-1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); turn(1); }
      else if (e.key === 'Escape') { resetZoom(); setTool(null); }
    });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (!S.g || S.busy) return; var cur = (visiblePages()[0] || {}).page; layout(); if (cur) S.si = Math.max(0, S.spreads.findIndex(function (sp) { return sp.some(function (p) { return p && p.page === cur; }); })); resetZoom(); render(); }, 150); });
    buildTray();
  }

  wire(); loadData();
  window.MagicBook = {
    state: S, turn: turn, open: openBook, visiblePages: visiblePages, exItems: exItems, say: say, chime: chime, toast: toast,
    swish: swish, drawMarks: drawMarks, updateExCount: updateExCount, store: store, composeBook: composeBook,
    resetZoom: resetZoom, setTool: setTool, stopRead: stopRead, esc: esc
  };
  if (window.MagicScene) MagicScene.init();
})();
