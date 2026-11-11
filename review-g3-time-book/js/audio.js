/**
 * Grade 3 • Unit 5 Lesson 1: "The Time Book – Help Jannah!"
 * Web Audio API Polyphonic Sound Engine + Studio MP3s + Speech Synthesis
 */
(function () {
  'use strict';

  var ctx = null;
  var lastSpokenText = '';
  var audioCache = {};

  var MP3_MAP = {
    page_turn: 'sounds/g3_page_turn.mp3',
    portal: 'sounds/g3_time_portal.mp3',
    sparkle: 'sounds/g3_magic_sparkle.mp3',
    chariot: 'sounds/g3_chariot_horses.mp3',
    footsteps: 'sounds/g3_footsteps_run.mp3',
    gasp: 'sounds/g3_crowd_gasp.mp3'
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

  // Ascending C-Major pentatonic chord (C5 -> E5 -> G5 -> C6)
  function playCorrect() {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    var notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function (f, i) {
      playTone(f, 'triangle', now + i * 0.07, 0.36, 0.2);
      playTone(f * 1.5, 'sine', now + i * 0.07, 0.28, 0.08);
    });
  }

  // Warm descending two-tone sine chime (246.94 Hz -> 220 Hz)
  function playSoftFail() {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    playTone(246.94, 'sine', now, 0.26, 0.18);
    playTone(220.0, 'triangle', now + 0.15, 0.34, 0.16);
  }

  function playVictoryFanfare() {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    var seq = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    var times = [0, 0.11, 0.22, 0.34, 0.5, 0.64];
    seq.forEach(function (f, i) {
      playTone(f, 'triangle', now + times[i], 0.35, 0.22);
      playTone(f * 0.5, 'sine', now + times[i], 0.35, 0.12);
    });
  }

  function playSfx(name) {
    var src = MP3_MAP[name];
    if (src) {
      try {
        if (!audioCache[src]) {
          audioCache[src] = new Audio(src);
        }
        var a = audioCache[src];
        a.currentTime = 0;
        a.volume = 0.85;
        a.play().catch(function () { playSynthFallback(name); });
        return;
      } catch (e) {}
    }
    playSynthFallback(name);
  }

  function playSynthFallback(name) {
    var c = ensureCtx();
    if (!c) return;
    var now = c.currentTime;
    if (name === 'page_turn') {
      playTone(380, 'sine', now, 0.12, 0.1);
      playTone(540, 'triangle', now + 0.06, 0.14, 0.1);
    } else if (name === 'footsteps') {
      for (var i = 0; i < 4; i++) {
        playTone(140 + (i % 2) * 35, 'triangle', now + i * 0.14, 0.09, 0.2);
      }
    } else if (name === 'portal' || name === 'sparkle') {
      [587.33, 783.99, 987.77, 1174.66, 1567.98].forEach(function (f, idx) {
        playTone(f, 'sine', now + idx * 0.06, 0.3, 0.15);
      });
    } else if (name === 'fanfare') {
      playVictoryFanfare();
    } else {
      playCorrect();
    }
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
      var goods = ['Well done, time traveler!', 'Great job! You helped Jannah!', 'Awesome answer!'];
      speak(goods[Math.floor(Math.random() * goods.length)]);
    } else {
      playSoftFail();
      speak('Try again! Look closely at the story clue.');
    }
  }

  window.TBAudio = {
    playCorrect: playCorrect,
    playSoftFail: playSoftFail,
    playVictoryFanfare: playVictoryFanfare,
    playSfx: playSfx,
    speak: speak,
    listenAgain: listenAgain,
    praise: praise
  };
})();
