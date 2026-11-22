/* Foley Sound Engineer Studio — Multi-Layer Procedural Web Audio Foley Physics Engine
   Zero raw single-frequency beeps! Every prop synthesizes rich acoustic Foley physics + feeds a live AnalyserNode oscilloscope. */
(function (root) {
  'use strict';

  var ctx = null;
  var master = null;
  var analyser = null;
  var noiseBuf = null;
  var muted = false;
  var stepToggle = 0;

  function ensureAudio() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.92;
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      master.connect(analyser);
      analyser.connect(ctx.destination);

      // 2-second white/pink-tinted noise buffer for thunder, rain, crunch, gravel & slaps
      var len = ctx.sampleRate * 2;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = noiseBuf.getChannelData(0);
      var b0 = 0, b1 = 0, b2 = 0;
      for (var i = 0; i < len; i++) {
        var white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.950 * b2 + white * 0.048;
        data[i] = Math.max(-1, Math.min(1, (b0 + b1 + b2 + white * 0.25) * 1.6));
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }

  function makeNoise(start, dur, filterType, freq, q, gainPeak, endFreq) {
    var ac = ensureAudio();
    if (!ac || muted) return;
    var src = ac.createBufferSource();
    src.buffer = noiseBuf;
    var flt = ac.createBiquadFilter();
    flt.type = filterType || 'bandpass';
    flt.frequency.setValueAtTime(freq || 1000, start);
    if (endFreq) flt.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), start + dur);
    flt.Q.value = q || 2.0;
    var g = ac.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(gainPeak || 0.4, start + Math.min(0.02, dur * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(flt); flt.connect(g); g.connect(master);
    src.start(start, Math.random() * 0.8, dur + 0.04);
  }

  function tone(freq, start, dur, vol, type, endFreq) {
    var ac = ensureAudio();
    if (!ac || muted) return;
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, start);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(25, endFreq), start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(vol || 0.2, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(master);
    o.start(start); o.stop(start + dur + 0.03);
  }

  /* 8 REALISTIC PROCEDURAL FOLEY PROPS */
  function playProp(id, intensity) {
    var ac = ensureAudio();
    if (!ac || muted) return;
    var t = ac.currentTime;
    var pwr = Math.max(0.45, Math.min(1.4, Number(intensity) || 1.0));
    stepToggle = 1 - stepToggle;

    if (id === 'coconuts') {
      // Hollow coconut shell clip-clop (double wooden cavity hit!)
      var f1 = stepToggle ? 440 : 370;
      var f2 = stepToggle ? 780 : 650;
      makeNoise(t, 0.055, 'bandpass', f1, 7.5, 0.65 * pwr);
      makeNoise(t, 0.045, 'bandpass', f2, 9.0, 0.45 * pwr);
      tone(f1 * 0.55, t, 0.06, 0.22 * pwr, 'triangle', f1 * 0.42);
      // Quick second "clop" echo 115ms later for realistic horse stride!
      makeNoise(t + 0.115, 0.055, 'bandpass', f1 * 1.18, 7.5, 0.52 * pwr);
      makeNoise(t + 0.115, 0.045, 'bandpass', f2 * 1.15, 9.0, 0.36 * pwr);
      tone(f1 * 0.65, t + 0.115, 0.05, 0.16 * pwr, 'triangle', f1 * 0.48);
    } else if (id === 'metal-sheet') {
      // Rolling cinematic thunder sheet wobble!
      var dur = 0.95 + pwr * 0.55;
      makeNoise(t, dur, 'lowpass', 180 * pwr, 1.8, 0.72 * pwr, 48);
      makeNoise(t + 0.06, dur * 0.8, 'bandpass', 290, 4.5, 0.34 * pwr, 140);
      // Wobbling metallic plate shimmer
      var o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), g = ac.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(115, t); o.frequency.exponentialRampToValueAtTime(62, t + dur);
      lfo.frequency.value = 8 + pwr * 5; lg.gain.value = 34;
      lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.24 * pwr, t + 0.09); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); lfo.start(t); o.stop(t + dur + 0.04); lfo.stop(t + dur + 0.04);
    } else if (id === 'keys') {
      // Cluster of shimmering steel keys & knight chainmail jingle!
      var partials = [2450, 3120, 3890, 4620, 5410, 6280, 7150];
      for (var k = 0; k < partials.length; k++) {
        var dt = (k * 0.022) + Math.random() * 0.018;
        var freq = partials[k] * (0.94 + Math.random() * 0.12);
        tone(freq, t + dt, 0.14 + Math.random() * 0.12, 0.09 * pwr, 'sine');
      }
      makeNoise(t, 0.22, 'highpass', 3600, 1.2, 0.22 * pwr);
    } else if (id === 'lettuce') {
      // Crisp fresh leafy crunch bursts!
      for (var c = 0; c < 6; c++) {
        var ct = t + c * 0.045 + Math.random() * 0.02;
        makeNoise(ct, 0.055, 'bandpass', 2100 + Math.random() * 2400, 2.2, 0.42 * pwr);
      }
    } else if (id === 'book') {
      // Heavy medieval book slam / castle gate thump + paper slap!
      tone(128, t, 0.24, 0.62 * pwr, 'sine', 38);
      tone(210, t, 0.09, 0.30 * pwr, 'triangle', 68);
      makeNoise(t, 0.14, 'bandpass', 850, 1.4, 0.65 * pwr, 220);
      makeNoise(t, 0.06, 'highpass', 1900, 1.0, 0.35 * pwr);
    } else if (id === 'boots') {
      // Alternating heavy castle wooden-floor footsteps + gritty scuff!
      var bf = stepToggle ? 128 : 108;
      tone(bf, t, 0.18, 0.52 * pwr, 'sine', 42);
      makeNoise(t, 0.12, 'bandpass', 420 + stepToggle * 90, 2.6, 0.46 * pwr);
      makeNoise(t + 0.03, 0.11, 'highpass', 1400, 1.2, 0.22 * pwr);
    } else if (id === 'rainstick') {
      // Soft sparkling rain pour!
      makeNoise(t, 1.05, 'bandpass', 2800, 0.9, 0.32 * pwr, 1900);
      for (var r = 0; r < 9; r++) {
        var rt = t + 0.05 + r * 0.095 + Math.random() * 0.05;
        tone(1700 + Math.random() * 1900, rt, 0.045, 0.05 * pwr, 'sine', 1200);
      }
    } else if (id === 'chair') {
      // Expressive wooden creaky chair / haunted hinge squeak!
      var o1 = ac.createOscillator(), o2 = ac.createOscillator(), flt = ac.createBiquadFilter(), g1 = ac.createGain();
      o1.type = 'sawtooth'; o2.type = 'triangle';
      var base = stepToggle ? 370 : 420;
      o1.frequency.setValueAtTime(base, t);
      o1.frequency.linearRampToValueAtTime(base * 1.52, t + 0.22);
      o1.frequency.linearRampToValueAtTime(base * 1.12, t + 0.48);
      o2.frequency.setValueAtTime(base * 2.01, t);
      o2.frequency.linearRampToValueAtTime(base * 3.02, t + 0.22);
      o2.frequency.linearRampToValueAtTime(base * 2.22, t + 0.48);
      flt.type = 'bandpass'; flt.frequency.value = 980; flt.Q.value = 5.5;
      g1.gain.setValueAtTime(0.001, t);
      g1.gain.linearRampToValueAtTime(0.24 * pwr, t + 0.08);
      g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.54);
      o1.connect(flt); o2.connect(flt); flt.connect(g1); g1.connect(master);
      o1.start(t); o2.start(t); o1.stop(t + 0.56); o2.stop(t + 0.56);
    }
  }

  root.FoleyAudio = {
    playProp: playProp,
    clapper: function () {
      var ac = ensureAudio(); if (!ac || muted) return;
      var t = ac.currentTime;
      makeNoise(t, 0.055, 'bandpass', 1550, 3.2, 0.72);
      tone(680, t, 0.045, 0.25, 'triangle', 260);
    },
    correct: function () {
      var ac = ensureAudio(); if (!ac || muted) return;
      var t = ac.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone(f, t + i * 0.07, 0.24, 0.16, 'triangle');
        tone(f * 1.5, t + i * 0.07, 0.2, 0.07, 'sine');
      });
    },
    softFail: function () {
      var ac = ensureAudio(); if (!ac || muted) return;
      var t = ac.currentTime;
      tone(246.94, t, 0.18, 0.14, 'sine');
      tone(220.0, t + 0.12, 0.24, 0.14, 'sine');
    },
    fanfare: function () {
      var ac = ensureAudio(); if (!ac || muted) return;
      var t = ac.currentTime;
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
        tone(f, t + i * 0.085, 0.36, 0.18, 'triangle');
      });
    },
    speak: function (text) {
      try {
        if (muted || !root.speechSynthesis || !text) return;
        root.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(String(text).replace(/[🎬🥥⛈️🔑🥬📕🥾🌧️🪑🔊🎤⭐🏆]/g, ''));
        u.lang = 'en-US';
        u.rate = 0.88;
        u.pitch = 1.05;
        root.speechSynthesis.speak(u);
      } catch (e) {}
    },
    setMuted: function (m) {
      muted = !!m;
      if (master) master.gain.value = muted ? 0 : 0.92;
      if (muted && root.speechSynthesis) try { root.speechSynthesis.cancel(); } catch (e) {}
    },
    isMuted: function () { return muted; },
    getAnalyser: function () { return analyser; }
  };
})(window);
