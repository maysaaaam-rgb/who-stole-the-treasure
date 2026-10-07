/* Karaoke Stage sound: chords and soft chimes (no raw beeps), and the model voice with word-by-word timing.
   Voice: the recorded Carolyn files in ../assets/voice (manifest.json) when a line has one, otherwise the computer voice
   (rate 0.88, pitch 1.05, en-US). The audio context and the voice start only after the first touch, click or key. */
(function (root) {
  'use strict';
  var ac = null, master = null, on = true, voice = null;
  var VOICE_DIR = '../assets/voice/', manifest = null, normMap = {}, cur = null, token = 0, raf = 0, timers = [];

  function norm(t) { return String(t).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  try {
    var x = new XMLHttpRequest(); x.open('GET', VOICE_DIR + 'manifest.json?v=1', true);
    x.onload = function () { try { if (x.status === 200) { manifest = JSON.parse(x.responseText); Object.keys(manifest).forEach(function (k) { normMap[norm(k)] = manifest[k]; }); } } catch (e) { manifest = null; } };
    x.send();
  } catch (e) { manifest = null; }
  function fileFor(text) { if (!manifest) return null; return manifest[String(text)] || normMap[norm(text)] || null; }

  function ctx() {
    if (ac) return ac;
    var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return null;
    ac = new AC();
    var comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 6;
    master = ac.createGain(); master.gain.value = 0.7; master.connect(comp); comp.connect(ac.destination);
    return ac;
  }
  function unlock() { var a = ctx(); if (a && a.state === 'suspended') a.resume(); pickVoice(); }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, unlock, { passive: true }); });

  // one note = two oscillators (sine + soft triangle) with attack and decay
  function note(f, t0, dur, vol) {
    var a = ctx(); if (!a || !on) return;
    [['sine', 0, 1], ['triangle', 5, 0.35]].forEach(function (cfg) {
      var o = a.createOscillator(), g = a.createGain();
      o.type = cfg[0]; o.detune.value = cfg[1]; o.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol * cfg[2], t0 + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
    });
  }
  function noise(t0, dur, freq, vol, type) {
    var a = ctx(); if (!a || !on) return;
    var len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = buf; f.type = type || 'lowpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t0);
  }
  var SOUNDS = {
    tap: function (t) { noise(t, 0.06, 1800, 0.16); note(523.25, t, 0.12, 0.05); },
    tick: function (t) { note(783.99, t, 0.09, 0.035); },
    drum: function (t) { for (var i = 0; i < 10; i++) noise(t + i * 0.085, 0.07, 500, 0.12); },
    spot: function (t) { [392, 493.88, 587.33, 783.99].forEach(function (f, i) { note(f, t + i * 0.07, 0.7, 0.08); }); },
    star1: function (t) { note(659.25, t, 0.5, 0.11); note(783.99, t + 0.1, 0.6, 0.1); },
    star2: function (t) { [523.25, 659.25, 783.99].forEach(function (f, i) { note(f, t + i * 0.1, 0.6, 0.11); }); },
    star3: function (t) { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, t + i * 0.09, 0.7, 0.12); }); note(1318.5, t + 0.45, 1.1, 0.09); },
    applause: function (t) { for (var i = 0; i < 14; i++) noise(t + i * 0.07 + Math.random() * 0.04, 0.09, 2400, 0.09, 'bandpass'); },
    fanfare: function (t) { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, t + i * 0.16, 1.1, 0.13); }); note(1318.5, t + 0.7, 1.4, 0.1); },
    soft: function (t) { note(246.94, t, 0.4, 0.1); note(220, t + 0.2, 0.55, 0.1); }
  };
  function play(name) { var a = ctx(); if (!a || !on || !SOUNDS[name]) return; if (a.state === 'suspended') a.resume(); SOUNDS[name](a.currentTime + 0.01); }

  function pickVoice() {
    if (!root.speechSynthesis) return;
    var list = root.speechSynthesis.getVoices(); if (!list || !list.length) return;
    // local voices first: they report word boundaries, so the highlight follows the voice exactly
    var us = list.filter(function (v) { return /^en[-_]US/i.test(v.lang); });
    voice = us.filter(function (v) { return v.localService; })[0] || us[0] || list.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if (root.speechSynthesis) { try { root.speechSynthesis.onvoiceschanged = pickVoice; } catch (e) { /* ignore */ } pickVoice(); }

  // how long a word "weighs" when we have to guess the timing: syllables, plus a pause after . , ? !
  function syll(w) { var m = String(w).toLowerCase().replace(/[^a-z]/g, '').replace(/e$/, '').match(/[aeiouy]+/g); return Math.max(1, m ? m.length : 1); }
  function weights(words) { return words.map(function (w) { return syll(w) + (/[.?!]$/.test(w) ? 1.2 : /[,;:]$/.test(w) ? 0.6 : 0); }); }

  function stop() {
    token++; cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = [];
    if (cur) { try { cur.pause(); cur.onended = null; cur.onerror = null; } catch (e) { /* ignore */ } cur = null; }
    if (root.speechSynthesis) { try { root.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  }

  /* lines: [[word, word, ...], ...]. onWord(lineIndex, wordIndex) lights a word; onEnd() when every line is read. */
  function karaoke(lines, onWord, onEnd) {
    stop(); var my = token, li = 0;
    function done() { if (my === token) onEnd && onEnd(); }
    function nextLine() {
      if (my !== token) return;
      if (li >= lines.length) return done();
      var L = li++, words = lines[L], text = words.join(' '), f = on ? fileFor(text) : null, after = function () { if (my !== token) return; timers.push(setTimeout(nextLine, 380)); };
      if (!on) { guessRun(L, words, after); return; }
      if (f) { fileRun(L, words, f, text, after); return; }
      ttsRun(L, words, text, after);
    }
    // recorded voice: follow the playing time, words share the length by their weight
    function fileRun(L, words, f, text, after) {
      var a = new Audio(VOICE_DIR + f), w = weights(words), tot = w.reduce(function (s, v) { return s + v; }, 0), last = -1; cur = a;
      function tickA() {
        if (my !== token) return;
        if (a.duration && !isNaN(a.duration)) {
          var lead = 0.12, p = Math.max(0, (a.currentTime - lead) / Math.max(0.3, a.duration - lead - 0.15)) * tot, acc = 0, idx = 0;
          for (var i = 0; i < w.length; i++) { acc += w[i]; if (p < acc) { idx = i; break; } idx = i; }
          if (idx !== last) { last = idx; onWord(L, idx); }
        }
        raf = requestAnimationFrame(tickA);
      }
      a.onended = function () { cancelAnimationFrame(raf); if (cur === a) cur = null; onWord(L, words.length - 1); after(); };
      a.onerror = function () { cancelAnimationFrame(raf); if (cur === a) cur = null; ttsRun(L, words, text, after); };
      var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (cur === a) { cur = null; cancelAnimationFrame(raf); ttsRun(L, words, text, after); } });
      tickA();
    }
    // computer voice: real word boundaries when the voice gives them, a timed guess when it does not
    function ttsRun(L, words, text, after) {
      if (!root.speechSynthesis) { guessRun(L, words, after); return; }
      var starts = [], pos = 0; words.forEach(function (wd) { starts.push(pos); pos += wd.length + 1; });
      var u = new root.SpeechSynthesisUtterance(text), gotBoundary = false, guessing = false, finished = false;
      u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05; if (voice) u.voice = voice;
      u.onstart = function () {
        if (my !== token) return; onWord(L, 0);
        timers.push(setTimeout(function () { if (my === token && !gotBoundary && !finished) { guessing = true; guessRun(L, words, function () { /* the voice ends the line */ }, 1, function () { return !finished; }); } }, 450));
      };
      u.onboundary = function (e) {
        if (my !== token || guessing || e.name === 'sentence') return; gotBoundary = true;
        var idx = 0; for (var i = 0; i < starts.length; i++) if (e.charIndex >= starts[i]) idx = i;
        onWord(L, idx);
      };
      u.onend = u.onerror = function () { if (finished) return; finished = true; if (my === token) { onWord(L, words.length - 1); after(); } };
      try { root.speechSynthesis.speak(u); } catch (e) { guessRun(L, words, after); }
      // some browsers never fire onstart / onend: keep going anyway
      timers.push(setTimeout(function () { if (!finished && my === token && !gotBoundary && !guessing) { finished = true; guessRun(L, words, after); } }, 2500));
    }
    function guessRun(L, words, after, from, alive) {
      var w = weights(words), i = from || 0, step = function () {
        if (my !== token || (alive && !alive())) return;
        if (i >= words.length) { after(); return; }
        onWord(L, i); timers.push(setTimeout(step, w[i++] * 235));
      };
      step();
    }
    nextLine();
  }

  root.KaraokeAudio = {
    play: play, karaoke: karaoke, stop: stop,
    hasRecording: function (t) { return !!fileFor(t); },
    weights: weights,
    setOn: function (v) { on = !!v; if (!on) stop(); }, isOn: function () { return on; }
  };
})(typeof window !== 'undefined' ? window : this);
