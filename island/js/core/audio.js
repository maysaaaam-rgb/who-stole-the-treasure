/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Chapter 1 Core Audio Engine (island/js/core/audio.js)
   - Loads `audio/ch1/manifest.json` mappings for recorded character lines
   - Plays character MP3s with automatic fallback to calibrated TTS
   - Provides slow replay ("Say that again, please" / Flint slow repeat)
   - Generates gentle Web Audio harbour ambience (waves + gulls, ducked on speech)
   - Synthesizes polyphonic musical chord UI SFX (tap, correct, wrong, stamp, chest, fanfare)
   - Unlocks cleanly on first user tap (iPad Safari safe)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var MUTE_KEY = 'eaa_island_muted';
  var ctx = null;
  var manifest = {};
  var manifestByText = {};
  var manifestLoaded = false;
  var manifestReady = false;
  var manifestPromise = null;
  var currentVo = null;
  var ambienceNodes = null;
  var ambienceGain = null;
  var duckTimer = null;

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[\u2018\u2019']/g, "'")
      .replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isMuted() {
    if (root.IslandAudio && typeof root.IslandAudio.isMuted === 'function') {
      return root.IslandAudio.isMuted();
    }
    try { return localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { return false; }
  }

  function setMuted(flag) {
    var m = !!flag;
    try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (e) { /* ignore */ }
    if (root.IslandAudio && typeof root.IslandAudio.setMuted === 'function') {
      root.IslandAudio.setMuted(m);
    }
    if (m) {
      stopVoice();
      if (ambienceGain && ctx) {
        try { ambienceGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08); } catch (e) { /* ignore */ }
      }
    } else if (ambienceGain && ctx) {
      try { ambienceGain.gain.setTargetAtTime(0.045, ctx.currentTime, 0.25); } catch (e) { /* ignore */ }
    }
    updateMuteButtons();
    return m;
  }

  function toggleMute() {
    return setMuted(!isMuted());
  }

  function updateMuteButtons() {
    var m = isMuted();
    var wMute = document.getElementById('w-mute');
    if (wMute) {
      wMute.textContent = m ? '🔇' : '🔊';
      wMute.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
    }
    var ch1Mute = document.getElementById('ch1-hud-mute');
    if (ch1Mute) {
      ch1Mute.innerHTML = (m ? '🔇' : '🔊') + '<span>' + (m ? 'Muted' : 'Sound') + '</span>';
      ch1Mute.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
    }
  }

  function ensureCtx() {
    if (isMuted()) return null;
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (AC) {
        try { ctx = new AC(); } catch (e) { ctx = null; }
      }
    }
    if (ctx && ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) { /* ignore */ }
    }
    return ctx;
  }

  var pendingVo = null;

  function registerEntry(textKey, fileRel, prefix) {
    var k = norm(textKey);
    if (!k || !fileRel) return;
    var full = fileRel.indexOf('audio/') === 0 ? fileRel : (prefix + fileRel);
    manifestByText[k] = full;
  }

  function loadManifest() {
    if (manifestPromise) return manifestPromise;
    manifestLoaded = true;
    if (typeof fetch !== 'function') {
      manifestReady = true;
      manifestPromise = Promise.resolve();
      return manifestPromise;
    }
    var pLegacy = fetch('audio/manifest.json?v=7')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    var pCh1 = fetch('audio/ch1/manifest.json?v=ch1-20261107c')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });

    manifestPromise = Promise.all([pLegacy, pCh1])
      .then(function (results) {
        var leg = results[0];
        var data = results[1];
        if (leg && typeof leg === 'object') {
          Object.keys(leg).forEach(function (k) {
            var f = leg[k];
            if (typeof f === 'string' && f.indexOf('story/') !== 0) {
              var stripped = k.replace(/^[a-z0-9_]+:/i, '');
              registerEntry(stripped, f, 'audio/');
              registerEntry(k, f, 'audio/');
            }
          });
        }
        if (data && typeof data === 'object') {
          manifest = data.lines || data;
          Object.keys(manifest).forEach(function (k) {
            var item = manifest[k];
            if (item && typeof item === 'object' && item.text && item.file) {
              registerEntry(item.text, item.file, 'audio/ch1/');
            } else if (typeof item === 'string') {
              registerEntry(k, item, 'audio/ch1/');
            }
          });
        }
        manifestReady = true;
      })
      .catch(function () {
        manifestReady = true;
      });
    return manifestPromise;
  }

  // Eagerly start loading manifest at script initialization
  loadManifest();

  /* ---------- Gentle Harbour Ambience (Waves + Distant Gull Chime) ---------- */
  function startAmbience() {
    if (isMuted()) return;
    var c = ensureCtx();
    if (!c || ambienceNodes) return;
    try {
      var bufferSize = c.sampleRate * 3;
      var noiseBuffer = c.createBuffer(1, bufferSize, c.sampleRate);
      var output = noiseBuffer.getChannelData(0);
      var lastOut = 0.0;
      for (var i = 0; i < bufferSize; i++) {
        var white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 0.65;
      }
      var whiteNoise = c.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      var filter = c.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 340;

      var lfo = c.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.16; // ~6 sec ocean wave cycle
      var lfoGain = c.createGain();
      lfoGain.gain.value = 180;
      lfo.connect(filter.frequency);
      lfo.start();

      ambienceGain = c.createGain();
      ambienceGain.gain.value = isMuted() ? 0.0001 : 0.042;

      whiteNoise.connect(filter);
      filter.connect(ambienceGain);
      ambienceGain.connect(c.destination);
      whiteNoise.start();

      ambienceNodes = { noise: whiteNoise, lfo: lfo, filter: filter };
    } catch (e) { /* ignore audio context restrictions */ }
  }

  function duckAmbience(ms) {
    if (!ambienceGain || !ctx || isMuted()) return;
    try {
      ambienceGain.gain.setTargetAtTime(0.01, ctx.currentTime, 0.06);
      if (duckTimer) clearTimeout(duckTimer);
      duckTimer = setTimeout(function () {
        if (ambienceGain && ctx && !isMuted()) {
          ambienceGain.gain.setTargetAtTime(0.042, ctx.currentTime, 0.35);
        }
      }, ms || 2400);
    } catch (e) { /* ignore */ }
  }

  /* ---------- Polyphonic Chord UI Sound Effects ---------- */
  function tone(freq, dur, type, vol, delay, slideTo) {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime + (delay || 0);
    var o1 = c.createOscillator();
    var o2 = c.createOscillator();
    var g = c.createGain();
    o1.type = type || 'sine';
    o2.type = 'triangle';
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 1.003, now);
    if (slideTo) {
      o1.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
      o2.frequency.exponentialRampToValueAtTime(slideTo * 1.003, now + dur);
    }
    var peak = (vol || 0.14);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o1.connect(g);
    o2.connect(g);
    g.connect(c.destination);
    o1.start(now);
    o2.start(now);
    o1.stop(now + dur + 0.02);
    o2.stop(now + dur + 0.02);
  }

  function sfxTap() {
    tone(520, 0.065, 'sine', 0.10, 0, 660);
  }

  function sfxCorrect() {
    // Ascending C-Major Pentatonic (C5 -> E5 -> G5 -> C6)
    var notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach(function (n, i) {
      tone(n, 0.24, 'triangle', 0.14, i * 0.065);
    });
  }

  function sfxWrong() {
    // Warm descending two-tone sine chime (246.94 Hz -> 220 Hz) — never harsh
    tone(246.94, 0.22, 'sine', 0.12, 0);
    tone(220.00, 0.30, 'sine', 0.12, 0.15);
  }

  function sfxStamp() {
    tone(587.33, 0.14, 'triangle', 0.15, 0);
    tone(880.00, 0.22, 'triangle', 0.16, 0.08);
    tone(1174.66, 0.36, 'sine', 0.18, 0.16);
  }

  function sfxChestOpen() {
    var chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    chord.forEach(function (n, i) {
      tone(n, 0.42, 'triangle', 0.15, i * 0.075);
    });
  }

  function sfxFanfare() {
    var notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach(function (n, i) {
      tone(n, 0.36, 'triangle', 0.17, i * 0.11);
    });
  }

  function stopVoice() {
    if (currentVo) {
      try { currentVo.pause(); } catch (e) { /* ignore */ }
      currentVo = null;
    }
    if (root.speechSynthesis) {
      try { root.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }

  function resolveAudioFile(text, lineId) {
    loadManifest();
    var cleanText = String(text || '').replace(/[_*#]/g, ' ').trim();
    var k = norm(cleanText);
    if (k && manifestByText[k]) {
      return manifestByText[k];
    }
    if (lineId && manifest[lineId]) {
      var entry = manifest[lineId];
      var f = typeof entry === 'string' ? entry : entry.file;
      if (f) return f.indexOf('audio/') === 0 ? f : ('audio/ch1/' + f);
    }
    // Fallback lookup without ellipsis or speaker prefix
    var noDots = norm(cleanText.replace(/\.\.\./g, ' '));
    if (noDots && manifestByText[noDots]) {
      return manifestByText[noDots];
    }
    var noColon = norm(cleanText.replace(/^[^:]+:\s*/, ''));
    if (noColon && manifestByText[noColon]) {
      return manifestByText[noColon];
    }
    return null;
  }

  function speakNow(text, opts, onEnd) {
    if (isMuted() || !text) {
      if (onEnd) setTimeout(onEnd, 220);
      return;
    }
    var file = resolveAudioFile(text, opts.lineId);
    if (file && typeof Audio !== 'undefined') {
      try {
        var a = new Audio(file);
        a.playbackRate = opts.slow ? 0.82 : 1.0;
        currentVo = a;
        pendingVo = null;
        var finished = false;
        var safetyTimer = null;
        var done = function () {
          if (finished) return;
          finished = true;
          if (safetyTimer) clearTimeout(safetyTimer);
          if (currentVo === a) currentVo = null;
          if (onEnd) onEnd();
        };
        a.onended = done;
        a.onerror = function () {
          if (currentVo === a) currentVo = null;
          setTimeout(done, 350);
        };
        safetyTimer = setTimeout(done, 16000);
        var p = a.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {
            // Autoplay blocked before first user tap — queue for first interaction and never fall back to computer TTS
            pendingVo = { file: file, slow: !!opts.slow };
            if (currentVo === a) currentVo = null;
            setTimeout(done, 450);
          });
        }
        return;
      } catch (e) { /* ignore */ }
    }
    // No recording for this line: say it with the platform voice (en-US, rate 0.88, pitch 1.05) so it is never silent
    var synth = root.speechSynthesis;
    if (synth && typeof SpeechSynthesisUtterance !== 'undefined') {
      try {
        var u = new SpeechSynthesisUtterance(String(text).replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, ''));
        u.lang = 'en-US'; u.rate = opts.slow ? 0.7 : 0.88; u.pitch = 1.05;
        var v = (synth.getVoices() || []).filter(function (x) { return /^en[-_]US/i.test(x.lang); })[0];
        if (v) u.voice = v;
        var ended = false;
        var fin = function () { if (ended) return; ended = true; if (onEnd) onEnd(); };
        u.onend = fin; u.onerror = fin;
        setTimeout(fin, 12000);
        synth.speak(u);
        return;
      } catch (e) { /* fall through */ }
    }
    if (onEnd) {
      setTimeout(onEnd, 450);
    }
  }

  function speak(text, opts, onEnd) {
    if (typeof opts === 'function') { onEnd = opts; opts = {}; }
    opts = opts || {};
    if (isMuted() || !text) {
      if (onEnd) setTimeout(onEnd, 220);
      return;
    }
    stopVoice();
    duckAmbience(2600);

    if (!manifestReady && manifestPromise) {
      manifestPromise.then(function () {
        speakNow(text, opts, onEnd);
      });
      return;
    }
    speakNow(text, opts, onEnd);
  }

  function speakSlow(text, lineId, onEnd) {
    speak(text, { lineId: lineId, slow: true }, onEnd);
  }

  // Unlock AudioContext & replay any queued initial voice on first user interaction
  if (typeof document !== 'undefined') {
    var unlock = function () {
      ensureCtx();
      loadManifest();
      startAmbience();
      updateMuteButtons();
      if (pendingVo && !currentVo && !isMuted()) {
        var pv = pendingVo;
        pendingVo = null;
        try {
          var a = new Audio(pv.file);
          a.playbackRate = pv.slow ? 0.82 : 1.0;
          currentVo = a;
          a.onended = a.onerror = function () { if (currentVo === a) currentVo = null; };
          var pr = a.play();
          if (pr && pr.catch) pr.catch(function () {});
        } catch (e) { /* ignore */ }
      }
    };
    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, unlock, { once: true, passive: true });
    });
  }

  root.Ch1Audio = {
    speak: speak,
    speakSlow: speakSlow,
    stopVoice: stopVoice,
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMute: toggleMute,
    updateMuteButtons: updateMuteButtons,
    startAmbience: startAmbience,
    sfxTap: sfxTap,
    sfxCorrect: sfxCorrect,
    sfxWrong: sfxWrong,
    sfxStamp: sfxStamp,
    sfxChestOpen: sfxChestOpen,
    sfxFanfare: sfxFanfare
  };
})(typeof window !== 'undefined' ? window : this);
