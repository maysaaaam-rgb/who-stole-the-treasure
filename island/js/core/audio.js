/* ═══════════════════════════════════════════════════════════════
   Treasure Island — Core Audio, Voice & Foley Engine (island/js/core/audio.js)
   - Loads `audio/manifest.json`, `audio/ch1/manifest.json`, AND `audio/ch2/manifest.json` (2,890+ neural MP3s)
   - Plays recorded neural character MP3s with smart natural-voice TTS fallback (en-US, rate 0.88, pitch 1.05)
   - Gentle, zero-static Web Audio island marimba breeze ambience (ducked during speech & video)
   - Polyphonic dual-oscillator ADSR musical chord UI SFX & tactile surface footsteps (grass, sand, wood, stone)
   - Strict capture-phase autoplay unlock & unified mute state (AGENTS.md Section 1.3 compliant)
   ═══════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var MUTE_KEY = 'eaa_island_muted';
  var LEGACY_MUTE_KEY = 'eaa_island_mute';
  var ctx = null;
  var masterGain = null;
  var compressor = null;
  var userActivated = false;

  var manifest = {};
  var manifestByText = {};
  var manifestReady = false;
  var manifestPromise = null;

  var currentVo = null;
  var pendingVo = null;
  var activeUtterances = []; // Prevents Chrome GC from cutting off SpeechSynthesis mid-sentence
  var speakSeq = 0;

  var ambienceTimer = null;
  var ambienceStep = 0;
  var ambienceDuckedUntil = 0;
  var ambiencePaused = false;
  var lastStepAt = 0;

  var cachedUsVoice = null;
  var cachedVoiceKey = '';

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[\u2018\u2019`]/g, "'")
      .replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normPlain(s) {
    return norm(s).replace(/'+/g, '');
  }

  function readStoredMute() {
    try {
      var a = localStorage.getItem(MUTE_KEY);
      if (a === '1' || a === '0') return a === '1';
      var b = localStorage.getItem(LEGACY_MUTE_KEY);
      if (b === '1' || b === '0') return b === '1';
    } catch (e) { /* ignore */ }
    return false;
  }

  var mutedState = readStoredMute();

  function isMuted() {
    return mutedState;
  }

  function setMuted(flag) {
    mutedState = !!flag;
    try {
      localStorage.setItem(MUTE_KEY, mutedState ? '1' : '0');
      localStorage.setItem(LEGACY_MUTE_KEY, mutedState ? '1' : '0');
    } catch (e) { /* ignore */ }
    if (root.IslandAudio && typeof root.IslandAudio._syncMutedFromCore === 'function') {
      root.IslandAudio._syncMutedFromCore(mutedState);
    }
    if (mutedState) {
      stopVoice();
      stopAmbience();
      if (masterGain && ctx) {
        try { masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03); } catch (e) { /* ignore */ }
      }
    } else {
      if (userActivated) {
        ensureCtx();
        if (masterGain && ctx) {
          try { masterGain.gain.setTargetAtTime(0.92, ctx.currentTime, 0.05); } catch (e) { /* ignore */ }
        }
        startAmbience();
      }
    }
    updateMuteButtons();
    return mutedState;
  }

  function toggleMute() {
    userActivated = true;
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
      uMutes[i].innerHTML = m ? '🔇' : '🔊';
      uMutes[i].setAttribute('title', m ? 'Sound Off (Tap to Unmute)' : 'Sound On (Tap to Mute)');
    }
  }

  /* ---------- Shared Web Audio Context + Soft Limiter ---------- */
  function ensureCtx() {
    if (isMuted() || !userActivated) return null;
    if (!ctx) {
      ctx = root.__EAA_ISLAND_AUDIO_CTX || null;
      if (!ctx) {
        var AC = root.AudioContext || root.webkitAudioContext;
        if (AC) {
          try { ctx = new AC(); root.__EAA_ISLAND_AUDIO_CTX = ctx; } catch (e) { ctx = null; }
        }
      }
      if (ctx) {
        try {
          compressor = ctx.createDynamicsCompressor();
          compressor.threshold.value = -14;
          compressor.knee.value = 18;
          compressor.ratio.value = 4;
          compressor.attack.value = 0.005;
          compressor.release.value = 0.16;

          masterGain = ctx.createGain();
          masterGain.gain.value = isMuted() ? 0.0001 : 0.92;
          compressor.connect(masterGain);
          masterGain.connect(ctx.destination);
          ctx.__eaaOut = compressor;
        } catch (e) {
          ctx.__eaaOut = ctx.destination;
        }
      }
    }
    if (ctx && ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) { /* ignore */ }
    }
    return ctx;
  }

  function outNode(c) {
    return (c && c.__eaaOut) ? c.__eaaOut : (c ? c.destination : null);
  }

  /* ---------- Neural MP3 Manifest Loader (2,890+ Recorded Lines) ---------- */
  function registerEntry(textKey, fileRel, prefix) {
    if (!textKey || !fileRel) return;
    var full = fileRel.indexOf('audio/') === 0 ? fileRel : (prefix + fileRel);
    var url = full.indexOf('?') >= 0 ? full : (full + '?v=3');
    var k1 = norm(textKey);
    var k2 = normPlain(textKey);
    if (k1 && !manifestByText[k1]) manifestByText[k1] = url;
    if (k2 && !manifestByText[k2]) manifestByText[k2] = url;
  }

  function ingestManifestObj(data, prefix) {
    if (!data || typeof data !== 'object') return;
    var lines = data.lines || data;
    Object.keys(lines).forEach(function (k) {
      var item = lines[k];
      if (item && typeof item === 'object' && item.text && item.file) {
        var full = item.file.indexOf('audio/') === 0 ? item.file : (prefix + item.file);
        var url = full.indexOf('?') >= 0 ? full : (full + '?v=3');
        manifest[k] = { text: item.text, file: item.file, speaker: item.speaker, _url: url };
        registerEntry(item.text, item.file, prefix);
      } else if (typeof item === 'string') {
        var fullStr = item.indexOf('audio/') === 0 ? item : (prefix + item);
        var urlStr = fullStr.indexOf('?') >= 0 ? fullStr : (fullStr + '?v=3');
        manifest[k] = { text: k, file: item, _url: urlStr };
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
        // Load Ch1 and Ch2 neural lines first so character-specific recordings take priority
        ingestManifestObj(results[1], 'audio/ch1/');
        ingestManifestObj(results[2], 'audio/ch2/');
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

  /* ---------- Real Recorded Audio SFX & Sea Waves Ambience ---------- */
  var sfxPool = {};
  var ambienceAudio = null;

  function playRealSfx(filename, vol) {
    if (isMuted() || !userActivated || typeof Audio === 'undefined') return;
    try {
      var key = String(filename || '');
      if (!key) return;
      if (!sfxPool[key]) sfxPool[key] = [];
      var pool = sfxPool[key];
      var audio = null;
      for (var i = 0; i < pool.length; i++) {
        if (pool[i].paused || pool[i].ended) {
          audio = pool[i];
          break;
        }
      }
      if (!audio) {
        if (pool.length >= 4) {
          audio = pool[0];
          try { audio.pause(); } catch (e) { /* ignore */ }
        } else {
          audio = new Audio('audio/sfx/' + key);
          audio.preload = 'auto';
          pool.push(audio);
        }
      }
      audio.volume = Math.max(0, Math.min(1, vol != null ? vol : 0.55));
      try { audio.currentTime = 0; } catch (e) { /* ignore */ }
      var p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) { /* ignore */ }
  }

  function syncAmbienceVolume() {
    if (!ambienceAudio) return;
    var vid = typeof document !== 'undefined' ? document.getElementById('uf-cinema-player') : null;
    var videoPlaying = !!(vid && !vid.paused && !vid.ended);
    var hidden = typeof document !== 'undefined' && document.visibilityState && document.visibilityState !== 'visible';
    if (isMuted() || ambiencePaused || !userActivated || hidden || videoPlaying) {
      if (!ambienceAudio.paused) {
        try { ambienceAudio.pause(); } catch (e) { /* ignore */ }
      }
      return;
    }
    var speakingNow = !!currentVo || activeUtterances.length > 0 || Date.now() < ambienceDuckedUntil;
    ambienceAudio.volume = speakingNow ? 0.025 : 0.09;
    if (ambienceAudio.paused) {
      var p = ambienceAudio.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }
  }

  function startAmbience() {
    ambiencePaused = false;
    if (isMuted() || !userActivated || typeof Audio === 'undefined') return;
    if (!ambienceAudio) {
      ambienceAudio = new Audio('audio/sfx/sea_waves.mp3');
      ambienceAudio.loop = true;
      ambienceAudio.preload = 'auto';
    }
    syncAmbienceVolume();
    if (!ambienceTimer) {
      ambienceTimer = setInterval(syncAmbienceVolume, 450);
    }
  }

  function stopAmbience() {
    ambiencePaused = true;
    if (ambienceAudio && !ambienceAudio.paused) {
      try { ambienceAudio.pause(); } catch (e) { /* ignore */ }
    }
  }

  function duckAmbience(ms) {
    ambienceDuckedUntil = Math.max(ambienceDuckedUntil, Date.now() + (ms || 2600));
    syncAmbienceVolume();
  }

  function sfxTap() { playRealSfx('tap.mp3', 0.42); }
  function sfxPop() { playRealSfx('hop.wav', 0.48); }
  function sfxKick() { playRealSfx('kick.wav', 0.52); }
  function sfxBird() { playRealSfx('birds.mp3', 0.45); }
  function sfxPurr() { playRealSfx('chest.mp3', 0.32); }
  function sfxCorrect() { playRealSfx('correct.mp3', 0.62); }
  function sfxWrong() { playRealSfx('try_again.mp3', 0.55); }
  function sfxStamp() { playRealSfx('correct.mp3', 0.62); }
  function sfxCoin() { playRealSfx('chest.mp3', 0.55); }
  function sfxGear() { playRealSfx('tap.mp3', 0.48); }
  function sfxSplash() { playRealSfx('splash.mp3', 0.55); }

  function sfxFootstep(surface) {
    var nowMs = Date.now();
    if (nowMs - lastStepAt < 285) return;
    lastStepAt = nowMs;
    var vol = (surface === 'wood' || surface === 'stone') ? 0.34 : 0.24;
    playRealSfx('step.mp3', vol);
  }

  function sfxChestOpen() { playRealSfx('chest.mp3', 0.65); }
  function sfxBeacon() { playRealSfx('win.mp3', 0.55); }
  function sfxFanfare() { playRealSfx('win.mp3', 0.68); }

  /* ---------- Voice / Speech Engine (Recorded Neural MP3s + Smart Natural TTS) ---------- */
  function stopVoice() {
    speakSeq++;
    pendingVo = null;
    if (currentVo) {
      try {
        currentVo.onended = null;
        currentVo.onerror = null;
        currentVo.pause();
      } catch (e) { /* ignore */ }
      currentVo = null;
    }
    activeUtterances = [];
    if (root.speechSynthesis) {
      try { root.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
    if (root.EAAVoice && typeof root.EAAVoice.stop === 'function') {
      try { root.EAAVoice.stop(); } catch (e) { /* ignore */ }
    }
  }

  function sanitizeSpeechText(raw) {
    return String(raw || '')
      .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, ' ')
      .replace(/[➔⬅⬆⬇→←↔🧭⭐✨🔒🔓🪙🦀🐚⛵🏆🎬🛒👕🎮🗺️🔊🔇🔁✕✓]/g, ' ')
      .replace(/[·•|—–]/g, ', ')
      .replace(/[_*#`~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function pickBestEnUsVoice() {
    var synth = root.speechSynthesis;
    if (!synth || typeof synth.getVoices !== 'function') return null;
    var list = synth.getVoices() || [];
    if (!list.length) return null;
    var key = list.map(function (v) { return v.name + ':' + v.lang; }).join('|');
    if (key === cachedVoiceKey && cachedUsVoice) return cachedUsVoice;

    var best = null, bestScore = -1e9;
    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      var lang = String(v.lang || '').replace('_', '-');
      if (!/^en/i.test(lang)) continue;
      var n = String(v.name || '');
      var sc = 0;
      if (/^en-US/i.test(lang)) sc += 55;
      else if (/^en-(GB|CA|AU)/i.test(lang)) sc += 25;
      else sc += 10;

      if (/natural|neural|online/i.test(n)) sc += 60;
      if (/google|enhanced|premium/i.test(n)) sc += 35;
      if (/aria|jenny|ana\b|emma|ava|andrew|michelle|steffan|samantha|allison|siri|sonia|libby/i.test(n)) sc += 28;
      if (/david|mark\b|espeak|compact|whisper|zarvox|novelty/i.test(n)) sc -= 45;
      if (sc > bestScore) {
        bestScore = sc;
        best = v;
      }
    }
    cachedVoiceKey = key;
    cachedUsVoice = best;
    return best;
  }

  if (root.speechSynthesis) {
    try {
      root.speechSynthesis.getVoices();
      if ('onvoiceschanged' in root.speechSynthesis) {
        root.speechSynthesis.addEventListener('voiceschanged', function () {
          cachedVoiceKey = '';
          pickBestEnUsVoice();
        });
      }
    } catch (e) { /* ignore */ }
  }

  function resolveAudioFile(text, lineId) {
    loadManifest();
    var cleanText = String(text || '').replace(/[_*#]/g, ' ').trim();
    if (lineId && manifest[lineId] && manifest[lineId]._url) {
      return manifest[lineId]._url;
    }
    var candidates = [
      cleanText,
      cleanText.replace(/\.\.\./g, ' '),
      cleanText.replace(/^[^:]+:\s*/, ''),
      sanitizeSpeechText(cleanText)
    ];
    for (var i = 0; i < candidates.length; i++) {
      var k1 = norm(candidates[i]);
      if (k1 && manifestByText[k1]) return manifestByText[k1];
      var k2 = normPlain(candidates[i]);
      if (k2 && manifestByText[k2]) return manifestByText[k2];
    }
    return null;
  }

  function speakTtsFallback(text, opts, onEnd, mySeq) {
    var clean = sanitizeSpeechText(text);
    if (!clean || isMuted() || mySeq !== speakSeq) {
      if (onEnd) setTimeout(onEnd, 180);
      return;
    }
    if (!userActivated) {
      pendingVo = { text: text, opts: opts || {} };
      if (onEnd) setTimeout(onEnd, 280);
      return;
    }
    var synth = root.speechSynthesis;
    if (synth && typeof SpeechSynthesisUtterance !== 'undefined') {
      try {
        synth.cancel();
        if (synth.paused) synth.resume();
        var u = new SpeechSynthesisUtterance(clean);
        // Strictly calibrated to AGENTS.md Section 1.3: en-US, rate 0.88, pitch 1.05
        u.lang = 'en-US';
        u.rate = (opts && opts.slow) ? 0.74 : 0.88;
        u.pitch = 1.05;
        var v = pickBestEnUsVoice();
        if (v) u.voice = v;

        var ended = false;
        var estMs = Math.max(2400, Math.min(14000, 1400 + clean.length * 95));
        var guardTimer = null;
        var fin = function () {
          if (ended) return;
          ended = true;
          if (guardTimer) clearTimeout(guardTimer);
          activeUtterances = activeUtterances.filter(function (item) { return item !== u; });
          if (mySeq === speakSeq && onEnd) onEnd();
        };
        u.onend = fin;
        u.onerror = fin;
        activeUtterances.push(u);
        guardTimer = setTimeout(fin, estMs);
        duckAmbience(Math.min(6000, estMs));
        synth.speak(u);
        return;
      } catch (e) { /* fall through */ }
    }
    if (onEnd) setTimeout(onEnd, 350);
  }

  function speakNow(text, opts, onEnd, mySeq) {
    if (isMuted() || !text || mySeq !== speakSeq) {
      if (onEnd && mySeq === speakSeq) setTimeout(onEnd, 200);
      return;
    }
    // Autoplay Guard (AGENTS.md §1.3): never start Audio/SpeechSynthesis before first user gesture
    if (!userActivated) {
      pendingVo = { text: text, opts: opts || {} };
      if (onEnd) setTimeout(onEnd, 280);
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
          if (mySeq === speakSeq && onEnd) onEnd();
        };
        a.onended = done;
        a.onerror = function () {
          if (currentVo === a) currentVo = null;
          if (finished || mySeq !== speakSeq) return;
          finished = true;
          if (safetyTimer) clearTimeout(safetyTimer);
          speakTtsFallback(text, opts, onEnd, mySeq);
        };
        safetyTimer = setTimeout(done, 15000);
        duckAmbience(3600);
        var p = a.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {
            if (currentVo === a) currentVo = null;
            if (finished || mySeq !== speakSeq) return;
            finished = true;
            if (safetyTimer) clearTimeout(safetyTimer);
            speakTtsFallback(text, opts, onEnd, mySeq);
          });
        }
        return;
      } catch (e) { /* fall back to TTS */ }
    }
    speakTtsFallback(text, opts, onEnd, mySeq);
  }

  function speak(text, opts, onEnd) {
    if (typeof opts === 'function') { onEnd = opts; opts = {}; }
    opts = opts || {};
    if (!text) {
      if (onEnd) setTimeout(onEnd, 180);
      return;
    }
    if (isMuted()) {
      if (onEnd) setTimeout(onEnd, 200);
      return;
    }
    stopVoice();
    var mySeq = speakSeq;
    duckAmbience(2800);

    if (!manifestReady && manifestPromise) {
      manifestPromise.then(function () {
        if (mySeq === speakSeq) speakNow(text, opts, onEnd, mySeq);
      });
      return;
    }
    speakNow(text, opts, onEnd, mySeq);
  }

  function speakSlow(text, lineId, onEnd) {
    speak(text, { lineId: lineId, slow: true }, onEnd);
  }

  /* ---------- Capture-Phase Gesture Unlock (Never Swallowed by stopPropagation) ---------- */
  function activateFromGesture() {
    var wasFirst = !userActivated;
    userActivated = true;
    var c = ensureCtx();
    loadManifest();
    startAmbience();
    if (wasFirst) {
      updateMuteButtons();
      if (root.speechSynthesis) {
        try { root.speechSynthesis.getVoices(); } catch (e) { /* ignore */ }
      }
      if (pendingVo && !currentVo && !isMuted()) {
        var pv = pendingVo;
        pendingVo = null;
        // Delay slightly so if the click itself triggers a new speak(), that new speak() wins cleanly
        setTimeout(function () {
          if (!currentVo && activeUtterances.length === 0 && !isMuted()) {
            speak(pv.text, pv.opts);
          }
        }, 90);
      }
    }
    if (c && c.state === 'running' && unlockInstalled) {
      // Keep lightweight resume check on visibilitychange, remove heavy per-pointer capture listeners once running
      removeGestureUnlock();
    }
  }

  var unlockInstalled = false;
  var UNLOCK_EVENTS = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
  function removeGestureUnlock() {
    if (!unlockInstalled || typeof document === 'undefined') return;
    unlockInstalled = false;
    UNLOCK_EVENTS.forEach(function (ev) {
      document.removeEventListener(ev, activateFromGesture, true);
    });
  }

  if (typeof document !== 'undefined') {
    unlockInstalled = true;
    UNLOCK_EVENTS.forEach(function (ev) {
      document.addEventListener(ev, activateFromGesture, true);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && userActivated && !isMuted()) {
        ensureCtx();
      } else if (document.visibilityState !== 'visible') {
        stopVoice();
      }
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
    stopAmbience: stopAmbience,
    duckAmbience: duckAmbience,
    sfxTap: sfxTap,
    sfxPop: sfxPop,
    sfxKick: sfxKick,
    sfxBird: sfxBird,
    sfxPurr: sfxPurr,
    sfxCorrect: sfxCorrect,
    sfxWrong: sfxWrong,
    sfxStamp: sfxStamp,
    sfxCoin: sfxCoin,
    sfxGear: sfxGear,
    sfxSplash: sfxSplash,
    sfxFootstep: sfxFootstep,
    sfxChestOpen: sfxChestOpen,
    sfxBeacon: sfxBeacon,
    sfxFanfare: sfxFanfare,
    playRealSfx: playRealSfx,
    _ensureCtx: ensureCtx,
    _isActivated: function () { return userActivated; },
    _activate: activateFromGesture
  };
})(typeof window !== 'undefined' ? window : this);
