/* Moon sounds: the real sound files (folk band loops, drum hits, voice lines, effects) played with the Web Audio API.
   MoonBeat (the drum) becomes the band loop that matches the speed; if a file is missing or cannot load, the old computer-made drum
   (beat.js) plays instead, so the lesson never goes silent. Everything starts after a click (autoplay guard). */
(function (root) {
  'use strict';
  var BASE = 'audio/', LOOPS = [60, 70, 84, 92, 108], ctx = null, bufs = {}, loading = {}, failed = {};
  var synth = root.MoonBeat;                    // the computer drum from beat.js (fallback)
  var bpm = 84, loop = null, timer = null, on = false;
  function ensure() {
    if (!ctx) { var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function load(name, ext) {
    if (bufs[name]) return Promise.resolve(bufs[name]);
    if (failed[name]) return Promise.reject(new Error('failed'));
    if (loading[name]) return loading[name];
    if (!ensure() || typeof fetch !== 'function') { failed[name] = 1; return Promise.reject(new Error('no audio')); }
    loading[name] = fetch(BASE + name + (ext || '.mp3')).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.arrayBuffer(); })
      .then(function (ab) { return new Promise(function (res, rej) { ctx.decodeAudioData(ab, res, rej); }); })
      .then(function (b) { bufs[name] = b; delete loading[name]; return b; });
    loading[name].catch(function () { failed[name] = 1; delete loading[name]; });
    return loading[name];
  }
  /* one-shot: resolves when the sound ended (or at once if it could not play) */
  function play(name, vol, ext) {
    return new Promise(function (resolve) {
      if (!ensure()) { resolve(false); return; }
      load(name, ext).then(function (b) {
        var s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; g.gain.value = vol == null ? 0.9 : vol; s.connect(g); g.connect(ctx.destination);
        s.onended = function () { resolve(true); }; s.start();
      }, function () { resolve(false); });
    });
  }
  function nearest(v) { return LOOPS.reduce(function (a, b) { return Math.abs(b - v) < Math.abs(a - v) ? b : a; }); }
  function stopLoop() {
    on = false; if (timer) { clearTimeout(timer); timer = null; }
    if (loop) { try { loop.src.stop(); } catch (e) { /* already stopped */ } loop = null; }
  }
  function startLoop(name, loopBpm, cb) {
    var s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = bufs[name]; s.loop = true; g.gain.value = 0.85; s.connect(g); g.connect(ctx.destination); s.start(ctx.currentTime + 0.03);
    loop = { src: s, name: name }; on = true;
    var beatLen = 60000 / loopBpm, beat = 0, count = 0, target = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + 30;
    function now() { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }
    function tick() {
      if (!on) return;
      var b = beat, c = count; beat = (beat + 1) % 4; count++;
      if (cb) { try { cb(b, c); } catch (e) { /* ignore */ } }
      target += beatLen; timer = setTimeout(tick, Math.max(0, target - now()));
    }
    timer = setTimeout(tick, 30);
  }
  /* ---- the timed song tracks (11 bars: a count-in bar + 5 pairs of bars: leader bar, answer bar) ---- */
  var SONG_DIR = 'audio/song/', songSrc = null;
  function loadPath(path) {
    if (bufs[path]) return Promise.resolve(bufs[path]);
    if (failed[path]) return Promise.reject(new Error('failed'));
    if (loading[path]) return loading[path];
    if (!ensure() || typeof fetch !== 'function') { failed[path] = 1; return Promise.reject(new Error('no audio')); }
    loading[path] = fetch(path).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.arrayBuffer(); })
      .then(function (ab) { return new Promise(function (res, rej) { ctx.decodeAudioData(ab, res, rej); }); })
      .then(function (b) { bufs[path] = b; delete loading[path]; return b; });
    loading[path].catch(function () { failed[path] = 1; delete loading[path]; });
    return loading[path];
  }
  function songPath(variant, tempo) {
    var t = tempo <= 66 ? 60 : (tempo >= 96 ? 108 : 84);
    if (variant === 'sung' && t === 108) t = 84;          // the sung demonstration exists at 60 and 84
    return { path: SONG_DIR + 'moon_song_' + (variant === 'nodrum' ? 'nodrum_' : variant === 'sung' ? 'sung_' : '') + t + '.mp3', bpm: t };
  }
  function stopSong(soft) {
    if (timer) { clearTimeout(timer); timer = null; }
    on = false;
    if (songSrc && !soft) { try { songSrc.stop(); } catch (e) { /* already stopped */ } songSrc = null; }
  }
  var api = {
    start: function (tempo, cb) {
      if (tempo) bpm = Math.max(56, Math.min(120, tempo));
      api.stop();
      var lb = nearest(bpm), name = 'band_' + (lb === 60 ? 'slow_60' : lb === 70 ? 'soft_70' : lb === 84 ? 'mid_84' : lb === 92 ? 'loud_92' : 'fast_108');
      if (ensure() && bufs[name]) { startLoop(name, lb, cb); return true; }
      load(name).catch(function () { /* the computer drum plays instead */ });
      return synth ? synth.start(bpm, cb) : false;
    },
    /* play a timed song track once; the callback fires on every beat (count 0 = the first count-in click). Falls back to the band loop. */
    startSong: function (tempo, cb, variant) {
      api.stop(); var sp = songPath(variant || 'inst', tempo || bpm); bpm = sp.bpm;
      if (ensure() && bufs[sp.path]) {
        var src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = bufs[sp.path]; g.gain.value = 0.95; src.connect(g); g.connect(ctx.destination); src.start(ctx.currentTime + 0.03); songSrc = src; on = true;
        var beatLen = 60000 / sp.bpm, beat = 0, count = 0, now = function () { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }, target = now() + 30;
        (function tick() { if (!on) return; var b2 = beat, c2 = count; beat = (beat + 1) % 4; count++; if (cb) { try { cb(b2, c2); } catch (e) { /* ignore */ } } target += beatLen; timer = setTimeout(tick, Math.max(0, target - now())); })();
        return true;
      }
      loadPath(sp.path).catch(function () { /* the band loop plays instead */ });
      return api.start(sp.bpm, cb);
    },
    /* the song ended by itself: stop the beat callbacks but let the last chord ring out */
    finish: function () { if (songSrc) { stopSong(true); songSrc = null; } else { api.stop(); } },
    stepTempo: function (dir) { var list = [60, 84, 108], i = list.indexOf(songPath('inst', bpm).bpm); i = Math.max(0, Math.min(2, i + dir)); bpm = list[i]; if (synth) synth.setBpm(bpm); return bpm; },
    stop: function () { stopLoop(); stopSong(false); if (synth) synth.stop(); },
    setBpm: function (v) { bpm = Math.max(56, Math.min(120, v)); if (synth) synth.setBpm(bpm); },
    getBpm: function () { return bpm; },
    isOn: function () { return on || (synth ? synth.isOn() : false); },
    hit: function (kind) {
      var n = kind === 'dung' ? 'drum_dung' : 'drum_deok';
      if (ensure() && bufs[n]) { play(n, 0.9); return true; }
      load(n).catch(function () { /* fallback below */ });
      return synth ? synth.hit(kind) : false;
    }
  };
  /* voice lines: say('step') plays v_step.mp3; sequences play one after the other; returns a promise */
  function say(key) { return play('v_' + key, 1); }
  function sayList(keys) { return keys.reduce(function (p, k) { return p.then(function () { return say(k); }); }, Promise.resolve()); }
  /* get everything ready after the first click */
  function preload() {
    ['band_slow_60', 'band_soft_70', 'band_mid_84', 'band_loud_92', 'band_fast_108', 'drum_dung', 'drum_deok', 'drum_rim', 'sfx_correct', 'sfx_team_done', 'sfx_cheer', 'sfx_moon_glow', 'sfx_try_again'].forEach(function (n) { load(n).catch(function () { /* optional */ }); });
    ['moon_song_84', 'moon_song_nodrum_84', 'moon_song_sung_84', 'moon_song_60', 'moon_song_108', 'moon_song_victory_2bars'].forEach(function (n) { loadPath(SONG_DIR + n + '.mp3').catch(function () { /* optional */ }); });
    load('moon_bowl', '.wav').catch(function () { /* optional */ }); load('clap_group', '.wav').catch(function () { /* optional */ });
  }
  if (typeof document !== 'undefined') document.addEventListener('click', function () { ensure(); preload(); }, { once: true });
  root.MoonBeat = api; root.MoonSnd = { playPath: function (path, vol) { return new Promise(function (resolve) { if (!ensure()) { resolve(false); return; } loadPath(path).then(function (b) { var s2 = ctx.createBufferSource(), g = ctx.createGain(); s2.buffer = b; g.gain.value = vol == null ? 0.9 : vol; s2.connect(g); g.connect(ctx.destination); s2.onended = function () { resolve(true); }; s2.start(); }, function () { resolve(false); }); }); }, play: play, say: say, sayList: sayList, load: load, preload: preload, ready: function (n) { return !!bufs[n]; }, loaded: function () { return Object.keys(bufs); }, failed: function () { return Object.keys(failed); } };
})(window);
