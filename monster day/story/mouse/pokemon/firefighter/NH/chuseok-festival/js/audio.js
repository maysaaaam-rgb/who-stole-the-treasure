/**
 * CHUSEOK FESTIVAL: KOREA'S HARVEST FESTIVAL
 * ElevenLabs v2-Calibrated Speech Narration & Procedural Web Audio Engine
 * Supports SSML-directed speech with real pause handling (<break time="..."/>),
 * exact character personas (Sarah, Marcus, Callum), and polyphonic acoustic synthesis.
 * Zero external audio file dependencies.
 */

(function(root) {
  'use strict';

  class ChuseokAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.hasUserInteracted = false;
      this.activeUtterances = [];

      const unlockAudio = () => {
        if (!this.hasUserInteracted) {
          this.hasUserInteracted = true;
          this.initContext();
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }
      };

      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true, passive: true });
      });
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return this.isMuted;
    }

    // 1. Correct / XP Pentatonic Ascending Chord (C5 -> E5 -> G5 -> C6)
    playCorrect() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    }

    // 2. Soft-Fail Warm Descending Sine Chime (246.94 Hz -> 220 Hz)
    playSoftFail() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(246.94, now);
      osc.frequency.linearRampToValueAtTime(220.00, now + 0.28);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    }

    // 3. Wooden Loom Shuttle Clack (Dual resonant click)
    playLoomClack() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [0, 0.09].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 380 : 310, now + offset);
        osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.06);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.24, now + offset + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    }

    // 4. Mystery Chest Unlock & Latch Creak
    playChestUnlock() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      [587.33, 880, 1174.66].forEach((f, i) => {
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(f, now + 0.08 + i * 0.05);

        cGain.gain.setValueAtTime(0.001, now + 0.08 + i * 0.05);
        cGain.gain.linearRampToValueAtTime(0.15, now + 0.1 + i * 0.05);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + i * 0.05);

        chime.connect(cGain);
        cGain.connect(this.ctx.destination);
        chime.start(now + 0.08 + i * 0.05);
        chime.stop(now + 0.5 + i * 0.05);
      });
    }

    // 5. Traditional Korean Janggu Drum Thud
    playJangguDrum(isHigh = false) {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = isHigh ? 220 : 130;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isHigh ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.65, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    }

    // 6. Royal Gong Sound Effect (for Callum King monologue)
    playGong() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const gong = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      gong.type = 'sine';
      gong.frequency.setValueAtTime(146.83, now); // D3
      gong.frequency.linearRampToValueAtTime(138.59, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      gong.connect(gain);
      gain.connect(this.ctx.destination);
      gong.start(now);
      gong.stop(now + 2.05);
    }

    // 7. Resonant Harvest Victory Fanfare
    playVictoryFanfare() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      this.playGong();
      const now = this.ctx.currentTime;
      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      melody.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.2 + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + 0.2 + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.22 + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 0.2 + idx * 0.12);
        osc.stop(now + 0.65 + idx * 0.12);
      });
    }

    // 8. Human-Grade ElevenLabs v2 SSML Speech Dispatcher
    speakSSML(ssmlScript, persona = 'sarah') {
      if (this.isMuted || !window.speechSynthesis) return;

      this.stopSpeech();

      // If Callum Monarch, trigger royal gong first
      const lower = String(persona || '').toLowerCase();
      if (lower.includes('callum') || lower.includes('king') || lower.includes('monarch')) {
        this.playGong();
      }

      // Parse SSML chunks (segments and break pauses)
      const segments = this.parseSSMLToSegments(ssmlScript);
      this.speakSegmentsSequence(segments, persona);
    }

    parseSSMLToSegments(ssml) {
      const regex = /<break\s+time=["'](\d+)(ms|s)["']\s*\/?>/gi;
      let raw = ssml
        .replace(/<speak>/gi, '')
        .replace(/<\/speak>/gi, '')
        .replace(/<prosody[^>]*>/gi, '')
        .replace(/<\/prosody>/gi, '')
        .replace(/<emphasis[^>]*>/gi, '')
        .replace(/<\/emphasis>/gi, '');

      const segments = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(raw)) !== null) {
        const textBefore = raw.substring(lastIndex, match.index).trim();
        if (textBefore) {
          segments.push({ type: 'text', content: textBefore });
        }
        const val = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        const pauseMs = unit === 's' ? val * 1000 : val;
        segments.push({ type: 'pause', duration: Math.min(pauseMs, 2000) });
        lastIndex = match.index + match[0].length;
      }

      const remaining = raw.substring(lastIndex).trim();
      if (remaining) {
        segments.push({ type: 'text', content: remaining });
      }

      return segments.length > 0 ? segments : [{ type: 'text', content: raw.replace(/<[^>]+>/g, '').trim() }];
    }

    speakSegmentsSequence(segments, persona) {
      if (!segments || segments.length === 0) return;

      let idx = 0;

      const processNext = () => {
        if (this.isMuted || idx >= segments.length) return;
        const seg = segments[idx++];

        if (seg.type === 'pause') {
          setTimeout(processNext, seg.duration || 300);
        } else if (seg.type === 'text') {
          const utterance = new SpeechSynthesisUtterance(seg.content);
          utterance.lang = 'en-US';

          const lower = String(persona || '').toLowerCase();
          if (lower.includes('callum') || lower.includes('king') || lower.includes('monarch')) {
            utterance.rate = 0.82;
            utterance.pitch = 0.78; // Deep resonant monarch
          } else if (lower.includes('marcus') || lower.includes('game')) {
            utterance.rate = 0.98;
            utterance.pitch = 1.0; // Energetic conversational narrator
          } else {
            // Sarah default (warm maternal educator)
            utterance.rate = 0.88;
            utterance.pitch = 1.05;
          }

          utterance.onend = () => {
            processNext();
          };

          utterance.onerror = () => {
            processNext();
          };

          window.speechSynthesis.speak(utterance);
        }
      };

      processNext();
    }

    stopSpeech() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }

  root.ChuseokAudio = new ChuseokAudio();
})(typeof window !== 'undefined' ? window : global);
