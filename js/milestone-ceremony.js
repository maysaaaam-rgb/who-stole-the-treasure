/* 1,000 XP Grand Ceremony: a big full-screen celebration for a pupil who reaches Level 5 (Adventurer),
   with her photo (kept only in this browser), fireworks, sound, a "Golden Adventurer" title and a printable certificate.
   Vanilla JS, no libraries, works offline. Use it from milestone-1000/index.html, or it starts by itself in the platform
   when a pupil called Öykü Çiğdem evolves to Level 5 (change who gets it with MilestoneCeremony.enableFor). */
(function (root) {
  'use strict';
  var PHOTO_KEY = 'eaa_photo_', CFG_KEY = 'eaa_milestone_cfg', VIP_KEY = 'eaa_grand_ceremony_names', TITLE_KEY = 'eaa_golden_titles';
  var TITLE = 'Golden Adventurer';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function del(k) { try { localStorage.removeItem(k); } catch (e) { /* storage may be blocked */ } }
  function slug(name) { return String(name || '').toLowerCase().replace(/[^a-z0-9À-ɏ]+/g, '-'); }
  function sleep(ms, st) { return new Promise(function (res) { var t = setTimeout(res, st && st.fast ? 20 : ms); if (st) st.timers.push(t); }); }

  /* ---------- photo: stored only in this browser, shrunk to 600px ---------- */
  var photos = {
    get: function (key) { return get(PHOTO_KEY + slug(key)) || ''; },
    remove: function (key) { del(PHOTO_KEY + slug(key)); },
    pick: function (key, done) {
      var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = function () {
        var f = inp.files && inp.files[0]; if (!f) return;
        var img = new Image(), url = URL.createObjectURL(f);
        img.onload = function () {
          var keepAlpha = /png|webp/i.test(f.type);                       // cartoon avatars have a transparent background
          var max = keepAlpha ? 480 : 600, r = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
          c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          var data = keepAlpha ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86); URL.revokeObjectURL(url);
          var ok = set(PHOTO_KEY + slug(key), data); if (done) done(ok ? data : '', ok);
        };
        img.onerror = function () { URL.revokeObjectURL(url); if (done) done('', false); };
        img.src = url;
      };
      inp.click();
    }
  };

  function isAvatar(url) { return String(url || '').indexOf('data:image/png') === 0; }

  /* ---------- sound: polyphonic chords, two oscillators each, ADSR (no raw beeps) ---------- */
  var AC = null;
  function ac() { if (!AC) { var C = root.AudioContext || root.webkitAudioContext; if (C) AC = new C(); } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function note(freq, t0, dur, vol, type) {
    var a = ac(); if (!a) return;
    [0, 1].forEach(function (i) {
      var o = a.createOscillator(), g = a.createGain();
      o.type = i ? 'sine' : (type || 'triangle'); o.frequency.value = freq * (i ? 2.003 : 1);
      var v = (vol || 0.12) * (i ? 0.35 : 1), t = a.currentTime + t0;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.03);
      g.gain.exponentialRampToValueAtTime(v * 0.6, t + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  function chord(fs, t0, dur, vol) { fs.forEach(function (f) { note(f, t0, dur, vol); }); }
  var snd = {
    tick: function (n) { note(392 * Math.pow(1.0595, n % 12), 0, 0.18, 0.05, 'sine'); },
    hum: function () { chord([130.8, 196, 261.6], 0, 3.4, 0.045); },
    boom: function () { chord([65.4, 98, 130.8], 0, 1.6, 0.16); },
    fanfare: function () {
      var seq = [523.25, 659.25, 783.99, 1046.5];                              // C5 E5 G5 C6
      seq.forEach(function (f, i) { chord([f, f / 2], i * 0.2, 0.7, 0.1); });
      chord([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.9, 2.4, 0.09);
      [1568, 1760, 2093].forEach(function (f, i) { note(f, 1.2 + i * 0.18, 0.5, 0.05, 'sine'); });
    },
    pop: function () { note(880 + Math.random() * 600, 0, 0.22, 0.03, 'sine'); }
  };
  function speak(text) {
    try { if (!root.speechSynthesis) return; var u = new SpeechSynthesisUtterance(text); u.rate = 0.88; u.pitch = 1.05; u.lang = 'en-US'; root.speechSynthesis.cancel(); root.speechSynthesis.speak(u); } catch (e) { /* no voice available */ }
  }

  /* ---------- monster picture (the drawn monsters) ---------- */
  function monster(color, stage, size) {
    try { if (root.MonsterRenderer) return root.MonsterRenderer.renderMonsterSVG({ stage: stage, color: color || 'blue', size: size, animated: true, isAvatar: true }); } catch (e) { /* fall through */ }
    return '<div style="font-size:' + Math.round(size / 2) + 'px">&#128126;</div>';
  }

  /* ---------- styles ---------- */
  var styled = false;
  function css() {
    if (styled) return; styled = true;
    var s = document.createElement('style'); s.id = 'mc-css';
    s.textContent = '' +
      '#mc-overlay{position:fixed;inset:0;z-index:2000000;background:radial-gradient(circle at 50% 35%,#0d1527 0,#060911 100%);color:#f8fafc;font-family:"Plus Jakarta Sans",Fredoka,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;text-align:center}' +
      '#mc-fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
      '#mc-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}' +
      '#mc-flash.go{animation:mcFlash .9s ease-out}@keyframes mcFlash{0%{opacity:1}100%{opacity:0}}' +
      '.mc-wrap{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:1.4vh;padding:2vh 4vw;max-width:1100px}' +
      '.mc-line{font-size:clamp(1.2rem,3.2vw,2.4rem);font-weight:800;min-height:1.3em;opacity:.95}' +
      '.mc-xp{font-size:clamp(3.4rem,13vw,9rem);font-weight:900;line-height:1;background:linear-gradient(180deg,#fde68a,#f59e0b);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .6vh 1.2vh rgba(245,158,11,.5))}' +
      '.mc-xp small{font-size:.3em;margin-left:.2em;-webkit-text-fill-color:#fde68a}' +
      '.mc-mon{width:min(46vh,70vw);height:min(46vh,70vw);display:flex;align-items:center;justify-content:center;position:relative}' +
      '.mc-mon svg{width:100%;height:100%;filter:drop-shadow(0 1.4vh 2vh rgba(0,0,0,.5))}' +
      '.mc-mon.shake{animation:mcShake .12s linear infinite}@keyframes mcShake{0%{transform:translate(-3px,1px) rotate(-1deg)}50%{transform:translate(3px,-1px) rotate(1deg)}100%{transform:translate(-3px,1px) rotate(-1deg)}}' +
      '.mc-mon.glow{filter:drop-shadow(0 0 3vh #fde047) drop-shadow(0 0 6vh #f59e0b)}' +
      '.mc-mon.pop{animation:mcPop .9s cubic-bezier(.175,.885,.32,1.275)}@keyframes mcPop{0%{transform:scale(.2) rotate(-12deg)}100%{transform:scale(1) rotate(0)}}' +
      '.mc-ring{position:absolute;border:.6vh solid #fde047;border-radius:50%;opacity:0;pointer-events:none;width:30vh;height:30vh}' +
      '.mc-ring.go{animation:mcRing 1.6s ease-out forwards}@keyframes mcRing{0%{transform:scale(.3);opacity:.9}100%{transform:scale(3.4);opacity:0}}' +
      '.mc-name{font-size:clamp(2rem,6.4vw,4.6rem);font-weight:900;letter-spacing:.02em;text-shadow:0 .5vh 0 rgba(0,0,0,.5);animation:mcUp .8s ease-out both}' +
      '.mc-badge{display:inline-block;padding:1vh 2.2vw;border-radius:999px;font-weight:900;font-size:clamp(1rem,2.6vw,1.9rem);letter-spacing:.08em;color:#2b1700;background:linear-gradient(180deg,#fef08a,#f59e0b);border-bottom:.6vh solid #b45309;animation:mcUp .8s .25s ease-out both}' +
      '.mc-sub{font-size:clamp(1rem,2.4vw,1.6rem);color:#cbd5e1;animation:mcUp .8s .45s ease-out both}' +
      '@keyframes mcUp{0%{opacity:0;transform:translateY(3vh)}100%{opacity:1;transform:none}}' +
      '.mc-final{display:flex;align-items:center;justify-content:center;gap:3vw;flex-wrap:wrap}' +
      '.mc-photo{width:min(30vh,40vw);height:min(30vh,40vw);border-radius:50%;padding:.9vh;background:conic-gradient(from 0deg,#fde047,#f59e0b,#fef9c3,#f59e0b,#fde047);box-shadow:0 0 5vh rgba(245,158,11,.55);animation:mcPop .9s cubic-bezier(.175,.885,.32,1.275) both}' +
      '.mc-photo.mc-av img{object-fit:contain;background:linear-gradient(160deg,#475569,#1e293b);padding:3%}' +
      '.mc-photo img,.mc-photo div{width:100%;height:100%;border-radius:50%;object-fit:cover;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:5vh}' +
      '.mc-final .mc-mon{width:min(34vh,44vw);height:min(34vh,44vw)}' +
      '.mc-btns{display:flex;gap:1.2vw;flex-wrap:wrap;justify-content:center;margin-top:1vh}' +
      '.mc-btn{font:inherit;font-weight:900;font-size:clamp(.95rem,1.8vw,1.25rem);padding:1.3vh 1.8vw;border-radius:16px;border:0;border-bottom:5px solid rgba(0,0,0,.4);cursor:pointer;color:#fff;background:#2563eb;transition:transform .12s cubic-bezier(.175,.885,.32,1.275)}' +
      '.mc-btn:active{transform:translateY(4px);border-bottom-width:1px}.mc-btn.gold{background:#f59e0b;color:#2b1700}.mc-btn.plain{background:#334155}' +
      '.mc-skip{position:absolute;right:2vw;bottom:2vh;z-index:5;opacity:.6}' +
      '@media (prefers-reduced-motion:reduce){.mc-mon.shake,.mc-mon.pop,.mc-photo{animation:none}}' +
      /* certificate (only visible when printing) */
      '#mc-cert{display:none}' +
      '@media print{@page{size:A4 landscape;margin:0}body>*:not(#mc-cert){display:none!important}#mc-cert{display:flex!important;position:fixed;inset:0;background:#fffdf5;align-items:center;justify-content:center;font-family:Georgia,serif;color:#3b2a0a;-webkit-print-color-adjust:exact;print-color-adjust:exact}}' +
      '.mc-cert-in{width:277mm;height:190mm;border:3mm double #b45309;outline:1mm solid #f59e0b;outline-offset:-6mm;box-sizing:border-box;padding:12mm 16mm;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center;background:radial-gradient(circle at 50% 40%,#fffbea,#fff7d6)}' +
      '.mc-cert-in h1{margin:0;font-size:15mm;letter-spacing:.06em;color:#b45309}.mc-cert-in .k{font-size:5mm;letter-spacing:.3em;text-transform:uppercase;color:#92400e}' +
      '.mc-cert-name{font-size:19mm;font-weight:bold;color:#7c2d12;margin:2mm 0}.mc-cert-row{display:flex;align-items:center;justify-content:center;gap:14mm}' +
      '.mc-cert-photo{width:42mm;height:42mm;border-radius:50%;border:2mm solid #f59e0b;object-fit:cover;background:#fff}.mc-cert-photo.av{object-fit:contain;background:#fff7d6}.mc-cert-mon{width:62mm;height:62mm}.mc-cert-mon svg{width:100%;height:100%}' +
      '.mc-cert-sign{display:flex;justify-content:space-between;width:100%;font-size:5mm}.mc-cert-sign div{border-top:.4mm solid #92400e;padding-top:1.5mm;min-width:70mm}';
    document.head.appendChild(s);
  }

  /* ---------- fireworks ---------- */
  function fireworks(canvas, st) {
    var ctx = canvas.getContext('2d'), P = [], W, H, raf;
    function size() { W = canvas.width = canvas.clientWidth; H = canvas.height = canvas.clientHeight; } size();
    var colors = ['#f59e0b', '#fde047', '#38bdf8', '#10b981', '#f43f5e', '#a855f7', '#ffffff'];
    function burst(x, y) {
      var c = colors[Math.floor(Math.random() * colors.length)], n = 46;
      for (var i = 0; i < n; i++) { var a = (i / n) * Math.PI * 2, v = 2 + Math.random() * 4.2; P.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c: c }); }
      snd.pop();
    }
    function confetti() { for (var i = 0; i < 90; i++) P.push({ x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, l: 3, c: colors[i % 7], conf: true }); }
    function frame() {
      ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
      P = P.filter(function (p) { return p.l > 0 && p.y < H + 20; });
      P.forEach(function (p) { p.x += p.vx; p.y += p.vy; if (!p.conf) { p.vy += 0.05; p.vx *= 0.99; } p.l -= p.conf ? 0.004 : 0.012; ctx.globalAlpha = Math.max(0, Math.min(1, p.l)); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.conf ? 7 : 3, p.conf ? 11 : 3); });
      raf = requestAnimationFrame(frame);
    }
    frame(); st.stopFx = function () { cancelAnimationFrame(raf); };
    return { burst: function () { burst(W * (0.15 + Math.random() * 0.7), H * (0.12 + Math.random() * 0.45)); }, confetti: confetti, size: size };
  }

  /* ---------- the ceremony ---------- */
  function play(o) {
    css(); o = o || {};
    var name = o.name || 'Öykü Çiğdem', key = o.id || name, color = o.color || 'blue', xp = o.xp || 1000, teacher = o.teacher || 'Mr. Maysam';
    var old = document.getElementById('mc-overlay'); if (old) old.remove();
    var st = { timers: [], fast: false, done: false };
    var ov = document.createElement('div'); ov.id = 'mc-overlay';
    ov.innerHTML = '<canvas id="mc-fx"></canvas><div id="mc-flash"></div><div class="mc-wrap" id="mc-wrap"></div><button type="button" class="mc-btn plain mc-skip" id="mc-skip">Skip &raquo;</button>';
    document.body.appendChild(ov);
    var wrap = ov.querySelector('#mc-wrap'), fx = fireworks(ov.querySelector('#mc-fx'), st);
    function close() { st.done = true; st.timers.forEach(clearTimeout); if (st.stopFx) st.stopFx(); try { root.speechSynthesis && root.speechSynthesis.cancel(); } catch (e) { /* ignore */ } ov.remove(); }
    ov.querySelector('#mc-skip').onclick = function () { st.fast = true; };

    (async function () {
      ac();
      // 1. build-up
      wrap.innerHTML = '<div class="mc-line">Something amazing is happening&hellip;</div><div class="mc-mon shake" id="mc-m">' + monster(color, 'growing', 400) + '</div><div class="mc-xp"><span id="mc-n">0</span><small>XP</small></div>';
      snd.hum();
      var n = ov.querySelector('#mc-n'), steps = 40;
      for (var i = 1; i <= steps; i++) { if (st.done) return; n.textContent = Math.round(xp * i / steps).toLocaleString('en-US'); if (i % 2 === 0) snd.tick(i / 2); await sleep(90, st); }
      n.textContent = xp.toLocaleString('en-US');
      await sleep(500, st);
      // 2. the evolution
      snd.boom(); var fl = ov.querySelector('#mc-flash'); fl.classList.add('go');
      await sleep(260, st);
      var m = ov.querySelector('#mc-m'); m.className = 'mc-mon pop glow'; m.innerHTML = monster(color, 'adventurer', 400) + '<span class="mc-ring"></span><span class="mc-ring" style="animation-delay:.25s"></span>';
      m.querySelectorAll('.mc-ring').forEach(function (r) { r.classList.add('go'); });
      ov.querySelector('.mc-line').textContent = 'EVOLUTION!';
      snd.fanfare(); fx.confetti();
      for (var b = 0; b < 7; b++) { await sleep(380, st); if (st.done) return; fx.burst(); }
      speak('Congratulations ' + name + '! You are now an Adventurer!');
      await sleep(900, st);
      // 3. the reveal
      var photo = o.photo || photos.get(key);
      wrap.innerHTML = '<div class="mc-final"><div class="mc-photo' + (isAvatar(photo) ? ' mc-av' : '') + '">' + (photo ? '<img src="' + esc(photo) + '" alt="">' : '<div>&#11088;</div>') + '</div><div class="mc-mon pop glow">' + monster(color, 'adventurer', 400) + '</div></div>' +
        '<div class="mc-name">' + esc(name) + '</div><div class="mc-badge">&#127942; ' + TITLE.toUpperCase() + ' &#127942;</div>' +
        '<div class="mc-sub">Level 5 &bull; ' + xp.toLocaleString('en-US') + ' XP &bull; New gold, star and hero items unlocked in the Monster Studio</div>' +
        '<div class="mc-btns"><button class="mc-btn gold" id="mc-print">&#127891; Print certificate</button><button class="mc-btn" id="mc-photo">&#128247; ' + (photo ? 'Change picture' : 'Add her picture') + '</button><button class="mc-btn plain" id="mc-again">&#8635; Play again</button><button class="mc-btn plain" id="mc-close">Close</button></div>';
      ov.querySelector('.mc-skip').style.display = 'none';
      for (var k = 0; k < 3; k++) { fx.burst(); await sleep(450, st); }
      saveTitle(key);
      ov.querySelector('#mc-close').onclick = close;
      ov.querySelector('#mc-again').onclick = function () { close(); play(o); };
      ov.querySelector('#mc-print').onclick = function () { printCertificate({ name: name, key: key, color: color, xp: xp, teacher: teacher }); };
      ov.querySelector('#mc-photo').onclick = function () { photos.pick(key, function (data, ok) { if (ok === false) { alert('This browser could not save the photo (storage is blocked or full).'); return; } o.photo = data; close(); play(Object.assign({}, o, { photo: data })); }); };
    })();
    return { close: close };
  }

  /* ---------- certificate (prints on A4 landscape) ---------- */
  function printCertificate(o) {
    css(); var photo = photos.get(o.key || o.name);
    var d = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    var old = document.getElementById('mc-cert'); if (old) old.remove();
    var c = document.createElement('div'); c.id = 'mc-cert';
    c.innerHTML = '<div class="mc-cert-in"><div><div class="k">English Adventure Academy</div><h1>Certificate of Achievement</h1></div>' +
      '<div><div style="font-size:6mm">This certificate is proudly awarded to</div><div class="mc-cert-name">' + esc(o.name) + '</div>' +
      '<div style="font-size:7mm;max-width:200mm">for reaching <b>' + (o.xp || 1000).toLocaleString('en-US') + ' XP</b> and evolving into an <b>Adventurer Monster (Level 5)</b>.<br>Her hard work, curiosity and brave English make everyone proud!</div></div>' +
      '<div class="mc-cert-row">' + (photo ? '<img class="mc-cert-photo' + (isAvatar(photo) ? ' av' : '') + '" src="' + esc(photo) + '" alt="">' : '') + '<div class="mc-cert-mon">' + monster(o.color || 'blue', 'adventurer', 300) + '</div><div style="font-size:8mm;font-weight:bold;color:#b45309;max-width:55mm">&#127942; ' + TITLE + '</div></div>' +
      '<div class="mc-cert-sign"><div>' + esc(d) + '</div><div>' + esc(o.teacher || 'Mr. Maysam') + ', Teacher</div></div></div>';
    document.body.appendChild(c);
    // wait until her picture and the monster are fully loaded, or the print can come out without them
    var imgs = Array.prototype.slice.call(c.querySelectorAll('img')), waits = imgs.map(function (im) {
      return im.complete && im.naturalWidth ? Promise.resolve() : new Promise(function (res) { im.onload = im.onerror = res; });
    });
    var timeout = new Promise(function (res) { setTimeout(res, 4000); });
    Promise.race([Promise.all(waits), timeout]).then(function () {
      return Promise.all(imgs.map(function (im) { return im.decode ? im.decode().catch(function () { /* ignore */ }) : null; }));
    }).then(function () {
      setTimeout(function () {
        try { root.print(); }
        finally { setTimeout(function () { c.remove(); }, 1500); }
      }, 300);
    });
  }

  /* ---------- titles and who gets the grand ceremony ---------- */
  function titles() { try { return JSON.parse(get(TITLE_KEY) || '{}'); } catch (e) { return {}; } }
  function saveTitle(key) { var t = titles(); t[slug(key)] = TITLE; set(TITLE_KEY, JSON.stringify(t)); }
  function titleFor(keyOrName) { return titles()[slug(keyOrName)] || ''; }
  function vipNames() { try { var a = JSON.parse(get(VIP_KEY) || 'null'); if (Array.isArray(a)) return a; } catch (e) { /* default */ } return ['öykü çiğdem', 'oyku cigdem']; }
  function isVip(student) {
    var n = String((student && (student.firstName || student.name)) || '').toLowerCase() + ' ' + String((student && student.lastName) || '').toLowerCase();
    return vipNames().some(function (v) { v = String(v).toLowerCase().trim().split(/\s+/)[0]; return v && n.indexOf(v) === 0; });
  }
  function enableFor(names) { set(VIP_KEY, JSON.stringify(names)); }

  /* ---------- starts by itself inside the platform at Level 5 ---------- */
  function install() {
    if (root.__mcInstalled || typeof root.openMonsterLevelUpModal !== 'function') return;
    root.__mcInstalled = true;
    var orig = root.openMonsterLevelUpModal;
    root.openMonsterLevelUpModal = function (studentId, fromLevel, toLevel) {
      try {
        var store = root.store || root.schoolStore, s = store && store.getStudent && store.getStudent(studentId);
        if (s && Number(toLevel) === 5 && isVip(s)) {
          var prof = store.getMonsterProfile ? store.getMonsterProfile(studentId) : null;
          play({ id: s.id, name: ((s.firstName || '') + (s.lastName && String(s.firstName).split(' ').length < 2 ? ' ' + s.lastName : '')).trim(), color: (prof && prof.baseColor) || s.color || 'blue', xp: 1000 });
          return;
        }
      } catch (e) { /* fall back to the normal celebration */ }
      return orig.apply(this, arguments);
    };
  }
  install();
  if (document.readyState !== 'complete') root.addEventListener('load', install);

  /* ---------- the pupil's own picture on profile pages (kept only in this browser) ---------- */
  function pictureOf(student) {
    if (!student) return '';
    var full = ((student.firstName || '') + ' ' + (student.lastName || '')).trim();
    return photos.get(student.id) || photos.get(student.firstName) || photos.get(full) || '';
  }
  function avatarHtml(student, size) {
    var u = pictureOf(student), n = size || 54, id = esc(student && student.id);
    var st = 'width:' + n + 'px;height:' + n + 'px;border-radius:50%;flex:0 0 auto;';
    if (u) {
      var cart = isAvatar(u);
      return '<img src="' + esc(u) + '" alt="" title="Change picture" onclick="MilestoneCeremony.setAvatar(&quot;' + id + '&quot;)" style="' + st + 'object-fit:' + (cart ? 'contain' : 'cover') + ';border:3px solid #f59e0b;background:' + (cart ? '#fff7d6' : '#fff') + ';cursor:pointer;">';
    }
    return '<button type="button" onclick="MilestoneCeremony.setAvatar(&quot;' + id + '&quot;)" title="Add a cartoon picture (kept only in this browser)" style="' + st + 'border:2px dashed #94a3b8;background:transparent;cursor:pointer;font-size:' + Math.round(n / 2.4) + 'px;padding:0;">&#128247;</button>';
  }
  function setAvatar(studentId) {
    photos.pick(studentId, function (data, ok) {
      if (ok === false) { alert('This browser could not save the picture (storage is blocked or full).'); return; }
      if (typeof root.updateHeaderBadges === 'function') { try { root.updateHeaderBadges(); } catch (e) { /* header refresh is optional */ } }
      if (typeof root.openStudentDetail === 'function') root.openStudentDetail(studentId);
    });
  }

  root.MilestoneCeremony = { avatarHtml: avatarHtml, setAvatar: setAvatar, pictureOf: pictureOf, isAvatar: isAvatar, play: play, printCertificate: printCertificate, photos: photos, titleFor: titleFor, enableFor: enableFor, isVip: isVip, TITLE: TITLE, CFG_KEY: CFG_KEY };
})(window);
