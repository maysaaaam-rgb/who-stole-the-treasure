/* Practice Island — Polyphonic Web Audio Synthesizer & TTS Bridge (island/js/audio.js)
   - Shares unified mute state & soft-limited AudioContext with Ch1Audio (island/js/core/audio.js)
   - Every sound effect is synthesized as a polyphonic dual-oscillator ADSR musical chord (AGENTS.md §1.3)
   - Zero white-noise static; delegates voice narration cleanly through Ch1Audio */
(function (root) {
  'use strict';

  var MUTE_KEY = 'eaa_island_muted';
  var LEGACY_MUTE_KEY = 'eaa_island_mute';
  var fallbackCtx = null;
  var muted = false;

  try {
    var a = localStorage.getItem(MUTE_KEY);
    var b = localStorage.getItem(LEGACY_MUTE_KEY);
    muted = (a === '1') || (a == null && b === '1');
  } catch (e) { muted = false; }

  function isMuted() {
    if (root.Ch1Audio && typeof root.Ch1Audio.isMuted === 'function') {
      return root.Ch1Audio.isMuted();
    }
    return muted;
  }

  function ensureCtx() {
    if (isMuted()) return null;
    if (root.Ch1Audio && typeof root.Ch1Audio._ensureCtx === 'function') {
      return root.Ch1Audio._ensureCtx();
    }
    if (!fallbackCtx) {
      fallbackCtx = root.__EAA_ISLAND_AUDIO_CTX || null;
      if (!fallbackCtx) {
        var AC = root.AudioContext || root.webkitAudioContext;
        if (AC) {
          try { fallbackCtx = new AC(); root.__EAA_ISLAND_AUDIO_CTX = fallbackCtx; } catch (e) { fallbackCtx = null; }
        }
      }
    }
    if (fallbackCtx && fallbackCtx.state === 'suspended') {
      try { fallbackCtx.resume(); } catch (e) { /* ignore */ }
    }
    return fallbackCtx;
  }

  function playNote(freq, startOffset, duration, peakGain, typeA, typeB, slideTo) {
    var c = ensureCtx();
    if (!c) return;
    var dest = c.__eaaOut || c.destination;
    try {
      var dur = duration || 0.28;
      var now = c.currentTime + (startOffset || 0);
      var osc1 = c.createOscillator();
      var osc2 = c.createOscillator();
      var gain = c.createGain();

      osc1.type = typeA || 'triangle';
      osc2.type = typeB || 'sine';
      osc1.frequency.setValueAtTime(Math.max(24, freq), now);
      osc2.frequency.setValueAtTime(Math.max(24, freq * 1.003), now);
      if (slideTo && slideTo > 20) {
        osc1.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
        osc2.frequency.exponentialRampToValueAtTime(slideTo * 1.003, now + dur);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peakGain || 0.13, now + Math.min(0.018, dur * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + dur + 0.025);
      osc2.stop(now + dur + 0.025);
    } catch (e) { /* ignore */ }
  }

  var localPool = {};
  function playReal(file, vol) {
    if (isMuted()) return;
    if (root.Ch1Audio && typeof root.Ch1Audio.playRealSfx === 'function') {
      root.Ch1Audio.playRealSfx(file, vol);
      return;
    }
    if (typeof Audio === 'undefined') return;
    try {
      var a = localPool[file] || (localPool[file] = new Audio('audio/sfx/' + file));
      a.volume = vol != null ? vol : 0.55;
      try { a.currentTime = 0; } catch (e) { /* ignore */ }
      var p = a.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) { /* ignore */ }
  }

  function playCorrect()  { playReal('correct.mp3', 0.62); }
  function playSoftFail() { playReal('try_again.mp3', 0.55); }
  function playTap()      { playReal('tap.mp3', 0.42); }
  function playFanfare()  { playReal('win.mp3', 0.68); }
  function playHop()      { playReal('hop.wav', 0.48); }
  function playChest()    { playReal('chest.mp3', 0.65); }
  function playLevelUp()  { playReal('win.mp3', 0.72); }
  function playStreak()   { playReal('correct.mp3', 0.65); }
  function playPop()      { playReal('tap.mp3', 0.48); }
  function playSparkle()  { playReal('chest.mp3', 0.58); }
  function playFirework() { playReal('cheer.mp3', 0.65); }
  function playBoing()    { playReal('hop.wav', 0.48); }
  function playEcho()     { playReal('chest.mp3', 0.45); }

  function stopSpeech() {
    if (root.Ch1Audio && typeof root.Ch1Audio.stopVoice === 'function') {
      root.Ch1Audio.stopVoice();
    } else if (root.speechSynthesis) {
      try { root.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }

  function speak(text, onEnd, who) {
    var done = typeof onEnd === 'function' ? onEnd : null;
    if (isMuted() || !text) {
      if (done) setTimeout(done, 180);
      return;
    }
    if (root.Ch1Audio && typeof root.Ch1Audio.speak === 'function') {
      root.Ch1Audio.speak(String(text), { who: who }, done);
      return;
    }
    if (done) setTimeout(done, 350);
  }

  function setMuted(val) {
    muted = !!val;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
      localStorage.setItem(LEGACY_MUTE_KEY, muted ? '1' : '0');
    } catch (e) { /* ignore */ }
    if (muted) stopAmbient();
    if (root.Ch1Audio && typeof root.Ch1Audio.setMuted === 'function' && root.Ch1Audio.isMuted() !== muted) {
      root.Ch1Audio.setMuted(muted);
    }
    return muted;
  }

  function toggleMute() {
    if (root.Ch1Audio && typeof root.Ch1Audio.toggleMute === 'function') {
      muted = root.Ch1Audio.toggleMute();
      if (muted) stopAmbient();
      return muted;
    }
    return setMuted(!isMuted());
  }

  /* Gentle background music-box melody during standalone missions (ducks on speech) */
  var ambient = null;
  var ZONE_MELODIES = {
    1: [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 523.25, 392.00],
    2: [392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 392.00],
    3: [440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 587.33, 440.00],
    4: [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25]
  };

  function startAmbient(zone) {
    stopAmbient();
    if (isMuted()) return;
    if (root.Ch1Audio && typeof root.Ch1Audio.stopAmbience === 'function') {
      root.Ch1Audio.stopAmbience();
    }
    var melody = ZONE_MELODIES[zone] || ZONE_MELODIES[1];
    var step = 0;
    var timer = setInterval(function () {
      if (isMuted() || (typeof document !== 'undefined' && document.visibilityState !== 'visible')) return;
      var speakingNow = ('speechSynthesis' in root && root.speechSynthesis.speaking);
      var gainLevel = speakingNow ? 0.006 : 0.022;
      var note = melody[step % melody.length];
      playNote(note, 0, 0.50, gainLevel, 'sine', 'triangle');
      if (step % 2 === 0) {
        playNote(note * 0.5, 0.02, 0.62, gainLevel * 0.6, 'sine', 'sine');
      }
      step++;
    }, 760);
    ambient = { timer: timer, zone: zone };
  }

  function stopAmbient() {
    if (!ambient) return;
    if (ambient.timer) clearInterval(ambient.timer);
    ambient = null;
    if (root.Ch1Audio && typeof root.Ch1Audio.startAmbience === 'function' && !isMuted()) {
      root.Ch1Audio.startAmbience();
    }
  }

  root.IslandAudio = {
    playBoing: playBoing,
    playEcho: playEcho,
    startAmbient: startAmbient,
    stopAmbient: stopAmbient,
    playCorrect: playCorrect,
    playSoftFail: playSoftFail,
    playWrong: playSoftFail, // Alias used by world-game.js
    playTap: playTap,
    playFanfare: playFanfare,
    playHop: playHop,
    playChest: playChest,
    playLevelUp: playLevelUp,
    playStreak: playStreak,
    playPop: playPop,
    playFirework: playFirework,
    playSparkle: playSparkle,
    speak: speak,
    stopSpeech: stopSpeech,
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMute: toggleMute,
    _syncMutedFromCore: function (m) { muted = !!m; if (muted && ambient) { clearInterval(ambient.timer); ambient = null; } }
  };
})(typeof window !== 'undefined' ? window : this);
