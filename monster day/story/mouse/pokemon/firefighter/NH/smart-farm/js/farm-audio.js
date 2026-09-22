/**
 * THE SMART FARM — ZERO-DEPENDENCY AUDIO & SPEECH SYNTHESIZER
 * Web Audio API procedural sound engine + Calibrated Web Speech API
 */
(function(root) {
  'use strict';

  let audioCtx = null;
  let audioUnlocked = false;

  function initAudio() {
    if (audioUnlocked && audioCtx) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        audioUnlocked = true;
      }
    } catch (e) {
      console.warn('[FarmAudio] Web Audio initialization deferred:', e);
    }
  }

  // Ensure first click unlocks audio context
  if (typeof window !== 'undefined') {
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
  }

  const FarmAudio = {
    init: initAudio,

    // 1. Tactile Button Tap (Chunky high-pitched blip)
    playTap: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } catch (e) {}
    },

    // 2. Dramatic System Failure (Sparks & Power Down Hum)
    playSystemFailure: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;

        // Descending power-down tone
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.9);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.9);

        // Electric spark crackle
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (!audioCtx) return;
            const sparkOsc = audioCtx.createOscillator();
            const sparkGain = audioCtx.createGain();
            const t = audioCtx.currentTime;
            sparkOsc.type = 'square';
            sparkOsc.frequency.setValueAtTime(1200 + Math.random() * 800, t);
            sparkGain.gain.setValueAtTime(0.25, t);
            sparkGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
            sparkOsc.connect(sparkGain);
            sparkGain.connect(audioCtx.destination);
            sparkOsc.start(t);
            sparkOsc.stop(t + 0.08);
          }, i * 180);
        }
      } catch (e) {}
    },

    // 3. Friendly Robot Chirp (Cute dual-sine R2/Wall-E chirp)
    playRobotChirp: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const notes = [659.25, 880, 1174.66]; // E5 -> A5 -> D6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = now + (idx * 0.07);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.09);
        });
      } catch (e) {}
    },

    // 4. Pipe Rotate / Valve Click
    playPipeTurn: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'square';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {}
    },

    // 5. Water Flow Splash & Bubble
    playWaterFlow: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const t = audioCtx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(500 + Math.random() * 500, t);
            osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 400, t + 0.12);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.12);
          }, i * 90);
        }
      } catch (e) {}
    },

    // 6. Friendly Cow Moo (Harmonic Formant)
    playCowMoo: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(165, now + 0.35);
        osc.frequency.linearRampToValueAtTime(130, now + 0.85);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.85);
      } catch (e) {}
    },

    // 7. Cheerful Chicken Cluck
    playChickenCluck: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        [0, 120, 220].forEach((delayMs, idx) => {
          setTimeout(() => {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const t = audioCtx.currentTime;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600 + (idx * 60), t);
            osc.frequency.exponentialRampToValueAtTime(250, t + 0.08);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.08);
          }, delayMs);
        });
      } catch (e) {}
    },

    // 8. Servo Step / Robot Rolling Whirr
    playRobotServo: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.12);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } catch (e) {}
    },

    // 9. Box Pick Up / Set Down
    playBoxThud: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    },

    // 10. Inventor Machine Build Snap / Power Up
    playPartEquipped: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        chords.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = now + (idx * 0.05);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.28);
        });
      } catch (e) {}
    },

    // 11. Mission Victory Fanfare
    playVictoryFanfare: function() {
      initAudio();
      if (!audioCtx) return;
      try {
        const notes = [
          { f: 523.25, d: 0.14 }, // C5
          { f: 659.25, d: 0.14 }, // E5
          { f: 783.99, d: 0.14 }, // G5
          { f: 1046.50, d: 0.45 } // C6
        ];
        let offset = audioCtx.currentTime;
        notes.forEach(n => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.f, offset);

          gain.gain.setValueAtTime(0.3, offset);
          gain.gain.exponentialRampToValueAtTime(0.01, offset + n.d);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(offset);
          osc.stop(offset + n.d);

          offset += (n.d * 0.85);
        });
      } catch (e) {}
    },

    // --- CALIBRATED WEB SPEECH ENGINE ---
    speakPhrase: function(text, onBoundary, onEnd) {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (onEnd) setTimeout(onEnd, 1000);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.86;  // calibrated for young ESL learners
      utterance.pitch = 1.08; // friendly upbeat pitch

      // Try selecting a friendly, high-quality English voice
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const bestVoice = voices.find(v => 
          v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny'))
        ) || voices.find(v => v.lang.startsWith('en'));
        if (bestVoice) utterance.voice = bestVoice;
      }

      if (onBoundary) {
        utterance.onboundary = function(e) {
          if (e.name === 'word') {
            onBoundary(e.charIndex);
          }
        };
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  root.FarmAudio = FarmAudio;

})(typeof window !== 'undefined' ? window : global);
