/* build-the-bridge/js/audio.js
 * Polyphonic Web Audio API synthesis (zero raw oscillator beeps) + Calibrated TTS
 * Includes rising wooden plank slams, creaking tension ticks, big cartoon water splash, and victory fanfare.
 */
(function (root) {
  'use strict';

  var ctx = null;
  var muted = false;

  function ensureCtx() {
    if (muted) return null;
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) { /* ignore */ }
    }
    return ctx;
  }

  function playNote(freq, startOffset, duration, gainPeak) {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime + (startOffset || 0);
    var dur = duration || 0.28;
    var peak = gainPeak || 0.16;

    var osc1 = c.createOscillator();
    var osc2 = c.createOscillator();
    var g = c.createGain();
    var lp = c.createBiquadFilter();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2400, now);

    var g2 = c.createGain();
    g2.gain.setValueAtTime(0.26, now);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.016);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc1.connect(lp);
    osc2.connect(g2);
    g2.connect(lp);
    lp.connect(g);
    g.connect(c.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + dur + 0.04);
    osc2.stop(now + dur + 0.04);
  }

  function playNoiseBurst(dur, cutoff, peak, band) {
    var c = ensureCtx();
    if (!c) return;
    var len = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.32));
    }
    var src = c.createBufferSource();
    src.buffer = buf;
    var filt = c.createBiquadFilter();
    filt.type = band ? 'bandpass' : 'lowpass';
    filt.frequency.value = cutoff || 560;
    var g = c.createGain();
    g.gain.value = peak || 0.22;
    src.connect(filt);
    filt.connect(g);
    g.connect(c.destination);
    src.start();
  }

  var PLANK_CHORDS = [
    [523.25, 659.25],                   // Plank 1: C5 + E5
    [587.33, 783.99],                   // Plank 2: D5 + G5
    [659.25, 880.00],                   // Plank 3: E5 + A5
    [523.25, 659.25, 783.99, 1046.50],  // Plank 4: Bridge Locked!
    [659.25, 783.99, 1046.50, 1318.51]  // Plank 5: Golden Super Bridge!
  ];

  function plankSlam(step) {
    if (muted) return;
    playNoiseBurst(0.10, 480, 0.28, false);
    var idx = Math.max(0, Math.min(PLANK_CHORDS.length - 1, (step || 1) - 1));
    PLANK_CHORDS[idx].forEach(function (f, i) {
      playNote(f, i * 0.04, step >= 4 ? 0.44 : 0.24, 0.14);
    });
  }

  /* Soft wooden creak tick as bridge starts shaking */
  function creakTick(urgent) {
    if (muted) return;
    playNoiseBurst(0.05, urgent ? 920 : 620, urgent ? 0.16 : 0.10, true);
    playNote(urgent ? 392.0 : 311.13, 0, 0.09, urgent ? 0.10 : 0.07);
  }

  /* Comical snap + BIG cartoon water splash + friendly warm descending chime (zero shame!) */
  function bigSplash() {
    if (muted) return;
    // Wooden crack snap
    playNoiseBurst(0.09, 1100, 0.24, true);
    // Warm soft-fail descending chime (246.94 -> 220 Hz)
    playNote(246.94, 0.05, 0.22, 0.13);
    playNote(220.00, 0.18, 0.28, 0.13);
    // Splash whoosh + rising cartoon bubbles!
    setTimeout(function () {
      playNoiseBurst(0.36, 900, 0.24, false);
      [290, 390, 340, 490, 420, 580].forEach(function (f, i) {
        playNote(f, i * 0.05, 0.13, 0.10);
      });
    }, 240);
  }

  /* Victory fanfare when crossing to Treasure Island */
  function crossVictory(isSuper) {
    if (muted) return;
    var seq = isSuper
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]
      : [523.25, 659.25, 783.99, 1046.50];
    seq.forEach(function (f, i) {
      playNote(f, i * 0.085, 0.48, 0.15);
    });
  }

  function cardFlip() {
    if (muted) return;
    playNoiseBurst(0.07, 720, 0.16, false);
    playNote(440, 0.02, 0.14, 0.09);
  }

  function speak(text) {
    if (!root.speechSynthesis || !text) return;
    try {
      root.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'en-US';
      u.rate = 0.88;
      u.pitch = 1.05;
      root.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  root.BridgeAudio = {
    isMuted: function () { return muted; },
    setMuted: function (v) { muted = !!v; if (muted && root.speechSynthesis) { try { root.speechSynthesis.cancel(); } catch (e) {} } },
    plankSlam: plankSlam,
    creakTick: creakTick,
    bigSplash: bigSplash,
    crossVictory: crossVictory,
    cardFlip: cardFlip,
    speak: speak
  };
})(window);
