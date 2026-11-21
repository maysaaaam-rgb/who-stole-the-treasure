/* English Adventure Academy · Games Collection · Shared Kawaii-Arcade Kit (v2)
   Rich multi-layer foley + musical synthesis, procedural classroom background music,
   confetti & star bursts, mascot team cards with live ± teacher controls, topbar with
   volume & in-game Edit trigger, and Dual-Tab Picture + Question Studio with smart cutout
   and interactive Arrange Stage. Plain JavaScript, zero libraries, 100% offline-ready. */
(function (root) {
  'use strict';
  var doc = root.document;
  var Kit = root.Kit = root.Kit || {};

  /* ---------------- small helpers ---------------- */
  function el(tag, attrs, kids) {
    var n = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.keys(v).forEach(function (sk) { if (sk.slice(0, 2) === '--') n.style.setProperty(sk, v[sk]); else n.style[sk] = v[sk]; });
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (Array.isArray(kids) ? kids : kids != null ? [kids] : []).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === 'string' || typeof c === 'number' ? doc.createTextNode(String(c)) : c);
    });
    return n;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function param(name) { try { return new URLSearchParams(root.location.search).get(name); } catch (e) { return null; } }
  var imgCache = {};
  function loadImg(srcUrl) {
    if (imgCache[srcUrl]) return imgCache[srcUrl];
    imgCache[srcUrl] = new Promise(function (res, rej) {
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () { res(im); };
      im.onerror = function () { delete imgCache[srcUrl]; rej(new Error('image ' + srcUrl)); };
      im.src = srcUrl;
    });
    return imgCache[srcUrl];
  }
  function src(p) { return /^(data:|blob:|https?:|\/)/.test(String(p || '')) ? p : (root.KIT_ROOT || '../') + p; }
  Kit.src = src;
  Kit.el = el; Kit.shuffle = shuffle; Kit.esc = esc; Kit.clamp = clamp; Kit.param = param; Kit.loadImg = loadImg;
  Kit.preview = param('preview') === '1';

  /* ---------------- preferences ---------------- */
  var PKEY = 'eaa_games_prefs';
  var prefs = {};
  try { prefs = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { prefs = {}; }
  Kit.pref = function (k, v) {
    if (arguments.length < 2) return prefs[k];
    prefs[k] = v;
    try { localStorage.setItem(PKEY, JSON.stringify(prefs)); } catch (e) {}
    return v;
  };

  /* ---------------- Rich Multi-Layer Foley & Musical Audio Engine ---------------- */
  var ac = null, master = null, musicGain = null;
  function getVol() { var v = Kit.pref('vol'); return v == null ? 0.8 : clamp(+v, 0, 1); }
  function soundOn() { return Kit.pref('sound') !== false; }
  function musicOn() { return Kit.pref('music') === true; }

  function audio() {
    if (Kit.preview) return null;
    if (!ac) {
      var C = root.AudioContext || root.webkitAudioContext;
      if (!C) return null;
      try {
        ac = new C();
        master = ac.createGain();
        master.gain.value = soundOn() ? getVol() * 0.72 : 0.0001;
        master.connect(ac.destination);
        musicGain = ac.createGain();
        musicGain.gain.value = (soundOn() && musicOn()) ? getVol() * 0.16 : 0.0001;
        musicGain.connect(ac.destination);
      } catch (e) { ac = null; return null; }
    }
    if (ac.state === 'suspended') { try { ac.resume(); } catch (e) {} }
    return ac;
  }

  function syncVolumes() {
    if (!ac) return;
    var now = ac.currentTime;
    var v = getVol();
    master.gain.setTargetAtTime(soundOn() ? Math.max(0.0001, v * 0.72) : 0.0001, now, 0.03);
    musicGain.gain.setTargetAtTime((soundOn() && musicOn()) ? Math.max(0.0001, v * 0.16) : 0.0001, now, 0.06);
  }

  /* Warm marimba / celesta harmonic voice */
  function bell(f, t0, dur, vol, dest, bright) {
    var a = ac; if (!a) return;
    var out = dest || master;
    var o1 = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), g2 = a.createGain();
    o1.type = 'sine';
    o2.type = bright ? 'triangle' : 'sine';
    o1.frequency.setValueAtTime(f, t0);
    o2.frequency.setValueAtTime(f * (bright ? 2 : 3), t0);
    g2.gain.setValueAtTime(bright ? 0.22 : 0.08, t0);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.min(dur * 0.45, 0.18));
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(out);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol || 0.22, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o1.start(t0); o2.start(t0);
    o1.stop(t0 + dur + 0.04); o2.stop(t0 + dur + 0.04);
  }

  /* Pitch-swept synth / percussion voice */
  function sweep(f0, f1, t0, dur, vol, type) {
    var a = ac; if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol || 0.2, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }

  /* Filtered foley noise burst */
  function noise(t0, dur, vol, freq, q, type) {
    var a = ac; if (!a) return;
    var len = Math.max(1, Math.floor(a.sampleRate * dur));
    var buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.4);
    var s = a.createBufferSource(); s.buffer = buf;
    var f = a.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq || 1400; f.Q.value = q || 1.1;
    var g = a.createGain(); g.gain.setValueAtTime(vol || 0.24, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0);
  }

  var SOUNDS = {
    tap: function (t) { sweep(520, 760, t, 0.055, 0.11, 'sine'); noise(t, 0.018, 0.08, 2600, 1.4, 'highpass'); },
    pop: function (t) { sweep(340, 920, t, 0.075, 0.18, 'sine'); bell(1174.66, t + 0.03, 0.16, 0.1, master, true); },
    tilepop: function (t) { sweep(380, 980, t, 0.08, 0.2, 'sine'); bell(783.99, t + 0.02, 0.2, 0.12, master, true); bell(1174.66, t + 0.05, 0.24, 0.1, master, true); },
    correct: function (t) {
      sweep(130.81, 261.63, t, 0.22, 0.12, 'triangle');
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { bell(f, t + i * 0.065, 0.46, 0.19 - i * 0.015, master, true); });
    },
    soft: function (t) { bell(329.63, t, 0.24, 0.15, master, false); bell(261.63, t + 0.13, 0.36, 0.14, master, false); },
    reveal: function (t) {
      noise(t, 0.22, 0.12, 1800, 0.7, 'bandpass');
      [392, 493.88, 587.33, 783.99, 987.77, 1174.66, 1567.98].forEach(function (f, i) { bell(f, t + i * 0.05, 0.55, 0.14, master, true); });
    },
    fanfare: function (t) {
      [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
        bell(f, t + i * 0.11, i >= 5 ? 0.85 : 0.32, 0.21, master, true);
      });
      for (var c = 0; c < 8; c++) noise(t + 0.25 + c * 0.075, 0.06, 0.12, 1500 + (c % 3) * 350, 1.2, 'bandpass');
    },
    tick: function (t) { noise(t, 0.015, 0.1, 3200, 2.2, 'bandpass'); bell(1320, t, 0.05, 0.06); },
    whoosh: function (t) { noise(t, 0.28, 0.2, 950, 0.7, 'bandpass'); sweep(260, 540, t, 0.2, 0.07, 'sine'); },
    /* Instant camera shutter + flash charge + motorized Polaroid slide */
    shutter: function (t) {
      noise(t, 0.02, 0.42, 3400, 1.2, 'highpass');
      noise(t + 0.032, 0.035, 0.34, 1100, 1.4, 'bandpass');
      sweep(1800, 3800, t + 0.04, 0.16, 0.05, 'sine');
      var a = ac;
      var o = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(175, t + 0.08); o.frequency.linearRampToValueAtTime(215, t + 0.34);
      f.type = 'bandpass'; f.frequency.value = 680; f.Q.value = 2.4;
      g.gain.setValueAtTime(0.0001, t + 0.08); g.gain.linearRampToValueAtTime(0.075, t + 0.11); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      o.connect(f); f.connect(g); g.connect(master); o.start(t + 0.08); o.stop(t + 0.4);
    },
    flash: function (t) { SOUNDS.shutter(t); },
    /* Double-door brass latch + resonant wood creak + sparkle */
    creak: function (t) {
      bell(1480, t, 0.06, 0.09);
      var a = ac, o = a.createOscillator(), f1 = a.createBiquadFilter(), g = a.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(148, t + 0.03);
      o.frequency.linearRampToValueAtTime(106, t + 0.26);
      o.frequency.linearRampToValueAtTime(126, t + 0.48);
      f1.type = 'bandpass'; f1.frequency.value = 580; f1.Q.value = 5.5;
      g.gain.setValueAtTime(0.0001, t + 0.03); g.gain.linearRampToValueAtTime(0.08, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.52);
      o.connect(f1); f1.connect(g); g.connect(master); o.start(t + 0.03); o.stop(t + 0.55);
      bell(880, t + 0.14, 0.26, 0.07, master, true);
    },
    /* Toy star mallet thump + brick clatter + sparkle */
    crack: function (t) {
      sweep(190, 52, t, 0.14, 0.28, 'sine');
      noise(t, 0.14, 0.36, 820, 0.9, 'bandpass');
      for (var k = 0; k < 3; k++) {
        noise(t + 0.04 + k * 0.045, 0.055, 0.16, 1200 + k * 380, 1.8, 'bandpass');
      }
      bell(659.25, t + 0.03, 0.18, 0.1, master, true);
    },
    smash: function (t) { SOUNDS.crack(t); bell(987.77, t + 0.08, 0.24, 0.12, master, true); },
    /* Jigsaw woodblock snap + harmonic bell */
    snap: function (t) {
      sweep(720, 310, t, 0.045, 0.22, 'triangle');
      noise(t, 0.03, 0.25, 2100, 1.5, 'bandpass');
      bell(783.99, t + 0.015, 0.22, 0.11, master, true);
      bell(1174.66, t + 0.04, 0.24, 0.09, master, true);
    },
    jigsaw: function (t) { SOUNDS.snap(t); },
    beam: function (t) { bell(587.33, t, 0.3, 0.09, master, false); bell(880, t + 0.06, 0.35, 0.08, master, true); },
    drum: function (t) { for (var i = 0; i < 6; i++) noise(t + i * 0.068, 0.055, 0.18, 420 + i * 40, 1.1, 'bandpass'); },
    /* Time Train: warm two-tone wooden steam whistle (F5 + A5) + airy steam puff */
    whistle: function (t) {
      var a = ac;
      [698.46, 880].forEach(function (f, idx) {
        var o = a.createOscillator(), g = a.createGain();
        o.type = idx === 0 ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(f * 0.96, t);
        o.frequency.linearRampToValueAtTime(f, t + 0.05);
        o.frequency.setValueAtTime(f * 0.97, t + 0.28);
        o.frequency.linearRampToValueAtTime(f, t + 0.33);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.14 - idx * 0.03, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.015, t + 0.24);
        g.gain.linearRampToValueAtTime(0.14 - idx * 0.03, t + 0.31);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.68);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.72);
      });
      noise(t, 0.22, 0.09, 2200, 0.7, 'highpass');
      noise(t + 0.28, 0.32, 0.1, 2200, 0.7, 'highpass');
    },
    /* Time Train: rhythmic 4-puff chugga-chugga */
    chug: function (t) {
      for (var i = 0; i < 4; i++) {
        var ti = t + i * 0.11;
        noise(ti, 0.075, i % 2 === 0 ? 0.2 : 0.13, i % 2 === 0 ? 900 : 1250, 0.9, 'bandpass');
        sweep(140, 75, ti, 0.06, 0.09, 'sine');
      }
    },
    /* Time Train: clockwork rewind spin (saw -> see, went -> go) */
    rewind: function (t) {
      var notes = [987.77, 880, 783.99, 659.25, 587.33, 783.99, 1046.5];
      notes.forEach(function (f, i) {
        bell(f, t + i * 0.052, i === notes.length - 1 ? 0.38 : 0.14, 0.16, master, true);
        if (i < 5) noise(t + i * 0.052, 0.016, 0.1, 3100, 2, 'bandpass');
      });
    },
    /* Time Train: carriage coupling clunk + brass station bell */
    couple: function (t) {
      sweep(240, 82, t, 0.09, 0.24, 'triangle');
      noise(t, 0.045, 0.22, 1100, 1.3, 'bandpass');
      bell(880, t + 0.06, 0.28, 0.15, master, true);
      bell(1318.5, t + 0.11, 0.36, 0.14, master, true);
    }
  };

  Kit.sound = function (name) {
    if (!soundOn() || Kit.preview) return;
    var a = audio(); if (!a || !SOUNDS[name]) return;
    try { SOUNDS[name](a.currentTime + 0.008); } catch (e) {}
  };

  /* ---------------- Cozy Classroom Background Music Synthesizer ---------------- */
  var musicTimer = 0, musicStep = 0, currentMood = 'sunny';
  var MOODS = {
    sunny: {
      tempo: 340,
      notes: [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880, 783.99, 523.25, 659.25, 987.77, 783.99, 659.25, 587.33, 523.25, 0],
      bass:  [261.63, 0, 0, 0, 293.66, 0, 0, 0, 349.23, 0, 0, 0, 392.00, 0, 261.63, 0]
    },
    mystery: {
      tempo: 380,
      notes: [440, 0, 523.25, 0, 659.25, 587.33, 523.25, 0, 392, 0, 493.88, 0, 587.33, 523.25, 440, 0],
      bass:  [220, 0, 329.63, 0, 220, 0, 329.63, 0, 196, 0, 293.66, 0, 220, 0, 0, 0]
    },
    cosmic: {
      tempo: 410,
      notes: [587.33, 783.99, 880, 1174.66, 987.77, 783.99, 659.25, 783.99, 523.25, 659.25, 783.99, 1046.5, 880, 659.25, 587.33, 0],
      bass:  [196, 0, 0, 0, 220, 0, 0, 0, 174.61, 0, 0, 0, 261.63, 0, 0, 0]
    }
  };

  function tickMusic() {
    if (!musicOn() || !soundOn() || Kit.preview || (doc && doc.hidden)) return;
    var a = audio(); if (!a || !musicGain) return;
    var m = MOODS[currentMood] || MOODS.sunny;
    var i = musicStep % m.notes.length;
    musicStep++;
    var now = a.currentTime + 0.02;
    if (m.notes[i]) bell(m.notes[i], now, 0.42, 0.26, musicGain, currentMood === 'cosmic');
    if (m.bass[i]) bell(m.bass[i], now, 0.65, 0.3, musicGain, false);
  }

  Kit.music = {
    start: function (mood) {
      if (mood) currentMood = mood;
      clearInterval(musicTimer);
      if (Kit.preview) return;
      var m = MOODS[currentMood] || MOODS.sunny;
      if (musicOn() && soundOn()) {
        syncVolumes();
        musicTimer = setInterval(tickMusic, m.tempo);
      }
    },
    stop: function () { clearInterval(musicTimer); musicTimer = 0; },
    toggle: function () {
      var next = !musicOn();
      Kit.pref('music', next);
      audio(); syncVolumes();
      if (next) Kit.music.start(currentMood); else Kit.music.stop();
      return next;
    },
    isOn: musicOn
  };

  if (doc) {
    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) Kit.music.stop();
      else if (musicOn()) Kit.music.start(currentMood);
    });
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      doc.addEventListener(ev, function once() {
        audio(); syncVolumes();
        if (musicOn() && !musicTimer) Kit.music.start(currentMood);
        doc.removeEventListener(ev, once);
      }, { passive: true });
    });
  }

  /* ---------------- Speech Synthesis (Calibrated for A1 ESL) ---------------- */
  var voice = null;
  function pickVoice() {
    if (!root.speechSynthesis) return;
    var vs = root.speechSynthesis.getVoices() || [];
    voice = vs.filter(function (v) { return /en-US/i.test(v.lang) && /female|samantha|aria|jenny|zira|google us/i.test(v.name); })[0]
      || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if (root.speechSynthesis) { pickVoice(); root.speechSynthesis.onvoiceschanged = pickVoice; }
  Kit.say = function (text) {
    if (Kit.preview || !text || !root.speechSynthesis || !soundOn()) return;
    try {
      root.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05; u.volume = clamp(getVol() * 1.1, 0.1, 1);
      if (voice) u.voice = voice;
      root.speechSynthesis.speak(u);
    } catch (e) {}
  };

  /* ---------------- Confetti + Star Pops ---------------- */
  var fxc = null, fxx = null, parts = [], fxRun = false;
  var CONF = ['#ff74a6', '#9d7bff', '#3dd6a8', '#56b8ff', '#ffd15c', '#ff9b73'];
  function fxLoop() {
    fxx.clearRect(0, 0, fxc.width, fxc.height);
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) {
      p.vy += 0.3; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      fxx.save(); fxx.translate(p.x, p.y); fxx.rotate(p.r); fxx.globalAlpha = Math.min(1, p.life / 28);
      fxx.fillStyle = p.c;
      if (p.s === 0) {
        fxx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else if (p.s === 1) {
        fxx.beginPath(); fxx.arc(0, 0, p.w / 2, 0, 6.283); fxx.fill();
      } else {
        /* 4-point kawaii sparkle star */
        var R = p.w * 0.7, r = R * 0.35;
        fxx.beginPath();
        for (var k = 0; k < 8; k++) {
          var rad = k % 2 ? r : R, ang = k * Math.PI / 4;
          if (k === 0) fxx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          else fxx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
        }
        fxx.closePath(); fxx.fill();
      }
      fxx.restore();
    });
    if (parts.length) root.requestAnimationFrame(fxLoop); else { fxRun = false; fxx.clearRect(0, 0, fxc.width, fxc.height); }
  }
  Kit.confetti = function (x, y, n) {
    if (Kit.preview && n > 36) n = 36;
    if (!fxc) { fxc = el('canvas', { class: 'fx-canvas' }); doc.body.appendChild(fxc); fxx = fxc.getContext('2d'); }
    fxc.width = root.innerWidth; fxc.height = root.innerHeight;
    if (x == null) { x = root.innerWidth / 2; y = root.innerHeight / 3; }
    for (var i = 0; i < (n || 90); i++) {
      var a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9.5;
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6.5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.28, w: 7 + Math.random() * 9, h: 5 + Math.random() * 6, c: CONF[i % CONF.length], s: i % 3, life: 68 + Math.random() * 52 });
    }
    if (!fxRun) { fxRun = true; root.requestAnimationFrame(fxLoop); }
  };
  Kit.popText = function (x, y, text) {
    var p = el('div', { class: 'pop-pts', text: text, style: { left: x + 'px', top: y + 'px' } });
    doc.body.appendChild(p); setTimeout(function () { p.remove(); }, 1150);
  };
  Kit.centerOf = function (node) { var r = node.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  /* ---------------- Modal + Toast ---------------- */
  Kit.modal = function (o) {
    return new Promise(function (resolve) {
      var wrap = el('div', { class: 'modal-wrap' });
      var box = el('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' });
      if (o.title) box.appendChild(el('h3', { text: o.title }));
      if (o.body) box.appendChild(typeof o.body === 'string' ? el('div', { html: o.body }) : o.body);
      var row = el('div', { class: 'row' });
      (o.buttons || [{ label: 'OK', value: true }]).forEach(function (b) {
        row.appendChild(el('button', { type: 'button', class: 'btn ' + (b.cls || ''), text: b.label, onclick: function () { close(b.value); } }));
      });
      box.appendChild(row); wrap.appendChild(box); doc.body.appendChild(wrap);
      function close(v) { wrap.remove(); doc.removeEventListener('keydown', onKey, true); resolve(v); }
      function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(o.cancelValue == null ? false : o.cancelValue); } }
      doc.addEventListener('keydown', onKey, true);
      wrap.addEventListener('click', function (e) { if (e.target === wrap && o.dismiss !== false) close(o.cancelValue == null ? false : o.cancelValue); });
    });
  };
  Kit.toast = function (msg, ms) {
    var t = el('div', { class: 'toast', text: msg }); doc.body.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 2200);
  };

  /* ---------------- Top Bar (Edit Pill + Music + Sound/Volume + Big Text + Present) ---------------- */
  Kit.topbar = function (o) {
    o = o || {};
    if (Kit.preview) return null;
    var existing = doc.querySelector('.topbar');
    if (existing) existing.remove();
    var big = !!Kit.pref('big'); doc.body.classList.toggle('big', big);
    var bar = el('header', { class: 'topbar' });
    var isSubGame = !o.home || o.home === '../index.html' || o.home === 'index.html';
    var homeHref = isSubGame ? ((root.KIT_ROOT || '../../') + 'game-maker/index.html') : o.home;
    var homeLbl  = isSubGame ? '🎮 All Games' : (o.homeLabel || 'Games');
    bar.appendChild(el('a', { class: 'brand', href: homeHref, title: 'Back to All Games' }, [
      el('i', { text: '🎮' }),
      el('span', null, [el('small', { text: 'Adventure Academy' }), homeLbl])
    ]));
    bar.appendChild(el('div', { class: 'grow' }, o.title ? el('div', { class: 'title', text: o.title }) : null));
    (o.extra || []).forEach(function (n) { if (n) bar.appendChild(n); });

    if (typeof o.onEdit === 'function') {
      bar.appendChild(el('button', {
        type: 'button',
        class: 'btn lilac sm topbar-edit-btn',
        text: o.editLabel || '✎ Edit game',
        title: 'Customize pictures or questions',
        onclick: function () { Kit.sound('tap'); o.onEdit(); }
      }));
    }

    var musBtn = el('button', {
      type: 'button',
      class: 'icon-btn' + (musicOn() ? ' on' : ''),
      title: 'Background music on / off',
      text: '🎵'
    });
    musBtn.addEventListener('click', function () {
      var onNow = Kit.music.toggle();
      musBtn.classList.toggle('on', onNow);
      Kit.toast(onNow ? '🎵 Classroom music on' : '🎵 Music off', 1200);
    });

    var volWrap = el('div', { class: 'vol-wrap' });
    var snd = el('button', {
      type: 'button',
      class: 'icon-btn' + (soundOn() ? '' : ' muted-on'),
      title: 'Sound & volume (M to mute)',
      text: soundOn() ? '🔊' : '🔇'
    });
    var volPop = el('div', { class: 'vol-pop hidden' });
    var volRange = el('input', { type: 'range', min: 0, max: 100, value: Math.round(getVol() * 100), 'aria-label': 'Volume' });
    var muteToggle = el('button', { type: 'button', class: 'chip sm', text: soundOn() ? 'Mute' : 'Unmute' });
    function refreshSndUi() {
      snd.textContent = soundOn() ? '🔊' : '🔇';
      snd.classList.toggle('muted-on', !soundOn());
      muteToggle.textContent = soundOn() ? 'Mute' : 'Unmute';
    }
    volRange.addEventListener('input', function () {
      var v = (+volRange.value) / 100;
      Kit.pref('vol', v);
      if (v > 0 && !soundOn()) Kit.pref('sound', true);
      audio(); syncVolumes(); refreshSndUi();
    });
    muteToggle.addEventListener('click', function () {
      Kit.pref('sound', !soundOn());
      if (!soundOn() && root.speechSynthesis) root.speechSynthesis.cancel();
      audio(); syncVolumes(); refreshSndUi();
    });
    volPop.appendChild(el('span', { text: '🔊' }));
    volPop.appendChild(volRange);
    volPop.appendChild(muteToggle);
    snd.addEventListener('click', function (ev) {
      ev.stopPropagation();
      volPop.classList.toggle('hidden');
    });
    doc.addEventListener('click', function (ev) {
      if (!volWrap.contains(ev.target)) volPop.classList.add('hidden');
    });
    volWrap.appendChild(snd);
    volWrap.appendChild(volPop);

    var bt = el('button', { type: 'button', class: 'icon-btn' + (big ? ' on' : ''), title: 'Big classroom text (B)', text: 'A+' });
    bt.addEventListener('click', function () {
      big = !big; Kit.pref('big', big); doc.body.classList.toggle('big', big); bt.classList.toggle('on', big);
      if (o.onResize) o.onResize();
    });
    var canFs = !!(doc.documentElement.requestFullscreen || doc.documentElement.webkitRequestFullscreen);
    var fs = el('button', { type: 'button', class: 'icon-btn', title: 'Present full screen (F)', text: '⛶' });
    if (!canFs) fs.style.display = 'none';
    fs.addEventListener('click', Kit.fullscreen);

    bar.appendChild(musBtn);
    bar.appendChild(volWrap);
    bar.appendChild(bt);
    bar.appendChild(fs);
    doc.body.appendChild(bar);

    Kit.permKeys({
      m: function () { muteToggle.click(); },
      b: function () { bt.click(); },
      f: Kit.fullscreen
    });
    return bar;
  };

  Kit.fullscreen = function () {
    try {
      var d = doc.documentElement;
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        var req = d.requestFullscreen || d.webkitRequestFullscreen;
        if (req) { var p = req.call(d); if (p && p.catch) p.catch(function () {}); }
      } else {
        var ex = doc.exitFullscreen || doc.webkitExitFullscreen;
        if (ex) { var p2 = ex.call(doc); if (p2 && p2.catch) p2.catch(function () {}); }
      }
    } catch (e) {}
  };

  /* ---------------- Keyboard ---------------- */
  var perm = {}, keymap = {}, overlays = [];
  Kit.keys = function (map) { Object.keys(map).forEach(function (k) { keymap[k.toLowerCase()] = map[k]; }); };
  Kit.permKeys = function (map) { Object.keys(map).forEach(function (k) { perm[k.toLowerCase()] = map[k]; }); };
  Kit.clearKeys = function (list) { (list || Object.keys(keymap)).forEach(function (k) { delete keymap[k]; }); };
  Kit.overlayKeys = function (map) {
    var layer = {}; Object.keys(map).forEach(function (k) { layer[k.toLowerCase()] = map[k]; }); overlays.push(layer);
    return function pop() { var i = overlays.indexOf(layer); if (i >= 0) overlays.splice(i, 1); };
  };
  function findKey(k) {
    for (var i = overlays.length - 1; i >= 0; i--) if (overlays[i][k]) return overlays[i][k];
    return keymap[k] || perm[k] || null;
  }
  doc.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (doc.querySelector('.modal-wrap') || doc.querySelector('.studio-wrap')) return;
    var k = e.key === ' ' ? 'space' : String(e.key).toLowerCase();
    var fn = findKey(k);
    if (fn) { e.preventDefault(); fn(e); }
  });

  /* ---------------- Kawaii Mascot Teams ---------------- */
  var MASCOT_BASE = 'assets/games/mascots/';
  var TEAM_LOOK = [
    { id: 'bunny', name: 'Bunny', c: '#ff74a6', bg: '#fff0f6', e: '🐰', img: MASCOT_BASE + 'bunny.webp' },
    { id: 'kitty', name: 'Kitty', c: '#ff9b6a', bg: '#fff4ed', e: '🐱', img: MASCOT_BASE + 'kitty.webp' },
    { id: 'bear',  name: 'Bear',  c: '#c98a5b', bg: '#fdf5ee', e: '🐻', img: MASCOT_BASE + 'bear.webp' },
    { id: 'ducky', name: 'Ducky', c: '#f0b429', bg: '#fffbeb', e: '🐥', img: MASCOT_BASE + 'ducky.webp' },
    { id: 'frog',  name: 'Froggy', c: '#2ec49b', bg: '#ecfdf7', e: '🐸', img: MASCOT_BASE + 'frog.webp' },
    { id: 'fox',   name: 'Foxy',  c: '#9d7bff', bg: '#f5f0ff', e: '🦊', img: MASCOT_BASE + 'fox.webp' }
  ];
  Kit.TEAM_LOOK = TEAM_LOOK;

  Kit.mascotBadge = function (team, sizePx) {
    var sz = sizePx || 40;
    var wrap = el('span', {
      class: 'mascot-dot',
      style: { width: sz + 'px', height: sz + 'px', '--tc': team.color || '#ff74a6' }
    });
    if (team.mascotImg || team.img) {
      var im = el('img', { src: src(team.mascotImg || team.img), alt: '', loading: 'eager' });
      im.onerror = function () { wrap.innerHTML = ''; wrap.textContent = team.emoji || '⭐'; };
      wrap.appendChild(im);
    } else {
      wrap.textContent = team.emoji || '⭐';
    }
    return wrap;
  };

  Kit.makeTeams = function (n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var lk = TEAM_LOOK[i % TEAM_LOOK.length];
      out.push({ name: lk.name, color: lk.c, bg: lk.bg, emoji: lk.e, mascotImg: lk.img, lookIdx: i % TEAM_LOOK.length, score: 0 });
    }
    return out;
  };

  Kit.renderTeams = function (box, teams, opts) {
    opts = opts || {};
    box.innerHTML = '';
    box.classList.add('teams');
    teams.forEach(function (t, i) {
      var ptsEl = el('span', { class: 'pts', text: String(t.score) });
      var steppers = opts.controls === false ? null : el('span', { class: 't-steps' }, [
        el('button', { type: 'button', class: 't-step', title: '−5 points', text: '−', onclick: function (ev) { ev.stopPropagation(); t.score = Math.max(0, t.score - 5); ptsEl.textContent = String(t.score); Kit.sound('tap'); } }),
        el('button', { type: 'button', class: 't-step', title: '+5 points', text: '＋', onclick: function (ev) { ev.stopPropagation(); Kit.award(box, teams, i, 5); } })
      ]);
      var n = el('div', { class: 'team' + (opts.turn === i ? ' now' : ''), style: { '--tc': t.color }, 'data-i': i }, [
        Kit.mascotBadge(t, 38),
        el('span', { class: 't-info' }, [el('span', { class: 't-name', text: t.name })]),
        ptsEl,
        steppers
      ]);
      if (opts.onPick) { n.style.cursor = 'pointer'; n.addEventListener('click', function () { opts.onPick(i, n); }); }
      box.appendChild(n);
    });
  };

  Kit.award = function (box, teams, i, pts) {
    var t = teams[i]; if (!t) return;
    t.score = Math.max(0, t.score + pts);
    var node = box && box.querySelector ? box.querySelector('[data-i="' + i + '"]') : null;
    if (node) {
      var ptsNode = node.querySelector('.pts');
      if (ptsNode) ptsNode.textContent = String(t.score);
      node.classList.remove('bump'); void node.offsetWidth; node.classList.add('bump');
      var c = Kit.centerOf(node);
      Kit.popText(c.x, c.y - 10, (pts > 0 ? '+' : '') + pts);
      if (pts > 0) Kit.confetti(c.x, c.y, 44);
    }
    Kit.sound(pts >= 0 ? 'correct' : 'soft');
  };

  /* ---------------- Picture, Question & Sentence Sets (IndexedDB v3) ---------------- */
  var DB = 'eaa-games', STORE = 'sets', QSTORE = 'qsets', SSTORE = 'ssets', dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      if (!root.indexedDB) return rej(new Error('no indexedDB'));
      var r = root.indexedDB.open(DB, 3);
      r.onupgradeneeded = function () {
        var d = r.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' });
        if (!d.objectStoreNames.contains(QSTORE)) d.createObjectStore(QSTORE, { keyPath: 'id' });
        if (!d.objectStoreNames.contains(SSTORE)) d.createObjectStore(SSTORE, { keyPath: 'id' });
      };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return dbp;
  }
  function dbTx(storeName, mode, fn) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var t = d.transaction(storeName, mode), s = t.objectStore(storeName), out = fn(s);
        t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function tx(mode, fn) { return dbTx(STORE, mode, fn); }
  Kit.dbTx = dbTx;

  Kit.sets = {
    builtIn: function () { return (root.KIT_PACKS || []).map(function (p) { return Object.assign({ builtIn: true }, p); }); },
    mine: function () { return tx('readonly', function (s) { return s.getAll(); }).then(function (r) { return (r || []).sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); }); }).catch(function () { return []; }); },
    all: function () { var b = Kit.sets.builtIn(); return Kit.sets.mine().then(function (m) { return m.concat(b); }); },
    get: function (id) { return Kit.sets.all().then(function (all) { return Kit.matchPack(all, id); }); },
    save: function (set) { set.updated = Date.now(); delete set.builtIn; return tx('readwrite', function (s) { s.put(set); }); },
    remove: function (id) { return tx('readwrite', function (s) { s.delete(id); }); }
  };

  /* Match exact pack id first; if a Game Maker question-set id (e.g. g4-u5-mega, u3-g3-weather) is passed,
     smartly pick the closest Grade + Unit picture/sentence pack so Step 1 -> Step 2 handoff always feels magical! */
  Kit.matchPack = function (list, hintId) {
    if (!Array.isArray(list) || !list.length) return null;
    if (!hintId) return list[0];
    var h = String(hintId).toLowerCase();
    var exact = list.filter(function (s) { return s && String(s.id).toLowerCase() === h; })[0];
    if (exact) return exact;
    var g = /g4|-4\b|grade-?4/.test(h) ? '4' : (/g3|-3\b|grade-?3/.test(h) ? '3' : '');
    var uMatch = /u([1-5])\b|unit-?([1-5])/.exec(h);
    var u = uMatch ? (uMatch[1] || uMatch[2]) : '';
    if (g && u) {
      var gu = list.filter(function (s) {
        var sid = String(s.id + ' ' + (s.sub || '') + ' ' + (s.name || '')).toLowerCase();
        return (String(s.grade || '') === g || sid.indexOf('g' + g) >= 0 || sid.indexOf('grade ' + g) >= 0) &&
               (String(s.unit || '') === u || sid.indexOf('u' + u) >= 0 || sid.indexOf('unit ' + u) >= 0);
      })[0];
      if (gu) return gu;
    }
    if (g) {
      var gOnly = list.filter(function (s) {
        var sid = String(s.id + ' ' + (s.sub || '') + ' ' + (s.name || '')).toLowerCase();
        return String(s.grade || '') === g || sid.indexOf('g' + g) >= 0 || sid.indexOf('grade ' + g) >= 0;
      })[0];
      if (gOnly) return gOnly;
    }
    return list[0];
  };

  /* Smart corner flood-fill cutout (preserves inner colors!) */
  function autoCutCanvas(c) {
    var w = c.width, h = c.height;
    if (w < 8 || h < 8) return;
    var ctx = c.getContext('2d');
    var imgData = ctx.getImageData(0, 0, w, h);
    var d = imgData.data;
    var corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
    for (var ci = 0; ci < corners.length; ci++) { if (d[corners[ci] + 3] < 210) return; }
    var r0 = 0, g0 = 0, b0 = 0;
    for (var cj = 0; cj < corners.length; cj++) { r0 += d[corners[cj]]; g0 += d[corners[cj] + 1]; b0 += d[corners[cj] + 2]; }
    r0 /= 4; g0 /= 4; b0 /= 4;
    var agree = 0;
    for (var ck = 0; ck < corners.length; ck++) {
      var dr0 = d[corners[ck]] - r0, dg0 = d[corners[ck] + 1] - g0, db0 = d[corners[ck] + 2] - b0;
      if (Math.sqrt(dr0 * dr0 + dg0 * dg0 + db0 * db0) < 36) agree++;
    }
    if (agree < 3) return;
    var tolSq = 40 * 40;
    var seen = new Uint8Array(w * h), q = new Int32Array(w * h), head = 0, tail = 0;
    function tryPush(px, py) {
      var idx = py * w + px;
      if (seen[idx]) return;
      var o = idx * 4;
      var dr = d[o] - r0, dg = d[o + 1] - g0, db2 = d[o + 2] - b0;
      if (dr * dr + dg * dg + db2 * db2 <= tolSq) { seen[idx] = 1; q[tail++] = idx; }
    }
    for (var x = 0; x < w; x++) { tryPush(x, 0); tryPush(x, h - 1); }
    for (var y = 1; y < h - 1; y++) { tryPush(0, y); tryPush(w - 1, y); }
    while (head < tail) {
      var cur = q[head++];
      d[cur * 4 + 3] = 0;
      var cx = cur % w, cy = (cur - cx) / w;
      if (cx > 0) tryPush(cx - 1, cy);
      if (cx < w - 1) tryPush(cx + 1, cy);
      if (cy > 0) tryPush(cx, cy - 1);
      if (cy < h - 1) tryPush(cx, cy + 1);
    }
    for (var py2 = 1; py2 < h - 1; py2++) {
      for (var px2 = 1; px2 < w - 1; px2++) {
        var id2 = py2 * w + px2;
        if (!seen[id2] && (seen[id2 - 1] || seen[id2 + 1] || seen[id2 - w] || seen[id2 + w])) {
          d[id2 * 4 + 3] = Math.min(d[id2 * 4 + 3], 180);
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function cutExistingImageUrl(imgSrc) {
    return loadImg(src(imgSrc)).then(function (im) {
      var m = 720, sc = Math.min(1, m / Math.max(im.width, im.height));
      var c = doc.createElement('canvas'); c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      autoCutCanvas(c);
      var u = c.toDataURL('image/webp', 0.88); if (u.indexOf('data:image/webp') !== 0) u = c.toDataURL('image/png');
      return u;
    });
  }

  function fileToPicture(file, autoCut) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          var m = 720, sc = Math.min(1, m / Math.max(im.width, im.height));
          var c = doc.createElement('canvas'); c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          if (autoCut) { try { autoCutCanvas(c); } catch (e) {} }
          var u = c.toDataURL('image/webp', 0.88); if (u.indexOf('data:image/webp') !== 0) u = c.toDataURL('image/png');
          res(u);
        };
        im.onerror = rej; im.src = fr.result;
      };
      fr.onerror = rej; fr.readAsDataURL(file);
    });
  }
  Kit.fileToPicture = fileToPicture;
  function wordFromFile(name) { return String(name || '').replace(/\.[a-z0-9]+$/i, '').replace(/[_\-]+/g, ' ').replace(/\d+/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }

  /* ---------------- Interactive "Arrange Pictures" Modal (for Flashlight / Scene layout) ---------------- */
  function openArrangeModal(curSet, onSaveSet) {
    var stage = el('div', { class: 'arrange-stage' });
    var cards = curSet.cards || [];
    var cols = Math.max(2, Math.ceil(Math.sqrt(cards.length * 1.4)));
    var rows = Math.max(1, Math.ceil(cards.length / cols));

    cards.forEach(function (card, idx) {
      if (card.ax == null || card.ay == null) {
        var col = idx % cols, row = Math.floor(idx / cols);
        card.ax = +((col + 0.5) / cols).toFixed(3);
        card.ay = +(0.18 + ((row + 0.5) / rows) * 0.72).toFixed(3);
      }
      if (!card.asc) card.asc = 1;

      var item = el('div', {
        class: 'arrange-item',
        style: { left: (card.ax * 100) + '%', top: (card.ay * 100) + '%', '--asc': card.asc }
      }, [
        el('img', { src: src(card.img), alt: card.w, draggable: 'false' }),
        el('span', { text: card.w }),
        el('div', { class: 'arrange-zoom' }, [
          el('button', { type: 'button', text: '−', onclick: function (e) { e.stopPropagation(); card.asc = clamp((card.asc || 1) - 0.15, 0.55, 1.8); item.style.setProperty('--asc', card.asc); } }),
          el('button', { type: 'button', text: '＋', onclick: function (e) { e.stopPropagation(); card.asc = clamp((card.asc || 1) + 0.15, 0.55, 1.8); item.style.setProperty('--asc', card.asc); } })
        ])
      ]);

      var dragging = false;
      item.addEventListener('pointerdown', function (e) {
        if (e.target.tagName === 'BUTTON') return;
        dragging = true;
        item.setPointerCapture(e.pointerId);
        item.classList.add('dragging');
      });
      item.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var r = stage.getBoundingClientRect();
        card.ax = +clamp((e.clientX - r.left) / r.width, 0.08, 0.92).toFixed(3);
        card.ay = +clamp((e.clientY - r.top) / r.height, 0.14, 0.88).toFixed(3);
        item.style.left = (card.ax * 100) + '%';
        item.style.top = (card.ay * 100) + '%';
      });
      item.addEventListener('pointerup', function () { dragging = false; item.classList.remove('dragging'); });
      stage.appendChild(item);
    });

    Kit.modal({
      title: '↔ Arrange Pictures on Stage',
      body: el('div', null, [
        el('p', { class: 'muted', style: { marginTop: '0' }, text: 'Drag any picture to place where it hides in Flashlight Finder. Use − / ＋ to resize.' }),
        stage
      ]),
      buttons: [
        { label: 'Reset positions', cls: 'soft', value: 'reset' },
        { label: 'Save layout ✓', cls: 'mint', value: 'save' }
      ]
    }).then(function (act) {
      if (act === 'reset') {
        cards.forEach(function (c) { delete c.ax; delete c.ay; delete c.asc; });
        onSaveSet();
      } else if (act === 'save') {
        onSaveSet();
      }
    });
  }

  /* ---------------- Tri-Tab Studio: Pictures, Questions & Sentences ---------------- */
  Kit.studio = function (startIdOrOpts, onDone) {
    var initOpts = (startIdOrOpts && typeof startIdOrOpts === 'object') ? startIdOrOpts : { tab: 'pictures', setId: startIdOrOpts };
    var wrap = el('div', { class: 'studio-wrap' });
    var panel = el('div', { class: 'studio' });
    wrap.appendChild(panel); doc.body.appendChild(wrap);

    var startTab = (initOpts.tab === 'questions' && Kit.questions) ? 'questions'
      : (initOpts.tab === 'sentences' && Kit.sentences) ? 'sentences'
      : 'pictures';

    var state = {
      tab: startTab,
      callerTab: initOpts.tab || 'pictures',
      sets: [], cur: null, dirty: false, autoCut: true, picFilter: 'All',
      qsets: [], curQ: null, qDirty: false, qFilter: 'All', qSearch: '', qLoading: false,
      ssets: [], curS: null, sDirty: false
    };

    function flushPendingSave() {
      var p1 = (state.dirty && state.cur && !state.cur.builtIn) ? savePicSet(true) : Promise.resolve();
      var p2 = (state.qDirty && state.curQ && !state.curQ.builtIn && Kit.questions) ? saveQSet(true) : Promise.resolve();
      var p3 = (state.sDirty && state.curS && !state.curS.builtIn && Kit.sentences) ? saveSSet(true) : Promise.resolve();
      return Promise.all([p1, p2, p3]);
    }

    function close() {
      flushPendingSave().then(function () {
        wrap.remove();
        if (onDone) {
          if (state.callerTab === 'questions') onDone(state.curQ && state.curQ.id);
          else if (state.callerTab === 'sentences') onDone(state.curS && state.curS.id);
          else onDone(state.cur && state.cur.id, state.curQ && state.curQ.id);
        }
      });
    }

    function onEsc(e) { if (e.key === 'Escape' && !doc.querySelector('.modal-wrap')) { e.stopPropagation(); close(); } }
    doc.addEventListener('keydown', onEsc);
    var origRemove = wrap.remove.bind(wrap);
    wrap.remove = function () { doc.removeEventListener('keydown', onEsc); origRemove(); };

    function loadPics(selectId) {
      return Kit.sets.all().then(function (all) {
        state.sets = all;
        var target = all.filter(function (s) { return s.id === selectId; })[0] || (state.cur && all.filter(function (s) { return s.id === state.cur.id; })[0]) || all[0];
        state.cur = target ? JSON.parse(JSON.stringify(target)) : null;
        state.dirty = false;
        draw();
      });
    }

    function loadQs(selectId) {
      if (!Kit.questions) return Promise.resolve();
      state.qLoading = true;
      draw();
      return Kit.questions.all().then(function (all) {
        state.qLoading = false;
        state.qsets = all;
        var target = all.filter(function (s) { return s.id === selectId; })[0] || (state.curQ && all.filter(function (s) { return s.id === state.curQ.id; })[0]) || all[0];
        state.curQ = target ? JSON.parse(JSON.stringify(target)) : null;
        state.qDirty = false;
        draw();
      });
    }

    function loadSs(selectId) {
      if (!Kit.sentences) return Promise.resolve();
      return Kit.sentences.all().then(function (all) {
        state.ssets = all;
        var target = all.filter(function (s) { return s.id === selectId; })[0] || (state.curS && all.filter(function (s) { return s.id === state.curS.id; })[0]) || all[0];
        state.curS = target ? JSON.parse(JSON.stringify(target)) : null;
        state.sDirty = false;
        draw();
      });
    }

    function savePicSet(silent) {
      if (!state.cur || state.cur.builtIn) return Promise.resolve();
      state.cur.cards = state.cur.cards.filter(function (c) { return c.img; });
      return Kit.sets.save(state.cur).then(function () {
        state.dirty = false;
        if (!silent) { Kit.toast('Pictures saved ✓', 1200); return loadPics(state.cur.id); }
      });
    }

    function saveQSet(silent) {
      if (!state.curQ || state.curQ.builtIn || !Kit.questions) return Promise.resolve();
      state.curQ.items = (state.curQ.items || []).filter(function (it) { return it && String(it.q || '').trim() && String(it.a || '').trim(); });
      return Kit.questions.save(state.curQ).then(function () {
        state.qDirty = false;
        if (!silent) { Kit.toast('Questions saved ✓', 1200); return loadQs(state.curQ.id); }
      });
    }

    function saveSSet(silent) {
      if (!state.curS || state.curS.builtIn || !Kit.sentences) return Promise.resolve();
      state.curS.items = (state.curS.items || []).map(Kit.sentences.normalize).filter(Boolean);
      return Kit.sentences.save(state.curS).then(function () {
        state.sDirty = false;
        if (!silent) { Kit.toast('Sentences saved ✓', 1200); return loadSs(state.curS.id); }
      });
    }

    function copyPicSet(srcSet) {
      var s = {
        id: 'my-' + Date.now().toString(36),
        name: srcSet ? srcSet.name + ' (my copy)' : 'My new picture set',
        sub: srcSet ? (srcSet.sub || 'My pictures') : 'My pictures',
        grade: srcSet ? (srcSet.grade || 'All') : 'All',
        e: srcSet ? (srcSet.e || '⭐') : '⭐',
        cards: srcSet ? JSON.parse(JSON.stringify(srcSet.cards)) : []
      };
      return Kit.sets.save(s).then(function () { state.picFilter = 'All'; return loadPics(s.id); });
    }

    function copyQSet(srcPack) {
      var s = {
        id: 'myq-' + Date.now().toString(36),
        name: srcPack ? srcPack.name + ' (my copy)' : 'My new question pack',
        sub: srcPack ? (srcPack.sub || 'Custom questions') : 'Custom questions',
        grade: srcPack ? (srcPack.grade || 'All') : 'All',
        unit: srcPack ? (srcPack.unit || '') : '',
        e: srcPack ? (srcPack.e || '❓') : '❓',
        items: srcPack ? JSON.parse(JSON.stringify(srcPack.items)) : [
          { q: 'What is this?', a: 'answer', w: ['wrong 1', 'wrong 2', 'wrong 3'], pic: '🌟', grade: 'All', unit: '', skill: 'Words' }
        ]
      };
      return Kit.questions.save(s).then(function () { state.qFilter = 'All'; return loadQs(s.id); });
    }

    function copySSet(srcPack) {
      var s = {
        id: 'mys-' + Date.now().toString(36),
        name: srcPack ? srcPack.name + ' (my copy)' : 'My Time Train Sentences',
        sub: srcPack ? (srcPack.sub || 'Custom past-tense sentences') : 'Custom past-tense sentences',
        grade: srcPack ? (srcPack.grade || 'All') : 'All',
        e: srcPack ? (srcPack.e || '🚂') : '🚂',
        items: srcPack ? JSON.parse(JSON.stringify(srcPack.items)) : [
          { when: 'Yesterday', subj: 'Jannah', pron: 'she', base: 'open', past: 'opened', rest: 'the special book', pic: '📘', ansYes: true }
        ]
      };
      return Kit.sentences.save(s).then(function () { return loadSs(s.id); });
    }

    function openSPasteModal(curS) {
      var ta = el('textarea', {
        class: 'input studio-paste-ta',
        rows: 7,
        placeholder: 'Paste rows from Excel, Google Sheets, or CSV:\nWhen\tSubject\tBase verb\tPast verb\tRest of sentence\tYes/No\nYesterday\tJannah\topen\topened\tthe special book\tyes\nIn 1977\tVoyager 1\tgo\twent\tinto space\tyes'
      });
      Kit.modal({
        title: '📋 Paste Time Train Sentences',
        body: el('div', null, [
          el('p', { class: 'muted', style: { marginTop: '0' }, text: 'Columns: When · Subject · Base verb · Past verb · Rest of sentence · Yes/No (optional).' }),
          ta
        ]),
        buttons: [
          { label: 'Cancel', cls: 'soft', value: false },
          { label: '＋ Import sentences', cls: 'mint', value: true }
        ]
      }).then(function (ok) {
        if (!ok) return;
        var parsed = Kit.sentences.parseTabular(ta.value);
        if (!parsed.length) { Kit.toast('No valid sentence rows found'); return; }
        curS.items = (curS.items || []).concat(parsed);
        saveSSet(false);
        Kit.toast('Added ' + parsed.length + ' sentences ✓');
      });
    }

    function openPasteModal(curQ) {
      var ta = el('textarea', {
        class: 'input studio-paste-ta',
        rows: 7,
        placeholder: 'Paste rows from Excel, Google Sheets, or CSV:\nQuestion\tRight answer\tWrong 1\tWrong 2\tWrong 3\nYesterday she ____ a book.\topened\topens\topening\topen\nSay a sentence with "have to"!\tI have to clean my room.\t\t\t'
      });
      Kit.modal({
        title: '📋 Paste from Excel / Google Sheets',
        body: el('div', null, [
          el('p', { class: 'muted', style: { marginTop: '0' }, text: 'Columns: Question · Right answer · Wrong 1 · Wrong 2 · Wrong 3 (leave Wrong 1–3 empty for an open Speaking card).' }),
          ta
        ]),
        buttons: [
          { label: 'Cancel', cls: 'soft', value: false },
          { label: '＋ Import rows', cls: 'mint', value: true }
        ]
      }).then(function (ok) {
        if (!ok) return;
        var parsed = Kit.questions.parseTabular(ta.value, curQ.grade, curQ.unit);
        if (!parsed.length) { Kit.toast('No valid Question + Answer rows found'); return; }
        curQ.items = (curQ.items || []).concat(parsed);
        saveQSet(false);
        Kit.toast('Added ' + parsed.length + ' questions ✓');
      });
    }

    function draw() {
      panel.innerHTML = '';
      var isQ = state.tab === 'questions' && Kit.questions;
      var isS = state.tab === 'sentences' && Kit.sentences;

      var side = el('aside', { class: 'studio-side' });
      side.appendChild(el('div', { class: 'studio-h' }, [
        el('b', { text: '🎨 Make It Your Own' }),
        el('small', { class: 'muted', text: 'Your pictures, quizzes & sentences · offline.' })
      ]));

      if (Kit.questions || Kit.sentences) {
        side.appendChild(el('div', { class: 'studio-tabs' + (Kit.sentences ? ' tri' : '') }, [
          el('button', {
            type: 'button',
            class: 'studio-tab' + (!isQ && !isS ? ' on' : ''),
            text: '🖼️ Pics',
            onclick: function () { flushPendingSave().then(function () { state.tab = 'pictures'; draw(); }); }
          }),
          Kit.questions ? el('button', {
            type: 'button',
            class: 'studio-tab' + (isQ ? ' on' : ''),
            text: '❓ Quiz',
            onclick: function () {
              flushPendingSave().then(function () {
                state.tab = 'questions';
                if (!state.qsets.length) loadQs(initOpts.qId); else draw();
              });
            }
          }) : null,
          Kit.sentences ? el('button', {
            type: 'button',
            class: 'studio-tab' + (isS ? ' on' : ''),
            text: '🚂 Past',
            onclick: function () {
              flushPendingSave().then(function () {
                state.tab = 'sentences';
                if (!state.ssets.length) loadSs(initOpts.sId); else draw();
              });
            }
          }) : null
        ]));
      }

      var main = el('section', { class: 'studio-main' });

      if (!isQ && !isS) {
        /* ==================== PICTURES TAB ==================== */
        var cur = state.cur;
        side.appendChild(el('button', { type: 'button', class: 'btn mint sm', text: '＋ New picture set', onclick: function () { copyPicSet(null); } }));

        var pFilt = el('div', { class: 'seg studio-mini-seg' });
        [['All', 'All'], ['3', 'G3'], ['4', 'G4'], ['Mine', 'Mine']].forEach(function (f) {
          pFilt.appendChild(el('button', {
            type: 'button',
            class: 'chip' + (state.picFilter === f[0] ? ' on' : ''),
            text: f[1],
            onclick: function () { state.picFilter = f[0]; draw(); }
          }));
        });
        side.appendChild(pFilt);

        var list = el('div', { class: 'studio-list' });
        state.sets.filter(function (s) {
          if (state.picFilter === 'Mine') return !s.builtIn;
          if (state.picFilter === '3' || state.picFilter === '4') return String(s.grade) === state.picFilter;
          return true;
        }).forEach(function (s) {
          list.appendChild(el('button', {
            type: 'button',
            class: 'studio-set' + (cur && s.id === cur.id ? ' on' : ''),
            onclick: function () { flushPendingSave().then(function () { loadPics(s.id); }); }
          }, [
            el('span', { class: 'e', text: s.e || '⭐' }),
            el('span', null, [
              el('b', { text: s.name }),
              el('small', { text: (s.builtIn ? 'Ready-made · ' : 'Mine · ') + s.cards.length + ' pictures' })
            ])
          ]));
        });
        side.appendChild(list);

        if (cur) {
          var head = el('div', { class: 'studio-top' });
          if (cur.builtIn) {
            head.appendChild(el('div', { class: 'grow' }, [
              el('h3', { text: (cur.e || '') + ' ' + cur.name }),
              el('p', { class: 'muted', text: 'Ready-made pack. Click "Make my copy" to add pictures, edit clues or arrange positions.' })
            ]));
            head.appendChild(el('button', { type: 'button', class: 'btn lilac sm', text: '⧉ Make my copy', onclick: function () { copyPicSet(cur); } }));
          } else {
            var nm = el('input', { class: 'input', value: cur.name, 'aria-label': 'Set name' });
            nm.addEventListener('input', function () { cur.name = nm.value || 'My set'; state.dirty = true; });
            var sub = el('input', { class: 'input', value: cur.sub || '', placeholder: 'Unit / topic (optional)', 'aria-label': 'Topic' });
            sub.addEventListener('input', function () { cur.sub = sub.value; state.dirty = true; });
            head.appendChild(el('div', { class: 'grow studio-names' }, [nm, sub]));
            if (cur.cards.length >= 2) {
              head.appendChild(el('button', {
                type: 'button', class: 'btn lilac sm', text: '↔ Arrange pictures',
                onclick: function () { openArrangeModal(cur, function () { savePicSet(false); }); }
              }));
            }
            head.appendChild(el('button', { type: 'button', class: 'btn soft sm', text: 'Duplicate', onclick: function () { copyPicSet(cur); } }));
            head.appendChild(el('button', { type: 'button', class: 'btn soft sm', text: '🗑', title: 'Delete set', onclick: function () {
              Kit.modal({ title: 'Delete "' + cur.name + '"?', body: '<p>Its pictures will be removed from this device.</p>', buttons: [{ label: 'Keep it', cls: 'soft', value: false }, { label: 'Delete', cls: 'peach', value: true }] })
                .then(function (ok) { if (ok) Kit.sets.remove(cur.id).then(function () { loadPics(null); }); });
            } }));
          }
          main.appendChild(head);

          if (!cur.builtIn) {
            var cutRow = el('div', { class: 'studio-qbar' }, [
              el('button', {
                type: 'button',
                class: 'chip' + (state.autoCut ? ' on' : ''),
                text: '✂️ Smart cutout · keep colors: ' + (state.autoCut ? 'ON' : 'OFF'),
                onclick: function () { state.autoCut = !state.autoCut; draw(); }
              })
            ]);
            main.appendChild(cutRow);

            var fi = el('input', { type: 'file', accept: 'image/*', multiple: true, class: 'hidden' });
            var drop = el('label', { class: 'studio-drop' }, [
              fi,
              el('b', { text: '⬆ Drop pictures here or click to choose' }),
              el('span', { class: 'muted', text: 'PNG, JPG, WebP, GIF · plain backgrounds cut out automatically · file name becomes the word' })
            ]);
            function addFiles(files) {
              var arr = Array.prototype.slice.call(files || []).filter(function (f) { return /^image\//.test(f.type); });
              if (!arr.length) return;
              Promise.all(arr.map(function (f) { return fileToPicture(f, state.autoCut).then(function (u) { return { w: wordFromFile(f.name) || 'word', cl: '', img: u }; }); }))
                .then(function (cards) { cur.cards = cur.cards.concat(cards); return savePicSet(false); })
                .catch(function () { Kit.toast('That picture could not be read'); });
            }
            fi.addEventListener('change', function () { addFiles(fi.files); fi.value = ''; });
            ['dragover', 'dragenter'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
            ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
            drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer && e.dataTransfer.files); });
            main.appendChild(drop);
          }

          var grid = el('div', { class: 'studio-grid' });
          cur.cards.forEach(function (c, i) {
            var w = el('input', { class: 'input', value: c.w, disabled: cur.builtIn ? true : null, placeholder: 'Word', 'aria-label': 'Word for picture ' + (i + 1) });
            w.addEventListener('input', function () { c.w = w.value; state.dirty = true; });
            w.addEventListener('change', function () { savePicSet(false); });

            var cl = el('input', { class: 'input studio-clue-in', value: c.cl || '', disabled: cur.builtIn ? true : null, placeholder: 'Optional sentence clue…', 'aria-label': 'Clue for picture ' + (i + 1) });
            cl.addEventListener('input', function () { c.cl = cl.value; state.dirty = true; });
            cl.addEventListener('change', function () { savePicSet(false); });

            var card = el('div', { class: 'studio-card' }, [
              el('div', { class: 'studio-pic checker' }, [el('img', { src: src(c.img), alt: c.w, loading: 'lazy' }), el('span', { class: 'n', text: String(i + 1) })]),
              w,
              cl,
              el('div', { class: 'studio-row' }, [
                el('button', { type: 'button', class: 'icon-btn', title: 'Hear word', text: '🔈', onclick: function () { Kit.say(c.w); } }),
                cur.builtIn ? null : el('button', {
                  type: 'button', class: 'icon-btn', title: 'Cut out plain background', text: '✂️',
                  onclick: function () { cutExistingImageUrl(c.img).then(function (u) { c.img = u; return savePicSet(false); }); }
                }),
                cur.builtIn ? null : el('button', { type: 'button', class: 'icon-btn', title: 'Remove', text: '✕', onclick: function () { cur.cards.splice(i, 1); savePicSet(false); } })
              ])
            ]);
            grid.appendChild(card);
          });
          if (!cur.cards.length) grid.appendChild(el('p', { class: 'muted', text: 'No pictures yet. Add 4 or more to play.' }));
          main.appendChild(grid);
        }
      } else if (isQ) {
        /* ==================== QUESTIONS TAB ==================== */
        side.appendChild(el('button', { type: 'button', class: 'btn mint sm', text: '＋ New question pack', onclick: function () { copyQSet(null); } }));

        var qFilt = el('div', { class: 'seg studio-mini-seg' });
        [['All', 'All'], ['3', 'G3'], ['4', 'G4'], ['Speak', '🎤'], ['Mine', 'Mine']].forEach(function (f) {
          qFilt.appendChild(el('button', {
            type: 'button',
            class: 'chip' + (state.qFilter === f[0] ? ' on' : ''),
            text: f[1],
            onclick: function () { state.qFilter = f[0]; draw(); }
          }));
        });
        side.appendChild(qFilt);

        var qSearchBox = el('input', {
          class: 'input studio-search',
          type: 'search',
          value: state.qSearch,
          placeholder: '🔍 Filter 73+ packs…',
          'aria-label': 'Filter question packs'
        });
        qSearchBox.addEventListener('input', function () { state.qSearch = qSearchBox.value; renderQSideList(); });
        side.appendChild(qSearchBox);

        var qList = el('div', { class: 'studio-list' });
        side.appendChild(qList);

        function renderQSideList() {
          qList.innerHTML = '';
          if (state.qLoading) { qList.appendChild(el('p', { class: 'muted', text: 'Loading curriculum packs…' })); return; }
          var needle = state.qSearch.trim().toLowerCase();
          var curQ = state.curQ;
          var filtered = state.qsets.filter(function (s) {
            if (state.qFilter === 'Mine' && s.builtIn) return false;
            if (state.qFilter === 'Speak' && !s.speaking) return false;
            if ((state.qFilter === '3' || state.qFilter === '4') && String(s.grade) !== state.qFilter) return false;
            if (needle && (s.name + ' ' + (s.sub || '')).toLowerCase().indexOf(needle) < 0) return false;
            return true;
          });
          filtered.forEach(function (s) {
            qList.appendChild(el('button', {
              type: 'button',
              class: 'studio-set' + (curQ && s.id === curQ.id ? ' on' : ''),
              onclick: function () { flushPendingSave().then(function () { loadQs(s.id); }); }
            }, [
              el('span', { class: 'e', text: s.e || '📘' }),
              el('span', null, [
                el('b', { text: s.name }),
                el('small', { text: (s.builtIn ? '' : 'Mine · ') + (s.sub ? s.sub + ' · ' : '') + s.items.length + ' Qs' })
              ])
            ]));
          });
          if (!filtered.length) qList.appendChild(el('p', { class: 'muted', text: 'No packs match.' }));
        }
        renderQSideList();

        var curQ = state.curQ;
        if (state.qLoading) {
          main.appendChild(el('p', { class: 'muted', text: 'Loading all Grade 3 & Grade 4 question packs…' }));
        } else if (curQ) {
          var qHead = el('div', { class: 'studio-top' });
          if (curQ.builtIn) {
            qHead.appendChild(el('div', { class: 'grow' }, [
              el('h3', { text: (curQ.e || '📘') + ' ' + curQ.name }),
              el('p', { class: 'muted', text: (curQ.sub || '') + ' · ' + curQ.items.length + ' questions ready to play. Make a copy to edit or mix.' })
            ]));
            qHead.appendChild(el('button', { type: 'button', class: 'btn soft sm', text: '⬇ CSV', title: 'Download CSV spreadsheet', onclick: function () { Kit.questions.downloadCsvTemplate(curQ); } }));
            qHead.appendChild(el('button', { type: 'button', class: 'btn lilac sm', text: '⧉ Make my copy', onclick: function () { copyQSet(curQ); } }));
          } else {
            var qNm = el('input', { class: 'input', value: curQ.name, 'aria-label': 'Pack name' });
            qNm.addEventListener('input', function () { curQ.name = qNm.value || 'My question pack'; state.qDirty = true; });
            var qSub = el('input', { class: 'input', value: curQ.sub || '', placeholder: 'Grade / Unit note', 'aria-label': 'Pack subtitle' });
            qSub.addEventListener('input', function () { curQ.sub = qSub.value; state.qDirty = true; });
            qHead.appendChild(el('div', { class: 'grow studio-names' }, [qNm, qSub]));
            qHead.appendChild(el('button', { type: 'button', class: 'btn soft sm', text: '🗑 Delete', onclick: function () {
              Kit.modal({ title: 'Delete "' + curQ.name + '"?', body: '<p>This custom question pack will be removed from this device.</p>', buttons: [{ label: 'Keep it', cls: 'soft', value: false }, { label: 'Delete', cls: 'peach', value: true }] })
                .then(function (ok) { if (ok) Kit.questions.remove(curQ.id).then(function () { loadQs(null); }); });
            } }));
          }
          main.appendChild(qHead);

          if (!curQ.builtIn) {
            var csvInput = el('input', { type: 'file', accept: '.csv,.tsv,.txt,text/csv,text/plain', class: 'hidden' });
            csvInput.addEventListener('change', function () {
              var f = csvInput.files && csvInput.files[0];
              if (!f) return;
              var reader = new FileReader();
              reader.onload = function () {
                var rows = Kit.questions.parseTabular(reader.result, curQ.grade, curQ.unit);
                if (!rows.length) { Kit.toast('Could not find Question + Answer columns'); return; }
                curQ.items = (curQ.items || []).concat(rows);
                saveQSet(false);
                Kit.toast('Imported ' + rows.length + ' questions ✓');
              };
              reader.readAsText(f);
              csvInput.value = '';
            });

            main.appendChild(el('div', { class: 'studio-qbar' }, [
              el('button', {
                type: 'button', class: 'btn mint sm', text: '＋ Add choice Q',
                onclick: function () {
                  curQ.items.unshift({ q: 'New question…', a: 'right answer', w: ['wrong 1', 'wrong 2', 'wrong 3'], pic: '❓', grade: curQ.grade || 'All', unit: curQ.unit || '', skill: 'Reading' });
                  state.qDirty = true; draw();
                }
              }),
              el('button', {
                type: 'button', class: 'btn butter sm', text: '🎤 Add speaking card',
                onclick: function () {
                  curQ.items.unshift({ q: 'Say it aloud!', a: 'I have to brush my teeth.', w: [], pic: '🎤', speak: 1, grade: curQ.grade || 'All', unit: curQ.unit || '', skill: 'Speaking' });
                  state.qDirty = true; draw();
                }
              }),
              el('button', { type: 'button', class: 'btn lilac sm', text: '📋 Paste from Excel', onclick: function () { openPasteModal(curQ); } }),
              el('label', { class: 'btn soft sm', style: { cursor: 'pointer' } }, [csvInput, '⬆ Upload CSV']),
              el('button', { type: 'button', class: 'btn soft sm', text: '⬇ CSV Template', onclick: function () { Kit.questions.downloadCsvTemplate(curQ); } })
            ]));
          }

          var qRows = el('div', { class: 'studio-qlist' });
          (curQ.items || []).forEach(function (it, idx) {
            if (curQ.builtIn) {
              var badge = (!it.w || !it.w.length) ? '🎤 Speak: ' : '✓ ';
              qRows.appendChild(el('div', { class: 'studio-qrow readonly' }, [
                el('span', { class: 'studio-qnum', text: String(idx + 1) }),
                el('span', { class: 'studio-qpic', text: it.pic || (it.img ? '🖼️' : '❓') }),
                el('div', { class: 'studio-qmain' }, [
                  el('b', { text: it.q }),
                  el('small', { text: badge + it.a + (it.w && it.w.length ? '  ·  ✗ ' + it.w.join(' / ') : '') })
                ]),
                el('button', { type: 'button', class: 'icon-btn', title: 'Hear it', text: '🔈', onclick: function () { Kit.say(it.q.replace(/_+/g, ' blank ') + '. ' + it.a); } })
              ]));
            } else {
              var picIn = el('input', { class: 'input studio-qemoji-in', value: it.pic || '❓', 'aria-label': 'Emoji' });
              picIn.addEventListener('input', function () { it.pic = picIn.value; state.qDirty = true; });
              var qIn = el('input', { class: 'input', value: it.q, placeholder: 'Question or speaking prompt', 'aria-label': 'Question ' + (idx + 1) });
              qIn.addEventListener('input', function () { it.q = qIn.value; state.qDirty = true; });
              var aIn = el('input', { class: 'input studio-qa-ok', value: it.a, placeholder: 'Right answer / target sentence', 'aria-label': 'Right answer' });
              aIn.addEventListener('input', function () { it.a = aIn.value; state.qDirty = true; });
              var wArr = Array.isArray(it.w) ? it.w : [];
              function makeW(wi) {
                var win = el('input', { class: 'input studio-qa-w', value: wArr[wi] || '', placeholder: 'Wrong ' + (wi + 1) + ' (optional)', 'aria-label': 'Wrong choice ' + (wi + 1) });
                win.addEventListener('input', function () {
                  wArr[wi] = win.value;
                  it.w = [wArr[0], wArr[1], wArr[2]].map(function (x) { return String(x || '').trim(); }).filter(Boolean);
                  it.speak = it.w.length === 0 ? 1 : 0;
                  state.qDirty = true;
                });
                return win;
              }
              qRows.appendChild(el('div', { class: 'studio-qrow' }, [
                el('div', { class: 'studio-qrow-top' }, [
                  el('span', { class: 'studio-qnum', text: String(idx + 1) }),
                  picIn, qIn,
                  el('button', { type: 'button', class: 'icon-btn', title: 'Hear it', text: '🔈', onclick: function () { Kit.say(it.q + ' ' + it.a); } }),
                  el('button', { type: 'button', class: 'icon-btn', title: 'Remove question', text: '✕', onclick: function () { curQ.items.splice(idx, 1); saveQSet(false); } })
                ]),
                el('div', { class: 'studio-qrow-ans' }, [aIn, makeW(0), makeW(1), makeW(2)])
              ]));
            }
          });
          if (!curQ.items.length) qRows.appendChild(el('p', { class: 'muted', text: 'No questions yet. Add or paste rows above!' }));
          main.appendChild(qRows);
        }
      } else if (isS) {
        /* ==================== SENTENCES TAB (TIME TRAIN) ==================== */
        side.appendChild(el('button', { type: 'button', class: 'btn mint sm', text: '＋ New sentence pack', onclick: function () { copySSet(null); } }));

        var sList = el('div', { class: 'studio-list' });
        state.ssets.forEach(function (s) {
          sList.appendChild(el('button', {
            type: 'button',
            class: 'studio-set' + (state.curS && s.id === state.curS.id ? ' on' : ''),
            onclick: function () { flushPendingSave().then(function () { loadSs(s.id); }); }
          }, [
            el('span', { class: 'e', text: s.e || '🚂' }),
            el('span', null, [
              el('b', { text: s.name }),
              el('small', { text: (s.builtIn ? 'Ready-made · ' : 'Mine · ') + s.items.length + ' sentences' })
            ])
          ]));
        });
        side.appendChild(sList);

        var curS = state.curS;
        if (curS) {
          var sHead = el('div', { class: 'studio-top' });
          if (curS.builtIn) {
            sHead.appendChild(el('div', { class: 'grow' }, [
              el('h3', { text: (curS.e || '🚂') + ' ' + curS.name }),
              el('p', { class: 'muted', text: (curS.sub || '') + ' · Automatically builds Positive, Didn\'t & Did…? stations!' })
            ]));
            sHead.appendChild(el('button', { type: 'button', class: 'btn soft sm', text: '⬇ CSV', onclick: function () { Kit.sentences.downloadCsvTemplate(curS); } }));
            sHead.appendChild(el('button', { type: 'button', class: 'btn lilac sm', text: '⧉ Make my copy', onclick: function () { copySSet(curS); } }));
          } else {
            var sNm = el('input', { class: 'input', value: curS.name, 'aria-label': 'Pack name' });
            sNm.addEventListener('input', function () { curS.name = sNm.value || 'My sentences'; state.sDirty = true; });
            var sSub = el('input', { class: 'input', value: curS.sub || '', placeholder: 'Grade / Unit note', 'aria-label': 'Subtitle' });
            sSub.addEventListener('input', function () { curS.sub = sSub.value; state.sDirty = true; });
            sHead.appendChild(el('div', { class: 'grow studio-names' }, [sNm, sSub]));
            sHead.appendChild(el('button', { type: 'button', class: 'btn soft sm', text: '🗑 Delete', onclick: function () {
              Kit.modal({ title: 'Delete "' + curS.name + '"?', body: '<p>This custom sentence pack will be removed from this device.</p>', buttons: [{ label: 'Keep it', cls: 'soft', value: false }, { label: 'Delete', cls: 'peach', value: true }] })
                .then(function (ok) { if (ok) Kit.sentences.remove(curS.id).then(function () { loadSs(null); }); });
            } }));
          }
          main.appendChild(sHead);

          if (!curS.builtIn) {
            var sCsvIn = el('input', { type: 'file', accept: '.csv,.tsv,.txt,text/csv,text/plain', class: 'hidden' });
            sCsvIn.addEventListener('change', function () {
              var f = sCsvIn.files && sCsvIn.files[0];
              if (!f) return;
              var reader = new FileReader();
              reader.onload = function () {
                var rows = Kit.sentences.parseTabular(reader.result);
                if (!rows.length) { Kit.toast('Could not find Subject + Base + Past columns'); return; }
                curS.items = (curS.items || []).concat(rows);
                saveSSet(false);
                Kit.toast('Imported ' + rows.length + ' sentences ✓');
              };
              reader.readAsText(f);
              sCsvIn.value = '';
            });

            main.appendChild(el('div', { class: 'studio-qbar' }, [
              el('button', {
                type: 'button', class: 'btn mint sm', text: '＋ Add sentence',
                onclick: function () {
                  curS.items.unshift({ when: 'Yesterday', subj: 'She', pron: 'she', base: 'play', past: 'played', rest: 'in the park', pic: '🌟', ansYes: true });
                  state.sDirty = true; draw();
                }
              }),
              el('button', { type: 'button', class: 'btn lilac sm', text: '📋 Paste from Excel', onclick: function () { openSPasteModal(curS); } }),
              el('label', { class: 'btn soft sm', style: { cursor: 'pointer' } }, [sCsvIn, '⬆ Upload CSV']),
              el('button', { type: 'button', class: 'btn soft sm', text: '⬇ CSV Template', onclick: function () { Kit.sentences.downloadCsvTemplate(curS); } })
            ]));
          }

          var sRows = el('div', { class: 'studio-qlist' });
          (curS.items || []).forEach(function (it, idx) {
            var fm = Kit.sentences.forms(it);
            if (curS.builtIn) {
              sRows.appendChild(el('div', { class: 'studio-qrow readonly' }, [
                el('span', { class: 'studio-qnum', text: String(idx + 1) }),
                el('span', { class: 'studio-qpic', text: it.pic || '🚂' }),
                el('div', { class: 'studio-qmain' }, [
                  el('b', { text: fm ? fm.posFull : (it.subj + ' ' + it.past + ' ' + it.rest) }),
                  el('small', { text: fm ? (it.isBe ? 'Station 1 (was/were)' : ('− ' + fm.negFull + '  ·  ? ' + fm.qFull)) : '' })
                ]),
                el('button', { type: 'button', class: 'icon-btn', title: 'Hear sentence', text: '🔈', onclick: function () { if (fm) Kit.say(fm.posFull); } })
              ]));
            } else {
              var whIn = el('input', { class: 'input', value: it.when || '', placeholder: 'When (Yesterday)', 'aria-label': 'When' });
              whIn.addEventListener('input', function () { it.when = whIn.value; state.sDirty = true; });
              var sbIn = el('input', { class: 'input', value: it.subj || '', placeholder: 'Subject (Jannah)', 'aria-label': 'Subject' });
              sbIn.addEventListener('input', function () { it.subj = sbIn.value; state.sDirty = true; });
              var bsIn = el('input', { class: 'input', value: it.base || '', placeholder: 'Base (see)', 'aria-label': 'Base verb' });
              bsIn.addEventListener('input', function () { it.base = bsIn.value; state.sDirty = true; });
              var psIn = el('input', { class: 'input studio-qa-ok', value: it.past || '', placeholder: 'Past (saw)', 'aria-label': 'Past verb' });
              psIn.addEventListener('input', function () { it.past = psIn.value; state.sDirty = true; });
              var rsIn = el('input', { class: 'input', value: it.rest || '', placeholder: 'Rest (a huge chariot)', 'aria-label': 'Rest of sentence' });
              rsIn.addEventListener('input', function () { it.rest = rsIn.value; state.sDirty = true; });
              var ynBtn = el('button', {
                type: 'button',
                class: 'chip sm' + (it.ansYes !== false ? ' on' : ''),
                text: it.ansYes !== false ? '✓ Story: Yes' : '✗ Story: No',
                onclick: function () { it.ansYes = it.ansYes === false; state.sDirty = true; draw(); }
              });

              sRows.appendChild(el('div', { class: 'studio-qrow' }, [
                el('div', { class: 'studio-srow-top' }, [
                  el('span', { class: 'studio-qnum', text: String(idx + 1) }),
                  whIn, sbIn, bsIn, psIn,
                  el('button', { type: 'button', class: 'icon-btn', title: 'Hear it', text: '🔈', onclick: function () { var f2 = Kit.sentences.forms(it); if (f2) Kit.say(f2.posFull); } }),
                  el('button', { type: 'button', class: 'icon-btn', title: 'Remove', text: '✕', onclick: function () { curS.items.splice(idx, 1); saveSSet(false); } })
                ]),
                el('div', { class: 'studio-srow-bot' }, [rsIn, ynBtn])
              ]));
            }
          });
          if (!curS.items.length) sRows.appendChild(el('p', { class: 'muted', text: 'No sentences yet. Click "+ Add sentence" or paste from Excel!' }));
          main.appendChild(sRows);
        }
      }

      var hasDirty = (!isQ && !isS && state.dirty) || (isQ && state.qDirty) || (isS && state.sDirty);
      var isEditableNow = (!isQ && !isS && state.cur && !state.cur.builtIn) || (isQ && state.curQ && !state.curQ.builtIn) || (isS && state.curS && !state.curS.builtIn);
      var footHint = isEditableNow
        ? 'Changes save automatically on this device.'
        : 'Tip: Click "Make my copy" on any ready-made pack to customize it.';

      var foot = el('div', { class: 'studio-foot' }, [
        el('span', { class: 'muted', text: footHint }),
        el('div', { style: { display: 'flex', gap: '8px' } }, [
          hasDirty
            ? el('button', { type: 'button', class: 'btn mint sm', text: '💾 Save now', onclick: function () { if (isQ) saveQSet(false); else if (isS) saveSSet(false); else savePicSet(false); } })
            : null,
          el('button', { type: 'button', class: 'btn sm', text: 'Play with this pack →', onclick: close })
        ])
      ]);

      panel.appendChild(side);
      panel.appendChild(el('div', { class: 'studio-body' }, [main, foot]));
      panel.appendChild(el('button', { type: 'button', class: 'icon-btn studio-x', title: 'Close', text: '✕', onclick: close }));
    }

    if (state.tab === 'questions') {
      loadPics(initOpts.setId).then(function () { return loadQs(initOpts.qId); });
    } else if (state.tab === 'sentences') {
      loadPics(initOpts.setId).then(function () { return loadSs(initOpts.sId); });
    } else {
      loadPics(initOpts.setId);
    }
  };
})(window);
