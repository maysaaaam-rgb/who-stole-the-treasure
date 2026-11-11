/**
 * Grade 3 • Unit 5 Lesson 2: "Time Capsule Mission"
 * Web Audio API Polyphonic Sound Engine + Studio MP3s + Speech Synthesis
 */
(function () {
  'use strict';

  var ctx = null;
  var lastSpokenText = '';
  var audioCache = {};

  var MP3_MAP = {
    dig: 'sounds/g3_dig_shovel.mp3',
    rocket: 'sounds/g3_space_rocket.mp3',
    signal: 'sounds/g3_voyager_signal.mp3',
    waves: 'sounds/g3_sea_waves.mp3',
    whale: 'sounds/g3_whale_song.mp3',
    sparkle: 'sounds/g3_magic_sparkle.mp3'
  };

  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(function () {});
    }
    return ctx;
  }

  function playTone(freq, type, startTime, duration, peakGain) {
    var c = ensureCtx();
    if (!c) return;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain || 0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  function playCorrect() {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
      playTone(f, 'triangle', now + i * 0.07, 0.35, 0.2);
      playTone(f * 1.5, 'sine', now + i * 0.07, 0.26, 0.08);
    });
  }

  function playSoftFail() {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    playTone(246.94, 'sine', now, 0.25, 0.18);
    playTone(220.0, 'triangle', now + 0.15, 0.32, 0.16);
  }

  function playVictoryFanfare() {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    var notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    var times = [0, 0.11, 0.22, 0.34, 0.5, 0.64];
    notes.forEach(function (f, i) {
      playTone(f, 'triangle', now + times[i], 0.35, 0.22);
      playTone(f * 0.5, 'sine', now + times[i], 0.35, 0.12);
    });
  }

  function playSfx(name) {
    var src = MP3_MAP[name];
    if (src) {
      try {
        if (!audioCache[src]) audioCache[src] = new Audio(src);
        var a = audioCache[src];
        a.currentTime = 0;
        a.volume = 0.85;
        a.play().catch(function () { playCorrect(); });
        return;
      } catch (e) {}
    }
    playCorrect();
  }

  function speak(text) {
    if (!text) return;
    lastSpokenText = String(text);
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(lastSpokenText);
      u.lang = 'en-US';
      u.rate = 0.86;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function listenAgain() {
    if (lastSpokenText) speak(lastSpokenText);
  }

  function praise(isCorrect) {
    if (isCorrect) {
      playCorrect();
      var goods = ['Great job, space explorer!', 'Well done! Ready for the future!', 'Awesome work!'];
      speak(goods[Math.floor(Math.random() * goods.length)]);
    } else {
      playSoftFail();
      speak('Try again!');
    }
  }

  window.TCAudio = {
    playCorrect: playCorrect,
    playSoftFail: playSoftFail,
    playVictoryFanfare: playVictoryFanfare,
    playSfx: playSfx,
    speak: speak,
    listenAgain: listenAgain,
    praise: praise
  };
})();
