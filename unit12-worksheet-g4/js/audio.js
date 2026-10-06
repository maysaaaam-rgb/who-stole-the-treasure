/* Sound for the Unit 2 lessons: chords and soft chimes (no raw beeps), and the teacher voice.
   Voice: recorded Carolyn voice files from ../assets/voice (looked up by sentence in manifest.json).
   If a sentence has no recording (or the files cannot load), the computer's own voice is used (rate 0.88, pitch 1.05, en-US).
   The audio context and the voice start only after the first touch or click. */
(function (root) {
  'use strict';
  var ac = null, master = null, on = true, voice = null, voicesTried = false;
  var VOICE_DIR = '../assets/voice/', manifest = null, normMap = {}, cur = null, seqToken = 0, lastMode = 'none';

  function norm(t) { return String(t).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function loadManifest() {
    try {
      var x = new XMLHttpRequest(); x.open('GET', VOICE_DIR + 'manifest.json?v=1', true);
      x.onload = function () { try { if (x.status === 200) { manifest = JSON.parse(x.responseText); Object.keys(manifest).forEach(function (k) { normMap[norm(k)] = manifest[k]; }); } } catch (e) { manifest = null; } };
      x.send();
    } catch (e) { manifest = null; }
  }
  loadManifest();
  function fileFor(text) { if (!manifest) return null; return manifest[String(text)] || normMap[norm(text)] || null; }

  function ctx() {
    if (ac) return ac;
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
    var comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 6;
    master = ac.createGain(); master.gain.value = 0.7;
    master.connect(comp); comp.connect(ac.destination);
    return ac;
  }
  function unlock() { var a = ctx(); if (a && a.state === 'suspended') a.resume(); pickVoice(); }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, unlock, { passive: true }); });

  // one note: two oscillators (sine plus a soft triangle) with attack / decay
  function note(f, t0, dur, vol, glideTo) {
    var a = ctx(); if (!a || !on) return;
    [['sine', 0, 1], ['triangle', 5, 0.35]].forEach(function (cfg) {
      var o = a.createOscillator(), g = a.createGain();
      o.type = cfg[0]; o.detune.value = cfg[1];
      o.frequency.setValueAtTime(f, t0);
      if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol * cfg[2], t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(master);
      o.start(t0); o.stop(t0 + dur + 0.05);
    });
  }
  function noiseSnap(t0, dur, freq, vol) {
    var a = ctx(); if (!a || !on) return;
    var len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = buf; f.type = 'lowpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t0);
  }

  var SOUNDS = {
    tap: function (t) { noiseSnap(t, 0.06, 1800, 0.18); note(523.25, t, 0.12, 0.05); },
    correct: function (t) { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, t + i * 0.09, 0.55, 0.12); }); },
    soft: function (t) { note(246.94, t, 0.4, 0.12); note(220, t + 0.2, 0.55, 0.12); },
    season: function (t) { noiseSnap(t, 0.5, 700, 0.12); [392, 493.88, 587.33].forEach(function (f, i) { note(f, t + i * 0.07, 0.8, 0.07); }); },
    win: function (t) { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, t + i * 0.16, 1.1, 0.13); }); note(1318.5, t + 0.7, 1.4, 0.1); },
    coin: function (t) { note(987.77, t, 0.18, 0.09); note(1318.5, t + 0.1, 0.4, 0.09); },
    page: function (t) { noiseSnap(t, 0.12, 1200, 0.14); }
  };
  function play(name) {
    var a = ctx(); if (!a || !on || !SOUNDS[name]) return;
    if (a.state === 'suspended') a.resume();
    SOUNDS[name](a.currentTime + 0.01);
  }

  function pickVoice() {
    if (!root.speechSynthesis) return;
    var list = root.speechSynthesis.getVoices();
    if (!list || !list.length) return;
    voicesTried = true;
    voice = list.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0] || list.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if (root.speechSynthesis) { try { root.speechSynthesis.onvoiceschanged = pickVoice; } catch (e) { /* ignore */ } pickVoice(); }

  function ttsSpeak(text, onend) {
    if (!root.speechSynthesis) { lastMode = 'none'; if (onend) onend(); return false; }
    try {
      lastMode = 'tts';
      var u = new root.SpeechSynthesisUtterance(String(text));
      u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05;
      if (voice) u.voice = voice;
      if (onend) { u.onend = onend; u.onerror = onend; }
      root.speechSynthesis.speak(u);
      return true;
    } catch (e) { if (onend) onend(); return false; }
  }
  function stop() {
    seqToken++;
    if (cur) { try { cur.pause(); cur.onended = null; cur.onerror = null; } catch (e) { /* ignore */ } cur = null; }
    if (root.speechSynthesis) { try { root.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  }
  // one sentence: recorded voice if we have it, otherwise the computer voice
  function speak(text, onend) {
    stop();
    if (!on) { if (onend) onend(); return false; }
    var f = fileFor(text);
    if (f) {
      try {
        var a = new Audio(VOICE_DIR + f); cur = a; lastMode = 'file';
        a.onended = function () { if (cur === a) cur = null; if (onend) onend(); };
        a.onerror = function () { if (cur === a) cur = null; ttsSpeak(text, onend); };
        var p = a.play(); if (p && p.catch) p.catch(function () { if (cur === a) { cur = null; ttsSpeak(text, onend); } });
        return true;
      } catch (e) { /* fall through to the computer voice */ }
    }
    return ttsSpeak(text, onend);
  }
  // several sentences one after another, e.g. a question and its answer
  function speakSeq(list) {
    stop(); var my = seqToken, i = 0;
    function next() {
      if (my !== seqToken || i >= list.length) return;
      var t = list[i++], f = fileFor(t), done = function () { if (my === seqToken) setTimeout(next, 350); };
      if (f && on) {
        try { var a = new Audio(VOICE_DIR + f); cur = a; lastMode = 'file'; a.onended = done; a.onerror = done; var p = a.play(); if (p && p.catch) p.catch(done); return; } catch (e) { /* fall through */ }
      }
      if (on) ttsSpeak(t, done);
    }
    next();
  }

  root.ForestAudio = {
    play: play, speak: speak, speakSeq: speakSeq, stop: stop,
    canSpeak: function () { return !!manifest || (!!root.speechSynthesis && (voicesTried || (root.speechSynthesis.getVoices() || []).length > 0)); },
    hasRecording: function (t) { return !!fileFor(t); },
    lastMode: function () { return lastMode; },
    setOn: function (v) { on = !!v; if (!on) stop(); },
    isOn: function () { return on; }
  };
})(typeof window !== 'undefined' ? window : this);
