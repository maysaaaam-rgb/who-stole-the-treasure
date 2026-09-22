/**
 * ADVENTURE ACADEMY: MEME RULES AUDIO & SPEECH ENGINE
 * Zero-dependency Web Audio API synthesizer + calibrated Web Speech TTS
 */
(function(root) {
  'use strict';

  let audioCtx = null;
  let audioUnlocked = false;

  function initAudioContext() {
    if (audioUnlocked && audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        audioUnlocked = true;
      }
    } catch (e) {
      console.warn('[MemeAudio] Web Audio API initialization blocked or unsupported:', e);
    }
  }

  // Ensure first click unlocks audio context
  if (typeof window !== 'undefined') {
    window.addEventListener('click', initAudioContext, { once: true });
    window.addEventListener('touchstart', initAudioContext, { once: true });
  }

  const MemeAudio = {
    init: initAudioContext,

    // 1. Card Snap: High triangle-wave click (1200 Hz -> 300 Hz)
    playCardSnap: function() {
      initAudioContext();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {}
    },

    // 2. Correct Drop / XP: Rising dual-oscillator chime (B5 987.77 Hz to E6 1318.51 Hz)
    playCorrectChime: function() {
      initAudioContext();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;

        // Primary bell oscillator
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.22); // E6

        gain1.gain.setValueAtTime(0.28, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.45);

        // Harmonic shimmer oscillator
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1975.53, now + 0.08); // B6
        gain2.gain.setValueAtTime(0.12, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.35);
      } catch (e) {}
    },

    // 3. Soft Fail: Descending two-tone sine chime (246.94 Hz -> 220 Hz)
    playSoftFail: function() {
      initAudioContext();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(246.94, now); // B3
        osc.frequency.setValueAtTime(220.00, now + 0.16); // A3

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.setValueAtTime(0.2, now + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) {}
    },

    // 4. Badge Unlock Shimmer
    playBadgeUnlock: function() {
      initAudioContext();
      if (!audioCtx) return;
      try {
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = audioCtx.currentTime + (idx * 0.07);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.35);
        });
      } catch (e) {}
    },

    // 5. Victory Fanfare: Polyphonic major arpeggio
    playVictoryFanfare: function() {
      initAudioContext();
      if (!audioCtx) return;
      try {
        const notes = [
          { f: 523.25, t: 0 },    // C5
          { f: 659.25, t: 0.12 }, // E5
          { f: 783.99, t: 0.24 }, // G5
          { f: 1046.50, t: 0.38 },// C6
          { f: 1318.51, t: 0.54 } // E6
        ];
        notes.forEach(n => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const startTime = audioCtx.currentTime + n.t;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, startTime);

          gain.gain.setValueAtTime(0.24, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.6);
        });
      } catch (e) {}
    },

    // Web Speech API Wrapper for young ESL learners
    speakPhrase: function(text, onWordCallback, onEndCallback) {
      if (!window.speechSynthesis) {
        if (onEndCallback) onEndCallback();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.pitch = 1.05;
        utterance.rate = 0.88;

        if (onWordCallback) {
          utterance.onboundary = function(event) {
            if (event.name === 'word') {
              const charIndex = event.charIndex;
              onWordCallback(charIndex);
            }
          };
        }

        utterance.onend = function() {
          if (onEndCallback) onEndCallback();
        };

        utterance.onerror = function() {
          if (onEndCallback) onEndCallback();
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        if (onEndCallback) onEndCallback();
      }
    }
  };

  root.MemeAudio = MemeAudio;

})(typeof window !== 'undefined' ? window : global);
