/* Courtside to Curtain Call 3D — Full 3-Zone Studio Voiceover & Stadium/Park/Theatre SFX Engine
 * Plays 65 real neural studio MP3 clips from assets/audio/vo/*.mp3 (zero robotic browser TTS!)
 * Plus layered Web Audio SFX: referee trill whistle, basketball dribble, net swish, rim clank,
 * express train steam chug + brass whistle, wooden track drop, magic anomaly zap, velvet curtain swoosh,
 * theatre applause & standing ovation, and zone-adaptive toggleable BGM!
 */
(function (root) {
  'use strict';

  var ctx = null;
  var masterMuted = false;
  var bgmOn = true;
  var slowMode = false;
  var currentZone = 1;
  var activeVoiceEl = null;
  var voiceCache = {};
  var bgmTimer = null;
  var bgmStep = 0;

  function ensureCtx() {
    if (masterMuted) return null;
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

  function unlock() {
    ensureCtx();
    if (bgmOn && !bgmTimer && !masterMuted) startBgm();
  }

  function setZone(z) {
    currentZone = z || 1;
  }

  function playVoice(id, opts) {
    opts = opts || {};
    if (masterMuted || !id) return;
    stopVoice();
    var src = 'assets/audio/vo/' + id + '.mp3';
    var el = voiceCache[id];
    if (!el) {
      el = new Audio(src);
      el.preload = 'auto';
      voiceCache[id] = el;
    }
    try {
      el.currentTime = 0;
      el.playbackRate = (opts.slow || slowMode) ? 0.78 : 1.0;
      el.volume = opts.volume != null ? opts.volume : 1.0;
      activeVoiceEl = el;
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  function stopVoice() {
    if (activeVoiceEl) {
      try { activeVoiceEl.pause(); activeVoiceEl.currentTime = 0; } catch (e) {}
      activeVoiceEl = null;
    }
  }

  function playCheer(kind) {
    var picks = (kind === 'theatre')
      ? ['cheer_theatre_1', 'cheer_theatre_2']
      : (kind === 'train' ? ['cheer_train', 'cheer_2'] : ['cheer_1', 'cheer_2', 'cheer_3']);
    playVoice(picks[Math.floor(Math.random() * picks.length)]);
  }

  function playTry() {
    var picks = ['try_1', 'try_2'];
    playVoice(picks[Math.floor(Math.random() * picks.length)]);
  }

  function tone(freq, startOffset, dur, gainPeak, typeA, typeB) {
    var c = ensureCtx();
    if (!c) return;
    var t0 = c.currentTime + (startOffset || 0);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainPeak || 0.14, t0 + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    g.connect(c.destination);

    var o1 = c.createOscillator();
    o1.type = typeA || 'triangle';
    o1.frequency.setValueAtTime(freq, t0);
    o1.connect(g);
    o1.start(t0);
    o1.stop(t0 + dur + 0.02);

    if (typeB) {
      var o2 = c.createOscillator();
      o2.type = typeB;
      o2.frequency.setValueAtTime(freq * 1.003, t0);
      var g2 = c.createGain();
      g2.gain.value = 0.42;
      o2.connect(g2);
      g2.connect(g);
      o2.start(t0);
      o2.stop(t0 + dur + 0.02);
    }
  }

  function noiseBurst(startOffset, dur, filterFreq, q, gainPeak, filterType) {
    var c = ensureCtx();
    if (!c) return;
    var t0 = c.currentTime + (startOffset || 0);
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);

    var src = c.createBufferSource();
    src.buffer = buf;

    var flt = c.createBiquadFilter();
    flt.type = filterType || 'bandpass';
    flt.frequency.setValueAtTime(filterFreq || 1800, t0);
    flt.Q.value = q || 1.2;

    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainPeak || 0.14, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(flt);
    flt.connect(g);
    g.connect(c.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  function sfxWhistle() {
    var c = ensureCtx();
    if (!c) return;
    var t0 = c.currentTime;
    var o = c.createOscillator();
    var lfo = c.createOscillator();
    var lfoG = c.createGain();
    var g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(2680, t0);
    o.frequency.linearRampToValueAtTime(2820, t0 + 0.12);
    lfo.frequency.setValueAtTime(36, t0);
    lfoG.gain.setValueAtTime(110, t0);
    lfo.connect(lfoG);
    lfoG.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.11, t0 + 0.02);
    g.gain.setValueAtTime(0.10, t0 + 0.24);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.34);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0); lfo.start(t0);
    o.stop(t0 + 0.36); lfo.stop(t0 + 0.36);
  }

  function sfxShoot() {
    noiseBurst(0, 0.18, 1200, 0.9, 0.12, 'bandpass');
    tone(330, 0, 0.12, 0.07, 'triangle', 'sine');
    tone(440, 0.05, 0.12, 0.07, 'triangle', 'sine');
  }

  function sfxSwish() {
    noiseBurst(0.0, 0.26, 2600, 1.1, 0.22, 'bandpass');
    noiseBurst(0.04, 0.22, 4200, 0.9, 0.14, 'highpass');
    tone(523.25, 0.02, 0.32, 0.14, 'triangle', 'sine');
    tone(659.25, 0.10, 0.32, 0.14, 'triangle', 'sine');
    tone(783.99, 0.18, 0.36, 0.15, 'triangle', 'sine');
    tone(1046.50, 0.26, 0.55, 0.16, 'triangle', 'sine');
    noiseBurst(0.12, 0.72, 1150, 0.65, 0.13, 'bandpass');
  }

  function sfxRimOut() {
    tone(290, 0, 0.12, 0.14, 'triangle', null);
    noiseBurst(0, 0.07, 1300, 2.2, 0.11, 'bandpass');
    tone(246.94, 0.14, 0.24, 0.11, 'sine', 'triangle');
    tone(220.00, 0.30, 0.34, 0.11, 'sine', 'triangle');
  }

  function sfxTap() {
    tone(587.33, 0, 0.09, 0.09, 'triangle', 'sine');
    noiseBurst(0, 0.025, 1900, 1.5, 0.04, 'bandpass');
  }

  // Zone 2: Warm wooden railway tie drop + cheerful Festival Express steam whistle
  function sfxTrackDrop() {
    tone(196, 0, 0.11, 0.15, 'triangle', 'sine');
    tone(392, 0.03, 0.12, 0.09, 'sine', null);
    noiseBurst(0, 0.05, 850, 1.4, 0.09, 'bandpass');
  }

  function sfxTrainChug() {
    // Cheerful two-note brass chord whistle ("Choo-Choo!")
    tone(523.25, 0.00, 0.24, 0.11, 'triangle', 'sine');
    tone(659.25, 0.00, 0.24, 0.10, 'triangle', 'sine');
    tone(523.25, 0.28, 0.36, 0.12, 'triangle', 'sine');
    tone(659.25, 0.28, 0.36, 0.11, 'triangle', 'sine');
    // Soft rhythmic steam puffs
    noiseBurst(0.06, 0.14, 1400, 0.9, 0.10, 'bandpass');
    noiseBurst(0.24, 0.14, 1400, 0.9, 0.10, 'bandpass');
    noiseBurst(0.42, 0.14, 1400, 0.9, 0.10, 'bandpass');
    noiseBurst(0.60, 0.18, 1600, 0.8, 0.11, 'bandpass');
  }

  function sfxMagicZap() {
    var arp = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
    for (var i = 0; i < arp.length; i++) {
      tone(arp[i], i * 0.055, 0.28, 0.12, 'sine', 'triangle');
    }
    noiseBurst(0.08, 0.24, 3400, 1.0, 0.08, 'highpass');
  }

  // Zone 3: Velvet Curtain Swoosh + Timpani Roll + Warm Theatre Applause
  function sfxCurtainUp() {
    noiseBurst(0.0, 0.55, 950, 0.7, 0.16, 'bandpass');
    tone(146.83, 0.05, 0.35, 0.12, 'sine', 'triangle');
    tone(220.00, 0.16, 0.38, 0.11, 'sine', 'triangle');
    tone(523.25, 0.30, 0.55, 0.13, 'triangle', 'sine');
    tone(659.25, 0.38, 0.55, 0.13, 'triangle', 'sine');
    tone(783.99, 0.46, 0.65, 0.14, 'triangle', 'sine');
  }

  function sfxApplause() {
    noiseBurst(0.00, 0.85, 1300, 0.6, 0.14, 'bandpass');
    noiseBurst(0.18, 0.90, 1900, 0.7, 0.11, 'bandpass');
    noiseBurst(0.36, 0.85, 1100, 0.6, 0.12, 'bandpass');
    tone(523.25, 0.04, 0.30, 0.12, 'triangle', 'sine');
    tone(659.25, 0.12, 0.30, 0.12, 'triangle', 'sine');
    tone(783.99, 0.20, 0.34, 0.13, 'triangle', 'sine');
    tone(1046.50, 0.28, 0.55, 0.15, 'triangle', 'sine');
  }

  function sfxFanfare() {
    var notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5, 1318.5];
    var times = [0.0, 0.11, 0.22, 0.34, 0.50, 0.62, 0.78];
    for (var i = 0; i < notes.length; i++) {
      tone(notes[i], times[i], i === notes.length - 1 ? 0.95 : 0.26, 0.15, 'triangle', 'sine');
    }
    noiseBurst(0.20, 1.5, 1250, 0.6, 0.15, 'bandpass');
    noiseBurst(0.45, 1.4, 1850, 0.7, 0.12, 'bandpass');
  }

  // Zone-adaptive subtle BGM melodies (Zone 1 Court / Zone 2 Park / Zone 3 Theatre Waltz)
  var MELODIES = {
    1: [523.25, 0, 659.25, 783.99, 0, 659.25, 587.33, 0, 523.25, 0, 587.33, 659.25, 783.99, 0, 659.25, 0],
    2: [392.00, 440.00, 493.88, 0, 523.25, 0, 587.33, 523.25, 493.88, 0, 440.00, 392.00, 523.25, 0, 440.00, 0],
    3: [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 523.25, 659.25, 880.00, 783.99, 659.25, 587.33]
  };
  var BASSES = {
    1: [130.81, 0, 0, 130.81, 164.81, 0, 196.00, 0, 174.61, 0, 0, 174.61, 196.00, 0, 146.83, 0],
    2: [196.00, 0, 146.83, 0, 130.81, 0, 196.00, 0, 164.81, 0, 146.83, 0, 130.81, 0, 196.00, 0],
    3: [130.81, 0, 0, 196.00, 0, 0, 174.61, 0, 0, 196.00, 0, 0]
  };

  function startBgm() {
    if (bgmTimer || masterMuted || !bgmOn) return;
    bgmTimer = setInterval(function () {
      if (masterMuted || !bgmOn || !ctx || ctx.state !== 'running') return;
      var mel = MELODIES[currentZone] || MELODIES[1];
      var bas = BASSES[currentZone] || BASSES[1];
      var m = mel[bgmStep % mel.length];
      var b = bas[bgmStep % bas.length];
      if (m) tone(m, 0, 0.18, 0.024, 'triangle', null);
      if (b) tone(b, 0, 0.24, 0.030, 'sine', null);
      bgmStep++;
    }, 250);
  }

  function stopBgm() {
    if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
  }

  function toggleMute() {
    masterMuted = !masterMuted;
    if (masterMuted) { stopVoice(); stopBgm(); }
    else { ensureCtx(); if (bgmOn) startBgm(); }
    return masterMuted;
  }

  function toggleBgm() {
    bgmOn = !bgmOn;
    if (bgmOn && !masterMuted) { ensureCtx(); startBgm(); }
    else stopBgm();
    return bgmOn;
  }

  function toggleSlow() {
    slowMode = !slowMode;
    return slowMode;
  }

  root.CTC3D_AUDIO = {
    unlock: unlock,
    setZone: setZone,
    playVoice: playVoice,
    stopVoice: stopVoice,
    playCheer: playCheer,
    playTry: playTry,
    sfxWhistle: sfxWhistle,
    sfxShoot: sfxShoot,
    sfxSwish: sfxSwish,
    sfxRimOut: sfxRimOut,
    sfxTap: sfxTap,
    sfxTrackDrop: sfxTrackDrop,
    sfxTrainChug: sfxTrainChug,
    sfxMagicZap: sfxMagicZap,
    sfxCurtainUp: sfxCurtainUp,
    sfxApplause: sfxApplause,
    sfxFanfare: sfxFanfare,
    toggleMute: toggleMute,
    toggleBgm: toggleBgm,
    toggleSlow: toggleSlow
  };
})(window);
