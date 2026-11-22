/* Speaking Quiz Studio — Polyphonic Web Audio Synthesis + Calibrated TTS (AGENTS.md §1.3) */
(function (root) {
  'use strict';

  var ctx = null;
  function getCtx() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }

  function note(freq, startOffset, dur, vol, type) {
    var ac = getCtx();
    if (!ac) return;
    var t = ac.currentTime + startOffset;
    var o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
    o1.type = type || 'triangle';
    o2.type = 'sine';
    o1.frequency.setValueAtTime(freq, t);
    o2.frequency.setValueAtTime(freq * 1.5, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol || 0.12, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o1.connect(g); o2.connect(g); g.connect(ac.destination);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.02); o2.stop(t + dur + 0.02);
  }

  root.SpeakingQuizAudio = {
    tap: function () { note(523.25, 0, 0.09, 0.07, 'sine'); },
    score2: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(f, i * 0.065, 0.24, 0.11, 'triangle'); });
    },
    score1: function () {
      note(440, 0, 0.16, 0.09, 'triangle');
      note(523.25, 0.08, 0.22, 0.09, 'sine');
    },
    score0: function () {
      // Warm gentle soft-fail chime (never a harsh buzzer!)
      note(246.94, 0, 0.18, 0.08, 'sine');
      note(220.0, 0.11, 0.24, 0.08, 'sine');
    },
    celebrate: function () {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { note(f, i * 0.075, 0.34, 0.12, 'triangle'); });
    },
    speak: function (text) {
      try {
        if (!root.speechSynthesis || !text) return;
        root.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(String(text).replace(/[🎤🔊💡👁⭐🎯]/g, ''));
        u.lang = 'en-US';
        u.rate = 0.88;
        u.pitch = 1.05;
        root.speechSynthesis.speak(u);
      } catch (e) {}
    }
  };
})(window);
