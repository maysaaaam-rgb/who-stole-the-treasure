/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Core Audio & Foley Engine (island/js/core/audio.js)
   - Loads `audio/manifest.json`, `audio/ch1/manifest.json`, AND `audio/ch2/manifest.json`
   - Plays recorded neural character MP3s with calibrated TTS fallback (en-US, rate 0.88, pitch 1.05)
   - Generates gentle Web Audio harbour/bay ocean ambience (waves + breeze, ducked on speech)
   - Synthesizes polyphonic musical chord UI SFX & surface-aware footsteps (stone, wood, sand)
   - Unlocks cleanly on first user gesture (AGENTS.md Section 1.3 compliant)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var MUTE_KEY = 'eaa_island_muted';
  var ctx = null;
  var manifest = {};
  var manifestByText = {};
  var manifestReady = false;
  var manifestPromise = null;
  var currentVo = null;
  var ambienceNodes = null;
  var ambienceGain = null;
  var duckTimer = null;
  var lastStepAt = 0;

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
      try { ambienceGain.gain.setTargetAtTime(0.042, ctx.currentTime, 0.25); } catch (e) { /* ignore */ }
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
    }
    var uMutes = document.querySelectorAll('.unity-hud-mute');
    for (var i = 0; i < uMutes.length; i++) {
      uMutes[i].innerHTML = (m ? '🔇' : '🔊');
      uMutes[i].setAttribute('title', m ? 'Sound Off (Tap to Unmute)' : 'Sound On (Tap to Mute)');
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
    manifestByText[k] = full.indexOf('?') >= 0 ? full : (full + '?v=3');
  }

  function ingestManifestObj(data, prefix) {
    if (!data || typeof data !== 'object') return;
    var lines = data.lines || data;
    Object.keys(lines).forEach(function (k) {
      var item = lines[k];
      if (item && typeof item === 'object' && item.text && item.file) {
        manifest[k] = item;
        registerEntry(item.text, item.file, prefix);
      } else if (typeof item === 'string') {
        manifest[k] = item;
        registerEntry(k, item, prefix);
      }
    });
  }

  function loadManifest() {
    if (manifestPromise) return manifestPromise;
    if (typeof fetch !== 'function') {
      manifestReady = true;
      manifestPromise = Promise.resolve();
      return manifestPromise;
    }
    var pLegacy = fetch('audio/manifest.json?v=8')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    var pCh1 = fetch('audio/ch1/manifest.json?v=ch1-u1-v3')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    var pCh2 = fetch('audio/ch2/manifest.json?v=ch2-u2-v3')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });

    manifestPromise = Promise.all([pLegacy, pCh1, pCh2])
      .then(function (results) {
        var leg = results[0];
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
        ingestManifestObj(results[1], 'audio/ch1/');
        ingestManifestObj(results[2], 'audio/ch2/');
        manifestReady = true;
      })
      .catch(function () {
        manifestReady = true;
      });
    return manifestPromise;
  }

  loadManifest();

  function reloadManifest() {
    manifestPromise = null;
    manifestReady = false;
    return loadManifest();
  }

  /* ---------- Gentle Ocean Ambience (Filtered Pink Surf + Slow Swell) ---------- */
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
        output[i] *= 0.62;
      }
      var whiteNoise = c.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      var filter = c.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 340;

      var lfo = c.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.16;
      var lfoGain = c.createGain();
      lfoGain.gain.value = 175;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      ambienceGain = c.createGain();
      ambienceGain.gain.value = isMuted() ? 0.0001 : 0.038;

      whiteNoise.connect(filter);
      filter.connect(ambienceGain);
      ambienceGain.connect(c.destination);
      whiteNoise.start();

      ambienceNodes = { noise: whiteNoise, lfo: lfo, filter: filter };
    } catch (e) { /* ignore */ }
  }

  function duckAmbience(ms) {
    if (!ambienceGain || !ctx || isMuted()) return;
    try {
      ambienceGain.gain.setTargetAtTime(0.009, ctx.currentTime, 0.06);
      if (duckTimer) clearTimeout(duckTimer);
      duckTimer = setTimeout(function () {
        if (ambienceGain && ctx && !isMuted()) {
          ambienceGain.gain.setTargetAtTime(0.038, ctx.currentTime, 0.35);
        }
      }, ms || 2400);
    } catch (e) { /* ignore */ }
  }

  /* ---------- Polyphonic Dual-Oscillator Chord & Foley Sound Effects ---------- */
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
    o2.frequency.setValueAtTime(freq * 1.0035, now);
    if (slideTo) {
      o1.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
      o2.frequency.exponentialRampToValueAtTime(slideTo * 1.0035, now + dur);
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

  function noiseBurst(dur, cutoff, qVal, vol, delay) {
    var c = ensureCtx();
    if (!c) return;
    try {
      var now = c.currentTime + (delay || 0);
      var len = Math.max(256, Math.floor(c.sampleRate * dur));
      var buf = c.createBuffer(1, len, c.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource();
      src.buffer = buf;
      var flt = c.createBiquadFilter();
      flt.type = 'bandpass';
      flt.frequency.setValueAtTime(cutoff || 900, now);
      flt.Q.setValueAtTime(qVal || 1.4, now);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(vol || 0.08, now + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(flt);
      flt.connect(g);
      g.connect(c.destination);
      src.start(now);
      src.stop(now + dur + 0.01);
    } catch (e) { /* ignore */ }
  }

  function sfxTap() {
    tone(520, 0.065, 'sine', 0.09, 0, 660);
  }

  function sfxCorrect() {
    // Ascending C-Major Pentatonic (C5 -> E5 -> G5 -> C6)
    [523.25, 659.25, 783.99, 1046.50].forEach(function (n, i) {
      tone(n, 0.24, 'triangle', 0.14, i * 0.065);
    });
  }

  function sfxWrong() {
    // Warm descending two-tone sine chime (246.94 Hz -> 220 Hz) — zero harsh buzzers
    tone(246.94, 0.22, 'sine', 0.11, 0);
    tone(220.00, 0.30, 'sine', 0.11, 0.15);
  }

  function sfxStamp() {
    tone(587.33, 0.14, 'triangle', 0.15, 0);
    tone(880.00, 0.22, 'triangle', 0.16, 0.08);
    tone(1174.66, 0.36, 'sine', 0.18, 0.16);
  }

  function sfxCoin() {
    // Classic two-tone ascending arpeggio (B5 -> E6)
    tone(987.77, 0.09, 'triangle', 0.13, 0);
    tone(1318.51, 0.22, 'sine', 0.15, 0.07);
  }

  function sfxGear() {
    noiseBurst(0.045, 1350, 2.2, 0.07, 0);
    tone(440 + Math.random() * 140, 0.08, 'triangle', 0.10, 0.01, 660);
  }

  function sfxSplash() {
    noiseBurst(0.22, 680, 0.9, 0.10, 0);
    tone(330, 0.16, 'sine', 0.08, 0.02, 520);
  }

  function sfxFootstep(surface) {
    var nowMs = Date.now();
    if (nowMs - lastStepAt < 210) return;
    lastStepAt = nowMs;
    var pitchJitter = 0.94 + Math.random() * 0.12;
    if (surface === 'wood') {
      tone(165 * pitchJitter, 0.055, 'triangle', 0.055, 0, 95);
      noiseBurst(0.04, 720, 1.8, 0.035, 0);
    } else if (surface === 'sand') {
      noiseBurst(0.075, 1650, 1.1, 0.042, 0);
      tone(125 * pitchJitter, 0.045, 'sine', 0.03, 0, 82);
    } else {
      // cobblestone
      tone(215 * pitchJitter, 0.048, 'sine', 0.048, 0, 128);
      noiseBurst(0.038, 1180, 2.0, 0.035, 0);
    }
  }

  function sfxChestOpen() {
    [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach(function (n, i) {
      tone(n, 0.42, 'triangle', 0.15, i * 0.075);
    });
  }

  function sfxBeacon() {
    // Warm golden lighthouse chord (G4 - B4 - D5 - G5 - B5)
    [392.00, 493.88, 587.33, 783.99, 987.77].forEach(function (n, i) {
      tone(n, 0.72, 'triangle', 0.14, i * 0.09);
    });
  }

  function sfxFanfare() {
    [523.25, 659.25, 783.99, 1046.50].forEach(function (n, i) {
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
    if (lineId && manifest[lineId]) {
      var entry = manifest[lineId];
      var f = typeof entry === 'string' ? entry : entry.file;
      if (f) return f.indexOf('audio/') === 0 ? f : ('audio/ch1/' + f + '?v=3');
    }
    var k = norm(cleanText);
    if (k && manifestByText[k]) return manifestByText[k];
    var noDots = norm(cleanText.replace(/\.\.\./g, ' '));
    if (noDots && manifestByText[noDots]) return manifestByText[noDots];
    var noColon = norm(cleanText.replace(/^[^:]+:\s*/, ''));
    if (noColon && manifestByText[noColon]) return manifestByText[noColon];
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
          // Fall back to calibrated TTS if file fails to load
          speakTtsFallback(text, opts, done);
        };
        safetyTimer = setTimeout(done, 16000);
        var p = a.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {
            pendingVo = { file: file, slow: !!opts.slow };
            if (currentVo === a) currentVo = null;
            setTimeout(done, 450);
          });
        }
        return;
      } catch (e) { /* ignore */ }
    }
    speakTtsFallback(text, opts, onEnd);
  }

  function speakTtsFallback(text, opts, onEnd) {
    var synth = root.speechSynthesis;
    if (synth && typeof SpeechSynthesisUtterance !== 'undefined') {
      try {
        var u = new SpeechSynthesisUtterance(String(text).replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, ''));
        u.lang = 'en-US';
        u.rate = (opts && opts.slow) ? 0.72 : 0.88;
        u.pitch = 1.05;
        var v = (synth.getVoices() || []).filter(function (x) { return /^en[-_]US/i.test(x.lang); })[0];
        if (v) u.voice = v;
        var ended = false;
        var fin = function () { if (ended) return; ended = true; if (onEnd) onEnd(); };
        u.onend = fin;
        u.onerror = fin;
        setTimeout(fin, 12000);
        synth.speak(u);
        return;
      } catch (e) { /* fall through */ }
    }
    if (onEnd) setTimeout(onEnd, 450);
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
    reloadManifest: reloadManifest,
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMute: toggleMute,
    updateMuteButtons: updateMuteButtons,
    startAmbience: startAmbience,
    sfxTap: sfxTap,
    sfxCorrect: sfxCorrect,
    sfxWrong: sfxWrong,
    sfxStamp: sfxStamp,
    sfxCoin: sfxCoin,
    sfxGear: sfxGear,
    sfxSplash: sfxSplash,
    sfxFootstep: sfxFootstep,
    sfxChestOpen: sfxChestOpen,
    sfxBeacon: sfxBeacon,
    sfxFanfare: sfxFanfare
  };
})(typeof window !== 'undefined' ? window : this);
