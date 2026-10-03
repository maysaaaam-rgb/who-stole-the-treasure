/**
 * EAA shared voice module (window.EAAVoice)
 *
 * say(text, opts) plays a recorded neural-voice MP3 if one exists, otherwise speaks with the
 * best English voice installed on the device (British female preferred).
 *
 *   EAAVoice.say('I like tea.', { rate: 0.8, dir: 'audio/' })
 *
 * Recorded files live in `<dir>/<hash>.mp3`; `<dir>/manifest.json` lists the hashes that exist
 * ({"files": ["a1b2c3d4", ...]}). Both are optional: with no manifest it just uses the device voice.
 * The same hash() is used by the audio generator script (make-audio.js).
 */
(function (root) {
  'use strict';

  // FNV-1a 32-bit of the trimmed text, as 8 hex chars. MUST match make-audio.js.
  function hash(text) {
    var s = String(text).trim(), h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ('00000000' + h.toString(16)).slice(-8);
  }

  /* ---------- device voice: choose the best British female English voice ---------- */
  var cachedVoice = null, cachedKey = '';

  function score(v) {
    var n = v.name || '', l = (v.lang || '').replace('_', '-'), s = 0;
    if (!/^en/i.test(l)) return -1000;
    if (/^en-GB/i.test(l)) s += 50; else if (/^en-(AU|IE|NZ|ZA)/i.test(l)) s += 15; else if (/^en-US/i.test(l)) s += 20; else s += 5;
    if (/natural|neural|online/i.test(n)) s += 45;          // Microsoft Edge/Windows natural voices
    if (/enhanced|premium/i.test(n)) s += 35;               // Apple enhanced voices
    if (/google uk english female/i.test(n)) s += 45;       // Android / Chrome
    if (/google/i.test(n)) s += 10;
    if (/sonia|libby|maisie|hazel|serena|kate|stephanie|martha|fiona|samantha|karen|moira|tessa|susan|female|jenny|aria|ana\b|zira|linda|heather|catherine|helen|emma|amy|joanna|nicole|olivia|sara|siri/i.test(n)) s += 20;
    if (/male|george|ryan|daniel|oliver|arthur|james|thomas|alex\b|fred|rishi|david|mark\b|richard|guy|brian|eric|matthew|paul|liam|connor/i.test(n) && !/female/i.test(n)) s -= 30;
    if (/espeak|compact|novelty|bad news|bells|boing|cellos|good news|organ|whisper|zarvox|trinoids/i.test(n)) s -= 100;
    if (v.localService) s += 3;
    return s;
  }

  function bestVoice() {
    if (!('speechSynthesis' in root)) return null;
    var list = root.speechSynthesis.getVoices() || [];
    var key = list.map(function (v) { return v.name; }).join('|');
    if (cachedKey === key) return cachedVoice;
    var best = null, bs = -1e9;
    list.forEach(function (v) { var s = score(v); if (s > bs) { bs = s; best = v; } });
    cachedVoice = bs > -500 ? best : null; cachedKey = key;
    return cachedVoice;
  }

  function speakDevice(text, rate) {
    return new Promise(function (resolve) {
      if (!('speechSynthesis' in root)) return resolve();
      try {
        root.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text), v = bestVoice();
        u.lang = (v && v.lang) || 'en-GB'; if (v) u.voice = v;
        u.rate = rate || 0.8; u.pitch = 1.0;
        u.onend = resolve; u.onerror = resolve;
        root.speechSynthesis.speak(u);
      } catch (e) { resolve(); }
    });
  }

  /* ---------- recorded files ---------- */
  var manifests = {};                       // dir -> Promise<Set>
  function manifest(dir) {
    if (!manifests[dir]) {
      manifests[dir] = fetch(dir + 'manifest.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : { files: [] }; })
        .then(function (j) { return new Set((j && j.files) || []); })
        .catch(function () { return new Set(); });
    }
    return manifests[dir];
  }

  var current = null;
  function stopAll() {
    try { if (current) { current.pause(); current = null; } } catch (e) {}
    try { if ('speechSynthesis' in root) root.speechSynthesis.cancel(); } catch (e) {}
  }

  function playFile(url) {
    return new Promise(function (resolve, reject) {
      var a = new Audio(url); current = a;
      a.onended = function () { resolve(); };
      a.onerror = function () { reject(new Error('audio error')); };
      var p = a.play(); if (p && p.catch) p.catch(reject);
    });
  }

  function say(text, opts) {
    opts = opts || {};
    var dir = opts.dir;
    stopAll();
    if (!dir) return speakDevice(text, opts.rate);
    return manifest(dir).then(function (set) {
      var h = hash(text);
      if (!set.has(h)) return speakDevice(text, opts.rate);
      return playFile(dir + h + '.mp3').catch(function () { return speakDevice(text, opts.rate); });
    });
  }

  // Some browsers load voices late; prime the list.
  if ('speechSynthesis' in root) {
    root.speechSynthesis.getVoices();
    if (typeof root.speechSynthesis.addEventListener === 'function') {
      root.speechSynthesis.addEventListener('voiceschanged', function () { cachedVoice = null; cachedKey = ''; });
    }
  }

  root.EAAVoice = { say: say, hash: hash, bestVoice: bestVoice, stop: stopAll };
})(typeof window !== 'undefined' ? window : globalThis);
