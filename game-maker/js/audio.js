/* Game Maker audio. Procedural Web Audio only (works offline); every reward is a short musical chord with an ADSR curve, never a raw beep.
   If a recorded file exists (audio/<name>.mp3 listed in audio/manifest.json) it replaces the synthesized version.
   The AudioContext starts only after the first tap. Speech: rate 0.88, pitch 1.05, en-US. */
(function (root) {
  'use strict';
  var GM = root.GM = root.GM || {};
  var ctx = null, master = null, muted = false, files = {}, bufs = {}, noiseBuf = null, pegStep = 0, music = null;
  var N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G4: 392, E4: 329.63, C4: 261.63, B3: 246.94, A3: 220 };

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* ignore */ } } return ctx; }
    var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return null;
    try { ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination); } catch (e) { ctx = null; }
    return ctx;
  }
  function noise() { if (!noiseBuf) { var n = ctx.sampleRate * 1, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), i; for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; noiseBuf = b; } return noiseBuf; }
  /* one note: two oscillators (the second a little detuned), soft attack, exponential decay */
  function tone(f, t0, dur, o) {
    o = o || {}; var g = ctx.createGain(), a = o.a || 0.008, v = o.v == null ? 0.22 : o.v, end = t0 + dur;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, end);
    g.connect(o.out || master);
    [0, 1].forEach(function (k) {
      var os = ctx.createOscillator(); os.type = k ? (o.type2 || 'triangle') : (o.type || 'sine'); os.frequency.setValueAtTime(f * (k ? 1.004 : 1), t0);
      if (o.glide) os.frequency.exponentialRampToValueAtTime(o.glide * (k ? 1.004 : 1), end);
      var kg = ctx.createGain(); kg.gain.value = k ? 0.45 : 1; os.connect(kg); kg.connect(g); os.start(t0); os.stop(end + 0.05);
    });
  }
  function burst(t0, dur, o) {
    o = o || {}; var s = ctx.createBufferSource(); s.buffer = noise(); var f = ctx.createBiquadFilter(); f.type = o.type || 'lowpass'; f.frequency.value = o.f || 1500; f.Q.value = o.q || 0.8;
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(o.v || 0.3, t0 + (o.a || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t0); s.stop(t0 + dur + 0.05);
  }
  function arp(list, step, dur, o) { var t = ctx.currentTime + 0.01; list.forEach(function (f, i) { tone(f, t + i * step, dur, o); }); }

  var SYN = {
    tap: function () { var t = ctx.currentTime; burst(t, 0.06, { f: 2400, type: 'bandpass', v: 0.2 }); tone(N.E6, t, 0.12, { v: 0.1 }); },
    back: function () { var t = ctx.currentTime; tone(N.C4, t, 0.18, { glide: 196, v: 0.18 }); },
    start: function () { arp([N.C5, N.E5, N.G5, N.C6], 0.11, 0.5); },
    flip: function () { var t = ctx.currentTime; burst(t, 0.14, { f: 1800, type: 'lowpass', v: 0.35 }); burst(t + 0.05, 0.08, { f: 900, type: 'bandpass', v: 0.15 }); },
    right: function () { arp([N.C5, N.E5, N.G5, N.C6], 0.085, 0.55, { v: 0.2 }); var t = ctx.currentTime + 0.3; tone(N.E6, t, 0.4, { v: 0.07 }); },
    soft: function () { var t = ctx.currentTime; tone(246.94, t, 0.4, { v: 0.2, type2: 'sine' }); tone(220, t + 0.22, 0.5, { v: 0.2, type2: 'sine' }); },
    round: function () { arp([N.G4, N.C5, N.E5], 0.13, 0.4); },
    tick: function () { var t = ctx.currentTime; burst(t, 0.05, { f: 3000, type: 'bandpass', v: 0.12 }); },
    timeup: function () { arp([N.G5, N.E5, N.C5, N.G4], 0.16, 0.45, { type2: 'sine' }); },
    fanfare: function () { var t = ctx.currentTime + 0.01; [N.C5, N.E5, N.G5].forEach(function (f, i) { tone(f, t + i * 0.18, 0.5, { v: 0.2 }); }); [N.C5, N.E5, N.G5, N.C6].forEach(function (f) { tone(f, t + 0.6, 1.6, { v: 0.14 }); }); burst(t + 0.6, 1.2, { f: 7000, type: 'highpass', v: 0.05 }); },
    pu_good: function () { arp([N.E5, N.G5, N.C6, N.E6], 0.07, 0.45); },
    pu_star: function () { arp([N.C6, N.G5, N.E6], 0.1, 0.55, { v: 0.16 }); },
    pu_rocket: function () { var t = ctx.currentTime; burst(t, 0.8, { f: 700, type: 'bandpass', v: 0.25, q: 0.5 }); tone(300, t, 0.8, { glide: 1500, v: 0.15, type: 'sawtooth', type2: 'sine' }); tone(N.E6, t + 0.7, 0.4, { v: 0.1 }); },
    pu_banana: function () { var t = ctx.currentTime; tone(900, t, 0.5, { glide: 160, v: 0.2 }); tone(140, t + 0.5, 0.3, { glide: 90, v: 0.25 }); },
    pu_gold: function () { var t = ctx.currentTime; for (var i = 0; i < 9; i++) tone(1400 + (i % 3) * 330 + Math.random() * 90, t + i * 0.07, 0.25, { v: 0.1, type2: 'sine' }); },
    pu_boom: function () { var t = ctx.currentTime; tone(110, t, 0.5, { glide: 45, v: 0.35, type2: 'sine' }); burst(t, 0.3, { f: 500, v: 0.25 }); },
    pu_trap: function () { var t = ctx.currentTime; tone(330, t, 0.9, { glide: 150, v: 0.2, type: 'triangle', type2: 'sine' }); },
    pu_seesaw: function () { var t = ctx.currentTime; tone(300, t, 0.2, { glide: 360, v: 0.15 }); tone(360, t + 0.25, 0.2, { glide: 300, v: 0.15 }); tone(N.E5, t + 0.55, 0.2, { v: 0.14 }); tone(N.G5, t + 0.65, 0.3, { v: 0.14 }); },
    pu_reset: function () { var t = ctx.currentTime; burst(t, 0.5, { f: 1500, type: 'bandpass', v: 0.2, q: 2 }); tone(800, t, 0.5, { glide: 200, v: 0.14 }); },
    pu_shark: function () { var t = ctx.currentTime; tone(110, t, 0.4, { v: 0.3, type2: 'sine' }); tone(98, t + 0.5, 0.7, { v: 0.3, type2: 'sine' }); burst(t + 1, 0.1, { f: 1200, type: 'bandpass', v: 0.2 }); },
    plinko_drop: function () { var t = ctx.currentTime; tone(900, t, 0.45, { glide: 300, v: 0.14 }); burst(t, 0.06, { f: 1200, v: 0.25 }); },
    plinko_peg: function () { var f = [N.C5, N.E5, N.G5, N.A5, N.E5][pegStep++ % 5], t = ctx.currentTime; tone(f * 1.5, t, 0.14, { v: 0.12, type2: 'sine' }); },
    slot_low: function () { arp([N.C5, N.E5], 0.1, 0.5, { v: 0.16 }); },
    slot_mid: function () { arp([N.C5, N.E5, N.G5], 0.09, 0.6); },
    slot_high: function () { arp([N.C5, N.E5, N.G5, N.C6, N.E6, N.G5, N.C6], 0.07, 0.7, { v: 0.2 }); },
    hunt_rustle: function () { var t = ctx.currentTime; burst(t, 0.35, { f: 2500, type: 'bandpass', v: 0.2, q: 0.6 }); burst(t + 0.12, 0.2, { f: 3200, type: 'bandpass', v: 0.15 }); },
    hunt_dig: function () { var t = ctx.currentTime; tone(130, t, 0.22, { glide: 80, v: 0.25, type2: 'sine' }); burst(t, 0.15, { f: 700, v: 0.2 }); },
    hunt_prize: function () { arp([N.G5, N.C6, N.E6], 0.09, 0.6); },
    hunt_empty: function () { var t = ctx.currentTime; tone(N.E5, t, 0.3, { v: 0.16, type2: 'sine' }); tone(N.C5, t + 0.2, 0.4, { v: 0.16, type2: 'sine' }); },
    hunt_step: function () { var t = ctx.currentTime; burst(t, 0.06, { f: 600, v: 0.2 }); },
    turn_switch: function () { var t = ctx.currentTime + 0.01; tone(N.G4, t, 0.14, { v: 0.14, type2: 'triangle' }); tone(N.D5, t + 0.07, 0.2, { v: 0.16, type2: 'triangle' }); },
    fuse_tick: function (u) { var k = Math.max(0, Math.min(1, Number(u) || 0)), t = ctx.currentTime; burst(t, 0.04, { f: 2600 + k * 1400, type: 'bandpass', v: 0.14 + k * 0.1, q: 2.5 }); tone(620 + k * 520, t, 0.06, { v: 0.12 + k * 0.08, type2: 'sine' }); },
    bomb_pass: function () { var t = ctx.currentTime; burst(t, 0.28, { f: 1100, type: 'bandpass', v: 0.18, q: 1.2 }); tone(280, t, 0.26, { glide: 680, v: 0.14, type2: 'sine' }); },
    bomb_boom: function () { var t = ctx.currentTime; tone(130, t, 0.65, { glide: 36, v: 0.36, type2: 'sine' }); burst(t, 0.45, { f: 420, type: 'lowpass', v: 0.32 }); burst(t + 0.06, 0.35, { f: 2200, type: 'bandpass', v: 0.16, q: 0.9 }); },
    bowling_roll: function () { var t = ctx.currentTime; burst(t, 0.55, { f: 340, type: 'lowpass', v: 0.22, a: 0.05 }); tone(98, t, 0.5, { glide: 135, v: 0.1, type2: 'sine' }); },
    pin_hit: function () { var t = ctx.currentTime; burst(t, 0.08, { f: 1900, type: 'bandpass', v: 0.24, q: 1.6 }); tone(520 + Math.random() * 260, t, 0.11, { glide: 280, v: 0.16, type2: 'triangle' }); },
    bowling_strike: function () { var t = ctx.currentTime + 0.01; for (var i = 0; i < 5; i++) { burst(t + i * 0.04, 0.09, { f: 1700 + i * 220, type: 'bandpass', v: 0.22 }); } arp([N.C5, N.E5, N.G5, N.C6, N.E6], 0.075, 0.6, { v: 0.2 }); },
    disc_drop: function () { var t = ctx.currentTime; tone(640, t, 0.22, { glide: 240, v: 0.14, type2: 'sine' }); },
    disc_bounce: function () { var t = ctx.currentTime; tone(220, t, 0.12, { glide: 150, v: 0.2, type2: 'sine' }); tone(180, t + 0.11, 0.09, { glide: 130, v: 0.12, type2: 'sine' }); },
    line_win: function () { arp([N.C5, N.E5, N.G5, N.A5, N.C6, N.E6], 0.065, 0.55, { v: 0.18 }); },
    ghost: function () { var t = ctx.currentTime; tone(420, t, 1.0, { glide: 620, v: 0.14, type2: 'sine', a: 0.2 }); },
    bat: function () { var t = ctx.currentTime; for (var i = 0; i < 4; i++) burst(t + i * 0.18, 0.1, { f: 1600, type: 'bandpass', v: 0.14, q: 2 }); },
    witch: function () { arp([N.C5, N.E5, N.G5, N.E5, N.G5, N.C6], 0.08, 0.2, { v: 0.12 }); }
  };

  var PRELOAD = ['ui_tap', 'tile_flip', 'answer_right', 'answer_soft', 'turn_switch', 'fuse_tick', 'bomb_pass', 'bomb_boom', 'bowling_roll', 'pin_hit', 'bowling_strike', 'disc_drop', 'disc_bounce', 'line_win', 'plinko_drop', 'plinko_peg_1', 'plinko_peg_2', 'plinko_peg_3', 'hunt_dig', 'hunt_prize', 'hunt_empty', 'hunt_step', 'win_fanfare'];
  function loadBuf(name) {
    if (!files[name] || !ensure() || bufs[name] !== undefined) return;
    if (root.location && root.location.protocol === 'file:') { files[name] = 0; return; }
    bufs[name] = 0;
    try {
      fetch('audio/' + name + '.mp3').then(function (r) {
        if (!r || !r.ok) throw 0;
        return r.arrayBuffer();
      }).then(function (ab) {
        return new Promise(function (res, rej) { ctx.decodeAudioData(ab, res, rej); });
      }).then(function (b) {
        bufs[name] = b;
      }).catch(function () {
        files[name] = 0;
        bufs[name] = null;
      });
    } catch (e) {
      files[name] = 0;
      bufs[name] = null;
    }
  }
  function loadManifest() {
    if (root.location && root.location.protocol === 'file:') return;
    try {
      var x = new XMLHttpRequest(); x.open('GET', 'audio/manifest.json?v=' + Date.now(), true);
      x.onload = function () {
        try {
          if (x.status === 200) {
            JSON.parse(x.responseText).forEach(function (n) { files[n] = 1; });
            if (ctx) PRELOAD.forEach(loadBuf);
          }
        } catch (e) { /* none */ }
      };
      x.send();
    } catch (e) { /* offline file */ }
  }
  function playFile(name, vol, rate) {
    if (!files[name] || !ensure()) return false;
    if (bufs[name]) {
      try {
        var s = ctx.createBufferSource(), g = ctx.createGain();
        s.buffer = bufs[name];
        if (rate && rate !== 1 && s.playbackRate) s.playbackRate.value = rate;
        g.gain.value = vol == null ? 0.9 : vol;
        s.connect(g); g.connect(master); s.start();
        return true;
      } catch (e) { return false; }
    }
    if (bufs[name] === undefined) loadBuf(name);
    return false;
  }
  var ALIAS = { right: 'answer_right', soft: 'answer_soft', flip: 'tile_flip', timeup: 'time_up', fanfare: 'win_fanfare', tap: 'ui_tap', back: 'ui_back', start: 'ui_start', round: 'round_start', ghost: 'ghost_woo', bat: 'bat_flutter', witch: 'witch_giggle', slot_low: 'plinko_slot_low', slot_mid: 'plinko_slot_mid', slot_high: 'plinko_slot_high' };
  function play(name, arg) {
    if (muted) return; if (!ensure()) return;
    try {
      if (name === 'plinko_peg') { if (playFile('plinko_peg_' + (1 + pegStep++ % 3))) return; pegStep--; }
      var fileKey = ALIAS[name] || name;
      if (name === 'fuse_tick') {
        var u = Math.max(0, Math.min(1, Number(arg) || 0));
        if (playFile(fileKey, 0.72 + u * 0.26, 0.94 + u * 0.52)) return;
      } else if (arg == null && playFile(fileKey)) {
        return;
      }
      if (SYN[name]) SYN[name](arg);
    } catch (e) { /* never break the game for a sound */ }
  }
  function speak(text) {
    if (muted || !root.speechSynthesis || !text) return;
    try { root.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(String(text).replace(/_{2,}/g, 'blank')); u.lang = 'en-US'; u.rate = 0.88; u.pitch = 1.05; root.speechSynthesis.speak(u); } catch (e) { /* ignore */ }
  }
  /* quiet background music: a recorded loop if present, otherwise a soft synthesized pad that follows the theme */
  function musicStart(theme) {
    musicStop(); if (muted || !ensure()) return;
    var name = theme === 'halloween' ? 'halloween_loop' : 'classic_loop';
    if (files[name] && bufs[name]) { var s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = bufs[name]; s.loop = true; g.gain.value = 0.25; s.connect(g); g.connect(master); s.start(); music = { stop: function () { try { s.stop(); } catch (e) { /* done */ } } }; return; }
    if (files[name] && bufs[name] === undefined) playFile(name, 0);   // start loading for next time
    var chords = theme === 'halloween' ? [[220, 261.63, 329.63], [196, 246.94, 293.66], [174.61, 220, 261.63], [196, 246.94, 293.66]] : [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]];
    var i = 0, alive = true, bus = ctx.createGain(); bus.gain.value = 0.35; bus.connect(master);
    function step() { if (!alive) return; var t = ctx.currentTime + 0.02; chords[i++ % chords.length].forEach(function (f, k) { tone(f, t + k * 0.02, 2.6, { v: 0.05, a: 0.6, type2: 'sine', out: bus }); }); music.timer = setTimeout(step, 2400); }
    music = { timer: null, stop: function () { alive = false; clearTimeout(music && music.timer); } }; step();
  }
  function musicStop() { if (music) { try { music.stop(); } catch (e) { /* ignore */ } music = null; } }
  function setMuted(m) { muted = !!m; if (muted) { musicStop(); try { root.speechSynthesis && root.speechSynthesis.cancel(); } catch (e) { /* ignore */ } } }
  function unlock() { ensure(); loadManifest(); root.removeEventListener('pointerdown', unlock); root.removeEventListener('keydown', unlock); }
  root.addEventListener('pointerdown', unlock); root.addEventListener('keydown', unlock);

  GM.audio = { play: play, speak: speak, musicStart: musicStart, musicStop: musicStop, setMuted: setMuted, isMuted: function () { return muted; }, ready: function () { return !!ctx; } };
})(window);
