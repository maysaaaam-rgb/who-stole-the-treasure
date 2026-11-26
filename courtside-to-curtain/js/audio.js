/* courtside-to-curtain/js/audio.js
 * AudioEngine — Polyphonic Web Audio SFX, Soft Toggleable Zone BGM, and Calibrated ESL TTS (0.88x + 🐢 0.7x)
 * Strictly complies with AGENTS.md §1.3 (zero raw oscillator beeps, warm soft-fail chime, autoplay guarded).
 */
(function (root) {
  'use strict';

  var ctx = null;
  var sfxMuted = false;
  var bgmMuted = true; // Gentle default OFF until toggled ON (or user taps Music), never interrupts teacher!
  var slowMode = false;
  var currentZone = 1;
  var bgmTimer = null;
  var bgmStep = 0;

  function ensureCtx() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) {}
    }
    return ctx;
  }

  /* Polyphonic dual-oscillator musical note with smooth ADSR */
  function note(freq, offset, dur, peak, type1) {
    if (sfxMuted) return;
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime + (offset || 0);
    var d = dur || 0.28;
    var p = peak || 0.14;

    var o1 = c.createOscillator();
    var o2 = c.createOscillator();
    var lp = c.createBiquadFilter();
    var g2 = c.createGain();
    var g = c.createGain();

    o1.type = type1 || 'triangle';
    o2.type = 'sine';
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 2, now);
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2400, now);
    g2.gain.setValueAtTime(0.24, now);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(p, now + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0001, now + d);

    o1.connect(lp);
    o2.connect(g2);
    g2.connect(lp);
    lp.connect(g);
    g.connect(c.destination);

    o1.start(now); o2.start(now);
    o1.stop(now + d + 0.04); o2.stop(now + d + 0.04);
  }

  function noise(dur, cutoff, peak, band) {
    if (sfxMuted) return;
    var c = ensureCtx();
    if (!c) return;
    var len = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, len, c.sampleRate);
    var arr = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      arr[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.34));
    }
    var src = c.createBufferSource();
    src.buffer = buf;
    var flt = c.createBiquadFilter();
    flt.type = band ? 'bandpass' : 'lowpass';
    flt.frequency.value = cutoff || 900;
    var g = c.createGain();
    g.gain.value = peak || 0.18;
    src.connect(flt); flt.connect(g); g.connect(c.destination);
    src.start();
  }

  /* Required Procedural SFX Library */
  function playSfx(name) {
    if (sfxMuted) return;
    switch (name) {
      case 'sfx_chime':
        // Ascending C-Major pentatonic chord (C5 -> E5 -> G5 -> C6)
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
          note(f, i * 0.055, 0.36, 0.13);
        });
        break;
      case 'sfx_boing':
        // Zero-shame warm descending two-tone sine chime (246.94 Hz -> 220 Hz)
        note(246.94, 0, 0.22, 0.13, 'sine');
        note(220.00, 0.15, 0.30, 0.13, 'sine');
        break;
      case 'sfx_whistle':
        // Friendly musical referee trill (soft sine/triangle, never harsh)
        note(1567.98, 0, 0.12, 0.09, 'sine');
        note(1760.00, 0.06, 0.12, 0.09, 'sine');
        note(1567.98, 0.13, 0.18, 0.10, 'sine');
        break;
      case 'sfx_swish':
        // Basketball net swish + court bounce + bright chord
        noise(0.16, 1600, 0.15, true);
        note(523.25, 0.04, 0.22, 0.11);
        note(783.99, 0.10, 0.28, 0.13);
        note(1046.5, 0.16, 0.36, 0.13);
        break;
      case 'sfx_page_turn':
        // Soft paper swoosh
        noise(0.14, 1200, 0.12, false);
        note(440, 0.02, 0.12, 0.06, 'sine');
        break;
      case 'sfx_train':
        // Playful storybook train chug + gentle chord stop
        noise(0.12, 520, 0.12, false);
        noise(0.12, 520, 0.12, false);
        note(392.00, 0.05, 0.24, 0.11);
        note(493.88, 0.05, 0.24, 0.09);
        note(329.63, 0.30, 0.36, 0.11);
        break;
      case 'sfx_curtain':
        // Velvet curtain swoosh + warm orchestral swell
        noise(0.28, 800, 0.12, false);
        [261.63, 329.63, 392.00, 523.25].forEach(function (f, i) {
          note(f, 0.06 + i * 0.07, 0.55, 0.11);
        });
        break;
      case 'sfx_applause':
        // Warm theatre audience clapping + fanfare chord
        for (var k = 0; k < 6; k++) {
          (function (idx) {
            setTimeout(function () { noise(0.14, 1400 + idx * 90, 0.11, true); }, idx * 95);
          })(k);
        }
        [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach(function (f, i) {
          note(f, i * 0.08, 0.52, 0.13);
        });
        break;
      default:
        note(587.33, 0, 0.16, 0.09);
    }
  }

  /* Gentle Background Music Sequencer (Zone 1-2 upbeat pluck, Zone 3 soft waltz) */
  var BGM_COURT = [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 783.99, 880.00];
  var BGM_STAGE = [392.00, 493.88, 587.33, 523.25, 440.00, 523.25, 659.25, 587.33];

  function tickBgm() {
    if (bgmMuted) return;
    var c = ensureCtx();
    if (!c) return;
    var seq = currentZone === 3 ? BGM_STAGE : BGM_COURT;
    var f = seq[bgmStep % seq.length];
    bgmStep++;
    var now = c.currentTime;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.032, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    o.connect(g); g.connect(c.destination);
    o.start(now); o.stop(now + 0.46);
  }

  function startBgm() {
    stopBgm();
    bgmMuted = false;
    tickBgm();
    bgmTimer = setInterval(tickBgm, currentZone === 3 ? 520 : 420);
  }

  function stopBgm() {
    bgmMuted = true;
    if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
  }

  function setZone(z) {
    currentZone = z || 1;
    if (!bgmMuted) startBgm();
  }

  /* Spoken Pronunciation (Web Speech API calibrated to 0.88x or Slow Turtle 0.7x) */
  var lastSpoken = '';
  function speak(text, onStart, onEnd) {
    if (!text) return;
    lastSpoken = String(text);
    if (!root.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }
    try {
      root.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(lastSpoken);
      u.lang = 'en-US';
      u.rate = slowMode ? 0.68 : 0.88;
      u.pitch = 1.05;
      u.onstart = function () { if (onStart) onStart(); };
      u.onend = function () { if (onEnd) onEnd(); };
      u.onerror = function () { if (onEnd) onEnd(); };
      root.speechSynthesis.speak(u);
    } catch (e) {
      if (onEnd) onEnd();
    }
  }

  root.AudioEngine = {
    playSfx: playSfx,
    speak: speak,
    replay: function (onStart, onEnd) { if (lastSpoken) speak(lastSpoken, onStart, onEnd); },
    isSfxMuted: function () { return sfxMuted; },
    toggleSfx: function () { sfxMuted = !sfxMuted; return sfxMuted; },
    isBgmMuted: function () { return bgmMuted; },
    toggleBgm: function () { if (bgmMuted) startBgm(); else stopBgm(); return bgmMuted; },
    isSlow: function () { return slowMode; },
    toggleSlow: function () { slowMode = !slowMode; return slowMode; },
    setZone: setZone
  };
})(window);
