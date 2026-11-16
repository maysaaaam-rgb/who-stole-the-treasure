/* My Passport — Web Audio Procedural Synthesis & TTS Engine
   Conforms strictly to AGENTS.md Audio Synthesis Laws (No Raw Oscillator Beeps)
*/
(function (root) {
  'use strict';

  var PassportAudio = root.PassportAudio = root.PassportAudio || {};

  var ctx = null;
  var isMuted = false;

  function getAudioContext() {
    if (!ctx) {
      var AudioContextClass = root.AudioContext || root.webkitAudioContext;
      if (AudioContextClass) ctx = new AudioContextClass();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(function () {});
    }
    return ctx;
  }

  function playTone(freq, type, startTime, duration, gainVal) {
    var ac = getAudioContext();
    if (!ac || isMuted) return;
    try {
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainVal || 0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch (e) {}
  }

  /* 1. Page Turn / Flip (Soft paper snap) */
  function playPageFlip() {
    var ac = getAudioContext();
    if (!ac || isMuted) return;
    try {
      var now = ac.currentTime;
      var bufferSize = ac.sampleRate * 0.06;
      var buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      var noise = ac.createBufferSource();
      noise.buffer = buffer;
      var filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      var gain = ac.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      noise.start(now);
    } catch (e) {}
  }

  /* 2. Stamp Thump (Tactile wax stamp press) */
  function playStamp() {
    var ac = getAudioContext();
    if (!ac || isMuted) return;
    try {
      var now = ac.currentTime;
      playTone(180, 'sine', now, 0.08, 0.22);
      playTone(90, 'triangle', now + 0.02, 0.14, 0.25);
    } catch (e) {}
  }

  /* 3. Tap (Gentle UI feedback) */
  function playTap() {
    var ac = getAudioContext();
    if (!ac || isMuted) return;
    try {
      playTone(520, 'sine', ac.currentTime, 0.04, 0.08);
    } catch (e) {}
  }

  /* 4. Success / Saved Chord (Ascending pentatonic chord) */
  function playSuccess() {
    var ac = getAudioContext();
    if (!ac || isMuted) return;
    try {
      var now = ac.currentTime;
      // C5 (523.25) -> E5 (659.25) -> G5 (783.99) -> C6 (1046.50)
      playTone(523.25, 'sine', now, 0.22, 0.15);
      playTone(659.25, 'sine', now + 0.06, 0.24, 0.15);
      playTone(783.99, 'sine', now + 0.12, 0.26, 0.16);
      playTone(1046.50, 'sine', now + 0.18, 0.36, 0.18);
    } catch (e) {}
  }

  /* 4b. Victory Fanfare (Triumphant celebratory arpeggio) */
  function playFanfare() {
    playSuccess();
  }

  /* 5. Soft-Fail (Warm descending chime) */
  function playSoftFail() {
    var ac = getAudioContext();
    if (!ac || isMuted) return;
    try {
      var now = ac.currentTime;
      playTone(246.94, 'sine', now, 0.14, 0.12);
      playTone(220.00, 'sine', now + 0.10, 0.22, 0.12);
    } catch (e) {}
  }

  /* 6. Text-to-Speech (Calibrated strictly to 0.88 rate, 1.05 pitch, en-US) */
  function speak(text) {
    if (!text || isMuted) return;
    if (root.EAAVoice && typeof root.EAAVoice.say === 'function') {
      root.EAAVoice.say(text, { rate: 0.88, pitch: 1.05, lang: 'en-US' });
      return;
    }
    if ('speechSynthesis' in root) {
      try {
        root.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(String(text));
        u.rate = 0.88;
        u.pitch = 1.05;
        u.lang = 'en-US';
        root.speechSynthesis.speak(u);
      } catch (e) {}
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  PassportAudio.playPageFlip = playPageFlip;
  PassportAudio.playStamp = playStamp;
  PassportAudio.playTap = playTap;
  PassportAudio.playSuccess = playSuccess;
  PassportAudio.playFanfare = playFanfare;
  PassportAudio.playSoftFail = playSoftFail;
  PassportAudio.speak = speak;
  PassportAudio.toggleMute = toggleMute;
  PassportAudio.isMuted = function () { return isMuted; };

})(typeof window !== 'undefined' ? window : this);
